import { stats } from './stats'
import { offerings } from './offerings'
import { testimonials } from './testimonials'
import { galleryProjects, masonryProjects } from './projects'
import { projectTypeData, permitWeeks } from './chartData'

test('stats has 4 entries with id, display, label', () => {
  expect(stats).toHaveLength(4)
  stats.forEach((s) => {
    expect(s).toHaveProperty('id')
    expect(s).toHaveProperty('display')
    expect(s).toHaveProperty('label')
  })
})

test('offerings has 6 entries with id, label, description', () => {
  expect(offerings).toHaveLength(6)
  offerings.forEach((o) => {
    expect(o).toHaveProperty('id')
    expect(o).toHaveProperty('label')
    expect(o).toHaveProperty('description')
  })
})

test('testimonials has 3 entries with quote, serviceDetail', () => {
  expect(testimonials).toHaveLength(3)
  testimonials.forEach((t) => {
    expect(t).toHaveProperty('quote')
    expect(t.serviceDetail).toHaveProperty('heading')
    expect(t.serviceDetail).toHaveProperty('body')
  })
})

test('galleryProjects has 8 entries with src, name, location', () => {
  expect(galleryProjects).toHaveLength(8)
  galleryProjects.forEach((p) => {
    expect(p).toHaveProperty('src')
    expect(p).toHaveProperty('name')
    expect(p).toHaveProperty('location')
  })
})

test('projectTypeData percentages sum to 100', () => {
  const sum = projectTypeData.reduce((acc, d) => acc + d.pct, 0)
  expect(sum).toBe(100)
})
