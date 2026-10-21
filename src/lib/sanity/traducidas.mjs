/**
 * Lo que la instantanea del dataset aporta a los mapas que se leen tambien FUERA de Vite
 * (astro.config.mjs y scripts/lib/transformar.mjs): las rutas con version española
 * (src/i18n/rutas.mjs) y las ciudades y condados (src/data/ubicaciones.mjs). Asi una
 * pagina o una ciudad creada en el Studio entra en el hreflang, el sitemap, los enlaces
 * de /es/ y enlazarCiudades() sin tocar codigo.
 *
 * Solo con PP_FUENTE=sanity; la instantanea la deja scripts/sanity/instantanea.mjs antes
 * del build. Sin ella (p. ej. la funcion /api/lead en Vercel) devuelve null y valen los
 * literales del repo.
 */
import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';

let DOCS;
export function docsSanity() {
  if (DOCS !== undefined) return DOCS;
  const f = path.resolve(process.cwd(), '.cache/sanity/contenido.json');
  DOCS = process.env.PP_FUENTE === 'sanity' && existsSync(f) ? JSON.parse(readFileSync(f, 'utf8')).docs : null;
  return DOCS;
}

/** Prefijo de cada coleccion con pagina, y si tiene version española (las mismas condiciones que src/pages/es/). */
const COLECCIONES = {
  city: ['/pergolas-contractors/', (d) => Boolean(d.nombre?.es)],
  county: ['/countries/', (d) => Boolean(d.nombre?.es)],
  product: ['/products/', (d) => Boolean(d.nombre?.es)],
  service: ['/services/', (d) => Boolean(d.nombre?.es)],
  brand: ['/brands/', (d) => Boolean(d.nombre?.es)],
  project: ['/project/', (d) => Boolean(d.nombre?.es)],
  post: ['/post/', (d) => Boolean(d.titulo?.es && d.cuerpo?.es?.length)],
  legalPage: ['/articles/', (d) => Boolean(d.cuerpo?.es?.length)],
};
export const PREFIJOS_COLECCION = [...Object.values(COLECCIONES).map(([p]) => p), '/resources/blog/'];

/** ruta inglesa (sin barra) -> ruta española (con barra), de las colecciones. */
export function traducidasDesde(docs) {
  const out = {};
  for (const d of docs) {
    const c = COLECCIONES[d._type];
    if (c && d.slug?.current && c[1](d)) out[`${c[0]}${d.slug.current}`] = `/es${c[0]}${d.slug.current}/`;
  }
  // Las categorias del blog con articulos (las que tienen pagina en los dos idiomas).
  const conPosts = new Set(docs.filter((d) => d._type === 'post').map((d) => d.categoria?._ref));
  for (const d of docs) if (d._type === 'blogCategory' && conPosts.has(d._id)) out[`/resources/blog/${d.slug.current}`] = `/es/resources/blog/${d.slug.current}/`;
  return out;
}

/**
 * El mapa de rutas traducidas con las colecciones de Sanity: las estaticas como en el
 * repo y, de las colecciones, las que tienen español en el dataset (en el orden del repo
 * y las nuevas detras).
 */
export function conColeccionesDeSanity(repo) {
  const docs = docsSanity();
  if (!docs) return repo;
  const sanity = traducidasDesde(docs);
  const deColeccion = (r) => PREFIJOS_COLECCION.some((p) => r.startsWith(p));
  const out = {};
  for (const [en, es] of Object.entries(repo)) if (!deColeccion(en) || sanity[en]) out[en] = es;
  for (const [en, es] of Object.entries(sanity)) if (!(en in out)) out[en] = es;
  return out;
}

/**
 * CIUDADES y CONDADOS de src/data/ubicaciones.mjs desde los documentos city y county, en
 * el orden del repo (lo que ya existe) y las nuevas detras.
 */
export function ubicacionesSanity(repo) {
  const docs = docsSanity();
  if (!docs) return null;
  const condados = docs.filter((d) => d._type === 'county');
  const nombre = new Map(condados.map((d) => [d._id, d.nombre.en]));
  const enOrden = (pares, orden) => Object.fromEntries([...pares].sort(([a], [b]) => (orden.indexOf(a) + 1 || Infinity) - (orden.indexOf(b) + 1 || Infinity) || a.localeCompare(b)));
  return {
    CONDADOS: enOrden(condados.map((d) => [d.slug.current, d.nombre.en]), Object.keys(repo.CONDADOS)),
    CIUDADES: enOrden(docs.filter((d) => d._type === 'city').map((d) => [d.slug.current, { municipio: d.nombre.en, condado: nombre.get(d.condado?._ref) }]), Object.keys(repo.CIUDADES)),
  };
}
