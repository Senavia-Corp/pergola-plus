/**
 * Los rotulos del estimador, uno por idioma.
 *
 * Aqui NO hay ni un precio. Las tarifas viven una sola vez en src/data/estimador.ts,
 * porque un numero duplicado por idioma es un numero que un dia dira dos cosas
 * distintas. La bisagra entre las dos mitades es el `id`.
 *
 * La interfaz es lo que obliga a la paridad: olvidar una traduccion aqui es un error
 * de compilacion, no un aviso en consola que nadie lee. Es la unica parte del sitio
 * con esa garantia — el resto de paginas traduce sustituyendo nodos de texto sobre
 * el HTML migrado, y ahi un olvido solo deja un `console.warn`.
 *
 * OJO con check:i18n. Mide cobertura por pagina contra una lista de palabras
 * funcionales inglesas (the|and|with|your|our|for|from|that|this|are|will|have|
 * which|you) y exige el 98%. Los nombres de producto se quedan en ingles a
 * proposito —son de catalogo— pero ninguno lleva una de esas palabras. Al anadir
 * rotulos en español, comprobarlo.
 */

export interface OpcionTexto {
  nombre: string;
  nota: string;
}

export interface TextosEstimador {
  h1: string;
  entradilla: string;

  // --- navegacion del stepper ---
  atras: string;
  siguiente: string;
  /** `{n}` y `{total}` se sustituyen en el navegador. */
  dePaso: string;
  /** El enlace de escape: no lo se, confirmadlo en la visita. */
  noSeguro: string;

  // --- paso 1 · que quieres que haga ---
  paso1: string;
  ayuda1: string;
  /** Rotulado por RESULTADO, no por producto: el nombre de catalogo va debajo. */
  productos: Record<string, OpcionTexto>;
  desde: string;
  porPie: string;
  aMedidaEtiqueta: string;

  // --- paso 2 · montaje ---
  paso2: string;
  ayuda2: string;
  montaje: Record<string, OpcionTexto>;

  // --- paso 3 · tamano ---
  paso3: string;
  ayuda3: string;
  presets: Record<string, OpcionTexto>;
  aMedida: string;
  ancho: string;
  largo: string;
  pies2: string;

  // --- paso 4 · que hay en el suelo ---
  paso4: string;
  ayuda4: string;
  suelo: Record<string, OpcionTexto>;
  baseTitulo: string;
  baseAyuda: string;
  base: Record<string, OpcionTexto>;

  // --- paso 5 · que va debajo ---
  paso5: string;
  ayuda5: string;
  mejoras: Record<string, OpcionTexto>;
  enLaVisita: string;

  // --- paso 6 · el sitio ---
  paso6: string;
  ayuda6: string;
  zip: string;
  zipAyuda: string;
  agua: string;
  aguaAyuda: string;
  hoa: string;
  hoaAyuda: string;
  si: string;
  no: string;
  noLoSe: string;

  // --- paso 7 · el espejo ---
  paso7: string;
  ayuda7: string;
  espejo: Record<string, OpcionTexto>;
  palancasTitulo: string;

  // --- paso 8 · el cierre ---
  paso8: string;
  ayuda8: string;
  nombre: string;
  email: string;
  telefono: string;
  sms: string;
  enviar: string;
  tranquilidad: string;
  exitoH2: string;
  exitoP: string;
  exitoCta: string;

  // --- el panel ---
  confirmado: string;
  porDefinir: string;
  resultado: string;
  legalFuerte: string;
  legalAntes: string;
  legalEnlace: string;
  legalDespues: string;

  // --- sin JS ---
  noscriptH2: string;
  thEstructura: string;
  thTarifa: string;
  thAdicion: string;
  thCoste: string;
  noscriptPie: string;
  noscriptEnlace: string;
  noscriptFin: string;

  // --- cierre de pagina ---
  cierreH2: string;
  cierreP: string;
  cierreA: string;
  cierreB: string;
  altCierre: string;

  /**
   * Lo que pinta el navegador. Los `{...}` se sustituyen con replaceAll: si algun
   * rotulo repite un placeholder, las dos apariciones tienen que cambiar.
   */
  cliente: {
    pideMedidas: string;
    recorte: string;
    pies: string;
    pies2: string;
    instalados: string;
    dePaso: string;
    estrecha: string;
    cerrado: string;
    soloCotizacion: string;
    enLaVisita: string;
    partidaEstructura: string;
    partidaBase: string;
    partidaIngenieria: string;
    partidaAgua: string;
    partidaMejoras: string;
    enviando: string;
  };
}

// La misma foto en las dos paginas, y su alt describe la foto, no la pagina: se
// queda en ingles a proposito.
const ALT_CIERRE =
  'Luxury outdoor living in South Florida featuring a custom pool, modern pergola with'
  + ' outdoor kitchen, tropical landscaping, and elegant patio design for high-end'
  + ' residential properties.';

export const ESTIMADOR_EN: TextosEstimador = {
  h1: 'Project Estimator',
  entradilla:
    'Answer a few questions about your yard and watch the range narrow as you go.'
    + ' Built on our published 2026 installed rates for Miami-Dade, Broward, and Palm'
    + ' Beach County.',

  atras: 'Back',
  siguiente: 'Next',
  dePaso: 'Step {n} of {total}',
  noSeguro: 'Not sure — confirm it on the site visit',

  paso1: '1 · What do you want it to do?',
  ayuda1: 'Pick the outcome you are after. We will match it to the right structure.',
  productos: {
    'open-air': {
      nombre: 'Shade, but open and breezy',
      nota: 'Open-Air Aluminum Pergola',
    },
    insulated: {
      nombre: 'Full rain protection, cool underneath',
      nota: 'Insulated Solid Roof Pergola',
    },
    polycarbonate: {
      nombre: 'Let the light through, keep the water out',
      nota: 'Polycarbonate Pergola',
    },
    louvered: {
      nombre: 'Open or close the roof whenever I want',
      nota: 'Motorized Louvered Roof',
    },
    cabana: {
      nombre: 'A free-standing structure by the pool',
      nota: 'Aluminum Cabana',
    },
    screens: {
      nombre: 'Keep the mosquitoes out',
      nota: 'Screen Enclosure',
    },
    carport: {
      nombre: 'Cover the car or the boat',
      nota: 'Aluminum Carport',
    },
    solar: {
      nombre: 'Generate power while it shades',
      nota: 'Solar Pergola',
    },
    sukkha: {
      nombre: 'A Sukkha 3000 system',
      nota: 'Sukkha 3000',
    },
  },
  desde: 'from',
  porPie: 'per sq ft installed',
  aMedidaEtiqueta: 'Priced on request',

  paso2: '2 · How does it sit?',
  ayuda2: 'Attached costs less: it rests on a ledger and needs two posts instead of four.',
  montaje: {
    adosada: { nombre: 'Attached to the house', nota: 'Rests on a ledger board along the wall.' },
    exenta: { nombre: 'Free-standing', nota: 'Four to six posts, each with its own footing.' },
  },

  paso3: '3 · How big?',
  ayuda3: 'Most South Florida patios land in the middle. You can fine-tune it below.',
  presets: {
    intimo: { nombre: 'Intimate', nota: '12 × 14 ft · seats six for dinner' },
    popular: { nombre: 'Popular', nota: '16 × 20 ft · lounge plus dining' },
    grande: { nombre: 'Large', nota: '20 × 24 ft · a full outdoor room' },
  },
  aMedida: 'Custom size',
  ancho: 'Width (ft)',
  largo: 'Length (ft)',
  pies2: 'sq ft',

  paso4: '4 · What is on the ground today?',
  ayuda4:
    'A pergola cannot be anchored to grass. This is usually the single biggest line'
    + ' item, so it is worth getting right.',
  suelo: {
    'losa-ok': { nombre: 'A concrete slab in good shape', nota: 'We anchor straight into it.' },
    'pavers-ok': { nombre: 'Existing pavers', nota: 'We lift what we need and reset it.' },
    cesped: { nombre: 'Grass, dirt or sand', nota: 'A new base is part of the job.' },
    'deck-madera': { nombre: 'A wood deck', nota: 'We check whether it can carry the load.' },
    'no-se': { nombre: 'I am not sure', nota: 'We confirm it on the site visit.' },
  },
  baseTitulo: 'Which base do you want?',
  baseAyuda: 'Both are engineered to carry the structure. It comes down to look and budget.',
  base: {
    'nueva-losa': {
      nombre: 'Poured concrete slab',
      nota: 'Cheaper up front. Shows hairline cracks over the years.',
    },
    'nueva-pavers': {
      nombre: 'Paver base',
      nota: 'Costs more, lasts decades, and single pavers can be lifted and reset.',
    },
  },

  paso5: '5 · What goes underneath?',
  ayuda5: 'The pieces that turn a structure into a room. Skip anything you are unsure about.',
  mejoras: {
    'Integrated-LED-Lighting': {
      nombre: 'Integrated LED lighting',
      nota: 'Recessed into the beams, dimmable.',
    },
    'Ceiling-Fans': { nombre: 'Ceiling fans', nota: 'Rated for outdoor humidity and salt air.' },
    'Motorized-Screens': {
      nombre: 'Motorized screens',
      nota: 'Sun, bugs and wind-driven rain, on demand.',
    },
    'Paver-Extension': {
      nombre: 'Paver extension',
      nota: 'Extends the floor beyond the footprint of the structure.',
    },
    'Drainage-System': { nombre: 'Drainage', nota: 'Gutters and runoff away from the house.' },
    'Outdoor-Kitchen-Integration': {
      nombre: 'Outdoor kitchen',
      nota: 'Grill, counter, sink and their utility runs.',
    },
  },
  enLaVisita: 'priced on the visit',

  paso6: '6 · Tell us about the site',
  ayuda6: 'This is what decides the engineering and permitting side of the job.',
  zip: 'ZIP code',
  zipAyuda:
    'Miami-Dade and Broward sit in the high-velocity hurricane zone and need heavier'
    + ' engineering than Palm Beach.',
  agua: 'Is your property on the water?',
  aguaAyuda: 'Canal, Intracoastal or ocean. Deeper footings and longer spans.',
  hoa: 'Do you need HOA approval?',
  hoaAyuda: 'It changes the drawing package and the timeline, not the structure.',
  si: 'Yes',
  no: 'No',
  noLoSe: 'I do not know',

  paso7: '7 · Does this fit?',
  ayuda7: 'Whatever you pick, your estimate stays the same. It just tells us how to help.',
  espejo: {
    encaja: { nombre: 'Yes, that works', nota: 'Right where I expected to land.' },
    alto: { nombre: 'A little high', nota: 'Show me what moves the number.' },
    premium: { nombre: 'I can invest more', nota: 'Show me the premium end.' },
  },
  palancasTitulo: 'Two things that move it most',

  paso8: '8 · Where do we send it?',
  ayuda8:
    'We will email you the itemized estimate and a project consultant will call to'
    + ' confirm the details.',
  nombre: 'Full name',
  email: 'Email',
  telefono: 'Phone',
  sms: 'You may text me about this project',
  enviar: 'Send me my estimate',
  tranquilidad:
    'One call within one business day, from a project consultant, not a call center.'
    + ' No obligation and no site visit until you ask for one.',
  exitoH2: 'Your estimate is on its way',
  exitoP:
    'Check your inbox for the itemized breakdown. A project consultant will call you'
    + ' within one business day.',
  exitoCta: 'Book your free on-site measurement',

  confirmado: 'Confirmed so far',
  porDefinir: 'Still to be defined',
  resultado: 'Estimated investment',
  legalFuerte: 'This is an estimate, not a quote.',
  legalAntes: ' The ranges come from our published ',
  legalEnlace: '2026 South Florida cost guide',
  legalDespues:
    '. Final pricing depends on your site, span, wind-load engineering, HOA and'
    + ' permitting requirements, and finish selections, and is confirmed only after an'
    + ' on-site assessment. Nothing here is a binding offer.',

  noscriptH2: 'Our published 2026 installed rates',
  thEstructura: 'Structure',
  thTarifa: 'Per sq ft installed',
  thAdicion: 'Add-on',
  thCoste: 'Typical cost',
  noscriptPie: 'Turn on JavaScript to price your project, or ',
  noscriptEnlace: 'request an exact quote',
  noscriptFin: ' and we will do it for you.',

  cierreH2: 'Ready to put a number on it?',
  cierreP:
    'Send us the details and a project consultant will confirm your estimate with the'
    + ' engineering and permitting your address actually requires.',
  cierreA: 'Get An Exact Quote',
  cierreB: 'Schedule A Visit',
  altCierre: ALT_CIERRE,

  cliente: {
    pideMedidas: 'Enter a width and a length to see your range.',
    recorte:
      'Estimating for {ancho} × {largo} ft. This tool covers {min}–{max} ft per side;'
      + ' larger spans need engineering input.',
    pies: 'ft',
    pies2: 'sq ft',
    instalados: 'sq ft installed',
    dePaso: 'Step {n} of {total}',
    estrecha: 'Answer {n} more and we close {monto} of what is still open.',
    cerrado: 'Everything is answered. This is as tight as it gets without a site visit.',
    soloCotizacion: 'We price this one by hand — leave us your details and we will send it over.',
    enLaVisita: 'priced on the visit',
    partidaEstructura: 'Structure',
    partidaBase: 'Ground and base',
    partidaIngenieria: 'Engineering and permits',
    partidaAgua: 'Waterfront lot',
    partidaMejoras: 'Enhancements',
    enviando: 'Sending…',
  },
};

export const ESTIMADOR_ES: TextosEstimador = {
  h1: 'Calculador de presupuesto',
  entradilla:
    'Responda unas preguntas sobre su patio y vea cómo se estrecha el rango sobre la'
    + ' marcha. Se apoya en nuestras tarifas instaladas de 2026 para Miami-Dade,'
    + ' Broward y Palm Beach.',

  atras: 'Atrás',
  siguiente: 'Siguiente',
  dePaso: 'Paso {n} de {total}',
  noSeguro: 'No lo sé — confírmenlo en la visita',

  paso1: '1 · ¿Qué quiere que haga?',
  ayuda1: 'Elija el resultado que busca. Nosotros lo emparejamos con la estructura correcta.',
  productos: {
    'open-air': {
      nombre: 'Sombra, pero abierto y con brisa',
      nota: 'Open-Air Aluminum Pergola',
    },
    insulated: {
      nombre: 'Protección total de lluvia, fresco debajo',
      nota: 'Insulated Solid Roof Pergola',
    },
    polycarbonate: {
      nombre: 'Que pase la luz pero no el agua',
      nota: 'Polycarbonate Pergola',
    },
    louvered: {
      nombre: 'Abrir y cerrar el techo cuando quiera',
      nota: 'Motorized Louvered Roof',
    },
    cabana: {
      nombre: 'Una estructura exenta junto a la piscina',
      nota: 'Aluminum Cabana',
    },
    screens: {
      nombre: 'Dejar los mosquitos fuera',
      nota: 'Screen Enclosure',
    },
    carport: {
      nombre: 'Cubrir el coche o el barco',
      nota: 'Aluminum Carport',
    },
    solar: {
      nombre: 'Generar energía mientras da sombra',
      nota: 'Solar Pergola',
    },
    sukkha: {
      nombre: 'Un sistema Sukkha 3000',
      nota: 'Sukkha 3000',
    },
  },
  desde: 'desde',
  porPie: 'por pie² instalado',
  aMedidaEtiqueta: 'Precio a medida',

  paso2: '2 · ¿Cómo se apoya?',
  ayuda2: 'Adosada sale más barata: descansa sobre un larguero y lleva dos postes en vez de cuatro.',
  montaje: {
    adosada: { nombre: 'Adosada a la casa', nota: 'Descansa sobre un larguero anclado al muro.' },
    exenta: { nombre: 'Exenta', nota: 'De cuatro a seis postes, cada uno con su zapata.' },
  },

  paso3: '3 · ¿De qué tamaño?',
  ayuda3: 'La mayoría de patios del sur de Florida caen en el medio. Puede afinarlo abajo.',
  presets: {
    intimo: { nombre: 'Íntimo', nota: '12 × 14 pies · comedor de seis' },
    popular: { nombre: 'Popular', nota: '16 × 20 pies · salón y comedor' },
    grande: { nombre: 'Grande', nota: '20 × 24 pies · una sala exterior completa' },
  },
  aMedida: 'Tamaño a medida',
  ancho: 'Ancho (pies)',
  largo: 'Largo (pies)',
  pies2: 'pies²',

  paso4: '4 · ¿Qué hay hoy en el suelo?',
  ayuda4:
    'Una pérgola no se ancla al césped. Suele ser la partida más grande del proyecto,'
    + ' así que conviene acertarla.',
  suelo: {
    'losa-ok': { nombre: 'Una losa de hormigón en buen estado', nota: 'Anclamos directamente.' },
    'pavers-ok': { nombre: 'Adoquines ya puestos', nota: 'Levantamos lo justo y lo reponemos.' },
    cesped: { nombre: 'Césped, tierra o arena', nota: 'La base nueva entra en el proyecto.' },
    'deck-madera': { nombre: 'Una tarima de madera', nota: 'Comprobamos si aguanta la carga.' },
    'no-se': { nombre: 'No estoy seguro', nota: 'Lo confirmamos en la visita.' },
  },
  baseTitulo: '¿Qué base prefiere?',
  baseAyuda: 'Las dos se calculan para sostener la estructura. La diferencia es estética y de precio.',
  base: {
    'nueva-losa': {
      nombre: 'Losa de hormigón',
      nota: 'Más barata al principio. Con los años aparecen fisuras finas.',
    },
    'nueva-pavers': {
      nombre: 'Base de adoquines',
      nota: 'Cuesta más, dura décadas y una pieza suelta se levanta y se repone.',
    },
  },

  paso5: '5 · ¿Qué va debajo?',
  ayuda5: 'Lo que convierte una estructura en una habitación. Deje sin marcar lo que dude.',
  mejoras: {
    'Integrated-LED-Lighting': {
      nombre: 'Iluminación LED integrada',
      nota: 'Empotrada en las vigas, regulable.',
    },
    'Ceiling-Fans': { nombre: 'Ventiladores de techo', nota: 'Aptos para humedad y salitre.' },
    'Motorized-Screens': {
      nombre: 'Cortinas motorizadas',
      nota: 'Sol, mosquitos y lluvia de costado, cuando haga falta.',
    },
    'Paver-Extension': {
      nombre: 'Ampliación de adoquines',
      nota: 'Extiende el suelo más allá de la estructura.',
    },
    'Drainage-System': { nombre: 'Drenaje', nota: 'Canalones y desagüe lejos de la casa.' },
    'Outdoor-Kitchen-Integration': {
      nombre: 'Cocina exterior',
      nota: 'Parrilla, encimera, fregadero y sus acometidas.',
    },
  },
  enLaVisita: 'se valora en la visita',

  paso6: '6 · Cuéntenos del sitio',
  ayuda6: 'Esto es lo que decide la parte de cálculo estructural y permisos.',
  zip: 'Código postal',
  zipAyuda:
    'Miami-Dade y Broward están en zona de viento de alta velocidad y exigen más'
    + ' cálculo que Palm Beach.',
  agua: '¿Su propiedad da al agua?',
  aguaAyuda: 'Canal, Intracoastal u océano. Zapatas más profundas y vanos más largos.',
  hoa: '¿Necesita aprobación de la comunidad?',
  hoaAyuda: 'Cambia el paquete de planos y los plazos, no la estructura.',
  si: 'Sí',
  no: 'No',
  noLoSe: 'No lo sé',

  paso7: '7 · ¿Le encaja?',
  ayuda7: 'Elija lo que elija, su estimado no cambia. Solo nos dice cómo ayudarle.',
  espejo: {
    encaja: { nombre: 'Sí, me encaja', nota: 'Justo donde esperaba.' },
    alto: { nombre: 'Un poco alto', nota: 'Enséñeme qué mueve la cifra.' },
    premium: { nombre: 'Puedo invertir más', nota: 'Enséñeme la gama alta.' },
  },
  palancasTitulo: 'Las dos cosas que más la mueven',

  paso8: '8 · ¿Adónde se lo enviamos?',
  ayuda8:
    'Le mandamos el estimado desglosado por correo y un asesor le llama para confirmar'
    + ' los detalles.',
  nombre: 'Nombre completo',
  email: 'Correo',
  telefono: 'Teléfono',
  sms: 'Pueden escribirme por SMS sobre este proyecto',
  enviar: 'Envíenme mi estimado',
  tranquilidad:
    'Una llamada en un día laborable, de un asesor de proyecto, no de un centro de'
    + ' llamadas. Sin compromiso y sin visita hasta que usted la pida.',
  exitoH2: 'Su estimado va en camino',
  exitoP:
    'Mire su correo: ahí tiene el desglose por partidas. Un asesor le llamará en un'
    + ' día laborable.',
  exitoCta: 'Reserve su medición gratuita',

  confirmado: 'Confirmado hasta ahora',
  porDefinir: 'Aún por definir',
  resultado: 'Inversión estimada',
  legalFuerte: 'Esto es un estimado, no una cotización.',
  legalAntes: ' Los rangos salen de nuestra ',
  legalEnlace: 'guía de costes de 2026 para el sur de Florida (en inglés)',
  legalDespues:
    '. El precio final depende de su terreno, la luz entre apoyos, el cálculo de carga'
    + ' de viento, los requisitos de la comunidad y de licencias, y los acabados, y se'
    + ' confirma solo tras una visita. Nada de aquí es una oferta vinculante.',

  noscriptH2: 'Nuestras tarifas instaladas de 2026',
  thEstructura: 'Estructura',
  thTarifa: 'Por pie² instalado',
  thAdicion: 'Adición',
  thCoste: 'Coste típico',
  noscriptPie: 'Active JavaScript para calcular su proyecto, o ',
  noscriptEnlace: 'pida una cotización exacta',
  noscriptFin: ' y lo hacemos por usted.',

  cierreH2: '¿Listo para ponerle una cifra?',
  cierreP:
    'Mándenos los detalles y un asesor confirmará su estimado con el cálculo y los'
    + ' permisos que su dirección exija de verdad.',
  cierreA: 'Pida su cotización exacta',
  cierreB: 'Agende una visita',
  altCierre: ALT_CIERRE,

  cliente: {
    pideMedidas: 'Escriba un ancho y un largo para ver su rango.',
    recorte:
      'Estimando para {ancho} × {largo} pies. Esta herramienta cubre de {min} a {max}'
      + ' pies por lado; por encima de ahí hace falta cálculo estructural.',
    pies: 'pies',
    pies2: 'pies²',
    instalados: 'pies² instalados',
    dePaso: 'Paso {n} de {total}',
    estrecha: 'Responda {n} más y cerramos {monto} de lo que sigue abierto.',
    cerrado: 'Ya está todo respondido. Más ajustado que esto exige una visita.',
    soloCotizacion: 'Este lo calculamos a mano — déjenos sus datos y se lo enviamos.',
    enLaVisita: 'se valora en la visita',
    partidaEstructura: 'Estructura',
    partidaBase: 'Suelo y base',
    partidaIngenieria: 'Cálculo y permisos',
    partidaAgua: 'Parcela frente al agua',
    partidaMejoras: 'Mejoras',
    enviando: 'Enviando…',
  },
};
