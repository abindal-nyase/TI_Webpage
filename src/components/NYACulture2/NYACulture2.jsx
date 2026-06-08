import s from './NYACulture2.module.css'

const DESCRIPTION =
  'At NYA, integrity guides all employees in their daily activities. Through clear guidelines, ongoing training, and open communication, we empower our team to uphold the highest ethical standards. Our senior management leads by example, fostering a culture where integrity and ethical behavior are paramount.'

const ITEMS = [
  {
    id: 'ethical',
    title: 'Ethical Culture at Every Level',
    content:
      'Integrity is woven into every decision we make. Through clear policies and consistent leadership, every member of our team upholds the same standard of ethical conduct on every project.',
  },
  {
    id: 'policy',
    title: 'Policy and Development',
    content:
      'Our policies are living documents — regularly reviewed, updated, and communicated to ensure they reflect best practices and the evolving landscape of the built environment.',
  },
  {
    id: 'training',
    title: 'Continuous Training',
    content:
      'We invest in ongoing education so every team member is equipped to navigate complex situations with confidence, from contract compliance to client communication.',
  },
  {
    id: 'monitoring',
    title: 'Monitoring and Auditing',
    content:
      'Regular internal reviews and transparent audit processes ensure accountability across all phases of a project — from permit to punch list.',
  },
  {
    id: 'reporting',
    title: 'Reporting Mechanisms',
    content:
      'Clear, confidential channels allow any team member to raise concerns without fear. We protect those who speak up, because transparency starts with trust.',
  },
  {
    id: 'shared',
    title: 'A Shared Responsibility',
    content:
      'Ethical conduct is not a top-down mandate — it is a commitment embraced at every level, from senior leadership to field teams, because our reputation is built one decision at a time.',
  },
]

export default function NYACulture2() {
  return (
    <section id="nya-culture-2" className={s.section}>
      <div className={s.grid}>

        {/* ── Row 1 Left — subtitle ── */}
        <div className={s.leftHeader}>
          <h2 className={s.subtitle}>A Culture of Trust</h2>
        </div>

        {/* ── Row 2 Left — image ── */}
        <div className={s.leftMain}>
          <img
            src="/pav-img/NYA Group Photo 2025.jpg"
            alt="NYA team — group photo 2025"
            draggable={false}
            className={s.img}
          />
        </div>

        {/* ── Row 2 Right — description + hover accordion ── */}
        <div className={s.rightMain}>
          <p className={s.description}>{DESCRIPTION}</p>

          <ul className={s.accordion}>
            {ITEMS.map(item => (
              <li key={item.id} className={s.item}>
                <div className={s.itemRow}>
                  <span className={s.itemTitle}>{item.title}</span>
                  <span className={s.itemIcon} aria-hidden="true" />
                </div>
                <div className={s.itemBody}>
                  <p className={s.itemContent}>{item.content}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </section>
  )
}
