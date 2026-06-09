import s from './FooterOption3.module.css';

const NAV_COLS = [
  {
    heading: 'Navigate',
    links: [
      { label: 'Home',       href: 'https://www.nyase.com/' },
      { label: 'Services',   href: 'https://www.nyase.com/expertise/' },
      { label: 'Projects',   href: 'https://www.nyase.com/projects-2/' },
      { label: 'Leadership', href: 'https://www.nyase.com/leadership/' },
    ],
  },
  {
    heading: 'Contact',
    links: [
      { label: 'info@nyase.com',                               href: 'mailto:info@nyase.com' },
      { label: '(213) 362-0707',                               href: 'tel:+12133620707' },
      { label: '350 S Grand Ave #1600, Los Angeles, CA 90071', href: 'https://maps.google.com/?q=350+S+Grand+Ave+1600+Los+Angeles+CA+90071', external: true },
    ],
  },
  {
    heading: 'Social',
    links: [
      { label: 'LinkedIn',  href: 'https://www.linkedin.com/company/nabih-youssef-associates/', external: true },
      { label: 'Instagram', href: 'https://www.instagram.com/nabihyoussefassociates',           external: true },
      { label: 'YouTube',   href: 'https://www.youtube.com/@NYA_SE',                            external: true },
      { label: 'X',         href: 'https://x.com/NYandAssociates',                              external: true },
    ],
  },
  {
    heading: 'Resources',
    links: [
      { label: 'Company Profile', href: '/resources/company-profile-placeholder.pdf', external: true },
    ],
  },
];

export default function FooterOption3() {
  return (
    <footer id="section-footer" className={s.footer}>

      {/* ── Top — headline + CTA ── */}
      <div className={s.top}>
        <p className={s.eyebrow}>Nabih Youssef &amp; Associates</p>
        <h2 className={s.headline}>Always Within Reach</h2>
        <a href="mailto:info@nyase.com" className={s.cta}>
          Send Us an Email
        </a>
      </div>

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
                    {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
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
  );
}
