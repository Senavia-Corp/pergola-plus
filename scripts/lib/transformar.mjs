/**
 * Transformaciones del HTML de Webflow -> Astro.
 *
 * UNA sola fuente de verdad para las 27 plantillas. Hacerlo con un
 * transformador determinista en vez de a mano pagina por pagina es lo unico que
 * garantiza que la migracion sea realmente exacta y consistente.
 *
 * Lo que se toca, y NADA MAS:
 *   - rutas de assets      images/x -> /images/x   (y ../images/x)
 *   - enlaces internos     about-us/about-us.html -> /about-us
 *   - atributos internos    data-wf-page / -site / -page-id / -element-id
 *   - scripts de Webflow   finsweet (no aplica fuera de Webflow)
 *
 * Lo que se conserva INTACTO:
 *   - las 684 clases del sitio y las w-*
 *   - data-w-id y todos los data-* de interaccion (las 749 animaciones)
 *   - el texto, con sus entidades
 */

/** Archivo del export -> ruta del sitio. Confirmado contra el sitio en vivo. */
export const RUTAS = {
  'index.html': '/',
  'products.html': '/products',
  'services.html': '/services',
  'project-gallery.html': '/project-gallery',
  'thank-you.html': '/thank-you',
  '404.html': '/404',
  'about-us/about-us.html': '/about-us/about-us',
  'about-us/brands.html': '/about-us/brands',
  'about-us/industries-we-serve.html': '/about-us/industries-we-serve',
  'about-us/testimonials.html': '/about-us/testimonials',
  'about-us/where-we-work.html': '/about-us/where-we-work',
  'contact-us/get-a-quote.html': '/contact-us/get-a-quote',
  'contact-us/get-in-touch.html': '/contact-us/get-in-touch',
  'contact-us/schedule-a-visit.html': '/contact-us/schedule-a-visit',
  'resources/blog.html': '/resources/blog',
  'resources/faq.html': '/resources/faq',
  'resources/warranties.html': '/resources/warranties',
  // DESCARTADAS por decision explicita (ver docs/fase0-hallazgos.md):
  //   contact-us/get-services.html  -> 404 en el vivo, huerfana, despublicada
  //   resources/product-info.html   -> 404 en el vivo, sin contenido
};

/**
 * Enlaces rotos que ya venian del sitio original. Se corrigen en el markup Y se
 * cubren con un redirect 301, por si alguien tiene el enlace guardado.
 */
export const ENLACES_ROTOS = {
  '/deck-builders': '/services/deck-builders',
};

/**
 * Enlaces que en el original salen con href="#": nunca se les puso destino.
 *
 * No caben en ENLACES_ROTOS porque ahi la llave es el href, y aqui el href es el
 * mismo ("#") para todos: lo unico que distingue un enlace de otro es su TEXTO.
 * Por eso la llave es el texto y no la clase — el mismo boton aparece como
 * `button`, `button secundary` y `button tertiary` segun la seccion, y los tres
 * tienen que ir al mismo sitio.
 *
 * De donde sale cada destino:
 *
 *   Get A Quote / Schedule A Visit  los dos del bloque `call-to-action-footer`,
 *                                   que se repite en ~100 paginas.
 *   Explore Area Services           va en la seccion "Service Areas / Proudly
 *   Where We Work / Where We Serve  Serving South Florida"; where-we-work es
 *                                   justo ese indice (lista las 25 ciudades) y
 *                                   repite ese mismo H2.
 *   View Our Work                   /project-gallery = "Featured Projects".
 *   View Product Gallery            ANCLA, no pagina: las 5 paginas de marca ya
 *                                   traen <section id="Featured-Gallery">. El
 *                                   id estaba puesto y el boton sin cablear.
 *   Go to the main page             sale en el estado `w-form-done` del
 *                                   formulario, tras enviarlo.
 *   Terms / Privacy Policy          la nota al pie del formulario. Las dos
 *                                   paginas existen como articulos del CMS.
 */
export const BOTONES_MUERTOS = {
  'Get A Quote': '/contact-us/get-a-quote',
  'Schedule A Visit': '/contact-us/schedule-a-visit',
  'More About Us': '/about-us/about-us',
  'Where We Work': '/about-us/where-we-work',
  'Where We Serve': '/about-us/where-we-work',
  'Explore Area Services': '/about-us/where-we-work',
  'View Our Work': '/project-gallery',
  'View Product Gallery': '#Featured-Gallery',
  'Go to the main page': '/',
  'Terms': '/articles/terms-of-service',
  'Privacy Policy': '/articles/privacy-policy',
};

/**
 * Las 5 tarjetas de /resources/warranties. Las cinco dicen "Read More →", asi que
 * NO caben en BOTONES_MUERTOS: ahi la llave es el texto del enlace, y aqui el
 * texto es el mismo en las cinco. La llave es el titulo de la tarjeta, y cada una
 * va a la pagina de su marca.
 *
 * Faltan las dos puntas del desajuste entre garantias y marcas:
 *   MaestroShield  tiene tarjeta y NO tiene pagina de marca -> se queda muerta,
 *                  anotada en scripts/comprobar-enlaces-muertos.mjs.
 *   Appolo         tiene pagina de marca y NO tiene tarjeta.
 */
const TARJETA_GARANTIA = '<div class="warranty_item">';
const GARANTIAS = {
  FORTE: '/brands/pergola-plus-forte',
  Equinox: '/brands/equinox',
  Renaissance: '/brands/renaissance',
  Fenetex: '/brands/fenetex',
  // La quinta no tiene pagina de marca en el CMS, asi que su "Read More →"
  // llevaba meses en href="#". Se manda al fabricante en vez de dejarla muerta:
  // la garantia de MaestroShield la da MaestroShield, y su sitio es la fuente
  // real. Lleva target/rel porque sale del sitio (ver EXTERNAS abajo).
  MaestroShield: 'https://maestroshield.com/',
};

/** Las de GARANTIAS que salen del sitio. Se les pone target+rel al cablearlas. */
const GARANTIAS_EXTERNAS = new Set(['MaestroShield']);

/**
 * Indice de busqueda. El texto del enlace llega del vivo con basura pegada
 * ("Terms ", "Privacy Policy.", "Get a Quote" con la a en minuscula), asi que se
 * normaliza en vez de meter una entrada por variante.
 */
const normalizar = (t) => t.trim().toLowerCase().replace(/[.\s]+$/, '');
const POR_TEXTO = new Map(
  Object.entries(BOTONES_MUERTOS).map(([t, r]) => [normalizar(t), r]),
);

/**
 * Placeholders que el HTML pide a CDNs externos. Todos salen en estados vacios
 * del CMS (w-dyn-bind-empty) salvo la ilustracion del 404. Se descargan a
 * /images/ para no dejar NI UNA dependencia externa: el sitio tiene que
 * sobrevivir a la cancelacion de la cuenta de Webflow.
 *
 * Los dos de website-files.com son de OTRO sitio Webflow (68236ade...): son los
 * assets de demo del componente marquee de Finsweet.
 */
export const PLACEHOLDERS = {
  'https://d3e54v103j8qbb.cloudfront.net/plugins/Basic/assets/placeholder.60f9b1840c.svg': '/images/wf-placeholder.svg',
  // Mismo archivo, otro host: el HTML en vivo lo pide asi en algunas paginas y
  // ahi devuelve 403. Apunta a la misma copia local.
  'https://cdn.prod.website-files.com/plugins/Basic/assets/placeholder.60f9b1840c.svg': '/images/wf-placeholder.svg',
  'https://d3e54v103j8qbb.cloudfront.net/img/placeholder-thumb.svg': '/images/wf-placeholder-thumb.svg',
  'https://d3e54v103j8qbb.cloudfront.net/static/page-not-found.211a85e40c.svg': '/images/wf-page-not-found.svg',
  'https://cdn.prod.website-files.com/68236ade63ce8f10f54939cb/68375d0ede677a2f502a999b_Image.svg': '/images/wf-marquee-image.svg',
  'https://cdn.prod.website-files.com/68236ade63ce8f10f54939cb/6841efa48def69660e6eb254_Black.svg': '/images/wf-marquee-black.svg',
};

/**
 * Cambios de copy pedidos por el cliente (handoff §6, agosto 2026).
 *
 * La llave es el texto EXACTO del export, entidades incluidas. Los dos son
 * unicos en todo el sitio —solo salen en index.html— asi que la sustitucion
 * literal no puede alcanzar a otra pagina por accidente. Si el original cambiara
 * una coma, la clave deja de coincidir y el texto viejo se queda: visible en la
 * home, no roto, y lo caza la comparacion con la captura del vivo.
 *
 * El hero de la home es un VIDEO de fondo, no una imagen: aqui solo cambia el
 * texto que va encima. El video no se toca.
 *
 * Las traducciones viven en src/i18n/home.es.ts y sus claves son estos MISMOS
 * textos nuevos. Cambiar uno aqui sin cambiarlo alli deja esa cadena en ingles
 * en /es/, y eso lo mide check:i18n.
 */
export const TEXTOS_CLIENTE = {
  // Errata del contenido original: la frase acaba en "living.z". Sale en
  // /services/pergola-design-construction, en la entradilla de la galeria.
  'Explore our custom aluminum and louvered pergolas built across South Florida, engineered for durability, architectural integration, and elevated outdoor living.z':
    'Explore our custom aluminum and louvered pergolas built across South Florida, engineered for durability, architectural integration, and elevated outdoor living.',
  'South Florida’s Pergola &amp; Patio Cover Contractors': 'Live Outdoors. Beautifully.',
  'Pergola Plus Florida, your premiere contractors for pergolas and custom shade structures for luxury patios in South Florida. Fall in love with the outdoors under a custom Aluminum Pergola, Louvered Roof System, Patio Cover or Enclosure in your own backyard!':
    'South Florida’s trusted experts in outdoor remodels, hardscape, and custom shade structures — let’s elevate your backyard for true Florida living.',
};

/**
 * Fotos nuevas del cliente (handoff §6). Ruta que se sustituye -> archivo origen.
 *
 * POR QUE la llave es la ruta del CMS y no la pagina: cada una de estas imagenes
 * sale en VARIOS sitios —el hero de /products/<slug>, su tarjeta en la home y su
 * tarjeta en /products— y las tres piden el mismo archivo. Sustituyendo la ruta
 * se cambian las tres de golpe y no se pueden desincronizar.
 *
 * POR QUE el destino es /images/cliente/ y NO /cms-img/: cms-img esta en
 * .gitignore y la REGENERA instalar-assets.mjs desde assets-migracion/. Un
 * archivo nuevo ahi desaparece en la siguiente regeneracion, en silencio.
 * public/images/ si esta en git y instalar-assets.mjs nunca borra.
 *
 * Las tres rutas de producto que no aparecen (cabanas, carports, solar-pergolas)
 * y las tres de servicio (concrete, deck-builders, fence-solutions) conservan su
 * imagen: el cliente no mando foto nueva de esas.
 */
export const IMAGENES_CLIENTE = {
  // --- Productos (Our Products Thumbnails/) ---
  // OJO: esta NO es una foto de obra, es una imagen GENERADA que aporto el cliente
  // (17-ago-2026) para sustituir la suya. Su original —'MOTORIZED LOUVERED .png'—
  // era de 796x548, la mas pequena de las doce, y ni con Topaz x4 pasaba de una
  // nitidez de 328 cuando la mediana del sitio es 3002: se veia blanda en un hero
  // que se pinta a 1440 px (2880 en retina). La generada mide 2102 al mismo tamano.
  //
  // Va por la rama de «original», no por la de upscale, y eso es a proposito: la
  // reja de SSIM de optimizar-imagenes-cliente.mjs existe para cazar que una IA le
  // cambie la casa a una RESTAURACION, y aqui la sustitucion es deliberada, asi que
  // la suspenderia con razon. La foto original y su Topaz siguen en
  // ~/Downloads/hf-topaz/descartados/ por si se quiere volver atras.
  //
  // El BASENAME se conserva exacto ('MOTORIZED LOUVERED.png') porque `rutaCliente`
  // saca de el la ruta publica: renombrarlo cambiaria /images/cliente/*.avif y con
  // ello el markup de los cuatro ficheros generados que la piden. La procedencia va
  // en la carpeta ('regeneradas/'), no en el nombre.
  '/cms-img/products/motorized-louvered-pergolas/hero-louvered-roof-pergola-south-florida.avif':
    'Our Products Thumbnails/regeneradas/MOTORIZED LOUVERED.png',
  '/cms-img/products/motorized-screens/hero-motorized-screens-pergola-south-florida.avif':
    'Our Products Thumbnails/Motorized Screens.png',
  '/cms-img/products/open-air-pergolas/hero-open-air-aluminum-pergola-south-florida.avif':
    'Our Products Thumbnails/Open-Air Pergolas.png',
  '/cms-img/products/polycarbonate-pergolas/hero-polycarbonate-pergola-south-florida.avif':
    'Our Products Thumbnails/Polycarbonate Pergola.jpg',
  '/cms-img/products/screen-enclosures/hero-screen-enclosure-south-florida-installation.avif':
    'Our Products Thumbnails/Screen Enclosure.jpg',
  '/cms-img/products/sukkha/hero-lakewood-sukkah-pergola-succos-1920.avif':
    'Our Products Thumbnails/Sukkah.jpeg',
  // Del pergola de techo solido mandaron DOS: "Our Products Thumbnails/Solid Roof
  // Pergola.jpg" (1080x1350, vertical) y esta (1888x1166, horizontal). Esta ruta
  // la consumen tres cajas horizontales —tarjeta de 250px de alto en la home y en
  // /products, y el hero de la pagina— asi que gana la horizontal: es la que menos
  // recorte pierde. La vertical queda sin usar, anotada en docs/decisiones.md.
  '/cms-img/products/solid-roof-pergolas/hero-insulated-roof-pergola-south-florida.avif':
    'Home Page/Solid Roof Pergolas.png',

  // --- Servicios (Our Services Thumbnails/) ---
  '/cms-img/services/pergola-design-construction/cover-polycarbonate-pergola-contractors-south-florida-06.avif':
    'Our Services Thumbnails/Custom Pergolas and Patio Covers.png',
  '/cms-img/services/patio-remodeling/cover-luxury-patio-remodel-south-florida-project.avif':
    'Our Services Thumbnails/Full Outdoor Remodel.JPEG',
  '/cms-img/services/driveways/cover-modern-paver-driveway-south-florida-project.avif':
    'Our Services Thumbnails/Meith_Driveway 2.jpg',
  '/cms-img/services/pavers/cover-luxury-paver-patio-south-florida-project.avif':
    'Our Services Thumbnails/Pavers.jpg',

  // --- Proyecto destacado (Home Page/) ---
  // Sale en las tarjetas de "Recent Projects" de la home y en /project-gallery.
  '/cms-img/projects/forte-plus-pergolas-in-hillsboro-beach-estate/hero-forte-plus-pergolas-hillsboro-beach-estate-oceanfront.avif':
    'Home Page/Forte Plus Hillsboro Estate.jpeg',
};

/**
 * Excepciones al recorte automatico. La llave es el archivo de origen.
 *
 * Por defecto se recorta con `position:'attention'` de sharp, que elige la region
 * con mas entropia. Funciona en 10 de las 12, pero premia cielo y pared blanca
 * sobre la estructura, y en estas dos se llevaba por delante el producto:
 *
 *   Sukkah.jpeg          1024x1034 -> 1.78:1 es un recorte grande. `attention`
 *                        se quedaba con la fachada del edificio y dejaba fuera
 *                        el sukkah iluminado, que es LO QUE SE VENDE. Con `south`
 *                        entra entero, con las mesas.
 *   Forte Plus Hillsboro  la pergola esta en el centro y las palmeras arriba;
 *                        `attention` subia hacia las palmeras y el cielo.
 *
 * Comprobado a ojo sobre las 12 recortadas, no supuesto: ver docs/decisiones.md.
 */
export const RECORTE = {
  'Our Products Thumbnails/Sukkah.jpeg': 'south',
  'Home Page/Forte Plus Hillsboro Estate.jpeg': 'centre',
};

/**
 * Ruta publica de una foto del cliente. Un solo ancho y una sola relacion para
 * las 12, porque las 12 caen en cajas con `object-fit:cover` y altura fija en el
 * CSS migrado: la relacion intrinseca no la ve nadie.
 *
 * POR QUE 2500x1406 Y NO LOS 1250x703 QUE HABIA
 *
 * 1250x703 era lo que median los heroes del CMS que sustituyen, y se copio ese
 * numero para que ningun slot cambiara de comportamiento. Pero eso convirtio el
 * limite del CMS VIEJO en el limite de las fotos NUEVAS: los originales que mando
 * el cliente llegan hasta 4996x3747 y se estaban tirando los pixeles de en medio.
 * La auditoria de nitidez lo marco: estas cajas se pintan a 1440 px de ancho en
 * escritorio, o sea 2880 px en retina, y serviamos 1250 (0,87x).
 *
 * 2500x1406 es la misma relacion (1,778) y el doble de pixeles. No llega a los
 * 2880 ideales a proposito: por encima de 2500 varias fotos ya no tienen pixeles
 * REALES que dar —habria que inventarlos— y el peso de la home no lo justifica.
 *
 * Cambiar estos dos numeros obliga a regenerar: van horneados en el markup.
 *   npm run imagenes:cliente && npm run medir:imagenes
 *   node scripts/generar-paginas.mjs && node scripts/generar-detalle.mjs
 *
 * ponytail: un ancho y una relacion para todas. Sobra para dos —forte-plus se
 * pinta en 950x450 y custom-pergolas en 593x450—, pero el techo de bytes de
 * optimizar-imagenes-cliente.mjs ya acota lo que eso cuesta, y un mapa por ruta
 * seria mas codigo que el problema. Si algun dia una caja pide otra RELACION,
 * entonces si: aqui se mete el mapa.
 */
export const CLIENTE_ANCHO = 2500;
export const CLIENTE_ALTO = 1406;
export const rutaCliente = (origen) =>
  '/images/cliente/' +
  origen.split('/').pop().replace(/\.[^.]+$/, '')
    .toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '.avif';

/**
 * Title y description de las 11 paginas estaticas.
 *
 * Webflow les dejo un <title> que era el nombre del menu —"FAQ", "About Us",
 * "Warranties"— y NINGUNA description, asi que las 11 heredaban la del sitio y
 * quedaban 12 paginas compartiendo exactamente el mismo texto. Un title de 3
 * caracteres no dice nada en un resultado de busqueda, y doce descripciones iguales
 * le piden a Google que elija cual indexa.
 *
 * Estas paginas SI son responsabilidad nuestra: no son contenido del CMS, no hay
 * campo `Title SEO` para ellas en ningun sitio. El contenido de cada una sale de su
 * propio <h1> y de su cuerpo, no de la nada.
 *
 * (Distinto es el copy que el cliente SI escribio en el CMS —los 50 `Title SEO` de
 * posts, ubicaciones y marcas—: ese no se toca, ver el comentario de check:seo.)
 */
export const SEO_ESTATICAS = {
  '/about-us/about-us': {
    title: 'About Pergola Plus Florida | Licensed Contractor',
    description: 'Who we are: a licensed and insured South Florida contractor building custom pergolas and outdoor structures for over ten years.',
  },
  '/about-us/brands': {
    title: 'Our Brand Partners | Pergola Plus Florida',
    description: 'The manufacturers behind our systems — FORTE, Equinox, Renaissance, Fenetex and Apollo — and what each one is engineered for.',
  },
  '/about-us/industries-we-serve': {
    title: 'Industries We Serve | Pergola Plus Florida',
    description: 'Residential, hospitality, commercial and property management projects across Miami-Dade, Broward and Palm Beach counties.',
  },
  '/about-us/testimonials': {
    title: 'Client Reviews & Testimonials | Pergola Plus',
    description: 'What South Florida homeowners and businesses say about working with us, from the first design meeting to the finished installation.',
  },
  '/about-us/where-we-work': {
    title: 'Where We Work | South Florida Service Areas',
    description: 'The cities and counties we build in across Miami-Dade, Broward and Palm Beach, with a dedicated page for each service area.',
  },
  '/contact-us/get-a-quote': {
    title: 'Request a Custom Pergola Quote | South Florida',
    description: 'Tell us about your patio or backyard and get a tailored proposal for an engineered aluminum pergola or patio cover system.',
  },
  '/contact-us/get-in-touch': {
    title: 'Contact Pergola Plus Florida | Boca Raton, FL',
    description: 'Call, email or write to our Boca Raton team about pergolas, patio covers and screen enclosures anywhere in South Florida.',
  },
  '/contact-us/schedule-a-visit': {
    title: 'Book a Free Design Consultation | Pergola Plus',
    description: 'Schedule a consultation to review design options, system features and the right shade structure for your outdoor space.',
  },
  '/resources/faq': {
    title: 'Pergola FAQ | Permits, Wind Load & Timelines',
    description: 'Answers to what we get asked most: permits, HOA approval, wind load, materials, maintenance and how long installation takes.',
  },
  '/resources/warranties': {
    title: 'Warranty Information | Pergola Plus Florida',
    description: 'Warranty coverage on our FORTE, Equinox, Renaissance, Fenetex and MaestroShield systems, and what each one actually protects.',
  },
  '/404': {
    title: 'Page Not Found | Pergola Plus Florida',
    description: 'That page does not exist. Browse our pergola systems, services and project gallery, or get in touch with our South Florida team.',
  },
};

/**
 * Title y description de las 19 paginas que el CMS dejo sin `Title SEO`.
 *
 * Las 19 salian del build con el MISMO <title>Pergola Plus Florida</title>: los 10
 * productos, los 7 servicios y las 2 legales. Duplicar el title en 19 paginas es
 * competir contra uno mismo, y ademas es lo unico que un usuario lee en la pestana y
 * en el resultado de busqueda.
 *
 * NO se han inventado: cada uno sale del <h1> y de la entradilla que el cliente ya
 * escribio en esa pagina. Lo que se anade es el encuadre geografico, que es real —el
 * negocio opera en Miami-Dade, Broward y Palm Beach— y lo que la gente busca.
 *
 * Rangos que exige check:seo: title 30-65 y description 70-160 caracteres, unicos en
 * todo el sitio. La puerta los mide, asi que no hay que confiar en el ojo.
 *
 * Fase 3 del proyecto (Sanity): esto se muda al campo `Title SEO` de cada item y esta
 * tabla desaparece.
 */
export const SEO_FALTANTE = {
  // --- Productos ---
  'products/cabanas': {
    title: 'Custom Aluminum Cabanas | South Florida',
    description: 'Poolside and freestanding aluminum cabanas engineered for South Florida wind loads, built for shade, privacy and year-round outdoor use.',
  },
  'products/carports': {
    title: 'Aluminum Carports for South Florida Homes',
    description: 'Engineered aluminum carports that shield vehicles from sun, rain and salt air, permitted and installed across Miami-Dade, Broward and Palm Beach.',
  },
  'products/motorized-louvered-pergolas': {
    title: 'Motorized Louvered Pergolas | South Florida',
    description: 'Adjustable louvered roof pergolas that open for sun and close against rain, engineered and installed for South Florida homes and patios.',
  },
  'products/motorized-screens': {
    title: 'Motorized Screens for Patios & Pergolas',
    description: 'Retractable motorized screens that turn a patio or pergola into shaded, insect-free living space at the touch of a button.',
  },
  'products/open-air-pergolas': {
    title: 'Open-Air Aluminum Pergolas | South Florida',
    description: 'Classic open-slat aluminum pergolas that frame a patio and filter the Florida sun, built to local code and finished to last in coastal air.',
  },
  'products/polycarbonate-pergolas': {
    title: 'Polycarbonate Roof Pergolas in Florida',
    description: 'Translucent polycarbonate pergola roofs that keep out rain and UV while leaving the patio bright, engineered for coastal Florida conditions.',
  },
  'products/screen-enclosures': {
    title: 'Pool & Patio Screen Enclosures | Florida',
    description: 'Screen enclosures for pools and patios, engineered for Florida wind loads and built to keep insects and debris out all year round.',
  },
  'products/solar-pergolas': {
    title: 'Solar Roof Pergolas for Florida Homes',
    description: 'Pergolas with integrated solar roof panels that shade the patio and generate power, engineered for South Florida installations and permitting.',
  },
  'products/solid-roof-pergolas': {
    title: 'Insulated Solid Roof Pergolas | Florida',
    description: 'Insulated solid-roof pergolas and patio covers that cut heat and block rain, engineered for South Florida homes and county permitting.',
  },
  'products/sukkha': {
    title: 'Sukkha 3000 Pergola System | Pergola Plus',
    description: 'The Sukkha 3000 system: a purpose-built aluminum structure for sukkah use, engineered and installed across South Florida properties.',
  },

  // --- Servicios ---
  'services/concrete': {
    title: 'Structural Concrete Services | South Florida',
    description: 'Reinforced footings, slabs and structural concrete that form the foundation of high-end outdoor projects across South Florida.',
  },
  'services/deck-builders': {
    title: 'Custom Deck Builders in South Florida',
    description: 'Composite and aluminum decks designed and built for upscale Florida homes, engineered for durability in heat, rain and salt air.',
  },
  'services/driveways': {
    title: 'Paver Driveway Design & Installation | FL',
    description: 'High-end paver driveways designed and installed with engineered bases and proper drainage for South Florida properties.',
  },
  'services/fence-solutions': {
    title: 'Custom Fence Installation | South Florida',
    description: 'Custom fencing for privacy, security and architectural cohesion on luxury residential properties across South Florida.',
  },
  'services/patio-remodeling': {
    title: 'Patio Remodeling in South Florida',
    description: 'We turn outdated patios into refined outdoor living spaces, from surfaces and shade to lighting, drainage and finishes.',
  },
  'services/pavers': {
    title: 'Luxury Paver Installation | South Florida',
    description: 'Premium paver patios, pool decks and driveways installed on engineered bases, with drainage built for Florida heavy rain.',
  },
  'services/pergola-design-construction': {
    title: 'Custom Pergola Design & Construction | FL',
    description: 'Fully engineered custom pergolas designed and built for high-end homes across Palm Beach, Broward and Miami-Dade counties.',
  },

  // --- Legales ---
  'articles/privacy-policy': {
    title: 'Privacy Policy | Pergola Plus Florida',
    description: 'How Pergola Plus Florida collects, uses and protects the personal information you share through this site and our contact forms.',
  },
  'articles/terms-of-service': {
    title: 'Terms & Conditions | Pergola Plus Florida',
    description: 'The terms that govern use of the Pergola Plus Florida website and the services we provide to homeowners and businesses.',
  },
};

/**
 * Los 3 formularios del sitio y su etiqueta de origen.
 *
 * El del pie vive en src/components/Footer.astro (codigo propio) y se cablea alli.
 * Los otros dos son markup migrado y los cablea cablearFormularios(), abajo.
 */
export const FORMULARIOS = {
  'email-form': 'quote',
  'wf-form-Contact-Page-Form': 'contact',
};

/**
 * Colisiones de `name`/`id` que traia el formulario de presupuesto.
 *
 * TRES campos distintos —que producto quiere, cuanto se quiere gastar y para
 * cuando— salieron del editor de Webflow con el MISMO name e id,
 * `Estimated-Project-Budget`. Y la casilla de consentimiento SMS comparte
 * `Paver-Extension` con la casilla de mejora del mismo nombre.
 *
 * Con `method="get"` y sin destino daba igual: nadie leia el resultado. En un POST
 * de verdad los valores se pisan entre si, y lo que llega es un lead con el
 * presupuesto donde deberia ir el producto. Los `id` duplicados ademas rompen
 * cualquier `<label for>` y la navegacion por teclado.
 *
 * Se distinguen por POSICION y por un atributo, no por su texto, porque el texto es
 * lo unico que un cambio de copy puede mover:
 *
 *   selects  el 1o es el producto, el 2o el presupuesto, el 3o el plazo. El
 *            fragmento es salida generada y determinista, asi que el orden es
 *            estable; si algun dia deja de serlo, check:formularios lo caza.
 *   casillas la de consentimiento es la unica con `required=""`.
 */
const RENOMBRAR_QUOTE = {
  colision: 'Estimated-Project-Budget',
  // Ocurrencia del CAMPO (no del atributo) -> nombre nuevo. La 2 se queda como
  // esta: es la que de verdad pregunta por el presupuesto.
  //
  // Se resuelve en UNA pasada a proposito. La primera version aplicaba una regla
  // por nombre, y como cada pasada trabajaba sobre el resultado de la anterior, al
  // llegar a la tercera solo quedaban dos campos con el nombre colisionado y el
  // indice 3 no se alcanzaba nunca: el plazo se quedaba sin renombrar y seguia
  // pisando al presupuesto.
  porOcurrencia: { 1: 'Shade-Structure', 3: 'Project-Timeline' },
};

/** Nombre accesible para los campos que solo traen placeholder. */
const ETIQUETA_POR_PLACEHOLDER = true;

/**
 * Cablea un formulario migrado: destino real, campos ocultos, colisiones de nombre,
 * autocompletado y nombres accesibles.
 *
 * Opera SOLO dentro del `<form>`, para no poder tocar nada de la pagina por error.
 */
function cablearFormulario(form, origen, ruta) {
  let s = form;

  // 1. Destino real. Lo primero y lo unico imprescindible: sin esto el formulario
  //    recarga la pagina con los datos en la URL, que es lo que hacia.
  s = s.replace(' method="get"', ' method="post" action="/api/lead"');

  // 2. Los atributos de Webflow que ya no significan nada fuera de su backend. Se
  //    quitan para que nadie los lea como si todavia hicieran algo: el redirect lo
  //    decide el endpoint con un 303.
  s = s.replace(/ redirect="[^"]*"/g, '').replace(/ data-redirect="[^"]*"/g, '');

  // 2b. data-wf-no-turnstile: APAGA el manejador de Turnstile de webflow.js.
  //
  //     Este era un bug de verdad y silencioso. El modulo `forms` de webflow.js
  //     hace, literalmente:
  //
  //       v && !i.is("[data-wf-no-turnstile]") && (
  //          t.prop("disabled", !0), t.addClass("w-form-loading"),
  //          f.on(typeof turnstile !== "undefined" ? "ready" : o, ...) )
  //
  //     Es decir: si el formulario trae `data-turnstile-sitekey` —y los dos
  //     migrados lo traen— al enviar DESHABILITA el boton, le pone
  //     `w-form-loading` y se queda esperando el script de Turnstile. Ese script lo
  //     servia la plataforma Webflow y aqui NO se carga, asi que la espera no
  //     termina nunca: el boton se queda deshabilitado para siempre y el visitante
  //     no puede reintentar sin recargar la pagina.
  //
  //     Medido en /contact-us/get-in-touch: tras un primer envio el submit quedaba
  //     con `disabled: true` y los clics siguientes no disparaban ni el evento
  //     submit. Sin error en consola.
  //
  //     Y el sitekey SE VA del markup. Medido en /contact-us/get-a-quote recien
  //     cargada, sin haber enviado nada:
  //
  //       window.turnstile              -> "object"   (lo carga webflow.js)
  //       #email-form submit.disabled   -> true
  //       #wf-form-Footer-Form          -> disabled + clase w-form-loading
  //
  //     Es decir: el atributo hace que webflow.js cargue Turnstile y deje TODOS los
  //     formularios de la pagina en estado "enviando" esperando un widget que aqui
  //     no se renderiza nunca. Con el submit deshabilitado desde el primer instante,
  //     en las DOS paginas cuyo unico trabajo es captar leads, y arrastrando tambien
  //     al formulario del pie. Sin error en consola y sin nada visible: el boton se
  //     ve normal, con su cursor:pointer, y no responde.
  //
  //     Poner `data-wf-no-turnstile` en el <form> NO basta: webflow.js lo busca en
  //     otro sitio. Se comprobo y el boton seguia deshabilitado.
  //
  //     El sitekey no se pierde: vive en .env.example y en docs/estado-final.md, que
  //     es donde va una clave de configuracion. Cuando se monte el widget de verdad
  //     se anade el script de Cloudflare y su contenedor, y el token llega al
  //     endpoint como `cf-turnstile-response` — que ya lo espera.
  s = s.replace(/^<form /, '<form data-wf-no-turnstile ');
  s = s.replace(/ data-turnstile-sitekey="[^"]*"/g, '');

  // 3. Colisiones de name/id (solo el de presupuesto).
  if (origen === 'quote') {
    const { colision, porOcurrencia } = RENOMBRAR_QUOTE;
    let campo = 0;
    s = s.replace(new RegExp(`(id|name)="${colision}"`, 'g'), (tal_cual, attr) => {
      // Cada campo aporta un `id` y un `name` en ese orden, asi que el `id` marca el
      // comienzo de un campo nuevo.
      if (attr === 'id') campo++;
      const nuevo = porOcurrencia[campo];
      return nuevo ? `${attr}="${nuevo}"` : tal_cual;
    });
    if (campo !== 3) {
      throw new Error(
        `el formulario de presupuesto tiene ${campo} campos "${colision}" y esperaba 3: `
        + 'revisa RENOMBRAR_QUOTE en scripts/lib/transformar.mjs',
      );
    }
    // La casilla de consentimiento: la unica Paver-Extension con required. Los
    // atributos de en medio se capturan y se devuelven tal cual — el markup trae
    // `data-name` y `class` entre el id y el required, asi que exigir que vayan
    // pegados no encaja con nada.
    const antesConsent = s;
    s = s.replace(
      /<input type="checkbox" name="Paver-Extension" id="Paver-Extension"([^>]*\brequired=""[^>]*)\/>/,
      '<input type="checkbox" name="SMS-Consent" id="SMS-Consent"$1/>',
    );
    if (s === antesConsent) {
      throw new Error(
        'la casilla de consentimiento SMS no se pudo renombrar: seguiria compartiendo '
        + 'name/id con la casilla de mejora "Paver-Extension"',
      );
    }
    s = s.replace(
      /<span class="text-mini-form w-form-label" for="Paver-Extension">/,
      '<span class="text-mini-form w-form-label" for="SMS-Consent">',
    );
  }
  if (origen === 'contact') {
    // Aqui la casilla de consentimiento se llamaba "Checkbox", que no dice nada en
    // un lead ni en un CRM.
    s = s.replace(/name="Checkbox" id="Checkbox"/, 'name="SMS-Consent" id="SMS-Consent"')
         .replace(/for="Checkbox"/g, 'for="SMS-Consent"');
  }

  // 4. Autocompletado. Ahorra teclear y en movil es la diferencia entre que rellenen
  //    el formulario y que lo abandonen.
  const AUTO = {
    'Full-Name': 'name', 'First-Name': 'given-name', 'Last-Name': 'family-name',
    email: 'email', Email: 'email',
    Phone: 'tel', 'Phone-Number': 'tel',
    'Street-Address': 'street-address', City: 'address-level2', 'ZIP-Code': 'postal-code',
  };
  for (const [campo, valor] of Object.entries(AUTO)) {
    s = s.replace(
      new RegExp(`(<(?:input|select)[^>]*\\bname="${campo}")`, 'g'),
      `$1 autocomplete="${valor}"`,
    );
  }

  // 5. Nombre accesible. Los <label for> que ya existen se respetan; lo que solo
  //    trae placeholder se etiqueta con aria-label.
  //
  //    ponytail: aria-label y no convertir los <div class="text-block-6"> en
  //    <label> para TODO. Los tres selects si se convierten (abajo) porque tienen un
  //    rotulo visible al lado; los campos de texto no tienen ninguno, solo
  //    placeholder, y un placeholder desaparece al escribir: aria-label es el
  //    nombre accesible correcto sin inventar texto visible que el cliente no pidio.
  if (ETIQUETA_POR_PLACEHOLDER) {
    s = s.replace(/<input\s([^>]*?)\/>/g, (tal_cual, attrs) => {
      if (/\baria-label=|\btype="(?:hidden|submit|checkbox|radio)"/.test(attrs)) return tal_cual;
      const ph = attrs.match(/placeholder="([^"]+)"/)?.[1];
      if (!ph) return tal_cual;
      return `<input ${attrs.trim()} aria-label="${ph}"/>`;
    });
  }

  // 6. Los rotulos de los selects pasan a ser <label for> de verdad. El texto y la
  //    clase no cambian, asi que se ve igual; `label.text-block-6{display:block}` en
  //    src/styles/formulario.css compensa que <label> sea inline.
  const rotulos = [
    ['Which Shade Structure Are You Interested In?', 'Shade-Structure'],
    ['Estimated Project Budget:', 'Estimated-Project-Budget'],
    ['When Would You Like To Start?', 'Project-Timeline'],
    ['Select your project type:', 'Project-Type'],
  ];
  for (const [texto, id] of rotulos) {
    s = s
      .replace(
        `<div class="text-block-6"><strong>${texto}</strong></div>`,
        `<label class="text-block-6" for="${id}"><strong>${texto}</strong></label>`,
      )
      .replace(
        `<div class="text-block-6">${texto}</div>`,
        `<label class="text-block-6" for="${id}">${texto}</label>`,
      );
  }

  // 6b. Los Back/Next del multipaso pasan a ser <button>.
  //
  //     Llegaron del export como <a href="#">: controles de Finsweet que nunca
  //     tuvieron destino. Como enlaces son enlaces muertos —los caza check:enlaces— y
  //     ademas mienten sobre lo que hacen: un enlace navega, y estos no.
  //
  //     El elemento correcto es <button type="button">: sin href que no lleva a
  //     ningun sitio, con semantica de control y con teclado nativo (Espacio y Enter
  //     lo activan, cosa que un <a> sin href no hace). `type="button"` es
  //     obligatorio: sin el, un <button> dentro de un <form> ENVIA el formulario, y
  //     "Siguiente" mandaria el paso 1 a medio rellenar.
  //
  //     Las clases se conservan, asi que se ven igual; src/styles/formulario.css
  //     compensa lo unico que cambia (un <button> no hereda la tipografia).
  s = s.replace(
    /<a id="msf-(back|next)" href="#" class="([^"]*)"([^>]*)>([\s\S]*?)<\/a>/g,
    (_todo, cual, clases, resto, dentro) =>
      `<button type="button" id="msf-${cual}" class="${clases}"${resto}>${dentro}</button>`,
  );

  // 6c. El boton de envio sale del PASO 3 y entra en la barra de acciones.
  //
  //     Llegaba dentro de `.wrapper-buttons-center-form`, o sea DENTRO del tercer
  //     `.msf-step`, mientras Atras/Siguiente viven en `.msf-buttons`, fuera y
  //     debajo. La consecuencia es que la accion principal cambia de sitio segun el
  //     paso: en el 1 y el 2 esta en la barra, y en el 3 aparece en mitad de la
  //     tarjeta, encima de la letra pequena y con "Atras" POR DEBAJO de ella.
  //
  //     Desde CSS no tiene arreglo. El submit y los Back/Next no son hermanos ni
  //     comparten un ancestro cercano: `order` solo reordena hermanos, y sacarlo
  //     con `position:absolute` lo dejaria colgado de la altura variable de un
  //     texto legal.
  //
  //     El texto legal NO se mueve: se queda cerrando el paso 3, que es donde tiene
  //     sentido leerlo antes de enviar.
  //
  //     OJO AL CSS QUE ACOMPANA A ESTO. `.msf-buttons` ya no puede ser
  //     `display:none` sin JavaScript: se llevaria por delante el UNICO boton de
  //     envio del formulario y la pagina de captacion se quedaria muda para quien
  //     navegue sin JS. Ese cambio esta en src/styles/formulario.css, seccion 5.
  if (origen === 'quote') {
    const antesSacar = s;
    let submit = '';
    s = s.replace(
      /<div class="wrapper-buttons-center-form">\s*(<input type="submit"[^>]*\bid="msf-submit"[^>]*\/>)/,
      (_todo, boton) => {
        submit = boton;
        return '<div class="wrapper-buttons-center-form">';
      },
    );
    if (s === antesSacar || !submit) {
      throw new Error(
        'no se pudo sacar <input id="msf-submit"> de .wrapper-buttons-center-form: '
        + 'ha cambiado el markup de docs/vivo/contact-us__get-a-quote.html',
      );
    }

    // Se inserta con funcion y no con "$1$2": si el value del boton llevara un "$&"
    // o un "$1", el reemplazo por cadena lo interpretaria como referencia.
    const antesMeter = s;
    s = s.replace(
      /(<button type="button" id="msf-next"[^>]*>[\s\S]*?<\/button>)(\s*<\/div>)/,
      (_todo, next, cierra) => next + submit + cierra,
    );
    if (s === antesMeter) {
      // Este throw no es decorativo: si el primero acierta y este falla, el
      // formulario se queda SIN boton de envio. Tiene que romper el build.
      throw new Error(
        'el submit se saco del paso 3 pero no se pudo meter en .msf-buttons: '
        + 'el formulario se quedaria sin boton de envio',
      );
    }
  }

  // 7. Campos ocultos. Van justo despues de la etiqueta de apertura.
  //
  //    formulario  que formulario es, para el endpoint y para el lead.
  //    pagina      donde se envio. Se pone en SERVIDOR, asi que llega tambien sin
  //                JavaScript; el endpoint no puede deducirla (su propia URL es
  //                /api/lead).
  //    t           milisegundos del render. Lo rellena el JS: un formulario enviado
  //                en menos de 2s no lo ha rellenado una persona. Vacio sin JS, y
  //                entonces la comprobacion no se aplica — no se penaliza a quien
  //                navega sin JavaScript.
  //    js          "1" solo si hay JavaScript. Decide si la respuesta es JSON o 303.
  //    website     trampa. Un campo que pide algo plausible y que ninguna persona ve.
  const abre = s.match(/^<form[^>]*>/)[0];
  const ocultos =
    `<input type="hidden" name="formulario" value="${origen}"/>`
    + `<input type="hidden" name="pagina" value="${ruta}"/>`
    + '<input type="hidden" name="t" value=""/>'
    + '<input type="hidden" name="js" value=""/>'
    // La trampa no lleva <label>: el contenedor es aria-hidden, asi que ningun
    // lector de pantalla llega al campo y la etiqueta solo anadiria una cadena mas
    // que traducir en /es/.
    + '<div class="pp-trampa" aria-hidden="true">'
    + `<input type="text" id="pp-website-${origen}" name="website" tabindex="-1" autocomplete="off"/>`
    + '</div>'
    + (CON_TURNSTILE.has(origen) ? widgetTurnstile() : '');
  s = s.replace(abre, abre + ocultos);

  return s;
}

/**
 * Los formularios que llevan Turnstile: los DOS de captacion.
 *
 * El del pie NO, y es deliberado: va en las 211 paginas, asi que montarlo ahi
 * mete un script de terceros —y sus cookies— en todo el sitio para proteger un
 * campo de correo de boletin. Es el objetivo de spam de menor valor que hay aqui,
 * y se queda con la trampa y el temporizador.
 *
 * ponytail: el techo de esta decision, dicho en voz alta — un bot puede mandar
 * `formulario=footer` y esquivar Turnstile. Lo que consigue con eso es meter
 * basura en el boletin, NO fabricar una solicitud de presupuesto: la lista blanca
 * OBLIGATORIOS de /api/lead solo le pide `email` a ese formulario y no acepta los
 * campos del otro. Si algun dia el pie capta algo que importe, este Set es el
 * unico sitio que hay que tocar.
 */
const CON_TURNSTILE = new Set(['quote', 'contact']);

/**
 * El sitekey va AQUI, como constante, y no por variable de entorno.
 *
 * Es publico por definicion —viaja en el HTML servido— y esto es salida generada
 * que se comitea: si saliera de process.env, el HTML generado dependeria de quien
 * ejecuta el generador y `check:generadores` fallaria para todo el que no tuviera
 * la variable. El SECRETO si es variable de entorno, y solo de servidor.
 *
 * OJO CON EL NOMBRE DEL ATRIBUTO. Es `data-sitekey`, que es lo que espera
 * Cloudflare. NUNCA `data-turnstile-sitekey`: en cuanto el modulo `forms` de
 * webflow.js ve ese segundo nombre en la pagina, carga su propio Turnstile y deja
 * TODOS los formularios de la pagina en `w-form-loading` con el submit
 * deshabilitado, esperando un widget que no llega — sin un error en consola y con
 * el boton de aspecto normal. Ya paso una vez y mato las dos paginas de captacion.
 * Por eso los <form> conservan ademas `data-wf-no-turnstile`.
 */
const TURNSTILE_SITEKEY = '0x4AAAAAAAQTptj2So4dx43e';

/**
 * El widget + su script. El script va junto al widget y no en el <head> del
 * BaseLayout porque solo lo necesitan estas dos paginas, y el <head> es comun a
 * las 211.
 *
 * Renderizado implicito: el script busca los `.cf-turnstile` del DOM al cargar y
 * deja un <input name="cf-turnstile-response"> DENTRO del formulario. Como el
 * envio con JS hace `new FormData(form)`, el token viaja solo — no hay que tocar
 * Formulario.astro.
 */
const widgetTurnstile = () =>
  `<div class="cf-turnstile" data-sitekey="${TURNSTILE_SITEKEY}"></div>`
  + '<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>';

/** Aplica cablearFormulario a los formularios migrados que haya en la pagina. */
export function cablearFormularios(html, ruta) {
  let s = html;
  for (const [id, origen] of Object.entries(FORMULARIOS)) {
    const i = s.indexOf(`<form id="${id}"`);
    if (i < 0) continue;
    const j = s.indexOf('</form>', i);
    if (j < 0) throw new Error(`<form id="${id}"> sin cerrar en ${ruta}`);
    const form = s.slice(i, j + 7);
    s = s.slice(0, i) + cablearFormulario(form, origen, ruta) + s.slice(j + 7);
  }
  return s;
}

/**
 * Atributos internos de Webflow que se quitan del CUERPO.
 *
 * data-wf-page-id y data-wf-element-id son metadatos de los formularios de
 * Webflow y no hacen nada fuera de su backend.
 *
 * OJO CON DOS QUE **NO** ESTAN EN ESTA LISTA:
 *
 *  - data-w-id  : es la llave que une cada elemento con su interaccion dentro de
 *                 webflow.js. Borrar uno = ese elemento deja de animarse, sin
 *                 error y sin aviso.
 *
 *  - data-wf-page (en <html>) : parecia basura interna, pero NO lo es. Es una
 *                 constante del propio modulo IX2 dentro de webflow.js, al lado
 *                 de w-mod-js y w-mod-ix, y es lo que le dice a IX2 QUE pagina
 *                 es esta y por tanto que interacciones cargar. Sin el, las
 *                 animaciones de entrada no se disparan y los elementos con
 *                 opacity:0 se quedan invisibles para siempre. Hay 34 valores
 *                 distintos, uno por pagina: lo pone BaseLayout via prop.
 */
const ATRIBUTOS_BASURA = /\s+data-wf-(?:page-id|element-id)="[^"]*"/g;

const EXT = 'jpg|jpeg|png|webp|avif|svg|gif';

/**
 * Reescribe las URLs del CDN de Webflow a la copia local.
 *
 * En el HTML en vivo conviven DOS site IDs y hay que tratarlos distinto:
 *
 *   698a55281e50ce048618d1ae -> assets del CMS. Estan en el manifest (los bajo
 *                               PROMPT A) y se resuelven por URL exacta.
 *   6903b7794d5df3d76a7a2488 -> assets del sitio. Son los mismos que el export
 *                               trae en images/, servidos por CDN. Se resuelven
 *                               por NOMBRE DE ARCHIVO quitando el hash, lo que
 *                               ademas cubre las variantes -p-500/-p-800 del
 *                               srcset.
 *
 * `mapa` = img-map.json (url -> {src})
 * `locales` = Set con los nombres de archivo que hay en public/images/
 *
 * Si una URL no se resuelve por ninguna via, se LANZA. Un fallo de build vale
 * mas que una imagen apuntando a Webflow en produccion.
 */
/**
 * Nombres de los archivos que hay en public/videos/. El hero los pide al CDN.
 * Se leen una vez al cargar el modulo.
 */
const VIDEOS = new Set(
  await (async () => {
    const { readdir } = await import('node:fs/promises');
    const { fileURLToPath } = await import('node:url');
    const dir = fileURLToPath(new URL('../../public/videos/', import.meta.url));
    try { return await readdir(dir); } catch { return []; }
  })(),
);

/**
 * Ancho y alto real de cada imagen de public/, medidos por
 * scripts/medir-imagenes.mjs.
 *
 * El markup de Webflow no traia width ni height en NINGUNA imagen: 6853 <img> en las
 * 107 paginas. Sin ellos el navegador no sabe cuanto hueco reservar hasta descargar el
 * archivo, asi que el contenido salta mientras carga — eso es CLS, una de las tres
 * Core Web Vitals, y no lo caza ninguna otra puerta porque el sitio se ve "bien" una
 * vez cargado.
 */
const DIMENSIONES = await (async () => {
  const { readFile } = await import('node:fs/promises');
  const { fileURLToPath } = await import('node:url');
  const f = fileURLToPath(new URL('../../src/lib/img-dim.json', import.meta.url));
  try { return JSON.parse(await readFile(f, 'utf8')); } catch { return {}; }
})();

/**
 * Inyecta width/height en cada <img> cuya ruta este medida.
 *
 * NO se llama desde transformar(): se aplica UNA vez sobre dist/ al terminar el build
 * (ver la integracion en astro.config.mjs). El motivo es cobertura: por el
 * transformador solo pasa el HTML migrado, y las imagenes estan tambien en el Nav, en
 * el Footer —o sea en las 107 paginas— y en el blog, que son codigo propio. Aplicarlo
 * en los dos sitios serian dos implementaciones de lo mismo; aplicarlo solo en el
 * transformador dejaba 4201 <img> de 7147 sin dimensiones.
 *
 * Reglas:
 *   - No toca las que ya los traen (las fotos del cliente los llevan puestos).
 *   - Solo rutas locales que existan en el mapa. Una ruta que no este no se inventa.
 *   - `srcset` da igual: el navegador usa width/height del `src` solo para la
 *     RELACION de aspecto, y todas las variantes -p-500/-p-800 comparten relacion.
 *   - El CSS sigue mandando (`width:100%`, `object-fit:cover`): estos atributos no
 *     cambian como se ve nada, solo reservan el hueco antes de tiempo.
 */
export function dimensionarImagenes(html) {
  return html.replace(/<img\s([^>]*?)(\/?)>/g, (tal_cual, attrs, cierre) => {
    if (/\bwidth=|\bheight=/.test(attrs)) return tal_cual;
    const src = attrs.match(/\bsrc="([^"]+)"/)?.[1];
    if (!src) return tal_cual;
    const dim = DIMENSIONES[decodeURIComponent(src)];
    if (!dim) return tal_cual;
    return `<img ${attrs.trim()} width="${dim[0]}" height="${dim[1]}"${cierre}>`;
  });
}

export function reescribirImagenes(html, mapa, locales) {
  const sinResolver = new Set();

  const resolver = (url) => {
    if (mapa[url]) return mapa[url].src;
    const base = decodeURIComponent(url.split('/').pop()).replace(/^[0-9a-f]{20,32}_/i, '');
    if (locales.has(base)) return `/images/${base}`;
    sinResolver.add(url);
    return null;
  };

  // Pasada 1: URLs planas.
  const RX = new RegExp(`https://cdn\\.prod\\.website-files\\.com/[^"'\\s)\\\\]+?\\.(?:${EXT})(?:\\.(?:${EXT}))*`, 'gi');
  let s = html.replace(RX, (url) => resolver(url) ?? url);

  // Pasada 1b: VIDEO. El hero de la home carga el mp4, el webm y el poster desde
  // el CDN, y ademas con la barra codificada (%2F) dentro de la ruta. No entran
  // por el patron de imagen, asi que se resuelven aparte contra public/videos/.
  const RXV = /https:\/\/cdn\.prod\.website-files\.com\/[^"'\s)\\]+?\.(?:mp4|webm|mov|m4v|jpg|jpeg|png)/gi;
  s = s.replace(RXV, (url) => {
    const base = decodeURIComponent(url.split(/[/]|%2F/i).pop()).replace(/^[0-9a-f]{20,32}_/i, '');
    if (VIDEOS.has(base)) return `/videos/${base}`;
    if (locales.has(base)) return `/images/${base}`;
    sinResolver.add(url);
    return url;
  });

  // Pasada 2: URLs URL-CODIFICADAS.
  // El lightbox de Webflow guarda su configuracion en un
  // <script type="application/json"> metido dentro de un atributo, asi que ahi
  // las URLs salen como https%3A%2F%2Fcdn.prod.website-files.com%2F...
  // Sin esta pasada quedaban 32 paginas apuntando al CDN de Webflow aunque el
  // <img> visible ya estuviera reescrito.
  const RXE = new RegExp(`https%3A%2F%2Fcdn\\.prod\\.website-files\\.com%2F[^"'\\s)\\\\]+?\\.(?:${EXT})`, 'gi');
  s = s.replace(RXE, (enc) => {
    const url = decodeURIComponent(enc);
    const local = resolver(url);
    return local ? encodeURIComponent(local) : enc;
  });

  return { html: s, sinResolver: [...sinResolver] };
}

/**
 * El embed de Google Reviews, tal cual sale del vivo. Literal y no regex a
 * proposito: si Webflow cambiara una coma, mejor que deje de coincidir y salte la
 * puerta de scripts/comprobar-cta.mjs a que se coma medio documento.
 */
const ELFSIGHT_RESENAS =
  '<div class="code-embed-2 w-embed w-script"><!-- Elfsight Google Reviews | Pergola Plus -->\n' +
  '<div class="elfsight-app-3da28fc2-41dc-4c2e-ab75-297b8e71f6eb" data-elfsight-app-lazy></div></div>';

/** Destino del enlace que sustituye al embed. */
const RESENAS = '/about-us/testimonials';

/**
 * La portada del CMS de cada ficha de detalle: /products/<slug> -> { src, alt }.
 *
 * Sale de img-map.json y no de leer la carpeta porque ahi esta el alt REDACTADO por
 * el CMS. Las 17 portadas existen, ninguna tiene el alt vacio y —medido sobre el
 * build— no se usaban en ninguna de las 211 paginas: eran el unico retrato de cada
 * producto que la migracion habia dejado fuera.
 *
 * width/height no se ponen aqui: los inyecta dimensionarImagenes() sobre dist/ al
 * cerrar el build, que es donde estan medidas las 7147 imagenes del sitio.
 */
const PORTADAS = await (async () => {
  const { readFile } = await import('node:fs/promises');
  const { fileURLToPath } = await import('node:url');
  const f = fileURLToPath(new URL('../../src/lib/img-map.json', import.meta.url));
  let mapa;
  try { mapa = JSON.parse(await readFile(f, 'utf8')); } catch { return {}; }
  const portadas = {};
  for (const v of Object.values(mapa)) {
    const m = v.src?.match(/^\/cms-img\/(products|services)\/([^/]+)\/cover-/);
    if (m) portadas[`/${m[1]}/${m[2]}`] = { src: v.src, alt: v.alt || v.altDerivado || '' };
  }
  return portadas;
})();

/** Marca de que la pagina trae el FAQ de ficha. Es exclusivo de las 17 de detalle. */
const FAQ_SECCION = 'class="section-faq-page"';

/**
 * La apertura del FAQ de ficha, IDENTICA en los 17 fragmentos (comprobado byte a
 * byte). Es literal a proposito, como el resto de anclas de este fichero: si el
 * markup cambia, mejor que reviente el build a que la columna deje de salir.
 */
const FAQ_ANCLA = '<div class="section-faq-page"><div class="w-layout-blockcontainer w-container">';

/**
 * Los tres diferenciales del hero de la HOME. Se retiran por peticion del cliente.
 *
 * Es el bloque entero, no los tres <div> sueltos: `.tagline` es el contenedor flex
 * que les da la fila y el hueco, asi que dejarlo vacio dejaria su margen y el <h1>
 * no subiria. Solo esta en la home; las fichas de producto tienen su propio
 * `.tagline-product` con otro contenido y no se tocan.
 *
 * Va aqui y NO editando src/contenido-migrado/estaticas/index.html, que es salida
 * generada: un solo `node scripts/generar-paginas.mjs` se lo llevaria por delante en
 * silencio. Es el mismo error que ya paso con el widget de resenas.
 */
const HERO_DIFERENCIALES =
  '<div class="tagline"><div class="tagline-item"><img src="/images/1.svg" loading="lazy" alt="" class="icon-tagline"/><div>Licensed &amp; Insured</div></div>'
  + '<div class="tagline-item"><img src="/images/2.svg" loading="lazy" alt="" class="icon-tagline"/><div>+10 Years of Experience</div></div>'
  + '<div class="tagline-item"><img src="/images/3.svg" loading="lazy" alt="" class="icon-tagline"/><div>Financing Available</div></div></div>';

/**
 * Juegos de logos que lleva la pista del marquee. Minimo 2: la animacion salta UN
 * juego por vuelta y hace falta al menos otro detras para tapar el salto.
 *
 * Este numero es tambien el divisor del @keyframes en marquee.css, y de el sale el
 * ancho maximo al que la barra se ve entera: techo = (JUEGOS - 1) juegos. Medido a
 * 703 px el juego de 5 logos, 8 juegos dan 4920 px de techo.
 */
export const MARQUEE_JUEGOS = 8;

/** La apertura de la lista es IDENTICA en los dos ficheros; es el ancla estable. */
const MARQUEE_LISTA =
  '<div fs-marquee-element="list" role="list" class="fs-marquee-logos_list w-dyn-items">';

/**
 * Un item del marquee de logos. `<img>` autocerrado, asi que el `</div>` no goloso
 * cierra siempre el item y no puede comerse el resto de la lista.
 *
 * OJO: `fs-marquee-element="item"` a secas NO sirve como ancla. En
 * about-us__industries-we-serve lo llevan tambien los 20 items de los DOS marquees
 * de fotos (fs-marquee-picture-right / -left), que estan igual de muertos pero
 * quedan fuera de este arreglo. Por eso se exige la clase del logo.
 */
const MARQUEE_ITEM =
  /^<div fs-marquee-element="item" role="listitem" class="fs-marquee-logos_item w-dyn-item"><img\b[^>]*class="fs-marquee-logos_logo"[^>]*\/><\/div>/;

/**
 * Duplica los logos del marquee hasta MARQUEE_JUEGOS y marca las copias.
 *
 * Se para si el ancla no aparece, si no hay items, o si el reparto no cuadra. El
 * fallo que se evita es el que no se ve: si el ancla dejara de casar —porque cambie
 * el orden de un atributo en el export— el generador escribiria la pagina sin
 * duplicar y el marquee seguiria muerto, sin romper el build ni ninguna puerta.
 */
function duplicarMarquee(html) {
  if (!html.includes(MARQUEE_LISTA)) return html;

  const trozos = html.split(MARQUEE_LISTA);
  if (trozos.length !== 2) {
    throw new Error(`[marquee] se esperaba UNA lista de logos y hay ${trozos.length - 1}`);
  }

  // Se consumen los items uno a uno desde el principio del resto: asi se sabe
  // exactamente donde acaba la lista sin parsear HTML.
  let resto = trozos[1];
  const items = [];
  for (;;) {
    const m = resto.match(MARQUEE_ITEM);
    if (!m) break;
    items.push(m[0]);
    resto = resto.slice(m[0].length);
  }

  if (items.length === 0) {
    throw new Error('[marquee] la lista de logos no trae ningun item: cambio el markup del export?');
  }
  if (MARQUEE_JUEGOS < 2) {
    throw new Error(`[marquee] MARQUEE_JUEGOS tiene que ser 2 o mas y es ${MARQUEE_JUEGOS}`);
  }

  // Las copias salen del arbol de accesibilidad: alt vacio en la imagen (la saca a
  // ella) y aria-hidden en el item (quita ademas el role="listitem" duplicado, que
  // si no anunciaria una lista de 40 elementos).
  const copias = items
    .map((it) =>
      it
        .replace(/\salt="[^"]*"/, ' alt=""')
        .replace('<div fs-marquee-element="item"', '<div aria-hidden="true" fs-marquee-element="item"'),
    )
    .join('');

  const pista = items.join('') + copias.repeat(MARQUEE_JUEGOS - 1);

  return (
    trozos[0]
    + MARQUEE_LISTA.replace('<div fs-marquee-element="list"', '<div data-pp-marquee fs-marquee-element="list"')
    + pista
    + resto
  );
}

/**
 * Juegos que lleva cada pista de FOTOS. Dos bastan y no son un numero al azar.
 *
 * La animacion salta UN juego por vuelta, asi que hace falta al menos otro detras
 * para tapar el salto. El techo de ancho al que la tira se ve entera es
 * (JUEGOS - 1) juegos: aqui cada juego son 10 fotos de ~300-370 px, o sea ~3.300 px,
 * de modo que con 2 juegos la tira cubre hasta 3.300 px de viewport. De sobra.
 *
 * Los logos necesitan 8 porque cada logo mide ~110 px y su juego se queda en ~700.
 */
export const MARQUEE_FOTOS_JUEGOS = 2;

/** Las dos pistas de fotos, en el orden en que se recorren. */
const MARQUEE_FOTOS = ['right', 'left'].map((lado) => ({
  lado,
  lista: `<div fs-marquee-element="list" role="list" class="fs-marquee-picture-${lado}_list w-dyn-items">`,
  item: new RegExp(
    `^<div fs-marquee-element="item" role="listitem" class="fs-marquee-picture-${lado}_item w-dyn-item">`
    + '<img\\b[^>]*\\/><\\/div>',
  ),
}));

/**
 * Duplica las DOS pistas de fotos y las marca para animarlas.
 *
 * Mismo mecanismo que duplicarMarquee() para los logos, y por las mismas razones: se
 * para si el ancla no aparece o si una pista se queda sin items, porque el fallo que
 * importa es el silencioso — un ancla que deja de casar escribiria la pagina sin
 * duplicar, la tira se quedaria corta y al llegar al final saltaria a un hueco
 * blanco, sin romper el build.
 *
 * Cada pista lleva `data-pp-marquee-fotos` con su lado: de ahi cuelga el sentido de
 * la animacion en marquee.css, para que las dos filas corran en direcciones
 * contrarias.
 */
function duplicarMarqueeFotos(html) {
  let salida = html;

  for (const pista of MARQUEE_FOTOS) {
    if (!salida.includes(pista.lista)) continue;

    const trozos = salida.split(pista.lista);
    if (trozos.length !== 2) {
      throw new Error(
        `[marquee-fotos] se esperaba UNA pista "${pista.lado}" y hay ${trozos.length - 1}`,
      );
    }

    let resto = trozos[1];
    const items = [];
    for (;;) {
      const m = resto.match(pista.item);
      if (!m) break;
      items.push(m[0]);
      resto = resto.slice(m[0].length);
    }

    if (items.length === 0) {
      throw new Error(
        `[marquee-fotos] la pista "${pista.lado}" no trae ningun item: cambio el markup del export?`,
      );
    }

    // Las copias salen del arbol de accesibilidad: alt vacio y aria-hidden en el
    // item, que ademas quita el role="listitem" duplicado — si no, un lector de
    // pantalla anunciaria una lista con el doble de fotos de las que hay.
    const copias = items
      .map((it) =>
        it
          .replace(/\salt="[^"]*"/, ' alt=""')
          .replace(
            `<div fs-marquee-element="item"`,
            `<div aria-hidden="true" fs-marquee-element="item"`,
          ),
      )
      .join('');

    salida =
      trozos[0]
      + pista.lista.replace(
        '<div fs-marquee-element="list"',
        `<div data-pp-marquee-fotos="${pista.lado}" fs-marquee-element="list"`,
      )
      + items.join('') + copias.repeat(MARQUEE_FOTOS_JUEGOS - 1)
      + resto;
  }

  return salida;
}

/**
 * `ruta` es opcional y solo la usa el paso 6b, para no dejar un enlace a si misma
 * en la pagina de testimonios. Las paginas de detalle no la pasan: ninguna es esa.
 */
export function transformar(html, ruta) {
  let s = html;

  // 1. Assets a rutas absolutas desde la raiz.
  //    Hay que cubrir cuatro formas, no solo la obvia:
  //      src="images/x"                        comilla normal
  //      url(&quot;videos/x&quot;)              comilla codificada, dentro de style=""
  //      data-video-urls="a.mp4,videos/b.webm" listas separadas por coma
  //      srcset="images/a 500w, images/b 800w" srcset
  const CARPETAS = 'images|js|css|videos';
  s = s.replace(new RegExp(`(["'(,]|&quot;|&#34;)\\s*\\.\\.\\/(${CARPETAS})\\/`, 'g'), '$1/$2/');
  s = s.replace(new RegExp(`(["'(,]|&quot;|&#34;)\\s*(${CARPETAS})\\/`, 'g'), '$1/$2/');

  // 2. Enlaces internos. Se ordena de mas largo a mas corto para que
  //    "about-us/about-us.html" no lo pise "about-us.html".
  const pares = Object.entries(RUTAS).sort((a, b) => b[0].length - a[0].length);
  for (const [archivo, ruta] of pares) {
    for (const pref of ['../', '']) {
      s = s.replaceAll(`href="${pref}${archivo}"`, `href="${ruta}"`);
    }
  }
  // Las descartadas: si alguna pagina las enlazara, que falle el build y no que
  // quede un enlace muerto en produccion.
  for (const muerta of ['contact-us/get-services.html', 'resources/product-info.html']) {
    for (const pref of ['../', '']) {
      if (s.includes(`href="${pref}${muerta}"`)) {
        throw new Error(`Enlace a una pagina descartada: ${pref}${muerta}`);
      }
    }
  }

  // 3. Enlaces rotos heredados.
  for (const [malo, bueno] of Object.entries(ENLACES_ROTOS)) {
    s = s.replaceAll(`href="${malo}"`, `href="${bueno}"`);
  }

  // 3b. Enlaces sin destino. Se sustituye SOLO el href; la clase, el texto y
  //     cualquier data-* se quedan igual. Lo que no este en el mapa no se toca.
  s = s.replace(/<a href="#"([^>]*)>([^<]*)<\/a>/g, (tal_cual, attrs, texto) => {
    const ruta = POR_TEXTO.get(normalizar(texto));
    if (!ruta) return tal_cual;
    // Un destino que es ancla solo vale si el ancla esta EN esta pagina. Si
    // manana sale ese boton en una plantilla sin la seccion, mejor dejarlo muerto
    // y que lo cace la puerta que inventar un salto a ninguna parte.
    if (ruta.startsWith('#') && !s.includes(`id="${ruta.slice(1)}"`)) return tal_cual;
    return `<a href="${ruta}"${attrs}>${texto}</a>`;
  });

  // 3c. Las tarjetas de garantia, cada una a su marca. Se trocea por tarjeta para
  //     leer el titulo de CADA una; sin eso no hay forma de saber a que marca va
  //     un "Read More →" que es identico en las cinco. La sustitucion pide la
  //     clase entera (`warraty-card-link`, con la errata de Webflow) para que no
  //     pueda cruzarse con ningun otro href="#" del trozo.
  s = s
    .split(TARJETA_GARANTIA)
    .map((trozo, i) => {
      if (i === 0) return trozo;
      const titulo = trozo.match(/<h3[^>]*>([^<]*)/)?.[1] ?? '';
      const marca = Object.keys(GARANTIAS).find((m) => titulo.includes(m));
      if (!marca) return trozo;
      // Las externas abren en pestana nueva y con rel="noopener": sin el, la
      // pagina destino recibe window.opener y puede reescribir la nuestra.
      const extra = GARANTIAS_EXTERNAS.has(marca)
        ? ' target="_blank" rel="noopener"'
        : '';
      return trozo.replace(
        '<a href="#" class="warraty-card-link',
        `<a href="${GARANTIAS[marca]}"${extra} class="warraty-card-link`,
      );
    })
    .join(TARJETA_GARANTIA);

  // 4. Atributos internos.
  s = s.replace(ATRIBUTOS_BASURA, '');

  // 4b. Placeholders de CDN externo -> copia local.
  for (const [remoto, local] of Object.entries(PLACEHOLDERS)) s = s.replaceAll(remoto, local);

  // 4c. Copy nuevo del cliente. Va DESPUES de los enlaces a proposito: los textos
  //     de BOTONES_MUERTOS son llaves de enlace y estos son prosa, no se cruzan.
  for (const [viejo, nuevo] of Object.entries(TEXTOS_CLIENTE)) s = s.replaceAll(viejo, nuevo);

  // 4e. Formularios: destino real, campos ocultos y colisiones de name/id. Va antes
  //     del paso 7 (is:inline) para que los <input> nuevos no lleven sorpresas.
  s = cablearFormularios(s, ruta);

  // 4g. Encabezado principal donde no habia.
  //
  //     El 404 traia su titulo en un <h2> y ningun <h1>: la pagina no tenia
  //     encabezado principal. Es el mismo texto, subido de nivel.
  if (ruta === '/404') {
    s = s.replace('<h2>Page Not Found</h2>', '<h1>Page Not Found</h1>');
  }

  // 4h. /articles/privacy-policy llega VACIA. No es un fallo de la migracion:
  //     tambien esta vacia en produccion. El campo de texto enriquecido del CMS
  //     renderiza `w-dyn-bind-empty` —cero palabras de cuerpo, medido: 372 palabras
  //     en toda la pagina, que son el nav, el pie y el CTA compartido— mientras
  //     /articles/terms-of-service trae 4.554.
  //
  //     Y el export del CMS enrarece mas la cosa: el item "Privacy Policy" SI tiene
  //     ~19.400 caracteres en su campo Content, pero empiezan por
  //     "<h1>Terms &amp; Conditions</h1>" y son el MISMO contrato de obra que el otro
  //     item. O sea que no hay politica de privacidad en ninguna parte.
  //
  //     Importa porque esa pagina esta enlazada desde el pie de las 107 paginas y
  //     desde el texto de consentimiento de los dos formularios ("you agree to our
  //     Terms & Privacy Policy") — justo donde se recogen datos personales.
  //
  //     NO se inventa una politica de privacidad: eso es contenido legal que depende
  //     de como trata el cliente los datos, y un texto plausible pero falso es peor
  //     que una pagina vacia. Se pone un aviso honesto con una via de contacto, y
  //     queda anotado como bloqueante en docs/estado-final.md.
  if (ruta === '/articles/privacy-policy') {
    const antes = s;
    s = s.replace(
      '<div class="w-dyn-bind-empty w-richtext"></div>',
      '<div class="w-richtext">'
      + '<h1>Privacy Policy</h1>'
      + '<p>Our full privacy policy is being finalized and will be published here.</p>'
      + '<p>In the meantime, if you want to know what personal information we hold about'
      + ' you, how we use it, or you want it corrected or deleted, write to'
      + ' <a href="mailto:info@pergolaplusflorida.com">info@pergolaplusflorida.com</a>'
      + ' or call <a href="tel:+15617108363">(561) 710-8363</a> and we will answer you'
      + ' directly.</p>'
      + '<p>The terms that govern our construction work are published in full under'
      + ' <a href="/articles/terms-of-service">Terms &amp; Conditions</a>.</p>'
      + '</div>',
    );
    if (s === antes) {
      throw new Error(
        '/articles/privacy-policy ya no trae el bloque vacio del CMS: si el cliente ha '
        + 'rellenado el campo, quita esta regla de scripts/lib/transformar.mjs',
      );
    }
  }

  // 4d. Fotos nuevas del cliente. Se sustituye la RUTA, asi que alcanza al src y
  //     tambien al srcset y al JSON del lightbox si algun dia esa imagen sale ahi.
  //
  //     Y se inyecta width/height, que el markup de Webflow no traia en ninguna
  //     imagen: sin ellos el navegador no sabe la relacion de aspecto hasta que
  //     descarga el archivo, y eso es CLS. El CSS manda igual (`object-fit:cover`
  //     con altura fija), asi que los atributos solo sirven para reservar el hueco.
  for (const [ruta, origen] of Object.entries(IMAGENES_CLIENTE)) {
    if (!s.includes(ruta)) continue;
    s = s.replaceAll(ruta, rutaCliente(origen));
  }
  // El width/height se pone sobre la ruta YA sustituida, en un solo barrido: un
  // <img> puede llevar la ruta en src y en srcset y no queremos duplicar atributos.
  s = s.replace(/<img\s([^>]*?)\/?>/g, (tal_cual, attrs) => {
    if (!attrs.includes('/images/cliente/')) return tal_cual;
    if (/\swidth=/.test(attrs)) return tal_cual;
    return `<img ${attrs.trim()} width="${CLIENTE_ANCHO}" height="${CLIENTE_ALTO}"/>`;
  });

  // 4i. OnceHub: fachada diferida en vez de carga inmediata.
  //
  //     /contact-us/schedule-a-visit incrusta el calendario de OnceHub con un
  //     <script src="https://cdn.oncehub.com/mergedjs/so.js"> en medio del cuerpo. Se
  //     descarga y ejecuta SIEMPRE, aunque el visitante no llegue a bajar hasta el
  //     widget — y trae consigo las cookies y el rastreo de un tercero desde el
  //     primer instante.
  //
  //     El contenedor (#SOIDIV_...) y sus data-* se conservan intactos: el script de
  //     OnceHub los busca por ahi cuando por fin se carga. Lo unico que cambia es
  //     CUANDO se carga, y de eso se encarga src/components/Agenda.astro con un
  //     IntersectionObserver.
  //
  //     Sin JavaScript el widget no aparece —tampoco aparecia antes, es un widget de
  //     JavaScript— asi que la fachada deja ademas un enlace a la pagina de contacto,
  //     que antes no habia: sin JS la pagina se quedaba en blanco.
  //     La fachada RESERVA el hueco. Medido antes de ponerla: el contenedor del
  //     widget mide 0px de alto hasta que OnceHub inyecta su iframe, asi que al
  //     cargar la pagina daba un salto de 550px — y diferir la carga solo lo habria
  //     empeorado, porque el salto llega mas tarde y con el visitante ya leyendo.
  //     Con `min-height` el hueco esta desde el primer frame.
  s = s.replace(
    /<script[^>]*src="https:\/\/cdn\.oncehub\.com\/[^"]*"[^>]*><\/script>/g,
    '<div class="pp-agenda-fachada" data-pp-oncehub="https://cdn.oncehub.com/mergedjs/so.js">'
    + '<p class="pp-agenda-cargando">Loading the booking calendar…</p>'
    + '<p class="pp-agenda-alterna">'
    + 'Prefer not to wait? Call <a href="tel:+15617108363">(561) 710-8363</a>'
    + ' or <a href="/contact-us/get-in-touch">send us a message</a>.'
    + '</p>'
    + '</div>',
  );

  // 4j. La barra de logos de marca: de marquee MUERTO a carrusel infinito.
  //
  //     Llego del export como un componente de Finsweet (`fs-marquee-*`) y el script
  //     que lo movia es de la plataforma Webflow, asi que la migracion no se lo lleva
  //     — igual que paso con los 127 carruseles. Lo que quedo no da ningun error:
  //
  //       .fs-marquee-logos_list { justify-content: center }   los 5 logos, quietos
  //       .fs-marquee-logos_list-wrapper { overflow: clip }    y recortados
  //
  //     Medido en el navegador: UN juego de 5 logos ocupa 703 px. A 1440 no llega ni
  //     a la mitad del ancho, y a 2560 es un cuarto. Por eso no basta con duplicar
  //     una vez: al final de cada vuelta la pista tiene que seguir dando contenido
  //     hasta el borde derecho, o se ve el hueco.
  //
  //     La pista lleva JUEGOS copias planas y la animacion salta UN juego por vuelta.
  //     Como el contenido se repite con periodo de un juego, el salto cae sobre una
  //     configuracion identica y no hay costura. Lo que queda por detras —los otros
  //     JUEGOS-1— es lo que tapa la ventana: techo = 7 x 703 = 4920 px.
  //
  //     ponytail: techo conocido — por encima de 4920 px de viewport se veria hueco;
  //     se sube JUEGOS (y el divisor del @keyframes con el) y ya. No se envuelven los
  //     juegos en <div> a proposito: la lista es role="list" y un hijo que no sea
  //     role="listitem" rompe la relacion lista/elemento.
  //
  //     Las copias van con alt="" y aria-hidden="true": sin eso un lector de pantalla
  //     anunciaria una lista de 40 elementos y los 5 logos ocho veces cada uno.
  //
  //     El atributo `data-pp-marquee` NO es decorativo: le da al CSS propio
  //     especificidad (0,2,0) para ganarle al (0,1,0) de Webflow sin depender del
  //     orden en que salgan las hojas del build, y es el ancla de check:marquee.
  s = duplicarMarquee(s);
  s = duplicarMarqueeFotos(s);

  // 4k. El opacity:0 EN LINEA de los elementos que animaba IX2.
  //
  //     Son 111 en los fragmentos (50 instancias en las 211 paginas construidas), y
  //     los 12 data-w-id distintos que lo llevan son los 12 objetivos de una entrada
  //     por scroll. Webflow los exportaba invisibles a proposito: los encendia IX2 al
  //     entrar en pantalla, y NO llevan bloque anti-FOUC, asi que no habia ninguna
  //     otra red debajo.
  //
  //     Al apagar las 110 entradas de IX2 (scripts/parchear-webflow.mjs) ya no queda
  //     nadie que los encienda. Medido en el navegador antes de escribir esto: la home
  //     se quedaba con .hero-block-video invisible PARA SIEMPRE, sin un solo error en
  //     consola y sin que el layout se moviera. Es el fallo que no avisa.
  //
  //     Ahora el estado en reposo es visible y la entrada la pone
  //     src/styles/animaciones.css, cuyos keyframes terminan en opacity:1.
  s = s.replace(/(<[a-z]+[^>]*\bdata-w-id="[^"]+")\s+style="opacity:0"/gi, '$1');

  //     Si queda alguno, es un elemento que se quedaria invisible y que ademas no
  //     tiene data-w-id, o sea que ni siquiera hay una entrada que pudiera encenderlo.
  //     Preferible reventar el build que publicarlo en blanco.
  const huerfano = s.match(/<[^>]*style="opacity:0"[^>]*>/i);
  if (huerfano) {
    throw new Error(
      `opacity:0 en linea sin data-w-id en ${ruta}: ${huerfano[0].slice(0, 120)}\n`
      + '  Nadie lo va a encender. Mira src/styles/animaciones.css antes de seguir.',
    );
  }

  // 5. Config de Finsweet: es de la plataforma Webflow, no del sitio.
  s = s.replace(/\s*<script[^>]*finsweet[^>]*>\s*<\/script>/gi, '');

  // 6. Elfsight. El sitio usaba CUATRO apps, no dos:
  //      WhatsApp Chat + Click to Call   -> en el <head>, las 34 paginas
  //      Website Translator              -> en el cuerpo, 25 paginas (multi-idioma)
  //      Google Reviews                  -> en el cuerpo, 40 fragmentos
  //    Se retiraron las cuatro; el porque y la medicion estan en BaseLayout.astro.
  //    Las dos del <head> y el traductor los quitan BaseLayout y Footer. Aqui se
  //    quita el <script> del loader, que venia repetido por cada app.
  s = s.replace(/\s*<script[^>]*elfsightcdn[^>]*>\s*<\/script>/gi, '');

  // 6b. Google Reviews NO era un boton flotante: era contenido, y retirarlo dejaba
  //     un hueco en 40 paginas. Se sustituye por un enlace propio a la pagina de
  //     testimonios, que es donde vive esa misma prueba social sin cargar a un
  //     tercero. En la PROPIA pagina de testimonios el enlace apuntaria a si misma,
  //     asi que ahi solo se quita: de ahi que haga falta `ruta`.
  //
  //     Esto vivia como edicion a mano sobre los fragmentos y un solo
  //     `node scripts/generar-paginas.mjs` se lo llevaba por delante, en silencio.
  s = s.replaceAll(
    ELFSIGHT_RESENAS,
    ruta === RESENAS
      ? ''
      : `<a href="${RESENAS}" class="button w-button">Read Client Reviews</a>`,
  );

  // 6c. Los tres diferenciales del hero de la home, retirados por peticion del
  //     cliente. Se comprueba que la sustitucion ocurra: si el markup cambia y este
  //     literal deja de coincidir, el bloque volveria a salir y nadie se enteraria.
  if (ruta === '/') {
    if (!s.includes(HERO_DIFERENCIALES)) {
      throw new Error(
        '[hero] no encuentro el bloque .tagline de los 3 diferenciales en la home.\n'
        + '  El markup ha cambiado y la retirada ya no engancha: volverian a salir.',
      );
    }
    s = s.replace(HERO_DIFERENCIALES, '');
  }

  // 6d. El FAQ de ficha, a dos columnas: la portada del producto a la izquierda y
  //     las preguntas a la derecha.
  //
  //     Solo se inserta la imagen como PRIMER hijo del contenedor y se marca este con
  //     .pp-faq-2col; las dos columnas las hace src/styles/faq.css. Nada de envolver
  //     bloques: dentro de .faq_item no se toca ni una clase, y el acordeon lo sigue
  //     moviendo IX2 por selector de clase (.faq_trigger, eventos e-37/e-38), que es
  //     justo lo que afirma check:animaciones de los 90 eventos que no son entrada.
  //
  //     Por que una clase propia y no `.section-faq-page`: el mismo componente FAQ vive
  //     tambien en /resources/faq y /resources/warranties (.section-faq, .wrapper-faq,
  //     .faq_item) y ahi NO hay portada que poner. Con .pp-faq-2col el CSS no puede
  //     alcanzarlas ni por accidente.
  //
  //     Se anade tambien `container`: el contenedor del FAQ era el w-container pelado
  //     de 940px mientras el resto de secciones de la ficha van a 1250. A 940 las dos
  //     columnas salen a ~430px cada una.
  if (s.includes(FAQ_SECCION)) {
    const portada = PORTADAS[ruta];
    if (!portada) {
      throw new Error(
        `[faq] ${ruta} trae el FAQ de ficha pero no encuentro su portada en img-map.json.\n`
        + '  Sin imagen las dos columnas no tienen sentido: revisa /cms-img/<coleccion>/<slug>/cover-*',
      );
    }
    if (!s.includes(FAQ_ANCLA)) {
      throw new Error(
        `[faq] ${ruta}: el markup del FAQ ha cambiado y el ancla ya no engancha.\n`
        + '  La ficha se publicaria con el FAQ a una columna y sin foto, en silencio.',
      );
    }
    s = s.replace(
      FAQ_ANCLA,
      '<div class="section-faq-page"><div class="w-layout-blockcontainer container w-container pp-faq-2col">'
      + `<div class="pp-faq-media"><img src="${portada.src}" alt="${portada.alt}" loading="lazy" class="pp-faq-img"/></div>`,
    );
  }

  // 7. is:inline en <script> y <style> embebidos. SIN esto Astro los procesa:
  //    a los <style> les mete un scope (.a[data-astro-cid-xxx]) que rompe las
  //    reglas globales de Webflow, y los <script> los convierte a type="module"
  //    y los minifica. is:inline los deja tal cual, que es lo que necesitamos.
  s = s.replace(/<style(?![^>]*is:inline)([^>]*)>/g, '<style is:inline$1>');
  s = s.replace(/<script(?![^>]*is:inline)([^>]*)>/g, '<script is:inline$1>');

  return s;
}

/**
 * Extrae el bloque entre dos marcadores, ambos incluidos.
 * Se usa para sacar el nav, el footer y el cuerpo de cada pagina.
 */
export function extraer(html, desde, hasta) {
  const i = html.indexOf(desde);
  if (i < 0) throw new Error(`marcador de inicio no encontrado: ${desde.slice(0, 60)}`);
  const j = html.indexOf(hasta, i);
  if (j < 0) throw new Error(`marcador de fin no encontrado: ${hasta.slice(0, 60)}`);
  return html.slice(i, j + hasta.length);
}

/** Contenido del <head> que hay que llevarse a BaseLayout. */
export function leerHead(html) {
  const head = extraer(html, '<head>', '</head>');
  const t = (re) => head.match(re)?.[1]?.trim() ?? null;
  // IX2 necesita saber en que pagina esta para cargar sus interacciones.
  const wfPage = html.match(/<html[^>]*\sdata-wf-page="([^"]*)"/)?.[1] ?? null;
  const wfSite = html.match(/<html[^>]*\sdata-wf-site="([^"]*)"/)?.[1] ?? null;
  return {
    wfPage, wfSite,
    title: t(/<title>([\s\S]*?)<\/title>/),
    description: t(/<meta content="([^"]*)"\s+name="description">/),
    ogTitle: t(/<meta content="([^"]*)"\s+property="og:title">/),
    ogImage: t(/<meta content="([^"]*)"\s+property="og:image">/),
  };
}

/** Decodifica las entidades del <title> para poder pasarlo como prop. */
export function decodificar(s) {
  if (s == null) return null;
  return s
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&nbsp;/g, ' ')
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(+d));
}
