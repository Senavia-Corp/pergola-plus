/**
 * Tramos de longitud de una cita de resena.
 *
 * Vive en `.mjs` y aparte por la MISMA razon que `src/i18n/rutas.mjs` y
 * `src/lib/resenas-rutas.mjs`: lo necesitan los dos lados. El SITIO, en
 * `ReseñasGoogle.astro`, para poner las clases; y la PUERTA,
 * `scripts/comprobar-resenas.mjs`, para comprobar en la salida que estan puestas.
 * Con los numeros duplicados en los dos ficheros, cambiar el umbral en uno solo
 * deja la puerta comprobando una regla que ya no es la del sitio — y en verde.
 *
 * QUE PROBLEMA RESUELVEN ESTOS DOS NUMEROS
 *
 * Todas las tarjetas de una fila se estiran hasta la mas alta, asi que la altura
 * la fija SIEMPRE la resena mas larga y las demas la pagan en blanco. Medido a 3
 * tarjetas por vista (401px de ancho) antes de esto: la de 230 caracteres llenaba
 * 238 de sus 258px de zona de texto y la de 20 dejaba 228px vacios — el 88%. Una
 * linea de texto flotando sobre medio palmo de blanco no se lee como una resena
 * breve, se lee como que algo no cargo.
 *
 * La respuesta es tipografica y no estructural: la cita corta sube de cuerpo y se
 * centra en su hueco, o sea se pinta como cita DESTACADA. El hueco no desaparece
 * —20 caracteres no llenan media tarjeta ni al triple de cuerpo— pero repartido y
 * con la mancha de texto igualada, la fila se lee pareja.
 *
 * Son umbrales de MAQUETA: no cambian, filtran ni recortan ninguna resena. Y son
 * de CARACTERES porque es lo unico que se conoce al construir; el ajuste fino de
 * cuantas lineas ocupa cada tramo lo hace el CSS con unidades de contenedor
 * (`cqw`), que es lo que ve el ancho real de la tarjeta.
 */

/** Hasta aqui la cita se pinta destacada: ~3 lineas o menos al cuerpo normal. */
export const DESTACADA = 90;

/** Y hasta aqui, ademas, con el cuerpo de una frase suelta. */
export const MUY_CORTA = 40;

/**
 * Las clases modificadoras que le tocan a una cita por su longitud.
 *
 * Devuelve un array y no un string: `class:list` de Astro ya sabe unirlo, y la
 * puerta puede compararlo sin parsear nada.
 */
export function clasesDeCita(texto) {
  const n = (texto ?? '').length;
  const clases = [];
  if (n <= DESTACADA) clases.push('resena-texto--destacada');
  if (n <= MUY_CORTA) clases.push('resena-texto--una-frase');
  return clases;
}
