import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '@/utils/cn'

/**
 * Botón y enlace-botón.
 *
 * Los colores salen de tokens semánticos (`action` / `on-action`), no de la
 * rampa cruda: así el contraste del texto sobre el botón se mantiene al
 * cambiar de tema. Si dijera `bg-brand-700 text-white`, en modo oscuro
 * quedaría blanco sobre turquesa claro.
 *
 * El `active:scale-[0.97]` no es adorno: es la confirmación de que la
 * interfaz oyó la pulsación, y llega antes que cualquier respuesta de red.
 */

type Variant = 'primary' | 'secondary' | 'ghost' | 'inverse'
type Size = 'md' | 'lg'

const base = [
  'inline-flex items-center justify-center gap-2 rounded-full text-center font-semibold',
  'transition-[transform,background-color,color,box-shadow,border-color]',
  'duration-200 ease-(--ease-out-strong)',
  'active:scale-[0.97] active:duration-100',
  'disabled:pointer-events-none disabled:opacity-55 disabled:active:scale-100',
].join(' ')

const variants: Record<Variant, string> = {
  primary: 'bg-action text-on-action shadow-card hover:bg-action-hover hover:shadow-lift',
  secondary:
    'bg-surface text-ink ring-1 ring-line-strong hover:bg-surface-muted hover:ring-ink-muted',
  ghost: 'text-brand-ink hover:bg-brand-soft',
  inverse:
    'bg-on-inverse text-inverse ring-1 ring-transparent hover:bg-on-inverse-muted',
}

const sizes: Record<Size, string> = {
  // Mínimo 44px de alto: objetivo táctil accesible (WCAG 2.5.5).
  md: 'min-h-11 px-5 text-[0.9375rem]',
  lg: 'min-h-13 px-7 text-base',
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  children: ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      {...rest}
    >
      {children}
    </button>
  )
}

interface ButtonLinkProps {
  to: string
  variant?: Variant
  size?: Size
  className?: string
  onClick?: () => void
  children: ReactNode
}

/** Misma apariencia que Button, pero navega. Se mantiene como `<a>` real. */
export function ButtonLink({
  to,
  variant = 'primary',
  size = 'md',
  className,
  onClick,
  children,
}: ButtonLinkProps) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={cn(base, variants[variant], sizes[size], className)}
    >
      {children}
    </Link>
  )
}
