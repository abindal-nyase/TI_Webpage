import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import s from './Nav.module.css'
const nyaLogo = '/nya-logo.png'

const NAV_LINKS = [
  { label: 'Work',    href: '#gallery' },
  { label: 'Proof',   href: '#stats' },
  { label: 'Connect', href: '#connect' },
]

export default function Nav() {
  const navRef = useRef(null)

  useEffect(() => {
    // Transparent → solid on scroll
    ScrollTrigger.create({
      start: '80px top',
      invalidateOnRefresh: true,
      onEnter:     () => navRef.current?.classList.add(s.scrolled),
      onLeaveBack: () => navRef.current?.classList.remove(s.scrolled),
    })
    return () => ScrollTrigger.getAll().forEach((t) => t.kill())
  }, [])

  const handleAnchor = (e, href) => {
    e.preventDefault()
    const el = document.querySelector(href)
    if (el && window.__lenis) window.__lenis.scrollTo(el, { offset: -80, duration: 1.4 })
  }

  return (
    <nav ref={navRef} className={s.nav} role="navigation" aria-label="Main navigation">
      <div className={s.inner}>
        {/* Logo */}
        <a href="#" className={s.logo} aria-label="NYA Tenant Improvement home">
          <img
            src={nyaLogo}
            alt="Nabih Youssef Associates"
            className={s.logoImg}
          />
          <span className={s.logoDivider} aria-hidden="true" />
          <span className={s.logoSub}>Tenant Improvement</span>
        </a>

        {/* Links */}
        <ul className={s.links} role="list">
          {NAV_LINKS.map(({ label, href }) => (
            <li key={href}>
              <a
                href={href}
                className={s.link}
                onClick={(e) => handleAnchor(e, href)}
              >
                <span className={s.linkInner} aria-hidden="true">{label}</span>
                <span className={s.linkInner}>{label}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
