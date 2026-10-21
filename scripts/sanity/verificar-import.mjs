#!/usr/bin/env node
/**
 * Compara lo que hay en Sanity (API publica, sin token) con el NDJSON importado.
 *
 *     node scripts/sanity/verificar-import.mjs <fichero.ndjson>
 *
 * Igualdad campo a campo, salvo `_sanityAsset` (en Sanity es ya `asset._ref`, que se
 * comprueba que exista) y los campos de sistema (_rev, _createdAt, _updatedAt).
 */
import fs from 'node:fs/promises';

const PROYECTO = 'n0ct9t3k', DATASET = 'production', API = 'v2025-01-01';
const consulta = async (q, params = {}) => {
  const u = new URL(`https://${PROYECTO}.apicdn.sanity.io/${API}/data/query/${DATASET}`);
  u.searchParams.set('query', q);
  for (const [k, v] of Object.entries(params)) u.searchParams.set(`$${k}`, JSON.stringify(v));
  u.searchParams.set('perspective', 'published');
  const r = await fetch(u.href.replace('apicdn', 'api'));
  if (!r.ok) throw new Error(`${r.status} ${await r.text()}`);
  return (await r.json()).result;
};

const origen = (await fs.readFile(process.argv[2], 'utf8')).trim().split('\n').map((l) => JSON.parse(l));
const ids = origen.map((d) => d._id);
const enSanity = new Map();
for (let i = 0; i < ids.length; i += 100) for (const d of await consulta('*[_id in $ids]', { ids: ids.slice(i, i + 100) })) enSanity.set(d._id, d);

const SISTEMA = new Set(['_rev', '_createdAt', '_updatedAt', '_system']);
const assetsVistos = new Set();
const difs = [];
function comparar(a, b, ruta) {
  if (a && typeof a === 'object' && '_sanityAsset' in a) {
    if (!b?.asset?._ref) { difs.push(`${ruta}: imagen sin asset en Sanity`); return; }
    assetsVistos.add(b.asset._ref);
    const { _sanityAsset, ...resto } = a;
    const { asset, ...restoB } = b;
    return comparar(resto, restoB, ruta);
  }
  if (Array.isArray(a)) {
    if (!Array.isArray(b) || a.length !== b.length) { difs.push(`${ruta}: array distinto (${a.length} frente a ${b?.length})`); return; }
    a.forEach((x, i) => comparar(x, b[i], `${ruta}[${i}]`));
    return;
  }
  if (a && typeof a === 'object') {
    if (!b || typeof b !== 'object') { difs.push(`${ruta}: falta el objeto`); return; }
    for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) {
      if (SISTEMA.has(k)) continue;
      comparar(a[k], b[k], `${ruta}.${k}`);
    }
    return;
  }
  if (a !== b) difs.push(`${ruta}: ${JSON.stringify(a)} frente a ${JSON.stringify(b)}`);
}
for (const d of origen) {
  const s = enSanity.get(d._id);
  if (!s) { difs.push(`${d._id}: no esta en Sanity`); continue; }
  comparar(d, s, d._id);
}
const existentes = new Set(await consulta('*[_id in $ids]._id', { ids: [...assetsVistos] }));
const sinAsset = [...assetsVistos].filter((a) => !existentes.has(a));
const porTipo = await consulta('{"total": count(*[!(_id in path("_.**"))]), "tipos": *[!(_id in path("_.**")) && !(_type match "sanity.*")]{_type}._type}');
const recuento = {};
for (const t of porTipo.tipos) recuento[t] = (recuento[t] ?? 0) + 1;
console.log(JSON.stringify({ enOrigen: origen.length, encontrados: enSanity.size, diferencias: difs.length, assets: assetsVistos.size, assetsInexistentes: sinAsset.length, documentosEnDataset: porTipo.total, porTipo: recuento }, null, 1));
for (const d of difs.slice(0, 30)) console.log('  DIF', d);
process.exit(difs.length || sinAsset.length ? 1 : 0);
