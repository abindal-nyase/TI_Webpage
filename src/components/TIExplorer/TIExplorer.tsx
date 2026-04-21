/**
 * TIExplorer.tsx
 * NYA Tenant Improvement Interactive Explorer
 *
 * ─── Setup ───────────────────────────────────────────────────────────────────
 *
 * 1. Drop this file into src/components/TIExplorer.tsx
 *
 * 2. Add Google Fonts to your Astro layout <head>:
 *      <link rel="preconnect" href="https://fonts.googleapis.com" />
 *      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
 *      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Outfit:wght@300;400;500&display=swap" rel="stylesheet" />
 *
 * 3. Use in any .astro page:
 *      ---
 *      import TIExplorer from '../components/TIExplorer';
 *      ---
 *      <TIExplorer client:load />
 *
 *    Optional props:
 *      <TIExplorer client:load contactHref="/contact" />
 *
 * ─── Data contract ───────────────────────────────────────────────────────────
 * Your offerings array must include:
 *   id, num, title, headline, body, bullets[], src, alt
 *   (featured is optional — not used by this component)
 */

import { useState, useEffect, useCallback } from 'react';
import { offerings } from '../../data/projects';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Offering {
  id: string;
  num: string;
  title: string;
  headline: string;
  body: string;
  bullets: string[];
  src: string;
  alt: string;
  featured?: boolean;
}

// Tag labels keyed by offering id — add more as your data grows
const TAG_MAP: Record<string, string> = {
  o1: 'Vertical Circulation',
  o2: 'Lobby Renovation',
  o3: 'High-Rise Work',
  o4: 'Fast-Track Delivery',
  o5: 'Connection Details',
};

// ─── Zone layout (% of container) ────────────────────────────────────────────
// Adjust these if your offerings array length changes.

const ZONES = [
  { left: '13%', top: '34%', width: '13%', height: '36%' },
  { left: '27%', top: '24%', width: '16%', height: '44%' },
  { left: '41%', top: '18%', width: '18%', height: '52%' },
  { left: '57%', top: '24%', width: '15%', height: '44%' },
  { left: '70%', top: '34%', width: '13%', height: '36%' },
];

// ─── Lobby SVG ────────────────────────────────────────────────────────────────

function LobbySVG() {
  return (
    <svg
      viewBox="0 0 900 600"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
    >
      <defs>
        <radialGradient id="ti-flr" cx="50%" cy="100%" r="80%">
          <stop offset="0%" stopColor="#141108" />
          <stop offset="100%" stopColor="#080706" />
        </radialGradient>
        <linearGradient id="ti-wbk" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1c1912" />
          <stop offset="100%" stopColor="#111009" />
        </linearGradient>
        <radialGradient id="ti-lgt" cx="50%" cy="0%" r="70%">
          <stop offset="0%" stopColor="rgba(184,147,90,0.07)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <linearGradient id="ti-wlft" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#0c0b08" />
          <stop offset="100%" stopColor="#1a1710" />
        </linearGradient>
        <linearGradient id="ti-wrgt" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#1a1710" />
          <stop offset="100%" stopColor="#0c0b08" />
        </linearGradient>
      </defs>

      {/* Ceiling */}
      <polygon points="0,0 900,0 780,50 120,50" fill="#0d0b07" />
      {/* Back wall */}
      <rect x="120" y="50" width="660" height="330" fill="url(#ti-wbk)" />
      {/* Left wall */}
      <polygon points="0,0 120,50 120,380 0,600" fill="url(#ti-wlft)" />
      {/* Right wall */}
      <polygon points="900,0 780,50 780,380 900,600" fill="url(#ti-wrgt)" />
      {/* Floor */}
      <polygon points="0,600 900,600 780,380 120,380" fill="url(#ti-flr)" />

      {/* Perspective floor grid */}
      <g stroke="#161410" strokeWidth="0.5" opacity="0.7">
        {[0, 200, 400, 600, 800, 900].map((x) => (
          <line key={x} x1="450" y1="380" x2={x} y2="600" />
        ))}
        {[420, 470, 520, 575].map((y) => (
          <line key={y} x1="0" y1={y} x2="900" y2={y} />
        ))}
      </g>

      {/* Horizon accent line */}
      <line x1="120" y1="380" x2="780" y2="380" stroke="#b8935a" strokeWidth="0.4" opacity="0.25" />

      {/* Ambient light cone */}
      <polygon points="200,50 700,50 800,380 100,380" fill="url(#ti-lgt)" opacity="0.6" />

      {/* Wall paneling frame */}
      <rect x="130" y="60" width="640" height="308" fill="none" stroke="#201d14" strokeWidth="0.5" />

      {/* Corner columns */}
      <rect x="120" y="50" width="15" height="330" fill="#0f0d09" />
      <rect x="765" y="50" width="15" height="330" fill="#0f0d09" />

      {/* Left wall sconce */}
      <rect x="185" y="110" width="2" height="55" fill="#b8935a" opacity="0.3" />
      <ellipse cx="186" cy="108" rx="7" ry="3" fill="#b8935a" opacity="0.12" />

      {/* Right wall sconce */}
      <rect x="710" y="110" width="2" height="55" fill="#b8935a" opacity="0.3" />
      <ellipse cx="711" cy="108" rx="7" ry="3" fill="#b8935a" opacity="0.12" />

      {/* Ceiling pendants */}
      <line x1="380" y1="50" x2="380" y2="90" stroke="#b8935a" strokeWidth="0.5" opacity="0.3" />
      <line x1="520" y1="50" x2="520" y2="90" stroke="#b8935a" strokeWidth="0.5" opacity="0.3" />
      <ellipse cx="450" cy="85" rx="60" ry="5" fill="#b8935a" opacity="0.04" />
    </svg>
  );
}

// ─── Hotspot zone ─────────────────────────────────────────────────────────────

interface HotspotZoneProps {
  offering: Offering;
  index: number;
  onActivate: (i: number) => void;
}

function HotspotZone({ offering, index, onActivate }: HotspotZoneProps) {
  const zone = ZONES[index] ?? ZONES[ZONES.length - 1];
  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`Explore: ${offering.title}`}
      onClick={() => onActivate(index)}
      onKeyDown={(e) => e.key === 'Enter' && onActivate(index)}
      className="ti-zone"
      style={{ left: zone.left, top: zone.top, width: zone.width, height: zone.height }}
    >
      <span className="ti-zone-label">{offering.title}</span>
      <div className="ti-dot-wrap" aria-hidden="true">
        <div className="ti-dot-outer" />
        <div className="ti-dot-inner" />
      </div>
    </div>
  );
}

// ─── Content panel ────────────────────────────────────────────────────────────

interface ContentPanelProps {
  offering: Offering;
  visible: boolean;
  contactHref: string;
}

function ContentPanel({ offering, visible, contactHref }: ContentPanelProps) {
  const tag = TAG_MAP[offering.id] ?? 'Structural Engineering';
  return (
    <div
      className="ti-panel"
      aria-hidden={!visible}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateX(0)' : 'translateX(28px)',
        pointerEvents: visible ? 'all' : 'none',
      }}
    >
      <div className="ti-panel-num" aria-hidden="true">{offering.num}</div>

      <p className="ti-panel-tag">{tag}</p>

      <h2 className="ti-panel-title">{offering.title}</h2>

      <p className="ti-panel-headline">{offering.headline}</p>

      <p className="ti-panel-body">{offering.body}</p>

      <ul className="ti-panel-bullets">
        {offering.bullets.map((b) => (
          <li key={b}>{b}</li>
        ))}
      </ul>

      <a href={contactHref} className="ti-panel-cta">
        Discuss your project <span className="ti-cta-arrow" aria-hidden="true">→</span>
      </a>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

interface TIExplorerProps {
  /** Where the "Discuss your project" CTA links to */
  contactHref?: string;
}

export default function TIExplorer({ contactHref = '/contact' }: TIExplorerProps) {
  const [active, setActive] = useState<number | null>(null);
  const [animating, setAnimating] = useState(false);
  const list = offerings as Offering[];

  const activate = useCallback(
    (idx: number) => {
      if (animating) return;
      setAnimating(true);
      setActive(idx);
      setTimeout(() => setAnimating(false), 900);
    },
    [animating],
  );

  const deactivate = useCallback(() => {
    if (animating) return;
    setAnimating(true);
    setActive(null);
    setTimeout(() => setAnimating(false), 900);
  }, [animating]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { deactivate(); return; }
      if (e.key === 'ArrowRight') activate(active === null ? 0 : Math.min(active + 1, list.length - 1));
      if (e.key === 'ArrowLeft' && active !== null) activate(Math.max(active - 1, 0));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active, activate, deactivate, list.length]);

  const isOpen = active !== null;
  const current = active !== null ? list[active] : null;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <section className="ti-root" aria-label="Tenant Improvement Services Explorer">

        {/* Lobby stage */}
        <div className={`ti-lobby${isOpen ? ' ti-lobby--shifted' : ''}`}>
          <LobbySVG />

          {/* Photo reveal */}
          {current && (
            <div className={`ti-img-reveal${isOpen ? ' ti-img-reveal--visible' : ''}`}>
              <img src={current.src} alt={current.alt} loading="lazy" decoding="async" />
            </div>
          )}

          {/* Clickable zones */}
          {list.map((o, i) => (
            <HotspotZone key={o.id} offering={o} index={i} onActivate={activate} />
          ))}
        </div>

        {/* Vertical divider */}
        <div className={`ti-divider${isOpen ? ' ti-divider--visible' : ''}`} aria-hidden="true" />

        {/* Content panel */}
        {current && (
          <ContentPanel offering={current} visible={isOpen} contactHref={contactHref} />
        )}

        {/* Close */}
        <button
          className={`ti-close${isOpen ? ' ti-close--visible' : ''}`}
          onClick={deactivate}
          aria-label="Close panel"
        >
          ✕
        </button>

        {/* HUD */}
        <div className={`ti-hud${isOpen ? ' ti-hud--hidden' : ''}`} aria-hidden="true">
          <div className="ti-hud-firm">Nabih Youssef &amp; Associates</div>
          <div className="ti-hud-hint">Click a zone to explore our tenant improvement work</div>
        </div>

        {/* Bottom nav */}
        <nav className={`ti-nav${isOpen ? ' ti-nav--shifted' : ''}`} aria-label="Offering navigation">
          {list.map((o, i) => (
            <button
              key={o.id}
              className={`ti-nav-item${active === i ? ' ti-nav-item--active' : ''}`}
              onClick={() => (active === i ? deactivate() : activate(i))}
              aria-label={o.title}
              aria-pressed={active === i}
            >
              <div className="ti-nav-pip" aria-hidden="true" />
              <div className="ti-nav-num">{o.num}</div>
            </button>
          ))}
        </nav>

      </section>
    </>
  );
}

// ─── Scoped CSS ───────────────────────────────────────────────────────────────

const CSS = `
.ti-root {
  position: relative;
  width: 100%;
  height: 100svh;
  overflow: hidden;
  background: #0c0b09;
  color: #f2efe8;
  font-family: 'Outfit', sans-serif;
  user-select: none;
}

/* Scanline texture */
.ti-root::after {
  content: '';
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0,0,0,0.022) 2px,
    rgba(0,0,0,0.022) 4px
  );
  pointer-events: none;
  z-index: 1;
}

/* ── Lobby stage ──────────────────────────────── */
.ti-lobby {
  position: absolute;
  inset: 0;
  transition:
    transform 0.9s cubic-bezier(0.76, 0, 0.24, 1),
    filter 0.9s ease;
  will-change: transform, filter;
  transform-origin: center center;
}

.ti-lobby--shifted {
  transform: translateX(-38%) scale(0.88);
  filter: brightness(0.32) blur(2px);
}

/* ── Photo reveal ─────────────────────────────── */
.ti-img-reveal {
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity 0.85s ease;
  pointer-events: none;
}

.ti-img-reveal--visible { opacity: 1; }

.ti-img-reveal img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.ti-img-reveal::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to right,
    rgba(12,11,9,0.18) 0%,
    rgba(12,11,9,0.72) 52%,
    #0c0b09 100%
  );
}

/* ── Hotspot zones ────────────────────────────── */
.ti-zone {
  position: absolute;
  z-index: 5;
  cursor: pointer;
  outline: none;
}

.ti-zone::after {
  content: '';
  position: absolute;
  inset: -2px;
  border: 1px solid transparent;
  transition: border-color 0.3s ease;
  pointer-events: none;
}

.ti-zone:hover::after,
.ti-zone:focus-visible::after {
  border-color: rgba(184,147,90,0.35);
}

.ti-zone-label {
  position: absolute;
  bottom: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%) translateY(4px);
  background: rgba(12,11,9,0.9);
  border: 0.5px solid rgba(184,147,90,0.38);
  color: #d4aa72;
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  padding: 4px 10px;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.22s ease, transform 0.22s ease;
}

.ti-zone:hover .ti-zone-label,
.ti-zone:focus-visible .ti-zone-label {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}

/* Pulsing indicator */
.ti-dot-wrap {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.ti-dot-outer {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 1px solid #b8935a;
  opacity: 0.5;
  animation: ti-pulse 2.2s ease-in-out infinite;
}

.ti-dot-inner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #b8935a;
  opacity: 0.9;
}

.ti-zone:hover .ti-dot-outer,
.ti-zone:focus-visible .ti-dot-outer {
  animation: none;
  opacity: 0;
  transition: opacity 0.15s;
}

.ti-zone:hover .ti-dot-inner,
.ti-zone:focus-visible .ti-dot-inner {
  opacity: 0;
  transition: opacity 0.15s;
}

@keyframes ti-pulse {
  0%, 100% { transform: scale(1);    opacity: 0.5; }
  50%       { transform: scale(1.6); opacity: 0.1; }
}

/* ── Vertical divider ─────────────────────────── */
.ti-divider {
  position: absolute;
  top: 0;
  right: 44%;
  width: 0.5px;
  height: 100%;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    rgba(184,147,90,0.28) 22%,
    rgba(184,147,90,0.28) 78%,
    transparent 100%
  );
  z-index: 18;
  opacity: 0;
  transition: opacity 0.55s 0.4s ease;
  pointer-events: none;
}

.ti-divider--visible { opacity: 1; }

/* ── Content panel ────────────────────────────── */
.ti-panel {
  position: absolute;
  top: 0;
  right: 0;
  width: 44%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: clamp(1.5rem, 3vw, 3rem) clamp(1.5rem, 3.5vw, 3.5rem) clamp(1.5rem, 3vw, 3rem) clamp(1rem, 2.5vw, 2.5rem);
  z-index: 20;
  transition: opacity 0.65s 0.3s ease, transform 0.65s 0.3s ease;
}

.ti-panel-num {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: clamp(5rem, 11vw, 10rem);
  font-weight: 300;
  color: rgba(184,147,90,0.065);
  line-height: 1;
  position: absolute;
  top: -0.5rem;
  right: 1.5rem;
  pointer-events: none;
  letter-spacing: -0.04em;
  user-select: none;
}

.ti-panel-tag {
  font-size: 9px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #b8935a;
  margin: 0 0 1.1rem;
  display: flex;
  align-items: center;
  gap: 10px;
}

.ti-panel-tag::before {
  content: '';
  display: block;
  width: 28px;
  height: 0.5px;
  background: #b8935a;
  flex-shrink: 0;
}

.ti-panel-title {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: clamp(1.7rem, 3.2vw, 3rem);
  font-weight: 400;
  line-height: 1.08;
  color: #f2efe8;
  margin: 0 0 1.1rem;
  letter-spacing: -0.01em;
}

.ti-panel-headline {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-style: italic;
  font-size: clamp(0.92rem, 1.5vw, 1.15rem);
  color: rgba(242,239,232,0.48);
  line-height: 1.65;
  margin: 0 0 1.1rem;
  font-weight: 300;
}

.ti-panel-body {
  font-size: clamp(11px, 1.15vw, 13px);
  line-height: 1.88;
  color: rgba(242,239,232,0.4);
  margin: 0 0 1.3rem;
  max-width: 380px;
}

.ti-panel-bullets {
  list-style: none;
  margin: 0 0 1.7rem;
  padding: 0;
}

.ti-panel-bullets li {
  font-size: clamp(10px, 1.05vw, 12px);
  color: rgba(242,239,232,0.46);
  padding: 6px 0;
  border-top: 0.5px solid rgba(242,239,232,0.07);
  display: flex;
  align-items: flex-start;
  gap: 10px;
  line-height: 1.55;
}

.ti-panel-bullets li::before {
  content: '';
  display: block;
  width: 14px;
  height: 0.5px;
  background: #b8935a;
  margin-top: 8px;
  flex-shrink: 0;
}

.ti-panel-cta {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 11px 22px;
  background: transparent;
  border: 0.5px solid rgba(184,147,90,0.48);
  color: #d4aa72;
  font-family: 'Outfit', sans-serif;
  font-size: 11px;
  letter-spacing: 0.1em;
  cursor: pointer;
  transition: background 0.25s ease, border-color 0.25s ease;
  width: fit-content;
  text-decoration: none;
}

.ti-panel-cta:hover {
  background: rgba(184,147,90,0.08);
  border-color: #b8935a;
}

.ti-cta-arrow {
  display: inline-block;
  transition: transform 0.25s ease;
}

.ti-panel-cta:hover .ti-cta-arrow { transform: translateX(4px); }

/* ── Close button ─────────────────────────────── */
.ti-close {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  width: 36px;
  height: 36px;
  background: rgba(12,11,9,0.65);
  border: 0.5px solid rgba(184,147,90,0.22);
  color: rgba(242,239,232,0.32);
  font-size: 15px;
  cursor: pointer;
  z-index: 30;
  display: none;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease, border-color 0.2s ease;
  font-family: 'Outfit', sans-serif;
  line-height: 1;
}

.ti-close--visible { display: flex; }

.ti-close:hover {
  color: #f2efe8;
  border-color: rgba(184,147,90,0.55);
}

/* ── HUD ──────────────────────────────────────── */
.ti-hud {
  position: absolute;
  top: 1.8rem;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  z-index: 15;
  pointer-events: none;
  transition: opacity 0.4s ease;
  white-space: nowrap;
}

.ti-hud--hidden { opacity: 0; }

.ti-hud-firm {
  font-size: 8px;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: rgba(184,147,90,0.5);
  margin-bottom: 3px;
}

.ti-hud-hint {
  font-size: 10px;
  color: rgba(242,239,232,0.18);
  letter-spacing: 0.04em;
}

/* ── Bottom nav ───────────────────────────────── */
.ti-nav {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 18px;
  z-index: 25;
  align-items: center;
  transition:
    left 0.9s cubic-bezier(0.76, 0, 0.24, 1),
    transform 0.9s cubic-bezier(0.76, 0, 0.24, 1);
}

.ti-nav--shifted {
  left: 30%;
  transform: translateX(-50%);
}

.ti-nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  opacity: 0.28;
  transition: opacity 0.25s ease;
  padding: 0;
}

.ti-nav-item:hover,
.ti-nav-item--active { opacity: 1; }

.ti-nav-pip {
  width: 10px;
  height: 1.5px;
  background: rgba(184,147,90,0.4);
  transition: width 0.3s ease, background 0.3s ease;
}

.ti-nav-item--active .ti-nav-pip {
  width: 20px;
  background: #b8935a;
}

.ti-nav-num {
  font-size: 8px;
  letter-spacing: 0.15em;
  color: rgba(184,147,90,0.5);
  font-family: 'Outfit', sans-serif;
}

/* ── Responsive (mobile) ──────────────────────── */
@media (max-width: 768px) {
  .ti-lobby--shifted {
    transform: translateY(-28%) scale(0.8);
    filter: brightness(0.28) blur(3px);
  }

  .ti-divider { display: none; }

  .ti-panel {
    width: 100%;
    top: auto;
    bottom: 0;
    height: 58%;
    padding: 1.5rem 1.5rem 5rem;
    background: linear-gradient(to top, #0c0b09 65%, transparent 100%);
    justify-content: flex-start;
  }

  .ti-panel-num { display: none; }

  .ti-hud { top: 1rem; }

  .ti-nav {
    bottom: 1rem;
    left: 50% !important;
    transform: translateX(-50%) !important;
  }
}
`;
