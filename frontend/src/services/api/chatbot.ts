import { env } from '@/config/env'
import type { ChatMessage, ChatResponse } from '@/types/chat'
import { mockDelay, request } from './client'

function mockReply(message: string, productId?: string): ChatMessage {
  const asked = message.toLowerCase()

  let content =
    'Puedo ayudarte con cierres, formas de vestirse y adaptaciones posibles. Contame qué te cuesta hoy al vestirte y busco prendas o modificaciones que encajen.'

  if (asked.includes('imán') || asked.includes('magn')) {
    content =
      'Los cierres magnéticos se abrochan con una mano y sin pinza fina. Ojo con una cosa: si usás marcapasos o desfibrilador, consultalo con tu equipo de salud antes.'
  } else if (asked.includes('silla') || asked.includes('sentad')) {
    content =
      'Para vestirse sentada o sentado buscá prendas con apertura lateral completa o cruzadas. En el catálogo, el Pantalón Ronda y la Falda Vuelta están pensados para eso.'
  } else if (asked.includes('adapt')) {
    content =
      'Casi cualquier prenda se puede adaptar. Las más sencillas son añadir una argolla al cierre o quitar etiquetas; abrir una costura lateral ya es trabajo de taller.'
  } else if (productId) {
    content = `Sobre esta prenda puedo contarte su tipo de cierre, qué necesidades cubre y qué se le puede modificar. ¿Qué te interesa?`
  }

  return {
    id: `mock-${Date.now()}`,
    role: 'assistant',
    content,
    createdAt: new Date().toISOString(),
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
