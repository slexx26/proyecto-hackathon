import { useTheme, type ThemePreference } from '@/hooks/useTheme'
import { Icon, type IconName } from '@/components/ui/Icon'
import { cn } from '@/utils/cn'

/**
 * Control de tema.
 *
 * Dos piezas con propósitos distintos:
 *
 * - `ThemeToggle` vive en la cabecera. Es un botón y hace una sola cosa:
 *   cambiar al tema contrario. Su nombre accesible dice lo que VA A HACER
 *   ("Activar modo oscuro"), no en qué estado está, porque eso es lo que
 *   necesita saber quien no ve la pantalla antes de pulsarlo.
 *
 * - `ThemeChoice` vive en el pie y ofrece las tres opciones, incluida
 *   "seguir al sistema", que es la que no cabe en un botón de dos estados.
 */

export function ThemeToggle() {
  const { resolved, setPreference } = useTheme()
  const next = resolved === 'dark' ? 'light' : 'dark'
  const label = next === 'dark' ? 'Activar modo oscuro' : 'Activar modo claro'

  return (
    <button
      type="button"
      onClick={() => setPreference(next)}
      title={label}
      className="inline-flex h-11 w-11 items-center justify-center rounded-full text-ink-muted transition-[background-color,color,transform] duration-200 ease-(--ease-out-strong) hover:bg-surface-muted hover:text-ink active:scale-95"
    >
      <Icon name={resolved === 'dark' ? 'sun' : 'moon'} className="h-5 w-5" />
      <span className="sr-only">{label}</span>
    </button>
  )
}

const options: Array<{ value: ThemePreference; label: string; icon: IconName }> = [
  { value: 'system', label: 'Sistema', icon: 'monitor' },
  { value: 'light', label: 'Claro', icon: 'sun' },
  { value: 'dark', label: 'Oscuro', icon: 'moon' },
]

export function ThemeChoice() {
  const { preference, setPreference } = useTheme()

  return (
    <div
      role="group"
      aria-label="Tema de la interfaz"
      className="inline-flex rounded-full bg-surface p-1 ring-1 ring-line"
    >
      {options.map((option) => {
        const active = preference === option.value
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            onClick={() => setPreference(option.value)}
            className={cn(
              'inline-flex min-h-11 items-center gap-1.5 rounded-full px-3.5 text-sm font-semibold transition-colors duration-200',
              active
                ? 'bg-brand-soft text-brand-ink'
                : 'text-ink-muted hover:text-ink',
            )}
          >
            <Icon name={option.icon} className="h-4 w-4" />
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
