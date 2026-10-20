/**
 * Objetos reutilizables. Ver el diseño (Fase 3, §2.1):
 * ~/Sites/_interno/pergola-plus/ENTREGA-2026-10/03-FASE-3-DISENO-SANITY.md
 *
 * Bilingüe POR CAMPO: cada texto lleva `en` (obligatorio) y `es` (opcional). Un
 * documento sin `es` no genera página española (es el caso de Terms of Service).
 */
import { defineArrayMember, defineField, defineType } from 'sanity';

const IDIOMAS = [
  { id: 'en', titulo: 'English' },
  { id: 'es', titulo: 'Español' },
] as const;

/**
 * Lo que admite un texto con formato. Es EXACTAMENTE el repertorio de los cuerpos del
 * blog y de los textos legales (src/lib/portable.mjs): ni mas, para que el editor no
 * pueda meter algo que el diseño no sabe pintar, ni menos, para no perder nada al migrar.
 */
const CUERPO = [
  {
    type: 'block',
    styles: [
      { title: 'Párrafo', value: 'normal' },
      { title: 'Título 1', value: 'h1' },
      { title: 'Título 2', value: 'h2' },
      { title: 'Título 3', value: 'h3' },
    ],
    lists: [
      { title: 'Viñetas', value: 'bullet' },
      { title: 'Numerada', value: 'number' },
    ],
    marks: {
      decorators: [
        { title: 'Negrita', value: 'strong' },
        { title: 'Cursiva', value: 'em' },
      ],
      annotations: [
        {
          name: 'enlace',
          title: 'Enlace',
          type: 'object',
          fields: [
            { name: 'destino', title: 'Página del sitio', type: 'reference', to: [] as { type: string }[] },
            { name: 'ancla', title: 'Ancla (#…)', type: 'string' },
            { name: 'href', title: 'Enlace externo (si no es una página del sitio)', type: 'url', validation: (r: any) => r.uri({ allowRelative: true, scheme: ['https', 'http', 'tel', 'mailto'] }) },
          ],
        },
      ],
    },
  },
  { type: 'imagenCuerpo' },
  { type: 'botones' },
  { type: 'tabla' },
];

/** Un objeto {en, es} del tipo dado. `en` obligatorio. */
function i18n(name: string, title: string, tipo: 'string' | 'text' | 'portable') {
  return defineType({
    name,
    title,
    type: 'object',
    options: { columns: tipo === 'string' ? 2 : 1 },
    fields: IDIOMAS.map(({ id, titulo }) =>
      defineField({
        name: id,
        title: titulo,
        ...(tipo === 'portable'
          ? { type: 'array', of: CUERPO }
          : { type: tipo, ...(tipo === 'text' ? { rows: 3 } : {}) }),
        ...(id === 'en' ? { validation: (r: any) => r.required() } : {}),
      }),
    ),
  });
}

export const textoI18n = i18n('textoI18n', 'Texto', 'string');
export const textoLargoI18n = i18n('textoLargoI18n', 'Texto largo', 'text');
export const bloqueI18n = i18n('bloqueI18n', 'Texto con formato', 'portable');

export const PROCEDENCIAS = [
  { title: 'Foto real del cliente', value: 'real-cliente' },
  { title: 'Imagen IA facilitada por el cliente', value: 'ia-cliente' },
  { title: 'Imagen IA generada por SENAVIA', value: 'ia-senavia' },
  { title: 'Sin clasificar (solo migración)', value: 'sin-clasificar' },
];

/** Toda imagen del sitio. Procedencia obligatoria (registro de la Fase 6). */
export const imagen = defineType({
  name: 'imagen',
  title: 'Imagen',
  type: 'image',
  options: { hotspot: true },
  fields: [
    defineField({
      name: 'decorativa',
      title: 'Decorativa (sin texto alternativo)',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'alt',
      title: 'Texto alternativo',
      description: 'Describe lo que se ve, para quien no puede ver la imagen y para los buscadores.',
      type: 'textoI18n',
      hidden: ({ parent }) => parent?.decorativa === true,
      validation: (r) =>
        r.custom((alt: { en?: string } | undefined, ctx) => {
          const padre = ctx.parent as { decorativa?: boolean; asset?: unknown } | undefined;
          if (!padre?.asset || padre.decorativa) return true;
          return alt?.en?.trim() ? true : 'Falta el texto alternativo en inglés';
        }),
    }),
    defineField({
      name: 'procedencia',
      title: 'Procedencia',
      type: 'string',
      options: { list: PROCEDENCIAS, layout: 'radio' },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'procedenciaNota',
      title: 'De dónde viene',
      description: 'Quién la facilitó y cuándo (p. ej. «Drive del cliente, 11-ago-2026»). Se puede leer públicamente: redacción neutra.',
      type: 'string',
    }),
    defineField({
      name: 'retocadaConIA',
      title: 'Foto real retocada con IA',
      type: 'boolean',
      initialValue: false,
      hidden: ({ parent }) => parent?.procedencia !== 'real-cliente',
    }),
  ],
});

/** SEO por documento. Los avisos de longitud NO bloquean: los títulos los elige el cliente. */
export const seo = defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({
      name: 'titulo',
      title: 'Título (pestaña y Google)',
      type: 'textoI18n',
      validation: (r) =>
        r.custom((t: { en?: string; es?: string } | undefined) => {
          const largos = (['en', 'es'] as const).filter((k) => (t?.[k]?.length ?? 0) > 60);
          return largos.length ? `Más de 60 caracteres en ${largos.join(' y ')}: Google puede cortarlo` : true;
        }).warning(),
    }),
    defineField({
      name: 'descripcion',
      title: 'Descripción (Google)',
      type: 'textoLargoI18n',
      validation: (r) =>
        r.custom((t: { en?: string; es?: string } | undefined) => {
          const largos = (['en', 'es'] as const).filter((k) => (t?.[k]?.length ?? 0) > 160);
          return largos.length ? `Más de 160 caracteres en ${largos.join(' y ')}: Google puede cortarla` : true;
        }).warning(),
    }),
    defineField({ name: 'imagenOg', title: 'Imagen al compartir', type: 'imagen' }),
    defineField({
      name: 'indexable',
      title: 'Visible en buscadores',
      type: 'boolean',
      initialValue: true,
    }),
  ],
});

/** Tipos con página propia: destino posible de un enlace. */
export const CON_PAGINA = ['page', 'product', 'service', 'brand', 'project', 'post', 'blogCategory', 'city', 'county', 'legalPage'];

/** Botón o enlace. El destino interno es una REFERENCIA: el código construye la URL canónica. */
export const cta = defineType({
  name: 'cta',
  title: 'Botón',
  type: 'object',
  fields: [
    defineField({ name: 'texto', title: 'Texto', type: 'textoI18n', validation: (r) => r.required() }),
    defineField({ name: 'destino', title: 'Lleva a', type: 'reference', to: CON_PAGINA.map((type) => ({ type })) }),
    defineField({
      name: 'enlaceExterno',
      title: 'Enlace externo (solo si no hay destino)',
      type: 'url',
      validation: (r) => r.uri({ scheme: ['https', 'tel', 'mailto'] }),
    }),
    defineField({ name: 'ancla', title: 'Ancla dentro de la página (#…)', type: 'string' }),
  ],
  validation: (r) =>
    r.custom((v: { destino?: unknown; enlaceExterno?: string } | undefined) =>
      !v || v.destino || v.enlaceExterno ? true : 'El botón necesita un destino o un enlace externo',
    ),
});

/** Paso, tarjeta o elemento de lista: título, texto, imagen o icono opcionales y un botón. */
export const elemento = defineType({
  name: 'elemento',
  title: 'Elemento',
  type: 'object',
  fields: [
    defineField({ name: 'titulo', title: 'Título', type: 'textoI18n' }),
    defineField({ name: 'texto', title: 'Texto', type: 'textoLargoI18n' }),
    defineField({ name: 'imagen', title: 'Imagen o icono', type: 'imagen' }),
    defineField({ name: 'cta', title: 'Botón', type: 'cta' }),
  ],
  preview: { select: { title: 'titulo.en', subtitle: 'texto.en', media: 'imagen' } },
});

/**
 * Una seccion del diseño. Las paginas de coleccion y las estaticas se pintan con una
 * PLANTILLA que vive en el codigo (src/plantillas/<tipo>.html): el diseño no se toca
 * desde aqui. Lo que va dentro (textos, imagenes, enlaces, videos) son «huecos» con
 * clave fija, agrupados por la seccion en la que salen. La clave no se edita: es la que
 * busca la plantilla.
 */
const claveFija = defineField({ name: 'clave', title: 'Clave', type: 'string', readOnly: true, hidden: true, validation: (r) => r.required() });

/**
 * Imagen de una plantilla. Su texto alternativo NO va aqui sino en «Textos», con la
 * misma clave y `.alt` detras: en las ciudades, por ejemplo, la foto puede ser comun a
 * todas y el texto alternativo propio de cada una.
 */
export const imagenPlantilla = defineType({
  name: 'imagenPlantilla',
  title: 'Imagen',
  type: 'image',
  options: { hotspot: true },
  fields: [
    defineField({ name: 'procedencia', title: 'Procedencia', type: 'string', options: { list: PROCEDENCIAS, layout: 'radio' }, validation: (r) => r.required() }),
    defineField({ name: 'procedenciaNota', title: 'De dónde viene', type: 'string' }),
    defineField({ name: 'retocadaConIA', title: 'Foto real retocada con IA', type: 'boolean', initialValue: false, hidden: ({ parent }) => parent?.procedencia !== 'real-cliente' }),
  ],
});

export const imagenClave = defineType({
  name: 'imagenClave',
  title: 'Imagen',
  type: 'object',
  fields: [claveFija, defineField({ name: 'imagen', title: 'Imagen', type: 'imagenPlantilla' })],
  preview: { select: { title: 'clave', media: 'imagen' } },
});

export const enlaceClave = defineType({
  name: 'enlaceClave',
  title: 'Enlace',
  type: 'object',
  fields: [
    claveFija,
    defineField({ name: 'destino', title: 'Página del sitio', type: 'reference', to: [] as { type: string }[] }),
    defineField({ name: 'ancla', title: 'Ancla (#…)', type: 'string' }),
    defineField({ name: 'href', title: 'Enlace externo (si no es una página del sitio)', type: 'string' }),
  ],
  preview: { select: { title: 'destino._ref', subtitle: 'href' } },
});

export const valorClave = defineType({
  name: 'valorClave',
  title: 'Vídeo',
  type: 'object',
  fields: [claveFija, defineField({ name: 'valor', title: 'Valor', type: 'string', validation: (r) => r.required() })],
  preview: { select: { title: 'valor' } },
});

/** Un elemento de una lista de longitud variable (una foto de la galeria). */
export const elementoLista = defineType({
  name: 'elementoLista',
  title: 'Elemento',
  type: 'object',
  fields: [
    defineField({ name: 'textos', title: 'Textos', type: 'array', of: [{ type: 'textoClave' }] }),
    defineField({ name: 'imagenes', title: 'Imágenes', type: 'array', of: [{ type: 'imagenClave' }] }),
    defineField({ name: 'enlaces', title: 'Enlaces', type: 'array', of: [{ type: 'enlaceClave' }] }),
    defineField({ name: 'valores', title: 'Vídeos', type: 'array', of: [{ type: 'valorClave' }] }),
  ],
  preview: { select: { media: 'imagenes.0.imagen', t: 'textos.0.texto.en' }, prepare: ({ media, t }) => ({ title: t ?? 'Foto', media }) },
});

/**
 * Copia de otro documento: la tarjeta de un producto en «Compare» de las fichas. Se
 * elige el producto; la tarjeta (foto, título, texto) se edita en el propio producto.
 */
export const referenciaClave = defineType({
  name: 'referenciaClave',
  title: 'Producto',
  type: 'object',
  fields: [claveFija, defineField({ name: 'destino', title: 'Producto', type: 'reference', to: [{ type: 'product' }], validation: (r) => r.required() })],
  preview: { select: { title: 'destino.nombre.en' } },
});

export const bloque = defineType({
  name: 'bloque',
  title: 'Sección',
  type: 'object',
  fields: [
    defineField({ name: 'clave', title: 'Sección', type: 'string', readOnly: true, validation: (r) => r.required() }),
    defineField({ name: 'textos', title: 'Textos', type: 'array', of: [{ type: 'textoClave' }] }),
    defineField({ name: 'imagenes', title: 'Imágenes', type: 'array', of: [{ type: 'imagenClave' }] }),
    defineField({ name: 'enlaces', title: 'Enlaces', type: 'array', of: [{ type: 'enlaceClave' }] }),
    defineField({ name: 'valores', title: 'Vídeos', type: 'array', of: [{ type: 'valorClave' }] }),
    defineField({ name: 'elementos', title: 'Fotos de la galería', type: 'array', of: [{ type: 'elementoLista' }] }),
    defineField({ name: 'referencias', title: 'Productos que se comparan', type: 'array', of: [{ type: 'referenciaClave' }] }),
  ],
  preview: {
    select: { clave: 'clave', t: 'textos.0.texto.en' },
    prepare: ({ clave, t }) => ({ title: t ?? clave, subtitle: clave }),
  },
});

/**
 * Los documentos migrados tienen `_id` determinista (`post-<slug>`, `product-<slug>`…):
 * son las URL que ya estan publicadas. (Sin puntos: un `_id` con punto es privado.)
 */
const MIGRADO = /^(drafts\.)?(page|product|service|brand|project|post|blogCategory|county|city|legalPage)-/;

/**
 * Slug, igual en EN y ES. En los documentos migrados NO se edita: cambiar una URL
 * publicada exige un 301, que es un cambio de codigo. Los creados en el Studio lo fijan
 * al crearse.
 */
export const slugFijo = (fuente = 'nombre.en') =>
  defineField({
    name: 'slug',
    title: 'Dirección (slug)',
    description: 'Parte final de la URL, igual en inglés y en español. En las páginas ya publicadas no se cambia: rompería enlaces.',
    type: 'slug',
    group: 'contenido',
    options: { source: fuente, maxLength: 96 },
    readOnly: ({ document }) => MIGRADO.test(String(document?._id ?? '')),
    validation: (r) => r.required(),
  });

/**
 * Texto de interfaz con clave fija (botones, rotulos, avisos). La clave es la ruta del
 * texto en el diccionario del codigo (p. ej. `productos.louvered.nombre`): el codigo la
 * busca por ella, asi que no se edita.
 */
export const textoClave = defineType({
  name: 'textoClave',
  title: 'Texto',
  type: 'object',
  fields: [
    defineField({ name: 'clave', title: 'Clave', type: 'string', readOnly: true, validation: (r) => r.required() }),
    defineField({ name: 'texto', title: 'Texto', type: 'textoLargoI18n', validation: (r) => r.required() }),
  ],
  preview: { select: { title: 'texto.en', subtitle: 'clave' } },
});

/** Imagen dentro de un texto con formato: el texto alternativo va en el idioma del texto. */
export const imagenCuerpo = defineType({
  name: 'imagenCuerpo',
  title: 'Imagen',
  type: 'image',
  options: { hotspot: true },
  fields: [
    defineField({ name: 'alt', title: 'Texto alternativo', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'procedencia', title: 'Procedencia', type: 'string', options: { list: PROCEDENCIAS, layout: 'radio' }, validation: (r) => r.required() }),
    defineField({ name: 'procedenciaNota', title: 'De dónde viene', type: 'string' }),
    defineField({ name: 'cargaDiferida', title: 'Carga diferida', type: 'boolean', initialValue: true, hidden: true }),
  ],
});

/** Los botones dentro de un texto (el par «Schedule…» / «Request a Quote» de los artículos). */
export const botones = defineType({
  name: 'botones',
  title: 'Botones',
  type: 'object',
  fields: [
    defineField({
      name: 'items',
      title: 'Botones',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'boton',
          type: 'object',
          fields: [
            defineField({ name: 'texto', title: 'Texto', type: 'string', validation: (r) => r.required() }),
            defineField({ name: 'estilo', title: 'Estilo', type: 'string', options: { list: ['primario', 'secundario'] }, validation: (r) => r.required() }),
            defineField({ name: 'destino', title: 'Lleva a', type: 'reference', to: CON_PAGINA.map((type) => ({ type })) }),
            defineField({ name: 'ancla', title: 'Ancla (#…)', type: 'string' }),
            defineField({ name: 'href', title: 'Enlace externo', type: 'url' }),
          ],
          preview: { select: { title: 'texto', subtitle: 'estilo' } },
        }),
      ],
    }),
  ],
  preview: { select: { title: 'items.0.texto' }, prepare: ({ title }) => ({ title: `Botones: ${title ?? ''}` }) },
});

/** Tabla sencilla: título, cabecera y filas cuya primera celda es la etiqueta de la fila. */
export const tabla = defineType({
  name: 'tabla',
  title: 'Tabla',
  type: 'object',
  fields: [
    defineField({ name: 'titulo', title: 'Título', type: 'string' }),
    defineField({ name: 'etiquetaAccesible', title: 'Descripción para lectores de pantalla', type: 'string' }),
    defineField({ name: 'cabecera', title: 'Cabecera', type: 'array', of: [{ type: 'string' }] }),
    defineField({
      name: 'filas',
      title: 'Filas',
      type: 'array',
      of: [defineArrayMember({ name: 'filaTabla', type: 'object', fields: [defineField({ name: 'celdas', title: 'Celdas', type: 'array', of: [{ type: 'string' }] })], preview: { select: { title: 'celdas.0' } } })],
    }),
  ],
  preview: { select: { title: 'titulo' }, prepare: ({ title }) => ({ title: `Tabla: ${title ?? ''}` }) },
});

// El enlace del texto con formato apunta a cualquier documento con página.
(CUERPO[0] as any).marks.annotations[0].fields[0].to = CON_PAGINA.map((type) => ({ type }));

// Los destinos de los enlaces de seccion, igual que los del texto con formato.
(enlaceClave as any).fields[1].to = CON_PAGINA.map((type) => ({ type }));

export const objetos = [textoI18n, textoLargoI18n, bloqueI18n, imagen, seo, cta, elemento, textoClave, imagenCuerpo, botones, tabla, imagenPlantilla, imagenClave, enlaceClave, valorClave, elementoLista, referenciaClave, bloque];
