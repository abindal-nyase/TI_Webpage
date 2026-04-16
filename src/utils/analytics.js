export function trackEvent(eventName, props = {}) {
  if (typeof window !== 'undefined' && typeof window.plausible === 'function') {
    window.plausible(eventName, { props })
  }
}

export const events = {
  ctaMidClick:    () => trackEvent('cta_mid_click'),
  ctaFinalClick:  () => trackEvent('cta_final_click'),
  galleryScroll:  () => trackEvent('gallery_scroll'),
  sectionView:    (n) => trackEvent(`section_view_${n}`),
  offeringHover:  (name) => trackEvent('offering_hover', { name }),
}
