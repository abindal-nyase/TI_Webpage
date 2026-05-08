import { useRef, useEffect, useState } from 'react'
import s from './ProblemsSolutions.module.css'

const ITEMS = [
  {
    category: 'Building Knowledge',
    neg: 'Treated as a generic structure — existing system not studied before design begins',
    pos: 'Structural system studied early so design reflects how the building actually works',
  },
  {
    category: 'Early Clarity',
    neg: 'Critical decisions made before structural constraints are understood',
    pos: "Structural input provided upfront — owners and architects know what's possible early",
  },
  {
    category: 'Design Quality',
    neg: 'Innovative ideas compromised when engineer cannot technically support the vision',
    pos: 'Architecture protected — structural solution is strong enough to support the design intent',
  },
  {
    category: 'Field Coordination',
    neg: 'Generic details cause conflicts during construction, leading to RFIs and delays',
    pos: 'Details tailored to actual site conditions — drawings are clear and practical to build',
  },
  {
    category: 'Plan Check',
    neg: "Slow or stalled approvals because drawings don't anticipate city requirements",
    pos: 'Review moves predictably — drawings are prepared to meet what the city expects',
  },
  {
    category: 'Fee Accuracy',
    neg: 'Low initial proposal hides scope gaps — add services and cost overruns follow',
    pos: 'Proposal reflects real scope from the start — clients avoid surprise costs',
  },
  {
    category: 'Communication',
    neg: 'Poor coordination between team members causes uncertainty and schedule loss',
    pos: 'Clear coordination across structural, architect, contractor, and owner — fewer delays',
  },
]

const N = ITEMS.length

// Shared hook: maps a scroll driver div to a 0..1 progress value
function useScrollProgress(ref) {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    function onScroll() {
      const el = ref.current
      if (!el) return
      const rect  = el.getBoundingClientRect()
      const range = el.offsetHeight - window.innerHeight
      if (range <= 0) return
      setProgress(Math.max(0, Math.min(1, -rect.top / range)))
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [ref])
  return progress
}

// ─────────────────────────────────────────────────────────────────────────────
// OPTION 1 — Per-item flip
// Problems appear one by one via scroll, then each flips to its solution.
// ─────────────────────────────────────────────────────────────────────────────
function Option1() {
  const driverRef = useRef(null)
  const progress  = useScrollProgress(driverRef)
  const PHASES    = 2 * N + 2
  const phase     = Math.min(PHASES - 1, Math.floor(progress * PHASES))

  const appearCount     = Math.min(phase, N)
  const flipCount       = Math.max(0, Math.min(N, phase - N - 1))
  const isFlipPhase     = phase > N
  const barValue        = (isFlipPhase ? flipCount : appearCount) / N * 100
  const activeFlipIndex = isFlipPhase ? flipCount - 1 : -1

  return (
    <div ref={driverRef} style={{ height: `${PHASES * 40}vh` }} className={s.optionDriver}>
      <div className={s.stickyScene}>
        <div className={`${s.sidebar} ${isFlipPhase ? s.sidebarPos : s.sidebarNeg}`}>
          <div className={s.eyebrowStack}>
            <span className={`${s.eyebrow} ${!isFlipPhase ? s.eyebrowOn : ''}`}>Common Problems</span>
            <span className={`${s.eyebrow} ${ isFlipPhase ? s.eyebrowOn : ''}`}>Done Right</span>
          </div>
          <h2 className={s.sideTitle}>
            <span className={`${s.titleLayer} ${!isFlipPhase ? s.titleOn : ''}`}>THE<br/>PROBLEM</span>
            <span className={`${s.titleLayer} ${ isFlipPhase ? s.titleOn : ''}`}>DONE<br/>RIGHT</span>
          </h2>
          <div className={s.progressWrap}>
            <div className={s.progressTrack}>
              <div className={`${s.progressFill} ${isFlipPhase ? s.fillPos : s.fillNeg}`} style={{ width: `${barValue}%` }} />
            </div>
            <span className={s.progressCount}>{isFlipPhase ? flipCount : appearCount}&thinsp;/&thinsp;{N}</span>
          </div>
        </div>

        <div className={s.rightPanel}>
          {ITEMS.map((item, i) => {
            const visible  = appearCount > i
            const flipped  = flipCount > i
            const isActive = i === activeFlipIndex
            return (
              <div key={i} className={`${s.item} ${visible ? s.itemOn : ''} ${isActive ? s.itemActive : ''}`}>
                <div className={`${s.dot} ${!visible ? s.dotOff : flipped ? s.dotPos : s.dotNeg}`} />
                <div className={s.itemContent}>
                  <div className={s.itemCat}>{item.category}</div>
                  <div className={s.layers}>
                    <div className={`${s.layer} ${!flipped ? s.layerOn : ''}`}>
                      <p className={s.itemText}>{item.neg}</p>
                    </div>
                    <div className={`${s.layer} ${flipped ? s.layerOn : ''}`}>
                      <p className={`${s.itemText} ${s.posText}`}>{item.pos}</p>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// OPTION 2 — Two-column sequential reveal
// Left column (problems) fills top-to-bottom, then right column (solutions).
// ─────────────────────────────────────────────────────────────────────────────
function Option2() {
  const driverRef  = useRef(null)
  const progress   = useScrollProgress(driverRef)
  const PHASES     = 2 * N + 2
  const phase      = Math.min(PHASES - 1, Math.floor(progress * PHASES))
  const leftCount  = Math.min(phase, N)
  const rightCount = Math.max(0, Math.min(N, phase - N - 1))

  return (
    <div ref={driverRef} style={{ height: `${PHASES * 40}vh` }} className={s.optionDriver}>
      <div className={s.sticky2Col}>

        {/* Left column */}
        <div className={s.col2Wrap}>
          <div className={`${s.col2Head} ${s.col2HeadNeg}`}>
            <span className={s.col2Label}>The problem</span>
            <div className={s.col2Bar}>
              <div className={`${s.col2BarFill} ${s.col2BarFillNeg}`} style={{ width: `${leftCount / N * 100}%` }} />
            </div>
          </div>
          <div className={s.col2List}>
            {ITEMS.map((item, i) => (
              <div key={i} className={`${s.col2Item} ${leftCount > i ? s.col2ItemOn : ''}`}>
                <div className={`${s.col2Dot} ${leftCount > i ? s.col2DotNeg : ''}`} />
                <div>
                  <div className={s.itemCat}>{item.category}</div>
                  <p className={s.itemText}>{item.neg}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className={`${s.col2Divider} ${rightCount > 0 ? s.col2DividerActive : ''}`} />

        {/* Right column */}
        <div className={s.col2Wrap}>
          <div className={`${s.col2Head} ${s.col2HeadPos} ${rightCount > 0 ? s.col2HeadActive : ''}`}>
            <span className={s.col2Label}>Done right</span>
            <div className={s.col2Bar}>
              <div className={`${s.col2BarFill} ${s.col2BarFillPos}`} style={{ width: `${rightCount / N * 100}%` }} />
            </div>
          </div>
          <div className={s.col2List}>
            {ITEMS.map((item, i) => (
              <div key={i} className={`${s.col2Item} ${s.col2ItemRight} ${rightCount > i ? s.col2ItemOn : ''}`}>
                <div className={`${s.col2Dot} ${rightCount > i ? s.col2DotPos : ''}`} />
                <div>
                  <div className={s.itemCat}>{item.category}</div>
                  <p className={`${s.itemText} ${s.posText}`}>{item.pos}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// OPTION 3 — Spotlight / full-screen one at a time
// One item fills the viewport. First N scroll steps = problems, next N = solutions.
// ─────────────────────────────────────────────────────────────────────────────
function Option3() {
  const driverRef = useRef(null)
  const progress  = useScrollProgress(driverRef)
  const PHASES    = 2 * N
  const phase     = Math.min(PHASES - 1, Math.floor(progress * PHASES))
  const itemIndex = phase % N
  const isPos     = phase >= N
  const item      = ITEMS[itemIndex]

  return (
    <div ref={driverRef} style={{ height: `${PHASES * 60}vh` }} className={s.optionDriver}>
      <div className={`${s.stickySpot} ${isPos ? s.stickySpotPos : s.stickySpotNeg}`}>

        <div className={s.spotTop}>
          <span className={s.spotNum}>{String(itemIndex + 1).padStart(2, '0')}&thinsp;/&thinsp;{String(N).padStart(2, '0')}</span>
          <span className={`${s.spotLabel} ${isPos ? s.spotLabelPos : s.spotLabelNeg}`}>
            {isPos ? 'Done right' : 'The problem'}
          </span>
        </div>

        <div className={s.spotCat}>{item.category}</div>

        <p key={`${itemIndex}-${isPos}`} className={`${s.spotBody} ${isPos ? s.spotBodyPos : s.spotBodyNeg}`}>
          {isPos ? item.pos : item.neg}
        </p>

        <div className={s.spotDots}>
          {ITEMS.map((_, i) => (
            <div key={i} className={`${s.spotDot}
              ${i === itemIndex ? (isPos ? s.spotDotPos : s.spotDotNeg) :
                i < itemIndex   ? s.spotDotPast : ''}`}
            />
          ))}
        </div>

      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// OPTION 4 — Alternating timeline
// Vertical spine in the centre. Each scroll step: neg side appears left,
// then pos side answers right, row by row.
// ─────────────────────────────────────────────────────────────────────────────
function Option4() {
  const driverRef = useRef(null)
  const progress  = useScrollProgress(driverRef)
  // 2 steps per row: neg then pos
  const PHASES    = 2 * N + 1
  const phase     = Math.min(PHASES - 1, Math.floor(progress * PHASES))
  const negCount  = Math.min(N, Math.ceil(phase / 2))
  const posCount  = Math.min(N, Math.floor(phase / 2))

  return (
    <div ref={driverRef} style={{ height: `${PHASES * 50}vh` }} className={s.optionDriver}>
      <div className={s.stickyTl}>

        <div className={s.tlHeaders}>
          <div className={`${s.tlHeader} ${s.tlHeaderNeg}`}>The problem</div>
          <div className={s.tlSpine} />
          <div className={`${s.tlHeader} ${s.tlHeaderPos}`}>Done right</div>
        </div>

        <div className={s.tlRows}>
          {ITEMS.map((item, i) => (
            <div key={i} className={s.tlRow}>
              <div className={`${s.tlCell} ${s.tlCellNeg} ${negCount > i ? s.tlCellOn : ''}`}>
                <div className={s.itemCat}>{item.category}</div>
                <p className={s.itemText}>{item.neg}</p>
              </div>
              <div className={s.tlNode}>
                <div className={`${s.tlDot}
                  ${negCount > i && posCount > i ? s.tlDotBoth :
                    negCount > i ? s.tlDotNeg : ''}`}
                />
              </div>
              <div className={`${s.tlCell} ${s.tlCellPos} ${posCount > i ? s.tlCellOn : ''}`}>
                <div className={s.itemCat}>{item.category}</div>
                <p className={`${s.itemText} ${s.posText}`}>{item.pos}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// ROOT
// ─────────────────────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
// OPTION 5 — Pencil rewriter
//
// 5 scroll steps per item:
//   step 0  →  problem visible, pencil arrives
//   step 1  →  strikethrough draws across bad text
//   step 2  →  correction handwritten below in green (both lines visible)
//   step 3  →  bad text collapses; correction slides up into place (green)
//   step 4  →  correction color + font normalise to match the rest of the list
//
// Total phases = 5 * N  (35 steps for 7 items)
// ─────────────────────────────────────────────────────────────────────────────
function Option5() {
  const driverRef = useRef(null)
  const progress  = useScrollProgress(driverRef)

  const STEPS_PER = 5
  const PHASES    = STEPS_PER * N
  const rawPhase  = Math.min(PHASES - 1, Math.floor(progress * PHASES))

  const activeIdx     = Math.min(N - 1, Math.floor(rawPhase / STEPS_PER))
  const micro         = rawPhase % STEPS_PER
  const resolvedCount = Math.floor(rawPhase / STEPS_PER)
  const currentItem   = ITEMS[activeIdx]

  return (
    <div ref={driverRef} style={{ height: `${PHASES * 50}vh` }} className={s.optionDriver}>
      <div className={s.stickyPencil}>

        {/* ── SIDEBAR ── */}
        <div className={s.pencilSidebar}>
          <div className={s.pencilSideInner}>
            <span className={s.pencilEyebrow}>Rewriting</span>
            <div className={s.pencilSideTitle}>{currentItem.category}</div>
            <div className={s.pencilProgressWrap}>
              <div className={s.pencilProgressTrack}>
                <div className={s.pencilProgressFill} style={{ width: `${(resolvedCount / N) * 100}%` }} />
              </div>
              <span className={s.pencilProgressCount}>{resolvedCount}&thinsp;/&thinsp;{N}</span>
            </div>
            <div className={`${s.pencilSideIcon} ${micro === 1 ? s.pencilSideStrike : micro >= 2 && micro <= 3 ? s.pencilSideWrite : ''}`}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
              </svg>
            </div>
            <div className={s.pencilSideStatus}>
              {micro === 0 && <span>arriving…</span>}
              {micro === 1 && <span className={s.pencilStatusNeg}>striking out</span>}
              {micro === 2 && <span className={s.pencilStatusPos}>writing fix</span>}
              {micro === 3 && <span className={s.pencilStatusPos}>settling…</span>}
              {micro === 4 && <span className={s.pencilStatusDone}>done ✓</span>}
            </div>
          </div>
        </div>

        {/* ── ITEM LIST ── */}
        <div className={s.pencilList}>
          {ITEMS.map((item, i) => {
            const itemStep = rawPhase - i * STEPS_PER

            const isStruck    = itemStep >= 1
            const showFix     = itemStep >= 2
            const isCollapsed = itemStep >= 3  // bad gone, fix in place
            const isNormal    = itemStep >= 4  // colour/font normalised
            const isActive    = i === activeIdx

            return (
              <div key={i} className={`${s.pencilRow} ${isActive ? s.pencilRowActive : ''}`}>

                {/* Bad block — collapses at step 3 */}
                <div className={`${s.pBadBlock} ${isCollapsed ? s.pBadBlockGone : ''}`}>
                  <div className={s.pBadInner}>
                    <span className={s.pencilCat}>{item.category}</span>
                    <span className={`${s.pBadText} ${isStruck ? s.pBadTextMuted : ''}`}>{item.neg}</span>
                    <svg className={`${s.pStrikeSvg} ${isStruck ? s.pStrikeOn : ''}`} preserveAspectRatio="none" viewBox="0 0 100 2">
                      <line x1="0" y1="1" x2="100" y2="1" stroke="#c94444" strokeWidth="2" strokeLinecap="round"
                        className={`${s.pStrikeLine} ${isStruck ? s.pStrikeLineOn : ''}`} />
                    </svg>
                  </div>
                </div>

                {/* Fix block — appears at step 2, settles at step 3, normalises at step 4 */}
                <div className={`${s.pFixBlock} ${showFix ? s.pFixBlockOn : ''}`}>
                  {/* category label only shown once bad is gone to avoid duplication */}
                  {isCollapsed && <span className={s.pencilCat}>{item.category}</span>}
                  <span className={`${s.pFixText} ${showFix ? s.pFixTextOn : ''} ${isNormal ? s.pFixTextNormal : ''}`}>
                    {item.pos}
                  </span>
                </div>

              </div>
            )
          })}
        </div>

      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// OPTION 6 — Redline markup
//
// Styled as an architect's redline drawing review. All items load as a
// "draft document" (faint, monospaced, blueprint tint). As you scroll, each
// item gets a red markup stamp ("REVISED"), the problem text is crossed with
// a diagonal red mark, and the corrected version types in below as a clean
// "amendment" — as if a senior engineer has reviewed and corrected the sheet.
//
// 3 steps per item:
//   step 0  →  item fades in as draft text
//   step 1  →  red diagonal slash + REVISED stamp animate in
//   step 2  →  amendment text types in below; item settles
// ─────────────────────────────────────────────────────────────────────────────
function Option6() {
  const driverRef = useRef(null)
  const progress  = useScrollProgress(driverRef)

  const STEPS_PER = 3
  const PHASES    = STEPS_PER * N
  const rawPhase  = Math.min(PHASES - 1, Math.floor(progress * PHASES))

  const activeIdx   = Math.min(N - 1, Math.floor(rawPhase / STEPS_PER))
  const micro       = rawPhase % STEPS_PER
  const draftCount  = Math.min(N, Math.ceil((rawPhase + 1) / STEPS_PER))
  const currentItem = ITEMS[activeIdx]
  const markupCount = Math.floor(rawPhase / STEPS_PER)

  return (
    <div ref={driverRef} style={{ height: `${PHASES * 55}vh` }} className={s.optionDriver}>
      <div className={s.stickyRedline}>

        {/* ── SIDEBAR ── */}
        <div className={s.redlineSidebar}>
          <div className={s.redlineSideInner}>
            <span className={s.redlineEyebrow}>Drawing Review</span>
            <h2 className={s.redlineSideTitle}>
              {micro >= 1 ? 'REVISED' : 'DRAFT'}
            </h2>
            <div className={s.redlineCatLabel}>{currentItem.category}</div>
            <div className={s.redlineProgressWrap}>
              <div className={s.redlineProgressTrack}>
                <div className={s.redlineProgressFill} style={{ width: `${(markupCount / N) * 100}%` }} />
              </div>
              <span className={s.redlineProgressCount}>{markupCount}&thinsp;/&thinsp;{N} reviewed</span>
            </div>
            {/* Red markup pen icon */}
            <div className={`${s.redlinePenIcon} ${micro >= 1 ? s.redlinePenActive : ''}`}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9"/>
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
              </svg>
            </div>
            <div className={s.redlineSideStatus}>
              {micro === 0 && <span className={s.redlineStatusDraft}>— draft —</span>}
              {micro === 1 && <span className={s.redlineStatusMark}>marking up</span>}
              {micro === 2 && <span className={s.redlineStatusAmend}>amending</span>}
            </div>
          </div>
        </div>

        {/* ── DOCUMENT PANEL ── */}
        <div className={s.redlineDoc}>
          {/* Document header rule */}
          <div className={s.redlineDocHeader}>
            <span className={s.redlineDocTitle}>TI Structural Review — Draft</span>
            <span className={s.redlineDocMeta}>NYA / {new Date().getFullYear()}</span>
          </div>

          <div className={s.redlineRows}>
            {ITEMS.map((item, i) => {
              const itemStep  = rawPhase - i * STEPS_PER
              const isDraft   = itemStep >= 0   // item visible as draft
              const isMarked  = itemStep >= 1   // red slash + stamp
              const isAmended = itemStep >= 2   // amendment text visible

              return (
                <div key={i} className={`${s.redlineRow} ${isDraft ? s.redlineRowOn : ''}`}>

                  {/* Row number */}
                  <span className={s.redlineRowNum}>{String(i + 1).padStart(2, '0')}</span>

                  {/* Main content */}
                  <div className={s.redlineContent}>
                    <span className={s.redlineCat}>{item.category}</span>

                    {/* Original draft text with diagonal slash */}
                    <div className={s.redlineDraftLine}>
                      <span className={`${s.redlineDraftText} ${isMarked ? s.redlineDraftStruck : ''}`}>
                        {item.neg}
                      </span>
                      {/* Diagonal slash SVG */}
                      <svg className={`${s.redlineSlash} ${isMarked ? s.redlineSlashOn : ''}`}
                        viewBox="0 0 100 100" preserveAspectRatio="none">
                        <line x1="0" y1="0" x2="100" y2="100"
                          stroke="#c94444" strokeWidth="1.5" strokeLinecap="round"
                          className={`${s.redlineSlashLine} ${isMarked ? s.redlineSlashLineOn : ''}`}
                        />
                      </svg>
                    </div>

                    {/* REVISED stamp */}
                    <div className={`${s.redlineStamp} ${isMarked ? s.redlineStampOn : ''}`}>
                      REVISED
                    </div>

                    {/* Amendment text */}
                    <div className={`${s.redlineAmend} ${isAmended ? s.redlineAmendOn : ''}`}>
                      <span className={s.redlineAmendLabel}>Amendment:</span>
                      <span className={`${s.redlineAmendText} ${isAmended ? s.redlineAmendTextOn : ''}`}>
                        {item.pos}
                      </span>
                    </div>
                  </div>

                </div>
              )
            })}
          </div>
        </div>

      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// OPTION 7 — Ink wash
// Problems bleed onto the page like ink soaking into paper (left-to-right
// clip reveal with a soft trailing edge). When the solution phase starts,
// a wipe moves left→right across the line, dissolving the bad text and
// revealing the solution underneath — like a wet cloth cleaning the page.
//
// 3 steps per item: appear → wipe starts → solution settled
// ─────────────────────────────────────────────────────────────────────────────
function Option7() {
  const driverRef = useRef(null)
  const progress  = useScrollProgress(driverRef)
  const STEPS_PER = 3
  const PHASES    = STEPS_PER * N
  const rawPhase  = Math.min(PHASES - 1, Math.floor(progress * PHASES))
  const activeIdx = Math.min(N - 1, Math.floor(rawPhase / STEPS_PER))
  const micro     = rawPhase % STEPS_PER
  const isFlipPhase = rawPhase >= N * 1   // once first item starts wiping

  return (
    <div ref={driverRef} style={{ height: `${PHASES * 50}vh` }} className={s.optionDriver}>
      <div className={s.stickyScene}>

        {/* sidebar reused from opt1 layout */}
        <div className={`${s.sidebar} ${rawPhase >= N ? s.sidebarPos : s.sidebarNeg}`}>
          <div className={s.eyebrowStack}>
            <span className={`${s.eyebrow} ${rawPhase < N ? s.eyebrowOn : ''}`}>Common Problems</span>
            <span className={`${s.eyebrow} ${rawPhase >= N ? s.eyebrowOn : ''}`}>Done Right</span>
          </div>
          <h2 className={s.sideTitle}>
            <span className={`${s.titleLayer} ${rawPhase < N ? s.titleOn : ''}`}>THE<br/>PROBLEM</span>
            <span className={`${s.titleLayer} ${rawPhase >= N ? s.titleOn : ''}`}>DONE<br/>RIGHT</span>
          </h2>
          <div className={s.progressWrap}>
            <div className={s.progressTrack}>
              <div
                className={`${s.progressFill} ${rawPhase >= N ? s.fillPos : s.fillNeg}`}
                style={{ width: `${(activeIdx / (N - 1)) * 100}%` }}
              />
            </div>
            <span className={s.progressCount}>{activeIdx + 1}&thinsp;/&thinsp;{N}</span>
          </div>
        </div>

        <div className={s.rightPanel}>
          {ITEMS.map((item, i) => {
            const itemStep = rawPhase - i * STEPS_PER
            const hasInked  = itemStep >= 0   // ink-bleed reveal
            const isWiping  = itemStep >= 1   // wipe begins
            const isWiped   = itemStep >= 2   // solution settled

            return (
              <div key={i} className={`${s.item} ${hasInked ? s.itemOn : ''}`}>
                <div className={`${s.dot} ${!hasInked ? s.dotOff : isWiped ? s.dotPos : s.dotNeg}`} />
                <div className={s.itemContent}>
                  <div className={s.itemCat}>{item.category}</div>
                  {/* Stacked layers — neg bleeds in, pos wipes in over it */}
                  <div className={s.inkWrap}>
                    <p className={`${s.inkNeg} ${hasInked ? s.inkNegOn : ''} ${isWiping ? s.inkNegWiped : ''}`}>
                      {item.neg}
                    </p>
                    <p className={`${s.inkPos} ${isWiping ? s.inkPosOn : ''}`}>
                      {item.pos}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// OPTION 8 — Typewriter
// Problems type onto the screen character by character with a blinking cursor.
// In the solution phase the cursor returns, backspaces the key "bad" phrase,
// then retypes the correction in its place — visible word-level surgery.
//
// Each item has: type-in (neg) → pause → backspace bad phrase → retype fix
// Implemented with CSS animations keyed off className additions.
// ─────────────────────────────────────────────────────────────────────────────
function Option8() {
  const driverRef = useRef(null)
  const progress  = useScrollProgress(driverRef)
  const STEPS_PER = 4
  const PHASES    = STEPS_PER * N
  const rawPhase  = Math.min(PHASES - 1, Math.floor(progress * PHASES))
  const activeIdx = Math.min(N - 1, Math.floor(rawPhase / STEPS_PER))
  const micro     = rawPhase % STEPS_PER

  return (
    <div ref={driverRef} style={{ height: `${PHASES * 50}vh` }} className={s.optionDriver}>
      <div className={s.stickyScene}>

        <div className={`${s.sidebar} ${rawPhase >= N * 2 ? s.sidebarPos : s.sidebarNeg}`}>
          <div className={s.eyebrowStack}>
            <span className={`${s.eyebrow} ${rawPhase < N * 2 ? s.eyebrowOn : ''}`}>Common Problems</span>
            <span className={`${s.eyebrow} ${rawPhase >= N * 2 ? s.eyebrowOn : ''}`}>Done Right</span>
          </div>
          <h2 className={s.sideTitle}>
            <span className={`${s.titleLayer} ${rawPhase < N * 2 ? s.titleOn : ''}`}>THE<br/>PROBLEM</span>
            <span className={`${s.titleLayer} ${rawPhase >= N * 2 ? s.titleOn : ''}`}>DONE<br/>RIGHT</span>
          </h2>
          <div className={s.progressWrap}>
            <div className={s.progressTrack}>
              <div
                className={`${s.progressFill} ${rawPhase >= N * 2 ? s.fillPos : s.fillNeg}`}
                style={{ width: `${(activeIdx / (N - 1)) * 100}%` }}
              />
            </div>
            <span className={s.progressCount}>{activeIdx + 1}&thinsp;/&thinsp;{N}</span>
          </div>
          {/* blinking cursor indicator */}
          <div className={s.twCursorSide}>
            <span className={s.twCursorBlink}>_</span>
            <span className={s.twSideLabel}>
              {micro === 0 && 'typing…'}
              {micro === 1 && 'reviewing…'}
              {micro === 2 && 'deleting…'}
              {micro === 3 && 'correcting…'}
            </span>
          </div>
        </div>

        <div className={s.rightPanel}>
          {ITEMS.map((item, i) => {
            const itemStep  = rawPhase - i * STEPS_PER
            const isTyped   = itemStep >= 0   // neg typed in
            const isPaused  = itemStep >= 1   // cursor at end, pausing
            const isDeleting = itemStep >= 2  // bad portion struck/deleted
            const isCorrected = itemStep >= 3 // fix typed in

            return (
              <div key={i} className={`${s.item} ${isTyped ? s.itemOn : ''}`}>
                <div className={`${s.dot} ${!isTyped ? s.dotOff : isCorrected ? s.dotPos : s.dotNeg}`} />
                <div className={s.itemContent}>
                  <div className={s.itemCat}>{item.category}</div>
                  <div className={s.twLine}>
                    {/* neg text — types in, then gets "deleted" (strikethrough + fade) */}
                    <span className={`${s.twNeg} ${isTyped ? s.twNegOn : ''} ${isDeleting ? s.twNegDeleted : ''}`}>
                      {item.neg}
                    </span>
                    {/* cursor between neg and pos */}
                    {(isPaused && !isCorrected) && (
                      <span className={s.twCursor}>|</span>
                    )}
                    {/* pos text — types in after deletion */}
                    {isDeleting && (
                      <span className={`${s.twPos} ${isCorrected ? s.twPosOn : ''}`}>
                        {item.pos}
                      </span>
                    )}
                    {isCorrected && <span className={s.twCursorDone}>|</span>}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// OPTION 9 — Chalkboard
// Dark green board. Problems appear written in rough chalk strokes (slightly
// offset, faint texture). An eraser smear wipes each line left→right, then
// the solution reappears written in cleaner, brighter chalk.
//
// 3 steps per item: chalk-write neg → eraser wipe → chalk-write pos
// ─────────────────────────────────────────────────────────────────────────────
function Option9() {
  const driverRef = useRef(null)
  const progress  = useScrollProgress(driverRef)
  const STEPS_PER = 3
  const PHASES    = STEPS_PER * N
  const rawPhase  = Math.min(PHASES - 1, Math.floor(progress * PHASES))
  const activeIdx = Math.min(N - 1, Math.floor(rawPhase / STEPS_PER))
  const micro     = rawPhase % STEPS_PER
  const resolvedCount = Math.floor(rawPhase / STEPS_PER)

  return (
    <div ref={driverRef} style={{ height: `${PHASES * 50}vh` }} className={s.optionDriver}>
      <div className={s.stickyChalk}>

        {/* Chalk sidebar */}
        <div className={s.chalkSidebar}>
          <span className={s.chalkEyebrow}>
            {rawPhase < N ? '— problems —' : '— solutions —'}
          </span>
          <h2 className={s.chalkTitle}>
            <span className={`${s.chalkTitleLayer} ${rawPhase < N ? s.chalkTitleOn : ''}`}>THE<br/>PROBLEM</span>
            <span className={`${s.chalkTitleLayer} ${rawPhase >= N ? s.chalkTitleOn : ''}`}>DONE<br/>RIGHT</span>
          </h2>
          <div className={s.chalkProgress}>
            <div className={s.chalkProgressFill} style={{ width: `${(resolvedCount / N) * 100}%` }} />
          </div>
          <span className={s.chalkCount}>{resolvedCount}&thinsp;/&thinsp;{N}</span>
          {/* Eraser icon */}
          <div className={`${s.chalkEraser} ${micro === 1 && rawPhase >= STEPS_PER - 1 ? s.chalkEraserActive : ''}`}>
            <svg width="28" height="18" viewBox="0 0 28 18" fill="none">
              <rect x="1" y="4" width="26" height="10" rx="2" stroke="currentColor" strokeWidth="1.2"/>
              <line x1="9" y1="4" x2="9" y2="14" stroke="currentColor" strokeWidth="1.2"/>
            </svg>
          </div>
        </div>

        {/* Chalkboard writing area */}
        <div className={s.chalkBoard}>
          {ITEMS.map((item, i) => {
            const itemStep   = rawPhase - i * STEPS_PER
            const hasWritten = itemStep >= 0
            const isErasing  = itemStep >= 1
            const isRewritten = itemStep >= 2

            return (
              <div key={i} className={`${s.chalkRow} ${hasWritten ? s.chalkRowOn : ''}`}>
                <div className={s.chalkCat}>{item.category}</div>
                <div className={s.chalkTextWrap}>
                  {/* Neg — chalk writing, erased */}
                  <p className={`${s.chalkNeg} ${hasWritten ? s.chalkNegOn : ''} ${isErasing ? s.chalkNegErased : ''}`}>
                    {item.neg}
                    {/* eraser wipe overlay */}
                    <span className={`${s.eraserWipe} ${isErasing ? s.eraserWipeOn : ''}`} />
                  </p>
                  {/* Pos — cleaner chalk, writes in after erase */}
                  <p className={`${s.chalkPos} ${isRewritten ? s.chalkPosOn : ''}`}>
                    {item.pos}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// OPTION 10 — Risk resolution (redesigned)
//
// Clean sidebar + list layout. No per-item bars.
// The sidebar holds a large architectural arc gauge — a single sweeping
// stroke that starts empty-red and fills to green as items resolve.
// A number counter climbs in the centre of the arc.
// Items appear and flip exactly as in Option 1 — the only drama is in
// the sidebar gauge, which carries all the tension.
//
// 2 steps per item: appear (neg) → flip (pos)
// ─────────────────────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
// OPTION 10 — Seismic waveform
//
// The sidebar shows a seismic readout: a horizontal baseline with a waveform
// that grows increasingly chaotic and red as each problem appears, then
// smooths back to a calm flat green line as solutions resolve — like watching
// structural stress build and release. On-brand for an engineering firm.
//
// The waveform is a procedural SVG polyline whose amplitude and frequency
// increase with appearCount and decrease with resolveCount.
// ─────────────────────────────────────────────────────────────────────────────
function Option10() {
  const driverRef  = useRef(null)
  const progress   = useScrollProgress(driverRef)
  const PHASES     = 2 * N + 2
  const rawPhase   = Math.min(PHASES - 1, Math.floor(progress * PHASES))

  const appearCount  = Math.min(N, rawPhase)
  const resolveCount = Math.max(0, Math.min(N, rawPhase - N - 1))
  const isResolvePh  = rawPhase > N

  // Waveform parameters
  const W = 160, H = 70, MID = H / 2
  const POINTS = 80

  // Tension: 0 at start, 1 at full problems, back to 0 at full resolved
  const tension = isResolvePh
    ? 1 - resolveCount / N
    : appearCount / N

  // Generate waveform points — amplitude and jaggedness scale with tension
  const wavePoints = Array.from({ length: POINTS }, (_, i) => {
    const x = (i / (POINTS - 1)) * W
    const freq = 1 + tension * 5          // 1 → 6 cycles
    const amp  = tension * (MID * 0.72)   // 0 → ~25px
    // Add some irregularity with a second harmonic
    const y = MID
      + Math.sin((i / (POINTS - 1)) * Math.PI * 2 * freq) * amp
      + Math.sin((i / (POINTS - 1)) * Math.PI * 2 * freq * 2.3) * amp * 0.35
    return `${x.toFixed(1)},${y.toFixed(1)}`
  }).join(' ')

  // Colour: grey → red (loading) → red → green (resolving)
  let waveColor
  if (tension === 0 && !isResolvePh) {
    waveColor = 'rgba(255,255,255,0.15)'
  } else if (!isResolvePh) {
    waveColor = `hsl(0,${40 + tension * 36}%,${32 + tension * 14}%)`
  } else {
    const t = resolveCount / N
    waveColor = t < 0.5
      ? `hsl(${t * 60},68%,42%)`
      : `hsl(${60 + (t - 0.5) * 140},62%,42%)`
  }

  // Label
  const statusLabel = isResolvePh
    ? resolveCount === N ? 'signal stable' : `${N - resolveCount} issues remaining`
    : appearCount === 0 ? 'monitoring…'
    : appearCount === N ? 'critical load'
    : `${appearCount} of ${N} issues`

  return (
    <div ref={driverRef} style={{ height: `${PHASES * 52}vh` }} className={s.optionDriver}>
      <div className={s.stickyScene}>

        <div className={`${s.sidebar} ${isResolvePh ? s.sidebarPos : s.sidebarNeg}`}>
          <div className={s.eyebrowStack}>
            <span className={`${s.eyebrow} ${!isResolvePh ? s.eyebrowOn : ''}`}>Structural Load</span>
            <span className={`${s.eyebrow} ${ isResolvePh ? s.eyebrowOn : ''}`}>Load Resolved</span>
          </div>
          <h2 className={s.sideTitle}>
            <span className={`${s.titleLayer} ${!isResolvePh ? s.titleOn : ''}`}>UNDER<br/>LOAD</span>
            <span className={`${s.titleLayer} ${ isResolvePh ? s.titleOn : ''}`}>LOAD<br/>CLEAR</span>
          </h2>

          <div className={s.circleDivider} />

          {/* Seismic readout */}
          <div className={s.seismicWrap}>
            <svg
              viewBox={`0 0 ${W} ${H}`}
              className={s.seismicSvg}
              preserveAspectRatio="none"
            >
              {/* Baseline grid lines */}
              <line x1="0" y1={MID} x2={W} y2={MID} className={s.seismicBaseline} />
              <line x1="0" y1={MID * 0.35} x2={W} y2={MID * 0.35} className={s.seismicGrid} />
              <line x1="0" y1={MID * 1.65} x2={W} y2={MID * 1.65} className={s.seismicGrid} />
              {/* Waveform */}
              <polyline
                points={wavePoints}
                fill="none"
                stroke={waveColor}
                strokeWidth="1.5"
                strokeLinejoin="round"
                strokeLinecap="round"
                style={{ transition: 'stroke 0.6s ease' }}
              />
            </svg>
            {/* Y-axis label */}
            <div className={s.seismicLabel}>
              <span className={s.seismicAxis}>displacement</span>
              <span className={s.seismicStatus} style={{ color: waveColor, transition: 'color 0.6s ease' }}>
                {statusLabel}
              </span>
            </div>
          </div>

        </div>

        <div className={s.rightPanel}>
          {ITEMS.map((item, i) => {
            const visible = appearCount > i
            const flipped = resolveCount > i
            return (
              <div key={i} className={`${s.item} ${visible ? s.itemOn : ''}`}>
                <div className={`${s.dot} ${!visible ? s.dotOff : flipped ? s.dotPos : s.dotNeg}`} />
                <div className={s.itemContent}>
                  <div className={s.itemCat}>{item.category}</div>
                  <div className={s.layers}>
                    <div className={`${s.layer} ${!flipped ? s.layerOn : ''}`}>
                      <p className={s.itemText}>{item.neg}</p>
                    </div>
                    <div className={`${s.layer} ${flipped ? s.layerOn : ''}`}>
                      <p className={`${s.itemText} ${s.posText}`}>{item.pos}</p>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// OPTION 11 — Load ring with a crack
// Same charging circle, but when the ring hits full red a crack tears open
// at the top (gap + lightning bolt glyph) before the correction phase seals
// it and re-colours it green. On-brand for structural engineering.
// ─────────────────────────────────────────────────────────────────────────────
function Option11() {
  const driverRef  = useRef(null)
  const progress   = useScrollProgress(driverRef)
  const PHASES     = 2 * N + 2
  const rawPhase   = Math.min(PHASES - 1, Math.floor(progress * PHASES))

  const appearCount  = Math.min(N, rawPhase)
  const resolveCount = Math.max(0, Math.min(N, rawPhase - N - 1))
  const isResolvePh  = rawPhase > N
  const isFullRed    = appearCount === N && rawPhase === N

  const R = 46, CX = 60, CY = 60
  const CIRC = 2 * Math.PI * R

  // Gap opens at the top when fully loaded
  const crackGap   = isFullRed ? 22 : 0
  const fillDash   = isResolvePh
    ? `${CIRC} 0`
    : isFullRed
      ? `${CIRC - crackGap} ${crackGap}`
      : `${CIRC * (appearCount / N)} ${CIRC}`

  let strokeColor
  if (appearCount === 0) {
    strokeColor = 'rgba(255,255,255,0.1)'
  } else if (!isResolvePh) {
    const t = appearCount / N
    strokeColor = `hsl(0,${35 + t * 40}%,${28 + t * 15}%)`
  } else {
    const t = resolveCount / N
    strokeColor = t < 0.5
      ? `hsl(${t * 60},70%,42%)`
      : `hsl(${60 + (t - 0.5) * 140},65%,42%)`
  }

  const centreNum = isResolvePh ? resolveCount : appearCount

  return (
    <div ref={driverRef} style={{ height: `${PHASES * 52}vh` }} className={s.optionDriver}>
      <div className={s.stickyScene}>

        <div className={`${s.sidebar} ${isResolvePh ? s.sidebarPos : s.sidebarNeg}`}>
          <div className={s.eyebrowStack}>
            <span className={`${s.eyebrow} ${!isResolvePh ? s.eyebrowOn : ''}`}>Structural Risk</span>
            <span className={`${s.eyebrow} ${ isResolvePh ? s.eyebrowOn : ''}`}>Resolved</span>
          </div>
          <h2 className={s.sideTitle}>
            <span className={`${s.titleLayer} ${!isResolvePh ? s.titleOn : ''}`}>UNDER<br/>STRESS</span>
            <span className={`${s.titleLayer} ${ isResolvePh ? s.titleOn : ''}`}>DONE<br/>RIGHT</span>
          </h2>

          <div className={s.circleDivider} />

          <div className={s.circleWrap}>
            <svg viewBox="0 0 120 120" className={s.circleSvg}>
              {/* Ghost track */}
              <circle cx={CX} cy={CY} r={R} className={s.circleTrack} />
              {/* Load ring */}
              <circle
                cx={CX} cy={CY} r={R}
                className={s.circleFill}
                style={{
                  stroke: strokeColor,
                  strokeDasharray: fillDash,
                  strokeDashoffset: 0,
                  transition: isFullRed
                    ? 'stroke-dasharray 0.45s ease 0.15s, stroke 0.6s ease'
                    : isResolvePh
                      ? 'stroke-dasharray 0.5s ease, stroke 0.65s ease'
                      : 'stroke-dasharray 0.5s ease, stroke 0.65s ease',
                }}
              />
              {/* Crack bolt — only at full-red */}
              {isFullRed && (
                <polyline
                  className={s.crackBolt}
                  points={`${CX - 2},${CY - R - 4} ${CX - 6},${CY - R + 7} ${CX + 2},${CY - R + 7} ${CX - 4},${CY - R + 20}`}
                  fill="none"
                  stroke={strokeColor}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}
              {/* Number centred */}
              <text x={CX} y={CY} className={s.circleNum}
                style={{ fill: strokeColor, transition: 'fill 0.65s ease' }}>
                <tspan x={CX} dy="-0.15em" className={s.circleNumBig}>{centreNum}</tspan>
                <tspan x={CX} dy="1.45em" className={s.circleDenom}>of {N}</tspan>
              </text>
            </svg>
          </div>

          <div className={s.circleStatus}>
            {!isResolvePh && appearCount === 0 && <span className={s.circleStatusNeg}>loading…</span>}
            {!isResolvePh && appearCount > 0 && appearCount < N && <span className={s.circleStatusNeg}>{N - appearCount} more to surface</span>}
            {isFullRed && <span className={s.circleStatusFull}>critical — review required</span>}
            {isResolvePh && resolveCount < N && <span className={s.circleStatusMid}>{N - resolveCount} remaining</span>}
            {isResolvePh && resolveCount === N && <span className={s.circleStatusDone}>structure resolved</span>}
          </div>
        </div>

        <div className={s.rightPanel}>
          {ITEMS.map((item, i) => {
            const visible = appearCount > i
            const flipped = resolveCount > i
            return (
              <div key={i} className={`${s.item} ${visible ? s.itemOn : ''}`}>
                <div className={`${s.dot} ${!visible ? s.dotOff : flipped ? s.dotPos : s.dotNeg}`} />
                <div className={s.itemContent}>
                  <div className={s.itemCat}>{item.category}</div>
                  <div className={s.layers}>
                    <div className={`${s.layer} ${!flipped ? s.layerOn : ''}`}>
                      <p className={s.itemText}>{item.neg}</p>
                    </div>
                    <div className={`${s.layer} ${flipped ? s.layerOn : ''}`}>
                      <p className={`${s.itemText} ${s.posText}`}>{item.pos}</p>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </div>
  )
}





// ─────────────────────────────────────────────────────────────────────────────
// OPTION 12 — Load Column: gradual crush → sudden buckling snap
//
// A slender I-section column in the sidebar. As problems load:
//   Phase 1: the column slowly shortens and barrels (compression distortion)
//   At full load: it snaps to a buckled S-curve in one frame
// As solutions resolve the column straightens and lengthens back.
// ─────────────────────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
// OPTION 12 — Column: gradual compression → sudden arc buckle
//
// Rectangle viewed from the side (simply supported, hinged top & bottom).
// Buckled shape = half-sine arc (one bow, not S-shape).
// Phase 1: column slowly shortens as load builds.
// At full load: SNAPS to bowed arc.
// Resolution: arc recovers gradually.
// ─────────────────────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
// OPTION 12 — Column: gradual compression → sudden arc buckle
//
// Rectangle viewed from the side. Simply supported (hinged top & bottom).
// Buckled shape = half-sine arc: mid-point bows sideways, ends stay fixed.
// The column is drawn as four explicit points with bezier-bowed long edges.
// Phase 1: column shortens slightly as load builds.
// At full load: snaps to bowed shape.
// Resolution: recovers gradually.
// ─────────────────────────────────────────────────────────────────────────────
function Option12() {
  const driverRef  = useRef(null)
  const progress   = useScrollProgress(driverRef)
  const PHASES     = 2 * N + 2
  const rawPhase   = Math.min(PHASES - 1, Math.floor(progress * PHASES))
  const appearCount  = Math.min(N, rawPhase)
  const resolveCount = Math.max(0, Math.min(N, rawPhase - N - 1))
  const isResolvePh  = rawPhase > N
  const isBuckled    = rawPhase >= N

  const CW = 80, CH = 220, cx = CW / 2
  const colW = 16           // visible width of the rectangle
  const topY = 22, botY = CH - 32

  // Phase 1: compression shortens the column slightly
  const loadT = appearCount / N
  const compression = isBuckled ? 0.05 : loadT * 0.05
  const colH  = (botY - topY) * (1 - compression)
  const cTopY = topY + ((botY - topY) - colH) / 2
  const cBotY = cTopY + colH
  const midY  = (cTopY + cBotY) / 2

  // Bow amplitude — half-sine buckle. Both edges bow the SAME direction.
  const MAX_BOW = 20
  const bowAmp = isBuckled
    ? isResolvePh ? MAX_BOW * Math.max(0, 1 - resolveCount / N) : MAX_BOW
    : 0

  // Column corners (unbowed)
  const x0 = cx - colW / 2   // left edge x
  const x1 = cx + colW / 2   // right edge x

  // Correct bowed rectangle:
  // Top-left → bottom-left: left edge bows LEFT (control point x = x0 - bowAmp)
  // Bottom-left → bottom-right: straight horizontal
  // Bottom-right → top-right: right edge bows LEFT (same direction as left edge)
  // Top-right → top-left: straight horizontal
  //
  // This gives a banana shape bowing to the left — correct first buckling mode.
  const colPath = bowAmp < 0.5
    ? `M ${x0},${cTopY} L ${x0},${cBotY} L ${x1},${cBotY} L ${x1},${cTopY} Z`
    : `M ${x0},${cTopY}
       Q ${x0 - bowAmp},${midY} ${x0},${cBotY}
       L ${x1},${cBotY}
       Q ${x1 - bowAmp},${midY} ${x1},${cTopY}
       Z`

  let colColor
  if (!isBuckled) {
    if (loadT === 0) {
      colColor = 'hsl(220,12%,58%)'                          // cool grey at zero load
    } else {
      // Grey → yellow (60°) → orange (30°) → red (0°)
      const hue = Math.max(0, 60 - loadT * 60)
      const sat = 25 + loadT * 50
      const lit = 58 - loadT * 18
      colColor = `hsl(${hue},${sat}%,${lit}%)`
    }
  } else if (!isResolvePh) {
    colColor = 'hsl(0,72%,40%)'                              // full red at buckle
  } else {
    // Unloading: red (0°) → green (140°)
    const t   = resolveCount / N
    const hue = t * 140                                      // 0° → 140°
    const sat = 68
    const lit = 40 + t * 5
    colColor = `hsl(${hue},${sat}%,${lit}%)`
  }

  const pathTransition = (isBuckled && !isResolvePh)
    ? 'fill 0.2s ease' : 'fill 0.5s ease'

  const statusLabel = !isBuckled
    ? appearCount === 0 ? 'unloaded' : `compressing… ${appearCount}/${N}`
    : !isResolvePh ? '⚠ Euler load exceeded'
    : resolveCount === N ? 'column straight' : `recovering ${resolveCount}/${N}`

  return (
    <div ref={driverRef} style={{ height: `${PHASES * 52}vh` }} className={s.optionDriver}>
      <div className={s.stickyScene}>
        <div className={`${s.sidebar} ${isResolvePh ? s.sidebarPos : s.sidebarNeg}`}>
          <div className={s.eyebrowStack}>
            <span className={`${s.eyebrow} ${!isResolvePh ? s.eyebrowOn : ''}`}>Axial Load</span>
            <span className={`${s.eyebrow} ${ isResolvePh ? s.eyebrowOn : ''}`}>Load Released</span>
          </div>
          <h2 className={s.sideTitle}>
            <span className={`${s.titleLayer} ${!isResolvePh ? s.titleOn : ''}`}>COLUMN<br/>LOAD</span>
            <span className={`${s.titleLayer} ${ isResolvePh ? s.titleOn : ''}`}>LOAD<br/>CLEAR</span>
          </h2>
          <div className={s.circleDivider} />
          <div className={s.structWrap}>
            <svg viewBox={`0 0 ${CW} ${CH}`} className={s.structSvg}>
              {/* Load arrow */}
              {loadT > 0 && (
                <g opacity={Math.min(1, loadT * 3)}>
                  <line x1={cx} y1="4" x2={cx} y2={cTopY - 5}
                    stroke={colColor} strokeWidth="1.2" strokeDasharray="3 2" />
                  <polygon points={`${cx},${cTopY} ${cx-4},${cTopY-8} ${cx+4},${cTopY-8}`} fill={colColor} />
                </g>
              )}
              {/* Column body — rectangle with bowed long edges */}
              <path d={colPath} fill={colColor} style={{ transition: pathTransition }} />
              {/* Hinge pins — circles at top and bottom centre */}
              <circle cx={cx} cy={cTopY} r="3.5" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1.2" />
              <circle cx={cx} cy={cBotY} r="3.5" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1.2" />
              {/* Base plate */}
              <line x1={cx-14} y1={cBotY+7} x2={cx+14} y2={cBotY+7}
                stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />
              {/* δ deflection label */}
              {bowAmp > 3 && (
                <text x={x0 - bowAmp - 5} y={midY + 4}
                  style={{ fill: colColor, fontSize: '8px', textAnchor: 'end',
                    fontFamily: 'IBM Plex Mono,monospace', transition: 'fill 0.3s ease' }}>
                  δ
                </text>
              )}
            </svg>
            <div className={s.structStatus} style={{ color: colColor, transition: 'color 0.5s ease' }}>
              {statusLabel}
            </div>
          </div>
        </div>

        <div className={s.rightPanel}>
          {ITEMS.map((item, i) => {
            const visible = appearCount > i, flipped = resolveCount > i
            return (
              <div key={i} className={`${s.item} ${visible ? s.itemOn : ''}`}>
                <div className={`${s.dot} ${!visible ? s.dotOff : flipped ? s.dotPos : s.dotNeg}`} />
                <div className={s.itemContent}>
                  <div className={s.itemCat}>{item.category}</div>
                  <div className={s.layers}>
                    <div className={`${s.layer} ${!flipped ? s.layerOn : ''}`}><p className={s.itemText}>{item.neg}</p></div>
                    <div className={`${s.layer} ${flipped ? s.layerOn : ''}`}><p className={`${s.itemText} ${s.posText}`}>{item.pos}</p></div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// OPTION 13 — Column: perfect straight → instant arc snap
//
// Same rectangle, hinged both ends. Stays perfectly straight while problems
// load. At full load snaps INSTANTLY to a half-sine bow. Recovery is gradual.
// Sidebar stress bars recolour green one by one as issues resolve.
// ─────────────────────────────────────────────────────────────────────────────
function Option13() {
  const driverRef  = useRef(null)
  const progress   = useScrollProgress(driverRef)
  const PHASES     = 2 * N + 2
  const rawPhase   = Math.min(PHASES - 1, Math.floor(progress * PHASES))
  const appearCount  = Math.min(N, rawPhase)
  const resolveCount = Math.max(0, Math.min(N, rawPhase - N - 1))
  const isResolvePh  = rawPhase > N
  const isBuckled    = rawPhase >= N

  const CW = 80, CH = 200, cx = CW / 2
  const colW = 16, topY = 18, botY = CH - 22
  const midY = (topY + botY) / 2
  const x0 = cx - colW / 2
  const x1 = cx + colW / 2

  const MAX_BOW = 24
  const bowAmp = isBuckled
    ? isResolvePh ? MAX_BOW * Math.max(0, 1 - resolveCount / N) : MAX_BOW
    : 0

  // Same correct rectangle path as Option12
  const colPath = bowAmp < 0.5
    ? `M ${x0},${topY} L ${x0},${botY} L ${x1},${botY} L ${x1},${topY} Z`
    : `M ${x0},${topY}
       Q ${x0 - bowAmp},${midY} ${x0},${botY}
       L ${x1},${botY}
       Q ${x1 - bowAmp},${midY} ${x1},${topY}
       Z`

  const stressT = appearCount / N
  let colColor
  if (!isBuckled) {
    colColor = `hsl(210,${10 + stressT * 8}%,${60 - stressT * 25}%)`
  } else if (!isResolvePh) {
    colColor = '#b84040'
  } else {
    const t = resolveCount / N
    colColor = t < 0.5 ? `hsl(${t * 60},68%,42%)` : `hsl(${60 + (t - 0.5) * 140},60%,42%)`
  }

  // Instant snap on buckle (no CSS transition for d), smooth recovery
  const pathTransition = (isBuckled && !isResolvePh && bowAmp === MAX_BOW)
    ? 'fill 0.15s ease' : 'fill 0.4s ease'

  const statusLabel = !isBuckled
    ? appearCount === 0 ? 'pre-load — stable' : `holding… ${appearCount}/${N} risks`
    : !isResolvePh ? '⚠ Euler load exceeded — buckled'
    : resolveCount === N ? 'column restored' : `recovering ${resolveCount}/${N}`

  return (
    <div ref={driverRef} style={{ height: `${PHASES * 52}vh` }} className={s.optionDriver}>
      <div className={s.stickyScene}>
        <div className={`${s.sidebar} ${isResolvePh ? s.sidebarPos : s.sidebarNeg}`}>
          <div className={s.eyebrowStack}>
            <span className={`${s.eyebrow} ${!isResolvePh ? s.eyebrowOn : ''}`}>Buckling Risk</span>
            <span className={`${s.eyebrow} ${ isResolvePh ? s.eyebrowOn : ''}`}>Recovered</span>
          </div>
          <h2 className={s.sideTitle}>
            <span className={`${s.titleLayer} ${!isResolvePh ? s.titleOn : ''}`}>EULER<br/>SNAP</span>
            <span className={`${s.titleLayer} ${ isResolvePh ? s.titleOn : ''}`}>LOAD<br/>CLEAR</span>
          </h2>
          <div className={s.circleDivider} />

          {/* Stress bars: amber→red while loading; green one-by-one as resolving */}
          <div className={s.stressStack}>
            {Array.from({ length: N }, (_, i) => {
              const isLoaded   = appearCount > i
              const isResolved = resolveCount > i
              let bg
              if (!isLoaded) {
                bg = 'rgba(255,255,255,0.05)'
              } else if (isResolved) {
                const gT = (resolveCount - i) / N
                bg = `hsl(${80 + gT * 60},55%,${35 + gT * 10}%)`
              } else {
                bg = `hsl(${30 - (i / (N-1)) * 30},${55 + (i / (N-1)) * 25}%,${48 - (i / (N-1)) * 12}%)`
              }
              return <div key={i} className={s.stressBar} style={{ background: bg, transition: 'background 0.45s ease' }} />
            })}
          </div>

          <div className={s.structWrap}>
            <svg viewBox={`0 0 ${CW} ${CH}`} className={s.structSvg}>
              <path d={colPath} fill={colColor} style={{ transition: pathTransition }} />
              <circle cx={cx} cy={topY} r="3.5" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1.2" />
              <circle cx={cx} cy={botY} r="3.5" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1.2" />
              <line x1={cx-14} y1={botY+6} x2={cx+14} y2={botY+6}
                stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />
              {bowAmp > 3 && (
                <text x={x0 - bowAmp - 4} y={midY + 4}
                  style={{ fill: colColor, fontSize: '8px', textAnchor: 'end',
                    fontFamily: 'IBM Plex Mono,monospace', transition: 'fill 0.3s ease' }}>
                  δ
                </text>
              )}
            </svg>
            <div className={s.structStatus} style={{ color: colColor, transition: 'color 0.4s ease' }}>
              {statusLabel}
            </div>
          </div>
        </div>

        <div className={s.rightPanel}>
          {ITEMS.map((item, i) => {
            const visible = appearCount > i, flipped = resolveCount > i
            return (
              <div key={i} className={`${s.item} ${visible ? s.itemOn : ''}`}>
                <div className={`${s.dot} ${!visible ? s.dotOff : flipped ? s.dotPos : s.dotNeg}`} />
                <div className={s.itemContent}>
                  <div className={s.itemCat}>{item.category}</div>
                  <div className={s.layers}>
                    <div className={`${s.layer} ${!flipped ? s.layerOn : ''}`}><p className={s.itemText}>{item.neg}</p></div>
                    <div className={`${s.layer} ${flipped ? s.layerOn : ''}`}><p className={`${s.itemText} ${s.posText}`}>{item.pos}</p></div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// OPTION 14 — Shear-dominated RC deep beam (renamed from 15)
//
// Corrections:
//   - Both top AND bottom edges sag (antisymmetric, parabolic)
//   - Cracks that would intersect stop at the intersection — only the
//     dominant (taller) one continues past that point
//   - At full load, one existing crack suddenly EXTENDS into the
//     critical diagonal failure — not a new crack
// ─────────────────────────────────────────────────────────────────────────────
function Option15() {   // kept as Option15() for backward compat; displayed as "Option 14"
  const driverRef  = useRef(null)
  const progress   = useScrollProgress(driverRef)
  const PHASES     = 2 * N + 2
  const rawPhase   = Math.min(PHASES - 1, Math.floor(progress * PHASES))
  const appearCount  = Math.min(N, rawPhase)
  const resolveCount = Math.max(0, Math.min(N, rawPhase - N - 1))
  const isResolvePh  = rawPhase > N

  const BW = 200, BH = 100
  const topEdge0 = 10    // top edge at rest
  const botEdge0 = BH - 12   // bottom edge at rest
  const beamH    = botEdge0 - topEdge0   // ~78px

  const loadT    = appearCount / N
  const resolveT = isResolvePh ? resolveCount / N : 0
  const maxCracks = N * 2   // 14

  const crackCount = isResolvePh
    ? Math.max(0, Math.round(maxCracks * (1 - resolveT)))
    : Math.round(maxCracks * loadT)

  const MAX_DEPTH  = beamH * 0.82
  const crackDepth = isResolvePh
    ? MAX_DEPTH * Math.max(0, 1 - resolveT)
    : MAX_DEPTH * loadT

  // Sag: both top and bottom deflect, beam curves as a whole
  // Bottom sags DOWN more, top sags DOWN a little (antisymmetric bending)
  const MAX_BOT_SAG = 10
  const MAX_TOP_SAG = 4    // top also moves down, but less
  const botSag = isResolvePh ? MAX_BOT_SAG * (1 - resolveT) : MAX_BOT_SAG * loadT
  const topSag = isResolvePh ? MAX_TOP_SAG * (1 - resolveT) : MAX_TOP_SAG * loadT

  // Parabolic sag profiles
  const parab = (x, amp) => amp * 4 * ((x - 4) / (BW - 8)) * (1 - (x - 4) / (BW - 8))
  const botAt  = x => botEdge0 + parab(x, botSag)
  const topAt  = x => topEdge0 + parab(x, topSag)

  // ── Build crack definitions ──
  // All 14 crack positions defined upfront (deterministic by index).
  // Each crack has a fixed x, and grows in depth/height as loadT increases.
  // ORDER: sorted by spread (centre first, ends last) so slice(0, crackCount)
  // reveals cracks centre → outward symmetrically on both sides at once.
  const ALL_CRACKS = maxCracks
  const half0 = Math.floor(ALL_CRACKS / 2)

  // Build all crack definitions sorted centre-outward
  // Pair index 0 = the two centre-most cracks, pair index N-1 = outermost pair
  const allCrackDefs = []
  for (let pair = 0; pair < half0; pair++) {
    const spread = half0 > 1 ? pair / (half0 - 1) : 0
    const innerMargin = BW * 0.11
    const halfSpan = (BW / 2 - innerMargin)

    // Left crack of this pair
    const xL = BW / 2 - (pair + 0.5) * (halfSpan / half0)
    // Right crack of this pair
    const xR = BW / 2 + (pair + 0.5) * (halfSpan / half0)

    const depthFrac = 0.4 + spread * 0.6
    const angleRad  = (5 + spread * 47) * Math.PI / 180

    allCrackDefs.push({ ci: pair * 2,     x: xL, spread, depthFrac, angleRad, sign:  1 })  // left leans right
    allCrackDefs.push({ ci: pair * 2 + 1, x: xR, spread, depthFrac, angleRad, sign: -1 })  // right leans left
  }

  // Which crack index becomes the failure crack (outermost on right side)
  const FAILURE_IDX = ALL_CRACKS - 1

  // ── Compute rendered crack geometry ──
  // End cracks are longer AND more inclined inward, so their tops
  // converge toward the beam centre without crossing each other.
  const renderedCracks = allCrackDefs.slice(0, crackCount).map(({ ci, idx, spread, x, depthFrac, angleRad, sign }) => {
    const localBotY = botAt(x)
    const localTopY = topAt(x)

    const d = Math.min(crackDepth * depthFrac, beamH * 0.88)
    const hOffset  = d * Math.tan(angleRad)
    const crackTopX = Math.max(6, Math.min(BW - 6, x + sign * hOffset))
    const crackTopY = Math.max(localTopY + 2, localBotY - d)

    const jag  = Math.sin(ci * 2.3) * 1.4
    const midX = (x + crackTopX) / 2 + jag
    const midY = (localBotY + crackTopY) / 2

    return { ci, x, crackBotY: localBotY, midX, midY, crackTopX, crackTopY, spread }
  })

  // ── Failure crack: outermost right crack (last in renderedCracks when at full load) ──
  const showCritical = appearCount === N && !isResolvePh
  // Find the rightmost crack (highest x) among rendered cracks
  const failureCrack = showCritical && renderedCracks.length > 0
    ? renderedCracks.reduce((best, c) => c.x > best.x ? c : best, renderedCracks[0])
    : null

  // Beam outline — both top and bottom are curved beziers
  const beamPath = [
    `M 4,${topEdge0}`,
    `Q ${BW/2},${topEdge0 + topSag} ${BW-4},${topEdge0}`,   // top edge bows down
    `L ${BW-4},${botEdge0}`,
    `Q ${BW/2},${botEdge0 + botSag} 4,${botEdge0}`,           // bottom edge bows down more
    `Z`
  ].join(' ')

  const clipId    = 'beamClip14'
  const crackColor = isResolvePh
    ? `hsla(140,45%,48%,${0.6 + resolveT * 0.3})`
    : `hsla(0,${42 + loadT * 33}%,${50 + loadT * 6}%,0.88)`
  const beamFill  = isResolvePh
    ? `rgba(58,153,102,${0.04 + resolveT * 0.06})`
    : `rgba(184,64,64,${0.03 + loadT * 0.09})`
  const overallColor = isResolvePh ? '#3a9966'
    : loadT === 0 ? 'rgba(255,255,255,0.3)'
    : `hsl(0,${42 + loadT * 33}%,${52 + loadT * 4}%)`
  const statusLabel = isResolvePh
    ? resolveCount === N ? 'all cracks closed' : `closing — ${crackCount} remain`
    : appearCount === 0 ? 'unloaded'
    : showCritical ? '⚠ diagonal tension failure'
    : `${crackCount} cracks — ${Math.round(crackDepth / beamH * 100)}% depth`

  return (
    <div ref={driverRef} style={{ height: `${PHASES * 52}vh` }} className={s.optionDriver}>
      <div className={s.stickyScene}>
        <div className={`${s.sidebar} ${isResolvePh ? s.sidebarPos : s.sidebarNeg}`}>
          <div className={s.eyebrowStack}>
            <span className={`${s.eyebrow} ${!isResolvePh ? s.eyebrowOn : ''}`}>Shear Cracking</span>
            <span className={`${s.eyebrow} ${ isResolvePh ? s.eyebrowOn : ''}`}>Cracks Closing</span>
          </div>
          <h2 className={s.sideTitle}>
            <span className={`${s.titleLayer} ${!isResolvePh ? s.titleOn : ''}`}>SHEAR<br/>CRACK</span>
            <span className={`${s.titleLayer} ${ isResolvePh ? s.titleOn : ''}`}>BEAM<br/>SOUND</span>
          </h2>
          <div className={s.circleDivider} />

          <div className={s.beamContourWrap}>
            <svg viewBox={`0 0 ${BW} ${BH + 18}`} className={s.beamContourSvg}>
              <defs>
                <clipPath id={clipId}>
                  <path d={beamPath} />
                </clipPath>
              </defs>

              {/* Beam body */}
              <path d={beamPath}
                fill={beamFill} stroke="rgba(255,255,255,0.2)" strokeWidth="1"
                style={{ transition: 'fill 0.5s ease' }} />

              {/* Cracks — clipped inside beam */}
              <g clipPath={`url(#${clipId})`}>
                {renderedCracks.map(({ ci, x, crackBotY, midX, midY, crackTopX, crackTopY }) => (
                  <polyline key={ci}
                    points={`${x},${crackBotY} ${midX},${midY} ${crackTopX},${crackTopY}`}
                    fill="none" stroke={crackColor} strokeWidth="0.9" strokeLinecap="round"
                    style={{ transition: 'stroke 0.5s ease' }} />
                ))}

                {/* Critical failure: existing crack suddenly extends diagonally */}
                {failureCrack && (
                  <polyline
                    points={`${failureCrack.x},${failureCrack.crackBotY} ${failureCrack.midX},${failureCrack.midY} ${failureCrack.crackTopX},${failureCrack.crackTopY} ${BW * 0.52},${topAt(BW * 0.52) + beamH * 0.15}`}
                    fill="none"
                    stroke="#b84040"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}
              </g>

              {/* Support triangles */}
              <polygon points={`4,${botEdge0} 14,${botEdge0+9} -4,${botEdge0+9}`}
                fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="0.8" />
              <polygon points={`${BW-4},${botEdge0} ${BW+4},${botEdge0+9} ${BW-14},${botEdge0+9}`}
                fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="0.8" />
            </svg>

            <div className={s.crackMeta}>
              <span className={s.crackMetaItem} style={{ color: overallColor, transition: 'color 0.5s ease' }}>
                {crackCount} cracks · {Math.round(crackDepth / beamH * 100)}% depth
              </span>
            </div>
            <div className={s.structStatus} style={{ color: overallColor, transition: 'color 0.6s ease' }}>
              {statusLabel}
            </div>
          </div>
        </div>

        <div className={s.rightPanel}>
          {ITEMS.map((item, i) => {
            const visible = appearCount > i, flipped = resolveCount > i
            return (
              <div key={i} className={`${s.item} ${visible ? s.itemOn : ''}`}>
                <div className={`${s.dot} ${!visible ? s.dotOff : flipped ? s.dotPos : s.dotNeg}`} />
                <div className={s.itemContent}>
                  <div className={s.itemCat}>{item.category}</div>
                  <div className={s.layers}>
                    <div className={`${s.layer} ${!flipped ? s.layerOn : ''}`}><p className={s.itemText}>{item.neg}</p></div>
                    <div className={`${s.layer} ${flipped ? s.layerOn : ''}`}><p className={`${s.itemText} ${s.posText}`}>{item.pos}</p></div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}



export default function ProblemsAndSolutions() {
  return (
    <div className={s.root}>

      <section className={s.hero}>
        <p className={s.heroEyebrow}>Nabih Youssef &amp; Associates · Tenant Improvement Projects</p>
        <h1 className={s.heroTitle}>
          WHAT LOOKS<br /><span>SIMPLE</span><br />CAN BECOME<br /><span>COMPLICATED</span>
        </h1>
        <p className={s.heroSub}>
          Tenant improvements carry hidden structural consequences that are easy to underestimate at the start of a project.
        </p>
        <div className={s.heroScrollHint}>
          <span>Scroll to explore</span>
          <div className={s.scrollLine} />
        </div>
      </section>

      <div className={s.optionDivider}>
        <span className={s.optionTag}>Option 01</span>
        <span className={s.optionDesc}>Per-item flip — problems appear one by one, then each resolves to its solution</span>
      </div>
      <Option1 />

      <div className={s.optionDivider}>
        <span className={s.optionTag}>Option 02</span>
        <span className={s.optionDesc}>Two-column reveal — problems fill left column first, then solutions answer on the right</span>
      </div>
      <Option2 />

      <div className={s.optionDivider}>
        <span className={s.optionTag}>Option 03</span>
        <span className={s.optionDesc}>Spotlight — one item fills the screen at a time, cycling problem then solution</span>
      </div>
      <Option3 />

      <div className={s.optionDivider}>
        <span className={s.optionTag}>Option 04</span>
        <span className={s.optionDesc}>Timeline — vertical spine with problem on left and solution on right, revealed row by row</span>
      </div>
      <Option4 />

      <div className={s.optionDivider}>
        <span className={s.optionTag}>Option 05</span>
        <span className={s.optionDesc}>Pencil rewriter — strikes each problem, rewrites below, collapses bad text, then normalises the fix to body style</span>
      </div>
      <Option5 />

      <div className={s.optionDivider}>
        <span className={s.optionTag}>Option 06</span>
        <span className={s.optionDesc}>Redline markup — items load as a draft document; a red pen slashes each problem, stamps REVISED, then types the amendment below</span>
      </div>
      <Option6 />

      <div className={s.optionDivider}>
        <span className={s.optionTag}>Option 07</span>
        <span className={s.optionDesc}>Ink wash — problems bleed onto the page; a wipe dissolves each and reveals the solution underneath</span>
      </div>
      <Option7 />

      <div className={s.optionDivider}>
        <span className={s.optionTag}>Option 08</span>
        <span className={s.optionDesc}>Typewriter — problems type in character by character; cursor returns, deletes bad phrases, retypes the correction</span>
      </div>
      <Option8 />

      <div className={s.optionDivider}>
        <span className={s.optionTag}>Option 09</span>
        <span className={s.optionDesc}>Chalkboard — problems written in rough chalk; an eraser wipes each line and the solution is rewritten cleaner</span>
      </div>
      <Option9 />

      <div className={s.optionDivider}>
        <span className={s.optionTag}>Option 10</span>
        <span className={s.optionDesc}>Seismic waveform — sidebar shows a structural load readout that grows chaotic and red as problems appear, then calms to a flat green line as solutions resolve</span>
      </div>
      <Option10 />

      <div className={s.optionDivider}>
        <span className={s.optionTag}>Option 11</span>
        <span className={s.optionDesc}>Load ring with a crack — same charging circle, but at full red a crack tears open at the top before the correction phase seals and greens it</span>
      </div>
      <Option11 />

      <div className={s.optionDivider}>
        <span className={s.optionTag}>Option 12</span>
        <span className={s.optionDesc}>Load column (gradual) — I-section column compresses and barrels under load, then snaps to a buckled S-curve at full load; straightens as solutions resolve</span>
      </div>
      <Option12 />

      <div className={s.optionDivider}>
        <span className={s.optionTag}>Option 13</span>
        <span className={s.optionDesc}>Load column (sudden snap) — column holds perfectly straight while problems load, then buckles instantly at full load; stress indicator builds in sidebar</span>
      </div>
      <Option13 />

      <div className={s.optionDivider}>
        <span className={s.optionTag}>Option 14</span>
        <span className={s.optionDesc}>RC deep beam — shear cracks fan inward from mid-span, spreading and inclining toward ends; existing crack extends to diagonal failure; both beam edges sag</span>
      </div>
      <Option15 />

      <footer className={s.footer}>
        <div className={s.footerLogo}>NYA</div>
        <p>Nabih Youssef &amp; Associates · Structural Engineers</p>
        <p>Tenant Improvement Projects · Problems &amp; Solutions</p>
      </footer>

    </div>
  )
}
