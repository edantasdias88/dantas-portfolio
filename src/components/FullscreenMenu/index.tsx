import { AnimatePresence, motion, useIsPresent, useReducedMotion } from 'motion/react'
import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { mainNav } from '@/data/navigation'
import { useContact } from '@/lib/contact'
import { useFocusTrap, useScrollLock } from '@/lib/hooks'
import { Button } from '../Button'
import { ArrowUpRight, Close } from '../Icons'
import { LanguageToggle } from '../LanguageToggle'
import { ThemeToggle } from '../ThemeToggle'
import logo from '@/assets/images/logo-wordmark.webp'
import styles from './FullscreenMenu.module.scss'

interface Props {
  open: boolean
  onClose: () => void
  returnFocusTo: HTMLElement | null
}

export function FullscreenMenu({ open, onClose, returnFocusTo }: Props) {
  return createPortal(
    <AnimatePresence>{open && <Panel onClose={onClose} returnFocusTo={returnFocusTo} />}</AnimatePresence>,
    document.body,
  )
}

function Panel({ onClose, returnFocusTo }: Omit<Props, 'open'>) {
  const { t } = useTranslation()
  const { openContact } = useContact()
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  // Libera scroll, foco e `inert` assim que fecha, sem esperar a animação de saída.
  const present = useIsPresent()
  useScrollLock(present)
  useFocusTrap(ref, present, onClose, returnFocusTo)

  // Voltar/avançar no histórico também fecha o menu.
  useEffect(() => {
    window.addEventListener('popstate', onClose)
    return () => window.removeEventListener('popstate', onClose)
  }, [onClose])

  const ease = [0.22, 1, 0.36, 1] as const

  return (
    // A opacidade é animada nas camadas filhas: animar o pai anularia o backdrop-filter do vidro.
    <div ref={ref} className={styles.overlay} role="dialog" aria-modal="true" aria-label={t('a11y.mainNav')}>
      <motion.div
        className={styles.glass}
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: reduce ? 0 : 0.35, ease }}
      />
      <motion.div
        className={styles.scroller}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: reduce ? 0 : 0.3, ease }}
      >
        <div className={`container ${styles.top}`}>
          <img className={styles.brand} src={logo} width={192} height={24} alt="" />
          <div className={styles.topActions}>
            <ThemeToggle />
            <button type="button" className={styles.close} onClick={onClose} aria-label={t('a11y.closeMenu')} data-autofocus>
              <span className={styles.closeLabel} aria-hidden="true">
                {t('nav.close')}
              </span>
              <span className={styles.closeIcon}>
                <Close size={20} />
              </span>
            </button>
          </div>
        </div>

        <nav className={`container ${styles.nav}`} aria-label={t('a11y.mainNav')}>
          <ol className={styles.list}>
            {mainNav.map((item, index) => (
              <motion.li
                key={item.key}
                initial={{ opacity: 0, y: reduce ? 0 : 28 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: reduce ? 0 : 12, transition: { duration: 0.15 } }}
                transition={{ duration: reduce ? 0 : 0.5, delay: reduce ? 0 : 0.06 + index * 0.045, ease }}
              >
                <Link to={item.to} className={styles.link} onClick={onClose}>
                  <span className={styles.index} aria-hidden="true">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className={styles.linkLabel}>{t(`nav.${item.key}`)}</span>
                  <ArrowUpRight className={styles.linkArrow} size={28} />
                </Link>
              </motion.li>
            ))}
          </ol>
        </nav>

        <motion.div
          className={`container ${styles.bottom}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: reduce ? 0 : 0.4, delay: reduce ? 0 : 0.35 }}
        >
          <div className={styles.setting}>
            <span className={styles.settingLabel}>{t('nav.language')}</span>
            <LanguageToggle />
          </div>
          <Button
            arrow
            onClick={(event) => {
              const trigger = returnFocusTo
              onClose()
              openContact(trigger ?? event.currentTarget)
            }}
          >
            {t('common.cta')}
          </Button>
        </motion.div>
      </motion.div>
    </div>
  )
}
