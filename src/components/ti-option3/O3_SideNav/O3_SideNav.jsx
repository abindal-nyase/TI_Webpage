import { useEffect, useState, useRef, useCallback } from 'react';
import styles from './O3_SideNav.module.css';

const SECTIONS = [
  { id: 'hero4',                   num: '00', label: 'Overview',       dark: true  },
  { id: 'section-ti-differences',  num: '01', label: 'TI Differences', dark: false },
  { id: 'section-firm-culture',    num: '02', label: 'Firm Culture',   dark: true  },
  { id: 'section-trust-wall',      num: '03', label: 'Trust & Clients',dark: true,
    spans: ['section-trust-wall', 'nya-culture-2', 'nya-culture'] },
  { id: 'section-footer',          num: '04', label: 'Get in Touch',  dark: true  },
];

// Color endpoint definitions (resolved to RGB at runtime).
// `light` = endpoint over a LIGHT/white background → black-ish text.
// `dark`  = endpoint over a DARK background → white text.
// The blend factor t (0=light, 1=dark) is the real pixel-sampled background
// darkness behind each pill, so the nav flips white↔black as the page scrolls.
const COLOR_PAIRS = {
  num:     { light: 'var(--color-gray-700)',  dark: 'oklch(1 0 0 / 0.6)'  },
  numHi:   { light: 'var(--color-black)',     dark: 'oklch(1 0 0)'                },
  label:   { light: 'var(--color-black)',     dark: 'oklch(1 0 0)'                },
  border:  { light: 'oklch(0 0 0 / 0.08)',       dark: 'oklch(1 0 0 / 0.1)'  },
  hoverBg: { light: 'oklch(0 0 0 / 0.05)',       dark: 'oklch(1 0 0 / 0.07)' },
  fill:    { light: 'var(--color-primary)',   dark: 'var(--color-accent)'    },
};

// Rasterize ANY computed CSS color string to straight sRGB [r,g,b,a] bytes
// (a in 0..1). Works for rgb()/rgba()/hex AND oklch()/color() — modern browsers
// return the authored color space verbatim from getComputedStyle, so we paint a
// pixel and read it back instead of string-parsing channels. Cannot resolve
// var() (canvas has no CSS scope) — callers resolve vars via a probe first.
let _rasterCtx = null;
function rasterizeColor(str) {
  if (!_rasterCtx) {
    const cv = document.createElement('canvas');
    cv.width = cv.height = 1;
    _rasterCtx = cv.getContext('2d', { willReadFrequently: true });
  }
  const ctx = _rasterCtx;
  ctx.clearRect(0, 0, 1, 1);
  ctx.fillStyle = '#000';
  ctx.fillStyle = str; // ignored if str is unparseable; falls back to #000
  ctx.fillRect(0, 0, 1, 1);
  const d = ctx.getImageData(0, 0, 1, 1).data;
  return [d[0], d[1], d[2], d[3] / 255];
}

function parseCSSColor(value) {
  const probe = document.createElement('div');
  probe.style.cssText = `color:${value};position:absolute;pointer-events:none;opacity:0`;
  document.body.appendChild(probe);
  const raw = getComputedStyle(probe).color; // resolves var(); may be rgb()/oklch()/color()
  document.body.removeChild(probe);
  return rasterizeColor(raw);
}

function resolveAllColors() {
  const out = {};
  for (const [key, pair] of Object.entries(COLOR_PAIRS)) {
    out[key] = { light: parseCSSColor(pair.light), dark: parseCSSColor(pair.dark) };
  }
  return out;
}

function lerp(a, b, t) { return a + (b - a) * t; }

function blendRGBA([lr, lg, lb, la], [dr, dg, db, da], t) {
  return `rgba(${Math.round(lerp(lr, dr, t))},${Math.round(lerp(lg, dg, t))},${Math.round(lerp(lb, db, t))},${lerp(la, da, t).toFixed(3)})`;
}

function getSectionProgress(section) {
  const ids = section.spans || [section.id];
  const first = document.getElementById(ids[0]);
  const last = document.getElementById(ids[ids.length - 1]);
  if (!first) return 0;
  const lastEl = last || first;
  const firstRect = first.getBoundingClientRect();
  const lastRect = lastEl.getBoundingClientRect();
  const totalHeight = lastRect.bottom - firstRect.top;
  const vh = window.innerHeight;
  return Math.min(1, Math.max(0, -firstRect.top / (totalHeight - vh)));
}

// Relative luminance of an [r,g,b] triplet (0=black … 1=white).
function luminance(r, g, b) { return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255; }

// Topmost OPAQUE background color actually painted behind a point, ignoring the
// nav itself and any transparent layers (building PNGs, masked shapes, etc.).
// Returns 1 if that pixel reads dark, 0 if light, or null if nothing opaque
// was found (caller treats as "no change").
function pixelIsDark(x, y, navEl) {
  const els = document.elementsFromPoint(x, y);
  for (const el of els) {
    if (navEl.contains(el)) continue; // skip the nav's own pills/labels
    const c = getComputedStyle(el).backgroundColor;
    if (!c || c === 'transparent') continue;
    const [r, g, b, a] = rasterizeColor(c);
    if (a < 0.5) continue; // see-through layer — keep looking underneath
    return luminance(r, g, b) < 0.5 ? 1 : 0;
  }
  return null;
}

// Real pixel-sampled darkness behind a pill: sample several points down its
// height and average. Partial overlap (pill straddling a light/dark seam) gives
// a fractional value, so the colors blend smoothly across the boundary.
function computeDarkRatio(pillEl, navEl) {
  if (!pillEl || !navEl) return 0;
  const pr = pillEl.getBoundingClientRect();
  const x = Math.round(pr.left + pr.width / 2);
  const SAMPLES = 5;
  let sum = 0, n = 0;
  for (let i = 0; i < SAMPLES; i++) {
    const y = Math.round(pr.top + (pr.height * (i + 0.5)) / SAMPLES);
    const d = pixelIsDark(x, y, navEl);
    if (d === null) continue;
    sum += d; n++;
  }
  return n ? sum / n : 0;
}

export default function O3SideNav() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const itemRefs = useRef([]);
  const colorsRef = useRef(null);

  useEffect(() => {
    colorsRef.current = resolveAllColors();

    // Re-resolve when theme switcher mutates root style (CSS vars change).
    // Debounced via rAF: the switcher sets many properties in one burst, each
    // of which would otherwise trigger a full probe-node re-resolve.
    let moRaf = 0;
    const mo = new MutationObserver(() => {
      if (moRaf) return;
      moRaf = requestAnimationFrame(() => { moRaf = 0; colorsRef.current = resolveAllColors(); });
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['style'] });

    const update = () => {
      const mid = window.innerHeight * 0.4;
      let best = 0;
      SECTIONS.forEach((s, i) => {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top <= mid) best = i;
      });
      setActiveIdx(best);
      setProgress(getSectionProgress(SECTIONS[best]));

      // Direct DOM update — avoids React re-render on every scroll frame
      const rc = colorsRef.current;
      if (!rc) return;
      const navEl = itemRefs.current.find(Boolean)?.closest('nav');
      itemRefs.current.forEach((el) => {
        if (!el) return;
        const t = computeDarkRatio(el, navEl);
        el.style.setProperty('--pill-num',      blendRGBA(rc.num.light,     rc.num.dark,     t));
        el.style.setProperty('--pill-num-hi',   blendRGBA(rc.numHi.light,   rc.numHi.dark,   t));
        el.style.setProperty('--pill-label',    blendRGBA(rc.label.light,   rc.label.dark,   t));
        el.style.setProperty('--pill-border',   blendRGBA(rc.border.light,  rc.border.dark,  t));
        el.style.setProperty('--pill-hover-bg', blendRGBA(rc.hoverBg.light, rc.hoverBg.dark, t));
        el.style.setProperty('--pill-fill',     blendRGBA(rc.fill.light,    rc.fill.dark,    t));
      });
    };

    // rAF-batch the scroll handler: update() does getBoundingClientRect() per
    // item + 6 setProperty() calls, so running it raw on every scroll event
    // forces repeated layout. Coalesce to one run per frame.
    let scrollRaf = 0;
    const onScroll = () => {
      if (scrollRaf) return;
      scrollRaf = requestAnimationFrame(() => { scrollRaf = 0; update(); });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (scrollRaf) cancelAnimationFrame(scrollRaf);
      if (moRaf) cancelAnimationFrame(moRaf);
      mo.disconnect();
    };
  }, []);

  const handleClick = useCallback((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    if (window.__lenis) {
      window.__lenis.scrollTo(el, { offset: -80, duration: 1.4 });
    } else {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  return (
    <nav className={`${styles.nav} ${styles.navLeft}`} aria-label="Page sections">
      <ul className={styles.list} onMouseLeave={() => setHoveredIdx(null)}>
        {SECTIONS.map((section, idx) => {
          const isDone = idx < activeIdx;
          const isActive = idx === activeIdx;
          const state = isDone ? 'done' : isActive ? 'active' : 'upcoming';
          const showLabel = (isActive && hoveredIdx === null) || idx === hoveredIdx;
          let fillHeight = '0%';
          if (isDone) fillHeight = '100%';
          else if (isActive) fillHeight = `${Math.round(progress * 100)}%`;

          return (
            <li
              key={section.id}
              ref={(el) => { itemRefs.current[idx] = el; }}
              className={`${styles.item} ${styles[state]}`}
              onMouseEnter={() => setHoveredIdx(idx)}
            >
              <button
                className={styles.btn}
                onClick={() => handleClick(section.id)}
                aria-current={isActive ? 'true' : undefined}
                aria-label={`Go to ${section.label}`}
              >
                <span
                  className={styles.fillBg}
                  style={{ height: fillHeight, background: 'var(--pill-fill)' }}
                />
                <span className={styles.content}>
                  <span className={`${styles.label}${showLabel ? ' ' + styles.labelVisible : ''}`}>
                    {section.label}
                  </span>
                  <span className={styles.num}>{section.num}/</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
