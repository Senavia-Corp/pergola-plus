#!/usr/bin/env node
/**
 * Huecos del dataset que el usuario pidio rellenar para la entrega (chat, 21-oct-2026),
 * aunque algunos se ven en el sitio:
 *   - `faq.enlace` («saber mas» de /resources/faq): la ficha del tema de la pregunta y, en
 *     los temas generales, el articulo o la pagina que trata eso (ENLACE_TEMA);
 *   - `retocadaConIA: false` en toda imagen con procedencia que no lo tenga (autorizado
 *     por el usuario: ninguna foto consta como retocada con IA);
 *   - `nota` de las 3 cifras publicadas del estimador que no la tenian (de
 *     src/data/estimador.ts);
 *   - `faqsPromovidas` de la unica ficha que no tenia (3 preguntas generales);
 *   - `descripcion` y `seo` de las 3 categorias del blog sin posts ni pagina (indexable: false);
 *   - `faq.claves` («terminos que no se traducen») de las 23 FAQ cuyo texto trae alguno
 *     (siglas, marcas, condados, unidades) igual en ingles y en español: claves-faq.json.
 *     Las otras 196 no traen ninguno, y vacio es su valor.
 *
 *     (cd studio && npx sanity exec ../scripts/sanity/completar-entrega.mjs --with-user-token [-- --aplicar])
 *
 * Solo escribe lo que falta, con ifRevisionID, y no toca un documento editado despues de
 * la ultima migracion salvo con --hasta (ediciones propias, comprobado antes).
 */
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const RAIZ = path.resolve(import.meta.dirname, '../..');
const { getCliClient } = await import(createRequire(path.join(RAIZ, 'studio/package.json')).resolve('sanity/cli'));
const c = getCliClient({ apiVersion: '2025-01-01' });
const hasta = process.argv.includes('--hasta') ? process.argv[process.argv.indexOf('--hasta') + 1] : null;
const ultimaMigracion = hasta ?? JSON.parse(fs.readFileSync(path.join(RAIZ, 'src/data/sanity-migracion.json'), 'utf8')).ultimaMigracion;

/** Temas sin ficha propia: a donde manda «saber mas». */
const ENLACE_TEMA = {
  'general-permisos': 'post-pergola-permit-south-florida',
  'general-materiales': 'post-best-pergola-materials-coastal-florida',
  'general-precios': 'post-pergola-cost-south-florida',
  'general-proceso': 'post-design-build-pergola-process-south-florida',
  'general-pergolas': 'service-pergola-design-construction',
  'general-empresa': 'page-about-us__about-us',
};
const NOTAS_ESTIMADOR = {
  ingenieria: 'Guía de costes de Pergola Plus: la banda entera es la publicada; el condado decide dónde cae',
  'superficies.losaOk': 'Guía de costes de Pergola Plus: sobre una losa que sirve no hay coste de base',
  'superficies.paversOk': 'Guía de costes de Pergola Plus: sobre pavers que sirven no hay coste de base',
};
const PROMOVIDAS = { 'service-pergola-design-construction': ['faq-pergola-fabricacion-medida', 'faq-pergola-adosada-vs-exenta', 'faq-pergola-orientacion'] };
const CLAVES = JSON.parse(fs.readFileSync(path.join(import.meta.dirname, 'claves-faq.json'), 'utf8'));
const t = (en, es) => ({ _type: 'textoI18n', en, es });
const tl = (en, es) => ({ _type: 'textoLargoI18n', en, es });
const CATEGORIAS = {
  'blogCategory-commercial-projects': {
    descripcion: tl('Pergolas, shade structures and outdoor builds for restaurants, hotels, offices and HOAs in South Florida.',
      'Pérgolas, estructuras de sombra y obras exteriores para restaurantes, hoteles, oficinas y HOA del sur de Florida.'),
    titulo: t('Commercial Projects | Pergola Plus Florida', 'Proyectos comerciales | Pergola Plus Florida'),
  },
  'blogCategory-patio-hardscape-services': {
    descripcion: tl('Pavers, driveways, concrete, decks and fences: articles on the hardscape work around South Florida homes.',
      'Pavers, entradas, concreto, decks y cercas: artículos sobre los pavimentos y la obra exterior de las casas del sur de Florida.'),
    titulo: t('Patio & Hardscape Services | Pergola Plus Florida', 'Patios y pavimentos | Pergola Plus Florida'),
  },
  'blogCategory-service-areas': {
    descripcion: tl('Building pergolas and outdoor structures across Miami-Dade, Broward and Palm Beach: permits, climate and local projects.',
      'Pérgolas y estructuras exteriores en Miami-Dade, Broward y Palm Beach: permisos, clima y proyectos de la zona.'),
    titulo: t('Service Areas | Pergola Plus Florida', 'Zonas de servicio | Pergola Plus Florida'),
  },
};

const docs = await c.fetch('*[!(_id in path("drafts.**")) && !(_type match "sanity.*")]');
const porId = new Map(docs.map((d) => [d._id, d]));
const ss = porId.get('siteSettings');
const fichaDe = new Map(docs.filter((d) => ['product', 'service'].includes(d._type)).map((d) => [d.slug.current, d._id]));
const parches = [], saltados = [], cuenta = {};
const suma = (k, n = 1) => (cuenta[k] = (cuenta[k] ?? 0) + n);

for (const d of docs) {
  const set = {};
  // retocadaConIA: los campos de primer nivel que contienen imagenes, enteros.
  for (const [k, v] of Object.entries(d)) {
    if (k.startsWith('_') || !v || typeof v !== 'object') continue;
    let n = 0;
    const copia = structuredClone(v);
    const andar = (x) => {
      if (Array.isArray(x)) return x.forEach(andar);
      if (!x || typeof x !== 'object') return;
      if (x.procedencia && x.retocadaConIA == null) { x.retocadaConIA = false; n++; }
      Object.values(x).forEach(andar);
    };
    andar(copia);
    if (n) { set[k] = copia; suma('retocadaConIA', n); }
  }
  if (d._type === 'faq' && !d.enlace) {
    const tema = porId.get(d.tema?._ref)?.clave;
    const destino = fichaDe.get(tema) ?? ENLACE_TEMA[tema];
    if (destino && porId.has(destino)) { set.enlace = { _type: 'reference', _ref: destino }; suma('faq.enlace'); }
    else suma(`faq sin destino (${tema})`);
  }
  if (d._id === 'estimador') {
    for (const [ruta, nota] of Object.entries(NOTAS_ESTIMADOR)) {
      const tramo = ruta.split('.').reduce((x, p) => x?.[p], d);
      if (tramo && !tramo.nota) { set[`${ruta}.nota`] = nota; suma('estimador.nota'); }
    }
  }
  if (PROMOVIDAS[d._id] && !d.faqsPromovidas?.length) {
    set.faqsPromovidas = PROMOVIDAS[d._id].map((id) => ({ _type: 'reference', _ref: id, _key: id }));
    suma('faqsPromovidas', PROMOVIDAS[d._id].length);
  }
  if (CATEGORIAS[d._id]) {
    const k = CATEGORIAS[d._id];
    if (!d.descripcion) { set.descripcion = k.descripcion; suma('blogCategory.descripcion'); }
    if (!d.seo) {
      set.seo = { _type: 'seo', indexable: false, titulo: k.titulo, descripcion: k.descripcion, imagenOg: { ...ss.imagenOgPorDefecto, retocadaConIA: false } };
      suma('blogCategory.seo');
    } else if (d.seo.indexable == null) { set['seo.indexable'] = false; suma('blogCategory.seo.indexable'); }
  }
  if (CLAVES[d._id] && !d.claves?.length) { set.claves = CLAVES[d._id]; suma('faq.claves', CLAVES[d._id].length);
  }
  if (!Object.keys(set).length) continue;
  if (d._updatedAt > ultimaMigracion) { saltados.push(`${d._id} (${d._updatedAt})`); continue; }
  parches.push({ id: d._id, rev: d._rev, set });
}
console.log(JSON.stringify(cuenta));
console.log(`${parches.length} documentos; editados en el Studio, sin tocar: ${saltados.length ? saltados.join(', ') : 'ninguno'}`);
if (process.argv.includes('--aplicar') && parches.length) {
  for (let i = 0; i < parches.length; i += 50) {
    const tx = parches.slice(i, i + 50).reduce((tr, p) => tr.patch(p.id, (q) => q.ifRevisionId(p.rev).set(p.set)), c.transaction());
    console.log(`aplicado: ${(await tx.commit()).results.length} documentos`);
  }
}
