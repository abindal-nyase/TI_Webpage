export const galleryProjects = [
  {
    id: 'p1',
    name: 'Herald Examiner Building',
    location: 'Los Angeles, CA',
    type: 'Historic Renovation',
    src: 'https://images.unsplash.com/photo-1588854337236-6889d631faa8?w=1200&q=80',
    alt: 'Historic building facade with modern structural interior transformation',
  },
  {
    id: 'p2',
    name: '1888 Century Park East',
    location: 'Century City, CA',
    type: 'Office TI',
    src: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&q=80',
    alt: 'Open-plan corporate office with modern finishes and collaborative workspace',
  },
  {
    id: 'p3',
    name: 'Mayer Brown LLP',
    location: 'Los Angeles, CA',
    type: 'Office TI',
    src: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80',
    alt: 'Law firm office transformation with contemporary structural design',
  },
  {
    id: 'p4',
    name: 'City National Plaza',
    location: 'Los Angeles, CA',
    type: 'Lobby Renovation',
    src: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200&q=80',
    alt: 'High-rise lobby renovation with glass curtain wall and modern entry',
  },
  {
    id: 'p5',
    name: 'Walt Disney Studios',
    location: 'Burbank, CA',
    type: 'Media & Entertainment',
    src: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=80',
    alt: 'Production studio facility with modern structural upgrades',
  },
  {
    id: 'p6',
    name: 'Apple Store Staircases',
    location: 'Multiple Locations, CA',
    type: 'Signature Staircases',
    src: 'https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=1200&q=80',
    alt: 'Structural glass staircase with precision steel support',
  },
  {
    id: 'p7',
    name: 'The North Face Flagship',
    location: 'Beverly Hills, CA',
    type: 'Retail TI',
    src: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1200&q=80',
    alt: 'High-end retail interior with luxury finishes and structural openings',
  },
  {
    id: 'p8',
    name: 'Hercules Campus',
    location: 'Playa Vista, CA',
    type: 'Campus Renovation',
    src: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1200&q=80',
    alt: 'Multi-building campus tenant improvement at Google and YouTube HQ',
  },
]

export const masonryProjects = galleryProjects.slice(0, 4).map((p) => ({
  ...p,
  src: p.src.replace('w=1200', 'w=800'),
}))

export const testimonials = [
  {
    id: 't1',
    quote:
      'NYA is the team you want on speed dial. They move fast, communicate clearly, and never leave you guessing.',
    name: 'Principal Architect',
    company: 'Los Angeles, CA',
    type: 'Architect',
  },
  {
    id: 't2',
    quote:
      "We've brought NYA in on a dozen buildings. They know our systems, they know our tenants, and they know how to avoid surprises.",
    name: 'VP of Property Operations',
    company: 'Commercial Real Estate Firm',
    type: 'Property Manager',
  },
  {
    id: 't3',
    quote:
      'Other engineers slow things down. NYA is the exception. They understood the design intent immediately and helped us push what was possible.',
    name: 'Senior Associate',
    company: 'Interior Architecture Studio',
    type: 'Architect',
  },
  {
    id: 't4',
    quote:
      "When we need structural engineers who can keep up with our pace—and our clients' expectations—we call NYA.",
    name: 'Project Director',
    company: 'Corporate Real Estate Developer',
    type: 'Owner',
  },
]

export const offerings = [
  {
    id: 'o1',
    num: '01',
    title: 'Fantastic Staircases',
    headline: 'When design asks for the impossible, we make it structural reality.',
    body: "Things that drive a structural engineer onto a TI project are usually stairs. We've engineered glass treads for Apple retail, dramatic steel cantilevers in occupied towers, and code-compliant feature stairs that architects actually want to show clients.",
    bullets: [
      'Complex stair design in occupied high-rise towers',
      'Structural glass treads and cantilevered steel',
      'Fast feasibility feedback for in-field decisions',
    ],
    src: 'https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=1400&q=80',
    alt: 'Elegant curved architectural staircase with structural steel and natural light',
    featured: true,
  },
  {
    id: 'o2',
    num: '02',
    title: 'Lobby Renovations',
    headline: 'Lobby work is where design ambition meets real-world constraints.',
    body: "It's visible, high-stakes, and full of structural surprises. Building owners call us because we know their aging high-rise frames. We make bold ideas possible without disrupting operations—or triggering major structural upgrades.",
    bullets: [
      'Seamless structure for creative rebrands',
      'Integration of new entries, stairs, and ceilings',
      'Deep knowledge of aging high-rise structural frames',
    ],
    src: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1400&q=80',
    alt: 'Grand corporate lobby with modern architectural elements and light-filled atrium',
    featured: true,
  },
  {
    id: 'o3',
    num: '03',
    title: 'High-Rise TI',
    headline: "When the job's 30 stories up, you need an engineer who moves.",
    body: "Active tenants, tight schedules, complex structural grids—this is where we thrive. We handle high-rise TI projects every week. From load transfer analysis to field RFI response in hours, not days.",
    bullets: [
      'Complex load transfer in constrained structural grids',
      'Rapid field RFI response and design support',
      'Multi-floor scope and rollout coordination',
    ],
    src: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1400&q=80',
    alt: 'High-rise office interior with open plan structural layout and modern finishes',
    featured: false,
  },
  {
    id: 'o4',
    num: '04',
    title: 'Fast-Turn Fit-Outs',
    headline: "We know you don't get a month to think about it.",
    body: "Our team is built for velocity. We produce clean, clear deliverables that let the build move forward—partition layouts, ceiling support, slab penetrations. Final picture and documents ready in a week.",
    bullets: [
      'Lightning-fast partition and ceiling structural support',
      'Lean drawings that answer field questions directly',
      'Flexibility to scale with multi-floor rollout',
    ],
    src: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1400&q=80',
    alt: 'Modern fast-track office TI with efficient structural layout and clean finishes',
    featured: false,
  },
  {
    id: 'o5',
    num: '05',
    title: 'The Invisible Details',
    headline: "In TI, the devil isn't in the structure. It's in the connections.",
    body: "TI work lives at the detail level — anchors, edge conditions, hidden supports that architects can't see and GCs can't invent. We've built our reputation on catching what others miss before it becomes a field problem.",
    bullets: [
      'Anchors, edge-of-slab conditions, and hidden structural supports',
      'Retrofit strategies that avoid triggering major code upgrades',
      'Coordination with architectural intent at every connection point',
    ],
    src: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400&q=80',
    alt: 'Close-up structural connection detail with precision hardware and steel',
    featured: false,
  },
]
