#!/usr/bin/env node
/**
 * Resume una carpeta de JSON de Lighthouse en dos CSV: corridas (una fila por
 * corrida) y medianas (una fila por plantilla x dispositivo). NUNCA la mejor corrida.
 *
 *     node scripts/perf/resumen.mjs <carpeta> [prefijo-csv]
 */
import fs from 'node:fs/promises';
import path from 'node:path';

const carpeta = process.argv[2];
const prefijo = process.argv[3] ?? path.join(carpeta, 'lighthouse');
if (!carpeta) { console.error('uso: resumen.mjs <carpeta> [prefijo]'); process.exit(1); }

const n = (x) => (x == null || Number.isNaN(x) ? '' : Math.round(x));
const mediana = (xs) => { const s = xs.filter((x) => x != null).sort((a, b) => a - b); return s.length ? s[Math.floor((s.length - 1) / 2)] : null; };
const q = (s) => `"${String(s ?? '').replace(/"/g, '""')}"`;

const filas = [];
for (const f of (await fs.readdir(carpeta)).filter((f) => f.endsWith('.json')).sort()) {
  const m = f.match(/^(.+)-(mobile|desktop)-(\d+)\.json$/);
  if (!m) continue;
  const j = JSON.parse(await fs.readFile(path.join(carpeta, f), 'utf8'));
  const a = j.audits, c = j.categories;
  const lcpNodo = a['lcp-breakdown-insight']?.details?.items?.find((i) => i.type === 'node')?.selector
    ?? a['largest-contentful-paint-element']?.details?.items?.[0]?.items?.[0]?.node?.selector ?? '';
  const fallidas = Object.entries(a).filter(([, v]) => v.score != null && v.score < 1).map(([k, v]) => `${k}:${v.score}`).join('|');
  const bytes = a['total-byte-weight']?.numericValue;
  const reqs = a['network-requests']?.details?.items?.length;
  filas.push({
    tpl: m[1], dev: m[2], run: Number(m[3]),
    perf: Math.round(c.performance.score * 100), a11y: Math.round(c.accessibility.score * 100),
    bp: Math.round(c['best-practices'].score * 100), seo: Math.round(c.seo.score * 100),
    fcp: a['first-contentful-paint']?.numericValue, lcp: a['largest-contentful-paint']?.numericValue,
    cls: a['cumulative-layout-shift']?.numericValue, tbt: a['total-blocking-time']?.numericValue,
    si: a['speed-index']?.numericValue, ttfb: a['server-response-time']?.numericValue,
    reqs, kb: bytes != null ? bytes / 1024 : null,
    lcpNodo,
    renderBlockMs: a['render-blocking-insight']?.metricSavings?.FCP ?? 0,
    imgKb: (a['image-delivery-insight']?.details?.overallSavingsBytes ?? a['image-delivery-insight']?.details?.items?.reduce((s, i) => s + (i.wastedBytes ?? 0), 0) ?? 0) / 1024,
    unusedCssKb: (a['unused-css-rules']?.details?.overallSavingsBytes ?? 0) / 1024,
    fallidas,
  });
}

const cab = ['tpl', 'dev', 'run', 'perf', 'a11y', 'bp', 'seo', 'fcp_ms', 'lcp_ms', 'cls', 'tbt_ms', 'si_ms', 'ttfb_ms', 'reqs', 'bytes_kb', 'lcp_elemento', 'render_blocking_ms', 'image_delivery_kb', 'unused_css_kb', 'audits_fallidas'];
const csvCorridas = [cab.join(','), ...filas.map((r) => [r.tpl, r.dev, r.run, r.perf, r.a11y, r.bp, r.seo, n(r.fcp), n(r.lcp), (r.cls ?? 0).toFixed(3), n(r.tbt), n(r.si), n(r.ttfb), r.reqs, n(r.kb), q(r.lcpNodo), n(r.renderBlockMs), n(r.imgKb), n(r.unusedCssKb), q(r.fallidas)].join(','))].join('\n') + '\n';
await fs.writeFile(`${prefijo}-corridas.csv`, csvCorridas);

const grupos = new Map();
for (const r of filas) { const k = `${r.tpl}|${r.dev}`; (grupos.get(k) ?? grupos.set(k, []).get(k)).push(r); }
const med = [];
for (const [k, rs] of grupos) {
  const [tpl, dev] = k.split('|');
  const lista = (f) => rs.map((r) => n(r[f])).join('/');
  med.push({
    tpl, dev, runs: rs.length,
    perf: mediana(rs.map((r) => r.perf)), perf_runs: lista('perf'),
    a11y: mediana(rs.map((r) => r.a11y)), a11y_runs: lista('a11y'),
    bp: mediana(rs.map((r) => r.bp)), seo: mediana(rs.map((r) => r.seo)),
    fcp: mediana(rs.map((r) => r.fcp)), lcp: mediana(rs.map((r) => r.lcp)), lcp_runs: lista('lcp'),
    cls: Math.max(...rs.map((r) => r.cls ?? 0)), cls_runs: rs.map((r) => (r.cls ?? 0).toFixed(3)).join('/'),
    tbt: mediana(rs.map((r) => r.tbt)), tbt_max: Math.max(...rs.map((r) => r.tbt ?? 0)),
    kb: mediana(rs.map((r) => r.kb)), reqs: mediana(rs.map((r) => r.reqs)),
    renderBlockMs: mediana(rs.map((r) => r.renderBlockMs)), imgKb: mediana(rs.map((r) => r.imgKb)), unusedCssKb: mediana(rs.map((r) => r.unusedCssKb)),
    lcpNodo: rs[0].lcpNodo, fallidas: [...new Set(rs.flatMap((r) => r.fallidas.split('|').filter(Boolean).map((x) => x.split(':')[0])))].join('|'),
  });
}
const cab2 = ['tpl', 'dev', 'runs', 'perf_med', 'perf_runs', 'a11y_med', 'a11y_runs', 'bp_med', 'seo_med', 'fcp_ms_med', 'lcp_ms_med', 'lcp_ms_runs', 'cls_max', 'cls_runs', 'tbt_ms_med', 'tbt_ms_max', 'bytes_kb_med', 'reqs_med', 'render_blocking_ms', 'image_delivery_kb', 'unused_css_kb', 'lcp_elemento', 'audits_fallidas'];
await fs.writeFile(`${prefijo}-medianas.csv`, [cab2.join(','), ...med.map((r) => [r.tpl, r.dev, r.runs, r.perf, r.perf_runs, r.a11y, r.a11y_runs, r.bp, r.seo, n(r.fcp), n(r.lcp), r.lcp_runs, r.cls.toFixed(3), r.cls_runs, n(r.tbt), n(r.tbt_max), n(r.kb), r.reqs, n(r.renderBlockMs), n(r.imgKb), n(r.unusedCssKb), q(r.lcpNodo), q(r.fallidas)].join(','))].join('\n') + '\n');

// Tabla legible por consola.
const pad = (s, w) => String(s ?? '').padEnd(w);
console.log(pad('plantilla', 18) + pad('dev', 8) + pad('Perf', 14) + pad('A11y', 14) + pad('BP', 4) + pad('SEO', 4) + pad('LCP', 18) + pad('CLS', 7) + pad('TBT', 5) + pad('KB', 6) + 'fallidas');
for (const r of med) console.log(pad(r.tpl, 18) + pad(r.dev, 8) + pad(`${r.perf} (${r.perf_runs})`, 14) + pad(`${r.a11y} (${r.a11y_runs})`, 14) + pad(r.bp, 4) + pad(r.seo, 4) + pad(`${n(r.lcp)} (${r.lcp_runs})`, 18) + pad(r.cls.toFixed(3), 7) + pad(n(r.tbt_max), 5) + pad(n(r.kb), 6) + r.fallidas);
console.log(`\n${filas.length} corridas -> ${prefijo}-corridas.csv / -medianas.csv`);
