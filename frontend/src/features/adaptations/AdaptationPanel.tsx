import { useState } from 'react'
import type { AdaptationSuggestion } from '@/types/recommendation'
import { effortLabels } from '@/utils/labels'
import { Button } from '@/components/ui/Button'

/**
 * Sección 13. Convierte "esta prenda no te sirve" en "esta prenda te sirve
 * si le hacés esto".
 *
 * Regla de honestidad: beneficio y limitación se muestran con el mismo peso
 * visual. La limitación no se esconde tras un desplegable.
 */

interface AdaptationPanelProps {
  suggestions: AdaptationSuggestion[]
  productName: string
}

export function AdaptationPanel({
  suggestions,
  productName,
}: AdaptationPanelProps) {
  // Solicitudes marcadas en esta sesión. Persistirlas es trabajo de José
  // (endpoint de adaptation requests); hasta entonces vive en memoria.
  const [requested, setRequested] = useState<string[]>([])

  if (suggestions.length === 0) {
    return (
      <p className="text-ink-muted">
        Esta prenda ya cubre lo que necesitás: no hace falta modificarla.
      </p>
    )
  }

  return (
    <ul className="space-y-4">
      {suggestions.map((suggestion) => {
        const isRequested = requested.includes(suggestion.id)

        return (
          <li
            key={suggestion.id}
            className="rounded-card bg-surface p-5 ring-1 ring-line"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <h3 className="font-semibold text-ink">{suggestion.title}</h3>
              <span className="rounded-full bg-surface-sunken px-3 py-1 text-xs font-medium text-ink-muted">
                {effortLabels[suggestion.effort]}
              </span>
            </div>

            <p className="mt-2 text-ink-muted">{suggestion.description}</p>

            <dl className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl bg-fit-high/8 p-3">
                <dt className="text-xs font-semibold uppercase tracking-wide text-fit-high">
                  Qué ganás
                </dt>
                <dd className="mt-1 text-sm text-ink">{suggestion.benefit}</dd>
              </div>
              <div className="rounded-xl bg-fit-low/8 p-3">
                <dt className="text-xs font-semibold uppercase tracking-wide text-fit-low">
                  Qué sigue sin resolverse
                </dt>
                <dd className="mt-1 text-sm text-ink">
                  {suggestion.limitation}
                </dd>
              </div>
            </dl>

            <div className="mt-4">
              {isRequested ? (
                <p role="status" className="text-sm font-medium text-fit-high">
                  Anotado. Te avisaremos cuando haya un taller disponible para
                  esta adaptación.
                </p>
              ) : (
                <Button
                  variant="secondary"
                  onClick={() =>
                    setRequested((current) => [...current, suggestion.id])
                  }
                >
                  Me interesa esta adaptación
                  <span className="sr-only"> de {productName}</span>
                </Button>
              )}
            </div>
          </li>
        )
      })}
    </ul>
  )
}
