/**
 * Puerta de los enlaces sin destino. Se ejecuta sobre dist/, DESPUES de
 * `npm run build`.
 *
 *     npm run check:enlaces
 *
 * El Webflow original dejo un monton de <a href="#"> sin cablear: los dos del
 * bloque `call-to-action-footer` (en ~100 paginas), los de las secciones de areas
 * de servicio, la nota legal del formulario, el boton del telefono en el menu...
 *
 * El arreglo de casi todos vive en BOTONES_MUERTOS (scripts/lib/transformar.mjs)
 * y se aplica al REGENERAR los fragmentos, no al construir: si alguien regenera
 * con el mapa roto, o edita un fragmento a mano, el href="#" vuelve en silencio.
 * Esto lo caza.
 *
 * Mira el HTML final y no los fragmentos: es lo unico que prueba que el arreglo
 * llego hasta la pagina servida, y ademas cubre el shell (Nav/Footer), que no
 * pasa por el transformador.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { raizHtml } from './lib/dist.mjs';

const RAIZ = path.resolve(import.meta.dirname, '..');
const DIST = await raizHtml();

/**
 * Enlaces muertos que se quedan muertos, a proposito. Un href="#" que NO este
 * aqui es un fallo; que uno de estos desaparezca, no (si alguien crea la pagina
 * de landscaping y la cablea, esta lista sobra y se quita a mano).
 */
/**
 * Enlaces muertos tolerados a proposito. Un href="#" que NO este aqui es un fallo.
 *
 * A dia de hoy la lista esta VACIA, y eso es la noticia: al empezar la Fase 1 habia
 * cinco entradas —Landscaping, Paisajismo, el "Read More" de MaestroShield y los
 * Back/Next del multipaso—. Se han cerrado todas, cada una por su via:
 *
 *   Landscaping / Paisajismo  retirados del menu: no existia la pagina ni el
 *                             contenido con el que crearla.
 *   Read More →               la tarjeta de MaestroShield va al fabricante.
 *   Back / Next               eran <a href="#"> de Finsweet; ahora son <button>,
 *                             que es el elemento que de verdad les corresponde.
 *
 * Si algun dia hay que volver a tolerar uno, va aqui CON su motivo escrito.
 */
const CONOCIDOS = [];


/** El bloque del CTA compartido, para contarlo aparte: es el grueso del arreglo. */
const CTA = /class="call-to-action-footer"[\s\S]*?<\/section>/g;
/**
 * Cualquier <a href="#">, con o sin atributos, y su contenido. Se captura el
 * <a ...> entero, no solo el texto: hace falta la clase para distinguir el
 * lightbox, y hay enlaces que envuelven <div>/<img> en vez de texto suelto.
 */
const MUERTO = /<a\s([^>]*href="#"[^>]*)>([\s\S]*?)<\/a>/g;

/**
 * El lightbox de Webflow. Su href="#" NO es un enlace sin cablear: es el disparador
 * del visor, y el destino real va en el <script type="application/json"> de dentro.
 * Tocarlo romperia la galeria.
 */
const LIGHTBOX = /\bw-lightbox\b/;

const texto = (html) => html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

const htmls = (await fs.readdir(DIST, { recursive: true })).filter((p) => p.endsWith('.html'));
if (!htmls.length) throw new Error('dist/ vacio: corre `npm run build` primero');

const fallos = [];
const tolerados = new Map();
let bloques = 0;
let vacios = 0;
let lightbox = 0;

for (const rel of htmls) {
  const html = await fs.readFile(path.join(DIST, rel), 'utf8');
  bloques += [...html.matchAll(CTA)].length;

  for (const [, attrs, dentro] of html.matchAll(MUERTO)) {
    if (LIGHTBOX.test(attrs)) { lightbox++; continue; }
    const t = texto(dentro);
    // Un <a href="#"> sin texto ni imagen no lleva a ninguna parte, pero tampoco
    // se ve ni se tabula: no es un enlace roto para nadie.
    if (!t && !/<img|<svg/i.test(dentro)) { vacios++; continue; }
    const conocido = CONOCIDOS.find((c) => c.texto === t);
    if (conocido) {
      tolerados.set(t, (tolerados.get(t) ?? 0) + 1);
      continue;
    }
    fallos.push({ rel, t: t || '(sin texto, con imagen)' });
  }
}

console.log(`  ${htmls.length} paginas · ${bloques} bloques call-to-action-footer`);
for (const [t, n] of tolerados) {
  const c = CONOCIDOS.find((x) => x.texto === t);
  console.log(`  ok     "${t}" sigue muerto en ${n} paginas — ${c.porque}`);
}
if (lightbox) console.log(`  ok     ${lightbox} disparadores de lightbox (su href="#" es correcto)`);
if (vacios) console.log(`  ok     ${vacios} <a href="#"> sin texto ni imagen (invisibles)`);

// Las tarjetas de garantia se cablean UNA A UNA (paso 3c del transformador), asi
// que su fallo no es quedarse en "#" sino cruzarse: la tarjeta de Equinox
// apuntando a Fenetex. Eso no lo ve el barrido de arriba, que solo mira href="#".
const garantias = path.join(DIST, 'resources/warranties/index.html');
let tarjetas = 0;
for (const tarjeta of (await fs.readFile(garantias, 'utf8')).split('<div class="warranty_item">').slice(1)) {
  const titulo = tarjeta.match(/<h3[^>]*>([^<]*)/)?.[1] ?? '';
  // El href ya no es siempre lo primero: la de MaestroShield lleva target+rel
  // entre el href y la clase, asi que no se puede exigir que vayan pegados.
  const destino = tarjeta.match(/<a href="([^"]*)"[^>]*class="warraty-card-link/)?.[1];
  tarjetas++;
  if (!destino || destino === '#') {
    fallos.push({ rel: 'resources/warranties/index.html', t: `"${titulo.trim()}" sigue en href="#"` });
    continue;
  }
  // El slug de la marca tiene que salir del titulo de la tarjeta. En las externas
  // la marca esta en el dominio, no en la ultima porcion de la ruta: con
  // split('/').pop() sobre "https://maestroshield.com/" salia cadena vacia y la
  // comprobacion pasaba SIEMPRE, que es peor que no tenerla.
  const marca = destino.startsWith('http')
    ? new URL(destino).hostname.replace(/^www\./, '').split('.')[0]
    : destino.split('/').filter(Boolean).pop().replace('pergola-plus-', '');
  if (!titulo.toLowerCase().replace(/\s+/g, '').includes(marca.toLowerCase())) {
    fallos.push({ rel: 'resources/warranties/index.html', t: `"${titulo.trim()}" -> ${destino} (cruzada)` });
  }
  // Un enlace que sale del sitio sin rel="noopener" le entrega window.opener a
  // la pagina destino, que puede reescribir la nuestra.
  if (destino.startsWith('http') && !/rel="[^"]*noopener/.test(tarjeta.slice(0, tarjeta.indexOf('warraty-card-link')))) {
    fallos.push({ rel: 'resources/warranties/index.html', t: `"${titulo.trim()}" es externo y no lleva rel="noopener"` });
  }
}
if (tarjetas !== 5) {
  console.log(`  FALLO  /resources/warranties tiene ${tarjetas} tarjetas y esperaba 5: el selector ya no vale`);
  process.exit(1);
}
console.log(`  ok     las ${tarjetas} tarjetas de garantia van a su marca (4 al CMS, MaestroShield al fabricante)`);

if (fallos.length) {
  const porTexto = new Map();
  for (const f of fallos) porTexto.set(f.t, (porTexto.get(f.t) ?? 0) + 1);
  console.log(`  FALLO  ${fallos.length} enlaces sin destino:`);
  for (const [t, n] of [...porTexto].sort((a, b) => b[1] - a[1])) {
    console.log(`         "${t}" x${n}   (p.ej. ${fallos.find((f) => f.t === t).rel})`);
  }
  console.log('         si el destino existe, ponlo en BOTONES_MUERTOS y regenera;');
  console.log('         si no existe, anotalo en CONOCIDOS con el porque.');
  process.exit(1);
}
if (!bloques) {
  console.log('  FALLO  ni un bloque call-to-action-footer: el selector ya no vale');
  process.exit(1);
}
console.log('  ok     ningun enlace sin destino');
