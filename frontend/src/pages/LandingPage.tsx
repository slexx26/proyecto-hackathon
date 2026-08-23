import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { ButtonLink } from '@/components/ui/Button'
import { Icon, type IconName } from '@/components/ui/Icon'
import { ScoreBadge } from '@/components/recommendations/ScoreBadge'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useReducedMotion } from '@/hooks/useReducedMotion'

/**
 * Las tres fotos del hero. Para cambiarlas alcanza con reemplazar los
 * archivos en `public/` conservando el nombre, o editar este arreglo: los
 * controles toman de acá cuántas hay.
 *
 * NOTA: son texturas provisorias. Al poner fotografías reales, actualizá el
 * `alt` y verificá de nuevo el contraste del texto sobre el scrim.
 */
const heroImages = [
  { src: '/hero-1.png', alt: 'Textura de seda dorada iluminada desde la izquierda.' },
  { src: '/hero-2.png', alt: 'Pliegues de tela en tonos terracota y bronce.' },
  { src: '/hero-3.png', alt: 'Ondas de tela color crema y oro viejo.' },
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

const catalogo: Array<{ icon: IconName; label: string }> = [
  { icon: 'shirt', label: 'Ropa adaptada' },
  { icon: 'shoe', label: 'Calzado' },
  { icon: 'prosthesis', label: 'Prótesis y órtesis' },
  { icon: 'wheelchair', label: 'Movilidad' },
  { icon: 'spoon', label: 'Apoyo diario' },
  { icon: 'scissors', label: 'Talleres de adaptación' },
]

const steps = [
  {
    number: '01',
    title: 'Contá cómo te vestís',
    body: 'Cuatro pasos cortos sobre barreras concretas: cierres, postura, sensibilidad. Nada de diagnósticos ni de medidas del cuerpo.',
  },
  {
    number: '02',
    title: 'Calculamos la compatibilidad',
    body: 'Un motor de reglas compara tu perfil con las características reales de cada producto y devuelve un puntaje reproducible.',
  },
  {
    number: '03',
    title: 'Te decimos dónde conseguirlo',
    body: 'La IA explica por qué encaja y qué modificación haría falta, y te conecta con el negocio que lo vende o lo adapta.',
  },
]

const values = [
  {
    title: 'Las limitaciones se dicen',
    body: 'Cada producto muestra también lo que no resuelve. Preferimos una recomendación honesta a una venta.',
    icon: 'info' as IconName,
  },
  {
    title: 'La ropa que ya existe también sirve',
    body: 'Si una prenda convencional casi encaja, te proponemos cómo adaptarla, con el beneficio y el costo reales de hacerlo.',
    icon: 'scissors' as IconName,
  },
  {
    title: 'No es solo ropa',
    body: 'Calzado, prótesis, órtesis, sillas de ruedas y productos de apoyo diario. Lo que hoy está disperso entre grupos de Facebook y recomendaciones de pasillo, en un solo lugar.',
    icon: 'store' as IconName,
  },
  {
    title: 'Vos no pagás nada',
    body: 'Quien paga es el negocio que se inscribe en el directorio, porque le llevamos clientes. La persona que busca no paga ni entrega datos médicos.',
    icon: 'verified' as IconName,
  },
]

/**
 * Diagrama del motor. Es la idea central del proyecto, así que se dibuja en
 * vez de describirse: quién calcula el número y quién solo lo explica.
 */
function EngineDiagram() {
  const nodes = [
    { label: 'Tu perfil', tone: 'brand' },
    { label: 'Motor determinista', tone: 'brand' },
    { label: 'Puntaje 0–100', tone: 'score' },
    { label: 'La IA lo explica', tone: 'accent' },
  ]

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
          <span className="font-semibold text-ink">{node.label}</span>
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
  useDocumentTitle('Ropa que se adapta a vos')

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
        aria-label="Presentación de ADAPTA"
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
                className="hero-panel"
                aria-roledescription="diapositiva"
                aria-label={`Imagen ${index + 1} de ${heroImages.length}`}
              >
                <img
                  src={photo.src}
                  alt={photo.alt}
                  className="hero-panel__photo"
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
                    <Icon name="spark" className="h-4 w-4" />
                    Moda y vida accesible, con IA
                  </p>

                  <h1 className="text-hero animate-rise mt-6 font-display font-extrabold text-ink">
                    La ropa debería adaptarse a vos.
                  </h1>

                  <p
                    style={{ '--i': 1 } as CSSProperties}
                    className="animate-rise stagger mt-6 max-w-xl text-lg text-ink-muted"
                  >
                    Vestirse no debería depender de si podés abrochar un botón.
                    ADAPTA reúne a los negocios que hacen ropa, calzado, prótesis y
                    ayudas técnicas adaptadas, cruza tu forma real de vestirte con lo
                    que ofrecen, y te dice qué te sirve, por qué, y a quién acudir.
                  </p>

                  <div
                    style={{ '--i': 2 } as CSSProperties}
                    className="animate-rise stagger mt-8 flex flex-col gap-3 sm:flex-row"
                  >
                    <ButtonLink to="/find-my-fit" size="lg">
                      Encontrá tu fit
                      <Icon name="arrow-right" className="h-5 w-5" />
                    </ButtonLink>
                    <ButtonLink to="/marketplace" size="lg" variant="secondary">
                      Ver el catálogo
                    </ButtonLink>
                  </div>

                  <p
                    style={{ '--i': 3 } as CSSProperties}
                    className="animate-rise stagger mt-4 flex items-center gap-2 text-sm text-ink-muted"
                  >
                    <Icon name="check" className="h-4 w-4 text-fit-high" />
                    Toma dos minutos. Gratis, sin registro y sin datos médicos.
                  </p>
                </div>

                {/* Muestra del resultado. Decorativa: todo lo que dice está
                    explicado en texto más abajo. */}
                <div
                  aria-hidden="true"
                  style={{ '--i': 2 } as CSSProperties}
                  className="animate-rise stagger relative"
                >
                  <div className="hero-stage__card rounded-panel bg-surface p-5 shadow-pop ring-1 ring-line sm:p-6">
                    <p className="text-xs font-bold uppercase tracking-[0.08em] text-ink-muted">
                      Así se ve un resultado
                    </p>

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
                        <span className="text-ink">Se abrocha con una sola mano</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-fit-high-soft text-fit-high-ink">
                          <Icon name="check" className="h-3.5 w-3.5" />
                        </span>
                        <span className="text-ink">No exige pinza fina</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-fit-low-soft text-fit-low-ink">
                          <Icon name="alert" className="h-3.5 w-3.5" />
                        </span>
                        <span className="text-ink-muted">
                          Los imanes requieren consulta si usás marcapasos
                        </span>
                      </li>
                    </ul>

                    <div className="mt-5 flex items-center gap-2.5 rounded-card bg-brand-soft px-4 py-3 ring-1 ring-brand-line">
                      <Icon name="pin" className="h-4 w-4 text-brand-ink" />
                      <p className="text-sm text-ink">
                        <span className="font-semibold">Dónde conseguirlo:</span> Vera
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
                      aria-label={`Ir a la imagen ${index + 1} de ${heroImages.length}`}
                      aria-current={index === heroIndex ? 'true' : undefined}
                    >
                      <span aria-hidden="true" />
                    </button>
                  </li>
                ))}
              </ul>
              <p className="sr-only-focusable" aria-live="polite">
                {`Imagen ${heroIndex + 1} de ${heroImages.length}. ${heroImages[heroIndex].alt}`}
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
          >
            Un directorio, seis rubros
          </h2>
          <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {catalogo.map((item, index) => (
              <li
                key={item.label}
                style={{ '--i': index } as CSSProperties}
                className="animate-rise stagger flex flex-col items-center gap-2 rounded-card bg-surface px-3 py-5 text-center ring-1 ring-line"
              >
                <Icon name={item.icon} className="h-7 w-7 text-brand-ink" />
                <span className="text-sm font-semibold text-ink">
                  {item.label}
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
          <h2 className="max-w-3xl text-section font-display font-extrabold">
            Para mucha gente, comprar ropa es adivinar.
          </h2>

          <div className="mt-10 grid gap-8 md:grid-cols-2">
            <div className="border-t border-on-inverse/25 pt-5">
              <h3 className="font-display text-lg font-bold text-on-inverse">
                Del lado de la persona
              </h3>
              <p className="mt-3 text-on-inverse-muted">
                Las tiendas describen talla, color y material. Ninguna dice si
                la prenda se puede poner con una mano, si se abrocha estando
                sentada, o si la costura interna va a molestar. Se compra, se
                prueba y se devuelve.
              </p>
            </div>
            <div className="border-t border-on-inverse/25 pt-5">
              <h3 className="font-display text-lg font-bold text-on-inverse">
                Del lado del negocio
              </h3>
              <p className="mt-3 text-on-inverse-muted">
                El taller, la ortopedia y el emprendimiento tienen el producto
                que alguien necesita hoy, y no tienen cómo llegar a esa
                persona. Su cliente los está buscando y no los encuentra.
              </p>
            </div>
          </div>

          <p className="mt-10 max-w-2xl border-l-2 border-accent pl-5 text-lg text-on-inverse">
            La información existe. Lo que no existe es un lugar donde esté
            junta y ordenada por lo que de verdad le sirve a cada persona.
          </p>
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
        >
          Cómo funciona
        </h2>

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
                {step.title}
              </h3>
              <p className="mt-2 text-ink-muted">{step.body}</p>
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
            <p className="text-sm font-bold uppercase tracking-[0.08em] text-brand-ink">
              El diferenciador
            </p>
            <h2
              id="motor"
              className="mt-3 text-section font-display font-extrabold text-ink"
            >
              El puntaje no se lo inventa la IA.
            </h2>
            <p className="mt-5 text-lg text-ink-muted">
              La compatibilidad sale de reglas deterministas escritas por
              nosotros. La IA llega después: lee esa evidencia y la traduce a
              lenguaje humano. Nunca puede cambiar el número. El mismo perfil
              da siempre el mismo resultado, y por eso se puede verificar.
            </p>
          </div>

          <div className="mt-10">
            <EngineDiagram />
          </div>

          <p className="mt-8 max-w-2xl rounded-card bg-surface px-5 py-4 text-ink-muted ring-1 ring-line">
            Cada recomendación muestra la evidencia que la sostiene, línea por
            línea: qué necesidad cubre, cuál cubre a medias y cuál no cubre.
            Nada de "confiá en el algoritmo".
          </p>
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
        >
          En qué nos diferenciamos
        </h2>

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
                {value.title}
              </h3>
              <p className="mt-2 text-ink-muted">{value.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------------------
       * Cierre
       * ------------------------------------------------------------- */}
      <section className="mx-auto max-w-4xl px-4 pb-24 text-center sm:px-6">
        <h2 className="text-section font-display font-extrabold text-ink">
          Contanos cómo te vestís y hacemos el resto.
        </h2>
        <p className="mx-auto mt-4 max-w-prose text-lg text-ink-muted">
          Cuatro pasos, ningún registro. Al final vas a ver el catálogo
          ordenado por lo que de verdad te sirve, y a quién acudir para
          conseguirlo.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <ButtonLink to="/find-my-fit" size="lg">
            Encontrá tu fit
            <Icon name="arrow-right" className="h-5 w-5" />
          </ButtonLink>
          <ButtonLink to="/for-business" size="lg" variant="secondary">
            Tengo un negocio
          </ButtonLink>
        </div>
      </section>
    </>
  )
}
