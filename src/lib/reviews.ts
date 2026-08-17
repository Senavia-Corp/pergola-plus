/**
 * Resenas de Google Business Profile.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * EL PUNTO DE SUSTITUCION ES `getReviews()` Y SOLO `getReviews()`.
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Hoy lee el snapshot local `src/data/reviews-google.json`.
 *
 * El dia que se enchufe la API NO se toca nada de aqui: quien hace el fetch es
 * `scripts/traer-resenas.mjs`, que corre en NODE y reescribe ese JSON. Este
 * modulo sigue leyendo el mismo fichero y el componente sigue llamando a la
 * misma funcion.
 *
 * Esa separacion es deliberada y tiene dos razones:
 *
 *   1. NUNCA desde el navegador del visitante. Un fetch en cliente publicaria
 *      el token, meteria un tercero en un sitio que esta en «cero peticiones a
 *      Google», y —lo importante— dejaria el texto de las resenas FUERA del
 *      HTML: invisible para los buscadores y para las respuestas de IA, que es
 *      justo el valor que se busca al no usar un widget.
 *
 *   2. El build de Vercel no puede depender de que la API de Google conteste.
 *      Si el fetch viviera en `getReviews()`, una caida de Google o un token
 *      caducado tumbaria el despliegue. Con el snapshot, lo peor que pasa es que
 *      las resenas sean de ayer. Es el mismo criterio que ya usa el repo con las
 *      fuentes (`bajar-fuentes.mjs`) y con las imagenes.
 *
 * CONTRATO CON EL COMPONENTE: con cero resenas se devuelve una lista vacia y el
 * componente NO renderiza nada. No hay estado vacio porque no puede alcanzarse
 * — el mismo principio que el listado del blog.
 */
import datos from '../data/reviews-google.json';

export interface Resena {
  /** Id estable de Google. Sirve de `key` y para detectar altas/bajas entre snapshots. */
  id: string;
  autor: string;
  /** 1..5, entero. */
  rating: number;
  /** ISO 8601. Se formatea en el componente segun el idioma de la PAGINA. */
  fechaISO: string;
  texto: string;
  /**
   * Idioma en que la escribio esa persona ('en', 'es', ...). NO es el idioma de
   * la pagina: las resenas se muestran en su idioma original en las dos
   * versiones del sitio. Va al atributo `lang` de la cita.
   */
  idioma: string;
  /** Respuesta publica del negocio, si la hay. */
  'respuestaDueño': string | null;
  /** Enlace a esa resena en Google. */
  urlOrigen: string;
}

export interface Perfil {
  nombre: string;
  /** Ficha del negocio en Google. `null` hasta que corra el fetch. */
  url: string | null;
}

interface Snapshot {
  actualizado: string | null;
  perfil: Perfil;
  resenas: Resena[];
}

const SNAPSHOT = datos as unknown as Snapshot;

/**
 * Las resenas publicadas, de la mas nueva a la mas vieja.
 *
 * El orden es EXPLICITO y el componente lo declara en pantalla, porque una lista
 * de resenas sin decir como esta ordenada invita a pensar que se han elegido las
 * buenas. Aqui no se filtra ninguna: salen todas las que traiga el snapshot.
 */
export function getReviews(): Resena[] {
  return [...SNAPSHOT.resenas].sort((a, b) => b.fechaISO.localeCompare(a.fechaISO));
}

/** Nombre y ficha de Google del negocio. */
export function getPerfil(): Perfil {
  return SNAPSHOT.perfil;
}

/** Cuando se tomo el snapshot, o `null` si nunca se ha ejecutado el fetch. */
export function getActualizado(): string | null {
  return SNAPSHOT.actualizado;
}

/**
 * Media y total.
 *
 * OJO: esto es para PINTARLO, no para meterlo en JSON-LD. Un `aggregateRating`
 * sobre uno mismo es INELEGIBLE para las estrellas del SERP segun la politica de
 * Google y expone a accion manual. Ver la cabecera de `src/lib/jsonld.ts`, que
 * ya documenta por que ese campo no existe.
 */
export function getResumen(): { media: number; total: number } | null {
  const rs = SNAPSHOT.resenas;
  if (!rs.length) return null;
  return {
    media: rs.reduce((s, r) => s + r.rating, 0) / rs.length,
    total: rs.length,
  };
}
