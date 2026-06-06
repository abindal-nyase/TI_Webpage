import s from './Footer.module.css'

const NAV_COLS = [
  {
    heading: 'Navigate',
    links: [
      { label: 'Home',       href: '#' },
      { label: 'Services',   href: '#' },
      { label: 'Projects',   href: '#' },
      { label: 'Leadership', href: '#' },
      { label: 'Awards',     href: '#' },
    ],
  },
  {
    heading: 'Contact',
    links: [
      { label: 'info@nyase.com',       href: 'mailto:info@nyase.com' },
      { label: '(213) 362-0707',                          href: 'tel:+12133620707' },
      { label: '350 S Grand Ave #1600, Los Angeles, CA 90071', href: 'https://maps.google.com/?q=350+S+Grand+Ave+1600+Los+Angeles+CA+90071', external: true },
    ],
  },
  {
    heading: 'Social',
    links: [
      { label: 'LinkedIn',   href: '#', external: true },
      { label: 'Instagram',  href: '#', external: true },
      { label: 'YouTube',    href: '#', external: true },
    ],
  },
  {
    heading: 'Resources',
    links: [
      { label: 'Company Profile', href: '#' },
      { label: 'Brochure',        href: '#' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className={s.footer}>

      {/* ── Top — headline + CTA ── */}
      <div className={s.top}>
        <p className={s.eyebrow}>Nabih Youssef &amp; Associates</p>
        <h2 className={s.headline}>Always Within Reach</h2>
        <a href="mailto:info@nyase.com" className={s.cta}>
          Send Us an Email
        </a>
      </div>

      {/* ── Divider ── */}
      <div className={s.divider} />

      {/* ── Bottom — 4-column grid ── */}
      <div className={s.grid}>
        {NAV_COLS.map(col => (
          <div key={col.heading} className={s.col}>
            <p className={s.colHeading}>{col.heading}</p>
            <ul className={s.list}>
              {col.links.map(link => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className={s.link}
                    {...(link.external
                      ? { target: '_blank', rel: 'noopener noreferrer' }
                      : {})}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* ── Copyright ── */}
      <div className={s.bar}>
        <span className={s.copy}>
          &copy; {new Date().getFullYear()} Nabih Youssef &amp; Associates. All rights reserved.
        </span>
        <span className={s.copy}>Tenant Improvement Specialists · Los Angeles, CA</span>
      </div>

    </footer>
  )
}
