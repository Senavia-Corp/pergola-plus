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
import plantillas from '../data/reviews-plantilla.json';

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

/**
 * Nota agregada leida de la ficha PUBLICA y transcrita a mano, con su fecha.
 *
 * Existe para el hueco entre «no hay nada» y «estan las resenas»: sin el texto de
 * las resenas no se puede montar el carrusel, pero la nota y el numero SI son datos
 * ciertos y comprobables, y sin ellos la pagina de testimonios era un titulo sobre
 * un hueco en blanco.
 *
 * Lleva fecha a proposito: envejece. En cuanto corra el fetch de GBP, `resenas` se
 * llena y getResumen() calcula la media de verdad ignorando esto.
 */
export interface ResumenPublico {
  media: number;
  total: number;
  /** ISO corto. Cuando se leyo de la ficha. */
  leidoEl: string;
  fuente: string;
}

interface Snapshot {
  actualizado: string | null;
  perfil: Perfil;
  resenas: Resena[];
  resumenPublico?: ResumenPublico | null;
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
  if (SNAPSHOT.resenas.length) {
    return [...SNAPSHOT.resenas].sort((a, b) => b.fechaISO.localeCompare(a.fechaISO));
  }
  return getPlantillas();
}

/**
 * Las tarjetas de MAQUETA del carrusel, o lista vacia.
 *
 * Existen para poder ver el carrusel montado antes de que este enchufada la API de
 * Google Business Profile. NO son resenas y no pueden publicarse.
 *
 * FALLA CERRADO, que es el mismo criterio que ya usa el sitio con `robots.txt` y con
 * las canonicas: hacen falta las DOS condiciones para que aparezcan —que no sea un
 * build de produccion Y que no haya ni una resena real—. Con `PUBLIC_ES_PRODUCCION=1`
 * devuelve lista vacia y el componente vuelve exactamente al comportamiento de hoy.
 *
 * `=== '1'` invertido a proposito: cualquier valor que no sea exactamente `'1'`
 * —vacio, `true`, `si`, sin definir— cuenta como NO produccion, o sea que el error
 * por defecto es enseñar plantillas en un preview, nunca publicarlas.
 *
 * NO ALIMENTAN LA NOTA. `getResumen()` y `getResumenPublico()` leen
 * `SNAPSHOT.resenas` directamente y no pasan por aqui, asi que la media publicada
 * sigue siendo el 5,0 sobre 27 transcrito de la ficha publica, con su fecha y su
 * procedencia. Si estas contaran, la pagina anunciaria una media inventada sobre 4
 * — que es exactamente el fallo que este rodeo existe para evitar.
 *
 * El texto de cada plantilla empieza por «PLANTILLA» / «MOCKUP» a proposito: en la
 * web de un contratista con licencia, un testimonio inventado y verosimil es un
 * problema legal —la FTC lo sanciona por infraccion desde octubre de 2024—, y una
 * captura de pantalla sobrevive al recuerdo de quien la hizo.
 */
function getPlantillas(): Resena[] {
  if (import.meta.env.PUBLIC_ES_PRODUCCION === '1') return [];
  const p = (plantillas as unknown as { resenas: Resena[] }).resenas ?? [];
  return [...p].sort((a, b) => b.fechaISO.localeCompare(a.fechaISO));
}

/** true si lo que se esta pintando son maquetas y no resenas. Para avisarlo en pantalla. */
export function esPlantilla(): boolean {
  return SNAPSHOT.resenas.length === 0 && getPlantillas().length > 0;
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
  if (rs.length) {
    return {
      media: rs.reduce((s, r) => s + r.rating, 0) / rs.length,
      total: rs.length,
    };
  }
  // Sin resenas cargadas se usa la nota transcrita de la ficha publica, si la hay.
  // Las resenas reales SIEMPRE mandan sobre ella: en cuanto llegan, esta rama no se
  // vuelve a tocar y no hay dos cifras que puedan contradecirse.
  const p = SNAPSHOT.resumenPublico;
  return p ? { media: p.media, total: p.total } : null;
}

/**
 * La nota transcrita, o null si el resumen sale de resenas de verdad.
 *
 * El componente lo usa para decir de DONDE sale la cifra y de cuando. Un numero sin
 * procedencia en una pagina de testimonios es exactamente lo que no queremos.
 */
export function getResumenPublico(): ResumenPublico | null {
  if (SNAPSHOT.resenas.length) return null;
  return SNAPSHOT.resumenPublico ?? null;
}
