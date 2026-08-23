import { useTranslation } from '@/i18n/languageContext'

/**
 * Primer elemento enfocable de la página. Permite saltar la navegación con
 * el teclado (WCAG 2.4.1). Invisible hasta que recibe foco.
 */
export function SkipLink() {
  const { t } = useTranslation()

  return (
    <a
      href="#contenido"
      className="sr-only-focusable absolute left-4 top-4 z-50 rounded-full bg-brand-800 px-5 py-3 font-semibold text-white"
    >
      {t('common.skipToContent')}
    </a>
  )
}
