/*
 * TrustWallOption3 — Client logo marquee with section header
 *
 * IMPORTANT: All styles MUST use CSS variables from the design system.
 * Never hardcode colors or font families.
 */

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from './TrustWallOption3.module.css';

gsap.registerPlugin(ScrollTrigger);

const ROW_TOP = [
  { id: 1, name: "Clune Construction", src: "/logos/clune.jpeg" },
  { id: 2, name: "Mata Construction", src: "/logos/mata-construction.webp" },
  { id: 3, name: "Novo Construction", src: "/logos/novo.jpg" },
  { id: 4, name: "Swinerton", src: "/logos/swinerton.png" },
  { id: 5, name: "Turner & Townsend", src: "/logos/turner-townsend.png" },
  {
    id: 6,
    name: "Brookfield Properties",
    src: "/logos/brookfield-properties.svg",
  },
  { id: 7, name: "CBRE", src: "/logos/cbre.svg" }, //ok
  { id: 8, name: "CIM", src: "/logos/cim.png" },
  { id: 9, name: "Cushman & Wakefield", src: "/logos/cushman-wakefield.svg" },
  { id: 10, name: "Hines", src: "/logos/hines.webp" },
  { id: 11, name: "Irvine Company", src: "/logos/irvine-company.webp" },
  {
    id: 12,
    name: "Rising Realty Partners",
    src: "/logos/rising.png",
  },
  { id: 13, name: "Tishman Speyer", src: "/logos/tishman-speyer.webp" },
  { id: 14, name: "AECOM", src: "/logos/aecom.svg" },
  { id: 15, name: "ASDSKY", src: "/logos/asdsky.webp" },
  { id: 16, name: "Gensler", src: "/logos/gensler.svg" },
];

const ROW_BOTTOM = [
  { id: 17, name: "DLR Group", src: "/logos/dlr-group.svg" },
  { id: 18, name: "Form Studio", src: "/logos/form.png" },
  { id: 19, name: "HOK", src: "/logos/hok.webp" },
  { id: 20, name: "Gruen", src: "/logos/gruen.png" },
  { id: 21, name: "HED Design", src: "/logos/hed.png" },
  { id: 22, name: "Perkins & Will", src: "/logos/perkins-will.svg" },
  { id: 23, name: "Huntsman Architectural", src: "/logos/huntsman.webp" },
  { id: 24, name: "Johnson Fain", src: "/logos/johnson-fain.webp" },
  { id: 25, name: "KDA", src: "/logos/kda.webp" },
  { id: 26, name: "LPA Inc.", src: "/logos/lpa.svg" },
  { id: 27, name: "RIOS Inc.", src: "/logos/rios.webp" },
  {
    id: 28,
    name: "Shlemmer Kamus Algaze",
    src: "/logos/shlemmer-kamus-algaze.webp",
  },
  { id: 29, name: "SOM", src: "/logos/som.webp" },
  { id: 30, name: "Studio One Eleven", src: "/logos/studio-one-eleven.svg" },
  { id: 31, name: "Ware Malcomb", src: "/logos/ware-malcomb.svg" },
  { id: 32, name: "Area Architecture", src: "/logos/area.jpg" },
];

function LogoItem({ name, src }) {
  return (
    <div className={styles.logoSlot}>
      <img
        src={src}
        alt={name}
        className={styles.logoImg}
        loading="lazy"
        draggable="false"
      />
    </div>
  );
}

function MarqueeRow({ logos, direction }) {
  const doubled = [...logos, ...logos];
  return (
    <div className={styles.marqueeViewport}>
      <div className={`${styles.marqueeTrack} ${direction === 'right' ? styles.marqueeRight : styles.marqueeLeft}`}>
        {doubled.map((logo, i) => (
          <LogoItem key={`${logo.id}-${i}`} name={logo.name} src={logo.src} />
        ))}
      </div>
    </div>
  );
}

export default function TrustWallOption3() {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const bodyRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      document.fonts.ready.then(() => {
        const cs = getComputedStyle(document.documentElement);
        const primaryColor = cs.getPropertyValue("--color-primary").trim();
        const accentColor = cs.getPropertyValue("--color-accent").trim();
        const surfaceColor =
          cs.getPropertyValue("--surface-page").trim() || "#F8FAFC";
        const blackColor =
          cs.getPropertyValue("--color-black").trim() || "#0F172A";

        const trigger = {
          trigger: sectionRef.current,
          start: "top 50%",
          end: "top 15%",
          scrub: 1.2,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (!sectionRef.current) return;
            if (self.progress > 0.5) {
              sectionRef.current.classList.add(styles.lightState);
            } else {
              sectionRef.current.classList.remove(styles.lightState);
            }
          },
        };

        gsap.fromTo(
          sectionRef.current,
          { backgroundColor: primaryColor },
          { backgroundColor: surfaceColor, scrollTrigger: trigger },
        );

        gsap.fromTo(
          headingRef.current,
          { color: accentColor },
          { color: blackColor, scrollTrigger: trigger },
        );

        gsap.fromTo(
          bodyRef.current,
          { color: "rgba(255,255,255,0.55)" },
          { color: "rgba(15,23,42,0.72)", scrollTrigger: trigger },
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className={styles.inner}>
        <h2 ref={headingRef} className={styles.heading}>
          In good
          <br />
          company.
        </h2>
        <p ref={bodyRef} className={styles.body}>
          Big or small, local or international, we bring the same level of care
          to every project. We love working with teams that value honest, human
          connection.
        </p>
      </div>

      <div className={styles.marqueeSection}>
        <MarqueeRow logos={ROW_TOP} direction="left" />
        <MarqueeRow logos={ROW_BOTTOM} direction="right" />
      </div>
    </section>
  );
}
