/**
 * F7 · Lo que webflow.js hacia en la pagina ademas del nav (menu-nativo.ts), sin webflow.js
 * ni jQuery: las tres interacciones IX2 por clic y el lightbox. Medido sobre el fichero
 * (public/js/webflow.js hasta F6; ver 01-PLAN-Y-DECISIONES.md):
 *
 *   a-21/a-22 «FAQ»            .faq_trigger          → hermano .faq_content, hijo .faq_icon (todos los anchos)
 *   a-23/a-24 «Feature»        .feature-header-item  → hermano .feature-card, padre .feature-item (SOLO <992 px)
 *   a-25/a-26 «Feature Item»   .block-heading-feature → hermano .content-feature, hijo .line-feature-vertical (todos)
 *
 * El estado lo lleva la clase `pp-abierto` en el disparador y el CSS de interacciones.css
 * hace el resto (display, opacidad y los 500 ms easeInOut). De paso los disparadores, que
 * eran <div> mudos, pasan a ser botones de verdad (role, tabindex, aria-expanded, Enter y
 * espacio): invisible en reposo, y lo que WCAG 2.1.1 pide.
 */
const escritorio = matchMedia('(min-width: 992px)');

function acordeon(selector: string, soloMovil = false) {
  if (soloMovil && escritorio.matches) return; // en escritorio IX2 no registraba el evento
  for (const t of document.querySelectorAll<HTMLElement>(selector)) {
    t.setAttribute('role', 'button');
    t.tabIndex = 0;
    t.setAttribute('aria-expanded', 'false');
    const alternar = () => {
      if (soloMovil && escritorio.matches) return;
      t.setAttribute('aria-expanded', String(t.classList.toggle('pp-abierto')));
    };
    t.addEventListener('click', alternar);
    t.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); alternar(); }
    });
  }
}
acordeon('.faq_trigger');
acordeon('.feature-header-item', true);
acordeon('.block-heading-feature');

if (document.querySelector('a.w-lightbox')) import('./lightbox');

// H-08: la foto de fondo de .service-areas entra cuando la banda se acerca (ver la regla
// `.w-mod-js .service-areas:not(.pp-fondo)` de bandas.css).
const bandas = document.querySelectorAll('.service-areas');
if (bandas.length) {
  const cerca = new IntersectionObserver((entradas) => {
    for (const e of entradas) {
      if (!e.isIntersecting) continue;
      e.target.classList.add('pp-fondo');
      cerca.unobserve(e.target);
    }
  }, { rootMargin: '1500px 0px' });
  bandas.forEach((b) => cerca.observe(b));
}
