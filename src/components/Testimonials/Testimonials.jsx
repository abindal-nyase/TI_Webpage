import { useRef, useLayoutEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { testimonials } from '../../data/projects'
import s from './Testimonials.module.css'

export default function Testimonials() {
  const rootRef   = useRef(null)
  const quoteRef  = useRef(null)
  const [active, setActive] = useState(0)

  // Switch testimonial with GSAP fade
  const goTo = (idx) => {
    if (idx === active) return
    gsap.to(quoteRef.current, {
      autoAlpha: 0,
      y: -16,
      duration: 0.3,
      ease: 'power2.in',
      onComplete: () => {
        setActive(idx)
        gsap.fromTo(
          quoteRef.current,
          { autoAlpha: 0, y: 20 },
          { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power3.out' },
        )
      },
    })
  }

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(rootRef.current.querySelectorAll('.js-ts-reveal'), {
        autoAlpha: 0,
        y: 28,
        stagger: 0.1,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top 78%',
          once: true,
        },
      })
    }, rootRef)

    return () => ctx.revert()
  }, [])

  const current = testimonials[active]

  return (
    <section ref={rootRef} id="testimonials" className={s.root}>
      <div className={s.inner}>
        <span className={`u-label js-ts-reveal ${s.label}`}>Client Voices</span>

        <div ref={quoteRef} className={s.quoteWrap}>
          <blockquote className={s.quote}>
            <span className={s.openMark} aria-hidden="true">"</span>
            <p className={s.quoteText}>{current.quote}</p>
            <footer className={s.quoteFooter}>
              <cite className={s.cite}>
                <span className={s.citeName}>{current.name}</span>
                <span className={s.citeCompany}>{current.company}</span>
              </cite>
              <span className={`u-label ${s.citeType}`}>{current.type}</span>
            </footer>
          </blockquote>
        </div>

        {/* Dot navigation */}
        <nav className={`js-ts-reveal ${s.dots}`} aria-label="Testimonial navigation">
          {testimonials.map((t, i) => (
            <button
              key={t.id}
              className={`${s.dot} ${i === active ? s.dotActive : ''}`}
              onClick={() => goTo(i)}
              aria-label={`Testimonial ${i + 1} from ${t.name}`}
              aria-current={i === active ? 'true' : undefined}
            />
          ))}
        </nav>
      </div>
    </section>
  )
}
