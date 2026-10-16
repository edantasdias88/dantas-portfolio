import { useId, useState } from 'react'
import { useTranslation } from 'react-i18next'
import iruasMockup from '@/assets/images/iruas-mockup.webp'
import { AccordionControl } from '@/components/AccordionControl'
import { Collapse } from '@/components/Collapse'
import { Reveal } from '@/components/Reveal'
import { services } from '@/data/services'
import styles from './Services.module.scss'

export function Services() {
  const { t } = useTranslation()
  const uid = useId()
  const [open, setOpen] = useState<string | null>(services[0].key)

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

        <ul className={styles.list}>
          {services.map((service, index) => {
            const key = service.key
            const isOpen = open === key
            const buttonId = `${uid}-${key}-btn`
            const panelId = `${uid}-${key}-panel`
            const tags = t(`services.items.${key}.tags`, { returnObjects: true })
            return (
              <li key={key} className={styles.item} data-open={isOpen}>
                <h3 className={styles.heading}>
                  <button
                    id={buttonId}
                    type="button"
                    className={styles.trigger}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpen(isOpen ? null : key)}
                  >
                    <span className={styles.index} aria-hidden="true">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className={styles.dash} aria-hidden="true" />
                    <span className={styles.name}>{t(`services.items.${key}.title`)}</span>
                    {!isOpen && <span className={styles.summary}>{t(`services.items.${key}.summary`)}</span>}
                    <AccordionControl open={isOpen} className={styles.control} />
                  </button>
                </h3>
                <Collapse open={isOpen} id={panelId} labelledBy={buttonId}>
                  <div className={styles.card} data-media={Boolean(service.media)}>
                    {service.media === 'iruas' && (
                      <div className={styles.media}>
                        <img src={iruasMockup} width={604} height={494} alt={t('projects.items.iruas.title')} loading="lazy" decoding="async" />
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
                </Collapse>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
