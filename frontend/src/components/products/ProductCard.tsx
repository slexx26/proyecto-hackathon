import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import type { Product } from '@/types/product'
import {
  categoryLabels,
  closureLabels,
  formatPrice,
  needLabels,
} from '@/utils/labels'
import { ScoreBadge } from '@/components/recommendations/ScoreBadge'
import { ProductImage } from './ProductImage'

interface ProductCardProps {
  product: Product
  /** Presente solo cuando la tarjeta se pinta desde recomendaciones. */
  score?: number
  /** Posición en la lista, para escalonar la entrada. */
  index?: number
}

export function ProductCard({ product, score, index = 0 }: ProductCardProps) {
  const extraNeeds = product.adaptationNeeds.length - 3

  return (
    <article
      style={{ '--i': index } as CSSProperties}
      className="group animate-rise stagger hover-lift relative flex h-full flex-col overflow-hidden rounded-card bg-surface shadow-card ring-1 ring-line"
    >
      <div className="relative">
        <ProductImage
          image={product.images[0]}
          category={product.category}
          className="aspect-4/3"
        />
        <span className="absolute left-3 top-3 rounded-full bg-surface/90 px-2.5 py-1 text-xs font-semibold text-ink backdrop-blur-sm">
          {categoryLabels[product.category]}
        </span>
        {!product.inStock ? (
          <span className="absolute right-3 top-3 rounded-full bg-ink px-2.5 py-1 text-xs font-semibold text-canvas">
            Sin existencias
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="font-display text-lg font-bold leading-snug text-ink">
              {/* El enlace cubre la tarjeta, pero el nombre es el texto
                  accesible del enlace: nada de "leer más". */}
              <Link
                to={`/products/${product.id}`}
                className="after:absolute after:inset-0 after:content-['']"
              >
                {product.name}
              </Link>
            </h3>
            <p className="text-sm text-ink-muted">{product.brand}</p>
          </div>
          {score !== undefined ? <ScoreBadge score={score} /> : null}
        </div>

        <ul className="flex flex-wrap gap-1.5">
          {product.adaptationNeeds.slice(0, 3).map((need) => (
            <li
              key={need}
              className="rounded-full bg-brand-soft px-2.5 py-1 text-xs font-semibold text-brand-ink"
            >
              {needLabels[need]}
            </li>
          ))}
          {extraNeeds > 0 ? (
            <li className="rounded-full px-2.5 py-1 text-xs font-semibold text-ink-muted ring-1 ring-line">
              +{extraNeeds} más
            </li>
          ) : null}
          {product.adaptationNeeds.length === 0 ? (
            <li className="rounded-full bg-surface-sunken px-2.5 py-1 text-xs font-medium text-ink-muted">
              Prenda convencional
            </li>
          ) : null}
        </ul>

        <div className="mt-auto flex items-end justify-between gap-3 border-t border-line pt-3 text-sm">
          <span className="text-ink-muted">
            {closureLabels[product.closureType]}
          </span>
          <span data-numeric className="font-display text-lg font-bold text-ink">
            {formatPrice(product.price, product.currency)}
          </span>
        </div>
      </div>
    </article>
  )
}
