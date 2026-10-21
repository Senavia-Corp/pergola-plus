#!/usr/bin/env node
/**
 * Contraste real del texto blanco de la banda «Service Areas» (.service-areas) sobre
 * la foto con velo. accesslint estimaba 3,95:1 contra el color medio de la imagen; esto
 * mide el PEOR pixel debajo de cada texto (texto oculto, foto + velo tal cual se
 * pintan) y dice que opacidad de velo haria falta para llegar a 4,5:1 ahi.
 *
 *     node scripts/perf/medir-velo.mjs [ruta ...]
 */
import { chromium } from 'playwright';
import sharp from 'sharp';
import { BASE } from './plantillas.mjs';

const RUTAS = process.argv.slice(2).length ? process.argv.slice(2) : ['/', '/products/cabanas/', '/services/pavers/'];
const lum = (r, g, b) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
const contraste = (L) => (1.05) / (L + 0.05); // blanco sobre L
const b = await chromium.launch();
for (const ruta of RUTAS) for (const w of [375, 1440]) {
  const ctx = await b.newContext({ viewport: { width: w, height: 900 }, isMobile: w < 768, deviceScaleFactor: 1, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.goto(BASE + ruta, { waitUntil: 'load' });
  const banda = page.locator('.service-areas').first();
  if (!(await banda.count())) { console.log(`${ruta}@${w}: sin .service-areas`); await ctx.close(); continue; }
  await banda.scrollIntoViewIfNeeded();
  await page.waitForFunction(() => [...document.querySelectorAll('.service-areas img')].every((i) => i.complete), null, { timeout: 10000 }).catch(() => {});
  const textos = await banda.evaluate((s) => [...s.querySelectorAll('h1,h2,h3,p,.title-deco,div')].filter((e) => e.children.length === 0 && e.textContent.trim().length > 3).map((e) => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return { t: e.textContent.trim().slice(0, 30), x: r.x, y: r.y, w: r.width, h: r.height, color: cs.color, fs: cs.fontSize, fw: cs.fontWeight }; }).filter((t) => t.w > 0 && t.h > 0));
  // Oculta el texto y captura la banda tal cual se pinta (foto + velo).
  await page.addStyleTag({ content: '.service-areas :is(h1,h2,h3,p,.title-deco,div){color:transparent!important}' });
  const caja = await banda.boundingBox();
  const png = await page.screenshot({ clip: caja });
  const { data, info } = await sharp(png).raw().toBuffer({ resolveWithObject: true });
  const peor = [];
  for (const t of textos) {
    let Lmax = 0, suma = 0, n = 0;
    for (let y = Math.max(0, Math.round(t.y - caja.y)); y < Math.min(info.height, Math.round(t.y - caja.y + t.h)); y++) for (let x = Math.max(0, Math.round(t.x - caja.x)); x < Math.min(info.width, Math.round(t.x - caja.x + t.w)); x++) {
      const i = (y * info.width + x) * info.channels; const L = lum(data[i], data[i + 1], data[i + 2]); if (L > Lmax) Lmax = L; suma += L; n++;
    }
    // Opacidad de velo negro necesaria para que el peor pixel baje a L <= 0.1833 (4,5:1 con blanco):
    // L' = L*(1-a)  =>  a >= 1 - 0.1833/L. Como la foto ya lleva velo del 50 %, el pixel medido es
    // L = Lfoto*0.5, asi que el velo TOTAL necesario sobre la foto es 1 - (1-a)*0.5.
    const aExtra = Lmax > 0.1833 ? 1 - 0.1833 / Lmax : 0;
    const veloTotal = 1 - (1 - aExtra) * 0.5;
    peor.push({ texto: t.t, fs: t.fs, fw: t.fw, peor: contraste(Lmax).toFixed(2), medio: contraste(suma / Math.max(1, n)).toFixed(2), veloNecesario: Math.round(veloTotal * 100) + '%' });
  }
  console.log(`\n${ruta}@${w}  banda ${Math.round(caja.width)}x${Math.round(caja.height)}`);
  for (const p of peor) console.log(`  ${p.peor.padStart(5)}:1 peor · ${p.medio.padStart(5)}:1 medio · velo necesario ${p.veloNecesario}  ${p.fs}/${p.fw}  «${p.texto}»`);
  await ctx.close();
}
await b.close();
