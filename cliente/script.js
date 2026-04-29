/**
 * ============================================
 * EJERCICIO DE MANIPULACIÓN DEL DOM
 * ============================================
 * Objetivo: Búsqueda de usuarios y registro de tareas
 * Autor:
 * ============================================
 */

// ============================================
// 1. SELECCIÓN DE ELEMENTOS DEL DOM
// ============================================

// Búsqueda de usuarios
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

// Estado de la aplicación
let usuarioEncontrado = null;
let totalTareas = 0;

// ============================================
// 2. FUNCIONES AUXILIARES
// ============================================

function isValidInput(value) {
    return value.trim().length > 0;
}

function showError(errorElement, message) {
    errorElement.textContent = message;
}

function clearError(errorElement) {
    errorElement.textContent = '';
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

function agregarTareaATabla(usuario, titulo, descripcion) {
    const emptyRow = document.querySelector('#emptyTasksRow');
    if (emptyRow) {
        emptyRow.remove();
    }

    const fila = document.createElement('tr');
    fila.style.borderBottom = '1px solid #ddd';

    const celdaUsuario = document.createElement('td');
    celdaUsuario.textContent = usuario.nombre;
    celdaUsuario.style.padding = '12px';

    const celdaTitulo = document.createElement('td');
    celdaTitulo.textContent = titulo;
    celdaTitulo.style.padding = '12px';

    const celdaDescripcion = document.createElement('td');
    celdaDescripcion.textContent = descripcion;
    celdaDescripcion.style.padding = '12px';

    fila.appendChild(celdaUsuario);
    fila.appendChild(celdaTitulo);
    fila.appendChild(celdaDescripcion);

    tasksTableBody.appendChild(fila);

    totalTareas++;
    updateTaskCount();
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

        const user = users.find(
            u => String(u.documento).trim() === documento
        );

        if (user) {
            usuarioEncontrado = user;

            userInfoContainer.style.display = 'block';
            userInfoContainer.innerHTML =
                '<strong>Usuario encontrado:</strong><br>' +
                'Nombre: ' + user.nombre + '<br>' +
                'Documento: ' + user.documento;

            taskFieldset.disabled = false;
        } else {
            usuarioEncontrado = null;
            userInfoContainer.style.display = 'none';
            taskFieldset.disabled = true;
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

function handleTaskSubmit(event) {
    event.preventDefault();

    const titulo = taskTitle.value.trim();
    const descripcion = taskDescription.value.trim();

    clearTaskErrors();

    if (!usuarioEncontrado) {
        alert('Primero debes buscar un usuario');
        return;
    }

    if (!isValidInput(titulo)) {
        showError(taskTitleError, 'Ingresa el título de la tarea');
        return;
    }

    if (!isValidInput(descripcion)) {
        showError(taskDescriptionError, 'Ingresa la descripción de la tarea');
        return;
    }

    agregarTareaATabla(usuarioEncontrado, titulo, descripcion);

    taskForm.reset();
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
// 6. INICIALIZACIÓN
// ============================================

document.addEventListener('DOMContentLoaded', function () {
    taskFieldset.disabled = true;
    updateTaskCount();
    console.log('✅ DOM completamente cargado');
    console.log('📝 Aplicación de gestión de tareas iniciada');
});