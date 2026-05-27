# FirmCultureOption3 — Design Intent Document

> Finalized design intent. All questions resolved.

---

## Animation sequence

### Phase 0 — Entry (before scroll starts)

- Sticky background is **always `--color-primary`** (never white, no fade-in transition)
- At rest, NYA is at scale ~8 — only the bottom stem of "Y" fills the viewport
- Because NYA is white and enormous, the primary-color background is fully hidden behind it
- This creates the "portal" effect: the dark bg is always there; what you see depends on how much of the NYA has zoomed out to reveal it

### Phase 1 — NYA zoom-out, words emerge (scroll 0%–50%)

- As user scrolls, NYA shrinks from ~8x toward ~1.67x (still covering ~50% of viewport width)
- Transform origin: `center bottom` — Y stem stays anchored at viewport center-bottom; N and A appear simultaneously on left/right as zoom-out progresses
- As NYA shrinks, the primary-color background is revealed around the edges of the letters
- ~100+ words fill the background in a dense grid (all-caps, `--font-body`)
- Words start at white 10% opacity; a random 2 flash bright (white 100% opacity) at any time

### Phase 2 — NYA continues to final size (scroll 50%–85%)

- NYA continues shrinking from ~50% viewport coverage toward final resting size (~30vw)
- As NYA moves toward its natural position, the tagline above it comes into view
- Word cloud flashing continues throughout

### Phase 3 — Tagline visible (scroll 85%–100%)

- **"Care, Trust, and Serious Work."** and smaller **"NYA"** below it are **always in their final position — no animation**
- They are simply hidden above the large NYA at the start, and revealed as NYA zooms out and moves down.
- Same portal mechanic as the word cloud — no fade-in, no y-offset tween -> Word cloud remains as is of consistent zoom

---

## Word cloud — resolved

| Property                 | Final answer                                                                                                              |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------- |
| Word color (muted)       | White at 10% opacity                                                                                                      |
| Word color (highlighted) | **White at 100% opacity — no accent color, no hue shift**                                                          |
| Flash behavior           | 2 words bright at any time, ~800ms cycle, white only                                                                      |
| Word count               | ~100+ words — dense, near-full viewport tiling                                                                           |
| Word positions           | Fixed grid across background, all-caps; culture words randomly placed in the grid, flash independently at staggered times |
| Font                     | `--font-body` (sans-serif)                                                                                              |

---

## NYA text — resolved

| Property         | Final answer                                                                                   |
| ---------------- | ---------------------------------------------------------------------------------------------- |
| Starting scale   | ~8x (only Y stem visible at viewport center)                                                   |
| Midpoint scale   | ~1.67x (NYA covers ~50% of viewport width at Phase 1 end)                                      |
| Final scale      | 1x (30vw natural size)                                                                         |
| Color            | White                                                                                          |
| Font             | `--font-display` (serif)                                                                     |
| Transform origin | `center bottom` — Y stem anchors at bottom-center; N and A emerge symmetrically on zoom-out |

---

## Background — resolved

| Property   | Final answer                                                                                    |
| ---------- | ----------------------------------------------------------------------------------------------- |
| Color      | Always `--color-primary` — no white-to-primary transition                                    |
| Visibility | Revealed by NYA zoom-out ("portal" effect — the white NYA covers the bg, shrinking exposes it) |
| Default    | Navy (`#0B1F3B` — the `navy-blue` scheme default), responds to theme switcher              |

---

## What needs to change in the implementation

| Aspect             | Currently built                   | What it should be                                                    |
| ------------------ | --------------------------------- | -------------------------------------------------------------------- |
| Background         | Fades white →`--color-primary` | Always `--color-primary`, no transition                            |
| Flash highlight    | Accent color at 100% opacity      | White at 100% opacity only                                           |
| Transform origin   | `center center`                 | `center bottom`                                                    |
| Word cloud density | 22 words, sparse                  | ~100+ words, dense grid                                              |
| Tagline layout     | Fades in / slides up over NYA     | Static, always in position — revealed by NYA zoom-out, no animation |
| Phase midpoint     | No distinct midpoint in animation | NYA reaches ~50vw at ~50% scroll progress                            |
