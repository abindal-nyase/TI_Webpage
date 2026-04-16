import { render, fireEvent } from '@testing-library/react'
import Testimonials from './Testimonials'

vi.mock('../../utils/analytics', () => ({ events: { sectionView: vi.fn() } }))

test('Testimonials renders first quote', () => {
  const { getByText } = render(<Testimonials />)
  expect(getByText(/NYA kept our project on schedule/i)).toBeInTheDocument()
})

test('Testimonials advances to next quote on arrow click', () => {
  const { getByLabelText, getByText } = render(<Testimonials />)
  fireEvent.click(getByLabelText('Next testimonial'))
  expect(getByText(/They understand the pace/i)).toBeInTheDocument()
})
