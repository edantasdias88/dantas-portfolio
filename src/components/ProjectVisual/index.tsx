import type { Project } from '@/data/projects'
import styles from './ProjectVisual.module.scss'

interface Props {
  project: Project
  /** Texto alternativo da imagem real, quando houver. */
  alt?: string
  className?: string
  /** `eager` apenas para a imagem acima da dobra. */
  loading?: 'lazy' | 'eager'
  /** Desloca a composição ilustrativa para a direita (abre espaço para texto à esquerda). */
  offset?: boolean
}

/**
 * Mídia de projeto. Usa a imagem real quando `project.image` existir; caso contrário,
 * exibe uma composição ilustrativa (decorativa) com a identidade do projeto.
 */
export function ProjectVisual({ project, alt = '', className, loading = 'lazy', offset = false }: Props) {
  const cls = [styles.visual, styles[project.visual], offset && styles.offset, className].filter(Boolean).join(' ')
  if (project.image) {
    return (
      <div className={cls} data-fit={project.image.fit ?? 'cover'}>
        <img
          className={styles.image}
          src={project.image.src}
          width={project.image.width}
          height={project.image.height}
          style={{ objectPosition: project.image.objectPosition }}
          alt={alt}
          loading={loading}
          decoding="async"
        />
      </div>
    )
  }
  return (
    <div className={cls} aria-hidden="true">
      {project.visual === 'platform' && <Platform />}
      {project.visual === 'mobile' && <Mobile />}
      {project.visual === 'system' && <System />}
    </div>
  )
}

function Platform() {
  return (
    <div className={styles.stage}>
      <div className={styles.browser}>
        <div className={styles.browserBar}>
          <i />
          <i />
          <i />
          <span className={styles.url} />
        </div>
        <div className={styles.browserBody}>
          <div className={styles.search}>
            <span />
            <span />
            <b />
          </div>
          <div className={styles.listings}>
            {[0, 1, 2].map((i) => (
              <div key={i} className={styles.listing}>
                <div className={styles.listingImg} data-i={i} />
                <span />
                <span />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export function Mobile() {
  return (
    <div className={styles.stage}>
      <div className={styles.phone}>
        <div className={styles.notch} />
        <div className={styles.map}>
          <svg viewBox="0 0 200 260" preserveAspectRatio="none">
            <path d="M-10 60 C 50 40, 90 110, 210 80" />
            <path d="M-10 150 C 60 120, 120 200, 210 170" />
            <path d="M70 -10 C 60 80, 120 140, 100 270" />
            <path d="M150 -10 C 140 60, 170 160, 160 270" />
          </svg>
          <span className={styles.pin} style={{ left: '28%', top: '30%' }} />
          <span className={styles.pin} style={{ left: '62%', top: '48%' }} data-active />
          <span className={styles.pin} style={{ left: '44%', top: '68%' }} />
        </div>
        <div className={styles.sheet}>
          <div className={styles.sheetHandle} />
          <div className={styles.sheetCard}>
            <div className={styles.sheetThumb} />
            <div>
              <span />
              <span />
            </div>
          </div>
          <div className={styles.sheetCard}>
            <div className={styles.sheetThumb} data-alt />
            <div>
              <span />
              <span />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function System() {
  return (
    <div className={styles.stage}>
      <div className={styles.board}>
        <div className={styles.swatches}>
          {['#0a0a0b', '#2f5bff', '#8aa6ff', '#ebebe8', '#ffffff'].map((c) => (
            <span key={c} style={{ background: c }} />
          ))}
        </div>
        <div className={styles.type}>
          <b>Aa</b>
          <div>
            <span />
            <span />
            <span />
          </div>
        </div>
        <div className={styles.components}>
          <span className={styles.btnPrimary} />
          <span className={styles.btnSecondary} />
          <span className={styles.chip} />
          <span className={styles.toggleOn} />
        </div>
        <div className={styles.tokens}>
          {[4, 8, 16, 24, 32, 48].map((n) => (
            <span key={n} style={{ width: n * 1.4 }} />
          ))}
        </div>
      </div>
    </div>
  )
}
