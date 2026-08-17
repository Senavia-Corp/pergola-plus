#!/usr/bin/env node
/**
 * Puerta de la barra de logos de marca. Sobre dist/, DESPUES de `npm run build`.
 *
 *     npm run check:marquee
 *
 * QUE SE ROMPIO Y COMO SE VEIA
 *
 * La barra llego del export como un componente marquee de Finsweet. El script que la
 * movia lo sirve la plataforma Webflow, asi que la migracion no se lo llevo — misma
 * historia que los 127 carruseles. Lo que quedaba no daba ningun error:
 *
 *   .fs-marquee-logos_list        { justify-content: center }   cinco logos quietos
 *   .fs-marquee-logos_list-wrapper{ overflow: clip }            y recortados
 *
 * QUE COMPRUEBA ESTO Y QUE NO
 *
 * Es ESTATICO a proposito: lee el HTML y el CSS construidos, no mide el movimiento.
 * Medirlo con un navegador seria un falso verde garantizado — una pestana sin foco
 * congela rAF y las animaciones no avanzan, que es la trampa ya documentada en
 * docs/decisiones.md. Lo que si es determinista es la ESTRUCTURA, y de ella depende
 * que el bucle no tenga costura.
 *
 * Los cuatro fallos que vigila, todos de los que no dan error:
 *
 *   1. Que el paso 4j del transformador deje de casar y la pista vuelva a tener 5
 *      logos: el marquee volveria a estar muerto y el build seguiria verde.
 *   2. Que las dos mitades dejen de ser identicas: la animacion desplaza -50%, y si
 *      esa frontera no cae en juego completo, cada vuelta da un tiron.
 *   3. Que alguien anime `.section-marquee-logos` en vez del nieto: una animacion con
 *      fill activo gana al element.style de IX2 y le anula sus dos interacciones sin
 *      un solo error en consola.
 *   4. Que el minificador se coma el atajo `animation` y quede `animation-name:none`.
 *      Sin animacion, sin nada roto a la vista. Es el mismo fallo que vigila
 *      check:blog con `animation-timeline`.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { raizHtml } from './lib/dist.mjs';
import { MARQUEE_JUEGOS } from './lib/transformar.mjs';

const DIST = await raizHtml();

/** Las 4 rutas que llevan la barra: 2 paginas x 2 idiomas. */
const CON_MARQUEE = [
  { ruta: 'index.html', altsPropios: true },
  { ruta: 'es/index.html', altsPropios: true },
  // En sectores los alt llegaron VACIOS del CMS: alli las imagenes son decorativas y
  // asi se quedan. Se exige la estructura, no el texto alternativo.
  { ruta: 'about-us/industries-we-serve/index.html', altsPropios: false },
  { ruta: 'es/about-us/industries-we-serve/index.html', altsPropios: false },
];

const WID_SECCION = '9e6cd8cc-1a46-44d5-b687-f5405cbfa2df';

let fallos = 0;
const decir = (ok, msg, detalle = []) => {
  console.log(`  ${ok ? 'ok   ' : 'FALLO'} ${msg}`);
  if (!ok) {
    fallos++;
    for (const d of detalle.slice(0, 8)) console.log(`         ${d}`);
    if (detalle.length > 8) console.log(`         ... y ${detalle.length - 8} mas`);
  }
};

console.log(`\n  la barra de logos, en ${CON_MARQUEE.length} paginas\n`);

// ---------------------------------------------------------------------------
// 1 · La pista, en el HTML construido
// ---------------------------------------------------------------------------

const sinPista = [];
const malContadas = [];
const mitadesDistintas = [];
const noPeriodicas = [];
const ariaMal = [];
const sinAlt = [];
const sinWid = [];

for (const { ruta, altsPropios } of CON_MARQUEE) {
  const html = await fs.readFile(path.join(DIST, ruta), 'utf8').catch(() => null);
  if (html === null) { sinPista.push(`${ruta}: no existe`); continue; }

  const i = html.indexOf('data-pp-marquee');
  if (i === -1) { sinPista.push(`${ruta}: sin data-pp-marquee (el paso 4j no caso)`); continue; }

  const lista = html.slice(i, html.indexOf('</div></div></div>', i));
  const items = [...lista.matchAll(
    /<div([^>]*)class="fs-marquee-logos_item[^"]*"[^>]*><img([^>]*)\/>/g,
  )].map((m) => ({
    oculto: /aria-hidden="true"/.test(m[1]),
    src: m[2].match(/src="([^"]+)"/)?.[1] ?? '',
    alt: m[2].match(/alt="([^"]*)"/)?.[1] ?? null,
  }));

  const porJuego = items.length / MARQUEE_JUEGOS;
  if (items.length !== porJuego * MARQUEE_JUEGOS || !Number.isInteger(porJuego) || porJuego < 1) {
    malContadas.push(`${ruta}: ${items.length} items no reparten en ${MARQUEE_JUEGOS} juegos`);
    continue;
  }

  // La animacion desplaza -50%: las dos mitades tienen que decir lo MISMO y en el
  // mismo orden, o cada vuelta se nota.
  const src = items.map((it) => it.src);
  const a = src.slice(0, src.length / 2).join('|');
  const b = src.slice(src.length / 2).join('|');
  if (a !== b) mitadesDistintas.push(`${ruta}: la segunda mitad no repite la primera`);

  // Y el contenido tiene que ser periodico con periodo de UN juego: si no, -50% cae
  // en mitad de un juego aunque las mitades coincidan.
  const juego = src.slice(0, porJuego);
  if (!src.every((s, n) => s === juego[n % porJuego])) {
    noPeriodicas.push(`${ruta}: el contenido no se repite cada ${porJuego} logos`);
  }

  // Accesibilidad: solo el primer juego se anuncia. El resto son copias visuales.
  const anunciados = items.filter((it) => !it.oculto);
  if (anunciados.length !== porJuego) {
    ariaMal.push(`${ruta}: ${anunciados.length} items anunciados, se esperaban ${porJuego}`);
  }
  if (items.slice(0, porJuego).some((it) => it.oculto)) {
    ariaMal.push(`${ruta}: el primer juego lleva aria-hidden y no debe`);
  }
  if (items.slice(porJuego).some((it) => !it.oculto)) {
    ariaMal.push(`${ruta}: alguna copia se quedo sin aria-hidden`);
  }
  if (items.slice(porJuego).some((it) => it.alt)) {
    ariaMal.push(`${ruta}: alguna copia conserva alt (deberia ser alt="")`);
  }
  if (altsPropios && anunciados.some((it) => !it.alt)) {
    sinAlt.push(`${ruta}: un logo anunciado se quedo sin alt`);
  }

  // IX2: sin el data-w-id en su sitio la seccion se queda en opacity:0 para siempre.
  if (ruta.endsWith('index.html') && !ruta.includes('industries')) {
    if (!new RegExp(`data-w-id="${WID_SECCION}"[^>]*class="section-marquee-logos"`).test(html)
      && !new RegExp(`class="section-marquee-logos"[^>]*data-w-id="${WID_SECCION}"`).test(html)) {
      sinWid.push(`${ruta}: el data-w-id ya no esta en .section-marquee-logos`);
    }
    if (!html.includes(`[data-w-id="${WID_SECCION}"]`)) {
      sinWid.push(`${ruta}: falta el bloque anti-FOUC del data-w-id`);
    }
  }
}

decir(sinPista.length === 0, 'las 4 paginas llevan la pista duplicada', sinPista);
decir(malContadas.length === 0, `los items reparten en ${MARQUEE_JUEGOS} juegos exactos`, malContadas);
decir(MARQUEE_JUEGOS % 2 === 0, `el numero de juegos es PAR (${MARQUEE_JUEGOS}), o -50% no cae en frontera`);
decir(mitadesDistintas.length === 0, 'las dos mitades de la pista son identicas', mitadesDistintas);
decir(noPeriodicas.length === 0, 'el contenido se repite con periodo de un juego', noPeriodicas);
decir(ariaMal.length === 0, 'solo el primer juego se anuncia a un lector de pantalla', ariaMal);
decir(sinAlt.length === 0, 'los logos anunciados conservan su alt', sinAlt);
decir(sinWid.length === 0, 'el data-w-id de IX2 y su anti-FOUC siguen en su sitio', sinWid);

// ---------------------------------------------------------------------------
// 2 · La animacion, en el CSS emitido
// ---------------------------------------------------------------------------

const dirCss = path.join(DIST, '_astro');
const hojas = (await fs.readdir(dirCss).catch(() => [])).filter((f) => f.endsWith('.css'));
const css = (
  await Promise.all(hojas.map((f) => fs.readFile(path.join(dirCss, f), 'utf8')))
).join('\n');

decir(css.length > 0, 'hay CSS emitido que revisar');

// El minificador reescribe translateX(-50%) como translate(-50%): las dos valen.
const marco = css.match(/@keyframes pp-marquee-logos\s*\{[\s\S]{0,300}?\}\s*\}/);
decir(Boolean(marco), 'existe @keyframes pp-marquee-logos');
if (marco) {
  decir(
    /\bto\s*\{|100%\s*\{/.test(marco[0]),
    'el @keyframes declara su estado final explicito',
    [marco[0].slice(0, 160)],
  );
  decir(
    /transform:\s*translate(?:X)?\(\s*-50%/.test(marco[0]),
    'el desplazamiento es exactamente -50% (media pista)',
    [marco[0].slice(0, 160)],
  );
}

const reglaPista = css.match(/\.fs-marquee-logos_list\[data-pp-marquee\][^{:][^{]*\{[^}]*\}/)
  ?? css.match(/\.fs-marquee-logos_list\[data-pp-marquee\]\{[^}]*\}/);
decir(
  Boolean(reglaPista),
  'la pista se gobierna con [data-pp-marquee] (especificidad 0,2,0 > la de Webflow)',
);
if (reglaPista) {
  decir(
    /animation-name:\s*pp-marquee-logos/.test(reglaPista[0]),
    'la animacion se aplica con animation-name suelto',
    [reglaPista[0].slice(0, 200)],
  );
  decir(
    !/[;{]animation:/.test(reglaPista[0]),
    'no se usa el atajo `animation:` (el minificador lo fusiona y lo tira entero)',
    [reglaPista[0].slice(0, 200)],
  );
  decir(
    /justify-content:\s*flex-start/.test(reglaPista[0]),
    'la pista arranca a la izquierda, no centrada',
    [reglaPista[0].slice(0, 200)],
  );
}

decir(
  /prefers-reduced-motion[^{]*\{[^@]*fs-marquee-logos/.test(css.replace(/\n/g, '')),
  'la animacion esta dentro de un bloque prefers-reduced-motion',
);

// El nieto se anima; la seccion NUNCA. Animarla anularia las dos interacciones IX2.
const propias = [...css.matchAll(/([^{}]*fs-marquee-logos[^{}]*|[^{}]*section-marquee-logos[^{}]*)\{([^}]*)\}/g)];
const tocanSeccion = propias
  .filter(([, sel, cuerpo]) =>
    /section-marquee-logos/.test(sel) && /(^|[;{\s])(transform|opacity|animation)/.test(cuerpo))
  .map(([, sel]) => sel.trim().slice(0, 80));
decir(
  tocanSeccion.length === 0,
  'ningun selector propio anima .section-marquee-logos (es de IX2)',
  tocanSeccion,
);

const tocanFotos = propias
  .filter(([, sel]) => /fs-marquee-picture/.test(sel))
  .map(([, sel]) => sel.trim().slice(0, 80));
decir(
  tocanFotos.length === 0,
  'los marquees de fotos quedan fuera: no se les ha duplicado la pista',
  tocanFotos,
);

console.log(fallos === 0 ? '\n  Todo en verde.\n' : `\n${fallos} fallo(s).\n`);
process.exit(fallos === 0 ? 0 : 1);
