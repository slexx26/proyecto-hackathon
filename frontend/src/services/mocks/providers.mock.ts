import type { Provider } from '@/types/provider'

/**
 * Directorio de demostración.
 *
 * AVISO (sección 26): todos estos negocios son FICTICIOS. Ninguno
 * corresponde a una empresa, taller o clínica real.
 *
 * Están diseñados para mostrar los tres planes de inscripción y los cinco
 * tipos de proveedor, incluidos los que no venden ropa.
 */
export const mockProviders: Provider[] = [
  {
    id: 'prv-001',
    name: 'Vera Studio',
    kind: 'adaptive-apparel',
    description:
      'Taller de confección especializado en camisería con cierre magnético. Producción propia y ajuste a medida.',
    location: 'San José, Costa Rica',
    shipsNationwide: true,
    contact: { website: 'https://ejemplo.test/vera', phone: '+506 0000 0001' },
    plan: 'featured',
    verified: true,
  },
  {
    id: 'prv-002',
    name: 'Ronda Adaptive',
    kind: 'adaptive-apparel',
    description:
      'Pantalones y faldas con apertura lateral, pensados para vestirse sentado. Catálogo por talla extendida.',
    location: 'Heredia, Costa Rica',
    shipsNationwide: true,
    contact: { website: 'https://ejemplo.test/ronda', email: 'hola@ejemplo.test' },
    plan: 'verified',
    verified: true,
  },
  {
    id: 'prv-003',
    name: 'Taller Puntada Abierta',
    kind: 'adaptation-workshop',
    description:
      'Modifican ropa que ya tenés: cambian botones por imanes, abren costuras, quitan etiquetas y añaden argollas de tiro.',
    location: 'Cartago, Costa Rica',
    shipsNationwide: false,
    contact: { phone: '+506 0000 0003' },
    plan: 'verified',
    verified: true,
  },
  {
    id: 'prv-004',
    name: 'Ortopedia Meseta',
    kind: 'prosthetics',
    description:
      'Prótesis de miembro superior e inferior, órtesis a medida y mantenimiento. Valoración presencial requerida.',
    location: 'San José, Costa Rica',
    shipsNationwide: false,
    contact: { website: 'https://ejemplo.test/meseta', phone: '+506 0000 0004' },
    plan: 'featured',
    verified: true,
  },
  {
    id: 'prv-005',
    name: 'Movilidad Norte',
    kind: 'mobility-aids',
    description:
      'Sillas de ruedas manuales y eléctricas, andaderas y bastones. Alquiler y venta.',
    location: 'Alajuela, Costa Rica',
    shipsNationwide: true,
    contact: { website: 'https://ejemplo.test/norte' },
    plan: 'free',
    verified: false,
  },
  {
    id: 'prv-006',
    name: 'Cotidiano',
    kind: 'daily-living-aids',
    description:
      'Utensilios de agarre grueso, abotonadores, calzadores largos y productos de apoyo para la vida diaria.',
    location: 'Puntarenas, Costa Rica',
    shipsNationwide: true,
    contact: { email: 'contacto@ejemplo.test' },
    plan: 'free',
    verified: false,
  },
  {
    id: 'prv-007',
    name: 'Calma Textil',
    kind: 'adaptive-apparel',
    description:
      'Tejido sin costuras para sensibilidad sensorial. Prendas de una sola pieza en algodón orgánico.',
    location: 'San José, Costa Rica',
    shipsNationwide: true,
    contact: { website: 'https://ejemplo.test/calma' },
    plan: 'verified',
    verified: true,
  },
  {
    id: 'prv-008',
    name: 'Lienzo',
    kind: 'adaptive-apparel',
    description:
      'Camisería clásica de confección tradicional. Listada porque su ropa es candidata frecuente a adaptación.',
    location: 'San José, Costa Rica',
    shipsNationwide: false,
    contact: { website: 'https://ejemplo.test/lienzo' },
    plan: 'free',
    verified: false,
  },
]

export function findProvider(providerId: string): Provider {
  const provider = mockProviders.find((item) => item.id === providerId)
  if (!provider) {
    throw new Error(`Proveedor desconocido: ${providerId}`)
  }
  return provider
}
