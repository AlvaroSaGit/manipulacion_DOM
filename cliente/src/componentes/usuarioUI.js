import { get } from "@/helper/index.js";

// ================================
// 4. MOSTRAR USUARIOS
// ================================

/**
 * Crea una tarjeta visual sencilla para mostrar un usuario en pantalla.
 *
 * @param {Object} usuario - Objeto con la informacion del usuario
 * @param {HTMLElement} contenedorDestino - Contenedor donde se inyectara el HTML
 */
export function mostrarUsers(usuario, contenedorDestino) {
    const liDocument = document.createElement("div");
    const usuarioNombre = document.createElement("div");
    const contenedor = document.createElement("div");

    contenedor.classList.add("containUser");

    liDocument.textContent = usuario.documento;
    usuarioNombre.textContent = usuario.nombre;

    contenedor.appendChild(usuarioNombre);
    contenedor.appendChild(liDocument);
    contenedorDestino.appendChild(contenedor);
}

/**
 * Consulta todos los usuarios desde la API y los renderiza en el contenedor superior.
 * @param {HTMLElement} contenedorDestino - Contenedor principal de la UI
 *
 * @returns {Promise<void>}
 */
export async function Usuariosmostrar(contenedorDestino) {
    try {
        const usuarios = await get('users');
        contenedorDestino.innerHTML = '';

        usuarios.forEach(usuario => {
            mostrarUsers(usuario, contenedorDestino);
        });
    } catch (error) {
        console.error('Error al mostrar usuarios:', error);
    }
}