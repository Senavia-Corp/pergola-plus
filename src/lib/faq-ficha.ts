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
