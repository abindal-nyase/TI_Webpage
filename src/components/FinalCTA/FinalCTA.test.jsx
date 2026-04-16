import { render } from '@testing-library/react'
import FinalCTA from './FinalCTA'

vi.mock('../../utils/analytics', () => ({ events: { sectionView: vi.fn(), ctaFinalClick: vi.fn() } }))

test('FinalCTA renders headline and email link', () => {
  const { getByText, getByRole } = render(<FinalCTA />)
  expect(getByText(/Ready to move fast/i)).toBeInTheDocument()
  expect(getByRole('link', { name: /get in touch/i })).toHaveAttribute(
    'href',
    'mailto:info@nyase.com'
  )
})
