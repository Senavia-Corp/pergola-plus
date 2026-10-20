/**
 * Objetos reutilizables. Ver el diseño (Fase 3, §2.1):
 * ~/Sites/_interno/pergola-plus/ENTREGA-2026-10/03-FASE-3-DISENO-SANITY.md
 *
 * Bilingüe POR CAMPO: cada texto lleva `en` (obligatorio) y `es` (opcional). Un
 * documento sin `es` no genera página española (es el caso de Terms of Service).
 */
import { defineField, defineType } from 'sanity';

const IDIOMAS = [
  { id: 'en', titulo: 'English' },
  { id: 'es', titulo: 'Español' },
] as const;

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
          ? { type: 'array', of: [{ type: 'block' }, { type: 'imagen' }] }
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
 * Una sección de página. La CLAVE decide qué componente la pinta y con qué diseño: el
 * diseño aprobado vive en el código y el Studio solo cambia lo que va dentro (textos,
 * imágenes, botones y el orden de los elementos). Por eso la clave no se edita.
 */
export const seccion = defineType({
  name: 'seccion',
  title: 'Sección',
  type: 'object',
  fields: [
    defineField({
      name: 'clave',
      title: 'Sección',
      description: 'Identifica el bloque del diseño. No se cambia.',
      type: 'string',
      readOnly: true,
      validation: (r) => r.required(),
    }),
    defineField({ name: 'etiqueta', title: 'Etiqueta (sobre el título)', type: 'textoI18n' }),
    defineField({ name: 'titulo', title: 'Título', type: 'textoI18n' }),
    defineField({ name: 'subtitulo', title: 'Subtítulo', type: 'textoLargoI18n' }),
    defineField({ name: 'cuerpo', title: 'Texto', type: 'bloqueI18n' }),
    defineField({ name: 'imagen', title: 'Imagen', type: 'imagen' }),
    defineField({ name: 'elementos', title: 'Elementos', type: 'array', of: [{ type: 'elemento' }] }),
    defineField({
      name: 'referencias',
      title: 'Contenido enlazado (productos, proyectos…)',
      type: 'array',
      of: [{ type: 'reference', to: CON_PAGINA.map((type) => ({ type })) }],
    }),
    defineField({ name: 'ctas', title: 'Botones', type: 'array', of: [{ type: 'cta' }] }),
  ],
  preview: { select: { title: 'clave', subtitle: 'titulo.en' } },
});

/**
 * Los documentos migrados tienen `_id` determinista (`post.<slug>`, `product.<slug>`…):
 * son las URL que ya estan publicadas.
 */
const MIGRADO = /^(drafts\.)?[a-zA-Z]+\.[^.]+$/;

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

export const objetos = [textoI18n, textoLargoI18n, bloqueI18n, imagen, seo, cta, elemento, seccion];
