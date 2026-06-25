import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

// Register at module level so plugins are available before any component effect runs
gsap.registerPlugin(ScrollTrigger, SplitText)

export default function GlobalSetup() {
  useEffect(() => {
    // Respect reduced-motion: keep Lenis (so window.__lenis.scrollTo still
    // works) but disable the continuous smooth-scroll easing — lerp:1 follows
    // the native scroll position instantly, smoothWheel:false uses native wheel.
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const lenis = prefersReduced
      ? new Lenis({ lerp: 1, smoothWheel: false, smoothTouch: false })
      : new Lenis({ lerp: 0.1, smoothWheel: true })
    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add((time) => { lenis.raf(time * 1000) })
    gsap.ticker.lagSmoothing(0)
    window.__lenis = lenis

    // Refresh all ScrollTrigger positions after the initial hydration burst.
    // client:visible islands mount incrementally, adding height to the page.
    // This ensures every trigger's start/end is calculated against final layout.
    //
    // A single timed refresh is fragile: pinned sections (Hero, ClientCare)
    // derive their pin-spacer height from window.innerHeight / font-sized
    // elements measured at build time. If fonts or hero images settle AFTER
    // that refresh, every downstream section (Ethos worst) gets displaced —
    // it lands thousands of px below the reachable scroll range on first load.
    // Refresh on every signal that can change layout height: the hydration
    // timeout, fonts ready, and window load (all images decoded).
    const t = setTimeout(() => ScrollTrigger.refresh(), 400)
    document.fonts.ready.then(() => ScrollTrigger.refresh())
    const onLoad = () => ScrollTrigger.refresh()
    if (document.readyState === 'complete') onLoad()
    else window.addEventListener('load', onLoad)

    return () => {
      clearTimeout(t)
      window.removeEventListener('load', onLoad)
      lenis.destroy()
    }
  }, [])

  return null
}
