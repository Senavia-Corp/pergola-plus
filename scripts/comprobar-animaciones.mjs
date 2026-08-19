#!/usr/bin/env node
/**
 * Puerta de las entradas por scroll. Sobre dist/, DESPUES de `npm run build`.
 *
 *     npm run check:animaciones
 *
 * QUE SE ROMPIO Y COMO SE VEIA
 *
 * Las 110 entradas del sitio las hacia IX2 sobre requestAnimationFrame. Medido sobre
 * public/js/webflow.js antes de apagarlas: los cinco presets duran 1000 ms y 104 de
 * los 110 eventos llevan delay:450, o sea 1450 ms desde el umbral hasta el reposo.
 * Los slideIn* recorrian 100 px, growIn escalaba desde 0,75, y 20 de los 66 elementos
 * cambiaban de gesto a 992 px. Ahora las hace src/styles/animaciones.css con
 * animation-timeline: view(), y los eventos estan apagados con mediaQueries:[]
 * (scripts/parchear-webflow.mjs).
 *
 * QUE COMPRUEBA ESTO Y QUE NO
 *
 * Es ESTATICO a proposito: lee el HTML y el CSS construidos, no mide el movimiento.
 * Medirlo con un navegador aqui seria un falso verde garantizado — una pestana sin
 * foco congela rAF, la trampa documentada en docs/decisiones.md. El movimiento se
 * mide con `node scripts/auditar-animaciones.mjs`, que exige foco real.
 *
 * Los siete fallos que vigila, TODOS de los que no dan ningun error:
 *
 *   1. Que el parche no se haya aplicado, o se haya pasado de largo. Sin el, IX2 y el
 *      CSS animan el mismo elemento a la vez. Pasado de largo, mata el nav o el FAQ.
 *   2. Que un elemento se quede invisible. Es el fallo grande de esta migracion: los
 *      12 data-w-id con opacity:0 en linea y los 11 con bloque anti-FOUC dependian de
 *      que IX2 los encendiera. Medido antes de arreglarlo: la home se quedaba con
 *      .hero-block-video invisible para siempre, sin error y sin mover el layout.
 *   3. Que vuelva un bloque anti-FOUC sin que nadie lo encienda.
 *   4. Que el minificador se coma el atajo `animation` y quede animation-name:none.
 *      Mismo fallo que vigilan check:blog y check:marquee.
 *   5. Que una entrada se quede fuera de prefers-reduced-motion: no-preference.
 *   6. Que un @keyframes pierda su `to`. Sin el, el estado final es el calculado del
 *      elemento y la degradacion deja de aterrizar en visible.
 *   7. Que el CSS y la tabla de scripts/lib/reveals.mjs se separen: un uuid que deja
 *      de estar reclamado pierde su entrada y nadie se entera. Mismo acoplamiento que
 *      MARQUEE_JUEGOS con check:marquee.
 *
 * PROBADA ROMPIENDOLA. Las 14 roturas se hicieron a proposito sobre dist/ y se vio
 * cada una en rojo antes de revertirla: reveal con mediaQueries restauradas · parche
 * que vacia un evento del nav · dist rancio · opacity:0 en linea de vuelta · anti-FOUC
 * de vuelta · atajo `animation:` junto a view() · entrada fuera de no-preference ·
 * @keyframes sin `to` · rango de vuelta a `cover` · uuid sin reclamar · .menu animado
 * · .feature-card animada · un peldano de escalonado caido · animation-name apuntando
 * a un keyframe inexistente.
 *
 * Tres de esas roturas encontraron un fallo EN LA PUERTA, no en el codigo, y por eso
 * merece la pena hacerlas:
 *   - .menu se vigilaba solo por su data-w-id, asi que `.menu{animation-name:...}` se
 *     colaba. Ahora se miran las dos formas de alcanzarlo.
 *   - el rango se comprobaba buscando `entry`, y `entry cover 25%` lo contiene: se
 *     afirma la ausencia de `cover`, y sobre TODAS las reglas, no solo la base.
 *   - el escalonado se daba por bueno con un peldano de tres.
 *
 * Y las dos COLISIONES medidas: .menu y .feature-card siguen siendo de IX2 (a-27/a-28
 * y a-23/a-24 les escriben opacity y transform). Una animacion CSS con fill activo
 * gana al element.style, asi que animarlos mataria el nav de las 211 paginas y el
 * acordeon de 14, sin un solo error en consola.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { raizHtml } from './lib/dist.mjs';
import {
  POR_UUID, CLASES, REJILLAS, EXCLUIDOS, HUERFANOS, CUBIERTOS_POR_CLASE,
} from './lib/reveals.mjs';
import { EVENTOS_TOTALES, REVEALS, registros } from './parchear-webflow.mjs';

const RAIZ = path.resolve(import.meta.dirname, '..');
const DIST = await raizHtml();

/** El censo de los eventos IX2 que SOBREVIVEN. Si cambia, algo se ha llevado por delante. */
const CENSO_VIVOS = {
  MOUSE_OVER: 18, MOUSE_OUT: 18, MOUSE_CLICK: 3, MOUSE_SECOND_CLICK: 3,
  PAGE_SCROLL_UP: 24, PAGE_SCROLL_DOWN: 24,
};

/**
 * Los dos que NO se pueden animar nunca, con el motivo medido y con TODAS las formas
 * de alcanzarlos. Lo segundo no es paranoia: la primera version de esta puerta solo
 * vigilaba el data-w-id del nav, y al probarla rompiendo el codigo se colo un
 * `.menu{animation-name:pp-entrada}` sin que dijera nada. Se llega al mismo elemento
 * por el atributo o por la clase, asi que hay que mirar las dos.
 */
const INTOCABLES = [
  {
    que: '.menu (la barra de navegacion)',
    selectores: ['2d27e00a-9abd-8e02-83db-6979dd88df62', '.menu'],
    motivo: 'a-27/a-28 (los 48 eventos PAGE_SCROLL_*) le escriben transform y opacity para '
      + 'esconder el nav al bajar. Una animacion con fill activo gana al element.style y lo '
      + 'deja clavado, en las 211 paginas y sin error. Ademas es position:sticky, y un '
      + 'transform crea bloque contenedor y se carga el sticky.',
  },
  {
    que: '.feature-card (los paneles del acordeon)',
    selectores: ['.feature-card'],
    motivo: 'a-23/a-24 le escriben la opacidad al abrir y cerrar. Animarlo lo dejaria abierto '
      + 'para siempre en las 14 paginas que lo llevan.',
  },
];

let fallos = 0;
const decir = (ok, msg, detalle = []) => {
  console.log(`  ${ok ? 'ok   ' : 'FALLO'} ${msg}`);
  if (!ok) {
    fallos++;
    for (const d of detalle.slice(0, 8)) console.log(`         ${d}`);
    if (detalle.length > 8) console.log(`         ... y ${detalle.length - 8} mas`);
  }
};

// ---------------------------------------------------------------------------
// 1 · El parche de IX2
// ---------------------------------------------------------------------------
console.log('\n  el parche de webflow.js\n');

const jsPublic = await fs.readFile(path.join(RAIZ, 'public/js/webflow.js'), 'utf8');
const jsDist = await fs.readFile(path.join(DIST, 'js/webflow.js'), 'utf8').catch(() => null);

decir(jsDist !== null, 'webflow.js llega a dist/');
decir(jsDist === jsPublic,
  'el webflow.js construido es el mismo que el de public/ (si no, el build esta rancio)');

const regs = registros(jsPublic);
decir(regs.length === EVENTOS_TOTALES,
  `el blob tiene los ${EVENTOS_TOTALES} registros de evento`, [`leidos: ${regs.length}`]);

const porTipo = {};
const revealsVivos = [];
const vivosSinMedia = [];
for (const r of regs) {
  const cuerpo = jsPublic.slice(r.desde, r.hasta);
  const tipo = cuerpo.match(/eventTypeId:"([A-Z_0-9]+)"/)?.[1] ?? '(sin tipo)';
  porTipo[tipo] = (porTipo[tipo] ?? 0) + 1;
  const mq = cuerpo.match(/mediaQueries:\[([^\]]*)\]/)?.[1];
  if (tipo === 'SCROLL_INTO_VIEW') {
    if (mq !== '') revealsVivos.push(`${r.id}: mediaQueries:[${mq}]`);
  } else if (mq === '') {
    vivosSinMedia.push(`${r.id} (${tipo}) se ha quedado sin mediaQueries`);
  }
}

decir(porTipo.SCROLL_INTO_VIEW === REVEALS,
  `siguen siendo ${REVEALS} eventos SCROLL_INTO_VIEW`, [`leidos: ${porTipo.SCROLL_INTO_VIEW}`]);
decir(revealsVivos.length === 0,
  'los 110 reveals llevan mediaQueries:[] (no se disparan ni aplican estado inicial)', revealsVivos);
/*
 * El parche apaga por tipo de evento. Si el filtro se rompiera y vaciara de mas, se
 * llevaria por delante el nav (48 eventos), los hover (36) y el acordeon (6) — y el
 * sitio seguiria construyendo en verde.
 */
const censoMal = Object.entries(CENSO_VIVOS)
  .filter(([t, n]) => porTipo[t] !== n)
  .map(([t, n]) => `${t}: ${porTipo[t] ?? 0}, se esperaban ${n}`);
decir(censoMal.length === 0, 'los 90 eventos que NO son entrada siguen intactos', censoMal);
decir(vivosSinMedia.length === 0,
  'ninguno de esos 90 se ha quedado sin mediaQueries (el parche no se paso de largo)', vivosSinMedia);

// ---------------------------------------------------------------------------
// 2 · Ningun elemento se queda invisible
// ---------------------------------------------------------------------------
console.log('\n  las 211 paginas construidas\n');

const paginas = (await fs.readdir(DIST, { recursive: true })).filter((f) => f.endsWith('.html'));
decir(paginas.length > 200, `hay paginas que revisar (${paginas.length})`);

const conOpacidad = [];
const conFouc = [];
const htmlCache = new Map();
const uuidsEnHtml = new Set();
const clasesEnHtml = new Set();

for (const rel of paginas) {
  const h = await fs.readFile(path.join(DIST, rel), 'utf8');
  htmlCache.set(rel, h);
  const n = (h.match(/style="opacity:\s*0"/g) ?? []).length;
  if (n) conOpacidad.push(`${rel}: ${n} elemento(s) con opacity:0 en linea`);
  if (h.includes('w-mod-js:not(.w-mod-ix)')) conFouc.push(`${rel}: ha vuelto el bloque anti-FOUC`);
  for (const m of h.matchAll(/data-w-id="([^"]+)"/g)) uuidsEnHtml.add(m[1]);
  for (const c of [...CLASES, ...Object.keys(EXCLUIDOS).filter((k) => k.startsWith('.'))]) {
    if (new RegExp(`class="[^"]*\\b${c.slice(1)}\\b`).test(h)) clasesEnHtml.add(c);
  }
}

decir(conOpacidad.length === 0,
  'cero elementos con style="opacity:0" en linea (los encendia IX2; ya no hay quien)', conOpacidad);
decir(conFouc.length === 0,
  'cero bloques anti-FOUC (decian «invisible hasta que arranque IX2»)', conFouc);
/*
 * La pareja, escrita como igualdad de conjuntos para que siga significando algo si
 * vuelve cualquiera de los dos lados: no puede haber un anti-FOUC sin su reveal de
 * IX2, ni un reveal de IX2 sin su anti-FOUC. Hoy los dos conjuntos son vacios.
 */
decir(conFouc.length === 0 && revealsVivos.length === 0,
  'anti-FOUC y reveal de IX2 van en pareja: los dos conjuntos estan vacios');

// ---------------------------------------------------------------------------
// 3 · El CSS emitido
// ---------------------------------------------------------------------------
console.log('\n  el CSS construido\n');

const dirCss = path.join(DIST, '_astro');
const hojas = (await fs.readdir(dirCss).catch(() => [])).filter((f) => f.endsWith('.css'));
const css = (await Promise.all(hojas.map((f) => fs.readFile(path.join(dirCss, f), 'utf8')))).join('\n');
decir(css.length > 0, 'hay CSS emitido que revisar');

/**
 * Recorre el CSS devolviendo cada regla con las at-rules que la envuelven. Hace falta
 * un recorrido con llaves y no una expresion regular: las entradas viven anidadas
 * dentro de @media (prefers-reduced-motion) y de @media (min-width), y la afirmacion
 * que importa es justamente en QUE bloque esta cada una.
 */
function reglas(txt) {
  const salida = [];
  const pila = [];
  let i = 0; let ini = 0;
  while (i < txt.length) {
    const c = txt[i];
    if (c === '{') {
      const prel = txt.slice(ini, i).trim();
      if (prel.startsWith('@') && !prel.startsWith('@keyframes')) { pila.push(prel); ini = i + 1; i++; continue; }
      let d = 1; let j = i + 1;
      while (j < txt.length && d) { if (txt[j] === '{') d++; else if (txt[j] === '}') d--; j++; }
      const cuerpo = txt.slice(i + 1, j - 1);
      if (prel.startsWith('@keyframes')) salida.push({ prel, cuerpo, at: [...pila], marco: true });
      else salida.push({ prel, cuerpo, at: [...pila], marco: false });
      i = j; ini = i; continue;
    }
    if (c === '}') { pila.pop(); ini = i + 1; i++; continue; }
    i++;
  }
  return salida;
}

const todas = reglas(css);
const entradas = todas.filter((r) => !r.marco && /animation-name:\s*pp-entrada/.test(r.cuerpo));
decir(entradas.length > 0, `hay reglas de entrada en el CSS construido (${entradas.length})`);

const conAtajo = entradas.filter((r) => /[;{]?animation:/.test(r.cuerpo)).map((r) => r.prel.slice(0, 70));
decir(conAtajo.length === 0,
  'ninguna regla de entrada usa el atajo `animation:` (el minificador lo fusiona con '
  + 'animation-timeline y tira la declaracion entera)', conAtajo);

const fueraDeMedia = entradas
  .filter((r) => !r.at.some((a) => /prefers-reduced-motion:\s*no-preference/.test(a)))
  .map((r) => r.prel.slice(0, 70));
decir(fueraDeMedia.length === 0,
  'toda entrada vive dentro de @media (prefers-reduced-motion: no-preference)', fueraDeMedia);

const base = todas.find((r) => !r.marco && /^\[data-pp-reveal\]$/.test(r.prel));
decir(Boolean(base), 'la regla [data-pp-reveal] llega suelta al build (la busca check:blog)');
if (base) {
  decir(/animation-timeline:\s*view\(\)/.test(base.cuerpo), 'y conserva animation-timeline: view()');
  /*
   * Se afirma la AUSENCIA de `cover`, no la presencia de `entry`. La primera version
   * buscaba /entry/ y no vio el fallo al probarla: el minificador compone
   * `animation-range:entry cover 25%`, donde `entry` es el INICIO y el final sigue
   * siendo cover. El diseno no usa `cover` en ningun sitio, asi que la ausencia es
   * una afirmacion exacta y no se deja enganar por la forma del atajo.
   */
}

/*
 * Se afirma la AUSENCIA de `cover` sobre TODAS las reglas que fijan un rango de
 * entrada, no solo sobre [data-pp-reveal]. Dos motivos, los dos aprendidos probando
 * esta puerta rompiendo el codigo:
 *
 *   - Mirar solo `entry` no vale: el minificador compone `animation-range:entry cover
 *     25%`, donde `entry` es el INICIO y el final sigue siendo cover.
 *   - Mirar solo [data-pp-reveal] tampoco: las listas grandes llevan su propio rango,
 *     y ahi es donde estan los 39 uuid y las 18 clases.
 *
 * Con `cover`, un elemento pegado al final del documento nunca llega al final de su
 * rango porque el scroll se acaba antes. Medido: el pie se quedaba a medio encender en
 * las 211 paginas (.wrapper-bar-footer en 0,35, .line-footer en 0,46).
 */
const conCover = todas
  .filter((r) => !r.marco && /animation-range/.test(r.cuerpo) && /cover/.test(r.cuerpo))
  .map((r) => `${r.prel.slice(0, 60)} -> ${r.cuerpo.match(/animation-range[^;}]*/)?.[0]}`);
decir(conCover.length === 0,
  'ninguna regla de entrada usa `cover` en su rango (el pie no llegaria a encenderse)', conCover);

const conRango = todas.filter((r) => !r.marco && /animation-range/.test(r.cuerpo));
decir(conRango.length > 0, `hay reglas que fijan el rango de entrada (${conRango.length})`);

const marcos = todas.filter((r) => r.marco && /pp-entrada/.test(r.prel));
decir(marcos.length === 3, `estan los 3 @keyframes de entrada (${marcos.length})`,
  marcos.map((m) => m.prel));
const sinReposo = marcos.filter((m) => {
  const to = m.cuerpo.match(/(?:^|\})\s*(?:to|100%)\s*\{([^}]*)\}/);
  return !to || !/opacity:\s*1/.test(to[1]) || !/transform:\s*none/.test(to[1]);
}).map((m) => m.prel + ' -> ' + m.cuerpo.slice(-70));
decir(sinReposo.length === 0,
  'los 3 @keyframes terminan en el estado de reposo (opacity:1, transform:none): es lo '
  + 'que salva a los navegadores sin animation-timeline', sinReposo);

// ---------------------------------------------------------------------------
// 4 · La tabla y el CSS no se separan
// ---------------------------------------------------------------------------
console.log('\n  cobertura: scripts/lib/reveals.mjs contra el CSS\n');

const uuidsEnCss = new Set([...css.matchAll(/\[data-w-id=["']?([0-9a-f-]{36})["']?\]/g)].map((m) => m[1]));
const sinReclamar = Object.keys(POR_UUID).filter((u) => !uuidsEnCss.has(u));
decir(sinReclamar.length === 0,
  `los ${Object.keys(POR_UUID).length} uuid de la tabla estan reclamados por el CSS`, sinReclamar);

const deMas = [...uuidsEnCss].filter((u) => !POR_UUID[u]);
decir(deMas.length === 0, 'el CSS no reclama ningun uuid que no este en la tabla', deMas);

const excluidosEnCss = Object.keys(EXCLUIDOS).filter(
  (k) => (k.startsWith('.') ? new RegExp(`\\${k}[^\\w-]`).test(css) && entradas.some((r) => r.prel.includes(k)) : uuidsEnCss.has(k)),
).map((k) => `${k} — ${String(EXCLUIDOS[k]).split('\n')[0].slice(0, 90)}`);
decir(excluidosEnCss.length === 0,
  'ninguno de los excluidos entra (heroe por encima del pliegue, o de IX2)', excluidosEnCss);

const clasesSinRegla = CLASES.filter((c) => !entradas.some((r) => r.prel.includes(c)));
decir(clasesSinRegla.length === 0, `las ${CLASES.length} clases de la tabla tienen regla`, clasesSinRegla);

/*
 * Se exigen los TRES pasos, no «al menos uno». Con «al menos uno» la puerta no vio
 * que se cayera un peldano al probarla: quedaban los otros dos y daba verde, pero el
 * escalonado ya no reparte las columnas como dice el diseno.
 */
const PASOS = [2, 3, 4];
const rejillasSinEscalon = REJILLAS.flatMap((c) => PASOS
  .filter((n) => !todas.some((r) => !r.marco && r.prel.includes(c)
    && new RegExp(`nth-child\\(\\s*4n\\s*\\+\\s*${n}\\s*\\)`).test(r.prel)
    && /animation-range-start/.test(r.cuerpo)))
  .map((n) => `${c}: falta el paso 4n+${n}`));
decir(rejillasSinEscalon.length === 0,
  `las ${REJILLAS.length} rejillas llevan los ${PASOS.length} pasos de escalonado `
  + '(animation-range-start, no animation-delay: el delay se mide CONTRA '
  + 'animation-duration y ataria el escalonado al token del respaldo)', rejillasSinEscalon);

// Los muertos siguen muertos: si uno resucita, necesita una decision, no un silencio.
const resucitados = [...HUERFANOS, ...Object.keys(CUBIERTOS_POR_CLASE)]
  .filter((u) => HUERFANOS.includes(u) && uuidsEnHtml.has(u));
decir(resucitados.length === 0,
  `los ${HUERFANOS.length} data-w-id huerfanos siguen sin aparecer en ninguna pagina`, resucitados);

const clasesMuertas = Object.keys(EXCLUIDOS).filter((k) => k === '.service-steps-content' && clasesEnHtml.has(k));
decir(clasesMuertas.length === 0, '.service-steps-content sigue sin instancias', clasesMuertas);

// ---------------------------------------------------------------------------
// 5 · Las dos colisiones con lo que queda de IX2
// ---------------------------------------------------------------------------
console.log('\n  las dos colisiones con IX2\n');

/**
 * El SUJETO de un selector es su ultimo compuesto: el elemento al que la regla le
 * aplica los estilos. En `.menu .idioma-chevron{transform:...}` el sujeto es
 * .idioma-chevron, no .menu, y esa regla es perfectamente legitima — el nav esta
 * lleno de ellas. Mirar el selector entero daba 6 falsos positivos.
 */
const sujetos = (prel) => prel.split(',')
  .map((s) => s.trim().split(/[\s>+~]+/).filter(Boolean).pop() ?? '');

for (const { que, selectores, motivo } of INTOCABLES) {
  const tocado = todas.filter((r) => !r.marco
    && sujetos(r.prel).some((suj) => selectores.some((s) => (s.startsWith('.')
      ? new RegExp(`\\${s}(?![\\w-])`).test(suj)
      : suj.includes(s))))
    && /(^|[;{\s])(transform|opacity|animation)/.test(r.cuerpo))
    .map((r) => `${r.prel.slice(0, 70)} { ${r.cuerpo.slice(0, 50)} }`);
  decir(tocado.length === 0, `ningun selector propio anima ${que}`, [...tocado, `motivo: ${motivo}`]);
}

console.log(fallos === 0 ? '\n  Todo en verde.\n' : `\n${fallos} fallo(s).\n`);
process.exit(fallos === 0 ? 0 : 1);
