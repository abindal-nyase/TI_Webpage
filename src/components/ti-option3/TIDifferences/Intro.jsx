import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Snap from 'lenis/snap'
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
          // Section top at 50% viewport (bottom half filled, l8 just finished)
          // → section top at viewport top (full viewport). Color fades across
          // that 50%→100% growth.
          start: 'top 50%',
          end: 'top top',
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

  // Scroll-snap the intro into its pinned/centered position. Uses Lenis's own
  // Snap addon (not ScrollTrigger snap) so it scrolls through Lenis and doesn't
  // fight the smooth-scroll loop. align:'start' = driver top → viewport top,
  // which is exactly when .introPin engages (intro centered). 'proximity' only
  // snaps when near the intro, leaving the long disc scroll untouched.
  useEffect(() => {
    let snap, removeEl, raf
    function attach() {
      const lenis = window.__lenis
      if (!lenis || !sectionRef.current) { raf = requestAnimationFrame(attach); return }
      snap = new Snap(lenis, { type: 'proximity', duration: 0.8 })
      removeEl = snap.addElement(sectionRef.current, { align: ['start'], ignoreSticky: true })
    }
    attach()
    return () => {
      if (raf) cancelAnimationFrame(raf)
      removeEl?.()
      snap?.destroy()
    }
  }, [])

  return (
    <section ref={sectionRef} className={s.introDriver}>
      <div className={s.introPin}>
        <div className={s.introBox}>
          <h2 ref={headingRef} className={s.introH} data-intro-anim>
            {COPY.introHeadMain.map((line, i) => (
              <span key={i} className={s.introHeadMain}>{line}</span>
            ))}
            <em>{COPY.introHeadEm}</em>
          </h2>
          <p ref={subRef} className={s.introSub} data-intro-anim>{COPY.introSub}</p>
        </div>
      </div>
    </section>
  )
}
