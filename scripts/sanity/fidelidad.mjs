#!/usr/bin/env node
/**
 * Fidelidad del contenido de Sanity: lo que el sitio pinta desde el dataset frente a lo
 * que publica el repo (src/contenido-migrado, src/data, src/i18n), en el mismo proceso.
 *
 *     node scripts/sanity/fidelidad.mjs        # tras la instantanea (npm run build la hace)
 *
 *   1. Paginas: el fragmento de cada pagina estatica y de cada documento de coleccion,
 *      EN y ES, pintado desde Sanity (fragmentoEstatica/fragmentoColeccion) igual al
 *      fragmento del repo (el que se pinta con PP_FUENTE=repo), byte a byte, una vez
 *      quitado del repo lo que retiro 3f del marcado de Webflow (src/lib/sin-webflow-cms.mjs).
 *   2. Datos: scripts/sanity/paridad.mjs (blog, FAQ, reseñas, estimador, negocio,
 *      navegacion, paginas propias), objeto a objeto.
 *
 * Un documento editado en el Studio DESPUES de la ultima migracion
 * (src/data/sanity-migracion.json) ya no tiene que ser igual al repo: no se compara y se
 * lista. Sale con 1 si algo difiere.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { cargarTs, cerrarTs } from './cargar-ts.mjs';
import { estaticasDe, paginasDe, COLECCIONES } from './plantillas.mjs';
import { sinWebflowCms } from '../../src/lib/sin-webflow-cms.mjs';

const RAIZ = path.resolve(import.meta.dirname, '../..');
process.chdir(RAIZ);
process.env.PP_FUENTE = 'repo'; // los modulos del repo, con sus literales migrados (el lado «repo»)
const { ultimaMigracion } = JSON.parse(await fs.readFile('src/data/sanity-migracion.json', 'utf8'));
const F = await cargarTs('src/lib/sanity/fuente.mjs');
const c = F.sanity();
const editado = (d) => d._updatedAt > ultimaMigracion;
const editados = c.docs.filter(editado).map((d) => `${d._id} (${d._updatedAt})`);

const fallos = [];
let comparadas = 0;
const comparar = (id, idioma, repo, sanity) => {
  comparadas++;
  const hoy = sinWebflowCms(repo);
  if (hoy === sanity) return;
  let k = 0; while (k < hoy.length && hoy[k] === sanity[k]) k++;
  fallos.push(`${id} ${idioma}: difiere en ${k}\n      repo:   …${hoy.slice(Math.max(0, k - 60), k + 60)}\n      sanity: …${sanity.slice(Math.max(0, k - 60), k + 60)}`);
};

// Las paginas `page` que no son un fragmento (formulario de contacto, estimador, indice
// del blog, FAQ, thank-you) se pintan con componentes desde los datos del paso 2.
for (const p of await estaticasDe()) {
  const doc = c.doc(p.id);
  if (!doc) { fallos.push(`${p.ruta}: sin documento ${p.id}`); continue; }
  if (editado(doc)) continue;
  comparar(p.id, 'en', p.enCompleto, F.fragmentoEstatica(doc, 'en'));
  comparar(p.id, 'es', p.esCompleto, F.fragmentoEstatica(doc, 'es'));
}
for (const tipo of Object.keys(COLECCIONES)) {
  for (const p of await paginasDe(tipo)) {
    const doc = c.deTipo(tipo).find((d) => d.slug.current === p.slug);
    if (!doc) { fallos.push(`${tipo} ${p.slug}: sin documento`); continue; }
    if (editado(doc)) continue;
    const en = await fs.readFile(path.join(RAIZ, 'src/contenido-migrado', COLECCIONES[tipo].carpeta, `${p.slug}.html`), 'utf8');
    comparar(doc._id, 'en', en, F.fragmentoColeccion(doc, 'en'));
    // ES: la traduccion del fragmento con su diccionario (paginasDe), salvo el texto
    // enriquecido de los legales, que va traducido en el documento y lo cubre ida-y-vuelta.
    if (p.es && !COLECCIONES[tipo].cuerpo) comparar(doc._id, 'es', p.es, F.fragmentoColeccion(doc, 'es'));
  }
}
await cerrarTs();
console.log(`paginas: ${comparadas} fragmentos comparados, ${fallos.length} difieren`);
for (const f of fallos.slice(0, 30)) console.log(`  FALLO  ${f}`);

// 2. Datos. Un tipo con documentos editados tras la migracion no se compara.
const TIPOS_DE = { propias: ['page', 'siteSettings'], navegacion: ['navigation'], estimador: ['estimador'], faqs: ['faq', 'faqTheme', 'faqTopic'], negocio: ['siteSettings'], resenas: ['review', 'siteSettings'], blog: ['post', 'blogCategory'] };
const tipos = Object.entries(TIPOS_DE).filter(([, ts]) => !c.docs.some((d) => ts.includes(d._type) && editado(d))).map(([t]) => t);
const sinComparar = Object.keys(TIPOS_DE).filter((t) => !tipos.includes(t));
const r = spawnSync(process.execPath, ['scripts/sanity/paridad.mjs', tipos.join(',')], { encoding: 'utf8', env: { ...process.env } });
process.stdout.write(r.stdout.split('\n').map((l) => `  ${l}`).join('\n') + '\n');
if (r.status !== 0) fallos.push(`datos: paridad.mjs sale con ${r.status}${r.stderr ? `\n${r.stderr.slice(-400)}` : ''}`);
// 3. Texto enriquecido (cuerpo de los posts y de los legales, EN y ES) desde Sanity
// frente al que pinta hoy el repo (scripts/sanity/ida-y-vuelta.mjs: textosEnriquecidos),
// con la normalizacion de alli (entidades, espacio entre atributos, href canonico).
const { textosEnriquecidos, normalizar, hrefsCanonicos } = await import('./ida-y-vuelta.mjs');
const { blogDesde } = await import('../../src/lib/sanity/blog.mjs');
const casos = await textosEnriquecidos();
const F2 = await cargarTs('src/lib/sanity/fuente.mjs');
const { extraerDiv } = await cargarTs('src/lib/articulo.ts');
const cuerpos = blogDesde(c, { rutaImagen: F2.rutaImagen, hrefDe: F2.hrefDe, contacto: F2.contacto() }).cuerpos;
let nCuerpos = 0;
for (const k of casos) {
  const doc = c.deTipo(k.tipo).find((d) => d.slug.current === k.slug);
  if (!doc) { fallos.push(`${k.tipo}/${k.slug}: sin documento`); continue; }
  if (editado(doc)) continue;
  const html = k.tipo === 'post' ? cuerpos[k.slug]?.[k.idioma] : extraerDiv(F2.fragmentoColeccion(doc, k.idioma), '<div class="w-richtext"');
  nCuerpos++;
  if (html == null) { fallos.push(`${k.tipo}/${k.slug} ${k.idioma}: sin cuerpo en Sanity`); continue; }
  const a = normalizar(hrefsCanonicos(k.html)), b = normalizar(hrefsCanonicos(html));
  if (a !== b) { let i = 0; while (i < a.length && a[i] === b[i]) i++; fallos.push(`${k.tipo}/${k.slug} ${k.idioma} (cuerpo): difiere en ${i}\n      repo:   …${a.slice(Math.max(0, i - 60), i + 60)}\n      sanity: …${b.slice(Math.max(0, i - 60), i + 60)}`); }
}
await cerrarTs();
console.log(`texto enriquecido: ${nCuerpos} cuerpos comparados`);
for (const f of fallos.slice(0, 30)) if (f.includes('(cuerpo)')) console.log(`  FALLO  ${f}`);

if (editados.length) console.log(`\nEditados en el Studio despues de la ultima migracion (${ultimaMigracion}), no se comparan:\n  ${editados.join('\n  ')}`);
if (sinComparar.length) console.log(`Datos sin comparar por esos documentos: ${sinComparar.join(', ')}`);
console.log(fallos.length ? `\n${fallos.length} fallo(s).` : '\nTodo correcto.');
process.exit(fallos.length ? 1 : 0);
