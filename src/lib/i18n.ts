import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import ptBR from '../locales/pt-BR/translation.json'
import en from '../locales/en/translation.json'

export const LANGUAGES = ['pt-BR', 'en'] as const
export type Language = (typeof LANGUAGES)[number]
const STORAGE_KEY = 'ed-lang'

export const resources = {
  'pt-BR': { translation: ptBR },
  en: { translation: en },
} as const

function isLanguage(value: unknown): value is Language {
  return typeof value === 'string' && (LANGUAGES as readonly string[]).includes(value)
}

/** Preferência salva > idioma do navegador > pt-BR. O script inline do index.html já resolveu isso em <html lang>. */
function detectLanguage(): Language {
  const fromDocument = document.documentElement.lang
  if (isLanguage(fromDocument)) return fromDocument
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (isLanguage(saved)) return saved
  } catch {
    /* localStorage indisponível */
  }
  return /^en/i.test(navigator.language) ? 'en' : 'pt-BR'
}

export function setLanguage(lang: Language) {
  try {
    localStorage.setItem(STORAGE_KEY, lang)
  } catch {
    /* ignora */
  }
  void i18n.changeLanguage(lang)
}

void i18n.use(initReactI18next).init({
  resources,
  lng: detectLanguage(),
  fallbackLng: 'pt-BR',
  supportedLngs: LANGUAGES,
  interpolation: { escapeValue: false },
  returnNull: false,
})

i18n.on('languageChanged', (lng) => {
  document.documentElement.lang = lng
})

export default i18n
