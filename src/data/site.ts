/**
 * Dados de contato reais. Deixe vazio o que ainda não estiver disponível:
 * campos vazios não são exibidos no site (nenhum link falso é gerado).
 */
export const site = {
  name: 'Edilson Dantas',
  url: import.meta.env.VITE_SITE_URL ?? '',
  email: import.meta.env.VITE_CONTACT_EMAIL ?? '',
  /** Apenas dígitos com DDI, ex.: 5511999999999 */
  whatsapp: import.meta.env.VITE_CONTACT_WHATSAPP ?? '',
  /**
   * Endpoint que recebe POST JSON { name, email, company, type, message } e responde 2xx em caso de sucesso.
   * Compatível com Formspree (https://formspree.io/f/xxxx), Getform, Basin ou uma função serverless própria.
   */
  contactEndpoint: import.meta.env.VITE_CONTACT_ENDPOINT ?? '',
} as const

export function whatsappUrl(number: string) {
  return `https://wa.me/${number.replace(/\D/g, '')}`
}

export function formatWhatsapp(number: string) {
  const digits = number.replace(/\D/g, '')
  const match = digits.match(/^(\d{2})(\d{2})(\d{4,5})(\d{4})$/)
  return match ? `+${match[1]} ${match[2]} ${match[3]}-${match[4]}` : `+${digits}`
}
