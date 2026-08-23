import { cn } from '@/utils/cn'

/**
 * La marca. La A lleva el travesaño abierto por la derecha y en color
 * cálido: la propia letra dice "esto se abre", que es literalmente lo que
 * resuelven los productos del catálogo.
 */
export function BrandMark({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 48 48"
      className={cn('h-8 w-8', className)}
    >
      <rect width="48" height="48" rx="12" fill="var(--color-inverse)" />
      <path
        d="M13 38 L24 10 L35 38"
        fill="none"
        stroke="var(--color-on-inverse)"
        strokeWidth="5.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.8 29.5 H26.4"
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth="5.5"
        strokeLinecap="round"
      />
    </svg>
  )
}
