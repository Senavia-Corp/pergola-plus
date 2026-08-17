/**
 * Rotulos del carrusel de resenas, en los dos idiomas.
 *
 * SE TRADUCE EL CHROME, NUNCA LA RESENA. El texto que escribio un cliente es
 * suyo: traducirlo por nuestra cuenta lo convierte en algo que esa persona no
 * dijo, y un testimonio reescrito por el vendedor deja de ser un testimonio.
 * Las resenas salen en su idioma original en las dos versiones del sitio, con
 * `lang` declarado para que un lector de pantalla las pronuncie bien.
 *
 * Mismo patron que src/i18n/shell.ts: aqui se traduce por clave, porque este
 * markup es nuestro y no sale del HTML migrado.
 */
import type { Idioma } from './index';

type Claves =
  | 'titulo' | 'entradilla' | 'deCinco' | 'verEnGoogle' | 'verFicha'
  | 'respuestaDe' | 'orden' | 'sinFicha';

export const RESENAS: Record<Idioma, Record<Claves, string>> = {
  en: {
    titulo: 'What our clients say',
    entradilla: 'Reviews left by our clients on Google.',
    deCinco: 'out of 5',
    verEnGoogle: 'Read this review on Google',
    verFicha: 'See all reviews on Google',
    respuestaDe: 'Response from Pergola Plus Florida',
    // Aviso de orden. Va en pantalla a proposito: una lista de resenas que no
    // dice como esta ordenada invita a pensar que se han elegido las buenas.
    orden: 'All reviews from our Google Business Profile, newest first. None are filtered out.',
    sinFicha: 'Pergola Plus Florida on Google',
  },
  es: {
    titulo: 'Lo que dicen nuestros clientes',
    entradilla: 'Reseñas dejadas por nuestros clientes en Google.',
    deCinco: 'de 5',
    verEnGoogle: 'Leer esta reseña en Google',
    verFicha: 'Ver todas las reseñas en Google',
    respuestaDe: 'Respuesta de Pergola Plus Florida',
    orden: 'Todas las reseñas de nuestro perfil de Google Business, de la más reciente a la más antigua. No se filtra ninguna.',
    sinFicha: 'Pergola Plus Florida en Google',
  },
};
