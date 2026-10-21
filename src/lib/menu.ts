/**
 * El menu y el pie: QUE enlaces hay y en que orden (grupos, columnas, destinos y textos)
 * sale del documento `navigation`; COMO se pintan, de Nav.astro y Footer.astro.
 *
 * Los ganchos de diseño de cada enlace migrado se quedan aqui, por su destino: el
 * `data-w-id` y el `is-N` de los .submenu-item (las interacciones IX2 de hover que
 * cambian la foto de vista previa del desplegable) y el icono de los desplegables
 * pequeños. Un enlace NUEVO, creado en el Studio, no tiene gancho: se pinta con el
 * aspecto base de su columna (sin foto de vista previa propia ni icono), y las
 * interacciones de los demas siguen intactas.
 *
 * Con el build leyendo del repo vale la estructura de MENU_REPO/PIE_REPO, que es la
 * misma que guarda el documento (la migracion lo comprueba).
 */
import { FUENTE, sanity, rutaDeRef, enIdioma } from './sanity/fuente.mjs';

export interface EnlaceMenu {
  href: string;
  /** Claves de texto de navigation.textos (los migrados): el titulo y, en los desplegables pequeños, la descripcion. */
  claves?: string[];
  /** Texto propio (enlace nuevo creado en el Studio). */
  texto?: { en: string; es?: string };
  descripcion?: { en: string; es?: string };
}
export interface ColumnaMenu {
  /** Clave de texto del titulo de la columna. */
  titulo?: string;
  /** La columna «Ver todos …» de los desplegables grandes. */
  verTodo?: boolean;
  enlaces: EnlaceMenu[];
}
export interface GrupoMenu {
  clave: string;
  /** Enlace directo (sin desplegable). */
  destino?: string;
  columnas: ColumnaMenu[];
}

const MENU_REPO: GrupoMenu[] = [
  {
    clave: 'ourProducts',
    columnas: [
      {
        titulo: 'grupoPergolas',
        enlaces: [
          {
            href: '/products/motorized-louvered-pergolas',
            claves: [
              'motorizedLouvered'
            ]
          },
          {
            href: '/products/solid-roof-pergolas',
            claves: [
              'solidRoof'
            ]
          },
          {
            href: '/products/polycarbonate-pergolas',
            claves: [
              'polycarbonate'
            ]
          },
          {
            href: '/products/open-air-pergolas',
            claves: [
              'openAir'
            ]
          },
          {
            href: '/products/cabanas',
            claves: [
              'cabanas'
            ]
          }
        ]
      },
      {
        titulo: 'grupoCerramientos',
        enlaces: [
          {
            href: '/products/screen-enclosures',
            claves: [
              'screenEnclosures'
            ]
          },
          {
            href: '/products/motorized-screens',
            claves: [
              'motorizedScreens'
            ]
          },
          {
            href: '/products/carports',
            claves: [
              'carports'
            ]
          },
          {
            href: '/products/solar-pergolas',
            claves: [
              'solar'
            ]
          },
          {
            href: '/products/sukkah',
            claves: [
              'sukkha'
            ]
          }
        ]
      },
      {
        verTodo: true,
        enlaces: [
          {
            href: '/products',
            claves: [
              'verTodosProductos'
            ]
          }
        ]
      }
    ]
  },
  {
    clave: 'ourServices',
    columnas: [
      {
        titulo: 'grupoHardscape',
        enlaces: [
          {
            href: '/services/pergola-design-construction',
            claves: [
              'customPergolas'
            ]
          },
          {
            href: '/services/pavers',
            claves: [
              'pavers'
            ]
          },
          {
            href: '/services/driveways',
            claves: [
              'driveways'
            ]
          },
          {
            href: '/services/concrete',
            claves: [
              'concrete'
            ]
          }
        ]
      },
      {
        titulo: 'grupoExteriores',
        enlaces: [
          {
            href: '/services/deck-builders',
            claves: [
              'deck'
            ]
          },
          {
            href: '/services/fence-solutions',
            claves: [
              'fence'
            ]
          },
          {
            href: '/services/full-outdoor-remodel',
            claves: [
              'fullRemodel'
            ]
          }
        ]
      },
      {
        verTodo: true,
        enlaces: [
          {
            href: '/services',
            claves: [
              'verTodosServicios'
            ]
          }
        ]
      }
    ]
  },
  {
    clave: 'projectGallery',
    destino: '/project-gallery',
    columnas: []
  },
  {
    clave: 'aboutUs',
    columnas: [
      {
        enlaces: [
          {
            href: '/about-us/about-us',
            claves: [
              'aboutUsTitulo',
              'aboutUsTexto'
            ]
          },
          {
            href: '/about-us/where-we-work',
            claves: [
              'whereWeWorkTitulo',
              'whereWeWorkTexto'
            ]
          },
          {
            href: '/about-us/brands',
            claves: [
              'brandsTitulo',
              'brandsTexto'
            ]
          },
          {
            href: '/about-us/industries-we-serve',
            claves: [
              'industriesTitulo',
              'industriesTexto'
            ]
          }
        ]
      }
    ]
  },
  {
    clave: 'resources',
    columnas: [
      {
        enlaces: [
          {
            href: '/resources/blog',
            claves: [
              'blogTitulo',
              'blogTexto'
            ]
          },
          {
            href: '/resources/faq',
            claves: [
              'faqTitulo',
              'faqTexto'
            ]
          },
          {
            href: '/resources/warranties',
            claves: [
              'warrantyTitulo',
              'warrantyTexto'
            ]
          },
          {
            href: '/about-us/testimonials',
            claves: [
              'testimonialsTitulo',
              'testimonialsTexto'
            ]
          }
        ]
      }
    ]
  },
  {
    clave: 'contactUs',
    columnas: [
      {
        enlaces: [
          {
            href: '/project-estimator',
            claves: [
              'estimatorTitulo',
              'estimatorTexto'
            ]
          },
          {
            href: '/contact-us/get-a-quote',
            claves: [
              'quoteTitulo',
              'quoteTexto'
            ]
          },
          {
            href: '/contact-us/schedule-a-visit',
            claves: [
              'visitTitulo',
              'visitTexto'
            ]
          },
          {
            href: '/contact-us/get-in-touch',
            claves: [
              'touchTitulo',
              'touchTexto'
            ]
          }
        ]
      }
    ]
  },
  {
    clave: 'botones',
    columnas: [
      {
        enlaces: [
          {
            href: '/contact-us/get-a-quote',
            claves: [
              'getAQuote'
            ]
          },
          {
            href: '/contact-us/schedule-a-visit',
            claves: [
              'scheduleAVisit'
            ]
          }
        ]
      }
    ]
  }
];

const PIE_REPO: ColumnaMenu[] = [
  {
    titulo: 'footerHelp',
    enlaces: [
      {
        href: '/products',
        claves: [
          'footerProductos'
        ]
      },
      {
        href: '/services',
        claves: [
          'footerServicios'
        ]
      },
      {
        href: '/project-gallery',
        claves: [
          'footerGaleria'
        ]
      },
      {
        href: '/project-estimator',
        claves: [
          'footerEstimador'
        ]
      },
      {
        href: '/contact-us/get-in-touch',
        claves: [
          'footerContacto'
        ]
      },
      {
        href: '/resources/blog',
        claves: [
          'footerBlog'
        ]
      },
      {
        href: '/resources/faq',
        claves: [
          'footerFaq'
        ]
      }
    ]
  },
  {
    titulo: 'footerCompany',
    enlaces: [
      {
        href: '/about-us/about-us',
        claves: [
          'footerAbout'
        ]
      },
      {
        href: '/about-us/brands',
        claves: [
          'footerBrands'
        ]
      },
      {
        href: '/about-us/where-we-work',
        claves: [
          'footerWhere'
        ]
      },
      {
        href: '/about-us/industries-we-serve',
        claves: [
          'footerIndustries'
        ]
      },
      {
        href: '/about-us/testimonials',
        claves: [
          'footerTestimonials'
        ]
      }
    ]
  },
  {
    titulo: 'footerFollow',
    enlaces: []
  },
  {
    enlaces: [
      {
        href: '/articles/privacy-policy',
        claves: [
          'footerPrivacidad'
        ]
      },
      {
        href: '/articles/terms-of-service',
        claves: [
          'footerTerminos'
        ]
      }
    ]
  }
];

/** Desde el documento `navigation` (src/lib/sanity/fuente.mjs: rutaDeRef para los destinos). */
export function menuDesde(n: any, ruta: (ref: any) => string): { menu: GrupoMenu[]; pie: ColumnaMenu[] } {
  const enlace = (e: any): EnlaceMenu => ({
    href: e.destino ? ruta(e.destino) : e.href,
    ...(e.claves?.length ? { claves: [...e.claves] } : {}),
    ...(e.texto ? { texto: e.texto } : {}),
    ...(e.descripcion ? { descripcion: e.descripcion } : {}),
  });
  const columna = (c: any): ColumnaMenu => ({
    ...(c.verTodo ? { verTodo: true } : c.titulo ? { titulo: c.titulo } : {}),
    enlaces: (c.enlaces ?? []).map(enlace),
  });
  return {
    menu: (n.menu ?? []).map((g: any) => ({ clave: g.clave, ...(g.destino ? { destino: ruta(g.destino) } : {}), columnas: (g.columnas ?? []).map(columna) })),
    pie: (n.pie ?? []).map(columna),
  };
}

const D = FUENTE === 'sanity' ? menuDesde(sanity().doc('navigation'), rutaDeRef) : { menu: MENU_REPO, pie: PIE_REPO };
export const MENU: GrupoMenu[] = D.menu;
export const PIE: ColumnaMenu[] = D.pie;
export { MENU_REPO, PIE_REPO };

/** Texto de un enlace (o de su descripcion, `n` = 1) en el idioma de la pagina. */
export function textoEnlace(e: EnlaceMenu, t: (clave: any) => string, idioma: 'en' | 'es', n = 0): string {
  const propio = n === 0 ? e.texto : e.descripcion;
  if (propio) return enIdioma(propio, idioma) ?? '';
  const clave = e.claves?.[n];
  return clave ? t(clave) : '';
}

/** Ganchos de los .submenu-item migrados: data-w-id (IX2) e indice de la foto de vista previa. */
export const GANCHOS_SUBMENU: Record<string, { wId: string; n: number }> = {
  '/products/motorized-louvered-pergolas': { wId: '2d27e00a-9abd-8e02-83db-6979dd88df7e', n: 1 },
  '/products/solid-roof-pergolas': { wId: '2d27e00a-9abd-8e02-83db-6979dd88df85', n: 2 },
  '/products/polycarbonate-pergolas': { wId: '2d27e00a-9abd-8e02-83db-6979dd88df8c', n: 3 },
  '/products/open-air-pergolas': { wId: '2d27e00a-9abd-8e02-83db-6979dd88df93', n: 4 },
  '/products/cabanas': { wId: '2d27e00a-9abd-8e02-83db-6979dd88df9a', n: 5 },
  '/products/screen-enclosures': { wId: '2d27e00a-9abd-8e02-83db-6979dd88dfa5', n: 6 },
  '/products/motorized-screens': { wId: '2d27e00a-9abd-8e02-83db-6979dd88dfac', n: 7 },
  '/products/carports': { wId: '2d27e00a-9abd-8e02-83db-6979dd88dfb3', n: 8 },
  '/products/solar-pergolas': { wId: '2d27e00a-9abd-8e02-83db-6979dd88dfba', n: 9 },
  '/products/sukkah': { wId: '2d27e00a-9abd-8e02-83db-6979dd88dfc1', n: 10 },
  '/services/pergola-design-construction': { wId: '2d27e00a-9abd-8e02-83db-6979dd88dfe0', n: 1 },
  '/services/pavers': { wId: '2d27e00a-9abd-8e02-83db-6979dd88dfe7', n: 2 },
  '/services/driveways': { wId: '2d27e00a-9abd-8e02-83db-6979dd88dfee', n: 3 },
  '/services/concrete': { wId: '2d27e00a-9abd-8e02-83db-6979dd88dff5', n: 4 },
  '/services/deck-builders': { wId: '2d27e00a-9abd-8e02-83db-6979dd88e000', n: 5 },
  '/services/fence-solutions': { wId: '2d27e00a-9abd-8e02-83db-6979dd88e007', n: 6 },
  '/services/full-outdoor-remodel': { wId: '2d27e00a-9abd-8e02-83db-6979dd88e00e', n: 7 },
};

/** Icono de los enlaces migrados de los desplegables pequeños. */
export const ICONOS_SUBMENU: Record<string, string> = {
  '/about-us/about-us': '/images/1_1.svg',
  '/about-us/where-we-work': '/images/4.svg',
  '/about-us/brands': '/images/2_1.svg',
  '/about-us/industries-we-serve': '/images/3_1.svg',
  '/resources/blog': '/images/5.svg',
  '/resources/faq': '/images/6.svg',
  '/resources/warranties': '/images/7.svg',
  '/about-us/testimonials': '/images/8.svg',
  '/project-estimator': '/images/project-estimator.svg',
  '/contact-us/get-a-quote': '/images/9.svg',
  '/contact-us/schedule-a-visit': '/images/10.svg',
  '/contact-us/get-in-touch': '/images/12.svg',
};
