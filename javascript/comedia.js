const comediaMovies = [
  {
    id: 1,
    titulo: "Barbie",
    año: 2023,
    descripción:
      "Barbie vive en Barbieland, donde todo es perfecto y rosa…",
    precio: 16990,
    descuento: 15,
    imagen:
      "https://es.web.img2.acsta.net/pictures/23/07/20/11/29/5479684.jpg",
  },
  {
    id: 2,
    titulo: "Super Mario Bros",
    año: 2023,
    descripción:
      "Mario y Luigi son transportados al Reino Champiñón…",
    precio: 13990,
    descuento: 0,
    imagen:
      "https://almomento.mx/wp-content/uploads/2023/04/Mario-Bros.-taquilla-Mexico.jpeg",
  },
  {
    id: 3,
    titulo: "Mi Villano Favorito 4",
    año: 2024,
    descripción:
      "Gru enfrenta a un nuevo enemigo mientras su familia crece…",
    precio: 14990,
    descuento: 25,
    imagen:
      "https://media.canal9.cl/2024/06/mi-villano-favorito-4-1906.jpg",
  },
];

window.comediaMovies = comediaMovies;

function initComediaPage() {
  const cont = document.getElementById("comedia-container");
  if (!cont || !Array.isArray(comediaMovies)) return;

  cont.innerHTML = "";

  const sesion   = obtenerSesion();
  const isClient = sesion?.rol === "cliente";

  comediaMovies.forEach(peli => {
    const precioFinal = peli.descuento > 0
      ? Math.round(peli.precio * (1 - peli.descuento/100))
      : peli.precio;

    const col = document.createElement("div");
    col.className = "col";
    col.innerHTML = `
      <div class="card h-100 shadow-sm border-0 position-relative">
        ${peli.descuento>0
          ? `<span class="badge bg-danger badge-discount">-${peli.descuento}%</span>`
          : ``
        }
        <div class="ratio ratio-4x3">
          <img src="${peli.imagen}" class="card-img-top object-fit-cover rounded-top" alt="${peli.titulo}">
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
            : ``
          }
        </div>
      </div>
    `;
    cont.appendChild(col);
  });

  actualizarBadge();
  document.getElementById("offcanvasCart")
          .addEventListener("shown.bs.offcanvas", renderizarCarrito);
}