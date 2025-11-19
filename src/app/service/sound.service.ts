import { Injectable } from '@angular/core';
import { Sound } from '../interfaces/sound.interface';
import { of } from 'rxjs'; // 'of' sirve para simular una respuesta asíncrona

@Injectable({
  providedIn: 'root'
})
export class SoundService {

  // DATOS FALSOS (MOCK DATA) - Esto es lo que usas tú ahora
  private sonidosMock: Sound[] = [
    {
      id: 1,
      titulo: 'Canto matutino',
      autor: 'Juan Pérez',
      imgUrl: 'assets/img/pajaro.jpg', // Asegúrate de tener alguna imagen de prueba
      audioUrl: 'assets/audio/test.mp3', // Pon un mp3 cualquiera en assets para probar
      categoria: 'Naturaleza'
    },
    {
      id: 2,
      titulo: 'Motor V8',
      autor: 'Ana G.',
      imgUrl: 'assets/img/coche.jpg',
      audioUrl: 'assets/audio/motor.mp3',
      categoria: 'Coches'
    }
  ];

  constructor() { }

  // Método para obtener sonidos (Simulando la API)
  getAllSounds() {
    return of(this.sonidosMock); 
  }

  // Método para buscar
  searchSounds(termino: string) {
    const filtrados = this.sonidosMock.filter(s => s.titulo.toLowerCase().includes(termino.toLowerCase()));
    return of(filtrados);
  }
}