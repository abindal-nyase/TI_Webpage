import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { events } from '../../utils/analytics'
import styles from './FinalCTA.module.css'

export default function FinalCTA() {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section ref={ref} className={styles.section}>
      <motion.p
        className={styles.eyebrow}
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.6 }}
        onAnimationComplete={() => events.sectionView(11)}
      >
        § 11 &nbsp;—&nbsp; Let's Work Together
      </motion.p>

      <motion.h2
        className={styles.headline}
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.9, delay: 0.1 }}
      >
        Ready to move fast<br />on your next TI?
      </motion.h2>

      <motion.a
        href="mailto:info@nyase.com"
        className={styles.button}
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, delay: 0.3 }}
        onClick={events.ctaFinalClick}
      >
        Get in touch →
      </motion.a>

      <motion.img
        src="/nya-logomark.png"
        alt=""
        className={styles.logo}
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 0.4 } : {}}
        transition={{ duration: 0.8, delay: 0.5 }}
      />

      <motion.footer
        className={styles.footer}
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 0.6 } : {}}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        © {new Date().getFullYear()} Nabih Youssef &amp; Associates &nbsp;·&nbsp;
        <a href="https://www.nyase.com" className={styles.footerLink}>nyase.com</a>
      </motion.footer>
    </section>
  )
}
