export const vistaRegistrarTarea = () => {
  return `
    <section class="form-section">
        <div class="card">
            <h2 class="card__title">Registro de Tareas</h2>
            <form id="taskForm" class="form" novalidate>
                <fieldset id="taskFieldset" style="border: none; padding: 0; margin: 0;">
                    <div class="form__group">
                        <label for="taskTitle" class="form__label">Título de la tarea</label>
                        <input type="text" id="taskTitle" class="form__input" placeholder="Ingresa el título de la tarea" required>
                        <span class="form__error" id="taskTitleError"></span>
                    </div>
                    <div class="form__group">
                        <label for="taskDescription" class="form__label">Descripción de la tarea</label>
                        <textarea id="taskDescription" class="form__input form__textarea" placeholder="Describe la tarea detalladamente..." rows="3" required></textarea>
                        <span class="form__error" id="taskDescriptionError"></span>
                    </div>
                    <button type="submit" class="btn btn--primary" id="submitTaskBtn">
                        <span class="btn__text">Registrar Tarea</span>
                        <span class="btn__icon">➤</span>
                    </button>
                </fieldset>
            </form>
        </div>
    </section>
  `;
};