import type { Product } from '@/types/product'

/**
 * Catálogo de demostración.
 *
 * AVISO (sección 26): marcas y productos son FICTICIOS, creados para la
 * demo del hackathon. No representan empresas ni productos reales.
 *
 * El catálogo está diseñado para que el motor produzca diferencias claras:
 * hay prendas muy adaptadas, prendas convencionales y casos intermedios que
 * solo encajan tras una adaptación.
 */
export const mockProducts: Product[] = [
  {
    id: 'adp-001',
    name: 'Camisa Vera de cierre magnético',
    brand: 'Vera Studio (ficticia)',
    category: 'tops',
    price: 42000,
    currency: 'CRC',
    description:
      'Camisa de popelina con botones decorativos sobre cierre magnético oculto. Se abrocha con una sola mano y sin pinza fina.',
    images: [
      {
        url: '/products/camisa-vera.svg',
        alt: 'Camisa celeste de manga larga con botonadura frontal recta',
      },
    ],
    adaptationNeeds: [
      'one-handed-dressing',
      'magnetic-closure',
      'no-fine-motor',
      'seated-wearing',
    ],
    closureType: 'magnetic',
    materials: ['Algodón 97%', 'Elastano 3%'],
    limitations: [
      'Los imanes pueden interferir con marcapasos y desfibriladores: consultá con tu equipo de salud antes de usarla.',
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    inStock: true,
  },
  {
    id: 'adp-002',
    name: 'Pantalón Ronda de apertura lateral',
    brand: 'Ronda (ficticia)',
    category: 'bottoms',
    price: 51000,
    currency: 'CRC',
    description:
      'Pantalón con cierre lateral completo de cadera a tobillo. Permite vestirse sentado o acostado sin levantar las caderas.',
    images: [
      {
        url: '/products/pantalon-ronda.svg',
        alt: 'Pantalón gris recto con costura lateral marcada de arriba abajo',
      },
    ],
    adaptationNeeds: ['seated-wearing', 'easy-access-medical', 'adjustable-fit'],
    closureType: 'zipper-loop',
    materials: ['Poliéster reciclado 65%', 'Algodón 32%', 'Elastano 3%'],
    limitations: [
      'La apertura lateral requiere destreza para alinear el cierre; con agarre muy limitado conviene la versión de velcro.',
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    inStock: true,
  },
  {
    id: 'adp-003',
    name: 'Tenis Paso sin cordones',
    brand: 'Paso (ficticia)',
    category: 'footwear',
    price: 68000,
    currency: 'CRC',
    description:
      'Calzado con talón abatible y cierre elástico. Se calza empujando el pie, sin manos y sin agacharse.',
    images: [
      {
        url: '/products/tenis-paso.svg',
        alt: 'Tenis blanco y verde de perfil, con talón reforzado',
      },
    ],
    adaptationNeeds: [
      'one-handed-dressing',
      'no-fine-motor',
      'seated-wearing',
      'adjustable-fit',
    ],
    closureType: 'elastic',
    materials: ['Malla técnica', 'Suela de caucho'],
    limitations: [
      'La horma estándar no acomoda órtesis de tobillo voluminosas.',
    ],
    sizes: ['36', '38', '40', '42', '44'],
    inStock: true,
  },
  {
    id: 'adp-004',
    name: 'Buzo Calma sin costuras',
    brand: 'Calma (ficticia)',
    category: 'tops',
    price: 39000,
    currency: 'CRC',
    description:
      'Buzo tejido en una sola pieza, sin costuras internas ni etiquetas, con puños anchos que no aprietan.',
    images: [
      {
        url: '/products/buzo-calma.svg',
        alt: 'Buzo beige de cuello redondo, superficie lisa sin costuras visibles',
      },
    ],
    adaptationNeeds: [
      'sensory-friendly',
      'no-fine-motor',
      'thermoregulation',
      'seated-wearing',
    ],
    closureType: 'none',
    materials: ['Algodón orgánico 90%', 'Elastano 10%'],
    limitations: [
      'Al ser cerrado por la cabeza, no sirve si no podés levantar los brazos.',
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    inStock: true,
  },
  {
    id: 'adp-005',
    name: 'Chaqueta Norte con acceso de brazo',
    brand: 'Norte (ficticia)',
    category: 'outerwear',
    price: 87000,
    currency: 'CRC',
    description:
      'Chaqueta impermeable con aperturas de hombro a muñeca en ambos brazos, pensada para vestirse sentado sin sacar el brazo.',
    images: [
      {
        url: '/products/chaqueta-norte.svg',
        alt: 'Chaqueta azul marino con capucha y cierres verticales en las mangas',
      },
    ],
    adaptationNeeds: [
      'seated-wearing',
      'easy-access-medical',
      'one-handed-dressing',
      'prosthesis-friendly',
    ],
    closureType: 'zipper-loop',
    materials: ['Nylon reciclado', 'Membrana impermeable'],
    limitations: [
      'Es más pesada que una chaqueta convencional por las aperturas reforzadas.',
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    inStock: false,
  },
  {
    id: 'adp-006',
    name: 'Camisa Clásica de botón',
    brand: 'Lienzo (ficticia)',
    category: 'tops',
    price: 28000,
    currency: 'CRC',
    description:
      'Camisa de vestir convencional, con botonadura tradicional y puño abotonado. Incluida como referencia de lo que hoy existe en tienda.',
    images: [
      {
        url: '/products/camisa-clasica.svg',
        alt: 'Camisa blanca de vestir con botones tradicionales',
      },
    ],
    adaptationNeeds: [],
    closureType: 'buttons',
    materials: ['Algodón 100%'],
    limitations: [
      'Requiere pinza fina y dos manos. Es candidata a adaptación, no a uso directo.',
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    inStock: true,
  },
  {
    id: 'adp-007',
    name: 'Falda Vuelta con velcro',
    brand: 'Vuelta (ficticia)',
    category: 'bottoms',
    price: 34000,
    currency: 'CRC',
    description:
      'Falda cruzada que se cierra con dos bandas anchas de velcro. Se coloca por delante estando sentada.',
    images: [
      {
        url: '/products/falda-vuelta.svg',
        alt: 'Falda verde oliva cruzada, con solapa frontal',
      },
    ],
    adaptationNeeds: [
      'seated-wearing',
      'one-handed-dressing',
      'no-fine-motor',
      'adjustable-fit',
    ],
    closureType: 'velcro',
    materials: ['Lino 60%', 'Viscosa 40%'],
    limitations: [
      'El velcro engancha tejidos delicados; conviene cerrarlo antes de lavar.',
    ],
    sizes: ['S', 'M', 'L'],
    inStock: true,
  },
  {
    id: 'adp-008',
    name: 'Camiseta Puerto con puerto de acceso',
    brand: 'Puerto (ficticia)',
    category: 'tops',
    price: 31000,
    currency: 'CRC',
    description:
      'Camiseta con dos aperturas discretas en el pecho, cerradas con solapa, para acceso a catéter o puerto sin desvestirse.',
    images: [
      {
        url: '/products/camiseta-puerto.svg',
        alt: 'Camiseta gris de manga corta con dos solapas discretas en el pecho',
      },
    ],
    adaptationNeeds: [
      'easy-access-medical',
      'sensory-friendly',
      'seated-wearing',
      'no-fine-motor',
    ],
    closureType: 'velcro',
    materials: ['Modal 95%', 'Elastano 5%'],
    limitations: [
      'Las solapas son visibles bajo tejidos muy finos o de color claro.',
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    inStock: true,
  },
]
