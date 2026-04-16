# TI Page Content Expansion — Design Spec
**Date:** 2026-04-16  
**Source:** `assets/TI Strategy Call.pdf`  
**Scope:** Option A — surgical additions to capture all strategy call content on site

---

## Problem

The strategy call surfaced content that isn't reflected on the live page:
1. What TI work actually is (connections, stakes, detail-level risk)
2. Each audience's real decision criteria (internal knowledge, needs outward translation)
3. "The Invisible Details" as a distinct service specialty
4. "Partners, Advisory, Service" as self-positioning language

The FinalCTA also duplicates audience-specific language that belongs earlier in the page flow.

---

## Changes

### 1. IntroNarrative — "What Makes TI Hard"

**Type:** New component (restoring deleted section)  
**Placement:** Between Hero and TrustStatement  
**Purpose:** Educate visitor on what TI work actually is before any selling begins. Demonstrates NYA understands the work at a deeper level than competitors. Sets up the Offerings section with authority.

**Content:**
- TI is detail-driven, not primary structure
- "All about connections" — anchors, edge-of-slab, hidden supports
- Stakes: "if you don't get the smallest detail level you'll be in trouble because there's nothing below you to finish that work"
- Triggers: stairs and partitions bring structural engineers onto TI projects

**Pull quote (bold/accent):**
> "The devil isn't in the structure. It's in the connections."

**Visual:** Editorial text block, centered or two-column. Monochromatic, no imagery needed. Matches existing aesthetic.

**File:** `src/components/IntroNarrative/IntroNarrative.jsx` + `IntroNarrative.module.css`

---

### 2. Offerings — 5th Panel: "The Invisible Details"

**Type:** Data addition + label update  
**File:** `src/data/projects.js` — append `o5` to `offerings` array  
**Component:** `src/components/Offerings/Offerings.jsx` — update "04" → "05" label

**Panel data:**
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
}
```

**Placement:** Last panel — "secret weapon" framing. After reading all 5, client understands why NYA is different at the detail level.

---

### 3. AudienceCards — New Section

**Type:** New component  
**Placement:** After StatsStrip, before Offerings  
**Purpose:** Each of the 3 audiences gets their own moment. Reflects their real decision criteria back at them, then shows NYA's answer. Replaces the audience-specific paragraphs in FinalCTA (which moves to FinalCTA cleanup below).

**Section label:** "Who We Work With"

**Card structure (per card):**
- Audience eyebrow label
- Their priority (translated from internal strategy language to outward copy)
- NYA's answer — bold, one punchy line

**Three cards:**

| Audience | Priority | NYA Answer |
|----------|----------|------------|
| Architect | Speed and responsiveness. You need someone on-call, fast turnaround, ready at kickoff. | "We pick up. Every time." |
| Building Owner | Familiarity and relationship. You want the engineer who already knows your building — no transition cost, no rework. | "We've probably already been in your building." |
| Property Manager | Zero margin for error. Your reputation is on the line if this goes wrong. | "We're the safe hands your team will thank you for." |

**Visual:** Horizontal 3-column grid (desktop), stacked (mobile). Clean card with eyebrow, priority text in neutral tone, NYA answer in accent/bold. Consistent with monochromatic system.

**Files:** `src/components/AudienceCards/AudienceCards.jsx` + `AudienceCards.module.css`

---

### 4. FinalCTA — Remove Audience Paragraphs

**Type:** Copy edit  
**File:** `src/components/FinalCTA/FinalCTA.jsx`

**Remove** the three audience-specific `<br />`-separated lines:
> "If you're an architect juggling a demanding client..."  
> "If you're a building owner looking to retain tenants..."  
> "If you're a property manager with zero margin for error..."

**Replace** with universal close only:
> "Bring us your tight timelines, your tangled gridlines, your last-minute stair. We'll bring the clarity, commitment, and structural know-how to get it done right."

Result: FinalCTA is a cleaner, more confident close. Audience moment happens earlier (AudienceCards) where it's useful for decision-making, not repeated at the end.

---

### 5. Hero Label — "Partners · Advisory · Service"

**Type:** Copy edit  
**File:** `src/components/Hero/Hero.jsx`

**Current:**
```jsx
Nabih Youssef &amp; Associates · Structural Engineering
```

**Updated:**
```jsx
Nabih Youssef &amp; Associates · Partners · Advisory · Service
```

Signals the positioning shift the strategy call explicitly called for. No other copy changes needed — ScrollyNarrative 4 pillars already express Partners/Advisory/Service ethos in action.

---

## Page Order (post-changes)

| # | Section | Status |
|---|---------|--------|
| 1 | Hero | Modified (label) |
| 2 | IntroNarrative ("What Makes TI Hard") | New |
| 3 | TrustStatement | Unchanged |
| 4 | MasonryGallery | Unchanged |
| 5 | MidCTA | Unchanged |
| 6 | StatsStrip | Unchanged |
| 7 | AudienceCards | New |
| 8 | Offerings (5 panels) | Modified (o5 added) |
| 9 | TestimonialsService | Unchanged |
| 10 | Testimonials | Unchanged |
| 11 | ProjectGallery | Unchanged |
| 12 | FinalCTA | Modified (audience lines removed) |

---

## Out of Scope

- Peer review offering for owners (no clear page home; better as a separate service page)
- Small architects as explicit audience segment (folded into Architect card implicitly)
- Recommendation network / "same tribe" narrative (lives in testimonials organically)
- ScrollyNarrative rewrite (4 pillars stay — covered in Option B, not A)
