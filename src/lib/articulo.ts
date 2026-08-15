/**
 * Preparacion del cuerpo de un articulo del blog.
 *
 * El fragmento migrado de /post/<slug> trae tres cosas mezcladas: la cabecera
 * (h1 + imagen), una barra lateral con 10 tarjetas HARDCODEADAS E IDENTICAS en los
 * 21 posts, y el texto del articulo. Aqui se queda solo lo tercero; la cabecera y
 * los relacionados los construye la pagina con datos reales del CMS.
 *
 * De paso se arreglan tres cosas del markup original:
 *
 *  1. `opacity:0` EN LINEA sin bloque anti-FOUC. Los 21 posts salen con 4 de estos
 *     y cero bloques `html.w-mod-js:not(.w-mod-ix)`, asi que sin JavaScript el
 *     titulo y la imagen principal son invisibles. Se eliminan.
 *  2. Encabezados sin `id`. Sin ellos no hay indice, ni enlaces profundos, ni
 *     saltos a seccion en los resultados de busqueda.
 *  3. `<h1>` dentro del cuerpo. El post aluminum-pergola-cost-boca-raton-vs-fort-
 *     lauderdale mete 3, que con el de la pagina hacen 4 en un mismo documento.
 *     Se degradan a h2.
 */

export interface EntradaIndice {
  id: string;
  texto: string;
  nivel: 2 | 3;
}

export interface Articulo {
  cuerpo: string;
  indice: EntradaIndice[];
}

/** Quita etiquetas y decodifica lo justo para usar el texto como rotulo. */
function soloTexto(html: string): string {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#x27;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

function slugificar(texto: string): string {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // marcas diacriticas sueltas tras el NFD
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

/**
 * Extrae el contenido de un <div> equilibrando la profundidad.
 *
 * No vale un indexOf del cierre: el rich text lleva <figure>, listas y divs
 * anidados, asi que hay que contar aperturas y cierres.
 */
function extraerDiv(html: string, marcador: string): string | null {
  const inicio = html.indexOf(marcador);
  if (inicio < 0) return null;
  const desde = html.indexOf('>', inicio) + 1;
  let prof = 1;
  const re = /<div\b|<\/div>/g;
  re.lastIndex = desde;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    prof += m[0] === '</div>' ? -1 : 1;
    if (prof === 0) return html.slice(desde, m.index);
  }
  return null;
}

export function prepararArticulo(fragmento: string): Articulo {
  const bruto =
    extraerDiv(fragmento, '<div class="rich-text-block w-richtext"') ??
    extraerDiv(fragmento, '<div class="blog_rich-body-blog"');

  if (!bruto) {
    throw new Error('[articulo] no se encontro el bloque de texto enriquecido');
  }

  const indice: EntradaIndice[] = [];
  const usados = new Set<string>();

  let cuerpo = bruto
    // 1. Fuera el opacity:0 en linea: sin JS dejaba contenido invisible.
    .replace(/\s*style="opacity:0"/g, '')
    // 2 y 3. h1 -> h2, y un id a cada h2/h3.
    .replace(/<h([123])\b([^>]*)>([\s\S]*?)<\/h\1>/g, (_todo, nivelStr, attrs, interior) => {
      const nivel = nivelStr === '3' ? 3 : 2; // h1 del cuerpo se degrada a h2
      const texto = soloTexto(interior);
      if (!texto) return `<h${nivel}${attrs}>${interior}</h${nivel}>`;

      let id = slugificar(texto) || `seccion-${indice.length + 1}`;
      let n = 2;
      while (usados.has(id)) id = `${slugificar(texto)}-${n++}`;
      usados.add(id);

      indice.push({ id, texto, nivel });

      const attrsLimpios = attrs.replace(/\s*id="[^"]*"/g, '');
      return (
        `<h${nivel} id="${id}"${attrsLimpios}>${interior}` +
        // Ancla visible al pasar el raton. aria-hidden porque el destino util
        // para lectores de pantalla es el propio encabezado, no un enlace extra.
        `<a class="pp-ancla" href="#${id}" aria-hidden="true" tabindex="-1">#</a>` +
        `</h${nivel}>`
      );
    });

  // Las imagenes del cuerpo llegan sin dimensiones y provocan saltos de layout.
  cuerpo = cuerpo.replace(/<img\b(?![^>]*\bloading=)/g, '<img loading="lazy" decoding="async" ');

  return { cuerpo, indice };
}
