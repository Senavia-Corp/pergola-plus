#!/usr/bin/env node
/**
 * Fase 1 — genera las paginas ESTATICAS a partir del export.
 *
 * Por que un script y no ir pagina por pagina a mano: la migracion tiene que ser
 * exacta. Un transformador determinista aplica la misma regla a las 17 paginas y
 * no se cansa en la numero 12. Ademas es reejecutable: si aparece un fallo en la
 * transformacion, se corrige aqui y se regeneran todas.
 *
 * De cada pagina se extrae el cuerpo (entre </nav> y <footer>), porque el nav y
 * el footer ya son componentes compartidos.
 *
 *   node scripts/generar-paginas.mjs
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { RUTAS, transformar, leerHead, decodificar } from './lib/transformar.mjs';

const RAIZ = path.resolve(import.meta.dirname, '..');
const EXPORT = '/Users/senavia/Downloads/Webflow Pergola Plus Florida';
const PAGES = path.join(RAIZ, 'src/pages');

/** Ruta del sitio -> archivo .astro que hay que crear. */
function destino(ruta) {
  if (ruta === '/') return 'index.astro';
  if (ruta === '/404') return '404.astro';
  return ruta.replace(/^\//, '') + '.astro';
}

/**
 * Cuerpo de la pagina: lo que hay entre el cierre del <nav> y el <footer>.
 * En el export las 404 no llevan nav, asi que se cae al <body>.
 */
function extraerCuerpo(html, archivo) {
  const finNav = html.indexOf('</nav>\n  <');
  const iniFooter = html.lastIndexOf('<footer');
  if (finNav > 0 && iniFooter > finNav) {
    return html.slice(finNav + '</nav>'.length, iniFooter);
  }
  // Sin nav ni footer (404.html): se coge el <body> entero menos los scripts.
  const b = html.indexOf('<body>');
  const e = html.indexOf('<script', b);
  if (b < 0) throw new Error(`no encuentro el cuerpo de ${archivo}`);
  return html.slice(b + '<body>'.length, e > 0 ? e : html.indexOf('</body>'));
}

const generadas = [];
const avisos = [];

for (const [archivo, ruta] of Object.entries(RUTAS)) {
  const html = await fs.readFile(path.join(EXPORT, archivo), 'utf8');
  const head = leerHead(html);

  let cuerpo = extraerCuerpo(html, archivo);
  cuerpo = transformar(cuerpo);

  // Los data-w-id del cuerpo tienen que sobrevivir intactos: son las
  // animaciones de entrada de esta pagina.
  const idsOrig = new Set([...extraerCuerpo(html, archivo).matchAll(/data-w-id="([^"]+)"/g)].map((m) => m[1]));
  const idsNew = new Set([...cuerpo.matchAll(/data-w-id="([^"]+)"/g)].map((m) => m[1]));
  const perdidos = [...idsOrig].filter((x) => !idsNew.has(x));
  if (perdidos.length) avisos.push(`${archivo}: ${perdidos.length} data-w-id perdidos`);

  const props = [
    `title=${JSON.stringify(decodificar(head.title) ?? 'Pergola Plus Florida')}`,
    head.description ? `description=${JSON.stringify(decodificar(head.description))}` : null,
    head.ogImage ? `ogImage=${JSON.stringify(head.ogImage)}` : null,
    head.pageStyles ? `pageStyles={PAGE_STYLES}` : null,
    // IX2 lo necesita para cargar las interacciones de ESTA pagina.
    head.wfPage ? `wfPage=${JSON.stringify(head.wfPage)}` : null,
    head.wfSite ? `wfSite=${JSON.stringify(head.wfSite)}` : null,
  ].filter(Boolean).join('\n  ');

  // El bloque anti-FOUC va como constante para no pelearse con las comillas.
  const estilos = head.pageStyles
    ? `\nconst PAGE_STYLES = ${JSON.stringify(head.pageStyles)};\n`
    : '';

  // Profundidad de la pagina dentro de src/pages/, para el import relativo.
  //   /about-us/brands  -> src/pages/about-us/brands.astro  -> ../../layouts/
  const prof = ruta === '/' || ruta === '/404' ? 0 : ruta.split('/').length - 2;
  const rel = '../'.repeat(prof + 1) + 'layouts/BaseLayout.astro';

  const salida = `---
import BaseLayout from '${rel}';
${estilos}
// Migrado de ${archivo} por scripts/generar-paginas.mjs — NO editar a mano.
// El nav y el footer los pone BaseLayout: aqui va solo el cuerpo.
---

<BaseLayout
  ${props}
>
${cuerpo.replace(/^\n+|\n+$/g, '')}
</BaseLayout>
`;

  const dest = path.join(PAGES, destino(ruta));
  await fs.mkdir(path.dirname(dest), { recursive: true });
  await fs.writeFile(dest, salida);
  generadas.push({ archivo, ruta, dest: path.relative(RAIZ, dest), lineas: salida.split('\n').length, ids: idsNew.size, fouc: !!head.pageStyles });
}

console.log('Fase 1 — paginas estaticas generadas\n');
for (const g of generadas)
  console.log(`  ${g.ruta.padEnd(34)} ${String(g.lineas).padStart(4)} lineas  data-w-id ${String(g.ids).padStart(3)}${g.fouc ? '  [anti-FOUC]' : ''}`);
console.log(`\n  ${generadas.length} paginas`);
if (avisos.length) { console.error('\n  !! AVISOS:'); for (const a of avisos) console.error('     ' + a); process.exit(1); }
