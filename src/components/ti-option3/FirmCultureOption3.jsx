import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './FirmCultureOption3.module.css';

gsap.registerPlugin(ScrollTrigger);

const WORDS = [
  { word: 'Responsible',   top: '8%',  left: '5%',  size: '0.85rem', rot: 0 },
  { word: 'Accountable',   top: '8%',  left: '42%', size: '0.75rem', rot: 0 },
  { word: 'Dynamic',       top: '8%',  left: '72%', size: '0.9rem',  rot: 0 },
  { word: 'Good',          top: '16%', left: '18%', size: '1rem',    rot: 0 },
  { word: 'Ready',         top: '16%', left: '58%', size: '0.8rem',  rot: 0 },
  { word: 'Reliable',      top: '24%', left: '2%',  size: '0.85rem', rot: 0 },
  { word: 'Knowledgeable', top: '24%', left: '30%', size: '0.7rem',  rot: 0 },
  { word: 'Experienced',   top: '24%', left: '68%', size: '0.9rem',  rot: 0 },
  { word: 'Care',          top: '32%', left: '10%', size: '1.1rem',  rot: 0 },
  { word: 'Concern',       top: '32%', left: '48%', size: '0.8rem',  rot: 0 },
  { word: 'Innovative',    top: '58%', left: '5%',  size: '0.85rem', rot: 0 },
  { word: 'Agile',         top: '58%', left: '38%', size: '1rem',    rot: 0 },
  { word: 'Collaborative', top: '58%', left: '65%', size: '0.75rem', rot: 0 },
  { word: 'Structured',    top: '68%', left: '18%', size: '0.9rem',  rot: 0 },
  { word: 'Transparent',   top: '68%', left: '55%', size: '0.8rem',  rot: 0 },
  { word: 'Passionate',    top: '78%', left: '8%',  size: '0.85rem', rot: 0 },
  { word: 'Flexible',      top: '78%', left: '45%', size: '1rem',    rot: 0 },
  { word: 'Caring',        top: '88%', left: '25%', size: '0.9rem',  rot: 0 },
  { word: 'Connected',     top: '88%', left: '62%', size: '0.8rem',  rot: 0 },
  { word: 'Integrity',     top: '40%', left: '78%', size: '0.85rem', rot: 0 },
  { word: 'Creative',      top: '48%', left: '82%', size: '0.9rem',  rot: 0 },
  { word: 'Established',   top: '40%', left: '2%',  size: '0.75rem', rot: 0 },
];

export default function FirmCultureOption3() {
  const sectionRef = useRef(null);
  const stickyRef  = useRef(null);
  const nyaRef     = useRef(null);
  const wordRefs   = useRef([]);
  const flashCtx   = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const sticky  = stickyRef.current;
    const nya     = nyaRef.current;
    if (!section || !sticky || !nya) return;

    const root        = document.documentElement;
    const primaryColor = getComputedStyle(root).getPropertyValue('--color-primary').trim() || '#0B1F3B';
    const accentColor  = getComputedStyle(root).getPropertyValue('--color-accent').trim()  || '#2F80ED';

    // ── scroll timeline ──────────────────────────────────────────────────────
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

      // phase 1 — bg + word cloud fade in
      tl.fromTo(sticky,
        { backgroundColor: '#ffffff' },
        { backgroundColor: primaryColor, duration: 0.15 },
        0
      );
      tl.fromTo(wordRefs.current,
        { opacity: 0 },
        { opacity: 1, stagger: 0.008, duration: 0.15 },
        0
      );

      // phase 2 — NYA zoom out
      tl.fromTo(nya,
        { scale: 8 },
        { scale: 1, ease: 'power2.out', duration: 0.78 },
        0.1
      );


    }, section);

    // ── word flash loop ──────────────────────────────────────────────────────
    flashCtx.current = gsap.context(() => {
      const words = wordRefs.current.filter(Boolean);
      let active  = new Set();

      const flash = () => {
        const available = words.filter((_, i) => !active.has(i));
        if (available.length === 0) return;

        const idx  = words.indexOf(available[Math.floor(Math.random() * available.length)]);
        active.add(idx);

        gsap.to(words[idx], {
          color: accentColor,
          opacity: 1,
          duration: 0.25,
          ease: 'power1.out',
          onComplete: () => {
            gsap.to(words[idx], {
              color: '#ffffff',
              opacity: 0.1,
              duration: 0.55,
              delay: 0.25,
              ease: 'power1.in',
              onComplete: () => active.delete(idx),
            });
          },
        });

        gsap.delayedCall(0.55 + Math.random() * 0.9, flash);
      };

      // stagger two independent flash chains
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

        {/* word cloud */}
        <div className={styles.wordCloud} aria-hidden="true">
          {WORDS.map((w, i) => (
            <span
              key={w.word + i}
              ref={el => wordRefs.current[i] = el}
              className={styles.word}
              style={{ top: w.top, left: w.left, fontSize: w.size }}
            >
              {w.word}
            </span>
          ))}
        </div>

        {/* composition: tagline above NYA — both static, revealed by NYA zoom-out */}
        <div className={styles.composition}>
          <div className={styles.taglineGroup} aria-hidden="true">
            <p className={styles.taglineText}>Care, Trust, and<br />Serious Work.</p>
            <p className={styles.taglineSub}>NYA</p>
          </div>
          <div ref={nyaRef} className={styles.nya}>NYA</div>
        </div>

      </div>
    </section>
  );
}
