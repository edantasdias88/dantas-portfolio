import { AnimatePresence, motion, useIsPresent, useReducedMotion } from 'motion/react'
import { useCallback, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '../Button'
import styles from './ContactForm.module.scss'

const ease = [0.22, 1, 0.36, 1] as const

function Panel({ children, onMeasure, onEntered, success }: {
  children: ReactNode
  onMeasure: (height: number) => void
  onEntered: (element: HTMLDivElement) => void
  success: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const present = useIsPresent()
  const reduced = useReducedMotion()
  useLayoutEffect(() => {
    const element = ref.current
    if (!element) return
    const measure = () => onMeasure(element.getBoundingClientRect().height)
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(element)
    return () => observer.disconnect()
  }, [onMeasure])

  return (
    <motion.div ref={ref} inert={!present} aria-hidden={!present || undefined}
      initial={{ opacity: reduced || success ? 1 : 0, y: reduced || success ? 0 : 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: reduced ? 0 : -12 }}
      transition={{ duration: reduced ? 0 : 0.3, ease }}
      onAnimationComplete={(definition) => {
        if (present && typeof definition === 'object' && !Array.isArray(definition) && definition.opacity === 1 && ref.current) onEntered(ref.current)
      }}>
      {children}
    </motion.div>
  )
}

export function SuccessTransition({ success, onReset, children }: {
  success: boolean
  onReset: () => void
  children: ReactNode
}) {
  const { t } = useTranslation()
  const reduced = useReducedMotion()
  const [height, setHeight] = useState<number | null>(null)
  const restoreFocus = useRef(false)
  const resetting = useRef(false)
  const measure = useCallback((next: number) => setHeight(next), [])
  const entered = useCallback((element: HTMLDivElement) => {
    if (restoreFocus.current) {
      element.querySelector<HTMLInputElement>('input[name="name"]')?.focus({ preventScroll: true })
      restoreFocus.current = false
      resetting.current = false
    }
  }, [])
  const reveal = (delay: number) => ({
    initial: { opacity: reduced ? 1 : 0, y: reduced ? 0 : 8 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduced ? 0 : 0.5, delay: reduced ? 0 : delay, ease },
  })

  return (
    <>
      <div className="visually-hidden" role="status" aria-live="polite" aria-atomic="true">
        {success ? `${t('contact.success.title')} ${t('contact.success.description')}` : ''}
      </div>
      <motion.div className={styles.transitionStage} initial={false}
        animate={{ height: height === null ? 'auto' : height + 12 }}
        transition={{ duration: reduced ? 0 : 0.45, ease }}>
        <AnimatePresence initial={false} mode="wait">
          {success ? (
            <Panel key="success" success onMeasure={measure} onEntered={(element) => {
              element.querySelector<HTMLElement>('[data-success-title]')?.focus({ preventScroll: true })
            }}>
              <div className={styles.confirmation}>
                <motion.span className={styles.successIcon} aria-hidden="true"
                  initial={{ opacity: reduced ? 1 : 0, scale: reduced ? 1 : 0.85 }}
                  animate={{ opacity: 1, scale: 1 }} transition={{ duration: reduced ? 0 : 0.5, ease }}>
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                    <motion.path d="m6 14 5 5L22 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                      initial={{ pathLength: reduced ? 1 : 0 }} animate={{ pathLength: 1 }}
                      transition={{ duration: reduced ? 0 : 0.45, delay: reduced ? 0 : 0.12, ease }} />
                  </svg>
                </motion.span>
                <motion.h2 tabIndex={-1} data-success-title className={styles.successTitle} {...reveal(0.1)}>{t('contact.success.title')}</motion.h2>
                <motion.p className={styles.successDescription} {...reveal(0.2)}>{t('contact.success.description')}</motion.p>
                <motion.div {...reveal(0.3)}>
                  <Button variant="secondary" onClick={() => {
                    if (resetting.current) return
                    resetting.current = true
                    restoreFocus.current = true
                    onReset()
                  }}>{t('contact.success.again')}</Button>
                </motion.div>
              </div>
            </Panel>
          ) : (
            <Panel key="form" success={false} onMeasure={measure} onEntered={entered}>{children}</Panel>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  )
}
