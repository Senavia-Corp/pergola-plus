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
  // Donde aterriza todo lead. La escribe a mano src/pages/es/thank-you.astro, no
  // pasa por PAGINAS_ES: su gemela inglesa tampoco es contenido migrado.
  '/thank-you': '/es/thank-you/',
  '/project-gallery': '/es/project-gallery/',
  // El calculador. El cuerpo y los precios salen de src/components/Estimador.astro;
  // los rotulos, de src/i18n/estimador.ts.
  '/project-estimator': '/es/project-estimator/',
  '/about-us/about-us': '/es/about-us/about-us/',
  '/about-us/testimonials': '/es/about-us/testimonials/',
  '/about-us/industries-we-serve': '/es/about-us/industries-we-serve/',
  '/resources/faq': '/es/resources/faq/',
  '/resources/warranties': '/es/resources/warranties/',
  '/about-us/brands': '/es/about-us/brands/',
  '/about-us/where-we-work': '/es/about-us/where-we-work/',
  // Las 25 paginas de ubicacion. Diccionario en src/i18n/ubicaciones.es.ts.
  '/pergolas-contractors/aventura-pergola-builders': '/es/pergolas-contractors/aventura-pergola-builders/',
  '/pergolas-contractors/boca-raton-pergola-contractor': '/es/pergolas-contractors/boca-raton-pergola-contractor/',
  '/pergolas-contractors/boynton-beach-contractors': '/es/pergolas-contractors/boynton-beach-contractors/',
  '/pergolas-contractors/cooper-city-pergola-installation': '/es/pergolas-contractors/cooper-city-pergola-installation/',
  '/pergolas-contractors/coral-gables': '/es/pergolas-contractors/coral-gables/',
  '/pergolas-contractors/coral-springs-installation': '/es/pergolas-contractors/coral-springs-installation/',
  '/pergolas-contractors/davie-installation': '/es/pergolas-contractors/davie-installation/',
  '/pergolas-contractors/delray-beach-contractors': '/es/pergolas-contractors/delray-beach-contractors/',
  '/pergolas-contractors/doral-pergola-builders': '/es/pergolas-contractors/doral-pergola-builders/',
  '/pergolas-contractors/fort-lauderdale-installation': '/es/pergolas-contractors/fort-lauderdale-installation/',
  '/pergolas-contractors/hollywood-pergola-installation': '/es/pergolas-contractors/hollywood-pergola-installation/',
  '/pergolas-contractors/jupiter-contractors': '/es/pergolas-contractors/jupiter-contractors/',
  '/pergolas-contractors/key-biscayne-pergola-builders': '/es/pergolas-contractors/key-biscayne-pergola-builders/',
  '/pergolas-contractors/miami-beach-pergola-design': '/es/pergolas-contractors/miami-beach-pergola-design/',
  '/pergolas-contractors/miami-pergola-experts': '/es/pergolas-contractors/miami-pergola-experts/',
  '/pergolas-contractors/miramar-installation': '/es/pergolas-contractors/miramar-installation/',
  '/pergolas-contractors/palm-beach-contractors': '/es/pergolas-contractors/palm-beach-contractors/',
  '/pergolas-contractors/palm-beach-gardens': '/es/pergolas-contractors/palm-beach-gardens/',
  '/pergolas-contractors/parkland-installation': '/es/pergolas-contractors/parkland-installation/',
  '/pergolas-contractors/pembroke-pines-pergola-installation': '/es/pergolas-contractors/pembroke-pines-pergola-installation/',
  '/pergolas-contractors/royal-palm-beach-contractors': '/es/pergolas-contractors/royal-palm-beach-contractors/',
  '/pergolas-contractors/sunny-isles-beach-pergola-builders': '/es/pergolas-contractors/sunny-isles-beach-pergola-builders/',
  '/pergolas-contractors/wellington-contractors': '/es/pergolas-contractors/wellington-contractors/',
  '/pergolas-contractors/west-palm-beach-contractors': '/es/pergolas-contractors/west-palm-beach-contractors/',
  '/pergolas-contractors/weston-pergola-solutions': '/es/pergolas-contractors/weston-pergola-solutions/',
  // Fichas de marca. Solo las que tienen diccionario en src/i18n/marcas.es.ts.
  '/brands/appolo': '/es/brands/appolo/',
  '/brands/equinox': '/es/brands/equinox/',
  '/brands/fenetex': '/es/brands/fenetex/',
  '/brands/pergola-plus-forte': '/es/brands/pergola-plus-forte/',
  '/brands/renaissance': '/es/brands/renaissance/',
  // Paginas de detalle de servicio. Solo las que tienen diccionario en
  // src/i18n/servicios.es.ts: el resto no existe en /es/.
  '/services/pavers': '/es/services/pavers/',
  '/services/pergola-design-construction': '/es/services/pergola-design-construction/',
  '/services/driveways': '/es/services/driveways/',
  '/services/concrete': '/es/services/concrete/',
  '/services/deck-builders': '/es/services/deck-builders/',
  '/services/fence-solutions': '/es/services/fence-solutions/',
  '/services/patio-remodeling': '/es/services/patio-remodeling/',
  // Fichas de producto. Solo las que tienen diccionario en src/i18n/productos.es.ts.
  '/products/motorized-louvered-pergolas': '/es/products/motorized-louvered-pergolas/',
  '/products/solid-roof-pergolas': '/es/products/solid-roof-pergolas/',
  '/products/open-air-pergolas': '/es/products/open-air-pergolas/',
  '/products/cabanas': '/es/products/cabanas/',
  '/products/screen-enclosures': '/es/products/screen-enclosures/',
  '/products/motorized-screens': '/es/products/motorized-screens/',
  '/products/carports': '/es/products/carports/',
  '/products/polycarbonate-pergolas': '/es/products/polycarbonate-pergolas/',
  '/products/solar-pergolas': '/es/products/solar-pergolas/',
  '/products/sukkha': '/es/products/sukkha/',
  // Las 10 fichas de proyecto. Diccionario en src/i18n/proyectos.es.ts.
  '/project/attached-forte-pergola-in-west-palm-beach': '/es/project/attached-forte-pergola-in-west-palm-beach/',
  '/project/attached-forte-plus-pergola-on-the-intracoastal-in-boca-raton': '/es/project/attached-forte-plus-pergola-on-the-intracoastal-in-boca-raton/',
  '/project/eclipse-cabanas-forte-pergola-hospitality-project-in-riviera-beach': '/es/project/eclipse-cabanas-forte-pergola-hospitality-project-in-riviera-beach/',
  '/project/forte-pergola-with-partial-privacy-wall-in-palm-beach-gardens': '/es/project/forte-pergola-with-partial-privacy-wall-in-palm-beach-gardens/',
  '/project/forte-pergola-with-privacy-wall-motorized-screen-in-delray-beach': '/es/project/forte-pergola-with-privacy-wall-motorized-screen-in-delray-beach/',
  '/project/forte-pergola-with-privacy-wall-tv-mount-in-delray-beach': '/es/project/forte-pergola-with-privacy-wall-tv-mount-in-delray-beach/',
  '/project/forte-pergolas-in-greenacres-pool-patio': '/es/project/forte-pergolas-in-greenacres-pool-patio/',
  '/project/forte-plus-aluminum-carport-installation-in-pompano-beach': '/es/project/forte-plus-aluminum-carport-installation-in-pompano-beach/',
  '/project/forte-plus-pergola-with-outdoor-kitchen-in-delray-beach': '/es/project/forte-plus-pergola-with-outdoor-kitchen-in-delray-beach/',
  '/project/forte-plus-pergolas-in-hillsboro-beach-estate': '/es/project/forte-plus-pergolas-in-hillsboro-beach-estate/',
  // Los 3 condados. Diccionario en src/i18n/condados.es.ts.
  '/countries/broward-county-pergola-contractor': '/es/countries/broward-county-pergola-contractor/',
  '/countries/miami-dade-pergola-contractor': '/es/countries/miami-dade-pergola-contractor/',
  '/countries/palm-beach-county-pergola-contractor': '/es/countries/palm-beach-county-pergola-contractor/',
  // Solo el aviso de privacidad: el contrato de obra NO se traduce (ver
  // src/i18n/articulos.es.ts).
  '/articles/privacy-policy': '/es/articles/privacy-policy/',
  // El blog. El indice y las 5 categorias con articulos.
  '/resources/blog': '/es/resources/blog/',
  '/resources/blog/buying-guides-cost': '/es/resources/blog/buying-guides-cost/',
  '/resources/blog/materials-engineering': '/es/resources/blog/materials-engineering/',
  '/resources/blog/outdoor-living-design': '/es/resources/blog/outdoor-living-design/',
  '/resources/blog/pergolas-shade-systems': '/es/resources/blog/pergolas-shade-systems/',
  '/resources/blog/maintenance-care': '/es/resources/blog/maintenance-care/',
  // Los articulos traducidos. Un articulo solo entra aqui cuando tiene su
  // diccionario en src/i18n/posts/: sin el, /es/post/<slug> no se genera y este
  // hreflang apuntaria a un 404.
  '/post/pergola-cost-south-florida': '/es/post/pergola-cost-south-florida/',
  '/post/pergola-building-codes-broward-palm-beach': '/es/post/pergola-building-codes-broward-palm-beach/',
  '/post/design-build-pergola-process-south-florida': '/es/post/design-build-pergola-process-south-florida/',
  '/post/modern-outdoor-living-trends-in-south-florida': '/es/post/modern-outdoor-living-trends-in-south-florida/',
  '/post/pergola-permit-south-florida': '/es/post/pergola-permit-south-florida/',
  '/post/hoa-rules-pergolas-south-florida': '/es/post/hoa-rules-pergolas-south-florida/',
  '/post/luxury-pergola-ideas-for-south-florida-backyards': '/es/post/luxury-pergola-ideas-for-south-florida-backyards/',
  '/post/plan-pergola-south-florida-backyard': '/es/post/plan-pergola-south-florida-backyard/',
  '/post/building-custom-pergola-south-florida': '/es/post/building-custom-pergola-south-florida/',
  '/post/poolside-pergola-ideas-for-florida-homes': '/es/post/poolside-pergola-ideas-for-florida-homes/',
  '/post/how-long-pergola-installation-florida': '/es/post/how-long-pergola-installation-florida/',
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
