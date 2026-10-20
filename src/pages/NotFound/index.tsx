import { useTranslation } from 'react-i18next'
import { ButtonLink } from '@/components/Button'
import { Seo } from '@/components/Seo'
import page from '../page.module.scss'
import styles from './NotFound.module.scss'

export default function NotFoundPage() {
  const { t } = useTranslation()
  return (
    <section className={`${page.hero} ${styles.section}`}>
      <Seo title={t('meta.notFound.title')} description={t('meta.notFound.description')} />
      <meta name="robots" content="noindex" />
      <div className={`container ${page.heroInner}`}>
        <p className={styles.code} aria-hidden="true">
          {t('notFound.code')}
        </p>
        <h1 className={page.heroTitle}>{t('notFound.title')}</h1>
        <p className="lead">{t('notFound.description')}</p>
        <div className={styles.actions}>
          <ButtonLink to="/" arrow arrowDirection="up-right">
            {t('common.backHome')}
          </ButtonLink>
          <ButtonLink to="/projetos" variant="secondary">
            {t('common.viewAllProjects')}
          </ButtonLink>
        </div>
      </div>
    </section>
  )
}
