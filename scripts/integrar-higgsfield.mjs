#!/usr/bin/env node
/**
 * Integra los upscales que devuelve Higgsfield. NO se fia de ninguno.
 *
 *     node scripts/integrar-higgsfield.mjs            # solo juzga, no escribe
 *     node scripts/integrar-higgsfield.mjs --aplicar  # escribe las aprobadas
 *
 * Lee `~/Downloads/higgsfield-out/` y `auditoria-imagenes/cola-higgsfield.json`.
 *
 * POR QUE UN FILTRO Y NO UNA COPIA
 *
 * Un modelo generativo al que le pides «restaura esta foto» puede devolverte una
 * foto mejor que NO ES LA MISMA CASA. Cambia el numero de postes, se inventa un
 * rotulo, redibuja una cara, le pone otro modelo de pergola. Y el resultado es
 * bonito, asi que pasa desapercibido — hasta que lo ve el cliente cuya casa sale
 * ahi. Una foto bonita que ya no es la casa del cliente no sirve.
 *
 * De ahi los cuatro rechazos automaticos de abajo. Ninguno es suficiente por si
 * solo: leelos como un cedazo que quita lo evidente para que la revision VISUAL
 * —que es el filtro de verdad— tenga que mirar menos.
 *
 * LO QUE ESTE SCRIPT NO PUEDE HACER, DICHO CLARO
 *
 * El SSIM caza que le hayan cambiado la composicion a la foto. NO caza que la
 * pergola tenga ahora cinco postes en vez de cuatro: es un cambio local, en pocos
 * pixeles, y la estructura global apenas se mueve. Por eso el script GENERA los
 * montajes lado a lado en auditoria-imagenes/comparativas/ y por eso hay que
 * mirarlos uno a uno antes de `--aplicar`. Si alguien se salta ese paso, este
 * fichero no le ha protegido de nada.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * DONDE ESCRIBE, Y POR QUE NO ES EL MISMO SITIO PARA TODAS
 *
 * Las imagenes del sitio son de DOS clases con dos fuentes de verdad distintas.
 * Tratarlas igual rompe una de las dos:
 *
 *   /cms-img/*   NO esta en git. Su fuente es assets-migracion/content/ (tampoco
 *                en git) + manifest.json (SI en git, con sha256/bytes/w/h).
 *                -> se escribe el binario en el staging y se ACTUALIZA el
 *                   manifest. instalar-assets.mjs lo propaga a public/cms-img/.
 *
 *   /images/*    SI esta en git (165 archivos, 13 MB), pero su fuente es el
 *                export de Webflow, FUERA del repo. Y `instalar-assets.mjs`
 *                COPIA EL EXPORT ENCIMA de public/images/ en cada ejecucion.
 *                -> escribir ahi y ya seria una regresion latente: el siguiente
 *                   instalar-assets revertiria la foto EN SILENCIO, sin error y
 *                   sin diferencia visible salvo que se mire el pixel.
 *                -> por eso se anota en assets-migracion/regeneradas.json, que
 *                   instalar-assets.mjs respeta y check:imagenes verifica.
 *
 * QUE NO SE TOCA DEL MANIFEST, NUNCA: `alt`, `altDerivado`, `altGenerado`,
 * `sourceUrls`, `usedIn`, `file`, `role`, `subject`. Solo cambian los cuatro
 * campos que describen el ARCHIVO: sha256, bytes, width, height.
 * El manifest ya tuvo un bug de no-determinismo que sorteaba a cara o cruz el
 * `alt` de 42 imagenes y no se vio durante semanas porque no rompe nada visible.
 * No se vuelve a tocar ese campo por ningun motivo.
 *
 * SALIDA EN AVIF, con el mismo nombre. Higgsfield devuelve PNG/JPEG/WebP; el
 * sitio sirve AVIF de archivo unico con <img src> plano —cero <picture>, cero
 * srcset propio—, asi que cambiar de formato obligaria a tocar markup migrado
 * verbatim y a reescribir check:paridad. Se recodifica y se conserva el nombre.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import sharp from 'sharp';
// La MISMA metrica que usa la auditoria. Ver scripts/lib/nitidez.mjs: si midieran
// distinto, esto rechazaria por «no ha subido» justo lo que aquella marco por
// «esta blanda».
import {
  nitidez, luminancia, ssim, exigenciaNitidez, NITIDEZ_SUBE, NITIDEZ_SUELO,
  ANCHO_NITIDEZ, autocomprobar,
} from './lib/nitidez.mjs';

const RAIZ = path.resolve(import.meta.dirname, '..');
const ENTRADA = '/Users/senavia/Downloads/higgsfield-out';
const AUDIT = path.join(RAIZ, 'auditoria-imagenes');
const COMPARATIVAS = path.join(AUDIT, 'comparativas');
const STAGING = path.join(RAIZ, 'assets-migracion');
const PUBLIC = path.join(RAIZ, 'public');
const REGISTRO = path.join(STAGING, 'regeneradas.json');

const APLICAR = process.argv.includes('--aplicar');

/** Tolerancia de relacion de aspecto. Por encima, el recorte cambio. */
const AR_MAX = 0.01;
/** Factor minimo de aumento. Menos que esto no compensa el riesgo. */
const FACTOR_MIN = 1.8;
/** SSIM minimo contra el original reescalado. Por debajo, se invento contenido. */
const SSIM_MIN = 0.75;

// La regla de nitidez —de dos tramos, segun `motivos`— vive en lib/nitidez.mjs
// junto a la metrica que la alimenta. Ahi esta el porque, con los numeros medidos.

// -------------------------------------------------------------------- inicio
// La metrica se comprueba a si misma ANTES de juzgar nada. Si volviera el fallo
// del canal alfa —que daba nitidez 0,0 sin dar error—, TODA imagen con alfa
// suspenderia el «la nitidez no subio» pasara lo que pasara, y el rechazo pareceria
// una decision razonada.
{
  const fallos = await autocomprobar();
  if (fallos.length) {
    console.error('  FALLO  la metrica de nitidez esta rota, no se puede juzgar nada:');
    for (const f of fallos) console.error(`         ${f}`);
    process.exit(1);
  }
}

const cola = JSON.parse(await fs.readFile(path.join(AUDIT, 'cola-higgsfield.json'), 'utf8'));
const porArchivo = new Map(cola.imagenes.map((i) => [i.archivo, i]));

const devueltos = (await fs.readdir(ENTRADA).catch(() => null));
if (devueltos === null) {
  console.error(`  No existe ${ENTRADA}.`);
  console.error('  Es donde tienes que dejar los resultados de Higgsfield, con el MISMO nombre');
  console.error(`  de archivo que tienen en ~/Downloads/higgsfield-in/ (ver su INSTRUCCIONES.md).`);
  process.exit(1);
}

await fs.mkdir(COMPARATIVAS, { recursive: true });

const aprobadas = [];
const rechazadas = [];
const huerfanos = [];

for (const nombre of devueltos.filter((f) => !f.startsWith('.'))) {
  // Higgsfield puede devolver otra extension. Se empareja por el nombre SIN
  // extension, que es lo estable.
  const base = nombre.replace(/\.[^.]+$/, '');
  const item = porArchivo.get(nombre)
    ?? [...porArchivo.values()].find((i) => i.archivo.replace(/\.[^.]+$/, '') === base);
  if (!item) { huerfanos.push(nombre); continue; }

  const nuevoBuf = await fs.readFile(path.join(ENTRADA, nombre));
  const viejoBuf = await fs.readFile(path.join(PUBLIC, item.ruta.slice(1)));
  const meta = await sharp(nuevoBuf).metadata();
  const [vw, vh] = [item.actual.width, item.actual.height];
  const [nw, nh] = [meta.width, meta.height];

  const motivos = [];

  // 1. Relacion de aspecto. Si cambio, la IA recorto o estiro: el <img> del sitio
  //    lleva width/height horneados y un AR distinto descuadra la caja.
  const arV = vw / vh, arN = nw / nh;
  const deltaAr = Math.abs(arN - arV) / arV;
  if (deltaAr > AR_MAX) {
    motivos.push(`relacion de aspecto cambio ${(deltaAr * 100).toFixed(1)}% (max ${AR_MAX * 100}%): ${vw}x${vh} -> ${nw}x${nh}`);
  }

  // 2. Aumento real.
  const factor = nw / vw;
  if (factor < FACTOR_MIN) {
    motivos.push(`solo ${factor.toFixed(2)}x los px del original (minimo ${FACTOR_MIN}x)`);
  }

  // 3. Nitidez. Un upscale que no anade detalle es peso extra por nada.
  // Los DOS al tamano del archivo nuevo: si no, el remuestreo a 512 penaliza al
  // que trae mas pixeles y el upscale bueno suspende. Ver lib/nitidez.mjs.
  const alFinal = { width: nw, height: nh };
  const nitV = await nitidez(viejoBuf, alFinal);
  const nitN = await nitidez(nuevoBuf, alFinal);
  const exig = exigenciaNitidez(item.motivos);
  if (nitN < nitV * exig.factor) {
    motivos.push(
      `la nitidez cae por debajo del minimo: ${nitV.toFixed(1)} -> ${nitN.toFixed(1)}`
      + ` (${((nitN / nitV - 1) * 100).toFixed(1)}%, hace falta >=${(exig.factor * 100).toFixed(0)}%`
      + ` del original — ${exig.porque})`,
    );
  }

  // 4. Alucinacion. Se compara a IGUAL tamano: el nuevo bajado al del viejo.
  const s = ssim(
    await luminancia(viejoBuf, vw, vh),
    await luminancia(nuevoBuf, vw, vh),
    vw, vh,
  );
  if (s < SSIM_MIN) {
    motivos.push(`SSIM ${s.toFixed(3)} < ${SSIM_MIN}: la estructura cambio, la IA se invento contenido`);
  }

  // El montaje se genera SIEMPRE, tambien para las rechazadas: sirve para ver por
  // que se rechazo sin tener que abrir dos ficheros.
  const altoComp = 700;
  const anchoV = Math.round(altoComp * arV);
  await sharp({
    create: { width: anchoV * 2 + 12, height: altoComp, channels: 3, background: '#ffffff' },
  })
    .composite([
      { input: await sharp(viejoBuf).resize(anchoV, altoComp, { fit: 'fill' }).toBuffer(), left: 0, top: 0 },
      { input: await sharp(nuevoBuf).resize(anchoV, altoComp, { fit: 'fill' }).toBuffer(), left: anchoV + 12, top: 0 },
    ])
    .jpeg({ quality: 88 })
    .toFile(path.join(COMPARATIVAS, `${motivos.length ? 'RECHAZADA' : 'ok'}-${base}.jpg`));

  const info = {
    archivo: nombre, ruta: item.ruta, clase: item.clase,
    de: `${vw}x${vh}`, a: `${nw}x${nh}`, factor: +factor.toFixed(2),
    nitidez: { antes: +nitV.toFixed(1), despues: +nitN.toFixed(1) },
    ssim: +s.toFixed(3), deltaAr: +(deltaAr * 100).toFixed(2),
    motivos, buf: nuevoBuf, meta,
  };
  (motivos.length ? rechazadas : aprobadas).push(info);
}

// -------------------------------------------------------------------- informe
console.log('Integracion de los upscales de Higgsfield\n');
console.log(`  devueltos     ${devueltos.filter((f) => !f.startsWith('.')).length}`);
console.log(`  APROBADAS     ${aprobadas.length}`);
console.log(`  rechazadas    ${rechazadas.length}`);
if (huerfanos.length) {
  console.log(`  huerfanos     ${huerfanos.length}  (no estan en la cola: nombre cambiado?)`);
  for (const h of huerfanos) console.log(`                ${h}`);
}

if (rechazadas.length) {
  console.log('\n  RECHAZADAS — se quedan en la cola:');
  for (const r of rechazadas) {
    console.log(`    ${r.archivo}  ${r.de} -> ${r.a}`);
    for (const m of r.motivos) console.log(`       · ${m}`);
  }
}

if (aprobadas.length) {
  console.log('\n  APROBADAS por las metricas:');
  for (const a of aprobadas) {
    console.log(`    ${a.archivo}  ${a.de} -> ${a.a}  (${a.factor}x, nitidez ${a.nitidez.antes} -> ${a.nitidez.despues}, SSIM ${a.ssim})`);
  }
}

await fs.writeFile(
  path.join(AUDIT, 'veredicto-higgsfield.json'),
  JSON.stringify({
    umbrales: { AR_MAX, FACTOR_MIN, SSIM_MIN, NITIDEZ_SUBE, NITIDEZ_SUELO },
    aprobadas: aprobadas.map(({ buf, meta, ...r }) => r),
    rechazadas: rechazadas.map(({ buf, meta, ...r }) => r),
    huerfanos,
  }, null, 2) + '\n',
);

console.log(`\n  montajes lado a lado -> ${path.relative(RAIZ, COMPARATIVAS)}/`);

if (!APLICAR) {
  console.log('\n  ─────────────────────────────────────────────────────────────────────');
  console.log('  NO SE HA ESCRITO NADA. Este paso solo juzga.');
  console.log('');
  console.log('  MIRA LAS COMPARATIVAS UNA A UNA antes de continuar. Las metricas de');
  console.log('  arriba no ven un poste de mas, un rotulo distinto ni otro modelo de');
  console.log('  pergola: eso solo lo ve un ojo. Descarta (borrandola de');
  console.log(`  ${path.relative(RAIZ, ENTRADA) || ENTRADA}) cualquiera donde haya cambiado algo real.`);
  console.log('');
  console.log('  Cuando esten revisadas:  node scripts/integrar-higgsfield.mjs --aplicar');
  console.log('  ─────────────────────────────────────────────────────────────────────\n');
  process.exit(0);
}

if (!aprobadas.length) {
  console.log('\n  Nada que aplicar.\n');
  process.exit(0);
}

// -------------------------------------------------------------------- aplicar
const manifest = JSON.parse(await fs.readFile(path.join(STAGING, 'manifest.json'), 'utf8'));
const registro = JSON.parse(await fs.readFile(REGISTRO, 'utf8').catch(() => '{"regeneradas":[]}'));
const yaRegistradas = new Map(registro.regeneradas.map((r) => [r.ruta, r]));
const ahora = new Date().toISOString();

let nContent = 0, nDesign = 0;

for (const a of aprobadas) {
  // Recodificar a AVIF apuntando al mismo bytes/px que el archivo que sustituye:
  // subir la resolucion no es excusa para triplicar el peso de la pagina. Se
  // busca la calidad mas alta que no pase de 1.6x el bytes/px original.
  const item = porArchivo.get(a.archivo)
    ?? [...porArchivo.values()].find((i) => i.archivo.replace(/\.[^.]+$/, '') === a.archivo.replace(/\.[^.]+$/, ''));
  const objetivoBpp = (item.actual.bytes / (item.actual.width * item.actual.height)) * 1.6;
  const pxNuevos = a.meta.width * a.meta.height;

  let avif = null;
  for (const q of [70, 64, 58, 52, 46, 40]) {
    avif = await sharp(a.buf).avif({ quality: q }).toBuffer();
    if (avif.length / pxNuevos <= objetivoBpp) break;
  }

  const sha = createHash('sha256').update(avif).digest('hex');

  if (a.clase === 'content') {
    // /cms-img/x  ->  content/x
    const rel = 'content/' + a.ruta.replace(/^\/cms-img\//, '');
    await fs.writeFile(path.join(STAGING, rel), avif);
    const entrada = manifest.assets.find((x) => x.file === rel);
    if (!entrada) {
      console.error(`  !! ${rel} no esta en el manifest: se salta (no se inventan entradas)`);
      continue;
    }
    // SOLO estos cuatro. Ver la cabecera: `alt` no se toca jamas.
    entrada.sha256 = sha;
    entrada.bytes = avif.length;
    entrada.width = a.meta.width;
    entrada.height = a.meta.height;
    // El binario tambien a public/, para no tener que correr instalar-assets solo
    // por esto (que ademas haria rm -rf de cms-img y lo recopiaria igual).
    await fs.writeFile(path.join(PUBLIC, a.ruta.slice(1)), avif);
    nContent++;
  } else {
    const destino = path.join(PUBLIC, a.ruta.slice(1));
    const original = yaRegistradas.get(a.ruta)?.sha256Export
      ?? createHash('sha256').update(await fs.readFile(destino)).digest('hex');
    await fs.writeFile(destino, avif);
    yaRegistradas.set(a.ruta, {
      ruta: a.ruta,
      sha256: sha,
      bytes: avif.length,
      width: a.meta.width,
      height: a.meta.height,
      // El sha del archivo que trae el export de Webflow. Es lo que permite
      // distinguir «alguien lo revirtio» de «alguien lo mejoro otra vez».
      sha256Export: original,
      antes: a.de,
      fecha: ahora,
      origen: 'higgsfield-upscale',
    });
    nDesign++;
  }
}

if (nContent) {
  await fs.writeFile(path.join(STAGING, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
}
if (nDesign) {
  await fs.writeFile(REGISTRO, JSON.stringify({
    _comentario: [
      'Imagenes de public/images/ regeneradas con IA a partir de la foto original.',
      '',
      'EXISTE PORQUE instalar-assets.mjs COPIA EL EXPORT DE WEBFLOW ENCIMA de',
      'public/images/ en cada ejecucion. Sin este registro, la siguiente ejecucion',
      'revertiria estas imagenes EN SILENCIO: sin error, sin hueco, y sin ninguna',
      'diferencia visible salvo que se mire el pixel.',
      '',
      'instalar-assets.mjs salta estas rutas al copiar, y check:imagenes comprueba',
      'que lo que hay en disco sigue teniendo el sha256 anotado aqui. Si alguien las',
      'pisa, la puerta falla a gritos en vez de que la mejora se pierda callando.',
      '',
      '`sha256Export` es el hash del archivo ORIGINAL del export: sirve para saber si',
      'lo que hay en disco es la version regenerada, la del export, o una tercera cosa.',
    ],
    actualizado: ahora,
    regeneradas: [...yaRegistradas.values()].sort((a, b) => a.ruta.localeCompare(b.ruta)),
  }, null, 2) + '\n');
}

console.log(`\n  ${nContent} en assets-migracion/content/ + manifest actualizado (sha256/bytes/width/height)`);
console.log(`  ${nDesign} en public/images/ + anotadas en ${path.relative(RAIZ, REGISTRO)}`);
console.log('\n  AHORA, EN ESTE ORDEN (transformar.mjs hornea width/height en tiempo de');
console.log('  generacion: si cambian los px y no se regenera, check:generadores falla):');
console.log('');
console.log('    npm run medir:imagenes');
console.log('    node scripts/generar-paginas.mjs && node scripts/generar-detalle.mjs');
console.log('    npm run build && npm run check\n');
