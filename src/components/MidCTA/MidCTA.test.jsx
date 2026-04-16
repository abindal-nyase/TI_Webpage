import { render } from '@testing-library/react'
import MidCTA from './MidCTA'

vi.mock('../../utils/analytics', () => ({ events: { ctaMidClick: vi.fn(), sectionView: vi.fn() } }))

test('MidCTA renders email link', () => {
  const { getByRole } = render(<MidCTA />)
  const link = getByRole('link')
  expect(link).toHaveAttribute('href', 'mailto:info@nyase.com')
})
