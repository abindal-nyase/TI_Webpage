# NYA TI Microsite Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a single-page cinematic scrollytelling microsite for NYA's Tenant Improvement practice at ti.nyase.com.

**Architecture:** Vite + React SPA with 11 scroll-driven sections. Lenis provides smooth scroll globally; GSAP ScrollTrigger drives pinned/cinematic sequences; Framer Motion handles component-level entrance animations. All content data lives in `src/data/` for easy placeholder replacement. Plausible Analytics tracks visits and CTA clicks.

**Tech Stack:** Vite 5, React 18, Framer Motion 11, GSAP 3 (ScrollTrigger + SplitText), Lenis 1, Plausible Analytics

---

## File Map

```
TIPage/
├── index.html                        # Plausible script tag lives here
├── vite.config.js
├── package.json
├── src/
│   ├── main.jsx                      # ReactDOM.createRoot entry
│   ├── App.jsx                       # Lenis init + section composition
│   ├── styles/
│   │   ├── tokens.css                # CSS custom properties (colors, type, spacing)
│   │   └── globals.css               # reset, base, font imports
│   ├── utils/
│   │   ├── gsap.js                   # registers GSAP plugins once
│   │   └── analytics.js              # Plausible event wrappers
│   ├── hooks/
│   │   └── useLenis.js               # Lenis instance + GSAP ticker integration
│   ├── data/
│   │   ├── stats.js                  # XX+/YY+ placeholder stat values
│   │   ├── offerings.js              # service category cards
│   │   ├── testimonials.js           # placeholder quotes + technical descriptions
│   │   ├── projects.js               # gallery image slots + metadata
│   │   └── chartData.js             # project type breakdown + permit turnaround
│   └── components/
│       ├── Hero/
│       │   ├── Hero.jsx              # §01 full-screen dark + word reveal + parallax
│       │   └── Hero.module.css
│       ├── IntroNarrative/
│       │   ├── IntroNarrative.jsx    # §02 two-column fade-up
│       │   └── IntroNarrative.module.css
│       ├── TrustStatement/
│       │   ├── TrustStatement.jsx    # §03 pinned dark pull-quote
│       │   └── TrustStatement.module.css
│       ├── StatsStrip/
│       │   ├── StatsStrip.jsx        # §04 counter animations
│       │   └── StatsStrip.module.css
│       ├── ImageGallery/
│       │   ├── ImageGallery.jsx      # §05 horizontal + §10 masonry (variant prop)
│       │   └── ImageGallery.module.css
│       ├── MidCTA/
│       │   ├── MidCTA.jsx            # §06 subtle email nudge
│       │   └── MidCTA.module.css
│       ├── Charts/
│       │   ├── Charts.jsx            # §07 animated bar chart + permit stat
│       │   └── Charts.module.css
│       ├── Offerings/
│       │   ├── Offerings.jsx         # §08 dark 3-col grid
│       │   └── Offerings.module.css
│       ├── Testimonials/
│       │   ├── Testimonials.jsx      # §09 split quote + service detail
│       │   └── Testimonials.module.css
│       └── FinalCTA/
│           ├── FinalCTA.jsx          # §11 closing dark CTA + footer
│           └── FinalCTA.module.css
├── public/
│   └── nya-logomark.png              # NYA logomark (copy from assets/logos/)
└── assets/
    └── PHOTO-SWAP-GUIDE.md           # instructions for replacing stock photos
```

---

## Task 1: Project Scaffolding

**Files:**
- Create: `package.json`
- Create: `vite.config.js`
- Create: `index.html`
- Create: `src/main.jsx`

- [ ] **Step 1: Scaffold Vite + React project**

```bash
cd /Users/abindal/dev/NYAScripts/TIPage
npm create vite@latest . -- --template react
```

Expected: Vite scaffolds `src/`, `index.html`, `package.json`, `vite.config.js`.

- [ ] **Step 2: Install dependencies**

```bash
npm install framer-motion gsap lenis
npm install -D vitest @vitest/ui @testing-library/react @testing-library/jest-dom jsdom
```

- [ ] **Step 3: Configure Vitest in vite.config.js**

Replace contents of `vite.config.js`:

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test-setup.js',
  },
})
```

- [ ] **Step 4: Create test setup file**

Create `src/test-setup.js`:

```js
import '@testing-library/jest-dom'
```

- [ ] **Step 5: Copy NYA logomark to public/**

```bash
cp "/Users/abindal/dev/NYAScripts/TIPage/assets/logos/Nabih Youssef Associates Logomark.png" /Users/abindal/dev/NYAScripts/TIPage/public/nya-logomark.png
```

- [ ] **Step 6: Update index.html**

Replace contents of `index.html`:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="Nabih Youssef & Associates — Tenant Improvement Structural Engineering" />
    <title>NYA — Tenant Improvement Practice</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300&family=Inter:wght@300;400&display=swap" rel="stylesheet" />
    <!-- PLAUSIBLE: replace 'ti.nyase.com' with actual domain before launch -->
    <script defer data-domain="ti.nyase.com" src="https://plausible.io/js/script.tagged-events.js"></script>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

- [ ] **Step 7: Update src/main.jsx**

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import './styles/globals.css'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
```

- [ ] **Step 8: Verify dev server starts**

```bash
npm run dev
```

Expected: Server starts at `http://localhost:5173`. Default Vite page visible.

- [ ] **Step 9: Commit**

```bash
git init
git add .
git commit -m "feat: scaffold Vite + React project with GSAP, Framer Motion, Lenis"
```

---

## Task 2: Design Tokens + Global Styles

**Files:**
- Create: `src/styles/tokens.css`
- Create: `src/styles/globals.css`

- [ ] **Step 1: Write design tokens**

Create `src/styles/tokens.css`:

```css
:root {
  /* Colors */
  --bg:           #FAF8F5;
  --bg-dark:      #1a1714;
  --text:         #1a1714;
  --text-secondary: #8a7f76;
  --text-muted:   #c8bfb7;
  --border:       #e8e2db;
  --border-muted: #f0ede8;

  /* Typography */
  --font-serif: 'Cormorant Garamond', Georgia, serif;
  --font-sans:  'Inter', system-ui, sans-serif;

  /* Type scale */
  --text-label:  10px;
  --text-xs:     11px;
  --text-sm:     13px;
  --text-base:   16px;
  --text-lg:     20px;
  --text-xl:     28px;
  --text-2xl:    40px;
  --text-3xl:    56px;
  --text-hero:   72px;

  /* Spacing */
  --section-gap: 140px;
  --container:   1200px;
  --gutter:      48px;

  /* Letter spacing */
  --tracking-label: 0.25em;
  --tracking-wide:  0.1em;
}

@media (max-width: 768px) {
  :root {
    --text-hero:  44px;
    --text-3xl:   36px;
    --text-2xl:   28px;
    --section-gap: 80px;
    --gutter: 24px;
  }
}
```

- [ ] **Step 2: Write global styles**

Create `src/styles/globals.css`:

```css
@import './tokens.css';

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  background-color: var(--bg);
  color: var(--text);
  font-family: var(--font-sans);
  font-weight: 300;
  overflow-x: hidden;
}

/* Lenis smooth scroll */
html.lenis {
  height: auto;
}

.lenis.lenis-smooth {
  scroll-behavior: auto;
}

.lenis.lenis-smooth [data-lenis-prevent] {
  overscroll-behavior: contain;
}

img {
  display: block;
  max-width: 100%;
}

a {
  color: inherit;
  text-decoration: none;
}

/* Utility: visually hide scroll during GSAP pin */
.pin-spacer {
  pointer-events: none;
}
```

- [ ] **Step 3: Verify styles load**

```bash
npm run dev
```

Open `http://localhost:5173` — body background should be `#FAF8F5`.

- [ ] **Step 4: Commit**

```bash
git add src/styles/
git commit -m "feat: add design tokens and global CSS"
```

---

## Task 3: GSAP Registration + Lenis Hook

**Files:**
- Create: `src/utils/gsap.js`
- Create: `src/hooks/useLenis.js`

- [ ] **Step 1: Write GSAP plugin registration**

Create `src/utils/gsap.js`:

```js
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(ScrollTrigger, SplitText)

export { gsap, ScrollTrigger, SplitText }
```

- [ ] **Step 2: Write Lenis hook**

Create `src/hooks/useLenis.js`:

```js
import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from '../utils/gsap'

export function useLenis() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
    })

    // Sync Lenis scroll position with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update)

    // Drive Lenis via GSAP ticker for frame-perfect sync
    const tick = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(tick)
      lenis.destroy()
    }
  }, [])
}
```

- [ ] **Step 3: Write test for analytics (verify Lenis hook doesn't throw)**

Create `src/hooks/useLenis.test.js`:

```js
import { renderHook } from '@testing-library/react'
import { useLenis } from './useLenis'

// Mock Lenis — jsdom has no real scroll engine
vi.mock('lenis', () => ({
  default: vi.fn().mockImplementation(() => ({
    on: vi.fn(),
    raf: vi.fn(),
    destroy: vi.fn(),
  })),
}))

vi.mock('../utils/gsap', () => ({
  gsap: {
    ticker: { add: vi.fn(), remove: vi.fn(), lagSmoothing: vi.fn() },
  },
  ScrollTrigger: { update: vi.fn() },
  SplitText: vi.fn(),
}))

test('useLenis mounts and unmounts without error', () => {
  const { unmount } = renderHook(() => useLenis())
  expect(() => unmount()).not.toThrow()
})
```

- [ ] **Step 4: Run test**

```bash
npx vitest run src/hooks/useLenis.test.js
```

Expected: 1 test PASS.

- [ ] **Step 5: Commit**

```bash
git add src/utils/gsap.js src/hooks/
git commit -m "feat: add GSAP plugin registration and Lenis smooth-scroll hook"
```

---

## Task 4: Analytics Utility

**Files:**
- Create: `src/utils/analytics.js`
- Create: `src/utils/analytics.test.js`

- [ ] **Step 1: Write failing test**

Create `src/utils/analytics.test.js`:

```js
import { trackEvent, events } from './analytics'

beforeEach(() => {
  window.plausible = vi.fn()
})

afterEach(() => {
  delete window.plausible
})

test('trackEvent calls window.plausible with name and props', () => {
  trackEvent('test_event', { foo: 'bar' })
  expect(window.plausible).toHaveBeenCalledWith('test_event', { props: { foo: 'bar' } })
})

test('trackEvent is silent when plausible not loaded', () => {
  delete window.plausible
  expect(() => trackEvent('test_event')).not.toThrow()
})

test('events.ctaMidClick fires cta_mid_click', () => {
  events.ctaMidClick()
  expect(window.plausible).toHaveBeenCalledWith('cta_mid_click', { props: {} })
})

test('events.ctaFinalClick fires cta_final_click', () => {
  events.ctaFinalClick()
  expect(window.plausible).toHaveBeenCalledWith('cta_final_click', { props: {} })
})

test('events.sectionView fires with section number', () => {
  events.sectionView(3)
  expect(window.plausible).toHaveBeenCalledWith('section_view_3', { props: {} })
})

test('events.offeringHover fires with offering name', () => {
  events.offeringHover('Office TI')
  expect(window.plausible).toHaveBeenCalledWith('offering_hover', { props: { name: 'Office TI' } })
})
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
npx vitest run src/utils/analytics.test.js
```

Expected: FAIL — `analytics.js` not found.

- [ ] **Step 3: Implement analytics utility**

Create `src/utils/analytics.js`:

```js
export function trackEvent(eventName, props = {}) {
  if (typeof window !== 'undefined' && typeof window.plausible === 'function') {
    window.plausible(eventName, { props })
  }
}

export const events = {
  ctaMidClick:    () => trackEvent('cta_mid_click'),
  ctaFinalClick:  () => trackEvent('cta_final_click'),
  galleryScroll:  () => trackEvent('gallery_scroll'),
  sectionView:    (n) => trackEvent(`section_view_${n}`),
  offeringHover:  (name) => trackEvent('offering_hover', { name }),
}
```

- [ ] **Step 4: Run tests to confirm they pass**

```bash
npx vitest run src/utils/analytics.test.js
```

Expected: 6 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/utils/analytics.js src/utils/analytics.test.js
git commit -m "feat: add Plausible analytics event wrappers with tests"
```

---

## Task 5: Data Files + Photo Swap Guide

**Files:**
- Create: `src/data/stats.js`
- Create: `src/data/offerings.js`
- Create: `src/data/testimonials.js`
- Create: `src/data/projects.js`
- Create: `src/data/chartData.js`
- Create: `assets/PHOTO-SWAP-GUIDE.md`

- [ ] **Step 1: Create stats data**

Create `src/data/stats.js`:

```js
// [PLACEHOLDER] Replace XX, YY, ZZ, WW with real numbers before launch
export const stats = [
  { id: 'projects',  display: 'XX+',    label: 'TI Projects Completed' },
  { id: 'years',     display: 'YY+',    label: 'Years in Practice'      },
  { id: 'leed',      display: 'ZZ',     label: 'LEED Certified Projects' },
  { id: 'sqft',      display: 'WW M+',  label: 'Sq Ft Transformed'      },
]
```

- [ ] **Step 2: Create offerings data**

Create `src/data/offerings.js`:

```js
export const offerings = [
  {
    id: 'office',
    label: 'Office TI',
    description: 'Corporate headquarters to startup floors. Fast-track permitting, seismic compliance, zero schedule impact.',
  },
  {
    id: 'media',
    label: 'Media & Entertainment',
    description: 'Studios, production facilities, broadcast infrastructure. Google, YouTube, Disney, Fox Studios.',
  },
  {
    id: 'retail',
    label: 'Retail & Mixed-Use',
    description: 'High-end retail, mall buildouts, mixed-use podiums. Apple Stores, Macy\'s, Westfield centres.',
  },
  {
    id: 'healthcare',
    label: 'Healthcare',
    description: 'Medical offices, clinical buildouts, laboratory TIs meeting strict operational requirements.',
  },
  {
    id: 'historic',
    label: 'Historic Renovation',
    description: 'Adaptive reuse and TI within historic structures. Herald Examiner, landmark-sensitive upgrades.',
  },
  {
    id: 'campus',
    label: 'Campus & Multi-Building',
    description: 'Large campus TI campaigns across multiple structures. Phased delivery, coordinated permitting.',
  },
]
```

- [ ] **Step 3: Create testimonials data**

Create `src/data/testimonials.js`:

```js
// [PLACEHOLDER] Replace with real client testimonials before launch
export const testimonials = [
  {
    id: 't1',
    quote: 'NYA kept our project on schedule through three scope changes. Never a delay from their side.',
    author: 'Principal Architect',
    firm: '[Architecture Firm — Placeholder]',
    project: '[Project Name — Placeholder]',
    serviceDetail: {
      heading: 'Fast-Track Structural Coordination',
      body: 'NYA provided concurrent design and permit documentation, maintaining two-week drawing turnaround through each scope revision. Structural calculations were submitted same-week with architectural CDs.',
    },
  },
  {
    id: 't2',
    quote: 'They understand the pace of our projects. I\'ve stopped worrying about the structural side.',
    author: 'Project Manager',
    firm: '[Owner Representative — Placeholder]',
    project: '[Project Name — Placeholder]',
    serviceDetail: {
      heading: 'Proactive Permit Coordination',
      body: 'NYA pre-coordinated with the building department and maintained a running log of structural comments, resolving all corrections before they reached the architect\'s desk.',
    },
  },
  {
    id: 't3',
    quote: 'Reliable, responsive, and they never create problems for us. That\'s exactly what we need.',
    author: 'Development Manager',
    firm: '[Property Owner — Placeholder]',
    project: '[Project Name — Placeholder]',
    serviceDetail: {
      heading: 'Predictable Cost + Schedule',
      body: 'Fixed-fee TI scopes with defined deliverable milestones. No change orders for information we should have asked for upfront. Owners know exactly what they\'re getting.',
    },
  },
]
```

- [ ] **Step 4: Create projects data**

Create `src/data/projects.js`:

```js
// [PLACEHOLDER] Replace src URLs with real project photography before launch
// See assets/PHOTO-SWAP-GUIDE.md for slot descriptions and recommended image specs

export const galleryProjects = [
  {
    id: 'p1',
    src: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80',
    alt: 'Modern corporate office interior',
    name: '[Project Name]',        // [PLACEHOLDER]
    location: 'Los Angeles, CA',   // [PLACEHOLDER]
    type: 'Office TI',
  },
  {
    id: 'p2',
    src: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&q=80',
    alt: 'Open plan office workspace',
    name: '[Project Name]',
    location: 'Century City, CA',
    type: 'Office TI',
  },
  {
    id: 'p3',
    src: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1200&q=80',
    alt: 'Contemporary building lobby',
    name: '[Project Name]',
    location: 'San Francisco, CA',
    type: 'Retail TI',
  },
  {
    id: 'p4',
    src: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200&q=80',
    alt: 'Glass curtain wall office tower',
    name: '[Project Name]',
    location: 'Irvine, CA',
    type: 'Office TI',
  },
  {
    id: 'p5',
    src: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=80',
    alt: 'Modern commercial building exterior',
    name: '[Project Name]',
    location: 'Burbank, CA',
    type: 'Media & Entertainment',
  },
  {
    id: 'p6',
    src: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?w=1200&q=80',
    alt: 'Studio production space interior',
    name: '[Project Name]',
    location: 'Culver City, CA',
    type: 'Media & Entertainment',
  },
  {
    id: 'p7',
    src: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1200&q=80',
    alt: 'High-end retail interior',
    name: '[Project Name]',
    location: 'Beverly Hills, CA',
    type: 'Retail TI',
  },
  {
    id: 'p8',
    src: 'https://images.unsplash.com/photo-1588854337236-6889d631faa8?w=1200&q=80',
    alt: 'Historic building renovation interior',
    name: '[Project Name]',
    location: 'Los Angeles, CA',
    type: 'Historic Renovation',
  },
]

// Masonry gallery (§10) — subset with different crops
export const masonryProjects = galleryProjects.slice(0, 4).map((p) => ({
  ...p,
  src: p.src.replace('w=1200', 'w=800'),
}))
```

- [ ] **Step 5: Create chart data**

Create `src/data/chartData.js`:

```js
// [PLACEHOLDER] Replace percentages and permitWeeks with real data before launch
export const projectTypeData = [
  { label: 'Office',              pct: 45 },  // [PLACEHOLDER]
  { label: 'Media & Entertainment', pct: 25 }, // [PLACEHOLDER]
  { label: 'Retail',              pct: 15 },  // [PLACEHOLDER]
  { label: 'Healthcare',          pct: 10 },  // [PLACEHOLDER]
  { label: 'Other',               pct: 5  },  // [PLACEHOLDER]
]

// [PLACEHOLDER] Replace with real average permit turnaround in weeks
export const permitWeeks = 'X'
```

- [ ] **Step 6: Write data shape tests**

Create `src/data/data.test.js`:

```js
import { stats } from './stats'
import { offerings } from './offerings'
import { testimonials } from './testimonials'
import { galleryProjects, masonryProjects } from './projects'
import { projectTypeData, permitWeeks } from './chartData'

test('stats has 4 entries with id, display, label', () => {
  expect(stats).toHaveLength(4)
  stats.forEach((s) => {
    expect(s).toHaveProperty('id')
    expect(s).toHaveProperty('display')
    expect(s).toHaveProperty('label')
  })
})

test('offerings has 6 entries with id, label, description', () => {
  expect(offerings).toHaveLength(6)
  offerings.forEach((o) => {
    expect(o).toHaveProperty('id')
    expect(o).toHaveProperty('label')
    expect(o).toHaveProperty('description')
  })
})

test('testimonials has 3 entries with quote, serviceDetail', () => {
  expect(testimonials).toHaveLength(3)
  testimonials.forEach((t) => {
    expect(t).toHaveProperty('quote')
    expect(t.serviceDetail).toHaveProperty('heading')
    expect(t.serviceDetail).toHaveProperty('body')
  })
})

test('galleryProjects has 8 entries with src, name, location', () => {
  expect(galleryProjects).toHaveLength(8)
  galleryProjects.forEach((p) => {
    expect(p).toHaveProperty('src')
    expect(p).toHaveProperty('name')
    expect(p).toHaveProperty('location')
  })
})

test('projectTypeData percentages sum to 100', () => {
  const sum = projectTypeData.reduce((acc, d) => acc + d.pct, 0)
  expect(sum).toBe(100)
})
```

- [ ] **Step 7: Run data tests**

```bash
npx vitest run src/data/data.test.js
```

Expected: 5 tests PASS.

- [ ] **Step 8: Create photo swap guide**

Create `assets/PHOTO-SWAP-GUIDE.md`:

```markdown
# Photo Swap Guide — NYA TI Microsite

Replace placeholder Unsplash images with real NYA project photography.
Edit `src/data/projects.js` — update the `src` and `alt` fields for each slot.

## Recommended Image Specs

- Format: JPG or WebP
- Width: minimum 1200px (gallery), 800px (masonry)
- Aspect ratio: 4:3 or 16:9 landscape for gallery slots
- File size: under 400KB per image (compress with squoosh.app or imageoptim)
- Place files in: `public/images/projects/`
- Reference in data as: `/images/projects/your-filename.jpg`

## Gallery Slots (§05 Horizontal Gallery — 8 images)

| ID  | Current Placeholder         | Recommended Real Photo          |
|-----|-----------------------------|---------------------------------|
| p1  | Modern office interior      | Office TI interior (floors, ceiling, glass partitions) |
| p2  | Open plan workspace         | Open-plan office TI (e.g. Playa Vista, Century Park) |
| p3  | Building lobby              | Lobby or common area TI         |
| p4  | Glass tower exterior        | Building exterior where NYA did TI |
| p5  | Commercial building exterior| Media/studio facility exterior  |
| p6  | Studio production space     | Studio or broadcast interior    |
| p7  | High-end retail interior    | Retail TI (Apple Store, North Face, Banana Republic) |
| p8  | Historic building interior  | Herald Examiner or similar historic TI |

## Hero Background (§01)

Edit `src/components/Hero/Hero.jsx` — replace the `backgroundImage` URL:

```jsx
// Line ~12 in Hero.jsx
const heroBg = '/images/hero-bg.jpg'
// Recommended: dramatic city skyline at dusk/dawn, or
// wide-angle structural interior showing scale
// Minimum: 2400px wide, 16:9 ratio
```

## Updating Alt Text

Always update the `alt` field to describe the actual project:
```js
alt: 'Google YouTube HQ lobby renovation, Playa Vista CA'
```
```

- [ ] **Step 9: Commit**

```bash
git add src/data/ assets/PHOTO-SWAP-GUIDE.md
git commit -m "feat: add content data files and photo swap guide"
```

---

## Task 6: Hero Section (§01)

**Files:**
- Create: `src/components/Hero/Hero.jsx`
- Create: `src/components/Hero/Hero.module.css`

- [ ] **Step 1: Write smoke test**

Create `src/components/Hero/Hero.test.jsx`:

```jsx
import { render } from '@testing-library/react'
import Hero from './Hero'

// Mock GSAP — no real DOM scroll in jsdom
vi.mock('../../utils/gsap', () => ({
  gsap: { from: vi.fn(), to: vi.fn(), context: vi.fn(() => ({ revert: vi.fn() })) },
  ScrollTrigger: { create: vi.fn() },
  SplitText: vi.fn().mockImplementation(() => ({ words: [], revert: vi.fn() })),
}))

test('Hero renders headline and scroll indicator', () => {
  const { getByText } = render(<Hero />)
  expect(getByText(/Tenant improvement/i)).toBeInTheDocument()
  expect(getByText(/scroll/i)).toBeInTheDocument()
})
```

- [ ] **Step 2: Run test to confirm fail**

```bash
npx vitest run src/components/Hero/Hero.test.jsx
```

Expected: FAIL — `Hero.jsx` not found.

- [ ] **Step 3: Write Hero CSS**

Create `src/components/Hero/Hero.module.css`:

```css
.section {
  position: relative;
  width: 100%;
  height: 100vh;
  min-height: 600px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  overflow: hidden;
  background-color: var(--bg-dark);
}

.bg {
  position: absolute;
  inset: -20% 0;
  background-image: url('https://images.unsplash.com/photo-1486325212027-8081e485255e?w=2400&q=80');
  /* [PLACEHOLDER] Replace with real hero background — see assets/PHOTO-SWAP-GUIDE.md */
  background-size: cover;
  background-position: center;
  opacity: 0.35;
  will-change: transform;
}

.content {
  position: relative;
  z-index: 2;
  padding: 0 var(--gutter) 80px;
  max-width: var(--container);
  width: 100%;
  margin: 0 auto;
}

.logo {
  position: absolute;
  top: 40px;
  left: var(--gutter);
  z-index: 2;
  height: 40px;
  opacity: 0.9;
}

.eyebrow {
  font-family: var(--font-sans);
  font-size: var(--text-label);
  font-weight: 400;
  letter-spacing: var(--tracking-label);
  text-transform: uppercase;
  color: var(--text-secondary);
  margin-bottom: 20px;
}

.headline {
  font-family: var(--font-serif);
  font-size: var(--text-hero);
  font-weight: 300;
  color: var(--bg);
  line-height: 1.1;
  letter-spacing: -0.02em;
  max-width: 900px;
}

.scrollIndicator {
  position: absolute;
  bottom: 32px;
  right: var(--gutter);
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-sans);
  font-size: var(--text-label);
  letter-spacing: var(--tracking-label);
  text-transform: uppercase;
  color: var(--text-secondary);
}

.scrollArrow {
  width: 24px;
  height: 24px;
  border-right: 1px solid var(--text-secondary);
  border-bottom: 1px solid var(--text-secondary);
  transform: rotate(45deg);
  margin-top: -8px;
}
```

- [ ] **Step 4: Write Hero component**

Create `src/components/Hero/Hero.jsx`:

```jsx
import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger, SplitText } from '../../utils/gsap'
import { events } from '../../utils/analytics'
import styles from './Hero.module.css'

export default function Hero() {
  const sectionRef   = useRef(null)
  const bgRef        = useRef(null)
  const headlineRef  = useRef(null)
  const eyebrowRef   = useRef(null)
  const scrollRef    = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Word-by-word headline reveal
      const split = new SplitText(headlineRef.current, { type: 'words' })
      gsap.from(split.words, {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.12,
        ease: 'power3.out',
        delay: 0.4,
      })

      // Eyebrow fade in after headline
      gsap.from(eyebrowRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.8,
        ease: 'power2.out',
        delay: 1.2,
      })

      // Scroll indicator fade in then pulse
      gsap.from(scrollRef.current, {
        opacity: 0,
        duration: 0.6,
        delay: 2,
        onComplete: () => {
          gsap.to(scrollRef.current, {
            opacity: 0.4,
            duration: 1,
            repeat: -1,
            yoyo: true,
            ease: 'power1.inOut',
          })
        },
      })

      // Parallax on background
      gsap.to(bgRef.current, {
        yPercent: 25,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })

      // Hide scroll indicator when user starts scrolling
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top+=100 top',
        onEnter: () => gsap.to(scrollRef.current, { opacity: 0, duration: 0.3 }),
      })
    }, sectionRef)

    // Track section view
    events.sectionView(1)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className={styles.section}>
      <div ref={bgRef} className={styles.bg} aria-hidden="true" />

      <img
        src="/nya-logomark.png"
        alt="Nabih Youssef & Associates"
        className={styles.logo}
      />

      <div className={styles.content}>
        <p ref={eyebrowRef} className={styles.eyebrow}>
          Tenant Improvement Practice &nbsp;·&nbsp; Nabih Youssef Associates
        </p>
        <h1 ref={headlineRef} className={styles.headline}>
          Tenant improvement.<br />Done right, every time.
        </h1>
      </div>

      <div ref={scrollRef} className={styles.scrollIndicator} aria-hidden="true">
        <span>scroll</span>
        <div className={styles.scrollArrow} />
      </div>
    </section>
  )
}
```

- [ ] **Step 5: Run smoke test**

```bash
npx vitest run src/components/Hero/Hero.test.jsx
```

Expected: 1 test PASS.

- [ ] **Step 6: Verify visually**

Wire Hero into App.jsx temporarily:

```jsx
// src/App.jsx (temporary)
import Hero from './components/Hero/Hero'
export default function App() {
  return <main><Hero /></main>
}
```

```bash
npm run dev
```

Open `http://localhost:5173` — full-screen dark hero with headline, background image, scroll indicator visible.

- [ ] **Step 7: Commit**

```bash
git add src/components/Hero/
git commit -m "feat: add Hero section with word reveal and parallax"
```

---

## Task 7: Intro Narrative Section (§02)

**Files:**
- Create: `src/components/IntroNarrative/IntroNarrative.jsx`
- Create: `src/components/IntroNarrative/IntroNarrative.module.css`

- [ ] **Step 1: Write smoke test**

Create `src/components/IntroNarrative/IntroNarrative.test.jsx`:

```jsx
import { render } from '@testing-library/react'
import IntroNarrative from './IntroNarrative'

test('IntroNarrative renders two columns of text', () => {
  const { container } = render(<IntroNarrative />)
  const cols = container.querySelectorAll('[data-col]')
  expect(cols.length).toBe(2)
})
```

- [ ] **Step 2: Write CSS**

Create `src/components/IntroNarrative/IntroNarrative.module.css`:

```css
.section {
  background: var(--bg);
  padding: var(--section-gap) var(--gutter);
}

.inner {
  max-width: var(--container);
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: start;
}

.eyebrow {
  font-family: var(--font-sans);
  font-size: var(--text-label);
  letter-spacing: var(--tracking-label);
  text-transform: uppercase;
  color: var(--text-secondary);
  margin-bottom: 32px;
  grid-column: 1 / -1;
}

.col {
  font-family: var(--font-serif);
  font-size: var(--text-lg);
  font-weight: 300;
  color: var(--text);
  line-height: 1.75;
}

.colSecondary {
  color: var(--text-secondary);
}

@media (max-width: 768px) {
  .inner {
    grid-template-columns: 1fr;
    gap: 32px;
  }
}
```

- [ ] **Step 3: Write component**

Create `src/components/IntroNarrative/IntroNarrative.jsx`:

```jsx
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { events } from '../../utils/analytics'
import styles from './IntroNarrative.module.css'

const fadeUp = {
  hidden:  { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.25, 0.1, 0.25, 1] } },
}

export default function IntroNarrative() {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  const handleView = () => events.sectionView(2)

  return (
    <section className={styles.section} ref={ref} onMouseEnter={handleView}>
      <div className={styles.inner}>
        <motion.p
          className={styles.eyebrow}
          variants={fadeUp}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          § 02 &nbsp;—&nbsp; Who We Are
        </motion.p>

        <motion.p
          data-col="1"
          className={styles.col}
          variants={fadeUp}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          transition={{ delay: 0.15 }}
        >
          Every occupied building tells a story of transformation. We are the structural engineers who make that transformation possible — working at the intersection of ambition, regulation, and the relentless pace of construction.
        </motion.p>

        <motion.p
          data-col="2"
          className={`${styles.col} ${styles.colSecondary}`}
          variants={fadeUp}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          transition={{ delay: 0.3 }}
        >
          {/* [PLACEHOLDER] Replace with NYA-approved copy that speaks directly to architects */}
          NYA's tenant improvement practice has delivered hundreds of projects across California — from Fortune 500 headquarters to landmark historic renovations. We don't add friction. We remove it.
        </motion.p>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Run test**

```bash
npx vitest run src/components/IntroNarrative/IntroNarrative.test.jsx
```

Expected: 1 test PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/IntroNarrative/
git commit -m "feat: add IntroNarrative section with staggered fade-up"
```

---

## Task 8: Trust Statement Section (§03)

**Files:**
- Create: `src/components/TrustStatement/TrustStatement.jsx`
- Create: `src/components/TrustStatement/TrustStatement.module.css`

- [ ] **Step 1: Write smoke test**

Create `src/components/TrustStatement/TrustStatement.test.jsx`:

```jsx
import { render } from '@testing-library/react'
import TrustStatement from './TrustStatement'

vi.mock('../../utils/gsap', () => ({
  gsap: { context: vi.fn(() => ({ revert: vi.fn() })), from: vi.fn() },
  ScrollTrigger: { create: vi.fn() },
  SplitText: vi.fn().mockImplementation(() => ({ words: [], revert: vi.fn() })),
}))

test('TrustStatement renders the pull quote', () => {
  const { getByText } = render(<TrustStatement />)
  expect(getByText(/We don't slow architects down/i)).toBeInTheDocument()
})
```

- [ ] **Step 2: Write CSS**

Create `src/components/TrustStatement/TrustStatement.module.css`:

```css
.section {
  background: var(--bg-dark);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--section-gap) var(--gutter);
}

.inner {
  max-width: 760px;
  text-align: center;
}

.eyebrow {
  font-family: var(--font-sans);
  font-size: var(--text-label);
  letter-spacing: var(--tracking-label);
  text-transform: uppercase;
  color: var(--text-secondary);
  margin-bottom: 48px;
}

.quote {
  font-family: var(--font-serif);
  font-size: clamp(28px, 4vw, 48px);
  font-weight: 300;
  color: var(--bg);
  line-height: 1.3;
  letter-spacing: -0.01em;
}

.rule {
  width: 60px;
  height: 1px;
  background: var(--text-secondary);
  margin: 48px auto 0;
}
```

- [ ] **Step 3: Write component**

Create `src/components/TrustStatement/TrustStatement.jsx`:

```jsx
import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '../../utils/gsap'
import { events } from '../../utils/analytics'
import styles from './TrustStatement.module.css'

export default function TrustStatement() {
  const sectionRef = useRef(null)
  const quoteRef   = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Pin section for dramatic pause
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: '+=80%',
        pin: true,
        pinSpacing: true,
      })

      // Fade in quote on scroll into view
      gsap.from(quoteRef.current, {
        opacity: 0,
        y: 40,
        duration: 1.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          toggleActions: 'play none none reverse',
        },
      })
    }, sectionRef)

    events.sectionView(3)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className={styles.inner}>
        <p className={styles.eyebrow}>§ 03 &nbsp;—&nbsp; Our Promise</p>
        <blockquote ref={quoteRef} className={styles.quote}>
          "We don't slow architects down.<br />We keep them moving."
        </blockquote>
        <div className={styles.rule} />
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Run test**

```bash
npx vitest run src/components/TrustStatement/TrustStatement.test.jsx
```

Expected: 1 test PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/TrustStatement/
git commit -m "feat: add TrustStatement pinned dark section"
```

---

## Task 9: Stats Strip Section (§04)

**Files:**
- Create: `src/components/StatsStrip/StatsStrip.jsx`
- Create: `src/components/StatsStrip/StatsStrip.module.css`

- [ ] **Step 1: Write smoke test**

Create `src/components/StatsStrip/StatsStrip.test.jsx`:

```jsx
import { render } from '@testing-library/react'
import StatsStrip from './StatsStrip'

vi.mock('../../utils/gsap', () => ({
  gsap: { context: vi.fn(() => ({ revert: vi.fn() })), from: vi.fn(), fromTo: vi.fn() },
  ScrollTrigger: { create: vi.fn() },
  SplitText: vi.fn(),
}))

test('StatsStrip renders all 4 stat labels', () => {
  const { getByText } = render(<StatsStrip />)
  expect(getByText(/TI Projects Completed/i)).toBeInTheDocument()
  expect(getByText(/Years in Practice/i)).toBeInTheDocument()
  expect(getByText(/LEED Certified/i)).toBeInTheDocument()
  expect(getByText(/Sq Ft Transformed/i)).toBeInTheDocument()
})
```

- [ ] **Step 2: Write CSS**

Create `src/components/StatsStrip/StatsStrip.module.css`:

```css
.section {
  background: var(--bg);
  padding: var(--section-gap) var(--gutter);
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
}

.inner {
  max-width: var(--container);
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 40px;
  text-align: center;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.value {
  font-family: var(--font-serif);
  font-size: var(--text-3xl);
  font-weight: 300;
  color: var(--text);
  line-height: 1;
  letter-spacing: -0.02em;
  min-height: 60px;
  display: flex;
  align-items: center;
}

.label {
  font-family: var(--font-sans);
  font-size: var(--text-label);
  letter-spacing: var(--tracking-label);
  text-transform: uppercase;
  color: var(--text-secondary);
  line-height: 1.4;
}

@media (max-width: 768px) {
  .inner {
    grid-template-columns: repeat(2, 1fr);
    gap: 48px;
  }
}
```

- [ ] **Step 3: Write component**

Create `src/components/StatsStrip/StatsStrip.jsx`:

```jsx
import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '../../utils/gsap'
import { stats } from '../../data/stats'
import { events } from '../../utils/analytics'
import styles from './StatsStrip.module.css'

export default function StatsStrip() {
  const sectionRef = useRef(null)
  const valueRefs  = useRef([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Stagger fade-up on section enter
      gsap.from(valueRefs.current, {
        opacity: 0,
        y: 30,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
      })
    }, sectionRef)

    events.sectionView(4)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className={styles.inner}>
        {stats.map((stat, i) => (
          <div key={stat.id} className={styles.stat}>
            <span
              ref={(el) => (valueRefs.current[i] = el)}
              className={styles.value}
            >
              {stat.display}
            </span>
            <span className={styles.label}>{stat.label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Run test**

```bash
npx vitest run src/components/StatsStrip/StatsStrip.test.jsx
```

Expected: 1 test PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/StatsStrip/
git commit -m "feat: add StatsStrip section with scroll-triggered values"
```

---

## Task 10: Image Gallery (§05 Horizontal + §10 Masonry)

**Files:**
- Create: `src/components/ImageGallery/ImageGallery.jsx`
- Create: `src/components/ImageGallery/ImageGallery.module.css`

- [ ] **Step 1: Write smoke tests**

Create `src/components/ImageGallery/ImageGallery.test.jsx`:

```jsx
import { render } from '@testing-library/react'
import ImageGallery from './ImageGallery'
import { galleryProjects, masonryProjects } from '../../data/projects'

vi.mock('../../utils/gsap', () => ({
  gsap: { context: vi.fn(() => ({ revert: vi.fn() })), to: vi.fn(), from: vi.fn() },
  ScrollTrigger: { create: vi.fn() },
  SplitText: vi.fn(),
}))

test('renders horizontal variant with all gallery images', () => {
  const { getAllByRole } = render(
    <ImageGallery variant="horizontal" projects={galleryProjects} sectionIndex={5} />
  )
  expect(getAllByRole('img').length).toBe(galleryProjects.length)
})

test('renders masonry variant with masonry images', () => {
  const { getAllByRole } = render(
    <ImageGallery variant="masonry" projects={masonryProjects} sectionIndex={10} />
  )
  expect(getAllByRole('img').length).toBe(masonryProjects.length)
})
```

- [ ] **Step 2: Write CSS**

Create `src/components/ImageGallery/ImageGallery.module.css`:

```css
/* ── Horizontal variant ── */
.horizontal {
  position: relative;
  overflow: hidden;
  background: var(--bg-dark);
  height: 100vh;
}

.horizontalTrack {
  display: flex;
  height: 100%;
  will-change: transform;
}

.horizontalSlide {
  position: relative;
  flex-shrink: 0;
  width: 70vw;
  height: 100%;
  overflow: hidden;
}

.horizontalSlide img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.85;
  transition: opacity 0.3s;
}

.horizontalSlide:hover img {
  opacity: 1;
}

.slideCaption {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 24px 32px;
  background: linear-gradient(transparent, rgba(26,23,20,0.85));
  opacity: 0;
  transition: opacity 0.3s ease;
}

.horizontalSlide:hover .slideCaption {
  opacity: 1;
}

.captionName {
  font-family: var(--font-sans);
  font-size: var(--text-xs);
  letter-spacing: var(--tracking-label);
  text-transform: uppercase;
  color: var(--bg);
  display: block;
  margin-bottom: 4px;
}

.captionType {
  font-family: var(--font-sans);
  font-size: var(--text-label);
  letter-spacing: var(--tracking-wide);
  color: var(--text-secondary);
}

.horizontalEyebrow {
  position: absolute;
  top: 40px;
  left: var(--gutter);
  z-index: 4;
  font-family: var(--font-sans);
  font-size: var(--text-label);
  letter-spacing: var(--tracking-label);
  text-transform: uppercase;
  color: var(--text-secondary);
}

/* ── Masonry variant ── */
.masonry {
  background: var(--bg);
  padding: var(--section-gap) var(--gutter);
}

.masonryInner {
  max-width: var(--container);
  margin: 0 auto;
}

.masonryEyebrow {
  font-family: var(--font-sans);
  font-size: var(--text-label);
  letter-spacing: var(--tracking-label);
  text-transform: uppercase;
  color: var(--text-secondary);
  margin-bottom: 32px;
}

.masonryGrid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  grid-template-rows: auto auto;
  gap: 8px;
}

.masonryItem {
  overflow: hidden;
  border-radius: 2px;
}

.masonryItem:first-child {
  grid-row: 1 / 3;
}

.masonryItem img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
  min-height: 200px;
}

.masonryItem:hover img {
  transform: scale(1.03);
}

@media (max-width: 768px) {
  .masonryGrid {
    grid-template-columns: 1fr 1fr;
  }
  .masonryItem:first-child {
    grid-column: 1 / -1;
    grid-row: auto;
  }
  .horizontalSlide {
    width: 88vw;
  }
}
```

- [ ] **Step 3: Write component**

Create `src/components/ImageGallery/ImageGallery.jsx`:

```jsx
import { useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { gsap, ScrollTrigger } from '../../utils/gsap'
import { events } from '../../utils/analytics'
import styles from './ImageGallery.module.css'

export default function ImageGallery({ variant = 'horizontal', projects, sectionIndex }) {
  const containerRef = useRef(null)
  const trackRef     = useRef(null)
  const hasTracked   = useRef(false)

  // ── Horizontal: GSAP scroll-pinned horizontal track ──
  useEffect(() => {
    if (variant !== 'horizontal') return

    const ctx = gsap.context(() => {
      const totalWidth =
        trackRef.current.scrollWidth - containerRef.current.offsetWidth

      gsap.to(trackRef.current, {
        x: -totalWidth,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: `+=${totalWidth}`,
          pin: true,
          scrub: 1,
          onUpdate: (self) => {
            if (!hasTracked.current && self.progress > 0.5) {
              events.galleryScroll()
              hasTracked.current = true
            }
          },
        },
      })
    }, containerRef)

    events.sectionView(sectionIndex)
    return () => ctx.revert()
  }, [variant, sectionIndex])

  if (variant === 'horizontal') {
    return (
      <section ref={containerRef} className={styles.horizontal}>
        <p className={styles.horizontalEyebrow}>
          § {String(sectionIndex).padStart(2, '0')} &nbsp;—&nbsp; Selected Projects
        </p>
        <div ref={trackRef} className={styles.horizontalTrack}>
          {projects.map((project) => (
            <div key={project.id} className={styles.horizontalSlide}>
              <img src={project.src} alt={project.alt} loading="lazy" />
              <div className={styles.slideCaption}>
                <span className={styles.captionName}>{project.name}</span>
                <span className={styles.captionType}>
                  {project.location} &nbsp;·&nbsp; {project.type}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    )
  }

  // ── Masonry variant ──
  return (
    <MasonryGallery
      projects={projects}
      sectionIndex={sectionIndex}
    />
  )
}

function MasonryGallery({ projects, sectionIndex }) {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  useEffect(() => {
    if (inView) events.sectionView(sectionIndex)
  }, [inView, sectionIndex])

  return (
    <section ref={ref} className={styles.masonry}>
      <div className={styles.masonryInner}>
        <p className={styles.masonryEyebrow}>
          § {String(sectionIndex).padStart(2, '0')} &nbsp;—&nbsp; Our Work
        </p>
        <div className={styles.masonryGrid}>
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              className={styles.masonryItem}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <img src={project.src} alt={project.alt} loading="lazy" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Run tests**

```bash
npx vitest run src/components/ImageGallery/ImageGallery.test.jsx
```

Expected: 2 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/ImageGallery/
git commit -m "feat: add ImageGallery with horizontal scroll and masonry variants"
```

---

## Task 11: Mid CTA (§06)

**Files:**
- Create: `src/components/MidCTA/MidCTA.jsx`
- Create: `src/components/MidCTA/MidCTA.module.css`

- [ ] **Step 1: Write smoke test**

Create `src/components/MidCTA/MidCTA.test.jsx`:

```jsx
import { render } from '@testing-library/react'
import MidCTA from './MidCTA'

test('MidCTA renders email link', () => {
  const { getByRole } = render(<MidCTA />)
  const link = getByRole('link')
  expect(link).toHaveAttribute('href', 'mailto:info@nyase.com')
})
```

- [ ] **Step 2: Write CSS**

Create `src/components/MidCTA/MidCTA.module.css`:

```css
.section {
  background: var(--bg);
  padding: 80px var(--gutter);
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
}

.inner {
  max-width: var(--container);
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 40px;
  flex-wrap: wrap;
}

.text {
  font-family: var(--font-serif);
  font-size: var(--text-xl);
  font-weight: 300;
  color: var(--text);
  letter-spacing: -0.01em;
}

.button {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 14px 28px;
  background: var(--bg-dark);
  color: var(--bg);
  font-family: var(--font-sans);
  font-size: var(--text-label);
  letter-spacing: var(--tracking-label);
  text-transform: uppercase;
  border: none;
  cursor: pointer;
  text-decoration: none;
  transition: opacity 0.2s;
}

.button:hover {
  opacity: 0.8;
}
```

- [ ] **Step 3: Write component**

Create `src/components/MidCTA/MidCTA.jsx`:

```jsx
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { events } from '../../utils/analytics'
import styles from './MidCTA.module.css'

export default function MidCTA() {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section ref={ref} className={styles.section}>
      <div className={styles.inner}>
        <motion.p
          className={styles.text}
          initial={{ opacity: 0, x: -30 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        >
          Working on a TI project? Let's talk.
        </motion.p>

        <motion.a
          href="mailto:info@nyase.com"
          className={styles.button}
          initial={{ opacity: 0, x: 30 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
          onClick={events.ctaMidClick}
        >
          info@nyase.com &nbsp;→
        </motion.a>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Run test**

```bash
npx vitest run src/components/MidCTA/MidCTA.test.jsx
```

Expected: 1 test PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/MidCTA/
git commit -m "feat: add MidCTA section with email link"
```

---

## Task 12: Charts Section (§07)

**Files:**
- Create: `src/components/Charts/Charts.jsx`
- Create: `src/components/Charts/Charts.module.css`

- [ ] **Step 1: Write smoke test**

Create `src/components/Charts/Charts.test.jsx`:

```jsx
import { render } from '@testing-library/react'
import Charts from './Charts'

vi.mock('../../utils/gsap', () => ({
  gsap: { context: vi.fn(() => ({ revert: vi.fn() })), fromTo: vi.fn() },
  ScrollTrigger: { create: vi.fn() },
  SplitText: vi.fn(),
}))

test('Charts renders project type labels', () => {
  const { getByText } = render(<Charts />)
  expect(getByText(/Office/i)).toBeInTheDocument()
  expect(getByText(/Media/i)).toBeInTheDocument()
})

test('Charts renders permit turnaround stat', () => {
  const { getByText } = render(<Charts />)
  expect(getByText(/permit turnaround/i)).toBeInTheDocument()
})
```

- [ ] **Step 2: Write CSS**

Create `src/components/Charts/Charts.module.css`:

```css
.section {
  background: var(--bg);
  padding: var(--section-gap) var(--gutter);
}

.inner {
  max-width: var(--container);
  margin: 0 auto;
}

.header {
  margin-bottom: 64px;
}

.eyebrow {
  font-family: var(--font-sans);
  font-size: var(--text-label);
  letter-spacing: var(--tracking-label);
  text-transform: uppercase;
  color: var(--text-secondary);
  margin-bottom: 16px;
}

.title {
  font-family: var(--font-serif);
  font-size: var(--text-2xl);
  font-weight: 300;
  color: var(--text);
  letter-spacing: -0.01em;
}

.grid {
  display: grid;
  grid-template-columns: 3fr 2fr;
  gap: 80px;
  align-items: center;
}

/* Bar chart */
.barChart {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.barRow {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.barLabel {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

.barName {
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  color: var(--text);
}

.barPct {
  font-family: var(--font-sans);
  font-size: var(--text-label);
  letter-spacing: var(--tracking-label);
  color: var(--text-secondary);
}

.barTrack {
  width: 100%;
  height: 4px;
  background: var(--border);
  border-radius: 2px;
  overflow: hidden;
}

.barFill {
  height: 100%;
  background: var(--text);
  border-radius: 2px;
  transform-origin: left;
  will-change: width;
}

/* Permit stat */
.permitStat {
  text-align: center;
}

.permitValue {
  font-family: var(--font-serif);
  font-size: clamp(56px, 8vw, 96px);
  font-weight: 300;
  color: var(--text);
  line-height: 1;
  letter-spacing: -0.03em;
  margin-bottom: 12px;
}

.permitUnit {
  font-family: var(--font-sans);
  font-size: var(--text-label);
  letter-spacing: var(--tracking-label);
  text-transform: uppercase;
  color: var(--text-secondary);
}

@media (max-width: 768px) {
  .grid {
    grid-template-columns: 1fr;
    gap: 48px;
  }
}
```

- [ ] **Step 3: Write component**

Create `src/components/Charts/Charts.jsx`:

```jsx
import { useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { gsap } from '../../utils/gsap'
import { projectTypeData, permitWeeks } from '../../data/chartData'
import { events } from '../../utils/analytics'
import styles from './Charts.module.css'

export default function Charts() {
  const sectionRef  = useRef(null)
  const barRefs     = useRef([])
  const inView      = useInView(sectionRef, { once: true, margin: '-100px' })

  useEffect(() => {
    if (!inView) return

    const ctx = gsap.context(() => {
      barRefs.current.forEach((bar, i) => {
        const targetWidth = projectTypeData[i].pct + '%'
        gsap.fromTo(
          bar,
          { width: '0%' },
          {
            width: targetWidth,
            duration: 1.2,
            delay: i * 0.12,
            ease: 'power2.out',
          }
        )
      })
    }, sectionRef)

    events.sectionView(7)
    return () => ctx.revert()
  }, [inView])

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <p className={styles.eyebrow}>§ 07 &nbsp;—&nbsp; The Numbers</p>
          <h2 className={styles.title}>
            A track record that speaks for itself.
          </h2>
        </div>

        <div className={styles.grid}>
          {/* Bar chart */}
          <div className={styles.barChart}>
            {projectTypeData.map((item, i) => (
              <div key={item.label} className={styles.barRow}>
                <div className={styles.barLabel}>
                  <span className={styles.barName}>{item.label}</span>
                  <span className={styles.barPct}>{item.pct}%</span>
                  {/* [PLACEHOLDER] */}
                </div>
                <div className={styles.barTrack}>
                  <div
                    ref={(el) => (barRefs.current[i] = el)}
                    className={styles.barFill}
                    style={{ width: 0 }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Permit turnaround */}
          <motion.div
            className={styles.permitStat}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className={styles.permitValue}>
              ~{permitWeeks}
              {/* [PLACEHOLDER] */}
            </div>
            <div className={styles.permitUnit}>
              weeks avg<br />permit turnaround
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Run tests**

```bash
npx vitest run src/components/Charts/Charts.test.jsx
```

Expected: 2 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/Charts/
git commit -m "feat: add Charts section with animated bars and permit stat"
```

---

## Task 13: Offerings Section (§08)

**Files:**
- Create: `src/components/Offerings/Offerings.jsx`
- Create: `src/components/Offerings/Offerings.module.css`

- [ ] **Step 1: Write smoke test**

Create `src/components/Offerings/Offerings.test.jsx`:

```jsx
import { render } from '@testing-library/react'
import Offerings from './Offerings'

test('Offerings renders all 6 service cards', () => {
  const { getAllByRole } = render(<Offerings />)
  // Each offering has an article role via motion.article
  expect(getAllByRole('article').length).toBe(6)
})
```

- [ ] **Step 2: Write CSS**

Create `src/components/Offerings/Offerings.module.css`:

```css
.section {
  background: var(--bg-dark);
  padding: var(--section-gap) var(--gutter);
}

.inner {
  max-width: var(--container);
  margin: 0 auto;
}

.header {
  margin-bottom: 64px;
}

.eyebrow {
  font-family: var(--font-sans);
  font-size: var(--text-label);
  letter-spacing: var(--tracking-label);
  text-transform: uppercase;
  color: var(--text-secondary);
  margin-bottom: 16px;
}

.title {
  font-family: var(--font-serif);
  font-size: var(--text-2xl);
  font-weight: 300;
  color: var(--bg);
  letter-spacing: -0.01em;
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1px;
  border: 1px solid #2a2724;
}

.card {
  padding: 40px 32px;
  border: 1px solid #2a2724;
  cursor: default;
  transition: background 0.3s;
}

.card:hover {
  background: #221f1c;
}

.cardLabel {
  font-family: var(--font-sans);
  font-size: var(--text-label);
  letter-spacing: var(--tracking-label);
  text-transform: uppercase;
  color: var(--text-secondary);
  margin-bottom: 16px;
  display: block;
}

.cardDesc {
  font-family: var(--font-serif);
  font-size: var(--text-base);
  font-weight: 300;
  color: var(--bg);
  line-height: 1.65;
  opacity: 0.8;
}

@media (max-width: 1024px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Step 3: Write component**

Create `src/components/Offerings/Offerings.jsx`:

```jsx
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { offerings } from '../../data/offerings'
import { events } from '../../utils/analytics'
import styles from './Offerings.module.css'

export default function Offerings() {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section ref={ref} className={styles.section}>
      <div className={styles.inner}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <p className={styles.eyebrow}>§ 08 &nbsp;—&nbsp; Selected Offerings</p>
          <h2 className={styles.title}>What we deliver.</h2>
        </motion.div>

        <div className={styles.grid}>
          {offerings.map((offering, i) => (
            <motion.article
              key={offering.id}
              className={styles.card}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 + i * 0.08 }}
              onHoverStart={() => events.offeringHover(offering.label)}
            >
              <span className={styles.cardLabel}>{offering.label}</span>
              <p className={styles.cardDesc}>{offering.description}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Run test**

```bash
npx vitest run src/components/Offerings/Offerings.test.jsx
```

Expected: 1 test PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/Offerings/
git commit -m "feat: add Offerings dark grid section with hover analytics"
```

---

## Task 14: Testimonials Section (§09)

**Files:**
- Create: `src/components/Testimonials/Testimonials.jsx`
- Create: `src/components/Testimonials/Testimonials.module.css`

- [ ] **Step 1: Write smoke test**

Create `src/components/Testimonials/Testimonials.test.jsx`:

```jsx
import { render, fireEvent } from '@testing-library/react'
import Testimonials from './Testimonials'

test('Testimonials renders first quote', () => {
  const { getByText } = render(<Testimonials />)
  expect(getByText(/NYA kept our project on schedule/i)).toBeInTheDocument()
})

test('Testimonials advances to next quote on arrow click', () => {
  const { getByLabelText, getByText } = render(<Testimonials />)
  fireEvent.click(getByLabelText('Next testimonial'))
  expect(getByText(/They understand the pace/i)).toBeInTheDocument()
})
```

- [ ] **Step 2: Write CSS**

Create `src/components/Testimonials/Testimonials.module.css`:

```css
.section {
  background: var(--bg);
  padding: var(--section-gap) var(--gutter);
}

.inner {
  max-width: var(--container);
  margin: 0 auto;
}

.eyebrow {
  font-family: var(--font-sans);
  font-size: var(--text-label);
  letter-spacing: var(--tracking-label);
  text-transform: uppercase;
  color: var(--text-secondary);
  margin-bottom: 64px;
}

.split {
  display: grid;
  grid-template-columns: 3fr 2fr;
  gap: 80px;
  align-items: start;
  min-height: 260px;
}

.quoteCol {
  border-left: 3px solid var(--text);
  padding-left: 32px;
}

.quote {
  font-family: var(--font-serif);
  font-size: var(--text-xl);
  font-weight: 300;
  color: var(--text);
  line-height: 1.6;
  font-style: italic;
  margin-bottom: 24px;
}

.attribution {
  font-family: var(--font-sans);
  font-size: var(--text-xs);
  letter-spacing: var(--tracking-label);
  text-transform: uppercase;
  color: var(--text-secondary);
}

.serviceCol {
  padding-top: 8px;
}

.serviceHeading {
  font-family: var(--font-sans);
  font-size: var(--text-label);
  letter-spacing: var(--tracking-label);
  text-transform: uppercase;
  color: var(--text-secondary);
  margin-bottom: 16px;
}

.serviceBody {
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  font-weight: 300;
  color: var(--text);
  line-height: 1.7;
}

.nav {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-top: 48px;
}

.navButton {
  width: 40px;
  height: 40px;
  border: 1px solid var(--border);
  background: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color 0.2s, background 0.2s;
}

.navButton:hover {
  border-color: var(--text);
  background: var(--text);
  color: var(--bg);
}

.navDots {
  display: flex;
  gap: 8px;
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--border);
  transition: background 0.2s;
}

.dotActive {
  background: var(--text);
}

@media (max-width: 768px) {
  .split {
    grid-template-columns: 1fr;
    gap: 40px;
  }
}
```

- [ ] **Step 3: Write component**

Create `src/components/Testimonials/Testimonials.jsx`:

```jsx
import { useRef, useState } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { testimonials } from '../../data/testimonials'
import { events } from '../../utils/analytics'
import styles from './Testimonials.module.css'

export default function Testimonials() {
  const [index, setIndex] = useState(0)
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  const prev = () => setIndex((i) => (i - 1 + testimonials.length) % testimonials.length)
  const next = () => setIndex((i) => (i + 1) % testimonials.length)

  const current = testimonials[index]

  return (
    <section ref={ref} className={styles.section}>
      <div className={styles.inner}>
        <motion.p
          className={styles.eyebrow}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          onAnimationComplete={() => events.sectionView(9)}
        >
          § 09 &nbsp;—&nbsp; Client Voice
        </motion.p>

        <div className={styles.split}>
          <AnimatePresence mode="wait">
            <motion.div
              key={`quote-${index}`}
              className={styles.quoteCol}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <blockquote className={styles.quote}>"{current.quote}"</blockquote>
              <p className={styles.attribution}>
                {current.author} &nbsp;·&nbsp; {current.firm}
              </p>
            </motion.div>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.div
              key={`service-${index}`}
              className={styles.serviceCol}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <p className={styles.serviceHeading}>{current.serviceDetail.heading}</p>
              <p className={styles.serviceBody}>{current.serviceDetail.body}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className={styles.nav}>
          <button
            className={styles.navButton}
            onClick={prev}
            aria-label="Previous testimonial"
          >
            ←
          </button>
          <button
            className={styles.navButton}
            onClick={next}
            aria-label="Next testimonial"
          >
            →
          </button>
          <div className={styles.navDots}>
            {testimonials.map((_, i) => (
              <div
                key={i}
                className={`${styles.dot} ${i === index ? styles.dotActive : ''}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Run tests**

```bash
npx vitest run src/components/Testimonials/Testimonials.test.jsx
```

Expected: 2 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/Testimonials/
git commit -m "feat: add Testimonials section with AnimatePresence slide transitions"
```

---

## Task 15: Final CTA + Footer (§11)

**Files:**
- Create: `src/components/FinalCTA/FinalCTA.jsx`
- Create: `src/components/FinalCTA/FinalCTA.module.css`

- [ ] **Step 1: Write smoke test**

Create `src/components/FinalCTA/FinalCTA.test.jsx`:

```jsx
import { render } from '@testing-library/react'
import FinalCTA from './FinalCTA'

test('FinalCTA renders headline and email link', () => {
  const { getByText, getByRole } = render(<FinalCTA />)
  expect(getByText(/Ready to move fast/i)).toBeInTheDocument()
  expect(getByRole('link', { name: /get in touch/i })).toHaveAttribute(
    'href',
    'mailto:info@nyase.com'
  )
})
```

- [ ] **Step 2: Write CSS**

Create `src/components/FinalCTA/FinalCTA.module.css`:

```css
.section {
  background: var(--bg-dark);
  min-height: 80vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--section-gap) var(--gutter);
  text-align: center;
}

.eyebrow {
  font-family: var(--font-sans);
  font-size: var(--text-label);
  letter-spacing: var(--tracking-label);
  text-transform: uppercase;
  color: var(--text-secondary);
  margin-bottom: 32px;
}

.headline {
  font-family: var(--font-serif);
  font-size: clamp(32px, 5vw, 56px);
  font-weight: 300;
  color: var(--bg);
  line-height: 1.2;
  letter-spacing: -0.01em;
  margin-bottom: 48px;
  max-width: 600px;
}

.button {
  display: inline-block;
  padding: 16px 40px;
  border: 1px solid var(--bg);
  color: var(--bg);
  font-family: var(--font-sans);
  font-size: var(--text-label);
  letter-spacing: var(--tracking-label);
  text-transform: uppercase;
  text-decoration: none;
  transition: background 0.2s, color 0.2s;
  margin-bottom: 64px;
}

.button:hover {
  background: var(--bg);
  color: var(--bg-dark);
}

.logo {
  height: 32px;
  opacity: 0.4;
  margin-bottom: 24px;
}

.footer {
  font-family: var(--font-sans);
  font-size: var(--text-label);
  letter-spacing: var(--tracking-wide);
  color: var(--text-secondary);
  opacity: 0.6;
}

.footerLink {
  color: inherit;
  text-decoration: underline;
  text-underline-offset: 3px;
}
```

- [ ] **Step 3: Write component**

Create `src/components/FinalCTA/FinalCTA.jsx`:

```jsx
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { events } from '../../utils/analytics'
import styles from './FinalCTA.module.css'

export default function FinalCTA() {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section ref={ref} className={styles.section}>
      <motion.p
        className={styles.eyebrow}
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.6 }}
        onAnimationComplete={() => events.sectionView(11)}
      >
        § 11 &nbsp;—&nbsp; Let's Work Together
      </motion.p>

      <motion.h2
        className={styles.headline}
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.9, delay: 0.1 }}
      >
        Ready to move fast<br />on your next TI?
      </motion.h2>

      <motion.a
        href="mailto:info@nyase.com"
        className={styles.button}
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, delay: 0.3 }}
        onClick={events.ctaFinalClick}
      >
        Get in touch →
      </motion.a>

      <motion.img
        src="/nya-logomark.png"
        alt=""
        className={styles.logo}
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 0.4 } : {}}
        transition={{ duration: 0.8, delay: 0.5 }}
      />

      <motion.footer
        className={styles.footer}
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 0.6 } : {}}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        © {new Date().getFullYear()} Nabih Youssef &amp; Associates &nbsp;·&nbsp;
        <a href="https://www.nyase.com" className={styles.footerLink}>nyase.com</a>
      </motion.footer>
    </section>
  )
}
```

- [ ] **Step 4: Run test**

```bash
npx vitest run src/components/FinalCTA/FinalCTA.test.jsx
```

Expected: 2 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/FinalCTA/
git commit -m "feat: add FinalCTA closing section with footer"
```

---

## Task 16: App Composition + Lenis Init

**Files:**
- Modify: `src/App.jsx`

- [ ] **Step 1: Write App composition**

Replace `src/App.jsx` with:

```jsx
import { useLenis } from './hooks/useLenis'

import Hero            from './components/Hero/Hero'
import IntroNarrative  from './components/IntroNarrative/IntroNarrative'
import TrustStatement  from './components/TrustStatement/TrustStatement'
import StatsStrip      from './components/StatsStrip/StatsStrip'
import ImageGallery    from './components/ImageGallery/ImageGallery'
import MidCTA          from './components/MidCTA/MidCTA'
import Charts          from './components/Charts/Charts'
import Offerings       from './components/Offerings/Offerings'
import Testimonials    from './components/Testimonials/Testimonials'
import FinalCTA        from './components/FinalCTA/FinalCTA'

import { galleryProjects, masonryProjects } from './data/projects'

export default function App() {
  useLenis()

  return (
    <main>
      <Hero />
      <IntroNarrative />
      <TrustStatement />
      <StatsStrip />
      <ImageGallery
        variant="horizontal"
        projects={galleryProjects}
        sectionIndex={5}
      />
      <MidCTA />
      <Charts />
      <Offerings />
      <Testimonials />
      <ImageGallery
        variant="masonry"
        projects={masonryProjects}
        sectionIndex={10}
      />
      <FinalCTA />
    </main>
  )
}
```

- [ ] **Step 2: Write App smoke test**

Create `src/App.test.jsx`:

```jsx
import { render } from '@testing-library/react'
import App from './App'

vi.mock('./hooks/useLenis', () => ({ useLenis: vi.fn() }))

vi.mock('./utils/gsap', () => ({
  gsap: {
    context: vi.fn(() => ({ revert: vi.fn() })),
    from: vi.fn(),
    fromTo: vi.fn(),
    to: vi.fn(),
    ticker: { add: vi.fn(), remove: vi.fn(), lagSmoothing: vi.fn() },
  },
  ScrollTrigger: { create: vi.fn(), update: vi.fn() },
  SplitText: vi.fn().mockImplementation(() => ({ words: [], revert: vi.fn() })),
}))

test('App renders without crashing', () => {
  expect(() => render(<App />)).not.toThrow()
})
```

- [ ] **Step 3: Run App test**

```bash
npx vitest run src/App.test.jsx
```

Expected: 1 test PASS.

- [ ] **Step 4: Run all tests**

```bash
npx vitest run
```

Expected: All tests PASS.

- [ ] **Step 5: Smoke-test full page in browser**

```bash
npm run dev
```

Open `http://localhost:5173`. Scroll through the full page verifying:
- Hero: dark full-screen, headline visible, background image loads
- IntroNarrative: light background, two columns appear
- TrustStatement: dark pinned section, quote visible
- StatsStrip: four stat values visible
- ImageGallery §05: horizontal scroll works
- MidCTA: email button visible and clickable
- Charts: bar labels visible
- Offerings: 6 dark cards visible
- Testimonials: quote visible, arrows advance to next
- ImageGallery §10: masonry grid visible
- FinalCTA: dark closing with "Get in touch" button

- [ ] **Step 6: Commit**

```bash
git add src/App.jsx src/App.test.jsx
git commit -m "feat: compose full page with all 11 sections and Lenis init"
```

---

## Task 17: Production Build Verification

**Files:** none new

- [ ] **Step 1: Run production build**

```bash
npm run build
```

Expected: `dist/` folder created, no errors.

- [ ] **Step 2: Preview production build**

```bash
npm run preview
```

Open `http://localhost:4173`. Scroll full page — same behavior as dev.

- [ ] **Step 3: Check bundle size**

```bash
npx vite-bundle-visualizer 2>/dev/null || true
```

If GSAP + Framer Motion total > 500KB gzipped, note it — but no action required for launch.

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "feat: production build verified — NYA TI microsite complete"
```

---

## Pre-Launch Checklist

Before sending `ti.nyase.com` link to prospects, complete these replacements using the data files and photo guide:

- [ ] Replace `XX+`, `YY+`, `ZZ`, `WW M+` in `src/data/stats.js`
- [ ] Replace `X` permit weeks in `src/data/chartData.js`
- [ ] Replace chart percentages in `src/data/chartData.js` (must sum to 100)
- [ ] Add real testimonials in `src/data/testimonials.js` (remove `[PLACEHOLDER]` tags)
- [ ] Replace stock photos per `assets/PHOTO-SWAP-GUIDE.md`
- [ ] Replace hero background per `assets/PHOTO-SWAP-GUIDE.md`
- [ ] Update project names + locations in `src/data/projects.js`
- [ ] Create Plausible account at plausible.io, add `ti.nyase.com` as site
- [ ] Confirm `data-domain="ti.nyase.com"` in `index.html` matches actual domain
- [ ] Update IntroNarrative copy with NYA-approved text (marked `[PLACEHOLDER]` in component)
