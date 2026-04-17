# Deployment Guide

**Site:** `https://tenantimprovements.nyase.com`
**Host:** GoDaddy shared hosting
**Repo:** GitHub (`main` branch auto-deploys via GitHub Actions)

---

## CI/CD — Automatic Deployment

Every push to `main` triggers a GitHub Actions workflow that builds the site and deploys it to GoDaddy via FTP. No manual steps needed after initial setup.

**Workflow file:** `.github/workflows/deploy.yml`

### One-Time Setup

Add these 3 secrets to the GitHub repo (Settings → Secrets and variables → Actions → New repository secret):

| Secret | Value |
|--------|-------|
| `FTP_SERVER` | GoDaddy FTP hostname (e.g. `ftp.nyase.com`) |
| `FTP_USERNAME` | cPanel FTP username |
| `FTP_PASSWORD` | cPanel FTP password |

Find FTP credentials in GoDaddy cPanel → FTP Accounts.

### GoDaddy Subdomain Setup (one-time)

In GoDaddy cPanel → Subdomains:
- Create subdomain: `tenantimprovements`
- Points to folder: `public_html/tenantimprovements`

---

## Manual Deployment (if needed)

1. Run `npm run build` — produces `dist/`
2. In GoDaddy cPanel → File Manager → navigate to `public_html/tenantimprovements`
3. Upload the **contents** of `dist/` (not the folder itself)

---

## Build Commands

| Command | Purpose |
|---------|---------|
| `npm run build` | Build for GoDaddy (`base: '/'`) |
| `npm run predeploy && npm run deploy` | Build and deploy to GitHub Pages (legacy) |
| `npm run dev` | Local dev server |

---

## Post-Deploy Checklist

- [ ] Visit `https://tenantimprovements.nyase.com/` — page loads correctly
- [ ] Visit `https://tenantimprovements.nyase.com/sitemap-index.xml` — sitemap lists the page URL
- [ ] Visit `https://tenantimprovements.nyase.com/robots.txt` — shows sitemap URL
- [ ] Submit `https://tenantimprovements.nyase.com/sitemap-index.xml` to Google Search Console
- [ ] Validate structured data at Google's Rich Results Test
