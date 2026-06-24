/*
 * StyleExplorer.jsx — local client-approval tool (not part of the live site).
 *
 * Renders each Option-3 section in isolation, full-width as it would appear on
 * the live page, with runtime-switchable FONT pairings and COLOR themes, plus a
 * per-combo approval tracker persisted in localStorage.
 *
 * How theming works (mirrors option3.astro's switcher, different data set):
 *   - All section components read CSS custom properties (--color-primary,
 *     --color-accent, --font-display, ...). We override those inline on
 *     document.documentElement (:root) so every section island reacts instantly.
 *   - Google Fonts for the selected pairing are injected as <link> tags on
 *     demand and cached, so switching back is flash-free.
 *
 * Touches NOTHING else: no global CSS edits, no changes to section components,
 * no Astro-config changes. Only this file + style-explorer.astro are new.
 */
import { useEffect, useRef, useState, useCallback } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import O3Hero from '../ti-option3/00_O3_Hero/00_O3_Hero.jsx';
import O3TIDifferences from '../ti-option3/01_O3_TIDifferences/01_O3_TIDifferences.jsx';
import O3FirmCulture from '../ti-option3/02_O3_FirmCulture/02_O3_FirmCulture.jsx';
import O3TrustWall from '../ti-option3/03_O3_TrustWall/03_O3_TrustWall.jsx';
import O3ClientCare from '../ti-option3/04_O3_ClientCare/04_O3_ClientCare.jsx';
import O3Ethos from '../ti-option3/05_O3_Ethos/05_O3_Ethos.jsx';
import O3Footer from '../ti-option3/06_O3_Footer/06_O3_Footer.jsx';

/* ── Sections (page order, mapped to the real components) ── */
const SECTIONS = [
  { id: 'hero',         label: 'Hero',                 Comp: O3Hero },
  { id: 'risk',         label: 'Risk & Solutions',     Comp: O3TIDifferences },
  { id: 'culture',      label: 'Company Culture',      Comp: O3FirmCulture },
  { id: 'trust',        label: 'Trust Wall',           Comp: O3TrustWall },
  { id: 'care',         label: 'Client Care',          Comp: O3ClientCare },
  { id: 'vision',       label: 'Founder Vision',       Comp: O3Ethos },
  { id: 'footer',       label: 'Footer',               Comp: O3Footer },
];

/*
 * ── Font pairings ──
 * `dq`/`bq` are validated Google Fonts css2 family fragments (weights chosen to
 * exist for that family so the request never 404s). `ds`/`bs` are the CSS stacks
 * applied to --font-display / --font-body. Where the requested face is not on
 * Google Fonts (Freight Display), we list it first then load a close substitute.
 */
const FONTS = [
  { id: 'editorial',     label: 'Editorial',              sub: 'Freight Display + Inter',
    note: 'Freight Display is not on Google Fonts — substituting Spectral',
    ds: "'Freight Display Pro', 'Spectral', Georgia, serif", dq: 'Spectral:ital,wght@0,400;0,500;0,600;0,700;1,400',
    bs: "'Inter', system-ui, sans-serif",                  bq: 'Inter:wght@300;400;500;600;700' },
  { id: 'architectural', label: 'Architectural',          sub: 'Bebas Neue + DM Sans',
    ds: "'Bebas Neue', Impact, sans-serif",                dq: 'Bebas+Neue',
    bs: "'DM Sans', system-ui, sans-serif",                bq: 'DM+Sans:wght@400;500;700' },
  { id: 'corporate',     label: 'Corporate Prestige',     sub: 'Playfair Display + IBM Plex Sans',
    ds: "'Playfair Display', Georgia, serif",              dq: 'Playfair+Display:wght@400;500;600;700',
    bs: "'IBM Plex Sans', system-ui, sans-serif",          bq: 'IBM+Plex+Sans:wght@300;400;500;600;700' },
  { id: 'technical',     label: 'Technical Authority',    sub: 'Cormorant Garamond + Roboto',
    ds: "'Cormorant Garamond', Georgia, serif",            dq: 'Cormorant+Garamond:wght@400;500;600;700',
    bs: "'Roboto', system-ui, sans-serif",                 bq: 'Roboto:wght@300;400;500;700' },
  { id: 'institutional', label: 'Modern Institutional',   sub: 'Libre Baskerville + Source Sans Pro',
    ds: "'Libre Baskerville', Georgia, serif",             dq: 'Libre+Baskerville:wght@400;700',
    bs: "'Source Sans 3', system-ui, sans-serif",          bq: 'Source+Sans+3:wght@300;400;500;600;700' },
  { id: 'scandinavian',  label: 'Scandinavian Precision', sub: 'Tenor Sans + Jost',
    ds: "'Tenor Sans', system-ui, sans-serif",             dq: 'Tenor+Sans',
    bs: "'Jost', system-ui, sans-serif",                   bq: 'Jost:wght@300;400;500;600;700' },
  { id: 'brutalist',     label: 'Brutalist Clean',        sub: 'Barlow Condensed + Barlow',
    ds: "'Barlow Condensed', sans-serif",                  dq: 'Barlow+Condensed:wght@400;500;600;700',
    bs: "'Barlow', system-ui, sans-serif",                 bq: 'Barlow:wght@300;400;500;600;700' },
  { id: 'luxury',        label: 'Luxury Minimal',         sub: 'Bodoni Moda + Raleway',
    ds: "'Bodoni Moda', Didot, Georgia, serif",            dq: 'Bodoni+Moda:wght@400;500;600;700',
    bs: "'Raleway', system-ui, sans-serif",                bq: 'Raleway:wght@300;400;500;600;700' },
  { id: 'engineering',   label: 'Engineering Draft',      sub: 'Oswald + IBM Plex Mono',
    ds: "'Oswald', sans-serif",                            dq: 'Oswald:wght@300;400;500;600;700',
    bs: "'IBM Plex Mono', ui-monospace, monospace",        bq: 'IBM+Plex+Mono:wght@400;500;600;700' },
  { id: 'quiet',         label: 'Quiet Authority',        sub: 'Lora + Nunito Sans',
    ds: "'Lora', Georgia, serif",                          dq: 'Lora:wght@400;500;600;700',
    bs: "'Nunito Sans', system-ui, sans-serif",            bq: 'Nunito+Sans:opsz,wght@6..12,400;6..12,600;6..12,700' },
  { id: 'slab',          label: 'Contemporary Slab',      sub: 'Roboto Slab + Roboto',
    ds: "'Roboto Slab', Georgia, serif",                   dq: 'Roboto+Slab:wght@300;400;500;700',
    bs: "'Roboto', system-ui, sans-serif",                 bq: 'Roboto:wght@300;400;500;700' },
  { id: 'fashion',       label: 'High Fashion',           sub: 'Abril Fatface + Montserrat',
    ds: "'Abril Fatface', Georgia, serif",                 dq: 'Abril+Fatface',
    bs: "'Montserrat', system-ui, sans-serif",             bq: 'Montserrat:wght@300;400;500;600;700' },
  { id: 'academic',      label: 'Academic Precision',     sub: 'EB Garamond + Fira Sans',
    ds: "'EB Garamond', Georgia, serif",                   dq: 'EB+Garamond:wght@400;500;600;700',
    bs: "'Fira Sans', system-ui, sans-serif",              bq: 'Fira+Sans:wght@300;400;500;700' },
  { id: 'soft',          label: 'Soft Prestige',          sub: 'Spectral + Karla',
    ds: "'Spectral', Georgia, serif",                      dq: 'Spectral:ital,wght@0,400;0,500;0,600;0,700;1,400',
    bs: "'Karla', system-ui, sans-serif",                  bq: 'Karla:wght@300;400;500;600;700' },
];

/* ── Color themes (bg / text / accent triplets) ── */
const COLORS = [
  { id: 'mono-light',    name: 'Monochrome Light', bg: '#FFFFFF', text: '#111111', accent: '#888888' },
  { id: 'mono-dark',     name: 'Monochrome Dark',  bg: '#1A1A1A', text: '#F5F5F5', accent: '#666666' },
  { id: 'warm-mono',     name: 'Warm Monochrome',  bg: '#F2EFE9', text: '#1C1C1C', accent: '#9A9490' },
  { id: 'navy-white',    name: 'Navy & White',     bg: '#0A1628', text: '#FFFFFF', accent: '#E8E8E8' },
  { id: 'steel-blue',    name: 'Steel Blue',       bg: '#2E4A6B', text: '#FFFFFF', accent: '#A8C4DE' },
  { id: 'blueprint',     name: 'Blueprint',        bg: '#003366', text: '#FFFFFF', accent: '#4A90D9' },
  { id: 'slate-ivory',   name: 'Slate & Ivory',    bg: '#4A5568', text: '#FAFAF8', accent: '#CBD5E0' },
  { id: 'midnight-gold', name: 'Midnight & Gold',  bg: '#0D1117', text: '#F0F0F0', accent: '#C9A84C' },
  { id: 'cobalt-cream',  name: 'Cobalt & Cream',   bg: '#1B3A6B', text: '#FDF8F2', accent: '#7EB3D8' },
  { id: 'pewter-white',  name: 'Pewter & White',   bg: '#6B7280', text: '#FFFFFF', accent: '#D1D5DB' },
  { id: 'deep-ocean',    name: 'Deep Ocean',       bg: '#0C2340', text: '#E8F4FD', accent: '#2E86AB' },
  { id: 'arctic',        name: 'Arctic',           bg: '#EEF2F7', text: '#1A2332', accent: '#4A7FA5' },
];

/* ── Color helpers ── */
const hexToRgb = (h) => {
  let x = h.replace('#', '');
  if (x.length === 3) x = x.split('').map((c) => c + c).join('');
  return [0, 2, 4].map((i) => parseInt(x.slice(i, i + 2), 16));
};
const toHex = (rgb) => '#' + rgb.map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0')).join('');
const mix = (a, b, t) => { const A = hexToRgb(a), B = hexToRgb(b); return toHex(A.map((v, i) => v + (B[i] - v) * t)); };
const rgba = (h, a) => { const [r, g, b] = hexToRgb(h); return `rgba(${r},${g},${b},${a})`; };

/* Map a bg/text/accent theme onto the variables the components actually read. */
function themeVars(c) {
  return {
    '--color-primary':       c.bg,
    '--color-primary-light': mix(c.bg, c.text, 0.14),
    '--color-accent':        c.accent,
    '--color-accent-hover':  mix(c.accent, '#000000', 0.12),
    '--border-accent':       rgba(c.accent, 0.28),
    '--shadow-accent':       `0 8px 28px ${rgba(c.accent, 0.28)}`,
    '--surface-dark':        c.bg,
    '--surface-dark-mid':    mix(c.bg, c.text, 0.14),
    /* text-on-primary lever the components use ("white" text over dark bg) */
    '--white':               c.text,
    '--color-white':         c.text,
  };
}

const LS_APPROVED = 'se.approved.v1';
const LS_STATE = 'se.state.v1';
const comboKey = (s, f, c) => `${s}|${f}|${c}`;

/* ── UI chrome colors (independent of the theme being previewed) ── */
const ui = {
  panel: '#16181d', panelBorder: '#2a2e37', text: '#e6e8ec', dim: '#8b90a0',
  chipBg: '#21252e', chipActive: '#3a82f6', good: '#34c77b',
};

export default function StyleExplorer() {
  const [section, setSection] = useState(SECTIONS[0].id);
  const [font, setFont] = useState(FONTS[0].id);
  const [color, setColor] = useState(COLORS[3].id); // Navy & White — good default contrast
  const [approved, setApproved] = useState(() => new Set());
  const [collapsed, setCollapsed] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [hidePanel, setHidePanel] = useState(false);
  const loadedFonts = useRef(new Set());

  /* hydrate persisted state once on mount (client:only — safe to touch window) */
  useEffect(() => {
    try {
      const a = JSON.parse(localStorage.getItem(LS_APPROVED) || '[]');
      setApproved(new Set(a));
      const st = JSON.parse(localStorage.getItem(LS_STATE) || '{}');
      if (st.section && SECTIONS.some((s) => s.id === st.section)) setSection(st.section);
      if (st.font && FONTS.some((f) => f.id === st.font)) setFont(st.font);
      if (st.color && COLORS.some((c) => c.id === st.color)) setColor(st.color);
    } catch { /* ignore corrupt storage */ }
  }, []);

  /* persist selection */
  useEffect(() => {
    localStorage.setItem(LS_STATE, JSON.stringify({ section, font, color }));
  }, [section, font, color]);

  /* inject Google Fonts for the active pairing (once per pairing, cached) */
  useEffect(() => {
    const f = FONTS.find((x) => x.id === font);
    if (!f || loadedFonts.current.has(f.id)) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.dataset.seFont = f.id;
    link.href = `https://fonts.googleapis.com/css2?family=${f.dq}&family=${f.bq}&display=swap`;
    document.head.appendChild(link);
    loadedFonts.current.add(f.id);
  }, [font]);

  /* inject CSS variables onto :root so every section island reacts */
  useEffect(() => {
    const root = document.documentElement;
    const c = COLORS.find((x) => x.id === color);
    const f = FONTS.find((x) => x.id === font);
    const vars = { ...themeVars(c), '--font-display': f.ds, '--font-body': f.bs };
    Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v));
  }, [color, font]);

  /* recalc pinned/scroll triggers after the active section swaps in */
  useEffect(() => {
    const t = setTimeout(() => ScrollTrigger.refresh(), 300);
    window.scrollTo(0, 0);
    return () => clearTimeout(t);
  }, [section]);

  const curKey = comboKey(section, font, color);
  const isApproved = approved.has(curKey);

  const toggleApprove = useCallback(() => {
    setApproved((prev) => {
      const next = new Set(prev);
      next.has(curKey) ? next.delete(curKey) : next.add(curKey);
      localStorage.setItem(LS_APPROVED, JSON.stringify([...next]));
      return next;
    });
  }, [curKey]);

  const removeApproved = (key) => {
    setApproved((prev) => {
      const next = new Set(prev);
      next.delete(key);
      localStorage.setItem(LS_APPROVED, JSON.stringify([...next]));
      return next;
    });
  };

  const ActiveComp = SECTIONS.find((s) => s.id === section).Comp;
  const curColor = COLORS.find((c) => c.id === color);
  const curFont = FONTS.find((f) => f.id === font);

  return (
    <>
      {/* ── Active section, full-width, rendered as on the live site ── */}
      <main style={{ margin: 0, padding: 0 }}>
        <ActiveComp key={section} />
      </main>

      {/* ── Floating reopen button when panel hidden ── */}
      {hidePanel && (
        <button onClick={() => setHidePanel(false)} style={styles.reopen} title="Show controls">
          ⚙︎ Controls
        </button>
      )}

      {/* ── Fixed control panel (left drawer) ── */}
      {!hidePanel && (
        <aside style={{ ...styles.panel, width: collapsed ? 52 : 320 }}>
          <div style={styles.head}>
            {!collapsed && <span style={styles.title}>Style Explorer</span>}
            <button onClick={() => setCollapsed((v) => !v)} style={styles.iconBtn} title={collapsed ? 'Expand' : 'Collapse'}>
              {collapsed ? '»' : '«'}
            </button>
          </div>

          {!collapsed && (
            <div style={styles.body}>
              {/* current combo + approve */}
              <div style={styles.current}>
                <div style={styles.currentLine}>
                  <b style={{ color: ui.text }}>{SECTIONS.find((s) => s.id === section).label}</b>
                </div>
                <div style={styles.currentSub}>{curFont.label} · {curColor.name}</div>
                <button onClick={toggleApprove}
                  style={{ ...styles.approveBtn, background: isApproved ? ui.good : ui.chipActive }}>
                  {isApproved ? '✓ Approved — click to unapprove' : 'Approve this combo'}
                </button>
                <button onClick={() => setShowSummary(true)} style={styles.summaryBtn}>
                  View approved ({approved.size})
                </button>
              </div>

              {/* sections */}
              <Group label="Section">
                {SECTIONS.map((s) => (
                  <Chip key={s.id} active={s.id === section} onClick={() => setSection(s.id)}
                    badge={countFor(approved, s.id)}>
                    {s.label}
                  </Chip>
                ))}
              </Group>

              {/* fonts */}
              <Group label="Font pairing">
                {FONTS.map((f) => (
                  <Chip key={f.id} active={f.id === font} onClick={() => setFont(f.id)} title={f.sub}>
                    <span style={{ display: 'block', fontWeight: 600 }}>{f.label}</span>
                    <span style={styles.chipSub}>{f.sub}</span>
                  </Chip>
                ))}
              </Group>

              {/* colors */}
              <Group label="Color theme">
                {COLORS.map((c) => (
                  <Chip key={c.id} active={c.id === color} onClick={() => setColor(c.id)}>
                    <span style={styles.swatchRow}>
                      <Swatch color={c.bg} /><Swatch color={c.text} /><Swatch color={c.accent} />
                      <span style={{ marginLeft: 6 }}>{c.name}</span>
                    </span>
                  </Chip>
                ))}
              </Group>

              <button onClick={() => setHidePanel(true)} style={styles.hideBtn}>
                Hide panel (clean view)
              </button>
              {curFont.note && <p style={styles.fontNote}>ⓘ {curFont.note}</p>}
            </div>
          )}
        </aside>
      )}

      {/* ── Approval summary overlay ── */}
      {showSummary && (
        <ApprovalSummary approved={approved} onClose={() => setShowSummary(false)} onRemove={removeApproved} />
      )}
    </>
  );
}

/* count approved combos for a given section */
function countFor(approved, sectionId) {
  let n = 0;
  approved.forEach((k) => { if (k.split('|')[0] === sectionId) n++; });
  return n;
}

function Group({ label, children }) {
  return (
    <div style={styles.group}>
      <div style={styles.groupLabel}>{label}</div>
      <div style={styles.groupItems}>{children}</div>
    </div>
  );
}

function Chip({ active, onClick, children, title, badge }) {
  return (
    <button onClick={onClick} title={title}
      style={{ ...styles.chip, ...(active ? styles.chipActive : null) }}>
      <span style={{ flex: 1, textAlign: 'left' }}>{children}</span>
      {badge ? <span style={styles.badge}>{badge}</span> : null}
    </button>
  );
}

function Swatch({ color }) {
  return <span style={{ width: 13, height: 13, borderRadius: 3, background: color, border: '1px solid rgba(255,255,255,0.25)', display: 'inline-block' }} />;
}

function ApprovalSummary({ approved, onClose, onRemove }) {
  const fLabel = (id) => FONTS.find((f) => f.id === id)?.label ?? id;
  const cName = (id) => COLORS.find((c) => c.id === id)?.name ?? id;
  const sLabel = (id) => SECTIONS.find((s) => s.id === id)?.label ?? id;

  // group by section, in page order
  const bySection = SECTIONS.map((s) => ({
    section: s,
    combos: [...approved].filter((k) => k.split('|')[0] === s.id).map((k) => k.split('|')),
  })).filter((g) => g.combos.length);

  return (
    <div style={styles.modalWrap} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.modalHead}>
          <span style={styles.title}>Approved combinations ({approved.size})</span>
          <button onClick={onClose} style={styles.iconBtn}>✕</button>
        </div>
        {bySection.length === 0 && <p style={{ color: ui.dim }}>Nothing approved yet.</p>}
        {bySection.map(({ section, combos }) => (
          <div key={section.id} style={{ marginBottom: 18 }}>
            <div style={styles.modalSection}>{section.label}</div>
            {combos.map(([, f, c]) => (
              <div key={f + c} style={styles.modalRow}>
                <span style={{ flex: 1 }}>
                  <b style={{ color: ui.text }}>{fLabel(f)}</b>
                  <span style={{ color: ui.dim }}>  ·  {cName(c)}</span>
                </span>
                <button onClick={() => onRemove(comboKey(section.id, f, c))} style={styles.removeBtn}>remove</button>
              </div>
            ))}
          </div>
        ))}
        {approved.size > 0 && (
          <button
            onClick={() => navigator.clipboard?.writeText(
              bySection.map(({ section, combos }) =>
                `${section.label}\n` + combos.map(([, f, c]) => `  - ${fLabel(f)} · ${cName(c)}`).join('\n')
              ).join('\n\n')
            )}
            style={styles.copyBtn}>
            Copy summary to clipboard
          </button>
        )}
      </div>
    </div>
  );
}

/* ── Inline styles for the tool chrome (theme-independent) ── */
const styles = {
  panel: {
    position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 9000,
    background: ui.panel, borderRight: `1px solid ${ui.panelBorder}`,
    color: ui.text, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    fontSize: 13, display: 'flex', flexDirection: 'column',
    boxShadow: '0 0 40px rgba(0,0,0,0.4)', transition: 'width 0.2s ease',
  },
  head: { display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '12px 14px', borderBottom: `1px solid ${ui.panelBorder}`, flexShrink: 0 },
  title: { fontWeight: 700, letterSpacing: '0.02em', fontSize: 14 },
  iconBtn: { background: ui.chipBg, color: ui.text, border: `1px solid ${ui.panelBorder}`,
    borderRadius: 6, width: 28, height: 28, cursor: 'pointer', fontSize: 14, lineHeight: 1 },
  body: { overflowY: 'auto', padding: 14, display: 'flex', flexDirection: 'column', gap: 16 },
  current: { background: ui.chipBg, borderRadius: 10, padding: 12, display: 'flex', flexDirection: 'column', gap: 8 },
  currentLine: { fontSize: 14 },
  currentSub: { color: ui.dim, fontSize: 12 },
  approveBtn: { color: '#fff', border: 'none', borderRadius: 8, padding: '9px 10px',
    cursor: 'pointer', fontWeight: 600, fontSize: 12 },
  summaryBtn: { background: 'transparent', color: ui.dim, border: `1px solid ${ui.panelBorder}`,
    borderRadius: 8, padding: '7px 10px', cursor: 'pointer', fontSize: 12 },
  group: { display: 'flex', flexDirection: 'column', gap: 7 },
  groupLabel: { fontSize: 10, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: ui.dim },
  groupItems: { display: 'flex', flexDirection: 'column', gap: 5 },
  chip: { display: 'flex', alignItems: 'center', gap: 6, width: '100%',
    background: ui.chipBg, color: ui.text, border: `1px solid ${ui.panelBorder}`,
    borderRadius: 8, padding: '8px 10px', cursor: 'pointer', textAlign: 'left', lineHeight: 1.3 },
  chipActive: { background: ui.chipActive, borderColor: ui.chipActive, color: '#fff' },
  chipSub: { display: 'block', fontSize: 10.5, opacity: 0.7, fontWeight: 400 },
  swatchRow: { display: 'flex', alignItems: 'center' },
  badge: { background: ui.good, color: '#04210f', borderRadius: 20, fontSize: 10,
    fontWeight: 800, minWidth: 17, height: 17, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px' },
  hideBtn: { background: 'transparent', color: ui.dim, border: `1px dashed ${ui.panelBorder}`,
    borderRadius: 8, padding: '8px 10px', cursor: 'pointer', fontSize: 12 },
  fontNote: { color: ui.dim, fontSize: 11, lineHeight: 1.4, margin: 0 },
  reopen: { position: 'fixed', top: 12, left: 12, zIndex: 9000, background: ui.panel,
    color: ui.text, border: `1px solid ${ui.panelBorder}`, borderRadius: 8, padding: '8px 12px',
    cursor: 'pointer', fontFamily: '-apple-system, sans-serif', fontSize: 13, boxShadow: '0 4px 16px rgba(0,0,0,0.4)' },
  modalWrap: { position: 'fixed', inset: 0, zIndex: 9500, background: 'rgba(0,0,0,0.55)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 },
  modal: { background: ui.panel, color: ui.text, border: `1px solid ${ui.panelBorder}`,
    borderRadius: 14, padding: 22, width: 'min(560px, 92vw)', maxHeight: '82vh', overflowY: 'auto',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', fontSize: 13,
    boxShadow: '0 20px 60px rgba(0,0,0,0.5)' },
  modalHead: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  modalSection: { fontSize: 11, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase',
    color: ui.chipActive, marginBottom: 8 },
  modalRow: { display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', borderBottom: `1px solid ${ui.panelBorder}` },
  removeBtn: { background: 'transparent', color: '#e06666', border: `1px solid ${ui.panelBorder}`,
    borderRadius: 6, padding: '4px 8px', cursor: 'pointer', fontSize: 11 },
  copyBtn: { marginTop: 8, background: ui.chipActive, color: '#fff', border: 'none', borderRadius: 8,
    padding: '9px 14px', cursor: 'pointer', fontWeight: 600, fontSize: 12 },
};
