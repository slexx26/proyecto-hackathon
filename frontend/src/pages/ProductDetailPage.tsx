import { useCallback, useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchProductById } from '@/services/api/products'
import { fetchRecommendations } from '@/services/api/recommendations'
import { useAsync } from '@/hooks/useAsync'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useFitProfile } from '@/store/fitProfileContext'
import {
  categoryLabels,
  closureLabels,
  formatPrice,
  needLabels,
} from '@/utils/labels'
import { ButtonLink } from '@/components/ui/Button'
import { ErrorState, LoadingState } from '@/components/ui/states'
import { ProductImage } from '@/components/products/ProductImage'
import { ReasonList } from '@/components/recommendations/ReasonList'
import { ScoreBadge } from '@/components/recommendations/ScoreBadge'
import { AdaptationPanel } from '@/features/adaptations/AdaptationPanel'

/**
 * Sección 15. Junta tres fuentes con el mismo `productId`: el producto, su
 * recomendación (si hay perfil) y las adaptaciones propuestas.
 */
export function ProductDetailPage() {
  const { productId } = useParams<{ productId: string }>()
  const { profile } = useFitProfile()

  const productRun = useCallback(
    (signal: AbortSignal) =>
      productId
        ? fetchProductById(productId, signal)
        : Promise.reject(new Error('Sin identificador de producto.')),
    [productId],
  )

  const product = useAsync(productRun, productId ?? 'sin-producto')

  const recommendationsRun = useCallback(
    (signal: AbortSignal) =>
      profile
        ? fetchRecommendations(profile, signal)
        : Promise.reject(new Error('Sin perfil.')),
    [profile],
  )

  const recommendations = useAsync(
    recommendationsRun,
    `detalle#${JSON.stringify(profile ?? null)}`,
    profile !== undefined,
  )

  const match = useMemo(
    () =>
      recommendations.data?.recommendations.find(
        (item) => item.product.id === productId,
      ),
    [recommendations.data, productId],
  )

  useDocumentTitle(product.data?.name ?? 'Prenda')

  if (product.status === 'loading') {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <LoadingState label="Cargando la prenda…" count={2} />
      </div>
    )
  }

  if (product.status === 'error' || !product.data) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <ErrorState message={product.error ?? 'No encontramos esta prenda.'} />
        <div className="mt-6 text-center">
          <ButtonLink to="/marketplace" variant="secondary">
            Volver al catálogo
          </ButtonLink>
        </div>
      </div>
    )
  }

  const item = product.data

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <nav aria-label="Migas de pan" className="text-sm text-ink-muted">
        <Link to="/marketplace" className="underline underline-offset-4">
          Catálogo
        </Link>
        <span aria-hidden="true"> / </span>
        <span>{item.name}</span>
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <ProductImage
          image={item.images[0]}
          className="aspect-4/3 rounded-card"
        />

        <div>
          <p className="text-sm font-medium text-ink-muted">{item.brand}</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            {item.name}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span className="text-2xl font-semibold text-ink">
              {formatPrice(item.price, item.currency)}
            </span>
            {match ? <ScoreBadge score={match.score} size="lg" /> : null}
            {!item.inStock ? (
              <span className="rounded-full bg-surface-sunken px-3 py-1 text-sm text-ink-muted">
                Sin existencias
              </span>
            ) : null}
          </div>

          <p className="mt-5 text-lg text-ink-muted">{item.description}</p>

          <dl className="mt-6 space-y-3 text-sm">
            <div className="flex gap-2">
              <dt className="font-semibold text-ink">Categoría:</dt>
              <dd className="text-ink-muted">
                {categoryLabels[item.category]}
              </dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-semibold text-ink">Cierre:</dt>
              <dd className="text-ink-muted">
                {closureLabels[item.closureType]}
              </dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-semibold text-ink">Materiales:</dt>
              <dd className="text-ink-muted">{item.materials.join(', ')}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-semibold text-ink">Tallas:</dt>
              <dd className="text-ink-muted">{item.sizes.join(' · ')}</dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Características accesibles */}
      <section className="mt-14">
        <h2 className="text-2xl font-bold text-ink">
          Qué resuelve esta prenda
        </h2>
        {item.adaptationNeeds.length > 0 ? (
          <ul className="mt-4 flex flex-wrap gap-2">
            {item.adaptationNeeds.map((need) => (
              <li
                key={need}
                className="rounded-full bg-brand-50 px-4 py-2 text-sm font-medium text-brand-800"
              >
                {needLabels[need]}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-ink-muted">
            Es una prenda convencional: no trae adaptaciones de fábrica. Mirá
            más abajo qué se le puede modificar.
          </p>
        )}
      </section>

      {/* Limitaciones. Nunca se ocultan. */}
      {item.limitations.length > 0 ? (
        <section className="mt-10">
          <h2 className="text-2xl font-bold text-ink">Lo que no resuelve</h2>
          <ul className="mt-4 space-y-2">
            {item.limitations.map((limitation) => (
              <li
                key={limitation}
                className="rounded-xl bg-fit-low/8 px-4 py-3 text-ink"
              >
                {limitation}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {/* Compatibilidad con el perfil */}
      <section className="mt-10">
        <h2 className="text-2xl font-bold text-ink">Tu compatibilidad</h2>

        {!profile ? (
          <div className="mt-4 rounded-card bg-surface-muted px-5 py-6">
            <p className="text-ink-muted">
              Completá Find My Fit y te decimos qué tan bien encaja esta prenda
              con tu forma de vestirte, y qué se le podría adaptar.
            </p>
            <div className="mt-4">
              <ButtonLink to="/find-my-fit">Completar Find My Fit</ButtonLink>
            </div>
          </div>
        ) : null}

        {profile && recommendations.status === 'loading' ? (
          <p className="mt-4 text-ink-muted" role="status">
            Calculando compatibilidad…
          </p>
        ) : null}

        {profile && recommendations.status === 'error' ? (
          <p className="mt-4 text-ink-muted" role="alert">
            No pudimos calcular la compatibilidad ahora mismo. Los datos de la
            prenda que ves arriba sí están completos.
          </p>
        ) : null}

        {match ? (
          <div className="mt-4 rounded-card bg-surface-muted px-5 py-6">
            {match.explanation ? (
              <p className="text-ink">{match.explanation}</p>
            ) : null}
            <div className="mt-4">
              <ReasonList reasons={match.reasons} />
            </div>
          </div>
        ) : null}
      </section>

      {/* Adaptaciones */}
      <section className="mt-10">
        <h2 className="text-2xl font-bold text-ink">Adaptaciones posibles</h2>
        <p className="mt-2 max-w-prose text-ink-muted">
          Modificaciones que un taller de costura puede hacerle a esta prenda.
          Te mostramos siempre qué gana y qué no resuelve.
        </p>
        <div className="mt-5">
          <AdaptationPanel
            suggestions={match?.adaptations ?? []}
            productName={item.name}
          />
        </div>
      </section>
    </div>
  )
}
