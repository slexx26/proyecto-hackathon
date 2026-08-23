import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/** Al cambiar de ruta, vuelve arriba. Sin esto la navegación desorienta. */
export function useScrollToTop(): void {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [pathname])
}
