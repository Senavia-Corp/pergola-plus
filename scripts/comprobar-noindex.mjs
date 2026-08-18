#!/usr/bin/env node
/**
 * Puerta del deploy provisional. Sobre dist/, DESPUES de `npm run build`.
 *
 *     npm run check:noindex
 *
 * QUE IMPIDE
 *
 * El dominio real sigue sirviendo el Webflow en vivo. Un deploy provisional
 * indexable no es un detalle de SEO: es una copia del sitio ENTERO compitiendo en
 * buscadores contra el sitio del cliente, y ademas con su sitemap anunciando las
 * URLs del dominio bueno. Medido antes de este cambio, en la salida construida:
 *
 *     robots.txt   Allow: /
 *     robots.txt   Sitemap: https://www.pergolaplusflorida.com/sitemap.xml
 *     rss.xml      <guid>https://www.pergolaplusflorida.com/post/...
 *
 * POR QUE FALLA CERRADO
 *
 * La regla es "se indexa solo si PUBLIC_ES_PRODUCCION=1", y no al reves, porque los
 * dos olvidos no cuestan lo mismo: olvidar la variable en produccion da un sitio
 * invisible que se arregla con un redeploy, y olvidarla al reves da una copia
 * duplicada indexada que tarda semanas en salir del indice.
 *
 * Esta puerta comprueba LOS DOS MODOS, decidiendo cual toca por la misma variable
 * que lee el build. Asi la unica forma de saltarsela es mentirle a las dos a la vez.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { raizHtml } from './lib/dist.mjs';

const DIST = await raizHtml();
const ES_PRODUCCION = process.env.PUBLIC_ES_PRODUCCION === '1';
const DOMINIO_REAL = 'pergolaplusflorida.com';

let fallos = 0;
const decir = (ok, msg, detalle = []) => {
  console.log(`  ${ok ? 'ok   ' : 'FALLO'} ${msg}`);
  if (!ok) {
    fallos++;
    for (const d of detalle.slice(0, 8)) console.log(`         ${d}`);
    if (detalle.length > 8) console.log(`         ... y ${detalle.length - 8} mas`);
  }
};

const leer = (rel) => fs.readFile(path.join(DIST, rel), 'utf8').catch(() => null);
const existe = async (rel) => (await leer(rel)) !== null;

const htmls = (await fs.readdir(DIST, { recursive: true })).filter((p) => p.endsWith('.html'));
// Una puerta que no encuentra ficheros sale en verde sin haber comprobado nada.
if (!htmls.length) throw new Error('no hay HTML en dist/: corre `npm run build` primero');

const NOINDEX = /<meta[^>]+name="robots"[^>]+content="[^"]*noindex/i;
const robots = await leer('robots.txt');

console.log(`\n[noindex] ${htmls.length} paginas · modo ${ES_PRODUCCION ? 'PRODUCCION' : 'PROVISIONAL'}\n`);

decir(robots !== null, 'existe robots.txt');

if (!ES_PRODUCCION) {
  // --- Modo provisional: nada de esto puede llegar a un buscador ---
  decir(
    /^\s*Disallow:\s*\/\s*$/m.test(robots ?? ''),
    'robots.txt lleva Disallow: /',
    [String(robots).split('\n').filter(Boolean).join(' | ')],
  );
  decir(!/^\s*Allow:\s*\/\s*$/m.test(robots ?? ''), 'robots.txt NO lleva Allow: /');
  decir(!/^\s*Sitemap:/m.test(robots ?? ''), 'robots.txt NO anuncia un sitemap');
  decir(!(await existe('sitemap.xml')), 'no se ha escrito sitemap.xml');
  decir(!(await existe('resources/blog/rss.xml')), 'no se ha escrito el RSS');

  // El <meta> tiene que estar en TODAS. Una sola pagina sin el es la que se indexa.
  const sinMeta = [];
  for (const rel of htmls) {
    const html = await leer(rel);
    if (!NOINDEX.test(html ?? '')) sinMeta.push(rel);
  }
  decir(sinMeta.length === 0, `las ${htmls.length} paginas llevan <meta robots noindex>`, sinMeta);

  // Anunciar un feed que no existe son 211 enlaces a un 404.
  const conFeed = [];
  for (const rel of htmls) {
    const html = await leer(rel);
    if (/type="application\/rss\+xml"/.test(html ?? '')) conFeed.push(rel);
  }
  decir(conFeed.length === 0, 'ninguna pagina anuncia el feed RSS', conFeed);

  // Lo que de verdad hace dano: que las canonicas manden al dominio del cliente y
  // consoliden esta copia contra su sitio.
  const conDominioReal = [];
  for (const rel of htmls) {
    const html = await leer(rel);
    const canonica = (html ?? '').match(/<link rel="canonical" href="([^"]+)"/)?.[1] ?? '';
    if (canonica.includes(DOMINIO_REAL)) conDominioReal.push(`${rel}: ${canonica}`);
  }
  decir(
    conDominioReal.length === 0,
    `ninguna canonica apunta a ${DOMINIO_REAL} (falta PUBLIC_SITE_URL)`,
    conDominioReal,
  );
} else {
  // --- Modo produccion: que el candado no se haya quedado puesto ---
  decir(/^\s*Allow:\s*\/\s*$/m.test(robots ?? ''), 'robots.txt lleva Allow: /');
  decir(!/^\s*Disallow:\s*\/\s*$/m.test(robots ?? ''), 'robots.txt NO lleva Disallow: /');
  decir(/^\s*Sitemap:/m.test(robots ?? ''), 'robots.txt anuncia el sitemap');
  decir(await existe('sitemap.xml'), 'se ha escrito sitemap.xml');
  decir(await existe('resources/blog/rss.xml'), 'se ha escrito el RSS');

  const conMeta = [];
  for (const rel of htmls) {
    const html = await leer(rel);
    if (NOINDEX.test(html ?? '')) conMeta.push(rel);
  }
  // El 404 sí puede llevarlo por su cuenta: no es contenido.
  const indebidos = conMeta.filter((r) => !r.endsWith('404.html'));
  decir(indebidos.length === 0, 'ninguna pagina se ha quedado con noindex', indebidos);
}

console.log('');
if (fallos) {
  console.error(`[noindex] ${fallos} fallo(s)\n`);
  process.exit(1);
}
console.log('[noindex] en verde\n');
