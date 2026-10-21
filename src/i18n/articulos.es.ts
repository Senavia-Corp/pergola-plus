/**
 * Los articulos legales en español.
 *
 * Con PP_FUENTE=repo, solo el AVISO de privacidad.
 *
 * ACTUALIZACION 21-oct-2026: con la fuente Sanity (la de por defecto) los terminos SI
 * tienen version española, por decision del usuario: `cuerpo.es` de
 * legalPage-terms-of-service, una TRADUCCION DE CORTESIA que abre diciendo que prevalece
 * la version inglesa y enlaza a ella. Lo que sigue es por que no se traducia; sigue
 * valiendo para que la apruebe el cliente o su abogado antes de produccion.
 *
 * `/articles/terms-of-service` NO se traducia: son 4.554 palabras de un contrato de
 * obra vinculante que empieza diciendo "these terms and conditions are not
 * negotiable". Publicar una version en español seria publicar un SEGUNDO texto legal
 * que el cliente no ha aprobado y que, ante una discrepancia entre las dos versiones,
 * habria que defender en un juzgado de Florida. Un contrato lo traduce un abogado o
 * no se traduce.
 *
 * El aviso de privacidad si se traduce porque NO es un compromiso juridico: es el
 * texto provisional que dice que la politica esta pendiente y da una via de contacto,
 * y esta enlazado desde el pie de todas las paginas y desde el consentimiento de los
 * formularios — justo donde se recogen datos personales de un visitante que lee en
 * español.
 */

export interface ArticuloEs {
  nombre: string;
  title: string;
  description: string;
  dic: Record<string, string>;
}

export const ARTICULOS_ES: Record<string, ArticuloEs> = {
  'privacy-policy': {
    nombre: 'Aviso de privacidad',
    title: 'Aviso de privacidad | Pergola Plus Florida',
    description:
      'La política de privacidad está pendiente de publicarse. Mientras tanto, aquí tiene cómo pedirnos qué datos suyos tenemos, corregirlos o borrarlos.',
    dic: {
      'Privacy Policy': 'Aviso de privacidad',
      'Our full privacy policy is being finalized and will be published here.':
        'Nuestra política de privacidad completa se está terminando y se publicará aquí.',
      'In the meantime, if you want to know what personal information we hold about you, how we use it, or you want it corrected or deleted, write to':
        'Mientras tanto, si quiere saber qué datos personales suyos tenemos, cómo los usamos, o quiere que los corrijamos o los borremos, escriba a',
      'or call': 'o llame al',
      'and we will answer you directly.': 'y le responderemos directamente.',
      // El contrato sigue publicado solo en ingles, y el enlace lo dice.
      'The terms that govern our construction work are published in full under':
        'Las condiciones que rigen nuestra obra están publicadas íntegras, en inglés, en',
      'Terms &amp; Conditions': 'Terms &amp; Conditions',
    },
  },
};
