const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('http://localhost:4321/option3', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  
  const info = await page.evaluate(() => {
    const fc = document.getElementById('section-firm-culture');
    const tw = document.getElementById('section-trust-wall');
    return {
      fc: fc ? { top: fc.offsetTop, height: fc.offsetHeight } : null,
      tw: tw ? { top: tw.offsetTop, height: tw.offsetHeight } : null,
    };
  });
  console.log(JSON.stringify(info));
  
  if (info.tw) {
    await page.evaluate((top) => window.scrollTo(0, top - 200), info.tw.top);
    await page.waitForTimeout(800);
    await page.screenshot({ path: '/tmp/boundary.png' });
  }
  
  await browser.close();
})();
