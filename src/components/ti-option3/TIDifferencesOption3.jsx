import { useRef, useEffect, useState } from 'react'
import s from './TIDifferencesOption3.module.css'
import simMu045 from './simulation_data_mu_0.45.json'
import simMu050 from './simulation_data_mu_0.50.json'
import simMu055 from './simulation_data_mu_0.55.json'


// ══════════════════════════════════════════════════════════════════════════════
//  COLLAPSING DISCS — all tuning lives here
// ══════════════════════════════════════════════════════════════════════════════
const DISCS = {

  // ══ General — applies to both Collapsing Discs 1 and Collapsing Discs 2 ═════

  // ── rendering ───────────────────────────────────────────────────────────────
  // Raw pixel-per-Blender-unit scale used to convert the simulation coordinates
  // into screen pixels before towerScale shrinks everything to fit 100vh.
  // Larger value → bigger tower before shrinking.
  blenderScale: 120,

  // Final uniform scale applied to the whole tower container so it fits within
  // the viewport. 1.0 = full simulation size; 0.58 ≈ fills ~80% of 100vh.
  towerScale: 0.64,

  // ── scroll ───────────────────────────────────────────────────────────────────
  // Viewport-heights of scroll travel devoted to each animation phase.
  // More → each disc drops in more slowly (user scrolls further per step).
  // With 7 items and 3 extra phases, total scroll = DISC_PHASES * scrollVhPerPhase.
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
  fontScale: 1.0,

  // ── text ratio ───────────────────────────────────────────────────────────────
  // Font size of the positive (solution) text relative to the negative (problem) text.
  // 1.0 = same size; 1.2 = solution text is 20% larger than problem text.
  // Both are still scaled by fontScale, so this ratio is applied on top of that.
  posNegFontRatio: 0.9,

  // ── animation ────────────────────────────────────────────────────────────────
  // Duration (seconds) of each disc's drop animation when it lands on the tower.
  dropAnimDuration: 0.58,

  // ── indicator bars ───────────────────────────────────────────────────────────
  // Height (px) of the horizontal risk bar that sits below the disc stack.
  riskBarH: 14,

  // Width (px) of the horizontal risk bar at its maximum (100% of discs dropped).
  // Set to null to use the topmost disc's diameter automatically.
  riskBarMaxW: null,

  // Which side the red horizontal risk bar grows from as discs are added.
  //   'left'   — bar extends rightward from the left edge (default)
  //   'right'  — bar extends leftward from the right edge
  //   'center' — bar extends equally from both sides toward the edges
  redRiskBarGrowDir: 'left',

  // Which side the green horizontal risk bar grows from as discs are added.
  greenRiskBarGrowDir: 'center',

  // Uniform scale applied to the maximum width of both red and green horizontal bars.
  // 1.0 = natural max (widest disc); 0.5 = half that width; 1.5 = 50% wider.
  riskBarScale: 1.0,

  // Width (px) of the vertical project-value bar shown beside each tower.
  valueBarW: 5,

  // Gap (px) between the vertical project-value bar and the tower.
  // Controls the margin-right of the bar wrapper next to the tower.
  valueBarGap: 100,

  // Opacity of indicator bars before the first disc is placed.
  // 0 = completely hidden; 0.2 = faint ghost; 1 = fully visible from the start.
  barIdleOpacity: 0,

  // Opacity of indicator bars once at least one disc is revealed.
  barActiveOpacity: 1,

  // ── column split ─────────────────────────────────────────────────────────────
  // Width of the disc (tower) column as a percentage of the total scene width.
  // The items (text) column receives the remaining width automatically.
  // 44 = disc column is narrower than the text column; raise to give discs more room.
  towerColPct: 50,

  // ── tower horizontal shift ────────────────────────────────────────────────────
  // Shifts the entire tower content (header + towers + bars) left or right within
  // the tower column. Positive = shift right (toward the text column);
  // negative = shift left (toward the viewport edge).
  // 0 = centered inside the tower column (default).
  towerColShift: -100,

  // ══ Collapsing Discs 1 ══════════════════════════════════════════════════════
  // Simulation file for CD1.
  //   simMu045  →  simulation_data_mu_0.45.json
  //   simMu050  →  simulation_data_mu_0.50.json
  //   simMu055  →  simulation_data_mu_0.55.json
  cd1SimData: simMu050,

  // ══ Collapsing Discs 2 ══════════════════════════════════════════════════════
  // Simulation file for CD2.
  cd2SimData: simMu055,

  // ══ Collapsing Discs 3 ══════════════════════════════════════════════════════
  // Simulation file for CD3. Layout: single tower on left, all items on right.
  // Red tower fades out on green reveal; green tower fades in at same position.
  cd3SimData: simMu055,

  // Additional scale multiplier applied only to the CD3 tower, on top of
  // towerScale. 1.0 = same size as CD1/CD2; 0.8 = 20% smaller than them.
  cd3TowerScale: 1.3,

  // ══ Collapsing Discs 4 ══════════════════════════════════════════════════════
  // Full-screen tower — no text column. Item text is written curved on each disc.
  // Red tower fades out on green reveal; green tower fades in at same position.
  cd4SimData: simMu055,

  // Independent scale multiplier for CD4 on top of towerScale.
  // 2.0 = discs are twice the visual size of the base towerScale.
  cd4TowerScale: 2.5,

  // Scale factors for the two-line description text on CD4 discs.
  // 1.0 = natural size derived from fontScale; increase to make text larger.
  cd4RedTextScale:   1.0,
  cd4GreenTextScale: 1.0,

  // Left/right gap between the tape and each end of the disc side.
  // Fraction of disc width per side. Text wraps inside the tape naturally.
  // 0.10 = 10% from left and 10% from right.
  cd4TapeSideMargin: 0.075,

  // Top/bottom gap between the tape edge and the top/bottom of the disc side face.
  // Fraction of ry (half the disc face height) per side.
  // 0.0 = tape fills full side face height; 0.1 = 10% gap on top and bottom.
  cd4TapeTopBotMargin: 0.15,

  // Opacity of the tape background fill on CD4 discs.
  // 0 = fully transparent (outline only); 1 = fully opaque.
  cd4TapeBgOpacity: 0.92,
}

// ══════════════════════════════════════════════════════════════════════════════
//  BARS & BUBBLES — all tuning lives here
// ══════════════════════════════════════════════════════════════════════════════
const BARS = {

  // ══ GENERAL — applies to both Bars & Bubbles 1 and Bars & Bubbles 2 ═════════

  // Uniform font-size multiplier for all text in both visualizations.
  fontScale: 1.0,

  // Viewport-heights of scroll travel per animation phase (one bubble = one phase).
  scrollVhPerPhase: 48,

  // % from the viewport bottom where all bar bases are pinned (shared baseline).
  // 0 = flush to the bottom edge; 10 = baseline sits 10vh above the bottom.
  baselinePct: 5.0,

  // Horizontal width of each bar column, in px.
  barWidth: 36,

  // The height (px) that a multiplier of 1.0 maps to. All bar heights are
  // expressed as multiples of this value, so 1.90 × barHeightRef = tallest bar.
  barHeightRef: 360,

  // Height multiplier for each red bar (index 0 = first to appear).
  // Values above 1.0 are taller than barHeightRef; below 1.0 are shorter.
  redBarHeights:   [1.90, 1.60, 1.30, 1.00, 0.70, 0.40, 0.10],

  // Height multiplier for each green bar (index 0 = first to appear after reds).
  // Intentionally reversed so greens grow as the story resolves.
  greenBarHeights: [0.10, 0.40, 0.70, 1.00, 1.30, 1.60, 1.90],

  // Diameter (= width = height) of every bubble circle, in px.
  bubbleDiameter: 200,

  // Gap (px) between the bottom edge of the bubble and the top edge of its bar.
  bubbleBarGap: 8,

  // Blur radius (px) of the glow on the active bubble. 0 = no glow.
  glowRadius: 64,

  // Ratio of green slot width to red slot width.
  // 1.0 = equal; 2.0 = each green bar gets twice the horizontal room as a red bar.
  greenRedRatio: 1.0,

  // ══ BARS & BUBBLES 1 — slot-based chart with trajectory curve ════════════════

  // Duration (s) of the bar grow/shrink CSS transition when a bar is revealed.
  barAnimDuration: 2.0,

  // Duration (s) of the horizontal slot-repositioning CSS transition.
  positionAnimDuration: 1.0,

  // Duration (s) of the opacity fade-in when a bar first appears.
  opacityAnimDuration: 2,

  // Controls how curved the spline is. 0 = straight segments; 0.5 = very rounded.
  curveTension: 0.2,

  // Overall opacity of the trajectory curve and its label. 0 = invisible; 1 = opaque.
  curveOpacity: 0.6,

  // Stroke width (px) of the trajectory curve line.
  curveStrokeWidth: 4,

  // Arrow style: 'solid' | 'hollow' | 'chevron'
  arrowType: 'hollow',

  // Arm length (px) of the arrowhead from base to tip.
  arrowSize: 50,

  // Stroke width (px) of the hollow/chevron arrowhead arms.
  arrowStrokeWidth: 4,

  // Font size multiplier for the "Project Value Trajectory" label.
  curveLabelFontScale: 1.5,

  // How far (px) the curve overshoots past the last bar midpoint.
  curveOvershootPx: 40,

  // Gap (px) between the trajectory label box right edge and the arrowhead.
  labelBoxGap: 16,


  // ══ BARS & BUBBLES 2 — diagonal scrub animation ══════════════════════════════

  // Scale for BB2 bubbles and bars only — multiplies bubbleDiameter and barWidth.
  // Does not affect text or titles. 1.0 = same as BB1 base sizes.
  bb2BubbleBarScale: 1.5,

  // Opacity the exiting bubble/bar fades to as it travels toward its exit corner.
  exitFadeOpacity: 0.1,

  // Horizontal distance from page center to the diagonal off-screen anchor, as a
  // fraction of viewport width. Controls how many bubbles are visible side-by-side
  // — reduce to pack more bubbles on screen at once.
  horizSpacing: 0.3,

  // Distance from page center to the off-screen point for the horizontal
  // red→green transition, expressed as a fraction of viewport width.
  // 0.6 = 10% past the viewport edge (barely off-screen); increase to extend the slide.
  horizTransitionSpacing: 0.42,

  // Number of scroll phases devoted to the zoom-out chart reveal after the
  // conveyor completes. 3 = comfortable; increase for a slower reveal.
  bb2ChartPhases: 3,

  // Controls how staggered the fan-out is during the BB2 chart zoom-out.
  // 1.0 = last bubble starts moving only after first bubble has fully arrived.
  // 0.5 = bubbles start overlapping quickly. Lower = more simultaneous.
  bb2ChartStaggerFactor: 0.6,

  // bb2ChartT threshold (0–1) after which the section titles begin sliding in.
  bb2ChartTitleDelay: 0.3,

  // Extra scroll phases appended after the zoom-out completes so the visitor
  // can absorb the full chart before the page scrolls to the next section.
  bb2EndDwellPhases: 1,
}

// ══════════════════════════════════════════════════════════════════════════════
//  All user-visible text lives here
// ══════════════════════════════════════════════════════════════════════════════

//const ITEMS = [
//  { category: 'Communication',      ntext: 'Poor team coordination causes uncertainty and schedule loss.',                  ptext: 'Clear coordination across structural, architect, contractor, and owner — fewer delays.' },
//  { category: 'Fee Accuracy',       ntext: 'Low initial proposal hides scope gaps — add-service costs follow.',             ptext: 'Proposal reflects real scope from the start — clients avoid surprise costs.' },
//  { category: 'Plan Check',         ntext: "Slow approvals because drawings don't anticipate city requirements.",           ptext: 'Review moves predictably — drawings are prepared to meet what the city expects.' },
//  { category: 'Field Coordination', ntext: 'Generic details cause conflicts and RFIs during construction.',                 ptext: 'Details tailored to actual site conditions — drawings are clear and practical to build.' },
//  { category: 'Design Quality',     ntext: 'Innovative ideas compromised — engineer cannot support the vision.',            ptext: 'Architecture protected — structural solution is strong enough to support the design intent.' },
//  { category: 'Early Clarity',      ntext: 'Critical decisions made before structural constraints are understood.',         ptext: "Structural input provided upfront — owners and architects know what's possible early." },
//  { category: 'Building Knowledge', ntext: 'Structural system never studied — the whole project rests on a false premise.', ptext: 'Structural system studied early so design reflects how the building actually works.' },
//]

const ITEMS = [
  { category: 'Site Intelligence',      ntext: 'Existing building treated as a generic structure. Design built on a false premise.',                          ptext: 'Structural system studied early on its own terms. Every decision reflects how the building actually works.' },
  { category: 'Front-End Clarity',      ntext: 'Generic assumptions replace the right questions. Late discoveries create avoidable cost.',                    ptext: 'Structural input provided early. Owners and architects know what is possible and what to resolve.' },
  { category: 'Design Ambition',        ntext: 'Engineer cannot support the design, architect hears no. Innovative ideas lose their impact.',                 ptext: 'Strong structural solutions protect the design vision. Innovative ideas reach construction intact.' },
  { category: 'Construction Readiness', ntext: 'Standard details ignore actual site conditions. Conflicts in the field, RFIs follow, small misses chain.',    ptext: 'Details tailored to actual conditions. Drawings are clear, coordinated, and practical to build. RFIs minimized.' },
  { category: 'Approvals',              ntext: 'Drawings submitted without anticipating city expectations. Rework, delays, and longer approvals follow.',     ptext: 'Drawings prepared for what the city will need. Plan check moves predictably without surprises.' },
  { category: 'Team Coordination',      ntext: 'Poor coordination creates cost drift and uncertainty for owners. Slow communication causes schedule loss.',   ptext: 'Communication kept clear across the structural team, architect, contractor, and owner. Fewer delays.' },
  { category: 'Scope & Fees',           ntext: 'Building never studied, scope never fully understood. Low upfront fee becomes a stream of add-services.',     ptext: 'Proposal sized to the real scope. Clients avoid surprise add-services and cost drift.' },
]

const COPY = {
  // Intro section
  introEyebrow:   'Structural Pitfalls in TI Projects',
  introHeadMain:  'When structure is treated as a checkbox,',
  introHeadEm:    'the whole project pays.',
  introSub:       'A TI project can lose value, time, and design integrity in ways that are easy to miss at the start.',
  introCue:       'scroll to explore',

  // Section labels (shared across all three visualizations)
  eyebrowRed:   'Common Problems',
  titleRed:     'The Risk',
  eyebrowGreen: 'Done Right',
  titleGreen:   'The Solution',

  // Trajectory curve label (Bars & Bubbles 1)
  trajectoryLabel: 'Project Value Trajectory',

  // Disc tower bar labels
  barRedLabel:   'Exposed Risk',
  barGreenLabel: 'Resolved Risk',
  barValueLabel: 'Project Value',
}

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

// ── Per-dataset: collapse duration and per-disc history arrays ────────────────
// Disc geometry (radius, thickness, initial positions) is identical across all
// simulation files — only the collapse trajectory (time/center_x/z/angle) differs.

function buildDiscData(simData) {
  return simData.discs.map(d => ({
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
}

const cd1CollapseDuration = Math.round(
  (DISCS.cd1SimData.meta.total_frames / DISCS.cd1SimData.meta.fps) * 1000
)
const cd2CollapseDuration = Math.round(
  (DISCS.cd2SimData.meta.total_frames / DISCS.cd2SimData.meta.fps) * 1000
)

const cd1RedDiscData = buildDiscData(DISCS.cd1SimData)
const cd2RedDiscData = buildDiscData(DISCS.cd2SimData)
const cd3CollapseDuration = Math.round(
  (DISCS.cd3SimData.meta.total_frames / DISCS.cd3SimData.meta.fps) * 1000
)
const cd3RedDiscData = buildDiscData(DISCS.cd3SimData)

// ── Shared geometry — derived from CD1 data (identical across sim files) ─────
const N = cd1RedDiscData.length

const FACE_H     = Math.round(cd1RedDiscData[0].thickness * DISCS.blenderScale)
const SIDE_NET_H = FACE_H
const SIDE_EL_H  = FACE_H / 2 + SIDE_NET_H

const BL_OX = cd1RedDiscData[0].initCX
const BL_OZ = cd1RedDiscData[0].initCZ

const PAD           = 10
const maxInitCZ     = Math.max(...cd1RedDiscData.map(d => d.initCZ))
const blenderRangeZ = maxInitCZ - BL_OZ

const ORIGIN_PX = PAD + Math.round(cd1RedDiscData[0].radius * DISCS.blenderScale)
const ORIGIN_PZ = PAD + Math.round(blenderRangeZ * DISCS.blenderScale) + Math.round(FACE_H / 2)

const maxDiscPxWidth = Math.max(...cd1RedDiscData.map(d => d.pxWidth))
const TOWER_W = PAD + maxDiscPxWidth + PAD
const TOWER_H = Math.round(ORIGIN_PZ + FACE_H / 2 + SIDE_NET_H + PAD)

const TOWER_PX_W = Math.round(TOWER_W * DISCS.towerScale)
const TOWER_PX_H = Math.round(TOWER_H * DISCS.towerScale)

// CD3 has an independent extra scale on top of towerScale
const CD3_SCALE   = DISCS.towerScale * DISCS.cd3TowerScale
const cd3TowerPxW = Math.round(TOWER_W * CD3_SCALE)
const cd3TowerPxH = Math.round(TOWER_H * CD3_SCALE)

// CD4 — same pattern
const cd4CollapseDuration = Math.round(
  (DISCS.cd4SimData.meta.total_frames / DISCS.cd4SimData.meta.fps) * 1000
)
const cd4RedDiscData = buildDiscData(DISCS.cd4SimData)
const CD4_SCALE   = DISCS.towerScale * DISCS.cd4TowerScale
const cd4TowerPxW = Math.round(TOWER_W * CD4_SCALE)
const cd4TowerPxH = Math.round(TOWER_H * CD4_SCALE)

// Value-bar gap scaled per tower variant
const discValueBarGap  = Math.round(DISCS.valueBarGap * DISCS.towerScale)
const disc3ValueBarGap = Math.round(DISCS.valueBarGap * CD3_SCALE)
const disc4ValueBarGap = Math.round(DISCS.valueBarGap * CD4_SCALE)

// ── CD4 text sizing ──────────────────────────────────────────────────────────
// Dividing by CD4_SCALE decouples visual size from disc size: changing
// The overlay SVG lives outside the CSS-scaled towerInner, so these are direct
// screen-pixel sizes — no division by CD4_SCALE needed or wanted.
// Category matches .discCat (9.5px × fontScale).
// Red desc matches .discNegTxt (~14px × fontScale); green matches .discPosTxt (~17px × fontScale × posNegRatio).
const CD4_CAT_FS      = 9.5 * DISCS.fontScale
const CD4_RED_DESC_FS = 14  * DISCS.fontScale * DISCS.cd4RedTextScale
const CD4_GRN_DESC_FS = 17  * DISCS.fontScale * DISCS.posNegFontRatio * DISCS.cd4GreenTextScale

// Left/right gap (fraction of disc width per side).
const CD4_TAPE_SIDE_MARGIN   = DISCS.cd4TapeSideMargin
// Top/bottom gap (fraction of ry per side). Controls tape height.
const CD4_TAPE_TOPBOT_MARGIN = DISCS.cd4TapeTopBotMargin
// Arc peak compensation factor: inset endpoints shift the SVG arc peak upward by ry*f.
// Subtract ry*f from bandTopY (and add to bandBotY) so visual peaks stay fixed at margin=0 position.
// f = sqrt(4 * margin * (1 - margin))
const CD4_TAPE_ARC_F = Math.sqrt(Math.max(0, 4 * CD4_TAPE_SIDE_MARGIN * (1 - CD4_TAPE_SIDE_MARGIN)))

// CD4 font sizes in disc-local (pre-CD4_SCALE) coords.
// Dividing by CD4_SCALE counteracts the parent towerInner scale so visual size matches intent.
const CD4_CAT_FS_L      = CD4_CAT_FS      / CD4_SCALE
const CD4_RED_DESC_FS_L = CD4_RED_DESC_FS / CD4_SCALE
const CD4_GRN_DESC_FS_L = CD4_GRN_DESC_FS / CD4_SCALE
// k-offsets in disc-local pixels (same proportions as screen-space k-values, scaled down)
const CD4_K_CAT_L    = Math.round(CD4_CAT_FS_L * 0.85)
const CD4_K_RED_D1_L = Math.round(CD4_K_CAT_L + CD4_CAT_FS_L * 0.55 + 3 / CD4_SCALE + CD4_RED_DESC_FS_L * 0.85)
const CD4_K_RED_D2_L = Math.round(CD4_K_RED_D1_L + CD4_RED_DESC_FS_L * 1.25 + 2 / CD4_SCALE)
const CD4_K_GRN_D1_L = Math.round(CD4_K_CAT_L + CD4_CAT_FS_L * 0.55 + 3 / CD4_SCALE + CD4_GRN_DESC_FS_L * 0.85)
const CD4_K_GRN_D2_L = Math.round(CD4_K_GRN_D1_L + CD4_GRN_DESC_FS_L * 1.25 + 2 / CD4_SCALE)

// Wrap text onto at most two lines, breaking only at word boundaries.
// Returns [line1, line2] where line2 is '' when text fits on one line.
// avgCharW: 0.52 × fontSize is a conservative estimate for display/body fonts.
function wrapText(str, pxWidth, fontSize) {
  const availW   = pxWidth * (1 - 2 * CD4_TAPE_SIDE_MARGIN)
  const maxChars = Math.floor(availW / (fontSize * 0.52))
  if (str.length <= maxChars) return [str, '']
  const words = str.split(' ')
  let line1 = ''
  for (let j = 0; j < words.length; j++) {
    const candidate = line1 ? line1 + ' ' + words[j] : words[j]
    if (candidate.length > maxChars && line1) {
      return [line1, words.slice(j).join(' ')]
    }
    line1 = candidate
  }
  return [str, '']
}

const GREEN_DISC_DATA = cd1RedDiscData.map((redDisc, i) => {
  const pxWidth  = cd1RedDiscData[N - 1 - i].pxWidth
  const initLeft = Math.round((TOWER_W - pxWidth) / 2)
  const initTop  = Math.round(ORIGIN_PZ - (redDisc.initCZ - BL_OZ) * DISCS.blenderScale - FACE_H / 2)
  return { pxWidth, initLeft, initTop }
})

const TEXT_REDS      = RED_COLORS[N - 1].bright
const TEXT_GREENS    = GREEN_COLORS[N - 1].bright
const CURVE_ACCENT = 'var(--color-accent)'

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

export default function TIDifferencesOption3() {

  // ── Shared disc constants (geometry is identical for CD1 and CD2) ────────────
  const DISC_PHASES = 2 * N + 4

  const discVars = {
    '--face-h':   `${FACE_H}px`,
    '--face-hr':  `${FACE_H / 2}px`,
    '--side-elh': `${SIDE_EL_H}px`,
  }

  // Full bar = widest disc diameter scaled to screen pixels (shared)
  const discRiskMaxW = Math.round(
    (DISCS.riskBarMaxW ?? maxDiscPxWidth * DISCS.towerScale) * DISCS.riskBarScale
  )

  const riskBarStyle = (w, maxW, dir) => {
    const origin = dir === 'right' ? 'right' : dir === 'center' ? 'center' : 'left'
    return { width: maxW, transformOrigin: origin, transform: `scaleX(${maxW > 0 ? w / maxW : 0})` }
  }

  const redRiskLabelAlign   = DISCS.redRiskBarGrowDir  === 'right' ? 'flex-end' : DISCS.redRiskBarGrowDir  === 'center' ? 'center' : 'flex-start'
  const greenRiskLabelAlign = DISCS.greenRiskBarGrowDir === 'right' ? 'flex-end' : DISCS.greenRiskBarGrowDir === 'center' ? 'center' : 'flex-start'

  // ── COLLAPSING DISCS 1 ──────────────────────────────────────────────────────
  const discDriverRef      = useRef(null)
  const discProgress       = useScrollProgress(discDriverRef)
  const discRafRef         = useRef(null)
  const discStartRef       = useRef(null)
  const [discCollapseStyles, setDiscCollapseStyles] = useState(null)
  const [discAutoFall, setDiscAutoFall]             = useState(false)

  const discPhase        = Math.min(DISC_PHASES - 1, Math.floor(discProgress * DISC_PHASES))
  const discDropped      = Math.min(discPhase, N)
  const discFall         = discPhase >= N + 1 || discAutoFall
  const discGreenReveal  = discPhase >= N + 2
  const discDroppedGreen = Math.min(N, Math.max(0, discPhase - (N + 2)))
  const discActiveI      = (discDropped > 0 && !discGreenReveal) ? discDropped - 1 : -1

  useEffect(() => {
    if (discDropped === N) {
      const id = setTimeout(() => setDiscAutoFall(true), 620)
      return () => clearTimeout(id)
    }
    setDiscAutoFall(false)
  }, [discDropped])

  useEffect(() => {
    if (!discFall) {
      if (discRafRef.current) { cancelAnimationFrame(discRafRef.current); discRafRef.current = null }
      discStartRef.current = null
      setDiscCollapseStyles(null)
      return
    }
    function tick(now) {
      if (discStartRef.current === null) discStartRef.current = now
      const t = Math.min(1, (now - discStartRef.current) / cd1CollapseDuration)
      const styles = cd1RedDiscData.map(disc => ({
        left:      toScreenLeft(interp(disc.center_x, disc.time, t), disc.radius),
        top:       toScreenTop(interp(disc.center_z, disc.time, t)),
        transform: `rotate(${interp(disc.angle_deg, disc.time, t).toFixed(2)}deg)`,
      }))
      setDiscCollapseStyles(styles)
      if (t < 1) discRafRef.current = requestAnimationFrame(tick)
    }
    discRafRef.current = requestAnimationFrame(tick)
    return () => { if (discRafRef.current) cancelAnimationFrame(discRafRef.current) }
  }, [discFall])

  const discRedTopI   = Math.max(0, discDropped - 1)
  const discGreenTopI = Math.max(0, discDroppedGreen - 1)

  const discRedBarW = discDropped > 0
    ? Math.round(cd1RedDiscData[discDropped - 1].pxWidth * DISCS.towerScale * DISCS.riskBarScale)
    : 0
  const discGreenBarW = discDroppedGreen > 0
    ? Math.round(GREEN_DISC_DATA[discDroppedGreen - 1].pxWidth * DISCS.towerScale * DISCS.riskBarScale)
    : 0

  const discRedValueH = discDropped > 0
    ? Math.round((TOWER_H - toScreenTop(cd1RedDiscData[discDropped - 1].initCZ)) * DISCS.towerScale)
    : 0
  const discCollapseTopPx = discFall && discCollapseStyles
    ? Math.round((TOWER_H - discCollapseStyles[N - 1].top) * DISCS.towerScale)
    : null
  const discFinalRedValueH = discCollapseTopPx !== null ? discCollapseTopPx : discRedValueH

  const discGreenValueH = discDroppedGreen > 0
    ? Math.round((TOWER_H - GREEN_DISC_DATA[discDroppedGreen - 1].initTop) * DISCS.towerScale)
    : 0

  // ── COLLAPSING DISCS 2 ──────────────────────────────────────────────────────
  const disc2DriverRef      = useRef(null)
  const disc2Progress       = useScrollProgress(disc2DriverRef)
  const disc2RafRef         = useRef(null)
  const disc2StartRef       = useRef(null)
  const [disc2CollapseStyles, setDisc2CollapseStyles] = useState(null)
  const [disc2AutoFall, setDisc2AutoFall]             = useState(false)

  const disc2Phase        = Math.min(DISC_PHASES - 1, Math.floor(disc2Progress * DISC_PHASES))
  const disc2Dropped      = Math.min(disc2Phase, N)
  const disc2Fall         = disc2Phase >= N + 1 || disc2AutoFall
  const disc2GreenReveal  = disc2Phase >= N + 2
  const disc2DroppedGreen = Math.min(N, Math.max(0, disc2Phase - (N + 2)))
  const disc2ActiveI      = (disc2Dropped > 0 && !disc2GreenReveal) ? disc2Dropped - 1 : -1

  useEffect(() => {
    if (disc2Dropped === N) {
      const id = setTimeout(() => setDisc2AutoFall(true), 620)
      return () => clearTimeout(id)
    }
    setDisc2AutoFall(false)
  }, [disc2Dropped])

  useEffect(() => {
    if (!disc2Fall) {
      if (disc2RafRef.current) { cancelAnimationFrame(disc2RafRef.current); disc2RafRef.current = null }
      disc2StartRef.current = null
      setDisc2CollapseStyles(null)
      return
    }
    function tick(now) {
      if (disc2StartRef.current === null) disc2StartRef.current = now
      const t = Math.min(1, (now - disc2StartRef.current) / cd2CollapseDuration)
      const styles = cd2RedDiscData.map(disc => ({
        left:      toScreenLeft(interp(disc.center_x, disc.time, t), disc.radius),
        top:       toScreenTop(interp(disc.center_z, disc.time, t)),
        transform: `rotate(${interp(disc.angle_deg, disc.time, t).toFixed(2)}deg)`,
      }))
      setDisc2CollapseStyles(styles)
      if (t < 1) disc2RafRef.current = requestAnimationFrame(tick)
    }
    disc2RafRef.current = requestAnimationFrame(tick)
    return () => { if (disc2RafRef.current) cancelAnimationFrame(disc2RafRef.current) }
  }, [disc2Fall])

  const disc2RedTopI   = Math.max(0, disc2Dropped - 1)
  const disc2GreenTopI = Math.max(0, disc2DroppedGreen - 1)

  const disc2RedBarW = disc2Dropped > 0
    ? Math.round(cd2RedDiscData[disc2Dropped - 1].pxWidth * DISCS.towerScale * DISCS.riskBarScale)
    : 0
  const disc2GreenBarW = disc2DroppedGreen > 0
    ? Math.round(GREEN_DISC_DATA[disc2DroppedGreen - 1].pxWidth * DISCS.towerScale * DISCS.riskBarScale)
    : 0

  const disc2RedValueH = disc2Dropped > 0
    ? Math.round((TOWER_H - toScreenTop(cd2RedDiscData[disc2Dropped - 1].initCZ)) * DISCS.towerScale)
    : 0
  const disc2CollapseTopPx = disc2Fall && disc2CollapseStyles
    ? Math.round((TOWER_H - disc2CollapseStyles[N - 1].top) * DISCS.towerScale)
    : null
  const disc2FinalRedValueH = disc2CollapseTopPx !== null ? disc2CollapseTopPx : disc2RedValueH

  const disc2GreenValueH = disc2DroppedGreen > 0
    ? Math.round((TOWER_H - GREEN_DISC_DATA[disc2DroppedGreen - 1].initTop) * DISCS.towerScale)
    : 0

  // ── COLLAPSING DISCS 3 ──────────────────────────────────────────────────────
  const disc3DriverRef      = useRef(null)
  const disc3Progress       = useScrollProgress(disc3DriverRef)
  const disc3RafRef         = useRef(null)
  const disc3StartRef       = useRef(null)
  const [disc3CollapseStyles, setDisc3CollapseStyles] = useState(null)
  const [disc3AutoFall, setDisc3AutoFall]             = useState(false)

  const disc3Phase        = Math.min(DISC_PHASES - 1, Math.floor(disc3Progress * DISC_PHASES))
  const disc3Dropped      = Math.min(disc3Phase, N)
  const disc3Fall         = disc3Phase >= N + 1 || disc3AutoFall
  const disc3GreenReveal  = disc3Phase >= N + 2
  const disc3DroppedGreen = Math.min(N, Math.max(0, disc3Phase - (N + 2)))
  const disc3ActiveI      = (disc3Dropped > 0 && !disc3GreenReveal) ? disc3Dropped - 1 : -1

  useEffect(() => {
    if (disc3Dropped === N) {
      const id = setTimeout(() => setDisc3AutoFall(true), 620)
      return () => clearTimeout(id)
    }
    setDisc3AutoFall(false)
  }, [disc3Dropped])

  useEffect(() => {
    if (!disc3Fall) {
      if (disc3RafRef.current) { cancelAnimationFrame(disc3RafRef.current); disc3RafRef.current = null }
      disc3StartRef.current = null
      setDisc3CollapseStyles(null)
      return
    }
    function tick(now) {
      if (disc3StartRef.current === null) disc3StartRef.current = now
      const t = Math.min(1, (now - disc3StartRef.current) / cd3CollapseDuration)
      const styles = cd3RedDiscData.map(disc => ({
        left:      toScreenLeft(interp(disc.center_x, disc.time, t), disc.radius),
        top:       toScreenTop(interp(disc.center_z, disc.time, t)),
        transform: `rotate(${interp(disc.angle_deg, disc.time, t).toFixed(2)}deg)`,
      }))
      setDisc3CollapseStyles(styles)
      if (t < 1) disc3RafRef.current = requestAnimationFrame(tick)
    }
    disc3RafRef.current = requestAnimationFrame(tick)
    return () => { if (disc3RafRef.current) cancelAnimationFrame(disc3RafRef.current) }
  }, [disc3Fall])

  const disc3RedTopI   = Math.max(0, disc3Dropped - 1)
  const disc3GreenTopI = Math.max(0, disc3DroppedGreen - 1)

  const disc3RiskMaxW = Math.round(
    (DISCS.riskBarMaxW ?? maxDiscPxWidth * CD3_SCALE) * DISCS.riskBarScale
  )

  const disc3RedBarW = disc3Dropped > 0
    ? Math.round(cd3RedDiscData[disc3Dropped - 1].pxWidth * CD3_SCALE * DISCS.riskBarScale)
    : 0
  const disc3GreenBarW = disc3DroppedGreen > 0
    ? Math.round(GREEN_DISC_DATA[disc3DroppedGreen - 1].pxWidth * CD3_SCALE * DISCS.riskBarScale)
    : 0

  const disc3RedValueH = disc3Dropped > 0
    ? Math.round((TOWER_H - toScreenTop(cd3RedDiscData[disc3Dropped - 1].initCZ)) * CD3_SCALE)
    : 0
  const disc3CollapseTopPx = disc3Fall && disc3CollapseStyles
    ? Math.round((TOWER_H - disc3CollapseStyles[N - 1].top) * CD3_SCALE)
    : null
  const disc3FinalRedValueH = disc3CollapseTopPx !== null ? disc3CollapseTopPx : disc3RedValueH

  const disc3GreenValueH = disc3DroppedGreen > 0
    ? Math.round((TOWER_H - GREEN_DISC_DATA[disc3DroppedGreen - 1].initTop) * CD3_SCALE)
    : 0

  // ── COLLAPSING DISCS 4 ──────────────────────────────────────────────────────
  const disc4DriverRef      = useRef(null)
  const disc4Progress       = useScrollProgress(disc4DriverRef)
  const disc4RafRef         = useRef(null)
  const disc4StartRef       = useRef(null)
  const [disc4CollapseStyles, setDisc4CollapseStyles] = useState(null)
  const [disc4AutoFall, setDisc4AutoFall]             = useState(false)

  const disc4Phase        = Math.min(DISC_PHASES - 1, Math.floor(disc4Progress * DISC_PHASES))
  const disc4Dropped      = Math.min(disc4Phase, N)
  const disc4Fall         = disc4Phase >= N + 1 || disc4AutoFall
  const disc4GreenReveal  = disc4Phase >= N + 2
  const disc4DroppedGreen = Math.min(N, Math.max(0, disc4Phase - (N + 2)))
  const disc4ActiveI      = (disc4Dropped > 0 && !disc4GreenReveal) ? disc4Dropped - 1 : -1

  useEffect(() => {
    if (disc4Dropped === N) {
      const id = setTimeout(() => setDisc4AutoFall(true), 620)
      return () => clearTimeout(id)
    }
    setDisc4AutoFall(false)
  }, [disc4Dropped])

  useEffect(() => {
    if (!disc4Fall) {
      if (disc4RafRef.current) { cancelAnimationFrame(disc4RafRef.current); disc4RafRef.current = null }
      disc4StartRef.current = null
      setDisc4CollapseStyles(null)
      return
    }
    function tick(now) {
      if (disc4StartRef.current === null) disc4StartRef.current = now
      const t = Math.min(1, (now - disc4StartRef.current) / cd4CollapseDuration)
      const styles = cd4RedDiscData.map(disc => ({
        left:      toScreenLeft(interp(disc.center_x, disc.time, t), disc.radius),
        top:       toScreenTop(interp(disc.center_z, disc.time, t)),
        transform: `rotate(${interp(disc.angle_deg, disc.time, t).toFixed(2)}deg)`,
      }))
      setDisc4CollapseStyles(styles)
      if (t < 1) disc4RafRef.current = requestAnimationFrame(tick)
    }
    disc4RafRef.current = requestAnimationFrame(tick)
    return () => { if (disc4RafRef.current) cancelAnimationFrame(disc4RafRef.current) }
  }, [disc4Fall])

  const disc4RedTopI   = Math.max(0, disc4Dropped - 1)
  const disc4GreenTopI = Math.max(0, disc4DroppedGreen - 1)

  const disc4RiskMaxW = Math.round(
    (DISCS.riskBarMaxW ?? maxDiscPxWidth * CD4_SCALE) * DISCS.riskBarScale
  )
  const disc4RedBarW = disc4Dropped > 0
    ? Math.round(cd4RedDiscData[disc4Dropped - 1].pxWidth * CD4_SCALE * DISCS.riskBarScale)
    : 0
  const disc4GreenBarW = disc4DroppedGreen > 0
    ? Math.round(GREEN_DISC_DATA[disc4DroppedGreen - 1].pxWidth * CD4_SCALE * DISCS.riskBarScale)
    : 0

  const disc4RedValueH = disc4Dropped > 0
    ? Math.round((TOWER_H - toScreenTop(cd4RedDiscData[disc4Dropped - 1].initCZ)) * CD4_SCALE)
    : 0
  const disc4CollapseTopPx = disc4Fall && disc4CollapseStyles
    ? Math.round((TOWER_H - disc4CollapseStyles[N - 1].top) * CD4_SCALE)
    : null
  const disc4FinalRedValueH = disc4CollapseTopPx !== null ? disc4CollapseTopPx : disc4RedValueH

  const disc4GreenValueH = disc4DroppedGreen > 0
    ? Math.round((TOWER_H - GREEN_DISC_DATA[disc4DroppedGreen - 1].initTop) * CD4_SCALE)
    : 0

  // ── BARS & BUBBLES 1 ────────────────────────────────────────────────────────
  const bb1DriverRef = useRef(null)
  const bb1ChartRef  = useRef(null)
  const bb1Progress  = useScrollProgress(bb1DriverRef)
  const [bb1Cw, setBb1Cw] = useState(0)
  const [bb1Ch, setBb1Ch] = useState(0)

  const BB1_PHASES       = 2 * N + 1
  const bb1Phase        = Math.min(BB1_PHASES - 1, Math.floor(bb1Progress * BB1_PHASES))
  const bb1Dropped      = Math.min(bb1Phase, N)
  const bb1GreenReveal  = bb1Phase >= N
  const bb1DroppedGreen = Math.max(0, bb1Phase - N)
  const bb1ActiveI      = bb1DroppedGreen === 0 ? bb1Dropped - 1 : -1
  const bb1ActiveIG     = bb1GreenReveal ? bb1DroppedGreen - 1 : -1

  useEffect(() => {
    function measure() {
      if (bb1ChartRef.current) {
        setBb1Cw(bb1ChartRef.current.offsetWidth)
        setBb1Ch(bb1ChartRef.current.offsetHeight)
      }
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  const bb1TotalEffective = bb1Dropped + BARS.greenRedRatio * bb1DroppedGreen
  const bb1Denom      = Math.max(1, bb1TotalEffective)
  const bb1RedSlotW   = bb1Cw / bb1Denom
  const bb1GreenSlotW = BARS.greenRedRatio * bb1RedSlotW

  const bb1BaselineY   = bb1Ch > 0 ? bb1Ch * (1 - BARS.baselinePct / 100) : 0
  const bb1CurvePoints = []
  if (bb1Cw > 0 && bb1Ch > 0) {
    for (let i = 0; i < bb1Dropped; i++) {
      const barH = BARS.redBarHeights[i] * BARS.barHeightRef
      bb1CurvePoints.push({ x: (i + 0.5) * bb1RedSlotW, y: bb1BaselineY - barH / 2 })
    }
    for (let j = 0; j < bb1DroppedGreen; j++) {
      const barH = BARS.greenBarHeights[j] * BARS.barHeightRef
      bb1CurvePoints.push({ x: bb1Dropped * bb1RedSlotW + (j + 0.5) * bb1GreenSlotW, y: bb1BaselineY - barH / 2 })
    }
  }

  let bb1CurveTipPt  = null
  let bb1LastAngleDeg = 0
  if (bb1CurvePoints.length >= 2) {
    const last = bb1CurvePoints[bb1CurvePoints.length - 1]
    const prev = bb1CurvePoints[bb1CurvePoints.length - 2]
    const dx = last.x - prev.x
    const dy = last.y - prev.y
    const segLen = Math.sqrt(dx * dx + dy * dy)
    if (segLen > 0) {
      bb1CurveTipPt   = { x: last.x + (dx / segLen) * BARS.curveOvershootPx, y: last.y + (dy / segLen) * BARS.curveOvershootPx }
      bb1LastAngleDeg = Math.atan2(dy, dx) * (180 / Math.PI)
    }
  }

  const bb1CurvePathBase = buildCurvePath(bb1CurvePoints, BARS.curveTension)
  const bb1CurvePath = bb1CurveTipPt
    ? `${bb1CurvePathBase} L ${bb1CurveTipPt.x.toFixed(1)},${bb1CurveTipPt.y.toFixed(1)}`
    : bb1CurvePathBase

  const bb1GradTransitionPct = (bb1Cw > 0 && bb1Dropped > 0)
    ? Math.min(99, (bb1Dropped * bb1RedSlotW / bb1Cw) * 100)
    : 100

  // Center point of the revealed curve — used to anchor the trajectory label box.
  const bb1LabelCenterPt = bb1CurvePoints.length >= 2
    ? bb1CurvePoints[Math.floor((bb1CurvePoints.length - 1) / 2)]
    : null

  // ── BARS & BUBBLES 2 ─────────────────────────────────────────────────────
  const bb2DriverRef = useRef(null)
  const bb2ChartRef  = useRef(null)
  const bb2Progress  = useScrollProgress(bb2DriverRef)
  const [bb2Cw, setBb2Cw] = useState(0)
  const [bb2Ch, setBb2Ch] = useState(0)

  useEffect(() => {
    function measure() {
      if (bb2ChartRef.current) {
        setBb2Cw(bb2ChartRef.current.offsetWidth)
        setBb2Ch(bb2ChartRef.current.offsetHeight)
      }
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  const BB2_PHASES       = 2 * N + 1
  const BB2_TOTAL_PHASES = BB2_PHASES + BARS.bb2ChartPhases + BARS.bb2EndDwellPhases
  const bb2PhaseRaw      = bb2Progress * BB2_TOTAL_PHASES

  const bb2BaselineY = bb2Ch > 0 ? bb2Ch * (1 - BARS.baselinePct / 100) : 0
  const bb2CenterX   = bb2Cw / 2
  const bb2CenterY   = bb2Ch / 2   // all bubbles land exactly at page center

  const bb2RedCenters   = ITEMS.map(() => ({ x: bb2CenterX, y: bb2CenterY }))
  const bb2GreenCenters = ITEMS.map(() => ({ x: bb2CenterX, y: bb2CenterY }))

  // horizSpacing sets the diagonal anchor position directly — bubble travels from
  // anchor to center over one full phase. Below 0.5 the anchor is within the viewport.
  // horizTransitionSpacing works the same way for the horizontal red→green transition.
  const bb2BubbleDia  = BARS.bubbleDiameter * BARS.bb2BubbleBarScale
  const bb2BarW       = BARS.barWidth      * BARS.bb2BubbleBarScale
  const bb2GlowRadius = BARS.glowRadius    * BARS.bb2BubbleBarScale
  const bb2HalfBub   = bb2BubbleDia / 2
  const bb2OffRightX = bb2CenterX + BARS.horizSpacing * bb2Cw
  const bb2OffLeftX  = bb2CenterX - BARS.horizSpacing * bb2Cw
  const bb2OffTopY   = bb2CenterY - BARS.horizSpacing * bb2Ch
  const bb2OffBotY   = bb2CenterY + BARS.horizSpacing * bb2Ch
  const bb2Off = {
    bottomRight: { x: bb2OffRightX, y: bb2OffBotY },  // red enter
    topLeft:     { x: bb2OffLeftX,  y: bb2OffTopY },  // red exit
    topRight:    { x: bb2OffRightX, y: bb2OffTopY },  // green enter
    bottomLeft:  { x: bb2OffLeftX,  y: bb2OffBotY },  // green exit
    rightMidX:   bb2CenterX + BARS.horizTransitionSpacing * bb2Cw,
    leftMidX:    bb2CenterX - BARS.horizTransitionSpacing * bb2Cw,
  }

  // X anchors: pure horizSpacing, no clamping. Spacing between consecutive bubbles
  // = horizSpacing × Cw + bb2HalfBub at all values.
  // Y anchors: clamped to the container edge so bubbles always enter/exit through
  // the bottom/top and are never visible at t=0, regardless of horizSpacing.
  // bb2HalfBub auto-scales with bb2BubbleBarScale. Midpoint invariant holds:
  //   X unclamped: (offRight+halfBub + offLeft-halfBub)/2 = centerX ✓
  //   Y clamped:   (Ch+halfBub + (-halfBub))/2 = Ch/2 = centerY ✓
  const bb2EntryRightX = bb2OffRightX + bb2HalfBub
  const bb2ExitLeftX   = bb2OffLeftX  - bb2HalfBub
  const bb2EntryBotY   = Math.max(bb2OffBotY + bb2HalfBub, bb2Ch + bb2HalfBub)
  const bb2EntryTopY   = Math.min(bb2OffTopY - bb2HalfBub, -bb2HalfBub)

  // Green conveyor track is greenRedRatio × wider than the red track (both axes).
  // Derived by scaling the already-clamped red anchors about center — this guarantees
  // green spacing = greenRedRatio × red spacing even when horizSpacing is clamped,
  // and horizSpacing still governs both (greens are always proportionally wider).
  const bb2GreenEntryRightX = bb2CenterX + BARS.greenRedRatio * (bb2EntryRightX - bb2CenterX)
  const bb2GreenExitLeftX   = bb2CenterX - BARS.greenRedRatio * (bb2CenterX - bb2ExitLeftX)
  const bb2GreenEntryTopY   = bb2CenterY - BARS.greenRedRatio * (bb2CenterY - bb2EntryTopY)
  const bb2GreenEntryBotY   = bb2CenterY + BARS.greenRedRatio * (bb2EntryBotY - bb2CenterY)

  // Returns { x, y, opacity, entering } or null when the bubble is not visible.
  function getBb2RedState(i) {
    const p = bb2PhaseRaw
    if (i < N - 1) {
      // Conveyor: single diagonal from (entryRight, entryBot) → center → (exitLeft, entryTop)
      // over 2 phases. t=0.5 is always at center. Spacing between consecutive bubbles
      // is (exitLeft - entryRight)/2 horizontally and (entryTop - entryBot)/2 vertically — constant.
      if (p < i || p > i + 2) return null
      const t = (p - i) / 2
      return {
        x:        lerp(bb2EntryRightX, bb2ExitLeftX,  t),
        y:        lerp(bb2EntryBotY,   bb2EntryTopY,  t),
        opacity:  t <= 0.5 ? 1 : lerp(1, BARS.exitFadeOpacity, 2 * (t - 0.5)),
        entering: t <= 0.5,
      }
    }
    // Last red: enters diagonally [N-1, N], exits horizontally [N, N+1]
    if (p < N - 1 || p > N + 1) return null
    if (p <= N) {
      const t = p - (N - 1)
      return {
        x:        lerp(bb2EntryRightX, bb2CenterX, t),
        y:        lerp(bb2EntryBotY,   bb2CenterY, t),
        opacity:  1,
        entering: true,
      }
    }
    const t = p - N
    return {
      x:        lerp(bb2CenterX, bb2Off.leftMidX, t),
      y:        bb2CenterY,
      opacity:  lerp(1, BARS.exitFadeOpacity, t),
      entering: false,
    }
  }

  function getBb2GreenState(i) {
    const p = bb2PhaseRaw
    if (i === 0) {
      // Entry [N-1, N]: rises in sync with last red, offset right by horizTransitionSpacing.
      // Horizontal slide [N, N+1]: slides from rightMidX to center (entering=true for title).
      // Exit [N+1, N+2]: joins the green diagonal conveyor at t=0.5 (center), exits bottom-left.
      // The exit uses the same conveyor formula as green i>0 (t=(p-N)/2), which gives centerY
      // at phase N+1 — continuous with the slide arrival — and constant spacing with green 1.
      if (p < N - 1 || p > N + 2) return null
      if (p <= N) {
        const t = p - (N - 1)
        return {
          x:        lerp(bb2EntryRightX + BARS.horizTransitionSpacing * bb2Cw, bb2Off.rightMidX, t),
          y:        lerp(bb2EntryBotY,   bb2CenterY, t),
          opacity:  1,
          entering: true,
        }
      }
      if (p <= N + 1) {
        const t = p - N
        return {
          x: lerp(bb2Off.rightMidX, bb2CenterX, t),
          y: bb2CenterY,
          opacity: 1, entering: true,
        }
      }
      // Conveyor exit: t=(p-N)/2 ∈ [0.5,1] for p ∈ [N+1,N+2]. At t=0.5: (centerX, centerY). ✓
      const t = (p - N) / 2
      return {
        x:        lerp(bb2GreenEntryRightX, bb2GreenExitLeftX, t),
        y:        lerp(bb2GreenEntryTopY,   bb2GreenEntryBotY, t),
        opacity:  lerp(1, BARS.exitFadeOpacity, 2 * (t - 0.5)),
        entering: false,
      }
    }
    // Last green: arrives at center, then holds there until chart phase begins.
    // Clamping t at 0.5 stops the bubble at the conveyor midpoint (= center by invariant).
    if (i === N - 1) {
      const trackStart = N + (N - 1)
      if (p < trackStart || p > BB2_PHASES) return null
      const t = Math.min(0.5, (p - trackStart) / 2)
      return {
        x:        lerp(bb2GreenEntryRightX, bb2GreenExitLeftX, t),
        y:        lerp(bb2GreenEntryTopY,   bb2GreenEntryBotY, t),
        opacity:  1,
        entering: true,
      }
    }

    // Green i > 0 (not last): full diagonal conveyor, top-right → center → bottom-left
    const trackStart = N + i
    if (p < trackStart || p > trackStart + 2) return null
    const t = (p - trackStart) / 2
    return {
      x:        lerp(bb2GreenEntryRightX, bb2GreenExitLeftX, t),
      y:        lerp(bb2GreenEntryTopY,   bb2GreenEntryBotY, t),
      opacity:  t <= 0.5 ? 1 : lerp(1, BARS.exitFadeOpacity, 2 * (t - 0.5)),
      entering: t <= 0.5,
    }
  }

  // Pre-compute all states to avoid calling helpers twice per element
  const bb2RedStates   = ITEMS.map((_, i) => getBb2RedState(i))
  const bb2GreenStates = ITEMS.map((_, i) => getBb2GreenState(i))

  // Title positions derived directly from the controlling bubbles so movement and
  // opacity are pixel-perfect synced regardless of timing or spacing changes.
  const bb2TransT    = Math.max(0, Math.min(1, bb2PhaseRaw - N))
  const lastRedSt    = bb2RedStates[N - 1]
  const firstGreenSt = bb2GreenStates[0]

  // Risk title: x tracks last red bubble while it exits; fades to 0 with same t
  const bb2TitleRiskX  = (lastRedSt && !lastRedSt.entering) ? lastRedSt.x : bb2CenterX
  const bb2TitleRiskOp = 1 - bb2TransT

  // Solution title: tracks first green bubble; snaps visible at phase N-1 when green 0
  // first appears (still off-screen at that point, so title slides in with the bubble)
  const bb2TitleSolX   = (firstGreenSt && firstGreenSt.entering) ? firstGreenSt.x : bb2CenterX

  // Chart phase (after conveyor): staggered fan-out from center to slot positions
  const bb2ChartT = Math.max(0, Math.min(1, (bb2PhaseRaw - BB2_PHASES) / BARS.bb2ChartPhases))

  // Conveyor solution title fades out completely before chart titles appear
  const bb2TitleSolOp  = bb2PhaseRaw >= N - 1
    ? Math.max(0, 1 - bb2ChartT / Math.max(0.001, BARS.bb2ChartTitleDelay))
    : 0

  // Slot layout — fixed widths based on full 2N count
  const bb2ChartRedSlotW   = bb2Cw > 0 ? bb2Cw / (N * (1 + BARS.greenRedRatio)) : 0
  const bb2ChartGreenSlotW = BARS.greenRedRatio * bb2ChartRedSlotW
  // Sizes lerp from BB2 large → BB1 base as the zoom-out progresses
  const bb2ChartBubDia  = lerp(bb2BubbleDia, BARS.bubbleDiameter, bb2ChartT)
  const bb2ChartHalfBub = bb2ChartBubDia / 2
  const bb2ChartBarW    = lerp(bb2BarW, BARS.barWidth, bb2ChartT)
  const bb2ChartFontSc  = lerp(BARS.fontScale * BARS.bb2BubbleBarScale, BARS.fontScale, bb2ChartT)

  // Per-bubble stagger: rank r ∈ [0, 2N-1] where r=0 = last green (leads).
  // green[N-1-k] → rank k;  red[N-1-k] → rank N+k.
  // startT = r / (2N-1) * staggerFactor, so last bubble starts at staggerFactor.
  // localT = clamp((bb2ChartT - startT) / (1 - startT), 0, 1).
  function bb2ChartLocalT(rank) {
    const startT = Math.min(0.999, (rank / (2 * N - 1)) * BARS.bb2ChartStaggerFactor)
    return Math.max(0, Math.min(1, (bb2ChartT - startT) / (1 - startT)))
  }
  // Chart titles slide in after titleDelay
  const bb2ChartTitleT = Math.max(0, Math.min(1,
    (bb2ChartT - BARS.bb2ChartTitleDelay) / (1 - BARS.bb2ChartTitleDelay)
  ))

  return (
    <div className={s.root} style={{ '--red': TEXT_REDS, '--green': TEXT_GREENS }}>

      {/* ── INTRO ──────────────────────────────────────────────────────────── */}
      <section className={s.intro}>
        <div className={s.introBox}>
          <p className={s.eyebrow}>{COPY.introEyebrow}</p>
          <h2 className={s.introH}>
            {COPY.introHeadMain}{' '}
            <em>{COPY.introHeadEm}</em>
          </h2>
          <p className={s.introSub}>{COPY.introSub}</p>
          <span className={s.cue}>{COPY.introCue}</span>
        </div>
      </section>

      {/* ── OPTION LABEL: BARS & BUBBLES 1 ─────────────────────────────────── */}
      <div className={s.optionLabel}>
        <div className={s.optionDivider} />
        <span>Bars &amp; Bubbles 1</span>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          BARS & BUBBLES 1
      ══════════════════════════════════════════════════════════════════════ */}
      <div ref={bb1DriverRef} className={s.barDriver} style={{ height: `${BB1_PHASES * BARS.scrollVhPerPhase}vh` }}>
        <div className={s.barScene}>
          <div className={s.barChartArea} ref={bb1ChartRef}
               style={{ '--baseline': `${BARS.baselinePct}%`, '--font-scale': BARS.fontScale, '--bubble-bar-gap': `${BARS.bubbleBarGap}px` }}>

            {bb1Cw > 0 && bb1Ch > 0 && (
              <svg
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', overflow: 'visible', zIndex: 2 }}
                aria-hidden="true"
              >
                <defs>
                  <linearGradient id="bb1CurveGrad" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2={bb1Cw} y2="0">
                    <stop offset="0%"                         stopColor={TEXT_REDS} />
                    <stop offset={`${bb1GradTransitionPct}%`}   stopColor={TEXT_REDS} />
                    <stop offset={`${Math.min(100, bb1GradTransitionPct + 5)}%`} stopColor={TEXT_GREENS} />
                    <stop offset="100%"                       stopColor={TEXT_GREENS} />
                  </linearGradient>
                  {BARS.arrowType === 'solid' && (
                    <marker id="bb1Arrow" markerUnits="userSpaceOnUse" markerWidth={BARS.arrowSize} markerHeight={BARS.arrowSize} refX="0" refY={BARS.arrowSize / 2} orient="auto">
                      <path d={`M0,0 L0,${BARS.arrowSize} L${BARS.arrowSize},${BARS.arrowSize / 2} z`} style={{ fill: CURVE_ACCENT }} />
                    </marker>
                  )}
                </defs>

                {bb1CurvePath && (
                  <path d={bb1CurvePath} fill="none" style={{ stroke: CURVE_ACCENT }} strokeWidth={BARS.curveStrokeWidth} strokeLinecap="round" opacity={BARS.curveOpacity} markerEnd={BARS.arrowType === 'solid' ? 'url(#bb1Arrow)' : undefined} />
                )}

                {BARS.arrowType === 'hollow' && bb1CurveTipPt && (
                  <g transform={`translate(${bb1CurveTipPt.x},${bb1CurveTipPt.y}) rotate(${bb1LastAngleDeg})`} style={{ stroke: CURVE_ACCENT }} strokeWidth={BARS.arrowStrokeWidth} strokeLinecap="round" opacity={BARS.curveOpacity} fill="none">
                    <line x1="0" y1={-BARS.arrowSize * 0.55} x2="0" y2={BARS.arrowSize * 0.55} />
                    <line x1="0" y1={-BARS.arrowSize * 0.55} x2={BARS.arrowSize} y2="0" />
                    <line x1="0" y1={BARS.arrowSize * 0.55} x2={BARS.arrowSize} y2="0" />
                  </g>
                )}

                {BARS.arrowType === 'chevron' && bb1CurveTipPt && (
                  <g transform={`translate(${bb1CurveTipPt.x},${bb1CurveTipPt.y}) rotate(${bb1LastAngleDeg})`} style={{ stroke: CURVE_ACCENT }} strokeWidth={BARS.arrowStrokeWidth} strokeLinecap="round" opacity={BARS.curveOpacity} fill="none">
                    <line x1="0" y1={-BARS.arrowSize * 0.55} x2={BARS.arrowSize} y2="0" />
                    <line x1="0" y1={BARS.arrowSize * 0.55} x2={BARS.arrowSize} y2="0" />
                    <line x1="0" y1="0" x2={BARS.arrowSize} y2="0" />
                  </g>
                )}

              </svg>
            )}

            {/* ── TRAJECTORY LABEL BOX ── right edge sits at arrow base, rotated along trajectory ── */}
            {bb1CurveTipPt && bb1CurvePoints.length >= 2 && (
              <div
                className={s.trajectoryLabel}
                style={{
                  left: bb1CurveTipPt.x,
                  top: bb1CurveTipPt.y,
                  fontSize: 9 * BARS.curveLabelFontScale * BARS.fontScale,
                  transform: `rotate(${bb1LastAngleDeg}deg) translate(calc(-100% - ${BARS.labelBoxGap}px), -50%)`,
                }}
              >
                {COPY.trajectoryLabel}
              </div>
            )}

            <div style={{ position: 'absolute', top: '6vh', zIndex: 2, left: bb1Dropped >= 2 ? bb1Dropped * bb1RedSlotW / 2 : bb1Cw / 4, transform: 'translateX(-50%)', textAlign: 'center', transition: `left ${BARS.positionAnimDuration}s ease` }}>
              <p className={s.eyebrowRed}>{COPY.eyebrowRed}</p>
              <h3 className={s.sectionTitle}>{COPY.titleRed}</h3>
            </div>
            <div style={{ position: 'absolute', top: '6vh', zIndex: 2, left: bb1DroppedGreen > 0 ? bb1Dropped * bb1RedSlotW + bb1DroppedGreen * bb1GreenSlotW / 2 : bb1Cw * 0.75, transform: 'translateX(-50%)', textAlign: 'center', opacity: bb1DroppedGreen > 0 ? 1 : 0, transition: `left ${BARS.positionAnimDuration}s ease, opacity 0.5s ease`, pointerEvents: bb1DroppedGreen > 0 ? 'auto' : 'none' }}>
              <p className={s.eyebrowGreen}>{COPY.eyebrowGreen}</p>
              <h3 className={s.sectionTitle}>{COPY.titleGreen}</h3>
            </div>

            {bb1Cw > 0 && ITEMS.map((item, i) => {
              const on   = bb1Dropped > i
              const live = i === bb1ActiveI && on
              const barH = BARS.redBarHeights[i] * BARS.barHeightRef
              const centerX = (i + 0.5) * bb1RedSlotW
              const glow = `0 0 ${BARS.glowRadius}px ${RED_COLORS[N - 1].bright}aa`
              return (
                <div key={`red-${i}`} className={s.barPairSlot} style={{ left: centerX, opacity: on ? 1 : 0, transition: `left ${BARS.positionAnimDuration}s ease, opacity ${BARS.opacityAnimDuration}s ease`, zIndex: 1 }}>
                  {on && (
                    <div className={s.redBubble} style={{ width: BARS.bubbleDiameter, height: BARS.bubbleDiameter, borderRadius: BARS.bubbleDiameter / 2, background: `radial-gradient(circle, ${DISC_REDS[N - 1].face}, ${DISC_REDS[N - 1].rim})`, boxShadow: live ? glow : 'none' }}>
                      <span className={s.redBubbleCat}>{item.category}</span>
                      <span className={s.redBubbleTxt}>{item.ntext}</span>
                    </div>
                  )}
                  <div className={s.redBar} style={{ width: BARS.barWidth, height: on ? barH : 0, background: `linear-gradient(to bottom, ${RED_COLORS[N - 1].bright}, ${RED_COLORS[N - 1].dark})`, boxShadow: live ? glow : 'none', transition: `height ${BARS.barAnimDuration}s cubic-bezier(0.18,1.18,0.38,1)` }} />
                </div>
              )
            })}

            {bb1Cw > 0 && ITEMS.map((item, i) => {
              const on   = bb1DroppedGreen > i
              const live = i === bb1ActiveIG && on
              const barH = BARS.greenBarHeights[i] * BARS.barHeightRef
              const centerX = bb1Dropped * bb1RedSlotW + (i + 0.5) * bb1GreenSlotW
              const glow = `0 0 ${BARS.glowRadius}px ${GREEN_COLORS[N - 1].bright}aa`
              return (
                <div key={`green-${i}`} className={s.barPairSlot} style={{ left: centerX, opacity: on ? 1 : 0, transition: `left ${BARS.positionAnimDuration}s ease, opacity ${BARS.opacityAnimDuration}s ease`, zIndex: 1 }}>
                  {on && (
                    <div className={s.greenBubble} style={{ width: BARS.bubbleDiameter, height: BARS.bubbleDiameter, borderRadius: BARS.bubbleDiameter / 2, background: `radial-gradient(circle, ${DISC_GREENS[N - 1].face}, ${DISC_GREENS[N - 1].rim})`, boxShadow: live ? glow : 'none' }}>
                      <span className={s.greenBubbleCat}>{item.category}</span>
                      <span className={s.greenBubbleTxt}>{item.ptext}</span>
                    </div>
                  )}
                  <div className={s.greenBar} style={{ width: BARS.barWidth, height: on ? barH : 0, background: `linear-gradient(to bottom, ${GREEN_COLORS[N - 1].bright}, ${GREEN_COLORS[N - 1].dark})`, boxShadow: live ? glow : 'none', transition: `height ${BARS.barAnimDuration}s cubic-bezier(0.18,1.18,0.38,1)` }} />
                </div>
              )
            })}

          </div>
        </div>
      </div>

      {/* ── OPTION LABEL: BARS & BUBBLES 2 ─────────────────────────────────── */}
      <div className={s.optionLabel}>
        <div className={s.optionDivider} />
        <span>Bars &amp; Bubbles 2</span>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          BARS & BUBBLES 2
      ══════════════════════════════════════════════════════════════════════ */}
      <div ref={bb2DriverRef} className={s.barDriver} style={{ height: `${BB2_TOTAL_PHASES * BARS.scrollVhPerPhase}vh` }}>
        <div className={s.barScene}>
          <div className={s.barChartArea} ref={bb2ChartRef}
               style={{ '--baseline': `${BARS.baselinePct}%`, '--font-scale': BARS.fontScale, '--bubble-bar-gap': `${BARS.bubbleBarGap}px` }}>

            {bb2Cw > 0 && bb2Ch > 0 && (
              <>
                {/* ── Titles ── */}
                <div style={{
                  position: 'absolute', top: '6vh', zIndex: 3, left: bb2TitleRiskX,
                  transform: 'translateX(-50%)',
                  opacity: bb2TitleRiskOp, textAlign: 'center',
                  pointerEvents: bb2TitleRiskOp > 0.01 ? 'auto' : 'none',
                }}>
                  <p className={s.eyebrowRed}>Common Problems</p>
                  <h3 className={s.sectionTitle}>The Risk</h3>
                </div>
                <div style={{
                  position: 'absolute', top: '6vh', zIndex: 3, left: bb2TitleSolX,
                  transform: 'translateX(-50%)',
                  opacity: bb2TitleSolOp, textAlign: 'center',
                  pointerEvents: bb2TitleSolOp > 0.01 ? 'auto' : 'none',
                }}>
                  <p className={s.eyebrowGreen}>Done Right</p>
                  <h3 className={s.sectionTitle}>The Solution</h3>
                </div>

                {/* ── Red bars ── */}
                {ITEMS.map((item, i) => {
                  const st = bb2RedStates[i]
                  if (!st) return null
                  const { x, y, opacity, entering } = st
                  const barH   = Math.max(0, bb2BaselineY - y - bb2HalfBub - BARS.bubbleBarGap)
                  const barTop = y + bb2HalfBub + BARS.bubbleBarGap
                  return (
                    <div key={`bb2-red-bar-${i}`} style={{
                      position: 'absolute', left: x - bb2BarW / 2, top: barTop,
                      width: bb2BarW, height: barH, opacity,
                      background: `linear-gradient(to bottom, ${RED_COLORS[N - 1].bright}, ${RED_COLORS[N - 1].dark})`,
                      borderRadius: '0 0 3px 3px', zIndex: entering ? 2 : 1, pointerEvents: 'none',
                    }} />
                  )
                })}

                {/* ── Red bubbles ── */}
                {ITEMS.map((item, i) => {
                  const st = bb2RedStates[i]
                  if (!st) return null
                  const { x, y, opacity, entering } = st
                  const glow = opacity >= 1 ? `0 0 ${bb2GlowRadius}px ${RED_COLORS[N - 1].bright}aa` : 'none'
                  return (
                    <div key={`bb2-red-bubble-${i}`} style={{
                      position: 'absolute',
                      left: x - bb2HalfBub, top: y - bb2HalfBub,
                      width: bb2BubbleDia, height: bb2BubbleDia,
                      borderRadius: bb2HalfBub, opacity, boxShadow: glow,
                      '--font-scale': BARS.fontScale * BARS.bb2BubbleBarScale,
                      background: `radial-gradient(circle, ${DISC_REDS[N - 1].face}, ${DISC_REDS[N - 1].rim})`,
                      display: 'flex', flexDirection: 'column', alignItems: 'center',
                      justifyContent: 'center', textAlign: 'center',
                      padding: 10, boxSizing: 'border-box', overflow: 'hidden',
                      zIndex: entering ? 2 : 1, pointerEvents: 'none',
                    }}>
                      <span className={s.redBubbleCat}>{item.category}</span>
                      <span className={s.redBubbleTxt}>{item.ntext}</span>
                    </div>
                  )
                })}

                {/* ── Green bars ── */}
                {ITEMS.map((item, i) => {
                  const st = bb2GreenStates[i]
                  if (!st) return null
                  const { x, y, opacity, entering } = st
                  const barH   = Math.max(0, bb2BaselineY - y - bb2HalfBub - BARS.bubbleBarGap)
                  const barTop = y + bb2HalfBub + BARS.bubbleBarGap
                  return (
                    <div key={`bb2-green-bar-${i}`} style={{
                      position: 'absolute', left: x - bb2BarW / 2, top: barTop,
                      width: bb2BarW, height: barH, opacity,
                      background: `linear-gradient(to bottom, ${GREEN_COLORS[N - 1].bright}, ${GREEN_COLORS[N - 1].dark})`,
                      borderRadius: '0 0 3px 3px', zIndex: entering ? 2 : 1, pointerEvents: 'none',
                    }} />
                  )
                })}

                {/* ── Green bubbles ── */}
                {ITEMS.map((item, i) => {
                  const st = bb2GreenStates[i]
                  if (!st) return null
                  const { x, y, opacity, entering } = st
                  const glow = opacity >= 1 ? `0 0 ${bb2GlowRadius}px ${GREEN_COLORS[N - 1].bright}aa` : 'none'
                  return (
                    <div key={`bb2-green-bubble-${i}`} style={{
                      position: 'absolute',
                      left: x - bb2HalfBub, top: y - bb2HalfBub,
                      width: bb2BubbleDia, height: bb2BubbleDia,
                      borderRadius: bb2HalfBub, opacity, boxShadow: glow,
                      '--font-scale': BARS.fontScale * BARS.bb2BubbleBarScale,
                      background: `radial-gradient(circle, ${DISC_GREENS[N - 1].face}, ${DISC_GREENS[N - 1].rim})`,
                      display: 'flex', flexDirection: 'column', alignItems: 'center',
                      justifyContent: 'center', textAlign: 'center',
                      padding: 10, boxSizing: 'border-box', overflow: 'hidden',
                      zIndex: entering ? 2 : 1, pointerEvents: 'none',
                    }}>
                      <span className={s.greenBubbleCat}>{item.category}</span>
                      <span className={s.greenBubbleTxt}>{item.ptext}</span>
                    </div>
                  )
                })}

                {/* ══ CHART PHASE — staggered fan-out from center ══ */}
                {bb2ChartT > 0 && (
                  <>
                    {/* Chart titles — slide in from outside after titleDelay */}
                    {bb2ChartTitleT > 0 && (
                      <>
                        <div style={{
                          position: 'absolute', top: '6vh', zIndex: 3,
                          left: lerp(-bb2Cw * 0.15, N * bb2ChartRedSlotW / 2, bb2ChartTitleT),
                          transform: 'translateX(-50%)', textAlign: 'center',
                          opacity: bb2ChartTitleT, pointerEvents: 'none',
                        }}>
                          <p className={s.eyebrowRed}>Common Problems</p>
                          <h3 className={s.sectionTitle}>The Risk</h3>
                        </div>
                        <div style={{
                          position: 'absolute', top: '6vh', zIndex: 3,
                          left: lerp(bb2Cw * 1.15, N * bb2ChartRedSlotW + N * bb2ChartGreenSlotW / 2, bb2ChartTitleT),
                          transform: 'translateX(-50%)', textAlign: 'center',
                          opacity: bb2ChartTitleT, pointerEvents: 'none',
                        }}>
                          <p className={s.eyebrowGreen}>Done Right</p>
                          <h3 className={s.sectionTitle}>The Solution</h3>
                        </div>
                      </>
                    )}

                    {/* Chart red bars — height follows bubble position (conveyor formula) */}
                    {ITEMS.map((item, i) => {
                      const rank    = (2 * N - 1) - i  // red[N-1]=rank N, red[0]=rank 2N-1
                      const localT  = bb2ChartLocalT(rank)
                      const barH    = BARS.redBarHeights[i] * BARS.barHeightRef
                      const slotCx  = (i + 0.5) * bb2ChartRedSlotW
                      const targetY = bb2BaselineY - barH - BARS.bubbleBarGap - bb2ChartHalfBub
                      const y       = lerp(bb2CenterY, targetY, localT)
                      const barTop  = y + bb2ChartHalfBub + BARS.bubbleBarGap
                      return (
                        <div key={`bb2-chart-red-bar-${i}`} style={{
                          position: 'absolute',
                          left: lerp(bb2CenterX, slotCx, localT) - bb2ChartBarW / 2,
                          top: barTop,
                          width: bb2ChartBarW,
                          height: Math.max(0, bb2BaselineY - barTop),
                          opacity: lerp(BARS.exitFadeOpacity, 1, localT),
                          background: `linear-gradient(to bottom, ${RED_COLORS[N - 1].bright}, ${RED_COLORS[N - 1].dark})`,
                          borderRadius: '0 0 3px 3px', zIndex: 1, pointerEvents: 'none',
                        }} />
                      )
                    })}

                    {/* Chart red bubbles */}
                    {ITEMS.map((item, i) => {
                      const rank    = (2 * N - 1) - i
                      const localT  = bb2ChartLocalT(rank)
                      const barH    = BARS.redBarHeights[i] * BARS.barHeightRef
                      const slotCx  = (i + 0.5) * bb2ChartRedSlotW
                      const targetY = bb2BaselineY - barH - BARS.bubbleBarGap - bb2ChartHalfBub
                      const x       = lerp(bb2CenterX, slotCx, localT)
                      const y       = lerp(bb2CenterY, targetY, localT)
                      const opacity = lerp(BARS.exitFadeOpacity, 1, localT)
                      const glow    = 'none'
                      return (
                        <div key={`bb2-chart-red-bubble-${i}`} style={{
                          position: 'absolute',
                          left: x - bb2ChartHalfBub, top: y - bb2ChartHalfBub,
                          width: bb2ChartBubDia, height: bb2ChartBubDia,
                          borderRadius: bb2ChartHalfBub, opacity, boxShadow: glow,
                          '--font-scale': bb2ChartFontSc,
                          background: `radial-gradient(circle, ${DISC_REDS[N - 1].face}, ${DISC_REDS[N - 1].rim})`,
                          display: 'flex', flexDirection: 'column', alignItems: 'center',
                          justifyContent: 'center', textAlign: 'center',
                          padding: 10, boxSizing: 'border-box', overflow: 'hidden',
                          zIndex: 2, pointerEvents: 'none',
                        }}>
                          <span className={s.redBubbleCat}>{item.category}</span>
                          <span className={s.redBubbleTxt}>{item.ntext}</span>
                        </div>
                      )
                    })}

                    {/* Chart green bars — height follows bubble position (conveyor formula) */}
                    {ITEMS.map((item, i) => {
                      const rank    = (N - 1) - i  // green[N-1]=rank 0 (leader), green[0]=rank N-1
                      const localT  = bb2ChartLocalT(rank)
                      const barH    = BARS.greenBarHeights[i] * BARS.barHeightRef
                      const slotCx  = N * bb2ChartRedSlotW + (i + 0.5) * bb2ChartGreenSlotW
                      const targetY = bb2BaselineY - barH - BARS.bubbleBarGap - bb2ChartHalfBub
                      const y       = lerp(bb2CenterY, targetY, localT)
                      const barTop  = y + bb2ChartHalfBub + BARS.bubbleBarGap
                      const opacity = rank === 0 ? 1 : lerp(BARS.exitFadeOpacity, 1, localT)
                      return (
                        <div key={`bb2-chart-green-bar-${i}`} style={{
                          position: 'absolute',
                          left: lerp(bb2CenterX, slotCx, localT) - bb2ChartBarW / 2,
                          top: barTop,
                          width: bb2ChartBarW,
                          height: Math.max(0, bb2BaselineY - barTop),
                          opacity,
                          background: `linear-gradient(to bottom, ${GREEN_COLORS[N - 1].bright}, ${GREEN_COLORS[N - 1].dark})`,
                          borderRadius: '0 0 3px 3px', zIndex: 1, pointerEvents: 'none',
                        }} />
                      )
                    })}

                    {/* Chart green bubbles */}
                    {ITEMS.map((item, i) => {
                      const rank    = (N - 1) - i
                      const localT  = bb2ChartLocalT(rank)
                      const barH    = BARS.greenBarHeights[i] * BARS.barHeightRef
                      const slotCx  = N * bb2ChartRedSlotW + (i + 0.5) * bb2ChartGreenSlotW
                      const targetY = bb2BaselineY - barH - BARS.bubbleBarGap - bb2ChartHalfBub
                      const x       = lerp(bb2CenterX, slotCx, localT)
                      const y       = lerp(bb2CenterY, targetY, localT)
                      const opacity = rank === 0 ? 1 : lerp(BARS.exitFadeOpacity, 1, localT)
                      const glow    = 'none'
                      return (
                        <div key={`bb2-chart-green-bubble-${i}`} style={{
                          position: 'absolute',
                          left: x - bb2ChartHalfBub, top: y - bb2ChartHalfBub,
                          width: bb2ChartBubDia, height: bb2ChartBubDia,
                          borderRadius: bb2ChartHalfBub, opacity, boxShadow: glow,
                          '--font-scale': bb2ChartFontSc,
                          background: `radial-gradient(circle, ${DISC_GREENS[N - 1].face}, ${DISC_GREENS[N - 1].rim})`,
                          display: 'flex', flexDirection: 'column', alignItems: 'center',
                          justifyContent: 'center', textAlign: 'center',
                          padding: 10, boxSizing: 'border-box', overflow: 'hidden',
                          zIndex: 2, pointerEvents: 'none',
                        }}>
                          <span className={s.greenBubbleCat}>{item.category}</span>
                          <span className={s.greenBubbleTxt}>{item.ptext}</span>
                        </div>
                      )
                    })}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── OPTION LABEL: COLLAPSING DISCS 1 ───────────────────────────────── */}
      <div className={s.optionLabel}>
        <div className={s.optionDivider} />
        <span>Collapsing Discs 1</span>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          COLLAPSING DISCS 1
      ══════════════════════════════════════════════════════════════════════ */}
      <div ref={discDriverRef} className={s.discDriver} style={{ height: `${DISC_PHASES * DISCS.scrollVhPerPhase}vh` }}>
        <div className={[s.discScene, discFall && s.discSceneCollapse].filter(Boolean).join(' ')}
             style={{ '--font-scale': DISCS.fontScale, '--pos-neg-ratio': DISCS.posNegFontRatio, '--drop-dur': `${DISCS.dropAnimDuration}s`, paddingBottom: `${DISCS.baselinePct}%`, '--tower-col-pct': `${DISCS.towerColPct}%`, '--tower-col-shift': `${DISCS.towerColShift}px` }}>

          <div className={s.towerCol}>
            <div className={s.towerSection}>
              <div className={s.towerWithBar}>
                <div className={s.valueBarWrap} style={{ marginRight: discValueBarGap }}>
                  <div className={s.valueBarRow}>
                    <span className={s.valueBarLabel}>{COPY.barValueLabel}</span>
                    <div className={s.valueBar} style={{ width: DISCS.valueBarW, height: discFinalRedValueH, background: discFall ? RED_COLORS[N - 1].bright : 'rgba(176,168,154,0.55)', transition: discFall ? 'none' : 'height 0.45s cubic-bezier(0.18,1.18,0.38,1)', opacity: discDropped > 0 ? 1 : 0 }} />
                  </div>
                  <div style={{ height: 29 + DISCS.riskBarH, flexShrink: 0 }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                  <div className={s.sectionHead}>
                    <p className={s.eyebrowRed}>{COPY.eyebrowRed}</p>
                    <h3 className={s.sectionTitle}>{COPY.titleRed}</h3>
                  </div>
                  <div className={s.towerOuter} style={{ width: TOWER_PX_W, height: TOWER_PX_H }}>
                    <div className={s.towerInner} style={{ transform: `scale(${DISCS.towerScale})` }}>
                      <div className={s.tower} style={{ width: TOWER_W, height: TOWER_H }}>
                        {cd1RedDiscData.map((disc, i) => {
                          const initLeft = toScreenLeft(disc.initCX, disc.radius)
                          const initTop  = toScreenTop(disc.initCZ)
                          const on   = discDropped > i
                          const live = i === discActiveI && on
                          const cs   = discFall && discCollapseStyles ? discCollapseStyles[i] : null
                          return (
                            <div key={i} className={[s.disc, on && s.discOn].filter(Boolean).join(' ')} style={{ left: cs ? cs.left : initLeft, top: cs ? cs.top : initTop, width: disc.pxWidth, transform: cs ? cs.transform : undefined, transformOrigin: `50% ${FACE_H / 2}px`, transition: discFall ? 'none' : undefined, zIndex: i + 1, '--f': DISC_REDS[i].face, '--r': DISC_REDS[i].rim, ...discVars }}>
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
                  <div className={[s.barArea, discGreenReveal && s.barHidden].filter(Boolean).join(' ')} style={{ width: discRiskMaxW }}>
                    <div className={s.riskBarWrap} style={{ alignItems: redRiskLabelAlign }}>
                      <div className={s.riskBarLabel}>
                        <span className={s.riskBarTitle}>{COPY.barRedLabel}</span>
                        <span className={s.riskBarPct}>{discDropped}/{N}</span>
                        {discDropped > 0 && <span className={s.riskBarCat} style={{ opacity: !discGreenReveal ? 1 : 0, transition: 'opacity 0.6s ease' }}>{ITEMS[discRedTopI].category}</span>}
                      </div>
                      <div className={s.riskBar} style={{ ...riskBarStyle(discRedBarW, discRiskMaxW, DISCS.redRiskBarGrowDir), height: DISCS.riskBarH, background: `linear-gradient(to right, ${RED_COLORS[Math.max(0, discDropped - 1)].bright}, ${RED_COLORS[Math.max(0, discDropped - 1)].dark})`, opacity: discDropped > 0 ? DISCS.barActiveOpacity : DISCS.barIdleOpacity, transition: 'transform 0.45s cubic-bezier(0.18,1.18,0.38,1), opacity 0.3s ease' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={s.towerSection}>
              <div className={s.towerWithBar}>
                <div className={s.valueBarWrap} style={{ marginRight: discValueBarGap, opacity: discGreenReveal ? 1 : 0, transition: 'opacity 0.3s ease' }}>
                  <div className={s.valueBarRow}>
                    <span className={s.valueBarLabel}>{COPY.barValueLabel}</span>
                    <div className={s.valueBar} style={{ width: DISCS.valueBarW, height: discGreenValueH, background: discDroppedGreen === N ? GREEN_COLORS[N - 1].bright : 'rgba(176,168,154,0.55)', transition: 'height 0.45s cubic-bezier(0.18,1.18,0.38,1), background-color 0s' }} />
                  </div>
                  <div style={{ height: 29 + DISCS.riskBarH, flexShrink: 0 }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                  <div className={[s.sectionHead, !discGreenReveal && s.sectionHeadHidden].filter(Boolean).join(' ')}>
                    <p className={s.eyebrowGreen}>{COPY.eyebrowGreen}</p>
                    <h3 className={s.sectionTitle}>{COPY.titleGreen}</h3>
                  </div>
                  <div className={s.towerOuter} style={{ width: TOWER_PX_W, height: TOWER_PX_H }}>
                    <div className={s.towerInner} style={{ transform: `scale(${DISCS.towerScale})` }}>
                      <div className={s.tower} style={{ width: TOWER_W, height: TOWER_H }}>
                        {GREEN_DISC_DATA.map((gd, i) => {
                          const on   = discDroppedGreen > i
                          const live = i === discDroppedGreen - 1 && on
                          return (
                            <div key={i} className={[s.disc, on && s.discOn].filter(Boolean).join(' ')} style={{ left: gd.initLeft, top: gd.initTop, width: gd.pxWidth, transformOrigin: `50% ${FACE_H / 2}px`, zIndex: i + 1, '--f': DISC_GREENS[i].face, '--r': DISC_GREENS[i].rim, ...discVars }}>
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
                  <div className={[s.barArea, !discGreenReveal && s.barHidden].filter(Boolean).join(' ')} style={{ width: discRiskMaxW }}>
                    <div className={s.riskBarWrap} style={{ alignItems: greenRiskLabelAlign }}>
                      <div className={s.riskBarLabel}>
                        <span className={s.riskBarTitle}>{COPY.barGreenLabel}</span>
                        <span className={s.riskBarPct}>{discDroppedGreen}/{N}</span>
                        {discDroppedGreen > 0 && <span className={s.riskBarCat} style={{ opacity: discPhase < DISC_PHASES - 1 ? 1 : 0, transition: 'opacity 0.6s ease' }}>{ITEMS[discGreenTopI].category}</span>}
                      </div>
                      <div className={s.riskBar} style={{ ...riskBarStyle(discGreenBarW, discRiskMaxW, DISCS.greenRiskBarGrowDir), height: DISCS.riskBarH, background: `linear-gradient(to right, ${GREEN_COLORS[Math.max(0, discDroppedGreen - 1)].bright}, ${GREEN_COLORS[Math.max(0, discDroppedGreen - 1)].dark})`, opacity: discDroppedGreen > 0 ? DISCS.barActiveOpacity : DISCS.barIdleOpacity, transition: 'transform 0.45s cubic-bezier(0.18,1.18,0.38,1), opacity 0.3s ease' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={s.textCol}>
            {ITEMS.map((item, i) => {
              const on      = discDropped > i
              const live    = i === discActiveI && on
              const posOn   = discDroppedGreen > i
              const posLive = i === discDroppedGreen - 1 && posOn
              return (
                <div key={i} className={[s.discCard, on && s.discCardOn, live && s.discCardRed, posOn && s.discCardGreen].filter(Boolean).join(' ')}>
                  <span className={s.discCardNum}>{String(i + 1).padStart(2, '0')}</span>
                  <div className={s.discCardBody}>
                    <div className={s.discNegSection}>
                      <p className={s.discCat}>{item.category}</p>
                      <p className={s.discNegTxt}>{item.ntext}</p>
                    </div>
                    <div className={[s.discPosSlot, on && s.discPosSlotReserved, posOn && s.discPosSlotOn].filter(Boolean).join(' ')}>
                      {posOn && (
                        <div className={s.discPosRow}>
                          <span className={[s.pencilIcon, posLive && s.pencilVisible].filter(Boolean).join(' ')} style={i === N - 1 && discPhase >= DISC_PHASES - 1 ? { opacity: 0, transition: 'opacity 0.6s ease' } : undefined} aria-hidden="true">
                            <svg viewBox="0 0 16 16" fill="none" className={s.pencilSvg}>
                              <path d="M11.5 2.5a1.5 1.5 0 0 1 2 2L5 13l-3 1 1-3 8.5-8.5z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </span>
                          <p key={`pos-${i}-${posOn}`} className={[s.discPosTxt, posOn && s.discPosTxtWrite].filter(Boolean).join(' ')}>
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

      {/* ── OPTION LABEL: COLLAPSING DISCS 2 ───────────────────────────────── */}
      <div className={s.optionLabel}>
        <div className={s.optionDivider} />
        <span>Collapsing Discs 2</span>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          COLLAPSING DISCS 2
      ══════════════════════════════════════════════════════════════════════ */}
      <div ref={disc2DriverRef} className={s.discDriver} style={{ height: `${DISC_PHASES * DISCS.scrollVhPerPhase}vh` }}>
        <div className={[s.discScene, disc2Fall && s.discSceneCollapse].filter(Boolean).join(' ')}
             style={{ '--font-scale': DISCS.fontScale, '--pos-neg-ratio': DISCS.posNegFontRatio, '--drop-dur': `${DISCS.dropAnimDuration}s`, paddingBottom: `${DISCS.baselinePct}%`, '--tower-col-pct': `${DISCS.towerColPct}%`, '--tower-col-shift': `${DISCS.towerColShift}px` }}>

          <div className={s.towerCol}>
            <div className={s.towerSection}>
              <div className={s.towerWithBar}>
                <div className={s.valueBarWrap} style={{ marginRight: discValueBarGap }}>
                  <div className={s.valueBarRow}>
                    <span className={s.valueBarLabel}>{COPY.barValueLabel}</span>
                    <div className={s.valueBar} style={{ width: DISCS.valueBarW, height: disc2FinalRedValueH, background: disc2Fall ? RED_COLORS[N - 1].bright : 'rgba(176,168,154,0.55)', transition: disc2Fall ? 'none' : 'height 0.45s cubic-bezier(0.18,1.18,0.38,1)', opacity: disc2Dropped > 0 ? 1 : 0 }} />
                  </div>
                  <div style={{ height: 29 + DISCS.riskBarH, flexShrink: 0 }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                  <div className={s.sectionHead}>
                    <p className={s.eyebrowRed}>{COPY.eyebrowRed}</p>
                    <h3 className={s.sectionTitle}>{COPY.titleRed}</h3>
                  </div>
                  <div className={s.towerOuter} style={{ width: TOWER_PX_W, height: TOWER_PX_H }}>
                    <div className={s.towerInner} style={{ transform: `scale(${DISCS.towerScale})` }}>
                      <div className={s.tower} style={{ width: TOWER_W, height: TOWER_H }}>
                        {cd2RedDiscData.map((disc, i) => {
                          const initLeft = toScreenLeft(disc.initCX, disc.radius)
                          const initTop  = toScreenTop(disc.initCZ)
                          const on   = disc2Dropped > i
                          const live = i === disc2ActiveI && on
                          const cs   = disc2Fall && disc2CollapseStyles ? disc2CollapseStyles[i] : null
                          return (
                            <div key={i} className={[s.disc, on && s.discOn].filter(Boolean).join(' ')} style={{ left: cs ? cs.left : initLeft, top: cs ? cs.top : initTop, width: disc.pxWidth, transform: cs ? cs.transform : undefined, transformOrigin: `50% ${FACE_H / 2}px`, transition: disc2Fall ? 'none' : undefined, zIndex: i + 1, '--f': DISC_REDS[i].face, '--r': DISC_REDS[i].rim, ...discVars }}>
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
                  <div className={[s.barArea, disc2GreenReveal && s.barHidden].filter(Boolean).join(' ')} style={{ width: discRiskMaxW }}>
                    <div className={s.riskBarWrap} style={{ alignItems: redRiskLabelAlign }}>
                      <div className={s.riskBarLabel}>
                        <span className={s.riskBarTitle}>{COPY.barRedLabel}</span>
                        <span className={s.riskBarPct}>{disc2Dropped}/{N}</span>
                        {disc2Dropped > 0 && <span className={s.riskBarCat} style={{ opacity: !disc2GreenReveal ? 1 : 0, transition: 'opacity 0.6s ease' }}>{ITEMS[disc2RedTopI].category}</span>}
                      </div>
                      <div className={s.riskBar} style={{ ...riskBarStyle(disc2RedBarW, discRiskMaxW, DISCS.redRiskBarGrowDir), height: DISCS.riskBarH, background: `linear-gradient(to right, ${RED_COLORS[Math.max(0, disc2Dropped - 1)].bright}, ${RED_COLORS[Math.max(0, disc2Dropped - 1)].dark})`, opacity: disc2Dropped > 0 ? DISCS.barActiveOpacity : DISCS.barIdleOpacity, transition: 'transform 0.45s cubic-bezier(0.18,1.18,0.38,1), opacity 0.3s ease' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={s.towerSection}>
              <div className={s.towerWithBar}>
                <div className={s.valueBarWrap} style={{ marginRight: discValueBarGap, opacity: disc2GreenReveal ? 1 : 0, transition: 'opacity 0.3s ease' }}>
                  <div className={s.valueBarRow}>
                    <span className={s.valueBarLabel}>{COPY.barValueLabel}</span>
                    <div className={s.valueBar} style={{ width: DISCS.valueBarW, height: disc2GreenValueH, background: disc2DroppedGreen === N ? GREEN_COLORS[N - 1].bright : 'rgba(176,168,154,0.55)', transition: 'height 0.45s cubic-bezier(0.18,1.18,0.38,1), background-color 0s' }} />
                  </div>
                  <div style={{ height: 29 + DISCS.riskBarH, flexShrink: 0 }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                  <div className={[s.sectionHead, !disc2GreenReveal && s.sectionHeadHidden].filter(Boolean).join(' ')}>
                    <p className={s.eyebrowGreen}>{COPY.eyebrowGreen}</p>
                    <h3 className={s.sectionTitle}>{COPY.titleGreen}</h3>
                  </div>
                  <div className={s.towerOuter} style={{ width: TOWER_PX_W, height: TOWER_PX_H }}>
                    <div className={s.towerInner} style={{ transform: `scale(${DISCS.towerScale})` }}>
                      <div className={s.tower} style={{ width: TOWER_W, height: TOWER_H }}>
                        {GREEN_DISC_DATA.map((gd, i) => {
                          const on   = disc2DroppedGreen > i
                          const live = i === disc2DroppedGreen - 1 && on
                          return (
                            <div key={i} className={[s.disc, on && s.discOn].filter(Boolean).join(' ')} style={{ left: gd.initLeft, top: gd.initTop, width: gd.pxWidth, transformOrigin: `50% ${FACE_H / 2}px`, zIndex: i + 1, '--f': DISC_GREENS[i].face, '--r': DISC_GREENS[i].rim, ...discVars }}>
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
                  <div className={[s.barArea, !disc2GreenReveal && s.barHidden].filter(Boolean).join(' ')} style={{ width: discRiskMaxW }}>
                    <div className={s.riskBarWrap} style={{ alignItems: greenRiskLabelAlign }}>
                      <div className={s.riskBarLabel}>
                        <span className={s.riskBarTitle}>{COPY.barGreenLabel}</span>
                        <span className={s.riskBarPct}>{disc2DroppedGreen}/{N}</span>
                        {disc2DroppedGreen > 0 && <span className={s.riskBarCat} style={{ opacity: disc2Phase < DISC_PHASES - 1 ? 1 : 0, transition: 'opacity 0.6s ease' }}>{ITEMS[disc2GreenTopI].category}</span>}
                      </div>
                      <div className={s.riskBar} style={{ ...riskBarStyle(disc2GreenBarW, discRiskMaxW, DISCS.greenRiskBarGrowDir), height: DISCS.riskBarH, background: `linear-gradient(to right, ${GREEN_COLORS[Math.max(0, disc2DroppedGreen - 1)].bright}, ${GREEN_COLORS[Math.max(0, disc2DroppedGreen - 1)].dark})`, opacity: disc2DroppedGreen > 0 ? DISCS.barActiveOpacity : DISCS.barIdleOpacity, transition: 'transform 0.45s cubic-bezier(0.18,1.18,0.38,1), opacity 0.3s ease' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={s.textCol}>
            {ITEMS.map((item, i) => {
              const on      = disc2Dropped > i
              const live    = i === disc2ActiveI && on
              const posOn   = disc2DroppedGreen > i
              const posLive = i === disc2DroppedGreen - 1 && posOn
              return (
                <div key={i} className={[s.discCard, on && s.discCardOn, live && s.discCardRed, posOn && s.discCardGreen].filter(Boolean).join(' ')}>
                  <span className={s.discCardNum}>{String(i + 1).padStart(2, '0')}</span>
                  <div className={s.discCardBody}>
                    <div className={s.discNegSection}>
                      <p className={s.discCat}>{item.category}</p>
                      <p className={s.discNegTxt}>{item.ntext}</p>
                    </div>
                    <div className={[s.discPosSlot, on && s.discPosSlotReserved, posOn && s.discPosSlotOn].filter(Boolean).join(' ')}>
                      {posOn && (
                        <div className={s.discPosRow}>
                          <span className={[s.pencilIcon, posLive && s.pencilVisible].filter(Boolean).join(' ')} style={i === N - 1 && disc2Phase >= DISC_PHASES - 1 ? { opacity: 0, transition: 'opacity 0.6s ease' } : undefined} aria-hidden="true">
                            <svg viewBox="0 0 16 16" fill="none" className={s.pencilSvg}>
                              <path d="M11.5 2.5a1.5 1.5 0 0 1 2 2L5 13l-3 1 1-3 8.5-8.5z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </span>
                          <p key={`pos-${i}-${posOn}`} className={[s.discPosTxt, posOn && s.discPosTxtWrite].filter(Boolean).join(' ')}>
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

      {/* ── OPTION LABEL: COLLAPSING DISCS 3 ───────────────────────────────── */}
      <div className={s.optionLabel}>
        <div className={s.optionDivider} />
        <span>Collapsing Discs 3</span>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          COLLAPSING DISCS 3 — single tower on left, all items on right
          Red tower fades out on green reveal; green tower overlays same spot.
      ══════════════════════════════════════════════════════════════════════ */}
      <div ref={disc3DriverRef} className={s.discDriver} style={{ height: `${DISC_PHASES * DISCS.scrollVhPerPhase}vh` }}>
        <div className={[s.discScene, disc3Fall && s.discSceneCollapse].filter(Boolean).join(' ')}
             style={{ '--font-scale': DISCS.fontScale, '--pos-neg-ratio': DISCS.posNegFontRatio, '--drop-dur': `${DISCS.dropAnimDuration}s`, paddingBottom: `${DISCS.baselinePct}%`, '--tower-col-pct': `${DISCS.towerColPct}%`, '--tower-col-shift': `${DISCS.towerColShift}px` }}>

          {/* Left: single tower (red → green crossfade at same position) */}
          <div className={s.towerColCd3}>
            <div className={s.towerOverlap}>

              {/* Red tower — visible until green reveal */}
              <div className={s.towerSection}
                   style={{ gridArea: '1/1', opacity: disc3GreenReveal ? 0 : 1, transition: 'opacity 0.6s ease', pointerEvents: disc3GreenReveal ? 'none' : 'auto' }}>
                <div className={s.towerWithBar}>
                  <div className={s.valueBarWrap} style={{ marginRight: disc3ValueBarGap }}>
                    <div className={s.valueBarRow}>
                      <span className={s.valueBarLabel}>{COPY.barValueLabel}</span>
                      <div className={s.valueBar} style={{ width: DISCS.valueBarW, height: disc3FinalRedValueH, background: disc3Fall ? RED_COLORS[N - 1].bright : 'rgba(176,168,154,0.55)', transition: disc3Fall ? 'none' : 'height 0.45s cubic-bezier(0.18,1.18,0.38,1)', opacity: disc3Dropped > 0 ? 1 : 0 }} />
                    </div>
                    <div style={{ height: 29 + DISCS.riskBarH, flexShrink: 0 }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                    <div className={s.sectionHead}>
                      <p className={s.eyebrowRed}>{COPY.eyebrowRed}</p>
                      <h3 className={s.sectionTitle}>{COPY.titleRed}</h3>
                    </div>
                    <div className={s.towerOuter} style={{ width: cd3TowerPxW, height: cd3TowerPxH }}>
                      <div className={s.towerInner} style={{ transform: `scale(${CD3_SCALE})` }}>
                        <div className={s.tower} style={{ width: TOWER_W, height: TOWER_H }}>
                          {cd3RedDiscData.map((disc, i) => {
                            const initLeft = toScreenLeft(disc.initCX, disc.radius)
                            const initTop  = toScreenTop(disc.initCZ)
                            const on   = disc3Dropped > i
                            const live = i === disc3ActiveI && on
                            const cs   = disc3Fall && disc3CollapseStyles ? disc3CollapseStyles[i] : null
                            return (
                              <div key={i} className={[s.disc, on && s.discOn].filter(Boolean).join(' ')} style={{ left: cs ? cs.left : initLeft, top: cs ? cs.top : initTop, width: disc.pxWidth, transform: cs ? cs.transform : undefined, transformOrigin: `50% ${FACE_H / 2}px`, transition: disc3Fall ? 'none' : undefined, zIndex: i + 1, '--f': DISC_REDS[i].face, '--r': DISC_REDS[i].rim, ...discVars }}>
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
                    <div className={s.barArea} style={{ width: disc3RiskMaxW }}>
                      <div className={s.riskBarWrap} style={{ alignItems: redRiskLabelAlign }}>
                        <div className={s.riskBarLabel}>
                          <span className={s.riskBarTitle}>{COPY.barRedLabel}</span>
                          <span className={s.riskBarPct}>{disc3Dropped}/{N}</span>
                          {disc3Dropped > 0 && <span className={s.riskBarCat} style={{ opacity: !disc3GreenReveal ? 1 : 0, transition: 'opacity 0.6s ease' }}>{ITEMS[disc3RedTopI].category}</span>}
                        </div>
                        <div className={s.riskBar} style={{ ...riskBarStyle(disc3RedBarW, disc3RiskMaxW, DISCS.redRiskBarGrowDir), height: DISCS.riskBarH, background: `linear-gradient(to right, ${RED_COLORS[Math.max(0, disc3Dropped - 1)].bright}, ${RED_COLORS[Math.max(0, disc3Dropped - 1)].dark})`, opacity: disc3Dropped > 0 ? DISCS.barActiveOpacity : DISCS.barIdleOpacity, transition: 'transform 0.45s cubic-bezier(0.18,1.18,0.38,1), opacity 0.3s ease' }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Green tower — fades in at the same position on green reveal */}
              <div className={s.towerSection}
                   style={{ gridArea: '1/1', opacity: disc3GreenReveal ? 1 : 0, transition: 'opacity 0.6s ease', pointerEvents: disc3GreenReveal ? 'auto' : 'none' }}>
                <div className={s.towerWithBar}>
                  <div className={s.valueBarWrap} style={{ marginRight: disc3ValueBarGap, opacity: disc3GreenReveal ? 1 : 0, transition: 'opacity 0.3s ease' }}>
                    <div className={s.valueBarRow}>
                      <span className={s.valueBarLabel}>{COPY.barValueLabel}</span>
                      <div className={s.valueBar} style={{ width: DISCS.valueBarW, height: disc3GreenValueH, background: disc3DroppedGreen === N ? GREEN_COLORS[N - 1].bright : 'rgba(176,168,154,0.55)', transition: 'height 0.45s cubic-bezier(0.18,1.18,0.38,1), background-color 0s' }} />
                    </div>
                    <div style={{ height: 29 + DISCS.riskBarH, flexShrink: 0 }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                    <div className={[s.sectionHead, !disc3GreenReveal && s.sectionHeadHidden].filter(Boolean).join(' ')}>
                      <p className={s.eyebrowGreen}>{COPY.eyebrowGreen}</p>
                      <h3 className={s.sectionTitle}>{COPY.titleGreen}</h3>
                    </div>
                    <div className={s.towerOuter} style={{ width: cd3TowerPxW, height: cd3TowerPxH }}>
                      <div className={s.towerInner} style={{ transform: `scale(${CD3_SCALE})` }}>
                        <div className={s.tower} style={{ width: TOWER_W, height: TOWER_H }}>
                          {GREEN_DISC_DATA.map((gd, i) => {
                            const on   = disc3DroppedGreen > i
                            const live = i === disc3DroppedGreen - 1 && on
                            return (
                              <div key={i} className={[s.disc, on && s.discOn].filter(Boolean).join(' ')} style={{ left: gd.initLeft, top: gd.initTop, width: gd.pxWidth, transformOrigin: `50% ${FACE_H / 2}px`, zIndex: i + 1, '--f': DISC_GREENS[i].face, '--r': DISC_GREENS[i].rim, ...discVars }}>
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
                    <div className={s.barArea} style={{ width: disc3RiskMaxW }}>
                      <div className={s.riskBarWrap} style={{ alignItems: greenRiskLabelAlign }}>
                        <div className={s.riskBarLabel}>
                          <span className={s.riskBarTitle}>{COPY.barGreenLabel}</span>
                          <span className={s.riskBarPct}>{disc3DroppedGreen}/{N}</span>
                          {disc3DroppedGreen > 0 && <span className={s.riskBarCat} style={{ opacity: disc3Phase < DISC_PHASES - 1 ? 1 : 0, transition: 'opacity 0.6s ease' }}>{ITEMS[disc3GreenTopI].category}</span>}
                        </div>
                        <div className={s.riskBar} style={{ ...riskBarStyle(disc3GreenBarW, disc3RiskMaxW, DISCS.greenRiskBarGrowDir), height: DISCS.riskBarH, background: `linear-gradient(to right, ${GREEN_COLORS[Math.max(0, disc3DroppedGreen - 1)].bright}, ${GREEN_COLORS[Math.max(0, disc3DroppedGreen - 1)].dark})`, opacity: disc3DroppedGreen > 0 ? DISCS.barActiveOpacity : DISCS.barIdleOpacity, transition: 'transform 0.45s cubic-bezier(0.18,1.18,0.38,1), opacity 0.3s ease' }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Right: all items */}
          <div className={s.textCol}>
            {ITEMS.map((item, i) => {
              const on      = disc3Dropped > i
              const live    = i === disc3ActiveI && on
              const posOn   = disc3DroppedGreen > i
              const posLive = i === disc3DroppedGreen - 1 && posOn
              return (
                <div key={i} className={[s.discCard, on && s.discCardOn, live && s.discCardRed, posOn && s.discCardGreen].filter(Boolean).join(' ')}>
                  <span className={s.discCardNum}>{String(i + 1).padStart(2, '0')}</span>
                  <div className={s.discCardBody}>
                    <div className={s.discNegSection}>
                      <p className={s.discCat}>{item.category}</p>
                      <p className={s.discNegTxt}>{item.ntext}</p>
                    </div>
                    <div className={[s.discPosSlot, on && s.discPosSlotReserved, posOn && s.discPosSlotOn].filter(Boolean).join(' ')}>
                      {posOn && (
                        <div className={s.discPosRow}>
                          <span className={[s.pencilIcon, posLive && s.pencilVisible].filter(Boolean).join(' ')} style={i === N - 1 && disc3Phase >= DISC_PHASES - 1 ? { opacity: 0, transition: 'opacity 0.6s ease' } : undefined} aria-hidden="true">
                            <svg viewBox="0 0 16 16" fill="none" className={s.pencilSvg}>
                              <path d="M11.5 2.5a1.5 1.5 0 0 1 2 2L5 13l-3 1 1-3 8.5-8.5z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </span>
                          <p key={`pos-${i}-${posOn}`} className={[s.discPosTxt, posOn && s.discPosTxtWrite].filter(Boolean).join(' ')}>
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

      {/* ── OPTION LABEL: COLLAPSING DISCS 4 ───────────────────────────────── */}
      <div className={s.optionLabel}>
        <div className={s.optionDivider} />
        <span>Collapsing Discs 4</span>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          COLLAPSING DISCS 4 — full-screen tower, no text column.
          Item text is written curved above each disc face.
          Red tower fades out; green tower fades in at same position.
      ══════════════════════════════════════════════════════════════════════ */}
      <div ref={disc4DriverRef} className={s.discDriver} style={{ height: `${DISC_PHASES * DISCS.scrollVhPerPhase}vh` }}>
        <div className={[s.discScene, s.discSceneCd4, disc4Fall && s.discSceneCollapse].filter(Boolean).join(' ')}
             style={{ '--font-scale': DISCS.fontScale, '--pos-neg-ratio': DISCS.posNegFontRatio, '--drop-dur': `${DISCS.dropAnimDuration}s`, paddingBottom: `${DISCS.baselinePct}%`, '--tower-col-shift': `${DISCS.towerColShift}px` }}>

          <div className={s.towerColCd4}>
            <div className={s.towerOverlap}>

              {/* ── Red tower — fades out on green reveal ── */}
              <div className={s.towerSection}
                   style={{ gridArea: '1/1', opacity: disc4GreenReveal ? 0 : 1, transition: 'opacity 0.6s ease', pointerEvents: disc4GreenReveal ? 'none' : 'auto' }}>
                <div className={s.towerWithBar}>
                  <div className={s.valueBarWrap} style={{ marginRight: disc4ValueBarGap }}>
                    <div className={s.valueBarRow}>
                      <span className={s.valueBarLabel}>{COPY.barValueLabel}</span>
                      <div className={s.valueBar} style={{ width: DISCS.valueBarW, height: disc4FinalRedValueH, background: disc4Fall ? RED_COLORS[N - 1].bright : 'rgba(176,168,154,0.55)', transition: disc4Fall ? 'none' : 'height 0.45s cubic-bezier(0.18,1.18,0.38,1)', opacity: disc4Dropped > 0 ? 1 : 0 }} />
                    </div>
                    <div style={{ height: 29 + DISCS.riskBarH, flexShrink: 0 }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                    <div className={s.sectionHead}>
                      <p className={s.eyebrowRed}>{COPY.eyebrowRed}</p>
                      <h3 className={s.sectionTitle}>{COPY.titleRed}</h3>
                    </div>
                    <div className={s.towerOuter} style={{ width: cd4TowerPxW, height: cd4TowerPxH }}>
                      <div className={s.towerInner} style={{ transform: `scale(${CD4_SCALE})` }}>
                        <div className={s.tower} style={{ width: TOWER_W, height: TOWER_H }}>
                          {cd4RedDiscData.map((disc, i) => {
                            const initLeft = toScreenLeft(disc.initCX, disc.radius)
                            const initTop  = toScreenTop(disc.initCZ)
                            const on   = disc4Dropped > i
                            const live = i === disc4ActiveI && on
                            const cs   = disc4Fall && disc4CollapseStyles ? disc4CollapseStyles[i] : null
                            const ry   = FACE_H / 2
                            const W    = disc.pxWidth
                            const rx_l = W / 2
                            const TM_l = W * CD4_TAPE_SIDE_MARGIN
                            const x0_l = TM_l.toFixed(2); const x1_l = (W - TM_l).toFixed(2)
                            const [desc1r, desc2r] = wrapText(ITEMS[i].ntext, W * CD4_SCALE, CD4_RED_DESC_FS)
                            const pad_l  = Math.round(CD4_CAT_FS_L * 0.4)
                            const kTop_l = CD4_K_CAT_L - pad_l
                            const kBot_l = (desc2r ? CD4_K_RED_D2_L : CD4_K_RED_D1_L) + pad_l
                            const kOff_l = -(kTop_l + kBot_l) / 2
                            const sC_l   = FACE_H + ry * CD4_TAPE_ARC_F
                            const ey_l   = k => (sC_l + k + kOff_l).toFixed(2)
                            const arc_l  = k => `M ${x0_l},${ey_l(k)} A ${rx_l},${ry} 0 0 0 ${x1_l},${ey_l(k)}`
                            const bH_l   = ry * (1 - CD4_TAPE_TOPBOT_MARGIN)
                            const bTop_l = (FACE_H - bH_l + ry * CD4_TAPE_ARC_F).toFixed(2)
                            const bBot_l = (FACE_H + bH_l + ry * CD4_TAPE_ARC_F).toFixed(2)
                            const band_l = `M ${x0_l},${bTop_l} A ${rx_l},${ry} 0 0 0 ${x1_l},${bTop_l} L ${x1_l},${bBot_l} A ${rx_l},${ry} 0 0 1 ${x0_l},${bBot_l} Z`
                            return (
                              <div key={i} className={[s.disc, on && s.discOn].filter(Boolean).join(' ')} style={{ left: cs ? cs.left : initLeft, top: cs ? cs.top : initTop, width: W, transform: cs ? cs.transform : undefined, transformOrigin: `50% ${ry}px`, transition: disc4Fall ? 'none' : undefined, zIndex: i + 1, '--f': DISC_REDS[i].face, '--r': DISC_REDS[i].rim, ...discVars }}>
                                <div className={[s.discFace, live && s.discFaceLive].filter(Boolean).join(' ')}>
                                  <span className={s.discNum}>{String(i + 1).padStart(2, '0')}</span>
                                </div>
                                <div className={s.discSide} />
                                {on && (
                                  <svg aria-hidden="true" style={{ position: 'absolute', left: 0, top: 0, width: W, height: FACE_H * 2.5, overflow: 'visible', pointerEvents: 'none', zIndex: 10 }}>
                                    <defs>
                                      <path id={`cd4r-cat-${i}`} d={arc_l(CD4_K_CAT_L)} />
                                      <path id={`cd4r-d1-${i}`}  d={arc_l(CD4_K_RED_D1_L)} />
                                      <path id={`cd4r-d2-${i}`}  d={arc_l(CD4_K_RED_D2_L)} />
                                    </defs>
                                    <path d={band_l} fill="var(--color-primary)" fillOpacity={DISCS.cd4TapeBgOpacity} stroke={TEXT_REDS} strokeWidth={0.8 / CD4_SCALE} />
                                    <text style={{ fontFamily: 'var(--font-body)', fontSize: CD4_CAT_FS_L, fontWeight: 700, letterSpacing: '0.1em', fill: TEXT_REDS }}>
                                      <textPath href={`#cd4r-cat-${i}`} startOffset="50%" textAnchor="middle">{ITEMS[i].category.toUpperCase()}</textPath>
                                    </text>
                                    <text style={{ fontFamily: 'var(--font-display)', fontSize: CD4_RED_DESC_FS_L, fontStyle: 'italic', fill: 'rgba(176,168,154,0.92)' }}>
                                      <textPath href={`#cd4r-d1-${i}`} startOffset="50%" textAnchor="middle">{desc1r}</textPath>
                                    </text>
                                    {desc2r && (
                                      <text style={{ fontFamily: 'var(--font-display)', fontSize: CD4_RED_DESC_FS_L, fontStyle: 'italic', fill: 'rgba(176,168,154,0.92)' }}>
                                        <textPath href={`#cd4r-d2-${i}`} startOffset="50%" textAnchor="middle">{desc2r}</textPath>
                                      </text>
                                    )}
                                  </svg>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                    <div className={s.barArea} style={{ width: disc4RiskMaxW }}>
                      <div className={s.riskBarWrap} style={{ alignItems: redRiskLabelAlign }}>
                        <div className={s.riskBarLabel}>
                          <span className={s.riskBarTitle}>{COPY.barRedLabel}</span>
                          <span className={s.riskBarPct}>{disc4Dropped}/{N}</span>
                          {disc4Dropped > 0 && <span className={s.riskBarCat} style={{ opacity: !disc4GreenReveal ? 1 : 0, transition: 'opacity 0.6s ease' }}>{ITEMS[disc4RedTopI].category}</span>}
                        </div>
                        <div className={s.riskBar} style={{ ...riskBarStyle(disc4RedBarW, disc4RiskMaxW, DISCS.redRiskBarGrowDir), height: DISCS.riskBarH, background: `linear-gradient(to right, ${RED_COLORS[Math.max(0, disc4Dropped - 1)].bright}, ${RED_COLORS[Math.max(0, disc4Dropped - 1)].dark})`, opacity: disc4Dropped > 0 ? DISCS.barActiveOpacity : DISCS.barIdleOpacity, transition: 'transform 0.45s cubic-bezier(0.18,1.18,0.38,1), opacity 0.3s ease' }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Green tower — fades in at same position on green reveal ── */}
              <div className={s.towerSection}
                   style={{ gridArea: '1/1', opacity: disc4GreenReveal ? 1 : 0, transition: 'opacity 0.6s ease', pointerEvents: disc4GreenReveal ? 'auto' : 'none' }}>
                <div className={s.towerWithBar}>
                  <div className={s.valueBarWrap} style={{ marginRight: disc4ValueBarGap, opacity: disc4GreenReveal ? 1 : 0, transition: 'opacity 0.3s ease' }}>
                    <div className={s.valueBarRow}>
                      <span className={s.valueBarLabel}>{COPY.barValueLabel}</span>
                      <div className={s.valueBar} style={{ width: DISCS.valueBarW, height: disc4GreenValueH, background: disc4DroppedGreen === N ? GREEN_COLORS[N - 1].bright : 'rgba(176,168,154,0.55)', transition: 'height 0.45s cubic-bezier(0.18,1.18,0.38,1), background-color 0s' }} />
                    </div>
                    <div style={{ height: 29 + DISCS.riskBarH, flexShrink: 0 }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                    <div className={[s.sectionHead, !disc4GreenReveal && s.sectionHeadHidden].filter(Boolean).join(' ')}>
                      <p className={s.eyebrowGreen}>{COPY.eyebrowGreen}</p>
                      <h3 className={s.sectionTitle}>{COPY.titleGreen}</h3>
                    </div>
                    <div className={s.towerOuter} style={{ width: cd4TowerPxW, height: cd4TowerPxH }}>
                      <div className={s.towerInner} style={{ transform: `scale(${CD4_SCALE})` }}>
                        <div className={s.tower} style={{ width: TOWER_W, height: TOWER_H }}>
                          {GREEN_DISC_DATA.map((gd, i) => {
                            const on   = disc4DroppedGreen > i
                            const live = i === disc4DroppedGreen - 1 && on
                            const ry   = FACE_H / 2
                            const W    = gd.pxWidth
                            const rx_l = W / 2
                            const TM_l = W * CD4_TAPE_SIDE_MARGIN
                            const x0_l = TM_l.toFixed(2); const x1_l = (W - TM_l).toFixed(2)
                            const [desc1g, desc2g] = wrapText(ITEMS[i].ptext, W * CD4_SCALE, CD4_GRN_DESC_FS)
                            const pad_l  = Math.round(CD4_CAT_FS_L * 0.4)
                            const kTop_l = CD4_K_CAT_L - pad_l
                            const kBot_l = (desc2g ? CD4_K_GRN_D2_L : CD4_K_GRN_D1_L) + pad_l
                            const kOff_l = -(kTop_l + kBot_l) / 2
                            const sC_l   = FACE_H + ry * CD4_TAPE_ARC_F
                            const ey_l   = k => (sC_l + k + kOff_l).toFixed(2)
                            const arc_l  = k => `M ${x0_l},${ey_l(k)} A ${rx_l},${ry} 0 0 0 ${x1_l},${ey_l(k)}`
                            const bH_l   = ry * (1 - CD4_TAPE_TOPBOT_MARGIN)
                            const bTop_l = (FACE_H - bH_l + ry * CD4_TAPE_ARC_F).toFixed(2)
                            const bBot_l = (FACE_H + bH_l + ry * CD4_TAPE_ARC_F).toFixed(2)
                            const band_l = `M ${x0_l},${bTop_l} A ${rx_l},${ry} 0 0 0 ${x1_l},${bTop_l} L ${x1_l},${bBot_l} A ${rx_l},${ry} 0 0 1 ${x0_l},${bBot_l} Z`
                            return (
                              <div key={i} className={[s.disc, on && s.discOn].filter(Boolean).join(' ')} style={{ left: gd.initLeft, top: gd.initTop, width: W, transformOrigin: `50% ${ry}px`, zIndex: i + 1, '--f': DISC_GREENS[i].face, '--r': DISC_GREENS[i].rim, ...discVars }}>
                                <div className={[s.discFace, live && s.discFaceLiveGreen].filter(Boolean).join(' ')}>
                                  <span className={s.discNum}>{String(i + 1).padStart(2, '0')}</span>
                                </div>
                                <div className={s.discSide} />
                                {on && (
                                  <svg aria-hidden="true" style={{ position: 'absolute', left: 0, top: 0, width: W, height: FACE_H * 2.5, overflow: 'visible', pointerEvents: 'none', zIndex: 10 }}>
                                    <defs>
                                      <path id={`cd4g-cat-${i}`} d={arc_l(CD4_K_CAT_L)} />
                                      <path id={`cd4g-d1-${i}`}  d={arc_l(CD4_K_GRN_D1_L)} />
                                      <path id={`cd4g-d2-${i}`}  d={arc_l(CD4_K_GRN_D2_L)} />
                                    </defs>
                                    <path d={band_l} fill="var(--color-primary)" fillOpacity={DISCS.cd4TapeBgOpacity} stroke={TEXT_GREENS} strokeWidth={0.8 / CD4_SCALE} />
                                    <text style={{ fontFamily: 'var(--font-body)', fontSize: CD4_CAT_FS_L, fontWeight: 700, letterSpacing: '0.1em', fill: TEXT_GREENS }}>
                                      <textPath href={`#cd4g-cat-${i}`} startOffset="50%" textAnchor="middle">{ITEMS[i].category.toUpperCase()}</textPath>
                                    </text>
                                    <text style={{ fontFamily: 'var(--font-display)', fontSize: CD4_GRN_DESC_FS_L, fill: 'rgba(240,236,227,0.92)' }}>
                                      <textPath href={`#cd4g-d1-${i}`} startOffset="50%" textAnchor="middle">{desc1g}</textPath>
                                    </text>
                                    {desc2g && (
                                      <text style={{ fontFamily: 'var(--font-display)', fontSize: CD4_GRN_DESC_FS_L, fill: 'rgba(240,236,227,0.92)' }}>
                                        <textPath href={`#cd4g-d2-${i}`} startOffset="50%" textAnchor="middle">{desc2g}</textPath>
                                      </text>
                                    )}
                                  </svg>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                    <div className={s.barArea} style={{ width: disc4RiskMaxW }}>
                      <div className={s.riskBarWrap} style={{ alignItems: greenRiskLabelAlign }}>
                        <div className={s.riskBarLabel}>
                          <span className={s.riskBarTitle}>{COPY.barGreenLabel}</span>
                          <span className={s.riskBarPct}>{disc4DroppedGreen}/{N}</span>
                          {disc4DroppedGreen > 0 && <span className={s.riskBarCat} style={{ opacity: disc4Phase < DISC_PHASES - 1 ? 1 : 0, transition: 'opacity 0.6s ease' }}>{ITEMS[disc4GreenTopI].category}</span>}
                        </div>
                        <div className={s.riskBar} style={{ ...riskBarStyle(disc4GreenBarW, disc4RiskMaxW, DISCS.greenRiskBarGrowDir), height: DISCS.riskBarH, background: `linear-gradient(to right, ${GREEN_COLORS[Math.max(0, disc4DroppedGreen - 1)].bright}, ${GREEN_COLORS[Math.max(0, disc4DroppedGreen - 1)].dark})`, opacity: disc4DroppedGreen > 0 ? DISCS.barActiveOpacity : DISCS.barIdleOpacity, transition: 'transform 0.45s cubic-bezier(0.18,1.18,0.38,1), opacity 0.3s ease' }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

    </div>
  )
}
