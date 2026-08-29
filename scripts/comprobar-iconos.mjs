#!/usr/bin/env node
/**
 * Puerta de los iconos propios de la seccion «Como funciona».
 *
 *     npm run check:iconos
 *
 * Los `pp-icon-*.svg` no son decoracion suelta: van en fila de cuatro, a 50 px reales,
 * uno junto a cada `<h3>` de §5. Puestos en fila, cualquier desigualdad de tamaño
 * optico o de grosor de trazo se lee como «cuatro iconos de sitios distintos», que es
 * exactamente lo que separa un set hecho de uno comprado.
 *
 * ───────────────────────────────────────────────────────────────────────────────
 * LO QUE COMPRUEBA, Y POR QUE NINGUNA OTRA PUERTA LO CAZA
 *
 *   1. `viewBox` = `0 0 50 50`. Es el tamaño intrinseco del que `medir-imagenes.mjs`
 *      saca las dimensiones (`:47-50`); cambiarlo desactualiza `img-dim.json` en
 *      silencio. Por eso normalizar se hace con `transform`, NUNCA tocando el viewBox.
 *
 *   2. CERO `<style>` y CERO atributos `class` dentro del SVG. En este repo un SVG con
 *      `class="clsN"` y sin su bloque `<style>` sale INVISIBLE, y ha pasado dos veces:
 *      el fichero existe, el `<img>` tiene su `alt`, `check:seo` pasa en verde y en
 *      pantalla no hay nada. Es el fallo mas barato de cometer y el mas caro de ver.
 *
 *   3. Trazo y no relleno: `fill="none"` y un `stroke` de verdad. Un vectorizador sobre
 *      un PNG devuelve CONTORNOS RELLENOS, y con eso no hay grosor que igualar ni
 *      escala que dividir. Es la comprobacion que decide si una generacion sirve.
 *
 *   4. `stroke-width x escala` = 3,2 (+-0,02). El grosor RENDERIZADO tiene que ser el
 *      mismo en los cuatro; sin dividir por la escala, el icono mas pequeño engorda su
 *      trazo un 22 % respecto a sus vecinos.
 *
 *   5. El contenido ocupa el 85 % (+-2) de la caja y esta centrado. Medido sobre el
 *      RENDER, no sobre los numeros del fichero: es lo unico que corresponde con lo que
 *      ve el ojo.
 *
 *   6. Todos estan en `img-dim.json` a [50, 50]. Sin eso `check:seo` tumba la ficha por
 *      «toda <img> declara width y height», pero solo DESPUES de commitear.
 *
 * NADA DE BUSCAR CADENAS. Una puerta que casa un texto caduca en cuanto alguien cambia
 * el relleno; en este repo ya se cobro tres falsos verdes. Todo lo de aqui mira
 * estructura o pixeles.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const RAIZ = path.resolve(import.meta.dirname, '..');
const IMAGENES = path.join(RAIZ, 'public/images');

/** El contrato, en un solo sitio. */
export const CONTRATO = {
  VIEWBOX: '0 0 50 50',
  LADO: 50,
  /** Grosor RENDERIZADO, igual en todos. */
  TRAZO: 3.2,
  TRAZO_TOL: 0.02,
  /** Fraccion de la caja que ocupa el contenido. */
  OCUPACION: 0.85,
  OCUPACION_TOL: 0.02,
  /** Descentrado maximo admitido, en unidades de usuario. */
  CENTRO_TOL: 0.6,
  /** Resolucion a la que se mide. 20 px por unidad de usuario. */
  RENDER: 1000,
};

/** Los iconos propios. El prefijo es el contrato de nombre. */
export const listarIconos = async () =>
  (await fs.readdir(IMAGENES))
    .filter((f) => f.startsWith('pp-icon-') && f.endsWith('.svg'))
    .sort();

/**
 * Mide la caja de tinta del SVG RENDERIZADO, en unidades de usuario.
 *
 * Se rasteriza y se busca el primer y el ultimo pixel no transparente por eje. Es el
 * mismo metodo con el que se normalizaron los cuatro primeros: a ojo no se distingue
 * un 70 % de un 86 %, y en fila se nota inmediatamente.
 */
export async function medirTinta(svg) {
  const { RENDER, LADO } = CONTRATO;
  const { data, info } = await sharp(Buffer.from(svg), { density: 384 })
    .resize(RENDER, RENDER, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width: w, height: h, channels } = info;
  let x0 = w, y0 = h, x1 = -1, y1 = -1;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (data[(y * w + x) * channels + 3] > 24) {
        if (x < x0) x0 = x;
        if (x > x1) x1 = x;
        if (y < y0) y0 = y;
        if (y > y1) y1 = y;
      }
    }
  }
  if (x1 < 0) return null;                       // SVG sin un solo pixel: el caso invisible
  const k = LADO / w;
  return {
    x: x0 * k, y: y0 * k, ancho: (x1 - x0 + 1) * k, alto: (y1 - y0 + 1) * k,
    cx: ((x0 + x1) / 2) * k, cy: ((y0 + y1) / 2) * k,
  };
}

/** La escala declarada en el `transform` del grupo, o 1 si no lleva. */
export const escalaDe = (svg) => Number(svg.match(/scale\(([-\d.]+)\)/)?.[1] ?? 1);
/** El `stroke-width` declarado. */
export const trazoDe = (svg) => Number(svg.match(/stroke-width="([-\d.]+)"/)?.[1] ?? NaN);

/** Los motivos por los que un icono NO cumple el contrato. Vacio = pasa. */
export async function juzgarIcono(nombre, svg, dims) {
  const C = CONTRATO;
  const m = [];

  const vb = svg.match(/viewBox="([^"]+)"/)?.[1];
  if (vb !== C.VIEWBOX) m.push(`viewBox "${vb}" y tiene que ser "${C.VIEWBOX}"`);

  // El fallo invisible: color por clase sin su bloque <style>.
  if (/<style[\s>]/.test(svg)) m.push('lleva un bloque <style>: el color va en atributos');
  if (/\sclass="/.test(svg)) m.push('lleva atributos class: el color va en atributos, no en .clsN');

  if (!/stroke="#3a545b"/.test(svg)) m.push('no declara stroke="#3a545b" (= --primary)');
  if (!/fill="none"/.test(svg)) m.push('no declara fill="none"');
  const rellenos = [...svg.matchAll(/fill="(?!none)([^"]+)"/g)].map((x) => x[1]);
  if (rellenos.length) m.push(`tiene relleno (${rellenos.join(', ')}): esto es trazo, no contorno relleno`);

  const trazo = trazoDe(svg);
  const escala = escalaDe(svg);
  const render = trazo * escala;
  if (!Number.isFinite(render)) m.push('no se puede leer stroke-width');
  else if (Math.abs(render - C.TRAZO) > C.TRAZO_TOL) {
    m.push(`grosor renderizado ${render.toFixed(2)} y tiene que ser ${C.TRAZO}`
      + ` (stroke-width ${trazo} x escala ${escala.toFixed(4)})`);
  }

  const t = await medirTinta(svg);
  if (!t) {
    m.push('NO PINTA UN SOLO PIXEL: el SVG es invisible');
  } else {
    const ocupa = Math.max(t.ancho, t.alto) / C.LADO;
    if (Math.abs(ocupa - C.OCUPACION) > C.OCUPACION_TOL) {
      m.push(`ocupa el ${(ocupa * 100).toFixed(1)} % de la caja y tiene que ocupar`
        + ` el ${(C.OCUPACION * 100).toFixed(0)} %`);
    }
    const dx = Math.abs(t.cx - C.LADO / 2), dy = Math.abs(t.cy - C.LADO / 2);
    if (dx > C.CENTRO_TOL || dy > C.CENTRO_TOL) {
      m.push(`descentrado ${dx.toFixed(2)} / ${dy.toFixed(2)} sobre un maximo de ${C.CENTRO_TOL}`);
    }
  }

  const dim = dims[`/images/${nombre}`];
  if (!dim) m.push('no esta en img-dim.json: falta `npm run medir:imagenes`');
  else if (dim[0] !== C.LADO || dim[1] !== C.LADO) m.push(`img-dim.json dice ${dim.join('x')} y deberia decir 50x50`);

  return m;
}

// ─────────────────────────────────────────────────────────────────────────── main
if (import.meta.url === `file://${process.argv[1]}`) {
  const dims = JSON.parse(await fs.readFile(path.join(RAIZ, 'src/lib/img-dim.json'), 'utf8'));
  const iconos = await listarIconos();
  console.log('\n  ICONOS DE «COMO FUNCIONA»\n');
  if (!iconos.length) {
    console.log('  FALLO  no hay ni un pp-icon-*.svg en public/images');
    process.exit(1);
  }
  let fallos = 0;
  for (const nombre of iconos) {
    const svg = await fs.readFile(path.join(IMAGENES, nombre), 'utf8');
    const motivos = await juzgarIcono(nombre, svg, dims);
    const t = await medirTinta(svg);
    const ocupa = t ? `${((Math.max(t.ancho, t.alto) / CONTRATO.LADO) * 100).toFixed(1)} %` : '—';
    console.log(`  ${motivos.length ? 'FALLO' : 'ok  '}  ${nombre.padEnd(26)}`
      + `  ocupa ${ocupa.padStart(6)}   trazo ${(trazoDe(svg) * escalaDe(svg)).toFixed(2)}`);
    for (const m of motivos) console.log(`           · ${m}`);
    if (motivos.length) fallos++;
  }
  console.log(`\n  ${iconos.length} iconos · ${fallos} con fallos\n`);
  process.exit(fallos ? 1 : 0);
}
