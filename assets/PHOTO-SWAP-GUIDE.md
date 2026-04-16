# Photo Swap Guide: NYA TI Microsite

This guide covers replacing Unsplash placeholder images with real NYA project photography across the microsite.

## Image Specifications

When replacing placeholder images, use the following specs for optimal performance:

- **Format:** JPG or WebP (WebP preferred for smaller file sizes)
- **Gallery Images (p1–p8):** Minimum 1200px width (landscape), maximum 400KB
- **Masonry Images (p1–p4 crops):** Minimum 800px width, maximum 300KB
- **Aspect Ratio:** 4:3 or 16:9 (consistent within each section)
- **Storage Location:** `/public/images/projects/`
- **Filename Convention:** `p1-office-la.jpg`, `p2-office-centurycity.jpg`, etc. (descriptive, lowercase)

## Gallery Slots (Section §7: Project Gallery)

The gallery displays 8 projects (`galleryProjects` in `src/data/projects.js`). Replace each Unsplash URL with a real NYA project photo.

| Slot | Current Placeholder | Recommended Real Photo | Type | Location | Notes |
|------|---------------------|------------------------|------|----------|-------|
| **p1** | Modern corporate office interior (Unsplash ID: 1497366216548) | NYA office TI showcase (open floor plan or atrium) | Office TI | Los Angeles, CA | Hero slot — high visibility. Use your best-lit, most impressive office transformation. |
| **p2** | Open plan office workspace (Unsplash ID: 1504384308090) | NYA office renovation with modern finishes (desks, lighting, partitions) | Office TI | Century City, CA | Mid-gallery. Should show collaborative workspace design. |
| **p3** | Contemporary building lobby (Unsplash ID: 1497366811353) | NYA retail or mixed-use ground floor | Retail TI | San Francisco, CA | Transition point. Showcase entry-level luxury or professional lobbies. |
| **p4** | Glass curtain wall office tower (Unsplash ID: 1486325212027) | NYA high-rise office TI with modern façade | Office TI | Irvine, CA | Large, striking image. Feature building exterior or façade renovation. |
| **p5** | Modern commercial building exterior (Unsplash ID: 1545324418-cc1a3fa10c00) | NYA media/studio facility exterior or branded entrance | Media & Entertainment | Burbank, CA | Start of media section. Should convey creative/production environment. |
| **p6** | Studio production space interior (Unsplash ID: 1573164713988-8665fc963095) | NYA studio, sound stage, or production floor | Media & Entertainment | Culver City, CA | Interior production shot. Emphasize technical infrastructure. |
| **p7** | High-end retail interior (Unsplash ID: 1556761175-5973dc0f32e7) | NYA luxury retail storefront or flagship space | Retail TI | Beverly Hills, CA | Premium positioning. Feature high-end finishes, materials, lighting. |
| **p8** | Historic building renovation interior (Unsplash ID: 1588854337236-6889d631faa8) | NYA adaptive reuse project (historic facade with modern interior) | Historic Renovation | Los Angeles, CA | Final slot. Bridge old-to-new aesthetic. Show before/after spirit. |

## Masonry Gallery (Section §10)

The masonry gallery uses a 2x2 crop of the first four gallery images (p1–p4) at 800px width. Ensure these four images are:

1. Visually distinct enough to look good at smaller scale
2. Cropped horizontally to fit 4:3 aspect ratio without critical detail loss
3. Saved as separate files in `/public/images/projects/` (e.g., `p1-masonry.jpg`)

The code in `projects.js` automatically adjusts the URL parameter from `w=1200` to `w=800`, so only replace the base image URL.

## Hero Background (§2)

The hero section uses a background image (not a data-driven URL). Check the component files for hero background references:

- Location: Likely in `/src/components/Hero.jsx` or similar
- Current: Likely a Unsplash placeholder or generic background
- Replacement: Use a striking NYA project exterior or an office/studio setting that conveys scale and modern design
- Specs: Full width (1920px+), height 600–800px, under 500KB, 16:9 aspect ratio
- Suggestion: A high-angle shot of a completed office tower, modern lobby, or studio facility entrance

## Alt Text Updating

All images have descriptive alt text in the data files. When replacing images:

1. Update the `alt` property in `projects.js` to match the new photo (e.g., "Modern glass office tower with floor-to-ceiling windows" instead of generic placeholder text)
2. Ensure alt text is descriptive for accessibility (screen readers, SEO)
3. Keep alt text under 125 characters for readability

Example update:
```js
{
  id: 'p1',
  src: '/images/projects/p1-office-la.jpg',  // Real image path
  alt: 'NYA office TI at West LA corporate campus — open floor plan with modern pendant lighting and collaborative workspace zones',
  name: 'West LA Corporate Headquarters',
  location: 'Los Angeles, CA',
  type: 'Office TI',
}
```

## Implementation Checklist

- [ ] Gather 8 real project photos from NYA portfolio
- [ ] Crop/resize each to gallery specs (1200px+, 4:3 or 16:9)
- [ ] Compress to under 400KB (use ImageOptim, TinyPNG, or similar)
- [ ] Export as JPG or WebP
- [ ] Save to `/public/images/projects/` with descriptive filenames
- [ ] Update `src` URLs in `projects.js` (replace Unsplash URLs)
- [ ] Update `alt` text with real project details
- [ ] Verify masonry crops (p1–p4) fit layout at 800px
- [ ] Update hero background image (if separate component)
- [ ] Test responsive breakpoints (mobile 600px, tablet 900px, desktop 1200px)
- [ ] Run Lighthouse audit to verify image performance
- [ ] Remove this placeholder comment from `projects.js` after launch

## Testing

After swapping images:

1. **Visual check:** View all sections (§7 gallery, §10 masonry, hero) on mobile, tablet, desktop
2. **Performance:** Run Lighthouse (target: images < 500KB, Core Web Vitals green)
3. **Alt text:** Verify with screen reader or browser dev tools
4. **Broken links:** Check network tab for 404 errors
5. **Load time:** Monitor hero background and gallery lazy-load performance

## Notes

- Placeholder Unsplash images are free-tier stock photos; they may appear on other websites.
- Real project photos must have usage rights (confirm with NYA team before publishing).
- High-quality, consistent photography is a strong branding asset — invest in professional staging/photography if needed.
- Consider retaking photos in consistent lighting/weather for cohesive gallery appearance.
