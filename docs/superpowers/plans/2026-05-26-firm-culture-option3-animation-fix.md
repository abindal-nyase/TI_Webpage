# FirmCultureOption3 Animation Fix Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix FirmCultureOption3 so the scroll animation matches the finalized design intent: primary-color background always visible, NYA zooms out from center-bottom anchor, 110-word dense grid, white-only flash, tagline statically positioned above NYA.

**Architecture:** Two files only — `FirmCultureOption3.module.css` (background, transform-origin, new layout classes) and `FirmCultureOption3.jsx` (word grid, GSAP simplification, JSX restructure). Changes are independent enough to commit per task. No new files needed.

**Tech Stack:** React, GSAP + ScrollTrigger, CSS Modules, Astro (dev server)

---

## File Map

| File | What changes |
|------|-------------|
| `src/components/ti-option3/FirmCultureOption3.module.css` | background → `var(--color-primary)`, transform-origin → `center bottom`, replace `.nyaWrap`/`.tagline` with `.composition`/`.taglineGroup` |
| `src/components/ti-option3/FirmCultureOption3.jsx` | WORDS array → 110-word grid, remove taglineRef + color reads + all tweens except NYA scale, fix flash to white-only, restructure JSX |

---

## Task 1: Rewrite CSS

**Files:**
- Modify: `src/components/ti-option3/FirmCultureOption3.module.css`

- [ ] **Step 1: Replace the entire CSS file**

```css
/*
 * IMPORTANT: Use only CSS variables — never hardcode colors or font families.
 * Background is driven by var(--color-primary) in CSS — no GSAP tween.
 */

.section {
  position: relative;
  min-height: 400vh;
}

.sticky {
  position: sticky;
  top: 0;
  height: 100vh;
  width: 100%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-primary);
}

/* ── Word cloud ── */

.wordCloud {
  position: absolute;
  inset: 0;
  pointer-events: none;
  user-select: none;
}

.word {
  position: absolute;
  font-family: var(--font-body);
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #ffffff;
  opacity: 0.1;
  white-space: nowrap;
}

/* ── Composition: tagline above NYA ── */

.composition {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--sp-6);
  pointer-events: none;
}

.taglineGroup {
  text-align: center;
}

.taglineText {
  font-family: var(--font-display);
  font-size: clamp(32px, 5vw, 72px);
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.02em;
  color: #ffffff;
  text-align: center;
  margin-bottom: 12px;
}

.taglineSub {
  font-family: var(--font-display);
  font-size: clamp(28px, 4vw, 56px);
  font-weight: 700;
  letter-spacing: 0.05em;
  color: #ffffff;
  text-align: center;
}

/* ── NYA text ── */

.nya {
  font-family: var(--font-display);
  font-size: 30vw;
  font-weight: 700;
  line-height: 1;
  letter-spacing: -0.02em;
  color: #ffffff;
  white-space: nowrap;
  will-change: transform;
  transform-origin: center bottom;
}

@media (max-width: 768px) {
  .nya {
    font-size: 42vw;
  }

  .word {
    font-size: 0.55rem !important;
  }
}
```

- [ ] **Step 2: Verify no hardcoded colors or fonts remain**

Run: `grep -n '#[0-9a-fA-F]\|font-family' src/components/ti-option3/FirmCultureOption3.module.css`

Expected: only `#ffffff` (white text is allowed per design — NYA, tagline, and word cloud are always white on the primary-color bg).

- [ ] **Step 3: Commit**

```bash
git add src/components/ti-option3/FirmCultureOption3.module.css
git commit -m "style(firm-culture): primary-color bg, center-bottom transform-origin, composition layout classes"
```

---

## Task 2: Restructure JSX layout

**Files:**
- Modify: `src/components/ti-option3/FirmCultureOption3.jsx`

- [ ] **Step 1: Remove `taglineRef` and update refs section**

Find this block near the top of the component:
```js
const sectionRef  = useRef(null);
const stickyRef   = useRef(null);
const nyaRef      = useRef(null);
const taglineRef  = useRef(null);
const wordRefs    = useRef([]);
const flashCtx    = useRef(null);
```

Replace with:
```js
const sectionRef = useRef(null);
const stickyRef  = useRef(null);
const nyaRef     = useRef(null);
const wordRefs   = useRef([]);
const flashCtx   = useRef(null);
```

- [ ] **Step 2: Replace the return JSX**

Find the entire `return (...)` block and replace with:

```jsx
return (
  <section ref={sectionRef} className={styles.section}>
    <div ref={stickyRef} className={styles.sticky}>

      {/* word cloud */}
      <div className={styles.wordCloud} aria-hidden="true">
        {WORDS.map((w, i) => (
          <span
            key={w.word + i}
            ref={el => wordRefs.current[i] = el}
            className={styles.word}
            style={{ top: w.top, left: w.left, fontSize: w.size }}
          >
            {w.word}
          </span>
        ))}
      </div>

      {/* composition: tagline above NYA — both static, revealed by NYA zoom-out */}
      <div className={styles.composition}>
        <div className={styles.taglineGroup} aria-hidden="true">
          <p className={styles.taglineText}>Care, Trust, and<br />Serious Work.</p>
          <p className={styles.taglineSub}>NYA</p>
        </div>
        <div ref={nyaRef} className={styles.nya}>NYA</div>
      </div>

    </div>
  </section>
);
```

- [ ] **Step 3: Start dev server and do a smoke check**

```bash
npm run dev
```

Navigate to `http://localhost:4321/option3`. Scroll to the FirmCulture section.

Expected at this point:
- Background is dark (primary color) — NOT white
- Tagline text "Care, Trust, and Serious Work." visible above the big "NYA"
- NYA zoom animation may look off (GSAP not yet updated) — that's fine

- [ ] **Step 4: Commit**

```bash
git add src/components/ti-option3/FirmCultureOption3.jsx
git commit -m "refactor(firm-culture): restructure layout — composition flex-col with tagline above NYA, remove nyaWrap"
```

---

## Task 3: Expand word cloud to 110-word dense grid

**Files:**
- Modify: `src/components/ti-option3/FirmCultureOption3.jsx`

- [ ] **Step 1: Replace the WORDS constant at the top of the file**

Remove the existing `const WORDS = [...]` array (all 22 entries) and replace with:

```jsx
const ROWS = [
  ['RESPONSIBLE','ARCHITECTURE','DESIGN','ANALYSIS','PLANNING','ENGINEERING','ACCOUNTABLE','CONSTRUCTION','MANAGEMENT','STRATEGY','QUALITY'],
  ['EXPERIENCED','EXCELLENCE','LEADERSHIP','VISION','SOLUTIONS','PROCESS','RELIABLE','SYSTEMS','STANDARDS','TECHNICAL','EXPERTISE'],
  ['KNOWLEDGEABLE','PROFESSIONAL','DEVELOPMENT','EXECUTION','PRECISION','DELIVERY','INNOVATIVE','VALUE','PERFORMANCE','RESULTS','COMMITMENT'],
  ['COLLABORATIVE','SERVICE','FOCUS','GROWTH','IMPACT','DRIVEN','TRANSPARENT','PURPOSE','SKILLED','TRUSTED','PROVEN'],
  ['PASSIONATE','AGILE','ENGAGED','DEDICATED','THOROUGH','EFFECTIVE','INTEGRITY','EFFICIENT','ADAPTIVE','CONNECTED','BOLD'],
  ['CARING','CLEAR','STRONG','ACTIVE','SMART','ALIGNED','STRUCTURED','HONEST','DIRECT','OPEN','SOLID'],
  ['DYNAMIC','SOUND','FIRM','SHARP','LEAN','SWIFT','CREATIVE','BRIGHT','STEADY','CAPABLE','PREPARED'],
  ['ESTABLISHED','INVESTED','ATTENTIVE','FORWARD','MINDFUL','GROUNDED','CURIOUS','DILIGENT','AMBITIOUS','PRINCIPLED','COHESIVE'],
  ['RESILIENT','DISCIPLINED','FOCUSED','RESPONSIVE','INTENTIONAL','PROACTIVE','METICULOUS','COMMITTED','DEPENDABLE','VERSATILE','PRECISE'],
  ['MOTIVATED','EARNEST','CAREFUL','GENUINE','INVOLVED','PRESENT','AWARE','FORTHRIGHT','PRACTICAL','CONSIDERED','MEASURED'],
];

const SIZES = ['0.65rem','0.72rem','0.78rem','0.72rem','0.65rem','0.78rem','0.72rem','0.65rem','0.72rem','0.78rem'];

const WORDS = ROWS.flatMap((row, ri) =>
  row.map((word, ci) => ({
    word,
    top:  `${3 + ri * 10}%`,
    left: `${(ri % 2 === 0 ? 0 : 4) + ci * 9}%`,
    size: SIZES[ri],
  }))
);
```

Grid layout: 10 rows × 11 columns = 110 words. Rows top at 3%, 13%, 23% … 93%. Odd rows offset 4% left for brick pattern. Columns at 9% intervals. Font sizes alternate per row (0.65–0.78rem).

- [ ] **Step 2: Verify word count**

```bash
node -e "
const ROWS = [
  ['RESPONSIBLE','ARCHITECTURE','DESIGN','ANALYSIS','PLANNING','ENGINEERING','ACCOUNTABLE','CONSTRUCTION','MANAGEMENT','STRATEGY','QUALITY'],
  ['EXPERIENCED','EXCELLENCE','LEADERSHIP','VISION','SOLUTIONS','PROCESS','RELIABLE','SYSTEMS','STANDARDS','TECHNICAL','EXPERTISE'],
  ['KNOWLEDGEABLE','PROFESSIONAL','DEVELOPMENT','EXECUTION','PRECISION','DELIVERY','INNOVATIVE','VALUE','PERFORMANCE','RESULTS','COMMITMENT'],
  ['COLLABORATIVE','SERVICE','FOCUS','GROWTH','IMPACT','DRIVEN','TRANSPARENT','PURPOSE','SKILLED','TRUSTED','PROVEN'],
  ['PASSIONATE','AGILE','ENGAGED','DEDICATED','THOROUGH','EFFECTIVE','INTEGRITY','EFFICIENT','ADAPTIVE','CONNECTED','BOLD'],
  ['CARING','CLEAR','STRONG','ACTIVE','SMART','ALIGNED','STRUCTURED','HONEST','DIRECT','OPEN','SOLID'],
  ['DYNAMIC','SOUND','FIRM','SHARP','LEAN','SWIFT','CREATIVE','BRIGHT','STEADY','CAPABLE','PREPARED'],
  ['ESTABLISHED','INVESTED','ATTENTIVE','FORWARD','MINDFUL','GROUNDED','CURIOUS','DILIGENT','AMBITIOUS','PRINCIPLED','COHESIVE'],
  ['RESILIENT','DISCIPLINED','FOCUSED','RESPONSIVE','INTENTIONAL','PROACTIVE','METICULOUS','COMMITTED','DEPENDABLE','VERSATILE','PRECISE'],
  ['MOTIVATED','EARNEST','CAREFUL','GENUINE','INVOLVED','PRESENT','AWARE','FORTHRIGHT','PRACTICAL','CONSIDERED','MEASURED'],
];
console.log(ROWS.flat().length);
"
```

Expected: `110`

- [ ] **Step 3: Check dev server — word cloud density**

At `http://localhost:4321/option3`, scroll to the section.
Expected: words fill nearly the full viewport background in a grid pattern, clearly denser than before.

- [ ] **Step 4: Commit**

```bash
git add src/components/ti-option3/FirmCultureOption3.jsx
git commit -m "feat(firm-culture): expand word cloud to 110-word dense grid"
```

---

## Task 4: Simplify GSAP — remove extra tweens, fix flash to white-only

**Files:**
- Modify: `src/components/ti-option3/FirmCultureOption3.jsx`

- [ ] **Step 1: Replace the entire `useEffect` body**

Find the `useEffect(() => {` block and replace its entire body (up to and including the cleanup `return`) with:

```js
const section = sectionRef.current;
const sticky  = stickyRef.current;
const nya     = nyaRef.current;
if (!section || !sticky || !nya) return;

// scroll timeline — only NYA scale, no bg or word tweens
const scrollCtx = gsap.context(() => {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end:   'bottom bottom',
      scrub: 1.2,
      pin:   sticky,
      pinSpacing: false,
    },
  });
  tl.fromTo(nya, { scale: 8 }, { scale: 1, ease: 'power2.out', duration: 1 }, 0);
}, section);

// word flash loop — white opacity only, no color change
flashCtx.current = gsap.context(() => {
  const words = wordRefs.current.filter(Boolean);
  let active  = new Set();

  const flash = () => {
    const available = words.filter((_, i) => !active.has(i));
    if (available.length === 0) return;
    const idx = words.indexOf(available[Math.floor(Math.random() * available.length)]);
    active.add(idx);
    gsap.to(words[idx], {
      opacity: 1,
      duration: 0.25,
      ease: 'power1.out',
      onComplete: () => {
        gsap.to(words[idx], {
          opacity: 0.1,
          duration: 0.55,
          delay: 0.25,
          ease: 'power1.in',
          onComplete: () => active.delete(idx),
        });
      },
    });
    gsap.delayedCall(0.55 + Math.random() * 0.9, flash);
  };

  flash();
  gsap.delayedCall(0.4, flash);
});

return () => {
  scrollCtx.revert();
  flashCtx.current?.revert();
};
```

- [ ] **Step 2: Verify no `accentColor`, `primaryColor`, or `taglineRef` remain**

```bash
grep -n 'accentColor\|primaryColor\|taglineRef\|getComputedStyle' src/components/ti-option3/FirmCultureOption3.jsx
```

Expected: no output.

- [ ] **Step 3: Commit**

```bash
git add src/components/ti-option3/FirmCultureOption3.jsx
git commit -m "feat(firm-culture): simplify scroll timeline to NYA scale only, flash white-only"
```

---

## Task 5: Visual verification

**Files:** none — observation only

- [ ] **Step 1: Start dev server if not running**

```bash
npm run dev
```

Navigate to `http://localhost:4321/option3`

- [ ] **Step 2: Verify Phase 0 — entry state**

Before scrolling to the section: the previous section's background should end normally. When the FirmCulture section first enters view, you should see the primary-color background (dark navy by default) with the word cloud behind it, and the bottom stem of "Y" filling the center of the viewport — white and large.

Expected: no white flash or fade-in of background. Dark from the start.

- [ ] **Step 3: Verify Phase 1 — zoom-out reveals Y then NYA**

Scroll slowly through the section. Verify:
- Y stem is the first recognizable shape
- N and A appear simultaneously on left/right edges as scroll progresses
- Full "NYA" readable before halfway through the scroll range

- [ ] **Step 4: Verify Phase 2 — tagline revealed**

Continue scrolling. Verify:
- "Care, Trust, and Serious Work." text becomes visible above NYA as it shrinks
- Smaller "NYA" sub-label visible below the tagline text
- No animation/fly-in on the tagline — it's simply revealed as NYA recedes

- [ ] **Step 5: Verify word cloud**

Throughout the scroll: words fill the background densely, flash white (bright vs dim), no gold/accent flashes.

- [ ] **Step 6: Verify theme switcher**

Change color scheme using the theme switcher at top of page. Background and accent should update; word cloud and NYA remain white throughout all themes.

- [ ] **Step 7: Final commit if any minor fixes were made**

```bash
git add -p
git commit -m "fix(firm-culture): visual verification tweaks"
```

If no changes needed, skip this step.
