// Gallery albums, newest first. Put photos in public/gallery/<folder>/ and list them here.
// Example:
// {
//   title: 'KSAE 2026 Fall Conference', category: 'Conference', date: '2026-11', place: 'Jeju, Korea',
//   photos: [{ src: '/gallery/2026-11-ksae/poster.jpg', alt: 'Poster session' }],
// },

export type GalleryCategory = 'Conference' | 'Business Trip' | 'Lab Event'

export type Album = {
  title: string
  category: GalleryCategory
  date: string // YYYY-MM
  place?: string
  caption?: string // one or two sentences under the title
  photos: { src: string; alt: string }[]
}

export const albums: Album[] = [
  {
    title: 'Ansys Simulation World 2024',
    category: 'Conference',
    date: '2024-11', // TODO(Soomin): exact day and venue
    caption: 'Attended Ansys Simulation World 2024 with members of the lab.',
    photos: [{ src: '/gallery/2024-11-ansys-simulation-world/group.jpg', alt: 'Lab members on the staircase at Ansys Simulation World 2024' }],
  },
  {
    title: '2024 KSAE Autumn Conference',
    category: 'Conference',
    date: '2024-11', // TODO(Soomin): exact day and venue
    caption: 'Attended the Korean Society of Automotive Engineers (KSAE) 2024 Autumn Conference and Exhibition with members of the lab.',
    photos: [{ src: '/gallery/2024-11-ksae-autumn/group.jpg', alt: 'Lab members in front of the 2024 KSAE Autumn Conference banner' }],
  },
  {
    title: '2024 KSAE Spring Conference',
    category: 'Conference',
    date: '2024-06',
    place: 'Sono Calm Geoje, Korea',
    caption:
      'Attended the Korean Society of Automotive Engineers (KSAE) 2024 Spring Conference, held June 19–22 in Geoje, with members of the lab.',
    photos: [{ src: '/gallery/2024-06-ksae-spring/group.jpg', alt: 'Lab members in front of the 2024 KSAE Spring Conference banners' }],
  },
]

// Year sections shown even before they have photos; years found in albums are added automatically.
export const GALLERY_YEARS = [2026, 2025, 2024]
