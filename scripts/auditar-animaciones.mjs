#!/usr/bin/env node
/**
 * Auditoria de las entradas por scroll, EN EL NAVEGADOR y con foco real.
 *
 *     npm run auditar:animaciones
 *
 * Es una HERRAMIENTA, no una puerta: Playwright es devDependency de este script y de
 * auditar-nitidez.mjs, y `npm run check` sigue sin navegador. Lo que si es puerta es
 * scripts/comprobar-animaciones.mjs, que mide lo mismo de forma estatica.
 *
 * QUE SIRVE Y POR QUE
 *
 * Sirve .vercel/output/static, que es literalmente lo que despliega Vercel. Ni
 * `astro preview` (el adaptador de Vercel no trae servidor) ni `astro dev` (no aplica
 * la reescritura de enlaces al espanol, que es un paso de build) valen aqui.
 *
 * LA TRAMPA DEL FOCO
 *
 * Documentada en docs/auditoria-animaciones.md y en docs/decisiones.md: con la pestana
 * sin foco, requestAnimationFrame se para y los tweens se congelan a medias. Una
 * pagina sana se lee como rota y una rota puede leerse como sana. Ya produjo un falso
 * positivo en la auditoria de la migracion.
 *
 * Por eso, antes de CADA medicion, esto comprueba tres cosas y ABORTA si alguna falla:
 * document.hasFocus(), document.hidden y un contador de fotogramas real. Y no degrada
 * a un informe parcial: una sonda que no puede medir tiene que decirlo, no dar verde.
 *
 * QUE MIDE
 *
 * Lo mas util no es la opacidad: es `getAnimations()`. Si la animacion de un elemento
 * tiene `timeline instanceof ViewTimeline`, el scroll-timeline engancho de verdad —y
 * eso no depende de rAF. La opacidad se mira despues, para cazar lo que el CSS no
 * cuenta: elementos que se quedan a medias porque el scroll se acaba antes.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import { chromium } from 'playwright';
import { POR_UUID, CLASES, EXCLUIDOS } from './lib/reveals.mjs';

const RAIZ = path.resolve(import.meta.dirname, '..');
const ESTATICO = path.join(RAIZ, '.vercel/output/static');

/** Un arquetipo de cada tipo de pagina, mas las gemelas en espanol que existen. */
const RUTAS = [
  '/', '/products/cabanas', '/services/concrete', '/about-us/about-us',
  '/about-us/industries-we-serve', '/pergolas-contractors/aventura-pergola-builders',
  '/countries/broward-county-pergola-contractor', '/brands/appolo',
  '/project/attached-forte-pergola-in-west-palm-beach', '/resources/blog',
  '/post/add-shade-backyard-south-florida', '/contact-us/get-a-quote',
  '/es/products/cabanas', '/es/services/concrete', '/es/brands/appolo',
  '/es/resources/blog', '/es/contact-us/get-a-quote',
];

/** En movil las animaciones pesan el doble: los cuatro anchos del encargo. */
const ANCHOS = [[1440, 900], [1280, 800], [768, 1024], [375, 667]];

const TIPO = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript',
  '.avif': 'image/avif', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.webp': 'image/webp', '.woff2': 'font/woff2', '.json': 'application/json',
  '.xml': 'application/xml', '.txt': 'text/plain', '.mp4': 'video/mp4',
};

// ------------------------------------------------------------------ 0. servidor
const existe = async (f) => !!(await fs.stat(f).catch(() => null))?.isFile();
const servidor = http.createServer(async (req, res) => {
  const u = decodeURIComponent(req.url.split('?')[0]);
  for (const c of [u.slice(1), `${u.replace(/\/$/, '')}/index.html`, `${u.slice(1)}index.html`]) {
    const f = path.join(ESTATICO, c);
    if (c && await existe(f)) {
      res.writeHead(200, { 'content-type': TIPO[path.extname(f)] ?? 'application/octet-stream' });
      return (await fs.readFile(f).then((b) => res.end(b)));
    }
  }
  res.writeHead(404); return res.end('404');
});

if (!(await fs.stat(ESTATICO).catch(() => null))) {
  console.error(`FALLO: no existe ${ESTATICO}. Corre \`npm run build\` primero.`);
  process.exit(1);
}
await new Promise((r) => servidor.listen(0, '127.0.0.1', r));
const BASE = `http://127.0.0.1:${servidor.address().port}`;

// ------------------------------------------------------------- 1. barrido estatico
console.log('\n  barrido de las 211 paginas construidas\n');

const paginas = (await fs.readdir(ESTATICO, { recursive: true })).filter((f) => f.endsWith('.html'));
const desviaciones = [];
let conEntrada = 0;
for (const rel of paginas) {
  const h = await fs.readFile(path.join(ESTATICO, rel), 'utf8');
  const uuids = [...h.matchAll(/data-w-id="([^"]+)"/g)].map((m) => m[1]);
  const n = uuids.filter((u) => POR_UUID[u]).length
    + CLASES.reduce((s, c) => s + (h.match(new RegExp(`class="[^"]*\\b${c.slice(1)}\\b`, 'g')) ?? []).length, 0);
  if (n) conEntrada++;
  const mal = [];
  if (/style="opacity:\s*0"/.test(h)) mal.push('opacity:0 en linea');
  if (h.includes('w-mod-js:not(.w-mod-ix)')) mal.push('bloque anti-FOUC');
  if (!n) mal.push('cero elementos con entrada');
  if (mal.length) desviaciones.push(`${rel}: ${mal.join(', ')}`);
}
console.log(`  paginas: ${paginas.length} · con al menos una entrada: ${conEntrada}`);
if (desviaciones.length) {
  console.log(`  ${desviaciones.length} DESVIACIONES:`);
  for (const d of desviaciones.slice(0, 20)) console.log(`     ${d}`);
} else {
  console.log('  sin desviaciones.');
}

// ------------------------------------------------------- 2. medicion en navegador
const navegador = await chromium.launch({
  headless: false,
  args: ['--disable-background-timer-throttling', '--disable-renderer-backgrounding',
    '--disable-backgrounding-occluded-windows'],
});

const informe = [];
let abortadas = 0;
let conProblemas = 0;

for (const [ancho, alto] of ANCHOS) {
  console.log(`\n  ${ancho}x${alto}\n`);
  const ctx = await navegador.newContext({
    viewport: { width: ancho, height: alto },
    // Lo contrario de auditar-nitidez.mjs: con 'reduce' el sistema entero se apaga por
    // diseno y todas las mediciones serian un falso verde.
    reducedMotion: 'no-preference',
  });
  // Todo lo que no sea nuestro servidor se aborta: sin esto cada pagina se cuelga
  // esperando el jQuery de cloudfront.
  await ctx.route('**/*', (r) => (r.request().url().startsWith(BASE) ? r.continue() : r.abort()));
  const pag = await ctx.newPage();

  for (const ruta of RUTAS) {
    const resp = await pag.goto(BASE + ruta, { waitUntil: 'domcontentloaded', timeout: 20000 })
      .catch(() => null);
    if (!resp?.ok()) { console.log(`  (no existe ${ruta})`); continue; }
    await pag.bringToFront();

    // LA SONDA. Si esto no pasa, la medicion no vale y no se reporta.
    const sonda = await pag.evaluate(async () => {
      let n = 0; const t = performance.now();
      await new Promise((r) => (function f() {
        n++; performance.now() - t < 400 ? requestAnimationFrame(f) : r();
      }()));
      return { foco: document.hasFocus(), oculto: document.hidden, fotogramas: n };
    });
    if (!sonda.foco || sonda.oculto || sonda.fotogramas < 8) {
      console.log(`  !! MEDICION INVALIDA ${ruta} — ${JSON.stringify(sonda)}`);
      abortadas++;
      continue;
    }

    const antes = await pag.evaluate(() => document.getAnimations()
      .filter((a) => a.timeline?.constructor.name === 'ViewTimeline').length);

    await pag.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += innerHeight) {
        scrollTo(0, y);
        await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      }
      scrollTo(0, document.body.scrollHeight);
      await new Promise((r) => setTimeout(r, 200));
    });

    const d = await pag.evaluate(() => {
      const conVista = [...document.querySelectorAll('*')]
        .filter((e) => e.getAnimations().some((a) => a.timeline?.constructor.name === 'ViewTimeline'));
      const aMedias = conVista
        .filter((e) => +getComputedStyle(e).opacity < 0.995 && e.getBoundingClientRect().height > 0)
        .map((e) => `${(e.className || e.tagName).toString().slice(0, 30)}@${(+getComputedStyle(e).opacity).toFixed(2)}`);
      const sinArrancar = conVista
        .filter((e) => e.getAnimations().every((a) => (a.overallProgress ?? 1) === 0))
        .map((e) => (e.className || e.tagName).toString().slice(0, 30));
      const menu = document.querySelector('.menu');
      return {
        reveals: conVista.length,
        aMedias,
        sinArrancar,
        navTocado: menu
          ? menu.getAnimations().some((a) => a.timeline?.constructor.name === 'ViewTimeline')
          : false,
      };
    });

    const problemas = d.aMedias.length + d.sinArrancar.length + (d.navTocado ? 1 : 0);
    if (problemas) conProblemas++;
    informe.push({ ruta, ancho, reveals: d.reveals, antes, ...d });
    console.log(`  ${problemas ? 'AVISO' : 'ok   '} ${ruta.padEnd(50)} reveals=${String(d.reveals).padStart(3)}`
      + (problemas ? `  a-medias=${d.aMedias.join(' ')} sin-arrancar=${d.sinArrancar.join(' ')}${d.navTocado ? ' NAV-ANIMADO' : ''}` : ''));
  }
  await ctx.close();
}

await navegador.close();
servidor.close();

await fs.writeFile(path.join(RAIZ, 'docs/auditoria-animaciones.json'),
  `${JSON.stringify({ desviaciones, informe }, null, 1)}\n`);

console.log(`\n  ${informe.length} mediciones validas · ${abortadas} abortadas por foco `
  + `· ${conProblemas} con avisos · ${desviaciones.length} desviaciones en el barrido`);
console.log('  detalle -> docs/auditoria-animaciones.json\n');
process.exit(abortadas || conProblemas || desviaciones.length ? 1 : 0);
