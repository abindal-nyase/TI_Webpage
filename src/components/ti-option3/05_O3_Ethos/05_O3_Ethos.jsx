import { useRef } from 'react'
import { useIsomorphicLayoutEffect as useLayoutEffect } from '../../../hooks/useIsomorphicLayoutEffect'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import s from './05_O3_Ethos.module.css'

gsap.registerPlugin(ScrollTrigger)

const QUOTE =
  'Every job was a chance to earn a relationship, and do right by a client, not just in a way that met the code, but in a way they could feel.'

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

        {/* ── Left: quote ── */}
        <div className={s.right}>
          <span className={s.openMark}>&ldquo;</span>
          <div className={s.slide}>
            <blockquote ref={quoteRef} className={s.quote}>
              {QUOTE}
            </blockquote>
            <p ref={sigRef} className={s.signature}>
              — Nabih Youssef
            </p>
          </div>
        </div>

        {/* ── Right: person photo ── */}
        <div className={s.left}>
          <img
            ref={photoRef}
            src="/pav-img/Nabih-5-2.png"
            alt="Nabih Youssef"
            draggable={false}
            className={s.photo}
          />
        </div>

      </div>
    </section>
  )
}
