import { whatsappUrl } from './site'

const phone = '5511965919851'
const message = 'Olá, Edilson! Conheci seu portfólio e gostaria de conversar sobre um projeto. Podemos falar?'

export const contactPageDetails = {
  phone,
  phoneLabel: '(11) 96591-9851',
  email: 'contato@edilsondantas.com',
  telephone: `tel:+${phone}`,
  whatsapp: `${whatsappUrl(phone)}?text=${encodeURIComponent(message)}`,
} as const
