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
 */
export async function nitidez(buf) {
  const { data, info } = await sharp(buf)
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
