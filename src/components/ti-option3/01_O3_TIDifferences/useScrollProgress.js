import { useEffect, useState } from 'react'

export function useScrollProgress(ref) {
  const [p, setP] = useState(0)
  useEffect(() => {
    function onScroll() {
      const el = ref.current
      if (!el) return
      const rect  = el.getBoundingClientRect()
      const range = el.offsetHeight - window.innerHeight
      if (range <= 0) return
      setP(Math.max(0, Math.min(1, -rect.top / range)))
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    document.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => {
      window.removeEventListener('scroll', onScroll)
      document.removeEventListener('scroll', onScroll)
    }
  }, [ref])
  return p
}
