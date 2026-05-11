import { useRef, useEffect, useState } from 'react'
import s from './ProblemsSolutionsOption1.module.css'

const ITEMS = [
  {
    category: 'Building Knowledge',
    neg: 'Treated as a generic structure — existing system not studied before design begins',
    pos: 'Structural system studied early so design reflects how the building actually works',
  },
  {
    category: 'Early Clarity',
    neg: 'Critical decisions made before structural constraints are understood',
    pos: "Structural input provided upfront — owners and architects know what's possible early",
  },
  {
    category: 'Design Quality',
    neg: 'Innovative ideas compromised when engineer cannot technically support the vision',
    pos: 'Architecture protected — structural solution is strong enough to support the design intent',
  },
  {
    category: 'Field Coordination',
    neg: 'Generic details cause conflicts during construction, leading to RFIs and delays',
    pos: 'Details tailored to actual site conditions — drawings are clear and practical to build',
  },
  {
    category: 'Plan Check',
    neg: "Slow or stalled approvals because drawings don't anticipate city requirements",
    pos: 'Review moves predictably — drawings are prepared to meet what the city expects',
  },
  {
    category: 'Fee Accuracy',
    neg: 'Low initial proposal hides scope gaps — add services and cost overruns follow',
    pos: 'Proposal reflects real scope from the start — clients avoid surprise costs',
  },
  {
    category: 'Communication',
    neg: 'Poor coordination between team members causes uncertainty and schedule loss',
    pos: 'Clear coordination across structural, architect, contractor, and owner — fewer delays',
  },
]

const N = ITEMS.length

function useScrollProgress(ref) {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    function onScroll() {
      const el = ref.current
      if (!el) return
      const rect  = el.getBoundingClientRect()
      const range = el.offsetHeight - window.innerHeight
      if (range <= 0) return
      setProgress(Math.max(0, Math.min(1, -rect.top / range)))
    }
    // Listen on both window and any scrollable ancestor
    window.addEventListener('scroll', onScroll, { passive: true })
    document.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => {
      window.removeEventListener('scroll', onScroll)
      document.removeEventListener('scroll', onScroll)
    }
  }, [ref])
  return progress
}

// ── Arc gauge ────────────────────────────────────────────────────────────────
// Uses exact CSS variable values so colours match the rest of the UI exactly.
// --red:   #b84040  = hsl(0, 49%, 47%)
// --green: #3a9966  = hsl(150, 45%, 42%)
const CSS_RED   = '#b84040'
const CSS_GREEN = '#3a9966'

function ArcGauge({ fillPct, isResolvePh, activeCategory }) {
  const R = 42, CX = 60, CY = 60
  const CIRC = 2 * Math.PI * R

  let strokeColor
  if (fillPct === 0 && !isResolvePh) {
    strokeColor = 'rgba(255,255,255,0.08)'
  } else if (!isResolvePh) {
    // Grey → yellow → orange → exact red (#b84040)
    const t = fillPct
    const h = Math.max(0, 40 - t * 40)   // 40° → 0°
    const s2 = 25 + t * 24               // 25% → 49%
    const l = 55 - t * 8                 // 55% → 47%
    strokeColor = `hsl(${h},${s2}%,${l}%)`
  } else {
    // Red → exact green (#3a9966) as fillPct goes 1→0
    const t = 1 - fillPct   // 0 = full red, 1 = full green
    const h = t * 150       // 0° → 150°
    const s2 = 49 - t * 4  // 49% → 45%
    const l = 47 - t * 5   // 47% → 42%
    strokeColor = `hsl(${h},${s2}%,${l}%)`
  }

  // Snap to exact values at endpoints to avoid any hue drift
  if (!isResolvePh && fillPct >= 1) strokeColor = CSS_RED
  if (isResolvePh  && fillPct <= 0) strokeColor = CSS_GREEN

  const riskPct    = Math.round(fillPct * 100)
  const dashOffset = CIRC * (1 - fillPct)

  return (
    <div className={s.arcOuter}>
      <div className={s.arcCategory}>{activeCategory}</div>
      <svg viewBox="0 0 120 120" className={s.arcSvg}>
        <circle cx={CX} cy={CY} r={R}
          fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="7" />
        <circle cx={CX} cy={CY} r={R}
          fill="none"
          stroke={strokeColor}
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={CIRC}
          strokeDashoffset={dashOffset}
          style={{
            transform: 'rotate(-90deg)',
            transformOrigin: `${CX}px ${CY}px`,
            transition: 'stroke-dashoffset 0.55s ease, stroke 0.6s ease',
          }}
        />
        <text x={CX} y={CY - 4} textAnchor="middle"
          style={{ fontFamily: 'Bebas Neue,sans-serif', fontSize: '24px',
            fill: strokeColor, transition: 'fill 0.6s ease' }}>
          {riskPct}%
        </text>
        <text x={CX} y={CY + 11} textAnchor="middle"
          style={{ fontFamily: 'IBM Plex Mono,monospace', fontSize: '7px',
            fill: 'rgba(255,255,255,0.2)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          {isResolvePh ? 'resolved' : 'risk'}
        </text>
      </svg>
      <div className={s.arcStatus} style={{ color: strokeColor, transition: 'color 0.6s ease' }}>
        {!isResolvePh && riskPct === 0   && 'no issues yet'}
        {!isResolvePh && riskPct > 0 && riskPct < 100 && `${N - Math.round(fillPct * N)} more to surface`}
        {!isResolvePh && riskPct === 100  && 'all risks identified'}
        {isResolvePh  && riskPct > 0     && `${Math.round((1 - fillPct) * N)} of ${N} resolved`}
        {isResolvePh  && riskPct === 0   && 'all clear'}
      </div>
    </div>
  )
}

// ── Root component ────────────────────────────────────────────────────────────
export default function ProblemsAndSolutions() {
  const driverRef = useRef(null)
  const progress  = useScrollProgress(driverRef)
  // Extra phase at the end: last item stays active for one scroll step, then clears
  const PHASES    = 2 * N + 3
  const phase     = Math.min(PHASES - 1, Math.floor(progress * PHASES))

  const appearCount = Math.min(phase, N)
  const flipCount   = Math.max(0, Math.min(N, phase - N - 1))
  const isFlipPhase = phase > N
  // Active index: shows on the currently-flipping item (including the last one),
  // then clears on the extra final phase (phase === 2*N+2)
  const activeFlipIndex = isFlipPhase && flipCount <= N && phase < 2 * N + 2
    ? flipCount - 1
    : -1

  const arcFillPct    = isFlipPhase ? Math.max(0, (N - flipCount) / N) : appearCount / N
  const activeIdx     = Math.max(0, Math.min(N - 1, isFlipPhase ? flipCount - 1 : appearCount - 1))
  const activeCategory = appearCount > 0 ? ITEMS[activeIdx].category : ''
  const barValue      = (isFlipPhase ? flipCount : appearCount) / N * 100

  return (
    <div className={s.root}>
      {/* Fixed blueprint grid — separate div avoids stacking context on root */}
      <div className={s.gridBg} aria-hidden="true" />

      {/* ── TRANSITION ──────────────────────────────────────────────────────── */}
      <section className={s.transition}>
        <div className={s.transitionInner}>
          <div className={s.transitionEyebrow}>
            Nabih Youssef &amp; Associates · Tenant Improvement
          </div>
          <h2 className={s.transitionHeading}>
            TI projects look <em>routine.</em><br />
            When they go wrong,<br />
            <span>the risk compounds fast.</span>
          </h2>
          <p className={s.transitionSub}>
            Seven decisions made at the start of a project determine whether
            it runs smoothly — or becomes a source of delays, redesigns, and claims.
          </p>
          <div className={s.transitionDivider} />
          <p className={s.transitionCue}>Scroll to see what goes wrong — and how we fix it.</p>
        </div>
      </section>

      {/* ── SCROLL DRIVER ───────────────────────────────────────────────────── */}
      <div ref={driverRef} className={s.scrollDriver} style={{ height: `${PHASES * 45}vh` }}>
        <div className={s.stickyScene}>

          {/* ── LEFT SIDEBAR ── */}
          <div className={`${s.sidebar} ${isFlipPhase ? s.sidebarPos : s.sidebarNeg}`}>

            <div className={s.eyebrowStack}>
              <span className={`${s.eyebrow} ${!isFlipPhase ? s.eyebrowOn : ''}`}>Common Problems</span>
              <span className={`${s.eyebrow} ${ isFlipPhase ? s.eyebrowOn : ''}`}>Done Right</span>
            </div>

            <h2 className={s.sideTitle}>
              <span className={`${s.titleLayer} ${!isFlipPhase ? s.titleOn : ''}`}>THE<br/>RISK</span>
              <span className={`${s.titleLayer} ${ isFlipPhase ? s.titleOn : ''}`}>THE<br/>FIX</span>
            </h2>

            {/* Arc gauge */}
            <ArcGauge
              fillPct={arcFillPct}
              isResolvePh={isFlipPhase}
              activeCategory={activeCategory}
            />

            {/* Thick progress bar — counter removed (arc shows the number) */}
            <div className={s.progressWrap}>
              <div className={s.progressTrack}>
                <div
                  className={`${s.progressFill} ${isFlipPhase ? s.fillPos : s.fillNeg}`}
                  style={{ width: `${barValue}%` }}
                />
              </div>
            </div>

          </div>

          {/* ── RIGHT PANEL ── */}
          <div className={s.rightPanel}>
            {ITEMS.map((item, i) => {
              const visible  = appearCount > i
              const flipped  = flipCount > i
              const isActive = i === activeFlipIndex
              return (
                <div
                  key={i}
                  className={`${s.item} ${visible ? s.itemOn : ''} ${isActive ? s.itemActive : ''}`}
                >
                  {/* ✕ / ✓ icon — colour-blind friendly */}
                  <div className={`${s.iconWrap} ${!visible ? s.iconOff : flipped ? s.iconPos : s.iconNeg}`}>
                    {(!visible || !flipped)
                      ? <svg viewBox="0 0 16 16" fill="none" className={s.iconSvg} aria-label="problem">
                          <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                        </svg>
                      : <svg viewBox="0 0 16 16" fill="none" className={s.iconSvg} aria-label="resolved">
                          <path d="M3 8.5L6.5 12L13 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    }
                  </div>

                  <div className={s.itemContent}>
                    <div className={s.itemCat}>{item.category}</div>
                    <div className={s.layers}>
                      <div className={`${s.layer} ${!flipped ? s.layerOn : ''}`}>
                        <p className={s.itemText}>{item.neg}</p>
                      </div>
                      <div className={`${s.layer} ${flipped ? s.layerOn : ''}`}>
                        <div className={s.posRow}>
                          {/* Pencil appears on the actively flipping item, fades out once settled */}
                          <span className={`${s.pencilIcon} ${isActive ? s.pencilVisible : ''}`} aria-hidden="true">
                            <svg viewBox="0 0 16 16" fill="none" className={s.pencilSvg}>
                              <path d="M11.5 2.5a1.5 1.5 0 0 1 2 2L5 13l-3 1 1-3 8.5-8.5z"
                                stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </span>
                          {/* White text, handwrites left-to-right on flip. Key forces re-animation on each flip. */}
                          <p
                            key={`pos-${i}-${flipped}`}
                            className={`${s.itemText} ${s.posText} ${flipped ? s.posTextWrite : ''}`}
                          >
                            {item.pos}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              )
            })}
          </div>

        </div>
      </div>

      {/* ── CONTACT SECTION ─────────────────────────────────────────────────── */}
      <section className={s.contact}>
        <div className={s.contactInner}>
          <p className={s.contactEyebrow}>Ready to do it right?</p>
          <h2 className={s.contactHeading}>
            Let's talk about<br />
            <span>your TI project.</span>
          </h2>
          <p className={s.contactSub}>
            Structural expertise from day one — before decisions get expensive to undo.
          </p>
          <a href="mailto:info@nabihy.com" className={s.contactBtn}>
            Get in touch
            <svg viewBox="0 0 16 16" fill="none" className={s.contactArrow}>
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
          <div className={s.contactMeta}>
            <span>Nabih Youssef &amp; Associates</span>
            <span className={s.contactDot}>·</span>
            <span>Structural Engineers</span>
            <span className={s.contactDot}>·</span>
            <span>Los Angeles, CA</span>
          </div>
        </div>
      </section>

    </div>
  )
}
