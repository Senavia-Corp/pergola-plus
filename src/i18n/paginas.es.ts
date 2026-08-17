/**
 * Registro de páginas estáticas traducidas al español.
 *
 * Cada entrada es una página publicable en /es/. Añadir una página traducida son
 * DOS cosas y ninguna más: una entrada aquí y su ruta en `TRADUCIDAS`
 * (src/i18n/index.ts, de donde salen el hreflang y los alternates del sitemap).
 *
 * El HTML migrado NO se duplica: se reutiliza el mismo fragmento que la versión
 * inglesa y `traducirHtml()` sustituye solo los nodos de texto. Así los `data-w-id`,
 * el bloque anti-FOUC, las clases y las imágenes quedan intactos, y las
 * interacciones IX2 funcionan igual que en inglés. Cualquier cambio de maquetación
 * llega solo a los dos idiomas.
 *
 * ORDEN EN QUE SE TRADUCE, y por qué este: primero la RUTA DE CONVERSIÓN — lo que
 * recorre un visitante desde que llega hasta que deja sus datos. Traducir una página
 * de blog antes que el formulario de presupuesto sería traducir la parte que no
 * convierte.
 *
 * Lo que NO está aquí no existe en /es/, no lleva `hreflang` y no entra en el
 * sitemap. Es deliberado: media traducción publicada es peor que ninguna, porque el
 * visitante llega en su idioma y se topa con inglés al segundo clic.
 */
import { COMUN_ES } from './comun.es';

export interface PaginaEs {
  /** Ruta inglesa. Tiene que estar también en TRADUCIDAS. */
  en: string;
  /** Ruta española. Los slugs NO se traducen (evita un segundo mapa de redirects). */
  es: string;
  title: string;
  description: string;
  /** Diccionario propio de la página. Se combina con COMUN_ES. */
  dic: Record<string, string>;
}

// ---------------------------------------------------------------------------
// /products
// ---------------------------------------------------------------------------
const PRODUCTOS: Record<string, string> = {
  'Luxury Pergolas &amp; Outdoor Shade Solutions':
    'Pérgolas de lujo y soluciones de sombra para exteriores',
  'Discover premium aluminum pergolas and custom outdoor shade solutions expertly designed and installed across South Florida, delivering durability, style, and elevated luxury outdoor living.':
    'Descubra nuestras pérgolas de aluminio premium y nuestras soluciones de sombra a medida, diseñadas e instaladas en todo el sur de Florida con durabilidad, estilo y una forma más elevada de vivir el exterior.',
  'Custom Motorized Louvered Pergola Systems':
    'Pérgolas de lamas motorizadas a medida',
  'Take full control of your outdoor space with our custom louvered pergolas. Engineered for South Florida, the adjustable aluminum louvers regulate sun and rain at the touch of a button. A sophisticated, all-season solution for luxury outdoor living.':
    'Tome el control total de su espacio exterior con nuestras pérgolas de lamas a medida. Diseñadas para el sur de Florida, las lamas de aluminio orientables regulan el sol y la lluvia con solo pulsar un botón. Una solución sofisticada para disfrutar del exterior todo el año.',
  'Modern Insulated Roof Pergolas': 'Pérgolas modernas de techo aislado',
  'Our insulated roof pergolas offer maximum thermal performance, reducing heat while providing full shade and rain protection. These engineered aluminum systems create a cooler, comfortable outdoor space—perfect for year-round use and architectural beauty.':
    'Nuestras pérgolas de techo aislado ofrecen el máximo rendimiento térmico: reducen el calor y dan sombra total y protección frente a la lluvia. Estos sistemas de aluminio calculados crean un espacio exterior más fresco y confortable, perfecto para usar todo el año y con una estética cuidada.',
  'Modern Polycarbonate Pergola Systems': 'Pérgolas modernas de policarbonato',
  'Our polycarbonate pergolas blend durability with natural light, blocking UV rays while maintaining brightness. Engineered for weather resistance, they are perfect for elegant patios and pool decks. Get a modern design that offers protection and openness.':
    'Nuestras pérgolas de policarbonato combinan durabilidad y luz natural: bloquean los rayos UV sin quitar luminosidad. Calculadas para resistir la intemperie, son perfectas para patios y bordes de piscina de diseño cuidado. Un diseño moderno que protege sin cerrar el espacio.',
  'Custom Open-Air Aluminum Pergolas': 'Pérgolas abiertas de aluminio a medida',
  'Define your outdoor living with our premium aluminum open-air pergolas. Custom-designed for luxury homes, these structures add architectural depth and property value while preserving airflow and sky views. The ultimate blend of style and open-air comfort.':
    'Defina su espacio exterior con nuestras pérgolas abiertas de aluminio premium. Diseñadas a medida para viviendas de lujo, aportan profundidad arquitectónica y valor a la propiedad sin renunciar a la ventilación ni a las vistas al cielo. La mezcla perfecta de estilo y confort al aire libre.',
  'Luxury Custom Outdoor Cabanas': 'Cabañas exteriores de lujo a medida',
  'Our custom aluminum cabanas create refined outdoor retreats with resort-inspired design. Engineered for durability and privacy, these structures provide shaded comfort while elevating the overall aesthetic of your pool area or backyard entertainment space.':
    'Nuestras cabañas de aluminio a medida crean refugios exteriores con un diseño de inspiración resort. Calculadas para durar y para dar privacidad, aportan sombra y confort a la vez que elevan la estética de su zona de piscina o de su jardín.',
  'Custom Screen Enclosures for Outdoor Living':
    'Cerramientos con mosquitero a medida',
  'Protect your outdoor space from insects and debris with our custom, fully permitted screen enclosures. Designed for South Florida, they preserve airflow and visibility, ensuring comfortable evenings while matching your home’s architectural integrity.':
    'Proteja su espacio exterior de insectos y suciedad con nuestros cerramientos con mosquitero a medida, con todos los permisos en regla. Pensados para el sur de Florida, mantienen la ventilación y las vistas para que las tardes sean cómodas, sin romper la línea arquitectónica de su casa.',
  'Integrated Motorized Screen Systems': 'Cortinas motorizadas integradas',
  'Motorized screens provide on-demand shade, privacy, and wind control with seamless automation. Designed to integrate into pergolas, patios, and covered outdoor spaces, these premium systems enhance comfort while maintaining a sleek, modern appearance.':
    'Las cortinas motorizadas dan sombra, privacidad y control del viento cuando usted quiere, con una automatización que no se nota. Pensadas para integrarse en pérgolas, patios y porches, aportan confort manteniendo una estética limpia y actual.',
  'Engineered Aluminum Carport Structures': 'Cocheras de aluminio calculadas',
  'Our aluminum carports protect luxury vehicles from harsh sun and rain while elevating your home’s architecture. Built for structural integrity and long-term durability, they offer premium, stylish protection. The perfect blend of strength and design.':
    'Nuestras cocheras de aluminio protegen los vehículos del sol y la lluvia y a la vez suman a la arquitectura de la casa. Construidas para aguantar y durar, ofrecen una protección premium con buen diseño. Resistencia y estética a partes iguales.',
  'Solar-Integrated Shade Structures': 'Estructuras de sombra con solar integrada',
  'Solar roof structures combine architectural strength with energy innovation. Engineered to support solar panel integration, these systems provide shade and weather protection while allowing homeowners to invest in sustainable, high-performance outdoor infrastructure.':
    'Las estructuras con techo solar unen solidez arquitectónica e innovación energética. Calculadas para integrar paneles solares, dan sombra y protección frente al clima a la vez que convierten el exterior en una inversión sostenible y de alto rendimiento.',
  'Sukkha 3000 Premium Louvered System': 'Sistema de lamas premium Sukkha 3000',
  'The Sukkha 3000 is a premium outdoor structure that merges cutting-edge engineering with contemporary design. Built for homeowners seeking the highest level of performance, durability, and customization, this system redefines what a luxury outdoor space can achieve.':
    'El Sukkha 3000 es una estructura exterior premium que une ingeniería de vanguardia y diseño contemporáneo. Pensado para quien busca el máximo en rendimiento, durabilidad y personalización, redefine hasta dónde puede llegar un espacio exterior de lujo.',
};

// ---------------------------------------------------------------------------
// /services
// ---------------------------------------------------------------------------
const SERVICIOS: Record<string, string> = {
  'Luxury Outdoor Construction &amp; Patio Services in South Florida':
    'Construcción exterior y servicios de patio de lujo en el sur de Florida',
  'We design and build custom pergolas, pavers, driveways, decks, fencing, and full patio remodeling projects across Miami-Dade, Broward, and Palm Beach County—engineered for Florida’s climate and luxury outdoor living.':
    'Diseñamos y construimos pérgolas a medida, adoquinado, entradas de coche, decks, vallado y reformas integrales de patio en Miami-Dade, Broward y Palm Beach, calculados para el clima de Florida y para vivir el exterior con calidad.',
  'Custom Pergolas &amp; Patio Covers': 'Pérgolas y cubiertas de patio a medida',
    Pavers: 'Adoquinado',
  Driveways: 'Entradas de coche',
    Concrete: 'Hormigón',
    Deck: 'Decks',
    Fence: 'Vallado',
    'Full Outdoor Remodel': 'Reforma integral del exterior',
  };

// ---------------------------------------------------------------------------
// /contact-us/*
// ---------------------------------------------------------------------------
const PRESUPUESTO: Record<string, string> = {
  'Request a Custom Pergola Quote': 'Solicite un presupuesto de pérgola a medida',
  'Every project we build is custom-designed, structurally engineered, and installed to meet South Florida wind-load and permitting requirements. This guided form allows us to understand your goals, property conditions, and investment level so we can prepare an accurate and professional proposal.':
    'Cada proyecto que construimos se diseña a medida, se calcula estructuralmente y se instala cumpliendo los requisitos de carga de viento y de permisos del sur de Florida. Este formulario guiado nos permite entender sus objetivos, las condiciones de la propiedad y el nivel de inversión para preparar una propuesta precisa y profesional.',
  'Tell us about your project!': 'Cuéntenos su proyecto',
  'Tell us about your patio or backyard project and receive a tailored proposal for a premium aluminum pergola or patio cover system.':
    'Cuéntenos qué quiere hacer en su patio o jardín y reciba una propuesta a medida para una pérgola de aluminio o una cubierta de patio premium.',
  'Which Shade Structure Are You Interested In?': '¿Qué estructura de sombra le interesa?',
  'Louvered Roof Pergola': 'Pérgola de techo de lamas',
  'Insulated Roof Pergola': 'Pérgola de techo aislado',
  'Polycarbonate Pergola': 'Pérgola de policarbonato',
  'Open-Air Pergola': 'Pérgola abierta',
  'Aluminum Cabana': 'Cabaña de aluminio',
  'Screen Enclosure': 'Cerramiento con mosquitero',
  'Aluminum Carport': 'Cochera de aluminio',
  'Solar Roof Structure': 'Estructura con techo solar',
  'Sukkha 3000 System': 'Sistema Sukkha 3000',
  'Not Sure – Need Guidance': 'No lo tengo claro, necesito orientación',
  'Estimated Project Budget:': 'Presupuesto estimado del proyecto:',
  'Under $15,000': 'Menos de $15,000',
  '$100,000+': '$100,000 o más',
  'We specialize in premium engineered systems built for long-term durability and property value.':
    'Estamos especializados en sistemas calculados de gama alta, construidos para durar y para revalorizar la propiedad.',
  'Would You Like To Include Any Enhancements?': '¿Quiere añadir alguna mejora?',
  'Integrated LED Lighting': 'Iluminación LED integrada',
  'Ceiling Fans': 'Ventiladores de techo',
  'Motorized Screens': 'Cortinas motorizadas',
  'Drainage System': 'Sistema de drenaje',
  'Outdoor Kitchen Integration': 'Integración de cocina exterior',
  'Paver Extension': 'Ampliación de adoquinado',
  'Project Property Address': 'Dirección de la propiedad',
  'Enter the address where the project will take place so we can confirm service availability and prepare an accurate estimate.':
    'Indique la dirección donde se hará el proyecto para que podamos confirmar que damos servicio en la zona y preparar un presupuesto ajustado.',
  'When Would You Like To Start?': '¿Cuándo le gustaría empezar?',
  'Immediately (0–30 days)': 'Cuanto antes (0–30 días)',
  '1–3 months': '1–3 meses',
  '3–6 months': '3–6 meses',
  'Planning for later': 'Lo estoy planificando para más adelante',
  'Just exploring': 'Solo estoy mirando',
  'Enter the street address': 'Escriba la calle y el número',
  'Enter the city': 'Escriba la ciudad',
  'Enter ZIP code': 'Escriba el código postal',
  'Contact Information': 'Datos de contacto',
  'Provide your contact details so our design team can review your request and guide you through the next steps.':
    'Déjenos sus datos para que nuestro equipo de diseño revise su solicitud y le acompañe en los siguientes pasos.',
  'Enter your full name': 'Escriba su nombre completo',
  'Enter your email': 'Escriba su correo electrónico',
  'Enter your phone': 'Escriba su teléfono',
  // OJO: lleva un espacio fino de no separacion (U+202F) antes del parentesis, no
  // un espacio normal. Invisible en el editor y suficiente para que la clave no
  // coincida y la linea se quede en ingles. Por eso el esqueleto de diccionario se
  // genera con scripts/extraer-traducibles.mjs --esqueleto y no se teclea a mano.
  "Monday - Friday (8:00 AM - 5:00 PM)": 'Lunes a viernes (8:00 – 17:00)',
  'Request Estimate': 'Pedir presupuesto',
  Back: 'Atrás',
  Next: 'Siguiente',
};

const CONTACTO: Record<string, string> = {
  'Get in touch': 'Hablemos',
  'From residential backyards to commercial spaces, our team is here to help you explore what’s possible in South Florida.':
    'Desde jardines de vivienda hasta espacios comerciales, nuestro equipo está para ayudarle a ver qué es posible en el sur de Florida.',
  Email: 'Correo electrónico',
  'Send us a message anytime': 'Escríbanos cuando quiera',
  Phone: 'Teléfono',
  'Call us during business hours': 'Llámenos en horario comercial',
  Office: 'Oficina',
  'Visit us in Boca Raton, Florida for consultations':
    'Visítenos en Boca Ratón, Florida, para una consulta',
  'By Appointment Only': 'Solo con cita previa',
  'Hours Of Service': 'Horario de atención',
  'Contact us during business hours': 'Contáctenos en horario comercial',
  // OJO: lleva un espacio fino de no separacion (U+202F) antes del parentesis, no
  // un espacio normal. Invisible en el editor y suficiente para que la clave no
  // coincida y la linea se quede en ingles. Por eso el esqueleto de diccionario se
  // genera con scripts/extraer-traducibles.mjs --esqueleto y no se teclea a mano.
  "Monday - Friday (8:00 AM - 5:00 PM)": 'Lunes a viernes (8:00 – 17:00)',
  'First name': 'Nombre',
  'Last name': 'Apellidos',
  'Phone number': 'Teléfono',
  'Select your project type:': 'Tipo de proyecto:',
  Residential: 'Residencial',
  Commercial: 'Comercial',
  'You are a:': 'Usted es:',
  Homeowner: 'Propietario de vivienda',
  Contractor: 'Contratista',
  'Business owner': 'Dueño de un negocio',
  'Property manager': 'Administrador de fincas',
  Architect: 'Arquitecto',
  Other: 'Otro',
  'Message:': 'Mensaje:',
  'Tell us more about what you need': 'Cuéntenos qué necesita',
  'Submit Inquiry': 'Enviar consulta',
  'Read More →': 'Leer más →',
  'We build custom pergolas, patio covers, and outdoor structures across Miami-Dade, delivering weather-resistant designs engineered for Florida sun, humidity, and coastal conditions. Our team provides licensed, insured installations throughout the region.':
    'Construimos pérgolas, cubiertas de patio y estructuras exteriores a medida por todo Miami-Dade, con diseños resistentes calculados para el sol, la humedad y el ambiente costero de Florida. Instalamos con licencia y seguro en toda la región.',
  'From Fort Lauderdale to Weston, we install premium aluminum pergolas, motorized louvered roofs, patio covers, and complete outdoor living systems throughout Broward County. Every project is built for durability, style, and long-term performance.':
    'De Fort Lauderdale a Weston, instalamos pérgolas de aluminio premium, techos de lamas motorizados, cubiertas de patio y sistemas completos de vida exterior por todo el condado de Broward. Cada proyecto se construye para durar, con buen diseño y rendimiento a largo plazo.',
  'We design and build pergolas, patio roofs, and outdoor shading systems throughout Palm Beach County, using high-grade materials that hold strong in Florida’s coastal environment.':
    'Diseñamos y construimos pérgolas, techos de patio y sistemas de sombra por todo el condado de Palm Beach, con materiales de alta calidad que aguantan el ambiente costero de Florida.',
};

const VISITA: Record<string, string> = {
  'Book a Free Design Consultation': 'Reserve una consulta de diseño gratuita',
  'Start your project with a personalized consultation to explore design options, system features, and the best aluminum pergola solution for your outdoor space.':
    'Empiece su proyecto con una consulta personalizada para ver opciones de diseño, prestaciones de cada sistema y qué pérgola de aluminio encaja mejor en su espacio.',
};

const NO_ENCONTRADA: Record<string, string> = {
  'Page Not Found': 'Página no encontrada',
  'The page you are looking for doesn&#x27;t exist or has been moved':
    'La página que busca no existe o se ha movido',
};

// ---------------------------------------------------------------------------
// Registro
// ---------------------------------------------------------------------------
export const PAGINAS_ES: PaginaEs[] = [
  {
    en: '/products', es: '/es/products',
    title: 'Pérgolas de lujo y soluciones de sombra | Pergola Plus',
    description: 'Pérgolas de aluminio a medida, techos de lamas motorizados, cerramientos y cocheras, diseñados e instalados en el sur de Florida.',
    dic: PRODUCTOS,
  },
  {
    en: '/services', es: '/es/services',
    title: 'Servicios de construcción exterior | Sur de Florida',
    description: 'Pérgolas a medida, adoquinado, entradas de coche, hormigón, decks, vallado y reformas integrales de patio en Miami-Dade, Broward y Palm Beach.',
    dic: SERVICIOS,
  },
  {
    en: '/contact-us/get-a-quote', es: '/es/contact-us/get-a-quote',
    title: 'Pida presupuesto de pérgola a medida | Pergola Plus',
    description: 'Cuéntenos su proyecto de patio o jardín y reciba una propuesta a medida para una pérgola de aluminio o una cubierta de patio premium.',
    dic: PRESUPUESTO,
  },
  {
    en: '/contact-us/get-in-touch', es: '/es/contact-us/get-in-touch',
    title: 'Contacte con Pergola Plus Florida | Boca Ratón',
    description: 'Llame, escriba o visítenos en Boca Ratón para hablar de pérgolas, cubiertas de patio y cerramientos en cualquier punto del sur de Florida.',
    dic: CONTACTO,
  },
  {
    en: '/contact-us/schedule-a-visit', es: '/es/contact-us/schedule-a-visit',
    title: 'Reserve una consulta de diseño gratuita | Pergola Plus',
    description: 'Agende una consulta para ver opciones de diseño, prestaciones de cada sistema y qué estructura de sombra encaja en su espacio exterior.',
    dic: VISITA,
  },
  {
    en: '/404', es: '/es/404',
    title: 'Página no encontrada | Pergola Plus Florida',
    description: 'Esa página no existe. Vea nuestras pérgolas, nuestros servicios y la galería de proyectos, o hable con nuestro equipo del sur de Florida.',
    dic: NO_ENCONTRADA,
  },
];

/** Diccionario efectivo de una página: lo común primero, lo suyo manda. */
export const diccionarioDe = (p: PaginaEs) => ({ ...COMUN_ES, ...p.dic });
