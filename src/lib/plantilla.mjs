/**
 * Plantillas de coleccion: el DISEÑO en el codigo, el CONTENIDO en Sanity.
 *
 * Una plantilla es el fragmento migrado de Webflow con cada pieza de contenido
 * sustituida por un marcador `\u0001<clave>\u0001` (byte de control: no puede aparecer en
 * HTML valido). Las piezas son «huecos» (slots):
 *
 *   texto     un nodo de texto                    -> texto {en, es}
 *   atributo  alt/aria-label/placeholder/data-wait/value de un boton de envio -> {en, es}
 *   imagen    el `src` de una <img> raster        -> asset (y su alt va en el hueco `atributo` <clave>.alt)
 *   enlace    un `href` que cambia entre paginas  -> referencia o URL
 *   lista     una lista de longitud variable (la galeria) -> array de elementos, cada uno
 *             con su subplantilla
 *   heredado  marcado de Webflow que nadie lee (x-wf-template) -> tal cual, desde el codigo
 *   valor     el src del video embebido y su proporcion -> texto sin traducir
 *   derivado  un `srcset` que sale del `src`      -> lo calcula el codigo, no se guarda
 *             (con `soloRaster`, el par ` srcset sizes` entero, que no va si la imagen no
 *             es raster)
 *
 * La derivacion (scripts/sanity/plantillas.mjs) saca la plantilla y los valores de las
 * paginas de una coleccion; `rellenar` hace lo contrario. La paridad de la migracion es
 * que rellenar la plantilla con los valores de cada pagina devuelva su fragmento, en
 * ingles y en español.
 */
export const MARCA = '\u0001';
const ESC = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const ESC_ATTR = (s) => ESC(s).replace(/"/g, '&quot;');

/**
 * @param {string} plantilla
 * @param {Record<string, {tipo: string}>} huecos  metadatos de cada clave
 * @param {(clave: string) => string | undefined} valor  valor ya en el idioma de la pagina
 *   (texto plano para texto/atributo; ruta publica para imagen; href final para enlace)
 */
export function rellenar(plantilla, huecos, valor) {
  return plantilla.replace(new RegExp(`${MARCA}([^${MARCA}]+)${MARCA}`, 'g'), (_m, clave) => {
    const h = huecos[clave];
    if (!h || typeof h !== 'object') throw new Error(`[plantilla] hueco sin metadatos: ${clave}`);
    if (h.tipo === 'lista') {
      // Lista de longitud variable (la galeria): un lector por elemento.
      const items = valor(clave);
      if (!Array.isArray(items)) throw new Error(`[plantilla] ${clave}: la lista no es un array`);
      return items.map((l) => rellenar(h.plantilla, h.huecos, l)).join('');
    }
    if (h.tipo === 'opcional') {
      // Bloque que tienen unas paginas y otras no (el video de las fichas de producto).
      const l = valor(clave);
      return l ? rellenar(h.plantilla, h.huecos, l) : '';
    }
    if (h.tipo === 'heredado') {
      // Marcado heredado de Webflow que ningun codigo lee (x-wf-template): va tal cual,
      // desde el codigo, no desde Sanity. Una pagina nueva no lo tiene.
      return valor(clave) ?? '';
    }
    if (h.tipo === 'derivado') {
      const src = valor(h.de);
      if (src == null) throw new Error(`[plantilla] ${clave}: falta la imagen ${h.de}`);
      if (h.modo === 'src') return h.patron.split(MARCA + 'src' + MARCA).join(src);
      // srcset/sizes solo para una imagen raster (el respaldo SVG va sin ellos).
      if (h.soloRaster && !/\.(avif|jpe?g|png|webp|gif)(\?.*)?$/i.test(src)) return '';
      // Grupo srcset/sizes/width/height solo para las imagenes de un directorio.
      if (h.siPrefijo && !src.startsWith(h.siPrefijo)) return '';
      // El srcset de la pagina original con la raiz del fichero sustituida.
      return h.patron.split(MARCA + 'raiz' + MARCA).join(src.replace(/\.[a-z0-9]+$/i, ''));
    }
    const v = valor(clave);
    if (v == null) throw new Error(`[plantilla] sin valor para ${clave}`);
    return h.tipo === 'texto' ? ESC(v) : ESC_ATTR(v);
  });
}
