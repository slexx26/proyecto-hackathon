import { Link } from 'react-router-dom'
import { providerKindLabels, type Provider } from '@/types/provider'
import { Icon } from '@/components/ui/Icon'
import { VerifiedBadge } from './ProviderCard'
import { ProviderMark } from './ProviderMark'

/**
 * El final del recorrido.
 *
 * Una recomendación que no dice dónde conseguir el producto no resuelve nada:
 * la persona vuelve a quedarse buscando. Por eso este bloque aparece en la
 * tarjeta de recomendación y en el detalle, no escondido en otra pantalla.
 *
 * ADAPTA no vende ni cobra a la persona: deriva al negocio.
 */
interface WhereToGetItProps {
  provider: Provider
  /**
   * Nivel del encabezado. El bloque vive en dos sitios con jerarquías
   * distintas —bajo el `h1` del detalle y bajo el `h3` de una tarjeta de
   * recomendación—, y un nivel fijo saltaba de `h1` a `h3`. Quien navega
   * por encabezados con un lector de pantalla nota ese salto enseguida.
   */
  level?: 2 | 4
}

export function WhereToGetIt({ provider, level = 4 }: WhereToGetItProps) {
  const Heading = level === 2 ? 'h2' : 'h4'

  return (
    <section className="rounded-card bg-brand-soft p-4 ring-1 ring-brand-line">
      <Heading className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.08em] text-brand-ink">
        <Icon name="pin" className="h-4 w-4" />
        Dónde conseguirlo
      </Heading>

      <div className="mt-3 flex items-start gap-3">
        <ProviderMark name={provider.name} kind={provider.kind} />
        <div className="min-w-0">
          <Link
            to={`/providers/${provider.id}`}
            className="inline-flex min-h-11 items-center font-display font-bold text-ink underline decoration-brand-line decoration-2 underline-offset-4 hover:decoration-action"
          >
            {provider.name}
          </Link>
          <p className="text-sm text-ink-muted">
            {providerKindLabels[provider.kind]} · {provider.location}
          </p>
          {provider.verified ? (
            <div className="mt-2">
              <VerifiedBadge />
            </div>
          ) : null}
        </div>
      </div>

      <p className="mt-3 flex items-start gap-2 text-sm text-ink">
        <Icon name="ship" className="mt-0.5 h-4 w-4 shrink-0 text-ink-muted" />
        {provider.shipsNationwide
          ? 'Envía a todo el país.'
          : 'Atiende solo de forma presencial. Conviene llamar antes de ir.'}
      </p>

      <ul className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
        {provider.contact.website ? (
          <li>
            <a
              href={provider.contact.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-1.5 font-semibold text-brand-ink underline underline-offset-4"
            >
              <Icon name="globe" className="h-4 w-4" />
              Sitio web
              <span className="sr-only">
                {' '}
                de {provider.name}, se abre en una pestaña nueva
              </span>
              <Icon name="external" className="h-3.5 w-3.5" />
            </a>
          </li>
        ) : null}
        {provider.contact.phone ? (
          <li>
            <a
              href={`tel:${provider.contact.phone.replace(/\s/g, '')}`}
              className="inline-flex min-h-11 items-center gap-1.5 text-ink-muted underline underline-offset-4"
            >
              <Icon name="phone" className="h-4 w-4" />
              {provider.contact.phone}
            </a>
          </li>
        ) : null}
        {provider.contact.email ? (
          <li>
            <a
              href={`mailto:${provider.contact.email}`}
              className="inline-flex min-h-11 items-center gap-1.5 text-ink-muted underline underline-offset-4"
            >
              <Icon name="mail" className="h-4 w-4" />
              {provider.contact.email}
            </a>
          </li>
        ) : null}
      </ul>
    </section>
  )
}
