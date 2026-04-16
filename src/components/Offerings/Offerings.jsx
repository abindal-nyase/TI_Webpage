import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { offerings } from '../../data/offerings'
import { events } from '../../utils/analytics'
import styles from './Offerings.module.css'

export default function Offerings() {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section ref={ref} className={styles.section}>
      <div className={styles.inner}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <p className={styles.eyebrow}>§ 08 &nbsp;—&nbsp; Selected Offerings</p>
          <h2 className={styles.title}>What we deliver.</h2>
        </motion.div>

        <div className={styles.grid}>
          {offerings.map((offering, i) => (
            <motion.article
              key={offering.id}
              className={styles.card}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 + i * 0.08 }}
              onHoverStart={() => events.offeringHover(offering.label)}
            >
              <span className={styles.cardLabel}>{offering.label}</span>
              <p className={styles.cardDesc}>{offering.description}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
