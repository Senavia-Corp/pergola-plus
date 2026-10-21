/**
 * Puerta del blog. Se ejecuta sobre dist/, DESPUES de `npm run build`.
 *
 *     npm run check:blog
 *
 * Comprueba de punta a punta la cadena CSV -> join por categoria -> render:
 * si el parser, la clave de union o la regla de filtrado se rompen, esto falla.
 * Es una sola comprobacion a proposito: la util es la que mira el HTML final, no
 * una unitaria del parser.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { raizHtml } from './lib/dist.mjs';
import { MINIATURAS_ES } from './lib/miniaturas.mjs';
import { blog, ciudades as ciudadesEsperadas } from './lib/esperado.mjs';

const RAIZ = path.resolve(import.meta.dirname, '..');
const HTML = await raizHtml();
const DIST = path.join(HTML, 'resources/blog');

/**
 * Las cuentas salen de la fuente activa (scripts/lib/esperado.mjs): la instantanea de
 * Sanity o, leyendo del repo, las del CSV del CMS.
 */
const B = blog();
const TOTAL = B.total;
const ESPERADO = {
  index: TOTAL - 1, // menos el destacado, que ya sale entero arriba
  ...B.porCategoria,
};

/**
 * Categorias del CMS sin articulos: NO deben tener ruta.
 *
 * `view-all` no es una categoria, es un control de interfaz metido en la coleccion.
 * Las otras tres estan creadas y vacias; service-areas ademas chocaria con las 29
 * paginas reales de zonas de servicio del sitio.
 */
const SIN_RUTA = [...B.sinRuta, 'view-all'];

/** Cualquier <li> de tarjeta, sin depender del orden de los atributos. */
const TARJETA = /<li [^>]*data-slug="[^"]*"[^>]*>/g;
const OCULTA = /(^|\s)hidden(=|\s|>)/;
const fallos = [];
const decir = (ok, msg) => {
  if (!ok) fallos.push(msg);
  console.log(`  ${ok ? 'ok  ' : 'FALLO'}  ${msg}`);
};

const leer = (ruta) =>
  fs.readFile(path.join(DIST, ruta === 'index' ? 'index.html' : `${ruta}/index.html`), 'utf8');

console.log('\nCOMPROBACION DEL BLOG\n');

console.log('tarjetas visibles por ruta');
for (const [ruta, n] of Object.entries(ESPERADO)) {
  const html = await leer(ruta);
  const todas = html.match(TARJETA) ?? [];
  const visibles = todas.filter((t) => !OCULTA.test(t)).length;
  decir(
    visibles === n && todas.length === TOTAL,
    `${ruta}: ${visibles} visibles de ${todas.length} en el DOM (esperado ${n} de ${TOTAL})`,
  );
}

console.log('\ncategorias vacias: sin ruta');
for (const slug of SIN_RUTA) {
  let existe = true;
  try {
    await fs.access(path.join(DIST, slug, 'index.html'));
  } catch {
    existe = false;
  }
  decir(!existe, `/resources/blog/${slug} no se genera`);
}

console.log('\nsin JavaScript');
const indice = await leer('index');
decir(!indice.includes('style="opacity:0"'), 'cero opacity:0 en linea');
decir(
  indice.includes('data-slug=') && !/<li data-cat[^>]*>\s*<article class="pp-card" data-pp-reveal>\s*<\/article>/.test(indice),
  'las tarjetas llevan contenido renderizado en servidor',
);

/**
 * La animacion de entrada tiene que SOBREVIVIR A LA MINIFICACION.
 *
 * Estuvo rota y en silencio: el minificador fusionaba el atajo `animation` con
 * `animation-timeline` en
 *     animation: .5s ease-out both pp-entrada view();
 * y como `animation-timeline` no forma parte de ese atajo en la especificacion,
 * el navegador tiraba la declaracion entera y dejaba `animation-name: none`. Las
 * 22 entradas del listado no se ejecutaban. No se veia roto —el estado base es
 * opacity:1— asi que solo salio midiendo el computed en el navegador.
 *
 * Se comprueba sobre el CSS del build, que es donde ocurre el destrozo: en el
 * fuente la regla siempre se ve bien.
 */
console.log('\nanimacion de entrada');
const cssBuild = (
  await Promise.all(
    (await fs.readdir(path.join(HTML, '_astro')))
      .filter((f) => f.endsWith('.css'))
      .map((f) => fs.readFile(path.join(HTML, '_astro', f), 'utf8')),
  )
).join('\n');

const regla = cssBuild.match(/\[data-pp-reveal\]\{([^}]*)\}/)?.[1] ?? '';
decir(regla !== '', 'la regla [data-pp-reveal] llega al CSS del build');
decir(
  /animation-name:\s*pp-entrada/.test(regla),
  'sobrevive animation-name: pp-entrada (sin el, no hay animacion)',
);
decir(
  /animation-timeline:\s*view\(\)/.test(regla),
  'sobrevive animation-timeline: view()',
);
decir(
  !/animation:[^;]*view\(\)/.test(regla),
  'el minificador NO ha vuelto a componer el atajo con view()',
);
decir(cssBuild.includes('@keyframes pp-entrada'), 'los keyframes estan en el build');

console.log('\nSEO');
decir(indice.includes('application/ld+json'), 'JSON-LD en el listado');
decir(!indice.includes('website-files.com'), 'cero URLs del CDN de Webflow');
decir(
  (await leer('buying-guides-cost')).includes('application/ld+json'),
  'JSON-LD en las categorias',
);

// El RSS solo se publica en produccion: fuera de ahi astro.config.mjs lo BORRA de
// la salida, porque sus <guid> son permanentes para quien se suscriba y los de un
// deploy provisional nacen apuntando a una URL que va a morir.
//
// Se comprueba que NO esta, en vez de saltarse el bloque en silencio: un `if` que
// no afirma nada es una puerta que se apaga sola y nadie se entera.
if (process.env.PUBLIC_ES_PRODUCCION === '1') {
  const rss = await fs.readFile(path.join(DIST, 'rss.xml'), 'utf8');
  const items = (rss.match(/<item>/g) ?? []).length;
  decir(items === TOTAL, `el RSS trae los ${TOTAL} items (trae ${items})`);
  decir(!/&(?!amp;|lt;|gt;|quot;|apos;|#)/.test(rss), 'el RSS no tiene ampersands sin escapar');
} else {
  const hay = await fs.access(path.join(DIST, 'rss.xml')).then(() => true, () => false);
  decir(!hay, 'sin PUBLIC_ES_PRODUCCION=1 el RSS no se publica');
}

/* ------------------------------------------------------------- articulo -- */

console.log('\narticulo /post/<slug>');

const rutasPost = (await fs.readdir(path.join(HTML, 'post'), { withFileTypes: true }))
  .filter((d) => d.isDirectory())
  .map((d) => d.name);

decir(rutasPost.length === TOTAL, `se generan los ${TOTAL} posts (${rutasPost.length})`);

let conH1Malo = 0;
let conOpacidad = 0;
let sinIndice = 0;
let sinMigas = 0;
for (const slug of rutasPost) {
  const h = await fs.readFile(path.join(HTML, 'post', slug, 'index.html'), 'utf8');
  if ((h.match(/<h1[\s>]/g) ?? []).length !== 1) conH1Malo++;
  if (h.includes('style="opacity:0"')) conOpacidad++;
  if (!h.includes('"@type":"BreadcrumbList"')) sinMigas++;
  // El indice solo se pinta con mas de 2 encabezados; todos los posts tienen 8+.
  if (!h.includes('id="pp-indice"')) sinIndice++;
}

decir(conH1Malo === 0, `un unico <h1> por post (${conH1Malo} incumplen)`);
decir(
  conOpacidad === 0,
  `cero opacity:0 en linea (${conOpacidad} incumplen; el markup migrado traia 4 por post y ningun bloque anti-FOUC)`,
);
decir(sinMigas === 0, `BreadcrumbList en los ${rutasPost.length} posts (${sinMigas} sin el)`);
decir(sinIndice === 0, `indice en los ${rutasPost.length} posts (${sinIndice} sin el)`);

// Las entradas del indice tienen que apuntar a encabezados que existan.
const uno = await fs.readFile(
  path.join(HTML, 'post/design-build-pergola-process-south-florida/index.html'),
  'utf8',
);
const anclas = [...uno.matchAll(/<a href="#([^"]+)"/g)].map((m) => m[1]);
const idsEnc = new Set([...uno.matchAll(/<h[23] id="([^"]+)"/g)].map((m) => m[1]));
const rotas = anclas.filter((a) => !idsEnc.has(a));
decir(anclas.length > 0, `el indice trae ${anclas.length} entradas`);
decir(rotas.length === 0, `todas resuelven a un encabezado (${rotas.length} rotas)`);
decir(/"wordCount":\s*\d+/.test(uno), 'wordCount en el BlogPosting');
decir(uno.includes('"dateModified"'), 'dateModified en el BlogPosting');

/*
 * La barra de progreso de lectura se retiro por peticion del cliente, asi que aqui
 * ya no hay animacion de scroll que vigilar. Se conserva UNA afirmacion: que no
 * vuelva. Si alguien la reintroduce, vuelve con ella el `position: fixed` a la
 * altura del nav escrita a mano, que es lo que la cruzaba por encima del texto.
 */
/* ----------------------------------- miniaturas de las paginas de ciudad -- */

/*
 * La banda de blog de /pergolas-contractors/<ciudad> traia las portadas VIEJAS del
 * blog: 10 imagenes generadas por IA, tres de ellas planos de permiso y calculos de
 * carga inventados, en 25 paginas de captacion. Ahora cada tarjeta lleva la portada
 * real del articulo al que enlaza (scripts/lib/miniaturas.mjs).
 *
 * Esto se comprueba sobre dist/ y no sobre la tabla porque lo que importa es lo que
 * pide el HTML servido, y porque asi la afirmacion es la de verdad: la miniatura de
 * la tarjeta y la portada del articulo son LA MISMA imagen. Si el cliente cambia una
 * portada en el CMS y la tabla se queda atras, esto falla en vez de publicar una
 * tarjeta que ya no se parece al articulo que abre.
 */
console.log('\nminiaturas de la banda de blog (home + paginas de ciudad)');

const CIUDADES = path.join(HTML, 'pergolas-contractors');
const ciudades = (await fs.readdir(CIUDADES, { withFileTypes: true }))
  .filter((d) => d.isDirectory())
  .map((d) => d.name);

decir(ciudades.length === ciudadesEsperadas(), `se generan las ${ciudadesEsperadas()} paginas de ciudad (${ciudades.length})`);

/** Portada de cada articulo, leida de su propia pagina construida. */
const portada = {};
for (const slug of rutasPost) {
  const h = await fs.readFile(path.join(HTML, 'post', slug, 'index.html'), 'utf8');
  portada[slug] = h.match(/<img src="([^"]+)"[^>]*fetchpriority="high"/)?.[1] ?? null;
}
decir(
  Object.values(portada).every(Boolean),
  `portada localizada en los ${rutasPost.length} articulos`,
  Object.entries(portada).filter(([, v]) => !v).map(([k]) => `${k}: sin <img fetchpriority="high">`),
);

const TARJETA_CIUDAD = /<img[^>]*src="([^"]+)"[^>]*class="card-blog-image"[\s\S]{0,900}?<a href="\/(?:es\/)?post\/([^"]+)"/g;
const conIa = [];
const divergen = [];
const sinAlt = [];
const sinTraducir = [];
let tarjetas = 0;

// La home lleva la MISMA banda con las mismas 10 tarjetas, asi que entra en el mismo
// recorrido: '' es la raiz, o sea dist/index.html y dist/es/index.html.
const paginas = [['', ''], ['es', '']];
const esEspanol = (base) => base === 'es' || base.startsWith('es/');
for (const ciudad of ciudades) {
  paginas.push(['pergolas-contractors', ciudad], ['es/pergolas-contractors', ciudad]);
}

for (const [base, ciudad] of paginas) {
  const html = await fs
    .readFile(path.join(HTML, base, ciudad, 'index.html'), 'utf8')
    .catch(() => null);
  if (html === null) continue;        // no todas las ciudades tienen gemela en /es/
  const nombre = '/' + [base, ciudad].filter(Boolean).map((x) => `${x}/`).join('');
  if (/cms-img\/blog/.test(html)) conIa.push(nombre);
  let m;
  TARJETA_CIUDAD.lastIndex = 0;
  while ((m = TARJETA_CIUDAD.exec(html))) {
    tarjetas++;
    const [, src, slug] = m;
    if (portada[slug] && src !== portada[slug]) {
      divergen.push(`${nombre} → ${slug}: tarjeta ${src} vs portada ${portada[slug]}`);
    }
    const alt = m[0].match(/alt="([^"]*)"/)?.[1] ?? '';
    if (!alt.trim()) sinAlt.push(`${nombre} → ${slug}`);
    // El alt es un atributo: `traducirHtml` lo traduce pero NO reporta los que no
    // encuentra. Sin esto, un alt olvidado sale en ingles en /es/ y nadie avisa.
    if (esEspanol(base) && MINIATURAS_ES[alt] !== undefined) {
      sinTraducir.push(`${nombre} → ${slug}: «${alt.slice(0, 60)}…»`);
    }
  }
}

decir(conIa.length === 0, `cero referencias a /cms-img/blog/ en home y paginas de ciudad (${conIa.length})`, conIa);
decir(tarjetas > 0, `${tarjetas} tarjetas de blog emparejadas con su articulo`);
decir(divergen.length === 0, `la miniatura es la portada del articulo (${divergen.length} divergen)`, divergen);
decir(sinAlt.length === 0, `cero alt vacios en las miniaturas (${sinAlt.length})`, sinAlt);
decir(
  sinTraducir.length === 0,
  `los alt de /es/ estan en español (${sinTraducir.length} siguen en ingles)`,
  sinTraducir,
);

console.log('\nbarra de progreso');
decir(
  !cssBuild.includes('pp-progreso'),
  'la barra de progreso de lectura sigue retirada (se cruzaba sobre el texto)',
);

console.log('');
if (fallos.length) {
  console.error(`${fallos.length} FALLO(S)\n`);
  process.exit(1);
}
console.log('Todo correcto.\n');
