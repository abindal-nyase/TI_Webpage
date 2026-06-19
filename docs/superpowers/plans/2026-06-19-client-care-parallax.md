# Client Care Horizontal-Parallax Section — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Client Care accordion (`04_O3_ClientCare`) with a horizontal-parallax scroll section: 8 curated bullet rows in 4 themed bands, titles/content/background images drifting left→right at three layered speeds, responsive across iPhone portrait through wide landscape monitors at any zoom.

**Architecture:** Vertical-scroll parallax (no GSAP pin). A `position: sticky` header holds the title + intro. Below, 4 bands each carry 2 bullet rows and one Vite-imported background photo. Each band owns a GSAP ScrollTrigger `scrub` timeline animating `xPercent` (resolution/zoom-stable) at three magnitudes. `gsap.matchMedia` supplies portrait/landscape/reduced-motion variants and auto-rebuilds on resize/orientation. Animations rebuild on `themechange`. All color/font via CSS variables.

**Tech Stack:** Astro + React island, GSAP + ScrollTrigger (global via GlobalSetup), Lenis (global), CSS Modules, Vite asset imports, Playwright for verification.

---

## Design Reference

Spec: `docs/superpowers/specs/2026-06-19-client-care-parallax-design.md`. Read it before starting.

## File Structure

- **Move to `_unused/`:** `src/components/ti-option3/_unused/04_O3_ClientCare.jsx` + `.module.css` (dead copies of the old accordion).
- **Replace in place:** `src/components/ti-option3/04_O3_ClientCare/04_O3_ClientCare.jsx` — component, data (`DESCRIPTION`, `BUCKETS`), GSAP. Same default export `O3ClientCare`, same path → `option3.astro` import unchanged.
- **Replace in place:** `src/components/ti-option3/04_O3_ClientCare/04_O3_ClientCare.module.css` — layout, sticky header, responsive type, `overflow-x: clip`.
- **Create:** `src/assets/client-care/clientcare-bg-1.jpg` … `-4.jpg` (4 stock photos).
- **Create:** `tests/client-care.spec.mjs` — Playwright verification (reuses `tests/helpers/hero4.mjs`).
- **Untouched:** `src/pages/option3.astro`.

## Critical Conventions (from CLAUDE.md + sibling `03_O3_TrustWall`)

- No hardcoded colors/fonts — CSS variables only.
- GSAP inside `gsap.context(() => …, rootRef)`; `ctx.revert()` on cleanup.
- Build anims in `document.fonts.ready.then(buildAnims)`; rebuild on `window 'themechange'` (revert prior context first).
- `invalidateOnRefresh: true` on every ScrollTrigger.
- Do NOT reinitialize Lenis/ScrollTrigger — GlobalSetup owns them.
- The section keeps its existing `id="nya-culture-2"` (side nav / anchors depend on it).
- `overflow-x: clip` (NOT `hidden`) on the section — `hidden` creates a scroll container that breaks the sticky header.
- Keep the section id and a stable wrapper class so the test selectors hold.

---

### Task 0: Move old component to `_unused/`

**Files:**
- Move: `src/components/ti-option3/04_O3_ClientCare/04_O3_ClientCare.jsx` → `src/components/ti-option3/_unused/04_O3_ClientCare.jsx`
- Move: `src/components/ti-option3/04_O3_ClientCare/04_O3_ClientCare.module.css` → `src/components/ti-option3/_unused/04_O3_ClientCare.module.css`

- [ ] **Step 1: Move both files with git**

```bash
cd "C:/Users/abindal/Documents/00_Python/Websites/TI_Webpage"
git mv src/components/ti-option3/04_O3_ClientCare/04_O3_ClientCare.jsx       src/components/ti-option3/_unused/04_O3_ClientCare.jsx
git mv src/components/ti-option3/04_O3_ClientCare/04_O3_ClientCare.module.css src/components/ti-option3/_unused/04_O3_ClientCare.module.css
```

- [ ] **Step 2: Recreate empty target files so the next tasks fill them**

Create `src/components/ti-option3/04_O3_ClientCare/04_O3_ClientCare.jsx` with a temporary stub:

```jsx
export default function O3ClientCare() {
  return <section id="nya-culture-2" />
}
```

Create `src/components/ti-option3/04_O3_ClientCare/04_O3_ClientCare.module.css` empty:

```css
/* filled in Task 4 */
```

- [ ] **Step 3: Verify the build still resolves the import**

Run: `npm run build`
Expected: build succeeds (the stub satisfies the unchanged `option3.astro` import).

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "refactor: move old ClientCare accordion to _unused, stub replacement"
```

---

### Task 1: Add 4 stock background images

**Files:**
- Create: `src/assets/client-care/clientcare-bg-1.jpg` … `clientcare-bg-4.jpg`

- [ ] **Step 1: Create the folder**

```bash
mkdir -p "C:/Users/abindal/Documents/00_Python/Websites/TI_Webpage/src/assets/client-care"
```

- [ ] **Step 2: Download 4 free-license architecture/construction stock photos (Unsplash)**

```bash
cd "C:/Users/abindal/Documents/00_Python/Websites/TI_Webpage/src/assets/client-care"
P='?w=1600&q=70&auto=format&fit=crop'
curl -L -o clientcare-bg-1.jpg "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab$P"  # building facade — Care
curl -L -o clientcare-bg-2.jpg "https://images.unsplash.com/photo-1503387762-592deb58ef4e$P"     # blueprints — Judgment
curl -L -o clientcare-bg-3.jpg "https://images.unsplash.com/photo-1541888946425-d81bb19240f5$P"  # construction/glass — Process
curl -L -o clientcare-bg-4.jpg "https://images.unsplash.com/photo-1487958449943-2429e8be8625$P"  # white architecture — Confidence
```

- [ ] **Step 3: Verify each file downloaded and is a real image (>20 KB)**

```bash
cd "C:/Users/abindal/Documents/00_Python/Websites/TI_Webpage/src/assets/client-care"
for f in clientcare-bg-1.jpg clientcare-bg-2.jpg clientcare-bg-3.jpg clientcare-bg-4.jpg; do
  sz=$(wc -c < "$f"); echo "$f $sz"; [ "$sz" -lt 20000 ] && echo "!! $f too small — re-download or substitute any free architecture JPG"; done
```
Expected: four lines, each size ≥ 20000. If any failed, substitute another free architecture JPG at the same filename (user will replace these anyway).

- [ ] **Step 4: Commit**

```bash
cd "C:/Users/abindal/Documents/00_Python/Websites/TI_Webpage"
git add src/assets/client-care
git commit -m "assets: add 4 Client Care parallax background photos"
```

---

### Task 2: Write the Playwright verification spec (failing)

**Files:**
- Create: `tests/client-care.spec.mjs`

This is the executable acceptance gate. It reuses helpers from `tests/helpers/hero4.mjs`.

- [ ] **Step 1: Write the spec**

```js
// tests/client-care.spec.mjs
import { test, expect } from '@playwright/test';
import { VIEWPORTS, gotoOption3, scrollToInstant } from './helpers/hero4.mjs';

const SECTION = '#nya-culture-2';

// Read the section's bounding box top in document coords.
async function sectionDocTop(page) {
  return page.evaluate((sel) => {
    const el = document.querySelector(sel);
    const r = el.getBoundingClientRect();
    return Math.round(r.top + window.scrollY);
  }, SECTION);
}

// Average translateX (px) of all elements matching a data attribute, measured
// from their transform matrix. Resolution-independent comparison across scroll.
async function avgTranslateX(page, attr) {
  return page.evaluate((attr) => {
    const els = [...document.querySelectorAll(`${'[data-'}${attr}]`)];
    if (!els.length) return null;
    const xs = els.map((el) => new DOMMatrixReadOnly(getComputedStyle(el).transform).m41);
    return xs.reduce((a, b) => a + b, 0) / xs.length;
  }, attr);
}

test.describe('Client Care parallax section', () => {
  test('renders 8 bullet rows and 4 background images', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.desktop);
    await gotoOption3(page);
    await page.waitForSelector(SECTION);
    const titles = await page.locator(`${SECTION} [data-cc-title]`).count();
    const contents = await page.locator(`${SECTION} [data-cc-content]`).count();
    const bgs = await page.locator(`${SECTION} [data-cc-bg]`).count();
    expect(titles).toBe(8);
    expect(contents).toBe(8);
    expect(bgs).toBe(4);
  });

  test('header text is present', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.desktop);
    await gotoOption3(page);
    await page.waitForSelector(SECTION);
    await expect(page.locator(SECTION)).toContainText('A Culture of Trust');
  });

  test('titles move horizontally faster than content as the section scrolls', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.desktop);
    await gotoOption3(page);
    await page.waitForSelector(SECTION);
    const top = await sectionDocTop(page);

    await scrollToInstant(page, top - 200);
    await page.waitForTimeout(700);
    const t1 = await avgTranslateX(page, 'cc-title');
    const c1 = await avgTranslateX(page, 'cc-content');

    await scrollToInstant(page, top + 1200);
    await page.waitForTimeout(700);
    const t2 = await avgTranslateX(page, 'cc-title');
    const c2 = await avgTranslateX(page, 'cc-content');

    const titleDelta = Math.abs(t2 - t1);
    const contentDelta = Math.abs(c2 - c1);
    expect(titleDelta).toBeGreaterThan(5);            // titles actually moved
    expect(titleDelta).toBeGreaterThan(contentDelta); // titles faster than content
  });

  test('no horizontal page overflow across viewports', async ({ page }) => {
    for (const vp of [VIEWPORTS.desktop, VIEWPORTS.tabletPort, { width: 390, height: 844 }, { width: 844, height: 390 }]) {
      await page.setViewportSize(vp);
      await gotoOption3(page);
      await page.waitForSelector(SECTION);
      await scrollToInstant(page, await sectionDocTop(page) + 800);
      await page.waitForTimeout(500);
      const overflow = await page.evaluate(() =>
        document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow, `viewport ${vp.width}x${vp.height}`).toBeLessThanOrEqual(2);
    }
  });

  test('no console errors on load + scroll', async ({ page }) => {
    const errors = [];
    page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
    page.on('pageerror', (e) => errors.push(String(e)));
    await page.setViewportSize(VIEWPORTS.desktop);
    await gotoOption3(page);
    await page.waitForSelector(SECTION);
    await scrollToInstant(page, await sectionDocTop(page) + 1500);
    await page.waitForTimeout(700);
    expect(errors).toEqual([]);
  });
});
```

- [ ] **Step 2: Run the spec — expect failures**

Run: `npx playwright test client-care --project=chromium`
Expected: FAIL — the stub section has no titles/content/bg elements, header text missing, no motion.

- [ ] **Step 3: Commit**

```bash
git add tests/client-care.spec.mjs
git commit -m "test: add Client Care parallax acceptance spec (failing)"
```

---

### Task 3: Build the component data + static markup

**Files:**
- Modify: `src/components/ti-option3/04_O3_ClientCare/04_O3_ClientCare.jsx`

- [ ] **Step 1: Replace the stub with data + markup (no animation yet)**

```jsx
/*
 * O3ClientCare — horizontal-parallax Client Care section.
 * All styles MUST use CSS variables. Never hardcode colors or fonts.
 */
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import s from './04_O3_ClientCare.module.css'
import bg1 from '../../../assets/client-care/clientcare-bg-1.jpg'
import bg2 from '../../../assets/client-care/clientcare-bg-2.jpg'
import bg3 from '../../../assets/client-care/clientcare-bg-3.jpg'
import bg4 from '../../../assets/client-care/clientcare-bg-4.jpg'

gsap.registerPlugin(ScrollTrigger)

const DESCRIPTION =
  'At NYA, tenant improvement work is treated as a responsibility: to understand the building, protect the priorities behind the project, communicate clearly, and do the work with care. That mindset began with our founder and continues in the way our teams serve clients today.'

const BUCKETS = [
  {
    label: 'Care',
    bg: bg1,
    items: [
      {
        id: 'advocate',
        title: 'NYA acting as a true client advocate',
        content:
          'NYA takes client care seriously. We listen closely, understand what matters most to the owner, architect, or project team, and work to protect those priorities. Our goal is not just to complete the structural scope, but to support clients, ensure they are informed, and make sure their needs are looked after.',
      },
      {
        id: 'client-care',
        title: 'A genuine care for the client and the building itself',
        content:
          'Generic structural advice can miss what makes an existing building unique. NYA takes the time to understand the inner workings of your building: its structural system, existing conditions, load paths, constraints, and hidden complexities. That allows our guidance to be grounded in how the building actually works, not in one-size-fits-all assumptions.',
      },
    ],
  },
  {
    label: 'Judgment',
    bg: bg2,
    items: [
      {
        id: 'technical-judgment',
        title: 'Technical judgment that earns confidence',
        content:
          "NYA is generally trusted to peer-review other engineers's complex TI designs, verifying calculations, checking code compliance, and preparing summary reports. That role reflects the level of technical judgment clients and project teams trust us to bring to the project.",
      },
      {
        id: 'make-it-work',
        title: 'A "make it work" mindset',
        content:
          "Architects bring the creative ambition to TI work: unusual stairs, open lobbies, new partitions, technology walls, floating floors, and adaptive reuse concepts. NYA's role is to safeguard that ambition, translating it into structural solutions that are coordinated, code-conscious, and constructible. The result is a design vision that moves forward with earned confidence, not on hope. Every architecture firm has its own way of working, its own design priorities, and its own expectations for collaboration. NYA does not ask that team to adapt to us. We adapt to them — calibrating guidance, level of detail, communication style, and flexibility to match the way that team already works best.",
      },
    ],
  },
  {
    label: 'Process',
    bg: bg3,
    items: [
      {
        id: 'senior-engineers',
        title: 'You work with senior engineers with decades of experience',
        content:
          'In tenant improvement work, slow communication and too many handoffs can quietly cost a project time. A bureaucratic process can delay decisions, create unnecessary back-and-forth, and make it harder to resolve issues when they come up. NYA replaces that drag with seasoned structural judgment and direct, unfiltered access to the engineers closest to the work. The result is a team that keeps the project moving, not through rushed work, but through a process engineered to remove the waiting.',
      },
      {
        id: 'communication',
        title: 'Communication that reduces pressure, not adds to it',
        content:
          "Delays in TI work rarely begin with a crisis. They seep in through quieter gaps: the question left unanswered, the RFI that waits days for a response, the decision that drifts because no one knew who owned it. NYA is structured to intercept those gaps before they widen into schedule loss. We respond the same day, pick up the phone when field issues need discussion, and keep clients informed even when a full answer requires more time. NYA's decades of familiarity with different teams helps reduce that friction, improve predictability, and support better cost control.",
      },
    ],
  },
  {
    label: 'Confidence',
    bg: bg4,
    items: [
      {
        id: 'pricing',
        title: 'Pricing that is reliable',
        content:
          "A complete proposal helps clients understand what is included, reduce unexpected fees, and avoid costly surprises later. With NYA, experience is not overhead — it is efficiency. Our engineers have seen most TI challenges before, so we are not learning the problem at the client's expense. We can start further down the field, use past knowledge, automate repetitive steps, and apply sophisticated processes that help us move faster while reducing risk.",
      },
      {
        id: 'trusted',
        title: 'Our quality of work is trusted',
        content:
          "NYA's reputation was shaped by long-standing relationships with owners, architects, and property managers who experienced our founder's warmth, character, and care firsthand. That trust continues today because clients know how we work, how we communicate, and how seriously we take their buildings. Much of NYA's work comes through recommendations because clients trust the quality of our work, our reputation for excellence, and the confidence we give those who put our name forward.",
      },
    ],
  },
]

export default function O3ClientCare() {
  const rootRef = useRef(null)

  return (
    <section id="nya-culture-2" ref={rootRef} className={s.section}>
      <div className={s.header}>
        <p className={s.eyebrow}>Client Care</p>
        <h2 className={s.title}>A Culture of Trust</h2>
        <p className={s.intro}>{DESCRIPTION}</p>
      </div>

      <div className={s.bands}>
        {BUCKETS.map((bucket) => (
          <div key={bucket.label} className={s.band}>
            <div
              className={s.bandBg}
              data-cc-bg
              style={{ backgroundImage: `url(${bucket.bg})` }}
              aria-hidden="true"
            />
            <div className={s.bandOverlay} aria-hidden="true" />
            <div className={s.bandInner}>
              <span className={s.bandLabel}>{bucket.label}</span>
              {bucket.items.map((item) => (
                <div key={item.id} className={s.row}>
                  <h3 className={s.rowTitle} data-cc-title>{item.title}</h3>
                  <p className={s.rowContent} data-cc-content>{item.content}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Run the render + header + overflow + console tests**

Run: `npx playwright test client-care --project=chromium -g "renders 8|header text|no horizontal|no console"`
Expected: those 4 tests PASS (motion test still fails — no animation yet). If overflow fails, that is fixed by Task 4 CSS; acceptable to defer to Task 4 re-run.

- [ ] **Step 3: Commit**

```bash
git add src/components/ti-option3/04_O3_ClientCare/04_O3_ClientCare.jsx
git commit -m "feat: Client Care data + static parallax markup"
```

---

### Task 4: Responsive layout CSS

**Files:**
- Modify: `src/components/ti-option3/04_O3_ClientCare/04_O3_ClientCare.module.css`

All sizes use relative units (`clamp`, `rem`, `vw`, `%`) so the layout holds across resolution, zoom, and orientation. `overflow-x: clip` keeps the sticky header alive while clipping horizontal travel.

- [ ] **Step 1: Write the full stylesheet**

```css
/* 04_O3_ClientCare.module.css — all color/font tokens via CSS variables */

.section {
  position: relative;
  overflow-x: clip;            /* clip horizontal parallax WITHOUT breaking sticky */
  background: var(--surface-page);
  color: var(--color-gray-900);
  padding-block: var(--section-padding);
}

/* ── Sticky header ── */
.header {
  position: sticky;
  top: 0;
  z-index: 2;
  padding: clamp(var(--sp-6), 6vw, var(--sp-12)) var(--margin-desktop) clamp(var(--sp-4), 4vw, var(--sp-8));
  background: var(--surface-page);
  max-width: var(--container);
  margin-inline: auto;
}
.eyebrow {
  font-family: var(--font-body);
  text-transform: uppercase;
  letter-spacing: 0.14em;
  font-size: var(--text-sm);
  color: var(--color-accent);
  margin: 0 0 var(--sp-2);
}
.title {
  font-family: var(--font-display);
  color: var(--color-primary);
  font-size: clamp(var(--text-3xl), 6vw, var(--text-6xl));
  line-height: 1.05;
  margin: 0 0 var(--sp-4);
}
.intro {
  font-family: var(--font-body);
  color: var(--color-gray-700);
  font-size: clamp(var(--text-base), 2.2vw, var(--text-xl));
  line-height: 1.6;
  max-width: var(--container-narrow);
  margin: 0;
}

/* ── Bands ── */
.bands { position: relative; z-index: 1; }

.band {
  position: relative;
  overflow: hidden;            /* contain this band's bg drift (no sticky inside) */
  min-height: clamp(70vh, 90vh, 980px);
  display: flex;
  align-items: center;
}
.bandBg {
  position: absolute;
  inset: -8% -14% -8% -14%;    /* extra bleed so xPercent drift never reveals an edge */
  background-size: cover;
  background-position: center;
  will-change: transform;
}
.bandOverlay {
  position: absolute;
  inset: 0;
  background: var(--color-primary);
  opacity: 0.82;               /* tint so text stays legible on every theme */
}
.bandInner {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: var(--container);
  margin-inline: auto;
  padding-inline: var(--margin-desktop);
  color: var(--color-white);
}
.bandLabel {
  display: inline-block;
  font-family: var(--font-body);
  text-transform: uppercase;
  letter-spacing: 0.16em;
  font-size: var(--text-sm);
  color: var(--color-accent);
  margin-bottom: var(--sp-6);
}
.row { margin-bottom: clamp(var(--sp-8), 6vw, var(--sp-16)); }
.row:last-child { margin-bottom: 0; }

.rowTitle {
  font-family: var(--font-display);
  font-size: clamp(var(--text-2xl), 5vw, var(--text-5xl));
  line-height: 1.1;
  margin: 0 0 var(--sp-4);
  will-change: transform;
}
.rowContent {
  font-family: var(--font-body);
  font-size: clamp(var(--text-base), 2vw, var(--text-lg));
  line-height: 1.65;
  max-width: 60ch;
  margin: 0;
  color: rgba(255, 255, 255, 0.86);
  will-change: transform;
}

/* Portrait phones: shorter bands, tighter rhythm */
@media (max-width: 768px) {
  .band { min-height: auto; padding-block: clamp(var(--sp-12), 18vh, var(--sp-20)); }
  .rowContent { max-width: 100%; }
}

/* Landscape phones / short viewports: don't let a band exceed the screen */
@media (max-height: 520px) and (orientation: landscape) {
  .band { min-height: auto; padding-block: var(--sp-12); }
}

@media (prefers-reduced-motion: reduce) {
  .bandBg, .rowTitle, .rowContent { will-change: auto; }
}
```

- [ ] **Step 2: Re-run render/overflow tests**

Run: `npx playwright test client-care --project=chromium -g "renders 8|header text|no horizontal|no console"`
Expected: all 4 PASS, including `no horizontal page overflow across viewports`.

- [ ] **Step 3: Commit**

```bash
git add src/components/ti-option3/04_O3_ClientCare/04_O3_ClientCare.module.css
git commit -m "feat: Client Care responsive layout (sticky header, bands, overflow clip)"
```

---

### Task 5: GSAP layered horizontal parallax

**Files:**
- Modify: `src/components/ti-option3/04_O3_ClientCare/04_O3_ClientCare.jsx` (add the `useEffect`)

Animate `xPercent` (relative to each element's own width → stable across resolution/zoom). Three magnitudes: title fastest, content slower, background slowest. `gsap.matchMedia` gives portrait/landscape variants and reduced-motion opt-out, and auto-reverts on resize/orientation. Rebuild on `themechange`.

- [ ] **Step 1: Add the animation effect inside `O3ClientCare`, before `return`**

```jsx
  useEffect(() => {
    let ctx

    function buildAnims() {
      if (ctx) ctx.revert()
      ctx = gsap.context(() => {
        const mm = gsap.matchMedia()

        mm.add(
          {
            isWide: '(min-width: 769px)',
            isNarrow: '(max-width: 768px)',
            reduce: '(prefers-reduced-motion: reduce)',
          },
          (mmCtx) => {
            const { isWide, reduce } = mmCtx.conditions
            if (reduce) return // static layout, no transforms

            // xPercent ranges (of each element's own width). Title > content > bg.
            const TITLE = isWide ? 12 : 7
            const CONTENT = isWide ? 7 : 4
            const IMG = isWide ? 5 : 3

            rootRef.current.querySelectorAll('[data-cc-bg]').forEach((bg) => {
              gsap.fromTo(
                bg,
                { xPercent: -IMG },
                {
                  xPercent: IMG,
                  ease: 'none',
                  scrollTrigger: {
                    trigger: bg.closest('div'),
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1.2,
                    invalidateOnRefresh: true,
                  },
                },
              )
            })

            rootRef.current.querySelectorAll('[data-cc-title]').forEach((el) => {
              gsap.fromTo(
                el,
                { xPercent: -TITLE },
                {
                  xPercent: TITLE,
                  ease: 'none',
                  scrollTrigger: {
                    trigger: el,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1,
                    invalidateOnRefresh: true,
                  },
                },
              )
            })

            rootRef.current.querySelectorAll('[data-cc-content]').forEach((el) => {
              gsap.fromTo(
                el,
                { xPercent: -CONTENT },
                {
                  xPercent: CONTENT,
                  ease: 'none',
                  scrollTrigger: {
                    trigger: el,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1.4,
                    invalidateOnRefresh: true,
                  },
                },
              )
            })
          },
        )
      }, rootRef)
    }

    document.fonts.ready.then(buildAnims)
    window.addEventListener('themechange', buildAnims)
    return () => {
      window.removeEventListener('themechange', buildAnims)
      ctx?.revert()
    }
  }, [])
```

> Note: each `[data-cc-bg]` uses `bg.closest('div')` (its `.band`) as the trigger so the image drifts over the whole band's scroll span. Titles/content trigger on themselves.

- [ ] **Step 2: Run the full client-care spec**

Run: `npx playwright test client-care --project=chromium`
Expected: ALL tests PASS, including `titles move horizontally faster than content`.

- [ ] **Step 3: Commit**

```bash
git add src/components/ti-option3/04_O3_ClientCare/04_O3_ClientCare.jsx
git commit -m "feat: Client Care layered horizontal parallax (title/content/bg speeds)"
```

---

### Task 6: Theme-rebuild + reduced-motion verification

**Files:** none (verification of behavior built in Task 5)

- [ ] **Step 1: Manually verify theme switching live-updates the section**

Run: `npm run dev`, open `http://localhost:4321/option3`, scroll to the Client Care section, use the theme switcher to change color scheme AND font.
Expected: section titles/content/labels recolor and re-font instantly; parallax still works after switching (the `themechange` listener rebuilt it).

- [ ] **Step 2: Manually verify reduced motion**

In the browser devtools, enable "Emulate CSS prefers-reduced-motion: reduce", reload, scroll the section.
Expected: text and images sit static (no horizontal drift), fully legible.

- [ ] **Step 3: Verify the old section no longer renders**

Confirm only the new parallax section appears at `#nya-culture-2` (no accordion, no hover list).

---

### Task 7: Full verification + final commit

**Files:** none

- [ ] **Step 1: Production build**

Run: `npm run build`
Expected: succeeds, no errors. The 4 imported JPGs appear hashed in `dist/`.

- [ ] **Step 2: Full Playwright suite (ensure Hero4 tests still pass — shared page)**

Run: `npx playwright test --project=chromium`
Expected: all `client-care` + existing `hero4-building` tests PASS.

- [ ] **Step 3: Manual responsive pass**

In dev, use devtools device toolbar to check: iPhone portrait (390×844), iPhone landscape (844×390), laptop (1280×800), wide monitor (1920×1080), and browser zoom at 80% / 125% / 150%.
Expected at each: no horizontal scrollbar, header readable + sticky, bands legible, parallax smooth, no clipped text.

- [ ] **Step 4: Final commit (if any cleanup remains)**

```bash
git add -A
git commit -m "chore: Client Care parallax — final verification cleanup"
```

---

## Self-Review

**Spec coverage:**
- Move old → `_unused` ✓ (Task 0). Vertical parallax no-pin ✓ (Task 5). Sticky header ✓ (Task 4). 8 items / 4 buckets, drop `benefit` ✓ (Task 3). 4 `src/assets` Vite-imported bgs ✓ (Tasks 1, 3). Title>content>bg speeds ✓ (Task 5). Theme vars only ✓ (Task 4 CSS). `themechange` rebuild ✓ (Task 5). Reduced motion ✓ (Tasks 4 CSS + 5 guard). Responsive across orientation/zoom/resolution ✓ (Task 4 clamp/media + Task 5 matchMedia + Task 2/7 viewport tests). `option3.astro` untouched ✓.
- Success criteria 1–5 → mapped to Task 2 tests + Task 6/7 manual checks.

**Placeholder scan:** every step is complete runnable code. No "TBD/TODO/handle edge cases", no no-op filler.

**Type/selector consistency:** data attributes `data-cc-title`, `data-cc-content`, `data-cc-bg` are identical in the component (Task 3), the CSS has no dependency on them, and the test selectors (Task 2) match. Section id `nya-culture-2` consistent across component, plan conventions, and tests. Export name `O3ClientCare` unchanged.
