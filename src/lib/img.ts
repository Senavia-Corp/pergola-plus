/**
 * Resolucion de imagenes de la migracion.
 *
 * Las plantillas de CMS leen los CSV del export, que traen URLs del CDN de
 * Webflow. Esas URLs NO pueden acabar en el HTML: el sitio nuevo se romperia el
 * dia que se cancele Webflow. Este modulo las traduce a la copia local.
 *
 * Fase 1 -> /cms-img/...           (las imagenes descargadas, servidas en local)
 * Fase 3 -> CDN de Sanity          (se cambia la implementacion, no las llamadas)
 *
 * FALLA RUIDOSAMENTE a proposito: si una URL no esta en el mapa, lanza. Un fallo
 * en el build vale mas que una imagen rota en produccion.
 *
 * Los assets de DISENO (logo, iconos, favicon, fondos del CSS) no pasan por aqui:
 * son rutas directas a /images/, igual que en el original.
 */
import mapa from './img-map.json';

export interface EntradaImagen {
  src: string;
  alt: string | null;
  altDerivado: string | null;
  width: number | null;
  height: number | null;
}

const MAPA = mapa as Record<string, EntradaImagen>;

function buscar(url: string): EntradaImagen {
  const e = MAPA[url] ?? MAPA[url.trim()];
  if (!e) {
    throw new Error(
      `[img] URL sin mapear: ${url}\n` +
        `Toda imagen del CMS tiene que estar en assets-migracion/manifest.json.\n` +
        `Ejecuta: node scripts/descargar-imagenes.mjs && node scripts/instalar-assets.mjs`,
    );
  }
  return e;
}

/** Ruta local de una imagen a partir de su URL original de Webflow. */
export function imgSrc(url: string): string {
  return buscar(url).src;
}

/**
 * Alt de la imagen.
 *
 * Devuelve el alt del ORIGEN. Si el origen no trae ninguno devuelve '', que es
 * exactamente lo que renderiza el sitio actual (las galerias se sirven con
 * alt=""). Es lo correcto para una migracion exacta.
 *
 * Con `derivado: true` devuelve el alt generado a partir del sujeto y el rol.
 * Eso NO se usa en la Fase 1 —cambiaria el HTML respecto al original— sino en
 * Sanity y en el trabajo de accesibilidad posterior.
 */
export function imgAlt(url: string, opciones?: { derivado?: boolean }): string {
  const e = buscar(url);
  if (e.alt) return e.alt;
  return opciones?.derivado ? e.altDerivado ?? '' : '';
}

/** Todos los datos de la imagen (para width/height y evitar saltos de layout). */
export function img(url: string): EntradaImagen {
  return buscar(url);
}

/**
 * Divide un campo de galeria del CSV ("url1; url2; url3") en URLs sueltas.
 * El separador de Webflow es "; ".
 */
export function galeria(campo: string | null | undefined): string[] {
  if (!campo) return [];
  return campo
    .split(';')
    .map((s) => s.trim())
    .filter((s) => /^https?:/.test(s));
}
