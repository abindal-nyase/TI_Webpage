/*
 * TIDifferencesOption3 — SKELETON
 *
 * IMPORTANT: All styles MUST use CSS variables from the design system.
 * The theme switcher on option3.astro sets --color-primary, --color-accent,
 * --color-primary-light, --font-display, --font-body, etc. on :root at runtime.
 * Never hardcode colors or font families — always reference the CSS variable.
 *
 * Intent: Explains what makes TI structural engineering distinct from new construction.
 * Grid of differentiator cards with icon, title, body.
 */

import styles from './TIDifferencesOption3.module.css';

const DIFFERENCES = [
  {
    id: 1,
    icon: '01',
    title: 'Existing Conditions First',
    body: 'Placeholder: describes how TI engineers must understand the as-built building before designing anything new.',
  },
  {
    id: 2,
    icon: '02',
    title: 'Speed Is the Constraint',
    body: 'Placeholder: TI projects move on tenant timelines — not construction-phase schedules.',
  },
  {
    id: 3,
    icon: '03',
    title: 'Coordination Over Isolation',
    body: 'Placeholder: TI structural work is inseparable from MEP, architecture, and contractor sequencing.',
  },
  {
    id: 4,
    icon: '04',
    title: 'Hidden Surprises Are the Rule',
    body: 'Placeholder: Prior modifications, undocumented changes, and as-built drift are normal — not exceptional.',
  },
];

export default function TIDifferencesOption3() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>Why TI Is Different</p>
          <h2 className={styles.heading}>
            Section heading line one.<br />
            Section heading line two.
          </h2>
          <p className={styles.lead}>
            Section introduction copy. Two to three sentences that frame the differences.
          </p>
        </header>

        <div className={styles.grid}>
          {DIFFERENCES.map((d) => (
            <div key={d.id} className={styles.card}>
              <span className={styles.cardIcon}>{d.icon}</span>
              <h3 className={styles.cardTitle}>{d.title}</h3>
              <p className={styles.cardBody}>{d.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
