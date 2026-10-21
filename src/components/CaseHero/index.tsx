import type { CSSProperties } from 'react'
import type { Project } from '@/data/projects'
import { ProjectVisual } from '@/components/ProjectVisual'
import { useTheme } from '@/lib/theme'
import styles from './CaseHero.module.scss'

export interface CaseHeroDetail {
  kind: 'role' | 'period' | 'platform'
  label: string
  values: string[]
}

interface Props {
  project: Project
  name: string
  category: string
  title: string
  description: string
  logo?: string
  logoAlt?: string
  accent?: string
  details?: CaseHeroDetail[]
}

export function CaseHero({ project, name, category, title, description, logo, logoAlt, accent, details = [] }: Props) {
  const { theme } = useTheme()
  const style = {
    ...(accent ? { '--case-accent': accent } : {}),
    ...(project.caseHero?.frameRatio ? { '--case-visual-ratio': project.caseHero.frameRatio } : {}),
  } as CSSProperties
  const logoSrc = theme === 'dark' ? project.caseHero?.logoDark ?? logo : logo
  const visualProject = project.caseHero?.image ? { ...project, image: project.caseHero.image } : project

  return (
    <header className={styles.hero} style={style}>
      <div className={`container ${styles.container}`}>
        <div className={styles.layout}>
          <div className={styles.copy}>
            <div className={styles.identity}>
              {!logo && <span className={styles.projectName}>{name}</span>}
              {logoSrc && (
                <span className={styles.logoSurface}>
                  <img className={styles.logo} src={logoSrc} alt={logoAlt ?? `${name} logo`} />
                </span>
              )}
            </div>
            <p className={styles.category}>{category}</p>
            <span className={styles.accentMark} aria-hidden="true" />
            <h1 className={styles.title}>{title}</h1>
            <p className={styles.description}>{description}</p>

            {details.length > 0 && (
              <dl className={styles.details} data-count={details.length}>
                {details.map((detail) => (
                  <div className={styles.detail} key={detail.kind}>
                    <dt>
                      <DetailIcon kind={detail.kind} />
                      <span>{detail.label}</span>
                    </dt>
                    <dd>
                      {detail.values.map((value) => (
                        <span key={value}>{value}</span>
                      ))}
                    </dd>
                  </div>
                ))}
              </dl>
            )}
          </div>

          <div className={styles.visualFrame}>
            <ProjectVisual project={visualProject} alt={title.replace('\n', ' ')} loading="eager" className={styles.visual} />
          </div>
        </div>
      </div>
    </header>
  )
}

function DetailIcon({ kind }: { kind: CaseHeroDetail['kind'] }) {
  const common = {
    width: 20,
    height: 20,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.6,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true as const,
    focusable: false as const,
  }

  if (kind === 'role') {
    return (
      <svg {...common}>
        <circle cx="12" cy="8" r="3.25" />
        <path d="M5 20a7 7 0 0 1 14 0" />
      </svg>
    )
  }

  if (kind === 'period') {
    return (
      <svg {...common}>
        <rect x="4" y="6" width="16" height="15" rx="2" />
        <path d="M8 3v6M16 3v6M4 11h16" />
      </svg>
    )
  }

  return (
    <svg {...common}>
      <path d="m12 3 9 5-9 5-9-5 9-5Z" />
      <path d="m3 12 9 5 9-5M3 16l9 5 9-5" />
    </svg>
  )
}
