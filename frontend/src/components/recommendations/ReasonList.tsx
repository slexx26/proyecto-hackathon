import type { MatchReason } from '@/types/recommendation'
import { cn } from '@/utils/cn'

/**
 * Evidencia determinista detrás del puntaje (sección 9).
 *
 * Se muestra siempre, incluso cuando la explicación de IA falta: es la parte
 * que la persona puede verificar, y no depende de OpenAI.
 */

const marks: Record<MatchReason['status'], { symbol: string; className: string; text: string }> =
  {
    match: { symbol: '✓', className: 'text-fit-high', text: 'Cubierto' },
    partial: { symbol: '≈', className: 'text-fit-mid', text: 'Cubierto en parte' },
    gap: { symbol: '!', className: 'text-fit-low', text: 'No cubierto' },
  }

export function ReasonList({ reasons }: { reasons: MatchReason[] }) {
  if (reasons.length === 0) return null

  return (
    <ul className="space-y-2">
      {reasons.map((reason, index) => {
        const mark = marks[reason.status]
        return (
          <li key={`${reason.need}-${index}`} className="flex gap-2.5 text-sm">
            <span
              aria-hidden="true"
              className={cn('font-bold leading-6', mark.className)}
            >
              {mark.symbol}
            </span>
            <span
              className={
                reason.status === 'gap' ? 'text-ink-muted' : 'text-ink'
              }
            >
              {/* Texto para lector de pantalla: el símbolo no basta. */}
              <span className="sr-only">{mark.text}: </span>
              {reason.label}
            </span>
          </li>
        )
      })}
    </ul>
  )
}
