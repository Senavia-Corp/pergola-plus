/**
 * El blog desde Sanity (`post`, `blogCategory`), con la MISMA forma que src/lib/blog.ts e
 * src/i18n/blog.es.ts: posts, categorias, copia de categoria y metadatos en español.
 *
 *   blogDesde(contenido) -> { categorias, posts, copy, categoriasEs, copyCategoriasEs, postsEs, cuerpos }
 *
 * Pura: recibe la instantanea y no lee nada mas, para que scripts/sanity/paridad.mjs la
 * compare con lo que publica el repo en el mismo proceso.
 */
import crypto from 'node:crypto';
import { partesAsset } from './assets.mjs';
import { portableAHtml } from '../portable.mjs';

/** Palabras por minuto para el tiempo de lectura (el mismo PPM de src/lib/blog.ts). */
const PPM = 200;
const contar = (html) => html.replace(/<[^>]*>/g, ' ').split(/\s+/).filter(Boolean).length;

/**
 * El cuerpo de un post en HTML, serializado como el export de Webflow (byte a byte lo
 * que publica hoy el sitio: scripts/sanity/paridad.mjs).
 */
export function cuerpoHtml(bloques, conv) {
  return portableAHtml(bloques ?? [], {
    webflow: true,
    hrefDe: conv.hrefDe,
    imagen: (b) => ({ src: conv.rutaImagen(b), alt: b.alt ?? '' }),
  });
}

/** Huella del cuerpo inglés: si cambia, el recuento migrado ya no vale y se recalcula. */
export const huellaCuerpo = (html) => crypto.createHash('sha1').update(html).digest('hex');

/**
 * @param c    la instantanea (src/lib/sanity/fuente.mjs: sanity())
 * @param conv {{ rutaImagen(imagen): string, hrefDe(enlace): string }}
 */
export function blogDesde(c, conv) {
  const docsCat = c.deTipo('blogCategory');
  const docsPost = c.deTipo('post');
  const total = new Map();
  for (const p of docsPost) total.set(p.categoria._ref, (total.get(p.categoria._ref) ?? 0) + 1);
  const cat = new Map(docsCat.map((d) => [d._id, { slug: d.slug.current, nombre: d.nombre.en, total: total.get(d._id) ?? 0 }]));
  const categorias = [...cat.values()].sort((a, b) => b.total - a.total || a.nombre.localeCompare(b.nombre));

  const imagen = (img) => {
    const { ancho, alto } = partesAsset(img.asset._ref);
    return { src: conv.rutaImagen(img), width: ancho, height: alto };
  };
  const cuerpos = {};
  const posts = docsPost.map((d) => {
    const categoria = cat.get(d.categoria._ref);
    if (!categoria) throw new Error(`[blog] ${d._id}: categoria inexistente ${d.categoria._ref}`);
    const en = cuerpoHtml(d.cuerpo?.en, conv);
    cuerpos[d.slug.current] = { en, ...(d.cuerpo?.es ? { es: cuerpoHtml(d.cuerpo.es, conv) } : {}) };
    // El recuento de hoy salio del cuerpo del CSV de Webflow, que no es el que se pinta:
    // se guarda con la huella del cuerpo migrado y vale mientras el cuerpo no cambie.
    const palabras = d.lectura?.palabras != null && d.lectura.huella === huellaCuerpo(en) ? d.lectura.palabras : contar(en);
    return {
      slug: d.slug.current,
      titulo: d.titulo.en,
      tituloLargo: d.tituloLargo?.en || d.titulo.en,
      resumen: d.resumen.en,
      categoria,
      miniatura: imagen(d.miniatura),
      principal: imagen(d.principal),
      altMiniatura: d.miniatura.alt?.en ?? '',
      altPrincipal: d.principal.alt?.en ?? '',
      publicado: new Date(d.fechaPublicacion),
      creado: new Date(d.fechaCreacion),
      actualizado: new Date(d.fechaActualizacion),
      minutos: Math.max(1, Math.round(palabras / PPM)),
      palabras,
      destacadoCms: Boolean(d.destacado),
      esHero: Boolean(d.principalDelBlog),
      descripcionSeo: d.seo?.descripcion?.en ?? '',
    };
  }).sort((a, b) => Number(b.destacadoCms) - Number(a.destacadoCms) || b.creado.getTime() - a.creado.getTime());

  const copy = {}, categoriasEs = {}, copyCategoriasEs = {};
  for (const d of docsCat) {
    const s = d.slug.current;
    if (d.nombre.es) categoriasEs[s] = d.nombre.es;
    if (!d.tienePagina || !d.seo) continue;
    copy[s] = { titulo: d.seo.titulo.en, meta: d.seo.descripcion.en, intro: d.descripcion.en };
    if (d.seo.titulo.es) copyCategoriasEs[s] = { titulo: d.seo.titulo.es, meta: d.seo.descripcion.es, intro: d.descripcion.es };
  }
  const postsEs = {};
  for (const d of docsPost) {
    if (!d.titulo.es) continue;
    postsEs[d.slug.current] = { titulo: d.titulo.es, resumen: d.resumen.es, tituloLargo: d.tituloLargo?.es ?? d.seo?.titulo?.es, descripcionSeo: d.seo?.descripcion?.es };
  }
  return { categorias, posts, copy, categoriasEs, copyCategoriasEs, postsEs, cuerpos };
}
