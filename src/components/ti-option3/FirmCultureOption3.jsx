/*
 * FirmCultureOption3 — SKELETON
 *
 * IMPORTANT: All styles MUST use CSS variables from the design system.
 * The theme switcher on option3.astro sets --color-primary, --color-accent,
 * --color-primary-light, --font-display, --font-body, etc. on :root at runtime.
 * Never hardcode colors or font families — always reference the CSS variable.
 *
 * Intent: Shows what it's like to work at/with NYA — culture, values, team.
 * Dark background section with stat callouts and team/culture imagery.
 */

import styles from './FirmCultureOption3.module.css';

const STATS = [
  { value: '35+', label: 'Years in practice' },
  { value: '2,000+', label: 'TI projects completed' },
  { value: '8', label: 'Cities served' },
  { value: '100%', label: 'Principal involvement' },
];

const VALUES = [
  { id: 1, title: 'Serious Work, Seriously Done', body: 'Placeholder: culture value body copy describing how NYA approaches quality.' },
  { id: 2, title: 'Principal-Led, Always', body: 'Placeholder: culture value body copy describing firm structure and accountability.' },
  { id: 3, title: 'Long Relationships, Not Transactions', body: 'Placeholder: culture value body copy about how NYA builds lasting partnerships.' },
];

export default function FirmCultureOption3() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>Firm Culture</p>
          <h2 className={styles.heading}>
            Heading about who we are<br />
            and how we work.
          </h2>
        </header>

        {/* Stats row */}
        <div className={styles.stats}>
          {STATS.map((s, i) => (
            <div key={i} className={styles.stat}>
              <span className={styles.statValue}>{s.value}</span>
              <span className={styles.statLabel}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* Values grid */}
        <div className={styles.values}>
          {VALUES.map((v) => (
            <div key={v.id} className={styles.valueCard}>
              <h3 className={styles.valueTitle}>{v.title}</h3>
              <p className={styles.valueBody}>{v.body}</p>
            </div>
          ))}
        </div>

        {/* Image placeholder row */}
        <div className={styles.imageRow} aria-hidden="true">
          <div className={styles.imgSlot} />
          <div className={styles.imgSlot} />
          <div className={styles.imgSlot} />
        </div>
      </div>
    </section>
  );
}
