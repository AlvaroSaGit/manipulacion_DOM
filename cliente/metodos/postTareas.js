import { Post } from "../helper/index.js";

export const createTask = (title,description) => {
    const idUsuario = localStorage.getItem("idUsuarioActual");
    const newTask = {
        title: title,
        description:description,
        userID: parseInt(idUsuario)
    }
    Post("tareas", newTask);

    alert("Tarea creada exitosamente");
}