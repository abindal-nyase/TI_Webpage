import { useRef } from 'react'
import { useIsomorphicLayoutEffect as useLayoutEffect } from '../../hooks/useIsomorphicLayoutEffect'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import s from './TestimonialsService.module.css'

const SERVICE_ROWS = [
  {
    label: 'For Architects',
    headline: 'We speak your language. On deadline.',
    body: "Architects want responsive engineers — professional, available, and on call. They don't need creativity from their SE. They need someone who will be on top of a fast project and turn around deliverables fast. That's us. Our clients say we feel like part of their office.",
    quote: "\u201cThey pick up the phone. Every time. And they actually understand what we\u2019re trying to design.\u201d",
    quoteBy: 'Principal Architect, Interior Design Studio',
    bullets: ['Fast turnaround on feasibility studies', 'Clear, architect-readable drawings', 'Available for field visits same week'],
    img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=900&q=80',
    imgAlt: 'Architect reviewing structural drawings with NYA engineers at project site',
    imgLeft: false,
  },
  {
    label: 'For Owners',
    headline: 'We know your building. We protect your investment.',
    body: "Owners want familiarity, low risk, and controlled cost. We've been in hundreds of California high-rises. We know how aging structures behave. When you call us for a lobby renovation or tenant fit-out, you're calling a team that already understands what you're working with.",
    quote: "\u201cWe\u2019ve used NYA on four different floors of this building. They know our structure better than our own records do.\u201d",
    quoteBy: 'VP of Property Operations, Century City',
    bullets: ['No surprises — we know existing conditions', 'Avoid triggering major structural upgrades', 'Peer review services available'],
    img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=900&q=80',
    imgAlt: 'Building owner reviewing lobby renovation plans with structural engineering team',
    imgLeft: true,
  },
  {
    label: 'For Property Managers',
    headline: 'Your reputation is on the line. Ours too.',
    body: "Property managers carry the risk when a contractor underperforms. We understand that. We've worked alongside building management teams for decades — we're the name they bring to architects because they know we won't create problems, we'll solve them.",
    quote: "\u201cWith NYA, I know the project won\u2019t blow up in my face. That\u2019s not a small thing when you\u2019re managing 40 floors of active tenants.\u201d",
    quoteBy: 'Senior Property Manager, Downtown Los Angeles',
    bullets: ['Familiarity with your building systems and records', 'Competence that protects your standing with ownership', 'No logistics headwind — easy entry, clean execution'],
    img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=900&q=80',
    imgAlt: 'Property manager coordinating tenant improvement work in occupied high-rise',
    imgLeft: false,
  },
]

export default function TestimonialsService() {
  const rootRef = useRef(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.batch(`.${s.row}`, {
        onEnter: (els) =>
          gsap.from(els, {
            autoAlpha: 0,
            y: 40,
            duration: 0.9,
            stagger: 0.15,
            ease: 'power3.out',
          }),
        start: 'top 80%',
        once: true,
        invalidateOnRefresh: true,
      })
    }, rootRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={rootRef} id="service-detail" className={s.root}>
      <div className={s.inner}>
        <span className={`u-label ${s.sectionLabel}`}>Client Perspective</span>

        {SERVICE_ROWS.map((row) => (
          <div
            key={row.label}
            className={`${s.row} ${row.imgLeft ? s.imgLeft : ''}`}
          >
            {/* Image */}
            <div className={s.imgWrap}>
              <img src={row.img} alt={row.imgAlt} loading="lazy" className={s.img} />
              <div className={s.imgOverlay}>
                <span className={`u-label`}>{row.label}</span>
              </div>
            </div>

            {/* Content */}
            <div className={s.content}>
              <span className={`u-label ${s.rowLabel}`}>{row.label}</span>
              <h3 className={s.headline}>{row.headline}</h3>
              <p className={s.body}>{row.body}</p>

              <blockquote className={s.quote}>
                <p className={s.quoteText}>{row.quote}</p>
                <cite className={s.quoteCite}>— {row.quoteBy}</cite>
              </blockquote>

              <ul className={s.bullets} role="list">
                {row.bullets.map((b) => (
                  <li key={b} className={s.bullet}>
                    <span className={s.bulletDash} aria-hidden="true">—</span>
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
