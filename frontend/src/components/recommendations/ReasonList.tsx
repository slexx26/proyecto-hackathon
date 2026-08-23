import type { MatchReason } from '@/types/recommendation'
import { Icon, type IconName } from '@/components/ui/Icon'
import { cn } from '@/utils/cn'
import type { TranslationKey } from '@/i18n/dictionaries'
import { useTranslation } from '@/i18n/languageContext'

/**
 * Evidencia determinista detrás del puntaje (sección 9).
 *
 * Se muestra siempre, incluso cuando la explicación de IA falta: es la parte
 * que la persona puede verificar, y no depende de OpenAI.
 *
 * Cada fila lleva icono con forma propia (no solo color) y una palabra de
 * estado para lector de pantalla.
 */

const marks: Record<
  MatchReason['status'],
  { icon: IconName; chip: string; text: TranslationKey }
> = {
  match: {
    icon: 'check',
    chip: 'bg-fit-high-soft text-fit-high-ink',
    text: 'reason.match',
  },
  partial: {
    icon: 'partial',
    chip: 'bg-fit-mid-soft text-fit-mid-ink',
    text: 'reason.partial',
  },
  gap: {
    icon: 'alert',
    chip: 'bg-fit-low-soft text-fit-low-ink',
    text: 'reason.gap',
  },
}

export function ReasonList({ reasons }: { reasons: MatchReason[] }) {
  const { t } = useTranslation()

  if (reasons.length === 0) return null

  return (
    <ul className="space-y-2">
      {reasons.map((reason, index) => {
        const mark = marks[reason.status]
        return (
          <li key={`${reason.need}-${index}`} className="flex items-start gap-2.5">
            <span
              aria-hidden="true"
              className={cn(
                'mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full',
                mark.chip,
              )}
            >
              <Icon name={mark.icon} className="h-3.5 w-3.5" />
            </span>
            <span
              className={cn(
                'text-sm',
                reason.status === 'gap' ? 'text-ink-muted' : 'text-ink',
              )}
            >
              {/* El icono no basta: el estado también va en texto. */}
              <span className="sr-only">{t(mark.text)}: </span>
              {reason.label}
            </span>
          </li>
        )
      })}
    </ul>
  )
}
