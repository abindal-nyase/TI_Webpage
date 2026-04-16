import { useRef, useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { offerings } from '../../data/projects'
import s from './Offerings.module.css'

export default function Offerings() {
  const rootRef  = useRef(null)
  const trackRef = useRef(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const track   = trackRef.current
      const panels  = gsap.utils.toArray(`.${s.panel}`)

      // How far we need to scroll horizontally
      const getTotalMove = () =>
        -(track.scrollWidth - window.innerWidth)

      const scrollTween = gsap.to(track, {
        x: getTotalMove,
        ease: 'none',   // REQUIRED for containerAnimation
        scrollTrigger: {
          trigger: rootRef.current,
          pin: true,
          scrub: 1,
          start: 'top top',
          end: () => `+=${Math.abs(getTotalMove())}`,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      })

      // Each panel's text content slides in from right as it enters
      panels.forEach((panel, i) => {
        if (i === 0) return
        const content = panel.querySelector(`.${s.panelContent}`)
        const img     = panel.querySelector(`.${s.panelImg}`)

        gsap.from(content, {
          autoAlpha: 0,
          x: 60,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            containerAnimation: scrollTween,
            trigger: panel,
            start: 'left 75%',
            toggleActions: 'play none none reverse',
          },
        })

        gsap.from(img, {
          scale: 1.08,
          duration: 1.2,
          ease: 'power2.out',
          scrollTrigger: {
            containerAnimation: scrollTween,
            trigger: panel,
            start: 'left 85%',
            end: 'left 20%',
            scrub: 0.5,
          },
        })
      })
    }, rootRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={rootRef} id="offerings" className={s.root}>
      <div ref={trackRef} className={s.track}>
        {offerings.map((item, i) => (
          <div
            key={item.id}
            className={`${s.panel} ${item.featured ? s.featured : ''}`}
          >
            {/* Left: full-bleed image */}
            <div className={s.panelImg}>
              <img
                src={item.src}
                alt={item.alt}
                className={s.img}
                loading={i === 0 ? 'eager' : 'lazy'}
              />
              {/* Panel number badge */}
              <span className={s.numBadge} aria-hidden="true">{item.num}</span>
            </div>

            {/* Right: content */}
            <div className={s.panelContent}>
              <span className={`u-label ${s.panelLabel}`}>
                What We Do Best · {item.num} / 05
              </span>
              <h2 className={s.panelTitle}>{item.title}</h2>
              <p className={s.panelHeadline}>{item.headline}</p>
              <p className={s.panelBody}>{item.body}</p>
              <ul className={s.bullets} role="list">
                {item.bullets.map((b) => (
                  <li key={b} className={s.bullet}>
                    <span className={s.bulletDot} aria-hidden="true" />
                    {b}
                  </li>
                ))}
              </ul>
              {i === 0 && (
                <p className={s.featuredNote}>
                  Including Apple Store glass staircases across multiple California locations.
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
