import { useRef, useEffect } from 'react'
import s from './HeroOverlay.module.css'

const BLOB_POINTS   = 96
const BASE_RADIUS   = 0.18
const LERP_MOUSE    = 0.09
const LERP_RADIUS   = 0.06
// Stair hotspot — relative to canvas size, adjust to taste
const HOTSPOT       = { rx: 0.38, ry: 0.78 }
const HOTSPOT_PX    = 96   // ~1 inch at 96 dpi
const ACCENT        = '#2F80ED'
const TOOLTIP_LINES = ['Architecture vision is not a constraint,', 'our practice enables the stairs']

function getBlobRadius(baseR, angle, t) {
  return baseR * (
    1 +
    Math.sin(angle * 4 + t * 0.45) * 0.14 +
    Math.sin(angle * 7 - t * 0.70) * 0.06 +
    Math.sin(angle * 2 + t * 0.25) * 0.07
  )
}

export default function HeroOverlay() {
  const containerRef = useRef(null)
  const canvasRef    = useRef(null)
  const stateRef     = useRef({
    mx: 0, my: 0,
    tx: 0, ty: 0,
    radius: 0,
    targetRadius: 0,
    hoverRadius: 0,
    scrollRadius: 0,
    t: 0,
    bgImg: null,
    raf: null,
    ready: false,
    inside: false,
    insideHotspot: false,
    tooltipAlpha: 0,
  })

  useEffect(() => {
    const canvas    = canvasRef.current
    const container = containerRef.current
    const ctx       = canvas.getContext('2d')
    const state     = stateRef.current

    // Load only background image — foreground is a CSS background on the container div
    const bgImg = new Image()
    bgImg.onload = () => { state.ready = true }
    bgImg.onerror = () => console.error('bg failed to load')
    bgImg.src = '/hero-overlay-bg.png'
    // Handle already-cached case where onload never fires
    if (bgImg.complete && bgImg.naturalWidth > 0) state.ready = true
    state.bgImg = bgImg

    function resize() {
      const rect = container.getBoundingClientRect()
      if (rect.width === 0) return
      canvas.width  = rect.width
      canvas.height = rect.height
      if (state.tx === 0) {
        state.tx = rect.width  / 2
        state.ty = rect.height / 2
        state.mx = state.tx
        state.my = state.ty
      }
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(container)

    function onScroll() {
      // sticky element: rect.top is always 0 while sticking — use offsetTop vs scrollY
      const naturalTop = container.offsetTop
      const scrolled   = Math.max(0, window.scrollY - naturalTop)
      const range      = container.offsetHeight * 0.6
      const progress   = Math.min(1, scrolled / range)
      state.scrollRadius = progress * Math.hypot(canvas.width, canvas.height)
      state.targetRadius = Math.max(state.hoverRadius, state.scrollRadius)
    }
    const lenis = window.__lenis
    lenis?.on('scroll', onScroll)
    if (!lenis) window.addEventListener('scroll', onScroll)

    function blobPath(cx, cy, r, tOff = 0) {
      ctx.beginPath()
      for (let i = 0; i <= BLOB_POINTS; i++) {
        const angle = (i / BLOB_POINTS) * Math.PI * 2
        const br    = getBlobRadius(r, angle, state.t + tOff)
        const x     = cx + Math.cos(angle) * br
        const y     = cy + Math.sin(angle) * br
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
      }
      ctx.closePath()
    }

    function render() {
      const w = canvas.width
      const h = canvas.height

      state.mx += (state.tx - state.mx) * LERP_MOUSE
      state.my += (state.ty - state.my) * LERP_MOUSE
      state.radius += (state.targetRadius - state.radius) * LERP_RADIUS
      state.t += 0.016

      ctx.clearRect(0, 0, w, h)

      const r     = state.radius
      const fullR = Math.hypot(w, h)

      if (state.ready && r > 2) {
        // Outer diffuse aura
        if (r < fullR * 0.95) {
          ctx.save()
          ctx.filter      = 'blur(55px)'
          ctx.globalAlpha = 0.12
          ctx.fillStyle   = '#fff'
          blobPath(state.mx, state.my, r * 1.75, 0.1)
          ctx.fill()
          ctx.restore()

          // Mid soft ring
          ctx.save()
          ctx.filter      = 'blur(22px)'
          ctx.globalAlpha = 0.22
          ctx.fillStyle   = '#fff'
          blobPath(state.mx, state.my, r * 1.18, 0.25)
          ctx.fill()
          ctx.restore()

          // Tight inner rim
          ctx.save()
          ctx.filter      = 'blur(7px)'
          ctx.globalAlpha = 0.42
          ctx.fillStyle   = '#fff'
          blobPath(state.mx, state.my, r * 1.055, 0.4)
          ctx.fill()
          ctx.restore()
        }

        // Clip bg image to blob shape — fg div shows through everywhere else
        ctx.save()
        blobPath(state.mx, state.my, r, 0)
        ctx.clip()
        ctx.drawImage(bgImg, 0, 0, w, h)
        ctx.restore()

        // Subtle cursor dot — only while hovering
        if (state.inside && r < fullR * 0.95) {
          ctx.save()
          ctx.filter      = 'blur(6px)'
          ctx.globalAlpha = 0.5
          ctx.fillStyle   = '#fff'
          ctx.beginPath()
          ctx.arc(state.mx, state.my, 8, 0, Math.PI * 2)
          ctx.fill()
          ctx.filter      = 'none'
          ctx.globalAlpha = 0.9
          ctx.fillStyle   = '#fff'
          ctx.beginPath()
          ctx.arc(state.mx, state.my, 2.5, 0, Math.PI * 2)
          ctx.fill()
          ctx.restore()
        }
      }

      // Hotspot indicator — always visible on fg
      const hx    = w * HOTSPOT.rx
      const hy    = h * HOTSPOT.ry
      const pulse = 0.5 + 0.5 * Math.sin(state.t * 2.5)

      ctx.save()
      ctx.globalAlpha = 0.25 + 0.25 * pulse
      ctx.strokeStyle = ACCENT
      ctx.lineWidth   = 1.5
      ctx.beginPath()
      ctx.arc(hx, hy, 9 + pulse * 7, 0, Math.PI * 2)
      ctx.stroke()
      ctx.restore()

      ctx.save()
      ctx.globalAlpha = 0.8
      ctx.fillStyle   = ACCENT
      ctx.beginPath()
      ctx.arc(hx, hy, 3.5, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()

      // Tooltip fade in/out
      state.tooltipAlpha += ((state.insideHotspot ? 1 : 0) - state.tooltipAlpha) * 0.1
      if (state.tooltipAlpha > 0.01) {
        const PAD  = 14
        const FS   = 13
        const LH   = 20
        ctx.font   = `400 ${FS}px 'Plus Jakarta Sans', system-ui, sans-serif`
        const maxW = Math.max(...TOOLTIP_LINES.map(l => ctx.measureText(l).width))
        const bw   = maxW + PAD * 2
        const bh   = TOOLTIP_LINES.length * LH + PAD * 2
        const bx   = Math.min(Math.max(hx - bw / 2, 8), w - bw - 8)
        const by   = hy - bh - 18

        ctx.save()
        ctx.globalAlpha = state.tooltipAlpha
        // subtle frosted background — canvas can't do true backdrop-filter
        ctx.fillStyle   = 'rgba(0,0,0,0.8)'
        ctx.beginPath()
        ctx.roundRect(bx, by, bw, bh, 7)
        ctx.fill()
        ctx.fillStyle = '#ffffff'
        TOOLTIP_LINES.forEach((line, i) => {
          ctx.fillText(line, bx + PAD, by + PAD + FS + i * LH)
        })
        ctx.restore()
      }

      state.raf = requestAnimationFrame(render)
    }

    render()

    function onMouseMove(e) {
      const rect = canvas.getBoundingClientRect()
      state.tx = e.clientX - rect.left
      state.ty = e.clientY - rect.top
      const hx = canvas.width  * HOTSPOT.rx
      const hy = canvas.height * HOTSPOT.ry
      state.insideHotspot = Math.hypot(state.tx - hx, state.ty - hy) < HOTSPOT_PX
    }
    function onMouseEnter() {
      state.inside       = true
      state.hoverRadius  = Math.min(canvas.width, canvas.height) * BASE_RADIUS
      state.targetRadius = Math.max(state.hoverRadius, state.scrollRadius)
    }
    function onMouseLeave() {
      state.inside       = false
      state.hoverRadius  = 0
      state.targetRadius = Math.max(0, state.scrollRadius)
    }

    container.addEventListener('mousemove',  onMouseMove)
    container.addEventListener('mouseenter', onMouseEnter)
    container.addEventListener('mouseleave', onMouseLeave)

    return () => {
      cancelAnimationFrame(state.raf)
      ro.disconnect()
      lenis?.off('scroll', onScroll)
      if (!lenis) window.removeEventListener('scroll', onScroll)
      container.removeEventListener('mousemove',  onMouseMove)
      container.removeEventListener('mouseenter', onMouseEnter)
      container.removeEventListener('mouseleave', onMouseLeave)
    }
  }, [])

  return (
    <div ref={containerRef} className={s.root}>
      {/* fg image as CSS background — always visible */}
      <div className={s.fg} />
      {/* canvas draws bg clipped to blob shape only */}
      <canvas ref={canvasRef} className={s.canvas} />
    </div>
  )
}
