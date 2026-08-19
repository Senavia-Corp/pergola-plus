#!/usr/bin/env node
/**
 * La UNICA modificacion a webflow.js: apagar sus 110 entradas por scroll.
 *
 *     node scripts/parchear-webflow.mjs
 *
 * QUE SE ROMPIO Y COMO SE VEIA
 *
 * Las animaciones de entrada del sitio se sentian pesadas. Medido sobre este mismo
 * fichero, la causa no era la que parecia:
 *
 *   - Los 110 eventos SCROLL_INTO_VIEW usan los presets growIn / slideInLeft /
 *     slideInRight / slideInBottom / slideInTop, y los cinco duran 1000 ms con
 *     easing outQuart.
 *   - 104 de los 110 llevan ademas delay:450. Son 1450 ms desde que el elemento
 *     cruza el umbral hasta que se asienta.
 *   - Los slideIn* recorren 100 px y growIn escala desde 0,75.
 *   - 20 de los 66 elementos cambian de gesto a 992 px: slideInLeft en escritorio
 *     y growIn en movil. El mismo bloque entra de dos maneras distintas.
 *
 * (El easeInOut y los 500 ms que hay en el fichero NO son de las entradas: son de
 * las listas a-*, o sea el nav, los hover y el acordeon de FAQ. Esos se quedan.)
 *
 * Las entradas pasan a ser CSS nativo con animation-timeline: view() en
 * src/styles/animaciones.css. Este parche es lo que impide que las dos corran a la
 * vez peleandose por el mismo elemento.
 *
 * POR QUE mediaQueries:[] Y NO BORRAR LOS REGISTROS
 *
 * El motor decide si un evento corre con, literalmente:
 *
 *     shouldAllowMediaQuery(e,t){return null==t||-1!==e.indexOf(t)}
 *
 * Con la lista vacia el indexOf da -1 y el evento no pasa la puerta: ni aplica su
 * estado inicial (useFirstGroupAsInitialState mira la misma condicion) ni se
 * reproduce nunca. Es un camino previsto por el propio motor.
 *
 * Borrar los registros seria cirugia sobre un literal minificado de 338 KB, y no
 * ahorraria el listener de scroll: los 24+24 eventos PAGE_SCROLL_UP/DOWN del nav lo
 * mantienen vivo igual. Toda la ganancia estaria en iterar 110 entradas menos por
 * evento de scroll. Si algun dia esa iteracion se midiera y costara, la via de
 * escape es borrar los registros; el sitio para hacerlo es este archivo.
 *
 * Idempotente: si ya esta parcheado, no hace nada.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { pathToFileURL } from 'node:url';

const RAIZ = path.resolve(import.meta.dirname, '..');
const JS = path.join(RAIZ, 'public/js/webflow.js');
const ORIGEN = '/Users/senavia/Downloads/Webflow Pergola Plus Florida/js/webflow.js';

/** Cuentas del fichero original. Si alguna cambia, el export es otro y hay que mirar. */
export const EVENTOS_TOTALES = 200;
export const REVEALS = 110;

/**
 * Trocea el blob de eventos IX2 en sus registros. Cada uno termina donde empieza el
 * siguiente, asi que las fronteras son exactas y no hay que contar llaves dentro de un
 * literal minificado.
 *
 * OJO CON EL ANCLA. La primera version buscaba la CLAVE del registro ("e-38":{id:...),
 * y el PRIMER registro del blob viene con la clave SIN comillas:
 *
 *     Webflow.require("ix2").init({events:{e:{id:"e",...
 *
 * Asi que se colaba: salian 199 registros donde hay 200, y el censo por tipo
 * (18+18+3+3+110+24+24) no cuadraba. Ese registro es un MOUSE_OVER, o sea que no se
 * parcheaba mal nada — pero la comprobacion de integridad afirmaba un numero falso, y
 * el dia que un reveal cayera el primero se lo saltaria en silencio. Se ancla en
 * {id:"..."}, que no depende de como venga escrita la clave.
 */
export function registros(js) {
  const marcas = [...js.matchAll(/\{id:"(e(?:-\d+)?)"/g)].map((m) => ({ i: m.index, id: m[1] }));
  return marcas.map((m, k) => ({
    id: m.id,
    desde: m.i,
    hasta: k + 1 < marcas.length ? marcas[k + 1].i : js.length,
  }));
}

/*
 * El cuerpo va dentro de una funcion y solo corre si se invoca el script a mano.
 * scripts/comprobar-animaciones.mjs importa `registros` y las dos constantes para
 * medir el parche con EXACTAMENTE el mismo troceador que lo aplico — si la puerta se
 * escribiera su propia version, las dos podrian dejar de estar de acuerdo y nadie lo
 * notaria. Es el mismo acoplamiento que MARQUEE_JUEGOS con check:marquee.
 */
async function parchear() {
  const js = await fs.readFile(JS, 'utf8');
  const regs = registros(js);

  if (regs.length !== EVENTOS_TOTALES) {
    console.error(`FALLO: ${regs.length} registros de evento, se esperaban ${EVENTOS_TOTALES}.`);
    console.error('       El webflow.js no es el que se auditó. Revisa antes de parchear.');
    throw new Error('parche abortado');
  }

  // Se reconstruye el fichero por trozos: fuera de los registros no se toca ni un byte.
  let salida = '';
  let cursor = 0;
  let tocados = 0;
  let yaVacios = 0;
  const sinLista = [];

  for (const r of regs) {
    const cuerpo = js.slice(r.desde, r.hasta);
    if (!cuerpo.includes('eventTypeId:"SCROLL_INTO_VIEW"')) continue;

    salida += js.slice(cursor, r.desde);
    const m = cuerpo.match(/mediaQueries:\[([^\]]*)\]/);
    if (!m) { sinLista.push(r.id); salida += cuerpo; cursor = r.hasta; continue; }
    if (m[1] === '') { yaVacios++; salida += cuerpo; cursor = r.hasta; continue; }

    salida += cuerpo.replace(/mediaQueries:\[[^\]]*\]/, 'mediaQueries:[]');
    cursor = r.hasta;
    tocados++;
  }
  salida += js.slice(cursor);

  const reveals = tocados + yaVacios + sinLista.length;
  if (reveals !== REVEALS) {
    console.error(`FALLO: ${reveals} eventos SCROLL_INTO_VIEW, se esperaban ${REVEALS}.`);
    throw new Error('parche abortado');
  }
  if (sinLista.length) {
    console.error(`FALLO: ${sinLista.length} reveal(s) sin mediaQueries: ${sinLista.join(', ')}`);
    throw new Error('parche abortado');
  }

  if (!tocados) {
    console.log(`webflow.js ya parcheado: los ${yaVacios} reveals llevan mediaQueries:[]. Nada que hacer.`);
    process.exit(0);
  }

  await fs.writeFile(JS, salida);

  const orig = await fs.readFile(ORIGEN, 'utf8').catch(() => null);
  console.log(`webflow.js parcheado: ${tocados} reveal(s) apagados` + (yaVacios ? `, ${yaVacios} ya lo estaban` : ''));
  console.log(`   eventos intactos: ${EVENTOS_TOTALES - REVEALS} (nav, hover, FAQ, dropdown)`);
  if (orig) {
    console.log(`
     sha original : ${createHash('sha256').update(orig).digest('hex').slice(0, 16)}
     sha parcheado: ${createHash('sha256').update(salida).digest('hex').slice(0, 16)}
     diferencia   : ${orig.length - salida.length} bytes (solo lo que ocupaban las listas)`);
  } else {
    console.log(`   (no se pudo leer el export original para comparar: ${ORIGEN})`);
  }

}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  await parchear().catch((e) => { console.error(e.message); process.exit(1); });
}
