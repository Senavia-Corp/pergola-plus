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
import { clasesDeCita } from '../src/lib/resenas-tramos.mjs';

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
const SNAPSHOT = JSON.parse(
  await fs.readFile(new URL('../src/data/reviews-google.json', import.meta.url), 'utf8'),
);
const RESENAS_REALES = SNAPSHOT.resenas.length;
/* Snapshot PARCIAL: hay resenas de verdad, pero solo una parte de las del perfil.
   Mientras dure, la cifra que se publica sale de `resumenPublico` y no de contar
   tarjetas — y eso hay que comprobarlo en la SALIDA, no confiarlo al codigo. */
const PARCIAL = SNAPSHOT.parcial === true && RESENAS_REALES > 0;
const TOTAL_PERFIL = SNAPSHOT.resumenPublico?.total ?? null;
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

/* ── SNAPSHOT PARCIAL ──────────────────────────────────────────────────────────
 *
 * Todo lo de arriba cuelga de `RESENAS_REALES === 0`, o sea que en cuanto entro
 * una sola resena de verdad esta puerta dejo de comprobar NADA. Lo que puede salir
 * mal con 5 resenas cargadas de un perfil de 28 es distinto y no es cosmetico:
 *
 *   1. Que se publique «(5)» en vez de «(28)». getResumen() calculaba la media
 *      sobre las resenas cargadas, asi que sin el flag `parcial` la web le borra 23
 *      resenas al cliente sin que se note mirando la pagina.
 *   2. Que se siga afirmando «no se filtra ninguna» siendo falso. Es una frase EN
 *      PANTALLA sobre como se eligen las resenas, y la politica de Google pide
 *      justo eso: decir como se ordenan y filtran.
 */
if (PARCIAL) {
  const conTarjetas = [];
  const cifraMal = [];
  const afirmaTodas = [];
  for (const rel of htmls) {
    const html = await fs.readFile(path.join(DIST, rel), 'utf8');
    if (!SLIDE.test(html)) continue;
    conTarjetas.push(rel);
    const m = html.match(/class="resenas-total"[^>]*>\((\d+)\)/);
    if (!m || Number(m[1]) !== TOTAL_PERFIL) {
      cifraMal.push(`${rel} -> ${m ? `(${m[1]})` : 'sin cifra'}`);
    }
    if (/None are filtered out|No se filtra ninguna/.test(html)) afirmaTodas.push(rel);
  }
  // Sin paginas que las publiquen no hay nada medido, y eso NO es un aprobado.
  decir(conTarjetas.length > 0,
    `hay ${RESENAS_REALES} resenas cargadas y alguna pagina las publica`, []);
  decir(cifraMal.length === 0,
    `la cifra publicada es la del perfil (${TOTAL_PERFIL}), no el numero de tarjetas`, cifraMal);
  decir(afirmaTodas.length === 0,
    'con snapshot parcial ninguna pagina afirma «no se filtra ninguna»', afirmaTodas);
}

/* ── TRAMOS DE LA CITA ─────────────────────────────────────────────────────────
 *
 * Que la cita corta lleve su clase no es cosmetico y por eso se comprueba en la
 * SALIDA. Todas las tarjetas se estiran hasta la mas alta, asi que sin ese
 * tratamiento la resena de 20 caracteres volvia a dejar 228px en blanco de sus
 * 258 —el 88% de la tarjeta— y la fila se veia rota. Es ademas la clase de
 * regresion que no da error ni rompe ningun build: alguien reescribe el markup
 * del blockquote, se lleva el `class:list` por delante y la pagina sigue
 * construyendo perfectamente, solo que fea.
 *
 * Se cuenta por COMBINACION exacta de clases, no «hay alguna destacada»: contar
 * apariciones sueltas dejaria pasar que todas las citas cayeran en el mismo tramo.
 */
if (RESENAS_REALES > 0) {
  const esperado = new Map();
  for (const r of SNAPSHOT.resenas) {
    const clave = ['resena-texto', ...clasesDeCita(r.texto)].join(' ');
    esperado.set(clave, (esperado.get(clave) ?? 0) + 1);
  }

  // Una pagina cualquiera de las que publican el carrusel: todas llevan las mismas.
  let muestra = null;
  for (const rel of htmls) {
    const html = await fs.readFile(path.join(DIST, rel), 'utf8');
    if (SLIDE.test(html)) { muestra = { rel, html }; break; }
  }

  if (!muestra) {
    decir(false, 'hay una pagina con el carrusel donde comprobar los tramos de la cita');
  } else {
    const visto = new Map();
    for (const m of muestra.html.matchAll(/class="(resena-texto[^"]*)"/g)) {
      visto.set(m[1], (visto.get(m[1]) ?? 0) + 1);
    }
    const desajustes = [];
    for (const [clave, n] of esperado) {
      const hay = visto.get(clave) ?? 0;
      if (hay !== n) desajustes.push(`«${clave}»: esperadas ${n}, en la salida ${hay}`);
    }
    for (const clave of visto.keys()) {
      if (!esperado.has(clave)) desajustes.push(`«${clave}» sobra en la salida`);
    }
    decir(desajustes.length === 0,
      `cada cita lleva la clase de su tramo de longitud (${muestra.rel})`, desajustes);
  }
}

/* ── LA BANDA Y EL CARRUSEL ────────────────────────────────────────────────────
 *
 * QUE SE ROMPIO. El sitio migrado trae de Webflow una banda titulada «Reviews &
 * Testimonials / What Clients Say About Our Work», con su entradilla y su boton
 * «Read Client Reviews». Es el hueco donde vivia el widget de Elfsight. Al retirarlo,
 * 60 paginas —las 50 landing locales, 6 de condado y 4 de about-us— se quedaron
 * prometiendo resenas y sirviendo aire: la banda declara 8rem de padding arriba y
 * abajo, o sea media pantalla en blanco bajo un titular que promete testimonios.
 *
 * Y donde el carrusel SI estaba —home y contacto— iba colgado al FINAL del documento,
 * a 22 KB de markup de la promesa. Resultado: DOS secciones de Reviews, la blanca de
 * Webflow vacia arriba y una crema abajo con las tarjetas. Eso es lo que se reporto.
 *
 * POR QUE ESTRUCTURAL Y NO POR TEXTO. El primer diagnostico de esto se hizo buscando
 * «What Clients Say About Our Work» y su equivalente español. El español —«Lo que
 * dicen nuestros clientes sobre…»— es tambien el submenu «Casos de exito» del NAV, o
 * sea que esta en las 108 paginas españolas tengan banda o no: daba 147 paginas con
 * banda y 117 huerfanas donde hay 78 y 60. Una puerta que se creyera ese texto
 * denunciaria 57 paginas inocentes y se acabaria ignorando, que es peor que no
 * tenerla. La banda es un ELEMENTO y se busca como elemento.
 */
{
  const BANDA = '<section class="reviews"';
  const PROPIA = '<section class="resenas"';
  const EMBEBIDA = 'class="resenas-embebida"';

  /** Fin de la banda, contando anidamiento: dentro hay mas <section> en algunas. */
  const finDeBanda = (html, desde) => {
    let hondo = 0;
    const rx = /<section\b|<\/section>/g;
    rx.lastIndex = desde;
    for (let m; (m = rx.exec(html)); ) {
      hondo += m[0][1] === '/' ? -1 : 1;
      if (hondo === 0) return rx.lastIndex;
    }
    return -1;
  };

  const conBanda = [];
  const huerfanas = [];
  const dobles = [];
  const fuera = [];

  for (const rel of htmls) {
    const html = await fs.readFile(path.join(DIST, rel), 'utf8');
    const i = html.indexOf(BANDA);
    if (i < 0) continue;
    conBanda.push(rel);

    if (html.includes(PROPIA)) dobles.push(rel);

    const j = html.indexOf(EMBEBIDA);
    if (j < 0 || !SLIDE.test(html)) { huerfanas.push(rel); continue; }

    // Estar en la pagina no basta: la home tenia el carrusel Y la banda vacia.
    const fin = finDeBanda(html, i);
    if (!(i < j && j < fin)) fuera.push(`${rel} -> banda [${i},${fin}], carrusel en ${j}`);
  }

  console.log(`  ---   ${conBanda.length} paginas con banda de resenas`);

  // Sin paginas que la traigan no hay nada medido, y eso NO es un aprobado: es
  // exactamente como comprobar-imagenes.mjs salio verde con 429 URLs rotas en
  // produccion. Si la banda desaparece del sitio, esta puerta tiene que enterarse.
  decir(conBanda.length > 0,
    'hay paginas con banda de resenas donde comprobar algo', []);
  decir(huerfanas.length === 0,
    'ninguna pagina promete resenas sin traerlas', huerfanas);
  decir(fuera.length === 0,
    'el carrusel va DENTRO de la banda que lo promete, no al final de la pagina', fuera);
  decir(dobles.length === 0,
    'ninguna pagina enseña dos secciones de Reviews (la migrada y la propia)', dobles);
}

console.log(fallos ? `\n${fallos} fallo(s).\n` : '\nsin fallos.\n');
process.exit(fallos ? 1 : 0);
