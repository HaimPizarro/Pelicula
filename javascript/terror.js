const terrorMovies = [
  {
    id: 1,
    titulo: "Scream VI",
    año: 2023,
    descripción:
      "Los supervivientes de Ghostface inician un nuevo capítulo en Nueva York.",
    precio: 14990,
    descuento: 22,
    imagen:
      "https://es.web.img3.acsta.net/pictures/23/01/25/11/55/4525883.jpg",
  },
  {
    id: 2,
    titulo: "MEGAN",
    año: 2023,
    descripción:
      "La muñeca IA protectora que se vuelve siniestra…",
    precio: 13990,
    descuento: 0,
    imagen:
      "https://pics.filmaffinity.com/M3GAN-570441440-large.jpg",
  },
  {
    id: 3,
    titulo: "El Legado del Diablo",
    año: 2018,
    descripción:
      "Una familia descubre oscuros secretos tras la muerte de la abuela.",
    precio: 13490,
    descuento: 10,
    imagen:
      "https://m.media-amazon.com/images/M/MV5BOTlkOGY0OWUtYTg1My00ZGU2LTliZTItODI5NjJkNDAwYzQwXkEyXkFqcGc@._V1_.jpg",
  },
];

window.terrorMovies = terrorMovies;

function initTerrorPage() {
  const cont = document.getElementById("terror-container");
  if (!cont) return;
  cont.innerHTML = "";

  const sesion   = obtenerSesion();
  const isClient = sesion?.rol === "cliente";

  terrorMovies.forEach(peli => {
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
          <p class="card-text flex-grow-1">${peli.descripción}</p>
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

  // Inicializar badge y offcanvas
  actualizarBadge();
  document.getElementById("offcanvasCart")
          .addEventListener("shown.bs.offcanvas", renderizarCarrito);
}