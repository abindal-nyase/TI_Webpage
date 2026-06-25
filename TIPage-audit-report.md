# NYA Tenant Improvement Microsite — Design & Responsive Audit

**Page:** `/` (option3 — Hero → TIDifferences → FirmCulture → TrustWall → ClientCare → Ethos → Footer)
**Date:** 2026-06-25
**Method:** Live capture at `localhost:4321` via Playwright. Swept desktop, tablet, mobile, landscape, and large-monitor widths at multiple scroll depths and device-scale factors. Lenses: taste-skill, frontend-design, refactoring-ui principles (page is Astro + plain CSS + GSAP/Lenis, so design *principles* applied, not React/Tailwind specifics).

**Viewports tested:** 360×780, 390×844, 430×932, 844×390 (landscape), 768×1024, 834×1112, 1024×768, 1280×800, 1440×900, 1920×1080, 2560×1440. Browser zoom approximated via effective-width tests + deviceScaleFactor 1–3.

---

## Severity summary

| # | Issue | Severity | Scope |
|---|-------|----------|-------|
| 1 | Ethos (Nabih quote + portrait) pushed off reachable scroll on first load | 🔴 High | Desktop, intermittent |
| 2 | ClientCare body copy unreadable over photos | 🔴 High | All widths, worst on mobile |
| 3 | Disc tower visual appears absent on narrow mobile | 🟠 Medium-High | Mobile ≤430 — needs confirm |
| 4 | No conversion path until footer (~17000px down) | 🟡 Medium | All |
| 5 | Accent-color split (cyan vs coral/green) | 🟡 Medium | All — judgment call |
| 6 | Theme switcher bar ships on the live page | 🟡 Medium | All |
| 7 | Two visible em-dashes | 🟢 Low | 2 strings |
| 8 | Hairline-under-every-row lists | 🟢 Low | TIDifferences |
| 9 | Footer resource labels wrap at ~768–834 | 🟢 Low | Tablet |
| 10 | Ultrawide (≥2560) reads sparse in dark sections | 🟢 Low | ≥2560 |

---

## 🔴 1. Ethos section pushed off the reachable page on first load

**What happens:** On a fresh load, scrolling straight from top to bottom, the Ethos section (Nabih Youssef portrait + the "I treat every tenant improvement like a home-cooked meal…" quote) never enters the viewport. Only the bottom sliver of the portrait peeks above the footer. Measuring the quote element at max scroll puts it ~6000px **below** the reachable scroll range.

**The nuance that sets severity:** After a forced ScrollTrigger refresh (resize, or a scroll-to-bottom-then-top that recomputes pin spacers), Ethos renders correctly at **every** width tested — 1280, 1920, 2560, plus tablet and mobile. So the markup and reveal animation are fine. This is a **pin-spacer / measurement-timing bug**, not a static layout error.

**Root cause (likely):** The page stacks GSAP-pinned sections (Hero, ClientCare). ClientCare pins its stage with `end: '+=' + window.innerHeight * (L * SPEED)`, so its pin-spacer height is derived from `window.innerHeight` measured at build time. If that spacer is computed before fonts/hero images settle (or before a refresh), the downstream sections — Ethos especially — get displaced. Ethos compounds it with a rigid box:

```css
/* 05_O3_Ethos.module.css */
.inner {
  height: 62vh;        /* crops the bleeding portrait at the chest */
  overflow: hidden;
}
.photo { height: 165%; float: right; }
```

The `≤834px` path sets `.inner { height: auto; overflow: visible; }` and drops the photo — which is exactly why tablet/mobile never exhibited the worst of it.

**Why it matters:** This is the firm's founder's voice — likely the emotional centerpiece — and a first-time visitor scrolling straight down can miss it entirely.

**Fix direction:** Ensure pin spacers recompute after `document.fonts.ready` and after hero images load (`ScrollTrigger.refresh()`); the project's own CLAUDE.md already prescribes `invalidateOnRefresh: true` and gating ScrollTrigger creation on `document.fonts.ready`. Verify ClientCare and Hero both honor it. Separately, reconsider Ethos's fixed `62vh` + `overflow:hidden` on desktop so the quote can't be clipped if measurements shift.

---

## 🔴 2. ClientCare body copy unreadable over photos

**What happens:** The ClientCare panels ("A true client advocate", "Genuine care for the client and the building", "Quality that is trusted", "Pricing that is reliable") render small mid-gray paragraph text directly over busy, high-key photographs (people applauding, a bright conference room). Body copy fails WCAG AA contrast and is hard to read at every width.

**Responsive angle:** Worst on mobile (390/360), where the text column is narrow, the photo fills the frame, and the gray-on-photo paragraph is barely legible. Landscape phone has the same problem. Desktop is marginally better only because the text sits on darker regions of the image by luck, not by design.

**Fix direction:** Add a contrast scrim (e.g. a dark gradient overlay behind the text band) or move copy onto a solid/blurred panel. Verify 4.5:1 against the *brightest* area of each photo, not the average.

---

## 🟠 3. Disc tower visual appears absent on narrow mobile

**What happens:** On 360 and 390, the "The Risk" / "The Solution" sections showed an **empty dark gap** where the red/green collapsing-disc tower sits on desktop and landscape. Captured frames showed the eyebrow, title, and "EXPOSED/RESOLVED RISK 0/7" label with no disc between them.

**Caveat:** Both mobile captures landed on the `0/7` (pre-scrub) state, so this may be a not-yet-animated frame rather than a missing element. Landscape (844×390) renders the disc tower correctly, so the component *can* render at small heights.

**Action:** Confirm on a real device whether the disc tower is visible and legible on portrait phones mid-scroll, or whether it's clipped/suppressed at narrow widths. If suppressed, the mobile section loses its main visual.

---

## 🟡 4. No conversion path until the footer

The hero is brand-only ("TENANT IMPROVEMENTS", no subhead, no CTA). The first and only call-to-action ("Send Us an Email") lives in the footer, roughly 17000px down. The narrative scrollytelling justifies a quiet hero, but a visitor who doesn't scroll the entire story has no way to act. Consider one mid-page contact affordance, or a persistent CTA in the SideNav.

## 🟡 5. Accent-color split breaks the single-accent lock

Global accent is cyan (charcoal-cyan scheme). TIDifferences runs coral/red ("COMMON PROBLEMS / The Risk") then green ("The Solution"). Red-as-problem / green-as-solution is legitimately *motivated* storytelling. But the coral eyebrow reading against cyan elsewhere is a deliberate exception to "one accent per page" — confirm it's intentional, not drift, and that it's the only place accents diverge.

## 🟡 6. Theme switcher bar ships on the live page

The auto-hide top bar (Color / Font swatches) is a dev/demo affordance. The page is `noindex`, suggesting a showcase build — but if this is client-facing, a runtime theme switcher reads as unfinished. On ≤640 the scheme names hide and only swatches remain (by design), but the bar is still present on phones. Confirm intent for production.

## 🟢 7. Two visible em-dashes

taste-skill bans em-dashes outright; they're also a common AI tell. Two user-visible instances (all others are code comments):

- `src/components/ti-option3/04_O3_ClientCare/04_O3_ClientCare.jsx:21` — `"How NYA treats tenant improvement work — and the clients behind it."`
- `src/components/ti-option3/05_O3_Ethos/05_O3_Ethos.jsx:65` — `— Nabih Youssef`

Replace with a hyphen or restructure (`work, and the clients…`; ` - Nabih Youssef`).

## 🟢 8. Hairline-under-every-row lists

The TIDifferences problem/solution list underlines every row. refactoring-ui / taste-skill flag border-per-row as the lazy spec-sheet pattern. Minor; the numbered cards mostly carry it.

## 🟢 9. Footer resource labels wrap at ~768–834

At the 768–834 band the 4-column footer tightens and "Selected TI Projects", "Corporate Complexes", "Commercial Spaces" wrap to two lines. Cosmetic. Collapses cleanly to a single column below ~640.

## 🟢 10. Ultrawide reads sparse

At ≥2560 the dark TIDifferences section leaves its right half empty with content small in the left column. Asymmetric-by-design, but on very large monitors it reads as a lot of dead space. Low priority.

---

## Responsive matrix (observed)

| Section | Mobile 360–430 | Landscape 844×390 | Tablet 768–1024 | Desktop 1280–1920 | Ultrawide 2560 |
|---|---|---|---|---|---|
| Hero | ✅ fits, scales | ✅ | ✅ | ✅ | ✅ |
| TIDifferences intro | ✅ | ✅ | ✅ | ✅ | ⚠️ sparse |
| Disc tower | ⚠️ verify (empty frames) | ✅ | ✅ | ✅ | ✅ |
| FirmCulture (word cloud + NYA) | ✅ | ✅ | ✅ | ✅ | ✅ |
| TrustWall (logo wall) | ✅ | ✅ | ✅ | ✅ | ✅ |
| ClientCare | 🔴 contrast | 🔴 contrast | 🔴 contrast | 🔴 contrast | 🔴 contrast |
| Ethos | ✅ (photo dropped) | ✅ | ✅ | 🔴 off-page on first load | ✅ after refresh |
| Footer | ✅ 1-col | ✅ | ✅ (minor wrap) | ✅ | ✅ |

✅ acceptable · ⚠️ verify · 🔴 issue

---

## Zoom / window-resize notes

- **Browser zoom** behaves like a narrower effective viewport, so the width tests above cover it. Zooming a 1280 window to ~200% lands near 640px — which crosses three breakpoints (640 theme bar, 768 ClientCare, 834 Ethos) cleanly with no catastrophic break in the static captures.
- **The sensitive moment is a live resize**, because that triggers ScrollTrigger to recompute pin spacers. That recompute is exactly what *fixes* the Ethos issue in testing — but it also means any pinned-section measurement that isn't gated on fonts/images can shift layout on the first resize. Worth a manual resize-while-scrolled pass on Hero, ClientCare, and Ethos.
- **Landscape phone** compresses total scroll height (~9100px vs ~17000 portrait) because pin distances are `innerHeight`-based. Everything still reachable; no orientation-specific break beyond the shared ClientCare contrast issue.

---

## Top priorities (UI / responsive)

1. **#1 Ethos off-page on first load** — gate pinned-section ScrollTrigger setup on `document.fonts.ready` + image load, force a `ScrollTrigger.refresh()`, and relax Ethos's desktop `62vh`/`overflow:hidden`.
2. **#2 ClientCare contrast** — add a scrim behind body copy; verify against the brightest photo regions, mobile first.
3. **#3 Confirm the disc tower on portrait phones.**

---

# Part 2 — Narrative & Persuasion Audit

**Audience:** Architects, building owners, and contractors evaluating NYA for a tenant-improvement project. **Critical context:** most already have a structural engineer on retainer. **Goal:** NYA becomes their primary contact. That means the page must do more than describe NYA — it must manufacture dissatisfaction with "generic" engineering, prove NYA is materially safer/faster/cheaper, give a low-risk way to try them, and make first contact effortless. Persuading someone to *switch or add* an incumbent is a much higher bar than introducing a firm to a greenfield buyer.

## The scroll as an argument

| Beat | Section | Rhetorical job | Does it land? |
|---|---|---|---|
| 1 | Hero — "Tenant Improvements" + building render | Category / brand | Neutral. Clean but says nothing yet. |
| 2 | Intro — "When structure is treated as a second thought, the whole project pays." | Thesis / stakes | ✅ Strong hook. Creates worry, earns the scroll. |
| 3 | TIDifferences — The Risk (7 problems) → The Solution (7 fixes) | Differentiation | ✅ **The money section.** TI-specific, real pain. |
| 4 | FirmCulture — word cloud → "Care, Trust, and Serious Work. NYA" | Identity / values | ⚠️ Pretty but hollow. Self-applied adjectives = assertion, not proof. |
| 5 | TrustWall — "In good company." + logo wall | Social proof | ✅ Credible with this exact audience. But arrives late. |
| 6 | ClientCare — Care / Reliability / Experience / Partnership (11 points) | Deep value props | ✅ On-target, but ⚠️ long and repetitive. |
| 7 | Ethos — Nabih's founder quote | Emotional close / humanize | ✅ Memorable — **if it renders (see Part 1 #1).** |
| 8 | Footer — "Always Within Reach" / Send Us an Email | Convert | ⚠️ Soft, slow, anticlimactic. |

## What works (keep)

- **The Risk → Solution device is the strongest thing on the page.** Naming "Generic structural advice," "one-size-fits-all assumptions," details "copied from habit" subtly frames the *incumbent* engineer as a commodity — without naming them. That is exactly the wedge a displacement play needs.
- **The pain taxonomy is real and TI-specific:** approvals/plan check, RFIs, change orders, scope creep, field conflicts. Buyers who've run TIs will nod. Naming LA plan-check culture signals genuine local competence.
- **Each persona has a hook in ClientCare:** owners → "predictable total project cost"; architects → "protect that vision," "make it work"; contractors → "same-day responses," "immediate phone consultations for field issues," "constructible." Precise targeting.
- **"Most of our work comes through recommendations"** and the logo wall (CBRE, Hines, Irvine, SOM, RIOS) are the right credibility currency for this audience.

## What a skeptical, already-served buyer feels (the gaps)

### 1. The displacement argument is never made explicit — the biggest strategic gap
The page is written for a buyer with *no* engineer. The audience already has one. Nowhere does it say: *"You may already have a structural engineer. Here's when owners and architects bring NYA in anyway — and why teams make us primary."* Without that beat, the reader's honest reaction is "this is nice, but I already have someone." The whole goal hinges on closing this loop and it is left implicit. **Add an explicit "already have an engineer?" section** that reframes NYA as the upgrade / the second look / the TI specialist, not a like-for-like replacement they must fire someone to hire.

### 2. All tell, no show — no proof
Every claim is an adjective. "Seasoned judgment," "we see challenges coming early," "quality that is trusted" — asserted, never evidenced. Beyond logos, there is **zero hard proof**: no project examples, no metrics, no testimonials with attribution, no before/after. For displacing an incumbent, evidence is *the* lever, and the page pulls adjectives instead. The actual proof ("Selected TI Projects" PDF) is buried in the footer.
- **Add 2–3 real TI case studies** with concrete outcomes (weeks saved, change orders avoided, a complex condition solved, plan-check cleared first pass).
- Use **real, non-fake numbers** (years in practice, count of TI projects, sq ft delivered, jurisdictions). The page correctly avoids *fabricated* precision — but the fix is real figures, not none.

### 3. Visuals are generic, not NYA's work
Isometric stock building + stock applause/boardroom photography. A technical audience evaluating an *engineer* is moved by real project imagery — structural details, existing-condition assessments, the "dramatic stairs and floating floors" the copy itself name-drops. Architects especially buy on portfolio. **Swap stock for real NYA project + team photography.**

### 4. Length and repetition cause fatigue before the close
~17,000px and ~18 persuasion beats (7 risks + 7 solutions + 11 ClientCare points). Several overlap heavily — "Care" bucket, "Design Ambition," and "tailored details" all essentially say *"we understand your specific building."* The argument peaks at the Risk/Solution section, then keeps restating itself. A busy buyer (especially a contractor) skims and tires before reaching the founder quote and CTA. **Merge overlapping points; cut ClientCare from 11 to ~5–6 sharp ones.**

### 5. The word-cloud reads as fluff to this audience
784 adjectives (ACCOUNTABLE, RELIABLE, TRANSPARENT…) is the weakest rhetorical move there is: telling people your virtues. Visually striking, persuasively hollow — and a technical viewer is *allergic* to self-applied adjectives. Either back it with proof or cut it; momentum dips here for the non-technical owner too.

### 6. The CTA is soft and ignores the page's own best hooks
"Always Within Reach / Send Us an Email" is low-urgency and slow. The page already earned two far stronger, lower-risk entry points in its own copy:
- *"Send us your drawings for a free second look"* (reuses the "complex projects come to us for a second look" value prop).
- *"Book a 15-minute feasibility call"* (reuses "early feasibility input" / "same-day responses").
**Use a hook-aligned CTA, and place one mid-page** (right after the Risk/Solution peak) — not only at 17,000px. Right now a reader convinced at the peak must scroll the entire rest of the page to act.

### 7. No "how to start" / engagement model
The page builds desire but offers no on-ramp — no sense of how engaging NYA works, what a first conversation looks like, or a low-commitment first step. For a buyer who'd have to displace or supplement an existing relationship, lowering that first-step risk is exactly what tips the decision.

## Sequencing suggestion

For a skeptical, incumbent-holding buyer, credibility should arrive **earlier** to earn the long scroll. Consider moving the logo wall up to right after the Intro thesis ("real firms like yours already trust us → here's why"), then run Risk/Solution, then the displacement beat, then proof/case studies, then the founder close and a strong CTA.

## Net read

The page is a well-built, emotionally warm **brand story**. As a **sales argument against an incumbent**, it under-delivers on the two things that actually move this audience: **proof** and an **explicit reason to make NYA primary**. The craft is largely there; the missing pieces are evidence, a displacement beat, real project visuals, and a CTA that reuses the page's own strongest hooks.

## Top priorities (narrative)

1. **Add the explicit "you already have an engineer — here's why teams make us primary" beat.** Single biggest gap vs. the stated goal.
2. **Replace adjectives with evidence** — 2–3 real TI case studies + real numbers + real project photos; surface the existing project PDFs.
3. **Stronger, hook-aligned CTA, placed mid-page too** — "free second look" / "15-min feasibility call."
4. **Cut repetition** — merge the overlapping Risk/Solution/ClientCare points; reconsider the word cloud.

*No code changes made — audit only.*
