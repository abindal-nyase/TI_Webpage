import fs from 'fs';
import { PRESETS, viewports, withBrowser, openPage, ensureDir, humanScroll } from './_lib.mjs';

// Human-paced scroll video (.webm) in specific viewports.
//   node _video.mjs                         # all presets
//   node _video.mjs mobile-port-390         # just one
//   node _video.mjs desktop-1440 mobile-port-390
//   VP=mobile node _video.mjs               # substring filter
const OUT = ensureDir('/Users/abindal/dev/NYAScripts/TIPage/responsive-audit/video');
const args = process.argv.slice(2);
const VPS = viewports(args.length ? args : Object.keys(PRESETS));

await withBrowser(async (browser) => {
  for (const vp of VPS) {
    const { ctx, page } = await openPage(browser, vp, { video: OUT });
    await humanScroll(page);
    // Playwright auto-names the file page@<hash>.webm; rename to <viewport>.webm.
    const video = page.video();
    await ctx.close(); // finalizes the .webm
    const dest = `${OUT}/${vp.name}.webm`;
    fs.renameSync(await video.path(), dest);
    console.log(`video done: ${vp.name} (${vp.w}x${vp.h}) -> ${dest}`);
  }
});
console.log('DONE');
