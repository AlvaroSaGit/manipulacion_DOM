import { categoriasControlador } from "../modulos/categorias/categoriasControlador.js";
import { categorias } from "../modulos/categorias/listarCategorias.js";
import { vistaProductos, productosControlador } from "../modulos/productos";

export const rutas = [
  {
    ruta: '#/productos',
    vista: vistaProductos,
    controlador: productosControlador
  },
  {
    ruta: '#/productos/editar',
    vista: vistaProductos,
    controlador: productosControlador
  },
  {
    ruta: '#/categorias',
    vista: categorias,
    controlador: categoriasControlador
  }
];