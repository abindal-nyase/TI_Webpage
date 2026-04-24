# NYA Structural Engineering

## Required Visuals — Asset Production Guide

*Organized by Act, Priority, and Production Method*

---

## How to Use This Document

Each visual is listed with:

- **What it is** — the asset type and its role in the site
- **Where it appears** — which act and position
- **How to produce it** — AI tools, SVG, photography, or stock
- **Generation brief** — the exact direction to use when generating
- **Accept / Reject criteria** — what makes an asset usable or not

Assets are ordered by production priority. Start with Act 4 scenes — they are the longest lead-time items and the hardest to replace.

---

## Priority 1 — Act 4 Motion Sequence (Core Differentiator)

All six scenes must share one visual language before any single scene is generated. Establish the style with Scene 1, get it right, then use that approved frame as the style reference for all subsequent generations.

---

### Visual 4.1 — Scene 1: The Blank Floor Plate

**Role:** Opening frame of the motion sequence. Establishes the visual language for all scenes that follow.

**Format:** Still image or short looping clip (3–5 seconds), 1920×1080px minimum, dark background

**Generation brief:**

> Orthographic plan drawing of a generic high-rise floor plate. Dark background (#141616 or close). Thin cool-white structural grid lines, column grid dots, perimeter edge lines. No furniture. No fill colors. No labels except minimal dimensional annotations in a light monospace type. The aesthetic is a hand-drafted construction document — precise, minimal, technical. The linework should feel like it was drawn by an engineer, not rendered by a computer. No photorealism. No 3D perspective. No shadows. No glow effects.

**Accept:** The image reads as a plan drawing. The background is dark. The lines are thin and precise. The overall feeling is architectural and restrained.

**Reject:** Any image that looks like a real estate rendering, a 3D model screenshot, a BIM export, a sci-fi interface, or a generic technology visualization.

**Notes:** This is the style-reference asset. Do not proceed to Scenes 2–6 until this frame is approved.

---

### Visual 4.2 — Scene 2: Reading the Slab

**Role:** Structural annotations appear over the floor plate, revealing what an engineer sees that others don't.

**Format:** Still image or short clip (3–5 seconds), 1920×1080px minimum

**Generation brief:**

> Same floor plate as Scene 1. Add: thin annotation lines pointing to slab regions with minimal labels (SLAB THK, REBAR, EDGE COND.). Add a partial rebar pattern overlay in a slightly warmer tone — fine grid of lines, not photorealistic. Add one or two existing slab openings as clean rectangular cutouts in the floor plate. All new elements should feel like they are appearing progressively, as if being drawn in real time. The overall feeling is a trained eye discovering information in an existing document. Still orthographic. Still dark field.

**Accept:** The frame feels like a construction document being annotated. New information is readable without cluttering the base drawing. The two information layers (base plate, annotations) are visually distinct.

**Reject:** Any photorealistic concrete texture. Any 3D perspective. Any element that looks decorative rather than technical.

---

### Visual 4.3 — Scene 3: The Stair Opening

**Role:** The moment a new opening is cut — the most technically specific and visually rich scene.

**Format:** Still image or short clip (3–5 seconds), 1920×1080px minimum

**Generation brief:**

> The floor plate from Scene 1. A new rectangular opening has been cut — clean, geometrically precise, defined by a heavier line weight than the surrounding grid. Around the opening: visible load path lines radiating outward in cool accent color (#9BB9C4), thin and precise. Around the opening edge: a reinforcement detail begins to materialize — a simplified version of an actual slab edge reinforcement, drawn in construction-document style. One small warm accent highlight (#B4A08B) on the key connection point. The feeling is: structural logic becoming visible in response to a design decision. Still orthographic plan view. Still dark field.

**Accept:** The opening reads immediately as a deliberate structural intervention. The load path lines feel like engineering information, not decorative rays. The reinforcement detail is legible.

**Reject:** Any image where the opening looks like a dramatic visual effect rather than an engineered condition. Any glow, bloom, or light-emission effect. Any perspective view.

**Notes:** If actual slab edge reinforcement details from NYA's drawing set can be redrawn as SVG, use them as reference images in the generation prompt for maximum authenticity.

---

### Visual 4.4 — Scene 4: The Connection Detail

**Role:** Zoom to a single connection — the most technically specific frame. Highest opportunity to use actual NYA detail drawings.

**Format:** Still image, 1920×1080px minimum. This scene works best as a static or very slow reveal rather than a fast clip.

**Generation brief:**

> Close-up orthographic section or elevation drawing of a structural connection — a stair stringer connecting to an existing beam, or a new moment connection at a slab edge. The detail should be drawn in the style of a construction document: clean linework, dimension strings, material call-outs in minimal monospace type. The drawing appears to be building itself — some lines complete, some still being drawn (represented by dashed or faded lines that are lighter than the complete elements). Dark background. Cool linework. Warm accent on the primary connection point. The feeling is: expertise made visible through precision.

**Accept:** The detail looks like something from an actual engineering drawing set. The level of specificity feels authentic, not generic. A structural engineer would recognize the drawing conventions.

**Reject:** Any image that looks like a generic technical illustration or a stock-art schematic. Any image where the connection type is unrecognizable or implausible.

**Notes:** This is the highest-value scene for using redrawn SVG source material. If NYA detail drawings are available, redraw one at 1920×1080 in SVG format and use it directly — it will be more authentic than any AI-generated version.

**SVG redrawing brief (if applicable):**

> Take the source detail drawing and redraw as clean SVG on a dark background (#141616). Use stroke color #8CB0BE for primary linework at 0.75px stroke weight. Use stroke color #B4A08B for the primary connection highlight at 1px stroke weight. Use fill #AFBEB9 for dimension text and call-out labels at 10–11px monospace. Remove all title blocks, borders, and sheet information. The output should be the detail alone, centered on the dark field, with generous margin.

---

### Visual 4.5 — Scene 5: The Lobby Transformation

**Role:** Pull back to reveal a larger intervention — structural linework and architectural intent together.

**Format:** Still image or short clip (3–5 seconds), 1920×1080px minimum

**Generation brief:**

> Axonometric or plan drawing of a high-rise lobby renovation. Structural elements drawn in cool linework (#8CB0BE) — columns, transfer beams, slab edges, stair structure. Architectural elements drawn in a slightly warmer, lighter linework — wall outlines, ceiling planes, material boundaries. The two systems overlap but are visually distinguishable by line weight and color. A new monumental stair is visible as the central element, its structure explicitly shown. The overall feeling is: structure and design working together, neither subordinate to the other. Dark background. No fills. No textures. Construction-document aesthetic.

**Accept:** The structural and architectural systems are visually distinguishable. The stair reads as the primary element. The drawing has the quality of an early design development document — specific enough to be real, open enough to feel conceptual.

**Reject:** Any rendered or photorealistic image. Any perspective rendering. Any image that looks like a completed interior design visualization.

---

### Visual 4.6 — Scene 6: The Resolved Condition

**Role:** Pull back to reveal the building, then the skyline. Structure disappears back into the built environment.

**Format:** Still image or very short clip (3–5 seconds), 1920×1080px minimum

**Generation brief:**

> A minimal line drawing of a Downtown LA high-rise building — elevation or three-quarter axonometric view. The building is drawn in thin cool linework on a dark background. At the base or mid-section: a subtle indication of the lobby renovation and stair from Scene 5, barely visible, integrated. The skyline of Downtown LA appears as a faint line in the background — multiple towers, very low contrast, almost disappearing into the dark field. The feeling is: the work is complete. The structure is invisible. The city continues. Calm, resolved, architectural.

**Accept:** The building reads as a specific high-rise (not a generic tower). The skyline reads immediately as Downtown LA. The overall frame feels like a conclusion — quiet and resolved.

**Reject:** Any image with dramatic lighting, sunrise/sunset color, or cinematic atmosphere. Any image that looks like a developer's marketing render. Any image where the structural detail from Scene 5 is still prominently visible (it should be nearly invisible — integrated).

---

## Priority 2 — Act 1 Hero Image

### Visual 1.1 — Downtown LA Sunset Hero

**Role:** Full-viewport opening image. Sets the emotional register for the entire site. Already confirmed as available (`HeroImage.jpeg`) — evaluate against these criteria before proceeding.

**Evaluation criteria for existing hero image:**

- Does the image contain warm orange and deep blue tones that align with the established color system?
- Is there sufficient dark area at the top and bottom for headline overlay?
- Is the image high enough resolution to zoom to approximately 2× without visible pixelation at 2400px width?
- Does the image feel aspirational rather than generic? Does it look like Downtown LA specifically, or could it be any city?

**If sourcing a new image:**

*Stock photo brief:*

> Downtown Los Angeles skyline at dusk or golden hour. Shot from an elevated position looking across the city — not from street level. Warm orange and amber tones in the lower third transitioning to deep blue in the upper third. Multiple recognizable high-rise towers visible. No people, no traffic, no contemporary signage in the foreground. The emotional register: ambition, scale, potential. The feeling of a city working.

*Preferred sources:* Getty Images, Shutterstock (licensed for web use). Search terms: "Downtown Los Angeles aerial dusk," "LA skyline sunset high-rise," "Los Angeles financial district golden hour."

**Export spec:** `.webp` format, 2400px wide, compressed to under 500KB.

---

## Priority 3 — Act 2 Map Assets

### Visual 2.1 — Project Location Data

**Role:** Input data for the Mapbox dot map. Not a visual asset — a data asset — but required before the map component can be built.

**Format:** JSON file — `projects.json`

**Required fields per record:**

```json
{
  "name": "Building name",
  "address": "Full street address",
  "lat": 34.0505,
  "lng": -118.2551,
  "workType": "Stair | Lobby | Partition | Slab Opening | Slab Infill | Other",
  "neighborhood": "Downtown | Koreatown | Century City | etc."
}
```

**Source:** NYA project records. This is a manual compilation task. Do not estimate, approximate, or fabricate entries. The accuracy of the map is a credibility signal — a building that appears on the map but where NYA did not work would be a meaningful error.

**Notes:** The project count derived from this list becomes the number used in the animated counter. Do not use a rounded number. Use the exact count.

### Visual 2.2 — Map Dot Style

**Role:** Custom marker design for the Mapbox project dots.

**Spec:** CSS-animated HTML marker

- Dot: 8px circle, fill `#B4A08B` (warm accent)
- Pulse ring: 16px circle, stroke `#9BB9C4` (cool accent), animated expand and fade on loop, 2s duration
- Hover state: dot scales to 12px, tooltip appears with building name and work type in monospace type

---

## Priority 4 — Act 4 Supporting SVG Assets

### Visual 4.7 — Structural Detail Drawings (SVG Redraws)

**Role:** Source material for Scene 4 and supplementary detail overlays throughout Act 4.

**What to redraw:** Select two to three connection details from NYA's existing drawing set that represent the most visually interesting and technically specific conditions. Good candidates: stair-to-slab connections, slab edge reinforcement at openings, moment connections at existing beams.

**SVG redrawing spec:**

- Canvas: 1920×1080px viewBox
- Background: transparent (will be composited onto dark page background)
- Primary linework: stroke `#8CB0BE`, stroke-width `0.75`
- Highlighted connection: stroke `#B4A08B`, stroke-width `1.25`
- Dimension strings: stroke `#585049`, stroke-width `0.5`
- Text labels: fill `#AFBEB9`, font monospace, 10–12px
- No fills on structural shapes — linework only
- Remove all title blocks, revision clouds, and sheet borders from source drawings

**Tools:** Illustrator, Inkscape, or any SVG editor. AI-assisted tracing of scanned drawings is acceptable if the output is clean and the linework reads as precise.

---

## Priority 5 — Typography and System Assets

### Visual 5.1 — Display Typeface

**Role:** All headline and display text across the site.

**Recommended options:**

- Canela (Commercial Type) — editorial, architectural, precisely drawn serifs
- Domaine Display (Klim Type Foundry) — refined, high-contrast, works at large scale
- Freight Display (GarageFonts) — warm but precise, works well at 96–120px

**Licensing:** All three require commercial web font licenses. Confirm licensing before launch.

**Fallback:** If licensing is not possible before launch, use a Google Fonts alternative — Playfair Display is the closest available option without licensing cost, though it lacks the refinement of the above.

**Cormorant Garamond** (Google Fonts) is the strongest free option in this category. It has genuine typographic refinement — high contrast, delicate serifs, and an editorial quality that holds up at 96–120px. The Garamond heritage gives it architectural credibility without feeling academic. Use the Display or Infant cuts for maximum expressiveness at large sizes.

**DM Serif Display** (Google Fonts) is a closer match to Domaine Display's personality — clean, confident, modern proportions with classical serif structure. Less delicate than Cormorant, which makes it slightly more readable at smaller display sizes and more stable on dark backgrounds.

**Playfair Display** (Google Fonts) is the most widely known free serif in this category and remains genuinely good. It is listed in the current document as the existing fallback recommendation, and that assessment stands — it lacks the refinement of the licensed options but is a competent choice for a first release.

### Visual 5.2 — Body / UI Typeface

**Role:** All body copy, labels, navigation, and UI elements.

**Recommended options:**

- Suisse Int'l (Swiss Typefaces) — clean, architectural, precise
- Neue Haas Grotesk (Monotype) — the original grotesque, authority without personality
- GT America (Grilli Type) — modern grotesque, highly legible at small sizes

**Fallback:** IBM Plex Sans (free, Google Fonts). Acceptable quality for a first release.

**IBM Plex Sans** (Google Fonts) is the strongest free grotesque for this project specifically. It has a technical, engineered character that aligns with the construction-document aesthetic — slightly more mechanical than humanist grotesques, which suits the NYA brand. It also pairs naturally with IBM Plex Mono, creating a unified typographic system from a single family.

**Inter** (Google Fonts) is the most neutral and reliable free grotesque available. It is heavily used in digital products, which cuts against the goal of feeling distinct, but its legibility at small sizes and across screen types is difficult to beat. Use only if differentiation is less important than cross-device reliability.

**Work Sans** (Google Fonts) is an underused option that sits between a geometric and grotesque grotesque — slightly more personality than Inter, slightly less cold than IBM Plex Sans. Works well at both body and label sizes and is rarely seen on engineering or architecture sites, which gives it some distinctiveness by default.

### Visual 5.3 — Monospace Typeface

**Role:** Annotation labels, construction-document-style callouts, counter numerals.

**Recommended:** IBM Plex Mono (free, Google Fonts). The monospace character reinforces the technical and engineering-document aesthetic without requiring additional licensing.

---

## Priority 6 — Optional Enhancement Assets

### Visual 6.1 — Ambient Sound Design (Optional)

**Role:** Subtle audio layer for the Act 4 motion sequence. Opt-in, never autoplay with sound.

**Production brief:** A 60-second ambient audio loop composed from:

- Low-frequency building hum (structural resonance)
- Sparse metallic tones suggesting steel connection
- Processed construction site ambient (concrete, machinery, distant work) — abstracted to near-musical texture
- Overall dynamic: very quiet, under -20dB average, fades in and out with scroll position

**Tools:** Suno, Udio, or Adobe Firefly Audio for initial generation. Process with a light reverb and high-pass filter to remove anything below 80Hz. Export as `.mp3` and `.ogg` for browser compatibility.

**Accept:** The audio adds depth without distracting. A visitor who notices it feels that the site is more immersive. A visitor who doesn't notice it is unaffected.

**Reject:** Any audio that is recognizable as music, that has a melody, or that calls attention to itself.

### Visual 6.2 — Supplementary Project Photography (Optional)

**Role:** If NYA has existing site photography from past Downtown LA high-rise TI projects, this can supplement the motion sequence or appear in a secondary gallery section.

**Evaluation criteria for existing photography:**

- Does the image show actual structural work in progress — not finished interiors?
- Is the image technically well-exposed and in focus?
- Does the image show something specific — a connection condition, an opening in progress, a stair under construction — rather than a generic construction site?

**If no existing photography is available:** Do not commission a shoot for version one. The scroll-driven AI image sequence is a stronger primary asset than quickly-produced site photography. Photography can be added in version two once the site concept is proven.

---

## Asset Status Tracker

| ID  | Asset                           | Priority | Status               | Production Method          | Notes                        |
| --- | ------------------------------- | -------- | -------------------- | -------------------------- | ---------------------------- |
| 4.1 | Scene 1 — Floor plate          | P1       | ❌ Not started       | AI image generation        | Style reference — do first  |
| 4.2 | Scene 2 — Reading the slab     | P1       | ❌ Not started       | AI image generation        | Requires 4.1 approved        |
| 4.3 | Scene 3 — Stair opening        | P1       | ❌ Not started       | AI image generation        | Requires 4.1 approved        |
| 4.4 | Scene 4 — Connection detail    | P1       | ❌ Not started       | SVG redraw or AI           | Highest value for SVG source |
| 4.5 | Scene 5 — Lobby transformation | P1       | ❌ Not started       | AI image generation        | Requires 4.1 approved        |
| 4.6 | Scene 6 — Resolved condition   | P1       | ❌ Not started       | AI image generation        | Requires 4.1 approved        |
| 1.1 | Hero image                      | P2       | ⚠️ Review existing | Evaluate HeroImage.jpeg    | Export as .webp if approved  |
| 2.1 | Project location data           | P2       | ❌ Not compiled      | Manual — project records  | Build blocker for Act 2      |
| 2.2 | Map dot style                   | P2       | ❌ Not started       | CSS/code                   | Depends on 2.1               |
| 4.7 | Detail drawing SVGs             | P3       | ❌ Not started       | SVG redraw from source     | Select 2–3 drawings         |
| 5.1 | Display typeface                | P4       | ❌ Not licensed      | License or select fallback | Confirm before build         |
| 5.2 | Body typeface                   | P4       | ❌ Not licensed      | License or select fallback | IBM Plex Sans as fallback    |
| 5.3 | Monospace typeface              | P4       | ✅ Available         | IBM Plex Mono (Google)     | Free, no licensing needed    |
| 6.1 | Ambient sound                   | P5       | ❌ Not started       | AI audio generation        | Optional for v1              |
| 6.2 | Site photography                | P5       | ⚠️ Check archive   | Evaluate existing photos   | Do not commission for v1     |

---

## Generation Prompt — Master Style Reference

Use this prompt as the foundation for all AI image generation in Act 4. Append scene-specific details from each scene brief above.

```
Architectural engineering drawing. Dark background, near-black (#141616). 
Thin precise linework in cool blue-white (#9BB9C4 to #8CB0BE range). 
Orthographic projection — plan view or elevation, not perspective. 
Construction document aesthetic — the visual language of a structural engineering 
drawing set. No photorealism. No 3D rendering. No shadows or ambient occlusion. 
No glow effects. No decorative elements. Sparse monospace annotations where labels 
appear. The image should feel like it was drawn by an engineer, not generated by 
a computer. Premium, minimal, precise.
```

**Negative prompt (use in tools that support it):**

```
photorealistic, 3D render, perspective view, real estate marketing, 
cinematic lighting, lens flare, bloom, glow, neon, technology interface, 
sci-fi, futuristic, generic, stock photo, BIM screenshot, Revit export
```

---

*Document version 1.0 — Asset guide for NYA TI website, derived from refined creative vision*
