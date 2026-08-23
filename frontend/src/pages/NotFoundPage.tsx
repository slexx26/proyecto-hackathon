import { ButtonLink } from '@/components/ui/Button'
import { SpotIllustration } from '@/components/illustrations/SpotIllustration'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useTranslation } from '@/i18n/languageContext'

export function NotFoundPage() {
  const { t } = useTranslation()

  useDocumentTitle(t('notFound.docTitle'))

  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
      <SpotIllustration name="lost" className="mx-auto h-40 w-auto" />
      <p className="mt-6 text-sm font-bold uppercase tracking-[0.08em] text-ink-muted">{t('notFound.code')}</p>
      <h1 className="text-section mt-3 font-display font-extrabold text-ink">{t('notFound.title')}</h1>
      <p className="mx-auto mt-4 max-w-prose text-ink-muted">{t('notFound.body')}</p>
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <ButtonLink to="/">{t('notFound.home')}</ButtonLink>
        <ButtonLink to="/marketplace" variant="secondary">{t('notFound.catalog')}</ButtonLink>
      </div>
    </div>
  )
}
