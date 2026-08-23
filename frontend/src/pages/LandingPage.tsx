import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { ButtonLink } from '@/components/ui/Button'
import { Icon, type IconName } from '@/components/ui/Icon'
import { ScoreBadge } from '@/components/recommendations/ScoreBadge'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useTranslation } from '@/i18n/languageContext'
import type { TranslationKey } from '@/i18n/dictionaries'
import { useReducedMotion } from '@/hooks/useReducedMotion'

/**
 * Las tres fotos del hero. Para cambiarlas alcanza con reemplazar los archivos
 * en `public/` conservando el nombre: el componente toma de acá cuántas hay.
 *
 * Si cambiás una foto, REESCRIBÍ SU `alt`. Un alt que describe otra imagen es
 * peor que no tener alt: quien usa lector de pantalla se queda con una
 * descripción falsa y no tiene forma de saberlo.
 *
 * Al cambiarlas, verificá también el contraste del titular sobre la primera:
 * es la única que lleva texto encima, y se apoya sobre su mitad izquierda.
 */
const heroImages: ReadonlyArray<{
  src: string
  /** Clave del diccionario: la descripción también se traduce. */
  alt: TranslationKey
  /** Ajuste fino de encuadre. Positivo baja la imagen, negativo la sube. */
  shift?: string
}> = [
  { src: '/hero-1.png', alt: 'hero.photo1Alt' },
  { src: '/hero-2.png', alt: 'hero.photo2Alt' },
  { src: '/hero-3.png', alt: 'hero.photo3Alt' },
]

/**
 * Sección 7. La landing tiene un solo trabajo: explicar el problema y
 * llevar a Find My Fit. No es un escaparate de tienda.
 *
 * Sección 40: la landing, la demostración y la presentación cuentan la misma
 * historia, y el diferenciador no es el catálogo sino el motor de
 * compatibilidad explicado. Por eso el motor tiene su propia sección con
 * diagrama, en vez de ser una viñeta más de una lista de virtudes.
 */

const catalogo = [
  { icon: 'shirt', key: 'landing.scopeApparel' },
  { icon: 'shoe', key: 'landing.scopeFootwear' },
  { icon: 'prosthesis', key: 'landing.scopeProsthetics' },
  { icon: 'wheelchair', key: 'landing.scopeMobility' },
  { icon: 'spoon', key: 'landing.scopeDaily' },
  { icon: 'scissors', key: 'landing.scopeWorkshops' },
] as const satisfies ReadonlyArray<{ icon: IconName; key: TranslationKey }>

const steps = [
  { number: '01', title: 'landing.step1Title', body: 'landing.step1Body' },
  { number: '02', title: 'landing.step2Title', body: 'landing.step2Body' },
  { number: '03', title: 'landing.step3Title', body: 'landing.step3Body' },
] as const satisfies ReadonlyArray<{
  number: string
  title: TranslationKey
  body: TranslationKey
}>

const values = [
  { title: 'landing.value1Title', body: 'landing.value1Body', icon: 'info' },
  { title: 'landing.value2Title', body: 'landing.value2Body', icon: 'scissors' },
  { title: 'landing.value3Title', body: 'landing.value3Body', icon: 'store' },
  { title: 'landing.value4Title', body: 'landing.value4Body', icon: 'verified' },
] as const satisfies ReadonlyArray<{
  title: TranslationKey
  body: TranslationKey
  icon: IconName
}>

/**
 * Diagrama del motor. Es la idea central del proyecto, así que se dibuja en
 * vez de describirse: quién calcula el número y quién solo lo explica.
 */
function EngineDiagram() {
  const { t } = useTranslation()
  const nodes = [
    { label: 'landing.engineNode1', tone: 'brand' },
    { label: 'landing.engineNode2', tone: 'brand' },
    { label: 'landing.engineNode3', tone: 'score' },
    { label: 'landing.engineNode4', tone: 'accent' },
  ] as const satisfies ReadonlyArray<{ label: TranslationKey; tone: string }>

  return (
    <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {nodes.map((node, index) => (
        <li
          key={node.label}
          style={{ '--i': index } as CSSProperties}
          className="animate-rise stagger relative flex items-center gap-3 rounded-card bg-surface p-4 ring-1 ring-line"
        >
          <span
            className={
              node.tone === 'accent'
                ? 'grid h-9 w-9 shrink-0 place-items-center rounded-full bg-accent-soft text-sm font-bold text-accent-ink'
                : node.tone === 'score'
                  ? 'grid h-9 w-9 shrink-0 place-items-center rounded-full bg-fit-high-soft text-sm font-bold text-fit-high-ink'
                  : 'grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-soft text-sm font-bold text-brand-ink'
            }
          >
            {index + 1}
          </span>
          <span className="font-semibold text-ink">{t(node.label)}</span>
          {index < nodes.length - 1 ? (
            <Icon
              name="arrow-right"
              className="absolute -right-3 top-1/2 hidden h-5 w-5 -translate-y-1/2 text-line-strong lg:block"
            />
          ) : null}
        </li>
      ))}
    </ol>
  )
}

export function LandingPage() {
  const { t } = useTranslation()
  useDocumentTitle(t('landing.docTitle'))

  const [heroIndex, setHeroIndex] = useState(0)
  const reducedMotion = useReducedMotion()
  const trackRef = useRef<HTMLDivElement>(null)
  const pinRef = useRef<HTMLDivElement>(null)
  const panelRefs = useRef<(HTMLElement | null)[]>([])

  /**
   * Motor del hero.
   *
   * El scroll es el del navegador: no se intercepta, no se fuerza y la barra
   * nativa sigue funcionando. Lo único que hace este efecto es leer cuánto se
   * scrolleó y escribir dos variables CSS por panel dentro de un
   * requestAnimationFrame. Toda la animación es `transform` y `opacity`, que
   * el compositor resuelve sin recalcular layout.
   */
  useEffect(() => {
    const track = trackRef.current
    const pin = pinRef.current
    if (!track || !pin || reducedMotion) return

    let frame = 0

    const paint = () => {
      frame = 0
      const panelHeight = pin.offsetHeight
      const scrollable = track.offsetHeight - panelHeight
      if (scrollable <= 0 || panelHeight <= 0) return

      const stickyTop = parseFloat(getComputedStyle(pin).top) || 0
      const scrolled = Math.min(
        Math.max(stickyTop - track.getBoundingClientRect().top, 0),
        scrollable,
      )
      // 0 = primera foto entera · 1 = segunda entera · etc.
      const progress = scrolled / panelHeight

      panelRefs.current.forEach((panel, index) => {
        if (!panel) return
        const raw = index === 0 ? 1 : Math.min(Math.max(progress - (index - 1), 0), 1)
        // Suavizado: el recorrido sigue atado al dedo, pero entra y sale con
        // peso en vez de moverse a velocidad constante.
        const enter = raw * raw * (3 - 2 * raw)
        const exit = Math.min(Math.max(progress - index, 0), 1)

        panel.style.setProperty('--enter', enter.toFixed(4))
        panel.style.setProperty('--exit', exit.toFixed(4))
      })

      const next = Math.min(Math.max(Math.round(progress), 0), heroImages.length - 1)
      setHeroIndex((current) => (current === next ? current : next))
    }

    const onScroll = () => {
      if (frame) return
      frame = window.requestAnimationFrame(paint)
    }

    paint()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    // El riel cambia de alto cuando cargan las fotos o las tipografías, y sin
    // scroll de por medio no llegaría ningún evento: sin esto el primer
    // pintado se queda con medidas viejas.
    const observer = new ResizeObserver(onScroll)
    observer.observe(track)
    observer.observe(pin)
    return () => {
      if (frame) window.cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [reducedMotion])

  /** Salto directo a una foto, para quien prefiere no scrollear hasta ella. */
  const goToPanel = (index: number) => {
    const track = trackRef.current
    const pin = pinRef.current
    if (!track || !pin) return

    if (reducedMotion) {
      panelRefs.current[index]?.scrollIntoView({ behavior: 'auto', block: 'start' })
      return
    }
    window.scrollTo({ top: track.offsetTop + index * pin.offsetHeight, behavior: 'smooth' })
  }

  return (
    <>
      {/* ---------------------------------------------------------------
       * Hero
       * ------------------------------------------------------------- */}
      <section
        className="hero-stage"
        aria-roledescription="carrusel"
        aria-label={t('hero.carousel')}
      >
        <div
          className="hero-track"
          ref={trackRef}
          style={{ '--panels': heroImages.length } as CSSProperties}
        >
          <div className="hero-pin" ref={pinRef}>
            {heroImages.map((photo, index) => (
              <article
                key={photo.src}
                ref={(node) => {
                  panelRefs.current[index] = node
                }}
                className={`hero-panel${index === 0 ? '' : ' hero-panel--plain'}`}
                aria-roledescription="diapositiva"
                aria-label={t('hero.slide', {
                  index: index + 1,
                  total: heroImages.length,
                })}
              >
                <img
                  src={photo.src}
                  alt={t(photo.alt)}
                  className="hero-panel__photo"
                  style={{ '--photo-shift': photo.shift ?? '0%' } as CSSProperties}
                  loading={index === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                />
                {/* Scrim: garantiza el contraste del texto sobre la foto, y
                    se refuerza cuando el panel siguiente pasa por encima. */}
                <div aria-hidden="true" className="hero-panel__scrim" />

                {index === 0 ? (
              <div className="hero-panel__content relative mx-auto grid w-full max-w-6xl gap-12 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
                <div>
                  <p className="animate-fade inline-flex items-center gap-2 rounded-full bg-brand-soft px-3.5 py-1.5 text-sm font-semibold text-brand-ink ring-1 ring-brand-line">
                    <Icon name="spark" className="h-4 w-4" />{t('landing.eyebrow')}</p>

                  <h1 className="text-hero animate-rise mt-6 font-display font-extrabold text-ink">{t('landing.h1')}</h1>

                  <p
                    style={{ '--i': 1 } as CSSProperties}
                    className="animate-rise stagger mt-6 max-w-xl text-lg text-ink-muted"
                  >{t('landing.lead')}</p>

                  <div
                    style={{ '--i': 2 } as CSSProperties}
                    className="animate-rise stagger mt-8 flex flex-col gap-3 sm:flex-row"
                  >
                    <ButtonLink to="/find-my-fit" size="lg">{t('landing.ctaFit')}<Icon name="arrow-right" className="h-5 w-5" />
                    </ButtonLink>
                    <ButtonLink to="/marketplace" size="lg" variant="secondary">{t('landing.ctaCatalog')}</ButtonLink>
                  </div>

                  <p
                    style={{ '--i': 3 } as CSSProperties}
                    className="animate-rise stagger mt-4 flex items-center gap-2 text-sm text-ink-muted"
                  >
                    <Icon name="check" className="h-4 w-4 text-fit-high" />{t('landing.reassure')}</p>
                </div>

                {/* Muestra del resultado. Decorativa: todo lo que dice está
                    explicado en texto más abajo. */}
                <div
                  aria-hidden="true"
                  style={{ '--i': 2 } as CSSProperties}
                  className="animate-rise stagger relative"
                >
                  <div className="hero-stage__card rounded-panel bg-surface p-5 shadow-pop ring-1 ring-line sm:p-6">
                    <p className="text-xs font-bold uppercase tracking-[0.08em] text-ink-muted">{t('landing.previewLabel')}</p>

                    <div className="mt-4 flex items-start justify-between gap-4">
                      <div>
                        <p className="font-display text-lg font-bold text-ink">
                          Camisa Vera de cierre magnético
                        </p>
                        <p className="text-sm text-ink-muted">Vera Studio</p>
                      </div>
                      <ScoreBadge score={92} />
                    </div>

                    <ul className="mt-5 space-y-2.5 text-sm">
                      <li className="flex items-start gap-2.5">
                        <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-fit-high-soft text-fit-high-ink">
                          <Icon name="check" className="h-3.5 w-3.5" />
                        </span>
                        <span className="text-ink">{t('landing.previewReason1')}</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-fit-high-soft text-fit-high-ink">
                          <Icon name="check" className="h-3.5 w-3.5" />
                        </span>
                        <span className="text-ink">{t('landing.previewReason2')}</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-fit-low-soft text-fit-low-ink">
                          <Icon name="alert" className="h-3.5 w-3.5" />
                        </span>
                        <span className="text-ink-muted">{t('landing.previewReason3')}</span>
                      </li>
                    </ul>

                    <div className="mt-5 flex items-center gap-2.5 rounded-card bg-brand-soft px-4 py-3 ring-1 ring-brand-line">
                      <Icon name="pin" className="h-4 w-4 text-brand-ink" />
                      <p className="text-sm text-ink">
                        <span className="font-semibold">{t('landing.previewWhere')}</span> Vera
                        Studio · San José
                      </p>
                    </div>
                  </div>
                </div>
              </div>
                ) : null}
              </article>
            ))}

            {/* Índice. El scroll es el que mueve el hero; esto permite
                saltar de foto sin scrollear y da la referencia de dónde
                estás. */}
            <div className="hero-index">
              <ul className="flex items-center gap-1">
                {heroImages.map((photo, index) => (
                  <li key={photo.src}>
                    <button
                      type="button"
                      className={`hero-index__dot${index === heroIndex ? ' is-current' : ''}`}
                      onClick={() => goToPanel(index)}
                      aria-label={t('hero.goTo', {
                        index: index + 1,
                        total: heroImages.length,
                      })}
                      aria-current={index === heroIndex ? 'true' : undefined}
                    >
                      <span aria-hidden="true" />
                    </button>
                  </li>
                ))}
              </ul>
              <p className="sr-only-focusable" aria-live="polite">
                {t('hero.announce', {
                  index: heroIndex + 1,
                  total: heroImages.length,
                  alt: t(heroImages[heroIndex].alt),
                })}
              </p>
            </div>
          </div>

          {/* Anclas de scroll-snap: una por foto, para que cada gesto
              aterrice en una imagen completa. */}
          {heroImages.map((photo, index) => (
            <span
              key={`snap-${photo.src}`}
              aria-hidden="true"
              className="hero-snap"
              style={{ '--i': index } as CSSProperties}
            />
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------------------
       * Qué hay dentro. No son cifras inventadas: es el alcance real
       * del catálogo, que es lo que sorprende de este producto.
       * ------------------------------------------------------------- */}
      <section
        aria-labelledby="alcance"
        className="border-b border-line bg-surface-muted"
      >
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <h2
            id="alcance"
            className="text-sm font-bold uppercase tracking-[0.08em] text-ink-muted"
          >{t('landing.scopeTitle')}</h2>
          <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {catalogo.map((item, index) => (
              <li
                key={item.key}
                style={{ '--i': index } as CSSProperties}
                className="animate-rise stagger flex flex-col items-center gap-2 rounded-card bg-surface px-3 py-5 text-center ring-1 ring-line"
              >
                <Icon name={item.icon} className="h-7 w-7 text-brand-ink" />
                <span className="text-sm font-semibold text-ink">
                  {t(item.key)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------------------------------------------------------------
       * El problema, por sus dos lados. Es un mercado de dos lados y por
       * eso hay negocio: contarlo de un solo lado deja la mitad afuera.
       * ------------------------------------------------------------- */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="rounded-panel bg-inverse px-6 py-12 text-on-inverse sm:px-12 sm:py-16">
          <h2 className="max-w-3xl text-section font-display font-extrabold">{t('landing.problemTitle')}</h2>

          <div className="mt-10 grid gap-8 md:grid-cols-2">
            <div className="border-t border-on-inverse/25 pt-5">
              <h3 className="font-display text-lg font-bold text-on-inverse">{t('landing.problemPersonTitle')}</h3>
              <p className="mt-3 text-on-inverse-muted">{t('landing.problemPersonBody')}</p>
            </div>
            <div className="border-t border-on-inverse/25 pt-5">
              <h3 className="font-display text-lg font-bold text-on-inverse">{t('landing.problemBusinessTitle')}</h3>
              <p className="mt-3 text-on-inverse-muted">{t('landing.problemBusinessBody')}</p>
            </div>
          </div>

          <p className="mt-10 max-w-2xl border-l-2 border-accent pl-5 text-lg text-on-inverse">{t('landing.problemPull')}</p>
        </div>
      </section>

      {/* ---------------------------------------------------------------
       * Cómo funciona
       * ------------------------------------------------------------- */}
      <section
        aria-labelledby="como-funciona"
        className="mx-auto max-w-6xl px-4 pb-20 sm:px-6"
      >
        <h2
          id="como-funciona"
          className="text-section font-display font-extrabold text-ink"
        >{t('landing.howTitle')}</h2>

        <ol className="mt-10 grid gap-6 md:grid-cols-3">
          {steps.map((step, index) => (
            <li
              key={step.number}
              style={{ '--i': index } as CSSProperties}
              className="animate-rise stagger relative border-t-2 border-line pt-5"
            >
              {/* Sin tarjetas: una regla arriba y aire suficiente separan
                  igual de bien y pesan mucho menos en la página. */}
              <span
                aria-hidden="true"
                className="font-display text-4xl font-extrabold text-accent"
              >
                {step.number}
              </span>
              <h3 className="mt-2 font-display text-xl font-bold text-ink">
                {t(step.title)}
              </h3>
              <p className="mt-2 text-ink-muted">{t(step.body)}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ---------------------------------------------------------------
       * El diferenciador. Sección 40: es lo que distingue a ADAPTA, así
       * que se lleva su propio bloque y su diagrama.
       * ------------------------------------------------------------- */}
      <section
        aria-labelledby="motor"
        className="border-y border-line bg-surface-muted py-20"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.08em] text-brand-ink">{t('landing.engineEyebrow')}</p>
            <h2
              id="motor"
              className="mt-3 text-section font-display font-extrabold text-ink"
            >{t('landing.engineTitle')}</h2>
            <p className="mt-5 text-lg text-ink-muted">{t('landing.engineLead')}</p>
          </div>

          <div className="mt-10">
            <EngineDiagram />
          </div>

          <p className="mt-8 max-w-2xl rounded-card bg-surface px-5 py-4 text-ink-muted ring-1 ring-line">{t('landing.engineNote')}</p>
        </div>
      </section>

      {/* ---------------------------------------------------------------
       * Valores. Rejilla asimétrica: la primera ocupa el doble, porque es
       * la que sostiene la credibilidad del resto.
       * ------------------------------------------------------------- */}
      <section
        aria-labelledby="diferencias"
        className="mx-auto max-w-6xl px-4 py-20 sm:px-6"
      >
        <h2
          id="diferencias"
          className="text-section font-display font-extrabold text-ink"
        >{t('landing.valuesTitle')}</h2>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {values.map((value, index) => (
            <div
              key={value.title}
              style={{ '--i': index } as CSSProperties}
              // La primera y la última ocupan dos columnas: 2+1+1+2 llena
              // exactamente dos filas de tres y no deja una celda muerta.
              className={
                index === 0
                  ? 'animate-rise stagger rounded-card bg-brand-soft p-6 ring-1 ring-brand-line md:col-span-2'
                  : index === values.length - 1
                    ? 'animate-rise stagger rounded-card bg-surface p-6 shadow-card ring-1 ring-line md:col-span-2'
                    : 'animate-rise stagger rounded-card bg-surface p-6 shadow-card ring-1 ring-line'
              }
            >
              <Icon
                name={value.icon}
                className="h-7 w-7 text-brand-ink"
              />
              <h3 className="mt-3 font-display text-lg font-bold text-ink">
                {t(value.title)}
              </h3>
              <p className="mt-2 text-ink-muted">{t(value.body)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------------------
       * Cierre
       * ------------------------------------------------------------- */}
      <section className="mx-auto max-w-4xl px-4 pb-24 text-center sm:px-6">
        <h2 className="text-section font-display font-extrabold text-ink">{t('landing.closingTitle')}</h2>
        <p className="mx-auto mt-4 max-w-prose text-lg text-ink-muted">{t('landing.closingBody')}</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <ButtonLink to="/find-my-fit" size="lg">{t('landing.ctaFit')}<Icon name="arrow-right" className="h-5 w-5" />
          </ButtonLink>
          <ButtonLink to="/for-business" size="lg" variant="secondary">{t('landing.ctaBusiness')}</ButtonLink>
        </div>
      </section>
    </>
  )
}
