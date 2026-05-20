let onGuardarActual = null;

export function inicializarModalEdicion(showToast) {
    const modal = document.querySelector('#editTaskModal');
    const form = document.querySelector('#editTaskForm');
    const inputTitulo = document.querySelector('#editTaskTitle');
    const inputDescripcion = document.querySelector('#editTaskDescription');
    const btnCancelar = document.querySelector('#cancelEditTaskBtn');

    if (!modal || !form || !inputTitulo || !inputDescripcion || !btnCancelar) {
        console.error('No se encontraron elementos del modal de edicion');
        return;
    }

    btnCancelar.addEventListener('click', () => {
        modal.close();
    });

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const titulo = inputTitulo.value.trim();
        const descripcion = inputDescripcion.value.trim();

        if (!titulo && !descripcion) {
            showToast('El titulo y la descripcion no pueden estar vacios.', 'error');
            return;
        }
        if (!titulo) {
            showToast('El titulo no puede estar vacios.', 'error');
            return;
        }
        if (!descripcion) {
            showToast('La descripcion no puede estar vacia.', 'error');
            return;
        }

        if (!onGuardarActual) {
            showToast('No hay una funcion para guardar los cambios.', 'error');
            return;
        }

        try {
            await onGuardarActual({ titulo, descripcion });
            showToast('Tarea actualizada correctamente', 'success');
            modal.close();
        } catch (error) {
            console.error('Error al guardar cambios:', error);
            showToast('No se pudieron guardar los cambios.', 'error');
        }
    });
}

export function abrirModalEdicion({ tituloActual, descripcionActual, onGuardar }) {
    const modal = document.querySelector('#editTaskModal');
    const inputTitulo = document.querySelector('#editTaskTitle');
    const inputDescripcion = document.querySelector('#editTaskDescription');

    if (!modal || !inputTitulo || !inputDescripcion) {
        console.error('El modal de edicion no existe en el DOM');
        return;
    }

    inputTitulo.value = tituloActual;
    inputDescripcion.value = descripcionActual;
    onGuardarActual = onGuardar;

    modal.showModal();
}