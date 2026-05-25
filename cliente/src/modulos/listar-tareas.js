export const vistaListarTareas = () => {
  return `
    <section class="messages-section">
        <div class="messages-header">
            <h2 class="messages-header__title">Tareas Registradas</h2>
            <span class="messages-header__count" id="taskCount">0 tareas</span>
        </div>
        <div class="table-container" style="overflow-x: auto; margin-top: 15px;">
            <table id="tasksTable" style="width: 100%; border-collapse: collapse; text-align: left; background-color: white; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                <thead>
                    <tr style="border-bottom: 2px solid #ddd; background-color: #f8f9fa;">
                        <th style="padding: 12px;">Usuario Asigned</th>
                        <th style="padding: 12px;">Título de Tarea</th>
                        <th style="padding: 12px;">Descripción</th>
                        <th style="padding: 12px;">Acciones</th>
                    </tr>
                </thead>
                <tbody id="tasksTableBody">
                    <tr id="emptyTasksRow">
                        <td colspan="4" style="text-align: center; padding: 20px; color: #666;">
                            No hay tareas registradas aún.
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </section>
  `;
};