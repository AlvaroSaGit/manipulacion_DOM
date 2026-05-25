import { rutas } from "./rutas.js";

export const enrrutador = async (app) => {
  // 1. ruta por defecto si el usuario acaba de entrar a la raiz
  let hash = window.location.hash || '#/productos';

  // 2. buscamos la ruta en nuestro arreglo
  let rutaActual = rutas.find((ruta) => ruta.ruta === hash);
  // renderizamos la vista y ejecutamos el controlador
  app.innerHTML = rutaActual.vista();
  await rutaActual.controlador();
};