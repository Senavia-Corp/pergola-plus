/**
 * Contenido local de ciudades y condados (C5 del informe 08): el campo `local` del documento
 * (texto con formato, EN/ES) se pinta como una sección de prosa justo después de la intro.
 * Solo en el idioma de la página: si falta el español, la página española no la lleva (nunca
 * cae al inglés).
 */
import { cuerpoHtml } from './sanity/blog.mjs';
import { rutaImagen, hrefDe } from './sanity/fuente.mjs';

export function conLocal(html, doc, idioma) {
  const bloques = doc?.local?.[idioma];
  if (!bloques?.length) return html;
  const prosa = cuerpoHtml(bloques, { rutaImagen, hrefDe });
  const seccion = `<section class="pp-local"><div class="w-layout-blockcontainer container w-container"><div class="pp-prosa">${prosa}</div></div></section>`;
  const conSeccion = html.replace(/(<section class="intro-location">[\s\S]*?<\/section>)/, `$1${seccion}`);
  if (conSeccion === html) throw new Error(`[local] ${doc._id}: no hay intro-location donde colocar el contenido local`);
  return conSeccion;
}
