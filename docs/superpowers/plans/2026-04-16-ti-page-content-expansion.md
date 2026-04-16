# TI Page Content Expansion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add "What Makes TI Hard" narrative, a 5th offerings panel (The Invisible Details), an AudienceCards section, and clean up FinalCTA + Hero label to reflect strategy call positioning.

**Architecture:** Five targeted changes to an existing React + GSAP + CSS Modules page. Two new components (IntroNarrative, AudienceCards), one data addition (offerings o5), two copy edits (FinalCTA, Hero). No routing, no state management, no external data fetching.

**Tech Stack:** React 18, GSAP (ScrollTrigger, gsap.context), CSS Modules, Vite

---

## File Map

| File | Action | Purpose |
|------|--------|---------|
| `src/components/IntroNarrative/IntroNarrative.jsx` | Create | "What Makes TI Hard" editorial section |
| `src/components/IntroNarrative/IntroNarrative.module.css` | Create | Styles for IntroNarrative |
| `src/components/AudienceCards/AudienceCards.jsx` | Create | 3-card audience section |
| `src/components/AudienceCards/AudienceCards.module.css` | Create | Styles for AudienceCards |
| `src/data/projects.js` | Modify | Append o5 "The Invisible Details" to offerings array |
| `src/components/Offerings/Offerings.jsx` | Modify | Update panel count label "04" → "05" |
| `src/components/FinalCTA/FinalCTA.jsx` | Modify | Remove audience paragraphs, add universal close |
| `src/components/Hero/Hero.jsx` | Modify | Update label to "Partners · Advisory · Service" |
| `src/App.jsx` | Modify | Import + wire IntroNarrative and AudienceCards |

---

## Task 1: IntroNarrative Component

**Files:**
- Create: `src/components/IntroNarrative/IntroNarrative.jsx`
- Create: `src/components/IntroNarrative/IntroNarrative.module.css`

- [ ] **Step 1: Create CSS module**

```css
/* src/components/IntroNarrative/IntroNarrative.module.css */
.root {
  background: var(--bg);
  padding: var(--section-py) var(--section-px);
}

.inner {
  max-width: var(--max-w);
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

.label {
  margin-bottom: 1.75rem;
}

.textBlock {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.body {
  font-size: var(--fs-subhead);
  color: var(--text-muted);
  line-height: 1.7;
}

.pull {
  font-family: var(--font-display);
  font-size: clamp(1.5rem, 2.5vw, 2.5rem);
  color: var(--text);
  line-height: 1.25;
  letter-spacing: -0.02em;
  border-left: 3px solid var(--accent);
  padding-left: 2rem;
}

.pull em {
  color: var(--accent);
  font-style: italic;
}

@media (max-width: 768px) {
  .inner {
    grid-template-columns: 1fr;
    gap: 2.5rem;
  }
  .pull {
    padding-left: 1.25rem;
  }
}
```

- [ ] **Step 2: Create JSX component**

```jsx
// src/components/IntroNarrative/IntroNarrative.jsx
import { useRef, useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import s from './IntroNarrative.module.css'

export default function IntroNarrative() {
  const rootRef = useRef(null)
  const textRef = useRef(null)
  const pullRef = useRef(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top 75%',
          once: true,
        },
        defaults: { ease: 'power3.out' },
      })
      tl.from(textRef.current.children, {
        autoAlpha: 0,
        y: 32,
        stagger: 0.14,
        duration: 0.85,
      }).from(pullRef.current, {
        autoAlpha: 0,
        y: 20,
        duration: 0.7,
      }, '-=0.4')
    }, rootRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={rootRef} id="what-ti-is" className={s.root}>
      <div className={s.inner}>
        <div ref={textRef} className={s.textBlock}>
          <span className={`u-label ${s.label}`}>What Makes TI Work</span>
          <p className={s.body}>
            Tenant improvement is detail-driven work. You're not touching the primary structure — you're adapting to it. Every decision lives at the connection level: anchors, edge-of-slab conditions, hidden supports that aren't on any drawing.
          </p>
          <p className={s.body}>
            The stakes are real. Miss the smallest detail and there's nothing below you to fix it. That's what brings a structural engineer onto a TI project — not just stairs and partitions, but the certainty that someone with deep expertise caught everything before it reached the field.
          </p>
        </div>
        <blockquote ref={pullRef} className={s.pull}>
          The devil isn't in the structure.
          <em> It's in the connections.</em>
        </blockquote>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Verify no import errors**

Run: `npm run build 2>&1 | grep -i error`  
Expected: no output (clean build)

- [ ] **Step 4: Commit**

```bash
git add src/components/IntroNarrative/
git commit -m "feat: add IntroNarrative 'What Makes TI Hard' section"
```

---

## Task 2: Wire IntroNarrative into App

**Files:**
- Modify: `src/App.jsx`

- [ ] **Step 1: Add import and place component**

In `src/App.jsx`, add the import after the Hero import line:
```jsx
import IntroNarrative from './components/IntroNarrative/IntroNarrative'
```

Then in the JSX, place `<IntroNarrative />` between `<Hero />` and `<ScrollyNarrative />`:
```jsx
{/* §1 Hero */}
<Hero />
{/* §2 Intro Narrative */}
<IntroNarrative />
{/* §3 Scrollytelling Narrative */}
<ScrollyNarrative />
```

- [ ] **Step 2: Start dev server and verify section renders**

Run: `npm run dev`  
Open browser, scroll past hero. Verify:
- Two-column layout: text left, pull-quote right
- Pull-quote has blue left border, italic accent text
- Scroll animation fades text up on enter
- Mobile (resize to 375px): stacks to single column

- [ ] **Step 3: Commit**

```bash
git add src/App.jsx
git commit -m "feat: wire IntroNarrative into page between Hero and ScrollyNarrative"
```

---

## Task 3: Add "The Invisible Details" to Offerings Data

**Files:**
- Modify: `src/data/projects.js`

- [ ] **Step 1: Append o5 to offerings array**

In `src/data/projects.js`, after the closing `}` of the `o4` object (before the closing `]` of the `offerings` array), add:

```js
  {
    id: 'o5',
    num: '05',
    title: 'The Invisible Details',
    headline: "In TI, the devil isn't in the structure. It's in the connections.",
    body: "TI work lives at the detail level — anchors, edge conditions, hidden supports that architects can't see and GCs can't invent. We've built our reputation on catching what others miss before it becomes a field problem.",
    bullets: [
      'Anchors, edge-of-slab conditions, and hidden structural supports',
      'Retrofit strategies that avoid triggering major code upgrades',
      'Coordination with architectural intent at every connection point',
    ],
    src: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400&q=80',
    alt: 'Close-up structural connection detail with precision hardware and steel',
    featured: false,
  },
```

- [ ] **Step 2: Update Offerings panel count label**

In `src/components/Offerings/Offerings.jsx`, find line 94:
```jsx
<span className={`u-label ${s.panelLabel}`}>
  What We Do Best · {item.num} / 04
</span>
```

Change to:
```jsx
<span className={`u-label ${s.panelLabel}`}>
  What We Do Best · {item.num} / 05
</span>
```

- [ ] **Step 3: Verify in browser**

Horizontal scroll section now shows 5 panels. Last panel "The Invisible Details" visible. Label reads "05 / 05" on final panel.

- [ ] **Step 4: Commit**

```bash
git add src/data/projects.js src/components/Offerings/Offerings.jsx
git commit -m "feat: add 'The Invisible Details' as 5th offerings panel"
```

---

## Task 4: AudienceCards Component

**Files:**
- Create: `src/components/AudienceCards/AudienceCards.jsx`
- Create: `src/components/AudienceCards/AudienceCards.module.css`

- [ ] **Step 1: Create CSS module**

```css
/* src/components/AudienceCards/AudienceCards.module.css */
.root {
  background: var(--bg-alt);
  padding: var(--section-py) var(--section-px);
}

.inner {
  max-width: var(--max-w);
  margin: 0 auto;
}

.label {
  margin-bottom: 3rem;
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0;
}

.card {
  padding: 2.5rem 2.5rem 2.5rem 0;
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.card:last-child {
  border-right: none;
  padding-right: 0;
  padding-left: 2.5rem;
}

.card:nth-child(2) {
  padding-left: 2.5rem;
}

.cardLabel {
  display: block;
  font-size: var(--fs-label);
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--accent);
}

.priority {
  font-size: var(--fs-body);
  color: var(--text-muted);
  line-height: 1.65;
  flex: 1;
}

.answer {
  font-family: var(--font-display);
  font-size: var(--fs-subhead);
  color: var(--text);
  line-height: 1.3;
}

@media (max-width: 768px) {
  .grid {
    grid-template-columns: 1fr;
  }

  .card {
    padding: 2rem 0;
    border-right: none;
    border-bottom: 1px solid var(--border);
  }

  .card:last-child {
    border-bottom: none;
    padding-left: 0;
  }

  .card:nth-child(2) {
    padding-left: 0;
  }
}
```

- [ ] **Step 2: Create JSX component**

```jsx
// src/components/AudienceCards/AudienceCards.jsx
import { useRef, useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import s from './AudienceCards.module.css'

const AUDIENCES = [
  {
    label: 'Architect',
    priority: 'Speed and responsiveness. You need someone on-call, fast turnaround, ready at kickoff.',
    answer: 'We pick up. Every time.',
  },
  {
    label: 'Building Owner',
    priority: 'Familiarity and relationship. You want the engineer who already knows your building — no transition cost, no rework.',
    answer: "We've probably already been in your building.",
  },
  {
    label: 'Property Manager',
    priority: 'Zero margin for error. Your reputation is on the line if this goes wrong.',
    answer: "We're the safe hands your team will thank you for.",
  },
]

export default function AudienceCards() {
  const rootRef = useRef(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.batch(`.${s.card}`, {
        onEnter: (els) =>
          gsap.from(els, {
            autoAlpha: 0,
            y: 40,
            stagger: 0.14,
            duration: 0.85,
            ease: 'power3.out',
          }),
        start: 'top 85%',
        once: true,
      })
    }, rootRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={rootRef} id="audiences" className={s.root}>
      <div className={s.inner}>
        <span className={`u-label ${s.label}`}>Who We Work With</span>
        <div className={s.grid}>
          {AUDIENCES.map(({ label, priority, answer }) => (
            <div key={label} className={s.card}>
              <span className={s.cardLabel}>{label}</span>
              <p className={s.priority}>{priority}</p>
              <p className={s.answer}>{answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/AudienceCards/
git commit -m "feat: add AudienceCards section for architect/owner/PM audiences"
```

---

## Task 5: Wire AudienceCards into App

**Files:**
- Modify: `src/App.jsx`

- [ ] **Step 1: Add import and place component**

In `src/App.jsx`, add the import (with other imports):
```jsx
import AudienceCards from './components/AudienceCards/AudienceCards'
```

Place `<AudienceCards />` between `<StatsStrip />` and `<Offerings />`:
```jsx
{/* §6 Charts / Stats */}
<StatsStrip />
{/* §7 Audience Cards */}
<AudienceCards />
{/* §8 Offerings */}
<Offerings />
```

- [ ] **Step 2: Verify in browser**

Scroll to StatsStrip → AudienceCards appears below it. Three cards in a row: Architect / Building Owner / Property Manager. Each card has blue eyebrow label, neutral priority text, serif answer line. Cards stagger-animate in on scroll.

Mobile: cards stack vertically with bottom borders.

- [ ] **Step 3: Commit**

```bash
git add src/App.jsx
git commit -m "feat: wire AudienceCards into page after StatsStrip"
```

---

## Task 6: FinalCTA Copy Edit

**Files:**
- Modify: `src/components/FinalCTA/FinalCTA.jsx`

- [ ] **Step 1: Replace audience paragraphs with universal close**

In `src/components/FinalCTA/FinalCTA.jsx`, find the `<p className={s.sub}>` block (lines 49–57):

```jsx
<p className={s.sub}>
  If you're an architect juggling a demanding client and a stacked
  schedule, we're the engineers you want on speed dial.
  <br />
  If you're a building owner looking to retain tenants with minimal
  disruption, we're the ones who already know your structure.
  <br />
  If you're a property manager with zero margin for error, we're the
  safe hands your team will thank you for.
</p>
```

Replace with:
```jsx
<p className={s.sub}>
  Bring us your tight timelines, your tangled gridlines, your last-minute stair.
  We'll bring the clarity, commitment, and structural know-how to get it done right.
</p>
```

- [ ] **Step 2: Verify in browser**

Scroll to bottom of page. FinalCTA shows heading + two-sentence universal close only. No audience-specific "If you're..." paragraphs.

- [ ] **Step 3: Commit**

```bash
git add src/components/FinalCTA/FinalCTA.jsx
git commit -m "refactor: simplify FinalCTA to universal close — audience moment now in AudienceCards"
```

---

## Task 7: Hero Label Copy Edit

**Files:**
- Modify: `src/components/Hero/Hero.jsx`

- [ ] **Step 1: Update label text**

In `src/components/Hero/Hero.jsx`, find line 52:
```jsx
<span className={`u-label ${s.label}`}>
  Nabih Youssef &amp; Associates · Structural Engineering
</span>
```

Replace with:
```jsx
<span className={`u-label ${s.label}`}>
  Nabih Youssef &amp; Associates · Partners · Advisory · Service
</span>
```

- [ ] **Step 2: Verify in browser**

Load page. Hero section label above the headline reads "NABIH YOUSSEF & ASSOCIATES · PARTNERS · ADVISORY · SERVICE". Styling unchanged (uppercase small label).

- [ ] **Step 3: Commit**

```bash
git add src/components/Hero/Hero.jsx
git commit -m "feat: update Hero label to Partners · Advisory · Service positioning"
```

---

## Task 8: Final Visual Verification

- [ ] **Step 1: Full page walkthrough**

With dev server running, scroll the full page top-to-bottom and verify:

| Section | Check |
|---------|-------|
| Hero | Label reads "Partners · Advisory · Service" |
| IntroNarrative | Two-column, text + pull-quote, animates in on scroll |
| ScrollyNarrative | Unchanged 4-pillar behavior |
| TrustStatement | Unchanged |
| StatsStrip | Unchanged |
| AudienceCards | 3 cards animate in, correct copy per audience |
| Offerings | 5 panels, last is "The Invisible Details", label "05 / 05" |
| FinalCTA | Universal close only, no "If you're..." paragraphs |

- [ ] **Step 2: Mobile check (375px viewport)**

- IntroNarrative: single column, text then pull-quote
- AudienceCards: stacked with dividers
- Offerings: horizontal scroll still works with 5 panels

- [ ] **Step 3: Build check**

Run: `npm run build`  
Expected: no errors, dist generated
