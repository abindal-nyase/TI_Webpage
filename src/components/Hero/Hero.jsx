import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger, SplitText } from '../../utils/gsap'
import { events } from '../../utils/analytics'
import styles from './Hero.module.css'

export default function Hero() {
  const sectionRef   = useRef(null)
  const bgRef        = useRef(null)
  const headlineRef  = useRef(null)
  const eyebrowRef   = useRef(null)
  const scrollRef    = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Word-by-word headline reveal
      const split = new SplitText(headlineRef.current, { type: 'words' })
      gsap.from(split.words, {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.12,
        ease: 'power3.out',
        delay: 0.4,
      })

      // Eyebrow fade in after headline
      gsap.from(eyebrowRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.8,
        ease: 'power2.out',
        delay: 1.2,
      })

      // Scroll indicator fade in then pulse
      gsap.from(scrollRef.current, {
        opacity: 0,
        duration: 0.6,
        delay: 2,
        onComplete: () => {
          gsap.to(scrollRef.current, {
            opacity: 0.4,
            duration: 1,
            repeat: -1,
            yoyo: true,
            ease: 'power1.inOut',
          })
        },
      })

      // Parallax on background
      gsap.to(bgRef.current, {
        yPercent: 25,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })

      // Hide scroll indicator when user starts scrolling
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top+=100 top',
        onEnter: () => gsap.to(scrollRef.current, { opacity: 0, duration: 0.3 }),
      })
    }, sectionRef)

    // Track section view
    events.sectionView(1)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className={styles.section}>
      <div ref={bgRef} className={styles.bg} aria-hidden="true" />

      <img
        src="/nya-logomark.png"
        alt="Nabih Youssef & Associates"
        className={styles.logo}
      />

      <div className={styles.content}>
        <p ref={eyebrowRef} className={styles.eyebrow}>
          Tenant Improvement Practice &nbsp;·&nbsp; Nabih Youssef Associates
        </p>
        <h1 ref={headlineRef} className={styles.headline}>
          Tenant improvement.<br />Done right, every time.
        </h1>
      </div>

      <div ref={scrollRef} className={styles.scrollIndicator} aria-hidden="true">
        <span>scroll</span>
        <div className={styles.scrollArrow} />
      </div>
    </section>
  )
}
