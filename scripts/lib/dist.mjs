/**
 * Donde estan los HTML construidos. UNA respuesta para todas las puertas.
 *
 * Existe por un cambio de forma que Astro hace solo, sin avisar y sin error:
 *
 *   sitio 100% estatico        los HTML salen en dist/
 *   con UNA sola ruta de       los HTML salen en dist/client/ y el servidor en
 *   servidor (prerender=false) dist/server/
 *
 * Basto con anadir /api/lead —una ruta— para que las 107 paginas se movieran a
 * dist/client/. Las ocho puertas leian `dist/*.html`, asi que TODAS habrian dejado
 * de encontrar nada. Y ahi esta el peligro real: una puerta que no encuentra
 * ficheros no falla ruidosamente, se queda sin nada que comprobar y sale en verde.
 *
 * Por eso esta funcion no devuelve una ruta "por si acaso": si no encuentra HTML en
 * ninguna de las dos, LANZA. Una puerta vacia es peor que una puerta roja.
 */
import fs from 'node:fs/promises';
import path from 'node:path';

const RAIZ = path.resolve(import.meta.dirname, '..', '..');

const cuenta = async (dir) => {
  try {
    return (await fs.readdir(dir, { recursive: true })).filter((p) => p.endsWith('.html')).length;
  } catch {
    return 0;
  }
};

/** Raiz de los HTML construidos. Lanza si no hay ninguno. */
export async function raizHtml() {
  const cliente = path.join(RAIZ, 'dist/client');
  const plano = path.join(RAIZ, 'dist');

  if (await cuenta(cliente)) return cliente;
  // Se cuenta y no se comprueba si dist/ existe: con una ruta de servidor, dist/
  // existe pero solo tiene client/ y server/ dentro.
  if (await cuenta(plano)) return plano;

  throw new Error(
    'no hay ni un .html en dist/ ni en dist/client/: corre `npm run build` primero',
  );
}
