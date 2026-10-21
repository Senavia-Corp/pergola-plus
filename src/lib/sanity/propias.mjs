/**
 * Las paginas de autoria propia desde sus documentos `page-<ruta>`: la copia de
 * src/i18n/paginas-propias.ts (PROPIAS_EN/ES, con su <head>) y la de contacto
 * (src/i18n/contacto.ts: CONTACTO_EN/ES y los tres condados). Pura.
 */
import { desaplanar } from '../plantilla-sanity.mjs';

const RUTAS = { contacto: '/contact-us/get-in-touch', blog: '/resources/blog', faq: '/resources/faq', estimador: '/project-estimator', gracias: '/thank-you' };
const idDe = (ruta) => `page-${ruta.slice(1).replace(/\//g, '__')}`;

/**
 * @param conv {{ rutaImagen(imagen): string, hrefDe(enlace): string }}
 * @param clavesCondado  el `data-county` de cada condado, por posicion (es diseño: lo
 *   lee el script de la seccion, no se edita)
 */
export function propiasDesde(c, conv, clavesCondado) {
  const PROPIAS_EN = {}, PROPIAS_ES = {};
  let contacto = null;
  for (const [k, ruta] of Object.entries(RUTAS)) {
    const d = c.doc(idDe(ruta));
    if (!d) throw new Error(`[sanity] falta ${idDe(ruta)}`);
    const copia = d.secciones?.find((b) => b.clave === 'copia');
    PROPIAS_EN[k] = { title: d.seo.titulo.en, description: d.seo.descripcion?.en, ...(copia ? desaplanar(copia.textos, 'en') : {}) };
    PROPIAS_ES[k] = { title: d.seo.titulo.es ?? d.seo.titulo.en, description: d.seo.descripcion?.es ?? d.seo.descripcion?.en, ...(copia ? desaplanar(copia.textos, 'es') : {}) };
    if (k === 'contacto') contacto = d;
  }
  const bloque = (clave) => contacto.secciones.find((b) => b.clave === clave);
  const cd = bloque('condados');
  const de = (lista, clave) => lista?.find((x) => x.clave === clave);
  const CONDADOS = (cd.imagenes ?? []).map((_x, i) => ({
    clave: clavesCondado[i] ?? `condado-${i}`,
    nombre: de(cd.textos, `condados.${i}.nombre`).texto.en,
    enlace: conv.hrefDe(de(cd.enlaces, `condados.${i}.enlace`)),
    img: conv.rutaImagen(de(cd.imagenes, `condados.${i}.img`).imagen),
    alt: de(cd.textos, `condados.${i}.alt`).texto.en,
  }));
  return {
    PROPIAS_EN, PROPIAS_ES,
    CONTACTO_EN: desaplanar(bloque('contacto').textos, 'en'),
    CONTACTO_ES: desaplanar(bloque('contacto').textos, 'es'),
    CONDADOS,
  };
}
