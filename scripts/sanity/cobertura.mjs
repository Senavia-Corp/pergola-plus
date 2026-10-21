#!/usr/bin/env node
/**
 * Cobertura de Sanity: que el sitio construido sale ENTERO del dataset.
 *
 *     node scripts/sanity/cobertura.mjs        # despues de `npm run build`
 *
 *   1. El build: .cache/ultimo-build.json (lo escribe astro.config.mjs) dice que se
 *      construyo con la fuente `sanity` y con la instantanea que hay en .cache/sanity/.
 *   2. Las paginas: cada HTML de dist/client (EN y ES) es la de un documento publicado
 *      (page, product, service, brand, project, city, county, legalPage, post,
 *      blogCategory con pagina), y cada uno de esos documentos tiene su pagina EN.
 *   3. Los tipos: cada tipo de contenido del dataset tiene documentos y un lector en el
 *      codigo que, con la fuente `sanity`, lo usa en lugar del literal del repo.
 *
 * Sale con 1 si falta algo.
 */
import fs from 'node:fs';
import path from 'node:path';
import { rutaDe } from '../../src/lib/rutas-sanity.mjs';

const RAIZ = path.resolve(import.meta.dirname, '../..');
const DIST = path.join(RAIZ, 'dist/client');
const fallos = [];

// 1. El build.
const build = JSON.parse(fs.readFileSync(path.join(RAIZ, '.cache/ultimo-build.json'), 'utf8'));
const c = JSON.parse(fs.readFileSync(path.join(RAIZ, '.cache/sanity/contenido.json'), 'utf8'));
if (build.fuente !== 'sanity') fallos.push(`el ultimo build se hizo con la fuente «${build.fuente}», no con sanity`);
else if (build.instantanea !== c.leido) fallos.push(`el ultimo build uso la instantanea ${build.instantanea} y la de .cache es ${c.leido}`);

// 2. Las paginas.
const CON_PAGINA = new Set(['page', 'product', 'service', 'brand', 'project', 'city', 'county', 'legalPage', 'post', 'blogCategory']);
const docs = c.docs.filter((d) => CON_PAGINA.has(d._type) && (d._type !== 'blogCategory' || d.tienePagina));
const porRuta = new Map(docs.map((d) => [rutaDe(d), d]));
const htmls = fs.readdirSync(DIST, { recursive: true }).filter((f) => f.endsWith('.html'));
const rutaDeHtml = (f) => ('/' + f.replace(/(^|\/)index\.html$/, '').replace(/\.html$/, '')).replace(/\/$/, '') || '/';
const conPagina = new Set();
for (const f of htmls) {
  const r = rutaDeHtml(f);
  const en = r === '/es' ? '/' : r.replace(/^\/es(?=\/)/, '');
  const d = porRuta.get(en);
  if (!d) fallos.push(`${f}: ninguna pagina de Sanity tiene la ruta ${en}`);
  else if (en === r) conPagina.add(d._id);
}
for (const d of docs) if (!conPagina.has(d._id)) fallos.push(`${d._id}: sin pagina en dist (${rutaDe(d)})`);

// 3. Los tipos y su lector (fichero, y lo que lo delata en el).
const LECTORES = {
  page: [['src/lib/sanity/fuente.mjs', 'paginaDe'], ['src/i18n/contacto.ts', 'propiasDesde']],
  product: [['src/pages/products/[slug].astro', 'fragmentoColeccion'], ['src/lib/sanity/datos.mjs', "deTipo('product')"]],
  service: [['src/pages/services/[slug].astro', 'fragmentoColeccion']],
  brand: [['src/pages/brands/[slug].astro', 'fragmentoColeccion']],
  project: [['src/pages/project/[slug].astro', 'fragmentoColeccion'], ['src/components/ProyectoDeFicha.astro', 'productos']],
  city: [['src/pages/pergolas-contractors/[slug].astro', 'fragmentoColeccion'], ['src/data/ubicaciones.mjs', 'ubicacionesSanity']],
  county: [['src/pages/countries/[slug].astro', 'fragmentoColeccion'], ['src/data/ubicaciones.mjs', 'ubicacionesSanity']],
  legalPage: [['src/pages/articles/[slug].astro', 'fragmentoColeccion']],
  post: [['src/lib/blog.ts', 'blogDesde']],
  blogCategory: [['src/lib/blog.ts', 'blogDesde']],
  faq: [['src/data/faqs.ts', 'faqsDesde']],
  faqTheme: [['src/data/faqs.ts', 'faqsDesde']],
  faqTopic: [['src/data/faqs.ts', 'faqsDesde']],
  estimador: [['src/data/estimador.ts', 'estimadorDesde']],
  review: [['src/lib/reviews.ts', 'resenasDesde']],
  siteSettings: [['src/lib/sanity/vite.mjs', 'siteSettings'], ['src/lib/sanity/fuente.mjs', 'contactoSitio']],
  navigation: [['src/lib/menu.ts', 'menuDesde'], ['src/i18n/shell.ts', 'navigation']],
};
// Los documentos de apoyo del Studio (plantillas iniciales) no se publican.
const NO_PUBLICADOS = new Set(['plantilla']);
const tipos = [...new Set(c.docs.map((d) => d._type))].filter((t) => !NO_PUBLICADOS.has(t)).sort();
for (const t of tipos) if (!LECTORES[t]) fallos.push(`tipo ${t}: sin lector declarado en cobertura.mjs`);
for (const [t, lectores] of Object.entries(LECTORES)) {
  const n = c.docs.filter((d) => d._type === t).length;
  if (!n) fallos.push(`tipo ${t}: sin documentos en el dataset`);
  for (const [f, marca] of lectores) {
    const src = fs.readFileSync(path.join(RAIZ, f), 'utf8');
    if (!src.includes(marca)) fallos.push(`tipo ${t}: ${f} ya no usa ${marca}`);
    if (!/FUENTE|sanity\(\)|deTipo|\.doc\(/.test(src)) fallos.push(`tipo ${t}: ${f} no lee de Sanity`);
  }
}

console.log(`build: fuente ${build.fuente}, instantanea ${build.instantanea}, ${build.paginas} paginas`);
console.log(`paginas: ${htmls.length} HTML, ${conPagina.size}/${docs.length} documentos con pagina`);
console.log(`tipos: ${Object.keys(LECTORES).filter((t) => tipos.includes(t)).length}/${tipos.length} leidos de Sanity (${tipos.join(', ')})`);
for (const f of fallos) console.log(`  FALLO  ${f}`);
console.log(fallos.length ? `\n${fallos.length} fallo(s).` : '\nTodo correcto.');
process.exit(fallos.length ? 1 : 0);
