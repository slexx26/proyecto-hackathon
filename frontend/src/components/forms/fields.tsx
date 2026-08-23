import { useId, type ReactNode } from 'react'
import { cn } from '@/utils/cn'

/**
 * Campos del formulario. Reglas comunes (sección 23):
 * - Todo control tiene un `<label>` real asociado, no un placeholder.
 * - Los grupos de opciones son `<fieldset>` con `<legend>`.
 * - El error se asocia con `aria-describedby` y se marca con `aria-invalid`.
 */

interface FieldsetProps {
  legend: string
  hint?: string
  error?: string
  children: ReactNode
}

export function Fieldset({ legend, hint, error, children }: FieldsetProps) {
  const hintId = useId()
  const errorId = useId()

  return (
    <fieldset
      className="rounded-card bg-surface p-6 ring-1 ring-line"
      aria-describedby={cn(hint && hintId, error && errorId) || undefined}
    >
      <legend className="px-1 text-lg font-semibold text-ink">{legend}</legend>

      {hint ? (
        <p id={hintId} className="mt-1 text-sm text-ink-muted">
          {hint}
        </p>
      ) : null}

      <div className="mt-4">{children}</div>

      {error ? (
        <p id={errorId} role="alert" className="mt-3 text-sm font-medium text-fit-low">
          {error}
        </p>
      ) : null}
    </fieldset>
  )
}

interface CheckboxOptionProps {
  name: string
  value: string
  label: string
  hint?: string
  checked: boolean
  onChange: (checked: boolean) => void
}

export function CheckboxOption({
  name,
  value,
  label,
  hint,
  checked,
  onChange,
}: CheckboxOptionProps) {
  const id = useId()
  const hintId = `${id}-hint`

  return (
    <div
      className={cn(
        'rounded-xl p-4 ring-1 transition-colors',
        checked ? 'bg-brand-50 ring-brand-400' : 'bg-surface ring-line',
      )}
    >
      <div className="flex gap-3">
        <input
          type="checkbox"
          id={id}
          name={name}
          value={value}
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          aria-describedby={hint ? hintId : undefined}
          className="mt-1 h-5 w-5 shrink-0 accent-brand-700"
        />
        <div>
          <label htmlFor={id} className="font-medium text-ink">
            {label}
          </label>
          {hint ? (
            <p id={hintId} className="mt-0.5 text-sm text-ink-muted">
              {hint}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  )
}

interface RadioGroupProps<T extends string> {
  name: string
  options: Array<{ value: T; label: string }>
  value: T
  onChange: (value: T) => void
}

export function RadioGroup<T extends string>({
  name,
  options,
  value,
  onChange,
}: RadioGroupProps<T>) {
  const groupId = useId()

  return (
    <div className="grid gap-2 sm:grid-cols-3">
      {options.map((option) => {
        const id = `${groupId}-${option.value}`
        const selected = value === option.value
        return (
          <div
            key={option.value}
            className={cn(
              'rounded-xl p-4 ring-1 transition-colors',
              selected ? 'bg-brand-50 ring-brand-400' : 'bg-surface ring-line',
            )}
          >
            <div className="flex gap-3">
              <input
                type="radio"
                id={id}
                name={name}
                value={option.value}
                checked={selected}
                onChange={() => onChange(option.value)}
                className="mt-0.5 h-5 w-5 shrink-0 accent-brand-700"
              />
              <label htmlFor={id} className="font-medium text-ink">
                {option.label}
              </label>
            </div>
          </div>
        )
      })}
    </div>
  )
}

interface TextAreaFieldProps {
  label: string
  hint?: string
  value: string
  maxLength?: number
  onChange: (value: string) => void
}

export function TextAreaField({
  label,
  hint,
  value,
  maxLength = 400,
  onChange,
}: TextAreaFieldProps) {
  const id = useId()
  const hintId = `${id}-hint`

  return (
    <div>
      <label htmlFor={id} className="font-medium text-ink">
        {label}
      </label>
      {hint ? (
        <p id={hintId} className="mt-0.5 text-sm text-ink-muted">
          {hint}
        </p>
      ) : null}
      <textarea
        id={id}
        rows={4}
        value={value}
        maxLength={maxLength}
        aria-describedby={hint ? hintId : undefined}
        onChange={(event) => onChange(event.target.value)}
        className="mt-3 w-full rounded-xl bg-surface px-4 py-3 text-ink ring-1 ring-line placeholder:text-ink-muted"
      />
      <p className="mt-1 text-right text-xs text-ink-muted">
        {value.length} / {maxLength}
      </p>
    </div>
  )
}
