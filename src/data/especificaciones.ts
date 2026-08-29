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
      // F4c (H-6): el sitio PUBLICA una tarifa para este producto y la ficha era menos
      // concreta que su propia web. El estimador es ademas el CTA de menor friccion que
      // tiene el sitio —«ponle precio tu mismo, sin dar el telefono»— y hasta ahora solo
      // se enlazaba desde el desplegable del nav, que es `display:none` en movil.
      { id: 'estimador', ruta: '/project-estimator', junto: 'inversion' },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────────
  // Cubierta maciza aislada
  //
  // ESTA §8 TIENE MENOS FILAS QUE LA DEL PILOTO Y MAS HUECOS, y no es un descuido:
  // es lo que la fuente da. Aqui hay una cifra dura que el piloto no tiene —la tarifa
  // por pie cuadrado, publicada por la propia empresa en su guia de costes de 2026— y
  // en cambio no hay giro de lamas ni comportamiento en apagon, porque esta cubierta no
  // se mueve. Doce filas en una ficha y once en otra es la diferencia entre los dos
  // productos, no entre dos niveles de esfuerzo.
  // ──────────────────────────────────────────────────────────────────────────────
  'solid-roof-pergolas': {
    filas: [
      'panel', 'montaje', 'material', 'acabado', 'techo', 'desague',
      'instalaciones', 'lucernarios', 'permiso', 'mantenimiento', 'plazo',
      'inversion', 'donde',
    ],
    enGrafo: [
      'panel', 'montaje', 'material', 'acabado', 'techo', 'desague',
      'instalaciones', 'lucernarios', 'mantenimiento',
    ],
    material: 'material',
    // Los mismos cinco huecos que el piloto MENOS `medidas` —aqui la luz sin columna
    // depende del panel y se dimensiona igual de a medida, asi que se mantiene— y sin
    // cambios en el resto: son huecos del negocio, no del producto. `financiacion` y
    // `garantia` son identicos en las diez fichas hasta que el cliente los aporte.
    huecos: ['medidas', 'viento', 'aleacion', 'garantia', 'financiacion'],
    enlaces: [
      { id: 'compensa', ruta: '/post/is-a-louvered-roof-pergola-worth-it-in-florida', junto: 'entradilla' },
      { id: 'plazo', ruta: '/post/how-long-pergola-installation-florida', junto: 'plazo' },
      { id: 'permiso', ruta: '/post/pergola-permit-south-florida', junto: 'permiso' },
      { id: 'coste', ruta: '/post/pergola-cost-south-florida', junto: 'inversion' },
      { id: 'estimador', ruta: '/project-estimator', junto: 'inversion' },
      { id: 'huracan', ruta: '/post/hurricane-resistant-pergolas-south-florida', junto: 'viento' },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────────
  // Cortinas motorizadas
  //
  // NO HAY FILA DE INVERSION CON CIFRA, y no es un olvido. El estimador lleva las
  // cortinas como EXTRA y con `fuente: 'mercado'`, que el propio modulo define como
  // «necesita firma» (`requiereFirma = fuente !== 'publicada'`). Una banda de mercado
  // detras del aviso legal del estimador es una cosa; la misma banda como fila de
  // especificacion de producto es otra. Hasta que la firme el cliente, la fila dice
  // lo que si se sostiene y enlaza el estimador.
  // ──────────────────────────────────────────────────────────────────────────────
  'motorized-screens': {
    filas: [
      'malla', 'control', 'viento', 'obstaculo', 'carcasa', 'montaje',
      'retrofit', 'material', 'acabado', 'plazo', 'inversion', 'donde',
    ],
    enGrafo: [
      'malla', 'control', 'viento', 'obstaculo', 'carcasa', 'montaje',
      'retrofit', 'material', 'acabado',
    ],
    material: 'material',
    // `tejido` es un hueco PROPIO de este producto: el factor de apertura de la malla
    // es el numero que de verdad separa dos cortinas que parecen iguales, y no lo
    // publica nadie aqui.
    huecos: ['tejido', 'viento', 'medidas', 'garantia', 'financiacion'],
    enlaces: [
      { id: 'plazo', ruta: '/post/how-long-pergola-installation-florida', junto: 'plazo' },
      { id: 'coste', ruta: '/post/pergola-cost-south-florida', junto: 'inversion' },
      { id: 'estimador', ruta: '/project-estimator', junto: 'inversion' },
      { id: 'huracan', ruta: '/post/hurricane-resistant-pergolas-south-florida', junto: 'viento' },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────────
  // Pergolas de policarbonato
  //
  // El estimador da 90-120 $/pie2 para este producto pero con `fuente: 'mercado'` y
  // una nota que dice de donde sale («derivada de la open-air publicada; el mercado de
  // kits prefabricados no aplica»). O sea: es una derivacion razonada, no una cifra
  // publicada. `requiereFirma` la marca como pendiente de firma, asi que aqui no lleva
  // numero — solo las cuatro con `fuente: 'publicada'` lo llevan.
  // ──────────────────────────────────────────────────────────────────────────────
  'polycarbonate-pergolas': {
    filas: [
      'panel', 'uv', 'luz', 'ruido', 'montaje', 'estructura', 'acabado',
      'desague', 'plazo', 'inversion', 'donde',
    ],
    enGrafo: ['panel', 'uv', 'luz', 'ruido', 'montaje', 'estructura', 'acabado', 'desague'],
    material: 'estructura',
    huecos: ['espesor', 'viento', 'garantia', 'medidas', 'financiacion'],
    enlaces: [
      { id: 'plazo', ruta: '/post/how-long-pergola-installation-florida', junto: 'plazo' },
      { id: 'permiso', ruta: '/post/pergola-permit-south-florida', junto: 'plazo' },
      { id: 'coste', ruta: '/post/pergola-cost-south-florida', junto: 'inversion' },
      { id: 'estimador', ruta: '/project-estimator', junto: 'inversion' },
      { id: 'huracan', ruta: '/post/hurricane-resistant-pergolas-south-florida', junto: 'viento' },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────────
  // Pergolas de estructura abierta
  //
  // `lluvia` es una fila AFIRMADA que dice que el producto no hace algo. Va en el
  // grafo a proposito: es tan especificacion como las demas, y es la que evita la
  // llamada de agosto.
  // ──────────────────────────────────────────────────────────────────────────────
  'open-air-pergolas': {
    filas: [
      'sombra', 'lluvia', 'montaje', 'material', 'acabado', 'iluminacion',
      'privacidad', 'mantenimiento', 'plazo', 'inversion', 'donde',
    ],
    enGrafo: ['sombra', 'lluvia', 'montaje', 'material', 'acabado', 'iluminacion', 'privacidad', 'mantenimiento'],
    material: 'material',
    huecos: ['medidas', 'viento', 'aleacion', 'garantia', 'financiacion'],
    enlaces: [
      { id: 'compensa', ruta: '/post/is-a-louvered-roof-pergola-worth-it-in-florida', junto: 'sombra' },
      { id: 'plazo', ruta: '/post/how-long-pergola-installation-florida', junto: 'plazo' },
      { id: 'permiso', ruta: '/post/pergola-permit-south-florida', junto: 'plazo' },
      { id: 'coste', ruta: '/post/pergola-cost-south-florida', junto: 'inversion' },
      { id: 'estimador', ruta: '/project-estimator', junto: 'inversion' },
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
