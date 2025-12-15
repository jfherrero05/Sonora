import { Component, OnInit, OnDestroy } from '@angular/core';
import { SoundService } from '../service/sound.service';
import { Sound } from '../interfaces/sound.interface';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  listaSonidos: Sound[] = [];

  // Variables para el reproductor de audio
  audioActual: HTMLAudioElement | null = null;
  sonidoActualIndice: number = -1; // -1 indica que no hay sonido seleccionado
  estaReproduciendo: boolean = false;
  progresoActual: number = 0; // 0 a 100 para el slider

  // Listas para los carruseles (Mock Data)
  sonidosNaturaleza: Sound[] = [];
  sonidosInstrumentos: Sound[] = [];
  sonidosExtranos: Sound[] = [];

  constructor(private soundService: SoundService) {}

  ngOnInit() {
    this.soundService.getAllSounds().subscribe((datos: Sound[]) => {
      this.listaSonidos = datos;

      // Duplicar datos para simular carruseles llenos (Mock)
      this.sonidosNaturaleza = this.generarMockSounds(datos, 'Naturaleza', 6);
      this.sonidosInstrumentos = this.generarMockSounds(
        datos,
        'Instrumento',
        6
      );
      this.sonidosExtranos = this.generarMockSounds(datos, 'Extraño', 6);

      // Asegurar que la lista principal también tenga suficientes items para el demo
      if (this.listaSonidos.length > 0 && this.listaSonidos.length < 6) {
        const original = [...this.listaSonidos];
        while (this.listaSonidos.length < 6) {
          this.listaSonidos = [...this.listaSonidos, ...original];
        }
      }
    });
  }

  // Helper para generar mocks basados en los sonidos existentes o placeholders
  private generarMockSounds(
    base: Sound[],
    prefix: string,
    count: number
  ): Sound[] {
    let resultado: Sound[] = [];
    // Usar sonidos base si existen, sino crear ficticios
    if (base.length > 0) {
      for (let i = 0; i < count; i++) {
        // Ciclar sobre los sonidos base
        const sound = { ...base[i % base.length] };
        sound.titulo = `${prefix} ${i + 1}`; // Differentiate titles
        resultado.push(sound);
      }
    } else {
      // Fallback si no hay datos del servicio
      for (let i = 0; i < count; i++) {
        resultado.push({
          titulo: `${prefix} ${i + 1}`,
          audioUrl: '', // No playable
          imgUrl: '',
          _id: `mock-${prefix}-${i}`,
          id: i + 1000,
          autor: 'Sonora',
          categoria: prefix,
        } as Sound);
      }
    }
    return resultado;
  }

  moverCarrusel(direccion: 'izquierda' | 'derecha', contenedor: HTMLElement) {
    const scrollAmount = contenedor.clientWidth; // Mover una pantalla completa o ancho del contenedor
    const currentScroll = contenedor.scrollLeft;
    const maxScroll = contenedor.scrollWidth - contenedor.clientWidth;

    if (direccion === 'derecha') {
      if (currentScroll + 10 >= maxScroll) {
        // Tolerancia pequeña
        // Volver al inicio (Loop)
        contenedor.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        contenedor.scrollTo({
          left: currentScroll + scrollAmount,
          behavior: 'smooth',
        });
      }
    } else {
      // Izquierda
      if (currentScroll <= 0) {
        // Ir al final (Loop)
        contenedor.scrollTo({ left: maxScroll, behavior: 'smooth' });
      } else {
        contenedor.scrollTo({
          left: currentScroll - scrollAmount,
          behavior: 'smooth',
        });
      }
    }
  }

  ngOnDestroy() {
    this.detenerAudio();
  }

  toggleReproduccion(sonido: Sound, index: number) {
    if (this.sonidoActualIndice === index) {
      // Si es el mismo sonido, alternar play/pause
      if (this.estaReproduciendo) {
        this.pausarAudio();
      } else {
        this.reanudarAudio();
      }
    } else {
      // Es un sonido nuevo
      this.reproducirNuevoSonido(sonido, index);
    }
  }

  private reproducirNuevoSonido(sonido: Sound, index: number) {
    this.detenerAudio(); // Detener el anterior si existe

    this.audioActual = new Audio(sonido.audioUrl);
    this.audioActual.load();
    this.sonidoActualIndice = index;

    // Suscribirse a eventos del audio
    this.audioActual.ontimeupdate = () => {
      this.actualizarProgreso();
    };

    this.audioActual.onended = () => {
      this.estaReproduciendo = false;
      this.progresoActual = 0;
      this.sonidoActualIndice = -1; // Resetear o mantener seleccionado pero en pausa
      // Mejor mantener el índice para que el usuario pueda volver a dar play
      this.sonidoActualIndice = index;
      // Pero si terminó, el icono debería ser Play de nuevo
      this.estaReproduciendo = false;
    };

    this.audioActual
      .play()
      .then(() => {
        this.estaReproduciendo = true;
      })
      .catch((error) => {
        console.error('Error al reproducir audio:', error);
      });
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
      // Asegurar que el slider vuelva a 0 en la vista si es necesario,
      // aunque detenerAudio ya resetea progresoActual.
    }
  }

  replaySonido(sonido: Sound, index: number) {
    if (this.sonidoActualIndice === index && this.audioActual) {
      this.audioActual.currentTime = 0;
      if (!this.estaReproduciendo) {
        this.reanudarAudio();
      }
    } else {
      // Si no estaba sonando, empezar de nuevo
      this.reproducirNuevoSonido(sonido, index);
    }
  }

  private detenerAudio() {
    if (this.audioActual) {
      this.audioActual.pause();
      this.audioActual = null; // Limpiar referencia
      this.estaReproduciendo = false;
      this.progresoActual = 0;
      // No reseteamos sonidoActualIndice para que el usuario vea cuál estaba tocando,
      // pero si el usuario quiere "Stop" completo, quizás resetear índice es mejor.
      // Para "Stop" visual, resetear índice parece correcto.
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
