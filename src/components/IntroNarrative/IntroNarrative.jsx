import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { events } from '../../utils/analytics'
import styles from './IntroNarrative.module.css'

const fadeUp = {
  hidden:  { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.25, 0.1, 0.25, 1] } },
}

export default function IntroNarrative() {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  const handleView = () => events.sectionView(2)

  return (
    <section className={styles.section} ref={ref} onMouseEnter={handleView}>
      <div className={styles.inner}>
        <motion.p
          className={styles.eyebrow}
          variants={fadeUp}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          § 02 &nbsp;—&nbsp; Who We Are
        </motion.p>

        <motion.p
          data-col="1"
          className={styles.col}
          variants={fadeUp}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          transition={{ delay: 0.15 }}
        >
          Every occupied building tells a story of transformation. We are the structural engineers who make that transformation possible — working at the intersection of ambition, regulation, and the relentless pace of construction.
        </motion.p>

        <motion.p
          data-col="2"
          className={`${styles.col} ${styles.colSecondary}`}
          variants={fadeUp}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          transition={{ delay: 0.3 }}
        >
          {/* [PLACEHOLDER] Replace with NYA-approved copy that speaks directly to architects */}
          NYA's tenant improvement practice has delivered hundreds of projects across California — from Fortune 500 headquarters to landmark historic renovations. We don't add friction. We remove it.
        </motion.p>
      </div>
    </section>
  )
}
