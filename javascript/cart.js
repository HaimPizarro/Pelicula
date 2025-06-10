(function () {
  //Obtener carrito desde localStorage (o inicializar vacío)
  function obtenerCarrito() {
    const raw = localStorage.getItem('cineMaxCart');
    return raw ? JSON.parse(raw) : [];
  }

  //Guardar carrito en localStorage
  function guardarCarrito(cart) {
    localStorage.setItem('cineMaxCart', JSON.stringify(cart));
  }

  //Actualizar badge de carrito (contador)
  function actualizarBadge() {
    const cart = obtenerCarrito();
    const count = cart.reduce((sum, item) => sum + item.cantidad, 0);
    const badge = document.getElementById('cart-count-badge');
    if (!badge) return;
    badge.textContent = count;
    badge.style.display = count > 0 ? 'inline-block' : 'none';
  }

  //Renderizar lista de items en el offcanvas
  function renderizarCarrito() {
    const cart = obtenerCarrito();
    const list = document.getElementById('cart-items-list');
    const emptyDiv = document.getElementById('empty-cart');
    const footer = document.getElementById('cart-footer');
    const totalAmountEl = document.getElementById('cart-total-amount');

    if (!list || !emptyDiv || !footer || !totalAmountEl) return;

    // Limpiar lista
    list.innerHTML = '';

    if (cart.length === 0) {
      emptyDiv.classList.remove('d-none');
      footer.classList.add('d-none');
      return;
    }

    emptyDiv.classList.add('d-none');
    footer.classList.remove('d-none');

    let total = 0;
    cart.forEach((item, idx) => {
      const itemTotal = item.precio * item.cantidad;
      total += itemTotal;

      const li = document.createElement('li');
      li.className = 'list-group-item d-flex justify-content-between align-items-center';
      li.innerHTML = `
        <div>
          <strong>${item.nombre}</strong><br>
          <small>$${item.precio.toLocaleString()} x ${item.cantidad}</small>
        </div>
        <div>
          <button class="btn btn-sm btn-outline-danger remove-item-btn" data-index="${idx}">&times;</button>
        </div>`;
      list.appendChild(li);
    });

    totalAmountEl.textContent = `$${total.toLocaleString()}`;

    // Agregar listener a cada botón “remove”
    document.querySelectorAll('.remove-item-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const index = parseInt(btn.dataset.index);
        cart.splice(index, 1);
        guardarCarrito(cart);
        actualizarBadge();
        renderizarCarrito();
      });
    });
  }

  //Función global: agregar al carrito
  function agregarAlCarrito(nombre, precioStr) {
    const precioNum = parseInt(precioStr.replace(/\$/g, '').replace(/\./g, ''));
    let cart = obtenerCarrito();

    const existente = cart.find(item => item.nombre === nombre);
    if (existente) {
      existente.cantidad += 1;
    } else {
      cart.push({ nombre, precio: precioNum, cantidad: 1 });
    }
    guardarCarrito(cart);
    actualizarBadge();
  }

  //Inicialización al cargar cada página
  document.addEventListener('DOMContentLoaded', function () {
    // Mostrar badge con la cantidad de items
    actualizarBadge();

    const offcanvasCartEl = document.getElementById('offcanvasCart');
    if (offcanvasCartEl) {
      offcanvasCartEl.addEventListener('shown.bs.offcanvas', () => {
        renderizarCarrito();
      });
    }
  });

  window.obtenerCarrito = obtenerCarrito;
  window.guardarCarrito = guardarCarrito;
  window.actualizarBadge = actualizarBadge;
  window.renderizarCarrito = renderizarCarrito;
  window.agregarAlCarrito = agregarAlCarrito;
})();