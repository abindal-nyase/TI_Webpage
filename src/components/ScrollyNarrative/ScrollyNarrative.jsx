import { useRef, useLayoutEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import s from './ScrollyNarrative.module.css'

const HERO = {
  headline: "WE'RE NOT JUST ENGINEERS.",
  sub: "WE GET IT DONE.",
};

const CHAPTERS = [
  {
    number: "01",
    lead: "We don't stall.",
    body: "We pick up the phone, clear roadblocks, and move. We know that TI work isn't linear and we thrive in the swirl of decisions, deadlines, and drawings.",
  },
  {
    number: "02",
    lead: "We speak architect.",
    body: "Our clients say we feel like part of their office. We collaborate like design partners, not just consultants.",
  },
  {
    number: "03",
    lead: "We build trust.",
    body: "Project managers bring us in because they've worked with us before and know we'll protect their reputation.",
  },
  {
    number: "04",
    lead: "We reduce friction.",
    body: "We've been in your buildings, we know your systems, and we know how to avoid rework. Owners call us back.",
  },
];

export default function ScrollyNarrative() {
  const heroRef = useRef(null);
  const wrapperRef = useRef(null);
  const progressRef = useRef(null);
  const slideRefs = useRef([]);
  const [activeIdx, setActiveIdx] = useState(-1);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const slides = slideRefs.current;
      const n = CHAPTERS.length + 1;

      // Timeline scrubs across entire 600vh wrapper
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.2,
          onUpdate: (self) => {
            // Update active dot
            const raw = Math.floor(self.progress * n);
            const idx = raw - 1;
            setActiveIdx(idx);
            // Drive progress bar
            if (progressRef.current) {
              progressRef.current.style.width = `${self.progress * 100}%`;
            }
          },
        },
      });

      // Divide timeline into n equal segments (0.25 each for n=4)
      // Each chapter owns one segment: i/n → (i+1)/n
      // Crossfade at each boundary
      const segLen = 1 / n; // 0.25 per chapter
      const fadeLen = 0.04; // crossfade half-width

      // HERO entry
      tl.fromTo(
        heroRef.current,
        { autoAlpha: 0, y: 40 },
        { autoAlpha: 1, y: 0, duration: 0.08, ease: "power2.out" },
        0,
      );

      // HERO exit (into first chapter)
      tl.to(
        heroRef.current,
        { autoAlpha: 0, y: -40, duration: 0.06, ease: "power2.in" },
        segLen - 0.06,
      );

      slides.forEach((slide, i) => {
        const segStart = (i + 1) * segLen; // 0, 0.25, 0.5, 0.75
        const segEnd = (i + 2) * segLen; // 0.25, 0.5, 0.75, 1.0

        if (true) {
          // Fade in at segment start
          tl.fromTo(
            slide,
            { autoAlpha: 0, y: 50 },
            { autoAlpha: 1, y: 0, ease: "power2.out", duration: fadeLen },
            segStart - fadeLen,
          );
        }

        if (i < n - 1) {
          // Fade out at segment end
          tl.to(
            slide,
            {
              autoAlpha: 0,
              y: -50,
              ease: "power2.in",
              duration: fadeLen,
            },
            segEnd - fadeLen,
          );
        }
      });
    }, wrapperRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={wrapperRef}
      id="narrative"
      className={s.wrapper}
      aria-label="Who we are"
    >
      <div className={s.sticky}>
        <div className={s.ambient} aria-hidden="true" />
        <div ref={heroRef} className={s.hero} aria-hidden={activeIdx !== -1}>
          <h1 className={s.heroHeadline}>{HERO.headline}</h1>
          <h1 className={s.heroSub}>{HERO.sub}</h1>
        </div>

        {/* Chapter slides */}
        {CHAPTERS.map((ch, i) => (
          <div
            key={ch.number}
            ref={(el) => {
              slideRefs.current[i] = el;
            }}
            className={s.slide}
            aria-hidden={i !== activeIdx}
          >
            <span className={s.chapterNum}>
              {ch.number} / {String(CHAPTERS.length).padStart(2, "0")}
            </span>
            <h2 className={s.lead}>{ch.lead}</h2>
            <p className={s.body}>{ch.body}</p>
          </div>
        ))}

        {/* Chapter dots */}
        <div className={s.dots} aria-hidden="true">
          {CHAPTERS.map((_, i) => (
            <span
              key={i}
              className={`${s.dot} ${i === activeIdx ? s.active : ""}`}
            />
          ))}
        </div>

        {/* Progress bar */}
        <div className={s.progress} aria-hidden="true">
          <div ref={progressRef} className={s.progressFill} />
        </div>
      </div>
    </section>
  );
}
