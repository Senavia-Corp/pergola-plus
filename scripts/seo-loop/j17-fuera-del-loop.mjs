#!/usr/bin/env node
/**
 * J17 · Fuera del loop (§1 de la especificacion):
 *   - `git diff origin/main` (commits y arbol de trabajo) no toca el canal de leads, los legales ni la CSP o
 *     la analitica (ninguna linea cambiada con *-src, Content-Security-Policy, googletagmanager, gtag…);
 *   - en Sanity: 0 Releases publicadas; 0 versiones del loop de los textos legales; 0 entregas nuevas
 *     del webhook «Vercel producción · main» desde la linea base (algo publico: se para el loop, §6.3);
 *   - en Vercel: las variables del proyecto (claves, destinos y fecha de cambio, nunca valores) iguales a
 *     docs/seo-loop/linea-base/vercel-env.json. Lee con VERCEL_TOKEN o con la sesion del CLI de Vercel;
 *     si no puede leer, NO PASA.
 * Necesita .cache/seo-loop/sanity.json fresco (lib/sanity-leer.mjs, que juez.mjs corre antes).
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { puerta, RAIZ, leerJson, sanityLoop } from './lib/comun.mjs';

const PROHIBIDOS = ['src/lib/lead.ts', 'src/pages/api/lead.ts', 'api/lead.ts', 'src/i18n/articulos.es.ts', 'docs/politica-privacidad-borrador.md'];
const LINEA_CSP = /Content-Security-Policy|(script|connect|img|frame|style|font|default)-src|googletagmanager|google-analytics|googleadservices|doubleclick|gtag\(|GTM-|consent/i;
const git = (...a) => spawnSync('git', a, { cwd: RAIZ, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });

await puerta('J17', 'fuera del loop', async () => {
  const fallos = [];
  // `main` es el de GitHub (origin/main): el local puede estar atrasado. juez.mjs hace `git fetch origin main` antes.
  const base = git('merge-base', 'origin/main', 'HEAD').stdout.trim();
  if (!base) throw new Error('no hay merge-base con origin/main');
  const cambiados = git('diff', base, '--name-only').stdout.split('\n').filter(Boolean);
  for (const f of cambiados) if (PROHIBIDOS.includes(f)) fallos.push(`git diff main toca ${f} (§1)`);
  // Solo codigo y configuracion: la documentacion puede nombrar la CSP sin tocarla.
  for (const l of git('diff', base, '-U0', '--', '.', ':(exclude)docs', ':(exclude)implementation-reports', ':(exclude)*.md').stdout.split('\n')) if (/^[+-](?![+-])/.test(l) && LINEA_CSP.test(l)) fallos.push(`git diff main cambia una linea de CSP o analitica: ${l.slice(0, 140)}`);

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

  const lbv = leerJson('docs/seo-loop/linea-base/vercel-env.json');
  let token = process.env.VERCEL_TOKEN;
  if (!token) try { token = JSON.parse(fs.readFileSync(path.join(os.homedir(), 'Library/Application Support/com.vercel.cli/auth.json'), 'utf8')).token; } catch { /* sin sesion */ }
  const r = token ? await fetch(`https://api.vercel.com/v9/projects/${lbv.proyecto}/env?slug=${lbv.equipo}`, { headers: { Authorization: `Bearer ${token}` } }).then((x) => x.json(), (e) => ({ error: { message: e.message } })) : { error: { message: 'sin VERCEL_TOKEN ni sesion del CLI de Vercel' } };
  if (r.error) fallos.push(`NO CORRIO: no se pueden leer las variables de Vercel (${r.error.message}). Hace falta VERCEL_TOKEN de lectura o \`vercel login\``);
  else {
    const ahora = r.envs.map((e) => ({ key: e.key, id: e.id, target: e.target, type: e.type, updatedAt: e.updatedAt })).sort((a, b) => a.id.localeCompare(b.id));
    if (JSON.stringify(ahora) !== JSON.stringify(lbv.variables)) fallos.push(`las variables de Vercel cambiaron: ${JSON.stringify(ahora)}`);
  }
  return { fallos, extra: { ficherosCambiados: cambiados.length } };
});
