# NYA TI Microsite — Design Audit v2

**Page:** `/` (index.astro — Hero → TIDifferences → FirmCulture → TrustWall → ClientCare → Ethos → Footer)
**Date:** 2026-06-25
**Method:** Live capture at `localhost:4321` via Playwright CLI. Swept mobile 390×844, tablet 768×1024, desktop 1440×900, ultrawide 2560×1440 at 9 scroll depths each, plus a forced-hydration probe and a live resize test.
**Lenses:** taste-skill (anti-slop), ui-ux-pro-max (a11y / interaction / hierarchy), refactoring-ui (hierarchy, spacing, depth).

> Note: the page moved from `/option3` to `/` since v1. `option3.astro` no longer exists; `index.astro` is now the production page.

---

## What v1 flagged — current status

| v1 # | Issue | Status now |
|---|---|---|
| 1 | Ethos / Footer pushed off reachable scroll | 🔴 **Still broken on load — root cause found & fixed this pass (see A).** |
| 2 | ClientCare copy unreadable over photos | 🟢 Largely fixed — dark scrim added, copy readable at all widths. Borderline only on brightest photo regions. |
| 3 | Disc tower absent on narrow mobile | 🟢 Fixed — red/green disc renders on 390. |
| 5 | Accent split (cyan vs coral/green) | 🟡 Unchanged — Risk red / Solution green, motivated. Confirm intentional. |
| 6 | Theme switcher ships on live page | 🟢 Fixed — runtime switcher removed; schemes now static, explorable at `/style-explorer`. |
| 7 | Visible em-dashes | 🟢 Fixed — zero em/en dashes in visible copy (all remaining are code comments). Ethos uses ` - Nabih Youssef`. |

---

## A. 🔴 ROOT CAUSE — lazy hydration breaks all scroll measurement (FIXED this pass)

**Symptom (reproduced live):** On a normal load + scroll-through, the document's scroll height was wrong (desktop 19,285px) and the bottom of the page landed *inside* the pinned ClientCare section. Ethos and the Footer sat thousands of px past the reachable range — unreachable. Forcing every section to hydrate and refreshing put the height at 26,451px with the Footer correctly at the bottom. This is v1 #1, and it matches the reported bugs: "culture section loads before trust is done," "Hero needs a refresh on screen adjustment," "sometimes only layer L1 shows."

**Why:** `index.astro` shipped the four lower sections as `client:visible`:

```
<O3FirmCulture client:visible />
<O3TrustWall   client:visible />
<O3ClientCare  client:visible />   ← this one PINS (huge pin-spacer)
<O3Ethos       client:visible />
```

Each section registers its GSAP ScrollTrigger pins only when it hydrates (on scroll into view). GlobalSetup's refresh chain (`400ms` / `fonts.ready` / `window.load`) all fires at the top of the page, **before** these sections exist. When ClientCare later hydrates mid-scroll it inserts a viewport-scale pin-spacer that nothing re-measures, so every section below it (Ethos, Footer) is displaced past the reachable scroll. Hydration order between FirmCulture and TrustWall is also non-deterministic, which is the "culture before trust" flash, and a refresh landing while the Hero's `client:load` cascade is still mid-build is what intermittently parks all but L1.

**Fix applied:** switched the four lower sections to `client:load` so all pins exist by the time GlobalSetup's `fonts.ready` / `load` refresh fires.

```diff
- <O3FirmCulture client:visible />
- <O3TrustWall   client:visible />
- <O3ClientCare  client:visible />
- <O3Ethos       client:visible />
+ <O3FirmCulture client:load />
+ <O3TrustWall   client:load />
+ <O3ClientCare  client:load />
+ <O3Ethos       client:load />
```

**Verified after fix:** desktop height 26,451px (matches the healthy probe); Footer reachable at true bottom; Ethos quote sits directly above it; live resize recomputes height correctly (26,451 → 34,933 in portrait); Hero rebuilds with the full building stack on resize; zero console / page errors.

**Tradeoff:** all islands now hydrate at load instead of lazily. The Hero pin holds the viewport during load so there's no visible jank, and the JS is bundled either way — only execution timing changes. If first-load CPU on low-end phones becomes a concern, the more surgical alternative is to keep `client:visible` but add a `ResizeObserver` on `document.body` in GlobalSetup that debounce-calls `ScrollTrigger.refresh()` (guarded to not fire mid-pin-scrub). Current fix is the lower-risk one.

**Still monitor:** the intermittent "only L1 layer" Hero state did not reproduce after the fix across load + resize, but it's a Hero-internal race (matchMedia context rebuild crossing a breakpoint while base images are still decoding), not fully closed by this change. If it recurs, gate the Hero's matchMedia rebuild on `baseImgs.every(imgReady)` before re-running `buildTimeline`.

### A.2 🔴 FOLLOW-UP — load-window bleed-through ("flashing hero images") (FIXED this pass)

**Symptom (reproduced live, prod build):** during the ~1s window between first paint and the building images loading, the next section's cyan headline ("When structure is treated as a second thought…") and a white wedge flashed into the bottom of the hero viewport instead of a clean navy hero. Intermittent because the window is timing-dependent (image cache + hydration speed). This is the reported "flashing hero images on load."

**Root cause (confirmed by live DOM probe):** the hero's navy `loadCover` (the element that masks the hero until the building paints) was `z-index: 2`. The next section `#section-ti-differences` is `z-index: 36` and, before its pin-spacer exists, overlaps ≈450px **up into** the hero's 100vh. Because `.home` deliberately creates no stacking context (so the building can ride over the rising section during scroll), the cover and the next section compete at the root level — and `36 > 2`, so the next section painted **over** the cover.

**Fix applied:** raised `.loadCover` to `z-index: 40` — above the next section (36), below the lowest building layer (`l8`, z 42), the header/title (z 60) and nav. The cover only exists in the pre-paint load window (removed via `display:none` in `buildTimeline` the instant the building paints) and there is no scroll during that window, so the change has zero effect on the scroll animation; it only stops the bleed-through.

```diff
- .loadCover { … z-index: 2; }
+ .loadCover { … z-index: 40; }   /* above next section (36), below l8 (42) */
```

**Verified after fix:** captured the exact buggy state (next section at top=450, building hidden, cover `display:block`) on the prod build — cover `z-index:40` now fully masks it; the load window shows a clean navy hero (title + logo + sidenav) with no cyan bleed and no white wedge, across repeated throttled loads.

---

## Remaining findings (prioritized)

### 🟠 1. ClientCare cross-fade overlap mid-transition
During the pinned horizontal conveyor, the sticky section heading "The Experience of Working With NYA," the active panel copy, and the in/out-going panel text briefly co-exist on screen — readable text stacked over fading text. Worst on ultrawide where the heading and two panels share the frame. *ux: `state-transition`, `continuity`.* Tighten the crossfade so outgoing copy is below ~0.2 opacity before incoming copy passes ~0.3, and/or fade the sticky heading out once the first panel is centred.

### 🟠 2. No conversion path until the Footer (~26,000px down) — ADDRESSED this pass
Was: Hero is brand-only; the only CTA ("Send Us an Email") was at the very bottom. *ux: `primary-action`; persuasion.*

**Fix applied:** added a subtle, persistent **"Contact Us"** pill (mailto `info@nyase.com`, prefilled subject "Tenant Improvement Inquiry") to the ClientCare section. It lives inside the GSAP-pinned `stage`, so it holds its bottom-right spot for the entire pinned ClientCare run — the longest dwell on the page — giving a mid-page conversion path long before the footer, then scrolls away cleanly once the section unpins. Styled with theme variables (frosted primary fill, accent on hover/focus), keyboard-focusable, reduced-motion aware.

**Verified:** across 7 scroll depths through the pinned run the CTA stays fixed bottom-right (visible, opacity 1, correct mailto href); past the section it leaves the viewport (not fixed into Ethos/Footer). Confirmed on the prod build at 1440×900.

Optional future polish: swap the generic label for a stronger hook ("Send us your drawings for a free second look") if a more aggressive ask is wanted.

### 🟡 3. SideNav uses rotated vertical text + section-number labels
The left rail runs "PROJECT VALUE" rotated 90° plus `00/ 01/ 02/…` section numbers. taste flags both vertical rotated text and section-number micro-labels as agency-portfolio tells. Consider horizontal dot/label nav, or drop the index numbers.

### 🟡 4. Eyebrow proliferation
Stacked uppercase tracked labels across the scroll: COMMON PROBLEMS, DONE RIGHT, SITE INTELLIGENCE / FRONT-END CLARITY / DESIGN AMBITION, ESTABLISHED, EXPOSED RISK n/7. taste budget is ~1 eyebrow per 3 sections. The Risk/Solution per-row caps (SITE INTELLIGENCE etc.) read as a spec-sheet; the section headline alone usually carries it.

### 🟡 5. Risk/Solution list = numbered rows with a hairline under every row
v1 #8, unchanged. `01–07` with a divider under each row is the spec-sheet pattern taste/refactoring-ui both flag. The active-card outline already carries focus; the per-row hairlines add noise. Group into 2–3 clusters with sparse dividers, or drop the per-row rule.

### 🟢 6. Mobile dead-scroll between sections
On 390, the gap below the Solution list (and similar seams) leaves a tall empty dark band before the next section. Tighten inter-section scroll length on narrow/portrait so the conveyor doesn't idle.

### 🟢 7. ClientCare body copy contrast on bright photos
Scrim fixed the worst of v1 #2, but the mid-gray paragraph over the brightest photo regions (applause / bright conference room) is still near the 4.5:1 AA floor. Verify against the brightest pixels, not the average; bump the scrim opacity or the text to near-white on those two panels. *ux: `color-contrast`.*

### 🟢 8. Ethos portrait crop
The bleeding founder portrait is cropped hard (`.inner { height: 62vh; overflow: hidden }` on desktop) — mid-reveal frames show an extreme forehead close-up. Relax the fixed height so the crop can't clip awkwardly if measurements shift.

---

## Net read

The craft is strong and most v1 issues are closed. The one genuinely page-breaking bug — Ethos/Footer unreachable, the section-load race, the resize fragility — all traced to one cause (`client:visible` on scroll-pinned sections) and is fixed this pass. What's left is polish (transition overlap, eyebrow restraint, list pattern, mobile dead-scroll) and the one strategic gap that survives from v1: no conversion path before the footer.
