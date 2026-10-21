#!/usr/bin/env node
/**
 * Puerta de la forma canonica de las URL internas. Sobre dist/, DESPUES de `npm run build`.
 *
 *     npm run check:canonicos
 *
 * QUE SE ROMPIO
 *
 * El canonical, el sitemap y el hreflang llevan barra final (`/products/cabanas/`), pero
 * 7.601 enlaces internos (152 rutas distintas) y 435 URL del JSON-LD apuntaban a la forma
 * sin barra, frente a 9.000 enlaces que si la llevaban. Dos URL para la misma pagina, y
 * los 46 redirects 301 mandaban tambien a la forma sin barra. Ninguna puerta lo miraba:
 * check:enlaces da por buena cualquiera de las dos porque las dos resuelven.
 *
 * QUE COMPRUEBA
 *
 *   1. 0 href internos en forma no canonica (misma regla que canonizarEnlaces() de
 *      astro.config.mjs: fuera /api/ y /_, ficheros y anclas se quedan).
 *   2. 0 URL del propio sitio en forma no canonica dentro del JSON-LD.
 *   3. En .vercel/output/config.json:
 *      - cada 301 va a un destino canonico y su origen acepta con y sin barra;
 *      - existe la regla 308 de barra final, delante del filesystem;
 *      - un salto: ningun destino de 301 vuelve a casar con un redirect;
 *      - casos fijos: /products/cabanas -> 308, /aluminum-pergolas[/] -> /products/,
 *        /api/lead y los ficheros, sin redirect.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { raizHtml } from './lib/dist.mjs';
import { canonica } from '../src/lib/canonica.mjs';

// La regla, comprobada antes de usarla para juzgar nada.
assert.equal(canonica('/products/cabanas'), '/products/cabanas/');
assert.equal(canonica('/products/cabanas/'), '/products/cabanas/');
assert.equal(canonica('/products/cabanas#specs'), '/products/cabanas/#specs');
assert.equal(canonica('/es?x=1'), '/es/?x=1');
assert.equal(canonica('/'), '/');
assert.equal(canonica('#faq'), '#faq');
assert.equal(canonica('/resources/blog/rss.xml'), '/resources/blog/rss.xml');
assert.equal(canonica('/cms-img/brands/apollo/logo.png'), '/cms-img/brands/apollo/logo.png');

const RAIZ = path.resolve(import.meta.dirname, '..');
const DIST = await raizHtml();
const ES_PRODUCCION = process.env.PUBLIC_ES_PRODUCCION === '1';
// Igual que astro.config.mjs: el JSON-LD se escribe con este origen.
const SITIO = new URL(process.env.PUBLIC_SITE_URL ?? (ES_PRODUCCION ? 'https://www.pergolaplusflorida.com' : 'http://localhost:4321'));

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
console.log(`\n[canonicos] ${htmls.length} paginas\n`);

const malHref = [];
const malLd = [];
let revisados = 0;
for (const rel of htmls) {
  const html = await fs.readFile(path.join(DIST, rel), 'utf8');
  for (const [, ruta] of html.matchAll(/href="(\/(?!\/|api\/|_)[^"]*)"/g)) {
    revisados++;
    if (canonica(ruta) !== ruta) malHref.push(`${rel}: ${ruta}`);
  }
  for (const [, json] of html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
    for (const [, u] of json.matchAll(/"(https?:\/\/[^"]+)"/g)) {
      let url;
      try { url = new URL(u); } catch { continue; }
      if (url.origin !== SITIO.origin) continue;
      const ruta = url.pathname + url.search + url.hash;
      if (canonica(ruta) !== ruta) malLd.push(`${rel}: ${u}`);
    }
  }
}
decir(malHref.length === 0, `los ${revisados} href internos estan en forma canonica`, malHref);
decir(malLd.length === 0, `las URL de ${SITIO.origin} del JSON-LD estan en forma canonica`, malLd);

// --- Enrutado de Vercel ---------------------------------------------------------
const config = JSON.parse(await fs.readFile(path.join(RAIZ, '.vercel/output/config.json'), 'utf8'));
const iFs = config.routes.findIndex((r) => r.handle === 'filesystem');
const redirects = config.routes.slice(0, iFs).filter((r) => r.status >= 300 && r.status < 400 && r.headers?.Location);
const resolver = (ruta) => {
  for (const r of redirects) {
    const m = ruta.match(new RegExp(r.src));
    if (m) return { status: r.status, destino: r.headers.Location.replace(/\$(\d)/g, (_x, i) => m[Number(i)] ?? '') };
  }
  return null;
};

const fijos = redirects.filter((r) => !r.headers.Location.includes('$'));
decir(fijos.every((r) => canonica(r.headers.Location) === r.headers.Location),
  `los ${fijos.length} redirects fijos van a un destino canonico`,
  fijos.filter((r) => canonica(r.headers.Location) !== r.headers.Location).map((r) => `${r.src} -> ${r.headers.Location}`));
decir(fijos.every((r) => r.src.endsWith('/?$')), 'y su origen acepta con y sin barra',
  fijos.filter((r) => !r.src.endsWith('/?$')).map((r) => r.src));
const dobles = fijos.map((r) => [r.headers.Location, resolver(r.headers.Location)]).filter(([, x]) => x);
decir(dobles.length === 0, 'un solo salto: ningun destino vuelve a redirigir', dobles.map(([d, x]) => `${d} -> ${x.status} ${x.destino}`));

const CASOS = [
  ['/products/cabanas', 308, '/products/cabanas/'],
  ['/es/products/cabanas', 308, '/es/products/cabanas/'],
  ['/products/cabanas/', null],
  ['/aluminum-pergolas', 301, '/products/'],
  ['/aluminum-pergolas/', 301, '/products/'],
  ['/about-us', 301, '/about-us/about-us/'],
  ['/about-us/', 301, '/about-us/about-us/'],
  ['/api/lead', null],
  ['/resources/blog/rss.xml', null],
  ['/images/logo-pergola-plus-florida.png', null],
  ['/_image', null],
];
for (const [ruta, status, destino] of CASOS) {
  const x = resolver(ruta);
  const ok = status === null ? x === null : x?.status === status && x?.destino === destino;
  decir(ok, `${ruta} -> ${status === null ? 'sin redirect' : `${status} ${destino}`}`, [`obtenido: ${x ? `${x.status} ${x.destino}` : 'sin redirect'}`]);
}

console.log('');
if (fallos) {
  console.error(`[canonicos] ${fallos} fallo(s)\n`);
  process.exit(1);
}
console.log('[canonicos] en verde\n');
