import fs from 'fs';
import { execFileSync } from 'child_process';
import { PRESETS, viewports, withBrowser, openPage, ensureDir, humanScroll } from './_lib.mjs';

// Human-paced scroll video in specific viewports. Playwright records .webm;
// if ffmpeg is installed it's transcoded to .mp4 (H.264) and the .webm dropped.
//   node _video.mjs                         # all presets
//   node _video.mjs mobile-port-390         # just one
//   node _video.mjs desktop-1440 mobile-port-390
//   VP=mobile node _video.mjs               # substring filter
const OUT = ensureDir('/Users/abindal/dev/NYAScripts/TIPage/responsive-audit/video');
const args = process.argv.slice(2);
const VPS = viewports(args.length ? args : Object.keys(PRESETS));

const hasFfmpeg = (() => {
  try { execFileSync('ffmpeg', ['-version'], { stdio: 'ignore' }); return true; }
  catch { return false; }
})();
if (!hasFfmpeg) console.warn('ffmpeg not found — keeping .webm (install ffmpeg for .mp4)');

await withBrowser(async (browser) => {
  for (const vp of VPS) {
    const { ctx, page } = await openPage(browser, vp, { video: OUT });
    await humanScroll(page, { dwell: 1000, glide: 1.0 });  // 1s per scroll step + 1s glide (slower, longer video)
    const video = page.video();
    await ctx.close();                         // finalizes the recording
    const webm = `${OUT}/${vp.name}.webm`;
    await video.saveAs(webm);                  // waits for the file, names it <viewport>.webm
    await video.delete();                      // remove the page@<hash>.webm temp

    let dest = webm;
    if (hasFfmpeg) {
      dest = `${OUT}/${vp.name}.mp4`;
      execFileSync('ffmpeg', ['-y', '-i', webm, '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', dest], { stdio: 'ignore' });
      fs.unlinkSync(webm);
    }
    console.log(`video done: ${vp.name} (${vp.w}x${vp.h}) -> ${dest}`);
  }
});
console.log('DONE');
