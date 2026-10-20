#!/usr/bin/env node
/**
 * Flujos interactivos con la CSP puesta (report-only o bloqueante): recoge TODO lo que
 * el navegador diga de la politica en consola mientras se abre el menu y los
 * dropdowns, se recorre el estimador, se escribe en el buscador de la FAQ, se avanza
 * y se envia vacio el formulario multipaso, se abre el lightbox, se mueven los
 * carruseles y arranca el video. Si sale algo, se arregla la politica ANTES de pasar
 * a bloqueante.
 *
 *     node scripts/perf/csp-flujos.mjs
 */
import { chromium } from 'playwright';
import { BASE } from './plantillas.mjs';

const b = await chromium.launch();
const avisos = [];
const abrir = async (ruta, w) => {
  const ctx = await b.newContext({ viewport: { width: w, height: 900 }, isMobile: w < 768, hasTouch: w < 768 });
  const page = await ctx.newPage();
  page.on('console', (m) => { const t = m.text(); if (/Content.Security.Policy|Refused to|Report Only|violat/i.test(t)) avisos.push(`${ruta}@${w}: ${t.slice(0, 220)}`); });
  // domcontentloaded: las fichas con embed de YouTube no llegan a `load` en el Chromium sin red de la sonda.
  await page.goto(BASE + ruta, { waitUntil: 'domcontentloaded', timeout: 60000 }).catch((e) => console.log('  (goto', ruta, String(e).slice(0, 60), ')'));
  await page.waitForTimeout(1200);
  return { page, ctx };
};
// Home: menu movil, dropdown, video, carrusel.
for (const w of [375, 1440]) {
  const { page, ctx } = await abrir('/', w);
  if (w < 992) { await page.locator('.menu .w-nav-button').click({ force: true }); await page.waitForTimeout(600); await page.keyboard.press('Escape'); }
  else { await page.locator('.menu .w-dropdown-toggle').first().focus(); await page.keyboard.press('Enter'); await page.waitForTimeout(400); await page.locator('.menu .w-dropdown:has(> .w-dropdown-toggle.w--open) .submenu-item').nth(1).hover(); await page.waitForTimeout(600); await page.keyboard.press('Escape'); }
  await page.mouse.move(200, 300); await page.waitForTimeout(1500);
  for (const f of (await page.$$('button[class*="next"], button[class*="_next"]')).slice(0, 3)) await f.click({ force: true }).catch(() => {});
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight)); await page.waitForTimeout(800);
  await ctx.close();
}
// Estimador: elegir, avanzar 4 pasos, enviar la captura vacia.
{
  const { page, ctx } = await abrir('/project-estimator/', 1440);
  await page.locator('.est-opcion input').first().check({ force: true }).catch(() => {});
  for (let i = 0; i < 5; i++) { await page.locator('#est-siguiente').click({ force: true }).catch(() => {}); await page.waitForTimeout(200); }
  await page.locator('#est-captura button[type="submit"], #est-captura [type="submit"]').first().click({ force: true }).catch(() => {});
  await page.waitForTimeout(800); await ctx.close();
}
// FAQ: buscar y abrir una pregunta.
{
  const { page, ctx } = await abrir('/resources/faq/', 1440);
  await page.locator('input.pp-faq-input').fill('permit'); await page.waitForTimeout(500);
  await page.locator('.faq_trigger, summary').first().click({ force: true }).catch(() => {});
  await page.waitForTimeout(500); await ctx.close();
}
// Presupuesto: multipaso y envio vacio (Turnstile incluido).
{
  const { page, ctx } = await abrir('/contact-us/get-a-quote/', 1440);
  await page.waitForTimeout(1500);
  await page.locator('.msf-next').first().click({ force: true }).catch(() => {});
  await page.waitForTimeout(400);
  await page.locator('form .msf-submit, form [type="submit"]').first().click({ force: true }).catch(() => {});
  await page.waitForTimeout(1000); await ctx.close();
}
// Lightbox de producto y ficha de proyecto (YouTube).
for (const ruta of ['/products/cabanas/', '/project/attached-forte-pergola-in-west-palm-beach/']) {
  const { page, ctx } = await abrir(ruta, 1440);
  const lb = page.locator('a.w-lightbox').first();
  if (await lb.count()) { await lb.scrollIntoViewIfNeeded(); await lb.click({ force: true }); await page.waitForTimeout(1200); await page.keyboard.press('ArrowRight'); await page.waitForTimeout(400); await page.keyboard.press('Escape'); }
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight)); await page.waitForTimeout(1500);
  await ctx.close();
}
// Agenda (OnceHub) y pie con formulario.
{
  const { page, ctx } = await abrir('/contact-us/schedule-a-visit/', 1440);
  await page.evaluate(() => document.querySelector('[data-pp-oncehub]')?.scrollIntoView()); await page.waitForTimeout(4000);
  await ctx.close();
}
await b.close();
const unicos = [...new Set(avisos.map((a) => a.replace(/^[^:]+: /, '')))];
console.log(`${avisos.length} mensajes de CSP en consola (${unicos.length} distintos)`);
for (const u of unicos) console.log('  -', u);
for (const a of avisos.slice(0, 12)) console.log('    ', a.slice(0, 160));
