import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '../../utils/gsap'
import { stats } from '../../data/stats'
import { events } from '../../utils/analytics'
import styles from './StatsStrip.module.css'

export default function StatsStrip() {
  const sectionRef = useRef(null)
  const valueRefs  = useRef([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Stagger fade-up on section enter
      gsap.from(valueRefs.current, {
        opacity: 0,
        y: 30,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
      })
    }, sectionRef)

    events.sectionView(4)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className={styles.inner}>
        {stats.map((stat, i) => (
          <div key={stat.id} className={styles.stat}>
            <span
              ref={(el) => (valueRefs.current[i] = el)}
              className={styles.value}
            >
              {stat.display}
            </span>
            <span className={styles.label}>{stat.label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
