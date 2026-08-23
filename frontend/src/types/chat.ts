/** Chatbot de apoyo (sección 17). No sustituye al motor determinista. */

export type ChatRole = 'user' | 'assistant'

export interface ChatMessage {
  id: string
  role: ChatRole
  content: string
  /** ISO 8601. */
  createdAt: string
}

export interface ChatRequest {
  message: string
  history: ChatMessage[]
  /** Contexto opcional: si se pregunta desde el detalle de una prenda. */
  productId?: string
}

export interface ChatResponse {
  reply: ChatMessage
}
