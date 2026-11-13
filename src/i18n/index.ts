import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { resources } from './resources'

export const SUPPORTED_LANGUAGES = [
  { code: 'en', short: 'EN', label: 'English' },
  { code: 'pt-BR', short: 'PT', label: 'Português (Brasil)' },
] as const

export type LanguageCode = (typeof SUPPORTED_LANGUAGES)[number]['code']

/** Persisted user choice. Anything else falls back to browser detection. */
const STORAGE_KEY = 'th.lang'

function isSupported(code: string | null | undefined): code is LanguageCode {
  return SUPPORTED_LANGUAGES.some((lang) => lang.code === code)
}

function readStoredLanguage(): LanguageCode | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return isSupported(stored) ? stored : null
  } catch {
    return null
  }
}

function detectLanguage(): LanguageCode {
  const stored = readStoredLanguage()
  if (stored) return stored

  const candidates = navigator.languages?.length
    ? navigator.languages
    : [navigator.language]

  return candidates.some((lang) => lang?.toLowerCase().startsWith('pt')) ? 'pt-BR' : 'en'
}

function applyDocumentMetadata(language: string) {
  document.documentElement.lang = language
  document.title = i18n.t('meta.title')

  const description = document.querySelector('meta[name="description"]')
  if (description) description.setAttribute('content', i18n.t('meta.description'))
}

void i18n.use(initReactI18next).init({
  resources,
  lng: detectLanguage(),
  fallbackLng: 'en',
  supportedLngs: SUPPORTED_LANGUAGES.map((lang) => lang.code),
  defaultNS: 'common',
  ns: ['common'],
  interpolation: { escapeValue: false },
  returnNull: false,
  // Resources are bundled, so initialisation can be synchronous.
  initAsync: false,
})

i18n.on('languageChanged', (language) => {
  try {
    localStorage.setItem(STORAGE_KEY, language)
  } catch {
    // Storage can be unavailable (private mode); language still works for the session.
  }
  applyDocumentMetadata(language)
})

applyDocumentMetadata(i18n.language)

export default i18n
