import { useId, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AccordionControl } from '@/components/AccordionControl'
import { Collapse } from '@/components/Collapse'
import { Reveal } from '@/components/Reveal'
import styles from './FAQ.module.scss'

export function FAQ() {
  const { t } = useTranslation()
  const uid = useId()
  const items = t('faq.items', { returnObjects: true }) as { q: string; a: string; tags?: string[] }[]
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section className={styles.section} aria-labelledby="faq-title">
      <div className={styles.silk} aria-hidden="true" />
      <div className={`container ${styles.grid}`}>
        <div className={styles.intro}>
          <Reveal>
            <p className={`eyebrow ${styles.eyebrow}`}>{t('faq.eyebrow')}</p>
            <h2 id="faq-title" className="section-heading">
              {t('faq.title')} <em>{t('faq.titleMuted')}</em>
            </h2>
            <div className="section-desc">
              <p>{t('faq.description')}</p>
            </div>
          </Reveal>
        </div>

        <ul className={styles.list}>
          {items.map((item, i) => {
            const isOpen = open === i
            const buttonId = `${uid}-q-${i}`
            const panelId = `${uid}-a-${i}`
            return (
              <li key={item.q} className={styles.item} data-open={isOpen}>
                <h3 className={styles.heading}>
                  <button
                    id={buttonId}
                    type="button"
                    className={styles.question}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpen(isOpen ? null : i)}
                  >
                    <span className={styles.index} aria-hidden="true">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className={styles.dash} aria-hidden="true" />
                    <span className={styles.qText}>{item.q}</span>
                    <AccordionControl open={isOpen} className={styles.control} />
                  </button>
                </h3>
                <Collapse open={isOpen} id={panelId} labelledBy={buttonId}>
                  <div className={styles.answer}>
                    <p>{item.a}</p>
                    {item.tags && (
                      <ul className={styles.tags}>
                        {item.tags.map((tag) => (
                          <li key={tag} className={styles.tag}>
                            {tag}
                          </li>
                        ))}
                      </ul>
                    )}
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
