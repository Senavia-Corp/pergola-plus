#!/usr/bin/env node
/**
 * Junta las corridas de Lighthouse de todas las fases en un CSV (todas las corridas,
 * no solo medianas) y saca la tabla de medianas por fase para el informe.
 *
 *     node scripts/perf/antes-despues.mjs implementation-reports/PERF-100-2026-10
 */
import fs from 'node:fs/promises';
import path from 'node:path';

const RAIZ = process.argv[2];
const fases = (await fs.readdir(RAIZ, { withFileTypes: true })).filter((d) => d.isDirectory() && /^\d\d-/.test(d.name)).map((d) => d.name).sort();
const filas = [];
let cab = null;
for (const fase of fases) {
  const f = path.join(RAIZ, fase, 'lighthouse-corridas.csv');
  const txt = await fs.readFile(f, 'utf8').catch(() => null);
  if (!txt) continue;
  const [c, ...resto] = txt.trim().split('\n');
  cab ??= 'fase,' + c;
  for (const l of resto) filas.push(`${fase},${l}`);
}
await fs.writeFile(path.join(RAIZ, '02-ANTES-DESPUES-LIGHTHOUSE.csv'), [cab, ...filas].join('\n') + '\n');
console.log(`${filas.length} corridas de ${fases.length} fases -> 02-ANTES-DESPUES-LIGHTHOUSE.csv`);

// Tabla de medianas por plantilla y fase (perf movil / escritorio).
const med = {};
for (const fase of fases) {
  const txt = await fs.readFile(path.join(RAIZ, fase, 'lighthouse-medianas.csv'), 'utf8').catch(() => null);
  if (!txt) continue;
  for (const l of txt.trim().split('\n').slice(1)) {
    const c = l.split(','); (med[c[0] + '|' + c[1]] ??= {})[fase] = { perf: c[3], runs: c[4], lcp: c[10], a11y: c[5], cls: c[12] };
  }
}
const conFase = fases.filter((f) => Object.values(med).some((m) => m[f]));
console.log('\nplantilla|dev'.padEnd(28) + conFase.map((f) => f.padEnd(22)).join(''));
for (const k of Object.keys(med).sort()) console.log(k.padEnd(28) + conFase.map((f) => (med[k][f] ? `${med[k][f].perf} (${med[k][f].runs}) ${med[k][f].lcp}ms` : '-').padEnd(22)).join(''));
