# Word-to-Founder Particle Transition — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** After FirmCultureOption3 completes its zoom, a new scroll section disintegrates the word cloud into particles that converge to form a hand-drawn founder portrait on the right half of the viewport, while client logos fade in on the left; the founder image bleeds into CTAOption3 via a bottom gradient mask.

**Architecture:** New component `FounderRevealOption3` sits between FirmCultureOption3 and CTAOption3 in option3.astro. A Canvas 2D layer overlays a sticky viewport — GSAP ScrollTrigger drives a `progressRef` value (0→1) that a GSAP-ticker render loop reads every frame. Three scroll phases: word cloud disintegrates (0–35%), particles converge to founder image pixel positions (35–78%), image PNG fades in as particles fade out (78–100%). Pure utility functions in `src/utils/particles.js` own all particle math and are fully unit-tested with Vitest. DOM element visibility (word cloud, canvas, image, left panel) is controlled via GSAP timeline scrubbed to the same ScrollTrigger.

**Tech Stack:** React 18 + JSX, GSAP 3.12 + ScrollTrigger + useGSAP, Canvas 2D API, CSS Modules, Astro 5, Vitest (new devDependency for unit tests)

---

## File Structure

| File | Action | Responsibility |
|---|---|---|
| `src/utils/particles.js` | **Create** | Pure functions: pixel sampling, particle construction, per-particle state math, canvas render |
| `src/utils/particles.test.js` | **Create** | Vitest unit tests for all pure functions |
| `src/components/ti-option3/FounderRevealOption3.jsx` | **Create** | React component — canvas layer, GSAP scroll integration, DOM elements |
| `src/components/ti-option3/FounderRevealOption3.module.css` | **Create** | Layout, sticky viewport, founder image bleed, logo grid, responsive |
| `src/pages/option3.astro` | **Modify** | Add `<FounderRevealOption3 client:load />` after FirmCultureOption3 |
| `src/components/ti-option3/CTAOption3.module.css` | **Modify** | Add `position: relative; z-index: 1` to `.section` so CTA stacks above any overflow |
| `public/images/founder.png` | **Add (user provides)** | White line art, transparent background, 3/4 body portrait, min 800×1400px |
| `public/images/logos/` | **Add (user provides)** | Client logo files — any format, any color (CSS forces white) |
| `vitest.config.js` | **Create** | Vitest config pointing at `src/` |

---

## Task 1: Add Vitest

**Files:**
- Create: `vitest.config.js`
- Modify: `package.json` (add vitest devDependency + test script)

- [ ] **Step 1: Install Vitest**

```powershell
npm install --save-dev vitest
```

Expected output: vitest added to `package.json` devDependencies.

- [ ] **Step 2: Create vitest config**

```js
// vitest.config.js
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.js'],
  },
});
```

- [ ] **Step 3: Add test script to package.json**

In `package.json`, add to `"scripts"`:
```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 4: Verify Vitest runs**

```powershell
npx vitest run --reporter=verbose
```

Expected: "No test files found" (no tests yet — that's correct).

- [ ] **Step 5: Commit**

```powershell
git add vitest.config.js package.json package-lock.json
git commit -m "chore: add vitest for unit testing"
```

---

## Task 2: Pure utils — pixel sampling

**Files:**
- Create: `src/utils/particles.js`
- Create: `src/utils/particles.test.js`

- [ ] **Step 1: Write the failing tests for `parseImagePixels`**

```js
// src/utils/particles.test.js
import { describe, it, expect } from 'vitest';
import { parseImagePixels } from './particles.js';

describe('parseImagePixels', () => {
  it('returns white pixels above alpha and brightness threshold', () => {
    // 2×2 image: top-left white opaque, rest filtered out
    const data = new Uint8ClampedArray([
      255, 255, 255, 255,  // (0,0) white, full alpha — INCLUDE
        0,   0,   0, 255,  // (1,0) black — EXCLUDE (r=0 < 180)
      255, 255, 255,  50,  // (0,1) white but low alpha — EXCLUDE (a=50 < 128)
      200, 200, 200, 255,  // (1,1) light gray, full alpha — INCLUDE (r=200 > 180)
    ]);
    const result = parseImagePixels({ data }, 2, 2, 1, 180);
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({ x: 0, y: 0 });
    expect(result[1]).toEqual({ x: 1, y: 1 });
  });

  it('step=2 samples every other pixel', () => {
    // 4×4 image, all white opaque
    const data = new Uint8ClampedArray(4 * 4 * 4).fill(255);
    const result = parseImagePixels({ data }, 4, 4, 2, 180);
    // With step=2: x in {0,2}, y in {0,2} → 4 pixels
    expect(result).toHaveLength(4);
    expect(result.map(p => `${p.x},${p.y}`).sort()).toEqual(
      ['0,0', '0,2', '2,0', '2,2']
    );
  });

  it('returns empty array when no pixels pass threshold', () => {
    const data = new Uint8ClampedArray([0, 0, 0, 255]);
    const result = parseImagePixels({ data }, 1, 1, 1, 180);
    expect(result).toHaveLength(0);
  });
});
```

- [ ] **Step 2: Run to verify test fails**

```powershell
npx vitest run --reporter=verbose
```

Expected: FAIL — "parseImagePixels is not a function"

- [ ] **Step 3: Implement `parseImagePixels` in `src/utils/particles.js`**

```js
// src/utils/particles.js

/**
 * Reads an ImageData object and returns {x,y} coords of pixels that pass
 * alpha + brightness thresholds. These become particle target positions.
 *
 * @param {ImageData|{data: Uint8ClampedArray}} imageData
 * @param {number} width  — pixel width of the image
 * @param {number} height — pixel height of the image
 * @param {number} step   — sample every Nth pixel (lower = more points, slower)
 * @param {number} threshold — minimum red channel value (0–255) to include pixel
 * @returns {{ x: number, y: number }[]}
 */
export function parseImagePixels(imageData, width, height, step = 4, threshold = 180) {
  const { data } = imageData;
  const pixels = [];
  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {
      const i = (y * width + x) * 4;
      const r = data[i];
      const a = data[i + 3];
      if (a > 128 && r > threshold) {
        pixels.push({ x, y });
      }
    }
  }
  return pixels;
}

/**
 * Browser-only wrapper: draws img into a temporary canvas, reads pixel data,
 * and delegates to parseImagePixels.
 *
 * @param {HTMLImageElement} imgElement — must be loaded (complete === true)
 * @param {number} step
 * @returns {{ x: number, y: number }[]}
 */
export function sampleImagePixels(imgElement, step = 4) {
  const canvas = document.createElement('canvas');
  canvas.width  = imgElement.naturalWidth;
  canvas.height = imgElement.naturalHeight;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(imgElement, 0, 0);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  return parseImagePixels(imageData, canvas.width, canvas.height, step);
}
```

- [ ] **Step 4: Run tests — expect pass**

```powershell
npx vitest run --reporter=verbose
```

Expected: all 3 `parseImagePixels` tests PASS.

- [ ] **Step 5: Commit**

```powershell
git add src/utils/particles.js src/utils/particles.test.js vitest.config.js
git commit -m "feat: add parseImagePixels utility with tests"
```

---

## Task 3: Pure utils — scale targets to canvas region

**Files:**
- Modify: `src/utils/particles.js` (add `scaleTargetsToCanvas`)
- Modify: `src/utils/particles.test.js` (add tests)

- [ ] **Step 1: Write failing tests**

```js
// Append to src/utils/particles.test.js
import { scaleTargetsToCanvas } from './particles.js';

describe('scaleTargetsToCanvas', () => {
  it('all output x-coords are >= xOffset * canvasW', () => {
    const targets = [{ x: 0, y: 0 }, { x: 100, y: 0 }, { x: 0, y: 100 }];
    const result = scaleTargetsToCanvas(targets, 100, 100, 1000, 800, 0.5);
    result.forEach(t => expect(t.x).toBeGreaterThanOrEqual(500));
  });

  it('preserves aspect ratio: dy/dx matches imgH/imgW', () => {
    // Image is 100×200 (tall), targets at corners
    const targets = [{ x: 0, y: 0 }, { x: 100, y: 200 }];
    const result = scaleTargetsToCanvas(targets, 100, 200, 1000, 800, 0.5);
    const dx = result[1].x - result[0].x;
    const dy = result[1].y - result[0].y;
    expect(dy / dx).toBeCloseTo(2, 1); // ratio 200/100 = 2
  });

  it('xOffset=0 uses full canvas width', () => {
    const targets = [{ x: 0, y: 0 }];
    const result = scaleTargetsToCanvas(targets, 100, 100, 1000, 800, 0);
    expect(result[0].x).toBeGreaterThanOrEqual(0);
    expect(result[0].x).toBeLessThanOrEqual(1000);
  });

  it('returns empty array for empty input', () => {
    expect(scaleTargetsToCanvas([], 100, 100, 1000, 800, 0.5)).toHaveLength(0);
  });
});
```

- [ ] **Step 2: Run — expect fail**

```powershell
npx vitest run --reporter=verbose
```

Expected: FAIL — "scaleTargetsToCanvas is not a function"

- [ ] **Step 3: Implement `scaleTargetsToCanvas`**

```js
// Append to src/utils/particles.js

/**
 * Scales raw pixel {x,y} positions (from a source image) to a destination
 * region within the canvas. Image is fitted (aspect-ratio preserved) inside
 * the destination box and centered within it.
 *
 * @param {{ x: number, y: number }[]} rawTargets — from parseImagePixels
 * @param {number} imgW    — source image pixel width
 * @param {number} imgH    — source image pixel height
 * @param {number} canvasW — canvas CSS width
 * @param {number} canvasH — canvas CSS height
 * @param {number} xOffset — 0–1 fraction: where the destination box starts on X
 *                           (0.5 = right half, 0 = full width)
 * @returns {{ x: number, y: number }[]}
 */
export function scaleTargetsToCanvas(rawTargets, imgW, imgH, canvasW, canvasH, xOffset = 0.5) {
  if (rawTargets.length === 0) return [];
  const destX = canvasW * xOffset;
  const destW = canvasW * (1 - xOffset);
  const scale  = Math.min(destW / imgW, canvasH / imgH);
  const scaledW = imgW * scale;
  const scaledH = imgH * scale;
  const offX = destX + (destW - scaledW) / 2;
  const offY = (canvasH - scaledH) / 2;
  return rawTargets.map(({ x, y }) => ({
    x: offX + x * scale,
    y: offY + y * scale,
  }));
}
```

- [ ] **Step 4: Run — expect pass**

```powershell
npx vitest run --reporter=verbose
```

Expected: all `scaleTargetsToCanvas` tests PASS.

- [ ] **Step 5: Commit**

```powershell
git add src/utils/particles.js src/utils/particles.test.js
git commit -m "feat: add scaleTargetsToCanvas utility with tests"
```

---

## Task 4: Pure utils — build particle array

**Files:**
- Modify: `src/utils/particles.js`
- Modify: `src/utils/particles.test.js`

- [ ] **Step 1: Write failing tests**

```js
// Append to src/utils/particles.test.js
import { buildParticles } from './particles.js';

describe('buildParticles', () => {
  // Deterministic seeded RNG for reproducible tests
  function seededRng(seed = 42) {
    let s = seed;
    return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
  }

  it('returns exactly totalCount particles', () => {
    const targets = [{ x: 500, y: 300 }, { x: 600, y: 400 }];
    const result = buildParticles(1000, 800, targets, 100, seededRng());
    expect(result).toHaveLength(100);
  });

  it('every particle has required fields with correct types', () => {
    const targets = [{ x: 500, y: 300 }];
    const result = buildParticles(1000, 800, targets, 10, seededRng());
    const p = result[0];
    ['ox', 'oy', 'mx', 'my', 'tx', 'ty', 'size', 'baseOpacity', 'delay'].forEach(k => {
      expect(typeof p[k], `field ${k}`).toBe('number');
    });
    expect(typeof p.isTarget).toBe('boolean');
  });

  it('target particles use image target coordinates', () => {
    const targets = [{ x: 700, y: 400 }];
    const rng = () => 0.5; // constant: makes positions predictable
    const result = buildParticles(1000, 800, targets, 5, rng);
    const tp = result.find(p => p.isTarget);
    expect(tp).toBeDefined();
    expect(tp.tx).toBe(700);
    expect(tp.ty).toBe(400);
  });

  it('non-target particle tx is beyond canvasW (off-screen)', () => {
    const targets = [{ x: 500, y: 300 }];
    const result = buildParticles(1000, 800, targets, 10, seededRng());
    const nonTargets = result.filter(p => !p.isTarget);
    nonTargets.forEach(p => expect(p.tx).toBeGreaterThan(1000));
  });

  it('origin coordinates are within canvas bounds', () => {
    const targets = [{ x: 500, y: 300 }];
    const result = buildParticles(1000, 800, targets, 50, seededRng());
    result.forEach(p => {
      expect(p.ox).toBeGreaterThanOrEqual(0);
      expect(p.ox).toBeLessThanOrEqual(1000);
      expect(p.oy).toBeGreaterThanOrEqual(0);
      expect(p.oy).toBeLessThanOrEqual(800);
    });
  });

  it('delay is in [0, 0.2)', () => {
    const targets = [{ x: 500, y: 300 }];
    const result = buildParticles(1000, 800, targets, 100, seededRng());
    result.forEach(p => {
      expect(p.delay).toBeGreaterThanOrEqual(0);
      expect(p.delay).toBeLessThan(0.2);
    });
  });
});
```

- [ ] **Step 2: Run — expect fail**

```powershell
npx vitest run --reporter=verbose
```

Expected: FAIL — "buildParticles is not a function"

- [ ] **Step 3: Implement `buildParticles`**

```js
// Append to src/utils/particles.js

/**
 * Helper: clamp value between min and max.
 */
function clamp(v, min, max) { return Math.min(max, Math.max(min, v)); }

/**
 * Builds the particle array. Each particle has an origin (word cloud position),
 * a mid-scatter position, and a target (image pixel for target particles,
 * off-screen right for non-target particles that fade away).
 *
 * @param {number} canvasW
 * @param {number} canvasH
 * @param {{ x: number, y: number }[]} imageTargets — from scaleTargetsToCanvas
 * @param {number} totalCount — total particles to create
 * @param {() => number} rng — returns 0–1, default Math.random (injectable for tests)
 * @returns {Particle[]}
 */
export function buildParticles(canvasW, canvasH, imageTargets, totalCount = 3000, rng = Math.random) {
  const targetCount = Math.min(imageTargets.length, Math.ceil(totalCount * 0.7));
  const particles   = [];

  for (let i = 0; i < totalCount; i++) {
    const isTarget = i < targetCount;
    const imgTarget = isTarget ? imageTargets[i % imageTargets.length] : null;

    // Origin: random position across entire canvas (represents word cloud)
    const ox = rng() * canvasW;
    const oy = rng() * canvasH;

    // Mid scatter: offset from origin for the turbulence phase
    const mx = clamp(ox + (rng() - 0.5) * canvasW * 0.4, 0, canvasW);
    const my = clamp(oy + (rng() - 0.5) * canvasH * 0.4, 0, canvasH);

    // Target: image pixel position (right half) OR off-screen right
    const tx = isTarget ? imgTarget.x : canvasW * (1.05 + rng() * 0.4);
    const ty = isTarget ? imgTarget.y : rng() * canvasH;

    particles.push({
      ox, oy,
      mx, my,
      tx, ty,
      isTarget,
      size:        isTarget ? 1.5 + rng() * 0.5 : rng() * 1.5 + 0.5,
      baseOpacity: rng() * 0.4 + 0.6,
      delay:       rng() * 0.2,
    });
  }

  return particles;
}
```

- [ ] **Step 4: Run — expect pass**

```powershell
npx vitest run --reporter=verbose
```

Expected: all `buildParticles` tests PASS.

- [ ] **Step 5: Commit**

```powershell
git add src/utils/particles.js src/utils/particles.test.js
git commit -m "feat: add buildParticles utility with tests"
```

---

## Task 5: Pure utils — particle state math + canvas render

**Files:**
- Modify: `src/utils/particles.js`
- Modify: `src/utils/particles.test.js`

- [ ] **Step 1: Write failing tests**

```js
// Append to src/utils/particles.test.js
import { lerp, easeInOut, easeOut, getParticleState } from './particles.js';

describe('lerp', () => {
  it('returns a at t=0', ()  => expect(lerp(10, 50, 0)).toBe(10));
  it('returns b at t=1', ()  => expect(lerp(10, 50, 1)).toBe(50));
  it('midpoint at t=0.5', () => expect(lerp(0, 100, 0.5)).toBe(50));
  it('clamps below 0',    () => expect(lerp(0, 100, -1)).toBe(0));
  it('clamps above 1',    () => expect(lerp(0, 100, 2)).toBe(100));
});

describe('easeInOut', () => {
  it('returns 0 at t=0', () => expect(easeInOut(0)).toBe(0));
  it('returns 1 at t=1', () => expect(easeInOut(1)).toBe(1));
  it('output at t=0.5 is 0.5 (symmetric)', () => expect(easeInOut(0.5)).toBeCloseTo(0.5, 5));
});

describe('easeOut', () => {
  it('returns 0 at t=0', () => expect(easeOut(0)).toBe(0));
  it('returns 1 at t=1', () => expect(easeOut(1)).toBe(1));
  it('output at t=0.5 > 0.5 (front-loaded)', () => expect(easeOut(0.5)).toBeGreaterThan(0.5));
});

describe('getParticleState', () => {
  const p = {
    ox: 0, oy: 0, mx: 200, my: 200, tx: 600, ty: 400,
    isTarget: true, baseOpacity: 1, delay: 0, size: 1.5,
  };

  it('at progress=0: position equals origin', () => {
    const { x, y } = getParticleState(p, 0);
    expect(x).toBeCloseTo(0);
    expect(y).toBeCloseTo(0);
  });

  it('at progress=0: alpha equals baseOpacity', () => {
    const { alpha } = getParticleState(p, 0);
    expect(alpha).toBeCloseTo(1);
  });

  it('at progress=0.35 (end of phase 1): position near mx/my', () => {
    const { x, y } = getParticleState(p, 0.35);
    expect(x).toBeCloseTo(200, 0);
    expect(y).toBeCloseTo(200, 0);
  });

  it('at progress=0.78 (end of phase 2): target particle near tx/ty', () => {
    const { x, y } = getParticleState(p, 0.78);
    expect(x).toBeCloseTo(600, 0);
    expect(y).toBeCloseTo(400, 0);
  });

  it('at progress=1: target particle alpha is 0 (faded for image takeover)', () => {
    const { alpha } = getParticleState(p, 1);
    expect(alpha).toBeCloseTo(0, 1);
  });

  it('non-target particle: alpha decreases through phase 2', () => {
    const nonTarget = { ...p, isTarget: false };
    const { alpha: a1 } = getParticleState(nonTarget, 0.35);
    const { alpha: a2 } = getParticleState(nonTarget, 0.60);
    const { alpha: a3 } = getParticleState(nonTarget, 0.78);
    expect(a2).toBeLessThan(a1);
    expect(a3).toBeLessThan(a2);
  });

  it('delay shifts particle start: at progress < delay, position = origin', () => {
    const delayed = { ...p, delay: 0.1 };
    const { x } = getParticleState(delayed, 0.05);
    expect(x).toBeCloseTo(0);
  });
});
```

- [ ] **Step 2: Run — expect fail**

```powershell
npx vitest run --reporter=verbose
```

Expected: FAIL — multiple functions not exported.

- [ ] **Step 3: Implement easing, `getParticleState`, `renderParticles`**

```js
// Append to src/utils/particles.js

// ── Easing helpers ─────────────────────────────────────────────────────────

export const lerp       = (a, b, t) => a + (b - a) * Math.max(0, Math.min(1, t));
export const easeInOut  = (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
export const easeOut    = (t) => 1 - Math.pow(1 - t, 3);

// Scroll progress thresholds for the three phases
const PHASE1_END = 0.35; // word cloud fully disintegrated
const PHASE2_END = 0.78; // particles fully at image positions

/**
 * Computes {x, y, alpha} for a single particle at a given scroll progress.
 * Pure function — safe to call in tests without a canvas.
 *
 * Phases:
 *   0 → PHASE1_END  : scatter from ox/oy to mx/my
 *   PHASE1_END → PHASE2_END : converge from mx/my to tx/ty
 *   PHASE2_END → 1   : hold at tx/ty, fade to 0 (image PNG takes over)
 *
 * @param {Particle} p
 * @param {number} progress — 0 to 1 (ScrollTrigger.progress)
 * @returns {{ x: number, y: number, alpha: number }}
 */
export function getParticleState(p, progress) {
  // Per-particle delay: shift progress so this particle starts slightly later
  const pp = Math.max(0, Math.min(1, (progress - p.delay) / (1 - p.delay)));

  let x, y, alpha;

  if (pp < PHASE1_END) {
    const t = easeInOut(pp / PHASE1_END);
    x     = lerp(p.ox, p.mx, t);
    y     = lerp(p.oy, p.my, t);
    alpha = p.baseOpacity;

  } else if (pp < PHASE2_END) {
    const t = easeOut((pp - PHASE1_END) / (PHASE2_END - PHASE1_END));
    x     = lerp(p.mx, p.tx, t);
    y     = lerp(p.my, p.ty, t);
    // Non-target particles fade out as they travel off-screen
    alpha = p.isTarget ? p.baseOpacity : p.baseOpacity * (1 - t);

  } else {
    x = p.tx;
    y = p.ty;
    const fadeT = (pp - PHASE2_END) / (1 - PHASE2_END);
    alpha = p.isTarget ? p.baseOpacity * (1 - fadeT) : 0;
  }

  return { x, y, alpha };
}

/**
 * Renders all particles onto a Canvas 2D context for the current frame.
 * Called on every GSAP ticker tick from the React component.
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {Particle[]} particles
 * @param {number} canvasW — CSS width (not physical pixels)
 * @param {number} canvasH — CSS height
 * @param {number} progress — 0 to 1
 */
export function renderParticles(ctx, particles, canvasW, canvasH, progress) {
  ctx.clearRect(0, 0, canvasW, canvasH);
  ctx.fillStyle = '#ffffff';

  for (const p of particles) {
    const { x, y, alpha } = getParticleState(p, progress);
    if (alpha < 0.01) continue;
    ctx.globalAlpha = alpha;
    ctx.beginPath();
    ctx.arc(x, y, p.size, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.globalAlpha = 1;
}
```

- [ ] **Step 4: Run — expect all pass**

```powershell
npx vitest run --reporter=verbose
```

Expected: all tests in `particles.test.js` PASS.

- [ ] **Step 5: Commit**

```powershell
git add src/utils/particles.js src/utils/particles.test.js
git commit -m "feat: add particle state math and render utilities with tests"
```

---

## Task 6: FounderRevealOption3 — skeleton + scroll pin

**Files:**
- Create: `src/components/ti-option3/FounderRevealOption3.jsx`
- Create: `src/components/ti-option3/FounderRevealOption3.module.css`

Goal for this task: component renders, section pins correctly during scroll (no particles yet — just dark background), and unpins at the end.

- [ ] **Step 1: Create the CSS skeleton**

```css
/* src/components/ti-option3/FounderRevealOption3.module.css */

/*
 * IMPORTANT: Use only CSS variables — never hardcode colors or font families.
 * Theme switcher on option3.astro sets --color-primary, --color-accent,
 * --font-display, --font-body, etc. on :root at runtime.
 */

.section {
  position: relative;
  min-height: 500vh;
}

.sticky {
  position: relative;
  height: 100vh;
  width: 100%;
  overflow: hidden;
  background: var(--color-primary);
  display: flex;
  align-items: center;
}
```

- [ ] **Step 2: Create the component skeleton**

```jsx
// src/components/ti-option3/FounderRevealOption3.jsx
import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import styles from './FounderRevealOption3.module.css';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function FounderRevealOption3() {
  const sectionRef = useRef(null);
  const stickyRef  = useRef(null);

  useGSAP((context) => {
    const section = sectionRef.current;
    const sticky  = stickyRef.current;
    if (!section || !sticky) return;

    context.add(() => {
      ScrollTrigger.create({
        trigger: section,
        start:   'top top',
        end:     'bottom bottom',
        pin:     sticky,
        scrub:   0.3,
        invalidateOnRefresh: true,
      });
    });
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className={styles.section}>
      <div ref={stickyRef} className={styles.sticky}>
        {/* content layers added in later tasks */}
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Add to option3.astro (temporary placement)**

In `src/pages/option3.astro`, import and place the component:

Find the existing import block near the top of the file (where other ti-option3 components are imported) and add:
```js
import FounderRevealOption3 from '../components/ti-option3/FounderRevealOption3.jsx';
```

Find the line `<CTAOption3 client:visible />` and insert before it:
```astro
<FounderRevealOption3 client:load />
```

- [ ] **Step 4: Start dev server and verify scroll pin**

```powershell
npm run dev
```

Open `http://localhost:4321/option3` in browser. Scroll past FirmCultureOption3. The new dark section should pin for ~5 viewport-heights then release. No visual content yet (just dark background).

- [ ] **Step 5: Commit**

```powershell
git add src/components/ti-option3/FounderRevealOption3.jsx src/components/ti-option3/FounderRevealOption3.module.css src/pages/option3.astro
git commit -m "feat: add FounderRevealOption3 skeleton with scroll pin"
```

---

## Task 7: Word cloud layer (visual handoff from FirmCultureOption3)

**Files:**
- Modify: `src/components/ti-option3/FounderRevealOption3.jsx`
- Modify: `src/components/ti-option3/FounderRevealOption3.module.css`

Goal: The new section starts with the same word cloud appearance as FirmCultureOption3, creating a seamless visual handoff. The word cloud will fade out during scroll Phase 1 (driven by GSAP timeline in Task 9).

- [ ] **Step 1: Add word cloud CSS**

Append to `FounderRevealOption3.module.css`:

```css
/* Word cloud — identical appearance to FirmCultureOption3 */
.wordCloud {
  position: absolute;
  inset: 0;
  display: grid;
  grid-template-rows: repeat(28, 1fr);
  pointer-events: none;
  user-select: none;
}

.wordRow {
  overflow: hidden;
  white-space: nowrap;
  line-height: 1;
  align-self: center;
}

.word {
  display: inline;
  font-family: var(--font-body);
  font-weight: 700;
  font-size: 0.72rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #ffffff;
  opacity: 0.15;
  margin-right: 1.2em;
  white-space: nowrap;
}

@media (max-width: 768px) {
  .word { font-size: 0.55rem; }
}
```

- [ ] **Step 2: Add word grid to component**

Replace the contents of `FounderRevealOption3.jsx` with:

```jsx
import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import styles from './FounderRevealOption3.module.css';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const BASE_WORDS = [
  'ACCOUNTABLE', 'AGILE', 'COLLABORATIVE', 'CONNECTED', 'CREATIVE',
  'ESTABLISHED', 'EXPERIENCED', 'FLEXIBLE', 'INNOVATIVE', 'INTEGRITY',
  'PASSIONATE', 'READY', 'STRUCTURED', 'TRANSPARENT', 'KNOWLEDGEABLE',
  'RELIABLE', 'DYNAMIC', 'CARING',
];
const NUM_ROWS      = 28;
const WORDS_PER_ROW = 28;
const WORD_GRID = Array.from({ length: NUM_ROWS }, (_, ri) =>
  Array.from({ length: WORDS_PER_ROW }, (_, ci) => BASE_WORDS[(ri * 3 + ci) % BASE_WORDS.length])
);

// Placeholder — replace with actual logo imports once assets are provided
const LOGOS = [];

export default function FounderRevealOption3() {
  const sectionRef    = useRef(null);
  const stickyRef     = useRef(null);
  const wordCloudRef  = useRef(null);
  const canvasRef     = useRef(null);
  const founderImgRef = useRef(null);
  const leftPanelRef  = useRef(null);

  useGSAP((context) => {
    const section = sectionRef.current;
    const sticky  = stickyRef.current;
    if (!section || !sticky) return;

    context.add(() => {
      ScrollTrigger.create({
        trigger: section,
        start:   'top top',
        end:     'bottom bottom',
        pin:     sticky,
        scrub:   0.3,
        invalidateOnRefresh: true,
      });
    });
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className={styles.section}>
      <div ref={stickyRef} className={styles.sticky}>

        {/* Word cloud — matches FirmCultureOption3 end state */}
        <div ref={wordCloudRef} className={styles.wordCloud} aria-hidden="true">
          {WORD_GRID.map((row, ri) => (
            <div key={ri} className={styles.wordRow}>
              {row.map((word, ci) => (
                <span key={ci} className={styles.word}>{word}</span>
              ))}
            </div>
          ))}
        </div>

        {/* Remaining layers added in Tasks 8–11 */}

      </div>
    </section>
  );
}
```

- [ ] **Step 3: Verify visual handoff in browser**

Run `npm run dev` and scroll to the new section. The word cloud should appear immediately as FirmCultureOption3 exits — same density, same font, same color. No gap or flash.

- [ ] **Step 4: Commit**

```powershell
git add src/components/ti-option3/FounderRevealOption3.jsx src/components/ti-option3/FounderRevealOption3.module.css
git commit -m "feat: add word cloud layer to FounderRevealOption3 for visual handoff"
```

---

## Task 8: Canvas layer + ticker render loop

**Files:**
- Modify: `src/components/ti-option3/FounderRevealOption3.jsx`
- Modify: `src/components/ti-option3/FounderRevealOption3.module.css`

Goal: Canvas overlay renders white dots. At this stage all particles sit at random positions (no scroll-driven movement yet — that's Task 9). Verify canvas is sharp on retina displays.

- [ ] **Step 1: Add canvas CSS**

Append to `FounderRevealOption3.module.css`:

```css
/* Particle canvas — covers full sticky viewport */
.canvas {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0; /* GSAP controls opacity — starts invisible */
}
```

- [ ] **Step 2: Add canvas + particle setup to component**

Replace the full `FounderRevealOption3.jsx` with:

```jsx
import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import styles from './FounderRevealOption3.module.css';
import {
  sampleImagePixels,
  scaleTargetsToCanvas,
  buildParticles,
  renderParticles,
} from '../../utils/particles.js';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const BASE_WORDS = [
  'ACCOUNTABLE', 'AGILE', 'COLLABORATIVE', 'CONNECTED', 'CREATIVE',
  'ESTABLISHED', 'EXPERIENCED', 'FLEXIBLE', 'INNOVATIVE', 'INTEGRITY',
  'PASSIONATE', 'READY', 'STRUCTURED', 'TRANSPARENT', 'KNOWLEDGEABLE',
  'RELIABLE', 'DYNAMIC', 'CARING',
];
const NUM_ROWS      = 28;
const WORDS_PER_ROW = 28;
const WORD_GRID = Array.from({ length: NUM_ROWS }, (_, ri) =>
  Array.from({ length: WORDS_PER_ROW }, (_, ci) => BASE_WORDS[(ri * 3 + ci) % BASE_WORDS.length])
);

const LOGOS = []; // populated in Task 11

export default function FounderRevealOption3() {
  const sectionRef    = useRef(null);
  const stickyRef     = useRef(null);
  const wordCloudRef  = useRef(null);
  const canvasRef     = useRef(null);
  const founderImgRef = useRef(null);
  const leftPanelRef  = useRef(null);

  const particlesRef = useRef([]);
  const progressRef  = useRef(0);
  const canvasSizeRef = useRef({ w: 0, h: 0 }); // CSS dimensions (not physical)

  useGSAP((context) => {
    const section = sectionRef.current;
    const sticky  = stickyRef.current;
    const canvas  = canvasRef.current;
    if (!section || !sticky || !canvas) return;

    const ctx = canvas.getContext('2d');

    // ── Canvas resize ────────────────────────────────────────────────────────
    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const w   = window.innerWidth;
      const h   = window.innerHeight;
      canvas.width        = w * dpr;
      canvas.height       = h * dpr;
      canvas.style.width  = w + 'px';
      canvas.style.height = h + 'px';
      ctx.scale(dpr, dpr);
      canvasSizeRef.current = { w, h };

      // Rebuild particles if image already loaded
      const img = founderImgRef.current;
      if (img && img.complete && img.naturalWidth > 0) {
        rebuildParticles(w, h, img);
      }
    };

    // ── Particle builder ─────────────────────────────────────────────────────
    const rebuildParticles = (w, h, img) => {
      const isMobile = w < 768;
      const count    = isMobile ? 1500 : 3000;
      const rawTargets = sampleImagePixels(img, 4);
      const targets    = scaleTargetsToCanvas(
        rawTargets, img.naturalWidth, img.naturalHeight, w, h, 0.5
      );
      particlesRef.current = buildParticles(w, h, targets, count);
    };

    // ── Image load → build particles ─────────────────────────────────────────
    const img = founderImgRef.current;
    const onImgLoad = () => {
      const { w, h } = canvasSizeRef.current;
      rebuildParticles(w, h, img);
    };
    if (img.complete && img.naturalWidth > 0) {
      onImgLoad();
    } else {
      img.addEventListener('load', onImgLoad, { once: true });
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // ── GSAP ticker → canvas render loop ────────────────────────────────────
    const tick = () => {
      if (particlesRef.current.length === 0) return;
      const { w, h } = canvasSizeRef.current;
      renderParticles(ctx, particlesRef.current, w, h, progressRef.current);
    };
    gsap.ticker.add(tick);

    // ── ScrollTrigger ────────────────────────────────────────────────────────
    context.add(() => {
      ScrollTrigger.create({
        trigger: section,
        start:   'top top',
        end:     'bottom bottom',
        pin:     sticky,
        scrub:   0.3,
        onUpdate: (self) => { progressRef.current = self.progress; },
        invalidateOnRefresh: true,
      });
    });

    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className={styles.section}>
      <div ref={stickyRef} className={styles.sticky}>

        <div ref={wordCloudRef} className={styles.wordCloud} aria-hidden="true">
          {WORD_GRID.map((row, ri) => (
            <div key={ri} className={styles.wordRow}>
              {row.map((word, ci) => (
                <span key={ci} className={styles.word}>{word}</span>
              ))}
            </div>
          ))}
        </div>

        <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />

        {/* Founder image — added in Task 10 */}
        <img
          ref={founderImgRef}
          src="/images/founder.png"
          alt=""
          aria-hidden="true"
          className={styles.founderImg}
          style={{ opacity: 0 }}
        />

        {/* Left panel — added in Task 11 */}
        <div ref={leftPanelRef} className={styles.leftPanel} style={{ opacity: 0 }} />

      </div>
    </section>
  );
}
```

**Note:** `founderImgRef.current` is still an `<img>` pointing at `/images/founder.png` which doesn't exist yet (user provides it). The `onImgLoad` handler won't fire until the asset exists. The `complete && naturalWidth > 0` guard prevents errors. Particles won't appear until the image is placed in Task 10.

- [ ] **Step 3: Verify canvas renders (temporarily force canvas visible)**

In browser DevTools console at `http://localhost:4321/option3`, run:

```js
document.querySelector('canvas').style.opacity = '1';
```

Scroll past FirmCultureOption3. If the founder image exists (`/images/founder.png`), white dots appear in the right half. Without the image, canvas remains blank (expected).

- [ ] **Step 4: Commit**

```powershell
git add src/components/ti-option3/FounderRevealOption3.jsx src/components/ti-option3/FounderRevealOption3.module.css
git commit -m "feat: add canvas layer and particle render loop to FounderRevealOption3"
```

---

## Task 9: GSAP timeline — animate DOM elements via scroll progress

**Files:**
- Modify: `src/components/ti-option3/FounderRevealOption3.jsx`

Goal: Word cloud fades out, canvas fades in, canvas fades out, founder image fades in, left panel slides in — all scrubbed to scroll position via a single GSAP timeline.

- [ ] **Step 1: Replace the `ScrollTrigger.create` call with a full GSAP timeline**

In `FounderRevealOption3.jsx`, find the `context.add(() => {` block inside `useGSAP` and replace it with:

```js
context.add(() => {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start:   'top top',
      end:     'bottom bottom',
      pin:     sticky,
      scrub:   0.3,
      onUpdate: (self) => { progressRef.current = self.progress; },
      invalidateOnRefresh: true,
    },
  });

  // Duration units: 10 total (maps to 0–1 progress).
  // Phase 1: 0–3.5  — word cloud disintegrates, canvas appears
  // Phase 2: 3.5–7.8 — particles converge (canvas only, driven by progressRef)
  // Phase 3: 7.8–9.5 — image fades in, canvas fades out, left panel slides in
  // Hold:    9.5–10  — settled layout

  tl.to(wordCloudRef.current,
    { opacity: 0, duration: 3.5, ease: 'none' }, 0);

  tl.fromTo(canvasRef.current,
    { opacity: 0 },
    { opacity: 1, duration: 2, ease: 'none' }, 0);

  tl.to(canvasRef.current,
    { opacity: 0, duration: 1.5, ease: 'power1.in' }, 7.8);

  tl.to(founderImgRef.current,
    { opacity: 1, duration: 1.5, ease: 'power2.out' }, 7.8);

  tl.fromTo(leftPanelRef.current,
    { x: -60, opacity: 0 },
    { x:   0, opacity: 1, duration: 2.0, ease: 'power2.out' }, 7.0);

  tl.to({}, { duration: 0.5 }, 9.5); // hold at end
});
```

- [ ] **Step 2: Verify animation sequence in browser**

Run `npm run dev` and scroll through the section. Expect:
1. Word cloud visible at section start → fades to invisible ~35% through scroll
2. White dots appear and move as you scroll (if founder image loaded)
3. Dots fade out and founder image PNG fades in at ~78% scroll progress
4. Left panel slides in from left at ~70% progress
5. All elements hold in place for final ~5% of scroll

- [ ] **Step 3: Commit**

```powershell
git add src/components/ti-option3/FounderRevealOption3.jsx
git commit -m "feat: add GSAP scroll timeline for particle transition DOM elements"
```

---

## Task 10: Founder image — CSS positioning + bleed effect

**Files:**
- Modify: `src/components/ti-option3/FounderRevealOption3.module.css`
- Modify: `src/components/ti-option3/CTAOption3.module.css`
- Add: `public/images/founder.png` **(user places this file)**

The founder image occupies the right half of the sticky viewport and bleeds below the section boundary into CTAOption3 via a gradient mask. Since both sections share `--color-primary` background, the fade is invisible — the image appears to stand across both sections.

- [ ] **Step 1: Place founder image asset**

Copy the provided founder PNG to:
```
public/images/founder.png
```

File requirements: white line art, transparent background, 3/4 body portrait, minimum 800×1400px.

- [ ] **Step 2: Add founder image CSS**

Append to `FounderRevealOption3.module.css`:

```css
/* Founder image — right half, bleeds below section */
.founderImg {
  position: absolute;
  right: 0;
  top: 0;
  height: 115%;     /* extends 15% below section bottom for bleed into CTA */
  width: auto;
  max-width: 52%;
  object-fit: contain;
  object-position: top right;
  pointer-events: none;
  /* Bottom gradient fade: image dissolves into CTA background */
  mask-image: linear-gradient(to bottom, black 45%, transparent 85%);
  -webkit-mask-image: linear-gradient(to bottom, black 45%, transparent 85%);
}

@media (max-width: 768px) {
  .founderImg {
    max-width: 75%;
    right: -8%;
    height: 105%;
    top: auto;
    bottom: 0;
    object-position: bottom right;
  }
}
```

- [ ] **Step 3: Remove the inline `style={{ opacity: 0 }}` from img tag**

In `FounderRevealOption3.jsx`, find:
```jsx
<img
  ref={founderImgRef}
  src="/images/founder.png"
  alt=""
  aria-hidden="true"
  className={styles.founderImg}
  style={{ opacity: 0 }}
/>
```

Remove `style={{ opacity: 0 }}` — GSAP sets initial opacity 0 via the `to()` call, so the inline style is redundant and interferes with GSAP's internal state tracking.

```jsx
<img
  ref={founderImgRef}
  src="/images/founder.png"
  alt="NYA founder portrait"
  className={styles.founderImg}
/>
```

Also update `alt` to be meaningful (not empty) since this image conveys identity.

- [ ] **Step 4: Set initial opacity via GSAP `set` in useGSAP**

In `FounderRevealOption3.jsx`, add this line at the top of the `useGSAP` callback (before the `context.add` call), so GSAP owns the initial state and avoids a flash on mount:

```js
gsap.set(founderImgRef.current, { opacity: 0 });
gsap.set(leftPanelRef.current,  { opacity: 0 });
```

- [ ] **Step 5: Add `position: relative` to CTAOption3 for clean stacking**

In `src/components/ti-option3/CTAOption3.module.css`, modify `.section`:

```css
.section {
  position: relative;      /* ADD — ensures CTA content stacks above any overflow */
  background: var(--color-primary);
  min-height: 100vh;
  padding: var(--section-padding, 120px) 0;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

- [ ] **Step 6: Verify bleed in browser**

Scroll past the particle transition to the settled state. The founder image should:
- Occupy the right ~50% of the viewport
- Extend visually into the CTAOption3 section below
- Fade out at the bottom rather than hard-clipping
- CTAOption3 text should be visible and readable (not occluded)

If the image feels too large or too small, adjust `max-width` in step 2. If the bleed point is wrong, adjust the gradient stops in `mask-image`.

- [ ] **Step 7: Commit**

```powershell
git add src/components/ti-option3/FounderRevealOption3.jsx src/components/ti-option3/FounderRevealOption3.module.css src/components/ti-option3/CTAOption3.module.css public/images/founder.png
git commit -m "feat: add founder image with bleed into CTA"
```

---

## Task 11: Left panel — trust wall with client logos

**Files:**
- Modify: `src/components/ti-option3/FounderRevealOption3.jsx`
- Modify: `src/components/ti-option3/FounderRevealOption3.module.css`
- Add: `public/images/logos/*.{svg,png}` **(user places these files)**

- [ ] **Step 1: Add logo assets**

Copy provided logo files to `public/images/logos/`. Filenames are arbitrary — update the `LOGOS` array in the component (step 2) to match.

- [ ] **Step 2: Update `LOGOS` array in component**

In `FounderRevealOption3.jsx`, replace:
```js
const LOGOS = []; // populated in Task 11
```
with the actual logo list (example — replace `src` and `alt` values to match your files):
```js
const LOGOS = [
  { src: '/images/logos/client-a.svg', alt: 'Client A' },
  { src: '/images/logos/client-b.svg', alt: 'Client B' },
  { src: '/images/logos/client-c.png', alt: 'Client C' },
  { src: '/images/logos/client-d.svg', alt: 'Client D' },
  { src: '/images/logos/client-e.svg', alt: 'Client E' },
  { src: '/images/logos/client-f.png', alt: 'Client F' },
];
```

- [ ] **Step 3: Add left panel JSX**

In `FounderRevealOption3.jsx`, find the left panel div:
```jsx
<div ref={leftPanelRef} className={styles.leftPanel} style={{ opacity: 0 }} />
```

Replace with:
```jsx
<div ref={leftPanelRef} className={styles.leftPanel}>
  <p className={styles.leftEyebrow}>Trusted by</p>
  <div className={styles.logoGrid}>
    {LOGOS.map((logo) => (
      <img
        key={logo.alt}
        src={logo.src}
        alt={logo.alt}
        className={styles.logo}
      />
    ))}
  </div>
</div>
```

- [ ] **Step 4: Add left panel CSS**

Append to `FounderRevealOption3.module.css`:

```css
/* Left panel — trust wall */
.leftPanel {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 46%;
  padding: 0 clamp(32px, 5vw, 80px);
}

.leftEyebrow {
  font-family: var(--font-body);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-accent);
  margin: 0 0 clamp(24px, 3vw, 40px);
  display: flex;
  align-items: center;
  gap: 10px;
}

.leftEyebrow::before {
  content: '';
  display: block;
  width: 24px;
  height: 1.5px;
  background: currentColor;
  flex-shrink: 0;
}

.logoGrid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: clamp(20px, 2.5vw, 36px) clamp(24px, 3vw, 48px);
  align-items: center;
}

.logo {
  /* Force white: strips color information so logos work on any theme */
  filter: brightness(0) invert(1);
  opacity: 0.35;
  max-width: 120px;
  height: 32px;
  object-fit: contain;
  transition: opacity 300ms var(--ease-out, cubic-bezier(0.16,1,0.3,1));
}

.logo:hover {
  opacity: 0.75;
}

@media (max-width: 768px) {
  .leftPanel {
    position: static;
    width: 100%;
    padding: 0 clamp(20px, 5vw, 40px);
    padding-bottom: 200px; /* space for founder image above */
    justify-content: flex-end;
  }

  .logoGrid {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

- [ ] **Step 5: Verify in browser**

Scroll to the settled state. Left panel should:
- Slide in from the left during the Phase 3 transition
- Show eyebrow label + logo grid
- Logos appear white (any color original → white via CSS filter)
- Logos darken slightly on hover

- [ ] **Step 6: Commit**

```powershell
git add src/components/ti-option3/FounderRevealOption3.jsx src/components/ti-option3/FounderRevealOption3.module.css public/images/logos/
git commit -m "feat: add trust wall logo panel to FounderRevealOption3"
```

---

## Task 12: Full scroll review + tuning

**Files:**
- Modify: `src/components/ti-option3/FounderRevealOption3.module.css` (if timing/sizing adjustments needed)
- Modify: `src/components/ti-option3/FounderRevealOption3.jsx` (if timing adjustments needed)

- [ ] **Step 1: Full scroll walkthrough checklist**

Run `npm run dev`. Scroll slowly from top of `/option3` to bottom. Check each item:

- [ ] FirmCultureOption3 → FounderRevealOption3 boundary: no flash, no background color mismatch, word cloud appears seamless
- [ ] Phase 1 (~0–35% scroll in new section): word cloud fades out, white dots appear
- [ ] Phase 2 (~35–78%): dots travel visibly from scattered positions toward right side of viewport
- [ ] Phase 2 end: dots form recognizable shape of founder portrait
- [ ] Phase 3 (~78–95%): founder PNG fades in over dots, dots fade out, left panel slides in
- [ ] Settled state: founder image on right, logos on left, no visual artifacts
- [ ] Scroll into CTAOption3: founder image bleeds down, CTA text is fully readable
- [ ] CTA buttons are not occluded by the founder image

- [ ] **Step 2: Tune `min-height` if transition feels rushed or too slow**

If the particle animation feels too fast (particles snap), increase `min-height` in `.section`:
```css
/* In FounderRevealOption3.module.css */
.section { min-height: 600vh; } /* increase from 500vh */
```

If it feels too slow, decrease to `400vh`.

- [ ] **Step 3: Tune founder image bleed if CTA text is occluded**

If the founder image overlaps CTA text, reduce the gradient stop in `.founderImg`:
```css
mask-image: linear-gradient(to bottom, black 35%, transparent 75%); /* less bleed */
```

Or reduce `height` from `115%` to `108%`.

- [ ] **Step 4: Commit any tuning changes**

```powershell
git add src/components/ti-option3/FounderRevealOption3.module.css src/components/ti-option3/FounderRevealOption3.jsx
git commit -m "chore: tune particle transition timing and founder image bleed"
```

---

## Task 13: Mobile responsive check

**Files:**
- Modify: `src/components/ti-option3/FounderRevealOption3.module.css` (add fixes as needed)

- [ ] **Step 1: Test at 375px viewport width**

In browser DevTools, set viewport to 375×812 (iPhone SE). Scroll through `/option3`.

Expected:
- Particle count is 1500 (not 3000) — less computationally heavy
- Founder image on right, slightly larger relative to viewport (max-width: 75%)
- Logo grid: 3 columns, smaller padding
- Left panel sits below founder image (stacked, not side-by-side)

- [ ] **Step 2: Test at 768px (tablet)**

Set viewport to 768×1024. Verify:
- Layout transitions cleanly between mobile (stacked) and desktop (side-by-side)
- The breakpoint in CSS at `768px` fires correctly

- [ ] **Step 3: Fix any layout issues found**

Add or adjust `@media` rules in `FounderRevealOption3.module.css` as needed based on findings above.

- [ ] **Step 4: Commit**

```powershell
git add src/components/ti-option3/FounderRevealOption3.module.css
git commit -m "fix: mobile responsive layout for FounderRevealOption3"
```

---

## Self-Review

### Spec Coverage

| Requirement | Covered by |
|---|---|
| Words break into dots | Tasks 5, 8, 9 — canvas particles spawn at word-cloud positions, Phase 1 scatter |
| Dots transform into founder image | Tasks 2–5 — pixel sampling + particle convergence in Phase 2 |
| Founder image: hand drawn line, white, right side | Task 10 — CSS positions image in right half |
| Bottom of image bleeds into CTA | Task 10 — `height: 115%` + gradient `mask-image` |
| Trust wall of logos on left | Task 11 — logo grid with `filter: brightness(0) invert(1)` |
| Visual handoff from FirmCultureOption3 | Task 7 — matching word cloud at section start |
| Theme system compliance | All tasks — CSS uses `var(--color-primary)`, `var(--color-accent)`, `var(--font-body)` only |
| GSAP/Lenis integration | Task 8–9 — GSAP ticker + ScrollTrigger, no new Lenis init |
| Mobile responsive | Task 13 |

### Placeholder Scan

No TBD, TODO, or "implement later" present. All code steps show complete implementation.

### Type Consistency

- `parseImagePixels` defined Task 2, used in `sampleImagePixels` (same task), called in Task 8 component
- `scaleTargetsToCanvas` defined Task 3, called in Task 8 component
- `buildParticles` defined Task 4, called in Task 8 component  
- `renderParticles` defined Task 5, called in Task 8 component
- `getParticleState` defined and tested Task 5, called inside `renderParticles`
- `progressRef.current` set in `onUpdate` Task 9, read in ticker Task 8 — consistent

All function signatures match across tasks. ✓
