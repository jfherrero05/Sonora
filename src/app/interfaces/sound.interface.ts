export interface Sound {
  id: number;
  titulo: string;
  autor: string;
  imgUrl: string;   // Ruta de la imagen de portada
  audioUrl: string; // Ruta del archivo mp3
  categoria: 'Naturaleza' | 'Instrumentos' | 'Coches' | 'Música' | 'Otros';
  duracion?: number; // Opcional
}