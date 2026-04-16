import { useRef, useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import s from './FinalCTA.module.css'

export default function FinalCTA() {
  const rootRef   = useRef(null)
  const textRef   = useRef(null)
  const btnRef    = useRef(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Upward emergence — earned arrival
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top 75%',
          once: true,
        },
        defaults: { ease: 'power3.out' },
      })

      tl.from(textRef.current.children, {
        autoAlpha: 0,
        y: 40,
        stagger: 0.14,
        duration: 0.85,
      }).from(btnRef.current, {
        autoAlpha: 0,
        y: 20,
        duration: 0.7,
      }, '-=0.3')
    }, rootRef)

    return () => ctx.revert()
  }, [])

  return (
    <footer ref={rootRef} id="final-cta" className={s.root}>
      <div className={s.inner}>
        {/* Main CTA */}
        <div ref={textRef} className={s.textBlock}>
          <span className={`u-label ${s.label}`}>
            For Those Who Have to Deliver: Fast, Clean, and Confidently
          </span>

          <h2 className={s.heading}>Let's build something.</h2>
          <h2 className={s.headingItalic}>Fast, beautiful, and smart.</h2>
          <p className={s.sub}>
            If you're an architect juggling a demanding client and a stacked
            schedule, we're the engineers you want on speed dial.
            <br />
            Bring us your tight timelines, your tangled gridlines, your
            last-minute stair.
            <br />
            We'll bring the clarity, commitment, and structural know-how to get
            it done right.
          </p>
        </div>

        <div ref={btnRef} className={s.actions}>
          <a
            href="mailto:info@nyase.com"
            className={s.btn}
            aria-label="Email NYA Tenant Improvement practice"
          >
            info@nyase.com
          </a>
          <a
            href="https://www.nyase.com"
            target="_blank"
            rel="noopener noreferrer"
            className={s.linkOut}
          >
            Visit nyase.com →
          </a>
        </div>

        {/* Footer bar */}
        <div className={s.footerBar}>
          <p className={s.copyright}>
            © {new Date().getFullYear()} Nabih Youssef &amp; Associates.
            Structural Engineers.
          </p>
          <p className={s.offices}>
            Los Angeles · San Francisco · New York · Chicago · Dallas
          </p>
        </div>
      </div>
    </footer>
  );
}
