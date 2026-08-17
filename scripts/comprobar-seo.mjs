#!/usr/bin/env node
/**
 * Puerta del SEO de salida. Sobre dist/, DESPUES de `npm run build`.
 *
 *     npm run check:seo
 *
 * Mira el HTML FINAL, que es lo unico que ve un buscador. Los fallos que persigue no
 * dan error en build y por eso llevaban meses vivos:
 *
 *   - `site` apuntando al staging de Webflow envenenaba de una vez las canonicas, los
 *     hreflang, el JSON-LD y los <guid> del RSS: 761 referencias a webflow.io.
 *   - 19 paginas compartian <title>Pergola Plus Florida</title> — los 10 productos,
 *     los 7 servicios y las 2 legales.
 *   - 106 paginas declaraban un hreflang="es" hacia una traduccion que no existe, y
 *     las 106 a la misma URL.
 *   - Un JSON-LD que no parsea no es "SEO mas debil": Google lo descarta entero.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { raizHtml } from './lib/dist.mjs';

const DIST = await raizHtml();

// Rangos con los que Google trunca en el resultado de busqueda. No son ley: Google
// corta por ANCHO EN PIXELES (~600px), no por caracteres. Sirven como red, no como
// dogma.
const TITULO = [30, 65];
const DESC = [70, 160];

/**
 * Copy que escribio EL CLIENTE en el CMS. Se mide y se AVISA, pero no se falla.
 *
 * Estas colecciones traen `Title SEO` y `Metadescription SEO` rellenos a mano, y son
 * la unica parte del sitio con trabajo de SEO deliberado: 50 titulos del tipo
 * "Pergola Contractor in Boca Raton, FL | Custom Aluminum & Louvered Roofs" (71
 * caracteres). Reescribirlos para que quepan en un limite que nos hemos puesto
 * nosotros seria tirar contenido bueno, y ademas lo que Google corta ahi es el
 * calificativo detras de la barra — que es justo lo que se pone ahi por ser
 * prescindible.
 *
 * Asi que el criterio es: se falla por lo NUESTRO y se avisa por lo del cliente. La
 * senal no se pierde; la decision es suya.
 *
 * Lo que SI se falla siempre, tambien en el CMS: duplicados y ausencias. Un titulo
 * repetido o una description que falta no son una decision editorial.
 */
const DEL_CMS = /^\/(post|pergolas-contractors|countries|brands|project|products|services|articles)\//;

let fallos = 0;
let avisos = 0;

/** Se ve, se cuenta, y NO tumba la puerta. Para lo que no decidimos nosotros. */
const avisar = (lista, msg) => {
  if (!lista.length) return;
  avisos += lista.length;
  console.log(`  AVISO ${lista.length} ${msg}`);
  for (const d of lista.slice(0, 6)) console.log(`         ${d}`);
  if (lista.length > 6) console.log(`         ... y ${lista.length - 6} mas`);
};

const decir = (ok, msg, detalle = []) => {
  console.log(`  ${ok ? 'ok   ' : 'FALLO'} ${msg}`);
  if (!ok) {
    fallos++;
    for (const d of detalle.slice(0, 12)) console.log(`         ${d}`);
    if (detalle.length > 12) console.log(`         ... y ${detalle.length - 12} mas`);
  }
};

const htmls = (await fs.readdir(DIST, { recursive: true })).filter((p) => p.endsWith('.html'));
if (!htmls.length) {
  console.log('  FALLO  dist/ vacio: corre `npm run build` primero');
  process.exit(1);
}

/** Las que no compiten en buscadores y por tanto no se les exige lo mismo. */
const NO_INDEXABLES = new Set(['404.html', 'thank-you/index.html']);

const ruta = (rel) => '/' + rel.replace(/index\.html$/, '').replace(/\.html$/, '');
const decodificar = (s) => s
  .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&nbsp;/g, ' ');

const titulos = new Map();
const descripciones = new Map();
const sinTitulo = [], tituloFuera = [], sinDesc = [], descFuera = [];
const tituloFueraCms = [], descFueraCms = [];
const h1Mal = [], sinCanonica = [], canonicaRelativa = [], canonicaCruzada = [];
const jsonLdRoto = [], imgSinAlt = [], imgSinDimension = [], hreflangSuelto = [];
const ogTypeMal = [];

for (const rel of htmls) {
  const html = await fs.readFile(path.join(DIST, rel), 'utf8');
  const r = ruta(rel);
  const excluida = NO_INDEXABLES.has(rel);

  // --- title ---
  const t = html.match(/<title>([\s\S]*?)<\/title>/)?.[1];
  if (!t) sinTitulo.push(rel);
  else {
    const limpio = decodificar(t.trim());
    titulos.set(limpio, [...(titulos.get(limpio) ?? []), r]);
    if (!excluida && (limpio.length < TITULO[0] || limpio.length > TITULO[1])) {
      const linea = `${r}  (${limpio.length}) "${limpio.slice(0, 58)}"`;
      (DEL_CMS.test(r) ? tituloFueraCms : tituloFuera).push(linea);
    }
  }

  // --- description ---
  const d = html.match(/<meta content="([^"]*)"\s+name="description"/)?.[1]
    ?? html.match(/<meta name="description"\s+content="([^"]*)"/)?.[1];
  if (!d) sinDesc.push(rel);
  else {
    const limpio = decodificar(d.trim());
    descripciones.set(limpio, [...(descripciones.get(limpio) ?? []), r]);
    if (!excluida && (limpio.length < DESC[0] || limpio.length > DESC[1])) {
      const linea = `${r}  (${limpio.length}) "${limpio.slice(0, 58)}"`;
      (DEL_CMS.test(r) ? descFueraCms : descFuera).push(linea);
    }
  }

  // --- un solo <h1> ---
  // Ni cero ni dos. Cero deja la pagina sin encabezado principal —le paso a
  // /thank-you y a /articles/privacy-policy— y dos le dan a Google dos temas.
  const h1 = (html.match(/<h1[\s>]/g) ?? []).length;
  if (h1 !== 1) h1Mal.push(`${r}  tiene ${h1}`);

  // --- canonica ---
  const canon = html.match(/<link rel="canonical" href="([^"]*)"/)?.[1];
  if (!canon) sinCanonica.push(r);
  else {
    if (!/^https?:\/\//.test(canon)) canonicaRelativa.push(`${r} -> ${canon}`);
    // Una canonica que apunta a OTRA ruta le dice a Google que no indexe esta. Si
    // eso no es intencionado —y aqui nunca lo es— la pagina desaparece.
    else if (new URL(canon).pathname.replace(/\/$/, '') !== r.replace(/\/$/, '')) {
      canonicaCruzada.push(`${r} -> ${canon}`);
    }
  }
  if ((html.match(/rel="canonical"/g) ?? []).length > 1) sinCanonica.push(`${r} (mas de una)`);

  // --- hreflang: o el par entero, o ninguno ---
  const alt = [...html.matchAll(/<link rel="alternate" hreflang="([^"]+)"/g)].map((m) => m[1]);
  const idiomas = alt.filter((a) => a !== 'x-default');
  if (idiomas.length === 1) hreflangSuelto.push(`${r} declara solo hreflang="${idiomas[0]}"`);

  // --- JSON-LD que parsea ---
  for (const [, bloque] of html.matchAll(
    /<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g,
  )) {
    try { JSON.parse(bloque); } catch (e) { jsonLdRoto.push(`${r}: ${e.message.slice(0, 60)}`); }
  }

  // --- og:type ---
  // Un post es un article. Declararlo "website" le quita a Google la senal de que
  // hay fecha, autor y cuerpo.
  const og = html.match(/<meta property="og:type" content="([^"]*)"/)?.[1];
  // Los articulos son `article` en los DOS idiomas: /post/... y /es/post/...
  const esperado = /^(?:\/es)?\/post\//.test(r) ? 'article' : 'website';
  if (og !== esperado) ogTypeMal.push(`${r}  es "${og}" y deberia ser "${esperado}"`);

  // --- imagenes ---
  // `alt` ausente es distinto de `alt=""`: el vacio DECLARA que la imagen es
  // decorativa, y eso es una decision. Ausente es un olvido, y el lector de pantalla
  // acaba leyendo el nombre del archivo.
  for (const [etiqueta] of html.matchAll(/<img\s[^>]*>/g)) {
    if (!/\balt=/.test(etiqueta)) {
      imgSinAlt.push(`${r}: ${etiqueta.match(/src="([^"]*)"/)?.[1] ?? etiqueta.slice(0, 50)}`);
    }
    // Sin width/height el navegador no sabe el hueco hasta descargar: eso es CLS.
    if (!/\bwidth=/.test(etiqueta) || !/\bheight=/.test(etiqueta)) {
      imgSinDimension.push(`${r}: ${etiqueta.match(/src="([^"]*)"/)?.[1] ?? etiqueta.slice(0, 50)}`);
    }
  }
}

// --- informe ---------------------------------------------------------------
console.log(`  ${htmls.length} paginas\n`);

decir(sinTitulo.length === 0, 'todas las paginas tienen <title>', sinTitulo);
const titDup = [...titulos].filter(([, rs]) => rs.length > 1);
decir(titDup.length === 0, 'ningun <title> repetido',
  titDup.map(([t, rs]) => `"${t.slice(0, 45)}" en ${rs.length}: ${rs.slice(0, 3).join(', ')}`));
decir(tituloFuera.length === 0, `<title> entre ${TITULO[0]} y ${TITULO[1]} caracteres (paginas propias)`, tituloFuera);
avisar(tituloFueraCms, `<title> del CMS fuera de ${TITULO[0]}-${TITULO[1]}: copy del cliente, decision suya`);

decir(sinDesc.length === 0, 'todas las paginas tienen meta description', sinDesc);
const descDup = [...descripciones].filter(([, rs]) => rs.length > 1);
decir(descDup.length === 0, 'ninguna description repetida',
  descDup.map(([t, rs]) => `"${t.slice(0, 45)}" en ${rs.length}: ${rs.slice(0, 3).join(', ')}`));
decir(descFuera.length === 0, `description entre ${DESC[0]} y ${DESC[1]} caracteres (paginas propias)`, descFuera);
avisar(descFueraCms, `description del CMS fuera de ${DESC[0]}-${DESC[1]}: copy del cliente, decision suya`);

decir(h1Mal.length === 0, 'un unico <h1> por pagina', h1Mal);
decir(sinCanonica.length === 0, 'una canonica por pagina', sinCanonica);
decir(canonicaRelativa.length === 0, 'todas las canonicas son absolutas', canonicaRelativa);
decir(canonicaCruzada.length === 0, 'ninguna canonica apunta a otra ruta', canonicaCruzada);
decir(hreflangSuelto.length === 0, 'ningun hreflang solitario', hreflangSuelto);
decir(jsonLdRoto.length === 0, 'todo el JSON-LD parsea', jsonLdRoto);
decir(ogTypeMal.length === 0, 'og:type correcto (article en los posts)', ogTypeMal);
decir(imgSinAlt.length === 0, 'toda <img> declara alt', imgSinAlt);
decir(imgSinDimension.length === 0, 'toda <img> declara width y height', imgSinDimension);

// --- ningun campo del CMS vacio en el cuerpo -------------------------------
// `w-dyn-bind-empty` es la clase que Webflow pone cuando el campo del CMS al que se
// enlaza un bloque esta VACIO. Renderiza un hueco, no un error, asi que una pagina
// entera puede salir en blanco sin que nada se queje. Le pasaba a
// /articles/privacy-policy, enlazada desde el pie de las 107 paginas y desde el
// consentimiento de los dos formularios.
const conHuecos = [];
for (const rel of htmls) {
  const html = await fs.readFile(path.join(DIST, rel), 'utf8');
  if (/w-dyn-bind-empty/.test(html)) conHuecos.push(rel);
}
decir(conHuecos.length === 0, 'ningun bloque del CMS llega vacio al HTML', conHuecos);

// --- cero rastro de Webflow -------------------------------------------------
const conWebflow = [];
for (const rel of htmls) {
  const html = await fs.readFile(path.join(DIST, rel), 'utf8');
  if (/webflow\.io/.test(html)) conWebflow.push(rel);
}
decir(conWebflow.length === 0, 'ninguna referencia a webflow.io en el HTML final', conWebflow);

// --- sitemap y robots ------------------------------------------------------
const sitemap = await fs.readFile(path.join(DIST, 'sitemap.xml'), 'utf8').catch(() => '');
decir(sitemap !== '', 'existe sitemap.xml');
const robots = await fs.readFile(path.join(DIST, 'robots.txt'), 'utf8').catch(() => '');
decir(robots !== '', 'existe robots.txt');
decir(/^Sitemap:\s*https?:\/\/\S+\/sitemap\.xml$/m.test(robots), 'robots.txt apunta al sitemap');

if (sitemap) {
  const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
  decir(locs.length > 0, `el sitemap lista ${locs.length} urls`);

  // Toda ruta del sitemap tiene que EXISTIR en dist/. Un sitemap con 404 dentro es
  // peor que no tenerlo: le dice a Google que el sitio esta roto.
  const noExisten = locs.filter((p) => {
    const rel = p === '/' ? 'index.html' : p.replace(/^\//, '').replace(/\/$/, '') + '/index.html';
    return !htmls.includes(rel);
  });
  decir(noExisten.length === 0, 'toda url del sitemap existe en dist/', noExisten);

  // Y al contrario: ninguna pagina indexable se queda fuera.
  const fuera = htmls
    .filter((rel) => !NO_INDEXABLES.has(rel))
    .map(ruta)
    .filter((r) => !locs.includes(r));
  decir(fuera.length === 0, 'ninguna pagina indexable se queda fuera del sitemap', fuera);

  // Las excluidas siguen fuera.
  const colados = [...NO_INDEXABLES].map(ruta).filter((r) => locs.includes(r));
  decir(colados.length === 0, '404 y /thank-you no estan en el sitemap', colados);
}

if (fallos) {
  console.log(`\n${fallos} fallo(s).`);
  process.exit(1);
}
console.log(avisos ? `\n  Todo en verde, con ${avisos} aviso(s) de copy del cliente.` : '\n  Todo en verde.');
