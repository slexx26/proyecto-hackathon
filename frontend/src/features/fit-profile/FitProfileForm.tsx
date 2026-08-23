import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import {
  emptyFitProfile,
  type FitProfile,
  type FitProfileErrors,
} from '@/types/fit-profile'
import type { AdaptationNeed, ProductCategory } from '@/types/product'
import {
  assistanceLabels,
  categoryLabels,
  dexterityLabels,
  needHints,
  needLabels,
  postureLabels,
  sensoryLabels,
} from '@/utils/labels'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import {
  CheckboxOption,
  Fieldset,
  RadioGroup,
  TextAreaField,
} from '@/components/forms/fields'
import { cn } from '@/utils/cn'

/**
 * Find My Fit, en cuatro pasos.
 *
 * Antes era un formulario de nueve grupos en una sola pantalla. Funcionaba,
 * pero pedía leer veintitantas opciones antes de saber si valía la pena
 * empezar, y no daba ninguna señal de cuánto faltaba. Partirlo tiene un
 * costo real —más clics— y a cambio da tres cosas:
 *
 *   1. Una sola pregunta a la vez, que es como se responde de verdad.
 *   2. Progreso visible: cuánto falta deja de ser una incógnita.
 *   3. Un repaso final antes de enviar, para corregir sin volver atrás.
 *
 * Lo que NO cambia: cada grupo sigue siendo un `<fieldset>` con `<legend>`,
 * cada control tiene su `<label>`, y el paso obligatorio se valida antes de
 * dejar avanzar. Al cambiar de paso el foco va al encabezado, no al principio
 * de la página: quien navega con teclado o lector de pantalla sigue el hilo.
 */

const allNeeds = Object.keys(needLabels) as AdaptationNeed[]
const allCategories = Object.keys(categoryLabels) as ProductCategory[]

const steps = [
  { title: 'Barreras al vestirte', short: 'Barreras' },
  { title: 'Tu rutina al vestirte', short: 'Rutina' },
  { title: 'Sensibilidad y prioridades', short: 'Prioridades' },
  { title: 'Repaso antes de enviar', short: 'Repaso' },
] as const

function toOptions<T extends string>(labels: Record<T, string>) {
  return (Object.keys(labels) as T[]).map((value) => ({
    value,
    label: labels[value],
  }))
}

function validate(profile: FitProfile): FitProfileErrors {
  const errors: FitProfileErrors = {}
  if (profile.needs.length === 0) {
    errors.needs = 'Marcá al menos una barrera para poder recomendarte algo.'
  }
  return errors
}

function toggle<T>(list: T[], item: T): T[] {
  return list.includes(item)
    ? list.filter((value) => value !== item)
    : [...list, item]
}

interface StepperProps {
  current: number
  furthest: number
  onJump: (step: number) => void
}

/**
 * Indicador de progreso.
 *
 * El estado del paso no se comunica solo con color: el actual lleva
 * `aria-current="step"`, los completados llevan una marca de verificación, y
 * debajo va siempre "Paso N de 4" en texto.
 */
function Stepper({ current, furthest, onJump }: StepperProps) {
  return (
    <nav aria-label="Progreso del formulario">
      <ol className="flex items-center gap-1.5 sm:gap-2">
        {steps.map((step, index) => {
          const done = index < current
          const active = index === current
          const reachable = index <= furthest

          return (
            <li key={step.title} className="flex flex-1 items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                disabled={!reachable}
                aria-current={active ? 'step' : undefined}
                onClick={() => onJump(index)}
                className={cn(
                  'group flex min-h-11 flex-1 items-center gap-2 rounded-full px-2.5 text-left transition-colors duration-200 sm:px-3',
                  reachable ? 'cursor-pointer' : 'cursor-not-allowed opacity-55',
                  active && 'bg-brand-soft',
                  reachable && !active && 'hover:bg-surface-muted',
                )}
              >
                <span
                  className={cn(
                    'grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-bold transition-colors duration-200',
                    active && 'bg-action text-on-action',
                    done && 'bg-fit-high-soft text-fit-high-ink',
                    !active && !done && 'bg-surface-sunken text-ink-muted',
                  )}
                >
                  {done ? (
                    <Icon name="check" className="h-4 w-4" />
                  ) : (
                    index + 1
                  )}
                </span>
                <span
                  className={cn(
                    'hidden truncate text-sm font-semibold sm:block',
                    active ? 'text-brand-ink' : 'text-ink-muted',
                  )}
                >
                  {step.short}
                </span>
                <span className="sr-only">
                  Paso {index + 1}: {step.title}
                  {done ? ' (completado)' : ''}
                </span>
              </button>

              {index < steps.length - 1 ? (
                <span
                  aria-hidden="true"
                  className={cn(
                    'hidden h-0.5 w-4 rounded-full sm:block',
                    done ? 'bg-fit-high' : 'bg-line',
                  )}
                />
              ) : null}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

/** Fila del repaso final. Deja ver de un vistazo lo que se va a enviar. */
function SummaryRow({ term, children }: { term: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1 border-b border-line py-3 last:border-0 sm:flex-row sm:gap-4">
      <dt className="text-sm font-semibold text-ink-muted sm:w-44 sm:shrink-0">
        {term}
      </dt>
      <dd className="text-ink">{children}</dd>
    </div>
  )
}

interface FitProfileFormProps {
  initialProfile?: FitProfile
  submitting: boolean
  onSubmit: (profile: FitProfile) => void
}

export function FitProfileForm({
  initialProfile,
  submitting,
  onSubmit,
}: FitProfileFormProps) {
  const [profile, setProfile] = useState<FitProfile>(
    initialProfile ?? emptyFitProfile,
  )
  const [step, setStep] = useState(0)
  // Hasta dónde llegó: permite volver a un paso ya visto, no saltarse el
  // que falta por completar.
  const [furthest, setFurthest] = useState(0)
  // Los errores solo aparecen tras intentar avanzar: no regañamos por
  // adelantado.
  const [showErrors, setShowErrors] = useState(false)

  const headingRef = useRef<HTMLHeadingElement>(null)
  // Se compara contra el paso anterior, no contra una bandera de montaje:
  // en StrictMode los efectos corren dos veces y una bandera dejaba el foco
  // pegado al encabezado nada más abrir la página.
  const previousStep = useRef(step)

  const errors = useMemo(() => validate(profile), [profile])
  const visibleErrors: FitProfileErrors = showErrors ? errors : {}

  // Al cambiar de paso, el foco va al encabezado del paso nuevo. Sin esto,
  // quien navega con teclado se queda con el foco en un botón que ya no
  // significa lo mismo, y el lector de pantalla no anuncia nada.
  useEffect(() => {
    if (previousStep.current === step) return
    previousStep.current = step
    headingRef.current?.focus()
  }, [step])

  function goTo(next: number) {
    setStep(next)
    setFurthest((value) => Math.max(value, next))
    setShowErrors(false)
  }

  /**
   * OJO con el `preventDefault`: arregla un fallo real y nada obvio.
   *
   * Este botón y el de envío ocupan la misma posición del árbol, así que
   * React reutiliza el mismo nodo del DOM y solo le cambia el `type`. Al
   * pulsar "Siguiente" en el paso 3, el manejador corría, React repintaba y
   * el nodo pasaba a `type="submit"` ANTES de que el navegador ejecutara la
   * acción por defecto del clic: el formulario se enviaba y la persona
   * aterrizaba en las recomendaciones sin llegar a ver el repaso. El `key`
   * distinto ya evita la reutilización; el `preventDefault` lo deja cerrado.
   */
  function handleNext(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault()

    if (step === 0 && errors.needs) {
      setShowErrors(true)
      document.getElementById('grupo-necesidades')?.scrollIntoView({
        block: 'center',
      })
      return
    }
    goTo(Math.min(step + 1, steps.length - 1))
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (Object.keys(errors).length > 0) {
      setShowErrors(true)
      goTo(0)
      return
    }

    onSubmit(profile)
  }

  const isLast = step === steps.length - 1

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="rounded-panel bg-surface-muted p-3 ring-1 ring-line sm:p-4">
        <Stepper current={step} furthest={furthest} onJump={goTo} />
      </div>

      <h2
        ref={headingRef}
        tabIndex={-1}
        className="mt-8 scroll-mt-28 font-display text-2xl font-bold text-ink sm:text-3xl"
      >
        <span className="block text-sm font-semibold uppercase tracking-[0.08em] text-brand-ink">
          Paso {step + 1} de {steps.length}
        </span>
        {steps[step].title}
      </h2>

      {/* Cada paso se monta y desmonta: la animación de entrada vuelve a
          correr y el contenido anterior no queda en el árbol de foco. */}
      <div key={step} className="animate-rise mt-5 space-y-5">
        {step === 0 ? (
          <Fieldset
            id="grupo-necesidades"
            legend="¿Qué te cuesta al vestirte?"
            hint="Marcá todo lo que aplique. Es la parte que más pesa en la recomendación."
            error={visibleErrors.needs}
          >
            <div className="grid gap-3 md:grid-cols-2">
              {allNeeds.map((need) => (
                <CheckboxOption
                  key={need}
                  name="needs"
                  value={need}
                  label={needLabels[need]}
                  hint={needHints[need]}
                  checked={profile.needs.includes(need)}
                  onChange={() =>
                    setProfile((current) => ({
                      ...current,
                      needs: toggle(current.needs, need),
                    }))
                  }
                />
              ))}
            </div>
          </Fieldset>
        ) : null}

        {step === 1 ? (
          <>
            <Fieldset legend="¿Cómo usás las manos?">
              <RadioGroup
                name="handDexterity"
                options={toOptions(dexterityLabels)}
                value={profile.handDexterity}
                onChange={(handDexterity) =>
                  setProfile((current) => ({ ...current, handDexterity }))
                }
              />
            </Fieldset>

            <Fieldset legend="¿En qué posición te vestís normalmente?">
              <RadioGroup
                name="dressingPosture"
                options={toOptions(postureLabels)}
                value={profile.dressingPosture}
                onChange={(dressingPosture) =>
                  setProfile((current) => ({ ...current, dressingPosture }))
                }
              />
            </Fieldset>

            <Fieldset legend="¿Necesitás ayuda para vestirte?">
              <RadioGroup
                name="dressingAssistance"
                options={toOptions(assistanceLabels)}
                value={profile.dressingAssistance}
                onChange={(dressingAssistance) =>
                  setProfile((current) => ({ ...current, dressingAssistance }))
                }
              />
            </Fieldset>
          </>
        ) : null}

        {step === 2 ? (
          <>
            <Fieldset legend="¿Te molestan costuras, etiquetas o texturas?">
              <RadioGroup
                name="sensorySensitivity"
                options={toOptions(sensoryLabels)}
                value={profile.sensorySensitivity}
                onChange={(sensorySensitivity) =>
                  setProfile((current) => ({ ...current, sensorySensitivity }))
                }
              />
            </Fieldset>

            <Fieldset
              legend="¿Qué buscás ahora?"
              hint="Opcional. Si no marcás nada, te mostramos todo el catálogo."
            >
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {allCategories.map((category) => (
                  <CheckboxOption
                    key={category}
                    name="preferredCategories"
                    value={category}
                    label={categoryLabels[category]}
                    checked={profile.preferredCategories.includes(category)}
                    onChange={() =>
                      setProfile((current) => ({
                        ...current,
                        preferredCategories: toggle(
                          current.preferredCategories,
                          category,
                        ),
                      }))
                    }
                  />
                ))}
              </div>
            </Fieldset>
          </>
        ) : null}

        {step === 3 ? (
          <>
            <Fieldset legend="¿Algo más que debamos saber?">
              <TextAreaField
                label="Contalo con tus palabras"
                hint="Opcional. Lo usamos para afinar la explicación, no para calcular el puntaje."
                placeholder="Por ejemplo: uso una férula en la mano derecha y los puños ajustados no me pasan."
                value={profile.notes ?? ''}
                onChange={(notes) =>
                  setProfile((current) => ({ ...current, notes }))
                }
              />
            </Fieldset>

            <section
              aria-labelledby="repaso-perfil"
              className="rounded-panel bg-surface p-5 ring-1 ring-line sm:p-6"
            >
              <h3
                id="repaso-perfil"
                className="font-display text-lg font-bold text-ink sm:text-xl"
              >
                Esto es lo que vamos a usar
              </h3>
              <p className="mt-1 text-sm text-ink-muted">
                Si algo no encaja, volvé al paso correspondiente arriba.
              </p>

              <dl className="mt-4">
                <SummaryRow term="Barreras marcadas">
                  {profile.needs.length > 0 ? (
                    <ul className="flex flex-wrap gap-1.5">
                      {profile.needs.map((need) => (
                        <li
                          key={need}
                          className="rounded-full bg-brand-soft px-2.5 py-1 text-sm font-semibold text-brand-ink"
                        >
                          {needLabels[need]}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-fit-low-ink">
                      Ninguna. Volvé al paso 1: sin esto no podemos recomendar.
                    </span>
                  )}
                </SummaryRow>
                <SummaryRow term="Manos">
                  {dexterityLabels[profile.handDexterity]}
                </SummaryRow>
                <SummaryRow term="Postura">
                  {postureLabels[profile.dressingPosture]}
                </SummaryRow>
                <SummaryRow term="Ayuda">
                  {assistanceLabels[profile.dressingAssistance]}
                </SummaryRow>
                <SummaryRow term="Sensibilidad">
                  {sensoryLabels[profile.sensorySensitivity]}
                </SummaryRow>
                <SummaryRow term="Categorías">
                  {profile.preferredCategories.length > 0
                    ? profile.preferredCategories
                        .map((category) => categoryLabels[category])
                        .join(' · ')
                    : 'Todas'}
                </SummaryRow>
              </dl>
            </section>
          </>
        ) : null}
      </div>

      <div className="mt-8 flex flex-col gap-3 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-3 sm:shrink-0 sm:flex-row">
          {step > 0 ? (
            <Button
              type="button"
              variant="secondary"
              size="lg"
              onClick={() => goTo(step - 1)}
            >
              <Icon name="arrow-left" className="h-5 w-5" />
              Atrás
            </Button>
          ) : null}

          {isLast ? (
            <Button key="enviar" type="submit" size="lg" disabled={submitting}>
              {submitting ? 'Buscando prendas…' : 'Ver mis recomendaciones'}
              <Icon name="arrow-right" className="h-5 w-5" />
            </Button>
          ) : (
            <Button key="siguiente" type="button" size="lg" onClick={handleNext}>
              Siguiente
              <Icon name="arrow-right" className="h-5 w-5" />
            </Button>
          )}
        </div>

        <p className="text-sm text-ink-muted">
          Tu perfil se guarda solo en esta pestaña y se borra al cerrarla.
        </p>
      </div>
    </form>
  )
}
