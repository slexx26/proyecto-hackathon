import { useCallback, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import type { ProviderKind } from '@/types/provider'
import { providerKindLabels } from '@/types/provider'
import { fetchProviders, type ProviderFilters } from '@/services/api/providers'
import { fetchProducts } from '@/services/api/products'
import { useAsync } from '@/hooks/useAsync'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { ButtonLink } from '@/components/ui/Button'
import { Icon, type IconName } from '@/components/ui/Icon'
import { TextField } from '@/components/forms/fields'
import { EmptyState, ErrorState, LoadingState } from '@/components/ui/states'
import { ProviderCard } from '@/components/providers/ProviderCard'
import { cn } from '@/utils/cn'

/**
 * Directorio de negocios inscritos. Es la cara del modelo de negocio: lo que
 * el proveedor compra al inscribirse es aparecer aquí y en las
 * recomendaciones.
 *
 * El filtro por rubro es de fichas y no un desplegable: son cinco opciones
 * fijas, y verlas todas de golpe también sirve para entender qué clase de
 * negocios reúne ADAPTA. Un `<select>` esconde justo eso.
 */

const kindIcons: Record<ProviderKind, IconName> = {
  'adaptive-apparel': 'shirt',
  'adaptation-workshop': 'scissors',
  prosthetics: 'prosthesis',
  'mobility-aids': 'wheelchair',
  'daily-living-aids': 'cup',
}

const allKinds = Object.keys(providerKindLabels) as ProviderKind[]

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
      <header className="animate-rise">
        <h1 className="text-hero font-display font-extrabold text-ink">
          Negocios inscritos
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-ink-muted">
          Tiendas, talleres, ortopedias y proveedores de ayudas técnicas, en un
          solo lugar. Consultarlos es gratis: ADAPTA no te cobra nada ni te
          vende nada, te dice a quién acudir.
        </p>

        <p className="mt-5">
          <Link
            to="/for-business"
            className="inline-flex min-h-11 items-center gap-2 font-semibold text-brand-ink underline decoration-brand-line decoration-2 underline-offset-4 hover:decoration-action"
          >
            <Icon name="store" className="h-5 w-5" />
            ¿Tenés un negocio de este tipo? Inscribilo acá
          </Link>
        </p>
      </header>

      <div
        role="search"
        className="mt-8 rounded-panel bg-surface-muted p-5 ring-1 ring-line"
      >
        <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
          <TextField
            label="Buscar"
            type="search"
            icon="search"
            value={search}
            onChange={setSearch}
            placeholder="Nombre, especialidad o ciudad"
          />

          <label className="flex min-h-12 cursor-pointer items-center gap-2.5 rounded-field bg-surface px-4 font-semibold text-ink ring-1 ring-line-strong transition-colors hover:ring-ink-muted">
            <input
              type="checkbox"
              checked={verifiedOnly}
              onChange={(event) => setVerifiedOnly(event.target.checked)}
              className="h-5 w-5 cursor-pointer"
            />
            <Icon name="verified" className="h-4 w-4 text-fit-high-ink" />
            Solo verificados
          </label>
        </div>

        <fieldset className="mt-5 border-t border-line pt-4">
          <legend className="sr-only">Filtrar por tipo de negocio</legend>
          <p aria-hidden="true" className="mb-3 text-sm font-semibold text-ink-muted">
            Tipo de negocio
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              aria-pressed={kind === ''}
              onClick={() => setKind('')}
              className={cn(
                'inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold transition-colors duration-200',
                kind === ''
                  ? 'bg-action text-on-action'
                  : 'bg-surface text-ink-muted ring-1 ring-line-strong hover:text-ink hover:ring-ink-muted',
              )}
            >
              Todos
            </button>
            {allKinds.map((value) => {
              const active = kind === value
              return (
                <button
                  key={value}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setKind(active ? '' : value)}
                  className={cn(
                    'inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold transition-colors duration-200',
                    active
                      ? 'bg-action text-on-action'
                      : 'bg-surface text-ink-muted ring-1 ring-line-strong hover:text-ink hover:ring-ink-muted',
                  )}
                >
                  <Icon name={kindIcons[value]} className="h-4 w-4" />
                  {providerKindLabels[value]}
                </button>
              )
            })}
          </div>
        </fieldset>
      </div>

      <div className="mt-10">
        {providers.status === 'loading' ? (
          <LoadingState label="Cargando los negocios…" count={6} variant="row" />
        ) : null}

        {providers.status === 'error' ? (
          <ErrorState message={providers.error ?? 'Error desconocido.'} />
        ) : null}

        {providers.status === 'success' && providers.data?.length === 0 ? (
          <EmptyState
            title="Ningún negocio coincide"
            description="Probá quitando algún filtro o buscando por otra palabra."
            action={
              <ButtonLink to="/for-business">Inscribir un negocio</ButtonLink>
            }
          />
        ) : null}

        {providers.status === 'success' &&
        providers.data &&
        providers.data.length > 0 ? (
          <>
            <p aria-live="polite" className="mb-5 text-sm text-ink-muted">
              <span className="font-semibold text-ink">
                {providers.data.length}
              </span>{' '}
              {providers.data.length === 1 ? 'negocio' : 'negocios'}
              {' · '}
              {providers.data.filter((item) => item.verified).length} verificados
            </p>
            <h2 className="sr-only">Negocios encontrados</h2>
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {providers.data.map((provider, index) => (
                <li key={provider.id}>
                  <ProviderCard
                    provider={provider}
                    productCount={countByProvider.get(provider.id) ?? 0}
                    index={index}
                  />
                </li>
              ))}
            </ul>
          </>
        ) : null}
      </div>

      {/* Cierre para el otro lado del mercado. Quien llega a esta pantalla
          buscando un negocio, muchas veces TIENE uno. */}
      <section className="mt-16 overflow-hidden rounded-panel bg-inverse px-6 py-10 text-on-inverse sm:px-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl">
            <h2 className="text-section font-display font-extrabold">
              Tu cliente te está buscando acá.
            </h2>
            <p className="mt-3 text-on-inverse-muted">
              Inscribirse pone tu negocio delante de la persona justo cuando
              describe el problema que vos resolvés. El listado básico es
              gratis.
            </p>
          </div>
          <ButtonLink to="/for-business" size="lg" variant="inverse">
            Ver los planes
            <Icon name="arrow-right" className="h-5 w-5" />
          </ButtonLink>
        </div>
      </section>
    </div>
  )
}
