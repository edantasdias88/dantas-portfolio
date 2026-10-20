import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import contactAction from '@/assets/figma/footer/contact-action.svg'
import footerStyles from '@/components/Footer/Footer.module.scss'
import { Portrait } from '@/components/Portrait'
import { Reveal } from '@/components/Reveal'
import styles from './AboutPreview.module.scss'

export function AboutPreview() {
  const { t } = useTranslation()
  return (
    <section id="sobre" className={styles.section} aria-labelledby="about-title">
      <div className={`container ${styles.outer}`}>
        <div className={styles.block}>
          <div className={styles.text}>
            <p className={styles.badge}>{t('about.eyebrow')}</p>
            <Reveal className={styles.bottom}>
              <div className={styles.message}>
                <h2 id="about-title" className={styles.title}>
                  <span className={styles.titleLead}>{t('about.titleLead')}</span>{' '}
                  <span className={styles.titleMuted}>{t('about.titleMuted')}</span>
                </h2>
                <p className={styles.support}>{t('about.support')}</p>
              </div>
              <Link to="/sobre-mim" className={`${footerStyles.cta} ${styles.cta}`}>
                <span className={`${footerStyles.ctaLabel} ${styles.ctaLabel}`}>{t('about.cta')}</span>
                <img
                  src={contactAction}
                  alt=""
                  width={72}
                  height={72}
                  className={`${footerStyles.ctaIcon} ${styles.ctaIcon}`}
                />
              </Link>
            </Reveal>
          </div>
          <Reveal className={styles.media} y={32} delay={0.1}>
            <Portrait alt={t('about.imageAlt')} className={styles.portrait} />
          </Reveal>
        </div>
      </div>
    </section>
  )
}
