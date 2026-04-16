import { trackEvent, events } from './analytics'

beforeEach(() => {
  window.plausible = vi.fn()
})

afterEach(() => {
  delete window.plausible
})

test('trackEvent calls window.plausible with name and props', () => {
  trackEvent('test_event', { foo: 'bar' })
  expect(window.plausible).toHaveBeenCalledWith('test_event', { props: { foo: 'bar' } })
})

test('trackEvent is silent when plausible not loaded', () => {
  delete window.plausible
  expect(() => trackEvent('test_event')).not.toThrow()
})

test('events.ctaMidClick fires cta_mid_click', () => {
  events.ctaMidClick()
  expect(window.plausible).toHaveBeenCalledWith('cta_mid_click', { props: {} })
})

test('events.ctaFinalClick fires cta_final_click', () => {
  events.ctaFinalClick()
  expect(window.plausible).toHaveBeenCalledWith('cta_final_click', { props: {} })
})

test('events.sectionView fires with section number', () => {
  events.sectionView(3)
  expect(window.plausible).toHaveBeenCalledWith('section_view_3', { props: {} })
})

test('events.offeringHover fires with offering name', () => {
  events.offeringHover('Office TI')
  expect(window.plausible).toHaveBeenCalledWith('offering_hover', { props: { name: 'Office TI' } })
})
