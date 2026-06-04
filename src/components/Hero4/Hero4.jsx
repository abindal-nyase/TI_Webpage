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
const INTRO_OFFSET_X = '180vw'   // rightward start offset (building barely visible)
const INTRO_OFFSET_Y = '150vh'   // downward start offset (building barely visible)
const INTRO_DURATION = 800      // timeline units ≈ ½ page scroll at 9000px

// ── Exit config — white flash at end ──────────────────────────────────────
const EXIT_START    = 15430     // right after l8 finishes (10850 + 4580)
const EXIT_DURATION = 440       // ≈ ¼ page scroll at 9000px

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
  const fadeOverlayRef = useRef(null);
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
          end: '+=9000',
          pin: true,
          scrub: true,
          invalidateOnRefresh: true,
        },
      })

      tl
        // ── Intro: building glides from bottom-right to natural center ─────────
        .fromTo(
          movehomeRef.current,
          { x: INTRO_OFFSET_X, y: INTRO_OFFSET_Y },
          { x: 0, y: 0, ease: "expo.out", duration: INTRO_DURATION },
          0,
        )
        // Title fades out during second half of intro slide
        .to(
          titleRef.current,
          { opacity: 0, ease: "power2.in", duration: INTRO_DURATION * 0.5 },
          INTRO_DURATION * 0.5,
        )

        // ── Layer animations — unchanged from Paveletsky ───────────────────────
        .to(l1, { y: -1100, duration: 4580 }, 810)

        .to(bg1ImgRef.current, { y: -3700, duration: 2950 }, 2650)
        .to(bg1ImgRef.current, { opacity: 1, duration: 500 }, 5350)

        .to(l2, { y: -1500, duration: 4580 }, 3290)
        .to(bg2ImgRef.current, { y: -3500, duration: 4580 }, 3710)
        .to(l3, { y: -1500, duration: 4580 }, 4050)
        .to(l4, { y: -1500, duration: 4580 }, 5630)
        .to(l5, { y: -1500, duration: 4580 }, 7170)
        .to(bg1ImgRef.current, { y: -5500, duration: 4500 }, 8250)
        .to(l6, { y: -1500, duration: 4580 }, 7890)
        .to(l7, { y: -1500, duration: 4580 }, 9010)
        .to(l8, { y: -1500, duration: 4580 }, 10850)

        // ── Fast white exit (≈ ¼ page scroll, fully white) ────────────────────
        .to(
          fadeOverlayRef.current,
          { opacity: 1, ease: "none", duration: EXIT_DURATION },
          EXIT_START,
        );

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

        {/* Animated backgrounds — geometric shapes, color responds to theme switcher */}
        <div className={s.bg1}>
          <div ref={bg1ImgRef} className={s.bg1Shape}>
            <svg viewBox="0 0 1440 800" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" className={s.bgSvg}>
              {/* Main floor plane — angled architectural ground */}
              <polygon points="0,350 1440,50 1440,800 0,800" className={s.bgFill} />
              {/* Upper edge highlight band */}
              <polygon points="0,330 1440,30 1440,70 0,370" className={s.bgFillMid} />
              {/* Far-right accent triangle */}
              <polygon points="1100,0 1440,0 1440,40" className={s.bgFillLight} />
            </svg>
          </div>
        </div>
        <div className={s.bg2}>
          <div ref={bg2ImgRef} className={s.bg2Shape}>
            <svg viewBox="0 0 1440 700" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" className={s.bgSvg}>
              {/* Secondary depth plane — different pitch */}
              <polygon points="0,120 1440,0 1440,580 0,700" className={s.bgFillMid} />
              {/* Left structural column accent */}
              <polygon points="0,100 180,80 180,700 0,700" className={s.bgFill} />
              {/* Diagonal accent stripe */}
              <polygon points="0,90 1440,0 1440,22 0,112" className={s.bgFillLight} />
            </svg>
          </div>
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

        {/* White overlay — fades in at end of scroll sequence */}
        <div ref={fadeOverlayRef} className={s.fadeOverlay} />
      </div>
    </section>
  );
}
