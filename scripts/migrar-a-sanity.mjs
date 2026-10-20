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

const TODOS = ['siteSettings', 'estimador', 'faqTopic', 'faqTheme', 'faq', 'review', 'blogCategory', 'post', 'legalPage', 'county', 'city', 'product', 'service', 'brand', 'project', 'page', 'navigation'];
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

import { idDeRuta, rutaDeId } from '../src/lib/rutas-sanity.mjs';
import { desdeDocumento } from '../src/lib/sanity/especificaciones.mjs';
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
/**
 * Ruta de public/ de la que sale la imagen. Sanity deduplica los assets por sha1 y hay
 * ficheros identicos en dos rutas (4 hoy) con distinto juego srcset: el build usa esta
 * ruta mientras el asset sea el de ese fichero (el sha1 va en su id) y descarga el
 * nuevo si el editor cambia la foto.
 */
const origenDe = (fichero) => '/' + path.relative(path.join(RAIZ, 'public'), fichero);
/** Campo `imagen` desde una ruta de public/. Lanza si el fichero no existe. */
async function imagen(ruta, alt) {
  const fichero = path.join(RAIZ, 'public', ruta.replace(/^\//, '').split('?')[0]);
  await fs.access(fichero).catch(() => { throw new Error(`imagen inexistente: ${ruta}`); });
  assets.set(fichero, ruta);
  return {
    _type: 'imagen',
    _sanityAsset: `image@file://${fichero}`,
    origen: origenDe(fichero),
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
      return { _type: 'imagenCuerpo', _sanityAsset: `image@file://${fichero}`, origen: origenDe(fichero), alt, ...procedencia(src) };
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

// ---------------------------------------------------------------------------
// Colecciones con plantilla (src/plantillas/<tipo>.html)
// ---------------------------------------------------------------------------
const CON_PLANTILLA = ['county', 'city', 'product', 'service', 'brand', 'project'].filter((t) => TIPOS.has(t));
const tarjetas = {};
if (CON_PLANTILLA.length || TIPOS.has('page') || TIPOS.has('navigation')) {
  const { paginasDe, derivarColeccion, derivarReferencias } = await import('./sanity/plantillas.mjs');
  const { aBloques, opcionalesA, plano, CAMPOS_OPCIONALES } = await import('../src/lib/plantilla-sanity.mjs');
  const { decodificar } = await import('../src/lib/portable.mjs');
  const ES_DE = {
    product: async () => (await cargarTs('src/i18n/productos.es.ts')).PRODUCTOS_ES,
    service: async () => (await cargarTs('src/i18n/servicios.es.ts')).SERVICIOS_ES,
    brand: async () => (await cargarTs('src/i18n/marcas.es.ts')).MARCAS_ES,
    project: async () => (await cargarTs('src/i18n/proyectos.es.ts')).PROYECTOS_ES,
  };
  const { CIUDADES, CONDADOS } = await import('../src/data/ubicaciones.mjs');
  const DIST = path.join(RAIZ, 'dist/client');
  const enlaceDe = (href) => {
    const [ruta, ancla] = href.split('#');
    if (ruta.startsWith('/') && !ruta.startsWith('//')) {
      const p = ruta.replace(/\/+$/, '') || '/';
      if (existsSync(path.join(DIST, p === '/' ? '' : p, 'index.html'))) return { destino: refRuta(p), ...(ancla ? { ancla } : {}) };
    }
    return { href };
  };
  const imagenPlantilla = (src) => {
    const fichero = path.join(RAIZ, 'public', src.replace(/^\//, ''));
    if (!existsSync(fichero)) throw new Error(`imagen de plantilla inexistente: ${src}`);
    assets.set(fichero, src);
    return { _type: 'imagenPlantilla', _sanityAsset: `image@file://${fichero}`, origen: origenDe(fichero), ...procedencia(src) };
  };
  const conv = { imagen: imagenPlantilla, enlace: enlaceDe, referencia: (col, slug) => ref(`${col}-${slug}`) };
  const igualAlCodigo = async (fichero, generado) => {
    const enCodigo = await fs.readFile(path.join(RAIZ, 'src/plantillas', fichero), 'utf8').catch(() => null);
    if (enCodigo !== generado) throw new Error(`src/plantillas/${fichero} no coincide con la derivacion: node scripts/sanity/plantillas.mjs <tipo> --escribir`);
  };
  const slugDeCondado = Object.fromEntries(Object.entries(CONDADOS).map(([slug, nombre]) => [nombre, slug]));
  for (const tipo of CON_PLANTILLA) {
    const paginas = await paginasDe(tipo);
    const d = derivarColeccion(paginas);
    // La plantilla en el codigo tiene que ser LA MISMA que sale de los fragmentos: si no,
    // los documentos no casarian con el diseño que los pinta.
    await igualAlCodigo(`${tipo}.html`, d.plantilla);
    await igualAlCodigo(`${tipo}.json`, JSON.stringify(d.huecos, null, 1) + '\n');
    if (d.heredados.some((h) => Object.keys(h).length)) await igualAlCodigo(`${tipo}.heredado.json`, JSON.stringify(Object.fromEntries(paginas.map((p, i) => [p.slug, d.heredados[i]])), null, 1) + '\n');
    docs.push({ _id: `plantilla-${tipo}`, _type: 'plantilla', coleccion: tipo, secciones: aBloques(d.huecos, d.compartidos, 'compartido', conv) });
    // Las tarjetas de producto que las fichas copian en «Compare»: una vez, en su producto.
    const refs = derivarReferencias(d);
    for (const [col, dr] of Object.entries(refs.porColeccion)) {
      await igualAlCodigo(`${col}.tarjeta.html`, dr.plantilla);
      await igualAlCodigo(`${col}.tarjeta.json`, JSON.stringify(dr.huecos, null, 1) + '\n');
      tarjetas[col] = Object.fromEntries(dr.slugs.map((slug, j) => [slug, plano(aBloques(dr.huecos, dr.valores[j], 'pagina', conv), { _type: 'bloque', clave: 'tarjeta' })]));
    }
    if (ES_DE[tipo]) {
      const ES = await ES_DE[tipo]();
      const { PROMOVIDAS } = await cargarTs('src/data/faqs.ts');
      const { ESPECIFICACIONES } = tipo === 'product' ? await cargarTs('src/data/especificaciones.ts') : {};
      const { SPECS_COPY } = tipo === 'product' ? await cargarTs('src/i18n/especificaciones.es.ts') : {};
      // Ficha -> proyecto: la etiqueta de producto de cada tarjeta de /project-gallery
      // (src/lib/proyectos-ficha.ts) pasa a ser la referencia `productos` del proyecto.
      const PF = tipo === 'project' ? await cargarTs('src/lib/proyectos-ficha.ts') : null;
      const galeria = PF && PF.tarjetasProyecto(await fs.readFile(path.join(RAIZ, 'src/contenido-migrado/estaticas/project-gallery.html'), 'utf8'));
      const ficha = PF && Object.fromEntries(Object.entries(PF.ETIQUETA_DE_FICHA).map(([slug, et]) => [et, slug]));
      paginas.forEach((p, i) => {
        const es = ES[p.slug];
        const h1 = p.en.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1];
        if (!h1) throw new Error(`[${tipo}] ${p.slug} sin <h1>`);
        const doc = {
          _id: `${tipo}-${p.slug}`,
          _type: tipo,
          nombre: i18n(decodificar(h1.replace(/<[^>]*>/g, '')).trim(), es?.nombre),
          slug: { _type: 'slug', current: p.slug },
          secciones: aBloques(d.huecos, d.valores[i], 'pagina', conv),
          seo: { _type: 'seo', titulo: i18n(p.item.title, es?.title), ...(p.item.description ? { descripcion: i18nLargo(p.item.description, es?.description) } : {}), indexable: true },
        };
        for (const [bloque, b] of Object.entries(opcionalesA(d.huecos, d.valores[i], conv))) doc[CAMPOS_OPCIONALES[bloque].campo] = b;
        // Las preguntas de la biblioteca que la ficha sube a su FAQ (src/data/faqs.ts).
        if ((tipo === 'product' || tipo === 'service') && PROMOVIDAS[p.slug]?.length) doc.faqsPromovidas = PROMOVIDAS[p.slug].map((id) => ({ ...ref(`faq-${id}`), _key: id }));
        if (tipo === 'product' && ESPECIFICACIONES[p.slug]) {
          const E = ESPECIFICACIONES[p.slug], en = SPECS_COPY.en[p.slug], es = SPECS_COPY.es[p.slug];
          doc.especificaciones = {
            titulo: i18n(en.titulo, es.titulo),
            entradilla: i18nLargo(en.entradilla, es.entradilla),
            filas: E.filas.map((id) => ({ _type: 'filaEspecificacion', _key: id, id, etiqueta: i18n(en.filas[id].etiqueta, es.filas[id].etiqueta), valor: i18nLargo(en.filas[id].valor, es.filas[id].valor), enDatosEstructurados: E.enGrafo.includes(id) })),
            ...(E.material ? { material: E.material } : {}),
            huecosTitulo: i18n(en.huecosTitulo, es.huecosTitulo),
            huecosEntradilla: i18nLargo(en.huecosEntradilla, es.huecosEntradilla),
            huecos: E.huecos.map((id) => ({ _type: 'huecoEspecificacion', _key: id, id, texto: i18nLargo(en.huecos[id], es.huecos[id]) })),
            ctaTexto: i18n(en.ctaTexto, es.ctaTexto),
            enlaces: E.enlaces.map((e) => ({ _type: 'enlaceEspecificacion', _key: e.id, id: e.id, texto: i18n(en.enlaces[e.id], es.enlaces[e.id]), destino: refRuta(e.ruta), junto: e.junto })),
          };
          // Paridad: el registro y la copia salen tal cual del documento.
          const x = doc.especificaciones;
          const ordenado = (o) => JSON.stringify(o, (_k, v) => (v && typeof v === 'object' && !Array.isArray(v) ? Object.fromEntries(Object.entries(v).sort(([a], [b]) => a.localeCompare(b))) : v));
          // La misma reconstruccion que usa el build (src/lib/sanity/especificaciones.mjs).
          const r = desdeDocumento(x, (ref) => rutaDeId(ref._ref));
          if (ordenado(r.ficha) !== ordenado(E)) throw new Error(`[especificaciones] ${p.slug}: el registro no se reconstruye (¿enGrafo en otro orden que filas?)`);
          for (const [idioma, c] of [['en', en], ['es', es]]) {
            if (ordenado(r.copy[idioma]) !== ordenado(c)) throw new Error(`[especificaciones] ${p.slug} ${idioma}: la copia no se reconstruye (¿textos sin fila?)`);
          }
        }
        if (tipo === 'project') {
          const tj = galeria.find((t) => t.slug === p.slug);
          const prods = (tj?.etiquetas ?? []).map((et) => ficha[et]).filter(Boolean);
          if (prods.length) doc.productos = prods.map((slug) => ({ ...ref(`product-${slug}`), _key: slug }));
        }
        if (tipo === 'project') {
          const conVideo = Boolean(doc.cabeceraVideo), conImagen = Boolean(doc.cabeceraImagen);
          if (conVideo === conImagen) throw new Error(`[project] ${p.slug}: la cabecera tiene que ser video o imagen, una de las dos`);
          doc.cabecera = conVideo ? 'video' : 'imagen';
        }
        docs.push(doc);
      });
      continue;
    }
    const { CONDADOS_ES } = tipo === 'county' ? await cargarTs('src/i18n/condados.es.ts') : {};
    const { UBICACIONES_ES } = tipo === 'city' ? await cargarTs('src/i18n/ubicaciones.es.ts') : {};
    paginas.forEach((p, i) => {
      const es = tipo === 'city' ? UBICACIONES_ES[p.slug] : CONDADOS_ES[p.slug];
      const nombreEn = tipo === 'city' ? CIUDADES[p.slug]?.municipio : CONDADOS[p.slug];
      if (!nombreEn) throw new Error(`[${tipo}] ${p.slug} sin nombre en src/data/ubicaciones.mjs`);
      docs.push({
        _id: `${tipo}-${p.slug}`,
        _type: tipo,
        nombre: i18n(nombreEn, es?.nombre),
        slug: { _type: 'slug', current: p.slug },
        ...(tipo === 'city' ? { condado: ref(`county-${slugDeCondado[CIUDADES[p.slug].condado]}`) } : {}),
        secciones: aBloques(d.huecos, d.valores[i], 'pagina', conv),
        seo: { _type: 'seo', titulo: i18n(p.item.title, es?.title), ...(p.item.description ? { descripcion: i18nLargo(p.item.description, es?.description) } : {}), indexable: true },
      });
    });
  }

  // -------------------------------------------------------------------------
  // Paginas estaticas: 13 desde su fragmento (una plantilla por pagina) y 5 propias
  // (contacto, blog, FAQ, estimador, gracias) cuya copia vive en src/i18n.
  // -------------------------------------------------------------------------
  if (TIPOS.has('page')) {
    const { estaticasDe, derivar, paridad } = await import('./sanity/plantillas.mjs');
    const { desaplanar } = await import('../src/lib/plantilla-sanity.mjs');
    const { readFileSync } = await import('node:fs');
    // SEO tal como se publica hoy: <title>, meta description y robots del HTML de dist.
    const publicado = (ruta) => {
      // El 404 ingles se sirve como /404.html; su gemela es /es/404/.
      const h = readFileSync(ruta === '/404' ? path.join(DIST, '404.html') : path.join(DIST, ruta === '/' ? '' : ruta, 'index.html'), 'utf8');
      const title = decodificar(h.match(/<title>([^<]*)<\/title>/)?.[1] ?? '');
      const meta = (n) => h.match(new RegExp(`<meta[^>]*name="${n}"[^>]*>`))?.[0].match(/content="([^"]*)"/)?.[1];
      const description = decodificar(meta('description') ?? '');
      const noindex = /noindex/.test(meta('robots') ?? '');
      if (!title) throw new Error(`[page] ${ruta} sin <title> en dist`);
      return { title, description, noindex };
    };
    const seoPagina = (ruta) => {
      const en = publicado(ruta);
      const rutaEs = ruta === '/' ? '/es' : `/es${ruta}`;
      const es = existsSync(path.join(DIST, rutaEs, 'index.html')) ? publicado(rutaEs) : null;
      return { _type: 'seo', titulo: i18n(en.title, es?.title), ...(en.description ? { descripcion: i18nLargo(en.description, es?.description) } : {}), indexable: !en.noindex };
    };
    const nombreDe = (seo) => i18n(seo.titulo.en.split('|')[0].trim(), seo.titulo.es?.split('|')[0].trim());
    for (const p of await estaticasDe()) {
      const d = derivar([p], '', { sinReferencias: true, todoContenido: true });
      d.heredados = [{}];
      const f = paridad(d, [p]);
      if (f.length) throw new Error(`[page] ${p.ruta}: paridad\n${f.join('\n')}`);
      await igualAlCodigo(`${p.id}.html`, d.plantilla);
      await igualAlCodigo(`${p.id}.json`, JSON.stringify(d.huecos, null, 1) + '\n');
      const seo = seoPagina(p.ruta);
      docs.push({ _id: p.id, _type: 'page', ruta: p.ruta, titulo: nombreDe(seo), secciones: aBloques(d.huecos, d.valores[0], 'pagina', conv), seo });
    }
    // Las propias: su copia (src/i18n/paginas-propias.ts, contacto.ts) como textos con clave.
    const { PROPIAS_EN, PROPIAS_ES } = await cargarTs('src/i18n/paginas-propias.ts');
    const C = await cargarTs('src/i18n/contacto.ts');
    const sinSeo = ({ title: _t, description: _d, ...resto }) => resto;
    const copia = (clave, en, es) => ({ _type: 'bloque', _key: clave, clave, textos: textosClave(aplanar(en, es)) });
    const igual = (a, b, que) => { if (JSON.stringify(a) !== JSON.stringify(b)) throw new Error(`[page] ${que}: la copia no se reconstruye desde los textos`); };
    const propias = [
      { ruta: '/contact-us/get-in-touch', c: 'contacto', bloques: [copia('contacto', C.CONTACTO_EN, C.CONTACTO_ES)] },
      { ruta: '/resources/blog', c: 'blog' },
      { ruta: '/resources/faq', c: 'faq' },
      { ruta: '/project-estimator', c: 'estimador', bloques: [] },
      { ruta: '/thank-you', c: 'gracias' },
    ];
    for (const pr of propias) {
      const en = PROPIAS_EN[pr.c], es = PROPIAS_ES[pr.c];
      const bloques = pr.bloques ?? [copia('copia', sinSeo(en), sinSeo(es))];
      if (pr.c === 'contacto') {
        // Los tres condados: foto, enlace al condado y su texto (alt y nombre, sin traducir hoy).
        bloques.push({
          _type: 'bloque', _key: 'condados', clave: 'condados',
          textos: C.CONDADOS.flatMap((x, i) => [
            { _type: 'textoClave', _key: `condados-${i}-nombre`, clave: `condados.${i}.nombre`, texto: i18nLargo(x.nombre) },
            { _type: 'textoClave', _key: `condados-${i}-alt`, clave: `condados.${i}.alt`, texto: i18nLargo(x.alt) },
          ]),
          imagenes: C.CONDADOS.map((x, i) => ({ _type: 'imagenClave', _key: `condados-${i}`, clave: `condados.${i}.img`, imagen: conv.imagen(x.img) })),
          enlaces: C.CONDADOS.map((x, i) => ({ _type: 'enlaceClave', _key: `condados-${i}`, clave: `condados.${i}.enlace`, ...conv.enlace(x.enlace) })),
        });
        igual(desaplanar(bloques[0].textos, 'en'), C.CONTACTO_EN, 'contacto en');
        igual(desaplanar(bloques[0].textos, 'es'), C.CONTACTO_ES, 'contacto es');
      } else if (bloques.length) {
        igual(desaplanar(bloques[0].textos, 'en'), sinSeo(en), `${pr.c} en`);
        igual(desaplanar(bloques[0].textos, 'es'), sinSeo(es), `${pr.c} es`);
      }
      // El SEO publicado tiene que ser el de la copia: si no, la copia no es la fuente.
      const seo = seoPagina(pr.ruta);
      igual([seo.titulo.en, seo.titulo.es, seo.descripcion?.en, seo.descripcion?.es], [en.title, es.title, en.description, es.description], `${pr.c} seo`);
      docs.push({ _id: idDeRuta(pr.ruta).id, _type: 'page', ruta: pr.ruta, titulo: nombreDe(seo), secciones: bloques, seo });
    }
  }

  // -------------------------------------------------------------------------
  // Menu y pie: textos de src/i18n/shell.ts y estructura de Nav.astro y Footer.astro
  // -------------------------------------------------------------------------
  if (TIPOS.has('navigation')) {
    const { menuDe, pieDe } = await import('./sanity/navegacion.mjs');
    const { SHELL } = await cargarTs('src/i18n/shell.ts');
    const { readFileSync } = await import('node:fs');
    const menu = menuDe(readFileSync(path.join(RAIZ, 'src/components/Nav.astro'), 'utf8'));
    const pie = pieDe(readFileSync(path.join(RAIZ, 'src/components/Footer.astro'), 'utf8'));
    const columna = (c, n) => ({
      _type: 'bloque', _key: c.titulo ?? (c.verTodo ? 'ver-todo' : `columna-${n}`), clave: c.titulo ?? (c.verTodo ? 'verTodo' : `columna-${n}`),
      ...(c.enlaces.length ? { enlaces: c.enlaces.map((e) => ({ _type: 'enlaceClave', _key: e.claves[0], clave: e.claves.join('+'), ...conv.enlace(e.href) })) } : {}),
    });
    docs.push({
      _id: 'navigation',
      _type: 'navigation',
      textos: textosClave(aplanar(SHELL.en, SHELL.es)),
      menu: menu.map((g) => ({
        _type: 'grupoMenu', _key: g.clave, clave: g.clave,
        ...(SHELL.en[g.clave] ? { texto: i18n(SHELL.en[g.clave], SHELL.es[g.clave]) } : {}),
        ...(g.destino ? { destino: refRuta(g.destino) } : {}),
        ...(g.columnas.length ? { subgrupos: g.columnas.map(columna) } : {}),
      })),
      pie: pie.map(columna),
    });
    // Paridad: la estructura que sale del documento es la del componente.
    const hrefDe = (e) => (e.destino ? rutaDeId(e.destino._ref) : e.href);
    const doc = docs[docs.length - 1];
    const deVuelta = (b) => ({ enlaces: (b.enlaces ?? []).map((e) => ({ href: hrefDe(e), claves: e.clave.split('+') })) });
    const plano = (c) => ({ enlaces: c.enlaces });
    if (JSON.stringify(doc.menu.map((g) => [g.clave, g.destino ? rutaDeId(g.destino._ref) : null, (g.subgrupos ?? []).map(deVuelta)])) !== JSON.stringify(menu.map((g) => [g.clave, g.destino ?? null, g.columnas.map(plano)]))) throw new Error('[navigation] el menu no se reconstruye');
    if (JSON.stringify(doc.pie.map(deVuelta)) !== JSON.stringify(pie.map(plano))) throw new Error('[navigation] el pie no se reconstruye');
    const { desaplanar } = await import('../src/lib/plantilla-sanity.mjs');
    if (JSON.stringify({ en: desaplanar(doc.textos, 'en'), es: desaplanar(doc.textos, 'es') }) !== JSON.stringify(SHELL)) throw new Error('[navigation] los textos no son los de shell.ts');
  }
}

for (const [col, porSlug] of Object.entries(tarjetas)) {
  for (const [slug, b] of Object.entries(porSlug)) {
    const doc = docs.find((x) => x._id === `${col}-${slug}`);
    if (!doc) throw new Error(`[tarjeta] ${col}-${slug} no esta en la tanda`);
    doc.tarjeta = b;
  }
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
