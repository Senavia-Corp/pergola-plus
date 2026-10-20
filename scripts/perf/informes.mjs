#!/usr/bin/env node
/**
 * 03-SONDA-REGRESION.md y 04-DIFF-VISUAL.md a partir de las carpetas de fase.
 *
 *     node scripts/perf/informes.mjs implementation-reports/PERF-100-2026-10
 */
import fs from 'node:fs/promises';
import path from 'node:path';

const RAIZ = process.argv[2];
const fases = (await fs.readdir(RAIZ, { withFileTypes: true })).filter((d) => d.isDirectory() && /^\d\d-/.test(d.name)).map((d) => d.name).sort();
const leer = async (f) => JSON.parse(await fs.readFile(f, 'utf8').catch(() => 'null'));

// --- 03 · sonda ------------------------------------------------------------
const filas = [];
for (const fase of fases) {
  const r = await leer(path.join(RAIZ, fase, 'sonda-resumen.json'));
  if (!r) continue;
  const reg = await fs.readFile(path.join(RAIZ, fase, 'sonda-regresiones.txt'), 'utf8').catch(() => '');
  const lineas = reg.split('\n').filter(Boolean);
  const soloTurnstile = lineas.length && lineas.every((l) => /consola/.test(l) && /contact-us/.test(l));
  filas.push({ fase, r, regresiones: lineas.length, soloTurnstile });
}
const md3 = [
  '# 03 — Sonda funcional de regresión (Playwright)', '',
  '22 rutas × 320/375/768/1440 (`isMobile` + `hasTouch` por debajo de 768) + una pasada con `reducedMotion: reduce` en la home, por fase, sobre el build de producción simulada. Cada fila compara con la fase anterior (`sonda-regresiones.txt`). `scripts/perf/sonda.mjs`.', '',
  '| Fase | Cargas | 200/404 ok | H1 único | Overflow 0 | `<main>` | Skip link (primer foco) | Menú móvil abre/foco/inert/Esc/foco-botón | Dropdown abre/aria/visible/hover/Esc | Paradas sin anillo | Sobredim. 375 / 1440 | Vídeo 8 s | Reduced motion | Consola | Regresiones vs anterior |',
  '|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|',
  ...filas.map(({ fase, r, regresiones, soloTurnstile }) => `| ${fase} | ${r.cargas} | ${r.status200} | ${r.h1Unico} | ${r.sinOverflow} | ${r.conMain} | ${r.conSkip} (${r.skipPrimero}) | ${r.menu.abre}/${r.menu.focoDentro}/${r.menu.inert}/${r.menu.escape}/${r.menu.focoBoton ?? '-'} de ${r.menu.total} | ${r.dropdown.abre}/${r.dropdown.expanded}/${r.dropdown.visible}/${r.dropdown.hover}/${r.dropdown.escape} de ${r.dropdown.total} | ${r.sinAnillo} | ${r.sobredim375} / ${r.sobredim1440} | ${r.videoReproduce.split(' ').every((v) => v.endsWith(':si')) ? 'reproduce 8/8' : r.videoReproduce} | ${r.videoReducido || '-'} | ${r.consola} | ${regresiones}${soloTurnstile ? ' (solo recuento de Turnstile en contacto)' : ''} |`),
  '',
  'Lecturas:', '',
  '- **Baseline (00)**: sin enlace de salto (0/90), 1 parada sin anillo por ruta en la FAQ (`input.pp-faq-input`), 9 imágenes sobredimensionadas a 375 y 125 a 1440 (sin contar SVG), menú 67/67 y dropdown 23/23 ya con webflow.js.',
  '- **Desde F1**: 0 sobredimensionadas a 375 y 1440 (a 768 quedan las 10 tarjetas de producto de la home: `product-card-image` es 2 columnas en la home y 1 en `/products/`, y el `sizes` compartido toma el mayor para no servir borroso el índice).',
  '- **Desde F4**: enlace de salto en 90/90 y primer foco; 0 paradas sin anillo.',
  '- **Consola**: los 53–56 mensajes son todos de la página de presupuesto y contacto a 1440: Turnstile (`No available adapters`, su propia CSP `data:,`, el error 600010 de `localhost`) y varían de una carga a otra. No hay ningún mensaje propio del sitio ni de la CSP de F6.',
  '- **Hover del mega-menú**: 23/23 con ratón (IX2). Con teclado (`focoPreview`) 0/23: IX2 solo escucha `mouseover`; se anota para el día que se sustituya webflow.js (F7, no hecho).',
  '- **Filas cortas**: 03-f3 se midió solo en la home EN/ES (lo único que cambió: el vídeo); el JSON de 04-f4 es el de una pasada parcial posterior (4 rutas × 2 anchos) que pisó el de la pasada completa, cuyos valores quedaron en `05-A11Y-WCAG22.md` (90 cargas: salto 90/90, 0 paradas sin anillo, menú 67/67, dropdown 23/23). La pasada final (08-f8) vuelve a ser completa.',
  '- Lo que la sonda NO mide: lector de pantalla, el paso exacto de las flechas de los carruseles (`carrusel-qa`, a petición) y la reproducción real del vídeo fuera de Chromium.',
  '',
].join('\n');
await fs.writeFile(path.join(RAIZ, '03-SONDA-REGRESION.md'), md3);

// --- 04 · diff visual ------------------------------------------------------
const md4 = ['# 04 — Diff visual por fase', '',
  'Capturas de página completa a 375/768/1440 de las 22 rutas de la sonda, tomadas con `prefers-reduced-motion: reduce`, tras recorrer la página para disparar las imágenes `lazy` y esperar a que **todas** estén `complete`, con animaciones y transiciones congeladas. Cada fase se compara con la anterior píxel a píxel (umbral 24/255 por canal; `scripts/perf/diff-visual.mjs`).', '',
  '**Qué decide.** La captura **sin fotos** (las `<img>` raster y el vídeo con `visibility:hidden`, la caja se queda): una foto servida a otro tamaño cambia píxeles por remuestreo sin cambiar nada de lo que importa (maquetación, texto, color, bordes), y ningún umbral lo separa; medido en F1: con fotos 26/60 capturas superaban el 1 % (hasta 6 %) y todo el exceso estaba dentro de las fotos. Se guardan las dos variantes; las PNG no van a git (183 MB por tanda), sí los informes y los PNG de las diferencias que superan el límite (`diff-png/`).', '',
  '| Comparación | Capturas | > 1 % (sin fotos) | Cuáles y por qué |', '|---|---|---|---|',
];
const motivo = {
  '01-f1': 'proyecto 375: las 87 filas superiores (el nav en estado «scroll» de IX2 en la captura del baseline, en reposo en la de F1). Del píxel 87 abajo, 0 %.',
  '02-f2': 'categoría del blog 768: las mismas 87 filas del nav. (Antes de este resultado el diff cazó dos regresiones reales de la purga, corregidas antes del commit: el compactador rompía `html[lang=es] :is(…)` y la purga se llevaba el paso a paso del multipaso.)',
  '03-f3': 'categoría del blog 768: nav en estado «scroll».',
  '04-f4': 'proyecto 375: nav en estado «scroll». Los cambios de F4 (velo 50→56 %, pestañas .65→.7, contador y fecha) quedan por debajo del 1 % a 1/4 de resolución.',
  '05-f5': 'páginas de ciudad a 375 y 768: la línea nueva de ciudades hermanas (+68–91 px de alto). Cambio visible y documentado (07 §8).',
  '06-f6': 'categoría del blog 768: nav en estado «scroll».',
  '08-f8': 'proyecto 375 y categoría del blog 768: las 87 filas del nav en estado «scroll». Los cambios de F8 (candidato de 800 px en los heroes, scroll-padding) no mueven un píxel.',
};
let anterior = null;
for (const fase of fases) {
  const txt = await fs.readFile(path.join(RAIZ, fase, 'diff-visual.md'), 'utf8').catch(() => null);
  if (!txt) { anterior = fase; continue; }
  const total = txt.match(/\*\*(\d+) capturas, (\d+) por encima/);
  const malas = [...txt.matchAll(/^\| (\S+) \| ([\d.]+) \| ([\d.]+) \|/gm)].filter((m) => Number(m[3]) > 1).map((m) => `${m[1].replace('-sinfotos.png', '')} ${m[3]} %`);
  md4.push(`| ${anterior} → ${fase} | ${total?.[1] ?? '?'} | ${total?.[2] ?? '?'} | ${malas.join(', ') || '—'}${motivo[fase] ? ` — ${motivo[fase]}` : ''} |`);
  anterior = fase;
}
md4.push('', 'El estado «scroll» del nav lo pone IX2 (`PAGE_SCROLL_DOWN`: `translateY(-85px)` + opacidad 0 en 500 ms) cuando la captura vuelve arriba justo después de recorrer la página; afecta solo a las 87 primeras filas y no es un cambio del sitio. Es la única diferencia recurrente en todas las fases.', '');
await fs.writeFile(path.join(RAIZ, '04-DIFF-VISUAL.md'), md4.join('\n'));
console.log('03 y 04 escritos');
