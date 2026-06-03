import { useEffect, useState, useCallback } from 'react';
import styles from './SideNavOption3.module.css';

const SECTIONS = [
  { id: 'hero4',                   num: '00', label: 'Overview' },
  { id: 'section-ti-differences',  num: '01', label: 'TI Differences' },
  { id: 'section-firm-culture',    num: '02', label: 'Firm Culture' },
  { id: 'section-trust-wall',      num: '03', label: 'Trust & Clients' },
  { id: 'section-caring-firm',     num: '04', label: 'Our Ethos' },
  { id: 'section-cta',             num: '05', label: 'Get Started' },
];

function getSectionProgress(el) {
  if (!el) return 0;
  const rect = el.getBoundingClientRect();
  const vh = window.innerHeight;
  const p = -rect.top / (rect.height - vh);
  return Math.min(1, Math.max(0, p));
}

function NavItems({ activeIdx, progress, onClickSection }) {
  return (
    <ul className={styles.list}>
      {SECTIONS.map((section, idx) => {
        const isDone = idx < activeIdx;
        const isActive = idx === activeIdx;
        const state = isDone ? 'done' : isActive ? 'active' : 'upcoming';

        return (
          <li key={section.id} className={`${styles.item} ${styles[state]}`}>
            <button
              className={styles.btn}
              onClick={() => onClickSection(section.id)}
              aria-current={isActive ? 'true' : undefined}
              aria-label={`Go to ${section.label}`}
            >
              <span
                className={styles.fillBg}
                style={isActive ? { height: `${Math.round(progress * 100)}%` } : undefined}
              />
              <span className={styles.content}>
                <span className={styles.label}>{section.label}</span>
                <span className={styles.num}>{section.num}/</span>
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

export default function SideNavOption3() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const mid = window.innerHeight * 0.4;
      let best = 0;
      SECTIONS.forEach((s, i) => {
        const el = document.getElementById(s.id);
        if (!el) return;
        if (el.getBoundingClientRect().top <= mid) best = i;
      });
      setActiveIdx(best);
      setProgress(getSectionProgress(document.getElementById(SECTIONS[best].id)));
    };

    window.addEventListener('scroll', update, { passive: true });
    update();
    return () => window.removeEventListener('scroll', update);
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
    <nav className={`${styles.nav} ${styles.navRight}`} aria-label="Page sections">
      <NavItems activeIdx={activeIdx} progress={progress} onClickSection={handleClick} />
    </nav>
  );
}
