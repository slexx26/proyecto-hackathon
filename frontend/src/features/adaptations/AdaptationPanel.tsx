import { useState } from 'react'
import type { AdaptationSuggestion } from '@/types/recommendation'
import { effortLabels } from '@/utils/labels'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { cn } from '@/utils/cn'
import { useTranslation } from '@/i18n/languageContext'

/**
 * Sección 13. Convierte "esta prenda no te sirve" en "esta prenda te sirve
 * si le hacés esto".
 *
 * Regla de honestidad: beneficio y limitación se muestran con el mismo peso
 * visual, uno al lado del otro. La limitación no se esconde tras un
 * desplegable ni se escribe más pequeña.
 */

const effortStyles: Record<AdaptationSuggestion['effort'], string> = {
  low: 'bg-fit-high-soft text-fit-high-ink',
  medium: 'bg-fit-mid-soft text-fit-mid-ink',
  high: 'bg-fit-low-soft text-fit-low-ink',
}

interface AdaptationPanelProps {
  suggestions: AdaptationSuggestion[]
  productName: string
}

export function AdaptationPanel({
  suggestions,
  productName,
}: AdaptationPanelProps) {
  const { t } = useTranslation()

  // Solicitudes marcadas en esta sesión. Persistirlas es trabajo de José
  // (endpoint de adaptation requests); hasta entonces vive en memoria.
  const [requested, setRequested] = useState<string[]>([])

  if (suggestions.length === 0) {
    return (
      <p className="rounded-card bg-fit-high-soft px-5 py-4 text-ink">{t('adaptation.none')}</p>
    )
  }

  return (
    <ul className="grid gap-4 lg:grid-cols-2">
      {suggestions.map((suggestion) => {
        const isRequested = requested.includes(suggestion.id)

        return (
          <li
            key={suggestion.id}
            className="flex flex-col rounded-card bg-surface p-5 shadow-card ring-1 ring-line"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <h3 className="font-display text-lg font-bold text-ink">
                {suggestion.title}
              </h3>
              <span
                className={cn(
                  'rounded-full px-3 py-1 text-xs font-semibold',
                  effortStyles[suggestion.effort],
                )}
              >
                {effortLabels[suggestion.effort]}
              </span>
            </div>

            <p className="mt-2 text-ink-muted">{suggestion.description}</p>

            <dl className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-field bg-fit-high-soft p-3.5">
                <dt className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.06em] text-fit-high-ink">
                  <Icon name="check" className="h-4 w-4" />{t('adaptation.benefit')}</dt>
                <dd className="mt-1.5 text-sm text-ink">{suggestion.benefit}</dd>
              </div>
              <div className="rounded-field bg-fit-low-soft p-3.5">
                <dt className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.06em] text-fit-low-ink">
                  <Icon name="alert" className="h-4 w-4" />{t('adaptation.limitation')}</dt>
                <dd className="mt-1.5 text-sm text-ink">
                  {suggestion.limitation}
                </dd>
              </div>
            </dl>

            <div className="mt-4">
              {isRequested ? (
                <p
                  role="status"
                  className="flex items-center gap-2 rounded-field bg-fit-high-soft px-3.5 py-3 text-sm font-semibold text-fit-high-ink"
                >
                  <Icon name="check" className="h-5 w-5" />{t('adaptation.requested')}</p>
              ) : (
                <Button
                  variant="secondary"
                  onClick={() =>
                    setRequested((current) => [...current, suggestion.id])
                  }
                >
                  <Icon name="scissors" className="h-4 w-4" />{t('adaptation.request')}<span className="sr-only"> de {productName}</span>
                </Button>
              )}
            </div>
          </li>
        )
      })}
    </ul>
  )
}
