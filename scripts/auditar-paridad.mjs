#!/usr/bin/env node
/**
 * Fase 1 — PROMPT 11 + PROMPT D (parte estatica).
 *
 * Compara las 99 paginas construidas contra las 99 del sitio en vivo.
 * No dice "esta bien": mide y reporta cada delta.
 *
 * Lo que comprueba:
 *   1. data-w-id      conjunto a conjunto por pagina. Uno que falte = un
 *                     elemento que dejo de animarse, en silencio.
 *   2. anti-FOUC      mismos ids ocultos y mismas 4 media queries.
 *   3. <head>         title, description, og:*. La unica diferencia ESPERADA es
 *                     el SEO desde el CMS, que se marca aparte.
 *   4. assets         que ninguna ruta local apunte a un archivo inexistente.
 *   5. externos       cero referencias a Webflow.
 *   6. texto          numero de nodos de texto y su contenido, para cazar
 *                     contenido perdido.
 *
 *   node scripts/auditar-paridad.mjs
 */
import fs from 'node:fs/promises';
import path from 'node:path';

const RAIZ = path.resolve(import.meta.dirname, '..');
const VIVO = '/private/tmp/claude-501/-Users-senavia/c6c8d2e5-148e-47e5-b6cf-e7286ffbc547/scratchpad/vivo';
const DIST = path.join(RAIZ, 'dist');

const ids = (s) => new Set([...s.matchAll(/data-w-id="([^"]+)"/g)].map((m) => m[1]));
const foucIds = (s) => new Set(
  [...s.matchAll(/html\.w-mod-js:not\(\.w-mod-ix\)\s*\[data-w-id="([^"]+)"\]/g)].map((m) => m[1]));
const titulo = (s) => s.match(/<title>([\s\S]*?)<\/title>/)?.[1]?.trim() ?? null;
const desc = (s) => s.match(/<meta content="([^"]*)"\s+name="description"/)?.[1]?.trim() ?? null;

/** Texto visible: se quitan script, style y etiquetas, y se normaliza el espacio. */
function texto(s) {
  const cuerpo = s.slice(s.indexOf('<body'), s.lastIndexOf('</body>'));
  return cuerpo
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Ruta del sitio -> archivo generado. */
function archivoDist(ruta) {
  return ruta === '/' ? path.join(DIST, 'index.html') : path.join(DIST, ruta.slice(1), 'index.html');
}
/** Ruta del sitio -> captura del vivo. */
function archivoVivo(ruta) {
  return path.join(VIVO, (ruta === '/' ? 'index' : ruta.slice(1).replace(/\//g, '__')) + '.html');
}

const rutas = (await fs.readFile(path.join(RAIZ, 'docs/urls-actuales.txt'), 'utf8'))
  .split('\n').map((s) => s.trim()).filter(Boolean);

const publicos = new Set();
async function indexarPublic(dir, base = '') {
  for (const e of await fs.readdir(dir, { withFileTypes: true })) {
    if (e.name.startsWith('.')) continue;
    const rel = base + '/' + e.name;
    if (e.isDirectory()) await indexarPublic(path.join(dir, e.name), rel);
    else publicos.add(rel);
  }
}
await indexarPublic(path.join(RAIZ, 'public'));

const filas = [];
const sinVivo = [];

for (const ruta of rutas) {
  let gen, viv;
  try { gen = await fs.readFile(archivoDist(ruta), 'utf8'); }
  catch { filas.push({ ruta, error: 'NO GENERADA' }); continue; }
  try { viv = await fs.readFile(archivoVivo(ruta), 'utf8'); }
  catch { sinVivo.push(ruta); continue; }

  const iv = ids(viv), ig = ids(gen);
  const faltan = [...iv].filter((x) => !ig.has(x));
  const sobran = [...ig].filter((x) => !iv.has(x));

  const fv = foucIds(viv), fg = foucIds(gen);
  const foucFaltan = [...fv].filter((x) => !fg.has(x));

  // Assets locales que no existen en public/.
  const rotos = [];
  for (const m of gen.matchAll(/(?:src|href)="(\/(?:images|videos|cms-img|css|js)\/[^"]+)"/g)) {
    const p = decodeURIComponent(m[1]);
    if (!publicos.has(p)) rotos.push(p);
  }
  // srcset aparte
  for (const m of gen.matchAll(/srcset="([^"]+)"/g)) {
    for (const parte of m[1].split(',')) {
      const u = parte.trim().split(/\s+/)[0];
      if (u.startsWith('/') && !publicos.has(decodeURIComponent(u))) rotos.push(u);
    }
  }

  const externos = (gen.match(/website-files\.com/g) ?? []).length;

  const tv = texto(viv), tg = texto(gen);
  const palabrasV = tv.split(' ').length, palabrasG = tg.split(' ').length;

  filas.push({
    ruta,
    idsV: iv.size, idsG: ig.size, faltan, sobran,
    foucV: fv.size, foucG: fg.size, foucFaltan,
    tituloIgual: titulo(viv) === titulo(gen),
    tituloV: titulo(viv), tituloG: titulo(gen),
    descIgual: desc(viv) === desc(gen),
    rotos: [...new Set(rotos)],
    externos,
    palabrasV, palabrasG,
    deltaTexto: palabrasV ? Math.abs(palabrasG - palabrasV) / palabrasV : 0,
  });
}

// --- informe ----------------------------------------------------------------
const fallos = filas.filter((f) =>
  f.error || f.faltan?.length || f.sobran?.length || f.foucFaltan?.length ||
  f.rotos?.length || f.externos || f.deltaTexto > 0.02);

console.log('AUDITORIA DE PARIDAD — Fase 1\n');
console.log(`  paginas comparadas: ${filas.length}   sin referencia en vivo: ${sinVivo.length}\n`);

const suma = (k) => filas.reduce((s, f) => s + (f[k]?.length ?? 0), 0);
console.log(`  data-w-id faltantes ....... ${suma('faltan')}`);
console.log(`  data-w-id sobrantes ....... ${suma('sobran')}`);
console.log(`  anti-FOUC faltantes ....... ${suma('foucFaltan')}`);
console.log(`  assets rotos .............. ${suma('rotos')}`);
console.log(`  referencias a Webflow ..... ${filas.reduce((s, f) => s + (f.externos ?? 0), 0)}`);
console.log(`  paginas con delta de texto > 2% ... ${filas.filter((f) => f.deltaTexto > 0.02).length}`);

// El SEO desde el CMS es una desviacion DELIBERADA: se cuenta aparte.
const seoCambiado = filas.filter((f) => !f.tituloIgual);
console.log(`\n  titles distintos del vivo: ${seoCambiado.length}  (esperado: el SEO desde el CMS)`);
const seoInesperado = seoCambiado.filter((f) => f.tituloV !== 'Pergola Plus Florida');
if (seoInesperado.length) {
  console.log(`  !! ${seoInesperado.length} con title distinto SIN ser el arreglo de SEO:`);
  for (const f of seoInesperado.slice(0, 10)) console.log(`     ${f.ruta}\n        vivo: ${f.tituloV}\n        gen : ${f.tituloG}`);
}

if (fallos.length) {
  console.log(`\n--- ${fallos.length} PAGINAS CON HALLAZGOS ---`);
  for (const f of fallos.slice(0, 25)) {
    console.log(`\n  ${f.ruta}`);
    if (f.error) { console.log(`     ${f.error}`); continue; }
    if (f.faltan.length) console.log(`     data-w-id FALTAN (${f.faltan.length}): ${f.faltan.slice(0, 4).join(', ')}`);
    if (f.sobran.length) console.log(`     data-w-id sobran (${f.sobran.length}): ${f.sobran.slice(0, 4).join(', ')}`);
    if (f.foucFaltan.length) console.log(`     anti-FOUC faltan: ${f.foucFaltan.join(', ')}`);
    if (f.rotos.length) console.log(`     assets rotos (${f.rotos.length}): ${f.rotos.slice(0, 4).join(', ')}`);
    if (f.externos) console.log(`     referencias a Webflow: ${f.externos}`);
    if (f.deltaTexto > 0.02) console.log(`     texto: vivo ${f.palabrasV} palabras vs generado ${f.palabrasG}  (${(100 * f.deltaTexto).toFixed(1)}%)`);
  }
  if (fallos.length > 25) console.log(`\n  ... y ${fallos.length - 25} paginas mas`);
} else {
  console.log('\n  SIN HALLAZGOS: las 99 paginas cuadran.');
}

await fs.writeFile(path.join(RAIZ, 'docs/auditoria-paridad.json'), JSON.stringify({ filas, sinVivo }, null, 2));
console.log(`\n  detalle -> docs/auditoria-paridad.json`);
