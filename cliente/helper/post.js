export const Post = async (url, body) => {
    return await fetch(`http://localhost:3000/${url}`, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    })
        .then((response) => response.json())
        .then((json) => console.log(json));
        console.log(json);
        return json; // Devolvemos el resultado
};