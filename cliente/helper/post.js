/**
 * realiza una peticion post para crear un nuevo registro en la base de datos.
 * @param {string} endpoint - la ruta de la api donde se guardara (ej: 'tasks').
 * @param {object} data - la informacion del objeto que queremos guardar.
 * @returns {promise<any>} - la respuesta del servidor con el objeto ya creado.
 */
export const post = async (endpoint, data) => {
    const response = await fetch(`http://10.5.225.158:3000/${endpoint}`, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
    }
    return await response.json();
};