import caaImage from '@/assets/images/caa-cover.png'
import iruasCover from '@/assets/images/iruas-cover.png'

export type ProjectKey = 'caa' | 'iruas' | 'dantasDs'
export type ProjectVisualVariant = 'platform' | 'mobile' | 'system'

export interface Project {
  key: ProjectKey
  /** Segmento usado em /case/:slug */
  slug: string
  visual: ProjectVisualVariant
  /** Imagem real do projeto (substitui a composição ilustrativa quando definida). */
  image?: { src: string; width: number; height: number; fit?: 'cover' | 'contain'; objectPosition?: string }
}

export const projects: Project[] = [
  { key: 'caa', slug: 'caa', visual: 'platform', image: { src: caaImage, width: 1672, height: 941 } },
  {
    key: 'iruas',
    slug: 'irus',
    visual: 'mobile',
    image: { src: iruasCover, width: 2048, height: 768, fit: 'cover', objectPosition: 'center' },
  },
  { key: 'dantasDs', slug: 'dantas-ds', visual: 'system' },
]

export function caseHref(project: Project) {
  return `/case/${project.slug}`
}

export function findProjectBySlug(slug: string | undefined) {
  return projects.find((p) => p.slug === slug)
}
