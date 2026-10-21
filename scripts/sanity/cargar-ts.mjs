/**
 * Carga modulos TypeScript del sitio (src/data, src/i18n, src/lib) desde un script de
 * Node con el MISMO Vite del build (ssrLoadModule): resuelve imports sin extension,
 * `?raw` e `import.meta.glob` igual que `astro build`, asi que el migrador lee lo
 * mismo que hoy publica el sitio.
 */
import { createServer } from 'vite';
import { ajustesSanity } from '../../src/lib/sanity/vite.mjs';

let servidor;

export async function cargarTs(ruta) {
  servidor ??= await createServer({ configFile: false, logLevel: 'silent', server: { middlewareMode: true, hmr: false, ws: false }, appType: 'custom', define: ajustesSanity(), optimizeDeps: { noDiscovery: true, include: [] } });
  return servidor.ssrLoadModule(ruta.startsWith('/') ? ruta : '/' + ruta);
}

export async function cerrarTs() {
  await servidor?.close();
  servidor = undefined;
}
