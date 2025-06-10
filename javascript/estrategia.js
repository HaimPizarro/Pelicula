const estrategiaMovies = [
  {
    id: 1,
    titulo: "Top Gun: Maverick",
    año: 2022,
    descripción: "Maverick entrena a una nueva generación de pilotos…",
    precio: 12990,
    descuento: 20,
    imagen: "https://light.pawa.cl/img/2022/06/12014901/1653297680_702523_1653300885_noticia_normal.jpg",
  },
  {
    id: 2,
    titulo: "John Wick 4",
    año: 2023,
    descripción: "John Wick se enfrenta a un nuevo enemigo para obtener su libertad.",
    precio: 15990,
    descuento: 0,
    imagen: "https://miro.medium.com/v2/resize:fit:1400/1*7P6HwA3O6AnzxfbdHvtZVA.jpeg",
  },
  {
    id: 3,
    titulo: "Rápidos y Furiosos X",
    año: 2023,
    descripción: "La familia Toretto enfrenta a su enemigo más letal.",
    precio: 14990,
    descuento: 10,
    imagen: "https://m.media-amazon.com/images/S/pv-target-images/8fd9d8b072906d80bbf485978430e97f7033a08d111a459727bb5c720ad37471.jpg",
  },
];

window.estrategiaMovies = estrategiaMovies;

function initEstrategiaPage() {
  const cont = document.getElementById("estrategia-container");
  if (!cont) return;
  cont.innerHTML = "";

  const sesion   = obtenerSesion();
  const isClient = sesion?.rol === "cliente";

  estrategiaMovies.forEach(peli => {
    const precioFinal = peli.descuento > 0
      ? Math.round(peli.precio * (1 - peli.descuento / 100))
      : peli.precio;

    const col = document.createElement("div");
    col.className = "col";
    col.innerHTML = `
      <div class="card h-100 shadow-sm border-0 position-relative">
        ${peli.descuento > 0
          ? `<span class="badge bg-danger badge-discount">-${peli.descuento}%</span>`
          : ``
        }
        <div class="ratio ratio-4x3">
          <img src="${peli.imagen}"
               class="card-img-top object-fit-cover rounded-top"
               alt="${peli.titulo}">
        </div>
        <div class="card-body d-flex flex-column text-center">
          <h5 class="card-title fw-semibold">
            ${peli.titulo} (${peli.año})
          </h5>
          <p class="card-text flex-grow-1">
            ${peli.descripción}
          </p>
          ${isClient
            ? `<div class="s-price mb-3">
                 $${precioFinal.toLocaleString()}
               </div>
               <button class="btn btn-brand w-100 mt-auto"
                       onclick="agregarAlCarrito('${peli.titulo}', '$${precioFinal.toLocaleString()}')">
                 Agregar al carrito
               </button>`
            : ``
          }
        </div>
      </div>`;
    cont.appendChild(col);
  });

  actualizarBadge();
  document.getElementById("offcanvasCart")
          .addEventListener("shown.bs.offcanvas", renderizarCarrito);
}