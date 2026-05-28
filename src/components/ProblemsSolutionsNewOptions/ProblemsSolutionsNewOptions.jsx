import { useRef, useEffect, useState } from 'react'
import s from './ProblemsSolutionsNewOptions.module.css'
import SIM_DATA from './simulation_data.json'

// ══════════════════════════════════════════════════════════════════════════════
//  COLLAPSING DISCS — all tuning lives here
// ══════════════════════════════════════════════════════════════════════════════
const DISCS = {

  // ── rendering ───────────────────────────────────────────────────────────────
  // Raw pixel-per-Blender-unit scale used to convert the simulation coordinates
  // into screen pixels before towerScale shrinks everything to fit 100vh.
  // Larger value → bigger tower before shrinking.
  blenderScale: 120,

  // Final uniform scale applied to the whole tower container so it fits within
  // the viewport. 1.0 = full simulation size; 0.58 ≈ fills ~80% of 100vh.
  towerScale: 0.58,

  // ── scroll ───────────────────────────────────────────────────────────────────
  // Viewport-heights of scroll travel devoted to each animation phase.
  // More → each disc drops in more slowly (user scrolls further per step).
  // With 7 items and 3 extra phases, total scroll = PHASES * scrollVhPerPhase.
  scrollVhPerPhase: 48,

  // ── layout ───────────────────────────────────────────────────────────────────
  // Padding added to the bottom of the sticky panel, as a % of viewport height.
  // Lifts the tower and text column off the bottom edge of the screen.
  // 0 = flush to bottom; 10 = lifts scene up by 10vh.
  baselinePct: 0,

  // ── typography ───────────────────────────────────────────────────────────────
  // Uniform multiplier applied to every font-size in this panel via --font-scale.
  // All sizes (eyebrow, title, card text, bar label…) scale together, keeping
  // their relative proportions intact. 1.0 = base sizes from CSS.
  fontScale: 1.1,

  // ── indicator bars ───────────────────────────────────────────────────────────
  // Height (px) of the horizontal risk bar that sits below the disc stack.
  riskBarH: 14,

  // Width (px) of the vertical project-value bar shown beside each tower.
  valueBarW: 5,

  // Gap (px) between the vertical bar and the left edge of towerOuter.
  valueBarGap: 10,

  // Opacity of indicator bars before the first disc is placed.
  barIdleOpacity: 0,

  // Opacity of indicator bars once at least one disc is revealed.
  barActiveOpacity: 1,
}

// ══════════════════════════════════════════════════════════════════════════════
//  BARS & BUBBLES — all tuning lives here
// ══════════════════════════════════════════════════════════════════════════════
const BARS = {

  // ── scroll ───────────────────────────────────────────────────────────────────
  // Viewport-heights of scroll travel devoted to each animation phase.
  // With 7 items × 2 phases (red + green), total scroll = PHASES2 * scrollVhPerPhase.
  scrollVhPerPhase: 48,

  // ── layout ───────────────────────────────────────────────────────────────────
  // % from the viewport bottom where all bar bases are pinned (the shared baseline).
  // 0 = bars sit at the very bottom edge; 10 = baseline is 10vh above the bottom.
  baselinePct: 5.0,

  // Ratio of green slot width to red slot width.
  // 1.0 = equal spacing for both; 2.0 = each green bar gets twice the horizontal
  // room as a red bar. As greens appear, reds compress to the left.
  greenRedRatio: 2.0,

  // ── bar sizing ───────────────────────────────────────────────────────────────
  // Horizontal width of each bar column, in px.
  barWidth: 36,

  // The height (px) that a multiplier of 1.0 maps to. All bar heights are
  // expressed as multiples of this value, so 1.90 × barHeightRef = tallest bar.
  barHeightRef: 380,

  // Height multiplier for each red bar (index 0 = first to appear, left-most).
  // Values above 1.0 are taller than barHeightRef; below 1.0 are shorter.
  // The spread between min and max determines how dramatically bars stagger.
  redBarHeights:   [1.90, 1.60, 1.30, 1.00, 0.70, 0.40, 0.10],

  // Height multiplier for each green bar (index 0 = first to appear after reds).
  // Intentionally reversed from red so greens grow as the story resolves.
  greenBarHeights: [0.10, 0.40, 0.70, 1.00, 1.30, 1.60, 1.90],

  // ── bubble sizing ────────────────────────────────────────────────────────────
  // Diameter (= width = height) of every bubble circle, in px.
  // Increase to give text more room; decrease to make the chart feel lighter.
  bubbleDiameter: 200,

  // ── typography ───────────────────────────────────────────────────────────────
  // Uniform multiplier applied to every font-size inside bubbles via
  // --bubble-font-scale. Scales both the category label and body text together.
  fontScale: 1.3,

  // ── animation ────────────────────────────────────────────────────────────────
  // Duration (seconds) of the bar grow/shrink animation when a bar is revealed.
  barAnimDuration: 0.58,

  // Duration (seconds) of the horizontal slide when bars reposition as new ones appear.
  positionAnimDuration: 0.5,

  // Duration (seconds) of the opacity fade-in when a red bar first appears.
  opacityAnimDuration: 0.15,

  // Blur radius (px) of the glowing box-shadow on the most recently revealed
  // bar and bubble. Set to 0 to disable the glow effect entirely.
  glowRadius: 28,

  // Gap (px) between the bottom edge of the bubble and the top edge of the bar.
  // 0 = bubble sits flush on the bar; positive values add breathing room.
  bubbleBarGap: 8,

  // ── trajectory curve ─────────────────────────────────────────────────────────
  // Controls how curved the spline is between bar midpoints.
  // 0 = straight line segments; 0.5 = very smooth/rounded; 0.4 is a good default.
  curveTension: 0.2,

  // Overall opacity of the trajectory curve and its label. 0 = invisible; 1 = fully opaque.
  curveOpacity: 0.6,

  // Stroke width (px) of the trajectory curve line.
  curveStrokeWidth: 4,

  // Arrow style:
  //   'solid'   — filled triangle via SVG marker
  //   'hollow'  — hollow triangle outline: base crossbar + two arms meeting at tip
  //   'chevron' — V-shape: two arms + center bisector line connecting to trajectory endpoint
  arrowType: 'hollow',

  // Arm length (px) of the arrowhead, measured from base to tip (solid: marker box size).
  // Increasing this grows the arrow forward in the travel direction.
  arrowSize: 50,

  // Stroke width (px) of the open chevron arms. Only used when arrowType = 'chevron'.
  arrowStrokeWidth: 4,

  // Font size multiplier for the "Project Value Trajectory" label that tracks the arrow tip.
  // 1.0 = base size (9px); 1.5 = 13.5px, etc.
  curveLabelFontScale: 2.0,

  // How far (px) the curve extends past the last bar midpoint in the direction of travel.
  // 0 = arrowhead sits exactly on the midpoint; 40 = overshoots 40px beyond it.
  curveOvershootPx: 40,
}

// ── COLLAPSE PLAYBACK DURATION ────────────────────────────────────────────────
// Derived from the simulation JSON — do not edit.
const COLLAPSE_DURATION = Math.round(
  (SIM_DATA.meta.total_frames / SIM_DATA.meta.fps) * 1000
)

// ── DISC DATA (from JSON) ──────────────────────────────────────────────────────
const RED_DISC_DATA = SIM_DATA.discs.map(d => ({
  radius:    d.radius,
  thickness: d.thickness,
  pxWidth:   Math.round(d.radius * 2 * DISCS.blenderScale),
  time:      d.history.time,
  center_x:  d.history.center_x,
  center_z:  d.history.center_z,
  angle_deg: d.history.angle_deg,
  initCX:    d.history.center_x[0],
  initCZ:    d.history.center_z[0],
}))

const N = RED_DISC_DATA.length   // 7

// ── VISUAL GEOMETRY ───────────────────────────────────────────────────────────
const FACE_H     = Math.round(RED_DISC_DATA[0].thickness * DISCS.blenderScale)
const SIDE_NET_H = FACE_H  // side net height equals face height by construction
const SIDE_EL_H  = FACE_H / 2 + SIDE_NET_H

// ── COORDINATE MAPPING ────────────────────────────────────────────────────────
const BL_OX = RED_DISC_DATA[0].initCX
const BL_OZ = RED_DISC_DATA[0].initCZ

const PAD           = 10
const maxInitCZ     = Math.max(...RED_DISC_DATA.map(d => d.initCZ))
const blenderRangeZ = maxInitCZ - BL_OZ

const ORIGIN_PX = PAD + Math.round(RED_DISC_DATA[0].radius * DISCS.blenderScale)
const ORIGIN_PZ = PAD + Math.round(blenderRangeZ * DISCS.blenderScale) + Math.round(FACE_H / 2)

// ── TOWER CONTAINER DIMENSIONS ────────────────────────────────────────────────
const maxDiscPxWidth = Math.max(...RED_DISC_DATA.map(d => d.pxWidth))
const TOWER_W = PAD + maxDiscPxWidth + PAD
const TOWER_H = Math.round(ORIGIN_PZ + FACE_H / 2 + SIDE_NET_H + PAD)

const TOWER_PX_W = Math.round(TOWER_W * DISCS.towerScale)
const TOWER_PX_H = Math.round(TOWER_H * DISCS.towerScale)


// ── GREEN STACK DATA ──────────────────────────────────────────────────────────
const GREEN_DISC_DATA = RED_DISC_DATA.map((redDisc, i) => {
  const pxWidth  = RED_DISC_DATA[N - 1 - i].pxWidth
  const initLeft = Math.round((TOWER_W - pxWidth) / 2)
  const initTop  = Math.round(ORIGIN_PZ - (redDisc.initCZ - BL_OZ) * DISCS.blenderScale - FACE_H / 2)
  return { pxWidth, initLeft, initTop }
})

// ── ITEMS ─────────────────────────────────────────────────────────────────────
const ITEMS = [
  { category: 'Communication',      ntext: 'Poor team coordination causes uncertainty and schedule loss.',                  ptext: 'Clear coordination across structural, architect, contractor, and owner — fewer delays.' },
  { category: 'Fee Accuracy',       ntext: 'Low initial proposal hides scope gaps — add-service costs follow.',             ptext: 'Proposal reflects real scope from the start — clients avoid surprise costs.' },
  { category: 'Plan Check',         ntext: "Slow approvals because drawings don't anticipate city requirements.",           ptext: 'Review moves predictably — drawings are prepared to meet what the city expects.' },
  { category: 'Field Coordination', ntext: 'Generic details cause conflicts and RFIs during construction.',                 ptext: 'Details tailored to actual site conditions — drawings are clear and practical to build.' },
  { category: 'Design Quality',     ntext: 'Innovative ideas compromised — engineer cannot support the vision.',            ptext: 'Architecture protected — structural solution is strong enough to support the design intent.' },
  { category: 'Early Clarity',      ntext: 'Critical decisions made before structural constraints are understood.',         ptext: "Structural input provided upfront — owners and architects know what's possible early." },
  { category: 'Building Knowledge', ntext: 'Structural system never studied — the whole project rests on a false premise.', ptext: 'Structural system studied early so design reflects how the building actually works.' },
]

// Disc & bubble colors — index 0 = darkest (first revealed), index 6 = brightest (last revealed).
const DISC_REDS = [
  { face: '#5a1e1e', rim: '#3e1414' },
  { face: '#6e2222', rim: '#4e1818' },
  { face: '#822626', rim: '#5e1e1e' },
  { face: '#962a2a', rim: '#6e2022' },
  { face: '#aa2c30', rim: '#7e2028' },
  { face: '#bc2e34', rim: '#8a1e2a' },
  { face: '#c42535', rim: '#8e1e2c' },
]

const DISC_GREENS = [
  { face: '#1a5030', rim: '#123820' },
  { face: '#1a5c38', rim: '#123e28' },
  { face: '#1c6840', rim: '#144a2e' },
  { face: '#1a7848', rim: '#125636' },
  { face: '#168850', rim: '#106040' },
  { face: '#109858', rim: '#0c6e40' },
  { face: '#0da85e', rim: '#0a7042' },
]

// Bar colors — index 0 = darkest (first revealed), index 6 = brightest (last revealed).
// Each entry has a bright face color and a darker shade for the gradient's far end.
const RED_COLORS = [
  { bright: '#6e2828', dark: '#4a1e1e' },
  { bright: '#7e3030', dark: '#582424' },
  { bright: '#8e3838', dark: '#662a2a' },
  { bright: '#9e4040', dark: '#723030' },
  { bright: '#ae4848', dark: '#7e3838' },
  { bright: '#bc4c4c', dark: '#8a3c3c' },
  { bright: '#c85050', dark: '#924040' },
]

const GREEN_COLORS = [
  { bright: '#1e5c3a', dark: '#143e28' },
  { bright: '#266840', dark: '#1a4a2e' },
  { bright: '#2e7448', dark: '#205436' },
  { bright: '#368050', dark: '#265c3e' },
  { bright: '#3c9058', dark: '#2c6844' },
  { bright: '#42a466', dark: '#307a4e' },
  { bright: '#4ab87a', dark: '#368a5a' },
]

const TEXT_REDS      = RED_COLORS[N - 1].bright    // '#c85050' — used for all red text
const TEXT_GREENS    = GREEN_COLORS[N - 1].bright  // '#4ab87a' — used for all green text
const CURVE_END_COLOR = 'rgba(240,236,227,0.75)'   // arrowhead and curve label color

// ── COORDINATE HELPERS ────────────────────────────────────────────────────────
function toScreenLeft(bx, radius) {
  return Math.round(ORIGIN_PX + (bx - radius - BL_OX) * DISCS.blenderScale)
}
function toScreenTop(bz) {
  return Math.round(ORIGIN_PZ - (bz - BL_OZ) * DISCS.blenderScale - FACE_H / 2)
}
function lerp(a, b, t) { return a + (b - a) * t }
function interp(arr, tArr, t) {
  if (t <= tArr[0]) return arr[0]
  if (t >= tArr[tArr.length - 1]) return arr[arr.length - 1]
  let i = 0
  while (i < tArr.length - 1 && tArr[i + 1] <= t) i++
  const span = tArr[i + 1] - tArr[i]
  return lerp(arr[i], arr[i + 1], span > 0 ? (t - tArr[i]) / span : 0)
}

// ── CARDINAL SPLINE → CUBIC BEZIER PATH ──────────────────────────────────────
// Converts an array of {x, y} points into a smooth SVG cubic bezier path string.
// tension: 0 = straight lines between points, 0.5 = maximally smooth.
function buildCurvePath(pts, tension) {
  if (pts.length < 2) return ''
  const n = pts.length
  let d = `M ${pts[0].x.toFixed(1)},${pts[0].y.toFixed(1)}`
  for (let i = 0; i < n - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)]
    const p1 = pts[i]
    const p2 = pts[i + 1]
    const p3 = pts[Math.min(n - 1, i + 2)]
    const cp1x = p1.x + (p2.x - p0.x) * tension / 2
    const cp1y = p1.y + (p2.y - p0.y) * tension / 2
    const cp2x = p2.x - (p3.x - p1.x) * tension / 2
    const cp2y = p2.y - (p3.y - p1.y) * tension / 2
    d += ` C ${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`
  }
  return d
}

// ── SCROLL PROGRESS ───────────────────────────────────────────────────────────
function useScrollProgress(ref) {
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

// ── COMPONENT ─────────────────────────────────────────────────────────────────
export default function ProblemsSolutionsNewOptions() {

  // ── OPTION 1: COLLAPSING DISCS ─────────────────────────────────────────────
  const driverRef      = useRef(null)
  const progress       = useScrollProgress(driverRef)
  const rafRef         = useRef(null)
  const startRef       = useRef(null)
  const [collapseStyles, setCollapseStyles] = useState(null)
  const [autoFall, setAutoFall]             = useState(false)

  const PHASES       = 2 * N + 4
  const phase        = Math.min(PHASES - 1, Math.floor(progress * PHASES))
  const dropped      = Math.min(phase, N)
  const fall         = phase >= N + 1 || autoFall
  const greenReveal  = phase >= N + 2
  const droppedGreen = Math.min(N, Math.max(0, phase - (N + 2)))
  const activeI      = (dropped > 0 && !greenReveal) ? dropped - 1 : -1

  // Auto-trigger collapse after the last disc's drop transition finishes (~0.6 s),
  // without waiting for the user to scroll further. Reset if user scrolls back.
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
      const t = Math.min(1, (now - startRef.current) / COLLAPSE_DURATION)
      const styles = RED_DISC_DATA.map(disc => ({
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

  const discVars = {
    '--face-h':   `${FACE_H}px`,
    '--face-hr':  `${FACE_H / 2}px`,
    '--side-elh': `${SIDE_EL_H}px`,
  }

  // ── OPTION 1: INDICATOR BAR DERIVATIONS ────────────────────────────────────

  // A — Red horizontal risk bar (width = last-dropped disc width, scaled)
  const redTopI = Math.max(0, dropped - 1)
  const redBarW = dropped > 0 ? Math.round(RED_DISC_DATA[redTopI].pxWidth * DISCS.towerScale) : 0

  // B — Green horizontal risk bar (width = last-placed green disc width, scaled)
  const greenTopI = Math.max(0, droppedGreen - 1)
  const greenBarW = droppedGreen > 0 ? Math.round(GREEN_DISC_DATA[greenTopI].pxWidth * DISCS.towerScale) : 0

  // C — Red vertical project-value bar (height = scaled distance from tower bottom to top disc face)
  const redValueH = dropped > 0
    ? Math.round((TOWER_H - toScreenTop(RED_DISC_DATA[dropped - 1].initCZ)) * DISCS.towerScale)
    : 0
  // During collapse, track the topmost disc via collapseStyles so the bar mirrors the simulation.
  const collapseTopPx = fall && collapseStyles
    ? Math.round((TOWER_H - collapseStyles[N - 1].top) * DISCS.towerScale)
    : null
  const finalRedValueH = collapseTopPx !== null ? collapseTopPx : redValueH

  // D — Green vertical project-value bar (height = scaled distance from tower bottom to top green disc face)
  const greenValueH = droppedGreen > 0
    ? Math.round((TOWER_H - GREEN_DISC_DATA[droppedGreen - 1].initTop) * DISCS.towerScale)
    : 0

  // ── OPTION 2: BARS & BUBBLES ───────────────────────────────────────────────
  const driverRef2 = useRef(null)
  const chartRef2  = useRef(null)
  const progress2  = useScrollProgress(driverRef2)
  const [cw, setCw] = useState(0)
  const [ch, setCh] = useState(0)

  const PHASES2       = 2 * N + 1
  const phase2        = Math.min(PHASES2 - 1, Math.floor(progress2 * PHASES2))
  const dropped2      = Math.min(phase2, N)
  const greenReveal2  = phase2 >= N
  const droppedGreen2 = Math.max(0, phase2 - N)
  const activeI2      = !greenReveal2 ? dropped2 - 1 : -1
  const activeIG2     = greenReveal2 ? droppedGreen2 - 1 : -1

  useEffect(() => {
    function measure() {
      if (chartRef2.current) {
        setCw(chartRef2.current.offsetWidth)
        setCh(chartRef2.current.offsetHeight)
      }
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  // Reds and greens get proportionally different slot widths; the total canvas
  // width is shared between all visible bars using the greenRedRatio weight.
  const totalEffective = dropped2 + BARS.greenRedRatio * droppedGreen2
  const denom      = Math.max(0.001, totalEffective)
  const redSlotW   = cw / denom
  const greenSlotW = BARS.greenRedRatio * redSlotW

  // Curve points: the vertical midpoint of each revealed bar, reds then greens.
  // These drive the smooth bezier only — the overshoot tip is computed separately.
  const baselineY2   = ch > 0 ? ch * (1 - BARS.baselinePct / 100) : 0
  const curvePoints2 = []
  if (cw > 0 && ch > 0) {
    for (let i = 0; i < dropped2; i++) {
      const barH = BARS.redBarHeights[i] * BARS.barHeightRef
      curvePoints2.push({ x: (i + 0.5) * redSlotW, y: baselineY2 - barH / 2 })
    }
    for (let j = 0; j < droppedGreen2; j++) {
      const barH = BARS.greenBarHeights[j] * BARS.barHeightRef
      curvePoints2.push({ x: dropped2 * redSlotW + (j + 0.5) * greenSlotW, y: baselineY2 - barH / 2 })
    }
  }

  // Overshoot tip: a straight extension past the last midpoint in the direction of travel.
  // Kept separate from the bezier points so the final segment is always a clean straight line,
  // which ensures the line terminates flush at the arrowhead base without any bezier drift.
  let curveTipPt2  = null
  let lastAngleDeg2 = 0
  if (curvePoints2.length >= 2) {
    const last = curvePoints2[curvePoints2.length - 1]
    const prev = curvePoints2[curvePoints2.length - 2]
    const dx = last.x - prev.x
    const dy = last.y - prev.y
    const segLen = Math.sqrt(dx * dx + dy * dy)
    if (segLen > 0) {
      curveTipPt2   = { x: last.x + (dx / segLen) * BARS.curveOvershootPx, y: last.y + (dy / segLen) * BARS.curveOvershootPx }
      lastAngleDeg2 = Math.atan2(dy, dx) * (180 / Math.PI)
    }
  }

  // Full path: smooth bezier through midpoints, then a straight L to the overshoot tip.
  // The straight final segment means the arrowhead base and line-end are always exactly flush.
  const curvePath2Base = buildCurvePath(curvePoints2, BARS.curveTension)
  const curvePath2 = curveTipPt2
    ? `${curvePath2Base} L ${curveTipPt2.x.toFixed(1)},${curveTipPt2.y.toFixed(1)}`
    : curvePath2Base


  // x% along the chart width where the red-to-green color transition occurs.
  const gradTransitionPct2 = (cw > 0 && dropped2 > 0)
    ? Math.min(99, (dropped2 * redSlotW / cw) * 100)
    : 100

  // Label tracks the arrowhead base (the overshoot tip), not the last bar midpoint.
  const labelPt2 = curveTipPt2

  return (
    <div className={s.root} style={{ '--red': TEXT_REDS, '--green': TEXT_GREENS }}>
      <div className={s.bg} aria-hidden="true" />

      {/* ── INTRO ──────────────────────────────────────────────────────────── */}
      <section className={s.intro}>
        <div className={s.introBox}>
          <p className={s.eyebrow}>The Hidden Cost of Generic Structural Service</p>
          <h2 className={s.introH}>
            When structure is treated as a commodity,{' '}
            <em>the whole project pays.</em>
          </h2>
          <p className={s.introSub}>
            Seven ways a TI project loses value, time, and design integrity — and what changes
            when the engineer understands the building.
          </p>
          <span className={s.cue}>scroll to explore</span>
        </div>
      </section>

      {/* ── OPTION LABEL: BARS & BUBBLES ───────────────────────────────────── */}
      <div className={s.optionLabel}>
        <div className={s.optionDivider} />
        <span>Bars &amp; Bubbles</span>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          OPTION 1 — BARS & BUBBLES (full-width, vertically spread)
      ══════════════════════════════════════════════════════════════════════ */}
      <div ref={driverRef2} className={s.driver} style={{ height: `${PHASES2 * BARS.scrollVhPerPhase}vh` }}>
        <div className={s.scene2}>
          <div className={s.chartArea2} ref={chartRef2}
               style={{ '--baseline': `${BARS.baselinePct}%`, '--bubble-font-scale': BARS.fontScale, '--bubble-bar-gap': `${BARS.bubbleBarGap}px` }}>

            {/* ── TRAJECTORY CURVE SVG — sits behind bars/bubbles ────────────────── */}
            {cw > 0 && ch > 0 && (
              <svg
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', overflow: 'visible', zIndex: 2 }}
                aria-hidden="true"
              >
                <defs>
                  <linearGradient id="curveGrad2" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2={cw} y2="0">
                    <stop offset="0%"                         stopColor={TEXT_REDS} />
                    <stop offset={`${gradTransitionPct2}%`}   stopColor={TEXT_REDS} />
                    <stop offset={`${Math.min(100, gradTransitionPct2 + 5)}%`} stopColor={TEXT_GREENS} />
                    <stop offset="100%"                       stopColor={TEXT_GREENS} />
                  </linearGradient>
                  {BARS.arrowType === 'solid' && (
                    <marker
                      id="arrow2"
                      markerUnits="userSpaceOnUse"
                      markerWidth={BARS.arrowSize}
                      markerHeight={BARS.arrowSize}
                      refX="0"
                      refY={BARS.arrowSize / 2}
                      orient="auto"
                    >
                      <path
                        d={`M0,0 L0,${BARS.arrowSize} L${BARS.arrowSize},${BARS.arrowSize / 2} z`}
                        fill={CURVE_END_COLOR}
                      />
                    </marker>
                  )}
                </defs>

                {curvePath2 && (
                  <path
                    d={curvePath2}
                    fill="none"
                    stroke="rgba(240,236,227,0.55)"
                    strokeWidth={BARS.curveStrokeWidth}
                    strokeLinecap="round"
                    opacity={BARS.curveOpacity}
                    markerEnd={BARS.arrowType === 'solid' ? 'url(#arrow2)' : undefined}
                  />
                )}

                {/* Hollow triangle — base crossbar at trajectory endpoint, tip forward */}
                {BARS.arrowType === 'hollow' && curveTipPt2 && (
                  <g
                    transform={`translate(${curveTipPt2.x},${curveTipPt2.y}) rotate(${lastAngleDeg2})`}
                    stroke={CURVE_END_COLOR}
                    strokeWidth={BARS.arrowStrokeWidth}
                    strokeLinecap="round"
                    opacity={BARS.curveOpacity}
                    fill="none"
                  >
                    <line x1="0" y1={-BARS.arrowSize * 0.55} x2="0" y2={BARS.arrowSize * 0.55} />
                    <line x1="0" y1={-BARS.arrowSize * 0.55} x2={BARS.arrowSize} y2="0" />
                    <line x1="0" y1={BARS.arrowSize * 0.55} x2={BARS.arrowSize} y2="0" />
                  </g>
                )}

                {/* Chevron V — two arms meeting at tip, center bisector connects to trajectory endpoint */}
                {BARS.arrowType === 'chevron' && curveTipPt2 && (
                  <g
                    transform={`translate(${curveTipPt2.x},${curveTipPt2.y}) rotate(${lastAngleDeg2})`}
                    stroke={CURVE_END_COLOR}
                    strokeWidth={BARS.arrowStrokeWidth}
                    strokeLinecap="round"
                    opacity={BARS.curveOpacity}
                    fill="none"
                  >
                    {/* top arm — from trajectory endpoint to tip */}
                    <line x1="0" y1={-BARS.arrowSize * 0.55} x2={BARS.arrowSize} y2="0" />
                    {/* bottom arm — from trajectory endpoint to tip */}
                    <line x1="0" y1={BARS.arrowSize * 0.55} x2={BARS.arrowSize} y2="0" />
                    {/* center bisector — from trajectory endpoint straight to tip, bisects the V */}
                    <line x1="0" y1="0" x2={BARS.arrowSize} y2="0" />
                  </g>
                )}

                {labelPt2 && (
                  <text
                    x={labelPt2.x}
                    y={labelPt2.y}
                    dx="0"
                    dy={-(BARS.curveStrokeWidth * 0.5 + 6)}
                    textAnchor="end"
                    fontFamily="'IBM Plex Mono', monospace"
                    fontSize={9 * BARS.curveLabelFontScale}
                    letterSpacing="0.22em"
                    fill="rgba(176,168,154,0.85)"
                    transform={`rotate(${lastAngleDeg2}, ${labelPt2.x}, ${labelPt2.y})`}
                    style={{ opacity: curvePoints2.length >= 3 ? 1 : 0, transition: 'opacity 0.4s ease', textTransform: 'uppercase' }}
                  >
                    Project Value Trajectory
                  </text>
                )}
              </svg>
            )}

            {/* ── SECTION HEADERS ─────────────────────────────────────────────── */}
            {/* "The Risk" stays centered in the red region, which compresses as greens appear */}
            <div style={{
              position: 'absolute', top: '6vh', zIndex: 2,
              left: dropped2 >= 2 ? dropped2 * redSlotW / 2 : cw / 4,
              transform: 'translateX(-50%)', textAlign: 'center',
              transition: `left ${BARS.positionAnimDuration}s ease`,
            }}>
              <p className={s.eyebrowRed}>Common Problems</p>
              <h3 className={s.sectionTitle}>The Risk</h3>
            </div>
            {/* "The Solution" stays centered in the revealed green region, which grows rightward */}
            <div style={{
              position: 'absolute', top: '6vh', zIndex: 2,
              left: droppedGreen2 > 0 ? dropped2 * redSlotW + droppedGreen2 * greenSlotW / 2 : cw * 0.75,
              transform: 'translateX(-50%)', textAlign: 'center',
              opacity: droppedGreen2 > 0 ? 1 : 0,
              transition: `left ${BARS.positionAnimDuration}s ease, opacity 0.5s ease`,
              pointerEvents: droppedGreen2 > 0 ? 'auto' : 'none',
            }}>
              <p className={s.eyebrowGreen}>Done Right</p>
              <h3 className={s.sectionTitle}>The Solution</h3>
            </div>

            {/* ── RED GROUP — slot index 0..dropped2-1, shifts left as greens appear ── */}
            {cw > 0 && ITEMS.map((item, i) => {
              const on   = dropped2 > i
              const live = i === activeI2 && on
              const barH = BARS.redBarHeights[i] * BARS.barHeightRef
              const centerX = (i + 0.5) * redSlotW
              const glow = `0 0 ${BARS.glowRadius}px ${RED_COLORS[N - 1].bright}aa`

              return (
                <div
                  key={`red-${i}`}
                  className={s.pairSlot2}
                  style={{
                    left: centerX,
                    opacity: on ? 1 : 0,
                    transition: `left ${BARS.positionAnimDuration}s ease, opacity ${BARS.opacityAnimDuration}s ease`,
                    zIndex: 1,
                  }}
                >
                  {on && (
                    <div
                      className={s.bubble2}
                      style={{
                        width: BARS.bubbleDiameter,
                        height: BARS.bubbleDiameter,
                        borderRadius: BARS.bubbleDiameter / 2,
                        background: `radial-gradient(circle, ${DISC_REDS[N - 1].face}, ${DISC_REDS[N - 1].rim})`,
                        boxShadow: live ? glow : 'none',
                      }}
                    >
                      <span className={s.bubbleCat2}>{item.category}</span>
                      <span className={s.bubbleTxt2}>{item.ntext}</span>
                    </div>
                  )}
                  <div
                    className={s.bar2}
                    style={{
                      width: BARS.barWidth,
                      height: on ? barH : 0,
                      background: `linear-gradient(to bottom, ${RED_COLORS[N - 1].bright}, ${RED_COLORS[N - 1].dark})`,
                      boxShadow: live ? glow : 'none',
                      transition: `height ${BARS.barAnimDuration}s cubic-bezier(0.18,1.18,0.38,1)`,
                    }}
                  />
                </div>
              )
            })}

            {/* ── GREEN GROUP — slot index dropped2..dropped2+droppedGreen2-1, always rightmost ── */}
            {cw > 0 && ITEMS.map((item, i) => {
              const on   = droppedGreen2 > i
              const live = i === activeIG2 && on
              const barH = BARS.greenBarHeights[i] * BARS.barHeightRef
              const centerX = dropped2 * redSlotW + (i + 0.5) * greenSlotW
              const glow = `0 0 ${BARS.glowRadius}px ${GREEN_COLORS[N - 1].bright}aa`

              if (!on) return null
              return (
                <div
                  key={`green-${i}`}
                  className={s.pairSlot2}
                  style={{ left: centerX, zIndex: 1 }}
                >
                  <div
                    className={[s.bubble2, s.greenBubble2].join(' ')}
                    style={{
                      width: BARS.bubbleDiameter,
                      height: BARS.bubbleDiameter,
                      borderRadius: BARS.bubbleDiameter / 2,
                      background: `radial-gradient(circle, ${DISC_GREENS[N - 1].face}, ${DISC_GREENS[N - 1].rim})`,
                      boxShadow: live ? glow : 'none',
                    }}
                  >
                    <span className={s.bubbleCat2}>{item.category}</span>
                    <span className={s.bubbleTxt2}>{item.ptext}</span>
                  </div>
                  <div
                    className={s.bar2}
                    style={{
                      width: BARS.barWidth,
                      height: barH,
                      background: `linear-gradient(to bottom, ${GREEN_COLORS[N - 1].bright}, ${GREEN_COLORS[N - 1].dark})`,
                      boxShadow: live ? glow : 'none',
                      transition: `height ${BARS.barAnimDuration}s cubic-bezier(0.18,1.18,0.38,1)`,
                    }}
                  />
                </div>
              )
            })}

          </div>
        </div>
      </div>

      {/* ── OPTION LABEL: COLLAPSING DISCS ─────────────────────────────────── */}
      <div className={s.optionLabel}>
        <div className={s.optionDivider} />
        <span>Collapsing Discs</span>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          OPTION 2 — COLLAPSING DISCS
      ══════════════════════════════════════════════════════════════════════ */}
      <div ref={driverRef} className={s.driver} style={{ height: `${PHASES * DISCS.scrollVhPerPhase}vh` }}>
        <div className={[s.scene, fall && s.sceneCollapse].filter(Boolean).join(' ')}
             style={{ '--font-scale': DISCS.fontScale, paddingBottom: `${DISCS.baselinePct}%` }}>

          {/* ── TOWER COLUMN ────────────────────────────────────────────────── */}
          <div className={s.towerCol}>

            {/* ── RED SECTION ──────────────────────────────────────────────── */}
            <div className={s.towerSection}>
              <div className={s.sectionHead}>
                <p className={s.eyebrowRed}>Common Problems</p>
                <h3 className={s.sectionTitle}>The Risk</h3>
              </div>

              <div className={s.towerWithBar}>
                {/* C — Red vertical project-value bar, left of tower */}
                <div className={s.valueBarWrap}>
                  <span className={s.valueBarLabel}>Project Value</span>
                  <div className={s.valueBar} style={{
                    width:      DISCS.valueBarW,
                    height:     finalRedValueH,
                    background: fall ? RED_COLORS[N - 1].bright : 'rgba(176,168,154,0.55)',
                    transition: fall
                      ? 'none'
                      : 'height 0.45s cubic-bezier(0.18,1.18,0.38,1)',
                    opacity: dropped > 0 ? 1 : 0,
                  }} />
                </div>
                <div className={s.towerOuter} style={{ width: TOWER_PX_W, height: TOWER_PX_H }}>
                  <div className={s.towerInner} style={{ transform: `scale(${DISCS.towerScale})` }}>
                    <div
                      className={s.tower}
                      style={{ width: TOWER_W, height: TOWER_H }}
                    >
                      {RED_DISC_DATA.map((disc, i) => {
                        const initLeft = toScreenLeft(disc.initCX, disc.radius)
                        const initTop  = toScreenTop(disc.initCZ)
                        const on   = dropped > i
                        const live = i === activeI && on
                        const cs   = fall && collapseStyles ? collapseStyles[i] : null
                        return (
                          <div
                            key={i}
                            className={[s.disc, on && s.discOn].filter(Boolean).join(' ')}
                            style={{
                              left:            cs ? cs.left      : initLeft,
                              top:             cs ? cs.top       : initTop,
                              width:           disc.pxWidth,
                              transform:       cs ? cs.transform : undefined,
                              transformOrigin: `50% ${FACE_H / 2}px`,
                              transition:      fall ? 'none' : undefined,
                              zIndex:          i + 1,
                              '--f': DISC_REDS[i].face, '--r': DISC_REDS[i].rim,
                              ...discVars,
                            }}
                          >
                            <div className={[s.discFace, live && s.discFaceLive].filter(Boolean).join(' ')}>
                              <span className={s.discNum}>{String(i + 1).padStart(2, '0')}</span>
                            </div>
                            <div className={s.discSide} />
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>

              <div className={[s.barArea, greenReveal && s.barHidden].filter(Boolean).join(' ')}>
                {/* A — Red horizontal risk bar */}
                <div className={s.riskBarWrap}>
                  <div className={s.riskBarLabel}>
                    <span className={s.riskBarTitle}>Risk Exposure</span>
                    <span className={s.riskBarPct}>{dropped > 0 ? Math.round(dropped / N * 100) : 0}%</span>
                    {dropped > 0 && <span className={s.riskBarCat} style={{ opacity: !greenReveal ? 1 : 0, transition: 'opacity 0.6s ease' }}>{ITEMS[redTopI].category}</span>}
                  </div>
                  <div className={s.riskBar} style={{
                    width:      redBarW,
                    height:     DISCS.riskBarH,
                    background: `linear-gradient(to right, ${RED_COLORS[Math.max(0, dropped - 1)].bright}, ${RED_COLORS[Math.max(0, dropped - 1)].dark})`,
                    opacity:    dropped > 0 ? DISCS.barActiveOpacity : DISCS.barIdleOpacity,
                    transition: 'width 0.45s cubic-bezier(0.18,1.18,0.38,1), opacity 0.3s ease',
                  }} />
                </div>
              </div>
            </div>

            {/* ── GREEN SECTION ────────────────────────────────────────────── */}
            <div className={s.towerSection}>
              <div className={[s.sectionHead, !greenReveal && s.sectionHeadHidden].filter(Boolean).join(' ')}>
                <p className={s.eyebrowGreen}>Done Right</p>
                <h3 className={s.sectionTitle}>The Solution</h3>
              </div>

              <div className={s.towerWithBar}>
                {/* D — Green vertical project-value bar, left of tower */}
                <div className={s.valueBarWrap} style={{ opacity: greenReveal ? 1 : 0, transition: 'opacity 0.3s ease' }}>
                  <span className={s.valueBarLabel}>Project Value</span>
                  <div className={s.valueBar} style={{
                    width:      DISCS.valueBarW,
                    height:     greenValueH,
                    background: droppedGreen === N ? GREEN_COLORS[N - 1].bright : 'rgba(176,168,154,0.55)',
                    transition: 'height 0.45s cubic-bezier(0.18,1.18,0.38,1), background-color 0s',
                  }} />
                </div>
                <div className={s.towerOuter} style={{ width: TOWER_PX_W, height: TOWER_PX_H }}>
                  <div className={s.towerInner} style={{ transform: `scale(${DISCS.towerScale})` }}>
                    <div className={s.tower} style={{ width: TOWER_W, height: TOWER_H }}>
                      {GREEN_DISC_DATA.map((gd, i) => {
                        const on   = droppedGreen > i
                        const live = i === droppedGreen - 1 && on
                        return (
                          <div
                            key={i}
                            className={[s.disc, on && s.discOn].filter(Boolean).join(' ')}
                            style={{
                              left:            gd.initLeft,
                              top:             gd.initTop,
                              width:           gd.pxWidth,
                              transformOrigin: `50% ${FACE_H / 2}px`,
                              zIndex:          i + 1,
                              '--f': DISC_GREENS[i].face, '--r': DISC_GREENS[i].rim,
                              ...discVars,
                            }}
                          >
                            <div className={[s.discFace, live && s.discFaceLiveGreen].filter(Boolean).join(' ')}>
                              <span className={s.discNum}>{String(i + 1).padStart(2, '0')}</span>
                            </div>
                            <div className={s.discSide} />
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>

              <div className={[s.barArea, !greenReveal && s.barHidden].filter(Boolean).join(' ')}>
                {/* B — Green horizontal risk bar */}
                <div className={s.riskBarWrap}>
                  <div className={s.riskBarLabel}>
                    <span className={s.riskBarTitle}>Risk Resolved</span>
                    <span className={s.riskBarPct}>{droppedGreen > 0 ? Math.round(droppedGreen / N * 100) : 0}%</span>
                    {droppedGreen > 0 && <span className={s.riskBarCat} style={{ opacity: phase < PHASES - 1 ? 1 : 0, transition: 'opacity 0.6s ease' }}>{ITEMS[greenTopI].category}</span>}
                  </div>
                  <div className={s.riskBar} style={{
                    width:      greenBarW,
                    height:     DISCS.riskBarH,
                    background: `linear-gradient(to right, ${GREEN_COLORS[Math.max(0, droppedGreen - 1)].bright}, ${GREEN_COLORS[Math.max(0, droppedGreen - 1)].dark})`,
                    opacity:    droppedGreen > 0 ? DISCS.barActiveOpacity : DISCS.barIdleOpacity,
                    transition: 'width 0.45s cubic-bezier(0.18,1.18,0.38,1), opacity 0.3s ease',
                  }} />
                </div>
              </div>
            </div>

          </div>

          {/* ── TEXT PANEL ─────────────────────────────────────────────────── */}
          <div className={s.textCol}>
            {ITEMS.map((item, i) => {
              const on      = dropped > i
              const live    = i === activeI && on
              const posOn   = droppedGreen > i
              const posLive = i === droppedGreen - 1 && posOn

              return (
                <div
                  key={i}
                  className={[
                    s.card,
                    on    && s.cardOn,
                    live  && s.cardLive,
                    posOn && s.cardPos,
                  ].filter(Boolean).join(' ')}
                >
                  <span className={s.cardN}>{String(i + 1).padStart(2, '0')}</span>
                  <div className={s.cardBody}>

                    <div className={s.negSection}>
                      <p className={s.cardCat}>{item.category}</p>
                      <p className={s.cardTxt}>{item.ntext}</p>
                    </div>

                    <div className={[s.posSlot, on && s.posSlotReserved, posOn && s.posSlotOn].filter(Boolean).join(' ')}>
                      {posOn && (
                        <div className={s.posRow}>
                          <span
                            className={[s.pencilIcon, posLive && s.pencilVisible].filter(Boolean).join(' ')}
                            style={i === N - 1 && phase >= PHASES - 1 ? { opacity: 0, transition: 'opacity 0.6s ease' } : undefined}
                            aria-hidden="true"
                          >
                            <svg viewBox="0 0 16 16" fill="none" className={s.pencilSvg}>
                              <path d="M11.5 2.5a1.5 1.5 0 0 1 2 2L5 13l-3 1 1-3 8.5-8.5z"
                                stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </span>
                          <p
                            key={`pos-${i}-${posOn}`}
                            className={[s.posText, posOn && s.posTextWrite].filter(Boolean).join(' ')}
                          >
                            {item.ptext}
                          </p>
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              )
            })}
          </div>

        </div>
      </div>

      {/* ── CONTACT ────────────────────────────────────────────────────────── */}
      <section className={s.contact}>
        <div className={s.contactBox}>
          <p className={s.contactEye}>Start with the right foundation.</p>
          <h2 className={s.contactH}>
            Let's talk about<br /><span>your TI project.</span>
          </h2>
          <p className={s.contactSub}>
            Structural expertise from day one — before decisions get expensive to undo.
          </p>
          <a href="mailto:info@nabihy.com" className={s.contactBtn}>
            Get in touch
            <svg viewBox="0 0 16 16" fill="none" width="16" height="16">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
          <div className={s.contactMeta}>
            <span>Nabih Youssef &amp; Associates</span>
            <span className={s.dot}>·</span>
            <span>Structural Engineers</span>
            <span className={s.dot}>·</span>
            <span>Los Angeles, CA</span>
          </div>
        </div>
      </section>
    </div>
  )
}
