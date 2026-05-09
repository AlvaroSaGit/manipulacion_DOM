import { patch, remove } from "../helper/index.js";

/**
 * Crea una nueva fila en la tabla de tareas y agrega botones de editar y eliminar.
 *
 * @param {Object|null} usuario - Usuario al que pertenece la tarea
 * @param {string} titulo - Titulo de la tarea
 * @param {string} descripcion - Descripcion de la tarea
 * @param {string} taskId - ID unico de la tarea en la base de datos
 * @param {HTMLElement} tasksTableBody - El cuerpo de la tabla en el DOM
 * @param {Object} acciones - Objeto con callbacks para actualizar el estado global
 */
export function agregarTareaATabla(usuario, titulo, descripcion, taskId, tasksTableBody, acciones) {
    try {
        // Si existe la fila de "No hay tareas", la quitamos para insertar tareas reales
        const emptyRow = document.querySelector('#emptyTasksRow');
        if (emptyRow) {
            emptyRow.remove();
        }

        // Creamos la fila principal
        const fila = document.createElement('tr');
        fila.style.borderBottom = '1px solid #ddd';

        // Celda del usuario
        const celdaUsuario = document.createElement('td');
        celdaUsuario.textContent = usuario?.nombre ?? 'Sin usuario';
        celdaUsuario.style.padding = '12px';

        // Celda del titulo
        const celdaTitulo = document.createElement('td');
        celdaTitulo.textContent = titulo ?? '';
        celdaTitulo.style.padding = '12px';

        // Celda de descripcion
        const celdaDescripcion = document.createElement('td');
        celdaDescripcion.textContent = descripcion ?? '';
        celdaDescripcion.style.padding = '12px';

        // Celda para botones de accion
        const celdaAcciones = document.createElement('td');
        celdaAcciones.style.padding = '12px';
        celdaAcciones.className = 'table-actions';

        // Boton editar
        const btnEditar = document.createElement('button');
        btnEditar.textContent = 'Editar';
        btnEditar.className = 'btn btn--warning';
        btnEditar.style.marginRight = '8px';

        btnEditar.addEventListener('click', async () => {
            const nuevoTitulo = prompt('Edita el titulo de la tarea:', celdaTitulo.textContent);
            if (nuevoTitulo === null) return;

            const nuevaDescripcion = prompt('Edita la descripcion de la tarea:', celdaDescripcion.textContent);
            if (nuevaDescripcion === null) return;

            if (nuevoTitulo.trim() === '' || nuevaDescripcion.trim() === '') {
                alert('El titulo y la descripcion no pueden estar vacios.');
                return;
            }

            try {
                // Usamos nuestro helper de PATCH
                await patch(`tasks/${taskId}`, {
                    title: nuevoTitulo.trim(),
                    description: nuevaDescripcion.trim()
                });

                // Reflejamos el cambio en el DOM sin recargar la pagina
                celdaTitulo.textContent = nuevoTitulo.trim();
                celdaDescripcion.textContent = nuevaDescripcion.trim();
            } catch (error) {
                console.error('Error al editar tarea:', error);
                alert('Hubo un error al intentar actualizar la tarea.');
            }
        });

        // Boton eliminar
        const btnEliminar = document.createElement('button');
        btnEliminar.textContent = 'Eliminar';
        btnEliminar.className = 'btn btn--danger';

        btnEliminar.addEventListener('click', async () => {
            const confirmado = confirm('¿Estas seguro de que deseas eliminar esta tarea?');
            if (!confirmado) return;

            try {
                // Usamos nuestro helper de DELETE
                await remove(`tasks/${taskId}`);

                // Eliminamos la fila visualmente y disparamos la accion global
                fila.remove();
                acciones.onTareaEliminada();
            } catch (error) {
                console.error('Error al eliminar tarea:', error);
                alert('Hubo un error al intentar eliminar la tarea.');
            }
        });

        celdaAcciones.appendChild(btnEditar);
        celdaAcciones.appendChild(btnEliminar);
        fila.appendChild(celdaUsuario);
        fila.appendChild(celdaTitulo);
        fila.appendChild(celdaDescripcion);
        fila.appendChild(celdaAcciones);

        tasksTableBody.appendChild(fila);

        // Disparamos la accion global de sumar una tarea
        acciones.onTareaAgregada();
    } catch (error) {
        console.error('Error al renderizar tarea:', error);
    }
}