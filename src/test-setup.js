import '@testing-library/jest-dom'

// jsdom doesn't provide IntersectionObserver — mock globally for framer-motion useInView
global.IntersectionObserver = class {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
}
