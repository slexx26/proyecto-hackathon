import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { emptyFitProfile, type FitProfile } from '@/types/fit-profile'
import { FitProfileContext } from './fitProfileContext'

/**
 * Guarda el perfil funcional entre Find My Fit y Recommendations.
 *
 * Se usa `sessionStorage`, no `localStorage`: el perfil desaparece al cerrar
 * la pestaña. Aunque no guardamos datos personales identificables, sí son
 * datos sensibles de uso, y no hay motivo para conservarlos más tiempo del
 * que dura la sesión (sección 25).
 */

const STORAGE_KEY = 'adapta.fit-profile'

function readStoredProfile(): FitProfile | undefined {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return undefined
    const parsed: unknown = JSON.parse(raw)
    if (parsed !== null && typeof parsed === 'object' && 'needs' in parsed) {
      return { ...emptyFitProfile, ...(parsed as Partial<FitProfile>) }
    }
  } catch {
    // Almacenamiento bloqueado o JSON corrupto: seguimos sin perfil.
  }
  return undefined
}

export function FitProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<FitProfile | undefined>(
    readStoredProfile,
  )

  const saveProfile = useCallback((next: FitProfile) => {
    setProfile(next)
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch {
      // Modo privado o almacenamiento lleno: el perfil sigue en memoria.
    }
  }, [])

  const clearProfile = useCallback(() => {
    setProfile(undefined)
    try {
      sessionStorage.removeItem(STORAGE_KEY)
    } catch {
      // Nada que hacer: el estado en memoria ya se limpió.
    }
  }, [])

  const value = useMemo(
    () => ({ profile, saveProfile, clearProfile }),
    [profile, saveProfile, clearProfile],
  )

  return (
    <FitProfileContext.Provider value={value}>
      {children}
    </FitProfileContext.Provider>
  )
}
