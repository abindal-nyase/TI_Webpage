import { useRef, useLayoutEffect } from 'react'
import gsap from 'gsap'
import s from './IntroNarrative.module.css'

export default function IntroNarrative() {
  const rootRef = useRef(null)
  const textRef = useRef(null)
  const pullRef = useRef(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top 75%',
          once: true,
          invalidateOnRefresh: true,
        },
        defaults: { ease: 'power3.out' },
      })
      tl.from(textRef.current.children, {
        autoAlpha: 0,
        y: 32,
        stagger: 0.14,
        duration: 0.85,
      }).from(pullRef.current, {
        autoAlpha: 0,
        y: 20,
        duration: 0.7,
      }, '-=0.4')
    }, rootRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={rootRef} id="what-ti-is" className={s.root}>
      <div className={s.inner}>
        <div ref={textRef} className={s.textBlock}>
          <span className={`u-label ${s.label}`}>What Makes TI Hard</span>
          <p className={s.body}>
            Tenant improvement is detail-driven work. You're not touching the primary structure — you're adapting to it. Every decision lives at the connection level: anchors, edge-of-slab conditions, hidden supports that aren't on any drawing.
          </p>
          <p className={s.body}>
            The stakes are real. Miss the smallest detail and there's nothing below you to fix it. That's what brings a structural engineer onto a TI project — not just stairs and partitions, but the certainty that someone with deep expertise caught everything before it reached the field.
          </p>
        </div>
        <blockquote ref={pullRef} className={s.pull}>
          The devil isn't in the structure.
          <em> It's in the connections.</em>
        </blockquote>
      </div>
    </section>
  )
}
