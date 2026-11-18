import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { Button } from '@/components/Button'
import { ContactOptions } from '@/components/ContactOptions'
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
          <Button arrow size="lg" className={styles.inviteAction} onClick={(e) => openContact(e.currentTarget)}>
            {t('common.cta')}
          </Button>
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
              <ContactOptions footer />
            </div>
          </div>

          <div className={styles.bottom}>
            <div className={styles.signature}>
              <p className={styles.signatureName}>Edilson Dantas</p>
              <p className={styles.signatureText}>{t('footer.signature')}</p>
            </div>
            <p className={styles.copy}>{t('footer.rights', { year: YEAR })}</p>
            <button type="button" className={styles.top} onClick={toTop} aria-label={t('footer.backToTop')}>
              <svg width="54" height="54" viewBox="0 0 54 54" fill="none" aria-hidden="true">
                <circle cx="27" cy="27" r="26.5" stroke="var(--footer-divider)" />
                <path d="M27 39V15M39 25.5L27 15L15 25.5" stroke="currentColor" strokeWidth="1.8" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
