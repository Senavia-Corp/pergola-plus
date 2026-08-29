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

    // SE RETIRA. Esta es la unica ficha con proyectos etiquetados de las cinco hechas
    // —nueve—, asi que §9 «One We Built» renderiza, y ProyectoDeFicha.astro dice por
    // escrito que §9 SUSTITUYE al video en vez de sumarse. Con los dos, la pagina
    // encadenaba dos bloques oscuros y perdia la alternancia. Y de paso se va el
    // <iframe> de cdn.embedly.com, la unica dependencia externa que le quedaba.
    video: false,

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

  // ══════════════════════════════════════════════════════════════════════════════
  // Cocheras de aluminio
  // ══════════════════════════════════════════════════════════════════════════════
  'carports': {
    cms: '/cms-img/products/carports',
    galeria: { prefijo: 'gallery-aluminum-carport-builders-south-florida-', diapositivas: 10 },

    // «Wind-Code Compliant» afirma cumplimiento normativo sin un solo numero, y va a
    // una pantalla de una §8 que declara que no publicamos ni la velocidad de diseño ni
    // el NOA. Misma decision que el «NOA & FPA Certified» del piloto y misma redaccion:
    // se afirma el PROCESO —que la estructura se calcula para la normativa— y no el
    // resultado. Vuelve en cuanto el cliente aporte el numero.
    chips: [
      { viejo: 'Premium Sun Protection', nuevo: 'Premium Sun Protection', destino: '#how-it-works' },
      { viejo: 'Custom Home Integration', nuevo: 'Custom Home Integration', destino: '#features' },
      { viejo: 'Wind-Code Compliant', nuevo: 'Engineered to Florida Wind Code', destino: '#specs' },
    ],

    alts: [
      { contexto: 'el alt del hero',
        viejo: 'alt="Aluminum carport builders in South Florida constructing custom vehicle protection structures engineered for sun, rain, and high-wind conditions." loading="lazy" src="{CMS}/hero-aluminum-carport-south-florida.avif"',
        nuevo: 'alt="Aluminum carport with a warm wood-look soffit and a slatted side screen over a stamped concrete driveway, attached to a stone-fronted home." loading="lazy" src="{CMS}/hero-aluminum-carport-south-florida.avif"' },
      { contexto: 'el alt de la portada del FAQ',
        viejo: '<img src="{CMS}/cover-aluminum-carport-builders-south-florida.avif" alt="Aluminum carport builders in South Florida constructing custom vehicle protection structures engineered for sun, rain, and high-wind conditions."',
        nuevo: '<img src="{CMS}/cover-aluminum-carport-builders-south-florida.avif" alt="Carport with a dark bronze frame and wood-look soffit over a stamped driveway, with a slatted screen closing the side towards the neighbour."' },
      { contexto: 'el alt de la intro',
        viejo: 'alt="Aluminum carport builders in South Florida constructing custom vehicle protection structures engineered for sun exposure, heavy rain, and coastal conditions." loading="lazy" src="{CMS}/intro-aluminum-carport-builders-south-florida.avif"',
        nuevo: 'alt="Aluminum carport seen from the driveway, its slatted screens closing two sides and the wood-look ceiling lit by recessed downlights." loading="lazy" src="{CMS}/intro-aluminum-carport-builders-south-florida.avif"' },
      { contexto: 'el alt del falso «swatch»',
        viejo: '<img src="{CMS}/swatch-picture-8.jpg" loading="lazy" alt=""',
        nuevo: '<img src="{CMS}/swatch-picture-8.jpg" loading="lazy" alt="Aluminum carport with a wood-look soffit and slatted screen, seen from the driveway of a single-storey Florida home."' },
    ],

    configuraciones: {
      foto: '10',
      alt: 'Dark aluminum carport spanning the entry of a two-storey white home, its flat roof aligned with the roofline behind.',
      rotulo: 'Configurations',
      titulo: 'It Has To Fit The Car And The House',
      texto: 'A carport is the one structure on this site that has to satisfy two things at once: the vehicle that goes under it and the elevation it is attached to. Clear height is decided by what you actually park, not by a catalogue; post placement is decided by how you open the doors. After that it is the ceiling, the side screens and whether the roofline reads as part of the house.',
      bullets: ['Clear Height For Your Vehicle', 'Posts Placed Around The Doors',
        'Slatted Screens On The Open Sides', 'Roofline Matched To The House'],
      boton: { destino: '#compare', texto: 'See How It Compares' },
    },

    comoFunciona: {
      foto: '03',
      alt: 'Close view of a carport slatted screen in wood-look aluminum, with a weatherproof outdoor socket and switch mounted on the post beside it.',
      rotulo: 'How It Works',
      titulo: 'What A Carport Protects Against, And What It Does Not',
      texto: 'A carport is a roof on posts, and the honest version of what that buys you is narrower than the brochure. Four things decide whether it is worth it: whether your vehicle fits, what it actually protects against, where the water goes, and which roof you put on it.',
      celdas: [
        ['/images/pp-icon-altura.svg', 'Whether Your Vehicle Fits',
          'Measure height, not just length. A sedan is easy; a lifted truck, a van with a roof rack or an RV needs clear height specified up front, and roof-mounted accessories are what usually catch people out. Post placement matters as much: it is decided by how you open the doors, not by where the slab happens to end.'],
        ['/images/pp-icon-uv.svg', 'What It Actually Protects Against',
          'Sun, mainly, and that is not trivial: constant UV is what fades paint and cracks a dashboard. A solid roof also keeps rain and falling debris off. What an open carport does not do is stop wind-driven rain, and it is not a garage — if you want the car sealed away, this is the wrong structure and we will say so.'],
        ['/images/pp-icon-desague.svg', 'Where The Water Goes',
          'Into drainage built inside the structure, routed away from the vehicles and the driveway. That is the difference between a carport and a lean-to: nothing sheets off the front edge onto the car you just walked around, and there is no pooling at the foot of the posts.'],
        ['/images/pp-icon-panel.svg', 'Which Roof You Put On It',
          'Insulated, solid or polycarbonate — the same three roofs we build over a patio, sized for a driveway. Insulated is the coolest and quietest, solid is the plain workhorse, polycarbonate keeps the light. The frame underneath is the same engineered aluminium in all three.'],
      ],
      botones: [
        { destino: '#specs', clase: 'secundary', texto: 'See The Specifications' },
        { destino: '#faq', clase: 'tertiary', texto: 'See The Questions' },
      ],
    },

    // Se van cuatro: la `-05` ES la foto de la intro (distancia de Hamming 0), la `-03`
    // y la `-10` pasan a §5 y §4, y la `-07` es otro angulo de la misma obra que el hero.
    pies: {
      '01': ['The slatted screen straight on, from the driveway',
        'Wood-look aluminum slatted screen closing the side of a carport, seen straight on from a stamped concrete driveway.'],
      '02': ['Attached to the house, with the drive running under it',
        'Aluminum carport attached to a single-storey home, its dark frame and wood-look soffit spanning a stamped concrete driveway.'],
      '04': ['From underneath, looking out to the water',
        'Underside of a carport roof in wood-look aluminum, looking out past the posts to a canal and moored boats.'],
      '06': ['Between the palms, on the approach to the house',
        'Aluminum carport on the approach to a home, framed by palms, with a slatted screen on the far side.'],
      '08': ['White frame on a modern waterfront house',
        'Slim white aluminum carport attached to a modern waterfront home, a saloon car parked under it beside the seawall.'],
      '09': ['A double bay, with the drive laid in slabs',
        'White aluminum carport over a double parking bay with two dark cars, on a driveway laid in large concrete slabs between palms.'],
    },

    faqNumeradas: [
      'Do carports block UV sun rays?',
      'Are they built for high winds?',
      'Can the design match my home?',
      'Will the aluminum carport rust?',
      'Do I need a building permit?',
    ],

    // Hay UN proyecto etiquetado «Aluminum Carports», asi que §9 renderiza y sustituye
    // al video. Ver ProyectoDeFicha.astro y el paso 8 de recomponerFicha.
    video: false,

    ctaEntradilla: 'Meet with our exterior designers for a free consultation. We&#x27;ll measure the driveway, measure what you park on it, and draw the structure around both.',

    comparar: {
      productos: ['insulated', 'polycarbonate', 'cabana', 'louvered'],
      rotulo: 'Other Structures',
      titulo: 'Other Structures We Build',
      texto: 'A carport is a roof for the driveway. The same engineered frames and the same roofs go over a patio, a pool deck or a lounge — these are the four we build most often.',
    },
  },

  // ══════════════════════════════════════════════════════════════════════════════
  // Cerramientos con mosquitero
  // ══════════════════════════════════════════════════════════════════════════════
  'screen-enclosures': {
    cms: '/cms-img/products/screen-enclosures',
    galeria: { prefijo: 'gallery-screen-enclosure-contractors-south-florida-', diapositivas: 10 },

    // «Extreme Weather Rated» es una homologacion afirmada sin numero. Se sustituye por
    // el proceso, igual que en el piloto y en cocheras.
    chips: [
      { viejo: 'Expands Living Space', nuevo: 'Expands Living Space', destino: '#features' },
      { viejo: 'High-Visibility Mesh', nuevo: 'High-Visibility Mesh', destino: '#how-it-works' },
      { viejo: 'Extreme Weather Rated', nuevo: 'Engineered to Florida Wind Code', destino: '#specs' },
    ],

    alts: [
      { contexto: 'el alt del hero',
        viejo: 'alt="Screen enclosure contractors in South Florida installing custom aluminum screen rooms for patios and pool areas with code-compliant engineering." loading="lazy" src="/images/cliente/screen-enclosure.avif"',
        nuevo: 'alt="Looking up inside a screen enclosure: the dark aluminum framing radiating from the ridge with cloud and blue sky through the mesh." loading="lazy" src="/images/cliente/screen-enclosure.avif"' },
      { contexto: 'el alt de la portada del FAQ',
        viejo: '<img src="{CMS}/cover-screen-enclosure-contractors-south-florida.avif" alt="Screen enclosure contractors in South Florida installing custom aluminum screen rooms for patios and pool areas with code-compliant engineering."',
        nuevo: '<img src="{CMS}/cover-screen-enclosure-contractors-south-florida.avif" alt="Screen enclosure over a pool and spa beside a lit house at dusk, the white framing running the length of the lanai."' },
      { contexto: 'el alt de la intro',
        viejo: 'alt="Screen enclosure contractors in South Florida installing custom aluminum screen rooms for patios and pool areas with code-compliant structural engineering." loading="lazy" src="{CMS}/intro-screen-enclosure-contractors-south-florida.avif"',
        nuevo: 'alt="Screen enclosure with a high mansard roof over a pool and spa, opening onto a lake through the mesh." loading="lazy" src="{CMS}/intro-screen-enclosure-contractors-south-florida.avif"' },
      { contexto: 'el alt del falso «swatch»',
        viejo: '<img src="{CMS}/swatch-pool-screen-enclosure-contractors-south-florida.avif" loading="lazy" alt=""',
        nuevo: '<img src="{CMS}/swatch-pool-screen-enclosure-contractors-south-florida.avif" loading="lazy" alt="Pool screen enclosure in dark aluminum seen from the deck, with travertine paving and a lake beyond the mesh."' },
    ],

    // §4 sale de `pergola-cerramiento-mansarda`: la forma del techo es la decision que
    // de verdad mueve el precio y la altura, y es la que nadie explica.
    configuraciones: {
      foto: '04',
      alt: 'Screen enclosure with a curved mansard roof over a pool and spa, opening to a lake through the mesh.',
      rotulo: 'Configurations',
      titulo: 'Mansard, Gable Or Dome',
      texto: 'The shape of the roof is the decision that moves everything else. A flat or mansard cage sits lower, costs less and suits a patio; a gable or a dome gains headroom over a pool and sheds water better across a big span. Local wind requirements sometimes make the choice for you. Everything after that — mesh, doors, kickplates — is fitted to the shape you land on.',
      bullets: ['Mansard, Low And Economical', 'Gable Or Dome For Headroom',
        'Mesh Chosen Per Face', 'Doors And Kickplates To Suit'],
      boton: { destino: '#compare', texto: 'See How It Compares' },
    },

    comoFunciona: {
      foto: '02',
      alt: 'Screen enclosure over a pool with the lake behind, its dark framing dividing the view into panels.',
      rotulo: 'How It Works',
      titulo: 'What The Cage Actually Buys You',
      texto: 'A screen enclosure is aluminium and mesh, and the four things worth knowing before you sign are the ones a quote will not tell you: which mesh goes where, which panels wear out first, whether it counts as a pool barrier, and what it does and does not keep out.',
      celdas: [
        ['/images/pp-icon-malla.svg', 'Which Mesh Goes Where',
          'Standard fibreglass insect mesh, tighter no-see-um mesh for coastal and waterfront lots, solar screen that cuts heat and glare at the cost of some view, and heavy pet-resistant mesh for the lower panels. They can be mixed on the same cage, and mixing them is usually the right answer rather than paying for the expensive one everywhere.'],
        ['/images/pp-icon-uv.svg', 'Which Panels Go First',
          'Sun is what ages mesh, so the south and west faces go first and the shaded ones outlast them by years. Expect to rescreen the exposed faces well before the whole cage. Individual panels are replaceable without touching the frame, which is the part that decides whether this is a repair or a replacement in ten years.'],
        ['/images/pp-icon-barrera.svg', 'Whether It Counts As A Pool Barrier',
          'It can. Florida pool safety law accepts an enclosure that fully surrounds the pool and meets the barrier requirements, including self-closing and self-latching doors with the latch at the required height. Whether yours qualifies is decided at design, not afterwards, so raise it before the drawings are done.'],
        ['/images/pp-icon-forma.svg', 'What It Keeps Out, And What It Does Not',
          'Leaves and larger debris, yes, and that is the saving most owners notice: less skimming and less pump load. Pollen is fine enough to pass straight through insect mesh. A tighter no-see-um mesh catches more of it, at the cost of some airflow — which is the trade, and there is no mesh that does both.'],
      ],
      botones: [
        { destino: '#specs', clase: 'secundary', texto: 'See The Specifications' },
        { destino: '#faq', clase: 'tertiary', texto: 'See The Questions' },
      ],
    },

    pies: {
      '01': ['A long lanai enclosure beside the pool at dusk',
        'Screen enclosure running the length of a lanai beside a pool and spa, with the house lit from inside at dusk.'],
      '03': ['High cage over the pool, open to the lake',
        'Tall screen enclosure over a pool and spa, its framing dividing a view out over a lake and low planting.'],
      '05': ['Over the pool and the covered terrace together',
        'Screen enclosure spanning both a pool and the covered terrace beside it, on a home with a tile roof and palms.'],
      '06': ['From the deck, with the framing overhead',
        'Inside a screen enclosure looking up at the aluminum framing over a pool, with palms and a lake showing through the mesh.'],
      '08': ['A wide cage over pool, spa and fire table',
        'Wide screen enclosure over a pool, spa and fire table on a travertine deck, with a lake behind the mesh.'],
      '10': ['Enclosing the lanai of a two-storey house',
        'Screen enclosure closing the lanai of a two-storey Florida home, with the pool visible through the mesh from the garden.'],
    },

    faqNumeradas: [
      'Do enclosures block the breeze?',
      'Do they meet hurricane codes?',
      'Will the screen mesh sag easily?',
      'Are building permits required?',
      'Can you fit my complex pool?',
    ],

    video: null,

    ctaEntradilla: 'Meet with our exterior designers for a free consultation. We&#x27;ll measure the pool and the deck, ask how you use the space, and pick the roof shape and the mesh around both.',

    comparar: {
      productos: ['screen', 'louvered', 'insulated', 'cabana'],
      rotulo: 'Other Ways To Close A Space',
      titulo: 'Enclosures, Screens Or A Roof',
      texto: 'An enclosure closes the whole space in mesh, permanently. If you would rather close one side at a time, put a roof over part of it, or build a structure of its own, these are the other four we build.',
    },
  },

  // ══════════════════════════════════════════════════════════════════════════════
  // Sukkha 3000
  // ══════════════════════════════════════════════════════════════════════════════
  sukkha: {
    cms: '/cms-img/products/sukkha',
    // OCHO diapositivas, no diez, y numeradas `-1`…`-8` en vez de `-01`…`-10`. Es la
    // unica ficha que se sale del molde en las dos cosas a la vez.
    galeria: { prefijo: 'gallery-sukkha-3000-outdoor-structure-builders-south-florida-', diapositivas: 8 },

    // «Category 5 Reinforced» es la afirmacion mas fuerte de las diez fichas: nombra una
    // CATEGORIA DE HURACAN. En todo docs/vivo no hay ni una cifra de viento, ni un NOA,
    // ni una presion de diseño, y la §8 de esta misma pagina lo declara como hueco. Es
    // exactamente el defecto que F4a marco en rojo, en su version mas expuesta. Se
    // sustituye por lo que si se sostiene —que es un sistema calculado y permisado— y
    // vuelve, con la categoria y todo, el dia que exista el numero que la respalde.
    chips: [
      { viejo: 'Bespoke Luxury Design', nuevo: 'Bespoke Luxury Design', destino: '#features' },
      { viejo: 'Category 5 Reinforced', nuevo: 'Engineered And Permitted', destino: '#specs' },
      { viejo: 'Smart-Home Automated', nuevo: 'Smart-Home Automated', destino: '#how-it-works' },
    ],

    alts: [
      { contexto: 'el alt del hero',
        viejo: 'alt="Sukkha 3000 outdoor structure builders in South Florida delivering advanced engineered pergola systems with automation and modern architectural design." loading="lazy" src="/images/cliente/sukkah.avif"',
        nuevo: 'alt="Sukkha 3000 structure over a laid table for a celebration, string lights and greenery along the beams under a reed mat roof." loading="lazy" src="/images/cliente/sukkah.avif"' },
      { contexto: 'el alt de la portada del FAQ',
        viejo: '<img src="{CMS}/cover-sukkha-3000-outdoor-structure-builders-south-florida.avif" alt="Sukkha 3000 outdoor structure builders in South Florida delivering advanced engineered pergola systems with automation and modern architectural design."',
        nuevo: '<img src="{CMS}/cover-sukkha-3000-outdoor-structure-builders-south-florida.avif" alt="Sukkha 3000 structure enclosing a paved terrace in glass and dark aluminum, with a dining table set under the slatted roof."' },
      { contexto: 'el alt de la intro',
        viejo: 'alt="Sukkha 3000 outdoor structure builders in South Florida delivering advanced engineered pergola systems with automation, durability, and modern architectural design." loading="lazy" src="{CMS}/intro-sukkha-3000-outdoor-structure-builders-south-florida.avif"',
        nuevo: 'alt="Reed mat roof of a Sukkha 3000 seen from below, hung with vine garlands and pendant lights between dark aluminum beams." loading="lazy" src="{CMS}/intro-sukkha-3000-outdoor-structure-builders-south-florida.avif"' },
      { contexto: 'el alt del falso «swatch»',
        viejo: '<img src="{CMS}/swatch-sukkha-outdoor-structure-builders-south-florida.avif" loading="lazy" alt=""',
        nuevo: '<img src="{CMS}/swatch-sukkha-outdoor-structure-builders-south-florida.avif" loading="lazy" alt="Sukkha 3000 structure in dark aluminum against a stone-faced house, its glazed sides open onto a bluestone terrace."' },
    ],

    configuraciones: {
      foto: '5',
      alt: 'Sukkha 3000 structure with glazed sides and a reed mat roof over a dining terrace, hung with garlands and lights.',
      rotulo: 'Configurations',
      titulo: 'A Defined System, Not A One-Off',
      texto: 'The Sukkha 3000 is a system with a known configuration rather than a bespoke structure drawn from nothing, and that is the whole proposition: it specifies faster, it permits faster, and it is priced accordingly. What you choose inside it is the layout, the size, the finish and which of the integrated features you want. What you do not choose is the engineering, because it is already done.',
      bullets: ['Layout And Size To The Space', 'Finish From The Palette',
        'Integrated Automation And Lighting', 'Fascia Wrap Over The Hardware'],
      boton: { destino: '#compare', texto: 'See How It Compares' },
    },

    comoFunciona: {
      foto: '3',
      alt: 'Inside a Sukkha 3000: dark beams carrying a reed mat roof, with glazed walls and a paved floor.',
      rotulo: 'How It Works',
      titulo: 'What Makes It A System',
      texto: 'Most of what we build is drawn from nothing for one house. This one is not, and the difference is worth understanding before you compare quotes: four things come with the system rather than with the project.',
      celdas: [
        ['/images/pp-icon-sistema.svg', 'A Known Configuration',
          'It suits projects that want a defined, engineered system rather than a fully bespoke one-off — faster to specify, faster to permit, and priced accordingly. If your space has unusual geometry or an awkward tie-in to the house, a bespoke structure is usually the better answer, and we will tell you which one you are looking at.'],
        ['/images/pp-icon-automatizacion.svg', 'Automation Built In, Not Added',
          'The system is designed around motorised elements, lighting and controls rather than having them retrofitted afterwards. That is why the runs are already accounted for: nothing is chased in later and nothing is surface-clipped to a beam that was not expecting it.'],
        ['/images/pp-icon-carcasa.svg', 'The Hardware Is Wrapped',
          'Fascia wrap options close over the hardware, which is what keeps the profile reading as a clean architectural line rather than as a mechanism with covers. It is the detail that separates a specified system from an assembly of parts.'],
        ['/images/pp-icon-permiso.svg', 'Engineered And Permitted',
          'Premium-grade aluminium, engineered to resist corrosion and structural fatigue, and permitted for the address it is going on. We do the calculation and run the approval, the same as on everything else we build.'],
      ],
      botones: [
        { destino: '#specs', clase: 'secundary', texto: 'See The Specifications' },
        { destino: '#faq', clase: 'tertiary', texto: 'See The Questions' },
      ],
    },

    // Seis de las ocho. Se van la `-6` (casi la misma que el hero) y la `-3`, que pasa
    // a §5; la `-5` va a §4.
    pies: {
      '1': ['Glazed sides open onto the terrace, roof mat above',
        'Sukkha 3000 with glazed sides folded open onto a paved terrace, a dining table set beneath the reed mat roof.'],
      '2': ['Under the mat: beams, garlands and pendant lights',
        'Looking up inside a Sukkha 3000 at the reed mat roof, hung with vine garlands and pendant lights between dark beams.'],
      '4': ['The run of the structure along the house',
        'Sukkha 3000 running along the side of a house, its dark aluminum frame and glazed panels enclosing a long paved terrace.'],
      '7': ['Open at the end, looking out to the garden',
        'Interior of a Sukkha 3000 looking out through the open end to a garden, with a table and chairs on stone paving.'],
      '8': ['The structure from the garden, roof mat in place',
        'Sukkha 3000 seen from the lawn, its dark frame and glazed walls set against a house, with the reed mat roof in place.'],
      '5': ['Set for a meal under the garlands',
        'Table laid for a meal inside a Sukkha 3000, under a reed mat roof hung with vine garlands and warm lights.'],
    },

    faqNumeradas: [
      'What makes Sukkha 3000 unique?',
      'Is the design customizable?',
      'Can it withstand hurricanes?',
      'Does it support smart home tech?',
      'Is it a permanent structure?',
    ],

    video: null,

    ctaEntradilla: 'Meet with our exterior designers for a free consultation. We&#x27;ll look at the space, tell you whether the system fits it or whether a bespoke structure would serve you better, and price both.',

    comparar: {
      productos: ['louvered', 'insulated', 'open', 'cabana'],
      rotulo: 'Other Structures',
      titulo: 'Other Structures We Build',
      texto: 'The Sukkha 3000 is a defined system. If your space wants something drawn from nothing — a roof that opens, one that never moves, an open frame or a structure of its own — these are the four we build most often.',
    },
  },

  // ══════════════════════════════════════════════════════════════════════════════
  // Pergolas solares
  //
  // ⚠️ LAS CATORCE IMAGENES DE ESTE PRODUCTO SON RENDERS 3D, NO FOTOGRAFIA DE OBRA.
  //
  // Comprobado a resolucion completa sobre `gallery-…-07`: plantas clonadas con la
  // misma malla repetida, tiras LED emisivas perfectamente uniformes, pared de fondo
  // sin textura, atrezo de libreria 3D (el mismo cuenco de frutos secos en varias) y
  // cero imperfeccion optica de lente real. No hay UNA sola foto de obra en la carpeta.
  //
  // POR ESO LOS PIES DESCRIBEN LA IMAGEN Y NUNCA AFIRMAN QUE SEA OBRA NUESTRA. Ni
  // «instalada en», ni ciudad, ni «un proyecto de». La cabecera de galeria que trae el
  // cliente ya es prudente por casualidad —dice «Explore solar-ready roof structures»,
  // no «projects»— asi que no hay que tocarla; en `cabanas`, que si dice «projects»,
  // hubo que hacerlo.
  //
  // La regla es la que este repo ya escribio en scripts/lib/cta-slots.mjs: generar con
  // IA se reserva a lo NO probatorio, nunca a algo que el visitante vaya a leer como
  // «una obra que hicimos». LO QUE ESTO NECESITA ES FOTOGRAFIA REAL DEL CLIENTE, y
  // hasta que llegue la ficha se sostiene con el texto, que si esta documentado.
  // ══════════════════════════════════════════════════════════════════════════════
  'solar-pergolas': {
    cms: '/cms-img/products/solar-pergolas',
    galeria: { prefijo: 'gallery-solar-roof-structure-contractors-south-florida-', diapositivas: 10 },

    // «Shade That Pays Back» promete un retorno sin un solo numero, y la propia
    // pregunta `pergola-solar-cuanto-produce` dice que un array de tamaño pergola es
    // «un complemento util —bomba de piscina, iluminacion, recarga de coche— y no un
    // sistema para toda la casa». Se sustituye por lo que si se sostiene.
    chips: [
      { viejo: 'Shade That Pays Back', nuevo: 'Shade That Also Generates', destino: '#how-it-works' },
      { viejo: 'Concealed Wiring', nuevo: 'Concealed Wiring', destino: '#features' },
      { viejo: 'Eco-Friendly Luxury', nuevo: 'Engineered For The Extra Load', destino: '#specs' },
    ],

    alts: [
      { contexto: 'el alt del hero',
        viejo: 'alt="Solar roof structure contractors in South Florida designing engineered aluminum structures ready for solar panel integration and shaded outdoor living." loading="lazy" src="{CMS}/hero-solar-roof-structure-south-florida.avif"',
        nuevo: 'alt="Design visualisation of a solar pergola: photovoltaic panels forming the roof of a slim aluminum frame over a garden terrace." loading="lazy" src="{CMS}/hero-solar-roof-structure-south-florida.avif"' },
      { contexto: 'el alt de la portada del FAQ',
        viejo: '<img src="{CMS}/cover-solar-roof-structure-contractors-south-florida.avif" alt="Solar roof structure contractors in South Florida designing engineered aluminum structures ready for solar panel integration and shaded outdoor living."',
        nuevo: '<img src="{CMS}/cover-solar-roof-structure-contractors-south-florida.avif" alt="Design visualisation of a solar pergola seen from below, the panel roof carried on a slender frame over a lounge."' },
      { contexto: 'el alt de la intro',
        viejo: 'alt="Solar roof structure contractors in South Florida designing engineered aluminum structures ready for solar panel integration and shaded outdoor living." loading="lazy" src="{CMS}/intro-solar-roof-structure-contractors-south-florida.avif"',
        nuevo: 'alt="Design visualisation: a solar panel roof on an aluminum frame shading a terrace, with the array angled to the sun." loading="lazy" src="{CMS}/intro-solar-roof-structure-contractors-south-florida.avif"' },
      { contexto: 'el alt del falso «swatch»',
        viejo: '<img src="{CMS}/swatch-solar-pergola-south-florida.avif" loading="lazy" alt=""',
        nuevo: '<img src="{CMS}/swatch-solar-pergola-south-florida.avif" loading="lazy" alt="Design visualisation of a solar pergola over a paved lounge area, the panels forming a continuous roof plane."' },
    ],

    configuraciones: {
      foto: '04',
      alt: 'Design visualisation: a solar pergola over a lounge terrace at dusk, the underside lit by integrated strip lighting.',
      rotulo: 'Configurations',
      titulo: 'Start With The Consumption, Not The Roof',
      texto: 'A solar pergola is two projects in one, and they are usually planned in the wrong order. The array scales with roof area and orientation, so the useful conversation starts with what you actually consume — the pool pump, the lighting, the car — and works back to the size of the structure. Where it lands and how the panels are mounted follow from that, not the other way round.',
      bullets: ['Sized From What You Consume', 'Oriented For The Array',
        'Attached Or Freestanding', 'Sealed Panels Or Open Rails'],
      boton: { destino: '#compare', texto: 'See How It Compares' },
    },

    comoFunciona: {
      foto: '07',
      alt: 'Design visualisation of a solar pergola after dark, the panel roof over a lit lounge with planting around it.',
      rotulo: 'How It Works',
      titulo: 'What A Solar Pergola Realistically Does',
      texto: 'A solar roof is a structure and an electrical installation at the same time, and the four things worth knowing are the ones that decide whether it does what you hoped: how much it produces, whether it stays dry underneath, what it adds to the structure, and what extra approvals it needs.',
      celdas: [
        ['/images/pp-icon-produccion.svg', 'How Much It Realistically Produces',
          'It scales with roof area and orientation, not with ambition. A pergola-sized array is typically a useful supplement — pool pump, lighting, topping up a car — rather than a whole-house system. That is not a small thing, but it is a different thing, and the design conversation should start with your consumption rather than with the roof.'],
        ['/images/pp-icon-agua.svg', 'Whether It Is Dry Underneath',
          'Shaded, always: the panels are opaque. Dry depends entirely on how they are mounted. Panels laid with sealed joints and a gutter behave like a solid roof; panels on rails with gaps between them do not. If you want a dry lounge under there, it has to be specified up front, not assumed.'],
        ['/images/pp-icon-panel.svg', 'What It Adds To The Structure',
          'Dead load from the array and uplift on every panel, both of which the frame has to be engineered for from the start. This is why a solar pergola is not an ordinary pergola with panels added afterwards, and why retrofitting an array onto a structure that was not drawn for one is usually the expensive answer.'],
        ['/images/pp-icon-permiso.svg', 'The Approvals It Also Needs',
          'On top of the structural and electrical permits, a grid-tied array needs an interconnection agreement with your utility and, in many jurisdictions, a separate solar review. It is not difficult, but it is a second track running alongside the build, and knowing that up front is what keeps the timeline honest.'],
      ],
      botones: [
        { destino: '#specs', clase: 'secundary', texto: 'See The Specifications' },
        { destino: '#faq', clase: 'tertiary', texto: 'See The Questions' },
      ],
    },

    // Los pies DESCRIBEN LA IMAGEN. Ninguno dice donde esta ni de quien es, porque
    // ninguna de estas imagenes es una obra: son visualizaciones. Ver la cabecera.
    pies: {
      '01': ['Visualisation: the array as the roof plane',
        'Design visualisation of a solar pergola in which the photovoltaic panels form the entire roof plane over a garden terrace.'],
      '03': ['Visualisation: panels angled towards the sun',
        'Design visualisation showing a solar pergola with the panel roof tilted towards the sun above a paved seating area.'],
      '05': ['Visualisation: seen from below, panels and frame',
        'Design visualisation looking up at the underside of a solar pergola, the panels carried on a slim aluminum frame.'],
      '06': ['Visualisation: the structure lit after dark',
        'Design visualisation of a solar pergola at night, integrated strip lighting along the beams over a lounge setting.'],
      '09': ['Visualisation: a solar canopy over parking',
        'Design visualisation of a solar canopy over a parking area, the panel roof spanning two bays with cars beneath.'],
      '10': ['Visualisation: array, terrace and planting',
        'Design visualisation of a solar pergola over a terrace, with the panel roof above and tropical planting around the posts.'],
    },

    faqNumeradas: [
      'Can a pergola hold solar panels?',
      'Is the frame strong enough?',
      'Is the lounge area waterproof?',
      'Do you orient it for max sun?',
      'Do you handle all the permits?',
    ],

    video: 'What A Solar Roof Involves',

    ctaEntradilla: 'Meet with our exterior designers for a free consultation. We&#x27;ll start with what you actually consume, work back to the roof area that would cover it, and tell you what the structure has to do.',

    comparar: {
      productos: ['louvered', 'insulated', 'polycarbonate', 'open'],
      rotulo: 'Other Roofs',
      titulo: 'Compare The Four Pergola Roofs',
      texto: 'A solar roof shades the space and generates while it does it. If you want a roof that opens, one that never moves, one that lets the light through, or an open frame, these are the other four we build.',
    },
  },

  // ══════════════════════════════════════════════════════════════════════════════
  // Cabañas
  //
  // ⚠️ CASI TODAS LAS IMAGENES DE ESTE PRODUCTO SON GENERADAS, NO FOTOGRAFIA DE OBRA.
  //
  // Hoja de contactos de las catorce: doce tienen los tells de una generacion —luz
  // dorada imposible repetida, fondos de «casa de lujo generica» intercambiables,
  // cortinas con caida fisicamente rara, plantacion tropical clonada— y solo dos leen
  // como fotografia real, entre ellas la misma obra que sale en la portada de la ficha
  // de cubierta maciza (la pergola exenta con el sillon colgante).
  //
  // Su cabecera de galeria SI afirma autoria —«Explore luxury aluminum cabana
  // PROJECTS»— sobre imagenes que no son obra, asi que se cambia. Es la misma clase de
  // decision que los chips: documentada y REVERTIBLE en cuanto lleguen fotos reales.
  // ══════════════════════════════════════════════════════════════════════════════
  cabanas: {
    cms: '/cms-img/products/cabanas',
    galeria: { prefijo: 'gallery-aluminum-cabana-contractors-south-florida-', diapositivas: 10 },

    // «Hurricane-Resistant» y «100% Rust-Proof» son una homologacion y un absoluto, los
    // dos sin cifra. El primero es el mismo caso que el «Category 5 Reinforced» del
    // Sukkha; el segundo se sustituye por lo que dice la propia respuesta 4 de la ficha.
    chips: [
      { viejo: 'Resort-Style Luxury', nuevo: 'Resort-Style Luxury', destino: '#features' },
      { viejo: 'Hurricane-Resistant', nuevo: 'Engineered to Florida Wind Code', destino: '#specs' },
      { viejo: '100% Rust-Proof', nuevo: 'Aluminum: It Will Not Rust', destino: '#how-it-works' },
    ],

    textos: [
      { contexto: 'la entradilla de la galeria, que decia «projects»',
        viejo: 'Explore luxury aluminum cabana projects that transform backyards into private resort-style retreats. See how structure, shade, and design come together seamlessly.',
        nuevo: 'Design visualisations of the cabanas we build: how the structure, the roof, the screens and the drapery come together. Photographs of completed cabanas are on our project gallery.' },
    ],

    alts: [
      { contexto: 'el alt del hero',
        viejo: 'alt="Aluminum cabana contractors in South Florida building luxury backyard cabanas engineered for shade, privacy, and resort-style outdoor living." loading="lazy" src="{CMS}/hero-custom-poolside-cabana-south-florida.avif"',
        nuevo: 'alt="Design visualisation of a poolside aluminum cabana with a solid roof, drawn curtains at the corners and a lounge set beneath." loading="lazy" src="{CMS}/hero-custom-poolside-cabana-south-florida.avif"' },
      { contexto: 'el alt de la portada del FAQ',
        viejo: '<img src="{CMS}/cover-aluminum-cabana-contractors-south-florida.avif" alt="Aluminum cabana contractors in South Florida building luxury backyard cabanas engineered for shade, privacy, and resort-style outdoor living."',
        nuevo: '<img src="{CMS}/cover-aluminum-cabana-contractors-south-florida.avif" alt="Design visualisation of an aluminum cabana with a slatted back wall and white curtains, set on a terrace beside a pool."' },
      { contexto: 'el alt de la intro',
        viejo: 'alt="Aluminum cabana contractors in South Florida building luxury backyard cabanas engineered for shade, privacy, and high-end outdoor living." loading="lazy" src="{CMS}/intro-aluminum-cabana-contractors-south-florida.avif"',
        nuevo: 'alt="Design visualisation of a freestanding aluminum cabana with a finished ceiling and recessed lighting, open on all four sides." loading="lazy" src="{CMS}/intro-aluminum-cabana-contractors-south-florida.avif"' },
      { contexto: 'el alt del falso «swatch»',
        viejo: '<img src="{CMS}/swatch-custom-pergola-cabana-south-florida.avif" loading="lazy" alt=""',
        nuevo: '<img src="{CMS}/swatch-custom-pergola-cabana-south-florida.avif" loading="lazy" alt="Design visualisation of an aluminum cabana with a wood-look ceiling, lit from within at dusk beside a pool."' },
    ],

    configuraciones: {
      foto: '10',
      alt: 'Design visualisation of a freestanding aluminum cabana beside a pool, with a slatted privacy wall on one side and a lounge beneath.',
      rotulo: 'Configurations',
      titulo: 'It Is Priced Like A Small Building',
      texto: 'A cabana is not a shade cover with walls. It carries a solid roof, usually some form of wall or screen, and almost always power — which is why it costs more than an open pergola of the same footprint and why the decisions that matter are the ones a pergola never has to make: how enclosed, how serviced, and whether water goes into it.',
      bullets: ['Solid Or Insulated Roof', 'Screens, Panels Or Drapery',
        'Power, Lighting And Fans', 'Plumbed, If You Want It Plumbed'],
      boton: { destino: '#compare', texto: 'See How It Compares' },
    },

    comoFunciona: {
      foto: '06',
      alt: 'Design visualisation of an aluminum cabana with a finished ceiling and recessed downlights over a poolside lounge.',
      rotulo: 'How It Works',
      titulo: 'The Four Decisions A Cabana Makes That A Pergola Does Not',
      texto: 'Everything else on this site is a roof. A cabana is closer to a small building, and that changes four things: what it costs and why, how you close it, whether it is plumbed, and what you keep in it.',
      celdas: [
        ['/images/pp-icon-panel.svg', 'Why It Costs More Than A Pergola',
          'It is priced like a small building rather than like a shade cover: solid roof, often walls or screens, and usually power. Expect it above a comparable open pergola of the same footprint. Size, roof type and whether it is plumbed move the number more than the finish does.'],
        ['/images/pp-icon-privacidad.svg', 'How You Close It',
          'Motorised screens, fixed decorative panels, partial walls or outdoor-grade drapery — usually a combination, and usually not on all four sides. Which side gets which is decided by where the sun and the neighbours are, the same conversation as on a screen, only here it also changes how the structure reads.'],
        ['/images/pp-icon-agua.svg', 'Whether It Is Plumbed',
          'A shower or a bathroom is a common request next to a pool and it changes the project: plumbing permits, a drainage connection, and ventilation requirements for a bathroom. Running supply and waste before the surrounding hardscape goes down is far cheaper than opening it up afterwards — so this is a decision for now, not later.'],
        ['/images/pp-icon-carcasa.svg', 'What You Keep In It',
          'A cabana can double as pool equipment storage and it is a good use of the volume, but keep that side separate and ventilated: pool chemicals and salt systems corrode metal and electronics in an enclosed space. A louvered or screened door on that bay handles it without giving up the look.'],
      ],
      botones: [
        { destino: '#specs', clase: 'secundary', texto: 'See The Specifications' },
        { destino: '#faq', clase: 'tertiary', texto: 'See The Questions' },
      ],
    },

    // Pies que DESCRIBEN la imagen. Ninguno afirma que sea obra construida.
    pies: {
      '01': ['Visualisation: open on four sides, curtains at the corners',
        'Design visualisation of an aluminum cabana open on all four sides, with drapery gathered at the corner posts beside a pool.'],
      '02': ['Visualisation: slatted back wall, lounge beneath',
        'Design visualisation of a cabana with a slatted timber-look back wall and a lounge set beneath a solid roof.'],
      '03': ['Visualisation: decorative panel and fire table',
        'Design visualisation of a cabana with a decorative cut panel to one side, a fire table and seating under a wood-look ceiling.'],
      '05': ['Visualisation: dining under a finished ceiling',
        'Design visualisation of a cabana over an outdoor dining table, with a finished ceiling and recessed downlights.'],
      '07': ['Visualisation: waterfront, curtains drawn back',
        'Design visualisation of a cabana on a waterfront terrace, curtains drawn back at the posts and a lounge facing the water.'],
      '08': ['Visualisation: louvered roof over the lounge',
        'Design visualisation of a cabana with a louvered roof section over a lounge, planting massed around the base.'],
    },

    faqNumeradas: [
      'Are aluminum cabanas permanent?',
      'Can I add motorized screens?',
      'Are they hurricane-resistant?',
      'What maintenance is required?',
      'Can I add LED lights and fans?',
    ],

    video: null,

    ctaEntradilla: 'Meet with our exterior designers for a free consultation. We&#x27;ll look at the space, work out how enclosed and how serviced you actually want it, and price it before anything is drawn.',

    comparar: {
      productos: ['louvered', 'insulated', 'screen', 'enclosure'],
      rotulo: 'Other Structures',
      titulo: 'Other Structures We Build',
      texto: 'A cabana is a small building. If what you want is a roof over a space you already have, a side that closes, or the whole area screened, these are the other four we build.',
    },
  },
};

/** La ruta de una foto de galeria de esa ficha. */
export const foto = (ficha, n) => `${ficha.cms}/${ficha.galeria.prefijo}${n}.avif`;

/** Las fichas que llevan el rediseño. La gemela en TypeScript es ESPECIFICACIONES. */
export const FICHAS_RECOMPUESTAS = new Set(Object.keys(FICHAS));
