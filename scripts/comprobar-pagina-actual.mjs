#!/usr/bin/env node
/**
 * Puerta de la PAGINA ACTUAL del menu (H-01). Sobre dist/, DESPUES de `npm run build`.
 *
 *     npm run check:pagina-actual
 *
 * QUE SE ROMPIO
 *
 * El enlace del menu a la pagina en la que se esta va resaltado (`w--current`: tinte y
 * negrita) y anunciado (`aria-current="page"`). Nav.astro lo calculaba comparando la ruta
 * servida con sus href, que estan escritos en ingles: en /es/products/cabanas/ nada
 * coincidia y las paginas españolas lo perdian, mientras las inglesas lo tenian. Antes
 * de F7 pasaba lo contrario (webflow.js lo quitaba en ingles). 30 paginas ES afectadas
 * y ninguna puerta lo veia: el diff visual de estados con umbral del 1 % no ve un
 * enlace de 300 px.
 *
 * QUE COMPRUEBA, en las 217 paginas
 *
 *   1. Todo enlace del menu (nav-link, w-nav-link, submenu-item, item-submenu,
 *      ver-todo, w-nav-brand) que apunta a la propia pagina lleva w--current Y
 *      aria-current="page".
 *   2. Ninguno lleva una de las dos marcas sin la otra.
 *   3. Las marcas solo estan en enlaces a la propia pagina o a una seccion que la
 *      contiene (el criterio de esActiva() en Nav.astro).
 *   4. Paridad: cada pagina española marca los mismos enlaces que su gemela inglesa.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { raizHtml } from './lib/dist.mjs';

const DIST = await raizHtml();
let fallos = 0;
const decir = (ok, msg, detalle = []) => {
  console.log(`  ${ok ? 'ok   ' : 'FALLO'} ${msg}`);
  if (!ok) {
    fallos++;
    for (const d of detalle.slice(0, 8)) console.log(`         ${d}`);
    if (detalle.length > 8) console.log(`         ... y ${detalle.length - 8} mas`);
  }
};

const htmls = (await fs.readdir(DIST, { recursive: true })).filter((p) => p.endsWith('.html'));
if (!htmls.length) throw new Error('no hay HTML en dist/: corre `npm run build` primero');

const DEL_MENU = /\b(nav-link|w-nav-link|submenu-item|item-submenu|ver-todo|w-nav-brand)\b/;
const sinBarra = (r) => r.replace(/\/+$/, '') || '/';
const rutaDe = (rel) => sinBarra('/' + rel.replace(/index\.html$/, '').replace(/\.html$/, ''));
const sinEs = (r) => (r === '/es' ? '/' : r.replace(/^\/es(?=\/)/, ''));

const sinMarca = [];
const marcaCoja = [];
const marcaAjena = [];
const marcadas = new Map();
let conEnlacePropio = 0;
for (const rel of htmls) {
  if (/(^|\/)404/.test(rel)) continue;
  const html = await fs.readFile(path.join(DIST, rel), 'utf8');
  const ruta = rutaDe(rel);
  const lista = [];
  let propio = false;
  for (const [etiqueta, attrs] of html.matchAll(/<a\b([^>]*)>/g)) {
    const clase = attrs.match(/\bclass="([^"]*)"/)?.[1] ?? '';
    if (!DEL_MENU.test(clase)) continue;
    const href = attrs.match(/\bhref="([^"]*)"/)?.[1];
    if (!href || !href.startsWith('/')) continue;
    const destino = sinBarra(href.split(/[?#]/)[0]);
    const actual = /\bw--current\b/.test(clase);
    const aria = /\baria-current="page"/.test(attrs);
    const aPropia = destino === ruta;
    if (aPropia) propio = true;
    if (aPropia && !(actual && aria)) sinMarca.push(`${ruta}: ${href} (w--current=${actual}, aria-current=${aria})`);
    if (actual !== aria) marcaCoja.push(`${ruta}: ${href} ${etiqueta.slice(0, 90)}`);
    const contiene = destino === '/' || destino === '/es' ? aPropia : (ruta === destino || ruta.startsWith(destino + '/'));
    if ((actual || aria) && !contiene) marcaAjena.push(`${ruta}: ${href}`);
    if (actual) lista.push(sinEs(destino));
  }
  if (propio) conEnlacePropio++;
  marcadas.set(ruta, lista.sort().join(' '));
}

decir(sinMarca.length === 0, `los enlaces del menu a la propia pagina llevan w--current y aria-current (${conEnlacePropio} paginas con enlace propio)`, sinMarca);
decir(marcaCoja.length === 0, 'ningun enlace lleva una marca sin la otra', marcaCoja);
decir(marcaAjena.length === 0, 'las marcas solo estan en la propia pagina o en su seccion', marcaAjena);

const dispares = [];
let parejas = 0;
for (const [ruta, lista] of marcadas) {
  if (!ruta.startsWith('/es/') && ruta !== '/es') continue;
  const en = sinEs(ruta);
  if (!marcadas.has(en)) continue;
  parejas++;
  if (marcadas.get(en) !== lista) dispares.push(`${ruta}: [${lista}] frente a ${en}: [${marcadas.get(en)}]`);
}
decir(parejas > 0 && dispares.length === 0, `las ${parejas} paginas ES marcan lo mismo que su gemela EN`, dispares);

console.log('');
if (fallos) {
  console.error(`[pagina-actual] ${fallos} fallo(s)\n`);
  process.exit(1);
}
console.log('[pagina-actual] en verde\n');
