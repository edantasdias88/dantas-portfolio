export type NavKey = 'home' | 'about' | 'projects' | 'services' | 'contact'

export const mainNav: { key: NavKey; to: string }[] = [
  { key: 'home', to: '/' },
  { key: 'about', to: '/sobre-mim' },
  { key: 'projects', to: '/projetos' },
  { key: 'services', to: '/#servicos' },
  { key: 'contact', to: '/contato' },
]
