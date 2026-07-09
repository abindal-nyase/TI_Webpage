import { useRef } from 'react'
import { useIsomorphicLayoutEffect as useLayoutEffect } from '../../hooks/useIsomorphicLayoutEffect'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import s from './05_O3_Ethos.module.css'

gsap.registerPlugin(ScrollTrigger)

const QUOTES = [
  'We do not measure success by how many projects we finish. We measure it by how many clients call us back for the next one. Because if they call back, we know we did more than just steel and concrete. We gave them trust.',
  'Some firms treat tenant improvements like fast food: quick, cheap, forgettable. We treat them like a home-cooked meal. We take our time, use good ingredients, and remember who we are cooking for.',
]

export default function O3Ethos() {
  const sectionRef = useRef(null)
  const innerRef   = useRef(null)
  const photoRef   = useRef(null)
  const quoteRef   = useRef(null)   // quote 1
  const quote2Ref  = useRef(null)   // quote 2
  const sigRef     = useRef(null)

  // ── Entry reveal + scroll-driven sequential fade between the two quotes ──
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Quote 1 rests visible; quote 2 hidden. The scrub timeline below is the
      // SOLE owner of the two quotes' opacity — entry only slides quote 1 in.
      gsap.set(quoteRef.current, { opacity: 1, y: 0 })
      gsap.set(quote2Ref.current, { opacity: 0, y: 30 })
      gsap.set(sigRef.current, { opacity: 0, clipPath: 'inset(0 100% 0 0)' })

      // Entry — reveal photo + quote 1 slide + signature once, on first enter
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 75%',
        once: true,
        onEnter: () => {
          gsap.from(photoRef.current, { opacity: 0, duration: 0.9, ease: 'power3.out' })
          gsap.from(quoteRef.current, { y: 30, duration: 0.8, ease: 'power3.out', delay: 0.3 })
          gsap.fromTo(
            sigRef.current,
            { clipPath: 'inset(0 100% 0 0)', opacity: 0 },
            { clipPath: 'inset(0 0% 0 0)', opacity: 1, duration: 1, ease: 'power2.out', delay: 0.9 },
          )
        },
      })

      // Sequential fade — pin section, scrub quote 1 OUT, hold a gap, then
      // quote 2 IN. The gap = both quotes fully hidden for a beat, so one is
      // gone before the other arrives (no crossfade overlap).
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=120%',
          scrub: 1,
          pin: innerRef.current,
          invalidateOnRefresh: true,
        },
      })
      // 0.00–0.35  quote 1 fades out
      tl.to(quoteRef.current, { opacity: 0, y: -30, ease: 'power1.in', duration: 0.35 }, 0)
      // 0.35–0.55  gap — nothing visible (empty tween holds the playhead)
        .to({}, { duration: 0.2 })
      // 0.55–1.00  quote 2 fades in
        .fromTo(
          quote2Ref.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, ease: 'power1.out', duration: 0.45 },
        )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="nya-culture" className={s.section}>
      <div ref={innerRef} className={s.inner}>

        {/* Quote column — TOP on phones (DOM order), RIGHT on wide screens
            (photo is absolute there, so order doesn't affect the row). */}
        <div className={s.quoteCol}>
          <span className={s.openMark}>&ldquo;</span>

          {/* Two quotes stacked in the same spot — sequential fade on scroll. */}
          <div className={s.quotes}>
            <blockquote ref={quoteRef} className={s.quote}>
              {QUOTES[0]}
            </blockquote>
            <blockquote ref={quote2Ref} className={`${s.quote} ${s.quoteStacked}`}>
              {QUOTES[1]}
            </blockquote>
          </div>

          <p ref={sigRef} className={s.signature}>
            - Nabih Youssef
          </p>
        </div>

        {/* Portrait — head→chest cover crop (transparent PNG → no box).
            Fills below the quote on phones; absolute LEFT on wide screens. */}
        <img
          ref={photoRef}
          src="/pav-img/Nabih-5-2.png"
          alt="Nabih Youssef"
          draggable={false}
          className={s.photo}
        />

      </div>
    </section>
  )
}
