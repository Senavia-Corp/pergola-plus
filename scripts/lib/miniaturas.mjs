/**
 * Las 10 miniaturas de la banda de blog de las 25 paginas de /pergolas-contractors/.
 *
 * POR QUE ESTO VIVE AQUI Y NO EN src/contenido-migrado/
 *
 * Mismo motivo que scripts/lib/posts.mjs: los fragmentos de
 * src/contenido-migrado/pergolas-contractors/*.html son SALIDA GENERADA de
 * scripts/generar-detalle.mjs. Editarlos a mano funciona hasta el siguiente
 * regenerado, que los revierte en silencio; `check:generadores` regenera y diffea
 * justo para cazar eso. El arreglo entra por el transformador, que es de donde sale
 * ese markup.
 *
 * ───────────────────────────────────────────────────────────────────────────────
 * 1. QUE ESTABA MAL
 *
 * Las 25 paginas de ciudad cierran con una banda «Latest Outdoor Living Insights»:
 * 10 tarjetas de articulo, cada una con su miniatura. Esas 10 miniaturas seguian
 * siendo las portadas ANTIGUAS del blog, o sea imagenes generadas por IA, las mismas
 * que se retiraron de los articulos. Inspeccionadas en hoja de contactos: sinteticas
 * sin margen de duda, y TRES de ellas —codes, design-build y permit— son documentos
 * tecnicos inventados: planos de permiso y calculos de carga de viento que no
 * existen. En paginas de captacion de un contratista CON LICENCIA.
 *
 * ───────────────────────────────────────────────────────────────────────────────
 * 2. POR QUE LA FOTO QUE ENTRA ES LA PORTADA DEL PROPIO ARTICULO
 *
 * No hubo que elegirla: ya estaba elegida. El commit 25610d2 («blog: portadas reales
 * en los 21 articulos», ago-2026) cambio en el CSV del CMS `Main Image` **y**
 * `Thumbnail image`, y para estos 10 articulos los dos campos apuntan a la MISMA
 * fotografia real. Lo que no se entero fue este markup: las paginas de ciudad son
 * capturas del sitio en vivo (docs/vivo/) y traen la miniatura vieja incrustada.
 *
 * Asi que esto no decide nada nuevo, propaga una decision ya tomada y ya publicada.
 * Y tiene una propiedad que ninguna eleccion propia tendria: la tarjeta y el articulo
 * NO PUEDEN DIVERGIR. Si manana el cliente cambia la portada en el CMS, la puerta de
 * `check:blog` compara las dos sobre dist/ y falla.
 *
 * Las 10 se miraron una a una, ampliadas, antes de darlas por buenas: son fotografia
 * real —obra a medio hacer con el armado atado y el pavimento en palets, un carrete
 * de manguera en la pared, una silla colgante, barcos amarrados detras—. El `alt` se
 * escribio MIRANDO la foto, no leyendo el nombre del fichero.
 *
 * LA CIUDAD SOLO SE NOMBRA CUANDO EL PROYECTO LA DOCUMENTA. Tres de las diez salen de
 * public/cms-img/projects/, con obra y ciudad verificadas en
 * docs/blog-seo-2026-10/02-inventario-visual.csv: Greenacres, Delray Beach y West
 * Palm Beach. Las otras siete salen de /cms-img/services/ y /cms-img/galleries/, que
 * no tienen registro de obra: ahi no se nombra ciudad aunque el nombre del fichero o
 * el alt del CMS la sugieran.
 */

/** Carpeta larga que se repite. */
const PROY = (obra, archivo) => `/cms-img/projects/${obra}/${archivo}`;

/**
 * Las 10 tarjetas, en el orden en que salen en la banda.
 *
 * `slug` es el articulo al que enlaza la tarjeta; `de` es el nombre del archivo de IA
 * que hay hoy en el `src` —vive en /cms-img/blog/<slug>/, asi que el slug y la
 * miniatura estan atados por construccion—; `a` es la portada real de ESE articulo.
 */
export const MINIATURAS = [
  {
    slug: 'pergola-building-codes-broward-palm-beach',
    de: 'thumbnail-pergola-wind-load-engineering-florida.avif',
    a: '/cms-img/galleries/6/gallery-equinox-roof-pergola-south-florida-installation.avif',
    alt: 'Two freestanding aluminum pergolas with louvered roofs over the pool deck of a South Florida residential community.',
    altEs: 'Dos pérgolas de aluminio exentas con techo de lamas sobre la zona de piscina de una comunidad residencial del sur de Florida.',
  },
  {
    slug: 'building-custom-pergola-south-florida',
    de: 'thumbnail-custom-pergola-installation-detail-florida.avif',
    a: '/cms-img/services/patio-remodeling/feature-patio-remodeling-design-contractors-south-florida-3.avif',
    alt: 'Pool and patio under construction at a South Florida home, with the reinforcing grid tied inside the formwork and paving stacked ready to lay.',
    altEs: 'Piscina y patio en obra en una casa del sur de Florida, con la parrilla de armadura atada dentro del encofrado y el pavimento apilado listo para colocar.',
  },
  {
    slug: 'poolside-pergola-ideas-for-florida-homes',
    de: 'thumbnail-florida-poolside-louvered-pergola-detail.avif',
    a: PROY('forte-pergolas-in-greenacres-pool-patio', 'gallery-luxury-poolside-pergola-south-florida.avif'),
    alt: 'Freestanding aluminum pergola with a ceiling fan beside the pool of a Greenacres home, sheltering a hanging chair and a wicker daybed.',
    altEs: 'Pérgola de aluminio exenta con ventilador de techo junto a la piscina de una casa de Greenacres, que resguarda una silla colgante y un diván de mimbre.',
  },
  {
    slug: 'hoa-rules-pergolas-south-florida',
    de: 'thumbnail-hoa-approved-pergola-south-florida.avif',
    a: '/cms-img/galleries/4/gallery-equinox-louvered-pergola-project-boca-raton.avif',
    alt: 'White louvered-roof pergola attached to a single-storey home, shading a side patio with a dining table and armchairs.',
    altEs: 'Pérgola de techo de lamas blanca adosada a una casa de una planta, que da sombra a un patio lateral con mesa de comedor y sillones.',
  },
  {
    slug: 'plan-pergola-south-florida-backyard',
    de: 'thumbnail-south-florida-pergola-design-rendering.avif',
    a: '/cms-img/services/patio-remodeling/feature-patio-remodeling-design-contractors-south-florida-1.avif',
    alt: 'Attached aluminum pergola lit at dusk over the rear patio of a two-storey home, with the pool and the waterway behind.',
    altEs: 'Pérgola de aluminio adosada iluminada al anochecer sobre el patio trasero de una casa de dos plantas, con la piscina y el canal al fondo.',
  },
  {
    slug: 'luxury-pergola-ideas-for-south-florida-backyards',
    de: 'thumbnail-motorized-louvered-roof-south-florida-design.avif',
    a: PROY('forte-plus-pergola-with-outdoor-kitchen-in-delray-beach', 'gallery-luxury-outdoor-living-pergola-delray-beach.avif'),
    alt: 'Attached aluminum pergola with a timber-clad ceiling, ceiling fans and a wall-mounted television over the patio of a Delray Beach home.',
    altEs: 'Pérgola de aluminio adosada con techo revestido de madera, ventiladores y un televisor en la pared sobre el patio de una casa de Delray Beach.',
  },
  {
    slug: 'design-build-pergola-process-south-florida',
    de: 'thumbnail-pergola-design-build-installation-detail.avif',
    a: '/cms-img/services/pergola-design-construction/feature-pergola-engineered-permitted-south-florida-1.avif',
    alt: 'Attached aluminum pergola with a louvered roof over the waterfront patio of a modern home, beside the pool.',
    altEs: 'Pérgola de aluminio adosada con techo de lamas sobre el patio de una casa moderna a pie de agua, junto a la piscina.',
  },
  {
    slug: 'modern-outdoor-living-trends-in-south-florida',
    de: 'thumbnail-modern-louvered-roof-trend-florida.avif',
    a: PROY('attached-forte-pergola-in-west-palm-beach', 'gallery-aluminum-attached-pergola-west-palm-beach.avif'),
    alt: 'Attached aluminum structure with louvered privacy screens, a ceiling fan and an outdoor television beside the pool of a West Palm Beach home.',
    altEs: 'Estructura de aluminio adosada con paneles de privacidad de lamas, ventilador de techo y televisor de exterior junto a la piscina de una casa de West Palm Beach.',
  },
  {
    slug: 'pergola-permit-south-florida',
    de: 'thumbnail-pergola-engineering-plans-florida.avif',
    a: '/cms-img/services/pergola-design-construction/feature-pergola-engineered-permitted-south-florida-2.avif',
    alt: 'Aluminum pergola with a louvered roof beside the pool of a waterfront home, with palms and moored boats behind.',
    altEs: 'Pérgola de aluminio con techo de lamas junto a la piscina de una casa a pie de agua, con palmeras y barcos amarrados al fondo.',
  },
  {
    slug: 'pergola-cost-south-florida',
    de: 'thumbnail-motorized-pergola-cost-florida.avif',
    a: '/cms-img/services/pergola-design-construction/feature-pergola-engineered-permitted-south-florida-5.avif',
    alt: 'Aluminum pergola over a timber deck with a full outdoor kitchen, bar seating and lounge furniture beside the pool at sunset.',
    altEs: 'Pérgola de aluminio sobre una tarima de madera con cocina exterior completa, barra con taburetes y zona de estar junto a la piscina al atardecer.',
  },
];

/**
 * Sustituye las 10 miniaturas de IA por la portada real de cada articulo.
 *
 * Revienta si alguna no esta: una pagina de ciudad que se publica con la imagen de IA
 * y sin que nadie se entere es exactamente el fallo que esto viene a cerrar. Las 25
 * paginas traen las 10, asi que faltar una significa que el markup ha cambiado.
 */
export function recomponerMiniaturas(html, ruta) {
  let s = html;
  for (const m of MINIATURAS) {
    // El slug va en la ruta del fichero: ata la miniatura al articulo al que enlaza
    // la tarjeta, sin tener que fiarse del nombre del thumbnail.
    const src = `/cms-img/blog/${m.slug}/${m.de}`;
    const re = new RegExp(`(<img\\b[^>]*?)src="${src.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"([^>]*>)`);
    const hallado = s.match(re);
    if (!hallado) {
      throw new Error(
        `[miniaturas] ${ruta}: no encuentro la miniatura de ${m.slug}.\n`
        + `  Esperaba un <img src="${src}"> en la banda de blog.\n`
        + '  O el markup de la tarjeta ha cambiado, o esta pagina ya no trae esa tarjeta.',
      );
    }
    // Se reescribe la etiqueta entera: src nuevo, alt nuevo y fuera el alt vacio que
    // traia el export. Igual que en posts.mjs.
    const limpio = (hallado[1] + hallado[2]).replace(/\s*alt="[^"]*"/g, '');
    s = s.replace(re, limpio.replace(/<img\b/, `<img src="${m.a}" alt="${m.alt}"`));
  }
  return s;
}

/**
 * Los 10 `alt` en español, indexados por su original ingles.
 *
 * `traducirHtml()` SI traduce el atributo `alt` —esta en su lista blanca— pero, al
 * contrario que con los nodos de texto, NO reporta los que no encuentra: un alt sin
 * traducir sale en ingles en /es/ y no lo avisa ni el build ni `check:i18n`. Por eso
 * el español vive pegado al ingles en la misma entrada y `autocomprobar()` exige los
 * 10. Mismo planteamiento que ALTS_ES en posts.mjs.
 *
 * Se consume en src/pages/es/pergolas-contractors/[slug].astro.
 */
export const MINIATURAS_ES = Object.fromEntries(MINIATURAS.map((m) => [m.alt, m.altEs]));

/**
 * Comprueba la tabla antes de usarla, y se ejecuta sola al importar el modulo.
 *
 * Un gate que hay que acordarse de llamar falla ABIERTO. Esto corre con el import, en
 * el generador y en el build de Astro, asi que no existe el sitio donde olvidarlo.
 */
export function autocomprobar() {
  const vistas = new Map();
  const slugs = new Set();
  for (const m of MINIATURAS) {
    if (slugs.has(m.slug)) throw new Error(`[miniaturas] ${m.slug} repetido en la tabla`);
    slugs.add(m.slug);
    // Dos tarjetas de la misma banda con la misma foto se leen como un fallo de la
    // pagina, no como una coincidencia.
    if (vistas.has(m.a)) {
      throw new Error(`[miniaturas] ${m.a} usada en ${vistas.get(m.a)} y en ${m.slug}`);
    }
    vistas.set(m.a, m.slug);
    if (m.a.startsWith('/cms-img/blog/')) {
      throw new Error(`[miniaturas] ${m.slug}: ${m.a} sigue siendo una portada vieja del blog`);
    }
    if (!m.alt || m.alt.length < 25) throw new Error(`[miniaturas] ${m.slug}: alt demasiado corto`);
    // Sin esto el alt sale en ingles en /es/ y NO lo avisa nadie. Ver MINIATURAS_ES.
    if (!m.altEs || m.altEs.length < 25) {
      throw new Error(`[miniaturas] ${m.slug}: falta el alt en español`);
    }
  }
  if (MINIATURAS.length !== 10) {
    throw new Error(`[miniaturas] la banda trae 10 tarjetas y la tabla tiene ${MINIATURAS.length}`);
  }
  return { miniaturas: MINIATURAS.length };
}

autocomprobar();
