#!/usr/bin/env node
/**
 * Puerta del estimador. Sobre dist/, DESPUES de `npm run build`.
 *
 *     npm run check:estimador
 *
 * QUE SE ROMPIO Y COMO SE VEIA
 *
 * src/components/Estimador.astro:316 llego a contener este texto, literal:
 *
 *     <style> de abajo.
 *
 * Es un comentario partido por la mitad al pegar una copia del componente durante
 * el refactor de i18n. Y `<style>` es un elemento de TEXTO CRUDO: el parser abre
 * ahi una hoja de estilos y no la cierra hasta el siguiente `</style>`, que estaba
 * 624 lineas mas abajo. Todo lo de en medio —una copia obsoleta entera del
 * componente Y la hoja de estilos real— entro al parser CSS como una sola regla
 * invalida, y Astro descarto el bloque.
 *
 * Sin un error. Sin un aviso. El build seguia en verde.
 *
 * Lo que se servia: las dos paginas del estimador con su markup intacto —
 * `est-opcion` aparecia 43 veces en el HTML, con su atributo de scope— y CERO
 * reglas para pintarlo. Radios y casillas desnudos, sin tarjetas, sin panel, sin
 * rejilla. La herramienta de precios del sitio, sin diseno, durante semanas.
 *
 * POR QUE HACIA FALTA UNA PUERTA NUEVA
 *
 * Ninguna de las 13 anteriores podia verlo. Miran enlaces, imagenes, paridad de
 * traduccion, formularios, correo... ninguna mira si el CSS de un componente
 * propio sobrevive al build. Y el sintoma no es un error ni un hueco: es una
 * pagina que carga perfecta y se ve mal, que es justo lo que un build no sabe
 * distinguir de una pagina que carga perfecta y se ve bien.
 *
 * QUE SE COMPRUEBA AQUI Y QUE NO
 *
 * Que las reglas llegan. No que sean bonitas: eso se mira en el navegador.
 *
 * La comprobacion del cid es la que mata el fallo de raiz. Astro le pone a cada
 * componente con estilos un `data-astro-cid-XXXX` en el HTML y lo repite en sus
 * selectores del CSS. Cuando el bloque se descarta, el HTML conserva el atributo
 * y el CSS deja de mencionarlo: es exactamente la huella que dejaba este fallo, y
 * no hay forma de fingirla.
 *
 * ponytail: sin navegador, como el resto de puertas del repo.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { raizHtml } from './lib/dist.mjs';

const DIST = await raizHtml();

let fallos = 0;
const decir = (ok, msg, detalle = []) => {
  console.log(`  ${ok ? 'ok   ' : 'FALLO'} ${msg}`);
  if (!ok) {
    fallos++;
    for (const d of detalle.slice(0, 10)) console.log(`         ${d}`);
    if (detalle.length > 10) console.log(`         ... y ${detalle.length - 10} mas`);
  }
};

console.log('\n[estimador] el CSS del componente llega al build\n');

// --- 1. Afirmar antes de comparar -------------------------------------------
//
// Una puerta que no encuentra su pagina no falla: se queda sin nada que mirar y
// sale en verde. Misma leccion que raizHtml() en lib/dist.mjs.
const PAGINAS = ['project-estimator/index.html', 'es/project-estimator/index.html'];

const htmls = new Map();
for (const rel of PAGINAS) {
  try {
    htmls.set(rel, await fs.readFile(path.join(DIST, rel), 'utf8'));
  } catch {
    decir(false, `${rel} no existe en dist/`);
  }
}
if (htmls.size !== PAGINAS.length) {
  console.log(`\n${fallos} fallo(s).`);
  process.exit(1);
}
decir(true, `las ${PAGINAS.length} paginas del estimador (EN + ES) estan construidas`);

// --- 2. El CSS del build, entero --------------------------------------------
const css = (
  await Promise.all(
    (await fs.readdir(path.join(DIST, '_astro')))
      .filter((f) => f.endsWith('.css'))
      .map((f) => fs.readFile(path.join(DIST, '_astro', f), 'utf8')),
  )
).join('\n');

// --- 3. Cuantas clases .est-* sobreviven -------------------------------------
//
// Un recuento minimo, no "existe alguna regla": una sola superviviente daria
// verde con la hoja entera perdida. El fallo real es binario —o llega el bloque
// completo o no llega ninguno— asi que el suelo solo tiene que estar por encima
// de cero y por debajo de lo que hay. Hoy son ~27; 20 deja margen para reordenar
// la hoja sin que la puerta se vuelva un incordio.
const SUELO = 20;
const clases = new Set([...css.matchAll(/\.(est-[a-z0-9-]+)/g)].map((m) => m[1]));
decir(
  clases.size >= SUELO,
  `el CSS del build declara ${clases.size} clases .est-* distintas (minimo ${SUELO})`,
  clases.size === 0
    ? ['ni una: el bloque <style> del componente se ha vuelto a perder entero']
    : [`solo estas: ${[...clases].sort().join(', ')}`],
);

// --- 4. El cid del HTML aparece tambien en el CSS ----------------------------
//
// Esta es la que no se puede fingir. Si el HTML dice `data-astro-cid-7prbqr3b` y
// el CSS no lo menciona ni una vez, el componente tiene atributo de scope y no
// tiene con que emparejarlo: sus estilos no existen.
for (const [rel, html] of htmls) {
  const cids = new Set([...html.matchAll(/data-astro-cid-([a-z0-9]+)/g)].map((m) => m[1]));
  if (!cids.size) {
    decir(false, `${rel}: el HTML no lleva ningun data-astro-cid`, [
      'sin atributo de scope no hay componente con estilos propios en la pagina',
    ]);
    continue;
  }
  const huerfanos = [...cids].filter((c) => !css.includes(`data-astro-cid-${c}`));
  decir(
    huerfanos.length === 0,
    `${rel}: los ${cids.size} scopes del HTML tienen reglas en el CSS`,
    huerfanos.map((c) => `data-astro-cid-${c} esta en el HTML y NO en ningun CSS`),
  );
}

// --- 5. Las piezas que sostienen la pagina -----------------------------------
//
// Nombradas una a una porque cada una es un trozo de interfaz que desaparece en
// silencio: sin .est-opcion las tarjetas dejan de parecer pulsables, sin
// .est-panel el resultado deja de seguir al usuario, y sin .est-desglose el
// desglose se vuelve texto gris sobre el panel navy.
for (const clase of ['est-bloque', 'est-opcion', 'est-panel', 'est-resultado', 'est-desglose']) {
  decir(clases.has(clase), `.${clase} llega al CSS del build`);
}

// --- 5b. Las fotos declaran SUS DOS dimensiones ------------------------------
//
// El build hornea width/height en cada <img> midiendo el fichero, y el atributo
// `height` es una pista de presentacion: si ninguna regla de autor declara
// `height`, gana el atributo. Con la altura ya definida `aspect-ratio` no puede
// aplicar, y las fotos del paso 1 salian a 1406px de alto.
//
// Lo peor es donde NO se ve: en `npm run dev` los atributos no se hornean, asi que
// la pagina se ve perfecta y el fallo solo aparece en dist/ — es decir, en
// produccion. Es la misma familia que la regresion de CLS que documenta
// src/styles/imagenes.css: declarar una sola dimension y dejar que el navegador
// combine atributo y hoja.
const reglaFoto = css.match(/\.est-foto\[[^\]]*\]\{[^}]*\}/)?.[0] ?? '';
decir(
  /(^|;|\{)\s*height\s*:/.test(reglaFoto),
  '.est-foto declara height en CSS, para que el atributo horneado no mande',
  [reglaFoto || '(no hay regla .est-foto en el CSS del build)'],
);

const conFoto = [...(htmls.get(PAGINAS[0]) ?? '').matchAll(/<img[^>]*class="est-foto"[^>]*>/g)];
decir(
  conFoto.length > 0 && conFoto.every((m) => /width="\d+"/.test(m[0]) && /height="\d+"/.test(m[0])),
  `las ${conFoto.length} fotos del paso 1 llevan sus dimensiones horneadas`,
  conFoto.filter((m) => !/height="\d+"/.test(m[0])).map((m) => m[0].slice(0, 90)),
);

// --- 6. Las tarifas, afirmadas sobre el modulo real --------------------------
//
// Node 22.12+ ejecuta TypeScript quitando los tipos, asi que la puerta importa
// src/data/estimador.ts de verdad en vez de mirarlo como texto. Comprobar el
// fichero con expresiones regulares habria sido comprobar la forma de las comillas.
const D = await import('../src/data/estimador.ts');

const tarifas = [
  ...D.PRODUCTOS.map((p) => [`producto/${p.id}`, p.tarifa]),
  ...Object.entries(D.SUPERFICIES).map(([k, t]) => [`superficie/${k}`, t]),
  ...D.MEJORAS.map((m) => [`mejora/${m.id}`, m.tarifa]),
  ['ingenieria', D.INGENIERIA],
  ['waterfront', D.WATERFRONT],
].filter(([, t]) => t);

const sinNota = tarifas.filter(([, t]) => D.requiereFirma(t) && !t.nota?.trim());
decir(
  sinNota.length === 0,
  'toda tarifa que no es publicada dice de donde sale',
  sinNota.map(([d]) => `${d}: fuente distinta de 'publicada' y sin nota`),
);

const alReves = tarifas.filter(([, t]) => t.min > t.max);
decir(
  alReves.length === 0,
  'ninguna banda tiene el minimo por encima del maximo',
  alReves.map(([d, t]) => `${d}: ${t.min} > ${t.max}`),
);

// El comentario de POR_CONDADO afirma que el codigo postal no aporta un numero
// nuevo, solo dice donde de la banda publicada cae cada jurisdiccion. Si alguien
// sube un condado por encima del techo publicado, eso deja de ser cierto en
// silencio y la pagina pasa a ensenar una cifra que la guia no respalda.
const fuera = D.CONDADOS.filter((c) => c.min < D.INGENIERIA.min || c.max > D.INGENIERIA.max);
decir(
  fuera.length === 0,
  `los ${D.CONDADOS.length} condados caen dentro de la banda publicada de ingenieria`,
  fuera.map((c) => `${c.id}: ${c.min}-${c.max} se sale de ${D.INGENIERIA.min}-${D.INGENIERIA.max}`),
);

// condadoDe() por rangos de prefijo: los casos que importan, incluida la punta de
// cada rango y el ZIP que no es de aqui.
const CASOS = [
  ['33139', 'miami-dade'], // Miami Beach
  ['33010', 'miami-dade'], // primera del rango
  ['33299', 'miami-dade'], // ultima del rango
  ['33301', 'broward'], // Fort Lauderdale
  ['33432', 'palm-beach'], // Boca Raton
  ['33499', 'palm-beach'], // ultima del rango
  ['90210', null], // fuera del area de servicio
  ['', null], // campo vacio
  ['no soy un zip', null], // basura
];
const malos = CASOS.filter(([zip, esperado]) => D.condadoDe(zip) !== esperado);
decir(
  malos.length === 0,
  `condadoDe() acierta los ${CASOS.length} casos, incluidas las puntas de rango y la basura`,
  malos.map(([z, e]) => `"${z}" -> ${D.condadoDe(z)}, se esperaba ${e}`),
);

// Cada producto apunta a una pagina que existe. check:enlaces cubre los enlaces
// del HTML servido, pero un producto que nunca se llega a pintar —los de solo
// cotizacion, por ejemplo— no deja enlace que auditar.
const existe = async (href) =>
  fs
    .access(path.join(DIST, href.replace(/^\//, ''), 'index.html'))
    .then(() => true)
    .catch(() => false);
const rotos = (
  await Promise.all(D.PRODUCTOS.map(async (p) => ((await existe(p.href)) ? null : p)))
).filter(Boolean);
decir(
  rotos.length === 0,
  `los ${D.PRODUCTOS.length} productos apuntan a una pagina construida`,
  rotos.map((p) => `${p.id} -> ${p.href} no existe en dist/`),
);

// --- 7. Lo que falta por firmar ---------------------------------------------
//
// No es un fallo: es la lista, impresa en cada build para que no haya que
// reconstruirla a mano el dia que Pergola Plus pregunte que tiene que validar.
const pendientes = D.pendientesDeFirma();
if (pendientes.length) {
  console.log(`\n  ---   ${pendientes.length} tarifas pendientes de firma de Pergola Plus:`);
  for (const { donde, tarifa } of pendientes) {
    console.log(`         ${donde.padEnd(28)} ${tarifa.min}-${tarifa.max}  (${tarifa.fuente})`);
  }
}

if (fallos) {
  console.log(`\n${fallos} fallo(s).`);
  process.exit(1);
}
console.log('\nsin fallos.\n');
