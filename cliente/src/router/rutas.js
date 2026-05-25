// 1. Importamos tus módulos reales desde la carpeta modulos
import { vistaBuscarUsuario, usuariosControlador } from "../modulos/buscar-usuarios.js";
import { vistaListarTareas, tareasListarControlador } from "../modulos/listar-tareas.js";
import { vistaRegistrarTarea, tareasRegistrarControlador } from "../modulos/registrar-tareas.js";

export const rutas = [
  {
    ruta: '#/usuario',
    vista: vistaBuscarUsuario,
    controlador: usuariosControlador
  },
  {
    ruta: '#/tarea',
    vista: vistaListarTareas,
    controlador: tareasListarControlador
  },
  {
    ruta: '#/tarea/registrar', // Una ruta excelente para el formulario de agregar
    vista: vistaRegistrarTarea,
    controlador: tareasRegistrarControlador
  }
];