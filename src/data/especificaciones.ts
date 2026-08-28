/**
 * La seccion «Especificaciones» de las fichas de producto, como DATOS.
 *
 * El texto vive en `src/i18n/especificaciones.es.ts`, en los dos idiomas, y la
 * bisagra entre las dos mitades es el `id` — el mismo reparto que usan el estimador
 * (`src/data/estimador.ts`) y las preguntas frecuentes (`src/data/faqs.ts`).
 *
 * POR QUE ESTA SECCION EXISTE. F0 midio diez preguntas de comprador que la ficha
 * dejaba sin responder. Seis de ellas —medidas, plazo, precio, garantia, viento y
 * financiacion— no se pueden cerrar escribiendo mejor: cinco de las seis piden un
 * dato que el repo NO TIENE. Asi que la seccion tiene DOS listas, y la segunda es la
 * que la hace util: lo que se afirma con fuente, y lo que explicitamente no se
 * publica todavia. Ningun competidor publica la segunda.
 *
 * LA REGLA QUE MANDA AQUI, y es la misma que la del `FAQPage`: solo entra en
 * `additionalProperty` del JSON-LD un valor cuya redaccion EXACTA pinte la pagina.
 * Un `PropertyValue` que el visitante no ve es la misma infraccion que un `FAQPage`
 * desincronizado, solo que sin puerta que lo cace. Por eso las filas se declaran una
 * vez, aqui, y de aqui salen las dos cosas: el markup y el grafo.
 *
 * LOS HUECOS NO SE EMITEN EN EL GRAFO. Un `PropertyValue` con valor «pendiente de
 * publicar» no es un dato: es ruido que un agregador puede leer como afirmacion. La
 * lista de huecos es contenido visible —y es la mejor parte de la seccion— pero no
 * es schema.
 */

/** Una ficha con seccion de especificaciones. */
export interface FichaEspecificaciones {
  /**
   * Filas AFIRMADAS, en el orden en que se pintan. Cada `id` tiene su etiqueta y su
   * valor en los dos idiomas, y su fuente citada en el copy.
   */
  filas: string[];
  /**
   * Las filas que ADEMAS entran en `Product.additionalProperty`.
   *
   * Es un subconjunto de `filas` y nunca al reves: lo comprueba el propio modulo mas
   * abajo. Quedan fuera, con motivo:
   *   - `plazo`   ya lo declara el `FAQPage` por la respuesta 5 de la ficha, y
   *               declarar dos veces lo mismo con dos redacciones es peor que una.
   *   - `inversion`  «mid five figures upward» es una banda cualitativa, no un dato.
   *               Meterla en un `additionalProperty` es `offers` por la puerta de
   *               atras, y src/lib/jsonld.ts lo prohibe expresamente.
   *   - `donde`   los condados y la licencia son hechos del NEGOCIO, no del producto.
   */
  enGrafo: string[];
  /** El id de la fila cuyo valor va tambien como `Product.material`, si lo hay. */
  material?: string;
  /** Huecos declarados. Se PINTAN y no se declaran. */
  huecos: string[];
  /**
   * Los enlaces de blog en linea, cada uno junto a la fila o el hueco que amplia.
   * Sustituyen al carrusel de blog que se retiro: sus 20 de 21 posts estaban
   * etiquetados a los diez productos a la vez, o sea que su «filtro por producto»
   * devolvia lo mismo en las diez fichas. Estos cinco estan al lado de la pregunta
   * que cada uno responde.
   *
   * `junto` es `entradilla` o el id de una fila o de un hueco.
   */
  enlaces: { id: string; ruta: string; junto: string }[];
}

export const ESPECIFICACIONES: Record<string, FichaEspecificaciones> = {
  'motorized-louvered-pergolas': {
    filas: [
      'giro', 'montaje', 'material', 'acabado', 'sensores', 'domotica',
      'desague', 'apagon', 'motor', 'plazo', 'inversion', 'donde',
    ],
    enGrafo: [
      'giro', 'montaje', 'material', 'acabado', 'sensores', 'domotica',
      'desague', 'apagon', 'motor',
    ],
    material: 'material',
    huecos: ['medidas', 'viento', 'aleacion', 'garantia', 'financiacion'],
    enlaces: [
      { id: 'compensa', ruta: '/post/is-a-louvered-roof-pergola-worth-it-in-florida', junto: 'entradilla' },
      { id: 'plazo', ruta: '/post/how-long-pergola-installation-florida', junto: 'plazo' },
      { id: 'permiso', ruta: '/post/pergola-permit-south-florida', junto: 'plazo' },
      { id: 'coste', ruta: '/post/pergola-cost-south-florida', junto: 'inversion' },
      { id: 'huracan', ruta: '/post/hurricane-resistant-pergolas-south-florida', junto: 'viento' },
    ],
  },
};

/**
 * El modulo se comprueba a si mismo al importarse.
 *
 * Las tres invariantes que, rotas, no darian ningun error: una fila del grafo que no
 * se pinta (schema que la pagina no enseña), un `material` que no es una fila, y un
 * enlace colgado de una fila o un hueco que no existe. Las tres son baratas de
 * comprobar y caras de descubrir en produccion.
 */
for (const [slug, f] of Object.entries(ESPECIFICACIONES)) {
  const anclas = new Set([...f.filas, ...f.huecos, 'entradilla']);
  for (const id of f.enGrafo) {
    if (!f.filas.includes(id)) {
      throw new Error(`[especificaciones] ${slug}: "${id}" esta en enGrafo y no se pinta como fila`);
    }
  }
  if (f.material && !f.filas.includes(f.material)) {
    throw new Error(`[especificaciones] ${slug}: material "${f.material}" no es una fila pintada`);
  }
  for (const e of f.enlaces) {
    if (!anclas.has(e.junto)) {
      throw new Error(`[especificaciones] ${slug}: el enlace "${e.id}" cuelga de "${e.junto}", que no existe`);
    }
  }
}
