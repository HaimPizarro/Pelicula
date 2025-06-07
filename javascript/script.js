// =============================
//   HELPER: Sesión Usuario
// =============================
function obtenerSesion() {
  const sesion = sessionStorage.getItem('sesionCineMax');
  return sesion ? JSON.parse(sesion) : null;
}

// =============================
//   NAV DINÁMICO + LOGOUT
// =============================
function actualizarNavUsuario() {
  const sesion = obtenerSesion();
  const isAdmin = sesion && sesion.rol === 'admin';

  // Panel Admin (clase admin-only)
  document.querySelectorAll('.admin-only')
    .forEach(el => el.classList.toggle('d-none', !isAdmin));

  // Registro / Login / Logout
  document.getElementById('link-registro')
    .classList.toggle('d-none', !!sesion);
  document.getElementById('link-login')
    .classList.toggle('d-none', !!sesion);
  document.getElementById('btn-logout')
    .classList.toggle('d-none', !sesion);
}

function configurarLogout() {
  const btn = document.getElementById('btn-logout');
  if (!btn) return;
  btn.addEventListener('click', () => {
    if (confirm('¿Seguro que deseas cerrar sesión?')) {
      sessionStorage.removeItem('sesionCineMax');
      localStorage.removeItem('recordarUsuario');
      actualizarNavUsuario();
      window.location.reload();
    }
  });
}

// =============================
//   EFECTOS Y UTILIDADES
// =============================
function agregarEfectosHover() {
  document.querySelectorAll('.categoria, .pelicula').forEach(el => {
    el.addEventListener('mouseenter', () => el.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)');
    el.addEventListener('mouseleave', () => el.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)');
  });
}

function mostrarContadorVisitas() {
  const v = +localStorage.getItem('visitas') || 0;
  localStorage.setItem('visitas', v + 1);
  console.log(`Número de visitas: ${v + 1}`);
}

function validarNavegacion() {
  document.querySelectorAll('nav a').forEach(a =>
    a.addEventListener('click', () => console.log(`Navegando a: ${a.textContent}`))
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
  localStorage.setItem('tema', document.body.classList.contains('tema-oscuro') ? 'oscuro' : 'claro');
}

function aplicarTemaGuardado() {
  if (localStorage.getItem('tema') === 'oscuro') {
    document.body.classList.add('tema-oscuro');
  }
}

// =============================
//   VALIDACIÓN FORMULARIO
// =============================
function initRegistroValidation() {
  const form = document.getElementById('registroForm');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    Array.from(form.elements).forEach(el => el.classList.remove('is-invalid'));

    const nombre   = form.nombre.value.trim();
    const usuario  = form.usuario.value.trim();
    const correo   = form.correo.value.trim();
    const fechaNac = form.fechaNac.value;
    const clave    = form.clave.value;
    const clave2   = form.clave2.value;

    let valido = true;
    const hoy = new Date();
    const años = hoy.getFullYear() - new Date(fechaNac).getFullYear();
    const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    const passRegex  = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,18}$/;
    const marcarError = id => {
      form.querySelector(`#${id}`).classList.add('is-invalid');
      valido = false;
    };

    if (!nombre)                  marcarError('nombre');
    if (!usuario)                 marcarError('usuario');
    if (!emailRegex.test(correo)) marcarError('correo');
    if (!fechaNac || años < 13)   marcarError('fechaNac');
    if (!passRegex.test(clave))   marcarError('clave');
    if (clave !== clave2)         marcarError('clave2');
    if (!valido) return;

    alert('🎉 Registro exitoso. ¡Bienvenido/a a CineMax!');
    form.reset();
  });
}

// =============================
//   INIT TODO AL DOMContentLoaded
// =============================
document.addEventListener('DOMContentLoaded', () => {
  console.log('¡Bienvenido a CineMax!');

  // 1) Nav + Logout
  actualizarNavUsuario();
  configurarLogout();

  // 2) Utilidades
  agregarEfectosHover();
  mostrarContadorVisitas();
  validarNavegacion();
  animarAlScroll();
  aplicarTemaGuardado();

  // 3) Validación de registro
  initRegistroValidation();
});
