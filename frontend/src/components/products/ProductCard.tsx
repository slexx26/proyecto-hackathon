import { Link } from 'react-router-dom'
import type { Product } from '@/types/product'
import { categoryLabels, closureLabels, formatPrice, needLabels } from '@/utils/labels'
import { ScoreBadge } from '@/components/recommendations/ScoreBadge'
import { ProductImage } from './ProductImage'

interface ProductCardProps {
  product: Product
  /** Presente solo cuando la tarjeta se pinta desde recomendaciones. */
  score?: number
}

export function ProductCard({ product, score }: ProductCardProps) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-card bg-surface shadow-card ring-1 ring-line transition-shadow hover:shadow-lift">
      <ProductImage image={product.images[0]} className="aspect-4/3" />

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-semibold text-ink">
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
              className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-800"
            >
              {needLabels[need]}
            </li>
          ))}
          {product.adaptationNeeds.length === 0 ? (
            <li className="rounded-full bg-surface-sunken px-2.5 py-1 text-xs text-ink-muted">
              Prenda convencional
            </li>
          ) : null}
        </ul>

        <div className="mt-auto flex items-center justify-between pt-2 text-sm">
          <span className="text-ink-muted">
            {categoryLabels[product.category]} · {closureLabels[product.closureType]}
          </span>
          <span className="font-semibold text-ink">
            {formatPrice(product.price, product.currency)}
          </span>
        </div>
      </div>
    </article>
  )
}
