import s from './TIDifferencesOption3.module.css'
import { TOWER_W, TOWER_H, FACE_H } from './geometry.js'

export function DiscTower({ discData, pxW, pxH, scale, initPositions, dropped, fall, collapseStyles, activeI, colors, discVars, isGreen, renderOverlay }) {
  return (
    <div className={s.towerOuter} style={{ width: pxW, height: pxH }}>
      <div className={s.towerInner} style={{ transform: `scale(${scale})` }}>
        <div className={s.tower} style={{ width: TOWER_W, height: TOWER_H }}>
          {discData.map((disc, i) => {
            const on   = dropped > i
            const live = i === activeI && on
            const cs   = fall && collapseStyles ? collapseStyles[i] : null
            return (
              <div
                key={i}
                className={[s.disc, on && s.discOn].filter(Boolean).join(' ')}
                style={{
                  left:            cs ? cs.left : initPositions[i].left,
                  top:             cs ? cs.top  : initPositions[i].top,
                  width:           disc.pxWidth,
                  transform:       cs ? cs.transform : undefined,
                  transformOrigin: `50% ${FACE_H / 2}px`,
                  transition:      fall ? 'none' : undefined,
                  zIndex:          i + 1,
                  '--f':           colors[i].face,
                  '--r':           colors[i].rim,
                  ...discVars,
                }}
              >
                <div className={[s.discFace, live && (isGreen ? s.discFaceLiveGreen : s.discFaceLive)].filter(Boolean).join(' ')}>
                  <span className={s.discNum}>{String(i + 1).padStart(2, '0')}</span>
                </div>
                <div className={s.discSide} />
                {renderOverlay?.(disc, i, on)}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
