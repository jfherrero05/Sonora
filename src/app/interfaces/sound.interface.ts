// Esta interfaz define cómo debe ser el objeto 'Sound' para asegurar consistencia en toda la app.
export interface Sound {
  id: number;
  titulo: string;
  autor: string;
  // Aquí almaceno la ruta de la imagen que mostraré en la tarjeta del sonido.
  imgUrl: string;
  // Esta es la ruta al archivo de audio real que se reproducirá.
  audioUrl: string;
  // Restrinjo las categorías a una lista fija de opciones válidas.
  categoria: 'Naturaleza' | 'Instrumentos' | 'Coches' | 'Música' | 'Otros';
  duracion?: number;
}
