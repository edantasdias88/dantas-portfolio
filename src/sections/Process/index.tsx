import { useId, useState } from 'react'
import { useTranslation } from 'react-i18next'
import bg from '@/assets/figma/process/bg.svg'
import contour from '@/assets/figma/process/contour.svg'
import courbe from '@/assets/figma/process/courbe.svg'
import eclatInferieur from '@/assets/figma/process/eclat-inferieur.svg'
import eclatLateral from '@/assets/figma/process/eclat-lateral.svg'
import pli from '@/assets/figma/process/pli.svg'
import step1 from '@/assets/figma/process/step-1.svg'
import step2 from '@/assets/figma/process/step-2.svg'
import step3 from '@/assets/figma/process/step-3.svg'
import step4 from '@/assets/figma/process/step-4.svg'
import { Reveal } from '@/components/Reveal'
import styles from './Process.module.scss'

const ICONS = [
  { src: step1, w: 67 },
  { src: step2, w: 64 },
  { src: step3, w: 64 },
  { src: step4, w: 64 },
]

export function Process() {
  const { t } = useTranslation()
  const uid = useId()
  const steps = t('process.steps', { returnObjects: true })
  const [active, setActive] = useState(0)

  return (
    <section id="processo" className={styles.section} aria-labelledby="process-title">
      <div className={styles.backdrop} style={{ backgroundImage: `url("${bg}")` }} aria-hidden="true" />
      <div className={`container ${styles.inner}`}>
        <Reveal>
          <p className={`eyebrow ${styles.eyebrow}`}>{t('process.eyebrow')}</p>
          <div className={styles.head}>
            <h2 id="process-title" className={styles.title}>
              <span>{t('process.titleLead')}</span> <span className={styles.titleMuted}>{t('process.titleMuted')}</span>
            </h2>
            <p className={styles.support}>
              <span>{t('process.supportLead')}</span> <span className={styles.supportMuted}>{t('process.supportMuted')}</span>
            </p>
          </div>
        </Reveal>

        <ol className={styles.steps}>
          {steps.map((step, i) => {
            const isActive = i === active
            const buttonId = `${uid}-step-${i}`
            const panelId = `${uid}-panel-${i}`
            return (
              <li key={step.title} className={styles.step} data-active={isActive}>
                <span className={styles.surface} aria-hidden="true" />
                <span className={styles.activeSurface} aria-hidden="true" />
                <Decoration />
                <span className={styles.number} aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className={styles.body}>
                  <div className={styles.titleGroup}>
                    <span
                      className={styles.icon}
                      aria-hidden="true"
                      style={{
                        width: ICONS[i].w,
                        maskImage: `url("${ICONS[i].src}")`,
                        WebkitMaskImage: `url("${ICONS[i].src}")`,
                      }}
                    />
                    <h3 className={styles.stepHeading}>
                      <button
                        id={buttonId}
                        type="button"
                        className={styles.trigger}
                        aria-expanded={isActive}
                        aria-controls={panelId}
                        onClick={() => setActive(i)}
                      >
                        {step.title}
                      </button>
                    </h3>
                  </div>
                  <div id={panelId} role="region" aria-labelledby={buttonId} className={styles.panel} inert={!isActive}>
                    <div className={styles.panelInner}>
                      <p>{step.description}</p>
                    </div>
                  </div>
                </div>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}

/** Camadas de luz do card ativo (Figma 21:1002–21:1007), desenhadas para 578px de largura. */
function Decoration() {
  return (
    <span className={styles.deco} aria-hidden="true">
      <span className={styles.halo} />
      <img
        className={styles.lowerGlow}
        src={eclatInferieur}
        alt=""
        style={{ left: 'auto', top: 'auto', right: -54, bottom: -42, width: 'clamp(112px, 30%, 170px)', height: 'auto' }}
      />
      <img src={eclatLateral} alt="" style={{ left: 541.7, top: 19.7, width: 63, height: 191 }} />
      <img src={pli} alt="" style={{ left: 280.7, top: -1.3, width: 296, height: 372 }} />
      <img src={contour} alt="" style={{ left: -1.9, top: -1.8, width: 579.2, height: 372.5 }} />
      <img src={courbe} alt="" style={{ left: -1.3, top: -1.3, width: 579, height: 372.3 }} />
    </span>
  )
}
