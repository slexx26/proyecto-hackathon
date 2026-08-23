import { useId, useState } from 'react'
import { providerKindLabels, type ProviderKind } from '@/types/provider'
import { ApiError } from '@/types/api'
import {
  submitProviderApplication,
  type ProviderApplication,
} from '@/services/api/providers'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { Button, ButtonLink } from '@/components/ui/Button'

/**
 * Cara del negocio: aquí se inscribe el proveedor.
 *
 * ALCANCE: el cobro real NO se implementa (sección 36, sin pagos). Esta
 * pantalla recoge la solicitud; el cobro se coordina fuera de la plataforma.
 * Los precios de abajo son la propuesta comercial, no un checkout.
 */

const plans = [
  {
    name: 'Listado básico',
    price: 'Gratis',
    features: [
      'Ficha en el directorio',
      'Hasta 3 productos listados',
      'Contacto visible',
    ],
  },
  {
    name: 'Verificado',
    price: '₡15 000 / mes',
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
    price: '₡35 000 / mes',
    features: [
      'Todo lo del plan verificado',
      'Posición prioritaria en el directorio',
      'Ficha ampliada con galería',
    ],
  },
]

const emptyApplication: ProviderApplication = {
  businessName: '',
  kind: 'adaptive-apparel',
  location: '',
  email: '',
  description: '',
}

export function ForBusinessPage() {
  useDocumentTitle('Inscribí tu negocio')

  const [form, setForm] = useState<ProviderApplication>(emptyApplication)
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>(
    'idle',
  )
  const [error, setError] = useState<string | undefined>()

  const nameId = useId()
  const kindId = useId()
  const locationId = useId()
  const emailId = useId()
  const descriptionId = useId()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
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
      <section className="bg-gradient-to-b from-brand-50 to-surface">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-20">
          <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-5xl">
            Tus clientes te están buscando. Hoy no te encuentran.
          </h1>
          <p className="mt-5 max-w-prose text-lg text-ink-muted">
            Quien necesita ropa adaptada, una prótesis o una silla de ruedas no
            sabe que existís: la información está dispersa entre grupos de
            Facebook, recomendaciones de pasillo y buscadores que devuelven
            catálogos de otro país. ADAPTA la centraliza y te pone delante de la
            persona justo cuando describe el problema que vos resolvés.
          </p>
        </div>
      </section>

      {/* Planes */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <h2 className="text-2xl font-bold text-ink sm:text-3xl">
          Planes de inscripción
        </h2>
        <ul className="mt-8 grid gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <li
              key={plan.name}
              className={
                plan.highlighted
                  ? 'rounded-card bg-surface p-6 shadow-lift ring-2 ring-brand-400'
                  : 'rounded-card bg-surface p-6 shadow-card ring-1 ring-line'
              }
            >
              <h3 className="text-lg font-semibold text-ink">{plan.name}</h3>
              <p className="mt-1 text-2xl font-bold text-brand-800">
                {plan.price}
              </p>
              <ul className="mt-4 space-y-2 text-sm text-ink-muted">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-2">
                    <span aria-hidden="true" className="text-fit-high">
                      ✓
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
        <p className="mt-6 max-w-prose text-sm text-ink-muted">
          Los precios son la propuesta comercial del proyecto. Durante el
          hackathon no se procesa ningún pago: la inscripción se coordina por
          correo después de recibir la solicitud.
        </p>
      </section>

      {/* Formulario */}
      <section className="mx-auto max-w-2xl px-4 pb-20 sm:px-6">
        <h2 className="text-2xl font-bold text-ink sm:text-3xl">
          Solicitar la inscripción
        </h2>

        {status === 'sent' ? (
          <div
            role="status"
            className="mt-6 rounded-card bg-fit-high/8 p-6 ring-1 ring-fit-high/25"
          >
            <h3 className="text-lg font-semibold text-ink">
              Recibimos tu solicitud
            </h3>
            <p className="mt-2 text-ink-muted">
              Te escribimos a <strong>{form.email}</strong> para verificar el
              negocio y coordinar la inscripción.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <ButtonLink to="/providers" variant="secondary">
                Ver el directorio
              </ButtonLink>
              <Button
                variant="ghost"
                onClick={() => {
                  setForm(emptyApplication)
                  setStatus('idle')
                }}
              >
                Inscribir otro negocio
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div>
              <label htmlFor={nameId} className="font-medium text-ink">
                Nombre del negocio
              </label>
              <input
                id={nameId}
                required
                value={form.businessName}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    businessName: event.target.value,
                  }))
                }
                className="mt-1.5 h-11 w-full rounded-xl bg-surface px-4 text-ink ring-1 ring-line"
              />
            </div>

            <div>
              <label htmlFor={kindId} className="font-medium text-ink">
                Tipo de negocio
              </label>
              <select
                id={kindId}
                value={form.kind}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    kind: event.target.value as ProviderKind,
                  }))
                }
                className="mt-1.5 h-11 w-full rounded-xl bg-surface px-3 text-ink ring-1 ring-line"
              >
                {(Object.keys(providerKindLabels) as ProviderKind[]).map(
                  (value) => (
                    <option key={value} value={value}>
                      {providerKindLabels[value]}
                    </option>
                  ),
                )}
              </select>
            </div>

            <div>
              <label htmlFor={locationId} className="font-medium text-ink">
                Ubicación
              </label>
              <input
                id={locationId}
                required
                placeholder="Ciudad, provincia"
                value={form.location}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    location: event.target.value,
                  }))
                }
                className="mt-1.5 h-11 w-full rounded-xl bg-surface px-4 text-ink ring-1 ring-line placeholder:text-ink-muted"
              />
            </div>

            <div>
              <label htmlFor={emailId} className="font-medium text-ink">
                Correo de contacto
              </label>
              <input
                id={emailId}
                type="email"
                required
                value={form.email}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    email: event.target.value,
                  }))
                }
                className="mt-1.5 h-11 w-full rounded-xl bg-surface px-4 text-ink ring-1 ring-line"
              />
            </div>

            <div>
              <label htmlFor={descriptionId} className="font-medium text-ink">
                Qué ofrecés
              </label>
              <textarea
                id={descriptionId}
                rows={4}
                required
                maxLength={400}
                value={form.description}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    description: event.target.value,
                  }))
                }
                className="mt-1.5 w-full rounded-xl bg-surface px-4 py-3 text-ink ring-1 ring-line"
              />
            </div>

            {status === 'error' ? (
              <p role="alert" className="text-sm font-medium text-fit-low">
                {error}
              </p>
            ) : null}

            <Button type="submit" size="lg" disabled={status === 'sending'}>
              {status === 'sending' ? 'Enviando…' : 'Enviar solicitud'}
            </Button>
          </form>
        )}
      </section>
    </>
  )
}
