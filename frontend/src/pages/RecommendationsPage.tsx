import { useCallback, useMemo, useState } from 'react'
import { fetchRecommendations } from '@/services/api/recommendations'
import { useAsync } from '@/hooks/useAsync'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useFitProfile } from '@/store/fitProfileContext'
import { needLabels } from '@/utils/labels'
import { ButtonLink } from '@/components/ui/Button'
import { EmptyState, ErrorState, LoadingState } from '@/components/ui/states'
import { RecommendationCard } from '@/components/recommendations/RecommendationCard'

/**
 * Sección 9. Renderiza lo que devuelve el backend, en el orden que llega.
 * Aquí no se calcula ni se reordena el score: el único filtro es un umbral
 * de visualización que la persona controla.
 */
export function RecommendationsPage() {
  useDocumentTitle('Tus recomendaciones')
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

  // Sin perfil no hay nada que pedir: mandamos a Find My Fit.
  if (!profile) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <EmptyState
          title="Todavía no tenemos tu perfil"
          description="Necesitamos saber cómo te vestís para poder calcular la compatibilidad de cada prenda."
          action={<ButtonLink to="/find-my-fit">Completar Find My Fit</ButtonLink>}
        />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          Tus recomendaciones
        </h1>
        <p className="mt-3 max-w-prose text-lg text-ink-muted">
          Ordenadas por compatibilidad con tu perfil. El puntaje lo calcula
          nuestro motor con reglas fijas; la IA solo lo explica.
        </p>

        <ul className="mt-5 flex flex-wrap gap-2">
          {profile.needs.map((need) => (
            <li
              key={need}
              className="rounded-full bg-brand-50 px-3 py-1 text-sm font-medium text-brand-800"
            >
              {needLabels[need]}
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-wrap items-center gap-4">
          <ButtonLink to="/find-my-fit" variant="secondary">
            Ajustar mi perfil
          </ButtonLink>

          <label className="flex items-center gap-2.5 text-sm font-medium text-ink">
            <input
              type="checkbox"
              checked={onlyGoodFits}
              onChange={(event) => setOnlyGoodFits(event.target.checked)}
              className="h-5 w-5 accent-brand-700"
            />
            Mostrar solo las que encajan bien
          </label>
        </div>
      </header>

      <div className="mt-10">
        {status === 'loading' ? (
          <LoadingState label="Calculando compatibilidad…" count={6} />
        ) : null}

        {status === 'error' ? (
          <ErrorState
            message={error ?? 'Error desconocido.'}
            onRetry={() => setReloadToken((value) => value + 1)}
          />
        ) : null}

        {status === 'success' && visible.length === 0 ? (
          <EmptyState
            title="Ninguna prenda supera el umbral"
            description={
              onlyGoodFits
                ? 'Probá quitando el filtro: hay prendas con compatibilidad parcial que se pueden adaptar.'
                : 'No encontramos prendas para este perfil. Probá marcando menos categorías preferidas.'
            }
            action={<ButtonLink to="/find-my-fit">Ajustar mi perfil</ButtonLink>}
          />
        ) : null}

        {status === 'success' && visible.length > 0 ? (
          <>
            <p aria-live="polite" className="mb-5 text-sm text-ink-muted">
              {visible.length}{' '}
              {visible.length === 1 ? 'prenda encontrada' : 'prendas encontradas'}
            </p>
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {visible.map((recommendation) => (
                <li key={recommendation.product.id}>
                  <RecommendationCard recommendation={recommendation} />
                </li>
              ))}
            </ul>
          </>
        ) : null}
      </div>
    </div>
  )
}
