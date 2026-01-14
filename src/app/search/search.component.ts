import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SoundService } from '../service/sound.service';
import { Sound } from '../interfaces/sound.interface';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit, OnDestroy {
  terminoBusqueda: string = '';
  listaSonidos: Sound[] = [];

  // Audio control logic
  audioActual: HTMLAudioElement | null = null;
  sonidoActualIndice: number = -1;
  estaReproduciendo: boolean = false;
  progresoActual: number = 0;

  constructor(
    private route: ActivatedRoute,
    private soundService: SoundService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.terminoBusqueda = params.get('termino') || '';
      this.cargarSonidos();
    });
  }

  cargarSonidos() {
    this.soundService.getAllSounds().subscribe((datos: Sound[]) => {
      // Filtrar por término de búsqueda (título) - case insensitive
      if (this.terminoBusqueda) {
        const termino = this.terminoBusqueda.toLowerCase();
        this.listaSonidos = datos.filter((sound) =>
          sound.titulo.toLowerCase().includes(termino)
        );
      } else {
        this.listaSonidos = [];
      }
    });
  }

  ngOnDestroy() {
    this.detenerAudio();
  }

  // Audio Playback Logic
  toggleReproduccion(sonido: Sound, index: number) {
    if (this.sonidoActualIndice === index) {
      if (this.estaReproduciendo) {
        this.pausarAudio();
      } else {
        this.reanudarAudio();
      }
    } else {
      this.reproducirNuevoSonido(sonido, index);
    }
  }

  private reproducirNuevoSonido(sonido: Sound, index: number) {
    this.detenerAudio();
    this.audioActual = new Audio(sonido.audioUrl);
    this.audioActual.load();
    this.sonidoActualIndice = index;

    this.audioActual.ontimeupdate = () => {
      this.actualizarProgreso();
    };

    this.audioActual.onended = () => {
      this.estaReproduciendo = false;
      this.progresoActual = 0;
      this.sonidoActualIndice = index;
      this.estaReproduciendo = false;
    };

    this.audioActual
      .play()
      .then(() => {
        this.estaReproduciendo = true;
      })
      .catch((error) => console.error('Error al reproducir audio:', error));
  }

  private pausarAudio() {
    if (this.audioActual) {
      this.audioActual.pause();
      this.estaReproduciendo = false;
    }
  }

  private reanudarAudio() {
    if (this.audioActual) {
      this.audioActual.play();
      this.estaReproduciendo = true;
    }
  }

  stopSonido(sonido: Sound, index: number) {
    if (this.sonidoActualIndice === index) {
      this.detenerAudio();
    }
  }

  replaySonido(sonido: Sound, index: number) {
    if (this.sonidoActualIndice === index && this.audioActual) {
      this.audioActual.currentTime = 0;
      if (!this.estaReproduciendo) {
        this.reanudarAudio();
      }
    } else {
      this.reproducirNuevoSonido(sonido, index);
    }
  }

  private detenerAudio() {
    if (this.audioActual) {
      this.audioActual.pause();
      this.audioActual = null;
      this.estaReproduciendo = false;
      this.progresoActual = 0;
      this.sonidoActualIndice = -1;
    }
  }

  private actualizarProgreso() {
    if (this.audioActual && this.audioActual.duration) {
      this.progresoActual =
        (this.audioActual.currentTime / this.audioActual.duration) * 100;
    }
  }

  buscarPosicion(evento: any) {
    const valor = evento.target.value;
    if (this.audioActual && this.audioActual.duration) {
      const tiempo = (valor / 100) * this.audioActual.duration;
      this.audioActual.currentTime = tiempo;
    }
  }
}
