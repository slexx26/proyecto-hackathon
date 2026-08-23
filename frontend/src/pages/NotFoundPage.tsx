import { ButtonLink } from '@/components/ui/Button'
import { SpotIllustration } from '@/components/illustrations/SpotIllustration'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

export function NotFoundPage() {
  useDocumentTitle('Página no encontrada')

  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
      <SpotIllustration name="lost" className="mx-auto h-40 w-auto" />
      <p className="mt-6 text-sm font-bold uppercase tracking-[0.08em] text-ink-muted">
        Error 404
      </p>
      <h1 className="text-section mt-3 font-display font-extrabold text-ink">
        Esta página no existe
      </h1>
      <p className="mx-auto mt-4 max-w-prose text-ink-muted">
        Puede que el enlace esté mal escrito o que el producto ya no esté en el
        catálogo.
      </p>
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <ButtonLink to="/">Volver al inicio</ButtonLink>
        <ButtonLink to="/marketplace" variant="secondary">
          Ver el catálogo
        </ButtonLink>
      </div>
    </div>
  )
}
