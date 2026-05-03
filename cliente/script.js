import { postUsers } from "./metodos/index.js";

import { get } from "./helper/index.js";
import { getTareas } from "./metodos/index.js";
// ... los demás imports que ya tengas


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

/**
 * Seleccionamos los elementos del DOM que necesitamos manipular.
 * Usamos getElementById para obtener referencias a los elementos únicos.
 */
// Busqueda de usuarios 
const userForm = document.getElementById('searchUserForm');
const userDocInput = document.getElementById('searchUserId');
const userDocError = document.getElementById('searchError');

// ID del apartado para mostrar usuarios
const mostrarUsuarios = document.getElementById('mostrarUsuarios');

// Formulario
const messageForm = document.getElementById('messageForm');

// Campos de entrada
const userNameInput = document.getElementById('userName');
const userMessageInput = document.getElementById('userMessage');

// Botón de envío
const submitBtn = document.getElementById('submitBtn');

// Elementos para mostrar errores
const userNameError = document.getElementById('userNameError');
const userMessageError = document.getElementById('userMessageError');

// Contenedor donde se mostrarán los mensajes
const messagesContainer = document.getElementById('messagesContainer');

// Estado vacío (mensaje que se muestra cuando no hay mensajes)
const emptyState = document.getElementById('emptyState');

// Contador de mensajes
const messageCount = document.getElementById('messageCount');

// Variable para llevar el conteo de mensajes
let totalMessages = 0;

// Usamos selectores de ID (#) y clases (.)
const searchUserForm = document.querySelector('#searchUserForm');
const searchUserId = document.querySelector('#searchUserId');
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

function mostrarUsers(usuarios){
           // Crear elemento html (DOM) asignado a liID - Document
        const liDocument = document.createElement("div");
        // Usuario
        const Usuario = document.createElement("div");
    
        // Contenedor para el Documento y usuario
        const contenedor = document.createElement("div");
    
        contenedor.classList.add("containUser");
    
        liDocument.textContent = usuarios.documento;
        Usuario.textContent = usuarios.nombre;

        contenedor.appendChild(Usuario);
        contenedor.appendChild(liDocument);
        mostrarUsuarios.appendChild(contenedor)
}

const Usuariosmostrar = async ()=>{
    // usuarios
    const usuarios = await getTareas();
    
    
    usuarios.forEach(i =>{
        mostrarUsers(i);
    })
    // appendChild
    // textContent
    // createElement
    // classList
}
Usuariosmostrar()
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
    
        console.log('Respuesta JSON:', users);
    
        const user = users.find(
                u => String(u.documento).trim() === String(documento).trim()
        );
    
        if (user) {
                alert(`Usuario encontrado: ${user.nombre}`);
                console.log('Usuario encontrado:', user);
        } else {
                showError(userDocError, 'Usuario no encontrado');
            }
        } catch (error) {
            console.error('Error al conectar con el servidor:', error);
            showError(userDocError, 'Error al conectar con el servidor');
        }
    }
    
    function handleInputChange() {
        if (userDocInput.value.trim().length > 0) {
            clearError(userDocError);
        }
    }
    
    userForm.addEventListener('submit', handleUserSearch);
    userDocInput.addEventListener('input', handleInputChange);
    

/**
 * Maneja el evento de envío del formulario
 * @param {Event} event - Evento del formulario
 */
// function handleFormSubmit(event) {
    // TODO: Implementar el manejador del evento submit
    
    // PASO 1: Prevenir el comportamiento por defecto del formulario
    // Pista: event.preventDefault()
    
    // PASO 2: Validar el formulario
    // Si no es válido, detener la ejecución (return)
    
    // PASO 3: Obtener los valores de los campos
    
    // PASO 4: Crear el nuevo elemento de mensaje
    // Llamar a createMessageElement con los valores obtenidos
    
    // PASO 5: Limpiar el formulario
    // Pista: messageForm.reset()
    
    // PASO 6: Limpiar los errores
    
    // PASO 7: Opcional - Enfocar el primer campo para facilitar agregar otro mensaje
    // Pista: userNameInput.focus()
//}

/**
 * Limpia los errores cuando el usuario empieza a escribir
 */
//function handleInputChange() {
    // TODO: Implementar limpieza de errores al escribir
    // Esta función se ejecuta cuando el usuario escribe en un campo
    // Debe limpiar el error de ese campo específico
//}

async function handleFormSubmit(event) {
    event.preventDefault(); // Evita que la página se recargue

    // 1. Obtenemos los valores de los inputs que ya están declarados arriba
    const nombre = userNameInput.value;
    const documento = userMessageInput.value;

    // 2. Validación básica
    if (nombre.trim() === "" || documento.trim() === "") {
        alert("Por favor, completa todos los campos del registro.");
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