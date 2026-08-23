/**
 * Proveedor: la tienda, taller, emprendimiento o empresa que ofrece el
 * producto.
 *
 * Es la entidad central del modelo de negocio. ADAPTA no vende: centraliza
 * información dispersa y conecta a la persona con quien puede resolverle el
 * problema. El proveedor paga por estar listado; la persona no paga nada.
 *
 * Por eso una recomendación no termina en "esta prenda te sirve", sino en
 * "esta prenda te sirve y la conseguís acá".
 */

/** Qué tipo de negocio es. Determina qué puede resolver. */
export type ProviderKind =
  /** Fabrica o vende ropa y calzado adaptado. */
  | 'adaptive-apparel'
  /** Taller de costura que modifica prendas convencionales. */
  | 'adaptation-workshop'
  /** Prótesis, órtesis y dispositivos de implante. */
  | 'prosthetics'
  /** Sillas, andaderas, bastones y ayudas a la movilidad. */
  | 'mobility-aids'
  /** Utensilios y productos de apoyo para la vida diaria. */
  | 'daily-living-aids'

/**
 * Plan de inscripción. El negocio paga por estar en el directorio: es de
 * donde sale el ingreso de ADAPTA.
 *
 * P2 para el hackathon: el cobro real NO se implementa (sección 36, sin
 * pagos). El plan se muestra porque cambia la visibilidad en el directorio,
 * y eso sí es parte de la demo.
 */
export type ProviderPlan = 'free' | 'verified' | 'featured'

export interface ProviderContact {
  /** Sitio web o perfil donde la persona termina el proceso. */
  website?: string
  phone?: string
  email?: string
}

export interface Provider {
  id: string
  name: string
  kind: ProviderKind
  /** Descripción corta, escrita por el propio negocio. */
  description: string
  /** Ciudad o región. El acceso físico importa para prótesis y talleres. */
  location: string
  /** Si además atiende a distancia. */
  shipsNationwide: boolean
  contact: ProviderContact
  plan: ProviderPlan
  /**
   * El equipo de ADAPTA revisó que el negocio existe y que lo que dice
   * ofrecer, lo ofrece. No es una valoración de calidad.
   */
  verified: boolean
}

export const providerKindLabels: Record<ProviderKind, string> = {
  'adaptive-apparel': 'Ropa y calzado adaptado',
  'adaptation-workshop': 'Taller de adaptación',
  prosthetics: 'Prótesis y órtesis',
  'mobility-aids': 'Ayudas a la movilidad',
  'daily-living-aids': 'Productos de apoyo',
}

export const providerPlanLabels: Record<ProviderPlan, string> = {
  free: 'Listado básico',
  verified: 'Verificado',
  featured: 'Destacado',
}
