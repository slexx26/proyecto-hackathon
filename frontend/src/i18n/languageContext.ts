import { createContext, useContext } from 'react'
import type { TranslationKey } from './es'

/**
 * Idioma de la INTERFAZ.
 *
 * Ojo con el alcance, porque es la parte que se malinterpreta: esto traduce
 * los textos que escribimos nosotros. El contenido del catálogo —nombres,
 * descripciones, explicaciones de la IA— llega de la API y se muestra tal
 * como llega. Traducirlo en el navegador sería inventarse datos que el
 * backend no envió.
 *
 * Por eso los bloques que pintan texto de la API van marcados con `lang="es"`
 * aunque la interfaz esté en inglés: así el lector de pantalla los pronuncia
 * en español en vez de deletrear "Camisa Vera" con fonética inglesa.
 */
export type Language = 'es' | 'en'

/** Valores que se interpolan en un texto con `{nombre}`. */
export type TranslationVars = Record<string, string | number>

/**
 * Bases de plural: se derivan del diccionario, así que solo son válidas las
 * claves que tienen de verdad las dos formas `.one` y `.other`.
 */
type OneBases = {
  [K in TranslationKey]: K extends `${infer Base}.one` ? Base : never
}[TranslationKey]
type OtherBases = {
  [K in TranslationKey]: K extends `${infer Base}.other` ? Base : never
}[TranslationKey]
export type PluralKey = OneBases & OtherBases

export interface LanguageContextValue {
  language: Language
  setLanguage: (next: Language) => void
  /** Traduce una clave. `vars` rellena los huecos `{nombre}`. */
  t: (key: TranslationKey, vars?: TranslationVars) => string
  /**
   * Traduce eligiendo forma singular o plural, y pasa `count` como variable.
   * El español y el inglés comparten la misma regla (1 / resto), así que no
   * hace falta `Intl.PluralRules` todavía; si entra un idioma con más formas,
   * este es el único sitio a tocar.
   */
  plural: (count: number, base: PluralKey, vars?: TranslationVars) => string
}

export const LanguageContext = createContext<LanguageContextValue | undefined>(
  undefined,
)

export function useTranslation(): LanguageContextValue {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useTranslation debe usarse dentro de LanguageProvider.')
  }
  return context
}
