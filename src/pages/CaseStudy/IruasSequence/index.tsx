import { useTranslation } from 'react-i18next'
import { iruasCaseAssets } from '@/data/iruasCaseAssets'
import styles from './IruasSequence.module.scss'

const phoneClasses = [styles.phone1, styles.phone2, styles.phone3, styles.phone4]

export function IruasSequence() {
  const { t } = useTranslation()

  return (
    <div className={styles.sequence} role="group" aria-label={t('case.iruasSequence.ariaLabel')}>
      <figure className={`${styles.fullBleed} ${styles.discovery}`}>
        <img src={iruasCaseAssets.heroCamera} alt={t('case.iruasSequence.heroAlt')} loading="lazy" decoding="async" />
        <figcaption className={styles.note}>{t('case.iruasSequence.provisional')}</figcaption>
      </figure>

      <section className={styles.screenSection} aria-label={t('case.iruasSequence.screensLabel')}>
        <div className={`container ${styles.screenGrid}`}>
          {iruasCaseAssets.screens.map((screen) => (
            <figure className={styles.screen} key={screen.id}>
              <img src={screen.src} alt={t(`case.iruasSequence.screens.${screen.id}.alt`)} loading="lazy" decoding="async" />
              <figcaption>{t(`case.iruasSequence.screens.${screen.id}.label`)}</figcaption>
            </figure>
          ))}
          <p className={styles.screenNote}>{t('case.iruasSequence.provisional')}</p>
        </div>
      </section>

      <section className={styles.pairSection} aria-label={t('case.iruasSequence.pairLabel')}>
        <figure className={styles.pairImage}>
          <img src={iruasCaseAssets.propertyArchitecture} alt={t('case.iruasSequence.propertyAlt')} loading="lazy" decoding="async" />
        </figure>
        <figure className={`${styles.pairImage} ${styles.devicePanel}`}>
          <img src={iruasCaseAssets.interfaceDetail} alt={t('case.iruasSequence.detailAlt')} loading="lazy" decoding="async" />
          <figcaption className={styles.note}>{t('case.iruasSequence.provisional')}</figcaption>
        </figure>
      </section>

      <figure className={`${styles.fullBleed} ${styles.passenger}`}>
        <img src={iruasCaseAssets.passengerRoute} alt={t('case.iruasSequence.passengerAlt')} loading="lazy" decoding="async" />
        <figcaption className={styles.note}>{t('case.iruasSequence.provisional')}</figcaption>
      </figure>

      <figure className={`${styles.fullBleed} ${styles.street}`}>
        <img src={iruasCaseAssets.residentialStreet} alt={t('case.iruasSequence.streetAlt')} loading="lazy" decoding="async" />
      </figure>

      <section className={styles.closing} aria-label={t('case.iruasSequence.closingLabel')}>
        <div className={`container ${styles.closingInner}`}>
          {iruasCaseAssets.screens.map((screen, index) => (
            <figure className={`${styles.closingPhone} ${phoneClasses[index]}`} key={screen.id}>
              <img src={screen.src} alt="" aria-hidden="true" loading="lazy" decoding="async" />
            </figure>
          ))}
        </div>
        <p className={styles.closingNote}>{t('case.iruasSequence.provisional')}</p>
      </section>
    </div>
  )
}
