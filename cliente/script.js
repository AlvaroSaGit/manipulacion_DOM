import { get } from "./helper/index.js";

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
const mostrarUsuarios = document.getElementById('mostrarUsuarios');

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

/**
 * Verifica si un texto ingresado es valido.
 * Un valor es valido si, despues de quitar espacios, aun contiene caracteres.
 *
 * @param {string} value - Texto recibido desde un input
 * @returns {boolean} - true si el texto tiene contenido, false si esta vacio
 */
function isValidInput(value) {
    return value.trim().length > 0;
}

/**
 * Muestra un mensaje de error dentro de un elemento del DOM.
 *
 * @param {HTMLElement} errorElement - Elemento donde se mostrara el mensaje
 * @param {string} message - Texto del error que se quiere visualizar
 */
function showError(errorElement, message) {
    if (errorElement) {
        errorElement.textContent = message;
    }
}

/**
 * Limpia el contenido de un contenedor de error.
 *
 * @param {HTMLElement} errorElement - Elemento visual donde estaba el mensaje
 */
function clearError(errorElement) {
    if (errorElement) {
        errorElement.textContent = '';
    }
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
// 4. MOSTRAR USUARIOS
// ================================

/**
 * Crea una tarjeta visual sencilla para mostrar un usuario en pantalla.
 *
 * @param {Object} usuario - Objeto con la informacion del usuario
 * @param {string} usuario.nombre - Nombre del usuario
 * @param {string} usuario.documento - Documento del usuario
 */
function mostrarUsers(usuario) {
    const liDocument = document.createElement("div");
    const usuarioNombre = document.createElement("div");
    const contenedor = document.createElement("div");

    contenedor.classList.add("containUser");

    liDocument.textContent = usuario.documento;
    usuarioNombre.textContent = usuario.nombre;

    contenedor.appendChild(usuarioNombre);
    contenedor.appendChild(liDocument);
    mostrarUsuarios.appendChild(contenedor);
}

/**
 * Consulta todos los usuarios desde la API y los renderiza en el contenedor superior.
 *
 * @returns {Promise<void>}
 */
async function Usuariosmostrar() {
    try {
        const usuarios = await get('users');
        mostrarUsuarios.innerHTML = '';

        usuarios.forEach(usuario => {
            mostrarUsers(usuario);
        });
    } catch (error) {
        console.error('Error al mostrar usuarios:', error);
    }
}

// ================================
// 5. TABLA DE TAREAS
// ================================

/**
 * Crea una nueva fila en la tabla de tareas y agrega botones de editar y eliminar.
 *
 * @param {Object|null} usuario - Usuario al que pertenece la tarea
 * @param {string} titulo - Titulo de la tarea
 * @param {string} descripcion - Descripcion de la tarea
 * @param {string} taskId - ID unico de la tarea en la base de datos
 */
function agregarTareaATabla(usuario, titulo, descripcion, taskId) {
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
                const response = await fetch(`http://localhost:3000/tasks/${taskId}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        title: nuevoTitulo.trim(),
                        description: nuevaDescripcion.trim()
                    })
                });

                if (!response.ok) {
                    throw new Error('Error al actualizar en el servidor');
                }

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
                const response = await fetch(`http://localhost:3000/tasks/${taskId}`, {
                    method: 'DELETE'
                });

                if (!response.ok) {
                    throw new Error('Error al eliminar en el servidor');
                }

                // Eliminamos la fila visualmente y actualizamos el contador
                fila.remove();
                totalTareas--;
                updateTaskCount();

                if (totalTareas === 0) {
                    renderEmptyTasksRow();
                }
            } catch (error) {
                console.error('Error al eliminar tarea:', error);
                alert('Hubo un error al intentar eliminar la tarea.');
            }
        });

        // Insertamos botones dentro de la celda de acciones
        celdaAcciones.appendChild(btnEditar);
        celdaAcciones.appendChild(btnEliminar);

        // Insertamos todas las celdas dentro de la fila
        fila.appendChild(celdaUsuario);
        fila.appendChild(celdaTitulo);
        fila.appendChild(celdaDescripcion);
        fila.appendChild(celdaAcciones);

        // Finalmente agregamos la fila al tbody
        tasksTableBody.appendChild(fila);

        totalTareas++;
        updateTaskCount();
    } catch (error) {
        console.error('Error al renderizar tarea:', error);
    }
}

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

        const response = await fetch('http://localhost:3000/tasks');

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const tareas = await response.json();
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
                tarea.id
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
        const response = await fetch('http://localhost:3000/users');
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const users = await response.json();
        console.log('Usuarios recibidos:', users);

        const user = users.find(
            u => String(u.documento).trim() === String(documento).trim()
        );

        if (user) {
            usuarioEncontrado = user;

            userInfoContainer.style.display = 'block';
            userInfoContainer.innerHTML = `
                <strong>Usuario encontrado:</strong><br>
                Nombre: ${user.nombre}<br>
                Documento: ${user.documento}
            `;

            taskFieldset.disabled = false;

            await cargarTareasUsuario(String(user.id).trim());
        } else {
            usuarioEncontrado = null;
            userInfoContainer.style.display = 'none';
            taskFieldset.disabled = true;
            showError(userDocError, 'Usuario no encontrado');

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
        alert('Primero debes buscar un usuario');
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
        const response = await fetch('http://localhost:3000/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevaTarea)
        });

        if (!response.ok) {
            throw new Error('Error en la respuesta del servidor');
        }

        const tareaCreada = await response.json();

        agregarTareaATabla(
            usuarioEncontrado,
            tareaCreada.title,
            tareaCreada.description,
            tareaCreada.id
        );

        taskForm.reset();
        alert('¡Tarea registrada exitosamente!');
    } catch (error) {
        console.error('Error al crear la tarea:', error);
        alert('No se pudo registrar la tarea. Revisa la consola para mas detalles.');
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

    Usuariosmostrar();

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