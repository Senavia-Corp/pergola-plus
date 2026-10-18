#!/usr/bin/env node
/**
 * Inventario SEO de TODO lo construido, en CSV legible por maquina.
 *
 *     node scripts/informe-crawl.mjs [salida.csv]
 *
 * Una fila por HTML de dist/: status esperado, canonical, title, description, H1,
 * lang, robots, hreflang (y si es reciproco), og:image, JSON-LD (parsea, tipos) y
 * si esta en el sitemap. No decide nada: es la evidencia sobre la que deciden las
 * puertas (check:seo, check:noindex) y la auditoria. Estado por fila:
 * PASS / FAIL con el motivo, para que un CSV sin FAIL sea un crawl limpio.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { raizHtml } from './lib/dist.mjs';

const DIST = await raizHtml();
const SALIDA = process.argv[2] ?? 'implementation-reports/SEO-OPTIMIZATION-2026-10/05-CRAWL-SEO-VALIDATION.csv';
const htmls = (await fs.readdir(DIST, { recursive: true })).filter((p) => p.endsWith('.html')).sort();
const sitemap = await fs.readFile(path.join(DIST, 'sitemap.xml'), 'utf8').catch(() => '');
const enSitemap = new Set([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]));

const attr = (html, re) => html.match(re)?.[1] ?? '';
const csv = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
const filas = [];
const porRuta = new Map();

for (const rel of htmls) {
  const html = await fs.readFile(path.join(DIST, rel), 'utf8');
  const ruta = '/' + rel.replace(/index\.html$/, '').replace(/404\.html$/, '404/');
  const status = rel === '404.html' ? 404 : 200;
  const canonical = attr(html, /<link rel="canonical" href="([^"]+)"/);
  const title = attr(html, /<title>([^<]*)<\/title>/);
  const desc = attr(html, /<meta content="([^"]*)" name="description"/);
  const h1s = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/g)].map((m) => m[1].replace(/<[^>]+>/g, '').trim());
  const lang = attr(html, /<html lang="([a-z]+)"/);
  const robots = attr(html, /<meta name="robots" content="([^"]+)"/);
  const alternates = [...html.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g)].map((m) => [m[1], m[2]]);
  const og = attr(html, /<meta content="([^"]+)" property="og:image"/);
  const lds = [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  let tipos = [], ldOk = true;
  for (const ld of lds) {
    try {
      const j = JSON.parse(ld);
      const nodos = Array.isArray(j) ? j : (j['@graph'] ?? [j]);
      tipos.push(...nodos.map((n) => n['@type']).flat());
    } catch { ldOk = false; }
  }
  porRuta.set(canonical, { alternates });
  filas.push({ rel, ruta, status, canonical, title, desc, h1s, lang, robots, alternates, og, tipos, ldOk, sitemap: enSitemap.has(canonical) });
}

const cab = ['url', 'status_esperado', 'indexable', 'canonical', 'canonical_coincide', 'title', 'title_len', 'description_len', 'h1', 'h1_count', 'lang', 'robots', 'hreflang', 'hreflang_reciproco', 'og_image', 'jsonld_tipos', 'jsonld_parsea', 'en_sitemap', 'estado', 'motivo'];
const lineas = [cab.join(',')];
let fails = 0;
for (const f of filas) {
  const noindex = /noindex/.test(f.robots);
  const canonicalCoincide = f.canonical.endsWith(f.ruta) || (f.ruta === '/404' && f.canonical.endsWith('/404'));
  let reciproco = 'NOT_APPLICABLE';
  if (f.alternates.length) {
    reciproco = f.alternates.filter(([h]) => h !== 'x-default').every(([, href]) => {
      const otra = porRuta.get(href);
      return otra && otra.alternates.some(([, h2]) => h2 === f.canonical);
    }) ? 'PASS' : 'FAIL';
  }
  const motivos = [];
  if (!f.title) motivos.push('sin title');
  if (!f.desc) motivos.push('sin description');
  if (f.h1s.length !== 1) motivos.push(`h1=${f.h1s.length}`);
  if (!f.canonical) motivos.push('sin canonical');
  if (!canonicalCoincide) motivos.push('canonical no coincide con la ruta');
  if (!f.ldOk) motivos.push('JSON-LD no parsea');
  if (reciproco === 'FAIL') motivos.push('hreflang no reciproco');
  if (!noindex && !f.sitemap && f.status === 200) motivos.push('indexable fuera del sitemap');
  if (noindex && f.sitemap) motivos.push('noindex dentro del sitemap');
  if (!f.og) motivos.push('sin og:image');
  const estado = motivos.length ? 'FAIL' : 'PASS';
  if (estado === 'FAIL') fails++;
  lineas.push([
    f.ruta, f.status, noindex ? 'no' : 'si', f.canonical, canonicalCoincide ? 'si' : 'no', f.title, f.title.length, f.desc.length,
    f.h1s[0] ?? '', f.h1s.length, f.lang, f.robots || 'index', f.alternates.map((a) => a.join(':')).join(' '), reciproco,
    f.og, [...new Set(f.tipos)].join(' '), f.ldOk ? 'si' : 'no', f.sitemap ? 'si' : 'no', estado, motivos.join('; '),
  ].map(csv).join(','));
}
await fs.mkdir(path.dirname(SALIDA), { recursive: true });
await fs.writeFile(SALIDA, lineas.join('\n') + '\n', 'utf8');
console.log(`${filas.length} paginas · ${fails} FAIL · sitemap ${enSitemap.size} urls -> ${SALIDA}`);
