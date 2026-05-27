import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import styles from './FirmCultureOption3.module.css';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const BASE_WORDS = ['CARE','CONCERN','RESPONSIBLE','ACCOUNTABLE','DYNAMIC','GOOD','READY','RELIABLE','KNOWLEDGEABLE','EXPERIENCED'];
const NUM_ROWS = 28;
const WORDS_PER_ROW = 28;

const WORD_GRID = Array.from({ length: NUM_ROWS }, (_, ri) =>
  Array.from({ length: WORDS_PER_ROW }, (_, ci) => BASE_WORDS[(ri * 3 + ci) % BASE_WORDS.length])
);

export default function FirmCultureOption3() {
  const sectionRef      = useRef(null);
  const stickyRef       = useRef(null);
  const compositionRef  = useRef(null);
  const wordRefs        = useRef([]);

  useGSAP((context) => {
    const section     = sectionRef.current;
    const sticky      = stickyRef.current;
    const composition = compositionRef.current;
    if (!section || !sticky || !composition) return;

    let cancelled = false;

    document.fonts.ready.then(() => {
      if (cancelled) return;
      context.add(() => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end:   'bottom bottom',
            scrub: 0.3,
            pin:   sticky,
            invalidateOnRefresh: true,
          },
        });
        tl.fromTo(composition, { scale: 1, yPercent: -22 }, { scale: 0.03, yPercent: 0, ease: 'none', duration: 8 }, 0);
        tl.to({}, { duration: 1 }, 8);
      });
    });

    // word flash loop — tracked automatically by useGSAP context
    const words = wordRefs.current.filter(Boolean);
    let active  = new Set();

    const flash = () => {
      const available = words.filter((_, i) => !active.has(i));
      if (available.length === 0) return;
      const idx = words.indexOf(available[Math.floor(Math.random() * available.length)]);
      active.add(idx);
      gsap.to(words[idx], {
        opacity: 1,
        duration: 0.25,
        ease: 'power1.out',
        onComplete: () => {
          gsap.to(words[idx], {
            opacity: 0.15,
            duration: 0.55,
            delay: 0.25,
            ease: 'power1.in',
            onComplete: () => active.delete(idx),
          });
        },
      });
      gsap.delayedCall(0.55 + Math.random() * 0.9, flash);
    };

    flash();
    gsap.delayedCall(0.4, flash);
    gsap.delayedCall(0.8, flash);

    return () => { cancelled = true; };
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className={styles.section}>
      <div ref={stickyRef} className={styles.sticky}>

        {/* word cloud — dense repeating rows */}
        <div className={styles.wordCloud} aria-hidden="true">
          {WORD_GRID.map((row, ri) => (
            <div key={ri} className={styles.wordRow}>
              {row.map((word, ci) => {
                const i = ri * WORDS_PER_ROW + ci;
                return (
                  <span
                    key={ci}
                    ref={el => wordRefs.current[i] = el}
                    className={styles.word}
                  >
                    {word}
                  </span>
                );
              })}
            </div>
          ))}
        </div>

        {/* composition: tagline + NYA — zooms as unit */}
        <div ref={compositionRef} className={styles.composition}>
          <p className={styles.taglineText}>Care, Trust, and<br />Serious Work.</p>
          <div className={styles.nya}>NYA</div>
        </div>

      </div>
    </section>
  );
}
