import { useRef } from 'react'
import { useIsomorphicLayoutEffect as useLayoutEffect } from '../../hooks/useIsomorphicLayoutEffect'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import s from './Hero4.module.css'

gsap.registerPlugin(ScrollTrigger)

/**
 * NYA isometric building — exact Paveletsky replica.
 *
 * CSS:   verbatim Paveletsky main.css (lines 181-406 + bg1/bg2)
 * GSAP:  animation.js tlFirstScroll converted to GSAP 3 + ScrollTrigger.
 *        ScrollMagic: triggerHook 0.2, duration 9000px, offset -250.
 *        GSAP 3: start 'top 20%', end '+=9000', scrub true.
 *
 * Timeline absolute positions (seconds) traced from the GSAP 2 "-=X" chain.
 * Total timeline duration: ~15870 s (scrubbed over 9000 px of scroll).
 *
 *  tween             start           duration
 *  intro slide       0               INTRO_DURATION (≈ ½ page scroll)
 *  title fade        INTRO_DURATION  INTRO_DURATION * 0.5
 *  l1                810             4580    → y -1100
 *  bg1 (move)        2650            2950    → y -3700
 *  bg1 (opacity)     5350            500     → opacity 1
 *  l2                3290            4580    → y -1500
 *  bg2               3710            4580    → y -3500
 *  l3                4050            4580    → y -1500
 *  l4                5630            4580    → y -1500
 *  l5                7170            4580    → y -1500
 *  bg1 (move2)       8250            4500    → y -5500
 *  l6                7890            4580    → y -1500
 *  l7                9010            4580    → y -1500
 *  l8                10850           4580    → y -1500
 *  white overlay     EXIT_START      EXIT_DURATION (≈ ¼ page scroll)
 */

// ── Intro config — tweak these to change the starting offset ──────────────
const INTRO_OFFSET_X = '45dvw'   // rightward start offset — building peeks in bottom-right
const INTRO_OFFSET_Y = '45dvh'    // downward start offset
const INTRO_DURATION = 1600      // building glide — longer = more scroll to reach center
const TEXT_EXIT = 1100           // title + header lift; finishes BEFORE building centers
const CASCADE_OFFSET = 900       // delays the floor cascade until the building has settled

// ── Timeline tuning ───────────────────────────────────────────────────────
// Layers travel -1100/-1500 — that already clears them off the viewport top,
// so there is NO separate exit lift. The bg2 dark trapezoid rides UP with the
// last floor (l8): it keeps rising until its sloped top edge clears the viewport
// top, so the dark fills the whole viewport as l8 peels away — no white wedge
// is ever exposed in the upper-left. bg2 is top:100vh / height:157vh, so at
// BG2_REST (-156vh) its top-left slope corner sits at 148.98+(-156)= -7vh (above
// the viewport) while its bottom edge is still at 101vh (below the viewport).
// bg2 finishes in lockstep with l8, then the pin ends and the next section
// scrolls up over the solid dark field — a clean horizontal hand-off.
const LAYER_DUR = 2400     // visible floor-rise per layer
const LAYER_GAP = 0        // pause between one layer finishing and next starting
const BG2_DUR   = 8200     // finishes in sync with l8
const BG2_REST  = '-90vh'  // sloped top edge ends ~halfway up viewport at pin end

const LAYERS = [
  { id: 1, base: '/nya-img/i1.png',  hover: '/nya-img/i1I.png' },
  { id: 2, base: '/nya-img/i2.png',  hover: '/nya-img/i2I.png' },
  { id: 3, base: '/nya-img/i3.png',  hover: '/nya-img/i3I.png' },
  { id: 4, base: '/nya-img/i4.png',  hover: '/nya-img/i4I.png' },
  { id: 5, base: '/nya-img/i5.png',  hover: '/nya-img/i5I.png' },
  { id: 6, base: '/nya-img/i6.png',  hover: '/nya-img/i6I.png' },
  { id: 7, base: '/nya-img/i7.png',  hover: '/nya-img/i7I.png' },
  { id: 8, base: '/nya-img/i8.png',  hover: '/nya-img/i8I.png' },
]

export default function Hero4() {
  const sectionRef = useRef(null);
  const triggerRef = useRef(null);
  const movehomeRef = useRef(null);
  const titleRef = useRef(null);
  const headerRef = useRef(null);
  const layerRefs = useRef([]);
  const bg1ImgRef = useRef(null);
  const bg2ImgRef = useRef(null);
  const exitOverlayRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const [l1, l2, l3, l4, l5, l6, l7, l8] = layerRefs.current

      const tl = gsap.timeline({
        scrollTrigger: {
          id: 'hero4-pin',
          trigger: triggerRef.current,
          // 'top top' (not 'top 20%') — pinning at 20% left a transparent
          // pin-spacer gap above the content at scroll 0 (white strip). Pin
          // exactly when the hero reaches the viewport top instead.
          start: "top top",
          end: "+=2500",
          pin: true,
          scrub: true,
          invalidateOnRefresh: true,
        },
      });
      // Layer cascade is fully sequential — each layer clears the viewport
      // (LAYER_DUR) + a pause (LAYER_GAP) before the next starts. l1..l8
      // occupy [CASCADE_START, CASCADE_START + 8*LAYER_DUR + 7*LAYER_GAP].
      const CASCADE_START = 700 + CASCADE_OFFSET
      const LAYER_STEP = LAYER_DUR + LAYER_GAP
      const cascadeEnd = CASCADE_START + 8 * LAYER_DUR + 7 * LAYER_GAP

      // cap timeline so scrub maps scroll end → cascadeEnd (bg2 at -90.9vh, fade complete)
      tl.duration(cascadeEnd);



      tl
        // ── Intro: building glides from bottom-left to center over a long beat ──
        // power2.out (not expo.out) keeps it travelling through the whole intro
        // instead of snapping near-center early, so it genuinely "takes its time".
        .fromTo(
          movehomeRef.current,
          { x: INTRO_OFFSET_X, y: INTRO_OFFSET_Y },
          // power1.out = soft landing without the long stall of power2.out.
          // Rests near viewport bottom-center instead of mid-screen.
          { x: 0, y: "45dvh", ease: "power1.out", duration: INTRO_DURATION },
          0,
        )
        // Header bar + title lift off TOGETHER, accelerating up (power1.in), and
        // finish (TEXT_EXIT) before the building reaches center — no overlap.
        .to(
          [headerRef.current, titleRef.current],
          {
            y: "-120vh",
            ease: "power1.in",
            duration: TEXT_EXIT,
          },
          0,
        )

        // ── Build cascade — floors peel upward and clear off-screen ───────────
        // power1.in eases the first peel up from rest so it picks up exactly
        // where the building settles — no velocity jump (was the "shudder").
        .to(
          l1,
          { y: -1100, duration: LAYER_DUR, ease: "power1.in" },
          CASCADE_START,
        )

        // bg1: top dark triangle moves up, revealing white below — spans the
        // whole cascade so the reveal stays in sync with the floor peel-off.
        .to(
          bg1ImgRef.current,
          { y: "-180dvh", duration: cascadeEnd - (300 + CASCADE_OFFSET), ease: "none" },
          300 + CASCADE_OFFSET,
        )

        // bg2: dark trapezoid rises from below and STOPS flush — its flat bottom
        // edge lands at the viewport bottom, where the next section begins.
        // Finishes in lockstep with l8 (cascadeEnd).
        .to(
          bg2ImgRef.current,
          { y: BG2_REST, duration: BG2_DUR, ease: "none" },
          cascadeEnd - BG2_DUR,
        )

        // l2..l8: each starts only after the previous layer has fully cleared
        // the viewport (sequential, no overlap). Same ease as l1 (power1.in)
        // so every layer's peel-off has a matching fast finish — keeps the
        // handoff between layers feeling consistent.
        .to(l2, { y: -1500, duration: LAYER_DUR, ease: "power1.in" }, CASCADE_START + 1 * LAYER_STEP)
        .to(l3, { y: -1500, duration: LAYER_DUR, ease: "power1.in" }, CASCADE_START + 2 * LAYER_STEP)
        .to(l4, { y: -1500, duration: LAYER_DUR, ease: "power1.in" }, CASCADE_START + 3 * LAYER_STEP)
        .to(l5, { y: -1500, duration: LAYER_DUR, ease: "power1.in" }, CASCADE_START + 4 * LAYER_STEP)
        .to(l6, { y: -1500, duration: LAYER_DUR, ease: "power1.in" }, CASCADE_START + 5 * LAYER_STEP)
        .to(l7, { y: -1500, duration: LAYER_DUR, ease: "power1.in" }, CASCADE_START + 6 * LAYER_STEP)
        .to(l8, { y: -1500, duration: LAYER_DUR, ease: "power1.in" }, CASCADE_START + 7 * LAYER_STEP)

        // Building drifts gently upward over the whole cascade — small parallax
        // lift so the structure feels alive while floors peel off, on top of
        // its settled position from the intro.
        .to(
          movehomeRef.current,
          { y: "-=8vh", duration: cascadeEnd - CASCADE_START, ease: "none" },
          CASCADE_START,
        );


    }, triggerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="hero4" className={s.home}>
      <div ref={triggerRef} className={s.trigger}>
        {/* Header bar — dark band w/ NYA logo. Lifts away with the title on intro. */}
        <header ref={headerRef} className={s.header}>
          <img
            src="/nya-logo/nya-white.png"
            alt="Nabih Youssef Associates"
            className={s.headerLogo}
            draggable={false}
          />
        </header>

        {/* Hero title — top-left, sits below the header bar */}
        <div ref={titleRef} className={s.heroTitle}>
          <div className={s.titleRow}>
            <span className={`${s.titleWord} ${s.titleWordTenant}`}>
              <span className={s.firstLetter}>T</span>enant
            </span>
          </div>
          <div className={`${s.titleRow} ${s.titleRowIndent}`}>
            <span className={`${s.titleWord} ${s.titleWordImprovements}`}>
              <span className={s.firstLetter}>I</span>mprovements
            </span>
          </div>
        </div>

        {/* bg1 — top trapezoid: flat top, vertical sides, bottom slopes up L→R */}
        <div className={s.bg1}>
          <div ref={bg1ImgRef} className={s.bg1Shape} />
        </div>
        {/* bg2 — inverted trapezoid: top slopes down L→R, flat bottom; enters from below */}
        <div className={s.bg2}>
          <div ref={bg2ImgRef} className={s.bg2Shape} />
        </div>

        {/* exit overlay — fades in over last 400px of scroll to hand off to next section */}
        <div ref={exitOverlayRef} className={s.exitOverlay} />

        {/* Building layers — rendered after backgrounds so they sit in foreground */}
        <div ref={movehomeRef} className={s.movehome}>
          {LAYERS.map((layer, i) => (
            <div
              key={layer.id}
              className={`${s[`l${layer.id}`]} ${s.layer}`}
              ref={(el) => {
                layerRefs.current[i] = el;
              }}
            >
              <img
                src={layer.base}
                alt=""
                draggable={false}
                className={s.imgBase}
              />
              <img
                src={layer.hover}
                alt=""
                draggable={false}
                className={s.imgHover}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
