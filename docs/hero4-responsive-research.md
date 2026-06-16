# Hero4 Responsive Zoom — Research Results

_104 agents, 21 sources fetched, 80 claims extracted, 25 verified, 17 confirmed, 8 killed_

---

## Summary

Responsive GSAP scroll animations that adapt to zoom, DPI, and viewport changes require three coordinated strategies:

1. Use `gsap.matchMedia()` (GSAP 3.11+) with CSS media query strings and a conditions object to create breakpoint-scoped animation contexts that auto-revert when queries stop matching — `ScrollTrigger.matchMedia()` is deprecated (3.11) and removed (3.13).
2. Replace all fixed pixel values (`y: -1100`) with function-based values so `ScrollTrigger.refresh()` recalculates them on resize; pair with `invalidateOnRefresh: true` to flush animation property caches.
3. Detect runtime DPI/zoom changes via `window.matchMedia()` on a resolution media query in `dppx` units, since `window.devicePixelRatio` has no native change event and reflects both system DPI and browser zoom level combined in Chrome and Firefox.

---

## Confirmed Findings

### 1. `gsap.matchMedia()` replaces deprecated `ScrollTrigger.matchMedia()`
- `ScrollTrigger.matchMedia()` deprecated at GSAP 3.11, **removed in 3.13**
- Community reports `TypeError: ScrollTrigger.matchMedia is not a function` in 3.13
- `gsap.matchMedia()` accepts standard CSS media query strings: `(min-width: 800px)`, `(max-width: 799px)`, `(prefers-reduced-motion: reduce)`
- **Sources:** https://gsap.com/docs/v3/GSAP/gsap.matchMedia/, https://gsap.com/docs/v3/Plugins/ScrollTrigger/static.matchMedia/

### 2. `gsap.matchMedia()` auto-reverts on breakpoint exit
- All GSAP animations and ScrollTriggers created inside a handler revert automatically when the query stops matching
- Use a **conditions object** with named boolean properties (`isDesktop`, `isMobile`, `reduceMotion`) to branch in a single callback
- Call `gsap.matchMediaRefresh()` to force recalculation after programmatic layout changes (e.g. programmatic zoom)
- **Caveat:** `saveStyles()` required — without it, inline styles from the exiting breakpoint contaminate the entering one. Use `ScrollTrigger.saveStyles(elements)` on all animated elements before `mm.add()`
- **Caveat:** `gsap.from()` can cause elements to vanish on revert since the playhead resets to start state — prefer `gsap.fromTo()` or `gsap.to()`
- **Sources:** https://gsap.com/docs/v3/GSAP/gsap.matchMedia/, https://codepen.io/GreenSock/pen/yLEKpyP

### 3. Function-based y-values + `invalidateOnRefresh: true`
- Hardcoded pixel values (e.g. `y: -1100`) are captured at animation creation and never update
- Function-based values (`y: () => -window.innerHeight * 1.1`) are recalculated by `ScrollTrigger.refresh()`
- `invalidateOnRefresh: true` on the ScrollTrigger flushes **both** trigger positions AND animation value caches — without it, only start/end positions update, not `y`/`x` values
- **Critical exception: `duration` is NOT recalculated on refresh** — confirmed by GSAP admin. Duration changes across breakpoints require separate `gsap.matchMedia()` contexts, not `invalidateOnRefresh`
- **Sources:** https://gsap.com/resources/st-mistakes/, https://css-tricks.com/responsive-animations-for-every-screen-size-and-device/

### 4. `window.devicePixelRatio` — behavior and detection
- Reflects **both system DPI and browser zoom** combined in Chrome and Firefox
- Value 1 = 96 DPI; 2 = HiDPI/Retina; modern mobile often exceeds 2
- **Has no native change event** — detect runtime changes (zoom, multi-monitor drag) via:
  ```js
  const query = window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`)
  query.addEventListener('change', handler) // recreate listener each time
  ```
- **Safari caveat:** WebKit historically did not update DPR on browser zoom (WebKit bug #87407) — DPR-based zoom detection is unreliable cross-browser
- **Sources:** https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio

### 5. Browser zoom → viewport width shrinks → `gsap.matchMedia()` fires automatically
- MDN: "a zoomed-in viewport is indistinguishable from a narrower viewport"
- W3C CSSWG (Feb 2025): "as you zoom in, media viewport size also gets smaller"
- Zoom fires both `resize` events and media query `change` events
- **Practical implication: no special zoom detection code needed** — `gsap.matchMedia()` breakpoints handle zoom transparently because the browser already maps zoom to viewport-width changes

---

## Killed Claims (refuted 2-3 or 0-3)

| Claim | Vote | Why killed |
|---|---|---|
| Pinch-zoom does not change devicePixelRatio (only browser zoom does) | 1-2 | Insufficient primary evidence; behavior varies by device |
| ScrollTriggers inside matchMedia are auto-killed without needing manual cleanup | 0-3 | False — `saveStyles()` and explicit cleanup still needed |
| Safari reports constant `window.devicePixelRatio = 1` regardless of zoom | 0-3 | Overstated; modern Safari behavior differs from old WebKit |
| Chrome/Firefox zoom at 200% always reports `devicePixelRatio = 2` | 1-2 | DPR is zoom × system DPI combined — not a clean 1:1 mapping |
| Windows 125% system scaling maps to `devicePixelRatio = 1.25` exactly | 1-2 | Browser abstraction layer; mapping not guaranteed exact |
| ScrollTrigger tween durations convert to pixel scroll distance (1s = 100px over 400px) | 1-2 | Oversimplification; GSAP scrub/duration relationship is not that linear |
| Best practice is to debounce resize with `gsap.delayedCall()` and fully recreate | 0-3 | `gsap.matchMedia()` is the endorsed pattern; manual recreate is a workaround |
| `invalidateOnRefresh` recalculates function values at next render with `window.pageYOffset` offset needed | 0-3 | GSAP handles coordinate space internally; no manual offset required |

---

## Caveats

1. **Duration not refreshable:** `invalidateOnRefresh: true` does not recalculate tween duration. For responsive duration changes, use separate `gsap.matchMedia()` breakpoints with different duration constants.

2. **Safari DPR:** Cross-browser DPR-based zoom detection is unreliable. The viewport-width approach (via `gsap.matchMedia()`) is universally safe.

3. **`saveStyles()` is required:** Without `ScrollTrigger.saveStyles(elements)` called before `mm.add()`, inline styles from a reverting breakpoint bleed into the next context.

4. **iOS Safari `innerHeight`:** iOS Safari's dynamic toolbar changes `window.innerHeight` during scroll. Function-based vh values using `window.innerHeight` may shift mid-sequence — `dvh`/`svh`/`lvh` CSS units are more stable but only available in string form (not recalculated by `invalidateOnRefresh`). Consider using `svh` (small viewport height) for mobile y-values.

---

## Open Questions

1. How do `y: () => window.innerHeight * -0.8` function values behave on iOS Safari when the dynamic toolbar changes `innerHeight` during scroll — does `ScrollTrigger.refresh()` compensate?
2. Correct pattern for rebuilding pinned ScrollTrigger on orientation change where both dimensions and DPR shift simultaneously?
3. Does `gsap.matchMedia()` context revert + rebuild interact correctly with Lenis (as initialized in GlobalSetup) — does it require a `ScrollTrigger.refresh()` call to realign trigger positions?

---

## Sources

| URL | Quality | Claims |
|---|---|---|
| https://gsap.com/docs/v3/GSAP/gsap.matchMedia/ | primary | 5 |
| https://gsap.com/docs/v3/Plugins/ScrollTrigger/static.matchMedia/ | primary | 5 |
| https://gsap.com/resources/st-mistakes/ | primary | 4 |
| https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio | primary | 5 |
| https://developer.chrome.com/docs/css-ui/scroll-driven-animations | primary | 2 |
| https://css-tricks.com/responsive-animations-for-every-screen-size-and-device/ | blog | 3 |
| https://gsap.com/community/forums/topic/44174-updating-responsive-timeline-tween-durations-in-a-scrolltrigger/ | forum | 4 |
| https://gsap.com/community/forums/topic/37385-timeline-scrolltrigger-invalidateonrefresh/ | forum | 3 |
| https://gsap.com/community/forums/topic/45170-viewport-units-vw-vh-svh-lvh-dvh-etc-dont-work-as-expected-in-scrolltrigger/ | forum | 4 |
| https://gsap.com/community/forums/topic/37591-scrolltrigger-100vh-calculation-change-in-3122/ | forum | 4 |
| https://www.bennadel.com/blog/3811-looking-at-how-browser-zoom-affects-css-media-queries-and-pixel-density.htm | blog | 5 |
