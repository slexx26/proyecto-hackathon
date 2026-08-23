import type { ProviderKind } from '@/types/provider'
import { Icon, type IconName } from '@/components/ui/Icon'
import { cn } from '@/utils/cn'

/**
 * Marca visual del negocio.
 *
 * Los negocios del directorio son ficticios (sección 26) y no tienen
 * logotipo. Inventarles uno sería exactamente lo que el proyecto no debe
 * hacer. Un monograma con el icono de su rubro identifica la ficha de un
 * vistazo sin fingir una identidad que no existe.
 */

const kindIcons: Record<ProviderKind, IconName> = {
  'adaptive-apparel': 'shirt',
  'adaptation-workshop': 'scissors',
  prosthetics: 'prosthesis',
  'mobility-aids': 'wheelchair',
  // Taza de asa grande, no cuchara: a 14px la cuchara se confundía con la
  // lupa del buscador, que vive en la misma pantalla.
  'daily-living-aids': 'cup',
}

interface ProviderMarkProps {
  name: string
  kind: ProviderKind
  size?: 'md' | 'lg'
}

export function ProviderMark({ name, kind, size = 'md' }: ProviderMarkProps) {
  const initial = name.trim().charAt(0).toUpperCase()

  return (
    <span
      aria-hidden="true"
      className={cn(
        'relative grid shrink-0 place-items-center rounded-2xl bg-brand-soft text-brand-ink ring-1 ring-brand-line',
        size === 'lg' ? 'h-16 w-16' : 'h-12 w-12',
      )}
    >
      <span
        className={cn(
          'font-display font-bold',
          size === 'lg' ? 'text-2xl' : 'text-lg',
        )}
      >
        {initial}
      </span>
      <span
        className={cn(
          'absolute grid place-items-center rounded-full bg-surface text-ink-muted ring-1 ring-line',
          size === 'lg' ? '-bottom-1.5 -right-1.5 h-7 w-7' : '-bottom-1 -right-1 h-6 w-6',
        )}
      >
        <Icon
          name={kindIcons[kind]}
          className={size === 'lg' ? 'h-4 w-4' : 'h-3.5 w-3.5'}
        />
      </span>
    </span>
  )
}
