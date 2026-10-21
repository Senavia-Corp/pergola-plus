#!/usr/bin/env node
/**
 * Paridad de los datos: lo que reconstruye src/lib/sanity/* desde la instantanea del
 * dataset (.cache/sanity/contenido.json) frente a lo que publican HOY los modulos del
 * repo, objeto a objeto y en el mismo proceso.
 *
 *     PP_FUENTE=sanity node scripts/sanity/instantanea.mjs   # la instantanea
 *     node scripts/sanity/paridad.mjs [tipo,tipo]
 *
 * Complementa a comparar-dist.mjs: aquella dice QUE pagina cambia; esta dice que dato
 * no se reconstruye, antes de construir. Sale con 1 si algo difiere.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { cargarTs, cerrarTs } from './cargar-ts.mjs';

const RAIZ = path.resolve(import.meta.dirname, '../..');
process.chdir(RAIZ);
delete process.env.PP_FUENTE; // los modulos del repo, con su fuente de siempre
const filtro = process.argv[2]?.split(',');

const F = await cargarTs('src/lib/sanity/fuente.mjs');
const c = F.sanity();
const conv = { rutaImagen: F.rutaImagen, hrefDe: F.hrefDe };

const difs = [];
const vistos = {};
/** Igualdad profunda; Date por su valor. Registra la primera diferencia de cada rama. */
function igual(a, b, ruta) {
  vistos[ruta.split(/[.[]/)[0]] = true;
  if (a instanceof Date || b instanceof Date) { if (!(a instanceof Date && b instanceof Date && a.getTime() === b.getTime())) difs.push(`${ruta}: ${a} frente a ${b}`); return; }
  if (Array.isArray(a) || Array.isArray(b)) {
    if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) { difs.push(`${ruta}: longitud ${a?.length} frente a ${b?.length}`); return; }
    a.forEach((x, i) => igual(x, b[i], `${ruta}[${i}]`));
    return;
  }
  if (a instanceof Set || b instanceof Set) return igual([...a].sort(), [...b].sort(), ruta);
  if (a && typeof a === 'object' && b && typeof b === 'object') {
    for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) igual(a[k], b[k], `${ruta}.${k}`);
    return;
  }
  if (a !== b) difs.push(`${ruta}: ${JSON.stringify(a)?.slice(0, 120)} frente a ${JSON.stringify(b)?.slice(0, 120)}`);
}
const solo = (o, ks) => Object.fromEntries(ks.map((k) => [k, o[k]]));

const TIPOS = {
  async propias() {
    const P = await cargarTs('src/i18n/paginas-propias.ts');
    const C = await cargarTs('src/i18n/contacto.ts');
    const { propiasDesde } = await import('../../src/lib/sanity/propias.mjs');
    const S = propiasDesde(c, conv, C.CONDADOS.map((x) => x.clave));
    for (const k of ['PROPIAS_EN', 'PROPIAS_ES']) igual(S[k], P[k], `propias.${k}`);
    for (const k of ['CONTACTO_EN', 'CONTACTO_ES', 'CONDADOS']) igual(S[k], JSON.parse(JSON.stringify(C[k])), `propias.${k}`);
  },
  async navegacion() {
    const { SHELL } = await cargarTs('src/i18n/shell.ts');
    const { desaplanar } = await import('../../src/lib/plantilla-sanity.mjs');
    const n = c.doc('navigation');
    igual({ en: desaplanar(n.textos, 'en'), es: desaplanar(n.textos, 'es') }, SHELL, 'navegacion.textos');
  },
  async estimador() {
    const D = await cargarTs('src/data/estimador.ts');
    const I = await cargarTs('src/i18n/estimador.ts');
    const { estimadorDesde } = await import('../../src/lib/sanity/estimador.mjs');
    const S = estimadorDesde(c, { rutaImagen: F.rutaImagen, rutaDeRef: F.rutaDeRef });
    for (const [k, v] of Object.entries(S)) igual(v, (k.startsWith('ESTIMADOR_') ? I : D)[k], `estimador.${k}`);
  },
  async faqs() {
    const D = await cargarTs('src/data/faqs.ts');
    const I = await cargarTs('src/i18n/faqs.es.ts');
    const { faqsDesde } = await import('../../src/lib/sanity/faqs.mjs');
    const S = faqsDesde(c, F.rutaDeRef);
    for (const k of ['CHIPS', 'TEMAS_FICHA', 'PROMOVIDAS', 'FAQS']) igual(S[k], D[k], `faqs.${k}`);
    for (const k of ['CHIPS_COPY', 'TEMAS_COPY', 'FAQS_COPY']) igual(S[k], I[k], `faqs.${k}`);
  },
  async negocio() {
    const { NEGOCIO } = await cargarTs('src/lib/jsonld.ts');
    const { negocioDesde } = await import('../../src/lib/sanity/negocio.mjs');
    igual(negocioDesde(c.doc('siteSettings')), JSON.parse(JSON.stringify(NEGOCIO)), 'negocio');
  },
  async resenas() {
    const { resenasDesde } = await import('../../src/lib/sanity/resenas.mjs');
    const { _comentario, ...repo } = JSON.parse(await fs.readFile('src/data/reviews-google.json', 'utf8'));
    igual(resenasDesde(c), repo, 'resenas');
  },
  async blog() {
    const B = await cargarTs('src/lib/blog.ts');
    const E = await cargarTs('src/i18n/blog.es.ts');
    const { blogDesde } = await import('../../src/lib/sanity/blog.mjs');
    const S = blogDesde(c, conv);
    igual(S.categorias, B.categorias, 'blog.categorias');
    const img = (i) => solo(i, ['src', 'width', 'height']);
    igual(S.posts.map((p) => ({ ...p, miniatura: img(p.miniatura), principal: img(p.principal) })),
      B.posts.map((p) => ({ ...p, miniatura: img(p.miniatura), principal: img(p.principal) })), 'blog.posts');
    for (const cat of B.categoriasConPosts) igual(S.copy[cat.slug], B.copyDe(cat), `blog.copy.${cat.slug}`);
    igual(S.categoriasEs, E.CATEGORIAS_ES, 'blog.categoriasEs');
    igual(S.copyCategoriasEs, E.COPY_CATEGORIAS_ES, 'blog.copyCategoriasEs');
    igual(S.postsEs, E.POSTS_ES, 'blog.postsEs');
    igual(Object.keys(S.cuerpos).filter((s) => S.cuerpos[s].es).sort(), Object.keys(E.CUERPOS_ES).sort(), 'blog.traducidos');
  },
};

for (const [t, f] of Object.entries(TIPOS)) if (!filtro || filtro.includes(t)) await f();
await cerrarTs();
console.log(JSON.stringify({ instantanea: c.leido, comparados: Object.keys(vistos), diferencias: difs.length }, null, 1));
for (const d of difs.slice(0, 40)) console.log('  DIF', d);
process.exit(difs.length ? 1 : 0);
