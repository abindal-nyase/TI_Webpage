import { render } from '@testing-library/react'
import IntroNarrative from './IntroNarrative'

test('IntroNarrative renders two columns of text', () => {
  const { container } = render(<IntroNarrative />)
  const cols = container.querySelectorAll('[data-col]')
  expect(cols.length).toBe(2)
})
