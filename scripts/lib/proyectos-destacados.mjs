/**
 * Los proyectos que NO vienen del CMS de Webflow.
 *
 * Daniel mando tres carpetas de fotos y pidio que salieran LOS PRIMEROS en
 * "Featured Projects" (punto 2c de su correo). No existen en el CMS, asi que no
 * hay captura suya en docs/vivo y los generadores no pueden sacarlos de ahi.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * POR QUE ESTE FICHERO EXISTE, Y POR QUE AQUI
 *
 * Las tarjetas de "Recent Projects" (la home) y de "Featured Projects"
 * (/project-gallery) NO se generan desde datos: son HTML congelado dentro de
 * src/contenido-migrado/estaticas/, que scripts/generar-paginas.mjs REESCRIBE
 * copiando el sitio Webflow en vivo. Y _items.json lo reconstruye
 * scripts/generar-detalle.mjs recorriendo docs/vivo/project__*.html.
 *
 * O sea: editar esos ficheros a mano no aguanta una regeneracion, y
 * `npm run check:generadores` lo caza exactamente por eso —regenera y exige diff
 * cero—. La unica forma estable de anadir un proyecto propio es que los
 * generadores SEPAN de el. Este modulo es ese conocimiento, en un solo sitio:
 * los datos, los ficheros de foto, la ficha, las dos tarjetas y las entradas de
 * _items.json salen todos de la misma tabla y no se pueden desincronizar.
 *
 * Va en scripts/lib/ y no dentro de transformar.mjs a proposito: transformar.mjs
 * pasa de mil lineas y lo consumen nueve scripts, mientras que esto lo necesitan
 * dos. Y generar-paginas.mjs es justo el que escribe esos dos fragmentos, asi que
 * la inyeccion vive al lado de la escritura.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * LO QUE SE COPIA DE LOS 10 EXISTENTES, Y POR QUE
 *
 * Los `data-w-id` NO se inventan: se reusan los que ya comparten las 10 fichas
 * del CMS. En Webflow un data-w-id identifica al ELEMENTO DE LA PLANTILLA, no al
 * item, asi que los diez proyectos traen los mismos tres y sus animaciones IX2
 * enganchan por ellos. Un uuid nuevo no tendria evento asociado y la ficha
 * entraria sin animacion; uno inventado ademas le saldria a auditar-paridad.mjs
 * como "sobrante" frente al sitio vivo.
 *
 * `wfPage` y `wfSite` tambien se reusan: son el id de la PLANTILLA de detalle y
 * el del sitio, iguales en los diez. Sin ellos, BaseLayout deja data-wf-page en
 * undefined.
 */

/**
 * Los tres proyectos.
 *
 * `fotos` es la unica fuente de que archivo sale de que original:
 * optimizar-fotos-proyecto.mjs lo lee para escribir, y la ficha y las tarjetas
 * para referenciar. `hero` y `galeria` apuntan por NOMBRE DE ARCHIVO a esa lista.
 *
 * Los textos estan escritos mirando las fotos, no una plantilla. Lo que se
 * afirma es lo que se ve: los sistemas de techo, los acabados y el uso. No hay
 * datos de obra (medidas, fechas, referencias de producto) porque el cliente no
 * los mando, y ponerlos de relleno seria inventarselos.
 */
export const PROYECTOS = [
  {
    slug: 'forte-pergola-with-outdoor-kitchen-at-elan-polo-club',
    nombre: 'FORTE Pergola with Outdoor Kitchen at Elan Polo Club',
    etiquetas: ['Commercial', 'Solid Roof Pergolas'],
    title: 'FORTE Pergola & Outdoor Kitchen | Elan Polo Club',
    description:
      'Freestanding aluminum pergola with louvered and solid roof sections, recessed '
      + 'lighting and a built-in outdoor kitchen, built as the amenity centerpiece at '
      + 'Elan Polo Club.',
    resumen:
      'A freestanding aluminum pergola combining louvered and solid roof sections over '
      + 'a travertine patio and built-in outdoor kitchen.',
    hero:
      'A freestanding aluminum pergola built as the centerpiece of the amenity lawn at '
      + 'Elan Polo Club. The structure carries two roof systems in one frame: an open '
      + 'louvered section that filters the afternoon sun, and a solid insulated section '
      + 'with recessed downlights and ceiling fans that keeps the dining area comfortable '
      + 'through a South Florida summer. Underneath, a travertine patio and a built-in '
      + 'outdoor kitchen turn a stretch of turf into the space residents actually gather '
      + 'in. The powder-coated aluminum frame is engineered for Florida conditions and '
      + 'asks for no seasonal upkeep.',
    galeriaTexto:
      'The two roof systems, the outdoor kitchen and the travertine patio, from the lawn '
      + 'and from under the structure.',
    fotos: [
      {
        origen: 'Elan Polo Club/IMG_5508.HEIC',
        archivo: 'hero-aluminum-pergola-outdoor-kitchen-elan-polo-club.avif',
        alt: 'Freestanding aluminum pergola with louvered and solid roof sections over a '
          + 'travertine patio and outdoor kitchen at Elan Polo Club, seen across the amenity lawn.',
      },
      {
        origen: 'Elan Polo Club/IMG_5512.HEIC',
        archivo: 'gallery-louvered-and-solid-roof-pergola-elan-polo-club.avif',
        alt: 'Aluminum pergola at Elan Polo Club showing the open louvered roof section beside '
          + 'the solid insulated section with recessed downlights and ceiling fans.',
      },
      {
        origen: 'Elan Polo Club/IMG_5520 2.HEIC',
        archivo: 'gallery-pergola-outdoor-kitchen-paver-patio-elan-polo-club.avif',
        alt: 'Built-in outdoor kitchen and dining area under the aluminum pergola at Elan Polo '
          + 'Club, on a travertine patio bordered by turf.',
      },
    ],
    heroFoto: 'hero-aluminum-pergola-outdoor-kitchen-elan-polo-club.avif',
    galeria: [
      'hero-aluminum-pergola-outdoor-kitchen-elan-polo-club.avif',
      'gallery-louvered-and-solid-roof-pergola-elan-polo-club.avif',
      'gallery-pergola-outdoor-kitchen-paver-patio-elan-polo-club.avif',
    ],
  },
  {
    slug: 'oceanfront-pool-deck-and-cabanas-at-jupiter-ocean-club',
    nombre: 'Oceanfront Pool Deck & Cabanas at Jupiter Ocean Club',
    etiquetas: ['Commercial', 'Cabanas'],
    title: 'Oceanfront Pool Deck & Cabanas | Jupiter Ocean Club',
    description:
      'Resort pool deck in Jupiter with wide paver decking, turf inlays and white '
      + 'flat-roof cabanas, built for an oceanfront community steps from the Atlantic.',
    resumen:
      'A resort pool deck steps from the Atlantic, with wide paver decking, turf inlays '
      + 'and white flat-roof cabanas along the water side.',
    hero:
      'A full resort deck for an oceanfront community in Jupiter, a few hundred feet from '
      + 'the Atlantic. The pool is wrapped in wide paver decking that carries through to '
      + 'the walkways, the spa and the turf inlays, so the whole amenity area reads as one '
      + 'surface instead of a patchwork. White flat-roof cabanas line the deck and give '
      + 'shade where residents actually sit, kept low and open so they never block the '
      + 'water views the property is built around. Everything here lives in salt air, and '
      + 'the structures and paving were specified for it.',
    galeriaTexto:
      'The pool deck, the cabanas and the paver walkways, from above and along the water side.',
    fotos: [
      {
        origen: 'Jupiter Ocean Club/Jupiter OC1 .JPEG',
        archivo: 'hero-oceanfront-pool-deck-cabanas-jupiter-ocean-club.avif',
        alt: 'Aerial view of the oceanfront pool deck at Jupiter Ocean Club, with paver decking, '
          + 'white cabanas and lawn running to the Atlantic.',
      },
      {
        origen: 'Jupiter Ocean Club/Jupiter OC2.JPEG',
        archivo: 'gallery-resort-pool-paver-deck-jupiter-ocean-club.avif',
        alt: 'Resort pool and spa at Jupiter Ocean Club surrounded by wide paver decking, turf '
          + 'inlays and curved walkways, with the ocean beyond.',
      },
      {
        origen: 'Jupiter Ocean Club/Jupiter OC3.JPEG',
        archivo: 'gallery-poolside-cabanas-oceanfront-jupiter.avif',
        alt: 'White flat-roof cabanas along the poolside deck at Jupiter Ocean Club, set among '
          + 'paver paving and tropical landscaping.',
      },
    ],
    heroFoto: 'hero-oceanfront-pool-deck-cabanas-jupiter-ocean-club.avif',
    galeria: [
      'hero-oceanfront-pool-deck-cabanas-jupiter-ocean-club.avif',
      'gallery-resort-pool-paver-deck-jupiter-ocean-club.avif',
      'gallery-poolside-cabanas-oceanfront-jupiter.avif',
    ],
  },
  {
    slug: 'custom-sukkah-pergola-at-boca-beach',
    nombre: 'Custom Sukkah Pergola at Boca Beach',
    etiquetas: ['Commercial', 'Sukkah'],
    title: 'Custom Sukkah Pergola at Boca Beach | Event Terrace',
    description:
      'A white open-air sukkah pergola built over an event terrace at Boca Beach, '
      + 'clear-span across the dining area and dressed with greenery and string lighting.',
    resumen:
      'A white open-air sukkah pergola over an event terrace, clear-span across the dining '
      + 'area and dressed with greenery and string lighting.',
    hero:
      'A white open-air sukkah built over the event terrace at Boca Beach, sized to seat a '
      + 'full reception underneath. The frame runs clear across the dining area, so the '
      + 'tables lay out without a post in the middle of the room and the greenery, string '
      + 'lights and florals hang from the beams themselves. The open roof is the point: it '
      + 'is what the structure is for, and it is also what makes the lighting read the way '
      + 'it does after sunset. Built in the same aluminum system as our pergolas, finished '
      + 'in white to disappear against the terrace.',
    galeriaTexto:
      'The terrace at dusk and after dark, with the structure dressed for a reception.',
    fotos: [
      {
        origen: 'Boca Beach Sukkah/WhatsApp Image 2026-08-10 at 19.35.51.jpeg',
        archivo: 'hero-custom-sukkah-pergola-boca-beach-evening.avif',
        alt: 'White open-air sukkah pergola lit with string lights over an event terrace at Boca '
          + 'Beach after dark, set with round dining tables.',
      },
      {
        origen: 'Boca Beach Sukkah/Sukkah.jpeg',
        archivo: 'gallery-sukkah-pergola-event-terrace-boca-beach.avif',
        alt: 'Sukkah pergola at Boca Beach at dusk, dressed with greenery, florals and lanterns '
          + 'over a reception laid out on the terrace.',
      },
    ],
    heroFoto: 'hero-custom-sukkah-pergola-boca-beach-evening.avif',
    galeria: [
      'hero-custom-sukkah-pergola-boca-beach-evening.avif',
      'gallery-sukkah-pergola-event-terrace-boca-beach.avif',
    ],
  },
];

/* Los tres uuid de la PLANTILLA de Webflow. Verificado uno a uno: los tres son
   IDENTICOS en las 10 fichas del CMS, porque en Webflow un data-w-id identifica al
   elemento de la PLANTILLA, no al item. Aqui solo se usa el de la tarjeta de la
   galeria; los de la ficha vienen ya en la plantilla que se clona. */
const W_ID = {
  tarjetaGaleria: '998fbe51-4b1e-9336-a738-d1d7ffb1592d',
};

const WF = { wfPage: '698dfc0b875d555d87ebd4c2', wfSite: '6903b7794d5df3d76a7a2488' };

const ruta = (p, archivo) => `/cms-img/projects/${p.slug}/${archivo}`;
const foto = (p, archivo) => p.fotos.find((f) => f.archivo === archivo);

/** Escapa lo que va dentro de un atributo HTML. */
const attr = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
/** Escapa lo que va como texto. Los `&` de los titulos ("Pool Deck & Cabanas"). */
const txt = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

/**
 * Las entradas de _items.json. Misma forma que las que saca generar-detalle.mjs
 * de docs/vivo, para que la plantilla de detalle no tenga que distinguirlas.
 */
export const ITEMS = PROYECTOS.map((p) => ({
  slug: p.slug,
  title: p.title,
  description: p.description,
  ogImage: null,
  ...WF,
  tituloSeo: p.title,
  descripcionSeo: p.description,
}));

/** La tarjeta de "Recent Projects" de la home. */
export function tarjetaHome(p) {
  const h = foto(p, p.heroFoto);
  return '<div fs-slider-element="slide" role="listitem" class="fs-slider-projects_slide w-dyn-item">'
    + '<div class="slider-projects"><div class="header-slider-projects">'
    + `<img alt="${attr(h.alt)}" loading="lazy" src="${ruta(p, h.archivo)}" class="slider-image-projects"/>`
    + '</div><div class="slider-card-content">'
    + `<h3>${txt(p.nombre)}</h3><div>${txt(p.resumen)}</div>`
    + '<div class="wrapper-buttons-mini">'
    + `<a href="/project/${p.slug}" class="button w-button">Explore More →</a>`
    + '</div></div></div></div>';
}

/** La tarjeta de "Featured Projects" de /project-gallery. */
export function tarjetaGaleria(p) {
  const h = foto(p, p.heroFoto);
  return `<div data-w-id="${W_ID.tarjetaGaleria}" role="listitem" class="projects-grid-item w-dyn-item">`
    + `<a href="/project/${p.slug}" class="projects-card-page w-inline-block">`
    + `<img src="${ruta(p, h.archivo)}" loading="lazy" alt="${attr(h.alt)}" class="projects-card-image"/>`
    + '<div class="projects-card-body-page"><div class="box-card-body-projects">'
    + p.etiquetas.map((e) => `<div class="box-detail-projects"><div>${txt(e)}</div></div>`).join('')
    + `</div><h3 class="projects-card-h3">${txt(p.nombre)}</h3>`
    + `<div class="projects-card-text">${txt(p.resumen)}</div>`
    + '<div class="projects-card-link-page"><div>Explore More →</div></div>'
    + '</div></a></div>';
}

/**
 * El fragmento de la ficha, DERIVADO de una de las 10 del CMS.
 *
 * No se escribe el markup a mano, y no es por pereza: esa ficha tiene siete
 * contratos que no se ven leyendo el HTML —los siete valores de
 * `fs-slider-element` que exige check:carruseles, la forma exacta del JSON que
 * lee el lightbox de Webflow, las clases de los botones (`button secundary`, con
 * la errata del export), los SVG de las flechas y el par de puntos que el script
 * CLONA (no son uno por slide)—. Escribirlos de memoria es adivinar; clonarlos de
 * una ficha que ya funciona no.
 *
 * Se sustituye solo lo que es del proyecto: titular, parrafo, texto de la galeria,
 * la foto del hero y los slides. Todo lo demas viaja tal cual, incluidos los tres
 * data-w-id de la plantilla, que asi no hay ni que nombrarlos.
 *
 * Dos diferencias con las diez originales, las dos a proposito:
 *
 *   - El `.hero_media` de aquellas lleva un embed de YouTube. Estos proyectos no
 *     tienen video, asi que va una <img>; su encuadre lo pone .hero_media-img en
 *     src/styles/hero.css, que es CSS nuestro.
 *   - La galeria trae las fotos que hay (2 o 3), no seis. El carrusel funciona
 *     igual con menos slides y repetir fotos para llegar a seis seria peor.
 *
 * Se cae el <script type="text/x-wf-template">: es el repetidor del CMS de
 * Webflow, inerte sin su runtime, y clonarlo dejaria las URLs del proyecto ajeno
 * dentro del fragmento.
 */
export function ficha(p, plantilla) {
  const h = foto(p, p.heroFoto);
  let out = plantilla;

  const exigir = (antes, despues, que) => {
    if (antes === despues) {
      throw new Error(
        `[proyectos-destacados] la plantilla de ficha cambio: no encuentro ${que}. `
        + 'Revisa src/contenido-migrado/project/ antes de dar por bueno el generador.');
    }
    return despues;
  };

  // El repetidor del CMS, fuera.
  out = out.replace(/<script is:inline type="text\/x-wf-template"[^>]*>[\s\S]*?<\/script>/g, '');

  // Titular.
  out = exigir(out, out.replace(
    /(<h1 class="heading-portfolio">)[\s\S]*?(<\/h1>)/,
    `$1${txt(p.nombre)}$2`), 'el <h1>');

  // El parrafo del hero es el primer <div> suelto dentro de .hero_btn-row.
  out = exigir(out, out.replace(
    /(<div class="hero_btn-row"><div>)[\s\S]*?(<\/div>)/,
    `$1${txt(p.hero)}$2`), 'el parrafo del hero');

  // El embed de video se cambia por la foto.
  out = exigir(out, out.replace(
    /(<div data-w-id="[^"]*" class="hero_media">)[\s\S]*?(<\/section>)/,
    `$1<img src="${ruta(p, h.archivo)}" alt="${attr(h.alt)}" class="hero_media-img"/></div></div>$2`),
    'el .hero_media');

  // El texto que acompana a "Featured Gallery".
  out = exigir(out, out.replace(
    /(<h2>Featured Gallery<\/h2><div>)[\s\S]*?(<\/div>)/,
    `$1${txt(p.galeriaTexto)}$2`), 'el texto de Featured Gallery');

  // Los slides: se clona la forma del primero de la plantilla y se rellena.
  const slides = p.galeria.map((archivo) => {
    const f = foto(p, archivo);
    const url = ruta(p, archivo);
    return '<div fs-slider-element="slide" role="listitem" class="fs-slider-feature-gallery_slide w-dyn-item w-dyn-repeater-item">'
      + '<a href="#" class="lightbox-link-gallery w-inline-block w-lightbox">'
      + `<img loading="lazy" src="${url}" alt="${attr(f.alt)}" class="gallery_img"/>`
      + '<script is:inline type="application/json" class="w-json">'
      + `{ "items": [ { "url": "${url}", "type": "image" } ], "group": "Project Gallery" }`
      + '</script></a></div>';
  }).join('');

  out = exigir(out, out.replace(
    /(<div fs-slider-element="list" role="list" class="fs-slider-feature-gallery_list w-dyn-items">)[\s\S]*?(<\/div><div fs-slider-element="navigation")/,
    `$1${slides}</div>$2`), 'la lista de slides');

  return out;
}

/**
 * Mete las tres tarjetas AL PRINCIPIO de la lista que corresponda.
 *
 * Se llama desde generar-paginas.mjs justo despues de transformar(), sobre el
 * fragmento ya escrito. Si el ancla no aparece, LANZA: un fallo silencioso aqui
 * dejaria la home sin los proyectos que pidio el cliente y con la puerta en
 * verde, que es la peor combinacion posible.
 */
export function inyectarTarjetas(html, ruta_) {
  if (ruta_ !== '/' && ruta_ !== '/project-gallery') return html;

  // En la home la lista lleva ademas un atributo propio (data-pp-slider-proyectos),
  // asi que se localiza por su clase en vez de por la cadena entera.
  const ancla = ruta_ === '/'
    ? html.match(/<div[^>]*class="fs-slider-projects_list w-dyn-items">/)?.[0]
    : '<div role="list" class="projects-grid-list w-dyn-items">';

  if (!ancla || !html.includes(ancla)) {
    throw new Error(
      `[proyectos-destacados] no encuentro donde meter las tarjetas en ${ruta_}. `
      + 'El fragmento del vivo cambio de estructura: revisalo antes de dar por bueno '
      + 'el generador. Fallar aqui es a proposito — dejar la home sin los proyectos '
      + 'que pidio el cliente y la puerta en verde seria peor.');
  }

  const tarjetas = PROYECTOS.map(ruta_ === '/' ? tarjetaHome : tarjetaGaleria).join('');
  return html.replace(ancla, ancla + tarjetas);
}
