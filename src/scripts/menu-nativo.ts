/**
 * F7 · Sustituto nativo de los modulos `navbar` y `dropdown` de webflow.js y de las dos
 * interacciones IX2 del nav (a-27 «Menu Down» / a-28 «Menu Up»). Mismo markup, mismas
 * clases que el CSS de Webflow necesita (w--open, w--nav-*-open, data-nav-menu-open,
 * .w-nav-overlay), mismos atributos ARIA y mismas duraciones. Todo esta copiado del
 * comportamiento MEDIDO con webflow.js (Playwright sobre el build de F8, 20-oct-2026),
 * no inventado. El Escape / inert / ciclo de foco del panel movil sigue en Nav.astro,
 * que observa `w--open` en el boton y no sabe quien la pone.
 */
const navbar = document.querySelector<HTMLElement>('.menu .w-nav');

// --- navbar: el panel movil ---------------------------------------------------
if (navbar) {
  const boton = navbar.querySelector<HTMLElement>('.w-nav-button')!;
  const panel = navbar.querySelector<HTMLElement>('.w-nav-menu')!;
  const duracion = Number(navbar.dataset.duration ?? 400);
  const easing = navbar.dataset.easing ?? 'ease';
  const easing2 = navbar.dataset.easing2 ?? 'ease';
  const haciaLaDerecha = !/left$/.test(navbar.dataset.animation ?? '');
  const padre = panel.parentElement!;
  const siguiente = panel.nextElementSibling;
  // El overlay lo creaba webflow.js al arrancar; el CSS de Webflow ya lo estiliza.
  const overlay = document.createElement('div');
  overlay.className = 'w-nav-overlay';
  overlay.setAttribute('data-wf-ignore', '');
  overlay.id = 'w-nav-overlay-0';
  navbar.appendChild(overlay);
  boton.setAttribute('role', 'button');
  boton.setAttribute('tabindex', '0');
  if (!boton.getAttribute('aria-label')) boton.setAttribute('aria-label', 'menu');
  boton.setAttribute('aria-controls', overlay.id);
  boton.setAttribute('aria-haspopup', 'menu');
  boton.setAttribute('aria-expanded', 'false');

  const CLASES: [string, string][] = [
    ['.w-nav-link', 'w--nav-link-open'],
    ['.w-dropdown', 'w--nav-dropdown-open'],
    ['.w-dropdown-toggle', 'w--nav-dropdown-toggle-open'],
    ['.w-dropdown-list', 'w--nav-dropdown-list-open'],
  ];
  const marcar = (poner: boolean) => {
    for (const [sel, cls] of CLASES) panel.querySelectorAll(sel).forEach((e) => e.classList.toggle(cls, poner));
  };
  let abierto = false;
  let cerrando: number | undefined;
  const alto = () => document.body.scrollHeight || document.documentElement.scrollHeight;
  const colapsado = () => getComputedStyle(boton).display !== 'none';

  const abrir = () => {
    if (abierto) return;
    abierto = true;
    window.clearTimeout(cerrando);
    panel.setAttribute('data-nav-menu-open', '');
    marcar(true);
    boton.classList.add('w--open');
    const h = alto();
    panel.style.height = `${h}px`;
    overlay.style.height = `${h}px`;
    overlay.style.display = 'block';
    overlay.appendChild(panel);
    const ancho = panel.offsetWidth;
    overlay.style.width = `${ancho}px`;
    panel.style.transition = 'none';
    panel.style.transform = `translateX(${haciaLaDerecha ? ancho : -ancho}px)`;
    void panel.offsetWidth; // fija el estado inicial antes de animar
    panel.style.transition = `transform ${duracion}ms ${easing}`;
    panel.style.transform = 'translateX(0px)';
    boton.setAttribute('aria-expanded', 'true');
    document.addEventListener('click', fuera, true);
  };
  const restaurar = () => {
    panel.style.height = '';
    panel.style.transition = '';
    panel.style.transform = '';
    panel.removeAttribute('data-nav-menu-open');
    marcar(false);
    if (overlay.contains(panel)) {
      if (siguiente && siguiente.parentElement === padre) padre.insertBefore(panel, siguiente);
      else padre.prepend(panel);
    }
    overlay.removeAttribute('style');
    boton.setAttribute('aria-expanded', 'false');
  };
  const cerrar = (inmediato = false) => {
    if (!abierto) return;
    abierto = false;
    boton.classList.remove('w--open');
    document.removeEventListener('click', fuera, true);
    if (inmediato || duracion <= 0) { restaurar(); return; }
    const ancho = panel.offsetWidth;
    panel.style.transition = `transform ${duracion}ms ${easing2}`;
    panel.style.transform = `translateX(${haciaLaDerecha ? ancho : -ancho}px)`;
    cerrando = window.setTimeout(restaurar, duracion + 20);
  };
  const alternar = () => (abierto ? cerrar() : abrir());
  function fuera(e: MouseEvent) {
    const t = e.target as Node;
    if (abierto && !panel.contains(t) && !boton.contains(t)) cerrar();
  }
  boton.addEventListener('click', (e) => { e.preventDefault(); alternar(); });
  boton.addEventListener('keydown', (e) => {
    if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); e.stopPropagation(); alternar(); }
    else if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); cerrar(); }
  });
  // Un enlace de ancla dentro del panel lo cierra (navega en la misma pagina).
  panel.addEventListener('click', (e) => {
    const a = (e.target as HTMLElement).closest('a');
    if (a && (a.getAttribute('href') ?? '').startsWith('#') && abierto) cerrar();
  });
  // Al pasar a escritorio con el panel abierto se cierra en seco, como webflow.js.
  let ancho0 = window.innerWidth;
  window.addEventListener('resize', () => {
    if (window.innerWidth === ancho0) return;
    ancho0 = window.innerWidth;
    if (abierto && !colapsado()) cerrar(true);
  });
}

// --- dropdown: los 5 paneles del menu -------------------------------------------
const dropdowns = [...document.querySelectorAll<HTMLElement>('.menu .w-dropdown')];
const cerradores: (() => void)[] = [];
dropdowns.forEach((dd, i) => {
  const toggle = dd.querySelector<HTMLElement>(':scope > .w-dropdown-toggle');
  const lista = dd.querySelector<HTMLElement>(':scope > .w-dropdown-list');
  if (!toggle || !lista) return;
  const enlaces = () => [...lista.querySelectorAll<HTMLElement>('a')];
  toggle.id ||= `w-dropdown-toggle-${i}`;
  lista.id ||= `w-dropdown-list-${i}`;
  toggle.setAttribute('aria-controls', lista.id);
  toggle.setAttribute('aria-haspopup', 'menu');
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('role', 'button');
  if (!toggle.hasAttribute('tabindex')) toggle.setAttribute('tabindex', '0');
  toggle.querySelector('.w-icon-dropdown-toggle')?.setAttribute('aria-hidden', 'true');
  lista.setAttribute('aria-labelledby', toggle.id);
  for (const a of enlaces()) if (!a.hasAttribute('tabindex')) a.setAttribute('tabindex', '0');
  let abierto = false;
  const cerrar = () => {
    if (!abierto) return;
    abierto = false;
    lista.classList.remove('w--open');
    toggle.classList.remove('w--open');
    toggle.setAttribute('aria-expanded', 'false');
    dd.style.zIndex = '';
    document.removeEventListener('click', fueraDd);
  };
  const abrir = () => {
    if (abierto) return;
    for (const c of cerradores) c(); // solo un panel abierto a la vez
    abierto = true;
    lista.classList.add('w--open');
    toggle.classList.add('w--open');
    toggle.setAttribute('aria-expanded', 'true');
    dd.style.zIndex = '901'; // webflow.js lo sube de 900 a 901 mientras esta abierto
    document.addEventListener('click', fueraDd);
  };
  function fueraDd(e: MouseEvent) {
    if (abierto && !dd.contains(e.target as Node)) cerrar();
  }
  cerradores.push(cerrar);
  const alternar = () => (abierto ? cerrar() : abrir());
  toggle.addEventListener('click', alternar);
  toggle.addEventListener('keydown', (e) => {
    if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); e.stopPropagation(); alternar(); }
  });
  dd.addEventListener('keydown', (e) => {
    if (!abierto) return;
    const ls = enlaces();
    let idx = ls.indexOf(document.activeElement as HTMLElement);
    const ir = (n: number) => { idx = Math.max(0, Math.min(ls.length - 1, n)); ls[idx]?.focus(); };
    switch (e.key) {
      case 'Home': e.preventDefault(); ir(0); break;
      case 'End': e.preventDefault(); ir(ls.length - 1); break;
      case 'Escape': e.stopPropagation(); cerrar(); toggle.focus(); break;
      case 'ArrowRight': case 'ArrowDown': e.preventDefault(); ir(idx + 1); break;
      case 'ArrowLeft': case 'ArrowUp': e.preventDefault(); ir(idx - 1); break;
    }
  });
  // Cierra al salir el foco del desplegable (guardado contra el relatedTarget null de iOS).
  dd.addEventListener('focusout', (e) => {
    const { relatedTarget } = e as FocusEvent;
    if (relatedTarget && !dd.contains(relatedTarget as Node)) cerrar();
  });
  for (const a of enlaces()) if (/^#/.test(a.getAttribute('href') ?? '')) a.addEventListener('click', () => cerrar());
});

// --- IX2 a-27 «Menu Down» / a-28 «Menu Up» ------------------------------------------
// PAGE_SCROLL_DOWN con offset 0 %: con cualquier bajada la barra se va (translateY(-85px)
// + opacity 0, 500 ms easeInOut); con cualquier subida vuelve. El CSS esta en menu.css
// (.menu.pp-escondido). Con el panel movil abierto el scroll esta bloqueado y no llega.
const barra = document.querySelector<HTMLElement>('nav.menu');
if (barra) {
  let ultimo = window.scrollY;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y === ultimo) return;
    barra.classList.toggle('pp-escondido', y > ultimo && y > 0);
    ultimo = y;
  }, { passive: true });
}
