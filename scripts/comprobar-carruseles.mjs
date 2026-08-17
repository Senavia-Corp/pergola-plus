#!/usr/bin/env node
/**
 * Puerta de los carruseles. Sobre dist/, DESPUES de `npm run build`.
 *
 *     npm run check:carruseles
 *
 * QUE SE ROMPIO Y COMO SE VEIA
 *
 * El sitio en vivo movia los 127 carruseles con finsweetcomponentsconfig-1.0.21.js,
 * un script que sirve la plataforma Webflow. La migracion no se lo lleva —es codigo
 * de Webflow, no del sitio— y al quitarlo quedo esto, que NO da ningun error:
 *
 *   _list-wrapper { overflow: clip }   recorta
 *   _list         { display: flex }    los slides, en fila
 *   _slide        { width: 100% }      cada uno ocupa el hueco entero
 *
 * Resultado: se veia el PRIMER slide y no habia forma de llegar a los demas.
 * Medido en la home: la lista de "Recent Projects" ocupaba 9500px dentro de un
 * hueco de 950px — 9 de los 10 proyectos del cliente, invisibles. Y las flechas
 * seguian en su sitio, con cursor:pointer, sin hacer nada.
 *
 * Nada de esto rompe el build, ni la paridad de data-w-id, ni los enlaces: por eso
 * hace falta una puerta propia.
 *
 * QUE SE COMPRUEBA AQUI Y QUE NO
 *
 * Esto es estatico: comprueba que las PIEZAS llegan a cada pagina servida (el CSS
 * que devuelve el scroll, el script que cablea las flechas, la plantilla de puntos
 * que el script clona). No mide el desplazamiento: eso se midio en el navegador con
 * foco real y esta anotado en docs/decisiones.md.
 *
 * ponytail: sin navegador. Meter Playwright solo para esto son ~300 MB y un
 * navegador mas que mantener; si algun dia hace falta medir el scroll en CI, el
 * sitio para engancharlo es este archivo.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { raizHtml } from './lib/dist.mjs';

const RAIZ = path.resolve(import.meta.dirname, '..');
const DIST = await raizHtml();

let fallos = 0;
const decir = (ok, msg, detalle = []) => {
  console.log(`  ${ok ? 'ok   ' : 'FALLO'} ${msg}`);
  if (!ok) {
    fallos++;
    for (const d of detalle.slice(0, 10)) console.log(`         ${d}`);
    if (detalle.length > 10) console.log(`         ... y ${detalle.length - 10} mas`);
  }
};

const htmls = (await fs.readdir(DIST, { recursive: true })).filter((p) => p.endsWith('.html'));
if (!htmls.length) {
  console.log('  FALLO  dist/ vacio: corre `npm run build` primero');
  process.exit(1);
}

// --- 1. El CSS que devuelve el scroll llega al build -------------------------
// Si esta regla no llega, los slides 2..N vuelven a ser inalcanzables y NADA mas
// se rompe: ni un error, ni un hueco, ni un enlace muerto. Solo contenido que
// desaparece.
const css = (
  await Promise.all(
    (await fs.readdir(path.join(DIST, '_astro')))
      .filter((f) => f.endsWith('.css'))
      .map((f) => fs.readFile(path.join(DIST, '_astro', f), 'utf8')),
  )
).join('\n');

const reglaScroll = css.match(/\[fs-slider-element=["']?list-wrapper["']?\][^{]*\{[^}]*\}/g)?.join('') ?? '';
decir(reglaScroll !== '', 'la regla de [fs-slider-element="list-wrapper"] llega al CSS del build');
decir(
  /overflow:\s*auto\s+hidden/.test(reglaScroll),
  'el wrapper recupera el scroll horizontal (overflow:auto hidden, no clip)',
  [reglaScroll.slice(0, 160) || '(no hay regla)'],
);
decir(
  /scroll-snap-type:\s*x\s+mandatory/.test(reglaScroll),
  'el wrapper mantiene el scroll-snap horizontal',
);
decir(
  /\[fs-slider-element=["']?slide["']?\][^{]*\{[^}]*scroll-snap-align/.test(css),
  'los slides declaran scroll-snap-align',
);

// --- 2. Ninguna pagina tiene flechas sin script ------------------------------
// Este es el fallo que veniamos a arreglar, escrito como invariante: un boton de
// carrusel en una pagina que no carga el script es un boton que no hace nada.
const sinScript = [];
const conFlechas = [];
const sinPlantilla = [];

for (const rel of htmls) {
  const html = await fs.readFile(path.join(DIST, rel), 'utf8');
  if (!html.includes('fs-slider-element="next"')) continue;
  conFlechas.push(rel);

  // Astro decide solo si INLINEA el modulo o lo saca a /_astro/*.js segun su
  // tamano, y puede cambiar de decision entre versiones o al crecer el script.
  // Hay que aceptar las dos formas: la primera version de esta puerta solo
  // miraba los <script src> y daba 63 falsos positivos con el script bien puesto.
  //
  // Se busca la marca que deja el codigo, nunca el nombre del fichero: el hash
  // cambia en cada build.
  const MARCA = 'fs-slider-instance';
  let cableado = [...html.matchAll(/<script type="module">([\s\S]*?)<\/script>/g)]
    .some((m) => m[1].includes(MARCA));
  if (!cableado) {
    for (const [, src] of html.matchAll(/<script type="module" src="([^"]+)"/g)) {
      const js = await fs.readFile(path.join(DIST, src.replace(/^\//, '')), 'utf8').catch(() => '');
      if (js.includes(MARCA)) { cableado = true; break; }
    }
  }
  if (!cableado) sinScript.push(rel);

  // El script clona la plantilla de puntos que dejo Finsweet. Sin ella no hay
  // paginacion; con ella pero sin script, hay DOS puntos para diez slides.
  if (html.includes('fs-slider-element="pagination"')
      && !html.includes('fs-slider-element="pagination-bullet"')) {
    sinPlantilla.push(rel);
  }
}

decir(conFlechas.length > 0, `${conFlechas.length} paginas llevan carrusel`);
decir(sinScript.length === 0, 'todas las paginas con flechas cargan el script que las cablea', sinScript);
decir(sinPlantilla.length === 0, 'toda paginacion conserva su plantilla de punto', sinPlantilla);

// --- 3. Los botones siguen siendo <button> ----------------------------------
// Si alguien los convirtiera en <a href="#"> para "arreglar" algo, volverian a
// aparecer como enlaces muertos en check:enlaces y perderian el teclado.
const comoEnlace = [];
for (const rel of conFlechas) {
  const html = await fs.readFile(path.join(DIST, rel), 'utf8');
  if (/<a[^>]*fs-slider-element="(?:next|previous)"/.test(html)) comoEnlace.push(rel);
}
decir(comoEnlace.length === 0, 'las flechas siguen siendo <button>, no <a href="#">', comoEnlace);

// --- 4. El carrusel de resenas de Google ------------------------------------
// Los 127 carruseles de arriba vienen del markup migrado: si desaparecen, se nota
// porque desaparece contenido del cliente. El de resenas es CODIGO NUESTRO
// montado desde tres sitios distintos —el generador de paginas inglesas,
// [...ruta].astro para las espanolas y dos paginas de autoria propia— y por eso
// se puede perder de una forma que las comprobaciones de arriba no ven: bastaria
// con que uno de esos tres puntos dejara de montarlo para que la mitad de las
// rutas se quedara sin el, sin error y sin hueco visible.
//
// Ademas es la tercera vez que este sitio se queda sin resenas: primero el widget
// de Elfsight devolviendo WIDGET_DISABLED en 40 paginas, luego los 40 fragmentos
// editados a mano que un regenerado deshizo. Un invariante escrito cuesta menos
// que la tercera.
//
// SIN RESENAS EN EL SNAPSHOT NO SE EXIGE NADA: el componente no renderiza a
// proposito cuando la lista esta vacia, y una puerta que exigiera markup
// impediria justamente eso. Lo que se comprueba es la implicacion: si hay
// resenas, tienen que estar en TODAS las rutas declaradas y con el contrato
// entero.
{
  const { CON_RESENAS } = await import('../src/lib/resenas-rutas.mjs');
  const { resenas } = JSON.parse(
    await fs.readFile(path.join(RAIZ, 'src/data/reviews-google.json'), 'utf8'),
  );

  // Las inglesas de la lista + sus gemelas /es/ + las dos de autoria propia.
  const esperadas = [
    ...CON_RESENAS,
    ...[...CON_RESENAS].map((r) => (r === '/' ? '/es' : `/es${r}`)),
    '/project-estimator', '/es/project-estimator',
  ].map((r) => (r === '/' ? 'index.html' : `${r.replace(/^\//, '')}/index.html`));

  if (!resenas.length) {
    console.log(`  aviso  el snapshot de resenas esta vacio: el carrusel no se renderiza`);
    console.log(`         (se llena con \`node scripts/traer-resenas.mjs\`; ${esperadas.length} rutas lo esperan)`);
  } else {
    const sinCarrusel = [];
    const incompletas = [];
    for (const rel of esperadas) {
      const html = await fs.readFile(path.join(DIST, rel), 'utf8').catch(() => null);
      if (html === null) { sinCarrusel.push(`${rel}  (la pagina no existe en dist/)`); continue; }
      if (!html.includes('fs-slider-instance="fs-slider-resenas"')) { sinCarrusel.push(rel); continue; }
      // El contrato completo: sin cualquiera de estas piezas el carrusel se ve
      // pero no se mueve, que es exactamente el fallo original de este sitio.
      const piezas = ['list-wrapper', 'list', 'slide', 'previous', 'next', 'pagination', 'pagination-bullet'];
      const faltan = piezas.filter((p) => !html.includes(`fs-slider-element="${p}"`));
      if (faltan.length) incompletas.push(`${rel}: falta ${faltan.join(', ')}`);
    }
    decir(sinCarrusel.length === 0,
      `el carrusel de resenas llega a las ${esperadas.length} rutas declaradas`, sinCarrusel);
    decir(incompletas.length === 0,
      'el carrusel de resenas trae el contrato de Finsweet entero', incompletas);

    // Que el TEXTO este en el HTML servido es media razon de hacerlo en el
    // servidor: si un dia alguien lo pasa a pintarse por JS, esto lo caza.
    const primera = resenas[0].texto.slice(0, 40);
    const home = await fs.readFile(path.join(DIST, 'index.html'), 'utf8').catch(() => '');
    decir(home.includes(primera.replace(/&/g, '&amp;').replace(/</g, '&lt;')) || home.includes(primera),
      'el texto de las resenas viaja en el HTML servido (indexable), no por JS');
  }
}

if (fallos) {
  console.log(`\n${fallos} fallo(s).`);
  process.exit(1);
}
console.log('\n  Todo en verde.');
