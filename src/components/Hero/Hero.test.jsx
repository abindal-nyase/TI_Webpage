import { render } from '@testing-library/react'
import Hero from './Hero'

// Mock GSAP — no real DOM scroll in jsdom
vi.mock('../../utils/gsap', () => ({
  gsap: { from: vi.fn(), to: vi.fn(), context: vi.fn(() => ({ revert: vi.fn() })) },
  ScrollTrigger: { create: vi.fn() },
  SplitText: vi.fn().mockImplementation(() => ({ words: [], revert: vi.fn() })),
}))

// Mock analytics — Hero calls events.sectionView(1)
vi.mock('../../utils/analytics', () => ({
  trackEvent: vi.fn(),
  events: {
    sectionView: vi.fn(),
    ctaMidClick: vi.fn(),
    ctaFinalClick: vi.fn(),
    galleryScroll: vi.fn(),
    offeringHover: vi.fn(),
  },
}))

test('Hero renders headline and scroll indicator', () => {
  const { getAllByText, getByText } = render(<Hero />)
  // Both h1 headline and eyebrow contain "Tenant improvement" — verify at least one exists
  expect(getAllByText(/Tenant improvement/i).length).toBeGreaterThan(0)
  expect(getByText(/scroll/i)).toBeInTheDocument()
})
