import { useRef, useEffect, useState } from 'react'
import { useScrollProgress } from './useScrollProgress.js'
import { N, DISC_PHASES } from './geometry.js'
import { toScreenLeft, toScreenTop, interp } from './utils.js'

export function useCollapsingDiscs(discData, collapseDuration) {
  const driverRef = useRef(null)
  const progress  = useScrollProgress(driverRef)
  const rafRef    = useRef(null)
  const startRef  = useRef(null)
  const [collapseStyles, setCollapseStyles] = useState(null)
  const [autoFall, setAutoFall] = useState(false)

  const phase        = Math.min(DISC_PHASES - 1, Math.floor(progress * DISC_PHASES))
  const dropped      = Math.min(phase, N)
  const fall         = phase >= N + 1 || autoFall
  const greenReveal  = phase >= N + 2
  const droppedGreen = Math.min(N, Math.max(0, phase - (N + 2)))
  const activeI      = (dropped > 0 && !greenReveal) ? dropped - 1 : -1

  useEffect(() => {
    if (dropped === N) {
      const id = setTimeout(() => setAutoFall(true), 620)
      return () => clearTimeout(id)
    }
    setAutoFall(false)
  }, [dropped])

  useEffect(() => {
    if (!fall) {
      if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null }
      startRef.current = null
      setCollapseStyles(null)
      return
    }
    function tick(now) {
      if (startRef.current === null) startRef.current = now
      const t = Math.min(1, (now - startRef.current) / collapseDuration)
      const styles = discData.map(disc => ({
        left:      toScreenLeft(interp(disc.center_x, disc.time, t), disc.radius),
        top:       toScreenTop(interp(disc.center_z, disc.time, t)),
        transform: `rotate(${interp(disc.angle_deg, disc.time, t).toFixed(2)}deg)`,
      }))
      setCollapseStyles(styles)
      if (t < 1) rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [fall])

  return { driverRef, phase, dropped, fall, greenReveal, droppedGreen, activeI, collapseStyles }
}
