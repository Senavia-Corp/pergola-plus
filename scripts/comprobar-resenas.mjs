#!/usr/bin/env node
/**
 * Puerta de las resenas. Sobre dist/, DESPUES de `npm run build`.
 *
 *     npm run check:resenas
 *
 * QUE IMPIDE
 *
 * Que una tarjeta de MAQUETA acabe publicada como si fuera el testimonio de un
 * cliente. `src/data/reviews-plantilla.json` existe para poder ver el carrusel
 * montado antes de enchufar la API de Google Business Profile, y `getReviews()` ya
 * las apaga con `PUBLIC_ES_PRODUCCION=1`. Esta puerta comprueba que de verdad se
 * apagaron, en la SALIDA, que es lo unico que se publica.
 *
 * POR QUE MERECE UNA PUERTA PROPIA
 *
 * En este repo el verde de las puertas ya paso una vez con el hero español
 * publicado en ingles: "deberia ser imposible" no es lo mismo que "esta comprobado".
 * Y el coste del fallo aqui no es cosmetico — en EE. UU. las resenas y testimonios
 * inventados estan sancionados por la FTC (16 CFR Part 465, en vigor desde octubre
 * de 2024) con multa civil POR INFRACCION. Es la clase de defecto que no se nota
 * mirando la pagina, porque una plantilla bien maquetada se ve exactamente igual de
 * bien que una resena de verdad.
 *
 * COMPRUEBA LOS DOS MODOS, como comprobar-noindex.mjs:
 *   - con PUBLIC_ES_PRODUCCION=1  -> CERO rastro de maqueta en todo dist/
 *   - sin ella                    -> si hay maqueta, tiene que llevar su aviso visible
 *
 * Y en los dos: la nota agregada que se publica NO puede salir de las plantillas.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { raizHtml } from './lib/dist.mjs';

const DIST = await raizHtml();
const ES_PRODUCCION = process.env.PUBLIC_ES_PRODUCCION === '1';

/**
 * La marca es ESTRUCTURAL, no textual.
 *
 * La primera version buscaba las cadenas «PLANTILLA DE MAQUETA» y «MOCKUP
 * PLACEHOLDER» dentro del HTML. Duro exactamente hasta que el relleno paso a ser
 * lorem ipsum: la puerta se quedo mirando unas palabras que ya no existian y habria
 * salido en VERDE con la maqueta publicada.
 *
 * Lo que de verdad define «hay maqueta publicada» no es una palabra: es que se
 * pinten SLIDES DE CARRUSEL sin que haya ni una resena real en el snapshot. Eso no
 * cambia aunque el relleno se reescriba mañana en otro idioma.
 */
const SLIDE = /<div[^>]*fs-slider-element="slide"[^>]*fs-slider-resenas_slide/;
const RESENAS_REALES = JSON.parse(
  await fs.readFile(new URL('../src/data/reviews-google.json', import.meta.url), 'utf8'),
).resenas.length;
/* El ELEMENTO, no el nombre de la clase a secas: Astro incrusta el CSS en el HTML,
   asi que `resenas-maqueta` aparece en las 217 paginas dentro de un <style> aunque no
   se pinte ni un aviso. Buscar la clase pelada daba 39 falsos positivos — y una
   puerta que grita donde no hay nada se acaba ignorando, que es peor que no tenerla. */
const AVISO = 'class="resenas-maqueta"';

let fallos = 0;
const decir = (ok, msg, detalle = []) => {
  console.log(`  ${ok ? 'ok   ' : 'FALLO'} ${msg}`);
  if (!ok) {
    fallos++;
    for (const d of detalle.slice(0, 8)) console.log(`         ${d}`);
    if (detalle.length > 8) console.log(`         ... y ${detalle.length - 8} mas`);
  }
};

const htmls = (await fs.readdir(DIST, { recursive: true })).filter((p) => p.endsWith('.html'));
// Una puerta que no encuentra ficheros sale en verde sin haber comprobado nada.
if (!htmls.length) {
  console.log('  FALLO no hay HTML en dist/: corre `npm run build` antes');
  process.exit(1);
}

const conMarca = [];
const conAviso = [];
for (const rel of htmls) {
  const html = await fs.readFile(path.join(DIST, rel), 'utf8');
  if (RESENAS_REALES === 0 && SLIDE.test(html)) conMarca.push(rel);
  if (html.includes(AVISO)) conAviso.push(rel);
}

console.log(`\n[resenas] ${htmls.length} paginas · modo ${ES_PRODUCCION ? 'PRODUCCION' : 'provisional'}`);

if (ES_PRODUCCION) {
  decir(conMarca.length === 0,
    'con PUBLIC_ES_PRODUCCION=1 no se publica ni una tarjeta de maqueta', conMarca);
  decir(conAviso.length === 0,
    'con PUBLIC_ES_PRODUCCION=1 tampoco se publica el aviso de maqueta', conAviso);
} else {
  // Sin produccion la maqueta PUEDE estar; lo que no puede es estar CALLADA.
  const mudas = conMarca.filter((p) => !conAviso.includes(p));
  decir(mudas.length === 0,
    'toda pagina con tarjetas de maqueta lleva su aviso visible', mudas);
}

// En los DOS modos: la cifra publicada no puede salir del recuento de la maqueta.
// La maqueta tiene 4 tarjetas; la nota real es 5,0 sobre 27. Si alguna pagina con
// maqueta anunciara «(4)», significaria que getResumen() se ha puesto a contar
// tarjetas de relleno — que es el fallo caro que el rodeo de getPlantillas() evita.
const sospechosas = [];
for (const rel of conMarca) {
  const html = await fs.readFile(path.join(DIST, rel), 'utf8');
  if (/resenas-total[^>]*>\(\s*4\s*\)/.test(html)) sospechosas.push(rel);
}
decir(sospechosas.length === 0,
  'la nota agregada no sale del recuento de la maqueta', sospechosas);

console.log(fallos ? `\n${fallos} fallo(s).\n` : '\nsin fallos.\n');
process.exit(fallos ? 1 : 0);
