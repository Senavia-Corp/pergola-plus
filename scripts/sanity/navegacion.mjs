/**
 * La estructura del menu y del pie, leida de src/components/Nav.astro y Footer.astro:
 * grupos, columnas y enlaces (destino + claves de texto de src/i18n/shell.ts), en el
 * orden en que se pintan. El diseño (clases, data-w-id, iconos) sigue en el componente;
 * esto es lo que el documento `navigation` guarda y lo que la parada 3 itera.
 *
 *   menuDe(src)  -> [{ clave, destino?, columnas: [{ titulo?, enlaces: [{ href, claves }] }] }]
 *   pieDe(src)   -> [{ titulo?, enlaces: [{ href, claves }] }]
 *
 * Se lee con expresiones sobre el fuente porque el componente no tiene otra fuente de
 * datos. Lanza ante cualquier forma que no conozca.
 */
const KEY = /t\('([A-Za-z]+)'\)/g;

function tokens(src, desde, hasta) {
  const ini = src.indexOf(desde);
  const fin = src.indexOf(hasta, ini);
  if (ini < 0 || fin < 0) throw new Error(`[navegacion] no encuentro el tramo ${desde} … ${hasta}`);
  const tramo = src.slice(ini, fin).replace(/\{\/\*[\s\S]*?\*\/\}/g, '');
  const re = /w-dropdown-toggle|nav-submenu-title">\{t\('([A-Za-z]+)'\)\}|heading-footer">\{t\('([A-Za-z]+)'\)\}|href="([^"]*)"|t\('([A-Za-z]+)'\)/g;
  const out = [];
  for (const m of tramo.matchAll(re)) {
    if (m[0] === 'w-dropdown-toggle') out.push({ t: 'grupo' });
    else if (m[1]) out.push({ t: 'columna', clave: m[1] });
    else if (m[2]) out.push({ t: 'columna', clave: m[2] });
    else if (m[3] != null) out.push({ t: 'href', v: m[3], linea: tramo.slice(tramo.lastIndexOf('\n', m.index) + 1, tramo.indexOf('\n', m.index)) });
    else out.push({ t: 'clave', clave: m[4] });
  }
  return out;
}

export function menuDe(src) {
  const grupos = [];
  let g = null, col = null, item = null, etiqueta = false;
  for (const x of tokens(src, 'class="nav-menu w-nav-menu"', 'class="block-call-menu')) {
    if (x.t === 'grupo') { g = { clave: null, columnas: [] }; grupos.push(g); col = null; item = null; etiqueta = true; continue; }
    if (x.t === 'columna') { col = { titulo: x.clave, enlaces: [] }; g.columnas.push(col); item = null; continue; }
    if (x.t === 'href') {
      if (/^tel:/.test(x.v)) { item = 'ignorar'; continue; }
      if (!x.v.startsWith('/')) throw new Error(`[navegacion] enlace no interno en el menu: ${x.v}`);
      item = { href: x.v, claves: [] };
      if (/nav-link w-nav-link/.test(x.linea)) { g = { clave: null, destino: x.v, columnas: [] }; grupos.push(g); col = null; etiqueta = true; item = null; continue; }
      if (/button-menu/.test(x.linea)) {
        if (g?.clave !== 'botones') { g = { clave: 'botones', columnas: [{ enlaces: [] }] }; grupos.push(g); }
        col = g.columnas[0];
      } else if (!col || col.verTodo) { col = { enlaces: [] }; g.columnas.push(col); }
      col.enlaces.push(item);
      continue;
    }
    // clave
    if (etiqueta) { g.clave = x.clave; etiqueta = false; continue; }
    if (item === 'ignorar' || !item) continue;
    item.claves.push(x.clave);
    // «Ver todos …» cierra el grupo: va en su propia columna, sin titulo.
    if (/^verTodos/.test(x.clave) && item.claves.length === 1) {
      col.enlaces.pop();
      if (!col.enlaces.length) g.columnas.pop();
      g.columnas.push({ verTodo: true, enlaces: [item] });
      col = g.columnas[g.columnas.length - 1];
    }
  }
  for (const gr of grupos) {
    if (!gr.clave) throw new Error('[navegacion] grupo sin texto');
    for (const c of gr.columnas) for (const e of c.enlaces) if (!e.claves.length) throw new Error(`[navegacion] enlace sin texto: ${e.href}`);
  }
  return grupos;
}

export function pieDe(src) {
  const cols = [];
  let col = null;
  for (const x of tokens(src, 'heading-footer', '</footer>')) {
    if (x.t === 'columna') { col = { titulo: x.clave, enlaces: [] }; cols.push(col); continue; }
    if (x.t === 'href') {
      if (!x.v.startsWith('/')) { col = col?.titulo ? col : col; continue; }
      const claves = [...x.linea.matchAll(KEY)].map((m) => m[1]);
      if (!claves.length) throw new Error(`[navegacion] enlace del pie sin texto: ${x.v}`);
      // Los legales van al final, fuera de las columnas con titulo.
      if (col?.titulo && cols.length >= 3 && /^\/articles\//.test(x.v)) { col = { enlaces: [] }; cols.push(col); }
      col.enlaces.push({ href: x.v, claves });
    }
  }
  return cols;
}
