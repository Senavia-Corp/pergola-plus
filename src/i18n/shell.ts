/**
 * Rótulos del shell (nav + footer) en los dos idiomas.
 *
 * Se separa del diccionario de la home porque el shell sale de componentes
 * Astro, no del HTML migrado: aquí se traduce por clave, no por sustitución de
 * texto.
 */
import type { Idioma } from './index';

type Claves =
  | 'callUs' | 'ourProducts' | 'ourServices' | 'projectGallery' | 'aboutUs'
  | 'resources' | 'contactUs' | 'getAQuote' | 'scheduleAVisit'
  | 'grupoPergolas' | 'grupoCerramientos' | 'grupoHardscape' | 'grupoExteriores'
  | 'verTodosProductos' | 'verTodosServicios'
  | 'motorizedLouvered' | 'solidRoof' | 'polycarbonate' | 'openAir' | 'cabanas'
  | 'screenEnclosures' | 'motorizedScreens' | 'carports' | 'solar' | 'sukkha'
  | 'customPergolas' | 'pavers' | 'driveways' | 'concrete' | 'deck' | 'fence'
  | 'fullRemodel'
  | 'ctaTitulo' | 'ctaTexto' | 'ctaAlt'
  | 'aboutUsTitulo' | 'aboutUsTexto' | 'whereWeWorkTitulo' | 'whereWeWorkTexto'
  | 'brandsTitulo' | 'brandsTexto' | 'industriesTitulo' | 'industriesTexto'
  | 'blogTitulo' | 'blogTexto' | 'faqTitulo' | 'faqTexto'
  | 'warrantyTitulo' | 'warrantyTexto' | 'testimonialsTitulo' | 'testimonialsTexto'
  | 'estimatorTitulo' | 'estimatorTexto' | 'quoteTitulo' | 'quoteTexto'
  | 'visitTitulo' | 'visitTexto' | 'touchTitulo' | 'touchTexto'
  | 'cambiarIdioma'
  | 'idiomaNoDisponible'
  | 'footerSuscribete' | 'footerEmail' | 'footerBoton' | 'footerLegal'
  | 'footerHelp' | 'footerCompany' | 'footerFollow'
  | 'footerProductos' | 'footerServicios' | 'footerGaleria' | 'footerEstimador'
  | 'footerContacto' | 'footerBlog' | 'footerFaq'
  | 'footerAbout' | 'footerBrands' | 'footerWhere' | 'footerIndustries'
  | 'footerTestimonials' | 'footerPrivacidad' | 'footerTerminos'
  | 'footerDerechos' | 'footerDesarrollado'
  | 'footerFormOk' | 'footerFormError' | 'footerEspera' | 'footerLicencia';

export const SHELL: Record<Idioma, Record<Claves, string>> = {
  en: {
    callUs: 'Call Us!',
    ourProducts: 'Our Products',
    ourServices: 'Our Services',
    projectGallery: 'Project Gallery',
    aboutUs: 'About Us',
    resources: 'Resources',
    contactUs: 'Contact Us',
    ctaTitulo: 'Request your free Estimate',
    ctaTexto:
      "Meet with our exterior designers for a free consultation. We'll assess your space "
      + 'and goals to plan the installation of pergolas, patio covers, or pool enclosures.',
    ctaAlt:
      'Luxury outdoor living in South Florida featuring a custom pool, modern pergola with '
      + 'outdoor kitchen, tropical landscaping, and elegant patio design for high-end '
      + 'residential properties.',
    getAQuote: 'Get a Quote',
    scheduleAVisit: 'Schedule A Visit',

    grupoPergolas: 'Pérgolas & Patio Coves',
    grupoCerramientos: 'Outdoor Enclosures & Systems',
    grupoHardscape: 'Hardscape & Construction',
    grupoExteriores: 'Outdoor Enhancements',
    verTodosProductos: 'View all products',
    verTodosServicios: 'View all services',

    motorizedLouvered: 'Motorized Louvered Pergolas',
    solidRoof: 'Solid Roof Pergolas',
    polycarbonate: 'Polycarbonate Pergolas',
    openAir: 'Open-Air Pergolas',
    cabanas: 'Cabanas',
    screenEnclosures: 'Screen Enclosures',
    motorizedScreens: 'Motorized Screens',
    carports: 'Carports',
    solar: 'Solar Pergolas',
    sukkha: 'Sukkha',

    customPergolas: 'Custom Pergolas & Patio Covers',
    pavers: 'Pavers',
    driveways: 'Driveways',
    concrete: 'Concrete',
    deck: 'Deck',
    fence: 'Fence',
    fullRemodel: 'Full Outdoor Remodel',

    aboutUsTitulo: 'About Us',
    aboutUsTexto: 'Learn why we are the leading pergola contractors in South Florida for families.',
    whereWeWorkTitulo: 'Where We Work',
    whereWeWorkTexto: 'The service areas covered by expert pergola contractors in South Florida today.',
    brandsTitulo: 'Our Brand Partners',
    brandsTexto: 'Premium brands trusting the best pergola contractors in South Florida for home.',
    industriesTitulo: 'Industries We Serve',
    industriesTexto: 'Key sectors served by professional pergola contractors in South Florida always.',

    blogTitulo: 'Outdoor Living Blog',
    blogTexto: 'Expert insights from leading pergola contractors in South Florida for your home.',
    faqTitulo: 'Help Center & FAQs',
    faqTexto: 'Detailed answers from the top pergola contractors in South Florida for projects.',
    warrantyTitulo: 'Warranty & Protection',
    warrantyTexto: 'Solid protection from trusted pergola contractors in South Florida you can rely.',
    testimonialsTitulo: 'Client Success Stories',
    testimonialsTexto: 'See why we are the top-rated pergola contractors in South Florida for luxury.',

    estimatorTitulo: 'Project Estimator',
    estimatorTexto: 'Price your pergola or patio cover in minutes. No contact details needed.',
    quoteTitulo: 'Request a Free Quote',
    quoteTexto: 'Get a free estimate from professional pergola contractors in South Florida now.',
    visitTitulo: 'Schedule an Expert Visit',
    visitTexto: 'Book a consultation with expert pergola contractors in South Florida for homes.',
    touchTitulo: 'Contact Our Team',
    touchTexto: 'Contact the leading pergola contractors in South Florida for custom designs.',

    cambiarIdioma: 'Change language. Current language:',
    idiomaNoDisponible: 'Not available',

    footerSuscribete: 'Get updates on new pergolas and outdoor solutions.',
    footerEmail: 'Enter your email address',
    footerBoton: 'Subscribe',
    footerLegal: 'By subscribing you agree to our Privacy Policy and consent to receive updates from Pergola Plus Florida.',
    footerHelp: 'Help Links',
    footerCompany: 'Company',
    footerFollow: 'Follow us',
    footerProductos: 'Our Products',
    footerServicios: 'Services',
    footerGaleria: 'Project Gallery',
    footerEstimador: 'Project Estimator',
    footerContacto: 'Contact Us',
    footerBlog: 'Blog & Tips',
    footerFaq: 'FAQ',
    footerAbout: 'About Us',
    footerBrands: 'Our Brands Partners',
    footerWhere: 'Where We Work',
    footerIndustries: 'Industries We Serve',
    footerTestimonials: 'Testimonials',
    footerPrivacidad: 'Privacy Policy',
    footerTerminos: 'Terms of Service',
    footerDerechos: '© 2025 Pergola Plus Florida. All rights reserved.',
    footerDesarrollado: 'Developed by',
    footerFormOk: 'Thank you! Your submission has been received!',
    footerFormError: 'Oops! Something went wrong while submitting the form.',
    footerEspera: 'Please wait...',
    footerLicencia: 'Pergola Plus Florida - Licensed & Insured CGC1539940 in South Florida',
  },

  es: {
    callUs: '¡Llámenos!',
    ourProducts: 'Productos',
    ourServices: 'Servicios',
    projectGallery: 'Galería de proyectos',
    aboutUs: 'Nosotros',
    resources: 'Recursos',
    contactUs: 'Contacto',
    ctaTitulo: 'Pida su presupuesto gratis',
    ctaTexto:
      'Reúnase con nuestros diseñadores de exteriores en una consulta gratuita. Estudiamos '
      + 'su espacio y sus objetivos para planificar la instalación de pérgolas, techos de '
      + 'patio o cerramientos de piscina.',
    ctaAlt:
      'Vida al aire libre de lujo en el sur de Florida: piscina a medida, pérgola moderna con '
      + 'cocina exterior, jardinería tropical y patio elegante para viviendas de alta gama.',
    getAQuote: 'Pedir presupuesto',
    scheduleAVisit: 'Agendar visita',

    grupoPergolas: 'Pérgolas y cubiertas de patio',
    grupoCerramientos: 'Cerramientos y sistemas exteriores',
    grupoHardscape: 'Obra y pavimentos',
    grupoExteriores: 'Mejoras del exterior',
    verTodosProductos: 'Ver todos los productos',
    verTodosServicios: 'Ver todos los servicios',

    motorizedLouvered: 'Pérgolas de lamas motorizadas',
    solidRoof: 'Pérgolas de techo sólido',
    polycarbonate: 'Pérgolas de policarbonato',
    openAir: 'Pérgolas abiertas',
    cabanas: 'Cabañas',
    screenEnclosures: 'Cerramientos con mosquitero',
    motorizedScreens: 'Cortinas motorizadas',
    carports: 'Cocheras',
    solar: 'Pérgolas solares',
    sukkha: 'Sukkha',

    customPergolas: 'Pérgolas y cubiertas a medida',
    pavers: 'Adoquines',
    driveways: 'Entradas de vehículos',
    concrete: 'Hormigón',
    deck: 'Terraza de madera',
    fence: 'Vallado',
    fullRemodel: 'Reforma integral del exterior',

    aboutUsTitulo: 'Sobre nosotros',
    aboutUsTexto: 'Por qué somos los contratistas de pérgolas de referencia en el sur de Florida.',
    whereWeWorkTitulo: 'Dónde trabajamos',
    whereWeWorkTexto: 'Las zonas donde damos servicio en todo el sur de Florida.',
    brandsTitulo: 'Marcas con las que trabajamos',
    brandsTexto: 'Marcas premium que confían en nosotros para sus proyectos.',
    industriesTitulo: 'Sectores a los que servimos',
    industriesTexto: 'Los sectores que atendemos en el sur de Florida.',

    blogTitulo: 'Blog de vida al aire libre',
    blogTexto: 'Ideas y consejos de expertos para su patio y su jardín.',
    faqTitulo: 'Centro de ayuda y preguntas frecuentes',
    faqTexto: 'Respuestas detalladas sobre proyectos de pérgolas y exteriores.',
    warrantyTitulo: 'Garantía y protección',
    warrantyTexto: 'La cobertura con la que respaldamos cada instalación.',
    testimonialsTitulo: 'Casos de éxito',
    testimonialsTexto: 'Lo que dicen nuestros clientes sobre el trabajo terminado.',

    estimatorTitulo: 'Estimador de proyecto',
    estimatorTexto: 'Calcule el precio de su pérgola en minutos. Sin dejar sus datos.',
    quoteTitulo: 'Solicitar presupuesto gratis',
    quoteTexto: 'Reciba una estimación sin coste de contratistas profesionales.',
    visitTitulo: 'Agendar visita de un experto',
    visitTexto: 'Reserve una consulta con nuestros especialistas en su propiedad.',
    touchTitulo: 'Hablar con el equipo',
    touchTexto: 'Contacte con nosotros para diseños a medida.',

    cambiarIdioma: 'Cambiar idioma. Idioma actual:',
    idiomaNoDisponible: 'No disponible',

    footerSuscribete: 'Reciba novedades sobre pérgolas y soluciones para exteriores.',
    footerEmail: 'Escriba su correo electrónico',
    footerBoton: 'Suscribirme',
    footerLegal: 'Al suscribirse acepta nuestra Política de Privacidad y consiente recibir novedades de Pergola Plus Florida.',
    footerHelp: 'Enlaces útiles',
    footerCompany: 'Empresa',
    footerFollow: 'Síganos',
    footerProductos: 'Productos',
    footerServicios: 'Servicios',
    footerGaleria: 'Galería de proyectos',
    footerEstimador: 'Estimador de proyecto',
    footerContacto: 'Contacto',
    footerBlog: 'Blog y consejos',
    footerFaq: 'Preguntas frecuentes',
    footerAbout: 'Sobre nosotros',
    footerBrands: 'Marcas con las que trabajamos',
    footerWhere: 'Dónde trabajamos',
    footerIndustries: 'Sectores a los que servimos',
    footerTestimonials: 'Testimonios',
    footerPrivacidad: 'Política de Privacidad',
    footerTerminos: 'Términos del Servicio',
    footerDerechos: '© 2025 Pergola Plus Florida. Todos los derechos reservados.',
    footerDesarrollado: 'Desarrollado por',
    footerFormOk: '¡Gracias! Hemos recibido su mensaje.',
    footerFormError: 'Vaya, algo ha fallado al enviar el formulario.',
    footerEspera: 'Un momento...',
    footerLicencia: 'Pergola Plus Florida - Con licencia y seguro CGC1539940 en el sur de Florida',
  },
};

/** Devuelve el traductor del idioma dado. */
export const traductor = (idioma: Idioma) => (clave: Claves) => SHELL[idioma][clave];
