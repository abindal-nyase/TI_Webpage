import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './FirmCultureOption3.module.css';

gsap.registerPlugin(ScrollTrigger);

const BASE_WORDS = ['CARE','CONCERN','RESPONSIBLE','ACCOUNTABLE','DYNAMIC','GOOD','READY','RELIABLE','KNOWLEDGEABLE','EXPERIENCED'];
const NUM_ROWS = 16;
const WORDS_PER_ROW = 28;

const WORD_GRID = Array.from({ length: NUM_ROWS }, (_, ri) =>
  Array.from({ length: WORDS_PER_ROW }, (_, ci) => BASE_WORDS[(ri * 3 + ci) % BASE_WORDS.length])
);

export default function FirmCultureOption3() {
  const sectionRef      = useRef(null);
  const stickyRef       = useRef(null);
  const compositionRef  = useRef(null);
  const wordRefs        = useRef([]);
  const flashCtx        = useRef(null);

  useEffect(() => {
    const section     = sectionRef.current;
    const sticky      = stickyRef.current;
    const composition = compositionRef.current;
    if (!section || !sticky || !composition) return;

    const scrollCtx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end:   'bottom bottom',
          scrub: 1.2,
          pin:   sticky,
          pinSpacing: false,
        },
      });
      tl.fromTo(composition, { scale: 8 }, { scale: 1, ease: 'power2.out', duration: 1 }, 0);
    }, section);

    // word flash loop — white opacity only
    flashCtx.current = gsap.context(() => {
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
    });

    return () => {
      scrollCtx.revert();
      flashCtx.current?.revert();
    };
  }, []);

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
