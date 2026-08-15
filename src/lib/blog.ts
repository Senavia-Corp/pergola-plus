/**
 * Datos del blog, leidos del export de Webflow en tiempo de build.
 *
 * Los CSV viven en src/data/ y NO en ~/Downloads. La ruta absoluta que usa
 * scripts/generar-detalle.mjs sirve para un generador que se ejecuta a mano en el
 * portatil; aqui rompe el build en Vercel, porque esta pagina si renderiza desde el
 * CSV. Se copian al repo a proposito.
 *
 * Fase 3: este modulo es el unico que cambia. En vez de parsear CSV consulta Sanity
 * y devuelve la misma forma; las plantillas no se enteran.
 */
import { parseCSV } from '../../scripts/lib/csv.mjs';
import { img, imgAlt, type EntradaImagen } from './img';
import csvPosts from '../data/blog-posts.csv?raw';
import csvCategorias from '../data/categories.csv?raw';

export interface Categoria {
  slug: string;
  nombre: string;
  /** Cuantos posts publicados tiene. Tres categorias del CMS estan a cero. */
  total: number;
}

export interface Post {
  slug: string;
  titulo: string;
  /**
   * `Title SEO`. Es lo que el bloque destacado del sitio original pinta en su <h2>,
   * no `Name`: Webflow enlazaba ahi otro campo. Se respeta.
   */
  tituloLargo: string;
  resumen: string;
  categoria: Categoria;
  miniatura: EntradaImagen;
  principal: EntradaImagen;
  altMiniatura: string;
  altPrincipal: string;
  publicado: Date;
  creado: Date;
  minutos: number;
  /** `Featured?`. Esta en true en 10 de 21: no sirve para elegir uno, si para ordenar. */
  destacadoCms: boolean;
  /** `Super Blog`. Este si marca UNO solo: es el del bloque destacado. */
  esHero: boolean;
  descripcionSeo: string;
}

/**
 * "View All" es un item de la coleccion Categories del CMS, creado cinco dias
 * despues del resto. Es un control de interfaz metido en los datos: aqui se
 * descarta y el "Todo" se pinta como boton.
 *
 * Fase 3: hay que borrarlo de la coleccion en el CMS.
 */
const SLUG_VER_TODO = 'view-all';

/** Palabras por minuto para el tiempo de lectura. */
const PPM = 200;

function fecha(valor: string): Date {
  // Webflow exporta el toString() de JS, no ISO:
  // "Mon Feb 23 2026 23:00:35 GMT+0000 (Coordinated Universal Time)"
  const d = new Date(valor);
  if (Number.isNaN(d.getTime())) throw new Error(`[blog] fecha ilegible: ${valor}`);
  return d;
}

function minutosDeLectura(html: string): number {
  const palabras = html
    .replace(/<[^>]*>/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(palabras / PPM));
}

/**
 * `Categories` es una referencia SIMPLE y viene como slug pelado. Se parte por el
 * separador de multi-referencia de todas formas ("; ", el que usan Products y
 * Services en el mismo CSV) para que el codigo aguante si el cliente convierte el
 * campo a multiple.
 */
function slugCategoria(celda: string): string {
  return celda.split(/;\s*/)[0]!.trim();
}

const filasCategorias = parseCSV(csvCategorias).filter(
  (c) => c.Slug !== SLUG_VER_TODO && c.Archived !== 'true' && c.Draft !== 'true',
);
const filasPosts = parseCSV(csvPosts).filter((p) => p.Archived !== 'true' && p.Draft !== 'true');

const totalPorSlug = new Map<string, number>();
for (const fila of filasPosts) {
  const s = slugCategoria(fila.Categories!);
  totalPorSlug.set(s, (totalPorSlug.get(s) ?? 0) + 1);
}

const porSlug = new Map<string, Categoria>(
  filasCategorias.map((c) => [
    c.Slug!,
    { slug: c.Slug!, nombre: c.Name!, total: totalPorSlug.get(c.Slug!) ?? 0 },
  ]),
);

/** Las 8 categorias reales del CMS, incluidas las 3 vacias. Mas llenas primero. */
export const categorias: Categoria[] = [...porSlug.values()].sort(
  (a, b) => b.total - a.total || a.nombre.localeCompare(b.nombre),
);

/** Solo las que tienen contenido: son las que se pintan como filtro. */
export const categoriasConPosts: Categoria[] = categorias.filter((c) => c.total > 0);

/**
 * Los 21 posts, en el MISMO orden que el grid del sitio original.
 *
 * El criterio es `Featured?` descendente y luego `Created On` descendente, que
 * reproduce las 21 posiciones exactas de la pagina en vivo (comprobado una a una).
 * Es el orden que tenia configurada la coleccion en Webflow, asi que respetarlo
 * mantiene la intencion editorial del cliente.
 *
 * `Published On` NO sirve para ordenar: 20 de los 21 posts comparten el mismo
 * segundo (Feb 23 2026 23:00:35), asi que seria un empate de 20. Se usa solo para
 * MOSTRAR la fecha y para el JSON-LD, que es donde corresponde.
 */
export const posts: Post[] = filasPosts
  .map((f): Post => {
    const cat = porSlug.get(slugCategoria(f.Categories!));
    if (!cat) throw new Error(`[blog] categoria desconocida en ${f.Slug}: ${f.Categories}`);
    return {
      slug: f.Slug!,
      titulo: f.Name!,
      tituloLargo: f['Title SEO']! || f.Name!,
      resumen: f['Post Summary']!,
      categoria: cat,
      miniatura: img(f['Thumbnail image']!),
      principal: img(f['Main Image']!),
      altMiniatura: imgAlt(f['Thumbnail image']!) || f['Metadescripcion Imagen']!,
      altPrincipal: imgAlt(f['Main Image']!) || f['Metadescripcion Imagen']!,
      publicado: fecha(f['Published On']!),
      creado: fecha(f['Created On']!),
      minutos: minutosDeLectura(f['Post Body']!),
      destacadoCms: f['Featured?'] === 'true',
      esHero: f['Super Blog'] === 'true',
      descripcionSeo: f['Metadescription SEO']!,
    };
  })
  .sort(
    (a, b) =>
      Number(b.destacadoCms) - Number(a.destacadoCms) || b.creado.getTime() - a.creado.getTime(),
  );

/**
 * El post del bloque destacado.
 *
 * Lo marca `Super Blog`, que esta en true en UN solo post. No confundir con
 * `Featured?`, que esta en 10 de 21 y solo sirve para ordenar. Si el cliente
 * marcase dos, esto revienta el build a proposito en vez de elegir uno al azar.
 */
const heroes = posts.filter((p) => p.esHero);
if (heroes.length !== 1) {
  throw new Error(
    `[blog] "Super Blog" tiene que marcar exactamente 1 post; hay ${heroes.length}` +
      (heroes.length ? `: ${heroes.map((p) => p.slug).join(', ')}` : ''),
  );
}
export const destacado: Post = heroes[0]!;

export function postsDe(slugCat: string): Post[] {
  return posts.filter((p) => p.categoria.slug === slugCat);
}

/**
 * Titulo, meta y entradilla de cada categoria.
 *
 * ESTO ES COPY PROVISIONAL, PENDIENTE DE VALIDAR CON EL CLIENTE.
 *
 * El campo `Description` de la coleccion Categories existe en el CMS pero esta
 * VACIO en las 9 filas, asi que no habia de donde sacarlo. Fase 3: el texto se
 * mueve a ese campo y este mapa desaparece.
 */
interface CopyCategoria {
  titulo: string;
  meta: string;
  intro: string;
}

const COPY: Record<string, CopyCategoria> = {
  'buying-guides-cost': {
    titulo: 'Pergola Buying Guides & Cost in South Florida',
    meta: 'Permits, HOA rules, county building codes and real pergola pricing for Broward, Palm Beach and Miami-Dade homes.',
    intro:
      'What a pergola actually costs in South Florida, and everything that happens before it goes up: permits, HOA approvals, county building codes and the design-build process.',
  },
  'outdoor-living-design': {
    titulo: 'Outdoor Living Design Ideas for South Florida',
    meta: 'Poolside, resort-style and year-round patio design ideas for South Florida backyards.',
    intro:
      'Design ideas for backyards that get used every month of the year: poolside layouts, resort-style spaces and the trends shaping outdoor living in South Florida.',
  },
  'materials-engineering': {
    titulo: "Pergola Materials & Engineering for Florida's Climate",
    meta: 'Aluminum vs wood, louvered roofs and hurricane-resistant construction for Florida pergolas.',
    intro:
      'Aluminum against wood in real humidity, whether a louvered roof earns its price, and what hurricane-rated construction actually requires.',
  },
  'pergolas-shade-systems': {
    titulo: 'Pergolas & Shade Systems for Florida Homes',
    meta: 'Choosing the right pergola and shade structure for rain, sun and waterfront exposure in Florida.',
    intro:
      'Choosing between structures when the weather does all of it in one afternoon: sun, rain, and salt air on the water.',
  },
  'maintenance-care': {
    titulo: 'Pergola Maintenance & Care in Coastal Florida',
    meta: 'Keeping a pergola looking new in coastal Florida: materials, salt air and upkeep.',
    intro:
      'Salt air, humidity and UV are relentless here. What holds up over the years, and what it takes to keep it looking new.',
  },
  // Las 3 categorias vacias del CMS (commercial-projects, patio-hardscape-services,
  // service-areas) no llevan copy porque no generan ruta. Si el cliente publica en
  // alguna, `copyDe` tira del respaldo generico y aqui se le escribe el suyo.
  //
  // service-areas ademas NO deberia ser categoria de blog: el sitio ya tiene 29
  // paginas reales de zonas (/about-us/where-we-work + 3 condados + 25 ciudades).
};

export function copyDe(cat: Categoria): CopyCategoria {
  return (
    COPY[cat.slug] ?? {
      titulo: cat.nombre,
      meta: `${cat.nombre} articles from Pergola Plus Florida.`,
      intro: `Articles filed under ${cat.nombre}.`,
    }
  );
}

/** Formato de fecha del sitio original: "February 23, 2026". */
export function fechaLarga(d: Date): string {
  return d.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

/** Para <time datetime="..."> y para el JSON-LD. */
export function fechaIso(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/**
 * data-wf-page / data-wf-site de /resources/blog.
 *
 * IX2 los lee para saber que interacciones enlazar. Las rutas de categoria usan los
 * mismos a proposito: asi el hero y el CTA se animan igual que en el indice.
 */
export const WF_PAGE = '698a9130a69620b147bce65e';
export const WF_SITE = '6903b7794d5df3d76a7a2488';

export const ORGANIZACION = {
  '@type': 'Organization',
  name: 'Pergola Plus Florida',
  url: 'https://pergola-plus-florida.webflow.io/',
} as const;

/** JSON-LD del listado y de cada categoria. */
export function jsonLdBlog(opciones: {
  url: string;
  nombre: string;
  descripcion: string;
  entradas: Post[];
  site: string;
}) {
  const { url, nombre, descripcion, entradas, site } = opciones;
  return {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    '@id': `${url}#blog`,
    url,
    name: nombre,
    description: descripcion,
    inLanguage: 'en-US',
    publisher: ORGANIZACION,
    blogPost: entradas.map((p) => ({
      '@type': 'BlogPosting',
      headline: p.titulo,
      description: p.resumen,
      url: new URL(`/post/${p.slug}`, site).href,
      image: new URL(p.principal.src, site).href,
      datePublished: p.publicado.toISOString(),
      articleSection: p.categoria.nombre,
    })),
  };
}
