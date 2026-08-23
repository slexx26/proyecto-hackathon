import type { ReactNode } from 'react'
import { SpotIllustration, type SpotName } from '@/components/illustrations/SpotIllustration'
import { cn } from '@/utils/cn'
import { Button } from './Button'
import { useTranslation } from '@/i18n/languageContext'

/**
 * Los tres estados no-felices que toda pantalla con datos debe cubrir.
 * Están juntos a propósito: si alguien copia uno, ve los otros dos.
 */

interface LoadingStateProps {
  /** Qué se está cargando. Se anuncia por lector de pantalla. */
  label: string
  /** Número de tarjetas fantasma que dibujar. */
  count?: number
  /** `card` imita una tarjeta con imagen; `row`, una ficha de texto. */
  variant?: 'card' | 'row'
}

/**
 * El esqueleto copia la forma real del contenido —imagen arriba, título,
 * dos líneas y un pie— para que al llegar los datos nada salte de sitio. Un
 * rectángulo genérico ahorra trabajo y provoca justo el salto que queríamos
 * evitar.
 */
export function LoadingState({
  label,
  count = 3,
  variant = 'card',
}: LoadingStateProps) {
  return (
    <div role="status" aria-live="polite" aria-busy="true">
      <span className="sr-only">{label}</span>
      <div
        aria-hidden="true"
        className={cn(
          'grid gap-6',
          variant === 'card' ? 'sm:grid-cols-2 lg:grid-cols-3' : 'sm:grid-cols-2',
        )}
      >
        {Array.from({ length: count }, (_, index) => (
          <div
            key={index}
            style={{ animationDelay: `${index * 90}ms` }}
            className="animate-sheen overflow-hidden rounded-card bg-surface ring-1 ring-line"
          >
            {variant === 'card' ? (
              <div className="aspect-4/3 w-full bg-surface-sunken" />
            ) : null}
            <div className="space-y-3 p-5">
              <div className="h-4 w-2/3 rounded-full bg-surface-sunken" />
              <div className="h-3 w-1/3 rounded-full bg-surface-sunken" />
              <div className="flex gap-2 pt-1">
                <div className="h-6 w-24 rounded-full bg-surface-sunken" />
                <div className="h-6 w-16 rounded-full bg-surface-sunken" />
              </div>
              <div className="h-3 w-full rounded-full bg-surface-sunken" />
              <div className="h-3 w-4/5 rounded-full bg-surface-sunken" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

interface EmptyStateProps {
  title: string
  description: string
  action?: ReactNode
  /** Qué dibujo acompaña al mensaje. */
  spot?: SpotName
}

export function EmptyState({
  title,
  description,
  action,
  spot = 'search',
}: EmptyStateProps) {
  return (
    <div className="animate-fade rounded-panel border border-dashed border-line-strong bg-surface-muted px-6 py-12 text-center">
      <SpotIllustration name={spot} className="mx-auto h-32 w-auto" />
      <h2 className="mt-5 font-display text-xl font-bold text-ink">{title}</h2>
      <p className="mx-auto mt-2 max-w-prose text-ink-muted">{description}</p>
      {action ? <div className="mt-6 flex justify-center">{action}</div> : null}
    </div>
  )
}

interface ErrorStateProps {
  message: string
  onRetry?: () => void
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  const { t } = useTranslation()

  return (
    <div
      role="alert"
      className="animate-fade rounded-panel bg-fit-low-soft px-6 py-12 text-center ring-1 ring-fit-low/30"
    >
      <SpotIllustration name="broken" className="mx-auto h-32 w-auto" />
      <h2 className="mt-5 font-display text-xl font-bold text-ink">{t('states.loadErrorTitle')}</h2>
      <p className="mx-auto mt-2 max-w-prose text-ink-muted">{message}</p>
      {onRetry ? (
        <div className="mt-6 flex justify-center">
          <Button variant="secondary" onClick={onRetry}>{t('common.retry')}</Button>
        </div>
      ) : null}
    </div>
  )
}
