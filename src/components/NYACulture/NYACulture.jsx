import { useRef, useEffect } from 'react'
import { useIsomorphicLayoutEffect as useLayoutEffect } from '../../hooks/useIsomorphicLayoutEffect'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import s from './NYACulture.module.css'

gsap.registerPlugin(ScrollTrigger)

const QUOTES = [
  'Every job was a chance to earn a relationship, and do right by a client, not just in a way that met the code, but in a way they could feel.',
  'Every job was a chance to earn a relationship, and do right by a client, not just in a way that met the code, but in a way they could feel.',
  'Every job was a chance to earn a relationship, and do right by a client, not just in a way that met the code, but in a way they could feel.',
]

const INTERVAL_MS = 4000

export default function NYACulture() {
  const sectionRef = useRef(null)
  const photoRef   = useRef(null)
  const quoteRefs  = useRef([])
  const sigRefs    = useRef([])
  const current    = useRef(0)
  const timer      = useRef(null)

  // ── Show a specific quote ───────────────────────────────────────────
  const showQuote = (idx) => {
    const qs = quoteRefs.current
    const ss = sigRefs.current

    // Fade out all
    gsap.to(qs, { opacity: 0, y: -20, duration: 0.4, ease: 'power2.in' })
    gsap.to(ss, { opacity: 0, duration: 0.3 })

    // Fade in the selected quote + signature
    gsap.to(qs[idx], { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', delay: 0.45 })
    gsap.fromTo(
      ss[idx],
      { clipPath: 'inset(0 100% 0 0)', opacity: 0 },
      { clipPath: 'inset(0 0% 0 0)', opacity: 1, duration: 0.9, ease: 'power2.out', delay: 0.8 },
    )
  }

  // ── Entry animation — photo + first quote ──────────────────────────
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const qs = quoteRefs.current.filter(Boolean)
      const ss = sigRefs.current.filter(Boolean)

      // Hide all quotes initially
      gsap.set(qs, { opacity: 0, y: 30 })
      gsap.set(ss, { opacity: 0, clipPath: 'inset(0 100% 0 0)' })

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 75%',
        once: true,
        onEnter: () => {
          // Photo slides in
          gsap.from(photoRef.current, {
            x: -40, opacity: 0, duration: 0.9, ease: 'power3.out',
          })
          // First quote appears
          gsap.to(qs[0], { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.3 })
          gsap.fromTo(
            ss[0],
            { clipPath: 'inset(0 100% 0 0)', opacity: 0 },
            { clipPath: 'inset(0 0% 0 0)', opacity: 1, duration: 1, ease: 'power2.out', delay: 0.9 },
          )
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  // ── Auto-play interval — cycles quotes ─────────────────────────────
  useEffect(() => {
    timer.current = setInterval(() => {
      current.current = (current.current + 1) % QUOTES.length
      showQuote(current.current)
    }, INTERVAL_MS)

    return () => clearInterval(timer.current)
  }, [])

  return (
    <section ref={sectionRef} id="nya-culture" className={s.section}>
      <div className={s.inner}>

        {/* ── Left: person photo ── */}
        <div className={s.left}>
          <img
            ref={photoRef}
            src="/pav-img/Nabih-5-2.png"
            alt="Nabih Youssef"
            draggable={false}
            className={s.photo}
          />
        </div>

        {/* ── Right: auto-rotating quotes ── */}
        <div className={s.right}>
          <span className={s.openMark}>&ldquo;</span>

          {QUOTES.map((text, i) => (
            <div key={i} className={s.slide}>
              <blockquote
                ref={el => { quoteRefs.current[i] = el }}
                className={s.quote}
              >
                {text}
              </blockquote>
              <p
                ref={el => { sigRefs.current[i] = el }}
                className={s.signature}
              >
                — Nabih Youssef
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
