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
const INTRO_OFFSET_X = '180vw'  // leftward start offset (building enters from bottom-left)
const INTRO_OFFSET_Y = '150vh'   // downward start offset
const INTRO_DURATION = 800       // timeline units ≈ ½ page scroll at 9000px

// ── Timeline tuning ───────────────────────────────────────────────────────
// Layers travel -1100/-1500 — that already clears them off the viewport top,
// so there is NO separate exit lift. The bg2 dark trapezoid does NOT exit fully:
// it rises until its flat bottom edge sits at the viewport bottom (-150vh, since
// bg2 is top:100vh / height:150vh), then stops. The pin ends there, so the next
// (white) TIDifferences section is FLUSH against bg2's bottom edge — the dark
// background hands straight to the section with no full-white frame between.
const LAYER_DUR = 2400     // visible floor-rise per layer
const BG2_START = 1800     // dark trapezoid begins rising from below
const BG2_DUR   = 7400     // settles flush in sync with the last floor (l8)
const BG2_REST  = '-150vh' // flat bottom edge ends exactly at viewport bottom

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
  const layerRefs = useRef([]);
  const bg1ImgRef = useRef(null);
  const bg2ImgRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const [l1, l2, l3, l4, l5, l6, l7, l8] = layerRefs.current

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerRef.current,
          start: 'top 20%',
          end: '+=5600',
          pin: true,
          scrub: true,
          invalidateOnRefresh: true,
        },
      })

      tl
        // ── Intro: building glides from bottom-left to center; title moves up ──
        .fromTo(
          movehomeRef.current,
          { x: INTRO_OFFSET_X, y: INTRO_OFFSET_Y },
          { x: 0, y: 0, ease: "expo.out", duration: INTRO_DURATION },
          0,
        )
        // Title lifts off-screen in lockstep with the building slide — no fade
        .to(
          titleRef.current,
          {
            y: "-120vh",
            ease: "none",
            duration: INTRO_DURATION,
          },
          0,
        )

        // ── Build cascade — floors peel upward and clear off-screen ───────────
        .to(l1, { y: -1100, duration: LAYER_DUR }, 700)

        // bg1: top dark triangle moves up, revealing white below
        .to(
          bg1ImgRef.current,
          { y: "-180vh", duration: 8000, ease: "none" },
          300,
        )

        // bg2: dark trapezoid rises from below and STOPS flush — its flat bottom
        // edge lands at the viewport bottom, where the next section begins.
        .to(
          bg2ImgRef.current,
          { y: BG2_REST, duration: BG2_DUR, ease: "none" },
          BG2_START,
        )

        .to(l2, { y: -1500, duration: LAYER_DUR }, 1600)
        .to(l3, { y: -1500, duration: LAYER_DUR }, 2400)
        .to(l4, { y: -1500, duration: LAYER_DUR }, 3400)
        .to(l5, { y: -1500, duration: LAYER_DUR }, 4400)
        .to(l6, { y: -1500, duration: LAYER_DUR }, 5200)
        .to(l7, { y: -1500, duration: LAYER_DUR }, 6200)
        .to(l8, { y: -1500, duration: LAYER_DUR }, 7000);

    }, triggerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="hero4" className={s.home}>
      <div ref={triggerRef} className={s.trigger}>
        {/* Hero title — top-left. Future: NYA logo goes above this, morphs to SideNav */}
        <div ref={titleRef} className={s.heroTitle}>
          <div className={s.titleRow}>
            <span className={s.dropCap}>T</span>
            <span className={s.titleRest}>ENANT</span>
          </div>
          <div className={s.titleRow}>
            <span className={s.dropCap}>I</span>
            <span className={s.titleRest}>MPROVEMENTS</span>
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
