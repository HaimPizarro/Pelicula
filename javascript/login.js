/* ---------- Helpers ---------- */
function getAllUsers() {
  return JSON.parse(localStorage.getItem('usersCineMax') || '{}');
}

function ensureDefaultUsers() {
  const defaults = {
    'cliente@cinemax.com': {
      email: 'cliente@cinemax.com',
      nombre: 'Cliente 1',
      clave: 'Cliente123',
      rol: 'cliente'
    },
    'admin@cinemax.com': {
      email: 'admin@cinemax.com',
      nombre: 'Haim Pizarro',
      clave: 'Admin123',
      rol: 'admin'
    }
  };

  const users = getAllUsers();
  let changed = false;

  for (const [email, data] of Object.entries(defaults)) {
    if (!users[email]) {
      users[email] = data;
      changed = true;
    }
  }

  if (changed) {
    localStorage.setItem('usersCineMax', JSON.stringify(users));
  }
}
ensureDefaultUsers();

/* ---------- Lógica de Login ---------- */
document.addEventListener('DOMContentLoaded', () => {
  const form     = document.getElementById('loginForm');
  const emailInp = document.getElementById('email');
  const passInp  = document.getElementById('password');
  const recordar = document.getElementById('recordar');

  // Badges demo
  document.querySelectorAll('.role-badge').forEach(badge => {
    badge.addEventListener('click', () => {
      if (badge.classList.contains('cliente')) {
        emailInp.value = 'cliente@cinemax.com';
        passInp.value  = 'Cliente123';
      } else {
        emailInp.value = 'admin@cinemax.com';
        passInp.value  = 'Admin123';
      }
      document.querySelectorAll('.role-badge').forEach(b => b.classList.remove('selected'));
      badge.classList.add('selected');
    });
  });

  // Recordar usuario
  const recuerdame = localStorage.getItem('recordarUsuario');
  if (recuerdame) {
    emailInp.value = recuerdame;
    recordar.checked = true;
  }

  // Sesión activa
  const sesionActiva = sessionStorage.getItem('sesionCineMax');
  if (sesionActiva) {
    const s = JSON.parse(sesionActiva);
    if (confirm(`Ya estás logueado como ${s.nombre}. ¿Continuar con esa sesión?`)) {
      window.location.href = s.rol === 'admin' ? 'admin.html' : 'index.html';
      return;
    }
    sessionStorage.removeItem('sesionCineMax');
  }

  // Validación y login
  form.addEventListener('submit', e => {
    e.preventDefault();
    form.querySelectorAll('.form-control').forEach(i => i.classList.remove('is-invalid'));

    const email = emailInp.value.trim().toLowerCase();
    const pass  = passInp.value.trim();
    const emailRegex = /^[\w.-]+@[\w.-]+\.\w+$/;
    let ok = true;

    if (!emailRegex.test(email)) {
      emailInp.classList.add('is-invalid');
      ok = false;
    }

    if (!pass) {
      passInp.classList.add('is-invalid');
      ok = false;
    }

    if (!ok) return;

    const usuarios = getAllUsers();
    console.log("Usuarios cargados:", usuarios);  // 👈 Para ver si están bien

    const usuario = usuarios[email];

    if (!usuario || usuario.clave !== pass) {
      emailInp.classList.add('is-invalid');
      passInp.classList.add('is-invalid');
      mostrarMsg('Credenciales incorrectas. Verifica tu email y contraseña.', 'danger');
      return;
    }

    // Éxito
    const sesion = {
      email,
      rol: usuario.rol,
      nombre: usuario.nombre,
      perfil: usuario.perfil,
      fechaLogin: new Date().toISOString()
    };
    sessionStorage.setItem('sesionCineMax', JSON.stringify(sesion));
    if (recordar.checked) localStorage.setItem('recordarUsuario', email);

    mostrarMsg(`¡Bienvenido/a ${usuario.nombre}! Redirigiendo…`, 'success');

    setTimeout(() => {
      window.location.href = usuario.rol === 'admin' ? 'admin.html' : 'index.html';
    }, 1200);
  });

  function mostrarMsg(msg, tipo) {
    const div = document.createElement('div');
    div.className = `alert alert-${tipo} mt-3`;
    div.textContent = msg;
    form.appendChild(div);
    setTimeout(() => div.remove(), 4000);
  }

  console.log('Sistema de Login CineMax inicializado');
});