import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import styles from './02_O3_FirmCulture.module.css';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const BASE_WORDS = [
  "ACCOUNTABLE",
  "AGILE",
  "COLLABORATIVE",
  "CONNECTED",
  "CREATIVE",
  "ESTABLISHED",
  "EXPERIENCED",
  "FLEXIBLE",
  "INNOVATIVE",
  "INTEGRITY",
  "PASSIONATE",
  "READY",
  "STRUCTURED",
  "TRANSPARENT",
  "KNOWLEDGEABLE",
  "RELIABLE",
  "DYNAMIC",
  "CARING",
  "ACCOUNTABLE",
  "AGILE",
  "COLLABORATIVE",
  "CONNECTED",
  "CREATIVE",
  "ESTABLISHED",
  "EXPERIENCED",
  "FLEXIBLE",

];
const NUM_ROWS = 28;
const WORDS_PER_ROW = 28;

const WORD_GRID = Array.from({ length: NUM_ROWS }, (_, ri) =>
  Array.from({ length: WORDS_PER_ROW }, (_, ci) => BASE_WORDS[(ri * 3 + ci) % BASE_WORDS.length])
);

export default function O3FirmCulture() {
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

    // Build the pin SYNCHRONOUSLY — do NOT gate it behind document.fonts.ready.
    // The pin trigger is the 300vh section (font-independent), so it can exist
    // from the first frame. Gating it behind fonts.ready left a window with no
    // pin: the section scrolled free while the flash loop ran → load glitch.
    // (Hero solves the same problem with a placeholder hold-pin.) Fonts only
    // affect the giant tagline/NYA size, so just refresh once they settle.
    const mm = gsap.matchMedia();
    mm.add(
      {
        isSmall360: '(max-width: 375px)',
        isPort390:  '(min-width: 376px) and (max-width: 430px)',
        isWide:     '(min-width: 431px)',
      },
      (mmCtx) => {
        const { isSmall360, isPort390 } = mmCtx.conditions;

        // End scale = the readable resting size. Narrow phones scaled the
        // tagline + NYA down too far, so raise the floor on Mobile Small 360.
        const endScale = isSmall360 ? 0.042 : 0.03;
        // power4.out rushes the scale down through the giant, unreadable
        // letterform-wedge phase quickly, then lingers in the small/readable
        // range where the word-wall shows behind the text. On Mobile Port 390
        // the entrance read too small, so a gentler ease keeps the initial
        // readable frames larger while landing on the same 0.03 final size.
        const ease = isPort390 ? 'power2.out' : 'power4.out';

        gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end:   'bottom bottom',
            scrub: 0.3,
            pin:   sticky,
            invalidateOnRefresh: true,
            // Middle pinned section: Hero(3) → here(2) → ClientCare(1). Forces
            // top-to-bottom refresh order across resize. (ST mistake #5)
            refreshPriority: 2,
          },
          // No trailing dead-hold tween: the zoom now spans the FULL pin
          // distance and ends exactly at pin release. The old tl.to({},{1}) tail
          // froze the composition tiny on plain --color-primary for the last
          // ~1/9 of the scroll → the "blue gap before the last frame".
        }).fromTo(composition, { scale: 1, yPercent: -22 }, { scale: endScale, yPercent: 0, ease, duration: 8 }, 0);
      }
    );

    // Fonts change the measured size of the giant tagline/NYA — refresh once so
    // pin start/end and the scrub map against final type metrics.
    document.fonts.ready.then(() => { if (!cancelled) ScrollTrigger.refresh(); });

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
    <section id="section-firm-culture" ref={sectionRef} className={styles.section}>
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
