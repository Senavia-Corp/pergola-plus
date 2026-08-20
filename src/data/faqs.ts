/**
 * Las preguntas frecuentes del sitio, como DATOS. Ni un rotulo, ni una frase.
 *
 * El texto de cada pregunta vive en `src/i18n/faqs.es.ts`, en los dos idiomas, y
 * la bisagra entre las dos mitades es el `id` — el mismo reparto que usa el
 * estimador (`src/data/estimador.ts` + `src/i18n/estimador.ts`).
 *
 * Por que un modulo y no un CMS: el sitio es estatico, esto va versionado en git
 * y lo consume una sola pagina. Si algun dia hace falta un CMS, este es el unico
 * fichero que cambia y las plantillas no se enteran — igual que documenta
 * `src/lib/blog.ts` para su CSV.
 *
 * DOS EJES, y no son el mismo:
 *   chip -> como navega la gente. Es la tira de filtros. UNA sola por pregunta:
 *           si una cupiera en dos, el contador del chip mentiria.
 *   tema -> de que producto o servicio habla. NO se pinta como chip (serian 23 y
 *           en movil no los recorre nadie). Es lo que enlazan las 17 fichas
 *           (?t=<tema>) y lo que agrupa los <h3> dentro de cada seccion.
 * El eje transversal —"todas las de permisos, sea cual sea el producto"— lo cubre
 * el buscador, no los chips.
 */

/** La tira de filtros. Anade uno aqui y hay que darle rotulo en faqs.es.ts. */
export type Chip = 'permisos' | 'precios' | 'pergolas' | 'sombra' | 'obra' | 'materiales';

/** Los 10 productos, los 7 servicios y los 6 temas transversales. */
export type Tema =
  | 'motorized-louvered-pergolas' | 'solid-roof-pergolas' | 'open-air-pergolas'
  | 'polycarbonate-pergolas' | 'solar-pergolas' | 'sukkha'
  | 'cabanas' | 'carports' | 'screen-enclosures' | 'motorized-screens'
  | 'pergola-design-construction' | 'pavers' | 'driveways' | 'concrete'
  | 'deck-builders' | 'fence-solutions' | 'patio-remodeling'
  | 'general-pergolas' | 'general-permisos' | 'general-precios'
  | 'general-materiales' | 'general-proceso' | 'general-empresa';

/** Orden en que se pintan las secciones. 'todo' no es un chip: es el estado sin filtro. */
export const CHIPS: Chip[] = ['permisos', 'precios', 'pergolas', 'sombra', 'obra', 'materiales'];

/** Los temas que son una ficha real, y por tanto pueden llegar por ?t=. */
export const TEMAS_FICHA = new Set<Tema>([
  'motorized-louvered-pergolas', 'solid-roof-pergolas', 'open-air-pergolas',
  'polycarbonate-pergolas', 'solar-pergolas', 'sukkha',
  'cabanas', 'carports', 'screen-enclosures', 'motorized-screens',
  'pergola-design-construction', 'pavers', 'driveways', 'concrete',
  'deck-builders', 'fence-solutions', 'patio-remodeling',
]);

export interface Faq {
  /**
   * Slug estable. Es el ancla de la URL (#faq-<id>) y la clave del copy.
   * NUNCA se renumera: una URL compartida tiene que seguir llevando aqui.
   */
  id: string;
  chip: Chip;
  tema: Tema;
  /**
   * De donde salio. 'ficha' significa que el texto TIENE que seguir cuadrando
   * con el bloque de 5 preguntas de esa ficha, que sigue siendo markup migrado
   * verbatim. Lo hace comprobable en vez de esperar que nadie lo toque.
   */
  origen: 'ficha' | 'pagina' | 'nueva';
  /** A donde mandar a quien quiere mas. Convierte la biblioteca en enlazado interno. */
  enlace?: string;
  /** Sube dentro de su chip Y es de las pocas que entran en el JSON-LD. */
  destacada?: boolean;
  /**
   * Claves de busqueda INVARIANTES: marcas, siglas, codigos y sitios. Van aqui y
   * no en el diccionario porque no se traducen — mismo criterio que
   * `esInvariante()` en src/i18n/index.ts. Repetir "FORTE NOA HVHZ" en dos
   * idiomas es garantizar que un dia divergan.
   */
  claves?: string[];
}

export const FAQS: Faq[] = [
  { id: 'permiso-sur-florida', chip: 'permisos', tema: 'general-permisos', origen: 'pagina', enlace: '/services/pergola-design-construction', destacada: true, claves: ['NOA', 'Miami-Dade', 'Broward', 'Palm Beach'] },
  { id: 'huracan-homologacion', chip: 'permisos', tema: 'general-permisos', origen: 'pagina', enlace: '/products/motorized-louvered-pergolas', destacada: true, claves: ['HVHZ', 'NOA'] },
  { id: 'precio-pergola-aluminio', chip: 'precios', tema: 'general-precios', origen: 'pagina', enlace: '/services/pergola-design-construction', destacada: true, claves: ['Miami-Dade', 'Broward', 'Palm Beach'] },
  { id: 'pergola-vs-lamas', chip: 'pergolas', tema: 'general-pergolas', origen: 'pagina', enlace: '/products/motorized-louvered-pergolas', destacada: true },
  { id: 'plazo-diseno-montaje', chip: 'precios', tema: 'general-proceso', origen: 'pagina', enlace: '/services/pergola-design-construction', destacada: true },
  { id: 'revalorizacion-vivienda', chip: 'precios', tema: 'general-precios', origen: 'pagina', enlace: '/project', destacada: true },
  { id: 'integraciones-luz-ventilador', chip: 'materiales', tema: 'general-materiales', origen: 'pagina', enlace: '/products/motorized-screens', destacada: true },
  { id: 'aluminio-vs-madera', chip: 'materiales', tema: 'general-materiales', origen: 'pagina', enlace: '/products/open-air-pergolas', destacada: true },
  { id: 'hoa-urbanizacion', chip: 'permisos', tema: 'general-permisos', origen: 'pagina', enlace: '/services/pergola-design-construction', destacada: true, claves: ['HOA'] },
  { id: 'lamas-lluvia-drenaje', chip: 'materiales', tema: 'general-pergolas', origen: 'pagina', enlace: '/products/motorized-louvered-pergolas', destacada: true },
  { id: 'cabanas-permanente', chip: 'sombra', tema: 'cabanas', origen: 'ficha' },
  { id: 'cabanas-cortinas', chip: 'sombra', tema: 'cabanas', origen: 'ficha', enlace: '/products/motorized-screens' },
  { id: 'cabanas-huracan', chip: 'sombra', tema: 'cabanas', origen: 'ficha' },
  { id: 'cabanas-mantenimiento', chip: 'sombra', tema: 'cabanas', origen: 'ficha' },
  { id: 'cabanas-luz-ventilador', chip: 'sombra', tema: 'cabanas', origen: 'ficha' },
  { id: 'carports-uv', chip: 'sombra', tema: 'carports', origen: 'ficha' },
  { id: 'carports-viento', chip: 'sombra', tema: 'carports', origen: 'ficha' },
  { id: 'carports-diseno', chip: 'sombra', tema: 'carports', origen: 'ficha' },
  { id: 'carports-oxido', chip: 'sombra', tema: 'carports', origen: 'ficha' },
  { id: 'carports-permiso', chip: 'sombra', tema: 'carports', origen: 'ficha', claves: ['NOA'] },
  { id: 'louvered-funcionamiento', chip: 'pergolas', tema: 'motorized-louvered-pergolas', origen: 'ficha' },
  { id: 'louvered-huracan', chip: 'pergolas', tema: 'motorized-louvered-pergolas', origen: 'ficha', claves: ['HVHZ', 'NOA'] },
  { id: 'louvered-sensor-lluvia', chip: 'pergolas', tema: 'motorized-louvered-pergolas', origen: 'ficha' },
  { id: 'louvered-salitre', chip: 'pergolas', tema: 'motorized-louvered-pergolas', origen: 'ficha', claves: ['NOA'] },
  { id: 'louvered-plazo', chip: 'pergolas', tema: 'motorized-louvered-pergolas', origen: 'ficha' },
  { id: 'screens-control', chip: 'sombra', tema: 'motorized-screens', origen: 'ficha', claves: ['Fenetex', 'MaestroShield'] },
  { id: 'screens-viento', chip: 'sombra', tema: 'motorized-screens', origen: 'ficha', claves: ['Fenetex'] },
  { id: 'screens-calor', chip: 'sombra', tema: 'motorized-screens', origen: 'ficha' },
  { id: 'screens-ocultas', chip: 'sombra', tema: 'motorized-screens', origen: 'ficha' },
  { id: 'screens-anadir-pergola', chip: 'sombra', tema: 'motorized-screens', origen: 'ficha', enlace: '/products/motorized-louvered-pergolas' },
  { id: 'open-air-por-que', chip: 'pergolas', tema: 'open-air-pergolas', origen: 'ficha' },
  { id: 'open-air-material', chip: 'pergolas', tema: 'open-air-pergolas', origen: 'ficha' },
  { id: 'open-air-iluminacion', chip: 'pergolas', tema: 'open-air-pergolas', origen: 'ficha' },
  { id: 'open-air-revalorizacion', chip: 'pergolas', tema: 'open-air-pergolas', origen: 'ficha' },
  { id: 'open-air-normativa', chip: 'pergolas', tema: 'open-air-pergolas', origen: 'ficha' },
  { id: 'polycarbonate-uv', chip: 'pergolas', tema: 'polycarbonate-pergolas', origen: 'ficha' },
  { id: 'polycarbonate-amarilleo', chip: 'pergolas', tema: 'polycarbonate-pergolas', origen: 'ficha' },
  { id: 'polycarbonate-tormentas', chip: 'pergolas', tema: 'polycarbonate-pergolas', origen: 'ficha' },
  { id: 'polycarbonate-lluvia', chip: 'pergolas', tema: 'polycarbonate-pergolas', origen: 'ficha' },
  { id: 'polycarbonate-tintes', chip: 'pergolas', tema: 'polycarbonate-pergolas', origen: 'ficha' },
  { id: 'enclosures-brisa', chip: 'sombra', tema: 'screen-enclosures', origen: 'ficha' },
  { id: 'enclosures-normativa', chip: 'sombra', tema: 'screen-enclosures', origen: 'ficha', claves: ['HVHZ', 'NOA'] },
  { id: 'enclosures-mosquitera', chip: 'sombra', tema: 'screen-enclosures', origen: 'ficha' },
  { id: 'enclosures-permiso', chip: 'sombra', tema: 'screen-enclosures', origen: 'ficha' },
  { id: 'enclosures-piscina', chip: 'sombra', tema: 'screen-enclosures', origen: 'ficha' },
  { id: 'solar-paneles', chip: 'pergolas', tema: 'solar-pergolas', origen: 'ficha', claves: ['kW'] },
  { id: 'solar-estructura', chip: 'pergolas', tema: 'solar-pergolas', origen: 'ficha' },
  { id: 'solar-estanqueidad', chip: 'pergolas', tema: 'solar-pergolas', origen: 'ficha' },
  { id: 'solar-orientacion', chip: 'pergolas', tema: 'solar-pergolas', origen: 'ficha' },
  { id: 'solar-permisos', chip: 'pergolas', tema: 'solar-pergolas', origen: 'ficha' },
  { id: 'solid-roof-calor', chip: 'pergolas', tema: 'solid-roof-pergolas', origen: 'ficha' },
  { id: 'solid-roof-estanqueidad', chip: 'pergolas', tema: 'solid-roof-pergolas', origen: 'ficha' },
  { id: 'solid-roof-ventilador-tv', chip: 'pergolas', tema: 'solid-roof-pergolas', origen: 'ficha' },
  { id: 'solid-roof-mantenimiento', chip: 'pergolas', tema: 'solid-roof-pergolas', origen: 'ficha' },
  { id: 'solid-roof-permiso-broward', chip: 'pergolas', tema: 'solid-roof-pergolas', origen: 'ficha', enlace: '/countries/broward', claves: ['Broward'] },
  { id: 'sukkha-diferencia', chip: 'pergolas', tema: 'sukkha', origen: 'ficha', claves: ['Sukkha 3000'] },
  { id: 'sukkha-personalizacion', chip: 'pergolas', tema: 'sukkha', origen: 'ficha', claves: ['Sukkha 3000'] },
  { id: 'sukkha-huracan', chip: 'pergolas', tema: 'sukkha', origen: 'ficha', claves: ['Sukkha 3000', 'HVHZ'] },
  { id: 'sukkha-domotica', chip: 'pergolas', tema: 'sukkha', origen: 'ficha', claves: ['Sukkha 3000'] },
  { id: 'sukkha-permanente', chip: 'pergolas', tema: 'sukkha', origen: 'ficha', claves: ['Sukkha 3000'] },
  { id: 'concrete-armado', chip: 'obra', tema: 'concrete', origen: 'ficha' },
  { id: 'concrete-fraguado', chip: 'obra', tema: 'concrete', origen: 'ficha' },
  { id: 'concrete-permiso', chip: 'obra', tema: 'concrete', origen: 'ficha' },
  { id: 'concrete-soporte', chip: 'obra', tema: 'concrete', origen: 'ficha', enlace: '/services/deck-builders' },
  { id: 'concrete-durabilidad', chip: 'obra', tema: 'concrete', origen: 'ficha' },
  { id: 'decks-material', chip: 'obra', tema: 'deck-builders', origen: 'ficha' },
  { id: 'decks-permiso', chip: 'obra', tema: 'deck-builders', origen: 'ficha' },
  { id: 'decks-durabilidad', chip: 'obra', tema: 'deck-builders', origen: 'ficha' },
  { id: 'decks-pergola', chip: 'obra', tema: 'deck-builders', origen: 'ficha', enlace: '/services/pergola-design-construction' },
  { id: 'decks-revalorizacion', chip: 'obra', tema: 'deck-builders', origen: 'ficha' },
  { id: 'driveways-material', chip: 'obra', tema: 'driveways', origen: 'ficha' },
  { id: 'driveways-permiso', chip: 'obra', tema: 'driveways', origen: 'ficha' },
  { id: 'driveways-durabilidad', chip: 'obra', tema: 'driveways', origen: 'ficha' },
  { id: 'driveways-sustitucion', chip: 'obra', tema: 'driveways', origen: 'ficha' },
  { id: 'driveways-revalorizacion', chip: 'obra', tema: 'driveways', origen: 'ficha' },
  { id: 'fences-material', chip: 'obra', tema: 'fence-solutions', origen: 'ficha' },
  { id: 'fences-permiso', chip: 'obra', tema: 'fence-solutions', origen: 'ficha' },
  { id: 'fences-durabilidad', chip: 'obra', tema: 'fence-solutions', origen: 'ficha' },
  { id: 'fences-viento', chip: 'obra', tema: 'fence-solutions', origen: 'ficha' },
  { id: 'fences-revalorizacion', chip: 'obra', tema: 'fence-solutions', origen: 'ficha' },
  { id: 'patio-permiso', chip: 'obra', tema: 'patio-remodeling', origen: 'ficha' },
  { id: 'patio-plazo', chip: 'obra', tema: 'patio-remodeling', origen: 'ficha' },
  { id: 'patio-pergola', chip: 'obra', tema: 'patio-remodeling', origen: 'ficha', enlace: '/services/pergola-design-construction' },
  { id: 'patio-revalorizacion', chip: 'obra', tema: 'patio-remodeling', origen: 'ficha' },
  { id: 'patio-material', chip: 'obra', tema: 'patio-remodeling', origen: 'ficha', enlace: '/services/pavers' },
  { id: 'pavers-durabilidad', chip: 'obra', tema: 'pavers', origen: 'ficha' },
  { id: 'pavers-vs-hormigon', chip: 'obra', tema: 'pavers', origen: 'ficha', enlace: '/services/concrete' },
  { id: 'pavers-drenaje', chip: 'obra', tema: 'pavers', origen: 'ficha' },
  { id: 'pavers-plazo', chip: 'obra', tema: 'pavers', origen: 'ficha' },
  { id: 'pavers-revalorizacion', chip: 'obra', tema: 'pavers', origen: 'ficha' },
  { id: 'pergola-build-permiso', chip: 'obra', tema: 'pergola-design-construction', origen: 'ficha' },
  { id: 'pergola-build-material', chip: 'obra', tema: 'pergola-design-construction', origen: 'ficha' },
  { id: 'pergola-build-plazo', chip: 'obra', tema: 'pergola-design-construction', origen: 'ficha' },
  { id: 'pergola-build-lamas-inversion', chip: 'obra', tema: 'pergola-design-construction', origen: 'ficha', enlace: '/products/motorized-louvered-pergolas' },
  { id: 'pergola-build-precio', chip: 'obra', tema: 'pergola-design-construction', origen: 'ficha' },
];

/** Las de un chip, con las destacadas delante. */
export const porChip = (chip: Chip): Faq[] =>
  FAQS.filter((f) => f.chip === chip).sort((a, b) => Number(!!b.destacada) - Number(!!a.destacada));

/**
 * Identificadores de la pagina original en Webflow. Los importan las DOS rutas
 * (/resources/faq y /es/resources/faq) para que el `wfPage` sea el mismo por
 * construccion: check:i18n compara la gemela inglesa por ahi.
 */
export const WF_PAGE = '698a9142e6163442c33e9532';
export const WF_SITE = '6903b7794d5df3d76a7a2488';
