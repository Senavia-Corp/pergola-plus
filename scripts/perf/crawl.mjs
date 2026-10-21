#!/usr/bin/env node
/**
 * Crawl estatico de los HTML construidos (dist/client): SEO tecnico sin navegador.
 *
 *     node scripts/perf/crawl.mjs <carpeta-salida>
 *
 * Por pagina: title, description, meta robots, canonical (autorreferente), hreflang
 * (reciprocidad y x-default), H1, orden de encabezados, imagenes sin alt o sin
 * width/height, JSON-LD (parsea, tipos, inLanguage frente al lang de la pagina),
 * enlaces internos (rotos contra el arbol + los 301 de config.json), entrantes,
 * profundidad desde / y pertenencia al sitemap. Escribe crawl.csv y crawl-resumen.json.
 */
import fs from 'node:fs/promises';
import path from 'node:path';

const RAIZ = path.resolve(import.meta.dirname, '../..');
const DIST = path.join(RAIZ, 'dist/client');
const SALIDA = process.argv[2];
if (!SALIDA) { console.error('uso: crawl.mjs <carpeta>'); process.exit(1); }
await fs.mkdir(SALIDA, { recursive: true });

const htmls = (await fs.readdir(DIST, { recursive: true })).filter((f) => f.endsWith('.html')).sort();
const rutaDe = (f) => '/' + f.replace(/index\.html$/, '').replace(/404\.html$/, '404.html');
const paginas = new Map();
for (const f of htmls) paginas.set(rutaDe(f), await fs.readFile(path.join(DIST, f), 'utf8'));

const cfg = JSON.parse(await fs.readFile(path.join(RAIZ, '.vercel/output/config.json'), 'utf8'));
const redirects = new Map(cfg.routes.filter((r) => r.status === 301 && r.headers?.Location).map((r) => [r.src.replace(/^\^/, '').replace(/\/?\$$/, '').replace(/\\/g, ''), r.headers.Location]));
const sitemap = await fs.readFile(path.join(DIST, 'sitemap.xml'), 'utf8').catch(() => '');
const enSitemap = new Set([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname));
const SITIO = sitemap.match(/<loc>(https?:\/\/[^/]+)/)?.[1] ?? 'https://www.pergolaplusflorida.com';

const attr = (tag, a) => tag.match(new RegExp(`\\s${a}="([^"]*)"`))?.[1];
const existe = (r) => {
  const limpio = r.split('#')[0].split('?')[0];
  if (paginas.has(limpio) || paginas.has(limpio.replace(/\/?$/, '/'))) return true;
  if (redirects.has(limpio.replace(/\/$/, ''))) return 'redirect';
  return /^\/(images|cms-img|videos|fonts|css|js|_astro)\//.test(limpio) || /\.(xml|txt|pdf)$/.test(limpio) ? 'asset' : false;
};

const filas = [], entrantes = new Map(), grafo = new Map();
const resumen = { paginas: paginas.size, canonicalNoAuto: [], hreflangNoReciproco: [], sinXDefault: [], h1Mal: [], saltoEncabezado: [], imgSinAlt: 0, imgSinDim: 0, jsonldRoto: [], jsonldIdiomaMal: [], enlacesRotos: [], noindex: [], fueraSitemap: [], enSitemapConNoindex: [], titulosDup: {}, descDup: {} };

for (const [ruta, html] of paginas) {
  const head = html.match(/<head>([\s\S]*?)<\/head>/)?.[1] ?? '';
  const lang = html.match(/<html[^>]*\slang="([^"]+)"/)?.[1] ?? '';
  const title = head.match(/<title>([^<]*)<\/title>/)?.[1]?.trim() ?? '';
  const desc = [...head.matchAll(/<meta\s[^>]*>/g)].map((m) => m[0]).find((t) => attr(t, 'name') === 'description');
  const description = desc ? attr(desc, 'content') : '';
  const robots = [...head.matchAll(/<meta\s[^>]*>/g)].map((m) => m[0]).find((t) => attr(t, 'name') === 'robots');
  const noindex = robots ? /noindex/.test(attr(robots, 'content') ?? '') : false;
  const canonical = head.match(/<link rel="canonical" href="([^"]+)"/)?.[1] ?? '';
  const hreflang = [...head.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g)].map((m) => ({ l: m[1], href: m[2] }));
  const encabezados = [...html.matchAll(/<h([1-6])\b/g)].map((m) => Number(m[1]));
  const h1 = encabezados.filter((n) => n === 1).length;
  let salto = '';
  for (let i = 1; i < encabezados.length; i++) if (encabezados[i] > encabezados[i - 1] + 1) { salto = `h${encabezados[i - 1]}->h${encabezados[i]}`; break; }
  const imgs = [...html.matchAll(/<img\s[^>]*>/g)].map((m) => m[0]);
  const sinAlt = imgs.filter((t) => !/\salt=/.test(t)).length;
  const sinDim = imgs.filter((t) => !/\swidth=/.test(t) || !/\sheight=/.test(t)).length;
  const ld = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  let tipos = [], ldOk = true, idiomas = [];
  for (const s of ld) {
    try {
      const j = JSON.parse(s); const nodos = j['@graph'] ?? [j];
      tipos.push(...nodos.map((x) => x['@type']).flat());
      idiomas.push(...nodos.map((x) => x.inLanguage).filter(Boolean));
    } catch { ldOk = false; }
  }
  const idiomaMal = idiomas.some((i) => !String(i).toLowerCase().startsWith(lang.toLowerCase()));
  const enlaces = [...html.matchAll(/<a\s[^>]*href="(\/[^"#?]*)/g)].map((m) => m[1]);
  const unicos = [...new Set(enlaces.map((e) => e.replace(/\/?$/, '/')))].filter((e) => !/\.\w{2,5}\/$/.test(e));
  grafo.set(ruta, unicos);
  const rotos = [...new Set(enlaces)].filter((e) => existe(e) === false);
  const viaRedirect = [...new Set(enlaces)].filter((e) => existe(e) === 'redirect');
  for (const e of unicos) if (e !== ruta) entrantes.set(e, (entrantes.get(e) ?? 0) + 1);

  const canonicalAuto = canonical === new URL(ruta, SITIO).href;
  const esError = /404/.test(ruta);
  if (!canonicalAuto && !esError) resumen.canonicalNoAuto.push(`${ruta} -> ${canonical}`);
  if (hreflang.length) {
    const propio = hreflang.find((h) => new URL(h.href).pathname === ruta);
    const otros = hreflang.filter((h) => h.l !== 'x-default' && new URL(h.href).pathname !== ruta);
    for (const o of otros) {
      const gem = paginas.get(new URL(o.href).pathname);
      if (!gem || !gem.includes(`hreflang="${lang}" href="${new URL(ruta, SITIO).href}"`)) resumen.hreflangNoReciproco.push(`${ruta} -> ${o.href}`);
    }
    if (!propio) resumen.hreflangNoReciproco.push(`${ruta} no se declara a si misma`);
    if (!hreflang.some((h) => h.l === 'x-default')) resumen.sinXDefault.push(ruta);
  }
  if (h1 !== 1) resumen.h1Mal.push(`${ruta} (${h1})`);
  if (salto) resumen.saltoEncabezado.push(`${ruta} ${salto}`);
  resumen.imgSinAlt += sinAlt; resumen.imgSinDim += sinDim;
  if (!ldOk) resumen.jsonldRoto.push(ruta);
  if (idiomaMal) resumen.jsonldIdiomaMal.push(`${ruta} lang=${lang} inLanguage=${[...new Set(idiomas)].join(',')}`);
  for (const r of rotos) resumen.enlacesRotos.push(`${ruta} -> ${r}`);
  if (noindex) resumen.noindex.push(ruta);
  if (!noindex && !esError && !enSitemap.has(ruta) && sitemap) resumen.fueraSitemap.push(ruta);
  if (noindex && enSitemap.has(ruta)) resumen.enSitemapConNoindex.push(ruta);
  if (!esError && !noindex) { (resumen.titulosDup[title] ??= []).push(ruta); (resumen.descDup[description] ??= []).push(ruta); }

  filas.push({ ruta, lang, title, titleLen: title.length, description, descLen: description.length, noindex, canonicalAuto, hreflang: hreflang.map((h) => h.l).join('|'), h1, salto, imgs: imgs.length, sinAlt, sinDim, ld: ld.length, ldOk, tipos: [...new Set(tipos)].join('|'), inLanguage: [...new Set(idiomas)].join('|'), enlaces: unicos.length, rotos: rotos.length, viaRedirect: viaRedirect.length, sitemap: enSitemap.has(ruta) });
}

// Profundidad por BFS desde / y entrantes.
const prof = new Map([['/', 0]]); const cola = ['/'];
while (cola.length) { const r = cola.shift(); for (const e of grafo.get(r) ?? []) if (paginas.has(e) && !prof.has(e)) { prof.set(e, prof.get(r) + 1); cola.push(e); } }
for (const f of filas) { f.profundidad = prof.get(f.ruta) ?? ''; f.entrantes = entrantes.get(f.ruta) ?? 0; }
resumen.titulosDup = Object.fromEntries(Object.entries(resumen.titulosDup).filter(([, v]) => v.length > 1));
resumen.descDup = Object.fromEntries(Object.entries(resumen.descDup).filter(([, v]) => v.length > 1));
resumen.sinProfundidad = filas.filter((f) => f.profundidad === '' && !/404|thank-you/.test(f.ruta)).map((f) => f.ruta);
resumen.sitemapUrls = enSitemap.size;
resumen.jsonldParsea = `${filas.filter((f) => f.ld && f.ldOk).length}/${filas.filter((f) => f.ld).length}`;
resumen.entrantesCiudades = Object.fromEntries(filas.filter((f) => /^\/pergolas-contractors\//.test(f.ruta)).map((f) => [f.ruta, f.entrantes]));
resumen.entrantesCiudadesMin = Math.min(...Object.values(resumen.entrantesCiudades));

const cab = Object.keys(filas[0]);
const q = (s) => `"${String(s ?? '').replace(/"/g, '""')}"`;
await fs.writeFile(path.join(SALIDA, 'crawl.csv'), [cab.join(','), ...filas.map((f) => cab.map((k) => q(f[k])).join(','))].join('\n') + '\n');
await fs.writeFile(path.join(SALIDA, 'crawl-resumen.json'), JSON.stringify(resumen, null, 2));
const n = (x) => (Array.isArray(x) ? x.length : typeof x === 'object' ? Object.keys(x).length : x);
console.log(Object.fromEntries(Object.entries(resumen).filter(([k]) => k !== 'entrantesCiudades').map(([k, v]) => [k, n(v)])));
for (const k of ['canonicalNoAuto', 'hreflangNoReciproco', 'h1Mal', 'saltoEncabezado', 'jsonldRoto', 'jsonldIdiomaMal', 'enlacesRotos', 'enSitemapConNoindex', 'fueraSitemap']) if (resumen[k].length) console.log(`  ${k}:`, resumen[k].slice(0, 8));
