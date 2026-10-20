import { useTranslation } from 'react-i18next'
import { Accordion } from '@/components/Accordion'
import { Reveal } from '@/components/Reveal'
import styles from './FAQ.module.scss'

export function FAQ() {
  const { t } = useTranslation()
  const items = t('faq.items', { returnObjects: true }) as { q: string; a: string; tags?: string[] }[]
  const accordionItems = items.map((item, index) => ({
    id: `faq-${index}`,
    title: item.q,
    content: (
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
    ),
  }))

  return (
    <section id="perguntas-frequentes" className={styles.section} aria-labelledby="faq-title">
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

        <Accordion items={accordionItems} initialOpenId="faq-0" />
      </div>
    </section>
  )
}
