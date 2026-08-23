import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import type { ChatMessage } from '@/types/chat'
import { ApiError } from '@/types/api'
import { sendChatMessage } from '@/services/api/chatbot'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'

/**
 * Sección 17 (P1). Asistente de apoyo, deliberadamente pequeño: aclara dudas
 * sobre cierres y adaptaciones. No calcula compatibilidad ni sustituye al
 * motor determinista.
 */

const greeting: ChatMessage = {
  id: 'greeting',
  role: 'assistant',
  content:
    '¡Hola! Puedo aclararte dudas sobre cierres, formas de vestirse y adaptaciones. ¿En qué te ayudo?',
  createdAt: new Date().toISOString(),
}

export function ChatbotWidget() {
  const { productId } = useParams<{ productId: string }>()
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([greeting])
  const [draft, setDraft] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | undefined>()

  const logRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Al abrir, el foco va al campo de texto: no obligamos a tabular hasta él.
  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight })
  }, [messages])

  // Escape cierra el panel, como cualquier diálogo.
  useEffect(() => {
    if (!open) return
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const text = draft.trim()
    if (!text || sending) return

    const outgoing: ChatMessage = {
      id: `local-${Date.now()}`,
      role: 'user',
      content: text,
      createdAt: new Date().toISOString(),
    }

    const history = messages
    setMessages((current) => [...current, outgoing])
    setDraft('')
    setSending(true)
    setError(undefined)

    try {
      const { reply } = await sendChatMessage(text, history, productId)
      setMessages((current) => [...current, reply])
    } catch (cause) {
      setError(
        cause instanceof ApiError
          ? cause.userMessage
          : 'No pudimos enviar tu mensaje.',
      )
    } finally {
      setSending(false)
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls="panel-chat"
        className="fixed bottom-5 right-5 z-40 inline-flex min-h-13 items-center gap-2 rounded-full bg-inverse px-5 font-semibold text-on-inverse shadow-pop transition-[transform,background-color] duration-200 ease-(--ease-out-strong) hover:bg-inverse-soft active:scale-95"
      >
        <Icon name={open ? 'close' : 'chat'} className="h-5 w-5" />
        {open ? 'Cerrar ayuda' : 'Preguntar'}
      </button>

      {open ? (
        <div
          id="panel-chat"
          role="dialog"
          aria-label="Asistente de ADAPTA"
          className="animate-pop fixed bottom-24 right-5 z-40 flex max-h-[70dvh] w-[min(24rem,calc(100vw-2.5rem))] origin-bottom-right flex-col overflow-hidden rounded-panel bg-surface shadow-pop ring-1 ring-line"
        >
          <div className="flex items-center gap-2.5 border-b border-line bg-surface-muted px-4 py-3">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-brand-soft text-brand-ink">
              <Icon name="spark" className="h-4.5 w-4.5" />
            </span>
            <div>
              <p className="font-display text-sm font-bold text-ink">
                Asistente de ADAPTA
              </p>
              <p className="text-xs text-ink-muted">Cierres, posturas y adaptaciones</p>
            </div>
          </div>
          <div
            ref={logRef}
            role="log"
            aria-live="polite"
            className="flex-1 space-y-3 overflow-y-auto p-4"
          >
            {messages.map((message) => (
              <p
                key={message.id}
                className={
                  message.role === 'user'
                    ? 'ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-action px-4 py-2.5 text-sm text-on-action'
                    : 'max-w-[85%] rounded-2xl rounded-bl-md bg-surface-muted px-4 py-2.5 text-sm text-ink ring-1 ring-line'
                }
              >
                <span className="sr-only">
                  {message.role === 'user' ? 'Vos: ' : 'Asistente: '}
                </span>
                {message.content}
              </p>
            ))}

            {sending ? (
              <p className="flex items-center gap-1.5 text-sm text-ink-muted">
                <span
                  aria-hidden="true"
                  className="animate-sheen h-2 w-2 rounded-full bg-ink-muted"
                />
                Escribiendo…
              </p>
            ) : null}

            {error ? (
              <p role="alert" className="text-sm font-medium text-fit-low">
                {error}
              </p>
            ) : null}
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex gap-2 border-t border-line p-3"
          >
            <label htmlFor="chat-mensaje" className="sr-only">
              Escribí tu pregunta
            </label>
            <input
              id="chat-mensaje"
              ref={inputRef}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="¿Los imanes son seguros?"
              className="h-11 min-w-0 flex-1 rounded-full bg-surface-muted px-4 text-sm text-ink ring-1 ring-line-strong transition-shadow hover:ring-ink-muted"
            />
            <Button type="submit" disabled={sending || draft.trim() === ''}>
              <span className="sr-only sm:not-sr-only">Enviar</span>
              <Icon name="arrow-right" className="h-5 w-5 sm:hidden" />
            </Button>
          </form>

          <p className="px-4 pb-3 text-xs text-ink-muted">
            Respuestas orientativas. No sustituyen consejo médico.
          </p>
        </div>
      ) : null}
    </>
  )
}
