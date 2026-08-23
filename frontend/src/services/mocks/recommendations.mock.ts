import type { FitProfile } from '@/types/fit-profile'
import type { AdaptationNeed, Product } from '@/types/product'
import type {
  AdaptationSuggestion,
  MatchReason,
  Recommendation,
} from '@/types/recommendation'
import { mockProducts } from './products.mock'

/**
 * SUPLENTE DEL BACKEND, no lógica de frontend.
 *
 * Este módulo hace de doble del motor determinista de Isaac (sección 10)
 * mientras el backend no responde. Vive en `services/mocks/` justamente para
 * que ningún componente pueda importarlo: cuando `VITE_USE_MOCK_API=false`,
 * esta función deja de ejecutarse y el score llega del servidor.
 *
 * Cuando el motor real esté listo, este archivo se borra entero. No debe
 * crecer con reglas que el backend no tenga.
 */

/** Etiquetas deterministas por necesidad. Espejo de las del motor. */
const needLabels: Record<AdaptationNeed, string> = {
  'one-handed-dressing': 'Se puede poner con una sola mano',
  'seated-wearing': 'Se puede poner estando sentada o sentado',
  'magnetic-closure': 'Cierre magnético en lugar de botones',
  'no-fine-motor': 'No exige pinza fina ni fuerza de agarre',
  'sensory-friendly': 'Sin costuras ni etiquetas que molesten',
  'easy-access-medical': 'Acceso para dispositivos o cuidados médicos',
  'prosthesis-friendly': 'Compatible con prótesis u órtesis',
  'adjustable-fit': 'Ajuste regulable',
  thermoregulation: 'Ayuda a regular la temperatura',
}

/** Peso por necesidad marcada. Todas pesan igual en este suplente. */
const NEED_WEIGHT = 18
/** Bonificaciones por coherencia entre perfil y prenda. */
const CLOSURE_BONUS = 14
const POSTURE_BONUS = 10
const SENSORY_BONUS = 10

function closureFitsDexterity(product: Product, profile: FitProfile): boolean {
  if (profile.handDexterity === 'both-hands') return true
  return ['magnetic', 'velcro', 'elastic', 'zipper-loop', 'none'].includes(
    product.closureType,
  )
}

function buildReasons(product: Product, profile: FitProfile): MatchReason[] {
  const reasons: MatchReason[] = profile.needs.map((need) => {
    const covered = product.adaptationNeeds.includes(need)
    return {
      need,
      status: covered ? 'match' : 'gap',
      weight: covered ? NEED_WEIGHT : 0,
      label: covered
        ? needLabels[need]
        : `No resuelve por sí sola: ${needLabels[need].toLowerCase()}`,
    }
  })

  if (!closureFitsDexterity(product, profile)) {
    reasons.push({
      need: 'no-fine-motor',
      status: 'gap',
      weight: 0,
      label: 'El tipo de cierre exige más destreza de la indicada en tu perfil',
    })
  }

  return reasons
}

function computeScore(product: Product, profile: FitProfile): number {
  let score = 20 // base: toda prenda del catálogo parte de algo

  for (const need of profile.needs) {
    if (product.adaptationNeeds.includes(need)) score += NEED_WEIGHT
  }

  if (closureFitsDexterity(product, profile)) score += CLOSURE_BONUS

  if (
    profile.dressingPosture !== 'standing' &&
    product.adaptationNeeds.includes('seated-wearing')
  ) {
    score += POSTURE_BONUS
  }

  if (
    profile.sensorySensitivity === 'high' &&
    product.adaptationNeeds.includes('sensory-friendly')
  ) {
    score += SENSORY_BONUS
  }

  if (
    profile.preferredCategories.length > 0 &&
    !profile.preferredCategories.includes(product.category)
  ) {
    score -= 12
  }

  return Math.max(0, Math.min(100, Math.round(score)))
}

/** Adaptaciones propuestas para las necesidades que quedaron sin cubrir. */
function buildAdaptations(reasons: MatchReason[]): AdaptationSuggestion[] {
  const gaps = reasons.filter((reason) => reason.status === 'gap')

  const catalog: Partial<Record<AdaptationNeed, AdaptationSuggestion>> = {
    'magnetic-closure': {
      id: 'adapt-magnetic',
      title: 'Sustituir la botonadura por cierre magnético',
      description:
        'Un taller de costura reemplaza los botones por imanes ocultos y deja los botones originales cosidos encima, solo como decoración.',
      benefit: 'La prenda se abrocha con una mano y sin pinza fina.',
      limitation:
        'Los imanes pueden interferir con marcapasos: hay que consultarlo antes.',
      effort: 'medium',
    },
    'no-fine-motor': {
      id: 'adapt-pull-loop',
      title: 'Añadir argolla de tiro al cierre',
      description:
        'Se cose una anilla de cinta rígida al deslizador del cierre para poder tirar con el dedo o con un gancho.',
      benefit: 'Elimina la necesidad de pinzar el deslizador.',
      limitation: 'No cambia la fuerza necesaria para subir el cierre.',
      effort: 'low',
    },
    'seated-wearing': {
      id: 'adapt-side-opening',
      title: 'Abrir costura lateral con velcro',
      description:
        'Se abre la costura lateral y se cierra con banda ancha de velcro, de la cadera al dobladillo.',
      benefit: 'Permite vestirse sin levantar las caderas.',
      limitation:
        'Cambia la caída de la prenda y no se puede revertir sin dejar marca.',
      effort: 'high',
    },
    'sensory-friendly': {
      id: 'adapt-seams',
      title: 'Quitar etiquetas y forrar costuras',
      description:
        'Se retiran las etiquetas cosidas y se cubren las costuras internas con cinta de algodón plana.',
      benefit: 'Reduce el roce en la piel en los puntos más comunes.',
      limitation: 'No elimina las costuras estructurales de las sisas.',
      effort: 'low',
    },
    'easy-access-medical': {
      id: 'adapt-access-flap',
      title: 'Añadir solapa de acceso',
      description:
        'Se abre una ventana discreta con solapa superpuesta en la zona que se necesite.',
      benefit: 'Da acceso sin desvestirse por completo.',
      limitation: 'La solapa se marca bajo tejidos muy finos.',
      effort: 'medium',
    },
  }

  const suggestions: AdaptationSuggestion[] = []
  for (const gap of gaps) {
    const suggestion = catalog[gap.need]
    if (suggestion && !suggestions.some((s) => s.id === suggestion.id)) {
      suggestions.push(suggestion)
    }
  }
  return suggestions.slice(0, 3)
}

/** Texto de ejemplo en lugar de la explicación de OpenAI (sección 12). */
function buildExplanation(
  product: Product,
  reasons: MatchReason[],
  score: number,
): string {
  const matches = reasons.filter((r) => r.status === 'match')
  const gaps = reasons.filter((r) => r.status === 'gap')

  if (matches.length === 0) {
    return `${product.name} no cubre de fábrica ninguna de las necesidades que marcaste. Aparece porque puede adaptarse, no porque encaje tal cual.`
  }

  const head = `${product.name} obtiene ${score} de 100 porque cubre ${matches.length} de las ${reasons.length} necesidades de tu perfil: ${matches
    .map((r) => needLabels[r.need].toLowerCase())
    .join(', ')}.`

  const tail =
    gaps.length > 0
      ? ` Queda pendiente ${gaps.length === 1 ? 'un punto' : `${gaps.length} puntos`}, que sí podés resolver con las adaptaciones de abajo.`
      : ' No quedan necesidades sin cubrir.'

  return head + tail
}

export function buildMockRecommendations(profile: FitProfile): Recommendation[] {
  return mockProducts
    .map((product) => {
      const reasons = buildReasons(product, profile)
      const score = computeScore(product, profile)
      return {
        product,
        score,
        reasons,
        explanation: buildExplanation(product, reasons, score),
        adaptations: buildAdaptations(reasons),
      }
    })
    .sort((a, b) => b.score - a.score)
}
