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

const RAIZ = path.resolve(import.meta.dirname, '..');
const DIST = path.join(RAIZ, 'dist');

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

if (fallos) {
  console.log(`\n${fallos} fallo(s).`);
  process.exit(1);
}
console.log('\n  Todo en verde.');
