#!/usr/bin/env node
/**
 * Derivados responsive de las PORTADAS del hero de las fichas (ciudades, condados y
 * productos): el <img class="image-4"> de .img-bg-hero-product.
 *
 *     node scripts/derivar-portadas.mjs
 *
 * POR QUE. Esa imagen es el elemento LCP de 76 paginas (38 EN + 38 ES) y venia del
 * CMS a 1450x967 y 200–580 KB, pintada a 412x350 en movil. Lighthouse móvil en una
 * ciudad: LCP 7,6 s. El paso 4n de transformar.mjs le pone srcset con estos
 * derivados (y le quita el loading="lazy", que en el LCP es lo peor que puede llevar).
 *
 * Escribe junto al master: <nombre>-640.avif, -960.avif, -1280.avif. El master
 * sigue siendo el `src` (es el que mide img-dim.json). Idempotente: no reescribe lo
 * que ya existe. Los masters NO se tocan: su hash lo fija el manifest de la migracion.
 *
 * Las portadas se descubren leyendo los fragmentos, no una lista a mano: si una
 * ficha cambia de portada, basta con volver a ejecutar esto.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { PORTADAS_ANCHOS } from './lib/transformar.mjs';

const RAIZ = path.resolve(import.meta.dirname, '..');
const FRAGMENTOS = path.join(RAIZ, 'src/contenido-migrado');
const RX = /<div class="img-bg-hero-product"><img[^>]*\ssrc="(\/cms-img\/[^"]+\.avif)"/g;

const portadas = new Set();
for (const rel of await fs.readdir(FRAGMENTOS, { recursive: true })) {
  if (!rel.endsWith('.html')) continue;
  const html = await fs.readFile(path.join(FRAGMENTOS, rel), 'utf8');
  for (const m of html.matchAll(RX)) portadas.add(m[1]);
}

let escritos = 0, bytes = 0;
for (const publica of [...portadas].sort()) {
  const master = path.join(RAIZ, 'public', publica.slice(1));
  for (const w of PORTADAS_ANCHOS) {
    const destino = master.replace(/\.avif$/, `-${w}.avif`);
    if (await fs.stat(destino).catch(() => null)) continue;
    const b = await sharp(master).resize(w).avif({ quality: 55, effort: 5 }).toBuffer();
    await fs.writeFile(destino, b);
    escritos++; bytes += b.length;
  }
}
console.log(`  ${portadas.size} portadas · ${escritos} derivados nuevos (${(bytes / 1024).toFixed(0)} KB)`);
console.log('  ahora: node scripts/generar-paginas.mjs && node scripts/generar-detalle.mjs');
