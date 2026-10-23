#!/usr/bin/env node
/**
 * J17 · Fuera del loop (§1 de la especificacion):
 *   - `git diff origin/main` (commits y arbol de trabajo) no toca el canal de leads, los legales ni la CSP o
 *     la analitica (ninguna linea cambiada con *-src, Content-Security-Policy, googletagmanager, gtag…);
 *   - en Sanity: 0 Releases publicadas; 0 versiones del loop de los textos legales; 0 entregas nuevas
 *     del webhook «Vercel producción · main» desde la linea base (algo publico: se para el loop, §6.3);
 *   - en Vercel: variables (claves, destinos y fecha de cambio, nunca valores), ssoProtection,
 *     passwordProtection y dominios iguales a docs/seo-loop/linea-base/vercel-env.json, segun la foto
 *     que escribe el juez con el conector de Vercel. Sin foto reciente, NO PASA.
 * Necesita .cache/seo-loop/sanity.json fresco (lib/sanity-leer.mjs, que juez.mjs corre antes).
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { puerta, RAIZ, leerJson, sanityLoop } from './lib/comun.mjs';

const PROHIBIDOS = ['src/lib/lead.ts', 'src/pages/api/lead.ts', 'api/lead.ts', 'src/i18n/articulos.es.ts', 'docs/politica-privacidad-borrador.md'];
// Sin «consent» suelto: casaba con el «SMS-Consent» de los formularios, que no es la CSP ni la analítica.
const LINEA_CSP = /Content-Security-Policy|(script|connect|img|frame|style|font|default)-src|googletagmanager|google-analytics|googleadservices|doubleclick|gtag\(|GTM-|consent mode|ad_storage|analytics_storage/i;
const git = (...a) => spawnSync('git', a, { cwd: RAIZ, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });

await puerta('J17', 'fuera del loop', async () => {
  const fallos = [];
  // `main` es el de GitHub (origin/main): el local puede estar atrasado. juez.mjs hace `git fetch origin main` antes.
  const base = git('merge-base', 'origin/main', 'HEAD').stdout.trim();
  if (!base) throw new Error('no hay merge-base con origin/main');
  const cambiados = git('diff', base, '--name-only').stdout.split('\n').filter(Boolean);
  for (const f of cambiados) if (PROHIBIDOS.includes(f)) fallos.push(`git diff main toca ${f} (§1)`);
  // Solo codigo y configuracion: la documentacion puede nombrar la CSP sin tocarla.
  for (const l of git('diff', base, '-U0', '--', '.', ':(exclude)docs', ':(exclude)implementation-reports', ':(exclude)*.md', ':(exclude)scripts/seo-loop').stdout.split('\n')) if (/^[+-](?![+-])/.test(l) && LINEA_CSP.test(l)) fallos.push(`git diff main cambia una linea de CSP o analitica: ${l.slice(0, 140)}`);

  const s = sanityLoop();
  const publicadas = s.releases.filter((r) => r.state === 'published' || r.publishedAt);
  if (publicadas.length) fallos.push(`${publicadas.length} Release(s) publicadas: ${publicadas.map((r) => r.name).join(', ')}`);
  for (const v of s.loop) if (/legalPage-/.test(v._id)) fallos.push(`version del loop de un texto legal: ${v._id}`);

  const lb = leerJson('docs/seo-loop/linea-base/sanity-webhook.json');
  const logs = spawnSync('npx', ['sanity', 'hook', 'logs', lb.webhook], { cwd: path.join(RAIZ, 'studio'), encoding: 'utf8', timeout: 120000 });
  const fechas = [...(logs.stdout ?? '').matchAll(/^Date: (\S+)/gm)].map((m) => m[1]);
  if (logs.status !== 0 || !fechas.length) fallos.push(`NO CORRIO: no se pudieron leer los logs del webhook (${(logs.stderr ?? '').slice(-160).replace(/https?:\/\/\S+/g, '<url>')})`);
  const nuevas = fechas.filter((f) => f > lb.ultimaEntrega);
  if (nuevas.length) fallos.push(`${nuevas.length} entrega(s) nuevas del webhook de produccion desde ${lb.ultimaEntrega}: ${nuevas.join(', ')} (algo se publico: §6.3, se para el loop)`);

  // Vercel: el juez, antes de juez.mjs, lee el proyecto con el conector MCP de Vercel (solo lectura:
  // filter_project_envs, get_project, list_project_domains) y deja la foto en FOTO, sin ningun valor de
  // variable. Un script no puede llamar al conector. Sin foto, o con una de hace mas de 3 h, NO PASA.
  const lbv = leerJson('docs/seo-loop/linea-base/vercel-env.json');
  const FOTO = '/Users/senavia/Sites/pp-exports/loop-juez/vercel-snapshot.json';
  if (!fs.existsSync(FOTO)) fallos.push(`NO CORRIO: no hay foto de Vercel en ${FOTO} (la escribe el juez con el conector antes de juez.mjs)`);
  else {
    const foto = JSON.parse(fs.readFileSync(FOTO, 'utf8'));
    if (!(Date.now() - Date.parse(foto.leido) < 3 * 3600 * 1000)) fallos.push(`NO CORRIO: la foto de Vercel es del ${foto.leido} (mas de 3 h)`);
    if (JSON.stringify(foto).match(/"value"/)) fallos.push('la foto de Vercel trae valores de variables: no se usa (y hay que borrarla)');
    const orden = (xs) => [...(xs ?? [])].map(({ key, id, target, type, updatedAt }) => ({ key, id, target: [...target].sort(), type, updatedAt })).sort((a, b) => a.id.localeCompare(b.id));
    for (const [campo, a, b] of [
      ['variables', orden(lbv.variables), orden(foto.variables)],
      ['ssoProtection', lbv.ssoProtection, foto.ssoProtection],
      ['passwordProtection', lbv.passwordProtection, foto.passwordProtection],
      ['dominios', [...lbv.dominios].sort(), [...(foto.dominios ?? [])].sort()],
    ]) if (JSON.stringify(a) !== JSON.stringify(b)) fallos.push(`Vercel: ${campo} cambio: ${JSON.stringify(b)} (linea base ${JSON.stringify(a)})`);
  }
  return { fallos, extra: { ficherosCambiados: cambiados.length } };
});
