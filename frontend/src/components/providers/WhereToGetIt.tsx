import { Link } from 'react-router-dom'
import { providerKindLabels, type Provider } from '@/types/provider'
import { VerifiedBadge } from './ProviderCard'

/**
 * El final del recorrido.
 *
 * Una recomendación que no dice dónde conseguir el producto no resuelve nada:
 * la persona vuelve a quedarse buscando. Por eso este bloque aparece en la
 * tarjeta de recomendación y en el detalle, no escondido en otra pantalla.
 *
 * ADAPTA no vende ni cobra a la persona: deriva al negocio.
 */
export function WhereToGetIt({ provider }: { provider: Provider }) {
  return (
    <section className="rounded-card bg-brand-50 p-5 ring-1 ring-brand-200">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-brand-800">
        Dónde conseguirlo
      </h3>

      <div className="mt-2 flex flex-wrap items-center gap-2">
        <Link
          to={`/providers/${provider.id}`}
          className="font-semibold text-ink underline underline-offset-4"
        >
          {provider.name}
        </Link>
        {provider.verified ? <VerifiedBadge /> : null}
      </div>

      <p className="mt-1 text-sm text-ink-muted">
        {providerKindLabels[provider.kind]} · {provider.location}
        {provider.shipsNationwide ? ' · Envía a todo el país' : ''}
      </p>

      {!provider.shipsNationwide ? (
        <p className="mt-2 text-sm text-ink">
          Atiende solo de forma presencial. Conviene llamar antes de ir.
        </p>
      ) : null}

      <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm">
        {provider.contact.website ? (
          <li>
            <a
              href={provider.contact.website}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-brand-700 underline underline-offset-4"
            >
              Sitio web
              <span className="sr-only"> de {provider.name}, se abre en una pestaña nueva</span>
            </a>
          </li>
        ) : null}
        {provider.contact.phone ? (
          <li className="text-ink-muted">{provider.contact.phone}</li>
        ) : null}
        {provider.contact.email ? (
          <li className="text-ink-muted">{provider.contact.email}</li>
        ) : null}
      </ul>
    </section>
  )
}
