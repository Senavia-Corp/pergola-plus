/**
 * De donde lee el build: `PP_FUENTE=repo` (por defecto hasta el corte de fuente) lee
 * los fragmentos migrados de src/contenido-migrado; `PP_FUENTE=sanity` lee la
 * instantanea del dataset que deja scripts/sanity/instantanea.mjs.
 *
 * Las paginas piden aqui su contenido y no saben de donde viene: asi las dos fuentes
 * se comparan en el mismo commit, ruta a ruta, sobre el HTML de dist.
 */
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { rellenar } from '../plantilla.mjs';
import { lectorSanity } from '../plantilla-sanity.mjs';
import { rutaDe, rutaDeId } from '../rutas-sanity.mjs';
import { partesAsset } from './assets.mjs';

export const FUENTE = process.env.PP_FUENTE === 'sanity' ? 'sanity' : 'repo';

let contenido = null;
/** La instantanea del dataset. Cerrado: sin ella, con PP_FUENTE=sanity, el build lanza. */
export function sanity() {
  if (contenido) return contenido;
  const f = path.resolve(process.cwd(), '.cache/sanity/contenido.json');
  let j;
  try { j = JSON.parse(readFileSync(f, 'utf8')); } catch {
    throw new Error('[sanity] falta .cache/sanity/contenido.json: el build con PP_FUENTE=sanity empieza con scripts/sanity/instantanea.mjs');
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

// Plantillas del codigo (src/plantillas), empaquetadas con el build.
const HTML = import.meta.glob('../../plantillas/*.html', { query: '?raw', import: 'default', eager: true });
const JSON_ = import.meta.glob('../../plantillas/*.json', { import: 'default', eager: true });
const plantilla = (nombre) => {
  const h = HTML[`../../plantillas/${nombre}.html`];
  const j = JSON_[`../../plantillas/${nombre}.json`];
  if (h == null || !j) throw new Error(`[sanity] falta la plantilla src/plantillas/${nombre}`);
  return { html: h, huecos: j };
};

const conv = {
  rutaImagen,
  hrefDe,
  // La tarjeta de «Compare»: plantilla de la tarjeta + el campo `tarjeta` del producto.
  tarjeta: (destino, idioma) => {
    const d = sanity().doc(destino._ref);
    if (!d?.tarjeta) throw new Error(`[sanity] ${destino._ref} sin tarjeta`);
    const t = plantilla('product.tarjeta');
    const lec = lectorSanity(t.huecos, { secciones: [d.tarjeta] }, null, idioma, conv);
    return rellenar(t.html, t.huecos, (k) => (k === 'tarjeta.dataProduct' ? DATA_PRODUCT[d.slug.current] ?? d.slug.current : lec(k)));
  },
};

// `data-product` de las tarjetas (scripts/lib/fichas.mjs): no es el slug.
import { DATA_PRODUCT } from '../../../scripts/lib/fichas.mjs';

/**
 * El fragmento de una pagina de coleccion (city, county, product, service, brand,
 * project), en un idioma, pintado con su plantilla y su documento.
 */
export function fragmentoColeccion(doc, idioma) {
  const tipo = doc._type;
  const t = plantilla(tipo);
  const heredados = JSON_[`../../plantillas/${tipo}.heredado.json`]?.[doc.slug.current] ?? {};
  const comun = sanity().doc(`plantilla-${tipo}`);
  return rellenar(t.html, t.huecos, lectorSanity(t.huecos, doc, comun, idioma, conv, heredados));
}

/**
 * Metadatos de una pagina de coleccion para BaseLayout. title/description salen del SEO
 * del documento; wfPage/wfSite (atributos heredados de Webflow, iguales en toda la
 * coleccion) y la imagen OG generada (scripts/generar-og.mjs) salen de _items.json, y
 * un documento nuevo hereda los de la coleccion y se queda sin OG propia.
 */
export function itemDe(doc, items, idioma = 'en') {
  const slug = doc.slug.current;
  const viejo = items.find((i) => i.slug === slug);
  return {
    slug,
    title: enIdioma(doc.seo?.titulo, idioma) ?? enIdioma(doc.nombre, idioma),
    description: enIdioma(doc.seo?.descripcion, idioma) ?? null,
    ogImage: viejo?.ogImage ?? null,
    wfPage: viejo?.wfPage ?? items[0]?.wfPage ?? null,
    wfSite: viejo?.wfSite ?? items[0]?.wfSite ?? null,
  };
}

/** Texto i18n en un idioma (ES con respaldo EN, como el resto del sitio). */
export const enIdioma = (t, idioma) => (t == null ? undefined : idioma === 'es' ? (t.es ?? t.en) : t.en);
