// Shared helpers for the Hero4 building-reliability tests.
//
// Background: the Hero4 building (the stacked l1–l8 isometric layers) is placed
// at runtime by GSAP — scale/x/y are MEASURED, and the layers ride a pinned
// scrub timeline. Several conditions used to leave it invisible or parked far
// off-screen even though scrollY was 0 (jumping sections via the side nav,
// resizing across a breakpoint, etc.). These helpers measure whether the
// assembled building is actually on-screen and visible at rest.

export const VIEWPORTS = {
  desktop:      { width: 1440, height: 900 },
  laptop:       { width: 1280, height: 800 },
  tabletLand:   { width: 1024, height: 768 },
  tabletPort:   { width: 768,  height: 1024 },
  mobile:       { width: 414,  height: 896 },
  tiny:         { width: 320,  height: 568 },
};

// Runs in the browser. Returns the building's visibility + the bounding union
// of its visible layer images, plus whether that union actually intersects the
// viewport by a meaningful amount.
export function probeBuilding() {
  const mh = document.querySelector('[class*="movehome"]');
  const vis = mh ? getComputedStyle(mh).visibility : 'NO-MH';
  // Only the BASE layer images compose the resting building. The hover-swap
  // images share the same .layer parent but are themselves display:none (so the
  // browser may never load them) — checking the img's OWN computed display
  // excludes them and avoids a false "image not loaded" failure.
  const imgs = [...document.querySelectorAll('[class*="movehome"] img')].filter(
    (im) =>
      getComputedStyle(im).display !== 'none' &&
      im.src.includes('/nya-img/'),
  );
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity, loaded = 0;
  for (const im of imgs) {
    if (im.complete && im.naturalHeight) loaded++;
    const r = im.getBoundingClientRect();
    if (!r.width && !r.height) continue;
    x0 = Math.min(x0, r.left);
    y0 = Math.min(y0, r.top);
    x1 = Math.max(x1, r.right);
    y1 = Math.max(y1, r.bottom);
  }
  const W = innerWidth, H = innerHeight;
  const visW = Math.max(0, Math.min(W, x1) - Math.max(0, x0));
  const visH = Math.max(0, Math.min(H, y1) - Math.max(0, y0));
  return {
    vis,
    loaded,
    total: imgs.length,
    scrollY: Math.round(scrollY),
    onScreen: visW > 40 && visH > 40,
    union: { left: Math.round(x0), top: Math.round(y0), w: Math.round(x1 - x0), h: Math.round(y1 - y0) },
    vp: { W, H },
  };
}

// Navigate to /option3 and wait until Lenis (the smooth-scroll instance the
// side nav drives) is wired up, so jumps behave like a real user click.
export async function gotoOption3(page) {
  await page.goto('/option3', { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => !!window.__lenis, { timeout: 10_000 });
}

// Wait until JS has revealed the building (CSS parks it hidden until measured).
export async function waitBuildingVisible(page) {
  await page
    .waitForFunction(
      () => {
        const mh = document.querySelector('[class*="movehome"]');
        return mh && getComputedStyle(mh).visibility === 'visible';
      },
      { timeout: 10_000 },
    )
    .catch(() => {});
}

// Jump to a section exactly like SideNavOption3's click handler does.
export async function jumpTo(page, id) {
  await page.evaluate((id) => {
    const el = document.getElementById(id);
    window.__lenis.scrollTo(el, { offset: -80, duration: 1.4 });
  }, id);
}

// Instant scroll (no smooth animation) — for setting up mid-scroll state fast.
export async function scrollToInstant(page, y) {
  await page.evaluate((y) => window.__lenis.scrollTo(y, { immediate: true }), y);
}
