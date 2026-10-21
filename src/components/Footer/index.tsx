import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import contactAction from '@/assets/figma/footer/contact-action.svg'
import envelope from '@/assets/figma/footer/envelope.svg'
import topIcon from '@/assets/figma/footer/top.svg'
import whatsapp from '@/assets/figma/footer/whatsapp.svg'
import { formatWhatsapp, site, whatsappUrl } from '@/data/site'
import { useContact } from '@/lib/contact'
import styles from './Footer.module.scss'

const NAV = [
  { key: 'projects', to: '/projetos' },
  { key: 'services', to: '/#servicos' },
  { key: 'aboutMe', to: '/sobre-mim' },
  { key: 'contact', to: '/contato' },
] as const

/** Destinos dos links de serviços do rodapé (mesma ordem de footer.serviceLinks). */
const SERVICE_LINKS = ['/case/iruas', '/#servicos', '/case/dantas-ds', '/#servicos']

const YEAR = new Date().getFullYear()

export function Footer() {
  const { t } = useTranslation()
  const { openContact } = useContact()
  const serviceLinks = t('footer.serviceLinks', { returnObjects: true })

  const toTop = () => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })
    document.getElementById('main')?.focus({ preventScroll: true })
  }

  return (
    <footer id="contato" className={`surface-dark ${styles.footer}`}>
      <div className={`container ${styles.inner}`}>
        {/* Figma 51:1625 — Convite para conversar */}
        <div className={styles.invite}>
          <h2 className={styles.title}>
            <span className={styles.titleLead}>{t('finalCta.titleLead')}</span>{' '}
            <span className={styles.titleMuted}>{t('finalCta.titleMuted')}</span>
          </h2>
          <button type="button" className={styles.cta} onClick={(e) => openContact(e.currentTarget)}>
            <span className={styles.ctaLabel}>{t('common.cta')}</span>
            <img src={contactAction} alt="" width={72} height={72} className={styles.ctaIcon} />
          </button>
        </div>

        {/* Figma 51:1591 — Rodapé */}
        <div className={styles.footerBlock}>
          <div className={styles.columns}>
            <nav aria-label={t('a11y.footerNav')} className={styles.col}>
              <h3 className={styles.colTitle}>{t('footer.navigation')}</h3>
              <ul className={styles.links}>
                {NAV.map((item) => (
                  <li key={item.key}>
                    <Link to={item.to} className={styles.link}>
                      {t(`nav.${item.key}`)}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className={styles.col}>
              <h3 className={styles.colTitle}>{t('footer.services')}</h3>
              <ul className={styles.links}>
                {serviceLinks.map((label, i) => (
                  <li key={label}>
                    <Link to={SERVICE_LINKS[i]} className={styles.link}>
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className={`${styles.col} ${styles.contactCol}`}>
              <h3 className={styles.colTitle}>{t('footer.contact')}</h3>
              <ul className={styles.channels}>
                {site.email && (
                  <li>
                    <a className={styles.channel} href={`mailto:${site.email}`}>
                      <img src={envelope} alt="" width={31} height={28} />
                      <span>
                        <span className="visually-hidden">{t('footer.email')}: </span>
                        {site.email}
                      </span>
                    </a>
                  </li>
                )}
                {site.whatsapp && (
                  <li>
                    <a className={styles.channel} href={whatsappUrl(site.whatsapp)} target="_blank" rel="noopener noreferrer">
                      <img src={whatsapp} alt="" width={31} height={31} />
                      <span>
                        <span className="visually-hidden">{t('footer.whatsapp')}: </span>
                        {formatWhatsapp(site.whatsapp)}
                        <span className="visually-hidden"> {t('a11y.opensInNewTab')}</span>
                      </span>
                    </a>
                  </li>
                )}
                {!site.email && !site.whatsapp && (
                  <li>
                    <button type="button" className={styles.channel} onClick={(e) => openContact(e.currentTarget)}>
                      <img src={envelope} alt="" width={31} height={28} />
                      <span>{t('footer.sendMessage')}</span>
                    </button>
                  </li>
                )}
              </ul>
            </div>
          </div>

          <div className={styles.bottom}>
            <div className={styles.signature}>
              <p className={styles.signatureName}>Edilson Dantas</p>
              <p className={styles.signatureText}>{t('footer.signature')}</p>
            </div>
            <p className={styles.copy}>{t('footer.rights', { year: YEAR })}</p>
            <button type="button" className={styles.top} onClick={toTop} aria-label={t('footer.backToTop')}>
              <img src={topIcon} alt="" width={54} height={54} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
