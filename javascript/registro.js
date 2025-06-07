// =============================
//   REGISTRO DE USUARIOS
// =============================

// Helpers para leer/escribir el "almacén" de usuarios
function getAllUsers() {
  return JSON.parse(localStorage.getItem('usersCineMax') || '{}');
}
function saveAllUsers(users) {
  localStorage.setItem('usersCineMax', JSON.stringify(users));
}

// Inicializar base de datos local la primera vez
if (!localStorage.getItem('usersCineMax')) {
  saveAllUsers({
    'cliente@cinemax.com': { email:'cliente@cinemax.com', nombre:'Juan Pérez', rol:'cliente' },
    'admin@cinemax.com':   { email:'admin@cinemax.com',   nombre:'María González', rol:'admin' }
  });
}

// Validación y guardado al enviar registro.html
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registroForm');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    Array.from(form.elements).forEach(el => el.classList.remove('is-invalid'));

    const nombre   = form.nombre.value.trim();
    const usuario  = form.usuario.value.trim().toLowerCase();
    const correo   = form.correo.value.trim().toLowerCase();
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

    // Cargar y actualizar lista
    const users = getAllUsers();
    if (users[correo]) {
      alert('❌ Ese correo ya está registrado.');
      return;
    }

    users[correo] = {
      email: correo,
      nombre,
      rol: 'cliente'
      // puedes añadir más campos si quieres
    };
    saveAllUsers(users);

    alert('🎉 Registro exitoso. Ya puedes iniciar sesión.');
    form.reset();
    window.location.href = 'login.html';
  });
});
