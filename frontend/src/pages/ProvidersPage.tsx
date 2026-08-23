import { useCallback, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import type { ProviderKind } from '@/types/provider'
import { providerKindLabels } from '@/types/provider'
import { fetchProviders, type ProviderFilters } from '@/services/api/providers'
import { fetchProducts } from '@/services/api/products'
import { useAsync } from '@/hooks/useAsync'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { ButtonLink } from '@/components/ui/Button'
import { EmptyState, ErrorState, LoadingState } from '@/components/ui/states'
import { ProviderCard } from '@/components/providers/ProviderCard'

/**
 * Directorio de negocios inscritos. Es la cara del modelo de negocio: lo que
 * el proveedor compra al inscribirse es aparecer aquí y en las
 * recomendaciones.
 */
export function ProvidersPage() {
  useDocumentTitle('Negocios inscritos')

  const [search, setSearch] = useState('')
  const [kind, setKind] = useState<ProviderKind | ''>('')
  const [verifiedOnly, setVerifiedOnly] = useState(false)

  const filters: ProviderFilters = useMemo(
    () => ({
      search: search || undefined,
      kind: kind || undefined,
      verifiedOnly: verifiedOnly || undefined,
    }),
    [search, kind, verifiedOnly],
  )

  const providersRun = useCallback(
    (signal: AbortSignal) => fetchProviders(filters, signal),
    [filters],
  )

  const providers = useAsync(providersRun, JSON.stringify(filters))

  // Cuántos productos tiene cada negocio, para dar señal de tamaño.
  const catalogRun = useCallback(
    (signal: AbortSignal) => fetchProducts({}, signal),
    [],
  )
  const catalog = useAsync(catalogRun, 'catalogo-completo')

  const countByProvider = useMemo(() => {
    const counts = new Map<string, number>()
    for (const product of catalog.data ?? []) {
      counts.set(product.providerId, (counts.get(product.providerId) ?? 0) + 1)
    }
    return counts
  }, [catalog.data])

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          Negocios inscritos
        </h1>
        <p className="mt-3 max-w-prose text-lg text-ink-muted">
          Tiendas, talleres, ortopedias y proveedores de ayudas técnicas, en un
          solo lugar. Consultarlos es gratis: ADAPTA no te cobra nada ni te
          vende nada, te dice a quién acudir.
        </p>
        <p className="mt-4">
          <Link
            to="/for-business"
            className="font-semibold text-brand-700 underline underline-offset-4"
          >
            ¿Tenés un negocio de este tipo? Inscribilo acá
          </Link>
        </p>
      </header>

      <div
        role="search"
        className="mt-8 grid gap-4 rounded-card bg-surface-muted p-5 sm:grid-cols-2 lg:grid-cols-3"
      >
        <div>
          <label htmlFor="buscar-negocio" className="text-sm font-medium text-ink">
            Buscar
          </label>
          <input
            id="buscar-negocio"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="mt-1.5 h-11 w-full rounded-xl bg-surface px-4 text-ink ring-1 ring-line"
          />
        </div>

        <div>
          <label htmlFor="tipo-negocio" className="text-sm font-medium text-ink">
            Tipo de negocio
          </label>
          <select
            id="tipo-negocio"
            value={kind}
            onChange={(event) => setKind(event.target.value as ProviderKind | '')}
            className="mt-1.5 h-11 w-full rounded-xl bg-surface px-3 text-ink ring-1 ring-line"
          >
            <option value="">Todos</option>
            {(Object.keys(providerKindLabels) as ProviderKind[]).map((value) => (
              <option key={value} value={value}>
                {providerKindLabels[value]}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-end">
          <label className="flex items-center gap-2.5 pb-2.5 text-sm font-medium text-ink">
            <input
              type="checkbox"
              checked={verifiedOnly}
              onChange={(event) => setVerifiedOnly(event.target.checked)}
              className="h-5 w-5 accent-brand-700"
            />
            Solo verificados
          </label>
        </div>
      </div>

      <div className="mt-10">
        {providers.status === 'loading' ? (
          <LoadingState label="Cargando los negocios…" count={6} />
        ) : null}

        {providers.status === 'error' ? (
          <ErrorState message={providers.error ?? 'Error desconocido.'} />
        ) : null}

        {providers.status === 'success' && providers.data?.length === 0 ? (
          <EmptyState
            title="Ningún negocio coincide"
            description="Probá quitando algún filtro o buscando por otra palabra."
            action={<ButtonLink to="/for-business">Inscribir un negocio</ButtonLink>}
          />
        ) : null}

        {providers.status === 'success' && providers.data && providers.data.length > 0 ? (
          <>
            <p aria-live="polite" className="mb-5 text-sm text-ink-muted">
              {providers.data.length}{' '}
              {providers.data.length === 1 ? 'negocio' : 'negocios'}
            </p>
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {providers.data.map((provider) => (
                <li key={provider.id}>
                  <ProviderCard
                    provider={provider}
                    productCount={countByProvider.get(provider.id) ?? 0}
                  />
                </li>
              ))}
            </ul>
          </>
        ) : null}
      </div>
    </div>
  )
}
