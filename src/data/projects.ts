import caaImage from '@/assets/projects/caa/caa-cover.jpg'
import caaBrand from '@/assets/projects/caa/caa-brand.svg'
import caaBrandDark from '@/assets/projects/caa/caa-brand-white.svg'
import caaAppHero from '@/assets/projects/caa/caa-app-hero.webp'
import iruasCover from '@/assets/projects/iruas/iruas-cover.jpg'
import iruasBrand from '@/assets/projects/iruas/iruas-brand-black.svg'
import iruasBrandDark from '@/assets/projects/iruas/iruas-brand-lime.svg'
import iruasCaseHero from '@/assets/projects/iruas/hero-camera-discovery.webp'

export type ProjectKey = 'caa' | 'iruas' | 'dantasDs'
export type ProjectVisualVariant = 'platform' | 'mobile' | 'system'
export interface ProjectImage {
  src: string
  width: number
  height: number
  fit?: 'cover' | 'contain'
  objectPosition?: string
}

export interface Project {
  key: ProjectKey
  /** Segmento usado em /case/:slug */
  slug: string
  visual: ProjectVisualVariant
  /** Imagem real do projeto (substitui a composição ilustrativa quando definida). */
  image?: ProjectImage
  /** Dados opcionais para o hero editorial dos cases. Projetos sem esta configuração mantêm o hero atual. */
  caseHero?: {
    logo?: string
    logoDark?: string
    accent?: string
    image?: ProjectImage
    frameRatio?: number
  }
}

export const projects: Project[] = [
  {
    key: 'caa',
    slug: 'caa',
    visual: 'platform',
    image: { src: caaImage, width: 1672, height: 941 },
    caseHero: {
      logo: caaBrand,
      logoDark: caaBrandDark,
      accent: '#f58232',
      image: { src: caaAppHero, width: 2592, height: 1882, objectPosition: 'left center' },
    },
  },
  {
    key: 'iruas',
    slug: 'iruas',
    visual: 'mobile',
    image: { src: iruasCover, width: 2048, height: 768, fit: 'cover', objectPosition: 'center' },
    caseHero: {
      logo: iruasBrand,
      logoDark: iruasBrandDark,
      accent: '#CAFD60',
      frameRatio: 0.82,
      image: { src: iruasCaseHero, width: 1024, height: 1536, fit: 'cover', objectPosition: 'center 54%' },
    },
  },
  { key: 'dantasDs', slug: 'dantas-ds', visual: 'system' },
]

/** Projects currently presented in the portfolio listings and Home carousel. */
export const portfolioProjects = projects.filter((project) => project.key !== 'dantasDs')

export function caseHref(project: Project) {
  return `/case/${project.slug}`
}

export function findProjectBySlug(slug: string | undefined) {
  return projects.find((p) => p.slug === slug)
}
