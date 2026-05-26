/*
 * VideoScrollOption3 — SKELETON
 *
 * IMPORTANT: All styles MUST use CSS variables from the design system.
 * The theme switcher on option3.astro sets --color-primary, --color-accent,
 * --color-primary-light, --font-display, --font-body, etc. on :root at runtime.
 * Never hardcode colors or font families — always reference the CSS variable.
 *
 * Intent: Scrolly-driven video narrative. As user scrolls, video scrubs
 * forward and overlay text chapters swap in/out.
 */

import styles from './VideoScrollOption3.module.css';

const CHAPTERS = [
  { id: 1, eyebrow: 'Chapter 01', heading: 'The Building Before the Brief', body: 'Chapter body copy describing what happens in this scene.' },
  { id: 2, eyebrow: 'Chapter 02', heading: 'What the Drawings Don\'t Show', body: 'Chapter body copy describing what happens in this scene.' },
  { id: 3, eyebrow: 'Chapter 03', heading: 'Structure in Service of Design', body: 'Chapter body copy describing what happens in this scene.' },
];

export default function VideoScrollOption3() {
  return (
    <section className={styles.section}>
      {/* Sticky video container */}
      <div className={styles.sticky}>
        <div className={styles.videoWrap}>
          {/* TODO: replace with <video> or canvas-based scrub */}
          <div className={styles.videoPlaceholder} aria-hidden="true">
            <span className={styles.videoLabel}>Video placeholder</span>
          </div>
          {/* Overlay text — active chapter driven by scroll progress */}
          <div className={styles.overlay}>
            <div className={styles.overlayInner}>
              <p className={styles.eyebrow} id="vs-eyebrow">{CHAPTERS[0].eyebrow}</p>
              <h2 className={styles.heading} id="vs-heading">{CHAPTERS[0].heading}</h2>
              <p className={styles.body} id="vs-body">{CHAPTERS[0].body}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll-trigger spacer — one per chapter */}
      {CHAPTERS.map((ch) => (
        <div
          key={ch.id}
          className={styles.chapter}
          data-chapter={ch.id}
          data-heading={ch.heading}
          data-eyebrow={ch.eyebrow}
          data-body={ch.body}
        />
      ))}
    </section>
  );
}
