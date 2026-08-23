import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '@/utils/cn'

type Variant = 'primary' | 'secondary' | 'ghost'
type Size = 'md' | 'lg'

const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-55'

const variants: Record<Variant, string> = {
  primary: 'bg-brand-700 text-white hover:bg-brand-800',
  secondary:
    'bg-white text-brand-800 ring-1 ring-brand-300 hover:bg-brand-50 hover:ring-brand-500',
  ghost: 'text-brand-800 hover:bg-brand-50',
}

const sizes: Record<Size, string> = {
  // Mínimo 44px de alto: objetivo táctil accesible (WCAG 2.5.5).
  md: 'min-h-11 px-5 text-sm',
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
