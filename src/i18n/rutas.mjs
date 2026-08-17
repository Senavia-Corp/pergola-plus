/**
 * Rutas con traduccion PUBLICADA. Clave = ruta inglesa, valor = ruta espanola.
 *
 * Vive en .mjs y no en .ts porque lo necesitan LOS DOS lados: el sitio (a traves de
 * src/i18n/index.ts) y la integracion de astro.config.mjs que reescribe los enlaces
 * internos del HTML construido. Duplicar el mapa seria garantizar que un dia digan
 * cosas distintas.
 *
 * Es la unica fuente de verdad del hreflang, de los alternates del sitemap y de a
 * donde apuntan los enlaces dentro de /es/. Anadir una pagina traducida es anadir una
 * linea aqui.
 *
 * POR QUE ES UN MAPA EXPLICITO Y NO UNA REGLA. Antes esto era
 * `if (destino === 'es') return '/es/'`, asi que las 107 rutas declaraban
 * `hreflang="es"` hacia /es/. 106 paginas prometian una traduccion que no existe, y
 * las 106 apuntaban a la misma.
 *
 * Los valores llevan barra final porque es la forma CANONICA que sirve Astro, y
 * Google solo hace caso a un hreflang si coincide con la canonica de la pagina.
 */
export const TRADUCIDAS = {
  '/': '/es/',
  // Ruta de conversion: lo que recorre un visitante desde que llega hasta que deja
  // sus datos. Se tradujo primero por eso — traducir una pagina de blog antes que el
  // formulario de presupuesto seria traducir la parte que no convierte.
  '/products': '/es/products/',
  '/services': '/es/services/',
  '/contact-us/get-a-quote': '/es/contact-us/get-a-quote/',
  '/contact-us/get-in-touch': '/es/contact-us/get-in-touch/',
  '/contact-us/schedule-a-visit': '/es/contact-us/schedule-a-visit/',
  // Paginas de detalle de servicio. Solo las que tienen diccionario en
  // src/i18n/servicios.es.ts: el resto no existe en /es/.
  '/services/pavers': '/es/services/pavers/',
  '/services/pergola-design-construction': '/es/services/pergola-design-construction/',
  '/services/driveways': '/es/services/driveways/',
  '/services/concrete': '/es/services/concrete/',
  '/services/deck-builders': '/es/services/deck-builders/',
  '/services/fence-solutions': '/es/services/fence-solutions/',
  '/services/patio-remodeling': '/es/services/patio-remodeling/',
  // El 404 NO esta aqui aunque exista /es/404: una pagina de error no se indexa, asi
  // que anotarle un hreflang no le dice nada a nadie. La pagina se construye igual
  // porque getStaticPaths lee PAGINAS_ES, no este mapa.
};

/** Inverso, construido una vez. */
export const DESDE_ES = Object.fromEntries(
  Object.entries(TRADUCIDAS).map(([en, es]) => [normalizar(es), en]),
);

export function normalizar(pathname) {
  return pathname.replace(/\/+$/, '') || '/';
}

/**
 * Devuelve la ruta con barra final, que es la forma canonica que sirve Astro.
 *
 * Sin esto, /es/services declaraba `hreflang="en" -> /services` mientras la canonica
 * de esa pagina decia `/services/`, y Google descarta la anotacion entera.
 */
export function conBarra(pathname) {
  if (pathname === '/') return '/';
  // El 404 se sirve como fichero (404.html), no como directorio.
  if (pathname.endsWith('/404')) return pathname;
  return pathname.endsWith('/') ? pathname : `${pathname}/`;
}

/** Ruta equivalente en espanol, o null si esa traduccion no existe. */
export function haciaEspanol(pathname) {
  const r = normalizar(pathname);
  if (r === '/es' || r.startsWith('/es/')) return conBarra(pathname);
  const es = TRADUCIDAS[r] ?? TRADUCIDAS[`${r}/`];
  return es ? conBarra(es) : null;
}
