import { get } from "../helper/index.js";
export const getUsersById = async(id) => {
    const solicitud = await fetch(`http://localhost:3000/users ${id}`);
    const data = await solicitud.json()
    return data;
}