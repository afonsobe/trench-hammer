import enCommon from './locales/en/common.json'
import ptBRCommon from './locales/pt-BR/common.json'

/**
 * Translation resources bundled with the app. Keep the English catalog as the
 * reference shape: every other locale must mirror its keys (see `i18n:check`).
 */
export const resources = {
  en: { common: enCommon },
  'pt-BR': { common: ptBRCommon },
} as const
