# NYA Tenant Improvement Microsite — Design Spec
**Date:** 2026-04-15  
**Project:** ti.nyase.com — Nabih Youssef & Associates TI Practice Microsite  
**Status:** Approved

---

## Overview

Single-page scrollytelling microsite for NYA's Tenant Improvement practice. Primary audience: architects who want fast, responsive structural engineers. Secondary: owners, property managers. Sent as a direct link to targeted prospects — not a public SEO play.

**Goal:** Position NYA as the go-to TI structural partner — fast, experienced, zero friction.

---

## Design Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Theme | Warm Editorial | Off-white `#FAF8F5`, charcoal `#1a1714`, warm neutrals. Premium, authoritative. |
| Typography | Cormorant Garamond (headings) + Inter (body/UI) | Editorial serif for gravitas, clean sans for readability |
| Scroll style | Cinematic Narrative | Dark dramatic hero → light editorial. GSAP-pinned sections, counter animations, scroll-scrubbed reveals |
| Tech stack | Vite + React + Framer Motion + GSAP + Lenis | Framer Motion for component entrances; GSAP ScrollTrigger for cinematic sequences; Lenis for buttery smooth scroll |
| CTA | `mailto:info@nyase.com` | Simple, no backend needed |
| Photos | Stock/placeholder + swap guide | Real project photos to be added later |

### Color Palette

```
Background:   #FAF8F5  (warm off-white)
Primary text: #1a1714  (near-black charcoal)
Secondary:    #8a7f76  (warm mid-gray)
Muted:        #c8bfb7  (warm light gray)
Border:       #e8e2db  (hairline warm gray)
Dark sections:#1a1714  (same as text — full dark panels)
```

### Typography Scale

```
Display (hero):     Cormorant Garamond 300, 64–80px, letter-spacing -1px
H1 (section title): Cormorant Garamond 300, 40–48px
H2 (subsection):    Cormorant Garamond 400, 28–32px
Body:               Inter 300, 16–18px, line-height 1.7
Label/UI:           Inter 400, 10–11px, letter-spacing 3px, uppercase
CTA button:         Inter 400, 11px, letter-spacing 3px, uppercase
```

---

## Page Structure — 11 Sections

### § 01 — Hero
- Full-screen dark panel (`#1a1714`)
- Background: high-quality city skyline/architectural stock photo with dark overlay + subtle parallax (Lenis + GSAP)
- Headline: **"Tenant improvement. Done right, every time."** — Cormorant 300, scroll-triggered word-by-word reveal (GSAP SplitText)
- Sub-label: "TENANT IMPROVEMENT PRACTICE · NABIH YOUSSEF ASSOCIATES" — Inter uppercase, fades in after headline
- Scroll indicator: animated arrow, auto-hides on first scroll
- NYA logomark top-left, white

### § 02 — Intro Narrative
- Transitions from dark to warm light background
- Two-column literary prose layout (desktop), single column (mobile)
- Staggered fade-up on scroll entry (Framer Motion `useInView`)
- Copy tone: thoughtful, expert, unhurried — positions NYA as intelligent partner, not commodity
- Placeholder copy: "Every occupied building tells a story of transformation. We are the engineers who make that transformation possible — fast, compliant, invisible to the end user."

### § 03 — Trust Statement
- Full-width dark panel (`#1a1714`), pinned with GSAP ScrollTrigger
- Large centered pull-quote: **"We don't slow architects down. We keep them moving."**
- Scroll-scrubbed fade-in, then releases scroll when fully visible
- Returns to light background on release

### § 04 — Stats Strip
- Light background, 4-column grid
- Scroll-triggered counter animations (GSAP `CountTo`) on viewport enter
- 4 stats (all placeholders — replace before launch):
  - `XX+` TI Projects Completed
  - `YY+` Years in Practice
  - `ZZ` LEED Certified Projects
  - `WW+ sq ft` Transformed
- Cormorant Garamond 300 for numbers, Inter uppercase labels

### § 05 — Image Gallery 1 (Horizontal Scroll)
- GSAP-driven horizontal scroll section pinned while user scrolls vertically
- 6–8 project images (stock photos from Unsplash architectural category)
- Each image: project name + location on hover (Inter uppercase, fade-in overlay)
- **Photo swap guide:** See `assets/PHOTO-SWAP-GUIDE.md` — each image slot labeled with recommended dimensions and content type

### § 06 — Mid-Page CTA
- Subtle horizontal band on light background
- Left: "Working on a TI project? Let's talk." — Cormorant 300
- Right: Dark button → `mailto:info@nyase.com`
- Framer Motion slide-in from both sides on viewport enter

### § 07 — Charts (Animated Data)
- Light background, two-chart layout
- **Chart A:** Horizontal bar chart — project type breakdown (Office, Media/Entertainment, Retail, Healthcare, Other). Bars animate from 0 on viewport enter (GSAP)
- **Chart B:** Single large stat — avg permit turnaround. Placeholder: `~X weeks`
- Subheading: "The numbers behind the work" — framing shift from "beautiful work" to "smart investment"
- All data placeholders — labeled clearly for replacement

### § 08 — Selected Offerings
- Dark panel (`#1a1714`)
- 3-column grid (desktop), stacked (mobile)
- Categories: **Office TI** · **Media & Entertainment** · **Retail** · **Healthcare** · **Historic Renovation** · **Mixed-Use**
- Each card: Inter uppercase label + Cormorant short description
- Staggered entrance animation (Framer Motion, 0.1s delay per card)

### § 09 — Testimonials + Service Detail
- Light background, split layout (60/40)
- Left: Pull quote with thick left border, client name + firm (placeholders)
- Right: Technical service description that contextualizes the testimonial
- 2–3 pairs, user advances with arrow/dot nav (Framer Motion AnimatePresence for transitions — no auto-rotation)
- Placeholders labeled for real client testimonials

### § 10 — Image Gallery 2 (Masonry)
- Light background visual breather
- Asymmetric masonry grid: 1 large + 3 small images
- Framer Motion staggered scale-up on viewport enter
- Same photo swap guide as Gallery 1

### § 11 — Final CTA
- Full dark panel (`#1a1714`), page close
- Large headline: **"Ready to move fast on your next TI?"** — Cormorant 300
- Outlined button: "Get in touch →" → `mailto:info@nyase.com`
- NYA logomark centered below button (small, white)
- Minimal footer: © Nabih Youssef & Associates · nyase.com

---

## Animation System

| Element | Tool | Behavior |
|---|---|---|
| Smooth scroll | Lenis | Applied globally, wraps entire page |
| Scroll-pinned sections | GSAP ScrollTrigger | §01 hero parallax, §03 trust statement pin, §05 horizontal gallery |
| Counter animations | GSAP | §04 stats — fire once on viewport enter |
| Bar chart fills | GSAP | §07 — width animates from 0 to value |
| Word/text reveals | GSAP SplitText | §01 headline reveal |
| Component entrances | Framer Motion `useInView` | All other section fade-ups, staggered cards |
| Page transitions | Framer Motion | Section cross-fades where background flips dark↔light |

---

## Tech Stack

```
Framework:     Vite + React 18
Animation:     Framer Motion 11 + GSAP 3 (ScrollTrigger, SplitText)
Smooth scroll: Lenis
Fonts:         Google Fonts (Cormorant Garamond) + Inter (system/CDN)
Charts:        Custom SVG/div bars via GSAP (no chart library needed)
Deploy:        Static build — any CDN (Netlify, Vercel, or direct)
```

---

## File Structure

```
TIPage/
├── src/
│   ├── main.jsx              # Lenis init, app entry
│   ├── App.jsx               # Root, section composition
│   ├── components/
│   │   ├── Hero.jsx
│   │   ├── IntroNarrative.jsx
│   │   ├── TrustStatement.jsx
│   │   ├── StatsStrip.jsx
│   │   ├── ImageGallery.jsx  # reused for §05 and §10
│   │   ├── MidCTA.jsx
│   │   ├── Charts.jsx
│   │   ├── Offerings.jsx
│   │   ├── Testimonials.jsx
│   │   └── FinalCTA.jsx
│   ├── hooks/
│   │   └── useLenis.js       # Lenis smooth scroll hook
│   ├── styles/
│   │   ├── globals.css       # tokens, reset, base
│   │   └── tokens.css        # color + type variables
│   └── assets/
│       └── images/           # placeholder images
├── assets/                   # source docs (task.md, PDFs, logos)
│   └── PHOTO-SWAP-GUIDE.md   # generated alongside code
├── public/
│   └── logo.png              # NYA logomark
└── docs/
    └── superpowers/specs/    # this file
```

---

## Content Placeholders

All placeholder content is clearly marked with `[PLACEHOLDER]` comments in code and labeled in the swap guide. Items to replace before launch:

| Placeholder | Location | What to provide |
|---|---|---|
| `XX+` | §04 Stats | Total TI projects completed |
| `YY+` | §04 Stats | Years in TI practice |
| `ZZ` | §04 Stats | LEED certified project count |
| `WW+ sq ft` | §04 Stats | Total sq ft across TI projects |
| `~X weeks` | §07 Charts | Avg permit turnaround |
| Project photos (8 slots) | §05, §10 | See `PHOTO-SWAP-GUIDE.md` |
| Testimonial quotes (2–3) | §09 | Client name, firm, quote |
| Project type % breakdown | §07 Charts | Office/Media/Retail/Other split |

---

## Analytics

**Tool: Plausible Analytics** (recommended over GA4)
- Lightweight 1KB script, no cookie banner, no GDPR consent required
- Self-serve dashboard at plausible.io — simple, no data sold to ad networks
- Fits the clean/premium brand positioning (no bloated tracking)

**Events to track:**

| Event | Trigger |
|---|---|
| `pageview` | Automatic on load |
| `cta_mid_click` | §06 mid-page "Get in touch" button click |
| `cta_final_click` | §11 final CTA button click |
| `gallery_scroll` | User scrolls horizontal gallery §05 past 50% |
| `section_view_{n}` | Each section enters viewport (§01–§11) — measures scroll depth |
| `offering_hover` | Hover on any §08 offering card |

**Implementation:** Plausible script tag in `index.html` + `plausible()` custom event calls at each tracked interaction. Requires creating a free/paid account at plausible.io and adding `ti.nyase.com` as a site.

---

## Out of Scope

- Backend / form handling (mailto only)
- Multi-page routing
- CMS integration
- Mobile-specific breakpoints beyond responsive CSS (mobile layout is simplified, not bespoke)
