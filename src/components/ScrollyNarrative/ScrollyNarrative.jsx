import { useRef, useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import s from './ScrollyNarrative.module.css'

const HERO = {
  headline: "WE'RE NOT JUST ENGINEERS.",
  sub: "WE GET IT DONE.",
}

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
]

// Even horizontal spread — 240px center-to-center
const SPREAD_X = [-360, -120, 120, 360]
const Z_INDICES = [1, 3, 4, 2]

export default function ScrollyNarrative() {
  const wrapperRef = useRef(null)
  const bgRef      = useRef(null)
  const heroRef    = useRef(null)
  const slotRefs   = useRef([])
  const faceRefs   = useRef([])

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Cards start stacked at center, invisible, back-facing (NYA logo)
      gsap.set(slotRefs.current, { x: 0, autoAlpha: 0 })
      gsap.set(faceRefs.current, { rotateY: 180 })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.2,
        },
      })

      // t=0→1 (first quarter): hero fades out
      tl.to(heroRef.current, { autoAlpha: 0, ease: 'power2.in', duration: 1 }, 0)

      // t=1→3 (middle half): bg disappears + cards spread + flip
      tl.to(bgRef.current, { autoAlpha: 0, ease: 'power1.in', duration: 2 }, 1)

      slotRefs.current.forEach((slot, i) => {
        tl.to(slot, {
          x: SPREAD_X[i],
          autoAlpha: 1,
          ease: 'power2.inOut',
          duration: 2,
        }, 1)
      })

      // Flip NYA-logo back → chapter front (slight stagger, completes before t=3)
      faceRefs.current.forEach((face, i) => {
        tl.to(face, {
          rotateY: 0,
          ease: 'power2.inOut',
          duration: 1.4,
        }, 1.3 + i * 0.07)
      })

      // t=3→4 (last quarter): hold final state
      tl.set(bgRef.current, {}, 4)

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
        {/* Dark bg — fades out at scroll ¼ */}
        <div ref={bgRef} className={s.bg} aria-hidden="true" />
        <div className={s.ambient} aria-hidden="true" />

        {/* Hero text — fades before cards appear */}
        <div ref={heroRef} className={s.hero}>
          <h1 className={s.heroHeadline}>{HERO.headline}</h1>
          <h1 className={s.heroSub}>{HERO.sub}</h1>
        </div>

        {/* Card stage */}
        <div className={s.stage} aria-label="Our principles">
          {CHAPTERS.map((ch, i) => (
            <div
              key={ch.number}
              ref={el => { slotRefs.current[i] = el }}
              className={s.slot}
              style={{ zIndex: Z_INDICES[i] }}
            >
              <div
                ref={el => { faceRefs.current[i] = el }}
                className={s.card3d}
              >
                {/* Back — NYA logo; CSS scaleX(-1) on img corrects mirror from rotateY */}
                <div className={s.cardBack} aria-hidden="true">
                  <img src="/TI_Webpage/nya-blue.png" alt="" />
                </div>
                {/* Front — chapter content */}
                <div className={s.cardFront}>
                  <span className={s.chapterNum}>
                    {ch.number} / {String(CHAPTERS.length).padStart(2, '0')}
                  </span>
                  <h2 className={s.lead}>{ch.lead}</h2>
                  <p className={s.body}>{ch.body}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
