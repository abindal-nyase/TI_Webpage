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

        // Object syntax: GSAP re-runs (revert + rebuild) whenever ANY of these
        // queries flips — so crossing 768px (e.g. tablet rotate) or toggling
        // reduced-motion rebuilds the conveyor with the right params instead of
        // keeping stale, once-read values. Reduced motion keeps the static
        // stacked CSS fallback (no pin, fully legible).
        mm.add(
          {
            isWide: '(min-width: 769px)',
            isNarrow: '(max-width: 768px)',
          },
          (context) => {
            const { isNarrow } = context.conditions
            const stage = stageRef.current

            // Travel (vw). Must be large enough that, when one point is centred,
            // its neighbours are fully off-screen — otherwise adjacent content
            // blocks (up to ~28ch wide) overlap in the centre band. Title travels
            // farthest (fastest), content less, label with the title.
            const TITLE = isNarrow ? 135 : 120 // vw travel — title (fastest)
            const CONTENT = isNarrow ? 92 : 78 // vw travel — content (slower)
            const IMG = 7 // xPercent — slowest (depth)

            // Per-point timeline budget (seconds): a point slides in (ENTER),
            // HOLDS centred and readable, then slides out (EXIT). A point's exit
            // overlaps the NEXT point's enter (exit starts at base+SEG, the next
            // enter also starts at base+SEG) so the stage is never empty between
            // points — one is always entering, centred, or leaving. HOLD ≫ ENTER
            // gives a long readable dwell.
            const ENTER = 0.5   // slide-in duration
            const EXIT = 0.32   // slide-out duration — quicker than ENTER so the
                                // outgoing point clears the centre before the
                                // incoming one arrives (minimal double-visible
                                // overlap), yet the stage is never empty.
            const HOLD = 1.5    // centred dwell — the bulk of each point's time
            const SEG = ENTER + HOLD
            // SPEED: scroll viewport-heights mapped to one timeline second.
            const SPEED = 0.7

            const titles = gsap.utils.toArray(stage.querySelectorAll('[data-cc-title]'))
            const contents = gsap.utils.toArray(stage.querySelectorAll('[data-cc-content]'))
            const labels = gsap.utils.toArray(stage.querySelectorAll('[data-cc-label]'))
            const bgs = gsap.utils.toArray(stage.querySelectorAll('[data-cc-bg]'))
            const N = titles.length
            const L = N * SEG // total timeline length (last point holds to the end)

            stage.classList.add(s.isAnimated)

            const tl = gsap.timeline({
              scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top top',
                end: () => '+=' + window.innerHeight * (L * SPEED),
                pin: stage,
                scrub: 1,
                invalidateOnRefresh: true,
              },
            })

            // Force the timeline to span the full L even though the last point
            // has no exit tween — keeps it pinned/centred through its final hold.
            tl.to({}, { duration: L }, 0)

            // Backgrounds: continuous slow left -> right drift across the whole run.
            tl.fromTo(bgs, { xPercent: -IMG }, { xPercent: IMG, ease: 'none', duration: L }, 0)

            // Backgrounds crossfade — bucket b (2 points) is visible across its span.
            bgs.forEach((bg, b) => {
              gsap.set(bg, { autoAlpha: b === 0 ? 1 : 0 })
              const inT = 2 * b * SEG
              const outT = 2 * (b + 1) * SEG
              if (b > 0) tl.to(bg, { autoAlpha: 1, duration: ENTER, ease: 'none' }, inT - ENTER)
              if (b < bgs.length - 1) tl.to(bg, { autoAlpha: 0, duration: ENTER, ease: 'none' }, outT - ENTER)
            })

            // Each point: enter from left → HOLD centred → exit right. The slide
            // is paired with a fade (autoAlpha) so the swap is a cross-dissolve:
            // the outgoing point fades out as it leaves while the next fades in —
            // never an empty stage (no gap) AND never hard text-on-text overlap.
            // Title/label travel farther (faster) than content for depth. Parked
            // hidden at -T before entering. Last point omits the exit and holds.
            const slide = (el, T, base, isLast) => {
              if (!el) return
              tl.fromTo(
                el,
                { x: `-${T}vw`, autoAlpha: 0 },
                { x: '0vw', autoAlpha: 1, ease: 'power2.out', duration: ENTER },
                base,
              )
              if (!isLast) tl.to(el, { x: `${T}vw`, autoAlpha: 0, ease: 'power2.in', duration: EXIT }, base + SEG)
            }
            titles.forEach((t, i) => {
              const base = i * SEG
              const isLast = i === N - 1
              slide(t, TITLE, base, isLast)
              slide(contents[i], CONTENT, base, isLast)
              slide(labels[i], TITLE, base, isLast)
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
