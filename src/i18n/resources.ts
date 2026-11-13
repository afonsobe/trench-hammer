import enCommon from './locales/en/common.json'
import enMobile from './locales/en/mobile.json'
import ptBRCommon from './locales/pt-BR/common.json'
import ptBRMobile from './locales/pt-BR/mobile.json'

/**
 * Translation resources bundled with the app. Keep the English catalog as the
 * reference shape: every other locale must mirror its keys (see `i18n:check`).
 */
export const resources = {
  en: { common: enCommon, mobile: enMobile },
  'pt-BR': { common: ptBRCommon, mobile: ptBRMobile },
} as const
