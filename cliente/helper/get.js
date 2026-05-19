/**
 * realiza una peticion get para obtener datos del servidor.
 * @param {string} url - la ruta de la api a consultar (ej: 'users' o 'tasks').
 * @returns {promise<any>} - los datos devueltos por la base de datos en formato json.
 */
export const get = async (url) => {
    const solicitud = await fetch(`http://localhost:3000/${url}`);
    const data = await solicitud.json()
    return data;
}