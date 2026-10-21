/**
 * F7 · Lightbox nativo de las 23 galerias (a.w-lightbox + script.w-json). Construye el
 * MISMO DOM que el modulo `lightbox` de webflow.js (clases .w-lightbox-*, ids, roles y
 * aria medidos sobre el build de F8, 20-oct-2026), asi que el CSS de webflow.css lo
 * viste sin tocar nada. Lo que hace: fondo que se funde en 300 ms, vista con la foto
 * (entra desde ±80 px), flechas que se apagan en los extremos, tira de miniaturas
 * (tall/wide segun la foto), cierre con Escape / X / clic en el fondo, siguiente con
 * clic en la foto o flechas del teclado, deslizar en tactil, el resto de la pagina con
 * aria-hidden y tabindex=-1 mientras esta abierto, y el foco vuelve al enlace al cerrar.
 * Se carga solo en las paginas que tienen galeria (import dinamico desde interacciones.ts).
 */
type Item = { url: string; thumbnailUrl?: string; caption?: string; alt?: string };
type Grupo = { items: Item[] };

const el = (clases: string, etiqueta = 'div') => {
  const e = document.createElement(etiqueta);
  e.className = clases.split(' ').map((c) => `w-lightbox-${c}`).join(' ');
  return e;
};
const attrs = (e: Element, a: Record<string, string>) => { for (const k in a) e.setAttribute(k, a[k]); };

let fondo: HTMLElement, contenido: HTMLElement, tira: HTMLElement, spinner: HTMLElement;
let izq: HTMLElement, der: HTMLElement, cierre: HTMLElement;
let vista: HTMLElement | undefined;
let items: Item[] = [];
let actual = -1;
let anclaActiva: HTMLElement | undefined;
let aislados: { e: Element; hidden: string | null; tab: string | null }[] = [];

const activar = (control: HTMLElement, si: boolean) => {
  control.classList.toggle('w-lightbox-inactive', !si);
  attrs(control, { 'aria-hidden': String(!si), tabindex: si ? '0' : '-1' });
};

function construir() {
  if (fondo) return;
  izq = el('control left inactive');
  der = el('control right inactive');
  for (const [c, nombre] of [[izq, 'previous image'], [der, 'next image']] as const) {
    attrs(c, { role: 'button', 'aria-hidden': 'true', 'aria-controls': 'w-lightbox-view', 'aria-label': nombre, tabindex: '-1' });
  }
  cierre = el('control close');
  attrs(cierre, { role: 'button', 'aria-label': 'close lightbox', tabindex: '0' });
  spinner = el('spinner');
  attrs(spinner, { role: 'progressbar', 'aria-live': 'polite', 'aria-hidden': 'false', 'aria-busy': 'true', 'aria-valuemin': '0', 'aria-valuemax': '100', 'aria-valuenow': '0', 'aria-valuetext': 'Loading image' });
  tira = el('strip');
  tira.setAttribute('role', 'tablist');
  contenido = el('content');
  contenido.append(spinner, izq, der, cierre);
  const contenedor = el('container');
  contenedor.append(contenido, tira);
  fondo = el('backdrop hide');
  fondo.append(contenedor);

  tira.addEventListener('click', (e) => {
    const it = (e.target as HTMLElement).closest('.w-lightbox-item');
    if (it) mostrar([...tira.children].indexOf(it));
  });
  contenido.addEventListener('click', (e) => {
    const t = e.target as HTMLElement;
    if (t === izq) mostrar(actual - 1);
    else if (t === der) mostrar(actual + 1);
    else if (t === cierre) ocultar();
    else if (t.closest('.w-lightbox-image, .w-lightbox-caption')) mostrar(actual + 1);
    else if (t.classList.contains('w-lightbox-view')) ocultar();
  });
  contenido.addEventListener('dragstart', (e) => { if ((e.target as HTMLElement).tagName === 'IMG') e.preventDefault(); });
  fondo.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') ocultar();
    else if (e.key === 'ArrowLeft') mostrar(actual - 1);
    else if (e.key === 'ArrowRight') mostrar(actual + 1);
    else if (e.key === 'Enter' || e.key === ' ') {
      const f = document.activeElement as HTMLElement | null;
      if (f && fondo.contains(f) && f.matches('.w-lightbox-control, .w-lightbox-item')) { e.preventDefault(); f.click(); }
    }
  });
  // Deslizar en tactil: webflow.js lo hacia con su evento `swipe`.
  let x0: number | null = null;
  contenido.addEventListener('pointerdown', (e) => { x0 = e.pointerType === 'touch' ? e.clientX : null; });
  contenido.addEventListener('pointerup', (e) => {
    if (x0 !== null && Math.abs(e.clientX - x0) > 40) mostrar(e.clientX < x0 ? actual + 1 : actual - 1);
    x0 = null;
  });
  document.body.append(fondo);
}

function mostrar(i: number) {
  const item = items[i];
  if (i === actual || !item) return;
  const previo = actual;
  actual = i;
  attrs(spinner, { 'aria-hidden': 'false', 'aria-busy': 'true', 'aria-valuenow': '0', 'aria-valuetext': 'Loading image' });
  spinner.classList.remove('w-lightbox-hide');
  const img = new Image();
  img.className = 'w-lightbox-img w-lightbox-image';
  img.alt = item.alt ?? '';
  img.onload = img.onerror = () => {
    if (i !== actual) return;
    const figura = el('figure', 'figure');
    figura.append(img);
    if (item.caption) { const c = el('caption', 'figcaption'); c.textContent = item.caption; figura.append(c); }
    const marco = el('frame');
    marco.append(figura);
    const nueva = el('view');
    nueva.tabIndex = 0;
    nueva.id = 'w-lightbox-view';
    nueva.append(marco);
    attrs(spinner, { 'aria-hidden': 'true', 'aria-busy': 'false', 'aria-valuenow': '100', 'aria-valuetext': 'Loaded image' });
    spinner.classList.add('w-lightbox-hide');
    activar(izq, i > 0);
    activar(der, i < items.length - 1);
    if (i === 0 && document.activeElement === izq) der.focus();
    if (i === items.length - 1 && document.activeElement === der) izq.focus();
    const vieja = vista;
    vista = nueva;
    spinner.before(nueva);
    if (vieja) {
      vieja.style.transition = 'opacity .3s';
      vieja.style.opacity = '0';
      setTimeout(() => vieja.remove(), 300);
      nueva.style.transform = `translateX(${i > previo ? 80 : -80}px)`;
      nueva.style.opacity = '0';
      void nueva.offsetWidth;
      nueva.style.transition = 'opacity .3s, transform .3s';
      nueva.style.transform = 'translateX(0px)';
    }
    nueva.style.opacity = '1';
    [...tira.children].forEach((it, k) => {
      it.classList.toggle('w-lightbox-active', k === i);
      if (k === i) { it.setAttribute('aria-selected', 'true'); tira.scrollLeft = (it as HTMLElement).offsetLeft - tira.clientWidth / 2 + (it as HTMLElement).offsetWidth / 2; }
      else it.removeAttribute('aria-selected');
    });
  };
  img.src = item.url;
}

function abrir(grupo: Grupo, indice: number, ancla: HTMLElement) {
  construir();
  items = grupo.items;
  tira.replaceChildren();
  contenido.classList.toggle('w-lightbox-group', items.length > 1);
  if (items.length > 1) {
    items.forEach((it, k) => {
      const celda = el('item');
      attrs(celda, { tabindex: '0', 'aria-controls': 'w-lightbox-view', role: 'tab', 'aria-label': `show item ${k + 1} of ${items.length}` });
      const mini = el('thumbnail');
      const im = new Image();
      im.className = 'w-lightbox-img w-lightbox-thumbnail-image';
      im.alt = '';
      im.onload = () => im.classList.add(im.naturalWidth > im.naturalHeight ? 'w-lightbox-wide' : 'w-lightbox-tall');
      im.src = it.thumbnailUrl || it.url;
      mini.append(im);
      celda.append(mini);
      tira.append(celda);
    });
  }
  // El resto de la pagina sale del arbol de accesibilidad y del orden de tabulacion.
  aislados = [...document.body.children]
    .filter((e) => e !== fondo && e.tagName !== 'SCRIPT')
    .map((e) => ({ e, hidden: e.getAttribute('aria-hidden'), tab: e.getAttribute('tabindex') }));
  for (const { e } of aislados) attrs(e, { 'aria-hidden': 'true', tabindex: '-1' });
  anclaActiva = ancla;
  ancla.classList.add('active-lightbox');
  document.documentElement.classList.add('w-lightbox-noscroll');
  fondo.classList.remove('w-lightbox-hide');
  fondo.style.opacity = '0';
  void fondo.offsetWidth;
  fondo.style.transition = 'opacity .3s';
  fondo.style.opacity = '1';
  cierre.focus();
  actual = -1;
  vista = undefined;
  mostrar(indice);
}

function ocultar() {
  if (!fondo || fondo.classList.contains('w-lightbox-hide')) return;
  fondo.style.opacity = '0';
  setTimeout(() => {
    fondo.classList.add('w-lightbox-hide');
    fondo.style.transition = '';
    tira.replaceChildren();
    tira.scrollLeft = 0;
    document.documentElement.classList.remove('w-lightbox-noscroll');
    vista?.remove();
    vista = undefined;
    actual = -1;
    contenido.classList.remove('w-lightbox-group');
    activar(izq, false);
    activar(der, false);
    for (const { e, hidden, tab } of aislados) {
      hidden === null ? e.removeAttribute('aria-hidden') : e.setAttribute('aria-hidden', hidden);
      tab === null ? e.removeAttribute('tabindex') : e.setAttribute('tabindex', tab);
    }
    aislados = [];
    anclaActiva?.classList.remove('active-lightbox');
    anclaActiva?.focus();
    anclaActiva = undefined;
  }, 300);
}

// Los enlaces: un grupo por `group` del JSON (en orden de documento), o uno propio si no
// tiene grupo. El indice del enlace es la posicion de su primer item dentro del grupo.
const grupos = new Map<string, Grupo>();
document.querySelectorAll<HTMLAnchorElement>('a.w-lightbox').forEach((a, n) => {
  let json: { items?: Item[]; group?: string } = {};
  try { json = JSON.parse(a.querySelector('script.w-json')?.textContent ?? '{}'); } catch { /* sin datos: no abre */ }
  const grupo = grupos.get(json.group || `#${n}`) ?? { items: [] };
  grupos.set(json.group || `#${n}`, grupo);
  const indice = grupo.items.length;
  const alt = a.querySelector('img')?.alt ?? '';
  grupo.items.push(...(json.items ?? []).map((it) => ({ ...it, alt })));
  attrs(a, { 'aria-label': 'open lightbox', 'aria-haspopup': 'dialog' });
  a.addEventListener('click', (e) => {
    e.preventDefault();
    if (grupo.items.length) abrir(grupo, indice, a);
  });
});
