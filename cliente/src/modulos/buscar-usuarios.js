// 1. LA VISTA: Retorna exclusivamente la estructura HTML
export const vistaBuscarUsuario = () => {
    return `
    <section class="form-section">
        <div class="card">
            <h2 class="card__title">Búsqueda de Usuario</h2>
            
            <form id="searchUserForm" class="form" novalidate>
                <div class="form__group">
                    <label for="searchUserId" class="form__label">Documento del Usuario</label>
                    <div style="display: flex; gap: 10px;">
                        <input type="text" id="searchUserId" class="form__input" placeholder="Ej: 123456" required>
                        <button type="submit" class="btn btn--primary" id="searchBtn">
                            <span class="btn__text">Buscar</span>
                        </button>
                    </div>
                    <span class="form__error" id="searchError" style="color: red; font-size: 0.85rem; display: block; margin-top: 5px;"></span>
                </div>
            </form>

            <div id="userInfoContainer" class="user-info" style="display: none; margin-top: 15px; padding: 15px; background-color: #f8f9fa; border-radius: 4px; border-left: 4px solid #0056b3;"></div>
        </div>
    </section>
  `;
};

// 2. EL CONTROLADOR: Maneja los eventos y la lógica del HTML de arriba
export const usuariosControlador = () => {
    const form = document.getElementById('searchUserForm');
    const inputId = document.getElementById('searchUserId');
    const errorSpan = document.getElementById('searchError');
    const infoContainer = document.getElementById('userInfoContainer');

    // Nos aseguramos de que el formulario exista en el DOM antes de escuchar el evento
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault(); // Evita que la SPA se recargue

        const documento = inputId.value.trim();
        errorSpan.textContent = ''; // Limpiar errores anteriores
        infoContainer.style.display = 'none'; // Ocultar resultados anteriores

        // Validación simple
        if (documento === '') {
            errorSpan.textContent = 'Por favor, ingrese un número de documento.';
            return;
        }

        try {
            // Aquí puedes hacer la petición real a tu API de json-server o Express:
            // const respuesta = await fetch(`http://localhost:3000/usuarios/${documento}`);
            // if(!respuesta.ok) throw new Error();
            // const usuario = await respuesta.json();

            // --- Simulación de búsqueda para pruebas ---
            if (documento === "123456") {
                const usuarioSimulado = { nombre: "Juan Manuel Rodríguez", rol: "Aprendiz ADSO", estado: "Activo" };

                // Pintamos los datos dentro del contenedor que estaba oculto
                infoContainer.innerHTML = `
                    <p style="margin: 0 0 5px 0;"><strong>Usuario Encontrado:</strong></p>
                    <p style="margin: 2px 0;">ID: ${documento}</p>
                    <p style="margin: 2px 0;">Nombre: ${usuarioSimulado.nombre}</p>
                    <p style="margin: 2px 0;">Programa: ${usuarioSimulado.rol}</p>
                    <p style="margin: 2px 0;">Estado: <span style="color: green; font-weight: bold;">${usuarioSimulado.estado}</span></p>
                `;
                infoContainer.style.display = 'block'; // Mostramos el contenedor
            } else {
                errorSpan.textContent = 'Usuario no encontrado en el sistema.';
            }
            // -------------------------------------------

        } catch (error) {
            errorSpan.textContent = 'Error al conectar con el servidor.';
        }
    });
};