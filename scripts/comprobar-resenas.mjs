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

/** Las marcas que lleva toda plantilla. Si cambian en el JSON, cambian aqui. */
const MARCAS = ['PLANTILLA DE MAQUETA', 'MOCKUP PLACEHOLDER', 'plantilla-1', 'plantilla-2'];
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
  if (MARCAS.some((m) => html.includes(m))) conMarca.push(rel);
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

// En los DOS modos: la cifra que se publica no puede venir de las plantillas.
// Las cuatro plantillas dan media 4,75 sobre 4; la nota real es 5 sobre 27.
const sospechosas = [];
for (const rel of htmls) {
  const html = await fs.readFile(path.join(DIST, rel), 'utf8');
  if (!html.includes('resenas-nota') && !html.includes('resenas-total')) continue;
  // El total publicado no puede ser el numero de plantillas.
  if (/\(\s*4\s*\)/.test(html) && MARCAS.some((m) => html.includes(m))) sospechosas.push(rel);
}
decir(sospechosas.length === 0,
  'la nota agregada no sale del recuento de plantillas', sospechosas);

console.log(fallos ? `\n${fallos} fallo(s).\n` : '\nsin fallos.\n');
process.exit(fallos ? 1 : 0);
