import { useCallback, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import type {
  AdaptationNeed,
  ProductCategory,
  ProductFilters,
} from '@/types/product'
import { fetchProducts } from '@/services/api/products'
import { useAsync } from '@/hooks/useAsync'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { categoryLabels, needLabels } from '@/utils/labels'
import { ButtonLink } from '@/components/ui/Button'
import { EmptyState, ErrorState, LoadingState } from '@/components/ui/states'
import { ProductCard } from '@/components/products/ProductCard'

/**
 * Sección 14 (P1). Exploración secundaria: existe para dar contexto, no para
 * competir con el flujo de recomendación. Sin carrito y sin pagos.
 */
export function MarketplacePage() {
  useDocumentTitle('Catálogo')

  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<ProductCategory | ''>('')
  const [need, setNeed] = useState<AdaptationNeed | ''>('')

  const filters: ProductFilters = useMemo(
    () => ({
      search: search || undefined,
      category: category || undefined,
      adaptationNeed: need || undefined,
    }),
    [search, category, need],
  )

  const filtersKey = JSON.stringify(filters)

  const run = useCallback(
    (signal: AbortSignal) => fetchProducts(filters, signal),
    [filters],
  )

  const { status, data, error } = useAsync(run, filtersKey)

  const hasFilters = Boolean(search || category || need)

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          Catálogo
        </h1>
        <p className="mt-3 max-w-prose text-lg text-ink-muted">
          Todas las prendas, con sus características de accesibilidad a la
          vista. Si querés verlas ordenadas por lo que te sirve a vos,{' '}
          <Link
            to="/find-my-fit"
            className="font-semibold text-brand-700 underline underline-offset-4"
          >
            completá Find My Fit
          </Link>
          .
        </p>
      </header>

      {/* Filtros. `search` como `role=search` para lectores de pantalla. */}
      <div
        role="search"
        className="mt-8 grid gap-4 rounded-card bg-surface-muted p-5 sm:grid-cols-3"
      >
        <div>
          <label htmlFor="buscar" className="text-sm font-medium text-ink">
            Buscar
          </label>
          <input
            id="buscar"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="mt-1.5 h-11 w-full rounded-xl bg-surface px-4 text-ink ring-1 ring-line"
          />
        </div>

        <div>
          <label htmlFor="categoria" className="text-sm font-medium text-ink">
            Categoría
          </label>
          <select
            id="categoria"
            value={category}
            onChange={(event) =>
              setCategory(event.target.value as ProductCategory | '')
            }
            className="mt-1.5 h-11 w-full rounded-xl bg-surface px-3 text-ink ring-1 ring-line"
          >
            <option value="">Todas</option>
            {(Object.keys(categoryLabels) as ProductCategory[]).map((value) => (
              <option key={value} value={value}>
                {categoryLabels[value]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="necesidad" className="text-sm font-medium text-ink">
            Necesidad que cubre
          </label>
          <select
            id="necesidad"
            value={need}
            onChange={(event) =>
              setNeed(event.target.value as AdaptationNeed | '')
            }
            className="mt-1.5 h-11 w-full rounded-xl bg-surface px-3 text-ink ring-1 ring-line"
          >
            <option value="">Cualquiera</option>
            {(Object.keys(needLabels) as AdaptationNeed[]).map((value) => (
              <option key={value} value={value}>
                {needLabels[value]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-10">
        {status === 'loading' ? (
          <LoadingState label="Cargando el catálogo…" count={6} />
        ) : null}

        {status === 'error' ? (
          <ErrorState message={error ?? 'Error desconocido.'} />
        ) : null}

        {status === 'success' && data && data.length === 0 ? (
          <EmptyState
            title="Sin resultados"
            description={
              hasFilters
                ? 'Ninguna prenda coincide con esos filtros. Probá quitando alguno.'
                : 'El catálogo está vacío por ahora.'
            }
            action={<ButtonLink to="/find-my-fit">Ir a Find My Fit</ButtonLink>}
          />
        ) : null}

        {status === 'success' && data && data.length > 0 ? (
          <>
            <p aria-live="polite" className="mb-5 text-sm text-ink-muted">
              {data.length} {data.length === 1 ? 'prenda' : 'prendas'}
            </p>
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {data.map((product) => (
                <li key={product.id}>
                  <ProductCard product={product} />
                </li>
              ))}
            </ul>
          </>
        ) : null}
      </div>
    </div>
  )
}
