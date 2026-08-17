/**
 * Las paginas de marca en español.
 *
 * Mismo patron que `servicios.es.ts` y `productos.es.ts`: aqui solo va lo propio de
 * cada marca —seis cadenas— y lo compartido vive en `comun.es.ts`.
 *
 * Los NOMBRES DE MARCA no se traducen: Apollo, Equinox, Fenetex, Renaissance, FORTE.
 * Tampoco los nombres de sistema. Lo que se traduce es lo que describe qué hace cada
 * uno, que es lo que el visitante necesita entender.
 *
 * Añadir una marca traducida es una entrada aqui + su ruta en `TRADUCIDAS`
 * (src/i18n/rutas.mjs). Lo que no este no existe en /es/.
 */

export interface MarcaEs {
  /** Nombre corto, para las migas. */
  nombre: string;
  title: string;
  description: string;
  dic: Record<string, string>;
}

export const MARCAS_ES: Record<string, MarcaEs> = {
  appolo: {
    nombre: 'Appolo',
    title: 'Techos de lamas Apollo | Pérgolas motorizadas en el sur de Florida',
    description:
      'Pérgolas Apollo de lamas motorizadas: control del sol, de la sombra y del aire con mando, app o voz, compatibles con domótica.',
    dic: {
      'Discover Apollo motorized louvered roof systems designed for precise sun and shade control. Engineered for durability and seamless automation, these adjustable aluminum pergolas deliver year-round outdoor comfort with modern design and long-term performance in Florida’s demanding climate.':
        'Los techos de lamas motorizados Apollo están pensados para controlar el sol y la sombra con precisión. Calculados para durar y para automatizarse sin complicaciones, estas pérgolas de aluminio orientables dan confort todo el año, con diseño actual y con prestaciones que aguantan el clima exigente de Florida.',
    },
  },

  equinox: {
    nombre: 'Equinox',
    title: 'Pérgolas Equinox de techo de lamas | Sombra regulable en Florida',
    description:
      'Techos de lamas motorizados Equinox: sombra y ventilación a medida, con protección frente al tiempo pulsando un botón.',
    dic: {
      'Explore Equinox adjustable louvered roof pergolas, built to provide flexible shade control and all-weather protection. With advanced engineering and sleek architectural lines, Equinox systems elevate outdoor living while meeting Florida’s structural and wind-load standards.':
        'Las pérgolas Equinox de lamas orientables dan control de sombra y protección con cualquier tiempo. Con buena ingeniería y unas líneas limpias, elevan el exterior y cumplen lo que Florida exige en estructura y en cargas de viento.',
    },
  },

  fenetex: {
    nombre: 'Fenetex',
    title: 'Cortinas motorizadas Fenetex | Sombra y protección en el sur de Florida',
    description:
      'Cortinas motorizadas Fenetex: mosquiteras, transparentes, de sombra y homologadas para huracán, para exteriores residenciales y comerciales.',
    dic: {
      'Fenetex motorized screens combine hurricane-rated protection with smooth automated operation. Designed for durability and refined performance, these premium screen systems enhance comfort, privacy, and climate control for both residential and commercial outdoor spaces.':
        'Las cortinas motorizadas Fenetex unen protección homologada para huracán y un funcionamiento suave. Pensadas para durar y para rendir, aportan confort, privacidad y control del ambiente tanto en viviendas como en locales.',
    },
  },

  'pergola-plus-forte': {
    nombre: 'Pergola Plus | Forte',
    title: 'Sistemas FORTE de Pergola Plus | Pérgolas de aluminio a medida',
    description:
      'El sistema de aluminio FORTE: solidez estructural, diseño limpio y cálculo conforme a la normativa de Florida.',
    dic: {
      'The FORTE aluminum pergola system by Pergola Plus Florida is engineered for structural integrity, clean design, and long-term durability. Custom-built to meet Florida building codes, FORTE delivers modern shade solutions tailored to luxury outdoor environments.':
        'El sistema de pérgola de aluminio FORTE de Pergola Plus Florida está calculado para ser sólido, para verse limpio y para durar. Se fabrica a medida cumpliendo la normativa de Florida, con soluciones de sombra actuales para exteriores de gama alta.',
    },
  },

  renaissance: {
    nombre: 'Renaissance',
    title: 'Cubiertas y pérgolas Renaissance | Sistemas de aluminio calculados',
    description:
      'Pérgolas, cubiertas de patio y salas con mosquitera Renaissance: aluminio resistente, personalizable y de poco mantenimiento.',
    dic: {
      'Renaissance patio covers and aluminum pergolas are crafted for strength, low maintenance, and architectural harmony. Engineered for Florida’s climate, these insulated roof systems provide reliable shade and year-round outdoor protection.':
        'Las cubiertas de patio y las pérgolas de aluminio Renaissance están hechas para resistir, para dar poco trabajo y para encajar con la casa. Calculadas para el clima de Florida, sus techos aislados dan sombra fiable y protección todo el año.',
    },
  },
};
