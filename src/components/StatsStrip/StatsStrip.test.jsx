import { render } from '@testing-library/react'
import StatsStrip from './StatsStrip'

vi.mock('../../utils/gsap', () => ({
  gsap: { context: vi.fn(() => ({ revert: vi.fn() })), from: vi.fn(), fromTo: vi.fn() },
  ScrollTrigger: { create: vi.fn() },
  SplitText: vi.fn(),
}))

vi.mock('../../utils/analytics', () => ({ events: { sectionView: vi.fn() } }))

test('StatsStrip renders all 4 stat labels', () => {
  const { getByText } = render(<StatsStrip />)
  expect(getByText(/TI Projects Completed/i)).toBeInTheDocument()
  expect(getByText(/Years in Practice/i)).toBeInTheDocument()
  expect(getByText(/LEED Certified/i)).toBeInTheDocument()
  expect(getByText(/Sq Ft Transformed/i)).toBeInTheDocument()
})
