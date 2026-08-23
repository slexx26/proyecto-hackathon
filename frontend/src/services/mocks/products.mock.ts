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
    providerId: 'prv-001',
    name: 'Camisa Vera de cierre magnético',
    brand: 'Vera Studio',
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
    providerId: 'prv-002',
    name: 'Pantalón Ronda de apertura lateral',
    brand: 'Ronda',
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
    providerId: 'prv-002',
    name: 'Tenis Paso sin cordones',
    brand: 'Paso',
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
    providerId: 'prv-007',
    name: 'Buzo Calma sin costuras',
    brand: 'Calma',
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
    providerId: 'prv-002',
    name: 'Chaqueta Norte con acceso de brazo',
    brand: 'Norte',
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
    providerId: 'prv-008',
    name: 'Camisa Clásica de botón',
    brand: 'Lienzo',
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
    providerId: 'prv-002',
    name: 'Falda Vuelta con velcro',
    brand: 'Vuelta',
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
    providerId: 'prv-007',
    name: 'Camiseta Puerto con puerto de acceso',
    brand: 'Puerto',
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
  {
    id: 'adp-009',
    providerId: 'prv-004',
    name: 'Prótesis mioeléctrica de mano',
    brand: 'Ortopedia Meseta',
    category: 'prosthetics',
    price: 4200000,
    currency: 'CRC',
    description:
      'Prótesis de mano accionada por señales musculares del antebrazo. Incluye valoración, molde, ajuste y tres sesiones de entrenamiento.',
    images: [
      {
        url: '/products/protesis-mano.svg',
        alt: 'Prótesis de mano de color gris con articulaciones en los dedos',
      },
    ],
    adaptationNeeds: ['prosthesis-friendly', 'one-handed-dressing', 'adjustable-fit'],
    closureType: 'none',
    materials: ['Fibra de carbono', 'Silicona médica'],
    limitations: [
      'Requiere valoración presencial: no se puede encargar en línea.',
      'El precio varía según el nivel de amputación y la cobertura del seguro.',
    ],
    sizes: ['A medida'],
    inStock: true,
  },
  {
    id: 'adp-010',
    providerId: 'prv-004',
    name: 'Órtesis de tobillo y pie',
    brand: 'Ortopedia Meseta',
    category: 'orthotics',
    price: 310000,
    currency: 'CRC',
    description:
      'Órtesis termoconformada que estabiliza el tobillo y corrige el pie caído al caminar. Se usa dentro del calzado.',
    images: [
      {
        url: '/products/ortesis-tobillo.svg',
        alt: 'Órtesis blanca en forma de L que cubre la pantorrilla y la planta del pie',
      },
    ],
    adaptationNeeds: ['prosthesis-friendly', 'adjustable-fit'],
    closureType: 'velcro',
    materials: ['Polipropileno', 'Forro de espuma'],
    limitations: [
      'Necesita calzado de horma ancha y profundidad extra: no entra en un tenis estándar.',
    ],
    sizes: ['A medida'],
    inStock: true,
  },
  {
    id: 'adp-011',
    providerId: 'prv-005',
    name: 'Silla de ruedas manual ultraligera',
    brand: 'Movilidad Norte',
    category: 'mobility',
    price: 890000,
    currency: 'CRC',
    description:
      'Chasis rígido de aluminio de 9 kg, respaldo regulable y ejes de liberación rápida para meterla al carro.',
    images: [
      {
        url: '/products/silla-ultraligera.svg',
        alt: 'Silla de ruedas de chasis azul con ruedas traseras grandes inclinadas',
      },
    ],
    adaptationNeeds: ['seated-wearing', 'adjustable-fit'],
    closureType: 'none',
    materials: ['Aluminio aeronáutico', 'Tapicería de nylon'],
    limitations: [
      'El chasis rígido no se pliega: se desarma en piezas para transportarla.',
      'Requiere fuerza de brazos para autopropulsarse en cuesta.',
    ],
    sizes: ['38 cm', '40 cm', '45 cm'],
    inStock: true,
  },
  {
    id: 'adp-012',
    providerId: 'prv-006',
    name: 'Abotonador de mango grueso',
    brand: 'Cotidiano',
    category: 'daily-living',
    price: 9500,
    currency: 'CRC',
    description:
      'Gancho de alambre con mango de 3 cm de diámetro. Pasa el botón por el ojal con una sola mano y sin pinza fina.',
    images: [
      {
        url: '/products/abotonador.svg',
        alt: 'Utensilio con mango grueso de color naranja y gancho de alambre en la punta',
      },
    ],
    adaptationNeeds: ['one-handed-dressing', 'no-fine-motor'],
    closureType: 'none',
    materials: ['Acero inoxidable', 'Mango de espuma'],
    limitations: [
      'Sirve para botones medianos y grandes. Con botones muy pequeños sigue siendo difícil.',
    ],
    sizes: ['Talla única'],
    inStock: true,
  },
  {
    id: 'adp-013',
    providerId: 'prv-006',
    name: 'Calzador de mango largo',
    brand: 'Cotidiano',
    category: 'daily-living',
    price: 7800,
    currency: 'CRC',
    description:
      'Calzador de 60 cm con mango curvo. Permite ponerse el zapato sentado, sin agacharse ni doblar la cadera.',
    images: [
      {
        url: '/products/calzador.svg',
        alt: 'Calzador metálico largo con mango curvo en un extremo',
      },
    ],
    adaptationNeeds: ['seated-wearing', 'one-handed-dressing', 'no-fine-motor'],
    closureType: 'none',
    materials: ['Aluminio anodizado'],
    limitations: [
      'No sustituye un calzado sin cordones: solo ayuda a meter el pie.',
    ],
    sizes: ['60 cm'],
    inStock: true,
  },
  {
    id: 'adp-014',
    providerId: 'prv-003',
    name: 'Servicio de adaptación de prenda propia',
    brand: 'Taller Puntada Abierta',
    category: 'accessories',
    price: 15000,
    currency: 'CRC',
    description:
      'Llevás una prenda que ya tenés y la modifican: cambio de botones por imanes, apertura de costura lateral, retiro de etiquetas o argolla de tiro. Precio desde, según el trabajo.',
    images: [
      {
        url: '/products/servicio-adaptacion.svg',
        alt: 'Máquina de coser con una prenda en proceso de modificación',
      },
    ],
    adaptationNeeds: [
      'magnetic-closure',
      'no-fine-motor',
      'sensory-friendly',
      'seated-wearing',
      'easy-access-medical',
    ],
    closureType: 'none',
    materials: ['Depende de la prenda'],
    limitations: [
      'Atención solo presencial en Cartago: hay que llevar la prenda al taller.',
      'Algunas modificaciones no se pueden revertir sin dejar marca.',
    ],
    sizes: ['La de tu prenda'],
    inStock: true,
  },
]
