#!/usr/bin/env node
/**
 * Normaliza los iconos de «Como funciona» y monta la fila para aprobarla mirando.
 *
 *     node scripts/integrar-iconos.mjs            juzga y monta. NO escribe.
 *     node scripts/integrar-iconos.mjs --aplicar  normaliza y escribe.
 *
 * ───────────────────────────────────────────────────────────────────────────────
 * QUE HACE LA NORMALIZACION, Y POR QUE NO SE HACE A OJO
 *
 * Los cuatro primeros iconos ocupaban el 70, el 81, el 86 y el 84 % de su caja. En
 * fila, el ojo lee eso como cuatro iconos de sitios distintos. La correccion es
 * mecanica y son dos numeros:
 *
 *   - una `transform="translate(tx ty) scale(k)"` sobre el `<g>` que lleva el contenido
 *     al 85 % de la caja y lo centra;
 *   - `stroke-width = 3.2 / k`, para que el trazo RENDERIZADO sea 3,2 en todos. Sin
 *     dividir, escalar el mas pequeño le engorda el trazo un 22 % frente a sus vecinos.
 *
 * EL `viewBox` NO SE TOCA. Cambiarlo alteraria el tamaño intrinseco del SVG y dejaria
 * desactualizado `img-dim.json`, que es la puerta que caza esto — pero solo despues de
 * commitear.
 *
 * SE MIDE SOBRE EL RENDER Y SE ITERA. La caja de tinta incluye el trazo, y el trazo no
 * escala con la geometria (justo porque se divide): asi que la primera pasada no cae
 * exacta. Se repite hasta que entra en tolerancia, que son dos o tres vueltas.
 *
 * ───────────────────────────────────────────────────────────────────────────────
 * LO QUE ESTE SCRIPT NO PUEDE HACER, DICHO CLARO
 *
 * LA PUERTA NO SABE SI EL DIBUJO SIGNIFICA LO QUE PONE AL LADO. Mide geometria: nada
 * mas. Un candado precioso junto a «Where The Water Goes» pasa las seis medidas con
 * nota. Por eso se monta la fila de cada ficha —los cuatro a 50 px REALES, sobre el
 * crema de `why-choose-section`, con su `<h3>` al lado— y por eso no se escribe nada
 * sin `--aplicar`. Hay que mirarlos uno a uno.
 *
 * Es la misma cicatriz que ya documenta `integrar-cta.mjs` por el otro lado: antes de
 * estos, §5 llevaba un DIPLOMA junto a «Full Rotation» y un MALETIN junto a «The Motor
 * Is Serviceable». Se veian —eso era cierto— y no significaban nada de lo que ponia
 * al lado.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { CONTRATO, listarIconos, medirTinta, juzgarIcono } from './comprobar-iconos.mjs';
import { FICHAS } from './lib/fichas.mjs';

const APLICAR = process.argv.includes('--aplicar');
const RAIZ = path.resolve(import.meta.dirname, '..');
const IMAGENES = path.join(RAIZ, 'public/images');
const MONTAJES = path.join(RAIZ, 'auditoria-imagenes/iconos');

/** Deja el `<g>` sin transform y con el trazo base, que es el estado medible. */
const desnudar = (svg) => svg
  .replace(/\s*transform="[^"]*"/, '')
  .replace(/stroke-width="[-\d.]+"/, `stroke-width="${CONTRATO.TRAZO}"`);

/** Escribe una transform y su trazo compensado sobre un SVG desnudo. */
const vestir = (svg, k, tx, ty) => svg
  .replace('<g ', `<g transform="translate(${tx.toFixed(2)} ${ty.toFixed(2)}) scale(${k.toFixed(4)})" `)
  .replace(/stroke-width="[-\d.]+"/, `stroke-width="${(CONTRATO.TRAZO / k).toFixed(2)}"`);

/**
 * Normaliza al 85 % centrado. Itera porque el trazo no escala con la geometria.
 *
 * SE RECENTRA EN CADA VUELTA, y no al final. La primera version escalaba respecto al
 * ORIGEN y solo centraba al terminar: con un dibujo centrado en (25,25) y una escala
 * de 2,7 el contenido se iba FUERA del viewBox, el render lo recortaba, y lo que se
 * media era el recorte —siempre ~50, o sea el borde de la caja—. La realimentacion
 * quedaba ciega y el bucle se estancaba: un icono se quedo en el 77,4 % y `check:iconos`
 * lo caza, pero el script lo escribia igual una y otra vez sin converger.
 *
 * Recentrando dentro del bucle, lo que se mide es siempre el dibujo entero.
 */
async function normalizar(svg) {
  const base = desnudar(svg);
  const objetivo = CONTRATO.OCUPACION * CONTRATO.LADO;
  const centrado = async (k) => {
    // Medir con la escala aplicada y el contenido traido al centro, para que nada
    // caiga fuera del viewBox y el recorte no falsee la medida.
    const previa = await medirTinta(vestir(base, k, 0, 0));
    if (!previa) throw new Error('el SVG no pinta un solo pixel');
    const svgCentrado = vestir(base, k, CONTRATO.LADO / 2 - previa.cx, CONTRATO.LADO / 2 - previa.cy);
    return { svg: svgCentrado, t: await medirTinta(svgCentrado) };
  };
  let k = 1;
  let ultimo = await centrado(k);
  for (let vuelta = 0; vuelta < 12; vuelta++) {
    const lado = Math.max(ultimo.t.ancho, ultimo.t.alto);
    if (Math.abs(lado - objetivo) < 0.05) break;
    k *= objetivo / lado;
    ultimo = await centrado(k);
  }
  // Afinado final del centro. `centrado()` calcula el desplazamiento a partir de una
  // medida hecha SIN centrar, que con escalas grandes viene recortada por el viewBox y
  // deja un resto de decimas. Aqui se mide lo que de verdad se va a escribir y se
  // corrige sobre eso; dos pasadas bastan.
  let tx = CONTRATO.LADO / 2, ty = CONTRATO.LADO / 2;
  const previa = await medirTinta(vestir(base, k, 0, 0));
  tx -= previa.cx; ty -= previa.cy;
  for (let vuelta = 0; vuelta < 3; vuelta++) {
    const t = await medirTinta(vestir(base, k, tx, ty));
    const dx = CONTRATO.LADO / 2 - t.cx, dy = CONTRATO.LADO / 2 - t.cy;
    if (Math.abs(dx) < 0.05 && Math.abs(dy) < 0.05) break;
    tx += dx; ty += dy;
  }
  return vestir(base, k, tx, ty);
}

/** Los cuatro iconos que usa cada ficha, para montar la fila que se aprueba. */
const filasDeFicha = () => Object.entries(FICHAS).map(([slug, f]) => ({
  slug,
  celdas: f.comoFunciona.celdas.map(([icono, titulo]) => ({
    fichero: icono.split('/').pop(), titulo,
  })),
}));

const dims = JSON.parse(await fs.readFile(path.join(RAIZ, 'src/lib/img-dim.json'), 'utf8'));
const iconos = await listarIconos();
console.log(`\n  ${iconos.length} iconos · ${APLICAR ? 'APLICANDO' : 'solo juzgando (usa --aplicar para escribir)'}\n`);

let tocados = 0;
for (const nombre of iconos) {
  const ruta = path.join(IMAGENES, nombre);
  const svg = await fs.readFile(ruta, 'utf8');
  const antes = await juzgarIcono(nombre, svg, dims);
  const soloDims = antes.every((m) => m.includes('img-dim.json'));
  if (!antes.length || soloDims) {
    console.log(`  ok      ${nombre.padEnd(26)} ya cumple${soloDims ? ' (falta medir:imagenes)' : ''}`);
    continue;
  }
  const nuevo = await normalizar(svg);
  const t = await medirTinta(nuevo);
  const ocupa = (Math.max(t.ancho, t.alto) / CONTRATO.LADO) * 100;
  console.log(`  ${APLICAR ? 'escrito' : 'ajusta '} ${nombre.padEnd(26)} -> ocupa ${ocupa.toFixed(1)} %`);
  for (const m of antes) console.log(`           antes: ${m}`);
  if (APLICAR) { await fs.writeFile(ruta, nuevo); tocados++; }
}

// ── el montaje: los cuatro de cada ficha, a 50 px reales, sobre el crema de §5 ─────
await fs.mkdir(MONTAJES, { recursive: true });
const CREMA = { r: 255, g: 251, b: 240 };
for (const fila of filasDeFicha()) {
  const ALTO = 150, ANCHO = 380;
  const trozos = [];
  for (let i = 0; i < fila.celdas.length; i++) {
    const c = fila.celdas[i];
    let svg;
    try { svg = await fs.readFile(path.join(IMAGENES, c.fichero), 'utf8'); } catch { continue; }
    // 50 px REALES: el tamaño al que lo pinta `.why-choose-icon`. Ampliar para mirar
    // seria juzgar un icono que nadie va a ver asi.
    const png = await sharp(Buffer.from(svg), { density: 384 }).resize(50, 50).png().toBuffer();
    trozos.push({ input: png, left: i * ANCHO + 24, top: 34 });
  }
  if (!trozos.length) continue;
  const salida = path.join(MONTAJES, `${fila.slug}.png`);
  await sharp({ create: { width: ANCHO * fila.celdas.length, height: ALTO, channels: 3, background: CREMA } })
    .composite(trozos).png().toFile(salida);
  console.log(`\n  montaje -> auditoria-imagenes/iconos/${fila.slug}.png`);
  fila.celdas.forEach((c, i) => console.log(`     ${i + 1}. ${c.fichero.padEnd(26)} ${c.titulo}`));
}

console.log(`\n  ${tocados} escritos.${APLICAR ? ' Corre `npm run medir:imagenes` y MIRA el montaje.' : ''}\n`);
