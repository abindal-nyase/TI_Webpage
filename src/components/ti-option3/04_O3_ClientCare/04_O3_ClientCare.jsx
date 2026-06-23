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
        title: 'NYA acts as a true client advocate',
        content: 'We take client care seriously. We listen closely, understand what matters most to the owner, architect, or project team, and work to protect those priorities. Our goal is not just to complete the structural scope, but to support clients, ensure they are informed, and make sure their needs are looked after.',
      },
      {
        id: 'client-care',
        title: 'We genuinely care for the client and the building itself',
        content: 'Generic structural advice can miss what makes an existing building unique. We take the time to understand the inner workings of your building: its structural system, existing conditions, load paths, constraints, and hidden complexities. That allows our guidance to be grounded in how the building actually works, not in one-size-fits-all assumptions.',
      },
    ],
  },
  {
    label: 'Precision',
    bg: bg2,
    items: [
      {
        id: 'details',
        title: 'Details shaped with care, not copied from habit',
        content: 'Existing buildings rarely behave like clean templates. Years of prior modifications, hidden as-built discrepancies, and onsite adaptations mean the real condition is always more particular than the record drawings suggest. We tailor our structural details to each project’s actual conditions, reducing the risk of field conflicts, unclear connections, and construction-phase surprises.',
      },
      {
        id: 'pricing',
        title: 'Pricing that is reliable',
        content: 'The ultimate goal is a predictable total project cost, which a complete proposal achieves by eliminating unexpected expenses and costly surprises rather than simply cutting upfront engineering fees. At NYA, experience is not overhead; it is efficiency. Because our engineers have navigated most TI challenges before, we do not learn at the client’s expense. Instead, we hit the ground running, leveraging past insights, automated tools, and advanced processes to accelerate the project timeline while drastically reducing risk.',
      },
    ],
  },
  {
    label: 'Experience',
    bg: bg3,
    items: [
      {
        id: 'senior-engineers',
        title: 'You work with senior engineers with decades of experience',
        content: 'In tenant improvement work, slow communication and too many handoffs can quietly cost a project time. A bureaucratic process can delay decisions, create unnecessary back-and-forth, and make it harder to resolve issues when they come up. We replace that drag with seasoned structural judgment and direct, unfiltered access to the engineers closest to the work. The result is a team that keeps the project moving, not through rushed work, but through a process engineered to remove the waiting.',
      },
      {
        id: 'make-it-work',
        title: 'A “make it work” mindset',
        content: 'Architects bring creative ambition to TI work, from unusual stairs and open lobbies to complex adaptive reuse concepts, and our role is to safeguard that ambition by translating it into structural solutions that are coordinated, code-conscious, and constructible. Because every design firm maintains its own unique priorities and workflows, we never ask a creative team to adapt to us; instead, we seamlessly calibrate our guidance, communication style, and level of detail to integrate directly into the architect\'s established process. This deeply adaptive collaboration ensures the original design vision moves forward with earned confidence rather than hope, delivering an engineering partnership that amplifies the architect\'s work without creating additional friction.',
      },
      {
        id: 'plan-check',
        title: 'Plan check is easy with NYA’s experience',
        content: 'When you begin a TI project with us, you start with a team that has already mapped the terrain: the building, the permitting path, the plan check culture, the ownership expectations, and the local players involved. That is the advantage we bring to TI work. Our familiarity helps teams begin with more clarity, reduce early friction, and move forward with confidence from the first conversation.',
      },
    ],
  },
  {
    label: 'Confidence',
    bg: bg4,
    items: [
      {
        id: 'guidance',
        title: 'Guidance clients can feel confident in',
        content: 'Before a TI project is fully formalized, owners often need enough structural input to understand what is possible and what may create risk. We help teams have those early conversations with more confidence, offering quick guidance, feasibility input, and practical advice so the project can move forward with a clearer path.',
      },
      {
        id: 'communication',
        title: 'Communication that reduces pressure, not adds to it',
        content: 'Delays in TI projects rarely stem from sudden crises; they are more often caused by unanswered questions, delayed RFIs, and decisions that linger too long. To keep projects moving, we provide same-day responses, immediate phone consultations for field issues, and proactive communication throughout the design and construction process. Drawing on decades of experience, we adapt to each client’s preferred workflows and presentation standards, ensuring information is delivered clearly and decisions are made efficiently. The result is tighter cost control, reduced risk, and more predictable project schedules.',
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
            // Lowered 0.7 → 0.5 to cut dead scroll — the conveyor reaches the
            // footer in ~8 viewports instead of ~11, still a readable dwell.
            const SPEED = 0.5

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

            // Backgrounds crossfade — each bucket is visible across the span of
            // its own points. Buckets have variable item counts, so derive each
            // bucket's start point-index from cumulative counts (no hardcoded 2).
            const counts = BUCKETS.map((bk) => bk.items.length)
            const offsets = []
            counts.reduce((acc, c, i) => { offsets[i] = acc; return acc + c }, 0)
            bgs.forEach((bg, b) => {
              gsap.set(bg, { autoAlpha: b === 0 ? 1 : 0 })
              const inT = offsets[b] * SEG
              const outT = (offsets[b] + counts[b]) * SEG
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
            const bgUrl = bucket.bg?.src ?? bucket.bg;
            return (
              <div
                key={bucket.label}
                className={s.bandBg}
                data-cc-bg
                style={{ backgroundImage: `url(${bgUrl})` }}
              />
            );
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
              <h3 className={s.pointTitle} data-cc-title>
                {p.title}
              </h3>
              <p className={s.pointContent} data-cc-content>
                {p.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
