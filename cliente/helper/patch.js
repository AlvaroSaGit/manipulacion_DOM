/**
 * realiza una peticion patch para actualizar solo una parte especifica de un registro.
 * @param {string} endpoint - la ruta y el id exacto a modificar (ej: 'tasks/3').
 * @param {object} data - los campos especificos que queremos cambiar.
 * @returns {promise<any>} - la confirmacion y el registro actualizado.
 */
export const patch = async (endpoint, data) => {
    const response = await fetch(`http://10.5.225.158:3000/${endpoint}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
    }
    return await response.json();
};