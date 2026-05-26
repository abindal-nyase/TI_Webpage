/*
 * CaringFirmOption3 — SKELETON
 *
 * IMPORTANT: All styles MUST use CSS variables from the design system.
 * The theme switcher on option3.astro sets --color-primary, --color-accent,
 * --color-primary-light, --font-display, --font-body, etc. on :root at runtime.
 * Never hardcode colors or font families — always reference the CSS variable.
 *
 * Intent: Communicates NYA's ethos as a caring, relationship-first firm.
 * Split layout: text left, visual/quote right.
 */

import styles from './CaringFirmOption3.module.css';

const PILLARS = [
  { id: 1, title: 'We Listen Before We Draw', body: "Placeholder: Describes how NYA invests time in understanding the client's priorities before starting structural work." },
  { id: 2, title: 'Honest When It Matters', body: "Placeholder: Describes NYA's commitment to surfacing bad news early rather than hoping it resolves." },
  { id: 3, title: 'Here for the Whole Project', body: 'Placeholder: Describes how the engineer who scoped the work is the one answering RFIs at construction.' },
];

export default function CaringFirmOption3() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        {/* Left: text content */}
        <div className={styles.content}>
          <p className={styles.eyebrow}>A Caring Firm</p>
          <h2 className={styles.heading}>
            Section heading about care<br />
            and client relationships.
          </h2>
          <p className={styles.lead}>
            Section introduction copy. Two to three sentences about what makes NYA a caring firm.
          </p>

          <ul className={styles.pillars}>
            {PILLARS.map((p) => (
              <li key={p.id} className={styles.pillar}>
                <h3 className={styles.pillarTitle}>{p.title}</h3>
                <p className={styles.pillarBody}>{p.body}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Right: visual / quote panel */}
        <div className={styles.visual}>
          <figure className={styles.quote}>
            <blockquote className={styles.quoteText}>
              "Pull quote from a client or principal about what it means to work with NYA."
            </blockquote>
            <figcaption className={styles.quoteAttrib}>
              — Client Name, Title / Firm
            </figcaption>
          </figure>

          {/* Image placeholder */}
          <div className={styles.imgPlaceholder} aria-hidden="true">
            <span className={styles.imgLabel}>Image placeholder</span>
          </div>
        </div>
      </div>
    </section>
  );
}
