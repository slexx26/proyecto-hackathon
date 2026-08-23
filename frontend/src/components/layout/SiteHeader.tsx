import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { ButtonLink } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { cn } from '@/utils/cn'
import { BrandMark } from './BrandMark'

const links = [
  { to: '/find-my-fit', label: 'Find My Fit' },
  { to: '/recommendations', label: 'Recomendaciones' },
  { to: '/marketplace', label: 'Catálogo' },
  { to: '/providers', label: 'Negocios' },
]

function linkClass({ isActive }: { isActive: boolean }): string {
  return cn(
    'relative inline-flex min-h-11 items-center rounded-full px-3.5 text-sm font-semibold transition-colors duration-200 ease-(--ease-out-strong) lg:px-4',
    isActive
      ? 'bg-brand-soft text-brand-ink'
      : 'text-ink-muted hover:bg-surface-muted hover:text-ink',
  )
}

export function SiteHeader() {
  const [open, setOpen] = useState(false)

  // Escape cierra, como cualquier panel superpuesto.
  useEffect(() => {
    if (!open) return
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open])

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-canvas/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2.5 sm:px-6">
        <Link
          to="/"
          className="inline-flex min-h-11 items-center gap-2.5 rounded-xl py-1 pr-2"
          onClick={() => setOpen(false)}
        >
          <BrandMark />
          <span className="font-display text-xl font-extrabold tracking-tight text-ink">
            ADAPTA
          </span>
          <span className="sr-only">— inicio</span>
        </Link>

        {/* Navegación de escritorio */}
        <nav aria-label="Principal" className="hidden md:block">
          <ul className="flex items-center gap-0.5">
            {links.map((link) => (
              <li key={link.to}>
                <NavLink to={link.to} className={linkClass}>
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-1.5">
          <ThemeToggle />
          <div className="hidden md:block">
            <ButtonLink to="/find-my-fit">Empezar</ButtonLink>
          </div>

          {/* Disparador móvil */}
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full text-ink transition-[background-color,transform] duration-200 hover:bg-surface-muted active:scale-95 md:hidden"
            aria-expanded={open}
            aria-controls="menu-movil"
            onClick={() => setOpen((value) => !value)}
          >
            <span className="sr-only">{open ? 'Cerrar menú' : 'Abrir menú'}</span>
            <Icon name={open ? 'close' : 'menu'} className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Navegación móvil. Se desmonta al cerrar para no dejar foco atrapado. */}
      {open ? (
        <nav
          id="menu-movil"
          aria-label="Principal (móvil)"
          className="animate-rise border-t border-line bg-surface md:hidden"
        >
          <ul className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3">
            {links.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  className={({ isActive }) =>
                    cn(
                      'flex min-h-12 items-center rounded-field px-4 font-semibold transition-colors',
                      isActive
                        ? 'bg-brand-soft text-brand-ink'
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
