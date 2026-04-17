import { useRef, useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import s from './TrustStatement.module.css'

export default function TrustStatement() {
  const rootRef  = useRef(null)
  const quoteRef = useRef(null)
  const metaRef  = useRef(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Upward emergence — Pattern 4
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top 72%',
          end: 'center center',
          scrub: 0.7,
          invalidateOnRefresh: true,
        },
      })

      tl.from(quoteRef.current, { yPercent: 22, autoAlpha: 0, ease: 'power3.out' })
        .from(metaRef.current,  { yPercent: 14, autoAlpha: 0, ease: 'power2.out' }, '-=0.3')
    }, rootRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={rootRef} id="trust" className={s.root}>
      <div className={s.inner}>
        <blockquote ref={quoteRef} className={s.quote}>
          <span className={s.quoteMark} aria-hidden="true">"</span>
          Over 95% of our work is repeat business.
          <br />
          <em>For a reason.</em>
        </blockquote>

        <div ref={metaRef} className={s.meta}>
          <span className={s.attribution}>Nabih Youssef &amp; Associates</span>
          <span className={s.divider} aria-hidden="true" />
          <span className={`u-label ${s.stat}`}>400+ TI projects across California</span>
        </div>
      </div>
    </section>
  )
}
