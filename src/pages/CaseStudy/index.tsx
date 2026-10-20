import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router'
import { Button, ButtonLink } from '@/components/Button'
import { ProjectVisual } from '@/components/ProjectVisual'
import { Seo } from '@/components/Seo'
import { caseHref, findProjectBySlug, projects } from '@/data/projects'
import { useContact } from '@/lib/contact'
import NotFoundPage from '../NotFound'
import page from '../page.module.scss'
import styles from './CaseStudy.module.scss'

export default function CaseStudyPage() {
  const { slug } = useParams()
  const { t } = useTranslation()
  const { openContact } = useContact()
  const project = findProjectBySlug(slug)
  if (!project) return <NotFoundPage />

  const key = project.key
  const name = t(`projects.items.${key}.name`)
  const tags = t(`projects.items.${key}.tags`, { returnObjects: true })
  const index = projects.indexOf(project)
  const next = projects[(index + 1) % projects.length]

  return (
    <article>
      <Seo title={`${name} — ${t(`projects.items.${key}.title`)} | Edilson Dantas`} description={t(`projects.items.${key}.description`)} />

      <header className={page.hero}>
        <div className={`container ${page.heroInner}`}>
          <p className="eyebrow">{t(`projects.items.${key}.category`)}</p>
          <p className={styles.name}>{name}</p>
          <h1 className={page.heroTitle}>{t(`projects.items.${key}.title`)}</h1>
          <p className="lead">{t(`projects.items.${key}.description`)}</p>
        </div>
      </header>

      <div className={`container ${styles.mediaWrap}`}>
        <div className={styles.media}>
          <ProjectVisual project={project} alt={t(`projects.items.${key}.title`)} loading="eager" />
        </div>
      </div>

      <section className={page.block} aria-labelledby="case-overview">
        <div className={`container ${page.blockGrid}`}>
          <h2 id="case-overview" className={page.blockTitle}>
            {t('case.overview')}
          </h2>
          <dl className={styles.facts}>
            <div>
              <dt>{t('case.category')}</dt>
              <dd>{t(`projects.items.${key}.category`)}</dd>
            </div>
            <div>
              <dt>{t('case.focus')}</dt>
              <dd>
                <ul className={page.chips}>
                  {tags.map((tag) => (
                    <li key={tag} className={page.chip}>
                      {tag}
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          </dl>
        </div>
      </section>

      {/* Contexto, papel, decisões e resultados entram aqui quando o material real do case estiver documentado. */}
      <section className={page.block} aria-labelledby="case-status">
        <div className={`container ${page.blockGrid}`}>
          <h2 id="case-status" className={page.blockTitle}>
            {t('case.inPreparation')}
          </h2>
          <div className={styles.status}>
            <p className={page.muted}>{t('case.inPreparationText')}</p>
            <Button arrow onClick={(e) => openContact(e.currentTarget)}>
              {t('common.cta')}
            </Button>
          </div>
        </div>
      </section>

      <nav className={`${page.block} ${styles.next}`} aria-label={t('common.nextProject')}>
        <div className={`container ${styles.nextInner}`}>
          <ButtonLink to="/projetos" variant="ghost">
            ← {t('case.allProjects')}
          </ButtonLink>
          <ButtonLink to={caseHref(next)} variant="secondary" arrow arrowDirection="up-right">
            {t('common.nextProject')}: {t(`projects.items.${next.key}.name`)}
          </ButtonLink>
        </div>
      </nav>
    </article>
  )
}
