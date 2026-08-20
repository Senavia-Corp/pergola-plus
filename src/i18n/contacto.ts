/**
 * Copia de /contact-us/get-in-touch y su gemela /es/.
 *
 * POR QUE VIVE AQUI Y NO SALE DEL TRADUCTOR
 *
 * El resto de paginas estaticas espanolas las monta el catch-all
 * src/pages/es/[...ruta].astro: coge el fragmento migrado y le pasa `traducirHtml`,
 * que sustituye NODOS DE TEXTO contra un diccionario. Esta pagina salio del Set
 * MANUALES de scripts/generar-paginas.mjs para poder rediseñarla, asi que ya no hay
 * fragmento del que partir y ese camino deja de existir.
 *
 * Es el mismo patron que el listado del blog, que tambien es de autoria propia y
 * tiene su gemela escrita a mano en src/pages/es/resources/blog.astro.
 *
 * Las traducciones NO son nuevas: salen de los diccionarios ya revisados —CONTACTO y
 * COMUN_ES en paginas.es.ts / comun.es.ts, y las secciones compartidas de home.es.ts—
 * para que la pagina no estrene una variante distinta de una frase que el cliente ya
 * lee en otras cien paginas.
 *
 * Lo que NO se traduce, a proposito:
 *   · los `value` de <select> y de los radios, que viajan al CRM;
 *   · el `alt` de las tres imagenes de condado, que hoy tampoco se traduce en /es/
 *     (el traductor solo toca nodos de texto, no atributos).
 */

export interface Dato {
  rotulo: string;
  apoyo: string;
  valor: string;
  /** Ausente = el dato NO es un enlace. El horario es el caso. */
  href?: string;
  nota?: string;
}

export interface CopiaContacto {
  eyebrow: string;
  titulo: string;
  intro: string;
  datos: { email: Dato; telefono: Dato; oficina: Dato; horario: Dato };
  sellos: string[];
  form: {
    titulo: string;
    apoyo: string;
    nombre: string;
    apellidos: string;
    email: string;
    telefono: string;
    tipoProyecto: string;
    tipoVacio: string;
    residencial: string;
    comercial: string;
    ustedEs: string;
    perfiles: string[];
    mensaje: string;
    mensajeApoyo: string;
    sms: string;
    /** Nombre corto del consentimiento en el resumen de errores: el texto legal
     *  entero es su <label> y ahi se queda, pero como vineta no se puede leer. */
    smsRotulo: string;
    enviar: string;
    /** `data-wait` del submit. check:i18n lo inspecciona: es un atributo VISIBLE
     *  y dejarlo en ingles en /es/ es fallo, no aviso. */
    espere: string;
    legalAntes: string;
    legalTerminos: string;
    legalY: string;
    legalPrivacidad: string;
  };
  condados: { titulo: string; intro: string; textos: string[]; leerMas: string };
  resenas: { deco: string; titulo: string; intro: string; boton: string };
  cta: { titulo: string; texto: string; presupuesto: string; visita: string };
}

/** Los seis perfiles de «You are a:». El `value` es el MISMO en los dos idiomas. */
export const PERFILES = [
  { id: 'homeowner-2', value: 'homeowner' },
  { id: 'contractor', value: 'contractor' },
  { id: 'business-owner', value: 'business owner' },
  { id: 'property-manager', value: 'property manager' },
  { id: 'architect', value: 'architect' },
  { id: 'other', value: 'other' },
] as const;

/** Los tres condados. Imagen, enlace y `alt` no dependen del idioma. */
export const CONDADOS = [
  {
    clave: 'miami',
    nombre: 'Miami-Dade County',
    enlace: '/countries/miami-dade-pergola-contractor',
    img: '/cms-img/locations/miami-dade-pergola-contractor/cover-miami-dade-hurricane-rated-pergola-outdoor-living-contractor.avif',
    alt: 'Miami-Dade outdoor living contractor specializing in hurricane-rated pergolas, motorized louvered roofs, custom patios and luxury backyard design-build services.',
  },
  {
    clave: 'broward',
    nombre: 'Broward County',
    enlace: '/countries/broward-county-pergola-contractor',
    img: '/cms-img/locations/broward-county-pergola-contractor/cover-broward-county-pergola-outdoor-living-design-build-contractor.avif',
    alt: 'Broward County pergola and outdoor living contractor specializing in custom aluminum structures, luxury patios, pavers and complete backyard remodel design-build.',
  },
  {
    clave: 'palm',
    nombre: 'Palm Beach County',
    enlace: '/countries/palm-beach-county-pergola-contractor',
    img: '/cms-img/locations/palm-beach-county-pergola-contractor/cover-palm-beach-county-luxury-pergola-outdoor-living-contractor.avif',
    alt: 'Palm Beach County luxury outdoor living contractor offering hurricane-rated pergolas, motorized louvered roofs, premium pavers and high-end residential backyard transformations.',
  },
] as const;

/** El unico telefono del sitio: el mismo que el nav, el footer y el mensaje de
 *  error de Formulario.astro. El markup migrado traia +19549137112 —un numero que
 *  no aparece en ningun otro sitio— y ademas lo colgaba tambien del correo, de la
 *  direccion y del horario. */
export const TEL = { href: 'tel:+15617108363', visible: '(561) 710-8363' };
export const CORREO = 'info@pergolaplusflorida.com';
export const DIRECCION = '980 N Federal Hwy, Boca Raton, FL 33432';
export const MAPA =
  'https://www.google.com/maps/search/?api=1&query=980+N+Federal+Hwy%2C+Boca+Raton%2C+FL+33432';

export const CONTACTO_EN: CopiaContacto = {
  eyebrow: 'Contact us',
  titulo: 'Get in touch',
  intro:
    'From residential backyards to commercial spaces, our team is here to help you explore what’s possible in South Florida.',
  datos: {
    email: {
      rotulo: 'Email',
      apoyo: 'Send us a message anytime',
      valor: CORREO,
      href: `mailto:${CORREO}`,
    },
    telefono: {
      rotulo: 'Phone',
      apoyo: 'Call us during business hours',
      valor: TEL.visible,
      href: TEL.href,
    },
    oficina: {
      rotulo: 'Office',
      apoyo: 'Visit us in Boca Raton, Florida for consultations',
      valor: DIRECCION,
      href: MAPA,
      nota: 'By Appointment Only',
    },
    horario: {
      rotulo: 'Hours Of Service',
      apoyo: 'Contact us during business hours',
      valor: 'Monday - Friday (8:00 AM - 5:00 PM)',
    },
  },
  sellos: [
    'Licensed & Insured In Florida',
    'Over 10 Years of Experience',
    'Custom Designs Tailored to Your Space',
  ],
  form: {
    titulo: 'Send us a message',
    apoyo: 'Tell us about your project and our team will get back to you.',
    nombre: 'First name',
    apellidos: 'Last name',
    email: 'Email',
    telefono: 'Phone number',
    tipoProyecto: 'Select your project type:',
    tipoVacio: 'Select one...',
    residencial: 'Residential',
    comercial: 'Commercial',
    ustedEs: 'You are a:',
    perfiles: [
      'Homeowner',
      'Contractor',
      'Business owner',
      'Property manager',
      'Architect',
      'Other',
    ],
    mensaje: 'Message:',
    mensajeApoyo: 'Tell us more about what you need',
    sms: 'I consent to receive SMS communications from Pergola Plus Florida regarding project updates, design consultations, scheduling, and promotional information. I understand I may opt out at any time by replying STOP. Message and data rates may apply.',
    smsRotulo: 'SMS consent',
    enviar: 'Submit Inquiry',
    espere: 'Please wait...',
    legalAntes: 'By submitting this form, you agree to our',
    legalTerminos: 'Terms',
    legalY: '&',
    legalPrivacidad: 'Privacy Policy',
  },
  condados: {
    titulo: 'Proudly Serving South Florida',
    intro:
      'We provide professional pergola construction across Miami-Dade, Broward, and Palm Beach. Our team builds custom pergolas designed for Florida’s heat, humidity, and coastal conditions—delivering durable, beautiful outdoor spaces for homes and businesses throughout the region.',
    textos: [
      'We build custom pergolas, patio covers, and outdoor structures across Miami-Dade, delivering weather-resistant designs engineered for Florida sun, humidity, and coastal conditions. Our team provides licensed, insured installations throughout the region.',
      'From Fort Lauderdale to Weston, we install premium aluminum pergolas, motorized louvered roofs, patio covers, and complete outdoor living systems throughout Broward County. Every project is built for durability, style, and long-term performance.',
      'We design and build pergolas, patio roofs, and outdoor shading systems throughout Palm Beach County, using high-grade materials that hold strong in Florida’s coastal environment.',
    ],
    leerMas: 'Read More →',
  },
  resenas: {
    deco: 'Reviews & testimonials',
    titulo: 'What Clients Say About Our Work',
    intro:
      'Discover how our pergola contractors transform outdoor spaces with expert installation of pergolas, patio covers, pool screen enclosures, and louvered roof systems across South Florida.',
    boton: 'Read Client Reviews',
  },
  cta: {
    titulo: 'Request your free Estimate',
    texto:
      "Meet with our exterior designers for a free consultation. We'll assess your space and goals to plan the installation of pergolas, patio covers, or pool enclosures.",
    presupuesto: 'Get A Quote',
    visita: 'Schedule A Visit',
  },
};

export const CONTACTO_ES: CopiaContacto = {
  eyebrow: 'Contacto',
  titulo: 'Hablemos',
  intro:
    'Desde jardines de vivienda hasta espacios comerciales, nuestro equipo está para ayudarle a ver qué es posible en el sur de Florida.',
  datos: {
    email: {
      rotulo: 'Correo electrónico',
      apoyo: 'Escríbanos cuando quiera',
      valor: CORREO,
      href: `mailto:${CORREO}`,
    },
    telefono: {
      rotulo: 'Teléfono',
      apoyo: 'Llámenos en horario comercial',
      valor: TEL.visible,
      href: TEL.href,
    },
    oficina: {
      rotulo: 'Oficina',
      apoyo: 'Visítenos en Boca Ratón, Florida, para una consulta',
      valor: DIRECCION,
      href: MAPA,
      nota: 'Solo con cita previa',
    },
    horario: {
      rotulo: 'Horario de atención',
      apoyo: 'Contáctenos en horario comercial',
      valor: 'Lunes a viernes (8:00 – 17:00)',
    },
  },
  sellos: [
    'Con licencia y seguro en Florida',
    'Más de 10 años de experiencia',
    'Diseños a medida para su espacio',
  ],
  form: {
    titulo: 'Escríbanos',
    apoyo: 'Cuéntenos su proyecto y nuestro equipo le responderá.',
    nombre: 'Nombre',
    apellidos: 'Apellidos',
    email: 'Correo electrónico',
    telefono: 'Teléfono',
    tipoProyecto: 'Tipo de proyecto:',
    tipoVacio: 'Elija una opción...',
    residencial: 'Residencial',
    comercial: 'Comercial',
    ustedEs: 'Usted es:',
    perfiles: [
      'Propietario de vivienda',
      'Contratista',
      'Dueño de un negocio',
      'Administrador de fincas',
      'Arquitecto',
      'Otro',
    ],
    mensaje: 'Mensaje:',
    mensajeApoyo: 'Cuéntenos qué necesita',
    sms: 'Doy mi consentimiento para recibir comunicaciones por SMS de Pergola Plus Florida sobre novedades del proyecto, consultas de diseño, citas e información promocional. Entiendo que puedo darme de baja en cualquier momento respondiendo STOP. Pueden aplicarse tarifas de mensajes y datos.',
    smsRotulo: 'Consentimiento SMS',
    enviar: 'Enviar consulta',
    espere: 'Espere...',
    legalAntes: 'Al enviar este formulario, acepta nuestros',
    legalTerminos: 'Términos',
    legalY: 'y',
    legalPrivacidad: 'Política de Privacidad',
  },
  condados: {
    titulo: 'Damos servicio a todo el sur de Florida',
    intro:
      'Construimos pérgolas de forma profesional en Miami-Dade, Broward y Palm Beach. Nuestro equipo diseña pérgolas a medida preparadas para el calor, la humedad y las condiciones costeras de Florida, y entrega espacios exteriores duraderos y bonitos para viviendas y negocios de toda la región.',
    textos: [
      'Construimos pérgolas, cubiertas de patio y estructuras exteriores a medida por todo Miami-Dade, con diseños resistentes calculados para el sol, la humedad y el ambiente costero de Florida. Instalamos con licencia y seguro en toda la región.',
      'De Fort Lauderdale a Weston, instalamos pérgolas de aluminio premium, techos de lamas motorizados, cubiertas de patio y sistemas completos de vida exterior por todo el condado de Broward. Cada proyecto se construye para durar, con buen diseño y rendimiento a largo plazo.',
      'Diseñamos y construimos pérgolas, techos de patio y sistemas de sombra por todo el condado de Palm Beach, con materiales de alta calidad que aguantan el ambiente costero de Florida.',
    ],
    leerMas: 'Leer más →',
  },
  resenas: {
    deco: 'Reseñas y testimonios',
    titulo: 'Lo que dicen nuestros clientes sobre nuestro trabajo',
    intro:
      'Descubra cómo nuestros contratistas transforman espacios exteriores instalando pérgolas, cubiertas de patio, cerramientos de piscina y techos de lamas por todo el sur de Florida.',
    boton: 'Leer reseñas de clientes',
  },
  cta: {
    titulo: 'Solicite su presupuesto gratis',
    texto:
      'Reúnase con nuestros diseñadores de exteriores en una consulta gratuita. Evaluamos su espacio y sus objetivos para planificar la instalación de pérgolas, cubiertas de patio o cerramientos de piscina.',
    presupuesto: 'Pedir presupuesto',
    visita: 'Agendar una visita',
  },
};
