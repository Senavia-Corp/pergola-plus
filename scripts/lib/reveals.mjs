/**
 * Que elemento entra y como. Fuente de verdad compartida por dos sitios que si se
 * separan no avisa nadie:
 *
 *   - src/styles/animaciones.css  escribe las reglas a mano
 *   - scripts/comprobar-animaciones.mjs  importa esta tabla y comprueba que el CSS
 *     construido reclama exactamente estos selectores y ninguno mas
 *
 * Mismo acoplamiento que MARQUEE_JUEGOS en transformar.mjs: el numero vive en un
 * sitio y la puerta afirma que el CSS lo respeta.
 *
 * DE DONDE SALE ESTA TABLA
 *
 * De las 110 interacciones SCROLL_INTO_VIEW de public/js/webflow.js, medidas antes de
 * apagarlas (scripts/parchear-webflow.mjs). Apuntaban a 66 data-w-id y 20 selectores
 * de clase. Los data-w-id ya estan en el HTML de las 211 paginas, asi que el CSS puede
 * seleccionarlos tal cual: no hace falta tocar ni un fragmento migrado, y por eso
 * check:paridad y check:generadores no se enteran de este cambio.
 *
 * La clasificacion es geometrica, medida en el navegador sobre el build a 1440, 1280,
 * 768 y 375 px, no adivinada por el nombre de la clase.
 */

/**
 * Los pares que el layout SI justifica: medidos lado a lado a 1440 px, misma fila,
 * cajas disjuntas en X. Solo estos entran de lado, y solo a partir de 992 px. Por
 * debajo las columnas se apilan, asi que caen a la subida por defecto.
 *
 * Es justo lo que hoy se hace mal: hoy, por debajo de 992 px, estos 20 elementos
 * cambian a growIn — un pop de escala — en vez de a un gesto vertical.
 */
export const IZQUIERDA = {
  '9df885f6-9158-46e1-339c-34a5f32960bd': '.products-menu       (home, pareja de .products-display)',
  '6e40fb1b-9056-3dcb-7088-c614f3e8faa0': '.intro-column-left   (90 paginas, pareja de .intro-column-right)',
  '8e25be38-8af5-bd56-fef1-65d902221d20': '.column-left-color   (20 paginas, pareja de .column-right-color)',
  '75ab0aed-f458-0f6c-c3e3-46c239fb009f': '.intro-left-column   (about-us, pareja de .intro-right-column)',
  'd1a9be1f-b69f-a2f0-ecba-d86f44713a94': '.column-left-commercial (sectores, fila de 3)',
};

export const DERECHA = {
  '9df885f6-9158-46e1-339c-34a5f32960c6': '.products-display    (home, pareja de .products-menu)',
  '6e40fb1b-9056-3dcb-7088-c614f3e8faa2': '.intro-column-right  (90 paginas, pareja de .intro-column-left)',
  '4bd4bb2a-09d0-43e7-8c40-d721bf135688': '.column-right-color  (20 paginas, pareja de .column-left-color)',
  'de620e7c-00c6-9295-215a-c63c3d0264e4': '.intro-right-column  (about-us, pareja de .intro-left-column)',
  '3a5b213a-e551-9220-6b99-5febdf20190a': '.column-right-commercial (sectores, fila de 3)',
};

/** Todo lo demas sube. Es el gesto por defecto y el que reciben las rejillas. */
export const SUBIDA = {
  'f00e2efe-9b56-1210-e497-b72104be4b25': '.box-call-to-action    (201 paginas, el CTA final)',
  'e2f2465a-47b0-b46c-8bcb-683e8ff0f22b': '.box-info-contact',
  '762f6675-48f9-c1de-d687-e89165fbbad7': '.brands-grid-item',
  '8d35da46-f8fb-23b0-be5e-ac916f28396f': '.column-center-commercial (la del medio de la fila de 3)',
  'e5de5a0c-53a0-ec9b-3b42-737243767a7e': '.column-left-footer    (211 paginas; sin gemela derecha, asi que sube)',
  '9e3abbef-7c3b-f086-0635-e97421a15e4b': '.div-block-7           (211 paginas, pie)',
  'e2f2465a-47b0-b46c-8bcb-683e8ff0f243': '.divider-right',
  '7c33b7a7-92b7-ad27-24ab-6eef3704f70a': '.faq-mini-cta',
  'dc99a523-ff98-25c5-a796-1da9e193eb98': '.feature-about-left    (sin gemela medida a 1440)',
  '9348e4fd-5ad5-6f0c-9007-8e8852879e59': '.fs-slider-industries_instance',
  '9348e4fd-5ad5-6f0c-9007-8e8852879e62': '.fs-slider-industries_navigation',
  '4812227a-f236-48fe-183f-8787908faa3d': '.header-intro-commercial',
  '46ae4251-e346-bd3f-3db2-cceb0742293b': '.header-kpis',
  'e18f94ff-36cb-4548-f2d3-8a097f110d5f': '.header-kpis           (segunda pagina, otro id)',
  '3dfd9ad1-3068-91a5-2ecd-ca41bcbc061b': '.header-locations',
  '9df885f6-9158-46e1-339c-34a5f32960b4': '.header-products',
  '378744cc-edb3-aef2-2e9a-113e77ea958a': '.header-projects',
  'd03f876a-fa65-68e5-c8ed-9fd6290b938d': '.header-reviews',
  'd03f876a-fa65-68e5-c8ed-9fd6290b9395': '(div sin clase) el boton a /about-us/testimonials, 78 paginas',
  'af395482-435a-2143-5385-d4f1e6bdca74': '.header-services',
  '502afbbc-ef77-646b-50b5-dfef6a57c0f6': '.left-content          (96 paginas; sin gemela medida)',
  'e5de5a0c-53a0-ec9b-3b42-737243767ad0': '.line-footer           (211 paginas)',
  '3dfd9ad1-3068-91a5-2ecd-ca41bcbc0625': '.locations-left        (sin gemela medida)',
  '998fbe51-4b1e-9336-a738-d1d7ffb1592d': '.projects-grid-item',
  '9e6cd8cc-1a46-44d5-b687-f5405cbfa2df': '.section-marquee-logos (ver nota en animaciones.css)',
  '378744cc-edb3-aef2-2e9a-113e77ea9591': '.slider-wrapper-projects',
  'af395482-435a-2143-5385-d4f1e6bdca7b': '.wrapper-services',
  'a36f2a1e-9f59-c2af-809a-f51186a9ca93': '.why-choose-content    (sin gemela medida)',
  'e5de5a0c-53a0-ec9b-3b42-737243767ad1': '.wrapper-bar-footer    (211 paginas)',
};

/**
 * Objetivos por CLASE. IX2 los enganchaba con querySelectorAll, asi que aqui se
 * seleccionan igual. Todos suben.
 */
export const CLASES = [
  '.block-intro-commercial', '.card-services', '.faq_item', '.feature-about-item',
  '.feature-header-item', '.featured_left', '.fs-slider-feature-gallery_instance',
  '.fs-slider-gallery-section_instance', '.header-feature', '.header-gallery', '.item-footer',
  '.item-kpis', '.product-card', '.product-grid-item',
  '.serve-column-left', '.step-content', '.warranty_item', '.why-choose-item',
];

/**
 * Las rejillas. Reciben escalonado por columna. El resto de CLASES son piezas
 * sueltas (1 por pagina) y no lo necesitan.
 *
 * El tope son 4 pasos y vuelta a empezar: .product-card llega a 60 por pagina, y
 * una escalera de 60 dejaria la ultima tarjeta fuera de rango.
 */
export const REJILLAS = [
  '.brands-grid-item', '.card-services', '.faq_item', '.feature-about-item',
  '.feature-header-item', '.item-footer', '.item-kpis', '.product-card',
  '.product-grid-item', '.projects-grid-item', '.serve-column-left',
  '.step-content', '.warranty_item', '.why-choose-item',
];

/**
 * Dos elementos que IX2 enganchaba DOS veces: por data-w-id y por clase. La clase
 * coge mas elementos que el id (.header-gallery: 92 instancias, de las que solo 58
 * llevan el data-w-id), asi que manda la clase y estos dos ids quedan subsumidos.
 * Se apuntan para que el recuento de los 66 cuadre y no parezca que se han perdido.
 */
export const CUBIERTOS_POR_CLASE = {
  'd1909b41-1fab-cdd6-7576-0544f5dcbd86': '.header-gallery',
  'd1909b41-1fab-cdd6-7576-0544f5dcbd8c': '.fs-slider-gallery-section_instance',
};

/**
 * NO entran. Cada uno con el motivo medido: si algun dia alguien quiere animarlos,
 * que sepa contra que choca.
 */
export const EXCLUIDOS = {
  // --- los dos que IX2 sigue gobernando: un reveal con fill activo gana al
  //     element.style y les rompe la interaccion, sin un solo error en consola ---
  '2d27e00a-9abd-8e02-83db-6979dd88df62':
    '.menu — a-27/a-28 (PAGE_SCROLL_UP/DOWN) le mueven opacity y transform para esconder '
    + 'la barra al bajar. Ademas es position:sticky, y un transform crea bloque contenedor '
    + 'y se carga el sticky. Y esta en y=0 de las 211 paginas.',
  '.feature-card':
    'a-23/a-24 (el acordeon de .feature-header-item) le gobiernan la opacidad. Un reveal '
    + 'con fill activo lo dejaria abierto para siempre.',

  // --- por encima del pliegue: medido a 1440, 1280, 768 y 375 px ---
  'c9dbcfe6-6f76-b9b3-3799-240503e34f8f': '.block-hero-homepage — heroe, y=160 a 1440x900',
  '8533b1f7-0818-2072-e3ec-d0f0e9b6e8f4': '.hero-block-video — heroe de la home, y=593 (era 363: el bloque bajo al pie del video)',
  'cf48fa22-3cea-52a9-6d36-bc35400a50f6': '.wrapper-hero-product — heroe de 76 paginas, y=622',
  '15b709b4-f6d7-0064-6f7b-160d6783adab': '.wrapper-hero-page — heroe de 32 paginas, y=193',
  'a2dcf6a0-e1bf-85de-d1a1-e972da6081a2': '.hero-grid — heroe de marcas, y=213',
  'a2dcf6a0-e1bf-85de-d1a1-e972da6081ac': '.hero_media — heroe de marcas, y=495',
  '0e17210d-a02e-0587-0e89-a3118db8567e': '.column-left-hero-service — heroe de servicios, y=332',
  '9d7c5ec8-09e1-d041-2bb5-788cc13790e2': '.column-right-hero-service — heroe de servicios, y=268',
  '69ccec76-2986-1ce1-4e07-6cfb325666e8': '.block-form — el formulario es lo primero de /contact-us, y=420',

  '1b497722-e6c3-4eb1-a556-645b84be825d':
    'div VACIO en /about-us/testimonials. Es lo que quedo del widget de Elfsight que\n     retiro la migracion: no tiene contenido, asi que no hay nada que revelar.',

  // --- no existen ---
  '.service-steps-content': 'la clase no aparece en ninguna de las 211 paginas',
};

/**
 * Los 14 data-w-id que IX2 animaba y que NO estan en ninguna de las 211 paginas.
 * Restos de paginas que la migracion descarto. No se listan como excluidos porque no
 * hay nada que excluir: se apuntan para que el recuento cuadre.
 */
export const HUERFANOS = [
  '01ba1a7b-6777-db20-f823-b4019ddf70f5', '04971336-f686-f188-afc7-8e6c1acd30df',
  '1b497722-e6c3-4eb1-a556-645b84be8255',
  '30f8a1ac-059f-1484-bfc4-65e0286ee848', '30f8a1ac-059f-1484-bfc4-65e0286ee85c',
  '42c1f637-9258-0fea-44df-43ad95f37ceb', '45635bac-2fbe-6a6a-f3d5-758b0c33de53',
  '4e7e8d11-2645-58a6-0ad5-dc9ad3b4e493', '6dad4ed8-0af3-5c4d-7fe9-40589442cf59',
  'b2b763d4-d982-efe3-5f4c-bd7f20891915', 'ca40c148-c68a-4087-394f-a7ea18ffc9ab',
  'd1a12c63-db29-d87a-7e9e-36db79726e3a',
  'de531817-b01a-06e3-4198-ce2865b2d07e', 'e3f363b3-599a-9941-9bc4-bf58cc9d3812',
];

/** Todos los data-w-id que el CSS debe reclamar, con su variante. */
export const POR_UUID = {
  ...Object.fromEntries(Object.keys(IZQUIERDA).map((u) => [u, 'izq'])),
  ...Object.fromEntries(Object.keys(DERECHA).map((u) => [u, 'der'])),
  ...Object.fromEntries(Object.keys(SUBIDA).map((u) => [u, 'sube'])),
};
