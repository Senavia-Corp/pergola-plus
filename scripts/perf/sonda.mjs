#!/usr/bin/env node
/**
 * Sonda funcional y de regresion (Playwright, Chromium del repo).
 *
 *     node scripts/perf/sonda.mjs <carpeta-salida> [--sin-capturas] [--comparar <sonda.json>]
 *
 * 22 rutas x 320/375/768/1440 (isMobile+hasTouch por debajo de 768). Por carga:
 * status, H1 unico, overflow horizontal, lang, <main>, enlace de salto, menu movil
 * (abre, foco dentro, inert en hermanos, Escape cierra y retira inert), dropdown de
 * escritorio (abre, aria-expanded, Escape), 14 tabulaciones con anillo de foco,
 * objetivos < 24 px, imagenes con natural > 2 x render x DPR, estado del video a
 * los 8 s, consola y bytes antes de `load`. Mas una pasada con reducedMotion:'reduce'
 * en la home. Y capturas de pagina completa a 375/768/1440 (pasada aparte con
 * movimiento reducido para que sean deterministas: ver diff-visual.mjs).
 *
 * Se espera por ESTADOS (clase w--open, imagen `complete`, video con currentTime),
 * nunca por un reloj: regla dura de ~/Sites/CLAUDE.md.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';
import { RUTAS_SONDA, BASE } from './plantillas.mjs';

const args = process.argv.slice(2);
const SALIDA = args.find((a) => !a.startsWith('--'));
if (!SALIDA) { console.error('uso: sonda.mjs <carpeta> [--sin-capturas] [--comparar <json>]'); process.exit(1); }
const CAPTURAS = !args.includes('--sin-capturas');
const SOLO_CAPTURAS = args.includes('--solo-capturas');
// --estados: solo las capturas de ESTADO (menu movil abierto, desplegable abierto y con
// hover, lightbox abierto), viewport y sin fotos. Son las que miden la paridad de F7.
const ESTADOS = args.includes('--estados');
const COMPARAR = args.includes('--comparar') ? args[args.indexOf('--comparar') + 1] : null;
const ANCHOS = (args.includes('--anchos') ? args[args.indexOf('--anchos') + 1].split(',').map(Number) : [320, 375, 768, 1440]);
const SOLO = args.includes('--solo') ? args[args.indexOf('--solo') + 1].split(',') : null;
const slug = (r) => (r === '/' ? 'home' : r.replace(/^\/|\/$/g, '').replace(/\//g, '_'));

const RESUMIR = args.includes('--resumir');
const sinSvg = (r) => { if (r.imgs?.sobredim) r.imgs.sobredim = r.imgs.sobredim.filter((x) => !/\.svg(\s|$)/i.test(x.split(' ')[0])); return r; };
await fs.mkdir(path.join(SALIDA, 'capturas'), { recursive: true });
const navegador = RESUMIR ? null : await chromium.launch();

/** Lo que se mide dentro de la pagina, en un solo evaluate. */
const MEDIR = () => {
  const dpr = devicePixelRatio || 1;
  const visible = (e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && getComputedStyle(e).visibility !== 'hidden'; };
  const desc = (e) => `${e.tagName}${e.id ? '#' + e.id : ''}.${[...e.classList].slice(0, 2).join('.')}`;
  const imgs = [...document.images];
  const sobredim = imgs.filter((i) => i.complete && i.naturalWidth && i.clientWidth > 0 && visible(i) && !/\.svg(\?|$)/i.test(i.currentSrc || i.src) && i.naturalWidth > 2 * i.clientWidth * dpr)
    .map((i) => `${new URL(i.currentSrc || i.src).pathname} ${i.naturalWidth}->${i.clientWidth}`);
  const rotas = imgs.filter((i) => i.complete && !i.naturalWidth && !/\.svg$/i.test(i.currentSrc || i.src) && i.loading !== 'lazy').length;
  const controles = [...document.querySelectorAll('a[href],button,input,select,textarea,[role="button"]')].filter(visible);
  const pequenos = controles.filter((e) => { const r = e.getBoundingClientRect(); return r.width < 24 || r.height < 24; })
    .map((e) => `${desc(e)} ${Math.round(e.getBoundingClientRect().width)}x${Math.round(e.getBoundingClientRect().height)}`);
  const v = document.querySelector('.hero-video-main video');
  const video = v ? { poster: !!v.poster, preload: v.preload, autoplay: v.autoplay, paused: v.paused, readyState: v.readyState, currentTime: Math.round(v.currentTime * 10) / 10, src: v.currentSrc ? new URL(v.currentSrc).pathname : '' } : null;
  const skip = document.querySelector('a[href="#main"], a.pp-saltar, a.skip-link');
  return {
    h1: document.querySelectorAll('h1').length,
    overflowX: Math.max(0, document.documentElement.scrollWidth - innerWidth),
    lang: document.documentElement.lang,
    main: document.querySelectorAll('main').length,
    mainId: document.querySelector('main')?.id ?? '',
    skip: skip ? { href: skip.getAttribute('href'), primero: document.body.querySelector('a[href],button,input,[tabindex]') === skip } : null,
    imgs: { total: imgs.length, sobredim, rotas },
    targetsPequenos: pequenos,
    video,
    titulo: document.title,
  };
};

const ANILLO = () => {
  const e = document.activeElement;
  if (!e || e === document.body) return { el: 'BODY', anillo: true };
  // El anillo puede pintarlo el propio elemento, su ::after (la tarjeta de producto)
  // o un contenedor con :focus-within (la tarjeta del blog: el enlace es el h3 y el
  // anillo va en .pp-card). Se miran hasta 3 niveles por encima.
  const tiene = (el, pseudo) => { const cs = getComputedStyle(el, pseudo); return (cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0) || (cs.boxShadow && cs.boxShadow !== 'none'); };
  let anillo = tiene(e) || tiene(e, '::after') || tiene(e, '::before');
  for (let p = e.parentElement, n = 0; p && n < 3 && !anillo; p = p.parentElement, n++) if (p.matches(':focus-within') && tiene(p)) anillo = true;
  return { el: `${e.tagName}${e.id ? '#' + e.id : ''}.${[...e.classList].slice(0, 2).join('.')}`, anillo };
};

async function medirRuta(ruta, ancho, opciones = {}) {
  const ctx = await navegador.newContext({
    viewport: { width: ancho, height: ancho < 768 ? 812 : 900 },
    isMobile: ancho < 768, hasTouch: ancho < 768,
    deviceScaleFactor: ancho < 768 ? 3 : 1,
    reducedMotion: opciones.reducedMotion ?? 'no-preference',
  });
  const page = await ctx.newPage();
  const consola = [];
  page.on('console', (m) => { if (['error', 'warning'].includes(m.type())) consola.push(`${m.type()}: ${m.text().slice(0, 160)}`); });
  page.on('pageerror', (e) => consola.push(`pageerror: ${String(e).slice(0, 160)}`));
  const bytes = {}; let cargado = false; let bytesAntesLoad = 0; let bytesTotal = 0;
  page.on('requestfinished', async (req) => {
    try {
      const s = await req.sizes(); const b = s.responseBodySize + s.responseHeadersSize;
      const ext = (new URL(req.url()).pathname.match(/\.(\w+)$/)?.[1] ?? 'html').toLowerCase();
      bytes[ext] = (bytes[ext] ?? 0) + b; bytesTotal += b; if (!cargado) bytesAntesLoad += b;
    } catch { /* peticion abortada */ }
  });
  const r = { ruta, w: ancho, ...(opciones.reducedMotion ? { reducedMotion: true } : {}) };
  try {
    const resp = await page.goto(BASE + ruta, { waitUntil: 'load', timeout: 60000 });
    cargado = true;
    r.status = resp?.status();
    // Deja que lleguen las imagenes del primer viewport: estado, no reloj.
    await page.waitForFunction(() => [...document.images].filter((i) => i.getBoundingClientRect().top < innerHeight && i.getBoundingClientRect().bottom > 0).every((i) => i.complete), null, { timeout: 15000 }).catch(() => {});
    Object.assign(r, await page.evaluate(MEDIR));

    // Video: se le dan hasta 8 s para arrancar, y se anota lo que hay a los 8 s.
    if (r.video) {
      const t0 = Date.now();
      await page.waitForFunction(() => { const v = document.querySelector('.hero-video-main video'); return v && v.currentTime > 1; }, null, { timeout: 8000 }).catch(() => {});
      const resto = 8000 - (Date.now() - t0);
      if (resto > 0) await page.waitForTimeout(resto); // el dato pedido es "a los 8 s"
      r.video = (await page.evaluate(MEDIR)).video;
    }

    // 14 tabulaciones con anillo.
    await page.evaluate(() => { window.scrollTo(0, 0); document.activeElement?.blur?.(); });
    const paradas = [];
    for (let i = 0; i < 14; i++) { await page.keyboard.press('Tab'); paradas.push(await page.evaluate(ANILLO)); }
    r.tab = { paradas: paradas.map((p) => p.el), sinAnillo: paradas.filter((p) => !p.anillo).map((p) => p.el), primera: paradas[0]?.el };

    // Menu movil (hasta 991 px el nav colapsa).
    if (ancho < 992 && await page.$('.menu .w-nav-button')) {
      const boton = page.locator('.menu .w-nav-button');
      // Tras 14 tabulaciones la pagina esta abajo y el nav (IX2 PAGE_SCROLL_DOWN) se mueve: se vuelve arriba y se fuerza el click sin esperar estabilidad.
      await page.evaluate(() => { document.activeElement?.blur?.(); window.scrollTo(0, 0); });
      await page.waitForFunction(() => scrollY === 0);
      await boton.click({ force: true, timeout: 5000 });
      r.menuAbre = await page.waitForFunction(() => document.querySelector('.menu .w-nav-button')?.classList.contains('w--open'), null, { timeout: 3000 }).then(() => true, () => false);
      if (r.menuAbre) {
        await page.keyboard.press('Tab');
        r.menuFocusDentro = await page.evaluate(() => !!document.querySelector('.menu')?.contains(document.activeElement));
        r.inert = await page.evaluate(() => [...document.body.children].filter((e) => e.inert).length);
        await page.keyboard.press('Escape');
        r.menuCierraEsc = await page.waitForFunction(() => !document.querySelector('.menu .w-nav-button')?.classList.contains('w--open'), null, { timeout: 3000 }).then(() => true, () => false);
        r.inertTrasCerrar = await page.evaluate(() => [...document.body.children].filter((e) => e.inert).length);
        r.focoEnBotonTrasEsc = await page.evaluate(() => document.activeElement === document.querySelector('.menu .w-nav-button'));
      }
    }
    // Dropdown de escritorio.
    if (ancho >= 992 && await page.$('.menu .w-dropdown-toggle')) {
      const toggle = page.locator('.menu .w-dropdown-toggle').first();
      await toggle.focus();
      await page.keyboard.press('Enter');
      r.dropdownAbre = await page.waitForFunction(() => document.querySelector('.menu .w-dropdown-toggle')?.classList.contains('w--open'), null, { timeout: 3000 }).then(() => true, () => false);
      if (!r.dropdownAbre) { await toggle.click({ force: true, timeout: 5000 }); r.dropdownAbre = await page.waitForFunction(() => document.querySelector('.menu .w-dropdown-toggle')?.classList.contains('w--open'), null, { timeout: 3000 }).then(() => true, () => false); r.dropdownSoloClick = true; }
      r.dropdownExpanded = await page.evaluate(() => document.querySelector('.menu .w-dropdown-toggle')?.getAttribute('aria-expanded'));
      // Lista visible de verdad (no solo la clase): display y opacidad del panel.
      r.dropdownVisible = await page.evaluate(() => { const l = document.querySelector('.menu .w-dropdown-list'); if (!l) return false; const cs = getComputedStyle(l); return cs.display !== 'none' && parseFloat(cs.opacity) > 0.5; });
      // Hover de preview del mega-menu: al pasar el raton por el primer item, su
      // imagen de preview se hace visible (IX2 hoy; CSS :hover si se sustituye).
      // Hover sobre el SEGUNDO item: tiene que aparecer .preview-image.is-2 y
      // esconderse la portada (.preview-image-cover). Es lo que hace IX2 hoy.
      const item = page.locator('.menu .w-dropdown:has(> .w-dropdown-toggle.w--open) .submenu-item').nth(1);
      if (await item.count()) {
        await item.hover();
        r.hoverPreview = await page.waitForFunction(() => {
          const d = document.querySelector('.menu .w-dropdown:has(> .w-dropdown-toggle.w--open)');
          const vis = (i) => i && getComputedStyle(i).display !== 'none' && parseFloat(getComputedStyle(i).opacity) > 0.9;
          return vis(d.querySelector('.preview-image.is-2')) && !vis(d.querySelector('.preview-image-cover'));
        }, null, { timeout: 2500 }).then(() => true, () => false);
        // Y con teclado: el foco en el item tambien tiene que enseñar su preview
        // (hoy IX2 solo escucha hover; se anota para el sustituto de F7).
        await page.mouse.move(0, 0);
        await item.focus();
        r.focoPreview = await page.waitForFunction(() => {
          const d = document.querySelector('.menu .w-dropdown:has(> .w-dropdown-toggle.w--open)');
          const i = d.querySelector('.preview-image.is-2'); return i && getComputedStyle(i).display !== 'none' && parseFloat(getComputedStyle(i).opacity) > 0.9;
        }, null, { timeout: 1500 }).then(() => true, () => false);
      }
      await toggle.focus();
      await page.keyboard.press('Escape');
      r.dropdownCierraEsc = await page.waitForFunction(() => !document.querySelector('.menu .w-dropdown-toggle')?.classList.contains('w--open'), null, { timeout: 3000 }).then(() => true, () => false);
      r.dropdownFocoTrasEsc = await page.evaluate(() => document.activeElement === document.querySelector('.menu .w-dropdown-toggle'));
    }
    // Lightbox (23 galerias): abre al clic, carga la foto, flecha derecha cambia de foto,
    // la tira marca la activa, Escape cierra y el foco vuelve al enlace.
    if (await page.$('a.w-lightbox')) {
      const a = page.locator('a.w-lightbox').first();
      await a.scrollIntoViewIfNeeded().catch(() => {});
      await a.dispatchEvent('click').catch(() => {}); // click sintetico: con force el clic real cae donde haya algo fijo encima
      const lb = { abre: false };
      lb.antes = await page.evaluate(() => ({ html: document.documentElement.className, inert: [...document.body.children].filter((e) => e.inert).length, menu: !!document.querySelector('.menu .w-nav-button.w--open'), foco: document.activeElement?.className?.slice(0, 30), y: Math.round(scrollY) }));
      lb.abre = await page.waitForFunction(() => { const b = document.querySelector('.w-lightbox-backdrop'); const i = document.querySelector('.w-lightbox-image'); return b && getComputedStyle(b).display !== 'none' && parseFloat(getComputedStyle(b).opacity) > 0.9 && i && i.complete && i.naturalWidth > 0; }, null, { timeout: 8000 }).then(() => true, () => false);
      if (lb.abre) {
        lb.items = await page.evaluate(() => document.querySelectorAll('.w-lightbox-item').length);
        lb.activa = await page.evaluate(() => [...document.querySelectorAll('.w-lightbox-item')].findIndex((i) => i.classList.contains('w-lightbox-active')));
        lb.focoDentro = await page.evaluate(() => !!document.querySelector('.w-lightbox-backdrop')?.contains(document.activeElement));
        lb.restoOculto = await page.evaluate(() => [...document.body.children].filter((e) => e.tagName !== 'SCRIPT' && !e.classList.contains('w-lightbox-backdrop')).every((e) => e.getAttribute('aria-hidden') === 'true'));
        const src0 = await page.evaluate(() => document.querySelector('.w-lightbox-image')?.getAttribute('src'));
        await page.keyboard.press('ArrowRight');
        lb.derecha = lb.items > 1 ? await page.waitForFunction((s0) => { const i = document.querySelector('.w-lightbox-image'); return i && i.getAttribute('src') !== s0 && i.complete && i.naturalWidth > 0; }, src0, { timeout: 8000 }).then(() => true, () => false) : null;
        lb.activaTras = await page.evaluate(() => [...document.querySelectorAll('.w-lightbox-item')].findIndex((i) => i.classList.contains('w-lightbox-active')));
        await page.keyboard.press('Escape');
        lb.escape = await page.waitForFunction(() => { const b = document.querySelector('.w-lightbox-backdrop'); return !b || getComputedStyle(b).display === 'none'; }, null, { timeout: 3000 }).then(() => true, () => false);
        lb.focoVuelve = await page.evaluate(() => document.activeElement === document.querySelector('a.w-lightbox'));
        lb.restoVisible = await page.evaluate(() => [...document.body.children].every((e) => e.getAttribute('aria-hidden') !== 'true' || e.classList.contains('w-lightbox-backdrop')));
        lb.noscroll = await page.evaluate(() => document.documentElement.classList.contains('w-lightbox-noscroll'));
      }
      r.lightbox = lb;
    }
    r.consola = consola;
    r.bytesAntesLoadKb = Math.round(bytesAntesLoad / 1024);
    r.bytesTotalKb = Math.round(bytesTotal / 1024);
    r.bytesPorTipoKb = Object.fromEntries(Object.entries(bytes).map(([k, v]) => [k, Math.round(v / 1024)]));
  } catch (e) {
    r.error = String(e?.stack ?? e).replace(/\n\s+/g, ' | ').slice(0, 500);
  }
  await ctx.close();
  return r;
}

/** Capturas deterministas: movimiento reducido, lazy forzadas por scroll, fullPage. */
async function capturar(ruta, ancho) {
  const ctx = await navegador.newContext({ viewport: { width: ancho, height: ancho < 768 ? 812 : 900 }, isMobile: ancho < 768, hasTouch: ancho < 768, deviceScaleFactor: 1, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.goto(BASE + ruta, { waitUntil: 'load', timeout: 60000 });
  // Recorre la pagina para disparar las lazy, espera a que TODAS esten completas.
  await page.evaluate(async () => {
    const h = document.documentElement.scrollHeight; const paso = innerHeight * 0.8;
    for (let y = 0; y < h; y += paso) { window.scrollTo(0, y); await new Promise((r) => requestAnimationFrame(() => setTimeout(r, 40))); }
    window.scrollTo(0, 0);
  });
  await page.waitForFunction(() => [...document.images].every((i) => i.complete || i.loading === 'lazy' && !i.getBoundingClientRect().width), null, { timeout: 20000 }).catch(() => {});
  await page.waitForFunction(() => document.fonts.status === 'loaded', null, { timeout: 5000 }).catch(() => {});
  // Congela lo que se mueve solo (marquee, transiciones), para que dos capturas de la
  // misma pagina sean iguales.
  await page.addStyleTag({ content: '*,*::before,*::after{animation-play-state:paused!important;transition:none!important;caret-color:transparent!important}' });
  const f = path.join(SALIDA, 'capturas', `${slug(ruta)}-${ancho}.png`);
  const tirar = (ruta) => page.screenshot({ path: ruta, fullPage: true, animations: 'disabled' }).catch(async (e) => {
    // Paginas muy altas: se recorta a lo que Chromium admite.
    await page.screenshot({ path: ruta, fullPage: false });
    console.log(`  (captura ${path.basename(ruta)} solo viewport: ${String(e).slice(0, 80)})`);
  });
  await tirar(f);
  // Segunda captura SIN fotos: las <img> raster se ocultan (visibility, no display: la
  // caja se queda) y el video tambien. Es la que decide el diff visual: una foto
  // servida a otro tamaño cambia pixeles por remuestreo sin cambiar nada de lo que
  // importa (maquetacion, texto, color, bordes), y eso no se puede separar con un
  // umbral. La captura con fotos se guarda igual, para mirarla.
  await page.addStyleTag({ content: 'img:not([src$=".svg"]),video,picture{visibility:hidden!important}' });
  await tirar(f.replace(/\.png$/, '-sinfotos.png'));
  await ctx.close();
}

/**
 * Capturas de ESTADO, viewport y sin fotos: menu movil abierto (y con su primer
 * desplegable abierto) por debajo de 992, desplegable abierto y con hover en el segundo
 * item en escritorio, y el lightbox abierto donde hay galeria. Es lo que webflow.js
 * dibujaba y lo que el sustituto de F7 tiene que dibujar igual.
 */
async function capturarEstados(ruta, ancho) {
  const ctx = await navegador.newContext({ viewport: { width: ancho, height: ancho < 768 ? 812 : 900 }, isMobile: ancho < 768, hasTouch: ancho < 768, deviceScaleFactor: 1, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.goto(BASE + ruta, { waitUntil: 'load', timeout: 60000 });
  await page.waitForFunction(() => document.fonts.status === 'loaded', null, { timeout: 5000 }).catch(() => {});
  await page.addStyleTag({ content: '*,*::before,*::after{animation-play-state:paused!important;transition:none!important;caret-color:transparent!important} img:not([src$=".svg"]),video,picture{visibility:hidden!important}' });
  const base = path.join(SALIDA, 'capturas', `${slug(ruta)}-${ancho}`);
  const tirar = (n) => page.screenshot({ path: `${base}-${n}-sinfotos.png`, fullPage: false, animations: 'disabled' });
  const abierto = (sel) => page.waitForFunction((q) => document.querySelector(q)?.classList.contains('w--open'), sel, { timeout: 3000 }).then(() => true, () => false);
  if (ancho < 992 && await page.$('.menu .w-nav-button')) {
    await page.locator('.menu .w-nav-button').click({ force: true });
    if (await abierto('.menu .w-nav-button')) {
      await page.waitForTimeout(500);
      await tirar('menu');
      if (await page.$('.menu .w-dropdown-toggle')) {
        await page.locator('.menu .w-dropdown-toggle').first().click({ force: true });
        if (await abierto('.menu .w-dropdown-toggle')) { await page.waitForTimeout(300); await tirar('menu-desplegable'); }
      }
    }
  } else if (ancho >= 992 && await page.$('.menu .w-dropdown-toggle')) {
    await page.locator('.menu .w-dropdown-toggle').first().click();
    if (await abierto('.menu .w-dropdown-toggle')) {
      await tirar('desplegable');
      const item = page.locator('.menu .w-dropdown:has(> .w-dropdown-toggle.w--open) .submenu-item').nth(1);
      if (await item.count()) {
        await item.hover();
        await page.waitForFunction(() => { const d = document.querySelector('.menu .w-dropdown:has(> .w-dropdown-toggle.w--open)'); const i = d?.querySelector('.preview-image.is-2'); return i && getComputedStyle(i).display !== 'none' && parseFloat(getComputedStyle(i).opacity) > 0.9; }, null, { timeout: 2500 }).catch(() => {});
        await tirar('desplegable-hover');
      }
      await page.keyboard.press('Escape');
    }
  }
  if (await page.$('a.w-lightbox')) {
    const a = page.locator('a.w-lightbox').first();
    await a.scrollIntoViewIfNeeded().catch(() => {});
    await a.dispatchEvent('click').catch(() => {}); // click sintetico: con force el clic real cae donde haya algo fijo encima
    const ok = await page.waitForFunction(() => { const b = document.querySelector('.w-lightbox-backdrop'); const i = document.querySelector('.w-lightbox-image'); const th = [...document.querySelectorAll('.w-lightbox-item img')]; return b && getComputedStyle(b).display !== 'none' && i && i.complete && th.every((t) => t.complete); }, null, { timeout: 8000 }).then(() => true, () => false);
    if (ok) { await page.waitForTimeout(400); await tirar('lightbox'); }
  }
  await ctx.close();
}

const t0 = Date.now();
let resultados = [];
if (RESUMIR) resultados = JSON.parse(await fs.readFile(path.join(SALIDA, 'sonda.json'), 'utf8')).map(sinSvg);
const RUTAS = SOLO ?? RUTAS_SONDA;
const tareas = RUTAS.flatMap((ruta) => ANCHOS.map((w) => [ruta, w]));
if (!SOLO || SOLO.includes('/')) tareas.push(['/', 1440, { reducedMotion: 'reduce' }], ['/', 375, { reducedMotion: 'reduce' }]);
// 3 contextos a la vez: suficiente para no tardar 15 min y poco para no falsear el video.
let i = 0;
await Promise.all(Array.from({ length: RESUMIR || SOLO_CAPTURAS || ESTADOS ? 0 : 3 }, async () => {
  while (i < tareas.length) {
    const [ruta, w, op] = tareas[i++];
    const r = await medirRuta(ruta, w, op);
    resultados.push(r);
    const flags = [r.status !== 200 && !/no-existe/.test(ruta) ? `status ${r.status}` : '', r.h1 !== 1 ? `h1=${r.h1}` : '', r.overflowX ? `overflowX ${r.overflowX}` : '', r.imgs?.sobredim?.length ? `sobredim ${r.imgs.sobredim.length}` : '', r.tab?.sinAnillo?.length ? `sinAnillo ${r.tab.sinAnillo.length}` : '', r.menuAbre === false ? 'MENU NO ABRE' : '', r.dropdownAbre === false ? 'DROPDOWN NO ABRE' : '', r.consola?.length ? `consola ${r.consola.length}` : '', r.error ? 'ERROR' : ''].filter(Boolean).join(' · ');
    console.log(`  ${String(w).padStart(4)} ${ruta.padEnd(62)} ${flags || 'ok'}`);
  }
}));
resultados.sort((a, b) => a.ruta.localeCompare(b.ruta) || a.w - b.w);
if (!RESUMIR && !SOLO_CAPTURAS && !ESTADOS) await fs.writeFile(path.join(SALIDA, 'sonda.json'), JSON.stringify(resultados, null, 1));

if (ESTADOS) {
  console.log('\ncapturas de estado 375/768/1440 (menu, desplegable, hover, lightbox)...');
  let k = 0; const rutasE = RUTAS.filter((r) => !/no-existe/.test(r));
  const te = rutasE.flatMap((r) => [375, 768, 1440].map((w) => [r, w]));
  await Promise.all(Array.from({ length: 3 }, async () => { while (k < te.length) { const [r, w] = te[k++]; await capturarEstados(r, w).catch((e) => console.log(`  !! estado ${r} ${w}: ${String(e).slice(0, 100)}`)); } }));
  await navegador.close();
  console.log(`listo en ${Math.round((Date.now() - t0) / 1000)} s`);
  process.exit(0);
}

if (CAPTURAS && !RESUMIR) {
  console.log('\ncapturas 375/768/1440...');
  let j = 0; const rutas = RUTAS.filter((r) => !/no-existe/.test(r));
  const tc = rutas.flatMap((r) => [375, 768, 1440].map((w) => [r, w]));
  await Promise.all(Array.from({ length: 3 }, async () => { while (j < tc.length) { const [r, w] = tc[j++]; await capturar(r, w).catch((e) => console.log(`  !! captura ${r} ${w}: ${String(e).slice(0, 100)}`)); } }));
}
if (navegador) await navegador.close();
if (SOLO_CAPTURAS) process.exit(0);

// Resumen agregado.
const ok = (f) => resultados.filter(f).length;
const conMenu = resultados.filter((r) => r.menuAbre !== undefined);
const conDrop = resultados.filter((r) => r.dropdownAbre !== undefined);
const conLb = resultados.filter((r) => r.lightbox);
const resumen = {
  cargas: resultados.length,
  status200: ok((r) => r.status === 200 || /no-existe/.test(r.ruta) && r.status === 404),
  h1Unico: ok((r) => r.h1 === 1), sinOverflow: ok((r) => r.overflowX === 0), conMain: ok((r) => r.main === 1),
  conSkip: ok((r) => r.skip), skipPrimero: ok((r) => r.skip?.primero),
  menu: { total: conMenu.length, abre: ok((r) => r.menuAbre), focoDentro: ok((r) => r.menuFocusDentro), inert: ok((r) => r.inert > 0), escape: ok((r) => r.menuCierraEsc), inertRetirado: ok((r) => r.menuCierraEsc && r.inertTrasCerrar === 0), focoBoton: ok((r) => r.focoEnBotonTrasEsc) },
  lightbox: { total: conLb.length, abre: ok((r) => r.lightbox?.abre), focoDentro: ok((r) => r.lightbox?.focoDentro), restoOculto: ok((r) => r.lightbox?.restoOculto), derecha: ok((r) => r.lightbox?.derecha !== false && r.lightbox?.abre), activaTras: ok((r) => r.lightbox?.abre && (r.lightbox.items < 2 || r.lightbox.activaTras === 1)), escape: ok((r) => r.lightbox?.escape), focoVuelve: ok((r) => r.lightbox?.focoVuelve), restoVisible: ok((r) => r.lightbox?.restoVisible), noscrollRetirado: ok((r) => r.lightbox?.escape && r.lightbox?.noscroll === false) },
  dropdown: { total: conDrop.length, abre: ok((r) => r.dropdownAbre), expanded: ok((r) => r.dropdownExpanded === 'true'), visible: ok((r) => r.dropdownVisible), hover: ok((r) => r.hoverPreview), focoPreview: ok((r) => r.focoPreview), escape: ok((r) => r.dropdownCierraEsc), focoToggle: ok((r) => r.dropdownFocoTrasEsc) },
  sinAnillo: resultados.reduce((s, r) => s + (r.tab?.sinAnillo?.length ?? 0), 0),
  sobredim: resultados.reduce((s, r) => s + (r.imgs?.sobredim?.length ?? 0), 0),
  sobredim375: resultados.filter((r) => r.w === 375).reduce((s, r) => s + (r.imgs?.sobredim?.length ?? 0), 0),
  sobredim1440: resultados.filter((r) => r.w === 1440).reduce((s, r) => s + (r.imgs?.sobredim?.length ?? 0), 0),
  rotas: resultados.reduce((s, r) => s + (r.imgs?.rotas ?? 0), 0),
  consola: resultados.reduce((s, r) => s + (r.consola?.length ?? 0), 0),
  videoReproduce: resultados.filter((r) => r.video && !r.reducedMotion).map((r) => `${r.w}:${!r.video.paused && r.video.currentTime > 1 ? 'si' : 'NO'}`).join(' '),
  videoReducido: resultados.filter((r) => r.video && r.reducedMotion).map((r) => `${r.w}:${r.video.paused ? 'parado' : 'REPRODUCE'}`).join(' '),
  errores: resultados.filter((r) => r.error).map((r) => `${r.ruta}@${r.w}: ${r.error}`),
  segundos: RESUMIR ? null : Math.round((Date.now() - t0) / 1000),
};
await fs.writeFile(path.join(SALIDA, 'sonda-resumen.json'), JSON.stringify(resumen, null, 2));
console.log('\n' + JSON.stringify(resumen, null, 2));

if (COMPARAR) {
  const base = JSON.parse(await fs.readFile(COMPARAR, 'utf8')).map(sinSvg);
  const clave = (r) => `${r.ruta}@${r.w}${r.reducedMotion ? '@rm' : ''}`;
  const mapa = new Map(base.map((r) => [clave(r), r]));
  const dif = [];
  for (const r of resultados) {
    const b = mapa.get(clave(r)); if (!b) continue;
    for (const k of ['status', 'h1', 'overflowX', 'lang', 'main', 'menuAbre', 'menuFocusDentro', 'menuCierraEsc', 'inertTrasCerrar', 'dropdownAbre', 'dropdownExpanded', 'dropdownCierraEsc', 'hoverPreview'])
      if (JSON.stringify(r[k]) !== JSON.stringify(b[k])) dif.push(`${clave(r)} ${k}: ${JSON.stringify(b[k])} -> ${JSON.stringify(r[k])}`);
    const sa = r.tab?.sinAnillo?.length ?? 0, sb = b.tab?.sinAnillo?.length ?? 0; if (sa > sb) dif.push(`${clave(r)} sinAnillo: ${sb} -> ${sa} (${r.tab.sinAnillo.join(', ')})`);
    const ca = r.consola?.length ?? 0, cb = b.consola?.length ?? 0; if (ca > cb) dif.push(`${clave(r)} consola: ${cb} -> ${ca} (${r.consola.join(' | ').slice(0, 200)})`);
    if ((r.imgs?.sobredim?.length ?? 0) > (b.imgs?.sobredim?.length ?? 0)) dif.push(`${clave(r)} sobredim: ${b.imgs.sobredim.length} -> ${r.imgs.sobredim.length}`);
  }
  console.log(dif.length ? `\nREGRESIONES frente a baseline (${dif.length}):\n  ${dif.join('\n  ')}` : '\nSin regresiones frente al baseline.');
  await fs.writeFile(path.join(SALIDA, 'sonda-regresiones.txt'), dif.join('\n') + '\n');
}
