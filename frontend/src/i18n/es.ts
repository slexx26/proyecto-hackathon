/**
 * Diccionario español. Es la FUENTE: define qué claves existen, y el inglés
 * se tipa contra él, así que una clave sin traducir rompe la compilación.
 *
 * Convención de claves: `pantalla.elemento`. Los códigos que viajan por la
 * API llevan su propio prefijo (`need.`, `category.`, `providerKind.`…), y se
 * usan con plantilla: t(`need.${need}`). Eso mantiene la frontera de la
 * sección 19: la API habla en códigos estables, la interfaz habla en idiomas.
 *
 * Los plurales van en pares `.one` / `.other` y se piden con `plural()`.
 */
export const es = {
  // ---------------------------------------------------------------- común
  'common.skipToContent': 'Saltar al contenido principal',
  'common.homeSuffix': '— inicio',
  'common.start': 'Empezar',
  'common.openMenu': 'Abrir menú',
  'common.closeMenu': 'Cerrar menú',
  'common.breadcrumb': 'Migas de pan',
  'common.retry': 'Reintentar',
  'common.required': '(obligatorio)',
  'common.website': 'Sitio web',
  'common.externalLink': 'de {name}, se abre en una pestaña nueva',
  'common.back': 'Atrás',
  'common.next': 'Siguiente',

  // ---------------------------------------------------------- preferencias
  'theme.groupLabel': 'Tema de la interfaz',
  'theme.footerTitle': 'Apariencia',
  'theme.toDark': 'Activar modo oscuro',
  'theme.toLight': 'Activar modo claro',
  'theme.system': 'Sistema',
  'theme.light': 'Claro',
  'theme.dark': 'Oscuro',

  'lang.groupLabel': 'Idioma de la interfaz',
  'lang.footerTitle': 'Idioma',
  'lang.es': 'Español',
  'lang.en': 'English',
  'lang.esShort': 'ES',
  'lang.enShort': 'EN',
  'lang.note':
    'Traduce la interfaz. El catálogo llega del directorio y se muestra en su idioma original.',

  // --------------------------------------------------------- navegación
  'nav.main': 'Principal',
  'nav.mainMobile': 'Principal (móvil)',
  'nav.findMyFit': 'Find My Fit',
  'nav.recommendations': 'Recomendaciones',
  'nav.catalog': 'Catálogo',
  'nav.providers': 'Negocios',

  // ---------------------------------------------------------------- pie
  'footer.tagline': 'Fashion should adapt to you.',
  'footer.blurb':
    'Reunimos en un solo lugar a los negocios de moda y vida accesible, cruzamos tu forma real de vestirte con lo que ofrecen y te decimos a quién acudir.',
  'footer.forYou': 'Para vos',
  'footer.forBusiness': 'Para tu negocio',
  'footer.yourRecommendations': 'Tus recomendaciones',
  'footer.fullCatalog': 'Catálogo completo',
  'footer.directory': 'Directorio de negocios',
  'footer.listBusiness': 'Inscribí tu negocio',
  'footer.disclaimer':
    'Proyecto de hackathon. El catálogo, las marcas, los negocios y los precios son ficticios y existen solo para la demostración. ADAPTA no da consejo médico ni sustituye la valoración de un profesional de la salud.',
  'footer.credits': 'Hecho por Slater, José e Isaac · 2026',

  // ------------------------------------------------------------- errores
  'error.notFound': 'No encontramos lo que buscabas.',
  'error.offline': 'No pudimos conectar con el servidor. Revisa tu conexión.',
  'error.server':
    'El servidor tuvo un problema. Inténtalo de nuevo en un momento.',
  'error.generic': 'Algo salió mal. Inténtalo de nuevo.',
  'error.unknown': 'Error desconocido.',
  'states.loadErrorTitle': 'No pudimos cargar esto',

  // ---------------------------------------------------- puntaje y razones
  'score.high': 'Encaja muy bien',
  'score.mid': 'Encaja en parte',
  'score.low': 'Encaja poco',
  'score.screenReader': 'Compatibilidad {score} de 100. {tier}.',
  'reason.match': 'Cubierto',
  'reason.partial': 'Cubierto en parte',
  'reason.gap': 'No cubierto',

  // --------------------------------------------------- códigos de la API
  'need.one-handed-dressing': 'Vestirse con una mano',
  'need.seated-wearing': 'Vestirse sentada o sentado',
  'need.magnetic-closure': 'Cierre magnético',
  'need.no-fine-motor': 'Sin pinza fina',
  'need.sensory-friendly': 'Amable con la sensibilidad',
  'need.easy-access-medical': 'Acceso para cuidados médicos',
  'need.prosthesis-friendly': 'Compatible con prótesis',
  'need.adjustable-fit': 'Ajuste regulable',
  'need.thermoregulation': 'Regula la temperatura',

  'needHint.one-handed-dressing':
    'Necesito poder ponerme y quitarme la prenda usando una sola mano.',
  'needHint.seated-wearing':
    'Me visto sentada, sentado o acostado, sin levantar las caderas.',
  'needHint.magnetic-closure':
    'Prefiero imanes en lugar de botones o cierres pequeños.',
  'needHint.no-fine-motor':
    'Me cuesta agarrar cosas pequeñas o hacer fuerza con los dedos.',
  'needHint.sensory-friendly':
    'Las costuras, etiquetas o ciertas texturas me molestan mucho.',
  'needHint.easy-access-medical':
    'Uso sonda, catéter, puerto o similar y necesito acceso sin desvestirme.',
  'needHint.prosthesis-friendly':
    'Uso prótesis u órtesis y la ropa debe acomodarlas.',
  'needHint.adjustable-fit':
    'Mi talla o volumen cambia durante el día y necesito poder ajustar.',
  'needHint.thermoregulation': 'Me cuesta regular la temperatura del cuerpo.',

  'category.tops': 'Parte de arriba',
  'category.bottoms': 'Parte de abajo',
  'category.outerwear': 'Abrigos',
  'category.footwear': 'Calzado',
  'category.underwear': 'Ropa interior',
  'category.accessories': 'Accesorios y servicios',
  'category.prosthetics': 'Prótesis',
  'category.orthotics': 'Órtesis',
  'category.mobility': 'Movilidad',
  'category.daily-living': 'Apoyo diario',

  'closure.magnetic': 'Cierre magnético',
  'closure.velcro': 'Velcro',
  'closure.zipper-loop': 'Cierre con argolla de tiro',
  'closure.zipper': 'Cierre convencional',
  'closure.buttons': 'Botones',
  'closure.elastic': 'Elástico',
  'closure.none': 'Sin cierre',

  'assistance.independent': 'Me visto por mi cuenta',
  'assistance.partial-help': 'Necesito ayuda para algunas prendas',
  'assistance.full-help': 'Otra persona me ayuda a vestirme',

  'dexterity.both-hands': 'Uso las dos manos sin dificultad',
  'dexterity.one-hand': 'Uso una sola mano',
  'dexterity.limited-grip': 'Tengo poca fuerza o precisión en las manos',

  'posture.standing': 'De pie',
  'posture.seated': 'Sentada o sentado',
  'posture.lying-down': 'Acostada o acostado',

  'sensory.none': 'No me afecta',
  'sensory.mild': 'Me molesta un poco',
  'sensory.high': 'Me molesta mucho',

  'effort.low': 'Arreglo sencillo',
  'effort.medium': 'Requiere taller',
  'effort.high': 'Modificación mayor',

  'providerKind.adaptive-apparel': 'Ropa y calzado adaptado',
  'providerKind.adaptation-workshop': 'Taller de adaptación',
  'providerKind.prosthetics': 'Prótesis y órtesis',
  'providerKind.mobility-aids': 'Ayudas a la movilidad',
  'providerKind.daily-living-aids': 'Productos de apoyo',

  'providerPlan.free': 'Listado básico',
  'providerPlan.verified': 'Verificado',
  'providerPlan.featured': 'Destacado',
  // ------------------------------------------------------------- landing
  'landing.docTitle': 'Ropa que se adapta a vos',
  'landing.eyebrow': 'Moda y vida accesible, con IA',
  'landing.h1': 'La ropa debería adaptarse a vos.',
  'landing.lead':
    'Vestirse no debería depender de si podés abrochar un botón. ADAPTA reúne a los negocios que hacen ropa, calzado, prótesis y ayudas técnicas adaptadas, cruza tu forma real de vestirte con lo que ofrecen, y te dice qué te sirve, por qué, y a quién acudir.',
  'landing.ctaFit': 'Encontrá tu fit',
  'landing.ctaCatalog': 'Ver el catálogo',
  'landing.ctaBusiness': 'Tengo un negocio',
  'landing.reassure': 'Toma dos minutos. Gratis, sin registro y sin datos médicos.',
  'landing.previewLabel': 'Así se ve un resultado',
  'landing.previewReason1': 'Se abrocha con una sola mano',
  'landing.previewReason2': 'No exige pinza fina',
  'landing.previewReason3': 'Los imanes requieren consulta si usás marcapasos',
  'landing.previewWhere': 'Dónde conseguirlo:',
  'landing.scopeTitle': 'Un directorio, seis rubros',
  'landing.scopeApparel': 'Ropa adaptada',
  'landing.scopeFootwear': 'Calzado',
  'landing.scopeProsthetics': 'Prótesis y órtesis',
  'landing.scopeMobility': 'Movilidad',
  'landing.scopeDaily': 'Apoyo diario',
  'landing.scopeWorkshops': 'Talleres de adaptación',
  'landing.problemTitle': 'Para mucha gente, comprar ropa es adivinar.',
  'landing.problemPersonTitle': 'Del lado de la persona',
  'landing.problemPersonBody':
    'Las tiendas describen talla, color y material. Ninguna dice si la prenda se puede poner con una mano, si se abrocha estando sentada, o si la costura interna va a molestar. Se compra, se prueba y se devuelve.',
  'landing.problemBusinessTitle': 'Del lado del negocio',
  'landing.problemBusinessBody':
    'El taller, la ortopedia y el emprendimiento tienen el producto que alguien necesita hoy, y no tienen cómo llegar a esa persona. Su cliente los está buscando y no los encuentra.',
  'landing.problemPull':
    'La información existe. Lo que no existe es un lugar donde esté junta y ordenada por lo que de verdad le sirve a cada persona.',
  'landing.howTitle': 'Cómo funciona',
  'landing.step1Title': 'Contá cómo te vestís',
  'landing.step1Body':
    'Cuatro pasos cortos sobre barreras concretas: cierres, postura, sensibilidad. Nada de diagnósticos ni de medidas del cuerpo.',
  'landing.step2Title': 'Calculamos la compatibilidad',
  'landing.step2Body':
    'Un motor de reglas compara tu perfil con las características reales de cada producto y devuelve un puntaje reproducible.',
  'landing.step3Title': 'Te decimos dónde conseguirlo',
  'landing.step3Body':
    'La IA explica por qué encaja y qué modificación haría falta, y te conecta con el negocio que lo vende o lo adapta.',
  'landing.engineEyebrow': 'El diferenciador',
  'landing.engineTitle': 'El puntaje no se lo inventa la IA.',
  'landing.engineLead':
    'La compatibilidad sale de reglas deterministas escritas por nosotros. La IA llega después: lee esa evidencia y la traduce a lenguaje humano. Nunca puede cambiar el número. El mismo perfil da siempre el mismo resultado, y por eso se puede verificar.',
  'landing.engineNode1': 'Tu perfil',
  'landing.engineNode2': 'Motor determinista',
  'landing.engineNode3': 'Puntaje 0–100',
  'landing.engineNode4': 'La IA lo explica',
  'landing.engineNote':
    'Cada recomendación muestra la evidencia que la sostiene, línea por línea: qué necesidad cubre, cuál cubre a medias y cuál no cubre. Nada de "confiá en el algoritmo".',
  'landing.valuesTitle': 'En qué nos diferenciamos',
  'landing.value1Title': 'Las limitaciones se dicen',
  'landing.value1Body':
    'Cada producto muestra también lo que no resuelve. Preferimos una recomendación honesta a una venta.',
  'landing.value2Title': 'La ropa que ya existe también sirve',
  'landing.value2Body':
    'Si una prenda convencional casi encaja, te proponemos cómo adaptarla, con el beneficio y el costo reales de hacerlo.',
  'landing.value3Title': 'No es solo ropa',
  'landing.value3Body':
    'Calzado, prótesis, órtesis, sillas de ruedas y productos de apoyo diario. Lo que hoy está disperso entre grupos de Facebook y recomendaciones de pasillo, en un solo lugar.',
  'landing.value4Title': 'Vos no pagás nada',
  'landing.value4Body':
    'Quien paga es el negocio que se inscribe en el directorio, porque le llevamos clientes. La persona que busca no paga ni entrega datos médicos.',
  'landing.closingTitle': 'Contanos cómo te vestís y hacemos el resto.',
  'landing.closingBody':
    'Cuatro pasos, ningún registro. Al final vas a ver el catálogo ordenado por lo que de verdad te sirve, y a quién acudir para conseguirlo.',

  // -------------------------------------------------------- Find My Fit
  'fit.docTitle': 'Find My Fit',
  'fit.h1': 'Contanos cómo te vestís hoy.',
  'fit.lead':
    'Preguntamos por barreras concretas, no por diagnósticos. Con eso calculamos qué tan bien encaja cada producto del directorio y te decimos dónde conseguirlo.',
  'fit.noAsk1': 'Tu diagnóstico o condición médica',
  'fit.noAsk2': 'Tu edad ni tus medidas corporales',
  'fit.noAsk3': 'Registro, correo ni contraseña',
  'fit.progressNav': 'Progreso del formulario',
  'fit.stepOf': 'Paso {current} de {total}',
  'fit.stepScreenReader': 'Paso {index}: {title}',
  'fit.stepDone': ' (completado)',
  'fit.step1Title': 'Barreras al vestirte',
  'fit.step1Short': 'Barreras',
  'fit.step2Title': 'Tu rutina al vestirte',
  'fit.step2Short': 'Rutina',
  'fit.step3Title': 'Sensibilidad y prioridades',
  'fit.step3Short': 'Prioridades',
  'fit.step4Title': 'Repaso antes de enviar',
  'fit.step4Short': 'Repaso',
  'fit.needsLegend': '¿Qué te cuesta al vestirte?',
  'fit.needsHint':
    'Marcá todo lo que aplique. Es la parte que más pesa en la recomendación.',
  'fit.needsError': 'Marcá al menos una barrera para poder recomendarte algo.',
  'fit.dexterityLegend': '¿Cómo usás las manos?',
  'fit.postureLegend': '¿En qué posición te vestís normalmente?',
  'fit.assistanceLegend': '¿Necesitás ayuda para vestirte?',
  'fit.sensoryLegend': '¿Te molestan costuras, etiquetas o texturas?',
  'fit.categoriesLegend': '¿Qué buscás ahora?',
  'fit.categoriesHint':
    'Opcional. Si no marcás nada, te mostramos todo el catálogo.',
  'fit.notesLegend': '¿Algo más que debamos saber?',
  'fit.notesLabel': 'Contalo con tus palabras',
  'fit.notesHint':
    'Opcional. Lo usamos para afinar la explicación, no para calcular el puntaje.',
  'fit.notesPlaceholder':
    'Por ejemplo: uso una férula en la mano derecha y los puños ajustados no me pasan.',
  'fit.summaryTitle': 'Esto es lo que vamos a usar',
  'fit.summaryHint': 'Si algo no encaja, volvé al paso correspondiente arriba.',
  'fit.summaryNeeds': 'Barreras marcadas',
  'fit.summaryNoNeeds':
    'Ninguna. Volvé al paso 1: sin esto no podemos recomendar.',
  'fit.summaryHands': 'Manos',
  'fit.summaryPosture': 'Postura',
  'fit.summaryHelp': 'Ayuda',
  'fit.summarySensitivity': 'Sensibilidad',
  'fit.summaryCategories': 'Categorías',
  'fit.summaryAllCategories': 'Todas',
  'fit.submit': 'Ver mis recomendaciones',
  'fit.submitting': 'Buscando prendas…',
  'fit.privacy': 'Tu perfil se guarda solo en esta pestaña y se borra al cerrarla.',

  // ---------------------------------------------------- recomendaciones
  'reco.docTitle': 'Tus recomendaciones',
  'reco.h1': 'Tus recomendaciones',
  'reco.lead':
    'Ordenadas por compatibilidad con tu perfil. El puntaje lo calcula nuestro motor con reglas fijas; la IA solo lo explica.',
  'reco.noProfileTitle': 'Todavía no tenemos tu perfil',
  'reco.noProfileBody':
    'Necesitamos saber cómo te vestís para poder calcular la compatibilidad de cada producto. Son cuatro pasos y no pedimos datos médicos.',
  'reco.noProfileCta': 'Completar Find My Fit',
  'reco.profileTitle': 'Perfil que estamos usando',
  'reco.adjust': 'Ajustar mi perfil',
  'reco.onlyGood': 'Mostrar solo las que encajan bien',
  'reco.onlyGoodHint': '(60 o más)',
  'reco.loading': 'Calculando compatibilidad…',
  'reco.emptyTitle': 'Ninguna prenda supera el umbral',
  'reco.emptyFiltered':
    'Probá quitando el filtro: hay productos con compatibilidad parcial que se pueden adaptar en un taller.',
  'reco.emptyAll':
    'No encontramos productos para este perfil. Probá marcando menos categorías preferidas.',
  'reco.count.one': '{count} producto encontrado',
  'reco.count.other': '{count} productos encontrados',
  'reco.hidden.one': '{count} oculto por el filtro',
  'reco.hidden.other': '{count} ocultos por el filtro',
  'reco.aiTitle': 'Lo que dice la IA',
  'reco.aiUnavailable':
    'La explicación en lenguaje natural no está disponible ahora mismo. Abajo tenés la evidencia con la que se calculó el puntaje.',
  'reco.evidenceTitle': 'Evidencia del motor',
  'reco.adaptations.one': '{count} adaptación posible',
  'reco.adaptations.other': '{count} adaptaciones posibles',
  'reco.adaptationsTail': 'para cerrar lo que falta.',
  'reco.viewDetail': 'Ver detalle',
  'reco.viewDetailScreenReader': ' de {name}',

  // ------------------------------------------------- dónde conseguirlo
  'where.title': 'Dónde conseguirlo',
  'where.ships': 'Envía a todo el país.',
  'where.inPerson':
    'Atiende solo de forma presencial. Conviene llamar antes de ir.',

  // ------------------------------------------------------------ negocio
  'provider.verified': 'Verificado por ADAPTA',
  'provider.featured': 'Destacado',
  'provider.shipsNationwide': 'Envía a todo el país',
  'provider.inPersonOnly': 'Solo atención presencial',
  'provider.listed.one': '{count} producto listado',
  'provider.listed.other': '{count} productos listados',

  // ----------------------------------------------------------- producto
  'product.outOfStock': 'Sin existencias',
  'product.conventional': 'Prenda convencional',
  'product.moreNeeds': '+{count} más',
  'product.docTitleFallback': 'Producto',
  'product.loading': 'Cargando el producto…',
  'product.notFound': 'No encontramos este producto.',
  'product.backToCatalog': 'Volver al catálogo',
  'product.specCategory': 'Categoría',
  'product.specClosure': 'Cierre',
  'product.specMaterials': 'Materiales',
  'product.specSizes': 'Tallas',
  'product.solvesTitle': 'Qué resuelve',
  'product.noBuiltIn':
    'Es un producto convencional: no trae adaptaciones de fábrica. Mirá más abajo qué se le puede modificar.',
  'product.limitationsTitle': 'Lo que no resuelve',
  'product.compatibilityTitle': 'Tu compatibilidad',
  'product.noProfileBody':
    'Completá Find My Fit y te decimos qué tan bien encaja este producto con tu forma de vestirte, y qué se le podría adaptar.',
  'product.noProfileCta': 'Completar Find My Fit',
  'product.calculating': 'Calculando compatibilidad…',
  'product.compatibilityError':
    'No pudimos calcular la compatibilidad ahora mismo. Los datos del producto que ves arriba sí están completos.',
  'product.aiUnavailable':
    'La explicación en lenguaje natural no está disponible ahora mismo. La evidencia de al lado sostiene el puntaje por sí sola.',
  'product.adaptationsTitle': 'Adaptaciones posibles',
  'product.adaptationsLead':
    'Modificaciones que un taller de costura puede hacerle a este producto. Te mostramos siempre qué gana y qué no resuelve.',

  // -------------------------------------------------------- adaptaciones
  'adaptation.none':
    'Esta prenda ya cubre lo que necesitás: no hace falta modificarla.',
  'adaptation.benefit': 'Qué ganás',
  'adaptation.limitation': 'Qué sigue sin resolverse',
  'adaptation.request': 'Me interesa esta adaptación',
  'adaptation.requestScreenReader': ' de {name}',
  'adaptation.requested':
    'Anotado. Te avisaremos cuando haya un taller disponible para esta adaptación.',

  // ----------------------------------------------------------- catálogo
  'catalog.docTitle': 'Catálogo',
  'catalog.h1': 'Catálogo',
  'catalog.leadStart':
    'Todo lo que ofrecen los negocios inscritos: ropa, calzado, prótesis, órtesis, movilidad y productos de apoyo, con sus características de accesibilidad a la vista. Si querés verlo ordenado por lo que te sirve a vos,',
  'catalog.leadLink': 'completá Find My Fit',
  'catalog.search': 'Buscar',
  'catalog.searchPlaceholder': 'Camisa, silla, cierre…',
  'catalog.category': 'Categoría',
  'catalog.categoryAny': 'Todas',
  'catalog.need': 'Necesidad que cubre',
  'catalog.needAny': 'Cualquiera',
  'catalog.activeFilters': 'Filtros activos:',
  'catalog.removeFilter': 'Quitar este filtro',
  'catalog.clearAll': 'Limpiar todo',
  'catalog.loading': 'Cargando el catálogo…',
  'catalog.emptyTitle': 'Sin resultados',
  'catalog.emptyFiltered':
    'Ningún producto coincide con esos filtros. Probá quitando alguno.',
  'catalog.emptyAll': 'El catálogo está vacío por ahora.',
  'catalog.emptyCta': 'Ir a Find My Fit',
  'catalog.count.one': '{count} producto',
  'catalog.count.other': '{count} productos',
  'catalog.resultsHeading': 'Productos encontrados',

  // ---------------------------------------------------------- directorio
  'providers.docTitle': 'Negocios inscritos',
  'providers.h1': 'Negocios inscritos',
  'providers.lead':
    'Tiendas, talleres, ortopedias y proveedores de ayudas técnicas, en un solo lugar. Consultarlos es gratis: ADAPTA no te cobra nada ni te vende nada, te dice a quién acudir.',
  'providers.listCta': '¿Tenés un negocio de este tipo? Inscribilo acá',
  'providers.search': 'Buscar',
  'providers.searchPlaceholder': 'Nombre, especialidad o ciudad',
  'providers.verifiedOnly': 'Solo verificados',
  'providers.kindLegend': 'Filtrar por tipo de negocio',
  'providers.kindLabel': 'Tipo de negocio',
  'providers.kindAll': 'Todos',
  'providers.loading': 'Cargando los negocios…',
  'providers.emptyTitle': 'Ningún negocio coincide',
  'providers.emptyBody':
    'Probá quitando algún filtro o buscando por otra palabra.',
  'providers.emptyCta': 'Inscribir un negocio',
  'providers.count.one': '{count} negocio',
  'providers.count.other': '{count} negocios',
  'providers.verifiedCount': '{count} verificados',
  'providers.resultsHeading': 'Negocios encontrados',
  'providers.bandTitle': 'Tu cliente te está buscando acá.',
  'providers.bandBody':
    'Inscribirse pone tu negocio delante de la persona justo cuando describe el problema que vos resolvés. El listado básico es gratis.',
  'providers.bandCta': 'Ver los planes',

  // ------------------------------------------------- ficha del negocio
  'provider.docTitleFallback': 'Negocio',
  'provider.loading': 'Cargando el negocio…',
  'provider.notFound': 'No encontramos este negocio.',
  'provider.backToDirectory': 'Volver al directorio',
  'provider.coverage': 'Cobertura',
  'provider.registration': 'Inscripción',
  'provider.contact': 'Contacto',
  'provider.listedTitle': 'Lo que tiene listado',
  'provider.productsLoading': 'Cargando sus productos…',
  'provider.emptyTitle': 'Todavía no tiene productos listados',
  'provider.emptyBody':
    'El negocio está inscrito pero aún no cargó su catálogo. Podés contactarlo directamente con los datos de arriba.',
  'provider.disclaimer':
    'ADAPTA no vende estos productos ni cobra comisión por la venta. El negocio paga su inscripción en el directorio; a vos no te cobramos nada. La verificación confirma que el negocio existe y ofrece lo que dice: no es una valoración de su calidad.',

  // ------------------------------------------------------ para negocios
  'business.docTitle': 'Inscribí tu negocio',
  'business.eyebrow': 'Para negocios',
  'business.h1': 'Tus clientes te están buscando. Hoy no te encuentran.',
  'business.lead':
    'Quien necesita ropa adaptada, una prótesis o una silla de ruedas no sabe que existís: la información está dispersa entre grupos de Facebook, recomendaciones de pasillo y buscadores que devuelven catálogos de otro país. ADAPTA la centraliza y te pone delante de la persona justo cuando describe el problema que vos resolvés.',
  'business.ctaApply': 'Solicitar la inscripción',
  'business.ctaDirectory': 'Ver el directorio',
  'business.howTitle': 'Cómo funciona',
  'business.step1Title': 'Enviás la solicitud',
  'business.step1Body':
    'Cinco campos. No pedimos documentos ni datos bancarios en este paso.',
  'business.step2Title': 'Verificamos que existís',
  'business.step2Body':
    'Comprobamos que el negocio está activo y ofrece lo que dice. No evaluamos su calidad.',
  'business.step3Title': 'Aparecés en el directorio',
  'business.step3Body':
    'Y en las recomendaciones de las personas cuyo perfil encaja con lo que vendés.',
  'business.plansTitle': 'Planes de inscripción',
  'business.plansNotice':
    'Los precios son la propuesta comercial del proyecto. Durante el hackathon no se procesa ningún pago: la inscripción se coordina por correo después de recibir la solicitud.',
  'business.free': 'Gratis',
  'business.perMonth': '/ mes',
  'business.mostChosen': 'El más elegido',
  'business.planCta': 'Solicitar',
  'business.planCtaScreenReader': ' el plan {name}',
  'business.plan1Pitch': 'Para empezar a aparecer.',
  'business.plan1f1': 'Ficha en el directorio',
  'business.plan1f2': 'Hasta 3 productos listados',
  'business.plan1f3': 'Contacto visible',
  'business.plan2Pitch': 'Para que te encuentren y confíen.',
  'business.plan2f1': 'Todo lo del listado básico',
  'business.plan2f2': 'Insignia de verificación',
  'business.plan2f3': 'Productos ilimitados',
  'business.plan2f4': 'Aparece en las recomendaciones',
  'business.plan3Pitch': 'Para liderar tu rubro.',
  'business.plan3f1': 'Todo lo del plan verificado',
  'business.plan3f2': 'Posición prioritaria en el directorio',
  'business.plan3f3': 'Ficha ampliada con galería',
  'business.formTitle': 'Solicitar la inscripción',
  'business.sentTitle': 'Recibimos tu solicitud',
  'business.sentBody':
    'Te escribimos a {email} para verificar el negocio y coordinar la inscripción.',
  'business.sentDirectory': 'Ver el directorio',
  'business.sentAnother': 'Inscribir otro negocio',
  'business.fieldName': 'Nombre del negocio',
  'business.fieldKind': 'Tipo de negocio',
  'business.fieldLocation': 'Ubicación',
  'business.fieldLocationPlaceholder': 'Ciudad, provincia',
  'business.fieldEmail': 'Correo de contacto',
  'business.fieldEmailHint': 'Solo lo usamos para responderte sobre la inscripción.',
  'business.fieldDescription': 'Qué ofrecés',
  'business.fieldDescriptionHint':
    'Contá qué productos o servicios tenés y qué problema resuelven.',
  'business.fieldDescriptionPlaceholder':
    'Adaptamos prendas convencionales: cambio de cierres por imanes, aperturas laterales y ajustes para vestirse sentado.',
  'business.errName': 'Poné el nombre del negocio.',
  'business.errLocation': 'Decinos dónde atendés.',
  'business.errEmail': 'Necesitamos un correo para responderte.',
  'business.errEmailFormat': 'Ese correo no parece válido. Revisalo.',
  'business.errDescription': 'Contanos un poco más: al menos 20 caracteres.',
  'business.submit': 'Enviar solicitud',
  'business.submitting': 'Enviando…',
  'business.sendError': 'No pudimos enviar tu solicitud.',
  'business.noCharge': 'No se cobra nada en este paso.',

  // ------------------------------------------------------------- 404
  'notFound.docTitle': 'Página no encontrada',
  'notFound.code': 'Error 404',
  'notFound.title': 'Esta página no existe',
  'notFound.body':
    'Puede que el enlace esté mal escrito o que el producto ya no esté en el catálogo.',
  'notFound.home': 'Volver al inicio',
  'notFound.catalog': 'Ver el catálogo',

  // ------------------------------------------------------------- chat
  'chat.open': 'Preguntar',
  'chat.close': 'Cerrar ayuda',
  'chat.dialogLabel': 'Asistente de ADAPTA',
  'chat.headerSubtitle': 'Cierres, posturas y adaptaciones',
  'chat.greeting':
    '¡Hola! Puedo aclararte dudas sobre cierres, formas de vestirse y adaptaciones. ¿En qué te ayudo?',
  'chat.you': 'Vos: ',
  'chat.assistant': 'Asistente: ',
  'chat.typing': 'Escribiendo…',
  'chat.inputLabel': 'Escribí tu pregunta',
  'chat.placeholder': '¿Los imanes son seguros?',
  'chat.send': 'Enviar',
  'chat.sendError': 'No pudimos enviar tu mensaje.',
  'chat.disclaimer': 'Respuestas orientativas. No sustituyen consejo médico.',

  'product.illustrationAlt':
    'Ilustración de la categoría del producto',

  // ------------------------------------------------------------------ hero
  'hero.carousel': 'Presentación de ADAPTA',
  'hero.slide': 'Imagen {index} de {total}',
  'hero.goTo': 'Ir a la imagen {index} de {total}',
  'hero.announce': 'Imagen {index} de {total}. {alt}',
  'hero.photo1Alt':
    'Una mujer avanza por una pasarela de moda en silla de ruedas manual. Lleva una corona de flores rojas, un top azul sin mangas, un abrigo largo amarillo y una falda estampada en violeta y azul apoyada sobre las piernas. El público la mira desde la penumbra.',
  'hero.photo2Alt':
    'Un hombre sentado en un banco de madera apoya el brazo sobre la rodilla y mira a la cámara. Usa una prótesis de pierna de fibra de carbono con zapatilla deportiva. Fondo de estudio oscuro.',
  'hero.photo3Alt':
    'Una mujer sentada en un vestuario ajusta una de sus dos prótesis de pierna de fibra de carbono. Detrás hay una estantería con calzado y un bolso de deporte.',
} as const

export type TranslationKey = keyof typeof es
