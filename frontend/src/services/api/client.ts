import { env } from '@/config/env'
import { ApiError } from '@/types/api'

/**
 * Cliente HTTP. Es el único sitio de la app donde se llama a `fetch`.
 */

/**
 * PENDIENTE DE CERRAR CON JOSÉ (sección 19).
 * Aceptamos tanto `{ data: T }` como `T` plano para no bloquearnos mientras
 * el backend fija el formato. Cuando se decida, este es el ÚNICO punto a
 * tocar en todo el frontend.
 */
function unwrap<T>(payload: unknown): T {
  if (
    payload !== null &&
    typeof payload === 'object' &&
    'data' in payload &&
    Object.keys(payload).length <= 2
  ) {
    return (payload as { data: T }).data
  }
  return payload as T
}

interface RequestOptions {
  method?: 'GET' | 'POST'
  body?: unknown
  query?: Record<string, string | undefined>
  signal?: AbortSignal
}

function buildUrl(path: string, query?: RequestOptions['query']): string {
  const url = new URL(`${env.apiBaseUrl}${path}`)
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== '') url.searchParams.set(key, value)
    }
  }
  return url.toString()
}

/** Intenta sacar un mensaje útil del cuerpo de error de FastAPI. */
async function readErrorDetail(response: Response): Promise<string | undefined> {
  try {
    const body: unknown = await response.json()
    if (body !== null && typeof body === 'object' && 'detail' in body) {
      const detail = (body as { detail: unknown }).detail
      if (typeof detail === 'string') return detail
    }
  } catch {
    // Cuerpo no-JSON o vacío: seguimos con el mensaje genérico.
  }
  return undefined
}

export async function request<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { method = 'GET', body, query, signal } = options

  let response: Response
  try {
    response = await fetch(buildUrl(path, query), {
      method,
      signal,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    })
  } catch (cause) {
    // Sin red, DNS caído o CORS: status 0 para distinguirlo de un 5xx.
    if (cause instanceof DOMException && cause.name === 'AbortError') throw cause
    throw new ApiError('No se pudo contactar con el servidor.', 0)
  }

  if (!response.ok) {
    const detail = await readErrorDetail(response)
    throw new ApiError(
      detail ?? `La petición falló (${response.status}).`,
      response.status,
      detail,
    )
  }

  if (response.status === 204) return undefined as T

  return unwrap<T>(await response.json())
}

/** Latencia simulada, para que los mocks ejerciten los estados de carga. */
export function mockDelay<T>(value: T): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(value), env.mockLatencyMs)
  })
}
