import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { useReducedMotion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { subscribeToHeroReady } from '@/lib/initialLoad'
import logo from '@/assets/images/logo-wordmark.webp'
import styles from './InitialLoader.module.scss'

const PROGRESS_DURATION = 3000
const EXIT_DURATION = 240
const MAX_WAIT_DURATION = 8000

export function InitialLoader() {
  const { t } = useTranslation()
  const reduceMotion = useReducedMotion()
  const shouldReduceMotion = reduceMotion === true
  const [progress, setProgress] = useState(0)
  const [leaving, setLeaving] = useState(false)
  const [visible, setVisible] = useState(true)
  const lastProgress = useRef(-1)

  useEffect(() => {
    let frame = 0
    let removeTimer = 0
    let fallbackTimer = 0
    let animationDone = false
    let contentReady = false
    let exitStarted = false

    const finish = () => {
      if (exitStarted) return
      exitStarted = true
      window.clearTimeout(fallbackTimer)
      setLeaving(true)
      removeTimer = window.setTimeout(() => setVisible(false), EXIT_DURATION)
    }

    const finishWhenReady = () => {
      if (animationDone && contentReady) finish()
    }

    const unsubscribe = subscribeToHeroReady(() => {
      contentReady = true
      finishWhenReady()
    })

    fallbackTimer = window.setTimeout(() => {
      setProgress(100)
      finish()
    }, MAX_WAIT_DURATION)

    if (shouldReduceMotion) {
      setProgress(100)
      animationDone = true
      finishWhenReady()
    } else {
      const startedAt = performance.now()
      const update = (now: number) => {
        const elapsed = Math.min((now - startedAt) / PROGRESS_DURATION, 1)
        const value = Math.round((1 - (1 - elapsed) ** 2.7) * 100)

        if (value !== lastProgress.current) {
          lastProgress.current = value
          setProgress(value)
        }

        if (elapsed < 1) frame = window.requestAnimationFrame(update)
        else {
          animationDone = true
          finishWhenReady()
        }
      }

      frame = window.requestAnimationFrame(update)
    }

    return () => {
      window.cancelAnimationFrame(frame)
      window.clearTimeout(removeTimer)
      window.clearTimeout(fallbackTimer)
      unsubscribe()
    }
  }, [shouldReduceMotion])

  if (!visible) return null

  return (
    <div
      className={styles.loader}
      data-leaving={leaving}
      role="status"
      aria-live="polite"
      style={{ '--loader-progress': `${progress}%` } as CSSProperties}
    >
      <span className="visually-hidden">{t('a11y.loadingPortfolio')}</span>
      <div className={styles.composition} aria-hidden="true">
        <span className={styles.percentage}>{progress}%</span>
        <div className={styles.logo}>
          <img
            className={styles.logoGhost}
            src={logo}
            width={640}
            height={80}
            alt=""
            draggable={false}
            decoding="async"
          />
          <img
            className={styles.logoFill}
            src={logo}
            width={640}
            height={80}
            alt=""
            draggable={false}
            decoding="async"
          />
        </div>
        <div className={styles.track}>
          <span className={styles.fill} />
        </div>
      </div>
    </div>
  )
}
