import { useRef, useEffect, useState } from 'react'
import s from './TIDifferencesOption3.module.css'
import { DISCS, ITEMS, COPY, DISC_REDS, DISC_GREENS, RED_COLORS, GREEN_COLORS } from './config.js'
import {
  N, DISC_PHASES, TOWER_W, TOWER_H, FACE_H, DISC_VARS,
  GREEN_DISC_DATA, maxDiscPxWidth,
  CD4_SCALE, cd4TowerPxW, cd4TowerPxH, disc4ValueBarGap,
  cd4RedDiscData, cd4CollapseDuration,
  TEXT_REDS, TEXT_GREENS,
  CD4_CAT_FS_L, CD4_RED_DESC_FS_L, CD4_GRN_DESC_FS_L,
  CD4_RED_DESC_FS, CD4_GRN_DESC_FS,
  CD4_K_CAT_L, CD4_K_RED_D1_L, CD4_K_RED_D2_L, CD4_K_GRN_D1_L, CD4_K_GRN_D2_L,
  CD4_TAPE_SIDE_MARGIN, CD4_TAPE_TOPBOT_MARGIN, CD4_TAPE_ARC_F,
  wrapText,
} from './geometry.js'
import { riskBarStyle, redRiskLabelAlign, greenRiskLabelAlign, toScreenLeft, toScreenTop } from './utils.js'
import { useCollapsingDiscs } from './useCollapsingDiscs.js'
import { DiscTower } from './DiscTower.jsx'

function renderRedOverlay(disc, i, on) {
  if (!on) return null
  const ry   = FACE_H / 2
  const W    = disc.pxWidth
  const rx_l = W / 2
  const TM_l = W * CD4_TAPE_SIDE_MARGIN
  const x0_l = TM_l.toFixed(2)
  const x1_l = (W - TM_l).toFixed(2)
  const [desc1, desc2] = wrapText(ITEMS[i].ntext, W * CD4_SCALE, CD4_RED_DESC_FS)
  const pad_l  = Math.round(CD4_CAT_FS_L * 0.4)
  const kTop_l = CD4_K_CAT_L - pad_l
  const kBot_l = (desc2 ? CD4_K_RED_D2_L : CD4_K_RED_D1_L) + pad_l
  const kOff_l = -(kTop_l + kBot_l) / 2
  const sC_l   = FACE_H + ry * CD4_TAPE_ARC_F
  const ey_l   = k => (sC_l + k + kOff_l).toFixed(2)
  const arc_l  = k => `M ${x0_l},${ey_l(k)} A ${rx_l},${ry} 0 0 0 ${x1_l},${ey_l(k)}`
  const bH_l   = ry * (1 - CD4_TAPE_TOPBOT_MARGIN)
  const bTop_l = (FACE_H - bH_l + ry * CD4_TAPE_ARC_F).toFixed(2)
  const bBot_l = (FACE_H + bH_l + ry * CD4_TAPE_ARC_F).toFixed(2)
  const band_l = `M ${x0_l},${bTop_l} A ${rx_l},${ry} 0 0 0 ${x1_l},${bTop_l} L ${x1_l},${bBot_l} A ${rx_l},${ry} 0 0 1 ${x0_l},${bBot_l} Z`
  return (
    <svg key={`cd4r-svg-${i}`} aria-hidden="true" style={{ position: 'absolute', left: 0, top: 0, width: W, height: FACE_H * 2.5, overflow: 'visible', pointerEvents: 'none', zIndex: 10 }}>
      <defs>
        <path id={`cd4r-cat-${i}`} d={arc_l(CD4_K_CAT_L)} />
        <path id={`cd4r-d1-${i}`}  d={arc_l(CD4_K_RED_D1_L)} />
        <path id={`cd4r-d2-${i}`}  d={arc_l(CD4_K_RED_D2_L)} />
      </defs>
      <path d={band_l} fill="var(--color-primary)" fillOpacity={DISCS.cd4TapeBgOpacity} />
      <text style={{ fontFamily: 'var(--font-body)', fontSize: CD4_CAT_FS_L, fontWeight: 700, letterSpacing: '0.1em', fill: TEXT_REDS }}>
        <textPath href={`#cd4r-cat-${i}`} startOffset="50%" textAnchor="middle">{ITEMS[i].category.toUpperCase()}</textPath>
      </text>
      <text style={{ fontFamily: 'var(--font-display)', fontSize: CD4_RED_DESC_FS_L, fill: 'rgba(240,236,227,0.92)' }}>
        <textPath href={`#cd4r-d1-${i}`} startOffset="50%" textAnchor="middle">{desc1}</textPath>
      </text>
      {desc2 && (
        <text style={{ fontFamily: 'var(--font-display)', fontSize: CD4_RED_DESC_FS_L, fill: 'rgba(240,236,227,0.92)' }}>
          <textPath href={`#cd4r-d2-${i}`} startOffset="50%" textAnchor="middle">{desc2}</textPath>
        </text>
      )}
    </svg>
  )
}

function renderGreenOverlay(disc, i, on) {
  if (!on) return null
  const ry   = FACE_H / 2
  const W    = disc.pxWidth
  const rx_l = W / 2
  const TM_l = W * CD4_TAPE_SIDE_MARGIN
  const x0_l = TM_l.toFixed(2)
  const x1_l = (W - TM_l).toFixed(2)
  const [desc1, desc2] = wrapText(ITEMS[i].ptext, W * CD4_SCALE, CD4_GRN_DESC_FS)
  const pad_l  = Math.round(CD4_CAT_FS_L * 0.4)
  const kTop_l = CD4_K_CAT_L - pad_l
  const kBot_l = (desc2 ? CD4_K_GRN_D2_L : CD4_K_GRN_D1_L) + pad_l
  const kOff_l = -(kTop_l + kBot_l) / 2
  const sC_l   = FACE_H + ry * CD4_TAPE_ARC_F
  const ey_l   = k => (sC_l + k + kOff_l).toFixed(2)
  const arc_l  = k => `M ${x0_l},${ey_l(k)} A ${rx_l},${ry} 0 0 0 ${x1_l},${ey_l(k)}`
  const bH_l   = ry * (1 - CD4_TAPE_TOPBOT_MARGIN)
  const bTop_l = (FACE_H - bH_l + ry * CD4_TAPE_ARC_F).toFixed(2)
  const bBot_l = (FACE_H + bH_l + ry * CD4_TAPE_ARC_F).toFixed(2)
  const band_l = `M ${x0_l},${bTop_l} A ${rx_l},${ry} 0 0 0 ${x1_l},${bTop_l} L ${x1_l},${bBot_l} A ${rx_l},${ry} 0 0 1 ${x0_l},${bBot_l} Z`
  return (
    <svg key={`cd4g-svg-${i}`} aria-hidden="true" style={{ position: 'absolute', left: 0, top: 0, width: W, height: FACE_H * 2.5, overflow: 'visible', pointerEvents: 'none', zIndex: 10 }}>
      <defs>
        <path id={`cd4g-cat-${i}`} d={arc_l(CD4_K_CAT_L)} />
        <path id={`cd4g-d1-${i}`}  d={arc_l(CD4_K_GRN_D1_L)} />
        <path id={`cd4g-d2-${i}`}  d={arc_l(CD4_K_GRN_D2_L)} />
      </defs>
      <path d={band_l} fill="var(--color-primary)" fillOpacity={DISCS.cd4TapeBgOpacity} />
      <text style={{ fontFamily: 'var(--font-body)', fontSize: CD4_CAT_FS_L, fontWeight: 700, letterSpacing: '0.1em', fill: TEXT_GREENS }}>
        <textPath href={`#cd4g-cat-${i}`} startOffset="50%" textAnchor="middle">{ITEMS[i].category.toUpperCase()}</textPath>
      </text>
      <text style={{ fontFamily: 'var(--font-display)', fontSize: CD4_GRN_DESC_FS_L, fill: 'rgba(240,236,227,0.92)' }}>
        <textPath href={`#cd4g-d1-${i}`} startOffset="50%" textAnchor="middle">{desc1}</textPath>
      </text>
      {desc2 && (
        <text style={{ fontFamily: 'var(--font-display)', fontSize: CD4_GRN_DESC_FS_L, fill: 'rgba(240,236,227,0.92)' }}>
          <textPath href={`#cd4g-d2-${i}`} startOffset="50%" textAnchor="middle">{desc2}</textPath>
        </text>
      )}
    </svg>
  )
}

export function CollapsingDiscs4() {
  const { driverRef, phase, dropped, fall, greenReveal, droppedGreen, activeI, collapseStyles, totalPhases }
    = useCollapsingDiscs(cd4RedDiscData, cd4CollapseDuration, 1)

  const colRef = useRef(null)
  const [mobileScale, setMobileScale] = useState(1)

  useEffect(() => {
    const el = colRef.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => {
      setMobileScale(Math.min(1, entry.contentRect.width / cd4TowerPxW))
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const disc4RiskMaxW = Math.round(
    (DISCS.riskBarMaxW ?? maxDiscPxWidth * CD4_SCALE) * DISCS.riskBarScale
  )

  const redTopI   = Math.max(0, dropped - 1)
  const greenTopI = Math.max(0, droppedGreen - 1)

  const redBarW = dropped > 0
    ? Math.round(cd4RedDiscData[dropped - 1].pxWidth * CD4_SCALE * DISCS.riskBarScale)
    : 0
  const greenBarW = droppedGreen > 0
    ? Math.round(GREEN_DISC_DATA[droppedGreen - 1].pxWidth * CD4_SCALE * DISCS.riskBarScale)
    : 0

  const redValueH = dropped > 0
    ? Math.round((TOWER_H - toScreenTop(cd4RedDiscData[dropped - 1].initCZ)) * CD4_SCALE)
    : 0
  const collapseTopPx = fall && collapseStyles
    ? Math.round((TOWER_H - collapseStyles[N - 1].top) * CD4_SCALE)
    : null
  const finalRedValueH = collapseTopPx !== null ? collapseTopPx : redValueH

  const greenValueH = droppedGreen > 0
    ? Math.round((TOWER_H - GREEN_DISC_DATA[droppedGreen - 1].initTop) * CD4_SCALE)
    : 0

  const redInitPositions   = cd4RedDiscData.map(disc => ({ left: toScreenLeft(disc.initCX, disc.radius), top: toScreenTop(disc.initCZ) }))
  const greenInitPositions = GREEN_DISC_DATA.map(gd => ({ left: gd.initLeft, top: gd.initTop }))

  const overlapStyle = mobileScale < 1 ? {
    transform: `scale(${mobileScale})`,
    transformOrigin: 'top center',
    marginBottom: `${(mobileScale - 1) * cd4TowerPxH}px`,
  } : undefined

  return (
    <>
      <div ref={driverRef} className={s.discDriver} style={{ height: `${totalPhases * DISCS.scrollVhPerPhase}vh` }}>
        <div
          className={[s.discScene, s.discSceneCd4, fall && s.discSceneCollapse].filter(Boolean).join(' ')}
          style={{
            '--font-scale':     DISCS.fontScale,
            '--pos-neg-ratio':  DISCS.posNegFontRatio,
            '--drop-dur':       `${DISCS.dropAnimDuration}s`,
            paddingBottom:      `${DISCS.baselinePct}%`,
            '--tower-col-shift':`${DISCS.towerColShift}px`,
          }}
        >
          <div className={s.towerColCd4} ref={colRef}>
            <div className={s.towerOverlap} style={overlapStyle}>

              {/* Red tower — fades out on green reveal */}
              <div className={s.towerSection}
                   style={{ gridArea: '1/1', opacity: greenReveal ? 0 : 1, transition: 'opacity 0.6s ease', pointerEvents: greenReveal ? 'none' : 'auto' }}>
                <div className={s.towerWithBar}>
                  <div className={s.valueBarWrap} style={{ marginRight: disc4ValueBarGap, opacity: dropped > 0 ? 1 : 0, transition: 'opacity 0.3s ease' }}>
                    <div className={s.valueBarRow}>
                      <span className={s.valueBarLabel}>{COPY.barValueLabel}</span>
                      <div className={s.valueBar} style={{ width: DISCS.valueBarW, height: finalRedValueH, background: fall ? RED_COLORS[N - 1].bright : 'rgba(176,168,154,0.55)', transition: fall ? 'none' : 'height 0.45s cubic-bezier(0.18,1.18,0.38,1)' }} />
                    </div>
                    <div style={{ height: 29 + DISCS.riskBarH, flexShrink: 0 }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                    <div className={s.sectionHead}>
                      <p className={s.eyebrowRed}>{COPY.eyebrowRed}</p>
                      <h3 className={s.sectionTitle}>{COPY.titleRed}</h3>
                    </div>
                    <DiscTower
                      discData={cd4RedDiscData}
                      pxW={cd4TowerPxW} pxH={cd4TowerPxH} scale={CD4_SCALE}
                      initPositions={redInitPositions}
                      dropped={dropped} fall={fall} collapseStyles={collapseStyles} activeI={activeI}
                      colors={DISC_REDS} discVars={DISC_VARS} isGreen={false}
                      renderOverlay={renderRedOverlay}
                    />
                    <div className={s.barArea} style={{ width: disc4RiskMaxW, opacity: dropped > 0 ? 1 : 0, transition: 'opacity 0.3s ease' }}>
                      <div className={s.riskBarWrap} style={{ alignItems: redRiskLabelAlign }}>
                        <div className={s.riskBarLabel}>
                          <span className={s.riskBarTitle}>{COPY.barRedLabel}</span>
                          <span className={s.riskBarPct}>{dropped}/{N}</span>
                          {dropped > 0 && <span className={s.riskBarCat} style={{ opacity: !greenReveal ? 1 : 0, transition: 'opacity 0.6s ease' }}>{ITEMS[redTopI].category}</span>}
                        </div>
                        <div className={s.riskBar} style={{ ...riskBarStyle(redBarW, disc4RiskMaxW, DISCS.redRiskBarGrowDir), height: DISCS.riskBarH, background: `linear-gradient(to right, ${RED_COLORS[Math.max(0, dropped - 1)].bright}, ${RED_COLORS[Math.max(0, dropped - 1)].dark})`, opacity: dropped > 0 ? DISCS.barActiveOpacity : DISCS.barIdleOpacity, transition: 'transform 0.45s cubic-bezier(0.18,1.18,0.38,1), opacity 0.3s ease' }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Green tower — fades in at same position */}
              <div className={s.towerSection}
                   style={{ gridArea: '1/1', opacity: greenReveal ? 1 : 0, transition: 'opacity 0.6s ease', pointerEvents: greenReveal ? 'auto' : 'none' }}>
                <div className={s.towerWithBar}>
                  <div className={s.valueBarWrap} style={{ marginRight: disc4ValueBarGap, opacity: droppedGreen > 0 ? 1 : 0, transition: 'opacity 0.3s ease' }}>
                    <div className={s.valueBarRow}>
                      <span className={s.valueBarLabel}>{COPY.barValueLabel}</span>
                      <div className={s.valueBar} style={{ width: DISCS.valueBarW, height: greenValueH, background: droppedGreen === N ? GREEN_COLORS[N - 1].bright : 'rgba(176,168,154,0.55)', transition: 'height 0.45s cubic-bezier(0.18,1.18,0.38,1), background-color 0s' }} />
                    </div>
                    <div style={{ height: 29 + DISCS.riskBarH, flexShrink: 0 }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                    <div className={[s.sectionHead, !greenReveal && s.sectionHeadHidden].filter(Boolean).join(' ')}>
                      <p className={s.eyebrowGreen}>{COPY.eyebrowGreen}</p>
                      <h3 className={s.sectionTitle}>{COPY.titleGreen}</h3>
                    </div>
                    <DiscTower
                      discData={GREEN_DISC_DATA}
                      pxW={cd4TowerPxW} pxH={cd4TowerPxH} scale={CD4_SCALE}
                      initPositions={greenInitPositions}
                      dropped={droppedGreen} fall={false} collapseStyles={null} activeI={droppedGreen - 1}
                      colors={DISC_GREENS} discVars={DISC_VARS} isGreen={true}
                      renderOverlay={renderGreenOverlay}
                    />
                    <div className={s.barArea} style={{ width: disc4RiskMaxW, opacity: droppedGreen > 0 ? 1 : 0, transition: 'opacity 0.3s ease' }}>
                      <div className={s.riskBarWrap} style={{ alignItems: greenRiskLabelAlign }}>
                        <div className={s.riskBarLabel}>
                          <span className={s.riskBarTitle}>{COPY.barGreenLabel}</span>
                          <span className={s.riskBarPct}>{droppedGreen}/{N}</span>
                          {droppedGreen > 0 && <span className={s.riskBarCat} style={{ opacity: phase < DISC_PHASES - 1 ? 1 : 0, transition: 'opacity 0.6s ease' }}>{ITEMS[greenTopI].category}</span>}
                        </div>
                        <div className={s.riskBar} style={{ ...riskBarStyle(greenBarW, disc4RiskMaxW, DISCS.greenRiskBarGrowDir), height: DISCS.riskBarH, background: `linear-gradient(to right, ${GREEN_COLORS[Math.max(0, droppedGreen - 1)].bright}, ${GREEN_COLORS[Math.max(0, droppedGreen - 1)].dark})`, opacity: droppedGreen > 0 ? DISCS.barActiveOpacity : DISCS.barIdleOpacity, transition: 'transform 0.45s cubic-bezier(0.18,1.18,0.38,1), opacity 0.3s ease' }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  )
}
