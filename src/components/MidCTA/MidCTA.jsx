import { useRef, useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import s from './MidCTA.module.css'

export default function MidCTA() {
  const rootRef = useRef(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(rootRef.current.querySelectorAll('.js-fade'), {
        autoAlpha: 0,
        y: 24,
        stagger: 0.12,
        duration: 0.75,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top 80%',
          once: true,
          invalidateOnRefresh: true,
        },
      })
    }, rootRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={rootRef} id="connect" className={s.root}>
      <div className={s.inner}>
        <span className={`u-label js-fade ${s.label}`}>Work With Us</span>
        <h2 className={`js-fade ${s.heading}`}>Working on a TI project?</h2>
        <p className={`js-fade ${s.sub}`}>
          We're typically available to kick off within the week.
          <br />
          Bring us your tight timelines, tangled gridlines, your last-minute
          stair.
        </p>
        <a
          href="mailto:info@nyase.com"
          className={`js-fade ${s.btn}`}
          aria-label="Email NYA about your tenant improvement project"
        >
          Let's Talk
          <span aria-hidden="true"> →</span>
        </a>
      </div>
    </section>
  );
}
