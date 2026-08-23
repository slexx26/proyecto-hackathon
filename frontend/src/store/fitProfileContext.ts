import { createContext, useContext } from 'react'
import type { FitProfile } from '@/types/fit-profile'

/**
 * Contexto y hook viven aparte del proveedor para que el archivo del
 * proveedor exporte solo componentes (requisito de Fast Refresh).
 */

export interface FitProfileContextValue {
  profile: FitProfile | undefined
  saveProfile: (profile: FitProfile) => void
  clearProfile: () => void
}

export const FitProfileContext = createContext<
  FitProfileContextValue | undefined
>(undefined)

export function useFitProfile(): FitProfileContextValue {
  const context = useContext(FitProfileContext)
  if (!context) {
    throw new Error('useFitProfile debe usarse dentro de FitProfileProvider.')
  }
  return context
}
