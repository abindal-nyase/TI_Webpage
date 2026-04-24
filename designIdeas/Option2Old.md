# NYA Tenant Improvement — Option 2 Page Brief

**Route:** `tenantimprovements.nyase.com/Option2`

**Framework:** Astro (existing project)

**Animation Stack:** GSAP + ScrollTrigger (already installed)

**Status:** Pre-build planning document — do not begin implementation until assets in §6 are resolved

---

## 1. Concept Overview

A single-page scrollytelling experience that takes the visitor on a spatial journey — from the Los Angeles skyline, into a specific high-rise, and then through the types of structural TI work NYA performs inside it. The page closes with a context-sensitive CTA that adapts to three distinct audiences: Architects, Owners, and Property Managers.

The core thesis of the page: **NYA already knows your building. We move fast. You can trust us.**

---

## 2. Page Architecture — Five Acts

### Act 1 — Hero: The Skyline

**Scroll behavior:** Static until user begins scrolling. Zoom animation is scroll-driven via GSAP ScrollTrigger `scrub`.

**Visual:** Full-viewport image of the LA skyline (wide shot already available). As the user scrolls, the camera progressively zooms into **550 S Hope Street, Los Angeles** at the center of the frame.

**Headline (overlay, fades out as zoom begins):**

> Tenant Improvement.
>
> In the buildings that matter.

**Implementation approach:**

* Use a CSS `transform: scale()` driven by ScrollTrigger `scrub: true` on the skyline image
* The image must be high-resolution enough to zoom to ~3–4× without visible pixelation
* The target building (550 S Hope St) must be visually centered in the wide shot, or the image must be cropped/repositioned so it is — confirm this before proceeding
* Fade the headline out at ~20% scroll progress using a separate `opacity` tween on the same timeline

**⚠️ Pitfall — Missing asset:** The close-up / drone image of 550 S Hope St does not yet exist. Act 1 can zoom in on the wide shot, but the transition into Act 2 will feel incomplete without a second image showing the building clearly isolated. **This is the #1 blocker. See §6.**

---

### Act 2 — "You've Probably Seen Our Work"

**Scroll behavior:** Zoom completes → building image snaps to left half of screen → map panel slides in from the right.

**Visual:** A dark, minimal map of Los Angeles (Mapbox GL JS or Leaflet with a dark tile style) showing dot markers for every building address where NYA has performed TI work.

**Interaction:**

* Hovering a dot reveals: Building name, neighborhood, and type of work performed
* The 550 S Hope St dot is pre-highlighted / pulsing on load
* A counter animates up: *"We've worked in X buildings across Los Angeles"*

**Copy overlay:**

> We may already know your building.

**Implementation approach:**

* Mapbox GL JS embedded in an Astro island (`client:load`)
* Address data lives in a local JSON or CSV file — structured as `{ name, address, lat, lng, workType }`
* Dark map style: use `mapbox://styles/mapbox/dark-v11` or equivalent
* Dot markers: custom HTML markers with a pulse ring animation (CSS keyframes)
* No backend required — all data is static

**⚠️ Pitfall — Data preparation:** Someone needs to compile the address list before this component can be built. Format needed: `name`, `lat`, `lng`, `workType` (one of: Stair, Lobby, Partition, Slab Opening, Slab Infill, Other). This is a manual task — pull from project records.

**⚠️ Pitfall — Mapbox token:** Mapbox requires a public token. Store in Astro's `.env` as `PUBLIC_MAPBOX_TOKEN`. Do not hardcode.

---

### Act 3 — The Building + Hotspots

**Scroll behavior:** Map fades out → building image (550 S Hope St) moves from left to center → hotspot markers appear with a staggered entrance.

**Visual:** The building image with 5–6 circular hotspot markers overlaid at specific positions on the facade/floor plan.

**Hotspot labels (map to NYA service types):**

| Hotspot | Label              | Maps to                                      |
| ------- | ------------------ | -------------------------------------------- |
| 1       | Stair Addition     | Complex stair design in occupied towers      |
| 2       | Lobby Renovation   | Seamless structure for creative rebrands     |
| 3       | Slab Opening       | Load transfer in constrained grids           |
| 4       | Slab Infill        | Retrofit strategies, avoiding upgrades       |
| 5       | Partition Systems  | Lightning-fast partition and ceiling support |
| 6       | Connection Details | Anchors, edge-of-slab, hidden supports       |

**Interaction (click/tap a hotspot):**

* Selected hotspot expands into a panel (slides in from right or overlays)
* Panel contains: project photo, one-line stat (e.g.  *"Delivered in 6 days"* ), 2–3 sentence description
* Panel has a close button / clicking elsewhere collapses it
* Only one hotspot open at a time

**Implementation approach:**

* Hotspot positions are hardcoded as `top`/`left` percentages relative to the building image container
* GSAP `gsap.from()` with `stagger` for entrance animation of hotspot markers
* Panel open/close: GSAP `gsap.to()` with `xPercent`, `opacity`, and `pointerEvents`
* Building image must have known dimensions so hotspot coordinates are stable across viewports — use `aspect-ratio` CSS and position hotspots in percentage terms

**⚠️ Pitfall — Hotspot positioning is brittle on mobile.** Percentage-based positioning works on desktop but can misalign on small screens if the image reflows. Either lock the image to a fixed aspect ratio container, or provide a simplified mobile layout where hotspots appear as a vertical list instead.

**⚠️ Pitfall — No project photos yet.** Each hotspot panel needs one real project photo. Placeholder images will make the page feel unfinished. Confirm which photos are available before building the panel content.

---

### Act 4 — Audience CTA Switcher

**Scroll behavior:** Hotspot section fades out → CTA section pins briefly → user selects their role.

**Visual:** Three large toggle buttons, one for each audience. Selecting one updates the headline, subtext, and button label below.

| Audience         | Headline                           | Subtext                                                                          | Button                     |
| ---------------- | ---------------------------------- | -------------------------------------------------------------------------------- | -------------------------- |
| Architect        | We're on speed dial.               | Fast turn, clean drawings, no hand-holding needed. When you say go, we move.     | Let's work together        |
| Owner            | We may already know your building. | Familiarity with your structure means less risk, less rework, and faster starts. | Check our building history |
| Property Manager | Your reputation is safe with us.   | We've built trust with managers across downtown LA. We know what's at stake.     | Get in touch               |

**Implementation approach:**

* Three `<button>` elements with ARIA roles for accessibility
* State managed with a simple JS variable (no framework state needed in Astro unless using a React island)
* Headline/subtext swap: GSAP `gsap.to()` with `opacity: 0` → content swap → `opacity: 1`
* The "Check our building history" button for Owners should scroll back up to the map in Act 2

**⚠️ Pitfall — Default state:** The page must default to one audience selection on load. Default to **Architect** since that is the most frequent initiator (~40% of projects per strategy notes).

---

### Act 5 — Final CTA

**Visual:** Clean, minimal. Dark background, single large heading, two contact options only.

**Copy:**

> TI projects don't wait.
>
> Neither do we.

Contact options:

* Phone number (click-to-call on mobile)
* Email address

**No contact form.** The entire page has built urgency — a multi-field form breaks the momentum. Direct contact only.

**Implementation approach:**

* Simple Astro component, no animation library needed
* Entrance animation: `gsap.from()` triggered by ScrollTrigger `once: true`

---

## 3. Astro Project Structure

```
src/
  pages/
    Option2.astro              ← Main page entry point
  components/
    ti-option2/
      HeroZoom.astro           ← Act 1: Skyline + scroll-zoom
      BuildingMap.astro        ← Act 2: Mapbox address map (client:load)
      HotspotPanel.astro       ← Act 3: Building image + hotspots
      AudienceSwitcher.astro   ← Act 4: Role-based CTA toggle
      FinalCTA.astro           ← Act 5: Contact close
  data/
    ti-buildings.json          ← Address list for the map (to be populated)
    ti-hotspots.json           ← Hotspot metadata: label, position, photo path, stat, copy
  assets/
    option2/
      skyline-wide.jpg         ← ✅ Available
      550-s-hope-exterior.jpg  ← ❌ NOT YET AVAILABLE — see §6
      hotspot-photos/
        stair.jpg              ← ❌ Needed
        lobby.jpg              ← ❌ Needed
        slab-opening.jpg       ← ❌ Needed
        slab-infill.jpg        ← ❌ Needed
        partition.jpg          ← ❌ Needed
        connections.jpg        ← ❌ Needed
```

---

## 4. GSAP ScrollTrigger Configuration Notes

Register plugins at the top of each component script that uses them:

```js
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);
```

**Scroll-zoom (Act 1):**

```js
gsap.to('.skyline-img', {
  scale: 3.5,               // Adjust based on image resolution
  transformOrigin: '52% 45%', // Center on 550 S Hope St — tune manually
  ease: 'none',
  scrollTrigger: {
    trigger: '.hero-section',
    start: 'top top',
    end: 'bottom top',
    scrub: 1,
    pin: true,
  }
});
```

**⚠️ Pitfall — `transformOrigin` must be tuned manually** once you know the exact pixel position of 550 S Hope St in the wide shot. Start with browser devtools open and adjust until the zoom lands on the correct building.

**Staggered hotspot entrance (Act 3):**

```js
gsap.from('.hotspot-marker', {
  scale: 0,
  opacity: 0,
  duration: 0.4,
  stagger: 0.12,
  ease: 'back.out(1.7)',
  scrollTrigger: {
    trigger: '.hotspot-section',
    start: 'top 60%',
    once: true,
  }
});
```

---

## 5. Mapbox Setup Checklist

* [ ] Create Mapbox account and generate a public token
* [ ] Add `PUBLIC_MAPBOX_TOKEN=pk.xxx` to `.env` and `.env.example`
* [ ] Install: `npm install mapbox-gl`
* [ ] Import CSS in the Astro component: `import 'mapbox-gl/dist/mapbox-gl.css'`
* [ ] Use `client:load` directive on the map component so it renders client-side only
* [ ] Set map style to `mapbox://styles/mapbox/dark-v11`
* [ ] Initial center: `[-118.2551, 34.0505]` (downtown LA), zoom: `13`
* [ ] 550 S Hope St coordinates: `[-118.2572, 34.0502]` — pre-highlight this marker

---

## 6. Blocked Assets — Must Resolve Before Build

These are hard blockers. Building without them means placeholder content that will need to be reworked.

| Asset                                              | Status                               | Resolution path                                                                                                                                                                                                                                 |
| -------------------------------------------------- | ------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **550 S Hope St — close-up exterior photo** | ❌ Not available                     | Option A: Commission drone/aerial photographer (~$300–600 one-time). Option B: Use Google Street View / Google Earth screenshot as temporary placeholder — clearly mark as temp. Option C: Use a stylized 3D render (slower, more expensive). |
| **Hotspot project photos (×6)**             | ❌ Not confirmed                     | Pull from existing NYA project archive. Need one good photo per work type. Can use renderings or construction photos — does not need to be 550 S Hope St specifically.                                                                         |
| **Building address list**                    | ❌ Not compiled                      | Manual task: export from project management system. Need name, address, lat/lng, work type for each building.                                                                                                                                   |
| **Building position in wide shot**           | ✅ Answerable once image is reviewed | Open the skyline image, identify 550 S Hope St visually, note approximate `x%/y%`position — this drives `transformOrigin`in the GSAP zoom.                                                                                                 |

---

## 7. Mobile Considerations

| Section            | Desktop                          | Mobile fallback                                                    |
| ------------------ | -------------------------------- | ------------------------------------------------------------------ |
| Act 1 — Hero zoom | Scroll-driven zoom               | Same — ensure image is tall enough for portrait viewports         |
| Act 2 — Map       | Split: building left / map right | Map goes full-width, building image hidden                         |
| Act 3 — Hotspots  | Image with overlaid markers      | Vertical scrollable list of hotspot cards instead of image overlay |
| Act 4 — Switcher  | Three horizontal toggle buttons  | Stacked buttons                                                    |
| Act 5 — CTA       | Centered                         | Centered                                                           |

---

## 8. Performance Checklist

* [ ] Skyline image: export as `.webp`, max 2400px wide, compress to <500KB
* [ ] 550 S Hope St image: export as `.webp`, max 1600px wide
* [ ] Hotspot photos: max 800×600, `.webp`
* [ ] Mapbox: lazy-load — only initialise when Act 2 enters the viewport (use `IntersectionObserver` or ScrollTrigger callback)
* [ ] GSAP: import only what is used — do not import the full bundle if tree-shaking is available
* [ ] Test on mobile (real device, not just devtools) — ScrollTrigger `scrub` can feel laggy on low-end Android

---

## 9. Open Questions Before Starting

1. **Is 550 S Hope St centered (or near-center) in the available wide skyline shot?** If not, the zoom won't land naturally and the image composition needs to change.
2. **Do we have any project history at 550 S Hope St specifically?** The authenticity of the concept depends on this being a real building NYA has worked in. If not, choose a building from the address list that *is* centered in the shot.
3. **What is the target launch date for Option2?** This affects whether we wait for drone photography or use a placeholder.
4. **Does the Astro project already have GSAP installed?** If coming from the hospital.nyase.com codebase, it should — confirm before adding dependencies.
5. **Mapbox or Leaflet?** Mapbox is more polished but requires an account and token. Leaflet with CartoDB dark tiles is free and easier to set up — acceptable for a draft.

---

*Brief prepared: based on strategy session notes (6/5/25) and design review. Revisit §6 asset status before any implementation begins.*
