/**
 * JSON-LD del sitio.
 *
 * Antes solo lo llevaban 27 de las 107 paginas —los 21 posts, las 5 categorias de
 * blog y el indice—, que son justo las que se rediseñaron a mano. Las 80 restantes,
 * incluidas la home y las 29 de ubicacion, no declaraban nada: para Google eran
 * paginas sin negocio detras, sin telefono, sin direccion y sin area de servicio.
 *
 * REGLA QUE MANDA AQUI: no se inventa ni un dato. Cada campo sale de algo que ya
 * esta publicado en el sitio y se puede comprobar. Lo que no tenemos, no se pone —
 * un `priceRange` inventado o un `aggregateRating` sin reseñas reales es motivo de
 * penalizacion, no de mejora.
 *
 * Lo que NO hay, y por que:
 *   geo / latitud    no lo tenemos medido y aproximarlo es peor que omitirlo.
 *   aggregateRating  SIGUE SIN PONERSE, y ahora por un motivo mas fuerte que
 *                    cuando se escribio esto. Antes era que no habia reseñas: el
 *                    widget de Google Reviews estaba muerto (WIDGET_DISABLED).
 *                    Desde el carrusel de reseñas SI las hay —ver
 *                    src/components/ReseñasGoogle.astro— y aun asi no se declara:
 *                    el markup de reseñas sobre UNO MISMO es INELEGIBLE para las
 *                    estrellas del SERP segun la politica de Google y expone a
 *                    accion manual. Las estrellas ya salen solas desde la ficha de
 *                    Business Profile. Tener las reseñas en el sitio NO es permiso
 *                    para marcarlas: es justo cuando da la tentacion.
 *   priceRange       el rango real depende del proyecto y no esta publicado.
 *   offers           las paginas de producto no publican precio.
 */

/** Datos del negocio, todos tomados de /contact-us/get-in-touch y del pie. */
export const NEGOCIO = {
  nombre: 'Pergola Plus Florida',
  telefono: '+1-561-710-8363',
  email: 'info@pergolaplusflorida.com',
  calle: '980 N Federal Hwy',
  ciudad: 'Boca Raton',
  region: 'FL',
  postal: '33432',
  pais: 'US',
  /** Lunes a viernes, 8:00–17:00. Publicado en la pagina de contacto. */
  horario: { dias: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], abre: '08:00', cierra: '17:00' },
  redes: [
    'https://www.facebook.com/p/Pergola-Plus-Corp-100089973993816/',
    'https://www.instagram.com/pergolaplusflorida/',
    'https://www.youtube.com/@pergolapluscorp',
    'https://www.tiktok.com/@pergolaplus',
  ],
  /** Los tres condados que el sitio dice servir, en todas sus paginas. */
  condados: ['Miami-Dade County', 'Broward County', 'Palm Beach County'],
} as const;

const absoluta = (site: string, ruta: string) => new URL(ruta, site).href;

/** El negocio, con `@id` estable para poder referenciarlo desde otros nodos. */
export function localBusiness(site: string) {
  return {
    '@type': 'HomeAndConstructionBusiness',
    '@id': absoluta(site, '/#negocio'),
    name: NEGOCIO.nombre,
    url: absoluta(site, '/'),
    telephone: NEGOCIO.telefono,
    email: NEGOCIO.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: NEGOCIO.calle,
      addressLocality: NEGOCIO.ciudad,
      addressRegion: NEGOCIO.region,
      postalCode: NEGOCIO.postal,
      addressCountry: NEGOCIO.pais,
    },
    openingHoursSpecification: [{
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [...NEGOCIO.horario.dias],
      opens: NEGOCIO.horario.abre,
      closes: NEGOCIO.horario.cierra,
    }],
    areaServed: NEGOCIO.condados.map((n) => ({ '@type': 'AdministrativeArea', name: n })),
    sameAs: [...NEGOCIO.redes],
  };
}

/** Referencia corta al negocio. Evita repetir el bloque entero en cada pagina. */
export const refNegocio = (site: string) => ({ '@id': absoluta(site, '/#negocio') });

/**
 * Migas. Se construyen desde la RUTA, asi que no pueden contradecir la navegacion.
 * `tramos` son los pares [nombre, ruta] desde la raiz, sin incluir la home.
 */
export function breadcrumbs(site: string, tramos: [string, string][]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: [['Home', '/'] as [string, string], ...tramos].map(([nombre, ruta], i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: nombre,
      item: absoluta(site, ruta),
    })),
  };
}

export function servicio(site: string, opciones: { nombre: string; descripcion: string; ruta: string }) {
  return {
    '@type': 'Service',
    name: opciones.nombre,
    description: opciones.descripcion,
    url: absoluta(site, opciones.ruta),
    provider: refNegocio(site),
    areaServed: NEGOCIO.condados.map((n) => ({ '@type': 'AdministrativeArea', name: n })),
  };
}

export function producto(site: string, opciones: {
  nombre: string; descripcion: string; ruta: string; imagen?: string | null;
}) {
  return {
    '@type': 'Product',
    name: opciones.nombre,
    description: opciones.descripcion,
    url: absoluta(site, opciones.ruta),
    // La marca es el propio negocio: estos sistemas los diseña e instala el
    // cliente. No se declara `offers` porque no hay precio publicado, y un precio
    // inventado en JSON-LD es motivo de penalizacion.
    brand: { '@type': 'Brand', name: NEGOCIO.nombre },
    ...(opciones.imagen ? { image: absoluta(site, opciones.imagen) } : {}),
  };
}

/** Una pagina de ubicacion: el mismo negocio, con el area concreta que cubre. */
export function areaDeServicio(site: string, opciones: {
  nombre: string; descripcion: string; ruta: string; area: string;
}) {
  return {
    '@type': 'Service',
    name: opciones.nombre,
    description: opciones.descripcion,
    url: absoluta(site, opciones.ruta),
    serviceType: 'Pergola design and installation',
    provider: refNegocio(site),
    areaServed: { '@type': 'Place', name: opciones.area },
  };
}

/**
 * FAQPage con las 10 preguntas reales de /resources/faq.
 *
 * Google exige que las preguntas y respuestas del markup sean EXACTAMENTE las que
 * se ven en la pagina. Por eso se extraen del propio HTML en tiempo de build en vez
 * de mantener una copia: una copia se desincroniza y entonces el markup pasa a ser
 * spam a ojos de Google.
 */
export function faqPage(pares: { pregunta: string; respuesta: string }[]) {
  return {
    '@type': 'FAQPage',
    mainEntity: pares.map((p) => ({
      '@type': 'Question',
      name: p.pregunta,
      acceptedAnswer: { '@type': 'Answer', text: p.respuesta },
    })),
  };
}

/** Envoltorio: varios nodos en un solo bloque, como recomienda schema.org. */
export const grafo = (...nodos: unknown[]) => ({
  '@context': 'https://schema.org',
  '@graph': nodos.filter(Boolean),
});
