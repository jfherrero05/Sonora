import { Injectable } from '@angular/core';
import { Sound } from '../interfaces/sound.interface';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SoundService {
  // Defino estos datos de prueba (Mock Data) para simular la respuesta que vendría del backend.
  private sonidosMock: Sound[] = [
    {
      id: 1,
      titulo: 'Canto matutino',
      autor: 'Juan Pérez',
      imgUrl: 'assets/img/pajaro.jpg',
      audioUrl: 'assets/audio/test.mp3',
      categoria: 'Naturaleza',
    },
    {
      id: 2,
      titulo: 'Motor V8',
      autor: 'Ana G.',
      imgUrl: 'assets/img/coche.jpg',
      audioUrl: 'assets/audio/motor.mp3',
      categoria: 'Coches',
    },
  ];

  constructor() {}

  // Simulo una llamada a la API que me devuelve todos los sonidos disponibles.
  // Uso 'of' para devolver un Observable, tal como lo haría HttpClient.
  getAllSounds() {
    return of(this.sonidosMock);
  }

  // Implemento una búsqueda sencilla filtrando el array local por el título del sonido.
  searchSounds(termino: string) {
    const filtrados = this.sonidosMock.filter((s) =>
      s.titulo.toLowerCase().includes(termino.toLowerCase())
    );
    return of(filtrados);
  }
}
