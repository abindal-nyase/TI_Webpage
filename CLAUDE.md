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

## Dev server

```bash
npm run dev      # http://localhost:4321
npm run build    # production build
npm run preview  # preview build locally
```

Option 3 is at `/option3`. Dev hub (all page links) at `/`.
