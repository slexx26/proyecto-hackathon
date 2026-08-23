import { useNavigate } from 'react-router-dom'
import type { FitProfile } from '@/types/fit-profile'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useFitProfile } from '@/store/fitProfileContext'
import { FitProfileForm } from '@/features/fit-profile/FitProfileForm'
import { Icon } from '@/components/ui/Icon'

/**
 * Sección 8. El formulario guarda el perfil y navega a resultados; la
 * petición de recomendaciones la dispara la página de destino, para que
 * recargar `/recommendations` siga funcionando.
 */

const noPedimos = [
  'Tu diagnóstico o condición médica',
  'Tu edad ni tus medidas corporales',
  'Registro, correo ni contraseña',
]

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
      <header className="animate-rise">
        <p className="inline-flex items-center gap-2 rounded-full bg-brand-soft px-3.5 py-1.5 text-sm font-semibold text-brand-ink ring-1 ring-brand-line">
          <Icon name="spark" className="h-4 w-4" />
          Find My Fit
        </p>

        <h1 className="text-hero mt-5 font-display font-extrabold text-ink">
          Contanos cómo te vestís hoy.
        </h1>

        <p className="mt-5 max-w-prose text-lg text-ink-muted">
          Preguntamos por barreras concretas, no por diagnósticos. Con eso
          calculamos qué tan bien encaja cada producto del directorio y te
          decimos dónde conseguirlo.
        </p>

        {/* Decir qué NO se pregunta baja la guardia antes del primer campo.
            Es la objeción más razonable que puede tener alguien a quien
            históricamente le han pedido su historia clínica para todo. */}
        <ul className="mt-6 grid gap-2 rounded-card bg-surface-muted p-4 sm:grid-cols-3">
          {noPedimos.map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm text-ink-muted">
              <Icon name="close" className="mt-0.5 h-4 w-4 shrink-0 text-ink-muted" />
              {item}
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
