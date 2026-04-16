import { useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { gsap, ScrollTrigger } from '../../utils/gsap'
import { events } from '../../utils/analytics'
import styles from './ImageGallery.module.css'

export default function ImageGallery({ variant = 'horizontal', projects, sectionIndex }) {
  const containerRef = useRef(null)
  const trackRef     = useRef(null)
  const hasTracked   = useRef(false)

  // ── Horizontal: GSAP scroll-pinned horizontal track ──
  useEffect(() => {
    if (variant !== 'horizontal') return

    const ctx = gsap.context(() => {
      const totalWidth =
        trackRef.current.scrollWidth - containerRef.current.offsetWidth

      gsap.to(trackRef.current, {
        x: -totalWidth,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: `+=${totalWidth}`,
          pin: true,
          scrub: 1,
          onUpdate: (self) => {
            if (!hasTracked.current && self.progress > 0.5) {
              events.galleryScroll()
              hasTracked.current = true
            }
          },
        },
      })
    }, containerRef)

    events.sectionView(sectionIndex)
    return () => ctx.revert()
  }, [variant, sectionIndex])

  if (variant === 'horizontal') {
    return (
      <section ref={containerRef} className={styles.horizontal}>
        <p className={styles.horizontalEyebrow}>
          § {String(sectionIndex).padStart(2, '0')} &nbsp;—&nbsp; Selected Projects
        </p>
        <div ref={trackRef} className={styles.horizontalTrack}>
          {projects.map((project) => (
            <div key={project.id} className={styles.horizontalSlide}>
              <img src={project.src} alt={project.alt} loading="lazy" />
              <div className={styles.slideCaption}>
                <span className={styles.captionName}>{project.name}</span>
                <span className={styles.captionType}>
                  {project.location} &nbsp;·&nbsp; {project.type}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    )
  }

  // ── Masonry variant ──
  return (
    <MasonryGallery
      projects={projects}
      sectionIndex={sectionIndex}
    />
  )
}

function MasonryGallery({ projects, sectionIndex }) {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  useEffect(() => {
    if (inView) events.sectionView(sectionIndex)
  }, [inView, sectionIndex])

  return (
    <section ref={ref} className={styles.masonry}>
      <div className={styles.masonryInner}>
        <p className={styles.masonryEyebrow}>
          § {String(sectionIndex).padStart(2, '0')} &nbsp;—&nbsp; Our Work
        </p>
        <div className={styles.masonryGrid}>
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              className={styles.masonryItem}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <img src={project.src} alt={project.alt} loading="lazy" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
