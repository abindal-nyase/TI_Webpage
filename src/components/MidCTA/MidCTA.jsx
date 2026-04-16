import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { events } from '../../utils/analytics'
import styles from './MidCTA.module.css'

export default function MidCTA() {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section ref={ref} className={styles.section}>
      <div className={styles.inner}>
        <motion.p
          className={styles.text}
          initial={{ opacity: 0, x: -30 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        >
          Working on a TI project? Let's talk.
        </motion.p>

        <motion.a
          href="mailto:info@nyase.com"
          className={styles.button}
          initial={{ opacity: 0, x: 30 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
          onClick={events.ctaMidClick}
        >
          info@nyase.com &nbsp;→
        </motion.a>
      </div>
    </section>
  )
}
