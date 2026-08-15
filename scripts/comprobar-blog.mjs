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
  'commercial-projects': 0,
  'patio-hardscape-services': 0,
  'service-areas': 0,
};

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

console.log('\nsin JavaScript');
const indice = await leer('index');
decir(!indice.includes('style="opacity:0"'), 'cero opacity:0 en linea');
decir(
  indice.includes('data-slug=') && !/<li data-cat[^>]*>\s*<article class="pp-card" data-pp-reveal>\s*<\/article>/.test(indice),
  'las tarjetas llevan contenido renderizado en servidor',
);

console.log('\nSEO');
decir(indice.includes('application/ld+json'), 'JSON-LD en el listado');
decir(!indice.includes('website-files.com'), 'cero URLs del CDN de Webflow');
decir(
  (await leer('commercial-projects')).includes('noindex,follow'),
  'las categorias vacias van con noindex',
);
decir(
  !(await leer('buying-guides-cost')).includes('noindex,follow'),
  'las categorias con posts NO van con noindex',
);

const rss = await fs.readFile(path.join(DIST, 'rss.xml'), 'utf8');
const items = (rss.match(/<item>/g) ?? []).length;
decir(items === 21, `el RSS trae los 21 items (trae ${items})`);
decir(!/&(?!amp;|lt;|gt;|quot;|apos;|#)/.test(rss), 'el RSS no tiene ampersands sin escapar');

console.log('');
if (fallos.length) {
  console.error(`${fallos.length} FALLO(S)\n`);
  process.exit(1);
}
console.log('Todo correcto.\n');
