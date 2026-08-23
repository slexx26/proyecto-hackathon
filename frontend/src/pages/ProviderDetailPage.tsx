import { useCallback } from 'react'
import { Link, useParams } from 'react-router-dom'
import { providerKindLabels, providerPlanLabels } from '@/types/provider'
import { fetchProviderById } from '@/services/api/providers'
import { fetchProducts } from '@/services/api/products'
import { useAsync } from '@/hooks/useAsync'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { ButtonLink } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { EmptyState, ErrorState, LoadingState } from '@/components/ui/states'
import { ProductCard } from '@/components/products/ProductCard'
import { VerifiedBadge } from '@/components/providers/ProviderCard'
import { ProviderMark } from '@/components/providers/ProviderMark'

/** Ficha del negocio y todo lo que tiene listado. */
export function ProviderDetailPage() {
  const { providerId } = useParams<{ providerId: string }>()

  const providerRun = useCallback(
    (signal: AbortSignal) =>
      providerId
        ? fetchProviderById(providerId, signal)
        : Promise.reject(new Error('Sin identificador de proveedor.')),
    [providerId],
  )

  const provider = useAsync(providerRun, providerId ?? 'sin-proveedor')

  const productsRun = useCallback(
    (signal: AbortSignal) => fetchProducts({ providerId }, signal),
    [providerId],
  )

  const products = useAsync(productsRun, `productos-de-${providerId ?? '-'}`)

  useDocumentTitle(provider.data?.name ?? 'Negocio')

  if (provider.status === 'loading') {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <LoadingState label="Cargando el negocio…" count={2} variant="row" />
      </div>
    )
  }

  if (provider.status === 'error' || !provider.data) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <ErrorState message={provider.error ?? 'No encontramos este negocio.'} />
        <div className="mt-6 text-center">
          <ButtonLink to="/providers" variant="secondary">
            Volver al directorio
          </ButtonLink>
        </div>
      </div>
    )
  }

  const item = provider.data

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <nav aria-label="Migas de pan" className="text-sm text-ink-muted">
        <Link
          to="/providers"
          className="inline-flex min-h-11 items-center underline underline-offset-4 hover:text-ink"
        >
          Negocios
        </Link>
        <span aria-hidden="true" className="px-1.5">
          /
        </span>
        <span className="text-ink">{item.name}</span>
      </nav>

      <header className="animate-rise mt-4 overflow-hidden rounded-panel bg-surface p-6 shadow-card ring-1 ring-line sm:p-8">
        <div className="flex flex-wrap items-start gap-5">
          <ProviderMark name={item.name} kind={item.kind} size="lg" />

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-section font-display font-extrabold text-ink">
                {item.name}
              </h1>
              {item.verified ? <VerifiedBadge /> : null}
            </div>

            <p className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-ink-muted">
              <span>{providerKindLabels[item.kind]}</span>
              <span aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-1.5">
                <Icon name="pin" className="h-4 w-4" />
                {item.location}
              </span>
            </p>
          </div>
        </div>

        <p className="mt-6 max-w-prose text-lg text-ink">{item.description}</p>

        <dl className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-card bg-surface-muted p-4">
            <dt className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.06em] text-ink-muted">
              <Icon name="ship" className="h-4 w-4" />
              Cobertura
            </dt>
            <dd className="mt-1.5 font-semibold text-ink">
              {item.shipsNationwide
                ? 'Envía a todo el país'
                : 'Solo atención presencial'}
            </dd>
          </div>

          <div className="rounded-card bg-surface-muted p-4">
            <dt className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.06em] text-ink-muted">
              <Icon name="verified" className="h-4 w-4" />
              Inscripción
            </dt>
            <dd className="mt-1.5 font-semibold text-ink">
              {providerPlanLabels[item.plan]}
            </dd>
          </div>

          <div className="rounded-card bg-surface-muted p-4">
            <dt className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.06em] text-ink-muted">
              <Icon name="chat" className="h-4 w-4" />
              Contacto
            </dt>
            <dd className="mt-1.5 space-y-1">
              {item.contact.website ? (
                <a
                  href={item.contact.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center gap-1.5 font-semibold text-brand-ink underline underline-offset-4"
                >
                  <Icon name="globe" className="h-4 w-4" />
                  Sitio web
                  <span className="sr-only">
                    {' '}
                    de {item.name}, se abre en una pestaña nueva
                  </span>
                  <Icon name="external" className="h-3.5 w-3.5" />
                </a>
              ) : null}
              {item.contact.phone ? (
                <a
                  href={`tel:${item.contact.phone.replace(/\s/g, '')}`}
                  className="flex min-h-11 items-center gap-1.5 text-ink underline underline-offset-4"
                >
                  <Icon name="phone" className="h-4 w-4 text-ink-muted" />
                  {item.contact.phone}
                </a>
              ) : null}
              {item.contact.email ? (
                <a
                  href={`mailto:${item.contact.email}`}
                  className="flex min-h-11 items-center gap-1.5 text-ink underline underline-offset-4"
                >
                  <Icon name="mail" className="h-4 w-4 text-ink-muted" />
                  {item.contact.email}
                </a>
              ) : null}
            </dd>
          </div>
        </dl>
      </header>

      <section className="mt-14">
        <h2 className="text-section font-display font-extrabold text-ink">
          Lo que tiene listado
        </h2>

        <div className="mt-6">
          {products.status === 'loading' ? (
            <LoadingState label="Cargando sus productos…" count={3} />
          ) : null}

          {products.status === 'error' ? (
            <ErrorState message={products.error ?? 'Error desconocido.'} />
          ) : null}

          {products.status === 'success' && products.data?.length === 0 ? (
            <EmptyState
              title="Todavía no tiene productos listados"
              description="El negocio está inscrito pero aún no cargó su catálogo. Podés contactarlo directamente con los datos de arriba."
            />
          ) : null}

          {products.status === 'success' &&
          products.data &&
          products.data.length > 0 ? (
            <>
              <p aria-live="polite" className="mb-5 text-sm text-ink-muted">
                <span className="font-semibold text-ink">
                  {products.data.length}
                </span>{' '}
                {products.data.length === 1 ? 'producto' : 'productos'}
              </p>
              <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {products.data.map((product, index) => (
                  <li key={product.id}>
                    <ProductCard product={product} index={index} />
                  </li>
                ))}
              </ul>
            </>
          ) : null}
        </div>
      </section>

      <p className="mt-14 flex items-start gap-2.5 rounded-panel bg-surface-muted px-5 py-4 text-sm text-ink-muted ring-1 ring-line">
        <Icon name="info" className="mt-0.5 h-4 w-4 shrink-0" />
        <span>
          ADAPTA no vende estos productos ni cobra comisión por la venta. El
          negocio paga su inscripción en el directorio; a vos no te cobramos
          nada. La verificación confirma que el negocio existe y ofrece lo que
          dice: no es una valoración de su calidad.
        </span>
      </p>
    </div>
  )
}
