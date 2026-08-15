#!/usr/bin/env node
/**
 * Fase 0.5 — PROMPT B: analisis y tagueo de imagenes.
 *
 * Objetivo: que una IA pueda decidir MAS ADELANTE donde puede reutilizarse cada
 * imagen. Hoy la migracion es exacta y usa `role` + `usedIn`, que ya vienen del
 * CSV; esto es para la reorganizacion posterior.
 *
 * Todo sale de los pixeles con sharp. Nada de IA en este paso: es mas barato,
 * mas rapido y determinista.
 *
 *   node scripts/analizar-imagenes.mjs [--forzar]
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const RAIZ = path.resolve(import.meta.dirname, '..');
const STAGING = path.join(RAIZ, 'assets-migracion');
const MANIFEST = path.join(STAGING, 'manifest.json');
const FORZAR = process.argv.includes('--forzar');

/** Ancho al que se reduce todo para analizar. Suficiente y ~50x mas rapido. */
const ANCHO = 128;

/** Umbrales. Se recalibran si la distribucion sale degenerada (ver el informe). */
const U = {
  toneDark: 90,        // luminancia media 0-255 por debajo -> dark
  toneLight: 175,      // por encima -> light
  safeZoneMax: 46,     // desviacion tipica por debajo de la cual un tercio es "seguro"
  detalleWide: 14,     // gradiente medio por debajo -> plano general
  detalleCloseup: 34,  // por encima -> plano cerrado
};

/**
 * Estadisticos de una imagen en escala de grises.
 * Devuelve luminancia media, desviacion por tercios horizontales y gradiente
 * medio (proxy de "cuanto detalle hay").
 */
function estadisticos(datos, w, h, alfa) {
  const media = (a) => a.reduce((s, v) => s + v, 0) / (a.length || 1);
  const desv = (a) => { const m = media(a); return Math.sqrt(media(a.map((v) => (v - m) ** 2))); };
  // Un pixel transparente NO tiene color: incluirlo cuenta como negro y hunde la
  // luminancia. Sin esto el 87% de los logos salia "dark" por la transparencia,
  // no por su tinta.
  const visible = (i) => !alfa || alfa[i] > 128;

  const todos = [];
  for (let i = 0; i < datos.length; i++) if (visible(i)) todos.push(datos[i]);
  const lum = media(todos);

  // Tercios horizontales: superior, central, inferior.
  const t = Math.floor(h / 3);
  const tercios = [[0, t], [t, 2 * t], [2 * t, h]].map(([a, b]) => {
    const px = [];
    for (let y = a; y < b; y++) for (let x = 0; x < w; x++) {
      const i = y * w + x;
      if (visible(i)) px.push(datos[i]);
    }
    return { lum: media(px), desv: desv(px) };
  });

  // Gradiente (Sobel simplificado): densidad de bordes.
  let g = 0, n = 0;
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const i = y * w + x;
      g += Math.abs(datos[i] - datos[i + 1]) + Math.abs(datos[i] - datos[i + w]);
      n++;
    }
  }
  return { lum, tercios, gradiente: n ? g / n : 0 };
}

/** Los 3 colores dominantes, cuantizando a una rejilla de 4 bits por canal. */
async function dominantes(img) {
  const { data, info } = await img.clone().resize(48, 48, { fit: 'inside' })
    .removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const cubos = new Map();
  for (let i = 0; i < data.length; i += info.channels) {
    const k = ((data[i] >> 4) << 8) | ((data[i + 1] >> 4) << 4) | (data[i + 2] >> 4);
    const c = cubos.get(k) || { n: 0, r: 0, g: 0, b: 0 };
    c.n++; c.r += data[i]; c.g += data[i + 1]; c.b += data[i + 2];
    cubos.set(k, c);
  }
  return [...cubos.values()].sort((a, b) => b.n - a.n).slice(0, 3).map((c) =>
    '#' + [c.r, c.g, c.b].map((v) => Math.round(v / c.n).toString(16).padStart(2, '0')).join(''));
}

async function analizar(rutaAbs) {
  const img = sharp(rutaAbs, { animated: false });
  const meta = await img.metadata();
  const w0 = meta.width || 0, h0 = meta.height || 0;
  if (!w0 || !h0) throw new Error('sin dimensiones');

  const alto = Math.max(8, Math.round((ANCHO * h0) / w0));
  const base = img.clone().resize(ANCHO, alto, { fit: 'fill' });
  const { data } = await base.clone().greyscale().removeAlpha()
    .raw().toBuffer({ resolveWithObject: true });

  // Canal alfa aparte, para descartar del calculo lo que no se ve.
  let alfa = null;
  if (meta.hasAlpha) {
    const r = await base.clone().extractChannel('alpha').raw().toBuffer({ resolveWithObject: true });
    alfa = r.data;
  }

  const { lum, tercios, gradiente } = estadisticos(data, ANCHO, alto, alfa);
  const opacos = alfa ? alfa.reduce((s, v) => s + (v > 128 ? 1 : 0), 0) / alfa.length : 1;
  const ratio = +(w0 / h0).toFixed(2);

  const tone = lum < U.toneDark ? 'dark' : lum > U.toneLight ? 'light' : 'mid';
  const orientation = ratio > 1.15 ? 'landscape' : ratio < 0.87 ? 'portrait' : 'square';

  // La zona segura para un titular es el tercio con MENOS detalle, siempre que
  // baje del umbral. Si ninguno baja, la imagen esta demasiado cargada.
  const nombres = ['top', 'center', 'bottom'];
  let mejor = 0;
  tercios.forEach((t, i) => { if (t.desv < tercios[mejor].desv) mejor = i; });
  const textSafeZone = tercios[mejor].desv < U.safeZoneMax ? nombres[mejor] : 'none';

  const detailLevel = gradiente < U.detalleWide ? 'wide'
    : gradiente > U.detalleCloseup ? 'closeup' : 'medium';

  return {
    orientation, aspectRatio: ratio, tone,
    luminance: +lum.toFixed(1),
    textSafeZone,
    zonaDesv: tercios.map((t) => +t.desv.toFixed(1)),
    dominantColors: await dominantes(img),
    maxUseWidth: w0,
    detailLevel,
    edgeDensity: +gradiente.toFixed(1),
    hasAlpha: !!meta.hasAlpha,
    /** Fraccion de la imagen que es opaca. Bajo = recorte/logo sobre transparente. */
    opacidad: +opacos.toFixed(2),
  };
}

// ---------------------------------------------------------------------------
const manifest = JSON.parse(await fs.readFile(MANIFEST, 'utf8'));
const pendientes = manifest.assets.filter((a) => FORZAR || !a.analysis);
console.log(`Fase 0.5 — analisis de imagenes\n`);
console.log(`  ${manifest.assets.length} en el manifest · ${pendientes.length} por analizar\n`);

let ok = 0; const fallos = [];
for (const a of pendientes) {
  const p = path.join(STAGING, a.file);
  try {
    a.analysis = await analizar(p);
    a.tags = [
      `role:${a.role}`,
      `class:${a.assetClass}`,
      `subject:${a.subject.slug}`,
      `subjectType:${a.subject.type}`,
      `tone:${a.analysis.tone}`,
      `orientation:${a.analysis.orientation}`,
      `textSafeZone:${a.analysis.textSafeZone}`,
      `detail:${a.analysis.detailLevel}`,
      a.analysis.hasAlpha ? 'alpha:yes' : 'alpha:no',
      a.analysis.maxUseWidth >= 1600 ? 'width:xl'
        : a.analysis.maxUseWidth >= 1000 ? 'width:lg'
        : a.analysis.maxUseWidth >= 600 ? 'width:md' : 'width:sm',
    ];
    ok++;
    if (ok % 100 === 0) process.stdout.write(`  ${ok}/${pendientes.length}\r`);
  } catch (e) {
    fallos.push({ file: a.file, error: String(e.message || e) });
  }
}

await fs.writeFile(MANIFEST, JSON.stringify(manifest, null, 2));

// --- informe de distribucion -------------------------------------------------
// Si un eje cae casi entero en un solo bucket, el umbral esta mal calibrado y el
// tag no discrimina nada. Mejor decirlo que dar los datos por buenos.
const con = manifest.assets.filter((a) => a.analysis);
const cuenta = (f) => con.reduce((m, a) => (m[f(a)] = (m[f(a)] || 0) + 1, m), {});
const ejes = {
  tone: cuenta((a) => a.analysis.tone),
  orientation: cuenta((a) => a.analysis.orientation),
  textSafeZone: cuenta((a) => a.analysis.textSafeZone),
  detailLevel: cuenta((a) => a.analysis.detailLevel),
};

console.log(`  analizadas ${ok}   fallos ${fallos.length}\n`);
const avisos = [];
for (const [eje, dist] of Object.entries(ejes)) {
  const total = Object.values(dist).reduce((s, v) => s + v, 0);
  const orden = Object.entries(dist).sort((a, b) => b[1] - a[1]);
  console.log(`  ${eje}:`);
  for (const [k, v] of orden) console.log(`     ${k.padEnd(12)} ${String(v).padStart(4)}  ${(100 * v / total).toFixed(1)}%`);
  if (orden[0][1] / total > 0.9) avisos.push(`${eje}: ${(100 * orden[0][1] / total).toFixed(0)}% en "${orden[0][0]}"`);
}

if (fallos.length) {
  console.log(`\n  --- FALLOS ---`);
  for (const f of fallos.slice(0, 20)) console.log(`   ${f.error}  ${f.file}`);
}
if (avisos.length) {
  console.log(`\n  !! UMBRAL MAL CALIBRADO — el tag no discrimina:`);
  for (const a of avisos) console.log(`     ${a}`);
  console.log(`     Ajusta U en ${path.relative(RAIZ, import.meta.filename)} y relanza con --forzar.`);
}
console.log(`\n  manifest actualizado`);
