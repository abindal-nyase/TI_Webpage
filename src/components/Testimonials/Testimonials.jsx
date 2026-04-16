import { useRef, useState } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { testimonials } from '../../data/testimonials'
import { events } from '../../utils/analytics'
import styles from './Testimonials.module.css'

export default function Testimonials() {
  const [index, setIndex] = useState(0)
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  const prev = () => setIndex((i) => (i - 1 + testimonials.length) % testimonials.length)
  const next = () => setIndex((i) => (i + 1) % testimonials.length)

  const current = testimonials[index]

  return (
    <section ref={ref} className={styles.section}>
      <div className={styles.inner}>
        <motion.p
          className={styles.eyebrow}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          onAnimationComplete={() => events.sectionView(9)}
        >
          § 09 &nbsp;—&nbsp; Client Voice
        </motion.p>

        <div className={styles.split}>
          <AnimatePresence mode="wait">
            <motion.div
              key={`quote-${index}`}
              className={styles.quoteCol}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <blockquote className={styles.quote}>"{current.quote}"</blockquote>
              <p className={styles.attribution}>
                {current.author} &nbsp;·&nbsp; {current.firm}
              </p>
            </motion.div>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.div
              key={`service-${index}`}
              className={styles.serviceCol}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <p className={styles.serviceHeading}>{current.serviceDetail.heading}</p>
              <p className={styles.serviceBody}>{current.serviceDetail.body}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className={styles.nav}>
          <button
            className={styles.navButton}
            onClick={prev}
            aria-label="Previous testimonial"
          >
            ←
          </button>
          <button
            className={styles.navButton}
            onClick={next}
            aria-label="Next testimonial"
          >
            →
          </button>
          <div className={styles.navDots}>
            {testimonials.map((_, i) => (
              <div
                key={i}
                className={`${styles.dot} ${i === index ? styles.dotActive : ''}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
