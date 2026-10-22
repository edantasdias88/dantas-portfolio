import { useTranslation } from 'react-i18next'
import { Seo } from '@/components/Seo'
import { EndlessRunner } from '@/components/EndlessRunner'
import styles from './NotFound.module.scss'

export default function NotFoundPage() {
  const { t } = useTranslation()

  return (
    <section className={styles.section}>
      <Seo title={t('meta.notFound.title')} description={t('meta.notFound.description')} noIndex />
      <EndlessRunner>
        <p className={styles.eyebrow}>{t('notFound.eyebrow')}</p>
        <h1 className={styles.title}>{t('notFound.title')}</h1>
        <p className={styles.description}>{t('notFound.description')}</p>
      </EndlessRunner>
    </section>
  )
}
