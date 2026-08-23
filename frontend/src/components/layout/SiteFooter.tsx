import { Link } from 'react-router-dom'
import { Icon } from '@/components/ui/Icon'
import { ThemeChoice } from '@/components/ui/ThemeToggle'
import { BrandMark } from './BrandMark'

const columns = [
  {
    title: 'Para vos',
    links: [
      { to: '/find-my-fit', label: 'Find My Fit' },
      { to: '/recommendations', label: 'Tus recomendaciones' },
      { to: '/marketplace', label: 'Catálogo completo' },
    ],
  },
  {
    title: 'Para tu negocio',
    links: [
      { to: '/providers', label: 'Directorio de negocios' },
      { to: '/for-business', label: 'Inscribí tu negocio' },
    ],
  },
]

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-line bg-surface-muted">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <BrandMark />
              <p className="font-display text-xl font-extrabold tracking-tight text-ink">
                ADAPTA
              </p>
            </div>
            <p className="mt-2 text-ink-muted">Fashion should adapt to you.</p>

            <p className="mt-5 max-w-prose text-sm text-ink-muted">
              Reunimos en un solo lugar a los negocios de moda y vida
              accesible, cruzamos tu forma real de vestirte con lo que ofrecen
              y te decimos a quién acudir.
            </p>
          </div>

          {columns.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <h2 className="text-sm font-bold uppercase tracking-[0.08em] text-ink">
                {column.title}
              </h2>
              <ul className="mt-3 space-y-1">
                {column.links.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="inline-flex min-h-11 items-center text-ink-muted underline-offset-4 transition-colors hover:text-ink hover:underline"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* El control completo de tema vive aquí porque incluye "seguir al
            sistema", que es la opción que un botón de dos estados no puede
            ofrecer. */}
        <div className="mt-10 flex flex-wrap items-center gap-4 border-t border-line pt-6">
          <p className="text-sm font-semibold text-ink">Apariencia</p>
          <ThemeChoice />
        </div>

        <p className="mt-8 flex items-start gap-2 rounded-card bg-surface px-4 py-3 text-sm text-ink-muted ring-1 ring-line">
          <Icon name="info" className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            Proyecto de hackathon. El catálogo, las marcas, los negocios y los
            precios son ficticios y existen solo para la demostración. ADAPTA
            no da consejo médico ni sustituye la valoración de un profesional
            de la salud.
          </span>
        </p>

        <p className="mt-6 text-xs text-ink-muted">2026</p>
      </div>
    </footer>
  )
}
