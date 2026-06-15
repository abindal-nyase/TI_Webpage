import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import s from './TIDifferencesOption3.module.css'
import { COPY } from './config.js'

gsap.registerPlugin(ScrollTrigger)

export function Intro() {
  const sectionRef = useRef(null)
  const headingRef = useRef(null)
  const subRef     = useRef(null)

  useEffect(() => {
    // Rise animation — scroll-driven, not theme-dependent
    const riseCtx = gsap.context(() => {
      gsap.from([headingRef.current, subRef.current], {
        y: 80,
        ease: 'power2.out',
        stagger: 0.12,
        immediateRender: false,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'top top',
          scrub: true,
          invalidateOnRefresh: true,
        },
      })
    }, sectionRef)

    // Color + background fade — mirrors TrustWallOption3 pattern, rebuilt on themechange
    let colorCtx

    function buildColorAnims() {
      if (colorCtx) colorCtx.revert()
      colorCtx = gsap.context(() => {
        const cs          = getComputedStyle(document.documentElement)
        const primaryColor = cs.getPropertyValue('--color-primary').trim()
        const accentColor  = cs.getPropertyValue('--color-accent').trim()
        const blackColor   = cs.getPropertyValue('--color-black').trim() || '#0F172A'

        const trigger = {
          trigger: sectionRef.current,
          start: 'top 50%',
          end: 'top 20%',
          scrub: 1.2,
          invalidateOnRefresh: true,
        }

        // Whole section (.root, Intro's parent) shares one background —
        // fades primary → white starting at the Hero4 seam, finishing
        // within half a viewport of scroll.
        gsap.fromTo(
          sectionRef.current.parentElement,
          { backgroundColor: primaryColor },
          { backgroundColor: '#ffffff', scrollTrigger: trigger },
        )

        gsap.fromTo(
          headingRef.current,
          { color: accentColor },
          { color: blackColor, scrollTrigger: trigger },
        )

        gsap.fromTo(
          subRef.current,
          { color: 'rgba(255,255,255,0.55)' },
          { color: 'rgba(15,23,42,0.72)', scrollTrigger: trigger },
        )
      }, sectionRef)
    }

    document.fonts.ready.then(buildColorAnims)
    window.addEventListener('themechange', buildColorAnims)

    return () => {
      riseCtx.revert()
      colorCtx?.revert()
      window.removeEventListener('themechange', buildColorAnims)
    }
  }, [])

  return (
    <section ref={sectionRef} className={s.intro}>
      <div className={s.introBox}>
        <h2 ref={headingRef} className={s.introH} data-intro-anim>
          {COPY.introHeadMain.map((line, i) => (
            <span key={i} className={s.introHeadMain}>{line}</span>
          ))}
          <em>{COPY.introHeadEm}</em>
        </h2>
        <p ref={subRef} className={s.introSub} data-intro-anim>{COPY.introSub}</p>
      </div>
    </section>
  )
}
