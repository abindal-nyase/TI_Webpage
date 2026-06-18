import { useState, useEffect, useRef } from 'react'
import s from './01_O3_TIDifferences.module.css'
import { DISCS, ITEMS, COPY, DISC_REDS, DISC_GREENS, RED_COLORS, GREEN_COLORS } from './config.js'
import {
  N, DISC_PHASES, TOWER_W, TOWER_H, FACE_H, DISC_VARS,
  GREEN_DISC_DATA, maxDiscPxWidth,
  CD3_SCALE, cd3TowerPxW, cd3TowerPxH, disc3ValueBarGap,
  cd3RedDiscData, cd3CollapseDuration,
} from './geometry.js'
import { riskBarStyle, redRiskLabelAlign, greenRiskLabelAlign, toScreenLeft, toScreenTop } from './utils.js'
import { useCollapsingDiscs } from './useCollapsingDiscs.js'
import { DiscTower } from './DiscTower.jsx'
import { DiscTextCol } from './DiscTextCol.jsx'

export function CollapsingDiscs3() {
  const { driverRef, phase, dropped, fall, greenReveal, droppedGreen, activeI, collapseStyles }
    = useCollapsingDiscs(cd3RedDiscData, cd3CollapseDuration)

  const disc3RiskMaxW = Math.round(
    (DISCS.riskBarMaxW ?? maxDiscPxWidth * CD3_SCALE) * DISCS.riskBarScale
  )

  const redTopI   = Math.max(0, dropped - 1)
  const greenTopI = Math.max(0, droppedGreen - 1)

  const redBarW = dropped > 0
    ? Math.round(cd3RedDiscData[dropped - 1].pxWidth * CD3_SCALE * DISCS.riskBarScale)
    : 0
  const greenBarW = droppedGreen > 0
    ? Math.round(GREEN_DISC_DATA[droppedGreen - 1].pxWidth * CD3_SCALE * DISCS.riskBarScale)
    : 0

  const redValueH = dropped > 0
    ? Math.round((TOWER_H - toScreenTop(cd3RedDiscData[dropped - 1].initCZ)) * CD3_SCALE)
    : 0
  const collapseTopPx = fall && collapseStyles
    ? Math.round((TOWER_H - collapseStyles[N - 1].top) * CD3_SCALE)
    : null
  const finalRedValueH = collapseTopPx !== null ? collapseTopPx : redValueH

  const greenValueH = droppedGreen > 0
    ? Math.round((TOWER_H - GREEN_DISC_DATA[droppedGreen - 1].initTop) * CD3_SCALE)
    : 0

  const redInitPositions   = cd3RedDiscData.map(disc => ({ left: toScreenLeft(disc.initCX, disc.radius), top: toScreenTop(disc.initCZ) }))
  const greenInitPositions = GREEN_DISC_DATA.map(gd => ({ left: gd.initLeft, top: gd.initTop }))

  // Lift overlap between Intro and the disc section.
  // `.root` has margin-top: -50vh, so at Intro's pin-release the section top
  // sits at exactly 50% viewport. We want the lift line to land on the gap
  // between Intro's headline (introHeadEm) and subtext (introSub) instead.
  // The Intro box is vertically centered, so that gap sits below mid-viewport
  // by Δ = (headlineHeight − subHeight) / 2. Push the section down by Δ.
  // Both heights scale with viewport width / zoom / font pair → measured live.
  // Intro's <h2> and <p> both carry data-intro-anim (h2 first, sub second).
  const [liftShift, setLiftShift] = useState(0)
  useEffect(() => {
    function measure() {
      const anims = document.querySelectorAll('[data-intro-anim]')
      const h2 = anims[0], sub = anims[1]
      if (!h2 || !sub) return
      setLiftShift(Math.round((h2.offsetHeight - sub.offsetHeight) / 2))
    }
    measure()
    window.addEventListener('resize', measure)
    window.addEventListener('themechange', measure) // font pair changes element heights
    document.fonts?.ready.then(measure)
    return () => {
      window.removeEventListener('resize', measure)
      window.removeEventListener('themechange', measure)
    }
  }, [])

  // Fit-to-viewport scale for the disc block. The tower (value bar + gap +
  // stack + risk bar) is a fixed-px block; in a narrow `1fr` column it
  // overflows and the scene clips it. Scale the whole block down so the rest
  // state (7th disc stacked) always fits its column. offsetWidth/offsetHeight
  // ignore the applied CSS transform → no measurement feedback loop, and the
  // tower box is a fixed height regardless of dropped state → measure once.
  const colRef = useRef(null)
  const fitRef = useRef(null)
  const [fitScale, setFitScale] = useState(1)
  useEffect(() => {
    function measure() {
      const col = colRef.current, wrap = fitRef.current
      if (!col || !wrap) return
      const cs = getComputedStyle(col)
      const padX = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight)
      const padY = parseFloat(cs.paddingTop)  + parseFloat(cs.paddingBottom)
      // Height must be bounded by the sticky scene box, NOT the column.
      // `.discScene` is height:100vh + overflow:hidden but defines no
      // grid-template-rows, so its implicit row (and the column) grows to the
      // tower's content height — using the column's clientHeight would report
      // the full tower and defeat the fit. The scene's own clientHeight is the
      // real ceiling: 100vh in the 2-col layout, auto (tall) when stacked
      // ≤960px, where height is unconstrained and only width should drive fit.
      const scene = col.closest('[class*="discScene"]') || col
      const availW = col.clientWidth      - padX
      const availH = scene.clientHeight    - padY
      // Budget 2×|shift| of horizontal headroom: --tower-col-shift offsets the
      // section left of center, so the block needs that much extra room on the
      // left to stay inside a center-origin scale.
      const natW = wrap.offsetWidth + 2 * Math.abs(DISCS.towerColShift)
      const natH = wrap.offsetHeight
      if (!natW || !natH) return
      const next = Math.min(1, availW / natW, availH / natH)
      if (next > 0) setFitScale(next)
    }
    measure()
    window.addEventListener('resize', measure)
    window.addEventListener('themechange', measure)
    document.fonts?.ready.then(measure)
    return () => {
      window.removeEventListener('resize', measure)
      window.removeEventListener('themechange', measure)
    }
  }, [])

  return (
    <div className={s.root} style={{ marginTop: `calc(-50vh + ${liftShift}px)` }}>
      <div
        ref={driverRef}
        className={s.discDriver}
        style={{ height: `${DISC_PHASES * DISCS.scrollVhPerPhase}vh` }}
      >
        <div
          className={[s.discScene, fall && s.discSceneCollapse]
            .filter(Boolean)
            .join(" ")}
          style={{
            "--font-scale": DISCS.fontScale,
            "--pos-neg-ratio": DISCS.posNegFontRatio,
            "--drop-dur": `${DISCS.dropAnimDuration}s`,
            paddingBottom: `${DISCS.baselinePct}%`,
            "--tower-col-pct": `${DISCS.towerColPct}%`,
            "--tower-col-shift": `${DISCS.towerColShift}px`,
          }}
        >
          <div className={s.towerColCd3} ref={colRef}>
            <div
              className={s.towerOverlap}
              ref={fitRef}
              style={{ transform: `scale(${fitScale})`, transformOrigin: "center center" }}
            >
              {/* Red tower — fades out on green reveal */}
              <div
                className={s.towerSection}
                style={{
                  gridArea: "1/1",
                  opacity: greenReveal ? 0 : 1,
                  transition: "opacity 0.6s ease",
                  pointerEvents: greenReveal ? "none" : "auto",
                }}
              >
                <div className={s.towerWithBar}>
                  <div
                    className={s.valueBarWrap}
                    style={{ marginRight: disc3ValueBarGap }}
                  >
                    <div className={s.valueBarRow}>
                      <span className={s.valueBarLabel}>
                        {COPY.barValueLabel}
                      </span>
                      <div
                        className={s.valueBar}
                        style={{
                          width: DISCS.valueBarW,
                          height: finalRedValueH,
                          background: fall
                            ? RED_COLORS[N - 1].bright
                            : "rgba(176,168,154,0.55)",
                          transition: fall
                            ? "none"
                            : "height 0.45s cubic-bezier(0.18,1.18,0.38,1)",
                          opacity: dropped > 0 ? 1 : 0,
                        }}
                      />
                    </div>
                    <div
                      style={{ height: 29 + DISCS.riskBarH, flexShrink: 0 }}
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <div className={s.sectionHead}>
                      <p className={s.eyebrowRed}>{COPY.eyebrowRed}</p>
                      <h3 className={s.sectionTitle}>{COPY.titleRed}</h3>
                    </div>
                    <DiscTower
                      discData={cd3RedDiscData}
                      pxW={cd3TowerPxW}
                      pxH={cd3TowerPxH}
                      scale={CD3_SCALE}
                      initPositions={redInitPositions}
                      dropped={dropped}
                      fall={fall}
                      collapseStyles={collapseStyles}
                      activeI={activeI}
                      colors={DISC_REDS}
                      discVars={DISC_VARS}
                      isGreen={false}
                    />
                    <div className={s.barArea} style={{ width: disc3RiskMaxW }}>
                      <div
                        className={s.riskBarWrap}
                        style={{ alignItems: redRiskLabelAlign }}
                      >
                        <div className={s.riskBarLabel}>
                          <span className={s.riskBarTitle}>
                            {COPY.barRedLabel}
                          </span>
                          <span className={s.riskBarPct}>
                            {dropped}/{N}
                          </span>
                          {dropped > 0 && (
                            <span
                              className={s.riskBarCat}
                              style={{
                                opacity: !greenReveal ? 1 : 0,
                                transition: "opacity 0.6s ease",
                              }}
                            >
                              {ITEMS[redTopI].category}
                            </span>
                          )}
                        </div>
                        <div
                          className={s.riskBar}
                          style={{
                            ...riskBarStyle(
                              redBarW,
                              disc3RiskMaxW,
                              DISCS.redRiskBarGrowDir,
                            ),
                            height: DISCS.riskBarH,
                            background: `linear-gradient(to right, ${RED_COLORS[Math.max(0, dropped - 1)].bright}, ${RED_COLORS[Math.max(0, dropped - 1)].dark})`,
                            opacity:
                              dropped > 0
                                ? DISCS.barActiveOpacity
                                : DISCS.barIdleOpacity,
                            transition:
                              "transform 0.45s cubic-bezier(0.18,1.18,0.38,1), opacity 0.3s ease",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Green tower — fades in at same position */}
              <div
                className={s.towerSection}
                style={{
                  gridArea: "1/1",
                  opacity: greenReveal ? 1 : 0,
                  transition: "opacity 0.6s ease",
                  pointerEvents: greenReveal ? "auto" : "none",
                }}
              >
                <div className={s.towerWithBar}>
                  <div
                    className={s.valueBarWrap}
                    style={{
                      marginRight: disc3ValueBarGap,
                      opacity: greenReveal ? 1 : 0,
                      transition: "opacity 0.3s ease",
                    }}
                  >
                    <div className={s.valueBarRow}>
                      <span className={s.valueBarLabel}>
                        {COPY.barValueLabel}
                      </span>
                      <div
                        className={s.valueBar}
                        style={{
                          width: DISCS.valueBarW,
                          height: greenValueH,
                          background:
                            droppedGreen === N
                              ? GREEN_COLORS[N - 1].bright
                              : "rgba(176,168,154,0.55)",
                          transition:
                            "height 0.45s cubic-bezier(0.18,1.18,0.38,1), background-color 0s",
                        }}
                      />
                    </div>
                    <div
                      style={{ height: 29 + DISCS.riskBarH, flexShrink: 0 }}
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <div
                      className={[
                        s.sectionHead,
                        !greenReveal && s.sectionHeadHidden,
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    >
                      <p className={s.eyebrowGreen}>{COPY.eyebrowGreen}</p>
                      <h3 className={s.sectionTitle}>{COPY.titleGreen}</h3>
                    </div>
                    <DiscTower
                      discData={GREEN_DISC_DATA}
                      pxW={cd3TowerPxW}
                      pxH={cd3TowerPxH}
                      scale={CD3_SCALE}
                      initPositions={greenInitPositions}
                      dropped={droppedGreen}
                      fall={false}
                      collapseStyles={null}
                      activeI={droppedGreen - 1}
                      colors={DISC_GREENS}
                      discVars={DISC_VARS}
                      isGreen={true}
                    />
                    <div className={s.barArea} style={{ width: disc3RiskMaxW }}>
                      <div
                        className={s.riskBarWrap}
                        style={{ alignItems: greenRiskLabelAlign }}
                      >
                        <div className={s.riskBarLabel}>
                          <span className={s.riskBarTitle}>
                            {COPY.barGreenLabel}
                          </span>
                          <span className={s.riskBarPct}>
                            {droppedGreen}/{N}
                          </span>
                          {droppedGreen > 0 && (
                            <span
                              className={s.riskBarCat}
                              style={{
                                opacity: phase < DISC_PHASES - 1 ? 1 : 0,
                                transition: "opacity 0.6s ease",
                              }}
                            >
                              {ITEMS[greenTopI].category}
                            </span>
                          )}
                        </div>
                        <div
                          className={s.riskBar}
                          style={{
                            ...riskBarStyle(
                              greenBarW,
                              disc3RiskMaxW,
                              DISCS.greenRiskBarGrowDir,
                            ),
                            height: DISCS.riskBarH,
                            background: `linear-gradient(to right, ${GREEN_COLORS[Math.max(0, droppedGreen - 1)].bright}, ${GREEN_COLORS[Math.max(0, droppedGreen - 1)].dark})`,
                            opacity:
                              droppedGreen > 0
                                ? DISCS.barActiveOpacity
                                : DISCS.barIdleOpacity,
                            transition:
                              "transform 0.45s cubic-bezier(0.18,1.18,0.38,1), opacity 0.3s ease",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DiscTextCol
            items={ITEMS}
            dropped={dropped}
            droppedGreen={droppedGreen}
            activeI={activeI}
            phase={phase}
          />
        </div>
      </div>
    </div>
  );
}
