import { env } from '@/config/env'
import type { HealthStatus } from '@/types/api'
import { mockDelay, request } from './client'

export function fetchHealth(signal?: AbortSignal): Promise<HealthStatus> {
  if (env.useMockApi) {
    return mockDelay({ status: 'ok', version: 'mock' })
  }
  return request<HealthStatus>('/health', { signal })
}
