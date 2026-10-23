# Prompt para lanzar el loop

Pegar en una sesión nueva de Claude Code abierta en `/Users/senavia/Sites/pp-loop`. Sin Ahrefs: el mapa de keywords va por intención, con WebSearch.

---

Ejecuta el loop de `docs/seo-loop/00-ESPECIFICACION-LOOP.md`, al pie de la letra. Antes de empezar, lee completos estos documentos:
- `01-REGISTRO-PETICIONES-CLIENTE.md`;
- `05-CONFLICTOS-SEO-CLIENTE.md`;
- `implementation-reports/ENTREGA-2026-10/08-AUDITORIA-SEO-FINAL.md` y `08-anexo-titulos.md`;
- `docs/blog-seo-2026-10/06-geo-aeo-aio.md`;
- `~/Sites/CLAUDE.md` y la memoria del proyecto.

Empieza por la **F0** y **para** al terminarla. Enséñame:
- las puertas J5–J17;
- `02-VACIOS-PERMITIDOS.json`;
- `04-MAPA-KEYWORDS.json`;
- el glosario;
- la línea base.

Hasta que firme `HASHES.txt` no implementes nada.

Después, F1 → F7, cada fase cerrada por un juez **independiente** (un subagente nuevo que solo ejecuta `node scripts/seo-loop/juez.mjs`). Reglas:
- el contenido va a la Release de Sanity, nunca publicado;
- el código va a la rama `seo/loop-optimizacion`, con un commit por mejora;
- fusiona en `main` solo cuando el juez pase J1–J17 dos veces seguidas;
- no toques nada de §1;
- no inventes datos del negocio;
- respeta las peticiones del cliente del registro, y anota su coste SEO en `05`.

Escribe cada iteración en `docs/seo-loop/iteraciones/NN.md` y los bloqueos en `07-BLOQUEOS.md`.
