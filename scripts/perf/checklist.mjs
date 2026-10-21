#!/usr/bin/env node
/**
 * 06-CHECKLIST-100.md: la tabla del §2 del encargo con el valor real por plantilla y
 * dispositivo (mediana y las 3 corridas) y PASS/FAIL por criterio.
 *
 *     node scripts/perf/checklist.mjs <carpeta-fase> > implementation-reports/.../06-CHECKLIST-100.md
 */
import fs from 'node:fs/promises';
import path from 'node:path';

const carpeta = process.argv[2];
const filas = (await fs.readFile(path.join(carpeta, 'lighthouse-medianas.csv'), 'utf8')).trim().split('\n').slice(1).map((l) => {
  const c = l.match(/("[^"]*"|[^,]*)(,|$)/g).map((x) => x.replace(/,$/, '').replace(/^"|"$/g, ''));
  return { tpl: c[0], dev: c[1], perf: +c[3], perfRuns: c[4], a11y: +c[5], a11yRuns: c[6], bp: +c[7], seo: +c[8], fcp: +c[9], lcp: +c[10], lcpRuns: c[11], cls: +c[12], clsRuns: c[13], tbt: +c[14], tbtMax: +c[15], kb: +c[16] };
});
const META_PERF_100 = new Set(['producto', 'servicio', 'post', 'faq', 'productos-indice', 'servicios-indice', 'blog-indice', 'blog-categoria', 'galeria']);
const PESO = { home: 1200, 'home-es': 1200, estimador: 800 };
const ok = (b) => (b ? 'PASS' : '**FAIL**');
const out = [];
out.push('# 06 — Checklist «100» (§2 del encargo), medido sobre el build final', '');
out.push(`Fuente: \`${path.basename(carpeta)}/lighthouse-medianas.csv\` (Lighthouse 13.5 ×3 por combinación, mediana; entre paréntesis las 3 corridas, nunca la mejor). Build de producción simulada servido por \`scripts/perf/servir.mjs\` con las cabeceras de \`config.json\`; Chrome headless sin extensiones.`, '');
out.push('| Plantilla | Disp. | Perf (3) | objetivo | A11y (3) | BP | SEO | LCP ms (3) | CLS máx (3) | TBT máx | KB | Veredicto |', '|---|---|---|---|---|---|---|---|---|---|---|---|');
let fallos = 0;
for (const f of filas.sort((a, b) => a.tpl.localeCompare(b.tpl) || a.dev.localeCompare(b.dev))) {
  const movil = f.dev === 'mobile';
  const objPerf = movil ? (META_PERF_100.has(f.tpl) ? 100 : 95) : 100;
  const perfOk = movil ? f.perf >= 95 : f.perf >= 100;
  const a11yOk = f.a11y === 100 && f.a11yRuns === '100/100/100';
  const bpOk = f.bp === 100 || (f.tpl === 'contacto-quote' && f.bp === 96);
  const seoOk = f.seo === 100;
  const lcpOk = !movil || f.lcp <= 2500;
  const clsOk = f.cls <= 0.01;
  const tbtOk = movil ? f.tbtMax <= 50 : f.tbtMax === 0;
  const pesoOk = !movil || f.kb <= (PESO[f.tpl] ?? 1000);
  const todo = perfOk && a11yOk && bpOk && seoOk && lcpOk && clsOk && tbtOk && pesoOk;
  if (!todo) fallos++;
  out.push(`| ${f.tpl} | ${f.dev} | ${f.perf} (${f.perfRuns}) ${ok(perfOk)} | ≥${movil ? 95 : 100}${movil && objPerf === 100 ? ' (100 deseado)' : ''} | ${f.a11y} (${f.a11yRuns}) ${ok(a11yOk)} | ${f.bp} ${ok(bpOk)} | ${f.seo} ${ok(seoOk)} | ${f.lcp} (${f.lcpRuns}) ${movil ? ok(lcpOk) : ''} | ${f.cls.toFixed(3)} (${f.clsRuns}) ${ok(clsOk)} | ${f.tbtMax} ${ok(tbtOk)} | ${f.kb} ${movil ? ok(pesoOk) : ''} | ${ok(todo)} |`);
}
out.push('', `**${filas.length - fallos} de ${filas.length} combinaciones cumplen todos los criterios; ${fallos} no.**`, '');
out.push('Criterios aplicados (§2): Perf móvil ≥ 95 (100 deseado en producto, servicio, post, FAQ e índices), escritorio 100; Accessibility 100 en las 3 corridas; BP 100 (contacto 96 aceptado por Turnstile en localhost); SEO 100; LCP móvil ≤ 2,5 s; CLS ≤ 0,01 en todas las corridas; TBT móvil ≤ 50 ms y escritorio 0; peso antes de `load` móvil: home ≤ 1,2 MB, estimador ≤ 0,8 MB, resto ≤ 1,0 MB (`total-byte-weight` de la traza).');
console.log(out.join('\n'));
