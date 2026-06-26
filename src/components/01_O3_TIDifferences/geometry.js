import { DISCS, RED_COLORS, GREEN_COLORS } from './config.js'

export function buildDiscData(simData) {
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

export const cd1CollapseDuration = Math.round(
  (DISCS.cd1SimData.meta.total_frames / DISCS.cd1SimData.meta.fps) * 1000
)
export const cd2CollapseDuration = Math.round(
  (DISCS.cd2SimData.meta.total_frames / DISCS.cd2SimData.meta.fps) * 1000
)
export const cd3CollapseDuration = Math.round(
  (DISCS.cd3SimData.meta.total_frames / DISCS.cd3SimData.meta.fps) * 1000
)
export const cd4CollapseDuration = Math.round(
  (DISCS.cd4SimData.meta.total_frames / DISCS.cd4SimData.meta.fps) * 1000
)

export const cd1RedDiscData = buildDiscData(DISCS.cd1SimData)
export const cd2RedDiscData = buildDiscData(DISCS.cd2SimData)
export const cd3RedDiscData = buildDiscData(DISCS.cd3SimData)
export const cd4RedDiscData = buildDiscData(DISCS.cd4SimData)

export const N = cd1RedDiscData.length

export const FACE_H     = Math.round(cd1RedDiscData[0].thickness * DISCS.blenderScale)
export const SIDE_NET_H = FACE_H
export const SIDE_EL_H  = FACE_H / 2 + SIDE_NET_H

export const BL_OX = cd1RedDiscData[0].initCX
export const BL_OZ = cd1RedDiscData[0].initCZ

const PAD           = 10
const maxInitCZ     = Math.max(...cd1RedDiscData.map(d => d.initCZ))
const blenderRangeZ = maxInitCZ - BL_OZ

export const ORIGIN_PX = PAD + Math.round(cd1RedDiscData[0].radius * DISCS.blenderScale)
export const ORIGIN_PZ = PAD + Math.round(blenderRangeZ * DISCS.blenderScale) + Math.round(FACE_H / 2)

export const maxDiscPxWidth = Math.max(...cd1RedDiscData.map(d => d.pxWidth))
export const TOWER_W = PAD + maxDiscPxWidth + PAD
export const TOWER_H = Math.round(ORIGIN_PZ + FACE_H / 2 + SIDE_NET_H + PAD)

export const TOWER_PX_W = Math.round(TOWER_W * DISCS.towerScale)
export const TOWER_PX_H = Math.round(TOWER_H * DISCS.towerScale)

export const CD3_SCALE   = DISCS.towerScale * DISCS.cd3TowerScale
export const cd3TowerPxW = Math.round(TOWER_W * CD3_SCALE)
export const cd3TowerPxH = Math.round(TOWER_H * CD3_SCALE)

export const CD4_SCALE   = DISCS.towerScale * DISCS.cd4TowerScale
export const cd4TowerPxW = Math.round(TOWER_W * CD4_SCALE)
export const cd4TowerPxH = Math.round(TOWER_H * CD4_SCALE)

export const discValueBarGap  = Math.round(DISCS.valueBarGap * DISCS.towerScale)
export const disc3ValueBarGap = Math.round(DISCS.valueBarGap * CD3_SCALE)
export const disc4ValueBarGap = Math.round(DISCS.valueBarGap * CD4_SCALE)

export const GREEN_DISC_DATA = cd1RedDiscData.map((redDisc, i) => {
  const pxWidth  = cd1RedDiscData[N - 1 - i].pxWidth
  const initLeft = Math.round((TOWER_W - pxWidth) / 2)
  const initTop  = Math.round(ORIGIN_PZ - (redDisc.initCZ - BL_OZ) * DISCS.blenderScale - FACE_H / 2)
  return { pxWidth, initLeft, initTop }
})

export const TEXT_REDS    = RED_COLORS[N - 1].bright
export const TEXT_GREENS  = GREEN_COLORS[N - 1].bright
export const CURVE_ACCENT = 'var(--color-accent)'

// 2*N red+green drop phases, +1 fall, +1 green-reveal start, +1 dwell at the
// completed green state. Was 2*N+4 — the extra trailing phase was dead scroll
// that faded the final "Scope & Fees" category out before the section released.
export const DISC_PHASES = 2 * N + 3

export const DISC_VARS = {
  '--face-h':   `${FACE_H}px`,
  '--face-hr':  `${FACE_H / 2}px`,
  '--side-elh': `${SIDE_EL_H}px`,
}

// ── CD4 text sizing ──────────────────────────────────────────────────────────
export const CD4_CAT_FS      = 9.5 * DISCS.fontScale * CD4_SCALE * 0.64
export const CD4_RED_DESC_FS = 15  * DISCS.fontScale * DISCS.cd4RedTextScale * CD4_SCALE * 0.64
export const CD4_GRN_DESC_FS = 15  * DISCS.fontScale * DISCS.posNegFontRatio * DISCS.cd4GreenTextScale * CD4_SCALE * 0.64

export const CD4_TAPE_SIDE_MARGIN   = DISCS.cd4TapeSideMargin
export const CD4_TAPE_TOPBOT_MARGIN = DISCS.cd4TapeTopBotMargin
export const CD4_TAPE_ARC_F = Math.sqrt(Math.max(0, 4 * CD4_TAPE_SIDE_MARGIN * (1 - CD4_TAPE_SIDE_MARGIN)))

export const CD4_CAT_FS_L      = CD4_CAT_FS      / CD4_SCALE
export const CD4_RED_DESC_FS_L = CD4_RED_DESC_FS / CD4_SCALE
export const CD4_GRN_DESC_FS_L = CD4_GRN_DESC_FS / CD4_SCALE
export const CD4_K_CAT_L    = Math.round(CD4_CAT_FS_L * 0.85)
export const CD4_K_RED_D1_L = Math.round(CD4_K_CAT_L + CD4_CAT_FS_L * 0.55 + 3 / CD4_SCALE + CD4_RED_DESC_FS_L * 0.85)
export const CD4_K_RED_D2_L = Math.round(CD4_K_RED_D1_L + CD4_RED_DESC_FS_L * 1.25 + 2 / CD4_SCALE)
export const CD4_K_GRN_D1_L = Math.round(CD4_K_CAT_L + CD4_CAT_FS_L * 0.55 + 3 / CD4_SCALE + CD4_GRN_DESC_FS_L * 0.85)
export const CD4_K_GRN_D2_L = Math.round(CD4_K_GRN_D1_L + CD4_GRN_DESC_FS_L * 1.25 + 2 / CD4_SCALE)

export function wrapText(str, pxWidth, fontSize) {
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
