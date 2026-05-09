export const remove = async (endpoint) => {
    const response = await fetch(`http://localhost:3000/${endpoint}`, {
        method: 'DELETE'
    });
    if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
    }
    return await response.json();
};