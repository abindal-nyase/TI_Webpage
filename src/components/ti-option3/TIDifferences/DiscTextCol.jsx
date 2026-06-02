import s from './TIDifferencesOption3.module.css'
import { N, DISC_PHASES } from './geometry.js'

export function DiscTextCol({ items, dropped, droppedGreen, activeI, phase }) {
  return (
    <div className={s.textCol}>
      {items.map((item, i) => {
        const on      = dropped > i
        const live    = i === activeI && on
        const posOn   = droppedGreen > i
        const posLive = i === droppedGreen - 1 && posOn
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
                    <span
                      className={[s.pencilIcon, posLive && s.pencilVisible].filter(Boolean).join(' ')}
                      style={i === N - 1 && phase >= DISC_PHASES - 1 ? { opacity: 0, transition: 'opacity 0.6s ease' } : undefined}
                      aria-hidden="true"
                    >
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
  )
}
