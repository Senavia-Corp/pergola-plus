// node scripts/sanity/loop-glosario-codigo.mjs [--aplicar]: aplica el glosario a los literales de cadena de src/i18n (lado español).
import fs from 'node:fs';
import { aFlorida } from './es-florida.mjs';
const DIR = '/Users/senavia/Sites/pp-loop/src/i18n';
const g = JSON.parse(fs.readFileSync('/Users/senavia/Sites/pp-loop/docs/seo-loop/glosario-es-florida.json', 'utf8'));
const res = g.prohibidos.map((p) => new RegExp(`(?<![\\p{L}])(${p.patron})(?![\\p{L}])`, 'iu'));
const aplicar = process.argv.includes('--aplicar');
let total = 0;
for (const f of fs.readdirSync(DIR).filter((f) => f.endsWith('.ts'))) {
  const src = fs.readFileSync(`${DIR}/${f}`, 'utf8');
  let n = 0;
  // Literales '...', "..." y `...` (sin ${} dentro): el código y los identificadores no se tocan.
  const out = src.replace(/(['"`])((?:\\.|(?!\1)[^\\\n])*)\1/g, (m, q, cuerpo) => {
    if (!res.some((r) => r.test(cuerpo)) || (q === '`' && cuerpo.includes('${'))) return m;
    const nuevo = aFlorida(cuerpo);
    if (nuevo === cuerpo) return m;
    n++;
    if (!aplicar) console.log(`${f}: «${cuerpo.slice(0, 90)}» → «${nuevo.slice(0, 90)}»`);
    return q + nuevo.replaceAll(q, `\\${q}`) + q;
  });
  if (n) { total += n; if (aplicar) fs.writeFileSync(`${DIR}/${f}`, out); }
  const quedan = out.split('\n').filter((l) => res.some((r) => r.test(l))).length;
  if (quedan) console.log(`  ${f}: ${quedan} líneas aún con término prohibido`);
}
console.log('literales cambiados', total, aplicar ? '(aplicado)' : '(prueba)');
