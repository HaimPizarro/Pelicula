// admin.js

// 1) Inicializar usuarios en localStorage si no existen
if (!localStorage.getItem('usersCineMax')) {
  const initial = {
    'cliente@cinemax.com': { email:'cliente@cinemax.com', nombre:'Juan Pérez', clave:'Cliente123', rol:'cliente' },
    'admin@cinemax.com':   { email:'admin@cinemax.com',   nombre:'María González', clave:'Admin123',   rol:'admin' }
  };
  localStorage.setItem('usersCineMax', JSON.stringify(initial));
}

// 2) Helpers de almacenamiento
function getAllUsers() {
  return JSON.parse(localStorage.getItem('usersCineMax') || '{}');
}
function saveAllUsers(u) {
  localStorage.setItem('usersCineMax', JSON.stringify(u));
}
function obtenerSesion() {
  const s = sessionStorage.getItem('sesionCineMax');
  return s ? JSON.parse(s) : null;
}

// 3) Inicializar panel
function initAdminPage() {
  const sesion = obtenerSesion();
  if (!sesion || sesion.rol !== 'admin') {
    document.getElementById('not-authorized').classList.remove('d-none');
    return;
  }
  document.getElementById('admin-content').classList.remove('d-none');
  renderUsersTable();
}

// 4) Renderizar tabla de usuarios
function renderUsersTable() {
  const tbody = document.getElementById('users-table-body');
  tbody.innerHTML = '';
  const users = getAllUsers();

  Object.values(users).forEach(user => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${user.email}</td>
      <td>${user.nombre}</td>
      <td>${user.rol.charAt(0).toUpperCase()+user.rol.slice(1)}</td>
      <td>
        <button class="btn btn-sm btn-primary edit-user" data-email="${user.email}">
          Editar
        </button>
        ${user.email !== obtenerSesion().email
          ? `<button class="btn btn-sm btn-danger ms-2 delete-user" data-email="${user.email}">
               Eliminar
             </button>`
          : ''
        }
      </td>`;
    tbody.appendChild(tr);
  });

  // Asignar eventos
  document.querySelectorAll('.edit-user')
    .forEach(btn => btn.addEventListener('click', () => openEditModal(btn.dataset.email)));
  document.querySelectorAll('.delete-user')
    .forEach(btn => btn.addEventListener('click', () => {
      if (confirm(`¿Eliminar a ${btn.dataset.email}?`)) deleteUser(btn.dataset.email);
    }));
}

// 5) Abrir modal y precargar datos
function openEditModal(email) {
  const users = getAllUsers();
  const u = users[email];
  if (!u) return;

  document.getElementById('editar-email-original').value   = u.email;
  document.getElementById('editar-nombre-completo').value = u.nombre;
  document.getElementById('editar-clave').value          = '';
  document.getElementById('editar-clave2').value         = '';
  document.getElementById('editar-rol').value            = u.rol;

  new bootstrap.Modal(document.getElementById('modalEditarUsuario')).show();
}

// 6) Guardar cambios del modal
document.getElementById('form-editar-usuario').addEventListener('submit', function(e) {
  e.preventDefault();

  const originalEmail = document.getElementById('editar-email-original').value;
  const nombreNew     = document.getElementById('editar-nombre-completo').value.trim();
  const passNew       = document.getElementById('editar-clave').value;
  const pass2New      = document.getElementById('editar-clave2').value;
  const rolNew        = document.getElementById('editar-rol').value;

  // Validar contraseñas si ingresadas
  if ((passNew || pass2New) && passNew !== pass2New) {
    document.getElementById('editar-clave2').classList.add('is-invalid');
    return;
  }

  const users = getAllUsers();
  const target = users[originalEmail];

  // Actualizar campos permitidos
  target.nombre = nombreNew;
  if (passNew) target.clave = passNew;
  target.rol    = rolNew;

  saveAllUsers(users);
  bootstrap.Modal.getInstance(document.getElementById('modalEditarUsuario')).hide();
  renderUsersTable();
});

// 7) Eliminar usuario
function deleteUser(email) {
  const users = getAllUsers();
  delete users[email];
  saveAllUsers(users);
  renderUsersTable();
}

// 8) Logout
function configurarLogout() {
  const btn = document.getElementById('btn-logout');
  if (!btn) return;
  btn.addEventListener('click', () => {
    if (confirm('¿Cerrar sesión?')) {
      sessionStorage.removeItem('sesionCineMax');
      localStorage.removeItem('recordarUsuario');
      window.location.href = 'login.html';
    }
  });
}

// 9) Arranque
document.addEventListener('DOMContentLoaded', () => {
  configurarLogout();
  initAdminPage();
});
