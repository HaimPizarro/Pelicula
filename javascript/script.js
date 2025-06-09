// javascript/script.js

// =============================
//   HELPER: Sesión Usuario
// =============================
function obtenerSesion() {
  const s = sessionStorage.getItem('sesionCineMax');
  return s ? JSON.parse(s) : null;
}

// =============================
//   NAV DINÁMICO + PERFIL + ADMIN + LOGOUT + CARRITO
// =============================
function actualizarNavUsuario() {
  const sesion     = obtenerSesion();
  const isAdmin    = sesion && sesion.rol === 'admin';
  const isCliente  = sesion && sesion.rol === 'cliente';
  const hasSession = !!sesion;

  // — Mostrar el carrito solo si es cliente —
  document.getElementById('nav-cart')
    .classList.toggle('d-none', !isCliente);

  // — Enlaces internos con clase .admin-only —
  document.querySelectorAll('.admin-only')
    .forEach(el => el.classList.toggle('d-none', !isAdmin));

  // — Registro / Login (ocultar si hay sesión) —
  document.getElementById('link-registro')
    ?.classList.toggle('d-none', hasSession);
  document.getElementById('link-login')
    ?.classList.toggle('d-none', hasSession);

  // — Mi Perfil (mostrar solo si hay sesión) —
  document.getElementById('btn-profile')
    .classList.toggle('d-none', !hasSession);

  // — Botón Admin (junto a perfil) —
  document.getElementById('btn-admin')
    .classList.toggle('d-none', !isAdmin);

  // — Logout (mostrar solo si hay sesión) —
  document.getElementById('btn-logout')
    .classList.toggle('d-none', !hasSession);
}

// =============================
//   CONFIGURAR BOTÓN LOGOUT
// =============================
function configurarLogout() {
  const btn = document.getElementById('btn-logout');
  if (!btn) return;
  btn.addEventListener('click', () => {
    if (confirm('¿Seguro que deseas cerrar sesión?')) {
      sessionStorage.removeItem('sesionCineMax');
      localStorage.removeItem('recordarUsuario');
      window.location.href = 'index.html';
    }
  });
}

// =============================
//   EFECTOS Y UTILIDADES
// =============================
function agregarEfectosHover() {
  document.querySelectorAll('.categoria, .pelicula').forEach(el => {
    el.addEventListener('mouseenter', () =>
      el.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)'
    );
    el.addEventListener('mouseleave', () =>
      el.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)'
    );
  });
}

function mostrarContadorVisitas() {
  const v = +localStorage.getItem('visitas') || 0;
  localStorage.setItem('visitas', v + 1);
  console.log(`Número de visitas: ${v + 1}`);
}

function validarNavegacion() {
  document.querySelectorAll('nav a').forEach(a =>
    a.addEventListener('click', () =>
      console.log(`Navegando a: ${a.textContent}`)
    )
  );
}

function animarAlScroll() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.opacity = '1';
        e.target.style.transform = 'translateY(0)';
      }
    });
  });
  document.querySelectorAll('.categoria, .pelicula').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'all 0.6s ease';
    observer.observe(el);
  });
}

function cambiarTema() {
  document.body.classList.toggle('tema-oscuro');
  localStorage.setItem(
    'tema',
    document.body.classList.contains('tema-oscuro') ? 'oscuro' : 'claro'
  );
}

function aplicarTemaGuardado() {
  if (localStorage.getItem('tema') === 'oscuro') {
    document.body.classList.add('tema-oscuro');
  }
}

// =============================
//   INICIALIZACIÓN AL CARGAR
// =============================
document.addEventListener('DOMContentLoaded', () => {
  console.log('¡Bienvenido a CineMax!');

  // 1) Nav dinámico (incluye carrito), perfil, admin y logout
  actualizarNavUsuario();
  configurarLogout();

  // 2) Otras utilidades
  agregarEfectosHover();
  mostrarContadorVisitas();
  validarNavegacion();
  animarAlScroll();
  aplicarTemaGuardado();
});