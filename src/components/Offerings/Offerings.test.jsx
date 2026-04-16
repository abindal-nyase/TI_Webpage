import { render } from '@testing-library/react'
import Offerings from './Offerings'

vi.mock('../../utils/analytics', () => ({ events: { sectionView: vi.fn(), offeringHover: vi.fn() } }))

test('Offerings renders all 6 service cards', () => {
  const { getAllByRole } = render(<Offerings />)
  expect(getAllByRole('article').length).toBe(6)
})
