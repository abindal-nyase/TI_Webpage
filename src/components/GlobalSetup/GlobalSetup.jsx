import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

export default function GlobalSetup() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger, SplitText)

    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true })
    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add((time) => { lenis.raf(time * 1000) })
    gsap.ticker.lagSmoothing(0)
    window.__lenis = lenis

    // Refresh all ScrollTrigger positions after the initial hydration burst.
    // client:visible islands mount incrementally, adding height to the page.
    // This ensures every trigger's start/end is calculated against final layout.
    const t = setTimeout(() => ScrollTrigger.refresh(), 400)

    return () => {
      clearTimeout(t)
      lenis.destroy()
    }
  }, [])

  return null
}
