/**
 * Las fichas de producto en español.
 *
 * Mismo patrón que `servicios.es.ts`: aquí solo va lo propio de cada producto —unas
 * 34 cadenas de las 84 que tiene la página—, y lo compartido (la paleta de acabados,
 * el bloque de servicios, los teasers del blog, el proceso, las tarjetas de proyecto)
 * vive en `comun.es.ts`.
 *
 * Los nombres de sistema y de marca NO se traducen: FORTE, ECLIPSE, Sukkha 3000, NOA,
 * FPA. Sí se traducen los nombres de color, porque son etiquetas descriptivas de una
 * carta para que el cliente elija, no referencias de pedido.
 *
 * Añadir un producto traducido es una entrada aquí + su ruta en `TRADUCIDAS`
 * (src/i18n/rutas.mjs). Lo que no esté no existe en /es/.
 */

export interface ProductoEs {
  /** Nombre corto, para las migas y el JSON-LD. */
  nombre: string;
  title: string;
  description: string;
  dic: Record<string, string>;
}

export const PRODUCTOS_ES: Record<string, ProductoEs> = {
  'motorized-louvered-pergolas': {
    nombre: 'Pérgolas de lamas motorizadas',
    title: 'Pérgolas de lamas motorizadas | Sur de Florida',
    // La descripcion española afirmaba «certificación NOA» y la INGLESA de la misma
    // pagina no afirma ninguna certificacion. Medido con grep sobre el build: en toda
    // la ficha no hay ni una cifra de mph, ni de psf, ni un numero de aprobacion. Con
    // la seccion de especificaciones declarando «numero de NOA: pendiente», esa
    // afirmacion quedaba contradicha en la propia pagina — y en el snippet de Google,
    // que es lo primero que se lee. Se sustituye por lo que si se sostiene, y esto
    // VUELVE ATRAS el dia que el cliente aporte el numero. 137 caracteres, en rango y
    // unica entre las diez.
    description: 'Lamas de aluminio orientables con sensor de lluvia y viento, integración domótica y cálculo para las cargas de viento del sur de Florida.',
    dic: {
      // El alt del fondo del CTA propio de esta ficha (scripts/lib/cta-slots.mjs).
      // SIN esta entrada el <img> se queda en ingles en /es/ y no lo dice NADIE:
      // traducibles.mjs solo extrae nodos de texto y comprobar-i18n.mjs no mira
      // atributos, asi que la cobertura seguiria en verde con el alt sin traducir.
      'Freestanding motorized louvered pergola with a dark bronze aluminum frame and sand-coloured louvers angled part-open, seen from below against the sky over a lounge terrace, with a clipped hedge and a tile-roof house behind.':
        'Pérgola de lamas motorizadas exenta, con estructura de aluminio bronce oscuro y lamas color arena entreabiertas, vista desde abajo contra el cielo sobre una terraza de estar, con un seto recortado y una casa de teja detrás.',
      // LOS ALT DE LAS FOTOS. Hasta el rediseño, el hero y la portada del FAQ
      // compartian LITERALMENTE la misma cadena, la de la intro era prosa de producto
      // que no describia su fotografia, y las diez de galeria llevaban alt="". Ahora
      // cada foto describe lo que se ve en ella.
      //
      // SIN ESTAS ENTRADAS EL ALT SE QUEDA EN INGLES EN /es/ Y NO LO DICE NADIE:
      // comprobar-i18n.mjs cuenta nodos de texto, no atributos, y comprobar-seo.mjs
      // solo exige que el atributo exista. La cobertura seguiria en verde.
      'Freestanding motorized louvered pergola with a graphite aluminum frame, louvers half open over a paver-and-turf terrace with lounge seating and a fire table.':
        'Pérgola de lamas motorizadas exenta, con estructura de aluminio grafito y las lamas entreabiertas sobre una terraza de losas con juntas de césped, con sillones y mesa de fuego.',
      'White louvered pergola attached to a yellow stucco home, louvers closed flat over a poolside dining and lounge terrace.':
        'Pérgola de lamas blanca adosada a una casa de estuco amarillo, con las lamas cerradas en plano sobre una terraza de comedor y estar junto a la piscina.',
      'Freestanding louvered pergola shading a lounge set beside a pool, louvers closed flat, with a clipped hedge and potted plants around the deck.':
        'Pérgola de lamas exenta dando sombra a un salón exterior junto a la piscina, con las lamas cerradas en plano, un seto recortado y macetas alrededor de la terraza.',
      'Freestanding louvered pergola with a dark bronze fascia and white aluminum louvers, open over a lounge set on a paver terrace against a clipped ficus hedge.':
        'Pérgola de lamas exenta, con fascia bronce oscuro y lamas de aluminio blancas abiertas, sobre un salón exterior en una terraza de losas junto a un seto de ficus recortado.',
      'Close-up from below of the louver drive: a white rack-and-pinion gear on the dark gutter beam that rotates the aluminum blades.':
        'Primer plano desde abajo del accionamiento de las lamas: el piñón y la cremallera blancos sobre la viga-canalón oscura que hacen girar las lamas de aluminio.',
      'White aluminum louvered roof attached to a two-storey white stucco home, louvers angled to throw striped shade over a covered dining terrace.':
        'Techo de lamas de aluminio blanco adosado a una casa de estuco blanco de dos plantas, con las lamas inclinadas proyectando sombra rayada sobre un comedor exterior cubierto.',
      'Bronze louvered pergola attached to a tile-roof home, louvers open over a travertine pool deck, with the gutter downspout running down inside the post.':
        'Pérgola de lamas bronce adosada a una casa con tejado de teja, con las lamas abiertas sobre una terraza de travertino junto a la piscina y la bajante del canalón por dentro del poste.',
      'Louvered roof section built alongside an existing solid patio cover, louvers fully open to the sky over a brick paver dining patio.':
        'Tramo de techo de lamas construido junto a una cubierta sólida existente, con las lamas completamente abiertas al cielo sobre un patio de adoquín con comedor.',
      'Freestanding louvered pergola on a deck at the pool edge, white louvers open, framed by a ficus hedge and palms.':
        'Pérgola de lamas exenta sobre tarima al borde de la piscina, con las lamas blancas abiertas, entre un seto de ficus y palmeras.',
      'White louvered pergola attached to a yellow stucco home, shading an outdoor dining and grill area beside the pool.':
        'Pérgola de lamas blanca adosada a una casa de estuco amarillo, dando sombra a la zona de comedor y parrilla junto a la piscina.',
      'White louvered pergola turning the corner of a home, louvers open to the sky, with an electrical fixture and its cabling mounted on the beam.':
        'Pérgola de lamas blanca doblando la esquina de la casa, con las lamas abiertas al cielo y un herraje eléctrico con su cableado montado sobre la viga.',
      'Rain sensor and wind vane bolted to the gutter beam of a white louvered pergola — the hardware that closes the roof on its own.':
        'Sensor de lluvia y anemómetro atornillados a la viga-canalón de una pérgola de lamas blanca: el herraje que cierra el techo solo.',
      'Motorized Louvered Pergolas': 'Pérgolas de lamas motorizadas',
      'Sun or Shade on Demand': 'Sol o sombra cuando quiera',
      'Smart Home Integrated': 'Integrada con la domótica',
      // El chip decia «NOA &amp; FPA Certified». Se suavizo a lo que si se puede
      // sostener —que la estructura se CALCULA para la normativa de viento, que es
      // proceso y no resultado— porque el sitio no puede dar el numero de aprobacion.
      // REVERTIBLE: en cuanto el cliente lo aporte, vuelve el texto de antes y el
      // numero entra como una fila mas de la seccion de especificaciones.
      'Engineered to Florida Wind Code': 'Calculada para el viento de Florida',
      'Louvered Roof Pergola Contractors in South Florida': 'Especialistas en pérgolas de techo de lamas en el sur de Florida',
      'Pergola Plus designs and installs premium louvered roof pergolas across Miami-Dade, Broward, and Palm Beach County. Our custom aluminum systems feature motorized louvers that provide precise control over sunlight, ventilation, and rain protection—engineered specifically for the South Florida climate. We serve cities including Boca Raton, Fort Lauderdale, Weston, Delray Beach, and Palm Beach Gardens, delivering durable, architecturally refined outdoor living solutions.':
        'Pergola Plus diseña e instala pérgolas de techo de lamas de gama alta en Miami-Dade, Broward y Palm Beach. Nuestros sistemas de aluminio a medida llevan lamas motorizadas que dan control preciso sobre el sol, la ventilación y la lluvia, calculados para el clima del sur de Florida. Trabajamos en Boca Ratón, Fort Lauderdale, Weston, Delray Beach y Palm Beach Gardens, entre otras, con soluciones duraderas y de buen diseño.',
      'Smart Motorized Louvered Pergola Features': 'Qué trae una pérgola de lamas motorizada',
      'Take absolute control of your outdoor environment with smart, adaptive shade. Discover the innovative technology, weather resistance, and automated features that set our bioclimatic pergolas apart.':
        'Tome el control total de su exterior con una sombra que se adapta. Estas son la tecnología, la resistencia y la automatización que distinguen a nuestras pérgolas bioclimáticas.',
      'Seamless Smart Home Integration': 'Integración con su domótica',
      'Sync your pergola&#x27;s operations with popular smart home platforms for intuitive voice control and automated scheduling.':
        'Conecte su pérgola con las principales plataformas domóticas para manejarla por voz y programarla sola.',
      'Motorized Adjustable Louvers': 'Lamas motorizadas y orientables',
      'Control sunlight, airflow, and shade with precision at the touch of a button. Our motorized aluminum louvers rotate smoothly to adapt instantly to changing weather conditions, giving you total environmental control without leaving your seat.':
        'Controle el sol, la ventilación y la sombra con precisión, pulsando un botón. Nuestras lamas de aluminio giran con suavidad y se adaptan al momento a cómo cambie el tiempo, sin que usted tenga que levantarse.',
      'Integrated Rain &amp; Wind Sensors': 'Sensores de lluvia y viento',
      'Advanced sensors automatically close the louvers when rain or strong winds are detected, protecting your outdoor furniture and flooring even when you&#x27;re away. Intelligent automation ensures year-round protection in South Florida’s unpredictable climate.':
        'Los sensores cierran las lamas solos en cuanto detectan lluvia o viento fuerte, protegiendo los muebles y el suelo aunque usted no esté en casa. Automatización que da tranquilidad todo el año en un clima tan cambiante como el del sur de Florida.',
      'Integrated LED Lighting &amp; Electrical': 'Iluminación LED y electricidad integradas',
      'Customizable LED strip lighting, dimmable ambiance options, and integrated electrical components transform your pergola into an evening entertainment space, enhancing both functionality and atmosphere.':
        'Tiras LED configurables, luz regulable e instalación eléctrica integrada convierten su pérgola en un sitio donde estar también de noche, ganando en uso y en ambiente.',
      'High-Grade Extruded Aluminum': 'Aluminio extruido de alta calidad',
      'Constructed from premium powder-coated aluminum, our structures resist rust, warping, and deterioration in coastal environments. Built for durability, they maintain their finish and structural integrity for years.':
        'Fabricadas en aluminio con recubrimiento en polvo, nuestras estructuras no se oxidan, no se deforman y no se degradan en ambiente costero. Mantienen el acabado y la solidez durante años.',
      'All-Weather Protection System': 'Protección con cualquier tiempo',
      'When fully closed, the interlocking louvers create a watertight seal with an integrated gutter system that channels water through concealed posts, keeping your outdoor space dry and usable in heavy rain.':
        'Al cerrarse del todo, las lamas encajan entre sí formando un sellado estanco, y un canalón integrado conduce el agua por dentro de los pilares. El exterior se queda seco y utilizable aunque llueva fuerte.',
      'Explore real installations of our motorized louvered roof pergolas across South Florida. See how homeowners transform patios and pool areas with precision shade control, modern design, and all-weather performance.':
        'Vea instalaciones reales de nuestras pérgolas de lamas motorizadas por el sur de Florida, y cómo transforman patios y zonas de piscina con control de sombra, diseño actual y protección con cualquier tiempo.',
      'Choose from modern architectural colors and refined finishes designed to complement luxury homes. From sleek matte tones to realistic wood-inspired textures, every detail is customizable.':
        'Elija entre colores actuales y acabados cuidados, pensados para acompañar a viviendas de lujo. Desde tonos mate hasta texturas que imitan la madera, todo es configurable.',
      'Experience total control over sun, shade, and rain. Watch how our motorized louver systems adjust in seconds, engineered for Florida’s climate and modern outdoor living.':
        'Control total sobre el sol, la sombra y la lluvia. Vea cómo nuestras lamas motorizadas se ajustan en segundos, calculadas para el clima de Florida.',
      'Motorized Louvered Pergolas FAQs': 'Preguntas sobre pérgolas de lamas motorizadas',
      'Questions about smart shade in Miami or Broward? Learn how our louvered pergolas offer custom rain and sun control.':
        '¿Dudas sobre sombra inteligente en Miami o Broward? Así funciona el control de sol y lluvia de nuestras pérgolas de lamas.',
      // Las cinco preguntas de la ficha, SIN el «1. » que traia el markup migrado.
      // No es un cambio de estilo: src/data/faqs.ts documenta que `origen: 'ficha'`
      // significa que el texto TIENE que cuadrar con el bloque de la ficha, y la
      // biblioteca las guarda sin numerar — o sea que la correspondencia estaba rota,
      // en los dos idiomas, y quitar el prefijo la repara. Estas cinco cadenas son
      // ahora identicas, letra por letra, a las de src/i18n/faqs.es.ts.
      'How do louvered pergolas work?': '¿Cómo funciona una pérgola de lamas?',
      'Motorized louvered pergolas use adjustable aluminum roof slats controlled via remote or app, allowing you to instantly adjust shade, sunlight, and patio airflow.':
        'Llevan lamas de aluminio orientables en el techo, que se manejan con mando o desde el móvil. Así ajusta al momento la sombra, la luz y la ventilación del patio.',
      'Are they safe in hurricanes?': '¿Son seguras en un huracán?',
      'Yes. Our smart louvered roof systems are heavily engineered for Miami’s wind-load codes, delivering maximum structural strength and safety during severe storms.':
        'Sí. Nuestros techos de lamas se calculan para la normativa de carga de viento de Miami, con la resistencia estructural que exige una tormenta seria.',
      'Do they have rain sensors?': '¿Llevan sensor de lluvia?',
      'Yes! Equipped with smart weather sensors, the automated roof closes instantly at the first drop of rain, protecting your outdoor furniture and patio year-round.':
        'Sí. Con sensores meteorológicos, el techo se cierra solo a la primera gota, protegiendo los muebles y el patio durante todo el año.',
      'Will the coastal salt rust it?': '¿El salitre la va a oxidar?',
      'Never. We use marine-grade powder-coated extruded aluminum, guaranteeing your motorized pergola remains rust-free and pristine even in harsh oceanfront locations.':
        'No. Usamos aluminio extruido con recubrimiento en polvo de grado marino, así que la pérgola no se oxida ni pierde aspecto ni en primera línea de playa.',
      'How fast is the installation?': '¿Cuánto se tarda en instalarla?',

      // --- Antetitulo de la intro (bloque 2) --------------------------------

      // --- Bloque 4 · «Configuraciones que construimos» ----------------------
      // Los cuatro puntos salen de las fotos, una a una: adosada frente a exenta y
      // las dos familias de acabado. Ni un voladizo en pies, ni un ancho de lama.
      'Two Ways We Mount It, Two Finish Families': 'Dos formas de montarla, dos familias de acabado',
      'Every louvered roof we build is drawn for one house. The two decisions that change the shape of the project are where it lands and how it is finished: attached to the structure of the house, or freestanding over a deck or a pool. From there the frame goes dark bronze or white. Everything after that is engineering for your site.':
        'Cada techo de lamas que construimos se dibuja para una casa concreta. Las dos decisiones que cambian la forma del proyecto son dónde se apoya y cómo se acaba: adosado a la estructura de la casa, o exento sobre un deck o una piscina. A partir de ahí, la estructura va en bronce oscuro o en blanco. Lo demás es cálculo para su parcela.',
      'Attached to the House': 'Adosada a la casa',
      'Freestanding Over Deck or Pool': 'Exenta sobre deck o piscina',
      'Dark Bronze Powder-Coat Finish': 'Acabado en bronce oscuro',
      'White Powder-Coat Finish': 'Acabado en blanco',

      // --- Bloque 5 · «Como funciona: lamas, motor y desague» -----------------
      // Las cuatro celdas salen de cuatro preguntas ya escritas y ya traducidas de
      // src/i18n/faqs.es.ts. El hedge «segun el sistema» del recorrido es obligatorio.
      'What Happens Inside The Roof': 'Qué pasa dentro del techo',
      'A louvered roof is a mechanism, not a finish. Four things decide whether you are still happy with it in ten years: how far the louvers actually turn, what the roof does when the power goes, where the water ends up, and whether the motor can be reached. Here is each one.':
        'Un techo de lamas es un mecanismo, no un acabado. Hay cuatro cosas que deciden si dentro de diez años sigue contento con él: cuánto giran de verdad las lamas, qué hace el techo cuando se va la luz, dónde acaba el agua, y si se puede llegar al motor. Vamos una por una.',
      'Full Rotation, Any Position': 'Giro completo, cualquier posición',
      'The louvers turn through about 140 to 170 degrees depending on the system, which is what takes you from open sky to a closed roof and lets you stop anywhere in between. In practice you use three: closed for rain, part-open for filtered light, open in the evening.':
        'Las lamas giran del orden de 140 a 170 grados según el sistema, que es lo que permite pasar de cielo abierto a techo cerrado y parar en cualquier punto intermedio. En la práctica se usan tres posiciones: cerrada para la lluvia, entreabierta para luz tamizada, y abierta al atardecer.',
      'When The Power Goes Out': 'Si se va la luz',
      'The louvers hold their last position. They do not fall open, and they do not close on their own. Systems can be specified with a manual override or a battery backup so you can still close the roof during an outage — worth having where the outage and the storm arrive together.':
        'Las lamas se quedan en la última posición. Ni se abren solas ni se cierran solas. El sistema puede llevar accionamiento manual de emergencia o batería de respaldo para poder cerrar el techo durante un corte, algo que conviene tener en una zona donde el corte y la tormenta llegan juntos.',
      'Where The Water Goes': 'Por dónde se va el agua',
      'Closed, the louvers interlock and the water runs into an integrated gutter and down inside the posts. Keeping that channel and the post drainage clear is the whole maintenance story: a blocked channel is the most common cause of water where it should not be. Do not pressure wash into the drive.':
        'Cerradas, las lamas encajan entre sí y el agua va a un canalón integrado y baja por dentro de los pilares. Mantener ese canal y el drenaje de los pilares limpios es todo el mantenimiento que hay: un canal atascado es la causa más habitual de que aparezca agua donde no debe. No meta hidrolimpiadora en el accionamiento.',
      'The Motor Is Serviceable': 'El motor se puede sustituir',
      'The motor is a serviceable component, not a sealed part of the structure. It is designed to be reached and swapped without dismantling the roof. How long it lasts depends on cycles and on whether water is getting where it should not — which is why the drainage above matters.':
        'El motor es un componente sustituible, no una pieza sellada de la estructura. Está pensado para llegar a él y cambiarlo sin desmontar el techo. Cuánto dure depende de los ciclos y de si le está entrando agua donde no debe, que es justo por lo que importa el drenaje de arriba.',

      // --- Bloque 6 · los pies de la galeria ---------------------------------
      // Ciudad y fecha NO se inventan: si el cliente no las aporta, el pie las omite.
      // Un pie sin ciudad sigue siendo infinitamente mejor que alt="".
      'Attached, dark bronze frame, louvers open at the edge of the pool':
        'Adosada, marco en bronce oscuro, lamas abiertas al borde de la piscina',
      'Attached to a white soffit, louvers open over a paver patio and outdoor dining area':
        'Adosada a un sofito blanco, lamas abiertas sobre un patio de adoquín con comedor exterior',
      'Freestanding, white louvers, poolside against a clipped hedge':
        'Exenta, lamas blancas, junto a la piscina contra un seto recortado',
      'Attached, white frame, over the patio of a yellow stucco house':
        'Adosada, marco blanco, sobre el patio de una casa de estuco amarillo',
      'Attached, white frame, louvers open, turning the corner of the house':
        'Adosada, marco blanco, lamas abiertas, doblando la esquina de la casa',
      'Rain sensor and wind vane on the gutter beam: the hardware that closes the roof':
        'Sensor de lluvia y anemómetro sobre la viga-canalón: el herraje que cierra el techo',

      // --- Bloque 10 · el titular del video ---------------------------------
      // La cadena vieja («Contractors Proudly Serving South Florida») sigue viva en
      // otras 6 fichas y por eso su clave se queda en comun.es.ts. Aqui solo entra la
      // nueva: en español, la vieja colapsaba con el H2 de las zonas de servicio y
      // dejaba un <h2> duplicado que check:i18n no puede cazar.
      'Watch It Open, Watch It Close': 'Véala abrirse y cerrarse',

      // --- Bloque 13 · la entradilla del proceso ----------------------------
      // La cadena vieja esta en 48 ficheros migrados: su clave se queda en comun.es.ts.

      // --- Bloque 14 · el CTA final, que ahora es unico -----------------------
      // La cadena vieja del parrafo esta en 99 ficheros migrados; el H2 tambien, y por
      // eso NO se toca: lo que se cambia es el boton, para que los dos compartan la
      // palabra «presupuesto», que es lo que pedia el hallazgo de F0.
      'Meet with our exterior designers for a free consultation. We&#x27;ll measure your space, look at how you use it, and plan the louvered roof around both.':
        'Reúnase con nuestros diseñadores de exteriores en una consulta gratuita. Medimos su espacio, vemos cómo lo usa y planificamos el techo de lamas en torno a las dos cosas.',

      // --- Bloque 15 · «Comparar las cubiertas» -----------------------------
      // Las cuatro tarjetas no llevan copy nuevo: ya existen en /products y ya estan
      // traducidas. Lo unico propio de esta ficha es el titular y la entradilla.
      'A louvered roof is the one that moves. If you would rather have a roof that never moves, one that lets the light through, or one that pays for itself, these are the other three we build.':
        'El techo de lamas es el que se mueve. Si prefiere una cubierta que no se mueva nunca, una que deje pasar la luz o una que se pague sola, éstas son las otras tres que construimos.',
      'Once custom fabrication and permitting are complete, our expert installers assemble your smart pergola in just a few days with minimal disruption to your property.':
        'Una vez fabricada a medida y con el permiso concedido, nuestro equipo la monta en unos pocos días y con las mínimas molestias.',
    },
  },

  'solid-roof-pergolas': {
    nombre: 'Pérgolas de techo aislado',
    title: 'Pérgolas de techo aislado | Sur de Florida',
    description: 'Paneles aislantes que cortan el calor radiante, con canalón oculto y preparación para ventiladores y televisión.',
    dic: {
      // ── Los chips del hero ────────────────────────────────────────────────────
      'Insulated Panel, Cooler Underneath':
        'Panel aislante, más fresco debajo',

      // ── Los alt de las cuatro fotos grandes ───────────────────────────────────
      // SIN ESTAS ENTRADAS EL ALT SE QUEDA EN INGLÉS EN /es/ Y NO LO DICE NADIE:
      // comprobar-i18n.mjs cuenta nodos de texto, no atributos, y comprobar-seo.mjs
      // solo exige que el atributo exista. La cobertura seguiría en verde.
      'Attached insulated roof pergola with a dark bronze frame and ceiling fans, shading an outdoor kitchen and dining terrace beside a pool.':
        'Pérgola de cubierta maciza aislada adosada, con estructura de aluminio bronce oscuro y ventiladores de techo, dando sombra a una cocina exterior y una zona de comedor junto a la piscina.',
      'Freestanding insulated roof pergola with a dark bronze frame over a lawn terrace, with a hanging wicker chair and tropical planting around it.':
        'Pérgola de cubierta maciza aislada exenta, con estructura bronce oscuro sobre una terraza en el césped, con un sillón colgante de mimbre y plantación tropical alrededor.',
      'Underside of an insulated roof: a wood-look slatted ceiling with a large fan and recessed downlights, looking out over a lake through a slatted privacy screen.':
        'Cara inferior de una cubierta maciza aislada: techo de listones con textura tipo madera, un ventilador grande y focos empotrados, con vista al lago a través de una celosía.',
      'Attached insulated roof with a warm wood-look soffit and a dark bronze fascia, over an outdoor kitchen on a travertine terrace by the water.':
        'Cubierta maciza aislada adosada, con sofito de textura tipo madera y fascia bronce oscuro, sobre una cocina exterior en una terraza de travertino junto al agua.',

      // ── §4 · Configuraciones ──────────────────────────────────────────────────
      'Two Ways We Mount It, Two Ceilings':
        'Dos formas de montarla, dos techos',
      'Every solid roof we build is drawn for one house. The two decisions that change the project are where it lands and what you see when you look up: attached to the structure of the house, or freestanding over a patio or a lawn. From there the ceiling is either plain from the powder-coat palette or a wood-look texture. Everything after that is engineering for your site.':
        'Cada cubierta maciza que construimos se dibuja para una casa concreta. Las dos decisiones que cambian el proyecto son dónde se apoya y qué se ve al mirar hacia arriba: adosada a la estructura de la casa, o exenta sobre el patio o el césped. A partir de ahí, el techo es liso, de la carta de recubrimiento en polvo, o con textura tipo madera. Todo lo demás es cálculo para su parcela.',
      'Attached to the House':
        'Adosada a la casa',
      'Freestanding Over Patio or Lawn':
        'Exenta sobre patio o césped',
      'Plain Powder-Coat Ceiling':
        'Techo liso con recubrimiento en polvo',
      'Wood-Look Textured Ceiling':
        'Techo con textura tipo madera',

      // ── §5 · Cómo funciona ────────────────────────────────────────────────────
      'What The Roof Is Actually Made Of':
        'De qué está hecha la cubierta, de verdad',
      'A solid roof is not a lid. Four things decide whether you are still happy with it in ten years: what is inside the panel, where the wiring runs, where the rain goes, and what it takes to get it permitted. Here is each one.':
        'Una cubierta maciza no es una tapa. Hay cuatro cosas que deciden si dentro de diez años sigue contento con ella: qué lleva dentro el panel, por dónde va el cableado, por dónde se va el agua y qué hace falta para permisarla. Vamos una por una.',
      'What Is Inside The Panel':
        'Qué lleva dentro el panel',
      'An insulating core bonded between two aluminium skins. That is what makes the panel structural and thermally useful at the same time: it spans without a visible frame underneath, and it keeps the underside cooler than a bare metal roof would. It is also why the ceiling can be a finished surface instead of the back of a sheet.':
        'Un núcleo aislante encolado entre dos chapas de aluminio. Eso es lo que hace el panel estructural y térmicamente útil a la vez: salva la luz sin estructura vista por debajo y mantiene la cara de abajo más fresca de lo que estaría con una cubierta de metal desnudo. Y es también la razón de que el techo pueda ser una superficie acabada y no el reverso de una chapa.',
      'Where The Wiring Runs':
        'Por dónde va el cableado',
      'Inside the panels. The channels are part of the roof, so ceiling fans, recessed lighting and outlets mount into a finished ceiling rather than being surface-run afterwards. This is the difference you notice from below, and it is decided at the drawing stage — not once the roof is up.':
        'Por dentro de los paneles. Los canales son parte de la cubierta, así que los ventiladores de techo, los focos empotrados y los enchufes van montados en un techo acabado en vez de ir por fuera después. Es la diferencia que se nota desde abajo, y se decide en la fase de planos, no con la cubierta ya puesta.',
      'Where The Rain Goes':
        'Por dónde se va el agua',
      'The panels interlock and the roof drains into a gutter built into the beam, so nothing is bolted on afterwards and nothing runs down the face of the structure. Keeping that channel clear is most of the maintenance story: a blocked gutter is the usual reason water turns up where it should not.':
        'Los paneles encajan entre sí y la cubierta desagua por un canalón integrado en la viga, así que no hay nada atornillado por fuera ni agua bajando por la cara de la estructura. Mantener ese canal limpio es casi todo el mantenimiento: un canalón atascado es el motivo habitual de que aparezca agua donde no toca.',
      'It Is A Permitted Structure':
        'Es una estructura con permiso',
      'A solid roof is a permanent load-bearing structure, so it is permitted — that is not a hurdle, it is the point. We do the structural engineering and run the approval, and the roof is sized from the calculation for your address rather than from a catalogue span.':
        'Una cubierta maciza es una estructura permanente que trabaja, así que lleva permiso, y eso no es un obstáculo: es justamente el argumento. Nosotros hacemos el cálculo estructural y tramitamos la aprobación, y la cubierta se dimensiona a partir del cálculo de su dirección y no de una luz de catálogo.',

      // ── Los pies de la galería ────────────────────────────────────────────────
      'Attached, flat white ceiling, three fans over the pool terrace':
        'Adosada, techo blanco liso, tres ventiladores sobre la terraza de la piscina',
      'Freestanding over the lawn, dark bronze frame beside the pool':
        'Exenta sobre el césped, estructura bronce oscuro junto a la piscina',
      'Attached, wood-look soffit and dark fascia, over the outdoor kitchen':
        'Adosada, sofito tipo madera y fascia oscura, sobre la cocina exterior',
      'The same roof from the terrace: bar, grill and the canal behind':
        'La misma cubierta desde la terraza: barra, parrilla y el canal detrás',
      'Freestanding, light ceiling, against a slatted screen wall':
        'Exenta, techo claro, contra una pared de celosía',
      'Attached, with the screen lowered down the open side':
        'Adosada, con la cortina bajada por el lado abierto',

      // ── Los alt de la galería ─────────────────────────────────────────────────
      'Attached insulated patio cover with a flat white ceiling and three ceiling fans, running the length of a travertine pool terrace with a lake behind.':
        'Cubierta maciza aislada adosada, con techo blanco liso y tres ventiladores, recorriendo a lo largo una terraza de travertino junto a la piscina, con un lago detrás.',
      'Freestanding insulated roof pergola with a dark bronze frame on a lawn beside a pool, sheltering a hanging wicker chair and a daybed among tropical planting.':
        'Pérgola de cubierta maciza aislada exenta, con estructura bronce oscuro sobre el césped junto a la piscina, cubriendo un sillón colgante de mimbre y un diván entre plantación tropical.',
      'Attached insulated roof with a warm wood-look soffit and a dark bronze fascia, covering an outdoor kitchen and lounge on a travertine terrace by the water.':
        'Cubierta maciza aislada adosada, con sofito de textura tipo madera y fascia bronce oscuro, cubriendo una cocina exterior y un salón en una terraza de travertino junto al agua.',
      'Wide view of an insulated roof over a waterfront outdoor kitchen, with a bar, stools and travertine paving, and moored boats along the canal behind.':
        'Vista amplia de una cubierta maciza aislada sobre una cocina exterior frente al agua, con barra, taburetes y pavimento de travertino, y barcos amarrados en el canal detrás.',
      'Freestanding insulated roof pergola with a light ceiling and a ceiling fan, over a paved lounge area set against a slatted screen wall on a lawn.':
        'Pérgola de cubierta maciza aislada exenta, con techo claro y ventilador, sobre una zona de estar pavimentada apoyada en una pared de celosía, en el césped.',
      'Attached insulated roof against a stucco house with a motorised screen lowered across the open side, shading a lounge area next to a clipped hedge.':
        'Cubierta maciza aislada adosada a una casa de estuco, con una cortina motorizada bajada por el lado abierto, dando sombra a una zona de estar junto a un seto recortado.',
      'Insulated roof attached to a house over an outdoor kitchen and dining table, with dark slatted privacy screens on two sides and a wood-look ceiling.':
        'Cubierta maciza aislada adosada a la casa sobre una cocina exterior y una mesa de comedor, con celosías oscuras de privacidad en dos lados y techo con textura tipo madera.',
      'Freestanding insulated roof pergola with a dark bronze frame and a plain light ceiling, over a paved terrace with lounge seating on a lawn.':
        'Pérgola de cubierta maciza aislada exenta, con estructura bronce oscuro y techo claro liso, sobre una terraza pavimentada con sillones, en el césped.',

      // ── El vídeo, el CTA y el bloque comparativo ───────────────────────────────
      'See It From Underneath':
        'Véala desde abajo',
      'Meet with our exterior designers for a free consultation. We&#x27;ll measure your space, look at how you use it, and plan the roof and its ceiling around both.':
        'Reúnase con nuestros diseñadores de exteriores en una consulta gratuita. Medimos su espacio, vemos cómo lo usa y planificamos la cubierta y su techo a partir de las dos cosas.',
      'A solid roof is the one that never moves. If you would rather have a roof that opens, one that lets the light through, or one that pays for itself, these are the other three we build.':
        'La cubierta maciza es la que no se mueve nunca. Si prefiere un techo que se abra, uno que deje pasar la luz o uno que se pague solo, estos son los otros tres que construimos.',

      // ── Las cinco preguntas del FAQ, ya sin numerar ───────────────────────────
      'Does the solid roof block heat?':
        '¿La cubierta maciza corta el calor?',
      'Are they fully waterproof?':
        '¿Son totalmente estancas?',
      'Can I add a ceiling fan or TV?':
        '¿Puedo poner un ventilador de techo o una tele?',
      'What maintenance is needed?':
        '¿Qué mantenimiento necesita?',
      'Are they permitted in Broward?':
        '¿Llevan permiso en Broward?',

      // El alt del fondo del CTA propio de esta ficha (scripts/lib/cta-slots.mjs).
      // SIN esta entrada el <img> se queda en ingles en /es/ y no lo dice NADIE:
      // traducibles.mjs solo extrae nodos de texto y comprobar-i18n.mjs no mira
      // atributos, asi que la cobertura seguiria en verde con el alt sin traducir.
      'Solid insulated roof pergola with a warm wood-grain soffit and recessed lighting over a waterfront outdoor kitchen in Jupiter, Florida.':
        'Pérgola de techo macizo aislado, con cara inferior en veta de madera y focos empotrados, sobre una cocina exterior frente al agua en Jupiter, Florida.',
      // El alt de la portada del CMS: hasta ahora esa imagen no salia en ninguna
      // pagina, y desde el FAQ a dos columnas la lee el lector de pantalla.
      'Insulated roof pergola builders in South Florida designing custom aluminum patio covers engineered for heat reduction and all-weather protection.':
        'Constructores de pérgolas de techo aislado en el sur de Florida diseñando cubiertas de patio de aluminio a medida, pensadas para bajar el calor y proteger con cualquier tiempo.',
      'Solid Roof Pergolas': 'Pérgolas de techo sólido',
      'Cools Patio Drastically': 'Baja mucho la temperatura del patio',
      'Ready for Fans &amp; TVs': 'Preparada para ventiladores y TV',
      'Hidden Gutter System': 'Canalón oculto',
      'Insulated Roof Pergola Contractors in South Florida': 'Especialistas en pérgolas de techo aislado en el sur de Florida',
      'Pergola Plus builds high-performance insulated roof pergolas throughout South Florida. Designed to significantly reduce heat transfer while providing full shade and weather protection, these systems create cooler, more comfortable outdoor environments. We serve Coral Springs, Davie, Wellington, Jupiter, and surrounding areas with fully engineered, custom-built structures made for long-term durability.':
        'Pergola Plus construye pérgolas de techo aislado de alto rendimiento por todo el sur de Florida. Reducen mucho la transmisión de calor y dan sombra total y protección frente al tiempo, para un exterior más fresco y cómodo. Trabajamos en Coral Springs, Davie, Wellington, Jupiter y alrededores, con estructuras calculadas y hechas a medida para durar.',
      'Insulated Solid Roof Pergola Features': 'Qué trae una pérgola de techo aislado',
      'Experience total coverage and unmatched thermal comfort for year-round usability. Learn how our insulated roof systems transform any patio into a protected, sophisticated extension of your indoor living space.':
        'Cobertura total y un confort térmico que se nota, para usar el patio todo el año. Así convierten nuestros techos aislados cualquier patio en una prolongación protegida de la casa.',
      'Thermal Insulated Roofing Panels': 'Paneles de techo con aislamiento térmico',
      'High-density insulated panels significantly minimize radiant heat, creating a noticeably cooler outdoor area even during peak South Florida summer temperatures.':
        'Los paneles aislantes de alta densidad cortan el calor radiante, así que la zona se nota más fresca incluso en lo más duro del verano en el sur de Florida.',
      'Solid All-Season Coverage': 'Cobertura total todo el año',
      'Unlike adjustable systems, insulated roofs provide continuous full coverage, ideal for homeowners seeking maximum protection and structural permanence.':
        'A diferencia de los sistemas orientables, el techo aislado cubre siempre y del todo. Es lo ideal si busca la máxima protección y una estructura permanente.',
      'Skylight Integration Capabilities': 'Posibilidad de integrar claraboyas',
      'Incorporate specialized weather-tight skylights into the solid roof design, balancing total rain protection with strategic pockets of natural sunlight.':
        'Se pueden integrar claraboyas estancas en el techo, para tener protección total frente a la lluvia sin renunciar a entradas de luz natural donde interesa.',
      'Integrated Ceiling Finishes': 'Techo con acabado interior',
      'Finished ceiling panels create a refined architectural look, concealing wiring and structural elements for a seamless aesthetic.':
        'Los paneles de techo acabados dan un aspecto cuidado y esconden el cableado y los elementos estructurales, para que se vea limpio.',
      'High Structural Load Capacity': 'Gran capacidad de carga',
      'Fully engineered and permit-ready, these systems meet strict wind-load requirements, ensuring safety and durability in coastal environments.':
        'Calculadas y listas para tramitar el permiso, cumplen los requisitos estrictos de carga de viento, con la seguridad y la durabilidad que pide la costa.',
      'Custom Lighting &amp; Fan Integration': 'Iluminación y ventiladores integrados',
      'Easily integrate ceiling fans, recessed lighting, and electrical outlets to extend usability and comfort throughout the year.':
        'Se integran sin problema ventiladores de techo, luz empotrada y enchufes, para ganar uso y confort durante todo el año.',
      'View completed insulated roof pergola projects designed for maximum shade and thermal comfort. Discover how permanent coverage creates cooler, more refined outdoor living spaces.':
        'Vea pérgolas de techo aislado ya terminadas, pensadas para dar la máxima sombra y confort térmico, y cómo una cubierta permanente hace el exterior más fresco y cuidado.',
      'Select from a curated palette of contemporary colors and clean finishes that enhance your home’s exterior while maintaining the durability and low maintenance of premium aluminum.':
        'Elija entre una paleta de colores actuales y acabados limpios que acompañan al exterior de su casa, con la durabilidad y el poco mantenimiento del aluminio de gama alta.',
      'See how insulated roof systems create full-time shade and superior heat reduction, delivering a cooler, quieter outdoor space built for year-round comfort.':
        'Vea cómo un techo aislado da sombra permanente y baja mucho el calor, para un exterior más fresco y silencioso, cómodo todo el año.',
      'Solid Roof Pergolas FAQs': 'Preguntas sobre pérgolas de techo sólido',
      'Have questions? Learn how our insulated aluminum solid roof pergolas provide ultimate heat and rain protection in South Florida.':
        '¿Dudas? Así protegen del calor y de la lluvia nuestras pérgolas de techo sólido de aluminio aislado en el sur de Florida.',
      '1. Does the solid roof block heat?': '1. ¿El techo sólido corta el calor?',
      'Yes! Our solid roof pergolas use high-density insulated panels to block 100% of radiant heat, keeping your Miami outdoor living space incredibly cool and comfortable.':
        'Sí. Usan paneles aislantes de alta densidad que bloquean el 100% del calor radiante, así que el exterior se mantiene fresco y cómodo.',
      '2. Are they fully waterproof?': '2. ¿Son totalmente estancas?',
      'Absolutely. The insulated aluminum panels interlock to form a sealed, waterproof roof with built-in gutters, providing total rain protection for outdoor kitchens.':
        'Sí. Los paneles de aluminio aislado encajan entre sí formando un techo sellado y estanco con canalón integrado, con protección total frente a la lluvia — también para una cocina exterior.',
      '3. Can I add a ceiling fan or TV?': '3. ¿Puedo poner un ventilador o una tele?',
      'Yes. The robust insulated roofing system features internal channels to hide wiring, allowing for clean installations of outdoor fans, LED lighting, and AV setups.':
        'Sí. El techo lleva canaletas internas para esconder el cableado, así que ventiladores, luz LED y equipos de audio y vídeo quedan instalados de forma limpia.',
      '4. What maintenance is needed?': '4. ¿Qué mantenimiento necesita?',
      'Virtually none. Constructed from premium powder-coated aluminum, our insulated patio covers will never rust, rot, or fade. Just an occasional rinse keeps them pristine.':
        'Prácticamente ninguno. Al ser de aluminio con recubrimiento en polvo, no se oxidan, no se pudren y no pierden color. Con enjuagarlas de vez en cuando basta.',
      '5. Are they permitted in Broward?': '5. ¿Necesitan permiso en Broward?',
      'Yes. As permanent load-bearing structures, they require permits. We provide full structural engineering and manage the approval process for complete code compliance.':
        'Sí. Al ser estructuras permanentes que soportan carga, requieren permiso. Nosotros aportamos el cálculo estructural completo y gestionamos la aprobación.',
    },
  },

  'open-air-pergolas': {
    nombre: 'Pérgolas abiertas',
    title: 'Pérgolas abiertas de aluminio | Sur de Florida',
    description: 'Pérgolas de aluminio de estructura abierta que definen el patio sin cortar la brisa ni las vistas al cielo, sin mantenimiento.',
    dic: {
      // ── Chips del hero ────────────────────────────────────────────────────────
      'Open To The Breeze':
        'Abierta a la brisa',
      'No Staining, No Rot':
        'Sin barnizar y sin pudrirse',

      // ── Los alt de las cuatro fotos grandes ───────────────────────────────────
      'Open-slat aluminum pergola in dark bronze attached along a white Mediterranean home, its rafters throwing striped shade over the pool terrace.':
        'Pérgola de aluminio de lamas abiertas en bronce oscuro, adosada a lo largo de una casa mediterránea blanca, con sus travesaños proyectando sombra rayada sobre la terraza de la piscina.',
      'Sand-coloured open-slat pergola attached over a terrace with a wall-mounted television, framed by palms against a pink stucco house.':
        'Pérgola de lamas abiertas color arena adosada sobre una terraza con televisión en la pared, enmarcada por palmeras contra una casa de estuco rosa.',
      'White open-slat pergola attached to a brick home over a grill deck, the rafters casting a striped shadow across the lawn beyond.':
        'Pérgola blanca de lamas abiertas adosada a una casa de ladrillo sobre una terraza con parrilla, con los travesaños proyectando una sombra rayada sobre el césped del fondo.',
      'White open-slat pergola over an outdoor kitchen and dining table by a pool, with string lights run between the rafters.':
        'Pérgola blanca de lamas abiertas sobre una cocina exterior y una mesa de comedor junto a la piscina, con guirnaldas de luces tendidas entre los travesaños.',

      // ── §4 ────────────────────────────────────────────────────────────────────
      'Two Ways We Mount It, And What You Add To It':
        'Dos formas de montarla, y qué se le añade',
      'An open-air pergola is a frame, and what you put in the frame is most of the decision. Where it lands comes first — attached to the house, or freestanding out on the deck or the lawn. After that it is the slats themselves, the privacy screen on the side that needs one, and whether the lighting runs inside the beams. Everything else is engineering for your site.':
        'Una pérgola de estructura abierta es un marco, y lo que se pone en ese marco es casi toda la decisión. Primero, dónde se apoya: adosada a la casa o exenta, en la terraza o en el césped. Después vienen las propias lamas, la celosía en el lado que la necesite y si la iluminación va por dentro de las vigas. Todo lo demás es cálculo para su parcela.',
      'Attached to the House':
        'Adosada a la casa',
      'Freestanding Over Deck or Lawn':
        'Exenta sobre terraza o césped',
      'Slatted Privacy Screen':
        'Celosía de privacidad',
      'Lighting Run Inside The Beams':
        'Iluminación por dentro de las vigas',

      // ── §5 ────────────────────────────────────────────────────────────────────
      'What An Open Roof Gives You, And What It Does Not':
        'Lo que le da un techo abierto, y lo que no',
      'An open-air pergola is the one with nothing over you. That is the whole point and it is also the whole trade. Four things decide whether it is the right one: how much shade it actually casts, what happens when it rains, where the lighting goes, and what it is made of.':
        'La pérgola de estructura abierta es la que no tiene nada encima. Ese es todo su sentido y es también todo el intercambio. Hay cuatro cosas que deciden si es la suya: cuánta sombra da de verdad, qué pasa cuando llueve, por dónde va la iluminación y de qué está hecha.',
      'How Much Shade It Actually Casts':
        'Cuánta sombra da de verdad',
      'Less than people expect at midday and more in the morning and the evening, because fixed slats block sun by angle rather than by coverage. Slat depth and spacing set that trade-off, and we size them for the direction your patio faces. If you want reliable shade at two in the afternoon in July, say so now — that is a louvered roof, not this one.':
        'Menos de lo que la gente espera al mediodía y más por la mañana y por la tarde, porque las lamas fijas cortan el sol por ángulo y no por cobertura. El canto y la separación de las lamas fijan ese equilibrio, y los dimensionamos según hacia dónde da su patio. Si lo que quiere es sombra segura a las dos de la tarde en julio, dígalo ahora: eso es un techo de lamas orientables, no este.',
      'What Happens When It Rains':
        'Qué pasa cuando llueve',
      'It sheds nothing. An open slat roof is not a rain roof, and that is the trade you make for the light and the airflow. If you want to keep using the space through a Florida afternoon storm, the answer is a louvered roof that closes, an insulated solid roof, or a retractable. We would rather lose the sale here than have you find out in August.':
        'No para nada de agua. Un techo de lamas abierto no es un techo de lluvia, y ese es el intercambio que hace por la luz y la ventilación. Si quiere seguir usando el espacio durante una tormenta de tarde en Florida, la respuesta es un techo de lamas que se cierre, una cubierta maciza aislada o un toldo retráctil. Preferimos perder la venta aquí a que se entere usted en agosto.',
      'Where The Lighting Goes':
        'Por dónde va la iluminación',
      'Inside the beams. The structural sections take the wiring, so integrated LED runs along the rafters instead of being clipped underneath, and the space works after dark without a single visible cable. It is decided at the drawing stage, because the runs have to be in before the frame goes up.':
        'Por dentro de las vigas. Los perfiles estructurales llevan el cableado, así que el LED integrado corre por los travesaños en vez de ir grapado por debajo, y el espacio funciona de noche sin un solo cable a la vista. Se decide en la fase de planos, porque los tendidos tienen que estar antes de montar la estructura.',
      'It Is A Permitted Structure':
        'Es una estructura con permiso',
      'Extruded, powder-coated aluminium, engineered and permitted for its own address. It does not rot, it does not warp and it never needs staining — which is the real answer to the maintenance question, rather than the word "zero". The post bases and caps are where the architectural detail lives.':
        'Aluminio extruido con recubrimiento en polvo, calculado y permisado para su propia dirección. No se pudre, no se alabea y nunca hay que barnizarlo, que es la respuesta de verdad a la pregunta del mantenimiento, mejor que la palabra «cero». Las bases y los remates de los pilares son donde vive el detalle arquitectónico.',

      // ── Pies de galería ───────────────────────────────────────────────────────
      'A long attached run over the lounge and fire bowl':
        'Un tramo largo adosado sobre el salón y el brasero',
      'Dark bronze, with a slatted screen behind the kitchen':
        'Bronce oscuro, con una celosía detrás de la cocina',
      'Attached to the house, over the trellis and the planters':
        'Adosada a la casa, sobre el enrejado y las macetas',
      'Looking up: rafters, trellis and the tile roof behind':
        'Mirando hacia arriba: travesaños, enrejado y el tejado de teja detrás',
      'Freestanding by the pool, against the bamboo hedge':
        'Exenta junto a la piscina, contra el seto de bambú',
      'White, with privacy screens along the lap pool':
        'Blanca, con celosías a lo largo de la piscina de nado',

      // ── Los alt de la galería ─────────────────────────────────────────────────
      'Long white open-slat pergola attached over a lounge terrace with a fire bowl and a pool table, on patterned tile against a pink stucco house.':
        'Pérgola blanca de lamas abiertas, larga y adosada, sobre una terraza de estar con brasero y mesa de billar, en pavimento con dibujo contra una casa de estuco rosa.',
      'Dark bronze open-slat pergola over an outdoor kitchen, with a slatted privacy screen closing the side against a tall modern house.':
        'Pérgola de lamas abiertas en bronce oscuro sobre una cocina exterior, con una celosía cerrando el lateral contra una casa moderna de gran altura.',
      'Dark wood-look open-slat pergola attached to a white home above French doors, with garden trellis panels and planted pots below.':
        'Pérgola de lamas abiertas con textura tipo madera oscura, adosada a una casa blanca sobre las puertas francesas, con paneles de enrejado y macetas debajo.',
      'Looking up at the rafters of a dark open-slat pergola against a white stucco wall, with trellis panels and hanging glass ornaments.':
        'Vista hacia arriba de los travesaños de una pérgola oscura de lamas abiertas contra una pared de estuco blanco, con paneles de enrejado y adornos de vidrio colgando.',
      'Freestanding dark open-slat pergola sheltering a sofa beside a pool, backed by a tall bamboo hedge.':
        'Pérgola exenta de lamas abiertas en color oscuro cubriendo un sofá junto a la piscina, con un seto alto de bambú detrás.',
      'White open-slat pergola with slatted privacy screens running alongside a lap pool, planters at the base of the posts.':
        'Pérgola blanca de lamas abiertas con celosías de privacidad a lo largo de una piscina de nado, con maceteros al pie de los pilares.',
      'Freestanding white open-slat pergola with a louvered privacy screen on one side, over a fire table on a lawn.':
        'Pérgola blanca exenta de lamas abiertas con una celosía de privacidad en un lado, sobre una mesa de fuego en el césped.',
      'Dark open-slat pergola attached to a grey house over a timber deck, seen from below with the rafters against the sky.':
        'Pérgola oscura de lamas abiertas adosada a una casa gris sobre una terraza de madera, vista desde abajo con los travesaños recortados contra el cielo.',

      // ── Vídeo, CTA y comparativo ──────────────────────────────────────────────
      'Shade Without A Roof':
        'Sombra sin techo',
      'Meet with our exterior designers for a free consultation. We&#x27;ll measure your space, look at which way it faces, and size the slats around the hours you actually use it.':
        'Reúnase con nuestros diseñadores de exteriores en una consulta gratuita. Medimos su espacio, miramos hacia dónde da y dimensionamos las lamas según las horas a las que lo usa de verdad.',
      'An open-air pergola is the one with nothing over you. If you want a roof that closes when it rains, one that never moves, one that lets the light through, or one that pays for itself, these are the other four we build.':
        'La pérgola de estructura abierta es la que no tiene nada encima. Si quiere un techo que se cierre cuando llueve, uno que no se mueva nunca, uno que deje pasar la luz o uno que se pague solo, estos son los otros cuatro que construimos.',

      // ── Las cinco preguntas del FAQ, ya sin numerar ───────────────────────────
      'Why choose an open-air pergola?':
        '¿Por qué elegir una pérgola de estructura abierta?',
      'Are they made of wood or metal?':
        '¿Son de madera o de metal?',
      'Can I add custom LED lighting?':
        '¿Puedo añadir iluminación LED a medida?',
      'Do they boost property value?':
        '¿Revalorizan la vivienda?',
      'Are they built to Florida code?':
        '¿Se construyen según la normativa de Florida?',

      // El alt del fondo del CTA propio de esta ficha (scripts/lib/cta-slots.mjs).
      // SIN esta entrada el <img> se queda en ingles en /es/ y no lo dice NADIE:
      // traducibles.mjs solo extrae nodos de texto y comprobar-i18n.mjs no mira
      // atributos, asi que la cobertura seguiria en verde con el alt sin traducir.
      'Open-air white aluminum pergola with an open rafter grid and visible sky above a paver patio in Parkland, Florida.':
        'Pérgola abierta de aluminio blanco, con retícula de vigas y el cielo a la vista, sobre un patio adoquinado en Parkland, Florida.',
      // El alt de la portada del CMS: hasta ahora esa imagen no salia en ninguna
      // pagina, y desde el FAQ a dos columnas la lee el lector de pantalla.
      'Open-air pergola builders in South Florida creating architectural aluminum pergolas that define outdoor living spaces with modern design.':
        'Constructores de pérgolas abiertas en el sur de Florida creando pérgolas de aluminio que definen el espacio exterior con un diseño actual.',
      'Open-Air Pergolas': 'Pérgolas abiertas',
      'Timeless Elegance': 'Elegancia que no pasa de moda',
      'Maximum Cooling Airflow': 'Máxima ventilación',
      'Zero Maintenance': 'Cero mantenimiento',
      'Open-Air Pergola Contractors in South Florida': 'Especialistas en pérgolas abiertas en el sur de Florida',
      'Pergola Plus designs architectural open-air pergolas throughout South Florida. Crafted from premium aluminum, these custom structures define outdoor spaces while preserving airflow and open views. We serve Parkland, Plantation, Delray Beach, and surrounding communities, delivering durable, design-forward installations that enhance property value.':
        'Pergola Plus diseña pérgolas abiertas con criterio arquitectónico por todo el sur de Florida. Hechas en aluminio de gama alta, definen el espacio exterior sin cortar la ventilación ni las vistas. Trabajamos en Parkland, Plantation, Delray Beach y alrededores, con instalaciones duraderas y de buen diseño que suman valor a la propiedad.',
      'Open-Air Pergola Design Features': 'Qué trae una pérgola abierta',
      'Define your patio with clean architectural lines that preserve the breeze and uninterrupted sky views. Explore the premium materials and customizable details that give our open-air structures their bold, modern presence.':
        'Defina su patio con líneas limpias que dejan pasar la brisa y no tapan el cielo. Estos son los materiales y los detalles configurables que le dan presencia a nuestras estructuras abiertas.',
      'Premium Extruded Aluminum Structure': 'Estructura de aluminio extruido',
      'Built with high-grade powder-coated aluminum, these structures resist corrosion, fading, and structural fatigue — ideal for South Florida’s humid and coastal environments.':
        'Fabricadas en aluminio de alta calidad con recubrimiento en polvo, resisten la corrosión, la decoloración y la fatiga estructural. Justo lo que pide un ambiente húmedo y costero.',
      'Integrated Lighting Options': 'Iluminación integrada, si la quiere',
      'Optional LED lighting can be seamlessly incorporated into beams and rafters, allowing your outdoor space to transition effortlessly from daytime relaxation to evening entertaining.':
        'Se puede integrar iluminación LED en vigas y viguetas, para que el mismo espacio sirva de día para descansar y de noche para recibir.',
      'Freestanding or Attached Installation': 'Exenta o adosada',
      'Whether extending from your home or installed as a freestanding feature, each pergola is engineered for structural integrity and aesthetic cohesion.':
        'Tanto si sale de la casa como si va suelta en el jardín, cada pérgola se calcula para ser sólida y para encajar visualmente.',
      'Decorative Post Base &amp; Cap Options': 'Basas y remates decorativos',
      'Customize the architectural look of your pergola with a selection of decorative post bases and caps, adding a refined finishing touch to the overall design.':
        'Ajuste el aspecto de su pérgola con basas y remates de pilar decorativos, que dan ese acabado que se nota.',
      'Custom Beam &amp; Rafter Configurations': 'Vigas y viguetas a medida',
      'Select from modern minimalist profiles or more robust structural dimensions to complement your home’s architectural style and outdoor layout.':
        'Elija entre perfiles minimalistas o secciones más robustas, según el estilo de su casa y cómo tenga distribuido el exterior.',
      'Architectural Open-Frame Design': 'Estructura abierta con criterio',
      'Create a visually striking outdoor area while preserving airflow and open sky views. Our open-air pergolas define patios and pool decks with clean architectural lines that enhance your home’s exterior design.':
        'Consiga un exterior con carácter sin renunciar a la ventilación ni a las vistas. Nuestras pérgolas abiertas definen patios y bordes de piscina con líneas limpias que suman al conjunto.',
      'Discover open-air pergola designs that define outdoor spaces with architectural elegance. See how clean aluminum structures elevate patios without blocking airflow or views.':
        'Vea diseños de pérgolas abiertas que definen el exterior con elegancia, y cómo una estructura limpia de aluminio eleva un patio sin tapar el aire ni las vistas.',
      'Available in sophisticated powder-coated colors and optional wood-look textures, each open-air pergola is tailored to match your home’s style and landscape.':
        'Disponibles en colores con recubrimiento en polvo y, si quiere, texturas que imitan la madera. Cada pérgola abierta se ajusta al estilo de su casa y de su jardín.',
      'Watch how open-air aluminum pergolas define space with clean architectural lines, preserving airflow and views while elevating your outdoor design.':
        'Vea cómo una pérgola abierta de aluminio define el espacio con líneas limpias, sin cortar el aire ni las vistas.',
      'Open Air Pergolas FAQs': 'Preguntas sobre pérgolas abiertas',
      'Got questions? Learn about the benefits, durability, and custom aluminum pergola designs built for South Florida weather.':
        '¿Dudas? Ventajas, durabilidad y diseños a medida en aluminio, pensados para el tiempo del sur de Florida.',
      '1. Why choose an open-air pergola?': '1. ¿Por qué elegir una pérgola abierta?',
      'Open-air pergolas define your luxury outdoor living area with stunning architectural lines while preserving uninterrupted sky views and natural cooling breezes.':
        'Definen la zona de estar exterior con unas líneas que se ven, y a la vez dejan el cielo despejado y la brisa corriendo.',
      '2. Are they made of wood or metal?': '2. ¿Son de madera o de metal?',
      'We strictly use high-grade extruded aluminum. Unlike wood, our powder-coated metal pergolas will never rot, warp, or require staining in South Florida&#x27;s climate.':
        'Solo usamos aluminio extruido de alta calidad. A diferencia de la madera, no se pudre, no se alabea y no hay que barnizarlo.',
      '3. Can I add custom LED lighting?': '3. ¿Puedo añadir iluminación LED?',
      'Yes. Our structural beams seamlessly hide electrical wiring, allowing for elegant integrated LED lighting to transform your open-air patio into an evening retreat.':
        'Sí. Las vigas esconden el cableado, así que la iluminación LED queda integrada y el patio se puede usar también de noche.',
      '4. Do they boost property value?': '4. ¿Revalorizan la casa?',
      'Definitely. Permanent, high-end aluminum pergolas significantly elevate curb appeal, expand usable living space, and deliver a high ROI for luxury Florida homes.':
        'Sí. Una pérgola de aluminio permanente y bien hecha mejora la imagen de la casa, amplía el espacio útil y suele rendir bien como inversión.',
      '5. Are they built to Florida code?': '5. ¿Cumplen la normativa de Florida?',
      'Yes. Every custom open-air pergola we design is fully engineered, permitted, and professionally installed to meet stringent South Florida hurricane wind-load codes.':
        'Sí. Cada pérgola se calcula, se tramita y se instala para cumplir las exigentes cargas de viento por huracán del sur de Florida.',
    },
  },

  cabanas: {
    nombre: 'Cabañas',
    title: 'Cabañas de aluminio a medida | Sur de Florida',
    description: 'Cabañas de aluminio de inspiración resort, calculadas para resistir huracanes, con cortinas motorizadas y techo aislado opcionales.',
    dic: {
      // El alt del fondo del CTA propio de esta ficha (scripts/lib/cta-slots.mjs).
      // SIN esta entrada el <img> se queda en ingles en /es/ y no lo dice NADIE:
      // traducibles.mjs solo extrae nodos de texto y comprobar-i18n.mjs no mira
      // atributos, asi que la cobertura seguiria en verde con el alt sin traducir.
      'Free-standing aluminum poolside cabana with white curtains and a lounge daybed in Weston, Florida.':
        'Cabaña exenta de aluminio junto a la piscina, con cortinas blancas y un diván de descanso, en Weston, Florida.',
      // El alt de la portada del CMS: hasta ahora esa imagen no salia en ninguna
      // pagina, y desde el FAQ a dos columnas la lee el lector de pantalla.
      'Aluminum cabana contractors in South Florida building luxury backyard cabanas engineered for shade, privacy, and resort-style outdoor living.':
        'Constructores de cabañas de aluminio en el sur de Florida levantando cabañas de patio de gama alta, pensadas para dar sombra, privacidad y un exterior con aire de resort.',
      Cabanas: 'Cabañas',
      'Resort-Style Luxury': 'Lujo de resort',
      'Hurricane-Resistant': 'Resistente a huracanes',
      '100% Rust-Proof': '100% a prueba de óxido',
      'Aluminum Cabana Builders in South Florida': 'Constructores de cabañas de aluminio en el sur de Florida',
      'We design and construct custom aluminum cabanas across Miami-Dade, Broward, and Palm Beach County. These luxury outdoor retreats provide shaded comfort and privacy while elevating the overall aesthetic of your pool or backyard space. Serving Weston, Boca Raton, Lighthouse Point, and Jupiter, we create resort-style environments built for long-term performance.':
        'Diseñamos y construimos cabañas de aluminio a medida en Miami-Dade, Broward y Palm Beach. Son refugios exteriores que dan sombra, comodidad y privacidad, y que elevan la estética de la zona de piscina o del jardín. Trabajamos en Weston, Boca Ratón, Lighthouse Point y Jupiter, creando ambientes de resort hechos para durar.',
      'Luxury Cabana Features &amp; Enhancements': 'Qué trae una cabaña y qué se le puede añadir',
      'Designed to redefine outdoor living, our luxury cabanas combine privacy, comfort, and architectural elegance. Discover the premium features that transform your backyard into a personal resort-style oasis.':
        'Nuestras cabañas combinan privacidad, confort y buen diseño. Estas son las prestaciones que convierten un jardín en un oasis propio.',
      'Resort-Style Structural Design': 'Diseño de inspiración resort',
      'Transform your backyard into a luxury escape with a fully customized aluminum cabana designed for privacy, shade, and architectural elegance.':
        'Convierta su jardín en un refugio con una cabaña de aluminio totalmente a medida, pensada para dar privacidad, sombra y buen aspecto.',
      'Privacy Enhancements': 'Más privacidad',
      'Add motorized screens, decorative panels, or partial walls to enhance privacy and climate control while maintaining a sleek modern aesthetic.':
        'Añada cortinas motorizadas, paneles decorativos o muros parciales para ganar privacidad y control del ambiente sin perder una línea limpia.',
      'Integrated Ceiling &amp; Lighting Systems': 'Techo e iluminación integrados',
      'Finished ceilings with recessed lighting options create a polished, high-end look while supporting electrical customization for fans and entertainment systems.':
        'Los techos acabados con luz empotrada dan un aspecto cuidado y dejan la instalación lista para ventiladores y equipos de audio y vídeo.',
      'Fully Engineered Aluminum Frame': 'Estructura de aluminio calculada',
      'Constructed from premium aluminum components, our cabanas are engineered to meet Florida building codes while resisting corrosion and weather damage.':
        'Fabricadas con perfilería de aluminio de gama alta, se calculan para cumplir la normativa de Florida y para resistir la corrosión y el tiempo.',
      'Custom Roofing Options': 'Opciones de cubierta',
      'Choose from insulated panels or solid roofing systems to maximize shade, comfort, and year-round protection.':
        'Elija entre paneles aislados o cubierta sólida para sacar el máximo de sombra, confort y protección todo el año.',
      'Custom Privacy Curtains &amp; Drapery': 'Cortinas de exterior a medida',
      'Incorporate outdoor-grade privacy curtains and drapery for a softer aesthetic and adjustable privacy, allowing you to create an intimate sanctuary on demand.':
        'Incorpore cortinas de exterior para suavizar la estética y regular la privacidad, y tener un rincón recogido cuando le apetezca.',
      'Explore luxury aluminum cabana projects that transform backyards into private resort-style retreats. See how structure, shade, and design come together seamlessly.':
        'Vea cabañas de aluminio ya construidas que convierten jardines en refugios privados, y cómo encajan estructura, sombra y diseño.',
      'Choose from high-end color palettes and textured finishes that create a seamless extension of your home while delivering a bold, resort-inspired presence.':
        'Elija entre paletas de color de gama alta y acabados con textura, que prolongan la casa hacia fuera con una presencia de resort.',
      'Aluminum Cabanas FAQs': 'Preguntas sobre cabañas de aluminio',
      'Have questions about custom cabanas? Learn how our hurricane-rated structures elevate South Florida outdoor living.':
        '¿Dudas sobre las cabañas a medida? Así elevan el exterior nuestras estructuras homologadas frente a huracanes.',
      '1. Are aluminum cabanas permanent?': '1. ¿Las cabañas de aluminio son permanentes?',
      'Yes, our custom aluminum cabanas are permanent structures engineered for Miami. We handle all permits to ensure a luxury, hurricane-resistant outdoor living space.':
        'Sí. Son estructuras permanentes, calculadas para Miami. Nosotros gestionamos todos los permisos para que el resultado sea un espacio de lujo y resistente a huracanes.',
      '2. Can I add motorized screens?': '2. ¿Puedo añadir cortinas motorizadas?',
      'Absolutely. Enhance your South Florida cabana with motorized retractable screens and privacy panels for instant shade, weather control, and ultimate comfort.':
        'Por supuesto. Con cortinas motorizadas retráctiles y paneles de privacidad tiene sombra al momento, control del tiempo y mucho más confort.',
      '3. Are they hurricane-resistant?': '3. ¿Resisten un huracán?',
      'Yes. Every cabana built by Pergola Plus Florida is engineered to meet strict coastal wind-load codes, ensuring your luxury outdoor retreat withstands severe storms.':
        'Sí. Cada cabaña se calcula para cumplir las estrictas cargas de viento de la costa, de modo que aguante una tormenta seria.',
      '4. What maintenance is required?': '4. ¿Qué mantenimiento necesitan?',
      'Minimal. Our premium powder-coated extruded aluminum cabanas resist rust and corrosion, making them the perfect low-maintenance solution for humid coastal climates.':
        'Muy poco. El aluminio extruido con recubrimiento en polvo resiste el óxido y la corrosión, así que es la solución de bajo mantenimiento para un clima húmedo y costero.',
      '5. Can I add LED lights and fans?': '5. ¿Puedo poner luces LED y ventiladores?',
      'Yes! Our structural aluminum cabanas seamlessly integrate LED lighting, ceiling fans, and AV systems, transforming your backyard into a luxury nighttime oasis.':
        'Sí. La estructura integra sin problema iluminación LED, ventiladores de techo y equipos de audio y vídeo, para que el jardín funcione también de noche.',
    },
  },

  'screen-enclosures': {
    nombre: 'Cerramientos con mosquitero',
    title: 'Cerramientos con mosquitero | Sur de Florida',
    description: 'Cerramientos calculados para las cargas de viento de Florida, con malla de alta visibilidad y opción resistente a mascotas.',
    dic: {
      // El alt del fondo del CTA propio de esta ficha (scripts/lib/cta-slots.mjs).
      // SIN esta entrada el <img> se queda en ingles en /es/ y no lo dice NADIE:
      // traducibles.mjs solo extrae nodos de texto y comprobar-i18n.mjs no mira
      // atributos, asi que la cobertura seguiria en verde con el alt sin traducir.
      'Aluminum pool screen enclosure with charcoal mesh over a swimming pool and lake view in Coral Springs, Florida.':
        'Cerramiento de piscina en aluminio con malla color carbón sobre la piscina, con vista al lago, en Coral Springs, Florida.',
      // El alt de la portada del CMS: hasta ahora esa imagen no salia en ninguna
      // pagina, y desde el FAQ a dos columnas la lee el lector de pantalla.
      'Screen enclosure contractors in South Florida installing custom aluminum screen rooms for patios and pool areas with code-compliant engineering.':
        'Especialistas en cerramientos con mosquitero en el sur de Florida instalando habitaciones de aluminio a medida para patios y piscinas, conforme a la normativa.',
      'Screen Enclosures': 'Cerramientos con mosquitero',
      'Expands Living Space': 'Amplía el espacio habitable',
      'High-Visibility Mesh': 'Malla de alta visibilidad',
      'Extreme Weather Rated': 'Homologado para tiempo extremo',
      'Screen Enclosure Contractors in South Florida': 'Especialistas en cerramientos con mosquitero en el sur de Florida',
      'Pergola Plus installs professionally engineered screen enclosures throughout South Florida. Our custom-built systems protect outdoor spaces from insects and debris while preserving airflow and visibility. We serve Davie, Coral Springs, Palm Beach Gardens, and surrounding cities with fully permitted, structurally sound enclosures designed for year-round usability.':
        'Pergola Plus instala cerramientos con mosquitero calculados por todo el sur de Florida. Protegen el exterior de insectos y suciedad sin cortar la ventilación ni las vistas. Trabajamos en Davie, Coral Springs, Palm Beach Gardens y alrededores, con cerramientos sólidos, con todos los permisos y pensados para usarse todo el año.',
      'Screen Enclosure Features &amp; Durability': 'Qué trae un cerramiento y cuánto aguanta',
      'Enjoy your pool and patio year-round, completely free from insects and debris. Explore the high-strength engineering, premium mesh options, and panoramic views provided by our custom-built enclosures.':
        'Disfrute de la piscina y del patio todo el año, sin insectos ni suciedad. Esta es la ingeniería, las mallas y las vistas panorámicas de nuestros cerramientos a medida.',
      'Pet-Resistant Screen Upgrades': 'Malla resistente a mascotas',
      'Opt for ultra-durable, pet-resistant mesh materials that withstand scratching and pawing, ensuring long-lasting protection and peace of mind for pet owners.':
        'Elija una malla ultrarresistente que aguanta arañazos y empujones, para que dure y usted no esté pendiente.',
      'Panoramic Screen Visibility': 'Vistas panorámicas',
      'High-clarity mesh materials maintain wide outdoor views while reducing glare and enhancing comfort.':
        'Las mallas de alta claridad mantienen las vistas abiertas, reducen los reflejos y se está más cómodo.',
      'Integrated Door Systems': 'Puertas integradas',
      'Professionally installed screen doors provide smooth access while maintaining structural durability and clean aesthetics.':
        'Puertas mosquiteras bien instaladas: se pasa con suavidad, aguantan y no rompen la estética.',
      'High-Strength Screen Systems': 'Mallas de alta resistencia',
      'Enjoy uninterrupted outdoor living without pests or debris. Our durable screening materials provide protection while preserving airflow and outdoor visibility.':
        'Vida al aire libre sin bichos ni hojas. Nuestras mallas protegen sin quitar ventilación ni vistas.',
      'Engineered Aluminum Framing': 'Estructura de aluminio calculada',
      'Fully engineered structural frames meet local wind-load requirements, ensuring long-term safety and performance in coastal conditions.':
        'Las estructuras se calculan para cumplir las cargas de viento locales, con la seguridad que pide la costa.',
      'Custom Configurations': 'Configuraciones a medida',
      'Each enclosure is custom-designed to fit patios, pools, and lanais with precision, ensuring seamless integration with your existing structure.':
        'Cada cerramiento se diseña a medida para encajar con precisión en patios, piscinas y porches, integrándose con lo que ya hay.',
      'View professionally installed screen enclosures that extend outdoor living while maintaining airflow and visibility. Discover clean integrations that enhance comfort year-round.':
        'Vea cerramientos ya instalados que amplían el exterior sin quitar aire ni vistas, integrados de forma limpia y cómodos todo el año.',
      'Frame finishes are available in modern, weather-resistant colors designed to integrate effortlessly with your patio, pool area, and existing architecture.':
        'Los acabados de la estructura están en colores actuales y resistentes a la intemperie, pensados para integrarse con el patio, la piscina y la casa.',
      'Screen Enclosures FAQs': 'Preguntas sobre cerramientos con mosquitero',
      'Have questions? Learn how our wind-rated screen enclosures keep South Florida bugs out while letting coastal breezes flow.':
        '¿Dudas? Así dejan fuera a los insectos nuestros cerramientos homologados sin cortar la brisa de la costa.',
      '1. Do enclosures block the breeze?': '1. ¿Un cerramiento corta la brisa?',
      'Not at all. Our premium pool screen enclosures feature high-visibility mesh that stops insects and debris while maximizing refreshing natural airflow on your patio.':
        'No. La malla de alta visibilidad frena insectos y suciedad, pero deja pasar el aire, que es justo lo que refresca el patio.',
      '2. Do they meet hurricane codes?': '2. ¿Cumplen la normativa antihuracán?',
      'Yes. Pergola Plus Florida builds every aluminum screen enclosure to strict structural engineering standards to withstand hurricane-force winds and coastal weather.':
        'Sí. Cada cerramiento se construye con criterios estrictos de cálculo estructural para aguantar vientos de huracán y el clima costero.',
      '3. Will the screen mesh sag easily?': '3. ¿La malla se descuelga con el tiempo?',
      'No. We install ultra-durable, high-tensile, and pet-resistant screening materials using precision tensioning to prevent sagging or tearing over years of heavy use.':
        'No. Instalamos mallas de alta tensión, muy resistentes y aptas para mascotas, con un tensado preciso que evita que se descuelguen o se rasguen.',
      '4. Are building permits required?': '4. ¿Hace falta permiso de obra?',
      'Yes, municipal permits are required. Our team expertly handles site surveys, engineering, and the full permitting process to ensure a legal, hassle-free installation.':
        'Sí, hace falta permiso municipal. Nos ocupamos del levantamiento, el cálculo y toda la tramitación para que la instalación sea legal y sin complicaciones.',
      '5. Can you fit my complex pool?': '5. ¿Podéis adaptaros a mi piscina, que es complicada?',
      'Absolutely. We custom-fabricate every aluminum frame to flawlessly integrate with your home&#x27;s unique architecture, multi-level decks, and custom pool layouts.':
        'Sí. Fabricamos cada estructura a medida para que encaje con la arquitectura de su casa, con decks a varios niveles y con piscinas de forma libre.',
    },
  },

  'motorized-screens': {
    nombre: 'Cortinas motorizadas',
    title: 'Cortinas motorizadas para patios | Sur de Florida',
    description: 'Cortinas retráctiles con mando o app, detección de obstáculos y carcasa oculta, integradas en pérgolas y porches.',
    dic: {
      // ── Chip del hero ─────────────────────────────────────────────────────────
      'Wind Sensor Retracts Them':
        'El sensor de viento las recoge',

      // ── Los alt de las cuatro fotos grandes ───────────────────────────────────
      'Motorized screens lowered across the open side of a covered patio, dark mesh dimming the view out to a pool and palms.':
        'Cortinas motorizadas bajadas por el lado abierto de un patio cubierto, con la malla oscura atenuando la vista a la piscina y las palmeras.',
      'Inside a lanai with the motorized screens down, the dark mesh keeping the view through to the pool deck and the planting beyond.':
        'Desde dentro de un porche con las cortinas motorizadas bajadas, la malla oscura deja ver la zona de piscina y la plantación del fondo.',
      'Motorized screens run the length of a two-storey home, lowered over the covered walkway beside a lap pool.':
        'Cortinas motorizadas a lo largo de toda una casa de dos plantas, bajadas sobre el paso cubierto junto a una piscina de nado.',
      'Motorized screens lowered along a covered terrace, with the pool and the seating area visible through the mesh.':
        'Cortinas motorizadas bajadas a lo largo de una terraza cubierta, con la piscina y la zona de estar visibles a través de la malla.',

      // ── §4 · Cuántas hacen falta ──────────────────────────────────────────────
      'How Many You Actually Need':
        'Cuántas hacen falta de verdad',
      'Most spaces need one or two screens, not four. The side the afternoon sun comes from and the side facing a neighbour or a road are the ones that change how the space feels; screening every opening turns an outdoor room into a box and costs four times as much. We measure the openings, ask which hours you actually use it, and start with the worst side.':
        'La mayoría de los espacios necesitan una o dos cortinas, no cuatro. El lado por donde entra el sol de la tarde y el que da al vecino o a la calle son los que cambian cómo se siente el espacio; cerrar todos los huecos convierte una sala exterior en una caja y cuesta cuatro veces más. Medimos los huecos, preguntamos a qué horas lo usa de verdad y empezamos por el lado peor.',
      'The Afternoon-Sun Side':
        'El lado del sol de la tarde',
      'The Side Facing A Neighbour':
        'El lado que da al vecino',
      'Into A New Pergola Bay':
        'En un vano de pérgola nuevo',
      'Retrofitted To What You Have':
        'Añadidas a lo que ya tiene',

      // ── §5 · Lo que puede y lo que no ─────────────────────────────────────────
      'What A Screen Can And Cannot Do':
        'Lo que una cortina puede y lo que no',
      'A motorized screen is fabric on a roller, and that is the whole honest answer. Four things decide whether it does what you wanted: what the mesh does to light, what happens when it blows, what happens when something is in the way, and where it goes when it is up.':
        'Una cortina motorizada es tejido sobre un rodillo, y esa es toda la respuesta honesta. Hay cuatro cosas que deciden si hace lo que usted quería: qué le hace la malla a la luz, qué pasa cuando sopla viento, qué pasa cuando hay algo en medio y dónde se mete cuando está recogida.',
      'What The Mesh Does To Light':
        'Qué le hace la malla a la luz',
      'Mesh works by contrast: it hides whichever side is darker. In daylight you see out and people outside do not see in. After dark, with the light on inside, that reverses — which surprises people who bought screens for evening privacy. If that is what you want, you want a blackout or a dense fabric on that opening, and we will say so before you buy it.':
        'La malla funciona por contraste: oculta el lado que esté más oscuro. De día usted ve hacia fuera y desde fuera no se ve hacia dentro. De noche, con la luz encendida, eso se invierte, y sorprende a quien compró las cortinas pensando en la privacidad de la noche. Si es eso lo que busca, lo que quiere en ese hueco es un tejido opaco o muy tupido, y se lo decimos antes de que lo compre.',
      'What Happens When It Blows':
        'Qué pasa cuando sopla viento',
      'Every system has a wind speed above which the screen should be retracted, and it can be set to retract itself on a wind sensor. This is the part worth reading twice: a screen is a comfort and shade product, not a hurricane shutter. Anyone who tells you otherwise is selling you the wrong thing for the storm.':
        'Todo sistema tiene una velocidad de viento por encima de la cual hay que recoger la cortina, y se puede dejar programado que se recoja sola con un sensor de viento. Esta parte conviene leerla dos veces: una cortina es un producto de confort y de sombra, no una persiana de huracán. Quien le diga lo contrario le está vendiendo lo que no es para la tormenta.',
      'If Something Is In The Way':
        'Si hay algo en medio',
      'Sensors stop the screen on its way down when it meets an obstruction, which is what makes it safe around children, pets and furniture you did not move. It is a standard feature, not an upgrade, and it is the reason a motorized screen is safer than the crank-and-hope alternative.':
        'Los sensores paran la cortina mientras baja cuando se encuentra un obstáculo, y eso es lo que la hace segura con niños, mascotas y muebles que no movió. Viene de serie, no es un extra, y es la razón por la que una cortina motorizada es más segura que la de manivela y a ver qué pasa.',
      'Where It Goes When It Is Up':
        'Dónde se mete cuando está recogida',
      'Into a concealed aluminium cassette, with the fabric running in side tracks. Retracted, the whole system reads as a beam: no rolled bundle hanging in the opening, no visible hardware. On a retrofit this is the part that decides feasibility — the cassette and the tracks need somewhere solid to land.':
        'En un cajón de aluminio oculto, con el tejido corriendo por guías laterales. Recogida, el conjunto se lee como una viga: ni un rollo colgando en el hueco ni herrajes a la vista. En una instalación posterior esta es la parte que decide si se puede: el cajón y las guías necesitan dónde anclarse.',

      // ── Pies de galería ───────────────────────────────────────────────────────
      'Lowered along the full length of a covered lanai':
        'Bajadas a lo largo de todo un porche cubierto',
      'Retracted at dusk: the opening reads as a clean beam':
        'Recogidas al anochecer: el hueco se lee como una viga limpia',
      'A long run beside a lap pool, screens down':
        'Un tramo largo junto a una piscina de nado, con las cortinas bajadas',
      'From inside, with the mesh half down':
        'Desde dentro, con la malla a media altura',
      'Screens up over a kidney pool and paver deck':
        'Cortinas recogidas sobre una piscina de riñón y una terraza de losas',
      'Under a gable roof, screens closing the far side':
        'Bajo un techo a dos aguas, con las cortinas cerrando el lado del fondo',

      // ── Los alt de la galería ─────────────────────────────────────────────────
      'Motorized screens lowered along the full length of a covered lanai on a white house, with lawn in front and the pool deck behind the mesh.':
        'Cortinas motorizadas bajadas a lo largo de todo un porche cubierto en una casa blanca, con césped delante y la zona de piscina detrás de la malla.',
      'Covered patio at dusk with the screens fully retracted into their housings, warm interior lighting showing through the open bays and hydrangeas in the foreground.':
        'Patio cubierto al anochecer con las cortinas totalmente recogidas en sus cajones, la luz cálida del interior asomando por los vanos abiertos y hortensias en primer plano.',
      'Motorized screens lowered along a two-storey home beside a lap pool, the dark mesh shading the whole covered walkway.':
        'Cortinas motorizadas bajadas a lo largo de una casa de dos plantas junto a una piscina de nado, con la malla oscura dando sombra a todo el paso cubierto.',
      'Interior of a lanai with a motorized screen partway down, wicker seating in the foreground and the pool visible through the mesh.':
        'Interior de un porche con una cortina motorizada a media bajada, sillones de mimbre en primer plano y la piscina visible a través de la malla.',
      'Screened lanai with the mesh retracted, looking across a kidney-shaped pool and paver deck with a thatched bar to one side.':
        'Porche con la malla recogida, mirando hacia una piscina de riñón y una terraza de losas, con una barra de techo de paja a un lado.',
      'Motorized screens closing the far side of a gable-roofed outdoor room, with wicker sofas and an ottoman on a paver terrace.':
        'Cortinas motorizadas cerrando el lado del fondo de una sala exterior con techo a dos aguas, con sofás de mimbre y un puf en una terraza de losas.',
      'Freestanding pergola with a motorized screen lowered on one side and fixed slatted panels on the other, over a paved dining terrace.':
        'Pérgola exenta con una cortina motorizada bajada por un lado y celosías fijas por el otro, sobre una terraza de comedor pavimentada.',
      'Motorized screens across a lit lanai after dark, the warm interior showing through the mesh from outside.':
        'Cortinas motorizadas en un porche iluminado de noche, con el interior cálido asomando a través de la malla desde fuera.',

      // ── Vídeo, CTA y comparativo ──────────────────────────────────────────────
      'Watch Them Come Down':
        'Véalas bajar',
      'Meet with our exterior designers for a free consultation. We&#x27;ll measure the openings, ask which hours you actually use the space, and start with the side that is costing you.':
        'Reúnase con nuestros diseñadores de exteriores en una consulta gratuita. Medimos los huecos, preguntamos a qué horas usa el espacio de verdad y empezamos por el lado que le está costando.',
      'Other Ways To Close A Space':
        'Otras formas de cerrar un espacio',
      'Screens, Enclosures Or A Roof':
        'Cortinas, cerramientos o un techo',
      'A motorized screen closes a side and rolls away. If you want the whole space enclosed permanently, a roof that opens and shuts, a roof that never moves, or a structure of its own, these are the other four we build.':
        'Una cortina motorizada cierra un lado y se recoge. Si lo que quiere es cerrar el espacio entero de forma permanente, un techo que se abra y se cierre, uno que no se mueva nunca o una estructura propia, estos son los otros cuatro que construimos.',

      // ── Las cinco preguntas del FAQ, ya sin numerar ───────────────────────────
      'How are screens controlled?':
        '¿Cómo se controlan las cortinas?',
      'Can they withstand strong winds?':
        '¿Aguantan vientos fuertes?',
      'Do they reduce patio heat?':
        '¿Bajan el calor del patio?',
      'Are they hidden when not in use?':
        '¿Quedan ocultas cuando no se usan?',
      'Can you add them to my pergola?':
        '¿Se pueden añadir a mi pérgola?',

      // El alt del fondo del CTA propio de esta ficha (scripts/lib/cta-slots.mjs).
      // SIN esta entrada el <img> se queda en ingles en /es/ y no lo dice NADIE:
      // traducibles.mjs solo extrae nodos de texto y comprobar-i18n.mjs no mira
      // atributos, asi que la cobertura seguiria en verde con el alt sin traducir.
      'Motorized retractable bronze screens lowered across a covered patio overlooking a pool in Wellington, Florida.':
        'Mallas motorizadas retráctiles en bronce, bajadas sobre un patio cubierto con vistas a la piscina, en Wellington, Florida.',
      // El alt de la portada del CMS: hasta ahora esa imagen no salia en ninguna
      // pagina, y desde el FAQ a dos columnas la lee el lector de pantalla.
      'Motorized screen installers in South Florida providing retractable patio screens for shade, privacy, and smart outdoor automation.':
        'Instaladores de cortinas motorizadas en el sur de Florida con cortinas retráctiles de patio para dar sombra, privacidad y automatización al exterior.',
      'Instant Bug Protection': 'Protección inmediata frente a insectos',
      'Retracts Invisibly': 'Se recoge y desaparece',
      'Coastal Wind Rated': 'Homologada para viento de costa',
      'Motorized Screen Installers in South Florida': 'Instaladores de cortinas motorizadas en el sur de Florida',
      'We provide premium motorized screen systems across Miami-Dade, Broward, and Palm Beach County. These retractable solutions offer on-demand shade, privacy, and wind control while seamlessly integrating into pergolas and covered patios. Serving Fort Lauderdale, Weston, Boca Raton, and Wellington, we bring automation and comfort to high-end outdoor spaces.':
        'Instalamos cortinas motorizadas de gama alta en Miami-Dade, Broward y Palm Beach. Son soluciones retráctiles que dan sombra, privacidad y control del viento cuando usted quiere, integradas en pérgolas y porches. Trabajamos en Fort Lauderdale, Weston, Boca Ratón y Wellington, llevando automatización y confort al exterior.',
      'Motorized Retractable Screen Features': 'Qué trae una cortina motorizada',
      'Instant shade, privacy, and climate control at the touch of a button. Learn how our seamlessly integrated motorized screens elevate your outdoor comfort while keeping insects and harsh weather at bay.':
        'Sombra, privacidad y control del ambiente al pulsar un botón. Así mejoran el confort nuestras cortinas motorizadas, dejando fuera insectos y mal tiempo.',
      'Weather-Resistant Mesh Options': 'Mallas resistentes a la intemperie',
      'Specialized screen fabrics reduce heat gain and glare while maintaining outward visibility and airflow.':
        'Tejidos técnicos que reducen el calor y los reflejos sin quitar la vista hacia fuera ni la ventilación.',
      'Smart Home Compatibility': 'Compatible con la domótica',
      'Compatible with modern smart systems, allowing control via mobile app or voice command for ultimate convenience.':
        'Compatible con los sistemas domóticos actuales, para manejarla desde el móvil o por voz.',
      'Retractable Automation System': 'Automatización del recogido',
      'Deploy or retract your screens instantly with remote or smart control, allowing flexible protection from sun, wind, and insects.':
        'Baje o suba las cortinas al momento con el mando o desde el móvil, y protéjase del sol, del viento o de los insectos según convenga.',
      'Obstacle Detection Technology': 'Detección de obstáculos',
      'Advanced built-in sensors automatically halt the screen&#x27;s descent if an obstacle is detected, ensuring the safety of children, pets, and outdoor furniture.':
        'Unos sensores detienen la bajada si detectan un obstáculo, por la seguridad de los niños, las mascotas y los muebles.',
      'Custom Sizing &amp; Configurations': 'Medidas y configuración a medida',
      'Each system is custom-measured to ensure smooth operation and complete coverage of your outdoor openings.':
        'Cada equipo se mide a medida para que funcione con suavidad y cubra el hueco por completo.',
      'Concealed Housing Design': 'Carcasa oculta',
      'Screens retract into discreet housings that preserve the clean lines of your pergola or patio structure.':
        'Las cortinas se recogen en carcasas discretas que no rompen las líneas de la pérgola ni del porche.',
      'See motorized screen systems in action, providing retractable shade, privacy, and wind control. Explore seamless integrations within high-end pergolas and patio spaces.':
        'Vea las cortinas motorizadas en funcionamiento, dando sombra, privacidad y control del viento, integradas en pérgolas y patios de gama alta.',
      'Customize housing and track colors to blend discreetly with your pergola or patio structure, maintaining clean lines and a cohesive architectural look.':
        'Elija el color de la carcasa y de las guías para que se integren con la pérgola o el porche y todo mantenga una línea limpia.',
      'Watch motorized screens deploy instantly for shade, privacy, and wind control — seamlessly integrated into high-end pergolas and patio systems.':
        'Vea cómo bajan las cortinas al momento para dar sombra, privacidad y control del viento, integradas en pérgolas y patios de gama alta.',
      'Motorized Screens FAQs': 'Preguntas sobre cortinas motorizadas',
      'Discover how our motorized screens provide privacy and bug protection for South Florida patios. Read FAQs to upgrade your space.':
        'Así dan privacidad y protección frente a insectos nuestras cortinas motorizadas en los patios del sur de Florida.',
      '1. How are screens controlled?': '1. ¿Cómo se manejan?',
      'Our motorized retractable screens operate smoothly via remote, wall switch, or smart home app, giving you instant outdoor climate control at the touch of a button.':
        'Con mando, con un pulsador de pared o desde la app de su sistema domótico. Control del ambiente exterior al momento.',
      '2. Can they withstand strong winds?': '2. ¿Aguantan viento fuerte?',
      'Yes. Featuring advanced edge-retention tracks, our heavy-duty screen systems stay securely locked in place, providing exceptional stability during Florida storms.':
        'Sí. Las guías de retención lateral mantienen la cortina sujeta en su sitio, con muy buena estabilidad durante las tormentas de Florida.',
      '3. Do they reduce patio heat?': '3. ¿Bajan la temperatura del patio?',
      'Absolutely. Our premium solar mesh fabrics block up to 95% of UV rays, drastically lowering patio temperatures and sun glare while maintaining comfortable airflow.':
        'Sí. Los tejidos solares bloquean hasta el 95% de los rayos UV, así que baja mucho la temperatura y el deslumbramiento, sin cortar la ventilación.',
      '4. Are they hidden when not in use?': '4. ¿Se ven cuando están recogidas?',
      'Yes! When retracted, the screens roll seamlessly into a sleek, concealed aluminum housing, preserving the clean architectural lines of your luxury outdoor space.':
        'No. Al recogerse se enrollan dentro de una carcasa de aluminio discreta, y las líneas del exterior quedan igual de limpias.',
      '5. Can you add them to my pergola?': '5. ¿Se pueden poner en mi pérgola actual?',
      'Yes, Pergola Plus Florida custom-measures and retrofits motorized retractable screens onto existing pergolas, lanais, or covered patios for enhanced bug protection.':
        'Sí. Medimos a medida e instalamos cortinas motorizadas en pérgolas, porches y patios cubiertos que ya existen.',
    },
  },

  carports: {
    nombre: 'Cocheras de aluminio',
    title: 'Cocheras de aluminio | Sur de Florida',
    description: 'Cocheras de aluminio calculadas para las cargas de viento de Florida, con drenaje oculto y acabados que se integran con la casa.',
    dic: {
      // El alt del fondo del CTA propio de esta ficha (scripts/lib/cta-slots.mjs).
      // SIN esta entrada el <img> se queda en ingles en /es/ y no lo dice NADIE:
      // traducibles.mjs solo extrae nodos de texto y comprobar-i18n.mjs no mira
      // atributos, asi que la cobertura seguiria en verde con el alt sin traducir.
      'Aluminum carport with a warm wood-grain soffit and slatted side screen over a paver driveway in Plantation, Florida.':
        'Cochera de aluminio con cara inferior en veta de madera y celosía lateral de listones, sobre una entrada de coches adoquinada en Plantation, Florida.',
      // El alt de la portada del CMS: hasta ahora esa imagen no salia en ninguna
      // pagina, y desde el FAQ a dos columnas la lee el lector de pantalla.
      'Aluminum carport builders in South Florida constructing custom vehicle protection structures engineered for sun, rain, and high-wind conditions.':
        'Constructores de cocheras de aluminio en el sur de Florida levantando estructuras a medida que protegen el coche del sol, la lluvia y el viento fuerte.',
      'Premium Sun Protection': 'Protección solar de verdad',
      'Custom Home Integration': 'Integrada con su casa',
      'Wind-Code Compliant': 'Cumple la normativa de viento',
      'Aluminum Carport Contractors in South Florida': 'Especialistas en cocheras de aluminio en el sur de Florida',
      'Pergola Plus designs and installs custom aluminum carports throughout South Florida. Engineered to protect vehicles from intense sun exposure and heavy rain, our structures combine durability with architectural refinement. We serve Boynton Beach, Jupiter, Davie, and Plantation with fully customized, professionally installed solutions.':
        'Pergola Plus diseña e instala cocheras de aluminio a medida por todo el sur de Florida. Están calculadas para proteger los coches del sol fuerte y de la lluvia, y son tan duraderas como cuidadas de diseño. Trabajamos en Boynton Beach, Jupiter, Davie y Plantation, con soluciones a medida e instalación profesional.',
      'Engineered Aluminum Carport Features': 'Qué trae una cochera de aluminio',
      'Delivering superior vehicle protection without sacrificing curb appeal. Explore the structural integrity, premium materials, and custom design elements that make our carports the ideal choice for Florida homes.':
        'Protege el coche sin afear la casa. Esta es la solidez, los materiales y el diseño a medida que hacen de nuestras cocheras la opción adecuada en Florida.',
      'Integrated Gutter &amp; Drainage System': 'Canalón y drenaje integrados',
      'Concealed internal drainage systems efficiently route rainwater away from your vehicles and driveway, preventing pooling and maintaining a clean, dry parking area.':
        'El drenaje va oculto por dentro y saca el agua de lluvia lejos de los coches y de la entrada, así que no se encharca y la zona queda limpia y seca.',
      'High-Performance Roofing Systems': 'Techos de altas prestaciones',
      'Choose from insulated, solid, or polycarbonate roofing options to protect vehicles from intense UV exposure, heavy rain, and environmental debris while maintaining a refined architectural appearance.':
        'Elija techo aislado, macizo o de policarbonato para proteger los coches del sol fuerte, de la lluvia y de la suciedad, sin renunciar a un buen acabado.',
      'Engineered Structural Aluminum Frame': 'Estructura de aluminio calculada',
      'Our aluminum carports are fully engineered to meet strict Florida building codes, including wind-load requirements for coastal environments. Designed for structural integrity and long-term durability, they provide reliable protection year after year.':
        'Nuestras cocheras se calculan para cumplir la normativa de Florida, incluidas las cargas de viento de la costa. Sólidas y duraderas, protegen año tras año.',
      'Each carport is custom-designed to align with your home’s architecture, rooflines, and exterior finishes, ensuring it enhances — not detracts from — property value.':
        'Cada cochera se diseña a medida para seguir la arquitectura de su casa, sus cubiertas y sus acabados, de modo que sume valor a la propiedad en vez de restarlo.',
      'Corrosion-Resistant Construction': 'Construcción que no se corroe',
      'Premium powder-coated aluminum resists rust, oxidation, and deterioration — making it ideal for South Florida’s humidity and salt-air exposure.':
        'El aluminio con recubrimiento en polvo no se oxida ni se degrada, así que va bien con la humedad y el aire salino del sur de Florida.',
      'Attached or Freestanding Options': 'Adosada o exenta',
      'Whether integrated into your home’s structure or installed as a freestanding solution, every system is engineered for stability and seamless visual cohesion.':
        'Se integre en la estructura de la casa o se monte exenta, cada cochera se calcula para ser estable y para verse como parte del conjunto.',
      'Browse custom aluminum carport installations designed to protect vehicles while complementing residential architecture with strength and style.':
        'Vea cocheras de aluminio ya instaladas: protegen los coches y acompañan a la arquitectura de la casa con solidez y estilo.',
      'Select from premium exterior finishes and contemporary tones that complement your home’s façade while ensuring long-lasting durability in Florida’s climate.':
        'Elija entre acabados exteriores de calidad y tonos actuales que acompañen a la fachada y aguanten el clima de Florida.',
      'Discover how custom aluminum carports protect vehicles from sun and rain while enhancing your home’s architectural presence.':
        'Vea cómo una cochera de aluminio a medida protege los coches del sol y de la lluvia mientras mejora la presencia de la casa.',
      'Aluminum Carports FAQs': 'Preguntas sobre cocheras de aluminio',
      'Find answers on our durable aluminum carports. We protect South Florida vehicles from harsh sun and severe tropical weather.':
        'Respuestas sobre nuestras cocheras de aluminio, que protegen los coches del sur de Florida del sol fuerte y del mal tiempo.',
      '1. Do carports block UV sun rays?': '1. ¿Frenan los rayos UV?',
      'Yes, our premium aluminum carports block harmful UV rays and intense South Florida heat, protecting your vehicle&#x27;s paint and interior from severe sun damage.':
        'Sí. Frenan los rayos UV y el calor fuerte del sur de Florida, así que la pintura y el interior del coche no se estropean con el sol.',
      '2. Are they built for high winds?': '2. ¿Aguantan viento fuerte?',
      'Every custom carport is structurally engineered to surpass Florida wind-load codes, guaranteeing top-tier hurricane protection and durability for your vehicles.':
        'Cada cochera se calcula para superar las cargas de viento que exige Florida, con la protección que hace falta frente a un huracán.',
      '3. Can the design match my home?': '3. ¿Puede ir a juego con mi casa?',
      'Absolutely. We offer fully custom modern carports with premium powder-coating to perfectly complement your home&#x27;s exterior, roofline, and luxury curb appeal.':
        'Sí. Las hacemos a medida y con recubrimiento en polvo, para que acompañen al exterior de su casa, a la cubierta y a la fachada.',
      '4. Will the aluminum carport rust?': '4. ¿Se oxida el aluminio?',
      'No. Our high-quality powder-coated aluminum resists rust, corrosion, and fading, ensuring a maintenance-free, durable parking structure for coastal environments.':
        'No. El aluminio con recubrimiento en polvo no se oxida, no se corroe y no pierde color: es una estructura duradera y sin mantenimiento, también en la costa.',
      '5. Do I need a building permit?': '5. ¿Hace falta permiso de obra?',
      'Yes, permanent carports require permits. Pergola Plus Florida handles the entire engineering and permitting process for a hassle-free, code-compliant installation.':
        'Sí, una cochera permanente lleva permiso. Nos ocupamos del cálculo y de toda la tramitación para que la instalación sea legal y sin complicaciones.',
    },
  },

  'polycarbonate-pergolas': {
    nombre: 'Pérgolas de policarbonato',
    title: 'Pérgolas con techo de policarbonato | Sur de Florida',
    description: 'Paneles translúcidos que bloquean el 99% de los UV, resisten impactos y dejan pasar la luz, sobre estructura de aluminio reforzada.',
    dic: {
      // ── Chips del hero ────────────────────────────────────────────────────────
      'Watertight Panel Roof':
        'Cubierta de panel estanca',
      'Multiwall Polycarbonate Panels':
        'Paneles de policarbonato de pared múltiple',

      // ── Los alt de las cuatro fotos grandes ───────────────────────────────────
      'Polycarbonate pergola with a pale translucent roof on a grey aluminum frame, throwing diffuse light over a terrace against a stucco house.':
        'Pérgola de policarbonato con cubierta translúcida clara sobre estructura de aluminio gris, repartiendo luz difusa por una terraza junto a una casa de estuco.',
      'White-framed polycarbonate pergola over an outdoor kitchen and bar on a composite deck, backed by a clipped hedge.':
        'Pérgola de policarbonato con estructura blanca sobre una cocina exterior y una barra en una terraza de composite, con un seto recortado detrás.',
      'Dark-framed polycarbonate pergola beside a slatted privacy screen, its translucent roof lighting a paved side terrace.':
        'Pérgola de policarbonato con estructura oscura junto a una celosía de privacidad, con su cubierta translúcida iluminando una terraza lateral pavimentada.',
      'Dark aluminum frame with white posts carrying a translucent polycarbonate roof over a patio with French doors.':
        'Estructura de aluminio oscuro con pilares blancos sosteniendo una cubierta translúcida de policarbonato sobre un patio con puertas francesas.',

      // ── §4 ────────────────────────────────────────────────────────────────────
      'Two Ways We Mount It, And How Much Light You Let Through':
        'Dos formas de montarla, y cuánta luz deja pasar',
      'Every polycarbonate roof we build is drawn for one house. Where it lands is the first decision — attached to the structure, or freestanding over a deck or a patio. The second is the panel: the tint sets how much light comes through and how much heat comes with it, and the frame colour decides whether the structure reads light or dark against your house.':
        'Cada cubierta de policarbonato que construimos se dibuja para una casa concreta. Dónde se apoya es la primera decisión: adosada a la estructura, o exenta sobre una terraza o un patio. La segunda es el panel: el tinte fija cuánta luz entra y cuánto calor viene con ella, y el color de la estructura decide si se lee clara u oscura contra su casa.',
      'Attached to the House':
        'Adosada a la casa',
      'Freestanding Over Deck or Patio':
        'Exenta sobre terraza o patio',
      'Panel Tint To Suit The Light':
        'Tinte del panel según la luz',
      'Frame Colour From The Palette':
        'Color de estructura de la carta',

      // ── §5 ────────────────────────────────────────────────────────────────────
      'What A Translucent Roof Really Does':
        'Lo que hace de verdad una cubierta translúcida',
      'A polycarbonate roof buys you light that a solid roof cannot. Four things decide whether that trade is the right one for your patio: how the UV layer works, what the panel is actually made of, what it sounds like in the rain, and where the water ends up.':
        'Una cubierta de policarbonato le compra una luz que una cubierta maciza no puede dar. Hay cuatro cosas que deciden si ese intercambio le conviene a su patio: cómo funciona la capa UV, de qué está hecho el panel de verdad, cómo suena con lluvia y por dónde acaba yéndose el agua.',
      'The UV Layer, And Which Way It Faces':
        'La capa UV, y hacia qué lado va',
      'Quality panels carry a co-extruded UV layer and a manufacturer warranty measured in years against yellowing and loss of light. The part nobody mentions: the layer only works facing out. Orientation at installation matters as much as the panel you buy, which is why this is not a job to hand to whoever is cheapest that week.':
        'Los paneles buenos llevan una capa UV coextruida y una garantía del fabricante, medida en años, contra el amarilleo y la pérdida de luz. La parte que nadie menciona: la capa solo funciona hacia fuera. La orientación en el montaje importa tanto como el panel que compre, y por eso este no es un trabajo para dárselo al más barato de la semana.',
      'Multiwall, Not A Single Sheet':
        'Pared múltiple, no una lámina',
      'A multiwall panel is two skins with air chambers between them, not one flat sheet. The chambers are what make it stiffer, quieter and better at slowing heat than the single-skin material sold in kit form. It is also the reason the roof reads as a soft diffuse light rather than a hard glare.':
        'Un panel de pared múltiple son dos caras con cámaras de aire entre ellas, no una lámina lisa. Las cámaras son las que lo hacen más rígido, más silencioso y mejor frenando el calor que el material de una sola cara que se vende en kit. Y son también la razón de que la cubierta dé una luz suave y difusa en vez de un reflejo duro.',
      'It Is Louder In The Rain':
        'Con lluvia suena más',
      'Noticeably louder than an insulated solid roof, and we would rather you heard it here. It is a thin panel and rain drums on it; multiwall is quieter than single-skin because the chambers damp the impact. If you want to hold a conversation through a Florida downpour, this is the wrong roof and we will tell you so.':
        'Bastante más que una cubierta maciza aislada, y preferimos que se entere aquí. Es un panel fino y la lluvia repica en él; la pared múltiple suena menos que la de una sola cara porque las cámaras amortiguan el impacto. Si quiere poder conversar durante un aguacero de Florida, esta no es la cubierta, y se lo vamos a decir.',
      'Where The Water Goes':
        'Por dónde se va el agua',
      'The panels sit in a gutter profile built into the frame, so the roof drains at its edge rather than dripping down the line of every joint. It is the same engineered aluminium structure we put under an open-air pergola: the panel changes, the frame does not.':
        'Los paneles apoyan en un perfil-canalón integrado en la estructura, así que la cubierta desagua por su borde en vez de gotear por la línea de cada junta. Es la misma estructura de aluminio calculada que ponemos bajo una pérgola de estructura abierta: cambia el panel, no la estructura.',

      // ── Pies de galería ───────────────────────────────────────────────────────
      'Dark frame over the grill run, against a white wall':
        'Estructura oscura sobre la zona de parrilla, contra una pared blanca',
      'Over the side garden, between the palms':
        'Sobre el jardín lateral, entre las palmeras',
      'White frame over a raised bar and counter':
        'Estructura blanca sobre una barra elevada',
      'Close up from below: panel, rafter and sky':
        'De cerca desde abajo: panel, viga y cielo',
      'A long attached run over a brick-house patio':
        'Un tramo largo adosado sobre el patio de una casa de ladrillo',

      // ── Los alt de la galería ─────────────────────────────────────────────────
      'Dark-framed polycarbonate roof over an outdoor grill run, set against a white wall on a paver-and-turf terrace.':
        'Cubierta de policarbonato con estructura oscura sobre una zona de parrilla exterior, contra una pared blanca, en una terraza de losas con juntas de césped.',
      'Polycarbonate roof on a dark frame covering a planted side entrance, framed by travellers palms and tropical planting.':
        'Cubierta de policarbonato sobre estructura oscura cubriendo una entrada lateral ajardinada, enmarcada por palmeras del viajero y plantación tropical.',
      'White-framed polycarbonate pergola over a raised outdoor bar and counter, attached to a two-storey stucco home.':
        'Pérgola de policarbonato con estructura blanca sobre una barra exterior elevada, adosada a una casa de estuco de dos plantas.',
      'Close view from below of translucent polycarbonate panels on dark rafters, with cloud and blue sky showing through the roof.':
        'Vista cercana desde abajo de los paneles translúcidos de policarbonato sobre vigas oscuras, con nubes y cielo azul asomando a través de la cubierta.',
      'Long polycarbonate roof attached along the back of a brick house, covering a patio with a hanging chair and seating.':
        'Cubierta de policarbonato larga adosada a la parte trasera de una casa de ladrillo, cubriendo un patio con un sillón colgante y asientos.',
      'White-framed polycarbonate pergola over an outdoor kitchen on a composite deck, the translucent roof keeping the whole space bright.':
        'Pérgola de policarbonato con estructura blanca sobre una cocina exterior en una terraza de composite, con la cubierta translúcida manteniendo todo el espacio luminoso.',
      'Seen from below: translucent polycarbonate panels on a dark frame with a ceiling fan, daylight coming through the roof.':
        'Vista desde abajo: paneles translúcidos de policarbonato sobre estructura oscura con un ventilador de techo, con la luz del día entrando por la cubierta.',

      // ── Vídeo, CTA y comparativo ──────────────────────────────────────────────
      'Light Through The Roof':
        'La luz a través de la cubierta',
      'Meet with our exterior designers for a free consultation. We&#x27;ll measure your space, look at which way it faces, and pick the panel around how much light you actually want.':
        'Reúnase con nuestros diseñadores de exteriores en una consulta gratuita. Medimos su espacio, miramos hacia dónde da y elegimos el panel según la luz que de verdad quiere.',
      'A polycarbonate roof keeps the space bright and dry. If you would rather have a roof that is quieter and cooler underneath, one that opens and shuts, or one with nothing over you at all, these are the other three we build.':
        'Una cubierta de policarbonato mantiene el espacio luminoso y seco. Si prefiere una que suene menos y esté más fresca por debajo, una que se abra y se cierre, o una sin nada encima, estos son los otros tres que construimos.',

      // ── Las cinco preguntas del FAQ, ya sin numerar ───────────────────────────
      'Do polycarbonate roofs block UV?':
        '¿Los techos de policarbonato bloquean los UV?',
      'Will the panels turn yellow?':
        '¿Los paneles se ponen amarillos?',
      'Can they survive severe storms?':
        '¿Aguantan tormentas fuertes?',
      'Do they keep the patio dry?':
        '¿Mantienen el patio seco?',
      'Are the panel tints custom?':
        '¿Los tintes del panel son a medida?',

      // El alt del fondo del CTA propio de esta ficha (scripts/lib/cta-slots.mjs).
      // SIN esta entrada el <img> se queda en ingles en /es/ y no lo dice NADIE:
      // traducibles.mjs solo extrae nodos de texto y comprobar-i18n.mjs no mira
      // atributos, asi que la cobertura seguiria en verde con el alt sin traducir.
      'Polycarbonate roof pergola with translucent panels casting soft diffuse light over a patio in Boynton Beach, Florida.':
        'Pérgola con techo de policarbonato, de paneles translúcidos que dan una luz suave y difusa, sobre un patio en Boynton Beach, Florida.',
      // El alt de la portada del CMS: hasta ahora esa imagen no salia en ninguna
      // pagina, y desde el FAQ a dos columnas la lee el lector de pantalla.
      'Polycarbonate pergola contractors in South Florida installing UV-protected translucent roofing systems for patios and poolside outdoor spaces.':
        'Especialistas en pérgolas de policarbonato en el sur de Florida instalando cubiertas traslúcidas con protección UV para patios y zonas de piscina.',
      '100% Waterproof Patio': 'Patio 100% estanco',
      'Advanced UV Protection': 'Protección UV avanzada',
      'Impact-Resistant Roofing': 'Techo resistente a impactos',
      'Polycarbonate Pergola Contractors in South Florida': 'Especialistas en pérgolas de policarbonato en el sur de Florida',
      'We install custom polycarbonate pergolas across Miami-Dade, Broward, and Palm Beach County. Featuring UV-blocking translucent panels and reinforced aluminum framing, these systems provide protection while maintaining natural light. Ideal for patios and pool areas in Boca Raton, Boynton Beach, and Fort Lauderdale, they combine performance, brightness, and modern design.':
        'Instalamos pérgolas de policarbonato a medida en Miami-Dade, Broward y Palm Beach. Llevan paneles translúcidos que frenan los UV sobre estructura de aluminio reforzada: protegen sin quitar la luz natural. Van muy bien en patios y zonas de piscina de Boca Ratón, Boynton Beach y Fort Lauderdale, con prestaciones, luminosidad y un diseño actual.',
      'Polycarbonate Pergola Features': 'Qué trae una pérgola de policarbonato',
      'Bathe your patio in natural light while staying protected from harsh UV rays and rain. Discover the benefits of pairing heavy-duty aluminum framing with advanced, impact-resistant translucent roofing.':
        'Luz natural en el patio y, a la vez, protección frente a los UV y la lluvia. Esto es lo que aporta unir una estructura de aluminio robusta a un techo translúcido resistente a impactos.',
      'UV-Blocking Translucent Panels': 'Paneles translúcidos que frenan los UV',
      'Advanced polycarbonate panels block harmful UV rays while allowing natural daylight to filter through, maintaining brightness without excessive heat exposure.':
        'Los paneles de policarbonato frenan los rayos dañinos y dejan pasar la luz del día, así que el espacio se queda luminoso sin acumular calor.',
      'Thermal Reflective Coating Options': 'Capa térmica reflectante opcional',
      'Upgrade your polycarbonate panels with specialized thermal reflective coatings that further reduce heat transmission, keeping your outdoor area exceptionally cool.':
        'Puede añadir a los paneles una capa térmica reflectante que reduce todavía más el paso del calor y mantiene el exterior mucho más fresco.',
      'Lightweight Structural System': 'Estructura ligera',
      'Engineered for strength without excessive bulk, these pergolas maintain clean lines and modern elegance.':
        'Calculadas para ser resistentes sin resultar pesadas, mantienen unas líneas limpias y actuales.',
      'High-strength panels resist cracking and damage from debris or storms, offering durability without sacrificing visual openness.':
        'Los paneles de alta resistencia no se agrietan ni se dañan con la suciedad ni con las tormentas, y aun así el espacio sigue viéndose abierto.',
      'Custom Tint &amp; Finish Options': 'Tintes y acabados a elegir',
      'Choose from various panel tints and frame colors to match your home’s architecture and outdoor aesthetic.':
        'Elija entre varios tintes de panel y colores de estructura para que todo vaya con su casa y con su exterior.',
      'Aluminum Reinforced Frame': 'Estructura de aluminio reforzada',
      'Powder-coated aluminum framing ensures long-term structural integrity in humid and coastal environments.':
        'La estructura de aluminio con recubrimiento en polvo aguanta a largo plazo en ambiente húmedo y costero.',
      'Browse custom polycarbonate pergola installations that balance natural light with UV protection. See how modern translucent roofing enhances outdoor areas with brightness and durability.':
        'Vea pérgolas de policarbonato ya instaladas, con ese equilibrio entre luz natural y protección UV, y cómo un techo translúcido mejora el exterior en luminosidad y en durabilidad.',
      'Customize your pergola with elegant frame colors and panel tint options that balance brightness, UV protection, and architectural cohesion with your outdoor design.':
        'Configure su pérgola con colores de estructura y tintes de panel que equilibren luz, protección UV y coherencia con el resto del exterior.',
      'Discover how translucent polycarbonate panels provide UV protection while maintaining natural light, combining durability and brightness in one sleek structure.':
        'Vea cómo los paneles translúcidos de policarbonato protegen de los UV sin quitar luz natural, uniendo durabilidad y luminosidad en una estructura de líneas limpias.',
      'Polycarbonate Pergolas FAQs': 'Preguntas sobre pérgolas de policarbonato',
      'Read our FAQs to see how our polycarbonate pergolas block UV rays and provide waterproof protection for South Florida homes.':
        'Así frenan los UV y dejan el patio seco nuestras pérgolas de policarbonato en el sur de Florida.',
      '1. Do polycarbonate roofs block UV?': '1. ¿El policarbonato frena los UV?',
      'Yes. Our advanced polycarbonate roofing panels are UV-treated to block 99% of harmful rays, protecting your skin and outdoor furniture while letting sunlight in.':
        'Sí. Los paneles llevan tratamiento UV y frenan el 99% de los rayos dañinos, protegiendo la piel y los muebles sin dejar el espacio a oscuras.',
      '2. Will the panels turn yellow?': '2. ¿Se ponen amarillos con el tiempo?',
      'No. We use architectural-grade polycarbonate with built-in UV stabilizers, specifically engineered to resist yellowing or clouding under the intense Florida sun.':
        'No. Usamos policarbonato de calidad arquitectónica con estabilizadores UV, formulado para no amarillear ni volverse opaco con el sol de Florida.',
      '3. Can they survive severe storms?': '3. ¿Aguantan una tormenta fuerte?',
      'Yes. Framed with heavy-duty aluminum, these impact-resistant translucent panels are engineered to exceed local wind-load requirements for ultimate storm durability.':
        'Sí. Sobre estructura de aluminio robusta, estos paneles resistentes a impactos se calculan para superar las cargas de viento que exige la normativa local.',
      '4. Do they keep the patio dry?': '4. ¿Dejan el patio seco?',
      'Absolutely. A polycarbonate pergola features a solid, watertight roof and integrated drainage to keep your outdoor lounge completely dry during heavy summer rain.':
        'Sí. El techo es estanco y lleva drenaje integrado, así que la zona de estar se queda seca aunque caiga una tromba de verano.',
      '5. Are the panel tints custom?': '5. ¿El tinte del panel se elige?',
      'Yes! We tailor every polycarbonate pergola to your home, offering custom frame colors and panel tint levels to perfectly match your outdoor aesthetic and shading needs.':
        'Sí. Adaptamos cada pérgola a su casa: color de estructura y nivel de tinte del panel a elegir según la estética y la sombra que necesite.',
    },
  },

  'solar-pergolas': {
    nombre: 'Pérgolas solares',
    title: 'Pérgolas solares | Sur de Florida',
    description: 'Estructuras preparadas para fotovoltaica: refuerzo de carga, cableado oculto y drenaje integrado, con orientación estudiada.',
    dic: {
      // El alt del fondo del CTA propio de esta ficha (scripts/lib/cta-slots.mjs).
      // SIN esta entrada el <img> se queda en ingles en /es/ y no lo dice NADIE:
      // traducibles.mjs solo extrae nodos de texto y comprobar-i18n.mjs no mira
      // atributos, asi que la cobertura seguiria en verde con el alt sin traducir.
      'Solar pergola with a photovoltaic panel roof over an outdoor lounge at a waterfront home in Miami, Florida.':
        'Pérgola solar con techo de paneles fotovoltaicos sobre una zona de estar exterior en una vivienda frente al agua en Miami, Florida.',
      // El alt de la portada del CMS: hasta ahora esa imagen no salia en ninguna
      // pagina, y desde el FAQ a dos columnas la lee el lector de pantalla.
      'Solar roof structure contractors in South Florida designing engineered aluminum structures ready for solar panel integration and shaded outdoor living.':
        'Especialistas en pérgolas solares en el sur de Florida diseñando estructuras de aluminio preparadas para integrar paneles solares y dar sombra al exterior.',
      'Shade That Pays Back': 'Sombra que se paga sola',
      'Concealed Wiring': 'Cableado oculto',
      'Eco-Friendly Luxury': 'Lujo sostenible',
      'Solar Roof Structure Builders in South Florida': 'Constructores de estructuras solares en el sur de Florida',
      'We build solar-ready roof structures designed to integrate photovoltaic systems without compromising strength or aesthetics. Serving Miami-Dade, Broward, and Palm Beach County—including Boca Raton and Palm Beach Gardens—these engineered systems provide shade, weather protection, and long-term energy value.':
        'Construimos estructuras preparadas para llevar fotovoltaica sin perder resistencia ni estética. Trabajamos en Miami-Dade, Broward y Palm Beach —Boca Ratón y Palm Beach Gardens incluidas— con sistemas calculados que dan sombra, protegen del tiempo y aportan valor energético a largo plazo.',
      'Solar Pergola Integration &amp; Features': 'Qué trae una pérgola solar',
      'Shade your outdoor space while generating clean energy for your home. Discover the robust structural engineering and dual-purpose design that makes our solar pergolas a smart, sustainable, and stylish investment.':
        'Sombra en el exterior y energía limpia para la casa. Esta es la ingeniería y el diseño de doble función que convierten a nuestras pérgolas solares en una inversión sensata.',
      'Solar-Ready Structural Engineering': 'Cálculo preparado para solar',
      'Our roof structures are specifically engineered to support photovoltaic solar systems without compromising strength, alignment, or aesthetics. Structural integrity is prioritized from the foundation up.':
        'Nuestras estructuras se calculan para soportar sistemas fotovoltaicos sin ceder en resistencia, en alineación ni en estética. La solidez manda desde la cimentación.',
      'Reinforced Load Capacity': 'Capacidad de carga reforzada',
      'Built with reinforced aluminum framing, these systems are engineered to handle additional panel weight and wind resistance in high-exposure environments.':
        'Con estructura de aluminio reforzada, aguantan el peso extra de los paneles y el viento en zonas muy expuestas.',
      'Integrated Drainage &amp; Roofing Systems': 'Drenaje y cubierta integrados',
      'Advanced drainage channels and precision roofing integration protect your outdoor space from rain intrusion while maintaining a clean architectural finish.':
        'Los canales de drenaje y una cubierta bien resuelta impiden que entre el agua, y el acabado se mantiene limpio.',
      'Integrated Battery Storage Compatibility': 'Compatible con baterías',
      'Designed to seamlessly connect with home battery storage systems, allowing you to store the solar energy generated during the day for evening use or power outages.':
        'Se conecta con los sistemas de baterías domésticos, así que la energía que se genera de día queda guardada para la noche o para un apagón.',
      'Dual-Purpose Design': 'Diseño de doble función',
      'These structures provide shaded outdoor living space while simultaneously supporting renewable energy systems — combining lifestyle enhancement with long-term energy efficiency.':
        'Dan sombra para vivir el exterior y a la vez sostienen la instalación renovable: se gana en confort y en eficiencia a largo plazo.',
      'Custom Design &amp; Orientation': 'Diseño y orientación a medida',
      'Each structure is strategically positioned for both structural efficiency and ideal solar exposure, ensuring maximum performance and visual harmony.':
        'Cada estructura se sitúa buscando a la vez eficiencia estructural y la mejor exposición solar, para que rinda y para que se vea bien.',
      'Explore solar-ready roof structures that combine shaded outdoor living with structural support for integrated energy systems.':
        'Vea estructuras preparadas para solar que dan sombra al exterior y a la vez sostienen la instalación de energía.',
      'Choose structural finishes that align with your home’s design, combining clean modern colors with performance-driven materials built to last.':
        'Elija acabados que vayan con el diseño de su casa, con colores actuales y materiales pensados para durar.',
      'See how solar-ready roof structures combine shaded outdoor living with structural support for integrated energy systems.':
        'Vea cómo una estructura preparada para solar da sombra al exterior y a la vez sostiene la instalación de energía.',
      'Solar Pergolas FAQs': 'Preguntas sobre pérgolas solares',
      'Learn how our solar pergolas combine luxury shade with clean energy in South Florida. Read FAQs on permits and durability.':
        'Así unen sombra y energía limpia nuestras pérgolas solares en el sur de Florida, con lo que hay que saber de permisos y durabilidad.',
      '1. Can a pergola hold solar panels?': '1. ¿Una pérgola puede llevar paneles solares?',
      'Yes. Our dual-purpose solar pergolas create a luxurious shaded patio while structurally supporting a full array of solar panels to generate clean home energy.':
        'Sí. Nuestras pérgolas solares dan un patio con sombra y a la vez sostienen un campo entero de paneles para generar energía limpia.',
      '2. Is the frame strong enough?': '2. ¿La estructura aguanta?',
      'Definitely. We engineer these specific structures with reinforced load-bearing aluminum beams to safely support heavy photovoltaic panels and extreme wind uplift.':
        'Sí. Estas estructuras se calculan con vigas de aluminio reforzadas para soportar el peso de los paneles y la succión del viento.',
      '3. Is the lounge area waterproof?': '3. ¿La zona de estar queda seca?',
      'Yes. Our integrated sub-roofing and concealed drainage systems block rain effectively, ensuring the outdoor living space beneath your solar pergola stays fully dry.':
        'Sí. La subcubierta y el drenaje oculto frenan la lluvia, así que debajo de la pérgola no se moja nada.',
      '4. Do you orient it for max sun?': '4. ¿La orientáis para captar más sol?',
      'Yes. During the custom design phase, we optimize the height, pitch, and placement of your solar pergola to capture maximum south-facing sun exposure for energy gain.':
        'Sí. En el diseño ajustamos altura, inclinación y sitio para captar el máximo de sol hacia el sur.',
      '5. Do you handle all the permits?': '5. ¿Os encargáis de los permisos?',
      'Yes. Building a solar pergola requires structural and electrical permits. Our team manages the entire documentation process for a seamless, code-compliant project.':
        'Sí. Una pérgola solar lleva permiso de estructura y de electricidad. Nos ocupamos de toda la documentación para que el proyecto cumpla y avance sin trabas.',
    },
  },

  sukkha: {
    nombre: 'Sukkha 3000',
    title: 'Sukkha 3000 | Estructuras exteriores de lujo',
    description: 'El sistema Sukkha 3000: ingeniería modular, aluminio de alto rendimiento, diseño minimalista y automatización integrada.',
    dic: {
      // El alt del fondo del CTA propio de esta ficha (scripts/lib/cta-slots.mjs).
      // SIN esta entrada el <img> se queda en ingles en /es/ y no lo dice NADIE:
      // traducibles.mjs solo extrae nodos de texto y comprobar-i18n.mjs no mira
      // atributos, asi que la cobertura seguiria en verde con el alt sin traducir.
      'Sukkha 3000 retractable roof structure with a bamboo reed mat and glazed walls over a set table in Fort Lauderdale, Florida.':
        'Estructura Sukkha 3000 de techo retráctil, con estera de bambú y paredes acristaladas, sobre una mesa puesta en Fort Lauderdale, Florida.',
      // El alt de la portada del CMS: hasta ahora esa imagen no salia en ninguna
      // pagina, y desde el FAQ a dos columnas la lee el lector de pantalla.
      'Sukkha 3000 outdoor structure builders in South Florida delivering advanced engineered pergola systems with automation and modern architectural design.':
        'Constructores de estructuras Sukkha 3000 en el sur de Florida con sistemas de pérgola avanzados, automatizados y de diseño actual.',
      'Bespoke Luxury Design': 'Diseño de lujo a medida',
      'Category 5 Reinforced': 'Reforzada para categoría 5',
      'Smart-Home Automated': 'Automatizada con domótica',
      'Sukkha System Installers in South Florida': 'Instaladores del sistema Sukkha en el sur de Florida',
      'Pergola Plus installs the advanced Sukkha 3000 system across South Florida. This next-generation architectural structure combines modern design, automation, and superior engineering to create high-performance outdoor environments. Serving Fort Lauderdale, Delray Beach, Weston, and surrounding areas, we deliver premium solutions tailored to luxury residential properties.':
        'Pergola Plus instala el sistema Sukkha 3000 por todo el sur de Florida. Es una estructura de nueva generación que une diseño actual, automatización e ingeniería para crear exteriores de altas prestaciones. Trabajamos en Fort Lauderdale, Delray Beach, Weston y alrededores, con soluciones a medida para viviendas de alto nivel.',
      'Sukkha System Features': 'Qué trae el sistema Sukkha',
      'The absolute pinnacle of luxury outdoor architecture. Explore the advanced modular engineering, minimalist design, and smart automation capabilities that define the exclusive Sukkha 3000 structure.':
        'Lo más alto en arquitectura exterior de lujo. Esta es la ingeniería modular, el diseño minimalista y la automatización que definen al Sukkha 3000.',
      'Integrated Automation Technology': 'Automatización integrada',
      'Designed for seamless automation integration, this system supports motorized features, lighting systems, and advanced controls for a fully customized outdoor experience.':
        'Preparado para integrarse con la domótica, admite elementos motorizados, iluminación y controles avanzados para una experiencia hecha a su medida.',
      'High-Performance Aluminum Construction': 'Aluminio de altas prestaciones',
      'Constructed from premium-grade aluminum, the Sukkha 3000 is engineered to resist corrosion, structural fatigue, and environmental stress common in South Florida climates.':
        'Fabricado en aluminio de primera calidad, el Sukkha 3000 está calculado para resistir la corrosión, la fatiga estructural y el desgaste propio del clima del sur de Florida.',
      'Custom Configuration Capabilities': 'Configuración a medida',
      'Fully customizable in layout, size, finish, and integrated features, the Sukkha 3000 adapts to complex outdoor designs with precision.':
        'Distribución, tamaño, acabado y prestaciones se configuran por completo, así que el Sukkha 3000 se adapta con precisión a diseños exigentes.',
      'Architectural Minimalist Design': 'Diseño minimalista',
      'Its sleek structural profiles and refined finishes create a bold, modern statement that enhances high-end residential properties.':
        'Sus perfiles esbeltos y sus acabados cuidados marcan carácter y elevan las viviendas de alto nivel.',
      'Architectural Fascia Enhancements': 'Frentes arquitectónicos',
      'Enhance the visual impact of your structure with premium, customizable fascia wrap options that conceal hardware and elevate the modern, minimalist profile.':
        'Los frentes envolventes, configurables, esconden los herrajes y refuerzan el perfil minimalista de la estructura.',
      'Advanced Modular Engineering': 'Ingeniería modular avanzada',
      'The Sukkha 3000 is engineered with precision modular components that deliver superior strength, stability, and architectural flexibility — redefining modern outdoor structures.':
        'El Sukkha 3000 se construye con módulos de precisión que aportan resistencia, estabilidad y libertad arquitectónica, y redefinen lo que puede ser una estructura exterior.',
      'View Sukkha 3000 installations showcasing advanced engineering, minimalist design, and next-generation outdoor living performance.':
        'Vea instalaciones del Sukkha 3000, con su ingeniería, su diseño minimalista y sus prestaciones de nueva generación.',
      'The Sukkha 3000 offers a refined selection of architectural colors and textures, allowing complete customization while preserving its minimalist, high-end aesthetic.':
        'El Sukkha 3000 ofrece una selección cuidada de colores y texturas para personalizarlo por completo sin perder su estética minimalista.',
      'Sukkha Luxury Outdoor Structures - FAQ': 'Preguntas sobre el Sukkha 3000',
      'Discover the Sukkha 3000. Read FAQs on Pergola Plus Florida&#x27;s ultimate luxury, hurricane-proof architectural outdoor structure.':
        'Todo sobre el Sukkha 3000, la estructura exterior más alta de gama de Pergola Plus Florida, preparada para huracanes.',
      '1. What makes Sukkha 3000 unique?': '1. ¿Qué tiene de distinto el Sukkha 3000?',
      'The Sukkha 3000 is the pinnacle of luxury outdoor architecture, featuring proprietary modular engineering and minimalist design built specifically for high-end estates.':
        'Es lo más alto en arquitectura exterior de lujo: ingeniería modular propia y diseño minimalista, pensados para propiedades de alto nivel.',
      '2. Is the design customizable?': '2. ¿Se puede personalizar?',
      'Yes. Completely bespoke, the Sukkha 3000 offers custom dimensions, premium architectural finishes, and specialized fascia to complement your luxury property perfectly.':
        'Sí, por completo: dimensiones a medida, acabados de calidad y frentes específicos para que encaje con su propiedad.',
      '3. Can it withstand hurricanes?': '3. ¿Aguanta un huracán?',
      'Absolutely. Crafted from hyper-reinforced, marine-grade aluminum, the Sukkha 3000 is heavily engineered to surpass coastal building codes and endure extreme weather.':
        'Sí. En aluminio de grado marino muy reforzado, está calculado para superar la normativa de costa y aguantar tiempo extremo.',
      '4. Does it support smart home tech?': '4. ¿Admite domótica?',
      'Yes. The structure seamlessly hides motorized screen mechanisms, weather sensors, LED arrays, and AV equipment, delivering the ultimate automated luxury experience.':
        'Sí. La estructura esconde los mecanismos de las cortinas motorizadas, los sensores de clima, las tiras LED y el equipo audiovisual.',
      '5. Is it a permanent structure?': '5. ¿Es una estructura permanente?',
      'Yes. The Sukkha 3000 is a permanent, professionally engineered architectural addition that drastically increases real estate value and functional luxury for your home.':
        'Sí. El Sukkha 3000 es una ampliación arquitectónica permanente y calculada, que aumenta mucho el valor de la vivienda.',
    },
  },
};
