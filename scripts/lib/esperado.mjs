/**
 * Lo que las puertas esperan contar en dist/: con la fuente sanity (la de por defecto) sale de la instantanea
 * del dataset (.cache/sanity/contenido.json), asi que un documento creado en el Studio no
 * hace fallar una puerta por haber uno mas; con el repo, son las cifras migradas.
 *
 * Lo que se comprueba no cambia: que se construye EXACTAMENTE lo que hay en la fuente.
 */
import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { FUENTE } from '../../src/lib/sanity/fuente-elegida.mjs';

const RAIZ = path.resolve(import.meta.dirname, '../..');
const f = path.join(RAIZ, '.cache/sanity/contenido.json');
const docs = FUENTE === 'sanity' && existsSync(f) ? JSON.parse(readFileSync(f, 'utf8')).docs : null;
export const FUENTE_ESPERADO = docs ? 'sanity' : 'repo';
const de = (t) => docs.filter((d) => d._type === t);

/** Posts publicados en total y por categoria (slug). */
export function blog() {
  if (!docs) {
    return {
      total: 21,
      porCategoria: { 'buying-guides-cost': 9, 'outdoor-living-design': 6, 'materials-engineering': 3, 'pergolas-shade-systems': 2, 'maintenance-care': 1 },
      sinRuta: ['commercial-projects', 'patio-hardscape-services', 'service-areas'],
    };
  }
  const cats = new Map(de('blogCategory').map((c) => [c._id, c.slug.current]));
  const porCategoria = {};
  for (const p of de('post')) { const s = cats.get(p.categoria?._ref); porCategoria[s] = (porCategoria[s] ?? 0) + 1; }
  return { total: de('post').length, porCategoria, sinRuta: [...cats.values()].filter((s) => !porCategoria[s]) };
}

/** Fichas construidas: productos y servicios (en ingles mas en español) y servicios en español. */
export function fichas() {
  if (!docs) return { productos: 20, servicios: 14, serviciosEs: 7 };
  const es = (t) => de(t).filter((d) => d.nombre?.es).length;
  return { productos: de('product').length + es('product'), servicios: de('service').length + es('service'), serviciosEs: es('service') };
}

/** Paginas de ciudad (en ingles). */
export const ciudades = () => (docs ? de('city').length : 25);
