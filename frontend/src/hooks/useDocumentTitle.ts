import { useEffect } from 'react'

/**
 * Fija el título de la pestaña. Importa para accesibilidad: en una SPA el
 * lector de pantalla anuncia el título al cambiar de ruta (sección 23).
 */
export function useDocumentTitle(title: string): void {
  useEffect(() => {
    document.title = `${title} · ADAPTA`
  }, [title])
}
