let onConfirmarEliminacion = null;

export function inicializarModalEliminar(showToast) {
    const modal = document.querySelector('#deleteTaskModal');
    const form = document.querySelector('#deleteTaskForm');
    const btnCancelar = document.querySelector('#cancelDeleteTaskBtn');
    const mensaje = document.querySelector('#deleteTaskMessage');

    if (!modal || !form || !btnCancelar || !mensaje) {
        console.error('No se encontraron elementos del modal de eliminacion');
        return;
    }

    btnCancelar.addEventListener('click', () => {
        modal.close();
    });

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        if (!onConfirmarEliminacion) {
            showToast('No hay accion de eliminacion configurada.', 'error');
            return;
        }

        try {
            await onConfirmarEliminacion();
            modal.close();
            showToast('Tarea eliminada correctamente.', 'success');
        } catch (error) {
            console.error('Error al eliminar:', error);
            showToast('No se pudo eliminar la tarea.', 'error');
        }
    });
}

export function abrirModalEliminar({ mensajeTexto, onConfirmar }) {
    const modal = document.querySelector('#deleteTaskModal');
    const mensaje = document.querySelector('#deleteTaskMessage');

    if (!modal || !mensaje) {
        console.error('El modal de eliminacion no existe en el DOM');
        return;
    }

    mensaje.textContent = mensajeTexto ?? '¿Estas seguro de que deseas eliminar esta tarea?';
    onConfirmarEliminacion = onConfirmar;

    modal.showModal();
}