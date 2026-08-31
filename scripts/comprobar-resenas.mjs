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

/* ── CUERPO Y ORDEN DE LA CITA ─────────────────────────────────────────────────
 *
 * QUE HABIA AQUI Y POR QUE YA NO. Hasta el 31-08-2026 esto afirmaba que cada cita
 * llevaba la clase de su TRAMO DE LONGITUD: `src/lib/resenas-tramos.mjs` marcaba
 * las cortas y el CSS les subia el cuerpo. Ese mecanismo se retiro entero porque
 * el hueco no era tipografico —todas las tarjetas se estiran hasta la mas alta— y
 * se sustituyo por estructura: recorte mas bajo y el sobrante repartido por la
 * tarjeta en vez de acumulado bajo la cita.
 *
 * Una asercion que deja de medir algo y no mide otra cosa es una puerta que
 * aprueba en vacio, asi que la de los tramos no se borro: se dio la vuelta. Donde
 * decia «cada cita lleva SU clase», ahora dice «las cinco llevan LA MISMA» — y con
 * ella van las tres piezas de las que depende que el hueco no vuelva.
 *
 * SIN NAVEGADOR, como el resto de puertas del repo: comprobar-carruseles.mjs:31
 * deja escrito por que (Playwright en CI son ~300 MB y un navegador mas que
 * mantener). Lo que no se puede medir en pixeles se ata al numero del que depende.
 */
if (RESENAS_REALES > 0) {
  // Una pagina cualquiera de las que publican el carrusel: todas llevan lo mismo.
  let muestra = null;
  for (const rel of htmls) {
    const html = await fs.readFile(path.join(DIST, rel), 'utf8');
    if (SLIDE.test(html)) { muestra = { rel, html }; break; }
  }

  if (!muestra) {
    decir(false, 'hay una pagina con el carrusel donde comprobar las citas');
  } else {
    // 1. UN SOLO CUERPO. El inverso exacto de lo que afirmaba la asercion de los
    //    tramos: ninguna cita puede llevar un modificador de longitud.
    const clases = [...muestra.html.matchAll(/class="(resena-texto[^"]*)"/g)].map((m) => m[1]);
    const distintas = [...new Set(clases)];
    decir(clases.length === RESENAS_REALES && distintas.length === 1
          && distintas[0] === 'resena-texto',
      `las ${RESENAS_REALES} citas comparten cuerpo: una sola clase, sin tramo de longitud (${muestra.rel})`,
      distintas.length ? distintas.map((c) => `«${c}» x${clases.filter((x) => x === c).length}`)
                       : ['no hay ninguna cita en la pagina']);

    // 4. EL ORDEN PINTADO ES EL QUE SE AFIRMA. Sin esto, `npm run resenas`
    //    reescribe el snapshot y la pagina sigue diciendo «longest first» sobre
    //    el orden que devuelva la API. Es una afirmacion en pantalla sobre como
    //    se ordenan las resenas: 16 CFR Part 465, sancionada POR INFRACCION.
    //    Se empareja por AUTOR y no por el texto porque el HTML trae entidades
    //    (`’` -> `&#8217;`) y la longitud del texto servido no es la del snapshot.
    const porAutor = new Map(SNAPSHOT.resenas.map((r) => [r.autor, r.texto.length]));
    const pintados = [...muestra.html.matchAll(/class="resena-nombre">([^<]*)</g)].map((m) => m[1]);
    const largos = pintados.map((a) => porAutor.get(a));
    const desconocidos = pintados.filter((a) => !porAutor.has(a));
    const rompe = [];
    for (let k = 1; k < largos.length; k++) {
      if (largos[k - 1] != null && largos[k] != null && largos[k] > largos[k - 1]) {
        rompe.push(`${pintados[k - 1]} (${largos[k - 1]}) antes que ${pintados[k]} (${largos[k]})`);
      }
    }
    decir(pintados.length === RESENAS_REALES && !desconocidos.length && !rompe.length,
      'las tarjetas se pintan de la mas larga a la mas corta, que es lo que dice la pagina',
      [...desconocidos.map((a) => `autor «${a}» no esta en el snapshot`), ...rompe]);
  }

  // 2 y 3 se comprueban en el CSS CONSTRUIDO: una variante puede volver por ahi
  //    sin tocar el markup, y el recorte no deja rastro en el HTML.
  const cssRaiz = path.join(DIST, '_astro');
  const hojas = (await fs.readdir(cssRaiz).catch(() => []))
    .filter((f) => f.endsWith('.css'));
  // Sin hojas no hay nada medido, y eso NO es un aprobado.
  decir(hojas.length > 0, 'hay CSS construido en _astro/ donde comprobar el recorte', []);

  let css = '';
  for (const f of hojas) css += await fs.readFile(path.join(cssRaiz, f), 'utf8');

  // 2. NINGUNA VARIANTE POR LONGITUD sobrevive en el CSS.
  const variantes = [...new Set([...css.matchAll(/\.resena-texto--[\w-]+/g)].map((m) => m[0]))];
  decir(variantes.length === 0,
    'no queda ningun selector de tramo (.resena-texto--*) en el CSS construido', variantes);

  // 3. EL RECORTE DE LA CITA SIGUE BAJO. Es el numero del que depende la altura de
  //    la fila y por tanto el hueco de las cuatro tarjetas cortas. Subirlo a 10 lo
  //    deshace entero y no rompe ningun build: por eso se afirma aqui.
  //
  //    SE BUSCA LA REGLA DE LA CITA, NO «algun -webkit-line-clamp». La primera
  //    version leia todos los del build y no medía nada: el blog y BaseLayout
  //    traen los suyos (1, 2 y 3), asi que borrar el recorte de `.resena-texto p`
  //    entero habria dejado la puerta en VERDE contando los del blog — y un
  //    recorte legitimo de 8 en otro componente la habria puesto roja sin que
  //    nada de esta seccion estuviera mal. Se aisla el bloque por su selector.
  const TOPE = 5;
  const reglas = [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)]
    .filter((m) => /\.resena-texto\b/.test(m[1]) && /-webkit-line-clamp/.test(m[2]))
    .map((m) => ({ sel: m[1].trim(), n: Number(m[2].match(/-webkit-line-clamp: *(\d+)/)[1]) }));
  const altos = reglas.filter((r) => r.n > TOPE);
  decir(reglas.length === 1 && altos.length === 0,
    `la cita se recorta a ${TOPE} lineas o menos (visto: ${reglas.map((r) => r.n).join(', ') || 'NINGUNA regla de recorte para .resena-texto'})`,
    reglas.length !== 1
      ? [`esperaba 1 regla de recorte para .resena-texto, hay ${reglas.length}`,
         ...reglas.map((r) => `«${r.sel}» -> ${r.n}`)]
      : altos.map((r) => `«${r.sel}» -> -webkit-line-clamp: ${r.n}`));
}

/* ── LA FRASE DEL ORDEN NO SE QUEDA VIEJA ──────────────────────────────────────
 *
 * El orden de pintado paso de fecha a longitud el 31-08-2026 y las dos frases de
 * `src/i18n/resenas.ts` se reescribieron con el. Esta asercion existe para el caso
 * de que alguien cambie una y no la otra, o revierta el orden y deje la frase: en
 * las dos direcciones el resultado es una afirmacion falsa en pantalla sobre como
 * se ordenan las resenas, en 78 paginas, y ese es el defecto caro de esta seccion.
 */
{
  const VIEJAS = /newest first|de la m(?:á|a)s reciente a la m(?:á|a)s antigua/i;
  const viejas = [];
  for (const rel of htmls) {
    const html = await fs.readFile(path.join(DIST, rel), 'utf8');
    if (VIEJAS.test(html)) viejas.push(rel);
  }
  decir(viejas.length === 0,
    'ninguna pagina sigue afirmando el orden por fecha («newest first»)', viejas);
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
