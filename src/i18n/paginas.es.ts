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
    'Modern Insulated Roof Pergolas': 'Pérgolas modernas de techo aislado',
    'Modern Polycarbonate Pergola Systems': 'Pérgolas modernas de policarbonato',
  'Our polycarbonate pergolas blend durability with natural light, blocking UV rays while maintaining brightness. Engineered for weather resistance, they are perfect for elegant patios and pool decks. Get a modern design that offers protection and openness.':
    'Nuestras pérgolas de policarbonato combinan durabilidad y luz natural: bloquean los rayos UV sin quitar luminosidad. Calculadas para resistir la intemperie, son perfectas para patios y bordes de piscina de diseño cuidado. Un diseño moderno que protege sin cerrar el espacio.',
  'Custom Open-Air Aluminum Pergolas': 'Pérgolas abiertas de aluminio a medida',
    'Luxury Custom Outdoor Cabanas': 'Cabañas exteriores de lujo a medida',
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

const GALERIA: Record<string, string> = {
  'Featured Projects': 'Proyectos destacados',
  'Explore our featured custom pergola, patio cover, and outdoor living projects across Miami-Dade, Broward, and Palm Beach County—engineered to meet Florida building codes and built for luxury, durability, and coastal performance.':
    'Vea nuestros proyectos de pérgolas a medida, cubiertas de patio y espacios exteriores en Miami-Dade, Broward y Palm Beach: calculados para cumplir la normativa de Florida y construidos para durar en la costa.',
  // Tarjetas de los tres proyectos propios de "Featured Projects".
  'FORTE Pergola with Outdoor Kitchen at Elan Polo Club':
    'Pérgola FORTE con cocina exterior en Elan Polo Club',
  'A freestanding aluminum pergola combining louvered and solid roof sections over a travertine patio and built-in outdoor kitchen.':
    'Una pérgola de aluminio exenta que reúne un tramo de lamas y otro de techo macizo sobre un patio de travertino con cocina exterior.',
  'Oceanfront Pool Deck &amp; Cabanas at Jupiter Ocean Club':
    'Terraza de piscina y cabañas frente al mar en Jupiter Ocean Club',
  'A resort pool deck steps from the Atlantic, with wide paver decking, turf inlays and white flat-roof cabanas along the water side.':
    'Una terraza de piscina a un paso del Atlántico, con pavimento amplio de adoquín, franjas de césped y cabañas blancas de techo plano junto al agua.',
  'Custom Sukkah Pergola at Boca Beach':
    'Sukkah a medida en Boca Beach',
  'A white open-air sukkah pergola over an event terrace, clear-span across the dining area and dressed with greenery and string lighting.':
    'Una sukkah blanca de aire libre sobre una terraza de eventos, sin apoyos en la zona de mesas y vestida con vegetación y guirnaldas de luz.',
  // El unico rotulo de etiqueta que no estaba ya en COMUN_ES.
  'Sukkah': 'Sukkah',
};

const SOBRE_NOSOTROS: Record<string, string> = {
  'About Pergola Plus Florida': 'Sobre Pergola Plus Florida',
  'Licensed Contractor In South Florida': 'Contratista con licencia en el sur de Florida',
  // Titular partido en tres nodos por el diseño. En español el orden cambia, así que
  // cada trozo lleva la parte que le toca para que la frase entera se lea bien.
  'Florida’s': 'Los mejores',
  'Leading Pergola &amp; Patio Cover': 'constructores de pérgolas y cubiertas de patio',
  'Contractors': 'de Florida',
  'At Pergola Plus Florida, we design and build premium aluminum pergolas, louvered roof systems, and patio covers engineered for the demands of South Florida weather. From custom design to expert installation, our team creates durable outdoor structures that add comfort, style, and long-term value to your home. Whether you want more shade, better airflow, or a modern upgrade to your backyard, we deliver outdoor living solutions built to last.':
    'En Pergola Plus Florida diseñamos y construimos pérgolas de aluminio, techos de lamas y cubiertas de patio calculados para el clima del sur de Florida. Del diseño a medida a la instalación, levantamos estructuras que duran y que aportan confort, estilo y valor a la casa. Ya busque más sombra, más ventilación o darle una vuelta al jardín, le damos una solución hecha para aguantar.',
  'Where We Serve': 'Dónde trabajamos',
  'Why Us?': '¿Por qué nosotros?',
  'Why': 'Por qué',
  'Pergola Plus Florida': 'Pergola Plus Florida',
  'is Your Best Patio Choice': 'es su mejor opción para el patio',
  'We build outdoor spaces with integrity, precision, and materials proven to withstand Florida’s extreme climate. Customers choose us for reliability, craftsmanship, and long-term durability.':
    'Construimos exteriores con seriedad, con precisión y con materiales que ya han demostrado aguantar el clima de Florida. Nos eligen por cumplir, por el oficio y porque lo que hacemos dura.',
};

const RESENAS: Record<string, string> = {
  'Client Reviews': 'Opiniones de clientes',
  'See what homeowners across Miami-Dade, Broward, and Palm Beach County say about their custom pergolas and patio cover projects. Real reviews. Real craftsmanship. Proven results.':
    'Lea lo que cuentan los propietarios de Miami-Dade, Broward y Palm Beach sobre sus pérgolas y cubiertas de patio a medida. Opiniones reales, oficio real y resultados que se ven.',
};

const GARANTIAS_PAG: Record<string, string> = {
  'Warranty Information': 'Información de garantía',
  'At Pergola Plus Florida, we stand behind the structural integrity, performance, and craftsmanship of every system we install. Serving Miami-Dade, Broward, and Palm Beach counties, we provide comprehensive warranty coverage designed to protect your investment and ensure long-term durability in South Florida’s climate.':
    'En Pergola Plus Florida respondemos de la solidez, del rendimiento y del acabado de cada sistema que instalamos. Trabajamos en Miami-Dade, Broward y Palm Beach con una cobertura de garantía pensada para proteger su inversión y para que lo instalado aguante el clima del sur de Florida.',
  'FORTE &amp; FORTE Plus Warranty': 'Garantía FORTE y FORTE Plus',
  'Our FORTE and FORTE Plus systems include comprehensive structural warranty coverage designed to ensure long-term durability and performance. This warranty protects against defects in materials and structural integrity, providing confidence that your aluminum pergola is engineered to withstand Florida’s demanding climate.':
    'Los sistemas FORTE y FORTE Plus llevan una garantía estructural amplia, pensada para que duren y rindan. Cubre defectos de material y de solidez estructural, así que su pérgola de aluminio está calculada para el clima exigente de Florida.',
  'Equinox Louvered System Warranty': 'Garantía del sistema de lamas Equinox',
  'The Equinox motorized louvered roof system includes a manufacturer-backed warranty covering structural components, louvers, and operational mechanisms. This ensures dependable performance, weather protection, and long-term reliability when installed according to engineered specifications.':
    'El techo de lamas motorizado Equinox lleva garantía del fabricante sobre estructura, lamas y mecanismos. Con ello el sistema responde, protege del tiempo y aguanta, siempre que se instale según lo calculado.',
  'Renaissance Patio Warranty': 'Garantía Renaissance Patio',
  'Renaissance patio structures are backed by a robust manufacturer warranty that covers defects in materials and workmanship. Designed for lasting performance, these aluminum systems provide dependable shade and structural strength in South Florida’s heat, humidity, and coastal conditions.':
    'Las estructuras Renaissance llevan una garantía sólida del fabricante que cubre defectos de material y de fabricación. Son sistemas de aluminio pensados para durar, que dan sombra y resistencia con el calor, la humedad y la costa del sur de Florida.',
  'Fenetex Screens Warranty': 'Garantía de las cortinas Fenetex',
  'Fenetex hurricane-rated and insect screen systems include industry-leading warranty protection covering screen fabric, structural components, and mechanical elements. Built for durability and storm resistance, these systems are engineered to perform reliably in coastal environments.':
    'Las cortinas Fenetex —homologadas para huracán y antiinsectos— llevan una de las mejores garantías del sector: cubre el tejido, la estructura y los mecanismos. Están hechas para durar y para aguantar tormentas en ambiente costero.',
  'MaestroShield Screens Warranty': 'Garantía de las cortinas MaestroShield',
  'MaestroShield retractable screens are protected by a strong warranty covering materials, hardware, and operational components. Designed for high-performance applications, these systems deliver long-term durability, smooth functionality, and weather resistance suited for Florida conditions.':
    'Las cortinas retráctiles MaestroShield llevan una garantía amplia sobre materiales, herrajes y mecanismos. Son sistemas de altas prestaciones: duran, funcionan con suavidad y aguantan el tiempo que hace en Florida.',
};

const SECTORES: Record<string, string> = {
  // Titular partido en tres nodos: cada trozo lleva la parte que le toca.
  'Pergolas': 'Pérgolas',
  'for Florida': 'para empresas',
  'Businesses': 'de Florida',
  'Premium outdoor shade structures engineered for durability, compliance, and high-traffic commercial environments.':
    'Estructuras de sombra calculadas para durar, para cumplir la normativa y para aguantar el trasiego de un local comercial.',
  'We Build For Every Kind of Commercial Space': 'Construimos para cualquier tipo de local',
  'Pergola Plus Florida helps businesses, hospitality venues, and commercial properties create high-performance outdoor environments that boost revenue, improve guest comfort, and maximize usable space. Our structures are engineered for durability, Miami-Dade compliance, and year-round commercial use.':
    'Pergola Plus Florida ayuda a negocios, hostelería y propiedades comerciales a crear exteriores que rinden: más facturación, clientes más cómodos y más metros aprovechados. Nuestras estructuras se calculan para durar, para cumplir en Miami-Dade y para un uso comercial todo el año.',
  'General Contractors': 'Contratistas generales',
  'We partner with licensed contractors to deliver engineered aluminum pergola systems that meet structural specs, timelines, and commercial project standards.':
    'Trabajamos con contratistas con licencia para entregar pérgolas de aluminio calculadas, que cumplen la especificación estructural, los plazos y el estándar de una obra comercial.',
  'Architects &amp; Designers': 'Arquitectos y diseñadores',
  'We collaborate with architects and designers to integrate modern pergola systems that align with project vision, structural requirements, and aesthetic intent.':
    'Colaboramos con arquitectos y diseñadores para integrar pérgolas actuales que respeten la idea del proyecto, lo que pide el cálculo y la intención estética.',
  'Property Managers &amp; HOAs': 'Administradores de fincas y comunidades',
  'We provide durable aluminum shade structures for multifamily and commercial properties, improving shared spaces while ensuring long-term performance.':
    'Damos estructuras de sombra de aluminio para edificios de viviendas y propiedades comerciales: mejoran las zonas comunes y aguantan a largo plazo.',
  'Developers &amp; Real Estate Investors': 'Promotores e inversores inmobiliarios',
  'We support developers with high-performance pergola systems that elevate amenities, increase asset value, and enhance long-term ROI across commercial properties.':
    'Acompañamos a los promotores con pérgolas de altas prestaciones que mejoran las zonas comunes, suben el valor del activo y mejoran el retorno a largo plazo.',
  'Hospitality (Restaurants, Hotels &amp; Rooftop Venues)':
    'Hostelería (restaurantes, hoteles y azoteas)',
  'Restaurants, hotels, cafés, and rooftop venues rely on our commercial pergola systems to expand seating capacity and elevate guest experiences. Our engineered aluminum structures provide shaded, weather-protected environments that increase revenue potential while maintaining architectural consistency and long-term durability.':
    'Restaurantes, hoteles, cafeterías y azoteas usan nuestras pérgolas comerciales para ganar mesas y mejorar la experiencia del cliente. Las estructuras de aluminio dan sombra y protegen del tiempo, así que se factura más sin romper la coherencia arquitectónica y sin renunciar a que dure.',
  'Real Estate &amp; Property Management': 'Inmobiliario y administración de fincas',
  'HOAs, multifamily communities, and commercial property managers partner with us to enhance shared spaces with durable outdoor shade systems. Our pergolas add measurable property value, improve resident satisfaction, and create functional amenities built for long-term performance.':
    'Comunidades, edificios de viviendas y administradores de propiedades comerciales trabajan con nosotros para mejorar las zonas comunes con sombra que dura. Nuestras pérgolas añaden valor medible, mejoran la satisfacción de los residentes y crean zonas útiles pensadas para el largo plazo.',
  'Retail &amp; Shopping Centers': 'Comercio y centros comerciales',
  'Shopping centers, boutiques, and commercial plazas utilize our pergola systems to create shaded walkways, inviting storefronts, and weather-protected gathering areas. Our structures improve customer comfort, increase dwell time, and reinforce modern architectural appeal.':
    'Centros comerciales, tiendas y plazas usan nuestras pérgolas para crear paseos con sombra, escaparates que invitan a entrar y zonas de encuentro protegidas. El cliente está más cómodo, se queda más tiempo y el conjunto se ve más actual.',
  'Parks &amp; Public Spaces': 'Parques y espacios públicos',
  'Municipal parks, recreation areas, and public gathering spaces benefit from our commercial-grade pergolas engineered for high-traffic environments. Our durable aluminum systems provide shade, safety, and long-term structural performance with minimal maintenance requirements.':
    'Parques municipales, zonas de recreo y espacios públicos usan nuestras pérgolas de grado comercial, calculadas para mucho tránsito. Dan sombra, son seguras, aguantan y casi no dan mantenimiento.',
  'Corporate &amp; Office Campuses': 'Sedes corporativas y oficinas',
  'Corporate campuses and office complexes use our pergola systems to create refined outdoor break areas, collaboration zones, and employee gathering spaces. Our structures support workplace wellness initiatives while enhancing property aesthetics and long-term value.':
    'Las sedes corporativas y los complejos de oficinas usan nuestras pérgolas para crear zonas de descanso, de trabajo en equipo y de encuentro al aire libre. Ayudan a los programas de bienestar y mejoran la estética y el valor del inmueble.',
  'Multifamily &amp; Residential Communities': 'Edificios de viviendas y urbanizaciones',
  'Developers and community planners install our pergolas in shared courtyards, pool decks, and amenity areas to increase property appeal. Our engineered shade systems improve usability, attract residents, and support long-term asset performance.':
    'Promotores y planificadores instalan nuestras pérgolas en patios comunes, zonas de piscina y áreas comunes para que la propiedad guste más. La sombra calculada mejora el uso, atrae residentes y sostiene el valor del activo.',
  'Educational Institutions': 'Centros educativos',
  'Schools, universities, and private campuses rely on our aluminum pergolas to create shaded outdoor learning and gathering areas. Our commercial systems are designed for safety, durability, and consistent performance in demanding environments.':
    'Colegios, universidades y campus privados usan nuestras pérgolas de aluminio para crear zonas de estudio y de reunión con sombra. Son sistemas comerciales pensados para la seguridad, la durabilidad y un uso exigente.',
  'Healthcare &amp; Wellness Facilities': 'Centros sanitarios y de bienestar',
  'Medical centers, clinics, and wellness campuses integrate our pergola systems to create comfortable outdoor waiting areas and therapeutic spaces. Our structures deliver shade, airflow, and durability while supporting a calm, professional environment.':
    'Centros médicos, clínicas y espacios de bienestar integran nuestras pérgolas para crear salas de espera al aire libre y zonas terapéuticas. Dan sombra, ventilación y durabilidad, y ayudan a un ambiente tranquilo y profesional.',
  'Sports &amp; Recreation Facilities': 'Instalaciones deportivas y de ocio',
  'Athletic complexes, country clubs, and recreational facilities use our commercial pergolas to provide shaded seating and hospitality areas. Our engineered systems withstand heavy use while enhancing visitor experience and facility functionality.':
    'Complejos deportivos, clubes y centros de ocio usan nuestras pérgolas comerciales para dar sombra en las gradas y en las zonas de hostelería. Aguantan un uso intenso y mejoran la experiencia del visitante.',
  'Government &amp; Civic Buildings': 'Edificios públicos y administrativos',
  'Government properties and civic facilities implement our pergola systems to enhance outdoor access areas and gathering spaces. Our aluminum structures are built for durability, compliance, and long-term structural integrity.':
    'Los edificios públicos y las instalaciones municipales usan nuestras pérgolas para mejorar los accesos y las zonas de encuentro al aire libre. Las estructuras de aluminio están hechas para durar, para cumplir y para mantenerse sólidas.',
};

const MARCAS: Record<string, string> = {
  'Patio Cover Models Brands': 'Marcas y modelos de cubierta',
  'At Pergola Plus, we partner with industry-leading manufacturers to deliver high-quality pergola systems, louvered roofs, and outdoor solutions built to last. Each brand we work with is selected for its innovation, durability, and proven performance—ensuring your outdoor space is built with the very best.':
    'En Pergola Plus trabajamos con fabricantes de referencia para dar pérgolas, techos de lamas y soluciones exteriores que duran. Cada marca está elegida por su innovación, su resistencia y por lo que ya ha demostrado, para que su exterior se construya con lo mejor.',
};

const DONDE: Record<string, string> = {
  'South Florida’s Leading Pergola Contractor': 'El especialista en pérgolas del sur de Florida',
  'Premium pergolas, patio covers, and outdoor structures installed across South Florida. We proudly serve homeowners and businesses throughout Miami-Dade, Broward, and Palm Beach County with high-quality pergolas, louvered roofs, decks, and outdoor living solutions built to last.':
    'Pérgolas, cubiertas de patio y estructuras exteriores instaladas por todo el sur de Florida. Trabajamos con particulares y con empresas en Miami-Dade, Broward y Palm Beach: pérgolas, techos de lamas, decks y soluciones de exterior hechas para durar.',
  'Coverage': 'Cobertura',
  // Titulares de las 25 tarjetas. El nombre de la ciudad no se traduce.
  'Sunny Isles Beach Pergola Builders': 'Pérgolas en Sunny Isles Beach',
  'Miami Beach Pergola Builders': 'Pérgolas en Miami Beach',
  'Miami Pergola Builders': 'Pérgolas en Miami',
  'Key Biscayne Pergola Builders': 'Pérgolas en Key Biscayne',
  'Doral Pergola Builders': 'Pérgolas en Doral',
  'Coral Gables Pergola Builders': 'Pérgolas en Coral Gables',
  'Aventura Pergola Builders': 'Pérgolas en Aventura',
  'Weston Pergola Installation': 'Pérgolas en Weston',
  'Pembroke Pines Pergola Installation': 'Pérgolas en Pembroke Pines',
  'Parkland Pergola Installation': 'Pérgolas en Parkland',
  'Miramar Pergola Installation': 'Pérgolas en Miramar',
  'Hollywood Pergola Installation': 'Pérgolas en Hollywood',
  'Fort Lauderdale Pergola Installation': 'Pérgolas en Fort Lauderdale',
  'Coral Springs Pergola Installation': 'Pérgolas en Coral Springs',
  'Davie Pergola Installation': 'Pérgolas en Davie',
  'Cooper City Pergola Installation': 'Pérgolas en Cooper City',
  'Wellington Pergola Contractors': 'Pérgolas en Wellington',
  'West Palm Beach Pergola Contractors': 'Pérgolas en West Palm Beach',
  'Royal Palm Beach Pergola Contractors': 'Pérgolas en Royal Palm Beach',
  'Palm Beach Gardens Pergola Contractors': 'Pérgolas en Palm Beach Gardens',
  'Palm Beach Pergola Contractors': 'Pérgolas en Palm Beach',
  'Jupiter Pergola Contractors': 'Pérgolas en Jupiter',
  'Delray Beach Pergola Contractors': 'Pérgolas en Delray Beach',
  'Boca Raton Pergola Contractor': 'Pérgolas en Boca Raton',
  'Boynton Beach Pergola Contractors': 'Pérgolas en Boynton Beach',
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
  // /contact-us/get-in-touch NO esta aqui a proposito. Se rediseño a mano, salio del
  // generador (Set MANUALES) y por tanto ya no hay fragmento migrado del que partir:
  // por este camino la pagina española habria seguido sirviendo el diseño VIEJO, sin
  // error y sin que saltara ninguna puerta. Su gemela vive en
  // src/pages/es/contact-us/get-in-touch.astro y la copia, en src/i18n/contacto.ts.
  // Volver a añadirla aqui rompe el build: dos rutas generando /es/contact-us/get-in-touch.
  //
  // En TRADUCIDAS (rutas.mjs) SI sigue: es lo que hace reciproco el hreflang.
  // El diccionario CONTACTO se conserva mas abajo aunque ya no lo use ninguna pagina:
  // check:i18n vuelca TODOS los .es.ts en un unico DIC y lo usa para reconocer ingles
  // en /es/. Sus claves («First name», «Email»...) son las mismas que las de las otras
  // dos paginas de contacto, asi que borrarlo AFLOJA la puerta en vez de limpiarla.
  {
    en: '/contact-us/schedule-a-visit', es: '/es/contact-us/schedule-a-visit',
    title: 'Reserve una consulta de diseño gratuita | Pergola Plus',
    description: 'Agende una consulta para ver opciones de diseño, prestaciones de cada sistema y qué estructura de sombra encaja en su espacio exterior.',
    dic: VISITA,
  },
  {
    en: '/project-gallery', es: '/es/project-gallery',
    title: 'Galería de proyectos | Pergola Plus Florida',
    description: 'Pérgolas a medida, cubiertas de patio y espacios exteriores ya construidos en Miami-Dade, Broward y Palm Beach.',
    dic: GALERIA,
  },
  {
    en: '/about-us/about-us', es: '/es/about-us/about-us',
    title: 'Sobre Pergola Plus Florida | Contratista con licencia',
    description: 'Más de diez años diseñando e instalando pérgolas de aluminio, techos de lamas y cubiertas de patio en Miami-Dade, Broward y Palm Beach.',
    dic: SOBRE_NOSOTROS,
  },
  {
    en: '/about-us/testimonials', es: '/es/about-us/testimonials',
    title: 'Opiniones de clientes | Pergola Plus Florida',
    description: 'Lo que cuentan los propietarios del sur de Florida sobre sus pérgolas y cubiertas de patio a medida.',
    dic: RESENAS,
  },
  {
    en: '/about-us/industries-we-serve', es: '/es/about-us/industries-we-serve',
    title: 'Sectores a los que servimos | Pergola Plus Florida',
    description: 'Pérgolas comerciales para hostelería, comercio, promotoras, comunidades, centros educativos, sanitarios y espacios públicos.',
    dic: SECTORES,
  },
  {
    en: '/resources/warranties', es: '/es/resources/warranties',
    title: 'Información de garantía | Pergola Plus Florida',
    description: 'Qué cubre la garantía de los sistemas FORTE, Equinox, Renaissance, Fenetex y MaestroShield que instalamos.',
    dic: GARANTIAS_PAG,
  },
  {
    en: '/about-us/brands', es: '/es/about-us/brands',
    title: 'Marcas y modelos de cubierta | Pergola Plus Florida',
    description: 'Los fabricantes con los que trabajamos: FORTE, Equinox, Apollo, Renaissance y Fenetex, elegidos por resistencia y por prestaciones.',
    dic: MARCAS,
  },
  {
    en: '/about-us/where-we-work', es: '/es/about-us/where-we-work',
    title: 'Dónde trabajamos | Zonas del sur de Florida',
    description: 'Las 25 ciudades de Miami-Dade, Broward y Palm Beach donde instalamos pérgolas, techos de lamas y estructuras exteriores.',
    dic: DONDE,
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
