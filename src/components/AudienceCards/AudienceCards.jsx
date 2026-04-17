import { useRef } from 'react'
import { useIsomorphicLayoutEffect as useLayoutEffect } from '../../hooks/useIsomorphicLayoutEffect'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import s from './AudienceCards.module.css'

const AUDIENCES = [
  {
    label: 'Architect',
    priority: 'Speed and responsiveness. You need someone on-call, fast turnaround, ready at kickoff.',
    answer: 'We pick up. Every time.',
  },
  {
    label: 'Building Owner',
    priority: 'Familiarity and relationship. You want the engineer who already knows your building — no transition cost, no rework.',
    answer: "We've probably already been in your building.",
  },
  {
    label: 'Property Manager',
    priority: 'Zero margin for error. Your reputation is on the line if this goes wrong.',
    answer: "We're the safe hands your team will thank you for.",
  },
]

export default function AudienceCards() {
  const rootRef = useRef(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.batch(`.${s.card}`, {
        onEnter: (els) =>
          gsap.from(els, {
            autoAlpha: 0,
            y: 40,
            stagger: 0.14,
            duration: 0.85,
            ease: 'power3.out',
          }),
        start: 'top 85%',
        once: true,
        invalidateOnRefresh: true,
      })
    }, rootRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={rootRef} id="audiences" className={s.root}>
      <div className={s.inner}>
        <span className={`u-label ${s.label}`}>Who We Work With</span>
        <div className={s.grid}>
          {AUDIENCES.map(({ label, priority, answer }) => (
            <div key={label} className={s.card}>
              <span className={`u-label ${s.cardLabel}`}>{label}</span>
              <p className={s.priority}>{priority}</p>
              <p className={s.answer}>{answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
