import { ButtonLink } from '@/components/ui/Button'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

/**
 * Sección 7. La landing tiene un solo trabajo: explicar el problema y
 * llevar a Find My Fit. No es un escaparate de tienda.
 */

const steps = [
  {
    number: '01',
    title: 'Contá cómo te vestís',
    body: 'Un formulario corto sobre barreras concretas: cierres, postura, sensibilidad. Nada de diagnósticos ni de medidas del cuerpo.',
  },
  {
    number: '02',
    title: 'Calculamos la compatibilidad',
    body: 'Un motor de reglas compara tu perfil con las características reales de cada prenda y devuelve un puntaje reproducible.',
  },
  {
    number: '03',
    title: 'Te explicamos por qué',
    body: 'La IA traduce esa evidencia a lenguaje claro: qué encaja, qué no, y qué modificación lo resolvería.',
  },
]

const values = [
  {
    title: 'El puntaje no se lo inventa la IA',
    body: 'La compatibilidad sale de reglas deterministas. La IA explica el resultado, nunca lo cambia. Mismo perfil, mismo puntaje, siempre.',
  },
  {
    title: 'Las limitaciones se dicen',
    body: 'Cada prenda muestra también lo que no resuelve. Preferimos una recomendación honesta a una venta.',
  },
  {
    title: 'La ropa que ya existe también sirve',
    body: 'Si una prenda convencional casi encaja, te proponemos cómo adaptarla, con el beneficio y el costo reales de hacerlo.',
  },
]

export function LandingPage() {
  useDocumentTitle('Ropa que se adapta a vos')

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-b from-brand-50 to-surface">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="inline-flex rounded-full bg-brand-100 px-4 py-1.5 text-sm font-semibold text-brand-800">
              Moda accesible con IA
            </p>

            <h1 className="mt-5 text-4xl font-bold tracking-tight text-ink sm:text-5xl lg:text-6xl">
              La ropa debería adaptarse a vos.
            </h1>

            <p className="mt-5 max-w-prose text-lg text-ink-muted">
              Vestirse no debería depender de si podés abrochar un botón. ADAPTA
              cruza tu forma real de vestirte con las características de cada
              prenda, te dice qué tan bien encaja y por qué, y cuando no encaja,
              te propone cómo adaptarla.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink to="/find-my-fit" size="lg">
                Encontrá tu fit
              </ButtonLink>
              <ButtonLink to="/marketplace" size="lg" variant="secondary">
                Ver el catálogo
              </ButtonLink>
            </div>

            <p className="mt-4 text-sm text-ink-muted">
              Toma dos minutos. No pedimos registro ni datos médicos.
            </p>
          </div>

          {/* Muestra del resultado. Decorativa: lo mismo se explica en texto. */}
          <div
            aria-hidden="true"
            className="rounded-card bg-surface p-6 shadow-lift ring-1 ring-line"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
              Así se ve un resultado
            </p>
            <div className="mt-4 flex items-start justify-between gap-4">
              <div>
                <p className="font-semibold text-ink">
                  Camisa Vera de cierre magnético
                </p>
                <p className="text-sm text-ink-muted">Vera Studio</p>
              </div>
              <span className="rounded-full bg-fit-high/12 px-3 py-1 text-sm font-semibold text-fit-high ring-1 ring-inset ring-fit-high/30">
                92 Encaja muy bien
              </span>
            </div>
            <ul className="mt-5 space-y-2.5 text-sm">
              <li className="flex gap-2 text-ink">
                <span className="text-fit-high">✓</span>
                Se abrocha con una sola mano
              </li>
              <li className="flex gap-2 text-ink">
                <span className="text-fit-high">✓</span>
                No exige pinza fina
              </li>
              <li className="flex gap-2 text-ink-muted">
                <span className="text-fit-low">!</span>
                Los imanes requieren consulta si usás marcapasos
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* El problema */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="rounded-card bg-brand-800 px-6 py-12 text-white sm:px-12">
          <h2 className="max-w-2xl text-2xl font-bold sm:text-3xl">
            Para mucha gente, comprar ropa es adivinar.
          </h2>
          <p className="mt-4 max-w-2xl text-brand-100">
            Las tiendas describen talla, color y material. Ninguna dice si la
            prenda se puede poner con una mano, si se abrocha sentada, o si la
            costura interna va a molestar. Esa información existe, pero nadie la
            organiza. Sin ella, la persona compra, prueba y devuelve.
          </p>
        </div>
      </section>

      {/* Cómo funciona */}
      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <h2 className="text-2xl font-bold text-ink sm:text-3xl">
          Cómo funciona
        </h2>
        <ol className="mt-8 grid gap-6 md:grid-cols-3">
          {steps.map((step) => (
            <li
              key={step.number}
              className="rounded-card bg-surface p-6 shadow-card ring-1 ring-line"
            >
              <span className="text-sm font-bold text-brand-500">
                {step.number}
              </span>
              <h3 className="mt-2 text-lg font-semibold text-ink">
                {step.title}
              </h3>
              <p className="mt-2 text-ink-muted">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Diferenciador */}
      <section className="bg-surface-muted py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-ink sm:text-3xl">
            En qué nos diferenciamos
          </h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {values.map((value) => (
              <div key={value.title}>
                <h3 className="text-lg font-semibold text-ink">
                  {value.title}
                </h3>
                <p className="mt-2 text-ink-muted">{value.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cierre */}
      <section className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
        <h2 className="text-2xl font-bold text-ink sm:text-3xl">
          Contanos cómo te vestís y hacemos el resto.
        </h2>
        <p className="mx-auto mt-3 max-w-prose text-ink-muted">
          Nueve preguntas, ningún registro. Al final vas a ver el catálogo
          ordenado por lo que de verdad te sirve.
        </p>
        <div className="mt-8 flex justify-center">
          <ButtonLink to="/find-my-fit" size="lg">
            Encontrá tu fit
          </ButtonLink>
        </div>
      </section>
    </>
  )
}
