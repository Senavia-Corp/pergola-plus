#!/usr/bin/env node
/**
 * Prepara un import SEGURO: compara el NDJSON de la migracion con lo publicado en el
 * dataset, documento a documento, y deja en <salida> solo los que cambian.
 *
 *     node scripts/sanity/preparar-import.mjs <migracion.ndjson> <salida.ndjson> --desde <ISO>
 *
 * --desde es la fecha de la ultima migracion importada. Un documento del dataset con
 * `_updatedAt` posterior lo edito alguien en el Studio: NO se incluye (el import con
 * --replace lo pisaria) y se lista para decidir a mano.
 *
 * Igualdad campo a campo como verificar-import.mjs: sin campos de sistema; una imagen
 * `_sanityAsset` es igual si el sha1 del fichero es el del asset del dataset.
 * Lee por la API publica sin token (como el build). No escribe en Sanity.
 */
import fs from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import crypto from 'node:crypto';

const [entrada, salida] = process.argv.slice(2);
const desde = process.argv.includes('--desde') ? process.argv[process.argv.indexOf('--desde') + 1] : null;
if (!entrada || !salida || !desde) { console.error('uso: preparar-import.mjs <migracion.ndjson> <salida.ndjson> --desde <ISO>'); process.exit(2); }

const PROYECTO = process.env.SANITY_PROJECT_ID ?? 'n0ct9t3k', DATASET = process.env.SANITY_DATASET ?? 'production', VERSION = process.env.SANITY_API_VERSION ?? '2025-01-01';
const u = new URL(`https://${PROYECTO}.api.sanity.io/v${VERSION}/data/query/${DATASET}`);
u.searchParams.set('query', '*[!(_id in path("drafts.**")) && !(_id in path("_.**")) && !(_type match "sanity.*")]');
const r = await fetch(u);
if (!r.ok) throw new Error(`consulta: HTTP ${r.status}`);
const enDataset = new Map((await r.json()).result.map((d) => [d._id, d]));

const SISTEMA = new Set(['_rev', '_createdAt', '_updatedAt', '_system']);
const sha1 = new Map();
const sha1De = (f) => { if (!sha1.has(f)) sha1.set(f, crypto.createHash('sha1').update(readFileSync(f)).digest('hex')); return sha1.get(f); };
function difiere(a, b, ruta, out) {
  if (a && typeof a === 'object' && !Array.isArray(a) && '_sanityAsset' in a) {
    const f = a._sanityAsset.replace(/^image@file:\/\//, '');
    const ref = b?.asset?._ref ?? '';
    if (!ref.startsWith(`image-${sha1De(f)}-`)) out.push(`${ruta}: imagen distinta`);
    const { _sanityAsset, ...resto } = a; const { asset, ...restoB } = b ?? {};
    return difiere(resto, restoB, ruta, out);
  }
  if (Array.isArray(a) || Array.isArray(b)) {
    if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) { out.push(`${ruta}: array (${a?.length} frente a ${b?.length})`); return; }
    a.forEach((x, i) => difiere(x, b[i], `${ruta}[${i}]`, out));
    return;
  }
  if (a && typeof a === 'object' && b && typeof b === 'object') {
    for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) if (!SISTEMA.has(k)) difiere(a[k], b[k], `${ruta}.${k}`, out);
    return;
  }
  if (a !== b) out.push(`${ruta}: ${JSON.stringify(b)?.slice(0, 80)} -> ${JSON.stringify(a)?.slice(0, 80)}`);
}

const docs = (await fs.readFile(entrada, 'utf8')).trim().split('\n').map((l) => JSON.parse(l));
const nuevos = [], cambiados = [], editados = [], iguales = [];
for (const d of docs) {
  const s = enDataset.get(d._id);
  if (!s) { nuevos.push(d); continue; }
  if (s._updatedAt > desde) { editados.push({ _id: d._id, _updatedAt: s._updatedAt }); continue; }
  const out = [];
  difiere(d, s, d._id, out);
  if (out.length) cambiados.push({ d, out }); else iguales.push(d._id);
}
// Lo que hay en el dataset y la migracion ya no produce: no se toca (nunca se borra).
const soloDataset = [...enDataset.keys()].filter((id) => !docs.some((d) => d._id === id));
await fs.writeFile(salida, [...nuevos, ...cambiados.map((c) => c.d)].map((d) => JSON.stringify(d)).join('\n') + '\n');
const resumen = {
  migracion: docs.length, enDataset: enDataset.size, iguales: iguales.length,
  nuevos: nuevos.map((d) => d._id), cambiados: cambiados.length,
  noSePisanEditadosEnStudio: editados, soloEnDataset: soloDataset, salida,
};
console.log(JSON.stringify(resumen, null, 1));
for (const c of cambiados) console.log(`  CAMBIA ${c.d._id}\n    ${c.out.slice(0, 6).join('\n    ')}${c.out.length > 6 ? `\n    … ${c.out.length - 6} mas` : ''}`);
