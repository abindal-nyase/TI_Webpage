import { useRef } from 'react'
import { useIsomorphicLayoutEffect as useLayoutEffect } from '../../hooks/useIsomorphicLayoutEffect'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import s from './Hero4.module.css'

gsap.registerPlugin(ScrollTrigger)

// ── Intro config ───────────────────────────────────────────────────────────
const INTRO_DURATION = 1600   // settle-into-rest before the cascade
const TEXT_EXIT      = 1100
const CASCADE_OFFSET = 900

// ── Timeline tuning ────────────────────────────────────────────────────────
const LAYER_DUR = 2400
const LAYER_GAP = 0
const BG2_DUR   = 8200
const BG2_REST  = '-90vh'

// Provisional first-paint scale before the building is measured (see below).
const NATURAL_W = 1024

// iOS Safari: window.innerHeight changes when the toolbar collapses.
// visualViewport.height is the stable visible content height.
const getVH = () =>
  window.visualViewport ? window.visualViewport.height : window.innerHeight;

const LAYERS = [
  { id: 1, base: '/nya-img/i1.png',  hover: '/nya-img/i1I.png' },
  { id: 2, base: '/nya-img/i2.png',  hover: '/nya-img/i2I.png' },
  { id: 3, base: '/nya-img/i3.png',  hover: '/nya-img/i3I.png' },
  { id: 4, base: '/nya-img/i4.png',  hover: '/nya-img/i4I.png' },
  { id: 5, base: '/nya-img/i5.png',  hover: '/nya-img/i5I.png' },
  { id: 6, base: '/nya-img/i6.png',  hover: '/nya-img/i6I.png' },
  { id: 7, base: '/nya-img/i7.png',  hover: '/nya-img/i7I.png' },
  { id: 8, base: '/nya-img/i8.png',  hover: '/nya-img/i8I.png' },
]

export default function Hero4() {
  const sectionRef     = useRef(null);
  const triggerRef     = useRef(null);
  const movehomeRef    = useRef(null);
  const titleRef       = useRef(null);
  const headerRef      = useRef(null);
  const layerRefs      = useRef([]);
  const bg1ImgRef      = useRef(null);
  const bg2ImgRef      = useRef(null);
  const bg2BackingRef  = useRef(null);
  const exitOverlayRef = useRef(null);
  const mmRef          = useRef(null);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mmRef.current = mm;

    // saveStyles prevents inline-style bleed when context reverts across breakpoints
    ScrollTrigger.saveStyles([
      movehomeRef.current,
      titleRef.current,
      headerRef.current,
      bg1ImgRef.current,
      bg2ImgRef.current,
      exitOverlayRef.current,
      ...layerRefs.current,
    ]);

    mm.add(
      {
        isDesktop: '(min-width: 1024px)',
        isTablet:  '(min-width: 768px) and (max-width: 1023px)',
        isMobile:  '(min-width: 480px) and (max-width: 767px)',
        isTiny:    '(max-width: 479px)',
      },
      (context) => {
        const { isDesktop, isTablet, isMobile, isTiny } = context.conditions;

        const mh = movehomeRef.current;
        const [l1, l2, l3, l4, l5, l6, l7, l8] = layerRefs.current;
        const baseImgs = layerRefs.current
          .map((l) => l && l.querySelector('img'))
          .filter(Boolean);

        // Provisional scale so first paint isn't full-size before measurement.
        gsap.set(mh, {
          scale: Math.max(0.28, Math.min(1, window.innerWidth / NATURAL_W)),
          transformOrigin: 'top left',
        });

        // Vertical layer spacing must track building WIDTH, not viewport
        // height. The building scales with viewport width, so the gaps between
        // layers must too — otherwise on portrait aspects (tall viewport,
        // narrow building) vh-based gaps balloon and the layers explode into
        // floating slices. Express every offset in vw and let the parent
        // `scale` shrink them proportionally.
        //
        // Verbatim Paveletsky values were authored at desktop 1440x900, mixing
        // vh and vw. Convert the vh ones to vw at that aspect (900/1440 =
        // 0.625) so desktop renders pixel-identical to the original.
        gsap.set(l2, { top: 16.025 + 'vw' }); // 25.64vh
        gsap.set(l3, { top: 3.7    + 'vw' }); // already vw
        gsap.set(l4, { top: 1.25   + 'vw' }); // 2vh
        gsap.set(l5, { top: 2.0    + 'vw' }); // 3.2vh
        gsap.set(l6, { top: 11.4375 + 'vw' }); // 18.3vh
        gsap.set(l7, { top: 20.625 + 'vw' }); // 33vh
        gsap.set(l8, { top: 9.9125 + 'vw' }); // 15.86vh

        // ── Bottom-centre anchor ─────────────────────────────────────────
        // Matches paveletsky.org: the assembled building sits stacked at the
        // BOTTOM-CENTRE of the viewport (ground floor near the bottom edge,
        // roof up top, title above it), then layers fly up one-by-one on
        // scroll. Because every layer offset/width is now in vw, the building
        // is a rigid unit that already fills the same fraction of the viewport
        // width at any size — so no per-axis contain-fit is needed; a single
        // uniform SCALE holds the proportions identical on every device, and
        // we only translate to centre horizontally + anchor to the bottom.
        // Measured live so invalidateOnRefresh + a refreshInit recompute keep
        // it correct across resize / orientation / toolbar changes.
        const SCALE  = 1.0;    // building width vs natural vw widths (fills ~width)
        const BOTTOM = -0.02;  // nudge union bottom this fraction of vh above the edge (ground sits just inside)
        const fit = { sc: SCALE, x: 0, y: 0 };

        const unionRect = () => {
          let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
          for (const im of baseImgs) {
            const r = im.getBoundingClientRect();
            if (!r.width && !r.height) continue;
            x0 = Math.min(x0, r.left);  y0 = Math.min(y0, r.top);
            x1 = Math.max(x1, r.right); y1 = Math.max(y1, r.bottom);
          }
          return { left: x0, top: y0, width: x1 - x0, height: y1 - y0 };
        };

        const computeFit = () => {
          const cx = gsap.getProperty(mh, 'x');
          const cy = gsap.getProperty(mh, 'y');
          const cs = gsap.getProperty(mh, 'scale');
          gsap.set(mh, { scale: SCALE, x: 0, y: 0 });
          const r = unionRect();
          if (!r.width || !r.height) { gsap.set(mh, { scale: cs, x: cx, y: cy }); return; }
          const vw = window.innerWidth;
          const vh = getVH();
          fit.sc = SCALE;
          fit.x = (vw - r.width) / 2 - r.left;          // centre horizontally
          fit.y = (vh - r.height) - r.top + vh * BOTTOM; // anchor union bottom to viewport bottom (+bias)
          gsap.set(mh, { scale: cs, x: cx, y: cy }); // restore scrub state
        };

        const l1Mult = isDesktop ? 1.1 : 0.9;
        const l2Mult = isDesktop ? 1.5 : isTablet ? 1.2 : 1.0;

        const CASCADE_START = 700 + CASCADE_OFFSET;
        const LAYER_STEP    = LAYER_DUR + LAYER_GAP;
        const cascadeEnd    = CASCADE_START + 8 * LAYER_DUR + 7 * LAYER_GAP;

        let tl = null;
        let cancelled = false;

        const buildTimeline = () => {
          if (cancelled) return;
          computeFit();
          gsap.set(mh, { scale: fit.sc, transformOrigin: 'top left' });

          tl = gsap.timeline({
            scrollTrigger: {
              id: 'hero4-pin',
              trigger: triggerRef.current,
              start: 'top top',
              end: () => '+=' + getVH() * 2.5,
              pin: true,
              scrub: true,
              invalidateOnRefresh: true,
            },
          });
          tl.duration(cascadeEnd);

          tl
            // Building rests stacked at bottom-centre from the first frame
            // (like paveletsky.org) — a whisper of rise for life, then it
            // holds until the cascade flies the layers up. Same on every
            // device. Function-based so it re-centres on refresh/resize.
            .fromTo(
              mh,
              { x: () => fit.x, y: () => fit.y + getVH() * 0.04 },
              { x: () => fit.x, y: () => fit.y, ease: 'power1.out', duration: INTRO_DURATION },
              0,
            )
            .to(
              [headerRef.current, titleRef.current],
              { y: '-120vh', ease: 'power1.in', duration: TEXT_EXIT },
              0,
            )

            .to(l1, { y: () => -(getVH() * l1Mult) / fit.sc, duration: LAYER_DUR, ease: 'power1.in' }, CASCADE_START)

            .to(
              bg1ImgRef.current,
              { y: '-180dvh', duration: cascadeEnd - (300 + CASCADE_OFFSET), ease: 'none' },
              300 + CASCADE_OFFSET,
            )
            .to(
              bg2ImgRef.current,
              { y: BG2_REST, duration: BG2_DUR, ease: 'none' },
              cascadeEnd - BG2_DUR,
            )

            .to(l2, { y: () => -(getVH() * l2Mult) / fit.sc, duration: LAYER_DUR, ease: 'power1.in' }, CASCADE_START + 1 * LAYER_STEP)
            .to(l3, { y: () => -(getVH() * l2Mult) / fit.sc, duration: LAYER_DUR, ease: 'power1.in' }, CASCADE_START + 2 * LAYER_STEP)
            .to(l4, { y: () => -(getVH() * l2Mult) / fit.sc, duration: LAYER_DUR, ease: 'power1.in' }, CASCADE_START + 3 * LAYER_STEP)
            .to(l5, { y: () => -(getVH() * l2Mult) / fit.sc, duration: LAYER_DUR, ease: 'power1.in' }, CASCADE_START + 4 * LAYER_STEP)
            .to(l6, { y: () => -(getVH() * l2Mult) / fit.sc, duration: LAYER_DUR, ease: 'power1.in' }, CASCADE_START + 5 * LAYER_STEP)
            .to(l7, { y: () => -(getVH() * l2Mult) / fit.sc, duration: LAYER_DUR, ease: 'power1.in' }, CASCADE_START + 6 * LAYER_STEP)
            .to(l8, { y: () => -(getVH() * l2Mult) / fit.sc, duration: LAYER_DUR, ease: 'power1.in' }, CASCADE_START + 7 * LAYER_STEP)

            .to(
              mh,
              { y: () => `+=${-(getVH() * 0.08) / fit.sc}`, duration: cascadeEnd - CASCADE_START, ease: 'none' },
              CASCADE_START,
            );
        };

        // Recompute fit before ScrollTrigger re-reads function-based values.
        const onRefreshInit = () => { if (tl) computeFit(); };
        ScrollTrigger.addEventListener('refreshInit', onRefreshInit);

        // getBoundingClientRect height is only real once images have loaded
        // (height:auto = 0 before load) — gate the build on it.
        const imgReady = (im) => im.complete && im.naturalHeight;
        if (baseImgs.every(imgReady)) {
          buildTimeline();
        } else {
          Promise.all(
            baseImgs.map((im) =>
              imgReady(im)
                ? Promise.resolve()
                : new Promise((res) => {
                    im.addEventListener('load', res, { once: true });
                    im.addEventListener('error', res, { once: true });
                  }),
            ),
          ).then(() => {
            buildTimeline();
            ScrollTrigger.refresh();
          });
        }

        // iOS Safari: visualViewport.resize fires when toolbar collapses/expands
        const onVisualResize = () => {
          ScrollTrigger.refresh();
        };
        window.visualViewport?.addEventListener('resize', onVisualResize);

        // Orientation change: force refresh after settle delay
        let orientationTimer;
        const onOrientationChange = () => {
          clearTimeout(orientationTimer);
          orientationTimer = setTimeout(() => {
            ScrollTrigger.refresh();
          }, 150);
        };

        if (screen.orientation) {
          screen.orientation.addEventListener('change', onOrientationChange);
        } else {
          window.addEventListener('orientationchange', onOrientationChange);
        }

        // matchMedia cleanup — return function is called when context reverts
        return () => {
          cancelled = true;
          ScrollTrigger.removeEventListener('refreshInit', onRefreshInit);
          tl?.scrollTrigger?.kill();
          tl?.kill();
          clearTimeout(orientationTimer);
          window.visualViewport?.removeEventListener('resize', onVisualResize);
          if (screen.orientation) {
            screen.orientation.removeEventListener('change', onOrientationChange);
          } else {
            window.removeEventListener('orientationchange', onOrientationChange);
          }
        };
      },
    );

    return () => {
      mm.revert();
    };
  }, []);

  // bg2Backing color fade — mirrors TIDifferences/Intro.jsx's primary→white
  // fade exactly (same trigger element, same start/end), so the color
  // revealed through bg2Shape's transparent mask always matches the next
  // section's current background. Rebuilt on themechange.
  useLayoutEffect(() => {
    let colorCtx

    function buildBackingFade() {
      if (colorCtx) colorCtx.revert()
      const introSection = document.querySelector('#section-ti-differences > section')
      if (!introSection || !bg2BackingRef.current) return

      colorCtx = gsap.context(() => {
        const primaryColor = getComputedStyle(document.documentElement)
          .getPropertyValue('--color-primary')
          .trim()

        gsap.fromTo(
          bg2BackingRef.current,
          { backgroundColor: primaryColor },
          {
            backgroundColor: '#ffffff',
            scrollTrigger: {
              trigger: introSection,
              start: 'top 50%',
              end: 'top 20%',
              scrub: 1.2,
              invalidateOnRefresh: true,
            },
          },
        )
      })
    }

    document.fonts.ready.then(buildBackingFade)
    window.addEventListener('themechange', buildBackingFade)

    return () => {
      colorCtx?.revert()
      window.removeEventListener('themechange', buildBackingFade)
    }
  }, [])

  return (
    <section ref={sectionRef} id="hero4" className={s.home}>
      <div ref={triggerRef} className={s.trigger}>
        <header ref={headerRef} className={s.header}>
          <img
            src="/nya-logo/nya-white.png"
            alt="Nabih Youssef Associates"
            className={s.headerLogo}
            draggable={false}
          />
        </header>

        <div ref={titleRef} className={s.heroTitle}>
          <div className={s.titleRow}>
            <span className={`${s.titleWord} ${s.titleWordTenant}`}>
              <span className={s.firstLetter}>T</span>enant
            </span>
          </div>
          <div className={`${s.titleRow} ${s.titleRowIndent}`}>
            <span className={`${s.titleWord} ${s.titleWordImprovements}`}>
              <span className={s.firstLetter}>I</span>mprovements
            </span>
          </div>
        </div>

        <div className={s.bg1}>
          <div ref={bg1ImgRef} className={s.bg1Shape} />
        </div>
        <div className={s.bg2}>
          <div ref={bg2ImgRef} className={s.bg2ImgWrap}>
            <div ref={bg2BackingRef} className={s.bg2Backing} />
            <div className={s.bg2Shape} />
          </div>
        </div>


        <div ref={exitOverlayRef} className={s.exitOverlay} />

        <div ref={movehomeRef} className={s.movehome}>
          {LAYERS.map((layer, i) => (
            <div
              key={layer.id}
              className={`${s[`l${layer.id}`]} ${s.layer}`}
              ref={(el) => { layerRefs.current[i] = el; }}
            >
              <img src={layer.base} alt="" draggable={false} className={s.imgBase} />
              <img src={layer.hover} alt="" draggable={false} className={s.imgHover} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
