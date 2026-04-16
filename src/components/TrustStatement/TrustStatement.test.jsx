import { render } from '@testing-library/react'
import TrustStatement from './TrustStatement'

vi.mock('../../utils/gsap', () => ({
  gsap: { context: vi.fn(() => ({ revert: vi.fn() })), from: vi.fn() },
  ScrollTrigger: { create: vi.fn() },
  SplitText: vi.fn().mockImplementation(() => ({ words: [], revert: vi.fn() })),
}))

vi.mock('../../utils/analytics', () => ({ events: { sectionView: vi.fn() } }))

test('TrustStatement renders the pull quote', () => {
  const { getByText } = render(<TrustStatement />)
  expect(getByText(/We don't slow architects down/i)).toBeInTheDocument()
})
