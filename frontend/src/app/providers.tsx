import type { ReactNode } from 'react'
import { FitProfileProvider } from '@/store/fitProfileStore'
import { LanguageProvider } from '@/i18n/LanguageProvider'

/** Único sitio donde se apilan los proveedores globales. */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <LanguageProvider>
      <FitProfileProvider>{children}</FitProfileProvider>
    </LanguageProvider>
  )
}
