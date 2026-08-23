import { env } from '@/config/env'
import type { AdaptationNeed } from '@/types/product'
import type { ChatMessage, ChatResponse } from '@/types/chat'
import { providerKindLabels } from '@/types/provider'
import { mockProducts } from '@/services/mocks/products.mock'
import { findProvider, mockProviders } from '@/services/mocks/providers.mock'
import { formatPrice } from '@/utils/labels'
import { mockDelay, request } from './client'

/**
 * Quita tildes y pasa a minúsculas, para que "cordónes" y "cordones"
 * matcheen igual. Es una búsqueda de texto simple, no un buscador semántico.
 */
function normalize(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
}

const STOPWORDS = new Set([
  'de', 'la', 'el', 'los', 'las', 'un', 'una', 'unos', 'unas', 'y', 'o',
  'que', 'para', 'con', 'sin', 'por', 'en', 'del', 'al', 'a', 'me', 'mi',
  'quiero', 'busco', 'necesito', 'tienen', 'tenes', 'hay', 'donde', 'dónde',
])

function significantWords(text: string): string[] {
  return normalize(text)
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length > 2 && !STOPWORDS.has(word))
}

/**
 * Busca la prenda que mejor coincide con lo que la persona escribió, por
 * nombre y marca. Cuenta cuántas palabras significativas del mensaje
 * aparecen en el producto; el que más acumula, gana.
 *
 * Al menos dos palabras tienen que coincidir para devolver resultado: evita
 * redirigir por una sola coincidencia casual (p. ej. "para").
 */
function findProductByName(message: string) {
  const words = significantWords(message)
  if (words.length === 0) return undefined

  let best: { product: (typeof mockProducts)[number]; score: number } | undefined

  for (const product of mockProducts) {
    const haystack = normalize(`${product.name} ${product.brand} ${product.description}`)
    const score = words.filter((word) => haystack.includes(word)).length

    if (score > 0 && (!best || score > best.score)) {
      best = { product, score }
    }
  }

  return best && best.score >= 2 ? best.product : undefined
}

/**
 * Frases sueltas que la gente usa para describir una barrera, mapeadas a la
 * necesidad del catálogo (`AdaptationNeed`). No es análisis de lenguaje
 * natural: es una lista corta de pistas, a propósito. Si el mensaje no
 * menciona nada de esto, no se activa la búsqueda por necesidad y el resto
 * de las reglas sigue su curso normal.
 */
const NEED_HINTS: Array<{ keywords: string[]; need: AdaptationNeed }> = [
  { keywords: ['una mano', 'un brazo', 'un solo brazo'], need: 'one-handed-dressing' },
  { keywords: ['sentad', 'silla de ruedas', 'acostad'], need: 'seated-wearing' },
  { keywords: ['iman', 'imanes', 'magnet'], need: 'magnetic-closure' },
  { keywords: ['pinza', 'agarre', 'fuerza en los dedos', 'destreza'], need: 'no-fine-motor' },
  { keywords: ['costura', 'etiqueta', 'textura', 'sensib', 'roce'], need: 'sensory-friendly' },
  { keywords: ['cateter', 'sonda', 'puerto', 'medic', 'acceso medico'], need: 'easy-access-medical' },
  { keywords: ['protesis', 'ortesis', 'implante'], need: 'prosthesis-friendly' },
  { keywords: ['ajust', 'talla cambia', 'hincha'], need: 'adjustable-fit' },
  { keywords: ['temperatura', 'calor', 'frio', 'sudor'], need: 'thermoregulation' },
]

function extractNeeds(message: string): AdaptationNeed[] {
  const asked = normalize(message)
  const found = new Set<AdaptationNeed>()

  for (const { keywords, need } of NEED_HINTS) {
    if (keywords.some((keyword) => asked.includes(keyword))) found.add(need)
  }

  return [...found]
}

/**
 * Cuando el mensaje describe una barrera en vez de nombrar una prenda
 * ("necesito algo para vestirme con una mano"), busca en el catálogo el
 * producto que cubre más de esas necesidades. Es una versión mínima del
 * mismo criterio que usa el motor: más coincidencias, mejor candidato.
 */
function findProductByNeeds(needs: AdaptationNeed[]) {
  if (needs.length === 0) return undefined

  let best: { product: (typeof mockProducts)[number]; score: number } | undefined

  for (const product of mockProducts) {
    const score = needs.filter((need) => product.adaptationNeeds.includes(need)).length
    if (score > 0 && (!best || score > best.score)) {
      best = { product, score }
    }
  }

  return best?.product
}

/** Busca un proveedor por nombre, para cuando preguntan directo por él. */
function findProviderByName(message: string) {
  const words = significantWords(message)
  if (words.length === 0) return undefined

  return mockProviders.find((provider) => {
    const haystack = normalize(provider.name)
    return words.some((word) => word.length > 3 && haystack.includes(word))
  })
}

/**
 * Busca en el historial el último producto del que habló el asistente, para
 * responder preguntas de seguimiento ("¿cuánto cuesta?", "¿y quién la
 * vende?") sin que la persona tenga que repetir el nombre completo.
 */
function lastMentionedProduct(history: ChatMessage[]) {
  for (let i = history.length - 1; i >= 0; i -= 1) {
    const id = history[i].productId
    if (id) return mockProducts.find((product) => product.id === id)
  }
  return undefined
}

function describeProduct(product: (typeof mockProducts)[number]): {
  content: string
  productId: string
  productName: string
} {
  const provider = findProvider(product.providerId)
  const content = product.inStock
    ? `Sí, tenemos "${product.name}". Lo vende ${provider.name}` +
      (provider.location ? ` (${provider.location})` : '') +
      (provider.shipsNationwide ? ', y envía a todo el país.' : '.') +
      ' Te dejo el enlace para ver el detalle y contactarlos.'
    : `"${product.name}" existe en el catálogo, de ${provider.name}, pero ahora mismo está sin existencias. Igual te dejo el enlace para que veas si tienen otras tallas o consultes directamente.`

  return { content, productId: product.id, productName: product.name }
}

function mockReply(message: string, history: ChatMessage[], productId?: string): ChatMessage {
  const asked = normalize(message)

  let content: string
  let replyProductId: string | undefined
  let replyProductName: string | undefined

  const byName = findProductByName(message)
  const byNeeds = byName ? undefined : findProductByNeeds(extractNeeds(message))
  const matched = byName ?? byNeeds

  const followUp = matched
    ? undefined
    : /cuant|precio|cuesta|vale|quien.*vende|donde.*consig/.test(asked)
      ? lastMentionedProduct(history)
      : undefined

  const askedProvider = matched || followUp ? undefined : findProviderByName(message)

  if (matched) {
    const described = describeProduct(matched)
    content = described.content
    replyProductId = described.productId
    replyProductName = described.productName
  } else if (followUp) {
    const provider = findProvider(followUp.providerId)
    content =
      `"${followUp.name}" cuesta ${formatPrice(followUp.price, followUp.currency)}. ` +
      `Lo vende ${provider.name}` +
      (provider.location ? ` en ${provider.location}` : '') +
      '.'
    replyProductId = followUp.id
    replyProductName = followUp.name
  } else if (askedProvider) {
    content =
      `${askedProvider.name} es ${providerKindLabels[askedProvider.kind].toLowerCase()}, en ${askedProvider.location}.` +
      (askedProvider.shipsNationwide ? ' Envía a todo el país.' : ' Atiende solo de forma presencial.') +
      (askedProvider.verified ? ' Es un negocio verificado por ADAPTA.' : '')
  } else if (asked.includes('iman') || asked.includes('magnet')) {
    content =
      'Los cierres magnéticos se abrochan con una mano y sin pinza fina. Ojo con una cosa: si usás marcapasos o desfibrilador, consultalo con tu equipo de salud antes.'
  } else if (asked.includes('adapt')) {
    content =
      'Casi cualquier prenda se puede adaptar. Las más sencillas son añadir una argolla al cierre o quitar etiquetas; abrir una costura lateral ya es trabajo de taller.'
  } else if (productId) {
    content =
      'Sobre esta prenda puedo contarte su tipo de cierre, qué necesidades cubre y qué se le puede modificar. ¿Qué te interesa?'
  } else {
    content =
      'Puedo ayudarte con cierres, formas de vestirse y adaptaciones, buscarte una prenda por su nombre, o recomendarte algo según lo que te cueste — por ejemplo "necesito algo para vestirme con una mano". Contame qué necesitás.'
  }

  return {
    id: `mock-${Date.now()}`,
    role: 'assistant',
    content,
    createdAt: new Date().toISOString(),
    productId: replyProductId,
    productName: replyProductName,
  }
}

export function sendChatMessage(
  message: string,
  history: ChatMessage[],
  productId?: string,
  signal?: AbortSignal,
): Promise<ChatResponse> {
  if (env.useMockApi) {
    return mockDelay({ reply: mockReply(message, history, productId) })
  }

  return request<ChatResponse>('/chat', {
    method: 'POST',
    body: { message, history, productId },
    signal,
  })
}
