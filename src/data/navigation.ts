export type NavKey = 'about' | 'projects' | 'services' | 'process' | 'designSystem' | 'contact'

export const mainNav: { key: NavKey; to: string }[] = [
  { key: 'about', to: '/sobre-mim' },
  { key: 'projects', to: '/projetos' },
  { key: 'services', to: '/#servicos' },
  { key: 'process', to: '/#processo' },
  { key: 'designSystem', to: '/case/dantas-ds' },
  { key: 'contact', to: '/contato' },
]
