/*
 * HeroOption3 — SKELETON
 *
 * IMPORTANT: All styles MUST use CSS variables from the design system.
 * The theme switcher on option3.astro sets --color-primary, --color-accent,
 * --color-primary-light, --font-display, --font-body, etc. on :root at runtime.
 * Never hardcode colors or font families — always reference the CSS variable.
 */

import styles from './HeroOption3.module.css';

export default function HeroOption3() {
  return (
    <section className={styles.hero}>
      <div className={styles.inner}>
        <p className={styles.eyebrow}>Tenant Improvement Engineering</p>
        <h1 className={styles.heading}>
          Heading line one.<br />
          Heading line two.
        </h1>
        <p className={styles.subheading}>
          Subheading / value proposition copy goes here. Two to three sentences max.
        </p>
        <div className={styles.actions}>
          <a href="#contact" className={styles.btnPrimary}>Primary CTA</a>
          <a href="#work" className={styles.btnSecondary}>Secondary CTA</a>
        </div>
      </div>
      {/* Background image / video layer placeholder */}
      <div className={styles.bg} aria-hidden="true" />
    </section>
  );
}
