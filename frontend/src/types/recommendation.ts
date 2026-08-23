/**
 * Salida del motor determinista (sección 10) más la capa de explicación
 * de IA (sección 12).
 *
 * INVARIANTE: el frontend NUNCA calcula ni ajusta `score`. Solo lo pinta.
 */

import type { AdaptationNeed, Product } from './product'
import type { Provider } from './provider'

/** Cada razón es una pieza de evidencia del motor, no texto de la IA. */
export interface MatchReason {
  /** Necesidad del perfil que esta razón evalúa. */
  need: AdaptationNeed
  /** Si la prenda la cubre, la cubre a medias o no la cubre. */
  status: 'match' | 'partial' | 'gap'
  /** Aporte de esta razón al score, tal como lo envía el backend. */
  weight: number
  /** Frase corta y determinista generada por el motor. */
  label: string
}

/** Modificación propuesta para una prenda que no encaja del todo (sección 13). */
export interface AdaptationSuggestion {
  id: string
  title: string
  description: string
  /** Qué gana la persona con esta modificación. */
  benefit: string
  /** Qué sigue sin resolver. Se muestra siempre, no se esconde. */
  limitation: string
  /** Complejidad del arreglo, para fijar expectativas. */
  effort: 'low' | 'medium' | 'high'
}

export interface Recommendation {
  product: Product
  /**
   * Dónde conseguirlo. Va incrustado en la recomendación, no como una
   * segunda petición: el punto del producto es que la persona termine el
   * recorrido sabiendo a quién acudir.
   */
  provider: Provider
  /** 0–100, determinista y reproducible. Lo calcula el backend. */
  score: number
  reasons: MatchReason[]
  /**
   * Explicación en lenguaje natural. La genera OpenAI a partir de `reasons`,
   * sin poder cambiar `score`. Puede faltar si la IA falló: la UI degrada
   * mostrando solo las razones deterministas.
   */
  explanation?: string
  adaptations: AdaptationSuggestion[]
}

export interface RecommendationsResponse {
  recommendations: Recommendation[]
  /** ISO 8601. */
  generatedAt: string
}

/** Tramos del score. Los usa ScoreBadge para color y etiqueta. */
export type ScoreTier = 'high' | 'mid' | 'low'

export function scoreTier(score: number): ScoreTier {
  if (score >= 75) return 'high'
  if (score >= 45) return 'mid'
  return 'low'
}
