import { env } from '@/config/env'
import { ApiError } from '@/types/api'
import type { Provider, ProviderKind } from '@/types/provider'
import { mockProviders } from '@/services/mocks/providers.mock'
import { mockDelay, request } from './client'

export interface ProviderFilters {
  search?: string
  kind?: ProviderKind
  /** Solo los que el equipo de ADAPTA revisó. */
  verifiedOnly?: boolean
}

/**
 * Orden del directorio: primero los destacados, luego los verificados, luego
 * el resto; dentro de cada grupo, por nombre.
 *
 * Es el efecto que la inscripción de pago compra. Se hace aquí solo mientras
 * el backend no exista: cuando responda, el orden llega del servidor, igual
 * que el score.
 */
const planRank: Record<Provider['plan'], number> = {
  featured: 0,
  verified: 1,
  free: 2,
}

function applyFilters(
  providers: Provider[],
  filters: ProviderFilters,
): Provider[] {
  const search = filters.search?.trim().toLowerCase()

  return providers
    .filter((provider) => {
      if (filters.kind && provider.kind !== filters.kind) return false
      if (filters.verifiedOnly && !provider.verified) return false
      if (search) {
        const haystack =
          `${provider.name} ${provider.description} ${provider.location}`.toLowerCase()
        if (!haystack.includes(search)) return false
      }
      return true
    })
    .sort(
      (a, b) =>
        planRank[a.plan] - planRank[b.plan] || a.name.localeCompare(b.name, 'es'),
    )
}

export function fetchProviders(
  filters: ProviderFilters = {},
  signal?: AbortSignal,
): Promise<Provider[]> {
  if (env.useMockApi) {
    return mockDelay(applyFilters(mockProviders, filters))
  }

  return request<Provider[]>('/providers', {
    query: {
      search: filters.search,
      kind: filters.kind,
      verified_only: filters.verifiedOnly ? 'true' : undefined,
    },
    signal,
  })
}

export function fetchProviderById(
  providerId: string,
  signal?: AbortSignal,
): Promise<Provider> {
  if (env.useMockApi) {
    const provider = mockProviders.find((item) => item.id === providerId)
    if (!provider) {
      return Promise.reject(new ApiError('Proveedor no encontrado.', 404))
    }
    return mockDelay(provider)
  }

  return request<Provider>(`/providers/${encodeURIComponent(providerId)}`, {
    signal,
  })
}

/** Solicitud de inscripción de un negocio (sección 13 ampliada). */
export interface ProviderApplication {
  businessName: string
  kind: ProviderKind
  location: string
  email: string
  description: string
}

export function submitProviderApplication(
  application: ProviderApplication,
  signal?: AbortSignal,
): Promise<{ received: true }> {
  if (env.useMockApi) {
    return mockDelay({ received: true as const })
  }

  return request<{ received: true }>('/providers/applications', {
    method: 'POST',
    body: application,
    signal,
  })
}
