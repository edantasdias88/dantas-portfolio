import { useTranslation } from 'react-i18next'
import { DeviceMockup } from '@/components/DeviceMockup'
import { caaAppAssets } from '@/data/caaAppAssets'
import styles from './CaaAppSequence.module.scss'

const screenIds = ['properties', 'details', 'services', 'iago'] as const
const pillarIds = ['properties', 'services', 'relationship', 'intelligence'] as const

export function CaaAppSequence() {
  const { t } = useTranslation()

  return (
    <div className={styles.sequence} role="group" aria-label={t('case.caaAppSequence.ariaLabel')}>
      <figure className={`${styles.fullBleed} ${styles.main}`}>
        <img
          src={caaAppAssets.showcaseMain}
          alt={t('case.caaAppSequence.mainAlt')}
          loading="lazy"
          decoding="async"
        />
      </figure>

      <section className={styles.screensSection} aria-label={t('case.caaAppSequence.screensLabel')}>
        <div className={`container ${styles.screens}`}>
          {caaAppAssets.screens.map((screen, index) => {
            const id = screenIds[index]

            return (
              <figure className={styles.screen} key={screen.id}>
                <DeviceMockup
                  src={screen.src}
                  alt={t(`case.caaAppSequence.screens.${id}.alt`)}
                  className={styles.mockup}
                />
                <figcaption>{t(`case.caaAppSequence.screens.${id}.label`)}</figcaption>
              </figure>
            )
          })}
        </div>
      </section>

      <section className={styles.pairSection} aria-label={t('case.caaAppSequence.pairLabel')}>
        <figure className={styles.pairImage}>
          <img src={caaAppAssets.propertyPhoto} alt={t('case.caaAppSequence.propertyAlt')} loading="lazy" decoding="async" />
        </figure>
        <figure className={styles.pairImage}>
          <img src={caaAppAssets.appInUse} alt={t('case.caaAppSequence.appInUseAlt')} loading="lazy" decoding="async" />
        </figure>
      </section>

      <figure className={`${styles.fullBleed} ${styles.context}`}>
        <img
          src={caaAppAssets.showcaseContext}
          alt={t('case.caaAppSequence.contextAlt')}
          loading="lazy"
          decoding="async"
        />
      </figure>

      <section className={styles.closing} aria-label={t('case.caaAppSequence.closingLabel')}>
        <img className={styles.closingBackground} src={caaAppAssets.showcaseClosingBg} alt="" aria-hidden="true" loading="lazy" decoding="async" />
        <div className={`container ${styles.closingInner}`}>
          <ul className={styles.pillars}>
            {pillarIds.map((id) => (
              <li key={id}>
                <PillarIcon kind={id} />
                <span>{t(`case.caaAppSequence.pillars.${id}`)}</span>
              </li>
            ))}
          </ul>
          <figure className={styles.closingDevice}>
            <DeviceMockup
              src={caaAppAssets.closingScreen}
              alt={t('case.caaAppSequence.closingDeviceAlt')}
              className={styles.mockup}
            />
          </figure>
        </div>
      </section>
    </div>
  )
}

function PillarIcon({ kind }: { kind: (typeof pillarIds)[number] }) {
  const common = {
    width: 22,
    height: 22,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.5,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true as const,
    focusable: false as const,
  }

  if (kind === 'properties') {
    return <svg {...common}><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1V10Z" /></svg>
  }

  if (kind === 'services') {
    return <svg {...common}><path d="M14 7 7 14m-2-5-2 2a2 2 0 0 0 0 3l7 7a2 2 0 0 0 3 0l2-2M8 5l2-2a2 2 0 0 1 3 0l8 8a2 2 0 0 1 0 3l-2 2" /><path d="m13 16 6-6" /></svg>
  }

  if (kind === 'relationship') {
    return <svg {...common}><path d="M16 20v-1.5a3.5 3.5 0 0 0-3.5-3.5h-5A3.5 3.5 0 0 0 4 18.5V20M10 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM16 4.2a3.5 3.5 0 0 1 0 6.8M17 15h1.5a3.5 3.5 0 0 1 3.5 3.5V20" /></svg>
  }

  return <svg {...common}><path d="m12 3 1.4 5.6L19 10l-5.6 1.4L12 17l-1.4-5.6L5 10l5.6-1.4L12 3ZM19 16l.7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7L19 16Z" /></svg>
}
