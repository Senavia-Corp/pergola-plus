#!/usr/bin/env node
/**
 * Migracion del contenido a Sanity (proyecto n0ct9t3k, dataset production).
 *
 *     node scripts/migrar-a-sanity.mjs --salida <fichero.ndjson> [--tipos a,b,c]
 *
 * Escribe un NDJSON para `sanity dataset import <fichero> production --replace`. No
 * escribe en Sanity: eso lo hace el import, a mano y con export previo (condicion de
 * la coordinacion, Fase 4).
 *
 * IDEMPOTENTE POR CONSTRUCCION
 *   - `_id` deterministas: `<tipo>-<slug>` o el nombre del singleton. Importar dos
 *     veces con --replace sustituye los mismos documentos, no crea otros.
 *   - SIN PUNTOS en el `_id`: Sanity trata `a.b` como ruta PRIVADA (como `drafts.`) y
 *     no lo sirve sin token aunque el dataset sea publico. Medido el 20-oct-2026: con
 *     `faq.<id>` la API publica devolvia 2 documentos de 293.
 *   - `_key` de los arrays sacados del id del elemento o de su posicion.
 *   - Imagenes como `_sanityAsset: image@file://...`: Sanity las deduplica por sha1.
 *
 * LA FUENTE es la misma que publica hoy el sitio: los modulos de src/data, src/i18n y
 * src/lib cargados con el Vite del build (scripts/sanity/cargar-ts.mjs). Los valores
 * se copian tal cual; lo que no consta no se rellena.
 *
 * REFERENCIAS: fuertes si el destino existe (en el dataset o en esta misma tanda);
 * DEBILES (`_weak`) si todavia no, porque Sanity no deja importar una referencia
 * fuerte a un documento que no existe. Cuando se migre el destino, volver a ejecutar
 * la tanda las deja fuertes sin tocar nada.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { existsSync } from 'node:fs';
import { cargarTs, cerrarTs } from './sanity/cargar-ts.mjs';
import { htmlAPortable } from '../src/lib/portable.mjs';

const RAIZ = path.resolve(import.meta.dirname, '..');
process.chdir(RAIZ);
const args = process.argv.slice(2);
const opt = (n) => (args.includes(n) ? args[args.indexOf(n) + 1] : undefined);
const SALIDA = opt('--salida');
if (!SALIDA) { console.error('uso: migrar-a-sanity.mjs --salida <fichero.ndjson> [--tipos a,b]'); process.exit(1); }

const TODOS = ['siteSettings', 'estimador', 'faqTopic', 'faqTheme', 'faq', 'review', 'blogCategory', 'post', 'legalPage'];
const TIPOS = new Set((opt('--tipos') ?? TODOS.join(',')).split(','));
for (const t of TIPOS) if (!TODOS.includes(t)) throw new Error(`tipo desconocido: ${t}`);

// ---------------------------------------------------------------------------
// Utilidades
// ---------------------------------------------------------------------------

const i18n = (en, es) => {
  if (en == null || en === '') throw new Error(`texto sin version inglesa (es: ${es})`);
  return es == null || es === '' ? { _type: 'textoI18n', en } : { _type: 'textoI18n', en, es };
};
const i18nLargo = (en, es) => ({ ...i18n(en, es), _type: 'textoLargoI18n' });
const clave = (s) => String(s).replace(/[^a-zA-Z0-9_-]/g, '-');

import { idDeRuta } from '../src/lib/rutas-sanity.mjs';
export { idDeRuta };

/** Referencia. Fuerte o debil se decide al final (ver «Referencias», abajo), con el dataset delante. */
const ref = (id) => ({ _type: 'reference', _ref: id });
const refRuta = (ruta) => ref(idDeRuta(ruta).id);

/**
 * Procedencia POR REGLA, documentada; lo demas `sin-clasificar` (lo resuelve la Fase 6).
 *   - /images/cliente/*: fotos que mando el cliente (scripts/optimizar-imagenes-cliente.mjs,
 *     «handoff §6»), salvo las que IMAGENES_CLIENTE (transformar.mjs) documenta como
 *     imagen GENERADA aportada por el cliente (carpeta `regeneradas/`): `ia-cliente`.
 *   - Nada mas se clasifica aqui: no se adivina.
 */
const { IMAGENES_CLIENTE, rutaCliente } = await import('./lib/transformar.mjs');
const REGENERADAS = new Set(Object.values(IMAGENES_CLIENTE).filter((v) => /(^|\/)regeneradas\//.test(v)).map((v) => rutaCliente?.(v)).filter(Boolean));
function procedencia(ruta) {
  if (ruta.startsWith('/images/cliente/')) {
    if (REGENERADAS.has(ruta)) return { procedencia: 'ia-cliente', procedenciaNota: 'Imagen generada que aportó el cliente (17-ago-2026), según transformar.mjs' };
    return { procedencia: 'real-cliente', procedenciaNota: 'Foto enviada por el cliente (handoff §6). Posible ampliación con IA (Topaz) sin verificar en esta fase' };
  }
  return { procedencia: 'sin-clasificar', procedenciaNota: 'Pendiente del inventario de procedencia (Fase 6)' };
}

const assets = new Map();
/** Campo `imagen` desde una ruta de public/. Lanza si el fichero no existe. */
async function imagen(ruta, alt) {
  const fichero = path.join(RAIZ, 'public', ruta.replace(/^\//, '').split('?')[0]);
  await fs.access(fichero).catch(() => { throw new Error(`imagen inexistente: ${ruta}`); });
  assets.set(fichero, ruta);
  return {
    _type: 'imagen',
    _sanityAsset: `image@file://${fichero}`,
    ...(alt ? { decorativa: false, alt: i18n(alt.en, alt.es) } : { decorativa: true }),
    ...procedencia(ruta),
  };
}

/** Diccionario anidado -> [{clave: 'a.b.c', en, es}]. Lanza si EN y ES no tienen las mismas claves. */
function aplanar(en, es, prefijo = '') {
  const filas = [];
  for (const k of Object.keys(en)) {
    const c = prefijo ? `${prefijo}.${k}` : k;
    const ve = en[k], vs = es?.[k];
    if (ve && typeof ve === 'object') filas.push(...aplanar(ve, vs, c));
    else if (typeof ve === 'string') filas.push({ clave: c, en: ve, es: vs });
    else throw new Error(`[aplanar] ${c}: valor no textual (${typeof ve})`);
  }
  const faltan = Object.keys(es ?? {}).filter((k) => !(k in en));
  if (faltan.length) throw new Error(`[aplanar] claves solo en ES bajo «${prefijo}»: ${faltan.join(', ')}`);
  return filas;
}
const textosClave = (filas) => filas.map((f) => ({ _type: 'textoClave', _key: clave(f.clave), clave: f.clave, texto: i18nLargo(f.en, f.es) }));

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

const docs = [];

if (TIPOS.has('siteSettings')) {
  const { NEGOCIO } = await cargarTs('src/lib/jsonld.ts');
  const { TEL, CORREO, DIRECCION, CONTACTO_EN, CONTACTO_ES } = await cargarTs('src/i18n/contacto.ts');
  const resenas = JSON.parse(await fs.readFile('src/data/reviews-google.json', 'utf8'));
  const suite = DIRECCION.match(/Suite\s+[^,]+/)?.[0];
  if (!suite) throw new Error('[siteSettings] DIRECCION sin suite');
  if (!DIRECCION.startsWith(`${NEGOCIO.calle}, ${suite}, ${NEGOCIO.ciudad}, ${NEGOCIO.region} ${NEGOCIO.postal}`)) throw new Error(`[siteSettings] DIRECCION y NEGOCIO no cuadran: ${DIRECCION}`);
  if (CORREO !== NEGOCIO.email) throw new Error('[siteSettings] el correo de contacto y el del JSON-LD no coinciden');
  const e164 = NEGOCIO.telefono.match(/^\+1-(\d{3})-(\d{3})-(\d{4})$/);
  if (!e164) throw new Error(`[siteSettings] telefono del JSON-LD inesperado: ${NEGOCIO.telefono}`);
  const r = resenas.resumenPublico;
  docs.push({
    _id: 'siteSettings',
    _type: 'siteSettings',
    nombreComercial: NEGOCIO.nombre,
    direccion: {
      calle: NEGOCIO.calle,
      suite,
      // Apagado: estado aprobado (la suite solo en la pagina de contacto). Decision de la
      // coordinacion del 20-oct-2026, pendiente de la respuesta del cliente.
      suiteEnTodoElSitio: false,
      ciudad: NEGOCIO.ciudad,
      estado: NEGOCIO.region,
      cp: NEGOCIO.postal,
      pais: NEGOCIO.pais,
    },
    telefonoPrincipal: `(${e164[1]}) ${e164[2]}-${e164[3]}`,
    telefonoContacto: TEL.visible,
    // Apagado, por el mismo motivo.
    telefonoContactoEnTodoElSitio: false,
    correoPublico: CORREO,
    horario: i18n(CONTACTO_EN.datos.horario.valor, CONTACTO_ES.datos.horario.valor),
    horarioEstructurado: { dias: [...NEGOCIO.horario.dias], abre: NEGOCIO.horario.abre, cierra: NEGOCIO.horario.cierra },
    notaCita: i18n(CONTACTO_EN.datos.oficina.nota, CONTACTO_ES.datos.oficina.nota),
    redes: [...NEGOCIO.redes],
    condadosServidos: [...NEGOCIO.condados],
    resumenResenas: { media: r.media, total: r.total, leidoEl: r.leidoEl, fuente: r.fuente },
    logo: await imagen('/images/logo-pergola-plus-florida.png', { en: 'Pergola Plus Florida logo' }),
  });
}

if (TIPOS.has('estimador')) {
  const E = await cargarTs('src/data/estimador.ts');
  const { ESTIMADOR_EN, ESTIMADOR_ES } = await cargarTs('src/i18n/estimador.ts');
  const tarifa = (t) => (t == null ? undefined : {
    min: t.min, max: t.max, techoAbierto: Boolean(t.techoAbierto), fuente: t.fuente, ...(t.nota ? { nota: t.nota } : {}),
  });
  const SUP = { 'losa-ok': 'losaOk', 'pavers-ok': 'paversOk', 'nueva-losa': 'nuevaLosa', 'nueva-pavers': 'nuevaPavers', 'deck-madera': 'deckMadera' };
  const faltanSup = Object.keys(E.SUPERFICIES).filter((k) => !SUP[k]);
  if (faltanSup.length) throw new Error(`[estimador] superficies sin campo: ${faltanSup}`);
  docs.push({
    _id: 'estimador',
    _type: 'estimador',
    productos: await Promise.all(E.PRODUCTOS.map(async (p) => ({
      _type: 'productoEstimador',
      _key: clave(p.id),
      id: p.id,
      producto: refRuta(p.href),
      imagen: await imagen(p.imagen),
      soloCotizacion: p.tarifa === null,
      ...(p.tarifa ? { tarifa: tarifa(p.tarifa) } : {}),
      siempreExenta: Boolean(p.siempreExenta),
    }))),
    montaje: { adosada: E.MONTAJE.adosada, exenta: E.MONTAJE.exenta },
    superficies: Object.fromEntries(Object.entries(E.SUPERFICIES).map(([k, t]) => [SUP[k], tarifa(t)])),
    ingenieria: tarifa(E.INGENIERIA),
    condados: E.CONDADOS.map((c) => ({ _type: 'condadoEstimador', _key: c.id, id: c.id, desde: c.desde, hasta: c.hasta, min: c.min, max: c.max })),
    waterfront: tarifa(E.WATERFRONT),
    mejoras: E.MEJORAS.map((m) => ({
      _type: 'mejoraEstimador', _key: clave(m.id), id: m.id, ...(m.grupo ? { grupo: m.grupo } : {}),
      seConfirmaEnVisita: m.tarifa === null, ...(m.tarifa ? { tarifa: tarifa(m.tarifa) } : {}),
    })),
    medidas: { minFt: E.MIN_FT, maxFt: E.MAX_FT, anchoPorDefecto: E.ANCHO_POR_DEFECTO, largoPorDefecto: E.LARGO_POR_DEFECTO, presetPorDefecto: E.PRESET_POR_DEFECTO },
    presets: E.PRESETS.map((p) => ({ _type: 'presetEstimador', _key: p.id, id: p.id, ancho: p.ancho, largo: p.largo })),
    textos: textosClave(aplanar(ESTIMADOR_EN, ESTIMADOR_ES)),
  });
}

if (TIPOS.has('faqTopic') || TIPOS.has('faqTheme') || TIPOS.has('faq')) {
  const { CHIPS, FAQS } = await cargarTs('src/data/faqs.ts');
  const { CHIPS_COPY, TEMAS_COPY, FAQS_COPY } = await cargarTs('src/i18n/faqs.es.ts');
  if (TIPOS.has('faqTopic')) {
    CHIPS.forEach((c, i) => docs.push({ _id: `faqTopic-${c}`, _type: 'faqTopic', clave: c, nombre: i18n(CHIPS_COPY.en[c], CHIPS_COPY.es[c]), orden: i }));
  }
  if (TIPOS.has('faqTheme')) {
    Object.keys(TEMAS_COPY.en).forEach((t, i) => docs.push({ _id: `faqTheme-${t}`, _type: 'faqTheme', clave: t, nombre: i18n(TEMAS_COPY.en[t], TEMAS_COPY.es[t]), orden: i }));
  }
  if (TIPOS.has('faq')) {
    FAQS.forEach((f, i) => {
      const en = FAQS_COPY.en[f.id], es = FAQS_COPY.es[f.id];
      if (!en) throw new Error(`[faq] ${f.id} sin copy en ingles`);
      if (!TEMAS_COPY.en[f.tema]) throw new Error(`[faq] ${f.id}: tema sin nombre ${f.tema}`);
      docs.push({
        _id: `faq-${f.id}`,
        _type: 'faq',
        idEstable: f.id,
        pregunta: i18n(en.pregunta, es?.pregunta),
        respuesta: i18nLargo(en.respuesta, es?.respuesta),
        ...(en.claves ? { sinonimos: i18n(en.claves, es?.claves) } : {}),
        chip: ref(`faqTopic-${f.chip}`, 'faqTopic'),
        tema: ref(`faqTheme-${f.tema}`, 'faqTheme'),
        origen: f.origen,
        ...(f.enlace ? { enlace: refRuta(f.enlace) } : {}),
        destacada: Boolean(f.destacada),
        ...(f.claves?.length ? { claves: [...f.claves] } : {}),
        orden: i,
      });
    });
  }
}

if (TIPOS.has('review')) {
  // SOLO las reales (condicion S11). reviews-plantilla.json es relleno en latin por
  // escrito («No son resenas: es TEXTO DE RELLENO») y NO se migra.
  const g = JSON.parse(await fs.readFile('src/data/reviews-google.json', 'utf8'));
  g.resenas.forEach((r, i) => docs.push({
    _id: `review-${clave(r.id)}`,
    _type: 'review',
    idOrigen: r.id,
    autor: r.autor,
    fecha: r.fechaISO,
    idioma: r.idioma,
    estrellas: r.rating,
    texto: r.texto,
    ...(r.respuestaDueño ? { respuestaDueno: r.respuestaDueño } : {}),
    ...(r.urlOrigen ? { enlace: r.urlOrigen } : {}),
    fuente: 'google',
    leidoEl: g.resumenPublico.leidoEl,
    orden: i,
  }));
}

if (TIPOS.has('blogCategory')) {
  const { categorias, copyDe } = await cargarTs('src/lib/blog.ts');
  const { CATEGORIAS_ES, COPY_CATEGORIAS_ES } = await cargarTs('src/i18n/blog.es.ts');
  for (const c of categorias) {
    const conPagina = c.total > 0;
    const en = conPagina ? copyDe(c) : null;
    const es = COPY_CATEGORIAS_ES[c.slug];
    docs.push({
      _id: `blogCategory-${c.slug}`,
      _type: 'blogCategory',
      nombre: i18n(c.nombre, CATEGORIAS_ES[c.slug]),
      slug: { _type: 'slug', current: c.slug },
      tienePagina: conPagina,
      ...(en ? {
        descripcion: i18nLargo(en.intro, es?.intro),
        seo: { _type: 'seo', titulo: i18n(en.titulo, es?.titulo), descripcion: i18nLargo(en.meta, es?.meta), indexable: true },
      } : {}),
    });
  }
}

if (TIPOS.has('post') || TIPOS.has('legalPage')) {
  // La MISMA extraccion que la prueba de paridad (scripts/sanity/ida-y-vuelta.mjs): el
  // cuerpo tal como lo pinta hoy el sitio, en ingles y en español.
  const { textosEnriquecidos } = await import('./sanity/ida-y-vuelta.mjs');
  const casos = await textosEnriquecidos();
  const html = (tipo, slug, idioma) => casos.find((c) => c.tipo === tipo && c.slug === slug && c.idioma === idioma)?.html;
  const DIST = path.join(RAIZ, 'dist/client');
  if (!existsSync(DIST)) throw new Error('falta dist/: los enlaces internos se resuelven contra el build (npm run build)');
  /** Ruta interna -> referencia al documento que la pinta, si es una pagina del build; si no, null (se queda como href). */
  const enlaceInterno = (href) => {
    const [ruta, ancla] = href.split('#');
    const p = ruta.replace(/\/+$/, '') || '/';
    if (!existsSync(path.join(DIST, p === '/' ? '' : p, 'index.html'))) return null;
    return { destino: refRuta(p), ...(ancla ? { ancla } : {}) };
  };
  const pendientes = [];
  const aPortable = (h) => htmlAPortable(h, {
    enlaceInterno,
    imagen: (src, alt) => {
      const fichero = path.join(RAIZ, 'public', src.replace(/^\//, ''));
      pendientes.push(fichero);
      assets.set(fichero, src);
      return { _type: 'imagenCuerpo', _sanityAsset: `image@file://${fichero}`, alt, ...procedencia(src) };
    },
  });
  const bloqueI18n = (en, es) => ({ _type: 'bloqueI18n', en: aPortable(en), ...(es ? { es: aPortable(es) } : {}) });

  if (TIPOS.has('post')) {
    const { posts } = await cargarTs('src/lib/blog.ts');
    const { POSTS_ES } = await cargarTs('src/i18n/blog.es.ts');
    const { ALTS_ES } = await import('./lib/posts.mjs');
    const items = JSON.parse(await fs.readFile('src/contenido-migrado/post/_items.json', 'utf8'));
    for (const p of posts) {
      const item = items.find((x) => x.slug === p.slug);
      if (!item) throw new Error(`[post] ${p.slug} sin _items.json`);
      const es = POSTS_ES[p.slug];
      const cuerpoEs = html('post', p.slug, 'es');
      if (Boolean(es) !== Boolean(cuerpoEs)) throw new Error(`[post] ${p.slug}: metadatos ES y cuerpo ES no van a la par`);
      docs.push({
        _id: `post-${p.slug}`,
        _type: 'post',
        titulo: i18n(p.titulo, es?.titulo),
        slug: { _type: 'slug', current: p.slug },
        tituloLargo: i18n(p.tituloLargo, es?.tituloLargo),
        resumen: i18nLargo(p.resumen, es?.resumen),
        principal: await imagen(p.principal.src, p.altPrincipal ? { en: p.altPrincipal, es: ALTS_ES[p.altPrincipal] } : null),
        miniatura: await imagen(p.miniatura.src, p.altMiniatura ? { en: p.altMiniatura, es: ALTS_ES[p.altMiniatura] } : null),
        cuerpo: bloqueI18n(html('post', p.slug, 'en'), cuerpoEs),
        categoria: ref(`blogCategory-${p.categoria.slug}`, 'blogCategory'),
        destacado: p.destacadoCms,
        principalDelBlog: p.esHero,
        fechaCreacion: p.creado.toISOString(),
        fechaPublicacion: p.publicado.toISOString(),
        fechaActualizacion: p.actualizado.toISOString(),
        seo: {
          _type: 'seo',
          titulo: i18n(item.title, es?.tituloLargo),
          ...(item.description ? { descripcion: i18nLargo(item.description, es?.descripcionSeo) } : {}),
          indexable: true,
        },
      });
    }
  }

  if (TIPOS.has('legalPage')) {
    const { ARTICULOS_ES } = await cargarTs('src/i18n/articulos.es.ts');
    const items = JSON.parse(await fs.readFile('src/contenido-migrado/articles/_items.json', 'utf8'));
    for (const item of items) {
      const en = html('legalPage', item.slug, 'en');
      const h1 = en.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1]?.replace(/<[^>]*>/g, '');
      if (!h1) throw new Error(`[legalPage] ${item.slug} sin <h1>`);
      const t = ARTICULOS_ES[item.slug];
      const { decodificar } = await import('../src/lib/portable.mjs');
      docs.push({
        _id: `legalPage-${item.slug}`,
        _type: 'legalPage',
        titulo: i18n(decodificar(h1).trim(), t?.nombre),
        slug: { _type: 'slug', current: item.slug },
        cuerpo: bloqueI18n(en, html('legalPage', item.slug, 'es')),
        seo: { _type: 'seo', titulo: i18n(item.title, t?.title), descripcion: i18nLargo(item.description, t?.description), indexable: true },
      });
    }
  }
  for (const f of pendientes) await fs.access(f).catch(() => { throw new Error(`imagen del cuerpo inexistente: ${f}`); });
}

await cerrarTs();

// ---------------------------------------------------------------------------
// Salida
// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// Referencias: debiles solo si el destino no existe aun
// ---------------------------------------------------------------------------
const consultaPublica = async (q) => {
  const u = new URL('https://n0ct9t3k.api.sanity.io/v2025-01-01/data/query/production');
  u.searchParams.set('query', q);
  const r = await fetch(u);
  if (!r.ok) throw new Error(`consulta a Sanity: ${r.status}`);
  return (await r.json()).result;
};
const destinos = new Set([...(await consultaPublica('*[!(_id in path("_.**"))]._id')), ...docs.map((d) => d._id)]);
const sinDestino = new Set();
const fijarRefs = (x) => {
  if (Array.isArray(x)) return x.forEach(fijarRefs);
  if (!x || typeof x !== 'object') return;
  if (x._type === 'reference') {
    if (destinos.has(x._ref)) delete x._weak; else { x._weak = true; sinDestino.add(x._ref); }
    return;
  }
  Object.values(x).forEach(fijarRefs);
};
fijarRefs(docs);

const ids = new Set();
for (const d of docs) {
  if (ids.has(d._id)) throw new Error(`_id repetido: ${d._id}`);
  if (d._id.includes('.')) throw new Error(`_id con punto (seria privado en la API publica): ${d._id}`);
  ids.add(d._id);
}
await fs.mkdir(path.dirname(path.resolve(SALIDA)), { recursive: true });
await fs.writeFile(SALIDA, docs.map((d) => JSON.stringify(d)).join('\n') + '\n');
const porTipo = {};
for (const d of docs) porTipo[d._type] = (porTipo[d._type] ?? 0) + 1;
const debiles = JSON.stringify(docs).match(/"_weak":true/g)?.length ?? 0;
const resumen = { documentos: docs.length, porTipo, imagenes: assets.size, referenciasDebiles: debiles, destinosQueFaltan: [...sinDestino].sort(), salida: path.resolve(SALIDA) };
console.log(JSON.stringify(resumen, null, 1));
await fs.writeFile(SALIDA.replace(/\.ndjson$/, '') + '.resumen.json', JSON.stringify(resumen, null, 1) + '\n');
