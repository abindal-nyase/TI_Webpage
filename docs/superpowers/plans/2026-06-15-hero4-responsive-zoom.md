# Hero4 Responsive Zoom & Viewport Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make Hero4's building animation and layer cascade fully responsive to browser zoom, system display scaling, screen resolution, viewport width/height — with a correct mobile intro (bottom-right → bottom-center, building visible at screen bottom) — including iOS Safari toolbar, Android display scaling, orientation change, and very small phones.

**Architecture:** Replace the manual debounced-resize/`build()` pattern with `gsap.matchMedia()` (GSAP 3.11+), which auto-reverts and rebuilds animation contexts when any media query boundary changes — including browser zoom, which the browser maps to viewport-width changes. All hardcoded pixel y-values (`-1100`, `-1500`) become function-based `() => value` expressions so `ScrollTrigger.refresh()` + `invalidateOnRefresh: true` recalculate them on every invalidation. The scroll-distance `end` also becomes function-based. On mobile, y-values use `window.visualViewport.height` (not `window.innerHeight`) to neutralize iOS Safari's dynamic toolbar which shrinks `innerHeight` during scroll. Duration constants stay fixed (GSAP documented limitation: duration is not invalidated on refresh; breakpoint-scoped contexts handle any duration variation needed).

**Tech Stack:** React 18, GSAP 3.13+, ScrollTrigger, Lenis (via GlobalSetup), CSS Modules

---

## How to test responsively (without owning every device)

### 1. Chrome DevTools device emulation — covers 80% of cases

Open DevTools → Toggle Device Toolbar (`Cmd+Shift+M`). Test these presets minimum:

| Preset | Viewport | What it catches |
|---|---|---|
| iPhone SE | 320×568 | Tiny phone — sc floor, building visibility |
| iPhone 14 Pro | 393×852 | Standard modern iPhone portrait |
| iPhone 14 Pro (landscape) | 852×393 | Short viewport — landscape CSS adjustment |
| Pixel 7 | 412×915 | Standard Android |
| iPad Mini | 768×1024 | Tablet — mobile breakpoint |
| iPad Pro landscape | 1366×1024 | Large tablet — desktop breakpoint |

Set **CPU throttle to 4×** to simulate slower Android rendering — reveals animation jank invisible at full speed.

### 2. Browser zoom matrix — test locally on your own machine

Browser zoom changes the effective CSS viewport width, triggering `gsap.matchMedia()` breakpoints. Test all levels:

| Zoom | Effective width (1440px monitor) | Expected behavior |
|---|---|---|
| 100% | 1440px | Desktop layout, full building |
| 125% | ~1152px | Desktop, still above 1024px |
| 150% | ~960px | **Crosses mobile breakpoint** — mobile intro fires |
| 175% | ~823px | Mobile, building scaled down |
| 200% | ~720px | Mobile, small sc value |

Press `Cmd +` / `Cmd -` (Mac) or `Ctrl +` / `Ctrl -` (Windows). After each zoom level, scroll through Hero4 and verify layers cascade fully off screen.

### 3. Safari Responsive Design Mode — closest iOS Safari proxy available on Mac

`Develop → Enter Responsive Design Mode` (`Cmd+Opt+R`). iPhone/iPad presets approximate real iOS Safari toolbar behavior better than Chrome's emulation. Use this for the toolbar-collapse bug specifically.

> Chrome DevTools does **not** simulate the iOS Safari dynamic toolbar collapsing during scroll — that requires real device or BrowserStack.

### 4. Derive `restY` from building height (most robust — avoids per-device tuning)

Instead of guessing `restY` constants per breakpoint, compute it from the actual rendered building size:

```js
// After gsap.set(movehomeRef.current, { scale: sc }) has been applied:
const buildingH = movehomeRef.current.getBoundingClientRect().height;
const vh = getVH();
// Position so 90% of the building is visible at the bottom
const restY = Math.max(0, vh - buildingH * 0.9);
```

This auto-adapts to any screen size — no manual constant needed per device. Add `invalidateOnRefresh: true` on the tween so `restY` recalculates on refresh.

### 5. Common failure patterns and quick fixes

| Symptom | Cause | Fix |
|---|---|---|
| Layers don't fully exit screen | y-multiplier too small | Increase `1.5` → `1.8` for l2–l8 |
| Building invisible on load | `restY` too large, building below fold | Decrease `restY` or use computed approach above |
| Style stuck after zoom | Element missing from `saveStyles()` | Add it to `ScrollTrigger.saveStyles([...])` list |
| Trigger misaligns after orientation flip | Settle delay too short | Increase from `150ms` → `250ms` |
| Building tiny on small phone | `sc` floor too low | Raise floor from `0.28` → `0.32` |
| iOS: layers shift mid-scroll | `window.innerHeight` used instead of `getVH()` | Replace all `window.innerHeight` with `getVH()` |

---

## Research findings that drive this plan

| Finding | Source | Impact on Hero4 |
|---|---|---|
| `gsap.matchMedia()` replaces manual resize; auto-reverts on zoom because zoom fires media query change events | GSAP docs | Replace `build()` + `addEventListener('resize')` pattern |
| Browser zoom = narrower CSS viewport — `min-width` breakpoints fire automatically | MDN, W3C CSSWG Feb 2025 | No DPR detection needed; `gsap.matchMedia()` handles zoom transparently |
| Hardcoded px in GSAP y-values don't update on refresh; only function-based values do | GSAP st-mistakes guide | Convert `y: -1100`, `y: -1500` → `y: () => ...` |
| `invalidateOnRefresh: true` flushes function-based animation value caches; without it only trigger start/end update | GSAP docs | Add to main ScrollTrigger |
| Duration is NOT recalculated by `invalidateOnRefresh` — GSAP limitation confirmed by staff | GSAP forum | Keep `LAYER_DUR`, `BG2_DUR` as constants; use `gsap.matchMedia()` breakpoints for any duration changes |
| `ScrollTrigger.saveStyles()` required to prevent inline-style bleed when matchMedia contexts revert | GSAP docs | Wrap all animated elements in `saveStyles()` before `mm.add()` |
| `gsap.matchMediaRefresh()` forces recalculation after programmatic layout changes | GSAP docs | Call after Lenis re-init if needed |
| iOS Safari dynamic toolbar shrinks `window.innerHeight` during scroll — y-values computed from `innerHeight` shift mid-animation | iOS Safari behavior | Use `window.visualViewport.height` for mobile y-calculations; it stays stable during toolbar collapse |
| `window.visualViewport` fires `resize` event when iOS toolbar collapses — distinct from `window.resize` | MDN VisualViewport API | Listen to `visualViewport.resize` on mobile; call `ScrollTrigger.refresh()` to realign triggers |
| Orientation change on mobile shifts both `innerWidth` and `innerHeight` simultaneously | General mobile behavior | `gsap.matchMedia()` fires on width change; add explicit `screen.orientation.addEventListener('change')` to force `ScrollTrigger.refresh()` after orientation settles (100ms debounce) |
| Android system "Display size" accessibility scaling maps to DPR, not CSS px — browsers abstract it | Android behavior | No code needed — `gsap.matchMedia()` width-based breakpoints handle it transparently |
| Very small phones (320px) → `sc = 0.31` — building nearly invisible | Narrow viewport math | Floor `sc` at `0.28`; add a `(max-width: 479px)` gsap.matchMedia context with adjusted `restY` pushing building higher |

---

## File map

| File | What changes |
|---|---|
| `src/components/Hero4/Hero4.jsx` | Replace manual resize with `gsap.matchMedia()`; function-based y/end values; fix mobile intro; add `saveStyles()`; `invalidateOnRefresh: true`; iOS toolbar fix via `visualViewport`; orientation change handler; min-sc floor |
| `src/components/Hero4/Hero4.module.css` | Update mobile `@media` pre-hydration transform; add `@media (orientation: landscape)` adjustments for very short viewports |

---

## Task 1 — Audit & list every hardcoded px/fixed value in the animation

**Files:**
- Read: `src/components/Hero4/Hero4.jsx`

- [ ] **Step 1: Read current values and map to viewport-relative equivalents**

Current hardcoded values that don't auto-update on zoom/resize:

| Location in code | Current value | Responsive replacement |
|---|---|---|
| `l1` cascade | `y: -1100` | `y: () => -(window.innerHeight * 1.1) / sc` |
| `l2`–`l8` cascade | `y: -1500` | `y: () => -(window.innerHeight * 1.5) / sc` |
| ScrollTrigger `end` | `end: '+=2500'` | `end: () => '+=' + window.innerHeight * 2.5` |
| movehome drift | `y: '-=8vh'` | `y: () => -(window.innerHeight * 0.08) / sc` (see note) |
| bg1 travel | `y: '-180dvh'` | keep — `dvh` string already viewport-relative |
| bg2 rest | `BG2_REST = '-90vh'` | keep — `vh` string already viewport-relative |
| intro `fromY` desktop | `INTRO_OFFSET_Y = '45dvh'` | keep — `dvh` string |
| intro `fromX` desktop | `INTRO_OFFSET_X = '45dvw'` | keep — `dvw` string |
| mobile `fromX` | `0` | Change to `'30dvw'` (see Task 3) |
| mobile `fromY` | `'8dvh'` | Change to `'60dvh'` (see Task 3) |
| mobile `restY` | `'2dvh'` | Change to `'55dvh'` (see Task 3) |
| desktop `restY` | `'45dvh'` | keep — already viewport-relative |

> **Note on `/sc` in y-values:** Layer elements live *inside* `movehome`, which has `scale: sc`. GSAP y-translations are in the element's local (pre-scale) coordinate space. To visually travel `N × innerHeight` on screen, the local y must be `N × innerHeight / sc`. At desktop (sc=1) this equals `N × innerHeight`. At mobile (sc=0.5) the local value doubles, so the scaled visual travel still equals `N × innerHeight`.

- [ ] **Step 2: Verify no other files reference Hero4's pixel values**

```bash
grep -r "1100\|1500\|2500" src/components/Hero4/
```

Expected: hits only in `Hero4.jsx`. If hits in other files, note them before proceeding.

---

## Task 2 — Replace manual resize pattern with `gsap.matchMedia()`

**Files:**
- Modify: `src/components/Hero4/Hero4.jsx`

The current pattern:
```js
const build = () => { ... ctxRef.current = gsap.context(...) }
build()
window.addEventListener('resize', debounced(build))
```

Replace with `gsap.matchMedia()`. It auto-reverts + re-runs when any matching query changes (including zoom, orientation).

- [ ] **Step 1: Add `mmRef` for the matchMedia instance, remove `ctxRef`**

Replace at the top of `useLayoutEffect`:
```js
// REMOVE:
const ctxRef = useRef(null);

// ADD (in component body alongside other refs):
const mmRef = useRef(null);
```

- [ ] **Step 2: Replace the `build()` function + resize handler with `gsap.matchMedia()`**

Full replacement for the first `useLayoutEffect` block:

```js
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
      isMobile: '(max-width: 1023px)',
    },
    (context) => {
      const { isDesktop } = context.conditions;

      const vw = window.innerWidth;
      const sc = Math.min(1, vw / NATURAL_W);

      const fromX = isDesktop ? INTRO_OFFSET_X : '30dvw';
      const fromY = isDesktop ? INTRO_OFFSET_Y : '60dvh';
      const restY = isDesktop ? '45dvh'        : '55dvh';

      const [l1, l2, l3, l4, l5, l6, l7, l8] = layerRefs.current;

      gsap.set(movehomeRef.current, {
        scale: sc,
        transformOrigin: 'top left',
      });

      const CASCADE_START = 700 + CASCADE_OFFSET;
      const LAYER_STEP    = LAYER_DUR + LAYER_GAP;
      const cascadeEnd    = CASCADE_START + 8 * LAYER_DUR + 7 * LAYER_GAP;

      const tl = gsap.timeline({
        scrollTrigger: {
          id: 'hero4-pin',
          trigger: triggerRef.current,
          start: 'top top',
          end: () => '+=' + window.innerHeight * 2.5,
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

        .to(l1, { y: () => -(window.innerHeight * 1.1) / sc, duration: LAYER_DUR, ease: 'power1.in' }, CASCADE_START)

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

        .to(l2, { y: () => -(window.innerHeight * 1.5) / sc, duration: LAYER_DUR, ease: 'power1.in' }, CASCADE_START + 1 * LAYER_STEP)
        .to(l3, { y: () => -(window.innerHeight * 1.5) / sc, duration: LAYER_DUR, ease: 'power1.in' }, CASCADE_START + 2 * LAYER_STEP)
        .to(l4, { y: () => -(window.innerHeight * 1.5) / sc, duration: LAYER_DUR, ease: 'power1.in' }, CASCADE_START + 3 * LAYER_STEP)
        .to(l5, { y: () => -(window.innerHeight * 1.5) / sc, duration: LAYER_DUR, ease: 'power1.in' }, CASCADE_START + 4 * LAYER_STEP)
        .to(l6, { y: () => -(window.innerHeight * 1.5) / sc, duration: LAYER_DUR, ease: 'power1.in' }, CASCADE_START + 5 * LAYER_STEP)
        .to(l7, { y: () => -(window.innerHeight * 1.5) / sc, duration: LAYER_DUR, ease: 'power1.in' }, CASCADE_START + 6 * LAYER_STEP)
        .to(l8, { y: () => -(window.innerHeight * 1.5) / sc, duration: LAYER_DUR, ease: 'power1.in' }, CASCADE_START + 7 * LAYER_STEP)

        .to(
          movehomeRef.current,
          { y: () => `+=${-(window.innerHeight * 0.08) / sc}`, duration: cascadeEnd - CASCADE_START, ease: 'none' },
          CASCADE_START,
        );

      // matchMedia cleanup — return function is called when context reverts
      return () => {};
    },
  );

  return () => {
    mm.revert();
  };
}, []);
```

- [ ] **Step 3: Remove the old `ctxRef` ref declaration from the component body**

Remove line:
```js
const ctxRef = useRef(null);
```

Add in its place:
```js
const mmRef = useRef(null);
```

- [ ] **Step 4: Verify the file still imports ScrollTrigger (needed for saveStyles)**

```bash
grep "ScrollTrigger" src/components/Hero4/Hero4.jsx
```

Expected: `import { ScrollTrigger } from 'gsap/ScrollTrigger'` on line ~4.

- [ ] **Step 5: Start dev server and check console for errors**

```bash
npm run dev
```

Open `http://localhost:4321`. Expected: no console errors. Hero4 visible at top of page.

- [ ] **Step 6: Commit**

```bash
git add src/components/Hero4/Hero4.jsx
git commit -m "feat(hero4): replace manual resize with gsap.matchMedia + function-based y-values"
```

---

## Task 3 — Fix mobile intro: bottom-right → bottom-center, building at screen bottom

**Files:**
- Modify: `src/components/Hero4/Hero4.jsx`
- Modify: `src/components/Hero4/Hero4.module.css`

The user requirement: on mobile, building enters from bottom-right, lands bottom-center — same visual storytelling as desktop, adapted to narrow screens.

Current problem: mobile used `fromX: 0, fromY: '8dvh', restY: '2dvh'` — building dropped from top, not from right, and landed near the top of viewport.

Task 2 already applies `fromX: '30dvw', fromY: '60dvh', restY: '55dvh'`. This task verifies those values visually and adjusts if needed.

- [ ] **Step 1: Update mobile pre-hydration CSS to match new GSAP start state**

In `Hero4.module.css`, update the `@media (max-width: 1023px)` block so the SSR paint matches the new GSAP mobile start:

```css
/* On mobile GSAP starts at x:30dvw, y:60dvh — match here to prevent FOUC */
@media (max-width: 1023px) {
  .movehome {
    transform: translate(30dvw, 60dvh);
  }
}
```

- [ ] **Step 2: Open browser DevTools at 375px width and scroll through the Hero4 intro**

Verify visually:
1. Building enters from **bottom-right** of viewport
2. Building lands at **bottom-center** (layers visible at screen bottom, not top)
3. Scrolling causes layers to cascade off screen

If building lands too high (not at bottom), increase `restY` toward `'65dvh'` or `'70dvh'`.
If building is clipped on right during intro, decrease `fromX` toward `'20dvw'`.

- [ ] **Step 3: Adjust values in `Hero4.jsx` based on visual check**

After visual tuning, update the constants at the top of the file for clarity:

```js
// Mobile intro — building enters from bottom-right, lands bottom-center
const MOBILE_FROM_X  = '30dvw'   // adjust if clipped on entry
const MOBILE_FROM_Y  = '60dvh'   // adjust if too high/low on entry
const MOBILE_REST_Y  = '55dvh'   // adjust until building sits at screen bottom
```

And reference them in the `mm.add()` callback:
```js
const fromX = isDesktop ? INTRO_OFFSET_X : MOBILE_FROM_X;
const fromY = isDesktop ? INTRO_OFFSET_Y : MOBILE_FROM_Y;
const restY = isDesktop ? '45dvh'        : MOBILE_REST_Y;
```

- [ ] **Step 4: Commit**

```bash
git add src/components/Hero4/Hero4.jsx src/components/Hero4/Hero4.module.css
git commit -m "feat(hero4): mobile intro bottom-right to bottom-center with building at screen bottom"
```

---

## Task 4 — Verify zoom, system scaling, and orientation responsiveness

**Files:**
- Read: `src/components/Hero4/Hero4.jsx` (verify after Tasks 2–3)

No code changes in this task — pure verification.

- [ ] **Step 1: Test browser zoom on desktop (Chrome)**

In Chrome at full desktop width:
1. Press `Cmd +` to zoom in to 150%
2. Scroll through Hero4 — layers should cascade correctly, building proportional
3. Press `Cmd +` again to 200%
4. Repeat scroll — building should scale down and re-position (zoom reduced effective viewport width, `gsap.matchMedia()` context rebuilt)

Expected: no layout break, no layers stuck off-screen, no console errors.

- [ ] **Step 2: Test at exact 1023px width (mobile/desktop breakpoint)**

In DevTools, set viewport to `1023px` wide. Scroll through Hero4.
Expected: mobile behavior (bottom-right intro, scaled building).

Set to `1024px`. Scroll through Hero4.
Expected: desktop behavior (diagonal intro from 45dvw/45dvh).

- [ ] **Step 3: Test landscape mobile (iPhone SE landscape ~667×375)**

DevTools → iPhone SE → rotate to landscape.
Expected: building visible at bottom, layers cascade off screen, no horizontal overflow.

- [ ] **Step 4: Test system-level display scaling**

> System-level scaling (macOS "More Space" / Windows 125%) is folded into `window.innerWidth` by the browser — it appears to CSS/JS as a different DPI, which GSAP's viewport calculations already handle correctly since we use `window.innerHeight` (not hardcoded px) for y-values.

On a HiDPI/Retina Mac: open the page at native resolution. Confirm no visual artifacts, building crisp, layers cascade cleanly.

- [ ] **Step 5: If any visual issue found — note the failing condition and fix**

Common fixes:
- Layers don't fully exit screen → increase multiplier in `() => -(window.innerHeight * X) / sc` (try 1.8 for l2-l8 if 1.5 is insufficient)
- Building invisible on very small phones → decrease `MOBILE_REST_Y` to push building higher
- Style bleed after zoom (element stuck in mid-animation) → confirm `ScrollTrigger.saveStyles()` includes that element

- [ ] **Step 6: Commit verification result**

```bash
git add src/components/Hero4/Hero4.jsx src/components/Hero4/Hero4.module.css
git commit -m "fix(hero4): tuned y-multipliers and mobile values after cross-zoom verification"
```

---

---

## Task 5 — iOS Safari: use `visualViewport.height` for mobile y-values

**Files:**
- Modify: `src/components/Hero4/Hero4.jsx`

**Problem:** `window.innerHeight` on iOS Safari includes the browser chrome (address bar + toolbar). When the user scrolls and Safari collapses its toolbar, `innerHeight` grows by ~60-80px mid-animation. Any y-value computed as `window.innerHeight * multiplier` shifts, causing layers to undershoot or overshoot.

**Fix:** `window.visualViewport.height` returns the actual visible content height, stable during toolbar transitions. Also listen to `visualViewport`'s `resize` event to call `ScrollTrigger.refresh()` when the toolbar finally settles.

- [ ] **Step 1: Add a helper at the top of `Hero4.jsx` to read stable viewport height**

Add after the constants block:

```js
// iOS Safari: window.innerHeight changes when the toolbar collapses.
// visualViewport.height is the stable visible content height.
const getVH = () =>
  window.visualViewport ? window.visualViewport.height : window.innerHeight;
```

- [ ] **Step 2: Replace all `window.innerHeight` in y-value functions with `getVH()`**

In the `mm.add()` callback, every function-based y-value:

```js
// BEFORE
y: () => -(window.innerHeight * 1.1) / sc

// AFTER
y: () => -(getVH() * 1.1) / sc
```

Same for all l2–l8, the movehome drift, and the `end` function:

```js
end: () => '+=' + getVH() * 2.5,
```

Full list of replacements:
```js
// l1
y: () => -(getVH() * 1.1) / sc

// l2 – l8
y: () => -(getVH() * 1.5) / sc

// movehome drift
y: () => `+=${-(getVH() * 0.08) / sc}`

// ScrollTrigger end
end: () => '+=' + getVH() * 2.5,
```

- [ ] **Step 3: Add `visualViewport` resize listener to catch toolbar collapse**

Inside the `mm.add()` callback, after the timeline is built, add:

```js
const onVisualResize = () => {
  ScrollTrigger.refresh()
}
window.visualViewport?.addEventListener('resize', onVisualResize)

// return cleanup from matchMedia context
return () => {
  window.visualViewport?.removeEventListener('resize', onVisualResize)
}
```

- [ ] **Step 4: Verify dev server has no errors**

```bash
npm run dev
```

Open `http://localhost:4321`. Check console — no errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/Hero4/Hero4.jsx
git commit -m "fix(hero4): use visualViewport.height for mobile y-values, iOS Safari toolbar safe"
```

---

## Task 6 — Orientation change: force ScrollTrigger refresh after flip

**Files:**
- Modify: `src/components/Hero4/Hero4.jsx`

**Problem:** When a mobile device flips orientation, both `innerWidth` and `innerHeight` change. `gsap.matchMedia()` fires because width crosses a breakpoint (e.g. portrait 390px → landscape 844px crosses 1024px boundary). But if the flip stays within the same breakpoint (e.g. tablet portrait 768px → landscape 1024px), the context doesn't revert + rebuild. ScrollTrigger trigger positions and function-based values may be stale until next `refresh()`.

**Fix:** Listen to `screen.orientation.change` (or `orientationchange` fallback) and call `ScrollTrigger.refresh()` after a short settle delay.

- [ ] **Step 1: Add orientation change listener in the first `useLayoutEffect`**

Add inside the `useLayoutEffect` that sets up `mm`, after `mm.add(...)`:

```js
let orientationTimer
const onOrientationChange = () => {
  clearTimeout(orientationTimer)
  // 150ms — allow browser to repaint after flip before refreshing
  orientationTimer = setTimeout(() => {
    ScrollTrigger.refresh()
  }, 150)
}

// Modern API — supported iOS 16.4+, Android Chrome 38+
if (screen.orientation) {
  screen.orientation.addEventListener('change', onOrientationChange)
} else {
  // legacy fallback
  window.addEventListener('orientationchange', onOrientationChange)
}
```

- [ ] **Step 2: Add cleanup in the return function**

```js
return () => {
  clearTimeout(orientationTimer)
  if (screen.orientation) {
    screen.orientation.removeEventListener('change', onOrientationChange)
  } else {
    window.removeEventListener('orientationchange', onOrientationChange)
  }
  mm.revert()
}
```

- [ ] **Step 3: Add landscape CSS adjustment for short viewports**

On landscape phones, viewport height is ~375px. The building's layer stack may exceed the visible height. Add to `Hero4.module.css`:

```css
/* Landscape mobile: building stack taller than viewport — scale down further */
@media (max-width: 1023px) and (orientation: landscape) {
  .movehome {
    transform: translate(30dvw, 35dvh);
  }
}
```

- [ ] **Step 4: Test orientation flip in Chrome DevTools**

Open DevTools → mobile emulation (iPhone 14, 390×844). Scroll to Hero4. Rotate to landscape. Verify building re-positions and layers still cascade correctly.

- [ ] **Step 5: Commit**

```bash
git add src/components/Hero4/Hero4.jsx src/components/Hero4/Hero4.module.css
git commit -m "fix(hero4): ScrollTrigger.refresh on orientation change, landscape CSS adjustment"
```

---

## Task 7 — Very small phones: floor `sc`, adjust rest position

**Files:**
- Modify: `src/components/Hero4/Hero4.jsx`

**Problem:** At 320px (iPhone SE 1st gen, some Androids), `sc = 320 / 1024 = 0.31`. Building scales to 31% of natural size — barely visible. `restY = '55dvh'` positions the top of the tiny building at 55% down, meaning it's nearly off the bottom edge.

**Fix:** Floor `sc` at `0.28` (arbitrary lower bound — prevents sub-pixel rendering artifacts). Add a `(max-width: 479px)` context within `gsap.matchMedia()` with a lower `restY` (more of the building visible).

- [ ] **Step 1: Floor `sc` in the computation**

In the `mm.add()` callback, change:

```js
// BEFORE
const sc = Math.min(1, vw / NATURAL_W);

// AFTER
const sc = Math.max(0.28, Math.min(1, vw / NATURAL_W));
```

- [ ] **Step 2: Add a third breakpoint condition for tiny phones**

Update the `mm.add()` conditions:

```js
mm.add(
  {
    isDesktop: '(min-width: 1024px)',
    isMobile:  '(min-width: 480px) and (max-width: 1023px)',
    isTiny:    '(max-width: 479px)',
  },
  (context) => {
    const { isDesktop, isTiny } = context.conditions;
    const isMobileAny = !isDesktop;

    const fromX = isDesktop ? INTRO_OFFSET_X : MOBILE_FROM_X;
    const fromY = isDesktop ? INTRO_OFFSET_Y : MOBILE_FROM_Y;
    // tiny phones: build visible higher — 40dvh instead of 55dvh
    const restY = isDesktop ? '45dvh' : isTiny ? '40dvh' : MOBILE_REST_Y;

    // ... rest of animation unchanged
  }
)
```

- [ ] **Step 3: Update pre-hydration CSS for tiny phones**

Add to `Hero4.module.css`:

```css
/* Tiny phones (≤479px) — building starts higher to stay visible */
@media (max-width: 479px) {
  .movehome {
    transform: translate(30dvw, 40dvh);
  }
}
```

- [ ] **Step 4: Test at 320px in DevTools**

DevTools → set viewport to 320×568 (iPhone SE 1st gen).
Verify:
1. Building visible at bottom on load
2. Intro animation fires (bottom-right → rest position)
3. Layers cascade off screen on scroll

- [ ] **Step 5: Commit**

```bash
git add src/components/Hero4/Hero4.jsx src/components/Hero4/Hero4.module.css
git commit -m "fix(hero4): floor sc at 0.28, tiny phone breakpoint 479px with adjusted restY"
```

---

## Task 8 — Final cross-device verification

**Files:** Read-only verification

- [ ] **Step 1: Test matrix**

| Device | Viewport | Expected |
|---|---|---|
| iPhone 14 Pro portrait | 393×852 | Mobile intro, building at bottom, cascade exits screen |
| iPhone 14 Pro landscape | 852×393 | Landscape adjustment, building visible, cascade works |
| iPhone SE 1st gen portrait | 320×568 | Tiny breakpoint, sc=0.28, building visible |
| Pixel 7 portrait | 412×915 | Mobile intro, building at bottom |
| iPad Mini portrait | 768×1024 | Mobile breakpoint (<1024), scaled building |
| iPad Pro landscape | 1366×1024 | Desktop breakpoint, full-size building |
| Desktop 125% zoom | ~1228px effective | gsap.matchMedia refires if crosses 1024px |
| Desktop 150% zoom | ~1024px effective | May cross mobile breakpoint — verify mobile intro fires |

- [ ] **Step 2: Fix any failures found during matrix test**

Common failure patterns and fixes:

- **Layers don't fully exit screen** → increase y-multiplier from `1.5` to `1.8` for l2–l8
- **Building invisible on load (iOS)** → `getVH()` returning wrong value before `visualViewport` ready; add `?? window.innerHeight` fallback: `window.visualViewport?.height ?? window.innerHeight`
- **Trigger misalign after orientation flip** → increase settle delay from `150ms` to `250ms`
- **Style stuck after zoom** → verify all animated elements are in `ScrollTrigger.saveStyles()` list

- [ ] **Step 3: Commit final fixes**

```bash
git add src/components/Hero4/Hero4.jsx src/components/Hero4/Hero4.module.css
git commit -m "fix(hero4): cross-device verification fixes from test matrix"
```

---

## Appendix: Key GSAP API reference for this plan

### gsap.matchMedia() pattern
```js
const mm = gsap.matchMedia();
ScrollTrigger.saveStyles([el1, el2, ...]); // must precede mm.add()

mm.add({ isDesktop: '(min-width: 1024px)', isMobile: '(max-width: 1023px)' }, (ctx) => {
  const { isDesktop } = ctx.conditions;
  // all GSAP / ScrollTrigger code here — auto-reverts when query stops matching
  return () => {}; // optional cleanup
});

// cleanup
return () => mm.revert();
```

### Function-based values with invalidateOnRefresh
```js
scrollTrigger: {
  end: () => '+=' + window.innerHeight * 2.5, // recalculates on ST.refresh()
  invalidateOnRefresh: true,                   // also flushes y/x tween caches
}

// y-value example — recalculates when ST.refresh() invalidates
gsap.to(el, { y: () => -(window.innerHeight * 1.5) / sc })
```

### Why duration is exempt
Duration is converted to a fractional timeline position at creation time and is not re-invalidated on refresh — per GSAP staff. Changes to duration per breakpoint must be done inside separate `gsap.matchMedia()` contexts, not via `invalidateOnRefresh`.

### Lenis interaction
Lenis is initialized globally in `GlobalSetup`. After `mm.revert()` + re-run (triggered by zoom/resize), Lenis continues to drive `ScrollTrigger.update()` via its existing event binding — no Lenis reset needed. If triggers appear misaligned after a zoom-triggered rebuild, call `ScrollTrigger.refresh()` manually after the matchMedia context runs.

### iOS Safari `visualViewport` API
```js
// Stable visible height — unaffected by toolbar collapse
const getVH = () =>
  window.visualViewport?.height ?? window.innerHeight;

// Listen for toolbar collapse (distinct from window resize)
window.visualViewport?.addEventListener('resize', () => {
  ScrollTrigger.refresh()
})
```
`visualViewport.height` is supported iOS 13+, Android Chrome 61+, all modern browsers.

### Orientation change
```js
// Modern (iOS 16.4+, Android Chrome 38+)
screen.orientation.addEventListener('change', handler)

// Legacy fallback
window.addEventListener('orientationchange', handler)
```
Always debounce 100–250ms — browser needs time to repaint before measurements are accurate.

### `sc` floor for tiny phones
```js
// Without floor: 320px → sc = 0.31 (barely visible)
// With floor: sc = max(0.28, min(1, vw/1024))
const sc = Math.max(0.28, Math.min(1, window.innerWidth / NATURAL_W));
```
