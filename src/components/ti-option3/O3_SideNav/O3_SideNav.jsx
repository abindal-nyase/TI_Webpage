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

// Color endpoint definitions (resolved to RGB at runtime)
const COLOR_PAIRS = {
  num:     { light: 'var(--color-gray-700)',  dark: 'rgba(255,255,255,0.45)' },
  numHi:   { light: 'var(--color-primary)',   dark: 'var(--color-accent)'    },
  label:   { light: 'var(--color-primary)',   dark: 'var(--color-accent)'    },
  border:  { light: 'rgba(0,0,0,0.08)',       dark: 'rgba(255,255,255,0.1)'  },
  hoverBg: { light: 'rgba(0,0,0,0.05)',       dark: 'rgba(255,255,255,0.07)' },
  fill:    { light: 'var(--color-primary)',   dark: 'var(--color-accent)'    },
};

function parseCSSColor(value) {
  const probe = document.createElement('div');
  probe.style.cssText = `color:${value};position:absolute;pointer-events:none;opacity:0`;
  document.body.appendChild(probe);
  const raw = getComputedStyle(probe).color; // always returns rgb() or rgba()
  document.body.removeChild(probe);
  const m = raw.match(/[\d.]+/g);
  if (!m) return [0, 0, 0, 1];
  return [+m[0], +m[1], +m[2], m[3] !== undefined ? +m[3] : 1];
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

// Fraction of pill height covered by dark-background sections
function computeDarkRatio(pillEl) {
  if (!pillEl) return 0;
  const pr = pillEl.getBoundingClientRect();
  let covered = 0;
  for (const s of SECTIONS) {
    if (!s.dark) continue;
    const el = document.getElementById(s.id);
    if (!el) continue;
    const sr = el.getBoundingClientRect();
    const top = Math.max(pr.top, sr.top);
    const bot = Math.min(pr.bottom, sr.bottom);
    if (bot > top) covered += bot - top;
  }
  return Math.min(1, covered / Math.max(1, pr.height));
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
      itemRefs.current.forEach((el) => {
        if (!el) return;
        const t = computeDarkRatio(el);
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
