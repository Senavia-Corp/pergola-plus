/**
 * Puerta del SEO de salida. Se ejecuta sobre dist/, DESPUES de `npm run build`.
 *
 *     npm run check:seo
 *
 * Mira el HTML FINAL, que es lo unico que ve un buscador. Los tres fallos que
 * persigue no dan error en build y por eso llevan meses vivos:
 *
 *   - `site` apuntando al staging de Webflow envenena de una sola vez las
 *     canonicas, los hreflang, el JSON-LD y los <guid> del RSS de las 107
 *     paginas. Medido antes de arreglarlo: 761 referencias a webflow.io.
 *   - 19 paginas comparten <title>Pergola Plus Florida</title> (los 7 servicios,
 *     los 10 productos y las 2 legales). Duplicar el title es competir contra
 *     uno mismo.
 *   - Un JSON-LD que no parsea no es "SEO mas debil": Google lo descarta entero.
 *
 * FASE 0: cableada y en vacio. Las comprobaciones entran en la Fase 4.
 */
import fs from 'node:fs/promises';
import path from 'node:path';

const DIST = path.join(path.resolve(import.meta.dirname, '..'), 'dist');

const htmls = (await fs.readdir(DIST, { recursive: true })).filter((p) => p.endsWith('.html'));
if (!htmls.length) {
  console.log('  FALLO  dist/ vacio: corre `npm run build` primero');
  process.exit(1);
}

console.log(`  ${htmls.length} paginas`);
console.log('  ---    sin comprobaciones todavia: se llenan en la Fase 4 (SEO)');
