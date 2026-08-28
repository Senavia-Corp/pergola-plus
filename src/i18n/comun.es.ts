/**
 * Cadenas que se repiten en CASI TODAS las páginas migradas.
 *
 * Salen de dos bloques que Webflow reutiliza en ~100 páginas: el CTA final
 * («Request your free Estimate») y los botones de los formularios. Tenerlas aquí
 * evita repetir las mismas seis traducciones en cada diccionario, que es donde se
 * cuela la variante ligeramente distinta que luego el cliente ve como incoherencia.
 *
 * Las claves son el texto EXACTO del fragmento migrado, entidades incluidas.
 */
export const COMUN_ES: Record<string, string> = {
  // --- CTA final, en ~100 páginas ---
  'Request your free Estimate': 'Solicite su presupuesto gratis',
  'Meet with our exterior designers for a free consultation. We&#x27;ll assess your space and goals to plan the installation of pergolas, patio covers, or pool enclosures.':
    'Reúnase con nuestros diseñadores de exteriores en una consulta gratuita. Evaluamos su espacio y sus objetivos para planificar la instalación de pérgolas, cubiertas de patio o cerramientos de piscina.',
  // El alt del fondo generico, el que llevan las ~79 paginas que NO son ficha de
  // producto o servicio. Faltaba: iba en ingles en las ~100 paginas de /es/ y
  // ninguna puerta lo veia. La version por clave de shell.ts solo cubre el
  // CtaFinal.astro del blog y el FAQ, no el bloque de los fragmentos migrados.
  'Luxury outdoor living in South Florida featuring a custom pool, modern pergola with outdoor kitchen, tropical landscaping, and elegant patio design for high-end residential properties.':
    'Vida al aire libre de lujo en el sur de Florida: piscina a medida, pérgola moderna con cocina exterior, jardinería tropical y patio elegante para viviendas de alta gama.',
  'Get A Quote': 'Pedir presupuesto',
  'Get a Quote': 'Pedir presupuesto',
  'Schedule A Visit': 'Agendar una visita',

  // --- Enlaces y botones recurrentes ---
  'Explore More →': 'Ver más →',

  // --- Las cuatro tarjetas de «Comparar las cubiertas» -------------------------
  //
  // El bloque de comparacion inyecta en la ficha de producto COPIAS de las tarjetas
  // de /products, y su titular, su alt y su texto de enlace no estaban traducidos en
  // ningun sitio que la ficha cargue: los cuatro `h3` SI existen traducidos, pero en
  // `paginas.es.ts`, que solo usa /es/products.
  //
  // VAN EN `comun.es.ts` Y NO EN EL DICCIONARIO DEL PRODUCTO a proposito: el bloque
  // sera el mismo cuando esto se replique a las otras nueve fichas, asi que aqui se
  // resuelve una vez para las diez. En el diccionario de la ficha habria que
  // acordarse cada vez, y a la tercera se olvida.
  //
  // Y hay un numero detras: la ficha española va hoy al 100 % de cobertura con ~220
  // nodos, o sea un margen de unos 4 nodos hasta el 98 % que exige check:i18n.
  // Cuatro `h3` sin traducir se lo comen entero. Los cuatro `alt` son peores: no los
  // mira ninguna puerta, asi que se publicarian en ingles sin que nadie avise.
  'Modern Insulated Roof Pergolas': 'Pérgolas modernas de techo aislado',
  'Custom Open-Air Aluminum Pergolas': 'Pérgolas abiertas de aluminio a medida',
  'Modern Polycarbonate Pergola Systems': 'Pérgolas modernas de policarbonato',
  'Solar-Integrated Shade Structures': 'Estructuras de sombra con solar integrada',
  'Engineered insulated roof pergolas designed for heat reduction and long-term performance in South Florida outdoor living spaces.':
    'Pérgolas de techo aislado calculadas para bajar el calor y rendir a largo plazo en los exteriores del sur de Florida.',
  'Modern open-air aluminum pergolas designed and built in South Florida for luxury residential outdoor environments.':
    'Pérgolas abiertas de aluminio, diseñadas y construidas en el sur de Florida para exteriores residenciales de gama alta.',
  'Custom polycarbonate pergola systems installed in South Florida, providing natural light and weather protection for modern patios.':
    'Pérgolas de policarbonato a medida instaladas en el sur de Florida, que dejan pasar la luz natural y protegen de la intemperie en patios actuales.',
  'Engineered solar roof structures combining shade and energy efficiency for South Florida residential properties.':
    'Estructuras de techo solar calculadas, que combinan sombra y eficiencia energética en viviendas del sur de Florida.',
  // El texto VISIBLE del enlace de cada tarjeta. En /products las cuatro dicen
  // «Explore More →», que como texto de ancla no vale nada y como lista de enlaces
  // para un lector de pantalla es peor. En las copias inyectadas dice el producto.
  'Insulated Solid Roof Pergolas': 'Pérgolas de techo aislado',
  'Open-Air Aluminum Pergolas': 'Pérgolas abiertas de aluminio',
  'Polycarbonate Roof Pergolas': 'Pérgolas con techo de policarbonato',
  'Solar-Integrated Pergolas': 'Pérgolas con solar integrada',
  'Read More →': 'Leer más →',
  'More about us': 'Más sobre nosotros',
  'More About Us': 'Más sobre nosotros',
  'explore our work': 'ver nuestro trabajo',
  'View Our Work': 'Ver nuestro trabajo',
  'Read Client Reviews': 'Leer opiniones de clientes',
  'Go to the main page': 'Ir a la página principal',

  // --- Sellos de confianza, repetidos en las páginas interiores ---
  'Licensed &amp;Insured In Florida': 'Con licencia y seguro en Florida',
  'Over 10 Years of Experience': 'Más de 10 años de experiencia',
  'Premium Materials &amp; Guaranteed Installation':
    'Materiales premium e instalación garantizada',
  'Custom Designs Tailored to Your Space': 'Diseños a medida para su espacio',

  // --- Formularios ---
  'Please wait...': 'Espere...',
  'Oops! Something went wrong while submitting the form.':
    'Vaya. Algo ha fallado al enviar el formulario.',
  'Thank you! Your request has been successfully received.':
    'Gracias. Hemos recibido su solicitud.',
  'Our team is reviewing your project details and will contact you shortly with next steps and recommendations.':
    'Nuestro equipo está revisando los detalles de su proyecto y le contactará en breve con los siguientes pasos y nuestras recomendaciones.',
  'By submitting this form, you agree to our': 'Al enviar este formulario, acepta nuestros',
  // El nodo llega con y sin espacio final segun el formulario, asi que las dos.
  'Terms ': 'Términos ',
  Terms: 'Términos',
  'Privacy Policy.': 'Política de Privacidad.',
  'Privacy Policy': 'Política de Privacidad',
  'I consent to receive SMS communications from Pergola Plus Florida regarding project updates, design consultations, scheduling, and promotional information. I understand I may opt out at any time by replying STOP. Message and data rates may apply.':
    'Doy mi consentimiento para recibir comunicaciones por SMS de Pergola Plus Florida sobre actualizaciones del proyecto, consultas de diseño, citas e información promocional. Entiendo que puedo darme de baja en cualquier momento respondiendo STOP. Pueden aplicarse tarifas de mensajes y datos.',
  'Select one...': 'Seleccione una opción...',

  // --- Fachada del calendario de OnceHub (/contact-us/schedule-a-visit) ---
  // El texto lo inyecta el transformador en inglés y se traduce aquí como cualquier
  // otro nodo. El enlace lo reapunta al español la integración de astro.config.mjs.
  'Loading the booking calendar…': 'Cargando el calendario de citas…',
  'Prefer not to wait? Call': '¿Prefiere no esperar? Llame al',
  'send us a message': 'escríbanos un mensaje',

  // --- Bloque «Our Process», en las 7 páginas de servicio y en varias más ---
  'Our Process': 'Nuestro proceso',
  'How We Build It': 'Cómo lo construimos',
  'As well as building in accordance with the latest codes to ensure your structure is safe, we strive to provide unique service, installation, quality, and value.':
    'Además de construir conforme a la normativa vigente para que su estructura sea segura, nos esforzamos por dar un servicio, una instalación, una calidad y un valor que no encontrará en otro sitio.',
  'Property Visit': 'Visita a la propiedad',
  'We visit your property, take measurements, and understand your needs so we can design your pergola precisely with care.':
    'Visitamos su propiedad, tomamos medidas y entendemos lo que necesita para diseñar su pérgola con precisión.',
  'We design your structure': 'Diseñamos su estructura',
  'We create a custom design that matches your space, style, and goals, ensuring every detail reflects your outdoor vision.':
    'Creamos un diseño a medida que encaja con su espacio, su estilo y sus objetivos, cuidando que cada detalle responda a lo que tiene en mente.',
  'We build it right': 'La construimos bien',
  'Our team builds your pergola with precision, durable materials, and clean workmanship, delivering strength and quality..':
    'Nuestro equipo construye su pérgola con precisión, materiales duraderos y buen acabado, para que resista y se note.',
  'You enjoy it': 'Usted la disfruta',
  'Once installed, your pergola is ready to enjoy. We clean your space, ensure everything works perfectly, and leave it all':
    'Una vez instalada, su pérgola está lista. Limpiamos la zona, comprobamos que todo funciona y se lo dejamos todo en orden',

  // --- Encabezados de sección recurrentes ---
  'Discover What Our Service Includes!': '¿Qué incluye nuestro servicio?',
  'Featured Gallery': 'Galería destacada',
  Questions: 'Preguntas',
  'Our Projects': 'Nuestros proyectos',
  'Recent Projects': 'Proyectos recientes',
  'Get inspired by some of our latest work.': 'Inspírese con algunos de nuestros últimos trabajos.',
  'Service Areas': 'Zonas de servicio',
  'Explore Area Services': 'Ver zonas de servicio',
  // Va dentro de `.w-dyn-hide`, que el CSS oculta: es el placeholder de colección
  // vacía de Webflow y no lo ve nadie. Se traduce igualmente para que no cuente como
  // pendiente en check:i18n.
  'No items found.': 'No hay elementos.',

  // --- Tarjetas de proyecto, en ~40 páginas ---
  // Los nombres de producto (FORTE, FORTE Plus, ECLIPSE) y los topónimos NO se
  // traducen: son marca y lugares reales.
  'FORTE Plus Pergolas in Hillsboro Beach Estate': 'Pérgolas FORTE Plus en una finca de Hillsboro Beach',
  'FORTE Plus aluminum pergolas installed at a luxury beachfront estate in Hillsboro Beach, engineered for South Florida coastal durability.':
    'Pérgolas FORTE Plus de aluminio instaladas en una finca frente al mar en Hillsboro Beach, calculadas para durar en la costa del sur de Florida.',
  'Attached FORTE Plus Pergola on the Intracoastal in Boca Raton': 'Pérgola FORTE Plus adosada sobre el Intracoastal, en Boca Ratón',
  'Attached FORTE Plus aluminum pergola installed on the Intracoastal in Boca Raton, engineered for South Florida coastal durability.':
    'Pérgola FORTE Plus de aluminio adosada, instalada sobre el Intracoastal en Boca Ratón y calculada para durar en la costa del sur de Florida.',
  'FORTE Pergola with Privacy Wall &amp; TV Mount in Delray Beach': 'Pérgola FORTE con muro de privacidad y soporte de TV en Delray Beach',
  'Custom FORTE pergola with privacy wall and TV mount installed in Delray Beach, engineered for South Florida residential outdoor living.':
    'Pérgola FORTE a medida con muro de privacidad y soporte de televisión, instalada en Delray Beach para vivir el exterior en el sur de Florida.',
  'ECLIPSE Cabanas &amp; FORTE Pergola Hospitality Project in Riviera Beach': 'Cabañas ECLIPSE y pérgola FORTE para hostelería en Riviera Beach',
  'ECLIPSE cabanas and FORTE pergola installed for a hospitality project in Riviera Beach, engineered for South Florida commercial performance.':
    'Cabañas ECLIPSE y pérgola FORTE instaladas en un proyecto de hostelería en Riviera Beach, calculadas para uso comercial en el sur de Florida.',
  'Attached FORTE Pergola in West Palm Beach': 'Pérgola FORTE adosada en West Palm Beach',
  'Attached FORTE aluminum pergola installed in West Palm Beach, engineered for South Florida residential outdoor living.':
    'Pérgola FORTE de aluminio adosada, instalada en West Palm Beach para vivir el exterior en el sur de Florida.',
  'FORTE Pergolas in Greenacres Pool Patio': 'Pérgolas FORTE en un patio de piscina en Greenacres',
  'Custom FORTE aluminum pergolas installed in Greenacres pool patio, engineered for South Florida residential outdoor living.':
    'Pérgolas FORTE de aluminio a medida instaladas en un patio de piscina en Greenacres, para vivir el exterior en el sur de Florida.',
  'FORTE Plus Pergola with Outdoor Kitchen in Delray Beach': 'Pérgola FORTE Plus con cocina exterior en Delray Beach',
  'Custom FORTE Plus pergola integrated with an outdoor kitchen in Delray Beach, engineered for South Florida luxury residential living.':
    'Pérgola FORTE Plus a medida integrada con una cocina exterior en Delray Beach, para viviendas de lujo del sur de Florida.',
  'FORTE Pergola with Partial Privacy Wall in Palm Beach Gardens': 'Pérgola FORTE con muro de privacidad parcial en Palm Beach Gardens',
  'Custom FORTE aluminum pergola with partial privacy wall installed in Palm Beach Gardens, engineered for South Florida residential properties.':
    'Pérgola FORTE de aluminio a medida con muro de privacidad parcial, instalada en Palm Beach Gardens para viviendas del sur de Florida.',
  'FORTE Pergola with Privacy Wall &amp; Motorized Screen in Delray Beach': 'Pérgola FORTE con muro de privacidad y cortina motorizada en Delray Beach',
  'Custom FORTE pergola with privacy wall and motorized shade screen installed in Delray Beach, engineered for South Florida luxury homes.':
    'Pérgola FORTE a medida con muro de privacidad y cortina motorizada, instalada en Delray Beach para viviendas de lujo del sur de Florida.',
  'FORTE Plus Aluminum Carport Installation in Pompano Beach': 'Cochera de aluminio FORTE Plus en Pompano Beach',
  'Custom FORTE Plus aluminum carport installed in Pompano Beach, engineered to meet Florida building codes and coastal conditions.':
    'Cochera de aluminio FORTE Plus a medida instalada en Pompano Beach, calculada para cumplir la normativa de Florida y aguantar el ambiente costero.',

  // --- Sellos que se repiten en varias páginas de servicio ---
  'Engineered for Florida’s Climate': 'Calculado para el clima de Florida',
  'Weather-Resistant Construction': 'Construcción resistente a la intemperie',
  'Designed to Complement Your Home': 'Diseñado para acompañar a su casa',
  'Fully Permitted &amp; Code Compliant': 'Con todos los permisos y conforme a normativa',

  // --- Bloques que salen en ~100 paginas: zonas de servicio y reseñas ---
  'Proudly Serving South Florida': 'Damos servicio en todo el sur de Florida',
  'We provide professional pergola construction across Miami-Dade, Broward, and Palm Beach. Our team builds custom pergolas designed for Florida’s heat, humidity, and coastal conditions—delivering durable, beautiful outdoor spaces for homes and businesses throughout the region.':
    'Construimos pérgolas de forma profesional en Miami-Dade, Broward y Palm Beach. Nuestro equipo levanta pérgolas a medida pensadas para el calor, la humedad y las condiciones costeras de Florida, con espacios exteriores duraderos y bonitos para viviendas y negocios de toda la región.',
  'Reviews &amp; testimonials': 'Opiniones y testimonios',
  'What Clients Say About Our Work': 'Lo que dicen nuestros clientes',
  'Discover how our pergola contractors transform outdoor spaces with expert installation of pergolas, patio covers, pool screen enclosures, and louvered roof systems across South Florida.':
    'Vea cómo transformamos espacios exteriores instalando pérgolas, cubiertas de patio, cerramientos de piscina y techos de lamas por todo el sur de Florida.',
  'Miami-Dade County': 'Condado de Miami-Dade',
  'Broward County': 'Condado de Broward',
  'Palm Beach County': 'Condado de Palm Beach',

  // Las entradillas de servicio salen IGUAL en /services y en /services/<slug>.
  'Our premium paver installations enhance driveways, patios, and pool decks with structural precision and refined finishes. Each system is engineered for proper drainage, long-term stability, and full code compliance. Designed for upscale properties, our pavers withstand South Florida’s heavy rain and heat while elevating curb appeal. We focus on permanent, professionally installed solutions — not temporary surface upgrades.':
    'Nuestro adoquinado premium mejora entradas de coche, patios y bordes de piscina con precisión estructural y buenos acabados. Cada sistema se calcula para drenar bien, mantenerse estable en el tiempo y cumplir la normativa. Pensado para propiedades de alto nivel, aguanta las lluvias fuertes y el calor del sur de Florida a la vez que mejora la fachada. Buscamos soluciones permanentes y bien instaladas, no un apaño de superficie.',

  // Se repiten en el indice /services Y en la pagina de cada servicio.
  'As well as building in accordance with the latest codes to ensure your structure is safe, we strive to provide unique service, installation, quality, satisfaction, and reasonable pricing. Work with us and you won&#x27;t be disappointed. Beauty and security will last a lifetime.':
        'Además de construir conforme a la normativa vigente para que su estructura sea segura, nos esforzamos por dar un servicio, una instalación, una calidad y un precio que merezcan la pena. Trabaje con nosotros y no se arrepentirá: la belleza y la seguridad duran toda la vida.',
  'A custom driveway defines your property’s first impression. We design and install high-end paver driveways with reinforced foundations engineered for durability and structural performance. Built for luxury homes, our driveway systems combine architectural elegance with long-term resilience against Florida’s climate conditions. Every project is permitted, professionally executed, and tailored to complement your home’s exterior design.':
    'La entrada de coche es la primera impresión de una propiedad. Diseñamos e instalamos entradas adoquinadas de gama alta sobre bases reforzadas, calculadas para durar y para aguantar el uso. Pensadas para viviendas de lujo, combinan elegancia arquitectónica con resistencia a largo plazo frente al clima de Florida. Cada proyecto se tramita, se ejecuta con profesionales y se ajusta al diseño exterior de su casa.',
  'We design and build fully engineered custom pergolas for high-end residential properties across Palm Beach and Broward County. Every structure is professionally designed, permitted, and installed to withstand Florida’s heat, humidity, and coastal exposure. From modern aluminum pergolas to advanced louvered roof systems, our projects are architecturally integrated and built for long-term durability. This is not a kit installation — it’s a custom investment designed to elevate outdoor comfort and increase property value.':
    'Diseñamos y construimos pérgolas a medida, con cálculo estructural completo, para viviendas de alto nivel en Palm Beach y Broward. Cada estructura se proyecta, se tramita y se instala para aguantar el calor, la humedad y la exposición costera de Florida. Desde pérgolas de aluminio modernas hasta sistemas avanzados de techo de lamas, nuestros proyectos se integran en la arquitectura y se construyen para durar. Esto no es montar un kit: es una inversión a medida para vivir mejor el exterior y revalorizar la propiedad.',

  'Our structural concrete services provide the foundation for high-end outdoor projects. From reinforced pergola slabs to patio foundations and custom drive surfaces, every installation is engineered for strength, precision, and code compliance. We prioritize proper reinforcement, drainage, and curing to ensure long-term structural integrity. These are permanent solutions designed to support premium outdoor living investments.':
    'Nuestros servicios de hormigón estructural son la base de los proyectos exteriores de alto nivel. Desde losas armadas para pérgolas hasta cimentaciones de patio y pavimentos de acceso, cada trabajo se calcula para resistir, ser preciso y cumplir normativa. Cuidamos el armado, el drenaje y el curado para garantizar la integridad estructural a largo plazo. Son soluciones permanentes, pensadas para sostener una inversión exterior premium.',
  'We design and build custom composite and aluminum decks tailored to upscale Florida homes. Engineered for durability and coastal performance, our decks are fully permitted and professionally installed. Ideal for poolside environments and integrated pergola systems, each project enhances outdoor functionality while increasing property value. We focus on long-term architectural solutions — not temporary wood installations.':
    'Diseñamos y construimos decks a medida en composite y aluminio para viviendas de alto nivel en Florida. Calculados para durar y rendir en ambiente costero, se instalan con todos los permisos y por profesionales. Ideales junto a la piscina y para integrarse con pérgolas, cada proyecto suma funcionalidad al exterior y valor a la propiedad. Buscamos soluciones arquitectónicas duraderas, no una tarima de madera provisional.',

  'Our custom fence installations enhance privacy, security, and architectural cohesion for luxury residential properties. We install high-quality aluminum and modern fencing systems engineered for wind resistance and coastal durability. Every project is professionally installed and compliant with local regulations. Designed to complement upscale homes, our fencing solutions balance aesthetics with long-term performance.':
    'Nuestro vallado a medida aporta privacidad, seguridad y coherencia arquitectónica a viviendas de lujo. Instalamos sistemas de aluminio de alta calidad y vallados modernos, calculados para resistir el viento y durar en ambiente costero. Cada proyecto lo instalan profesionales y cumple la normativa local. Pensadas para acompañar a casas de alto nivel, nuestras soluciones equilibran estética y rendimiento a largo plazo.',
  'We remodel entire outdoor spaces, not just the patio. Pavers and driveways, structural concrete, decks and fencing, integrated pergolas, motorized screens, lighting and drainage — designed, permitted and built as one project. Our approach focuses on architectural integration, durability, and long-term value, turning the whole exterior of your home into a seamless extension of the way you live indoors.':
    'Remodelamos exteriores enteros, no solo el patio. Adoquinado y entradas de coche, hormigón estructural, decks y cercas, pérgolas integradas, cortinas motorizadas, iluminación y drenaje: diseñado, tramitado y construido como un solo proyecto. Nos centramos en la integración con la arquitectura, en la durabilidad y en el valor a largo plazo, para que todo el exterior de la casa sea una continuación natural de cómo se vive dentro.',

  // --- Paleta de acabados, en las 10 fichas de producto ---
  // Los nombres de color SÍ se traducen: son etiquetas descriptivas de una carta de
  // colores para que el cliente elija, no referencias de pedido. Un hispanohablante
  // leyendo «desert sand» pierde información que el inglés sí da.
  'Design That Matches Your Style': 'Un diseño que va con su estilo',
  'Choose from premium colors &amp; textures for your structure.':
    'Elija entre colores y texturas de gama alta para su estructura.',
  white: 'blanco',
  'desert sand': 'arena del desierto',
  'almond sand': 'arena almendra',
  'adobe clay': 'barro adobe',
  'spanish brown': 'marrón español',
  'bronze cedar': 'cedro bronce',
  'Modern Color Palette Options': 'Paleta de colores actual',
  'Choose from a selection of elegant, weather-resistant colors designed to enhance your outdoor space and match your home’s architectural style.':
    'Elija entre una selección de colores elegantes y resistentes a la intemperie, pensados para mejorar su espacio exterior y acompañar al estilo de su casa.',
  'Textured Wood-Like Finishes': 'Acabados con textura de madera',
  'Enjoy realistic wood-inspired textures that offer the warmth of natural materials with the durability and low maintenance of high-grade aluminum.':
    'Texturas de inspiración natural que dan la calidez de la madera con la durabilidad y el poco mantenimiento del aluminio de alta calidad.',

  // --- Bloque de servicios, en las 10 fichas y en varias páginas más ---
  'Our Services': 'Nuestros servicios',
  'Everything Your Patio Needs, All In One Place': 'Todo lo que su patio necesita, en un solo sitio',
  'Transform your outdoor space with a complete range of services—from custom pergola construction to concrete, pavers, decks, fencing, and full outdoor remodels—designed to enhance both beauty and functionality.':
    'Transforme su espacio exterior con una gama completa de servicios: desde pérgolas a medida hasta hormigón, adoquinado, decks, vallado y remodelaciones exteriores integrales, pensados para que gane en belleza y en uso.',
  'Custom aluminum pergolas built for shade, style, and durability.':
    'Pérgolas de aluminio a medida, hechas para dar sombra, estilo y durar.',
  'Premium paver installations for patios, walkways, and driveways.':
    'Adoquinado de gama alta para patios, caminos y entradas de coche.',
  'Custom driveways engineered for strength and curb appeal.':
    'Entradas de coche a medida, calculadas para resistir y para lucir.',
  'Architectural concrete patios built for lasting performance.':
    'Patios de hormigón con diseño, construidos para durar.',
  'Custom decks designed for durability &amp; seamless integration.':
    'Decks a medida, pensados para durar e integrarse sin costuras.',
  'Residential fencing for privacy, security, and clean design.':
    'Vallado residencial para privacidad, seguridad y una línea limpia.',
  'Complete outdoor renovations: patio, hardscape, shade and lighting as one project.':
    'Remodelación completa del exterior: patio, adoquinado, sombra e iluminación en un solo proyecto.',
  'Contractors Proudly Serving South Florida': 'Damos servicio en todo el sur de Florida',

  // --- Teasers del blog, en las 10 fichas ---
  // Los títulos coinciden con los de las entradas reales. Cuando se traduzca el blog,
  // estas traducciones son las que hay que reutilizar para que no se contradigan.
  'Blog &amp; Tips': 'Blog y consejos',
  'Latest Outdoor Living Insights': 'Lo último sobre vida al aire libre',
  'Expert tips, ideas, and guides to help you upgrade your patio, enhance your home, and get inspired with premium outdoor design.':
    'Consejos, ideas y guías para mejorar su patio, revalorizar su casa e inspirarse con diseño exterior de gama alta.',
  'Buying Guides &amp; Cost': 'Guías de compra y precios',
  'Outdoor Living Design': 'Diseño de exteriores',
  'February 23, 2026': '23 de febrero de 2026',
  'February 27, 2026': '27 de febrero de 2026',
  'Do You Need a Permit for a Pergola in South Florida?':
    '¿Hace falta permiso para una pérgola en el sur de Florida?',
  'Permit requirements for pergolas in South Florida explained.':
    'Qué permisos piden las pérgolas en el sur de Florida, explicado.',
  'Design-Build Pergola Process for South Florida Homes':
    'Cómo es el proceso de diseño y construcción de una pérgola',
  'How the design-build pergola process works in South Florida.':
    'Cómo funciona el proceso de diseño y construcción en el sur de Florida.',
  'How to Plan a Pergola for Your South Florida Backyard':
    'Cómo planificar la pérgola de su jardín en el sur de Florida',
  'Step-by-step guide to planning a pergola in South Florida.':
    'Guía paso a paso para planificar una pérgola en el sur de Florida.',
  'Luxury Pergola Ideas for South Florida Backyards':
    'Ideas de pérgolas de lujo para jardines del sur de Florida',
  'High-end pergola design ideas for South Florida luxury homes.':
    'Ideas de diseño de pérgolas de gama alta para viviendas de lujo.',
  'Poolside Pergola Ideas for Florida Homes':
    'Ideas de pérgolas junto a la piscina para casas de Florida',
  'Luxury poolside pergola ideas for Florida backyards.':
    'Ideas de pérgolas de lujo junto a la piscina para jardines de Florida.',
  'Step-by-Step: Building a Custom Pergola in South Florida':
    'Paso a paso: construir una pérgola a medida en el sur de Florida',
  'Step-by-step guide to building a pergola in South Florida.':
    'Guía paso a paso para construir una pérgola en el sur de Florida.',
  'How Much Does a Pergola Cost in South Florida?':
    '¿Cuánto cuesta una pérgola en el sur de Florida?',
  '2026 pergola cost breakdown for South Florida homes.':
    'Desglose de precios de pérgolas en 2026 para casas del sur de Florida.',
  'HOA Rules for Pergolas in South Florida Communities':
    'Normas de la HOA para pérgolas en comunidades del sur de Florida',
  'HOA requirements for pergolas in South Florida explained.':
    'Qué exigen las comunidades de propietarios para una pérgola, explicado.',
  'Modern Outdoor Living Trends in South Florida':
    'Tendencias actuales de vida al aire libre en el sur de Florida',
  '2026 luxury outdoor living trends shaping South Florida homes.':
    'Las tendencias de 2026 que están marcando las casas del sur de Florida.',
  'Pergola Building Codes in Broward &amp; Palm Beach County':
    'Normativa de pérgolas en los condados de Broward y Palm Beach',
  'Understanding pergola codes in Broward &amp; Palm Beach County.':
    'Entender la normativa de pérgolas en Broward y Palm Beach.',

  // Nombres de servicio del bloque «Our Services», que sale en las 10 fichas de
  // producto y en el índice. Estaban en diccionarios de página; aquí no pueden
  // contradecirse entre sí.
  'Pergola Design &amp; Construction': 'Diseño y construcción de pérgolas',
  'Deck Builders': 'Decks',
  'Fence Solutions': 'Vallado',
  'Full Outdoor Remodel': 'Remodelación exterior integral',
  'Take full control of your outdoor space with our custom louvered pergolas. Engineered for South Florida, the adjustable aluminum louvers regulate sun and rain at the touch of a button. A sophisticated, all-season solution for luxury outdoor living.':
    'Tome el control total de su espacio exterior con nuestras pérgolas de lamas a medida. Diseñadas para el sur de Florida, las lamas de aluminio orientables regulan el sol y la lluvia con solo pulsar un botón. Una solución sofisticada para disfrutar del exterior todo el año.',

  Pavers: 'Adoquinado',
  Driveways: 'Entradas de coche',
  Concrete: 'Hormigón',
  'Our insulated roof pergolas offer maximum thermal performance, reducing heat while providing full shade and rain protection. These engineered aluminum systems create a cooler, comfortable outdoor space—perfect for year-round use and architectural beauty.':
    'Nuestras pérgolas de techo aislado ofrecen el máximo rendimiento térmico: reducen el calor y dan sombra total y protección frente a la lluvia. Estos sistemas de aluminio calculados crean un espacio exterior más fresco y confortable, perfecto para usar todo el año y con una estética cuidada.',

  'Define your outdoor living with our premium aluminum open-air pergolas. Custom-designed for luxury homes, these structures add architectural depth and property value while preserving airflow and sky views. The ultimate blend of style and open-air comfort.':
    'Defina su espacio exterior con nuestras pérgolas abiertas de aluminio premium. Diseñadas a medida para viviendas de lujo, aportan profundidad arquitectónica y valor a la propiedad sin renunciar a la ventilación ni a las vistas al cielo. La mezcla perfecta de estilo y confort al aire libre.',
  'Our custom aluminum cabanas create refined outdoor retreats with resort-inspired design. Engineered for durability and privacy, these structures provide shaded comfort while elevating the overall aesthetic of your pool area or backyard entertainment space.':
    'Nuestras cabañas de aluminio a medida crean refugios exteriores con un diseño de inspiración resort. Calculadas para durar y para dar privacidad, aportan sombra y confort a la vez que elevan la estética de su zona de piscina o de su jardín.',
  'Motorized Screens': 'Cortinas motorizadas',
  'Aluminum Carports': 'Cocheras de aluminio',
  'Polycarbonate Pergolas': 'Pérgolas de policarbonato',
  'Solar Pergolas': 'Pérgolas solares',
  'Custom Architectural Integration': 'Integración con la arquitectura',
  'Our aluminum carports protect luxury vehicles from harsh sun and rain while elevating your home’s architecture. Built for structural integrity and long-term durability, they offer premium, stylish protection. The perfect blend of strength and design.':
    'Nuestras cocheras de aluminio protegen los coches del sol fuerte y de la lluvia, y de paso elevan la arquitectura de la casa. Calculadas para ser sólidas y durar, dan una protección de calidad y con buen aspecto: la mezcla justa de resistencia y diseño.',
  'Our polycarbonate pergolas blend durability with natural light, blocking UV rays while maintaining brightness. Engineered for weather resistance, they are perfect for elegant patios and pool decks. Get a modern design that offers protection and openness.':
    'Nuestras pérgolas de policarbonato unen durabilidad y luz natural: frenan los rayos UV sin dejar el espacio a oscuras. Calculadas para aguantar el tiempo, van muy bien en patios y zonas de piscina. Un diseño actual que protege sin cerrar.',
  'Solar roof structures combine architectural strength with energy innovation. Engineered to support solar panel integration, these systems provide shade and weather protection while allowing homeowners to invest in sustainable, high-performance outdoor infrastructure.':
    'Las estructuras solares unen solidez arquitectónica e innovación energética. Están calculadas para llevar paneles fotovoltaicos, así que dan sombra y protegen del tiempo a la vez que convierten el exterior en una inversión sostenible.',
  'The Sukkha 3000 is a premium outdoor structure that merges cutting-edge engineering with contemporary design. Built for homeowners seeking the highest level of performance, durability, and customization, this system redefines what a luxury outdoor space can achieve.':
    'El Sukkha 3000 es una estructura exterior de alta gama que une ingeniería de vanguardia y diseño contemporáneo. Pensada para quien busca lo máximo en prestaciones, durabilidad y personalización, redefine hasta dónde puede llegar un exterior de lujo.',
  'Protect your outdoor space from insects and debris with our custom, fully permitted screen enclosures. Designed for South Florida, they preserve airflow and visibility, ensuring comfortable evenings while matching your home’s architectural integrity.':
    'Proteja su exterior de insectos y suciedad con nuestros cerramientos a medida y con todos los permisos. Pensados para el sur de Florida, mantienen la ventilación y las vistas para que las tardes se disfruten, y respetan la arquitectura de la casa.',
  'Motorized screens provide on-demand shade, privacy, and wind control with seamless automation. Designed to integrate into pergolas, patios, and covered outdoor spaces, these premium systems enhance comfort while maintaining a sleek, modern appearance.':
    'Las cortinas motorizadas dan sombra, privacidad y control del viento cuando usted quiere, con una automatización que no se nota. Se integran en pérgolas, patios y porches, y aportan confort sin romper una línea limpia y actual.',
  // Nombres de producto: salen en la galeria (filtros), en el menu y en las fichas.
  'Motorized Louvered Pergolas': 'Pérgolas de lamas motorizadas',
  'Solid Roof Pergolas': 'Pérgolas de techo macizo',
  'Open-Air Pergolas': 'Pérgolas abiertas',
  'Screen Enclosures': 'Cerramientos con mosquitero',
  'Residential': 'Residencial',
  'Commercial': 'Comercial',
  'Cabanas': 'Cabañas',
  // Cierre compartido por /resources/faq y /resources/warranties.
  'Need more information?': '¿Necesita más información?',
  'Reach out to our team for specifics about your project':
    'Hable con nuestro equipo y le contamos lo que aplique a su proyecto',
  // Bloque de cifras, en /about-us y en /industries-we-serve.
  'Our Impact': 'Nuestros números',
  'KPIs / Quick Facts': 'Cifras rápidas',
  'Projects completed': 'Proyectos terminados',
  'Years in business': 'Años en el oficio',
  'Customer satisfaction rate': 'Clientes satisfechos',
  'Licensed &amp; Engineered in South Florida': 'Con licencia y cálculo en el sur de Florida',
  'Contact Us': 'Contacto',
  'Discover premium aluminum pergolas and custom outdoor shade solutions expertly designed and installed across South Florida, delivering durability, style, and elevated luxury outdoor living.':
    'Pérgolas de aluminio de gama alta y soluciones de sombra a medida, diseñadas e instaladas por todo el sur de Florida: duran, se ven bien y elevan la vida al aire libre.',
  'Pergola Plus Florida - Licensed &amp; Insured CGC1539940 in South Florida':
    'Pergola Plus Florida — con licencia y seguro CGC1539940 en el sur de Florida',
  // Marcas: los nombres NO se traducen, pero sí lo que las describe. Estas cadenas
  // salen a la vez en /about-us/brands y en cada ficha de marca.
  'Visit Our Partners&#x27; Websites': 'Visite las webs de nuestros socios',
  'View Product Gallery': 'Ver galería del producto',
  'Pergola Plus Florida specializes in custom aluminum pergolas, louvered roofs, and patio covers, combining quality materials with expert craftsmanship. With over 10 years of experience, they serve South Florida with licensed, insured, and reliable service.':
    'Pergola Plus Florida se dedica a las pérgolas de aluminio a medida, los techos de lamas y las cubiertas de patio, con buenos materiales y buen oficio. Con más de diez años de experiencia, trabajan en el sur de Florida con licencia, seguro y seriedad.',
  'Equinox offers motorized louvered roof systems that provide customizable shade and ventilation, allowing control of light and weather protection with a button. Their durable, modern designs ensure long-lasting outdoor comfort.':
    'Equinox fabrica techos de lamas motorizados que dan sombra y ventilación a medida: la luz y la protección frente al tiempo se controlan con un botón. Diseños actuales y resistentes, para un confort que dura.',
  'Apollo Opening Roof offers motorized louvered pergolas that let you control sunlight, shade, and airflow with remote, app, or voice commands. Seamlessly smart-home compatible and built to last, they elevate any outdoor space in style.':
    'Apollo Opening Roof fabrica pérgolas de lamas motorizadas que dejan controlar el sol, la sombra y el aire con mando, con la app o por voz. Compatibles con domótica y hechas para durar, elevan cualquier exterior.',
  'Renaissance specializes in creating durable, customizable outdoor solutions like pergolas, patio covers, and screen rooms. Their designs combine strength with style, enhancing any outdoor space. Explore their innovative, weather-resistant products to elevate your backyard.':
    'Renaissance se dedica a soluciones exteriores duraderas y personalizables: pérgolas, cubiertas de patio y salas con mosquitera. Sus diseños unen resistencia y estilo, y mejoran cualquier exterior. Vea sus productos resistentes a la intemperie.',
  '\u200bFenetex specializes in premium motorized screens and shades for residential and commercial outdoor spaces. Their product lineup includes insect screens, clear weather screens, shade screens, and hurricane screens, all designed for durability and ease of use. Established in 2007, Fenetex focuses on innovation and quality to enhance outdoor living areas. \u200b':
    'Fenetex se dedica a las cortinas y estores motorizados de gama alta para exteriores residenciales y comerciales. Su catálogo incluye mosquiteras, cortinas transparentes, cortinas de sombra y cortinas para huracán, todas pensadas para durar y para usarse con facilidad. Fundada en 2007, apuesta por la innovación y la calidad.',
  'Custom Luxury Pergolas': 'Pérgolas de lujo a medida',
  'Florida Code Compliant': 'Conforme a la normativa de Florida',
  'Design-Build Specialists': 'Especialistas en diseño y obra',
  'Adjustable Roof Pergolas': 'Pérgolas de techo orientable',
  'High-Performance Louvers': 'Lamas de altas prestaciones',
  'All-Weather Shade Control': 'Sombra con cualquier tiempo',
  'Motorized Louvered Roofs': 'Techos de lamas motorizados',
  'Smart Shade Technology': 'Sombra con tecnología',
  'Remote-Control Pergolas': 'Pérgolas con mando a distancia',
  'Insulated Patio Covers': 'Cubiertas de patio aisladas',
  'Structural Aluminum Systems': 'Sistemas estructurales de aluminio',
  'Engineered Outdoor Covers': 'Cubiertas exteriores calculadas',
  'Motorized Screen Systems': 'Cortinas motorizadas',
  'Hurricane-Rated Screens': 'Cortinas homologadas para huracán',
  'Weather Protection Solutions': 'Protección frente al tiempo',
  // Identidad: se declara igual a si misma para que el contador de traducidas no la
  // marque como olvido. Un nombre de marca sin entrada y un texto sin traducir se
  // leen igual en el informe del build.
  'Pergola Plus | Forte': 'Pergola Plus | Forte',
  // Bloque comun a las 25 paginas de ubicacion.
  'Licensed &amp; Insured': 'Con licencia y seguro',
  '+10 Years of Experience': 'Más de 10 años de experiencia',
  'Financing Available': 'Financiación disponible',
  'Why choose us?': '¿Por qué nosotros?',
  'Why Pergola Plus Leads Outdoor Living in South Florida':
    'Por qué Pergola Plus marca el paso en el sur de Florida',
  'Work with licensed professionals delivering engineered pergolas, patio covers, and motorized systems built for South Florida homes and designed for long-term durability and performance.':
    'Trabaje con profesionales con licencia que entregan pérgolas, cubiertas de patio y sistemas motorizados calculados para las casas del sur de Florida y pensados para durar y rendir.',
  // Las cuatro razones. Salen en /about-us y en las 25 paginas de ubicacion.
  'Your project is protected and handled by certified professionals with full licensing and insurance in South Florida.':
    'Su obra la llevan profesionales certificados, con licencia y seguro en regla en el sur de Florida.',
  'More than a decade designing and installing premium outdoor structures, including pergolas, enclosures, and louvered roofs.':
    'Más de diez años diseñando e instalando estructuras exteriores: pérgolas, cerramientos y techos de lamas.',
  'We use top-grade materials and expert craftsmanship to ensure long-lasting, durable, and visually stunning shade structures.':
    'Usamos materiales de primera y buen oficio para que la estructura de sombra dure y se vea bien.',
  'Every project is built from scratch—no templates. We measure, design, and craft a solution that fits your home perfectly.':
    'Cada proyecto se hace desde cero, sin plantillas. Medimos, diseñamos y fabricamos una solución que encaja en su casa.',
  'About Us': 'Quiénes somos',
  'Where We Work': 'Dónde trabajamos',
  'Explore real installations of our motorized louvered roof pergolas across South Florida. See how homeowners and businesses elevate their outdoor spaces with modern design, premium materials, and all-weather comfort.':
    'Vea instalaciones reales de nuestras pérgolas de lamas motorizadas por el sur de Florida, y cómo particulares y empresas mejoran su exterior con diseño actual, buenos materiales y confort con cualquier tiempo.',
  // Los tres condados. Salen en /about-us/where-we-work y en cada pagina de condado.
  'We build custom pergolas, patio covers, and outdoor structures across Miami-Dade, delivering weather-resistant designs engineered for Florida sun, humidity, and coastal conditions. Our team provides licensed, insured installations throughout the region.':
    'Construimos pérgolas, cubiertas de patio y estructuras exteriores a medida por todo Miami-Dade, con diseños calculados para el sol, la humedad y la costa de Florida. Instalamos con licencia y seguro en toda la zona.',
  'From Fort Lauderdale to Weston, we install premium aluminum pergolas, motorized louvered roofs, patio covers, and complete outdoor living systems throughout Broward County. Every project is built for durability, style, and long-term performance.':
    'De Fort Lauderdale a Weston, instalamos pérgolas de aluminio, techos de lamas motorizados, cubiertas de patio y sistemas completos de exterior por todo el condado de Broward. Cada proyecto se hace para durar, para verse bien y para rendir.',
  'We design and build pergolas, patio roofs, and outdoor shading systems throughout Palm Beach County, using high-grade materials that hold strong in Florida’s coastal environment.':
    'Diseñamos y construimos pérgolas, techos de patio y sistemas de sombra por todo el condado de Palm Beach, con materiales de calidad que aguantan el ambiente costero de Florida.',
};
