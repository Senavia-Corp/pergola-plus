#!/usr/bin/env node
/**
 * Integra los fondos de CTA de producto y servicio: los juzga y los publica.
 *
 *   node scripts/integrar-cta.mjs            juzga y genera los montajes. NO escribe.
 *   node scripts/integrar-cta.mjs --aplicar  escribe las aprobadas.
 *
 * ───────────────────────────────────────────────────────────────────────────────
 * DE DONDE SALEN LAS IMAGENES: FOTOGRAFIA REAL, Y SOLO ESO
 *
 * Este script nacio como la vuelta de una sesion de generacion con IA. Esa mitad se
 * retiro el 28-08-2026 junto con el prompt que vivia en lib/cta-slots.mjs: el fondo
 * del CTA es lo ultimo que ve quien esta a punto de pedir presupuesto, y una pergola
 * inventada ahi es la pagina de un contratista CON LICENCIA ensenando obra que no
 * existe. Ver la cabecera de lib/cta-slots.mjs para el porque completo.
 *
 * Lo que queda vale igual, y por eso se conserva: pon en ENTRADA la fotografia REAL
 * que mande el cliente, llamada `<slug>.png`, y este script mide si sirve y ensena el
 * montaje para que un humano lo apruebe. Si no hay foto, esa pagina se queda con el
 * fondo generico, que es lo de hoy en las 201.
 *
 * ───────────────────────────────────────────────────────────────────────────────
 * LO QUE ESTE SCRIPT NO PUEDE HACER, DICHO CLARO
 *
 * LA PUERTA NO DISTINGUE UN PRODUCTO DE OTRO. Mide relacion, resolucion y si el
 * centro deja leer el titular encima: nada mas. Una pergola de lamas preciosa
 * cerrando la pagina de CARPORTS pasa las cuatro medidas con nota, y el visitante
 * que buscaba una cubierta de coche se va con la idea equivocada de lo que vendemos.
 *
 * Por eso se genera un montaje de cada una CONTRA SUS TRES REFERENCIAS, con el velo
 * del 50% y la caja de texto superpuestos, y por eso este script no escribe nada sin
 * `--aplicar`. Hay que mirarlos uno a uno.
 *
 * ───────────────────────────────────────────────────────────────────────────────
 * LOS NOMBRES SON EL CONTRATO
 *
 * Cada imagen se identifica SOLO por su nombre: `<slug>.png`. Lo que no case con un
 * slug del disco se reporta como huerfano y no se toca — nunca se adivina a que
 * pagina pertenece una imagen.
 *
 * ───────────────────────────────────────────────────────────────────────────────
 * UN SLUG RECHAZADO NO ES UN PROBLEMA
 *
 * Se queda sin fichero en public/images/cta/, y transformar.mjs deriva su mapa de esa
 * carpeta: sin fichero, esa pagina sigue con el fondo generico de siempre. Diecisiete
 * a medias con una mala es peor que dieciseis buenas.
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import sharp from 'sharp';
import { medirCentro, juzgar, juzgarBruto, legibilidad, juzgarLegibilidad, autocomprobar, UMBRALES, RATIO_OBJETIVO, ZONA } from './comprobar-cta.mjs';

const ejecutar = promisify(execFile);

const APLICAR = process.argv.includes('--aplicar');

const RAIZ = path.resolve(import.meta.dirname, '..');
const FRAG = path.join(RAIZ, 'src/contenido-migrado');
const ENTRADA = '/Users/senavia/Downloads/higgsfield-cta-out';
const REFERENCIAS = '/Users/senavia/Downloads/higgsfield-cta-in';
const DESTINO = path.join(RAIZ, 'public/images/cta');
const MONTAJES = path.join(RAIZ, 'auditoria-imagenes/cta');

/**
 * Anchos que se publican. El master va sin sufijo, como el resto del sitio.
 *
 * Hay 2400 porque la seccion ocupa el 100% del ancho y en retina a 1440 pide 2880:
 * el candidato mas grande de hoy es 2000 y se queda corto. Y hay 1600 porque el
 * markup migrado no lo pedia aunque el fichero existiera en disco.
 */
const ANCHOS = [500, 800, 1080, 1600, 2400];
const MASTER = 2400;

/**
 * Escalera de calidad y techo de peso, como optimizar-imagenes-cliente.mjs.
 *
 * Se baja la CALIDAD antes que el TAMAÑO: el tamaño es lo que hace que la foto se vea
 * nitida en un fondo a pantalla completa, y la calidad solo cuesta artefactos que a
 * 2400 px y bajo un velo del 50% de negro no ve nadie. El techo son 300 KB, el mismo
 * que las fotos del cliente; el fondo generico que sustituyen pesa 137 KB a 2000 px,
 * que a 2400 serian ~197 KB de puro escalado.
 */
const CALIDADES = [62, 56, 50, 44, 38];
const TECHO = 300 * 1024;

/**
 * Recortes distintos de 'attention', con su motivo.
 *
 * 'attention' premia la region con mas entropia, que en un fondo de exterior suele ser
 * el cielo o una masa de vegetacion. Si alguna generacion se descuadra por eso, va
 * aqui NOMBRADA y con el motivo escrito, y el script lo imprime en cada ejecucion.
 * Una excepcion silenciosa es una excepcion que nadie revisa.
 */
const RECORTE = {};

// --- 0. La medida antes que nada ---------------------------------------------

{
  const fallos = await autocomprobar();
  if (fallos.length) {
    console.error('  FALLO  la medida del centro esta rota, no se puede juzgar nada:');
    for (const f of fallos) console.error(`         ${f}`);
    process.exit(1);
  }
}

// --- 1. Catalogo del disco ---------------------------------------------------

const catalogo = new Map();
for (const col of ['products', 'services']) {
  for (const f of await fs.readdir(path.join(FRAG, col))) {
    if (f.endsWith('.html')) catalogo.set(f.slice(0, -5), col);
  }
}

const devueltos = await fs.readdir(ENTRADA).catch(() => null);
if (devueltos === null) {
  console.error(`  No existe ${ENTRADA}.`);
  console.error('  Es donde tienes que dejar los resultados de Higgsfield, con el nombre');
  console.error(`  <slug>.png (ver ${REFERENCIAS}/INSTRUCCIONES.md).`);
  process.exit(1);
}

const archivos = devueltos.filter((f) => !f.startsWith('.') && /\.(png|jpe?g|webp|avif|tiff?)$/i.test(f));
if (!archivos.length) {
  console.log(`  ---   ${ENTRADA} esta vacia: no ha vuelto nada todavia\n`);
  process.exit(0);
}

// --- 2. Juzgar ---------------------------------------------------------------

await fs.mkdir(MONTAJES, { recursive: true });

const aprobadas = [];
const rechazadas = [];
const huerfanos = [];

for (const nombre of archivos) {
  const slug = nombre.replace(/\.[^.]+$/, '');
  if (!catalogo.has(slug)) { huerfanos.push(nombre); continue; }

  const bruto = await fs.readFile(path.join(ENTRADA, nombre));
  const brutoMeta = await sharp(bruto).metadata();
  const medidaBruto = { width: brutoMeta.width, height: brutoMeta.height, ratio: brutoMeta.width / brutoMeta.height };
  const motivosBruto = juzgarBruto(medidaBruto);

  // SE RECORTA ANTES DE JUZGAR EL CENTRO. higgsfield no da 2.55:1 —su mas ancha es
  // 21:9— asi que el bruto viene mas estrecho. Medir el centro del bruto seria medir
  // una franja que nadie va a ver: lo que decide si el titular se lee es el recorte
  // publicado, y ese es el que se mide, el que se enseña en el montaje y el que se
  // escribe. Un solo recorte, una sola verdad.
  const posicion = RECORTE[slug] ?? 'attention';
  const buf = motivosBruto.length ? bruto : await sharp(bruto)
    .resize(MASTER, Math.round(MASTER / RATIO_OBJETIVO), { fit: 'cover', position: posicion })
    .png().toBuffer();

  const medida = await medirCentro(buf);
  const leg = await legibilidad(buf);
  const motivos = [...motivosBruto, ...juzgar(medida, { anchoMin: UMBRALES.ANCHO_PUBLICADO }), ...juzgarLegibilidad(leg)];
  medida.bruto = `${brutoMeta.width}x${brutoMeta.height} ${medidaBruto.ratio.toFixed(2)}:1`;
  medida.leg = leg;

  await montaje(slug, buf, medida, motivos);

  const item = { slug, nombre, buf, medida, motivos };
  if (motivos.length) rechazadas.push(item); else aprobadas.push(item);
}

aprobadas.sort((a, b) => a.slug.localeCompare(b.slug));
rechazadas.sort((a, b) => a.slug.localeCompare(b.slug));

// --- 3. Informe --------------------------------------------------------------

console.log('Integracion de los fondos de CTA\n');
console.log(`  devueltos     ${archivos.length} de ${catalogo.size}`);
console.log(`  APROBADAS     ${aprobadas.length}`);
console.log(`  rechazadas    ${rechazadas.length}`);
if (huerfanos.length) console.log(`  huerfanos     ${huerfanos.length}`);
console.log('');

for (const a of aprobadas) {
  console.log(`  ok    ${a.slug.padEnd(30)} ${a.medida.width}x${a.medida.height}`
    + ` ${a.medida.ratio.toFixed(2)}:1  media ${a.medida.media.toFixed(1)}  sigma ${a.medida.sigma.toFixed(1)}  <- ${a.medida.bruto}`
    + `  texto ${a.medida.leg['1440'].peor.toFixed(1)}:1 / ${a.medida.leg['390'].peor.toFixed(1)}:1`);
}
for (const r of rechazadas) {
  console.log(`  FALLA ${r.slug.padEnd(30)} ${r.medida.width}x${r.medida.height}`
    + ` ${r.medida.ratio.toFixed(2)}:1  media ${r.medida.media.toFixed(1)}  sigma ${r.medida.sigma.toFixed(1)}`);
  for (const m of r.motivos) console.log(`         · ${m}`);
}
if (huerfanos.length) {
  console.log('\n  Sin slug al que pertenecer (no se toca ninguno, no se adivina):');
  for (const h of huerfanos) console.log(`    ${h}`);
  console.log(`    Los slugs validos son los ${catalogo.size} de src/contenido-migrado/{products,services}/.`);
}

const faltan = [...catalogo.keys()].filter((s) => !archivos.some((f) => f.replace(/\.[^.]+$/, '') === s));
if (faltan.length) {
  console.log(`\n  Sin generar todavia (${faltan.length}): siguen con el fondo generico, que no rompe nada.`);
  console.log(`    ${faltan.join(', ')}`);
}

// --- 4. El muro --------------------------------------------------------------

if (!APLICAR) {
  console.log('\n  ─────────────────────────────────────────────────────────────────────');
  console.log('  NO SE HA ESCRITO NADA. Este paso solo juzga.');
  console.log('');
  console.log('  MIRA LOS MONTAJES UNO A UNO antes de continuar. Las medidas de arriba');
  console.log('  NO ven de que producto es la foto: una pergola de lamas preciosa en la');
  console.log('  pagina de carports las pasa todas. Cada montaje lleva la generada con');
  console.log('  el velo y el titular encima, y debajo sus tres referencias reales.');
  console.log('');
  console.log(`  ${path.relative(RAIZ, MONTAJES)}/`);
  console.log('');
  console.log('  Descarta las que no enseñen SU producto borrandolas de');
  console.log(`  ${ENTRADA}.`);
  console.log('');
  console.log('  Cuando esten revisadas:  node scripts/integrar-cta.mjs --aplicar');
  console.log('  ─────────────────────────────────────────────────────────────────────\n');
  process.exit(0);
}

// --- 5. Aplicar --------------------------------------------------------------

if (!aprobadas.length) {
  console.log('\n  No hay ninguna aprobada que escribir.\n');
  process.exit(0);
}

await fs.mkdir(DESTINO, { recursive: true });
const escritos = [];

for (const a of aprobadas) {
  if (RECORTE[a.slug]) console.log(`  EXCEPCION nombrada: ${a.slug} se recorto con '${RECORTE[a.slug]}'`);

  // a.buf ya viene recortado a 2.55:1 y a MASTER de ancho desde el juicio.
  const master = sharp(a.buf);

  let avif = null, calidad = null;
  for (const q of CALIDADES) {
    avif = await master.clone().avif({ quality: q }).toBuffer();
    calidad = q;
    if (avif.length <= TECHO) break;
  }
  const destinoMaster = path.join(DESTINO, `${a.slug}.avif`);
  await fs.writeFile(destinoMaster, avif);
  escritos.push(destinoMaster);

  const pesos = [`${MASTER}w ${(avif.length / 1024).toFixed(0)}KB`];
  for (const w of ANCHOS.filter((w) => w !== MASTER)) {
    const buf = await sharp(a.buf)
      .resize(w, Math.round(w / RATIO_OBJETIVO), { fit: 'cover' })
      .avif({ quality: calidad }).toBuffer();
    const p = path.join(DESTINO, `${a.slug}-p-${w}.avif`);
    await fs.writeFile(p, buf);
    escritos.push(p);
    pesos.push(`${w}w ${(buf.length / 1024).toFixed(0)}KB`);
  }

  console.log(`  escrito  ${a.slug.padEnd(30)} q${calidad}  ${pesos.join('  ')}`);
  if (avif.length > TECHO) {
    console.log(`           aviso: ${(avif.length / 1024).toFixed(0)}KB pasa del techo de ${TECHO / 1024}KB`
      + ' incluso a la calidad mas baja');
  }
}

// --- 6. git add --------------------------------------------------------------
//
// El sitio despliega por `git push` y Vercel construye desde un CLON: un fichero que
// esta en disco pero no en el indice existe en local y devuelve 404 en produccion.
// Asi es como 429 URLs del CMS acabaron en 404 con la puerta local en verde. El check
// 4b de comprobar-imagenes.mjs lo caza (`git ls-files public`), pero lo caza DESPUES;
// aqui se evita que llegue a ocurrir.

await ejecutar('git', ['add', '--', ...escritos], { cwd: RAIZ });
console.log(`\n  ${escritos.length} ficheros escritos y añadidos al indice de git.`);

console.log('\n  AHORA, EN ESTE ORDEN (transformar.mjs deriva el mapa de public/images/cta/,');
console.log('  y dimensionarImagenes() necesita las medidas o no pone width/height):');
console.log('');
console.log('    npm run medir:imagenes');
console.log('    node scripts/generar-paginas.mjs && node scripts/generar-detalle.mjs');
console.log('    npm run check\n');

// --- Montaje -----------------------------------------------------------------

/**
 * Montaje de revision: arriba la generada TAL COMO SE VE —velo del 50% y titular
 * encima, con el rectangulo de la zona medida dibujado—, abajo sus tres referencias.
 *
 * Las referencias salen de ~/Downloads/higgsfield-cta-in/<slug>/, que es lo que de
 * verdad se adjunto en la sesion manual. Recalcularlas aqui seria repetir la logica de
 * seleccion y arriesgarse a enseñar unas fotos distintas de las que se usaron.
 */
async function montaje(slug, buf, medida, motivos) {
  const W = 1440;
  const H = Math.round(W / RATIO_OBJETIVO);
  const ALTO_REF = 300;
  const capas = [];

  capas.push({ input: await sharp(buf).resize(W, H, { fit: 'cover', position: 'attention' }).toBuffer(), left: 0, top: 0 });

  // El velo plano del 50% de negro, exactamente el del CSS.
  capas.push({
    input: await sharp({ create: { width: W, height: H, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0.5 } } }).png().toBuffer(),
    left: 0, top: 0,
  });

  // La zona que mide la puerta, y el texto real del CTA en una caja de 650px.
  const zw = Math.round(W * ZONA.ancho), zh = Math.round(H * ZONA.alto);
  const zx = Math.round((W - zw) / 2), zy = Math.round((H - zh) / 2);
  const cx = W / 2;
  capas.push({
    input: Buffer.from(`<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
      <rect x="${zx}" y="${zy}" width="${zw}" height="${zh}" fill="none" stroke="#ff3b30" stroke-width="2" stroke-dasharray="10 8"/>
      <text x="${zx + 6}" y="${zy - 8}" font-family="monospace" font-size="15" fill="#ff3b30">zona medida 46% x 55% — media ${medida.media.toFixed(1)} sigma ${medida.sigma.toFixed(1)}</text>
      <text x="${cx}" y="${H / 2 - 26}" text-anchor="middle" font-family="Georgia,serif" font-size="44" fill="#fff">Request your free Estimate</text>
      <text x="${cx}" y="${H / 2 + 14}" text-anchor="middle" font-family="Helvetica,Arial" font-size="17" fill="#fff">Meet with our exterior designers for a free consultation. We'll assess your space</text>
      <text x="${cx}" y="${H / 2 + 38}" text-anchor="middle" font-family="Helvetica,Arial" font-size="17" fill="#fff">and goals to plan the installation of pergolas, patio covers, or pool enclosures.</text>
      <rect x="${cx - 170}" y="${H / 2 + 62}" width="150" height="42" fill="#c8a04b"/>
      <text x="${cx - 95}" y="${H / 2 + 89}" text-anchor="middle" font-family="Helvetica,Arial" font-size="15" fill="#fff">Get A Quote</text>
      <rect x="${cx + 20}" y="${H / 2 + 62}" width="150" height="42" fill="none" stroke="#fff" stroke-width="2"/>
      <text x="${cx + 95}" y="${H / 2 + 89}" text-anchor="middle" font-family="Helvetica,Arial" font-size="15" fill="#fff">Schedule A Visit</text>
    </svg>`), left: 0, top: 0,
  });

  // Las tres referencias que se adjuntaron.
  const dirRef = path.join(REFERENCIAS, slug);
  const refs = (await fs.readdir(dirRef).catch(() => [])).filter((f) => f.startsWith('ref-')).sort();
  const anchoRef = Math.floor(W / 3);
  for (const [i, r] of refs.slice(0, 3).entries()) {
    capas.push({
      input: await sharp(path.join(dirRef, r)).resize(anchoRef - 4, ALTO_REF - 26, { fit: 'cover' }).toBuffer(),
      left: i * anchoRef + 2, top: H + 24,
    });
  }
  capas.push({
    input: Buffer.from(`<svg width="${W}" height="24" xmlns="http://www.w3.org/2000/svg">
      <text x="4" y="17" font-family="monospace" font-size="14" fill="#000">${refs.length
        ? 'REFERENCIAS REALES DE ESTE SLUG — ¿es el mismo producto que hay arriba?'
        : 'sin fotos de referencia en ' + path.relative(RAIZ, dirRef) + ' — deja ahi 3 fotos reales de este slug y se podra comparar'}</text>
    </svg>`), left: 0, top: H,
  });

  await sharp({ create: { width: W, height: H + ALTO_REF + 24, channels: 3, background: '#ffffff' } })
    .composite(capas).jpeg({ quality: 86 })
    .toFile(path.join(MONTAJES, `${motivos.length ? 'RECHAZADA' : 'ok'}-${slug}.jpg`));
}
