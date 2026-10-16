import { useTranslation } from 'react-i18next'
import { Portrait } from '@/components/Portrait'
import { Reveal } from '@/components/Reveal'
import { Seo } from '@/components/Seo'
import { areas } from '@/data/services'
import page from '../page.module.scss'

export default function AboutPage() {
  const { t } = useTranslation()
  const values = t('aboutPage.values', { returnObjects: true })
  const steps = t('process.steps', { returnObjects: true })
  const working = t('working.items', { returnObjects: true })

  return (
    <>
      <Seo title={t('meta.about.title')} description={t('meta.about.description')} />
      <section className={page.hero}>
        <div className={`container ${page.heroSplit}`}>
          <div className={page.heroInner}>
            <p className="eyebrow">{t('aboutPage.eyebrow')}</p>
            <h1 className={page.heroTitle}>{t('aboutPage.title')}</h1>
            <p className="lead">{t('aboutPage.intro')}</p>
          </div>
          <Reveal y={32}>
            <Portrait alt={t('aboutPage.imageAlt')} />
          </Reveal>
        </div>
      </section>

      <section className={page.block} aria-labelledby="about-story">
        <div className={`container ${page.blockGrid}`}>
          <h2 id="about-story" className={page.blockTitle}>
            {t('about.eyebrow')}
          </h2>
          <div>
            <p className="lead" style={{ color: 'var(--content-primary)' }}>
              {t('about.title')}
            </p>
            <p className={page.muted} style={{ marginTop: 'var(--space-5)', maxWidth: '60ch' }}>
              {t('about.description')}
            </p>
          </div>
        </div>
      </section>

      <section className={page.block} aria-labelledby="about-value">
        <div className={`container ${page.blockGrid}`}>
          <h2 id="about-value" className={page.blockTitle}>
            {t('aboutPage.valueTitle')}
          </h2>
          <ul className={page.cols3}>
            {values.map((value, i) => (
              <Reveal as="li" key={value.title} delay={i * 0.06}>
                <h3 className={page.itemTitle}>{value.title}</h3>
                <p className={page.muted}>{value.description}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className={page.block} aria-labelledby="about-skills">
        <div className={`container ${page.blockGrid}`}>
          <h2 id="about-skills" className={page.blockTitle}>
            {t('aboutPage.skillsTitle')}
          </h2>
          <ul className={page.chips}>
            {areas.map((key) => (
              <li key={key} className={page.chip}>
                {t(`services.items.${key}.title`)}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className={page.block} aria-labelledby="about-process">
        <div className={`container ${page.blockGrid}`}>
          <h2 id="about-process" className={page.blockTitle}>
            {t('aboutPage.processTitle')}
          </h2>
          <ol className={page.cols2}>
            {steps.map((step, i) => (
              <Reveal as="li" key={step.title} delay={i * 0.05}>
                <span className={page.index}>{String(i + 1).padStart(2, '0')}</span>
                <h3 className={page.itemTitle}>{step.title}</h3>
                <p className={page.muted}>{step.description}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className={page.block} aria-labelledby="about-working" style={{ paddingBottom: 'var(--section-y)' }}>
        <div className={`container ${page.blockGrid}`}>
          <h2 id="about-working" className={page.blockTitle}>
            {t('working.title')}
          </h2>
          <ul className={page.cols2}>
            {working.map((item, i) => (
              <Reveal as="li" key={item.title} delay={i * 0.05}>
                <h3 className={page.itemTitle}>{item.title}</h3>
                <p className={page.muted}>{item.description}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
