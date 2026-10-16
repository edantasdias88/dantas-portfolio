import { useTranslation } from 'react-i18next'
import geo1 from '@/assets/figma/working/geo-1.svg'
import geo2 from '@/assets/figma/working/geo-2.svg'
import geo3 from '@/assets/figma/working/geo-3.svg'
import geo4 from '@/assets/figma/working/geo-4.svg'
import { Reveal } from '@/components/Reveal'
import styles from './WorkingTogether.module.scss'

const ILLUSTRATIONS = [geo1, geo2, geo3, geo4]

export function WorkingTogether() {
  const { t } = useTranslation()
  const items = t('working.items', { returnObjects: true })
  return (
    <section className={styles.section} aria-labelledby="working-title">
      <div className={`container ${styles.inner}`}>
        <Reveal>
          <p className="eyebrow">{t('working.eyebrow')}</p>
          <h2 id="working-title" className="section-heading">
            {t('working.title')}
          </h2>
        </Reveal>
        <ul className={styles.grid}>
          {items.map((item, i) => (
            <Reveal as="li" key={item.title} className={styles.item} delay={i * 0.06}>
              <img className={styles.geo} src={ILLUSTRATIONS[i]} width={64} height={60} alt="" />
              <div className={styles.content}>
                <h3 className={styles.title}>{item.title}</h3>
                <p className={styles.text}>{item.description}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
