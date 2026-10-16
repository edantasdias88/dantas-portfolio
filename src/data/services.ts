export type ServiceKey = 'products' | 'websites' | 'brands' | 'audit' | 'designSystems' | 'frontend'
/** Serviços com conteúdo expandido no accordion da Home. */
export type AccordionServiceKey = Extract<ServiceKey, 'products' | 'websites' | 'brands' | 'audit'>

export interface Service {
  key: AccordionServiceKey
  /** Imagem exibida no card expandido (Figma: apenas Produtos Digitais). */
  media?: 'iruas'
}

/** Serviços exibidos no accordion da Home (Figma: 4 itens). */
export const services: Service[] = [{ key: 'products', media: 'iruas' }, { key: 'websites' }, { key: 'brands' }, { key: 'audit' }]

/** Todas as áreas de atuação (inclui as que não aparecem no accordion). */
export const areas: ServiceKey[] = ['products', 'websites', 'brands', 'audit', 'designSystems', 'frontend']
