import { useCallback, useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchProductById } from '@/services/api/products'
import { fetchProviderById } from '@/services/api/providers'
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
import { Icon } from '@/components/ui/Icon'
import { ErrorState, LoadingState } from '@/components/ui/states'
import { ProductImage } from '@/components/products/ProductImage'
import { ReasonList } from '@/components/recommendations/ReasonList'
import { ScoreBadge } from '@/components/recommendations/ScoreBadge'
import { AdaptationPanel } from '@/features/adaptations/AdaptationPanel'
import { WhereToGetIt } from '@/components/providers/WhereToGetIt'
import { useTranslation } from '@/i18n/languageContext'

/**
 * Sección 15. Junta tres fuentes con el mismo `productId`: el producto, su
 * recomendación (si hay perfil) y las adaptaciones propuestas.
 */
export function ProductDetailPage() {
  const { t } = useTranslation()

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

  const providerId = product.data?.providerId
  const providerRun = useCallback(
    (signal: AbortSignal) =>
      providerId
        ? fetchProviderById(providerId, signal)
        : Promise.reject(new Error('Sin proveedor.')),
    [providerId],
  )
  const provider = useAsync(
    providerRun,
    providerId ?? 'sin-proveedor',
    providerId !== undefined,
  )

  const match = useMemo(
    () =>
      recommendations.data?.recommendations.find(
        (item) => item.product.id === productId,
      ),
    [recommendations.data, productId],
  )

  useDocumentTitle(product.data?.name ?? t('product.docTitleFallback'))

  if (product.status === 'loading') {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <LoadingState label={t('product.loading')} count={2} />
      </div>
    )
  }

  if (product.status === 'error' || !product.data) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <ErrorState message={product.error ?? t('product.notFound')} />
        <div className="mt-6 text-center">
          <ButtonLink to="/marketplace" variant="secondary">{t('product.backToCatalog')}</ButtonLink>
        </div>
      </div>
    )
  }

  const item = product.data

  const specs = [
    { term: t('product.specCategory'), value: categoryLabels[item.category] },
    { term: t('product.specClosure'), value: closureLabels[item.closureType] },
    { term: t('product.specMaterials'), value: item.materials.join(', ') },
    { term: t('product.specSizes'), value: item.sizes.join(' · ') },
  ]

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <nav aria-label={t('common.breadcrumb')} className="text-sm text-ink-muted">
        <Link
          to="/marketplace"
          className="inline-flex min-h-11 items-center underline underline-offset-4 hover:text-ink"
        >
          Catálogo
        </Link>
        <span aria-hidden="true" className="px-1.5">
          /
        </span>
        <span className="text-ink">{item.name}</span>
      </nav>

      <div className="mt-4 grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-start">
        <div className="group animate-rise overflow-hidden rounded-panel shadow-card ring-1 ring-line lg:sticky lg:top-24">
          <ProductImage
            image={item.images[0]}
            category={item.category}
            className="aspect-4/3"
          />
        </div>

        <div className="animate-rise">
          <p className="text-sm font-semibold uppercase tracking-[0.06em] text-ink-muted">
            {item.brand}
          </p>
          {/* Escala de sección, no de portada: los nombres de producto son
              largos y a escala de portada ocupaban tres líneas. */}
          <h1 className="text-section mt-2 font-display font-extrabold text-ink">
            {item.name}
          </h1>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <span
              data-numeric
              className="font-display text-3xl font-extrabold text-ink"
            >
              {formatPrice(item.price, item.currency)}
            </span>
            {match ? <ScoreBadge score={match.score} size="lg" /> : null}
            {!item.inStock ? (
              <span className="rounded-full bg-surface-sunken px-3 py-1.5 text-sm font-semibold text-ink-muted">{t('product.outOfStock')}</span>
            ) : null}
          </div>

          <p className="mt-5 text-lg text-ink-muted">{item.description}</p>

          {provider.data ? (
            <div className="mt-6">
              <WhereToGetIt provider={provider.data} level={2} />
            </div>
          ) : null}

          <dl className="mt-6 grid gap-x-6 gap-y-3 sm:grid-cols-2">
            {specs.map((spec) => (
              <div key={spec.term} className="border-t border-line pt-3">
                <dt className="text-xs font-bold uppercase tracking-[0.06em] text-ink-muted">
                  {spec.term}
                </dt>
                <dd className="text-ink">{spec.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* Características accesibles */}
      <section className="mt-16">
        <h2 className="text-section font-display font-extrabold text-ink">{t('product.solvesTitle')}</h2>
        {item.adaptationNeeds.length > 0 ? (
          <ul className="mt-5 flex flex-wrap gap-2.5">
            {item.adaptationNeeds.map((need) => (
              <li
                key={need}
                className="inline-flex items-center gap-2 rounded-full bg-brand-soft px-4 py-2.5 font-semibold text-brand-ink ring-1 ring-brand-line"
              >
                <Icon name="check" className="h-4 w-4" />
                {needLabels[need]}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 max-w-prose text-ink-muted">{t('product.noBuiltIn')}</p>
        )}
      </section>

      {/* Limitaciones. Nunca se ocultan ni se escriben más pequeñas. */}
      {item.limitations.length > 0 ? (
        <section className="mt-12">
          <h2 className="text-section font-display font-extrabold text-ink">{t('product.limitationsTitle')}</h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {item.limitations.map((limitation) => (
              <li
                key={limitation}
                className="flex items-start gap-2.5 rounded-card bg-fit-low-soft px-4 py-3.5 text-ink"
              >
                <Icon
                  name="alert"
                  className="mt-0.5 h-5 w-5 shrink-0 text-fit-low-ink"
                />
                {limitation}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {/* Compatibilidad con el perfil */}
      <section className="mt-12">
        <h2 className="text-section font-display font-extrabold text-ink">{t('product.compatibilityTitle')}</h2>

        {/* Zona de resultado: cambia cuando llega el cálculo, así que se
            anuncia. */}
        <div aria-live="polite">
          {!profile ? (
            <div className="mt-5 flex flex-col gap-4 rounded-panel bg-surface-muted px-5 py-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-prose text-ink-muted">{t('product.noProfileBody')}</p>
              <ButtonLink to="/find-my-fit" className="shrink-0">{t('product.noProfileCta')}</ButtonLink>
            </div>
          ) : null}

          {profile && recommendations.status === 'loading' ? (
            <p className="mt-5 text-ink-muted" role="status">{t('product.calculating')}</p>
          ) : null}

          {profile && recommendations.status === 'error' ? (
            <p className="mt-5 text-ink-muted" role="alert">{t('product.compatibilityError')}</p>
          ) : null}

          {match ? (
            <div className="mt-5 grid gap-5 lg:grid-cols-2">
              <div className="rounded-panel bg-accent-soft/70 p-5 ring-1 ring-accent-line/60">
                <h3 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.08em] text-accent-ink">
                  <Icon name="spark" className="h-4 w-4" />
                  {t('reco.aiTitle')}
                </h3>
                <p className="mt-3 text-ink">
                  {match.explanation ??
                    t('product.aiUnavailable')}
                </p>
              </div>

              <div className="rounded-panel bg-surface p-5 ring-1 ring-line">
                <h3 className="text-xs font-bold uppercase tracking-[0.08em] text-ink-muted">
                  {t('reco.evidenceTitle')}
                </h3>
                <div className="mt-3">
                  <ReasonList reasons={match.reasons} />
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </section>

      {/* Adaptaciones */}
      <section className="mt-12">
        <h2 className="text-section font-display font-extrabold text-ink">{t('product.adaptationsTitle')}</h2>
        <p className="mt-3 max-w-prose text-ink-muted">{t('product.adaptationsLead')}</p>
        <div className="mt-6">
          <AdaptationPanel
            suggestions={match?.adaptations ?? []}
            productName={item.name}
          />
        </div>
      </section>
    </div>
  )
}
