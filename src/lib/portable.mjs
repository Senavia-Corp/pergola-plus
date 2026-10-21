/**
 * Texto enriquecido del sitio <-> Portable Text de Sanity, en los dos sentidos.
 *
 *   htmlAPortable(html, opciones)  -> bloques   (lo usa la migracion)
 *   portableAHtml(bloques, opc.)   -> html      (lo usara el sitio al leer de Sanity)
 *
 * Los dos viven juntos A PROPOSITO: la paridad de la migracion es que
 * portableAHtml(htmlAPortable(x)) reproduzca x (scripts/sanity/ida-y-vuelta.mjs). Un
 * conversor generico (p. ej. @portabletext/html) normaliza a su manera y no garantiza
 * el marcado aprobado; este cubre EXACTAMENTE el repertorio de los cuerpos del blog y
 * de los textos legales, y LANZA ante cualquier etiqueta o atributo que no conozca en
 * vez de perderlo en silencio.
 *
 * Repertorio (inventario del 20-oct-2026 sobre los 21 posts y los 2 legales):
 *   bloques   p, h1, h2, h3, ul/ol (role="list") > li
 *   en linea  texto, strong, em, a[href], br
 *   propios   figure.w-richtext-figure-type-image > div > img   -> `imagenCuerpo`
 *             div.pp-tabla-scroll > table.pp-tabla               -> `tabla`
 *             div.pp-post-cta > a.button                         -> `botones`
 */
import { parse, ELEMENT_NODE, TEXT_NODE } from 'ultrahtml';

// ---------------------------------------------------------------------------
// Entidades
// ---------------------------------------------------------------------------
const NOMBRADAS = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };
export const decodificar = (s) =>
  s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (todo, e) => {
    if (e[0] === '#') return String.fromCodePoint(e[1] === 'x' || e[1] === 'X' ? parseInt(e.slice(2), 16) : Number(e.slice(1)));
    return NOMBRADAS[e.toLowerCase()] ?? todo;
  });
const escTexto = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const escAttr = (s) => escTexto(s).replace(/"/g, '&quot;');
// Como el export de Webflow (y src/lib/plantilla.mjs): el apostrofo `&#x27;` y la comilla
// `&quot;` tambien en el texto. Es la forma en que el sitio publica hoy los cuerpos.
const escWf = (s) => escAttr(s).replace(/'/g, '&#x27;');

// ---------------------------------------------------------------------------
// HTML -> Portable Text
// ---------------------------------------------------------------------------
const BLOQUE = { p: 'normal', h1: 'h1', h2: 'h2', h3: 'h3' };
const MARCA = { strong: 'strong', em: 'em' };
const FIGURA = 'w-richtext-align-center w-richtext-figure-type-image';

const exigir = (cond, msg) => { if (!cond) throw new Error(`[portable] ${msg}`); };
const soloAttrs = (n, permitidos) => {
  const sobran = Object.keys(n.attributes).filter((a) => !permitidos.includes(a));
  exigir(!sobran.length, `<${n.name}> con atributos no soportados: ${sobran.join(', ')}`);
};
const elementos = (n) => n.children.filter((c) => c.type === ELEMENT_NODE || (c.type === TEXT_NODE && c.value.trim()));

/**
 * @param {string} html
 * @param {{ enlaceInterno?: (ruta: string) => object | null, imagen: (src: string, alt: string) => object }} opc
 *   enlaceInterno: ruta interna -> campos de la anotacion (p. ej. una referencia), o null
 *   para dejarla como `href`. imagen: crea el bloque de imagen (asset, procedencia).
 */
export function htmlAPortable(html, opc) {
  const raiz = parse(html);
  const bloques = [];
  let i = 0;
  const clave = () => `b${i++}`;

  function enLinea(nodos, k) {
    const hijos = [];
    const markDefs = [];
    let m = 0;
    const recorrer = (lista, marcas) => {
      for (const n of lista) {
        if (n.type === TEXT_NODE) { if (n.value) hijos.push({ texto: decodificar(n.value), marcas }); continue; }
        if (n.type !== ELEMENT_NODE) continue;
        if (n.name === 'br') { soloAttrs(n, []); hijos.push({ texto: '\n', marcas }); continue; }
        if (MARCA[n.name]) { soloAttrs(n, []); recorrer(n.children, [...marcas, MARCA[n.name]]); continue; }
        if (n.name === 'a') {
          soloAttrs(n, ['href']);
          const href = decodificar(n.attributes.href ?? '');
          exigir(href, 'enlace sin href');
          const mk = `${k}m${m++}`;
          const interno = href.startsWith('/') && !href.startsWith('//') ? opc.enlaceInterno?.(href) : null;
          markDefs.push({ _type: 'enlace', _key: mk, ...(interno ?? { href }) });
          recorrer(n.children, [...marcas, mk]);
          continue;
        }
        throw new Error(`[portable] etiqueta en linea no soportada: <${n.name}>`);
      }
    };
    recorrer(nodos, []);
    // Spans contiguos con las mismas marcas se juntan (es lo que haria el editor).
    const spans = [];
    for (const h of hijos) {
      const ult = spans[spans.length - 1];
      if (ult && ult.marks.join() === h.marcas.join()) ult.text += h.texto;
      else spans.push({ _type: 'span', _key: `${k}s${spans.length}`, text: h.texto, marks: h.marcas });
    }
    if (!spans.length) spans.push({ _type: 'span', _key: `${k}s0`, text: '', marks: [] });
    return { children: spans, markDefs };
  }

  for (const n of raiz.children) {
    if (n.type === TEXT_NODE) { exigir(!n.value.trim(), `texto suelto fuera de bloque: «${n.value.slice(0, 60)}»`); continue; }
    if (n.type !== ELEMENT_NODE) continue;
    if (BLOQUE[n.name]) {
      soloAttrs(n, []);
      const k = clave();
      bloques.push({ _type: 'block', _key: k, style: BLOQUE[n.name], ...enLinea(n.children, k) });
    } else if (n.name === 'ul' || n.name === 'ol') {
      soloAttrs(n, ['role']);
      exigir(n.attributes.role === 'list', `<${n.name}> sin role="list"`);
      for (const li of elementos(n)) {
        exigir(li.type === ELEMENT_NODE && li.name === 'li', `hijo de <${n.name}> que no es <li>`);
        soloAttrs(li, []);
        const k = clave();
        bloques.push({ _type: 'block', _key: k, style: 'normal', listItem: n.name === 'ul' ? 'bullet' : 'number', level: 1, ...enLinea(li.children, k) });
      }
    } else if (n.name === 'figure') {
      soloAttrs(n, ['class']);
      exigir(n.attributes.class === FIGURA, `figure con clase inesperada: ${n.attributes.class}`);
      const [div] = elementos(n);
      exigir(elementos(n).length === 1 && div.name === 'div' && !Object.keys(div.attributes).length, 'figure sin <div> unico');
      const [img] = elementos(div);
      exigir(elementos(div).length === 1 && img.name === 'img', 'figure sin <img> unica');
      soloAttrs(img, ['src', 'alt', 'loading']);
      exigir(!img.attributes.loading || img.attributes.loading === 'lazy', `img con loading=${img.attributes.loading}`);
      bloques.push({ _key: clave(), ...opc.imagen(decodificar(img.attributes.src), decodificar(img.attributes.alt ?? '')), cargaDiferida: img.attributes.loading === 'lazy' });
    } else if (n.name === 'div' && n.attributes.class === 'pp-post-cta') {
      soloAttrs(n, ['class']);
      const k = clave();
      const items = elementos(n).map((a, j) => {
        exigir(a.name === 'a', 'pp-post-cta con hijo que no es <a>');
        soloAttrs(a, ['href', 'class']);
        const estilo = { 'button w-button': 'primario', 'button secundary w-button': 'secundario' }[a.attributes.class];
        exigir(estilo, `boton con clase inesperada: ${a.attributes.class}`);
        exigir(a.children.every((c) => c.type === TEXT_NODE), 'boton con marcado dentro');
        const href = decodificar(a.attributes.href);
        return { _type: 'boton', _key: `${k}i${j}`, texto: decodificar(a.children.map((c) => c.value).join('')), estilo, ...(opc.enlaceInterno?.(href) ?? { href }) };
      });
      bloques.push({ _type: 'botones', _key: k, items });
    } else if (n.name === 'div' && n.attributes.class === 'pp-tabla-scroll') {
      soloAttrs(n, ['class', 'role', 'tabindex', 'aria-label']);
      const [tabla] = elementos(n);
      exigir(tabla?.name === 'table' && tabla.attributes.class === 'pp-tabla', 'pp-tabla-scroll sin table.pp-tabla');
      soloAttrs(tabla, ['class']);
      const celdas = (fila, tag) => elementos(fila).map((c) => {
        exigir(c.name === tag, `celda <${c.name}> donde se esperaba <${tag}>`);
        soloAttrs(c, tag === 'th' ? ['scope'] : []);
        exigir(c.children.every((x) => x.type === TEXT_NODE), 'celda con marcado dentro');
        return decodificar(c.children.map((x) => x.value).join(''));
      });
      let titulo = '', cabecera = [], filas = [], scopes = [];
      for (const parte of elementos(tabla)) {
        if (parte.name === 'caption') titulo = decodificar(parte.children.map((x) => x.value).join(''));
        else if (parte.name === 'thead') {
          const [tr] = elementos(parte);
          cabecera = celdas(tr, 'th');
          scopes = elementos(tr).map((c) => c.attributes.scope ?? '');
        } else if (parte.name === 'tbody') {
          filas = elementos(parte).map((tr) => {
            const cs = elementos(tr);
            // La primera celda de cada fila es <th scope="row">: es la etiqueta de la fila.
            exigir(cs[0]?.name === 'th' && cs[0].attributes.scope === 'row', 'fila sin <th scope="row">');
            return { _type: 'filaTabla', _key: `f${filas.length}`, celdas: [decodificar(cs[0].children.map((x) => x.value).join('')), ...cs.slice(1).map((c) => { exigir(c.name === 'td', 'celda de datos que no es <td>'); return decodificar(c.children.map((x) => x.value).join('')); })] };
          });
        } else throw new Error(`[portable] parte de tabla no soportada: <${parte.name}>`);
      }
      exigir(scopes.every((s) => s === 'col'), 'cabecera con scope distinto de col');
      // role="region" y tabindex="0" son DISEÑO (la tabla se desplaza en movil y el
      // teclado tiene que poder alcanzarla): los pone el codigo, no se guardan.
      exigir(n.attributes.role === 'region' && n.attributes.tabindex === '0', 'pp-tabla-scroll sin role="region" tabindex="0"');
      bloques.push({ _type: 'tabla', _key: clave(), titulo, etiquetaAccesible: decodificar(n.attributes['aria-label'] ?? ''), cabecera, filas });
    } else {
      throw new Error(`[portable] bloque no soportado: <${n.name}${n.attributes.class ? ` class="${n.attributes.class}"` : ''}>`);
    }
  }
  return bloques;
}

// ---------------------------------------------------------------------------
// Portable Text -> HTML
// ---------------------------------------------------------------------------
const ETIQUETA = { normal: 'p', h1: 'h1', h2: 'h2', h3: 'h3' };

/**
 * @param {object[]} bloques
 * @param {{ hrefDe?: (anotacion: object) => string, imagen: (bloque: object) => { src: string, alt: string }, webflow?: boolean }} opc
 *   webflow: serializa como el export de Webflow que publica hoy el sitio (`&#x27;` y
 *   `&quot;` en el texto, `<br/>`, `<img … alt="…"  loading="lazy"/>`), byte a byte. Sin
 *   ella, la forma minima que usa la prueba de ida y vuelta.
 */
export function portableAHtml(bloques, opc) {
  const hrefDe = (d) => (d.href ? d.href : opc.hrefDe(d));
  const escTexto_ = opc.webflow ? escWf : escTexto;
  const escAttr_ = opc.webflow ? escWf : escAttr;
  const BR = opc.webflow ? '<br/>' : '<br>';
  const LAZY = opc.webflow ? '  loading="lazy"' : ' loading="lazy"';
  const linea = (b) => {
    const defs = Object.fromEntries((b.markDefs ?? []).map((d) => [d._key, d]));
    let html = '';
    let abiertas = [];
    const cerrarHasta = (n) => { while (abiertas.length > n) { const m = abiertas.pop(); html += defs[m] ? '</a>' : `</${m}>`; } };
    for (const s of b.children) {
      let comun = 0;
      while (comun < abiertas.length && comun < s.marks.length && abiertas[comun] === s.marks[comun]) comun++;
      cerrarHasta(comun);
      for (const m of s.marks.slice(comun)) { html += defs[m] ? `<a href="${escAttr_(hrefDe(defs[m]))}">` : `<${m}>`; abiertas.push(m); }
      html += s.text.split('\n').map(escTexto_).join(BR);
    }
    cerrarHasta(0);
    return html;
  };
  let html = '';
  let lista = null;
  const cerrarLista = () => { if (lista) { html += `</${lista}>`; lista = null; } };
  for (const b of bloques) {
    if (b._type === 'block' && b.listItem) {
      const tag = b.listItem === 'bullet' ? 'ul' : 'ol';
      if (lista !== tag) { cerrarLista(); html += `<${tag} role="list">`; lista = tag; }
      html += `<li>${linea(b)}</li>`;
      continue;
    }
    cerrarLista();
    if (b._type === 'block') html += `<${ETIQUETA[b.style]}>${linea(b)}</${ETIQUETA[b.style]}>`;
    else if (b._type === 'imagenCuerpo') {
      const { src, alt } = opc.imagen(b);
      html += `<figure class="${FIGURA}"><div><img src="${escAttr_(src)}" alt="${escAttr_(alt)}"${b.cargaDiferida ? LAZY : ''}/></div></figure>`;
    } else if (b._type === 'botones') {
      const clase = { primario: 'button w-button', secundario: 'button secundary w-button' };
      html += `<div class="pp-post-cta">${b.items.map((x) => `<a href="${escAttr_(hrefDe(x))}" class="${clase[x.estilo]}">${escTexto_(x.texto)}</a>`).join('')}</div>`;
    } else if (b._type === 'tabla') {
      html += `<div class="pp-tabla-scroll" role="region" tabindex="0"${b.etiquetaAccesible ? ` aria-label="${escAttr_(b.etiquetaAccesible)}"` : ''}><table class="pp-tabla">`
        + (b.titulo ? `<caption>${escTexto_(b.titulo)}</caption>` : '')
        + `<thead><tr>${b.cabecera.map((c) => `<th scope="col">${escTexto_(c)}</th>`).join('')}</tr></thead>`
        + `<tbody>${b.filas.map((f) => `<tr><th scope="row">${escTexto_(f.celdas[0])}</th>${f.celdas.slice(1).map((c) => `<td>${escTexto_(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
    } else throw new Error(`[portable] tipo de bloque desconocido: ${b._type}`);
  }
  cerrarLista();
  return html;
}
