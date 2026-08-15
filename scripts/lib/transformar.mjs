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

export function transformar(html) {
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

  // 4. Atributos internos.
  s = s.replace(ATRIBUTOS_BASURA, '');

  // 4b. Placeholders de CDN externo -> copia local.
  for (const [remoto, local] of Object.entries(PLACEHOLDERS)) s = s.replaceAll(remoto, local);

  // 5. Config de Finsweet: es de la plataforma Webflow, no del sitio.
  s = s.replace(/\s*<script[^>]*finsweet[^>]*>\s*<\/script>/gi, '');

  // 6. Elfsight. El sitio usa CUATRO apps, no dos:
  //      WhatsApp Chat + Click to Call   -> en el <head>, las 34 paginas
  //      Website Translator              -> en el cuerpo, 25 paginas (multi-idioma)
  //      Google Reviews                  -> en el cuerpo, 8 paginas
  //    Los dos ultimos NO son botones flotantes: son contenido y funcionalidad.
  //    En la Fase 1 se conservan tal cual, o la migracion dejaria de ser exacta.
  //    El <div> contenedor se queda donde esta; el platform.js lo carga
  //    BaseLayout una sola vez (Webflow lo repetia por cada app).
  s = s.replace(/\s*<script[^>]*elfsightcdn[^>]*>\s*<\/script>/gi, '');

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
