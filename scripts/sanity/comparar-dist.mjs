/**
 * Paridad del corte de fuente: compara dos builds fichero a fichero.
 *
 *     node scripts/sanity/comparar-dist.mjs <dist-referencia> <dist-actual> [--rutas prefijo,prefijo]
 *
 * <dist-*> es la carpeta `dist` (con client/). Para cada fichero de las dos: identico
 * byte a byte, distinto o solo en un lado. De los HTML distintos enseña el primer punto
 * en que difieren, con contexto. Sale con 1 si hay alguna diferencia en lo comparado.
 * `--rutas` limita los HTML a las rutas que empiezan por esos prefijos (las de la
 * sub-parada); el resto de ficheros se compara siempre.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';

const [refDir, actDir] = process.argv.slice(2);
if (!refDir || !actDir) { console.error('uso: comparar-dist.mjs <dist-referencia> <dist-actual> [--rutas a,b]'); process.exit(2); }
const iR = process.argv.indexOf('--rutas');
const prefijos = iR > 0 ? process.argv[iR + 1].split(',') : null;

async function ficheros(raiz) {
  const out = new Map();
  const andar = async (d) => {
    for (const e of await fs.readdir(d, { withFileTypes: true })) {
      const f = path.join(d, e.name);
      if (e.isDirectory()) await andar(f); else out.set(path.relative(raiz, f).normalize('NFC'), f);
    }
  };
  await andar(path.join(raiz, 'client'));
  return out;
}
const ruta = (rel) => '/' + rel.replace(/(^|\/)index\.html$/, '').replace(/\.html$/, '');
const cuenta = (rel) => !rel.endsWith('.html') || !prefijos || prefijos.some((p) => ruta(rel).startsWith(p));

const A = await ficheros(refDir), B = await ficheros(actDir);
const res = { identicos: 0, distintos: [], soloReferencia: [], soloActual: [] };
const hash = async (f) => crypto.createHash('sha256').update(await fs.readFile(f)).digest('hex');
for (const [rel, f] of A) {
  if (!cuenta(rel)) continue;
  if (!B.has(rel)) { res.soloReferencia.push(rel); continue; }
  if ((await hash(f)) === (await hash(B.get(rel)))) res.identicos++; else res.distintos.push(rel);
}
for (const rel of B.keys()) if (!A.has(rel) && cuenta(rel)) res.soloActual.push(rel);

const html = res.distintos.filter((r) => r.endsWith('.html'));
console.log(JSON.stringify({
  comparados: res.identicos + res.distintos.length,
  identicos: res.identicos,
  distintos: res.distintos.length,
  htmlDistintos: html.length,
  otrosDistintos: res.distintos.filter((r) => !r.endsWith('.html')),
  soloReferencia: res.soloReferencia,
  soloActual: res.soloActual,
}, null, 1));
for (const rel of html.slice(0, 12)) {
  const a = await fs.readFile(A.get(rel), 'utf8'), b = await fs.readFile(B.get(rel), 'utf8');
  let k = 0; while (k < a.length && a[k] === b[k]) k++;
  console.log(`  ${ruta(rel)} difiere en ${k}\n    ref: …${a.slice(Math.max(0, k - 80), k + 80)}\n    act: …${b.slice(Math.max(0, k - 80), k + 80)}`);
}
process.exit(res.distintos.length || res.soloReferencia.length || res.soloActual.length ? 1 : 0);
