// ---------- Helpers ----------
function getAllUsers() {
  return JSON.parse(localStorage.getItem('usersCineMax') || '{}');
}
function initDefaultUsers() {
  if (localStorage.getItem('usersCineMax')) return;
  localStorage.setItem(
    'usersCineMax',
    JSON.stringify({
      'cliente@cinemax.com': {
        email: 'cliente@cinemax.com',
        nombre: 'Juan Pérez',
        clave: 'Cliente123',
        rol: 'cliente'
      },
      'admin@cinemax.com': {
        email: 'admin@cinemax.com',
        nombre: 'Haim Pizarro',
        clave: 'Admin123',
        rol: 'admin'
      }
    })
  );
}
initDefaultUsers();

// ---------- Lógica de Login ----------
document.addEventListener('DOMContentLoaded', () => {
  const form     = document.getElementById('loginForm');
  const emailInp = document.getElementById('email');
  const passInp  = document.getElementById('password');
  const recordar = document.getElementById('recordar');

  // Rellenar con credenciales demo al hacer clic en el badge
  document.querySelectorAll('.role-badge').forEach(badge => {
    badge.addEventListener('click', () => {
      if (badge.classList.contains('cliente')) {
        emailInp.value = 'cliente@cinemax.com';
        passInp.value  = 'Cliente123';
      } else {
        emailInp.value = 'admin@cinemax.com';
        passInp.value  = 'Admin123';
      }
      document.querySelectorAll('.role-badge').forEach(b => 
        b.classList.remove('selected')
      );
      badge.classList.add('selected');
    });
  });

  // Cargar usuario recordado
  const recuerdame = localStorage.getItem('recordarUsuario');
  if (recuerdame) {
    emailInp.value = recuerdame;
    recordar.checked = true;
  }

  // Detectar sesión activa
  const sesionActiva = sessionStorage.getItem('sesionCineMax');
  if (sesionActiva) {
    const s = JSON.parse(sesionActiva);
    if (confirm(`Ya estás logueado como ${s.nombre}. ¿Continuar con esa sesión?`)) {
      window.location.href = s.rol === 'admin' ? 'admin.html' : 'index.html';
      return;
    }
    sessionStorage.removeItem('sesionCineMax');
  }

  // Manejo del submit
  form.addEventListener('submit', e => {
    e.preventDefault();
    form.querySelectorAll('.form-control').forEach(i => i.classList.remove('is-invalid'));

    const email = emailInp.value.trim().toLowerCase();
    const pass  = passInp.value.trim();
    let ok = true;

    if (!email || !email.includes('@')) {
      emailInp.classList.add('is-invalid');
      ok = false;
    }
    if (!pass) {
      passInp.classList.add('is-invalid');
      ok = false;
    }
    if (!ok) return;

    const usuarios = getAllUsers();
    const usuario  = usuarios[email];

    if (!usuario || usuario.clave !== pass) {
      emailInp.classList.add('is-invalid');
      passInp.classList.add('is-invalid');
      mostrarMsg('Credenciales incorrectas. Verifica tu email y contraseña.', 'danger');
      return;
    }

    // Login exitoso
    const sesion = {
      email,
      rol: usuario.rol,
      nombre: usuario.nombre,
      perfil: usuario.perfil,
      fechaLogin: new Date().toISOString()
    };
    sessionStorage.setItem('sesionCineMax', JSON.stringify(sesion));
    if (recordar.checked) {
      localStorage.setItem('recordarUsuario', email);
    }
    mostrarMsg(`¡Bienvenido/a ${usuario.nombre}! Redirigiendo…`, 'success');

    setTimeout(() => {
      window.location.href = usuario.rol === 'admin' ? 'admin.html' : 'index.html';
    }, 1200);
  });

  // Muestra mensaje de éxito o error
  function mostrarMsg(msg, tipo) {
    const div = document.createElement('div');
    div.className = `alert alert-${tipo} mt-3`;
    div.textContent = msg;
    form.appendChild(div);
    setTimeout(() => div.remove(), 4000);
  }

  console.log('Sistema de Login CineMax inicializado');
});