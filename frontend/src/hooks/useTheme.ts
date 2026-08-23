import { useCallback, useEffect, useState } from 'react'

/**
 * Preferencia de tema.
 *
 * `system` no es un tercer color: es respetar lo que la persona ya configuró
 * en su dispositivo, que es lo que debería pasar sin que nadie toque nada.
 * Solo cuando elige explícitamente se guarda una preferencia propia.
 *
 * El modo oscuro aquí no es decoración: fotofobia, migraña y varias
 * condiciones de baja visión hacen doloroso leer una pantalla blanca.
 */
export type ThemePreference = 'system' | 'light' | 'dark'

const STORAGE_KEY = 'adapta.theme'

function readPreference(): ThemePreference {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw === 'light' || raw === 'dark') return raw
  } catch {
    // Almacenamiento bloqueado: seguimos la preferencia del sistema.
  }
  return 'system'
}

function prefersDark(): boolean {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

export interface ThemeState {
  preference: ThemePreference
  /** Lo que se está viendo de verdad. Lo usa el icono del control. */
  resolved: 'light' | 'dark'
  setPreference: (next: ThemePreference) => void
}

export function useTheme(): ThemeState {
  const [preference, setStored] = useState<ThemePreference>(readPreference)
  const [systemDark, setSystemDark] = useState(prefersDark)

  // Si la persona cambia el tema del sistema con la pestaña abierta, el
  // icono tiene que enterarse.
  useEffect(() => {
    const query = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = (event: MediaQueryListEvent) => setSystemDark(event.matches)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    const root = document.documentElement
    if (preference === 'system') {
      delete root.dataset.theme
    } else {
      root.dataset.theme = preference
    }
  }, [preference])

  const setPreference = useCallback((next: ThemePreference) => {
    setStored(next)
    try {
      if (next === 'system') localStorage.removeItem(STORAGE_KEY)
      else localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // Modo privado: el tema vive en memoria hasta cerrar la pestaña.
    }
  }, [])

  return {
    preference,
    resolved: preference === 'system' ? (systemDark ? 'dark' : 'light') : preference,
    setPreference,
  }
}
