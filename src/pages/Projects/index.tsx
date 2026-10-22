import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { CaseLinkContent } from '@/components/CaseLink'
import { ProjectVisual } from '@/components/ProjectVisual'
import { Reveal } from '@/components/Reveal'
import { Seo } from '@/components/Seo'
import { caseHref, portfolioProjects } from '@/data/projects'
import page from '../page.module.scss'
import styles from './Projects.module.scss'

export default function ProjectsPage() {
  const { t } = useTranslation()
  return (
    <>
      <Seo title={t('meta.projects.title')} description={t('meta.projects.description')} />
      <section className={page.hero}>
        <div className={`container ${page.heroInner}`}>
          <p className="eyebrow">{t('projectsPage.eyebrow')}</p>
          <h1 className={page.heroTitle}>{t('projectsPage.title')}</h1>
          <p className="lead">{t('projectsPage.description')}</p>
        </div>
      </section>

      <section className={styles.listSection} aria-label={t('projects.title')}>
        <ol className={`container ${styles.list}`}>
          {portfolioProjects.map((project, i) => {
            const key = project.key
            return (
              <Reveal as="li" key={key} className={styles.item}>
                <Link to={caseHref(project)} className={styles.link}>
                  <div className={styles.media}>
                    <ProjectVisual project={project} alt={t(`projects.items.${key}.title`)} loading={i === 0 ? 'eager' : 'lazy'} />
                  </div>
                  <div className={styles.body}>
                    <p className="eyebrow">
                      {String(i + 1).padStart(2, '0')} · {t(`projects.items.${key}.category`)}
                    </p>
                    <h2 className={styles.title}>
                      <span className={styles.name}>{t(`projects.items.${key}.name`)}</span>
                      {t(`projects.items.${key}.title`)}
                    </h2>
                    <p className={styles.description}>{t(`projects.items.${key}.description`)}</p>
                    <CaseLinkContent>{t('common.viewCase')}</CaseLinkContent>
                  </div>
                </Link>
              </Reveal>
            )
          })}
        </ol>
      </section>
    </>
  )
}
