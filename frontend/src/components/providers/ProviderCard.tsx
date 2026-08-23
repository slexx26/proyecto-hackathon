import { Link } from 'react-router-dom'
import {
  providerKindLabels,
  type Provider,
} from '@/types/provider'
import { cn } from '@/utils/cn'

/**
 * Insignia de verificación. Dice lo que significa, no más: que ADAPTA
 * comprobó que el negocio existe y ofrece lo que dice. No es una reseña ni
 * una valoración de calidad, y no debe leerse como tal.
 */
export function VerifiedBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-fit-high/12 px-2.5 py-1 text-xs font-semibold text-fit-high ring-1 ring-inset ring-fit-high/30">
      <span aria-hidden="true">✓</span>
      Verificado por ADAPTA
    </span>
  )
}

interface ProviderCardProps {
  provider: Provider
  /** Cuántos productos suyos hay en el catálogo. Opcional. */
  productCount?: number
}

export function ProviderCard({ provider, productCount }: ProviderCardProps) {
  return (
    <article
      className={cn(
        'relative flex h-full flex-col gap-3 rounded-card bg-surface p-5 shadow-card ring-1 transition-shadow hover:shadow-lift',
        // El plan destacado se nota, pero sin gritar ni empujar al resto fuera.
        provider.plan === 'featured' ? 'ring-2 ring-brand-400' : 'ring-line',
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-ink">
            <Link
              to={`/providers/${provider.id}`}
              className="after:absolute after:inset-0 after:content-['']"
            >
              {provider.name}
            </Link>
          </h3>
          <p className="text-sm text-ink-muted">
            {providerKindLabels[provider.kind]}
          </p>
        </div>
        {provider.verified ? <VerifiedBadge /> : null}
      </div>

      <p className="text-sm text-ink-muted">{provider.description}</p>

      <ul className="mt-auto flex flex-wrap gap-x-4 gap-y-1 pt-2 text-sm text-ink-muted">
        <li>{provider.location}</li>
        {provider.shipsNationwide ? (
          <li>Envía a todo el país</li>
        ) : (
          <li>Solo atención presencial</li>
        )}
        {productCount !== undefined ? (
          <li>
            {productCount}{' '}
            {productCount === 1 ? 'producto listado' : 'productos listados'}
          </li>
        ) : null}
      </ul>
    </article>
  )
}
