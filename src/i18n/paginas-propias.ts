/**
 * Texto de las paginas de AUTORIA PROPIA (las que no salen de un fragmento migrado):
 * contacto, listado del blog, biblioteca de FAQ, estimador y gracias, en los dos
 * idiomas.
 *
 * Vive aqui, y no en cada .astro, para que la migracion a Sanity lo lea de un sitio y
 * la parada 3 lo sustituya por la lectura del documento `page-<ruta>` sin tocar el
 * diseño. El cuerpo de contacto esta en `contacto.ts` y los textos del estimador en
 * `estimador.ts`; aqui solo su <head>.
 *
 * El marcado de /thank-you sigue en su .astro: lo que hay aqui es su texto, trozo a
 * trozo, en el orden en que se pinta.
 */
export interface SeoPagina {
  title: string;
  description: string;
}

export interface CopiaListado extends SeoPagina {
  /** El nombre de la coleccion en el JSON-LD. */
  nombre: string;
  titulo: string;
  intro: string;
}

export interface CopiaGracias extends SeoPagina {
  h1: string;
  intro: string;
  subtitulo: string;
  pasos: { fuerte: string; texto: string }[];
  /** «… Call [telefono] during business hours … or write to [correo].» */
  prisa: { antes: string; entre: string; despues: string };
  botones: { obras: string; inicio: string };
}

export const PROPIAS_EN = {
  contacto: {
    title: 'Contact Pergola Plus Florida | Boca Raton, FL',
    description: 'Call, email or write to our Boca Raton team about pergolas, patio covers and screen enclosures anywhere in South Florida.',
  } as SeoPagina,
  blog: {
    title: 'Outdoor Living Blog | Pergola Plus Florida',
    description: 'Expert insights on aluminum pergolas, motorized louvered roofs and outdoor shade systems engineered for South Florida homes.',
    nombre: 'Pergola Plus Florida Blog',
    titulo: 'blog & tips',
    intro: 'Explore expert insights on aluminum pergolas, motorized louvered roofs, and outdoor shade systems engineered for Florida’s climate, durability, and elevated outdoor living design.',
  } as CopiaListado,
  faq: {
    title: 'Pergola FAQ Library | Permits, Costs & Materials',
    description: 'Every question we get asked about pergolas, screens, pavers and outdoor construction in South Florida — permits, wind load, pricing, materials and timelines.',
    nombre: 'Pergola Plus FAQ Library',
    titulo: 'Pergola FAQs',
    intro: 'Search every question we get asked about pergolas, motorized louvered roofs, screens, pavers and outdoor construction in South Florida — permits, wind load, pricing, materials and how long the work takes.',
  } as CopiaListado,
  estimador: {
    title: 'Pergola Cost Estimator | Pergola Plus Florida',
    description: 'Estimate your custom pergola or patio cover investment in South Florida using our published 2026 installed price ranges. No contact details required.',
  } as SeoPagina,
  gracias: {
    title: 'Thank You — We Received Your Request | Pergola Plus Florida',
    description: 'Your request reached our team. Here is what happens next, how soon we reply, and how to reach us if your project is time-sensitive.',
    h1: 'Thank you — we have your request.',
    intro: 'A member of our design team is reviewing what you sent.',
    subtitulo: 'What happens next',
    pasos: [
      { fuerte: 'Within one business day', texto: 'we reply by email to confirm we received your request and to ask anything we still need.' },
      { fuerte: 'We check your location', texto: 'against the counties we build in — Miami-Dade, Broward and Palm Beach — and against local permitting and wind-load requirements.' },
      { fuerte: 'We propose a site visit', texto: 'so we can measure, look at the structure we would attach to, and talk through options in person.' },
      { fuerte: 'You get a written proposal', texto: 'with the system, the scope and the price. No obligation.' },
    ],
    prisa: {
      antes: 'In a hurry, or would you rather talk it through now? Call',
      entre: 'during business hours (Mon–Fri, 8:00 AM – 5:00 PM) or write to',
      despues: '.',
    },
    botones: { obras: 'See our recent work', inicio: 'Back to the main page' },
  } as CopiaGracias,
};

export const PROPIAS_ES: typeof PROPIAS_EN = {
  contacto: {
    title: 'Contacte con Pergola Plus Florida | Boca Ratón',
    description: 'Llame, escriba o visítenos en Boca Ratón para hablar de pérgolas, cubiertas de patio y cerramientos en cualquier punto del sur de Florida.',
  },
  blog: {
    title: 'Blog de vida al aire libre | Pergola Plus Florida',
    description: 'Lo que hay que saber sobre pérgolas de aluminio, techos de lamas motorizados y sistemas de sombra calculados para las casas del sur de Florida.',
    nombre: 'Blog de Pergola Plus Florida',
    titulo: 'blog y consejos',
    intro: 'Todo lo que conviene saber sobre pérgolas de aluminio, techos de lamas motorizados y sistemas de sombra pensados para el clima de Florida, para que duren y para vivir mejor el exterior.',
  },
  faq: {
    title: 'Biblioteca de preguntas frecuentes | Pergola Plus',
    description: 'Todas las preguntas que nos hacen sobre pérgolas, cortinas, adoquinado y obra exterior en el sur de Florida: permisos, cargas de viento, precios y plazos.',
    nombre: 'Biblioteca de preguntas de Pergola Plus',
    titulo: 'Preguntas frecuentes',
    intro: 'Busque entre todas las preguntas que nos hacen sobre pérgolas, techos de lamas motorizados, cortinas, adoquinado y obra exterior en el sur de Florida: permisos, cargas de viento, precios, materiales y cuánto se tarda.',
  },
  estimador: {
    title: 'Calculador de presupuesto de pérgola | Pergola Plus Florida',
    description: 'Calcule lo que cuesta su pérgola o cubierta de patio en el sur de Florida con nuestras tarifas instaladas de 2026. No hace falta dejar sus datos.',
  },
  gracias: {
    title: 'Gracias — hemos recibido su solicitud | Pergola Plus Florida',
    description: 'Su solicitud ha llegado a nuestro equipo. Esto es lo que pasa a continuación, en cuánto le respondemos y cómo localizarnos si corre prisa.',
    h1: 'Gracias — ya tenemos su solicitud.',
    intro: 'Alguien de nuestro equipo de diseño está revisando lo que nos ha enviado.',
    subtitulo: 'Qué pasa a continuación',
    pasos: [
      { fuerte: 'En un día laborable', texto: 'le respondemos por correo para confirmarle que hemos recibido su solicitud y para preguntarle lo que nos falte.' },
      { fuerte: 'Comprobamos su ubicación', texto: 'con los condados en los que trabajamos —Miami-Dade, Broward y Palm Beach— y con los permisos y las cargas de viento que exija su municipio.' },
      { fuerte: 'Le proponemos una visita', texto: 'para medir, ver la estructura a la que iría anclada y hablar de opciones en persona.' },
      { fuerte: 'Recibe una propuesta por escrito', texto: 'con el sistema, el alcance y el precio. Sin compromiso.' },
    ],
    prisa: {
      antes: '¿Le corre prisa o prefiere hablarlo ahora? Llame al',
      entre: 'en horario de oficina (lunes a viernes, de 8:00 a 17:00) o escriba a',
      despues: '.',
    },
    botones: { obras: 'Vea nuestro trabajo', inicio: 'Volver a la página principal' },
  },
};
