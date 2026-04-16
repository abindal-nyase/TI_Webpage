import Nav from './components/Nav/Nav'
import Hero from './components/Hero/Hero'
import ScrollyNarrative from './components/ScrollyNarrative/ScrollyNarrative'
import TrustStatement from './components/TrustStatement/TrustStatement'
import ProjectGallery from './components/ProjectGallery/ProjectGallery'
import MidCTA from './components/MidCTA/MidCTA'
import StatsStrip from './components/StatsStrip/StatsStrip'
import Offerings from './components/Offerings/Offerings'
import TestimonialsService from './components/TestimonialsService/TestimonialsService'
import Testimonials from './components/Testimonials/Testimonials'
import MasonryGallery from './components/MasonryGallery/MasonryGallery'
import FinalCTA from './components/FinalCTA/FinalCTA'

export default function App() {
  return (
    <>
      <Nav />
      <main>
        {/* §1 Hero */}
        <Hero />
        {/* §2 Scrollytelling Narrative */}
        <ScrollyNarrative />
        {/* §3 Trust Statement */}
        <TrustStatement />
        {/* §4 Gallery */}
        <ProjectGallery />
        {/* §5 Mid CTA */}
        <MidCTA />
        {/* §6 Charts / Stats */}
        <StatsStrip />
        {/* §7 Offerings */}
        <Offerings />
        {/* §8 Testimonials + Service Detail */}
        <TestimonialsService />
        {/* §9 General Testimonials */}
        <Testimonials />
        {/* §10 Masonry Gallery */}
        <MasonryGallery />
        {/* §11 Final CTA */}
        <FinalCTA />
      </main>
    </>
  )
}
