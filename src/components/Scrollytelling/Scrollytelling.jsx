import { useRef } from 'react'
import { useIsomorphicLayoutEffect as useLayoutEffect } from '../../hooks/useIsomorphicLayoutEffect'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import s from './Scrollytelling.module.css'

// ─── Data ─────────────────────────────────────────────────────────────────────

const CHAPTERS = [
  {
    eyebrow: 'The Problem',
    headline: "Spaces that don't work cost more than you think.",
    body: "Outdated floor plans, misaligned systems, and inefficient layouts silently drain productivity — and budgets. Most tenants don't realize how much is being lost until they see what's possible.",
    accent: '#B5451B',
    statNum: '37', statSuffix: '%',
    statLabel: 'of office space is functionally underutilized',
  },
  {
    eyebrow: 'The Opportunity',
    headline: 'The right TI partner changes everything.',
    body: "A well-executed tenant improvement isn't just a renovation — it's a strategic move. The right engineering partner brings speed, coordination, and field experience that reduces surprises and accelerates delivery.",
    accent: '#1C6F54',
    statNum: '2.4', statSuffix: '×',
    statLabel: 'average ROI multiplier on optimized TI projects',
  },
  {
    eyebrow: 'The Difference',
    headline: 'Done fast. Done right. Done without drama.',
    body: "NYA's TI teams are embedded in the process from day one — not handed drawings to execute. That means decisions get made faster, conflicts get resolved in the field, and projects land on time.",
    accent: '#1C3F6F',
    statNum: '94', statSuffix: '%',
    statLabel: 'of NYA TI projects delivered on schedule',
  },
]

const STATS = [
  { end: 200, suffix: '+', decimals: 0, label: 'TI Projects Completed' },
  { end: 4.2,  suffix: 'M', decimals: 1, label: 'Sq. Ft. Transformed'   },
  { end: 31,   suffix: '',  decimals: 0, label: 'Years of TI Experience' },
  { end: 98,   suffix: '%', decimals: 0, label: 'Client Retention Rate'  },
]

const TIMELINE = [
  { num: '01', title: 'Discovery & Programming',   desc: "Understanding the tenant's operational needs, headcount projections, and technical constraints before a single line is drawn." },
  { num: '02', title: 'Design Coordination',        desc: 'Embedded with the design team — resolving MEP conflicts in BIM before they become expensive field changes.' },
  { num: '03', title: 'Permitting & Approvals',     desc: 'We know local jurisdictions and AHJ relationships. Faster stamps, fewer re-submission cycles.' },
  { num: '04', title: 'Construction Administration',desc: 'On-site presence, rapid RFI response, and real-time problem-solving that keeps the GC moving.' },
  { num: '05', title: 'Closeout & Handoff',         desc: 'Complete as-built documentation, O&M manuals, and post-occupancy follow-up — the relationship doesn\'t end at substantial completion.' },
]

const TECHNIQUES = [
  'SplitText — character stagger reveal',
  'ScrollTrigger — sticky panel crossfade',
  'GSAP proxy object — count-up animation',
  'ScrollTrigger scrub — scaleY line draw',
  'ScrollTrigger scrub — clip-path wipe reveal',
  'SplitText — word-by-word stagger',
]

// ─── Component ────────────────────────────────────────────────────────────────

export default function Scrollytelling() {
  // Educational badge (direct DOM update — no re-render)
  const badgeRef    = useRef(null)
  const badgeLabelRef = useRef(null)

  // Section refs
  const introRef    = useRef(null)
  const introTitleRef = useRef(null)
  const introSubRef   = useRef(null)
  const scrollIndRef  = useRef(null)

  const chaptersRef  = useRef(null)
  const chapterRefs  = useRef([])
  const panelRefs    = useRef([])

  const statsRef     = useRef(null)
  const statNumRefs  = useRef([])

  const timelineRef  = useRef(null)
  const tlLineRef    = useRef(null)
  const tlItemRefs   = useRef([])

  const baRef        = useRef(null)
  const baRevealRef  = useRef(null)
  const baProgRef    = useRef(null)

  const outroRef     = useRef(null)
  const outroTitleRef = useRef(null)
  const outroCtaRef   = useRef(null)

  // ── Badge helper ────────────────────────────────────────────────────────────
  function showBadge(index) {
    const el = badgeLabelRef.current
    if (!el) return
    gsap.to(badgeRef.current, { opacity: 0, y: -6, duration: 0.2, onComplete() {
      el.textContent = TECHNIQUES[index]
      gsap.to(badgeRef.current, { opacity: 1, y: 0, duration: 0.3 })
    }})
  }

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger, SplitText)

    const ctx = gsap.context(() => {

      // ── Section visibility badges ──────────────────────────────────────────
      const sections = [
        introRef, chaptersRef, statsRef, timelineRef, baRef, outroRef,
      ]
      sections.forEach((ref, i) => {
        ScrollTrigger.create({
          trigger: ref.current,
          start: 'top 55%',
          onEnter:     () => showBadge(i),
          onEnterBack: () => showBadge(i),
        })
      })

      // ─────────────────────────────────────────────────────────────────────
      // TECHNIQUE 1 — SplitText character stagger reveal
      // Each character is wrapped by SplitText, given overflow clip via a
      // wordsClass wrapper, then animated from yPercent: 110 upward.
      // The words container (overflow: hidden) masks chars below baseline.
      // ─────────────────────────────────────────────────────────────────────
      const titleSplit = new SplitText(introTitleRef.current, {
        type: 'chars,words',
        wordsClass: s.splitWord,   // overflow: hidden wrapper per word
      })

      gsap.set(titleSplit.chars, { yPercent: 110, opacity: 0 })
      gsap.set([introSubRef.current, scrollIndRef.current], { opacity: 0, y: 20 })

      gsap.timeline({ delay: 0.25 })
        .to(titleSplit.chars, {
          yPercent: 0,
          opacity: 1,
          ease: 'power3.out',
          duration: 0.9,
          stagger: { each: 0.022 },
        })
        .to(introSubRef.current, {
          opacity: 1, y: 0,
          ease: 'power2.out', duration: 0.65,
        }, '-=0.45')
        .to(scrollIndRef.current, {
          opacity: 1, y: 0,
          ease: 'power2.out', duration: 0.5,
        }, '-=0.3')

      // Scroll caret bounce (infinite, non-scroll-linked)
      gsap.to(scrollIndRef.current, {
        y: 10, repeat: -1, yoyo: true,
        ease: 'sine.inOut', duration: 1.1, delay: 1.2,
      })

      // ─────────────────────────────────────────────────────────────────────
      // TECHNIQUE 2 — ScrollTrigger sticky panel crossfade
      // Each chapter in the left column has its own ScrollTrigger.
      // onEnter / onEnterBack fire when the chapter center crosses the
      // viewport midpoint, triggering a gsap.to crossfade on the right panel.
      // ─────────────────────────────────────────────────────────────────────
      gsap.set(panelRefs.current[0], { opacity: 1, yPercent: 0 })
      gsap.set(panelRefs.current.slice(1), { opacity: 0, yPercent: 10 })

      function crossfade(to) {
        panelRefs.current.forEach((panel, i) => {
          gsap.to(panel, {
            opacity:  i === to ? 1 : 0,
            yPercent: i === to ? 0 : -8,
            duration: 0.6,
            ease: 'power2.inOut',
            overwrite: 'auto',
          })
        })
      }

      chapterRefs.current.forEach((item, i) => {
        // Slide in chapter text
        const content = item.querySelector('[data-content]')
        gsap.fromTo(content,
          { opacity: 0, x: -28 },
          {
            opacity: 1, x: 0,
            ease: 'power2.out', duration: 0.7,
            scrollTrigger: { trigger: item, start: 'top 68%', once: true },
          }
        )

        // Panel switch on chapter enter
        ScrollTrigger.create({
          trigger: item,
          start: 'top center',
          end: 'bottom center',
          onEnter:     () => crossfade(i),
          onEnterBack: () => crossfade(i),
        })
      })

      // ─────────────────────────────────────────────────────────────────────
      // TECHNIQUE 3 — Count-up via GSAP proxy object
      // GSAP animates { val: 0 } → { val: target }. The onUpdate callback
      // writes the current value back to the DOM. No state, no re-renders.
      // ─────────────────────────────────────────────────────────────────────
      gsap.fromTo(
        statsRef.current?.querySelectorAll('[data-stat-card]') ?? [],
        { opacity: 0, y: 36 },
        {
          opacity: 1, y: 0,
          stagger: 0.1, duration: 0.65, ease: 'power2.out',
          scrollTrigger: { trigger: statsRef.current, start: 'top 72%', once: true },
        }
      )

      statNumRefs.current.forEach((el, i) => {
        if (!el) return
        const { end, suffix, decimals } = STATS[i]
        const proxy = { val: 0 }
        gsap.to(proxy, {
          val: end,
          ease: 'power2.out',
          duration: 2.4,
          onUpdate() {
            el.textContent =
              (decimals ? proxy.val.toFixed(decimals) : Math.round(proxy.val)) + suffix
          },
          scrollTrigger: { trigger: el, start: 'top 82%', once: true },
        })
      })

      // ─────────────────────────────────────────────────────────────────────
      // TECHNIQUE 4 — ScrollTrigger scrub + scaleY line draw
      // A 2px div starts at scaleY: 0 (transform-origin: top center).
      // ScrollTrigger links scroll progress → scaleY via scrub: 1.
      // Timeline items stagger in independently via their own triggers.
      // ─────────────────────────────────────────────────────────────────────
      gsap.fromTo(tlLineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          transformOrigin: 'top center',
          ease: 'none',
          scrollTrigger: {
            trigger: timelineRef.current,
            start: 'top 55%',
            end:   'bottom 75%',
            scrub: 1.2,
          },
        }
      )

      tlItemRefs.current.forEach((item, i) => {
        gsap.fromTo(item,
          { opacity: 0, x: 28 },
          {
            opacity: 1, x: 0,
            duration: 0.65, ease: 'power2.out',
            scrollTrigger: { trigger: item, start: 'top 78%', once: true },
          }
        )
      })

      // ─────────────────────────────────────────────────────────────────────
      // TECHNIQUE 5 — clip-path scrub wipe reveal
      // baRef is 250 vh tall. baPinned inside it is position: sticky; 100 vh.
      // baRevealRef (the "After" panel) starts fully clipped from the right:
      //   clip-path: inset(0 100% 0 0)
      // As the scroll spacer scrolls by, scrub drives it to:
      //   clip-path: inset(0 0% 0 0)  — fully visible.
      // ─────────────────────────────────────────────────────────────────────
      gsap.fromTo(baRevealRef.current,
        { clipPath: 'inset(0 100% 0 0)' },
        {
          clipPath: 'inset(0 0% 0 0)',
          ease: 'none',
          scrollTrigger: {
            trigger: baRef.current,
            start: 'top top',
            end:   'bottom bottom',
            scrub: 0.8,
          },
        }
      )

      // Progress indicator bar (mirrors the clip-path scrub)
      gsap.fromTo(baProgRef.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          transformOrigin: 'left center',
          ease: 'none',
          scrollTrigger: {
            trigger: baRef.current,
            start: 'top top',
            end:   'bottom bottom',
            scrub: 0.8,
          },
        }
      )

      // ─────────────────────────────────────────────────────────────────────
      // TECHNIQUE 6 — SplitText word-by-word stagger
      // Same as Technique 1 but splits at the word level, not char level.
      // Each word animates in with a 0.05s stagger — reads as a
      // "typewriter-like" phrase build that draws the eye left-to-right.
      // ─────────────────────────────────────────────────────────────────────
      if (outroTitleRef.current) {
        const outroSplit = new SplitText(outroTitleRef.current, {
          type: 'words',
          wordsClass: s.splitWord,
        })
        gsap.fromTo(outroSplit.words,
          { opacity: 0, y: 20 },
          {
            opacity: 1, y: 0,
            stagger: 0.055, duration: 0.55, ease: 'power2.out',
            scrollTrigger: {
              trigger: outroRef.current,
              start: 'top 70%',
              once: true,
            },
          }
        )
      }

      gsap.fromTo(outroCtaRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0,
          duration: 0.6, ease: 'power2.out', delay: 0.6,
          scrollTrigger: {
            trigger: outroRef.current,
            start: 'top 65%',
            once: true,
          },
        }
      )
    })

    return () => ctx.revert()
  }, [])

  // ─── JSX ──────────────────────────────────────────────────────────────────

  return (
    <div className={s.root}>

      {/* ── Educational floating badge ──────────────────────────────────── */}
      <div ref={badgeRef} className={s.badge} aria-hidden="true">
        <span className={s.badgeDot} />
        <span ref={badgeLabelRef} className={s.badgeLabel}>{TECHNIQUES[0]}</span>
      </div>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* 1 · INTRO — SplitText character stagger                          */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <section ref={introRef} className={s.intro} aria-label="Introduction">
        <div className={s.introInner}>
          <span className={s.introEyebrow}>Scrollytelling Lab — NYA Tenant Improvements</span>
          <h1 ref={introTitleRef} className={s.introTitle}>
            The story of a space, told through scroll.
          </h1>
          <p ref={introSubRef} className={s.introSub}>
            Each section ahead demonstrates a different scroll animation technique built with
            GSAP + ScrollTrigger. Watch the badge in the top-right corner as you move through.
          </p>
        </div>
        <div ref={scrollIndRef} className={s.scrollInd} aria-hidden="true">
          <div className={s.scrollMouse}>
            <div className={s.scrollDot} />
          </div>
          <span className={s.scrollLabel}>scroll to explore</span>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* 2 · CHAPTERS — sticky panel crossfade                            */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <section ref={chaptersRef} className={s.chapters} aria-label="Our perspective">
        <div className={s.chaptersLayout}>

          {/* Left: scrolling text chapters */}
          <div className={s.chaptersLeft}>
            {CHAPTERS.map((ch, i) => (
              <div
                key={i}
                ref={el => { chapterRefs.current[i] = el }}
                className={s.chapterItem}
              >
                <div data-content className={s.chapterContent}>
                  <span className={s.chapterEyebrow} style={{ color: ch.accent }}>
                    {ch.eyebrow}
                  </span>
                  <h2 className={s.chapterHeadline}>{ch.headline}</h2>
                  <p className={s.chapterBody}>{ch.body}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Right: sticky crossfade panels */}
          <div className={s.chaptersRight}>
            <div className={s.panelWrap}>
              {CHAPTERS.map((ch, i) => (
                <div
                  key={i}
                  ref={el => { panelRefs.current[i] = el }}
                  className={s.panel}
                  style={{ background: ch.accent }}
                >
                  <div className={s.panelInner}>
                    <p className={s.panelNum}>{ch.statNum}{ch.statSuffix}</p>
                    <p className={s.panelStatLabel}>{ch.statLabel}</p>
                    <span className={s.panelCount}>
                      {String(i + 1).padStart(2, '0')} / {String(CHAPTERS.length).padStart(2, '0')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* 3 · STATS — proxy object count-up                                */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <section ref={statsRef} className={s.stats} aria-label="Key statistics">
        <div className={s.statsInner}>
          <header className={s.statsHeader}>
            <span className={s.sectionLabel}>By the numbers</span>
            <h2 className={s.statsHeadline}>
              Decades of delivery, distilled into four numbers.
            </h2>
          </header>
          <div className={s.statsGrid}>
            {STATS.map((stat, i) => (
              <div key={i} data-stat-card className={s.statCard}>
                <span
                  ref={el => { statNumRefs.current[i] = el }}
                  className={s.statNum}
                >
                  0{stat.suffix}
                </span>
                <span className={s.statCardLabel}>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* 4 · TIMELINE — scaleY line draw + stagger                        */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <section ref={timelineRef} className={s.timeline} aria-label="Our process">
        <div className={s.timelineInner}>
          <header className={s.timelineHeader}>
            <span className={s.sectionLabel}>The process</span>
            <h2 className={s.timelineHeadline}>
              How we move from concept to completion.
            </h2>
          </header>

          <div className={s.timelineBody}>
            {/* Animated vertical line */}
            <div className={s.timelineTrack}>
              <div ref={tlLineRef} className={s.timelineLine} />
            </div>

            {/* Timeline items */}
            <div className={s.timelineItems}>
              {TIMELINE.map((item, i) => (
                <div
                  key={i}
                  ref={el => { tlItemRefs.current[i] = el }}
                  className={s.timelineItem}
                >
                  <div className={s.timelineDot} />
                  <span className={s.timelineNum}>{item.num}</span>
                  <div>
                    <h3 className={s.timelineTitle}>{item.title}</h3>
                    <p className={s.timelineDesc}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* 5 · BEFORE / AFTER — clip-path scrub wipe                        */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <section ref={baRef} className={s.ba} aria-label="Before and after">
        <div className={s.baPinned}>

          {/* Before panel (always visible beneath) */}
          <div className={s.baBefore}>
            <div className={s.baContent}>
              <span className={s.baTag}>Before</span>
              <h2 className={s.baTitle}>Disconnected systems. Misaligned spaces.</h2>
              <p className={s.baDesc}>
                Outdated MEP infrastructure, non-compliant layouts, and inefficient
                use of floor area — symptoms of a space that was never really designed.
              </p>
              <ul className={s.baList}>
                <li>Aging HVAC with unbalanced zones</li>
                <li>1990s lighting — no daylighting strategy</li>
                <li>Under-utilized conference room clusters</li>
                <li>No modern tech or AV infrastructure</li>
              </ul>
            </div>
            <div className={s.baVisual} data-side="before" aria-hidden="true">
              <span>B</span>
            </div>
          </div>

          {/* After panel — clips in left-to-right via clip-path scrub */}
          <div ref={baRevealRef} className={s.baAfter}>
            <div className={s.baContent} style={{ color: 'white' }}>
              <span className={s.baTag} style={{ color: 'rgba(255,255,255,0.5)' }}>After</span>
              <h2 className={s.baTitle} style={{ color: 'white' }}>
                Coordinated. Optimized. Delivered.
              </h2>
              <p className={s.baDesc} style={{ color: 'rgba(255,255,255,0.72)' }}>
                New MEP systems aligned with design intent, code-compliant, and
                built to serve the next 15 years of tenant operations.
              </p>
              <ul className={s.baList} style={{ color: 'rgba(255,255,255,0.8)' }}>
                <li>VAV redesign with energy recovery ventilation</li>
                <li>LED + daylight-harvesting sensors throughout</li>
                <li>Raised access floor with flexible workstation grids</li>
                <li>Structured cabling + AV infrastructure pre-installed</li>
              </ul>
            </div>
            <div className={s.baVisual} data-side="after" aria-hidden="true">
              <span>A</span>
            </div>
          </div>

          {/* Scrub progress bar */}
          <div ref={baProgRef} className={s.baProgress} aria-hidden="true" />

          {/* Label hints */}
          <div className={s.baHints} aria-hidden="true">
            <span>← scroll to reveal</span>
            <span>After →</span>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* 6 · OUTRO — word-by-word stagger                                 */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <section ref={outroRef} className={s.outro} aria-label="Call to action">
        <div className={s.outroInner}>
          <h2 ref={outroTitleRef} className={s.outroTitle}>
            Ready to transform your space? Let's talk about what's possible.
          </h2>
          <div ref={outroCtaRef} className={s.outroCta}>
            <a href="/option1" className={s.ctaBtn}>See Our Work</a>
            <a href="/option1" className={s.ctaGhost}>Explore the full site →</a>
          </div>
        </div>
      </section>

    </div>
  )
}
