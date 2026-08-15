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
};

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
      return marca
        ? trozo.replace(
            '<a href="#" class="warraty-card-link',
            `<a href="${GARANTIAS[marca]}" class="warraty-card-link`,
          )
        : trozo;
    })
    .join(TARJETA_GARANTIA);

  // 4. Atributos internos.
  s = s.replace(ATRIBUTOS_BASURA, '');

  // 4b. Placeholders de CDN externo -> copia local.
  for (const [remoto, local] of Object.entries(PLACEHOLDERS)) s = s.replaceAll(remoto, local);

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
  // El bloque anti-FOUC: sin el, los elementos animados aparecen y luego saltan.
  const estilos = [...head.matchAll(/<style>([\s\S]*?)<\/style>/g)]
    .map((m) => m[1])
    .filter((c) => c.includes('w-mod-ix'));
  // IX2 necesita saber en que pagina esta para cargar sus interacciones.
  const wfPage = html.match(/<html[^>]*\sdata-wf-page="([^"]*)"/)?.[1] ?? null;
  const wfSite = html.match(/<html[^>]*\sdata-wf-site="([^"]*)"/)?.[1] ?? null;
  return {
    wfPage, wfSite,
    title: t(/<title>([\s\S]*?)<\/title>/),
    description: t(/<meta content="([^"]*)"\s+name="description">/),
    ogTitle: t(/<meta content="([^"]*)"\s+property="og:title">/),
    ogImage: t(/<meta content="([^"]*)"\s+property="og:image">/),
    pageStyles: estilos.length ? estilos.join('\n') : null,
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
