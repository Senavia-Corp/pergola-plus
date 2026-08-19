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

const i = config.routes.findIndex((r) => r.src === '^/.*$' && r.status === 404);
if (i === -1) {
  throw new Error(
    '[rutas] no encuentro el catch-all del 404 en .vercel/output/config.json.\n'
    + '  Lo escribe @astrojs/vercel y su forma ha cambiado. Sin el, el 404 español\n'
    + '  no se enruta y las URLs rotas de /es/ vuelven a servirse en ingles.',
  );
}

const yaEsta = config.routes.some((r) => r.src === RUTA_404_ES.src);
if (!yaEsta) {
  config.routes.splice(i, 0, RUTA_404_ES);
  await fs.writeFile(CONFIG, JSON.stringify(config, null, 2), 'utf8');
}

console.log(
  `[rutas] 404 español enrutado (${RUTA_404_ES.src} -> ${RUTA_404_ES.dest}), `
  + `posicion ${i} de ${config.routes.length}`,
);
