import { Post } from "../helper/index.js";

export const postUsers = async (nombre, documento) => {
    try{
    const nuevoUsuario = {
        name: nombre,
        document: documento,
        active: true 
    };

    const resultado = await Response.json();

    return resultado;
    }
    catch (error){
        console.error("Error: "+error);
    }    
}