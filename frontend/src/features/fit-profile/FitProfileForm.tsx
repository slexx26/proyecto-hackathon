import { useMemo, useState } from 'react'
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
import {
  CheckboxOption,
  Fieldset,
  RadioGroup,
  TextAreaField,
} from '@/components/forms/fields'

const allNeeds = Object.keys(needLabels) as AdaptationNeed[]
const allCategories = Object.keys(categoryLabels) as ProductCategory[]

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
  // Los errores solo aparecen tras el primer envío: no regañamos por adelantado.
  const [showErrors, setShowErrors] = useState(false)

  const errors = useMemo(() => validate(profile), [profile])

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setShowErrors(true)

    if (Object.keys(errors).length > 0) {
      // Llevamos el foco al primer grupo con problema.
      document.getElementById('grupo-necesidades')?.scrollIntoView({
        block: 'center',
      })
      return
    }

    onSubmit(profile)
  }

  const visibleErrors: FitProfileErrors = showErrors ? errors : {}

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      <div id="grupo-necesidades">
        <Fieldset
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
      </div>

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

      <Fieldset legend="¿Algo más que debamos saber?">
        <TextAreaField
          label="Contalo con tus palabras"
          hint="Opcional. Lo usamos para afinar la explicación, no para calcular el puntaje."
          value={profile.notes ?? ''}
          onChange={(notes) => setProfile((current) => ({ ...current, notes }))}
        />
      </Fieldset>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button type="submit" size="lg" disabled={submitting}>
          {submitting ? 'Buscando prendas…' : 'Ver mis recomendaciones'}
        </Button>
        <p className="text-sm text-ink-muted">
          Tu perfil se guarda solo en esta pestaña y se borra al cerrarla.
        </p>
      </div>
    </form>
  )
}
