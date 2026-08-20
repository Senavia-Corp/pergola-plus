/**
 * Las tarifas del estimador. UNA sola vez, para las dos paginas y para las puertas.
 *
 * POR QUE ESTAN AQUI Y NO EN EL COMPONENTE
 *
 * Estuvieron en el frontmatter de Estimador.astro, y durante meses hubo una SEGUNDA
 * copia divergente 300 lineas mas abajo, dentro del bloque muerto que se tragaba el
 * <style> roto. Nadie lo vio porque las dos decian lo mismo: la duplicacion no duele
 * el dia que se crea, duele el dia que alguien actualiza una de las dos. Sacarlas a
 * un modulo propio es lo que impide que vuelva a pasar.
 *
 * Aqui NO hay ni un rotulo: los nombres y las notas viven en src/i18n/estimador.ts,
 * uno por idioma. La bisagra entre las dos mitades es el `id`.
 *
 * DE DONDE SALE CADA NUMERO
 *
 * Cada tarifa lleva su procedencia dentro del dato, y no es decorativa: es lo que
 * permite sacar la lista de lo que Pergola Plus tiene que firmar sin ir a buscarlo
 * fichero por fichero.
 *
 *   'publicada'      la guia de costes de la propia empresa,
 *                    /post/pergola-cost-south-florida ("Average Pergola Cost in
 *                    South Florida (2026)"). Autoritativa.
 *   'mercado'        corredor de precios del sur de Florida, con la fuente en
 *                    `nota`. Se ensena igual que las demas —el aviso legal fuerte
 *                    de la pagina es el encuadre correcto— pero necesita firma.
 *   'sin-confirmar'  estaba en el codigo desde el principio y NO aparece en la guia
 *                    publicada. Hoy solo lo es el recargo de frente al agua.
 *
 * Lo que no tiene fuente limpia no lleva numero: `tarifa: null` significa "solo
 * cotizacion", y el estimador lo dice en voz alta en vez de inventarse una banda.
 *
 * El "+" de la guia ($150+, $175+) significa que el techo es abierto. Se arrastra
 * hasta el resultado para no presentar como maximo una cifra que no lo es.
 */

export type Fuente = 'publicada' | 'mercado' | 'sin-confirmar';

export interface Tarifa {
  min: number;
  max: number;
  /** El techo no es un maximo real; se propaga al total como "+". */
  techoAbierto?: boolean;
  fuente: Fuente;
  /** De donde sale la cifra. Obligatoria en todo lo que no sea 'publicada'. */
  nota?: string;
}

/**
 * Lo que hay que firmar antes de publicar. Derivado, nunca almacenado: un booleano
 * aparte acabaria diciendo lo contrario que `fuente` el dia que alguien toque uno
 * de los dos.
 */
export const requiereFirma = (t: Tarifa) => t.fuente !== 'publicada';

// -----------------------------------------------------------------------------
// PRODUCTOS
// -----------------------------------------------------------------------------
// Por pie cuadrado instalado. El orden es el del paso 1, y no es alfabetico: va de
// lo mas comun a lo mas especifico, que es el orden en el que la gente decide.

export interface Producto {
  id: string;
  /** Ruta del producto, sin prefijo de idioma. */
  href: string;
  /** Foto de la tarjeta del paso 1. Absoluta desde public/. */
  imagen: string;
  /** Por pie cuadrado instalado. `null` = solo cotizacion, no entra en el calculo. */
  tarifa: Tarifa | null;
  /** Estructura exenta por definicion: se salta la pregunta de montaje. */
  siempreExenta?: boolean;
}

export const PRODUCTOS: Producto[] = [
  {
    id: 'open-air',
    imagen: '/images/cliente/open-air-pergolas.avif',
    href: '/products/open-air-pergolas',
    tarifa: { min: 85, max: 110, fuente: 'publicada' },
  },
  {
    id: 'insulated',
    imagen: '/images/cliente/solid-roof-pergolas.avif',
    href: '/products/solid-roof-pergolas',
    tarifa: { min: 95, max: 130, fuente: 'publicada' },
  },
  {
    id: 'polycarbonate',
    imagen: '/images/cliente/polycarbonate-pergola.avif',
    href: '/products/polycarbonate-pergolas',
    // El mercado publica $12-20/sq ft para "policarbonato", pero eso son kits
    // prefabricados de bricolaje. Aqui el panel va sobre la MISMA estructura de
    // aluminio con ingenieria de zona de viento que la open-air, asi que la banda
    // se deriva de la open-air publicada y no del kit: el delta esta en el panel.
    tarifa: {
      min: 90,
      max: 120,
      fuente: 'mercado',
      nota: 'derivada de la open-air publicada; el mercado de kits prefabricados no aplica',
    },
  },
  {
    id: 'louvered',
    imagen: '/images/cliente/motorized-louvered.avif',
    href: '/products/motorized-louvered-pergolas',
    tarifa: { min: 110, max: 150, techoAbierto: true, fuente: 'publicada' },
  },
  {
    id: 'cabana',
    imagen: '/cms-img/products/cabanas/cover-aluminum-cabana-contractors-south-florida.avif',
    href: '/products/cabanas',
    tarifa: { min: 120, max: 175, techoAbierto: true, fuente: 'publicada' },
    siempreExenta: true,
  },
  {
    id: 'screens',
    imagen: '/images/cliente/screen-enclosure.avif',
    href: '/products/screen-enclosures',
    tarifa: {
      min: 14,
      max: 22,
      fuente: 'mercado',
      nota: 'corredor del sur de Florida $12-25/sq ft; jaula media $20k-25k',
    },
  },
  {
    id: 'carport',
    imagen: '/cms-img/products/carports/cover-aluminum-carport-builders-south-florida.avif',
    href: '/products/carports',
    tarifa: {
      min: 18,
      max: 28,
      fuente: 'mercado',
      nota: 'Florida $15-25/sq ft instalado, mas recargo por zona de viento',
    },
    siempreExenta: true,
  },
  // Los dos ultimos no llevan numero. El solar depende del vataje y de la
  // interconexion con la electrica, y el Sukkha es un sistema propietario sin
  // comparable de mercado: cualquier banda seria inventada.
  { id: 'solar', imagen: '/cms-img/products/solar-pergolas/cover-solar-roof-structure-contractors-south-florida.avif', href: '/products/solar-pergolas', tarifa: null },
  { id: 'sukkha', imagen: '/images/cliente/sukkah.avif', href: '/products/sukkha', tarifa: null },
];

/** Los que no dan cifra y van directos a la captura. */
export const soloCotizacion = (p: Producto) => p.tarifa === null;

// -----------------------------------------------------------------------------
// MONTAJE
// -----------------------------------------------------------------------------
// Adosada sale mas barata de verdad: se apoya en un ledger contra la casa y
// necesita dos postes en vez de cuatro a seis, con sus zapatas. Factor sobre la
// tarifa del producto.

export const MONTAJE = { adosada: 0.92, exenta: 1.0 };
export type Montaje = keyof typeof MONTAJE;

// -----------------------------------------------------------------------------
// SUPERFICIE
// -----------------------------------------------------------------------------
// La pregunta que mas mueve el ticket, y la que el estimador viejo escondia detras
// de "Concrete footings — depth depends on soil and span". Un propietario no sabe
// responder eso; si sabe si lo que tiene debajo es cesped o una losa.
//
// No es un extra opcional: una pergola no se ancla al cesped. Por eso 'cesped'
// desemboca en elegir base, y no existe la opcion "sin base".

export type Superficie = 'losa-ok' | 'pavers-ok' | 'nueva-losa' | 'nueva-pavers' | 'deck-madera';

/** Por pie cuadrado, sobre el area de la estructura. */
export const SUPERFICIES: Record<Superficie, Tarifa> = {
  'losa-ok': { min: 0, max: 0, fuente: 'publicada' },
  'pavers-ok': { min: 0, max: 0, fuente: 'publicada' },
  'nueva-losa': {
    min: 8,
    max: 14,
    fuente: 'mercado',
    nota: 'Miami $7-12/sq ft reforzada, mas borde engrosado para las zapatas',
  },
  'nueva-pavers': {
    min: 14,
    max: 22,
    fuente: 'mercado',
    nota: 'sur de Florida $8-25/sq ft; Florida $12-32/sq ft instalado',
  },
  // Un deck de madera existente puede servir de base o haber que retirarlo entero:
  // no se sabe sin verlo. La banda cubre las dos puntas a proposito.
  'deck-madera': {
    min: 8,
    max: 22,
    fuente: 'mercado',
    nota: 'entre reforzar el deck y sustituirlo por base nueva; se decide en la visita',
  },
};

/** Peor caso mientras no se ha respondido: la base mas cara posible. */
export const SUPERFICIE_MAX = Math.max(...Object.values(SUPERFICIES).map((s) => s.max));

// -----------------------------------------------------------------------------
// INGENIERIA Y PERMISOS
// -----------------------------------------------------------------------------
// La banda entera es la publicada. Lo que aporta el codigo postal no es un numero
// nuevo: es saber DONDE de esa banda cae cada jurisdiccion. Miami-Dade y Broward
// son zona de viento de alta velocidad y exigen mas calculo y mas tasas que Palm
// Beach, y eso mueve el minimo, no el techo.

export const INGENIERIA: Tarifa = { min: 2000, max: 5000, techoAbierto: true, fuente: 'publicada' };

export type Condado = 'miami-dade' | 'broward' | 'palm-beach';

/**
 * Rangos de codigo postal y donde cae cada condado DENTRO de la banda publicada.
 *
 * Es una tabla y no tres `if` porque el navegador necesita exactamente lo mismo que
 * la puerta: serializando esto, el cliente y el servidor no pueden discrepar.
 *
 * ponytail: por rangos, no por la tabla completa del USPS. Los limites reales no
 * son limpios —Broward tiene enclaves en 330xx— pero estos tres cubren la inmensa
 * mayoria del area de servicio, y lo que se escape cae fuera, que usa la banda
 * publicada entera y marca el campo para la visita. Si algun dia hace falta el ZIP
 * exacto, la tabla completa va justo aqui.
 */
export const CONDADOS: { id: Condado; desde: number; hasta: number; min: number; max: number }[] = [
  { id: 'miami-dade', desde: 33010, hasta: 33299, min: 3500, max: 5000 },
  { id: 'broward', desde: 33300, hasta: 33399, min: 3000, max: 5000 },
  { id: 'palm-beach', desde: 33400, hasta: 33499, min: 2000, max: 4000 },
];

/** Condado a partir del codigo postal, o `null` si no se reconoce. */
export function condadoDe(zip: string): Condado | null {
  const n = Number(String(zip).trim().slice(0, 5));
  if (!Number.isInteger(n)) return null;
  return CONDADOS.find((c) => n >= c.desde && n <= c.hasta)?.id ?? null;
}

/** La banda de ingenieria que toca. Sin condado, la publicada entera. */
export const ingenieriaDe = (c: Condado | null) => {
  const encontrado = c && CONDADOS.find((x) => x.id === c);
  return encontrado
    ? { min: encontrado.min, max: encontrado.max }
    : { min: INGENIERIA.min, max: INGENIERIA.max };
};

// -----------------------------------------------------------------------------
// FRENTE AL AGUA
// -----------------------------------------------------------------------------
// Zapatas mas profundas y vanos mas largos en canal, Intracoastal y oceano.
//
// OJO: esta cifra lleva en el codigo desde el principio y se le esta ensenando a
// clientes reales, pero NO aparece en la guia de costes publicada ni en el articulo
// que la corrobora. Es la unica del fichero sin respaldo documental.

export const WATERFRONT: Tarifa = {
  min: 5000,
  max: 15000,
  fuente: 'sin-confirmar',
  nota: 'heredada del codigo original; no figura en la guia de costes publicada',
};

// -----------------------------------------------------------------------------
// MEJORAS
// -----------------------------------------------------------------------------
// Los `id` son EXACTAMENTE los `value` del formulario de cotizacion
// (contact-us/get-a-quote). No se traducen nunca y no se tocan: es lo que hace que
// un lead del estimador y uno del formulario largo hablen el mismo vocabulario
// cuando llegan al comercial.
//
// `grupo` existe porque la guia publicada precia iluminacion y ventiladores juntos,
// en una sola banda de "electrical & automation". Marcar los dos no cobra dos
// veces: las mejoras que comparten grupo aportan su banda UNA vez.

export interface Mejora {
  id: string;
  /** `null` = se confirma en la visita; suma cero y se dice en voz alta. */
  tarifa: Tarifa | null;
  grupo?: string;
}

export const MEJORAS: Mejora[] = [
  {
    id: 'Integrated-LED-Lighting',
    grupo: 'electrico',
    tarifa: { min: 1000, max: 4000, techoAbierto: true, fuente: 'publicada' },
  },
  {
    id: 'Ceiling-Fans',
    grupo: 'electrico',
    tarifa: { min: 1000, max: 4000, techoAbierto: true, fuente: 'publicada' },
  },
  {
    // La guia mete las cortinas motorizadas dentro de la banda electrica, pero el
    // mercado las precia un orden de magnitud por encima: son un producto propio
    // del catalogo, no un accesorio electrico. Por eso salen del grupo.
    id: 'Motorized-Screens',
    tarifa: {
      min: 3500,
      max: 14000,
      fuente: 'mercado',
      nota: '$3.500-7.000 por vano instalado; la banda cubre de uno a dos vanos',
    },
  },
  {
    id: 'Paver-Extension',
    tarifa: {
      min: 1400,
      max: 6600,
      fuente: 'mercado',
      nota: 'extension tipica de 100-300 sq ft a la tarifa de pavers ($14-22/sq ft)',
    },
  },
  // Sin banda: no hay fuente limpia para ninguna de las dos y el rango real depende
  // por completo del sitio. Se marcan y se confirman en la visita.
  { id: 'Drainage-System', tarifa: null },
  { id: 'Outdoor-Kitchen-Integration', tarifa: null },
];

// -----------------------------------------------------------------------------
// MEDIDAS
// -----------------------------------------------------------------------------
// Los limites viven aqui y no duplicados entre los atributos min/max del HTML y las
// constantes del script, que es como estaban.

export const MIN_FT = 8;
export const MAX_FT = 60;

/**
 * Los presets del paso 3. "Popular" va preseleccionado a proposito: anclar en el
 * tamano mas pequeno arrastra la expectativa hacia abajo desde el primer segundo.
 */
export const PRESETS = [
  { id: 'intimo', ancho: 12, largo: 14 },
  { id: 'popular', ancho: 16, largo: 20 },
  { id: 'grande', ancho: 20, largo: 24 },
];

export const PRESET_POR_DEFECTO = 'popular';
export const ANCHO_POR_DEFECTO = 16;
export const LARGO_POR_DEFECTO = 20;

// -----------------------------------------------------------------------------
// LA LISTA DE FIRMA
// -----------------------------------------------------------------------------
// Recorre todo el fichero y devuelve lo que Pergola Plus tiene que validar antes
// de publicar. La usa la puerta para que la lista no haya que mantenerla a mano.

export function pendientesDeFirma(): { donde: string; tarifa: Tarifa }[] {
  const fuera: { donde: string; tarifa: Tarifa }[] = [];
  const mira = (donde: string, t: Tarifa | null) => {
    if (t && requiereFirma(t)) fuera.push({ donde, tarifa: t });
  };
  for (const p of PRODUCTOS) mira(`producto/${p.id}`, p.tarifa);
  for (const [k, t] of Object.entries(SUPERFICIES)) mira(`superficie/${k}`, t);
  for (const m of MEJORAS) mira(`mejora/${m.id}`, m.tarifa);
  mira('ingenieria', INGENIERIA);
  mira('waterfront', WATERFRONT);
  return fuera;
}
