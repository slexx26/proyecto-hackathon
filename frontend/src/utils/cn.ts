/**
 * Une clases condicionales. Deliberadamente mínimo: no resuelve conflictos
 * de Tailwind, así que las variantes se escriben sin solaparse.
 */
export function cn(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(' ')
}
