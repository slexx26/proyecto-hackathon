import { useId, type ReactNode } from 'react'
import { Icon } from '@/components/ui/Icon'
import { cn } from '@/utils/cn'

/**
 * Campos del formulario. Reglas comunes (sección 23):
 * - Todo control tiene un `<label>` real asociado, no un placeholder.
 * - Los grupos de opciones son `<fieldset>` con `<legend>`.
 * - El error se asocia con `aria-describedby` y se marca con `aria-invalid`.
 * - Ningún estado se comunica solo con color: lo marcado lleva también su
 *   casilla marcada y un icono; el error lleva icono y texto.
 *
 * Las casillas y radios son controles NATIVOS a propósito. Reimplementarlos
 * con `appearance: none` se ve más "de diseño" y rompe el modo de alto
 * contraste de Windows, donde el dibujo propio desaparece.
 */

const controlBase =
  'w-full rounded-field bg-surface px-4 text-ink ring-1 ring-line-strong transition-[box-shadow,background-color] duration-200 ease-(--ease-out-strong) placeholder:text-ink-muted/70 hover:ring-ink-muted'

interface FieldsetProps {
  legend: string
  hint?: string
  error?: string
  children: ReactNode
  /** El paso del asistente enfoca aquí al avanzar. */
  id?: string
}

export function Fieldset({ legend, hint, error, children, id }: FieldsetProps) {
  const hintId = useId()
  const errorId = useId()

  return (
    <fieldset
      id={id}
      className={cn(
        'rounded-panel bg-surface p-5 ring-1 transition-shadow duration-200 sm:p-6',
        error ? 'ring-2 ring-fit-low' : 'ring-line',
      )}
      aria-describedby={cn(hint && hintId, error && errorId) || undefined}
    >
      <legend className="px-1 font-display text-lg font-bold text-ink sm:text-xl">
        {legend}
      </legend>

      {hint ? (
        <p id={hintId} className="mt-1 text-sm text-ink-muted">
          {hint}
        </p>
      ) : null}

      <div className="mt-5">{children}</div>

      {error ? (
        <p
          id={errorId}
          role="alert"
          className="mt-4 flex items-start gap-2 rounded-field bg-fit-low-soft px-3 py-2.5 text-sm font-semibold text-fit-low-ink"
        >
          <Icon name="alert" className="h-5 w-5" />
          {error}
        </p>
      ) : null}
    </fieldset>
  )
}

/**
 * Estilo compartido por casillas y radios.
 *
 * La etiqueta envuelve la ficha entera: el objetivo táctil deja de ser el
 * cuadradito de 20px y pasa a ser toda la tarjeta, muy por encima del mínimo
 * de 44px. El texto de apoyo va DENTRO de la etiqueta a propósito, para que
 * el lector de pantalla lea la opción completa y no solo el titular.
 */
function optionTile(selected: boolean): string {
  return cn(
    'group flex cursor-pointer gap-3 rounded-field p-4 ring-1 transition-[background-color,box-shadow,transform] duration-200 ease-(--ease-out-strong) active:scale-[0.99]',
    selected
      ? 'bg-brand-soft ring-2 ring-action'
      : 'bg-surface ring-line-strong hover:bg-surface-muted hover:ring-ink-muted',
  )
}

const controlDot =
  'mt-0.5 h-5 w-5 shrink-0 cursor-pointer accent-[var(--color-action)]'

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
  return (
    <label className={optionTile(checked)}>
      <input
        type="checkbox"
        name={name}
        value={value}
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className={controlDot}
      />
      <span className="min-w-0">
        <span className="block font-semibold text-ink">{label}</span>
        {hint ? (
          <span className="mt-0.5 block text-sm text-ink-muted">{hint}</span>
        ) : null}
      </span>
    </label>
  )
}

interface RadioGroupProps<T extends string> {
  name: string
  options: Array<{ value: T; label: string }>
  value: T
  onChange: (value: T) => void
  /** Cuántas columnas como máximo. Las respuestas largas piden menos. */
  columns?: 1 | 2 | 3
}

export function RadioGroup<T extends string>({
  name,
  options,
  value,
  onChange,
  columns = 3,
}: RadioGroupProps<T>) {
  return (
    <div
      className={cn(
        'grid gap-3',
        columns === 3 && 'sm:grid-cols-3',
        columns === 2 && 'sm:grid-cols-2',
      )}
    >
      {options.map((option) => {
        const selected = value === option.value
        return (
          <label key={option.value} className={optionTile(selected)}>
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={selected}
              onChange={() => onChange(option.value)}
              className={controlDot}
            />
            <span className="font-semibold text-ink">{option.label}</span>
          </label>
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
  placeholder?: string
  onChange: (value: string) => void
}

export function TextAreaField({
  label,
  hint,
  value,
  maxLength = 400,
  placeholder,
  onChange,
}: TextAreaFieldProps) {
  const id = useId()
  const hintId = `${id}-hint`

  return (
    <div>
      <label htmlFor={id} className="block font-semibold text-ink">
        {label}
      </label>
      {hint ? (
        <p id={hintId} className="mt-1 text-sm text-ink-muted">
          {hint}
        </p>
      ) : null}
      <textarea
        id={id}
        rows={4}
        value={value}
        maxLength={maxLength}
        placeholder={placeholder}
        aria-describedby={hint ? hintId : undefined}
        onChange={(event) => onChange(event.target.value)}
        className={cn(controlBase, 'mt-3 py-3 leading-relaxed')}
      />
      {/* Contador solo visual: anunciarlo en cada tecla sería ruido. */}
      <p aria-hidden="true" className="mt-1 text-right text-xs text-ink-muted">
        {value.length} / {maxLength}
      </p>
    </div>
  )
}

interface TextFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  type?: 'text' | 'email' | 'search' | 'tel'
  hint?: string
  error?: string
  required?: boolean
  placeholder?: string
  autoComplete?: string
  /** Icono decorativo dentro del campo. */
  icon?: 'search'
}

export function TextField({
  label,
  value,
  onChange,
  type = 'text',
  hint,
  error,
  required,
  placeholder,
  autoComplete,
  icon,
}: TextFieldProps) {
  const id = useId()
  const hintId = `${id}-hint`
  const errorId = `${id}-error`

  return (
    <div>
      <label htmlFor={id} className="block font-semibold text-ink">
        {label}
        {required ? (
          <span className="ml-1 text-fit-low-ink">
            *<span className="sr-only"> (obligatorio)</span>
          </span>
        ) : null}
      </label>
      {hint ? (
        <p id={hintId} className="mt-1 text-sm text-ink-muted">
          {hint}
        </p>
      ) : null}
      <div className="relative mt-1.5">
        {icon ? (
          <Icon
            name={icon}
            className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-muted"
          />
        ) : null}
        <input
          id={id}
          type={type}
          value={value}
          required={required}
          placeholder={placeholder}
          autoComplete={autoComplete}
          aria-invalid={error ? true : undefined}
          aria-describedby={cn(hint && hintId, error && errorId) || undefined}
          onChange={(event) => onChange(event.target.value)}
          className={cn(
            controlBase,
            'h-12',
            icon && 'pl-11',
            error && 'ring-2 ring-fit-low',
          )}
        />
      </div>
      {error ? (
        <p
          id={errorId}
          className="mt-1.5 flex items-center gap-1.5 text-sm font-semibold text-fit-low-ink"
        >
          <Icon name="alert" className="h-4 w-4" />
          {error}
        </p>
      ) : null}
    </div>
  )
}

interface SelectFieldProps<T extends string> {
  label: string
  value: T | ''
  onChange: (value: T | '') => void
  options: Array<{ value: T; label: string }>
  /** Texto de la opción neutra. Si falta, el campo es obligatorio. */
  anyLabel?: string
  hint?: string
}

export function SelectField<T extends string>({
  label,
  value,
  onChange,
  options,
  anyLabel,
  hint,
}: SelectFieldProps<T>) {
  const id = useId()
  const hintId = `${id}-hint`

  return (
    <div>
      <label htmlFor={id} className="block font-semibold text-ink">
        {label}
      </label>
      {hint ? (
        <p id={hintId} className="mt-1 text-sm text-ink-muted">
          {hint}
        </p>
      ) : null}
      <select
        id={id}
        value={value}
        aria-describedby={hint ? hintId : undefined}
        onChange={(event) => onChange(event.target.value as T | '')}
        className={cn(controlBase, 'mt-1.5 h-12 cursor-pointer pr-10')}
      >
        {anyLabel !== undefined ? <option value="">{anyLabel}</option> : null}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}
