import { useTranslation } from 'react-i18next'
import { formatWhatsapp, site, whatsappUrl } from '@/data/site'
import { Chat, Mail } from './Icons'

/** Links de contato direto. Só renderiza o que estiver configurado em site.ts / .env. */
export function ContactDirect({ className, itemClassName }: { className?: string; itemClassName?: string }) {
  const { t } = useTranslation()
  if (!site.email && !site.whatsapp) return null
  return (
    <ul className={className}>
      {site.email && (
        <li>
          <a className={itemClassName} href={`mailto:${site.email}`}>
            <Mail size={18} />
            <span>
              <span className="visually-hidden">{t('footer.email')}: </span>
              {site.email}
            </span>
          </a>
        </li>
      )}
      {site.whatsapp && (
        <li>
          <a className={itemClassName} href={whatsappUrl(site.whatsapp)} target="_blank" rel="noopener noreferrer">
            <Chat size={18} />
            <span>
              <span className="visually-hidden">{t('footer.whatsapp')}: </span>
              {formatWhatsapp(site.whatsapp)}
              <span className="visually-hidden"> {t('a11y.opensInNewTab')}</span>
            </span>
          </a>
        </li>
      )}
    </ul>
  )
}
