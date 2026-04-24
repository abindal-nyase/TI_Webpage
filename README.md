# NYA TI Microsite

Marketing microsite for Nabih Youssef Associates (NYA) — Tenant Improvement structural engineering services. Built with Astro + React, deployed to GoDaddy at [tenantimprovements.nyase.com](https://tenantimprovements.nyase.com).

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Astro 5](https://astro.build) (static output) + [React 18](https://react.dev) |
| Animation | [GSAP 3](https://greensock.com/gsap/) + [@gsap/react](https://github.com/greensock/react-gsap) |
| Smooth scroll | [Lenis](https://lenis.darkroom.engineering/) |
| Maps | [Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js/) |
| Data pipeline | Python 3 (geocoding + AI classification) |
| CI/CD | GitHub Actions → GoDaddy SSH/rsync |

---

## Project Structure

```
TI_Webpage/
├── src/
│   ├── pages/                   # Each file = one route
│   │   ├── index.astro          # / — Dev hub (links to all options; retire before launch)
│   │   ├── option1.astro        # /option1 — Current assembled page (production baseline)
│   │   ├── option2.astro        # /option2 — New assembled page (work in progress)
│   │   ├── hero.astro           # /hero — Hero vs HeroZoom side-by-side
│   │   ├── cta.astro            # /cta — MidCTA, FinalCTA, FinalCTAOption2
│   │   ├── audience.astro       # /audience — AudienceCards vs AudienceSwitcher
│   │   ├── stats.astro          # /stats — StatsStrip vs StatsSection
│   │   └── offerings.astro      # /offerings — Offerings (add Option2 when ready)
│   ├── components/              # One folder per section/component
│   │   ├── GlobalSetup/         # Lenis smooth scroll + global GSAP init
│   │   ├── Nav/                 # Top navigation bar
│   │   ├── Hero/                # Full-viewport hero with parallax image
│   │   ├── IntroNarrative/      # Opening text section
│   │   ├── ScrollyNarrative/    # Scroll-triggered storytelling section
│   │   ├── TrustStatement/      # Credibility/trust copy block
│   │   ├── ProjectGallery/      # Filterable project cards
│   │   ├── MidCTA/              # Mid-page call-to-action
│   │   ├── StatsStrip/          # Animated statistics bar
│   │   ├── AudienceCards/       # Cards targeting different client types
│   │   ├── Offerings/           # Service offerings section
│   │   ├── TestimonialsService/ # Testimonials (service-focused)
│   │   ├── Testimonials/        # General client testimonials
│   │   ├── MasonryGallery/      # Masonry photo grid
│   │   ├── FinalCTA/            # Bottom call-to-action
│   │   ├── TIExplorer/          # Interactive Mapbox building explorer
│   │   └── ti-option2/          # Alternative scrollytelling concept (WIP)
│   ├── data/
│   │   ├── projects.js          # Project list for gallery/map
│   │   ├── ti-buildings.json    # Geocoded buildings for TIExplorer map
│   │   └── ti-hotspots.json     # Hotspot overlays for map
│   ├── hooks/
│   │   └── useIsomorphicLayoutEffect.js  # SSR-safe layout effect hook
│   └── index.css                # Global styles
├── public/                      # Static assets served at root
│   ├── Hero.jpg                 # Hero background image
│   ├── nya-logo.png             # NYA logo (white)
│   ├── nya-blue.png             # NYA logo (blue)
│   ├── favicon.svg
│   ├── option2/                 # Assets for ti-option2 concept
│   └── .htaccess                # GoDaddy rewrite rules
├── backend/                     # Python data pipeline (run locally, not deployed)
│   ├── geocode.py               # Geocodes buildings.csv → projects.json via Mapbox
│   ├── project_ti_classifier.py # Classifies BD projects as TI/NOT_TI (+ Claude Haiku)
│   ├── create_map.py            # Generates standalone Leaflet HTML map
│   ├── buildings.csv            # Input: raw building addresses
│   ├── projects.json            # Output: geocoded project data
│   └── .env                     # Backend API keys (not committed)
├── assets/                      # Design assets and reference docs (not deployed)
│   └── logos/                   # Source logo files
├── docs/
│   └── deployment.md            # Full CI/CD and GoDaddy deployment guide
├── astro.config.mjs             # Astro config (GoDaddy/production)
├── astro.config.ghpages.mjs     # Astro config (GitHub Pages, legacy)
├── package.json
└── tsconfig.json
```

---

## Getting Started

### Prerequisites — Install these first

If you are on a fresh machine, install the following tools before cloning the repo.

#### Git

**Windows:** Download and run the installer from [git-scm.com](https://git-scm.com/download/win). Accept the defaults. After install, open a new terminal and verify:
```bash
git --version
```

**macOS:**
```bash
xcode-select --install   # installs Git as part of Xcode CLI tools
git --version
```

---

#### Node.js (v18 or later)

If you already have Node installed, check your version first — if it is v18 or higher you can skip this section:
```bash
node -v
```

If you need to install Node, download the official installer from **[nodejs.org](https://nodejs.org)**. Click the **LTS** button (the left one — it says "Recommended For Most Users") and run the downloaded installer. Accept all defaults.

After install, open a new terminal and verify:
```bash
node -v    # should print v22.x.x or similar
```

---

#### Python (3.10 or later)

Only required if you need to run the backend data pipeline scripts.

**Windows:** Download the installer from [python.org/downloads](https://www.python.org/downloads/). During install, **check "Add Python to PATH"**. Verify:
```bash
python --version
```

**macOS:**
```bash
brew install python   # requires Homebrew: https://brew.sh
python3 --version
```

---

#### Claude Code (optional but recommended)

Claude Code is the AI coding assistant used throughout this project.

**Install (requires Node.js installed above):**
```bash
npm install -g @anthropic-ai/claude-code
```

**Authenticate:**
```bash
claude
```
This opens a browser login flow. Sign in with your Anthropic account or create one at [claude.ai](https://claude.ai).

**Start Claude Code in the project:**
```bash
cd TI_Webpage
claude
```

---

### 1. Clone the repository

```bash
git clone https://github.com/abindal-nyase/TI_Webpage.git
cd TI_Webpage
```

### 2. Install frontend dependencies

```bash
npm install
```

### 3. Configure environment variables

The frontend uses a Mapbox token for the TIExplorer map component. Create a `.env` file in the project root:

```bash
cp .env.example .env   # if the example file exists, otherwise create manually
```

Add the following to `.env`:

```
PUBLIC_MAPBOX_TOKEN=your_mapbox_token_here
```

> The `PUBLIC_` prefix exposes the variable to client-side Astro components.

### 4. Start the development server

```bash
npm run dev
```

Open [http://localhost:4321](http://localhost:4321) in your browser. The server hot-reloads on file changes.

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start local dev server at `localhost:4321` |
| `npm run build` | Build for production → `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run deploy` | Build for GitHub Pages and deploy (legacy) |

---

## Backend / Data Pipeline (optional)

The `backend/` scripts are run locally to refresh the map data — they are not part of the website build.

### Setup

```bash
cd backend
python -m venv .venv

# Windows
.venv\Scripts\activate

# macOS / Linux
source .venv/bin/activate
```

### Install Python dependencies

```bash
# Core geocoding script
pip install requests python-dotenv

# Classifier script (also needs Claude API access)
pip install pandas openpyxl anthropic requests python-dotenv

# Map generator
pip install pandas openpyxl
```

### Configure backend environment variables

Create `backend/.env`:

```
MAPBOX_TOKEN=your_mapbox_token_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here   # only needed for AI classification
```

### Running the scripts

```bash
# Geocode addresses from buildings.csv → projects.json
python geocode.py

# Classify BD tracking spreadsheet as TI/NOT_TI
python project_ti_classifier.py

# Generate standalone Leaflet map (internal preview)
python create_map.py
```

After running `geocode.py`, copy the output `projects.json` to `src/data/` and rebuild the site.

---

## Deployment

Pushes to `main` automatically deploy to [tenantimprovements.nyase.com](https://tenantimprovements.nyase.com) via GitHub Actions + SSH/rsync.

See [`docs/deployment.md`](docs/deployment.md) for the full setup guide including SSH key configuration and GitHub secrets.

---

## Key Conventions

- **Components are self-contained** — each folder in `src/components/` holds the `.jsx` (or `.astro`) file and any component-specific CSS.
- **React components use client-side GSAP** — animations are initialized inside `useGSAP()` hooks with `ScrollTrigger` for scroll-driven effects.
- **`GlobalSetup` must render first** — it initializes Lenis smooth scroll and registers `ScrollTrigger` with GSAP before any animated component mounts.
- **Static output only** — there is no server runtime. All data is baked in at build time from `src/data/`.
