import { useRef } from 'react'
import { useIsomorphicLayoutEffect as useLayoutEffect } from '../../hooks/useIsomorphicLayoutEffect'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import s from './Hero4.module.css'

gsap.registerPlugin(ScrollTrigger)

/**
 * NYA isometric building — exact Paveletsky replica.
 *
 * CSS:   verbatim Paveletsky main.css (lines 181-406 + bg1/bg2)
 * GSAP:  animation.js tlFirstScroll converted to GSAP 3 + ScrollTrigger.
 *        ScrollMagic: triggerHook 0.2, duration 9000px, offset -250.
 *        GSAP 3: start 'top 20%', end '+=9000', scrub true.
 *
 * Timeline absolute positions (seconds) traced from the GSAP 2 "-=X" chain.
 * Total timeline duration: ~15970 s (scrubbed over 9000 px of scroll).
 *
 *  tween             start   duration
 *  l1                810     4580    → y -1100
 *  bg1 (move)        2650    2950    → y -3700
 *  bg1 (opacity)     5350    500     → opacity 1
 *  l2                3290    4580    → y -1500
 *  bg2               3710    4580    → y -3500
 *  l3                4050    4580    → y -1500
 *  l4                5630    4580    → y -1500
 *  l5                7170    4580    → y -1500
 *  bg1 (move2)       8250    4500    → y -5500
 *  l6                7890    4580    → y -1500
 *  l7                9010    4580    → y -1500
 *  l8                10850   4580    → y -1500
 *  section fade      11390   4580    → opacity 0
 */

const LAYERS = [
  { id: 1, base: '/nya-img/i1.png',  hover: '/nya-img/i1I.png' },
  { id: 2, base: '/nya-img/i2.png',  hover: '/nya-img/i2I.png' },
  { id: 3, base: '/nya-img/i3.png',  hover: '/nya-img/i3I.png' },
  { id: 4, base: '/nya-img/i4.png',  hover: '/nya-img/i4I.png' },
  { id: 5, base: '/nya-img/i5.png',  hover: '/nya-img/i5I.png' },
  { id: 6, base: '/nya-img/i6.png',  hover: '/nya-img/i6I.png' },
  { id: 7, base: '/nya-img/i7.png',  hover: '/nya-img/i7I.png' },
  { id: 8, base: '/nya-img/i8.png',  hover: '/nya-img/i8I.png' },
]

export default function Hero4() {
  const sectionRef  = useRef(null)
  const triggerRef  = useRef(null)
  const movehomeRef = useRef(null)
  const layerRefs   = useRef([])
  const bg1ImgRef   = useRef(null)
  const bg2ImgRef   = useRef(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const [l1, l2, l3, l4, l5, l6, l7, l8] = layerRefs.current

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerRef.current,
          start: 'top 20%',
          end: '+=9000',
          pin: true,
          scrub: true,
          invalidateOnRefresh: true,
        },
      })

      // Absolute positions (s) from Paveletsky animation.js tlFirstScroll
      tl
        // l1 — front layer, moves less
        .to(l1,               { y: -1100, duration: 4580 }, 810)

        // bg1 — background pan upward, then fade in
        .to(bg1ImgRef.current, { y: -3700, duration: 2950 }, 2650)
        .to(bg1ImgRef.current, { opacity: 1, duration: 500 }, 5350)

        // l2 — rises just after l1 starts
        .to(l2,               { y: -1500, duration: 4580 }, 3290)

        // bg2 — second background layer
        .to(bg2ImgRef.current, { y: -3500, duration: 4580 }, 3710)

        // l3
        .to(l3,               { y: -1500, duration: 4580 }, 4050)

        // l4
        .to(l4,               { y: -1500, duration: 4580 }, 5630)

        // l5
        .to(l5,               { y: -1500, duration: 4580 }, 7170)

        // bg1 second movement (continues panning)
        .to(bg1ImgRef.current, { y: -5500, duration: 4500 }, 8250)

        // l6
        .to(l6,               { y: -1500, duration: 4580 }, 7890)

        // l7
        .to(l7,               { y: -1500, duration: 4580 }, 9010)

        // l8 — back/ground layer, last to rise
        .to(l8,               { y: -1500, duration: 4580 }, 10850)

        // Fade out entire section at end of sequence
        .to(sectionRef.current, { opacity: 0, duration: 4580 }, 11390)

    }, triggerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="hero4" className={s.home}>
      <div ref={triggerRef} className={s.trigger}>

        {/* Building layers — exact Paveletsky DOM order */}
        <div ref={movehomeRef} className={s.movehome}>
          {LAYERS.map((layer, i) => (
            <div
              key={layer.id}
              className={`${s[`l${layer.id}`]} ${s.layer}`}
              ref={el => { layerRefs.current[i] = el }}
            >
              <img
                src={layer.base}
                alt=""
                draggable={false}
                className={s.imgBase}
              />
              <img
                src={layer.hover}
                alt=""
                draggable={false}
                className={s.imgHover}
              />
            </div>
          ))}
        </div>

        {/* Animated backgrounds — siblings to movehome, inside trigger */}
        <div className={s.bg1}>
          <img
            ref={bg1ImgRef}
            src="/pav-img/bg1.png"
            alt=""
            draggable={false}
            className={s.bg1Img}
          />
        </div>
        <div className={s.bg2}>
          <img
            ref={bg2ImgRef}
            src="/pav-img/bg1.png"
            alt=""
            draggable={false}
            className={s.bg2Img}
          />
        </div>

      </div>
    </section>
  )
}
