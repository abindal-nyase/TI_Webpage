import Nav from './components/Nav/Nav'
import Hero from './components/Hero/Hero'
import IntroNarrative from './components/IntroNarrative/IntroNarrative'
import ScrollyNarrative from './components/ScrollyNarrative/ScrollyNarrative'
import TrustStatement from './components/TrustStatement/TrustStatement'
import ProjectGallery from './components/ProjectGallery/ProjectGallery'
import MidCTA from './components/MidCTA/MidCTA'
import StatsStrip from './components/StatsStrip/StatsStrip'
import AudienceCards from './components/AudienceCards/AudienceCards'
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
        {/* §2 Intro Narrative */}
        <IntroNarrative />
        {/* §3 Scrollytelling Narrative */}
        <ScrollyNarrative />
        {/* §4 Trust Statement */}
        <TrustStatement />
        {/* §5 Gallery */}
        <ProjectGallery />
        {/* §6 Mid CTA */}
        <MidCTA />
        {/* §7 Charts / Stats */}
        <StatsStrip />
        {/* §8 Audience Cards */}
        <AudienceCards />
        {/* §9 Offerings */}
        <Offerings />
        {/* §10 Testimonials + Service Detail */}
        <TestimonialsService />
        {/* §11 General Testimonials */}
        <Testimonials />
        {/* §12 Masonry Gallery */}
        <MasonryGallery />
        {/* §13 Final CTA */}
        <FinalCTA />
      </main>
    </>
  )
}
