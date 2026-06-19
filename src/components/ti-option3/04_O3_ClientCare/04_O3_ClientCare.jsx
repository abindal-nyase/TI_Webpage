/*
 * O3ClientCare — horizontal-parallax Client Care section.
 * All styles MUST use CSS variables. Never hardcode colors or fonts.
 */
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import s from './04_O3_ClientCare.module.css'
import bg1 from '../../../assets/client-care/clientcare-bg-1.jpg'
import bg2 from '../../../assets/client-care/clientcare-bg-2.jpg'
import bg3 from '../../../assets/client-care/clientcare-bg-3.jpg'
import bg4 from '../../../assets/client-care/clientcare-bg-4.jpg'

gsap.registerPlugin(ScrollTrigger)

const DESCRIPTION =
  'At NYA, tenant improvement work is treated as a responsibility: to understand the building, protect the priorities behind the project, communicate clearly, and do the work with care. That mindset began with our founder and continues in the way our teams serve clients today.'

const BUCKETS = [
  {
    label: 'Care',
    bg: bg1,
    items: [
      {
        id: 'advocate',
        title: 'NYA acting as a true client advocate',
        content:
          'NYA takes client care seriously. We listen closely, understand what matters most to the owner, architect, or project team, and work to protect those priorities. Our goal is not just to complete the structural scope, but to support clients, ensure they are informed, and make sure their needs are looked after.',
      },
      {
        id: 'client-care',
        title: 'A genuine care for the client and the building itself',
        content:
          'Generic structural advice can miss what makes an existing building unique. NYA takes the time to understand the inner workings of your building: its structural system, existing conditions, load paths, constraints, and hidden complexities. That allows our guidance to be grounded in how the building actually works, not in one-size-fits-all assumptions.',
      },
    ],
  },
  {
    label: 'Judgment',
    bg: bg2,
    items: [
      {
        id: 'technical-judgment',
        title: 'Technical judgment that earns confidence',
        content:
          "NYA is generally trusted to peer-review other engineers's complex TI designs, verifying calculations, checking code compliance, and preparing summary reports. That role reflects the level of technical judgment clients and project teams trust us to bring to the project.",
      },
      {
        id: 'make-it-work',
        title: 'A "make it work" mindset',
        content:
          "Architects bring the creative ambition to TI work: unusual stairs, open lobbies, new partitions, technology walls, floating floors, and adaptive reuse concepts. NYA's role is to safeguard that ambition, translating it into structural solutions that are coordinated, code-conscious, and constructible. The result is a design vision that moves forward with earned confidence, not on hope. Every architecture firm has its own way of working, its own design priorities, and its own expectations for collaboration. NYA does not ask that team to adapt to us. We adapt to them — calibrating guidance, level of detail, communication style, and flexibility to match the way that team already works best.",
      },
    ],
  },
  {
    label: 'Process',
    bg: bg3,
    items: [
      {
        id: 'senior-engineers',
        title: 'You work with senior engineers with decades of experience',
        content:
          'In tenant improvement work, slow communication and too many handoffs can quietly cost a project time. A bureaucratic process can delay decisions, create unnecessary back-and-forth, and make it harder to resolve issues when they come up. NYA replaces that drag with seasoned structural judgment and direct, unfiltered access to the engineers closest to the work. The result is a team that keeps the project moving, not through rushed work, but through a process engineered to remove the waiting.',
      },
      {
        id: 'communication',
        title: 'Communication that reduces pressure, not adds to it',
        content:
          "Delays in TI work rarely begin with a crisis. They seep in through quieter gaps: the question left unanswered, the RFI that waits days for a response, the decision that drifts because no one knew who owned it. NYA is structured to intercept those gaps before they widen into schedule loss. We respond the same day, pick up the phone when field issues need discussion, and keep clients informed even when a full answer requires more time. NYA's decades of familiarity with different teams helps reduce that friction, improve predictability, and support better cost control.",
      },
    ],
  },
  {
    label: 'Confidence',
    bg: bg4,
    items: [
      {
        id: 'pricing',
        title: 'Pricing that is reliable',
        content:
          "A complete proposal helps clients understand what is included, reduce unexpected fees, and avoid costly surprises later. With NYA, experience is not overhead — it is efficiency. Our engineers have seen most TI challenges before, so we are not learning the problem at the client's expense. We can start further down the field, use past knowledge, automate repetitive steps, and apply sophisticated processes that help us move faster while reducing risk.",
      },
      {
        id: 'trusted',
        title: 'Our quality of work is trusted',
        content:
          "NYA's reputation was shaped by long-standing relationships with owners, architects, and property managers who experienced our founder's warmth, character, and care firsthand. That trust continues today because clients know how we work, how we communicate, and how seriously we take their buildings. Much of NYA's work comes through recommendations because clients trust the quality of our work, our reputation for excellence, and the confidence we give those who put our name forward.",
      },
    ],
  },
]

export default function O3ClientCare() {
  const rootRef = useRef(null)

  useEffect(() => {
    let ctx

    function buildAnims() {
      if (ctx) ctx.revert()
      ctx = gsap.context(() => {
        const mm = gsap.matchMedia()

        mm.add(
          {
            isWide: '(min-width: 769px)',
            isNarrow: '(max-width: 768px)',
            reduce: '(prefers-reduced-motion: reduce)',
          },
          (mmCtx) => {
            const { isWide, reduce } = mmCtx.conditions
            if (reduce) return // static layout, no transforms

            // xPercent ranges (of each element's own width). Title > content > bg.
            const TITLE = isWide ? 12 : 7
            const CONTENT = isWide ? 7 : 4
            const IMG = isWide ? 5 : 3

            rootRef.current.querySelectorAll('[data-cc-bg]').forEach((bg) => {
              gsap.fromTo(
                bg,
                { xPercent: -IMG },
                {
                  xPercent: IMG,
                  ease: 'none',
                  scrollTrigger: {
                    trigger: bg.closest('div'),
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1.2,
                    invalidateOnRefresh: true,
                  },
                },
              )
            })

            rootRef.current.querySelectorAll('[data-cc-title]').forEach((el) => {
              gsap.fromTo(
                el,
                { xPercent: -TITLE },
                {
                  xPercent: TITLE,
                  ease: 'none',
                  scrollTrigger: {
                    trigger: el,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1,
                    invalidateOnRefresh: true,
                  },
                },
              )
            })

            rootRef.current.querySelectorAll('[data-cc-content]').forEach((el) => {
              gsap.fromTo(
                el,
                { xPercent: -CONTENT },
                {
                  xPercent: CONTENT,
                  ease: 'none',
                  scrollTrigger: {
                    trigger: el,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1.4,
                    invalidateOnRefresh: true,
                  },
                },
              )
            })
          },
        )
      }, rootRef)
    }

    document.fonts.ready.then(buildAnims)
    window.addEventListener('themechange', buildAnims)
    return () => {
      window.removeEventListener('themechange', buildAnims)
      ctx?.revert()
    }
  }, [])

  return (
    <section id="nya-culture-2" ref={rootRef} className={s.section}>
      <div className={s.header}>
        <p className={s.eyebrow}>Client Care</p>
        <h2 className={s.title}>A Culture of Trust</h2>
        <p className={s.intro}>{DESCRIPTION}</p>
      </div>

      <div className={s.bands}>
        {BUCKETS.map((bucket) => (
          <div key={bucket.label} className={s.band}>
            <div
              className={s.bandBg}
              data-cc-bg
              style={{ backgroundImage: `url(${bucket.bg})` }}
              aria-hidden="true"
            />
            <div className={s.bandOverlay} aria-hidden="true" />
            <div className={s.bandInner}>
              <span className={s.bandLabel}>{bucket.label}</span>
              {bucket.items.map((item) => (
                <div key={item.id} className={s.row}>
                  <h3 className={s.rowTitle} data-cc-title>{item.title}</h3>
                  <p className={s.rowContent} data-cc-content>{item.content}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
