#!/usr/bin/env node
/**
 * Diff visual pixel a pixel entre dos carpetas de capturas (baseline y actual).
 *
 *     node scripts/perf/diff-visual.mjs <baseline/capturas> <actual/capturas> [informe.md] [umbral=1]
 *
 * Un pixel difiere si algun canal cambia mas de 24/255. Se informa el % por captura y
 * se listan las que superen el umbral (1 % por defecto). Si las medidas difieren, la
 * zona no comun cuenta ENTERA como diferente: un cambio de altura es un cambio de
 * layout. Deja un PNG con la diferencia marcada junto al informe. Sin dependencias
 * nuevas: sharp ya esta en el repo.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const [base, actual, informe = path.join(actual, '..', 'diff-visual.md'), umbralPct = '1'] = process.argv.slice(2);
if (!base || !actual) { console.error('uso: diff-visual.mjs <baseline> <actual> [informe.md] [umbral%]'); process.exit(1); }
const UMBRAL = 24, LIMITE = Number(umbralPct);
const dirDiff = path.join(path.dirname(informe), 'diff-png');
await fs.mkdir(dirDiff, { recursive: true });

const leer = (f) => sharp(f).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const filas = [];
const ficheros = (await fs.readdir(base)).filter((f) => f.endsWith('.png')).sort();
for (const f of ficheros) {
  const fb = path.join(base, f), fa = path.join(actual, f);
  if (!(await fs.stat(fa).catch(() => null))) { filas.push({ f, pct: 100, nota: 'falta en actual' }); continue; }
  const a = await leer(fb), b = await leer(fa);
  const W = Math.max(a.info.width, b.info.width), H = Math.max(a.info.height, b.info.height);
  const w = Math.min(a.info.width, b.info.width), h = Math.min(a.info.height, b.info.height);
  let dif = 0;
  const marca = Buffer.alloc(W * H * 4, 0);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    let d;
    if (x >= w || y >= h) d = true;
    else {
      const ia = (y * a.info.width + x) * 4, ib = (y * b.info.width + x) * 4;
      d = Math.abs(a.data[ia] - b.data[ib]) > UMBRAL || Math.abs(a.data[ia + 1] - b.data[ib + 1]) > UMBRAL || Math.abs(a.data[ia + 2] - b.data[ib + 2]) > UMBRAL;
    }
    const o = (y * W + x) * 4;
    if (d) { dif++; marca[o] = 255; marca[o + 3] = 255; }
    else if (x < w && y < h) { const ib = (y * b.info.width + x) * 4; const g = (b.data[ib] + b.data[ib + 1] + b.data[ib + 2]) / 3; marca[o] = marca[o + 1] = marca[o + 2] = 128 + g / 2; marca[o + 3] = 255; }
  }
  const pct = (dif / (W * H)) * 100;
  const nota = a.info.height !== b.info.height || a.info.width !== b.info.width ? `medidas ${a.info.width}x${a.info.height} -> ${b.info.width}x${b.info.height}` : '';
  filas.push({ f, pct, nota });
  if (pct > LIMITE) await sharp(marca, { raw: { width: W, height: H, channels: 4 } }).png().toFile(path.join(dirDiff, f));
}
const malas = filas.filter((r) => r.pct > LIMITE);
const md = [
  `# Diff visual`, '',
  `Baseline: \`${base}\` · Actual: \`${actual}\` · umbral por canal 24/255 · limite ${LIMITE} %`, '',
  `**${filas.length} capturas, ${malas.length} por encima del ${LIMITE} %.**`, '',
  '| Captura | % distinto | Nota |', '|---|---:|---|',
  ...filas.map((r) => `| ${r.f} | ${r.pct.toFixed(2)} | ${r.nota} |`), '',
  malas.length ? `PNG con la diferencia en rojo: \`${path.relative(path.dirname(informe), dirDiff)}/\`` : 'Ninguna captura supera el limite.', '',
].join('\n');
await fs.writeFile(informe, md);
console.log(md.split('\n').slice(0, 5).join('\n'));
for (const r of malas) console.log(`  ${r.pct.toFixed(2)}%  ${r.f}  ${r.nota}`);
console.log(`-> ${informe}`);
process.exit(malas.length ? 2 : 0);
