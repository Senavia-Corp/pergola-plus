/**
 * `siteSettings` horneado por Vite (src/lib/sanity/vite.mjs), o null si el build lee del
 * repo, y los datos de contacto del sitio que salen de el (src/lib/sanity/contacto-sitio.mjs).
 * Sin lectura de ficheros: lo importan tambien la funcion /api/lead y scripts con Node.
 */
import { contactoSitio } from './sanity/contacto-sitio.mjs';

declare const __PP_AJUSTES__: Record<string, any> | null | undefined;
export const ajustes = typeof __PP_AJUSTES__ === 'undefined' ? null : __PP_AJUSTES__;

/** tel, telContacto, correo, direccion, direccionContacto. */
export const SITIO = contactoSitio(ajustes);
