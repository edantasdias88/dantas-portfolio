import { useCallback, useState } from 'react'
import { useMotionValueEvent, useScroll } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import logo from '@/assets/images/logo-wordmark.webp'
import { useTheme } from '@/lib/theme'
import { FullscreenMenu } from '../FullscreenMenu'
import { Moon, Sun } from '../Icons'
import styles from './Header.module.scss'

export function Header() {
  const { t } = useTranslation()
  const { theme, toggleTheme } = useTheme()
  const [menuOpen, setMenuOpen] = useState(false)
  const [trigger, setTrigger] = useState<HTMLButtonElement | null>(null)
  const [isCompact, setIsCompact] = useState(
    () => typeof window !== 'undefined' && window.scrollY > 48,
  )
  const { scrollY } = useScroll()
  const close = useCallback(() => setMenuOpen(false), [])
  const isDark = theme === 'dark'

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setIsCompact((compact) => {
      if (compact) return latest > 16
      return latest > 48
    })
  })

  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner} ${isCompact ? styles.compact : ''}`}>
        <Link to="/" className={styles.brand} aria-label={t('a11y.home')}>
          <img
            className={styles.logo}
            data-brand-logo
            src={logo}
            width={229}
            height={29}
            alt=""
          />
        </Link>

        {/* Figma: "Navigation" — pílula de vidro com tema | menu */}
        <div className={styles.nav}>
          <button
            type="button"
            className={styles.navButton}
            data-theme-control="true"
            onClick={toggleTheme}
            aria-label={isDark ? t('a11y.themeToLight') : t('a11y.themeToDark')}
          >
            {isDark ? <Sun key="sun" size={24} /> : <Moon key="moon" size={22} />}
          </button>
          <span className={styles.divider} aria-hidden="true" />
          <button
            type="button"
            className={styles.navButton}
            aria-label={t('a11y.openMenu')}
            aria-expanded={menuOpen}
            aria-haspopup="dialog"
            onClick={(e) => {
              setTrigger(e.currentTarget)
              setMenuOpen(true)
            }}
          >
            <span className={styles.menuIcon} aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
          </button>
        </div>
      </div>
      <FullscreenMenu open={menuOpen} onClose={close} returnFocusTo={trigger} />
    </header>
  )
}
