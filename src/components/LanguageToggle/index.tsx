import { useTranslation } from 'react-i18next'
import { LANGUAGES, setLanguage, type Language } from '@/lib/i18n'
import styles from './LanguageToggle.module.scss'

const LABELS: Record<Language, { short: string; full: string }> = {
  'pt-BR': { short: 'PT', full: 'Português (Brasil)' },
  en: { short: 'EN', full: 'English' },
}

export function LanguageToggle({ className }: { className?: string }) {
  const { t, i18n } = useTranslation()
  return (
    <div role="group" aria-label={t('a11y.languageSwitch')} className={[styles.group, className].filter(Boolean).join(' ')}>
      {LANGUAGES.map((lang) => {
        const active = i18n.resolvedLanguage === lang
        return (
          <button
            key={lang}
            type="button"
            lang={lang}
            className={styles.option}
            aria-pressed={active}
            aria-label={LABELS[lang].full}
            onClick={() => setLanguage(lang)}
          >
            {LABELS[lang].short}
          </button>
        )
      })}
    </div>
  )
}
