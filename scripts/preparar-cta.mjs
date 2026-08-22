#!/usr/bin/env node
/**
 * Prepara el lote para generar el fondo del CTA de los 17 productos y servicios.
 *
 *   node scripts/preparar-cta.mjs      (npm run preparar:cta)
 *
 * Deja en ~/Downloads/higgsfield-cta-in/<slug>/ las 3 mejores fotos REALES de ese
 * slug, en JPEG, y su prompt.txt ya montado. Mas un INSTRUCCIONES.md en la raiz.
 *
 * ───────────────────────────────────────────────────────────────────────────────
 * POR QUE ES UN PASO MANUAL
 *
 * Higgsfield no expone API en nuestro plan. La generacion es una sesion a mano en
 * higgsfield.ai, igual que el upscale de preparar-higgsfield.mjs, y por eso el
 * trabajo esta partido en preparar / generar / integrar.
 *
 * ───────────────────────────────────────────────────────────────────────────────
 * LOS NOMBRES SON EL CONTRATO
 *
 * Las imagenes vuelven a ~/Downloads/higgsfield-cta-out/ identificadas SOLO por su
 * nombre: `<slug>.png`. Si dos vuelven llamandose igual, una sobrescribe a la otra y
 * una pagina acaba enseñando el producto de otra —una pergola de lamas cerrando la
 * pagina de carports—. Los slugs salen del disco y son unicos por construccion, pero
 * se comprueba igual ANTES de escribir nada: comprobarlo cuesta cuatro lineas y no
 * comprobarlo costo 429 URLs en 404 la ultima vez que se dio algo por supuesto.
 *
 * ───────────────────────────────────────────────────────────────────────────────
 * POR QUE CARPETAS POR SLUG Y NO UNA SOLA CARPETA PLANA
 *
 * preparar-higgsfield.mjs deja las 115 imagenes en una carpeta plana porque todas
 * comparten el mismo prompt y solo cambia el tamaño objetivo. Aqui cada slug lleva
 * SUS TRES referencias y SU prompt, y en la sesion manual hay que adjuntar las tres
 * que tocan: una carpeta plana con 51 archivos garantiza adjuntar la de al lado.
 *
 * ───────────────────────────────────────────────────────────────────────────────
 * JPEG Y NO AVIF
 *
 * El sitio sirve AVIF, pero higgsfield.ai no lo acepta como adjunto. Se recodifica a
 * JPEG q95: es un paso de ida, la imagen que se publica no sale de aqui, y a q95 no
 * hay artefacto que confunda al modelo sobre el acabado del aluminio.
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { nitidez } from './lib/nitidez.mjs';
import { CTA_SLOTS, EXCLUIR, AVISO_REFERENCIAS } from './lib/cta-slots.mjs';

const RAIZ = path.resolve(import.meta.dirname, '..');
const FRAG = path.join(RAIZ, 'src/contenido-migrado');
const CMS = path.join(RAIZ, 'public/cms-img');
const DESTINO = '/Users/senavia/Downloads/higgsfield-cta-in';
const SALIDA = '/Users/senavia/Downloads/higgsfield-cta-out';

/** Referencias por slug. Tres: mas de tres y la sesion manual se hace interminable. */
const REFERENCIAS = 3;
const CALIDAD_JPEG = 95;
const EXT = /\.(avif|jpe?g|png|webp)$/i;

/**
 * El esqueleto del prompt. IDENTICO para los 17 y no se toca.
 *
 * Sale de medir el componente: `.image-call-to-action` es object-fit:cover a
 * inset:0, `.wrapper-call-to-action` le pone un velo PLANO de 50% negro
 * (linear-gradient(#00000080,#00000080)) y `.box-call-to-action` es una caja
 * centrada de 650px. A 1440 se ve el 100% del ancho por ~66% del alto; a 390, la
 * columna central por el alto completo. De ahi salen la relacion 2.55:1 y la zona
 * calma del 46% x 55% central, que es la que mide scripts/comprobar-cta.mjs.
 */
const PROMPT = (s) => `Photorealistic ultra-wide architectural photograph, 2.55:1, of ${s.producto}
at an upscale waterfront home in ${s.escenario}. Late morning, brilliant
sunlight.

CAMERA
Full-frame, 24mm tilt-shift, f/9, tripod at 1.5 m, verticals perfectly
vertical. Rotate the structure about 15 degrees off dead-center so its
long lines recede — a photograph with volume, never a flat frontal
elevation. Everything is sharp front to back: at f/9 on 24mm the hedge,
the palms, the seawall and the far shoreline are all in focus. No
background blur, no bokeh.

THE SUBJECT — this must be recognizably the product we sell
${s.detalle}

COMPOSITION
The middle of the frame holds an open, airy, medium-toned recession into
depth — a view through or past the structure to a sunlit lawn and the
Intracoastal waterway, softened only by distance. No wall, no panel and
no flat featureless surface closes the middle. Keep every bright
highlight and every busy detail out of the central 46% x 55% of the
frame; that zone belongs to the receding view.
Left third: ${s.izquierda}. Right third: ${s.derecha}.
Structure's top edge across the top 12-18%. Ground plane across the
bottom 15-20%.

LIGHT
Real Florida late-morning sun from the upper left. Every object casts a
consistent directional shadow, and the structure throws a clear angled
shadow across the ground. Deep blue sky with white cumulus. Bright and
airy overall; shaded areas stay OPEN and luminous, around 50-60 percent
grey — never dark brown, never crushed. Foliage in shade reads muted
olive and dark green, never fluorescent lime.

REALISM
Genuine architectural photography for a luxury builder's portfolio.
Single natural exposure, subtle film grain, faint chromatic aberration
at the corners, accurate reflections, slightly irregular paver joints, a
discreet hose bib and an outdoor speaker. Every aluminum member is
perfectly straight and uniform in width, with no bulge at the base;
every countertop and fascia edge is a dead-straight line. No HDR halos,
no orange-and-teal grade, no dusk, no lens flare, no vignette. No
people, no text, no logos, no watermarks.`;

/** El negativo, igual para los 17. */
const NEGATIVO = `blank wall, solid panel, flat featureless surface, projector screen,
enclosed room, dark underexposed interior, crushed blacks, neon or
fluorescent green foliage, background blur, bokeh, shallow depth of
field, bent or bowed posts, wavy countertop edges, floating furniture,
missing shadows, frontal elevation view, tilted verticals, fisheye,
sunset, blue hour, string lights, people, text, watermark, logo, CGI
render, 3D visualization, blurry`;

/** La linea que acompaña a las 3 referencias adjuntas. */
const LINEA_REFERENCIAS = (slug) => {
  const aviso = AVISO_REFERENCIAS[slug];
  return aviso
    ? 'Match the product, materials, finish and proportions of the attached '
      + 'reference photographs. These are real installations by the company; the '
      + 'structure in your image must be recognizably the same product. '
      + aviso
    : 'Match the product, materials, finish, proportions and daylight of the '
      + 'attached reference photographs. These are real installations by the '
      + 'company; the structure in your image must be recognizably the same product.';
};

// --- 1. El catalogo sale del disco -------------------------------------------
//
// Los slugs son los fragmentos, no una lista escrita aqui: si mañana se añade un
// producto, este script lo pide y falla si no tiene slot, en vez de ignorarlo.

const catalogo = [];
for (const col of ['products', 'services']) {
  const slugs = (await fs.readdir(path.join(FRAG, col)))
    .filter((f) => f.endsWith('.html')).map((f) => f.slice(0, -5)).sort();
  for (const slug of slugs) catalogo.push({ col, slug });
}

// --- 2. Validar TODO antes de tocar disco ------------------------------------

const sinCarpeta = [];
const sinSlot = [];
for (const item of catalogo) {
  const dir = path.join(CMS, item.col, item.slug);
  const fotos = await fs.readdir(dir).catch(() => null);
  if (fotos === null) { sinCarpeta.push(`${item.col}/${item.slug}`); continue; }
  item.fotos = fotos.filter((f) => EXT.test(f));
  if (!item.fotos.length) sinCarpeta.push(`${item.col}/${item.slug}  (carpeta vacia)`);
  if (!CTA_SLOTS[item.slug]) sinSlot.push(item.slug);
}

if (sinCarpeta.length) {
  console.error('  FALLO  hay slugs sin fotos en public/cms-img/: no hay con que referenciar.');
  for (const s of sinCarpeta) console.error(`         ${s}`);
  process.exit(1);
}
if (sinSlot.length) {
  console.error('  FALLO  hay slugs sin bloque en scripts/lib/cta-slots.mjs:');
  for (const s of sinSlot) console.error(`         ${s}`);
  console.error('         Sin el, el prompt saldria describiendo «undefined» y la imagen');
  console.error('         no enseñaria el producto de esa pagina. Escribelo MIRANDO sus fotos.');
  process.exit(1);
}
const huerfanos = Object.keys(CTA_SLOTS).filter((s) => !catalogo.some((i) => i.slug === s));
if (huerfanos.length) {
  console.error('  FALLO  hay bloques en cta-slots.mjs que no corresponden a ningun fragmento:');
  for (const s of huerfanos) console.error(`         ${s}`);
  process.exit(1);
}
// El contrato de vuelta es el nombre `<slug>.png`. Los slugs vienen de nombres de
// fichero en dos carpetas distintas, asi que products/x y services/x colisionarian.
const cuenta = new Map();
for (const i of catalogo) cuenta.set(i.slug, (cuenta.get(i.slug) ?? 0) + 1);
const repetidos = [...cuenta].filter(([, n]) => n > 1);
if (repetidos.length) {
  console.error('  FALLO  slugs repetidos entre products/ y services/: la vuelta seria ambigua.');
  for (const [n, c] of repetidos) console.error(`         ${n}  x${c}`);
  process.exit(1);
}
// Una exclusion mal escrita no excluye nada y no da error: se comprueba.
const exclusionesMalas = [];
for (const [slug, ex] of Object.entries(EXCLUIR)) {
  const item = catalogo.find((i) => i.slug === slug);
  if (!item) { exclusionesMalas.push(`${slug}  (slug inexistente)`); continue; }
  for (const f of ex.fotos) if (!item.fotos.includes(f)) exclusionesMalas.push(`${slug}  ${f}`);
}
if (exclusionesMalas.length) {
  console.error('  FALLO  EXCLUIR nombra fotos que no existen: no estarian excluyendo nada.');
  for (const s of exclusionesMalas) console.error(`         ${s}`);
  process.exit(1);
}

// --- 3. Elegir las 3 referencias de cada slug --------------------------------
//
// El criterio es el de auditar-nitidez.mjs —varianza del Laplaciano, via
// lib/nitidez.mjs— multiplicado por la raiz de los pixeles: entre dos fotos igual de
// nitidas gana la que tenga mas pixeles reales que dar. `nitidez()` normaliza a
// 512px antes de medir, asi que la resolucion hay que meterla aparte o no cuenta.
//
// Lo que el numero NO ve —una foto de obra a medio hacer, un plano detalle del techo,
// una escena de noche— sale de EXCLUIR, y se imprime.

console.log('Lote de fondos de CTA para Higgsfield\n');

for (const item of catalogo) {
  const dir = path.join(CMS, item.col, item.slug);
  const excluidas = EXCLUIR[item.slug]?.fotos ?? [];
  const medidas = [];
  for (const f of item.fotos) {
    if (excluidas.includes(f)) continue;
    const buf = await fs.readFile(path.join(dir, f));
    const meta = await sharp(buf).metadata();
    medidas.push({ f, buf, meta, n: await nitidez(buf), px: meta.width * meta.height });
  }
  medidas.sort((a, b) => (b.n * Math.sqrt(b.px)) - (a.n * Math.sqrt(a.px)));
  item.elegidas = medidas.slice(0, REFERENCIAS);
  item.candidatas = medidas.length;
  if (item.elegidas.length < REFERENCIAS) {
    console.error(`  FALLO  ${item.slug} solo tiene ${item.elegidas.length} candidatas tras excluir.`);
    process.exit(1);
  }
}

// --- 4. Escribir ------------------------------------------------------------

await fs.rm(DESTINO, { recursive: true, force: true });
await fs.mkdir(DESTINO, { recursive: true });

for (const item of catalogo) {
  const dir = path.join(DESTINO, item.slug);
  await fs.mkdir(dir, { recursive: true });
  for (const [i, r] of item.elegidas.entries()) {
    const nombre = `ref-${i + 1}-${r.f.replace(EXT, '')}.jpg`;
    await sharp(r.buf).jpeg({ quality: CALIDAD_JPEG }).toFile(path.join(dir, nombre));
  }
  const s = CTA_SLOTS[item.slug];
  const txt = [
    `# ${item.col}/${item.slug}`,
    '',
    '## Prompt',
    '',
    PROMPT(s),
    '',
    '## Negative prompt',
    '',
    NEGATIVO,
    '',
    '## Con las 3 referencias adjuntas, añade esta linea',
    '',
    LINEA_REFERENCIAS(item.slug),
    '',
    '## Salida',
    '',
    `2.55:1 (o la mas ancha disponible y recortar), ancho >= 3000 px.`,
    `Guardar como  ${SALIDA}/${item.slug}.png`,
    '',
  ].join('\n');
  await fs.writeFile(path.join(dir, 'prompt.txt'), txt);
}

// --- 5. INSTRUCCIONES.md ----------------------------------------------------

const conAviso = catalogo.filter((i) => AVISO_REFERENCIAS[i.slug]);
const conExclusion = catalogo.filter((i) => EXCLUIR[i.slug]);

const md = [
  '# Lote de fondos de CTA para Higgsfield',
  '',
  `**${catalogo.length} imagenes**, una por producto y servicio.`,
  'Generado por `node scripts/preparar-cta.mjs` leyendo los fragmentos y `public/cms-img/`.',
  '',
  'Hoy las 201 paginas cierran con la MISMA foto de piscina y pergola. Estas 17 son',
  'para que cada ficha cierre enseñando lo que esa pagina vende. Las ~79 paginas',
  'restantes se quedan con la generica: no hay que generar nada para ellas.',
  '',
  '## Que hacer',
  '',
  '1. Entra en <https://higgsfield.ai>, modo **texto-a-imagen**.',
  '2. Abre la carpeta de un slug. Dentro tienes `prompt.txt` y 3 fotos `ref-*.jpg`.',
  '3. Pega el **Prompt** y, si el campo existe, el **Negative prompt**.',
  '4. **Adjunta las 3 fotos `ref-*.jpg` de ESA carpeta** y añade al prompt la linea',
  '   que viene en `prompt.txt` bajo «Con las 3 referencias adjuntas». Es lo que ata',
  '   la imagen al producto real: sin ella sale una pergola generica de catalogo.',
  '5. Relacion **2.55:1** (o la mas ancha que ofrezca, y recortas). Ancho **>= 3000 px**.',
  '6. Descarga el resultado y **guardalo en `~/Downloads/higgsfield-cta-out/` con el',
  '   nombre `<slug>.png`** — el mismo nombre que la carpeta. La extension puede',
  '   cambiar (PNG, JPEG, WebP: se recodifica a AVIF luego); **el nombre no**.',
  '',
  '> **El nombre es lo unico que identifica cada imagen en la vuelta.** Si dos acaban',
  '> llamandose igual, una sobrescribe a la otra y una pagina acaba cerrando con el',
  '> producto de otra: una pergola de lamas despidiendo la pagina de carports.',
  '',
  '## No hace falta hacerlas todas de una vez',
  '',
  `Son ${catalogo.length} generaciones de una en una. La integracion acepta lotes`,
  'parciales —solo mira lo que haya en `~/Downloads/higgsfield-cta-out/`— asi que se',
  'puede hacer en varias tandas sin perder nada. **Un slug sin imagen se queda con el',
  'fondo generico de hoy**, que es exactamente lo que se ve ahora: no rompe nada.',
  '',
  'Si hay que elegir un orden, los 10 productos primero: llevan el bloque de CTA dos',
  'veces por pagina y son las fichas con mas trafico.',
  '',
  '## Que NO hace falta que salga perfecto',
  '',
  'No hay que medir nada aqui. Al volver, `node scripts/integrar-cta.mjs` rechaza',
  'automaticamente lo que se salga de 2.45-2.65:1, lo que no llegue a 3000 px de',
  'ancho, y lo que tenga el centro demasiado oscuro, demasiado claro o demasiado',
  'plano para que el titular blanco se lea encima. Genera ademas un montaje de cada',
  'una contra sus 3 referencias, con el velo y la caja de texto superpuestos.',
  '',
  '**Lo que la puerta NO puede medir es si es el producto correcto.** Una pergola de',
  'lamas preciosa en la pagina de carports pasa todas las comprobaciones. Por eso hay',
  'que mirar los montajes uno a uno antes de aplicar.',
  '',
  '## Los 17',
  '',
  '| # | Slug | Producto | Escenario | Fotos usadas / candidatas |',
  '|---|---|---|---|---|',
  ...catalogo.map((i, n) =>
    `| ${n + 1} | \`${i.slug}\` | ${CTA_SLOTS[i.slug].producto} | ${CTA_SLOTS[i.slug].escenario}`
    + ` | ${i.elegidas.length} de ${i.candidatas} |`),
  '',
  ...(conExclusion.length ? [
    '### Fotos apartadas a mano',
    '',
    'La nitidez y la resolucion no ven que una foto sea de obra a medio hacer, un',
    'plano detalle o una escena de noche. Estas se excluyeron por eso:',
    '',
    '| Slug | Fotos | Motivo |',
    '|---|---|---|',
    ...conExclusion.map((i) => `| \`${i.slug}\` | ${EXCLUIR[i.slug].fotos.length} | ${EXCLUIR[i.slug].motivo} |`),
    '',
  ] : []),
  ...(conAviso.length ? [
    '### Slugs cuyas referencias NO valen como guia de luz',
    '',
    'En estos, la linea de las referencias **no** pide copiar la hora del dia, porque',
    'las mejores fotos del producto son de atardecer, de noche o renders. Ya viene',
    'corregida en su `prompt.txt`; no hay que hacer nada especial, solo saberlo.',
    '',
    ...conAviso.map((i) => `- \`${i.slug}\` — ${AVISO_REFERENCIAS[i.slug].split('.')[0]}.`),
    '',
  ] : []),
  '## El prompt',
  '',
  'El esqueleto es el mismo para los 17 y solo cambian cuatro bloques: el producto,',
  'el escenario y lo que acompaña a izquierda y derecha. Cada `prompt.txt` ya viene',
  'montado, no hay que rellenar nada.',
  '',
  'Los numeros de la composicion no son de gusto: el CTA pinta la imagen con',
  '`object-fit:cover` bajo un velo plano del 50% de negro, con una caja de texto',
  'centrada de 650px. A 1440 px se ve el 100% del ancho por el 66% del alto; a 390 px,',
  'la columna central por el alto completo. Por eso se pide 2.55:1 y por eso el centro',
  'tiene que quedar despejado: ahi va el titular.',
  '',
  '## Cuando termines',
  '',
  '```bash',
  'node scripts/integrar-cta.mjs            # juzga y genera los montajes',
  '# mira auditoria-imagenes/cta/ una a una',
  'node scripts/integrar-cta.mjs --aplicar  # escribe las aprobadas',
  '```',
  '',
].join('\n');

await fs.writeFile(path.join(DESTINO, 'INSTRUCCIONES.md'), md);

// --- 6. Informe --------------------------------------------------------------

for (const item of catalogo) {
  const ex = EXCLUIR[item.slug];
  console.log(`  ${item.slug.padEnd(30)} ${item.elegidas.length}/${item.candidatas} refs`
    + (ex ? `   EXCLUIDAS ${ex.fotos.length}: ${ex.motivo}` : ''));
  for (const r of item.elegidas) {
    console.log(`      ${String(Math.round(r.n)).padStart(5)}  ${String(r.meta.width)}x${r.meta.height}  ${r.f}`);
  }
}

console.log(`\n  ${catalogo.length} carpetas -> ${DESTINO}/`);
if (conAviso.length) console.log(`  ${conAviso.length} con la linea de referencias corregida (refs de noche, atardecer o render)`);
console.log(`  instrucciones -> ${DESTINO}/INSTRUCCIONES.md`);
console.log(`\n  Los resultados van a ${SALIDA}/ con el nombre <slug>.png.\n`);
