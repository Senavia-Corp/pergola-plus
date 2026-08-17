/**
 * Las cadenas traducibles de un fragmento migrado.
 *
 * Aplica EXACTAMENTE el mismo criterio que `traducirHtml` (src/i18n/index.ts): solo
 * nodos de texto entre `>` y `<`, con <style> y <script> apartados. Asi, lo que sale
 * de aqui son las claves que hay que rellenar en el diccionario — ni una mas, ni una
 * menos.
 *
 * Vive aparte porque lo usan DOS scripts —`extraer-traducibles.mjs` para contar y
 * listar, y `emparejar-traduccion.mjs` para generar el diccionario— y si cada uno
 * llevara su copia, un dia dirian cosas distintas y la traduccion saldria desalineada
 * sin que nada avisara.
 */
const SENTINELA = ' ';

export function traducibles(html) {
  const protegidos = [];
  const marcado = html.replace(/<(style|script)\b[\s\S]*?<\/\1>/gi, (bloque) => {
    protegidos.push(bloque);
    return SENTINELA;
  });
  const salida = new Set();
  for (const m of marcado.matchAll(/>([^<>]+)</g)) {
    const t = m[1].trim();
    // Mismo filtro que traducirHtml: se ignora lo que no parece prosa.
    if (t.length > 2 && /[a-zA-Z]{3}/.test(t)) salida.add(t);
  }
  return [...salida];
}
