#!/usr/bin/env node
/**
 * Enruta el 404 por idioma. Se ejecuta DESPUES de `astro build`.
 *
 *     node scripts/rutas-vercel.mjs
 *
 * QUE ESTABA ROTO
 *
 * `.vercel/output/config.json` termina con un catch-all monolingue:
 *
 *     {"src": "^/.*$", "dest": "/404.html", "status": 404}
 *
 * Asi que CUALQUIER URL que no exista se sirve con la pagina de error INGLESA,
 * incluidas las de /es/. Medido contra el deploy: `/es/no-existe/` devolvia 404 con
 * `<html lang="en">` y «Page Not Found». Y como 404.html no tiene ni un enlace a
 * /es/, su selector de idioma dice ademas que el español «Not available»: un
 * hispanohablante que teclea mal una URL cae en inglés y no tiene por donde volver.
 *
 * Es exactamente el callejon sin salida que la reescritura de enlaces vino a matar,
 * en la unica pagina que la reescritura no alcanza — porque no vive bajo es/.
 *
 * POR QUE UN PASO APARTE Y NO UNA INTEGRACION
 *
 * config.json lo escribe el adaptador de Vercel en SU `astro:build:done`, y el orden
 * entre ese hook y los de las integraciones del repo no esta garantizado: escribirlo
 * desde una integracion es apostar a que el adaptador no lo pise despues. Como paso
 * de `npm run build`, corre siempre el ultimo y se puede comprobar a ojo.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';

const RAIZ = path.resolve(import.meta.dirname, '..');
const CONFIG = path.join(RAIZ, '.vercel/output/config.json');

/**
 * `^/es(?:/.*)?$` y no `^/es/.*$`:
 *   - cubre `/es` a secas ademas de `/es/loquesea`
 *   - NO cubre `/esparto` ni `/estimator`, que son rutas inglesas que empiezan por
 *     «es». Un `^/es.*$` se las habria tragado y les daria el 404 español.
 *
 * Va justo ANTES del catch-all, no al principio: detras de `handle: filesystem` para
 * que las paginas /es/ que SI existen se sigan sirviendo, y detras de la ruta de
 * /api/lead para no robarle nada al endpoint.
 */
const RUTA_404_ES = {
  src: '^/es(?:/.*)?$',
  dest: '/es/404/index.html',
  status: 404,
};

const config = JSON.parse(await fs.readFile(CONFIG, 'utf8'));

// El destino tiene que existir, o estariamos cambiando un 404 en ingles por un 404
// vacio — que es peor, porque parece arreglado.
const destino = path.join(RAIZ, '.vercel/output/static', RUTA_404_ES.dest);
await fs.access(destino).catch(() => {
  throw new Error(`[rutas] no existe ${RUTA_404_ES.dest} en la salida: no se enruta a una pagina que no esta`);
});

// Lo mismo para los 301: un destino que no existe cambia un 404 por un redirect a un 404,
// y un origen que ES una pagina real la tapa (en Vercel los redirects van antes que los
// ficheros). Ninguna de las dos cosas da error por si sola, asi que se para el build.
const esPagina = (ruta) => fs.access(path.join(RAIZ, '.vercel/output/static', ruta, 'index.html')).then(() => true, () => false);
const rotos = [];
for (const r of config.routes.filter((r) => r.status === 301 && r.headers?.Location)) {
  const origen = r.src.replace(/^\^/, '').replace(/\/?\$$/, '').replace(/\\/g, '');
  if (!(await esPagina(r.headers.Location))) rotos.push(`${origen} -> ${r.headers.Location} (el destino no existe)`);
  if (await esPagina(origen)) rotos.push(`${origen} (es una pagina real: el redirect la taparia)`);
}
if (rotos.length) throw new Error(`[rutas] redirects mal formados:\n  ${rotos.join('\n  ')}`);

// ---------------------------------------------------------------------------
// F6 · Cabeceras de seguridad, cache larga y CSP, como rutas `continue: true`
// ---------------------------------------------------------------------------
// Van delante de `handle: filesystem`, igual que la regla de /_astro/ que escribe el
// adaptador (asi alcanzan a los ficheros estaticos). vercel.json no vale: no puede
// leer variables y este fichero es el que ya edita y valida config.json.
//
// La CSP se GENERA de los HTML construidos: hashes sha256 de cada <script> inline
// con JavaScript ejecutable (sin src; sin type, module o text/javascript; los
// application/ld+json y text/x-wf-template no se ejecutan y no cuentan). Estilos con
// 'unsafe-inline': el markup de Webflow lleva style="" en miles de elementos y
// webflow.js escribe estilos en linea; los hashes de estilo no cubren atributos.
// No se usa `security.csp` de Astro: emite una <meta> (no admite Report-Only) y no
// hashea los <script is:inline> del markup migrado; el adaptador solo copia esa
// misma politica a cabecera.
//
// PP_CSP=enforce (por defecto) | report-only. Se empezo en Report-Only (F6): la sonda
// (22 rutas x 4 anchos) y los flujos de scripts/perf/csp-flujos.mjs (menu, dropdowns,
// estimador, FAQ, multipaso, lightbox, YouTube, OnceHub) solo sacaron el embed de
// embedly (añadido a frame-src) y el aviso de que `upgrade-insecure-requests` no
// aplica en Report-Only; el resto de mensajes son de la CSP PROPIA del iframe de
// Turnstile (`data:,` en su connect-src) y del de YouTube (picture-in-picture,
// web-share), que no dependen de esta politica. Con eso se paso a bloqueante.
const ESTATICO = path.join(RAIZ, '.vercel/output/static');
const hashes = new Set();
for (const rel of (await fs.readdir(ESTATICO, { recursive: true })).filter((f) => f.endsWith('.html'))) {
  const html = await fs.readFile(path.join(ESTATICO, rel), 'utf8');
  for (const m of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)) {
    if (/\ssrc=/.test(m[1])) continue;
    const tipo = m[1].match(/\stype="([^"]+)"/)?.[1];
    if (tipo && !/^(module|text\/javascript|application\/javascript)$/.test(tipo)) continue;
    hashes.add(createHash('sha256').update(m[2]).digest('base64'));
  }
}
const CSP = [
  "default-src 'self'",
  `script-src 'self' ${[...hashes].sort().map((h) => `'sha256-${h}'`).join(' ')} https://challenges.cloudflare.com https://cdn.oncehub.com https://*.oncehub.com`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https:",
  "font-src 'self' data:",
  "media-src 'self'",
  "connect-src 'self' https://challenges.cloudflare.com https://*.oncehub.com",
  // Los 21 embeds de YouTube del CMS van envueltos por embedly (<iframe src="//cdn.embedly.com/widgets/media.html?src=youtube…">).
  "frame-src https://challenges.cloudflare.com https://*.oncehub.com https://cdn.embedly.com https://www.youtube.com https://www.youtube-nocookie.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  'upgrade-insecure-requests',
].join('; ');
const MODO_CSP = process.env.PP_CSP ?? 'enforce';
const CABECERAS = [
  // Assets versionados por nombre (derivados, fuentes, video) o por hash (/js/*.<hash>.js,
  // ver versionarJs). /css/* ya no lo pide ningun HTML (el CSS va inline) y se deja
  // immutable por si alguien lo tiene enlazado.
  { src: '^/(fonts|videos|images|cms-img|css|js)/(.*)$', headers: { 'cache-control': 'public, max-age=31536000, immutable' }, continue: true },
  { src: '^/(.*)$', headers: {
    'x-content-type-options': 'nosniff',
    'referrer-policy': 'strict-origin-when-cross-origin',
    'x-frame-options': 'DENY',
    'permissions-policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
  }, continue: true },
  // La CSP solo en documentos: en una imagen o una fuente no aplica y son 3 KB por respuesta.
  { src: '^/(?!_astro/|fonts/|videos/|images/|cms-img/|css/|js/|api/)(.*)$', headers: { [MODO_CSP === 'enforce' ? 'content-security-policy' : 'content-security-policy-report-only']: CSP }, continue: true },
];
const yaConCabeceras = config.routes.some((r) => r.headers?.['x-content-type-options']);
if (!yaConCabeceras) {
  const iAstro = config.routes.findIndex((r) => /_astro/.test(r.src ?? '') && r.continue);
  if (iAstro === -1) throw new Error('[rutas] no encuentro la regla de cache de /_astro/ del adaptador para colocar las cabeceras detras');
  config.routes.splice(iAstro + 1, 0, ...CABECERAS);
}
console.log(`[rutas] cabeceras: cache immutable, seguridad y CSP (${MODO_CSP}, ${hashes.size} hashes de script inline)`);

const i = config.routes.findIndex((r) => r.src === '^/.*$' && r.status === 404);
if (i === -1) {
  throw new Error(
    '[rutas] no encuentro el catch-all del 404 en .vercel/output/config.json.\n'
    + '  Lo escribe @astrojs/vercel y su forma ha cambiado. Sin el, el 404 español\n'
    + '  no se enruta y las URLs rotas de /es/ vuelven a servirse en ingles.',
  );
}

// La carpeta de imagenes de Apollo se renombro de `brands/appolo` a `brands/apollo`
// (20-oct-2026; peticion del cliente del 29-sep sobre los nombres de fichero). El
// preview fue publico hasta el 18-oct, asi que las rutas viejas se sirvieron. Va aqui y
// no en `redirects` de astro.config.mjs porque Astro solo admite un redirect dinamico
// hacia una RUTA suya, no hacia ficheros de public/. Junto al 301 de la pagina.
const RUTA_APOLLO_IMG = {
  src: '^/cms-img/brands/appolo/(.+)$',
  headers: { Location: '/cms-img/brands/apollo/$1' },
  status: 301,
};
if (!config.routes.some((r) => r.src === RUTA_APOLLO_IMG.src)) {
  const iMarca = config.routes.findIndex((r) => r.src === '^/brands/appolo$');
  if (iMarca === -1) throw new Error('[rutas] no encuentro el 301 de /brands/appolo para colocar el de sus imagenes al lado');
  config.routes.splice(iMarca + 1, 0, RUTA_APOLLO_IMG);
}

const yaEsta = config.routes.some((r) => r.src === RUTA_404_ES.src);
if (!yaEsta) config.routes.splice(i, 0, RUTA_404_ES);
await fs.writeFile(CONFIG, JSON.stringify(config, null, 2), 'utf8');

console.log(
  `[rutas] 404 español enrutado (${RUTA_404_ES.src} -> ${RUTA_404_ES.dest}), `
  + `posicion ${i} de ${config.routes.length}`,
);
