export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-line bg-surface-muted">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <p className="text-lg font-bold text-brand-800">ADAPTA</p>
        <p className="mt-1 text-sm text-ink-muted">
          Fashion should adapt to you.
        </p>

        <p className="mt-6 max-w-prose text-sm text-ink-muted">
          Proyecto de hackathon. El catálogo, las marcas y los precios son
          ficticios y existen solo para la demostración. ADAPTA no da consejo
          médico ni sustituye la valoración de un profesional de la salud.
        </p>

        <p className="mt-6 text-xs text-ink-muted">
          Hecho por Slater, José e Isaac · 2026
        </p>
      </div>
    </footer>
  )
}
