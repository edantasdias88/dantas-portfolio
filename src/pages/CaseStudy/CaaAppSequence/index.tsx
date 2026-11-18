import type { CSSProperties } from 'react'
import { useTranslation } from 'react-i18next'
import { Reveal } from '@/components/Reveal'
import { caaAppAssets } from '@/data/caaAppAssets'
import { ExperienceCarousel } from './ExperienceCarousel'
import { SolutionDevices } from './SolutionDevices'
import styles from './CaaAppSequence.module.scss'

const alphabet = Array.from('ABCDEFGHIJKLMNOPQRSTUVWXYZ', (letter) => letter + letter.toLowerCase())
const palette = ['#C84945', '#413660', '#939393', '#7D7E81'] as const

const discoverySlides = ['properties', 'filters', 'details', 'connection'] as const
const iagoSlides = ['iago', 'iagoResponse', 'iagoServiceProviders'] as const

const servicesSlides = ['services', 'servicesFilters', 'servicesProfile'] as const

export function CaaAppSequence() {
  const { t } = useTranslation()
  const { narrativePhoto } = caaAppAssets
  const copy = (key: string) => t(`case.caaPresentation.${key}`, { defaultValue: '' })

  return (
    <div className={styles.caseBody}>
      <div className={styles.narrative}>
        <section className={`container ${styles.editorialGrid}`} aria-labelledby="caa-challenge">
          <Reveal className={styles.editorialHeading} y={12}>
            <p className="eyebrow">{copy('problem.eyebrow')}</p>
            <h2 id="caa-challenge" className={styles.editorialTitle}>{copy('problem.title')}</h2>
          </Reveal>
          <div className={styles.problemCopy}>
            <p>{copy('problem.context')}</p>
            <p>{copy('problem.friction')}</p>
          </div>
        </section>

        <Reveal as="figure" className={styles.narrativePhoto} y={12}>
          <img
            src={narrativePhoto.src}
            width={narrativePhoto.width}
            height={narrativePhoto.height}
            alt={copy('problem.photoAlt')}
            loading="lazy"
            decoding="async"
          />
        </Reveal>

        <section className={`container ${styles.solution}`} aria-labelledby="caa-solution">
          <Reveal className={styles.editorialGrid} y={12}>
            <div className={styles.editorialHeading}>
              <p className="eyebrow">{copy('solution.eyebrow')}</p>
              <h2 id="caa-solution" className={styles.editorialTitle}>{copy('solution.title')}</h2>
            </div>
            <div className={styles.solutionCopy}>
              <p>{copy('solution.concept')}</p>
              <p>{copy('solution.areas')}</p>
              <p>{copy('solution.goal')}</p>
            </div>
          </Reveal>

          <SolutionDevices />
        </section>
      </div>

      <section className={styles.process} aria-labelledby="caa-process">
        <div className={`container ${styles.processInner}`}>
          <Reveal className={styles.processIntro}>
            <p className="eyebrow">{copy('process.eyebrow')}</p>
            <h2 id="caa-process" className={styles.editorialTitle}>{copy('process.title')}</h2>
            <p>{copy('process.text')}</p>
          </Reveal>
          <Reveal as="figure" className={styles.context}>
            <img src={caaAppAssets.filtering} width={1672} height={941} alt={copy('process.alt')} loading="lazy" decoding="async" />
          </Reveal>
        </div>
      </section>

      <section className={styles.identity} aria-labelledby="caa-identity">
        <div className="container">
          <div className={styles.typePlate}>
            <Reveal className={styles.typeIntro}>
              <p className="eyebrow">{copy('identity.eyebrow')}</p>
              <h2 id="caa-identity" className={styles.fontName}>Roboto</h2>
              <p className={styles.fontDescription}>{copy('identity.description')}</p>
            </Reveal>
            <Reveal className={styles.typeSpecimen}>
              <p className={styles.alphabet}>
                {alphabet.map((pair) => <span key={pair}>{pair}</span>)}
              </p>
              <p className={styles.numerals}>0123456789</p>
            </Reveal>
          </div>
          <Reveal>
            <ul className={styles.circles} aria-label={copy('identity.palette')}>
              {palette.map((hex) => (
                <li key={hex} style={{ '--swatch': hex } as CSSProperties}>{hex}</li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section id="caa-experience" className={styles.experience} aria-labelledby="caa-experience-title">
        <div className="container">
          <ExperienceCarousel
            id="caa-experience-title"
            slides={discoverySlides}
            title={copy('experience.discovery')}
            description={copy('experience.discoveryText')}
          />
        </div>
        <section className={styles.assistant} aria-labelledby="caa-iago">
          <div className="container">
            <ExperienceCarousel
              id="caa-iago"
              slides={iagoSlides}
              title="IAgo"
              description={copy('experience.assistant')}
              reversed
            />
          </div>
        </section>
        <section className={`container ${styles.services}`} aria-labelledby="caa-services">
          <ExperienceCarousel
            id="caa-services"
            slides={servicesSlides}
            title={copy('architecture.services')}
            description={copy('experience.services')}
          />
        </section>
      </section>

    </div>
  )
}
