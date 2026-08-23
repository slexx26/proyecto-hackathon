import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { providerKindLabels, type Provider } from '@/types/provider'
import { Icon } from '@/components/ui/Icon'
import { cn } from '@/utils/cn'
import { ProviderMark } from './ProviderMark'
import { useTranslation } from '@/i18n/languageContext'

/**
 * Insignia de verificación. Dice lo que significa, no más: que ADAPTA
 * comprobó que el negocio existe y ofrece lo que dice. No es una reseña ni
 * una valoración de calidad, y no debe leerse como tal.
 */
export function VerifiedBadge() {
  const { t } = useTranslation()

  return (
    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-fit-high-soft px-2.5 py-1 text-xs font-semibold text-fit-high-ink ring-1 ring-inset ring-fit-high/25">
      <Icon name="verified" className="h-3.5 w-3.5" />{t('provider.verified')}</span>
  )
}

interface ProviderCardProps {
  provider: Provider
  /** Cuántos productos suyos hay en el catálogo. Opcional. */
  productCount?: number
  index?: number
}

export function ProviderCard({
  provider,
  productCount,
  index = 0,
}: ProviderCardProps) {
  const { t } = useTranslation()

  const featured = provider.plan === 'featured'

  return (
    <article
      style={{ '--i': index } as CSSProperties}
      className={cn(
        'group animate-rise stagger hover-lift relative flex h-full flex-col gap-4 overflow-hidden rounded-card bg-surface p-5 shadow-card ring-1',
        // El plan destacado se nota, pero sin gritar ni empujar al resto fuera.
        featured ? 'ring-2 ring-accent' : 'ring-line',
      )}
    >
      {featured ? (
        <span className="absolute right-0 top-0 rounded-bl-card bg-accent-soft px-3 py-1 text-xs font-semibold text-accent-ink">{t('providerPlan.featured')}</span>
      ) : null}

      <div className="flex items-start gap-3.5">
        <ProviderMark name={provider.name} kind={provider.kind} />
        <div className="min-w-0 pt-0.5">
          <h3 className="font-display text-lg font-bold leading-snug text-ink">
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
      </div>

      {provider.verified ? (
        <div>
          <VerifiedBadge />
        </div>
      ) : null}

      <p className="text-sm text-ink-muted">{provider.description}</p>

      <ul className="mt-auto grid gap-1.5 border-t border-line pt-3 text-sm text-ink-muted">
        <li className="flex items-center gap-2">
          <Icon name="pin" className="h-4 w-4 text-ink-muted/70" />
          {provider.location}
        </li>
        <li className="flex items-center gap-2">
          <Icon name="ship" className="h-4 w-4 text-ink-muted/70" />
          {provider.shipsNationwide
            ? t('provider.shipsNationwide')
            : t('provider.inPersonOnly')}
        </li>
        {productCount !== undefined ? (
          <li className="flex items-center gap-2">
            <Icon name="store" className="h-4 w-4 text-ink-muted/70" />
            {productCount}{' '}
            {productCount === 1 ? 'producto listado' : 'productos listados'}
          </li>
        ) : null}
      </ul>
    </article>
  )
}
