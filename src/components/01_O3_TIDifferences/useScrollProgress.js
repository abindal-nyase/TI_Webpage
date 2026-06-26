import { useEffect, useState } from 'react'

export function useScrollProgress(ref) {
  const [p, setP] = useState(0)
  useEffect(() => {
    function onScroll() {
      const el = ref.current
      if (!el) return
      const rect  = el.getBoundingClientRect()
      // range depends on window.innerHeight, so it must be re-derived on resize
      // and orientation change — not just on scroll. Otherwise after a rotate or
      // zoom the progress (and therefore the disc phase) stays stale until the
      // next scroll event. The element height is vh-based and also moves.
      const range = el.offsetHeight - window.innerHeight
      if (range <= 0) return
      setP(Math.max(0, Math.min(1, -rect.top / range)))
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    document.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    window.addEventListener('orientationchange', onScroll)
    onScroll()
    return () => {
      window.removeEventListener('scroll', onScroll)
      document.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      window.removeEventListener('orientationchange', onScroll)
    }
  }, [ref])
  return p
}
