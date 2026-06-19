# Client Care — Horizontal Parallax Section (Option 3)

**Date:** 2026-06-19
**Component:** `src/components/ti-option3/04_O3_ClientCare/`
**Status:** Approved design — ready for implementation plan
**Reference:** Aramco "The Birth of Oil" scrollytelling (horizontal parallax, text faster than imagery)

## Goal

Full replacement of the existing Client Care section. Replace the hover-accordion
layout with a horizontal-parallax scroll experience: as the user scrolls vertically,
bullet content slides left→right at layered speeds over slow-drifting background photos.

## Approach (decided)

**Vertical-scroll parallax, no full-section pin (Approach A).** The section scrolls
normally top-to-bottom. Scroll progress drives horizontal `translateX` on text and
background layers via GSAP ScrollTrigger `scrub`. The section is never GSAP-pinned,
so there is no risk of the page locking.

Rejected: pinned horizontal conveyor (Approach B) — heavier, fights mobile, higher
risk against the project's pin rules.

## Layout

```
┌─────────────────────────────────────────────┐
│  STICKY HEADER (position: sticky, top)        │
│  "A Culture of Trust"  (--font-display)       │
│  intro DESCRIPTION paragraph (--font-body)    │
├─────────────────────────────────────────────┤
│  SCROLL AREA (tall)                           │
│   ┌─ bucket 1 ──────── bg image 1 (slow) ──┐  │
│   │  row: title  →→→→   (fast)              │  │
│   │       content →→    (slower)            │  │
│   │  row: title  →→→→                       │  │
│   │       content →→                        │  │
│   └─────────────────────────────────────────┘ │
│   ┌─ bucket 2 ──────── bg image 2 ──────────┐  │
│   │  …two rows…                             │  │
│   └─────────────────────────────────────────┘ │
│   …bucket 3, bucket 4…                         │
└─────────────────────────────────────────────┘
```

- **Sticky header:** `position: sticky` only. NOT GSAP-pinned. Safe per CLAUDE.md
  (the rule forbids CSS sticky on elements GSAP *pins* — nothing is pinned here).
- **4 buckets**, each = a themed band holding **2 bullet rows** + **1 background image**.
- Each **row** = a `title` line and a `content` paragraph that translate independently.

## Motion

All scroll-driven via GSAP ScrollTrigger with `scrub`. Per row / per layer:

| Layer | Horizontal range | Relative speed |
|---|---|---|
| Background image | small (e.g. −6% → +6%) | slowest (depth) |
| `content` paragraph | medium | slower than title |
| `title` line | large | fastest |

- Direction: left → right as the band scrolls up through the viewport.
- Each band gets its own ScrollTrigger (`trigger: bandEl`, `start: 'top bottom'`,
  `end: 'bottom top'`, `scrub: <1–1.5>`, `invalidateOnRefresh: true`).
- The exact translate percentages are tuning constants defined once at top of the
  component (e.g. `TITLE_X`, `CONTENT_X`, `IMG_X`) so they are easy to adjust.

### Required conventions (from CLAUDE.md / sibling components)

- Wrap all GSAP in `gsap.context(() => { … }, rootRef)`; `ctx.revert()` on cleanup.
- Build animations inside `document.fonts.ready.then(buildAnims)`.
- `invalidateOnRefresh: true` on every ScrollTrigger (uses %/vw units).
- Rebuild on theme change: `window.addEventListener('themechange', buildAnims)` and
  revert the previous context first (mirror `03_O3_TrustWall`).
- Do NOT reinitialize Lenis or ScrollTrigger globally — GlobalSetup owns them.
- No `position: sticky` on any GSAP-pinned element (none are pinned).

### Reduced motion

Honor `prefers-reduced-motion: reduce`: skip all `translateX` animation. Render every
row in its final resting position, fully legible. Background images static.

## Data

Curated to **8 items**, reusing existing `title` + `content` copy verbatim. The
`benefit` field is dropped. Grouped into 4 themed buckets:

| Bucket | Item ids | Theme label |
|---|---|---|
| 1 | `advocate`, `client-care` | Care |
| 2 | `technical-judgment`, `make-it-work` | Judgment |
| 3 | `senior-engineers`, `communication` | Process |
| 4 | `pricing`, `trusted` | Confidence |

Dropped (overlap with kept items): `early-guidance`, `details`, `plan-check`.

Data lives in a `BUCKETS` array at the top of the component:
```js
const BUCKETS = [
  { label: 'Care', bg: '/pav-img/clientcare-bg-1.jpg', items: [ {id,title,content}, … ] },
  …
]
```

## Backgrounds

- 4 free-license stock photos (architecture / blueprints / construction / trust),
  downloaded into `public/pav-img/` as `clientcare-bg-1.jpg` … `clientcare-bg-4.jpg`.
- Predictable filenames so the user can swap files later without code changes.
- Rendered low-opacity behind text with a `--color-primary` tint overlay so titles
  and body stay readable across all six themes.

## Theming (CLAUDE.md — mandatory)

Every color and font is a CSS variable. No hardcoded hex or font family.

| Element | Token |
|---|---|
| Title | `--font-display`, color `--color-primary` (or accent) |
| Content | `--font-body`, color from gray scale token |
| Bucket label / eyebrow | `--color-accent`, `--font-body` |
| Background tint overlay | `--color-primary` |
| Section surface | `--surface-page` |

## Files

- **Move to `_unused/`:** `04_O3_ClientCare.jsx`, `04_O3_ClientCare.module.css`
  (the current accordion version).
- **Create:** new `04_O3_ClientCare/04_O3_ClientCare.jsx` + `.module.css` (same path
  and default export name → `option3.astro` import is unchanged).
- **Add:** `public/pav-img/clientcare-bg-1.jpg` … `-4.jpg`.
- **Untouched:** `option3.astro` (already imports the component and wraps it in
  `<SectionTheme>`).

## Out of scope / YAGNI

- No new color scheme or font pair.
- No horizontal pin/conveyor.
- No CMS/data extraction — copy stays inline in the component.
- No changes to other sections.

## Success criteria

1. Scrolling the section moves titles, content, and background images horizontally at
   three distinct speeds (title fastest, image slowest).
2. Header stays pinned at top while bullet bands scroll past, then releases.
3. Switching theme (color + font) updates the whole section live; animation rebuilds.
4. `prefers-reduced-motion` shows a static, fully legible layout.
5. No page-lock / scroll-stuck behavior; no console errors; build passes.
