#!/usr/bin/env node
/**
 * `sinonimos` (buscador del FAQ, no se muestran) de las 95 preguntas que no los tenian,
 * con el estilo de las 154 que si: palabras sueltas, español sin tildes. Salen de la
 * pregunta y la respuesta de cada una; no añaden datos. Tabla: sinonimos-faq.json.
 *
 *     (cd studio && npx sanity exec ../scripts/sanity/sinonimos-faq.mjs --with-user-token [-- --aplicar])
 *
 * Solo escribe donde `sinonimos` esta vacio, con ifRevisionID, y no toca un documento
 * editado despues de la ultima migracion (src/data/sanity-migracion.json).
 */
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const RAIZ = path.resolve(import.meta.dirname, '../..');
const { getCliClient } = await import(createRequire(path.join(RAIZ, 'studio/package.json')).resolve('sanity/cli'));
const c = getCliClient({ apiVersion: '2025-01-01' });
const { ultimaMigracion } = JSON.parse(fs.readFileSync(path.join(RAIZ, 'src/data/sanity-migracion.json'), 'utf8'));
const TABLA = JSON.parse(fs.readFileSync(path.join(import.meta.dirname, 'sinonimos-faq.json'), 'utf8'));

const docs = await c.fetch('*[_type == "faq" && _id in $ids]', { ids: Object.keys(TABLA) });
const parches = [], saltados = [];
for (const d of docs) {
  if (d.sinonimos?.en) continue;
  if (d._updatedAt > ultimaMigracion) { saltados.push(`${d._id} (${d._updatedAt})`); continue; }
  parches.push({ id: d._id, rev: d._rev, set: { sinonimos: { _type: 'textoI18n', ...TABLA[d._id] } } });
}
console.log(`${parches.length} de ${Object.keys(TABLA).length}; editados en el Studio, sin tocar: ${saltados.join(', ') || 'ninguno'}`);
if (process.argv.includes('--aplicar') && parches.length) {
  const tx = parches.reduce((t, p) => t.patch(p.id, (q) => q.ifRevisionId(p.rev).set(p.set)), c.transaction());
  console.log(`aplicado: ${(await tx.commit()).results.length} documentos`);
}
