import { useTranslation } from 'react-i18next'
import { DeviceMockup } from '@/components/DeviceMockup'
import { iruasCaseAssets } from '@/data/iruasCaseAssets'
import styles from './IruasSequence.module.scss'

const phoneClasses = [styles.phone1, styles.phone2, styles.phone3, styles.phone4]

export function IruasSequence() {
  const { t } = useTranslation()

  return (
    <div className={styles.sequence} role="group" aria-label={t('case.iruasSequence.ariaLabel')}>
      <figure className={`${styles.fullBleed} ${styles.discovery}`}>
        <img src={iruasCaseAssets.heroCamera} alt={t('case.iruasSequence.heroAlt')} loading="lazy" decoding="async" />
      </figure>

      <section className={styles.screenSection} aria-label={t('case.iruasSequence.screensLabel')}>
        <div className={`container ${styles.screenGrid}`}>
          {iruasCaseAssets.screens.map((screen) => (
            <figure className={styles.screen} key={screen.id}>
              <DeviceMockup
                src={screen.src}
                alt={t(`case.iruasSequence.screens.${screen.id}.alt`)}
                className={styles.mockup}
              />
              <figcaption>{t(`case.iruasSequence.screens.${screen.id}.label`)}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className={styles.pairSection} aria-label={t('case.iruasSequence.pairLabel')}>
        <figure className={styles.pairImage}>
          <img src={iruasCaseAssets.propertyArchitecture} alt={t('case.iruasSequence.propertyAlt')} loading="lazy" decoding="async" />
        </figure>
        <figure className={`${styles.pairImage} ${styles.devicePanel}`}>
          <DeviceMockup
            src={iruasCaseAssets.interfaceDetail}
            alt={t('case.iruasSequence.detailAlt')}
            className={styles.detailMockup}
          />
        </figure>
      </section>

      <figure className={`${styles.fullBleed} ${styles.passenger}`}>
        <img src={iruasCaseAssets.passengerRoute} alt={t('case.iruasSequence.passengerAlt')} loading="lazy" decoding="async" />
      </figure>

      <figure className={`${styles.fullBleed} ${styles.street}`}>
        <img src={iruasCaseAssets.residentialStreet} alt={t('case.iruasSequence.streetAlt')} loading="lazy" decoding="async" />
      </figure>

      <section className={styles.closing} aria-label={t('case.iruasSequence.closingLabel')}>
        <div className={`container ${styles.closingInner}`}>
          {iruasCaseAssets.screens.map((screen, index) => (
            <figure className={`${styles.closingPhone} ${phoneClasses[index]}`} key={screen.id}>
              <DeviceMockup src={screen.src} alt="" className={styles.mockup} />
            </figure>
          ))}
        </div>
      </section>
    </div>
  )
}
