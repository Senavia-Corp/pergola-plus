#!/usr/bin/env node
/**
 * Puerta del espanol. Sobre dist/, DESPUES de `npm run build`.
 *
 *     npm run check:i18n
 *
 * Lo que protege NO es «que haya espanol»: es que el espanol no MIENTA y que no se
 * publique a medias.
 *
 * Los dos fallos que persigue son silenciosos:
 *
 *   1. Una pagina /es/ a medio traducir. Se ve bien por arriba y el visitante se topa
 *      con ingles al tercer parrafo. Peor que no tenerla.
 *   2. Una pagina /es/ que pierde un `data-w-id` o el bloque anti-FOUC de su gemela
 *      inglesa. Como la version espanola REUTILIZA el markup migrado y solo sustituye
 *      nodos de texto, si algo se come un id el elemento se queda en opacity:0 para
 *      siempre. Sin error, sin hueco: invisible.
 *
 * Y el que ya estaba arreglado y hay que mantener arreglado: el hreflang tiene que
 * ser reciproco y apuntar SOLO a paginas que existen. Antes, 106 paginas declaraban
 * una traduccion inexistente.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { raizHtml } from './lib/dist.mjs';

const DIST = await raizHtml();

/** Cobertura minima de nodos de texto traducidos, por pagina. */
const COBERTURA = 0.98;

let fallos = 0;
const decir = (ok, msg, detalle = []) => {
  console.log(`  ${ok ? 'ok   ' : 'FALLO'} ${msg}`);
  if (!ok) {
    fallos++;
    for (const d of detalle.slice(0, 10)) console.log(`         ${d}`);
    if (detalle.length > 10) console.log(`         ... y ${detalle.length - 10} mas`);
  }
};

const htmls = (await fs.readdir(DIST, { recursive: true })).filter((p) => p.endsWith('.html'));
if (!htmls.length) {
  console.log('  FALLO  dist/ vacio: corre `npm run build` primero');
  process.exit(1);
}

const ruta = (rel) => '/' + rel.replace(/index\.html$/, '').replace(/\.html$/, '');
const es = htmls.filter((rel) => ruta(rel).startsWith('/es/') || ruta(rel) === '/es/');

decir(es.length > 0, `${es.length} paginas en /es/`);

// El cuerpo, sin el shell: el nav y el pie ya se traducen por diccionario de claves
// (src/i18n/shell.ts) y meterlos aqui diluiria la medida de la pagina.
function cuerpo(html) {
  const i = html.indexOf('</nav>');
  const j = html.lastIndexOf('<footer');
  return i >= 0 && j > i ? html.slice(i, j) : html;
}

/** Elementos sin subarbol: no hay nada que saltar dentro de ellos. */
const VACIOS = new Set([
  'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
  'link', 'meta', 'param', 'source', 'track', 'wbr',
]);

/** Fin del cierre equilibrado de `tag` a partir de `desde`. */
function cierreDe(html, tag, desde) {
  const re = new RegExp(`<(/?)${tag}\\b[^>]*>`, 'gi');
  re.lastIndex = desde;
  let profundidad = 1;
  let m;
  while ((m = re.exec(html))) {
    profundidad += m[1] ? -1 : 1;
    if (profundidad === 0) return re.lastIndex;
  }
  return html.length;   // sin cierre: se descarta hasta el final, que es lo conservador
}

/**
 * Quita los subarboles que DECLARAN otro idioma.
 *
 * POR QUE EXISTE ESTO. El sitio publica las resenas de Google en el idioma en que
 * las escribio cada cliente, tambien en /es/: traducir un testimonio lo convierte
 * en algo que esa persona no dijo. Sin esta funcion, la heuristica de abajo
 * contaria cada resena inglesa como «sin traducir» y tumbaria la cobertura de la
 * home espanola por hacer lo correcto.
 *
 * NO ES UNA EXENCION GENERAL, y la diferencia importa. Solo se libra el contenido
 * que declara su idioma con un atributo `lang` EXPLICITO y distinto al de la
 * pagina. Declararlo no es un truco para esquivar la puerta: es lo que necesita un
 * lector de pantalla para cambiar de voz — sin `lang` lee una resena inglesa con
 * fonetica espanola y no se entiende. Es decir, para saltarse el recuento hay que
 * hacer antes lo correcto.
 *
 * Un parrafo que se quedo en ingles por olvido no lleva `lang` y sigue contando,
 * que es justo lo que esta puerta persigue.
 *
 * Ya habia dos casos legitimos antes de las resenas: los enlaces del selector de
 * idioma (`<a href="/es/" lang="en">English</a>`), que estaban colandose dentro
 * del margen del 2%.
 */
function quitarOtroIdioma(html, idioma) {
  const cortes = [];
  const re = /<([a-z][\w-]*)\b([^>]*)>/gi;
  let m;
  while ((m = re.exec(html))) {
    const [todo, tag, atributos] = m;
    const lang = atributos.match(/\blang\s*=\s*["']?([\w-]+)/i)?.[1];
    // `es-ES` y `es` son el mismo idioma: se compara solo la subetiqueta primaria.
    if (!lang || lang.split('-')[0].toLowerCase() === idioma) continue;
    if (todo.endsWith('/>') || VACIOS.has(tag.toLowerCase())) continue;
    const fin = cierreDe(html, tag, re.lastIndex);
    cortes.push([m.index, fin]);
    re.lastIndex = fin;   // el subarbol entero queda fuera, anidados incluidos
  }
  let salida = '';
  let anterior = 0;
  for (const [a, b] of cortes) {
    salida += html.slice(anterior, a);
    anterior = b;
  }
  return salida + html.slice(anterior);
}

/** Nodos de texto que parecen prosa, con el mismo criterio que traducirHtml. */
function nodos(html, idioma) {
  const sinBloques = quitarOtroIdioma(html, idioma)
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ');
  const out = [];
  for (const m of sinBloques.matchAll(/>([^<>]+)</g)) {
    const t = m[1].trim();
    if (t.length > 2 && /[a-zA-Z]{3}/.test(t)) out.push(t);
  }
  return out;
}

/**
 * La puerta comprueba su propia maquinaria ANTES de usarla.
 *
 * `quitarOtroIdioma` recorta subarboles buscando el cierre equilibrado a mano. Si
 * ese recorte se descontrolara y se comiera de mas, la cobertura de abajo saldria
 * perfecta midiendo cuatro nodos — es decir, la puerta saldria en VERDE por no
 * tener nada que comprobar. Este repo ya se comio esa clase de fallo dos veces
 * (las capturas en /tmp, los HTML mudandose a dist/client), y la leccion fue
 * siempre la misma: afirmar antes de comparar.
 *
 * Diez lineas y microsegundos. El caso 5 es el que de verdad importa: un <div>
 * dentro de otro <div> exige contar profundidad, y buscar el primer </div> —que es
 * lo que sale solo— dejaria medio documento fuera.
 */
{
  const casos = [
    ['sin lang', '<p>hola mundo</p>', ['hola mundo']],
    ['aparta lang=en con sus hijos', '<p>hola mundo</p><div lang="en"><p>hello there</p><span>bye now</span></div>', ['hola mundo']],
    ['conserva lang=es', '<div lang="es"><p>hola mundo</p></div>', ['hola mundo']],
    ['es-ES cuenta como es', '<div lang="es-ES"><p>hola mundo</p></div>', ['hola mundo']],
    ['cierre equilibrado con el mismo tag anidado', '<div lang="en"><div>hello there</div></div><p>sigo aqui</p>', ['sigo aqui']],
    ['solo se va el hermano marcado', '<p lang="en">hello there</p><p>hola mundo</p>', ['hola mundo']],
    ['dos bloques marcados', '<p lang="en">hello aa</p><p>medio texto</p><p lang="en">bye bbb</p>', ['medio texto']],
    ['un <img lang> no se come lo que sigue', '<img lang="en" alt="x"><p>hola mundo</p>', ['hola mundo']],
    ['self-closing tampoco', '<br lang="en"/><p>hola mundo</p>', ['hola mundo']],
    ['selector de idioma', '<a href="/es/" lang="en">English</a><a href="/es/" lang="es">Espanol</a><p>texto normal</p>', ['Espanol', 'texto normal']],
  ];
  const malos = casos.filter(([, html, esperado]) =>
    JSON.stringify(nodos(html, 'es')) !== JSON.stringify(esperado));
  if (malos.length) {
    console.log('  FALLO la exencion por `lang` esta rota: no se puede confiar en la cobertura');
    for (const [nombre, html] of malos) {
      console.log(`         ${nombre}: ${JSON.stringify(nodos(html, 'es'))}`);
    }
    process.exit(1);
  }
  console.log(`  ok    la exencion por \`lang\` pasa sus ${casos.length} casos`);
}

/**
 * Heuristica de «esto sigue en ingles».
 *
 * No se puede detectar el idioma de verdad sin una libreria, y no hace falta: basta
 * con buscar palabras funcionales inglesas que NO existen en espanol. `and`, `the` o
 * `with` en un texto espanol solo aparecen dentro de una marca o de una cita.
 *
 * ponytail: sin detector de idioma. Si algun dia hay falsos positivos de verdad, el
 * sitio para meter uno es esta funcion.
 */
const INGLESAS = /\b(the|and|with|your|our|for|from|that|this|are|will|have|which|you)\b/i;
const esIngles = (t) => INGLESAS.test(t);

const sinCobertura = [];
const idsPerdidos = [];
const foucPerdido = [];
const langMal = [];
const tituloIgual = [];
const excluyeDemasiado = [];

/**
 * Cuanto texto puede apartar `quitarOtroIdioma` antes de que la medida deje de
 * significar nada.
 *
 * Esta lo mismo que el 98% de cobertura: una puerta que no encuentra nada que
 * comprobar sale en VERDE, y eso es peor que salir en rojo. Si un fallo del
 * recorte equilibrado se comiera medio documento, la cobertura saldria del 100%
 * midiendo cuatro nodos. Con el sitio como esta, lo unico que se aparta son las
 * resenas y los dos enlaces del selector de idioma; el 35% deja sitio de sobra
 * para que crezcan las resenas sin dar un falso positivo, y sigue muy por debajo
 * de "se comio la pagina".
 */
const MAX_EXCLUIDO = 0.35;

for (const rel of es) {
  const html = await fs.readFile(path.join(DIST, rel), 'utf8');
  const r = ruta(rel);

  // --- <html lang="es"> ---
  if (!/<html[^>]*\blang="es"/.test(html)) langMal.push(r);

  // --- cobertura ---
  const textos = nodos(cuerpo(html), 'es');

  // Cuanto se ha apartado por declarar otro idioma. Se mide comparando contra el
  // recuento SIN apartar nada: si el recorte se descontrolara, la cobertura de
  // arriba saldria perfecta por no tener nada que medir.
  const todos = nodos(cuerpo(html), ' ');   // ningun lang coincide con esto
  const apartados = todos.length - textos.length;
  if (todos.length && apartados / todos.length > MAX_EXCLUIDO) {
    excluyeDemasiado.push(
      `${r}  ${apartados} de ${todos.length} nodos (${((apartados / todos.length) * 100).toFixed(0)}%)`
      + ` apartados por lang≠es, maximo ${MAX_EXCLUIDO * 100}%`,
    );
  }

  const enIngles = textos.filter(esIngles);
  const cobertura = textos.length ? 1 - enIngles.length / textos.length : 1;
  if (cobertura < COBERTURA) {
    sinCobertura.push(
      `${r}  ${(cobertura * 100).toFixed(1)}% (${enIngles.length} de ${textos.length} en ingles)`
      + (enIngles.length ? `\n           p.ej. "${enIngles[0].slice(0, 70)}"` : ''),
    );
  }

  // --- paridad con la gemela inglesa ---
  // Se busca por el hreflang que la propia pagina declara: si dice que su gemela es
  // /products, se compara contra /products. Asi no hace falta un segundo mapa.
  const gemela = html.match(/<link rel="alternate" hreflang="en" href="([^"]+)"/)?.[1];
  if (gemela) {
    const p = new URL(gemela).pathname;
    const relEn = p === '/' ? 'index.html' : p.replace(/^\//, '').replace(/\/$/, '') + '/index.html';
    const ingles = await fs.readFile(path.join(DIST, relEn), 'utf8').catch(() => null);
    if (ingles) {
      const ids = (s) => new Set([...s.matchAll(/data-w-id="([^"]+)"/g)].map((m) => m[1]));
      const faltan = [...ids(ingles)].filter((x) => !ids(html).has(x));
      if (faltan.length) idsPerdidos.push(`${r}: ${faltan.length} (${faltan[0].slice(0, 8)}…)`);

      const fouc = (s) => new Set(
        [...s.matchAll(/html\.w-mod-js:not\(\.w-mod-ix\)\s*\[data-w-id="([^"]+)"\]/g)].map((m) => m[1]));
      const fFaltan = [...fouc(ingles)].filter((x) => !fouc(html).has(x));
      if (fFaltan.length) foucPerdido.push(`${r}: ${fFaltan.length} bloques anti-FOUC`);

      // Un title identico al ingles significa que se olvido traducir el <head>.
      const t = (s) => s.match(/<title>([\s\S]*?)<\/title>/)?.[1]?.trim();
      if (t(html) && t(html) === t(ingles)) tituloIgual.push(r);
    }
  }
}

decir(langMal.length === 0, 'toda pagina /es/ declara <html lang="es">', langMal);
decir(sinCobertura.length === 0, `${COBERTURA * 100}% de los nodos de texto traducidos`, sinCobertura);
decir(excluyeDemasiado.length === 0,
  `la exencion por lang aparta menos del ${MAX_EXCLUIDO * 100}% del texto (si no, la medida no vale)`,
  excluyeDemasiado);
decir(idsPerdidos.length === 0, 'ninguna pagina /es/ pierde un data-w-id de su gemela', idsPerdidos);
decir(foucPerdido.length === 0, 'ninguna pagina /es/ pierde un bloque anti-FOUC', foucPerdido);
decir(tituloIgual.length === 0, 'ningun <title> de /es/ es identico al ingles', tituloIgual);

// --- hreflang reciproco y verdadero ---------------------------------------
// Es el fallo que mas caro sale y el mas facil de reintroducir: basta con anadir una
// ruta a TRADUCIDAS y olvidarse de crear la pagina.
const rotos = [];
const noReciprocos = [];
const rutas = new Set(htmls.map(ruta));

for (const rel of htmls) {
  const html = await fs.readFile(path.join(DIST, rel), 'utf8');
  const r = ruta(rel);
  const alt = [...html.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g)]
    .map((m) => ({ lang: m[1], p: new URL(m[2]).pathname }));

  for (const a of alt) {
    if (a.lang === 'x-default') continue;
    if (!rutas.has(a.p) && !rutas.has(a.p.replace(/\/$/, ''))) {
      rotos.push(`${r} declara hreflang="${a.lang}" -> ${a.p}, que NO existe`);
      continue;
    }
    // Reciprocidad: la pagina apuntada tiene que apuntar de vuelta a esta.
    const relOtra = a.p === '/' ? 'index.html' : a.p.replace(/^\//, '').replace(/\/$/, '') + '/index.html';
    const otra = await fs.readFile(path.join(DIST, relOtra), 'utf8').catch(() => null);
    if (!otra) continue;
    const vuelve = [...otra.matchAll(/<link rel="alternate" hreflang="[^"]+" href="([^"]+)"/g)]
      .some((m) => new URL(m[1]).pathname.replace(/\/$/, '') === r.replace(/\/$/, ''));
    if (!vuelve) noReciprocos.push(`${r} -> ${a.p} no apunta de vuelta`);
  }
}

decir(rotos.length === 0, 'ningun hreflang apunta a una pagina que no existe', rotos);
decir(noReciprocos.length === 0, 'todo par de hreflang es reciproco', noReciprocos);

// --- cuanto queda ----------------------------------------------------------
// El informe importa tanto como la puerta: sin este numero, «el sitio esta en
// espanol» pasa por cierto cuando lo estan 7 paginas de 107.
const en = htmls.filter((rel) => !ruta(rel).startsWith('/es/') && ruta(rel) !== '/es/');
const conGemela = en.filter(async () => true);
console.log(`\n  ${es.length} de ${en.length} paginas inglesas tienen version espanola publicada`);
console.log('  Las que no la tienen NO existen en /es/, no llevan hreflang y no entran');
console.log('  en el sitemap: media traduccion publicada es peor que ninguna.');

if (fallos) {
  console.log(`\n${fallos} fallo(s).`);
  process.exit(1);
}
console.log('\n  Todo en verde.');
