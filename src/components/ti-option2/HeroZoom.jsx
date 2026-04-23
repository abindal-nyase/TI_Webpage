import s from './HeroZoom.module.css'

export default function HeroZoom() {
  return (
    <section className={s.root}>
      <div className={s.placeholder}>
        <span className={s.label}>Act 1 — Hero Zoom</span>
        <p className={s.note}>Scroll-driven zoom into 550 S Hope St · Coming soon</p>
      </div>
    </section>
  )
}
