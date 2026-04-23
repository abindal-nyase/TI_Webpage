import s from './StatsSection.module.css'

export default function StatsSection() {
  return (
    <section className={s.root}>
      <div className={s.placeholder}>
        <span className={s.label}>Stats Section</span>
        <p className={s.note}>Concise animated counters · Coming soon</p>
      </div>
    </section>
  )
}
