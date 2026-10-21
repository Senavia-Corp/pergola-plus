#!/usr/bin/env node
/**
 * El dataset contra el esquema del Studio (studio/schemas): las mismas reglas que ve el
 * editor al publicar (obligatorios, Compare sin tarjeta, ritmo de la ficha…).
 *
 *     node scripts/sanity/esquema.mjs
 *
 *   1. `sanity schema validate`: el esquema en si, 0 errores.
 *   2. `sanity documents validate`: todos los documentos publicados, 0 errores. Los
 *      avisos (p. ej. descripcion SEO vacia) se cuentan por regla y no fallan.
 *
 * Necesita las dependencias de studio/ (npm ci alli), red hasta la API de Sanity y una
 * sesion del CLI (`sanity login`) o SANITY_AUTH_TOKEN de lectura; tras un proxy, Node
 * necesita NODE_USE_ENV_PROXY=1. Si no puede validar, FALLA: una puerta que no corre no
 * pasa.
 */
import { spawnSync } from 'node:child_process';
import path from 'node:path';

const STUDIO = path.resolve(import.meta.dirname, '../../studio');
const sanity = (args) => spawnSync('npx', ['sanity', ...args], { cwd: STUDIO, encoding: 'utf8', maxBuffer: 256 * 1024 * 1024, timeout: 15 * 60 * 1000 });
const fallos = [];

const s = sanity(['schema', 'validate']);
const errEsquema = (s.stdout + s.stderr).match(/Errors:\s+(\d+) error/)?.[1];
if (s.status !== 0 || errEsquema !== '0') fallos.push(`schema validate: sale con ${s.status}, ${errEsquema ?? '?'} errores\n${(s.stdout + s.stderr).slice(-600)}`);
console.log(`esquema: ${errEsquema ?? '?'} errores`);

const d = sanity(['documents', 'validate', '-y', '--format', 'ndjson']);
const lineas = d.stdout.split('\n').filter((l) => l.startsWith('{'));
if (!lineas.length && d.status !== 0) fallos.push(`documents validate NO CORRIO (sale con ${d.status}): ${d.stderr.slice(-400)}`);
const errores = [], avisos = {};
for (const l of lineas) {
  const x = JSON.parse(l);
  for (const m of x.markers ?? []) {
    const donde = `${x.documentId} ${(m.path ?? []).map((p) => (typeof p === 'object' ? p._key : p)).join('.')}`;
    if (m.level === 'error') errores.push(`${donde}: ${m.message}`);
    else avisos[m.message] = (avisos[m.message] ?? 0) + 1;
  }
}
for (const e of errores) fallos.push(e);
console.log(`documentos: ${lineas.length} con marcas, ${errores.length} errores, ${Object.values(avisos).reduce((a, b) => a + b, 0)} avisos`);
for (const [m, n] of Object.entries(avisos).sort((a, b) => b[1] - a[1])) console.log(`  aviso ×${n}: ${m}`);
for (const f of fallos.slice(0, 40)) console.log(`  FALLO  ${f}`);
console.log(fallos.length ? `\n${fallos.length} fallo(s).` : '\nTodo correcto.');
process.exit(fallos.length ? 1 : 0);
