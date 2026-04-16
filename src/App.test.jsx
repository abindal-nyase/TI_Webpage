import { render } from '@testing-library/react'
import App from './App'

vi.mock('./hooks/useLenis', () => ({ useLenis: vi.fn() }))

vi.mock('./utils/gsap', () => ({
  gsap: {
    context: vi.fn(() => ({ revert: vi.fn() })),
    from: vi.fn(),
    fromTo: vi.fn(),
    to: vi.fn(),
    ticker: { add: vi.fn(), remove: vi.fn(), lagSmoothing: vi.fn() },
  },
  ScrollTrigger: { create: vi.fn(), update: vi.fn() },
  SplitText: vi.fn().mockImplementation(() => ({ words: [], revert: vi.fn() })),
}))

vi.mock('./utils/analytics', () => ({
  events: {
    sectionView: vi.fn(),
    ctaMidClick: vi.fn(),
    ctaFinalClick: vi.fn(),
    galleryScroll: vi.fn(),
    offeringHover: vi.fn(),
  },
}))

test('App renders without crashing', () => {
  expect(() => render(<App />)).not.toThrow()
})
