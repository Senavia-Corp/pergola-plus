#!/usr/bin/env node
/**
 * La puerta del fondo de CTA: mide si una imagen sirve de fondo para el texto.
 *
 *   node scripts/comprobar-cta.mjs     (npm run check:cta)
 *
 * Como CLI mide lo que haya en public/images/cta/ y falla si algo se sale de rango.
 * Como modulo lo importa scripts/integrar-cta.mjs para juzgar lo que vuelve de
 * Higgsfield antes de escribir nada.
 *
 * ───────────────────────────────────────────────────────────────────────────────
 * LO QUE ESTA PUERTA NO PUEDE HACER, DICHO CLARO
 *
 * NO DISTINGUE UN PRODUCTO DE OTRO. Una pergola de lamas preciosa en la pagina de
 * carports pasa las cuatro medidas con nota. Esto mide legibilidad del texto encima,
 * nada mas. Quien decide si la imagen enseña el producto correcto es el ojo, mirando
 * los montajes de auditoria-imagenes/cta/ uno a uno.
 *
 * ───────────────────────────────────────────────────────────────────────────────
 * DE DONDE SALEN LOS NUMEROS
 *
 * El CTA pinta la imagen con object-fit:cover bajo un velo PLANO de 50% de negro
 * (`linear-gradient(#00000080,#00000080)` en .wrapper-call-to-action) con una caja de
 * texto centrada de 650px. La zona que importa es el 46% x 55% central: ahi va el
 * titular en blanco.
 *
 * Medida la imagen que hoy esta en produccion, en esa zona: media 137,5 y sigma 71,9.
 *
 *   media < 110  el velo del 50% la convierte en una barra casi negra.
 *   media > 160  el parrafo blanco baja de 4,5:1 de contraste.
 *   sigma <  40  el centro esta tapiado con una pared lisa en vez de dar profundidad.
 *                Ese fallo ya ocurrio.
 *   sigma >  90  el centro es un caos de detalle y el texto se pierde dentro.
 *
 * El techo de sigma es 90 y no 75: a 75, la imagen que YA esta publicada quedaria a
 * un 4% de ser rechazada. Un techo que casi suspende a la referencia no es un techo,
 * es una casualidad.
 *
 * ───────────────────────────────────────────────────────────────────────────────
 * TRAMPA MEDIDA: sharp().stats() IGNORA LAS OPERACIONES DEL PIPELINE.
 *
 * `stats()` mide la imagen de ENTRADA, asi que un `.extract()` encadenado se descarta
 * en silencio y devuelve las estadisticas de la imagen ENTERA. Comprobado sobre el
 * fondo de produccion:
 *
 *     sharp(f).extract(esquina 100x100).stats()  -> media 147,70
 *     sharp(f).stats()                           -> media 147,70   (identico)
 *     sharp(buffer ya recortado).stats()         -> media 160,21   (el recorte real)
 *
 * Es la misma familia que el `convolve()` con canal alfa que ya esta documentado en
 * docs/decisiones.md: no da error, produce un numero plausible, y ese numero manda
 * trabajo sobre imagenes que estan bien —o peor, aprueba las que no lo estan—. Por eso
 * `medirCentro()` materializa el recorte con `.toBuffer()`, y por eso hay
 * `autocomprobar()`: si el recorte deja de aplicarse, el script muere antes de juzgar.
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const RAIZ = path.resolve(import.meta.dirname, '..');
const CTA = path.join(RAIZ, 'public/images/cta');

/** Zona central que ocupa la caja de texto. Fraccion del ancho y del alto. */
export const ZONA = { ancho: 0.46, alto: 0.55 };

export const UMBRALES = {
  RATIO_MIN: 2.45,
  RATIO_MAX: 2.65,
  /**
   * Ancho minimo de lo que VUELVE de Higgsfield, no de lo que se publica.
   *
   * Se pide 3000 para tener pixeles de sobra al recortar a 2.55:1 y bajar al master
   * de 2400. El master publicado mide 2400 A PROPOSITO, asi que medirlo con esta
   * regla lo suspenderia siempre: por eso `juzgar()` recibe el minimo que toca en
   * cada lado (ANCHO_PUBLICADO abajo). Este fallo ya se colo una vez y dejaba
   * `npm run check` en rojo permanente en cuanto entraba la primera imagen buena.
   */
  ANCHO_MIN: 3000,
  /** Ancho del master que se publica. Lo escribe integrar-cta.mjs. */
  ANCHO_PUBLICADO: 2400,
  MEDIA_MIN: 110,
  MEDIA_MAX: 160,
  SIGMA_MIN: 40,
  SIGMA_MAX: 90,
};

/** La relacion a la que se recorta al aplicar. */
export const RATIO_OBJETIVO = 2.55;

/**
 * Mide el rectangulo central de una imagen.
 *
 * El recorte se materializa a buffer ANTES de medir. Ver la cabecera: encadenar
 * `.extract()` con `.stats()` devuelve las estadisticas de la imagen entera.
 */
export async function medirCentro(buf) {
  const m = await sharp(buf).metadata();
  const w = Math.max(1, Math.round(m.width * ZONA.ancho));
  const h = Math.max(1, Math.round(m.height * ZONA.alto));
  const left = Math.round((m.width - w) / 2);
  const top = Math.round((m.height - h) / 2);

  const recorte = await sharp(buf)
    .removeAlpha()
    .extract({ left, top, width: w, height: h })
    .toBuffer();

  // Control barato: si el recorte no midiera lo pedido, todo lo demas es mentira.
  const mr = await sharp(recorte).metadata();
  if (mr.width !== w || mr.height !== h) {
    throw new Error(`[cta] el recorte salio ${mr.width}x${mr.height} y se pidio ${w}x${h}`);
  }

  const s = await sharp(recorte).greyscale().stats();
  return {
    width: m.width,
    height: m.height,
    ratio: m.width / m.height,
    media: s.channels[0].mean,
    sigma: s.channels[0].stdev,
  };
}

/**
 * Motivos por los que una medida NO sirve. Array vacio = pasa.
 *
 * `anchoMin` cambia segun que se este juzgando: 3000 para lo que vuelve de
 * Higgsfield, 2400 para el master ya publicado. Ver UMBRALES.ANCHO_MIN.
 */
export function juzgar(m, { anchoMin = UMBRALES.ANCHO_MIN } = {}) {
  const U = UMBRALES;
  const motivos = [];
  if (m.ratio < U.RATIO_MIN || m.ratio > U.RATIO_MAX) {
    motivos.push(`relacion ${m.ratio.toFixed(2)}:1 fuera de ${U.RATIO_MIN}-${U.RATIO_MAX}:1`);
  }
  if (m.width < anchoMin) {
    motivos.push(`ancho ${m.width} px, minimo ${anchoMin}`);
  }
  if (m.media < U.MEDIA_MIN) {
    motivos.push(`centro demasiado oscuro: media ${m.media.toFixed(1)} < ${U.MEDIA_MIN}`
      + ' (con el velo del 50% queda una barra casi negra)');
  }
  if (m.media > U.MEDIA_MAX) {
    motivos.push(`centro demasiado claro: media ${m.media.toFixed(1)} > ${U.MEDIA_MAX}`
      + ' (el parrafo blanco baja de 4,5:1)');
  }
  if (m.sigma < U.SIGMA_MIN) {
    motivos.push(`centro plano: sigma ${m.sigma.toFixed(1)} < ${U.SIGMA_MIN}`
      + ' (una pared lisa cerrando el fondo, no una vista con profundidad)');
  }
  if (m.sigma > U.SIGMA_MAX) {
    motivos.push(`centro demasiado revuelto: sigma ${m.sigma.toFixed(1)} > ${U.SIGMA_MAX}`
      + ' (el titular se pierde dentro del detalle)');
  }
  return motivos;
}


/**
 * Geometria REAL del componente, medida en el navegador sobre la pagina construida.
 *
 * A 1440 la seccion mide 1440x371 (relacion 3,88) y la caja de texto es la de 650px
 * centrada. A 390 mide 390x414 (relacion 0,94) y la caja ocupa el 83,6% del ancho.
 * De ahi sale que a 1440 se vea el 66% del alto de la imagen y a 390 el 37% del
 * ancho: son las dos ventanas por las que el visitante ve el fondo.
 */
const VISTAS = [
  { nombre: '1440', seccion: [1440, 371], caja: { x: (1440 - 650) / 2 / 1440, y: 0.18, w: 650 / 1440, h: 0.64 } },
  { nombre: '390', seccion: [390, 414], caja: { x: 0.082, y: 0.271, w: 0.836, h: 0.536 } },
];

/** El velo plano de .wrapper-call-to-action: rgba(0,0,0,.5), compuesto en sRGB. */
const VELO = 0.5;

/** Contraste minimo del titular. Es texto grande (25px en movil, 44 en escritorio). */
export const CONTRASTE_MIN = 3;

const linealizar = (c) => { c /= 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };

/**
 * Contraste del texto BLANCO sobre el fondo ya velado, en las dos anchuras.
 *
 * Se mide el fondo ANTES de pintar el texto, asi que la media es una media de verdad
 * y no la del hero —donde el promedio incluia los propios pixeles blancos de las
 * letras y por eso se llamaba «suelo»—. `peor` es el percentil 95 de luminancia bajo
 * la caja: el trozo mas claro del fondo, que es donde una palabra se pierde.
 *
 * Referencia: la imagen que hoy esta en produccion da media 8,7:1 y peor 4,5:1 a
 * 1440, y 9,0:1 / 4,7:1 a 390. O sea que en su 5% mas claro esta JUSTO en la linea
 * de 4,5:1 que WCAG AA pide para texto normal. Por eso el techo de media 160 de
 * UMBRALES hace trabajo real: una imagen mas clara que esa hunde el parrafo.
 */
export async function legibilidad(buf) {
  const salida = {};
  for (const v of VISTAS) {
    const [SW, SH] = v.seccion;
    const { data, info } = await sharp(buf)
      .resize(SW, SH, { fit: 'cover', position: 'centre' }).removeAlpha()
      .raw().toBuffer({ resolveWithObject: true });
    const x0 = Math.round(v.caja.x * SW), y0 = Math.round(v.caja.y * SH);
    const w = Math.round(v.caja.w * SW), h = Math.round(v.caja.h * SH);
    const Ls = [];
    for (let y = y0; y < y0 + h; y++) {
      for (let x = x0; x < x0 + w; x++) {
        const i = (y * info.width + x) * 3;
        Ls.push(0.2126 * linealizar(data[i] * VELO)
          + 0.7152 * linealizar(data[i + 1] * VELO)
          + 0.0722 * linealizar(data[i + 2] * VELO));
      }
    }
    Ls.sort((a, b) => a - b);
    const ratio = (L) => 1.05 / (L + 0.05);
    salida[v.nombre] = {
      media: ratio(Ls.reduce((a, b) => a + b, 0) / Ls.length),
      peor: ratio(Ls[Math.floor(Ls.length * 0.95)]),
    };
  }
  return salida;
}

/**
 * Motivos por los que el texto NO se lee encima. Array vacio = pasa.
 *
 * Solo suspende por debajo de 3:1, que es el minimo de WCAG para texto GRANDE: por
 * ahi el titular deja de leerse y la imagen vuelve a la cola. El parrafo pide 4,5:1
 * y su numero se IMPRIME siempre, pero no suspende: la imagen que ya esta publicada
 * da 4,5 clavado en su 5% mas claro, y una puerta que suspende a la referencia no
 * mide la calidad, mide la suerte.
 */
export function juzgarLegibilidad(leg) {
  const motivos = [];
  for (const [v, r] of Object.entries(leg)) {
    if (r.peor < CONTRASTE_MIN) {
      motivos.push(`a ${v}px el titular no se lee: ${r.peor.toFixed(1)}:1 en el 5% mas claro`
        + ` del fondo (minimo ${CONTRASTE_MIN}:1)`);
    }
  }
  return motivos;
}

/**
 * Demuestra que la medida mide lo que dice medir. Array vacio = sana.
 *
 * La prueba que importa es la primera: una imagen negra con el rectangulo central
 * EXACTO en blanco. Si el recorte se aplica, la media del centro es ~255. Si se
 * ignora y se mide la imagen entera, sale ~255*0.46*0.55 = ~64. Son dos numeros que
 * no se pueden confundir, y esa es toda la gracia.
 */
export async function autocomprobar() {
  const fallos = [];
  const W = 1000, H = 400;
  const w = Math.round(W * ZONA.ancho), h = Math.round(H * ZONA.alto);

  const centroBlanco = await sharp({ create: { width: W, height: H, channels: 3, background: '#000' } })
    .composite([{
      input: await sharp({ create: { width: w, height: h, channels: 3, background: '#fff' } }).png().toBuffer(),
      left: Math.round((W - w) / 2), top: Math.round((H - h) / 2),
    }]).png().toBuffer();

  const a = await medirCentro(centroBlanco);
  if (a.media < 250) {
    fallos.push(`el recorte central no se esta aplicando: media ${a.media.toFixed(1)}, se esperaba ~255`
      + ` (si sale ~${(255 * ZONA.ancho * ZONA.alto).toFixed(0)} se esta midiendo la imagen entera)`);
  }

  // Gris uniforme: media 128, sigma 0. Confirma que stats() lee valores reales.
  const gris = await sharp({ create: { width: W, height: H, channels: 3, background: '#808080' } }).png().toBuffer();
  const b = await medirCentro(gris);
  if (Math.abs(b.media - 128) > 2) fallos.push(`gris uniforme deberia dar media ~128 y da ${b.media.toFixed(1)}`);
  if (b.sigma > 1) fallos.push(`gris uniforme deberia dar sigma ~0 y da ${b.sigma.toFixed(1)}`);

  // Y que el juicio use esos numeros: el gris plano tiene que caer por sigma.
  if (!juzgar({ ...b, ratio: RATIO_OBJETIVO, width: UMBRALES.ANCHO_MIN }).length) {
    fallos.push('un centro gris liso (sigma 0) deberia suspender y no suspende');
  }
  return fallos;
}

// --- CLI ---------------------------------------------------------------------

if (import.meta.url === `file://${process.argv[1]}`) {
  const fallos = await autocomprobar();
  if (fallos.length) {
    console.error('  FALLO  la medida del centro esta rota, no se puede juzgar nada:');
    for (const f of fallos) console.error(`         ${f}`);
    process.exit(1);
  }

  const hay = await fs.readdir(CTA).catch(() => null);
  if (hay === null) {
    console.log('  ---   public/images/cta/ no existe todavia: no hay fondos propios que medir');
    console.log('        (las 201 paginas cierran con el fondo generico, que es lo de hoy)\n');
    process.exit(0);
  }

  // Solo los masters: las variantes -p-NNN son recortes del mismo pixel y medirlas
  // seria contar la misma imagen cinco veces.
  const masters = hay.filter((f) => f.endsWith('.avif') && !/-p-\d+\.avif$/.test(f)).sort();
  if (!masters.length) {
    console.log('  ---   public/images/cta/ esta vacia: nada que medir\n');
    process.exit(0);
  }

  console.log(`Fondos de CTA propios: ${masters.length}\n`);
  const malas = [];
  for (const f of masters) {
    const buf = await fs.readFile(path.join(CTA, f));
    const m = await medirCentro(buf);
    const leg = await legibilidad(buf);
    const motivos = [...juzgar(m, { anchoMin: UMBRALES.ANCHO_PUBLICADO }), ...juzgarLegibilidad(leg)];
    const marca = motivos.length ? 'FALLA' : 'ok   ';
    console.log(`  ${marca} ${f.replace(/\.avif$/, '').padEnd(30)}`
      + ` ${String(m.width).padStart(4)}x${String(m.height).padEnd(4)} ${m.ratio.toFixed(2)}:1`
      + `  media ${m.media.toFixed(1).padStart(5)}  sigma ${m.sigma.toFixed(1).padStart(5)}`);
    console.log(`         texto blanco: 1440 ${leg['1440'].media.toFixed(1)}:1 (peor ${leg['1440'].peor.toFixed(1)})`
      + `   390 ${leg['390'].media.toFixed(1)}:1 (peor ${leg['390'].peor.toFixed(1)})`);
    for (const mo of motivos) console.log(`         · ${mo}`);
    if (motivos.length) malas.push(f);
  }

  if (malas.length) {
    console.log(`\n  ${malas.length} de ${masters.length} no sirven de fondo para el texto.`);
    console.log('  Quitalas de public/images/cta/ y esas paginas volveran al fondo generico.\n');
    process.exit(1);
  }
  console.log(`\n  ok    los ${masters.length} dejan leer el titular encima\n`);
}
