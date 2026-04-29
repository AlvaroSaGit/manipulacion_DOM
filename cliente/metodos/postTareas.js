import {post} from "../helpers/index.js"

export const createTask = (title,description) => {
    const idUsuario = localStorage.getItem("idUsuarioActual");
    const newTask = {
        title: title,
        description:description,
        userID: parseInt(idUsuario)
    }
    post("tareas", newTask);

    alert("Tarea creada exitosamente");
}