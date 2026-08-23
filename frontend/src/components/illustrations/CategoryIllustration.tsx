import type { ReactElement } from 'react'
import type { ProductCategory } from '@/types/product'
import { cn } from '@/utils/cn'

/**
 * Ilustración por categoría de producto.
 *
 * El catálogo de demostración no tiene fotografías, y no debe tenerlas: usar
 * fotos de personas o de marcas reales sería falsear el origen de los datos
 * (sección 26). Un marcador que solo dice "ADAPTA" tampoco sirve: la persona
 * no distingue una silla de ruedas de un pantalón hasta leer el título.
 *
 * Estas ilustraciones son vectores planos y geométricos, en línea (nada de
 * peticiones externas, todo entra en el bundle) y pintadas con los tokens
 * semánticos, así que siguen al modo oscuro solas.
 *
 * Son DECORATIVAS: van con `aria-hidden` y quien las usa pone el texto
 * alternativo real. Nunca son la única fuente de información.
 */

const shapes: Record<ProductCategory, ReactElement> = {
  tops: (
    <>
      <path d="M64 34 L52 44 L60 55 L65 50 L65 90 H95 V50 L100 55 L108 44 L96 34 L89 34 C89 41 71 41 71 34 Z" />
      <path d="M80 44 V88" strokeWidth="2.5" fill="none" />
      <circle cx="80" cy="54" r="3" data-accent="" strokeWidth="0" />
      <circle cx="80" cy="66" r="3" data-accent="" strokeWidth="0" />
      <circle cx="80" cy="78" r="3" data-accent="" strokeWidth="0" />
    </>
  ),
  bottoms: (
    <>
      <path d="M62 34 H98 L104 94 H87 L80 60 L73 94 H56 Z" />
      <rect x="60" y="28" width="40" height="10" rx="5" data-accent="" strokeWidth="0" />
      <path d="M67 42 V90" strokeWidth="2.5" strokeDasharray="6 5" fill="none" />
    </>
  ),
  outerwear: (
    <>
      <path d="M62 36 L48 47 L57 59 L62 54 L62 96 H98 V54 L103 59 L112 47 L98 36 L80 52 Z" />
      <path d="M80 52 V94" strokeWidth="2.5" fill="none" />
      <circle cx="80" cy="60" r="5" data-accent="" strokeWidth="0" />
      <path d="M62 36 L80 52 L98 36" strokeWidth="2.5" fill="none" />
    </>
  ),
  footwear: (
    <>
      {/* Perfil de zapato con la punta a la izquierda. La primera versión
          era un contorno cerrado que a tamaño de tarjeta se leía como una
          mancha; separar la suela del corte lo vuelve reconocible. */}
      <path d="M56 72 C56 61 62 56 73 54 L96 48 C101 47 104 49 104 53 V72 Z" />
      <path d="M85 50 C90 56 98 56 104 53" fill="none" strokeWidth="2.5" />
      <path d="M50 72 H110 C113 72 114 80 110 80 H53 C49 80 47 72 50 72 Z" />
      {/* Sin cordones: una tira ancha, que es lo que resuelve el problema. */}
      <rect
        x="66"
        y="55"
        width="30"
        height="9"
        rx="4.5"
        transform="rotate(-14 81 59.5)"
        data-accent=""
        strokeWidth="0"
      />
    </>
  ),
  underwear: (
    <>
      <path d="M56 46 H104 L99 76 C95 86 86 86 82 76 L80 68 L78 76 C74 86 65 86 61 76 Z" />
      <rect x="54" y="38" width="52" height="11" rx="5.5" data-accent="" strokeWidth="0" />
    </>
  ),
  accessories: (
    <>
      <path d="M58 36 L98 80 M102 36 L62 80" strokeWidth="3.5" fill="none" />
      <circle cx="103" cy="86" r="8" fill="none" strokeWidth="3" />
      <circle cx="57" cy="86" r="8" fill="none" strokeWidth="3" />
      <rect x="66" y="26" width="28" height="12" rx="4" data-accent="" strokeWidth="0" />
    </>
  ),
  prosthetics: (
    <>
      {/* Encaje, articulación, tubo y terminal. Deliberadamente sin forma de
          pie: la misma categoría cubre prótesis de mano, y dibujar una
          pierna al lado de una prótesis mioeléctrica de mano era mentir. */}
      <path d="M66 24 H94 L91 50 H69 Z" />
      <circle cx="80" cy="53" r="7" fill="none" strokeWidth="3" />
      <rect x="75" y="60" width="10" height="24" rx="3" data-accent="" strokeWidth="0" />
      <path d="M66 86 H94 C98 86 98 96 94 96 H66 C62 96 62 86 66 86 Z" />
    </>
  ),
  orthotics: (
    <>
      <rect x="68" y="24" width="24" height="72" rx="12" />
      <path d="M62 34 V88 M98 34 V88" strokeWidth="3" fill="none" />
      <rect x="58" y="38" width="44" height="9" rx="4.5" data-accent="" strokeWidth="0" />
      <rect x="58" y="56" width="44" height="9" rx="4.5" data-accent="" strokeWidth="0" />
      <rect x="58" y="74" width="44" height="9" rx="4.5" data-accent="" strokeWidth="0" />
    </>
  ),
  mobility: (
    <>
      <circle cx="88" cy="72" r="22" fill="none" strokeWidth="3.5" />
      <circle cx="88" cy="72" r="7" />
      <circle cx="50" cy="86" r="9" fill="none" strokeWidth="3" />
      <path d="M58 60 H94 M58 60 L54 30 M46 82 L60 74" strokeWidth="3.5" fill="none" />
      <rect x="52" y="26" width="26" height="9" rx="4.5" data-accent="" strokeWidth="0" />
    </>
  ),
  'daily-living': (
    <g transform="rotate(-24 80 60)">
      <rect x="46" y="52" width="52" height="20" rx="10" data-accent="" strokeWidth="0" />
      <path d="M98 62 H108 C118 62 122 56 122 50 C122 44 118 40 110 40 C102 40 98 46 98 52 Z" />
      <path d="M46 62 H36" strokeWidth="3" fill="none" />
    </g>
  ),
}

interface CategoryIllustrationProps {
  category: ProductCategory
  className?: string
}

export function CategoryIllustration({
  category,
  className,
}: CategoryIllustrationProps) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 160 120"
      preserveAspectRatio="xMidYMid slice"
      className={cn('h-full w-full', className)}
    >
      {/* Fondo: dos discos desalineados. Rompen el rectángulo sin pedir una
          imagen y dan profundidad a un dibujo plano. */}
      <circle cx="112" cy="26" r="34" fill="var(--color-brand-soft-strong)" opacity="0.55" />
      <circle cx="62" cy="62" r="46" fill="var(--color-brand-soft-strong)" opacity="0.75" />

      <g
        fill="var(--color-surface)"
        stroke="var(--color-brand-ink)"
        strokeWidth="3"
        strokeLinejoin="round"
        strokeLinecap="round"
        // `data-accent` marca las piezas que llevan el color cálido: el
        // cierre, la correa, la empuñadura. Es decir, justo la parte que
        // resuelve el problema de accesibilidad de cada producto.
        className="[&_[data-accent]]:fill-accent"
      >
        {shapes[category]}
      </g>
    </svg>
  )
}
