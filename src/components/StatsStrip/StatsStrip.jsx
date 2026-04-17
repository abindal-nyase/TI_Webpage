import { useRef, useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import s from './StatsStrip.module.css'

const PROJECT_HISTORY = [
  { year: 1988, count: 3 },
  { year: 1989, count: 4 },
  { year: 1990, count: 5 },
  { year: 1991, count: 6 },
  { year: 1992, count: 7 },
  { year: 1993, count: 9 },
  { year: 1994, count: 10 },
  { year: 1995, count: 11 },
  { year: 1996, count: 12 },
  { year: 1997, count: 11 },
  { year: 1998, count: 12 },
  { year: 1999, count: 13 },
  { year: 2000, count: 14 },
  { year: 2001, count: 10 },
  { year: 2002, count: 9 },
  { year: 2003, count: 11 },
  { year: 2004, count: 12 },
  { year: 2005, count: 13 },
  { year: 2006, count: 14 },
  { year: 2007, count: 14 },
  { year: 2008, count: 9 },
  { year: 2009, count: 7 },
  { year: 2010, count: 8 },
  { year: 2011, count: 10 },
  { year: 2012, count: 12 },
  { year: 2013, count: 13 },
  { year: 2014, count: 14 },
  { year: 2015, count: 15 },
  { year: 2016, count: 16 },
  { year: 2017, count: 15 },
  { year: 2018, count: 16 },
  { year: 2019, count: 17 },
  { year: 2020, count: 8 },
  { year: 2021, count: 9 },
  { year: 2022, count: 13 },
  { year: 2023, count: 14 },
  { year: 2024, count: 15 },
  { year: 2025, count: 16 },
  { year: 2026, count: 10, partial: true },
];

const YEAR_LABELS = new Set([1988, 2000, 2010, 2020, 2026]);
const CHART_H = 140;
const Y_TICKS = [5, 10, 15];
const MAX_COUNT = Math.max(...PROJECT_HISTORY.map((d) => d.count));

function YearlyChart() {
  const chartRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const bars = chartRef.current.querySelectorAll("[data-bar]");
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: chartRef.current,
          start: "top 82%",
          end: "top 50%",
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
      tl.from(bars, {
        scaleY: 0,
        transformOrigin: "bottom center",
        duration: 1.4,
        ease: "none",
        stagger: 0.028,
      });
    }, chartRef);
    return () => ctx.revert();
  }, []);

  return (
    <div className={s.chartSection}>
      <h3 className={s.breakdownTitle}>TI projects per year, 1988–2026</h3>
      <div ref={chartRef} className={s.chart}>
        <div className={s.chartPlot}>
          {Y_TICKS.map((v) => (
            <span
              key={v}
              className={s.yLabel}
              style={{ bottom: `${(v / MAX_COUNT) * 100}%` }}
            >
              {v}
            </span>
          ))}
          {Y_TICKS.map((v) => (
            <div
              key={v}
              className={s.gridLine}
              style={{ bottom: `${(v / MAX_COUNT) * 100}%` }}
            />
          ))}
          <div className={s.chartBars}>
            {PROJECT_HISTORY.map(({ year, count, partial }) => (
              <div
                key={year}
                className={`${s.chartBarWrap} ${partial ? s.chartBarWrapPartial : ""}`}
              >
                <div
                  data-bar
                  className={`${s.chartBar} ${partial ? s.chartBarPartial : ""}`}
                  style={{ height: `${(count / MAX_COUNT) * 100}%` }}
                  title={
                    partial ? `${year}: ${count} so far` : `${year}: ${count}`
                  }
                />
                {YEAR_LABELS.has(year) && (
                  <span
                    className={`${s.chartYearLabel} ${partial ? s.chartYearLabelPartial : ""}`}
                  >
                    {year}
                    {partial ? "*" : ""}
                  </span>
                )}
              </div>
            ))}
          </div>
          <div className={s.chartAxis} />
        </div>
      </div>
      <p className={s.chartNote}>
        * 2026 year in progress — 10 projects completed to date.
      </p>
    </div>
  );
}

const STATS = [
  {
    value: 400,
    suffix: "+",
    label: "TI projects completed",
    note: "across California",
  },
  {
    value: 95,
    suffix: "%",
    label: "repeat business rate",
    note: "clients come back",
  },
  {
    value: 35,
    suffix: "+",
    label: "years of expertise",
    note: "Nabih Youssef & Associates",
  },
];

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
          invalidateOnRefresh: true,
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
        invalidateOnRefresh: true,
      })

      // Bar fill animations
      gsap.utils.toArray(`.${s.barFill}`).forEach((bar) => {
        gsap.from(bar, {
          scaleX: 0,
          transformOrigin: "left center",
          duration: 1.1,
          ease: "none",
          scrollTrigger: {
            trigger: bar,
            start: "top 85%",
            end: "top 50%",
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });
      })

      // Label for breakdown
      gsap.from(`.${s.breakdownSection}`, {
        autoAlpha: 0,
        y: 24,
        duration: 0.8,
        ease: "none",
        scrollTrigger: {
          trigger: `.${s.breakdownSection}`,
          start: "top 82%",
          end: "top 50%",
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
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

        {/* Yearly project chart */}
        <YearlyChart />

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
            Based on 400+ TI projects delivered since 1979. Every number above
            is a building we already know.
          </p>
        </div>
      </div>
    </section>
  );
}
