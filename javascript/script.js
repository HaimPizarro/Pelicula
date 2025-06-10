function obtenerSesion() {
  const raw = sessionStorage.getItem('sesionCineMax');
  return raw ? JSON.parse(raw) : null;
}

function actualizarNavUsuario() {
  const sesion     = obtenerSesion();
  const hasSesion  = !!sesion;
  const isCliente  = sesion?.rol === 'cliente';
  const isAdmin    = sesion?.rol === 'admin';

  // Carrito solo para clientes
  document.getElementById('nav-cart')
    ?.classList.toggle('d-none', !isCliente);

  // Botón Admin junto a perfil
  document.getElementById('btn-admin')
    ?.classList.toggle('d-none', !isAdmin);

  // Registro / Login
  document.getElementById('link-registro')
    ?.classList.toggle('d-none', hasSesion);
  document.getElementById('link-login')
    ?.classList.toggle('d-none', hasSesion);

  // Perfil / Logout
  document.getElementById('btn-profile')
    ?.classList.toggle('d-none', !hasSesion);
  document.getElementById('btn-logout')
    ?.classList.toggle('d-none', !hasSesion);

  // Cualquier .admin-only
  document.querySelectorAll('.admin-only')
    .forEach(el => el.classList.toggle('d-none', !isAdmin));
}

function configurarLogout() {
  const btn = document.getElementById('btn-logout');
  if (!btn) return;
  btn.addEventListener('click', () => {
    if (confirm('¿Seguro que deseas cerrar sesión?')) {
      sessionStorage.removeItem('sesionCineMax');
      localStorage.removeItem('recordarUsuario');
      window.location.href = 'index.html';
    }
  });
}

function agregarEfectosHover() {
  document.querySelectorAll('.categoria, .pelicula').forEach(el => {
    el.addEventListener('mouseenter', () =>
      el.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)'
    );
    el.addEventListener('mouseleave', () =>
      el.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)'
    );
  });
}

function mostrarContadorVisitas() {
  const v = +localStorage.getItem('visitas') || 0;
  localStorage.setItem('visitas', v + 1);
  console.log(`Número de visitas: ${v + 1}`);
}

function validarNavegacion() {
  document.querySelectorAll('nav a').forEach(a =>
    a.addEventListener('click', () =>
      console.log(`Navegando a: ${a.textContent}`)
    )
  );
}

function animarAlScroll() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.opacity = '1';
        e.target.style.transform = 'translateY(0)';
      }
    });
  });
  document.querySelectorAll('.categoria, .pelicula').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'all 0.6s ease';
    observer.observe(el);
  });
}

function cambiarTema() {
  document.body.classList.toggle('tema-oscuro');
  localStorage.setItem(
    'tema',
    document.body.classList.contains('tema-oscuro') ? 'oscuro' : 'claro'
  );
}

function aplicarTemaGuardado() {
  if (localStorage.getItem('tema') === 'oscuro') {
    document.body.classList.add('tema-oscuro');
  }
}

function initDramaPage() {
  const cont = document.getElementById('drama-container');
  if (!cont || !Array.isArray(window.dramaMovies)) return;
  cont.innerHTML = '';
  const sesion = obtenerSesion();
  const isClient = sesion?.rol === 'cliente';

  window.dramaMovies.forEach(pelicula => {
    const precioFinal = pelicula.descuento > 0
      ? Math.round(pelicula.precio * (1 - pelicula.descuento / 100))
      : pelicula.precio;

    const col = document.createElement('div');
    col.className = 'col';
    col.innerHTML = `
      <div class="card h-100 shadow-sm border-0 position-relative">
        ${pelicula.descuento > 0
          ? `<span class="badge bg-danger badge-discount">-${pelicula.descuento}%</span>`
          : ''
        }
        <div class="ratio ratio-4x3">
          <img src="${pelicula.imagen}"
               class="card-img-top object-fit-cover rounded-top"
               alt="${pelicula.titulo}">
        </div>
        <div class="card-body d-flex flex-column text-center">
          <h5 class="card-title fw-semibold">${pelicula.titulo} (${pelicula.año})</h5>
          <p class="card-text flex-grow-1">${pelicula.descripción}</p>
          ${isClient
            ? `<div class="s-price mb-3">$${precioFinal.toLocaleString()}</div>
               <button class="btn btn-brand w-100 mt-auto"
                       onclick="agregarAlCarrito('${pelicula.titulo}', '$${precioFinal.toLocaleString()}')">
                 Agregar al carrito
               </button>`
            : ''
          }
        </div>
      </div>`;
    cont.appendChild(col);
  });

  if (typeof actualizarBadge === 'function') actualizarBadge();
  document.getElementById('offcanvasCart')
    ?.addEventListener('shown.bs.offcanvas', () => renderizarCarrito());
}

function initComediaPage() {
  const cont = document.getElementById('comedia-container');
  if (!cont || !Array.isArray(window.comediaMovies)) return;
  cont.innerHTML = '';
  const sesion = obtenerSesion();
  const isClient = sesion?.rol === 'cliente';

  window.comediaMovies.forEach(peli => {
    const precioFinal = peli.descuento > 0
      ? Math.round(peli.precio * (1 - peli.descuento / 100))
      : peli.precio;

    const col = document.createElement('div');
    col.className = 'col';
    col.innerHTML = `
      <div class="card h-100 shadow-sm border-0 position-relative">
        ${peli.descuento > 0
          ? `<span class="badge bg-danger badge-discount">-${peli.descuento}%</span>`
          : ''
        }
        <div class="ratio ratio-4x3">
          <img src="${peli.imagen}"
               class="card-img-top object-fit-cover rounded-top"
               alt="${peli.titulo}">
        </div>
        <div class="card-body d-flex flex-column text-center">
          <h5 class="card-title fw-semibold">${peli.titulo} (${peli.año})</h5>
          <p class="card-text flex-grow-1">${peli.descripción}</p>
          ${isClient
            ? `<div class="s-price mb-3">$${precioFinal.toLocaleString()}</div>
               <button class="btn btn-brand w-100 mt-auto"
                       onclick="agregarAlCarrito('${peli.titulo}', '$${precioFinal.toLocaleString()}')">
                 Agregar al carrito
               </button>`
            : ''
          }
        </div>
      </div>`;
    cont.appendChild(col);
  });

  actualizarBadge();
  document.getElementById('offcanvasCart')
    ?.addEventListener('shown.bs.offcanvas', () => renderizarCarrito());
}

function initEstrategiaPage() {
  const cont = document.getElementById('estrategia-container');
  if (!cont || !Array.isArray(window.estrategiaMovies)) return;
  cont.innerHTML = '';
  const sesion = obtenerSesion();
  const isClient = sesion?.rol === 'cliente';

  window.estrategiaMovies.forEach(peli => {
    const precioFinal = peli.descuento > 0
      ? Math.round(peli.precio * (1 - peli.descuento / 100))
      : peli.precio;

    const col = document.createElement('div');
    col.className = 'col';
    col.innerHTML = `
      <div class="card h-100 shadow-sm border-0 position-relative">
        ${peli.descuento > 0
          ? `<span class="badge bg-danger badge-discount">-${peli.descuento}%</span>`
          : ''
        }
        <div class="ratio ratio-4x3">
          <img src="${peli.imagen}"
               class="card-img-top object-fit-cover rounded-top"
               alt="${peli.titulo}">
        </div>
        <div class="card-body d-flex flex-column text-center">
          <h5 class="card-title fw-semibold">${peli.titulo} (${peli.año})</h5>
          <p class="card-text flex-grow-1">${peli.descripción}</p>
          ${isClient
            ? `<div class="s-price mb-3">$${precioFinal.toLocaleString()}</div>
               <button class="btn btn-brand w-100 mt-auto"
                       onclick="agregarAlCarrito('${peli.titulo}', '$${precioFinal.toLocaleString()}')">
                 Agregar al carrito
               </button>`
            : ''
          }
        </div>
      </div>`;
    cont.appendChild(col);
  });

  actualizarBadge();
  document.getElementById('offcanvasCart')
    ?.addEventListener('shown.bs.offcanvas', () => renderizarCarrito());
}

function initTerrorPage() {
  const cont = document.getElementById('terror-container');
  if (!cont || !Array.isArray(window.terrorMovies)) return;
  cont.innerHTML = '';
  const sesion = obtenerSesion();
  const isClient = sesion?.rol === 'cliente';

  window.terrorMovies.forEach(peli => {
    const precioFinal = peli.descuento > 0
      ? Math.round(peli.precio * (1 - peli.descuento / 100))
      : peli.precio;

    const col = document.createElement('div');
    col.className = 'col';
    col.innerHTML = `
      <div class="card h-100 shadow-sm border-0 position-relative">
        ${peli.descuento > 0
          ? `<span class="badge bg-danger badge-discount">-${peli.descuento}%</span>`
          : ''
        }
        <div class="ratio ratio-4x3">
          <img src="${peli.imagen}"
               class="card-img-top object-fit-cover rounded-top"
               alt="${peli.titulo}">
        </div>
        <div class="card-body d-flex flex-column text-center">
          <h5 class="card-title fw-semibold">${peli.titulo} (${peli.año})</h5>
          <p class="card-text flex-grow-1">${peli.descripción}</p>
          ${isClient
            ? `<div class="s-price mb-3">$${precioFinal.toLocaleString()}</div>
               <button class="btn btn-brand w-100 mt-auto"
                       onclick="agregarAlCarrito('${peli.titulo}', '$${precioFinal.toLocaleString()}')">
                 Agregar al carrito
               </button>`
            : ''
          }
        </div>
      </div>`;
    cont.appendChild(col);
  });

  actualizarBadge();
  document.getElementById('offcanvasCart')
    ?.addEventListener('shown.bs.offcanvas', () => renderizarCarrito());
}

document.addEventListener('DOMContentLoaded', () => {
  console.log('¡Bienvenido a CineMax!');

  //Navbar dinámico
  actualizarNavUsuario();
  configurarLogout();

  //Efectos y utilidades
  agregarEfectosHover();
  mostrarContadorVisitas();
  validarNavegacion();
  animarAlScroll();
  cambiarTema();
  aplicarTemaGuardado();

  //Inicializar cada sección si existe
  if (document.getElementById('drama-container')) {
    initDramaPage();
  }
  if (document.getElementById('comedia-container')) {
    initComediaPage();
  }
  if (document.getElementById('estrategia-container')) {
    initEstrategiaPage();
  }
  if (document.getElementById('terror-container')) {
    initTerrorPage();
  }
});