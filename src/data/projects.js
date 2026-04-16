// [PLACEHOLDER] Replace src URLs with real project photography before launch
// See assets/PHOTO-SWAP-GUIDE.md for slot descriptions and recommended image specs

export const galleryProjects = [
  {
    id: 'p1',
    src: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80',
    alt: 'Modern corporate office interior',
    name: '[Project Name]',        // [PLACEHOLDER]
    location: 'Los Angeles, CA',   // [PLACEHOLDER]
    type: 'Office TI',
  },
  {
    id: 'p2',
    src: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&q=80',
    alt: 'Open plan office workspace',
    name: '[Project Name]',
    location: 'Century City, CA',
    type: 'Office TI',
  },
  {
    id: 'p3',
    src: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1200&q=80',
    alt: 'Contemporary building lobby',
    name: '[Project Name]',
    location: 'San Francisco, CA',
    type: 'Retail TI',
  },
  {
    id: 'p4',
    src: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200&q=80',
    alt: 'Glass curtain wall office tower',
    name: '[Project Name]',
    location: 'Irvine, CA',
    type: 'Office TI',
  },
  {
    id: 'p5',
    src: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=80',
    alt: 'Modern commercial building exterior',
    name: '[Project Name]',
    location: 'Burbank, CA',
    type: 'Media & Entertainment',
  },
  {
    id: 'p6',
    src: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?w=1200&q=80',
    alt: 'Studio production space interior',
    name: '[Project Name]',
    location: 'Culver City, CA',
    type: 'Media & Entertainment',
  },
  {
    id: 'p7',
    src: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1200&q=80',
    alt: 'High-end retail interior',
    name: '[Project Name]',
    location: 'Beverly Hills, CA',
    type: 'Retail TI',
  },
  {
    id: 'p8',
    src: 'https://images.unsplash.com/photo-1588854337236-6889d631faa8?w=1200&q=80',
    alt: 'Historic building renovation interior',
    name: '[Project Name]',
    location: 'Los Angeles, CA',
    type: 'Historic Renovation',
  },
]

// Masonry gallery (§10) — subset with different crops
export const masonryProjects = galleryProjects.slice(0, 4).map((p) => ({
  ...p,
  src: p.src.replace('w=1200', 'w=800'),
}))
