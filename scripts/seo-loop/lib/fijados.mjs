/**
 * Los ficheros fijados por SHA-256 (especificacion §3) y su comprobacion contra docs/seo-loop/HASHES.txt.
 *
 *     node scripts/seo-loop/lib/fijados.mjs        # imprime las lineas «sha256  ruta» actuales
 *
 * HASHES.txt: bloques de lineas «<sha256>  <ruta>». Un bloque cuenta solo si lo abre una linea
 * «# FIRMA: Sebastian <fecha> …» (la escribe el loop cuando Sebastian firma en el chat). Para cada
 * ruta vale la ULTIMA linea de un bloque firmado. «package.json#scripts.check» es el sha256 del texto
 * del script `check` (las 26 puertas: ni quitar ni debilitar).
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const RAIZ = path.resolve(import.meta.dirname, '../../..');
const sha = (buf) => crypto.createHash('sha256').update(buf).digest('hex');

/** Rutas fijadas: los JSON del loop, el registro, las lineas base, el juez, sus puertas y sus datos (.jsonld), y las 26 puertas del repo. */
export function fijados() {
  const pkg = JSON.parse(fs.readFileSync(path.join(RAIZ, 'package.json'), 'utf8'));
  const puertasRepo = pkg.scripts.check.split('&&').map((s) => s.trim().replace(/^npm run /, '')).filter((s) => s !== 'build')
    .map((s) => pkg.scripts[s]?.match(/node (\S+\.mjs)/)?.[1]).filter(Boolean);
  const loop = fs.readdirSync(path.join(RAIZ, 'scripts/seo-loop'), { recursive: true }).filter((f) => /\.(mjs|jsonld)$/.test(f)).map((f) => `scripts/seo-loop/${f}`); // .jsonld: el vocabulario de J7
  const base = fs.readdirSync(path.join(RAIZ, 'docs/seo-loop/linea-base')).map((f) => `docs/seo-loop/linea-base/${f}`);
  return [
    'docs/seo-loop/01-REGISTRO-PETICIONES-CLIENTE.md', 'docs/seo-loop/02-VACIOS-PERMITIDOS.json',
    'docs/seo-loop/04-MAPA-KEYWORDS.json', 'docs/seo-loop/glosario-es-florida.json', 'docs/seo-loop/RELEASE.json',
    ...base.sort(), ...loop.sort(), ...[...new Set(puertasRepo)].sort(), 'package.json#scripts.check',
  ];
}

export function hashDe(ruta) {
  if (ruta === 'package.json#scripts.check') return sha(JSON.parse(fs.readFileSync(path.join(RAIZ, 'package.json'), 'utf8')).scripts.check);
  return sha(fs.readFileSync(path.join(RAIZ, ruta)));
}

/** Fallos de integridad frente a HASHES.txt (vacio = todo coincide con lo firmado). */
export function comprobar() {
  const f = path.join(RAIZ, 'docs/seo-loop/HASHES.txt');
  if (!fs.existsSync(f)) return ['no existe docs/seo-loop/HASHES.txt'];
  const firmados = new Map();
  let firmado = false, bloques = 0;
  for (const l of fs.readFileSync(f, 'utf8').split('\n')) {
    if (/^# FIRMA: Sebastian \d{4}-\d{2}-\d{2}/.test(l)) { firmado = true; bloques++; continue; }
    if (/^# BLOQUE SIN FIRMAR/.test(l)) { firmado = false; continue; }
    const m = l.match(/^([0-9a-f]{64})  (\S+)$/);
    if (m && firmado) firmados.set(m[2], m[1]);
  }
  if (!bloques) return ['HASHES.txt no tiene ningun bloque firmado por Sebastian: el loop no pasa de la fase 0'];
  const fallos = [];
  for (const r of fijados()) {
    if (!firmados.has(r)) { fallos.push(`${r}: fijado y sin hash firmado`); continue; }
    let h; try { h = hashDe(r); } catch { fallos.push(`${r}: no existe`); continue; }
    if (h !== firmados.get(r)) fallos.push(`${r}: cambio sin firma (sha256 ${h.slice(0, 12)}…, firmado ${firmados.get(r).slice(0, 12)}…)`);
  }
  return fallos;
}

if (import.meta.url === `file://${process.argv[1]}`) for (const r of fijados()) console.log(`${hashDe(r)}  ${r}`);
