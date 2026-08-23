import type { ReactNode } from 'react'
import { Button } from './Button'

/**
 * Los tres estados no-felices que toda pantalla con datos debe cubrir.
 * Están juntos a propósito: si alguien copia uno, ve los otros dos.
 */

interface LoadingStateProps {
  /** Qué se está cargando. Se anuncia por lector de pantalla. */
  label: string
  /** Número de tarjetas fantasma que dibujar. */
  count?: number
}

export function LoadingState({ label, count = 3 }: LoadingStateProps) {
  return (
    <div role="status" aria-live="polite">
      <span className="sr-only">{label}</span>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: count }, (_, index) => (
          <div
            key={index}
            aria-hidden="true"
            className="h-72 animate-pulse rounded-card bg-surface-sunken"
          />
        ))}
      </div>
    </div>
  )
}

interface EmptyStateProps {
  title: string
  description: string
  action?: ReactNode
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="rounded-card border border-dashed border-line bg-surface-muted px-6 py-14 text-center">
      <h2 className="text-lg font-semibold text-ink">{title}</h2>
      <p className="mx-auto mt-2 max-w-prose text-ink-muted">{description}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  )
}

interface ErrorStateProps {
  message: string
  onRetry?: () => void
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="rounded-card border border-fit-low/30 bg-fit-low/5 px-6 py-10 text-center"
    >
      <h2 className="text-lg font-semibold text-ink">No pudimos cargar esto</h2>
      <p className="mx-auto mt-2 max-w-prose text-ink-muted">{message}</p>
      {onRetry ? (
        <div className="mt-6">
          <Button variant="secondary" onClick={onRetry}>
            Reintentar
          </Button>
        </div>
      ) : null}
    </div>
  )
}
