/**
 * Lighthouse x3 de las 16 plantillas (scripts/perf/lighthouse.sh) sobre servir.mjs, con
 * la regla de ruido de la especificacion (J15): una corrida con diagnostics.rtt > 0,1 se
 * borra y se repite (hasta 2 veces, con 30 s de pausa); si sigue asi, se queda marcada
 * como ruidosa y NO cuenta para la mediana de Perf.
 *
 *     node scripts/seo-loop/lib/lighthouse.mjs <carpeta>      # servir.mjs ya en el 4173
 *
 * Escribe <carpeta>/medianas.json: { "<tpl>|<dev>": { perf, a11y, bp, seo, cls, validas, ruidosas } }.
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const RAIZ = path.resolve(import.meta.dirname, '../../..');
export const RTT_MAX = 0.1;
const rtt = (f) => JSON.parse(fs.readFileSync(f, 'utf8')).audits?.diagnostics?.details?.items?.[0]?.rtt ?? Infinity;
const mediana = (xs) => { const s = [...xs].sort((a, b) => a - b); return s.length ? s[Math.floor((s.length - 1) / 2)] : null; };

export function medir(carpeta) {
  fs.mkdirSync(carpeta, { recursive: true });
  const lh = () => spawnSync('bash', [path.join(RAIZ, 'scripts/perf/lighthouse.sh'), carpeta, '3'], { cwd: RAIZ, stdio: 'inherit' });
  lh();
  for (let repeticion = 1; repeticion <= 2; repeticion++) {
    const ruidosas = fs.readdirSync(carpeta).filter((f) => f.endsWith('.json') && /-\d\.json$/.test(f) && rtt(path.join(carpeta, f)) > RTT_MAX);
    if (!ruidosas.length) break;
    console.log(`[lighthouse] repeticion ${repeticion}: ${ruidosas.length} corridas con rtt > ${RTT_MAX}`);
    spawnSync('sleep', ['30']);
    for (const f of ruidosas) fs.renameSync(path.join(carpeta, f), path.join(carpeta, f.replace(/\.json$/, `.ruido${repeticion}`)));
    lh();
  }
  return resumir(carpeta);
}

export function resumir(carpeta) {
  const grupos = {};
  for (const f of fs.readdirSync(carpeta).filter((f) => /-(mobile|desktop)-\d\.json$/.test(f))) {
    const [, tpl, dev] = f.match(/^(.+)-(mobile|desktop)-\d\.json$/);
    const j = JSON.parse(fs.readFileSync(path.join(carpeta, f), 'utf8'));
    const c = j.categories;
    (grupos[`${tpl}|${dev}`] ??= []).push({
      perf: Math.round(c.performance.score * 100), a11y: Math.round(c.accessibility.score * 100),
      bp: Math.round(c['best-practices'].score * 100), seo: Math.round(c.seo.score * 100),
      cls: j.audits['cumulative-layout-shift'].numericValue, ruidosa: rtt(path.join(carpeta, f)) > RTT_MAX,
    });
  }
  const med = {};
  for (const [k, rs] of Object.entries(grupos)) {
    const validas = rs.filter((r) => !r.ruidosa);
    med[k] = {
      perf: mediana(validas.map((r) => r.perf)), perfCorridas: rs.map((r) => r.perf + (r.ruidosa ? '*' : '')).join('/'),
      a11y: mediana(rs.map((r) => r.a11y)), bp: mediana(rs.map((r) => r.bp)), seo: mediana(rs.map((r) => r.seo)),
      cls: mediana(rs.map((r) => r.cls)), validas: validas.length, ruidosas: rs.length - validas.length,
    };
  }
  fs.writeFileSync(path.join(carpeta, 'medianas.json'), JSON.stringify(med, null, 2));
  return med;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const med = medir(path.resolve(process.argv[2]));
  console.table(med);
}
