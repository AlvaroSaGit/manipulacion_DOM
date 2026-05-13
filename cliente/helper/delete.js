/**
 * realiza una peticion delete para borrar permanentemente un registro del servidor.
 * @param {string} endpoint - la ruta y el id de lo que vamos a borrar (ej: 'tasks/3').
 * @returns {promise<any>} - confirmacion del servidor de que fue eliminado.
 */
export const remove = async (endpoint) => {
    const response = await fetch(`http://10.5.225.158:3000/${endpoint}`, {
        method: 'DELETE'
    });
    if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
    }
    return await response.json();
};