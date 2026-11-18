import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import styles from './PortraitFacts.module.scss'

// The counter and loop derive from this configurable list.
const facts = [
  { id: 'lucas', path: 'M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z' },
  { id: 'guitar', path: 'M9 18V5l12-2v13M9 8l12-2M9 18c0 1.7-1.8 3-4 3s-3-1-3-2.5S3.8 16 6 16c1.1 0 2.2.4 3 1M21 16c0 1.7-1.8 3-4 3s-3-1-3-2.5 1.8-2.5 4-2.5c1.1 0 2.2.4 3 1' },
  { id: 'roots', path: 'M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0ZM15 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z' },
  { id: 'coffee', path: 'M3 8h14v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8ZM17 9h2a3 3 0 1 1 0 6h-2M6 2v3M10 2v3M14 2v3M2 23h17' },
] as const

export function PortraitFacts() {
  const { t } = useTranslation()
  const reduced = useReducedMotion()
  const [index, setIndex] = useState(0)
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)

  useEffect(() => {
    if (reduced || hovered || focused || facts.length < 2) return
    const timer = window.setTimeout(() => setIndex((current) => (current + 1) % facts.length), 4000)
    return () => window.clearTimeout(timer)
  }, [index, reduced, hovered, focused])

  return (
    <div className={styles.facts} tabIndex={0} role="group"
      onPointerEnter={(event) => { if (event.pointerType === 'mouse') setHovered(true) }}
      onPointerLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false) }}>
      <div className={styles.slides} aria-live="off">
        {facts.map((fact, position) => (
          <motion.div key={fact.id} className={styles.slide} aria-hidden={position !== index}
            initial={false} animate={{ opacity: position === index ? 1 : 0 }}
            transition={{ duration: reduced ? 0 : 0.4, ease: 'easeInOut' }}>
            <span className={styles.icon} aria-hidden="true">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d={fact.path} /></svg>
            </span>
            <div>
              <p className={styles.counter}>{t('aboutPage.facts.counter', { current: position + 1, total: facts.length })}</p>
              <p className={styles.phrase}>{t(`aboutPage.facts.${fact.id}`)}</p>
            </div>
          </motion.div>
        ))}
      </div>

    </div>
  )
}
