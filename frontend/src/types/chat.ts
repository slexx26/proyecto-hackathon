/** Chatbot de apoyo (sección 17). No sustituye al motor determinista. */

export type ChatRole = 'user' | 'assistant'

export interface ChatMessage {
  id: string
  role: ChatRole
  content: string
  /** ISO 8601. */
  createdAt: string
  /**
   * Opcionales, siempre juntos. Cuando el asistente identifica una prenda
   * concreta en la pregunta, la interfaz muestra un botón para ir directo a
   * su detalle y a "dónde conseguirlo". Va el nombre además del id para que
   * el componente no tenga que ir a buscar el producto por su cuenta — acá
   * ningún componente lee un mock ni hace una petición aparte solo para
   * rotular un botón. El backend no está obligado a rellenarlos: si faltan,
   * el mensaje se ve igual, solo sin el botón.
   */
  productId?: string
  productName?: string
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
