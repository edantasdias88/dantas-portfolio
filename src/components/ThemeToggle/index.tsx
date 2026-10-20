import { useTranslation } from 'react-i18next'
import { useTheme } from '@/lib/theme'
import { Moon, Sun } from '../Icons'
import styles from './ThemeToggle.module.scss'

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useTheme()
  const { t } = useTranslation()
  const isDark = theme === 'dark'
  return (
    <button
      type="button"
      className={[styles.toggle, className].filter(Boolean).join(' ')}
      onClick={toggleTheme}
      aria-label={isDark ? t('a11y.themeToLight') : t('a11y.themeToDark')}
    >
      <span className={styles.track} data-dark={isDark}>
        <span className={styles.thumb}>{isDark ? <Sun size={14} /> : <Moon size={14} />}</span>
      </span>
    </button>
  )
}
