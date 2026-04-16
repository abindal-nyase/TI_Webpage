import { useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { gsap } from '../../utils/gsap'
import { projectTypeData, permitWeeks } from '../../data/chartData'
import { events } from '../../utils/analytics'
import styles from './Charts.module.css'

export default function Charts() {
  const sectionRef  = useRef(null)
  const barRefs     = useRef([])
  const inView      = useInView(sectionRef, { once: true, margin: '-100px' })

  useEffect(() => {
    if (!inView) return

    const ctx = gsap.context(() => {
      barRefs.current.forEach((bar, i) => {
        const targetWidth = projectTypeData[i].pct + '%'
        gsap.fromTo(
          bar,
          { width: '0%' },
          {
            width: targetWidth,
            duration: 1.2,
            delay: i * 0.12,
            ease: 'power2.out',
          }
        )
      })
    }, sectionRef)

    events.sectionView(7)
    return () => ctx.revert()
  }, [inView])

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <p className={styles.eyebrow}>§ 07 &nbsp;—&nbsp; The Numbers</p>
          <h2 className={styles.title}>
            A track record that speaks for itself.
          </h2>
        </div>

        <div className={styles.grid}>
          <div className={styles.barChart}>
            {projectTypeData.map((item, i) => (
              <div key={item.label} className={styles.barRow}>
                <div className={styles.barLabel}>
                  <span className={styles.barName}>{item.label}</span>
                  <span className={styles.barPct}>{item.pct}%</span>
                </div>
                <div className={styles.barTrack}>
                  <div
                    ref={(el) => (barRefs.current[i] = el)}
                    className={styles.barFill}
                    style={{ width: 0 }}
                  />
                </div>
              </div>
            ))}
          </div>

          <motion.div
            className={styles.permitStat}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className={styles.permitValue}>
              ~{permitWeeks}
            </div>
            <div className={styles.permitUnit}>
              weeks avg<br />permit turnaround
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
