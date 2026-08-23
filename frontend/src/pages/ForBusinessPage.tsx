import { useRef, useState, type CSSProperties } from 'react'
import { providerKindLabels, type ProviderKind } from '@/types/provider'
import { ApiError } from '@/types/api'
import {
  submitProviderApplication,
  type ProviderApplication,
} from '@/services/api/providers'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { Button, ButtonLink } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { SelectField, TextAreaField, TextField } from '@/components/forms/fields'
import { SpotIllustration } from '@/components/illustrations/SpotIllustration'
import { cn } from '@/utils/cn'

/**
 * Cara del negocio: aquí se inscribe el proveedor.
 *
 * ALCANCE: el cobro real NO se implementa (sección 36, sin pagos). Esta
 * pantalla recoge la solicitud; el cobro se coordina fuera de la plataforma.
 * Los precios de abajo son la propuesta comercial, no un checkout, y eso se
 * dice donde se ve, no en letra chica al final.
 */

const plans = [
  {
    name: 'Listado básico',
    price: 'Gratis',
    pitch: 'Para empezar a aparecer.',
    features: [
      'Ficha en el directorio',
      'Hasta 3 productos listados',
      'Contacto visible',
    ],
    highlighted: false,
  },
  {
    name: 'Verificado',
    price: '₡15 000',
    period: '/ mes',
    pitch: 'Para que te encuentren y confíen.',
    features: [
      'Todo lo del listado básico',
      'Insignia de verificación',
      'Productos ilimitados',
      'Aparece en las recomendaciones',
    ],
    highlighted: true,
  },
  {
    name: 'Destacado',
    price: '₡35 000',
    period: '/ mes',
    pitch: 'Para liderar tu rubro.',
    features: [
      'Todo lo del plan verificado',
      'Posición prioritaria en el directorio',
      'Ficha ampliada con galería',
    ],
    highlighted: false,
  },
]

const comoFunciona = [
  {
    title: 'Enviás la solicitud',
    body: 'Cinco campos. No pedimos documentos ni datos bancarios en este paso.',
  },
  {
    title: 'Verificamos que existís',
    body: 'Comprobamos que el negocio está activo y ofrece lo que dice. No evaluamos su calidad.',
  },
  {
    title: 'Aparecés en el directorio',
    body: 'Y en las recomendaciones de las personas cuyo perfil encaja con lo que vendés.',
  },
]

const emptyApplication: ProviderApplication = {
  businessName: '',
  kind: 'adaptive-apparel',
  location: '',
  email: '',
  description: '',
}

type FieldErrors = Partial<Record<keyof ProviderApplication, string>>

function validate(form: ProviderApplication): FieldErrors {
  const errors: FieldErrors = {}
  if (!form.businessName.trim()) errors.businessName = 'Poné el nombre del negocio.'
  if (!form.location.trim()) errors.location = 'Decinos dónde atendés.'
  if (!form.email.trim()) {
    errors.email = 'Necesitamos un correo para responderte.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    errors.email = 'Ese correo no parece válido. Revisalo.'
  }
  if (form.description.trim().length < 20) {
    errors.description = 'Contanos un poco más: al menos 20 caracteres.'
  }
  return errors
}

export function ForBusinessPage() {
  useDocumentTitle('Inscribí tu negocio')

  const [form, setForm] = useState<ProviderApplication>(emptyApplication)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>(
    'idle',
  )
  const [error, setError] = useState<string | undefined>()

  const formRef = useRef<HTMLFormElement>(null)

  function update<K extends keyof ProviderApplication>(
    key: K,
    value: ProviderApplication[K],
  ) {
    setForm((current) => ({ ...current, [key]: value }))
    // Corregir un campo borra su error al instante: no hace falta reenviar
    // para saber que ya está bien.
    setErrors((current) => ({ ...current, [key]: undefined }))
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const found = validate(form)
    if (Object.keys(found).length > 0) {
      setErrors(found)
      // El foco va al primer campo con problema: quien navega con teclado no
      // debería tener que buscar dónde falló.
      formRef.current
        ?.querySelector<HTMLElement>('[aria-invalid="true"]')
        ?.focus()
      return
    }

    setStatus('sending')
    setError(undefined)

    try {
      await submitProviderApplication(form)
      setStatus('sent')
    } catch (cause) {
      setStatus('error')
      setError(
        cause instanceof ApiError
          ? cause.userMessage
          : 'No pudimos enviar tu solicitud.',
      )
    }
  }

  return (
    <>
      {/* -------------------------------------------------------------
       * Hero
       * ----------------------------------------------------------- */}
      <section className="relative overflow-hidden border-b border-line bg-surface">
        <div aria-hidden="true" className="bg-grid absolute inset-0 opacity-60" />
        <div
          aria-hidden="true"
          className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-accent-soft blur-3xl"
        />

        <div className="relative mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
          <p className="animate-fade inline-flex items-center gap-2 rounded-full bg-accent-soft px-3.5 py-1.5 text-sm font-semibold text-accent-ink ring-1 ring-accent-line">
            <Icon name="store" className="h-4 w-4" />
            Para negocios
          </p>

          <h1 className="text-hero animate-rise mt-6 font-display font-extrabold text-ink">
            Tus clientes te están buscando. Hoy no te encuentran.
          </h1>

          <p
            style={{ '--i': 1 } as CSSProperties}
            className="animate-rise stagger mt-6 max-w-2xl text-lg text-ink-muted"
          >
            Quien necesita ropa adaptada, una prótesis o una silla de ruedas no
            sabe que existís: la información está dispersa entre grupos de
            Facebook, recomendaciones de pasillo y buscadores que devuelven
            catálogos de otro país. ADAPTA la centraliza y te pone delante de
            la persona justo cuando describe el problema que vos resolvés.
          </p>

          <div
            style={{ '--i': 2 } as CSSProperties}
            className="animate-rise stagger mt-8 flex flex-col gap-3 sm:flex-row"
          >
            <a
              href="#solicitud"
              className="inline-flex min-h-13 items-center justify-center gap-2 rounded-full bg-action px-7 font-semibold text-on-action shadow-card transition-[transform,background-color] duration-200 ease-(--ease-out-strong) hover:bg-action-hover active:scale-[0.97]"
            >
              Solicitar la inscripción
              <Icon name="arrow-right" className="h-5 w-5" />
            </a>
            <ButtonLink to="/providers" size="lg" variant="secondary">
              Ver el directorio
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------
       * Cómo funciona la inscripción
       * ----------------------------------------------------------- */}
      <section
        aria-labelledby="proceso"
        className="mx-auto max-w-6xl px-4 py-16 sm:px-6"
      >
        <h2
          id="proceso"
          className="text-section font-display font-extrabold text-ink"
        >
          Cómo funciona
        </h2>
        <ol className="mt-8 grid gap-6 md:grid-cols-3">
          {comoFunciona.map((paso, index) => (
            <li
              key={paso.title}
              style={{ '--i': index } as CSSProperties}
              className="animate-rise stagger border-t-2 border-line pt-5"
            >
              <span className="grid h-9 w-9 place-items-center rounded-full bg-brand-soft font-display text-sm font-bold text-brand-ink">
                {index + 1}
              </span>
              <h3 className="mt-3 font-display text-lg font-bold text-ink">
                {paso.title}
              </h3>
              <p className="mt-2 text-ink-muted">{paso.body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* -------------------------------------------------------------
       * Planes
       * ----------------------------------------------------------- */}
      <section
        aria-labelledby="planes"
        className="border-y border-line bg-surface-muted py-16"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2
            id="planes"
            className="text-section font-display font-extrabold text-ink"
          >
            Planes de inscripción
          </h2>

          {/* El aviso de que no hay pasarela de pago va ARRIBA de los
              precios, no al final: quien lee un precio asume que puede
              pagarlo, y en este proyecto no puede (sección 36). */}
          <p className="mt-4 flex max-w-2xl items-start gap-2.5 rounded-card bg-surface px-4 py-3 text-sm text-ink-muted ring-1 ring-line">
            <Icon name="info" className="mt-0.5 h-4 w-4 shrink-0" />
            <span>
              Los precios son la propuesta comercial del proyecto. Durante el
              hackathon no se procesa ningún pago: la inscripción se coordina
              por correo después de recibir la solicitud.
            </span>
          </p>

          <ul className="mt-8 grid items-start gap-6 md:grid-cols-3">
            {plans.map((plan, index) => (
              <li
                key={plan.name}
                style={{ '--i': index } as CSSProperties}
                className={cn(
                  'animate-rise stagger relative flex h-full flex-col rounded-panel bg-surface p-6',
                  plan.highlighted
                    ? 'shadow-pop ring-2 ring-action md:-mt-4 md:pb-10'
                    : 'shadow-card ring-1 ring-line',
                )}
              >
                {plan.highlighted ? (
                  <span className="absolute -top-3 left-6 rounded-full bg-action px-3 py-1 text-xs font-bold uppercase tracking-[0.06em] text-on-action">
                    El más elegido
                  </span>
                ) : null}

                <h3 className="font-display text-xl font-bold text-ink">
                  {plan.name}
                </h3>
                <p className="mt-1 text-sm text-ink-muted">{plan.pitch}</p>

                <p className="mt-4 flex items-baseline gap-1">
                  <span
                    data-numeric
                    className="font-display text-3xl font-extrabold text-ink"
                  >
                    {plan.price}
                  </span>
                  {plan.period ? (
                    <span className="text-sm text-ink-muted">{plan.period}</span>
                  ) : null}
                </p>

                <ul className="mt-5 flex-1 space-y-2.5 text-sm">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5">
                      <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-fit-high-soft text-fit-high-ink">
                        <Icon name="check" className="h-3 w-3" />
                      </span>
                      <span className="text-ink">{feature}</span>
                    </li>
                  ))}
                </ul>

                <p className="mt-6">
                  <a
                    href="#solicitud"
                    className={cn(
                      'inline-flex min-h-11 w-full items-center justify-center rounded-full px-5 text-sm font-semibold transition-[transform,background-color] duration-200 ease-(--ease-out-strong) active:scale-[0.97]',
                      plan.highlighted
                        ? 'bg-action text-on-action hover:bg-action-hover'
                        : 'bg-surface text-ink ring-1 ring-line-strong hover:bg-surface-muted',
                    )}
                  >
                    Solicitar
                    <span className="sr-only"> el plan {plan.name}</span>
                  </a>
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* -------------------------------------------------------------
       * Formulario
       * ----------------------------------------------------------- */}
      <section
        id="solicitud"
        aria-labelledby="solicitud-titulo"
        className="mx-auto max-w-2xl scroll-mt-24 px-4 py-16 sm:px-6"
      >
        <h2
          id="solicitud-titulo"
          className="text-section font-display font-extrabold text-ink"
        >
          Solicitar la inscripción
        </h2>

        {status === 'sent' ? (
          <div
            role="status"
            className="animate-pop mt-8 rounded-panel bg-surface p-6 text-center shadow-card ring-1 ring-fit-high/30 sm:p-8"
          >
            <SpotIllustration name="sent" className="mx-auto h-32 w-auto" />
            <h3 className="mt-5 font-display text-xl font-bold text-ink">
              Recibimos tu solicitud
            </h3>
            <p className="mx-auto mt-2 max-w-prose text-ink-muted">
              Te escribimos a <strong className="text-ink">{form.email}</strong>{' '}
              para verificar el negocio y coordinar la inscripción.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <ButtonLink to="/providers" variant="secondary">
                Ver el directorio
              </ButtonLink>
              <Button
                variant="ghost"
                onClick={() => {
                  setForm(emptyApplication)
                  setErrors({})
                  setStatus('idle')
                }}
              >
                Inscribir otro negocio
              </Button>
            </div>
          </div>
        ) : (
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            noValidate
            className="mt-8 space-y-5 rounded-panel bg-surface p-6 shadow-card ring-1 ring-line sm:p-8"
          >
            <TextField
              label="Nombre del negocio"
              required
              value={form.businessName}
              error={errors.businessName}
              autoComplete="organization"
              onChange={(value) => update('businessName', value)}
            />

            <SelectField
              label="Tipo de negocio"
              value={form.kind}
              onChange={(value) =>
                update('kind', (value || 'adaptive-apparel') as ProviderKind)
              }
              options={(Object.keys(providerKindLabels) as ProviderKind[]).map(
                (value) => ({ value, label: providerKindLabels[value] }),
              )}
            />

            <TextField
              label="Ubicación"
              required
              placeholder="Ciudad, provincia"
              value={form.location}
              error={errors.location}
              autoComplete="address-level2"
              onChange={(value) => update('location', value)}
            />

            <TextField
              label="Correo de contacto"
              type="email"
              required
              value={form.email}
              error={errors.email}
              autoComplete="email"
              hint="Solo lo usamos para responderte sobre la inscripción."
              onChange={(value) => update('email', value)}
            />

            <div>
              <TextAreaField
                label="Qué ofrecés"
                hint="Contá qué productos o servicios tenés y qué problema resuelven."
                placeholder="Adaptamos prendas convencionales: cambio de cierres por imanes, aperturas laterales y ajustes para vestirse sentado."
                value={form.description}
                onChange={(value) => update('description', value)}
              />
              {errors.description ? (
                <p
                  role="alert"
                  className="mt-1.5 flex items-center gap-1.5 text-sm font-semibold text-fit-low-ink"
                >
                  <Icon name="alert" className="h-4 w-4" />
                  {errors.description}
                </p>
              ) : null}
            </div>

            {status === 'error' ? (
              <p
                role="alert"
                className="flex items-start gap-2 rounded-field bg-fit-low-soft px-4 py-3 text-sm font-semibold text-fit-low-ink"
              >
                <Icon name="alert" className="mt-0.5 h-4 w-4 shrink-0" />
                {error}
              </p>
            ) : null}

            <div className="flex flex-col gap-3 border-t border-line pt-5 sm:flex-row sm:items-center">
              <Button type="submit" size="lg" disabled={status === 'sending'}>
                {status === 'sending' ? 'Enviando…' : 'Enviar solicitud'}
              </Button>
              <p className="text-sm text-ink-muted">
                No se cobra nada en este paso.
              </p>
            </div>
          </form>
        )}
      </section>
    </>
  )
}
