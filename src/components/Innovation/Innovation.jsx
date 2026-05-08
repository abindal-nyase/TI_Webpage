import { useRef, useEffect, useState } from 'react'
import s from './Innovation.module.css'

// ── Images (served from /public/innovation/) ──────────────────────────────────
const imgStairSide    = '/innovation/Under construction image from side.jpg'
const imgStairAngle   = '/innovation/Under construction image from top angle.jpg'
const imgStairTop     = '/innovation/Under construction image from top.png'
const imgJewelBefore  = '/innovation/Before showing columns and braces.JPG'
const imgJewelAfter1  = '/innovation/During construction showing hanged floors 1.jpg'
const imgJewelBefore2 = '/innovation/Before showing braces zoomed.JPG'
const imgJewelAfter2  = '/innovation/During construction showing hanged floors 2.jpg'
const imgCatPan       = '/innovation/Interior PAN.jpg'
const imgCatFrame     = '/innovation/Christ Cathedral - Space Frame.JPG'
const imgCatFrames    = '/innovation/Christ Cathedral - frames.JPG'

// ── Reveal wrapper ────────────────────────────────────────────────────────────
function Reveal({ children, className = '', delay = 0, style }) {
  const ref = useRef(null)
  const [vis, setVis] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVis(true); obs.unobserve(el) } },
      { threshold: 0.1 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`${s.reveal} ${vis ? s.inView : ''} ${className}`.trim()}
      style={{ ...(style || {}), ...(delay ? { transitionDelay: `${delay}s` } : {}) }}
    >
      {children}
    </div>
  )
}

// ── Stair narrative data ──────────────────────────────────────────────────────
const STAIR_NARR = [
  {
    step:  '01 — Concept',
    title: <>A STAIR THAT<br/>BREATHES</>,
    body: (
      <>
        <p>In most buildings, stairs are rigid — bolted between floors, unyielding. In this project, two floors were designed to move <em>independently</em> of one another, responding to seismic drift and live load deflection.</p>
        <p>The challenge: design a monumental spiral stair that connects them — elegantly, safely — without restraining that movement.</p>
      </>
    ),
    stats: [{ num: '2', label: 'Independent floors' }, { num: '±3″', label: 'Allowable drift' }],
  },
]

// One image per narrative step (3 available files; step 3 reuses step 0)
const STAIR_IMGS = [imgStairTop]

// ── Component ─────────────────────────────────────────────────────────────────
export default function Innovation() {
  const [step, setStep] = useState(0)
  const driverRef = useRef(null)

  // Scroll-driven stair narrative
  useEffect(() => {
    function onScroll() {
      const driver = driverRef.current
      if (!driver) return
      const rect = driver.getBoundingClientRect()
      const progress = Math.max(0, Math.min(1, -rect.top / (driver.offsetHeight - window.innerHeight)))
      setStep(Math.min(3, Math.floor(progress * 4)))
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className={s.root}>

      {/* ── NAV ─────────────────────────────────────────────────────────────── */}
      <nav className={s.nav}>
        <div className={s.navLogo}>NYA · Nabih Youssef &amp; Associates</div>
        <ul className={s.navLinks}>
          <li><a href="#stair">Spiral Stair</a></li>
          <li><a href="#jewel">Jewel Box</a></li>
          <li><a href="#cathedral">Christ Cathedral</a></li>
        </ul>
      </nav>

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section className={s.hero}>
        <p className={s.heroEyebrow}>Nabih Youssef &amp; Associates · Tenant Improvement Projects</p>
        <h1 className={s.heroTitle}>ENGI<span>NEER</span><br/>ING<br/>INNOV<span>ATION</span></h1>
        <p className={s.heroSub}>Three projects. Three structural breakthroughs. Each one a story of how bold thinking transforms the built environment.</p>
        <div className={s.heroScrollHint}>
          <span>Scroll to explore</span>
          <div className={s.scrollLine} />
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          PROJECT 1 · SPIRAL STAIR
      ══════════════════════════════════════════════════════════════════════ */}
      <section id="stair">

        <Reveal className={s.chHeader}>
          <span className={s.chLabel}>Project 01 · Spiral Stair</span>
          <h2 className={s.chTitle}>THE ELASTIC<br/>STAIR</h2>
        </Reveal>
        <div className={s.chDivider} />

        <div ref={driverRef} className={s.stairScrollDriver}>
          <div className={s.stairScene}>

            {/* Left: crossfading images + spring overlay */}
            <div className={s.stairImagePanel}>
              {STAIR_IMGS.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={STAIR_NARR[i].step}
                  className={`${s.stairImg} ${STAIR_IMGS.length > 1 && i !== step ? s.stairImgHidden : ''}`}
                />
              ))}
            </div>

            {/* Right: narrative blocks */}
            <div className={s.stairTextPanel}>
              {STAIR_NARR.map((narr, i) => (
                <div
                  key={i}
                  className={`${s.narrativeBlock} ${i === step ? s.narrativeBlockActive : ''}`}
                >
                  <span className={s.narrStep}>{narr.step}</span>
                  <h3 className={s.narrTitle}>{narr.title}</h3>
                  <div className={s.narrBody}>{narr.body}</div>
                  {narr.stats && (
                    <div className={s.statRow}>
                      {narr.stats.map((st, j) => (
                        <div key={j}>
                          <div className={s.statNum}>{st.num}</div>
                          <div className={s.statLabel}>{st.label}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          PROJECT 2 · THE JEWEL BOX
      ══════════════════════════════════════════════════════════════════════ */}
      <section id="jewel" className={s.jewelSection}>

        <Reveal className={s.chHeader}>
          <span className={s.chLabel}>Project 02 · Tenant Improvement</span>
          <h2 className={s.chTitle}>THE JEWEL<br/>BOX</h2>
        </Reveal>
        <div className={s.chDivider} />

        <div className={s.jewelLayout}>

          <div className={s.jewelText}>

            <Reveal>
              <span className={s.narrStep} style={{ display: 'block', marginBottom: '1rem' }}>The Problem</span>
              <h3 className={s.narrTitle} style={{ fontSize: 'clamp(2.2rem,4vw,4.5rem)', marginBottom: '1.5rem' }}>
                DENSE WITH<br/>STRUCTURE,<br/>STARVED OF SPACE
              </h3>
              <div className={s.narrBody}>
                <p>The existing building was a maze of internal columns and diagonal bracing — a legacy structural system that colonized the very space tenants needed. Floor plans were fragmented, sight lines broken, and the architecture's potential remained locked behind steel.</p>
              </div>
            </Reveal>

            {/* Before / After SVG diagram */}
            <Reveal className={s.transformDiagram} delay={0.15}>
              <div className={s.diagramCol}>
                <span className={s.diagramLabel}>Before</span>
                <svg className={s.diagramSvg} viewBox="0 0 120 160" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="5"  y="10"  width="110" height="8" fill="#333"/>
                  <rect x="5"  y="75"  width="110" height="8" fill="#333"/>
                  <rect x="5"  y="140" width="110" height="8" fill="#333"/>
                  {[18,35,52,69,86,103].map(x => (
                    <g key={x}>
                      <rect x={x} y="18" width="5" height="57" fill="#555"/>
                      <rect x={x} y="83" width="5" height="57" fill="#555"/>
                    </g>
                  ))}
                  <line x1="18" y1="18"  x2="90" y2="75"  stroke="#666" strokeWidth="2"/>
                  <line x1="90" y1="18"  x2="18" y2="75"  stroke="#666" strokeWidth="2"/>
                  <line x1="18" y1="83"  x2="90" y2="140" stroke="#666" strokeWidth="2"/>
                  <line x1="90" y1="83"  x2="18" y2="140" stroke="#666" strokeWidth="2"/>
                </svg>
              </div>
              <div className={s.diagramArrow}>→</div>
              <div className={s.diagramCol}>
                <span className={s.diagramLabel}>After</span>
                <svg className={s.diagramSvg} viewBox="0 0 120 160" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="5" y="5" width="110" height="30" fill="none" stroke="#c9a84c" strokeWidth="2"/>
                  <line x1="5"   y1="5"  x2="115" y2="35" stroke="#c9a84c" strokeWidth="1.5" opacity="0.5"/>
                  {[30,55,80,105].map(x => (
                    <line key={x} x1={x} y1="5" x2={x} y2="35" stroke="#c9a84c" strokeWidth="1" opacity="0.4"/>
                  ))}
                  <rect x="5"   y="35" width="8"   height="125" fill="#c9a84c" opacity="0.8"/>
                  <rect x="107" y="35" width="8"   height="125" fill="#c9a84c" opacity="0.8"/>
                  {[30,55,80].map(x => (
                    <g key={x}>
                      <line x1={x} y1="35" x2={x} y2="80"  stroke="#888" strokeWidth="1.5" strokeDasharray="3,3"/>
                      <line x1={x} y1="35" x2={x} y2="130" stroke="#888" strokeWidth="1.5" strokeDasharray="3,3"/>
                    </g>
                  ))}
                  <rect x="5" y="78"  width="110" height="5" fill="#555"/>
                  <rect x="5" y="128" width="110" height="5" fill="#555"/>
                </svg>
              </div>
            </Reveal>

            <Reveal delay={0.3}>
              <div className={s.narrBody}>
                <p>NYA's solution was radical in its clarity: <em>remove everything</em> from the interior. Four massive corner columns were introduced to carry enormous transfer trusses spanning the full width at the upper level. <strong>All intermediate floors were then hung from these trusses</strong> — suspended like a bridge deck — leaving the interior entirely column-free.</p>
              </div>
            </Reveal>

            <Reveal className={s.blastNote} delay={0.45}>
              <div className={s.blastNoteLabel}>Historical Precedent · Security Engineering</div>
              <p>This strategy echoes a celebrated principle in <strong>security-critical design</strong>. The <strong>Federal Reserve Bank of Minneapolis (1972, Gunnar Birkerts &amp; Associates)</strong> pioneered the suspended floor system in an institutional context — floors hung from a catenary cable between two above-grade towers — deliberately eliminating all ground-floor columns to prevent vehicle and blast intrusion into the banking floor. The logic is the same: <em>when the ground is the point of vulnerability, remove structure from it entirely.</em> NYA applied this same thinking not for security, but for spatial freedom.</p>
            </Reveal>

          </div>

          {/* Sticky image pair */}
          <div className={s.jewelImages}>
            <img src={imgJewelBefore} alt="Before — columns and braces" />
            <img src={imgJewelAfter2} alt="Suspended floors during construction" />
          </div>

        </div>

      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          PROJECT 3 · CHRIST CATHEDRAL
      ══════════════════════════════════════════════════════════════════════ */}
      <section id="cathedral" className={s.cathedralSection}>

        <Reveal className={s.chHeader}>
          <span className={s.chLabel}>Project 03 · Christ Cathedral</span>
          <h2 className={s.chTitle}>THE QUATER<br/>FOIL</h2>
        </Reveal>
        <div className={s.chDivider} />

        {/* Full-width panorama */}
        <Reveal style={{ lineHeight: 0 }}>
          <img src={imgCatPan} alt="Christ Cathedral interior panorama" className={s.cathedralFullImg} />
        </Reveal>

        <div className={s.cathedralBody}>

          <div className={s.cathedralText}>

            <Reveal>
              <span className={s.narrStep} style={{ display: 'block', marginBottom: '1rem' }}>The Challenge</span>
              <h3 className={s.narrTitle} style={{ fontSize: 'clamp(2rem,3.5vw,4rem)', marginBottom: '1.5rem' }}>
                FREEING THE<br/>LIGHT
              </h3>
              <div className={s.narrBody}>
                <p>The Crystal Cathedral — Philip Johnson's iconic 1980 glass structure — was acquired by the Roman Catholic Diocese of Orange and reimagined as Christ Cathedral. The transformation required more than aesthetic changes: the interior columns that had interrupted the vast, shimmering nave had to go.</p>
                <p>The building's structural system, a three-dimensional <em>space frame</em> of white-painted tubular steel members, was one of the largest ever constructed when built. It was also the key to the transformation.</p>
              </div>
            </Reveal>

            <Reveal delay={0.15}>
              <div className={s.narrBody} style={{ marginTop: '1.5rem' }}>
                <p>By redistributing loads through the existing space frame — which acts as an enormous three-dimensional truss spanning the full cathedral volume — NYA was able to eliminate interior support columns, opening a continuous, column-free nave of extraordinary scale.</p>
                <p>The quaterfoil plan geometry, with its four interlocking lobes, creates a centralised liturgical space that demands <em>complete openness</em>. Every sight line, every gathering moment, depends on the absence of obstruction.</p>
              </div>
            </Reveal>

            <Reveal className={s.nyaCredit} delay={0.3}>
              <div className={s.nyaCreditLabel}>NYA Contribution</div>
              <p>Nabih Youssef &amp; Associates served as the Structural Engineer of Record for the renovation, providing structural analysis, redesign of load paths through the existing space frame, and engineering for the removal of interior columns. The work required deep understanding of an unusual legacy system — the original space frame — and the creativity to turn its redundancy into an opportunity for transformation.</p>
            </Reveal>

          </div>

          <div className={s.cathedralImgSide}>
            <img src={imgCatFrame} alt="Christ Cathedral space frame detail" />
          </div>

        </div>

      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────────── */}
      <footer className={s.footer}>
        <div className={s.footerLogo}>NYA</div>
        <p>Nabih Youssef &amp; Associates · Structural Engineers</p>
        <p style={{ marginTop: '0.5rem' }}>Engineering Innovation · Tenant Improvement Projects</p>
      </footer>

    </div>
  )
}
