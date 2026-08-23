import { scoreTier } from '@/types/recommendation'
import type { ScoreTier } from '@/types/recommendation'
import { scoreTierLabels } from '@/utils/labels'
import { cn } from '@/utils/cn'

/**
 * Muestra el score de compatibilidad calculado por el backend.
 *
 * ACCESIBILIDAD: el color NO es el único portador de significado, y aquí hay
 * tres codificaciones encima del color —el número, la etiqueta en texto y el
 * arco relleno—, además del texto completo para lector de pantalla.
 *
 * El frontend nunca recalcula este número: solo lo pinta (sección 9).
 */

const tierStyles: Record<ScoreTier, string> = {
  high: 'bg-fit-high-soft text-fit-high-ink ring-fit-high/25',
  mid: 'bg-fit-mid-soft text-fit-mid-ink ring-fit-mid/30',
  low: 'bg-fit-low-soft text-fit-low-ink ring-fit-low/25',
}

const RADIUS = 9
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

interface ScoreBadgeProps {
  score: number
  size?: 'sm' | 'lg'
}

export function ScoreBadge({ score, size = 'sm' }: ScoreBadgeProps) {
  const tier = scoreTier(score)
  const filled = (Math.max(0, Math.min(100, score)) / 100) * CIRCUMFERENCE

  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center gap-2 rounded-full font-semibold ring-1 ring-inset',
        tierStyles[tier],
        size === 'lg' ? 'px-3.5 py-2 text-base' : 'px-2.5 py-1.5 text-sm',
      )}
    >
      {/* Arco: la misma información que el número, en forma. Quien no
          distingue el verde del ámbar sigue viendo cuánto está lleno. */}
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className={cn(size === 'lg' ? 'h-7 w-7' : 'h-5 w-5')}
      >
        <circle
          cx="12"
          cy="12"
          r={RADIUS}
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          opacity="0.22"
        />
        <circle
          cx="12"
          cy="12"
          r={RADIUS}
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={`${filled} ${CIRCUMFERENCE}`}
          transform="rotate(-90 12 12)"
        />
      </svg>

      <span aria-hidden="true" className="flex items-baseline gap-1.5">
        <span data-numeric className="font-display font-bold">
          {score}
        </span>
        <span className={size === 'lg' ? 'text-sm' : 'text-xs'}>
          {scoreTierLabels[tier]}
        </span>
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
    tier === 'high' ? 'bg-fit-high' : tier === 'mid' ? 'bg-fit-mid' : 'bg-fit-low'

  return (
    <div
      aria-hidden="true"
      className="h-1.5 w-full overflow-hidden rounded-full bg-surface-sunken"
    >
      <div
        className={cn('h-full rounded-full transition-[width] duration-700 ease-(--ease-out-strong)', barColor)}
        style={{ width: `${score}%` }}
      />
    </div>
  )
}
