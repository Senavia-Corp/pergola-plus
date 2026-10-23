/**
 * Lo que comparten las puertas J5–J17 del loop SEO (docs/seo-loop/00-ESPECIFICACION-LOOP.md §4.2).
 * Leen el `dist` YA construido (dist/client) y los JSON fijados de docs/seo-loop/. No construyen,
 * no escriben en Sanity y no usan la red salvo J7 (validator.schema.org) y J17 (Vercel/Sanity, lectura).
 *
 * Cada puerta termina con `informe(...)`: imprime los fallos y una ultima linea JSON
 * `{"puerta":"J5","ok":false,...}` que lee juez.mjs. Sale con 0 solo si no hay fallos.
 * Una comprobacion que no puede correr es un FALLO, nunca un verde (~/Sites/CLAUDE.md, regla 7).
 */
import fs from 'node:fs';
import path from 'node:path';
import { parse, walkSync, ELEMENT_NODE, TEXT_NODE } from 'ultrahtml';

export const RAIZ = path.resolve(import.meta.dirname, '../../..');
export const DOCS = path.join(RAIZ, 'docs/seo-loop');
export const DIST = path.join(RAIZ, 'dist/client');

export const leerJson = (f) => JSON.parse(fs.readFileSync(path.isAbsolute(f) ? f : path.join(RAIZ, f), 'utf8'));

// --- Paginas del dist -------------------------------------------------------------------

let _paginas;
/** Map ruta ('/', '/es/products/cabanas/') -> html. Lanza si no hay dist: una puerta vacia no pasa. */
export function paginas() {
  if (_paginas) return _paginas;
  if (!fs.existsSync(DIST)) throw new Error('no hay dist/client: construye antes (juez.mjs lo hace)');
  const htmls = fs.readdirSync(DIST, { recursive: true }).filter((f) => f.endsWith('.html')).sort();
  if (!htmls.length) throw new Error('dist/client sin HTML');
  _paginas = new Map(htmls.map((f) => ['/' + f.replace(/index\.html$/, ''), fs.readFileSync(path.join(DIST, f), 'utf8')]));
  return _paginas;
}

const attr = (tag, a) => tag.match(new RegExp(`\\s${a}="([^"]*)"`))?.[1];
const metas = (head) => [...head.matchAll(/<meta\s[^>]*>/g)].map((m) => m[0]);

const ENTIDADES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', rsquo: '’', lsquo: '‘', ldquo: '“', rdquo: '”', ndash: '–', mdash: '—', hellip: '…', copy: '©', reg: '®', trade: '™' };
export const decodificar = (s) => String(s ?? '')
  .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
  .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
  .replace(/&([a-z]+);/gi, (m, n) => ENTIDADES[n.toLowerCase()] ?? m);

/** Lo que las puertas leen de una pagina. */
export function datos(html) {
  const head = html.match(/<head>([\s\S]*?)<\/head>/)?.[1] ?? '';
  const ms = metas(head);
  const meta = (k, v) => decodificar(attr(ms.find((t) => attr(t, k) === v) ?? '', 'content') ?? '');
  const jsonld = [];
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try { for (const j of [JSON.parse(m[1])].flat()) jsonld.push(...(j['@graph'] ?? [j])); } catch { jsonld.push({ '@type': '__ROTO__' }); }
  }
  return {
    lang: html.match(/<html[^>]*\slang="([^"]+)"/)?.[1] ?? '',
    title: decodificar(head.match(/<title>([^<]*)<\/title>/)?.[1]?.trim() ?? ''),
    description: meta('name', 'description'),
    noindex: /noindex/.test(meta('name', 'robots')),
    ogImageAlt: meta('property', 'og:image:alt'),
    twitterImageAlt: meta('name', 'twitter:image:alt'),
    h1: [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/g)].map((m) => limpio(m[1])),
    jsonld,
  };
}

/** Texto de un fragmento HTML sin etiquetas. */
export const limpio = (s) => decodificar(String(s).replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();

const NO_VISIBLE = new Set(['script', 'style', 'noscript', 'template', 'svg', 'head']);
/**
 * Texto visible del body (sin script/style/noscript/template/svg). Con `soloMain`, solo lo
 * que hay dentro de <main>. Devuelve un array de bloques (un bloque por nodo de texto).
 */
export function textoVisible(html, { soloMain = false } = {}) {
  const fuente = soloMain ? (html.match(/<main\b[\s\S]*<\/main>/)?.[0] ?? '') : (html.match(/<body\b[\s\S]*<\/body>/)?.[0] ?? html);
  const arbol = parse(fuente);
  const bloques = [];
  const fuera = new Set();
  walkSync(arbol, (n, padre) => {
    if (padre && fuera.has(padre)) { fuera.add(n); return; }
    if (n.type === ELEMENT_NODE && NO_VISIBLE.has(n.name)) { fuera.add(n); return; }
    if (n.type === TEXT_NODE) { const t = decodificar(n.value).replace(/\s+/g, ' ').trim(); if (t) bloques.push(t); }
  });
  return bloques;
}

/** Enlaces <a href> de una pagina (internos como ruta con barra final; externos completos). */
export function enlaces(html, { soloMain = false } = {}) {
  const fuente = soloMain ? (html.match(/<main\b[\s\S]*<\/main>/)?.[0] ?? '') : html;
  return [...fuente.matchAll(/<a\s[^>]*href="([^"]+)"/g)].map((m) => decodificar(m[1]));
}

/** Rutas indexables: en el sitemap y sin noindex. */
export function indexables() {
  const sitemap = fs.existsSync(path.join(DIST, 'sitemap.xml')) ? fs.readFileSync(path.join(DIST, 'sitemap.xml'), 'utf8') : '';
  if (!sitemap) throw new Error('no hay sitemap.xml: la puerta necesita el build de PRODUCCION (PUBLIC_ES_PRODUCCION=1)');
  const enSitemap = new Set([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname));
  return [...paginas().keys()].filter((r) => enSitemap.has(r) && !datos(paginas().get(r)).noindex);
}

// --- Texto normalizado y keywords ----------------------------------------------------------

/** Minusculas, sin tildes, & -> and, puntuacion fuera. */
export const norm = (s) => String(s ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/&/g, ' and ').replace(/[’'`´]/g, '').replace(/[^a-z0-9ñ]+/g, ' ').trim();

const VACIAS = new Set(('a an and the of in on for to with by at from near your our vs or is are it its how what which do does can you ' +
  'y o de del la las el los en para con por al un una unos unas su sus que se es como cual cuanto cuanta e u').split(' '));
/** Palabras con significado de una keyword (sin palabras vacias EN/ES). */
export const tokens = (kw) => norm(kw).split(' ').filter((t) => t && !VACIAS.has(t));
const raiz = (t) => t.replace(/(es|s)$/, '');
/**
 * ¿Lleva `texto` la keyword? Todas sus palabras con significado, en cualquier orden, con
 * singular/plural indistinto (pergola/pergolas, techo/techos). Asi casa «Pergola Contractor in
 * South Florida» con «pergola contractor south florida» sin pedir la frase literal.
 */
export function contieneKw(texto, kw) {
  const palabras = new Set(norm(texto).split(' ').map(raiz));
  return tokens(kw).every((t) => palabras.has(raiz(t)));
}

// --- Ficheros fijados y contenido ---------------------------------------------------------

export const mapaKeywords = () => leerJson(path.join(DOCS, '04-MAPA-KEYWORDS.json'));
export const glosario = () => leerJson(path.join(DOCS, 'glosario-es-florida.json'));
export const vaciosPermitidos = () => leerJson(path.join(DOCS, '02-VACIOS-PERMITIDOS.json'));
/** La instantanea de Sanity con la que se hizo el build (scripts/sanity/instantanea.mjs). */
export const contenidoBuild = () => leerJson('.cache/sanity/contenido.json');
/** Lo que lee lib/sanity-leer.mjs (publicados, versiones del loop, releases, esquema). */
export const sanityLoop = () => leerJson('.cache/seo-loop/sanity.json');

/** Ruta del gemelo EN de una ruta ES (y al reves no hace falta). */
export const gemeloEn = (ruta) => (ruta === '/es/' ? '/' : ruta.replace(/^\/es\//, '/'));
export const esEs = (ruta) => ruta === '/es/' || ruta.startsWith('/es/');

/** Dominios de fuente publica oficial (J11, J13): gobierno, condado, municipio y el Florida Building Code. */
export const FUENTE_OFICIAL = /^https?:\/\/([a-z0-9-]+\.)*([a-z0-9-]+\.(gov|fl\.us)|floridabuilding\.org|broward\.org|pbcgov\.org|pbc\.gov|miamidade\.gov|flrules\.org|myfloridalicense\.com|municode\.com|library\.municode\.com)(\/|$)/i;

// --- Salida -----------------------------------------------------------------------------

/** Imprime el resultado y sale. `fallos`: lista de textos. `extra`: datos para el juez. */
export function informe(puerta, nombre, fallos, extra = {}) {
  console.log(`${puerta} · ${nombre}`);
  const max = process.env.TODOS ? Infinity : 60; // TODOS=1 imprime la lista entera
  for (const f of fallos.slice(0, max)) console.log(`  FALLO  ${f}`);
  if (fallos.length > max) console.log(`  ... y ${fallos.length - max} mas (TODOS=1 para verlos)`);
  console.log(fallos.length ? `${fallos.length} fallo(s).` : 'Todo correcto.');
  console.log(JSON.stringify({ puerta, ok: fallos.length === 0, fallos: fallos.length, muestra: fallos.slice(0, 10), ...extra }));
  process.exit(fallos.length ? 1 : 0);
}

/** Envuelve una puerta: si lanza (falta un fichero, no hay red…), es un fallo, no un verde. */
export async function puerta(id, nombre, fn) {
  try {
    const { fallos, extra } = await fn();
    informe(id, nombre, fallos, extra);
  } catch (e) {
    informe(id, nombre, [`NO CORRIO: ${e.message}`], { noCorrio: true });
  }
}
