import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { ButtonLink } from '@/components/ui/Button'
import { cn } from '@/utils/cn'

const links = [
  { to: '/find-my-fit', label: 'Find My Fit' },
  { to: '/recommendations', label: 'Recomendaciones' },
  { to: '/marketplace', label: 'Catálogo' },
]

function linkClass({ isActive }: { isActive: boolean }): string {
  return cn(
    'rounded-full px-4 py-2 text-sm font-medium transition-colors',
    isActive
      ? 'bg-brand-50 text-brand-800'
      : 'text-ink-muted hover:bg-surface-muted hover:text-ink',
  )
}

export function SiteHeader() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link
          to="/"
          className="text-lg font-bold tracking-tight text-brand-800"
          onClick={() => setOpen(false)}
        >
          ADAPTA
        </Link>

        {/* Navegación de escritorio */}
        <nav aria-label="Principal" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {links.map((link) => (
              <li key={link.to}>
                <NavLink to={link.to} className={linkClass}>
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden md:block">
          <ButtonLink to="/find-my-fit">Empezar</ButtonLink>
        </div>

        {/* Disparador móvil */}
        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full text-ink md:hidden"
          aria-expanded={open}
          aria-controls="menu-movil"
          onClick={() => setOpen((value) => !value)}
        >
          <span className="sr-only">
            {open ? 'Cerrar menú' : 'Abrir menú'}
          </span>
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            {open ? (
              <>
                <path d="M6 6l12 12" />
                <path d="M18 6L6 18" />
              </>
            ) : (
              <>
                <path d="M4 7h16" />
                <path d="M4 12h16" />
                <path d="M4 17h16" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Navegación móvil. Se desmonta al cerrar para no dejar foco atrapado. */}
      {open ? (
        <nav
          id="menu-movil"
          aria-label="Principal (móvil)"
          className="border-t border-line bg-surface md:hidden"
        >
          <ul className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3">
            {links.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  className={({ isActive }) =>
                    cn(
                      'block rounded-xl px-4 py-3 font-medium',
                      isActive
                        ? 'bg-brand-50 text-brand-800'
                        : 'text-ink hover:bg-surface-muted',
                    )
                  }
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
            <li className="pt-2">
              <ButtonLink
                to="/find-my-fit"
                className="w-full"
                size="lg"
                onClick={() => setOpen(false)}
              >
                Empezar
              </ButtonLink>
            </li>
          </ul>
        </nav>
      ) : null}
    </header>
  )
}
