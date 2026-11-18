import { useTranslation } from 'react-i18next'
import { CaseActionButton } from '@/components/CaseLink'
import styles from './CaaAppSequence.module.scss'

interface CarouselNavigationProps {
  count: number
  active: number
  transitioning: boolean
  onNavigate: (index: number) => void
}

export function CarouselNavigation({ count, active, transitioning, onNavigate }: CarouselNavigationProps) {
  const { t } = useTranslation()
  if (count < 3) return null

  const navigate = (index: number) => {
    if (!transitioning) onNavigate(index)
  }

  return (
    <div className={styles.discoveryControls} role="group" aria-label={t('case.caaPresentation.experience.navigation')}>
      <CaseActionButton direction="previous"
        aria-label={t('case.caaPresentation.experience.previousScreen')}
        disabled={active === 0} aria-disabled={active === 0}
        onClick={() => navigate(active - 1)} />
      <div className={styles.carouselDots}>
        {Array.from({ length: count }, (_, index) => (
          <button key={index} type="button"
            aria-label={t('case.caaPresentation.experience.goToImage', { number: index + 1 })}
            aria-current={index === active ? 'true' : undefined}
            onClick={() => navigate(index)} />
        ))}
      </div>
      <CaseActionButton direction="next"
        aria-label={t('case.caaPresentation.experience.nextScreen')}
        disabled={active === count - 1} aria-disabled={active === count - 1}
        onClick={() => navigate(active + 1)} />
    </div>
  )
}
