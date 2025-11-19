import { Component, OnInit } from '@angular/core';
// Asegúrate de que el archivo en la carpeta se llama 'sound.service.ts' (sin la s extra)
import { SoundService } from './service/sound.service';
import { Sound } from './interfaces/sound.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Sonora';

  // Variable para guardar los sonidos
  listaSonidos: Sound[] = [];

  constructor(private soundService: SoundService) {}

  ngOnInit() {
    // CORRECCIÓN AQUÍ: Añadimos el tipo (datos: Sound[]) explícitamente
    this.soundService.getAllSounds().subscribe((datos: Sound[]) => {
      this.listaSonidos = datos;
      console.log('¡Sonidos cargados!', this.listaSonidos);
    });
  }
}