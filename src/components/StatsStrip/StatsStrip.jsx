import { useRef, useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import s from './StatsStrip.module.css'

const STATS = [
  { value: 400, suffix: '+', label: 'TI projects completed', note: 'across California' },
  { value: 95,  suffix: '%', label: 'repeat business rate', note: 'clients come back' },
  { value: 40,  suffix: '+', label: 'years of expertise', note: 'Nabih Youssef & Associates' },
]

const BREAKDOWN = [
  { label: 'Office & High-Rise', pct: 48, color: 'var(--accent)' },
  { label: 'Media & Entertainment', pct: 22, color: 'var(--text-muted)' },
  { label: 'Retail & Hospitality', pct: 18, color: 'var(--text-light)' },
  { label: 'Historic Renovation', pct: 12, color: 'var(--border)' },
]

function AnimatedCounter({ value, suffix, duration = 1.8 }) {
  const ref = useRef(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const obj = { val: 0 }
      gsap.to(obj, {
        val: value,
        duration,
        ease: 'power2.out',
        snap: { val: 1 },
        onUpdate: () => {
          if (ref.current) ref.current.textContent = Math.round(obj.val) + suffix
        },
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 82%',
          once: true,
        },
      })
    })
    return () => ctx.revert()
  }, [value, suffix, duration])

  return (
    <span ref={ref} className={s.counterValue}>
      0{suffix}
    </span>
  )
}

export default function StatsStrip() {
  const rootRef = useRef(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Stagger stat cards
      ScrollTrigger.batch(`.${s.statCard}`, {
        onEnter: (els) =>
          gsap.from(els, {
            autoAlpha: 0,
            y: 32,
            stagger: 0.12,
            duration: 0.8,
            ease: 'power3.out',
          }),
        start: 'top 85%',
        once: true,
      })

      // Bar fill animations
      gsap.utils.toArray(`.${s.barFill}`).forEach((bar) => {
        gsap.from(bar, {
          scaleX: 0,
          transformOrigin: 'left center',
          duration: 1.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: bar,
            start: 'top 85%',
            once: true,
          },
        })
      })

      // Label for breakdown
      gsap.from(`.${s.breakdownSection}`, {
        autoAlpha: 0,
        y: 24,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: `.${s.breakdownSection}`,
          start: 'top 82%',
          once: true,
        },
      })
    }, rootRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={rootRef} id="stats" className={s.root}>
      <div className={s.inner}>
        <span className={`u-label ${s.label}`}>By The Numbers</span>

        {/* Counter row */}
        <div className={s.statsRow}>
          {STATS.map(({ value, suffix, label, note }) => (
            <div key={label} className={s.statCard}>
              <div className={s.counterRow}>
                <AnimatedCounter value={value} suffix={suffix} />
              </div>
              <p className={s.statLabel}>{label}</p>
              <p className={s.statNote}>{note}</p>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className={s.divider} aria-hidden="true" />

        {/* Breakdown bar chart */}
        <div className={s.breakdownSection}>
          <h3 className={s.breakdownTitle}>Project breakdown by sector</h3>
          <div className={s.bars}>
            {BREAKDOWN.map(({ label, pct, color }) => (
              <div key={label} className={s.barRow}>
                <div className={s.barMeta}>
                  <span className={s.barLabel}>{label}</span>
                  <span className={s.barPct}>{pct}%</span>
                </div>
                <div className={s.barTrack}>
                  <div
                    className={s.barFill}
                    style={{ width: `${pct}%`, background: color }}
                    role="presentation"
                    aria-hidden="true"
                  />
                </div>
              </div>
            ))}
          </div>
          <p className={s.breakdownNote}>
            Based on 400+ TI projects delivered since 1979.
            Shift the narrative from "beautiful work" to "smart investment."
          </p>
        </div>
      </div>
    </section>
  )
}
