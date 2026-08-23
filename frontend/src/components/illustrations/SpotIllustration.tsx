import type { ReactElement } from 'react'
import { cn } from '@/utils/cn'

/**
 * Ilustraciones de estado.
 *
 * Una pantalla vacía con una frase gris parece una pantalla rota. Un dibujo
 * le dice a la persona "esto está bien, simplemente no hay nada todavía"
 * antes de que llegue a leer.
 *
 * Siguen siendo decorativas: el texto de al lado dice lo mismo y es el que
 * leen los lectores de pantalla.
 */

export type SpotName = 'search' | 'profile' | 'broken' | 'lost' | 'sent'

/** El aro de fondo cambia de color según si el estado es neutro o un fallo. */
const tones: Record<SpotName, string> = {
  search: 'var(--color-brand-soft-strong)',
  profile: 'var(--color-brand-soft-strong)',
  broken: 'var(--color-fit-low-soft)',
  lost: 'var(--color-accent-soft)',
  sent: 'var(--color-fit-high-soft)',
}

const inks: Record<SpotName, string> = {
  search: 'var(--color-brand-ink)',
  profile: 'var(--color-brand-ink)',
  broken: 'var(--color-fit-low-ink)',
  lost: 'var(--color-accent-ink)',
  sent: 'var(--color-fit-high-ink)',
}

const scenes: Record<SpotName, ReactElement> = {
  // Un perchero con sitio de sobra y una lupa: no hay nada que mostrar.
  search: (
    <>
      <path d="M40 46 H160" strokeWidth="4" />
      <path d="M72 46 V54 M56 74 H88 L72 56 Z" />
      <path d="M104 46 V54 M88 74 H120 L104 56 Z" opacity="0.45" />
      <circle cx="122" cy="90" r="19" strokeWidth="4" data-accent="" />
      <path d="M136 104 L152 120" strokeWidth="4" data-accent="" />
    </>
  ),
  // Una ficha con casillas: falta completar el perfil.
  profile: (
    <>
      <rect x="52" y="30" width="96" height="94" rx="10" />
      <rect x="76" y="20" width="48" height="18" rx="9" data-accent="" />
      <path d="M68 62 h12 M68 84 h12 M68 106 h12" strokeWidth="4" />
      <path d="M92 62 h40 M92 84 h40 M92 106 h26" strokeWidth="4" opacity="0.4" />
      <path d="M66 60 l3.5 4 7-8" strokeWidth="4" data-accent="" />
    </>
  ),
  // Una costura que se abrió a mitad de camino: algo se rompió.
  broken: (
    <>
      <path d="M28 78 h40 l10 -12 10 24 10 -12 h6" strokeWidth="4" />
      <path d="M118 78 h44" strokeWidth="4" strokeDasharray="9 9" opacity="0.5" />
      <circle cx="104" cy="78" r="5" strokeWidth="0" fill="var(--color-accent)" />
      <path d="M96 40 C112 52 112 62 104 70 M96 116 C112 104 112 94 104 86" strokeWidth="3.5" opacity="0.55" />
    </>
  ),
  // Una etiqueta colgante suelta: la página que buscaba ya no está.
  lost: (
    <>
      <path d="M64 34 L134 34 L134 88 L99 122 L64 88 Z" />
      <circle cx="99" cy="54" r="8" strokeWidth="4" />
      <path d="M99 26 C99 14 84 14 84 26" strokeWidth="4" data-accent="" />
      <path d="M78 92 h42" strokeWidth="4" opacity="0.4" />
    </>
  ),
  // Un sobre con la marca hecha: la solicitud salió.
  sent: (
    <>
      <rect x="38" y="44" width="124" height="76" rx="10" />
      <path d="M40 50 L100 92 L160 50" strokeWidth="4" />
      <circle cx="140" cy="42" r="22" fill="var(--color-surface)" />
      <path d="M130 42 l7 8 14 -17" strokeWidth="5" data-accent="" />
    </>
  ),
}

interface SpotIllustrationProps {
  name: SpotName
  className?: string
}

export function SpotIllustration({ name, className }: SpotIllustrationProps) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 200 145"
      className={cn('h-28 w-auto', className)}
      style={{ color: inks[name] }}
    >
      <circle cx="100" cy="72" r="62" fill={tones[name]} />
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="[&_[data-accent]]:stroke-accent"
      >
        {scenes[name]}
      </g>
    </svg>
  )
}
