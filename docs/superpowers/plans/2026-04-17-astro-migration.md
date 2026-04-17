# Astro Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate the Vite+React SPA to an Astro static site with per-section React islands and `client:visible` lazy hydration for industrial-grade performance and SEO.

**Architecture:** A single `src/pages/index.astro` page owns the HTML document, head, and meta tags, and assembles all 14 React components as explicit islands. Above-fold components (`GlobalSetup`, `Nav`, `Hero`) use `client:load`; all 12 below-fold components use `client:visible` so their JS downloads only when the user scrolls to them. A new `GlobalSetup` React island initialises Lenis smooth scroll and GSAP plugins before any animated component can hydrate.

**Tech Stack:** Astro 5, `@astrojs/react`, React 18, GSAP (ScrollTrigger, SplitText), Lenis, CSS Modules, `gh-pages`

---

## File Map

| Action | Path | Responsibility |
|---|---|---|
| Create | `src/pages/index.astro` | HTML document, head, meta/OG, assembles all islands |
| Create | `src/components/GlobalSetup/GlobalSetup.jsx` | Lenis + GSAP global init, ScrollTrigger.refresh() |
| Create | `astro.config.mjs` | Astro config for Vercel / GoDaddy (base `/`) |
| Create | `astro.config.ghpages.mjs` | Astro config for GitHub Pages (base `/TI_Webpage/`) |
| Modify | `package.json` | Replace vite deps with astro deps, update scripts |
| Modify | `src/components/ScrollyNarrative/ScrollyNarrative.jsx` | Fix `/TI_Webpage/` asset path + `invalidateOnRefresh` |
| Modify | `src/components/Hero/Hero.jsx` | Add `invalidateOnRefresh: true` |
| Modify | `src/components/TrustStatement/TrustStatement.jsx` | Add `invalidateOnRefresh: true` |
| Modify | `src/components/Nav/Nav.jsx` | Add `invalidateOnRefresh: true` to `ScrollTrigger.create` |
| Modify | `src/components/IntroNarrative/IntroNarrative.jsx` | Add `invalidateOnRefresh: true` |
| Modify | `src/components/MidCTA/MidCTA.jsx` | Add `invalidateOnRefresh: true` |
| Modify | `src/components/Testimonials/Testimonials.jsx` | Add `invalidateOnRefresh: true` |
| Modify | `src/components/MasonryGallery/MasonryGallery.jsx` | Add `invalidateOnRefresh: true` |
| Modify | `src/components/FinalCTA/FinalCTA.jsx` | Add `invalidateOnRefresh: true` |
| Modify | `src/components/StatsStrip/StatsStrip.jsx` | Add `invalidateOnRefresh: true` to all 4 trigger configs + batch |
| Modify | `src/components/AudienceCards/AudienceCards.jsx` | Add `invalidateOnRefresh: true` to batch |
| Modify | `src/components/TestimonialsService/TestimonialsService.jsx` | Add `invalidateOnRefresh: true` to batch |
| Delete | `vite.config.js`, `src/main.jsx`, `src/App.jsx`, `index.html` | Replaced by Astro |
| No change | `src/components/ProjectGallery/ProjectGallery.jsx` | Already has `invalidateOnRefresh: true` |
| No change | `src/components/Offerings/Offerings.jsx` | Already has `invalidateOnRefresh: true` |

---

## Task 1: Update package.json and install Astro

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Replace deps and scripts in package.json**

Replace the entire `package.json` with:

```json
{
  "name": "nya-ti-microsite",
  "private": true,
  "version": "3.0.0",
  "type": "module",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "predeploy": "astro build --config astro.config.ghpages.mjs",
    "deploy": "gh-pages -d dist"
  },
  "dependencies": {
    "@astrojs/react": "^4.0.0",
    "@gsap/react": "^2.1.1",
    "astro": "^5.0.0",
    "gsap": "^3.12.5",
    "lenis": "^1.1.14",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "gh-pages": "^6.3.0",
    "playwright": "^1.59.1"
  },
  "homepage": "https://abindal-nyase.github.io/TI_Webpage"
}
```

- [ ] **Step 2: Install dependencies**

```bash
npm install
```

Expected: clean install, no errors.

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: swap vite for astro deps"
```

---

## Task 2: Create Astro config files

**Files:**
- Create: `astro.config.mjs`
- Create: `astro.config.ghpages.mjs`

- [ ] **Step 1: Create `astro.config.mjs` (Vercel / GoDaddy)**

```js
// astro.config.mjs
import { defineConfig } from 'astro/config'
import react from '@astrojs/react'

export default defineConfig({
  integrations: [react()],
  output: 'static',
  base: '/',
})
```

- [ ] **Step 2: Create `astro.config.ghpages.mjs` (GitHub Pages)**

```js
// astro.config.ghpages.mjs
import { defineConfig } from 'astro/config'
import react from '@astrojs/react'

export default defineConfig({
  integrations: [react()],
  output: 'static',
  base: '/TI_Webpage/',
})
```

- [ ] **Step 3: Commit**

```bash
git add astro.config.mjs astro.config.ghpages.mjs
git commit -m "chore: add astro config files"
```

---

## Task 3: Create GlobalSetup component

**Files:**
- Create: `src/components/GlobalSetup/GlobalSetup.jsx`

- [ ] **Step 1: Create the component**

```jsx
// src/components/GlobalSetup/GlobalSetup.jsx
import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

export default function GlobalSetup() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger, SplitText)

    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true })
    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add((time) => { lenis.raf(time * 1000) })
    gsap.ticker.lagSmoothing(0)
    window.__lenis = lenis

    // Refresh all ScrollTrigger positions after the initial hydration burst.
    // client:visible islands mount incrementally, adding height to the page.
    // This ensures every trigger's start/end is calculated against final layout.
    const t = setTimeout(() => ScrollTrigger.refresh(), 400)

    return () => {
      clearTimeout(t)
      lenis.destroy()
    }
  }, [])

  return null
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/GlobalSetup/GlobalSetup.jsx
git commit -m "feat: add GlobalSetup island for Lenis + GSAP init"
```

---

## Task 4: Create src/pages/index.astro

**Files:**
- Create: `src/pages/index.astro`

- [ ] **Step 1: Create the page**

```astro
---
// src/pages/index.astro
import '../index.css'
import GlobalSetup from '../components/GlobalSetup/GlobalSetup'
import Nav from '../components/Nav/Nav'
import Hero from '../components/Hero/Hero'
import IntroNarrative from '../components/IntroNarrative/IntroNarrative'
import ScrollyNarrative from '../components/ScrollyNarrative/ScrollyNarrative'
import TrustStatement from '../components/TrustStatement/TrustStatement'
import ProjectGallery from '../components/ProjectGallery/ProjectGallery'
import MidCTA from '../components/MidCTA/MidCTA'
import StatsStrip from '../components/StatsStrip/StatsStrip'
import AudienceCards from '../components/AudienceCards/AudienceCards'
import Offerings from '../components/Offerings/Offerings'
import TestimonialsService from '../components/TestimonialsService/TestimonialsService'
import Testimonials from '../components/Testimonials/Testimonials'
import MasonryGallery from '../components/MasonryGallery/MasonryGallery'
import FinalCTA from '../components/FinalCTA/FinalCTA'
---

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg?v=2" />

    <title>Tenant Improvement Engineering — Nabih Youssef &amp; Associates</title>
    <meta
      name="description"
      content="NYA brings speed, precision, and structural expertise to every tenant improvement project. High-rise TI, lobby renovations, signature staircases, and fast-turn fit-outs across California."
    />

    <!-- Open Graph -->
    <meta property="og:type" content="website" />
    <meta property="og:title" content="Tenant Improvement Engineering — Nabih Youssef & Associates" />
    <meta
      property="og:description"
      content="NYA brings speed, precision, and structural expertise to every tenant improvement project. High-rise TI, lobby renovations, signature staircases, and fast-turn fit-outs across California."
    />
    <meta property="og:image" content="/Hero.jpg" />

    <!-- Twitter / X Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="Tenant Improvement Engineering — Nabih Youssef & Associates" />
    <meta
      name="twitter:description"
      content="NYA brings speed, precision, and structural expertise to every tenant improvement project."
    />
    <meta name="twitter:image" content="/Hero.jpg" />

    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Inter:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&display=swap"
      rel="stylesheet"
    />
  </head>
  <body>
    <!-- Global init: Lenis smooth scroll + GSAP plugins. Must be client:load and first. -->
    <GlobalSetup client:load />

    <Nav client:load />

    <main>
      <Hero client:load />
      <IntroNarrative client:visible />
      <ScrollyNarrative client:visible />
      <TrustStatement client:visible />
      <ProjectGallery client:visible />
      <MidCTA client:visible />
      <StatsStrip client:visible />
      <AudienceCards client:visible />
      <Offerings client:visible />
      <TestimonialsService client:visible />
      <Testimonials client:visible />
      <MasonryGallery client:visible />
      <FinalCTA client:visible />
    </main>
  </body>
</html>
```

- [ ] **Step 2: Verify Astro dev server starts**

```bash
npm run dev
```

Expected: Astro dev server starts on `http://localhost:4321` with no errors. The page should load in the browser. Animations won't work yet (Vite files still present, components not updated). That's fine at this stage.

- [ ] **Step 3: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: add index.astro page with island hydration map"
```

---

## Task 5: Fix ScrollyNarrative — asset path + invalidateOnRefresh

**Files:**
- Modify: `src/components/ScrollyNarrative/ScrollyNarrative.jsx`

- [ ] **Step 1: Fix the hardcoded base path (line 125)**

Change:
```jsx
<img src="/TI_Webpage/nya-blue.png" alt="" />
```
To:
```jsx
<img src="/nya-blue.png" alt="" />
```

- [ ] **Step 2: Add `invalidateOnRefresh: true` to the scrollTrigger config (lines 52–57)**

Change:
```js
scrollTrigger: {
  trigger: wrapperRef.current,
  start: 'top top',
  end: 'bottom bottom',
  scrub: 1.2,
},
```
To:
```js
scrollTrigger: {
  trigger: wrapperRef.current,
  start: 'top top',
  end: 'bottom bottom',
  scrub: 1.2,
  invalidateOnRefresh: true,
},
```

- [ ] **Step 3: Commit**

```bash
git add src/components/ScrollyNarrative/ScrollyNarrative.jsx
git commit -m "fix: scrolly narrative asset path and invalidateOnRefresh"
```

---

## Task 6: Add invalidateOnRefresh to Hero and TrustStatement

**Files:**
- Modify: `src/components/Hero/Hero.jsx`
- Modify: `src/components/TrustStatement/TrustStatement.jsx`

- [ ] **Step 1: Update Hero.jsx (lines 32–37)**

Change:
```js
scrollTrigger: {
  trigger: rootRef.current,
  start: 'top top',
  end: 'bottom top',
  scrub: true,
},
```
To:
```js
scrollTrigger: {
  trigger: rootRef.current,
  start: 'top top',
  end: 'bottom top',
  scrub: true,
  invalidateOnRefresh: true,
},
```

- [ ] **Step 2: Update TrustStatement.jsx (lines 15–20)**

Change:
```js
scrollTrigger: {
  trigger: rootRef.current,
  start: 'top 72%',
  end: 'center center',
  scrub: 0.7,
},
```
To:
```js
scrollTrigger: {
  trigger: rootRef.current,
  start: 'top 72%',
  end: 'center center',
  scrub: 0.7,
  invalidateOnRefresh: true,
},
```

- [ ] **Step 3: Commit**

```bash
git add src/components/Hero/Hero.jsx src/components/TrustStatement/TrustStatement.jsx
git commit -m "fix: add invalidateOnRefresh to Hero and TrustStatement"
```

---

## Task 7: Add invalidateOnRefresh to IntroNarrative, MidCTA, Testimonials, MasonryGallery, FinalCTA

These five components all follow the same pattern: a single `scrollTrigger: { ... }` block inside a `gsap.timeline` or `gsap.from`.

**Files:**
- Modify: `src/components/IntroNarrative/IntroNarrative.jsx`
- Modify: `src/components/MidCTA/MidCTA.jsx`
- Modify: `src/components/Testimonials/Testimonials.jsx`
- Modify: `src/components/MasonryGallery/MasonryGallery.jsx`
- Modify: `src/components/FinalCTA/FinalCTA.jsx`

- [ ] **Step 1: Update IntroNarrative.jsx (lines 12–17)**

Change:
```js
scrollTrigger: {
  trigger: rootRef.current,
  start: 'top 75%',
  once: true,
},
```
To:
```js
scrollTrigger: {
  trigger: rootRef.current,
  start: 'top 75%',
  once: true,
  invalidateOnRefresh: true,
},
```

- [ ] **Step 2: Update MidCTA.jsx (lines 17–21)**

Change:
```js
scrollTrigger: {
  trigger: rootRef.current,
  start: 'top 80%',
  once: true,
},
```
To:
```js
scrollTrigger: {
  trigger: rootRef.current,
  start: 'top 80%',
  once: true,
  invalidateOnRefresh: true,
},
```

- [ ] **Step 3: Update Testimonials.jsx (lines 39–43)**

Change:
```js
scrollTrigger: {
  trigger: rootRef.current,
  start: 'top 78%',
  once: true,
},
```
To:
```js
scrollTrigger: {
  trigger: rootRef.current,
  start: 'top 78%',
  once: true,
  invalidateOnRefresh: true,
},
```

- [ ] **Step 4: Update MasonryGallery.jsx (lines 21–24)**

Change:
```js
scrollTrigger: {
  trigger: rootRef.current,
  start: 'top 78%',
  once: true,
},
```
To:
```js
scrollTrigger: {
  trigger: rootRef.current,
  start: 'top 78%',
  once: true,
  invalidateOnRefresh: true,
},
```

- [ ] **Step 5: Update FinalCTA.jsx (lines 15–19)**

Change:
```js
scrollTrigger: {
  trigger: rootRef.current,
  start: 'top 75%',
  once: true,
},
```
To:
```js
scrollTrigger: {
  trigger: rootRef.current,
  start: 'top 75%',
  once: true,
  invalidateOnRefresh: true,
},
```

- [ ] **Step 6: Commit**

```bash
git add src/components/IntroNarrative/IntroNarrative.jsx src/components/MidCTA/MidCTA.jsx src/components/Testimonials/Testimonials.jsx src/components/MasonryGallery/MasonryGallery.jsx src/components/FinalCTA/FinalCTA.jsx
git commit -m "fix: add invalidateOnRefresh to once-trigger components"
```

---

## Task 8: Fix Nav ScrollTrigger

**Files:**
- Modify: `src/components/Nav/Nav.jsx`

Nav uses `ScrollTrigger.create(...)` directly rather than a `scrollTrigger:` config property.

- [ ] **Step 1: Update Nav.jsx (lines 17–22)**

Change:
```js
ScrollTrigger.create({
  start: '80px top',
  onEnter:     () => navRef.current?.classList.add(s.scrolled),
  onLeaveBack: () => navRef.current?.classList.remove(s.scrolled),
})
```
To:
```js
ScrollTrigger.create({
  start: '80px top',
  invalidateOnRefresh: true,
  onEnter:     () => navRef.current?.classList.add(s.scrolled),
  onLeaveBack: () => navRef.current?.classList.remove(s.scrolled),
})
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Nav/Nav.jsx
git commit -m "fix: add invalidateOnRefresh to Nav ScrollTrigger"
```

---

## Task 9: Fix StatsStrip — multiple ScrollTrigger configs

StatsStrip has four separate ScrollTrigger usages across two sub-components and the main component.

**Files:**
- Modify: `src/components/StatsStrip/StatsStrip.jsx`

- [ ] **Step 1: Update `YearlyChart` sub-component scrollTrigger (lines 60–65)**

Change:
```js
scrollTrigger: {
  trigger: chartRef.current,
  start: "top 82%",
  end: "top 50%",
  scrub: 1,
},
```
To:
```js
scrollTrigger: {
  trigger: chartRef.current,
  start: "top 82%",
  end: "top 50%",
  scrub: 1,
  invalidateOnRefresh: true,
},
```

- [ ] **Step 2: Update `AnimatedCounter` sub-component scrollTrigger (lines 176–179)**

Change:
```js
scrollTrigger: {
  trigger: ref.current,
  start: 'top 82%',
  once: true,
},
```
To:
```js
scrollTrigger: {
  trigger: ref.current,
  start: 'top 82%',
  once: true,
  invalidateOnRefresh: true,
},
```

- [ ] **Step 3: Update `ScrollTrigger.batch` for stat cards (lines 199–209)**

Change:
```js
ScrollTrigger.batch(`.${s.statCard}`, {
  onEnter: (els) =>
    gsap.from(els, {
      autoAlpha: 0,
      y: 32,
      stagger: 0.12,
      duration: 0.8,
      ease: 'power3.out',
    }),
  start: 'top 85%',
  once: true,
})
```
To:
```js
ScrollTrigger.batch(`.${s.statCard}`, {
  onEnter: (els) =>
    gsap.from(els, {
      autoAlpha: 0,
      y: 32,
      stagger: 0.12,
      duration: 0.8,
      ease: 'power3.out',
    }),
  start: 'top 85%',
  once: true,
  invalidateOnRefresh: true,
})
```

- [ ] **Step 4: Update bar fill scrollTrigger (lines 219–224)**

Change:
```js
scrollTrigger: {
  trigger: bar,
  start: "top 85%",
  end: "top 50%",
  scrub: 1,
},
```
To:
```js
scrollTrigger: {
  trigger: bar,
  start: "top 85%",
  end: "top 50%",
  scrub: 1,
  invalidateOnRefresh: true,
},
```

- [ ] **Step 5: Update breakdown section scrollTrigger (lines 233–238)**

Change:
```js
scrollTrigger: {
  trigger: `.${s.breakdownSection}`,
  start: "top 82%",
  end: "top 50%",
  scrub: 1,
},
```
To:
```js
scrollTrigger: {
  trigger: `.${s.breakdownSection}`,
  start: "top 82%",
  end: "top 50%",
  scrub: 1,
  invalidateOnRefresh: true,
},
```

- [ ] **Step 6: Commit**

```bash
git add src/components/StatsStrip/StatsStrip.jsx
git commit -m "fix: add invalidateOnRefresh to all StatsStrip triggers"
```

---

## Task 10: Add invalidateOnRefresh to AudienceCards and TestimonialsService

Both use `ScrollTrigger.batch`.

**Files:**
- Modify: `src/components/AudienceCards/AudienceCards.jsx`
- Modify: `src/components/TestimonialsService/TestimonialsService.jsx`

- [ ] **Step 1: Update AudienceCards.jsx (lines 29–39)**

Change:
```js
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
```
To:
```js
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
  invalidateOnRefresh: true,
})
```

- [ ] **Step 2: Update TestimonialsService.jsx (lines 47–56)**

Change:
```js
ScrollTrigger.batch(`.${s.row}`, {
  onEnter: (els) =>
    gsap.from(els, {
      autoAlpha: 0,
      y: 40,
      duration: 0.9,
      stagger: 0.15,
      ease: 'power3.out',
    }),
  start: 'top 80%',
  once: true,
})
```
To:
```js
ScrollTrigger.batch(`.${s.row}`, {
  onEnter: (els) =>
    gsap.from(els, {
      autoAlpha: 0,
      y: 40,
      duration: 0.9,
      stagger: 0.15,
      ease: 'power3.out',
    }),
  start: 'top 80%',
  once: true,
  invalidateOnRefresh: true,
})
```

- [ ] **Step 3: Commit**

```bash
git add src/components/AudienceCards/AudienceCards.jsx src/components/TestimonialsService/TestimonialsService.jsx
git commit -m "fix: add invalidateOnRefresh to batch ScrollTrigger components"
```

---

## Task 11: Remove old Vite files

**Files:**
- Delete: `vite.config.js`
- Delete: `src/main.jsx`
- Delete: `src/App.jsx`
- Delete: `index.html`

- [ ] **Step 1: Delete the files**

```bash
git rm vite.config.js src/main.jsx src/App.jsx index.html
```

- [ ] **Step 2: Commit**

```bash
git commit -m "chore: remove vite entry files replaced by astro"
```

---

## Task 12: Smoke test — dev server, build, and deploy check

- [ ] **Step 1: Run the dev server**

```bash
npm run dev
```

Open `http://localhost:4321` in a browser.

Verify:
- Page loads without JavaScript errors in the console
- Nav appears and becomes solid on scroll
- Hero animations fire (SplitText char reveal)
- Scrolling down triggers each section's animation
- ScrollyNarrative card flip works
- StatsStrip counters animate
- Horizontal scroll sections (ProjectGallery, Offerings) pin and scroll correctly
- NYA logo on ScrollyNarrative card back is visible (not broken path)

- [ ] **Step 2: Check page source for real HTML**

In the browser, open View Source (`Ctrl+U`). Confirm:
- The `<head>` contains the title, meta description, and OG tags
- The `<body>` contains rendered HTML content (headings, nav links, etc.) — not just `<div id="root"></div>`

- [ ] **Step 3: Run a production build**

```bash
npm run build
```

Expected: `dist/` folder generated with no errors.

- [ ] **Step 4: Preview the production build**

```bash
npm run preview
```

Open `http://localhost:4321` and re-verify all animations from Step 1.

- [ ] **Step 5: Test the GitHub Pages build**

```bash
npx astro build --config astro.config.ghpages.mjs
```

Expected: `dist/` folder generated with no errors. Check that `dist/index.html` references assets with `/TI_Webpage/` prefix.

- [ ] **Step 6: Final commit**

```bash
git add -A
git commit -m "feat: complete astro migration with lazy island hydration"
```
