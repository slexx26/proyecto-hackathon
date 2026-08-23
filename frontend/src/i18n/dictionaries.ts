import { es, type TranslationKey } from './es'
import { en } from './en'
import type { Language } from './languageContext'

export type { TranslationKey }

/**
 * El español es la fuente: define qué claves existen. El inglés está tipado
 * como `Record<TranslationKey, string>`, así que olvidarse de traducir una
 * clave rompe la compilación en vez de aparecer en pantalla.
 */
export const dictionaries: Record<Language, Record<TranslationKey, string>> = {
  es,
  en,
}
