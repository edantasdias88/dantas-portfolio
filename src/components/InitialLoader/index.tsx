import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { useReducedMotion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { subscribeToInitialContentReady } from '@/lib/initialLoad'
import logo from '@/assets/images/logo-wordmark.webp'
import styles from './InitialLoader.module.scss'

const PROGRESS_DURATION = 3000
const EXIT_DURATION = 800
const MAX_WAIT_DURATION = 8000
const EASING = 'cubic-bezier(0.22, 1, 0.36, 1)'

export function InitialLoader() {
  const { t } = useTranslation()
  const reduceMotion = useReducedMotion()
  const shouldReduceMotion = reduceMotion === true
  const [progress, setProgress] = useState(0)
  const [leaving, setLeaving] = useState(false)
  const [visible, setVisible] = useState(true)
  const lastProgress = useRef(-1)
  const logoFill = useRef<HTMLImageElement>(null)

  useEffect(() => {
    let frame = 0
    let removeTimer = 0
    let fallbackTimer = 0
    let animationDone = false
    let contentReady = false
    let exitStarted = false
    let logoAnimation: Animation | null = null

    const completeExit = () => {
      window.clearTimeout(removeTimer)
      document.documentElement.removeAttribute('data-initial-transition')
      setVisible(false)
    }

    const finish = () => {
      if (exitStarted) return
      exitStarted = true
      window.clearTimeout(fallbackTimer)
      setLeaving(true)

      if (shouldReduceMotion) {
        removeTimer = window.setTimeout(completeExit, 80)
        return
      }

      const source = logoFill.current
      const target = document.querySelector<HTMLImageElement>('[data-brand-logo]')
      if (!source || !target || typeof source.animate !== 'function') {
        removeTimer = window.setTimeout(completeExit, EXIT_DURATION)
        return
      }

      const sourceRect = source.getBoundingClientRect()
      const targetRect = target.getBoundingClientRect()
      if (!sourceRect.width || !targetRect.width) {
        removeTimer = window.setTimeout(completeExit, EXIT_DURATION)
        return
      }
      const scale = targetRect.width / sourceRect.width
      const deltaX = targetRect.left - sourceRect.left
      const scaledHeight = sourceRect.height * scale
      const deltaY = targetRect.top + (targetRect.height - scaledHeight) / 2 - sourceRect.top

      // Keep the loading logo as the one visible element while it travels to the header.
      document.documentElement.setAttribute('data-initial-transition', '')
      Object.assign(source.style, {
        position: 'fixed',
        inset: 'auto',
        left: `${sourceRect.left}px`,
        top: `${sourceRect.top}px`,
        width: `${sourceRect.width}px`,
        height: `${sourceRect.height}px`,
        zIndex: '10001',
        clipPath: 'none',
        transformOrigin: 'top left',
        willChange: 'transform',
      })

      logoAnimation = source.animate(
        [
          { transform: 'translate3d(0, 0, 0) scale(1)' },
          { transform: `translate3d(${deltaX}px, ${deltaY}px, 0) scale(${scale})` },
        ],
        { duration: EXIT_DURATION, easing: EASING, fill: 'forwards' },
      )
      logoAnimation.onfinish = completeExit
      removeTimer = window.setTimeout(completeExit, EXIT_DURATION + 160)
    }

    const finishWhenReady = () => {
      if (animationDone && contentReady) finish()
    }

    fallbackTimer = window.setTimeout(() => {
      setProgress(100)
      finish()
    }, MAX_WAIT_DURATION)

    const unsubscribe = subscribeToInitialContentReady(() => {
      contentReady = true
      finishWhenReady()
    })

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
      logoAnimation?.cancel()
      document.documentElement.removeAttribute('data-initial-transition')
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
            ref={logoFill}
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
