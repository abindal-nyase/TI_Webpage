# Ethos Section — Change Spec (for review)

**Component:** `src/components/05_O3_Ethos/`   **Section id:** `#nya-culture`
**Base:** current `origin/main` copy (reverted to this — no crossfade, single quote).
**Status:** DRAFT — confirm decisions before I code.

Tick ✅keep / ✏️change and fill `→` blanks. Nothing is built yet.

---

## A. What origin/main currently is (the base we build on)

- **One quote**, left column. Copy:
  > "I treat every tenant improvement like a home-cooked meal. I take my time, I
  > use good ingredients, and I remember who I am cooking for. Success is not
  > measured by how many projects we finish, but by how many clients call us back.
  > That quiet dignity of doing the work well, where no one notices the structure
  > but everyone feels its safety is my art."
- Big decorative **`“`** above the quote. ✅ (you like it)
- Fonts (updated 2026-07-10 for a professional-engineering tone): **Libre Baskerville**
  upright (quote + mark, via `--font-display`) · **Source Sans 3** uppercase attribution
  (signature, via `--font-signature`). Set through `<SectionTheme font="baskerville-source"
  section="ethos">`. The original Cormorant Garamond italic + Great Vibes script were
  dropped — too editorial/luxury for an engineering firm.
- Colors: plum `“`+signature; near-black quote; white bg.
- **Portrait right**, `object-fit: contain`, height 88vh, top-anchored, clipped to a
  **54vh band** → shows full head + shoulders, cut cleanly at the chest. No side
  crop, no zoom.
- Quote/sig column `max-width: 52%`. Signature **right-aligned** (`flex-end`).
- Entry motion: photo fades, quote slides up, signature wipes L→R. ✅ keep.
- **Narrow ≤834px:** photo **hidden**, quote uses full width.

---

## LOCKED DECISIONS (from review)
- **Text ↔ image:** text **wraps around** the portrait (shape-outside).
- **Narrow screens:** **keep the photo** (right, smaller); quote reflows to more lines
  beside it. Never cropped/hidden.
- **Framing:** head + shoulders, clean cut at chest (base look) — no zoom, no side crop.
- **Frame rules:** none. Plain white section.
- **Monitor height:** hard **50vh** cap; copy is **shortened** to fit comfortably.
- **Quotes:** **two** quotes that **crossfade in succession** on scroll (restore the
  scrubbed crossfade). Each quote short enough to fit the 50vh band.
- **Fonts / mark / colors:** superseded 2026-07-10 — see the Fonts line above. Now
  Libre Baskerville (upright quote + `“`) + Source Sans 3 signature; colors read from
  theme vars (`--color-accent` mark, `--color-primary` quote, `--color-signature` sig).

**STILL NEEDED:** the exact text of the two short quotes (see §D).

## B. Proposed changes (your requirements → edits)

### B1. Section height on a monitor ≤ half viewport  ✅ your requirement
- `.inner` crop band `54vh` → **`50vh`** (desktop). Photo height re-tuned to match so
  the chest crop still lands well.
- [ ] Confirm 50vh, or exact value → ______

### B2. Signature must NOT sit over the image  ✅ your requirement
- Today the signature is `flex-end` (right edge at 52%), which can kiss the photo.
- **Proposal:** keep signature inside the text column, right-aligned to the column
  (not the page) so it stays clear of the portrait. Left-align is also an option.
- [ ] Signature align: **right within text column** / left / centered → ______

### B3. Portrait framing — "not cropped too much"  ✅ your requirement
- Base already uses `contain` (full head+shoulders, only the bottom/chest is
  clipped, nothing zoomed or side-cut). I believe this is the look you want.
- [ ] Framing OK as-is (head+shoulders, cut at chest)? **yes** / show more torso /
      show less → ______
- [ ] Any bottom bleed off the section edge, or keep it fully inside the band? → ______

### B4. Text "wraps / relates to" the image
- Two interpretations — pick one:
  - **(i) Column** (today): text is a block on the left, photo on the right, tidy gap
    between. Simple, no overlap.
  - **(ii) Wrap:** text flows right up to and around the portrait's left contour
    (shape-outside), filling more width.
- [ ] Text behaviour: **(i) column** / (ii) wrap around photo → ______

### B5. Narrow screens  ✅ your requirement (text reflows, never cropped/hidden)
- Base **drops the photo** on ≤834px. Your earlier screenshots showed you wanted the
  **photo kept** on narrow with the text on more lines.
- **Proposal:** keep the photo on narrow (smaller, right side), quote reflows to more
  lines beside/around it; nothing cropped or hidden.
- [ ] Narrow: **keep photo** (text reflows) / drop photo (quote only) → ______
- [ ] If kept — side-by-side (text left / photo right) or stacked? → ______
- [ ] Narrow section height: 100vh / auto / other → ______

### B6. Frame rules (optional, from the abandoned mockup)
- Thin horizontal rule top & bottom of the section.
- [ ] Add top+bottom rules? **no** (keep clean, default) / yes → color ______

---

## C. Explicitly NOT changing (unless you say)
- Keep single quote (no crossfade) — matches origin/main.
- Keep Cormorant + Great Vibes fonts and the `“` mark.
- Keep plum/near-black/white color roles.
- Keep entry animation.

---

## D. Copy — TWO crossfading quotes (LOCKED)
- **Quote 1** (shows first): "We do not measure success by how many projects we
  finish. We measure it by how many clients call us back for the next one. Because
  if they call back, we know we did more than just steel and concrete. We gave them
  trust."
- **Quote 2** (fades in on scroll): "Some firms treat tenant improvements like fast
  food: quick, cheap, forgettable. We treat them like a home-cooked meal. We take
  our time, use good ingredients, and remember who we are cooking for."

---

### Your hard requirements (captured)
1. Signature not over the image. → B2
2. Portrait not cropped too much (full head + shoulders). → B3
3. Text relates to / wraps with the image; never cropped or hidden. → B4, B5
4. Keep the `“` mark + earlier fonts (Cormorant + Great Vibes). → base already has them
5. No new fonts. → honored
6. Monitor section ≤ half viewport height. → B1
7. Same effect on narrow, text on more lines. → B5

> Fill the boxes (or just reply with answers) and I build exactly to this.
