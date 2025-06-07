// =============================
//   HELPER: Sesión Usuario
// =============================
function obtenerSesion() {
  const s = sessionStorage.getItem('sesionCineMax');
  return s ? JSON.parse(s) : null;
}

// =============================
//   INIT PERFIL
// =============================
document.addEventListener('DOMContentLoaded', () => {
  const sesion = obtenerSesion();
  if (!sesion) {
    document.getElementById('not-auth').classList.remove('d-none');
    return;
  }
  document.getElementById('profile-content').classList.remove('d-none');

  // Rellenar datos
  document.getElementById('email-text').textContent  = sesion.email;
  document.getElementById('nombre-text').textContent = sesion.nombre;

  // Nav + logout
  actualizarNavUsuario();
  configurarLogout();

  // Configurar edición de nombre
  configurarEdicionNombre(sesion);
  // Configurar edición de contraseña
  configurarEdicionPassword(sesion);
});

// =============================
//   EDITAR NOMBRE
// =============================
function configurarEdicionNombre(sesion) {
  const btn = document.getElementById('btn-edit-nombre');
  const txt = document.getElementById('nombre-text');
  const inp = document.getElementById('nombre-input');
  const icon= btn.querySelector('i');

  btn.addEventListener('click', () => {
    const esModoEdicion = icon.classList.contains('bi-check-lg');

    if (!esModoEdicion) {
      // Entrar a edición
      inp.value = txt.textContent;
      txt.classList.add('d-none');
      inp.classList.remove('d-none');
      icon.classList.replace('bi-pencil', 'bi-check-lg');
      inp.focus();
    } else {
      // Guardar
      const nuevo = inp.value.trim();
      if (!nuevo) {
        return alert('El nombre no puede quedar vacío.');
      }
      // Actualizar sesión y almacenamiento
      sesion.nombre = nuevo;
      sessionStorage.setItem('sesionCineMax', JSON.stringify(sesion));
      const users = JSON.parse(localStorage.getItem('usersCineMax') || '{}');
      if (users[sesion.email]) users[sesion.email].nombre = nuevo;
      localStorage.setItem('usersCineMax', JSON.stringify(users));
      // Volver a lectura
      txt.textContent = nuevo;
      inp.classList.add('d-none');
      txt.classList.remove('d-none');
      icon.classList.replace('bi-check-lg', 'bi-pencil');
    }
  });
}

// =============================
//   EDITAR CONTRASEÑA
// =============================
function configurarEdicionPassword(sesion) {
  const btnPass = document.getElementById('btn-edit-password');
  const formP  = document.getElementById('password-form');
  const saveBtn= document.getElementById('btn-save-password');

  btnPass.addEventListener('click', () => {
    formP.classList.toggle('d-none');
  });

  saveBtn.addEventListener('click', e => {
    e.preventDefault();
    const pass  = document.getElementById('pass-input').value;
    const pass2 = document.getElementById('pass2-input').value;
    const regex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,18}$/;
    if (!regex.test(pass))    return alert('Contraseña inválida.');
    if (pass !== pass2)       return alert('Las contraseñas no coinciden.');
    // Guardar
    sesion.password = pass;
    sessionStorage.setItem('sesionCineMax', JSON.stringify(sesion));
    const users = JSON.parse(localStorage.getItem('usersCineMax') || '{}');
    if (users[sesion.email]) users[sesion.email].password = pass;
    localStorage.setItem('usersCineMax', JSON.stringify(users));
    // Reset UI
    document.getElementById('pass-input').value  = '';
    document.getElementById('pass2-input').value = '';
    formP.classList.add('d-none');
    alert('Contraseña actualizada.');
  });
}
