import { useRef } from 'react'
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

export default function NYACulture() {
  const wrapperRef  = useRef(null)   // scroll space wrapper (sticky parent)
  const sectionRef  = useRef(null)   // sticky section (40vh)
  const photoRef    = useRef(null)
  const quoteRefs   = useRef([])
  const sigRefs     = useRef([])

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const qs = quoteRefs.current.filter(Boolean)
      const ss = sigRefs.current.filter(Boolean)

      // ── Initial state ─────────────────────────────────────────────
      gsap.set(qs, { opacity: 0, y: 30 })
      gsap.set(ss, { opacity: 0, clipPath: 'inset(0 100% 0 0)' })

      // ── Photo slides in as wrapper enters viewport ────────────────
      gsap.from(photoRef.current, {
        x: -40, opacity: 0, duration: 0.9, ease: 'power3.out',
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: 'top 80%',
          once: true,
        },
      })

      // ── Scrubbed timeline over the wrapper's scroll space ─────────
      // No GSAP pin — sticky CSS keeps section visible.
      // wrapper height = 40vh + 1400px → 12 timeline units over 1400px.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
          invalidateOnRefresh: true,
        },
      })

      // Quote 1 — in at 0.5, sig at 1.6, both out at 3.6
      tl.to(qs[0], { opacity: 1, y: 0, duration: 1 }, 0.5)
      tl.to(ss[0], { opacity: 1, clipPath: 'inset(0 0% 0 0)', duration: 1.2 }, 1.6)
      tl.to([qs[0], ss[0]], { opacity: 0, y: -28, duration: 0.6 }, 3.6)

      // Quote 2 — in at 4.5, sig at 5.6, both out at 7.6
      tl.to(qs[1], { opacity: 1, y: 0, duration: 1 }, 4.5)
      tl.to(ss[1], { opacity: 1, clipPath: 'inset(0 0% 0 0)', duration: 1.2 }, 5.6)
      tl.to([qs[1], ss[1]], { opacity: 0, y: -28, duration: 0.6 }, 7.6)

      // Quote 3 — in at 8.5, sig at 9.4, stays
      tl.to(qs[2], { opacity: 1, y: 0, duration: 1 }, 8.5)
      tl.to(ss[2], { opacity: 1, clipPath: 'inset(0 0% 0 0)', duration: 1.2 }, 9.4)
      tl.to({}, { duration: 1.6 }) // hold at end

    }, wrapperRef)

    return () => ctx.revert()
  }, [])

  return (
    /* Wrapper creates scroll space; section sticks inside it */
    <div ref={wrapperRef} className={s.scrollWrapper}>
      <section ref={sectionRef} id="nya-culture" className={s.section}>
        <div className={s.trigger}>

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

          {/* ── Right: rotating quotes ── */}
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
    </div>
  )
}
