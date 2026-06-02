import { DISCS } from './config.js'
import { ORIGIN_PX, ORIGIN_PZ, BL_OX, BL_OZ, FACE_H } from './geometry.js'

export function lerp(a, b, t) { return a + (b - a) * t }

export function interp(arr, tArr, t) {
  if (t <= tArr[0]) return arr[0]
  if (t >= tArr[tArr.length - 1]) return arr[arr.length - 1]
  let i = 0
  while (i < tArr.length - 1 && tArr[i + 1] <= t) i++
  const span = tArr[i + 1] - tArr[i]
  return lerp(arr[i], arr[i + 1], span > 0 ? (t - tArr[i]) / span : 0)
}

export function toScreenLeft(bx, radius) {
  return Math.round(ORIGIN_PX + (bx - radius - BL_OX) * DISCS.blenderScale)
}

export function toScreenTop(bz) {
  return Math.round(ORIGIN_PZ - (bz - BL_OZ) * DISCS.blenderScale - FACE_H / 2)
}

export function buildCurvePath(pts, tension) {
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

export function riskBarStyle(w, maxW, dir) {
  const origin = dir === 'right' ? 'right' : dir === 'center' ? 'center' : 'left'
  return { width: maxW, transformOrigin: origin, transform: `scaleX(${maxW > 0 ? w / maxW : 0})` }
}

export const redRiskLabelAlign   = DISCS.redRiskBarGrowDir   === 'right' ? 'flex-end' : DISCS.redRiskBarGrowDir   === 'center' ? 'center' : 'flex-start'
export const greenRiskLabelAlign = DISCS.greenRiskBarGrowDir === 'right' ? 'flex-end' : DISCS.greenRiskBarGrowDir === 'center' ? 'center' : 'flex-start'
