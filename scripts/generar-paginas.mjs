#!/usr/bin/env node
/**
 * Fase 1 — genera las 17 paginas ESTATICAS.
 *
 * POR QUE DESDE EL SITIO EN VIVO Y NO DESDE EL EXPORT
 *
 * La primera version leia el export. Compilaba, se veia bien... y la auditoria
 * de paridad canto 9 paginas con entre un 35% y un 59% MENOS texto que el sitio
 * real:
 *
 *   /  ·  /products  ·  /services  ·  /project-gallery  ·  /resources/blog
 *   /about-us/brands  ·  /about-us/industries-we-serve
 *   /about-us/where-we-work  ·  /contact-us/get-in-touch
 *
 * Son justo las que llevan listas de coleccion. El export de Webflow las trae
 * VACIAS: en vez de los 10 productos, los 21 articulos o los 25 contratistas,
 * deja el placeholder "No items found.". Era contenido que faltaba, no una
 * diferencia de formato — y a simple vista pasaba por bueno.
 *
 * Asi que se hace igual que con las paginas de detalle: la fuente es el HTML
 * renderizado del sitio en vivo. Mismo pipeline, misma garantia.
 *
 *   node scripts/generar-paginas.mjs
 *
 * PAGINAS DE AUTORIA PROPIA (ver el Set MANUALES, mas abajo)
 *
 * /resources/blog ya NO se genera. El listado se rediseno a mano: lee los CSV del
 * CMS en tiempo de build, tiene rutas por categoria, RSS y JSON-LD. Nada de eso
 * sale de una captura del vivo.
 *
 * El FRAGMENTO se sigue escribiendo —es la copia en el repo del markup original,
 * util para diffear— pero la PAGINA no se pisa.
 * Sin esta guarda, un `node scripts/generar-paginas.mjs` se llevaria el rediseno
 * por delante, en silencio y sin error.
 *
 * Para volver de verdad al markup migrado:
 *   node scripts/generar-paginas.mjs --regenerar-manuales   # DESTRUCTIVO
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { transformar, decodificar, reescribirImagenes, PLACEHOLDERS, SEO_ESTATICAS } from './lib/transformar.mjs';
import { bajarFaltantes } from './lib/assets-cdn.mjs';
// La lista de rutas con carrusel de resenas. Vive fuera porque la leen tambien
// las paginas espanolas: ver la cabecera de ese fichero.
import { CON_RESENAS } from '../src/lib/resenas-rutas.mjs';

const RAIZ = path.resolve(import.meta.dirname, '..');
const VIVO = path.join(RAIZ, 'docs/vivo');
const FRAG = path.join(RAIZ, 'src/contenido-migrado/estaticas');
const PAGES = path.join(RAIZ, 'src/pages');

const MAPA = JSON.parse(await fs.readFile(path.join(RAIZ, 'src/lib/img-map.json'), 'utf8'));
const LOCALES = new Set(await fs.readdir(path.join(RAIZ, 'public/images')));

/** Rutas estaticas del sitio. Confirmadas contra el sitio en vivo (Fase 0). */
const RUTAS = [
  '/', '/products', '/services', '/project-gallery', '/thank-you',
  '/about-us/about-us', '/about-us/brands', '/about-us/industries-we-serve',
  '/about-us/testimonials', '/about-us/where-we-work',
  '/contact-us/get-a-quote', '/contact-us/get-in-touch', '/contact-us/schedule-a-visit',
  '/resources/blog', '/resources/faq', '/resources/warranties',
  '/404',   // no esta en urls-actuales.txt (no devuelve 200), pero hace falta
];

/**
 * Rutas cuya PAGINA es de autoria propia.
 *
 * El fragmento se sigue escribiendo en src/contenido-migrado/estaticas/, pero
 * src/pages/<ruta>.astro NO se toca. Misma guarda explicita y ruidosa que
 * scripts/generar-shell.mjs usa para Nav.astro y Footer.astro.
 */
// /thank-you se escribio a mano en la Fase 2: es la pagina a la que aterriza TODO
// lead y el fragmento migrado no decia que pasa despues, ni traia <h1> — solo un
// <h2> suelto, asi que la unica pagina del embudo que ve un cliente que acaba de
// dejar sus datos se quedaba sin encabezado principal.

/**
 * JSON-LD de las paginas estaticas.
 *
 * Antes de la Fase 4 ninguna de las 17 declaraba nada, la home incluida: para Google
 * este sitio no tenia negocio detras, ni telefono, ni direccion, ni area de servicio.
 *
 * `negocio` define el nodo completo con `@id` estable; las demas paginas —y las 29 de
 * ubicacion— lo REFERENCIAN por ese id en vez de repetirlo. Se define en la home y en
 * la pagina de contacto, que es donde el NAP esta publicado y visible: declarar datos
 * de contacto en una pagina que no los muestra es justo lo que Google trata como
 * markup no respaldado por el contenido.
 *
 * `miga` es el tramo intermedio de las migas, cuando lo hay.
 */
const LD_ESTATICAS = {
  '/':                             { negocio: true },
  '/contact-us/get-in-touch':      { negocio: true, miga: ['Contact Us', '/contact-us/get-in-touch'] },
  '/contact-us/get-a-quote':       { miga: ['Get a Quote', '/contact-us/get-a-quote'] },
  '/contact-us/schedule-a-visit':  { miga: ['Schedule a Visit', '/contact-us/schedule-a-visit'] },
  '/resources/faq':                { miga: ['FAQ', '/resources/faq'] },
  '/resources/warranties':         { miga: ['Warranties', '/resources/warranties'] },
  '/products':                     { miga: ['Our Products', '/products'] },
  '/services':                     { miga: ['Our Services', '/services'] },
  '/project-gallery':              { miga: ['Project Gallery', '/project-gallery'] },
  '/about-us/about-us':            { miga: ['About Us', '/about-us/about-us'] },
  '/about-us/brands':              { miga: ['Our Brands', '/about-us/brands'] },
  '/about-us/industries-we-serve': { miga: ['Industries We Serve', '/about-us/industries-we-serve'] },
  '/about-us/testimonials':        { miga: ['Testimonials', '/about-us/testimonials'] },
  '/about-us/where-we-work':       { miga: ['Where We Work', '/about-us/where-we-work'] },
};

/**
 * Rutas de AUTORIA PROPIA: el generador sigue escribiendo su FRAGMENTO —la copia en
 * el repo del markup original, util para diffear— pero NO pisa su .astro.
 *
 * /resources/faq paso de 10 preguntas en acordeon a la biblioteca completa del sitio
 * (buscador + chips), que se monta desde src/data/faqs.ts. Sin esta entrada el
 * generador la devuelve al markup migrado de 10 preguntas en silencio.
 *
 * /contact-us/get-in-touch se rediseño a mano: hero, datos de contacto y formulario.
 * Sin esta entrada un `node scripts/generar-paginas.mjs` devuelve la pagina al markup
 * migrado en silencio y sin error, y de paso reintroduce los cuatro `tel:` erroneos
 * que el rediseño arreglo (el email, la direccion y el horario iban todos envueltos
 * en un enlace de telefono, y ademas con un numero que no es el del sitio).
 */
const MANUALES = new Set(['/resources/blog', '/resources/faq', '/thank-you', '/contact-us/get-in-touch']);
const FORZAR = process.argv.includes('--regenerar-manuales');

const archivoVivo = (r) =>
  path.join(VIVO, (r === '/' ? 'index' : r.slice(1).replace(/\//g, '__')) + '.html');
const destino = (r) => (r === '/' ? 'index.astro' : r.slice(1) + '.astro');   // /404 -> 404.astro

/**
 * Rutas generadas que no son contenido y por tanto no deben indexarse.
 *
 * `/thank-you` responde 200 y solo tiene sentido tras enviar un formulario; `/404`
 * lo sirve Vercel con status 404, pero se marca igual por coherencia y porque su
 * gemela española SI responde 200.
 *
 * Marcarlas aqui hace que el generador del sitemap las salte solo —salta las
 * paginas con noindex— en vez de depender de que la lista EXCLUIR de
 * astro.config.mjs acierte con la cadena.
 */
const NO_INDEXABLES = new Set(['/404', '/thank-you']);

/**
 * El menu anida TRES niveles de <nav>: hay que contar profundidad.
 * El 404 es la excepcion: no lleva nav ni footer, asi que se coge el <body>
 * entero menos los scripts del final.
 */
function cuerpo(html) {
  const i = html.indexOf('<nav');
  if (i < 0) {
    const b = html.indexOf('<body');
    if (b < 0) throw new Error('sin body');
    const desde = html.indexOf('>', b) + 1;
    const scripts = html.indexOf('<script', desde);
    return html.slice(desde, scripts > 0 ? scripts : html.lastIndexOf('</body>'));
  }
  let prof = 0, fin = -1;
  for (const m of html.slice(i).matchAll(/<nav\b|<\/nav>/g)) {
    prof += m[0] === '</nav>' ? -1 : 1;
    if (prof === 0) { fin = i + m.index + m[0].length; break; }
  }
  const b = html.lastIndexOf('<footer');
  if (fin < 0 || b < 0) throw new Error('sin cierre de nav o footer');
  return html.slice(fin, b);
}

function meta(html) {
  const t = (re) => html.match(re)?.[1]?.trim() ?? null;
  return {
    title: decodificar(t(/<title>([\s\S]*?)<\/title>/)),
    description: decodificar(t(/<meta content="([^"]*)"\s+name="description"/)),
    ogImage: t(/<meta content="([^"]*)"\s+property="og:image"/),
    wfPage: t(/<html[^>]*\sdata-wf-page="([^"]*)"/),
    wfSite: t(/<html[^>]*\sdata-wf-site="([^"]*)"/),
  };
}

// Pre-pasada: bajar del CDN lo que no tenemos (ver lib/assets-cdn.mjs).
{
  const htmls = [];
  for (const r of RUTAS) htmls.push(await fs.readFile(archivoVivo(r), 'utf8'));
  const res = await bajarFaltantes({
    htmls, cuerpo, mapa: MAPA, locales: LOCALES,
    destino: path.join(RAIZ, 'public/images'),
  });
  if (res.bajadas) console.log(`  bajados ${res.bajadas} assets que el CDN sirve y no teniamos`);
  for (const f of res.fallos) console.error(`  !! ${f.error}  ${f.url}`);
}

await fs.rm(FRAG, { recursive: true, force: true });
await fs.mkdir(FRAG, { recursive: true });
const sinResolver = new Set();
const generadas = [];
// Metadatos por ruta, para que la version ESPANOLA pueda reutilizarlos. Sin esto,
// /es/<ruta> tendria que repetir a mano el wfPage y el bloque anti-FOUC de cada
// pagina, y un anti-FOUC que no coincide deja elementos invisibles para siempre.
const META_POR_RUTA = {};
const omitidas = [];

for (const ruta of RUTAS) {
  const html = await fs.readFile(archivoVivo(ruta), 'utf8');
  const r = reescribirImagenes(cuerpo(html), MAPA, LOCALES);
  for (const u of r.sinResolver) if (!PLACEHOLDERS[u]) sinResolver.add(u);
  const frag = transformar(r.html, ruta);

  const nombre = (ruta === '/' ? 'index' : ruta.slice(1).replace(/\//g, '__')) + '.html';
  await fs.writeFile(path.join(FRAG, nombre), frag);

  const m = meta(html);
  const prof = ruta === '/' ? 0 : ruta.split('/').length - 2;
  const rel = '../'.repeat(prof + 1);

  // Webflow dejo estas paginas con el nombre del menu por <title> ("FAQ",
  // "Warranties") y sin description, asi que 12 paginas compartian la del sitio.
  // SEO_ESTATICAS manda sobre lo que traia el vivo.
  const propio = SEO_ESTATICAS[ruta] ?? {};

  META_POR_RUTA[ruta] = {
    fragmento: nombre,
    wfPage: m.wfPage, wfSite: m.wfSite,
    titleEn: propio.title ?? m.title, descriptionEn: propio.description ?? m.description,
  };

  // JSON-LD de esta ruta, si le toca.
  const ld = LD_ESTATICAS[ruta];
  const nodos = [];
  if (ld?.negocio) nodos.push('localBusiness(site)');
  if (ld?.miga) nodos.push(`breadcrumbs(site, [${JSON.stringify(ld.miga)}])`);
  const importaLd = nodos.length
    ? `import { grafo, localBusiness, breadcrumbs } from '${rel}lib/jsonld';\n`
    : '';

  const props = [
    `title=${JSON.stringify(propio.title ?? m.title ?? 'Pergola Plus Florida')}`,
    // Las que responden 200 y NO son contenido se declaran no indexables. Va AQUI y
    // no a mano en el .astro porque src/pages/ es salida generada: un `noindex`
    // escrito a mano lo revierte el siguiente regenerado, en silencio y justo en las
    // paginas donde el sintoma —una «Gracias» o un error indexados— tarda semanas en
    // notarse. Lo caza check:generadores, que fue quien lo cazó.
    NO_INDEXABLES.has(ruta) ? 'noindex' : null,
    (propio.description ?? m.description)
      ? `description=${JSON.stringify(propio.description ?? m.description)}` : null,
    m.ogImage ? `ogImage=${JSON.stringify(m.ogImage)}` : null,
    m.wfPage ? `wfPage=${JSON.stringify(m.wfPage)}` : null,
    m.wfSite ? `wfSite=${JSON.stringify(m.wfSite)}` : null,
    nodos.length ? 'jsonLd={jsonLd}' : null,
  ].filter(Boolean).join('\n  ');

  // Carrusel de resenas: va DESPUES del fragmento migrado, nunca dentro. El
  // fragmento es markup verbatim de Webflow y meterle nada por medio arriesga los
  // data-w-id de los que dependen las 749 interacciones IX2.
  const conResenas = CON_RESENAS.has(ruta);
  const importaResenas = conResenas
    ? `import ReseñasGoogle from '${rel}components/ReseñasGoogle.astro';\n`
    : '';

  const salida = `---
import BaseLayout from '${rel}layouts/BaseLayout.astro';
import html from '${rel}contenido-migrado/estaticas/${nombre}?raw';
${importaResenas}${importaLd}${
  nodos.length
    ? `\nconst site = Astro.site!.href;\nconst jsonLd = grafo(${nodos.join(', ')});\n`
    : ''}
// Generado por scripts/generar-paginas.mjs desde el HTML real de ${ruta}.
// NO editar a mano. El nav y el footer los pone BaseLayout.
---

<BaseLayout
  ${props}
>
  <Fragment set:html={html} />
${conResenas ? '  <ReseñasGoogle />\n' : ''}</BaseLayout>
`;

  // El fragmento de arriba SI se ha escrito; lo que se salta es la pagina.
  if (MANUALES.has(ruta) && !FORZAR) {
    omitidas.push(ruta);
  } else {
    const dest = path.join(PAGES, destino(ruta));
    await fs.mkdir(path.dirname(dest), { recursive: true });
    await fs.writeFile(dest, salida);
  }
  generadas.push({
    ruta,
    ids: (frag.match(/data-w-id="/g) ?? []).length,
    manual: MANUALES.has(ruta) && !FORZAR,
  });
}

console.log('Fase 1 — paginas estaticas (desde el sitio en vivo)\n');
for (const g of generadas)
  console.log(
    `  ${g.ruta.padEnd(34)} data-w-id ${String(g.ids).padStart(3)}` +
      `${g.manual ? '   [manual: pagina NO sobrescrita]' : ''}`,
  );
console.log(`\n  ${generadas.length} fragmentos, ${generadas.length - omitidas.length} paginas`);

if (omitidas.length) {
  console.log(
    `\n  ${omitidas.length} pagina(s) de autoria propia sin tocar: ${omitidas.join(', ')}` +
      `\n  (para pisarlas de verdad: --regenerar-manuales, DESTRUCTIVO)`,
  );
}

if (sinResolver.size) {
  console.error(`\n  !! ${sinResolver.size} URLs del CDN sin resolver:`);
  for (const u of sinResolver) console.error(`     ${u}`);
  process.exit(1);
}
await fs.writeFile(
  path.join(FRAG, '_meta.json'),
  JSON.stringify(META_POR_RUTA, null, 2) + '\n',
);

console.log('  cero URLs apuntando al CDN de Webflow');
