import { renderHook } from '@testing-library/react'
import { useLenis } from './useLenis'

// Mock Lenis — jsdom has no real scroll engine
vi.mock('lenis', () => {
  class MockLenis {
    constructor() {
      this.on = vi.fn()
      this.raf = vi.fn()
      this.destroy = vi.fn()
    }
  }
  return {
    default: MockLenis,
  }
})

vi.mock('../utils/gsap', () => ({
  gsap: {
    ticker: { add: vi.fn(), remove: vi.fn(), lagSmoothing: vi.fn() },
  },
  ScrollTrigger: { update: vi.fn() },
  SplitText: vi.fn(),
}))

test('useLenis mounts and unmounts without error', () => {
  const { unmount } = renderHook(() => useLenis())
  expect(() => unmount()).not.toThrow()
})
