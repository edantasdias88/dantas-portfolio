import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform, type MotionValue } from 'motion/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CaseLink } from '@/components/CaseLink'
import { ProjectVisual } from '@/components/ProjectVisual'
import { Reveal } from '@/components/Reveal'
import { caseHref, portfolioProjects, type Project } from '@/data/projects'
import { useMediaQuery } from '@/lib/hooks'
import styles from './Projects.module.scss'

export function Projects() {
  const pinned = useMediaQuery('(min-width: 768px) and (min-height: 560px)')
  return pinned ? <PinnedProjects /> : <StackedProjects />
}

/**
 * Desktop/tablet: a seção fica fixa na viewport enquanto houver slides. Cada slide corresponde a
 * 100vh de rolagem; um gesto de roda avança no máximo um slide. Nas extremidades o scroll é liberado.
 */
function PinnedProjects() {
  const { t } = useTranslation()
  const wrapper = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const activeRef = useRef(0)
  const reduce = useReducedMotion()
  const total = portfolioProjects.length
  const { scrollYProgress } = useScroll({ target: wrapper, offset: ['start start', 'end end'] })
  const position = useTransform(scrollYProgress, (p) => p * (total - 1))

  useMotionValueEvent(position, 'change', (value) => {
    const next = Math.min(total - 1, Math.max(0, Math.round(value)))
    if (next === activeRef.current) return
    activeRef.current = next
    setActive(next)
  })

  const goTo = useCallback(
    (index: number) => {
      const el = wrapper.current
      if (!el) return
      const top = el.getBoundingClientRect().top + window.scrollY + index * window.innerHeight
      window.scrollTo({ top, behavior: reduce ? 'auto' : 'smooth' })
    },
    [reduce],
  )

  // Um slide por gesto de roda/trackpad enquanto a seção está fixada.
  useEffect(() => {
    let locked = false
    let lockStart = 0
    let lastWheel = 0

    const onWheel = (event: WheelEvent) => {
      const el = wrapper.current
      if (!el || event.ctrlKey || Math.abs(event.deltaY) < Math.abs(event.deltaX)) return
      const rect = el.getBoundingClientRect()
      const isPinned = rect.top <= 1 && rect.bottom >= window.innerHeight - 1
      if (!isPinned) return

      const now = performance.now()
      const idle = now - lastWheel > 180
      lastWheel = now
      if (locked && idle && now - lockStart > 500) locked = false

      const direction = Math.sign(event.deltaY)
      const current = Math.round(position.get())
      const next = current + direction
      // Extremidades: libera o scroll natural para a seção anterior/seguinte.
      if (direction === 0 || next < 0 || next > total - 1) {
        if (!locked) return
      }

      event.preventDefault()
      if (locked || next < 0 || next > total - 1) return
      locked = true
      lockStart = now
      goTo(next)
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    return () => window.removeEventListener('wheel', onWheel)
  }, [total, position, goTo])

  return (
    <section id="projetos" aria-labelledby="projects-title" className={styles.section}>
      <h2 id="projects-title" className="visually-hidden">
        {t('projects.title')}
      </h2>
      <div ref={wrapper} className={styles.wrapper} style={{ height: `${total * 100}vh` }}>
        <div className={styles.sticky}>
          {portfolioProjects.map((project, i) => (
            <Slide key={project.key} project={project} index={i} active={active === i} position={position} />
          ))}

          <nav className={`container ${styles.side}`} aria-label={t('projects.title')}>
            <ol>
              {portfolioProjects.map((project, i) => (
                <li key={project.key}>
                  <button
                    type="button"
                    className={styles.sideItem}
                    aria-current={active === i ? 'true' : undefined}
                    aria-label={t('a11y.goToSlide', { index: i + 1, name: t(`projects.items.${project.key}.name`) })}
                    onClick={() => goTo(i)}
                  >
                    <span className={styles.thumb} aria-hidden="true">
                      <ProjectVisual project={project} className={styles.thumbVisual} />
                    </span>
                    <span className={styles.sideTooltip} aria-hidden="true">
                      {t(`projects.items.${project.key}.name`)}
                    </span>
                  </button>
                </li>
              ))}
            </ol>
          </nav>
          <p className="visually-hidden" aria-live="polite">
            {t('a11y.slide', { current: active + 1, total })}
          </p>
        </div>
      </div>
    </section>
  )
}

function Slide({
  project,
  index,
  active,
  position,
}: {
  project: Project
  index: number
  active: boolean
  position: MotionValue<number>
}) {
  const { t } = useTranslation()
  const reduce = useReducedMotion()
  // Parallax sutil: a imagem desloca-se mais devagar que a troca de slides.
  const y = useTransform(position, (p) => (reduce ? '0%' : `${(index - p) * 12}%`))
  const scale = useTransform(position, (p) => (reduce ? 1 : 1.08 - Math.min(Math.abs(index - p), 1) * 0.04))
  const key = project.key

  return (
    <article className={styles.slide} data-active={active} aria-hidden={!active} inert={!active}>
      <motion.div className={styles.media} style={{ y, scale }}>
        <ProjectVisual project={project} offset loading={index === 0 ? 'eager' : 'lazy'} alt={t(`projects.items.${key}.title`)} />
      </motion.div>
      <div className={styles.overlay} aria-hidden="true" />
      <div className={`container ${styles.content}`}>
        <div className={styles.col}>
          <p className={styles.label}>{t(`projects.items.${key}.name`)}</p>
          <h3 className={styles.title}>{t(`projects.items.${key}.title`)}</h3>
          <p className={styles.description}>{t(`projects.items.${key}.description`)}</p>
          <CaseLink to={caseHref(project)} className={styles.caseLink} tone="project" tabIndex={active ? 0 : -1}>
            {t('common.viewCase')}
          </CaseLink>
        </div>
      </div>
    </article>
  )
}

/** Mobile: sequência vertical natural, sem scroll fixado. */
function StackedProjects() {
  const { t } = useTranslation()
  return (
    <section id="projetos" className={styles.stacked} aria-labelledby="projects-title">
      <div className="container">
        <p className="eyebrow">{t('projects.eyebrow')}</p>
        <h2 id="projects-title" className={`section-heading ${styles.stackedTitle}`}>
          {t('projects.title')}
        </h2>
      </div>
      <ol className={styles.stackedList}>
        {portfolioProjects.map((project, i) => (
          <li key={project.key}>
            <Reveal className={styles.card}>
              <div className={styles.cardMedia}>
                <ProjectVisual project={project} alt={t(`projects.items.${project.key}.title`)} />
              </div>
              <div className={`container ${styles.cardBody}`}>
                <p className={styles.label}>
                  {String(i + 1).padStart(2, '0')} · {t(`projects.items.${project.key}.name`)}
                </p>
                <h3 className={styles.title}>{t(`projects.items.${project.key}.title`)}</h3>
                <p className={styles.description}>{t(`projects.items.${project.key}.description`)}</p>
                <CaseLink to={caseHref(project)} className={styles.caseLink} tone="project">
                  {t('common.viewCase')}
                </CaseLink>
              </div>
            </Reveal>
          </li>
        ))}
      </ol>
    </section>
  )
}
