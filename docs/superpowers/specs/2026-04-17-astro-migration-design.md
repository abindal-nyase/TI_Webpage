# Astro Migration Design
**Date:** 2026-04-17
**Project:** NyaSE TI Microsite (`nya-ti-microsite`)
**Status:** Approved

## Goals
- Industrial-grade performance and Core Web Vitals scores
- Real HTML in page source for SEO (meta tags, body content, OG tags)
- Preserve all GSAP animations and Lenis smooth scroll exactly as-is
- Deploy statically to GoDaddy (production), Vercel (development), GitHub Pages (showcase)

## Approach
Astro static site (`output: 'static'`) with the `@astrojs/react` integration. All 14 existing React components are kept as React islands. Above-fold components hydrate with `client:load`; all below-fold components hydrate with `client:visible` so their JS is only downloaded when the user scrolls to them.

## Architecture

### Folder structure changes
```
src/
  pages/
    index.astro               ← NEW: replaces App.jsx + index.html
  components/
    GlobalSetup/
      GlobalSetup.jsx         ← NEW: Lenis + GSAP global init (renders nothing)
    [all 14 existing components — unchanged except fixes below]
  data/projects.js            ← unchanged
  index.css                   ← unchanged
public/                       ← unchanged
astro.config.mjs              ← NEW: replaces vite.config.js
astro.config.ghpages.mjs      ← NEW: GitHub Pages build (base: '/TI_Webpage/')
package.json                  ← updated deps
```

Files removed: `vite.config.js`, `src/main.jsx`, `src/App.jsx`, `index.html`

### New: `src/pages/index.astro`
The single Astro page. Owns the HTML document (`<html>`, `<head>`, `<body>`), all meta/OG tags, global CSS import, and renders all 14 React islands in order with their hydration directives.

### New: `src/components/GlobalSetup/GlobalSetup.jsx`
A React island (`client:load`) that renders `null` but runs Lenis + GSAP setup in `useEffect`. Placed as the first island on the page so it initialises before any `client:visible` component can fire.

```jsx
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
  }, [])
  return null
}
```

## Hydration Map

| Component | Directive | Reason |
|---|---|---|
| `GlobalSetup` | `client:load` | Must run first — Lenis + GSAP registration |
| `Nav` | `client:load` | Above fold, interactive on load |
| `Hero` | `client:load` | Above fold, GSAP animation fires on load |
| `IntroNarrative` | `client:visible` | Below fold |
| `ScrollyNarrative` | `client:visible` | Below fold, scroll-triggered |
| `TrustStatement` | `client:visible` | Below fold |
| `ProjectGallery` | `client:visible` | Below fold |
| `MidCTA` | `client:visible` | Below fold |
| `StatsStrip` | `client:visible` | Below fold, scroll-triggered |
| `AudienceCards` | `client:visible` | Below fold |
| `Offerings` | `client:visible` | Below fold |
| `TestimonialsService` | `client:visible` | Below fold |
| `Testimonials` | `client:visible` | Below fold |
| `MasonryGallery` | `client:visible` | Below fold |
| `FinalCTA` | `client:visible` | Below fold |

## Component Code Changes

These are the only changes required inside existing component files:

### 1. `invalidateOnRefresh: true` on all ScrollTrigger configs
Because `client:visible` islands hydrate incrementally, page height grows as components mount. Without this, ScrollTrigger `start`/`end` positions — calculated at hydration time — will be stale after subsequent islands add height.

Add `invalidateOnRefresh: true` to every `scrollTrigger: { ... }` config block in all 13 animated components:
`Hero`, `Nav`, `IntroNarrative`, `ScrollyNarrative`, `TrustStatement`, `ProjectGallery`, `MidCTA`, `StatsStrip`, `AudienceCards`, `Offerings`, `TestimonialsService`, `Testimonials`, `MasonryGallery`, `MidCTA`, `FinalCTA`

### 2. Replace hardcoded `/TI_Webpage/` asset paths
The current GitHub Pages base path is baked into component source (e.g. `/TI_Webpage/nya-blue.png`). For Vercel and GoDaddy the base is `/`. All occurrences must be replaced with `/` paths (e.g. `/nya-blue.png`).

Affected: `ScrollyNarrative.jsx` only (one occurrence: `/TI_Webpage/nya-blue.png` → `/nya-blue.png`).

## Config Files

### `astro.config.mjs` (default — Vercel / GoDaddy)
```js
import { defineConfig } from 'astro/config'
import react from '@astrojs/react'

export default defineConfig({
  integrations: [react()],
  output: 'static',
  base: '/',
})
```

### `astro.config.ghpages.mjs` (GitHub Pages showcase)
```js
import { defineConfig } from 'astro/config'
import react from '@astrojs/react'

export default defineConfig({
  integrations: [react()],
  output: 'static',
  base: '/TI_Webpage/',
})
```

`package.json` deploy script updated to:
```json
"deploy": "astro build --config astro.config.ghpages.mjs && gh-pages -d dist"
```

## Dependencies

**Add:**
- `astro`
- `@astrojs/react`

**Remove:**
- `@vitejs/plugin-react`
- `vite`

**Keep:**
- `react`, `react-dom`, `gsap`, `@gsap/react`, `lenis`, `gh-pages`, `playwright`

## Known Risks & Mitigations

| Risk | Mitigation |
|---|---|
| ScrollTrigger position drift from incremental hydration | `invalidateOnRefresh: true` on all ScrollTrigger configs |
| GlobalSetup race with early `client:visible` components | GlobalSetup is `client:load` and placed first; `client:visible` requires scroll, so it fires after load |
| Hardcoded base paths breaking on non-GitHub-Pages deploys | Audit and replace all `/TI_Webpage/` prefixes |
| `gh-pages` deploy script incompatible | Updated to use `astro build --config` flag |

## Success Criteria
- Lighthouse Performance score ≥ 90 on mobile
- Page source contains real body HTML (not a JS shell)
- All GSAP animations and Lenis scroll behaviour identical to current site
- `npm run dev` works with Astro dev server
- `npm run build` produces static `dist/` deployable to Vercel and GoDaddy
- `npm run deploy` publishes to GitHub Pages correctly
