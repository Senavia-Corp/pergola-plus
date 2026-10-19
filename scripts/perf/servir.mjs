#!/usr/bin/env node
/**
 * Servidor estatico de produccion simulada sobre dist/client, para medir.
 *
 *     node scripts/perf/servir.mjs            # puerto 4173
 *     PUERTO=4174 node scripts/perf/servir.mjs
 *
 * Imita lo que hace Vercel con la salida del adaptador, que es lo que Lighthouse va
 * a ver en el sitio real:
 *   - gzip para text/* y application/(json|xml|javascript)
 *   - accept-ranges + 206 para video e imagenes (el <video> pide rangos)
 *   - index.html para directorios; 404 ingles (404.html) y español (/es/404/)
 *   - las cabeceras que declara .vercel/output/config.json en rutas con
 *     `continue: true` (cache-control de /_astro/ y, desde F6, seguridad y cache
 *     del resto). Asi lo que se mide en local es lo que se sirve.
 *
 * Sin dependencias: http + zlib + fs. No se usa `astro preview` porque el adaptador
 * de Vercel no lo soporta, ni `astro dev` porque no hornea width/height ni comprime.
 */
import http from 'node:http';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import zlib from 'node:zlib';

const RAIZ = path.resolve(import.meta.dirname, '../..');
const DIST = path.join(RAIZ, 'dist/client');
const PUERTO = Number(process.env.PUERTO ?? 4173);

const MIME = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json', '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.webp': 'image/webp', '.avif': 'image/avif', '.gif': 'image/gif', '.ico': 'image/x-icon',
  '.woff2': 'font/woff2', '.woff': 'font/woff', '.mp4': 'video/mp4', '.webm': 'video/webm',
  '.map': 'application/json',
};
const COMPRIMIBLE = /^(text\/|application\/(json|xml|javascript))/;

// Cabeceras de config.json: solo las rutas `continue: true` con `headers`, que son
// las que Vercel aplica sin cortar el enrutado.
let CABECERAS = [];
try {
  const cfg = JSON.parse(await fsp.readFile(path.join(RAIZ, '.vercel/output/config.json'), 'utf8'));
  CABECERAS = cfg.routes
    .filter((r) => r.continue && r.headers && r.src)
    .map((r) => ({ rx: new RegExp(r.src), headers: r.headers }));
} catch { /* sin config.json se sirve sin cabeceras extra */ }

const existe = (p) => fsp.stat(p).then((s) => s, () => null);

async function resolver(urlPath) {
  const limpio = decodeURIComponent(urlPath.split('?')[0]);
  const seguro = path.normalize(limpio).replace(/^(\.\.[/\\])+/, '');
  let f = path.join(DIST, seguro);
  if (!f.startsWith(DIST)) return null;
  let st = await existe(f);
  if (st?.isDirectory()) { f = path.join(f, 'index.html'); st = await existe(f); }
  if (!st && !path.extname(f)) { f = f + '/index.html'; st = await existe(f); }
  return st?.isFile() ? { f, st } : null;
}

const servidor = http.createServer(async (req, res) => {
  const url = req.url ?? '/';
  let r = await resolver(url);
  let status = 200;
  if (!r) {
    status = 404;
    const es = /^\/es(?:\/|$)/.test(url);
    r = await resolver(es ? '/es/404/index.html' : '/404.html');
    if (!r) { res.writeHead(404); res.end('404'); return; }
  }
  const ext = path.extname(r.f).toLowerCase();
  const tipo = MIME[ext] ?? 'application/octet-stream';
  const headers = { 'content-type': tipo, 'accept-ranges': 'bytes', 'cache-control': 'public, max-age=0, must-revalidate' };
  for (const c of CABECERAS) if (c.rx.test(url.split('?')[0])) Object.assign(headers, c.headers);

  // Rangos (video, imagenes grandes).
  const rango = req.headers.range?.match(/bytes=(\d*)-(\d*)/);
  if (rango && status === 200) {
    const total = r.st.size;
    const ini = rango[1] ? Number(rango[1]) : Math.max(0, total - Number(rango[2]));
    const fin = rango[2] && rango[1] ? Math.min(Number(rango[2]), total - 1) : total - 1;
    if (ini >= total) { res.writeHead(416, { 'content-range': `bytes */${total}` }); res.end(); return; }
    res.writeHead(206, { ...headers, 'content-range': `bytes ${ini}-${fin}/${total}`, 'content-length': fin - ini + 1 });
    fs.createReadStream(r.f, { start: ini, end: fin }).pipe(res);
    return;
  }

  const gz = COMPRIMIBLE.test(tipo) && /\bgzip\b/.test(req.headers['accept-encoding'] ?? '');
  if (gz) {
    res.writeHead(status, { ...headers, 'content-encoding': 'gzip', vary: 'Accept-Encoding' });
    if (req.method === 'HEAD') return res.end();
    fs.createReadStream(r.f).pipe(zlib.createGzip({ level: 6 })).pipe(res);
  } else {
    res.writeHead(status, { ...headers, 'content-length': r.st.size });
    if (req.method === 'HEAD') return res.end();
    fs.createReadStream(r.f).pipe(res);
  }
});

servidor.listen(PUERTO, '127.0.0.1', () => {
  console.log(`[servir] http://localhost:${PUERTO} -> ${path.relative(RAIZ, DIST)} (${CABECERAS.length} reglas de cabeceras de config.json)`);
});
