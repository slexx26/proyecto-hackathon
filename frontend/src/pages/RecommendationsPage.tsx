import { useCallback, useMemo, useState, type CSSProperties } from 'react'
import { fetchRecommendations } from '@/services/api/recommendations'
import { useAsync } from '@/hooks/useAsync'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useFitProfile } from '@/store/fitProfileContext'
import { needLabels } from '@/utils/labels'
import { ButtonLink } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { EmptyState, ErrorState, LoadingState } from '@/components/ui/states'
import { RecommendationCard } from '@/components/recommendations/RecommendationCard'
import { useTranslation } from '@/i18n/languageContext'

/**
 * Sección 9. Renderiza lo que devuelve el backend, en el orden que llega.
 * Aquí no se calcula ni se reordena el score: el único filtro es un umbral
 * de visualización que la persona controla.
 */
export function RecommendationsPage() {
  const { t } = useTranslation()

  useDocumentTitle(t('reco.docTitle'))
  const { profile } = useFitProfile()
  const [onlyGoodFits, setOnlyGoodFits] = useState(false)
  const [reloadToken, setReloadToken] = useState(0)

  // La clave identifica la petición: perfil + intento de recarga.
  const requestKey = useMemo(
    () => `${JSON.stringify(profile ?? null)}#${reloadToken}`,
    [profile, reloadToken],
  )

  const run = useCallback(
    (signal: AbortSignal) =>
      profile
        ? fetchRecommendations(profile, signal)
        : Promise.reject(new Error('Sin perfil.')),
    [profile],
  )

  const { status, data, error } = useAsync(run, requestKey, profile !== undefined)

  const visible = useMemo(() => {
    const all = data?.recommendations ?? []
    return onlyGoodFits ? all.filter((item) => item.score >= 60) : all
  }, [data, onlyGoodFits])

  const hidden = (data?.recommendations.length ?? 0) - visible.length

  // Sin perfil no hay nada que pedir: mandamos a Find My Fit.
  if (!profile) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <EmptyState
          spot="profile"
          title={t('reco.noProfileTitle')}
          description={t('reco.noProfileBody')}
          action={
            <ButtonLink to="/find-my-fit" size="lg">{t('reco.noProfileCta')}<Icon name="arrow-right" className="h-5 w-5" />
            </ButtonLink>
          }
        />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <header className="animate-rise">
        <h1 className="text-hero font-display font-extrabold text-ink">{t('reco.docTitle')}</h1>
        <p className="mt-5 max-w-2xl text-lg text-ink-muted">{t('reco.lead')}</p>

        <div className="mt-8 rounded-panel bg-surface-muted p-5 ring-1 ring-line">
          <h2 className="text-sm font-bold uppercase tracking-[0.08em] text-ink-muted">{t('reco.profileTitle')}</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {profile.needs.map((need, index) => (
              <li
                key={need}
                style={{ '--i': index } as CSSProperties}
                className="animate-pop stagger rounded-full bg-brand-soft px-3 py-1.5 text-sm font-semibold text-brand-ink ring-1 ring-brand-line"
              >
                {needLabels[need]}
              </li>
            ))}
          </ul>

          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-line pt-4">
            <ButtonLink to="/find-my-fit" variant="secondary">{t('reco.adjust')}</ButtonLink>

            <label className="flex min-h-11 cursor-pointer items-center gap-2.5 text-sm font-semibold text-ink">
              <input
                type="checkbox"
                checked={onlyGoodFits}
                onChange={(event) => setOnlyGoodFits(event.target.checked)}
                className="h-5 w-5 cursor-pointer"
              />{t('reco.onlyGood')}<span className="text-ink-muted">{t('reco.onlyGoodHint')}</span>
            </label>
          </div>
        </div>
      </header>

      <div className="mt-10">
        {status === 'loading' ? (
          <LoadingState label={t('reco.loading')} count={6} />
        ) : null}

        {status === 'error' ? (
          <ErrorState
            message={error ?? t('error.unknown')}
            onRetry={() => setReloadToken((value) => value + 1)}
          />
        ) : null}

        {status === 'success' && visible.length === 0 ? (
          <EmptyState
            title={t('reco.emptyTitle')}
            description={
              onlyGoodFits
                ? t('reco.emptyFiltered')
                : t('reco.emptyAll')
            }
            action={<ButtonLink to="/find-my-fit">{t('reco.adjust')}</ButtonLink>}
          />
        ) : null}

        {status === 'success' && visible.length > 0 ? (
          <>
            {/* Zona de resultados: los cambios de recuento se anuncian. */}
            <p
              aria-live="polite"
              className="mb-5 flex flex-wrap items-center gap-x-2 text-sm text-ink-muted"
            >
              <span className="font-semibold text-ink">
                {visible.length}{' '}
                {visible.length === 1
                  ? 'producto encontrado'
                  : 'productos encontrados'}
              </span>
              {hidden > 0 ? (
                <span>
                  · {hidden} {hidden === 1 ? 'oculto' : 'ocultos'} por el filtro
                </span>
              ) : null}
            </p>

            <ul className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
              {visible.map((recommendation, index) => (
                <li key={recommendation.product.id}>
                  <RecommendationCard
                    recommendation={recommendation}
                    index={index}
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
