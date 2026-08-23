/**
 * Traducciones al español de los códigos que viajan por la API.
 *
 * La API habla en códigos estables (`one-handed-dressing`); la interfaz habla
 * en español. Este archivo es la única frontera entre ambos, para que un
 * cambio de redacción no obligue a tocar el contrato.
 */

import type {
  AdaptationNeed,
  ClosureType,
  ProductCategory,
} from '@/types/product'
import type {
  DressingAssistance,
  DressingPosture,
  HandDexterity,
  SensorySensitivity,
} from '@/types/fit-profile'
import type { ScoreTier } from '@/types/recommendation'

export const needLabels: Record<AdaptationNeed, string> = {
  'one-handed-dressing': 'Vestirse con una mano',
  'seated-wearing': 'Vestirse sentada o sentado',
  'magnetic-closure': 'Cierre magnético',
  'no-fine-motor': 'Sin pinza fina',
  'sensory-friendly': 'Amable con la sensibilidad',
  'easy-access-medical': 'Acceso para cuidados médicos',
  'prosthesis-friendly': 'Compatible con prótesis',
  'adjustable-fit': 'Ajuste regulable',
  thermoregulation: 'Regula la temperatura',
}

/** Texto de apoyo del formulario: explica la necesidad sin tecnicismos. */
export const needHints: Record<AdaptationNeed, string> = {
  'one-handed-dressing':
    'Necesito poder ponerme y quitarme la prenda usando una sola mano.',
  'seated-wearing':
    'Me visto sentada, sentado o acostado, sin levantar las caderas.',
  'magnetic-closure':
    'Prefiero imanes en lugar de botones o cierres pequeños.',
  'no-fine-motor':
    'Me cuesta agarrar cosas pequeñas o hacer fuerza con los dedos.',
  'sensory-friendly':
    'Las costuras, etiquetas o ciertas texturas me molestan mucho.',
  'easy-access-medical':
    'Uso sonda, catéter, puerto o similar y necesito acceso sin desvestirme.',
  'prosthesis-friendly': 'Uso prótesis u órtesis y la ropa debe acomodarlas.',
  'adjustable-fit':
    'Mi talla o volumen cambia durante el día y necesito poder ajustar.',
  thermoregulation: 'Me cuesta regular la temperatura del cuerpo.',
}

export const categoryLabels: Record<ProductCategory, string> = {
  tops: 'Parte de arriba',
  bottoms: 'Parte de abajo',
  outerwear: 'Abrigos',
  footwear: 'Calzado',
  underwear: 'Ropa interior',
  accessories: 'Accesorios',
}

export const closureLabels: Record<ClosureType, string> = {
  magnetic: 'Cierre magnético',
  velcro: 'Velcro',
  'zipper-loop': 'Cierre con argolla de tiro',
  zipper: 'Cierre convencional',
  buttons: 'Botones',
  elastic: 'Elástico',
  none: 'Sin cierre',
}

export const assistanceLabels: Record<DressingAssistance, string> = {
  independent: 'Me visto por mi cuenta',
  'partial-help': 'Necesito ayuda para algunas prendas',
  'full-help': 'Otra persona me ayuda a vestirme',
}

export const dexterityLabels: Record<HandDexterity, string> = {
  'both-hands': 'Uso las dos manos sin dificultad',
  'one-hand': 'Uso una sola mano',
  'limited-grip': 'Tengo poca fuerza o precisión en las manos',
}

export const postureLabels: Record<DressingPosture, string> = {
  standing: 'De pie',
  seated: 'Sentada o sentado',
  'lying-down': 'Acostada o acostado',
}

export const sensoryLabels: Record<SensorySensitivity, string> = {
  none: 'No me afecta',
  mild: 'Me molesta un poco',
  high: 'Me molesta mucho',
}

export const scoreTierLabels: Record<ScoreTier, string> = {
  high: 'Encaja muy bien',
  mid: 'Encaja en parte',
  low: 'Encaja poco',
}

export const effortLabels: Record<'low' | 'medium' | 'high', string> = {
  low: 'Arreglo sencillo',
  medium: 'Requiere taller',
  high: 'Modificación mayor',
}

/** Formatea un precio con la moneda que envía el backend. */
export function formatPrice(amount: number, currency: string): string {
  return new Intl.NumberFormat('es-CR', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount)
}
