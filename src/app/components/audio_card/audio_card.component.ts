import { Component, Input } from '@angular/core';
import { Audio } from '../../interfaces/audio.model';

@Component({
    selector: 'app-audio-card',
    templateUrl: './audio-card.component.html',
    styleUrls: ['./audio-card.component.scss']
})
export class AudioCardComponent {
    @Input() audio!: Audio;

    isPlaying: boolean = false;
    progreso: number = 0;

    toggleAudio(player: HTMLAudioElement) {
        if (player.paused) {
            player.play();
            this.isPlaying = true;
        } else {
            player.pause();
            this.isPlaying = false;
        }
    }

    actualizarProgreso(player: HTMLAudioElement) {
        if (player.duration) {
            this.progreso = (player.currentTime / player.duration) * 100;
        }
    }

    reiniciar(player: HTMLAudioElement) {
        player.currentTime = 0;
        player.play();
        this.isPlaying = true;
    }

    descargar() {
        const link = document.createElement('a');
        link.href = this.audio.url;
        link.download = this.audio.titulo;
        link.click();
    }
}