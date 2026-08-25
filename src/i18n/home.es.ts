/**
 * Traducción de la home al español.
 *
 * Las claves son EXACTAMENTE el texto que hay entre `>` y `<` en
 * src/contenido-migrado/estaticas/index.html, entidades incluidas (`&amp;`,
 * `&#x27;`). Si el original cambia una coma, la clave deja de coincidir y la
 * cadena se queda en inglés — visible, no roto: `traducirHtml` devuelve las que
 * faltan y la página avisa en el build.
 *
 * Registro (español neutro, que es lo que corresponde al sur de Florida):
 *  - Nombres de producto y marca NO se traducen: FORTE, FORTE Plus, ECLIPSE,
 *    Sukkha 3000, Pergola Plus Florida.
 *  - Los topónimos van en su forma local: Delray Beach, no «Playa Delray».
 *  - «Pérgola» lleva tilde en español.
 */
export const HOME_ES: Record<string, string> = {
  // --- Hero ---
  'Licensed &amp; Insured': 'Con licencia y seguro',
  '+10 Years of Experience': '+10 años de experiencia',
  'Financing Available': 'Financiación disponible',
  // Hero nuevo del cliente (handoff §6). Las claves son el texto YA sustituido por
  // TEXTOS_CLIENTE en scripts/lib/transformar.mjs, no el del export original: si se
  // cambia el copy inglés allí y no aquí, la home española se queda con el hero en
  // inglés. Pasó al aplicar este mismo cambio, y lo cazó el aviso del build.
  'Live Outdoors. Beautifully.': 'Viva el exterior. Con estilo.',
  'South Florida’s trusted experts in outdoor remodels, hardscape, and custom shade structures — let’s elevate your backyard for true Florida living.':
    'Los especialistas de confianza del sur de Florida en reformas de exterior, hardscape y estructuras de sombra a medida. Demos a su jardín la altura que merece para vivir Florida de verdad.',
  'See Our Work': 'Ver nuestro trabajo',
  'Schedule A Visit': 'Agendar una visita',

  // --- Productos ---
  'Our Products': 'Nuestros productos',
  'Luxury Pergolas &amp; Outdoor Shade Solutions':
    'Pérgolas de lujo y soluciones de sombra para exteriores',
  'Explore our custom aluminum pergolas and outdoor shade systems engineered and installed in South Florida for luxury residential living.':
    'Descubra nuestras pérgolas de aluminio a medida y nuestros sistemas de sombra, diseñados e instalados en el sur de Florida para viviendas de lujo.',
  'Motorized Louvered Pergolas': 'Pérgolas de lamas motorizadas',
  'Solid Roof Pergolas': 'Pérgolas de techo sólido',
  'Polycarbonate Pergolas': 'Pérgolas de policarbonato',
  'Open-Air Pergolas': 'Pérgolas abiertas',
  Cabanas: 'Cabañas',
  'Screen Enclosures': 'Cerramientos con mosquitero',
  'Motorized Screens': 'Cortinas motorizadas',
  'Aluminum Carports': 'Cocheras de aluminio',
  'Solar Pergolas': 'Pérgolas solares',
  Sukkha: 'Sukkha',

  'Custom Motorized Louvered Pergola Systems':
    'Sistemas de pérgola de lamas motorizadas a medida',
  'Take full control of your outdoor space with our custom louvered pergolas. Engineered for South Florida, the adjustable aluminum louvers regulate sun and rain at the touch of a button. A sophisticated, all-season solution for luxury outdoor living.':
    'Tome el control total de su espacio exterior con nuestras pérgolas de lamas a medida. Diseñadas para el sur de Florida, las lamas de aluminio regulables gradúan el sol y la lluvia con solo pulsar un botón. Una solución sofisticada para disfrutar del exterior todo el año.',
  'Explore More →': 'Ver más →',

  'Modern Insulated Roof Pergolas': 'Pérgolas modernas de techo aislado',
  'Our insulated roof pergolas offer maximum thermal performance, reducing heat while providing full shade and rain protection. These engineered aluminum systems create a cooler, comfortable outdoor space—perfect for year-round use and architectural beauty.':
    'Nuestras pérgolas de techo aislado ofrecen el máximo rendimiento térmico: reducen el calor y dan sombra total y protección frente a la lluvia. Estos sistemas de aluminio crean un espacio exterior más fresco y confortable, ideal para usar todo el año sin renunciar al diseño.',

  'Modern Polycarbonate Pergola Systems':
    'Sistemas modernos de pérgola en policarbonato',
  'Our polycarbonate pergolas blend durability with natural light, blocking UV rays while maintaining brightness. Engineered for weather resistance, they are perfect for elegant patios and pool decks. Get a modern design that offers protection and openness.':
    'Nuestras pérgolas de policarbonato combinan durabilidad y luz natural: bloquean los rayos UV sin oscurecer el espacio. Diseñadas para resistir el clima, son perfectas para patios elegantes y zonas de piscina. Un diseño moderno que protege sin cerrar.',

  'Custom Open-Air Aluminum Pergolas': 'Pérgolas abiertas de aluminio a medida',
  'Define your outdoor living with our premium aluminum open-air pergolas. Custom-designed for luxury homes, these structures add architectural depth and property value while preserving airflow and sky views. The ultimate blend of style and open-air comfort.':
    'Defina su espacio exterior con nuestras pérgolas abiertas de aluminio. Diseñadas a medida para viviendas de lujo, aportan profundidad arquitectónica y valor a la propiedad sin renunciar a la ventilación ni a las vistas al cielo. Estilo y confort al aire libre.',

  'Luxury Custom Outdoor Cabanas': 'Cabañas exteriores de lujo a medida',
  'Our custom aluminum cabanas create refined outdoor retreats with resort-inspired design. Engineered for durability and privacy, these structures provide shaded comfort while elevating the overall aesthetic of your pool area or backyard entertainment space.':
    'Nuestras cabañas de aluminio a medida crean refugios exteriores de estilo resort. Diseñadas para durar y para dar privacidad, aportan sombra y confort a la vez que elevan la estética de su piscina o su zona de entretenimiento.',

  'Custom Screen Enclosures for Outdoor Living':
    'Cerramientos con mosquitero a medida',
  'Protect your outdoor space from insects and debris with our custom, fully permitted screen enclosures. Designed for South Florida, they preserve airflow and visibility, ensuring comfortable evenings while matching your home’s architectural integrity.':
    'Proteja su espacio exterior de insectos y suciedad con nuestros cerramientos con mosquitero a medida, con todos los permisos en regla. Pensados para el sur de Florida, mantienen la ventilación y las vistas, y respetan la arquitectura de su casa.',

  'Integrated Motorized Screen Systems':
    'Sistemas integrados de cortinas motorizadas',
  'Motorized screens provide on-demand shade, privacy, and wind control with seamless automation. Designed to integrate into pergolas, patios, and covered outdoor spaces, these premium systems enhance comfort while maintaining a sleek, modern appearance.':
    'Las cortinas motorizadas dan sombra, privacidad y control del viento cuando usted lo decide, con una automatización discreta. Pensadas para integrarse en pérgolas, patios y espacios cubiertos, suman confort manteniendo una estética limpia y moderna.',

  'Engineered Aluminum Carport Structures':
    'Cocheras de aluminio calculadas y certificadas',
  'Our aluminum carports protect luxury vehicles from harsh sun and rain while elevating your home’s architecture. Built for structural integrity and long-term durability, they offer premium, stylish protection. The perfect blend of strength and design.':
    'Nuestras cocheras de aluminio protegen vehículos de alta gama del sol y la lluvia y realzan la arquitectura de su casa. Construidas para la integridad estructural y la durabilidad a largo plazo, unen resistencia y diseño.',

  'Solar-Integrated Shade Structures':
    'Estructuras de sombra con integración solar',
  'Solar roof structures combine architectural strength with energy innovation. Engineered to support solar panel integration, these systems provide shade and weather protection while allowing homeowners to invest in sustainable, high-performance outdoor infrastructure.':
    'Las estructuras de techo solar combinan solidez arquitectónica e innovación energética. Preparadas para integrar paneles solares, dan sombra y protección frente al clima a la vez que convierten su exterior en una inversión sostenible y de alto rendimiento.',

  'Sukkha 3000 Premium Louvered System':
    'Sukkha 3000, sistema premium de lamas',
  'The Sukkha 3000 is a premium outdoor structure that merges cutting-edge engineering with contemporary design. Built for homeowners seeking the highest level of performance, durability, and customization, this system redefines what a luxury outdoor space can achieve.':
    'La Sukkha 3000 es una estructura exterior premium que une ingeniería de vanguardia y diseño contemporáneo. Pensada para quien busca el máximo nivel de rendimiento, durabilidad y personalización, redefine lo que puede llegar a ser un espacio exterior de lujo.',

  // --- Por qué nosotros ---
  'Why choose us?': '¿Por qué elegirnos?',
  'Why Pergola Plus Leads Outdoor Living in South Florida':
    'Por qué Pergola Plus lidera el exterior en el sur de Florida',
  'Work with licensed professionals delivering engineered pergolas, patio covers, and motorized systems built for South Florida homes and designed for long-term durability and performance.':
    'Trabaje con profesionales licenciados que entregan pérgolas, cubiertas de patio y sistemas motorizados calculados para las viviendas del sur de Florida y diseñados para durar.',
  'Licensed &amp; Engineered in South Florida':
    'Licenciados y con cálculo estructural en el sur de Florida',
  'Your project is protected and handled by certified professionals with full licensing and insurance in South Florida.':
    'Su proyecto queda en manos de profesionales certificados, con licencia y seguro en regla en el sur de Florida.',
  'Over 10 Years of Experience': 'Más de 10 años de experiencia',
  'More than a decade designing and installing premium outdoor structures, including pergolas, enclosures, and louvered roofs.':
    'Más de una década diseñando e instalando estructuras exteriores premium: pérgolas, cerramientos y techos de lamas.',
  'Premium Materials &amp; Guaranteed Installation':
    'Materiales premium e instalación garantizada',
  'We use top-grade materials and expert craftsmanship to ensure long-lasting, durable, and visually stunning shade structures.':
    'Usamos materiales de primera y mano de obra experta para que su estructura de sombra dure y luzca impecable.',
  'Custom Designs Tailored to Your Space':
    'Diseños a medida para su espacio',
  'Every project is built from scratch—no templates. We measure, design, and craft a solution that fits your home perfectly.':
    'Cada proyecto se hace desde cero, sin plantillas. Medimos, diseñamos y fabricamos una solución que encaja exactamente con su casa.',
  'More About Us': 'Más sobre nosotros',
  'Where We Work': 'Dónde trabajamos',

  // --- Proyectos ---
  'Our Projects': 'Nuestros proyectos',
  'Recent Projects': 'Proyectos recientes',
  'Get inspired by some of our latest work.':
    'Inspírese con algunos de nuestros últimos trabajos.',
  'FORTE Plus Pergolas in Hillsboro Beach Estate':
    'Pérgolas FORTE Plus en una finca de Hillsboro Beach',
  'FORTE Plus aluminum pergolas installed at a luxury beachfront estate in Hillsboro Beach, engineered for South Florida coastal durability.':
    'Pérgolas de aluminio FORTE Plus instaladas en una finca de lujo frente al mar en Hillsboro Beach, calculadas para la durabilidad costera del sur de Florida.',
  'Attached FORTE Plus Pergola on the Intracoastal in Boca Raton':
    'Pérgola FORTE Plus adosada sobre el Intracoastal en Boca Raton',
  'Attached FORTE Plus aluminum pergola installed on the Intracoastal in Boca Raton, engineered for South Florida coastal durability.':
    'Pérgola de aluminio FORTE Plus adosada, instalada sobre el Intracoastal en Boca Raton y calculada para la durabilidad costera del sur de Florida.',
  'FORTE Pergola with Privacy Wall &amp; TV Mount in Delray Beach':
    'Pérgola FORTE con muro de privacidad y soporte de TV en Delray Beach',
  'Custom FORTE pergola with privacy wall and TV mount installed in Delray Beach, engineered for South Florida residential outdoor living.':
    'Pérgola FORTE a medida con muro de privacidad y soporte de televisión, instalada en Delray Beach para el exterior de viviendas del sur de Florida.',
  'ECLIPSE Cabanas &amp; FORTE Pergola Hospitality Project in Riviera Beach':
    'Cabañas ECLIPSE y pérgola FORTE para hostelería en Riviera Beach',
  'ECLIPSE cabanas and FORTE pergola installed for a hospitality project in Riviera Beach, engineered for South Florida commercial performance.':
    'Cabañas ECLIPSE y pérgola FORTE instaladas en un proyecto de hostelería en Riviera Beach, calculadas para uso comercial en el sur de Florida.',
  'Attached FORTE Pergola in West Palm Beach':
    'Pérgola FORTE adosada en West Palm Beach',
  'Attached FORTE aluminum pergola installed in West Palm Beach, engineered for South Florida residential outdoor living.':
    'Pérgola de aluminio FORTE adosada, instalada en West Palm Beach para el exterior de viviendas del sur de Florida.',
  'FORTE Pergolas in Greenacres Pool Patio':
    'Pérgolas FORTE en un patio de piscina en Greenacres',
  'Custom FORTE aluminum pergolas installed in Greenacres pool patio, engineered for South Florida residential outdoor living.':
    'Pérgolas de aluminio FORTE a medida instaladas en un patio de piscina en Greenacres, para el exterior de viviendas del sur de Florida.',
  'FORTE Plus Pergola with Outdoor Kitchen in Delray Beach':
    'Pérgola FORTE Plus con cocina exterior en Delray Beach',
  'Custom FORTE Plus pergola integrated with an outdoor kitchen in Delray Beach, engineered for South Florida luxury residential living.':
    'Pérgola FORTE Plus a medida integrada con una cocina exterior en Delray Beach, calculada para viviendas de lujo del sur de Florida.',
  'FORTE Pergola with Partial Privacy Wall in Palm Beach Gardens':
    'Pérgola FORTE con muro de privacidad parcial en Palm Beach Gardens',
  'Custom FORTE aluminum pergola with partial privacy wall installed in Palm Beach Gardens, engineered for South Florida residential properties.':
    'Pérgola de aluminio FORTE a medida con muro de privacidad parcial, instalada en Palm Beach Gardens para propiedades residenciales del sur de Florida.',
  'FORTE Pergola with Privacy Wall &amp; Motorized Screen in Delray Beach':
    'Pérgola FORTE con muro de privacidad y cortina motorizada en Delray Beach',
  'Custom FORTE pergola with privacy wall and motorized shade screen installed in Delray Beach, engineered for South Florida luxury homes.':
    'Pérgola FORTE a medida con muro de privacidad y cortina de sombra motorizada, instalada en Delray Beach para viviendas de lujo del sur de Florida.',
  'FORTE Plus Aluminum Carport Installation in Pompano Beach':
    'Instalación de cochera de aluminio FORTE Plus en Pompano Beach',
  'Custom FORTE Plus aluminum carport installed in Pompano Beach, engineered to meet Florida building codes and coastal conditions.':
    'Cochera de aluminio FORTE Plus a medida instalada en Pompano Beach, calculada para cumplir los códigos de construcción de Florida y las condiciones costeras.',

  // --- Reseñas ---
  'Reviews &amp; testimonials': 'Reseñas y testimonios',
  'What Clients Say About Our Work':
    'Lo que dicen nuestros clientes sobre nuestro trabajo',
  'Discover how our pergola contractors transform outdoor spaces with expert installation of pergolas, patio covers, pool screen enclosures, and louvered roof systems across South Florida.':
    'Descubra cómo nuestros contratistas transforman espacios exteriores instalando pérgolas, cubiertas de patio, cerramientos de piscina y techos de lamas por todo el sur de Florida.',
  'Read Client Reviews': 'Leer reseñas de clientes',

  // --- Proceso ---
  'Our Process': 'Nuestro proceso',
  'How We Build It': 'Cómo lo construimos',
  'As well as building in accordance with the latest codes to ensure your structure is safe, we strive to provide unique service, installation, quality, satisfaction, and reasonable pricing. Work with us and you won&#x27;t be disappointed. Beauty and security will last a lifetime.':
    'Además de construir conforme a los códigos más recientes para que su estructura sea segura, nos esforzamos por ofrecer un servicio, una instalación, una calidad y un precio a la altura. Trabaje con nosotros y no se arrepentirá: la belleza y la seguridad duran toda la vida.',
  'Get A Quote': 'Pedir presupuesto',
  'Property Visit': 'Visita a la propiedad',
  'We visit your property, take measurements, and understand your needs so we can design your pergola precisely with care.':
    'Visitamos su propiedad, tomamos medidas y entendemos lo que necesita para diseñar su pérgola con precisión.',
  'We design your structure': 'Diseñamos su estructura',
  'We create a custom design that matches your space, style, and goals, ensuring every detail reflects your outdoor vision.':
    'Creamos un diseño a medida que encaja con su espacio, su estilo y sus objetivos, cuidando cada detalle.',
  'We build it right': 'La construimos bien',
  'Our team builds your pergola with precision, durable materials, and clean workmanship, delivering strength and quality..':
    'Nuestro equipo construye su pérgola con precisión, materiales duraderos y un acabado limpio.',
  'You enjoy it': 'Usted la disfruta',
  'Once installed, your pergola is ready to enjoy. We clean your space, ensure everything works perfectly, and leave it all':
    'Una vez instalada, su pérgola está lista. Limpiamos el espacio, comprobamos que todo funcione y lo dejamos todo en orden.',

  // --- Servicios ---
  'Our Services': 'Nuestros servicios',
  'Everything Your Patio Needs, All In One Place':
    'Todo lo que su patio necesita, en un solo sitio',
  'Transform your outdoor space with a complete range of services—from custom pergola construction to concrete, pavers, decks, fencing, and full outdoor remodels—designed to enhance both beauty and functionality.':
    'Transforme su espacio exterior con una gama completa de servicios: desde la construcción de pérgolas a medida hasta hormigón, adoquines, terrazas de madera, vallados y la remodelación exterior integral.',
  'Pergola Design &amp; Construction': 'Diseño y construcción de pérgolas',
  'Custom aluminum pergolas built for shade, style, and durability.':
    'Pérgolas de aluminio a medida, pensadas para dar sombra, estilo y durabilidad.',
  Pavers: 'Adoquines',
  'Premium paver installations for patios, walkways, and driveways.':
    'Instalación de adoquines premium para patios, senderos y entradas de vehículos.',
  Driveways: 'Entradas de vehículos',
  'Custom driveways engineered for strength and curb appeal.':
    'Entradas a medida, calculadas para resistir y para lucir desde la calle.',
  Concrete: 'Hormigón',
  'Architectural concrete patios built for lasting performance.':
    'Patios de hormigón arquitectónico construidos para durar.',
  'Deck Builders': 'Terrazas de madera',
  'Custom decks designed for durability &amp; seamless integration.':
    'Terrazas a medida, diseñadas para durar e integrarse sin costuras.',
  'Fence Solutions': 'Soluciones de vallado',
  'Residential fencing for privacy, security, and clean design.':
    'Vallado residencial para privacidad, seguridad y un diseño limpio.',
  'Full Outdoor Remodel': 'Remodelación exterior integral',
  'Complete outdoor renovations: patio, hardscape, shade and lighting as one project.':
    'Remodelación completa del exterior: patio, adoquinado, sombra e iluminación en un solo proyecto.',

  // --- Zonas de servicio ---
  'Service Areas': 'Zonas de servicio',
  'Proudly Serving South Florida': 'Damos servicio a todo el sur de Florida',
  'We provide professional pergola construction across Miami-Dade, Broward, and Palm Beach. Our team builds custom pergolas designed for Florida’s heat, humidity, and coastal conditions—delivering durable, beautiful outdoor spaces for homes and businesses throughout the region.':
    'Construimos pérgolas de forma profesional en Miami-Dade, Broward y Palm Beach. Nuestro equipo diseña pérgolas a medida preparadas para el calor, la humedad y las condiciones costeras de Florida, y entrega espacios exteriores duraderos y bonitos para viviendas y negocios de toda la región.',
  'Explore Area Services': 'Ver zonas de servicio',

  // --- Blog ---
  'Blog &amp; Tips': 'Blog y consejos',
  'Latest Outdoor Living Insights': 'Novedades sobre vida al aire libre',
  'Expert tips, ideas, and guides to help you upgrade your patio, enhance your home, and get inspired with premium outdoor design.':
    'Consejos, ideas y guías de expertos para mejorar su patio, revalorizar su casa e inspirarse con diseño exterior premium.',
  'Buying Guides &amp; Cost': 'Guías de compra y costes',
  'February 23, 2026': '23 de febrero de 2026',
  'February 27, 2026': '27 de febrero de 2026',
  'HOA Rules for Pergolas in South Florida Communities':
    'Normas de las asociaciones de vecinos (HOA) para pérgolas en el sur de Florida',
  'HOA requirements for pergolas in South Florida explained.':
    'Qué exigen las HOA del sur de Florida para instalar una pérgola.',
  'Read More →': 'Leer más →',
  'Design-Build Pergola Process for South Florida Homes':
    'El proceso de diseño y construcción de pérgolas en el sur de Florida',
  'How the design-build pergola process works in South Florida.':
    'Cómo funciona el proceso de diseño y construcción en el sur de Florida.',
  'Pergola Building Codes in Broward &amp; Palm Beach County':
    'Códigos de construcción de pérgolas en Broward y Palm Beach',
  'Understanding pergola codes in Broward &amp; Palm Beach County.':
    'Entender los códigos de pérgolas en los condados de Broward y Palm Beach.',
  'Step-by-Step: Building a Custom Pergola in South Florida':
    'Paso a paso: construir una pérgola a medida en el sur de Florida',
  'Step-by-step guide to building a pergola in South Florida.':
    'Guía paso a paso para construir una pérgola en el sur de Florida.',
  'Outdoor Living Design': 'Diseño de exteriores',
  'Luxury Pergola Ideas for South Florida Backyards':
    'Ideas de pérgolas de lujo para jardines del sur de Florida',
  'High-end pergola design ideas for South Florida luxury homes.':
    'Ideas de diseño de pérgolas de alta gama para viviendas de lujo del sur de Florida.',
  'How to Plan a Pergola for Your South Florida Backyard':
    'Cómo planificar la pérgola de su jardín en el sur de Florida',
  'Step-by-step guide to planning a pergola in South Florida.':
    'Guía paso a paso para planificar una pérgola en el sur de Florida.',
  'Modern Outdoor Living Trends in South Florida':
    'Tendencias de vida al aire libre en el sur de Florida',
  '2026 luxury outdoor living trends shaping South Florida homes.':
    'Las tendencias de exterior de 2026 que están marcando las casas del sur de Florida.',
  'Poolside Pergola Ideas for Florida Homes':
    'Ideas de pérgolas junto a la piscina para casas de Florida',
  'Luxury poolside pergola ideas for Florida backyards.':
    'Ideas de pérgolas de lujo junto a la piscina para jardines de Florida.',
  'How Much Does a Pergola Cost in South Florida?':
    '¿Cuánto cuesta una pérgola en el sur de Florida?',
  '2026 pergola cost breakdown for South Florida homes.':
    'Desglose de costes de pérgolas en 2026 para viviendas del sur de Florida.',
  'Do You Need a Permit for a Pergola in South Florida?':
    '¿Hace falta permiso para una pérgola en el sur de Florida?',
  'Permit requirements for pergolas in South Florida explained.':
    'Qué permisos se necesitan para una pérgola en el sur de Florida.',

  // --- CTA final ---
  'Request your free Estimate': 'Solicite su presupuesto gratuito',
  'Meet with our exterior designers for a free consultation. We&#x27;ll assess your space and goals to plan the installation of pergolas, patio covers, or pool enclosures.':
    'Reúnase con nuestros diseñadores de exteriores en una consulta gratuita. Evaluaremos su espacio y sus objetivos para planificar la instalación de pérgolas, cubiertas de patio o cerramientos de piscina.',

  // Tarjetas de los tres proyectos propios de "Recent Projects".
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
};
