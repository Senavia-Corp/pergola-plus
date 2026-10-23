#!/usr/bin/env node
/**
 * J15 · Lighthouse x3 (T13, T14). 16 plantillas x movil y escritorio sobre el dist de produccion,
 * servido por scripts/perf/servir.mjs en el 4174 (el 4173 puede estar en uso). Medianas:
 *   - A11y, BP y SEO = 100 (contacto-quote: BP >= 96, por Turnstile en localhost);
 *   - CLS = 0 (a 3 decimales);
 *   - Perf no baja frente a docs/seo-loop/linea-base/lighthouse-medianas.json: escritorio >= base,
 *     movil >= base - 1 (ruido). Solo cuentan las corridas con rtt <= 0,1 (lib/lighthouse.mjs las
 *     repite dos veces); una celda sin ninguna corrida valida NO PASA: «no medido» no es verde.
 *
 *     node scripts/seo-loop/j15-lighthouse.mjs [carpeta-de-corridas]
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { puerta, RAIZ, leerJson } from './lib/comun.mjs';
import { medir } from './lib/lighthouse.mjs';

const PUERTO = 4174;
const carpeta = path.resolve(process.argv[2] ?? `/Users/senavia/Sites/pp-exports/loop-juez/lh-${new Date().toISOString().replace(/[:.]/g, '-')}`);

await puerta('J15', 'lighthouse x3', async () => {
  const base = leerJson('docs/seo-loop/linea-base/lighthouse-medianas.json');
  const ocupado = await fetch(`http://localhost:${PUERTO}/`).then(() => true, () => false);
  if (ocupado) throw new Error(`el puerto ${PUERTO} ya esta en uso: no se mide sobre un servidor ajeno`);
  const servidor = spawn('node', [path.join(RAIZ, 'scripts/perf/servir.mjs')], { env: { ...process.env, PUERTO: String(PUERTO) }, stdio: 'ignore' });
  try {
    for (let i = 0; i < 50 && !(await fetch(`http://localhost:${PUERTO}/`).then((r) => r.ok, () => false)); i++) await new Promise((ok) => setTimeout(ok, 200));
    process.env.BASE = `http://localhost:${PUERTO}`;
    const med = medir(carpeta);
    const fallos = [];
    for (const [k, b] of Object.entries(base)) {
      const m = med[k];
      if (!m) { fallos.push(`${k}: sin corridas`); continue; }
      const [tpl, dev] = k.split('|');
      if (m.a11y !== 100) fallos.push(`${k}: A11y ${m.a11y}`);
      if (m.seo !== 100) fallos.push(`${k}: SEO ${m.seo}`);
      if (m.bp < (tpl === 'contacto-quote' ? 96 : 100)) fallos.push(`${k}: BP ${m.bp}`);
      if (Math.round(m.cls * 1000) !== 0) fallos.push(`${k}: CLS ${m.cls.toFixed(3)}`);
      if (m.perf == null || b.perf == null) fallos.push(`${k}: Perf no medido (${m.perfCorridas}; base ${b.perfCorridas}; * = rtt > 0,1)`);
      else if (m.perf < b.perf - (dev === 'mobile' ? 1 : 0)) fallos.push(`${k}: Perf ${m.perf} (${m.perfCorridas}) < base ${b.perf} (${b.perfCorridas})`);
    }
    return { fallos, extra: { carpeta, celdas: Object.keys(med).length, ruidosas: Object.values(med).reduce((s, m) => s + m.ruidosas, 0) } };
  } finally { servidor.kill(); }
});
