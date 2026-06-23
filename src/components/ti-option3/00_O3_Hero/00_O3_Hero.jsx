import { useRef } from 'react'
import { useIsomorphicLayoutEffect as useLayoutEffect } from '../../../hooks/useIsomorphicLayoutEffect'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import s from './00_O3_Hero.module.css'

import i1 from '../../../assets/hero-images/i1.webp?url'
import i1I from '../../../assets/hero-images/i1I.webp?url'
import i2 from '../../../assets/hero-images/i2.webp?url'
import i2I from '../../../assets/hero-images/i2I.webp?url'
import i3 from '../../../assets/hero-images/i3.webp?url'
import i3I from '../../../assets/hero-images/i3I.webp?url'
import i4 from '../../../assets/hero-images/i4.webp?url'
import i4I from '../../../assets/hero-images/i4I.webp?url'
import i5 from '../../../assets/hero-images/i5.webp?url'
import i5I from '../../../assets/hero-images/i5I.webp?url'
import i6 from '../../../assets/hero-images/i6.webp?url'
import i6I from '../../../assets/hero-images/i6I.webp?url'
import i7 from '../../../assets/hero-images/i7.webp?url'
import i7I from '../../../assets/hero-images/i7I.webp?url'
import i8 from '../../../assets/hero-images/i8.webp?url'
import i8I from '../../../assets/hero-images/i8I.webp?url'
import nyaWhite from '../../../assets/nya-white.webp?url'

gsap.registerPlugin(ScrollTrigger)

// ── Building rest position (USER-TUNABLE) ──────────────────────────────────
// Where the stacked building rests, as an offset from the BOTTOM-CENTRE
// anchor, in fractions of the viewport:
//   • 0     → bottom-centre on every device
//   • +ve   → drops the building lower (past the bottom edge)
//   • -ve   → lifts it up toward centre (≈ -0.5 ≈ centred)
// X: +ve = right of centre, -ve = left.
const BUILDING_OFFSET_Y = 0.4; // landscape/desktop: dropped below bottom-centre
// Portrait phones are tall + the building is width-bound, so the big landscape
// drop pushes the whole building off the bottom edge. Use a small portrait
// offset so it rests in view. 0 = union bottom at the edge; +ve nudges lower.
// Lifted from 0.25 → 0.18 so the resting building sits ≈60px higher on portrait
// phones (390×844) — previously only the roof peeked above the fold.
const BUILDING_OFFSET_Y_PORTRAIT = 0.18;
const BUILDING_OFFSET_X = 0;

// ── Intro config ───────────────────────────────────────────────────────────
const INTRO_DURATION = 1600   // settle-into-rest before the cascade
const TEXT_EXIT      = 1100
const CASCADE_OFFSET = 900

// ── Timeline tuning ────────────────────────────────────────────────────────
const LAYER_DUR = 3600
// l8 (ground floor / last layer) gets a much longer window than the others.
// The next section moves 1:1 with scroll, so for it to travel a full half-
// viewport between "l8 half-up" and "l8 fully up", l8's own scroll window must
// be ≈ one viewport. With this duration l8 occupies ≈1vh of the pin distance.
const L8_DUR    = 8000
const LAYER_GAP = 0
const BG2_REST  = '-135vh'
// Scroll distance (in viewport heights) the hero pin scrubs the whole cascade
// over. Total scroll from hero top to the intro section reaching the viewport
// top = PIN_LENGTH + 1 (the pinned trigger's own viewport scrolls out after).
// Pin scroll length in viewport-heights. The timeline (duration cascadeEnd) is
// scrubbed across this distance, so a smaller value transits the whole hero —
// including the building's fly-up through open space — over less scroll, which
// cuts the near-empty mid-flight frames (dead-scroll). Was 4.35.
const PIN_LENGTH = 2.2
// Portrait phones are tall, so the same cascade scrubbed over PIN_LENGTH felt
// like the stack shot up too fast. A longer pin scrubs the SAME timeline over
// more scroll → gentler rise. Seam stays synced: the next section's layout
// position (pin-spacer height) AND the pin release both scale with this, so
// their offset is unchanged.
const PIN_LENGTH_PORTRAIT = 3.3
const pinLength = () =>
  (typeof window !== 'undefined' &&
   window.matchMedia('(orientation: portrait)').matches)
    ? PIN_LENGTH_PORTRAIT
    : PIN_LENGTH

// Provisional first-paint scale before the building is measured (see below).
const NATURAL_W = 1024

// iOS Safari: window.innerHeight changes when the toolbar collapses.
// visualViewport.height is the stable visible content height.
const getVH = () =>
  window.visualViewport ? window.visualViewport.height : window.innerHeight;

const LAYERS = [
  { id: 1, base: i1,  hover: i1I },
  { id: 2, base: i2,  hover: i2I },
  { id: 3, base: i3,  hover: i3I },
  { id: 4, base: i4,  hover: i4I },
  { id: 5, base: i5,  hover: i5I },
  { id: 6, base: i6,  hover: i6I },
  { id: 7, base: i7,  hover: i7I },
  { id: 8, base: i8,  hover: i8I },
]

// ── Layer layout (USER-TUNABLE — SINGLE SOURCE OF TRUTH) ────────────────────
// One row per building layer, one knob per axis. To move or resize a layer,
// edit its row:
//   top   → vertical position   (higher number = lower on screen)
//   left  → horizontal position (higher number = further right)
//   width → artwork size        (the layer's "scale" knob)
//
// All values are vw, and the parent `scale` shrinks them proportionally so the
// gaps track building WIDTH (vh gaps balloon on portrait and the layers fly
// apart). top/left place the artwork directly — the old container-box vs
// inner-image split is merged into these single numbers.
const LAYOUT = {
  //   top       left     width
  1: { top: -9, left: 26.05, width: 55.4 },
  2: { top: -4.875, left: 13.32, width: 41 },
  3: { top: -1.95, left: 26.05, width: 55.44 },
  4: { top: -0.4, left: 13.4, width: 68 },
  5: { top: 1.0, left: 13.44, width: 35.68 },
  6: { top: 7.9, left: 26.55, width: 55.1 },
  7: { top: 18.625, left: 4.7, width: 54 },
  8: { top: 7.9125, left: 4.8, width: 76.6175 },
};

export default function O3Hero() {
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
  const loadCoverRef   = useRef(null);
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
        isTablet:  '(min-width: 768px) and (max-width: 1023px)',
        isMobile:  '(min-width: 480px) and (max-width: 767px)',
        isTiny:    '(max-width: 479px)',
      },
      (context) => {
        const { isDesktop, isTablet, isMobile, isTiny } = context.conditions;

        const mh = movehomeRef.current;
        const [l1, l2, l3, l4, l5, l6, l7, l8] = layerRefs.current;
        const baseImgs = layerRefs.current
          .map((l) => l && l.querySelector("img"))
          .filter(Boolean);

        // Provisional scale so first paint isn't full-size before measurement.
        gsap.set(mh, {
          scale: Math.max(0.28, Math.min(1, window.innerWidth / NATURAL_W)),
          transformOrigin: "top left",
        });

        // Apply the static layout from the LAYOUT table (single source of
        // truth — see top of file). Must run BEFORE computeFit() measures the
        // union rect. The container box carries top/left/width; the artwork
        // sits flush at its origin (left/top 0) so one row = one position.
        LAYERS.forEach((layer, i) => {
          const cfg = LAYOUT[layer.id];
          const el = layerRefs.current[i];
          if (!el || !cfg) return;
          gsap.set(el, {
            top: cfg.top + "vw",
            left: cfg.left + "vw",
            width: cfg.width + "vw",
          });
          gsap.set(el.querySelectorAll("img"), {
            width: cfg.width + "vw",
            left: 0,
            top: 0,
          });
        });

        // ── Contain-fit + bottom-centre anchor ───────────────────────────
        // Matches paveletsky.org: the assembled building sits stacked at the
        // BOTTOM-CENTRE of the viewport (ground floor near the bottom edge,
        // roof up top, title above it), then layers fly up one-by-one.
        //
        // The building must always fit WHOLLY inside the viewport, then be
        // anchored to the bottom. Filling width alone overflows the top on
        // short laptop viewports (building height ≈ 0.68×width > a short vh →
        // roof cut off). So scale to the binding axis (contain-fit): width
        // binds on portrait (fills width), height binds on short/wide laptops
        // (fits height). FILL > 1 lets the transparent PNG padding bleed off
        // so the visible building fills the frame rather than floating small.
        // Measured live; invalidateOnRefresh + a refreshInit recompute keep it
        // correct across resize / orientation / toolbar changes.
        const FILL = 1.06; // overscan past the binding axis (trims PNG padding)
        const BOTTOM = -0.015; // bottom-anchor fine-nudge: union bottom this fraction of vh above the edge
        const fit = { sc: 1, x: 0, y: 0 };

        const unionRect = () => {
          let x0 = Infinity,
            y0 = Infinity,
            x1 = -Infinity,
            y1 = -Infinity;
          for (const im of baseImgs) {
            const r = im.getBoundingClientRect();
            if (!r.width && !r.height) continue;
            x0 = Math.min(x0, r.left);
            y0 = Math.min(y0, r.top);
            x1 = Math.max(x1, r.right);
            y1 = Math.max(y1, r.bottom);
          }
          return { left: x0, top: y0, width: x1 - x0, height: y1 - y0 };
        };

        const computeFit = () => {
          const cx = gsap.getProperty(mh, "x");
          const cy = gsap.getProperty(mh, "y");
          const cs = gsap.getProperty(mh, "scale");
          // Layers carry their own cascade y-transforms. getBoundingClientRect
          // on the imgs sees ALL ancestor transforms — so we must zero the
          // layers too, not just mh. Otherwise a refresh mid-scroll (resize
          // while scrolled in, or jumping to a section past hero4's start)
          // measures LIFTED layers → garbage union rect → fit.sc/x/y wrong →
          // building scaled tiny / flung off-screen until a manual page reload.
          const layerEls = layerRefs.current.filter(Boolean);
          const layerY = layerEls.map((el) => gsap.getProperty(el, "y"));
          const restoreLayers = () =>
            layerEls.forEach((el, i) => gsap.set(el, { y: layerY[i] }));
          gsap.set(layerEls, { y: 0 });
          gsap.set(mh, { scale: 1, x: 0, y: 0 });
          const r1 = unionRect();
          if (!r1.width || !r1.height) {
            gsap.set(mh, { scale: cs, x: cx, y: cy });
            restoreLayers();
            return;
          }
          const vw = window.innerWidth;
          const vh = getVH();
          // contain-fit: whichever axis binds keeps the building fully on-screen
          fit.sc = Math.min((FILL * vw) / r1.width, (FILL * vh) / r1.height);
          gsap.set(mh, { scale: fit.sc, x: 0, y: 0 });
          const r = unionRect();
          // SCROLL-INDEPENDENT anchor. getBoundingClientRect is viewport-
          // relative, so r.top/r.left carry the current scroll offset. A
          // ScrollTrigger.refresh() fired while scrolled away from the top
          // (e.g. client:visible sections hydrating after a section jump) would
          // then bake the scroll offset into fit.y → building parked thousands
          // of px off-screen even though scrollY is 0. Measure relative to the
          // building's own trigger container instead: (r.top - trig.top)
          // cancels the shared scroll offset, so the anchor is identical at any
          // scroll position. (trig is the pinned 100vh box that holds mh.)
          const trig = triggerRef.current.getBoundingClientRect();
          const relTop = r.top - trig.top;
          const relLeft = r.left - trig.left;
          const yBottom = vh - r.height - relTop + vh * BOTTOM; // bottom-centre anchor
          // Offset from the bottom anchor by the user knob (+ve drops lower).
          // Live orientation read so a flip re-fits via invalidateOnRefresh
          // without a matchMedia rebuild (which parks the building hidden).
          const offsetY = window.matchMedia('(orientation: portrait)').matches
            ? BUILDING_OFFSET_Y_PORTRAIT
            : BUILDING_OFFSET_Y;
          fit.x = (vw - r.width) / 2 - relLeft + vw * BUILDING_OFFSET_X;
          fit.y = yBottom + vh * offsetY;
          gsap.set(mh, { scale: cs, x: cx, y: cy }); // restore scrub state
          restoreLayers();
        };

        // Portrait screens travel further up; landscape unchanged. Read live
        // (not via matchMedia) so an orientation flip on resize re-evaluates
        // through invalidateOnRefresh instead of reverting the whole context
        // (which parked the building hidden until a page refresh).
        // Tune the 1.4: 1 = no change, 1.4 = 40% more travel in portrait.
        const portraitBoost = () =>
          window.matchMedia('(orientation: portrait)').matches ? 1.4 : 1;
        const l1Mult = () => (isDesktop ? 1.1 : 0.9) * portraitBoost();
        const l2Mult = () => (isDesktop ? 1.5 : isTablet ? 1.2 : 1.0) * portraitBoost();

        const CASCADE_START = 700 + CASCADE_OFFSET;
        const LAYER_STEP = LAYER_DUR + LAYER_GAP;
        // l1..l7 use LAYER_DUR; l8 uses the longer L8_DUR and ends the cascade.
        const cascadeEnd = CASCADE_START + 7 * LAYER_STEP + L8_DUR;

        let tl = null;
        let holdST = null;
        let cancelled = false;

        const buildTimeline = () => {
          if (cancelled) return;
          computeFit();
          // Reveal now that layers are sized/positioned. Parked hidden in CSS
          // so the pre-hydration frame (unsized imgs) never flashes.
          gsap.set(mh, {
            scale: fit.sc,
            transformOrigin: "top left",
            visibility: "visible",
          });
          // Building is now painted — drop the navy load cover that hid the
          // white .home wedge (which read as "the next section showing through")
          // while the base images were still downloading.
          if (loadCoverRef.current) loadCoverRef.current.style.display = "none";

          // Hand pinning over to the real cascade timeline. The hold pin (created
          // before images loaded) used the SAME trigger/start/end + pinSpacing, so
          // the pin-spacer height — and thus the next section's layout position —
          // is identical; swapping them is seamless with no scroll jump.
          if (holdST) { holdST.kill(); holdST = null; }

          tl = gsap.timeline({
            // force3D:true keeps every layer on a translate3d (GPU) transform for
            // the whole scrub. Default "auto" reverts a layer to a 2D transform
            // the moment its tween stops ticking, which demotes the GPU layer and
            // forces the large webp to re-rasterize → the flicker seen mid-scroll.
            defaults: { force3D: true },
            scrollTrigger: {
              id: "hero4-pin",
              trigger: triggerRef.current,
              start: "top top",
              end: () => "+=" + getVH() * pinLength(),
              pin: true,
              scrub: true,
              invalidateOnRefresh: true,
            },
          });
          tl.duration(cascadeEnd);

          tl
            // Building rests stacked at bottom-centre from the first frame
            // (like paveletsky.org) — a whisper of rise for life, then it
            // holds until the cascade flies the layers up. Same on every
            // device. Function-based so it re-centres on refresh/resize.
            .fromTo(
              mh,
              { x: () => fit.x, y: () => fit.y + getVH() * 0.04 },
              {
                x: () => fit.x,
                y: () => fit.y,
                ease: "power1.out",
                duration: INTRO_DURATION,
              },
              0,
            )
            .to(
              [headerRef.current, titleRef.current],
              { y: "-120vh", ease: "power1.in", duration: TEXT_EXIT },
              0,
            )

            .to(
              l1,
              {
                y: () => -(getVH() * l1Mult()) / fit.sc,
                duration: LAYER_DUR,
                ease: "power1.in",
              },
              CASCADE_START,
            )

            .to(
              bg1ImgRef.current,
              {
                y: "-180dvh",
                duration: cascadeEnd - (300 + CASCADE_OFFSET),
                ease: "none",
              },
              300 + CASCADE_OFFSET,
            )
            .to(
              bg2ImgRef.current,
              { y: BG2_REST, duration: LAYER_DUR, ease: "power1.in" },
              CASCADE_START + 7 * LAYER_STEP,
            )

            .to(
              l2,
              {
                y: () => -(getVH() * l2Mult()) / fit.sc,
                duration: LAYER_DUR,
                ease: "power1.in",
              },
              CASCADE_START + 1 * LAYER_STEP,
            )
            .to(
              l3,
              {
                y: () => -(getVH() * l2Mult()) / fit.sc,
                duration: LAYER_DUR,
                ease: "power1.in",
              },
              CASCADE_START + 2 * LAYER_STEP,
            )
            .to(
              l4,
              {
                y: () => -(getVH() * l2Mult()) / fit.sc,
                duration: LAYER_DUR,
                ease: "power1.in",
              },
              CASCADE_START + 3 * LAYER_STEP,
            )
            .to(
              l5,
              {
                y: () => -(getVH() * l2Mult()) / fit.sc,
                duration: LAYER_DUR,
                ease: "power1.in",
              },
              CASCADE_START + 4 * LAYER_STEP,
            )
            .to(
              l6,
              {
                y: () => -(getVH() * l2Mult()) / fit.sc,
                duration: LAYER_DUR,
                ease: "power1.in",
              },
              CASCADE_START + 5 * LAYER_STEP,
            )
            .to(
              l7,
              {
                y: () => -(getVH() * l2Mult()) / fit.sc,
                duration: LAYER_DUR,
                ease: "power1.in",
              },
              CASCADE_START + 6 * LAYER_STEP,
            )
            .to(
              l8,
              {
                y: () => -(getVH() * l2Mult()) / fit.sc,
                duration: L8_DUR,
                ease: "power1.in",
              },
              CASCADE_START + 7 * LAYER_STEP,
            )

            // Slow building drift during the cascade. ABSOLUTE fromTo (not a
            // relative +=) because mh.y is ALSO driven by the intro fromTo
            // above — two tweens on one property is GSAP gotcha #2: relative
            // values cache a baseline at creation and bake the WRONG start when
            // the playhead is SEEKED (jumping sections via Lenis scrollTo),
            // leaving mh stuck off-screen → whole building vanishes until a
            // page reload. Absolute fromTo + immediateRender:false reverses
            // cleanly on any seek. Starts at fit.y exactly where the intro
            // fromTo lands (CASCADE_START == INTRO_DURATION), so it's seamless.
            .fromTo(
              mh,
              { y: () => fit.y },
              {
                y: () => fit.y - (getVH() * 0.08) / fit.sc,
                duration: cascadeEnd - CASCADE_START,
                ease: "none",
                immediateRender: false,
              },
              CASCADE_START,
            );
        };;

        // Recompute fit before ScrollTrigger re-reads function-based values.
        // The timeline animates mh x/y (function-based, re-read on refresh) but
        // NOT scale — fit.sc is applied once in buildTimeline. On resize the
        // binding axis can change, so re-push the fresh scale here or the
        // building keeps its stale size and looks broken until a page refresh.
        const onRefreshInit = () => {
          if (tl) {
            computeFit();
            gsap.set(mh, { scale: fit.sc });
          }
        };
        ScrollTrigger.addEventListener("refreshInit", onRefreshInit);

        // Self-healing rest guarantee (defense-in-depth). Runs AFTER every
        // refresh recalculation. Two jobs:
        //  1. Force visibility:visible — a matchMedia breakpoint rebuild
        //     restores the parked CSS `visibility:hidden`; without this the
        //     building can stay hidden after a resize across a breakpoint.
        //  2. When the timeline is parked at the top (progress ~0, i.e. not
        //     scrubbed in), re-assert the freshly-measured rest transform so
        //     the building is GUARANTEED on-screen at rest regardless of what
        //     state any earlier code path left it in. Mid-scroll we leave x/y
        //     to the scrub (forcing them would fight the playhead).
        const onRefresh = () => {
          if (!tl) return;
          gsap.set(mh, { scale: fit.sc, visibility: "visible" });
          const st = tl.scrollTrigger;
          if (st && st.progress <= 0.0001) {
            gsap.set(mh, { x: fit.x, y: fit.y });
          }
        };
        ScrollTrigger.addEventListener("refresh", onRefresh);

        // Pin the hero IMMEDIATELY — before the building images finish
        // downloading. The real cascade timeline can't be built until the base
        // images load (their measured height drives the contain-fit), so without
        // this any scroll during that window would slide the un-pinned hero away
        // and reveal the next section. This placeholder pin holds the hero in
        // place (loadCover keeps it a clean navy hero) until buildTimeline swaps
        // in the real pin. Same trigger/start/end/pinSpacing → seamless handoff.
        holdST = ScrollTrigger.create({
          id: "hero4-holdpin",
          trigger: triggerRef.current,
          start: "top top",
          end: () => "+=" + getVH() * pinLength(),
          pin: true,
          pinSpacing: true,
          invalidateOnRefresh: true,
        });

        // getBoundingClientRect height is only real once images have loaded
        // (height:auto = 0 before load) — gate the build on it.
        const imgReady = (im) => im.complete && im.naturalHeight;
        if (baseImgs.every(imgReady)) {
          buildTimeline();
        } else {
          Promise.all(
            baseImgs.map((im) =>
              imgReady(im)
                ? Promise.resolve()
                : new Promise((res) => {
                    im.addEventListener("load", res, { once: true });
                    im.addEventListener("error", res, { once: true });
                  }),
            ),
          ).then(() => {
            buildTimeline();
            ScrollTrigger.refresh();
          });
        }

        // iOS Safari: visualViewport.resize fires when toolbar collapses/expands
        const onVisualResize = () => {
          ScrollTrigger.refresh();
        };
        window.visualViewport?.addEventListener("resize", onVisualResize);

        // Orientation change: force refresh after settle delay
        let orientationTimer;
        const onOrientationChange = () => {
          clearTimeout(orientationTimer);
          orientationTimer = setTimeout(() => {
            ScrollTrigger.refresh();
          }, 150);
        };

        if (screen.orientation) {
          screen.orientation.addEventListener("change", onOrientationChange);
        } else {
          window.addEventListener("orientationchange", onOrientationChange);
        }

        // matchMedia cleanup — return function is called when context reverts
        return () => {
          cancelled = true;
          ScrollTrigger.removeEventListener("refreshInit", onRefreshInit);
          ScrollTrigger.removeEventListener("refresh", onRefresh);
          holdST?.kill();
          tl?.scrollTrigger?.kill();
          tl?.kill();
          clearTimeout(orientationTimer);
          window.visualViewport?.removeEventListener("resize", onVisualResize);
          if (screen.orientation) {
            screen.orientation.removeEventListener(
              "change",
              onOrientationChange,
            );
          } else {
            window.removeEventListener(
              "orientationchange",
              onOrientationChange,
            );
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
            backgroundColor: 'oklch(1 0 0)',
            scrollTrigger: {
              trigger: introSection,
              start: 'top 50%',
              end: 'top top',
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
            src={nyaWhite}
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
            
            <span className={`${s.titleWord} ${s.titleWordImprovements}`}>
              <span className={s.firstLetter}>I</span>mprovements
            </span>
          </div>
          {/*<div className={`${s.titleRow} ${s.titleRowIndent}`}>
            <span className={`${s.titleWord} ${s.titleWordImprovements}`}>
              <span className={s.firstLetter}>I</span>mprovements
            </span>
          </div>*/}
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

        {/* Navy cover shown until the building paints (removed in buildTimeline).
            Matches the hero's bg so the load-in reads as a clean navy hero with
            the title, never the white wedge / next section peeking through. */}
        <div ref={loadCoverRef} className={s.loadCover} />

        <div ref={movehomeRef} className={s.movehome}>
          {LAYERS.map((layer, i) => (
            <div
              key={layer.id}
              className={`${s[`l${layer.id}`]} ${s.layer}`}
              ref={(el) => { layerRefs.current[i] = el; }}
            >
              {/* Base layers gate the build + first paint → load them first.
                  Hover variants (~half the total bytes, never shown at load) are
                  deferred so they don't starve the base images' bandwidth — this
                  removes the cold-load gap where the building hadn't appeared and
                  the empty hero showed through. */}
              <img src={layer.base} alt="" draggable={false} className={s.imgBase} fetchpriority="high" decoding="async" />
              <img src={layer.hover} alt="" draggable={false} className={s.imgHover} loading="lazy" fetchpriority="low" decoding="async" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
