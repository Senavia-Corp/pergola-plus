/** Las 16 plantillas que se miden con Lighthouse y las 22 rutas de la sonda. */
export const PLANTILLAS = [
  ['home', '/'],
  ['home-es', '/es/'],
  ['productos-indice', '/products/'],
  ['producto', '/products/cabanas/'],
  ['servicios-indice', '/services/'],
  ['servicio', '/services/pavers/'],
  ['ciudad', '/pergolas-contractors/miami-pergola-experts/'],
  ['condado', '/countries/broward-county-pergola-contractor/'],
  ['proyecto', '/project/forte-pergola-with-outdoor-kitchen-at-elan-polo-club/'],
  ['galeria', '/project-gallery/'],
  ['post', '/post/hoa-rules-pergolas-south-florida/'],
  ['blog-indice', '/resources/blog/'],
  ['blog-categoria', '/resources/blog/buying-guides-cost/'],
  ['faq', '/resources/faq/'],
  ['contacto-quote', '/contact-us/get-a-quote/'],
  ['estimador', '/project-estimator/'],
];

export const RUTAS_SONDA = [
  ...PLANTILLAS.map(([, r]) => r),
  '/contact-us/get-in-touch/',
  '/es/products/cabanas/',
  '/es/contact-us/get-a-quote/',
  '/thank-you/',
  '/no-existe/',
  '/es/no-existe/',
];

export const BASE = process.env.BASE ?? 'http://localhost:4173';
