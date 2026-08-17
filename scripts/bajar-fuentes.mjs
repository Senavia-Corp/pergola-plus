#!/usr/bin/env node
/**
 * Baja Inter de Google Fonts a public/fonts/ y escribe su CSS.
 *
 *     node scripts/bajar-fuentes.mjs
 *
 * POR QUE AUTOALOJARLA
 *
 * El sitio cargaba la fuente con `webfont.js` de ajax.googleapis.com, en el <head> y
 * SIN defer, en las 113 paginas. Eso son, en ese orden:
 *
 *   1. una peticion a un tercero que BLOQUEA el render,
 *   2. ~20 KB de JavaScript ejecutandose antes de pintar nada,
 *   3. y solo entonces la peticion real de la fuente a fonts.gstatic.com.
 *
 * O sea: dos saltos de red y una ejecucion de JS antes de que se vea una letra. Con
 * los archivos en nuestro dominio hay UN salto, sin JS, con `font-display: swap` y
 * con `preload` del peso que de verdad se usa primero.
 *
 * Y de paso se va una dependencia de Google: ni webfont.js, ni fonts.googleapis.com,
 * ni fonts.gstatic.com. Ninguna peticion a terceros para ver el texto.
 *
 * QUE SE BAJA Y QUE NO
 *
 * Solo `latin` y `latin-ext`. La respuesta de Google trae ademas cyrillic,
 * cyrillic-ext, greek y vietnamese: son 20 archivos mas para un sitio en ingles y
 * espanol. latin-ext se queda porque cubre las tildes y la enye.
 *
 * Se ejecuta A MANO, no en el build: los .woff2 se versionan (~340 KB los diez) para
 * que el despliegue no dependa de que Google conteste.
 */
import fs from 'node:fs/promises';
import path from 'node:path';

const RAIZ = path.resolve(import.meta.dirname, '..');
const DESTINO = path.join(RAIZ, 'public/fonts');
const CSS = path.join(RAIZ, 'src/styles/fuentes.css');

const PESOS = [300, 400, 500, 600, 700];
const SUBCONJUNTOS = new Set(['latin', 'latin-ext']);

// El User-Agent decide el formato que sirve Google. Con uno moderno da woff2, que es
// ~30% mas pequeno que woff y lo entienden todos los navegadores desde 2016.
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
  + ' (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

const url = `https://fonts.googleapis.com/css2?family=Inter:wght@${PESOS.join(';')}&display=swap`;
const css = await (await fetch(url, { headers: { 'user-agent': UA } })).text();

await fs.mkdir(DESTINO, { recursive: true });

// Cada bloque viene precedido de un comentario con el nombre del subconjunto.
const bloques = css.split('/*').slice(1);
const reglas = [];
let bajados = 0, total = 0;

for (const bloque of bloques) {
  const subconjunto = bloque.slice(0, bloque.indexOf('*/')).trim();
  if (!SUBCONJUNTOS.has(subconjunto)) continue;

  const peso = bloque.match(/font-weight:\s*(\d+)/)?.[1];
  const remota = bloque.match(/src:\s*url\((https:[^)]+)\)/)?.[1];
  const rango = bloque.match(/unicode-range:\s*([^;]+);/)?.[1];
  if (!peso || !remota) continue;

  const nombre = `inter-${subconjunto}-${peso}.woff2`;
  const destino = path.join(DESTINO, nombre);
  if (!await fs.stat(destino).catch(() => null)) {
    const r = await fetch(remota, { headers: { 'user-agent': UA } });
    if (!r.ok) throw new Error(`${nombre}: HTTP ${r.status}`);
    await fs.writeFile(destino, Buffer.from(await r.arrayBuffer()));
    bajados++;
  }
  total += (await fs.stat(destino)).size;

  reglas.push(
    '@font-face {\n'
    + "  font-family: 'Inter';\n"
    + '  font-style: normal;\n'
    + `  font-weight: ${peso};\n`
    // swap: el texto se ve YA con la fuente de sistema y cambia cuando llega Inter.
    // Sin esto hay hasta 3 s de texto invisible, que es peor que un cambio de fuente.
    + '  font-display: swap;\n'
    + `  src: url('/fonts/${nombre}') format('woff2');\n`
    + `  unicode-range: ${rango};\n`
    + '}',
  );
}

const cabecera = `/* Inter, autoalojada. GENERADO por scripts/bajar-fuentes.mjs — no editar a mano.
 *
 * Sustituye a webfont.js de ajax.googleapis.com, que iba en el <head> y sin defer en
 * las 113 paginas: bloqueaba el render, ejecutaba ~20 KB de JavaScript y solo despues
 * pedia la fuente a otro dominio. Ahora es una peticion, al nuestro, sin JavaScript.
 *
 * Solo latin y latin-ext: el sitio es en ingles y espanol. latin-ext cubre las tildes
 * y la enye.
 */\n\n`;

await fs.writeFile(CSS, cabecera + reglas.join('\n\n') + '\n', 'utf8');

console.log(`  ${reglas.length} @font-face · ${bajados} archivos nuevos · ${(total / 1024).toFixed(0)} KB en total`);
console.log('  -> public/fonts/ + src/styles/fuentes.css');
