// Home page content. Add an entry here; the page renders it.

export type Role = 'lead' | 'co' // lead = first author, presenter, or project manager
export type Author = { name: string; me?: Role }
export type Logo = { src: string; alt: string; kind: 'emblem' | 'cover' | 'wide' }

export type EducationItem = {
  start: number
  end: number | 'Present'
  logo: Logo
  degree: string
  institution: string
  detail: string
}

export type PublicationItem = {
  date: string // YYYY-MM-DD, online publication date
  logo: Logo
  title: string
  authors: Author[]
  journal: string
  ref: string // volume(issue), article number
  doi: string
  pdf?: string
}

export type ProjectItem = {
  start: string // YYYY-MM
  end: string
  logo: Logo
  titleEn: string
  titleKo: string
  sponsor: string
  roles: { role: string; person: Author }[]
}

export type PresentationItem = {
  date: string // YYYY-MM-DD
  logo: Logo
  type: 'POSTER' | 'ORAL'
  event: string
  place: string
  title: string
  authors: Author[]
}

export type ProfileLink = { label: string; href?: string; icon: '↗' | '↓' }

const HYU: Logo = { src: '/logos/hyu.png', alt: 'Hanyang University', kind: 'emblem' }
const JNU: Logo = { src: '/logos/jnu.png', alt: 'Jeju National University', kind: 'emblem' }
const JPS: Logo = { src: '/logos/jps.jpg', alt: 'Journal of Power Sources', kind: 'cover' }
const ECS: Logo = { src: '/logos/ecs.jpg', alt: 'The Electrochemical Society', kind: 'emblem' }
const KSAE: Logo = { src: '/logos/ksae.png', alt: 'The Korean Society of Automotive Engineers', kind: 'emblem' }
const HMG: Logo = { src: '/logos/hmg.svg', alt: 'Hyundai Motor Group', kind: 'wide' }

export const profile: {
  name: string
  affiliation: [string, string]
  email: string
  photo: string
  links: ProfileLink[]
} = {
  name: 'Soomin Choi',
  affiliation: [
    'M.S./Ph.D. Student · Renewable Engine Analysis Laboratory (REAL)',
    'Dept. of Mechanical Design Engineering, Hanyang University',
  ],
  email: 'qkqhsm1@hanyang.ac.kr',
  photo: '/me.jpg',
  links: [
    { label: 'Scholar', href: 'https://scholar.google.com/citations?user=0oGmKXcAAAAJ', icon: '↗' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/soomin-choi-a93134351', icon: '↗' },
    { label: 'CV', icon: '↓' }, // set href to the PDF (e.g. '/cv.pdf') to make it a download link
  ],
}

export const education: EducationItem[] = [
  {
    start: 2025,
    end: 'Present',
    logo: HYU,
    degree: 'Integrated M.S./Ph.D.',
    institution: 'Hanyang University',
    detail: 'Dept. of Mechanical Design Engineering · REAL',
  },
  {
    start: 2023,
    end: 2025,
    logo: HYU,
    degree: 'B.S.',
    institution: 'Hanyang University ERICA',
    detail: 'Dept. of Mechanical Engineering',
  },
  {
    start: 2021,
    end: 2023,
    logo: JNU,
    degree: 'Undergraduate',
    institution: 'Jeju National University',
    detail: 'Dept. of Mechatronics Engineering · Transferred to Hanyang University ERICA',
  },
]

const KIM_M: Author = { name: 'M. Kim' }
const KIM_J: Author = { name: 'J. Kim' }

export const publications: PublicationItem[] = [
  {
    date: '2026-09-05',
    logo: JPS,
    title: 'A non-iterative method for single particle models of lithium-ion batteries with electrolyte dynamics',
    authors: [{ name: 'S. Choi', me: 'lead' }, KIM_M, { name: 'S.T. Gogineni' }, KIM_J],
    journal: 'Journal of Power Sources',
    ref: '695, 241369',
    doi: '10.1016/j.jpowsour.2026.241369',
  },
  {
    date: '2025-09-03',
    logo: ECS,
    title: 'Effect of Curvature of the Electrodes on the Electrochemical Behavior of Li-Ion Batteries',
    authors: [KIM_M, { name: 'S. Choi', me: 'co' }, { name: 'K. Seo' }, KIM_J],
    journal: 'Journal of The Electrochemical Society',
    ref: '172(9), 090507',
    doi: '10.1149/1945-7111/adfd1a',
  },
]

export const projects: ProjectItem[] = [
  {
    start: '2024-09',
    end: '2025-08',
    logo: HMG,
    titleEn: 'Development of a Robust and Efficient Electrochemical Model of EV Using Test Data',
    titleKo: '차량 시험 데이터를 이용한 전기차 해석 모델 고도화',
    sponsor: 'Hyundai Motor Company',
    roles: [
      { role: 'PI', person: KIM_J },
      { role: 'Project Manager', person: { name: 'S. Choi', me: 'lead' } },
      { role: 'Researcher', person: { name: 'N. Cho' } }, // ponytail: romanization unconfirmed
    ],
  },
]

export const presentations: PresentationItem[] = [
  {
    date: '2026-11-19',
    logo: KSAE,
    type: 'POSTER',
    event: 'KSAE 2026 Fall Conference',
    place: 'Yeosu EXPO Convention Center',
    title: 'Bayesian-based Parameter Identification of Single-Particle Model with Electrolyte Dynamics for Li-ion Batteries',
    authors: [{ name: 'S. Choi', me: 'lead' }, KIM_M, KIM_J],
  },
  {
    date: '2026-05-27',
    logo: ECS,
    type: 'POSTER',
    event: '249th ECS Meeting',
    place: 'Seattle, WA',
    title: 'Bayesian-Based Parameter Identification of Single-Particle Model of Li-Ion Batteries',
    authors: [{ name: 'S. Choi', me: 'lead' }, KIM_M, KIM_J],
  },
]
