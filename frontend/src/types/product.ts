/**
 * Espejo de los schemas Pydantic de `backend/schemas/product.py`.
 * Si cambia uno, cambia el otro en el mismo PR (sección 19).
 *
 * Sin `enum`: tsconfig usa `erasableSyntaxOnly`. Uniones de strings.
 */

export type ProductCategory =
  | 'tops'
  | 'bottoms'
  | 'outerwear'
  | 'footwear'
  | 'underwear'
  | 'accessories'
  /* El catálogo no es solo ropa: el problema que ADAPTA centraliza incluye
     prótesis, ayudas a la movilidad y productos de apoyo diario. */
  | 'prosthetics'
  | 'orthotics'
  | 'mobility'
  | 'daily-living'

/**
 * Necesidades funcionales que una prenda puede cubrir. Describen la PRENDA,
 * nunca a la persona: es la misma lista que usa el perfil, y el motor de
 * compatibilidad cruza ambas (sección 10).
 */
export type AdaptationNeed =
  | 'one-handed-dressing'
  | 'seated-wearing'
  | 'magnetic-closure'
  | 'no-fine-motor'
  | 'sensory-friendly'
  | 'easy-access-medical'
  | 'prosthesis-friendly'
  | 'adjustable-fit'
  | 'thermoregulation'

/** Cierres relevantes para destreza manual. */
export type ClosureType =
  | 'magnetic'
  | 'velcro'
  | 'zipper-loop'
  | 'zipper'
  | 'buttons'
  | 'elastic'
  | 'none'

export interface ProductImage {
  url: string
  alt: string
}

export interface Product {
  id: string
  name: string
  /** Marca del producto. Puede diferir del proveedor que lo vende. */
  brand: string
  /** Quién lo ofrece. Referencia a `Provider.id` (ver `provider.ts`). */
  providerId: string
  category: ProductCategory
  price: number
  currency: string
  description: string
  images: ProductImage[]
  /** Necesidades que la prenda cubre de fábrica. */
  adaptationNeeds: AdaptationNeed[]
  closureType: ClosureType
  materials: string[]
  /** Texto corto y honesto sobre lo que la prenda NO resuelve. */
  limitations: string[]
  sizes: string[]
  inStock: boolean
}

/** Filtros de la vista de catálogo (sección 14). Todos opcionales. */
export interface ProductFilters {
  search?: string
  category?: ProductCategory
  adaptationNeed?: AdaptationNeed
  /** Filtra por proveedor concreto. */
  providerId?: string
}
