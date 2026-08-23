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
import { Icon } from '@/components/ui/Icon'
import { SelectField, TextField } from '@/components/forms/fields'
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

  /** Fichas de filtro activo: se ve qué está aplicado y se quita de a uno. */
  const activeChips = [
    search
      ? { key: 'search', label: `“${search}”`, clear: () => setSearch('') }
      : null,
    category
      ? {
          key: 'category',
          label: categoryLabels[category],
          clear: () => setCategory(''),
        }
      : null,
    need
      ? { key: 'need', label: needLabels[need], clear: () => setNeed('') }
      : null,
  ].filter((chip) => chip !== null)

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <header className="animate-rise">
        <h1 className="text-hero font-display font-extrabold text-ink">
          Catálogo
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-ink-muted">
          Todo lo que ofrecen los negocios inscritos: ropa, calzado, prótesis,
          órtesis, movilidad y productos de apoyo, con sus características de
          accesibilidad a la vista. Si querés verlo ordenado por lo que te
          sirve a vos,{' '}
          <Link
            to="/find-my-fit"
            className="font-semibold text-brand-ink underline decoration-brand-line decoration-2 underline-offset-4 hover:decoration-action"
          >
            completá Find My Fit
          </Link>
          .
        </p>
      </header>

      {/* Filtros. `role=search` para que los lectores de pantalla puedan
          saltar directamente aquí. */}
      <div
        role="search"
        className="mt-8 rounded-panel bg-surface-muted p-5 ring-1 ring-line"
      >
        <div className="grid gap-4 sm:grid-cols-3">
          <TextField
            label="Buscar"
            type="search"
            icon="search"
            value={search}
            onChange={setSearch}
            placeholder="Camisa, silla, cierre…"
          />
          <SelectField
            label="Categoría"
            value={category}
            onChange={setCategory}
            anyLabel="Todas"
            options={(Object.keys(categoryLabels) as ProductCategory[]).map(
              (value) => ({ value, label: categoryLabels[value] }),
            )}
          />
          <SelectField
            label="Necesidad que cubre"
            value={need}
            onChange={setNeed}
            anyLabel="Cualquiera"
            options={(Object.keys(needLabels) as AdaptationNeed[]).map(
              (value) => ({ value, label: needLabels[value] }),
            )}
          />
        </div>

        {activeChips.length > 0 ? (
          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-line pt-4">
            <span className="text-sm font-semibold text-ink-muted">
              Filtros activos:
            </span>
            {activeChips.map((chip) => (
              <button
                key={chip.key}
                type="button"
                onClick={chip.clear}
                className="inline-flex min-h-11 items-center gap-1.5 rounded-full bg-surface px-3.5 text-sm font-semibold text-ink ring-1 ring-line-strong transition-colors hover:bg-fit-low-soft hover:text-fit-low-ink hover:ring-fit-low"
              >
                {chip.label}
                <Icon name="close" className="h-3.5 w-3.5" />
                <span className="sr-only">Quitar este filtro</span>
              </button>
            ))}
            <button
              type="button"
              onClick={() => {
                setSearch('')
                setCategory('')
                setNeed('')
              }}
              className="inline-flex min-h-11 items-center px-2 text-sm font-semibold text-brand-ink underline underline-offset-4"
            >
              Limpiar todo
            </button>
          </div>
        ) : null}
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
                ? 'Ningún producto coincide con esos filtros. Probá quitando alguno.'
                : 'El catálogo está vacío por ahora.'
            }
            action={<ButtonLink to="/find-my-fit">Ir a Find My Fit</ButtonLink>}
          />
        ) : null}

        {status === 'success' && data && data.length > 0 ? (
          <>
            <p aria-live="polite" className="mb-5 text-sm text-ink-muted">
              <span className="font-semibold text-ink">{data.length}</span>{' '}
              {data.length === 1 ? 'producto' : 'productos'}
            </p>
            {/* Encabezado solo para lector de pantalla: nombra la región de
                resultados y evita saltar de h1 a los h3 de las tarjetas. */}
            <h2 className="sr-only">Productos encontrados</h2>
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {data.map((product, index) => (
                <li key={product.id}>
                  <ProductCard product={product} index={index} />
                </li>
              ))}
            </ul>
          </>
        ) : null}
      </div>
    </div>
  )
}
