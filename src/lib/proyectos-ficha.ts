/**
 * Los proyectos que corresponden a una ficha de producto.
 *
 * DE DONDE SALE LA ETIQUETA, Y POR QUE NO SE PUEDE ARREGLAR EN EL REPO. Las
 * etiquetas de producto de los 13 proyectos viven dentro de
 * `src/contenido-migrado/estaticas/project-gallery.html`, que es SALIDA GENERADA:
 * `scripts/generar-paginas.mjs` lo reescribe copiando el sitio Webflow en vivo y
 * `check:generadores` exige diff cero. Retocar una etiqueta a mano ahi dura hasta la
 * siguiente pasada. Las dos vias estables son corregirlo en el CMS de Webflow, o
 * declararlo en `etiquetas:` de `scripts/lib/proyectos-destacados.mjs` (que es la via
 * sancionada para los proyectos que no vienen del CMS).
 *
 * ESTADO MEDIDO HOY, 28-ago-2026: los 13 proyectos estan etiquetados 9 «Solid Roof
 * Pergolas», 2 «Cabanas», 1 «Sukkah» y 1 «Aluminum Carports». NINGUNO lleva
 * «Motorized Louvered Pergolas», asi que la seccion no renderiza en la ficha de
 * lamas. No es una ausencia, es un error de etiquetado: el proyecto
 * `forte-pergola-with-outdoor-kitchen-at-elan-polo-club` se describe a si mismo como
 * «freestanding aluminum pergola with louvered and solid roof sections». Lo que hay
 * que pedirle al cliente no es un proyecto nuevo, es que revise una etiqueta.
 *
 * SIN ESTADO VACIO. Cero proyectos = cero markup. Ni «proximamente», ni tarjeta
 * esqueleto, ni caso inventado. Es la misma regla que ya lleva escrita
 * `src/components/ReseñasGoogle.astro` para las reseñas, y por el mismo motivo: un
 * caso de estudio inventado en el sitio de un contratista con licencia no es un
 * detalle de maquetacion.
 */

/** La etiqueta del CMS que corresponde a cada ficha de producto. */
export const ETIQUETA_DE_FICHA: Record<string, string> = {
  'motorized-louvered-pergolas': 'Motorized Louvered Pergolas',
  'solid-roof-pergolas': 'Solid Roof Pergolas',
  cabanas: 'Cabanas',
  carports: 'Aluminum Carports',
  sukkha: 'Sukkah',
};

export interface TarjetaProyecto {
  slug: string;
  imagen: string;
  alt: string;
  titulo: string;
  texto: string;
  etiquetas: string[];
}

/** Apertura de cada tarjeta en la rejilla de /project-gallery. */
const TARJETA = 'class="projects-grid-item w-dyn-item">';

/**
 * Lee las tarjetas de `estaticas/project-gallery.html`.
 *
 * Lanza si el markup deja de tener la forma esperada: una tarjeta que no se puede
 * leer tiene que romper el build, no desaparecer de la seccion en silencio. Es la
 * misma regla que `partirTrasFaq`.
 */
/**
 * Entidades HTML -> texto.
 *
 * Los campos se sacan con expresion regular del HTML CRUDO de la galeria, asi que
 * llegan tal cual: `ECLIPSE Cabanas &amp; FORTE Pergola`. Astro los vuelve a escapar
 * al pintarlos con `{t.titulo}` —`&amp;amp;`— y lo que se ve es `&amp;`; con el
 * `text-transform: capitalize` de `.projects-card-h3` encima, `&Amp;`. Salio mirando
 * la captura de §9, no de una puerta: tres tarjetas de las diez lo llevaban.
 *
 * La misma correccion que hace `[slug].astro` con el <h1> del fragmento, y por lo
 * mismo: quien lee HTML con regex tiene que deshacer el escapado a mano.
 */
const decodificar = (s: string) => s
  .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
  .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCharCode(parseInt(n, 16)))
  .replace(/&nbsp;/g, '\u00a0')
  .replace(/&quot;/g, '"')
  .replace(/&lt;/g, '<')
  .replace(/&gt;/g, '>')
  // `&amp;` va LA ULTIMA: al reves, `&amp;lt;` se convertiria en `<`.
  .replace(/&amp;/g, '&');

export function tarjetasProyecto(html: string): TarjetaProyecto[] {
  const trozos = html.split(TARJETA).slice(1);
  if (!trozos.length) {
    throw new Error('[proyectos-ficha] project-gallery.html no tiene ninguna tarjeta: el markup ha cambiado');
  }
  return trozos.map((trozo, i) => {
    const campo = (re: RegExp, nombre: string) => {
      const v = trozo.match(re)?.[1];
      if (v == null) throw new Error(`[proyectos-ficha] la tarjeta ${i + 1} no tiene ${nombre}`);
      return v;
    };
    return {
      slug: campo(/href="\/project\/([^"]+)"/, 'slug'),
      imagen: campo(/<img src="([^"]+)"[^>]*class="projects-card-image"/, 'imagen'),
      alt: decodificar(campo(/<img[^>]*\salt="([^"]*)"[^>]*class="projects-card-image"/, 'alt')),
      titulo: decodificar(campo(/<h3 class="projects-card-h3">([\s\S]*?)<\/h3>/, 'titulo')),
      texto: decodificar(campo(/<div class="projects-card-text">([\s\S]*?)<\/div>/, 'texto')),
      etiquetas: [...trozo.matchAll(/<div class="box-detail-projects"><div>([^<]*)<\/div>/g)].map((m) => decodificar(m[1]!)),
    };
  });
}

/** Las tarjetas etiquetadas para una ficha. Vacio si no hay ninguna, que es lo normal. */
export function proyectosDeFicha(html: string, slug: string): TarjetaProyecto[] {
  const etiqueta = ETIQUETA_DE_FICHA[slug];
  if (!etiqueta) return [];
  return tarjetasProyecto(html).filter((t) => t.etiquetas.includes(etiqueta));
}
