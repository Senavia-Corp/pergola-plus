/**
 * Puerta del espanol. Se ejecuta sobre dist/, DESPUES de `npm run build`.
 *
 *     npm run check:i18n
 *
 * Lo que protege no es "que haya espanol", es que el espanol NO MIENTA. El fallo
 * caro aqui es silencioso: una pagina /es/ a medio traducir que ademas declara
 * `hreflang` reciproco le dice a Google que existe una traduccion que no existe.
 * Mentir en el hreflang es peor que no tenerlo.
 *
 * Por eso, cuando se llene, mide por pagina: cobertura de nodos traducidos,
 * cero ingles en nav/footer/CTA, `<html lang="es">`, hreflang solo hacia paginas
 * que existen de verdad, y los mismos data-w-id y bloques anti-FOUC que su
 * gemela inglesa —porque la version espanola reutiliza el markup migrado y una
 * traduccion que se coma un id mata su animacion sin dar error.
 *
 * FASE 0: cableada y en vacio. Las comprobaciones entran en la Fase 3.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { raizHtml } from './lib/dist.mjs';

const DIST = await raizHtml();

const htmls = (await fs.readdir(DIST, { recursive: true })).filter((p) => p.endsWith('.html'));
if (!htmls.length) {
  console.log('  FALLO  dist/ vacio: corre `npm run build` primero');
  process.exit(1);
}

const es = htmls.filter((p) => p === 'es/index.html' || p.startsWith('es/'));
console.log(`  ${htmls.length} paginas · ${es.length} en /es/`);
console.log('  ---    sin comprobaciones todavia: se llenan en la Fase 3 (espanol)');
