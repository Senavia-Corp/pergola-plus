#!/usr/bin/env node
/**
 * Fase 1 / PROMPT 0 — extrae Nav y Footer a componentes Astro.
 *
 * ############################################################################
 * # RETIRADO. ESTE SCRIPT YA NO GENERA EL SHELL.                             #
 * ############################################################################
 *
 * Desde el rediseno del menu, `src/components/Nav.astro` y
 * `src/components/Footer.astro` son codigo DE AUTORIA PROPIA, no markup
 * migrado. Un menu redisenado ya no es una extraccion de `index.html`.
 *
 * Lo que cambio y por que no se puede volver a extraer:
 *   - el nav lleva enlaces "View all products/services" y "Project Estimator"
 *     que no existen en el export
 *   - se retiraron las 4 apps de Elfsight (el traductor vivia en el footer)
 *   - el CSS del menu vive aparte, en `src/styles/menu.css`
 *
 * Correr esto sobrescribiria los dos componentes y se llevaria por delante todo
 * lo anterior, en silencio. Por eso ahora exige --regenerar-shell y avisa.
 *
 * Lo que SIGUE valiendo de aqui: los limites verificados sobre index.html y las
 * comprobaciones de data-w-id. Se conserva por trazabilidad y por si hace falta
 * volver a mirar el original.
 *
 *   node scripts/generar-shell.mjs --regenerar-shell   # DESTRUCTIVO
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { transformar } from './lib/transformar.mjs';

const RAIZ = path.resolve(import.meta.dirname, '..');
const EXPORT = '/Users/senavia/Downloads/Webflow Pergola Plus Florida';

// Guarda: Nav.astro y Footer.astro son de autoria propia desde el rediseno del
// menu. Sin el flag esto no escribe nada (ver la cabecera del archivo).
if (!process.argv.includes('--regenerar-shell')) {
  console.error(`
  generar-shell.mjs esta RETIRADO.

  Nav.astro y Footer.astro ya no se generan: son codigo nuestro desde el
  rediseno del menu. Correr esto los sobrescribiria y perderias el rediseno,
  los enlaces "View all", "Project Estimator" y la retirada de Elfsight.

  Si de verdad quieres volver al markup del export:
      node scripts/generar-shell.mjs --regenerar-shell
`);
  process.exit(1);
}

const html = await fs.readFile(path.join(EXPORT, 'index.html'), 'utf8');
const lineas = html.split('\n');

// Limites verificados sobre index.html (1006 lineas):
//   34-36  div.body-code (contenedor de codigo embebido, vacio)
//   37-374 <nav class="menu">
//   848-968 <footer class="footer">
const navCrudo = lineas.slice(36, 374).join('\n');
const footerCrudo = lineas.slice(847, 968).join('\n');

if (!navCrudo.trimStart().startsWith('<nav') || !navCrudo.trimEnd().endsWith('</nav>'))
  throw new Error('los limites del nav no cuadran; revisa index.html');
if (!footerCrudo.trimStart().startsWith('<footer') || !footerCrudo.trimEnd().endsWith('</footer>'))
  throw new Error('los limites del footer no cuadran; revisa index.html');

// --- Nav --------------------------------------------------------------------
let nav = transformar(navCrudo);

// El marcador de pagina activa venia fijo en la home (el enlace del logo).
// Se quita de todos y se calcula en tiempo de render.
nav = nav
  .replace(/\s+aria-current="page"/g, '')
  .replace(/\s+w--current(?=")/g, '')
  .replace(/class="([^"]*?)\s*w--current\s*([^"]*)"/g, (_m, a, b) => `class="${(a + ' ' + b).trim()}"`);

// Se marcan los <a href="..."> para poder inyectarles el estado activo.
nav = nav.replace(/<a\s+([^>]*?)href="(\/[^"]*)"([^>]*)>/g,
  (_m, antes, href, despues) =>
    `<a ${antes}href="${href}"${despues} class:list={[{ "w--current": esActiva("${href}") }]} aria-current={esActiva("${href}") ? "page" : undefined}>`);

// Astro no admite dos atributos `class` en el mismo elemento: se fusionan.
nav = nav.replace(/<a ([^>]*?)class="([^"]*)"([^>]*?)class:list=\{\[\{ "w--current": esActiva\("([^"]*)"\) \}\]\}/g,
  (_m, a, cls, b, href) =>
    `<a ${a}class:list={["${cls}", { "w--current": esActiva("${href}") }]}${b}`);

const navAstro = `---
// Nav — extraido de index.html (lineas 37-374) por scripts/generar-shell.mjs.
// NO editar a mano: se regenera. Verificado identico en las 34 paginas del
// export salvo el marcador de pagina activa.
//
// Los data-w-id se conservan tal cual: son la llave de las interacciones de
// webflow.js (menu movil, los 2 dropdowns). Borrar uno mata su animacion en
// silencio.
const ruta = Astro.url.pathname.replace(/\\/$/, '') || '/';
const esActiva = (href: string) => (href === '/' ? ruta === '/' : ruta === href || ruta.startsWith(href + '/'));
---
${nav}
`;

// --- Footer -----------------------------------------------------------------
const footer = transformar(footerCrudo);
const footerAstro = `---
// Footer — extraido de index.html (lineas 848-968) por scripts/generar-shell.mjs.
// NO editar a mano: se regenera. Verificado BYTE-IDENTICO en las 34 paginas del
// export; el unico delta era data-wf-page-id, que es interno de Webflow.
//
// El formulario de suscripcion queda con action="" a proposito: se cablea en la
// Fase 3 junto con Turnstile.
---
${footer}
`;

const dir = path.join(RAIZ, 'src/components');
await fs.mkdir(dir, { recursive: true });
await fs.writeFile(path.join(dir, 'Nav.astro'), navAstro);
await fs.writeFile(path.join(dir, 'Footer.astro'), footerAstro);

// --- comprobaciones ---------------------------------------------------------
const ids = (s) => new Set([...s.matchAll(/data-w-id="([^"]+)"/g)].map((m) => m[1]));
const navIdsOrig = ids(navCrudo), navIdsNew = ids(nav);
const footIdsOrig = ids(footerCrudo), footIdsNew = ids(footer);
const falta = (a, b) => [...a].filter((x) => !b.has(x));

console.log('PROMPT 0 — shell extraido\n');
console.log(`  Nav.astro     ${nav.split('\n').length} lineas · data-w-id ${navIdsNew.size}/${navIdsOrig.size}`);
console.log(`  Footer.astro  ${footer.split('\n').length} lineas · data-w-id ${footIdsNew.size}/${footIdsOrig.size}`);

const perdidos = [...falta(navIdsOrig, navIdsNew), ...falta(footIdsOrig, footIdsNew)];
if (perdidos.length) {
  console.error(`\n  !! ${perdidos.length} data-w-id PERDIDOS — eso mata sus animaciones:`);
  for (const p of perdidos) console.error(`     ${p}`);
  process.exit(1);
}
const restos = [...nav.matchAll(/data-wf-[a-z-]+=/g), ...footer.matchAll(/data-wf-[a-z-]+=/g)];
console.log(`  atributos data-wf-* restantes: ${restos.length}`);
const webflowCdn = (nav + footer).match(/website-files\.com/g)?.length ?? 0;
console.log(`  referencias a website-files.com: ${webflowCdn}`);
if (restos.length || webflowCdn) process.exit(1);
console.log('\n  OK');
