/**
 * realiza una peticion get para obtener datos del servidor.
 * @param {string} url - la ruta de la api a consultar (ej: 'users' o 'tasks').
 * @returns {promise<any>} - los datos devueltos por la base de datos en formato json.
 */

const apiUrl = import.meta.env.VITE_API_URL;

export const get = async (url) => {
    const solicitud = await fetch(`http://${apiUrl}/${url}`);
    const data = await solicitud.json()
    return data;
}