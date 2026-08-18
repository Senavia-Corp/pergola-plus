#!/usr/bin/env node
/**
 * Convierte las fotos que mando el cliente (handoff §6) a los AVIF que sirve el
 * sitio.
 *
 *     node scripts/optimizar-imagenes-cliente.mjs
 *
 * Escribe en public/images/cliente/, que SI esta en git. El mapa —que ruta del CMS
 * sustituye cada foto— vive en IMAGENES_CLIENTE (scripts/lib/transformar.mjs) y es
 * el mismo que usa el transformador: una sola fuente de verdad, asi que no pueden
 * desincronizarse. Si se desincronizaran, el HTML pediria un archivo que no existe
 * y eso lo caza `npm run check:imagenes`.
 *
 * Los originales van de 796x548 a 4996x3747, y hay dos VERTICALES (3024x4032 y
 * 3055x3325). Todas caen en cajas con `object-fit:cover` y altura fija del CSS
 * migrado, asi que el recorte lo iba a hacer el navegador de todas formas —
 * centrado y a ciegas. Se hace aqui con `position:'attention'`, que elige la
 * region con mas detalle: en un retrato de una pergola eso es la pergola, no el
 * cielo ni el suelo.
 *
 * Sin este paso el sitio serviria 13,2 MB de JPEG en una tarjeta de 250px.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * DOS FUENTES, Y POR QUE EL ORIGINAL NO SIEMPRE GANA
 *
 * El objetivo son 2500x1406 (ver CLIENTE_ANCHO en transformar.mjs). Siete de las
 * doce fotos NO tienen tantos pixeles reales en el recorte que pide el sitio:
 * cuatro de ellas llegaron con un original MAS PEQUENO que lo que ya publicabamos
 * —796x548 para un slot donde serviamos 1250—, o sea que quien las amplio fue este
 * repo, no el cliente. Para esas se paso el recorte a maxima resolucion real por
 * Topaz (Higgsfield) y el resultado vive en ~/Downloads/hf-topaz/<slug>.png.
 *
 * Este script PREFIERE ese upscale cuando existe. No es un detalle de comodidad:
 * si leyera siempre el original, la proxima ejecucion reescalaria esas siete con
 * Lanczos desde la foto pequena —EN SILENCIO, sin error y sin hueco— y se perderia
 * el trabajo. Con la preferencia, `npm run imagenes:cliente` reproduce las doce
 * tal cual estan, que es justo lo que se le pide a un paso del pipeline.
 *
 * El emparejamiento es por NOMBRE, sin mapa nuevo: el slug sale de `rutaCliente()`,
 * el mismo que da el nombre del AVIF publicado.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * LO QUE VIENE DE UNA IA SE JUZGA; LO QUE VIENE DE PIXELES REALES NO
 *
 * Las cinco que salen de su original son un downscale y no hay nada que juzgar.
 * Las siete de Topaz pasan por la misma reja que `integrar-higgsfield.mjs`, y por
 * el mismo motivo: un modelo al que le pides «restaura esta foto» puede devolverte
 * una foto mejor que NO ES LA MISMA CASA —otro numero de postes, un rotulo
 * inventado, otro modelo de pergola—, y el resultado es bonito, asi que pasa
 * desapercibido hasta que lo ve el cliente cuya casa sale ahi.
 *
 * La reja quita lo evidente. NO caza un poste de mas: eso es un cambio local, en
 * pocos pixeles, y el SSIM global apenas se mueve. Por eso se generan SIEMPRE los
 * montajes lado a lado en auditoria-imagenes/comparativas/ y por eso hay que
 * mirarlos uno a uno. Si alguien se salta ese paso, este fichero no le ha
 * protegido de nada.
 *
 * Una rechazada NO bloquea a las demas: se queda con su AVIF viejo y el script
 * sale con codigo 1 diciendo cual. Es inocuo para el layout —1250x703 y 2500x1406
 * son la misma relacion, asi que el width/height horneado reserva la misma caja—
 * y es mejor que publicar a ciegas.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import {
  IMAGENES_CLIENTE, RECORTE, rutaCliente, CLIENTE_ANCHO, CLIENTE_ALTO,
} from './lib/transformar.mjs';
// La MISMA metrica que usa la auditoria y que usa integrar-higgsfield.mjs. Ver
// scripts/lib/nitidez.mjs: si midieran distinto, esto rechazaria por «se hundio»
// justo lo que aquella marco por «esta blanda».
import { nitidez, luminancia, ssim, exigenciaNitidez, autocomprobar } from './lib/nitidez.mjs';

const RAIZ = path.resolve(import.meta.dirname, '..');
const ORIGEN = '/Users/senavia/Downloads';
const UPSCALES = path.join(ORIGEN, 'hf-topaz');
const DESTINO = path.join(RAIZ, 'public/images/cliente');
const AUDIT = path.join(RAIZ, 'auditoria-imagenes');
const COMPARATIVAS = path.join(AUDIT, 'comparativas');

/**
 * Calidad y techo de peso.
 *
 * 62 se midio contra los AVIF del CMS que sustituyen (157-341 KB a 1250x703). Al
 * pasar a 2500x1406 son 4x los pixeles, asi que a 62 fijo alguna se iba a medio
 * mega — y estas ocho salen en la home. Se baja la CALIDAD antes que el TAMANO:
 * el tamano es lo que arregla la nitidez, la calidad solo cuesta artefactos que a
 * 2500 px casi no se ven. Se coge la primera calidad que no pase del techo.
 */
const CALIDADES = [62, 56, 50, 44, 38];
const TECHO = 300 * 1024;

/**
 * Imagenes que se publican SALTANDOSE el juicio de nitidez, una a una y con motivo.
 *
 * Es una excepcion nombrada y no un umbral mas bajo a proposito: mover el umbral
 * afecta a las 12 y a las ~106 de la cola del CMS; esto afecta a la foto que se
 * nombra aqui y a ninguna otra, y sale en el diff cuando alguien la anada.
 *
 * El resto de la reja —relacion de aspecto y SSIM, que son las que cazan la
 * alucinacion— SE SIGUE APLICANDO. Lo unico que se salta es la nitidez.
 */
const SALTAN_NITIDEZ = {
  'custom-pergolas-and-patio-covers':
    'BLANDA es aqui un falso positivo de CONTENIDO: es una casa blanca minimalista '
    + 'y ~70% del cuadro es pared lisa y cristal oscuro, asi que la varianza del '
    + 'Laplaciano sale baja (1033, 34% de la mediana) por lo que la foto ES, no por '
    + 'como esta guardada — el mismo efecto que decisiones.md ya documenta para las '
    + 'fotos de cielo. Su defecto real es el otro motivo, SOBRECOMPRIMIDA (0,063 B/px, '
    + '28% de la mediana), y ese si lo arregla: 54 KB a 1250 -> ~250 KB a 2500. '
    + 'Medido: 970 -> 984 (+1,4%) donde BLANDA pide +10%. Comprobado a 1:1 antes de '
    + 'escribir esto: las lamas de la pergola, los marcos de las correderas y las '
    + 'tablillas de la silla se resuelven en la nueva y se emborronan en la vieja.',
};

/** Los tres umbrales que cazan la alucinacion. Mismos que integrar-higgsfield.mjs. */
const AR_MAX = 0.01;
const SSIM_MIN = 0.75;

// La metrica se comprueba a si misma ANTES de juzgar nada. Si volviera el fallo
// del canal alfa —que daba nitidez 0,0 sin dar error—, TODA imagen con alfa
// suspenderia el juicio de nitidez y el rechazo pareceria una decision razonada.
{
  const fallos = await autocomprobar();
  if (fallos.length) {
    console.error('  FALLO  la metrica de nitidez esta rota, no se puede juzgar nada:');
    for (const f of fallos) console.error(`         ${f}`);
    process.exit(1);
  }
}

// Los `motivos` de la auditoria deciden QUE se le exige a la nitidez de cada
// upscale (ver exigenciaNitidez). Sin cola, se aplica el tramo prudente.
const MOTIVOS = new Map();
try {
  const cola = JSON.parse(await fs.readFile(path.join(AUDIT, 'cola-higgsfield.json'), 'utf8'));
  for (const i of cola.imagenes) MOTIVOS.set(i.ruta, i.motivos);
} catch {
  console.log('  aviso  sin cola-higgsfield.json: se exige solo el suelo de nitidez\n');
}

/** Montaje lado a lado. Se genera para aprobadas y rechazadas: es como se ve por que. */
async function comparativa(viejoBuf, nuevoBuf, slug, ok) {
  const alto = 700;
  const ancho = Math.round(alto * (CLIENTE_ANCHO / CLIENTE_ALTO));
  await sharp({ create: { width: ancho * 2 + 12, height: alto, channels: 3, background: '#ffffff' } })
    .composite([
      { input: await sharp(viejoBuf).resize(ancho, alto, { fit: 'fill' }).toBuffer(), left: 0, top: 0 },
      { input: await sharp(nuevoBuf).resize(ancho, alto, { fit: 'fill' }).toBuffer(), left: ancho + 12, top: 0 },
    ])
    .jpeg({ quality: 88 })
    .toFile(path.join(COMPARATIVAS, `${ok ? 'ok' : 'RECHAZADA'}-${slug}.jpg`));
}

await fs.mkdir(DESTINO, { recursive: true });
await fs.mkdir(COMPARATIVAS, { recursive: true });

const filas = [];
const rechazadas = [];
const fallos = [];

for (const [ruta, origen] of Object.entries(IMAGENES_CLIENTE)) {
  const publica = rutaCliente(origen);
  const slug = path.basename(publica, '.avif');
  const salida = path.join(RAIZ, 'public', publica.slice(1));

  // Fuente: el upscale de Topaz si existe, si no el original del cliente.
  const upscale = path.join(UPSCALES, `${slug}.png`);
  const deTopaz = await fs.access(upscale).then(() => true, () => false);
  const entrada = deTopaz ? upscale : path.join(ORIGEN, origen);

  const info = await sharp(entrada).metadata().catch(() => null);
  if (!info) { fallos.push(`no se puede leer: ${path.relative(ORIGEN, entrada)}`); continue; }

  const posicion = RECORTE[origen] ?? 'attention';
  const base = sharp(entrada)
    .rotate() // respeta el EXIF: las fotos de iPhone vienen giradas por metadato
    .resize(CLIENTE_ANCHO, CLIENTE_ALTO, { fit: 'cover', position: posicion });

  let avif = null, calidad = null;
  for (const q of CALIDADES) {
    avif = await base.clone().avif({ quality: q }).toBuffer();
    calidad = q;
    if (avif.length <= TECHO) break;
  }

  // Lo publicado hasta ahora. Es contra esto contra lo que se juzga, asi que se lee
  // ANTES de sobrescribir nada.
  const viejoBuf = await fs.readFile(salida).catch(() => null);

  if (deTopaz && viejoBuf) {
    const v = await sharp(viejoBuf).metadata();
    const motivos = [];

    const arV = v.width / v.height, arN = CLIENTE_ANCHO / CLIENTE_ALTO;
    const deltaAr = Math.abs(arN - arV) / arV;
    if (deltaAr > AR_MAX) {
      motivos.push(`la relacion de aspecto cambio ${(deltaAr * 100).toFixed(1)}% (max ${AR_MAX * 100}%)`);
    }

    // SSIM a IGUAL tamano: el nuevo bajado al del viejo. Un upscale legitimo cambia
    // TODOS los pixeles, asi que una diferencia absoluta lo marcaria igual que una
    // alucinacion; el SSIM compara ESTRUCTURA, que es lo que tiene que sobrevivir.
    const s = ssim(
      await luminancia(viejoBuf, v.width, v.height),
      await luminancia(avif, v.width, v.height),
      v.width, v.height,
    );
    if (s < SSIM_MIN) {
      motivos.push(`SSIM ${s.toFixed(3)} < ${SSIM_MIN}: la estructura cambio, la IA se invento contenido`);
    }

    // Los DOS al tamano que se va a servir: si no, el remuestreo a 512 penaliza
    // al que trae mas pixeles y el upscale bueno suspende. Ver lib/nitidez.mjs.
    const alFinal = { width: CLIENTE_ANCHO, height: CLIENTE_ALTO };
    const nitV = await nitidez(viejoBuf, alFinal);
    const nitN = await nitidez(avif, alFinal);
    const exig = exigenciaNitidez(MOTIVOS.get(publica));
    if (nitN < nitV * exig.factor && !SALTAN_NITIDEZ[slug]) {
      motivos.push(
        `la nitidez cae por debajo del minimo: ${nitV.toFixed(0)} -> ${nitN.toFixed(0)}`
        + ` (${((nitN / nitV - 1) * 100).toFixed(1)}%, hace falta >=${(exig.factor * 100).toFixed(0)}%`
        + ` — ${exig.porque})`,
      );
    }
    // Se avisa aunque pase: una excepcion silenciosa es una excepcion que nadie
    // revisa cuando la foto cambie.
    const saltada = nitN < nitV * exig.factor && !!SALTAN_NITIDEZ[slug];

    await comparativa(viejoBuf, avif, slug, !motivos.length);

    if (motivos.length) {
      rechazadas.push({ slug, publica, motivos });
      continue; // se queda el AVIF viejo
    }
    filas.push({ slug, publica, sustituye: ruta, fuente: 'topaz', calidad,
      de: `${info.width}x${info.height}`, bytes: avif.length, saltada,
      nitidez: `${nitV.toFixed(0)} -> ${nitN.toFixed(0)}`, ssim: s.toFixed(3) });
  } else {
    filas.push({ slug, publica, sustituye: ruta, fuente: deTopaz ? 'topaz' : 'original',
      calidad, de: `${info.width}x${info.height}`, bytes: avif.length });
  }

  await fs.writeFile(salida, avif);
}

// -------------------------------------------------------------------- informe
for (const f of filas) {
  const kb = (f.bytes / 1024).toFixed(0) + ' KB';
  console.log(
    `  ${f.de.padStart(10)} -> ${CLIENTE_ANCHO}x${CLIENTE_ALTO}  q${f.calidad}  ${kb.padStart(7)}`
    + `  ${f.fuente === 'topaz' ? 'TOPAZ ' : 'real  '}${f.slug}`,
  );
  if (f.ssim) console.log(`${' '.repeat(14)}nitidez ${f.nitidez}, SSIM ${f.ssim}`);
  if (f.saltada) console.log(`${' '.repeat(14)}EXCEPCION nombrada: no llega al minimo de nitidez y se publica igual`);
}

const conTecho = filas.filter((f) => f.bytes > TECHO);
if (conTecho.length) {
  console.log(`\n  aviso  ${conTecho.length} no bajan del techo de ${TECHO / 1024} KB ni a q${CALIDADES.at(-1)}:`);
  for (const f of conTecho) console.log(`         ${f.slug}  ${(f.bytes / 1024).toFixed(0)} KB`);
}

if (fallos.length) {
  console.log(`\n  FALLO  ${fallos.length}:`);
  for (const f of fallos) console.log(`         ${f}`);
  process.exit(1);
}

const total = filas.reduce((n, f) => n + f.bytes, 0);
console.log(`\n  ${filas.length} imagenes en public/images/cliente/ (${(total / 1024 / 1024).toFixed(1)} MB en total)`);
console.log(`  montajes lado a lado -> ${path.relative(RAIZ, COMPARATIVAS)}/`);

if (rechazadas.length) {
  console.log(`\n  RECHAZADAS ${rechazadas.length} — se quedan con su AVIF anterior:`);
  for (const r of rechazadas) {
    console.log(`    ${r.slug}`);
    for (const m of r.motivos) console.log(`       · ${m}`);
  }
  console.log('\n  Mira su montaje antes de decidir. Si a 1:1 esta mejor, el numero se');
  console.log('  equivoca y hay que discutir el umbral en scripts/lib/nitidez.mjs — no');
  console.log('  colar la imagen por la puerta de atras.');
  process.exit(1);
}

console.log('\n  MIRA LAS COMPARATIVAS UNA A UNA. Las metricas no ven un poste de mas, un');
console.log('  rotulo distinto ni otro modelo de pergola: eso solo lo ve un ojo.');
console.log('\n  ahora: npm run medir:imagenes');
console.log('         node scripts/generar-paginas.mjs && node scripts/generar-detalle.mjs');
