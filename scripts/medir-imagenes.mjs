#!/usr/bin/env node
/**
 * Mide todas las imagenes de public/ y escribe src/lib/img-dim.json.
 *
 *     node scripts/medir-imagenes.mjs
 *
 * POR QUE. El markup que exporto Webflow no trae `width` ni `height` en NINGUNA
 * imagen: 6853 <img> en las 107 paginas. Sin esos dos atributos el navegador no sabe
 * cuanto hueco reservar hasta que descarga el archivo, asi que el contenido salta
 * mientras cargan. Eso es CLS, y CLS es una de las tres Core Web Vitals.
 *
 * No hay que adivinar nada: los archivos estan en public/, asi que se miden.
 *
 * La salida se versiona (es texto, ~30 KB) porque el transformador la lee en tiempo de
 * GENERACION y el build de Vercel no ejecuta este script. Regenerarla es idempotente:
 * mismas imagenes, mismo JSON.
 *
 * Los SVG sin tamano intrinseco se resuelven por su viewBox, que es de donde sale la
 * relacion de aspecto que aplicaria el navegador. Si un SVG no tiene ni lo uno ni lo
 * otro se queda fuera y se avisa: es mejor que inventarle un tamano.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const RAIZ = path.resolve(import.meta.dirname, '..');
const PUBLIC = path.join(RAIZ, 'public');
const SALIDA = path.join(RAIZ, 'src/lib/img-dim.json');

// Las carpetas que sirven imagenes. `videos` no: un <video> no lleva width/height
// util aqui y su poster ya vive en images/.
const CARPETAS = ['images', 'cms-img'];
const EXT = /\.(avif|webp|png|jpe?g|gif|svg)$/i;

async function listar(dir, base) {
  const salida = [];
  for (const e of await fs.readdir(dir, { withFileTypes: true }).catch(() => [])) {
    if (e.name.startsWith('.')) continue;
    const abs = path.join(dir, e.name);
    const rel = `${base}/${e.name}`;
    if (e.isDirectory()) salida.push(...await listar(abs, rel));
    else if (EXT.test(e.name)) salida.push({ abs, rel });
  }
  return salida;
}

/** Ancho y alto de un SVG sin tamano intrinseco, sacados del viewBox. */
async function porViewBox(abs) {
  const txt = await fs.readFile(abs, 'utf8').catch(() => '');
  const vb = txt.match(/viewBox\s*=\s*["']\s*[-\d.]+[\s,]+[-\d.]+[\s,]+([\d.]+)[\s,]+([\d.]+)/i);
  if (!vb) return null;
  const w = Math.round(Number(vb[1])), h = Math.round(Number(vb[2]));
  return w > 0 && h > 0 ? [w, h] : null;
}

const mapa = {};
const sinMedida = [];
let svgPorViewBox = 0;

for (const carpeta of CARPETAS) {
  for (const { abs, rel } of await listar(path.join(PUBLIC, carpeta), `/${carpeta}`)) {
    let dim = null;
    try {
      const m = await sharp(abs).metadata();
      if (m.width && m.height) dim = [m.width, m.height];
    } catch { /* sharp no puede: se intenta por viewBox */ }

    if (!dim && abs.endsWith('.svg')) {
      dim = await porViewBox(abs);
      if (dim) svgPorViewBox++;
    }
    if (dim) mapa[rel] = dim;
    else sinMedida.push(rel);
  }
}

// Orden estable: el JSON se versiona, asi que dos ejecuciones tienen que dar el mismo
// fichero byte a byte o el diff se llena de ruido.
const ordenado = Object.fromEntries(Object.keys(mapa).sort().map((k) => [k, mapa[k]]));
await fs.writeFile(SALIDA, JSON.stringify(ordenado, null, 0) + '\n', 'utf8');

console.log(`  ${Object.keys(ordenado).length} imagenes medidas -> src/lib/img-dim.json`);
if (svgPorViewBox) console.log(`  ${svgPorViewBox} SVG resueltos por su viewBox`);
if (sinMedida.length) {
  console.log(`  AVISO  ${sinMedida.length} sin medida (se quedan sin width/height):`);
  for (const s of sinMedida.slice(0, 10)) console.log(`         ${s}`);
  if (sinMedida.length > 10) console.log(`         ... y ${sinMedida.length - 10} mas`);
}
