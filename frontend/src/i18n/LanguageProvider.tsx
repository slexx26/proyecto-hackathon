import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { dictionaries, type TranslationKey } from './dictionaries'
import {
  LanguageContext,
  type Language,
  type PluralKey,
  type TranslationVars,
} from './languageContext'

const STORAGE_KEY = 'adapta.language'

function readStoredLanguage(): Language {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw === 'es' || raw === 'en') return raw
  } catch {
    // Almacenamiento bloqueado: se usa el idioma por defecto.
  }
  // Español por defecto: el producto nace en Costa Rica y el catálogo de
  // demostración está en español. El inglés es la traducción, no al revés.
  return 'es'
}

function interpolate(template: string, vars?: TranslationVars): string {
  if (!vars) return template
  return template.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in vars ? String(vars[name]) : match,
  )
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setStored] = useState<Language>(readStoredLanguage)

  /**
   * `lang` en el `<html>` no es cosmético: es lo que hace que un lector de
   * pantalla cambie de voz y de reglas de pronunciación. Sin esto, VoiceOver
   * lee el inglés con fonética española y se vuelve incomprensible.
   */
  useEffect(() => {
    document.documentElement.lang = language
  }, [language])

  const setLanguage = useCallback((next: Language) => {
    setStored(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // Modo privado: el idioma vive en memoria hasta cerrar la pestaña.
    }
  }, [])

  const value = useMemo(() => {
    const dictionary = dictionaries[language]

    const t = (key: TranslationKey, vars?: TranslationVars) =>
      interpolate(dictionary[key], vars)

    const plural = (count: number, base: PluralKey, vars?: TranslationVars) =>
      t(count === 1 ? `${base}.one` : `${base}.other`, { count, ...vars })

    return { language, setLanguage, t, plural }
  }, [language, setLanguage])

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}
