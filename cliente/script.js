import { postUsers } from "./metodos/index.js";

import { get } from "./helper/index.js";
import { getTareas } from "./metodos/index.js";
// ... los demás imports que ya tengas

/**
 * Notas sobre como leer este codigo:
 * 
 * Veras que las funciones tienen unos comentarios especiales arriba. Usamos JSDoc para 
 * dejar notas claras sobre que hace cada cosa.
 * 
 * - @param: Simplemente nos dice que informacion le tenemos que pasar a la funcion.
 * - @returns: Nos avisa que resultado nos va a devolver la funcion cuando termine.
 * 
 * Escribirlo asi ayuda a que VS Code nos entienda y nos de autocompletado al programar.
 */

/**
 * Ejercicio principal de manipulacion del DOM.
 * Aqui controlamos la busqueda de los usuarios y como se registran sus tareas en la pantalla.
 */

// ---- 1 - SELECCION DE ELEMENTOS DEL DOM ----

/**
 * Seleccionamos los elementos del DOM que necesitamos manipular.
 * Usamos getElementById para obtener referencias a los elementos unicos.
 */

// ID del apartado para mostrar usuarios
const mostrarUsuarios = document.getElementById('mostrarUsuarios');

const userForm = document.querySelector('#searchUserForm');
const userDocInput = document.querySelector('#searchUserId');
const userDocError = document.querySelector('#searchError');
const userInfoContainer = document.querySelector('#userInfoContainer');

// Registro de tareas
const taskForm = document.querySelector('#taskForm');
const taskFieldset = document.querySelector('#taskFieldset');
const taskTitle = document.querySelector('#taskTitle');
const taskTitleError = document.querySelector('#taskTitleError');
const taskDescription = document.querySelector('#taskDescription');
const taskDescriptionError = document.querySelector('#taskDescriptionError');

// Tabla de tareas (Apunta al <tbody> en el HTML, el contenedor donde viviran las filas)
const tasksTableBody = document.querySelector('#tasksTableBody');
const taskCount = document.querySelector('#taskCount');

// Estado de la aplicacion
let usuarioEncontrado = null;
let totalTareas = 0;

// ---- 2 - FUNCIONES AUXILIARES ----

/**
 * Verifica si un campo de texto contiene informacion valida (no solo espacios en blanco)
 * @param {string} value - El texto a evaluar
 * @returns {boolean} - true si es valido, false si esta vacio
 */
function isValidInput(value) {
    return value.trim().length > 0;
}

/**
 * Muestra un mensaje de error en la interfaz. Si no encuentra el elemento, usa un alert()
 * @param {HTMLElement} errorElement - El contenedor donde se inyectara el mensaje
 * @param {string} message - El mensaje de advertencia
 */
function showError(errorElement, message) {
    if (errorElement) {
        errorElement.textContent = message;
    } else {
        // Respaldo visual si el elemento no existe en el HTML
        alert(message);
    }
}

/**
 * Limpia un mensaje de error especifico de la interfaz
 * @param {HTMLElement} errorElement - El contenedor del error
 */
function clearError(errorElement) {
    if (errorElement) {
        errorElement.textContent = '';
    }
}

/**
 * Oculta todos los mensajes de error relacionados con el formulario de tareas
 */
function clearTaskErrors() {
    clearError(taskTitleError);
    clearError(taskDescriptionError);
}

/**
 * Actualiza el contador dinamico de tareas registradas en la tabla
 */
function updateTaskCount() {
    taskCount.textContent = totalTareas + (totalTareas === 1 ? ' tarea' : ' tareas');
}

// ---- 3 - CREACION DE ELEMENTOS ----

/**
 * Crea y renderiza una nueva fila dentro de la tabla de tareas
 * @param {Object} usuario - Los datos del usuario (para mostrar a quien pertenece)
 * @param {string} titulo - El titulo principal de la tarea
 * @param {string} descripcion - Los detalles de la tarea
 * @param {string} taskId - El identificador unico generado por la base de datos
 */
function agregarTareaATabla(usuario, titulo, descripcion, taskId) {
    // Elimina el mensaje de "No hay tareas" si la tabla estaba vacia
    const emptyRow = document.querySelector('#emptyTasksRow');
    if (emptyRow) {
        emptyRow.remove();
    }
    
    // Armamos la fila (tr) que sostendra toda la informacion en la tabla
    const fila = document.createElement('tr');

    // Vamos creando una a una las celdas (td) y llenandolas con los textos correspondientes
    const celdaUsuario = document.createElement('td');
    celdaUsuario.textContent = usuario.nombre;

    const celdaTitulo = document.createElement('td');
    celdaTitulo.textContent = titulo;

    const celdaDescripcion = document.createElement('td');
    celdaDescripcion.textContent = descripcion;

    // Contenedor de botones de acciones (Editar y Eliminar)
    const celdaAcciones = document.createElement('td');
    celdaAcciones.className = 'table-actions';

    // --- Logica del Boton Editar ---
    const btnEditar = document.createElement('button');
    btnEditar.textContent = 'Editar';
    btnEditar.className = 'btn btn--warning';

    btnEditar.addEventListener('click', async () => {
        // Solicitamos los nuevos datos mediante ventanas nativas (si cancela, retorna null)
        const nuevoTitulo = prompt('Edita el titulo de la tarea:', celdaTitulo.textContent);
        if (nuevoTitulo === null) return; 
        
        const nuevaDescripcion = prompt('Edita la descripcion de la tarea:', celdaDescripcion.textContent);
        if (nuevaDescripcion === null) return;

        // Validamos que no los deje vacios
        if (nuevoTitulo.trim() === '' || nuevaDescripcion.trim() === '') {
            alert('El titulo y la descripcion no pueden estar vacios.');
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/tasks/${taskId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: nuevoTitulo.trim(), description: nuevaDescripcion.trim() })
            });

            if (!response.ok) throw new Error('Error al actualizar en el servidor');

            // Reflejamos los cambios en el DOM inmediatamente para evitar recargar la pagina
            celdaTitulo.textContent = nuevoTitulo.trim();
            celdaDescripcion.textContent = nuevaDescripcion.trim();
        } catch (error) {
            alert('Hubo un error al intentar actualizar la tarea.');
        }
    });
    
    // --- Logica del Boton Eliminar ---
    const btnEliminar = document.createElement('button');
    btnEliminar.textContent = 'Eliminar';
    btnEliminar.className = 'btn btn--danger';
    
    btnEliminar.addEventListener('click', async () => {
        // Confirmacion de seguridad antes de modificar la base de datos
        if (!confirm('¿Estas seguro de que deseas eliminar esta tarea?')) return;
        
        try {
            // 1. La borramos de la base de datos de verdad
            await fetch(`http://localhost:3000/tasks/${taskId}`, { method: 'DELETE' });
            
            // 2. La quitamos visualmente de la tabla
            fila.remove();
            totalTareas--;
            updateTaskCount();
            
            if (totalTareas === 0) {
                tasksTableBody.innerHTML = '<tr id="emptyTasksRow"><td colspan="4" style="text-align: center; padding: 24px; color: #9ca3af; font-style: italic;">No hay tareas registradas</td></tr>';
            }
        } catch (error) {
            alert('Hubo un error al intentar eliminar la tarea.');
        }
    });
    
    // appendChild significa "agregar como hijo". Es la forma de meter un elemento dentro de otro.
    // Aqui metemos los botones adentro de la celda de acciones.
    celdaAcciones.appendChild(btnEditar);
    celdaAcciones.appendChild(btnEliminar);

    // Luego metemos todas las celdas adentro de la fila (tr)
    fila.appendChild(celdaUsuario);
    fila.appendChild(celdaTitulo);
    fila.appendChild(celdaDescripcion);
    fila.appendChild(celdaAcciones);

    // Y finalmente, pegamos la fila completa adentro del cuerpo de la tabla en el HTML
    tasksTableBody.appendChild(fila);

    totalTareas++;
    updateTaskCount();
}

// ---- 3.1 - MOSTRAR USUARIOS (DB.JSON) ----

/**
 * Crea la tarjeta visual para presentar un usuario en la parte superior
 * @param {Object} usuarios - La informacion extraida de la base de datos
 */
function mostrarUsers(usuarios){
    // Preparamos las cajas (divs) que le daran forma a la tarjeta visual del usuario
    const liDocument = document.createElement("div");
    const Usuario = document.createElement("div");
    const contenedor = document.createElement("div");

    contenedor.classList.add("containUser");

    liDocument.textContent = usuarios.documento;
    Usuario.textContent = usuarios.nombre;

    contenedor.appendChild(Usuario);
    contenedor.appendChild(liDocument);
    mostrarUsuarios.appendChild(contenedor);
}

/**
 * Funcion de inicializacion que consulta todos los usuarios a la API
 * para renderizarlos apenas entra a la aplicacion
 */
const Usuariosmostrar = async ()=>{
    const usuarios = await getTareas();
    usuarios.forEach(i => mostrarUsers(i));
}
Usuariosmostrar();

// ---- 3.2 - CARGAR TAREAS DEL USUARIO ----
/**
 * Solicita a la API todas las tareas asociadas a un usuario especifico y las dibuja en tabla
 * @param {string} userId - El ID interno del usuario
 */
async function cargarTareasUsuario(userId) {
    try {
        const response = await fetch(`http://localhost:3000/tasks?userId=${userId}`);
        const tareas = await response.json();
        
        // Limpiamos la tabla para que no se dupliquen las tareas
        tasksTableBody.innerHTML = '';
        totalTareas = 0;
        
        if (tareas.length === 0) {
            tasksTableBody.innerHTML = '<tr id="emptyTasksRow"><td colspan="4" style="text-align: center; padding: 24px; color: #9ca3af; font-style: italic;">No hay tareas registradas</td></tr>';
        } else {
            tareas.forEach(tarea => agregarTareaATabla(usuarioEncontrado, tarea.title, tarea.description, tarea.id));
        }
        updateTaskCount();
    } catch (error) {
        console.error('Error al cargar las tareas:', error);
    }
}

// ---- 4 - MANEJO DE EVENTOS ----

/**
 * Ejecuta la busqueda de un usuario mediante su numero de documento en la base de datos.
 * Si existe, almacena el usuario activo y dispara la busqueda de sus tareas.
 * @param {Event} event - El evento de envio del formulario
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
        const users = await response.json();
    
        console.log('Respuesta JSON:', users);
    
        const user = users.find(
                u => String(u.documento).trim() === String(documento).trim()
        );
    
        if (user) {
            alert(`Usuario encontrado: ${user.nombre}`);
            console.log('Usuario encontrado:', user);

            // 1. Guardamos el usuario para usarlo despues
            usuarioEncontrado = user;

            // 2. Mostramos la informacion del usuario en la UI
            userInfoContainer.style.display = 'block';
            userInfoContainer.innerHTML =
                '<strong>Usuario encontrado:</strong><br>' +
                'Nombre: ' + user.nombre + '<br>' +
                'Documento: ' + user.documento;

            // 3. Consultamos las tareas que el usuario ya tenga guardadas
            await cargarTareasUsuario(user.id);

        } else {
            // Si no se encuentra, reseteamos todo
            usuarioEncontrado = null;
            userInfoContainer.style.display = 'none';
            showError(userDocError, 'Usuario no encontrado');
        }
    } catch (error) {
        console.error('Error al conectar con el servidor:', error);
        showError(userDocError, 'Error al conectar con el servidor');
    }
}

function handleUserInput() {
    if (userDocInput.value.trim().length > 0) {
        clearError(userDocError);
    }
}

function handleTaskTitleInput() {
    if (taskTitle.value.trim().length > 0) {
        clearError(taskTitleError);
    }
}

function handleTaskDescriptionInput() {
    if (taskDescription.value.trim().length > 0) {
        clearError(taskDescriptionError);
    }
}

/**
 * Valida y registra una nueva tarea asociada al usuario activo, 
 * enviandola a la base de datos mediante una peticion POST.
 * @param {Event} event - El evento de envio del formulario
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

    let isValid = true;
    if (!isValidInput(titulo)) {
        showError(taskTitleError, 'Ingresa el titulo de la tarea');
        isValid = false;
    }

    if (!isValidInput(descripcion)) {
        showError(taskDescriptionError, 'Ingresa la descripcion de la tarea');
        isValid = false;
    }

    if (!isValid) return;

    const nuevaTarea = {
        title: titulo,
        description: descripcion,
        completed: false,
        userId: usuarioEncontrado.id
    };

    try {
        const response = await fetch('http://localhost:3000/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevaTarea)
        });

        if (!response.ok) throw new Error('Error en la respuesta del servidor');

        const tareaCreada = await response.json();
        agregarTareaATabla(usuarioEncontrado, tareaCreada.title, tareaCreada.description, tareaCreada.id);
        taskForm.reset();
        alert('¡Tarea registrada exitosamente!');
    } catch (error) {
        console.error('Error al crear la tarea:', error);
        alert('No se pudo registrar la tarea. Revisa la consola para mas detalles.');
    }
}

// ---- 5 - REGISTRO DE EVENTOS ----

userForm.addEventListener('submit', handleUserSearch);
userDocInput.addEventListener('input', handleUserInput);

taskForm.addEventListener('submit', handleTaskSubmit);
taskTitle.addEventListener('input', handleTaskTitleInput);
taskDescription.addEventListener('input', handleTaskDescriptionInput);

// ---- 6 - INICIALIZACION ----

document.addEventListener('DOMContentLoaded', function () {
    updateTaskCount();
    console.log('✅ DOM completamente cargado');
    console.log('📝 Aplicacion de gestion de tareas iniciada');
});