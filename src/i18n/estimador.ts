/**
 * Los rotulos del calculador de presupuesto, en los dos idiomas.
 *
 * Aqui NO hay ni un precio. Las tarifas viven una sola vez en
 * `src/components/Estimador.astro`, porque un numero duplicado por idioma es un
 * numero que un dia dira dos cosas distintas — y este no es un rotulo cualquiera:
 * es lo que el visitante se lleva de la pagina.
 *
 * `cliente` es el subconjunto que pinta el JavaScript en el navegador. Viaja dentro
 * de `window.__ESTIMADOR__` para que el script sea el MISMO en las dos paginas.
 */

export interface TextosEstimador {
  h1: string;
  entradilla: string;
  paso1: string;
  paso2: string;
  paso3: string;
  ayudaExtras: string;
  porPie: string;
  ancho: string;
  largo: string;
  pies2: string;
  resultado: string;
  legalFuerte: string;
  legalAntes: string;
  legalEnlace: string;
  legalDespues: string;
  ctaExacto: string;
  ctaVisita: string;
  noscriptH2: string;
  thEstructura: string;
  thTarifa: string;
  thAdicion: string;
  thCoste: string;
  noscriptPie: string;
  noscriptEnlace: string;
  noscriptFin: string;
  cierreH2: string;
  cierreP: string;
  cierreA: string;
  cierreB: string;
  altCierre: string;
  estructuras: Record<string, { nombre: string; nota: string }>;
  extras: Record<string, { nombre: string; nota: string }>;
  /** Lo que pinta el navegador. `{ancho}`, `{largo}`, `{min}` y `{max}` se sustituyen. */
  cliente: { pideMedidas: string; recorte: string; pies2: string; instalados: string };
}

const ALT_CIERRE =
  'Luxury outdoor living in South Florida featuring a custom pool, modern pergola with'
  + ' outdoor kitchen, tropical landscaping, and elegant patio design for high-end'
  + ' residential properties.';

export const ESTIMADOR_EN: TextosEstimador = {
  h1: 'Project Estimator',
  entradilla:
    'Price your pergola or patio cover in minutes using our published 2026 installed'
    + ' rates for Miami-Dade, Broward, and Palm Beach County. No contact details'
    + ' required — you will see the range immediately.',
  paso1: '1 · Structure type',
  paso2: '2 · Size',
  paso3: '3 · Add what your project needs',
  ayudaExtras:
    'These are the items that most often move a South Florida project above the base'
    + ' rate. Leave them unchecked if you are not sure — we confirm them on site.',
  porPie: 'per sq ft installed',
  ancho: 'Width (ft)',
  largo: 'Length (ft)',
  pies2: 'sq ft',
  resultado: 'Estimated investment',
  legalFuerte: 'This is an estimate, not a quote.',
  legalAntes: 'The ranges come from our published',
  legalEnlace: '2026 South Florida cost guide',
  legalDespues:
    '. Final pricing depends on your site, span, wind-load engineering, HOA and'
    + ' permitting requirements, and finish selections, and is confirmed only after an'
    + ' on-site assessment. Nothing here is a binding offer.',
  ctaExacto: 'Get an exact quote',
  ctaVisita: 'Schedule a visit',
  noscriptH2: '2026 installed rates',
  thEstructura: 'Structure',
  thTarifa: 'Per sq ft installed',
  thAdicion: 'Common addition',
  thCoste: 'Typical cost',
  noscriptPie: 'Multiply your area in square feet by the rate above, then add what applies.',
  noscriptEnlace: 'Request a quote',
  noscriptFin: ' for exact pricing.',
  cierreH2: 'Request your free Estimate',
  cierreP:
    "Meet with our exterior designers for a free consultation. We'll assess your space"
    + ' and goals to plan the installation of pergolas, patio covers, or pool enclosures.',
  cierreA: 'Get A Quote',
  cierreB: 'Schedule A Visit',
  altCierre: ALT_CIERRE,
  estructuras: {
    'open-air': {
      nombre: 'Open-Air Aluminum Pergola',
      nota: 'Shade and architecture without full weather control.',
    },
    insulated: {
      nombre: 'Insulated Roof Pergola',
      nota: 'Heat control and full rain cover. Popular on the coast.',
    },
    louvered: {
      nombre: 'Motorized Louvered Roof',
      nota: 'Open or close the roof on demand. Year-round usability.',
    },
    cabana: {
      nombre: 'Aluminum Cabana Structure',
      nota: 'Free-standing structures for pools and estate properties.',
    },
  },
  extras: {
    engineering: {
      nombre: 'Engineering & wind-load calculations',
      nota: 'Sealed drawings for Florida wind-load compliance.',
    },
    footings: { nombre: 'Concrete footings', nota: 'Depth depends on soil and span.' },
    electrical: {
      nombre: 'Electrical & automation',
      nota: 'Integrated lighting, fans, motorized screens.',
    },
    waterfront: {
      nombre: 'Waterfront lot',
      nota: 'Deeper footings and longer spans on Intracoastal and oceanfront lots.',
    },
  },
  cliente: {
    pideMedidas: 'Enter the width and length in feet.',
    recorte:
      'Estimating for {ancho} × {largo} ft. This tool covers {min}–{max} ft per side;'
      + ' larger spans need engineering input.',
    pies2: 'sq ft',
    instalados: 'sq ft installed',
  },
};

export const ESTIMADOR_ES: TextosEstimador = {
  h1: 'Calculador de presupuesto',
  entradilla:
    'Calcule en un minuto lo que cuesta su pérgola o su cubierta de patio con nuestras'
    + ' tarifas instaladas de 2026 para Miami-Dade, Broward y Palm Beach. No hace falta'
    + ' que nos deje sus datos: ve la horquilla al momento.',
  paso1: '1 · Tipo de estructura',
  paso2: '2 · Medidas',
  paso3: '3 · Añada lo que necesite su proyecto',
  ayudaExtras:
    'Esto es lo que más veces sube un proyecto del sur de Florida por encima de la'
    + ' tarifa base. Si no está seguro, déjelo sin marcar: lo confirmamos en la visita.',
  // La unidad se deja en pies cuadrados y no se pasa a metros: es la unidad con la que
  // se contrata obra en Florida y la que aparece en el permiso.
  porPie: 'por pie² instalado',
  ancho: 'Ancho (pies)',
  largo: 'Largo (pies)',
  pies2: 'pies²',
  resultado: 'Inversión estimada',
  legalFuerte: 'Esto es una estimación, no un presupuesto.',
  legalAntes: 'Las horquillas salen de nuestra',
  legalEnlace: 'guía de costes de 2026 para el sur de Florida (en inglés)',
  legalDespues:
    '. El precio final depende de su parcela, de la luz a salvar, del cálculo de cargas'
    + ' de viento, de lo que exijan la comunidad y el ayuntamiento, y de los acabados'
    + ' que elija, y solo se confirma tras visitar la obra. Nada de lo que hay aquí es'
    + ' una oferta vinculante.',
  ctaExacto: 'Pedir presupuesto exacto',
  ctaVisita: 'Agendar una visita',
  noscriptH2: 'Tarifas instaladas de 2026',
  thEstructura: 'Estructura',
  thTarifa: 'Por pie² instalado',
  thAdicion: 'Extra habitual',
  thCoste: 'Coste típico',
  noscriptPie:
    'Multiplique su superficie en pies cuadrados por la tarifa de arriba y sume lo que'
    + ' le aplique.',
  noscriptEnlace: 'Pida presupuesto',
  noscriptFin: ' para tener el precio exacto.',
  cierreH2: 'Pida su presupuesto gratis',
  cierreP:
    'Reúnase con nuestros diseñadores de exteriores en una consulta gratuita. Vemos su'
    + ' espacio y lo que busca para planificar la instalación de pérgolas, cubiertas de'
    + ' patio o cerramientos de piscina.',
  cierreA: 'Pedir presupuesto',
  cierreB: 'Agendar una visita',
  // El alt se queda en ingles: es la MISMA imagen que sirve la version inglesa y su
  // texto alternativo describe la foto, no la pagina. Cambiarlo solo aqui haria que
  // la misma imagen tuviera dos descripciones distintas segun la url.
  altCierre: ALT_CIERRE,
  estructuras: {
    'open-air': {
      nombre: 'Pérgola abierta de aluminio',
      nota: 'Sombra y arquitectura, sin control total del tiempo.',
    },
    insulated: {
      nombre: 'Pérgola de techo aislado',
      nota: 'Control del calor y cubierta total frente a la lluvia. La más pedida en la costa.',
    },
    louvered: {
      nombre: 'Techo de lamas motorizado',
      nota: 'Abre y cierra el techo cuando quiera. Se usa todo el año.',
    },
    cabana: {
      nombre: 'Cabaña de aluminio',
      nota: 'Estructuras exentas para piscinas y fincas.',
    },
  },
  extras: {
    engineering: {
      nombre: 'Cálculo estructural y de cargas de viento',
      nota: 'Planos sellados para cumplir las cargas de viento de Florida.',
    },
    footings: {
      nombre: 'Zapatas de hormigón',
      nota: 'La profundidad depende del terreno y de la luz a salvar.',
    },
    electrical: {
      nombre: 'Electricidad y automatización',
      nota: 'Iluminación integrada, ventiladores, cortinas motorizadas.',
    },
    waterfront: {
      nombre: 'Parcela frente al agua',
      nota: 'Zapatas más profundas y luces mayores en el Intracoastal y frente al mar.',
    },
  },
  cliente: {
    pideMedidas: 'Escriba el ancho y el largo en pies.',
    recorte:
      'Estimando para {ancho} × {largo} pies. Esta herramienta cubre de {min} a {max}'
      + ' pies por lado; por encima de ahí hace falta cálculo estructural.',
    pies2: 'pies²',
    instalados: 'pies² instalados',
  },
};
