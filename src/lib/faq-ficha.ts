/**
 * Parte el fragmento migrado de una ficha justo ANTES de que cierre la lista de
 * preguntas, para poder meter ahi el enlace a la biblioteca.
 *
 * POR QUE NO SE INYECTA EN EL FRAGMENTO. El fragmento lo reescribe
 * scripts/generar-detalle.mjs en cada pasada, asi que lo que se meta ahi a mano
 * desaparece; y ademas el reescritor de enlaces al español (astro.config) usa
 * href="(\/[^"#?]*)" y DESCARTA todo href con `?`, con lo que la ficha española
 * habria acabado enlazando a la biblioteca inglesa. Partiendo aqui, el href lo
 * calcula el componente con el idioma en la mano.
 *
 * POR QUE DENTRO DE LA LISTA Y NO COMO CUARTO HIJO DEL GRID. `.pp-faq-2col` es una
 * rejilla de 2x4 cuyo reparto depende de que tenga EXACTAMENTE tres hijos —foto,
 * cabecera y lista— y de que las filas 1 y 4 sean holguras iguales (ver
 * src/styles/faq.css). Un cuarto hijo cae en la fila 4 y descentra el texto frente
 * a la foto. Dentro de la lista, la rejilla no se entera.
 *
 * La lista se llama distinto en cada coleccion: `.div-block-10` en productos (que es
 * un bloque) y `.wrapper-faq` en servicios (que es flex en columna). Se buscan las
 * dos.
 */

/** Los dos nombres que tiene la lista de preguntas en el markup migrado. */
const CONTENEDORES = ['div-block-10', 'wrapper-faq'];

export interface FaqPartido {
  antes: string;
  despues: string;
}

/**
 * Devuelve el fragmento partido en el punto de insercion. Lanza si no encuentra la
 * seccion: las 17 fichas la tienen (5 preguntas cada una), asi que no encontrarla
 * significa que el markup ha cambiado y hay que enterarse en el build, no en
 * produccion.
 */
export function partirTrasFaq(html: string, ficha: string): FaqPartido {
  const seccion = html.indexOf('section-faq-page');
  if (seccion < 0) throw new Error(`[faq-ficha] ${ficha}: no hay seccion de FAQ en el fragmento`);

  let abre = -1;
  for (const clase of CONTENEDORES) {
    const i = html.indexOf(`class="${clase}"`, seccion);
    if (i >= 0 && (abre < 0 || i < abre)) abre = i;
  }
  if (abre < 0) {
    throw new Error(`[faq-ficha] ${ficha}: la seccion de FAQ no usa ${CONTENEDORES.join(' ni ')}`);
  }

  // Retrocede hasta el '<div' que abre ese contenedor y avanza contando divs hasta
  // su cierre. El markup de esta seccion es todo <div>, sin void tags que confundan.
  const inicio = html.lastIndexOf('<div', abre);
  let prof = 0;
  const tag = /<\/?div\b/g;
  tag.lastIndex = inicio;
  for (let m = tag.exec(html); m; m = tag.exec(html)) {
    prof += m[0] === '<div' ? 1 : -1;
    if (prof === 0) {
      // m.index es el '<' de la etiqueta de cierre: el enlace va justo antes.
      return { antes: html.slice(0, m.index), despues: html.slice(m.index) };
    }
  }
  throw new Error(`[faq-ficha] ${ficha}: la lista de preguntas no cierra`);
}

/**
 * La marca que `scripts/lib/transformar.mjs` deja en el fragmento de una ficha
 * recompuesta, en el hueco donde iba el primer CTA.
 *
 * ESTA CADENA VIVE EN DOS SITIOS Y NO HAY FORMA DE EVITARLO: el transformador es
 * `.mjs` y corre en un script de Node; esto es `.ts` y corre dentro del build de
 * Astro. Lo que si se puede es que la duplicacion no pueda romperse en silencio, y de
 * eso se encargan las dos plantillas: comprueban que la marca esta si y solo si la
 * ficha tiene seccion de especificaciones, y lanzan si no cuadra. Sin esa asercion,
 * un cambio en el transformador dejaria la pagina sin especificaciones, sin reseñas y
 * sin un solo error.
 *
 * Es un comentario HTML a proposito: si algun dia alguien se salta el corte, un
 * comentario no se ve; un `<div>` vacio si.
 */
export const MARCA_SECCIONES = '<!--pp-secciones-ficha-->';

/**
 * Parte el fragmento por la marca. Lanza si no esta: una seccion que desaparece en
 * silencio es el fallo que este fichero existe para evitar.
 */
export function partirEnMarca(html: string, ficha: string): FaqPartido {
  const i = html.indexOf(MARCA_SECCIONES);
  if (i < 0) {
    throw new Error(`[faq-ficha] ${ficha}: no encuentro la marca ${MARCA_SECCIONES} en el fragmento`);
  }
  return { antes: html.slice(0, i), despues: html.slice(i + MARCA_SECCIONES.length) };
}

/**
 * Los pares P/R que la ficha PINTA de verdad, leidos del mismo HTML que se va a
 * servir.
 *
 * POR QUE SE EXTRAEN Y NO SE COPIAN. Google exige que las preguntas y respuestas del
 * markup sean EXACTAMENTE las que se ven en la pagina; una copia se desincroniza y
 * entonces el markup pasa a ser spam a ojos de Google. Es la misma regla que ya
 * documenta `src/lib/jsonld.ts`, y la unica forma de cumplirla aqui es leer el HTML:
 * las cinco preguntas de una ficha viven VERBATIM dentro del fragmento migrado, no
 * en un objeto.
 *
 * Y por eso vive en ESTE fichero y no en uno nuevo: `faq-ficha.ts` ya es el dueño del
 * contrato del markup de FAQ de las 17 fichas —ya conoce `section-faq-page`,
 * `div-block-10` y `wrapper-faq`, y ya lanza si el markup cambia—. Dos funciones que
 * conocen el mismo markup en dos ficheros distintos es exactamente como se
 * desincronizan.
 *
 * EN LA PLANTILLA ESPAÑOLA SE LLAMA SOBRE EL HTML YA TRADUCIDO, jamas sobre el
 * original: los nodos de texto traducidos son los que el visitante lee, y publicar un
 * `FAQPage` ingles en una pagina española es exactamente la infraccion que esta
 * funcion existe para evitar.
 */
export function paresFaq(html: string, ficha: string): { pregunta: string; respuesta: string }[] {
  const seccion = html.indexOf('section-faq-page');
  if (seccion < 0) throw new Error(`[faq-ficha] ${ficha}: no hay seccion de FAQ en el fragmento`);
  const zona = html.slice(seccion);

  const pares: { pregunta: string; respuesta: string }[] = [];
  // Se parte por item en vez de casar un patron largo: asi una respuesta que falte
  // LANZA, en vez de emparejarse en silencio con la del item siguiente.
  for (const trozo of zona.split('class="faq_item"').slice(1)) {
    const q = trozo.match(/<h3[^>]*class="faq_question"[^>]*>([\s\S]*?)<\/h3>/)?.[1];
    const a = trozo.match(/<div class="faq_answer">([\s\S]*?)<\/div>/)?.[1];
    if (q == null || a == null) {
      throw new Error(`[faq-ficha] ${ficha}: un faq_item no tiene pregunta o respuesta`);
    }
    pares.push({ pregunta: limpiar(q), respuesta: limpiar(a) });
  }
  if (!pares.length) throw new Error(`[faq-ficha] ${ficha}: la seccion de FAQ no tiene ni un par`);
  return pares;
}

/**
 * De HTML a texto plano, en un orden que NO es intercambiable.
 *
 *   1. FUERA LAS ETIQUETAS, y no es cosmetica: `BaseLayout.astro` serializa el grafo
 *      con `set:html={JSON.stringify(jsonLd)}`, asi que un `</script>` dentro de una
 *      respuesta cerraria el bloque y romperia la pagina entera.
 *   2. Las entidades se decodifican SIEMPRE. Si el JSON-LD publicara `&amp;` donde la
 *      pagina muestra `&`, las dos cadenas dejarian de ser identicas — que es lo unico
 *      que este nodo tiene que garantizar.
 *   3. El prefijo numerado va AL FINAL, porque esta al principio de la cadena YA
 *      recortada. Es el mismo criterio que impone `faqs.es.ts`, que lanza si una
 *      pregunta de la biblioteca conserva su «1. ». Cuando el fragmento deje de estar
 *      numerado, este `replace` simplemente no encuentra nada.
 */
const limpiar = (s: string) => s
  .replace(/<[^>]*>/g, '')
  .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&nbsp;/g, ' ')
  .replace(/\s+/g, ' ').trim()
  .replace(/^\d+\.\s*/, '');
