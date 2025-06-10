// Helpers de "base de datos"
function getAllUsers() {
  return JSON.parse(localStorage.getItem('usersCineMax') || '{}');
}
function saveAllUsers(u) {
  localStorage.setItem('usersCineMax', JSON.stringify(u));
}

document.addEventListener('DOMContentLoaded', () => {
  const emailInput   = document.getElementById('email-input');
  const btnVerify    = document.getElementById('btn-verify');
  const emailError   = document.getElementById('email-error');

  const stepEmail    = document.getElementById('step-email');
  const stepReset    = document.getElementById('step-reset');
  const newPassInput = document.getElementById('new-pass');
  const confPassInput= document.getElementById('confirm-pass');
  const btnReset     = document.getElementById('btn-reset');
  const resetError   = document.getElementById('reset-error');

  let targetEmail = null;

  //verificar email
  btnVerify.addEventListener('click', () => {
    const correo = emailInput.value.trim().toLowerCase();
    const users  = getAllUsers();
    if (users[correo]) {
      //email existe
      targetEmail = correo;
      emailError.classList.add('hidden');
      stepEmail.classList.add('hidden');
      stepReset.classList.remove('hidden');
    } else {
      emailError.textContent = 'No existe cuenta con ese correo.';
      emailError.classList.remove('hidden');
    }
  });

  //reset de contraseña
  btnReset.addEventListener('click', () => {
    const p1 = newPassInput.value.trim();
    const p2 = confPassInput.value.trim();
    const regex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,18}$/;

    //validaciones
    if (!regex.test(p1)) {
      resetError.textContent = 'La contraseña debe tener 6-18 caracteres, 1 mayúscula y 1 número.';
      resetError.classList.remove('hidden');
      return;
    }
    if (p1 !== p2) {
      resetError.textContent = 'Las contraseñas no coinciden.';
      resetError.classList.remove('hidden');
      return;
    }

    //actualizar en localStorage
    const users = getAllUsers();
    users[targetEmail].clave = p1; 
    saveAllUsers(users);

    alert('Contraseña actualizada. Ahora puedes iniciar sesión.');
    window.location.href = 'login.html';
  });
});