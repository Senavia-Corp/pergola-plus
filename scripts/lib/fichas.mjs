/**
 * El registro de las fichas de producto recompuestas: lo que cambia de una a otra.
 *
 * `scripts/lib/transformar.mjs` tiene el MOLDE —los catorce pasos, iguales para las
 * diez— y aqui vive lo PROPIO de cada producto: sus chips, sus fotos, el copy de las
 * secciones nuevas y los pies de galeria. Un producto sin entrada aqui no se recompone
 * y se publica como salio de Webflow, que es un estado valido: las tandas parciales
 * tienen que funcionar solas.
 *
 * ───────────────────────────────────────────────────────────────────────────────
 * POR QUE UN REGISTRO Y NO UNA FUNCION POR FICHA
 *
 * La primera version era una funcion con el slug del piloto incrustado: las fotos, el
 * copy y hasta el numero de diapositivas. Copiarla nueve veces habria dado nueve
 * funciones de 290 lineas con el 85 % identico, y el dia que el markup migrado cambie
 * —que cambiara, es un export de Webflow— habria que arreglar el mismo `cambiar()` en
 * nueve sitios. Con nueve copias, la que se olvide no da error: `cambiar()` lanza solo
 * en la ficha que se toca.
 *
 * ───────────────────────────────────────────────────────────────────────────────
 * EL MOLDE SE REPLICA; EL CONTENIDO NO
 *
 * Nada de lo que hay aqui se copia de una ficha a otra. Cada producto tiene sus fotos,
 * sus objeciones y su vocabulario, y el dia que dos fichas compartan parrafo el
 * contenido unico de las diez cae por debajo del 60 % — que es exactamente la
 * diferencia que costo levantar la primera.
 *
 * Y NI UNA CIFRA SIN FUENTE. Antes de escribir aqui un acabado, una velocidad de
 * viento, un plazo o una garantia: `grep -rli <termino> docs/vivo/`. Si el cliente no
 * lo dice, no existe. Ya se colo una vez un acabado «champagne» que no estaba en la
 * carta de color y que viajaba a `Product.additionalProperty` como dato estructurado.
 *
 * ───────────────────────────────────────────────────────────────────────────────
 * LAS TRES DESVIACIONES DEL MOLDE, MEDIDAS SOBRE LOS DIEZ FRAGMENTOS
 *
 *   1. `cabanas`, `screen-enclosures` y `sukkha` NO TIENEN `video-section`.
 *      Se declara con `video: null` y el paso 8 se salta. El molde lo COMPRUEBA en las
 *      dos direcciones: declarar video donde no lo hay, o al reves, lanza.
 *   2. `sukkha` tiene OCHO diapositivas de galeria; las otras nueve tienen diez.
 *      Por eso `diapositivas` es un numero del registro y no un 10 fijo.
 *   3. `sukkha` numera sus fotos `-1`…`-8` y el resto `-01`…`-10`. Por eso la clave
 *      del mapa de pies es la cadena EXACTA que sale del nombre del fichero.
 *
 * Todo lo demas —los chips, `feature`, `section-faq-page`, `intro-column-right`,
 * `services`, `blog`, `service-areas`, `process` y los dos `call-to-action-footer`—
 * da el mismo recuento en los diez.
 */

/**
 * Los valores de `data-product` de las tarjetas de /products.
 *
 * NO SON LOS SLUGS, y confundirlos no da error: un selector escrito con `open-air`
 * devuelve tarjetas de menos y la seccion de comparacion sale a medias. Este mapa es
 * la unica traduccion admitida entre las dos formas.
 */
export const DATA_PRODUCT = {
  'motorized-louvered-pergolas': 'louvered',
  'solid-roof-pergolas': 'insulated',
  'open-air-pergolas': 'open',
  'polycarbonate-pergolas': 'polycarbonate',
  'solar-pergolas': 'solar',
  sukkha: 'sukkha',
  cabanas: 'cabana',
  carports: 'carport',
  'screen-enclosures': 'enclosure',
  'motorized-screens': 'screen',
};

/**
 * El texto de ancla de cada tarjeta de comparacion.
 *
 * `Explore More →` cuatro veces seguidas no vale nada como texto de ancla y es un
 * desastre para quien lista los enlaces con un lector de pantalla. Se cambia el texto
 * VISIBLE, no un `aria-label`: el nombre accesible tiene que contener el texto visible
 * (WCAG 2.5.3), asi que poner un `aria-label` distinto seria cambiar un problema por
 * otro. Y el `h3` de la tarjeta esta FUERA del `<a>` —lo estira un `::after` de
 * tarjetas.css—, o sea que el ancla que ve Google es solo esta cadena.
 */
export const ANCLA_TARJETA = {
  louvered: 'Motorized Louvered Pergolas',
  insulated: 'Insulated Solid Roof Pergolas',
  open: 'Open-Air Aluminum Pergolas',
  polycarbonate: 'Polycarbonate Roof Pergolas',
  solar: 'Solar-Integrated Pergolas',
  sukkha: 'The Sukkha 3000 System',
  cabana: 'Poolside Aluminum Cabanas',
  carport: 'Aluminum Carports',
  enclosure: 'Pool And Patio Screen Enclosures',
  screen: 'Motorized Retractable Screens',
};

export const FICHAS = {
  // ══════════════════════════════════════════════════════════════════════════════
  // Pergolas de lamas motorizadas — la ficha piloto
  // ══════════════════════════════════════════════════════════════════════════════
  'motorized-louvered-pergolas': {
    cms: '/cms-img/products/motorized-louvered-pergolas',
    galeria: {
      prefijo: 'gallery-louvered-roof-pergola-contractors-south-florida-',
      diapositivas: 10,
    },

    // Los tres chips del hero, en su orden. `viejo` es el texto que trae el migrado y
    // `nuevo` el que se publica; iguales salvo donde hubo decision.
    //
    // «NOA & FPA Certified» -> «Engineered to Florida Wind Code» es DECISION DEL
    // CLIENTE (28-ago-2026) y es REVERTIBLE. La pagina afirmaba una certificacion sin
    // un solo numero: ni mph, ni psf, ni numero de aprobacion de Miami-Dade (medido
    // con grep sobre el build: cero). Con la seccion de especificaciones al lado
    // declarando «numero de NOA: pendiente», la contradiccion quedaba a la vista. Se
    // sustituye por lo que SI se sostiene —que la estructura se CALCULA para la
    // normativa de viento—, que es proceso, no resultado. EN CUANTO EL CLIENTE APORTE
    // EL NUMERO, esto vuelve a `NOA &amp; FPA Certified` y el numero entra en §8.
    chips: [
      { viejo: 'Sun or Shade on Demand', nuevo: 'Sun or Shade on Demand', destino: '#how-it-works' },
      { viejo: 'Smart Home Integrated', nuevo: 'Smart Home Integrated', destino: '#features' },
      { viejo: 'NOA &amp; FPA Certified', nuevo: 'Engineered to Florida Wind Code', destino: '#specs' },
    ],

    // Los `alt` de las cuatro fotos grandes. El hero y la portada del FAQ compartian
    // LITERALMENTE la misma cadena, la de la intro era prosa de producto que no
    // describia su fotografia, y el «swatch» no tenia ninguno.
    alts: [
      { contexto: 'el alt del hero',
        viejo: 'alt="Louvered roof pergola contractors in South Florida installing motorized aluminum pergolas with smart controls, rain sensors, and modern outdoor living design." loading="lazy" src="/images/cliente/motorized-louvered.avif"',
        nuevo: 'alt="Freestanding motorized louvered pergola with a graphite aluminum frame, louvers half open over a paver-and-turf terrace with lounge seating and a fire table." loading="lazy" src="/images/cliente/motorized-louvered.avif"' },
      { contexto: 'el alt de la portada del FAQ',
        viejo: '<img src="{CMS}/cover-louvered-roof-pergola-contractors-south-florida.avif" alt="Louvered roof pergola contractors in South Florida installing motorized aluminum pergolas with smart controls, rain sensors, and modern outdoor living design."',
        nuevo: '<img src="{CMS}/cover-louvered-roof-pergola-contractors-south-florida.avif" alt="White louvered pergola attached to a yellow stucco home, louvers closed flat over a poolside dining and lounge terrace."' },
      { contexto: 'el alt de la intro',
        viejo: 'alt="Louvered roof pergola contractors in South Florida installing custom motorized aluminum pergolas engineered for sun control, rain protection, and coastal durability."',
        nuevo: 'alt="Freestanding louvered pergola shading a lounge set beside a pool, louvers closed flat, with a clipped hedge and potted plants around the deck."' },
      { contexto: 'el alt del falso «swatch»',
        viejo: '<img src="{CMS}/swatch-louvered-roof-pergola-builders-south-florida.avif" loading="lazy" alt=""',
        nuevo: '<img src="{CMS}/swatch-louvered-roof-pergola-builders-south-florida.avif" loading="lazy" alt="White aluminum louvered roof attached to a two-storey white stucco home, louvers angled to throw striped shade over a covered dining terrace."' },
    ],

    // §4 «Configuraciones que construimos» — clon de `section.intro-location`.
    // Los cuatro bullets salen de LAS FOTOS, una a una, y de nada mas: adosada frente
    // a exenta, y las dos familias de acabado. Ni un voladizo en pies, ni un numero de
    // modulos, ni un ancho de lama, ni una luz maxima: nada de eso esta medido.
    configuraciones: {
      foto: '04',
      alt: 'Freestanding louvered pergola with a dark bronze fascia and white aluminum louvers, open over a lounge set on a paver terrace against a clipped ficus hedge.',
      rotulo: 'Configurations',
      titulo: 'Two Ways We Mount It, Two Finish Families',
      texto: 'Every louvered roof we build is drawn for one house. The two decisions that change the shape of the project are where it lands and how it is finished: attached to the structure of the house, or freestanding over a deck or a pool. From there the frame goes dark bronze or white. Everything after that is engineering for your site.',
      bullets: ['Attached to the House', 'Freestanding Over Deck or Pool',
        'Dark Bronze Powder-Coat Finish', 'White Powder-Coat Finish'],
      boton: { destino: '#compare', texto: 'See How It Compares' },
    },

    // §5 «Como funciona» — `section.why-choose-section`.
    // Los cuatro hechos salen de cuatro preguntas YA ESCRITAS Y YA TRADUCIDAS de
    // src/i18n/faqs.es.ts. El hedge «depending on the system» es OBLIGATORIO: 140-170
    // grados es un rango del sector, no una especificacion de nuestro producto.
    comoFunciona: {
      foto: '06',
      alt: 'Close-up from below of the louver drive: a white rack-and-pinion gear on the dark gutter beam that rotates the aluminum blades.',
      rotulo: 'How It Works',
      titulo: 'What Happens Inside The Roof',
      texto: 'A louvered roof is a mechanism, not a finish. Four things decide whether you are still happy with it in ten years: how far the louvers actually turn, what the roof does when the power goes, where the water ends up, and whether the motor can be reached. Here is each one.',
      celdas: [
        ['/images/pp-icon-rotacion.svg', 'Full Rotation, Any Position',
          'The louvers turn through about 140 to 170 degrees depending on the system, which is what takes you from open sky to a closed roof and lets you stop anywhere in between. In practice you use three: closed for rain, part-open for filtered light, open in the evening.'],
        ['/images/pp-icon-respaldo.svg', 'When The Power Goes Out',
          'The louvers hold their last position. They do not fall open, and they do not close on their own. Systems can be specified with a manual override or a battery backup so you can still close the roof during an outage — worth having where the outage and the storm arrive together.'],
        ['/images/pp-icon-desague.svg', 'Where The Water Goes',
          'Closed, the louvers interlock and the water runs into an integrated gutter and down inside the posts. Keeping that channel and the post drainage clear is the whole maintenance story: a blocked channel is the most common cause of water where it should not be. Do not pressure wash into the drive.'],
        ['/images/pp-icon-motor.svg', 'The Motor Is Serviceable',
          'The motor is a serviceable component, not a sealed part of the structure. It is designed to be reached and swapped without dismantling the roof. How long it lasts depends on cycles and on whether water is getting where it should not — which is why the drainage above matters.'],
      ],
      botones: [
        { destino: '#specs', clase: 'secundary', texto: 'See The Specifications' },
        { destino: '#faq', clase: 'tertiary', texto: 'See The Questions' },
      ],
    },

    // Los pies y los `alt` de la galeria, por NOMBRE DE ARCHIVO y nunca por posicion.
    // El orden del DOM no es 01→10, es 03, 08, 04, 02, 05, 10, 09, 07, 06, 01. Por eso
    // el `altDerivado` de img-map.json numeraba «gallery image 10» para el fichero -01.
    //
    // Bajan a seis y no es una poda por gusto: `04` y `06` pasan a §4 y §5, y una foto
    // en dos secciones de la misma pagina es peor que una menos. `02` sale porque es
    // obra sin rematar con manguera y juguetes en el encuadre, y `05` porque es el
    // MISMO jardin que la foto de la intro, que ya sale a todo el ancho mas arriba.
    pies: {
      '01': ['Attached, dark bronze frame, louvers open at the edge of the pool',
        'Bronze louvered pergola attached to a tile-roof home, louvers open over a travertine pool deck, with the gutter downspout running down inside the post.'],
      '03': ['Attached to a white soffit, louvers open over a paver patio and outdoor dining area',
        'Louvered roof section built alongside an existing solid patio cover, louvers fully open to the sky over a brick paver dining patio.'],
      '07': ['Freestanding, white louvers, poolside against a clipped hedge',
        'Freestanding louvered pergola on a deck at the pool edge, white louvers open, framed by a ficus hedge and palms.'],
      '08': ['Attached, white frame, over the patio of a yellow stucco house',
        'White louvered pergola attached to a yellow stucco home, shading an outdoor dining and grill area beside the pool.'],
      '09': ['Attached, white frame, louvers open, turning the corner of the house',
        'White louvered pergola turning the corner of a home, louvers open to the sky, with an electrical fixture and its cabling mounted on the beam.'],
      '10': ['Rain sensor and wind vane on the gutter beam: the hardware that closes the roof',
        'Rain sensor and wind vane bolted to the gutter beam of a white louvered pergola — the hardware that closes the roof on its own.'],
    },

    // Las cinco preguntas del FAQ migrado, para quitarles la numeracion.
    // NO ES UN CAPRICHO DE ESTILO, ES UNA REPARACION: src/data/faqs.ts documenta que
    // `origen: 'ficha'` significa que el texto tiene que seguir cuadrando con este
    // bloque, y la biblioteca las guarda SIN numerar.
    faqNumeradas: [
      'How do louvered pergolas work?',
      'Are they safe in hurricanes?',
      'Do they have rain sensors?',
      'Will the coastal salt rust it?',
      'How fast is the installation?',
    ],

    // El titular del video. `null` en las fichas que no tienen `video-section`.
    // El viejo hablaba de la empresa y de la region, no del producto, y EN ESPAÑOL
    // colapsaba en la misma cadena que el H2 de `service-areas`, produciendo un `<h2>`
    // duplicado que `check:i18n` NO puede cazar: las dos estan traducidas y la
    // cobertura es del 100 %. Es un fallo de destino, no de cobertura.
    video: 'Watch It Open, Watch It Close',

    // La entradilla del CTA de cierre. La vieja hablaba de «pergolas, patio covers, or
    // pool enclosures» en las diez fichas por igual.
    ctaEntradilla: 'Meet with our exterior designers for a free consultation. We&#x27;ll measure your space, look at how you use it, and plan the louvered roof around both.',

    // §15 «Comparar las cubiertas». El ORDEN es el del criterio de decanibalizacion,
    // no el de /products: primero la cubierta fija (la consulta «louvered vs solid
    // roof» es la que de verdad compite), luego la abierta (se lleva la consulta de
    // precio), luego la translucida, y la solar al final porque entra por completar el
    // cuadro, no por competir.
    comparar: {
      productos: ['insulated', 'open', 'polycarbonate', 'solar'],
      rotulo: 'Other Roofs',
      titulo: 'Compare The Four Pergola Roofs',
      texto: 'A louvered roof is the one that moves. If you would rather have a roof that never moves, one that lets the light through, or one that pays for itself, these are the other three we build.',
    },
  },

  // ══════════════════════════════════════════════════════════════════════════════
  // Cubierta maciza aislada
  // ══════════════════════════════════════════════════════════════════════════════
  'solid-roof-pergolas': {
    cms: '/cms-img/products/solid-roof-pergolas',
    galeria: {
      prefijo: 'gallery-insulated-roof-pergola-builders-south-florida-',
      diapositivas: 10,
    },

    // «Cools Patio Drastically» era un superlativo sin una sola cifra, y quedaba a una
    // pantalla de una §8 que dice por escrito que no publica ninguna. Se sustituye por
    // el MECANISMO, que es lo que si se sostiene: el panel lleva un nucleo aislante y
    // por eso debajo se esta mas fresco. Fuente: la pregunta `material-techo-aislado`
    // («keeps the underside cooler than a bare metal roof») y la carta del cliente
    // («high-density insulated panels significantly minimize radiant heat»). El dia
    // que haya un delta de temperatura medido, vuelve con el numero.
    //
    // Los otros dos son hechos comprobables —se ven en las fotos y los dice el
    // cliente— y se quedan tal cual.
    chips: [
      { viejo: 'Cools Patio Drastically', nuevo: 'Insulated Panel, Cooler Underneath', destino: '#how-it-works' },
      { viejo: 'Ready for Fans &amp; TVs', nuevo: 'Ready for Fans &amp; TVs', destino: '#features' },
      { viejo: 'Hidden Gutter System', nuevo: 'Hidden Gutter System', destino: '#specs' },
    ],

    // El hero y la portada del FAQ traian LITERALMENTE la misma cadena, igual que en el
    // piloto; la intro y el «swatch» venian con `alt=""`.
    alts: [
      { contexto: 'el alt del hero',
        viejo: 'alt="Insulated roof pergola builders in South Florida designing custom aluminum patio covers engineered for heat reduction and all-weather protection." loading="lazy" src="/images/cliente/solid-roof-pergolas.avif"',
        nuevo: 'alt="Attached insulated roof pergola with a dark bronze frame and ceiling fans, shading an outdoor kitchen and dining terrace beside a pool." loading="lazy" src="/images/cliente/solid-roof-pergolas.avif"' },
      { contexto: 'el alt de la portada del FAQ',
        viejo: '<img src="{CMS}/cover-insulated-roof-pergola-builders-south-florida.avif" alt="Insulated roof pergola builders in South Florida designing custom aluminum patio covers engineered for heat reduction and all-weather protection."',
        nuevo: '<img src="{CMS}/cover-insulated-roof-pergola-builders-south-florida.avif" alt="Freestanding insulated roof pergola with a dark bronze frame over a lawn terrace, with a hanging wicker chair and tropical planting around it."' },
      { contexto: 'el alt de la intro',
        viejo: 'alt="Insulated roof pergola builders in South Florida designing custom aluminum patio covers for maximum shade, heat reduction, and year-round outdoor comfort." loading="lazy" src="{CMS}/intro-insulated-roof-pergola-builders-south-florida.avif"',
        nuevo: 'alt="Underside of an insulated roof: a wood-look slatted ceiling with a large fan and recessed downlights, looking out over a lake through a slatted privacy screen." loading="lazy" src="{CMS}/intro-insulated-roof-pergola-builders-south-florida.avif"' },
      { contexto: 'el alt del falso «swatch»',
        viejo: '<img src="{CMS}/swatch-insulated-roof-pergola-contractors-south-florida.avif" loading="lazy" alt=""',
        nuevo: '<img src="{CMS}/swatch-insulated-roof-pergola-contractors-south-florida.avif" loading="lazy" alt="Attached insulated roof with a warm wood-look soffit and a dark bronze fascia, over an outdoor kitchen on a travertine terrace by the water."' },
    ],

    // §4. Los dos ejes salen de LAS FOTOS y de la carta del cliente, y de nada mas:
    // adosada frente a exenta (cinco y cuatro fotos respectivamente), y las dos
    // familias de techo —liso de la carta o con textura tipo madera, que el cliente
    // llama «Textured Wood-Like Finishes»—. Ni una luz maxima, ni un espesor de panel,
    // ni un numero de modulos: nada de eso esta medido en el repo.
    configuraciones: {
      foto: '06',
      alt: 'Freestanding insulated roof pergola with a dark bronze frame and a plain light ceiling, over a paved terrace with lounge seating on a lawn.',
      rotulo: 'Configurations',
      titulo: 'Two Ways We Mount It, Two Ceilings',
      texto: 'Every solid roof we build is drawn for one house. The two decisions that change the project are where it lands and what you see when you look up: attached to the structure of the house, or freestanding over a patio or a lawn. From there the ceiling is either plain from the powder-coat palette or a wood-look texture. Everything after that is engineering for your site.',
      bullets: ['Attached to the House', 'Freestanding Over Patio or Lawn',
        'Plain Powder-Coat Ceiling', 'Wood-Look Textured Ceiling'],
      boton: { destino: '#compare', texto: 'See How It Compares' },
    },

    // §5. Los cuatro hechos salen de cuatro preguntas de la biblioteca, tres de ellas
    // escritas en esta sesion porque el tema solo tenia UNA propia. Ninguno afirma un
    // resultado normativo ni una cifra: el panel, el cableado, el agua y el permiso.
    comoFunciona: {
      foto: '09',
      alt: 'Insulated roof attached to a house over an outdoor kitchen and dining table, with dark slatted privacy screens on two sides and a wood-look ceiling.',
      rotulo: 'How It Works',
      titulo: 'What The Roof Is Actually Made Of',
      texto: 'A solid roof is not a lid. Four things decide whether you are still happy with it in ten years: what is inside the panel, where the wiring runs, where the rain goes, and what it takes to get it permitted. Here is each one.',
      celdas: [
        ['/images/pp-icon-panel.svg', 'What Is Inside The Panel',
          'An insulating core bonded between two aluminium skins. That is what makes the panel structural and thermally useful at the same time: it spans without a visible frame underneath, and it keeps the underside cooler than a bare metal roof would. It is also why the ceiling can be a finished surface instead of the back of a sheet.'],
        ['/images/pp-icon-cableado.svg', 'Where The Wiring Runs',
          'Inside the panels. The channels are part of the roof, so ceiling fans, recessed lighting and outlets mount into a finished ceiling rather than being surface-run afterwards. This is the difference you notice from below, and it is decided at the drawing stage — not once the roof is up.'],
        ['/images/pp-icon-desague.svg', 'Where The Rain Goes',
          'The panels interlock and the roof drains into a gutter built into the beam, so nothing is bolted on afterwards and nothing runs down the face of the structure. Keeping that channel clear is most of the maintenance story: a blocked gutter is the usual reason water turns up where it should not.'],
        ['/images/pp-icon-permiso.svg', 'It Is A Permitted Structure',
          'A solid roof is a permanent load-bearing structure, so it is permitted — that is not a hurdle, it is the point. We do the structural engineering and run the approval, and the roof is sized from the calculation for your address rather than from a catalogue span.'],
      ],
      botones: [
        { destino: '#specs', clase: 'secundary', texto: 'See The Specifications' },
        { destino: '#faq', clase: 'tertiary', texto: 'See The Questions' },
      ],
    },

    // Seis obras, todas distintas entre si. Se van cuatro y cada una por su motivo:
    //   `10` es LA MISMA FOTO QUE EL HERO —distancia de Hamming 0 entre las dos, solo
    //        cambia la compresion—, asi que publicarla abajo la enseñaria dos veces;
    //   `06` y `09` pasan a §4 y §5;
    //   la diapositiva restante no esta en la carpeta de este producto: apunta a
    //        /cms-img/services/pergola-design-construction/. Sin pie declarado, sale.
    pies: {
      '01': ['Attached, flat white ceiling, three fans over the pool terrace',
        'Attached insulated patio cover with a flat white ceiling and three ceiling fans, running the length of a travertine pool terrace with a lake behind.'],
      '02': ['Freestanding over the lawn, dark bronze frame beside the pool',
        'Freestanding insulated roof pergola with a dark bronze frame on a lawn beside a pool, sheltering a hanging wicker chair and a daybed among tropical planting.'],
      '03': ['Attached, wood-look soffit and dark fascia, over the outdoor kitchen',
        'Attached insulated roof with a warm wood-look soffit and a dark bronze fascia, covering an outdoor kitchen and lounge on a travertine terrace by the water.'],
      '04': ['The same roof from the terrace: bar, grill and the canal behind',
        'Wide view of an insulated roof over a waterfront outdoor kitchen, with a bar, stools and travertine paving, and moored boats along the canal behind.'],
      '05': ['Freestanding, light ceiling, against a slatted screen wall',
        'Freestanding insulated roof pergola with a light ceiling and a ceiling fan, over a paved lounge area set against a slatted screen wall on a lawn.'],
      '08': ['Attached, with the screen lowered down the open side',
        'Attached insulated roof against a stucco house with a motorised screen lowered across the open side, shading a lounge area next to a clipped hedge.'],
    },

    faqNumeradas: [
      'Does the solid roof block heat?',
      'Are they fully waterproof?',
      'Can I add a ceiling fan or TV?',
      'What maintenance is needed?',
      'Are they permitted in Broward?',
    ],

    video: 'See It From Underneath',

    ctaEntradilla: 'Meet with our exterior designers for a free consultation. We&#x27;ll measure your space, look at how you use it, and plan the roof and its ceiling around both.',

    // El orden es el del criterio de decanibalizacion: primero la que de verdad
    // compite —«louvered vs solid roof» es LA consulta—, luego la abierta (se lleva la
    // consulta de precio), la translucida y la solar al final.
    comparar: {
      productos: ['louvered', 'open', 'polycarbonate', 'solar'],
      rotulo: 'Other Roofs',
      titulo: 'Compare The Four Pergola Roofs',
      texto: 'A solid roof is the one that never moves. If you would rather have a roof that opens, one that lets the light through, or one that pays for itself, these are the other three we build.',
    },
  },

  // ══════════════════════════════════════════════════════════════════════════════
  // Cortinas motorizadas
  // ══════════════════════════════════════════════════════════════════════════════
  'motorized-screens': {
    cms: '/cms-img/products/motorized-screens',
    galeria: { prefijo: 'gallery-motorized-screen-installers-south-florida-', diapositivas: 10 },

    // «Coastal Wind Rated» NO se suaviza por prudencia: se quita porque la biblioteca
    // de este mismo sitio dice lo contrario. `material-cortinas-viento`: «Each system
    // has a rated wind speed ABOVE WHICH IT SHOULD BE RETRACTED… Screens are a comfort
    // and shade product, NOT A HURRICANE SHUTTER». Un chip que dice «homologada para
    // viento de costa» encima de una §8 que declara que no publicamos la cifra, y a
    // dos pantallas de una respuesta que dice que hay que recogerlas, es la
    // contradiccion mas cara de las diez fichas. Se sustituye por el MECANISMO real.
    chips: [
      { viejo: 'Instant Bug Protection', nuevo: 'Instant Bug Protection', destino: '#features' },
      { viejo: 'Retracts Invisibly', nuevo: 'Retracts Invisibly', destino: '#how-it-works' },
      { viejo: 'Coastal Wind Rated', nuevo: 'Wind Sensor Retracts Them', destino: '#specs' },
    ],

    alts: [
      { contexto: 'el alt del hero',
        viejo: 'alt="Motorized screen installers in South Florida providing retractable patio screens for shade, privacy, and smart outdoor automation." loading="lazy" src="/images/cliente/motorized-screens.avif"',
        nuevo: 'alt="Motorized screens lowered across the open side of a covered patio, dark mesh dimming the view out to a pool and palms." loading="lazy" src="/images/cliente/motorized-screens.avif"' },
      { contexto: 'el alt de la portada del FAQ',
        viejo: '<img src="{CMS}/cover-motorized-screen-installers-south-florida.avif" alt="Motorized screen installers in South Florida providing retractable patio screens for shade, privacy, and smart outdoor automation."',
        nuevo: '<img src="{CMS}/cover-motorized-screen-installers-south-florida.avif" alt="Inside a lanai with the motorized screens down, the dark mesh keeping the view through to the pool deck and the planting beyond."' },
      { contexto: 'el alt de la intro',
        viejo: 'alt="Motorized screen installers in South Florida providing retractable patio screens for shade, privacy, wind control, and smart outdoor automation." loading="lazy" src="{CMS}/intro-motorized-screen-installers-in-south-florida.jpg"',
        nuevo: 'alt="Motorized screens run the length of a two-storey home, lowered over the covered walkway beside a lap pool." loading="lazy" src="{CMS}/intro-motorized-screen-installers-in-south-florida.jpg"' },
      { contexto: 'el alt del falso «swatch»',
        viejo: '<img src="{CMS}/swatch-motorized-screen-and-retractable-patio.avif" loading="lazy" alt=""',
        nuevo: '<img src="{CMS}/swatch-motorized-screen-and-retractable-patio.avif" loading="lazy" alt="Motorized screens lowered along a covered terrace, with the pool and the seating area visible through the mesh."' },
    ],

    // §4 no habla de montaje: habla de CUANTAS. Sale de `pergola-cortinas-cuantas`, y
    // es el consejo que ningun competidor da porque le baja el ticket: «Most spaces
    // need one or two… Screening every opening turns an outdoor room into a box and
    // costs four times as much».
    configuraciones: {
      foto: '10',
      alt: 'Freestanding pergola with a motorized screen lowered on one side and fixed slatted panels on the other, over a paved dining terrace.',
      rotulo: 'Configurations',
      titulo: 'How Many You Actually Need',
      texto: 'Most spaces need one or two screens, not four. The side the afternoon sun comes from and the side facing a neighbour or a road are the ones that change how the space feels; screening every opening turns an outdoor room into a box and costs four times as much. We measure the openings, ask which hours you actually use it, and start with the worst side.',
      bullets: ['The Afternoon-Sun Side', 'The Side Facing A Neighbour',
        'Into A New Pergola Bay', 'Retrofitted To What You Have'],
      boton: { destino: '#compare', texto: 'See How It Compares' },
    },

    comoFunciona: {
      foto: '08',
      alt: 'Motorized screens across a lit lanai after dark, the warm interior showing through the mesh from outside.',
      rotulo: 'How It Works',
      titulo: 'What A Screen Can And Cannot Do',
      texto: 'A motorized screen is fabric on a roller, and that is the whole honest answer. Four things decide whether it does what you wanted: what the mesh does to light, what happens when it blows, what happens when something is in the way, and where it goes when it is up.',
      celdas: [
        ['/images/pp-icon-malla.svg', 'What The Mesh Does To Light',
          'Mesh works by contrast: it hides whichever side is darker. In daylight you see out and people outside do not see in. After dark, with the light on inside, that reverses — which surprises people who bought screens for evening privacy. If that is what you want, you want a blackout or a dense fabric on that opening, and we will say so before you buy it.'],
        ['/images/pp-icon-viento.svg', 'What Happens When It Blows',
          'Every system has a wind speed above which the screen should be retracted, and it can be set to retract itself on a wind sensor. This is the part worth reading twice: a screen is a comfort and shade product, not a hurricane shutter. Anyone who tells you otherwise is selling you the wrong thing for the storm.'],
        ['/images/pp-icon-obstaculo.svg', 'If Something Is In The Way',
          'Sensors stop the screen on its way down when it meets an obstruction, which is what makes it safe around children, pets and furniture you did not move. It is a standard feature, not an upgrade, and it is the reason a motorized screen is safer than the crank-and-hope alternative.'],
        ['/images/pp-icon-carcasa.svg', 'Where It Goes When It Is Up',
          'Into a concealed aluminium cassette, with the fabric running in side tracks. Retracted, the whole system reads as a beam: no rolled bundle hanging in the opening, no visible hardware. On a retrofit this is the part that decides feasibility — the cassette and the tracks need somewhere solid to land.'],
      ],
      botones: [
        { destino: '#specs', clase: 'secundary', texto: 'See The Specifications' },
        { destino: '#faq', clase: 'tertiary', texto: 'See The Questions' },
      ],
    },

    pies: {
      '01': ['Lowered along the full length of a covered lanai',
        'Motorized screens lowered along the full length of a covered lanai on a white house, with lawn in front and the pool deck behind the mesh.'],
      '02': ['Retracted at dusk: the opening reads as a clean beam',
        'Covered patio at dusk with the screens fully retracted into their housings, warm interior lighting showing through the open bays and hydrangeas in the foreground.'],
      '03': ['A long run beside a lap pool, screens down',
        'Motorized screens lowered along a two-storey home beside a lap pool, the dark mesh shading the whole covered walkway.'],
      '04': ['From inside, with the mesh half down',
        'Interior of a lanai with a motorized screen partway down, wicker seating in the foreground and the pool visible through the mesh.'],
      '05': ['Screens up over a kidney pool and paver deck',
        'Screened lanai with the mesh retracted, looking across a kidney-shaped pool and paver deck with a thatched bar to one side.'],
      '09': ['Under a gable roof, screens closing the far side',
        'Motorized screens closing the far side of a gable-roofed outdoor room, with wicker sofas and an ottoman on a paver terrace.'],
    },

    faqNumeradas: [
      'How are screens controlled?',
      'Can they withstand strong winds?',
      'Do they reduce patio heat?',
      'Are they hidden when not in use?',
      'Can you add them to my pergola?',
    ],

    video: 'Watch Them Come Down',

    ctaEntradilla: 'Meet with our exterior designers for a free consultation. We&#x27;ll measure the openings, ask which hours you actually use the space, and start with the side that is costing you.',

    comparar: {
      productos: ['enclosure', 'louvered', 'insulated', 'cabana'],
      rotulo: 'Other Ways To Close A Space',
      titulo: 'Screens, Enclosures Or A Roof',
      texto: 'A motorized screen closes a side and rolls away. If you want the whole space enclosed permanently, a roof that opens and shuts, a roof that never moves, or a structure of its own, these are the other four we build.',
    },
  },

  // ══════════════════════════════════════════════════════════════════════════════
  // Pergolas de policarbonato
  // ══════════════════════════════════════════════════════════════════════════════
  'polycarbonate-pergolas': {
    cms: '/cms-img/products/polycarbonate-pergolas',
    galeria: { prefijo: 'gallery-polycarbonate-pergola-contractors-south-florida-', diapositivas: 10 },

    // Dos de los tres chips eran absolutos sin cifra, y en Florida uno de ellos ademas
    // suena a homologacion: «Impact-Resistant» es lo que dicen las ventanas y puertas
    // con NOA. Sin numero de aprobacion detras, afirmarlo en el hero de una pagina cuya
    // §8 declara que no publica ninguna cifra de viento es la contradiccion de F4a otra
    // vez. Se sustituyen por lo que SI se sostiene: la construccion del panel.
    // «Advanced UV Protection» se queda: es vago, pero el cliente publica su respaldo
    // («block 99% of harmful rays») y no afirma ninguna norma.
    chips: [
      { viejo: '100% Waterproof Patio', nuevo: 'Watertight Panel Roof', destino: '#how-it-works' },
      { viejo: 'Advanced UV Protection', nuevo: 'Advanced UV Protection', destino: '#features' },
      { viejo: 'Impact-Resistant Roofing', nuevo: 'Multiwall Polycarbonate Panels', destino: '#specs' },
    ],

    alts: [
      { contexto: 'el alt del hero',
        viejo: 'alt="Polycarbonate pergola contractors in South Florida installing UV-protected translucent roofing systems for patios and poolside outdoor spaces." loading="lazy" src="/images/cliente/polycarbonate-pergola.avif"',
        nuevo: 'alt="Polycarbonate pergola with a pale translucent roof on a grey aluminum frame, throwing diffuse light over a terrace against a stucco house." loading="lazy" src="/images/cliente/polycarbonate-pergola.avif"' },
      { contexto: 'el alt de la portada del FAQ',
        viejo: '<img src="{CMS}/cover-polycarbonate-pergola-contractors-south-florida.avif" alt="Polycarbonate pergola contractors in South Florida installing UV-protected translucent roofing systems for patios and poolside outdoor spaces."',
        nuevo: '<img src="{CMS}/cover-polycarbonate-pergola-contractors-south-florida.avif" alt="White-framed polycarbonate pergola over an outdoor kitchen and bar on a composite deck, backed by a clipped hedge."' },
      { contexto: 'el alt de la intro',
        viejo: 'alt="Polycarbonate pergola contractors in South Florida installing UV-protected translucent roofing systems for patios, pools, and modern outdoor living spaces." loading="lazy" src="{CMS}/intro-polycarbonate-pergola-contractors-south-florida-01.avif"',
        nuevo: 'alt="Dark-framed polycarbonate pergola beside a slatted privacy screen, its translucent roof lighting a paved side terrace." loading="lazy" src="{CMS}/intro-polycarbonate-pergola-contractors-south-florida-01.avif"' },
      { contexto: 'el alt del falso «swatch»',
        viejo: '<img src="{CMS}/swatch-polycarbonate-pergola-contractors-south-florida.avif" loading="lazy" alt=""',
        nuevo: '<img src="{CMS}/swatch-polycarbonate-pergola-contractors-south-florida.avif" loading="lazy" alt="Dark aluminum frame with white posts carrying a translucent polycarbonate roof over a patio with French doors."' },
    ],

    configuraciones: {
      foto: '05',
      alt: 'White-framed polycarbonate pergola over an outdoor kitchen on a composite deck, the translucent roof keeping the whole space bright.',
      rotulo: 'Configurations',
      titulo: 'Two Ways We Mount It, And How Much Light You Let Through',
      texto: 'Every polycarbonate roof we build is drawn for one house. Where it lands is the first decision — attached to the structure, or freestanding over a deck or a patio. The second is the panel: the tint sets how much light comes through and how much heat comes with it, and the frame colour decides whether the structure reads light or dark against your house.',
      bullets: ['Attached to the House', 'Freestanding Over Deck or Patio',
        'Panel Tint To Suit The Light', 'Frame Colour From The Palette'],
      boton: { destino: '#compare', texto: 'See How It Compares' },
    },

    // Los cuatro hechos salen de las tres preguntas propias del tema y de la carta del
    // cliente. Dos de ellos le restan al producto —el ruido de la lluvia y el hecho de
    // que la capa UV solo funciona por una cara— y por eso son los que valen: son las
    // dos cosas que un comprador descubre despues, no antes.
    comoFunciona: {
      foto: '08',
      alt: 'Seen from below: translucent polycarbonate panels on a dark frame with a ceiling fan, daylight coming through the roof.',
      rotulo: 'How It Works',
      titulo: 'What A Translucent Roof Really Does',
      texto: 'A polycarbonate roof buys you light that a solid roof cannot. Four things decide whether that trade is the right one for your patio: how the UV layer works, what the panel is actually made of, what it sounds like in the rain, and where the water ends up.',
      celdas: [
        ['/images/pp-icon-uv.svg', 'The UV Layer, And Which Way It Faces',
          'Quality panels carry a co-extruded UV layer and a manufacturer warranty measured in years against yellowing and loss of light. The part nobody mentions: the layer only works facing out. Orientation at installation matters as much as the panel you buy, which is why this is not a job to hand to whoever is cheapest that week.'],
        ['/images/pp-icon-panel.svg', 'Multiwall, Not A Single Sheet',
          'A multiwall panel is two skins with air chambers between them, not one flat sheet. The chambers are what make it stiffer, quieter and better at slowing heat than the single-skin material sold in kit form. It is also the reason the roof reads as a soft diffuse light rather than a hard glare.'],
        ['/images/pp-icon-ruido.svg', 'It Is Louder In The Rain',
          'Noticeably louder than an insulated solid roof, and we would rather you heard it here. It is a thin panel and rain drums on it; multiwall is quieter than single-skin because the chambers damp the impact. If you want to hold a conversation through a Florida downpour, this is the wrong roof and we will tell you so.'],
        ['/images/pp-icon-desague.svg', 'Where The Water Goes',
          'The panels sit in a gutter profile built into the frame, so the roof drains at its edge rather than dripping down the line of every joint. It is the same engineered aluminium structure we put under an open-air pergola: the panel changes, the frame does not.'],
      ],
      botones: [
        { destino: '#specs', clase: 'secundary', texto: 'See The Specifications' },
        { destino: '#faq', clase: 'tertiary', texto: 'See The Questions' },
      ],
    },

    // Cinco obras. Se van cinco: la `-01` es la MISMA foto que la intro (sale tres
    // veces en el fragmento), la `-03` es practicamente la del «swatch» (distancia de
    // Hamming 1), la `-05` y la `-08` pasan a §4 y §5, y la ultima diapositiva no es de
    // este producto: apunta a /images/cliente/custom-pergolas-and-patio-covers.avif.
    pies: {
      '02': ['Dark frame over the grill run, against a white wall',
        'Dark-framed polycarbonate roof over an outdoor grill run, set against a white wall on a paver-and-turf terrace.'],
      '04': ['Over the side garden, between the palms',
        'Polycarbonate roof on a dark frame covering a planted side entrance, framed by travellers palms and tropical planting.'],
      '07': ['White frame over a raised bar and counter',
        'White-framed polycarbonate pergola over a raised outdoor bar and counter, attached to a two-storey stucco home.'],
      '09': ['Close up from below: panel, rafter and sky',
        'Close view from below of translucent polycarbonate panels on dark rafters, with cloud and blue sky showing through the roof.'],
      '10': ['A long attached run over a brick-house patio',
        'Long polycarbonate roof attached along the back of a brick house, covering a patio with a hanging chair and seating.'],
    },

    faqNumeradas: [
      'Do polycarbonate roofs block UV?',
      'Will the panels turn yellow?',
      'Can they survive severe storms?',
      'Do they keep the patio dry?',
      'Are the panel tints custom?',
    ],

    video: 'Light Through The Roof',

    ctaEntradilla: 'Meet with our exterior designers for a free consultation. We&#x27;ll measure your space, look at which way it faces, and pick the panel around how much light you actually want.',

    comparar: {
      productos: ['insulated', 'louvered', 'open', 'solar'],
      rotulo: 'Other Roofs',
      titulo: 'Compare The Four Pergola Roofs',
      texto: 'A polycarbonate roof keeps the space bright and dry. If you would rather have a roof that is quieter and cooler underneath, one that opens and shuts, or one with nothing over you at all, these are the other three we build.',
    },
  },

  // ══════════════════════════════════════════════════════════════════════════════
  // Pergolas de estructura abierta
  // ══════════════════════════════════════════════════════════════════════════════
  'open-air-pergolas': {
    cms: '/cms-img/products/open-air-pergolas',
    galeria: { prefijo: 'gallery-open-air-pergola-builders-south-florida-', diapositivas: 10 },

    // «Maximum Cooling Airflow» y «Zero Maintenance» son un superlativo y un absoluto,
    // los dos sin cifra. El segundo ademas lo desmiente a medias la propia respuesta 2
    // de la ficha, que dice lo que SI se sostiene: el aluminio no se pudre, no se
    // alabea y no hay que barnizarlo. Eso no es cero mantenimiento, es no tener ESE
    // mantenimiento — y dicho asi es mas creible y sigue siendo la ventaja.
    chips: [
      { viejo: 'Timeless Elegance', nuevo: 'Timeless Elegance', destino: '#features' },
      { viejo: 'Maximum Cooling Airflow', nuevo: 'Open To The Breeze', destino: '#how-it-works' },
      { viejo: 'Zero Maintenance', nuevo: 'No Staining, No Rot', destino: '#specs' },
    ],

    alts: [
      { contexto: 'el alt del hero',
        viejo: 'alt="Open-air pergola builders in South Florida creating architectural aluminum pergolas that define outdoor living spaces with modern design." loading="lazy" src="/images/cliente/open-air-pergolas.avif"',
        nuevo: 'alt="Open-slat aluminum pergola in dark bronze attached along a white Mediterranean home, its rafters throwing striped shade over the pool terrace." loading="lazy" src="/images/cliente/open-air-pergolas.avif"' },
      { contexto: 'el alt de la portada del FAQ',
        viejo: '<img src="{CMS}/cover-open-air-pergola-builders-south-florida.avif" alt="Open-air pergola builders in South Florida creating architectural aluminum pergolas that define outdoor living spaces with modern design."',
        nuevo: '<img src="{CMS}/cover-open-air-pergola-builders-south-florida.avif" alt="Sand-coloured open-slat pergola attached over a terrace with a wall-mounted television, framed by palms against a pink stucco house."' },
      { contexto: 'el alt de la intro',
        viejo: 'alt="Open-air pergola builders in South Florida creating architectural aluminum pergolas that enhance outdoor spaces with shade, airflow, and modern design." loading="lazy" src="{CMS}/intro-open-air-pergola-builders-south-florida.avif"',
        nuevo: 'alt="White open-slat pergola attached to a brick home over a grill deck, the rafters casting a striped shadow across the lawn beyond." loading="lazy" src="{CMS}/intro-open-air-pergola-builders-south-florida.avif"' },
      { contexto: 'el alt del falso «swatch»',
        viejo: '<img src="{CMS}/swatch-luxury-pergola-builders-south-florida.avif" loading="lazy" alt=""',
        nuevo: '<img src="{CMS}/swatch-luxury-pergola-builders-south-florida.avif" loading="lazy" alt="White open-slat pergola over an outdoor kitchen and dining table by a pool, with string lights run between the rafters."' },
    ],

    configuraciones: {
      foto: '10',
      alt: 'Freestanding white open-slat pergola with a louvered privacy screen on one side, over a fire table on a lawn.',
      rotulo: 'Configurations',
      titulo: 'Two Ways We Mount It, And What You Add To It',
      texto: 'An open-air pergola is a frame, and what you put in the frame is most of the decision. Where it lands comes first — attached to the house, or freestanding out on the deck or the lawn. After that it is the slats themselves, the privacy screen on the side that needs one, and whether the lighting runs inside the beams. Everything else is engineering for your site.',
      bullets: ['Attached to the House', 'Freestanding Over Deck or Lawn',
        'Slatted Privacy Screen', 'Lighting Run Inside The Beams'],
      boton: { destino: '#compare', texto: 'See How It Compares' },
    },

    // El segundo hecho es el que decide la compra, y dice que NO. `pergola-lluvia-abierta`:
    // «an open slat roof sheds nothing. That is the trade for the light and airflow».
    // Publicarlo aqui pierde alguna venta y gana las que importan: el que lo descubre
    // despues del montaje no vuelve.
    comoFunciona: {
      foto: '07',
      alt: 'Dark open-slat pergola attached to a grey house over a timber deck, seen from below with the rafters against the sky.',
      rotulo: 'How It Works',
      titulo: 'What An Open Roof Gives You, And What It Does Not',
      texto: 'An open-air pergola is the one with nothing over you. That is the whole point and it is also the whole trade. Four things decide whether it is the right one: how much shade it actually casts, what happens when it rains, where the lighting goes, and what it is made of.',
      celdas: [
        ['/images/pp-icon-sombra.svg', 'How Much Shade It Actually Casts',
          'Less than people expect at midday and more in the morning and the evening, because fixed slats block sun by angle rather than by coverage. Slat depth and spacing set that trade-off, and we size them for the direction your patio faces. If you want reliable shade at two in the afternoon in July, say so now — that is a louvered roof, not this one.'],
        ['/images/pp-icon-lluvia.svg', 'What Happens When It Rains',
          'It sheds nothing. An open slat roof is not a rain roof, and that is the trade you make for the light and the airflow. If you want to keep using the space through a Florida afternoon storm, the answer is a louvered roof that closes, an insulated solid roof, or a retractable. We would rather lose the sale here than have you find out in August.'],
        ['/images/pp-icon-cableado.svg', 'Where The Lighting Goes',
          'Inside the beams. The structural sections take the wiring, so integrated LED runs along the rafters instead of being clipped underneath, and the space works after dark without a single visible cable. It is decided at the drawing stage, because the runs have to be in before the frame goes up.'],
        ['/images/pp-icon-permiso.svg', 'It Is A Permitted Structure',
          'Extruded, powder-coated aluminium, engineered and permitted for its own address. It does not rot, it does not warp and it never needs staining — which is the real answer to the maintenance question, rather than the word "zero". The post bases and caps are where the architectural detail lives.'],
      ],
      botones: [
        { destino: '#specs', clase: 'secundary', texto: 'See The Specifications' },
        { destino: '#faq', clase: 'tertiary', texto: 'See The Questions' },
      ],
    },

    // Seis obras. Se van cuatro: la `-02` ES LA FOTO DEL HERO (distancia de Hamming 1)
    // y la `-08` ES LA DE LA INTRO (distancia 0) — publicarlas abajo las enseñaria dos
    // veces en la misma pagina—, y la `-07` y la `-10` pasan a §5 y §4.
    pies: {
      '01': ['A long attached run over the lounge and fire bowl',
        'Long white open-slat pergola attached over a lounge terrace with a fire bowl and a pool table, on patterned tile against a pink stucco house.'],
      '03': ['Dark bronze, with a slatted screen behind the kitchen',
        'Dark bronze open-slat pergola over an outdoor kitchen, with a slatted privacy screen closing the side against a tall modern house.'],
      '04': ['Attached to the house, over the trellis and the planters',
        'Dark wood-look open-slat pergola attached to a white home above French doors, with garden trellis panels and planted pots below.'],
      '05': ['Looking up: rafters, trellis and the tile roof behind',
        'Looking up at the rafters of a dark open-slat pergola against a white stucco wall, with trellis panels and hanging glass ornaments.'],
      '06': ['Freestanding by the pool, against the bamboo hedge',
        'Freestanding dark open-slat pergola sheltering a sofa beside a pool, backed by a tall bamboo hedge.'],
      '09': ['White, with privacy screens along the lap pool',
        'White open-slat pergola with slatted privacy screens running alongside a lap pool, planters at the base of the posts.'],
    },

    faqNumeradas: [
      'Why choose an open-air pergola?',
      'Are they made of wood or metal?',
      'Can I add custom LED lighting?',
      'Do they boost property value?',
      'Are they built to Florida code?',
    ],

    video: 'Shade Without A Roof',

    ctaEntradilla: 'Meet with our exterior designers for a free consultation. We&#x27;ll measure your space, look at which way it faces, and size the slats around the hours you actually use it.',

    comparar: {
      productos: ['louvered', 'insulated', 'polycarbonate', 'solar'],
      rotulo: 'Other Roofs',
      titulo: 'Compare The Four Pergola Roofs',
      texto: 'An open-air pergola is the one with nothing over you. If you want a roof that closes when it rains, one that never moves, one that lets the light through, or one that pays for itself, these are the other four we build.',
    },
  },
};

/** La ruta de una foto de galeria de esa ficha. */
export const foto = (ficha, n) => `${ficha.cms}/${ficha.galeria.prefijo}${n}.avif`;

/** Las fichas que llevan el rediseño. La gemela en TypeScript es ESPECIFICACIONES. */
export const FICHAS_RECOMPUESTAS = new Set(Object.keys(FICHAS));
