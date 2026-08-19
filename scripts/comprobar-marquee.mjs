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
 *   2. Que el salto de vuelta deje de medir UN juego exacto: la animacion desplaza
 *      1/JUEGOS de pista, y si ese divisor y el numero de juegos se separan, el salto
 *      cae en mitad de un logo y cada vuelta da un tiron.
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

  // El salto de vuelta mide UN juego, asi que la unica condicion es que el contenido
  // sea periodico con periodo de un juego: si lo es, la pista despues del salto queda
  // exactamente igual que antes y no hay costura.
  const src = items.map((it) => it.src);
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
decir(MARQUEE_JUEGOS >= 2, `hay al menos 2 juegos (${MARQUEE_JUEGOS}) para tapar el salto`);
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

// El minificador reescribe translateX(-12.5%) como translate(-12.5%) y pliega el
// calc(-100%/8) a su porcentaje: las tres formas valen, lo que se mide es el NUMERO.
const marco = css.match(/@keyframes pp-marquee-logos\s*\{[\s\S]{0,300}?\}\s*\}/);
decir(Boolean(marco), 'existe @keyframes pp-marquee-logos');
if (marco) {
  decir(
    /\bto\s*\{|100%\s*\{/.test(marco[0]),
    'el @keyframes declara su estado final explicito',
    [marco[0].slice(0, 160)],
  );
  /*
   * EL numero que importa. El desplazamiento tiene que ser 1/MARQUEE_JUEGOS de pista
   * —o sea, UN juego— y ese acoplamiento no lo ve nadie: subir MARQUEE_JUEGOS a 10 y
   * dejar el divisor en 8 da un salto de 1,25 juegos que cae en mitad de un logo. La
   * barra pega un tiron cada vuelta, el build sigue verde y no hay error en consola.
   */
  const esperado = 100 / MARQUEE_JUEGOS;
  const salto = marco[0].match(
    /transform:\s*translate(?:X)?\(\s*(?:calc\(\s*-100%\s*\/\s*(\d+(?:\.\d+)?)\s*\)|-(\d+(?:\.\d+)?)%)/,
  );
  const pct = salto ? (salto[1] ? 100 / Number(salto[1]) : Number(salto[2])) : NaN;
  decir(
    Math.abs(pct - esperado) < 1e-9,
    `el salto mide UN juego: ${esperado}% de pista (1/${MARQUEE_JUEGOS})`,
    [`leido: ${Number.isNaN(pct) ? 'no se reconoce el transform' : pct + '%'}`, marco[0].slice(0, 160)],
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
    /animation-duration:\s*[\d.]+m?s/.test(reglaPista[0]),
    'la duracion va en propiedad larga (el atajo se la lleva por delante)',
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


// --- las dos filas de fotos -------------------------------------------------
//
// Estaban muertas igual que lo estuvo la barra de logos: el script de Finsweet que
// las movia en Webflow no viaja con la migracion. Ahora se animan en sentidos
// CONTRARIOS, y esta puerta vigila lo que no da error al romperse — que una pista se
// quede sin duplicar y al llegar al final salte a un hueco blanco.
console.log('\nlas dos filas de fotos');
{
  // Las dos filas viven en about-us/industries-we-serve y su gemela en /es/. Se
  // buscan en vez de escribirlas a mano: si manana la seccion se reutiliza en otra
  // pagina, entra sola en la comprobacion.
  const todos = (await fs.readdir(DIST, { recursive: true })).filter((f) => f.endsWith('.html'));
  const paginas = [];
  const cache = new Map();
  for (const rel of todos) {
    const h = await fs.readFile(path.join(DIST, rel), 'utf8');
    if (h.includes('fs-marquee-picture-right_list')) { paginas.push(rel); cache.set(rel, h); }
  }
  decir(paginas.length > 0, `hay paginas con las dos filas de fotos (${paginas.length})`);

  for (const rel of paginas) {
    const html = cache.get(rel);
    for (const lado of ['right', 'left']) {
      const marcada = html.includes(`data-pp-marquee-fotos="${lado}"`);
      decir(marcada, `${rel}: la pista "${lado}" esta marcada para animarse`);
      if (!marcada) continue;

      const items = (html.match(new RegExp(`fs-marquee-picture-${lado}_item`, 'g')) ?? []).length;
      // Un juego son 10 fotos; con JUEGOS=2 tienen que salir 20. Si el ancla del
      // generador dejara de casar, saldrian 10 y la tira se quedaria corta.
      decir(
        items % 2 === 0 && items >= 20,
        `${rel}: la pista "${lado}" esta duplicada (${items} items, deben ser 20)`,
      );

      // Las copias fuera del arbol de accesibilidad: si no, un lector anuncia el
      // doble de fotos de las que hay.
      const ocultos = (html.match(
        new RegExp(`aria-hidden="true" fs-marquee-element="item" role="listitem" class="fs-marquee-picture-${lado}_item`, 'g'),
      ) ?? []).length;
      decir(
        ocultos === items / 2,
        `${rel}: las copias de "${lado}" van aria-hidden (${ocultos} de ${items / 2})`,
      );
    }
  }

  // Sentidos CONTRARIOS. Si las dos acabaran con el mismo keyframe el efecto se
  // pierde entero y no lo dice ningun error.
  const animDe = (lado) =>
    css.replace(/\n/g, '').match(
      new RegExp(`\\[data-pp-marquee-fotos=['"]?${lado}['"]?\\][^{]*\\{[^}]*animation-name:\\s*([\\w-]+)`),
    )?.[1];
  const a = animDe('right');
  const b = animDe('left');
  decir(!!a && !!b, `las dos pistas declaran animacion (${a ?? '-'} / ${b ?? '-'})`);
  decir(a !== b, 'las dos filas NO comparten keyframe: van en sentidos contrarios');

  // Mismo cuidado que la barra de logos con el minificador.
  const reglaFotos = css.replace(/\n/g, '').match(/\[data-pp-marquee-fotos\][^{]*\{[^}]*\}/)?.[0] ?? '';
  decir(
    !/[;{]animation:/.test(reglaFotos),
    'no se usa el atajo `animation:` en las filas de fotos',
    [reglaFotos.slice(0, 160)],
  );
  decir(
    /animation-duration:\s*[\d.]+m?s/.test(reglaFotos),
    'la duracion va en propiedad larga',
    [reglaFotos.slice(0, 160)],
  );
  decir(
    /prefers-reduced-motion[^{]*\{[^@]*data-pp-marquee-fotos/.test(css.replace(/\n/g, '')),
    'la animacion de las fotos esta dentro de un bloque prefers-reduced-motion',
  );
}

console.log(fallos === 0 ? '\n  Todo en verde.\n' : `\n${fallos} fallo(s).\n`);
process.exit(fallos === 0 ? 0 : 1);
