#!/usr/bin/env node
/**
 * Auditoria de NITIDEZ. Sobre dist/, DESPUES de `npm run build`.
 *
 *     npm run build && node scripts/auditar-nitidez.mjs
 *
 * QUE PREGUNTA RESPONDE
 *
 * `check:imagenes` demuestra que la imagen EXISTE. No dice nada de si se ve bien.
 * Una foto de 525x350 pintada en una tarjeta de 400px pasa esa puerta y se ve
 * blanda en cualquier pantalla retina, porque a DPR 2 esa tarjeta pide 800px
 * reales y solo hay 525.
 *
 * Aqui se mide eso: el tamano INTRINSECO contra el tamano de DISPLAY real.
 *
 * LAS CUATRO MARCAS
 *
 *   SUB-RESOLUCION   px_intrinsecos < 1.5 x px_display.
 *                    El ideal en retina es 2x. Por debajo de 1.5x ya se nota.
 *                    Se usa 1.5 y no 2 a proposito: con 2 fallarian casi todas
 *                    las 1250px del CMS, y una lista donde falla todo no sirve
 *                    para priorizar nada.
 *
 *   BLANDA           Varianza del Laplaciano sobre luminancia. Detecta la foto
 *                    que TIENE los pixeles pero no el detalle: alguien la escalo
 *                    antes que nosotros y el upscale metio pixeles interpolados.
 *                    El tamano cuadra y aun asi se ve mal.
 *
 *                    NORMALIZADA. La varianza del Laplaciano crece con la
 *                    resolucion y con el contenido, asi que medirla en crudo
 *                    comparara una foto de 450px con una de 1600px y dira
 *                    tonterias. Se reescala TODO a un ancho fijo antes de medir.
 *
 *                    El umbral es una FRACCION DE LA MEDIANA del corpus, no un
 *                    percentil. Ver la nota larga en FACTOR_BLANDA: un umbral por
 *                    percentil marca siempre el mismo porcentaje de imagenes,
 *                    tenga el corpus el problema o no.
 *
 *   SOBRECOMPRIMIDA  bytes/px muy por debajo de la mediana del corpus. Mismo
 *                    criterio y por la misma razon.
 *
 *   BLOQUES JPEG     AVISO HONESTO: de las 462 imagenes rasterizadas que sirve
 *                    el sitio solo CUATRO son JPEG. AVIF no tiene bloques 8x8 —su
 *                    transformada no funciona asi—, de modo que buscar bloqueo
 *                    JPEG en un corpus 99% AVIF es teatro. Se mide en las que
 *                    corresponde y se dice cuantas son. No se infla la cobertura.
 *
 * QUE SE IGNORA
 *   SVG y los iconos/logos vectoriales: no tienen resolucion intrinseca que
 *   valga, escalan solos.
 *
 * POR QUE PLAYWRIGHT Y POR QUE NO ESTA EN `npm run check`
 *
 * El tamano de display es una propiedad del LAYOUT: depende del CSS, del
 * viewport y de donde cae la imagen. No se puede deducir del HTML. Hace falta un
 * navegador.
 *
 * Pero `comprobar-carruseles.mjs` dejo escrito por que la puerta no lleva
 * navegador ("~300 MB y un navegador mas que mantener"), y eso sigue siendo
 * cierto. Asi que Playwright es devDependency de ESTE script y de ningun otro:
 * la auditoria es una herramienta que se corre a mano, no una puerta. `npm run
 * check` sigue sin navegador.
 *
 * `npm run preview` no vale (el adaptador de Vercel no trae servidor de
 * preview), asi que se sirve dist/ con un servidor estatico de 30 lineas.
 *
 * La pasada de navegador se CACHEA en auditoria-imagenes/display.json: son ~15
 * minutos y solo cambia si cambia el CSS o el markup, mientras que los umbrales se
 * retocan a menudo. Con --remedir se rehace, y hay que usarlo despues de tocar la
 * maquetacion: una cache silenciosa que se queda vieja mide el sitio de anteayer.
 */
import fs from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import sharp from 'sharp';
import { chromium } from 'playwright';
import { raizHtml } from './lib/dist.mjs';
// La metrica vive aparte porque la comparte integrar-higgsfield.mjs: son las dos
// caras de la misma decision y no pueden medir distinto.
import { nitidez, ANCHO_NITIDEZ, autocomprobar } from './lib/nitidez.mjs';

const RAIZ = path.resolve(import.meta.dirname, '..');
const PUBLIC = path.join(RAIZ, 'public');
const SALIDA = path.join(RAIZ, 'auditoria-imagenes');
const DIST = await raizHtml();

/** Viewports donde se mide. 1440 = escritorio comun, 390 = iPhone moderno. */
const VIEWPORTS = [
  { nombre: 'escritorio', width: 1440, height: 900 },
  { nombre: 'movil', width: 390, height: 844 },
];

/** px_intrinsecos / px_display por debajo de esto = SUB-RESOLUCION. */
const FACTOR_MINIMO = 1.5;

/**
 * BLANDA / SOBRECOMPRIMIDA se deciden contra la MEDIANA del corpus, no contra un
 * percentil.
 *
 * La primera version usaba percentiles y estaba mal, de una forma que solo se ve
 * mirando el resultado dos veces: un umbral en el percentil 15 marca **siempre**
 * el 15% de las imagenes, tenga el corpus el problema o no. Medido: tras arreglar
 * un fallo que hundia la nitidez de 5 fotos, el numero de "blandas" seguia siendo
 * exactamente 69 — porque 69 es el 15% de 462. Un umbral que garantiza su propio
 * recuento no esta midiendo nada.
 *
 * Una fraccion de la mediana si responde a la pregunta que importa: "¿esta esta
 * imagen MUY por debajo de lo que es normal en este sitio?". Si todo el corpus
 * fuera nitido, no se marcaria ninguna.
 *
 * Sigue siendo relativo al corpus a proposito: la varianza del Laplaciano depende
 * del contenido —un cielo liso puntua bajo aunque el archivo este perfecto— asi
 * que una constante universal marcaria las fotos de cielo y dejaria pasar las de
 * textura mal escalada.
 */
const FACTOR_BLANDA = 0.40;
const FACTOR_COMPRESION = 0.45;

const EXT_RASTER = /\.(avif|webp|png|jpe?g)$/i;

// ---------------------------------------------------------------- 0. servidor
// dist/client servido tal cual, con el mismo mapeo de rutas que hace Vercel:
// /foo -> foo/index.html. Sin esto las 107 paginas dan 404 y la medicion sale
// vacia... en verde, que es justo el fallo que este repo persigue en todas sus
// puertas.
const TIPOS = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript',
  '.svg': 'image/svg+xml', '.avif': 'image/avif', '.webp': 'image/webp',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.woff2': 'font/woff2', '.json': 'application/json', '.xml': 'application/xml',
  '.mp4': 'video/mp4', '.webm': 'video/webm', '.ico': 'image/x-icon',
};

const servidor = http.createServer(async (req, res) => {
  const url = decodeURIComponent(req.url.split('?')[0]);
  const candidatos = url.endsWith('/')
    ? [path.join(DIST, url, 'index.html')]
    : [path.join(DIST, url), path.join(DIST, url + '.html'), path.join(DIST, url, 'index.html')];
  for (const p of candidatos) {
    // path.resolve + startsWith: un `..` en la url no puede salir de dist/.
    if (!path.resolve(p).startsWith(DIST)) continue;
    const buf = await fs.readFile(p).catch(() => null);
    if (!buf) continue;
    res.writeHead(200, { 'content-type': TIPOS[path.extname(p).toLowerCase()] ?? 'application/octet-stream' });
    return res.end(buf);
  }
  res.writeHead(404).end('404');
});

await new Promise((r) => servidor.listen(0, '127.0.0.1', r));
const BASE = `http://127.0.0.1:${servidor.address().port}`;

// ------------------------------------------------------- 1. rutas a visitar
async function listar(dir, base = dir) {
  const out = [];
  for (const e of await fs.readdir(dir, { withFileTypes: true }).catch(() => [])) {
    if (e.name.startsWith('.')) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...(await listar(p, base)));
    else out.push(path.relative(base, p).split(path.sep).join('/'));
  }
  return out;
}

const paginas = (await listar(DIST))
  .filter((f) => f.endsWith('.html'))
  .map((f) => '/' + f.replace(/index\.html$/, '').replace(/\.html$/, ''))
  .sort();

console.log('Auditoria de nitidez\n');

// La metrica se comprueba a si misma ANTES de medir nada. El fallo del canal alfa
// —nitidez 0,0 sin dar error— ya mando a la cola 5 fotos que estaban bien, y solo
// se descubrio porque una fotografia real no puede medir exactamente 0,0. Una
// auditoria cuya regla esta rota es peor que no auditar: da una lista con pinta de
// razonada.
{
  const fallos = await autocomprobar();
  if (fallos.length) {
    console.log('  FALLO la metrica de nitidez esta rota, la auditoria no valdria nada:');
    for (const f of fallos) console.log(`        ${f}`);
    servidor.close();
    process.exit(1);
  }
  console.log('  ok    la metrica de nitidez pasa su autocomprobacion');
}

console.log(`  ${paginas.length} paginas servidas desde ${path.relative(RAIZ, DIST)}/`);

// -------------------------------------------- 2. medir el display en el navegador
// ruta de imagen -> { display: {viewport -> [w,h] mayor visto}, paginas: Set }
const uso = new Map();

// La pasada de navegador tarda ~15 minutos (368 cargas de pagina) y lo que
// produce solo cambia si cambia el CSS o el markup. Las metricas de archivo, en
// cambio, se retocan a menudo. Se cachea para poder iterar sobre los umbrales sin
// volver a pagar los 15 minutos.
//
// Con --remedir se rehace. Es lo que hay que usar despues de tocar CSS o layout:
// una cache silenciosa que se queda vieja mide el sitio de anteayer.
const CACHE = path.join(SALIDA, 'display.json');
const cacheado = process.argv.includes('--remedir')
  ? null
  : await fs.readFile(CACHE, 'utf8').then(JSON.parse).catch(() => null);

if (cacheado) {
  for (const [ruta, e] of Object.entries(cacheado.uso)) {
    uso.set(ruta, { display: e.display, paginas: new Set(e.paginas) });
  }
  console.log(`  display REUTILIZADO de ${path.relative(RAIZ, CACHE)} (${cacheado.generado})`);
  console.log(`  ${uso.size} imagenes, ${cacheado.paginas} paginas. Usa --remedir tras tocar CSS o layout.\n`);
}

const navegador = cacheado ? null : await chromium.launch();
if (!cacheado) {
for (const vp of VIEWPORTS) {
  const ctx = await navegador.newContext({
    viewport: { width: vp.width, height: vp.height },
    // DPR 1: lo que se mide es el tamano CSS, no el fisico. El factor 2 de
    // retina se aplica despues, en el umbral. Medir a DPR 2 lo contaria dos
    // veces.
    deviceScaleFactor: 1,
    reducedMotion: 'reduce',
  });

  // TODO lo que no sea nuestro servidor se ABORTA. Sin esto la auditoria no
  // termina: cada pagina carga jQuery desde d3e54v103j8qbb.cloudfront.net y
  // `waitUntil` se queda esperando esa peticion. Medido: 26 minutos con los
  // procesos de Chromium al 0% de CPU, o sea parados, no trabajando.
  //
  // Y no falsea la medida. Lo que se mide es el tamano de DISPLAY, que sale del
  // CSS —todo local— y no de terceros. Sin jQuery no arranca IX2, asi que los
  // elementos con anti-FOUC se quedan en `opacity:0`; da igual, la opacidad no
  // cambia getBoundingClientRect(). Los videos tambien se cortan: son 47 MB y no
  // son imagenes.
  await ctx.route('**/*', (ruta) => {
    const url = ruta.request().url();
    if (!url.startsWith(BASE)) return ruta.abort();
    if (/\.(mp4|webm|mov)$/i.test(url)) return ruta.abort();
    return ruta.continue();
  });

  const pag = await ctx.newPage();
  pag.setDefaultTimeout(15000);
  let n = 0;
  for (const ruta of paginas) {
    // `domcontentloaded` y no `load`: lo que hace falta es el DOM y el CSS, que
    // el navegador ya ha aplicado. Esperar a `load` es esperar a que TERMINEN de
    // descargarse las imagenes, y son justo las 471 que estamos auditando.
    await pag.goto(BASE + ruta, { waitUntil: 'domcontentloaded', timeout: 15000 }).catch(() => null);
    // Las imagenes son lazy: sin bajar, las de abajo no se cargan y el navegador
    // les da la caja del width/height declarado igualmente — pero el recorrido
    // asegura que el layout esta resuelto en toda la pagina, no solo arriba.
    await pag.evaluate(async () => {
      const alto = window.innerHeight;
      for (let y = 0; y < document.body.scrollHeight; y += alto) {
        window.scrollTo(0, y);
        await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      }
      window.scrollTo(0, 0);
      await new Promise((r) => requestAnimationFrame(r));
    }).catch(() => null);

    const medidas = await pag.evaluate(() => {
      const out = [];
      for (const img of document.querySelectorAll('img')) {
        const r = img.getBoundingClientRect();
        // Una imagen con caja 0 no esta pintada (display:none, o un carrusel
        // cuyo contenedor esta colapsado): no dice nada sobre su tamano.
        if (r.width < 1 || r.height < 1) continue;
        const src = img.currentSrc || img.src;
        if (!src) continue;
        out.push([new URL(src, location.href).pathname, Math.round(r.width), Math.round(r.height)]);
      }
      return out;
    }).catch(() => []);

    for (const [src, w, h] of medidas) {
      if (!/^\/(images|cms-img)\//.test(src)) continue;
      const clave = decodeURIComponent(src);
      if (!uso.has(clave)) uso.set(clave, { display: {}, paginas: new Set() });
      const e = uso.get(clave);
      e.paginas.add(ruta);
      // Se guarda el display MAYOR: es el caso peor, el que decide si hace falta
      // mas resolucion. Si la misma foto sale a 300px en una tarjeta y a 1200px
      // en un hero, la que manda es la de 1200.
      const prev = e.display[vp.nombre];
      if (!prev || w * h > prev[0] * prev[1]) e.display[vp.nombre] = [w, h];
    }
    if (++n % 25 === 0) console.log(`  ${vp.nombre}: ${n}/${paginas.length} paginas`);
  }
  await ctx.close();
  console.log(`  ${vp.nombre} (${vp.width}px): ${n} paginas, ${uso.size} imagenes vistas`);
}
await navegador.close();

await fs.mkdir(SALIDA, { recursive: true });
await fs.writeFile(CACHE, JSON.stringify({
  generado: new Date().toISOString(),
  paginas: paginas.length,
  viewports: VIEWPORTS,
  uso: Object.fromEntries(
    [...uso].map(([r, e]) => [r, { display: e.display, paginas: [...e.paginas] }]),
  ),
}, null, 0) + '\n');
}
servidor.close();

// ------------------------------------------------- 3. medir el archivo en disco
const dim = JSON.parse(await fs.readFile(path.join(RAIZ, 'src/lib/img-dim.json'), 'utf8'));

/**
 * Varianza del Laplaciano sobre luminancia, con el tamano normalizado.
 *
 * El kernel es el Laplaciano de 4 vecinos. `convolve` de sharp satura a 8 bits,
 * asi que los valores vuelven en 0..255 y lo que se mide es la varianza de esa
 * respuesta: mucha = bordes marcados = detalle real; poca = todo suave.
 */
/**
 * Energia de bloque 8x8: cuanto mas fuerte es la discontinuidad JUSTO en los
 * limites de bloque frente a las demas columnas/filas. Es la firma del bloqueo
 * JPEG. Solo tiene sentido en JPEG.
 */
async function bloques8(buf) {
  const { data, info } = await sharp(buf).removeAlpha().greyscale().raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;
  let enBorde = 0, nBorde = 0, fuera = 0, nFuera = 0;
  for (let y = 0; y < h; y++) {
    for (let x = 1; x < w; x++) {
      const d = Math.abs(data[y * w + x] - data[y * w + x - 1]);
      if (x % 8 === 0) { enBorde += d; nBorde++; } else { fuera += d; nFuera++; }
    }
  }
  if (!nBorde || !nFuera || !fuera) return 1;
  return (enBorde / nBorde) / (fuera / nFuera);
}

const filas = [];
for (const [ruta, u] of uso) {
  if (!EXT_RASTER.test(ruta)) continue;   // SVG fuera
  const abs = path.join(PUBLIC, ruta.slice(1));
  const buf = await fs.readFile(abs).catch(() => null);
  if (!buf) { console.error(`  !! no esta en disco: ${ruta}`); continue; }

  const intr = dim[ruta] ?? (await sharp(buf).metadata().then((m) => [m.width, m.height]));
  const [iw, ih] = intr;
  const px = iw * ih;

  const esJpeg = /\.jpe?g$/i.test(ruta);
  filas.push({
    ruta,
    intr: [iw, ih],
    display: u.display,
    paginas: [...u.paginas].sort(),
    bytes: buf.length,
    bytesPorPx: buf.length / px,
    nitidez: await nitidez(buf),
    bloques: esJpeg ? await bloques8(buf) : null,
    formato: path.extname(ruta).slice(1).toLowerCase(),
  });
}

console.log(`  ${filas.length} imagenes rasterizadas medidas (SVG excluidos)\n`);

// ----------------------------------------------------- 4. umbrales del corpus
const percentil = (xs, p) => {
  const s = [...xs].sort((a, b) => a - b);
  return s[Math.max(0, Math.min(s.length - 1, Math.floor((p / 100) * s.length)))];
};
const mediana = (xs) => percentil(xs, 50);

const MEDIANA_NITIDEZ = mediana(filas.map((f) => f.nitidez));
const MEDIANA_BYTES = mediana(filas.map((f) => f.bytesPorPx));
const UMBRAL_NITIDEZ = MEDIANA_NITIDEZ * FACTOR_BLANDA;
const UMBRAL_BYTES = MEDIANA_BYTES * FACTOR_COMPRESION;
/** Por encima de esto, el bloqueo 8x8 es visible. Solo aplica a JPEG. */
const UMBRAL_BLOQUES = 1.15;

// -------------------------------------------------------------- 5. veredicto
for (const f of filas) {
  const motivos = [];
  // El objetivo es 2x el display mayor de los dos viewports: es lo que pide una
  // pantalla retina. `factor` es lo que hay AHORA respecto a ese display.
  const displays = Object.values(f.display);
  const mayor = displays.reduce((a, b) => (a[0] > b[0] ? a : b), [0, 0]);
  f.displayMayor = mayor;
  f.objetivo = [mayor[0] * 2, mayor[1] * 2];
  f.factor = mayor[0] ? f.intr[0] / mayor[0] : Infinity;

  if (mayor[0] && f.factor < FACTOR_MINIMO) {
    motivos.push(`SUB-RESOLUCION (${f.factor.toFixed(2)}x, minimo ${FACTOR_MINIMO}x)`);
  }
  if (f.nitidez < UMBRAL_NITIDEZ) {
    motivos.push(`BLANDA (nitidez ${f.nitidez.toFixed(0)}, ${(f.nitidez / MEDIANA_NITIDEZ * 100).toFixed(0)}% de la mediana ${MEDIANA_NITIDEZ.toFixed(0)})`);
  }
  if (f.bytesPorPx < UMBRAL_BYTES) {
    motivos.push(`SOBRECOMPRIMIDA (${f.bytesPorPx.toFixed(3)} B/px, ${(f.bytesPorPx / MEDIANA_BYTES * 100).toFixed(0)}% de la mediana ${MEDIANA_BYTES.toFixed(3)})`);
  }
  if (f.bloques !== null && f.bloques > UMBRAL_BLOQUES) {
    motivos.push(`BLOQUES JPEG (${f.bloques.toFixed(2)}x en los limites de 8px)`);
  }
  f.motivos = motivos;
  // Gravedad: lo que mas se nota es la falta de pixeles. Se ordena por cuanto
  // falta para el minimo, y a igualdad por numero de marcas.
  f.gravedad = (mayor[0] && f.factor < FACTOR_MINIMO ? (FACTOR_MINIMO - f.factor) * 100 : 0) + motivos.length;
}

const fallan = filas.filter((f) => f.motivos.length).sort((a, b) => b.gravedad - a.gravedad);

// ------------------------------------------------------------- 6. salidas
await fs.mkdir(SALIDA, { recursive: true });

const jpegs = filas.filter((f) => f.formato === 'jpg' || f.formato === 'jpeg').length;
const fmt = (d) => (d && d[0] ? `${d[0]}x${d[1]}` : '—');

const md = [
  '# Auditoria de nitidez de imagenes',
  '',
  `Generado sobre \`${path.relative(RAIZ, DIST)}/\` tras \`npm run build\`.`,
  '',
  '## Resumen',
  '',
  `| | |`,
  `|---|---|`,
  `| Paginas recorridas | ${paginas.length} |`,
  `| Imagenes rasterizadas servidas | **${filas.length}** |`,
  `| **Fallan al menos un umbral** | **${fallan.length}** |`,
  `| Pasan | ${filas.length - fallan.length} |`,
  '',
  '## Umbrales',
  '',
  `- **SUB-RESOLUCION**: \`px_intrinsecos < ${FACTOR_MINIMO} x px_display\`. El display es el MAYOR`,
  `  visto entre ${VIEWPORTS.map((v) => `${v.width}px`).join(' y ')}, medido con el layout real.`,
  `  El px objetivo es 2x ese display (DPR 2).`,
  `- **BLANDA**: varianza del Laplaciano sobre luminancia, normalizada a ${ANCHO_NITIDEZ}px de ancho.`,
  `  Umbral = **${(FACTOR_BLANDA * 100).toFixed(0)}% de la mediana del corpus** (mediana ${MEDIANA_NITIDEZ.toFixed(0)} -> umbral ${UMBRAL_NITIDEZ.toFixed(0)}).`,
  `- **SOBRECOMPRIMIDA**: bytes/px < ${(FACTOR_COMPRESION * 100).toFixed(0)}% de la mediana`,
  `  (mediana ${MEDIANA_BYTES.toFixed(3)} -> umbral **${UMBRAL_BYTES.toFixed(3)} B/px**).`,
  '',
  '> **Por que fraccion de la mediana y no percentil.** La primera version usaba el percentil 15',
  '> y estaba mal: un umbral en el percentil 15 marca **siempre** el 15% de las imagenes, tenga el',
  '> corpus el problema o no. Se vio al arreglar un fallo que hundia la nitidez de 5 fotos: el',
  '> numero de "blandas" seguia siendo exactamente 69, que es el 15% de 462. Un umbral que',
  '> garantiza su propio recuento no mide nada.',
  '>',
  '> Sigue siendo relativo al corpus a proposito: la varianza del Laplaciano depende del contenido',
  '> —un cielo liso puntua bajo aunque el archivo este perfecto— asi que una constante universal',
  '> marcaria las fotos de cielo y dejaria pasar las de textura mal escalada.',
  `- **BLOQUES JPEG**: relacion de discontinuidad en los limites de 8px > ${UMBRAL_BLOQUES}.`,
  '',
  `> **Cobertura real de la marca de bloques**: solo **${jpegs} de ${filas.length}** imagenes servidas son JPEG.`,
  `> El resto es AVIF, que no usa bloques 8x8 —su transformada no funciona asi—, de modo que`,
  `> buscar bloqueo JPEG ahi no mide nada. Se aplica donde corresponde y se dice cuantas son.`,
  '',
  '## Ignoradas a proposito',
  '',
  'SVG e iconos/logos vectoriales: no tienen resolucion intrinseca, escalan solos.',
  '',
  `## Las ${fallan.length} que fallan (por gravedad)`,
  '',
  '| # | Ruta | Actual | Display 1440 | Display 390 | Objetivo | Motivo | Paginas |',
  '|---|---|---|---|---|---|---|---|',
  ...fallan.map((f, i) =>
    `| ${i + 1} | \`${f.ruta}\` | ${fmt(f.intr)} | ${fmt(f.display.escritorio)} | ${fmt(f.display.movil)}`
    + ` | ${fmt(f.objetivo)} | ${f.motivos.join('<br>')} | ${f.paginas.length}`
    + (f.paginas.length ? ` (${f.paginas.slice(0, 3).join(', ')}${f.paginas.length > 3 ? ', …' : ''})` : '')
    + ' |'),
  '',
  '## Las que pasan',
  '',
  '<details><summary>' + (filas.length - fallan.length) + ' imagenes sin marca</summary>',
  '',
  '| Ruta | Actual | Display mayor | Factor | Nitidez | B/px |',
  '|---|---|---|---|---|---|',
  ...filas.filter((f) => !f.motivos.length).sort((a, b) => a.ruta.localeCompare(b.ruta)).map((f) =>
    `| \`${f.ruta}\` | ${fmt(f.intr)} | ${fmt(f.displayMayor)} | ${Number.isFinite(f.factor) ? f.factor.toFixed(2) + 'x' : '—'}`
    + ` | ${f.nitidez.toFixed(1)} | ${f.bytesPorPx.toFixed(3)} |`),
  '',
  '</details>',
  '',
].join('\n');

await fs.writeFile(path.join(SALIDA, 'informe.md'), md);

// La cola lleva TODO lo que hace falta para el viaje de ida y vuelta: el nombre
// plano con el que viaja a Higgsfield, la ruta del repo a la que vuelve, y las
// metricas de partida contra las que se juzgara el resultado.
//
// Los nombres se aplanan (cms-img tiene rutas anidadas) y pueden colisionar: dos
// `hero-....avif` en carpetas distintas. Se desambigua con un sufijo y se anota,
// porque el usuario devuelve los ficheros por NOMBRE y una colision silenciosa
// escribiria la foto de un post encima de la de otro.
const vistos = new Map();
const cola = fallan.map((f) => {
  const base = path.basename(f.ruta);
  const n = (vistos.get(base) ?? 0) + 1;
  vistos.set(base, n);
  const ext = path.extname(base);
  return {
    archivo: n === 1 ? base : `${base.slice(0, -ext.length)}__${n}${ext}`,
    colision: n > 1,
    ruta: f.ruta,
    clase: f.ruta.startsWith('/cms-img/') ? 'content' : 'design',
    actual: { width: f.intr[0], height: f.intr[1], bytes: f.bytes },
    display: f.display,
    objetivo: { width: f.objetivo[0], height: f.objetivo[1] },
    metricas: { nitidez: f.nitidez, bytesPorPx: f.bytesPorPx, bloques: f.bloques },
    motivos: f.motivos,
    paginas: f.paginas,
  };
});

await fs.writeFile(
  path.join(SALIDA, 'cola-higgsfield.json'),
  JSON.stringify({
    generado: new Date().toISOString(),
    umbrales: {
      factorMinimo: FACTOR_MINIMO,
      nitidez: UMBRAL_NITIDEZ, medianaNitidez: MEDIANA_NITIDEZ,
      bytesPorPx: UMBRAL_BYTES, medianaBytesPorPx: MEDIANA_BYTES,
      bloques: UMBRAL_BLOQUES,
      anchoNitidez: ANCHO_NITIDEZ,
    },
    total: filas.length,
    fallan: fallan.length,
    imagenes: cola,
  }, null, 2) + '\n',
);

// --------------------------------------------------------------- 7. consola
const cuentaPor = (marca) => fallan.filter((f) => f.motivos.some((m) => m.startsWith(marca))).length;

console.log(`  total rasterizadas   ${filas.length}`);
console.log(`  FALLAN               ${fallan.length}`);
console.log(`     sub-resolucion    ${cuentaPor('SUB-RESOLUCION')}`);
console.log(`     blandas           ${cuentaPor('BLANDA')}`);
console.log(`     sobrecomprimidas  ${cuentaPor('SOBRECOMPRIMIDA')}`);
console.log(`     bloques JPEG      ${cuentaPor('BLOQUES')}   (de ${jpegs} JPEG servidos)`);
if (cola.some((c) => c.colision)) {
  console.log(`\n  ${cola.filter((c) => c.colision).length} nombre(s) colisionan al aplanar: desambiguados con __N`);
}
console.log(`\n  -> ${path.relative(RAIZ, path.join(SALIDA, 'informe.md'))}`);
console.log(`  -> ${path.relative(RAIZ, path.join(SALIDA, 'cola-higgsfield.json'))}\n`);
