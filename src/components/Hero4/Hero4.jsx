import { useRef } from 'react'
import { useIsomorphicLayoutEffect as useLayoutEffect } from '../../hooks/useIsomorphicLayoutEffect'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import s from './Hero4.module.css'

gsap.registerPlugin(ScrollTrigger)

// ── Intro config ───────────────────────────────────────────────────────────
const INTRO_OFFSET_X = '45dvw'
const INTRO_OFFSET_Y = '45dvh'
const INTRO_DURATION = 1600
const TEXT_EXIT      = 1100
const CASCADE_OFFSET = 900

// Mobile intro — building enters from bottom-right, lands bottom-center
const MOBILE_FROM_X  = '30dvw'   // adjust if clipped on entry
const MOBILE_FROM_Y  = '60dvh'   // adjust if too high/low on entry
const MOBILE_REST_Y  = '55dvh'   // adjust until building sits at screen bottom

// ── Timeline tuning ────────────────────────────────────────────────────────
const LAYER_DUR = 2400
const LAYER_GAP = 0
const BG2_DUR   = 8200
const BG2_REST  = '-90vh'

// Viewport width at which mobile behaviour activates.
// Below this the building is scaled proportionally (same approach as
// CollapsingDiscs4's mobileScale = min(1, containerW / naturalW)).
const NATURAL_W = 1024

// iOS Safari: window.innerHeight changes when the toolbar collapses.
// visualViewport.height is the stable visible content height.
const getVH = () =>
  window.visualViewport ? window.visualViewport.height : window.innerHeight;

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
  const sectionRef     = useRef(null);
  const triggerRef     = useRef(null);
  const movehomeRef    = useRef(null);
  const titleRef       = useRef(null);
  const headerRef      = useRef(null);
  const layerRefs      = useRef([]);
  const bg1ImgRef      = useRef(null);
  const bg2ImgRef      = useRef(null);
  const bg2BackingRef  = useRef(null);
  const exitOverlayRef = useRef(null);
  const mmRef          = useRef(null);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mmRef.current = mm;

    // saveStyles prevents inline-style bleed when context reverts across breakpoints
    ScrollTrigger.saveStyles([
      movehomeRef.current,
      titleRef.current,
      headerRef.current,
      bg1ImgRef.current,
      bg2ImgRef.current,
      exitOverlayRef.current,
      ...layerRefs.current,
    ]);

    mm.add(
      {
        isDesktop: '(min-width: 1024px)',
        isMobile:  '(min-width: 480px) and (max-width: 1023px)',
        isTiny:    '(max-width: 479px)',
      },
      (context) => {
        const { isDesktop, isTiny } = context.conditions;

        const vw = window.innerWidth;
        const sc = Math.max(0.28, Math.min(1, vw / NATURAL_W));

        const fromX = isDesktop ? INTRO_OFFSET_X : MOBILE_FROM_X;
        const fromY = isDesktop ? INTRO_OFFSET_Y : MOBILE_FROM_Y;

        const [l1, l2, l3, l4, l5, l6, l7, l8] = layerRefs.current;

        gsap.set(movehomeRef.current, {
          scale: sc,
          transformOrigin: 'top left',
        });

        // Compute restY from actual scaled building height — adapts to any viewport/sc
        const buildingH = movehomeRef.current.getBoundingClientRect().height;
        const vh = getVH();
        const restY = Math.max(0, vh - buildingH * 0.9);

        const CASCADE_START = 700 + CASCADE_OFFSET;
        const LAYER_STEP    = LAYER_DUR + LAYER_GAP;
        const cascadeEnd    = CASCADE_START + 8 * LAYER_DUR + 7 * LAYER_GAP;

        const tl = gsap.timeline({
          scrollTrigger: {
            id: 'hero4-pin',
            trigger: triggerRef.current,
            start: 'top top',
            end: () => '+=' + getVH() * 2.5,
            pin: true,
            scrub: true,
            invalidateOnRefresh: true,
          },
        });
        tl.duration(cascadeEnd);

        tl
          .fromTo(
            movehomeRef.current,
            { x: fromX, y: fromY },
            { x: 0, y: restY, ease: 'power1.out', duration: INTRO_DURATION },
            0,
          )
          .to(
            [headerRef.current, titleRef.current],
            { y: '-120vh', ease: 'power1.in', duration: TEXT_EXIT },
            0,
          )

          .to(l1, { y: () => -(getVH() * 1.1) / sc, duration: LAYER_DUR, ease: 'power1.in' }, CASCADE_START)

          .to(
            bg1ImgRef.current,
            { y: '-180dvh', duration: cascadeEnd - (300 + CASCADE_OFFSET), ease: 'none' },
            300 + CASCADE_OFFSET,
          )
          .to(
            bg2ImgRef.current,
            { y: BG2_REST, duration: BG2_DUR, ease: 'none' },
            cascadeEnd - BG2_DUR,
          )

          .to(l2, { y: () => -(getVH() * 1.5) / sc, duration: LAYER_DUR, ease: 'power1.in' }, CASCADE_START + 1 * LAYER_STEP)
          .to(l3, { y: () => -(getVH() * 1.5) / sc, duration: LAYER_DUR, ease: 'power1.in' }, CASCADE_START + 2 * LAYER_STEP)
          .to(l4, { y: () => -(getVH() * 1.5) / sc, duration: LAYER_DUR, ease: 'power1.in' }, CASCADE_START + 3 * LAYER_STEP)
          .to(l5, { y: () => -(getVH() * 1.5) / sc, duration: LAYER_DUR, ease: 'power1.in' }, CASCADE_START + 4 * LAYER_STEP)
          .to(l6, { y: () => -(getVH() * 1.5) / sc, duration: LAYER_DUR, ease: 'power1.in' }, CASCADE_START + 5 * LAYER_STEP)
          .to(l7, { y: () => -(getVH() * 1.5) / sc, duration: LAYER_DUR, ease: 'power1.in' }, CASCADE_START + 6 * LAYER_STEP)
          .to(l8, { y: () => -(getVH() * 1.5) / sc, duration: LAYER_DUR, ease: 'power1.in' }, CASCADE_START + 7 * LAYER_STEP)

          .to(
            movehomeRef.current,
            { y: () => `+=${-(getVH() * 0.08) / sc}`, duration: cascadeEnd - CASCADE_START, ease: 'none' },
            CASCADE_START,
          );

        // iOS Safari: visualViewport.resize fires when toolbar collapses/expands
        const onVisualResize = () => {
          ScrollTrigger.refresh();
        };
        window.visualViewport?.addEventListener('resize', onVisualResize);

        // Orientation change: force refresh after settle delay
        let orientationTimer;
        const onOrientationChange = () => {
          clearTimeout(orientationTimer);
          orientationTimer = setTimeout(() => {
            ScrollTrigger.refresh();
          }, 150);
        };

        if (screen.orientation) {
          screen.orientation.addEventListener('change', onOrientationChange);
        } else {
          window.addEventListener('orientationchange', onOrientationChange);
        }

        // matchMedia cleanup — return function is called when context reverts
        return () => {
          clearTimeout(orientationTimer);
          window.visualViewport?.removeEventListener('resize', onVisualResize);
          if (screen.orientation) {
            screen.orientation.removeEventListener('change', onOrientationChange);
          } else {
            window.removeEventListener('orientationchange', onOrientationChange);
          }
        };
      },
    );

    return () => {
      mm.revert();
    };
  }, []);

  // bg2Backing color fade — mirrors TIDifferences/Intro.jsx's primary→white
  // fade exactly (same trigger element, same start/end), so the color
  // revealed through bg2Shape's transparent mask always matches the next
  // section's current background. Rebuilt on themechange.
  useLayoutEffect(() => {
    let colorCtx

    function buildBackingFade() {
      if (colorCtx) colorCtx.revert()
      const introSection = document.querySelector('#section-ti-differences > section')
      if (!introSection || !bg2BackingRef.current) return

      colorCtx = gsap.context(() => {
        const primaryColor = getComputedStyle(document.documentElement)
          .getPropertyValue('--color-primary')
          .trim()

        gsap.fromTo(
          bg2BackingRef.current,
          { backgroundColor: primaryColor },
          {
            backgroundColor: '#ffffff',
            scrollTrigger: {
              trigger: introSection,
              start: 'top 50%',
              end: 'top 20%',
              scrub: 1.2,
              invalidateOnRefresh: true,
            },
          },
        )
      })
    }

    document.fonts.ready.then(buildBackingFade)
    window.addEventListener('themechange', buildBackingFade)

    return () => {
      colorCtx?.revert()
      window.removeEventListener('themechange', buildBackingFade)
    }
  }, [])

  return (
    <section ref={sectionRef} id="hero4" className={s.home}>
      <div ref={triggerRef} className={s.trigger}>
        <header ref={headerRef} className={s.header}>
          <img
            src="/nya-logo/nya-white.png"
            alt="Nabih Youssef Associates"
            className={s.headerLogo}
            draggable={false}
          />
        </header>

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

        <div className={s.bg1}>
          <div ref={bg1ImgRef} className={s.bg1Shape} />
        </div>
        <div className={s.bg2}>
          <div ref={bg2ImgRef} className={s.bg2ImgWrap}>
            <div ref={bg2BackingRef} className={s.bg2Backing} />
            <div className={s.bg2Shape} />
          </div>
        </div>


        <div ref={exitOverlayRef} className={s.exitOverlay} />

        <div ref={movehomeRef} className={s.movehome}>
          {LAYERS.map((layer, i) => (
            <div
              key={layer.id}
              className={`${s[`l${layer.id}`]} ${s.layer}`}
              ref={(el) => { layerRefs.current[i] = el; }}
            >
              <img src={layer.base} alt="" draggable={false} className={s.imgBase} />
              <img src={layer.hover} alt="" draggable={false} className={s.imgHover} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
