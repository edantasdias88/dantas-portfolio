import { useTranslation } from 'react-i18next'
import { ContactOptions } from './ContactOptions'
import { ContactForm } from '@/components/ContactForm'
import { Seo } from '@/components/Seo'
import page from '../page.module.scss'
import styles from './Contact.module.scss'

export default function ContactPage() {
  const { t } = useTranslation()
  return (
    <>
      <Seo title={t('meta.contact.title')} description={t('meta.contact.description')} />
      <section className={page.hero} style={{ paddingBottom: 'var(--section-y)' }}>
        <div className={`container ${styles.grid}`}>
          <div className={page.heroInner}>
            <p className="eyebrow">{t('contactPage.eyebrow')}</p>
            <h1 className={page.heroTitle}>{t('contactPage.title')}</h1>
            <p className="lead">{t('contact.description')}</p>
            <ContactOptions />
          </div>
          <ContactForm floatingLabels />
        </div>
      </section>
    </>
  )
}
