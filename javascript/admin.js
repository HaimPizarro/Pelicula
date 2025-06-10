// Inicializar usuarios en localStorage si no existen
if (!localStorage.getItem('usersCineMax')) {
  const initial = {
    'cliente@cinemax.com': { email: 'cliente@cinemax.com', nombre: 'Juan Pérez', clave: 'Cliente123', rol: 'cliente' },
    'admin@cinemax.com':   { email: 'admin@cinemax.com',   nombre: 'Haim Pizarro',   clave: 'Admin123',   rol: 'admin' }
  };
  localStorage.setItem('usersCineMax', JSON.stringify(initial));
}

// Helpers de almacenamiento
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

// Expresión para validar contraseña: 6–18 caracteres, 1 mayúscula y 1 número
const passRx = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,18}$/;

// Inicializar página de administración
function initAdminPage() {
  const sesion = obtenerSesion();
  if (!sesion || sesion.rol !== 'admin') {
    document.getElementById('not-authorized').classList.remove('d-none');
    return;
  }
  document.getElementById('admin-content').classList.remove('d-none');
  renderUsersTable();
}

// Renderizar tabla de usuarios
function renderUsersTable() {
  const tbody = document.getElementById('users-table-body');
  tbody.innerHTML = '';
  const users = getAllUsers();

  Object.values(users).forEach(user => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${user.email}</td>
      <td>${user.nombre}</td>
      <td>${user.rol.charAt(0).toUpperCase() + user.rol.slice(1)}</td>
      <td>
        <button class="btn btn-sm btn-primary edit-user" data-email="${user.email}">Editar</button>
        ${user.email !== obtenerSesion().email
          ? `<button class="btn btn-sm btn-danger ms-2 delete-user" data-email="${user.email}">Eliminar</button>`
          : ''}
      </td>`;
    tbody.appendChild(tr);
  });

  // Asociar eventos a los botones
  document.querySelectorAll('.edit-user')
    .forEach(btn => btn.addEventListener('click', () => openEditModal(btn.dataset.email)));
  document.querySelectorAll('.delete-user')
    .forEach(btn => btn.addEventListener('click', () => {
      if (confirm(`¿Eliminar a ${btn.dataset.email}?`)) deleteUser(btn.dataset.email);
    }));
}

// Abrir modal de edición y precargar datos
function openEditModal(email) {
  const users = getAllUsers();
  const u = users[email];
  if (!u) return;

  document.getElementById('editar-email-original').value = u.email;
  document.getElementById('editar-nombre-completo').value = u.nombre;
  document.getElementById('editar-clave').value = '';
  document.getElementById('editar-clave2').value = '';
  document.getElementById('editar-rol').value = u.rol;

  new bootstrap.Modal(document.getElementById('modalEditarUsuario')).show();
}

// Guardar cambios desde el modal de edición
document.getElementById('form-editar-usuario').addEventListener('submit', function (e) {
  e.preventDefault();

  // Limpiar errores previos
  this.querySelectorAll('.form-control').forEach(i => i.classList.remove('is-invalid'));
  document.getElementById('modal-msg').classList.add('d-none');

  // Valores del formulario
  const originalEmail = document.getElementById('editar-email-original').value;
  const nombreNew     = document.getElementById('editar-nombre-completo').value.trim();
  const passNew       = document.getElementById('editar-clave').value;
  const pass2New      = document.getElementById('editar-clave2').value;
  const rolNew        = document.getElementById('editar-rol').value;

  const users  = getAllUsers();
  const target = users[originalEmail];

  let valido = true;
  const error = id => { document.getElementById(id).classList.add('is-invalid'); valido = false; };

  // Validar nueva contraseña solo si se ingresó alguna
  if (passNew || pass2New) {
    if (!passRx.test(passNew))      error('editar-clave');        // Formato inválido
    if (passNew !== pass2New)       error('editar-clave2');       // No coinciden
    if (passNew === target.clave)   error('editar-clave');        // No repetir la anterior
  }

  if (!valido) return;

  // Actualizar datos permitidos
  target.nombre = nombreNew;
  if (passNew) target.clave = passNew;
  target.rol    = rolNew;

  saveAllUsers(users);
  bootstrap.Modal.getInstance(document.getElementById('modalEditarUsuario')).hide();
  renderUsersTable();
});

// Eliminar usuario
function deleteUser(email) {
  const users = getAllUsers();
  delete users[email];
  saveAllUsers(users);
  renderUsersTable();
}

// Configurar logout
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

// Arranque al cargar la página
document.addEventListener('DOMContentLoaded', () => {
  configurarLogout();
  initAdminPage();
});