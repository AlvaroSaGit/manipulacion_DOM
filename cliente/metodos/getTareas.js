import { get } from "../helpers/index.js";

export const getTareas = async () => {
    return get('tareas');
}