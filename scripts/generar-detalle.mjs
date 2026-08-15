#!/usr/bin/env node
/**
 * Fase 1 — genera las 83 paginas de detalle de las 8 colecciones.
 *
 * DECISION DE INGENIERIA (leer antes de tocar esto)
 *
 * El plan pedia plantillas [slug].astro con getStaticPaths leyendo los CSV y los
 * campos enlazados a mano. Se intento y se llego hasta aqui:
 *
 *   - El export trae las plantillas de detalle con los bindings VACIOS
 *     (w-dyn-bind-empty): esta el HTML, no el contenido. Habria que ADIVINAR que
 *     elemento corresponde a que campo.
 *   - scripts/derivar-plantilla.mjs resolvio buena parte automaticamente
 *     (22/29 campos de Products y las 4 listas anidadas), pero no todo: las
 *     plantillas llevan colecciones anidadas filtradas por el item
 *     (Feature Products, FAQs, Brochures) que NO estan en el CSV del item.
 *
 * Mientras tanto, el sitio en vivo renderiza esas mismas plantillas con el
 * contenido ya puesto — verificado: mismas secciones, mismos data-w-id.
 *
 * Asi que la Fase 1, cuyo objetivo es un frontend EXACTO, se genera desde el
 * HTML real de las 83 paginas. No hay riesgo de binding mal adivinado: la
 * salida ES la salida del sitio actual, y se puede comparar contra el en vivo.
 *
 * El enlazado a Sanity es la Fase 3, y para eso queda el mapa de campos que
 * produjo derivar-plantilla.mjs (docs/mapa-campos-cms.md).
 *
 * Lo que esto NO es: no son 83 paginas escritas a mano. Es un fragmento HTML por
 * item + 8 plantillas Astro que los renderizan, que es justo la estructura sobre
 * la que la Fase 3 sustituira el fragmento por datos de Sanity.
 *
 *   node scripts/generar-detalle.mjs
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { transformar, decodificar, reescribirImagenes, PLACEHOLDERS } from './lib/transformar.mjs';
import { parseCSV } from './lib/csv.mjs';
import { bajarFaltantes } from './lib/assets-cdn.mjs';

// Mapa de imagenes del CMS + inventario de lo que hay en public/images/.
const MAPA = JSON.parse(await fs.readFile(path.resolve(import.meta.dirname, '../src/lib/img-map.json'), 'utf8'));
const LOCALES = new Set(await fs.readdir(path.resolve(import.meta.dirname, '../public/images')));
const sinResolverGlobal = new Set();

const RAIZ = path.resolve(import.meta.dirname, '..');
const VIVO = '/private/tmp/claude-501/-Users-senavia/c6c8d2e5-148e-47e5-b6cf-e7286ffbc547/scratchpad/vivo';
const FRAG = path.join(RAIZ, 'src/contenido-migrado');
const EXPORT_CMS = '/Users/senavia/Downloads/Webflow Pergola Plus Florida/CMS';

/**
 * Colecciones con ruta propia. Prefijos CONFIRMADOS contra el sitio en vivo.
 * `csv` y las columnas SEO se usan para el arreglo opcional de abajo.
 */
const COLECCIONES = [
  { dir: 'products', ruta: 'products', csv: '- Products -', tSeo: 'Title SEO', dSeo: 'Metadescription SEO' },
  { dir: 'services', ruta: 'services', csv: '- Services -', tSeo: 'Title SEO', dSeo: 'Metadescription SEO' },
  { dir: 'post', ruta: 'post', csv: 'Blog Posts', tSeo: 'Title SEO', dSeo: 'Metadescription SEO' },
  { dir: 'project', ruta: 'project', csv: 'Projects', tSeo: 'Title SEO', dSeo: 'Metadescription' },
  { dir: 'brands', ruta: 'brands', csv: 'Brands', tSeo: 'Title SEO', dSeo: 'Metadescription SEO' },
  { dir: 'countries', ruta: 'countries', csv: 'Countries', tSeo: 'Title SEO', dSeo: 'Metadescription SEO' },
  { dir: 'pergolas-contractors', ruta: 'pergolas-contractors', csv: 'Pergolas Contractors', tSeo: 'Title SEO', dSeo: 'Metadescripcion SEO' },
  { dir: 'articles', ruta: 'articles', csv: 'Articles', tSeo: null, dSeo: null },
];

/**
 * SEO desde el CMS — ACTIVO (decision del cliente, 14-ago-2026).
 *
 * El sitio de Webflow sirve <title>Pergola Plus Florida</title> en las 83
 * paginas de detalle, sin meta description. Pero el CMS SI tiene los datos: 64
 * de 81 items llevan "Title SEO" y "Metadescription SEO" escritos. La plantilla
 * de Webflow simplemente nunca los enlazo al <head>.
 *
 * Afecta a lo que mas trafico organico deberia captar:
 *   25 paginas de contratista por ciudad ("Pergola Contractor in Aventura, FL")
 *   21 entradas de blog · 10 proyectos · 5 marcas · 3 condados
 *
 * ES LA UNICA DESVIACION DELIBERADA respecto al sitio actual, y esta acotada al
 * <head>: el cuerpo de las paginas sigue siendo identico. La auditoria de
 * paridad la trata como diferencia ESPERADA, no como fallo.
 *
 * Para volver al comportamiento del sitio actual:
 *   SEO_DESDE_CMS=0 node scripts/generar-detalle.mjs
 */
const SEO_DESDE_CMS = process.env.SEO_DESDE_CMS !== '0';

/**
 * Cuerpo de la pagina. El menu anida TRES niveles de <nav>, asi que buscar el
 * primer </nav> se comeria medio menu: hay que contar profundidad.
 */
function cuerpo(html) {
  const i = html.indexOf('<nav');
  if (i < 0) throw new Error('sin nav');
  let prof = 0, fin = -1;
  for (const m of html.slice(i).matchAll(/<nav\b|<\/nav>/g)) {
    prof += m[0] === '</nav>' ? -1 : 1;
    if (prof === 0) { fin = i + m.index + m[0].length; break; }
  }
  const b = html.lastIndexOf('<footer');
  if (fin < 0 || b < 0) throw new Error('sin cierre de nav o footer');
  return html.slice(fin, b);
}

function meta(html) {
  const t = (re) => html.match(re)?.[1]?.trim() ?? null;
  // Bloque anti-FOUC. Las plantillas de /products y /services SI lo llevan
  // (8 bloques, 2 ids): sin el, esos dos elementos aparecen y luego saltan para
  // animar. Se detecta por el selector w-mod-ix, no por posicion.
  const head = html.slice(0, html.indexOf('</head>'));
  const estilos = [...head.matchAll(/<style>([\s\S]*?)<\/style>/g)]
    .map((m) => m[1]).filter((c) => c.includes('w-mod-ix'));
  return {
    pageStyles: estilos.length ? estilos.join('\n') : null,
    title: decodificar(t(/<title>([\s\S]*?)<\/title>/)),
    description: decodificar(t(/<meta content="([^"]*)"\s+name="description"/)),
    ogImage: t(/<meta content="([^"]*)"\s+property="og:image"/),
    wfPage: t(/<html[^>]*\sdata-wf-page="([^"]*)"/),
    wfSite: t(/<html[^>]*\sdata-wf-site="([^"]*)"/),
  };
}

// Solo los ficheros de las 8 colecciones. La carpeta vivo/ tambien tiene las
// paginas estaticas y el 404, y el 404 no lleva <nav>: si se cuela aqui, revienta.
const ficheros = (await fs.readdir(VIVO))
  .filter((f) => COLECCIONES.some((c) => f.startsWith(`${c.dir}__`)));
const resumen = [];

// Pre-pasada: bajar del CDN lo que no tenemos (ver lib/assets-cdn.mjs).
{
  const htmls = [];
  for (const f of ficheros) htmls.push(await fs.readFile(path.join(VIVO, f), 'utf8'));
  const res = await bajarFaltantes({
    htmls, cuerpo, mapa: MAPA, locales: LOCALES,
    destino: path.join(RAIZ, 'public/images'),
  });
  if (res.bajadas) console.log(`  bajados ${res.bajadas} assets que el CDN sirve y no teniamos`);
  for (const f of res.fallos) console.error(`  !! ${f.error}  ${f.url}`);
}

for (const col of COLECCIONES) {
  const propios = ficheros.filter((f) => f.startsWith(`${col.dir}__`));
  const items = [];

  // Datos SEO del CMS, indexados por slug. Se guardan SIEMPRE en _items.json
  // (asi quedan a mano para la Fase 3 y para el arreglo), pero solo se aplican
  // al <head> si SEO_DESDE_CMS esta activo.
  const seo = {};
  if (col.csv) {
    const nombreCsv = (await fs.readdir(path.join(EXPORT_CMS))).find((f) => f.includes(col.csv));
    if (nombreCsv) {
      for (const r of parseCSV(await fs.readFile(path.join(EXPORT_CMS, nombreCsv), 'utf8'))) {
        seo[r.Slug] = {
          tituloSeo: (col.tSeo && r[col.tSeo]?.trim()) || null,
          descripcionSeo: (col.dSeo && r[col.dSeo]?.trim()) || null,
        };
      }
    }
  }

  for (const f of propios) {
    const slug = f.slice(col.dir.length + 2, -5);
    const html = await fs.readFile(path.join(VIVO, f), 'utf8');
    const r = reescribirImagenes(cuerpo(html), MAPA, LOCALES);
    for (const u of r.sinResolver) if (!PLACEHOLDERS[u]) sinResolverGlobal.add(u);
    const frag = transformar(r.html);

    const dir = path.join(FRAG, col.dir);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(path.join(dir, `${slug}.html`), frag);
    const m = meta(html);
    const s = seo[slug] ?? {};
    items.push({
      slug, ...m, ...s,
      // Lo que acaba en el <head>: por defecto lo del sitio actual.
      title: SEO_DESDE_CMS && s.tituloSeo ? s.tituloSeo : m.title,
      description: SEO_DESDE_CMS && s.descripcionSeo ? s.descripcionSeo : m.description,
    });
  }

  items.sort((a, b) => a.slug.localeCompare(b.slug));
  await fs.writeFile(path.join(FRAG, col.dir, '_items.json'), JSON.stringify(items, null, 2));

  // La plantilla Astro: una por coleccion, con getStaticPaths sobre los items.
  const astro = `---
import BaseLayout from '../../layouts/BaseLayout.astro';
import items from '../../contenido-migrado/${col.dir}/_items.json';

// Generado por scripts/generar-detalle.mjs — NO editar a mano.
//
// El fragmento HTML de cada item se importa en crudo. En la Fase 3 esta linea
// es lo unico que cambia: en vez de leer el fragmento, se consulta Sanity y se
// renderiza la plantilla con sus datos. La estructura de la pagina y el <head>
// ya quedan aqui.
const fragmentos = import.meta.glob('../../contenido-migrado/${col.dir}/*.html', {
  query: '?raw', import: 'default', eager: true,
});

export function getStaticPaths() {
  return items.map((item) => ({ params: { slug: item.slug }, props: { item } }));
}

const { item } = Astro.props;
const html = fragmentos['../../contenido-migrado/${col.dir}/' + item.slug + '.html'];
if (!html) throw new Error('sin fragmento para ${col.dir}/' + item.slug);
---

<BaseLayout
  title={item.title}
  description={item.description ?? undefined}
  ogImage={item.ogImage ?? undefined}
  pageStyles={item.pageStyles ?? undefined}
  wfPage={item.wfPage ?? undefined}
  wfSite={item.wfSite ?? undefined}
>
  <Fragment set:html={html} />
</BaseLayout>
`;

  const dest = path.join(RAIZ, 'src/pages', col.ruta, '[slug].astro');
  await fs.mkdir(path.dirname(dest), { recursive: true });
  await fs.writeFile(dest, astro);

  resumen.push({ col: col.dir, n: items.length, sinTitle: items.filter((i) => !i.title).length });
}

console.log('Fase 1 — paginas de detalle\n');
let total = 0;
for (const r of resumen) {
  console.log(`  /${r.col.padEnd(24)} ${String(r.n).padStart(3)} items${r.sinTitle ? `   !! ${r.sinTitle} sin <title>` : ''}`);
  total += r.n;
}
console.log(`\n  ${total} paginas de detalle`);

if (sinResolverGlobal.size) {
  console.error(`\n  !! ${sinResolverGlobal.size} URLs del CDN de Webflow SIN RESOLVER:`);
  for (const u of [...sinResolverGlobal].slice(0, 15)) console.error(`     ${u}`);
  process.exit(1);
}
console.log('  cero URLs apuntando al CDN de Webflow');

const conSeo = [];
for (const col of COLECCIONES) {
  const d = JSON.parse(await fs.readFile(path.join(FRAG, col.dir, '_items.json'), 'utf8'));
  const n = d.filter((i) => i.tituloSeo).length;
  if (n) conSeo.push(`${col.dir} ${n}/${d.length}`);
}
console.log(`\n  SEO desde el CMS: ${SEO_DESDE_CMS ? 'APLICADO' : 'disponible pero NO aplicado (migracion exacta)'}`);
console.log(`     items con Title SEO en el CMS: ${conSeo.join(' · ')}`);
if (!SEO_DESDE_CMS) console.log('     para aplicarlo: SEO_DESDE_CMS=1 node scripts/generar-detalle.mjs');
