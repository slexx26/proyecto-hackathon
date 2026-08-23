import { env } from '@/config/env'
import { ApiError, type ImageAnalysisResult } from '@/types/api'
import { mockDelay } from './client'

/**
 * Sección 16 (P2). Analiza la foto de una PRENDA para detectar rasgos como
 * el tipo de cierre. Nunca analiza a la persona ni infiere discapacidad.
 *
 * Tipado y listo para conectarse; todavía ninguna pantalla lo usa, y debe
 * poder eliminarse sin romper el flujo principal.
 */

const MAX_BYTES = 5 * 1024 * 1024
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

export async function analyzeGarmentImage(
  file: File,
  signal?: AbortSignal,
): Promise<ImageAnalysisResult> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new ApiError('Solo se admiten imágenes JPG, PNG o WebP.', 400)
  }
  if (file.size > MAX_BYTES) {
    throw new ApiError('La imagen no puede superar los 5 MB.', 400)
  }

  if (env.useMockApi) {
    return mockDelay({
      detectedClosures: ['buttons'],
      detectedFeatures: ['botonadura frontal', 'puño abotonado'],
      disclaimer:
        'Este análisis mira únicamente la prenda de la foto. No evalúa a ninguna persona ni sustituye una valoración profesional.',
    })
  }

  const body = new FormData()
  body.append('file', file)

  // Multipart: no pasa por `request()`, que serializa a JSON.
  const response = await fetch(`${env.apiBaseUrl}/image-analysis`, {
    method: 'POST',
    body,
    signal,
  })

  if (!response.ok) {
    throw new ApiError('No se pudo analizar la imagen.', response.status)
  }

  return (await response.json()) as ImageAnalysisResult
}
