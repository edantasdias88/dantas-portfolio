import { AnimatePresence, motion, useIsPresent, useReducedMotion } from 'motion/react'
import { useId, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { useFocusTrap, useScrollLock } from '@/lib/hooks'
import { ContactDirect } from '../ContactDirect'
import { ContactForm } from '../ContactForm'
import { Close } from '../Icons'
import logo from '@/assets/images/logo-wordmark.webp'
import styles from './FullscreenContact.module.scss'

interface Props {
  open: boolean
  onClose: () => void
  returnFocusTo: HTMLElement | null
}

export function FullscreenContact({ open, onClose, returnFocusTo }: Props) {
  return createPortal(
    <AnimatePresence>{open && <Dialog onClose={onClose} returnFocusTo={returnFocusTo} />}</AnimatePresence>,
    document.body,
  )
}

function Dialog({ onClose, returnFocusTo }: Omit<Props, 'open'>) {
  const { t } = useTranslation()
  const ref = useRef<HTMLDivElement>(null)
  const titleId = useId()
  const reduce = useReducedMotion()
  // Libera scroll, foco e `inert` assim que fecha, sem esperar a animação de saída.
  const present = useIsPresent()
  useScrollLock(present)
  useFocusTrap(ref, present, onClose, returnFocusTo)

  return (
    <motion.div
      ref={ref}
      className={styles.dialog}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduce ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className={styles.scroller}>
        <div className={`container ${styles.top}`}>
          <img className={styles.brand} src={logo} width={192} height={24} alt="Edilson Dantas" />
          <button type="button" className={styles.close} onClick={onClose} aria-label={t('a11y.closeContact')}>
            <span className={styles.closeLabel} aria-hidden="true">{t('nav.close')}</span>
            <span className={styles.closeIcon}>
              <Close size={20} />
            </span>
          </button>
        </div>

        <motion.div
          className={`container ${styles.grid}`}
          initial={{ opacity: 0, y: reduce ? 0 : 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: reduce ? 0 : 12 }}
          transition={{ duration: reduce ? 0 : 0.45, delay: reduce ? 0 : 0.08, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className={styles.intro}>
            <p className="eyebrow">{t('contact.eyebrow')}</p>
            <h2 id={titleId} className={styles.title}>{t('contact.title')}</h2>
            <p className={styles.description}>{t('contact.description')}</p>
            <ContactDirect className={styles.direct} itemClassName={styles.directLink} />
          </div>
          <div className={styles.formWrap}>
            <ContactForm autoFocus />
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
