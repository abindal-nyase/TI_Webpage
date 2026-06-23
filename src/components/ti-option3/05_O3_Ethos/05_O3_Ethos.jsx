import { useRef } from 'react'
import { useIsomorphicLayoutEffect as useLayoutEffect } from '../../../hooks/useIsomorphicLayoutEffect'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import s from './05_O3_Ethos.module.css'

gsap.registerPlugin(ScrollTrigger)

const QUOTE =
  "I treat every tenant improvement like a home-cooked meal. I take my time, I use good ingredients, and I remember who I am cooking for. Success is not measured by how many projects we finish, but by how many clients call us back. That quiet dignity of doing the work well, where no one notices the structure but everyone feels its safety is my art.";

export default function O3Ethos() {
  const sectionRef = useRef(null)
  const photoRef   = useRef(null)
  const quoteRef   = useRef(null)
  const sigRef     = useRef(null)

  // ── Entry animation — photo + quote reveal on scroll ───────────────
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(quoteRef.current, { opacity: 0, y: 30 })
      gsap.set(sigRef.current, { opacity: 0, clipPath: 'inset(0 100% 0 0)' })

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 75%',
        once: true,
        onEnter: () => {
          gsap.from(photoRef.current, {
            opacity: 0, duration: 0.9, ease: 'power3.out',
          })
          gsap.to(quoteRef.current, {
            opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.3,
          })
          gsap.fromTo(
            sigRef.current,
            { clipPath: 'inset(0 100% 0 0)', opacity: 0 },
            { clipPath: 'inset(0 0% 0 0)', opacity: 1, duration: 1, ease: 'power2.out', delay: 0.9 },
          )
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="nya-culture" className={s.section}>
      <div className={s.inner}>

        {/* Photo floats right — quote text wraps around it */}
        <img
          ref={photoRef}
          src="/pav-img/Nabih-5-2.png"
          alt="Nabih Youssef"
          draggable={false}
          className={s.photo}
        />

        <span className={s.openMark}>&ldquo;</span>
        <blockquote ref={quoteRef} className={s.quote}>
          {QUOTE}
        </blockquote>
        <p ref={sigRef} className={s.signature}>
          — Nabih Youssef
        </p>

      </div>
    </section>
  )
}
