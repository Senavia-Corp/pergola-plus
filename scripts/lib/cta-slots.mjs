/**
 * El texto alternativo del fondo de CTA de cada producto y servicio.
 *
 * ───────────────────────────────────────────────────────────────────────────────
 * ESTE FICHERO CONTENIA UN GENERADOR DE IMAGENES. SE RETIRO A PROPOSITO.
 *
 * Hasta el 28-08-2026 cada entrada traia cinco campos mas —`producto`,
 * `escenario`, `detalle`, `izquierda`, `derecha`— que juntos eran el prompt para
 * generar con IA una fotografia REALISTA del producto de esa pagina, situada en una
 * ciudad concreta de Florida, a partir de tres fotos reales de obra como referencia.
 * `scripts/preparar-cta.mjs` montaba ese prompt para los 17 slugs y copiaba las
 * referencias a ~/Downloads para una sesion manual en higgsfield.ai.
 *
 * Nunca llego a correrse: `public/images/cta/` no existe y las 201 paginas cierran
 * con el fondo generico. Pero el aparato estaba entero y a un paso de usarse, y lo
 * que producia era esto: la pagina de un contratista CON LICENCIA cerrando con una
 * pergola que parece suya y que no existe. Eso es publicidad enganosa, y no deja de
 * serlo porque la imagen sea bonita ni porque el prompt describa el producto real.
 *
 * `scripts/integrar-higgsfield.mjs` ya documenta la misma cicatriz por el otro lado:
 * un modelo al que le pides restaurar una foto puede devolverte una foto mejor que
 * NO ES LA MISMA CASA — y pasa desapercibido hasta que lo ve el cliente cuya casa
 * sale ahi.
 *
 * LA REGLA, para que no vuelva: el fondo del CTA es FOTOGRAFIA REAL de obra propia,
 * o es el fondo generico. No hay tercera opcion. Generar con IA se reserva a lo NO
 * probatorio —fondos abstractos, texturas, degradados—, nunca a algo que el
 * visitante vaya a leer como «una obra que hicimos».
 *
 * ───────────────────────────────────────────────────────────────────────────────
 * POR QUE SOBREVIVE EL `alt`
 *
 * No es residuo. `transformar.mjs` lo exige: si algun dia hay imagen en
 * `public/images/cta/<slug>.avif` y este mapa no tiene su `alt`, LANZA en vez de
 * publicar un <img> sin texto alternativo en las dos versiones de idioma. Es la
 * puerta que hace que una imagen nueva no pueda entrar muda.
 *
 * Los 17 textos describen obra real y siguen valiendo para la foto que ponga el
 * cliente. Si la foto que llega no se parece a lo que dice su `alt`, el `alt` se
 * reescribe: manda la foto.
 *
 * Las puertas que siguen vivas: `check:cta` (comprobar-cta.mjs) mide recorte y
 * legibilidad del titular, e `integrar-cta.mjs` ademas ensena cada imagen contra las
 * referencias reales del slug para que un humano conteste «¿es el mismo producto?».
 * Las dos valen igual para fotografia del cliente.
 */
export const CTA_SLOTS = {
  // ── Productos ────────────────────────────────────────────────────────────────
  'motorized-louvered-pergolas': {
    alt:
      // Reescrito mirando el recorte publicado, no el prompt que lo genero. El texto
      // anterior —«white aluminum louvers … poolside deck … waterfront home in Palm
      // Beach Gardens»— era el prompt de IA que esta cabecera dice haber retirado, y
      // se quedo publicado como `alt` de una FOTO DEL CLIENTE que no muestra nada de
      // eso: la estructura es bronce oscuro, las lamas color arena, no hay piscina, no
      // hay frente al agua, y la ciudad no se puede saber. Manda la foto.
      'Freestanding motorized louvered pergola with a dark bronze aluminum frame and '
      + 'sand-coloured louvers angled part-open, seen from below against the sky over a '
      + 'lounge terrace, with a clipped hedge and a tile-roof house behind.',
  },
  'solid-roof-pergolas': {
    alt:
      'Solid insulated roof pergola with a warm wood-grain soffit and recessed '
      + 'lighting over a waterfront outdoor kitchen in Jupiter, Florida.',
  },
  'open-air-pergolas': {
    alt:
      'Open-air white aluminum pergola with an open rafter grid and visible sky '
      + 'above a paver patio in Parkland, Florida.',
  },
  'polycarbonate-pergolas': {
    alt:
      'Polycarbonate roof pergola with translucent panels casting soft diffuse '
      + 'light over a patio in Boynton Beach, Florida.',
  },
  'solar-pergolas': {
    alt:
      'Solar pergola with a photovoltaic panel roof over an outdoor lounge at a '
      + 'waterfront home in Miami, Florida.',
  },
  'motorized-screens': {
    alt:
      'Motorized retractable bronze screens lowered across a covered patio '
      + 'overlooking a pool in Wellington, Florida.',
  },
  'screen-enclosures': {
    alt:
      'Aluminum pool screen enclosure with charcoal mesh over a swimming pool and '
      + 'lake view in Coral Springs, Florida.',
  },
  'carports': {
    alt:
      'Aluminum carport with a warm wood-grain soffit and slatted side screen '
      + 'over a paver driveway in Plantation, Florida.',
  },
  'cabanas': {
    alt:
      'Free-standing aluminum poolside cabana with white curtains and a lounge '
      + 'daybed in Weston, Florida.',
  },
  'sukkha': {
    alt:
      'Sukkha 3000 retractable roof structure with a bamboo reed mat and glazed '
      + 'walls over a set table in Fort Lauderdale, Florida.',
  },

  // ── Servicios ────────────────────────────────────────────────────────────────
  'pergola-design-construction': {
    alt:
      'Custom engineered aluminum louvered pergola integrated into a contemporary '
      + 'waterfront home in West Palm Beach, Florida.',
  },
  'full-outdoor-remodel': {
    alt:
      'Full outdoor remodel with large-format pavers, a louvered pergola and an '
      + 'outdoor kitchen in Delray Beach, Florida.',
  },
  'pavers': {
    alt:
      'Newly installed large-format paver patio with tight uniform joints and a '
      + 'linear drain in Boca Raton, Florida.',
  },
  'driveways': {
    alt:
      'Herringbone paver driveway with a soldier-course border sweeping up to a '
      + 'luxury home in Palm Beach, Florida.',
  },
  'concrete': {
    alt:
      'Finished structural concrete patio slab with saw-cut joints and a clean '
      + 'square edge in Pompano Beach, Florida.',
  },
  'deck-builders': {
    alt:
      'Multi-level grey composite deck with black horizontal cable railing at a '
      + 'home in West Palm Beach, Florida.',
  },
  'fence-solutions': {
    alt:
      'Dark aluminum horizontal-slat privacy fence running along a landscaped '
      + 'property edge in Boca Raton, Florida.',
  },};
