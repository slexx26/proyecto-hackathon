import type { ReactNode } from 'react'
import { FitProfileProvider } from '@/store/fitProfileStore'

/** Único sitio donde se apilan los proveedores globales. */
export function AppProviders({ children }: { children: ReactNode }) {
  return <FitProfileProvider>{children}</FitProfileProvider>
}
