/**
 * Forma canonica de una ruta interna: CON barra final, que es la que llevan el
 * canonical, el sitemap y el hreflang. Los ficheros (ultimo segmento con extension:
 * rss.xml, .avif, .pdf) se quedan como estan. Conserva ?query y #fragmento.
 *
 *     canonica('/products/cabanas')       -> '/products/cabanas/'
 *     canonica('/products/cabanas#specs') -> '/products/cabanas/#specs'
 *     canonica('/resources/blog/rss.xml') -> '/resources/blog/rss.xml'
 *     canonica('#faq')                    -> '#faq'
 *
 * Lo usan la pasada de enlaces de astro.config.mjs, el JSON-LD (src/lib/jsonld.ts),
 * los destinos de los 301 (scripts/rutas-vercel.mjs) y la puerta
 * scripts/comprobar-enlaces-canonicos.mjs: una sola definicion para los cuatro.
 *
 * @param {string} ruta
 * @returns {string}
 */
export function canonica(ruta) {
  const corte = ruta.search(/[?#]/);
  const camino = corte === -1 ? ruta : ruta.slice(0, corte);
  const resto = corte === -1 ? '' : ruta.slice(corte);
  if (camino === '' || camino.endsWith('/')) return ruta;
  if (camino.slice(camino.lastIndexOf('/') + 1).includes('.')) return ruta;
  return `${camino}/${resto}`;
}
