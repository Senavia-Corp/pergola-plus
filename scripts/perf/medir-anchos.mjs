#!/usr/bin/env node
/**
 * Mide el ancho PINTADO de cada grupo de imagenes (por clase o contenedor) en las 16
 * plantillas a 375/768/992/1440, para escribir `sizes` con datos y no a ojo.
 *
 *     node scripts/perf/medir-anchos.mjs [ruta ...]   (sin rutas: las 16 plantillas)
 */
import { chromium } from 'playwright';
import { PLANTILLAS, BASE } from './plantillas.mjs';

const ANCHOS = [375, 768, 992, 1440];
const b = await chromium.launch();
const tabla = new Map(); // grupo -> {375: Set, ...}
const RUTAS = process.argv.slice(2).length ? process.argv.slice(2).map((r) => ['', r]) : PLANTILLAS;
for (const [, ruta] of RUTAS) {
  for (const w of ANCHOS) {
    const ctx = await b.newContext({ viewport: { width: w, height: 900 }, isMobile: w < 768, hasTouch: w < 768, reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    const ok = await page.goto(BASE + ruta, { waitUntil: 'load', timeout: 60000 }).then(() => true, (e) => { console.log(`  !! ${ruta}@${w}: ${String(e).slice(0, 60)}`); return false; });
    if (!ok) { await ctx.close(); continue; }
    const datos = await page.evaluate(() => [...document.images]
      .filter((i) => /\/(cms-img|images\/cliente)\//.test(i.getAttribute('src') ?? '') && i.getBoundingClientRect().width > 0)
      .map((i) => {
        const cls = i.className || `(${i.closest('[class]')?.className.split(' ')[0] ?? '?'} > img)`;
        return [cls.replace(/\s+is-\d+/, '').trim(), Math.round(i.getBoundingClientRect().width)];
      }));
    for (const [g, ancho] of datos) {
      const e = tabla.get(g) ?? tabla.set(g, {}).get(g);
      (e[w] ??= new Set()).add(ancho);
    }
    await ctx.close();
  }
}
await b.close();
const fmt = (s) => (s ? [...s].sort((a, b) => a - b).join('/') : '-');
console.log('grupo'.padEnd(52) + ANCHOS.map((w) => String(w).padEnd(16)).join(''));
for (const [g, e] of [...tabla].sort()) console.log(g.padEnd(52) + ANCHOS.map((w) => fmt(e[w]).padEnd(16)).join(''));
