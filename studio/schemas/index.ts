import { objetos } from './objetos';
import { documentos } from './documentos';
import { estimador } from './estimador';

export const tipos = [...objetos, ...documentos, estimador];

/** Un solo documento de cada uno, con `_id` igual al tipo. */
export const SINGLETONS = new Set(['siteSettings', 'navigation', 'estimador']);
