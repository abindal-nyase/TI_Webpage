import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '../../utils/gsap'
import { events } from '../../utils/analytics'
import styles from './TrustStatement.module.css'

export default function TrustStatement() {
  const sectionRef = useRef(null)
  const quoteRef   = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Pin section for dramatic pause
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: '+=80%',
        pin: true,
        pinSpacing: true,
      })

      // Fade in quote on scroll into view
      gsap.from(quoteRef.current, {
        opacity: 0,
        y: 40,
        duration: 1.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          toggleActions: 'play none none reverse',
        },
      })
    }, sectionRef)

    events.sectionView(3)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className={styles.inner}>
        <p className={styles.eyebrow}>§ 03 &nbsp;—&nbsp; Our Promise</p>
        <blockquote ref={quoteRef} className={styles.quote}>
          "We don't slow architects down.<br />We keep them moving."
        </blockquote>
        <div className={styles.rule} />
      </div>
    </section>
  )
}
