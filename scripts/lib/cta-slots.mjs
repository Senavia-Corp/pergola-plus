/**
 * Los 17 bloques variables del prompt del fondo de CTA, uno por producto y servicio.
 *
 * El ESQUELETO del prompt (camara, composicion, luz, realismo) es identico para los
 * 17 y vive en scripts/preparar-cta.mjs. Aqui solo va lo que cambia de una pagina a
 * otra, que es lo unico que garantiza que el fondo enseñe EL PRODUCTO QUE ESA PAGINA
 * VENDE y no una pergola bonita cualquiera.
 *
 * ───────────────────────────────────────────────────────────────────────────────
 * ESTO SE ESCRIBIO MIRANDO LAS FOTOS, NO DE MEMORIA.
 *
 * Se generaron hojas de contactos con las 9 mejores fotos de cada slug y se
 * describio el acabado, el perfil, el sistema de techo y los herrajes que se VEN.
 * La tabla del encargo fue el punto de partida y se corrigio en cinco slugs:
 *
 *   deck-builders  el encargo pedia «luz LED en las contrahuellas». No hay LED en
 *                  ninguna de las 7 fotos. Lo que si distingue a este servicio es la
 *                  BARANDILLA DE CABLE horizontal negra sobre tarima gris a niveles.
 *   sukkha         el encargo decia «estructura de lamas». No lo es: es un techo
 *                  RETRACTIL con una estera de bambu (s'chach) a la vista y paredes
 *                  acristaladas. Ver ademas AVISO_REFERENCIAS.
 *   fence-solutions  «valla de aluminio de lamas» se queda corto: son lamas
 *                  HORIZONTALES planas con hueco regular, y eso es lo que hay que
 *                  pedir para que no salga una valla de barrotes.
 *   carports       el encargo solo pedia «cubierta con coche debajo». La firma real
 *                  es el sofito de VETA DE MADERA calida bajo un marco grafito, con
 *                  celosia de listones a juego.
 *   concrete       «losa acabada» es correcto, pero 3 de las 7 fotos son de obra
 *                  (ferralla y encofrado). Ver EXCLUIR.
 *
 * ───────────────────────────────────────────────────────────────────────────────
 * ESCENARIO: LA CIUDAD SALE DEL TEXTO DEL FRAGMENTO, NO DEL NOMBRE DEL ARCHIVO.
 *
 * El plan inicial era sacarla de los nombres de las fotos. Medido: de las ~180 fotos
 * de los 17 slugs solo UNA menciona una ciudad
 * (`intro-luxury-stone-driveway-palm-beach-project.avif`); el resto dice
 * «south-florida» a secas. La copia del CMS si nombra las ciudades que cada ficha
 * sirve, y de ahi sale cada `escenario`. Dos ciudades se repiten entre los 17: hay 7
 * distintas en el bloque compartido de los servicios y no dan para mas.
 */

/**
 * Fotos que la metrica puntua alto pero que NO sirven de referencia.
 *
 * La nitidez y la resolucion no ven que una foto sea de obra a medio hacer, un plano
 * detalle del techo desde abajo o una escena de noche. Son exclusiones NOMBRADAS y no
 * un filtro por rol (`gallery-`, `swatch-`...): se probo, y habria tirado fotos buenas
 * —`swatch-*` no son muestras de color, son fotografias completas de instalaciones— y
 * dejado pasar las de obra, que se llaman `feature-` como las demas.
 *
 * `preparar-cta.mjs` imprime cada exclusion en cada ejecucion. Una exclusion silenciosa
 * es una exclusion que nadie revisa.
 */
export const EXCLUIR = {
  'solar-pergolas': {
    // 4 de las 9 mejores son escenas nocturnas con luna y tiras de LED. El prompt pide
    // luz de media mañana: una referencia de noche empuja justo a lo contrario.
    fotos: [
      'gallery-solar-roof-structure-contractors-south-florida-09.avif',
      'gallery-solar-roof-structure-contractors-south-florida-03.avif',
      'gallery-solar-roof-structure-contractors-south-florida-06.avif',
      'intro-solar-roof-structure-contractors-south-florida.avif',
    ],
    motivo: 'escenas nocturnas (luna, estrellas, tiras de LED)',
  },
  concrete: {
    fotos: [
      'cover-structural-concrete-patio-foundation-florida-project.avif',
      'feature-structural-concrete-services-for-patios-in-south-florida-1.avif',
      'feature-structural-concrete-services-for-patios-in-south-florida-2.avif',
      'feature-structural-concrete-services-for-patios-in-south-florida-5.avif',
    ],
    motivo: 'obra a medio hacer (ferralla, encofrado, arena) y una de atardecer que ademas'
      + ' es una pergola sobre travertino, no una losa de hormigon',
  },
  'deck-builders': {
    fotos: [
      'feature-deck-builders-contractors-in-south-florida-1.avif',
      'feature-deck-builders-contractors-in-south-florida-5.avif',
    ],
    motivo: 'obra a medio hacer: rastreles sobre arena, sin tarima',
  },
  'fence-solutions': {
    fotos: ['feature-fence-installation-contractors-south-florida-2.avif'],
    motivo: 'obra a medio hacer: un solo panel sobre hormigon fresco',
  },
  'patio-remodeling': {
    fotos: ['feature-patio-remodeling-design-contractors-south-florida-3.avif'],
    motivo: 'obra a medio hacer: ferralla y material apilado',
  },
  pavers: {
    fotos: ['feature-custom-paver-design-installation-florida-1.avif'],
    motivo: 'obra a medio hacer: cama de arena, grava y palets de adoquin sin colocar',
  },
  driveways: {
    fotos: ['feature-luxury-driveway-installation-in-south-florida-1.avif'],
    motivo: 'obra a medio hacer: subbase de grava con geomalla, sin adoquin',
  },
  'pergola-design-construction': {
    fotos: ['cover-polycarbonate-pergola-contractors-south-florida-06.avif'],
    motivo: 'es el producto de polycarbonate-pergolas prestado a esta carpeta, y ademas'
      + ' es un patio cerrado sin profundidad al fondo',
  },
  sukkha: {
    fotos: [
      'gallery-sukkha-3000-outdoor-structure-builders-south-florida-7.avif',
      'gallery-sukkha-3000-outdoor-structure-builders-south-florida-3.avif',
    ],
    motivo: 'plano detalle del techo desde abajo: no se ve la estructura entera',
  },
  'screen-enclosures': {
    fotos: ['gallery-screen-enclosure-contractors-south-florida-03.avif'],
    motivo: 'vista aerea desde el tejado: no es el punto de vista de una persona',
  },
};

/**
 * Slugs cuyas referencias NO valen como guia de hora del dia.
 *
 * La linea que acompaña a las referencias dice por defecto «match the product,
 * materials, finish, proportions AND DAYLIGHT». En estos slugs las mejores fotos del
 * producto son de atardecer, de noche o renders, asi que pedir que copie la luz es
 * pedir exactamente lo que el prompt prohibe. Para ellos la linea cambia: se copia el
 * PRODUCTO y se ignora la hora.
 */
export const AVISO_REFERENCIAS = {
  'solar-pergolas':
    'The references are 3D renders, not photographs. Take the PANEL LAYOUT and the '
    + 'frame proportions from them and nothing else: your image must be a real '
    + 'photograph in late-morning sun.',
  'patio-remodeling':
    'Most references are shot at dusk with the interior lights on. Take the LAYOUT '
    + 'and the materials from them and ignore their time of day: your image is late '
    + 'morning, in full sun, with no lit windows.',
  cabanas:
    'Several references are golden-hour. Take the CURTAINS, the frame and the '
    + 'furniture from them and ignore their time of day: your image is late morning.',
  sukkha:
    'The references were shot in a temperate climate (bare pavers, deciduous trees, '
    + 'overcast sky). Take ONLY the structure from them — frame, retractable roof, '
    + 'bamboo mat, glazed walls. The setting comes from this prompt, not from them.',
};

/**
 * Los cuatro slots variables + el `alt` del <img>, por slug.
 *
 * `alt` se escribe aqui y no en transformar.mjs porque es el mismo dato: describe la
 * misma imagen que describe el prompt. Su traduccion al español va en
 * src/i18n/{productos,servicios}.es.ts — un `alt` sin entrada ahi se queda en ingles
 * en /es/ y NINGUNA puerta lo dice (traducibles.mjs solo extrae nodos de texto).
 */
export const CTA_SLOTS = {
  // ── Productos ────────────────────────────────────────────────────────────────
  'motorized-louvered-pergolas': {
    producto: 'a free-standing motorized louvered-roof aluminum pergola',
    escenario: 'Palm Beach Gardens, Florida',
    detalle:
      'A slim graphite-bronze aluminum frame — square posts, a deep flat fascia beam, '
      + 'concealed gutters inside the posts — carrying a roof of WHITE aluminum louver '
      + 'blades. The louvers are rotated roughly half open, so clean bands of blue sky '
      + 'show between them and the sun lays a crisp striped shadow across the deck '
      + 'below. Every blade is the same width and dead straight, evenly spaced, with a '
      + 'low-profile motor housing at one end of the beam.',
    izquierda:
      'a clipped ficus hedge and a potted bird-of-paradise, in shade but open and '
      + 'luminous',
    derecha:
      'the corner of the pool with two teak-and-white loungers, and royal palms behind',
    alt:
      'Motorized louvered roof pergola with white aluminum louvers open over a poolside '
      + 'deck at a waterfront home in Palm Beach Gardens, Florida.',
  },

  'solid-roof-pergolas': {
    producto: 'an attached solid insulated-roof aluminum pergola',
    escenario: 'Jupiter, Florida',
    detalle:
      'A dark graphite aluminum frame carrying a SOLID insulated panel roof — no gaps, '
      + 'no louvers, no sky whatsoever through the roof. Seen from below the soffit is a '
      + 'continuous WARM TEAK-LOOK WOOD-GRAIN lining with flush recessed LED downlights '
      + 'and one black ceiling fan. The outer fascia is a single dead-straight graphite '
      + 'band. One side bay is closed by a fixed horizontal louver privacy screen in the '
      + 'same dark finish.',
    izquierda:
      'an outdoor kitchen run in stone with a stainless grill, under the roof',
    derecha:
      'the seawall and a moored boat on the Intracoastal, with palms above',
    alt:
      'Solid insulated roof pergola with a warm wood-grain soffit and recessed lighting '
      + 'over a waterfront outdoor kitchen in Jupiter, Florida.',
  },

  'open-air-pergolas': {
    producto: 'a free-standing open-air aluminum pergola',
    escenario: 'Parkland, Florida',
    detalle:
      'A WHITE aluminum pergola with a fully OPEN rafter grid: deep top rafters running '
      + 'one way across wider cross beams, with generous gaps so the blue sky and a '
      + 'passing cloud read clearly between every member. There is no panel, no louver '
      + 'blade and nothing solid overhead — the grid throws a ladder of shadow on the '
      + 'ground. One end bay is closed by a white horizontal-slat privacy screen.',
    izquierda:
      'a white horizontal-slat privacy screen and a low fire table',
    derecha:
      'clipped hedging and a stretch of lawn running to the water',
    alt:
      'Open-air white aluminum pergola with an open rafter grid and visible sky above a '
      + 'paver patio in Parkland, Florida.',
  },

  'polycarbonate-pergolas': {
    producto: 'an attached polycarbonate-roof aluminum pergola',
    escenario: 'Boynton Beach, Florida',
    detalle:
      'A dark bronze aluminum frame whose roof is TRANSLUCENT frosted polycarbonate '
      + 'sheeting laid over the rafters. From below the panels glow milky white, the '
      + 'rafters read as soft dark lines through them, and the light that reaches the '
      + 'floor is diffuse and shadowless rather than hard-edged — the whole covered area '
      + 'sits in an even, bright, slightly cool light. A fixed horizontal louver wall in '
      + 'the same bronze closes one side.',
    izquierda:
      'a bronze horizontal louver privacy wall with planting at its foot',
    derecha:
      'a travertine deck edge, then lawn and palms toward the water',
    alt:
      'Polycarbonate roof pergola with translucent panels casting soft diffuse light over '
      + 'a patio in Boynton Beach, Florida.',
  },

  'solar-pergolas': {
    producto: 'a free-standing solar-roof aluminum pergola',
    escenario: 'Miami, Florida',
    detalle:
      'A slim dark aluminum frame on slender square posts carrying a roof made entirely '
      + 'of framed PHOTOVOLTAIC PANELS — deep blue-black cells in a clearly visible '
      + 'rectangular grid, set in silver frames laid edge to edge with a thin shadow line '
      + 'between panels. The array tilts very slightly toward the sun and catches a hard '
      + 'specular highlight along one edge. Every frame line and every cell row is dead '
      + 'straight.',
    izquierda:
      'a lounge group in woven rattan under the array, in open shade',
    derecha:
      'clipped hedge, a strip of lawn and the seawall beyond',
    alt:
      'Solar pergola with a photovoltaic panel roof over an outdoor lounge at a waterfront '
      + 'home in Miami, Florida.',
  },

  'motorized-screens': {
    producto: 'a covered patio closed by motorized retractable screens',
    escenario: 'Wellington, Florida',
    detalle:
      'A dark bronze aluminum structure whose openings are closed by RETRACTABLE BRONZE '
      + 'MESH SCREENS running in side tracks, lowered most of the way down. The mesh '
      + 'reads as a taut, evenly tensioned dark scrim you can see straight through to the '
      + 'pool and garden beyond — never opaque, never sagging. The aluminum cassette '
      + 'housings that the screens roll into are clearly visible along the top beam, and '
      + 'the side tracks run dead straight down each post.',
    izquierda:
      'a woven lounge set inside the screened bay, in open shade',
    derecha:
      'the screen track and post, and past it the pool deck and palms',
    alt:
      'Motorized retractable bronze screens lowered across a covered patio overlooking a '
      + 'pool in Wellington, Florida.',
  },

  'screen-enclosures': {
    producto: 'a large-span aluminum pool screen enclosure',
    escenario: 'Coral Springs, Florida',
    detalle:
      'A full pool cage over a swimming pool: a dark bronze aluminum framework with a '
      + 'high gabled roof, slim uprights and long straight spans, filled with large '
      + 'rectangular panels of CHARCOAL INSECT MESH. The mesh is taut and even, and the '
      + 'lawn, the lake and the palms beyond read clearly straight through it. The pool '
      + 'and its travertine deck sit inside the cage.',
    izquierda:
      'the screened gable and a corner upright, with loungers on the deck',
    derecha:
      'more screen bays and, through them, the lake edge and palms',
    alt:
      'Aluminum pool screen enclosure with charcoal mesh over a swimming pool and lake view '
      + 'in Coral Springs, Florida.',
  },

  carports: {
    producto: 'a cantilevered aluminum carport',
    escenario: 'Plantation, Florida',
    detalle:
      'A dark graphite aluminum carport with a flat cantilevered roof over a paver '
      + 'driveway. The outer fascia is a deep straight graphite band, and the underside is '
      + 'a WARM WOOD-GRAIN soffit with flush recessed downlights. One side is closed by a '
      + 'matching horizontal WOOD-SLAT screen with even gaps between the slats. A single '
      + 'parked car sits underneath, fully inside the structure.',
    izquierda:
      'the wood-slat side screen and a tall planter',
    derecha:
      'the driveway running out to clipped hedging and the street palms',
    alt:
      'Aluminum carport with a warm wood-grain soffit and slatted side screen over a paver '
      + 'driveway in Plantation, Florida.',
  },

  cabanas: {
    producto: 'a free-standing poolside aluminum cabana',
    escenario: 'Weston, Florida',
    detalle:
      'A free-standing dark aluminum cabana on the pool deck: a square graphite frame '
      + 'with a louvered roof, WHITE CURTAINS hung from rods along each open side and '
      + 'drawn back at the corners, lifting slightly in the breeze. Inside sits a low '
      + 'lounge group — a deep daybed or sofa with pale cushions and a low table. The '
      + 'curtain rods and frame members are dead straight.',
    izquierda:
      'the pool edge with its coping and still water',
    derecha:
      'a drawn white curtain, planting and palms behind it',
    alt:
      'Free-standing aluminum poolside cabana with white curtains and a lounge daybed in '
      + 'Weston, Florida.',
  },

  sukkha: {
    producto: 'an attached Sukkha 3000 retractable-roof structure',
    escenario: 'Fort Lauderdale, Florida',
    detalle:
      'A dark bronze aluminum structure attached to the house, with a RETRACTABLE roof '
      + 'that carries a natural BAMBOO REED MAT (s\'chach) clearly visible from below '
      + 'between the roof beams, partly rolled back so a band of open sky shows along one '
      + 'side. The side walls are large clear glazed panels in slim dark frames, and warm '
      + 'LED strips run along the underside of the beams. A long table is laid for a meal '
      + 'underneath.',
    izquierda:
      'the glazed side wall and the house elevation behind it',
    derecha:
      'the open end of the structure, planting and the lawn beyond',
    alt:
      'Sukkha 3000 retractable roof structure with a bamboo reed mat and glazed walls over a '
      + 'set table in Fort Lauderdale, Florida.',
  },

  // ── Servicios ────────────────────────────────────────────────────────────────
  'pergola-design-construction': {
    producto: 'a custom engineered aluminum louvered pergola built into the house',
    escenario: 'West Palm Beach, Florida',
    detalle:
      'A dark graphite aluminum louvered pergola designed as part of the building rather '
      + 'than added to it: its beam heights line up with the house fascia, its posts land '
      + 'on the terrace grid, and it runs the full width of the rear elevation of a '
      + 'contemporary white house with floor-to-ceiling glazing. Louvered roof, part open. '
      + 'An outdoor kitchen and a lounge group sit underneath.',
    izquierda:
      'the white house elevation with its glazing and the kitchen run',
    derecha:
      'the pool, the seawall and a moored boat beyond',
    alt:
      'Custom engineered aluminum louvered pergola integrated into a contemporary waterfront '
      + 'home in West Palm Beach, Florida.',
  },

  'patio-remodeling': {
    producto: 'a completely remodelled rear patio',
    escenario: 'Delray Beach, Florida',
    detalle:
      'A whole finished outdoor room, not a single product: large-format pale grey paver '
      + 'flooring laid to a clean grid, a dark aluminum louvered pergola over one half, an '
      + 'outdoor kitchen with a stone island and a stainless hood, and a full lounge and '
      + 'dining set. Everything reads as one deliberate remodel of the entire back of the '
      + 'house — matching materials, aligned edges, no leftovers from a previous patio.',
    izquierda:
      'the outdoor kitchen island and its hood under the pergola',
    derecha:
      'the pool and the planted bed running to the water',
    alt:
      'Fully remodelled patio with large-format pavers, a louvered pergola and an outdoor '
      + 'kitchen in Delray Beach, Florida.',
  },

  pavers: {
    producto: 'a newly laid large-format paver patio',
    escenario: 'Boca Raton, Florida',
    detalle:
      'A freshly installed paver patio in large pale grey and off-white porcelain-look '
      + 'slabs, laid in a mixed running bond with TIGHT, PERFECTLY UNIFORM JOINTS and '
      + 'razor-sharp cut edges against the planting beds. A dark linear trench drain runs '
      + 'as a straight line across the field. The paving itself is the subject: it fills '
      + 'the foreground and runs away toward the house.',
    izquierda:
      'a planted bed with agaves and a low kerb of the same stone',
    derecha:
      'the pool coping and loungers on the far side of the paving',
    alt:
      'Newly installed large-format paver patio with tight uniform joints and a linear drain '
      + 'in Boca Raton, Florida.',
  },

  driveways: {
    producto: 'a paver driveway sweeping up to the house',
    escenario: 'Palm Beach, Florida',
    detalle:
      'A wide paver driveway in grey stone laid in a HERRINGBONE field with a contrasting '
      + 'soldier-course border following its curved edge, sweeping from the foreground up '
      + 'to the entrance of a large white Florida house. The lawn is cut in a clean arc '
      + 'against the border. Joints are uniform, the courses run true, and the driveway '
      + 'itself is the subject and fills the lower half of the frame.',
    izquierda:
      'the curved lawn edge and its soldier-course border, with royal palms',
    derecha:
      'planting beds and the garage wing of the house',
    alt:
      'Herringbone paver driveway with a soldier-course border sweeping up to a luxury home '
      + 'in Palm Beach, Florida.',
  },

  concrete: {
    producto: 'a finished structural concrete patio slab',
    escenario: 'Pompano Beach, Florida',
    detalle:
      'A COMPLETED structural concrete patio — no formwork, no rebar, no construction '
      + 'material anywhere in frame. Large poured bays of smooth trowelled light-grey '
      + 'concrete are separated by dead-straight saw-cut joints running the length of the '
      + 'slab, with a clean square edge where the slab meets the planting bed and a dark '
      + 'linear trench drain along the house. The surface is uniform and lightly mottled, '
      + 'the way real cured concrete is.',
    izquierda:
      'the planted bed and the square slab edge running toward the camera',
    derecha:
      'the trench drain, the house wall and its sliding glazing',
    alt:
      'Finished structural concrete patio slab with saw-cut joints and a clean square edge in '
      + 'Pompano Beach, Florida.',
  },

  'deck-builders': {
    producto: 'a multi-level composite deck',
    escenario: 'West Palm Beach, Florida',
    detalle:
      'A multi-level deck in GREY COMPOSITE BOARDS — wide planks with a subtle multi-tone '
      + 'grain, running in clean parallel lines and stepping down through two or three '
      + 'levels with broad low treads. The railing is BLACK HORIZONTAL CABLE on slim dark '
      + 'posts with a flat top rail, so it reads as thin taut lines that barely interrupt '
      + 'the view. Boards are evenly gapped and the level edges are dead straight.',
    izquierda:
      'the stepped deck levels and the black cable railing',
    derecha:
      'lush planting and palms dropping away past the rail',
    alt:
      'Multi-level grey composite deck with black horizontal cable railing at a home in West '
      + 'Palm Beach, Florida.',
  },

  'fence-solutions': {
    producto: 'a horizontal-slat aluminum fence',
    escenario: 'Boca Raton, Florida',
    detalle:
      'A dark bronze-black aluminum fence built from FLAT HORIZONTAL SLATS with an even '
      + 'gap between each one — not pickets, not vertical bars. The top rail is dead level '
      + 'along its whole run, every post is plumb, and the slat gaps line up from panel to '
      + 'panel. It runs along the property edge past planting, with the house behind it.',
    izquierda:
      'the fence running away from the camera past a planted bed',
    derecha:
      'clipped lawn and the white house elevation behind the fence line',
    alt:
      'Dark aluminum horizontal-slat privacy fence running along a landscaped property edge in '
      + 'Boca Raton, Florida.',
  },
};
