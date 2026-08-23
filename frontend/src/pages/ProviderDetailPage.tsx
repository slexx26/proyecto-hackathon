import { useCallback } from 'react'
import { Link, useParams } from 'react-router-dom'
import { providerKindLabels, providerPlanLabels } from '@/types/provider'
import { fetchProviderById } from '@/services/api/providers'
import { fetchProducts } from '@/services/api/products'
import { useAsync } from '@/hooks/useAsync'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { ButtonLink } from '@/components/ui/Button'
import { EmptyState, ErrorState, LoadingState } from '@/components/ui/states'
import { ProductCard } from '@/components/products/ProductCard'
import { VerifiedBadge } from '@/components/providers/ProviderCard'

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
        <LoadingState label="Cargando el negocio…" count={2} />
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
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <nav aria-label="Migas de pan" className="text-sm text-ink-muted">
        <Link to="/providers" className="underline underline-offset-4">
          Negocios
        </Link>
        <span aria-hidden="true"> / </span>
        <span>{item.name}</span>
      </nav>

      <header className="mt-6">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            {item.name}
          </h1>
          {item.verified ? <VerifiedBadge /> : null}
        </div>

        <p className="mt-2 text-lg text-ink-muted">
          {providerKindLabels[item.kind]} · {item.location}
        </p>

        <p className="mt-5 max-w-prose text-lg text-ink">{item.description}</p>

        <dl className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-card bg-surface-muted p-4">
            <dt className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
              Cobertura
            </dt>
            <dd className="mt-1 text-ink">
              {item.shipsNationwide
                ? 'Envía a todo el país'
                : 'Solo atención presencial'}
            </dd>
          </div>
          <div className="rounded-card bg-surface-muted p-4">
            <dt className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
              Inscripción
            </dt>
            <dd className="mt-1 text-ink">{providerPlanLabels[item.plan]}</dd>
          </div>
          <div className="rounded-card bg-surface-muted p-4">
            <dt className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
              Contacto
            </dt>
            <dd className="mt-1 space-y-0.5 text-ink">
              {item.contact.website ? (
                <a
                  href={item.contact.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block font-medium text-brand-700 underline underline-offset-4"
                >
                  Sitio web
                  <span className="sr-only">
                    {' '}
                    de {item.name}, se abre en una pestaña nueva
                  </span>
                </a>
              ) : null}
              {item.contact.phone ? <span className="block">{item.contact.phone}</span> : null}
              {item.contact.email ? <span className="block">{item.contact.email}</span> : null}
            </dd>
          </div>
        </dl>
      </header>

      <section className="mt-14">
        <h2 className="text-2xl font-bold text-ink">Lo que tiene listado</h2>

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

          {products.status === 'success' && products.data && products.data.length > 0 ? (
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.data.map((product) => (
                <li key={product.id}>
                  <ProductCard product={product} />
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </section>

      <p className="mt-12 rounded-card bg-surface-muted px-5 py-4 text-sm text-ink-muted">
        ADAPTA no vende estos productos ni cobra comisión por la venta. El
        negocio paga su inscripción en el directorio; a vos no te cobramos nada.
        La verificación confirma que el negocio existe y ofrece lo que dice, no
        es una valoración de su calidad.
      </p>
    </div>
  )
}
