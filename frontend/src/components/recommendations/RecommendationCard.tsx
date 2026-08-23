import { Link } from 'react-router-dom'
import type { Recommendation } from '@/types/recommendation'
import { formatPrice } from '@/utils/labels'
import { ProductImage } from '@/components/products/ProductImage'
import { WhereToGetIt } from '@/components/providers/WhereToGetIt'
import { ReasonList } from './ReasonList'
import { ScoreBadge, ScoreBar } from './ScoreBadge'

export function RecommendationCard({
  recommendation,
}: {
  recommendation: Recommendation
}) {
  const { product, provider, score, reasons, explanation, adaptations } =
    recommendation

  return (
    <article className="flex flex-col overflow-hidden rounded-card bg-surface shadow-card ring-1 ring-line">
      <ProductImage image={product.images[0]} className="aspect-4/3" />

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-semibold text-ink">{product.name}</h3>
            <p className="text-sm text-ink-muted">{product.brand}</p>
          </div>
          <ScoreBadge score={score} />
        </div>

        <ScoreBar score={score} />

        {explanation ? (
          <p className="text-sm text-ink">{explanation}</p>
        ) : (
          // La IA falló o está desactivada: la evidencia de abajo sostiene
          // la pantalla por sí sola (sección 24).
          <p className="text-sm italic text-ink-muted">
            La explicación en lenguaje natural no está disponible ahora mismo.
            Abajo tenés el detalle de por qué obtuvo este puntaje.
          </p>
        )}

        <ReasonList reasons={reasons} />

        <WhereToGetIt provider={provider} />

        {adaptations.length > 0 ? (
          <p className="rounded-xl bg-accent-300/15 px-3 py-2 text-sm text-ink">
            <span className="font-semibold">
              {adaptations.length}{' '}
              {adaptations.length === 1 ? 'adaptación posible' : 'adaptaciones posibles'}
            </span>{' '}
            para cerrar lo que falta.
          </p>
        ) : null}

        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="font-semibold text-ink">
            {formatPrice(product.price, product.currency)}
          </span>
          <Link
            to={`/products/${product.id}`}
            className="text-sm font-semibold text-brand-700 underline underline-offset-4 hover:text-brand-800"
          >
            Ver detalle de {product.name}
          </Link>
        </div>
      </div>
    </article>
  )
}
