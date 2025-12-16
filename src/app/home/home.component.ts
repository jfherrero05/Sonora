import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { SoundService } from '../service/sound.service';
import { Sound } from '../interfaces/sound.interface';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  listaSonidos: Sound[] = [];

  // Aquí almaceno la referencia al elemento de audio HTML5 para poder controlarlo (play, pausa, volumen).
  audioActual: HTMLAudioElement | null = null;
  // Indico qué sonido de la lista está sonando actualmente (-1 significa ninguno).
  sonidoActualIndice: number = -1;
  estaReproduciendo: boolean = false;
  // Este valor (0-100) lo uso para mover la barra de progreso visualmente.
  progresoActual: number = 0;

  // Estas listas separadas me sirven para organizar los sonidos en los distintos carruseles de la portada.
  sonidosNaturaleza: Sound[] = [];
  sonidosInstrumentos: Sound[] = [];
  sonidosExtranos: Sound[] = [];

  // Variable para el buscador
  terminoBusqueda: string = '';

  constructor(private soundService: SoundService, private router: Router) {}

  ngOnInit() {
    // Al cargar el componente, pido todos los sonidos disponibles al servicio.
    this.soundService.getAllSounds().subscribe((datos: Sound[]) => {
      this.listaSonidos = datos;

      // Como la base de datos puede tener pocos datos al principio, genero datos duplicados
      // para rellenar visualmente los carruseles y que la web se vea completa.
      this.sonidosNaturaleza = this.generarMockSounds(datos, 'Naturaleza', 6);
      this.sonidosInstrumentos = this.generarMockSounds(
        datos,
        'Instrumento',
        6
      );
      this.sonidosExtranos = this.generarMockSounds(datos, 'Extraño', 6);

      // Si la lista principal es muy corta, también la relleno artificialmente para las pruebas del diseño.
      if (this.listaSonidos.length > 0 && this.listaSonidos.length < 6) {
        const original = [...this.listaSonidos];
        while (this.listaSonidos.length < 6) {
          this.listaSonidos = [...this.listaSonidos, ...original];
        }
      }
    });
  }

  // Esta función auxiliar me ayuda a crear datos de relleno si no tengo suficientes sonidos reales.
  private generarMockSounds(
    base: Sound[],
    prefix: string,
    count: number
  ): Sound[] {
    let resultado: Sound[] = [];
    // Si tengo sonidos base, los clono cambiando el título.
    if (base.length > 0) {
      for (let i = 0; i < count; i++) {
        const sound = { ...base[i % base.length] };
        sound.titulo = `${prefix} ${i + 1}`;
        resultado.push(sound);
      }
    } else {
      // Si no tengo nada, creo objetos vacíos para que no se rompa la interfaz.
      for (let i = 0; i < count; i++) {
        resultado.push({
          titulo: `${prefix} ${i + 1}`,
          audioUrl: '',
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

  // Controlo el movimiento horizontal de los carruseles cuando el usuario pulsa las flechas.
  moverCarrusel(direccion: 'izquierda' | 'derecha', contenedor: HTMLElement) {
    const scrollAmount = contenedor.clientWidth;
    const currentScroll = contenedor.scrollLeft;
    const maxScroll = contenedor.scrollWidth - contenedor.clientWidth;

    if (direccion === 'derecha') {
      if (currentScroll + 10 >= maxScroll) {
        // Si llego al final, vuelvo al principio suavemente (efecto loop).
        contenedor.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        contenedor.scrollTo({
          left: currentScroll + scrollAmount,
          behavior: 'smooth',
        });
      }
    } else {
      // Movimiento hacia la izquierda.
      if (currentScroll <= 0) {
        // Si estoy al principio, salto al final.
        contenedor.scrollTo({ left: maxScroll, behavior: 'smooth' });
      } else {
        contenedor.scrollTo({
          left: currentScroll - scrollAmount,
          behavior: 'smooth',
        });
      }
    }
  }

  // Cuando el componente se destruye (ej. cambio de página), me aseguro de parar el audio.
  ngOnDestroy() {
    this.detenerAudio();
  }

  // Lógica principal para el botón de Play/Pausa de cada tarjeta.
  toggleReproduccion(sonido: Sound, index: number) {
    if (this.sonidoActualIndice === index) {
      // Si el usuario clica en el mismo sonido que ya suena, alterno entre pausa y reanudar.
      if (this.estaReproduciendo) {
        this.pausarAudio();
      } else {
        this.reanudarAudio();
      }
    } else {
      // Si clica en otro diferente, cargo y reproduzco ese nuevo sonido.
      this.reproducirNuevoSonido(sonido, index);
    }
  }

  private reproducirNuevoSonido(sonido: Sound, index: number) {
    this.detenerAudio(); // Paro lo que sea que estuviera sonando antes.

    this.audioActual = new Audio(sonido.audioUrl);
    this.audioActual.load();
    this.sonidoActualIndice = index;

    // Actualizo la barra de progreso conforme avanza el audio.
    this.audioActual.ontimeupdate = () => {
      this.actualizarProgreso();
    };

    // Cuando termina el audio, reseteo el estado visual pero mantengo el índice por si quieren darle a replay.
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

  // Función para el botón de Stop (cuadrado).
  stopSonido(sonido: Sound, index: number) {
    if (this.sonidoActualIndice === index) {
      this.detenerAudio();
    }
  }

  // Función para reiniciar el audio desde el principio (botón Replay).
  replaySonido(sonido: Sound, index: number) {
    if (this.sonidoActualIndice === index && this.audioActual) {
      this.audioActual.currentTime = 0;
      if (!this.estaReproduciendo) {
        this.reanudarAudio();
      }
    } else {
      // Si no estaba sonando, lo inicio desde cero.
      this.reproducirNuevoSonido(sonido, index);
    }
  }

  // Limpieza completa del objeto de audio.
  private detenerAudio() {
    if (this.audioActual) {
      this.audioActual.pause();
      this.audioActual = null;
      this.estaReproduciendo = false;
      this.progresoActual = 0;
      this.sonidoActualIndice = -1;
    }
  }

  // Calculo el porcentaje de reproducción para mover el slider.
  private actualizarProgreso() {
    if (this.audioActual && this.audioActual.duration) {
      this.progresoActual =
        (this.audioActual.currentTime / this.audioActual.duration) * 100;
    }
  }

  // Permito al usuario saltar a una parte específica del audio moviendo el slider.
  buscarPosicion(evento: any) {
    const valor = evento.target.value;
    if (this.audioActual && this.audioActual.duration) {
      const tiempo = (valor / 100) * this.audioActual.duration;
      this.audioActual.currentTime = tiempo;
    }
  }
  buscarSonidos() {
    if (this.terminoBusqueda.trim()) {
      this.router.navigate(['/buscar', this.terminoBusqueda.trim()]);
    }
  }
}
