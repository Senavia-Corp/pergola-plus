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
  | 'deck-builders' | 'fence-solutions' | 'full-outdoor-remodel'
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
  'deck-builders', 'fence-solutions', 'full-outdoor-remodel',
]);

/**
 * Preguntas de la biblioteca que ADEMAS se pintan en la ficha de ese tema.
 *
 * La ficha migrada trae cinco preguntas verbatim en su HTML; estas suben desde la
 * biblioteca, donde ya estan escritas y traducidas. Esa es la mitad barata del
 * rediseño: no hay que redactar nada, hay que traerlo.
 *
 * ESTA LISTA LA LEEN DOS SITIOS Y ESE ES EL PUNTO: el componente que las pinta
 * (src/components/FaqPromovidas.astro) y el `FAQPage` del JSON-LD. Google exige que
 * las preguntas del markup sean EXACTAMENTE las que se ven en la pagina, asi que
 * quitar un `id` de aqui tiene que quitarlo de los dos a la vez. Con dos listas, un
 * dia declararian cosas distintas y el markup pasaria a ser spam.
 *
 * Las dos que NO suben —`pergola-lamas-que-angulo` y `material-lamas-sin-luz`— son
 * la materia prima de la seccion «Como funciona». Reparto cerrado, cero duplicacion.
 */
export const PROMOVIDAS: Record<string, string[]> = {
  'motorized-louvered-pergolas': [
    'material-lamas-mecanismo',
    'material-sensor-lluvia-falla',
    'pergola-lamas-cuanto-duran',
  ],
  // Las tres de cubierta maciza son NUEVAS de esta sesion, y hay un motivo: la
  // biblioteca solo tenia UNA propia para este tema (`material-techo-aislado`) frente
  // a las cinco del piloto. Las otras cinco del tema son copy del cliente
  // (`origen: 'ficha'`) en el registro que F4a desmonto —«Absolutely», «Virtually
  // none», «never rust», «pristine»— y promover eso a `FAQPage` seria afirmarle a
  // Google exactamente lo que la §8 de esta misma pagina se niega a afirmar.
  //
  // El criterio es el ORIGEN, nunca el vocabulario: filtrar por palabras no funciona,
  // porque el español dice lo mismo mas calmado y se escapa entero.
  'solid-roof-pergolas': [
    'material-techo-aislado',
    'solid-roof-techo-visto',
    'solid-roof-desague-oculto',
  ],
  // Las tres de cortinas ya estaban escritas y traducidas, y las tres dicen algo que
  // le baja el ticket a quien las publica: que hacen falta menos de las que se piden,
  // que de noche la privacidad se invierte y que no son una persiana de huracan. Por
  // eso son exactamente las que suben.
  'motorized-screens': [
    'material-cortinas-viento',
    'material-cortinas-privacidad',
    'pergola-cortinas-cuantas',
  ],
  // Las tres propias del tema, y las tres dicen algo que el folleto callaba: que la
  // capa UV solo funciona por una cara, que llueve mas ruidoso que una cubierta maciza
  // y cuando conviene la otra. Ninguna de las cinco migradas sube: son «Yes», «No»,
  // «Absolutely» y «Yes!».
  'polycarbonate-pergolas': [
    'material-policarbonato-vida',
    'material-policarbonato-ruido',
    'pergola-policarbonato-vs-macizo',
  ],
};

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
  { id: 'revalorizacion-vivienda', chip: 'precios', tema: 'general-precios', origen: 'pagina', enlace: '/project-gallery', destacada: true },
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
  { id: 'solid-roof-permiso-broward', chip: 'pergolas', tema: 'solid-roof-pergolas', origen: 'ficha', enlace: '/countries/broward-county-pergola-contractor', claves: ['Broward'] },
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
  { id: 'patio-permiso', chip: 'obra', tema: 'full-outdoor-remodel', origen: 'ficha' },
  { id: 'patio-plazo', chip: 'obra', tema: 'full-outdoor-remodel', origen: 'ficha' },
  { id: 'patio-pergola', chip: 'obra', tema: 'full-outdoor-remodel', origen: 'ficha', enlace: '/services/pergola-design-construction' },
  { id: 'patio-revalorizacion', chip: 'obra', tema: 'full-outdoor-remodel', origen: 'ficha' },
  { id: 'patio-material', chip: 'obra', tema: 'full-outdoor-remodel', origen: 'ficha', enlace: '/services/pavers' },
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

  /* --- Escritas para la biblioteca, no migradas de ninguna ficha. --- */
  {
    id: 'permiso-cuanto-tarda',
    chip: 'permisos',
    tema: 'general-permisos',
    origen: 'nueva',
    claves: ['Miami-Dade', 'Broward', 'Palm Beach'],
  },
  { id: 'permiso-quien-lo-tramita', chip: 'permisos', tema: 'general-permisos', origen: 'nueva' },
  { id: 'permiso-sin-permiso-riesgo', chip: 'permisos', tema: 'general-permisos', origen: 'nueva' },
  {
    id: 'permiso-noa-que-es',
    chip: 'permisos',
    tema: 'general-permisos',
    origen: 'nueva',
    claves: ['NOA', 'Miami-Dade', 'HVHZ', 'FPA'],
  },
  {
    id: 'permiso-hvhz-que-es',
    chip: 'permisos',
    tema: 'general-permisos',
    origen: 'nueva',
    claves: ['HVHZ', 'Miami-Dade', 'Broward'],
  },
  { id: 'permiso-palm-beach', chip: 'permisos', tema: 'general-permisos', origen: 'nueva', claves: ['Palm Beach'] },
  { id: 'permiso-broward', chip: 'permisos', tema: 'general-permisos', origen: 'nueva', claves: ['Broward', 'HVHZ'] },
  {
    id: 'permiso-miami-dade',
    chip: 'permisos',
    tema: 'general-permisos',
    origen: 'nueva',
    claves: ['Miami-Dade', 'NOA', 'HVHZ'],
  },
  { id: 'permiso-retranqueos', chip: 'permisos', tema: 'general-permisos', origen: 'nueva' },
  { id: 'permiso-electricidad', chip: 'permisos', tema: 'general-permisos', origen: 'nueva' },
  { id: 'permiso-inspecciones', chip: 'permisos', tema: 'general-permisos', origen: 'nueva' },
  { id: 'permiso-cierre-expediente', chip: 'permisos', tema: 'general-permisos', origen: 'nueva' },
  { id: 'permiso-hoa-plazo', chip: 'permisos', tema: 'general-permisos', origen: 'nueva', claves: ['HOA'] },
  { id: 'permiso-hoa-rechazo', chip: 'permisos', tema: 'general-permisos', origen: 'nueva', claves: ['HOA'] },
  { id: 'permiso-carga-viento', chip: 'permisos', tema: 'general-permisos', origen: 'nueva', claves: ['HVHZ'] },
  { id: 'permiso-piscina-barrera', chip: 'permisos', tema: 'screen-enclosures', origen: 'nueva' },
  { id: 'permiso-ampliar-existente', chip: 'permisos', tema: 'general-permisos', origen: 'nueva' },
  { id: 'permiso-anclaje-losa', chip: 'permisos', tema: 'general-permisos', origen: 'nueva' },
  { id: 'permiso-alquiler-vacacional', chip: 'permisos', tema: 'general-permisos', origen: 'nueva' },
  { id: 'permiso-arbol', chip: 'permisos', tema: 'general-permisos', origen: 'nueva' },
  { id: 'permiso-servidumbre', chip: 'permisos', tema: 'general-permisos', origen: 'nueva' },
  { id: 'permiso-topografico', chip: 'permisos', tema: 'general-permisos', origen: 'nueva' },
  { id: 'permiso-costa-corrosion-codigo', chip: 'permisos', tema: 'general-permisos', origen: 'nueva' },
  { id: 'permiso-planos-sellados', chip: 'permisos', tema: 'general-permisos', origen: 'nueva' },
  { id: 'permiso-cocina-exterior', chip: 'permisos', tema: 'general-permisos', origen: 'nueva' },
  { id: 'permiso-vecino', chip: 'permisos', tema: 'general-permisos', origen: 'nueva' },
  { id: 'permiso-seguro-vivienda', chip: 'permisos', tema: 'general-permisos', origen: 'nueva' },
  { id: 'permiso-impuestos', chip: 'permisos', tema: 'general-permisos', origen: 'nueva' },
  { id: 'permiso-generador-solar', chip: 'permisos', tema: 'solar-pergolas', origen: 'nueva', claves: ['kW'] },
  { id: 'permiso-cambios-en-obra', chip: 'permisos', tema: 'general-permisos', origen: 'nueva' },
  { id: 'precio-que-incluye', chip: 'precios', tema: 'general-precios', origen: 'nueva' },
  { id: 'precio-por-que-varia', chip: 'precios', tema: 'general-precios', origen: 'nueva' },
  { id: 'precio-financiacion', chip: 'precios', tema: 'general-precios', origen: 'nueva' },
  { id: 'precio-forma-de-pago', chip: 'precios', tema: 'general-precios', origen: 'nueva' },
  { id: 'precio-presupuesto-gratis', chip: 'precios', tema: 'general-proceso', origen: 'nueva' },
  { id: 'precio-cuanto-cuesta-cabana', chip: 'precios', tema: 'cabanas', origen: 'nueva' },
  { id: 'precio-cuanto-cuesta-cerramiento', chip: 'precios', tema: 'screen-enclosures', origen: 'nueva' },
  { id: 'precio-motorizada-vs-fija', chip: 'precios', tema: 'general-precios', origen: 'nueva' },
  { id: 'precio-mantenimiento-anual', chip: 'precios', tema: 'general-precios', origen: 'nueva' },
  { id: 'precio-garantia-cubre', chip: 'precios', tema: 'general-empresa', origen: 'nueva' },
  { id: 'precio-garantia-transferible', chip: 'precios', tema: 'general-empresa', origen: 'nueva' },
  { id: 'precio-plazo-total', chip: 'precios', tema: 'general-proceso', origen: 'nueva' },
  { id: 'precio-obra-molestias', chip: 'precios', tema: 'general-proceso', origen: 'nueva' },
  { id: 'precio-lluvia-retrasos', chip: 'precios', tema: 'general-proceso', origen: 'nueva' },
  { id: 'precio-sobrecostes', chip: 'precios', tema: 'general-precios', origen: 'nueva' },
  { id: 'precio-comparar-presupuestos', chip: 'precios', tema: 'general-precios', origen: 'nueva' },
  { id: 'precio-barato-riesgo', chip: 'precios', tema: 'general-precios', origen: 'nueva' },
  { id: 'precio-deposito-cancelacion', chip: 'precios', tema: 'general-precios', origen: 'nueva' },
  { id: 'precio-precio-fijo', chip: 'precios', tema: 'general-precios', origen: 'nueva' },
  { id: 'precio-retorno-inversion', chip: 'precios', tema: 'general-precios', origen: 'nueva' },
  { id: 'precio-fases', chip: 'precios', tema: 'general-precios', origen: 'nueva' },
  { id: 'precio-tasas-permiso', chip: 'precios', tema: 'general-precios', origen: 'nueva' },
  { id: 'precio-losa-aparte', chip: 'precios', tema: 'general-precios', origen: 'nueva' },
  { id: 'precio-visita-necesaria', chip: 'precios', tema: 'general-proceso', origen: 'nueva' },
  { id: 'precio-descuento-temporada', chip: 'precios', tema: 'general-precios', origen: 'nueva' },
  { id: 'precio-plazo-cerramiento', chip: 'precios', tema: 'screen-enclosures', origen: 'nueva' },
  { id: 'precio-reparar-vs-sustituir', chip: 'precios', tema: 'screen-enclosures', origen: 'nueva' },
  { id: 'precio-adoquin-vs-hormigon-coste', chip: 'precios', tema: 'pavers', origen: 'nueva' },
  { id: 'precio-emergencia-tormenta', chip: 'precios', tema: 'general-empresa', origen: 'nueva' },
  { id: 'precio-quien-instala', chip: 'precios', tema: 'general-empresa', origen: 'nueva' },
  { id: 'material-aluminio-extruido', chip: 'materiales', tema: 'general-materiales', origen: 'nueva' },
  { id: 'material-lacado', chip: 'materiales', tema: 'general-materiales', origen: 'nueva' },
  { id: 'material-colores', chip: 'materiales', tema: 'general-materiales', origen: 'nueva' },
  { id: 'material-color-oscuro-calor', chip: 'materiales', tema: 'general-materiales', origen: 'nueva' },
  { id: 'material-salitre-primera-linea', chip: 'materiales', tema: 'general-materiales', origen: 'nueva' },
  { id: 'material-galvanica', chip: 'materiales', tema: 'general-materiales', origen: 'nueva' },
  { id: 'material-limpieza', chip: 'materiales', tema: 'general-materiales', origen: 'nueva' },
  { id: 'material-moho-verdin', chip: 'materiales', tema: 'general-materiales', origen: 'nueva' },
  { id: 'material-madera-vs-aluminio-detalle', chip: 'materiales', tema: 'general-materiales', origen: 'nueva' },
  { id: 'material-vinilo-pvc', chip: 'materiales', tema: 'general-materiales', origen: 'nueva' },
  { id: 'material-policarbonato-vida', chip: 'materiales', tema: 'polycarbonate-pergolas', origen: 'nueva' },
  { id: 'material-policarbonato-ruido', chip: 'materiales', tema: 'polycarbonate-pergolas', origen: 'nueva' },
  { id: 'material-techo-aislado', chip: 'materiales', tema: 'solid-roof-pergolas', origen: 'nueva' },
  { id: 'material-techo-aislado-lucernario', chip: 'materiales', tema: 'solid-roof-pergolas', origen: 'nueva' },
  { id: 'solid-roof-techo-visto', chip: 'materiales', tema: 'solid-roof-pergolas', origen: 'nueva' },
  { id: 'solid-roof-desague-oculto', chip: 'materiales', tema: 'solid-roof-pergolas', origen: 'nueva' },
  { id: 'material-mosquitera-tipos', chip: 'materiales', tema: 'screen-enclosures', origen: 'nueva' },
  { id: 'material-mosquitera-duracion', chip: 'materiales', tema: 'screen-enclosures', origen: 'nueva' },
  { id: 'material-lamas-mecanismo', chip: 'materiales', tema: 'motorized-louvered-pergolas', origen: 'nueva' },
  { id: 'material-lamas-sin-luz', chip: 'materiales', tema: 'motorized-louvered-pergolas', origen: 'nueva' },
  { id: 'material-sensor-lluvia-falla', chip: 'materiales', tema: 'motorized-louvered-pergolas', origen: 'nueva' },
  { id: 'material-domotica', chip: 'materiales', tema: 'general-materiales', origen: 'nueva' },
  { id: 'material-ventilador-peso', chip: 'materiales', tema: 'general-materiales', origen: 'nueva' },
  { id: 'material-calefactor', chip: 'materiales', tema: 'general-materiales', origen: 'nueva' },
  { id: 'material-iluminacion', chip: 'materiales', tema: 'general-materiales', origen: 'nueva' },
  { id: 'material-drenaje-adonde', chip: 'materiales', tema: 'general-materiales', origen: 'nueva' },
  {
    id: 'material-cortinas-viento',
    chip: 'materiales',
    tema: 'motorized-screens',
    origen: 'nueva',
    claves: ['Fenetex'],
  },
  { id: 'material-cortinas-privacidad', chip: 'materiales', tema: 'motorized-screens', origen: 'nueva' },
  { id: 'material-cristal-vs-mosquitera', chip: 'materiales', tema: 'screen-enclosures', origen: 'nueva' },
  { id: 'material-suelo-bajo', chip: 'materiales', tema: 'general-materiales', origen: 'nueva' },
  { id: 'material-abejas-nidos', chip: 'materiales', tema: 'general-materiales', origen: 'nueva' },
  { id: 'material-repintar', chip: 'materiales', tema: 'general-materiales', origen: 'nueva' },
  { id: 'material-reciclable', chip: 'materiales', tema: 'general-materiales', origen: 'nueva' },
  { id: 'material-huracan-desmontar', chip: 'materiales', tema: 'general-materiales', origen: 'nueva' },
  { id: 'pergola-adosada-vs-exenta', chip: 'pergolas', tema: 'general-pergolas', origen: 'nueva' },
  { id: 'pergola-tamano-tipico', chip: 'pergolas', tema: 'general-pergolas', origen: 'nueva' },
  { id: 'pergola-orientacion', chip: 'pergolas', tema: 'general-pergolas', origen: 'nueva' },
  { id: 'pergola-cuanta-sombra', chip: 'pergolas', tema: 'open-air-pergolas', origen: 'nueva' },
  { id: 'pergola-lluvia-abierta', chip: 'pergolas', tema: 'open-air-pergolas', origen: 'nueva' },
  { id: 'pergola-convertir-existente', chip: 'pergolas', tema: 'general-pergolas', origen: 'nueva' },
  { id: 'pergola-lamas-que-angulo', chip: 'pergolas', tema: 'motorized-louvered-pergolas', origen: 'nueva' },
  { id: 'pergola-lamas-cuanto-duran', chip: 'pergolas', tema: 'motorized-louvered-pergolas', origen: 'nueva' },
  { id: 'pergola-solar-cuanto-produce', chip: 'pergolas', tema: 'solar-pergolas', origen: 'nueva', claves: ['kW'] },
  { id: 'pergola-solar-sombra-debajo', chip: 'pergolas', tema: 'solar-pergolas', origen: 'nueva' },
  {
    id: 'pergola-sukkha-diferencia-detalle',
    chip: 'pergolas',
    tema: 'sukkha',
    origen: 'nueva',
    claves: ['Sukkha 3000'],
  },
  { id: 'pergola-cuantos-pilares', chip: 'pergolas', tema: 'general-pergolas', origen: 'nueva' },
  { id: 'pergola-altura', chip: 'pergolas', tema: 'general-pergolas', origen: 'nueva' },
  { id: 'pergola-piscina-cloro', chip: 'pergolas', tema: 'general-pergolas', origen: 'nueva' },
  { id: 'pergola-viento-ruido', chip: 'pergolas', tema: 'general-pergolas', origen: 'nueva' },
  { id: 'pergola-carport-coche', chip: 'sombra', tema: 'carports', origen: 'nueva' },
  { id: 'pergola-carport-granizo', chip: 'sombra', tema: 'carports', origen: 'nueva' },
  { id: 'pergola-cabana-bano', chip: 'sombra', tema: 'cabanas', origen: 'nueva' },
  { id: 'pergola-cabana-almacen', chip: 'sombra', tema: 'cabanas', origen: 'nueva' },
  { id: 'pergola-cerramiento-mansarda', chip: 'sombra', tema: 'screen-enclosures', origen: 'nueva' },
  { id: 'pergola-cerramiento-hojas', chip: 'sombra', tema: 'screen-enclosures', origen: 'nueva' },
  { id: 'pergola-cortinas-instalar-despues', chip: 'sombra', tema: 'motorized-screens', origen: 'nueva' },
  { id: 'pergola-cortinas-mascotas', chip: 'sombra', tema: 'motorized-screens', origen: 'nueva' },
  { id: 'pergola-cortinas-cuantas', chip: 'sombra', tema: 'motorized-screens', origen: 'nueva' },
  { id: 'pergola-cerramiento-mascota', chip: 'sombra', tema: 'screen-enclosures', origen: 'nueva' },
  { id: 'pergola-policarbonato-vs-macizo', chip: 'pergolas', tema: 'polycarbonate-pergolas', origen: 'nueva' },
  { id: 'pergola-nieve-carga', chip: 'pergolas', tema: 'general-pergolas', origen: 'nueva' },
  { id: 'pergola-fabricacion-medida', chip: 'pergolas', tema: 'general-pergolas', origen: 'nueva' },
  { id: 'pergola-comercial', chip: 'pergolas', tema: 'general-pergolas', origen: 'nueva' },
  { id: 'pergola-garantia-viento', chip: 'pergolas', tema: 'general-pergolas', origen: 'nueva' },
  { id: 'obra-adoquin-hundimiento', chip: 'obra', tema: 'pavers', origen: 'nueva' },
  { id: 'obra-adoquin-sellado', chip: 'obra', tema: 'pavers', origen: 'nueva' },
  { id: 'obra-adoquin-hierba', chip: 'obra', tema: 'pavers', origen: 'nueva' },
  { id: 'obra-adoquin-piscina-caliente', chip: 'obra', tema: 'pavers', origen: 'nueva' },
  { id: 'obra-adoquin-entrada-coche', chip: 'obra', tema: 'driveways', origen: 'nueva' },
  { id: 'obra-entrada-manchas-aceite', chip: 'obra', tema: 'driveways', origen: 'nueva' },
  { id: 'obra-hormigon-grietas', chip: 'obra', tema: 'concrete', origen: 'nueva' },
  { id: 'obra-hormigon-pisar', chip: 'obra', tema: 'concrete', origen: 'nueva' },
  { id: 'obra-hormigon-vs-adoquin-cual', chip: 'obra', tema: 'concrete', origen: 'nueva' },
  { id: 'obra-drenaje-patio', chip: 'obra', tema: 'full-outdoor-remodel', origen: 'nueva' },
  { id: 'obra-patio-cuanto-dura-obra', chip: 'obra', tema: 'full-outdoor-remodel', origen: 'nueva' },
  { id: 'obra-patio-por-donde-empezar', chip: 'obra', tema: 'full-outdoor-remodel', origen: 'nueva' },
  { id: 'obra-deck-material-cual', chip: 'obra', tema: 'deck-builders', origen: 'nueva' },
  { id: 'obra-deck-sobre-hormigon', chip: 'obra', tema: 'deck-builders', origen: 'nueva' },
  { id: 'obra-valla-aluminio-vs-pvc', chip: 'obra', tema: 'fence-solutions', origen: 'nueva' },
  { id: 'obra-valla-piscina-normativa', chip: 'obra', tema: 'fence-solutions', origen: 'nueva' },
  { id: 'obra-valla-lindero', chip: 'obra', tema: 'fence-solutions', origen: 'nueva' },
  { id: 'obra-valla-huracan', chip: 'obra', tema: 'fence-solutions', origen: 'nueva' },
  { id: 'obra-hormigon-espesor', chip: 'obra', tema: 'concrete', origen: 'nueva' },
  { id: 'obra-cuanto-dura-adoquin', chip: 'obra', tema: 'pavers', origen: 'nueva' },
  { id: 'obra-reutilizar-adoquin', chip: 'obra', tema: 'pavers', origen: 'nueva' },
  { id: 'obra-pergola-sobre-deck', chip: 'obra', tema: 'deck-builders', origen: 'nueva' },
  { id: 'obra-riego-jardin', chip: 'obra', tema: 'full-outdoor-remodel', origen: 'nueva' },
  { id: 'obra-cesped-reparar', chip: 'obra', tema: 'full-outdoor-remodel', origen: 'nueva' },
  { id: 'obra-entrada-ancho', chip: 'obra', tema: 'driveways', origen: 'nueva' },
  { id: 'obra-entrada-acera', chip: 'obra', tema: 'driveways', origen: 'nueva' },
  { id: 'obra-suelo-arena-florida', chip: 'obra', tema: 'concrete', origen: 'nueva' },
  { id: 'obra-licencia-contratista', chip: 'obra', tema: 'general-empresa', origen: 'nueva' },
  { id: 'obra-lien-garantia', chip: 'obra', tema: 'general-empresa', origen: 'nueva' },
  { id: 'obra-contrato-que-mirar', chip: 'obra', tema: 'general-empresa', origen: 'nueva' },
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
