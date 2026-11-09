// Gallery albums, newest first. Put photos in public/gallery/<folder>/ and list them here.
// Example:
// {
//   title: 'KSAE 2026 Fall Conference', category: 'Conference', date: '2026-11-19', place: 'Jeju, Korea',
//   photos: [{ src: '/gallery/2026-11-ksae/poster.jpg', alt: 'Poster session' }],
// },

export type GalleryCategory = 'Conference' | 'Business Trip' | 'Lab Event'

export type Album = {
  title: string
  category: GalleryCategory
  date: string // YYYY-MM-DD
  place?: string
  caption?: string // one or two sentences under the title
  photos: { src: string; alt: string; position?: 'top' | 'bottom' }[] // position: which end to keep when cropped to 4:3
}

export const albums: Album[] = [
  {
    title: 'Seattle and Olympic National Park',
    category: 'Business Trip',
    date: '2026-05-30',
    place: 'Washington, USA',
    caption: 'After the ECS meeting, lab members visited Pike Place Market, the original Starbucks and the Space Needle, then Olympic National Park.',
    photos: [
      { src: '/gallery/2026-05-seattle-olympic/pike-place.jpg', alt: 'Public Market Center sign at Pike Place Market in Seattle' },
      { src: '/gallery/2026-05-seattle-olympic/starbucks.jpg', alt: 'Lab members in front of the original Starbucks in Seattle' },
      { src: '/gallery/2026-05-seattle-olympic/space-needle.jpg', alt: 'The Space Needle against a partly cloudy sky', position: 'top' },
      { src: '/gallery/2026-05-seattle-olympic/olympic-hike.jpg', alt: 'Lab members on a mountain trail in Olympic National Park', position: 'bottom' },
      { src: '/gallery/2026-05-seattle-olympic/olympic-walk.jpg', alt: 'Lab members walking along a path toward snow-capped mountains' },
    ],
  },
  {
    title: 'ECS 249th Meeting Poster Session',
    category: 'Conference',
    date: '2026-05-26',
    place: 'Seattle, USA',
    caption:
      'Four lab members presented posters at the 249th Meeting of the Electrochemical Society (ECS), covering single particle modeling, parameter validation, 3D analysis of large-format prismatic cells and heat generation models.',
    photos: [
      { src: '/gallery/2026-05-ecs-poster/poster-1.jpg', alt: 'A lab member with their poster at the ECS 249th Meeting' },
      { src: '/gallery/2026-05-ecs-poster/poster-2.jpg', alt: 'Discussing a poster with a visitor at the ECS 249th Meeting' },
      { src: '/gallery/2026-05-ecs-poster/poster-3.jpg', alt: 'A lab member with their poster on large-format prismatic cells at the ECS 249th Meeting' },
      { src: '/gallery/2026-05-ecs-poster/poster-4.jpg', alt: 'A lab member with their poster on heat generation models at the ECS 249th Meeting' },
    ],
  },
  {
    title: 'With Prof. Chao-Yang Wang',
    category: 'Conference',
    date: '2026-05-26',
    place: 'Seattle, USA',
    caption: 'Lab members met Prof. Chao-Yang Wang of Penn State University, the doctoral advisor of our lab’s professor, at the ECS meeting.',
    photos: [{ src: '/gallery/2026-05-ecs-wang/group.jpg', alt: 'Lab members with Prof. Chao-Yang Wang at the ECS 249th Meeting' }],
  },
  {
    title: '2025 KSAE Autumn Conference',
    category: 'Conference',
    date: '2025-11-12',
    caption: 'Shared second-year results on battery thermal runaway propagation at the Korean Society of Automotive Engineers (KSAE) 2025 Autumn Conference.',
    photos: [{ src: '/gallery/2025-11-ksae-autumn/group.jpg', alt: 'Lab members in front of the 2025 KSAE Autumn Conference information boards' }],
  },
  {
    title: 'Yosemite National Park',
    category: 'Business Trip',
    date: '2025-05-29',
    place: 'California, USA',
    caption: 'Visited Yosemite National Park after the Battery Thermal Management Conference.',
    photos: [{ src: '/gallery/2025-05-yosemite/group.jpg', alt: 'Lab members at a Yosemite Valley overlook' }],
  },
  {
    title: 'Battery Thermal Management Conference',
    category: 'Conference',
    date: '2025-05-27',
    caption: 'Attended the conference to follow the latest battery thermal management technology and review the lab’s direction in pack-level thermal analysis.',
    photos: [{ src: '/gallery/2025-05-btm-conference/group.jpg', alt: 'Lab members in the Battery Thermal Management Conference exhibition hall' }],
  },
  {
    title: 'Google Headquarters',
    category: 'Business Trip',
    date: '2025-05-27',
    place: 'Silicon Valley, USA',
    caption: 'After a meeting at Stanford University, visited Google headquarters and other companies in Silicon Valley.',
    photos: [{ src: '/gallery/2025-05-google/group.jpg', alt: 'Lab members in front of the large Google logo sculpture at Google headquarters' }],
  },
  {
    title: 'KITECH Jeju Visit',
    category: 'Business Trip',
    date: '2024-11-22',
    place: 'Jeju, Korea',
    caption: 'Visited the Jeju division of the Korea Institute of Industrial Technology (KITECH) by invitation to tour its research facilities and discuss collaboration.',
    photos: [{ src: '/gallery/2024-11-kitech-jeju/group.jpg', alt: 'Lab members at a presentation in a KITECH Jeju meeting room' }],
  },
  {
    title: 'Ansys Simulation World 2024',
    category: 'Conference',
    date: '2024-11-12', // TODO(Soomin): venue
    caption: 'Attended Ansys Simulation World 2024 with members of the lab.',
    photos: [{ src: '/gallery/2024-11-ansys-simulation-world/group.jpg', alt: 'Lab members on the staircase at Ansys Simulation World 2024' }],
  },
  {
    title: '2024 KSAE Autumn Conference',
    category: 'Conference',
    date: '2024-11-19', // TODO(Soomin): venue
    caption: 'Attended the Korean Society of Automotive Engineers (KSAE) 2024 Autumn Conference and Exhibition with members of the lab.',
    photos: [{ src: '/gallery/2024-11-ksae-autumn/group.jpg', alt: 'Lab members in front of the 2024 KSAE Autumn Conference banner' }],
  },
  {
    title: '2024 KSAE Spring Conference',
    category: 'Conference',
    date: '2024-06-19',
    place: 'Sono Calm Geoje, Korea',
    caption:
      'Attended the Korean Society of Automotive Engineers (KSAE) 2024 Spring Conference, held June 19–22 in Geoje, with members of the lab.',
    photos: [{ src: '/gallery/2024-06-ksae-spring/group.jpg', alt: 'Lab members in front of the 2024 KSAE Spring Conference banners' }],
  },
]

// Year sections shown even before they have photos; years found in albums are added automatically.
export const GALLERY_YEARS = [2026, 2025, 2024]
