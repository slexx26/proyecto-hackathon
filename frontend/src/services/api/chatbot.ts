import { env } from '@/config/env'
import type { ChatMessage, ChatResponse } from '@/types/chat'
import { mockProducts } from '@/services/mocks/products.mock'
import { findProvider } from '@/services/mocks/providers.mock'
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
 * aparecen en el producto; el que más acumula, gana. Si nadie llega al
 * mínimo, no hay match y el asistente responde con las respuestas
 * genéricas de siempre.
 */
function findMatchingProduct(message: string) {
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

  // Al menos dos palabras del mensaje tienen que aparecer en el producto,
  // para no redirigir por una sola coincidencia casual (p. ej. "para").
  return best && best.score >= 2 ? best.product : undefined
}

function mockReply(message: string, productId?: string): ChatMessage {
  const asked = normalize(message)
  const matched = findMatchingProduct(message)

  let content: string
  let replyProductId: string | undefined
  let replyProductName: string | undefined

  if (matched) {
    const provider = findProvider(matched.providerId)
    content = matched.inStock
      ? `Sí, tenemos "${matched.name}". Lo vende ${provider.name}` +
        (provider.location ? ` (${provider.location})` : '') +
        (provider.shipsNationwide ? ', y envía a todo el país.' : '.') +
        ' Te dejo el enlace para ver el detalle y contactarlos.'
      : `"${matched.name}" existe en el catálogo, de ${provider.name}, pero ahora mismo está sin existencias. Igual te dejo el enlace para que veas si tienen otras tallas o consultes directamente.`
    replyProductId = matched.id
    replyProductName = matched.name
  } else if (asked.includes('imán') || asked.includes('imanes') || asked.includes('magn')) {
    content =
      'Los cierres magnéticos se abrochan con una mano y sin pinza fina. Ojo con una cosa: si usás marcapasos o desfibrilador, consultalo con tu equipo de salud antes.'
  } else if (asked.includes('silla') || asked.includes('sentad')) {
    content =
      'Para vestirse sentada o sentado buscá prendas con apertura lateral completa o cruzadas. En el catálogo, el Pantalón Ronda y la Falda Vuelta están pensados para eso.'
  } else if (asked.includes('adapt')) {
    content =
      'Casi cualquier prenda se puede adaptar. Las más sencillas son añadir una argolla al cierre o quitar etiquetas; abrir una costura lateral ya es trabajo de taller.'
  } else if (productId) {
    content =
      'Sobre esta prenda puedo contarte su tipo de cierre, qué necesidades cubre y qué se le puede modificar. ¿Qué te interesa?'
  } else {
    content =
      'Puedo ayudarte con cierres, formas de vestirse y adaptaciones posibles, o buscarte una prenda concreta si me decís el nombre — por ejemplo "tenis Paso sin cordones". Contame qué necesitás.'
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
    return mockDelay({ reply: mockReply(message, productId) })
  }

  return request<ChatResponse>('/chat', {
    method: 'POST',
    body: { message, history, productId },
    signal,
  })
}
