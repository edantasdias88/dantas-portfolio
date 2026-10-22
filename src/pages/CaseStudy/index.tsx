import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router'
import { Button, ButtonLink } from '@/components/Button'
import { CaseLink } from '@/components/CaseLink'
import { CaseHero, type CaseHeroDetail } from '@/components/CaseHero'
import { ProjectVisual } from '@/components/ProjectVisual'
import { CaaAppSequence } from './CaaAppSequence'
import { IruasSequence } from './IruasSequence'
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
  const heroDetails: CaseHeroDetail[] = key === 'caa'
    ? [
        {
          kind: 'role',
          label: t('case.sections.role'),
          values: t('projects.items.caa.hero.role').split('\n'),
        },
        {
          kind: 'period',
          label: t('case.sections.period'),
          values: [t('projects.items.caa.hero.period')],
        },
        {
          kind: 'platform',
          label: t('case.sections.platform'),
          values: t('projects.items.caa.hero.platform').split('\n'),
        },
      ]
    : key === 'iruas'
      ? [
          {
            kind: 'role',
            label: t('case.sections.role'),
            values: [t('projects.items.iruas.hero.role')],
          },
          {
            kind: 'period',
            label: t('case.sections.period'),
            values: [t('projects.items.iruas.hero.period')],
          },
          {
            kind: 'platform',
            label: t('case.sections.platform'),
            values: t('projects.items.iruas.hero.platform').split('\n'),
          },
        ]
    : []
  const index = projects.indexOf(project)
  const nextKey = key === 'caa' ? 'iruas' : 'caa'
  const next = projects.find((item) => item.key === nextKey) ?? projects[(index + 1) % projects.length]

  return (
    <article>
      <Seo
        title={`${name} — ${t(`projects.items.${key}.title`)}`}
        description={t(`meta.cases.${key}`)}
        workName={`${name} — ${t(`projects.items.${key}.title`).replace(/\s+/g, ' ')}`}
      />

      {project.caseHero ? (
        <CaseHero
          project={project}
          name={name}
          category={t(`projects.items.${key}.category`)}
          title={t(`projects.items.${key}.title`)}
          description={t(`projects.items.${key}.description`)}
          logo={project.caseHero.logo}
          logoAlt={key === 'caa' || key === 'iruas' ? t(`projects.items.${key}.hero.logoAlt`) : undefined}
          accent={project.caseHero.accent}
          details={heroDetails}
        />
      ) : (
        <>
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
        </>
      )}

      {key === 'caa' ? (
        <>
          <section className={page.block} aria-labelledby="caa-story-title">
            <div className={`container ${page.blockGrid}`}>
              <div className={styles.storyLead}>
                <h2 id="caa-story-title" className={page.blockTitle}>
                  {t('case.caaStory.title')}
                </h2>
                <div className={styles.storyIntro}>
                  <p>{t('case.caaStory.intro')}</p>
                  <p>{t('case.caaStory.introContinuation')}</p>
                </div>
              </div>
              <div className={styles.storySections}>
                <section className={styles.storySection} aria-labelledby="caa-challenge-title">
                  <h3 id="caa-challenge-title">{t('case.caaStory.challenge.label')}</h3>
                  <p>{t('case.caaStory.challenge.text')}</p>
                </section>
                <section className={styles.storySection} aria-labelledby="caa-process-title">
                  <h3 id="caa-process-title">{t('case.caaStory.process.label')}</h3>
                  <p>{t('case.caaStory.process.text')}</p>
                  <p>{t('case.caaStory.process.continuation')}</p>
                </section>
                <section className={styles.storySection} aria-labelledby="caa-results-title">
                  <h3 id="caa-results-title">{t('case.caaStory.results.label')}</h3>
                  <p>{t('case.caaStory.results.text')}</p>
                  <p>{t('case.caaStory.results.continuation')}</p>
                </section>
              </div>
            </div>
          </section>
          <CaaAppSequence />
        </>
      ) : key === 'iruas' ? (
        <>
          <section className={page.block} aria-labelledby="iruas-story-title">
            <div className={`container ${page.blockGrid}`}>
              <div className={styles.storyLead}>
                <h2 id="iruas-story-title" className={page.blockTitle}>
                  {t('case.iruasStory.title')}
                </h2>
                <div className={styles.storyIntro}>
                  <p>{t('case.iruasStory.intro')}</p>
                  <p>{t('case.iruasStory.introContinuation')}</p>
                </div>
              </div>
              <div className={styles.storySections}>
                <section className={styles.storySection} aria-labelledby="iruas-challenge-title">
                  <h3 id="iruas-challenge-title">{t('case.iruasStory.challenge.label')}</h3>
                  <p>{t('case.iruasStory.challenge.text')}</p>
                </section>
                <section className={styles.storySection} aria-labelledby="iruas-process-title">
                  <h3 id="iruas-process-title">{t('case.iruasStory.process.label')}</h3>
                  <p>{t('case.iruasStory.process.text')}</p>
                  <p>{t('case.iruasStory.process.continuation')}</p>
                  <p>{t('case.iruasStory.process.goal')}</p>
                </section>
                <section className={styles.storySection} aria-labelledby="iruas-results-title">
                  <h3 id="iruas-results-title">{t('case.iruasStory.results.label')}</h3>
                  <p>{t('case.iruasStory.results.text')}</p>
                  <p>{t('case.iruasStory.results.continuation')}</p>
                  <p>{t('case.iruasStory.results.final')}</p>
                </section>
              </div>
            </div>
          </section>
          <IruasSequence />
        </>
      ) : (
        <>
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
        </>
      )}

      <nav className={`${page.block} ${styles.next}`} aria-label={t('common.nextProject')}>
        <div className={`container ${styles.nextInner}`}>
          <ButtonLink to="/projetos" variant="ghost">
            ← {t('case.allProjects')}
          </ButtonLink>
          <CaseLink to={caseHref(next)} size="md">
            {t('common.nextProject')}: {t(`projects.items.${next.key}.name`)}
          </CaseLink>
        </div>
      </nav>
    </article>
  )
}
