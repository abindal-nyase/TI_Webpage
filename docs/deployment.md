# Deployment Guide

**Site:** `https://tenantimprovements.nyase.com`
**Host:** GoDaddy shared hosting (SSH access enabled)
**Repo:** GitHub (`main` branch auto-deploys via GitHub Actions)

---

## CI/CD — Automatic Deployment

Every push to `main` triggers a GitHub Actions workflow that builds the site and deploys it to GoDaddy via SSH/rsync. No manual steps needed after initial setup.

**Workflow file:** `.github/workflows/deploy.yml`

### One-Time Setup

#### Step 1 — Generate SSH key pair

Run this locally (do not set a passphrase — GitHub Actions can't enter one):

```bash
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/godaddy_deploy
```

This creates two files:
- `~/.ssh/godaddy_deploy` — private key (goes to GitHub)
- `~/.ssh/godaddy_deploy.pub` — public key (goes to GoDaddy)

#### Step 2 — Add public key to GoDaddy

1. GoDaddy cPanel → **SSH Access** → **Manage SSH Keys**
2. Click **Import Key**
3. Paste the contents of `~/.ssh/godaddy_deploy.pub`
4. Click **Import** → then **Authorize** the key

#### Step 3 — Find your SSH host

In GoDaddy cPanel, your SSH hostname is shown in the **SSH Access** section — typically something like `yourdomain.com` or a server IP. Port is usually `22`.

#### Step 4 — Add secrets to GitHub repo

Go to repo → Settings → Secrets and variables → Actions → New repository secret:

| Secret | Value |
|--------|-------|
| `SSH_PRIVATE_KEY` | Full contents of `~/.ssh/godaddy_deploy` (private key) |
| `SSH_HOST` | Your GoDaddy SSH hostname (from cPanel SSH Access) |
| `SSH_USER` | Your cPanel username |

---

## Manual Deployment (if needed)

1. Run `npm run build` — produces `dist/`
2. Upload via rsync:
```bash
rsync -avz --delete dist/ <SSH_USER>@<SSH_HOST>:/public_html/tenantimprovements.nyase.com/
```
Or use GoDaddy cPanel → File Manager → navigate to `public_html/tenantimprovements.nyase.com` and upload contents of `dist/`.

---

## Build Commands

| Command | Purpose |
|---------|---------|
| `npm run build` | Build for GoDaddy (`base: '/'`) |
| `npm run dev` | Local dev server |
| `npm run predeploy && npm run deploy` | Build and deploy to GitHub Pages (legacy) |

---

## Post-Deploy Checklist

- [ ] Visit `https://tenantimprovements.nyase.com/` — page loads correctly
- [ ] Visit `https://tenantimprovements.nyase.com/sitemap-index.xml` — sitemap lists the page URL
- [ ] Visit `https://tenantimprovements.nyase.com/robots.txt` — shows sitemap URL
- [ ] Submit `https://tenantimprovements.nyase.com/sitemap-index.xml` to Google Search Console
- [ ] Validate structured data at Google's Rich Results Test
