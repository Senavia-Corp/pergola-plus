/**
 * Lo propio de las siete paginas de servicio.
 *
 * `scripts/lib/transformar.mjs` tiene el molde —`recomponerServicio`, el paso 6f— y
 * aqui vive lo que cambia de un servicio a otro. Mismo reparto que
 * `fichas.mjs` para los productos.
 *
 * ───────────────────────────────────────────────────────────────────────────────
 * ESTO NO ES `recomponerFicha`, Y NO DEBE SERLO
 *
 * De los catorce pasos de la ficha de producto, a un servicio le aplica UNO: poner
 * `alt` donde hay `alt=""`. Los otros trece no tienen dato de origen o duplicarian
 * algo que la pagina ya trae:
 *
 *   §8 especificaciones  un servicio no tiene material, acabado ni dimensiones;
 *   §9 «One We Built»    las siete YA traen una banda `projects` con 10 proyectos
 *                        reales, y las etiquetas del CMS son de PRODUCTO
 *                        («Solid Roof Pergolas», «Cabanas»…): no hay ni una de
 *                        servicio con la que filtrar;
 *   comparativo          compara los diez productos entre si.
 *
 * Copiar el molde entero habria sido diez veces mas codigo para ejecutar un paso.
 *
 * ───────────────────────────────────────────────────────────────────────────────
 * LOS `alt` DE GALERIA NO SE ESCRIBEN AQUI, SE DERIVAN
 *
 * Medido sobre las siete: la galeria del carrusel son EXACTAMENTE las mismas cinco
 * fotos que la rejilla `feature`, en otro orden — y esas ya llevan `alt` escrito por
 * el cliente (comprobado contra `docs/vivo/services__*.html`). Escribir un texto
 * nuevo para la misma foto seria inventar una segunda descripcion de algo que ya
 * esta descrito, y el dia que el cliente cambie la suya las dos dirian cosas
 * distintas.
 *
 * Asi que el paso 6f rellena la galeria copiando el `alt` de la MISMA foto, por
 * `src`. Es tambien lo que hace que la traduccion salga gratis: misma cadena
 * inglesa, misma entrada del diccionario de `servicios.es.ts`.
 *
 * `pergola-design-construction` es la excepcion: sus quince diapositivas son fotos
 * de galeria de PRODUCTO —viven en `/cms-img/products/…`— y no aparecen en su
 * rejilla `feature`. Sus `alt` salen de `pies` en `fichas.mjs`, que es donde ya
 * estan escritos y traducidos.
 *
 * ───────────────────────────────────────────────────────────────────────────────
 * LO QUE SI SE ESCRIBE AQUI: CATORCE `alt`
 *
 * El hero (`img-cover-service`) y la portada de `intro-location` de cada servicio
 * llegaban con `alt=""` y no tienen gemela en ninguna otra parte de la pagina. Los
 * catorce se escribieron MIRANDO LA FOTO, compuesta a PNG con `sharp` porque `Read`
 * no decodifica AVIF.
 *
 * NI UNA CIUDAD, NI UNA CIFRA, NI UNA CERTIFICACION. Los diecisiete `alt` de
 * `cta-slots.mjs` son prompts de IA que sobrevivieron a su generador y dicen ciudades
 * inventadas y escenas que la foto no muestra; no se repite el error. Aqui solo se
 * describe lo que se ve. Antes de escribir un acabado, un plazo o una garantia:
 * `grep -rli <termino> docs/vivo/`.
 *
 * Y OJO CON EL NOMBRE DEL FICHERO, QUE MIENTE. La portada de `concrete` se llama
 * `intro-custom-concrete-driveway-…` y la foto es un PATIO, no una entrada de
 * coches. El `alt` describe la foto, no su nombre.
 */

/**
 * `alt` del hero y de la portada de intro, por servicio.
 *
 * La clave es el nombre de fichero, no el slug: `full-outdoor-remodel` guarda sus
 * fotos en `/cms-img/services/patio-remodeling/`, asi que una clave por slug daria
 * la carpeta equivocada.
 */
export const ALT_SERVICIOS = {
  // ── pergola-design-construction ────────────────────────────────────────────
  'custom-pergolas-and-patio-covers':
    'White aluminum patio cover with a louvered section and a solid roof section, '
    + 'attached to a home above a pool deck and a stacked-stone bar.',
  'intro-insulated-roof-pergola-builders-south-florida-07':
    'Under a covered patio: wood-grain slatted ceiling, ceiling fan, a louvered '
    + 'privacy screen and a dining table for eight.',

  // ── pavers ─────────────────────────────────────────────────────────────────
  'pavers':
    'Large-format grey paver patio laid in a grid with planted turf joints, beside '
    + 'a pool.',
  'intro-custom-paver-driveway-south-florida-project':
    'Herringbone paver driveway in mixed greys running up to a modern two-story '
    + 'home, with a linear trench drain across it.',

  // ── driveways ──────────────────────────────────────────────────────────────
  'meith-driveway-2':
    'Grey brick-paver driveway curving up to a single-story home behind a lawn and '
    + 'palms.',
  'intro-luxury-stone-driveway-palm-beach-project':
    'Wide motor court in light grey pavers opening in front of a two-story home '
    + 'with stone columns and a metal roof.',

  // ── concrete ───────────────────────────────────────────────────────────────
  // El nombre del fichero dice «patio foundation» y la foto es eso: la losa ANTES
  // de vaciar. Es la unica de las catorce que ensena obra a medio hacer.
  'cover-structural-concrete-patio-foundation-florida-project':
    'Formed slab ready for the pour: timber formwork, compacted gravel base and '
    + 'welded wire reinforcement on chairs, beside the pool deck.',
  // El fichero se llama «driveway» y la foto es un PATIO. Manda la foto.
  'intro-custom-concrete-driveway-south-florida-project':
    'Finished concrete patio with saw-cut joints, a lounge set and potted plants '
    + 'against sliding glass doors.',

  // ── deck-builders ──────────────────────────────────────────────────────────
  'cover-composite-deck-installation-south-florida-project':
    'Multi-level grey composite deck stepping down from a covered patio, with cable '
    + 'railing, a lounge set and a fire table.',
  'intro-multi-level-deck-florida-project':
    'Raised grey composite deck with black cable railing, wet from rain, looking '
    + 'out over dense tropical planting.',

  // ── fence-solutions ────────────────────────────────────────────────────────
  'cover-aluminum-fence-installation-south-florida-project':
    'Black horizontal-slat aluminum fence along the front boundary of a two-story '
    + 'home, with layered tropical planting behind it.',
  'intro-privacy-fence-south-florida-project':
    'Black horizontal-slat fence with a matching sliding driveway gate meeting the '
    + 'paver apron at the street.',

  // ── full-outdoor-remodel ───────────────────────────────────────────────────
  // Es un conjunto residencial frente al mar, no una casa: la foto la eligio el
  // cliente como hero de esta pagina y se describe por lo que ensena.
  'full-outdoor-remodel':
    'Aerial view of an oceanfront residential community: lawn, curving walkways, a '
    + 'pool with loungers and two shade cabanas, and the coast road beyond.',
  'intro-outdoor-living-patio-remodel-florida-project':
    'Dark louvered pergola with integrated lighting over an outdoor kitchen and bar, '
    + 'on a composite deck beside a pool at dusk.',
  // Esta la caza la asercion del paso 3, y es un hallazgo por si sola: la rejilla
  // `feature` de este servicio repite la foto `-3` y NUNCA ensena la `-5`, asi que la
  // `-5` solo existe en el carrusel y se quedaba sin gemela de la que copiar el `alt`.
  // El sitio EN VIVO del cliente hace exactamente lo mismo, o sea que el duplicado es
  // SUYO: se reporta, no se arregla — tocarlo romperia la paridad.
  'gallery-patio-remodeling-design-contractors-south-florida-5':
    'Freestanding dark-framed pergola at dusk with its screens lowered and lit strips '
    + 'overhead, sheltering a lounge set, a fire table and an outdoor kitchen beside '
    + 'a pool.',

  // ── Las seis huerfanas de la galeria de pergola-design-construction ────────
  //
  // Sus quince diapositivas son fotos de galeria de PRODUCTO. Ocho traen su `alt`
  // hecho en `pies` de fichas.mjs; estas seis NO, porque su propia ficha las podo
  // —`pies` guarda 6 de 10— y el `alt` se escribe ahi solo para las que sobreviven.
  //
  // NO SE PODAN AQUI TAMBIEN, y el motivo importa: el criterio escrito en el paso 6
  // de `recomponerFicha` es «una foto que ya sale en §4 o §5 repetida abajo» o «una
  // obra sin rematar». Ninguna de las seis es lo uno ni lo otro en ESTA pagina — en
  // su ficha se fueron por ser duplicado ALLI. Extender la poda por «no me gusta»
  // seria inventarse un criterio nuevo.
  //
  // (`gallery-louvered-roof-…-02` es la mas floja de las quince: sale la valla de
  // seguridad de la piscina, juguetes y una manguera por el suelo. No es duplicado ni
  // obra sin rematar, asi que se queda — y va al HANDOFF como foto que el cliente
  // querra cambiar.)
  'intro-polycarbonate-pergola-contractors-south-florida-01':
    'Dark bronze pergola with a slatted roof and a matching louvered privacy screen '
    + 'in a narrow side yard, over paver-and-turf paving.',
  'gallery-polycarbonate-pergola-contractors-south-florida-08':
    'Looking up at a translucent polycarbonate roof on a dark frame, with two ceiling '
    + 'fans below and palms showing through the panels.',
  'gallery-open-air-pergola-builders-south-florida-02':
    'Cream open-slat pergola over a poolside terrace, with striped loungers and an '
    + 'ornate stone screen at one end.',
  'gallery-louvered-roof-pergola-contractors-south-florida-02':
    'Louvered pergola attached to a tile-roof home, shading a paver pool deck behind '
    + 'a safety fence.',
  'gallery-louvered-roof-pergola-contractors-south-florida-04':
    'Dark-framed pergola with white louvers over a paved terrace with a lounge set, '
    + 'against a tall clipped hedge.',
  'gallery-louvered-roof-pergola-contractors-south-florida-06':
    'Close-up of white louvers part-open on a dark beam, with the drive gear that '
    + 'turns them.',
};

/**
 * El `alt` que la ficha de producto ya escribio para una foto suya, o `null`.
 *
 * Las quince diapositivas de `pergola-design-construction` son fotos de
 * `/cms-img/products/<ficha>/`, y ocho de ellas ya tienen `alt` redactado y traducido
 * en `pies`. Reusarlo es lo correcto por dos motivos: es el mismo texto para la misma
 * foto —no puede divergir— y su traduccion ya existe en `productos.es.ts`, indexada
 * por esa misma cadena inglesa.
 *
 * La clave de `pies` es lo que queda del nombre tras quitarle el prefijo de galeria de
 * su ficha, igual que en el paso 6 de `recomponerFicha`.
 */
export function altDeProducto(src, FICHAS) {
  const m = src.match(/^\/cms-img\/products\/([^/]+)\/(.+)\.avif$/);
  if (!m) return null;
  const ficha = FICHAS[m[1]];
  if (!ficha?.galeria) return null;
  const base = m[2];
  const clave = base.startsWith(ficha.galeria.prefijo)
    ? base.slice(ficha.galeria.prefijo.length)
    : base;
  return ficha.pies?.[clave]?.[1] ?? null;
}

/** true si el `src` es una FOTO, y no un icono o un logo decorativo. */
export function esFoto(src) {
  return /\.avif$/.test(src) && (src.startsWith('/cms-img/') || src.startsWith('/images/cliente/'));
}

/**
 * Diapositivas que se retiran de la galeria, con el motivo.
 *
 * `pergola-design-construction` sirve su HERO tambien como diapositiva: medido, la
 * foto sale dos veces en el cuerpo de la pagina. Con el fondo del CTA —que es un
 * recorte de esa misma foto, igual que en el piloto de producto— serian tres.
 * Reusar el hero en el CTA es el patron desplegado; ensenar la misma foto dos veces
 * en el cuerpo no lo es. Es el mismo criterio con el que el detector de duplicados
 * podo cuatro fichas de producto.
 */
export const PODA_GALERIA = {
  'pergola-design-construction': ['/images/cliente/custom-pergolas-and-patio-covers.avif'],
};
