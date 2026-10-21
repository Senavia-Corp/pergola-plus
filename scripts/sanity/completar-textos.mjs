#!/usr/bin/env node
/**
 * Huecos de texto del dataset que se pueden rellenar sin inventar (cierre en local, 21-oct):
 *   - `nombre.es` de las 3 categorias del blog sin posts ni pagina, con las palabras que ya
 *     usa el sitio en español («pavimentos», «zonas de servicio»);
 *   - `etiquetaGaleria` de los 6 productos sin proyectos: su propio `nombre`, como los otros 4;
 *   - las 3 `seo.descripcion.en` de mas de 160 caracteres, recortadas sin añadir nada.
 *
 *     (cd studio && npx sanity exec ../scripts/sanity/completar-textos.mjs --with-user-token [-- --aplicar])
 *
 * Solo escribe si el campo sigue como estaba (vacio, o el texto exacto de DESCRIPCIONES),
 * con ifRevisionID, y no toca un documento editado despues de la ultima migracion.
 */
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const RAIZ = path.resolve(import.meta.dirname, '../..');
const { getCliClient } = await import(createRequire(path.join(RAIZ, 'studio/package.json')).resolve('sanity/cli'));
const c = getCliClient({ apiVersion: '2025-01-01' });
const { ultimaMigracion } = JSON.parse(fs.readFileSync(path.join(RAIZ, 'src/data/sanity-migracion.json'), 'utf8'));

const CATEGORIAS_ES = {
  'blogCategory-commercial-projects': 'Proyectos comerciales',
  'blogCategory-patio-hardscape-services': 'Patios y pavimentos',
  'blogCategory-service-areas': 'Zonas de servicio',
};
/** id: [la del cliente, la recortada] */
const DESCRIPCIONES = {
  'county-broward-county-pergola-contractor': [
    'Licensed Broward County pergola contractor specializing in custom aluminum pergolas, patio covers, and motorized louvered roof systems for high-end outdoor living projects.',
    'Licensed Broward County pergola contractor for custom aluminum pergolas, patio covers and motorized louvered roof systems for high-end outdoor living.'],
  'county-palm-beach-county-pergola-contractor': [
    'Palm Beach County pergola contractor specializing in custom aluminum pergolas, insulated patio covers, and motorized roof systems for upscale residential properties.',
    'Palm Beach County pergola contractor for custom aluminum pergolas, insulated patio covers and motorized roof systems for upscale homes.'],
  'project-forte-pergola-with-outdoor-kitchen-at-elan-polo-club': [
    'Freestanding aluminum pergola with louvered and solid roof sections, recessed lighting and a built-in outdoor kitchen, built as the amenity centerpiece at Elan Polo Club.',
    'Freestanding aluminum pergola with louvered and solid roof sections, recessed lights and a built-in outdoor kitchen, the amenity centerpiece at Elan Polo Club.'],
};

const docs = await c.fetch('*[!(_id in path("drafts.**")) && (_type in ["blogCategory", "product"] || _id in $ids)]', { ids: Object.keys(DESCRIPCIONES) });
const parches = [], saltados = [];
for (const d of docs) {
  const set = {};
  if (CATEGORIAS_ES[d._id] && !d.nombre?.es) set['nombre.es'] = CATEGORIAS_ES[d._id];
  if (d._type === 'product' && !d.etiquetaGaleria && d.nombre?.en) set.etiquetaGaleria = { _type: 'textoI18n', en: d.nombre.en, ...(d.nombre.es ? { es: d.nombre.es } : {}) };
  const ds = DESCRIPCIONES[d._id];
  if (ds && d.seo?.descripcion?.en === ds[0]) set['seo.descripcion.en'] = ds[1];
  if (!Object.keys(set).length) continue;
  if (d._updatedAt > ultimaMigracion) { saltados.push(`${d._id} (${d._updatedAt})`); continue; }
  parches.push({ id: d._id, rev: d._rev, set });
}
for (const p of parches) console.log(`  ${p.id}: ${JSON.stringify(p.set).slice(0, 160)}`);
console.log(`${parches.length} documentos; editados en el Studio, sin tocar: ${saltados.join(', ') || 'ninguno'}`);
if (process.argv.includes('--aplicar') && parches.length) {
  const tx = parches.reduce((t, p) => t.patch(p.id, (q) => q.ifRevisionId(p.rev).set(p.set)), c.transaction());
  console.log(`aplicado: ${(await tx.commit()).results.length} documentos`);
}
