import { render } from '@testing-library/react'
import Charts from './Charts'

vi.mock('../../utils/gsap', () => ({
  gsap: { context: vi.fn(() => ({ revert: vi.fn() })), fromTo: vi.fn() },
  ScrollTrigger: { create: vi.fn() },
  SplitText: vi.fn(),
}))

vi.mock('../../utils/analytics', () => ({ events: { sectionView: vi.fn() } }))

test('Charts renders project type labels', () => {
  const { getByText } = render(<Charts />)
  expect(getByText(/Office/i)).toBeInTheDocument()
  expect(getByText(/Media/i)).toBeInTheDocument()
})

test('Charts renders permit turnaround stat', () => {
  const { getByText } = render(<Charts />)
  expect(getByText(/permit turnaround/i)).toBeInTheDocument()
})
