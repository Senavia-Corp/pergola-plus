/**
 * CLS del estimador a 375 (movil, CPU x4, red limitada y el JS de /_astro retrasado 1,5 s:
 * se pinta el HTML del servidor antes de que corra el script, que es cuando se ve el salto).
 *
 *     PUERTO=4174 node scripts/perf/servir.mjs &  node scripts/perf/cls-estimador.mjs http://localhost:4174 [N=6]
 *
 * Medido el 21-oct: 0,0118 en #est-pie-siguiente en 5/5 cargas antes de nacer «Atras» oculto;
 * 0 en 5/5 despues. Sale con 1 si alguna carga desplaza algo.
 */
import { chromium } from 'playwright';
const [BASE, N = 6] = process.argv.slice(2);
const b = await chromium.launch();
const res = [];
for (let i = 0; i < Number(N); i++) {
  const ctx = await b.newContext({ viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  const p = await ctx.newPage();
  const cdp = await ctx.newCDPSession(p);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 }); await cdp.send('Network.enable'); await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: 1.6 * 1024 * 1024 / 8, uploadThroughput: 750 * 1024 / 8 });
  // El JS llega tarde: se pinta el HTML tal cual sale del servidor antes de que corra el script.
  await p.route('**/_astro/*.js', async (r) => { await new Promise((ok) => setTimeout(ok, 1500)); await r.continue(); });
  await p.addInitScript(() => { window.__ls = []; new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__ls.push({ v: e.value, s: e.sources.map((s) => s.node?.id || s.node?.className || s.node?.nodeName) }); }).observe({ type: 'layout-shift', buffered: true }); });
  await p.goto(BASE + '/project-estimator/', { waitUntil: 'load' });
  await p.waitForFunction(() => document.getElementById('est-nav') && !document.getElementById('est-nav').hidden);
  await p.waitForTimeout(1500);
  const ls = await p.evaluate(() => window.__ls);
  res.push({ total: +ls.reduce((s, e) => s + e.v, 0).toFixed(4), fuentes: [...new Set(ls.flatMap((e) => e.s))].join(',') || '-' });
  await ctx.close();
}
await b.close();
console.log(BASE, JSON.stringify(res));
if (res.some((r) => r.total > 0.001)) process.exit(1);
