import { ButtonLink } from '@/components/ui/Button'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

export function NotFoundPage() {
  useDocumentTitle('Página no encontrada')

  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
      <p className="text-sm font-bold uppercase tracking-wide text-brand-600">
        Error 404
      </p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
        Esta página no existe
      </h1>
      <p className="mx-auto mt-4 max-w-prose text-ink-muted">
        Puede que el enlace esté mal escrito o que la prenda ya no esté en el
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
