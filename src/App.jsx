import { useLenis } from './hooks/useLenis'

import Hero           from './components/Hero/Hero'
import IntroNarrative from './components/IntroNarrative/IntroNarrative'
import TrustStatement from './components/TrustStatement/TrustStatement'
import StatsStrip     from './components/StatsStrip/StatsStrip'
import ImageGallery   from './components/ImageGallery/ImageGallery'
import MidCTA         from './components/MidCTA/MidCTA'
import Charts         from './components/Charts/Charts'
import Offerings      from './components/Offerings/Offerings'
import Testimonials   from './components/Testimonials/Testimonials'
import FinalCTA       from './components/FinalCTA/FinalCTA'

import { galleryProjects, masonryProjects } from './data/projects'

export default function App() {
  useLenis()

  return (
    <main>
      <Hero />
      <IntroNarrative />
      <TrustStatement />
      <StatsStrip />
      <ImageGallery variant="horizontal" projects={galleryProjects} sectionIndex={5} />
      <MidCTA />
      <Charts />
      <Offerings />
      <Testimonials />
      <ImageGallery variant="masonry" projects={masonryProjects} sectionIndex={10} />
      <FinalCTA />
    </main>
  )
}
