import { useRef, useEffect, useState } from 'react'
import s from './TIDifferencesOption3.module.css'
import { BARS, ITEMS, COPY, DISC_REDS, DISC_GREENS, RED_COLORS, GREEN_COLORS } from './config.js'
import { N, TEXT_REDS, TEXT_GREENS, CURVE_ACCENT } from './geometry.js'
import { lerp, buildCurvePath } from './utils.js'
import { useScrollProgress } from './useScrollProgress.js'

export function BarsAndBubbles1() {
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

  let bb1CurveTipPt   = null
  let bb1LastAngleDeg = 0
  if (bb1CurvePoints.length >= 2) {
    const last   = bb1CurvePoints[bb1CurvePoints.length - 1]
    const prev   = bb1CurvePoints[bb1CurvePoints.length - 2]
    const dx     = last.x - prev.x
    const dy     = last.y - prev.y
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

  return (
    <>
      <div className={s.optionLabel}>
        <div className={s.optionDivider} />
        <span>Bars &amp; Bubbles 1</span>
      </div>

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
                    <stop offset="0%"                                               stopColor={TEXT_REDS} />
                    <stop offset={`${bb1GradTransitionPct}%`}                      stopColor={TEXT_REDS} />
                    <stop offset={`${Math.min(100, bb1GradTransitionPct + 5)}%`}   stopColor={TEXT_GREENS} />
                    <stop offset="100%"                                             stopColor={TEXT_GREENS} />
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

            {bb1CurveTipPt && bb1CurvePoints.length >= 2 && (
              <div
                className={s.trajectoryLabel}
                style={{
                  left:      bb1CurveTipPt.x,
                  top:       bb1CurveTipPt.y,
                  fontSize:  9 * BARS.curveLabelFontScale * BARS.fontScale,
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
              const on    = bb1Dropped > i
              const live  = i === bb1ActiveI && on
              const barH  = BARS.redBarHeights[i] * BARS.barHeightRef
              const cx    = (i + 0.5) * bb1RedSlotW
              const glow  = `0 0 ${BARS.glowRadius}px ${RED_COLORS[N - 1].bright}aa`
              return (
                <div key={`red-${i}`} className={s.barPairSlot} style={{ left: cx, opacity: on ? 1 : 0, transition: `left ${BARS.positionAnimDuration}s ease, opacity ${BARS.opacityAnimDuration}s ease`, zIndex: 1 }}>
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
              const on    = bb1DroppedGreen > i
              const live  = i === bb1ActiveIG && on
              const barH  = BARS.greenBarHeights[i] * BARS.barHeightRef
              const cx    = bb1Dropped * bb1RedSlotW + (i + 0.5) * bb1GreenSlotW
              const glow  = `0 0 ${BARS.glowRadius}px ${GREEN_COLORS[N - 1].bright}aa`
              return (
                <div key={`green-${i}`} className={s.barPairSlot} style={{ left: cx, opacity: on ? 1 : 0, transition: `left ${BARS.positionAnimDuration}s ease, opacity ${BARS.opacityAnimDuration}s ease`, zIndex: 1 }}>
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
    </>
  )
}
