/**
 * Ruta del sitio <-> `_id` del documento de Sanity que la pinta, para los documentos
 * MIGRADOS (ids deterministas `<tipo>-<slug>`, sin puntos: un `_id` con punto es privado
 * en la API publica). Lo usan la migracion (scripts/migrar-a-sanity.mjs) y el render.
 *
 * Los documentos creados en el Studio llevan `_id` aleatorio: su ruta sale de su tipo y
 * su slug (`rutaDe`), no de aqui.
 */
const PREFIJOS = {
  product: '/products/', service: '/services/', brand: '/brands/', project: '/project/', post: '/post/',
  city: '/pergolas-contractors/', county: '/countries/', legalPage: '/articles/', blogCategory: '/resources/blog/',
};
const POR_RUTA = Object.fromEntries(Object.entries(PREFIJOS).map(([t, p]) => [p, t]));

/** '/products/cabanas' -> { tipo: 'product', id: 'product-cabanas' }; las estaticas -> page-<ruta>. */
export function idDeRuta(ruta) {
  const r = ruta.replace(/[?#].*$/, '').replace(/\/+$/, '') || '/';
  for (const [prefijo, tipo] of Object.entries(POR_RUTA)) {
    if (r.startsWith(prefijo) && !r.slice(prefijo.length).includes('/') && r.length > prefijo.length) {
      return { tipo, id: `${tipo}-${r.slice(prefijo.length)}` };
    }
  }
  return { tipo: 'page', id: `page-${r === '/' ? 'index' : r.slice(1).replace(/\//g, '__')}` };
}

/** Ruta sin barra final (la forma canonica la pone `canonica()`), desde el tipo y el slug o la ruta de la pagina. */
export function rutaDe({ _type, slug, ruta }) {
  if (_type === 'page') return ruta;
  const prefijo = PREFIJOS[_type];
  if (!prefijo || !slug) throw new Error(`[rutas] sin ruta para ${_type}`);
  return prefijo + (slug.current ?? slug);
}

/** La inversa de idDeRuta para un id migrado. */
export function rutaDeId(id) {
  const m = id.match(/^([a-zA-Z]+)-(.+)$/);
  if (!m) throw new Error(`[rutas] id no migrado: ${id}`);
  if (m[1] === 'page') return m[2] === 'index' ? '/' : '/' + m[2].replace(/__/g, '/');
  if (!PREFIJOS[m[1]]) throw new Error(`[rutas] tipo sin ruta: ${m[1]}`);
  return PREFIJOS[m[1]] + m[2];
}
