#!/usr/bin/env node
/**
 * J16 · Registro del cliente (R1–R13). 0 diferencias frente a docs/seo-loop/linea-base/registro-cliente.json
 * en lo que el cliente pidio (lib/registro-cliente.mjs): H1 de la home y de los proyectos, menu y pie
 * (textos EN y destinos EN/ES), las frases del pie, el modulo de productos de la home y el NAP.
 * Rutas (R13): ninguna ruta de la linea base desaparece, salvo con un 301 en .vercel/output/config.json
 * hacia una ruta que existe (fusion de posts de C4, que va como propuesta). Las rutas nuevas se permiten.
 */
import fs from 'node:fs';
import path from 'node:path';
import { puerta, RAIZ, DIST, leerJson } from './lib/comun.mjs';
import { extraer } from './lib/registro-cliente.mjs';

await puerta('J16', 'registro del cliente', () => {
  const base = leerJson('docs/seo-loop/linea-base/registro-cliente.json');
  const ahora = extraer(DIST);
  const fallos = [];
  for (const k of Object.keys(base).filter((k) => k !== 'rutas')) {
    if (JSON.stringify(base[k]) === JSON.stringify(ahora[k])) continue;
    if (typeof base[k] === 'object' && !Array.isArray(base[k])) {
      for (const sub of new Set([...Object.keys(base[k] ?? {}), ...Object.keys(ahora[k] ?? {})])) {
        if (JSON.stringify(base[k]?.[sub]) !== JSON.stringify(ahora[k]?.[sub])) fallos.push(`${k}.${sub}: ${JSON.stringify(base[k]?.[sub])} -> ${JSON.stringify(ahora[k]?.[sub])}`);
      }
    } else {
      const a = (base[k] ?? []).map((x) => JSON.stringify(x)), b = (ahora[k] ?? []).map((x) => JSON.stringify(x));
      const quitados = a.filter((x) => !b.includes(x)), puestos = b.filter((x) => !a.includes(x));
      fallos.push(`${k}: ${quitados.length ? `quita ${quitados.slice(0, 4).join(' ')}` : ''}${puestos.length ? ` pone ${puestos.slice(0, 4).join(' ')}` : ''}${!quitados.length && !puestos.length ? 'cambia el orden' : ''}`);
    }
  }
  const cfg = leerJson('.vercel/output/config.json');
  const redirige = (r) => cfg.routes.some((x) => [301, 308].includes(x.status) && new RegExp(x.src).test(r.replace(/\/$/, '')) && ahora.rutas.includes(new URL(x.headers?.Location ?? '/', 'https://x').pathname));
  for (const r of base.rutas) if (!ahora.rutas.includes(r) && !redirige(r)) fallos.push(`la ruta ${r} desaparece sin 301`);
  return { fallos, extra: { rutasBase: base.rutas.length, rutasAhora: ahora.rutas.length } };
});
