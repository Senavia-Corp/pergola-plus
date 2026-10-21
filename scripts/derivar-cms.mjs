#!/usr/bin/env node
/**
 * Derivados responsive de las imagenes del CMS (/cms-img/**) que el sitio PINTA.
 *
 *     npm run build && node scripts/derivar-cms.mjs
 *
 * POR QUE. Las fotos migradas de Webflow llegaron a un solo tamaño (240 de ellas a
 * 1.250 px) y se pintan a 300–420 px en tarjetas, galerias, miniaturas del blog y
 * rejillas de proyecto. Medido (auditoria 18-oct-2026): 6–9 imagenes sobredimensionadas
 * por pagina a 375 px, 1–2 MB por pagina y LCP de 4–5 s en condado y proyecto. Solo
 * /images/cliente/* (optimizar-imagenes-cliente.mjs) y las portadas del hero
 * (derivar-portadas.mjs) tenian srcset.
 *
 * QUE HACE. Lee los HTML construidos —lo que de verdad se sirve, no el manifest— y
 * para cada <img src="/cms-img/..."> raster con master >= 600 px escribe junto a el
 * <nombre>-480.avif, -800.avif y -1200.avif (solo los anchos menores que el master).
 * Idempotente: no reescribe lo que ya existe. Los masters NO se tocan: su hash lo
 * fija el manifest de la migracion. El srcset lo pone `responsivizarImagenes()`
 * (scripts/lib/transformar.mjs) sobre dist/ al terminar el build, y
 * `check:imagenes` exige que el juego este completo y versionado.
 *
 * Los derivados VAN A GIT, igual que public/cms-img: el deploy construye desde un
 * clon y lo que no este versionado no llega (ver .gitignore).
 *
 * Y los logos del marquee de marcas: los 4 PNG de 450x200 se pintan a 50 px de alto
 * (112x50). Se escribe un AVIF a 2x del alto pintado (<nombre>-h100.avif, 225x100),
 * que es lo que necesita una pantalla retina y nada mas. El SVG de Pergola Plus Forte
 * (25 KB de Illustrator, 43 paths ya a una decima de precision) se rasteriza igual:
 * a 50 px de alto, un AVIF de 100 px se ve identico y pesa 3 KB en vez de 25.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { raizHtml } from './lib/dist.mjs';
import { CMS_ANCHOS, CMS_MINIMO } from './lib/transformar.mjs';

const LOGO_ALTO = 100;

const RAIZ = path.resolve(import.meta.dirname, '..');
const PUBLIC = path.join(RAIZ, 'public');
const DIST = await raizHtml();

const existe = (p) => fs.stat(p).then(() => true, () => false);
const esDerivado = (src) => /-(\d{3,4}|h\d+)\.avif$/.test(src);

// 1. Que imagenes del CMS pide el HTML servido.
const masters = new Set();
const logos = new Set();
for (const f of (await fs.readdir(DIST, { recursive: true })).filter((f) => f.endsWith('.html'))) {
  const html = await fs.readFile(path.join(DIST, f), 'utf8');
  for (const m of html.matchAll(/<img\s[^>]*?\bsrc="(\/cms-img\/[^"]+)"[^>]*>/g)) {
    const src = decodeURIComponent(m[1]);
    if (esDerivado(src)) continue;
    if (/fs-marquee-logos_logo/.test(m[0]) || /\/brand-logo-/.test(src)) { logos.add(src); continue; }
    if (/\.(avif|jpe?g|png|webp)$/i.test(src)) masters.add(src);
  }
}

// 2. Derivados de las fotos.
let escritos = 0, bytes = 0, saltadas = 0;
for (const src of [...masters].sort()) {
  const master = path.join(PUBLIC, src.slice(1));
  const meta = await sharp(master).metadata().catch(() => null);
  if (!meta || meta.width < CMS_MINIMO) { saltadas++; continue; }
  for (const w of CMS_ANCHOS) {
    if (w >= meta.width) continue;
    const destino = master.replace(/\.\w+$/, `-${w}.avif`);
    if (await existe(destino)) continue;
    const b = await sharp(master).resize(w).avif({ quality: 55, effort: 5 }).toBuffer();
    await fs.writeFile(destino, b);
    escritos++; bytes += b.length;
  }
}
console.log(`  ${masters.size} fotos del CMS en dist (${saltadas} por debajo de ${CMS_MINIMO} px) · ${escritos} derivados nuevos (${(bytes / 1048576).toFixed(1)} MB)`);

// 3. Logos del marquee.
let logosHechos = 0;
for (const src of [...logos].sort()) {
  const origen = path.join(PUBLIC, src.slice(1));
  if (/\.png$/i.test(src)) {
    const destino = origen.replace(/\.png$/i, `-h${LOGO_ALTO}.avif`);
    if (await existe(destino)) continue;
    await sharp(origen).resize({ height: LOGO_ALTO }).avif({ quality: 70, effort: 6 }).toFile(destino);
    logosHechos++;
  } else if (/\.svg$/i.test(src)) {
    // El SVG de Illustrator (25 KB, 43 paths) ya venia con una decima de precision:
    // redondear no quitaba nada (23 KB). Se rasteriza como los PNG: a 50 px de alto,
    // 100 px de AVIF se ven igual y pesan 3 KB.
    const destino = origen.replace(/\.svg$/i, `-h${LOGO_ALTO}.avif`);
    if (await existe(destino)) continue;
    await sharp(origen, { density: 300 }).resize({ height: LOGO_ALTO }).avif({ quality: 70, effort: 6 }).toFile(destino);
    logosHechos++;
  }
}
console.log(`  ${logos.size} logos del marquee · ${logosHechos} optimizados`);
console.log('  ahora: node scripts/medir-imagenes.mjs && git add public/cms-img && npm run build');
