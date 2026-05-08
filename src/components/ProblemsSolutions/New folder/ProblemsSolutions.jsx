import { useRef, useEffect, useState } from 'react'
import s from './ProblemsSolutions.module.css'

const ITEMS = [
  {
    category: 'Building Knowledge',
    neg: 'Treated as a generic structure — existing system not studied before design begins',
    pos: "Structural system studied early so design reflects how the building actually works",
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

const N = ITEMS.length                  // 7
const TOTAL_PHASES = 2 * N + 3         // 17  (0→N appear, N+1 buffer, N+2→2N+1 flip, 2N+2 done)

export default function ProblemsAndSolutions() {
  const [phase, setPhase] = useState(0)
  const driverRef = useRef(null)

  useEffect(() => {
    function onScroll() {
      const el = driverRef.current
      if (!el) return
      const rect  = el.getBoundingClientRect()
      const range = el.offsetHeight - window.innerHeight
      if (range <= 0) return
      const progress = Math.max(0, Math.min(1, -rect.top / range))
      setPhase(Math.min(TOTAL_PHASES - 1, Math.floor(progress * TOTAL_PHASES)))
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const appearCount  = Math.min(phase, N)
  const flipCount    = Math.max(0, Math.min(N, phase - N - 1))
  const isFlipPhase  = phase > N
  const barValue     = (isFlipPhase ? flipCount : appearCount) / N * 100

  return (
    <div className={s.root}>

      {/* ── HERO ──────────────────────────────────────────────────────────────── */}
      <section className={s.hero}>
        <p className={s.heroEyebrow}>Nabih Youssef &amp; Associates · Tenant Improvement Projects</p>
        <h1 className={s.heroTitle}>
          WHAT LOOKS<br /><span>SIMPLE</span><br />CAN BECOME<br /><span>COMPLICATED</span>
        </h1>
        <p className={s.heroSub}>
          Tenant improvements carry hidden structural consequences that are easy to underestimate at the start of a project.
        </p>
        <div className={s.heroScrollHint}>
          <span>Scroll to explore</span>
          <div className={s.scrollLine} />
        </div>
      </section>

      {/* ── SCROLL DRIVER ─────────────────────────────────────────────────────── */}
      <div ref={driverRef} style={{ height: `${TOTAL_PHASES * 40}vh` }}>
        <div className={s.stickyScene}>

          {/* Left sidebar */}
          <div className={`${s.sidebar} ${isFlipPhase ? s.sidebarPos : s.sidebarNeg}`}>

            <div className={s.eyebrowStack}>
              <span className={`${s.eyebrow} ${!isFlipPhase ? s.eyebrowOn : ''}`}>
                Common Problems
              </span>
              <span className={`${s.eyebrow} ${isFlipPhase ? s.eyebrowOn : ''}`}>
                Done Right
              </span>
            </div>

            <h2 className={s.sideTitle}>
              <span className={`${s.titleLayer} ${!isFlipPhase ? s.titleOn : ''}`}>
                THE<br />PROBLEM
              </span>
              <span className={`${s.titleLayer} ${isFlipPhase ? s.titleOn : ''}`}>
                DONE<br />RIGHT
              </span>
            </h2>

            <div className={s.progressWrap}>
              <div className={s.progressTrack}>
                <div
                  className={`${s.progressFill} ${isFlipPhase ? s.fillPos : s.fillNeg}`}
                  style={{ width: `${barValue}%` }}
                />
              </div>
              <span className={s.progressCount}>
                {isFlipPhase ? flipCount : appearCount}&thinsp;/&thinsp;{N}
              </span>
            </div>

          </div>

          {/* Right: item list */}
          <div className={s.rightPanel}>
            {ITEMS.map((item, i) => {
              const visible = appearCount > i
              const flipped = flipCount > i
              return (
                <div key={i} className={`${s.item} ${visible ? s.itemOn : ''}`}>

                  <div className={`${s.dot} ${visible ? (flipped ? s.dotPos : s.dotNeg) : s.dotOff}`} />

                  <div className={s.itemContent}>
                    <div className={s.itemCat}>{item.category}</div>
                    <div className={s.layers}>
                      <div className={`${s.layer} ${!flipped ? s.layerOn : ''}`}>
                        <p className={s.itemText}>{item.neg}</p>
                      </div>
                      <div className={`${s.layer} ${flipped ? s.layerOn : ''}`}>
                        <p className={`${s.itemText} ${s.posText}`}>{item.pos}</p>
                      </div>
                    </div>
                  </div>

                </div>
              )
            })}
          </div>

        </div>
      </div>

      {/* ── FOOTER ────────────────────────────────────────────────────────────── */}
      <footer className={s.footer}>
        <div className={s.footerLogo}>NYA</div>
        <p>Nabih Youssef &amp; Associates · Structural Engineers</p>
        <p>Tenant Improvement Projects · Problems &amp; Solutions</p>
      </footer>

    </div>
  )
}
