import { AnimatePresence, motion, useIsPresent, useReducedMotion } from 'motion/react'
import { useCallback, useId, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import { ArrowUpRight, Chat, Close, Mail, WhatsApp } from '@/components/Icons'
import { CaseLinkContent } from '@/components/CaseLink'
import linkStyles from '@/components/CaseLink/CaseLink.module.scss'
import { useFocusTrap, useScrollLock } from '@/lib/hooks'
import { contactPageDetails } from '@/data/contactPage'
import styles from './ContactOptions.module.scss'

function ContactIcon({ footer, children }: { footer: boolean; children: ReactNode }) {
  return footer ? <span className={styles.contactIcon}>{children}</span> : children
}

function ContactLabel({ footer, children }: { footer: boolean; children: ReactNode }) {
  return footer ? <span className={styles.footerLabel}>{children}</span> : <CaseLinkContent>{children}</CaseLinkContent>
}

function PhoneIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M7 3H4a1 1 0 0 0-1 1c0 9.4 7.6 17 17 17a1 1 0 0 0 1-1v-3l-5-2-2 2a15 15 0 0 1-7-7l2-2-2-5Z" />
  </svg>
}

function PhoneSheet({ onClose, trigger, whatsapp }: { onClose: () => void; trigger: HTMLElement | null; whatsapp: string }) {
  const { t } = useTranslation()
  const reduced = useReducedMotion()
  const present = useIsPresent()
  const ref = useRef<HTMLDivElement>(null)
  const id = useId()
  useScrollLock(present)
  useFocusTrap(ref, present, onClose, trigger)

  return (
    <motion.div className={styles.sheetOverlay} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: reduced ? 0 : 0.28 }} onClick={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <motion.div ref={ref} className={styles.sheet} role="dialog" aria-modal="true" aria-labelledby={id} aria-describedby={`${id}-description`}
        initial={{ y: reduced ? 0 : '100%' }} animate={{ y: 0 }} exit={{ y: reduced ? 0 : '100%' }}
        transition={{ duration: reduced ? 0 : 0.28, ease: [0.22, 1, 0.36, 1] }}
        drag="y" dragConstraints={{ top: 0, bottom: 0 }} dragElastic={{ top: 0, bottom: 0.3 }}
        onDragEnd={(_, info) => { if (info.offset.y > 80 || info.velocity.y > 500) onClose() }}>
        <header>
          <h2 id={id}>{t('contactPage.direct.title')}</h2>
          <button type="button" className={styles.sheetClose} aria-label={t('nav.close')} onClick={onClose}><Close /></button>
        </header>
        <p id={`${id}-description`}>{t('contactPage.direct.description')}</p>
        <a className={styles.sheetOption} href={contactPageDetails.telephone} onClick={onClose}>
          <PhoneIcon /><span><strong>{t('contactPage.direct.call')}</strong><span>{t('contactPage.direct.callDescription')}</span></span><ArrowUpRight size={16} />
        </a>
        <a className={styles.sheetOption} href={whatsapp} target="_blank" rel="noopener noreferrer" onClick={onClose}>
          <WhatsApp size={18} /><span><strong>{t('contactPage.direct.whatsapp')}</strong><span>{t('contactPage.direct.whatsappDescription')}</span></span><ArrowUpRight size={16} />
          <span className="visually-hidden">{t('a11y.opensInNewTab')}</span>
        </a>
      </motion.div>
    </motion.div>
  )
}

export function ContactOptions({ footer = false }: { footer?: boolean }) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [trigger, setTrigger] = useState<HTMLElement | null>(null)
  const close = useCallback(() => setOpen(false), [])
  const whatsapp = contactPageDetails.whatsapp

  return (
    <>
      <ul className={`${styles.direct} ${footer ? styles.footer : ''}`}>
        {footer && <>
          <li><Link className={`${linkStyles.link} ${styles.directLink}`} to="/contato"><ContactIcon footer={footer}><Chat size={20} /></ContactIcon><ContactLabel footer={footer}>{t('footer.sendMessage')}</ContactLabel></Link></li>
          <li><a className={`${linkStyles.link} ${styles.directLink}`} href={`mailto:${contactPageDetails.email}`}><ContactIcon footer={footer}><Mail size={20} /></ContactIcon><ContactLabel footer={footer}>{t('footer.sendEmail')}</ContactLabel></a></li>
        </>}
        <li>
          <a className={`${linkStyles.link} ${styles.directLink}`} href={whatsapp} target="_blank" rel="noopener noreferrer" onClick={(event) => {
            // Match the existing lg breakpoint, including landscape tablets.
            if (window.matchMedia('(max-width: 1023.98px)').matches) {
              event.preventDefault()
              setTrigger(event.currentTarget)
              setOpen(true)
            }
          }}>
            <ContactIcon footer={footer}><WhatsApp size={footer ? 16 : 18} /></ContactIcon><ContactLabel footer={footer}>{contactPageDetails.phoneLabel}</ContactLabel>
            <span className="visually-hidden">{t('a11y.opensInNewTab')}</span>
          </a>
        </li>
        {!footer && <li><a className={`${linkStyles.link} ${styles.directLink}`} href={`mailto:${contactPageDetails.email}`}><Mail size={18} /><CaseLinkContent>{contactPageDetails.email}</CaseLinkContent></a></li>}
      </ul>
      {createPortal(<AnimatePresence>{open && <PhoneSheet onClose={close} trigger={trigger} whatsapp={whatsapp} />}</AnimatePresence>, document.body)}
    </>
  )
}
