// Funciones básicas para la tienda de películas

// Función para mostrar mensaje de bienvenida al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    console.log('¡Bienvenido a CineMax!');
    
    // Agregar efectos hover adicionales a las tarjetas
    agregarEfectosHover();
    
    // Inicializar contador de visitas (simulado)
    mostrarContadorVisitas();
});

// Función para agregar efectos hover a las tarjetas
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

// Función para simular un contador de visitas
function mostrarContadorVisitas() {
    const visitas = localStorage.getItem('visitas') || 0;
    const nuevasVisitas = parseInt(visitas) + 1;
    localStorage.setItem('visitas', nuevasVisitas);
    
    console.log(`Número de visitas: ${nuevasVisitas}`);
}

// Función para manejar clics en botones de compra (simulado)
function agregarAlCarrito(nombrePelicula, precio) {
    alert(`¡${nombrePelicula} agregada al carrito por ${precio}!`);
    console.log(`Película agregada: ${nombrePelicula} - Precio: ${precio}`);
}

// Función para filtrar películas por precio (simulado)
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

// Función para mostrar información adicional de una película
function mostrarInfo(titulo, año, descripcion) {
    const info = `
        Título: ${titulo}
        Año: ${año}
        Descripción: ${descripcion}
    `;
    
    console.log(info);
    return info;
}

// Función para validar navegación
function validarNavegacion() {
    const enlaces = document.querySelectorAll('nav a');
    
    enlaces.forEach(enlace => {
        enlace.addEventListener('click', function(e) {
            console.log(`Navegando a: ${this.textContent}`);
        });
    });
}

// Función para animar elementos al hacer scroll (básica)
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

// Inicializar funciones adicionales
document.addEventListener('DOMContentLoaded', function() {
    validarNavegacion();
    animarAlScroll();
});

// Función para cambiar tema (día/noche) - básica
function cambiarTema() {
    const body = document.body;
    body.classList.toggle('tema-oscuro');
    
    const temaActual = body.classList.contains('tema-oscuro') ? 'oscuro' : 'claro';
    localStorage.setItem('tema', temaActual);
    
    console.log(`Tema cambiado a: ${temaActual}`);
}

// Cargar tema guardado
document.addEventListener('DOMContentLoaded', function() {
    const temaGuardado = localStorage.getItem('tema');
    if (temaGuardado === 'oscuro') {
        document.body.classList.add('tema-oscuro');
    }
});