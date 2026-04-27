import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import styles from "./hero.module.css";

// ─── Location Data ────────────────────────────────────────────────────────────
const LA_CENTER = { lat: 34.0522, lng: -118.2437 };
const SF_CENTER = { lat: 37.7749, lng: -122.4194 };
const OC_CENTER = { lat: 33.7175, lng: -117.8311 };

const LA_BOUNDS = { latMin: 33.7, latMax: 34.35, lngMin: -118.7, lngMax: -117.65 };
const SF_BOUNDS = { latMin: 37.45, latMax: 38.05, lngMin: -122.65, lngMax: -121.85 };
const OC_BOUNDS = { latMin: 33.4, latMax: 34.0, lngMin: -118.1, lngMax: -117.4 };

function generatePoints(count, bounds) {
  const pts = [];
  for (let i = 0; i < count; i++) {
    pts.push({
      lat: bounds.latMin + Math.random() * (bounds.latMax - bounds.latMin),
      lng: bounds.lngMin + Math.random() * (bounds.lngMax - bounds.lngMin),
    });
  }
  return pts;
}

const LA_POINTS = generatePoints(4500, LA_BOUNDS);
const SF_POINTS = generatePoints(3000, SF_BOUNDS);
const OC_POINTS = generatePoints(2500, OC_BOUNDS);

// ─── Geo Utils ────────────────────────────────────────────────────────────────
function latLngToSphere(lat, lng, radius = 1) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

function latLngToFlat(lat, lng, center, scale = 80) {
  const x = (lng - center.lng) * scale * Math.cos(center.lat * Math.PI / 180);
  const y = (lat - center.lat) * scale;
  return new THREE.Vector3(x, y, 0);
}

// ─── Scroll Sections ──────────────────────────────────────────────────────────
const SECTIONS = [
  { id: "globe",   title: "Tenant Improvement Experts",        subtitle: "Transforming spaces across California",                               progress: [0, 0.15] },
  { id: "zoom",    title: "From Coast to Coast",               subtitle: "Serving communities throughout the Golden State",                    progress: [0.15, 0.35] },
  { id: "la",      title: "Los Angeles",                       subtitle: `4,500+ completed projects across the Greater LA area`,               progress: [0.35, 0.55] },
  { id: "sf",      title: "San Francisco Bay Area",            subtitle: `3,000+ transformations in the Bay Area`,                            progress: [0.55, 0.75] },
  { id: "oc",      title: "Orange County",                     subtitle: `2,500+ improvements across OC`,                                     progress: [0.75, 1.0] },
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function Hero() {
  const mountRef = useRef(null);
  const scrollRef = useRef(null);
  const sceneRef = useRef({});
  const [activeSection, setActiveSection] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    // ── Renderer ────────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x10172b, 1);
    renderer.shadowMap.enabled = true;
    mountRef.current.appendChild(renderer.domElement);

    // ── Scene & Camera ───────────────────────────────────────────────────────
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.01, 1000);
    camera.position.set(0, 0, 3.2);

    // ── Lighting ─────────────────────────────────────────────────────────────
    const ambient = new THREE.AmbientLight(0x1a2a5e, 1.2);
    scene.add(ambient);

    const sunLight = new THREE.DirectionalLight(0x5577ff, 2.5);
    sunLight.position.set(5, 3, 5);
    scene.add(sunLight);

    const rimLight = new THREE.DirectionalLight(0x3366ff, 1.0);
    rimLight.position.set(-4, -2, -3);
    scene.add(rimLight);

    const glowLight = new THREE.PointLight(0x4488ff, 2.0, 8);
    glowLight.position.set(0, 0, 2);
    scene.add(glowLight);

    // ── Stars Background ──────────────────────────────────────────────────────
    const starGeo = new THREE.BufferGeometry();
    const starCount = 8000;
    const starPositions = new Float32Array(starCount * 3);
    const starSizes = new Float32Array(starCount);
    for (let i = 0; i < starCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 80 + Math.random() * 40;
      starPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      starPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      starPositions[i * 3 + 2] = r * Math.cos(phi);
      starSizes[i] = Math.random() * 1.5 + 0.3;
    }
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
    starGeo.setAttribute("size", new THREE.BufferAttribute(starSizes, 1));
    const starMat = new THREE.PointsMaterial({
      color: 0xaaccff,
      sizeAttenuation: true,
      size: 0.15,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // ── Globe ─────────────────────────────────────────────────────────────────
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // Ocean sphere
    const oceanGeo = new THREE.SphereGeometry(1.0, 128, 128);
    const oceanMat = new THREE.MeshPhongMaterial({
      color: 0x0a1628,
      emissive: 0x0a1040,
      emissiveIntensity: 0.4,
      shininess: 60,
      transparent: true,
      opacity: 0.95,
    });
    const ocean = new THREE.Mesh(oceanGeo, oceanMat);
    globeGroup.add(ocean);

    // Atmosphere glow
    const atmGeo = new THREE.SphereGeometry(1.05, 64, 64);
    const atmMat = new THREE.ShaderMaterial({
      uniforms: { glowColor: { value: new THREE.Color(0x2244aa) } },
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 glowColor;
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.7 - dot(vNormal, vec3(0,0,1.0)), 3.0);
          gl_FragColor = vec4(glowColor, intensity * 0.9);
        }
      `,
      side: THREE.FrontSide,
      blending: THREE.AdditiveBlending,
      transparent: true,
      depthWrite: false,
    });
    globeGroup.add(new THREE.Mesh(atmGeo, atmMat));

    // Grid lines on globe
    const gridMat = new THREE.LineBasicMaterial({
      color: 0x1a3a7a,
      transparent: true,
      opacity: 0.25,
      blending: THREE.AdditiveBlending,
    });
    for (let lat = -80; lat <= 80; lat += 20) {
      const pts = [];
      for (let lng = 0; lng <= 360; lng += 3) {
        pts.push(latLngToSphere(lat, lng - 180, 1.005));
      }
      globeGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), gridMat));
    }
    for (let lng = -180; lng <= 180; lng += 20) {
      const pts = [];
      for (let lat = -90; lat <= 90; lat += 3) {
        pts.push(latLngToSphere(lat, lng, 1.005));
      }
      globeGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), gridMat));
    }

    // Continent dots
    const landPositions = [];
    for (let lat = -80; lat <= 80; lat += 1.2) {
      for (let lng = -180; lng <= 180; lng += 1.2) {
        if (isLand(lat, lng)) {
          const p = latLngToSphere(lat, lng, 1.008);
          landPositions.push(p.x, p.y, p.z);
        }
      }
    }
    const landGeo = new THREE.BufferGeometry();
    landGeo.setAttribute("position", new THREE.Float32BufferAttribute(landPositions, 3));
    const landMat = new THREE.PointsMaterial({
      color: 0x3a6aff,
      size: 0.006,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const landPoints = new THREE.Points(landGeo, landMat);
    globeGroup.add(landPoints);

    // ── Map Planes ────────────────────────────────────────────────────────────
    function makeMapPlane(pts, color, pulseColor) {
      const group = new THREE.Group();
      group.visible = false;

      // Background map plane
      const planeGeo = new THREE.PlaneGeometry(12, 10);
      const planeMat = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          baseColor: { value: new THREE.Color(0x050d1e) },
        },
        vertexShader: `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
        fragmentShader: `
          uniform float time;
          uniform vec3 baseColor;
          varying vec2 vUv;
          void main() {
            float grid = 0.0;
            float lx = abs(sin(vUv.x * 30.0 + time * 0.1)) * 0.05;
            float ly = abs(sin(vUv.y * 30.0 + time * 0.1)) * 0.05;
            grid = lx + ly;
            vec3 col = baseColor + vec3(0.05, 0.1, 0.25) * grid;
            float vignette = 1.0 - length(vUv - 0.5) * 1.5;
            gl_FragColor = vec4(col * vignette, 0.92);
          }
        `,
        transparent: true,
        side: THREE.DoubleSide,
      });
      group.add(new THREE.Mesh(planeGeo, planeMat));

      // Project points
      const center = pts === LA_POINTS ? LA_CENTER : pts === SF_POINTS ? SF_CENTER : OC_CENTER;
      const positions = [];
      const colors = [];
      const sizes = [];
      const c1 = new THREE.Color(color);
      const c2 = new THREE.Color(pulseColor);

      pts.forEach((pt, i) => {
        const p = latLngToFlat(pt.lat, pt.lng, center, 0.045);
        positions.push(p.x, p.y, 0.01);
        const t = Math.random();
        colors.push(c1.r + (c2.r - c1.r) * t, c1.g + (c2.g - c1.g) * t, c1.b + (c2.b - c1.b) * t);
        sizes.push(Math.random() * 0.8 + 0.3);
      });

      const ptGeo = new THREE.BufferGeometry();
      ptGeo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
      ptGeo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
      ptGeo.setAttribute("size", new THREE.Float32BufferAttribute(sizes, 1));

      const ptMat = new THREE.ShaderMaterial({
        uniforms: { time: { value: 0 }, opacity: { value: 0 } },
        vertexShader: `
          attribute float size;
          attribute vec3 color;
          varying vec3 vColor;
          uniform float time;
          void main() {
            vColor = color;
            vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = size * (300.0 / -mvPos.z);
            gl_Position = projectionMatrix * mvPos;
          }
        `,
        fragmentShader: `
          varying vec3 vColor;
          uniform float opacity;
          uniform float time;
          void main() {
            float d = length(gl_PointCoord - vec2(0.5));
            if (d > 0.5) discard;
            float glow = 1.0 - d * 2.0;
            gl_FragColor = vec4(vColor * (1.0 + glow * 0.5), glow * opacity);
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        vertexColors: true,
      });

      const pointCloud = new THREE.Points(ptGeo, ptMat);
      group.add(pointCloud);
      group.userData = { ptMat, planeMat };
      return group;
    }

    const laMap = makeMapPlane(LA_POINTS, 0x3399ff, 0xffffff);
    const sfMap = makeMapPlane(SF_POINTS, 0x44ffcc, 0x88ffff);
    const ocMap = makeMapPlane(OC_POINTS, 0xff8844, 0xffcc44);
    scene.add(laMap);
    scene.add(sfMap);
    scene.add(ocMap);

    // ── Interactive Particles ─────────────────────────────────────────────────
    const bgParticleCount = 600;
    const bgPositions = new Float32Array(bgParticleCount * 3);
    const bgVelocities = [];
    for (let i = 0; i < bgParticleCount; i++) {
      bgPositions[i * 3] = (Math.random() - 0.5) * 20;
      bgPositions[i * 3 + 1] = (Math.random() - 0.5) * 14;
      bgPositions[i * 3 + 2] = (Math.random() - 0.5) * 5 - 2;
      bgVelocities.push(
        (Math.random() - 0.5) * 0.003,
        (Math.random() - 0.5) * 0.003,
        0
      );
    }
    const bgGeo = new THREE.BufferGeometry();
    bgGeo.setAttribute("position", new THREE.BufferAttribute(bgPositions, 3));
    const bgMat = new THREE.PointsMaterial({
      color: 0x2255cc,
      size: 0.04,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const bgParticles = new THREE.Points(bgGeo, bgMat);
    scene.add(bgParticles);

    // ── Mouse Interactivity ───────────────────────────────────────────────────
    const mouse = new THREE.Vector2();
    const targetRotation = new THREE.Vector2();
    let mouseX = 0, mouseY = 0;

    const onMouseMove = (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = -(e.clientY / window.innerHeight - 0.5) * 2;
      mouse.set(e.clientX / window.innerWidth * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1);
    };
    window.addEventListener("mousemove", onMouseMove);

    // ── Scroll Handler ────────────────────────────────────────────────────────
    let currentProgress = 0;
    const totalHeight = el.scrollHeight - window.innerHeight;

    const onScroll = () => {
      currentProgress = el.scrollTop / totalHeight;
      setScrollProgress(currentProgress);

      for (let i = 0; i < SECTIONS.length; i++) {
        const s = SECTIONS[i];
        if (currentProgress >= s.progress[0] && currentProgress < s.progress[1]) {
          setActiveSection(i);
          break;
        }
      }
    };
    el.addEventListener("scroll", onScroll);

    // ── Camera Targets ────────────────────────────────────────────────────────
    const cameraTargets = {
      globe: { pos: new THREE.Vector3(0, 0, 3.2), lookAt: new THREE.Vector3(0, 0, 0) },
      usa: { pos: new THREE.Vector3(-0.3, 0.5, 2.2), lookAt: new THREE.Vector3(-0.3, 0.5, 0) },
      la: { pos: new THREE.Vector3(0, 0, 5.5), lookAt: new THREE.Vector3(0, 0, 0) },
      sf: { pos: new THREE.Vector3(0, 0, 5.5), lookAt: new THREE.Vector3(0, 0, 0) },
      oc: { pos: new THREE.Vector3(0, 0, 5.5), lookAt: new THREE.Vector3(0, 0, 0) },
    };

    // ── Animate ───────────────────────────────────────────────────────────────
    let frameId;
    let t = 0;

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      t += 0.01;

      // Smooth mouse follow
      targetRotation.x += (mouseY * 0.15 - targetRotation.x) * 0.05;
      targetRotation.y += (mouseX * 0.15 - targetRotation.y) * 0.05;

      const p = currentProgress;

      // ── Phase transitions ──
      if (p < 0.15) {
        // Globe idle spin
        const norm = p / 0.15;
        globeGroup.visible = true;
        laMap.visible = false; sfMap.visible = false; ocMap.visible = false;
        globeGroup.rotation.y = -t * 0.12 + targetRotation.y;
        globeGroup.rotation.x = targetRotation.x * 0.3;
        camera.position.lerp(cameraTargets.globe.pos, 0.04);
        ocean.material.opacity = 1;

      } else if (p < 0.35) {
        // Zoom into USA / California
        const norm = (p - 0.15) / 0.2;
        globeGroup.visible = true;
        laMap.visible = false; sfMap.visible = false; ocMap.visible = false;

        // Rotate globe to face USA
        const targetRotY = -2.1; // Pacific side
        globeGroup.rotation.y += (targetRotY - globeGroup.rotation.y) * 0.03;
        globeGroup.rotation.x += (-0.3 - globeGroup.rotation.x) * 0.03;

        const zoomPos = new THREE.Vector3(
          cameraTargets.globe.pos.x + (cameraTargets.usa.pos.x - cameraTargets.globe.pos.x) * norm,
          cameraTargets.globe.pos.y + (cameraTargets.usa.pos.y - cameraTargets.globe.pos.y) * norm,
          cameraTargets.globe.pos.z + (cameraTargets.usa.pos.z - cameraTargets.globe.pos.z) * norm
        );
        camera.position.lerp(zoomPos, 0.04);

        // Fade out globe near end
        if (norm > 0.75) {
          ocean.material.opacity = THREE.MathUtils.lerp(0.95, 0, (norm - 0.75) / 0.25);
          landMat.opacity = THREE.MathUtils.lerp(0.7, 0, (norm - 0.75) / 0.25);
        } else {
          ocean.material.opacity = 0.95;
          landMat.opacity = 0.7;
        }

      } else if (p < 0.55) {
        // LA Map
        const norm = Math.min(1, (p - 0.35) / 0.1);
        globeGroup.visible = false;
        laMap.visible = true; sfMap.visible = false; ocMap.visible = false;

        camera.position.lerp(cameraTargets.la.pos, 0.04);
        laMap.userData.ptMat.uniforms.opacity.value = THREE.MathUtils.lerp(
          laMap.userData.ptMat.uniforms.opacity.value, norm, 0.06
        );
        laMap.userData.ptMat.uniforms.time.value = t;
        laMap.userData.planeMat.uniforms.time.value = t;
        laMap.rotation.set(mouseY * 0.05, mouseX * 0.05, 0);

      } else if (p < 0.75) {
        // SF Map
        const norm = Math.min(1, (p - 0.55) / 0.1);
        globeGroup.visible = false;
        laMap.visible = false; sfMap.visible = true; ocMap.visible = false;

        camera.position.lerp(cameraTargets.sf.pos, 0.04);
        sfMap.userData.ptMat.uniforms.opacity.value = THREE.MathUtils.lerp(
          sfMap.userData.ptMat.uniforms.opacity.value, norm, 0.06
        );
        sfMap.userData.ptMat.uniforms.time.value = t;
        sfMap.userData.planeMat.uniforms.time.value = t;
        sfMap.rotation.set(mouseY * 0.05, mouseX * 0.05, 0);

      } else {
        // OC Map
        const norm = Math.min(1, (p - 0.75) / 0.1);
        globeGroup.visible = false;
        laMap.visible = false; sfMap.visible = false; ocMap.visible = true;

        camera.position.lerp(cameraTargets.oc.pos, 0.04);
        ocMap.userData.ptMat.uniforms.opacity.value = THREE.MathUtils.lerp(
          ocMap.userData.ptMat.uniforms.opacity.value, norm, 0.06
        );
        ocMap.userData.ptMat.uniforms.time.value = t;
        ocMap.userData.planeMat.uniforms.time.value = t;
        ocMap.rotation.set(mouseY * 0.05, mouseX * 0.05, 0);
      }

      // Animate bg particles
      const pos = bgGeo.attributes.position.array;
      for (let i = 0; i < bgParticleCount; i++) {
        pos[i * 3] += bgVelocities[i * 3];
        pos[i * 3 + 1] += bgVelocities[i * 3 + 1];
        if (Math.abs(pos[i * 3]) > 10) bgVelocities[i * 3] *= -1;
        if (Math.abs(pos[i * 3 + 1]) > 7) bgVelocities[i * 3 + 1] *= -1;
      }
      bgGeo.attributes.position.needsUpdate = true;

      stars.rotation.y = t * 0.002;

      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    };

    sceneRef.current = { renderer, scene, camera };
    animate();
    setLoaded(true);

    // ── Resize ─────────────────────────────────────────────────────────────────
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      el.removeEventListener("scroll", onScroll);
      renderer.dispose();
      if (mountRef.current && renderer.domElement.parentNode === mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  const section = SECTIONS[activeSection];

  return (
    <div className={styles.heroWrapper} ref={scrollRef}>
      {/* Fixed 3D canvas */}
      <div ref={mountRef} className={styles.canvasMount} />

      {/* Scroll content */}
      <div className={styles.scrollContent}>
        {/* Title overlay — always visible */}
        <div className={`${styles.textOverlay} ${loaded ? styles.textVisible : ""}`}>
          <div className={styles.eyebrow}>Tenant Improvements</div>
          <h1 className={styles.heroTitle} key={section.id}>
            {section.title}
          </h1>
          <p className={styles.heroSub} key={section.id + "_sub"}>
            {section.subtitle}
          </p>
        </div>

        {/* Scroll sections (invisible, just for scroll height) */}
        {SECTIONS.map((s) => (
          <div key={s.id} className={styles.scrollSection} />
        ))}
      </div>

      {/* Scroll indicator */}
      {scrollProgress < 0.05 && (
        <div className={styles.scrollIndicator}>
          <span>Scroll to explore</span>
          <div className={styles.scrollChevrons}>
            <div className={styles.chevron} />
            <div className={styles.chevron} />
            <div className={styles.chevron} />
          </div>
        </div>
      )}

      {/* Progress bar */}
      <div className={styles.progressBar}>
        <div
          className={styles.progressFill}
          style={{ width: `${scrollProgress * 100}%` }}
        />
      </div>

      {/* Section dots */}
      <nav className={styles.sectionDots}>
        {SECTIONS.map((s, i) => (
          <button
            key={s.id}
            className={`${styles.dot} ${activeSection === i ? styles.dotActive : ""}`}
            onClick={() => {
              const el = scrollRef.current;
              const total = el.scrollHeight - window.innerHeight;
              const mid = (s.progress[0] + s.progress[1]) / 2;
              el.scrollTo({ top: mid * total, behavior: "smooth" });
            }}
            aria-label={s.title}
          />
        ))}
      </nav>

      {/* Stats bar for map sections */}
      {activeSection >= 2 && (
        <div className={styles.statsBar}>
          {activeSection === 2 && (
            <>
              <div className={styles.stat}><span className={styles.statNum}>4,500+</span><span className={styles.statLabel}>Projects</span></div>
              <div className={styles.stat}><span className={styles.statNum}>LA</span><span className={styles.statLabel}>Los Angeles</span></div>
              <div className={styles.stat}><span className={styles.statNum}>Since 2005</span><span className={styles.statLabel}>In Business</span></div>
            </>
          )}
          {activeSection === 3 && (
            <>
              <div className={styles.stat}><span className={styles.statNum}>3,000+</span><span className={styles.statLabel}>Projects</span></div>
              <div className={styles.stat}><span className={styles.statNum}>SF</span><span className={styles.statLabel}>Bay Area</span></div>
              <div className={styles.stat}><span className={styles.statNum}>Top Rated</span><span className={styles.statLabel}>Contractor</span></div>
            </>
          )}
          {activeSection === 4 && (
            <>
              <div className={styles.stat}><span className={styles.statNum}>2,500+</span><span className={styles.statLabel}>Projects</span></div>
              <div className={styles.stat}><span className={styles.statNum}>OC</span><span className={styles.statLabel}>Orange County</span></div>
              <div className={styles.stat}><span className={styles.statNum}>Licensed</span><span className={styles.statLabel}>& Bonded</span></div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ── Simplified land mask (approximate) ────────────────────────────────────────
function isLand(lat, lng) {
  // North America
  if (lng > -170 && lng < -50 && lat > 15 && lat < 75) {
    if (lng > -130 && lng < -60 && lat > 25 && lat < 70) return true;
    if (lng > -120 && lng < -80 && lat > 15 && lat < 30) return true;
  }
  // South America
  if (lng > -82 && lng < -34 && lat > -56 && lat < 13) return true;
  // Europe
  if (lng > -10 && lng < 40 && lat > 36 && lat < 71) return true;
  // Africa
  if (lng > -18 && lng < 52 && lat > -35 && lat < 37) return true;
  // Asia
  if (lng > 25 && lng < 145 && lat > 5 && lat < 75) return true;
  if (lng > 68 && lng < 145 && lat > -10 && lat < 55) return true;
  // Australia
  if (lng > 114 && lng < 154 && lat > -40 && lat < -10) return true;
  // Greenland
  if (lng > -58 && lng < -18 && lat > 60 && lat < 84) return true;

  // Exclude water bodies (rough)
  // Remove middle of Atlantic
  if (lng > -55 && lng < -10 && lat > 0 && lat < 60) return false;
  // Remove middle of Pacific
  if (lng > 170 || lng < -130) {
    if (lat > -50 && lat < 60) return false;
  }

  return false;
}
