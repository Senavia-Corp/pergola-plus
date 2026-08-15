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

const RAIZ = path.resolve(import.meta.dirname, '..');
const DIST = path.join(RAIZ, 'dist/resources/blog');

/** Las cuentas salen del CSV del CMS. Si el cliente publica mas, hay que subirlas. */
const ESPERADO = {
  index: 20, // 21 menos el destacado, que ya sale entero arriba
  'buying-guides-cost': 9,
  'outdoor-living-design': 6,
  'materials-engineering': 3,
  'pergolas-shade-systems': 2,
  'maintenance-care': 1,
};

/**
 * Categorias del CMS sin articulos: NO deben tener ruta.
 *
 * `view-all` no es una categoria, es un control de interfaz metido en la coleccion.
 * Las otras tres estan creadas y vacias; service-areas ademas chocaria con las 29
 * paginas reales de zonas de servicio del sitio.
 */
const SIN_RUTA = [
  'commercial-projects',
  'patio-hardscape-services',
  'service-areas',
  'view-all',
];

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
    visibles === n && todas.length === 21,
    `${ruta}: ${visibles} visibles de ${todas.length} en el DOM (esperado ${n} de 21)`,
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
    (await fs.readdir(path.join(RAIZ, 'dist/_astro')))
      .filter((f) => f.endsWith('.css'))
      .map((f) => fs.readFile(path.join(RAIZ, 'dist/_astro', f), 'utf8')),
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

const rss = await fs.readFile(path.join(DIST, 'rss.xml'), 'utf8');
const items = (rss.match(/<item>/g) ?? []).length;
decir(items === 21, `el RSS trae los 21 items (trae ${items})`);
decir(!/&(?!amp;|lt;|gt;|quot;|apos;|#)/.test(rss), 'el RSS no tiene ampersands sin escapar');

/* ------------------------------------------------------------- articulo -- */

console.log('\narticulo /post/<slug>');

const rutasPost = (await fs.readdir(path.join(RAIZ, 'dist/post'), { withFileTypes: true }))
  .filter((d) => d.isDirectory())
  .map((d) => d.name);

decir(rutasPost.length === 21, `se generan los 21 posts (${rutasPost.length})`);

let conH1Malo = 0;
let conOpacidad = 0;
let sinIndice = 0;
let sinMigas = 0;
for (const slug of rutasPost) {
  const h = await fs.readFile(path.join(RAIZ, 'dist/post', slug, 'index.html'), 'utf8');
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
  path.join(RAIZ, 'dist/post/design-build-pergola-process-south-florida/index.html'),
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
 * La barra de progreso tiene que quedar DENTRO de @supports.
 *
 * Sin esa guarda, un navegador sin animation-timeline aplica el resto de la regla:
 * la animacion corre una vez al cargar y `both` deja la barra fijada al 100%. Una
 * barra de progreso llena nada mas entrar es peor que no tener barra.
 */
console.log('\nbarra de progreso');
// Nada de regex de un tiron: entre el @supports y la regla hay un @media, y
// cualquier clase de caracteres que excluya '@' no lo cruza.
const iSupports = cssBuild.indexOf('@supports (animation-timeline:scroll(root))');
const iAnim = cssBuild.indexOf('.pp-progreso span{animation-name');
decir(iSupports !== -1, 'existe el bloque @supports (animation-timeline)');
decir(
  iAnim !== -1 && iSupports !== -1 && iAnim > iSupports && iAnim - iSupports < 200,
  'la animacion de la barra vive DENTRO de ese @supports',
);
decir(
  !/animation:[^;]*scroll\(/.test(cssBuild),
  'el minificador NO ha compuesto el atajo con scroll()',
);

console.log('');
if (fallos.length) {
  console.error(`${fallos.length} FALLO(S)\n`);
  process.exit(1);
}
console.log('Todo correcto.\n');
