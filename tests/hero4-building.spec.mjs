import { test, expect } from '@playwright/test';
import {
  VIEWPORTS,
  probeBuilding,
  gotoOption3,
  waitBuildingVisible,
  jumpTo,
  scrollToInstant,
} from './helpers/hero4.mjs';

// Assert the assembled building is visible AND on-screen at rest (scrollY 0).
// This is the invariant that regressed in every reported bug: scrollY could be
// 0 with the building either hidden or parked thousands of px off-screen.
async function expectBuildingAtRest(page) {
  const b = await page.evaluate(probeBuilding);
  expect(b.scrollY, 'should be back at the top').toBeLessThanOrEqual(2);
  expect(b.vis, 'movehome visibility').toBe('visible');
  expect(b.onScreen, `building union should intersect viewport (got ${JSON.stringify(b.union)} vp ${JSON.stringify(b.vp)})`).toBe(true);
  expect(b.loaded, 'all layer images loaded').toBe(b.total);
  return b;
}

test.describe('Hero4 building — visible at rest across viewports', () => {
  for (const [name, vp] of Object.entries(VIEWPORTS)) {
    test(`initial load: ${name} (${vp.width}x${vp.height})`, async ({ page }) => {
      await page.setViewportSize(vp);
      await gotoOption3(page);
      await waitBuildingVisible(page);
      await page.waitForTimeout(700);
      await expectBuildingAtRest(page);
    });
  }
});

test.describe('Hero4 building — survives side-nav jumps', () => {
  test('cold jump to section 3 and back (lazy sections hydrate mid-jump)', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.desktop);
    await gotoOption3(page);
    await waitBuildingVisible(page);
    await page.waitForTimeout(500);
    // Jump before the client:visible sections below have mounted — their
    // hydration fires ScrollTrigger.refresh() while scrolled down.
    await jumpTo(page, 'section-trust-wall');
    await page.waitForTimeout(1600);
    await jumpTo(page, 'hero4');
    await page.waitForTimeout(1700);
    await expectBuildingAtRest(page);
  });

  test('rapid jumps without settling, ending back at hero4', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.desktop);
    await gotoOption3(page);
    await waitBuildingVisible(page);
    await page.waitForTimeout(500);
    await jumpTo(page, 'section-trust-wall'); await page.waitForTimeout(300);
    await jumpTo(page, 'hero4');               await page.waitForTimeout(300);
    await jumpTo(page, 'section-firm-culture'); await page.waitForTimeout(300);
    await jumpTo(page, 'hero4');               await page.waitForTimeout(1800);
    await expectBuildingAtRest(page);
  });

  test('repeated jump to section 3 and back (x4)', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.laptop);
    await gotoOption3(page);
    await waitBuildingVisible(page);
    await page.waitForTimeout(500);
    for (let i = 0; i < 4; i++) {
      await jumpTo(page, 'section-trust-wall'); await page.waitForTimeout(1500);
      await jumpTo(page, 'hero4');               await page.waitForTimeout(1500);
    }
    await expectBuildingAtRest(page);
  });

  test('portrait phone: jump to section 3 and back', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await gotoOption3(page);
    await waitBuildingVisible(page);
    await page.waitForTimeout(600);
    await jumpTo(page, 'section-trust-wall'); await page.waitForTimeout(1500);
    await jumpTo(page, 'hero4');               await page.waitForTimeout(1800);
    await expectBuildingAtRest(page);
  });
});

test.describe('Hero4 building — survives resize / orientation while scrolled', () => {
  test('resize across a breakpoint (desktop → tiny) mid-scroll, then back to top', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.desktop);
    await gotoOption3(page);
    await waitBuildingVisible(page);
    await page.waitForTimeout(500);
    await scrollToInstant(page, 1080); // ~1.2vh into hero4
    await page.waitForTimeout(500);
    await page.setViewportSize({ width: 380, height: 820 });
    await page.waitForTimeout(900);
    await scrollToInstant(page, 0);
    await page.waitForTimeout(900);
    await expectBuildingAtRest(page);
  });

  test('resize within the same breakpoint mid-scroll, then back to top', async ({ page }) => {
    await page.setViewportSize({ width: 1600, height: 900 });
    await gotoOption3(page);
    await waitBuildingVisible(page);
    await page.waitForTimeout(500);
    await scrollToInstant(page, 900);
    await page.waitForTimeout(400);
    await page.setViewportSize({ width: 1100, height: 740 });
    await page.waitForTimeout(900);
    await scrollToInstant(page, 0);
    await page.waitForTimeout(900);
    await expectBuildingAtRest(page);
  });

  test('orientation flip (portrait → landscape) mid-scroll, then back to top', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await gotoOption3(page);
    await waitBuildingVisible(page);
    await page.waitForTimeout(500);
    await scrollToInstant(page, 930);
    await page.waitForTimeout(400);
    await page.setViewportSize({ width: 844, height: 390 });
    await page.waitForTimeout(900);
    await scrollToInstant(page, 0);
    await page.waitForTimeout(900);
    await expectBuildingAtRest(page);
  });
});

test.describe('Hero4 building — survives reload', () => {
  test('reload while scrolled mid-hero4, then back to top', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.tabletLand);
    await gotoOption3(page);
    await waitBuildingVisible(page);
    await page.waitForTimeout(500);
    await page.evaluate(() => window.scrollTo(0, window.innerHeight * 1.3));
    await page.waitForTimeout(400);
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => !!window.__lenis, { timeout: 10_000 });
    await scrollToInstant(page, 0).catch(() => {});
    await waitBuildingVisible(page);
    await page.waitForTimeout(900);
    await expectBuildingAtRest(page);
  });
});
