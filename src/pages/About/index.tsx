import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import adobexd from '@/assets/about/tools/adobexd.svg'
import confluence from '@/assets/about/tools/confluence.svg'
import css3 from '@/assets/about/tools/css3.svg'
import figma from '@/assets/about/tools/figma.svg'
import googleanalytics from '@/assets/about/tools/googleanalytics.svg'
import hotjar from '@/assets/about/tools/hotjar.svg'
import html5 from '@/assets/about/tools/html5.svg'
import jira from '@/assets/about/tools/jira.svg'
import javascript from '@/assets/about/tools/javascript.svg'
import miro from '@/assets/about/tools/miro.svg'
import sketch from '@/assets/about/tools/sketch.svg'
import zeplin from '@/assets/about/tools/zeplin.svg'
import zeroheight from '@/assets/about/tools/zeroheight.svg'
import photoshop from '@/assets/about/tools/photoshop.svg'
import illustrator from '@/assets/about/tools/illustrator.svg'
import notion from '@/assets/about/tools/notion.svg'
import figjam from '@/assets/about/tools/figjam.svg'
import github from '@/assets/about/tools/github.svg'
import vscode from '@/assets/about/tools/vscode.svg'
import ai from '@/assets/about/tools/ai.svg'
import { Portrait } from '@/components/Portrait'
import { Reveal } from '@/components/Reveal'
import { Seo } from '@/components/Seo'
import page from '../page.module.scss'
import styles from './About.module.scss'
import { PortraitFacts } from './PortraitFacts'

const tools = [
  { id: 'figma', name: 'Figma', src: figma },
  { id: 'sketch', name: 'Sketch', src: sketch },
  { id: 'adobexd', name: 'Adobe XD', src: adobexd },
  { id: 'zeplin', name: 'Zeplin', src: zeplin },
  { id: 'miro', name: 'Miro', src: miro },
  { id: 'zeroheight', name: 'Zeroheight', src: zeroheight },
  { id: 'jira', name: 'Jira', src: jira },
  { id: 'confluence', name: 'Confluence', src: confluence },
  { id: 'html5', name: 'HTML', src: html5 },
  { id: 'css3', name: 'CSS', src: css3 },
  { id: 'javascript', name: 'JavaScript', src: javascript },
  { id: 'googleanalytics', name: 'Google Analytics', src: googleanalytics },
  { id: 'hotjar', name: 'Hotjar', src: hotjar },
  { id: 'photoshop', name: 'Adobe Photoshop', src: photoshop },
  { id: 'illustrator', name: 'Adobe Illustrator', src: illustrator },
  { id: 'notion', name: 'Notion', src: notion },
  { id: 'figjam', name: 'FigJam', src: figjam },
  { id: 'github', name: 'GitHub', src: github },
  { id: 'vscode', name: 'Visual Studio Code', src: vscode },
  { id: 'ai', name: 'IA', src: ai },
] as const

export default function AboutPage() {
  const { t } = useTranslation()
  const trajectory = t('aboutPage.trajectoryBody', { returnObjects: true })
  const vision = t('aboutPage.visionBody', { returnObjects: true })

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
            <div className={styles.portraitStage}>
              <Portrait alt={t('aboutPage.imageAlt')} />
              <PortraitFacts />
            </div>
          </Reveal>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="about-trajectory">
        <div className={`container ${styles.editorial}`}>
          <Reveal className={styles.editorialHeading}>
            <p className="eyebrow">{t('aboutPage.trajectoryEyebrow')}</p>
            <h2 id="about-trajectory" className={styles.sectionTitle}>
              {t('aboutPage.trajectoryTitle')}
            </h2>
          </Reveal>
          <div className={styles.trajectoryCopy}>
            {trajectory.map((paragraph, index) => (
              <Reveal key={paragraph} delay={index * 0.06}>
                <p className={index === 0 ? 'lead' : styles.bodyCopy}>{paragraph}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.toolsSection} aria-labelledby="about-tools-title">
        <div className={`container ${styles.toolsContainer}`}>
          <div className={styles.toolsPanel}>
            <h2 id="about-tools-title" className={styles.toolsTitle}>{t('aboutPage.toolsLabel')}</h2>
            <ul className={styles.toolGroup}>
              {tools.map((tool) => (
                <li key={tool.id} className={styles.tool}>
                  <img className={styles.logo} src={tool.src} width="36" height="36" alt="" loading="lazy" />
                  <span className={styles.toolName}>{tool.name}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="about-vision">
        <div className={`container ${styles.vision}`}>
          <Reveal className={styles.visionHeading}>
            <p className="eyebrow">{t('aboutPage.visionEyebrow')}</p>
            <h2 id="about-vision" className={styles.sectionTitle}>
              {t('aboutPage.visionTitle')}
            </h2>
          </Reveal>
          <div className={styles.visionCopy}>
            {vision.map((paragraph, index) => (
              <Reveal key={paragraph} delay={index * 0.06}>
                <p className={index === 0 ? 'lead' : styles.bodyCopy}>{paragraph}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.servicesCta} aria-labelledby="about-services-title">
        <div className={`container ${styles.servicesCtaInner}`}>
          <Reveal className={styles.servicesCtaCopy}>
            <h2 id="about-services-title" className={styles.ctaTitle}>
              {t('aboutPage.servicesCtaTitle')}
            </h2>
            <p className={styles.bodyCopy}>{t('aboutPage.servicesCtaDescription')}</p>
          </Reveal>
          <Reveal>
            <Link className={styles.servicesLink} to="/#servicos">
              <span>{t('aboutPage.servicesCtaLink')}</span>
              <span aria-hidden="true">↗</span>
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  )
}
