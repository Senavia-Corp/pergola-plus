/**
 * Parser CSV para los exports de Webflow.
 *
 * No vale un split por comas: los campos traen HTML con comas, comillas y
 * saltos de linea dentro (Post Body, Paragraphs Intro, etc.).
 */
export function parseCSV(txt) {
  if (txt.charCodeAt(0) === 0xfeff) txt = txt.slice(1);   // BOM
  const filas = [];
  let campo = '', fila = [], enComillas = false;
  for (let i = 0; i < txt.length; i++) {
    const c = txt[i];
    if (enComillas) {
      if (c === '"') { if (txt[i + 1] === '"') { campo += '"'; i++; } else enComillas = false; }
      else campo += c;
    } else if (c === '"') enComillas = true;
    else if (c === ',') { fila.push(campo); campo = ''; }
    else if (c === '\n') { fila.push(campo); filas.push(fila); fila = []; campo = ''; }
    else if (c !== '\r') campo += c;
  }
  if (campo || fila.length) { fila.push(campo); filas.push(fila); }
  const cab = filas.shift();
  return filas.filter((f) => f.some((v) => v !== ''))
    .map((f) => Object.fromEntries(cab.map((c, i) => [c, f[i] ?? ''])));
}
