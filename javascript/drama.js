// drama-data.js

/**
 * Array con todos los datos de las películas de drama.
 * Cada objeto incluye:
 *  - id: identificador único
 *  - título: nombre de la película
 *  - año: año de estreno
 *  - descripción: breve sinopsis
 *  - precio: valor numérico en pesos chilenos (sin formato “$” ni separador de miles)
 *  - descuento: porcentaje de descuento (si no aplica, valor 0)
 *  - imagen: URL de la carátula/poster
 */

const dramaMovies = [
  {
    id: 1,
    titulo: "Oppenheimer",
    año: 2023,
    descripción:
      "La historia del físico que lideró el proyecto Manhattan durante la Segunda Guerra Mundial.",
    precio: 17990,
    descuento: 12, // 12% OFF
    imagen:
      "https://m.media-amazon.com/images/M/MV5BNTFlZDI1YWQtMTVjNy00YWU1LTg2YjktMTlhYmRiYzQ3NTVhXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
  },
  {
    id: 2,
    titulo: "La Ballena",
    año: 2022,
    descripción:
      "Un profesor con obesidad severa intenta reconectar con su hija adolescente alienada en una última oportunidad de redención.",
    precio: 15990,
    descuento: 0, // Sin descuento
    imagen:
      "https://play-lh.googleusercontent.com/5Mw1yirPdDxE6B5s5YLtQfj2dMDzVXXESTZ4JLrCp3Yw6hQQ6PIncFBoXny02XuVgaLXzmlenQ5euqdTOQQ",
  },
  {
    id: 3,
    titulo: "Todo en Todas Partes al Mismo Tiempo",
    año: 2022,
    descripción:
      "Una mujer debe conectar con versiones de sí misma de universos paralelos para prevenir que una poderosa entidad destruya el multiverso.",
    precio: 16990,
    descuento: 18, // 18% OFF
    imagen:
      "https://www.rockandpop.cl/wp-content/uploads/2022/05/posteroficialEverythingallatonce.jpg",
  },
  // Si luego quieres agregar más dramas, duplica el bloque anterior y asigna un nuevo id.
];

// Exportamos para que otros scripts puedan importarlo si usas módulo
// export default dramaMovies;

// Si no utilizas módulos, lo dejamos en scope global:
window.dramaMovies = dramaMovies;