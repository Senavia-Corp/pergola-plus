#!/usr/bin/env node
/**
 * Fase 0.5 — deja las imagenes servibles en local para la Fase 1.
 *
 * POR QUE EXISTE ESTE PASO
 * El manifest separa diseno de contenido pensando en Sanity, pero la Fase 1 tiene
 * que renderizar el sitio ANTES de que Sanity exista. Y el HTML original apunta a
 * rutas fijas:
 *
 *   <img src="images/foo.avif"
 *        srcset="images/foo-p-500.avif 500w, images/foo-p-800.avif 800w, ...">
 *
 * Si solo se copian los assets de "diseno", faltan 55 archivos y los srcset se
 * rompen. Asi que en local se sirve TODO:
 *
 *   public/images/   <- images/ del export, VERBATIM y COMPLETO (127 archivos,
 *                       variantes -p-NNN incluidas) + el checkmark del CDN.
 *                       Las paginas estaticas migran con un cambio de ruta
 *                       trivial: "images/x" -> "/images/x". Sin helper.
 *
 *   public/cms-img/  <- las 472 imagenes del CMS, con la estructura del staging.
 *                       Provisional: en la Fase 3 las sirve el CDN de Sanity y
 *                       esta carpeta se borra. Va en .gitignore.
 *
 *   src/lib/img-map.json <- URL de Webflow -> { src, alt }. Lo consume
 *                       src/lib/img.ts, que es lo que usan las plantillas de CMS.
 *
 * Las variantes -p-NNN siguen SIN subirse a Sanity (ahi las genera el CDN); solo
 * se sirven en local para que el srcset de la Fase 1 sea identico al original.
 *
 *   node scripts/instalar-assets.mjs
 */
import fs from 'node:fs/promises';
import path from 'node:path';

const RAIZ = path.resolve(import.meta.dirname, '..');
const EXPORT = '/Users/senavia/Downloads/Webflow Pergola Plus Florida';
const STAGING = path.join(RAIZ, 'assets-migracion');

async function copiarDir(desde, hasta) {
  await fs.mkdir(hasta, { recursive: true });
  let n = 0;
  for (const e of await fs.readdir(desde, { withFileTypes: true })) {
    if (e.name.startsWith('.')) continue;
    const a = path.join(desde, e.name), b = path.join(hasta, e.name);
    if (e.isDirectory()) n += await copiarDir(a, b);
    else { await fs.copyFile(a, b); n++; }
  }
  return n;
}

console.log('Fase 0.5 — instalacion de assets en local\n');

// 1. images/ del export, completo y verbatim ---------------------------------
const destImg = path.join(RAIZ, 'public/images');
await fs.rm(destImg, { recursive: true, force: true });
const nImg = await copiarDir(path.join(EXPORT, 'images'), destImg);

// 2. el checkmark que el CSS pedia al CDN de Webflow --------------------------
let nExtra = 0;
for (const f of await fs.readdir(path.join(STAGING, 'design'))) {
  if (f.includes('custom-checkbox-checkmark')) {
    await fs.copyFile(path.join(STAGING, 'design', f), path.join(destImg, f));
    nExtra++;
  }
}

// 2b. placeholders que el HTML pedia a CDNs externos --------------------------
const { PLACEHOLDERS } = await import('./lib/transformar.mjs');
let nPh = 0;
for (const [remoto, local] of Object.entries(PLACEHOLDERS)) {
  const dest = path.join(destImg, path.basename(local));
  try {
    const r = await fetch(remoto);
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    await fs.writeFile(dest, Buffer.from(await r.arrayBuffer()));
    nPh++;
  } catch (e) {
    console.error(`  !! no se pudo bajar el placeholder ${remoto}: ${e.message}`);
    process.exitCode = 1;
  }
}

// 2c. videos ------------------------------------------------------------------
// 47 MB. NO van a git (.gitignore), pero el hero de la home los necesita para
// renderizar. En la Fase 2 se deciden a Vercel Blob o assets de Sanity.
const destVid = path.join(RAIZ, 'public/videos');
await fs.rm(destVid, { recursive: true, force: true });
const nVid = await copiarDir(path.join(EXPORT, 'videos'), destVid);

// 3. imagenes del CMS, provisional hasta Sanity -------------------------------
const destCms = path.join(RAIZ, 'public/cms-img');
await fs.rm(destCms, { recursive: true, force: true });
const nCms = await copiarDir(path.join(STAGING, 'content'), destCms);

// 4. mapa URL de Webflow -> ruta local ----------------------------------------
const manifest = JSON.parse(await fs.readFile(path.join(STAGING, 'manifest.json'), 'utf8'));
const mapa = {};
for (const a of manifest.assets) {
  const src = a.assetClass === 'design'
    ? a.publicPath
    : '/' + path.join('cms-img', path.relative('content', a.file)).split(path.sep).join('/');
  for (const u of a.sourceUrls) {
    mapa[u] = { src, alt: a.alt, altDerivado: a.altDerivado, width: a.width, height: a.height };
  }
}
const destMapa = path.join(RAIZ, 'src/lib/img-map.json');
await fs.mkdir(path.dirname(destMapa), { recursive: true });
await fs.writeFile(destMapa, JSON.stringify(mapa, null, 0));

// 5. comprobar que TODO lo que pide el HTML original existe --------------------
const htmls = [];
for (const d of ['', 'about-us', 'contact-us', 'resources']) {
  const dir = path.join(EXPORT, d);
  for (const f of await fs.readdir(dir)) if (f.endsWith('.html')) htmls.push(path.join(dir, f));
}
const pide = new Set();
for (const f of htmls) {
  const t = await fs.readFile(f, 'utf8');
  for (const m of t.matchAll(/(?:src|srcset)\s*=\s*["']([^"']+)["']/g))
    for (const parte of m[1].split(',')) {
      const u = parte.trim().split(/\s+/)[0];
      if (u.includes('images/') && !/^https?:/.test(u)) pide.add(path.basename(u));
    }
}
const hay = new Set(await fs.readdir(destImg));
const faltan = [...pide].filter((n) => !hay.has(n)).sort();

console.log(`  public/images/    ${nImg + nExtra + nPh} archivos  (${nImg} del export + ${nExtra + nPh} externos internalizados)`);
console.log(`  public/videos/    ${nVid} archivos  (provisional: no van a git)`);
console.log(`  public/cms-img/   ${nCms} archivos`);
console.log(`  src/lib/img-map.json  ${Object.keys(mapa).length} urls mapeadas`);
console.log(`\n  el HTML original pide ${pide.size} imagenes de images/  ->  faltan ${faltan.length}`);
for (const n of faltan) console.log(`     !! ${n}`);
if (faltan.length) process.exitCode = 1;
