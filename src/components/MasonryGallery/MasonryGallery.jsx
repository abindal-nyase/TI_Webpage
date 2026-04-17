import { useRef } from 'react'
import { useIsomorphicLayoutEffect as useLayoutEffect } from '../../hooks/useIsomorphicLayoutEffect'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { masonryProjects } from '../../data/projects'
import s from './MasonryGallery.module.css'

export default function MasonryGallery() {
  const rootRef = useRef(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Diagonal stagger reveal — disruption into beauty
      const cards = gsap.utils.toArray(`.${s.card}`)
      gsap.from(cards, {
        autoAlpha: 0,
        y: 50,
        x: (i) => (i % 2 === 0 ? -20 : 20),
        duration: 0.85,
        stagger: { amount: 0.4, from: 'start' },
        ease: 'power3.out',
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top 78%',
          once: true,
          invalidateOnRefresh: true,
        },
      })
    }, rootRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={rootRef} id="gallery-2" className={s.root}>
      <div className={s.inner}>
        <span className={`u-label ${s.label}`}>Project Photography</span>
        <div className={s.grid}>
          {masonryProjects.map((p) => (
            <figure key={p.id} className={s.card}>
              <div className={s.imgWrap}>
                <img
                  src={p.src}
                  alt={p.alt}
                  loading="lazy"
                  className={s.img}
                />
                <figcaption className={s.caption}>
                  <span className={s.capName}>{p.name}</span>
                  <span className={`u-label ${s.capType}`}>{p.type}</span>
                </figcaption>
              </div>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
