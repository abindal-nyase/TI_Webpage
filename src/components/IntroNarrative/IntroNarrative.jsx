import { useRef, useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import s from './IntroNarrative.module.css'

const PILLARS = [
  {
    lead: "We don\u2019t stall.",
    body: "We pick up the phone, clear roadblocks, and move. We know TI work isn\u2019t linear and we thrive in the swirl of decisions, deadlines, and drawings.",
  },
  {
    lead: "We speak architect.",
    body: "Our clients say we feel like part of their office. That\u2019s because we collaborate like design partners, not just consultants.",
  },
  {
    lead: "We build trust.",
    body: "Project managers bring us in because they\u2019ve worked with us before and know we\u2019ll protect their reputation.",
  },
  {
    lead: "We reduce friction.",
    body: "Owners call us back because we\u2019ve been in their buildings, we know their systems, and we know how to avoid rework.",
  },
]

export default function IntroNarrative() {
  const rootRef = useRef(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Set initial hidden state for ALL elements
      gsap.set(".js-reveal-up", { autoAlpha: 0, y: 24 });

      ScrollTrigger.batch(".js-reveal-up", {
        onEnter: (els) =>
          gsap.to(els, {
            autoAlpha: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.1,
            ease: "power2.out",
          }),

        // Critical fix: ensures elements already in view animate
        start: "top 95%",

        once: true,
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} id="intro" className={s.root}>
      <div className={s.inner}>
        {/* Label */}
        <span className={`u-label js-reveal-up ${s.label}`}>Who We Are</span>

        {/* Two-column layout */}
        <div className={s.columns}>
          {/* Left: literary narrative */}
          <div className={s.left}>
            <p className={`js-reveal-up ${s.dropCap}`}>
              There is a kind of structural engineering that stays in the background. Invisible.
              Efficient. Correct. And then there is ours — the kind that moves at the pace of
              construction, speaks the language of architects, and treats a tight deadline not as
              an obstacle but as the natural condition of the work.
            </p>
            <p className={`js-reveal-up ${s.body}`}>
              Nabih Youssef &amp; Associates has been delivering tenant improvement engineering
              across California for over forty years. From Apple Store glass staircases to
              high-rise lobby transformations in Century City, from Disney studio retrofits to
              fast-turn office fit-outs in San Francisco — we have built a practice around the
              projects that demand the most from a structural engineer.
            </p>
            <p className={`js-reveal-up ${s.body}`}>
              We were not hired once and retired. Over 95% of our work is repeat business.
              That is not a marketing claim. It is a description of how this practice works.
            </p>
          </div>

          {/* Right: four pillars */}
          <div className={s.right}>
            <p className={`js-reveal-up ${s.pillarIntro}`}>
              We're not just engineers. We're the team that gets it done.
            </p>
            <ul className={s.pillars} role="list">
              {PILLARS.map(({ lead, body }) => (
                <li key={lead} className={`js-reveal-up ${s.pillar}`}>
                  <strong className={s.pillarLead}>{lead}</strong>{' '}
                  <span className={s.pillarBody}>{body}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
