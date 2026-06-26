# NYA TI Microsite — Claude Instructions

## Theme System (CRITICAL — read before touching any component)

### How it works
`option3.astro` has a sticky theme-switcher bar that lets users pick a **color scheme** and a **font pair** at runtime. It works by calling `document.documentElement.style.setProperty(...)` to override CSS custom properties on `:root`.

Every component reads these variables — so when the user switches theme, the whole page updates instantly with no re-render.

### Rules for every component in `src/components/ti-option3/`

**DO use CSS variables for every color and font:**
```css
color: var(--color-primary);
font-family: var(--font-display);
background: var(--color-accent);
border-color: var(--border-accent);
box-shadow: var(--shadow-accent);
```

**DO NOT hardcode any color or font family:**
```css
/* WRONG — breaks theme switching */
color: #0B1F3B;
font-family: 'Playfair Display', serif;
background: #2F80ED;
```

**DO NOT create new color schemes.** The six schemes below are the complete set. Design decisions happen in the switcher data in `option3.astro`, not in component CSS.

### Per-section theme overrides

The theme switcher sets the **global default** on `:root`. To give a section a
different color scheme or font, wrap it in `SectionTheme.astro`:

```astro
<SectionTheme scheme="maroon-gold" font="playfair-inter">
  <Hero4 client:load />
</SectionTheme>
```

For section-specific tokens the scheme/font axes don't cover, use the
`SECTION_OVERRIDES` map defined inside `SectionTheme.astro`, keyed by section
name. Apply it with `section="…"`:

```astro
<SectionTheme section="ti-differences">
  <TIDifferencesOption3 client:load />
</SectionTheme>
```

Add a new entry to `SECTION_OVERRIDES` when a section needs its own tokens. For
true one-offs, the `vars` prop still takes a free-form CSS-variable object that
is applied inline and wins over everything else.

**Precedence (highest first):** `vars` → `SECTION_OVERRIDES[section]` → `scheme`/`font` → global default (`:root`).

- All props optional. Omit `scheme`/`font` to inherit the global default for that axis.
- `SectionTheme` renders a `display:contents` box — zero layout impact, safe to
  wrap around GSAP-pinned sections.
- It works by setting `data-scheme` / `data-font` attributes, matched by scoped
  CSS rules in `option3.astro` that re-declare the theme variables on that subtree.
- Global default (theme switcher start state) is `charcoal-cyan` + `spectral-work`.
- **Valid ids are ONLY the schemes/fonts in the tables below.** Do not invent new
  ones. The scoped CSS in `option3.astro` mirrors the switcher's `SCHEMES`/`FONTS`
  data — if you change a scheme value, update both places.

### Available CSS variables (set by theme switcher)

| Variable | Purpose |
|---|---|
| `--color-primary` | Dark brand color — nav, hero bg, dark sections |
| `--color-primary-light` | Mid brand color — gradients, hover surfaces |
| `--color-accent` | Accent/CTA color — buttons, eyebrows, links |
| `--color-accent-hover` | Accent hover state |
| `--border-accent` | Accent-tinted border (rgba) |
| `--shadow-accent` | Accent-tinted box shadow |
| `--font-display` | Serif display font — H1, H2 headings |
| `--font-body` | Sans-serif body font — H3, body, UI, labels |

### Static tokens (never change, defined in `design-system.css`)

```
--color-black / --color-gray-900 / --color-gray-700 / --color-gray-500
--color-gray-300 / --color-gray-200 / --color-gray-100 / --color-white
--surface-page / --surface-card / --surface-subtle
--border-default / --border-strong
--shadow-1 through --shadow-5
--radius-xs through --radius-2xl
--sp-1 through --sp-30  (spacing scale)
--text-xs through --text-6xl  (type scale)
--ease-out / --ease-in / --ease-inout
--container / --container-narrow / --margin-desktop / --section-padding
```

### The six color schemes (in `option3.astro` — DO NOT add more)

| ID | Name | Primary | Accent |
|---|---|---|---|
| `navy-blue` | Navy + Blue | `#0B1F3B` | `#2F80ED` |
| `slate-amber` | Slate + Amber | `#1F2937` | `#D97706` |
| `charcoal-cyan` | Charcoal + Cyan | `#0F172A` | `#06B6D4` |
| `forest-stone` | Forest + Stone | `#1A2E1A` | `#6B9B6B` |
| `violet-gold` | Deep Violet | `#1E1B4B` | `#7C3AED` |
| `navy-gold` | Navy + Gold | `#1E3A8A` | `#B45309` |

### The five font pairs (in `option3.astro` — DO NOT add more)

| ID | Display | Body |
|---|---|---|
| `playfair-inter` | Playfair Display | Inter |
| `fraunces-jakarta` | Fraunces | Plus Jakarta Sans |
| `cormorant-montserrat` | Cormorant Garamond | Montserrat |
| `baskerville-source` | Libre Baskerville | Source Sans 3 |
| `spectral-work` | Spectral | Work Sans |

All fonts are preloaded in `option3.astro`'s `<head>`. If you add a new component that needs a font not in this list, load it there — but do not add a new font pair to the switcher.

## Project structure

```
src/
  pages/
    option3.astro        ← Option 3 page + theme switcher
    option1.astro        ← Production baseline
    option2.astro        ← Option 2 WIP
    design.astro         ← Design system showcase
    index.astro          ← Dev hub (links to all pages)
  components/
    ti-option3/          ← Option 3 components (skeleton, WIP)
    ti-option2/          ← Option 2 components
    [GlobalSetup, Nav, Hero, ...]  ← Shared / Option 1 components
  design/
    design-system.css    ← Source of truth for all static tokens
    NYA_Tenant_Improvement_Figma_File_Blueprint.md
```

## Lenis + GSAP ScrollTrigger (option3 components)

Every option3 component that uses scroll animation relies on **Lenis** (smooth scroll) + **GSAP ScrollTrigger** (scrub/pin). GlobalSetup.jsx initializes both globally — do not reinitialize them in individual components.

### How GlobalSetup wires them

```js
const lenis = new Lenis({ lerp: 0.1, smoothWheel: true })
lenis.on('scroll', ScrollTrigger.update)  // keeps ST in sync with Lenis
gsap.ticker.add((time) => { lenis.raf(time * 1000) })  // drives Lenis via GSAP ticker
gsap.ticker.lagSmoothing(0)
```

No `ScrollTrigger.scrollerProxy()` needed — Lenis v1 uses native scroll so `window.scrollY` stays accurate.

### Rules for every animated component in `src/components/ti-option3/`

**DO use `gsap.context()` inside `useEffect` for cleanup:**
```js
useEffect(() => {
  const ctx = gsap.context(() => {
    // all GSAP/ScrollTrigger code here
  }, rootRef);
  return () => ctx.revert();
}, []);
```

**DO NOT add `position: sticky` in CSS on any element that GSAP pins.** GSAP pin sets `position: fixed` — CSS sticky fights it and causes the page to get stuck. Let GSAP own pinning entirely.

**DO use `scrub` (not `toggleActions`) for scroll-driven animations:**
```js
scrollTrigger: {
  trigger: sectionRef.current,
  start: 'top top',
  end: 'bottom bottom',
  scrub: 1,          // number = seconds for playhead to catch up (smoothness)
  pin: elementRef.current,
  invalidateOnRefresh: true,
}
```

**DO wrap ScrollTrigger creation in `document.fonts.ready.then()`** if the animation depends on font-sized elements (prevents wrong measurements before fonts load).

**DO use `invalidateOnRefresh: true`** on any ScrollTrigger that uses computed sizes (font-relative units, vw/vh, etc.).

**DO NOT use `pinSpacing: false` unless the section already has explicit scroll height** (e.g. `min-height: 400vh`). Default `pinSpacing: true` is safer.

### Accessing Lenis in a component (e.g. scroll-to)
```js
window.__lenis?.scrollTo(element, { offset: -80, duration: 1.4 })
```

### Hero → next-section seam (z-index invariant — easy to break)

The Hero (`00_O3_Hero`) and the next section (`01_O3_TIDifferences`, `z-index:36`)
overlap at the seam: TIDifferences has `margin-top:-50vh` so it rises in while the
hero is still pinned. **The building must ride OVER the rising navy, not behind it.**

Pinning makes `.trigger` `position:fixed` → its own stacking context at z-auto, so
at the root the section (`z-36`) would paint over the whole pinned hero. To prevent
that, the `hero4-pin` ScrollTrigger's `onToggle` lifts `.trigger` to `z-index:37`
**only while the pin is active**, then clears it on release so the section takes
over cleanly (leaving it set permanently would cover the section with the hero's
white `.home` bg → white wedge).

- The building rises over the hero's own `bg2` navy shape (which mimics/merges into
  the next section), so visually the navy is continuous through the seam.
- If you change hero or section z-indexes, preserve: `bg1/bg2 (1) < section (36) <
  trigger-while-pinned (37) < building layers`. Don't give `.home` or `.trigger` a
  permanent z-index above the section.

## Dev server

```bash
npm run dev      # http://localhost:4321
npm run build    # production build
npm run preview  # preview build locally
```

Option 3 is at `/option3`. Dev hub (all page links) at `/`.
