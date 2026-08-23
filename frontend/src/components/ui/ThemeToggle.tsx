import { useTheme } from '@/hooks/useTheme'
import { Icon } from '@/components/ui/Icon'

/**
 * Control de tema. Un botón en la cabecera que hace una sola cosa: cambiar al
 * tema contrario.
 *
 * Su nombre accesible dice lo que VA A HACER ("Activar modo oscuro"), no en
 * qué estado está, porque eso es lo que necesita saber quien no ve la
 * pantalla antes de pulsarlo.
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
