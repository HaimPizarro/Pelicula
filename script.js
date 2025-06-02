document.addEventListener('DOMContentLoaded', function() {
    console.log('¡Bienvenido a CineMax!');
    
    agregarEfectosHover();
    
    mostrarContadorVisitas();
});

function agregarEfectosHover() {
    const tarjetas = document.querySelectorAll('.categoria, .pelicula');
    
    tarjetas.forEach(tarjeta => {
        tarjeta.addEventListener('mouseenter', function() {
            this.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
        });
        
        tarjeta.addEventListener('mouseleave', function() {
            this.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
        });
    });
}

function mostrarContadorVisitas() {
    const visitas = localStorage.getItem('visitas') || 0;
    const nuevasVisitas = parseInt(visitas) + 1;
    localStorage.setItem('visitas', nuevasVisitas);
    
    console.log(`Número de visitas: ${nuevasVisitas}`);
}

function agregarAlCarrito(nombrePelicula, precio) {
    alert(`¡${nombrePelicula} agregada al carrito por ${precio}!`);
    console.log(`Película agregada: ${nombrePelicula} - Precio: ${precio}`);
}

function filtrarPorPrecio(precioMaximo) {
    const precios = document.querySelectorAll('.precio');
    
    precios.forEach(elemento => {
        const precio = parseInt(elemento.textContent.replace('$', '').replace('.', ''));
        const tarjeta = elemento.closest('.pelicula');
        
        if (precio > precioMaximo) {
            tarjeta.style.opacity = '0.5';
        } else {
            tarjeta.style.opacity = '1';
        }
    });
}

function mostrarInfo(titulo, año, descripcion) {
    const info = `
        Título: ${titulo}
        Año: ${año}
        Descripción: ${descripcion}
    `;
    
    console.log(info);
    return info;
}

function validarNavegacion() {
    const enlaces = document.querySelectorAll('nav a');
    
    enlaces.forEach(enlace => {
        enlace.addEventListener('click', function(e) {
            console.log(`Navegando a: ${this.textContent}`);
        });
    });
}

function animarAlScroll() {
    const elementos = document.querySelectorAll('.categoria, .pelicula');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    });
    
    elementos.forEach(elemento => {
        elemento.style.opacity = '0';
        elemento.style.transform = 'translateY(20px)';
        elemento.style.transition = 'all 0.6s ease';
        observer.observe(elemento);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    validarNavegacion();
    animarAlScroll();
});

function cambiarTema() {
    const body = document.body;
    body.classList.toggle('tema-oscuro');
    
    const temaActual = body.classList.contains('tema-oscuro') ? 'oscuro' : 'claro';
    localStorage.setItem('tema', temaActual);
    
    console.log(`Tema cambiado a: ${temaActual}`);
}

document.addEventListener('DOMContentLoaded', function() {
    const temaGuardado = localStorage.getItem('tema');
    if (temaGuardado === 'oscuro') {
        document.body.classList.add('tema-oscuro');
    }
});



/* === VALIDACIÓN DEL FORMULARIO DE REGISTRO === */
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registroForm');
  if (!form) return; // Estamos en otra página

  form.addEventListener('submit', e => {
    e.preventDefault(); // Evita envío si hay errores

    // Limpia estados previos
    Array.from(form.elements).forEach(el => el.classList.remove('is-invalid'));

    // Captura valores
    const nombre     = document.getElementById('nombre').value.trim();
    const usuario    = document.getElementById('usuario').value.trim();
    const correo     = document.getElementById('correo').value.trim();
    const fechaNac   = document.getElementById('fechaNac').value;
    const clave      = document.getElementById('clave').value;
    const clave2     = document.getElementById('clave2').value;

    /* Reglas: email formato, contraseña fuerza, >=13 años, campos no vacíos */
    let valido = true;

    const hoy = new Date();
    const años = hoy.getFullYear() - new Date(fechaNac).getFullYear();

    const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    const passRegex  = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,18}$/;

    const marcarError = id => {
      document.getElementById(id).classList.add('is-invalid');
      valido = false;
    };

    if (!nombre)        marcarError('nombre');
    if (!usuario)       marcarError('usuario');
    if (!emailRegex.test(correo)) marcarError('correo');
    if (!fechaNac || años < 13)   marcarError('fechaNac');
    if (!passRegex.test(clave))   marcarError('clave');
    if (clave !== clave2)         marcarError('clave2');

    if (!valido) return; // Sale si algún campo es inválido

    /* Simula registro exitoso */
    alert('🎉 Registro exitoso. ¡Bienvenido/a a CineMax!');
    form.reset();
  });
});
