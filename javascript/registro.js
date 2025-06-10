function getAllUsers() {
  return JSON.parse(localStorage.getItem('usersCineMax') || '{}');
}
function saveAllUsers(obj) {
  localStorage.setItem('usersCineMax', JSON.stringify(obj));
}

if (!localStorage.getItem('usersCineMax')) {
  saveAllUsers({
    'cliente@cinemax.com': {
      email: 'cliente@cinemax.com',
      nombre: 'Juan Pérez',
      clave:  'Cliente123',
      rol:    'cliente'
    },
    'admin@cinemax.com': {
      email: 'admin@cinemax.com',
      nombre: 'Haim Pizarro',
      clave:  'Admin123',
      rol:    'admin'
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registroForm');
  if (!form) return;

  form.addEventListener('submit', evt => {
    evt.preventDefault();

    // Limpia errores visuales previos
    form.querySelectorAll('.form-control').forEach(i => i.classList.remove('is-invalid'));

    // Valores
    const nombre  = form.querySelector('#nombre').value.trim();
    const correo  = form.querySelector('#correo').value.trim().toLowerCase();
    const clave   = form.querySelector('#clave').value;
    const clave2  = form.querySelector('#clave2').value;
    const fechaNac= form.querySelector('#fechaNac')?.value || null;

    // Expresiones de validación
    const emailRx = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    const passRx  = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,18}$/;

    let valido = true;
    const error = id => { form.querySelector(`#${id}`).classList.add('is-invalid'); valido = false; };

    if (!nombre)                     error('nombre');
    if (!emailRx.test(correo))       error('correo');
    if (!passRx.test(clave))         error('clave');
    if (clave !== clave2)            error('clave2');
    if (fechaNac) {
      const edad = new Date().getFullYear() - new Date(fechaNac).getFullYear();
      if (edad < 13)                 error('fechaNac');
    }
    if (!valido) return;

    // Verificar duplicado
    const users = getAllUsers();
    if (users[correo]) {
      document.getElementById('form-error').textContent = 'El correo ya está registrado.';
      document.getElementById('form-error').classList.remove('d-none');
      return;
    }

    users[correo] = {
      email: correo,
      nombre,
      clave,
      rol: 'cliente',
      fechaNac
    };
    saveAllUsers(users);

    alert('Registro exitoso. ¡Ya puedes iniciar sesión!');
    window.location.href = 'login.html';
  });
});