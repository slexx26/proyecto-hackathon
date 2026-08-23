/**
 * ÚNICO lector de `import.meta.env` en toda la app.
 *
 * Recordatorio de seguridad (sección 25): todo lo que empieza por `VITE_`
 * termina en el bundle público. Aquí no entra ninguna clave: ni OpenAI, ni
 * Supabase. El navegador solo habla con FastAPI.
 */

function readString(value: unknown, fallback: string): string {
  return typeof value === 'string' && value.length > 0 ? value : fallback
}

function readBoolean(value: unknown, fallback: boolean): boolean {
  if (value === 'true') return true
  if (value === 'false') return false
  return fallback
}

export const env = {
  apiBaseUrl: readString(
    import.meta.env.VITE_API_BASE_URL,
    'http://localhost:8000/api/v1',
  ),
  /** Con `true` la app funciona completa sin backend, usando mocks. */
  useMockApi: readBoolean(import.meta.env.VITE_USE_MOCK_API, true),
  /** Latencia simulada de los mocks, para ver los estados de carga reales. */
  mockLatencyMs: 450,
} as const
