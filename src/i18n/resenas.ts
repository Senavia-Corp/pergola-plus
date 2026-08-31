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
  | 'respuestaDe' | 'orden' | 'ordenParcial' | 'sinFicha'
  | 'soloNota' | 'leerEnGoogle' | 'fuenteFicha';

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
    //
    // DICE «longest first» PORQUE ESE ES EL ORDEN QUE SE PINTA, decidido en
    // getReviews() (src/lib/reviews.ts) por maqueta: la tarjeta corta arriba dejaba
    // un hueco en la primera pantalla. La SELECCION no cambia —no se filtra
    // ninguna— y por eso esa mitad de la frase se queda igual.
    orden: 'All reviews from our Google Business Profile, longest first. None are filtered out.',
    // Con el snapshot PARCIAL la frase de arriba seria FALSA: no estan todas. Y es
    // una afirmacion en pantalla, no un comentario. Esta dice lo que si es cierto y
    // ademas explica el desajuste que el lector tiene delante — 5 tarjetas debajo de
    // un «(28)»— en vez de dejarlo sin explicar.
    ordenParcial: 'The most recent reviews from our Google Business Profile, longest first. The rating and review count above cover every review on the profile.',
    sinFicha: 'Pergola Plus Florida on Google',
    // Lo que se dice cuando tenemos la nota pero todavia no el texto de las
    // resenas. Explica el porque en vez de callarlo: la alternativa era un titulo
    // sobre un hueco en blanco.
    soloNota: 'The full text of each review lives on our Google Business Profile.',
    leerEnGoogle: 'Read our reviews on Google',
    // La PROCEDENCIA es rotulo, no dato: vive aqui y no en el JSON, que salia en
    // español dentro de la pagina inglesa.
    fuenteFicha: 'read from the public Google profile',
  },
  es: {
    titulo: 'Lo que dicen nuestros clientes',
    entradilla: 'Reseñas dejadas por nuestros clientes en Google.',
    deCinco: 'de 5',
    verEnGoogle: 'Leer esta reseña en Google',
    verFicha: 'Ver todas las reseñas en Google',
    respuestaDe: 'Respuesta de Pergola Plus Florida',
    // «de la más larga a la más corta» y no «por longitud»: describe lo que el
    // lector tiene delante sin obligarle a deducir el criterio. Ver el porque del
    // orden en getReviews() (src/lib/reviews.ts).
    orden: 'Todas las reseñas de nuestro perfil de Google Business, de la más larga a la más corta. No se filtra ninguna.',
    ordenParcial: 'Las reseñas más recientes de nuestro perfil de Google Business, de la más larga a la más corta. La nota y el número de arriba corresponden a todas las reseñas del perfil.',
    soloNota: 'El texto completo de cada reseña está en nuestro perfil de Google Business.',
    leerEnGoogle: 'Leer nuestras reseñas en Google',
    fuenteFicha: 'leído de la ficha pública de Google',
    sinFicha: 'Pergola Plus Florida en Google',
  },
};
