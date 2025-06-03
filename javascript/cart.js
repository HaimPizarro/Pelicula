// === cart.js ===
// Lógica para carrito de compras reutilizable en todas las páginas.
// Requiere que las páginas llamen a estas funciones y tengan en su HTML:
// 1) Un ícono de carrito con <span id="cart-count-badge"> para el contador.
// 2) Un Offcanvas con id="offcanvasCart", lista <ul id="cart-items-list">,
//    <div id="empty-cart"> para mensaje vacío y <div id="cart-footer"> para el total.
// 3) Botones que llamen a agregarAlCarrito(nombre, precioStr).

(function () {
  // ------- 1) Obtener carrito desde localStorage (o inicializar vacío) -------
  function obtenerCarrito() {
    const raw = localStorage.getItem('cineMaxCart');
    return raw ? JSON.parse(raw) : [];
  }

  // ------- 2) Guardar carrito en localStorage -------
  function guardarCarrito(cart) {
    localStorage.setItem('cineMaxCart', JSON.stringify(cart));
  }

  // ------- 3) Actualizar badge de carrito (contador) -------
  function actualizarBadge() {
    const cart = obtenerCarrito();
    const count = cart.reduce((sum, item) => sum + item.cantidad, 0);
    const badge = document.getElementById('cart-count-badge');
    if (!badge) return;
    badge.textContent = count;
    badge.style.display = count > 0 ? 'inline-block' : 'none';
  }

  // ------- 4) Renderizar lista de items en el offcanvas -------
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

  // ------- 5) Función global: agregar al carrito -------
  // nombre: string, precioStr: e.g. "$16.990" o "16990"
  function agregarAlCarrito(nombre, precioStr) {
    // Convertir "$16.990" a 16990
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

  // ------- 6) Inicialización al cargar cada página -------
  document.addEventListener('DOMContentLoaded', function () {
    // Mostrar badge con la cantidad de items
    actualizarBadge();

    // Cuando se abra el offcanvas, renderizar su contenido
    const offcanvasCartEl = document.getElementById('offcanvasCart');
    if (offcanvasCartEl) {
      offcanvasCartEl.addEventListener('shown.bs.offcanvas', () => {
        renderizarCarrito();
      });
    }
  });

  // Exponer funciones en el scope global
  window.obtenerCarrito = obtenerCarrito;
  window.guardarCarrito = guardarCarrito;
  window.actualizarBadge = actualizarBadge;
  window.renderizarCarrito = renderizarCarrito;
  window.agregarAlCarrito = agregarAlCarrito;
})();