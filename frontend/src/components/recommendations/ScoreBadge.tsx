import { scoreTier } from '@/types/recommendation'
import type { ScoreTier } from '@/types/recommendation'
import { scoreTierLabels } from '@/utils/labels'
import { cn } from '@/utils/cn'

/**
 * Muestra el score de compatibilidad calculado por el backend.
 *
 * Accesibilidad: el color NO es el único portador de significado. Cada
 * insignia lleva el número y la etiqueta en texto (WCAG 1.4.1).
 */

const tierStyles: Record<ScoreTier, string> = {
  high: 'bg-fit-high/12 text-fit-high ring-fit-high/30',
  mid: 'bg-fit-mid/15 text-fit-mid ring-fit-mid/35',
  low: 'bg-fit-low/10 text-fit-low ring-fit-low/30',
}

interface ScoreBadgeProps {
  score: number
  size?: 'sm' | 'lg'
}

export function ScoreBadge({ score, size = 'sm' }: ScoreBadgeProps) {
  const tier = scoreTier(score)

  return (
    <span
      className={cn(
        'inline-flex items-baseline gap-1.5 rounded-full font-semibold ring-1 ring-inset',
        tierStyles[tier],
        size === 'lg' ? 'px-4 py-2 text-base' : 'px-3 py-1 text-sm',
      )}
    >
      <span aria-hidden="true">{score}</span>
      <span className={size === 'lg' ? 'text-sm' : 'text-xs'}>
        {scoreTierLabels[tier]}
      </span>
      <span className="sr-only">
        Compatibilidad {score} de 100. {scoreTierLabels[tier]}.
      </span>
    </span>
  )
}

/** Barra de apoyo visual. Puramente decorativa: el dato ya está en el badge. */
export function ScoreBar({ score }: { score: number }) {
  const tier = scoreTier(score)
  const barColor =
    tier === 'high'
      ? 'bg-fit-high'
      : tier === 'mid'
        ? 'bg-fit-mid'
        : 'bg-fit-low'

  return (
    <div
      aria-hidden="true"
      className="h-1.5 w-full overflow-hidden rounded-full bg-surface-sunken"
    >
      <div className={cn('h-full rounded-full', barColor)} style={{ width: `${score}%` }} />
    </div>
  )
}
