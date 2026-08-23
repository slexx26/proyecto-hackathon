import { Link } from 'react-router-dom'
import { Icon } from '@/components/ui/Icon'
import { useTranslation } from '@/i18n/languageContext'
import { Wordmark } from './Wordmark'

const columns = [
  {
    title: 'footer.forYou',
    links: [
      { to: '/find-my-fit', key: 'nav.findMyFit' },
      { to: '/recommendations', key: 'footer.yourRecommendations' },
      { to: '/marketplace', key: 'footer.fullCatalog' },
    ],
  },
  {
    title: 'footer.forBusiness',
    links: [
      { to: '/providers', key: 'footer.directory' },
      { to: '/for-business', key: 'footer.listBusiness' },
    ],
  },
] as const

export function SiteFooter() {
  const { t } = useTranslation()

  return (
    <footer className="mt-24 border-t border-line bg-surface-muted">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <Wordmark className="h-6 w-auto text-ink" />
              <p className="sr-only">ADAPTA</p>
            </div>
            <p className="mt-2 text-ink-muted">{t('footer.tagline')}</p>

            <p className="mt-5 max-w-prose text-sm text-ink-muted">
              {t('footer.blurb')}
            </p>
          </div>

          {columns.map((column) => (
            <nav key={column.title} aria-label={t(column.title)}>
              <h2 className="text-sm font-bold uppercase tracking-[0.08em] text-ink">
                {t(column.title)}
              </h2>
              <ul className="mt-3 space-y-1">
                {column.links.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="inline-flex min-h-11 items-center text-ink-muted underline-offset-4 transition-colors hover:text-ink hover:underline"
                    >
                      {t(link.key)}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <p className="mt-8 flex items-start gap-2 rounded-card bg-surface px-4 py-3 text-sm text-ink-muted ring-1 ring-line">
          <Icon name="info" className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{t('footer.disclaimer')}</span>
        </p>

        <p className="mt-6 text-xs text-ink-muted">{t('footer.credits')}</p>
      </div>
    </footer>
  )
}
