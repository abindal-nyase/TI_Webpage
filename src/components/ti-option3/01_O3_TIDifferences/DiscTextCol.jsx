import { useRef, useEffect } from 'react'
import s from './01_O3_TIDifferences.module.css'
import { N, DISC_PHASES } from './geometry.js'

export function DiscTextCol({ items, dropped, droppedGreen, activeI, phase }) {
  const colRef   = useRef(null)
  const innerRef = useRef(null)
  const cardRefs = useRef([])

  // Keep the current point centered in the pane as disks drop, by translating
  // the inner list — NOT native scroll — so a touch swipe still drives the
  // disks (window/Lenis) instead of being captured by the pane. Works in both
  // layouts: portrait's 50vh points pane, and landscape where the taller cards
  // would otherwise overflow 100vh. Clamped, so when everything fits it's a
  // no-op (translateY 0).
  function center() {
    const col = colRef.current, inner = innerRef.current
    if (!col || !inner) return
    const idx  = Math.max(0, (droppedGreen > 0 ? droppedGreen : dropped) - 1)
    const card = cardRefs.current[idx]
    if (!card) return
    // Use the pane's CONTENT box (clientHeight includes padding) so the last
    // card bottom-aligns flush instead of spilling past the pane by the padding
    // amount. card.offsetTop is relative to .textColInner (position:relative).
    const cs       = getComputedStyle(col)
    const visibleH = col.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom)
    const max      = Math.max(0, inner.offsetHeight - visibleH)
    const target   = card.offsetTop - (visibleH - card.offsetHeight) / 2
    const y        = Math.min(max, Math.max(0, target))
    inner.style.transform = `translateY(${-y}px)`
  }
  useEffect(center, [dropped, droppedGreen])
  // Keep a ref to the latest `center` so the resize/orientation listeners are
  // bound once but always run the current closure (fresh props), instead of
  // re-adding listeners on every render.
  const centerRef = useRef(center)
  centerRef.current = center
  useEffect(() => {
    const run = () => centerRef.current()
    window.addEventListener('resize', run)
    window.addEventListener('orientationchange', run)
    return () => {
      window.removeEventListener('resize', run)
      window.removeEventListener('orientationchange', run)
    }
  }, [])

  return (
    <div className={s.textCol} ref={colRef}>
     <div className={s.textColInner} ref={innerRef}>
      {items.map((item, i) => {
        const on      = dropped > i
        const live    = i === activeI && on
        const posOn   = droppedGreen > i
        const posLive = i === droppedGreen - 1 && posOn
        return (
          <div key={i} ref={el => (cardRefs.current[i] = el)} className={[s.discCard, on && s.discCardOn, live && s.discCardRed, posOn && s.discCardGreen].filter(Boolean).join(' ')}>
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
    </div>
  )
}
