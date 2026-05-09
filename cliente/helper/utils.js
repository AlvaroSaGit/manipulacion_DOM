/**
 * Verifica si un texto ingresado es valido.
 * Un valor es valido si, despues de quitar espacios, aun contiene caracteres.
 *
 * @param {string} value - Texto recibido desde un input
 * @returns {boolean} - true si el texto tiene contenido, false si esta vacio
 */
export function isValidInput(value) {
    return value.trim().length > 0;
}

/**
 * Muestra un mensaje de error en la interfaz. Si no encuentra el elemento, usa un alert()
 * @param {HTMLElement} errorElement - El contenedor donde se inyectara el mensaje
 * @param {string} message - El mensaje de advertencia
 */
export function showError(errorElement, message) {
    if (errorElement) {
        errorElement.textContent = message;
    } else {
        alert(message);
    }
}

/**
 * Limpia el contenido de un contenedor de error.
 *
 * @param {HTMLElement} errorElement - Elemento visual donde estaba el mensaje
 */
export function clearError(errorElement) {
    if (errorElement) {
        errorElement.textContent = '';
    }
}