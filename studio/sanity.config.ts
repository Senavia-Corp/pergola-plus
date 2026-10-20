import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { esESLocale } from '@sanity/locale-es-es';
import { tipos, SINGLETONS } from './schemas';
import { estructura } from './estructura';

export default defineConfig({
  name: 'pergola-plus',
  title: 'Pergola Plus Florida',
  projectId: 'n0ct9t3k',
  dataset: 'production',
  plugins: [structureTool({ structure: estructura }), esESLocale()],
  schema: {
    types: tipos,
    // Los singletons no se crean desde «Nuevo documento»: hay uno y se edita.
    templates: (anteriores) => anteriores.filter(({ schemaType }) => !SINGLETONS.has(schemaType)),
  },
  document: {
    // Ni duplicar ni borrar un singleton.
    actions: (anteriores, { schemaType }) =>
      SINGLETONS.has(schemaType)
        ? anteriores.filter(({ action }) => action && ['publish', 'discardChanges', 'restore'].includes(action))
        : anteriores,
  },
});
