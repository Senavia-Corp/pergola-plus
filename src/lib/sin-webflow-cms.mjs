/**
 * Lo que dejo el CMS de Webflow en el HTML y ya no usa nadie (retirado en 3f):
 *
 *   - <script type="text/x-wf-template">: la plantilla codificada con la que webflow.js
 *     pintaba items nuevos en el navegador. El sitio no carga webflow.js.
 *   - <div class="w-dyn-hide w-dyn-empty">: el «No items found.» de una lista vacia,
 *     oculto siempre (w-dyn-hide es display:none) y con listas que nunca estan vacias.
 *   - <script type="application/json" class="w-json"> dentro de cada a.w-lightbox: el
 *     item del lightbox. Era siempre UNO y su url, la del src de la <img> del enlace
 *     (comprobado en los 1130 enlaces del build); src/scripts/lightbox.ts la lee de ahi.
 *
 * Las plantillas del codigo ya no los llevan (scripts/sanity/retirar-webflow-cms.mjs); los
 * fragmentos migrados del repo si, y esta funcion los deja como los pinta Sanity para
 * check:sanity-fidelidad.
 */
export function sinWebflowCms(html) {
  return html
    .replace(/<script\b[^>]*type="text\/x-wf-template"[^>]*>[\s\S]*?<\/script>/g, '')
    .replace(/<div class="w-dyn-hide w-dyn-empty"><div>[^<]*<\/div><\/div>/g, '')
    .replace(/<script\b[^>]*class="w-json"[^>]*>[\s\S]*?<\/script>/g, '');
}
