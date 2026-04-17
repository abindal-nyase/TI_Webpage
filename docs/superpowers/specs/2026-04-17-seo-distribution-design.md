# SEO & Distribution Design Spec
**Date:** 2026-04-17
**Scope:** Option A — Technical SEO foundation + GoDaddy distribution for `tenantimprovements.nyase.com`

---

## Problem

The Astro migration is complete and the site produces a static `dist/` folder. Two things are missing:

1. **Distribution:** No GoDaddy deployment setup. The existing `gh-pages` script targets GitHub Pages with a `/TI_Webpage/` base path, which is wrong for the custom domain.
2. **SEO:** Basic title/description/OG tags exist but the site lacks a sitemap, robots.txt, canonical URL, structured data, and city-targeted keyword signals for Los Angeles and San Francisco.

---

## Distribution

**Host:** GoDaddy shared hosting  
**Domain:** `tenantimprovements.nyase.com`  
**Build output:** `dist/` via `astro build` (static, `base: '/'`)

### Steps
1. Set `site: 'https://tenantimprovements.nyase.com'` in `astro.config.mjs` — required for sitemap and canonical URL generation.
2. Run `npm run build` to produce `dist/`.
3. In GoDaddy cPanel, point the `tenantimprovements` subdomain to a folder (e.g., `public_html/tenantimprovements`).
4. Upload the contents of `dist/` to that folder via cPanel File Manager or FTP.

### Package.json
Add a `build:godaddy` script as a reminder:
```json
"build:godaddy": "astro build"
```
No automated push — GoDaddy shared hosting requires manual upload.

---

## SEO

### Primary targets
- **City 1:** Los Angeles, CA
- **City 2:** San Francisco, CA
- **Additional markets (areaServed only):** Orange County, San Diego, Phoenix, Dallas, Charleston, Hawaii

### 1. Astro Sitemap Integration

Install `@astrojs/sitemap` and register it in `astro.config.mjs`. This auto-generates `/sitemap.xml` at build time using the `site` URL.

```js
// astro.config.mjs
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

### 2. robots.txt

Create `public/robots.txt`:
```
User-agent: *
Allow: /
Sitemap: https://tenantimprovements.nyase.com/sitemap.xml
```

### 3. Head Tags (index.astro)

Replace/add the following in `<head>`:

**Title (LA/SF-targeted):**
```
Tenant Improvement Structural Engineers — Los Angeles & San Francisco | NYA
```

**Meta description:**
```
NYA's structural engineers specialize in tenant improvement projects across Los Angeles and San Francisco — high-rise TI, lobby renovations, fast-turn fit-outs, and signature staircases.
```

**Canonical URL:**
```html
<link rel="canonical" href="https://tenantimprovements.nyase.com/" />
```

**OG url tag (missing from current head):**
```html
<meta property="og:url" content="https://tenantimprovements.nyase.com/" />
```

Update OG and Twitter title/description to match the new values above.

### 4. JSON-LD Structured Data

Add a `<script type="application/ld+json">` block to `<head>`:

```json
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
```

---

## Files Changed

| Action | File | Change |
|--------|------|--------|
| Modify | `astro.config.mjs` | Add `site` field, add `sitemap()` integration |
| Modify | `package.json` | Add `build:godaddy` script, add `@astrojs/sitemap` dependency |
| Create | `public/robots.txt` | Allow all crawlers, point to sitemap |
| Modify | `src/pages/index.astro` | Update title, description, canonical, og:url, og:title, og:description, twitter title/description, add JSON-LD block |

---

## Out of Scope (Option B, future)

- City-specific landing pages (`/los-angeles`, `/san-francisco`, etc.)
- GitHub Actions FTP auto-deploy workflow
- Google Search Console setup (manual post-deploy step)
