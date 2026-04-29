import { Post } from "../helper/post.js";

export const postUsers = async (nombre, documento) => {
    const nuevoUsuario = {
        name: nombre,
        document: documento,
        active: true 
    };

    return await Post('users', nuevoUsuario);
}