import { useEffect, useState } from 'react'
import { ApiError } from '@/types/api'

export type AsyncStatus = 'idle' | 'loading' | 'success' | 'error'

export interface AsyncState<T> {
  status: AsyncStatus
  data: T | undefined
  error: string | undefined
}

/**
 * Ejecuta una promesa y expone los cuatro estados que toda pantalla con
 * datos debe cubrir (sección 24).
 *
 * OJO con la firma: el segundo argumento es una CLAVE de petición (string),
 * no un array de dependencias. Cambiar la clave relanza la petición. Se hace
 * así para que el llamador decida explícitamente qué identifica a la
 * petición, en vez de depender de la identidad de referencia de un objeto.
 *
 *   useAsync(() => fetchProducts(filters), filtersKey)
 *   useAsync(() => fetchProductById(id), id ?? 'sin-producto')
 */
export function useAsync<T>(
  run: (signal: AbortSignal) => Promise<T>,
  requestKey: string,
  enabled = true,
): AsyncState<T> {
  const [state, setState] = useState<AsyncState<T>>({
    status: enabled ? 'loading' : 'idle',
    data: undefined,
    error: undefined,
  })

  useEffect(() => {
    if (!enabled) {
      setState({ status: 'idle', data: undefined, error: undefined })
      return
    }

    const controller = new AbortController()
    let active = true

    setState({ status: 'loading', data: undefined, error: undefined })

    run(controller.signal).then(
      (data) => {
        if (!active) return
        setState({ status: 'success', data, error: undefined })
      },
      (cause: unknown) => {
        if (!active) return
        if (cause instanceof DOMException && cause.name === 'AbortError') return
        setState({
          status: 'error',
          data: undefined,
          error:
            cause instanceof ApiError
              ? cause.userMessage
              : 'Algo salió mal. Inténtalo de nuevo.',
        })
      },
    )

    return () => {
      active = false
      controller.abort()
    }
    // `run` se redefine en cada render por diseño; la clave es quien manda.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestKey, enabled])

  return state
}
