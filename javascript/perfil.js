/* ============================================================
   PERFIL – Ver / editar datos básicos del usuario logueado
   ============================================================ */

/* ---------- helpers de sesión y almacenamiento ---------- */
function obtenerSesion() {
  const s = sessionStorage.getItem('sesionCineMax');
  return s ? JSON.parse(s) : null;
}
function getAllUsers() {
  return JSON.parse(localStorage.getItem('usersCineMax') || '{}');
}
function saveAllUsers(u) {
  localStorage.setItem('usersCineMax', JSON.stringify(u));
}

/* ---------- edición de NOMBRE ---------- */
function configurarEdicionNombre(sesion) {
  const btnEdit = document.getElementById('btn-edit-nombre');
  const btnSave = document.getElementById('btn-save-nombre');
  const spanTxt = document.getElementById('nombre-text');
  const inpEdit = document.getElementById('nombre-input');

  btnEdit.addEventListener('click', () => {
    // → modo edición
    spanTxt.classList.add('d-none');
    inpEdit.classList.remove('d-none');
    inpEdit.value = spanTxt.textContent;
    btnEdit.classList.add('d-none');
    btnSave.classList.remove('d-none');
    inpEdit.focus();
  });

  function guardarNombre() {
    const nuevo = inpEdit.value.trim();
    if (!nuevo) {
      alert('El nombre no puede quedar vacío.'); return;
    }

    // 1) actualizar objeto sesión y sessionStorage
    sesion.nombre = nuevo;
    sessionStorage.setItem('sesionCineMax', JSON.stringify(sesion));

    // 2) actualizar “BD” localStorage
    const users = getAllUsers();
    if (users[sesion.email]) {
      users[sesion.email].nombre = nuevo;
      saveAllUsers(users);
    }

    // 3) restaurar UI
    spanTxt.textContent = nuevo;
    inpEdit.classList.add('d-none');
    spanTxt.classList.remove('d-none');
    btnSave.classList.add('d-none');
    btnEdit.classList.remove('d-none');
  }

  btnSave.addEventListener('click', guardarNombre);
  inpEdit.addEventListener('keypress', e => {
    if (e.key === 'Enter') guardarNombre();
  });
}

/* ---------- edición de CONTRASEÑA ---------- */
function configurarEdicionPassword(sesion) {
  const btnEditPass = document.getElementById('btn-edit-password');
  const formPass    = document.getElementById('password-form');
  const btnSavePass = document.getElementById('btn-save-password');
  const inp1        = document.getElementById('pass-input');
  const inp2        = document.getElementById('pass2-input');

  btnEditPass.addEventListener('click', () => {
    formPass.classList.toggle('d-none');
    inp1.value = '';
    inp2.value = '';
  });

  btnSavePass.addEventListener('click', () => {
    const p1 = inp1.value.trim();
    const p2 = inp2.value.trim();
    const regex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,18}$/;

    if (!regex.test(p1)) {
      alert('La contraseña debe tener 6–18 caracteres, al menos una mayúscula y un número.');
      return;
    }
    if (p1 !== p2) {
      alert('Las contraseñas no coinciden.'); return;
    }

    // 1) sessionStorage
    sesion.clave = p1;                 // usamos la misma key que en “BD”
    sessionStorage.setItem('sesionCineMax', JSON.stringify(sesion));

    // 2) localStorage
    const users = getAllUsers();
    if (users[sesion.email]) {
      users[sesion.email].clave = p1;
      saveAllUsers(users);
    }

    formPass.classList.add('d-none');
    inp1.value = inp2.value = '';
    alert('Contraseña actualizada.');
  });
}

/* ---------- init página ---------- */
document.addEventListener('DOMContentLoaded', () => {
  const sesion = obtenerSesion();

  /* 1. validar acceso ----------------------------------------------------- */
  if (!sesion) {
    document.getElementById('not-auth').classList.remove('d-none');
    return;
  }

  /* 2. mostrar datos ------------------------------------------------------ */
  document.getElementById('profile-content').classList.remove('d-none');
  document.getElementById('email-text').textContent  = sesion.email;
  document.getElementById('nombre-text').textContent = sesion.nombre;

  /* 3. nav + logout globales (definidos en script.js) --------------------- */
  if (typeof actualizarNavUsuario === 'function') actualizarNavUsuario();
  if (typeof configurarLogout     === 'function') configurarLogout();

  /* 4. configurar edición ------------------------------------------------- */
  configurarEdicionNombre(sesion);
  configurarEdicionPassword(sesion);
});