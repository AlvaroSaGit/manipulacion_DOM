import { get, post, isValidInput, showError, clearError } from "./helper/index.js";
import { Usuariosmostrar } from "./componentes/usuarioUI.js";
import { agregarTareaATabla } from "./componentes/tareaUI.js";
import { inicializarModalEdicion } from "./componentes/modalEditar.js";
import { inicializarModalEliminar } from './componentes/modalEliminar.js';

/**
 * Notas sobre como leer este codigo:
 *
 * Este archivo usa comentarios en formato JSDoc para explicar de manera clara
 * que hace cada funcion, que datos recibe y como participa en el flujo general.
 *
 * Etiquetas mas comunes:
 * - @param: indica que valor recibe una funcion.
 * - @returns: indica que devuelve una funcion.
 *
 * Escribir asi el codigo ayuda a que VS Code muestre autocompletado,
 * sugerencias y una mejor comprension de cada bloque.
 */

/**
 * Aplicacion principal de gestion de tareas.
 *
 * Aqui controlamos:
 * - La carga visual de usuarios.
 * - La busqueda de usuarios por documento.
 * - El registro, edicion y eliminacion de tareas.
 * - La actualizacion dinamica de la tabla y del contador.
 */

// ================================
// 1. SELECCION DE ELEMENTOS DEL DOM
// ================================

/**
 * Capturamos todos los elementos del DOM que la aplicacion necesita manipular.
 * Estas referencias permiten leer valores, mostrar mensajes y renderizar informacion.
 */

// Contenedor donde se muestran los usuarios disponibles
const mostrarUsuarios = document.querySelector('#mostrarUsuarios');

// Formulario de busqueda de usuario
const userForm = document.querySelector('#searchUserForm');
const userDocInput = document.querySelector('#searchUserId');
const userDocError = document.querySelector('#searchError');
const userInfoContainer = document.querySelector('#userInfoContainer');

// Formulario de registro de tareas
const taskForm = document.querySelector('#taskForm');
const taskFieldset = document.querySelector('#taskFieldset');
const taskTitle = document.querySelector('#taskTitle');
const taskTitleError = document.querySelector('#taskTitleError');
const taskDescription = document.querySelector('#taskDescription');
const taskDescriptionError = document.querySelector('#taskDescriptionError');

// Elementos de la tabla de tareas
const tasksTableBody = document.querySelector('#tasksTableBody');
const taskCount = document.querySelector('#taskCount');

// ================================
// 2. ESTADO DE LA APLICACION
// ================================

/**
 * Variables globales de estado.
 *
 * - usuarioEncontrado: guarda el usuario actualmente seleccionado.
 * - totalTareas: lleva el conteo visual de tareas en la tabla.
 */
let usuarioEncontrado = null;
let totalTareas = 0;

// ================================
// 3. FUNCIONES AUXILIARES
// ================================

function showToast(message, type = 'info') {
    const container = document.querySelector('#toastContainer');

    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.textContent = message;

    container.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}
/**
 * Limpia todos los errores relacionados con el formulario de tareas.
 */
function clearTaskErrors() {
    clearError(taskTitleError);
    clearError(taskDescriptionError);
}

/**
 * Actualiza el contador visual de tareas registradas.
 * Cambia automaticamente entre singular y plural.
 */
function updateTaskCount() {
    taskCount.textContent = `${totalTareas} ${totalTareas === 1 ? 'tarea' : 'tareas'}`;
}

/**
 * Renderiza una fila vacia cuando no existen tareas registradas.
 */
function renderEmptyTasksRow() {
    tasksTableBody.innerHTML = `
        <tr id="emptyTasksRow">
            <td colspan="4" style="text-align: center; padding: 20px; color: #666;">
                No hay tareas registradas aun.
            </td>
        </tr>
    `;
}

/**
 * Limpia por completo la tabla de tareas y reinicia el contador.
 */
function limpiarTablaTareas() {
    tasksTableBody.innerHTML = '';
    totalTareas = 0;
    updateTaskCount();
}



// ================================
// 5. CARGA DE TAREAS
// ================================

/**
 * Consulta todas las tareas desde la API y luego filtra en JavaScript
 * solo las que pertenecen al usuario activo.
 *
 * Esta version evita depender del filtro directo del servidor y
 * compara manualmente el userId con el id del usuario seleccionado.
 *
 * @param {string} userId - ID del usuario cuyas tareas se van a mostrar
 * @returns {Promise<void>}
 */
async function cargarTareasUsuario(userId) {
    try {
        const userIdNormalizado = String(userId).trim();

        // Usamos nuestro helper GET
        const tareas = await get('tasks');
        console.log('Tareas recibidas:', tareas);

        limpiarTablaTareas();

        if (!Array.isArray(tareas) || tareas.length === 0) {
            renderEmptyTasksRow();
            return;
        }

        // Filtramos solamente las tareas del usuario actual
        const tareasFiltradas = tareas.filter(tarea =>
            String(tarea.userId).trim() === userIdNormalizado
        );

        if (tareasFiltradas.length === 0) {
            renderEmptyTasksRow();
            return;
        }

        tareasFiltradas.forEach(tarea => {
            agregarTareaATabla(
                usuarioEncontrado,
                tarea.title,
                tarea.description,
                tarea.id,
                tasksTableBody,
                {
                    onTareaAgregada: () => {
                        totalTareas++;
                        updateTaskCount();
                    },
                    onTareaEliminada: () => {
                        totalTareas--;
                        updateTaskCount();
                        if (totalTareas === 0) renderEmptyTasksRow();
                    }
                }
            );
        });
    } catch (error) {
        console.error('Error al cargar las tareas:', error);
        tasksTableBody.innerHTML = `
            <tr>
                <td colspan="4" style="text-align: center; padding: 20px; color: red;">
                    Error al cargar las tareas
                </td>
            </tr>
        `;
    }
}

// ================================
// 6. BUSQUEDA DE USUARIO
// ================================

/**
 * Procesa la busqueda de un usuario por numero de documento.
 * Si encuentra coincidencia:
 * - Guarda el usuario actual.
 * - Muestra su informacion.
 * - Habilita el formulario de tareas.
 * - Carga sus tareas asociadas.
 *
 * @param {Event} event - Evento submit del formulario
 * @returns {Promise<void>}
 */
async function handleUserSearch(event) {
    event.preventDefault();

    clearError(userDocError);

    const documento = userDocInput.value.trim();

    if (!isValidInput(documento)) {
            showError(userDocError, 'Ingresa el documento del usuario');
            return;
    }
    
    try {
        // Usamos nuestro helper GET
        const users = await get('users');
        console.log('Usuarios recibidos:', users);

        const user = users.find(
            u => String(u.documento).trim() === String(documento).trim()
        );
    
        if (user) {
            showToast(`Usuario encontrado: ${user.nombre}`);
            console.log('Usuario encontrado:', user);

            // 1. Guardamos el usuario para usarlo despues
            usuarioEncontrado = user;

            // 2. Mostramos la informacion del usuario en la UI
            userInfoContainer.style.display = 'block';
            userInfoContainer.innerHTML = `
                <strong>Usuario encontrado:</strong><br>
                Nombre: ${user.nombre}<br>
                Documento: ${user.documento}
            `;

            taskFieldset.disabled = false;

            await cargarTareasUsuario(String(user.id).trim());
        } else {
            // Si no se encuentra, reseteamos todo
            usuarioEncontrado = null;
            userInfoContainer.style.display = 'none';
            showError(userDocError, 'Usuario no encontrado');
            showToast('Usuario no encontrado', 'error');

            limpiarTablaTareas();
            renderEmptyTasksRow();
        }
    } catch (error) {
        console.error('Error al conectar con el servidor:', error);
        showError(userDocError, 'Error al conectar con el servidor');
    }
}

/**
 * Limpia el error del documento cuando el usuario empieza a escribir.
 */
function handleUserInput() {
    if (userDocInput.value.trim().length > 0) {
        clearError(userDocError);
    }
}

/**
 * Limpia el error del titulo cuando el usuario empieza a escribir.
 */
function handleTaskTitleInput() {
    if (taskTitle.value.trim().length > 0) {
        clearError(taskTitleError);
    }
}

/**
 * Limpia el error de la descripcion cuando el usuario empieza a escribir.
 */
function handleTaskDescriptionInput() {
    if (taskDescription.value.trim().length > 0) {
        clearError(taskDescriptionError);
    }
}

// ================================
// 7. REGISTRO DE NUEVA TAREA
// ================================

/**
 * Valida y registra una nueva tarea para el usuario actualmente seleccionado.
 * Luego la agrega visualmente a la tabla sin necesidad de recargar la pagina.
 *
 * @param {Event} event - Evento submit del formulario de tareas
 * @returns {Promise<void>}
 */
async function handleTaskSubmit(event) {
    event.preventDefault();

    const titulo = taskTitle.value.trim();
    const descripcion = taskDescription.value.trim();
    clearTaskErrors();

    if (!usuarioEncontrado) {
        showToast('Primero debes buscar un usuario');
        return;
    }

    let esValido = true;

    if (!isValidInput(titulo)) {
        showError(taskTitleError, 'Ingresa el titulo de la tarea');
        esValido = false;
    }

    if (!isValidInput(descripcion)) {
        showError(taskDescriptionError, 'Ingresa la descripcion de la tarea');
        esValido = false;
    }

    if (!esValido) return;

    const nuevaTarea = {
        title: titulo,
        description: descripcion,
        completed: false,
        userId: String(usuarioEncontrado.id).trim()
    };

    try {
        // Usamos nuestro helper POST
        const tareaCreada = await post('tasks', nuevaTarea);

        agregarTareaATabla(
            usuarioEncontrado,
            tareaCreada.title,
            tareaCreada.description,
            tareaCreada.id,
            tasksTableBody,
            {
                onTareaAgregada: () => {
                    totalTareas++;
                    updateTaskCount();
                },
                onTareaEliminada: () => {
                    totalTareas--;
                    updateTaskCount();
                    if (totalTareas === 0) renderEmptyTasksRow();
                }
            }
        );

        taskForm.reset();
        showToast('¡Tarea registrada exitosamente!');
    } catch (error) {
        console.error('Error al crear la tarea:', error);
        showToast('No se pudo registrar la tarea. Revisa la consola para mas detalles.', 'error');
    }
}

// ================================
// 8. INICIALIZACION
// ================================

/**
 * Inicializa la aplicacion:
 * - Verifica que existan los elementos importantes del DOM.
 * - Deshabilita el formulario de tareas al inicio.
 * - Muestra el estado vacio de la tabla.
 * - Registra todos los eventos.
 * - Carga la lista de usuarios.
 */
function init() {
    if (!userForm || !taskForm || !tasksTableBody || !taskCount) {
        console.error('No se encontraron elementos clave del DOM');
        return;
    }

    taskFieldset.disabled = true;
    updateTaskCount();
    renderEmptyTasksRow();

    userForm.addEventListener('submit', handleUserSearch);
    userDocInput.addEventListener('input', handleUserInput);

    taskForm.addEventListener('submit', handleTaskSubmit);
    taskTitle.addEventListener('input', handleTaskTitleInput);
    taskDescription.addEventListener('input', handleTaskDescriptionInput);

    // Le pasamos el elemento visual donde queremos que pinte la lista
    Usuariosmostrar(mostrarUsuarios);
    inicializarModalEdicion(showToast);
    inicializarModalEliminar(showToast);



    console.log('✅ DOM completamente cargado');
    console.log('📝 Aplicacion de gestion de tareas iniciada');
}
/**
 * Ejecuta la inicializacion en el momento correcto.
 *
 * - Si el DOM aun se esta cargando, espera al evento DOMContentLoaded.
 * - Si el DOM ya esta listo, ejecuta init() inmediatamente.
 *
 * Esto hace que la aplicacion sea mas robusta y evita que falle
 * si el script se carga despues de que el documento ya este listo.
 */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
