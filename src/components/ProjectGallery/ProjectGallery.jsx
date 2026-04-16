import { useRef, useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { galleryProjects } from '../../data/projects'
import s from './ProjectGallery.module.css'

export default function ProjectGallery() {
  const rootRef    = useRef(null)
  const trackRef   = useRef(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const track = trackRef.current
      const totalMove = () => -(track.scrollWidth - window.innerWidth + 2 * 80) // 80px = section-px approx

      const scrollTween = gsap.to(track, {
        x: totalMove,
        ease: 'none',
        scrollTrigger: {
          trigger: rootRef.current,
          pin: true,
          scrub: 1,
          start: 'top top',
          end: () => `+=${Math.abs(totalMove())}`,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      })

      // Fade-in each card as it enters the horizontal scroll viewport
      gsap.utils.toArray(`.${s.card}`).forEach((card, i) => {
        if (i === 0) return
        gsap.from(card, {
          autoAlpha: 0,
          scale: 0.96,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            containerAnimation: scrollTween,
            trigger: card,
            start: 'left 85%',
            toggleActions: 'play none none reverse',
          },
        })
      })
    }, rootRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={rootRef} id="gallery" className={s.root}>
      <div ref={trackRef} className={s.track}>
        {/* Section header card */}
        <div className={s.headerCard}>
          <span className={`u-label ${s.label}`}>Selected Work</span>
          <h2 className={s.heading}>
            400+ projects.<br />
            <em>Every detail matters.</em>
          </h2>
          <p className={s.sub}>
            From Apple Store staircases to Downtown LA high-rises —
            a selection of what we've delivered.
          </p>
        </div>

        {galleryProjects.map((p) => (
          <div key={p.id} className={s.card}>
            <div className={s.cardImg}>
              <img
                src={p.src}
                alt={p.alt}
                loading="lazy"
                className={s.img}
              />
            </div>
            <div className={s.cardInfo}>
              <span className={`u-label ${s.cardType}`}>{p.type}</span>
              <p className={s.cardName}>{p.name}</p>
              <p className={s.cardLocation}>{p.location}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
