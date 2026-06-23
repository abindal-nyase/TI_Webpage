/*
 * TrustWallOption3 — Client logo marquee with section header
 *
 * IMPORTANT: All styles MUST use CSS variables from the design system.
 * Never hardcode colors or font families.
 */

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from './03_O3_TrustWall.module.css';

import aecom from '../../../assets/company-logos/aecom.svg?url'
import area from '../../../assets/company-logos/area.webp?url'
import asdsky from '../../../assets/company-logos/asdsky.webp?url'
import brookfieldProperties from '../../../assets/company-logos/brookfield-properties.svg?url'
import cbre from '../../../assets/company-logos/cbre.svg?url'
import cim from '../../../assets/company-logos/cim.webp?url'
import clune from '../../../assets/company-logos/clune.webp?url'
import cushmanWakefield from '../../../assets/company-logos/cushman-wakefield.svg?url'
import dlrGroup from '../../../assets/company-logos/dlr-group.webp?url'
import form from '../../../assets/company-logos/form.webp?url'
import gensler from '../../../assets/company-logos/gensler.svg?url'
import gruen from '../../../assets/company-logos/gruen.webp?url'
import hed from '../../../assets/company-logos/hed.webp?url'
import hines from '../../../assets/company-logos/hines.webp?url'
import hok from '../../../assets/company-logos/hok.webp?url'
import huntsman from '../../../assets/company-logos/huntsman.webp?url'
import irvineCompany from '../../../assets/company-logos/irvine-company.webp?url'
import johnsonFain from '../../../assets/company-logos/johnson-fain.webp?url'
import kda from '../../../assets/company-logos/kda.webp?url'
import lpaInc from '../../../assets/company-logos/lpa-inc.webp?url'
import mataConstruction from '../../../assets/company-logos/mata-construction.webp?url'
import novo from '../../../assets/company-logos/novo.webp?url'
import perkinsWill from '../../../assets/company-logos/perkins-will.svg?url'
import rios from '../../../assets/company-logos/rios.webp?url'
import rising from '../../../assets/company-logos/rising.webp?url'
import shlemmerKamusAlgaze from '../../../assets/company-logos/shlemmer-kamus-algaze.webp?url'
import som from '../../../assets/company-logos/som.webp?url'
import studio111 from '../../../assets/company-logos/studio111.webp?url'
import swinerton from '../../../assets/company-logos/swinerton.webp?url'
import tismanSpeyer from '../../../assets/company-logos/tishman-speyer.webp?url'
import turnerTownsend from '../../../assets/company-logos/turner-townsend.webp?url'
import wareMalcomb from '../../../assets/company-logos/ware-malcomb.webp?url'

gsap.registerPlugin(ScrollTrigger);

const ROW_TOP = [
  { id: 1, name: "Clune Construction", src: clune },
  { id: 2, name: "Mata Construction", src: mataConstruction },
  { id: 3, name: "Novo Construction", src: novo },
  { id: 4, name: "Swinerton", src: swinerton },
  { id: 5, name: "Turner & Townsend", src: turnerTownsend },
  {
    id: 6,
    name: "Brookfield Properties",
    src: brookfieldProperties,
  },
  { id: 7, name: "CBRE", src: cbre },
  { id: 8, name: "CIM", src: cim },
  { id: 9, name: "Cushman & Wakefield", src: cushmanWakefield },
  { id: 10, name: "Hines", src: hines },
  { id: 11, name: "Irvine Company", src: irvineCompany },
  {
    id: 12,
    name: "Rising Realty Partners",
    src: rising,
  },
  { id: 13, name: "Tishman Speyer", src: tismanSpeyer },
  { id: 14, name: "AECOM", src: aecom },
  { id: 15, name: "ASDSKY", src: asdsky },
  { id: 16, name: "Gensler", src: gensler },
];

const ROW_BOTTOM = [
  { id: 17, name: "DLR Group", src: dlrGroup },
  { id: 18, name: "Form Studio", src: form },
  { id: 19, name: "HOK", src: hok },
  { id: 20, name: "Gruen", src: gruen },
  { id: 21, name: "HED Design", src: hed },
  { id: 22, name: "Perkins & Will", src: perkinsWill },
  { id: 23, name: "Huntsman Architectural", src: huntsman },
  { id: 24, name: "Johnson Fain", src: johnsonFain },
  { id: 25, name: "KDA", src: kda },
  { id: 26, name: "LPA Inc.", src: lpaInc },
  { id: 27, name: "RIOS Inc.", src: rios },
  {
    id: 28,
    name: "Shlemmer Kamus Algaze",
    src: shlemmerKamusAlgaze,
  },
  { id: 29, name: "SOM", src: som },
  { id: 30, name: "Studio One Eleven", src: studio111 },
  { id: 31, name: "Ware Malcomb", src: wareMalcomb },
  { id: 32, name: "Area Architecture", src: area },
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

export default function O3TrustWall() {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const bodyRef = useRef(null);

  useEffect(() => {
    let ctx;

    function buildAnims() {
      if (ctx) ctx.revert();
      ctx = gsap.context(() => {
        const cs = getComputedStyle(document.documentElement);
        const primaryColor = cs.getPropertyValue("--color-primary").trim();
        const surfaceColor = cs.getPropertyValue("--surface-page").trim() || "oklch(0.9842 0.0034 247.8575)";
        const blackColor = cs.getPropertyValue("--color-black").trim() || "oklch(0.2077 0.0398 265.7549)";
        const whiteColor = cs.getPropertyValue("--color-white").trim() || "oklch(1 0 0)";

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
          { backgroundColor: whiteColor, scrollTrigger: trigger },
        );

        gsap.fromTo(
          headingRef.current,
          { color: whiteColor },
          { color: blackColor, scrollTrigger: trigger },
        );

        gsap.fromTo(
          bodyRef.current,
          { color: "oklch(1 0 0 / 0.55)" },
          { color: "oklch(0.2077 0.0398 265.7549 / 0.72)", scrollTrigger: trigger },
        );
      }, sectionRef);
    }

    document.fonts.ready.then(buildAnims);

    window.addEventListener("themechange", buildAnims);
    return () => {
      window.removeEventListener("themechange", buildAnims);
      ctx?.revert();
    };
  }, []);

  return (
    <section id="section-trust-wall" ref={sectionRef} className={styles.section}>
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
