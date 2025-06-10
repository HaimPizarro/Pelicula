function getAllUsers() {
  return JSON.parse(localStorage.getItem('usersCineMax') || '{}');
}
function saveAllUsers(users) {
  localStorage.setItem('usersCineMax', JSON.stringify(users));
}

//Inicializar base de datos local la primera vez
if (!localStorage.getItem('usersCineMax')) {
  saveAllUsers({
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
  });
}

//Validación y guardado al enviar registro.html
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registroForm');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    Array.from(form.elements).forEach(el => el.classList.remove('is-invalid'));

    const nombre = form.querySelector('#nombre').value.trim();
    const usuario = form.querySelector('#usuario').value.trim();
    const correo = form.querySelector('#correo').value.trim().toLowerCase();
    const fechaNac = form.querySelector('#fechaNac').value;
    const clave = form.querySelector('#clave').value;
    const clave2 = form.querySelector('#clave2').value;

    let valido = true;
    const hoy = new Date();
    const años = hoy.getFullYear() - new Date(fechaNac).getFullYear();
    const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    const passRegex  = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,18}$/;

    const marcarError = id => {
      form.querySelector(`#${id}`).classList.add('is-invalid');
      valido = false;
    };

    if (!nombre) marcarError('nombre');
    if (!usuario) marcarError('usuario');
    if (!emailRegex.test(correo)) marcarError('correo');
    if (!fechaNac || años < 13) marcarError('fechaNac');
    if (!passRegex.test(clave)) marcarError('clave');
    if (clave !== clave2) marcarError('clave2');
    if (!valido) return;

    const users = getAllUsers();
    if (users[correo]) {
      alert('Correo ya está registrado.');
      return;
    }

    // guardar nuevo usuario
    users[correo] = {
      email: correo,
      nombre,
      usuario,
      fechaNac,
      clave,
      rol: 'cliente'
    };
    saveAllUsers(users);

    // éxito y redirección
    alert('Registro exitoso. Ya puedes iniciar sesión.');
    form.reset();
    window.location.href = 'login.html';
  });
});