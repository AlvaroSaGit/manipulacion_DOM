import { postUsers } from "./metodos/index.js";

import { get } from "./helper/index.js";
import { getTareas } from "./metodos/index.js";
// ... los demás imports que ya tengas


/**
 * ============================================
 * EJERCICIO DE MANIPULACION DEL DOM
 * ============================================
 * Objetivo: Busqueda de usuarios y registro de tareas
 * Autor:
 * ============================================
 */

// ============================================
// 1. SELECCIÓN DE ELEMENTOS DEL DOM
// ============================================

/**
 * Seleccionamos los elementos del DOM que necesitamos manipular.
 * Usamos getElementById para obtener referencias a los elementos únicos.
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

// Tabla de tareas
const tasksTableBody = document.querySelector('#tasksTableBody');
const taskCount = document.querySelector('#taskCount');

// Estado de la aplicacion
let usuarioEncontrado = null;
let totalTareas = 0;

// ============================================
// 2. FUNCIONES AUXILIARES
// ============================================

function isValidInput(value) {
    return value.trim().length > 0;
}

function showError(errorElement, message) {
    if (errorElement) {
        errorElement.textContent = message;
    } else {
        alert(message); // Respaldo visual si el elemento no existe en el HTML
    }
}

function clearError(errorElement) {
    if (errorElement) {
        errorElement.textContent = '';
    }
}

function clearTaskErrors() {
    clearError(taskTitleError);
    clearError(taskDescriptionError);
}

function updateTaskCount() {
    taskCount.textContent = totalTareas + (totalTareas === 1 ? ' tarea' : ' tareas');
}

// ============================================
// 3. CREACIÓN DE ELEMENTOS
// ============================================

function agregarTareaATabla(usuario, titulo, descripcion, taskId) {
    const emptyRow = document.querySelector('#emptyTasksRow');
    if (emptyRow) {
        emptyRow.remove();
    }
    
    const fila = document.createElement('tr');

    const celdaUsuario = document.createElement('td');
    celdaUsuario.textContent = usuario.nombre;

    const celdaTitulo = document.createElement('td');
    celdaTitulo.textContent = titulo;

    const celdaDescripcion = document.createElement('td');
    celdaDescripcion.textContent = descripcion;

    // --- NUEVO: Celda para el botón de acciones ---
    const celdaAcciones = document.createElement('td');
    celdaAcciones.className = 'table-actions';

    // Botón Editar
    const btnEditar = document.createElement('button');
    btnEditar.textContent = 'Editar';
    btnEditar.className = 'btn btn--warning';

    btnEditar.addEventListener('click', async () => {
        // Pedimos al usuario los nuevos datos (si cancela, retorna null)
        const nuevoTitulo = prompt('Edita el título de la tarea:', celdaTitulo.textContent);
        if (nuevoTitulo === null) return; 
        
        const nuevaDescripcion = prompt('Edita la descripción de la tarea:', celdaDescripcion.textContent);
        if (nuevaDescripcion === null) return;

        // Validamos que no los deje vacíos
        if (nuevoTitulo.trim() === '' || nuevaDescripcion.trim() === '') {
            alert('El título y la descripción no pueden estar vacíos.');
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/tasks/${taskId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: nuevoTitulo.trim(), description: nuevaDescripcion.trim() })
            });

            if (!response.ok) throw new Error('Error al actualizar en el servidor');

            // Actualizamos la tabla en el DOM inmediatamente (RF-03)
            celdaTitulo.textContent = nuevoTitulo.trim();
            celdaDescripcion.textContent = nuevaDescripcion.trim();
        } catch (error) {
            alert('Hubo un error al intentar actualizar la tarea.');
        }
    });
    
    const btnEliminar = document.createElement('button');
    btnEliminar.textContent = 'Eliminar';
    btnEliminar.className = 'btn btn--danger';
    
    btnEliminar.addEventListener('click', async () => {
        // Pedimos confirmación (Requisito del RF-04)
        if (!confirm('¿Estás seguro de que deseas eliminar esta tarea?')) return;
        
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
    celdaAcciones.appendChild(btnEditar);
    celdaAcciones.appendChild(btnEliminar);

    fila.appendChild(celdaUsuario);
    fila.appendChild(celdaTitulo);
    fila.appendChild(celdaDescripcion);
    fila.appendChild(celdaAcciones);

    tasksTableBody.appendChild(fila);

    totalTareas++;
    updateTaskCount();
}

// ============================================
// 3.1 MOSTRAR USUARIOS (DB.JSON)
// ============================================
function mostrarUsers(usuarios){
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

const Usuariosmostrar = async ()=>{
    const usuarios = await getTareas(); // Consulta a la BD
    usuarios.forEach(i => mostrarUsers(i));
}
Usuariosmostrar();

// ============================================
// 3.2 CARGAR TAREAS DEL USUARIO (RF-01)
// ============================================
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

// ============================================
// 4. MANEJO DE EVENTOS
// ============================================

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

            // 3. Cargamos las tareas previas del usuario (RF-01)
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
        showError(taskTitleError, 'Ingresa el título de la tarea');
        isValid = false;
    }

    if (!isValidInput(descripcion)) {
        showError(taskDescriptionError, 'Ingresa la descripción de la tarea');
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
        alert('No se pudo registrar la tarea. Revisa la consola para más detalles.');
    }
}

// ============================================
// 5. REGISTRO DE EVENTOS
// ============================================

userForm.addEventListener('submit', handleUserSearch);
userDocInput.addEventListener('input', handleUserInput);

taskForm.addEventListener('submit', handleTaskSubmit);
taskTitle.addEventListener('input', handleTaskTitleInput);
taskDescription.addEventListener('input', handleTaskDescriptionInput);

// ============================================
// 6. INICIALIZACION
// ============================================

document.addEventListener('DOMContentLoaded', function () {
    updateTaskCount();
    console.log('✅ DOM completamente cargado');
    console.log('📝 Aplicacion de gestion de tareas iniciada');
});