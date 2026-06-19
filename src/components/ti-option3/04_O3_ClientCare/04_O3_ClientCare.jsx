/*
 * O3ClientCare — pinned horizontal scrollytelling.
 * The section pins; vertical scroll drives horizontal-only motion. Each point
 * crosses the screen left -> right one at a time (title faster than content),
 * over background images that crossfade and drift left -> right behind them.
 * Reduced motion / no-JS falls back to a static stacked list.
 * All styles MUST use CSS variables. Never hardcode colors or font families.
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
  'How NYA treats tenant improvement work — and the clients behind it.'

const BUCKETS = [
  {
    label: 'Care',
    bg: bg1,
    items: [
      {
        id: 'advocate',
        title: 'A true client advocate',
        content: 'We protect what matters most to the owner, architect, and team — not just the structural scope.',
      },
      {
        id: 'client-care',
        title: 'Care for the building itself',
        content: 'We learn how your specific building actually works before we advise on it.',
      },
    ],
  },
  {
    label: 'Judgment',
    bg: bg2,
    items: [
      {
        id: 'technical-judgment',
        title: 'Judgment that earns confidence',
        content: 'Other engineers trust us to peer-review their complex TI designs.',
      },
      {
        id: 'make-it-work',
        title: 'A "make it work" mindset',
        content: 'We turn ambitious architecture into buildable structure instead of defaulting to "no".',
      },
    ],
  },
  {
    label: 'Process',
    bg: bg3,
    items: [
      {
        id: 'senior-engineers',
        title: 'Senior engineers, direct access',
        content: 'You work straight with seasoned engineers — no bureaucracy, no waiting.',
      },
      {
        id: 'communication',
        title: 'Communication that reduces pressure',
        content: 'Same-day responses close the small gaps before they become schedule loss.',
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
        content: 'Complete, predictable proposals — experience that lowers total project cost.',
      },
      {
        id: 'trusted',
        title: 'Work that is trusted',
        content: 'Most of our work comes from referrals built on decades of relationships.',
      },
    ],
  },
]

// Flattened points, each tagged with its bucket index (which background it rides).
const POINTS = BUCKETS.flatMap((b, bi) =>
  b.items.map((it) => ({ ...it, label: b.label, bgIndex: bi })),
)

export default function O3ClientCare() {
  const sectionRef = useRef(null)
  const stageRef = useRef(null)

  useEffect(() => {
    let ctx

    function buildAnims() {
      if (ctx) ctx.revert()
      ctx = gsap.context(() => {
        const mm = gsap.matchMedia()

        // Only the pinned conveyor when motion is allowed. Reduced motion keeps
        // the static stacked CSS fallback (no pin, fully legible).
        mm.add('(prefers-reduced-motion: no-preference)', () => {
          const stage = stageRef.current
          const isNarrow = window.matchMedia('(max-width: 768px)').matches
          const TITLE = isNarrow ? 135 : 120 // vw — fastest
          const CONTENT = isNarrow ? 92 : 78 // vw — slower
          const IMG = 7 // xPercent — slowest (depth)

          const titles = gsap.utils.toArray(stage.querySelectorAll('[data-cc-title]'))
          const contents = gsap.utils.toArray(stage.querySelectorAll('[data-cc-content]'))
          const labels = gsap.utils.toArray(stage.querySelectorAll('[data-cc-label]'))
          const bgs = gsap.utils.toArray(stage.querySelectorAll('[data-cc-bg]'))
          const N = titles.length

          stage.classList.add(s.isAnimated)

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top top',
              end: () => '+=' + window.innerHeight * (N * 0.85),
              pin: stage,
              scrub: 1,
              invalidateOnRefresh: true,
            },
          })

          // Backgrounds: continuous slow left -> right drift across the whole run.
          tl.fromTo(bgs, { xPercent: -IMG }, { xPercent: IMG, ease: 'none', duration: N }, 0)

          // Backgrounds: crossfade — bucket b is visible during its two points.
          bgs.forEach((bg, b) => {
            gsap.set(bg, { autoAlpha: b === 0 ? 1 : 0 })
            const inAt = b * 2
            if (b > 0) tl.to(bg, { autoAlpha: 1, duration: 0.5, ease: 'none' }, inAt - 0.25)
            if (b < bgs.length - 1) tl.to(bg, { autoAlpha: 0, duration: 0.5, ease: 'none' }, inAt + 2 - 0.25)
          })

          // Points cross the screen one at a time, left -> right.
          // Title travels farthest (fastest); content less; both readable at the
          // window centre (x = 0). scrub makes the whole thing reversible.
          titles.forEach((t, i) => {
            tl.fromTo(t, { x: `-${TITLE}vw` }, { x: `${TITLE}vw`, ease: 'none', duration: 1 }, i)
            tl.fromTo(contents[i], { x: `-${CONTENT}vw` }, { x: `${CONTENT}vw`, ease: 'none', duration: 1 }, i)
            if (labels[i]) tl.fromTo(labels[i], { x: `-${TITLE}vw` }, { x: `${TITLE}vw`, ease: 'none', duration: 1 }, i)
          })

          return () => stage.classList.remove(s.isAnimated)
        })
      }, sectionRef)
    }

    document.fonts.ready.then(buildAnims)
    window.addEventListener('themechange', buildAnims)
    return () => {
      window.removeEventListener('themechange', buildAnims)
      ctx?.revert()
    }
  }, [])

  return (
    <section id="nya-culture-2" ref={sectionRef} className={s.section}>
      <div ref={stageRef} className={s.stage}>
        <div className={s.bgLayers} aria-hidden="true">
          {BUCKETS.map((bucket) => {
            // Astro returns an ImageMetadata object for src/assets imports in
            // islands; fall back to the raw value if it is already a string URL.
            const bgUrl = bucket.bg?.src ?? bucket.bg
            return (
              <div
                key={bucket.label}
                className={s.bandBg}
                data-cc-bg
                style={{ backgroundImage: `url(${bgUrl})` }}
              />
            )
          })}
          <div className={s.overlay} />
        </div>

        <div className={s.header}>
          <p className={s.eyebrow}>Client Care</p>
          <h2 className={s.title}>A Culture of Trust</h2>
          <p className={s.intro}>{DESCRIPTION}</p>
        </div>

        <div className={s.points}>
          {POINTS.map((p) => (
            <div key={p.id} className={s.point}>
              <span className={s.pointLabel} data-cc-label>{p.label}</span>
              <h3 className={s.pointTitle} data-cc-title>{p.title}</h3>
              <p className={s.pointContent} data-cc-content>{p.content}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
