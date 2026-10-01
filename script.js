document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('#menuToggle');
  const nav = document.querySelector('#mainNav');
  const mobileMenu = window.matchMedia('(max-width: 800px)');
  nav.inert = mobileMenu.matches;

  const setMenu = (open) => {
    nav.classList.toggle('open', open);
    nav.inert = mobileMenu.matches && !open;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    document.body.classList.toggle('menu-open', open);
    if (open) nav.querySelector('a').focus();
  };

  toggle.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
  mobileMenu.addEventListener('change', (event) => {
    if (!event.matches) setMenu(false);
    else nav.inert = true;
  });
  nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && nav.classList.contains('open')) {
      setMenu(false);
      toggle.focus();
    }
  });

  window.addEventListener('scroll', () => header.classList.toggle('scrolled', window.scrollY > 20), { passive: true });

  const params = new URLSearchParams(window.location.search);
  const brand = params.get('e') || params.get('n');
  if (brand) {
    document.querySelectorAll('[data-dynamic]').forEach((element) => { element.textContent = brand; });
    document.title = `${brand} | Demo de pintura`;
  }

  const phone = params.get('t');
  if (phone) {
    let normalized = phone.replace(/\D/g, '');
    if (normalized.startsWith('549')) normalized = normalized.slice(3);
    else if (normalized.startsWith('54')) normalized = normalized.slice(2).replace(/^0/, '');
    else normalized = normalized.replace(/^0/, '');
    if (normalized) {
      document.querySelectorAll('[data-whatsapp]').forEach((link) => {
        link.href = `https://wa.me/549${normalized}?text=Hola%2C%20quiero%20contar%20mi%20proyecto%20de%20pintura`;
      });
    }
  }

  const contactForm = document.querySelector('#contactForm');
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!contactForm.reportValidity()) return;

    const contactLink = document.querySelector('#contacto [data-whatsapp]');
    const destination = new URL(contactLink.href);
    const formData = new FormData(contactForm);
    const message = `Hola, quiero consultar por un proyecto de pintura. Necesito pintar: ${formData.get('proyecto').trim()}. Estoy en: ${formData.get('zona').trim()}.`;
    destination.searchParams.set('text', message);
    window.location.assign(destination.href);
  });

  document.querySelectorAll('details').forEach((item) => {
    const summary = item.querySelector('summary');
    const syncFaqState = () => summary.setAttribute('aria-expanded', item.open ? 'true' : 'false');
    syncFaqState();
    item.addEventListener('toggle', syncFaqState);
  });
});
