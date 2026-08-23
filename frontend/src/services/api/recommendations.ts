import { env } from '@/config/env'
import type { FitProfile } from '@/types/fit-profile'
import type { RecommendationsResponse } from '@/types/recommendation'
import { buildMockRecommendations } from '@/services/mocks/recommendations.mock'
import { mockDelay, request } from './client'

/**
 * Pide las recomendaciones al backend. El score viene calculado desde el
 * servidor: aquí no se ordena ni se ajusta nada (sección 9).
 */
export function fetchRecommendations(
  profile: FitProfile,
  signal?: AbortSignal,
): Promise<RecommendationsResponse> {
  if (env.useMockApi) {
    return mockDelay({
      recommendations: buildMockRecommendations(profile),
      generatedAt: new Date().toISOString(),
    })
  }

  return request<RecommendationsResponse>('/recommendations', {
    method: 'POST',
    body: { profile },
    signal,
  })
}
