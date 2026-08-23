/**
 * Perfil funcional que recoge Find My Fit (sección 8).
 *
 * Regla de producto: describe CÓMO la persona se viste y qué barreras
 * encuentra, nunca un diagnóstico. No se pide condición médica, ni edad,
 * ni medidas corporales. Sección 16 y 23.
 */

import type { AdaptationNeed, ProductCategory } from './product'

/** Cuánta ayuda necesita la persona para vestirse hoy. */
export type DressingAssistance = 'independent' | 'partial-help' | 'full-help'

/** Destreza de manos, que determina qué cierres son viables. */
export type HandDexterity = 'both-hands' | 'one-hand' | 'limited-grip'

/** Postura habitual al vestirse: cambia el patrón de la prenda. */
export type DressingPosture = 'standing' | 'seated' | 'lying-down'

/** Sensibilidad a costuras, etiquetas y texturas. */
export type SensorySensitivity = 'none' | 'mild' | 'high'

export interface FitProfile {
  /** Barreras concretas marcadas en el formulario. Es el campo que más pesa. */
  needs: AdaptationNeed[]
  dressingAssistance: DressingAssistance
  handDexterity: HandDexterity
  dressingPosture: DressingPosture
  sensorySensitivity: SensorySensitivity
  /** Categorías que la persona quiere ver primero. Vacío = todas. */
  preferredCategories: ProductCategory[]
  /** Campo libre y opcional. La IA lo interpreta; no puntúa (sección 11). */
  notes?: string
}

/** Valor inicial del formulario: todo neutro, nada preseleccionado. */
export const emptyFitProfile: FitProfile = {
  needs: [],
  dressingAssistance: 'independent',
  handDexterity: 'both-hands',
  dressingPosture: 'standing',
  sensorySensitivity: 'none',
  preferredCategories: [],
}

/** Errores por campo que muestra el formulario. */
export type FitProfileErrors = Partial<Record<keyof FitProfile, string>>
