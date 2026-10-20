#!/usr/bin/env node
/**
 * Clases que aparecen en el DOM SOLO en tiempo de ejecucion: las que ponen webflow.js
 * (w--open, w--current, w--nav-*...) y los scripts propios (menu-movil-abierto,
 * esta-abierto, msf-*, est-*...). Son la lista blanca de la purga de CSS de F2: una
 * regla cuyo selector solo usa clases que el HTML servido no trae pero que un script
 * añade al abrir el menu, un dropdown, el FAQ o el estimador NO se puede tirar.
 *
 *     node scripts/perf/clases-runtime.mjs   -> scripts/lib/clases-runtime.json
 *
 * Compara el classList de todos los elementos antes y despues de: abrir el menu
 * movil y el de escritorio, abrir un dropdown y pasar por sus items, mover los
 * carruseles, abrir una pregunta del FAQ, recorrer el estimador y pasar de paso en el
 * formulario multipaso, y tabular 30 veces. Lo que no estaba al cargar y aparece
 * despues, se guarda. Se guarda tambien lo que venga del HTML del script inline del
 * <head> (w-mod-js, w-mod-touch) y lo que webflow.js pueda añadir en cualquier
 * pagina (lista cerrada de la auditoria 18-oct-2026, §0 del encargo).
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';
import { PLANTILLAS, BASE } from './plantillas.mjs';

const RAIZ = path.resolve(import.meta.dirname, '../..');
const SALIDA = path.join(RAIZ, 'scripts/lib/clases-runtime.json');

const CONOCIDAS = [
  'w--open', 'w--current', 'w--nav-link-open', 'w--nav-dropdown-open', 'w--nav-dropdown-list-open',
  'w--nav-dropdown-toggle-open', 'w--redirected-focus', 'w--redirected-focus-visible', 'w--redirected-checked',
  // pp-fondo: la pone interacciones.ts al acercarse .service-areas (H-08); el recorrido
  // de este script no siempre llega a la banda.
  'pp-fondo',
  'w-mod-js', 'w-mod-touch', 'w-mod-ix', 'w--nav-menu-open', 'w-nav-overlay', 'w--tab-active', 'w-active',
  'w-lightbox-backdrop', 'w-lightbox-container', 'w-lightbox-content', 'w-lightbox-view', 'w-lightbox-frame',
  'w-lightbox-figure', 'w-lightbox-img', 'w-lightbox-image', 'w-lightbox-caption', 'w-lightbox-control',
  'w-lightbox-left', 'w-lightbox-right', 'w-lightbox-close', 'w-lightbox-strip', 'w-lightbox-item', 'w-lightbox-thumbnail',
  'w-lightbox-spinner', 'w-lightbox-hide', 'w-lightbox-noscroll', 'w-lightbox-active', 'w-lightbox-inactive', 'w-lightbox-group',
  'w-lightbox-html5', 'w-lightbox-embed', 'w-lightbox-thumbnail-image', 'w-lightbox-thumbnail-frame', 'w-lightbox-strip-visible',
  // Las que ponen los scripts propios en estados que la pasada de arriba no siempre
  // provoca (envio en curso, acierto/fallo del formulario, carruseles, mapa de condados).
  // Salen de `grep -rhoE "classList\.(add|toggle)" src` y de los literales 'w-form-*'.
  'pp-enviando', 'pp-resumen', 'pp-error', 'is-active', 'is-bullet-active', 'w-form-done', 'w-form-fail',
  'esta-abierto', 'menu-movil-abierto', 'active-lightbox',
  // F7: las ponen menu-nativo.ts (nav escondido al bajar) e interacciones.ts (FAQ, features).
  'pp-escondido', 'pp-abierto',
];

const b = await chromium.launch();
const encontradas = new Set(CONOCIDAS);
const clases = (page) => page.evaluate(() => { const s = new Set(); for (const e of document.querySelectorAll('*')) for (const c of e.classList) s.add(c); return [...s]; });
const nuevas = async (page, antes, etiqueta) => { const d = (await clases(page)).filter((c) => !antes.has(c)); for (const c of d) encontradas.add(c); if (d.length) console.log(`  ${etiqueta}: +${d.length}  ${d.slice(0, 12).join(' ')}`); };

for (const [nombre, ruta] of PLANTILLAS) {
  for (const w of [375, 1440]) {
    const ctx = await b.newContext({ viewport: { width: w, height: 900 }, isMobile: w < 768, hasTouch: w < 768 });
    const page = await ctx.newPage();
    await page.goto(BASE + ruta, { waitUntil: 'load' });
    const et = `${nombre}@${w}`;
    // Clases que un script pone AL CARGAR (el paso a paso del formulario multipaso,
    // el buscador de la FAQ…): no estan en el HTML servido y tampoco son «nuevas»
    // respecto al DOM tras `load`. Se comparan con el HTML crudo. Medido: sin esto la
    // purga se llevaba los estilos del paso a paso de /es/contact-us/get-a-quote.
    const crudo = await (await page.request.get(BASE + ruta)).text();
    const estaticas = new Set();
    for (const m of crudo.matchAll(/\sclass="([^"]*)"/g)) for (const c of m[1].split(/\s+/)) if (c) estaticas.add(c);
    await nuevas(page, estaticas, et + ' al cargar');
    const antes = new Set(await clases(page));
    try {
      if (w < 992 && await page.$('.menu .w-nav-button')) {
        await page.locator('.menu .w-nav-button').click({ force: true });
        await page.waitForFunction(() => document.querySelector('.menu .w-nav-button')?.classList.contains('w--open'));
        await nuevas(page, antes, et + ' menu abierto');
        await page.keyboard.press('Escape');
      }
      if (w >= 992 && await page.$('.menu .w-dropdown-toggle')) {
        for (const t of await page.$$('.menu .w-dropdown-toggle')) { await t.focus(); await page.keyboard.press('Enter'); await page.waitForTimeout(300); const items = await page.$$('.menu .w-dropdown:has(> .w-dropdown-toggle.w--open) .submenu-item'); for (const i of items.slice(0, 2)) await i.hover(); await nuevas(page, antes, et + ' dropdown'); await page.keyboard.press('Escape'); }
      }
      const idioma = await page.$('.idioma-boton'); if (idioma) { await idioma.click({ force: true }); await nuevas(page, antes, et + ' idioma'); await page.keyboard.press('Escape'); }
      for (const flecha of (await page.$$('button[class*="next"], button[class*="previous"], .pp-flecha, [class*="_next"], [class*="_previous"]')).slice(0, 6)) { await flecha.click({ force: true }).catch(() => {}); }
      await nuevas(page, antes, et + ' carruseles');
      for (const q of (await page.$$('.faq_trigger, .faq_item .faq_question, summary, .pp-faq-pregunta')).slice(0, 3)) { await q.click({ force: true }).catch(() => {}); }
      await nuevas(page, antes, et + ' faq');
      for (const o of (await page.$$('.est-opcion input')).slice(0, 1)) { await o.check({ force: true }).catch(() => {}); }
      const sig = await page.$('#est-siguiente'); if (sig) { for (let i = 0; i < 4; i++) { await sig.click({ force: true }).catch(() => {}); await page.waitForTimeout(150); } await nuevas(page, antes, et + ' estimador'); }
      const msf = await page.$('.msf-next, [data-msf-next], .msf-buttons .button'); if (msf) { await msf.click({ force: true }).catch(() => {}); await nuevas(page, antes, et + ' multipaso'); }
      const env = await page.$('form button[type="submit"], form input[type="submit"]'); if (env) { await env.click({ force: true }).catch(() => {}); await page.waitForTimeout(300); await nuevas(page, antes, et + ' envio vacio'); }
      for (let i = 0; i < 30; i++) await page.keyboard.press('Tab');
      await nuevas(page, antes, et + ' tab');
      for (const l of (await page.$$('a.lightbox-link-gallery-page, .w-lightbox')).slice(0, 1)) { await l.click({ force: true }).catch(() => {}); await page.waitForTimeout(400); await nuevas(page, antes, et + ' lightbox'); await page.keyboard.press('Escape'); }
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight)); await page.waitForTimeout(300);
      await nuevas(page, antes, et + ' scroll');
    } catch (e) { console.log(`  !! ${et}: ${String(e).slice(0, 120)}`); }
    await ctx.close();
  }
}
await b.close();
const lista = [...encontradas].sort();
await fs.writeFile(SALIDA, JSON.stringify(lista, null, 1) + '\n');
console.log(`\n${lista.length} clases de runtime -> ${path.relative(RAIZ, SALIDA)}`);
