import { useNavigate } from 'react-router-dom'
import type { FitProfile } from '@/types/fit-profile'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useFitProfile } from '@/store/fitProfileContext'
import { FitProfileForm } from '@/features/fit-profile/FitProfileForm'

/**
 * Sección 8. El formulario guarda el perfil y navega a resultados; la
 * petición de recomendaciones la dispara la página de destino, para que
 * recargar `/recommendations` siga funcionando.
 */
export function FindMyFitPage() {
  useDocumentTitle('Find My Fit')
  const navigate = useNavigate()
  const { profile, saveProfile } = useFitProfile()

  function handleSubmit(next: FitProfile) {
    saveProfile(next)
    navigate('/recommendations')
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          Find My Fit
        </h1>
        <p className="mt-3 max-w-prose text-lg text-ink-muted">
          Contanos cómo te vestís hoy. Preguntamos por barreras concretas, no
          por diagnósticos: no necesitamos saber tu condición, ni tu edad, ni
          tus medidas.
        </p>
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
