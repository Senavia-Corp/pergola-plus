/**
 * Las 3 paginas de condado en español.
 *
 * Tres cadenas propias cada una: el <h1>, el encabezado de seccion y su parrafo. El
 * resto vive en `comun.es.ts`.
 *
 * Los nombres de condado y de ciudad NO se traducen: son toponimos, y "Miami-Dade
 * County" en boca de un vecino se dice "el condado de Miami-Dade", que es lo que se
 * usa en el cuerpo, pero el nombre propio se deja como esta.
 */

export interface CondadoEs {
  nombre: string;
  title: string;
  description: string;
  dic: Record<string, string>;
}

export const CONDADOS_ES: Record<string, CondadoEs> = {
  'broward-county-pergola-contractor': {
    nombre: 'Broward',
    title: 'Pérgolas en el condado de Broward | Aluminio y lamas',
    description:
      'Pérgolas de aluminio y techos de lamas a medida en todo el condado de Broward, de Fort Lauderdale a Weston.',
    dic: {
      'Pergola Contractors in Broward County': 'Pérgolas en el condado de Broward',
      'Custom Aluminum Pergolas in Broward County': 'Pérgolas de aluminio a medida en el condado de Broward',
      'We design and install premium aluminum pergolas and louvered roof systems across Broward County, including Fort Lauderdale, Weston, and surrounding communities. Every structure is custom-engineered for Florida’s climate, delivering durability, shade control, and long-term architectural value for residential and select commercial properties.':
        'Diseñamos e instalamos pérgolas de aluminio y techos de lamas por todo el condado de Broward, incluidas Fort Lauderdale, Weston y los alrededores. Cada estructura se calcula a medida para el clima de Florida: dura, controla la sombra y aporta valor a largo plazo tanto en viviendas como en algunos locales.',
    },
  },

  'miami-dade-pergola-contractor': {
    nombre: 'Miami-Dade',
    title: 'Pérgolas en el condado de Miami-Dade | Aluminio a medida',
    description:
      'Pérgolas de aluminio y techos de lamas motorizados en Miami, Coral Gables, Doral y la costa de Miami-Dade.',
    dic: {
      'Pergola Contractors in Miami-Dade County': 'Pérgolas en el condado de Miami-Dade',
      'Luxury Pergola Systems in Miami-Dade County': 'Pérgolas de gama alta en el condado de Miami-Dade',
      'Serving Miami, Coral Gables, Doral, and coastal communities, we specialize in custom aluminum pergolas and motorized louvered roofs built for modern South Florida living. Our systems are engineered to withstand heat, humidity, and storms while elevating outdoor comfort and design.':
        'Trabajamos en Miami, Coral Gables, Doral y los municipios de la costa, con pérgolas de aluminio a medida y techos de lamas motorizados pensados para vivir el sur de Florida de hoy. Se calculan para aguantar el calor, la humedad y las tormentas, y para mejorar el confort y el diseño del exterior.',
    },
  },

  'palm-beach-county-pergola-contractor': {
    nombre: 'Palm Beach',
    title: 'Pérgolas en el condado de Palm Beach | Aluminio a medida',
    description:
      'Pérgolas de aluminio y cubiertas de patio a medida de Boca Raton a Palm Beach Gardens.',
    dic: {
      'Pergola Contractors in Palm Beach County': 'Pérgolas en el condado de Palm Beach',
      'High-End Pergola Installation in Palm Beach County': 'Pérgolas de gama alta en el condado de Palm Beach',
      'From Boca Raton to Palm Beach Gardens, we deliver refined aluminum pergola and patio cover solutions tailored to upscale properties. Our custom-built structures combine clean architectural lines, superior materials, and engineered performance for long-term outdoor enjoyment.':
        'De Boca Raton a Palm Beach Gardens, damos soluciones cuidadas de pérgola de aluminio y de cubierta de patio, a la medida de propiedades de alto nivel. Nuestras estructuras a medida unen líneas limpias, buenos materiales y prestaciones calculadas para disfrutar el exterior a largo plazo.',
    },
  },
};
