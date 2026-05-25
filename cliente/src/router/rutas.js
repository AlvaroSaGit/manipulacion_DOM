import { categoriasControlador } from "../modulos/categorias/categoriasControlador.js";
import { categorias } from "../modulos/categorias/listarCategorias.js";
import { vistaProductos, productosControlador } from "../modulos/productos";

export const rutas = [
  {
    ruta: '#/usuario',
    vista: vistaProductos,
    controlador: productosControlador
  },
  {
    ruta: '#/tarea',
    vista: vistaProductos,
    controlador: productosControlador
  },
  {
    ruta: '#/usuario/editar',
    vista: categorias,
    controlador: categoriasControlador
  },
  {
    ruta: '#/tarea/editar',
    vista: categorias,
    controlador: categoriasControlador
  }
];