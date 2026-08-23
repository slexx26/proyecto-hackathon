import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import type { Recommendation } from '@/types/recommendation'
import { formatPrice } from '@/utils/labels'
import { Icon } from '@/components/ui/Icon'
import { ProductImage } from '@/components/products/ProductImage'
import { WhereToGetIt } from '@/components/providers/WhereToGetIt'
import { ReasonList } from './ReasonList'
import { ScoreBadge, ScoreBar } from './ScoreBadge'

/**
 * La tarjeta separa visualmente dos cosas que el proyecto no debe mezclar:
 * la EVIDENCIA, que sale del motor determinista, y la EXPLICACIÓN, que
 * escribe la IA a partir de esa evidencia. Están rotuladas para que en la
 * demostración se vea de un vistazo quién dijo qué (secciones 10 y 12).
 */
export function RecommendationCard({
  recommendation,
  index = 0,
}: {
  recommendation: Recommendation
  index?: number
}) {
  const { product, provider, score, reasons, explanation, adaptations } =
    recommendation

  return (
    <article
      style={{ '--i': index } as CSSProperties}
      className="group animate-rise stagger flex h-full flex-col overflow-hidden rounded-card bg-surface shadow-card ring-1 ring-line"
    >
      <div className="relative">
        <ProductImage
          image={product.images[0]}
          category={product.category}
          className="aspect-16/9"
        />
        <span className="absolute right-3 top-3">
          <ScoreBadge score={score} />
        </span>
      </div>

      <ScoreBar score={score} />

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div>
          <h3 className="font-display text-lg font-bold leading-snug text-ink">
            {product.name}
          </h3>
          <p className="text-sm text-ink-muted">{product.brand}</p>
        </div>

        <div className="rounded-card bg-accent-soft/70 p-4 ring-1 ring-accent-line/60">
          <h4 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.08em] text-accent-ink">
            <Icon name="spark" className="h-4 w-4" />
            Lo que dice la IA
          </h4>
          {explanation ? (
            <p className="mt-2 text-sm text-ink">{explanation}</p>
          ) : (
            // La IA falló o está desactivada: la evidencia de abajo sostiene
            // la pantalla por sí sola (sección 24).
            <p className="mt-2 text-sm text-ink-muted">
              La explicación en lenguaje natural no está disponible ahora
              mismo. Abajo tenés la evidencia con la que se calculó el puntaje.
            </p>
          )}
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-[0.08em] text-ink-muted">
            Evidencia del motor
          </h4>
          <div className="mt-2.5">
            <ReasonList reasons={reasons} />
          </div>
        </div>

        <WhereToGetIt provider={provider} />

        {adaptations.length > 0 ? (
          <p className="flex items-center gap-2 rounded-field bg-surface-muted px-3 py-2.5 text-sm text-ink">
            <Icon name="scissors" className="h-4 w-4 shrink-0 text-ink-muted" />
            <span>
              <span className="font-semibold">
                {adaptations.length}{' '}
                {adaptations.length === 1
                  ? 'adaptación posible'
                  : 'adaptaciones posibles'}
              </span>{' '}
              para cerrar lo que falta.
            </span>
          </p>
        ) : null}

        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-line pt-3">
          <span data-numeric className="font-display text-lg font-bold text-ink">
            {formatPrice(product.price, product.currency)}
          </span>
          <Link
            to={`/products/${product.id}`}
            className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-brand-ink underline underline-offset-4 hover:text-action-hover"
          >
            Ver detalle
            <span className="sr-only"> de {product.name}</span>
            <Icon name="arrow-right" className="h-4 w-4 transition-transform duration-200 ease-(--ease-out-strong) group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </article>
  )
}
