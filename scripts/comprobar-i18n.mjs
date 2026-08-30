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

/**
 * Todas las traducciones ES, leidas de los diccionarios como TEXTO.
 *
 * No se importan los modulos: son .ts con tipos y este script corre con node a
 * pelo. Lo que se necesita aqui no es el diccionario tipado, es la pregunta
 * «¿existe traduccion para esta cadena?» — y para eso basta con las claves.
 */
const DIC = {};
for (const f of await fs.readdir(path.resolve(import.meta.dirname, '../src/i18n'))) {
  if (!f.endsWith('.es.ts')) continue;
  const fuente = await fs.readFile(path.resolve(import.meta.dirname, '../src/i18n', f), 'utf8');
  for (const m of fuente.matchAll(/'((?:[^'\\]|\\.)+)':\s*'((?:[^'\\]|\\.)+)'/g)) {
    if (DIC[m[1]] === undefined && m[1] !== m[2]) DIC[m[1]] = m[2];
  }
}

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
    // La vuelta tiene que ser CON EL IDIOMA de esta pagina, no con cualquiera.
    //
    // Antes el patron era hreflang="[^"]+", o sea que se descartaba el idioma y
    // solo se comprobaba que las dos paginas se conocieran. Con eso, un cluster
    // donde LAS DOS dicen «la version española esta alli» pasaba en verde: son
    // reciprocas y estan mutuamente equivocadas. Google descarta entero un cluster
    // asi —deja de servir /es/ a hispanohablantes y las dos paginas compiten entre
    // si— y ademas el sitemap copia estos mismos xhtml:link, con lo que la mentira
    // se repite en los dos sitios sin que ninguna puerta la vea.
    const idiomaDeEsta = r === '/es/' || r.startsWith('/es/') ? 'es' : 'en';
    const vuelve = [...otra.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g)]
      .some((m) => m[1].split('-')[0] === idiomaDeEsta
        && new URL(m[2]).pathname.replace(/\/$/, '') === r.replace(/\/$/, ''));
    if (!vuelve) noReciprocos.push(`${r} -> ${a.p} no apunta de vuelta con hreflang="${idiomaDeEsta}"`);
  }
}

// Y la comprobacion que faltaba del todo: que el idioma DECLARADO coincida con el
// idioma de la URL a la que apunta. Es la forma directa del mismo fallo, y no la
// caza la reciprocidad porque un error simetrico se valida a si mismo.
const idiomaMentido = [];
for (const rel of htmls) {
  const html = await fs.readFile(path.join(DIST, rel), 'utf8');
  for (const m of html.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g)) {
    const lang = m[1].split('-')[0];
    if (lang === 'x') continue; // x-default no declara idioma
    const destino = new URL(m[2]).pathname;
    const idiomaDelDestino = destino === '/es/' || destino.startsWith('/es/') ? 'es' : 'en';
    if (lang !== idiomaDelDestino) {
      idiomaMentido.push(`${rel}: hreflang="${m[1]}" apunta a ${destino}, que es ${idiomaDelDestino}`);
    }
  }
}

decir(rotos.length === 0, 'ningun hreflang apunta a una pagina que no existe', rotos);
decir(noReciprocos.length === 0, 'todo par de hreflang es reciproco Y con el idioma correcto', noReciprocos);
decir(
  idiomaMentido.length === 0,
  'ningun hreflang declara un idioma distinto del de la URL a la que apunta',
  idiomaMentido,
);

// --- el selector de idioma lleva de verdad al otro idioma -------------------
//
// EL FALLO QUE ESTO IMPIDE. `enlazarEnEspanol()` (astro.config.mjs) reescribe todos
// los href="/..." de las paginas /es/ a su version espanola, para que el sitio en
// español no saque al visitante de su idioma al primer clic. Son ~7.000 enlaces y
// para todos es lo correcto — menos para UNO. El selector de idioma es el unico
// control del sitio cuyo proposito es SALIR del idioma actual, y la reescritura lo
// apuntaba al español: en las 105 paginas de /es/, la opcion «English» llevaba a la
// pagina española. Se entraba al español y no se salia.
//
// POR QUE NINGUNA PUERTA LO VIO, y por eso esta comprobacion mira el DESTINO y no la
// forma: check:enlaces solo exige que el href apunte a una pagina que existe, y
// /es/products/ existe. El enlace estaba sano; lo que estaba mal era a donde iba.
// Y el hreflang del <head> se salvo de casualidad, porque sus href son absolutos y
// aquel regex solo captura los que empiezan por «/».
const selectorMal = [];
const sinBloque = [];
const sinOpcionViva = [];
for (const rel of htmls) {
  const html = await fs.readFile(path.join(DIST, rel), 'utf8');
  const bloque = html.match(/<ul class="idioma-lista"[\s\S]*?<\/ul>/)?.[0];
  // Se ACUMULA en vez de saltar. Un `continue` hace que esta puerta falle ABIERTA:
  // el dia que cambie el markup, deja de encontrar bloques, no comprueba nada y sale
  // en verde — justo cuando la proteccion del build tambien se ha desarmado.
  if (!bloque) { sinBloque.push(rel); continue; }

  const esPaginaEs = ruta(rel).startsWith('/es/') || ruta(rel) === '/es/';
  const opciones = [...bloque.matchAll(/<a href="([^"]+)"[^>]*lang="(en|es)"/g)]
    .map((m) => ({ href: m[1], lang: m[2] }));

  for (const o of opciones) {
    const destinoEsEspanol = o.href === '/es/' || o.href.startsWith('/es/');
    // La regla, en una linea: la opcion de un idioma tiene que llevar a una URL DE
    // ese idioma. Da igual en que pagina estemos.
    if (o.lang === 'es' && !destinoEsEspanol) {
      selectorMal.push(`${rel}: la opcion «Español» va a ${o.href}`);
    }
    if (o.lang === 'en' && destinoEsEspanol) {
      selectorMal.push(`${rel}: la opcion «English» va a ${o.href}`);
    }
  }

  // Y que quede al menos una salida viva: si las dos opciones son <span> no
  // disponible, el selector es un adorno.
  const otroIdioma = esPaginaEs ? 'en' : 'es';
  const hayEnlaceAlOtro = opciones.some((o) => o.lang === otroIdioma);
  const hayAvisoDelOtro = new RegExp(`no-disponible" lang="${otroIdioma}"`).test(bloque);
  if (!hayEnlaceAlOtro && !hayAvisoDelOtro) {
    sinOpcionViva.push(`${rel}: ni enlace ni aviso para «${otroIdioma}»`);
  }
}
decir(
  selectorMal.length === 0,
  'cada opcion del selector lleva a una URL de SU idioma',
  selectorMal,
);
decir(
  sinBloque.length === 0,
  `las ${htmls.length} paginas montan el selector de idioma`,
  sinBloque,
);
decir(
  sinOpcionViva.length === 0,
  'el selector siempre ofrece el otro idioma: enlace, o aviso de no disponible',
  sinOpcionViva,
);

// Un <a> sin href es un control muerto: parece pulsable, no lleva a ningun sitio y
// sale del orden de tabulacion, asi que las flechas del selector se saltan una
// opcion sin explicar por que.
const anclasMuertas = [];
for (const rel of htmls) {
  const html = await fs.readFile(path.join(DIST, rel), 'utf8');
  const bloque = html.match(/<ul class="idioma-lista"[\s\S]*?<\/ul>/)?.[0];
  if (bloque && /<a(?![^>]*\shref=)[^>]*class="[^"]*idioma-opcion/.test(bloque)) {
    anclasMuertas.push(rel);
  }
}
decir(anclasMuertas.length === 0, 'ninguna opcion es un <a> sin href', anclasMuertas);

// --- bloques compartidos entre los dos idiomas ------------------------------
//
// CtaFinal.astro cerraba las 27 paginas del blog español —el indice, las 5
// categorias y los 21 articulos, que son las que reciben el trafico organico— con
// un bloque INGLES entero: titular, parrafo y los dos botones. Estaba cableado en
// el componente, que sirve los dos idiomas desde el mismo fichero.
//
// La reescritura de enlaces lo empeoro en un sentido concreto: antes un boton «Get
// A Quote» llevaba al formulario ingles —coherente aunque sin traducir—, despues
// apunta al formulario ESPAÑOL, asi que el visitante cambiaba de idioma a mitad de
// conversion.
//
// Se comprueba contra la GEMELA inglesa y no contra una lista de cadenas: cualquier
// bloque compartido que alguien añada mañana entra solo.
const ctaIngles = [];
for (const rel of es) {
  const html = await fs.readFile(path.join(DIST, rel), 'utf8');
  const i = html.indexOf('f00e2efe');
  if (i === -1) continue; // esa pagina no monta el CTA
  const bloque = html.slice(i, i + 1200);
  const titular = bloque.match(/<h2>([^<]+)<\/h2>/)?.[1]?.trim();
  if (titular && DIC[titular]) ctaIngles.push(`${rel}: «${titular}»`);
}
decir(
  ctaIngles.length === 0,
  'el CTA final del blog esta traducido en las paginas /es/',
  ctaIngles,
);

// --- texto visible que NO vive en un nodo de texto --------------------------
//
// `traducirHtml` sustituia solo nodos de texto, asi que todo lo visible que vive en
// un ATRIBUTO se quedaba en ingles. Medido antes del arreglo, en /es/: el boton de
// las dos paginas de captacion decia «Request Estimate» y «Submit Inquiry», mas 7
// placeholders, 6 aria-label y el «Please wait...» del envio. Las traducciones ya
// estaban escritas en los diccionarios; no se aplicaban.
//
// Es un fallo que no rompe nada y por eso duraba: la pagina carga, el formulario
// funciona, y solo lo ve quien lee español.
const VISIBLES = ['placeholder', 'aria-label', 'data-wait'];
const enIngles = [];
for (const rel of es) {
  const html = await fs.readFile(path.join(DIST, rel), 'utf8');
  for (const attr of VISIBLES) {
    for (const [, v] of html.matchAll(new RegExp(`${attr}="([^"]+)"`, 'g'))) {
      if (DIC[v.trim()]) enIngles.push(`${rel}: ${attr}="${v}"`);
    }
  }
  // El value de un submit es la ETIQUETA del boton, no un dato.
  for (const [, attrs] of html.matchAll(/<input\s([^>]*type="submit"[^>]*)>/g)) {
    const v = attrs.match(/value="([^"]+)"/)?.[1];
    if (v && DIC[v.trim()]) enIngles.push(`${rel}: boton value="${v}"`);
  }
}
decir(enIngles.length === 0, 'ningun atributo visible se queda en ingles en /es/', enIngles);

// Y LA MITAD QUE PROTEGE LOS DATOS. El `value` de un <option> es lo que se ENVIA y
// lo que acaba en el correo al despacho: tiene que ser identico al de la pagina
// inglesa. Si se tradujera, los leads en español llegarian con el producto en
// español y los ingleses en ingles — dos vocabularios para la misma cosa en la
// bandeja de quien tiene que llamar, y ningun informe cuadraria nunca.
const valoresDivergentes = [];
for (const rel of es) {
  const relEn = rel.replace(/^es\//, '');
  const [hEs, hEn] = await Promise.all([
    fs.readFile(path.join(DIST, rel), 'utf8'),
    fs.readFile(path.join(DIST, relEn), 'utf8').catch(() => null),
  ]);
  if (!hEn) continue;
  const opciones = (h) => [...h.matchAll(/<option value="([^"]*)"/g)].map((m) => m[1]).join('|');
  if (opciones(hEs) !== opciones(hEn)) {
    valoresDivergentes.push(`${rel}\n           es: ${opciones(hEs).slice(0, 90)}\n           en: ${opciones(hEn).slice(0, 90)}`);
  }
}
decir(
  valoresDivergentes.length === 0,
  'los value de los <option> son identicos en EN y ES (es el dato que se envia)',
  valoresDivergentes,
);

// --- los ATRIBUTOS visibles, que hasta ahora no miraba nadie -----------------
//
// EL AGUJERO, MEDIDO. `traducirHtml` SI traduce `alt`, `aria-label` y `placeholder`
// (src/i18n/index.ts), pero por coincidencia EXACTA con la cadena inglesa: lo que no
// encuentra lo deja en ingles y NO lo mete en `faltan`. Y `faltan` es lo unico que
// alimenta la cobertura de mas arriba, que ademas solo cuenta nodos de texto.
// Resultado: un `alt` sin par se publica en ingles en /es/ y las dos puertas que
// podrian verlo pasan en verde — `check:seo` porque solo exige que el atributo
// EXISTA, y esta porque no miraba atributos. Es el A1 de F4a-veracidad.md.
//
// SE COMPARA CONTRA LA GEMELA INGLESA, no contra el diccionario: la pregunta no es
// «¿existe traduccion?» sino «¿se aplico?». Un atributo que sale IGUAL en las dos
// paginas y parece prosa inglesa es un atributo sin traducir.
//
// ───────────────────────────────────────────────────────────────────────────────
// POR QUE LA PUERTA DURA ES SOLO EL CUERPO DE /es/services/ Y EL RESTO ES CENSO
//
// Cuando se escribio esto habia 313 cadenas unicas sin traducir en las 108 paginas
// de /es/. Las 73 de los cuerpos de servicio se arreglaron en esta tanda y son las
// que aqui se exigen a cero. Las demas viven en el menu mega, el pie y las secciones
// que esta tanda no toca (blog, proyectos, contratistas, productos…), y ponerlas en
// verde no es trabajo de aqui.
//
// La alternativa mala habria sido no medirlas: entonces «el sitio esta traducido»
// vuelve a pasar por cierto. Se cuentan, se imprimen por seccion y quedan escritas.
// La alternativa peor habria sido una lista de 240 excepciones que nadie relee.
const ATRIBUTOS = ['alt', 'aria-label', 'placeholder'];
const NO_SE_TRADUCEN = [
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/,                    // correo
  /^\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/,         // telefono
  /^https?:\/\//,                                   // URL
  /^(Pergola Plus Florida|Pergola Plus Corp\.|FORTE Plus|Sukkha 3000|Senavia Corp\.)$/,
];

/** Los atributos visibles de un HTML, sin repetir. */
const atributosDe = (html) => {
  const v = new Set();
  for (const etiqueta of html.match(/<[a-z][a-z0-9]*\s[^>]*>/gi) ?? []) {
    for (const a of ATRIBUTOS) {
      const m = etiqueta.match(new RegExp(`\\s${a}="([^"]+)"`));
      if (m) v.add(m[1]);
    }
  }
  return v;
};

/**
 * El cuerpo: entre el ultimo `</nav>` y el `<footer`.
 *
 * El menu mega y el pie son IDENTICOS en las 217 paginas, asi que un `alt` suyo sin
 * traducir no es un defecto de la pagina de servicio: es uno del armazon, y sale 108
 * veces en el censo. Mezclarlos haria imposible exigir cero en ningun sitio.
 */
const soloCuerpo = (html) => {
  const a = html.lastIndexOf('</nav>');
  const b = html.lastIndexOf('<footer');
  return a >= 0 && b > a ? html.slice(a, b) : html;
};

const quedaEnIngles = async (rel, recorte) => {
  const relEn = rel.replace(/^es\//, '');
  const [hEs, hEn] = await Promise.all([
    fs.readFile(path.join(DIST, rel), 'utf8'),
    fs.readFile(path.join(DIST, relEn), 'utf8').catch(() => null),
  ]);
  if (!hEn) return null;
  const ingles = atributosDe(recorte(hEn));
  const fuera = [];
  let mirados = 0;
  for (const v of atributosDe(recorte(hEs))) {
    mirados++;
    // Prosa: 4+ letras seguidas y al menos dos palabras. Un «FORTE» o un «2025» no.
    if (!/[a-z]{4}/i.test(v) || v.trim().split(/\s+/).length < 2) continue;
    if (NO_SE_TRADUCEN.some((re) => re.test(v.trim()))) continue;
    if (!ingles.has(v)) continue;               // distinto del ingles: esta traducido
    fuera.push(v);
  }
  return { fuera, mirados };
};

// 1. La puerta dura: el cuerpo de las siete paginas de servicio, a cero.
const servicios = es.filter((rel) => ruta(rel).startsWith('/es/services/') && ruta(rel) !== '/es/services/');
const sinTraducir = [];
let atrsMirados = 0;
for (const rel of servicios) {
  const r = await quedaEnIngles(rel, soloCuerpo);
  if (!r) continue;
  atrsMirados += r.mirados;
  for (const v of r.fuera) sinTraducir.push(`${ruta(rel)}  "${v.slice(0, 74)}${v.length > 74 ? '…' : ''}"`);
}
// Autocomprobacion: si el extractor dejara de casar el markup, la lista saldria vacia
// y esto pasaria en verde sin haber mirado un solo atributo.
decir(servicios.length === 7 && atrsMirados > 100,
  `${atrsMirados} atributos mirados en el cuerpo de ${servicios.length} paginas /es/services/`,
  ['sin esto, una lista vacia significaria «no he extraido nada», no «esta todo traducido»']);
decir(sinTraducir.length === 0,
  'ningun alt/aria-label/placeholder del cuerpo de /es/services/ se queda en ingles',
  sinTraducir);

// 2. El censo del resto. NO es puerta: es el numero que impide que «el sitio esta
//    traducido» vuelva a pasar por cierto.
const censo = {};
const unicasFuera = new Set();
for (const rel of es) {
  if (servicios.includes(rel)) continue;
  const r = await quedaEnIngles(rel, (h) => h);
  if (!r || !r.fuera.length) continue;
  const seccion = ruta(rel).split('/')[2] || '(home)';
  censo[seccion] = (censo[seccion] ?? 0) + r.fuera.length;
  for (const v of r.fuera) unicasFuera.add(v);
}
if (unicasFuera.size) {
  const orden = Object.entries(censo).sort((a, b) => b[1] - a[1]);
  console.log(`\n  ---  ${unicasFuera.size} cadenas unicas siguen en ingles en atributos de /es/, FUERA de esta puerta`);
  console.log(`         (menu mega y pie incluidos, que salen en las ${es.length} paginas)`);
  for (const [k, n] of orden) console.log(`         ${String(n).padStart(4)}  /es/${k}`);
  console.log('         Cerrarlo es una tanda propia. Mientras tanto, esta contado.');
}

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
