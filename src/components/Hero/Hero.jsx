import { useRef, useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import s from './Hero.module.css'

export default function Hero() {
  const rootRef   = useRef(null)
  const bgRef     = useRef(null)
  const line1Ref  = useRef(null)
  const line2Ref  = useRef(null)
  const metaRef   = useRef(null)
  const scrollRef = useRef(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // SplitText char reveals on load
      const split1 = SplitText.create(line1Ref.current, { type: 'chars', mask: 'chars' })
      const split2 = SplitText.create(line2Ref.current, { type: 'chars', mask: 'chars' })

      const tl = gsap.timeline({ delay: 0.25, defaults: { ease: 'power3.out' } })

      tl.from(split1.chars, { y: '110%', duration: 0.9, stagger: 0.022 })
        .from(split2.chars, { y: '110%', duration: 0.9, stagger: 0.022 }, '-=0.65')
        .from(metaRef.current, { autoAlpha: 0, y: 20, duration: 0.7 }, '-=0.4')
        .from(scrollRef.current, { autoAlpha: 0, y: 10, duration: 0.6 }, '-=0.2')

      // Parallax: bg moves slower than scroll
      gsap.to(bgRef.current, {
        yPercent: 22,
        ease: 'none',
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
          invalidateOnRefresh: true,
        },
      })
    }, rootRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={rootRef} id="hero" className={s.hero}>
      {/* Background image with overlay */}
      <div ref={bgRef} className={s.bg} aria-hidden="true" />
      <div className={s.overlay} aria-hidden="true" />

      <div className={s.content}>
        <span className={`u-label ${s.label}`}>
          Nabih Youssef &amp; Associates · Partners · Advisory · Service
        </span>

        <h1 className={s.headline}>
          <span ref={line1Ref} className={s.line1}>
            TI Projects Don't Wait.
          </span>
          <span ref={line2Ref} className={s.line2}>
            Neither Do We.
          </span>
        </h1>

        <div ref={metaRef} className={s.meta}>
          <p className={s.tagline}>
            Speed. Precision. Structural expertise — from lobby to penthouse.
          </p>
          <a
            href="mailto:info@nyase.com"
            className={s.cta}
            aria-label="Contact NYA about your TI project"
          >
            Start the Conversation
            <span className={s.ctaArrow} aria-hidden="true">
              →
            </span>
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div ref={scrollRef} className={s.scrollIndicator} aria-hidden="true">
        <span className={s.scrollLine} />
        <span className={s.scrollLabel}>Scroll</span>
      </div>
    </section>
  );
}
