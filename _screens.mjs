import { PRESETS, viewports, withBrowser, openPage, ensureDir, overflow, scrollTo } from './_lib.mjs';

// Full-page screenshot walk in specific viewports.
//   node _screens.mjs                       # all presets
//   node _screens.mjs mobile-port-390       # just one
//   node _screens.mjs desktop-1440 laptop-1366
//   VP=mobile node _screens.mjs             # substring filter
const OUT = '/Users/abindal/dev/NYAScripts/TIPage/responsive-audit/screens';
const args = process.argv.slice(2);
const VPS = viewports(args.length ? args : Object.keys(PRESETS));

await withBrowser(async (browser) => {
  for (const vp of VPS) {
    const dir = ensureDir(`${OUT}/${vp.name}`);
    const { ctx, page, errors } = await openPage(browser, vp, { settle: 1500 });

    // Re-measure scrollHeight each step: GSAP pins expand the page as you
    // scroll, so a single up-front measurement undershoots and stops before the
    // footer. Walk until the bottom is actually reached (confirmed twice — the
    // page may still settle), with a safety cap.
    const step = Math.round(vp.h * 0.85);
    let i = 0;
    let y = 0;
    let atBottom = 0;
    for (let guard = 0; guard < 80; guard++) {
      await scrollTo(page, y);
      await page.waitForTimeout(700);
      await page.screenshot({ path: `${dir}/${String(i).padStart(2, '0')}_y${y}.png` });
      i++;
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

    const ov = await overflow(page);
    console.log(`${vp.name} (${vp.w}x${vp.h}): shots=${i} xscroll=${ov.hasXScroll} errs=${errors.length} -> ${dir}`);
    await ctx.close();
  }
});
console.log('DONE');
