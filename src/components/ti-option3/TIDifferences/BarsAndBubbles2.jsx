import { useRef, useEffect, useState } from 'react'
import s from './TIDifferencesOption3.module.css'
import { BARS, ITEMS, COPY, DISC_REDS, DISC_GREENS, RED_COLORS, GREEN_COLORS } from './config.js'
import { N } from './geometry.js'
import { lerp } from './utils.js'
import { useScrollProgress } from './useScrollProgress.js'

export function BarsAndBubbles2() {
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
  const bb2CenterY   = bb2Ch / 2

  const bb2BubbleDia  = BARS.bubbleDiameter * BARS.bb2BubbleBarScale
  const bb2BarW       = BARS.barWidth       * BARS.bb2BubbleBarScale
  const bb2GlowRadius = BARS.glowRadius     * BARS.bb2BubbleBarScale
  const bb2HalfBub   = bb2BubbleDia / 2
  const bb2OffRightX = bb2CenterX + BARS.horizSpacing * bb2Cw
  const bb2OffLeftX  = bb2CenterX - BARS.horizSpacing * bb2Cw
  const bb2OffTopY   = bb2CenterY - BARS.horizSpacing * bb2Ch
  const bb2OffBotY   = bb2CenterY + BARS.horizSpacing * bb2Ch
  const bb2Off = {
    rightMidX: bb2CenterX + BARS.horizTransitionSpacing * bb2Cw,
    leftMidX:  bb2CenterX - BARS.horizTransitionSpacing * bb2Cw,
  }

  const bb2EntryRightX = bb2OffRightX + bb2HalfBub
  const bb2ExitLeftX   = bb2OffLeftX  - bb2HalfBub
  const bb2EntryBotY   = Math.max(bb2OffBotY + bb2HalfBub, bb2Ch + bb2HalfBub)
  const bb2EntryTopY   = Math.min(bb2OffTopY - bb2HalfBub, -bb2HalfBub)

  const bb2GreenEntryRightX = bb2CenterX + BARS.greenRedRatio * (bb2EntryRightX - bb2CenterX)
  const bb2GreenExitLeftX   = bb2CenterX - BARS.greenRedRatio * (bb2CenterX - bb2ExitLeftX)
  const bb2GreenEntryTopY   = bb2CenterY - BARS.greenRedRatio * (bb2CenterY - bb2EntryTopY)
  const bb2GreenEntryBotY   = bb2CenterY + BARS.greenRedRatio * (bb2EntryBotY - bb2CenterY)

  function getBb2RedState(i) {
    const p = bb2PhaseRaw
    if (i < N - 1) {
      if (p < i || p > i + 2) return null
      const t = (p - i) / 2
      return {
        x:        lerp(bb2EntryRightX, bb2ExitLeftX,  t),
        y:        lerp(bb2EntryBotY,   bb2EntryTopY,  t),
        opacity:  t <= 0.5 ? 1 : lerp(1, BARS.exitFadeOpacity, 2 * (t - 0.5)),
        entering: t <= 0.5,
      }
    }
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
      const t = (p - N) / 2
      return {
        x:        lerp(bb2GreenEntryRightX, bb2GreenExitLeftX, t),
        y:        lerp(bb2GreenEntryTopY,   bb2GreenEntryBotY, t),
        opacity:  lerp(1, BARS.exitFadeOpacity, 2 * (t - 0.5)),
        entering: false,
      }
    }
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

  const bb2RedStates   = ITEMS.map((_, i) => getBb2RedState(i))
  const bb2GreenStates = ITEMS.map((_, i) => getBb2GreenState(i))

  const bb2TransT    = Math.max(0, Math.min(1, bb2PhaseRaw - N))
  const lastRedSt    = bb2RedStates[N - 1]
  const firstGreenSt = bb2GreenStates[0]

  const bb2TitleRiskX  = (lastRedSt && !lastRedSt.entering) ? lastRedSt.x : bb2CenterX
  const bb2TitleRiskOp = 1 - bb2TransT

  const bb2TitleSolX = (firstGreenSt && firstGreenSt.entering) ? firstGreenSt.x : bb2CenterX

  const bb2ChartT = Math.max(0, Math.min(1, (bb2PhaseRaw - BB2_PHASES) / BARS.bb2ChartPhases))

  const bb2TitleSolOp = bb2PhaseRaw >= N - 1
    ? Math.max(0, 1 - bb2ChartT / Math.max(0.001, BARS.bb2ChartTitleDelay))
    : 0

  const bb2ChartRedSlotW   = bb2Cw > 0 ? bb2Cw / (N * (1 + BARS.greenRedRatio)) : 0
  const bb2ChartGreenSlotW = BARS.greenRedRatio * bb2ChartRedSlotW
  const bb2ChartBubDia     = lerp(bb2BubbleDia, BARS.bubbleDiameter, bb2ChartT)
  const bb2ChartHalfBub    = bb2ChartBubDia / 2
  const bb2ChartBarW       = lerp(bb2BarW, BARS.barWidth, bb2ChartT)
  const bb2ChartFontSc     = lerp(BARS.fontScale * BARS.bb2BubbleBarScale, BARS.fontScale, bb2ChartT)

  function bb2ChartLocalT(rank) {
    const startT = Math.min(0.999, (rank / (2 * N - 1)) * BARS.bb2ChartStaggerFactor)
    return Math.max(0, Math.min(1, (bb2ChartT - startT) / (1 - startT)))
  }
  const bb2ChartTitleT = Math.max(0, Math.min(1,
    (bb2ChartT - BARS.bb2ChartTitleDelay) / (1 - BARS.bb2ChartTitleDelay)
  ))

  return (
    <>
      <div className={s.optionLabel}>
        <div className={s.optionDivider} />
        <span>Bars &amp; Bubbles 2</span>
      </div>

      <div ref={bb2DriverRef} className={s.barDriver} style={{ height: `${BB2_TOTAL_PHASES * BARS.scrollVhPerPhase}vh` }}>
        <div className={s.barScene}>
          <div className={s.barChartArea} ref={bb2ChartRef}
               style={{ '--baseline': `${BARS.baselinePct}%`, '--font-scale': BARS.fontScale, '--bubble-bar-gap': `${BARS.bubbleBarGap}px` }}>

            {bb2Cw > 0 && bb2Ch > 0 && (
              <>
                <div style={{
                  position: 'absolute', top: '6vh', zIndex: 3, left: bb2TitleRiskX,
                  transform: 'translateX(-50%)',
                  opacity: bb2TitleRiskOp, textAlign: 'center',
                  pointerEvents: bb2TitleRiskOp > 0.01 ? 'auto' : 'none',
                }}>
                  <p className={s.eyebrowRed}>{COPY.eyebrowRed}</p>
                  <h3 className={s.sectionTitle}>{COPY.titleRed}</h3>
                </div>
                <div style={{
                  position: 'absolute', top: '6vh', zIndex: 3, left: bb2TitleSolX,
                  transform: 'translateX(-50%)',
                  opacity: bb2TitleSolOp, textAlign: 'center',
                  pointerEvents: bb2TitleSolOp > 0.01 ? 'auto' : 'none',
                }}>
                  <p className={s.eyebrowGreen}>{COPY.eyebrowGreen}</p>
                  <h3 className={s.sectionTitle}>{COPY.titleGreen}</h3>
                </div>

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

                {bb2ChartT > 0 && (
                  <>
                    {bb2ChartTitleT > 0 && (
                      <>
                        <div style={{
                          position: 'absolute', top: '6vh', zIndex: 3,
                          left: lerp(-bb2Cw * 0.15, N * bb2ChartRedSlotW / 2, bb2ChartTitleT),
                          transform: 'translateX(-50%)', textAlign: 'center',
                          opacity: bb2ChartTitleT, pointerEvents: 'none',
                        }}>
                          <p className={s.eyebrowRed}>{COPY.eyebrowRed}</p>
                          <h3 className={s.sectionTitle}>{COPY.titleRed}</h3>
                        </div>
                        <div style={{
                          position: 'absolute', top: '6vh', zIndex: 3,
                          left: lerp(bb2Cw * 1.15, N * bb2ChartRedSlotW + N * bb2ChartGreenSlotW / 2, bb2ChartTitleT),
                          transform: 'translateX(-50%)', textAlign: 'center',
                          opacity: bb2ChartTitleT, pointerEvents: 'none',
                        }}>
                          <p className={s.eyebrowGreen}>{COPY.eyebrowGreen}</p>
                          <h3 className={s.sectionTitle}>{COPY.titleGreen}</h3>
                        </div>
                      </>
                    )}

                    {ITEMS.map((item, i) => {
                      const rank    = (2 * N - 1) - i
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

                    {ITEMS.map((item, i) => {
                      const rank    = (2 * N - 1) - i
                      const localT  = bb2ChartLocalT(rank)
                      const barH    = BARS.redBarHeights[i] * BARS.barHeightRef
                      const slotCx  = (i + 0.5) * bb2ChartRedSlotW
                      const targetY = bb2BaselineY - barH - BARS.bubbleBarGap - bb2ChartHalfBub
                      const x       = lerp(bb2CenterX, slotCx, localT)
                      const y       = lerp(bb2CenterY, targetY, localT)
                      const opacity = lerp(BARS.exitFadeOpacity, 1, localT)
                      return (
                        <div key={`bb2-chart-red-bubble-${i}`} style={{
                          position: 'absolute',
                          left: x - bb2ChartHalfBub, top: y - bb2ChartHalfBub,
                          width: bb2ChartBubDia, height: bb2ChartBubDia,
                          borderRadius: bb2ChartHalfBub, opacity, boxShadow: 'none',
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

                    {ITEMS.map((item, i) => {
                      const rank    = (N - 1) - i
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

                    {ITEMS.map((item, i) => {
                      const rank    = (N - 1) - i
                      const localT  = bb2ChartLocalT(rank)
                      const barH    = BARS.greenBarHeights[i] * BARS.barHeightRef
                      const slotCx  = N * bb2ChartRedSlotW + (i + 0.5) * bb2ChartGreenSlotW
                      const targetY = bb2BaselineY - barH - BARS.bubbleBarGap - bb2ChartHalfBub
                      const x       = lerp(bb2CenterX, slotCx, localT)
                      const y       = lerp(bb2CenterY, targetY, localT)
                      const opacity = rank === 0 ? 1 : lerp(BARS.exitFadeOpacity, 1, localT)
                      return (
                        <div key={`bb2-chart-green-bubble-${i}`} style={{
                          position: 'absolute',
                          left: x - bb2ChartHalfBub, top: y - bb2ChartHalfBub,
                          width: bb2ChartBubDia, height: bb2ChartBubDia,
                          borderRadius: bb2ChartHalfBub, opacity, boxShadow: 'none',
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
    </>
  )
}
