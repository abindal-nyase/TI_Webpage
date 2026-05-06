# NYA Tenant Improvement Page — Figma File Blueprint

_Source context: attached layout sheet “NYA Tenant Improvement Page / Website Layout.”_

---

## 00 — File Setup

**Figma file name:**  
`NYA / Tenant Improvement Page / Website Experience`

**Canvas pages:**

1. `00 Cover`
2. `01 Foundations`
3. `02 Components`
4. `03 Sections`
5. `04 Page Wireframe`
6. `05 Prototype Notes`
7. `06 Dev Notes`

---

# 00 Cover

## Frame: Cover / 1440

**Title:**  
NYA Tenant Improvement Page

**Subtitle:**  
A premium website experience built around structural clarity, value protection, and NYA’s culture of care.

**Page Flow:**

1. Hero section  
2. Negative/problem scenarios that can happen in TIs  
3. Problem-solution framing  
4. Company culture/founder values  
5. Connect that culture directly to how NYA handles TIs  

---

# 01 Foundations

## Color Styles

| Style Name | Hex | Use |
|---|---:|---|
| Primary / Navy | `#0B1F3B` | Authority, footer, dark CTA, structural tone |
| Primary / Light Navy | `#1E3A5F` | Secondary dark surfaces |
| Accent / Blue | `#2F80ED` | CTA, links, structural overlays |
| Accent / Blue Hover | `#1C6ED5` | Button hover |
| Neutral / Black | `#111111` | Primary headings |
| Neutral / Gray 900 | `#1A1A1A` | Body dark |
| Neutral / Gray 700 | `#4F4F4F` | Paragraph text |
| Neutral / Gray 500 | `#828282` | Notes, meta text |
| Neutral / Gray 300 | `#E0E0E0` | Borders |
| Neutral / Gray 100 | `#F7F8FA` | Light backgrounds |
| Neutral / White | `#FFFFFF` | Main background |
| Success / Value | `#27AE60` | Value emphasis only if needed |

---

## Typography

**Font:** Inter or nearest NYA website font.

| Style Name | Size / Line | Weight | Use |
|---|---:|---:|---|
| H1 / Hero | 64 / 72 | SemiBold | Hero headline |
| H2 / Section | 44 / 52 | SemiBold | Section headlines |
| H3 / Card | 20 / 28 | Medium | Card titles |
| Body / Large | 18 / 28 | Regular | Hero and section intros |
| Body / Default | 16 / 26 | Regular | Standard text |
| Label / Small | 14 / 22 | Medium | Notes, captions |
| Caps / Eyebrow | 12 / 16 | Bold, 8% letter spacing | Section labels |

---

## Layout Grid

**Desktop frame:** 1440px  
**Main container:** 1200px  
**Columns:** 12  
**Gutter:** 32px  
**Margins:** 120px each side  
**Section vertical padding:** 120px top / 120px bottom  
**Mobile section padding:** 64px top / 64px bottom  

---

# 02 Components

## Component: Button / Primary

**Auto Layout:** Horizontal  
**Height:** 56px  
**Padding:** 0px 32px  
**Radius:** 8px  
**Fill:** Accent / Blue  
**Text:** White, 16px / 20px, Medium  

**States:**
- Default
- Hover: `#1C6ED5`, Y -2px, shadow
- Disabled: Gray 300 fill, Gray 500 text

---

## Component: Button / Secondary

**Height:** 56px  
**Padding:** 0px 32px  
**Radius:** 8px  
**Fill:** Transparent  
**Stroke:** Navy 20%  
**Text:** Navy  

---

## Component: Label / Eyebrow

**Auto Layout:** Horizontal  
**Gap:** 10px  
**Elements:**
- 28px horizontal line
- Caps label text

**Color:** Accent / Blue

---

## Component: Card / Feature

**Auto Layout:** Vertical  
**Padding:** 32px  
**Gap:** 16px  
**Radius:** 16px  
**Fill:** White  
**Stroke:** Gray 300  
**Hover:** Y -6px, soft shadow, Accent Blue 32% border

**Content:**
- Icon block 48x48
- Title
- Description

---

## Component: Process / Step

**Auto Layout:** Vertical  
**Padding:** 28px 18px  
**Gap:** 14px  
**Alignment:** Center  
**Radius:** 16px  
**Fill:** White  
**Stroke:** Gray 300  

**Content:**
- Number circle: 64x64
- Step title
- Step description

---

## Component: Visual / Glass Card

**Auto Layout:** Vertical  
**Padding:** 22px 24px  
**Gap:** 6px  
**Radius:** 20px  
**Fill:** White 88%  
**Blur:** Background blur 16px  
**Shadow:** 0, 20, 40, 14%

---

# 03 Sections

---

## Section 01 — Hero / X-Ray Building

### Section Purpose

Reframe tenant improvements as more than surface-level renovations. The hero should communicate that NYA understands the hidden structure, constraints, and possibilities inside an existing building.

### Recommended Final Hero Direction

Use the “X-Ray Vision of the Building” concept instead of the value counter. The value counter can feel too direct. The x-ray overlay feels more premium, architectural, and specific to structural engineering.

### Frame

**Name:** `Section / Hero / X-Ray`  
**Size:** 1440 x 760  
**Background:** White to light gray gradient  
**Container:** 1200px  
**Layout:** 2 columns  
- Left: 45%  
- Right: 55%  
**Gap:** 64px  
**Vertical alignment:** Center  

### Left Column

**Eyebrow:**  
Tenant Improvement

**H1 Option A:**  
Most engineers see the space. We see how the building actually works.

**H1 Option B:**  
Before anything is built, we understand what already exists.

**Subheading:**  
Tenant improvements succeed when the existing building is understood, not assumed. NYA brings clarity to structure, constraints, and possibilities before decisions become costly.

**Primary CTA:**  
Start Planning Your TI Project

**Support Note:**  
Structural clarity before costly decisions.

### Right Visual

**Visual container:**  
- Radius: 28px  
- Shadow: 0 30 60 rgba(0,0,0,0.16)  
- Image: premium lobby / office interior  

**Overlay:**  
- Subtle blue structural wireframe  
- Columns, beams, diagonals, connection nodes  
- Color: `rgba(85,170,255,0.9)`  
- Blend mode: Screen  
- Animation: opacity pulse 35% to 95%

**Glass card copy:**  
**We look beneath the finish.**  
Structure, constraints, load paths, and hidden conditions are studied early so the design can move forward with confidence.

---

## Section 02 — Immersive Value Creation / Imaginary Lobby

### Section Purpose

Turn the idea of “tenant improvements create value” into an interactive scroll story.

### Frame

**Name:** `Section / Immersive / Imaginary Lobby`  
**Height:** 200vh prototype section  
**Sticky frame:** 100vh  
**Background:** Navy to near-black gradient  

### Visual Concept

As the user scrolls:
1. Empty lobby appears
2. Ghostly blue structural lines appear
3. Stairs appear
4. LED wall appears
5. Coffee area appears
6. Finished lobby moment appears

### Overlay Copy

**Headline:**  
Every TI is an opportunity to create value.

**Text:**  
From structural constraints to ambitious design moves, the right engineering partner helps transform what is possible into what can be approved and built.

### Interaction Notes

- Use sticky scroll
- Animate opacity and Y position of objects
- Keep the text minimal
- Do not overload with many project examples
- Clickable elements can later connect to case studies such as 550 S Hope St.

---

## Section 03 — The Problem with TIs

### Section Purpose

Explain what is at stake in a tenant improvement and why thoughtful structural guidance creates value.

### Frame

**Name:** `Section / Problem / Split`  
**Background:** Gray 100  
**Layout:** 2 columns  
**Gap:** 72px  

### Left Column

**Eyebrow:**  
The Problem with TIs

**H2:**  
What Looks Simple Can Become Complicated Quickly

**Intro:**  
Tenant improvements can carry hidden structural consequences that are easy to underestimate at the start of a project.

### Problem Clusters

Use short cards instead of a long bullet list.

#### Problem Card 01 — Hidden Structural Risk
Early decisions can be made without enough structural clarity, leading to avoidable complications later.

#### Problem Card 02 — Generic Engineering Assumptions
When the existing building is treated like a template, details may not reflect how the building actually works.

#### Problem Card 03 — RFIs, Rework, and Delays
Unclear drawings and details that miss actual conditions can create field conflicts during construction.

#### Problem Card 04 — Cost Drift
Low upfront fees can turn into surprise add services when scope and existing conditions are not understood early.

#### Problem Card 05 — Design Vision Compromise
Innovative design ideas can lose their impact if the structural solution is not technically strong enough to support them.

#### Problem Card 06 — Slower Plan Check
If drawings do not anticipate city expectations, review can become slower and more unpredictable.

### Right Visual Options

#### Option A — Clock to Money
A clock appears in the lobby, drops into frame, cracks, and chips away into money particles.

#### Option B — Hourglass
The clock transitions into a sand clock. As the user scrolls, sand falls faster to represent schedule loss.

### CTA / Link

Explore Our TI Approach

---

## Section 04 — Problem-Solution Framing

### Section Purpose

Create relief and show what a well-run TI process feels like.

### Frame

**Name:** `Section / Process / Horizontal Steps`  
**Background:** White  
**Layout:** Centered heading + 5-step process  

### Heading

What Doing Tenant Improvements Right Looks Like

### Intro

A well-run TI project starts with understanding the building, identifying constraints early, tailoring details to actual conditions, and keeping communication clear from design through construction. Done right, the process feels more predictable, better coordinated, and easier to move forward.

### Process Flow

1. **Understand the Building**  
   Study the existing building on its own terms.

2. **Identify Issues Early**  
   Clarify constraints before decisions become expensive.

3. **Tailor the Details**  
   Shape details around actual field conditions.

4. **Coordinate Clearly**  
   Keep the structural team, architect, contractor, and owner aligned.

5. **Move With Confidence**  
   Support review, approval, and construction with fewer surprises.

### Visual Options

- Clock coming back together
- Sand moving upward
- Building pieces assembling with each message

### CTA / Transition

See NYA’s TI Approach

---

## Section 05 — Who We Are at NYA

### Section Purpose

Explain the character of NYA, not just the capability. This section should make the firm feel human, trusted, experienced, and serious about service.

### Frame

**Name:** `Section / Who We Are / Legacy Split`  
**Background:** Gray 100  
**Layout:** Image left, copy right  
**Gap:** 72px  

### Visual

Warm, human image of NYA engineers in discussion over drawings or walking a site.

Add a subtle legacy element:
- Founder photo
- Old project drawing
- Archival office image
- Historical sketch overlay

### Copy

**Eyebrow:**  
Who We Are at NYA

**H2:**  
A Firm Built on Care, Trust, and Serious Work

**Subheading:**  
NYA’s culture is one of careful listening, deep technical ownership, and respect for the buildings we work in. That culture matters in TI work, where small assumptions can become costly problems. By taking the time to understand existing conditions, ask the right questions early, communicate clearly, and protect the architect’s vision, NYA helps clients move through TI projects with greater confidence, fewer surprises, and a clearer path to approval and construction.

**CTA:**  
Meet the Team Behind the Work

---

## Section 06 — NYA Culture Ensures TIs Are Done Right

### Section Purpose

Connect NYA’s TI process to the firm’s deeper culture of care, responsibility, and client trust.

### Frame

**Name:** `Section / Culture / Grid`  
**Background:** White  
**Layout:** Centered heading + 3x3 card grid  
**Gap:** 32px  

### Heading

A Culture Built to Take Every Project Seriously

### Intro

At NYA, tenant improvement work is treated as a responsibility: to understand the building, protect the priorities behind the project, communicate clearly, and do the work with care. That mindset began with our founder and continues in the way our teams serve clients today.

---

## Culture Cards

### Card 01 — Client Advocacy

**Short line:**  
We protect your priorities.

**Body:**  
NYA takes client care seriously. We listen closely, understand what matters most to the owner, architect, or project team, and work to protect those priorities. Our goal is not just to complete the structural scope, but to support clients, keep them informed, and make sure their needs are looked after.

---

### Card 02 — Care for the Client and the Building

**Short line:**  
We do not treat your building like a generic structure.

**Body:**  
Generic structural advice can miss what makes an existing building unique. NYA takes the time to understand the inner workings of your building: its structural system, existing conditions, load paths, constraints, and hidden complexities.

---

### Card 03 — Technical Judgment That Earns Confidence

**Short line:**  
We bring review-ready structural thinking.

**Body:**  
NYA is trusted to peer-review complex TI designs, verify calculations, check code compliance, and prepare summary reports. That role reflects the level of technical judgment clients and project teams trust us to bring.

---

### Card 04 — Make-It-Work Mindset

**Short line:**  
We protect the design vision.

**Body:**  
Architects bring the creative ambition to TI work: unusual stairs, open lobbies, new partitions, technology walls, floating floors, and adaptive reuse concepts. NYA translates that ambition into structural solutions that are coordinated, code-conscious, and constructible.

---

### Card 05 — Adaptable Collaboration

**Short line:**  
We adapt to the architect’s process.

**Body:**  
Every architecture firm has its own way of working. NYA calibrates guidance, detail, communication style, and flexibility to match the way that team already works best.

---

### Card 06 — Early Guidance Clients Can Trust

**Short line:**  
We create clarity before decisions become expensive.

**Body:**  
Before a TI project is fully formalized, owners often need enough structural input to understand what is possible and what may create risk. NYA helps teams move forward with practical feasibility input.

---

### Card 07 — Senior Engineer Access

**Short line:**  
You work with seasoned judgment.

**Body:**  
In tenant improvement work, slow communication and too many handoffs can quietly cost time. NYA gives clients direct access to experienced engineers closest to the work.

---

### Card 08 — Details Shaped With Care

**Short line:**  
We tailor details instead of copying from habit.

**Body:**  
Existing buildings rarely behave like clean templates. Years of prior modifications, hidden as-built discrepancies, and on-site adaptations mean the real condition is always particular. NYA tailors details to reduce field conflicts and construction-phase surprises.

---

### Card 09 — Communication That Reduces Pressure

**Short line:**  
We intercept small gaps before they become delays.

**Body:**  
Delays often begin with quiet gaps: an unanswered question, a slow RFI, or an unclear decision owner. NYA responds quickly, picks up the phone when field issues need discussion, and keeps clients informed even when a full answer requires more time.

---

### Card 10 — Reliable Pricing

**Short line:**  
Predictable scope supports predictable cost.

**Body:**  
The goal is not just a lower engineering fee. The goal is a more predictable total project cost. A complete proposal helps clients understand what is included, reduce unexpected fees, and avoid costly surprises later.

---

### Card 11 — Plan Check Experience

**Short line:**  
We know the terrain before the project starts.

**Body:**  
When you begin a TI project with NYA, you start with a team that understands the building, the permitting path, the plan check culture, ownership expectations, and local players involved.

---

# Section 07 — Social Proof

### Section Purpose

Reduce perceived risk and show that NYA is trusted by clients, architects, owners, and property managers.

### Frame

**Name:** `Section / Social Proof / Trust Band`  
**Background:** White  
**Top and bottom border:** Gray 300  

### Heading

Our Quality of Work Is Trusted

### Copy

NYA’s reputation was shaped by long-standing relationships with owners, architects, and property managers who experienced our founder’s warmth, character, and care firsthand. That trust continues today because clients know how we work, how we communicate, and how seriously we take their buildings.

Switching TI engineers can feel risky. Clients want to know that the firm they recommend will protect the building, communicate well, and reflect well on their own judgment. Much of NYA’s work comes through recommendations because clients trust the quality of our work, our reputation for excellence, and the confidence we give those who put our name forward.

### Visual Elements

- Client logo row
- Short testimonial carousel
- Peer-review credibility note
- Project tiles if approved

---

# Section 08 — Final CTA

### Section Purpose

Convert the user after trust, clarity, and differentiation have been established.

### Frame

**Name:** `Section / CTA / Final`  
**Background:** Navy gradient  
**Alignment:** Center  
**Padding:** 130px top / bottom  

### Heading

Work With a Team That Takes TI Seriously

### Text

Bring NYA into the conversation early and give your project a clearer path through design, review, approval, and construction.

### CTA

Start Your TI Conversation

---

# 04 Page Wireframe

## Desktop Page Sequence

1. `Section / Hero / X-Ray`
2. `Section / Immersive / Imaginary Lobby`
3. `Section / Problem / Split`
4. `Section / Process / Horizontal Steps`
5. `Section / Who We Are / Legacy Split`
6. `Section / Culture / Grid`
7. `Section / Social Proof / Trust Band`
8. `Section / CTA / Final`

---

# 05 Prototype Notes

## Hero Prototype

- Structural overlay pulses slowly.
- Optional hover: overlay opacity increases.
- Optional split reveal: slider transitions between finished lobby and x-ray overlay.

## Immersive Lobby Prototype

- Use sticky scroll.
- Animate structural elements in sequence.
- Keep the animation premium and slow.
- Avoid cartoon-like movement.
- End state should feel like a refined completed lobby.

## Problem Prototype

- Clock or hourglass enters from the hero/immersive scene.
- Clock chips into money/time fragments.
- Text cards reveal one by one.

## Solution Prototype

- Reverse the problem animation:
  - Clock repairs itself, or
  - Sand moves upward, or
  - Building assembles in clean steps.

## NYA Culture Prototype

- Cards reveal in staggered order.
- Hover state lightly lifts each card.
- Founder/legacy visual can fade in as user scrolls.

---

# 06 Dev Notes

## Breakpoints

| Breakpoint | Layout |
|---|---|
| 1440+ | Full desktop, 1200px container |
| 1200 | Slightly tighter gaps |
| 980 | Two-column sections stack |
| 640 | One-column mobile, reduce section padding |

---

## Section CSS Tokens

```css
:root {
  --color-primary: #0B1F3B;
  --color-primary-light: #1E3A5F;
  --color-accent: #2F80ED;
  --color-accent-hover: #1C6ED5;
  --color-black: #111111;
  --color-gray-900: #1A1A1A;
  --color-gray-700: #4F4F4F;
  --color-gray-500: #828282;
  --color-gray-300: #E0E0E0;
  --color-gray-100: #F7F8FA;
  --color-white: #FFFFFF;
  --color-value: #27AE60;

  --container: 1200px;
  --section-padding: 120px;
  --radius-sm: 8px;
  --radius-md: 16px;
  --radius-lg: 28px;
}
```

---

## Recommended Build Order

1. Build foundations
2. Build buttons and cards
3. Build section components
4. Assemble the page
5. Add scroll animations
6. Replace placeholder visuals with real NYA-approved assets
7. Connect CTAs
8. QA desktop/tablet/mobile

---

# Designer Notes

## Important Content Decision

Avoid relying on before/after photos unless NYA has matching images from the same angle. The x-ray / structural overlay hero solves this problem elegantly because it communicates NYA’s expertise without depending on perfect photography.

## Strategic Positioning

The page should not simply say “NYA does tenant improvement structural engineering.”  
It should communicate:

- NYA understands the building.
- NYA prevents avoidable issues early.
- NYA protects design vision.
- NYA reduces uncertainty.
- NYA’s culture makes the process better.
- NYA gives clients confidence before expensive decisions are made.

---

# Final Page Message

Tenant improvements are not just changes to a space. They are opportunities to create better places while protecting the building’s long-term potential. NYA makes that possible.
