/**
 * La metrica de nitidez. UNA sola implementacion.
 *
 * La usan `auditar-nitidez.mjs` (para decidir que se manda a regenerar) y
 * `integrar-higgsfield.mjs` (para decidir si lo devuelto ha mejorado). Vive aqui
 * porque son las DOS CARAS DE LA MISMA DECISION: si midieran distinto, el
 * integrador podria rechazar por "no ha subido" justo lo que la auditoria habia
 * marcado por "esta blanda", y al reves. Una copia en cada fichero es la forma
 * segura de que un dia digan cosas distintas.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * POR QUE EL LAPLACIANO SE CALCULA A MANO Y NO CON `sharp.convolve()`
 *
 * Dos motivos, los dos medidos:
 *
 *   1. CON CANAL ALFA, `convolve` DEVUELVE EL BUFFER ENTERO A CERO. Cinco fotos
 *      reales del cliente (4 canales) daban min=0, max=0, media=0 — o sea
 *      varianza 0,0, que la auditoria leia como "blandisima" y mandaba a
 *      regenerar. La misma foto sin alfa daba 6,83.
 *
 *      Y `.removeAlpha()` NO lo arregla: sharp ordena su pipeline internamente y
 *      la convolucion sigue viendo el alfa. Comprobado tras encadenarlo: la
 *      metadata seguia diciendo 4 canales y el resultado seguia siendo 0.
 *
 *   2. `convolve` SATURA A 8 BITS, asi que toda la respuesta NEGATIVA del
 *      Laplaciano se recorta a 0. Se tiraba media señal.
 *
 * Es el peor tipo de fallo posible en una auditoria: no da error, produce un
 * numero plausible, y ese numero manda trabajo manual sobre imagenes que estan
 * bien. Solo salio mirando el informe con desconfianza — una fotografia real no
 * puede tener varianza exactamente 0,0.
 */
import sharp from 'sharp';

/** Ancho al que se normaliza antes de medir. */
export const ANCHO_NITIDEZ = 512;

/**
 * Varianza del Laplaciano sobre luminancia, con el tamano normalizado.
 *
 * Se reescala TODO a un ancho fijo antes de medir porque la varianza crece con la
 * resolucion: sin normalizar, comparar una foto de 450px con una de 1600px no
 * dice nada.
 *
 * Devuelve un numero sin unidad. Solo tiene sentido comparado con otras medidas
 * hechas por esta misma funcion.
 *
 * POR QUE HAY QUE COMPARAR AL MISMO TAMANO (`aTamano`)
 *
 * Normalizar a 512 hace comparables dos imagenes CUALESQUIERA, pero no las hace
 * comparables de forma JUSTA cuando una es mucho mas grande que la otra: bajar
 * 2500 px a 512 promedia ~5x5 pixeles por muestra y bajar 1250 px promedia ~2x2,
 * asi que la grande llega al medidor mas suavizada por pura aritmetica del
 * remuestreo, tenga el detalle que tenga. El sesgo crece con el factor y siempre
 * penaliza al upscale.
 *
 * Medido en las fotos del cliente: `forte-plus` daba 3034 -> 2051 (68%, o sea
 * «se ha hundido») y al medir los dos lados a 2500x1406 da 2725 -> 2051 (75%).
 * Siete puntos que no eran de la foto, eran del metodo. Y mirando el recorte a
 * 1:1 la nueva es OBVIAMENTE mejor: tejas, sillar y barandillas resueltos donde
 * antes habia papilla.
 *
 * Asi que quien compare pasa `aTamano` con el tamano FINAL que se va a servir.
 * Los dos lados recorren entonces la misma cadena de remuestreo y lo que queda
 * de diferencia es detalle de verdad. Es ademas la pregunta que importa: a igual
 * tamano en pantalla, ¿trae el archivo nuevo mas detalle que el que el navegador
 * ya sintetizaba estirando el viejo?
 */
export async function nitidez(buf, aTamano = null) {
  // `aTamano` iguala el punto de partida de los dos lados de una comparacion. Va
  // en UNA PASADA APARTE a proposito: sharp admite un solo `resize` por pipeline
  // —el segundo pisa al primero sin dar error— y encadenarlos dejaba la medida
  // exactamente igual de sesgada, pero con un comentario diciendo que no lo estaba.
  const entrada = aTamano
    ? await sharp(buf).resize({ ...aTamano, fit: 'fill' }).png().toBuffer()
    : buf;

  const { data, info } = await sharp(entrada)
    .resize({ width: ANCHO_NITIDEZ, fit: 'inside', withoutEnlargement: false })
    .greyscale()
    .toColourspace('b-w')   // fuerza UN canal: aqui el alfa si desaparece de verdad
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width: w, height: h } = info;
  if (w < 3 || h < 3) return 0;

  // Laplaciano de 4 vecinos, con signo y sin recortar. Se salta el borde de 1px.
  const n = (w - 2) * (h - 2);
  const vals = new Float64Array(n);
  let suma = 0;
  let k = 0;
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const i = y * w + x;
      const v = data[i - w] + data[i + w] + data[i - 1] + data[i + 1] - 4 * data[i];
      vals[k++] = v;
      suma += v;
    }
  }
  const media = suma / n;
  let acc = 0;
  for (let i = 0; i < n; i++) acc += (vals[i] - media) ** 2;
  return acc / n;
}

/** Luminancia cruda a un tamano dado, en UN canal. Para el SSIM. */
export async function luminancia(buf, w, h) {
  return sharp(buf)
    .resize(w, h, { fit: 'fill' })
    .greyscale()
    .toColourspace('b-w')
    .raw()
    .toBuffer();
}

/**
 * SSIM medio por ventanas de 8x8 sobre luminancia.
 *
 * Sharp no lo trae y no merece una dependencia: son treinta lineas. Se usa el
 * SSIM y no una diferencia de pixeles (MAE/PSNR) porque un upscale legitimo
 * cambia TODOS los pixeles —de eso se trata— y una diferencia absoluta lo
 * marcaria igual que una alucinacion. El SSIM compara luminancia, contraste y
 * ESTRUCTURA local, que es lo unico que tiene que sobrevivir.
 *
 * Vive aqui por el mismo motivo que `nitidez`: lo usan los DOS integradores
 * —`integrar-higgsfield.mjs` para la cola del CMS y `optimizar-imagenes-cliente.mjs`
 * para las 12 fotos del cliente— y son la misma decision tomada dos veces. Una
 * copia en cada fichero es la forma segura de que un dia digan cosas distintas.
 *
 * Los dos buffers tienen que venir ya a `w`x`h` y en un canal: usa `luminancia()`.
 */
export function ssim(a, b, w, h) {
  const C1 = (0.01 * 255) ** 2;
  const C2 = (0.03 * 255) ** 2;
  const V = 8;
  let total = 0, n = 0;
  for (let y = 0; y + V <= h; y += V) {
    for (let x = 0; x + V <= w; x += V) {
      let ma = 0, mb = 0;
      for (let j = 0; j < V; j++) for (let i = 0; i < V; i++) {
        ma += a[(y + j) * w + x + i];
        mb += b[(y + j) * w + x + i];
      }
      const N = V * V;
      ma /= N; mb /= N;
      let va = 0, vb = 0, cov = 0;
      for (let j = 0; j < V; j++) for (let i = 0; i < V; i++) {
        const da = a[(y + j) * w + x + i] - ma;
        const db = b[(y + j) * w + x + i] - mb;
        va += da * da; vb += db * db; cov += da * db;
      }
      va /= N - 1; vb /= N - 1; cov /= N - 1;
      total += ((2 * ma * mb + C1) * (2 * cov + C2)) / ((ma * ma + mb * mb + C1) * (va + vb + C2));
      n++;
    }
  }
  return n ? total / n : 0;
}

/**
 * Cuanto tiene que valer la nitidez del upscale respecto a la del original para
 * darlo por bueno. Devuelve el factor minimo exigible segun POR QUE se marco la
 * imagen (`motivos` de auditoria-imagenes/cola-higgsfield.json).
 *
 * POR QUE NO ES UN UMBRAL UNICO, Y POR QUE EL UNICO QUE HABIA ESTABA MAL
 *
 * Habia un `MEJORA_MINIMA = 1.10` para todas: «la nitidez tiene que subir un
 * 10%». Con Topaz eso rechaza upscales buenos, y se comprobo midiendo. El caso:
 *
 *   cover-miami-dade-…  1024x1024 -> 2048x2048   nitidez 3558 -> 2713 (-23,7%)
 *                        SSIM 0,961, y a 1:1 el resultado es visiblemente mejor.
 *
 * Son DOS efectos que empujan en la misma direccion, y ninguno es perdida de
 * detalle real:
 *
 *   1. TOPAZ DENOISEA. La varianza del Laplaciano no sabe distinguir grano de
 *      textura: contaba el ruido de compresion del original como si fuera
 *      detalle. Quitarlo baja el numero y sube la foto.
 *
 *   2. `nitidez()` NORMALIZA A 512 px ANTES DE MEDIR. Una imagen de 2048 px
 *      bajada a 512 promedia 4x4 pixeles por muestra; la de 1024 promedia 2x2.
 *      La grande llega al medidor mas suavizada por pura aritmetica del
 *      remuestreo, tenga el detalle que tenga. El sesgo crece con el factor.
 *
 * De ahi los dos tramos. Lo que cambia no es la exigencia, es QUE se le pide a
 * cada imagen segun el defecto que se le diagnostico:
 *
 *   BLANDA        -> sigue exigiendo +10%. Es la unica marca que AFIRMA que a la
 *                    foto le falta micro-textura, y ahi el upscale existe justo
 *                    para recuperarla: si no sube, no ha hecho su trabajo. Y hace
 *                    falta el margen porque «que no baje» no basta —medido: un
 *                    Lanczos a 2x, que no anade ni un detalle, pasaba con
 *                    241,1 -> 241,4 (+0,1%, ruido de medida) y habriamos escrito
 *                    un archivo cuatro veces mas pesado a cambio de nada.
 *
 *   el resto      -> solo que NO SE HUNDA (>= 70%). SUB-RESOLUCION,
 *   (SUB-RESOLUCION,  SOBRECOMPRIMIDA y BLOQUES JPEG no dicen nada del detalle:
 *    SOBRECOMPRIMIDA, dicen que faltan pixeles o bitrate. Pedirles una subida de
 *    BLOQUES JPEG)    nitidez es pedirles algo que nadie diagnostico, y es lo que
 *                     rechazaba el caso de arriba. El suelo del 70% sigue cazando
 *                     el upscale que emborrona de verdad, que es lo unico que
 *                     esta marca tiene que cazar.
 *
 * Lo que NO se toca por esto: AR, factor de aumento y SSIM. Esos tres son los
 * que cazan la alucinacion, y la alucinacion es el riesgo caro.
 */
export const NITIDEZ_SUBE = 1.10;
export const NITIDEZ_SUELO = 0.70;

export function exigenciaNitidez(motivos = []) {
  const blanda = motivos.some((m) => m.startsWith('BLANDA'));
  return blanda
    ? { factor: NITIDEZ_SUBE, porque: 'marcada BLANDA: tiene que RECUPERAR micro-textura' }
    : { factor: NITIDEZ_SUELO, porque: 'no marcada BLANDA: basta con que no se hunda' };
}

/**
 * Autocomprobacion de la metrica.
 *
 * La llaman los dos scripts al arrancar. Cuesta milisegundos y cubre justo el
 * fallo que nos comimos: una imagen CON ALFA tiene que medir lo mismo que la
 * misma imagen sin alfa, y una foto con detalle tiene que puntuar mas que su
 * version desenfocada. Si esto se rompe, los dos scripts mienten a la vez y en la
 * misma direccion.
 */
export async function autocomprobar() {
  // Ruido reproducible: detalle de verdad, sin depender de ningun fichero.
  const w = 128, h = 128;
  const rgb = Buffer.alloc(w * h * 3);
  let s = 12345;
  for (let i = 0; i < rgb.length; i++) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    rgb[i] = s % 256;
  }
  const base = sharp(rgb, { raw: { width: w, height: h, channels: 3 } });
  const conDetalle = await base.clone().png().toBuffer();
  const conAlfa = await base.clone().ensureAlpha().png().toBuffer();
  const borrosa = await base.clone().blur(4).png().toBuffer();

  const [nDetalle, nAlfa, nBorrosa] = await Promise.all(
    [conDetalle, conAlfa, borrosa].map(nitidez),
  );

  const fallos = [];
  if (!(nDetalle > 0)) fallos.push(`una imagen con detalle mide ${nDetalle}, deberia ser > 0`);
  if (!(nAlfa > 0)) fallos.push(`CON CANAL ALFA mide ${nAlfa}: ha vuelto el fallo del alfa`);
  if (Math.abs(nAlfa - nDetalle) / nDetalle > 0.02) {
    fallos.push(`el alfa cambia la medida: ${nDetalle.toFixed(0)} vs ${nAlfa.toFixed(0)}`);
  }
  if (!(nBorrosa < nDetalle * 0.5)) {
    fallos.push(`una imagen borrosa mide ${nBorrosa.toFixed(0)} y la nitida ${nDetalle.toFixed(0)}`);
  }
  return fallos;
}
