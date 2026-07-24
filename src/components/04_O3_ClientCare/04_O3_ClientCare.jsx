import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import s from './04_O3_ClientCare.module.css'

gsap.registerPlugin(ScrollTrigger)

const N       = 12
const R       = 400
const LR      = 442
const INNER_R = 172

const NAVY  = '#0B1F3B'
const WHITE = '#ffffff'
const BLACK = '#000000'

const WAVES   = 2
const N_PTS   = 20
const MAX_AMP = 14

// Arc carousel constants
const CARD_STEP    = 15   // degrees between adjacent cards on the arc
const FEATURED_DEG = 225  // arc angle (deg) for the featured / front card
const ARC_TOTAL    = N * CARD_STEP  // 165 ° total rotation to cycle all cards

const CARDS = [
  { title: 'NYA acting as a true client advocate',
    body: 'We take client care seriously. We listen closely, understand what matters most, and work to protect those priorities.' },
  { title: 'A genuine care for the client and the building itself',
    body: 'NYA takes the time to understand the inner workings of your building.' },
  { title: 'Technical judgment that earns confidence',
    body: 'The industry\'s most complex tenant improvement projects come to us for a second look.' },
  { title: 'A "make it work" mindset',
    body: 'Every architecture firm works differently, so we calibrate our guidance, communication, and level of support to fit the way each team works.' },
  { title: 'Early guidance clients can feel confident in',
    body: 'We help teams have early conversations with quick guidance, feasibility input, and practical advice.' },
  { title: 'Senior engineers with decades of experience',
    body: 'In tenant improvement work, layers of process slow communication. We replace that with seasoned, fast structural judgment.' },
  { title: 'Details shaped with care, not copied from habit',
    body: 'We tailor structural details to each project\'s actual conditions, reducing the risk of construction-phase surprises.' },
  { title: 'Communication that reduces pressure',
    body: 'We provide same-day responses, immediate phone consultations for field issues, and proactive communication throughout design and construction.' },
  { title: 'Pricing that is reliable',
    body: 'Our goal is a predictable total project cost — no consistent stream of change orders.' },
  { title: 'TIs are easy with NYA\'s experience',
    body: 'Our team has already mapped the terrain: the building, the permitting path, the plan check culture.' },
  { title: 'Our quality of work is trusted',
    body: 'Most of our work comes through recommendations because clients know and love how we work.' },
  { title: 'A lasting partnership',
    body: 'Many clients work with NYA on 5, 10, or 20+ projects — because a relationship built on trust keeps delivering results.' },
]

export default function O3ClientCare() {
  const sectionRef    = useRef(null)
  const stageRef      = useRef(null)
  const wheelWrapRef  = useRef(null)
  const centerTextRef = useRef(null)
  const ctaRef        = useRef(null)
  const spokeRefs     = useRef([])
  const dotRefs       = useRef([])
  const lblRefs       = useRef([])
  const cardRefs      = useRef([])

  useEffect(() => {
    const section    = sectionRef.current
    const stage      = stageRef.current
    const wheelWrap  = wheelWrapRef.current
    const centerText = centerTextRef.current
    const cta        = ctaRef.current
    if (!section || !stage || !wheelWrap) return

    // Stamp hex baseline so gsap.to() can read a parseable FROM color
    gsap.set(stage, { backgroundColor: WHITE, color: BLACK })

    const angle   = { value: 0 }
    const arcObj  = { value: 0 }   // 0 → ARC_TOTAL*(π/180) radians over phase 3
    const waveAmp = { value: 0, target: 0 }
    let prevAngle = 0
    let darkMode  = false
    let W = window.innerWidth
    let H = window.innerHeight
    let tl, st

    // ── SVG spoke draw ──────────────────────────────────────────────────────
    function draw() {
      const a = angle.value
      const w = waveAmp.value
      const phase = a * 2

      for (let i = 0; i < N; i++) {
        const spoke_a = -Math.PI / 2 + (i / N) * 2 * Math.PI + a
        const ex = Math.cos(spoke_a) * R
        const ey = Math.sin(spoke_a) * R
        const perpX = -Math.sin(spoke_a)
        const perpY =  Math.cos(spoke_a)

        const spoke = spokeRefs.current[i]
        if (spoke) {
          if (w < 0.4) {
            spoke.setAttribute('d', `M0 0L${ex.toFixed(1)} ${ey.toFixed(1)}`)
          } else {
            let d = 'M0 0'
            for (let j = 1; j <= N_PTS; j++) {
              const t   = j / N_PTS
              const off = w * Math.sin(t * Math.PI * 2 * WAVES + phase)
              d += `L${(ex * t + perpX * off).toFixed(1)} ${(ey * t + perpY * off).toFixed(1)}`
            }
            spoke.setAttribute('d', d)
          }
        }

        const dot = dotRefs.current[i]
        if (dot) {
          dot.setAttribute('cx', ex.toFixed(1))
          dot.setAttribute('cy', ey.toFixed(1))
        }

        const lx  = Math.cos(spoke_a) * LR
        const ly  = Math.sin(spoke_a) * LR
        const deg = -(spoke_a * 180 / Math.PI)
        const lbl = lblRefs.current[i]
        if (lbl) {
          lbl.setAttribute('transform',
            `translate(${lx.toFixed(1)} ${ly.toFixed(1)}) rotate(${deg.toFixed(2)})`)
        }
      }
    }

    // ── Card arc positioning ────────────────────────────────────────────────
    // Arc center is off-screen lower-right; cards fan toward upper-left
    function updateCards() {
      // Elliptical path centered slightly beyond the top-left.
// This creates the opposite curve without pushing cards off-screen.
const cx = -W * 0.10
const cy = -H * 0.10

const radiusX = W * 1.10
const radiusY = H * 1.10
      const offsetDeg = arcObj.value * (180 / Math.PI)
      // Gentle fade-in during the first 8° of phase-3 rotation
      const fadeIn   = Math.min(1, arcObj.value / (8 * Math.PI / 180))

      for (let i = 0; i < N; i++) {
        const card = cardRefs.current[i]
        if (!card) continue

        // Cards enter from the top-right and move toward the bottom-left.
const pathProgress = offsetDeg - i * CARD_STEP
const thetaDeg = 15 + pathProgress * 1.5
const theta = thetaDeg * (Math.PI / 180)

const px = cx + radiusX * Math.cos(theta)
const py = cy + radiusY * Math.sin(theta)

        // Proximity to featured position
        // The card reaches its maximum size near the center of the viewport.
const distanceFromCenter = Math.hypot(
  px - W / 2,
  py - H / 2
)

// Adjust this value to control how far from the center scaling begins.
const scaleRange = Math.min(W, H) * 0.75

const centerProximity = Math.max(
  0,
  1 - distanceFromCenter / scaleRange
)

// Keep the existing featured-position calculation for visibility.
const delta = Math.abs(i * CARD_STEP - offsetDeg)
const visibilityProximity = Math.max(0,2 - delta / 40)

const opacity = visibilityProximity * fadeIn

// Smallest away from center; largest exactly at the center.
const scale = 0.55 + 0.65 * centerProximity
        // Cards tilt clockwise following the arc's rising diagonal (lower-left
        // to upper-right). Baseline 195° keeps even the leftmost card slightly
        // tilted; tilt grows from ~4° at theta=210° to ~18° at theta=255°.
        const rotation = (thetaDeg - 15) * 0.12

        const dx = (px - W / 2).toFixed(1)
        const dy = (py - H / 2).toFixed(1)

        card.style.opacity   = opacity.toFixed(3)
        card.style.transform =
          `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))` +
          ` rotate(${rotation.toFixed(2)}deg)` +
          ` scale(${scale.toFixed(3)})`
      }
    }

    // ── Ticker: wave + draw + cards ─────────────────────────────────────────
    const ticker = () => {
      const da = angle.value - prevAngle
      prevAngle = angle.value
      waveAmp.target = Math.min(Math.abs(da) * 400, MAX_AMP)
      waveAmp.value += (waveAmp.target - waveAmp.value) * 0.05
      draw()
      if (arcObj.value > 0) updateCards()
    }
    gsap.ticker.add(ticker)

    // ── Build GSAP timeline + ScrollTrigger ─────────────────────────────────
    function buildAnims() {
      W = window.innerWidth
      H = window.innerHeight

      // Phase 2 destination for wheelWrap: upper-left at half scale.
      // transform-origin is the element centre (W/2, H/2), so translate moves
      // the rendered centre from (W/2,H/2) to (W*0.23, H*0.23).
      const destX = -W * 0.27
      const destY = -H * 0.10

      tl = gsap.timeline()

      // Phase 1 (tl 0 → 0.35): wheel rotates 0 → π
      tl.to(angle, { value: Math.PI, ease: 'none', duration: 0.35 }, 0)

      // Phase 2 (tl 0.35 → 0.50): wheel to corner, text/CTA out
      tl.to(wheelWrap, {
        x: destX, y: destY, scale: 0.70,
        ease: 'power2.inOut', duration: 0.15,
      }, 0.35)
      // Only hide the CTA — center text stays readable inside the mini wheel
       // Keep CTA visible throughout the entire section.

      // Phase 3 (tl 0.50 → 1.0): cards arc carousel
      tl.to(arcObj, {
        value: ARC_TOTAL * (Math.PI / 180),
        ease: 'none',
        duration: 0.50,
      }, 0.50)

      st = ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end:   () => `+=${H * 5}`,
        pin:   stage,
        scrub: 0.8,
        animation: tl,
        invalidateOnRefresh: true,
        refreshPriority: 1,
        onRefresh() {
          W = window.innerWidth
          H = window.innerHeight
        },
        onUpdate(self) {
          // Background white → navy at 20 % (≈ first viewport of scroll)
          const shouldBeDark = self.progress >= 0.20
          if (shouldBeDark !== darkMode) {
            darkMode = shouldBeDark
            gsap.to(stage, {
              backgroundColor: shouldBeDark ? NAVY  : WHITE,
              color:           shouldBeDark ? WHITE : BLACK,
              duration: 0.7,
              ease: 'power2.inOut',
              overwrite: 'auto',
            })
            stage.classList.toggle(s.isDark, shouldBeDark)
          }
        },
      })
    }

    document.fonts.ready.then(buildAnims)

    return () => {
      gsap.ticker.remove(ticker)
      st?.kill()
      tl?.kill()
      gsap.set(stage,     { clearProps: 'backgroundColor,color' })
      gsap.set(wheelWrap, { clearProps: 'x,y,scale' })
      if (centerText) gsap.set(centerText, { clearProps: 'opacity' })
      if (cta)        gsap.set(cta,        { clearProps: 'opacity' })
      stage.classList.remove(s.isDark)
      cardRefs.current.forEach(c => {
        if (c) { c.style.opacity = '0'; c.style.transform = '' }
      })
    }
  }, [])

  return (
    <section id="nya-culture-2" ref={sectionRef} className={s.section}>
      <div ref={stageRef} className={s.stage}>

        {/* Wheel group — SVG + heading, move together as one unit */}
        <div ref={wheelWrapRef} className={s.wheelWrap}>
          <svg
            className={s.wheel}
            viewBox="-500 -500 1000 1000"
            preserveAspectRatio="xMidYMid meet"
            aria-hidden="true"
          >
            <defs>
              <radialGradient id="cc-center-hole" cx="50%" cy="50%" r="50%">
                <stop offset="87%" stopColor="black" />
                <stop offset="100%" stopColor="white" />
              </radialGradient>
              <mask id="cc-spoke-mask">
                <rect x="-500" y="-500" width="1000" height="1000" fill="white" />
                <circle cx="0" cy="0" r={INNER_R} fill="url(#cc-center-hole)" />
              </mask>
            </defs>

            <g mask="url(#cc-spoke-mask)">
              {Array.from({ length: N }, (_, i) => (
                <path key={i} ref={el => { spokeRefs.current[i] = el }} className={s.spoke} />
              ))}
            </g>
            {Array.from({ length: N }, (_, i) => (
              <circle key={i} ref={el => { dotRefs.current[i] = el }} r="2.8" className={s.dot} />
            ))}
            {Array.from({ length: N }, (_, i) => (
              <text key={i} ref={el => { lblRefs.current[i] = el }}
                textAnchor="middle" dominantBaseline="middle"
                className={s.spokeLabel}>
                {String(i + 1).padStart(2, '0')}
              </text>
            ))}
          </svg>

          <div ref={centerTextRef} className={s.centerText}>
            <p className={s.centerHeading}>
              The Experience of Working With NYA on Your Projects
            </p>
          </div>
        </div>

        {/* Card carousel */}
        <div className={s.cardsWrap}>
          {CARDS.map((card, i) => (
            <div key={i} ref={el => { cardRefs.current[i] = el }} className={s.card}>
              <span className={s.cardNumber}>{String(i + 1).padStart(2, '0')}</span>
              <p className={s.cardTitle}>{card.title}</p>
              <p className={s.cardBody}>{card.body}</p>
            </div>
          ))}
        </div>

        <a ref={ctaRef} className={s.contactCta}
          href="mailto:info@nyase.com?subject=Tenant%20Improvement%20Inquiry">
          <span className={s.contactCtaText}>Contact Us</span>
          <span className={s.contactCtaArrow} aria-hidden="true">&rarr;</span>
        </a>
      </div>
    </section>
  )
}
