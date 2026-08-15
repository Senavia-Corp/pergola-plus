/**
 * Puerta de los generadores.
 *
 *     npm run check:generadores
 *
 * src/contenido-migrado/ y buena parte de src/pages/ son SALIDA GENERADA de
 * scripts/generar-paginas.mjs y scripts/generar-detalle.mjs. Esa salida puede
 * derivar de sus generadores de dos formas distintas, y la segunda es la que se
 * nos colo:
 *
 *   1. DERIVA DE CONTENIDO — alguien edita un fragmento a mano y el siguiente
 *      regenerado lo revierte. Paso con la retirada del widget muerto de Google
 *      Reviews: 40 ficheros editados a mano que un `node generar-paginas.mjs`
 *      deshizo. Hubo que rehacerlo dentro de transformar.mjs (ELFSIGHT_RESENAS).
 *
 *   2. DERIVA DE FUENTE — el generador no arranca, o arranca leyendo de un sitio
 *      que no es el del repo. Las capturas del vivo vivieron en /tmp, en el
 *      scratchpad de una sesion muerta; al traerlas a docs/vivo se repunto
 *      auditar-paridad.mjs pero se olvidaron generar-paginas, generar-detalle y
 *      derivar-plantilla.
 *
 * Por que hacen falta las dos comprobaciones: una puerta que solo diffee
 * fragmentos NO habria cazado el caso 2. Mientras /tmp existiera, el diff salia
 * vacio y todo parecia sano — y el reparto era el peor posible, porque la
 * auditoria de paridad seguia en verde leyendo del repo mientras regenerar
 * quedaba imposible. El sintoma que avisa desaparecia y el fallo se quedaba.
 *
 * Por eso esto AFIRMA DE DONDE HA LEIDO antes de comparar nada.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const ejecutar = promisify(execFile);
const RAIZ = path.resolve(import.meta.dirname, '..');

/** Rutas que la salida generada ocupa. Es lo que se regenera y se compara. */
const SALIDA = ['src/contenido-migrado', 'src/pages'];

/** Los generadores que producen esa salida, en el orden en que hay que correrlos. */
const GENERADORES = ['scripts/generar-paginas.mjs', 'scripts/generar-detalle.mjs'];

/** Scripts que leen las capturas del vivo. Todos deben apuntar DENTRO del repo. */
const LECTORES_DE_VIVO = [
  'scripts/auditar-paridad.mjs',
  'scripts/generar-paginas.mjs',
  'scripts/generar-detalle.mjs',
  'scripts/derivar-plantilla.mjs',
];

let fallos = 0;
const decir = (ok, texto) => {
  console.log(`  ${ok ? 'ok  ' : 'FALLO'}  ${texto}`);
  if (!ok) fallos++;
};

const git = (args) => ejecutar('git', args, { cwd: RAIZ, maxBuffer: 64 * 1024 * 1024 });

// ---------------------------------------------------------------- 1. la fuente
console.log('de donde leen los generadores');

for (const rel of LECTORES_DE_VIVO) {
  const fuente = await fs.readFile(path.join(RAIZ, rel), 'utf8');
  const decl = fuente.match(/^const VIVO = (.+);$/m)?.[1] ?? '';
  // Lo que se exige es que la ruta se construya sobre RAIZ, no que sea una
  // cadena concreta: asi sigue valiendo si manana se mueve dentro del repo.
  decir(decl.includes('RAIZ'), `${rel}: VIVO se construye sobre la raiz del repo${decl ? '' : ' (no encontrado)'}`);
  decir(!/\/tmp|scratchpad/.test(decl), `${rel}: VIVO no apunta a /tmp`);
}

const vivo = path.join(RAIZ, 'docs/vivo');
let capturas = [];
try {
  capturas = (await fs.readdir(vivo)).filter((f) => f.endsWith('.html'));
} catch {
  /* se reporta abajo */
}
decir(capturas.length === 100, `docs/vivo tiene las 100 capturas (tiene ${capturas.length})`);

// Las fuentes externas no versionadas no son un fallo por si mismas —el export
// de Webflow vive fuera del repo a proposito— pero SI lo es no poder decir si la
// comprobacion de abajo es valida. Una puerta que pasa porque no pudo ejecutar
// es peor que no tenerla.
const externas = [...new Set(
  (await Promise.all(GENERADORES.concat('scripts/derivar-plantilla.mjs').map((rel) =>
    fs.readFile(path.join(RAIZ, rel), 'utf8'))))
    .flatMap((s) => [...s.matchAll(/^const (?:EXPORT|EXPORT_CMS) = '([^']+)';$/gm)].map((m) => m[1])),
)];

let faltaAlguna = false;
for (const ruta of externas) {
  const hay = await fs.access(ruta).then(() => true, () => false);
  if (!hay) faltaAlguna = true;
  console.log(`  ${hay ? 'ok  ' : 'AUSENTE'}  fuente externa: ${ruta}`);
}

// --------------------------------------------------- 2. el contenido generado
console.log('\nla salida coincide con lo que producen los generadores');

const { stdout: sucio } = await git(['status', '--porcelain', '--', ...SALIDA]);
if (sucio.trim()) {
  decir(false, 'la salida generada tiene cambios sin comitear: no se puede comparar');
  console.log('        comitealos o descartalos y vuelve a ejecutar:');
  for (const l of sucio.trim().split('\n').slice(0, 8)) console.log(`          ${l}`);
} else if (faltaAlguna) {
  decir(false, 'falta una fuente externa: NO se ha podido regenerar, la comparacion no vale');
} else {
  try {
    for (const gen of GENERADORES) await ejecutar('node', [gen], { cwd: RAIZ, maxBuffer: 64 * 1024 * 1024 });
    const { stdout: diff } = await git(['diff', '--name-only', '--', ...SALIDA]);
    const derivados = diff.trim() ? diff.trim().split('\n') : [];
    decir(derivados.length === 0, `regenerar no cambia nada (${derivados.length} ficheros divergen)`);
    for (const f of derivados.slice(0, 10)) console.log(`          ${f}`);
    if (derivados.length > 10) console.log(`          … y ${derivados.length - 10} mas`);
    if (derivados.length) {
      console.log('\n        Alguien edito salida generada a mano. El arreglo NO es volver a');
      console.log('        editarla: es llevar el cambio a scripts/lib/transformar.mjs, que es');
      console.log('        de donde sale ese markup.');
    }
  } catch (e) {
    decir(false, `un generador ha fallado: ${String(e.message).split('\n')[0]}`);
  } finally {
    // Se deja el arbol como estaba, pase lo que pase.
    await git(['checkout', '--', ...SALIDA]).catch(() => {});
  }
}

console.log(fallos ? `\n${fallos} fallo(s).` : '\nTodo correcto.');
process.exit(fallos ? 1 : 0);
