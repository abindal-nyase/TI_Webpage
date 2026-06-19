// tests/client-care.spec.mjs
import { test, expect } from '@playwright/test';
import { VIEWPORTS, gotoOption3, scrollToInstant } from './helpers/hero4.mjs';

const SECTION = '#nya-culture-2';

// Read the section's bounding box top in document coords.
async function sectionDocTop(page) {
  return page.evaluate((sel) => {
    const el = document.querySelector(sel);
    const r = el.getBoundingClientRect();
    return Math.round(r.top + window.scrollY);
  }, SECTION);
}

// Average translateX (px) of all elements matching a data attribute, measured
// from their transform matrix. Resolution-independent comparison across scroll.
async function avgTranslateX(page, attr) {
  return page.evaluate((attr) => {
    const els = [...document.querySelectorAll(`[data-${attr}]`)];
    if (!els.length) return null;
    const xs = els.map((el) => new DOMMatrixReadOnly(getComputedStyle(el).transform).m41);
    return xs.reduce((a, b) => a + b, 0) / xs.length;
  }, attr);
}

test.describe('Client Care parallax section', () => {
  test('renders 8 bullet rows and 4 background images', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.desktop);
    await gotoOption3(page);
    await page.waitForSelector(SECTION);
    const titles = await page.locator(`${SECTION} [data-cc-title]`).count();
    const contents = await page.locator(`${SECTION} [data-cc-content]`).count();
    const bgs = await page.locator(`${SECTION} [data-cc-bg]`).count();
    expect(titles).toBe(8);
    expect(contents).toBe(8);
    expect(bgs).toBe(4);
  });

  test('header text is present', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.desktop);
    await gotoOption3(page);
    await page.waitForSelector(SECTION);
    await expect(page.locator(SECTION)).toContainText('A Culture of Trust');
  });

  test('titles move horizontally faster than content as the section scrolls', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.desktop);
    await gotoOption3(page);
    await page.waitForSelector(SECTION);
    const top = await sectionDocTop(page);

    await scrollToInstant(page, top - 200);
    await page.waitForTimeout(700);
    const t1 = await avgTranslateX(page, 'cc-title');
    const c1 = await avgTranslateX(page, 'cc-content');

    await scrollToInstant(page, top + 1200);
    await page.waitForTimeout(700);
    const t2 = await avgTranslateX(page, 'cc-title');
    const c2 = await avgTranslateX(page, 'cc-content');

    const titleDelta = Math.abs(t2 - t1);
    const contentDelta = Math.abs(c2 - c1);
    expect(titleDelta).toBeGreaterThan(5);            // titles actually moved
    expect(titleDelta).toBeGreaterThan(contentDelta); // titles faster than content
  });

  test('no horizontal page overflow across viewports', async ({ page }) => {
    for (const vp of [VIEWPORTS.desktop, VIEWPORTS.tabletPort, { width: 390, height: 844 }, { width: 844, height: 390 }]) {
      await page.setViewportSize(vp);
      await gotoOption3(page);
      await page.waitForSelector(SECTION);
      await scrollToInstant(page, (await sectionDocTop(page)) + 800);
      await page.waitForTimeout(500);
      const overflow = await page.evaluate(() =>
        document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow, `viewport ${vp.width}x${vp.height}`).toBeLessThanOrEqual(2);
    }
  });

  test('no console errors on load + scroll', async ({ page }) => {
    const errors = [];
    page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
    page.on('pageerror', (e) => errors.push(String(e)));
    await page.setViewportSize(VIEWPORTS.desktop);
    await gotoOption3(page);
    await page.waitForSelector(SECTION);
    await scrollToInstant(page, (await sectionDocTop(page)) + 1500);
    await page.waitForTimeout(700);
    expect(errors).toEqual([]);
  });
});
