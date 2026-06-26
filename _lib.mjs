import { chromium } from 'playwright';
import fs from 'fs';

// Shared helpers for the _*.mjs recorder scripts. Each script stays a thin
// entrypoint (its own output dir + mode); all the Playwright boilerplate,
// viewport presets, scroll loops, and page measurements live here.

export const URL = process.env.URL || 'http://localhost:4321/';

// Canonical viewport matrix, small -> large. Widths chosen to bracket the
// CSS breakpoints actually used in src (heaviest: 640, 768, 860/900/960, 1024).
// Scripts pick a subset by name; pass names as CLI args or VP= to filter.
export const PRESETS = {
  // --- mobile ---
  'mobile-small-360': { w: 360,  h: 640 },   // small Android baseline
  'mobile-port-390':  { w: 390,  h: 844 },   // iPhone 12-15 portrait
  'mobile-pro-430':   { w: 430,  h: 932 },   // iPhone Pro Max — exercises 430/480 queries
  'mobile-land-844':  { w: 844,  h: 390 },   // phone landscape
  // --- tablet ---
  'phablet-600':      { w: 600,  h: 900 },   // straddles the 640px breakpoint (16 uses)
  'tablet-port-768':  { w: 768,  h: 1024 },  // iPad portrait — the 768 breakpoint
  'tablet-pro-834':   { w: 834,  h: 1194 },  // iPad Pro — covers the 780/860/900/920/960 band
  'tablet-land-1024': { w: 1024, h: 768 },   // iPad landscape — the 1024 min-width
  // --- laptop / desktop ---
  'laptop-1280':      { w: 1280, h: 800 },   // common laptop, fills 1024->1366 gap
  'laptop-1366':      { w: 1366, h: 768 },   // most common laptop width
  'desktop-1440':     { w: 1440, h: 900 },   // standard desktop
  'desktop-1920':     { w: 1920, h: 1080 },  // most common desktop res, fills 1440->2560 gap
  'desktop-2560':     { w: 2560, h: 1440 },  // QHD / large monitor
};

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Resolve a script's default viewport list (array or comma-string of preset
// names) into {name,w,h} objects. Set env VP=<substr> to narrow to matching
// names, e.g. `VP=mobile node _shoot.mjs` or `VP=desktop-1440 node _film.mjs`.
export function viewports(defaults) {
  const names = Array.isArray(defaults)
    ? defaults
    : String(defaults).split(',').map((s) => s.trim()).filter(Boolean);
  const vp = process.env.VP;
  const picked = vp ? names.filter((n) => n.includes(vp)) : names;
  if (!picked.length) throw new Error(`no viewports match VP="${vp}" in [${names.join(', ')}]`);
  return picked.map((name) => {
    const p = PRESETS[name];
    if (!p) throw new Error(`unknown viewport preset: ${name}`);
    return { name, ...p };
  });
}

export function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

// Launch a browser, run fn(browser), always close.
export async function withBrowser(fn) {
  const browser = await chromium.launch();
  try {
    await fn(browser);
  } finally {
    await browser.close();
  }
}

// Open a context+page at a viewport, navigate to URL, settle, and (by default)
// capture console/page errors. opts: { settle=1200, video=<dir>,
// deviceScaleFactor, captureErrors=true }. Returns { ctx, page, errors }.
export async function openPage(browser, vp, opts = {}) {
  const ctxOpts = { viewport: { width: vp.w, height: vp.h } };
  if (opts.deviceScaleFactor) ctxOpts.deviceScaleFactor = opts.deviceScaleFactor;
  if (opts.video) ctxOpts.recordVideo = { dir: opts.video, size: { width: vp.w, height: vp.h } };
  const ctx = await browser.newContext(ctxOpts);
  const page = await ctx.newPage();
  const errors = [];
  if (opts.captureErrors !== false) {
    page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
    page.on('pageerror', (e) => errors.push('PAGEERR: ' + e.message));
  }
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(opts.settle ?? 1200);
  return { ctx, page, errors };
}

export const scrollTo = (page, y) => page.evaluate((yy) => window.scrollTo(0, yy), y);

// Smooth, human-paced scroll via Lenis. Re-measures scrollHeight each step:
// GSAP pins expand the page as you scroll, so a single up-front measurement
// undershoots and stops before the footer. Loops until the bottom is actually
// reached (confirmed twice — the page may still settle), with a safety cap.
export async function humanScroll(page, { stepFrac = 0.55, dwell = 950, settle = 1200, glide = 0.7 } = {}) {
  const vh = await page.evaluate(() => window.innerHeight);
  const step = Math.round(vh * stepFrac);
  let y = 0;
  let atBottom = 0;
  for (let guard = 0; guard < 400; guard++) {
    await page.evaluate(({ yy, g }) => {
      if (window.__lenis) window.__lenis.scrollTo(yy, { duration: g });
      else window.scrollTo({ top: yy, behavior: 'smooth' });
    }, { yy: y, g: glide });
    await sleep(dwell);
    const m = await page.evaluate(() => ({
      total: document.body.scrollHeight,
      cur: window.scrollY,
      vh: window.innerHeight,
    }));
    if (m.cur + m.vh >= m.total - 4) {
      if (++atBottom >= 2) break;
    } else {
      atBottom = 0;
    }
    y += step;
  }
  // Park at the true (re-measured) bottom and dwell, so the recording clearly
  // lands on the footer instead of cutting off mid-glide.
  await page.evaluate((g) => {
    const t = document.body.scrollHeight;
    if (window.__lenis) window.__lenis.scrollTo(t, { duration: g });
    else window.scrollTo({ top: t, behavior: 'smooth' });
  }, glide);
  await sleep(settle);
}

// Document-level horizontal overflow report + first offenders.
export function overflow(page) {
  return page.evaluate(() => {
    const de = document.documentElement;
    const offenders = [];
    document.querySelectorAll('*').forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.right > window.innerWidth + 2 || r.left < -2) {
        offenders.push({
          tag: el.tagName,
          cls: (el.className || '').toString().slice(0, 60),
          right: Math.round(r.right),
          left: Math.round(r.left),
        });
      }
    });
    return {
      docW: de.scrollWidth,
      winW: window.innerWidth,
      hasXScroll: de.scrollWidth > window.innerWidth + 2,
      offenders: offenders.slice(0, 25),
    };
  });
}
