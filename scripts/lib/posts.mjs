/**
 * El cuerpo de los 21 articulos del blog: fotografia real, enlaces y CTA vivos.
 *
 * POR QUE ESTO VIVE AQUI Y NO EN src/contenido-migrado/
 *
 * Los fragmentos de src/contenido-migrado/post/*.html son SALIDA GENERADA de
 * scripts/generar-detalle.mjs. Editarlos a mano funciona hasta el siguiente
 * `node scripts/generar-detalle.mjs`, que los revierte en silencio; `check:generadores`
 * regenera y diffea justo para cazar eso. El arreglo va en el transformador, que es de
 * donde sale ese markup — la misma via por la que se retiro el widget muerto de Google
 * Reviews (ELFSIGHT_RESENAS). Ver la cabecera de scripts/comprobar-generadores.mjs.
 *
 * ───────────────────────────────────────────────────────────────────────────────
 * 1. LAS 62 IMAGENES DEL CUERPO ERAN GENERADAS POR IA
 *
 * Las portadas se arreglaron en ago-2026 (commit «blog: portadas reales en los 21
 * articulos»), que dejo dicho: «Las imagenes del cuerpo de los articulos siguen siendo
 * IA: quedan fuera de este cambio». Esto es ese cambio.
 *
 * Se inspeccionaron las 62 una a una en hoja de contactos. Son sinteticas sin margen de
 * duda: vigas de aluminio fundidas con madera flotando sobre una piscina, collages
 * partidos «antes/despues», bases de poste con pernos que no sujetan nada, y —lo mas
 * caro de todo— TRES documentos tecnicos inventados: un collage de diagramas de carga de
 * viento con analisis de elementos finitos, y dos planos de permiso. Un contratista CON
 * LICENCIA publicando documentacion de ingenieria y permisos que no existen no es un
 * problema de estetica.
 *
 * ───────────────────────────────────────────────────────────────────────────────
 * 2. DE DONDE SALEN LAS 40 QUE ENTRAN
 *
 * De public/cms-img/projects/: 68 fotografias de 13 obras terminadas, con PROYECTO Y
 * CIUDAD verificados, ya optimizadas, ya versionadas y ya publicadas en las fichas de
 * proyecto. No hay que inventar una URL de Webflow ni tocar img-map.json: la ruta es
 * directa, igual que en las fichas de proyecto.
 *
 * Reglas que se cumplen y que se comprueban abajo en `autocomprobar()`:
 *   - ninguna foto se repite dentro de un articulo
 *   - ninguna foto se repite ENTRE articulos
 *   - ninguna pisa las 8 que ya son portada de un articulo
 *
 * El alt se escribio MIRANDO la foto, no leyendo su nombre de archivo. La ciudad solo
 * aparece cuando esta verificada por el proyecto al que pertenece la foto.
 *
 * ───────────────────────────────────────────────────────────────────────────────
 * 3. LAS 22 QUE SE QUITAN, Y POR QUE NO SE SUSTITUYEN
 *
 * «Si no hay una fotografia relevante, elimina el espacio visual»: poner una foto
 * cualquiera para tapar el hueco es el fallo que esto viene a arreglar. Se quitan dos
 * clases:
 *
 *   a) las decorativas de cierre, justo antes de la conclusion. No explican nada que no
 *      haya dicho ya la de apertura, y 7 de ellas son de las 11 que venian con alt="".
 *   b) las que ilustraban documentacion: planos sellados, calculo de carga de viento,
 *      tramitacion del permiso. Eso no se fotografia; inventarlo es lo que ya pasaba.
 *
 * ───────────────────────────────────────────────────────────────────────────────
 * 4. ENLACES INTERNOS: SOLO SOBRE NODOS DE TEXTO COMPLETOS
 *
 * Los 21 articulos no tenian NI UN enlace interno en el cuerpo. Se enlaza envolviendo un
 * nodo de texto ENTERO (`<li>Texto</li>` -> `<li><a …>Texto</a></li>`), nunca partiendo
 * un parrafo por la mitad, y la razon es i18n: `traducirHtml()` sustituye el texto que
 * hay entre `>` y `<`, asi que si se parte un parrafo en tres trozos sus claves dejan de
 * casar y esa frase sale EN INGLES en /es/. Envolviendo el nodo entero, la clave sigue
 * siendo la misma cadena y la traduccion sigue aplicando.
 *
 * El `href` se queda en ingles a proposito: `enlazarEnEspanol()` (astro.config.mjs)
 * reescribe los enlaces internos de las paginas /es/ a su version española al final del
 * build, y las 107 rutas de destino de este fichero estan traducidas. Escribirlo aqui en
 * español romperia la version inglesa.
 *
 * No se inventa texto: se enlaza lo que el articulo YA dice. Donde el articulo no nombra
 * un destino relevante, ese articulo lleva menos enlaces. Un enlace util vale mas que
 * cinco forzados.
 *
 * ───────────────────────────────────────────────────────────────────────────────
 * 5. LOS 42 CTA MUERTOS
 *
 * Los 21 articulos cierran con `<h3>Schedule a Design Consultation</h3>` y
 * `<h3>Request a Quote</h3>`: dos encabezados que parecen botones y no llevan a ninguna
 * parte. Ademas entraban en el indice lateral como si fueran secciones del articulo.
 * Pasan a ser dos enlaces de verdad a las paginas que ya existen.
 */

/** Las 8 fotos de proyecto que YA son portada de un articulo. No pueden reutilizarse. */
const PORTADAS_EN_USO = new Set([
  '/cms-img/projects/attached-forte-pergola-in-west-palm-beach/gallery-aluminum-attached-pergola-west-palm-beach.avif',
  '/cms-img/projects/attached-forte-pergola-in-west-palm-beach/gallery-engineered-pergola-installation-west-palm-beach.avif',
  '/cms-img/projects/attached-forte-plus-pergola-on-the-intracoastal-in-boca-raton/gallery-coastal-attached-pergola-palm-beach-county.avif',
  '/cms-img/projects/attached-forte-plus-pergola-on-the-intracoastal-in-boca-raton/gallery-luxury-waterfront-pergola-south-florida.avif',
  '/cms-img/projects/forte-pergola-with-privacy-wall-motorized-screen-in-delray-beach/gallery-forte-pergola-insulated-wood-design-south-florida.avif',
  '/cms-img/projects/forte-pergolas-in-greenacres-pool-patio/gallery-luxury-poolside-pergola-south-florida.avif',
  '/cms-img/projects/forte-plus-pergola-with-outdoor-kitchen-in-delray-beach/gallery-luxury-outdoor-living-pergola-delray-beach.avif',
  '/cms-img/projects/forte-plus-pergolas-in-hillsboro-beach-estate/gallery-oceanfront-aluminum-pergola-south-florida.avif',
]);

/** Atajo: la carpeta es larga y se repite 40 veces. */
const P = (obra, archivo) => `/cms-img/projects/${obra}/${archivo}`;

const WPB = 'attached-forte-pergola-in-west-palm-beach';
const BOCA = 'attached-forte-plus-pergola-on-the-intracoastal-in-boca-raton';
const RIVIERA = 'eclipse-cabanas-forte-pergola-hospitality-project-in-riviera-beach';
const ELAN = 'forte-pergola-with-outdoor-kitchen-at-elan-polo-club';
const PBG = 'forte-pergola-with-partial-privacy-wall-in-palm-beach-gardens';
const DELRAY_SCREEN = 'forte-pergola-with-privacy-wall-motorized-screen-in-delray-beach';
const DELRAY_TV = 'forte-pergola-with-privacy-wall-tv-mount-in-delray-beach';
const GREENACRES = 'forte-pergolas-in-greenacres-pool-patio';
const POMPANO = 'forte-plus-aluminum-carport-installation-in-pompano-beach';
const DELRAY_COCINA = 'forte-plus-pergola-with-outdoor-kitchen-in-delray-beach';
const HILLSBORO = 'forte-plus-pergolas-in-hillsboro-beach-estate';

/**
 * Que se hace con cada una de las 62 imagenes del cuerpo, por articulo y en orden.
 *
 * `de` es el nombre del archivo IA que hay hoy en el `src` (basta el nombre: es unico
 * dentro de su articulo). `a` + `alt` lo sustituyen; `quitar` elimina el <figure> entero
 * y anota el motivo, que acaba en el informe.
 */
export const FOTOS = {
  'add-shade-backyard-south-florida': [
    { de: 'inline-backyard-outdoor-living-south-florida-louvered-pergola.avif',
      a: P(DELRAY_SCREEN, 'gallery-luxury-pergola-project-delray-beach-residential.avif'),
      alt: 'Attached aluminum pergola shading a dining and lounge area on the rear patio of a Delray Beach home.',
      altEs: 'Pérgola de aluminio adosada dando sombra a la zona de comedor y estar en el patio trasero de una casa de Delray Beach.' },
    { de: 'inline-florida-pergola-motorized-screens.avif',
      a: P(DELRAY_SCREEN, 'gallery-custom-aluminum-pergola-delray-beach-installation.avif'),
      alt: 'Motorized shade screen lowered along the side of an aluminum pergola at a Delray Beach home.',
      altEs: 'Cortina de sombra motorizada bajada en el lateral de una pérgola de aluminio en una casa de Delray Beach.' },
    { de: 'inline-sunset-shaded-backyard-south-florida.avif', quitar: 'decorativa de cierre, sin alt y sin informacion nueva' },
  ],
  'aluminum-pergola-cost-boca-raton-vs-fort-lauderdale': [
    { de: 'inline-custom-aluminum-pergola-cost-boca-vs-fort-lauderdale.avif',
      a: P(BOCA, 'gallery-forte-plus-aluminum-pergola-boca-raton-project.avif'),
      alt: 'FORTE Plus aluminum pergola at a Boca Raton home on the Intracoastal.',
      altEs: 'Pérgola de aluminio FORTE Plus en una casa de Boca Raton, a pie del Intracoastal.' },
    // Fort Lauderdale NO tiene obra fotografiada. Se ilustra con la de Hillsboro Beach,
    // que es el mismo condado (Broward) y la misma exposicion costera, y el alt dice la
    // ciudad real. Rotular una foto de otra ciudad como Fort Lauderdale seria justo lo
    // que prohibe el encargo.
    { de: 'inline-fort-lauderdale-waterfront-pergola.avif',
      a: P(HILLSBORO, 'gallery-forte-plus-pergola-broward-county-coastal.avif'),
      alt: 'FORTE Plus aluminum pergola on a coastal property in Hillsboro Beach, Broward County.',
      altEs: 'Pérgola de aluminio FORTE Plus en una propiedad costera de Hillsboro Beach, en el condado de Broward.' },
    { de: 'inline-boca-vs-fort-lauderdale-pergola-sunset.avif', quitar: 'decorativa de cierre, sin alt' },
  ],
  'aluminum-vs-wood-pergolas-humid-climate': [
    { de: 'inline-aluminum-wood-pergola-humid-climate.avif',
      a: P(GREENACRES, 'hero-forte-pergolas-greenacres-pool-patio-south-florida.avif'),
      alt: 'FORTE aluminum pergolas over the pool patio of a Greenacres home.',
      altEs: 'Pérgolas de aluminio FORTE sobre el patio de la piscina de una casa de Greenacres.' },
    { de: 'inline-custom-pergola-material-comparison-humidity.avif',
      a: P(GREENACRES, 'gallery-engineered-pergola-project-greenacres-fl.avif'),
      alt: 'Close-up of the aluminum frame corner on a FORTE pergola in Greenacres, with no exposed timber to absorb moisture.',
      altEs: 'Detalle de la esquina de la estructura de aluminio de una pérgola FORTE en Greenacres, sin madera expuesta que absorba humedad.' },
    { de: 'inline-aluminum-pergola-humid-florida.avif', quitar: 'decorativa de cierre, repite la de apertura' },
  ],
  'best-outdoor-structures-rain-sun-florida': [
    { de: 'inline-best-outdoor-structures-south-florida-rain-sun.avif',
      a: P(ELAN, 'gallery-louvered-and-solid-roof-pergola-elan-polo-club.avif'),
      alt: 'Aluminum pergola at Elan Polo Club carrying an open louvered roof section beside a solid insulated section in the same frame.',
      altEs: 'Pérgola de aluminio en Elan Polo Club con un tramo de techo de lamas abierto junto a otro de techo sólido aislado, en la misma estructura.' },
    { de: 'inline-aluminum-cabana-florida-poolside.avif',
      a: P(RIVIERA, 'gallery-riviera-beach-commercial-outdoor-structure-project.avif'),
      alt: 'Row of freestanding aluminum cabanas built for a hospitality property in Riviera Beach.',
      altEs: 'Hilera de cabanas de aluminio exentas construidas para un establecimiento hotelero en Riviera Beach.' },
    { de: 'inline-florida-all-weather-outdoor-structure.avif', quitar: 'decorativa de cierre, repite la de apertura' },
  ],
  'best-pergola-materials-coastal-florida': [
    { de: 'inline-south-florida-aluminum-pergola.avif',
      a: P(HILLSBORO, 'gallery-luxury-beachfront-pergola-hillsboro-beach.avif'),
      alt: 'White aluminum structure on a beachfront estate in Hillsboro Beach, a few steps from the Atlantic.',
      altEs: 'Estructura de aluminio blanca en una finca frente a la playa en Hillsboro Beach, a unos pasos del Atlántico.' },
    { de: 'inline-white-marine-grade-aluminum-pergola-detail.avif',
      a: P(RIVIERA, 'gallery-engineered-hospitality-shade-structure-south-florida.avif'),
      alt: 'Underside of an engineered aluminum shade structure in Riviera Beach, with the frame and its fixings visible.',
      altEs: 'Vista desde abajo de una estructura de sombra de aluminio calculada en Riviera Beach, con la estructura y sus fijaciones a la vista.' },
    { de: 'inline-coastal-florida-pergola-sunset.avif', quitar: 'decorativa de cierre, repite la de apertura' },
  ],
  'building-custom-pergola-south-florida': [
    { de: 'inline-building-pergola-south-florida.avif',
      a: P(PBG, 'gallery-forte-pergola-residential-installation-palm-beach-gardens.avif'),
      alt: 'Aluminum pergola frame during installation at a Palm Beach Gardens home, photographed from below before the roof went on.',
      altEs: 'Estructura de una pérgola de aluminio durante el montaje en una casa de Palm Beach Gardens, vista desde abajo antes de colocar el techo.' },
    { de: 'inline-custom-pergola-builders-detail-florida.avif',
      quitar: 'pedia un detalle de calculo estructural; no hay fotografia real que lo documente' },
    { de: 'inline-completed-custom-pergola-south-florida.avif',
      a: P(PBG, 'hero-forte-pergola-partial-privacy-wall-palm-beach-gardens.avif'),
      alt: 'Finished FORTE aluminum pergola with a partial privacy wall at a Palm Beach Gardens home.',
      altEs: 'Pérgola de aluminio FORTE terminada, con muro de privacidad parcial, en una casa de Palm Beach Gardens.' },
  ],
  'can-you-use-your-patio-year-round-in-south-florida': [
    { de: 'inline-patio-south-florida-pergola.avif',
      a: P(DELRAY_SCREEN, 'hero-forte-pergola-motorized-screen-delray-beach-south-florida.avif'),
      alt: 'FORTE aluminum pergola with a motorized shade screen over the patio of a Delray Beach home.',
      altEs: 'Pérgola de aluminio FORTE con cortina de sombra motorizada sobre el patio de una casa de Delray Beach.' },
    { de: 'inline-south-florida-patio-motorized-screens.avif',
      a: P(DELRAY_SCREEN, 'gallery-motorized-shade-screen-pergola-palm-beach-county.avif'),
      alt: 'Motorized shade screen part-way down on an aluminum pergola in Delray Beach, with the dining area still open to the garden.',
      altEs: 'Cortina de sombra motorizada a media altura en una pérgola de aluminio en Delray Beach, con la zona de comedor todavía abierta al jardín.' },
    { de: 'inline-year-round-patio-south-florida-sunset.avif', quitar: 'decorativa de cierre, repite la de apertura' },
  ],
  'design-build-pergola-process-south-florida': [
    { de: 'inline-design-build-custom-pergola-south-florida.avif',
      a: P(ELAN, 'hero-aluminum-pergola-outdoor-kitchen-elan-polo-club.avif'),
      alt: 'Freestanding aluminum pergola with a built-in outdoor kitchen, seen across the amenity lawn at Elan Polo Club.',
      altEs: 'Pérgola de aluminio exenta con cocina exterior integrada, vista desde el césped común de Elan Polo Club.' },
    { de: 'inline-pergola-design-build-installation-detail-plan.avif',
      quitar: 'pedia documentacion de ingenieria; no se fotografia, y la que habia era inventada' },
    { de: 'inline-completed-design-build-pergola-florida.avif',
      a: P(ELAN, 'gallery-pergola-outdoor-kitchen-paver-patio-elan-polo-club.avif'),
      alt: 'Built-in outdoor kitchen and dining area under the aluminum pergola at Elan Polo Club, on a travertine patio bordered by turf.',
      altEs: 'Cocina exterior y zona de comedor bajo la pérgola de aluminio de Elan Polo Club, sobre un patio de travertino bordeado de césped artificial.' },
  ],
  'hoa-rules-pergolas-south-florida': [
    { de: 'inline-custom-hoa-approved-pergola-south-florida.avif',
      a: P(PBG, 'gallery-luxury-pergola-palm-beach-gardens-home.avif'),
      alt: 'Aluminum pergola on the rear lawn of a home in Palm Beach Gardens.',
      altEs: 'Pérgola de aluminio en el césped trasero de una casa de Palm Beach Gardens.' },
    { de: 'inline-luxury-pergola-hoa-approval-rendering-florida.avif',
      a: P(PBG, 'gallery-aluminum-pergola-privacy-wall-south-florida.avif'),
      alt: 'FORTE aluminum pergola with a partial privacy wall on the rear lawn of a Palm Beach Gardens home.',
      altEs: 'Pérgola de aluminio FORTE con muro de privacidad parcial en el césped trasero de una casa de Palm Beach Gardens.' },
    { de: 'inline-hoa-compliant-pergola-south-florida.avif',
      quitar: 'decorativa de cierre; ademas «approved» no es verificable en una fotografia' },
  ],
  'how-long-pergola-installation-florida': [
    { de: 'inline-completed-pergola-installation-florida.avif',
      a: P(WPB, 'hero-forte-pergola-west-palm-beach-project.avif'),
      alt: 'Attached FORTE aluminum pergola finished at a West Palm Beach home.',
      altEs: 'Pérgola de aluminio FORTE adosada, ya terminada, en una casa de West Palm Beach.' },
    { de: 'inline-pergola-footing-installation-florida.avif',
      quitar: 'ilustraba la tramitacion del permiso con un plano inventado' },
  ],
  'hurricane-resistant-pergolas-south-florida': [
    { de: 'inline-custom-hurricane-resistant-pergola-south-florida.avif',
      a: P(HILLSBORO, 'hero-forte-plus-pergolas-hillsboro-beach-estate-oceanfront.avif'),
      alt: 'FORTE Plus aluminum pergolas at an oceanfront estate in Hillsboro Beach, in direct coastal exposure.',
      altEs: 'Pérgolas de aluminio FORTE Plus en una finca frente al mar en Hillsboro Beach, en exposición costera directa.' },
    { de: 'inline-column-rated-pergola-engineering-detail.avif',
      a: P(HILLSBORO, 'gallery-engineered-pergola-hillsboro-beach-estate.avif'),
      alt: 'Engineered aluminum structure at the Hillsboro Beach estate, built for direct oceanfront wind exposure.',
      altEs: 'Estructura de aluminio calculada en la finca de Hillsboro Beach, construida para aguantar el viento de primera línea de mar.' },
    { de: 'inline-hurricane-proof-pergola-south-florida.avif', quitar: 'decorativa de cierre, repite la de apertura' },
  ],
  'is-a-louvered-roof-pergola-worth-it-in-florida': [
    { de: 'inline-custom-louvered-roof-pergola-worth-it-florida.avif',
      a: P(GREENACRES, 'gallery-aluminum-pergola-pool-patio-greenacres.avif'),
      alt: 'Freestanding aluminum pergola with an adjustable louvered roof beside the pool of a Greenacres home.',
      altEs: 'Pérgola de aluminio exenta con techo de lamas orientables junto a la piscina de una casa de Greenacres.' },
    { de: 'inline-louvered-roof-rain-protection-florida.avif',
      a: P(GREENACRES, 'gallery-custom-forte-pergola-greenacres-palm-beach-county.avif'),
      alt: 'Custom FORTE aluminum pergola with a louvered roof over a seating area at a Greenacres home.',
      altEs: 'Pérgola de aluminio FORTE a medida, con techo de lamas, sobre una zona de estar en una casa de Greenacres.' },
    { de: 'inline-florida-louvered-pergola-sunset.avif', quitar: 'decorativa de cierre, repite la de apertura' },
  ],
  'luxury-pergola-ideas-for-south-florida-backyards': [
    { de: 'inline-pergola-ideas-south-florida-backyard.avif',
      a: P(DELRAY_COCINA, 'gallery-forte-plus-aluminum-pergola-delray-beach-installation.avif'),
      alt: 'FORTE Plus aluminum pergola over a waterfront terrace at a Delray Beach home.',
      altEs: 'Pérgola de aluminio FORTE Plus sobre una terraza frente al agua en una casa de Delray Beach.' },
    { de: 'inline-outdoor-kitchen-under-aluminum-pergola-florida.avif',
      a: P(DELRAY_COCINA, 'gallery-custom-pergola-outdoor-kitchen-palm-beach-county.avif'),
      alt: 'Built-in outdoor kitchen and bar seating under a FORTE Plus aluminum pergola in Delray Beach.',
      altEs: 'Cocina exterior integrada y barra bajo una pérgola de aluminio FORTE Plus en Delray Beach.' },
    { de: 'inline-illuminated-luxury-pergola-south-florida.avif', quitar: 'decorativa de cierre, repite la de apertura' },
  ],
  'modern-outdoor-living-trends-in-south-florida': [
    { de: 'inline-pergola-outdoor-living-south-florida-2026.avif',
      a: P(WPB, 'gallery-attached-forte-pergola-west-palm-beach-south-florida.avif'),
      alt: 'Attached FORTE aluminum pergola with louvered privacy screens at a West Palm Beach home.',
      altEs: 'Pérgola de aluminio FORTE adosada con paneles de privacidad de lamas en una casa de West Palm Beach.' },
    { de: 'inline-modern-outdoor-kitchen-under-pergola-florida.avif',
      a: P(DELRAY_TV, 'gallery-outdoor-entertainment-pergola-south-florida.avif'),
      alt: 'Outdoor kitchen and bar under an aluminum pergola on a Delray Beach waterfront terrace.',
      altEs: 'Cocina exterior y barra bajo una pérgola de aluminio en una terraza frente al agua de Delray Beach.' },
    { de: 'inline-sunset-modern-pergola-south-florida.avif', quitar: 'decorativa de cierre, repite la de apertura' },
  ],
  'pergola-building-codes-broward-palm-beach': [
    { de: 'inline-custom-pergola-building-codes-south-florida.avif',
      a: P(HILLSBORO, 'gallery-luxury-estate-pergola-installation-broward.avif'),
      alt: 'Aluminum pergola installation at an estate in Hillsboro Beach, Broward County.',
      altEs: 'Montaje de una pérgola de aluminio en una finca de Hillsboro Beach, en el condado de Broward.' },
    { de: 'inline-plan-pergola-wind-load-engineering-florida.avif',
      quitar: 'era un collage inventado de diagramas de carga de viento y analisis estructural' },
    // El articulo trata los DOS condados; la de apertura es Broward y esta es Palm Beach.
    { de: 'inline-code-compliant-pergola-south-florida.avif',
      a: P(PBG, 'gallery-custom-forte-pergola-palm-beach-county.avif'),
      alt: 'Custom FORTE aluminum pergola at a Palm Beach Gardens home, in Palm Beach County.',
      altEs: 'Pérgola de aluminio FORTE a medida en una casa de Palm Beach Gardens, en el condado de Palm Beach.' },
  ],
  'pergola-cost-south-florida': [
    { de: 'inline-custom-pergola-cost-south-florida-luxury-backyard.avif',
      a: P(DELRAY_TV, 'gallery-engineered-aluminum-pergola-delray-beach.avif'),
      alt: 'Aluminum pergola over an outdoor kitchen at a Delray Beach waterfront home.',
      altEs: 'Pérgola de aluminio sobre una cocina exterior en una casa de Delray Beach frente al agua.' },
    { de: 'inline-south-florida-louvered-roof-cost-example.avif',
      a: P(RIVIERA, 'gallery-eclipse-cabanas-hospitality-south-florida.avif'),
      alt: 'ECLIPSE aluminum cabanas installed for a hospitality property in Riviera Beach.',
      altEs: 'Cabanas de aluminio ECLIPSE instaladas en un establecimiento hotelero de Riviera Beach.' },
    { de: 'inline-sunset-pergola-south-florida-cost.avif', quitar: 'decorativa de cierre, repite la de apertura' },
  ],
  'pergola-design-ideas-waterfront-properties': [
    { de: 'inline-waterfront-pergola-design-florida.avif',
      a: P(BOCA, 'gallery-forte-plus-pergola-boca-raton-waterfront.avif'),
      alt: 'FORTE Plus aluminum pergola on the waterfront terrace of a Boca Raton home.',
      altEs: 'Pérgola de aluminio FORTE Plus en la terraza frente al agua de una casa de Boca Raton.' },
    { de: 'inline-waterfront-outdoor-kitchen-pergola.avif',
      a: P(DELRAY_COCINA, 'gallery-engineered-pergola-outdoor-kitchen-south-florida.avif'),
      alt: 'Outdoor kitchen under an aluminum pergola on a dockside terrace in Delray Beach, with moored boats beyond.',
      altEs: 'Cocina exterior bajo una pérgola de aluminio en una terraza junto al muelle en Delray Beach, con barcos amarrados al fondo.' },
    { de: 'inline-waterfront-pergola-sunset-florida.avif', quitar: 'decorativa de cierre, sin alt' },
  ],
  'pergola-permit-south-florida': [
    { de: 'inline-custom-pergola-permit-south-florida.avif',
      a: P(WPB, 'gallery-forte-attached-pergola-palm-beach-county.avif'),
      alt: 'Attached FORTE aluminum pergola at a West Palm Beach home, in Palm Beach County.',
      altEs: 'Pérgola de aluminio FORTE adosada en una casa de West Palm Beach, en el condado de Palm Beach.' },
    { de: 'inline-custom-pergola-engineering-plans-florida.avif',
      quitar: 'eran planos de permiso inventados; un plano sellado real no puede publicarse asi' },
    { de: 'inline-permitted-pergola-south-florida.avif', quitar: 'decorativa de cierre, sin alt' },
  ],
  'plan-pergola-south-florida-backyard': [
    { de: 'inline-custom-planning-pergola-south-florida-backyard.avif',
      a: P(WPB, 'gallery-residential-attached-pergola-south-florida.avif'),
      alt: 'Attached aluminum pergola over the rear terrace of a West Palm Beach home, with a ceiling fan and the Intracoastal behind.',
      altEs: 'Pérgola de aluminio adosada sobre la terraza trasera de una casa de West Palm Beach, con ventilador de techo y el Intracoastal al fondo.' },
    { de: 'inline-boca-vs-fort-lauderdale-pergola-sunset.avif',
      a: P(BOCA, 'gallery-engineered-pergola-intracoastal-boca-raton.avif'),
      alt: 'Engineered aluminum pergola on an Intracoastal property in Boca Raton.',
      altEs: 'Pérgola de aluminio calculada en una propiedad del Intracoastal, en Boca Raton.' },
    { de: 'inline-completed-pergola-south-florida-backyard.avif', quitar: 'decorativa de cierre, repite la de apertura' },
  ],
  'poolside-pergola-ideas-for-florida-homes': [
    { de: 'inline-poolside-pergola-ideas-florida-2026.avif',
      a: P(DELRAY_TV, 'gallery-luxury-pergola-installation-palm-beach-county.avif'),
      alt: 'Aluminum pergola beside the pool of a Delray Beach home, with bar seating and a television mounted on the privacy screen.',
      altEs: 'Pérgola de aluminio junto a la piscina de una casa de Delray Beach, con barra y un televisor montado en el panel de privacidad.' },
    { de: 'inline-florida-poolside-outdoor-kitchen-pergola.avif',
      a: P(DELRAY_COCINA, 'gallery-residential-pergola-kitchen-project-delray.avif'),
      alt: 'Poolside outdoor kitchen under an aluminum pergola at a Delray Beach home.',
      altEs: 'Cocina exterior junto a la piscina, bajo una pérgola de aluminio, en una casa de Delray Beach.' },
    { de: 'inline-sunset-poolside-pergola-florida.avif', quitar: 'decorativa de cierre, repite la de apertura' },
  ],
  'resort-style-backyard-boca-raton': [
    { de: 'inline-pergola-resort-style-backyard-boca-raton.avif',
      a: P(BOCA, 'hero-attached-forte-plus-pergola-boca-raton-intracoastal.avif'),
      alt: 'Attached FORTE Plus aluminum pergola and pool terrace at a Boca Raton home on the Intracoastal.',
      altEs: 'Pérgola de aluminio FORTE Plus adosada y terraza de piscina en una casa de Boca Raton, a pie del Intracoastal.' },
    { de: 'inline-boca-raton-outdoor-kitchen-pergola.avif',
      a: P(DELRAY_COCINA, 'hero-forte-plus-pergola-outdoor-kitchen-delray-beach.avif'),
      alt: 'Built-in outdoor kitchen under a FORTE Plus aluminum pergola at a Delray Beach home.',
      altEs: 'Cocina exterior integrada bajo una pérgola de aluminio FORTE Plus en una casa de Delray Beach.' },
    { de: 'inline-sunset-resort-style-backyard-boca-raton.avif', quitar: 'decorativa de cierre, repite la de apertura' },
  ],
};

/**
 * Enlaces internos del cuerpo, por articulo.
 *
 * `texto` tiene que ser un nodo de texto COMPLETO del articulo (ver la cabecera, punto
 * 4). Se enlaza la PRIMERA aparicion; si no aparece ninguna, esto revienta el build en
 * vez de dejar el articulo sin el enlace en silencio.
 */
export const ENLACES = {
  'add-shade-backyard-south-florida': [
    { texto: 'Equinox', href: '/brands/equinox' },
    { texto: 'Insect protection', href: '/products/screen-enclosures' },
    { texto: 'Solid thermal barrier', href: '/products/solid-roof-pergolas' },
  ],
  'aluminum-pergola-cost-boca-raton-vs-fort-lauderdale': [
    { texto: 'Wood-grain aluminum finishes', href: '/products/open-air-pergolas' },
    { texto: 'Deeper footings', href: '/services/concrete' },
    { texto: 'Electrical integration', href: '/services/pergola-design-construction' },
  ],
  'aluminum-vs-wood-pergolas-humid-climate': [
    { texto: 'Engineered extruded profiles', href: '/products/open-air-pergolas' },
    { texto: 'Powder-coated for UV protection', href: '/products/motorized-louvered-pergolas' },
  ],
  'best-outdoor-structures-rain-sun-florida': [
    { texto: 'Equinox', href: '/brands/equinox' },
    { texto: 'Insulated roofing', href: '/products/solid-roof-pergolas' },
    { texto: 'Motorized screen integration', href: '/products/motorized-screens' },
    { texto: 'Outdoor kitchens', href: '/services/full-outdoor-remodel' },
  ],
  'best-pergola-materials-coastal-florida': [
    { texto: 'Ideal for motorized louvered roof systems', href: '/products/motorized-louvered-pergolas' },
    { texto: 'Motorized louvered roof systems', href: '/products/motorized-louvered-pergolas' },
    { texto: 'Waterfront estates', href: '/pergolas-contractors/boca-raton-pergola-contractor' },
  ],
  'building-custom-pergola-south-florida': [
    { texto: 'Equinox', href: '/brands/equinox' },
    { texto: 'Footing depth specifications', href: '/services/concrete' },
    { texto: 'Pool &amp; patio layout', href: '/services/full-outdoor-remodel' },
  ],
  'can-you-use-your-patio-year-round-in-south-florida': [
    { texto: 'Equinox', href: '/brands/equinox' },
    { texto: 'Insect protection', href: '/products/screen-enclosures' },
    { texto: 'Deep engineered concrete footings', href: '/services/concrete' },
  ],
  'design-build-pergola-process-south-florida': [
    { texto: 'Florida Building Code compliance', href: '/post/pergola-building-codes-broward-palm-beach' },
    { texto: 'HOA approvals', href: '/post/hoa-rules-pergolas-south-florida' },
    { texto: 'Drainage patterns', href: '/services/concrete' },
  ],
  'hoa-rules-pergolas-south-florida': [
    { texto: 'Wood-grain aluminum finishes', href: '/products/open-air-pergolas' },
    { texto: 'Property survey', href: '/post/pergola-permit-south-florida' },
    { texto: 'Structural drawings', href: '/services/pergola-design-construction' },
  ],
  'how-long-pergola-installation-florida': [
    { texto: 'Open-air aluminum pergola', href: '/products/open-air-pergolas' },
    { texto: 'Insulated roof system', href: '/products/solid-roof-pergolas' },
    { texto: 'Motorized louvered roof', href: '/products/motorized-louvered-pergolas' },
    { texto: 'Permit processing', href: '/post/pergola-permit-south-florida' },
  ],
  'hurricane-resistant-pergolas-south-florida': [
    { texto: 'Deep reinforced concrete footings', href: '/services/concrete' },
    { texto: 'Florida Building Code requirements', href: '/post/pergola-building-codes-broward-palm-beach' },
    { texto: 'Permits are mandatory', href: '/post/pergola-permit-south-florida' },
  ],
  'is-a-louvered-roof-pergola-worth-it-in-florida': [
    { texto: 'Equinox', href: '/brands/equinox' },
    { texto: 'Integrate motorized screens', href: '/products/motorized-screens' },
    { texto: 'Deep reinforced concrete footings', href: '/services/concrete' },
  ],
  'luxury-pergola-ideas-for-south-florida-backyards': [
    { texto: 'Equinox', href: '/brands/equinox' },
    { texto: 'Insulated roof panels', href: '/products/solid-roof-pergolas' },
    { texto: 'Motorized screens', href: '/products/motorized-screens' },
    { texto: 'Cantilevered aluminum pergolas', href: '/products/open-air-pergolas' },
  ],
  'modern-outdoor-living-trends-in-south-florida': [
    { texto: 'Equinox', href: '/brands/equinox' },
    { texto: 'Sun shelves with shaded cabanas', href: '/products/cabanas' },
    { texto: 'Ventilation hoods under louvered roofs', href: '/products/motorized-louvered-pergolas' },
  ],
  'pergola-building-codes-broward-palm-beach': [
    { texto: 'Fort Lauderdale', href: '/pergolas-contractors/fort-lauderdale-installation' },
    { texto: 'Coral Springs', href: '/pergolas-contractors/coral-springs-installation' },
    { texto: 'Boca Raton', href: '/pergolas-contractors/boca-raton-pergola-contractor' },
    { texto: 'Palm Beach Gardens', href: '/pergolas-contractors/palm-beach-gardens' },
    { texto: 'Jupiter', href: '/pergolas-contractors/jupiter-contractors' },
  ],
  'pergola-cost-south-florida': [
    { texto: 'Equinox', href: '/brands/equinox' },
    { texto: 'Solid aluminum panels', href: '/products/solid-roof-pergolas' },
    { texto: 'Screen integration', href: '/products/motorized-screens' },
    { texto: 'Deep reinforced footings', href: '/services/concrete' },
  ],
  'pergola-design-ideas-waterfront-properties': [
    { texto: 'Equinox', href: '/brands/equinox' },
    { texto: 'Deep reinforced concrete footings', href: '/services/concrete' },
    { texto: 'Bar seating', href: '/services/full-outdoor-remodel' },
  ],
  'pergola-permit-south-florida': [
    { texto: 'Equinox', href: '/brands/equinox' },
    { texto: 'Florida Building Code requirements', href: '/post/pergola-building-codes-broward-palm-beach' },
    { texto: 'Strict HOA oversight', href: '/post/hoa-rules-pergolas-south-florida' },
  ],
  'plan-pergola-south-florida-backyard': [
    { texto: 'Equinox', href: '/brands/equinox' },
    { texto: 'Cover for an outdoor kitchen', href: '/services/full-outdoor-remodel' },
    { texto: 'Florida Building Code requirements', href: '/post/pergola-building-codes-broward-palm-beach' },
  ],
  'poolside-pergola-ideas-for-florida-homes': [
    { texto: 'Equinox', href: '/brands/equinox' },
    { texto: 'Insulated roof panels', href: '/products/solid-roof-pergolas' },
    { texto: 'Built-in grill with ventilation', href: '/services/full-outdoor-remodel' },
  ],
  'resort-style-backyard-boca-raton': [
    { texto: 'Equinox', href: '/brands/equinox' },
    { texto: 'Use travertine or marble decking', href: '/services/pavers' },
    { texto: 'Private cabana or retreat corner', href: '/products/cabanas' },
    { texto: 'HOA aesthetic review', href: '/post/hoa-rules-pergolas-south-florida' },
  ],
};

/**
 * Los dos CTA del final del cuerpo, en los 21 articulos.
 *
 * Eran `<h3>` sin enlace: parecian botones, no lo eran, y encima entraban en el indice
 * lateral como si fueran secciones. Se convierten en una lista de dos enlaces reales,
 * con las clases de boton que el sitio ya usa en el CTA del pie.
 */
const CTA_VIEJO = '<h3>Schedule a Design Consultation</h3><h3>Request a Quote</h3>';
const CTA_NUEVO =
  '<div class="pp-post-cta">'
  + '<a href="/contact-us/schedule-a-visit" class="button w-button">Schedule a Design Consultation</a>'
  + '<a href="/contact-us/get-a-quote" class="button secundary w-button">Request a Quote</a>'
  + '</div>';

/**
 * La tabla comparativa de aluminum-pergola-cost-boca-raton-vs-fort-lauderdale.
 *
 * En el export llega como UN parrafo con las 18 celdas pegadas sin separador:
 * «FactorBoca RatonFort LauderdaleAvg. Price Per Sq Ft$90–$150+…». Ilegible para una
 * persona y para un buscador. Se reconstruye con HTML semantico.
 *
 * LOS DATOS SON LOS MISMOS, uno a uno: no se toca ni un precio ni una palabra. Lo unico
 * que cambia es que ahora se sabe que celda va con que encabezado.
 */
const TABLA_ROTA =
  '<p>FactorBoca RatonFort LauderdaleAvg. Price Per Sq Ft$90–$150+$85–$140+HOA ComplexityVery High'
  + 'Moderate–HighArchitectural DetailingMediterranean focusModern minimalismWaterfront Exposure'
  + 'Select areasCommonEngineering ComplexityHighHigh (waterfront-driven)</p>';

const TABLA_FILAS = [
  ['Avg. Price Per Sq Ft', '$90–$150+', '$85–$140+'],
  ['HOA Complexity', 'Very High', 'Moderate–High'],
  ['Architectural Detailing', 'Mediterranean focus', 'Modern minimalism'],
  ['Waterfront Exposure', 'Select areas', 'Common'],
  ['Engineering Complexity', 'High', 'High (waterfront-driven)'],
];

// El contenedor que hace scroll lateral en movil es `tabindex="0"` + `role="region"`
// con nombre: una zona desplazable que solo responde al raton deja la tabla
// inalcanzable con teclado, y es un fallo de accesibilidad real, no de estilo.
const TABLA_BUENA =
  '<div class="pp-tabla-scroll" role="region" tabindex="0"'
  + ' aria-label="Aluminum pergola cost factors: Boca Raton compared with Fort Lauderdale">'
  + '<table class="pp-tabla">'
  + '<caption>Aluminum pergola cost factors: Boca Raton compared with Fort Lauderdale</caption>'
  + '<thead><tr><th scope="col">Factor</th><th scope="col">Boca Raton</th>'
  + '<th scope="col">Fort Lauderdale</th></tr></thead><tbody>'
  + TABLA_FILAS.map(([f, b, l]) =>
    `<tr><th scope="row">${f}</th><td>${b}</td><td>${l}</td></tr>`).join('')
  + '</tbody></table></div>';

/**
 * Los 3 `<h1>` dentro del cuerpo de ese mismo articulo.
 *
 * Con el `<h1>` de la pagina hacen 4 en un documento. `prepararArticulo()` ya los
 * degradaba a `<h2>` al renderizar, asi que la pagina servida nunca llego a tener
 * cuatro; se corrigen tambien EN ORIGEN para que el fragmento diga la verdad y esa
 * degradacion quede de red de seguridad y no de parche imprescindible.
 */
const H1_EN_CUERPO = [
  'Aluminum Pergola Cost in Boca Raton',
  'Aluminum Pergola Cost in Fort Lauderdale',
  'Cost Comparison at a Glance',
];

/** Escapa lo que vaya a ir dentro de un regex. */
const escapar = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Recompone el cuerpo de un articulo del blog.
 *
 * Revienta si el markup esperado no esta: un articulo que se publica con la foto de IA,
 * sin el enlace o con el CTA muerto, y sin que nadie se entere, es exactamente el fallo
 * que esto viene a cerrar.
 */
export function recomponerPost(html, slug) {
  let s = html;
  const fotos = FOTOS[slug];
  const enlaces = ENLACES[slug];
  if (!fotos || !enlaces) {
    throw new Error(
      `[post] ${slug} no esta en scripts/lib/posts.mjs.\n`
      + '  Si el cliente ha publicado un articulo nuevo, hay que decidir su fotografia real\n'
      + '  y sus enlaces internos aqui. Sin eso saldria con las imagenes del CMS sin revisar.',
    );
  }

  // 1. Fotografia real donde la hay, y fuera el hueco donde no.
  for (const f of fotos) {
    if (f.quitar) {
      // Se va el <figure> ENTERO: dejar el <figure> vacio deja un hueco de maquetacion.
      const re = new RegExp(`<figure[^>]*>(?:(?!</figure>).)*?${escapar(f.de)}(?:(?!</figure>).)*?</figure>`, 's');
      if (!re.test(s)) {
        throw new Error(`[post] ${slug}: no encuentro el <figure> de ${f.de} para quitarlo`);
      }
      s = s.replace(re, '');
      continue;
    }
    const re = new RegExp(`(<img\\b[^>]*?)src="[^"]*${escapar(f.de)}"([^>]*>)`);
    const m = s.match(re);
    if (!m) throw new Error(`[post] ${slug}: no encuentro la imagen ${f.de}`);
    // Se reescribe la etiqueta entera: src nuevo, alt nuevo y fuera el alt viejo.
    const limpio = (m[1] + m[2]).replace(/\s*alt="[^"]*"/g, '');
    s = s.replace(re, limpio.replace(/<img\b/, `<img src="${f.a}" alt="${f.alt}"`));
  }

  // 2. Enlaces internos, sobre nodos de texto completos.
  for (const e of enlaces) {
    const re = new RegExp(`(<(li|p|strong)\\b[^>]*>)(${escapar(e.texto)})(</\\2>)`);
    if (!re.test(s)) {
      throw new Error(
        `[post] ${slug}: el texto a enlazar no aparece como nodo completo: «${e.texto}».\n`
        + '  O el cliente edito el articulo, o la cadena esta mal escrita en posts.mjs.\n'
        + '  NO se enlaza un trozo de parrafo: partiria la clave del diccionario de /es/.',
      );
    }
    s = s.replace(re, `$1<a href="${e.href}">$3</a>$4`);
  }

  // 3. Los dos CTA muertos del final.
  if (!s.includes(CTA_VIEJO)) {
    throw new Error(`[post] ${slug}: no encuentro los dos CTA del final para cablearlos`);
  }
  s = s.replace(CTA_VIEJO, CTA_NUEVO);

  // 4. Solo el articulo de costes: los 3 h1 del cuerpo y la tabla rota.
  if (slug === 'aluminum-pergola-cost-boca-raton-vs-fort-lauderdale') {
    for (const t of H1_EN_CUERPO) {
      const re = new RegExp(`<h1([^>]*)>${escapar(t)}</h1>`);
      if (!re.test(s)) throw new Error(`[post] ${slug}: no encuentro el <h1> «${t}»`);
      s = s.replace(re, `<h2$1>${t}</h2>`);
    }
    if (!s.includes(TABLA_ROTA)) {
      throw new Error(
        `[post] ${slug}: la tabla comparativa ya no llega como el parrafo pegado conocido.\n`
        + '  Si el cliente la ha arreglado en el CMS, quita esta regla de scripts/lib/posts.mjs.',
      );
    }
    s = s.replace(TABLA_ROTA, TABLA_BUENA);
  }

  return s;
}

/**
 * Los 40 `alt` en español, indexados por su original ingles.
 *
 * `traducirHtml()` SI traduce el atributo `alt` —esta en su lista blanca— pero, al
 * contrario que con los nodos de texto, NO reporta los que no encuentra: un alt sin
 * traducir sale en ingles en /es/ y no lo dice el aviso del build ni `check:i18n`. Por
 * eso el español vive pegado al ingles en la misma entrada de `FOTOS`, y por eso
 * `autocomprobar()` exige que los 40 lo tengan: la unica forma de que no se olvide uno
 * es que no exista el sitio donde olvidarlo.
 *
 * Se consume en src/pages/es/post/[slug].astro, que lo mezcla con el diccionario del
 * articulo.
 */
export const ALTS_ES = Object.fromEntries(
  Object.values(FOTOS).flat().filter((f) => !f.quitar).map((f) => [f.alt, f.altEs]),
);

/**
 * Comprueba la propia tabla de asignacion antes de usarla.
 *
 * Las tres reglas de reutilizacion del encargo no se pueden verificar mirando el HTML de
 * salida —ahi ya es tarde— y son justo las que se incumplen sin darse cuenta al mover una
 * linea de sitio. Se comprueban sobre los datos, y revientan el build.
 */
export function autocomprobar() {
  const vistas = new Map();
  for (const [slug, lista] of Object.entries(FOTOS)) {
    const enEste = new Set();
    for (const f of lista) {
      if (f.quitar) continue;
      if (PORTADAS_EN_USO.has(f.a)) {
        throw new Error(`[post] ${slug}: ${f.a} ya es portada de un articulo`);
      }
      if (enEste.has(f.a)) throw new Error(`[post] ${slug}: ${f.a} repetida dentro del articulo`);
      enEste.add(f.a);
      if (vistas.has(f.a)) {
        throw new Error(`[post] ${f.a} usada en ${vistas.get(f.a)} y en ${slug}`);
      }
      vistas.set(f.a, slug);
      if (!f.alt || f.alt.length < 25) {
        throw new Error(`[post] ${slug}: alt demasiado corto para ${f.a}`);
      }
      // Sin esto, el alt sale en ingles en /es/ y NO lo avisa nadie: la traduccion de
      // atributos no reporta ausencias. Ver la cabecera de ALTS_ES.
      if (!f.altEs || f.altEs.length < 25) {
        throw new Error(`[post] ${slug}: falta el alt en español de ${f.a}`);
      }
    }
  }
  return { fotos: vistas.size, quitadas: Object.values(FOTOS).flat().filter((f) => f.quitar).length };
}
