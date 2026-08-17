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
  'Get A Quote': 'Pedir presupuesto',
  'Get a Quote': 'Pedir presupuesto',
  'Schedule A Visit': 'Agendar una visita',

  // --- Enlaces y botones recurrentes ---
  'Explore More →': 'Ver más →',
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
};
