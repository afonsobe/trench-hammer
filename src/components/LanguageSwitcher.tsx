import { useTranslation } from 'react-i18next'
import { SUPPORTED_LANGUAGES, type LanguageCode } from '../i18n'
import './LanguageSwitcher.css'

type LanguageSwitcherProps = {
  className?: string
}

/**
 * Segmented EN | PT control. The choice is persisted by the i18n instance
 * (`languageChanged` handler), so it survives reloads.
 */
export function LanguageSwitcher({ className = '' }: LanguageSwitcherProps) {
  const { t, i18n } = useTranslation()
  const current = i18n.language

  return (
    <div
      className={`lang-switcher ${className}`.trim()}
      role="group"
      aria-label={t('language.label')}
    >
      {SUPPORTED_LANGUAGES.map((language) => {
        const isActive = current === language.code
        return (
          <button
            key={language.code}
            type="button"
            className={`lang-switcher-btn ${isActive ? 'active' : ''}`.trim()}
            aria-pressed={isActive}
            title={language.label}
            onClick={() => {
              if (!isActive) void i18n.changeLanguage(language.code as LanguageCode)
            }}
          >
            {language.short}
          </button>
        )
      })}
    </div>
  )
}
