import { render } from '@testing-library/react'
import ImageGallery from './ImageGallery'
import { galleryProjects, masonryProjects } from '../../data/projects'

vi.mock('../../utils/gsap', () => ({
  gsap: { context: vi.fn(() => ({ revert: vi.fn() })), to: vi.fn(), from: vi.fn() },
  ScrollTrigger: { create: vi.fn() },
  SplitText: vi.fn(),
}))

vi.mock('../../utils/analytics', () => ({ events: { sectionView: vi.fn(), galleryScroll: vi.fn() } }))

test('renders horizontal variant with all gallery images', () => {
  const { getAllByRole } = render(
    <ImageGallery variant="horizontal" projects={galleryProjects} sectionIndex={5} />
  )
  expect(getAllByRole('img').length).toBe(galleryProjects.length)
})

test('renders masonry variant with masonry images', () => {
  const { getAllByRole } = render(
    <ImageGallery variant="masonry" projects={masonryProjects} sectionIndex={10} />
  )
  expect(getAllByRole('img').length).toBe(masonryProjects.length)
})
