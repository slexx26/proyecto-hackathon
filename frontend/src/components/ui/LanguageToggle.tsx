import { useTranslation } from '@/i18n/languageContext'
import { cn } from '@/utils/cn'

/**
 * Cambio de idioma de la interfaz. Vive en la cabecera, al lado del control
 * de tema.
 *
 * Son dos botones y no un desplegable: con solo dos idiomas, un `select`
 * añade un paso (abrir, elegir, confirmar) para algo que se resuelve en un
 * toque. Cada uno lleva su nombre completo para el lector de pantalla —"ES"
 * a secas no dice nada— y el activo se marca con `aria-pressed`, no solo con
 * el color de fondo.
 */
export function LanguageToggle() {
  const { language, setLanguage, t } = useTranslation()

  return (
    <div
      role="group"
      aria-label={t('lang.groupLabel')}
      className="inline-flex items-center rounded-full bg-surface-muted p-0.5 ring-1 ring-line"
    >
      {(['es', 'en'] as const).map((code) => {
        const active = language === code
        return (
          <button
            key={code}
            type="button"
            lang={code}
            aria-pressed={active}
            onClick={() => setLanguage(code)}
            className={cn(
              'inline-flex h-10 min-w-10 items-center justify-center rounded-full px-2.5 text-sm font-bold transition-[background-color,color] duration-200 ease-(--ease-out-strong)',
              active
                ? 'bg-action text-on-action'
                : 'text-ink-muted hover:bg-surface hover:text-ink',
            )}
          >
            <span aria-hidden="true">{t(code === 'es' ? 'lang.esShort' : 'lang.enShort')}</span>
            <span className="sr-only">{t(code === 'es' ? 'lang.es' : 'lang.en')}</span>
          </button>
        )
      })}
    </div>
  )
}
