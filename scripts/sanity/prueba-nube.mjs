#!/usr/bin/env node
/**
 * Prueba de «crear sin tocar codigo»: un documento NUEVO de cada coleccion con pagina
 * (y una pregunta frecuente) tiene que dar una pagina valida y salir en sus listados.
 *
 *     node scripts/sanity/prueba-nube.mjs --crear     # crea los prueba-nube-*
 *     # PP_FUENTE=sanity npm run build && comprobaciones
 *     node scripts/sanity/prueba-nube.mjs --borrar    # los borra (solo ese prefijo)
 *
 * Cada documento es la copia de uno migrado (su estructura y su contenido, como lo
 * dejaria un editor que rellena la plantilla inicial del Studio) con `_id`, slug, nombre
 * y SEO de prueba. Necesita SANITY_AUTH_TOKEN (permiso de escritura); no lo imprime.
 */
import fs from 'node:fs/promises';
import path from 'node:path';

const RAIZ = path.resolve(import.meta.dirname, '../..');
const PREFIJO = 'prueba-nube-';
const P = process.env.SANITY_PROJECT_ID ?? 'n0ct9t3k', D = process.env.SANITY_DATASET ?? 'production', V = process.env.SANITY_API_VERSION ?? '2025-01-01';
const TOKEN = process.env.SANITY_AUTH_TOKEN;
if (!TOKEN) { console.error('falta SANITY_AUTH_TOKEN'); process.exit(2); }
const api = async (ruta, cuerpo) => {
  const r = await fetch(`https://${P}.api.sanity.io/v${V}/data/${ruta}/${D}${cuerpo ? '?returnIds=true' : ''}`, {
    method: cuerpo ? 'POST' : 'GET', headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' }, body: cuerpo && JSON.stringify(cuerpo),
  });
  if (!r.ok) throw new Error(`${ruta}: HTTP ${r.status} ${await r.text()}`);
  return r.json();
};

/** Los modelos: de que documento migrado se copia cada uno. */
const MODELOS = {
  product: 'product-cabanas',
  service: 'service-pavers',
  brand: 'brand-apollo',
  project: 'project-custom-sukkah-pergola-at-boca-beach',
  city: 'city-coral-gables',
  post: 'post-pergola-cost-south-florida',
  faq: 'faq-aluminio-vs-madera',
};

if (process.argv.includes('--crear')) {
  const c = JSON.parse(await fs.readFile(path.join(RAIZ, '.cache/sanity/contenido.json'), 'utf8'));
  const docs = [];
  for (const [tipo, id] of Object.entries(MODELOS)) {
    const m = c.docs.find((d) => d._id === id);
    if (!m) throw new Error(`falta el modelo ${id}`);
    const { _rev, _createdAt, _updatedAt, ...d } = structuredClone(m);
    d._id = `${PREFIJO}${tipo}`;
    const nombre = { _type: 'textoI18n', en: `Prueba Nube ${tipo}`, es: `Prueba Nube ${tipo}` };
    if (d.slug) d.slug = { _type: 'slug', current: `${PREFIJO}${tipo}` };
    if (d.nombre) d.nombre = nombre;
    if (tipo === 'post') { d.titulo = nombre; d.tituloLargo = { ...nombre, es: `${nombre.es} (es) | Pergola Plus Florida` }; d.principalDelBlog = false; d.destacado = false; delete d.lectura; delete d.tarjetas; }
    if (d.seo) {
      d.seo = {
        ...d.seo,
        titulo: { _type: 'textoI18n', en: `Prueba Nube ${tipo} | Pergola Plus Florida`, es: `Prueba Nube ${tipo} (es) | Pergola Plus Florida` },
        descripcion: { _type: 'textoLargoI18n', en: `Prueba Nube ${tipo}: documento de prueba de la creacion desde el Studio, que se borra al terminar la prueba.`, es: `Prueba Nube ${tipo}: documento de prueba de la creación desde el Studio, que se borra al terminar la prueba.` },
      };
    }
    // El proyecto de prueba lleva el producto de prueba (sección «One We Built» de su ficha).
    if (tipo === 'project') d.productos = [{ _type: 'reference', _ref: `${PREFIJO}product`, _key: 'prueba' }];
    // Al final de cada listado.
    for (const t of d.tarjetas ?? []) for (const v of t.valores ?? []) if (v.clave === 'orden') v.valor = '999';
    if (tipo === 'faq') { d.idEstable = `${PREFIJO}faq`; d.destacada = false; d.pregunta = { _type: 'textoI18n', en: 'Prueba Nube: pregunta de prueba?', es: '¿Prueba Nube: pregunta de prueba?' }; d.orden = 999; }
    docs.push(d);
  }
  const r = await api('mutate', { mutations: docs.map((d) => ({ createOrReplace: d })) });
  console.log(JSON.stringify(r.results.map((x) => `${x.operation} ${x.id}`)));
} else if (process.argv.includes('--borrar')) {
  const r = await api('mutate', { mutations: [{ delete: { query: `*[string::startsWith(_id, "${PREFIJO}") || string::startsWith(_id, "drafts.${PREFIJO}")]` } }] });
  console.log(JSON.stringify(r.results.map((x) => `${x.operation} ${x.id}`)));
} else {
  console.error('uso: prueba-nube.mjs --crear | --borrar');
  process.exit(2);
}
