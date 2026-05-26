import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './FirmCultureOption3.module.css';

gsap.registerPlugin(ScrollTrigger);

const ROWS = [
  ['RESPONSIBLE','ARCHITECTURE','DESIGN','ANALYSIS','PLANNING','ENGINEERING','ACCOUNTABLE','CONSTRUCTION','MANAGEMENT','STRATEGY','QUALITY'],
  ['EXPERIENCED','EXCELLENCE','LEADERSHIP','VISION','SOLUTIONS','PROCESS','RELIABLE','SYSTEMS','STANDARDS','TECHNICAL','EXPERTISE'],
  ['KNOWLEDGEABLE','PROFESSIONAL','DEVELOPMENT','EXECUTION','PRECISION','DELIVERY','INNOVATIVE','VALUE','PERFORMANCE','RESULTS','COMMITMENT'],
  ['COLLABORATIVE','SERVICE','FOCUS','GROWTH','IMPACT','DRIVEN','TRANSPARENT','PURPOSE','SKILLED','TRUSTED','PROVEN'],
  ['PASSIONATE','AGILE','ENGAGED','DEDICATED','THOROUGH','EFFECTIVE','INTEGRITY','EFFICIENT','ADAPTIVE','CONNECTED','BOLD'],
  ['CARING','CLEAR','STRONG','ACTIVE','SMART','ALIGNED','STRUCTURED','HONEST','DIRECT','OPEN','SOLID'],
  ['DYNAMIC','SOUND','FIRM','SHARP','LEAN','SWIFT','CREATIVE','BRIGHT','STEADY','CAPABLE','PREPARED'],
  ['ESTABLISHED','INVESTED','ATTENTIVE','FORWARD','MINDFUL','GROUNDED','CURIOUS','DILIGENT','AMBITIOUS','PRINCIPLED','COHESIVE'],
  ['RESILIENT','DISCIPLINED','FOCUSED','RESPONSIVE','INTENTIONAL','PROACTIVE','METICULOUS','COMMITTED','DEPENDABLE','VERSATILE','PRECISE'],
  ['MOTIVATED','EARNEST','CAREFUL','GENUINE','INVOLVED','PRESENT','AWARE','FORTHRIGHT','PRACTICAL','CONSIDERED','MEASURED'],
];

const SIZES = ['0.65rem','0.72rem','0.78rem','0.72rem','0.65rem','0.78rem','0.72rem','0.65rem','0.72rem','0.78rem'];

const WORDS = ROWS.flatMap((row, ri) =>
  row.map((word, ci) => ({
    word,
    top:  `${3 + ri * 10}%`,
    left: `${(ri % 2 === 0 ? 0 : 4) + ci * 9}%`,
    size: SIZES[ri],
  }))
);

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

    // scroll timeline — only NYA scale, no bg or word tweens
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
      tl.fromTo(nya, { scale: 8 }, { scale: 1, ease: 'power2.out', duration: 1 }, 0);
    }, section);

    // word flash loop — white opacity only, no color change
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
