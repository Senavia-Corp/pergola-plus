/**
 * El blog en español: rotulos, categorias, metadatos de cada articulo y el registro
 * de los cuerpos traducidos.
 *
 * TRES PIEZAS Y UNA REGLA
 *
 *  1. `TEXTOS` — los rotulos de la interfaz (migas, "min de lectura", "Seguir
 *     leyendo"...). Los comparten la tarjeta, el listado y el detalle.
 *  2. `POSTS_ES` — titulo, resumen y `<title>` de cada articulo. Es lo que sale en
 *     las tarjetas, en el "anterior/siguiente" y en los relacionados.
 *  3. `CUERPOS_ES` — el texto del articulo. NO se escribe aqui: cada uno vive en
 *     `src/i18n/posts/<slug>.ts` y lo GENERA `scripts/emparejar-traduccion.mjs` a
 *     partir de `<slug>.txt`, para que las claves inglesas no se transcriban a mano.
 *
 * La regla: un articulo solo existe en /es/ si tiene LAS DOS COSAS, metadatos y
 * cuerpo. Con metadatos pero sin cuerpo saldria una pagina con el titular en español
 * y el articulo entero en ingles, que es peor que no tenerla.
 */
import type { Post, Categoria } from '../lib/blog';

export type Idioma = 'en' | 'es';

export interface TextosBlog {
  todo: string;
  minLectura: string;
  palabras: string;
  leerMas: string;
  enEstaPagina: string;
  seguirLeyendo: string;
  /** `{cat}` se sustituye por el nombre de la categoria. */
  masSobre: string;
  anterior: string;
  siguiente: string;
  migaHome: string;
  migaBlog: string;
  navArticulos: string;
  etiquetaMigas: string;
}

export const TEXTOS: Record<Idioma, TextosBlog> = {
  en: {
    todo: 'All',
    minLectura: 'min read',
    palabras: 'words',
    leerMas: 'Read More',
    enEstaPagina: 'On this page',
    seguirLeyendo: 'Keep reading',
    masSobre: 'More on {cat}',
    anterior: 'Previous',
    siguiente: 'Next',
    migaHome: 'Home',
    migaBlog: 'Blog',
    navArticulos: 'More articles',
    etiquetaMigas: 'Breadcrumb',
  },
  es: {
    todo: 'Todo',
    minLectura: 'min de lectura',
    palabras: 'palabras',
    leerMas: 'Leer más',
    enEstaPagina: 'En esta página',
    seguirLeyendo: 'Seguir leyendo',
    masSobre: 'Más sobre {cat}',
    anterior: 'Anterior',
    siguiente: 'Siguiente',
    migaHome: 'Inicio',
    migaBlog: 'Blog',
    navArticulos: 'Más artículos',
    etiquetaMigas: 'Ruta de navegación',
  },
};

/** Las 5 categorias con articulos. Las 3 vacias del CMS no generan ruta. */
export const CATEGORIAS_ES: Record<string, string> = {
  'buying-guides-cost': 'Guías de compra y precios',
  'materials-engineering': 'Materiales e ingeniería',
  'outdoor-living-design': 'Diseño de exteriores',
  'pergolas-shade-systems': 'Pérgolas y sistemas de sombra',
  'maintenance-care': 'Mantenimiento y cuidado',
};

export interface CopyCategoriaEs {
  titulo: string;
  meta: string;
  intro: string;
}

export const COPY_CATEGORIAS_ES: Record<string, CopyCategoriaEs> = {
  'buying-guides-cost': {
    titulo: 'Guías de compra y precios de pérgolas en Florida',
    meta: 'Lo que cuesta una pérgola en el sur de Florida, qué entra en el precio y cómo comparar presupuestos.',
    intro:
      'Cuánto cuesta de verdad, qué entra en el precio y en qué se diferencian dos presupuestos que parecen iguales.',
  },
  'materials-engineering': {
    titulo: 'Materiales e ingeniería para el clima de Florida',
    meta: 'Aluminio, madera, cargas de viento y anclajes: qué aguanta en la costa del sur de Florida y por qué.',
    intro:
      'Aluminio o madera, cargas de viento, anclajes y acabados. Qué aguanta aquí, medido, y qué se degrada.',
  },
  'outdoor-living-design': {
    titulo: 'Diseño de exteriores en el sur de Florida',
    meta: 'Ideas y criterios de diseño para patios, piscinas y jardines en el sur de Florida.',
    intro:
      'Cómo se plantea un exterior que se usa todo el año: sombra, circulación, luz y lo que hace que apetezca salir.',
  },
  'pergolas-shade-systems': {
    titulo: 'Pérgolas y sistemas de sombra',
    meta: 'Pérgolas de lamas, techos macizos, cortinas y cerramientos: qué hace cada sistema y cuándo compensa.',
    intro:
      'Lamas motorizadas, techos macizos, policarbonato y cortinas. Qué hace cada sistema y cuándo compensa cada uno.',
  },
  'maintenance-care': {
    titulo: 'Mantenimiento de pérgolas en la costa de Florida',
    meta: 'Cómo mantener una pérgola como nueva en la costa de Florida: materiales, salitre y cuidados.',
    intro:
      'El salitre, la humedad y el sol no dan tregua. Qué aguanta con los años y qué hace falta para que siga como el primer día.',
  },
};

export interface PostEs {
  titulo: string;
  resumen: string;
  /** El `<title>` de la pagina. */
  tituloLargo: string;
  descripcionSeo: string;
}

/**
 * Metadatos de los 21 articulos.
 *
 * Los TITULARES no son traduccion literal: son el titular que escribiria alguien de
 * aqui. "How Much Does a Pergola Cost in South Florida?" en español no es "¿Cuánto
 * hace una pérgola coste...?", es "¿Cuánto cuesta una pérgola en el sur de Florida?".
 * Las cifras y los nombres propios se respetan tal cual.
 */
export const POSTS_ES: Record<string, PostEs> = {
  'pergola-cost-south-florida': {
    titulo: '¿Cuánto cuesta una pérgola en el sur de Florida?',
    resumen: 'Desglose de lo que cuesta una pérgola en el sur de Florida en 2026.',
    tituloLargo: '¿Cuánto cuesta una pérgola en el sur de Florida? 2026',
    descripcionSeo:
      'Lo que cuesta una pérgola de aluminio en el sur de Florida en 2026: tarifas por pie cuadrado, qué entra en el precio y qué lo dispara.',
  },
  'pergola-building-codes-broward-palm-beach': {
    titulo: 'Normativa de pérgolas en los condados de Broward y Palm Beach',
    resumen: 'Entender la normativa de pérgolas en Broward y Palm Beach.',
    tituloLargo: 'Normativa de pérgolas en Broward y Palm Beach | Guía 2026',
    descripcionSeo:
      'Qué exigen Broward y Palm Beach a una pérgola: cargas de viento, anclajes, retranqueos y la documentación que pide cada ayuntamiento.',
  },
  'design-build-pergola-process-south-florida': {
    titulo: 'El proceso de diseño y obra de una pérgola en el sur de Florida',
    resumen: 'Cómo funciona el proceso de diseño y obra en el sur de Florida.',
    tituloLargo: 'Diseño y obra de una pérgola en el sur de Florida | Guía 2026',
    descripcionSeo:
      'De la primera visita a la inspección final: las fases de un proyecto de pérgola en el sur de Florida y cuánto tarda cada una.',
  },
  'modern-outdoor-living-trends-in-south-florida': {
    titulo: 'Tendencias de exterior en el sur de Florida',
    resumen: 'Las tendencias de exterior que marcan 2026 en el sur de Florida.',
    tituloLargo: 'Tendencias de exterior en el sur de Florida | Guía de diseño 2026',
    descripcionSeo:
      'Lo que se está haciendo en 2026 en los exteriores del sur de Florida: sombra regulable, cocinas al aire libre y materiales que aguantan la costa.',
  },
  'pergola-permit-south-florida': {
    titulo: '¿Hace falta permiso para una pérgola en el sur de Florida?',
    resumen: 'Los permisos que necesita una pérgola en el sur de Florida, explicados.',
    tituloLargo: '¿Hace falta permiso para una pérgola en Florida? Guía 2026',
    descripcionSeo:
      'Cuándo lleva permiso una pérgola en el sur de Florida, qué documentación piden y qué pasa si se construye sin él.',
  },
  'hoa-rules-pergolas-south-florida': {
    titulo: 'Qué pide la comunidad de propietarios para una pérgola',
    resumen: 'Los requisitos de la comunidad para una pérgola, explicados.',
    tituloLargo: 'Pérgolas y comunidades de propietarios | Guía 2026',
    descripcionSeo:
      'Qué revisa el comité arquitectónico de una urbanización antes de aprobar una pérgola, y cómo llevar el expediente para que salga a la primera.',
  },
  'luxury-pergola-ideas-for-south-florida-backyards': {
    titulo: 'Ideas de pérgola para jardines del sur de Florida',
    resumen: 'Ideas de pérgola de gama alta para casas del sur de Florida.',
    tituloLargo: 'Ideas de pérgola para jardines del sur de Florida | Guía 2026',
    descripcionSeo:
      'Ideas de pérgola para jardines del sur de Florida: lamas motorizadas, cocinas exteriores, iluminación integrada y zonas de estar cubiertas.',
  },
  'plan-pergola-south-florida-backyard': {
    titulo: 'Cómo planificar una pérgola para su jardín',
    resumen: 'Guía paso a paso para planificar una pérgola en el sur de Florida.',
    tituloLargo: 'Cómo planificar una pérgola en el sur de Florida | Guía 2026',
    descripcionSeo:
      'Los pasos para planificar una pérgola en el sur de Florida: dónde ponerla, qué tamaño, qué permisos y cómo presupuestarla.',
  },
  'building-custom-pergola-south-florida': {
    titulo: 'Paso a paso: construir una pérgola a medida',
    resumen: 'Guía paso a paso para construir una pérgola en el sur de Florida.',
    tituloLargo: 'Construir una pérgola a medida en el sur de Florida | Guía 2026',
    descripcionSeo:
      'Cómo se construye una pérgola a medida en el sur de Florida, fase a fase: diseño, cálculo, permisos, cimentación y montaje.',
  },
  'poolside-pergola-ideas-for-florida-homes': {
    titulo: 'Ideas de pérgola junto a la piscina',
    resumen: 'Ideas de pérgola para la zona de piscina en casas de Florida.',
    tituloLargo: 'Ideas de pérgola junto a la piscina en Florida | 2026',
    descripcionSeo:
      'Ideas de pérgola para la zona de piscina en Florida: sombra donde hace falta, materiales que aguantan el cloro y el salitre, y zonas de estar.',
  },
  'how-long-pergola-installation-florida': {
    titulo: '¿Cuánto se tarda en instalar una pérgola en Florida?',
    resumen: 'Los plazos de instalación de una pérgola en el sur de Florida, explicados.',
    tituloLargo: '¿Cuánto se tarda en instalar una pérgola en Florida? Plazos 2026',
    descripcionSeo:
      'Cuánto tarda de verdad una pérgola en Florida: diseño, cálculo, permisos, fabricación y montaje, con los plazos de cada fase.',
  },
  'pergola-design-ideas-waterfront-properties': {
    titulo: 'Ideas de pérgola para casas frente al agua',
    resumen: 'Ideas de pérgola para casas frente al agua en Florida.',
    tituloLargo: 'Ideas de pérgola para casas frente al agua | Guía de Florida 2026',
    descripcionSeo:
      'Cómo se diseña una pérgola frente al agua en Florida: vistas, viento, salitre y los materiales que aguantan una parcela expuesta.',
  },
  'is-a-louvered-roof-pergola-worth-it-in-florida': {
    titulo: '¿Compensa una pérgola de techo de lamas en Florida?',
    resumen: '¿Compensan las pérgolas de lamas en el clima de Florida?',
    tituloLargo: '¿Compensa una pérgola de lamas en Florida? Guía 2026',
    descripcionSeo:
      'Qué aporta un techo de lamas motorizado en Florida frente a una pérgola fija, cuánto cuesta la diferencia y cuándo merece la pena.',
  },
  'aluminum-pergola-cost-boca-raton-vs-fort-lauderdale': {
    titulo: 'Precio de una pérgola de aluminio: Boca Raton frente a Fort Lauderdale',
    resumen: 'Comparativa de precios de pérgola de aluminio en Boca Raton y Fort Lauderdale.',
    tituloLargo: 'Pérgola de aluminio: Boca Raton frente a Fort Lauderdale | 2026',
    descripcionSeo:
      'Por qué la misma pérgola cuesta distinto en Boca Raton y en Fort Lauderdale: permisos, cargas de viento, acceso a la obra y acabados.',
  },
  'aluminum-vs-wood-pergolas-humid-climate': {
    titulo: 'Pérgolas de aluminio o de madera en clima húmedo',
    resumen: '¿Qué pérgola aguanta mejor el clima húmedo?',
    tituloLargo: 'Aluminio o madera en clima húmedo: qué aguanta mejor en Florida',
    descripcionSeo:
      'Aluminio frente a madera en el clima húmedo de Florida: durabilidad, mantenimiento, coste a diez años y qué le pasa a cada uno.',
  },
  'best-pergola-materials-coastal-florida': {
    titulo: 'Los mejores materiales para una pérgola en la costa',
    resumen: 'Los mejores materiales de pérgola para casas de costa en Florida.',
    tituloLargo: 'Mejores materiales de pérgola para la costa | Guía 2026',
    descripcionSeo:
      'Qué materiales aguantan el salitre, la humedad y el sol en la costa de Florida, y cuáles se degradan por muy bien que se instalen.',
  },
  'hurricane-resistant-pergolas-south-florida': {
    titulo: 'Pérgolas resistentes a huracanes: lo que hay que saber',
    resumen: '¿Qué hace que una pérgola resista de verdad un huracán en el sur de Florida?',
    tituloLargo: 'Pérgolas resistentes a huracanes en el sur de Florida | Guía 2026',
    descripcionSeo:
      'Qué hace que una pérgola aguante un huracán en el sur de Florida: cálculo, anclajes, homologaciones y lo que no basta con prometer.',
  },
  'best-outdoor-structures-rain-sun-florida': {
    titulo: 'Las mejores estructuras exteriores para el sol y la lluvia',
    resumen: 'Las mejores estructuras exteriores para el sol y la lluvia de Florida.',
    tituloLargo: 'Estructuras para el sol y la lluvia en Florida | Guía 2026',
    descripcionSeo:
      'Qué estructura exterior conviene en Florida según lo que le pida: sombra, lluvia, ventilación o poder cerrar el espacio del todo.',
  },
  'can-you-use-your-patio-year-round-in-south-florida': {
    titulo: '¿Se puede usar el patio todo el año en el sur de Florida?',
    resumen: 'Cómo hacer que su patio del sur de Florida se use los 365 días.',
    tituloLargo: '¿Se puede usar el patio todo el año en Florida? Guía 2026',
    descripcionSeo:
      'Qué hace falta para usar el patio los doce meses en el sur de Florida: sombra, lluvia, insectos, calor y ventilación, uno por uno.',
  },
  'add-shade-backyard-south-florida': {
    titulo: 'Cómo dar sombra a su jardín con el calor del sur de Florida',
    resumen: 'Soluciones de sombra para jardines del sur de Florida.',
    tituloLargo: 'Cómo dar sombra a un jardín en el sur de Florida | Guía 2026',
    descripcionSeo:
      'Las formas de dar sombra a un jardín en el sur de Florida, de la más barata a la más duradera, con lo que aporta y lo que cuesta cada una.',
  },
  'resort-style-backyard-boca-raton': {
    titulo: 'Cómo hacer de su jardín de Boca Raton un resort',
    resumen: 'Diseñe un jardín de estilo resort en Boca Raton.',
    tituloLargo: 'Un jardín de estilo resort en Boca Raton | Guía de diseño 2026',
    descripcionSeo:
      'Cómo se consigue en Boca Raton un jardín con aire de resort: zonas, sombra, agua, iluminación y los materiales que lo sostienen.',
  },
};

/**
 * Los cuerpos traducidos. Se recogen por glob para que añadir un articulo sea
 * generar su fichero y nada mas — sin una lista de imports que un dia se queda corta.
 */
const modulos = import.meta.glob<{ default: Record<string, string> }>('./posts/*.ts', {
  eager: true,
});

export const CUERPOS_ES: Record<string, Record<string, string>> = Object.fromEntries(
  Object.entries(modulos).map(([ruta, mod]) => [
    ruta.replace('./posts/', '').replace(/\.ts$/, ''),
    mod.default,
  ]),
);

/** Un articulo existe en /es/ solo si tiene metadatos Y cuerpo. */
export const traducidos = (slug: string) => Boolean(POSTS_ES[slug] && CUERPOS_ES[slug]);

/**
 * Ruta del articulo en el idioma pedido. El slug NO cambia.
 *
 * Si el articulo no esta traducido, la tarjeta española enlaza al INGLES. Es lo
 * honesto —el articulo existe, pero en ingles— y ademas lo unico que no da un 404:
 * apuntar a /es/post/<slug> de algo que no se genera es prometer una pagina que no
 * hay. `check:paginas` lo pilla, que es como salio esto.
 */
export const rutaPost = (slug: string, idioma: Idioma) =>
  idioma === 'es' && traducidos(slug) ? `/es/post/${slug}` : `/post/${slug}`;

export const rutaBlog = (idioma: Idioma) =>
  idioma === 'es' ? '/es/resources/blog' : '/resources/blog';

export const rutaCategoria = (slug: string, idioma: Idioma) =>
  idioma === 'es' ? `/es/resources/blog/${slug}` : `/resources/blog/${slug}`;

/**
 * El mismo `Post`, con lo que se lee traducido.
 *
 * Slug, imagenes, fechas, minutos y palabras NO se tocan: son los mismos datos, no
 * otra version del articulo. Un articulo sin traduccion sale tal cual en ingles, que
 * es lo que pasa con los relacionados mientras el blog este a medias.
 */
export function traducirPost(p: Post, idioma: Idioma): Post {
  if (idioma === 'en') return p;
  const t = POSTS_ES[p.slug];
  const cat = CATEGORIAS_ES[p.categoria.slug];
  if (!t && !cat) return p;
  return {
    ...p,
    titulo: t?.titulo ?? p.titulo,
    tituloLargo: t?.tituloLargo ?? p.tituloLargo,
    resumen: t?.resumen ?? p.resumen,
    descripcionSeo: t?.descripcionSeo ?? p.descripcionSeo,
    categoria: cat ? { ...p.categoria, nombre: cat } : p.categoria,
  };
}

export function traducirCategoria(c: Categoria, idioma: Idioma): Categoria {
  if (idioma === 'en') return c;
  const nombre = CATEGORIAS_ES[c.slug];
  return nombre ? { ...c, nombre } : c;
}

/** "23 de febrero de 2026" en español; el formato original en ingles. */
export function fechaLargaEn(d: Date, idioma: Idioma): string {
  return d.toLocaleDateString(idioma === 'es' ? 'es-ES' : 'en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
}
