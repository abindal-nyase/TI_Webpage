# SEO & Distribution Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add full SEO foundation (sitemap, robots.txt, canonical URL, JSON-LD structured data, LA/SF-targeted meta tags) and configure the build for GoDaddy deployment at `tenantimprovements.nyase.com`.

**Architecture:** Four targeted file changes. `astro.config.mjs` gains a `site` URL and the `@astrojs/sitemap` integration so the sitemap is generated automatically at build time. `public/robots.txt` is created as a static file that Astro copies verbatim into `dist/`. `src/pages/index.astro` gets updated meta tags, a canonical link, an `og:url` tag, and a JSON-LD `<script>` block for structured data. No new components or abstractions needed.

**Tech Stack:** Astro 5, `@astrojs/sitemap`, JSON-LD (inline script in HTML head)

---

## File Map

| Action | File | Responsibility |
|--------|------|----------------|
| Modify | `astro.config.mjs` | Add `site` URL + `sitemap()` integration |
| Modify | `package.json` | Add `@astrojs/sitemap` dev dependency + `build:godaddy` script |
| Create | `public/robots.txt` | Allow all crawlers, point to sitemap |
| Modify | `src/pages/index.astro` | LA/SF-targeted title + description, canonical, og:url, JSON-LD block |

---

## Task 1: Install `@astrojs/sitemap` and update `astro.config.mjs`

**Files:**
- Modify: `astro.config.mjs`
- Modify: `package.json` (via npm install)

- [ ] **Step 1: Install the sitemap integration**

```bash
npm install @astrojs/sitemap
```

Expected: `@astrojs/sitemap` appears in `package.json` dependencies.

- [ ] **Step 2: Update `astro.config.mjs`**

Replace the entire file with:

```js
import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'

export default defineConfig({
  site: 'https://tenantimprovements.nyase.com',
  integrations: [react(), sitemap()],
  output: 'static',
  base: '/',
})
```

- [ ] **Step 3: Add `build:godaddy` script to `package.json`**

In `package.json`, add to the `scripts` object:

```json
"build:godaddy": "astro build"
```

The full `scripts` block should look like:

```json
"scripts": {
  "dev": "astro dev",
  "build": "astro build",
  "build:godaddy": "astro build",
  "preview": "astro preview",
  "predeploy": "astro build --config astro.config.ghpages.mjs",
  "deploy": "gh-pages -d dist"
}
```

- [ ] **Step 4: Build and verify sitemap is generated**

```bash
npm run build
```

Then check:

```bash
ls dist/sitemap*.xml
```

Expected: `dist/sitemap-index.xml` and/or `dist/sitemap-0.xml` exist.

```bash
cat dist/sitemap-0.xml
```

Expected: Contains `<loc>https://tenantimprovements.nyase.com/</loc>`.

- [ ] **Step 5: Commit**

```bash
git add astro.config.mjs package.json package-lock.json
git commit -m "feat: add @astrojs/sitemap integration and site URL for tenantimprovements.nyase.com"
```

---

## Task 2: Create `public/robots.txt`

**Files:**
- Create: `public/robots.txt`

- [ ] **Step 1: Create the file**

Create `public/robots.txt` with this exact content:

```
User-agent: *
Allow: /
Sitemap: https://tenantimprovements.nyase.com/sitemap-index.xml
```

- [ ] **Step 2: Build and verify robots.txt is in dist**

```bash
npm run build && cat dist/robots.txt
```

Expected output:
```
User-agent: *
Allow: /
Sitemap: https://tenantimprovements.nyase.com/sitemap-index.xml
```

- [ ] **Step 3: Commit**

```bash
git add public/robots.txt
git commit -m "feat: add robots.txt pointing to sitemap"
```

---

## Task 3: Update `src/pages/index.astro` — meta tags, canonical, og:url

**Files:**
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Replace the `<title>` tag**

Find:
```html
<title>Tenant Improvement Engineering — Nabih Youssef &amp; Associates</title>
```

Replace with:
```html
<title>Tenant Improvement Structural Engineers — Los Angeles &amp; San Francisco | NYA</title>
```

- [ ] **Step 2: Replace the `<meta name="description">` tag**

Find:
```html
    <meta
      name="description"
      content="NYA brings speed, precision, and structural expertise to every tenant improvement project. High-rise TI, lobby renovations, signature staircases, and fast-turn fit-outs across California."
    />
```

Replace with:
```html
    <meta
      name="description"
      content="NYA's structural engineers specialize in tenant improvement projects across Los Angeles and San Francisco — high-rise TI, lobby renovations, fast-turn fit-outs, and signature staircases."
    />
```

- [ ] **Step 3: Add canonical link after the `<meta name="description">` tag**

After the description tag, insert:
```html
    <link rel="canonical" href="https://tenantimprovements.nyase.com/" />
```

- [ ] **Step 4: Update Open Graph tags**

Find the Open Graph block:
```html
    <!-- Open Graph -->
    <meta property="og:type" content="website" />
    <meta property="og:title" content="Tenant Improvement Engineering — Nabih Youssef & Associates" />
    <meta
      property="og:description"
      content="NYA brings speed, precision, and structural expertise to every tenant improvement project. High-rise TI, lobby renovations, signature staircases, and fast-turn fit-outs across California."
    />
    <meta property="og:image" content="/Hero.jpg" />
```

Replace with:
```html
    <!-- Open Graph -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://tenantimprovements.nyase.com/" />
    <meta property="og:title" content="Tenant Improvement Structural Engineers — Los Angeles & San Francisco | NYA" />
    <meta
      property="og:description"
      content="NYA's structural engineers specialize in tenant improvement projects across Los Angeles and San Francisco — high-rise TI, lobby renovations, fast-turn fit-outs, and signature staircases."
    />
    <meta property="og:image" content="https://tenantimprovements.nyase.com/Hero.jpg" />
```

- [ ] **Step 5: Update Twitter / X Card tags**

Find:
```html
    <!-- Twitter / X Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="Tenant Improvement Engineering — Nabih Youssef & Associates" />
    <meta
      name="twitter:description"
      content="NYA brings speed, precision, and structural expertise to every tenant improvement project."
    />
    <meta name="twitter:image" content="/Hero.jpg" />
```

Replace with:
```html
    <!-- Twitter / X Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="Tenant Improvement Structural Engineers — Los Angeles & San Francisco | NYA" />
    <meta
      name="twitter:description"
      content="NYA's structural engineers specialize in tenant improvement projects across Los Angeles and San Francisco — high-rise TI, lobby renovations, fast-turn fit-outs, and signature staircases."
    />
    <meta name="twitter:image" content="https://tenantimprovements.nyase.com/Hero.jpg" />
```

- [ ] **Step 6: Build and verify meta tags in dist/index.html**

```bash
npm run build
```

Then verify each tag is present:

```bash
grep -i "Los Angeles" dist/index.html
```
Expected: matches in `<title>`, `<meta name="description">`, `<meta property="og:title">`, `<meta property="og:description">`, `<meta name="twitter:title">`, `<meta name="twitter:description">`.

```bash
grep "canonical" dist/index.html
```
Expected: `<link rel="canonical" href="https://tenantimprovements.nyase.com/">`.

```bash
grep "og:url" dist/index.html
```
Expected: `<meta property="og:url" content="https://tenantimprovements.nyase.com/">`.

- [ ] **Step 7: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: update meta tags for LA/SF SEO targeting and add canonical + og:url"
```

---

## Task 4: Add JSON-LD structured data to `src/pages/index.astro`

**Files:**
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Add JSON-LD block before the closing `</head>` tag**

Find:
```html
    <!-- Google Fonts -->
```

Insert the following block immediately before it:

```html
    <!-- Structured Data -->
    <script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@type": "ProfessionalService",
        "name": "Nabih Youssef & Associates",
        "url": "https://tenantimprovements.nyase.com",
        "description": "Structural engineering firm specializing in tenant improvement projects — high-rise TI, lobby renovations, fast-turn fit-outs, and signature staircases.",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "350 S Grand Ave #1600",
          "addressLocality": "Los Angeles",
          "addressRegion": "CA",
          "postalCode": "90071",
          "addressCountry": "US"
        },
        "areaServed": [
          "Los Angeles, CA",
          "San Francisco, CA",
          "Orange County, CA",
          "San Diego, CA",
          "Phoenix, AZ",
          "Dallas, TX",
          "Charleston, SC",
          "Hawaii"
        ],
        "serviceType": "Tenant Improvement Structural Engineering"
      }
    </script>

```

- [ ] **Step 2: Build and verify JSON-LD is in dist/index.html**

```bash
npm run build && grep -A5 "application/ld+json" dist/index.html
```

Expected: The JSON-LD script block appears in the output with `"@type": "ProfessionalService"`.

- [ ] **Step 3: Validate structured data (manual)**

Copy the JSON-LD block and paste it into Google's Rich Results Test at `https://search.google.com/test/rich-results`. Expected: no errors, `ProfessionalService` entity detected.

- [ ] **Step 4: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: add JSON-LD ProfessionalService structured data for local SEO"
```

---

## Post-Deploy Checklist (manual, after uploading to GoDaddy)

These steps happen after uploading `dist/` to GoDaddy — not part of the code tasks.

- [ ] In GoDaddy cPanel, create subdomain `tenantimprovements` pointing to the upload folder (e.g., `public_html/tenantimprovements`)
- [ ] Upload contents of `dist/` to that folder via File Manager or FTP
- [ ] Visit `https://tenantimprovements.nyase.com/` and verify the page loads
- [ ] Visit `https://tenantimprovements.nyase.com/sitemap-index.xml` and verify it lists the page URL
- [ ] Visit `https://tenantimprovements.nyase.com/robots.txt` and verify it shows the sitemap URL
- [ ] Submit `https://tenantimprovements.nyase.com/sitemap-index.xml` to Google Search Console
