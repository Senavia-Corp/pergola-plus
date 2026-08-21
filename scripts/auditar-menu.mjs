#!/usr/bin/env node
/**
 * Mide la cuadricula de los dos mega-paneles del nav.
 *
 *     node scripts/auditar-menu.mjs
 *
 * Daniel pidio que las filas del desplegable se vean como una cuadricula: todas de
 * la misma altura y alineadas entre las DOS columnas. Eso es una invariante
 * geometrica, no una opinion, asi que se puede medir — y hay que medirla en un
 * navegador de verdad porque depende de `subgrid`, que no se puede comprobar
 * leyendo el CSS.
 *
 * Tres cosas, y las tres cazan un fallo distinto:
 *
 *   1. ALTURAS IGUALES. max - min <= 1px entre todos los .submenu-item del panel.
 *      Es lo que rompe un reparto por columna (`1fr`, `space-between`): productos
 *      da 5 filas y servicios 4+3, asi que cada columna repartiria su propio alto
 *      y las filas saldrian desparejas entre columnas. Un solo pixel de tolerancia
 *      porque el subpixel del layout es real.
 *
 *   2. SIN ENVOLTURA. Una etiqueta que envuelve hace su fila el doble de alta, y
 *      eso lo caza el mismo delta del punto 1 (por eso el fallo dice QUE etiqueta
 *      sobresale). El caso duro es el ESPANOL entre 992 y 1199px ("Pergolas de
 *      lamas motorizadas"), por eso se barren los dos idiomas y ese ancho.
 *
 *   3. FILAS QUE LLENAN SU PISTA. El alto de fila tiene que ser el de la pista que
 *      declara la rejilla. Es distinto del punto 1 y hace falta: si el <ul> no
 *      hereda las pistas, los items salen todos igual de BAJOS —delta 0, punto 1
 *      en verde— y la columna queda con una banda vacia al final.
 *
 *   4. LA PREVIEW CORRECTA. Al pasar por el item is-N tiene que verse la imagen
 *      is-N *de ese panel*. No es paranoia: IX2 empareja por selector GLOBAL y las
 *      listas de accion estan COMPARTIDAS entre productos y servicios, asi que un
 *      cambio de clases cruza las imagenes de los dos menus sin dar ningun error.
 *      Se mira el src que acaba visible, no solo que algo cambie.
 *
 * No va en `npm run check`: es una auditoria de diseño, se corre cuando se toca el
 * menu. scripts/ no esta en la SALIDA que vigila check:generadores, asi que este
 * fichero no ensucia esa puerta.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import { chromium } from 'playwright';

const RAIZ = path.resolve(import.meta.dirname, '..');
const ESTATICO = path.join(RAIZ, '.vercel/output/static');

/* Los dos idiomas: el espanol es el caso duro por longitud de etiqueta. */
const RUTAS = ['/', '/es/'];

/* 1200 y 992 son los que importan: 992 es el borde del breakpoint y 1200 el ancho
   donde las etiquetas largas del espanol empiezan a apretar. */
const ANCHOS = [1440, 1280, 1200, 992];

const PANELES = [
  { nombre: 'productos', panel: '.dropdown-list-products', items: 10 },
  { nombre: 'servicios', panel: '.dropdown-list-services', items: 7 },
];

const TIPO = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript',
  '.avif': 'image/avif', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.webp': 'image/webp', '.woff2': 'font/woff2', '.json': 'application/json',
  '.xml': 'application/xml', '.txt': 'text/plain', '.mp4': 'video/mp4',
};

// ------------------------------------------------------------------ 0. servidor
const existe = async (f) => !!(await fs.stat(f).catch(() => null))?.isFile();
const servidor = http.createServer(async (req, res) => {
  const u = decodeURIComponent(req.url.split('?')[0]);
  for (const c of [u.slice(1), `${u.replace(/\/$/, '')}/index.html`, `${u.slice(1)}index.html`]) {
    const f = path.join(ESTATICO, c);
    if (c && await existe(f)) {
      res.writeHead(200, { 'content-type': TIPO[path.extname(f)] ?? 'application/octet-stream' });
      return (await fs.readFile(f).then((b) => res.end(b)));
    }
  }
  res.writeHead(404); return res.end('404');
});

if (!(await fs.stat(ESTATICO).catch(() => null))) {
  console.error(`FALLO: no existe ${ESTATICO}. Corre \`npm run build\` primero.`);
  process.exit(1);
}
// Puerto 0 = efimero. Un puerto fijo colisiona con las otras puertas y con el
// worktree de al lado, y el sintoma es un fallo que parece de diseño.
await new Promise((r) => servidor.listen(0, '127.0.0.1', r));
const BASE = `http://127.0.0.1:${servidor.address().port}`;

const navegador = await chromium.launch();
const fallos = [];

// -------------------------------------------------- 1. geometria de la cuadricula
console.log('\n  cuadricula del mega-panel\n');

for (const ruta of RUTAS) {
  for (const ancho of ANCHOS) {
    const pagina = await navegador.newPage({ viewport: { width: ancho, height: 900 } });
    await pagina.goto(`${BASE}${ruta}`, { waitUntil: 'domcontentloaded' });

    for (const { nombre, panel, items } of PANELES) {
      // Los 5 desplegables llevan data-hover="false": el modulo `dropdown` de
      // webflow.js los abre con CLIC, no al pasar por encima. (El hover sigue
      // mandando dentro del panel: es lo que dispara las previews de IX2.)
      const disparador = pagina.locator(`.menu ${panel}`).locator('xpath=..').locator('.w-dropdown-toggle');
      await disparador.click();
      await pagina.locator(`.menu ${panel}.w--open`).waitFor({ state: 'visible', timeout: 3000 });

      const medida = await pagina.evaluate((sel) => {
        const raiz = document.querySelector(`.menu ${sel}`);
        const filas = [...raiz.querySelectorAll('.submenu-item')];
        return {
          n: filas.length,
          altos: filas.map((f) => +f.getBoundingClientRect().height.toFixed(2)),
          // Las etiquetas de las filas que sobresalen. Ojo: NO vale mirar
          // scrollHeight > clientHeight, porque cuando una etiqueta envuelve la
          // caja CRECE con ella y los dos valores vuelven a coincidir; el sintoma
          // es la fila mas alta que el resto, no un desbordamiento.
          etiquetas: filas.map((f) => f.querySelector('.heading-submenu').textContent.trim()),
          alto: +raiz.getBoundingClientRect().height.toFixed(1),
          // El alto de PISTA que declara la rejilla comun. Se compara contra el
          // alto real de las filas: alturas iguales NO basta, porque si el <ul>
          // no hereda las pistas del subgrid los items se quedan todos a la
          // altura de su texto —iguales entre si, asi que el delta da 0— y la
          // columna acaba con una banda vacia. Paso exactamente eso al olvidar
          // `display:grid` en el <ul>, que el CSS migrado deja en flex.
          //
          // Se mide contra la pista y no contra el alto del <ul> porque las dos
          // columnas de servicios tienen 4 y 3 items: ahi sobra una pista a
          // proposito, y eso es correcto.
          pista: +getComputedStyle(raiz.querySelector('.wrapper-submenu'))
            .gridTemplateRows.split(' ').at(-1).replace('px', ''),
        };
      }, panel);

      const delta = +(Math.max(...medida.altos) - Math.min(...medida.altos)).toFixed(2);
      const etiqueta = `${ruta} ${ancho}px ${nombre}`;

      if (medida.n !== items) {
        fallos.push(`${etiqueta}: ${medida.n} filas, se esperaban ${items}`);
      } else if (delta > 1) {
        const min = Math.min(...medida.altos);
        const altas = medida.etiquetas.filter((_, i) => medida.altos[i] > min + 1);
        fallos.push(`${etiqueta}: filas desparejas, delta ${delta}px — sobresale(n): ${altas.join(', ')}`);
      } else if (Math.min(...medida.altos) < medida.pista - 1) {
        fallos.push(`${etiqueta}: las filas no llenan su pista (${Math.min(...medida.altos)}px de ${medida.pista}px)`);
      } else {
        console.log(`    ok  ${etiqueta.padEnd(30)} ${medida.n} filas de ${medida.altos[0]}px  ·  panel ${medida.alto}px`);
      }

      // Cerrar antes del siguiente: el modulo de Webflow cierra con Escape.
      await pagina.keyboard.press('Escape');
      await pagina.locator(`.menu ${panel}.w--open`).waitFor({ state: 'hidden', timeout: 3000 }).catch(() => {});
    }
    await pagina.close();
  }
}

// ------------------------------------------- 2. la preview que sale es la correcta
console.log('\n  emparejamiento item -> preview (IX2)\n');

const pagina = await navegador.newPage({ viewport: { width: 1440, height: 900 } });
await pagina.goto(`${BASE}/`, { waitUntil: 'domcontentloaded' });

for (const { nombre, panel, items } of PANELES) {
  const disparador = pagina.locator(`.menu ${panel}`).locator('xpath=..').locator('.w-dropdown-toggle');
  await disparador.click();
  await pagina.locator(`.menu ${panel}.w--open`).waitFor({ state: 'visible', timeout: 3000 });

  for (let i = 1; i <= items; i++) {
    const fila = pagina.locator(`.menu ${panel} .submenu-item.is-${i}`);
    if (!(await fila.count())) continue;
    await fila.hover();

    // IX2 hace un fundido de 500ms escribiendo element.style; se espera a que la
    // imagen de ESTE panel quede visible del todo.
    const visto = await pagina.evaluate(async ([sel, n]) => {
      const raiz = document.querySelector(`.menu ${sel}`);
      const espera = (ms) => new Promise((r) => setTimeout(r, ms));
      await espera(700);
      const visibles = [...raiz.querySelectorAll('.preview-image, .preview-image-cover')]
        .filter((im) => getComputedStyle(im).display !== 'none' && +getComputedStyle(im).opacity > .5)
        .map((im) => ({ clase: im.className, src: new URL(im.src).pathname }));
      const propia = raiz.querySelector(`.preview-image.is-${n}`);
      return { visibles, propiaSrc: propia ? new URL(propia.src).pathname : null };
    }, [panel, i]);

    const destino = await fila.getAttribute('href');
    const acertada = visto.visibles.some((v) => v.src === visto.propiaSrc);

    if (!visto.visibles.length) {
      fallos.push(`${nombre} is-${i} (${destino}): no se ve NINGUNA preview`);
    } else if (!acertada) {
      fallos.push(`${nombre} is-${i} (${destino}): sale ${visto.visibles.map((v) => v.src).join(', ')}, se esperaba ${visto.propiaSrc}`);
    } else {
      console.log(`    ok  ${nombre} is-${String(i).padEnd(2)} ${destino.padEnd(42)} -> ${visto.propiaSrc.replace('/images/', '')}`);
    }
  }
  await pagina.keyboard.press('Escape');
  await pagina.locator(`.menu ${panel}.w--open`).waitFor({ state: 'hidden', timeout: 3000 }).catch(() => {});
}

// --------------------------------------------------------- 3. movil: no hay rejilla
console.log('\n  movil (375px)\n');

const movil = await navegador.newPage({ viewport: { width: 375, height: 812 } });
await movil.goto(`${BASE}/`, { waitUntil: 'domcontentloaded' });
await movil.locator('.menu .w-nav-button').click();
// El panel movil entra con una transicion: sin esperarla se mide a media
// animacion y las filas salen por debajo de sus 44px sin que nada este mal.
await movil.locator('.menu .w-nav-menu').waitFor({ state: 'visible' });
await movil.locator('.menu .dropdown-toggle').first().click();
await movil.locator('.menu .dropdown-list-products.w--open').waitFor({ state: 'visible' });
await movil.waitForTimeout(500);

const enMovil = await movil.evaluate(() => {
  const filas = [...document.querySelectorAll('.menu .dropdown-list-products .submenu-item')];
  return {
    bajos: filas.filter((f) => f.getBoundingClientRect().height < 44).length,
    previewsVisibles: [...document.querySelectorAll('.menu .preview-wrapper, .menu .preview-wrapper-products')]
      .filter((p) => getComputedStyle(p).display !== 'none').length,
    verTodo: !!document.querySelector('.menu .dropdown-list-products .ver-todo'),
  };
});
if (enMovil.bajos) fallos.push(`movil: ${enMovil.bajos} filas por debajo de 44px`);
if (enMovil.previewsVisibles) fallos.push(`movil: ${enMovil.previewsVisibles} previews visibles (deben ocultarse)`);
if (!enMovil.verTodo) fallos.push('movil: falta el enlace "ver todo"');
if (!enMovil.bajos && !enMovil.previewsVisibles && enMovil.verTodo) {
  console.log('    ok  filas >=44px, sin previews, "ver todo" presente');
}

await navegador.close();
servidor.close();

// ----------------------------------------------------------------- 4. veredicto
if (fallos.length) {
  console.log(`\n  ${fallos.length} FALLO(S)\n`);
  for (const f of fallos) console.log(`    ✗ ${f}`);
  console.log();
  process.exit(1);
}
console.log('\n  cuadricula, previews y movil: todo en orden\n');
