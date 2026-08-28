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
 * El primer escalon de las migas, por idioma.
 *
 * Iba fijo en `['Home', '/']`, asi que las paginas de /es/ publicaban un primer
 * tramo EN INGLES y hacia la home INGLESA, teniendo /es/ traducida y en el mapa de
 * rutas. No lo caza ninguna puerta: el grafo es valido, solo que miente.
 */
const RAIZ_MIGA: Record<'en' | 'es', [string, string]> = {
  en: ['Home', '/'],
  es: ['Inicio', '/es/'],
};

/**
 * Migas. Se construyen desde la RUTA, asi que no pueden contradecir la navegacion.
 * `tramos` son los pares [nombre, ruta] desde la raiz, sin incluir la home.
 */
export function breadcrumbs(site: string, tramos: [string, string][], idioma: 'en' | 'es' = 'en') {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: [RAIZ_MIGA[idioma], ...tramos].map(([nombre, ruta], i) => ({
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
  nombre: string;
  descripcion: string;
  ruta: string;
  imagen?: string | null;
  /**
   * Material de la estructura. TIENE que ser una cadena que la pagina PINTE, palabra
   * por palabra: un campo que el visitante no ve es la misma infraccion que un
   * `FAQPage` desincronizado, solo que sin puerta que lo cace.
   */
  material?: string | null;
  /**
   * Pares etiqueta/valor de la seccion de especificaciones. Misma regla que
   * `material`: solo entra lo que se pinta, y con la redaccion exacta con que se
   * pinta. Sale de src/data/especificaciones.ts, que es una fuente y dos salidas.
   *
   * Lo que NO entra, y por que: el precio («mid five figures upward» es una banda
   * cualitativa, no un `price` — seria `offers` por la puerta de atras), el plazo
   * (ya lo declara el `FAQPage` por la respuesta 5 de la propia ficha) y los condados
   * y la licencia (son hechos del NEGOCIO, no del producto).
   */
  propiedades?: { nombre: string; valor: string }[] | null;
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
    ...(opciones.material ? { material: opciones.material } : {}),
    ...(opciones.propiedades?.length
      ? {
        additionalProperty: opciones.propiedades.map((p) => ({
          '@type': 'PropertyValue', name: p.nombre, value: p.valor,
        })),
      }
      : {}),
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
 * FAQPage con los pares P/R que la pagina PINTA. Lo usan la biblioteca de preguntas
 * (/resources/faq) y las fichas de producto que llevan bloque de preguntas.
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

/**
 * Una pagina que es un indice de algo (la biblioteca de FAQs, un listado).
 * Se acompana del nodo que describe el contenido — FAQPage, ItemList — dentro
 * del mismo @graph.
 */
export function collectionPage(opciones: {
  url: string;
  nombre: string;
  descripcion: string;
  idioma: string;
}) {
  return {
    '@type': 'CollectionPage',
    '@id': `${opciones.url}#coleccion`,
    url: opciones.url,
    name: opciones.nombre,
    description: opciones.descripcion,
    inLanguage: opciones.idioma,
  };
}

/** Envoltorio: varios nodos en un solo bloque, como recomienda schema.org. */
export const grafo = (...nodos: unknown[]) => ({
  '@context': 'https://schema.org',
  '@graph': nodos.filter(Boolean),
});
