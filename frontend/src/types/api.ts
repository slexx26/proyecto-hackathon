/** Tipos transversales de la capa HTTP. */

export interface HealthStatus {
  status: string
  version?: string
}

/**
 * Error normalizado. Toda la app muestra errores a través de este tipo:
 * ningún componente ve un `Response` ni un `fetch` crudo (sección 24).
 */
export class ApiError extends Error {
  readonly status: number
  readonly detail?: string

  constructor(message: string, status: number, detail?: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.detail = detail
  }

  /** Mensaje apto para mostrar a la persona usuaria, sin jerga técnica. */
  get userMessage(): string {
    if (this.status === 404) return 'No encontramos lo que buscabas.'
    if (this.status === 0)
      return 'No pudimos conectar con el servidor. Revisa tu conexión.'
    if (this.status >= 500)
      return 'El servidor tuvo un problema. Inténtalo de nuevo en un momento.'
    return this.message
  }
}

/** Análisis de imagen, sección 16 (P2). Tipado, aún sin pantalla que lo use. */
export interface ImageAnalysisResult {
  detectedClosures: string[]
  detectedFeatures: string[]
  /** Aviso obligatorio: el análisis mira la PRENDA, nunca a la persona. */
  disclaimer: string
}
