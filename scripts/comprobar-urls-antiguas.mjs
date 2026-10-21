#!/usr/bin/env node
/**
 * Las 64 URLs que publica hoy www.pergolaplusflorida.com (sitemap del Webflow viejo, ver
 * src/data/redirecciones-dominio.mjs) contra el build: .vercel/output/config.json y
 * dist/client, sin servidor.
 *
 *     node scripts/comprobar-urls-antiguas.mjs        # despues de `npm run build`
 *
 * Cada URL, en la forma que publica Webflow (sin barra) y con barra, tiene que:
 *   - dar 200 directamente, o
 *   - dar UNA redireccion (301 de redirecciones-dominio, 308 de la barra final) a una
 *     URL con barra que da 200 sin otra redireccion;
 * y la pagina final tiene que tener canonical autorreferente (la URL con barra, con el
 * dominio del build: el de produccion con PUBLIC_SITE_URL).
 *
 * El enrutado se simula como Vercel: las rutas de config.json en orden hasta
 * `handle: filesystem`; la primera con status 301/308 que casa redirige.
 */
import fs from 'node:fs';
import path from 'node:path';

const RAIZ = path.resolve(import.meta.dirname, '..');
const DIST = path.join(RAIZ, 'dist/client');

export const URLS_ANTIGUAS = [
  '/', '/our-work', '/contact-us', '/projects', '/thank-you', '/services/pergolas-patio-covers',
  '/services/solar-patio-covers', '/customer-reviews', '/blog', '/services/driveway-pavers',
  '/services/fencing-solutions', '/services/pool-and-patio-enclosures', '/services/louvered-roof-systems',
  '/terms-conditions', '/services/carports-installation-contractors', '/our-brands',
  '/project/boca-raton-pergola-project', '/project/commercial-patio-cover-project',
  '/project/delray-beach-pergola-project', '/project/forte-patio-cover-project',
  '/project/forte-patio-cover-project-2', '/project/forte-patio-cover-project-3',
  '/project/forte-patio-cover-project-4', '/project/forte-patio-cover-project-5',
  '/project/hillsboro-beach-pergola-project', '/project/pergola-project-in-west-palm-beach',
  '/post/aluminum-vs-wood-pergolas-which-one-is-right-for-you', '/post/do-motorized-pergolas-increase-home-value',
  '/post/does-a-pergola-increase-property-value', '/post/how-an-aluminum-pergola-adds-an-extra-room-to-your-home',
  '/post/how-long-can-you-expect-a-pergola-to-last', '/post/louvered-pergola-vs-traditional-pergola-whats-the-difference',
  '/post/why-aluminum-pergolas-are-the-best-choice-for-your-outdoor-living-space', '/post/why-choose-a-metal-pergola-over-wood',
  '/our-brands/apollo', '/our-brands/equinox', '/our-brands/fenetex', '/our-brands/forte', '/our-brands/renaissance',
  ...['aventura-pergola-builders', 'boca-raton-pergola-contractor', 'boynton-beach-contractors', 'cooper-city-pergola-installation',
    'coral-gables', 'coral-springs-installation', 'davie-installation', 'delray-beach-contractors', 'doral-pergola-builders',
    'fort-lauderdale-installation', 'hollywood-pergola-installation', 'jupiter-contractors', 'key-biscayne-pergola-builders',
    'miami-beach-pergola-design', 'miami-pergola-experts', 'miramar-installation', 'palm-beach-contractors', 'palm-beach-gardens',
    'parkland-installation', 'pembroke-pines-pergola-installation', 'royal-palm-beach-contractors',
    'sunny-isles-beach-pergola-builders', 'wellington-contractors', 'west-palm-beach-contractors', 'weston-pergola-solutions',
  ].map((s) => `/pergolas-contractors/${s}`),
];

const cfg = JSON.parse(fs.readFileSync(path.join(RAIZ, '.vercel/output/config.json'), 'utf8'));
const antesDelDisco = cfg.routes.slice(0, cfg.routes.findIndex((r) => r.handle === 'filesystem'));

/** Una peticion: { status, location? } como la resolveria Vercel. */
function pedir(url) {
  for (const r of antesDelDisco) {
    if (!r.src || ![301, 308].includes(r.status)) continue;
    const m = url.match(new RegExp(r.src));
    if (m) return { status: r.status, location: r.headers.Location.replace(/\$(\d)/g, (_, i) => m[Number(i)] ?? '') };
  }
  const f = url.endsWith('/') ? path.join(DIST, url, 'index.html') : path.join(DIST, url);
  return fs.existsSync(f) && fs.statSync(f).isFile() ? { status: 200, fichero: f } : { status: 404 };
}

const fallos = [];
let saltos = { directa: 0, '301': 0, '308': 0 };
for (const vieja of URLS_ANTIGUAS) {
  for (const url of new Set([vieja, vieja.endsWith('/') ? vieja : `${vieja}/`])) {
    let r = pedir(url), final = url;
    if (r.status === 301 || r.status === 308) {
      final = r.location;
      const tipo = String(r.status);
      r = pedir(final);
      if (r.status !== 200) { fallos.push(`${url}: ${tipo} a ${final}, que da ${r.status}${r.location ? ` (${r.location})` : ''}`); continue; }
      if (!final.endsWith('/')) { fallos.push(`${url}: ${tipo} a ${final}, sin barra final`); continue; }
      if (url === vieja) saltos[tipo]++;
    } else if (r.status === 200) {
      if (url === vieja) saltos.directa++;
    } else { fallos.push(`${url}: ${r.status}`); continue; }
    const canonical = fs.readFileSync(r.fichero, 'utf8').match(/<link rel="canonical" href="([^"]+)"/)?.[1];
    if (!canonical || new URL(canonical).pathname !== final) fallos.push(`${url}: la pagina final ${final} tiene canonical ${canonical}`);
  }
}
console.log(`${URLS_ANTIGUAS.length} URLs antiguas (y su forma con barra): ${saltos.directa} en 200, ${saltos['301']} con un 301, ${saltos['308']} con un 308 de barra final`);
if (URLS_ANTIGUAS.length !== 64) fallos.push(`la lista tiene ${URLS_ANTIGUAS.length} URLs, no 64`);
for (const f of fallos) console.log(`  FALLO  ${f}`);
console.log(fallos.length ? `\n${fallos.length} fallo(s).` : '\nTodo correcto.');
process.exit(fallos.length ? 1 : 0);
