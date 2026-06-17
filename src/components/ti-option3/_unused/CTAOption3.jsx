/*
 * CTAOption3 — SKELETON
 *
 * IMPORTANT: All styles MUST use CSS variables from the design system.
 * The theme switcher on option3.astro sets --color-primary, --color-accent,
 * --color-primary-light, --font-display, --font-body, etc. on :root at runtime.
 * Never hardcode colors or font families — always reference the CSS variable.
 *
 * Intent: Final call-to-action section. Centered layout with heading, body, two buttons.
 */

import styles from './CTAOption3.module.css';

export default function CTAOption3() {
  return (
    <section id="section-cta" className={styles.section}>
      <div className={styles.inner}>
        <p className={styles.eyebrow}>Get Started</p>
        <h2 className={styles.heading}>
          Ready to work with<br />
          engineers who actually care?
        </h2>
        <p className={styles.body}>
          CTA body copy. One to two sentences that give the reader final reassurance and a clear next step.
        </p>
        <div className={styles.actions}>
          <a href="#contact" className={styles.btnPrimary}>
            Start a Conversation
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
          <a href="#work" className={styles.btnSecondary}>See Our Work</a>
        </div>

        {/* Trust signals row */}
        <div className={styles.trust}>
          <span className={styles.trustItem}>35+ years in practice</span>
          <span className={styles.trustDot} aria-hidden="true" />
          <span className={styles.trustItem}>LA · SF · 8 cities</span>
          <span className={styles.trustDot} aria-hidden="true" />
          <span className={styles.trustItem}>Principal on every project</span>
        </div>
      </div>
    </section>
  );
}
