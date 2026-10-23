/**
 * De donde lee el build (src/lib/sanity/fuente-elegida.mjs): por defecto la instantanea
 * del dataset que deja scripts/sanity/instantanea.mjs; con `PP_FUENTE=repo`, los
 * fragmentos migrados de src/contenido-migrado.
 *
 * Las paginas piden aqui su contenido y no saben de donde viene: asi las dos fuentes
 * se comparan en el mismo commit, ruta a ruta, sobre el HTML de dist.
 */
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { rellenar } from '../plantilla.mjs';
import { lectorSanity } from '../plantilla-sanity.mjs';
import { rutaDe, rutaDeId, idDeRuta } from '../rutas-sanity.mjs';
import { partesAsset } from './assets.mjs';
import { cuerpoHtml } from './blog.mjs';
import { contactoSitio, aplicarContacto } from './contacto-sitio.mjs';
import { LISTADOS, miembros, tarjetaDe, valorEn } from './listados.mjs';

/** Telefono, correo y direccion del sitio (siteSettings): src/lib/sanity/contacto-sitio.mjs. */
let C = null;
export const contacto = () => (C ??= contactoSitio(sanity().doc('siteSettings')));

export { FUENTE } from './fuente-elegida.mjs';

let contenido = null;
/** La instantanea del dataset. Cerrado: sin ella, con la fuente sanity, el build lanza. */
export function sanity() {
  if (contenido) return contenido;
  const f = path.resolve(process.cwd(), '.cache/sanity/contenido.json');
  let j;
  try { j = JSON.parse(readFileSync(f, 'utf8')); } catch {
    throw new Error('[sanity] falta .cache/sanity/contenido.json: el build con la fuente sanity empieza con scripts/sanity/instantanea.mjs');
  }
  const porId = new Map(j.docs.map((d) => [d._id, d]));
  contenido = {
    ...j,
    porId,
    doc: (id) => porId.get(id),
    deTipo: (tipo) => j.docs.filter((d) => d._type === tipo),
  };
  return contenido;
}

/** Ruta publica de una imagen de Sanity: su `origen` si sigue siendo ese fichero, si no la descarga. */
export function rutaImagen(img) {
  const c = sanity();
  const { sha1, ext } = partesAsset(img.asset._ref);
  if (img.origen && c.origenes[img.origen] === sha1) return img.origen;
  return `/cms-img/sanity/${sha1}.${ext}`;
}

/** Ruta de un documento referenciado (migrado o creado en el Studio). */
export function rutaDeRef(ref) {
  const d = sanity().doc(ref._ref);
  if (d) return rutaDe(d);
  return rutaDeId(ref._ref);
}

/** href de un `enlaceClave`: pagina del sitio (+ ancla) o enlace externo. */
export const hrefDe = (e) => (e.destino ? rutaDeRef(e.destino) : e.href) + (e.ancla ? `#${e.ancla}` : '');

// Plantillas del codigo (src/plantillas), empaquetadas con el build. Perezosas: un
// script que importe un modulo de datos con Node a secas (sin Vite) no las necesita.
let G = null;
const globs = () => (G ??= {
  HTML: import.meta.glob('../../plantillas/*.html', { query: '?raw', import: 'default', eager: true }),
  JSON_: import.meta.glob('../../plantillas/*.json', { import: 'default', eager: true }),
});
const plantilla = (nombre) => {
  const h = globs().HTML[`../../plantillas/${nombre}.html`];
  const j = globs().JSON_[`../../plantillas/${nombre}.json`];
  if (h == null || !j) throw new Error(`[sanity] falta la plantilla src/plantillas/${nombre}`);
  return { html: h, huecos: j };
};

const conv = {
  rutaImagen,
  hrefDe,
  // El texto enriquecido (legales), serializado como el export de Webflow.
  cuerpo: (doc, idioma) => cuerpoHtml((idioma === 'es' ? doc.cuerpo?.es : null) ?? doc.cuerpo?.en, { rutaImagen, hrefDe }),
  // La tarjeta de «Compare»: plantilla de la tarjeta + el campo `tarjeta` del producto.
  tarjeta: (destino, idioma) => {
    const d = sanity().doc(destino._ref);
    if (!d?.tarjeta) throw new Error(`[sanity] ${destino._ref} sin tarjeta`);
    const t = plantilla('product.tarjeta');
    const lec = lectorSanity(t.huecos, { secciones: [d.tarjeta] }, null, idioma, conv);
    return rellenar(t.html, t.huecos, (k) => (k === 'tarjeta.dataProduct' ? DATA_PRODUCT[d.slug.current] ?? d.slug.current : lec(k)));
  },
};

/**
 * Las tarjetas de un listado (src/lib/sanity/listados.mjs): los documentos de su
 * coleccion, en su orden, pintados con la plantilla de la tarjeta. Cada hueco sale de
 * donde dice su `fuente`.
 */
conv.listado = (id, idioma) => {
  const l = LISTADOS.find((x) => x.id === id);
  if (!l) throw new Error(`[sanity] listado desconocido: ${id}`);
  const t = plantilla(`listado-${id}`);
  const pagina = paginaDe(l.pagina);
  const comun = pagina.secciones?.find((b) => b.clave === `listado:${id}`) ?? {};
  // Lo comun guarda sus claves con el id delante: se quita para el lector.
  const sinPre = (lista) => (lista ?? []).map((e) => ({ ...e, clave: e.clave.replace(`${id}|`, '') }));
  const docComun = { secciones: [{ textos: sinPre(comun.textos), imagenes: sinPre(comun.imagenes), enlaces: sinPre(comun.enlaces), valores: sinPre(comun.valores) }] };
  const textoComun = (clave) => enIdioma(docComun.secciones[0].textos.find((x) => x.clave === clave)?.texto, idioma);
  return miembros(l, t.huecos, sanity().docs).map((doc) => {
    const base = lectorSanity(t.huecos, { secciones: [tarjetaDe(doc, id) ?? {}] }, docComun, idioma, conv);
    return rellenar(t.html, t.huecos, (k) => {
      const h = t.huecos[k];
      if (k === 'tarjeta.dataProduct') return DATA_PRODUCT[doc.slug.current] ?? doc.slug.current;
      if (h.fuente === 'ruta') return rutaDe(doc);
      if (h.fuente === 'doc') {
        const v = valorEn(doc, h.ruta);
        if (v == null) throw new Error(`[sanity] ${doc._id}: el listado ${id} necesita ${h.ruta}`);
        return h.tipo === 'imagen' ? rutaImagen(v) : enIdioma(v, idioma);
      }
      if (h.fuente === 'campo' && h.campo === 'sector') {
        const r = textoComun(`sector.${doc.sector}`);
        if (r == null) throw new Error(`[sanity] ${doc._id}: sector sin rotulo (${doc.sector})`);
        return r;
      }
      if (h.fuente === 'campo' && h.campo === 'producto') {
        const pr = doc.productos?.[0] && sanity().doc(doc.productos[0]._ref);
        const r = enIdioma(pr?.etiquetaGaleria, idioma);
        if (r == null) throw new Error(`[sanity] ${doc._id}: la galeria necesita su producto con etiqueta`);
        return r;
      }
      return base(k);
    });
  }).join('');
};

// `data-product` de las tarjetas (scripts/lib/fichas.mjs): no es el slug.
import { DATA_PRODUCT } from '../../../scripts/lib/fichas.mjs';

/**
 * El fragmento de una pagina de coleccion (city, county, product, service, brand,
 * project, legalPage), en un idioma, pintado con su plantilla y su documento.
 */
export function fragmentoColeccion(doc, idioma) {
  const tipo = doc._type;
  const t = plantilla(tipo);
  const heredados = globs().JSON_[`../../plantillas/${tipo}.heredado.json`]?.[doc.slug.current] ?? {};
  const comun = sanity().doc(`plantilla-${tipo}`);
  return aplicarContacto(rellenar(t.html, t.huecos, lectorSanity(t.huecos, doc, comun, idioma, conv, heredados)), contacto());
}

/**
 * El fragmento de una pagina estatica (documento `page-<id>`) en un idioma, pintado con
 * su plantilla de pagina (src/plantillas/page-<id>.html: todo contenido).
 */
export function fragmentoEstatica(doc, idioma) {
  const t = plantilla(doc._id);
  let html = aplicarContacto(rellenar(t.html, t.huecos, lectorSanity(t.huecos, doc, null, idioma, conv)), contacto());
  // La home: el poster del video del hero, de siteSettings (el video sigue en el codigo).
  if (doc._id === 'page-index') html = html.split(POSTER_MIGRADO).join(posterHero());
  return html;
}

const POSTER_MIGRADO = '/images/hero-pergola-plus-florida-poster.avif';
/** El poster del video de la home (siteSettings.videoHero.poster), o el migrado. */
export const posterHero = () => {
  const p = sanity().doc('siteSettings')?.videoHero?.poster;
  return p?.asset ? rutaImagen(p) : POSTER_MIGRADO;
};

/** El documento `page-<id>` de una ruta estatica (o lanza: con Sanity, la pagina tiene que estar). */
export function paginaDe(ruta) {
  const id = idDeRuta(ruta).id;
  const d = sanity().doc(id);
  if (!d) throw new Error(`[sanity] falta el documento ${id} de ${ruta}`);
  return d;
}

/** og:image de un documento: su `seo.imagenOg` (scripts/sanity/og-documentos.mjs). */
const ogDe = (doc) => (doc?.seo?.imagenOg?.asset ? rutaImagen(doc.seo.imagenOg) : undefined);

let porRuta = null;
/** El documento de una ruta del sitio (EN o /es/), por su tipo y su slug; null si no tiene. */
export function docDeRuta(pathname) {
  const c = sanity();
  if (!porRuta) {
    porRuta = new Map();
    for (const d of c.docs) { try { porRuta.set(rutaDe(d), d); } catch { /* sin pagina */ } }
  }
  return porRuta.get(pathname.replace(/^\/es(?=\/|$)/, '').replace(/\/+$/, '') || '/') ?? null;
}

/**
 * og:image de una ruta del sitio (EN o /es/): la de su documento y, si no tiene, la de
 * siteSettings.imagenOgPorDefecto. Los documentos creados en el Studio se encuentran
 * igual, por su tipo y su slug.
 */
export function ogDeRuta(pathname) {
  const defecto = sanity().doc('siteSettings')?.imagenOgPorDefecto;
  return ogDe(docDeRuta(pathname)) ?? (defecto?.asset ? rutaImagen(defecto) : undefined);
}

/** Alt de esa misma imagen en el idioma de la pagina (og:image:alt, T10); el ingles si falta. */
export function ogAltDeRuta(pathname, idioma) {
  const doc = docDeRuta(pathname);
  const img = doc?.seo?.imagenOg?.asset ? doc.seo.imagenOg : sanity().doc('siteSettings')?.imagenOgPorDefecto;
  return img?.alt?.[idioma] || img?.alt?.en || undefined;
}

/**
 * Metadatos de una pagina de coleccion para BaseLayout. title/description y la imagen OG
 * salen del SEO del documento; wfPage/wfSite (atributos heredados de Webflow, iguales en
 * toda la coleccion) salen de _items.json, y un documento nuevo hereda los de la coleccion.
 */
export function itemDe(doc, items, idioma = 'en') {
  const slug = doc.slug.current;
  const viejo = items.find((i) => i.slug === slug);
  return {
    slug,
    title: enIdioma(doc.seo?.titulo, idioma) ?? enIdioma(doc.nombre, idioma),
    description: enIdioma(doc.seo?.descripcion, idioma) ?? null,
    ogImage: ogDe(doc) ?? viejo?.ogImage ?? null,
    wfPage: viejo?.wfPage ?? items[0]?.wfPage ?? null,
    wfSite: viejo?.wfSite ?? items[0]?.wfSite ?? null,
  };
}

/** Texto i18n en un idioma (ES con respaldo EN, como el resto del sitio). */
export const enIdioma = (t, idioma) => (t == null ? undefined : idioma === 'es' ? (t.es ?? t.en) : t.en);
