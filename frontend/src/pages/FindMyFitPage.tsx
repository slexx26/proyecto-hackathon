import { useNavigate } from 'react-router-dom'
import type { FitProfile } from '@/types/fit-profile'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useFitProfile } from '@/store/fitProfileContext'
import { FitProfileForm } from '@/features/fit-profile/FitProfileForm'
import { Icon } from '@/components/ui/Icon'
import { useTranslation } from '@/i18n/languageContext'

/**
 * Sección 8. El formulario guarda el perfil y navega a resultados; la
 * petición de recomendaciones la dispara la página de destino, para que
 * recargar `/recommendations` siga funcionando.
 */

/** Lo que NO preguntamos. Claves: el texto se resuelve al renderizar. */
const noPedimos = ['fit.noAsk1', 'fit.noAsk2', 'fit.noAsk3'] as const

export function FindMyFitPage() {
  const { t } = useTranslation()

  useDocumentTitle(t('fit.docTitle'))
  const navigate = useNavigate()
  const { profile, saveProfile } = useFitProfile()

  function handleSubmit(next: FitProfile) {
    saveProfile(next)
    navigate('/recommendations')
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <header className="animate-rise">
        <p className="inline-flex items-center gap-2 rounded-full bg-brand-soft px-3.5 py-1.5 text-sm font-semibold text-brand-ink ring-1 ring-brand-line">
          <Icon name="spark" className="h-4 w-4" />{t('fit.docTitle')}</p>

        <h1 className="text-hero mt-5 font-display font-extrabold text-ink">{t('fit.h1')}</h1>

        <p className="mt-5 max-w-prose text-lg text-ink-muted">{t('fit.lead')}</p>

        {/* Decir qué NO se pregunta baja la guardia antes del primer campo.
            Es la objeción más razonable que puede tener alguien a quien
            históricamente le han pedido su historia clínica para todo. */}
        <ul className="mt-6 grid gap-2 rounded-card bg-surface-muted p-4 sm:grid-cols-3">
          {noPedimos.map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm text-ink-muted">
              <Icon name="close" className="mt-0.5 h-4 w-4 shrink-0 text-ink-muted" />
              {t(item)}
            </li>
          ))}
        </ul>
      </header>

      <div className="mt-10">
        <FitProfileForm
          initialProfile={profile}
          submitting={false}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  )
}
