import { useTranslation } from 'react-i18next'
import experienceAudit from '@/assets/images/experience-audit.jpg'
import brandsIdentity from '@/assets/images/brands-identity.jpg'
import iruasMockup from '@/assets/images/iruas-mockup.webp'
import websitesDesktop from '@/assets/images/websites-desktop.jpg'
import { Accordion } from '@/components/Accordion'
import { Reveal } from '@/components/Reveal'
import { services } from '@/data/services'
import styles from './Services.module.scss'

const MEDIA = {
  iruas: { src: iruasMockup, width: 604, height: 494, alt: 'projects.items.iruas.title' },
  websites: { src: websitesDesktop, width: 1774, height: 887, alt: 'services.items.websites.imageAlt' },
  brands: { src: brandsIdentity, width: 1774, height: 887, alt: 'services.items.brands.imageAlt' },
  audit: { src: experienceAudit, width: 1774, height: 887, alt: 'services.items.audit.imageAlt' },
} as const

export function Services() {
  const { t } = useTranslation()
  const accordionItems = services.map((service) => {
    const key = service.key
    const tags = t(`services.items.${key}.tags`, { returnObjects: true })
    const media = service.media ? MEDIA[service.media] : null

    return {
      id: key,
      title: t(`services.items.${key}.title`),
      description: t(`services.items.${key}.summary`),
      content: (
        <div className={styles.card} data-media={Boolean(service.media)}>
          {media && (
            <div className={styles.media} data-media-kind={service.media}>
              <img
                src={media.src}
                width={media.width}
                height={media.height}
                alt={t(media.alt)}
                loading="lazy"
                decoding="async"
              />
              <span className={styles.fade} aria-hidden="true" />
            </div>
          )}
          <div className={styles.content}>
            <p className={styles.category}>{t(`services.items.${key}.category`)}</p>
            <p className={styles.headline}>
              <span>{t(`services.items.${key}.headline`)}</span>{' '}
              <span className={styles.muted}>{t(`services.items.${key}.headlineMuted`)}</span>
            </p>
            <p className={styles.description}>{t(`services.items.${key}.description`)}</p>
            <ul className={styles.tags}>
              {tags.map((tag) => (
                <li key={tag} className={styles.tag}>
                  {tag}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ),
    }
  })

  return (
    <section id="servicos" className={styles.section} aria-labelledby="services-title">
      <div className={styles.silk} aria-hidden="true" />
      <div className={`container ${styles.grid}`}>
        <div className={styles.intro}>
          <Reveal>
            <p className="eyebrow">{t('services.eyebrow')}</p>
            <h2 id="services-title" className="section-heading">
              {t('services.title')} <em>{t('services.titleMuted')}</em>
            </h2>
            <div className="section-desc">
              <p>{t('services.description')}</p>
            </div>
          </Reveal>
        </div>

        <Accordion items={accordionItems} initialOpenId={services[0].key} />
      </div>
    </section>
  )
}
